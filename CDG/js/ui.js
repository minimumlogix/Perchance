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

  // Remove any leftover Perchance plugin built-in end buttons inside targetEl
  let pluginButtons = targetEl.querySelectorAll(".ai-text-response-end-buttons-ctn, .ai-text-continue-button, .ai-text-edit-button");
  pluginButtons.forEach(btn => btn.remove());

  let existingToolbar = targetEl.parentNode.querySelector(`.c-response-toolbar[data-for="${targetId}"]`);
  if (existingToolbar) existingToolbar.remove();

  if (!targetEl.innerText.trim()) return;

  let toolbar = document.createElement("div");
  toolbar.className = "c-response-toolbar";
  toolbar.setAttribute("data-for", targetId);
  toolbar.innerHTML = `
    <button class="c-button c-button--icon c-button--sm" title="Clear" onclick="clearOutput('${targetId}')"><i class="bi bi-trash-fill"></i></button>
    <button class="c-button c-button--icon c-button--sm" title="Copy" onclick="copyOutput('${targetId}', this)"><i class="bi bi-clipboard"></i></button>
    <button class="c-button c-button--icon c-button--sm" title="Edit" onclick="toggleEditOutput('${targetId}', this)"><i class="bi bi-pencil-square"></i></button>
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
  let toolbar = document.querySelector(`.c-response-toolbar[data-for="${targetId}"]`);
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

  let toolbars = temp.querySelectorAll(".c-response-toolbar, .ai-text-response-buttons-wrapper, .ai-text-response-end-buttons-ctn, .ai-text-continue-button, .ai-text-edit-button");
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

  // 3. Behavior Examples (# Behavior Examples)
  let behaviorOutput = document.getElementById("behaviorOutputEl");
  let behaviorText = behaviorOutput ? window.htmlToMarkdown(behaviorOutput.innerHTML) : "";
  if (behaviorText) {
    blocks.push(`# Behavior Examples\n\n${behaviorText}`);
  }

  // 4. Scenario (# Scenario)
  let scenarioOutput = document.getElementById("scenarioOutputEl");
  let scenarioText = scenarioOutput ? window.htmlToMarkdown(scenarioOutput.innerHTML) : "";
  if (scenarioText) {
    blocks.push(`# Scenario\n\n${scenarioText}`);
  }

  // 5. Roleplay Start (# Roleplay Start)
  let roleplayOutput = document.getElementById("roleplayStartOutputEl");
  let roleplayText = roleplayOutput ? window.htmlToMarkdown(roleplayOutput.innerHTML) : "";
  if (roleplayText) {
    blocks.push(`# Roleplay Start\n\n${roleplayText}`);
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
   COMMENTS & FEEDBACK SYSTEM
=========================== */

window.toggleCommentsSection = function(btnEl) {
  let commentsEl = document.getElementById("commentsEl");
  if (!commentsEl) return;
  if (commentsEl.classList.contains("u-hidden")) {
    commentsEl.classList.remove("u-hidden");
    btnEl.innerHTML = '<i class="bi bi-eye-slash-fill"></i> hide comments';
  } else {
    commentsEl.classList.add("u-hidden");
    btnEl.innerHTML = '<i class="bi bi-chat-left-text-fill"></i> show comments';
  }
};

window.createCommentsSectionHtml = function() {
  let commentsCtn = document.getElementById("commentsCtn");
  if (!commentsCtn || typeof window.comments !== "function") return;
  
  let commentsPluginHtml = window.comments({
    width: "min(750px, 100%)", 
    height: "min(70vh, 600px)", 
    forceColorScheme: window.getCurrentColorScheme()
  });
  
  commentsCtn.innerHTML = `
    <p><button class="c-button" onclick="window.toggleCommentsSection(this)"><i class="bi bi-chat-left-text-fill"></i> show comments</button></p>
    <p id="commentsEl" class="u-hidden">
      ${commentsPluginHtml}
    </p>
  `;
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
