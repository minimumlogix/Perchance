/* ===========================
   APPLICATION INITIALIZATION
=========================== */

document.addEventListener("DOMContentLoaded", function() {
  /* 1. Initialize Settings, Storage Cache & Persistent Storage API */
  let settings = window.CDGStorage.getSettings();
  if (typeof window.CDGStorage.initPersistentStorage === "function") {
    window.CDGStorage.initPersistentStorage();
  }

  /* 2. Preload Massive Word List */
  (async function() {
    try {
      let res = await fetch("https://user.uploads.dev/file/fdd83a6f7348fec983cb2583936beaf5.txt");
      let text = await res.text();
      window.massiveWordList = text.split("\n");
    } catch (e) {
      window.massiveWordList = null;
    }
  })();

  /* 3. Initialize LocalStorage & Settings Persistence */
  let customFeaturesEl = document.getElementById("customFeaturesEl");
  if (customFeaturesEl) {
    customFeaturesEl.value = settings.customFeatures || localStorage.customFeatures || "";
    customFeaturesEl.addEventListener("input", function() {
      window.CDGStorage.saveSettings({ customFeatures: this.value });
      localStorage.customFeatures = this.value;
    });
  }

  let customBehaviorFeaturesEl = document.getElementById("customBehaviorFeaturesEl");
  if (customBehaviorFeaturesEl) {
    customBehaviorFeaturesEl.value = settings.customBehaviorFeatures || localStorage.customBehaviorFeatures || "";
    customBehaviorFeaturesEl.addEventListener("input", function() {
      window.CDGStorage.saveSettings({ customBehaviorFeatures: this.value });
      localStorage.customBehaviorFeatures = this.value;
    });
  }

  let customScenarioFeaturesEl = document.getElementById("customScenarioFeaturesEl");
  if (customScenarioFeaturesEl) {
    customScenarioFeaturesEl.value = settings.customScenarioFeatures || localStorage.customScenarioFeatures || "";
    customScenarioFeaturesEl.addEventListener("input", function() {
      window.CDGStorage.saveSettings({ customScenarioFeatures: this.value });
      localStorage.customScenarioFeatures = this.value;
    });
  }

  let customRoleplayStartFeaturesEl = document.getElementById("customRoleplayStartFeaturesEl");
  if (customRoleplayStartFeaturesEl) {
    customRoleplayStartFeaturesEl.value = settings.customRoleplayStartFeatures || localStorage.customRoleplayStartFeatures || "";
    customRoleplayStartFeaturesEl.addEventListener("input", function() {
      window.CDGStorage.saveSettings({ customRoleplayStartFeatures: this.value });
      localStorage.customRoleplayStartFeatures = this.value;
    });
  }

  let descLengthEl = document.getElementById("descLengthEl");
  if (descLengthEl) {
    setTimeout(() => {
      descLengthEl.value = settings.descLength || localStorage.descLength || descLengthEl.value;
    }, 10);
    descLengthEl.addEventListener("change", function() {
      window.CDGStorage.saveSettings({ descLength: this.value });
      localStorage.descLength = this.value;
    });
  }

  let visualStyleEl = document.getElementById("visualStyleEl");
  if (visualStyleEl) {
    setTimeout(() => {
      visualStyleEl.value = settings.visualStyle || localStorage.visualStyle || visualStyleEl.value;
    }, 10);
    visualStyleEl.addEventListener("change", function() {
      window.CDGStorage.saveSettings({ visualStyle: this.value });
      localStorage.visualStyle = this.value;
    });
  }

  /* 4. Default Dark Mode Initialization */
  let initialTheme = localStorage.forceColorScheme || settings.theme || "dark";
  window.setColorScheme(initialTheme);

  /* 5. Restore Cached Output Responses */
  const outputs = [
    { id: "outputEl", retry: "regenerate" },
    { id: "behaviorOutputEl", retry: "generateBehavior" },
    { id: "scenarioOutputEl", retry: "generateScenario" },
    { id: "roleplayStartOutputEl", retry: "generateRoleplayStart" }
  ];

  outputs.forEach(({ id, retry }) => {
    let cachedHTML = window.CDGStorage.getCache(id);
    let el = document.getElementById(id);
    if (cachedHTML && el) {
      el.innerHTML = cachedHTML;
      window.renderResponseToolbar(id, retry);
    }
  });

  /* 6. Initialize Comments Section */
  if (typeof window.createCommentsSectionHtml === "function") {
    window.createCommentsSectionHtml();
  }
});
