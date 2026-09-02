/* ===========================
   SYSTEM CACHE & STORAGE MANAGER
=========================== */

window.CDGStorage = {
  getSettings: function() {
    try {
      let saved = localStorage.getItem("CDG_APP_SETTINGS");
      let parsed = saved ? JSON.parse(saved) : {};
      return { ...window.CDG_SETTINGS_DEFAULTS, ...parsed };
    } catch (e) {
      return { ...window.CDG_SETTINGS_DEFAULTS };
    }
  },

  saveSettings: function(patch) {
    try {
      let current = this.getSettings();
      let updated = { ...current, ...patch };
      localStorage.setItem("CDG_APP_SETTINGS", JSON.stringify(updated));
      if (patch.theme) {
        localStorage.forceColorScheme = patch.theme;
      }
      return updated;
    } catch (e) {
      return null;
    }
  },

  getCache: function(key) {
    try {
      let item = localStorage.getItem("CDG_CACHE_" + key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },

  setCache: function(key, val) {
    try {
      localStorage.setItem("CDG_CACHE_" + key, JSON.stringify(val));
    } catch (e) {}
  },

  clearCache: function(key) {
    try {
      localStorage.removeItem("CDG_CACHE_" + key);
    } catch (e) {}
  },

  initPersistentStorage: async function() {
    if (typeof window !== "undefined" && !window.StorageType) {
      window.StorageType = { persistent: "persistent", temporary: "temporary" };
    }
    if (typeof navigator !== "undefined" && navigator.storage && typeof navigator.storage.persist === "function") {
      try {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
          await navigator.storage.persist();
        }
      } catch (e) {}
    }
  }
};

// Sync storage changes instantly across multiple browser tabs
window.addEventListener("storage", function(event) {
  if (event.key === "CDG_APP_SETTINGS" || event.key === "forceColorScheme") {
    let currentScheme = window.getCurrentColorScheme();
    window.setColorScheme(currentScheme);
  }
});

/* ===========================
   THEME MANAGEMENT (DEFAULT DARK)
=========================== */

window.toggleManualDarkMode = function() {
  let newColorScheme = (window.getCurrentColorScheme() === "dark" ? "light" : "dark");
  window.CDGStorage.saveSettings({ theme: newColorScheme });
  window.setColorScheme(newColorScheme);
};

window.getCurrentColorScheme = function() {
  let settings = window.CDGStorage.getSettings();
  if (settings && settings.theme) {
    return settings.theme;
  }
  if (localStorage.forceColorScheme !== undefined) {
    return localStorage.forceColorScheme;
  }
  return "dark";
};

window.setColorScheme = function(scheme) {
  let targetScheme = (scheme === "light" || scheme === "dark") ? scheme : "dark";
  
  let darkModeBtn = document.querySelector("#darkModeBtn");
  if (darkModeBtn) darkModeBtn.innerHTML = (targetScheme === "dark" ? '<i class="bi bi-brightness-high-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>');
  
  document.documentElement.setAttribute("data-theme", targetScheme);
  document.documentElement.classList.remove("t-dark", "t-light");
  document.documentElement.classList.add(targetScheme === "dark" ? "t-dark" : "t-light");
};

/* ===========================
   RESPONSE ACTION TOOLBAR (ICON ONLY)
=========================== */

window.renderResponseToolbar = function(targetId, retryFnName) {
  let targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  let existingToolbar = targetEl.parentNode.querySelector(`.ai-text-response-buttons-wrapper[data-for="${targetId}"]`);
  if (existingToolbar) existingToolbar.remove();

  if (!targetEl.innerText.trim()) return;

  let toolbar = document.createElement("div");
  toolbar.className = "ai-text-response-buttons-wrapper";
  toolbar.setAttribute("data-for", targetId);
  toolbar.innerHTML = `
    <button class="c-button c-button--icon c-button--sm" title="Clear" onclick="clearOutput('${targetId}')"><i class="bi bi-trash-fill"></i></button>
    <button class="c-button c-button--icon c-button--sm" title="Copy" onclick="copyOutput('${targetId}', this)"><i class="bi bi-clipboard"></i></button>
    <button class="c-button c-button--icon c-button--sm" title="Export Markdown" onclick="exportAsMarkdown()"><i class="bi bi-download"></i></button>
    <button class="c-button c-button--icon c-button--sm" title="Retry" onclick="retryOutput('${retryFnName}')"><i class="bi bi-arrow-clockwise"></i></button>
  `;

  targetEl.parentNode.insertBefore(toolbar, targetEl.nextSibling);
};

window.clearOutput = function(targetId) {
  let targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.innerHTML = "";
    targetEl.contentEditable = "false";
  }
  let toolbar = document.querySelector(`.ai-text-response-buttons-wrapper[data-for="${targetId}"]`);
  if (toolbar) toolbar.remove();
  window.CDGStorage.clearCache(targetId);
};

window.clearSection = function(type) {
  if (type === "desc") {
    window.clearOutput("outputEl");
    let customEl = document.getElementById("customFeaturesEl");
    if (customEl) {
      customEl.value = "";
      window.CDGStorage.saveSettings({ customFeatures: "" });
      localStorage.customFeatures = "";
    }
    let btn = document.getElementById("generateBtn");
    if (btn) btn.innerHTML = '<i class="bi bi-stars"></i> generate description';
  } else if (type === "behavior") {
    window.clearOutput("behaviorOutputEl");
    let customEl = document.getElementById("customBehaviorFeaturesEl");
    if (customEl) {
      customEl.value = "";
      window.CDGStorage.saveSettings({ customBehaviorFeatures: "" });
      localStorage.customBehaviorFeatures = "";
    }
    let btn = document.getElementById("generateBehaviorBtn");
    if (btn) btn.innerHTML = '<i class="bi bi-stars"></i> generate behavior examples';
  } else if (type === "scenario") {
    window.clearOutput("scenarioOutputEl");
    let customEl = document.getElementById("customScenarioFeaturesEl");
    if (customEl) {
      customEl.value = "";
      window.CDGStorage.saveSettings({ customScenarioFeatures: "" });
      localStorage.customScenarioFeatures = "";
    }
    let btn = document.getElementById("generateScenarioBtn");
    if (btn) btn.innerHTML = '<i class="bi bi-stars"></i> generate scenario description';
  } else if (type === "roleplayStart") {
    window.clearOutput("roleplayStartOutputEl");
    let customEl = document.getElementById("customRoleplayStartFeaturesEl");
    if (customEl) {
      customEl.value = "";
      window.CDGStorage.saveSettings({ customRoleplayStartFeatures: "" });
      localStorage.customRoleplayStartFeatures = "";
    }
    let btn = document.getElementById("generateRoleplayStartBtn");
    if (btn) btn.innerHTML = '<i class="bi bi-stars"></i> generate roleplay start';
  }
};

window.clearAllContent = function() {
  if (!confirm("Are you sure you want to clear all generated content, custom notes, and selected tags?")) return;
  
  window.clearSection("desc");
  window.clearSection("behavior");
  window.clearSection("scenario");
  window.clearSection("roleplayStart");

  if (window.toneSelector) {
    window.toneSelector.selectedTags = [];
    window.toneSelector.render();
    window.toneSelector.onChange([]);
  }
  if (window.worldSettingSelector) {
    window.worldSettingSelector.selectedTags = [];
    window.worldSettingSelector.render();
    window.worldSettingSelector.onChange([]);
  }
};

window.copyOutput = function(targetId, btnEl) {
  let targetEl = document.getElementById(targetId);
  if (!targetEl) return;
  
  let text = targetEl.innerText || targetEl.textContent;
  navigator.clipboard.writeText(text).then(() => {
    let orig = btnEl.innerHTML;
    btnEl.innerHTML = '<i class="bi bi-check-lg"></i>';
    setTimeout(() => { btnEl.innerHTML = orig; }, 1500);
  }).catch(() => {
    alert("Failed to copy text.");
  });
};

window.toggleEditOutput = function(targetId, btnEl) {
  let targetEl = document.getElementById(targetId);
  if (!targetEl) return;
  
  let isEditing = targetEl.isContentEditable;
  if (isEditing) {
    targetEl.contentEditable = "false";
    targetEl.classList.remove("is-editing");
    btnEl.innerHTML = '<i class="bi bi-pencil-square"></i>';
    btnEl.classList.remove("c-button--active");
    window.CDGStorage.setCache(targetId, targetEl.innerHTML);
  } else {
    targetEl.contentEditable = "true";
    targetEl.classList.add("is-editing");
    targetEl.focus();
    btnEl.innerHTML = '<i class="bi bi-floppy-fill"></i>';
    btnEl.classList.add("c-button--active");
  }
};

window.retryOutput = function(retryFnName) {
  if (typeof window[retryFnName] === "function") {
    window[retryFnName]();
  }
};

/* ===========================
   STORAGE UPDATER ENGINE
=========================== */

window.initStorageUpdaterEngine = function() {
  const outputIds = ["outputEl", "behaviorOutputEl", "scenarioOutputEl", "roleplayStartOutputEl"];
  const debounceTimers = {};

  function updateCache(id) {
    let el = document.getElementById(id);
    if (!el) return;
    let html = el.innerHTML.trim();
    if (html) {
      window.CDGStorage.setCache(id, html);
    } else {
      window.CDGStorage.clearCache(id);
    }
  }

  function debouncedUpdateCache(id) {
    if (debounceTimers[id]) clearTimeout(debounceTimers[id]);
    debounceTimers[id] = setTimeout(() => {
      updateCache(id);
    }, 400);
  }

  outputIds.forEach(id => {
    let el = document.getElementById(id);
    if (!el) return;

    let observer = new MutationObserver(() => {
      debouncedUpdateCache(id);
    });

    observer.observe(el, {
      childList: true,
      characterData: true,
      subtree: true
    });

    el.addEventListener("input", () => debouncedUpdateCache(id));
    el.addEventListener("blur", () => updateCache(id));
  });
};

/* ===========================
   MARKDOWN EXPORT SYSTEM
=========================== */

window.htmlToMarkdown = function(html) {
  if (!html) return "";
  let temp = document.createElement("div");
  temp.innerHTML = html;

  let toolbars = temp.querySelectorAll(".c-response-toolbar, .ai-text-response-buttons-wrapper");
  toolbars.forEach(tb => tb.remove());

  // Replace <b> / <strong> with plain text (remove bolding)
  let bolds = temp.querySelectorAll("b, strong");
  bolds.forEach(b => {
    let t = b.textContent.trim();
    b.replaceWith(t);
  });

  for (let i = 1; i <= 6; i++) {
    let headers = temp.querySelectorAll("h" + i);
    headers.forEach(h => {
      let hashes = "#".repeat(i);
      h.textContent = `\n\n${hashes} ${h.textContent.trim()}\n\n`;
    });
  }

  let brs = temp.querySelectorAll("br");
  brs.forEach(br => br.replaceWith("\n"));

  let text = temp.innerText || temp.textContent || "";
  text = text.replace(/\*\*(.*?)\*\*/g, "$1");
  return text.replace(/\n{3,}/g, "\n\n").trim();
};

window.exportAsMarkdown = function() {
  let dateStr = new Date().toISOString().split("T")[0];
  let blocks = [];

  function formatTags(selectorObj, title) {
    if (!selectorObj || !selectorObj.selectedTags || selectorObj.selectedTags.length === 0) return "";
    let items = selectorObj.selectedTags.map(tagKey => {
      let info = selectorObj.findTagInfo ? selectorObj.findTagInfo(tagKey) : null;
      let promptText = info ? (info.prompt || info.description || info.label) : null;
      if (promptText) {
        return `${tagKey} (${promptText})`;
      }
      return tagKey;
    });
    return `${title} = ${items.join(", ")}.`;
  }

  // 1. Tones & World Settings (No start time, title header, or bolding)
  let toneHeader = formatTags(window.toneSelector, "Roleplay Tone");
  let worldHeader = formatTags(window.worldSettingSelector, "World Settings");

  let headerLines = [];
  if (toneHeader) headerLines.push(toneHeader);
  if (worldHeader) headerLines.push(worldHeader);
  if (headerLines.length > 0) {
    blocks.push(headerLines.join("\n"));
  }

  // 2. Description (Character Profile - # Description)
  let descOutput = document.getElementById("outputEl");
  let descText = descOutput ? window.htmlToMarkdown(descOutput.innerHTML) : "";
  if (descText) {
    blocks.push(`# Description\n\n${descText}`);
  }

  // 3. Scenario (# Scenario)
  let scenarioOutput = document.getElementById("scenarioOutputEl");
  let scenarioText = scenarioOutput ? window.htmlToMarkdown(scenarioOutput.innerHTML) : "";
  if (scenarioText) {
    blocks.push(`# Scenario\n\n${scenarioText}`);
  }

  // 4. Roleplay Start (# Roleplay Start)
  let roleplayOutput = document.getElementById("roleplayStartOutputEl");
  let roleplayText = roleplayOutput ? window.htmlToMarkdown(roleplayOutput.innerHTML) : "";
  if (roleplayText) {
    blocks.push(`# Roleplay Start\n\n${roleplayText}`);
  }

  // 5. Behavior Examples (# Behavior Examples)
  let behaviorOutput = document.getElementById("behaviorOutputEl");
  let behaviorText = behaviorOutput ? window.htmlToMarkdown(behaviorOutput.innerHTML) : "";
  if (behaviorText) {
    blocks.push(`# Behavior Examples\n\n${behaviorText}`);
  }

  if (blocks.length === 0) {
    alert("There is no generated content to export yet! Please generate a description or scenario first.");
    return;
  }

  let fullContent = blocks.join("\n\n");

  let nameMatch = fullContent.match(/(?:Name|Title)\s*[:=]\s*([^\n\r<]+)/i);
  let charName = (nameMatch && nameMatch[1]) ? nameMatch[1].trim().replace(/[^a-zA-Z0-9_-]/g, "_") : "roleplay_export";
  let filename = `${charName}_${dateStr}.txt`;

  let blob = new Blob([fullContent], { type: "text/markdown;charset=utf-8" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/* ===========================
   CHAT COMMENTS SYSTEM (CUSTOM ENGINE)
=========================== */

(function() {
  // Global State for Chat Engine
  window.__chatCommentsMap = new Map();
  window.__chatCommentsList = [];
  window.__chatReactionStore = new Map(); // msgId -> Map(emoji -> Set(userIds))
  window.__chatLoadMoreBtn = null;
  window.__chatPendingReply = null;
  window.__chatCurrentUserId = localStorage.getItem("CDG_CHAT_USER_ID") || null;
  window.__chatMainInstance = null;
  window.__chatReactionBus = null;

  // Custom Emoji Dictionary
  const CUSTOM_EMOJIS = {
    "blob_cheer": "https://user-uploads.perchance.org/file/e60fe5fe6bc120baea423086eb293b6e.png",
    "blob_cat": "https://user-uploads.perchance.org/file/ca7f884ba6ae9ae6b8f36cbbbe842880.png",
    "blob_heart": "https://user-uploads.perchance.org/file/71c69e25d6061328ae92ca365287f34c.png",
    "pepe_popcorn": "https://user-uploads.perchance.org/file/ff1c4f526ebecad1bc4b5b7367fc9ff4.png",
    "cat_sparkles": "https://user-uploads.perchance.org/file/a014eb31a89cbe97f565fe6dae0aa62f.png"
  };

  const QUICK_REACTIONS = ["👍", "❤️", "🔥", "😂", "🎉", "🚀", "👀", "✨", "💯", "💖", "👏", "🤔", "💀", "🙌", "🥳", "🌟"];

  const AVATAR_COLORS = ["#5865F2", "#57F287", "#FEE75C", "#EB459E", "#ED4245", "#00B0F4", "#9B59B6", "#E67E22"];

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Helper: Deterministic Hash for Avatar Color
  function getAvatarColor(identifier) {
    let hash = 0;
    const str = String(identifier || "anon");
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
  }

  // Helper: Format Relative Time
  function formatRelativeTime(epochMs) {
    if (!epochMs) return "just now";
    const now = Date.now();
    const diffSec = Math.floor((now - epochMs) / 1000);
    if (diffSec < 45) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    
    const d = new Date(epochMs);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffSec < 172800) return `Yesterday at ${timeStr}`;
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeStr}`;
  }

  // Helper: Parse Message (Quote Blocks, URLs, Emojis)
  function parseMessageText(rawText) {
    if (!rawText) return { quote: null, html: "" };
    
    let text = String(rawText);
    let quote = null;

    // Check for quote reply header: "> @Nickname — snippet...\nActual text"
    const quoteMatch = text.match(/^>\s*@([^\n—–-]+)(?:[—–-]\s*([^\n]*))?\n([\s\S]*)$/);
    if (quoteMatch) {
      quote = {
        author: quoteMatch[1].trim(),
        snippet: quoteMatch[2] ? quoteMatch[2].trim() : ""
      };
      text = quoteMatch[3];
    }

    // Escape text safely
    let escaped = escapeHtml(text);

    // Linkify URLs
    escaped = escaped.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    // Parse custom emojis :code:
    escaped = escaped.replace(/:([a-zA-Z0-9_]+):/g, function(match, code) {
      if (CUSTOM_EMOJIS[code]) {
        return `<img class="c-chat-emoji" src="${CUSTOM_EMOJIS[code]}" alt=":${code}:" title=":${code}:">`;
      }
      return match;
    });

    // Replace newlines with <br>
    escaped = escaped.replace(/\n/g, "<br>");

    return { quote, html: escaped };
  }

  // Render a Single Message Row
  function renderMessageHtml(msg, isGrouped) {
    const parsed = parseMessageText(msg.message);
    const authorName = escapeHtml(msg.user?.nickname || msg.user?.visualId || "Anonymous");
    const avatarBg = getAvatarColor(msg.user?.id || authorName);
    const initials = (authorName.replace(/^[^a-zA-Z0-9]+/, "")[0] || "?").toUpperCase();
    const isAdmin = Boolean(msg.user?.isAdmin);
    const adminFlair = msg.user?.isAdmin ? (window.root?.commentOptions?.adminFlair || "👑 MOD") : "";

    const avatarHtml = msg.user?.avatarUrl
      ? `<img class="c-chat-avatar-img" src="${escapeHtml(msg.user.avatarUrl)}" alt="${authorName}">`
      : initials;

    // Quote snippet block if message is a reply
    const quoteHtml = parsed.quote ? `
      <div class="c-chat-reply-quote">
        <span class="c-chat-reply-quote-author">@${escapeHtml(parsed.quote.author)}</span>
        <span class="c-chat-reply-quote-text">${escapeHtml(parsed.quote.snippet)}</span>
      </div>
    ` : "";

    // Reaction pills
    const reactionPillsHtml = renderReactionPillsHtml(msg.id);

    if (isGrouped && !parsed.quote) {
      return `
        <div class="c-chat-msg is-grouped" id="chatMsg-${msg.id}" data-id="${msg.id}">
          <div class="c-chat-avatar-col"></div>
          <div class="c-chat-body-col">
            <div class="c-chat-text">${parsed.html}</div>
            <div class="c-chat-reactions" id="chatReactions-${msg.id}">${reactionPillsHtml}</div>
          </div>
          <div class="c-chat-actions-pill">
            <button class="c-chat-action-btn" title="Add Reaction" onclick="window.openChatReactionPicker('${msg.id}', this)">🙂</button>
            <button class="c-chat-action-btn" title="Reply" onclick="window.startChatReply('${msg.id}')">💬</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="c-chat-msg" id="chatMsg-${msg.id}" data-id="${msg.id}">
        <div class="c-chat-avatar-col">
          <div class="c-chat-avatar" style="background-color: ${avatarBg};">${avatarHtml}</div>
        </div>
        <div class="c-chat-body-col">
          <div class="c-chat-meta">
            <span class="c-chat-author ${isAdmin ? 'is-admin' : ''}">${authorName}</span>
            ${isAdmin ? `<span class="c-chat-badge-admin">${escapeHtml(adminFlair)}</span>` : ""}
            <span class="c-chat-time" data-time="${msg.time}">${formatRelativeTime(msg.time)}</span>
          </div>
          ${quoteHtml}
          <div class="c-chat-text">${parsed.html}</div>
          <div class="c-chat-reactions" id="chatReactions-${msg.id}">${reactionPillsHtml}</div>
        </div>
        <div class="c-chat-actions-pill">
          <button class="c-chat-action-btn" title="Add Reaction" onclick="window.openChatReactionPicker('${msg.id}', this)">🙂</button>
          <button class="c-chat-action-btn" title="Reply" onclick="window.startChatReply('${msg.id}')">💬</button>
        </div>
      </div>
    `;
  }

  // Render Reaction Pills for a Message
  function renderReactionPillsHtml(msgId) {
    const msgReactions = window.__chatReactionStore.get(msgId);
    if (!msgReactions || msgReactions.size === 0) return "";

    let html = "";
    const myId = window.__chatCurrentUserId || "me";

    msgReactions.forEach((usersSet, emoji) => {
      if (usersSet.size === 0) return;
      const hasReacted = usersSet.has(myId);
      let emojiDisplay = emoji;
      if (CUSTOM_EMOJIS[emoji.replace(/^:|:$/g, '')]) {
        const code = emoji.replace(/^:|:$/g, '');
        emojiDisplay = `<img src="${CUSTOM_EMOJIS[code]}" alt="${emoji}">`;
      }

      html += `
        <button class="c-chat-reaction-pill ${hasReacted ? 'has-reacted' : ''}" onclick="window.toggleChatReaction('${msgId}', '${emoji}')" title="${usersSet.size} reaction(s)">
          <span class="c-chat-reaction-pill-emoji">${emojiDisplay}</span>
          <span class="c-chat-reaction-pill-count">${usersSet.size}</span>
        </button>
      `;
    });

    return html;
  }
  window.renderReactionPillsHtml = renderReactionPillsHtml;

  // Refresh Reaction Pills for a specific message or art card
  function updateMessageReactions(msgId) {
    const container = document.getElementById(`chatReactions-${msgId}`);
    if (container) {
      container.innerHTML = renderReactionPillsHtml(msgId);
    }
  }
  window.updateMessageReactions = updateMessageReactions;

  // Full Feed Re-render
  function renderFeed() {
    const feedEl = document.getElementById("chatFeedEl");
    if (!feedEl) return;

    if (window.__chatCommentsList.length === 0) {
      feedEl.innerHTML = `
        <div class="c-chat-empty-state">
          <div class="c-chat-empty-icon"><i class="bi bi-chat-heart"></i></div>
          <div class="c-chat-empty-text">Welcome to the channel!</div>
          <div class="c-chat-empty-subtext">This is the start of #general. Send a message to get the discussion started.</div>
        </div>
      `;
      return;
    }

    let html = "";
    if (window.__chatLoadMoreBtn) {
      html += `
        <div class="c-chat-load-more">
          <button class="c-chat-load-more-btn" onclick="window.__chatLoadMoreBtn?.click()"><i class="bi bi-arrow-up-circle"></i> Load older messages</button>
        </div>
      `;
    }

    for (let i = 0; i < window.__chatCommentsList.length; i++) {
      const current = window.__chatCommentsList[i];
      const prev = window.__chatCommentsList[i - 1];

      const isGrouped = prev &&
        prev.user?.id === current.user?.id &&
        (current.time - prev.time) < 300000 &&
        !current.message?.startsWith(">");

      html += renderMessageHtml(current, isGrouped);
    }

    feedEl.innerHTML = html;
    feedEl.scrollTop = feedEl.scrollHeight;
  }

  // Append a Single Message
  function appendMessageToFeed(msg) {
    const feedEl = document.getElementById("chatFeedEl");
    if (!feedEl) return;

    const emptyState = feedEl.querySelector(".c-chat-empty-state");
    if (emptyState) emptyState.remove();

    const prev = window.__chatCommentsList[window.__chatCommentsList.length - 2];
    const isGrouped = prev &&
      prev.user?.id === msg.user?.id &&
      (msg.time - prev.time) < 300000 &&
      !msg.message?.startsWith(">");

    const msgHtml = renderMessageHtml(msg, isGrouped);
    const temp = document.createElement("div");
    temp.innerHTML = msgHtml;
    const msgEl = temp.firstElementChild;
    if (msgEl) {
      feedEl.appendChild(msgEl);
      feedEl.scrollTop = feedEl.scrollHeight;
    }
  }

  // Hook Handlers
  window.__handleChatLoad = function(comments, extra) {
    if (extra && extra.loadMoreButton) {
      window.__chatLoadMoreBtn = extra.loadMoreButton;
    }
    if (Array.isArray(comments)) {
      comments.forEach(c => {
        if (c.byCurrentUser && c.user?.id) {
          window.__chatCurrentUserId = c.user.id;
          localStorage.setItem("CDG_CHAT_USER_ID", c.user.id);
        }
        window.__chatCommentsMap.set(c.id, c);
      });
      window.__chatCommentsList = Array.from(window.__chatCommentsMap.values()).sort((a, b) => a.time - b.time);
      renderFeed();
    }
  };

  window.__handleChatLoadMore = function(comments) {
    if (Array.isArray(comments)) {
      comments.forEach(c => {
        if (c.byCurrentUser && c.user?.id) {
          window.__chatCurrentUserId = c.user.id;
          localStorage.setItem("CDG_CHAT_USER_ID", c.user.id);
        }
        window.__chatCommentsMap.set(c.id, c);
      });
      window.__chatCommentsList = Array.from(window.__chatCommentsMap.values()).sort((a, b) => a.time - b.time);
      renderFeed();
    }
  };

  window.__handleChatIncoming = function(comment) {
    if (!comment || !comment.id) return;
    if (comment.byCurrentUser && comment.user?.id) {
      window.__chatCurrentUserId = comment.user.id;
      localStorage.setItem("CDG_CHAT_USER_ID", comment.user.id);
    }
    if (!window.__chatCommentsMap.has(comment.id)) {
      window.__chatCommentsMap.set(comment.id, comment);
      window.__chatCommentsList.push(comment);
      window.__chatCommentsList.sort((a, b) => a.time - b.time);
      appendMessageToFeed(comment);
    }
  };

  window.__handleChatBeforeSubmit = function(data) {
    if (window.__chatPendingReply) {
      const replyPrefix = `> @${window.__chatPendingReply.nickname} — ${window.__chatPendingReply.snippet.slice(0, 45)}\n`;
      window.cancelChatReply();
      return replyPrefix + (data.inputText || "");
    }
    return data.inputText;
  };

  // Reaction Bus Hook Handlers
  window.__handleReactionBusLoad = function(reactions) {
    if (Array.isArray(reactions)) {
      reactions.forEach(r => processReactionPayload(r));
    }
  };

  window.__handleReactionBusIncoming = function(reaction) {
    if (reaction) {
      processReactionPayload(reaction);
    }
  };

  function processReactionPayload(r) {
    const text = String(r.message || "").trim();
    const authorId = r.user?.id || (r.byCurrentUser ? (window.__chatCurrentUserId || "me") : "anon");
    
    // Parse "R:msgId:emoji" or "U:msgId:emoji"
    const match = text.match(/^([RU]):([^:]+):(.+)$/);
    if (!match) return;

    const action = match[1]; // 'R' = add, 'U' = undo
    const msgId = match[2];
    const emoji = match[3];

    if (!window.__chatReactionStore.has(msgId)) {
      window.__chatReactionStore.set(msgId, new Map());
    }
    const msgMap = window.__chatReactionStore.get(msgId);
    if (!msgMap.has(emoji)) {
      msgMap.set(emoji, new Set());
    }
    const userSet = msgMap.get(emoji);

    if (action === "R") {
      userSet.add(authorId);
    } else if (action === "U") {
      userSet.delete(authorId);
    }

    updateMessageReactions(msgId);
  }

  // Toggle Reaction Click
  window.toggleChatReaction = function(msgId, emoji) {
    const myId = window.__chatCurrentUserId || "me";
    if (!window.__chatReactionStore.has(msgId)) {
      window.__chatReactionStore.set(msgId, new Map());
    }
    const msgMap = window.__chatReactionStore.get(msgId);
    if (!msgMap.has(emoji)) {
      msgMap.set(emoji, new Set());
    }
    const userSet = msgMap.get(emoji);

    const hasReacted = userSet.has(myId);
    if (hasReacted) {
      userSet.delete(myId);
      if (window.__chatReactionBus && typeof window.__chatReactionBus.submit === "function") {
        window.__chatReactionBus.submit(`U:${msgId}:${emoji}`);
      }
    } else {
      userSet.add(myId);
      if (window.__chatReactionBus && typeof window.__chatReactionBus.submit === "function") {
        window.__chatReactionBus.submit(`R:${msgId}:${emoji}`);
      }
    }
    updateMessageReactions(msgId);
    window.closeChatEmojiPicker();
  };

  // Reply Handling
  window.startChatReply = function(msgId) {
    const msg = window.__chatCommentsMap.get(msgId);
    if (!msg) return;

    const nickname = msg.user?.nickname || msg.user?.visualId || "Anonymous";
    const snippet = msg.message?.replace(/^>[^\n]+\n/, "").replace(/<[^>]+>/g, "").slice(0, 50) || "";
    
    window.__chatPendingReply = { msgId, nickname, snippet };

    const banner = document.getElementById("chatReplyBanner");
    const info = document.getElementById("chatReplyBannerInfo");
    if (banner && info) {
      info.innerHTML = `Replying to <strong>@${escapeHtml(nickname)}</strong> <span style="opacity:0.7;">"${escapeHtml(snippet.slice(0, 30))}..."</span>`;
      banner.style.display = "flex";
    }
  };

  window.cancelChatReply = function() {
    window.__chatPendingReply = null;
    const banner = document.getElementById("chatReplyBanner");
    if (banner) banner.style.display = "none";
  };

  // Emoji Picker
  window.openChatReactionPicker = function(msgId, triggerBtn) {
    window.toggleChatEmojiPicker("reaction", msgId, triggerBtn);
  };

  window.toggleChatInputEmojiPicker = function(triggerBtn) {
    window.toggleChatEmojiPicker("input", null, triggerBtn);
  };

  window.toggleChatEmojiPicker = function(targetType, msgId, triggerBtn) {
    const existing = document.getElementById("chatEmojiPickerPopover");
    if (existing) {
      existing.remove();
      if (existing.getAttribute("data-target-msg") === String(msgId) && existing.getAttribute("data-target-type") === targetType) {
        return;
      }
    }

    const picker = document.createElement("div");
    picker.id = "chatEmojiPickerPopover";
    picker.className = "c-chat-emoji-picker";
    picker.setAttribute("data-target-type", targetType);
    picker.setAttribute("data-target-msg", msgId || "");

    let quickEmojiBtns = QUICK_REACTIONS.map(em => `
      <button class="c-chat-emoji-btn" onclick="window.__onEmojiPicked('${em}')">${em}</button>
    `).join("");

    let customEmojiBtns = Object.entries(CUSTOM_EMOJIS).map(([code, url]) => `
      <button class="c-chat-emoji-btn" onclick="window.__onEmojiPicked(':${code}:')" title=":${code}:">
        <img src="${url}" alt=":${code}:">
      </button>
    `).join("");

    picker.innerHTML = `
      <div class="c-chat-emoji-picker-title">Quick Reactions</div>
      <div class="c-chat-emoji-grid">${quickEmojiBtns}</div>
      <div class="c-chat-emoji-picker-title" style="margin-top:4px;">Custom Emojis</div>
      <div class="c-chat-emoji-grid">${customEmojiBtns}</div>
    `;

    const panel = document.querySelector(".c-chat-panel");
    if (panel) {
      panel.appendChild(picker);
    } else {
      document.body.appendChild(picker);
    }

    window.__onEmojiPicked = function(emojiCode) {
      if (targetType === "input") {
        if (window.__chatMainInstance) {
          const current = window.__chatMainInstance.inputText || "";
          window.__chatMainInstance.inputText = current + (emojiCode.startsWith(":") ? emojiCode : (" " + emojiCode));
        }
      } else if (targetType === "reaction" && msgId) {
        window.toggleChatReaction(msgId, emojiCode);
      }
      window.closeChatEmojiPicker();
    };

    // Close on outside click
    setTimeout(() => {
      const closeHandler = function(e) {
        if (!picker.contains(e.target) && e.target !== triggerBtn) {
          picker.remove();
          document.removeEventListener("click", closeHandler);
        }
      };
      document.addEventListener("click", closeHandler);
    }, 10);
  };

  window.closeChatEmojiPicker = function() {
    const existing = document.getElementById("chatEmojiPickerPopover");
    if (existing) existing.remove();
  };

  // Timestamp Refresh Loop
  setInterval(() => {
    const timeEls = document.querySelectorAll(".c-chat-time[data-time]");
    timeEls.forEach(el => {
      const time = parseInt(el.getAttribute("data-time"), 10);
      if (time) el.textContent = formatRelativeTime(time);
    });
  }, 30000);
})();

/* ===========================
   MULTI-CHANNEL HUB & COMMENTS CREATION
=========================== */

window.__currentChatChannel = "general";

window.switchChatHubChannel = function(channelName) {
  if (channelName !== "general" && channelName !== "community-gallery") {
    channelName = "general";
  }
  window.__currentChatChannel = channelName;

  // Update Navigation Bar Buttons
  ["general", "community-gallery"].forEach(ch => {
    const btn = document.getElementById(`hubNavBtn-${ch}`);
    const view = document.getElementById(`channelView-${ch}`);
    if (btn) {
      if (ch === channelName) btn.classList.add("is-active");
      else btn.classList.remove("is-active");
    }
    if (view) {
      view.style.display = (ch === channelName) ? "" : "none";
    }
  });

  // Update Header Bar
  const hashEl = document.getElementById("hubHeaderHash");
  const titleEl = document.getElementById("hubHeaderTitle");
  const topicEl = document.getElementById("hubHeaderTopic");

  if (channelName === "general") {
    if (hashEl) hashEl.innerHTML = '<i class="bi bi-hash"></i>';
    if (titleEl) titleEl.textContent = "general";
    if (topicEl) topicEl.textContent = "Discuss character ideas, share prompts & roleplay tips";
  } else if (channelName === "community-gallery") {
    if (hashEl) hashEl.innerHTML = '<i class="bi bi-grid-3x3-gap"></i>';
    if (titleEl) titleEl.textContent = "community-gallery";
    if (topicEl) topicEl.textContent = "Community art — saved by visitors";
    window.ensureCommunityGalleryLoaded();
  }
};

window.refreshActiveChatChannel = function() {
  if (window.__currentChatChannel === "general") {
    window.createCommentsSectionHtml();
  } else if (window.__currentChatChannel === "community-gallery") {
    const ctn = document.getElementById("communityGalleryEmbedCtn");
    if (ctn) ctn.removeAttribute("data-loaded");
    window.ensureCommunityGalleryLoaded();
  }
};

window.toggleArtPromptBox = function() {
  const box = document.getElementById("artPromptBox");
  if (!box) return;
  box.style.display = (box.style.display === "none" || !box.style.display) ? "flex" : "none";
};

window.shareArtToGeneral = function(cardIndex) {
  const basePrompt = window.overwrittenVisualKeyphrasesText || window.lastCharacterTextData?.visualKeyphrasesText || "Character portrait";
  const shareText = `🎨 **Character Art**: "${basePrompt}"`;
  
  if (window.__chatMainInstance) {
    const current = window.__chatMainInstance.inputText || "";
    window.__chatMainInstance.inputText = current ? `${current}\n${shareText}` : shareText;
  }
  window.switchChatHubChannel("general");
};

window.ensureCommunityGalleryLoaded = function() {
  const ctn = document.getElementById("communityGalleryEmbedCtn");
  if (!ctn || ctn.getAttribute("data-loaded") === "true") return;

  const imagePluginFn = (typeof window.image === "function") ? window.image : window.root?.image;
  if (!imagePluginFn) {
    ctn.innerHTML = `
      <div class="c-chat-empty-state">
        <div class="c-chat-empty-icon"><i class="bi bi-images"></i></div>
        <div class="c-chat-empty-text">Community Gallery Offline</div>
        <div class="c-chat-empty-subtext">The public community gallery will connect automatically inside Perchance.</div>
      </div>
    `;
    return;
  }

  const galleryOpts = window.root?.galleryOptions || {
    gallery: true,
    sort: "top",
    contentFilter: "g",
    timeRange: "1-week",
    hideIfScoreIsBelow: -2,
    adaptiveHeight: true
  };

  try {
    const galleryHtml = imagePluginFn(galleryOpts);
    ctn.innerHTML = galleryHtml;
    ctn.setAttribute("data-loaded", "true");
  } catch (e) {
    console.error("Failed to load community gallery:", e);
  }
};

window.createCommentsSectionHtml = function() {
  let commentsCtn = document.getElementById("commentsCtn");
  if (!commentsCtn) return;

  const colorScheme = window.getCurrentColorScheme();
  const currentChannel = (window.__currentChatChannel === "community-gallery") ? "community-gallery" : "general";

  // Scaffold the multi-channel Discord-like hub structure
  commentsCtn.innerHTML = `
    <div class="c-chat-panel">
      <!-- CHANNEL SWITCHER / NAV -->
      <div class="c-hub-nav">
        <button class="c-hub-nav-item ${currentChannel === 'general' ? 'is-active' : ''}" id="hubNavBtn-general" onclick="window.switchChatHubChannel('general')">
          <span class="c-hub-nav-hash"><i class="bi bi-hash"></i></span> general
        </button>
        <button class="c-hub-nav-item ${currentChannel === 'community-gallery' ? 'is-active' : ''}" id="hubNavBtn-community-gallery" onclick="window.switchChatHubChannel('community-gallery')">
          <span class="c-hub-nav-hash"><i class="bi bi-grid-3x3-gap"></i></span> community-gallery
        </button>
      </div>

      <!-- HEADER -->
      <div class="c-chat-header">
        <div class="c-chat-header-left">
          <span class="c-chat-header-hash" id="hubHeaderHash"><i class="bi bi-hash"></i></span>
          <span class="c-chat-header-title" id="hubHeaderTitle">general</span>
          <span class="c-chat-header-divider"></span>
          <span class="c-chat-header-topic" id="hubHeaderTopic">Discuss character ideas, share prompts & roleplay tips</span>
        </div>
        <div class="c-chat-header-right">
          <button class="c-chat-header-btn" title="Refresh Channel" onclick="window.refreshActiveChatChannel()"><i class="bi bi-arrow-clockwise"></i></button>
        </div>
      </div>

      <!-- CHANNEL VIEW 1: GENERAL CHAT -->
      <div id="channelView-general" class="c-channel-view" style="${currentChannel === 'general' ? '' : 'display:none;'}">
        <div class="c-chat-feed" id="chatFeedEl">
          <div class="c-chat-empty-state">
            <div class="c-chat-empty-icon"><i class="bi bi-chat-dots"></i></div>
            <div class="c-chat-empty-text">Loading messages...</div>
          </div>
        </div>

        <div class="c-chat-reply-banner" id="chatReplyBanner" style="display: none;">
          <div class="c-chat-reply-banner-info" id="chatReplyBannerInfo"></div>
          <button class="c-chat-reply-banner-close" title="Cancel Reply" onclick="window.cancelChatReply()"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="c-chat-input-wrapper">
          <div class="c-chat-input-bar">
            <div class="c-chat-input-iframe-ctn" id="chatInputIframeCtn"></div>
            <button class="c-chat-emoji-trigger" title="Insert Emoji" onclick="window.toggleChatInputEmojiPicker(this)"><i class="bi bi-emoji-smile"></i></button>
          </div>
        </div>
      </div>

      <!-- CHANNEL VIEW 2: COMMUNITY GALLERY -->
      <div id="channelView-community-gallery" class="c-channel-view c-gallery-view" style="${currentChannel === 'community-gallery' ? '' : 'display:none;'}">
        <div class="c-gallery-embed-wrapper" id="communityGalleryEmbedCtn">
          <div class="c-chat-empty-state">
            <div class="c-chat-empty-icon"><i class="bi bi-images"></i></div>
            <div class="c-chat-empty-text">Loading Community Gallery...</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- HIDDEN REACTION BUS INSTANCE HOLDER -->
    <div id="chatReactionBusCtn" style="display:none; width:0; height:0; overflow:hidden;"></div>
  `;

  // Sync active channel header
  window.switchChatHubChannel(currentChannel);

  if (typeof window.comments !== "function" && typeof window.root?.commentsPlugin !== "function") {
    const feedEl = document.getElementById("chatFeedEl");
    if (feedEl) {
      feedEl.innerHTML = `
        <div class="c-chat-empty-state">
          <div class="c-chat-empty-icon"><i class="bi bi-exclamation-triangle"></i></div>
          <div class="c-chat-empty-text">Comments plugin is loading or offline</div>
          <div class="c-chat-empty-subtext">The comments interface will connect automatically once loaded in Perchance.</div>
        </div>
      `;
    }
    return;
  }

  const commentsPluginFn = (typeof window.comments === "function") ? window.comments : window.root.commentsPlugin;

  // 1. Initialize Main Chat Comments Instance
  const mainOpts = {
    channel: "cdg-community-chat",
    channelLabel: "comments",
    hideComments: true,
    forceColorScheme: colorScheme,
    width: "100%",
    height: "42px",
    commentPlaceholderText: "Message #general...",
    inputAreaStyle: "background:transparent; border:none; color:inherit; font-size:14px; padding:6px 4px;",
    submitButtonStyle: "background:#5865F2; color:#ffffff; border-radius:4px; font-weight:600; padding:4px 10px;",
    rateLimits: "1 per 3 seconds, 6 per minute, 25 per 10 minutes",
    bannedWords: "spam, scam, phishing, hack",
    adminFlair: "👑 MOD",
    adminPasswordHash: "REPLACE_WITH_SHA256_HASH",
    onLoad: function(comments, extra) {
      if (typeof window.__handleChatLoad === "function") {
        window.__handleChatLoad(comments, extra);
      }
    },
    onLoadMore: function(comments) {
      if (typeof window.__handleChatLoadMore === "function") {
        window.__handleChatLoadMore(comments);
      }
    },
    onComment: function(comment) {
      if (typeof window.__handleChatIncoming === "function") {
        window.__handleChatIncoming(comment);
      }
    },
    beforeSubmit: function(data) {
      if (typeof window.__handleChatBeforeSubmit === "function") {
        return window.__handleChatBeforeSubmit(data);
      }
      return data.inputText;
    }
  };

  try {
    const mainInstance = commentsPluginFn(mainOpts);
    window.__chatMainInstance = mainInstance;
    const iframeCtn = document.getElementById("chatInputIframeCtn");
    if (iframeCtn && mainInstance) {
      iframeCtn.innerHTML = mainInstance;
    }
  } catch (e) {
    console.error("Failed to initialize main comments plugin:", e);
  }

  // 2. Initialize Reaction Bus Instance
  const reactionOpts = {
    channel: "cdg-community-reactions",
    hideComments: true,
    width: "1px",
    height: "1px",
    rateLimits: "1 per 1 seconds, 20 per minute",
    onLoad: function(reactions) {
      if (typeof window.__handleReactionBusLoad === "function") {
        window.__handleReactionBusLoad(reactions);
      }
    },
    onComment: function(reaction) {
      if (typeof window.__handleReactionBusIncoming === "function") {
        window.__handleReactionBusIncoming(reaction);
      }
    }
  };

  try {
    const reactionInstance = commentsPluginFn(reactionOpts);
    window.__chatReactionBus = reactionInstance;
    const reactionBusCtn = document.getElementById("chatReactionBusCtn");
    if (reactionBusCtn && reactionInstance) {
      reactionBusCtn.innerHTML = reactionInstance;
    }
  } catch (e) {
    console.error("Failed to initialize reaction bus plugin:", e);
  }
};

window.generateFeedbackCommentsHtml = function() {
  if (typeof window.comments !== "function") return "";
  
  let options = {
    channel: "feedback", 
    hideComments: location.hash.includes("#showfeedback") ? false : true, 
    height: location.hash.includes("#showfeedback") ? 500 : 120, 
    commentPlaceholderText: "Share some feedback. Do not share personal info, data is public.", 
    submitButtonText: "submit feedback",
    forceColorScheme: window.getCurrentColorScheme()
  };
  
  return window.comments(options);
};

window.toggleFeedbackModal = function(btnEl) {
  let feedbackCommentsCtn = document.getElementById("feedbackCommentsCtn");
  if (!feedbackCommentsCtn) return;
  if (feedbackCommentsCtn.innerHTML.length === 0) {
    feedbackCommentsCtn.innerHTML = window.generateFeedbackCommentsHtml();
    btnEl.innerHTML = '<i class="bi bi-x-lg"></i> close';
  } else {
    feedbackCommentsCtn.innerHTML = '';
    btnEl.innerHTML = '<i class="bi bi-chat-dots-fill"></i> feedback';
  }
};

/* ===========================
   MODALS & OVERLAYS
=========================== */

window.createLoadingModal = function(initialContent, parentElement) {
  if (!parentElement) parentElement = document.body;
  
  let loadingModalCtn = document.createElement("div");
  loadingModalCtn.className = "c-dialog-overlay";
  
  let contentEl = document.createElement("div");
  contentEl.className = "c-dialog u-text-center";
  contentEl.innerHTML = initialContent || "";
  
  loadingModalCtn.appendChild(contentEl);
  parentElement.appendChild(loadingModalCtn);
  
  return {
    updateContent: function(content) {
      contentEl.innerHTML = content;
    },
    delete: function() {
      loadingModalCtn.remove();
    }
  };
};
