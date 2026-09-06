/* ===========================
   CONSTANTS
=========================== */

const DOCK_STORAGE_KEY = "CDG_DOCK_STATE";
const DEFAULT_TAB_ID = "tab-main";

/* ===========================
   CONFIGURATION
=========================== */

const NAVIGATION_TABS = [
  {
    id: "tab-main",
    icon: "bi-house-door-fill",
    title: "Main Generator",
    pageId: "page-main"
  },
  {
    id: "tab-ideas",
    icon: "bi-lightbulb-fill",
    title: "Idea & Plot Lab",
    pageId: "page-ideas"
  },
  {
    id: "tab-tools",
    icon: "bi-robot",
    title: "AI Tools",
    pageId: "page-tools"
  },
  {
    id: "tab-settings",
    icon: "bi-gear-fill",
    title: "Settings & Tools",
    pageId: "page-settings"
  }
];

/* ===========================
   GLOBAL STATE
=========================== */

let currentActiveTab = DEFAULT_TAB_ID;
let isDockHidden = true;

/* ===========================
   INITIALIZATION
=========================== */

function initDockNavigation() {
  renderDockButtons();
  setupDockEventListeners();
  applyDockVisibility(true);
  switchTab(DEFAULT_TAB_ID);
}

/* ===========================
   EVENT LISTENERS
=========================== */

function setupDockEventListeners() {
  const unhideBtn = document.getElementById("dockUnhideBtn");
  if (unhideBtn) {
    unhideBtn.addEventListener("click", () => {
      showDockToolbar();
    });
  }

  const hideBtn = document.getElementById("dockHideBtn");
  if (hideBtn) {
    hideBtn.addEventListener("click", () => {
      hideDockToolbar();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key.toLowerCase() === "d") {
      event.preventDefault();
      toggleDockToolbar();
    }
  });
}

/* ===========================
   CORE LOGIC
=========================== */

function switchTab(tabId) {
  const tabConfig = NAVIGATION_TABS.find(tab => tab.id === tabId);
  if (!tabConfig) return;

  currentActiveTab = tabId;

  const allTabBtns = document.querySelectorAll(".c-dock-btn[data-tab-id]");
  allTabBtns.forEach(btn => {
    const matches = btn.getAttribute("data-tab-id") === tabId;
    btn.classList.toggle("is-active", matches);
  });

  const allPages = document.querySelectorAll(".c-tab-page");
  allPages.forEach(page => {
    const isTarget = page.id === tabConfig.pageId;
    page.classList.toggle("u-hidden", !isTarget);
  });

  if (tabId === "tab-settings" && typeof window.syncSettingsTabValues === "function") {
    window.syncSettingsTabValues();
  }

  if (tabId === "tab-ideas" && typeof window.syncIdeaLabValues === "function") {
    window.syncIdeaLabValues();
  }

  if (tabId === "tab-tools" && typeof window.initToolsEngine === "function") {
    const chatView = document.getElementById("toolsChatView");
    if (!chatView || chatView.classList.contains("u-hidden")) {
      window.initToolsEngine();
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showDockToolbar() {
  applyDockVisibility(false);
}

function hideDockToolbar() {
  applyDockVisibility(true);
}

function toggleDockToolbar() {
  applyDockVisibility(!isDockHidden);
}

function applyDockVisibility(hidden) {
  isDockHidden = hidden;

  const dockContainer = document.getElementById("dockContainer");
  if (dockContainer) {
    dockContainer.classList.toggle("is-hidden", hidden);
  }

  const unhideBtn = document.getElementById("dockUnhideBtn");
  if (unhideBtn) {
    unhideBtn.classList.toggle("is-hidden", !hidden);
  }
}

function registerToolPage(toolConfig) {
  if (!toolConfig || !toolConfig.id || !toolConfig.pageId) return;
  const existing = NAVIGATION_TABS.find(t => t.id === toolConfig.id);
  if (existing) return;

  NAVIGATION_TABS.splice(NAVIGATION_TABS.length - 1, 0, toolConfig);
  renderDockButtons();
}

/* ===========================
   UI LOGIC
=========================== */

function renderDockButtons() {
  const navContainer = document.getElementById("dockNavItems");
  if (!navContainer) return;

  navContainer.innerHTML = "";

  NAVIGATION_TABS.forEach(tab => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `c-dock-btn ${tab.id === currentActiveTab ? "is-active" : ""}`;
    btn.setAttribute("data-tab-id", tab.id);
    btn.setAttribute("data-tooltip", tab.title);
    btn.setAttribute("aria-label", tab.title);
    btn.innerHTML = `<i class="bi ${tab.icon}"></i>`;
    btn.addEventListener("click", () => switchTab(tab.id));
    navContainer.appendChild(btn);
  });
}

function syncSettingsTabValues() {
  const settings = window.CDGStorage ? window.CDGStorage.getSettings() : {};
  const currentTheme = window.getCurrentColorScheme ? window.getCurrentColorScheme() : (settings.theme || "dark");

  const darkBtn = document.getElementById("settingThemeDarkBtn");
  const lightBtn = document.getElementById("settingThemeLightBtn");
  if (darkBtn && lightBtn) {
    darkBtn.classList.toggle("is-active", currentTheme === "dark");
    lightBtn.classList.toggle("is-active", currentTheme === "light");
  }

  const syncField = (tabElId, mainElId, fallbackVal) => {
    const tabEl = document.getElementById(tabElId);
    const mainEl = document.getElementById(mainElId);
    if (tabEl) {
      tabEl.value = (mainEl ? mainEl.value : null) || fallbackVal || "";
    }
  };

  syncField("settingDescLengthEl", "descLengthEl", settings.descLength || "compact_detailed");
  syncField("settingMainCastEl", "mainCastEl", settings.mainCast || "1");
  syncField("settingBgCastEl", "bgCastEl", settings.bgCast || "0");
  syncField("settingScenarioPerspectiveEl", "scenarioPerspectiveEl", settings.scenarioPerspective || "thirdperson");
  syncField("settingRoleplayStartPerspectiveEl", "roleplayStartPerspectiveEl", settings.roleplayStartPerspective || "firstperson");
  syncField("settingVisualStyleEl", "visualStyleEl", settings.visualStyle || "painterly_anime");
  syncField("settingImageFramingEl", "imageFramingEl", settings.imageFraming || "portrait");
}

function updateSettingFromTab(key, value, mainElId) {
  if (window.CDGStorage) {
    window.CDGStorage.saveSettings({ [key]: value });
  }
  const mainEl = document.getElementById(mainElId);
  if (mainEl) {
    mainEl.value = value;
    mainEl.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function setTabTheme(theme) {
  if (typeof window.setColorScheme === "function") {
    window.setColorScheme(theme);
    if (window.CDGStorage) {
      window.CDGStorage.saveSettings({ theme: theme });
    }
    syncSettingsTabValues();
    if (typeof window.createCommentsSectionHtml === "function") {
      window.createCommentsSectionHtml();
    }
  }
}

function rollIdeaLabPlot() {
  const previewEl = document.getElementById("ideaLabPlotPreview");
  if (!previewEl) return;

  let generatedIdea = "";
  if (window.YAMLPlotEngine && typeof window.YAMLPlotEngine.generatePlot === "function") {
    generatedIdea = window.YAMLPlotEngine.generatePlot();
  } else {
    generatedIdea = "An ancient cartographer discovers that uncharted islands appear only during total solar eclipses.";
  }

  previewEl.textContent = generatedIdea;
  previewEl.classList.add("u-highlight-pulse");
  setTimeout(() => previewEl.classList.remove("u-highlight-pulse"), 500);
}

function applyIdeaLabPlot(targetId) {
  const previewEl = document.getElementById("ideaLabPlotPreview");
  if (!previewEl || !previewEl.textContent.trim()) {
    rollIdeaLabPlot();
  }
  const text = previewEl.textContent.trim();
  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.value = targetEl.value ? targetEl.value + "\n" + text : text;
    targetEl.dispatchEvent(new Event("input", { bubbles: true }));
    switchTab("tab-main");
    targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    targetEl.classList.add("u-highlight-pulse");
    setTimeout(() => targetEl.classList.remove("u-highlight-pulse"), 800);
  }
}

function copyIdeaLabPlot() {
  const previewEl = document.getElementById("ideaLabPlotPreview");
  if (!previewEl) return;
  const text = previewEl.textContent.trim();
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const copyBtn = document.getElementById("ideaLabCopyBtn");
    if (copyBtn) {
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
      setTimeout(() => copyBtn.innerHTML = originalHtml, 1500);
    }
  });
}

function refreshIdeaLabSeeds() {
  const seedsCtn = document.getElementById("ideaLabSeedsCtn");
  if (!seedsCtn) return;

  seedsCtn.innerHTML = "";
  let list = window.massiveWordList;
  if (!list || list.length === 0) {
    seedsCtn.innerHTML = '<span class="u-text-subtle" style="font-size: 0.8rem;">Seed word list loading...</span>';
    return;
  }

  const sampleSize = 18;
  const selected = [];
  for (let i = 0; i < sampleSize; i++) {
    const word = list[Math.floor(Math.random() * list.length)].trim();
    if (word && !selected.includes(word)) selected.push(word);
  }

  selected.forEach(word => {
    const tag = document.createElement("button");
    tag.type = "button";
    tag.className = "c-tool-seed-tag";
    tag.textContent = "+ " + word;
    tag.title = `Append "${word}" to character notes`;
    tag.addEventListener("click", () => {
      const customFeaturesEl = document.getElementById("customFeaturesEl");
      if (customFeaturesEl) {
        customFeaturesEl.value = customFeaturesEl.value ? customFeaturesEl.value + ", " + word : word;
        customFeaturesEl.dispatchEvent(new Event("input", { bubbles: true }));
        tag.style.borderColor = "var(--color-primary)";
        tag.textContent = "✓ " + word;
      }
    });
    seedsCtn.appendChild(tag);
  });
}

function syncIdeaLabValues() {
  const previewEl = document.getElementById("ideaLabPlotPreview");
  if (previewEl && (!previewEl.textContent || previewEl.textContent.includes("Click Roll"))) {
    rollIdeaLabPlot();
  }
  refreshIdeaLabSeeds();
}

/* ===========================
   UTILITIES & GLOBAL EXPORTS
=========================== */

window.switchTab = switchTab;
window.showDockToolbar = showDockToolbar;
window.hideDockToolbar = hideDockToolbar;
window.toggleDockToolbar = toggleDockToolbar;
window.registerToolPage = registerToolPage;
window.initDockNavigation = initDockNavigation;
window.syncSettingsTabValues = syncSettingsTabValues;
window.updateSettingFromTab = updateSettingFromTab;
window.setTabTheme = setTabTheme;
window.rollIdeaLabPlot = rollIdeaLabPlot;
window.applyIdeaLabPlot = applyIdeaLabPlot;
window.copyIdeaLabPlot = copyIdeaLabPlot;
window.refreshIdeaLabSeeds = refreshIdeaLabSeeds;
window.syncIdeaLabValues = syncIdeaLabValues;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDockNavigation);
} else {
  initDockNavigation();
}
