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
  observeOutputContainers();
  updateDockAiStatus();
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

  const aiStatusBtn = document.getElementById("dockAiStatusBtn");
  if (aiStatusBtn) {
    aiStatusBtn.addEventListener("click", () => {
      openTokenInspectorModal();
    });
  }

  const inspectorModal = document.getElementById("aiTokenInspectorModal");
  if (inspectorModal) {
    inspectorModal.addEventListener("click", (event) => {
      if (event.target === inspectorModal) {
        closeTokenInspectorModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key.toLowerCase() === "d") {
      event.preventDefault();
      toggleDockToolbar();
    } else if (event.key === "Escape") {
      closeTokenInspectorModal();
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
   AI STATUS & TOKEN TRACKING
=========================== */

let aiStatePollInterval = null;

function estimateTokens(text) {
  if (!text || typeof text !== "string") return 0;
  let trimmed = text.trim();
  if (!trimmed) return 0;
  return Math.max(1, Math.ceil(trimmed.length / 3.8));
}

function calculateLoadedTokens() {
  const descEl = document.getElementById("outputEl");
  const behaviorEl = document.getElementById("behaviorOutputEl");
  const scenarioEl = document.getElementById("scenarioOutputEl");
  const roleplayStartEl = document.getElementById("roleplayStartOutputEl");

  let descText = (descEl ? descEl.innerText.trim() : "") || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText || "" : "");
  let behaviorText = (behaviorEl ? behaviorEl.innerText.trim() : "") || (window.lastBehaviorPromptStreamObj ? window.lastBehaviorPromptStreamObj.liveResponseText || "" : "");
  let scenarioText = (scenarioEl ? scenarioEl.innerText.trim() : "") || (window.lastScenarioPromptStreamObj ? window.lastScenarioPromptStreamObj.liveResponseText || "" : "");
  let roleplayStartText = (roleplayStartEl ? roleplayStartEl.innerText.trim() : "") || (window.lastRoleplayStartPromptStreamObj ? window.lastRoleplayStartPromptStreamObj.liveResponseText || "" : "");

  let descTokens = estimateTokens(descText);
  let behaviorTokens = estimateTokens(behaviorText);
  let scenarioTokens = estimateTokens(scenarioText);
  let roleplayStartTokens = estimateTokens(roleplayStartText);

  let imageTokens = (window.characterImageReference && window.characterImageReference.blob) ? 570 : 0;
  let totalTokens = descTokens + behaviorTokens + scenarioTokens + roleplayStartTokens + imageTokens;

  let fullCombinedText = [descText, behaviorText, scenarioText, roleplayStartText].filter(Boolean).join(" ");
  let wordCount = fullCombinedText ? fullCombinedText.trim().split(/\s+/).filter(Boolean).length : 0;
  let charCount = fullCombinedText.length;

  return {
    descTokens,
    behaviorTokens,
    scenarioTokens,
    roleplayStartTokens,
    imageTokens,
    totalTokens,
    wordCount,
    charCount
  };
}

function isAiActivelyGenerating() {
  if (window.generationStates) {
    for (let key in window.generationStates) {
      if (window.generationStates[key] === "generating") {
        return true;
      }
    }
  }
  return false;
}

function formatCompactTokenCount(num) {
  if (!num || num <= 0) return "0";
  if (num < 1000) return String(num);
  if (num < 10000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return Math.round(num / 1000) + "k";
}

function updateDockAiStatus(forcedState) {
  const dockBtn = document.getElementById("dockAiStatusBtn");
  const tokenCountEl = document.getElementById("dockTokenCount");
  const unhideDot = document.getElementById("dockUnhideAiDot");

  const isGenerating = typeof forcedState === "boolean" ? forcedState : isAiActivelyGenerating();
  const tokenData = calculateLoadedTokens();
  const formattedCount = formatCompactTokenCount(tokenData.totalTokens);

  if (tokenCountEl) {
    tokenCountEl.textContent = formattedCount;
  }

  if (dockBtn) {
    dockBtn.classList.toggle("is-active", isGenerating);
    dockBtn.classList.toggle("is-idle", !isGenerating);

    let tooltipText = isGenerating
      ? `AI: Generating • ${tokenData.totalTokens.toLocaleString()} Tokens (Click for details)`
      : `AI: Idle • ${tokenData.totalTokens.toLocaleString()} Tokens (Click for details)`;
    dockBtn.setAttribute("data-tooltip", tooltipText);
    dockBtn.setAttribute("aria-label", tooltipText);
  }

  if (unhideDot) {
    unhideDot.classList.toggle("is-active", isGenerating);
    unhideDot.classList.toggle("is-idle", !isGenerating);
  }

  if (isGenerating && !aiStatePollInterval) {
    aiStatePollInterval = setInterval(() => {
      const stillActive = isAiActivelyGenerating();
      if (!stillActive) {
        clearInterval(aiStatePollInterval);
        aiStatePollInterval = null;
        updateDockAiStatus(false);
      } else {
        const liveTokens = calculateLoadedTokens();
        if (tokenCountEl) {
          tokenCountEl.textContent = formatCompactTokenCount(liveTokens.totalTokens);
        }
        const modal = document.getElementById("aiTokenInspectorModal");
        if (modal && !modal.classList.contains("u-hidden") && modal.style.display !== "none") {
          renderTokenInspectorData(liveTokens, true);
        }
      }
    }, 250);
  } else if (!isGenerating && aiStatePollInterval) {
    clearInterval(aiStatePollInterval);
    aiStatePollInterval = null;
  }

  const modal = document.getElementById("aiTokenInspectorModal");
  if (modal && !modal.classList.contains("u-hidden") && modal.style.display !== "none") {
    renderTokenInspectorData(tokenData, isGenerating);
  }
}

function renderTokenInspectorData(data, isGenerating) {
  const tokenData = data || calculateLoadedTokens();
  const active = typeof isGenerating === "boolean" ? isGenerating : isAiActivelyGenerating();

  const totalTokensEl = document.getElementById("inspectorTotalTokens");
  const totalWordsEl = document.getElementById("inspectorTotalWords");
  const totalCharsEl = document.getElementById("inspectorTotalChars");
  const percentUsedEl = document.getElementById("inspectorPercentUsed");
  const progressBar = document.getElementById("inspectorProgressBar");
  const statusText = document.getElementById("inspectorStatusText");
  const stopBtn = document.getElementById("inspectorStopGenBtn");

  const descVal = document.getElementById("tokenBreakdownDesc");
  const behaviorVal = document.getElementById("tokenBreakdownBehavior");
  const scenarioVal = document.getElementById("tokenBreakdownScenario");
  const roleplayStartVal = document.getElementById("tokenBreakdownRoleplayStart");
  const imageVal = document.getElementById("tokenBreakdownImage");
  const imageRow = document.getElementById("tokenBreakdownImageRow");

  if (totalTokensEl) totalTokensEl.textContent = tokenData.totalTokens.toLocaleString();
  if (totalWordsEl) totalWordsEl.textContent = tokenData.wordCount.toLocaleString();
  if (totalCharsEl) totalCharsEl.textContent = tokenData.charCount.toLocaleString();

  let percentOf8k = Math.min(100, Math.round((tokenData.totalTokens / 8192) * 100));
  if (percentUsedEl) percentUsedEl.textContent = `${percentOf8k}% (of 8k)`;
  if (progressBar) progressBar.style.width = `${percentOf8k}%`;

  if (descVal) descVal.textContent = tokenData.descTokens.toLocaleString();
  if (behaviorVal) behaviorVal.textContent = tokenData.behaviorTokens.toLocaleString();
  if (scenarioVal) scenarioVal.textContent = tokenData.scenarioTokens.toLocaleString();
  if (roleplayStartVal) roleplayStartVal.textContent = tokenData.roleplayStartTokens.toLocaleString();

  if (imageRow) {
    imageRow.style.display = tokenData.imageTokens > 0 ? "flex" : "none";
    if (imageVal) imageVal.textContent = tokenData.imageTokens.toLocaleString();
  }

  if (statusText) {
    statusText.textContent = active ? "State: Active (Generating...)" : "State: Idle (Ready)";
    statusText.style.color = active ? "var(--color-primary)" : "var(--color-text-muted)";
  }

  if (stopBtn) {
    stopBtn.classList.toggle("u-hidden", !active);
  }
}

function openTokenInspectorModal() {
  const modal = document.getElementById("aiTokenInspectorModal");
  if (!modal) return;

  renderTokenInspectorData();
  modal.classList.remove("u-hidden");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeTokenInspectorModal() {
  const modal = document.getElementById("aiTokenInspectorModal");
  if (!modal) return;

  modal.classList.add("u-hidden");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

function refreshAndRenderTokenInspector() {
  updateDockAiStatus();
  renderTokenInspectorData();
}

async function stopAllActiveGenerations() {
  if (window.stopSectionGeneration && window.generationStates) {
    for (let key in window.generationStates) {
      if (window.generationStates[key] === "generating") {
        await window.stopSectionGeneration(key);
      }
    }
  }
  updateDockAiStatus(false);
}

function observeOutputContainers() {
  const targetIds = ["outputEl", "behaviorOutputEl", "scenarioOutputEl", "roleplayStartOutputEl"];
  const observer = new MutationObserver(() => {
    updateDockAiStatus();
  });

  targetIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      observer.observe(el, { childList: true, characterData: true, subtree: true });
      el.addEventListener("input", () => updateDockAiStatus());
    }
  });
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

window.estimateTokens = estimateTokens;
window.calculateLoadedTokens = calculateLoadedTokens;
window.updateDockAiStatus = updateDockAiStatus;
window.openTokenInspectorModal = openTokenInspectorModal;
window.closeTokenInspectorModal = closeTokenInspectorModal;
window.refreshAndRenderTokenInspector = refreshAndRenderTokenInspector;
window.stopAllActiveGenerations = stopAllActiveGenerations;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDockNavigation);
} else {
  initDockNavigation();
}
