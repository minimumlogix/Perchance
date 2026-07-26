/* ===========================
   TAG SELECTOR COMPONENT
=========================== */

(function () {
  function parseSimpleYaml(yamlText) {
    let result = {};
    let currentKey = null;
    let lines = yamlText.split("\n");
    for (let line of lines) {
      if (!line.trim() || line.trim().startsWith("#") || line.trim().startsWith("//")) continue;
      let indent = line.search(/\S/);
      let trimmed = line.trim();
      if (indent === 0 && trimmed.includes(":")) {
        let parts = trimmed.split(":");
        currentKey = parts[0].trim();
        result[currentKey] = {};
      } else if (currentKey && indent > 0 && trimmed.includes(":")) {
        let colonIdx = trimmed.indexOf(":");
        let subKey = trimmed.substring(0, colonIdx).trim();
        let subVal = trimmed.substring(colonIdx + 1).trim();
        if ((subVal.startsWith('"') && subVal.endsWith('"')) || (subVal.startsWith("'") && subVal.endsWith("'"))) {
          subVal = subVal.substring(1, subVal.length - 1);
        }
        result[currentKey][subKey] = subVal;
      }
    }
    return result;
  }

  // Single global hover card preview tooltip
  let globalHoverCard = null;

  function ensureHoverCard() {
    if (!globalHoverCard && typeof document !== "undefined" && document.body) {
      globalHoverCard = document.createElement("div");
      globalHoverCard.id = "cTagGlobalHoverCard";
      globalHoverCard.className = "c-tag-hover-card";
      globalHoverCard.innerHTML = `
        <div class="c-tag-hover-card__overlay">
          <div class="c-tag-hover-card__title" id="cTagCardTitle"></div>
          <div class="c-tag-hover-card__desc" id="cTagCardDesc"></div>
          <div class="c-tag-hover-card__prompt" id="cTagCardPrompt"></div>
        </div>
      `;
      document.body.appendChild(globalHoverCard);
    }
  }

  function showHoverCard(e, tagInfo) {
    ensureHoverCard();
    if (!globalHoverCard || !tagInfo) return;

    let titleEl = document.getElementById("cTagCardTitle");
    let descEl = document.getElementById("cTagCardDesc");
    let promptEl = document.getElementById("cTagCardPrompt");

    if (titleEl) titleEl.innerText = tagInfo.label || tagInfo.key;
    if (descEl) descEl.innerText = tagInfo.description || "";
    if (promptEl) promptEl.innerText = tagInfo.prompt ? `"${tagInfo.prompt}"` : "";

    if (tagInfo.image) {
      globalHoverCard.style.backgroundImage = `url("${tagInfo.image}")`;
    } else {
      globalHoverCard.style.backgroundImage = "none";
    }

    positionHoverCard(e);
    globalHoverCard.classList.add("c-tag-hover-card--visible");
  }

  function positionHoverCard(e) {
    if (!globalHoverCard) return;
    let x = e.clientX + 16;
    let y = e.clientY + 16;
    let cardRect = globalHoverCard.getBoundingClientRect();
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;

    if (x + cardRect.width > winWidth - 16) {
      x = e.clientX - cardRect.width - 16;
    }
    if (y + cardRect.height > winHeight - 16) {
      y = e.clientY - cardRect.height - 16;
    }

    globalHoverCard.style.left = Math.max(10, x) + "px";
    globalHoverCard.style.top = Math.max(10, y) + "px";
  }

  function hideHoverCard() {
    if (globalHoverCard) {
      globalHoverCard.classList.remove("c-tag-hover-card--visible");
    }
  }

  class TagSelector {
    constructor(containerId, options) {
      this.containerEl = document.getElementById(containerId);
      this.title = options.title || "Tags";
      this.yamlUrl = options.yamlUrl || "";
      this.placeholder = options.placeholder || "Type to search or add custom tag...";
      this.onChange = options.onChange || function () {};
      this.selectedTags = options.initialTags || [];
      this.data = {};
      this.isLoaded = false;
      this.activeSuggestionIdx = -1;

      if (this.containerEl) {
        this.init();
      }
    }

    async init() {
      this.renderSkeleton();
      if (this.yamlUrl) {
        try {
          const isLocal = !window.location.hostname.includes("perchance.org");
          const basePath = isLocal ? "" : "https://minimumlogix.github.io/Perchance/CDG/";
          const fetchPath = this.yamlUrl.startsWith("http") ? this.yamlUrl : basePath + this.yamlUrl;
          
          let res = await fetch(fetchPath);
          let text = await res.text();
          this.data = parseSimpleYaml(text);
          this.isLoaded = true;
        } catch (err) {
          console.warn("Failed to load tag YAML:", this.yamlUrl, err);
        }
      }
      this.render();
    }

    renderSkeleton() {
      this.containerEl.innerHTML = `<div class="c-tag-section"><div class="c-tag-section__label">${this.title}:</div><div class="c-tag-container"><span class="u-text-subtle">Loading...</span></div></div>`;
    }

    render() {
      if (!this.containerEl) return;
      this.containerEl.innerHTML = "";

      let sectionEl = document.createElement("div");
      sectionEl.className = "c-tag-section";

      let headerEl = document.createElement("div");
      headerEl.className = "l-flex-between u-mb-xs";
      headerEl.innerHTML = `
        <span class="c-tag-section__label">${this.title}:</span>
        <button type="button" class="c-tag-random-btn" title="Pick 3 Random ${this.title}s">
          <i class="bi bi-dice-5-fill"></i> Randomize
        </button>
      `;

      let randomBtn = headerEl.querySelector(".c-tag-random-btn");
      randomBtn.addEventListener("click", () => this.randomize());

      let tagBoxEl = document.createElement("div");
      tagBoxEl.className = "c-tag-container";

      // Render existing selected tag pills
      this.selectedTags.forEach((tagText) => {
        let tagInfo = this.findTagInfo(tagText);
        let pillEl = document.createElement("div");
        pillEl.className = "c-tag-pill";
        pillEl.innerHTML = `
          <span>${tagInfo ? (tagInfo.label || tagText) : tagText}</span>
          <button type="button" class="c-tag-pill__remove" title="Remove">&times;</button>
        `;

        if (tagInfo) {
          pillEl.addEventListener("mouseenter", (e) => showHoverCard(e, tagInfo));
          pillEl.addEventListener("mousemove", (e) => positionHoverCard(e));
          pillEl.addEventListener("mouseleave", () => hideHoverCard());
        }

        let removeBtn = pillEl.querySelector(".c-tag-pill__remove");
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          hideHoverCard();
          this.removeTag(tagText);
        });

        tagBoxEl.appendChild(pillEl);
      });

      // Input field
      let inputWrapper = document.createElement("div");
      inputWrapper.className = "c-tag-input-wrapper";
      let inputEl = document.createElement("input");
      inputEl.type = "text";
      inputEl.className = "c-tag-input";
      inputEl.placeholder = this.placeholder;

      inputWrapper.appendChild(inputEl);
      tagBoxEl.appendChild(inputWrapper);

      // Dropdown container
      let dropdownEl = document.createElement("div");
      dropdownEl.className = "c-tag-dropdown u-hidden";
      tagBoxEl.appendChild(dropdownEl);

      sectionEl.appendChild(headerEl);
      sectionEl.appendChild(tagBoxEl);
      this.containerEl.appendChild(sectionEl);

      this.inputEl = inputEl;
      this.dropdownEl = dropdownEl;

      this.bindEvents();
    }

    bindEvents() {
      if (!this.inputEl) return;

      this.inputEl.addEventListener("input", () => this.onSearchInput());
      this.inputEl.addEventListener("focus", () => this.onSearchInput());

      this.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.selectActiveOrAddCustom();
        } else if (e.key === "Backspace" && !this.inputEl.value && this.selectedTags.length > 0) {
          this.removeTag(this.selectedTags[this.selectedTags.length - 1]);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          this.moveActiveSuggestion(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.moveActiveSuggestion(-1);
        } else if (e.key === "Escape") {
          this.closeDropdown();
        }
      });

      document.addEventListener("click", (e) => {
        if (this.containerEl && !this.containerEl.contains(e.target)) {
          this.closeDropdown();
        }
      });
    }

    findTagInfo(tagText) {
      if (!this.data) return null;
      if (this.data[tagText]) return Object.assign({ key: tagText }, this.data[tagText]);
      for (let k in this.data) {
        if (this.data[k].label === tagText || k === tagText) {
          return Object.assign({ key: k }, this.data[k]);
        }
      }
      return null;
    }

    onSearchInput() {
      let query = this.inputEl.value.trim().toLowerCase();
      let matches = [];

      for (let k in this.data) {
        let item = this.data[k];
        let label = (item.label || k).toLowerCase();
        let desc = (item.description || "").toLowerCase();

        // Exclude already selected
        let isAlreadySelected = this.selectedTags.some((t) => t === k || t === item.label);
        if (!isAlreadySelected && (label.includes(query) || desc.includes(query) || k.toLowerCase().includes(query))) {
          matches.push(Object.assign({ key: k }, item));
        }
      }

      this.renderDropdown(matches);
    }

    renderDropdown(matches) {
      if (!this.dropdownEl) return;
      this.dropdownEl.innerHTML = "";
      this.activeSuggestionIdx = -1;

      if (matches.length === 0) {
        this.closeDropdown();
        return;
      }

      matches.slice(0, 10).forEach((item, idx) => {
        let itemEl = document.createElement("div");
        itemEl.className = "c-tag-dropdown__item";
        itemEl.dataset.key = item.key;
        itemEl.dataset.label = item.label || item.key;
        itemEl.innerHTML = `
          <div class="c-tag-dropdown__title">${item.label || item.key}</div>
          ${item.description ? `<div class="c-tag-dropdown__desc">${item.description}</div>` : ""}
        `;

        itemEl.addEventListener("mouseenter", (e) => {
          this.setActiveSuggestion(idx);
          showHoverCard(e, item);
        });
        itemEl.addEventListener("mousemove", (e) => positionHoverCard(e));
        itemEl.addEventListener("mouseleave", () => hideHoverCard());

        itemEl.addEventListener("click", () => {
          hideHoverCard();
          this.addTag(item.key);
          this.inputEl.value = "";
          this.closeDropdown();
        });

        this.dropdownEl.appendChild(itemEl);
      });

      this.dropdownEl.classList.remove("u-hidden");
    }

    setActiveSuggestion(idx) {
      let items = this.dropdownEl.querySelectorAll(".c-tag-dropdown__item");
      items.forEach((el, i) => {
        if (i === idx) {
          el.classList.add("c-tag-dropdown__item--active");
        } else {
          el.classList.remove("c-tag-dropdown__item--active");
        }
      });
      this.activeSuggestionIdx = idx;
    }

    moveActiveSuggestion(dir) {
      let items = this.dropdownEl.querySelectorAll(".c-tag-dropdown__item");
      if (items.length === 0) return;

      let newIdx = this.activeSuggestionIdx + dir;
      if (newIdx < 0) newIdx = items.length - 1;
      if (newIdx >= items.length) newIdx = 0;

      this.setActiveSuggestion(newIdx);

      let activeEl = items[newIdx];
      let itemKey = activeEl.dataset.key;
      let tagInfo = this.findTagInfo(itemKey);
      if (tagInfo) {
        let rect = activeEl.getBoundingClientRect();
        showHoverCard({ clientX: rect.right, clientY: rect.top }, tagInfo);
      }
    }

    selectActiveOrAddCustom() {
      let items = this.dropdownEl.querySelectorAll(".c-tag-dropdown__item");
      if (this.activeSuggestionIdx >= 0 && items[this.activeSuggestionIdx]) {
        let key = items[this.activeSuggestionIdx].dataset.key;
        this.addTag(key);
      } else if (this.inputEl.value.trim()) {
        this.addTag(this.inputEl.value.trim());
      }
      this.inputEl.value = "";
      this.closeDropdown();
    }

    closeDropdown() {
      if (this.dropdownEl) {
        this.dropdownEl.classList.add("u-hidden");
      }
      hideHoverCard();
    }

    addTag(tag) {
      if (!tag) return;
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag);
        this.render();
        this.onChange(this.selectedTags);
      }
    }

    removeTag(tag) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
      this.render();
      this.onChange(this.selectedTags);
    }

    randomize() {
      if (!this.data) return;
      let keys = Object.keys(this.data);
      if (keys.length === 0) return;

      // Pick 3 unique random keys
      let shuffled = keys.slice().sort(() => 0.5 - Math.random());
      this.selectedTags = shuffled.slice(0, Math.min(3, keys.length));
      this.render();
      this.onChange(this.selectedTags);
    }

    getSelectedPrompts() {
      let prompts = [];
      this.selectedTags.forEach((t) => {
        let info = this.findTagInfo(t);
        if (info && info.prompt) {
          prompts.push(info.prompt);
        } else {
          prompts.push(t);
        }
      });
      return prompts;
    }
  }

  window.TagSelector = TagSelector;
})();
