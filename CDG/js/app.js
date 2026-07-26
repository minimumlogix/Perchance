/* ===========================
   APPLICATION INITIALIZATION
=========================== */

function initCDGApp() {
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

  /* Tag Selectors Initialization */
  let initialTones = settings.tones || (localStorage.tones ? JSON.parse(localStorage.tones) : []);
  if (typeof initialTones === "string") {
    try { initialTones = JSON.parse(initialTones); } catch(e) { initialTones = []; }
  }
  window.toneSelector = new window.TagSelector("toneSelectorCtn", {
    title: "Roleplay Tone",
    yamlUrl: "data/tones.yaml",
    defaultData: window.DEFAULT_TONES_DATA || {},
    placeholder: "Type to search or add custom tone...",
    initialTags: Array.isArray(initialTones) ? initialTones : [],
    onChange: function(tags) {
      window.CDGStorage.saveSettings({ tones: tags });
      localStorage.tones = JSON.stringify(tags);
    }
  });

  let initialWorldSettings = settings.worldSettings || (localStorage.worldSettings ? JSON.parse(localStorage.worldSettings) : []);
  if (typeof initialWorldSettings === "string") {
    try { initialWorldSettings = JSON.parse(initialWorldSettings); } catch(e) { initialWorldSettings = []; }
  }
  window.worldSettingSelector = new window.TagSelector("worldSettingSelectorCtn", {
    title: "World Setting",
    yamlUrl: "data/world_settings.yaml",
    defaultData: window.DEFAULT_WORLD_SETTINGS_DATA || {},
    placeholder: "Type to search or add custom setting...",
    initialTags: Array.isArray(initialWorldSettings) ? initialWorldSettings : [],
    onChange: function(tags) {
      window.CDGStorage.saveSettings({ worldSettings: tags });
      localStorage.worldSettings = JSON.stringify(tags);
    }
  });

  let scenarioPerspectiveEl = document.getElementById("scenarioPerspectiveEl");
  if (scenarioPerspectiveEl) {
    setTimeout(() => {
      scenarioPerspectiveEl.value = settings.scenarioPerspective || localStorage.scenarioPerspective || scenarioPerspectiveEl.value;
    }, 10);
    scenarioPerspectiveEl.addEventListener("change", function() {
      window.CDGStorage.saveSettings({ scenarioPerspective: this.value });
      localStorage.scenarioPerspective = this.value;
    });
  }

  let roleplayStartPerspectiveEl = document.getElementById("roleplayStartPerspectiveEl");
  if (roleplayStartPerspectiveEl) {
    setTimeout(() => {
      roleplayStartPerspectiveEl.value = settings.roleplayStartPerspective || localStorage.roleplayStartPerspective || roleplayStartPerspectiveEl.value;
    }, 10);
    roleplayStartPerspectiveEl.addEventListener("change", function() {
      window.CDGStorage.saveSettings({ roleplayStartPerspective: this.value });
      localStorage.roleplayStartPerspective = this.value;
    });
  }

  let mainCastEl = document.getElementById("mainCastEl");
  if (mainCastEl) {
    setTimeout(() => {
      mainCastEl.value = settings.mainCast || localStorage.mainCast || mainCastEl.value;
    }, 10);
    mainCastEl.addEventListener("change", function() {
      window.CDGStorage.saveSettings({ mainCast: this.value });
      localStorage.mainCast = this.value;
      
      let count = parseInt(this.value, 10);
      let roleplayStartPersp = document.getElementById("roleplayStartPerspectiveEl");
      let scenarioPersp = document.getElementById("scenarioPerspectiveEl");

      if (count >= 2) {
        if (scenarioPersp) {
          scenarioPersp.value = "thirdperson";
          window.CDGStorage.saveSettings({ scenarioPerspective: "thirdperson" });
        }
        if (roleplayStartPersp) {
          roleplayStartPersp.value = "thirdperson";
          window.CDGStorage.saveSettings({ roleplayStartPerspective: "thirdperson" });
        }
      } else {
        if (scenarioPersp) {
          scenarioPersp.value = "thirdperson";
          window.CDGStorage.saveSettings({ scenarioPerspective: "thirdperson" });
        }
        if (roleplayStartPersp) {
          roleplayStartPersp.value = "firstperson";
          window.CDGStorage.saveSettings({ roleplayStartPerspective: "firstperson" });
        }
      }
    });
  }

  let bgCastEl = document.getElementById("bgCastEl");
  if (bgCastEl) {
    setTimeout(() => {
      bgCastEl.value = settings.bgCast || localStorage.bgCast || bgCastEl.value;
    }, 10);
    bgCastEl.addEventListener("change", function() {
      window.CDGStorage.saveSettings({ bgCast: this.value });
      localStorage.bgCast = this.value;
    });
  }

  let visualStyleEl = document.getElementById("visualStyleEl");
  if (visualStyleEl) {
    if (typeof window.generateVisualStyleOptionsHtml === "function" && (!visualStyleEl.options || visualStyleEl.options.length === 0 || visualStyleEl.innerHTML.includes("["))) {
      let optionsHtml = window.generateVisualStyleOptionsHtml();
      if (optionsHtml) visualStyleEl.innerHTML = optionsHtml;
    }
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

  /* 5. Restore Cached Output Responses & Update Button State */
  const outputs = [
    { id: "outputEl", retry: "regenerate", btnId: "generateBtn", text: '<i class="bi bi-arrow-clockwise"></i> regenerate description' },
    { id: "behaviorOutputEl", retry: "generateBehavior", btnId: "generateBehaviorBtn", text: '<i class="bi bi-arrow-clockwise"></i> regenerate behavior examples' },
    { id: "scenarioOutputEl", retry: "generateScenario", btnId: "generateScenarioBtn", text: '<i class="bi bi-arrow-clockwise"></i> regenerate scenario description' },
    { id: "roleplayStartOutputEl", retry: "generateRoleplayStart", btnId: "generateRoleplayStartBtn", text: '<i class="bi bi-arrow-clockwise"></i> regenerate roleplay start' }
  ];

  outputs.forEach(({ id, retry, btnId, text }) => {
    let cachedHTML = window.CDGStorage.getCache(id);
    let el = document.getElementById(id);
    if (cachedHTML && el && cachedHTML.trim()) {
      el.innerHTML = cachedHTML;
      let btn = document.getElementById(btnId);
      if (btn) btn.innerHTML = text;
      window.renderResponseToolbar(id, retry);
    }
  });

  /* 6. Autosave outputs and notes on beforeunload */
  window.addEventListener("beforeunload", function() {
    outputs.forEach(({ id }) => {
      let el = document.getElementById(id);
      if (el && el.innerHTML.trim()) {
        window.CDGStorage.setCache(id, el.innerHTML);
      }
    });
  });

  /* 7. Initialize Comments Section */
  if (typeof window.createCommentsSectionHtml === "function") {
    window.createCommentsSectionHtml();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCDGApp);
} else {
  initCDGApp();
}
