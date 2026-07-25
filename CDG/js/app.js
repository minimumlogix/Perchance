/* ===========================
   APPLICATION INITIALIZATION
=========================== */

document.addEventListener("DOMContentLoaded", function() {
  /* Preload Massive Word List */
  (async function() {
    try {
      let res = await fetch("https://user.uploads.dev/file/fdd83a6f7348fec983cb2583936beaf5.txt");
      let text = await res.text();
      window.massiveWordList = text.split("\n");
    } catch (e) {
      window.massiveWordList = null;
    }
  })();

  /* Initialize LocalStorage Input Persistence */
  let customFeaturesEl = document.getElementById("customFeaturesEl");
  if (customFeaturesEl) {
    customFeaturesEl.value = localStorage.customFeatures || "";
    customFeaturesEl.addEventListener("input", function() {
      localStorage.customFeatures = this.value;
    });
  }

  let customBehaviorFeaturesEl = document.getElementById("customBehaviorFeaturesEl");
  if (customBehaviorFeaturesEl) {
    customBehaviorFeaturesEl.value = localStorage.customBehaviorFeatures || "";
    customBehaviorFeaturesEl.addEventListener("input", function() {
      localStorage.customBehaviorFeatures = this.value;
    });
  }

  let customScenarioFeaturesEl = document.getElementById("customScenarioFeaturesEl");
  if (customScenarioFeaturesEl) {
    customScenarioFeaturesEl.value = localStorage.customScenarioFeatures || "";
    customScenarioFeaturesEl.addEventListener("input", function() {
      localStorage.customScenarioFeatures = this.value;
    });
  }

  let customRoleplayStartFeaturesEl = document.getElementById("customRoleplayStartFeaturesEl");
  if (customRoleplayStartFeaturesEl) {
    customRoleplayStartFeaturesEl.value = localStorage.customRoleplayStartFeatures || "";
    customRoleplayStartFeaturesEl.addEventListener("input", function() {
      localStorage.customRoleplayStartFeatures = this.value;
    });
  }

  let descLengthEl = document.getElementById("descLengthEl");
  if (descLengthEl) {
    setTimeout(() => {
      descLengthEl.value = localStorage.descLength || descLengthEl.value;
    }, 10);
    descLengthEl.addEventListener("change", function() {
      localStorage.descLength = this.value;
    });
  }

  let visualStyleEl = document.getElementById("visualStyleEl");
  if (visualStyleEl) {
    setTimeout(() => {
      visualStyleEl.value = localStorage.visualStyle || visualStyleEl.value;
    }, 10);
    visualStyleEl.addEventListener("change", function() {
      localStorage.visualStyle = this.value;
    });
  }

  /* Initialize Color Scheme Theme */
  if (localStorage.forceColorScheme !== undefined) {
    window.setColorScheme(localStorage.forceColorScheme);
  } else {
    let systemIsInDarkMode = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    window.setColorScheme(systemIsInDarkMode ? "dark" : "light");
  }

  /* Initialize Comments Section */
  if (typeof window.createCommentsSectionHtml === "function") {
    window.createCommentsSectionHtml();
  }
});
