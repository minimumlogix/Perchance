/* ===========================
   THEME MANAGEMENT
=========================== */

window.toggleManualDarkMode = function() {
  let newColorScheme = (window.getCurrentColorScheme() === "dark" ? "light" : "dark");
  localStorage.forceColorScheme = newColorScheme;
  window.setColorScheme(newColorScheme);
  
  let systemColorScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  if (systemColorScheme === newColorScheme) {
    localStorage.removeItem("forceColorScheme");
  }
};

window.getCurrentColorScheme = function() {
  if (localStorage.forceColorScheme !== undefined) {
    return localStorage.forceColorScheme;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
};

window.setColorScheme = function(scheme) {
  if (scheme !== "dark" && scheme !== "light") throw new Error("scheme should be 'light' or 'dark'");
  
  let darkModeBtn = document.querySelector("#darkModeBtn");
  if (darkModeBtn) darkModeBtn.textContent = (scheme === "dark" ? "🌄" : "🌃");
  
  document.documentElement.setAttribute("data-theme", scheme);
  document.documentElement.classList.remove("t-dark", "t-light");
  document.documentElement.classList.add(scheme === "dark" ? "t-dark" : "t-light");
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
    forceColorScheme: localStorage.forceColorScheme || null
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
    submitButtonText: "submit feedback"
  };
  
  if (localStorage.forceColorScheme) options.forceColorScheme = localStorage.forceColorScheme;
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
