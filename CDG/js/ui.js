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
    <button class="c-button c-button--icon c-button--sm" title="Edit" onclick="toggleEditOutput('${targetId}', this)"><i class="bi bi-pencil-square"></i></button>
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
