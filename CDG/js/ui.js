/* ===========================
   SYSTEM CACHE & STORAGE MANAGER
=========================== */

window.CDGStorage = {
  getSettings: function() {
    try {
      let saved = localStorage.getItem("CDG_APP_SETTINGS");
      return saved ? { ...window.CDG_SETTINGS_DEFAULTS, ...JSON.parse(saved) } : { ...window.CDG_SETTINGS_DEFAULTS };
    } catch (e) {
      return { ...window.CDG_SETTINGS_DEFAULTS };
    }
  },

  saveSettings: function(patch) {
    try {
      let current = this.getSettings();
      let updated = { ...current, ...patch };
      localStorage.setItem("CDG_APP_SETTINGS", JSON.stringify(updated));
      if (patch.theme) localStorage.forceColorScheme = patch.theme;
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
  }
};

/* ===========================
   THEME MANAGEMENT (DEFAULT DARK)
=========================== */

window.toggleManualDarkMode = function() {
  let newColorScheme = (window.getCurrentColorScheme() === "dark" ? "light" : "dark");
  window.CDGStorage.saveSettings({ theme: newColorScheme });
  window.setColorScheme(newColorScheme);
};

window.getCurrentColorScheme = function() {
  if (localStorage.forceColorScheme !== undefined) {
    return localStorage.forceColorScheme;
  }
  let settings = window.CDGStorage.getSettings();
  return settings.theme || "dark";
};

window.setColorScheme = function(scheme) {
  let targetScheme = (scheme === "light" || scheme === "dark") ? scheme : "dark";
  
  let darkModeBtn = document.querySelector("#darkModeBtn");
  if (darkModeBtn) darkModeBtn.textContent = (targetScheme === "dark" ? "🌄" : "🌃");
  
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
    <button class="c-button c-button--icon c-button--sm" title="Clear" onclick="clearOutput('${targetId}')">🗑️</button>
    <button class="c-button c-button--icon c-button--sm" title="Copy" onclick="copyOutput('${targetId}', this)">📋</button>
    <button class="c-button c-button--icon c-button--sm" title="Edit" onclick="toggleEditOutput('${targetId}', this)">✏️</button>
    <button class="c-button c-button--icon c-button--sm" title="Retry" onclick="retryOutput('${retryFnName}')">🔄</button>
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

window.copyOutput = function(targetId, btnEl) {
  let targetEl = document.getElementById(targetId);
  if (!targetEl) return;
  
  let text = targetEl.innerText || targetEl.textContent;
  navigator.clipboard.writeText(text).then(() => {
    let orig = btnEl.textContent;
    btnEl.textContent = "✅";
    setTimeout(() => { btnEl.textContent = orig; }, 1500);
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
    btnEl.textContent = "✏️";
    btnEl.classList.remove("c-button--active");
    window.CDGStorage.setCache(targetId, targetEl.innerHTML);
  } else {
    targetEl.contentEditable = "true";
    targetEl.classList.add("is-editing");
    targetEl.focus();
    btnEl.textContent = "💾";
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

window.createCommentsSectionHtml = function() {
  let commentsCtn = document.getElementById("commentsCtn");
  if (!commentsCtn || typeof window.comments !== "function") return;
  
  let commentsPluginHtml = window.comments({
    width: "min(750px, 100%)", 
    height: "min(70vh, 600px)", 
    forceColorScheme: window.getCurrentColorScheme()
  });
  
  commentsCtn.innerHTML = `
    <p><button class="c-button" onclick="if(commentsEl.classList.contains('u-hidden')) { commentsEl.classList.remove('u-hidden'); this.textContent='hide comments'; } else { commentsEl.classList.add('u-hidden'); this.textContent='💬 show comments'; }">💬 show comments</button></p>
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
