/* ==========================================================================
   WORLD GENERATOR MODULE INITIAL STATE & LOADERS
   ========================================================================== */
(function () {
    // Initial State
    window.worldState = {
        name: "",
        setting: "Any",
        tones: ["Any"],
        themes: "",
        bannerUrl: "",
        sections: {
            overview: "",
            rules: "",
            races: "",
            regions: "",
            factions: "",
            bestiary: "",
            characters: ""
        },
        sectionNotes: {
            overview: "",
            rules: "",
            races: "",
            regions: "",
            factions: "",
            bestiary: "",
            characters: ""
        },
        isGenerating: {
            overview: false,
            rules: false,
            races: false,
            regions: false,
            factions: false,
            bestiary: false,
            characters: false,
            banner: false
        },
        activeWorldId: null
    };

    // Load active world state from localStorage
    window.loadWorldState = function () {
        try {
            if (localStorage.activeWorldState) {
                let saved = JSON.parse(localStorage.activeWorldState);
                window.worldState = Object.assign(window.worldState, saved);
            }
        } catch (e) {
            console.warn("Failed to load activeWorldState:", e);
        }
    };

    // Save active world state to localStorage
    window.saveWorldState = function () {
        try {
            // Read basic inputs from DOM
            window.worldState.name = document.getElementById("wNameEl")?.value || "";
            window.worldState.themes = document.getElementById("wThemesEl")?.value || "";
            window.worldState.activeLength = document.getElementById("wLengthEl")?.value || "medium";
            
            window.worldState.sectionNotes = {
                overview: document.getElementById("w-overviewNotesEl")?.value || "",
                rules: document.getElementById("w-rulesNotesEl")?.value || "",
                races: document.getElementById("w-racesNotesEl")?.value || "",
                regions: document.getElementById("w-regionsNotesEl")?.value || "",
                factions: document.getElementById("w-factionsNotesEl")?.value || "",
                bestiary: document.getElementById("w-bestiaryNotesEl")?.value || "",
                characters: document.getElementById("w-charactersNotesEl")?.value || ""
            };

            // Dropdowns setting & tones are managed on change
            localStorage.activeWorldState = JSON.stringify({
                name: window.worldState.name,
                setting: window.worldState.setting,
                tones: window.worldState.tones,
                themes: window.worldState.themes,
                bannerUrl: window.worldState.bannerUrl,
                sections: window.worldState.sections,
                sectionNotes: window.worldState.sectionNotes,
                activeWorldId: window.worldState.activeWorldId,
                activeLength: window.worldState.activeLength
            });
        } catch (e) {
            console.warn("Failed to save activeWorldState:", e);
        }
    };
/* ==========================================================================
   CUSTOM DROPDOWN CONFIGURATION
   ========================================================================== */
    window.selectWorldSetting = function (value, closeMenu = true) {
        window.worldState.setting = value;
        let labelEl = document.getElementById("wSettingLabel");
        if (labelEl) {
            labelEl.textContent = value.replace(/_/g, " ");
        }

        // Update active checkmarks in settings options list
        let items = document.querySelectorAll("#wSettingOptionsList .dropdown-option-item");
        items.forEach(item => {
            let check = item.querySelector("i");
            if (item.getAttribute("data-value") === value) {
                item.classList.add("active");
                if (check) check.style.display = "inline-block";
            } else {
                item.classList.remove("active");
                if (check) check.style.display = "none";
            }
        });

        if (closeMenu) {
            let menu = document.getElementById("wSettingDropdownMenu");
            if (menu) menu.style.display = "none";
        }
        window.saveWorldState();
    };

    window.initCustomWorldSettingDropdown = function () {
        let listEl = document.getElementById("wSettingOptionsList");
        if (!listEl) return;
        
        let keys = [];
        const isPerchance = window.location.hostname.includes("perchance.org");
        if (isPerchance && typeof window.root !== "undefined" && window.root.settingPrompts) {
            keys = window.getPerchanceListKeys(window.root.settingPrompts);
        }
        if (!keys || keys.length === 0) {
            keys = window.SETTING_KEYS || [
                "Any", "Fantasy", "High_Fantasy", "Sci_Fi", "Cyberpunk",
                "Real_World_Modern", "Real_World_Furry", "Real_World_Fantasy", "Historical", "Post_Apocalyptic",
                "Zombie_apocalypse", "Alien_apocalypse",
                "Horror", "Mythology", "Solarpunk", "Dark_Fantasy", "Urban_Fantasy",
                "Steampunk", "Dieselpunk", "Space_Opera", "Hard_Sci_Fi", "Weird_West",
                "Gothic", "Fairy_Tale", "Wuxia", "Isekai", "Biopunk",
                "Frozen_Apocalypse", "Underwater", "Dreamlike", "Satirical"
            ];
        }
        if (!keys.includes("Any")) {
            keys.unshift("Any");
        }
        
        listEl.innerHTML = keys.map(k => {
            let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
            return `
                <div class="dropdown-option-item" data-value="${k}" onclick="selectWorldSetting('${k}', true)">
                    <span>${label}</span>
                    <i class="bi bi-check-lg" style="display: none; color: var(--accent-color);"></i>
                </div>
            `;
        }).join("");

        // Select initial value
        let val = window.worldState.setting || "Any";
        selectWorldSetting(val, false);
    };

    window.initCustomWorldToneDropdown = function () {
        let listEl = document.getElementById("wToneOptionsList");
        if (!listEl) return;
        
        let keys = [];
        const isPerchance = window.location.hostname.includes("perchance.org");
        if (isPerchance && typeof window.root !== "undefined" && window.root.tonePrompts) {
            keys = window.getPerchanceListKeys(window.root.tonePrompts);
        }
        if (!keys || keys.length === 0) {
            keys = window.TONE_KEYS || [
                "Any", "Grounded", "Thrilling_Action", "Dark_Gritty", "Light_hearted_Comedic",
                "Mysterious", "Romantic", "Erotic", "Tragic", "Whimsical", "Epic",
                "Affectionate", "Flirtatious", "Sensual", "Explicit", "Romantic_Comedy",
                "Dark_Humour", "Gory", "Cute", "Dark_Romance", "Smut", "GenZ_Casual",
                "Documentary", "Slow_Burn"
            ];
        }
        
        keys = keys.filter(k => k !== "Any");
        
        let html = `
            <label class="dropdown-option-item-checkbox">
                <input type="checkbox" id="wToneAnyCheckbox" value="Any"
                    onchange="handleWorldToneAnyToggle(this)"
                    style="accent-color:var(--accent-color);">
                <span>Any</span>
            </label>
            <hr style="margin:0.25rem 0; border-color:var(--panel-border);">
        `;
        
        html += keys.map(k => {
            let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
            return `
                <label class="dropdown-option-item-checkbox">
                    <input type="checkbox" class="wToneCheckbox" value="${k}"
                        onchange="handleWorldToneChange()" style="accent-color:var(--accent-color);">
                    <span>${label}</span>
                </label>
            `;
        }).join("");
        
        listEl.innerHTML = html;
    };

    window.filterWorldTones = function (query) {
        let q = query.toLowerCase().trim();
        let items = document.querySelectorAll("#wToneOptionsList .dropdown-option-item-checkbox");
        items.forEach(item => {
            let text = item.querySelector("span").textContent.toLowerCase();
            if (item.querySelector("#wToneAnyCheckbox")) {
                item.style.display = "flex";
                return;
            }
            if (text.includes(q)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    };

    window.filterWorldSettings = function (query) {
        let q = query.toLowerCase().trim();
        let items = document.querySelectorAll("#wSettingOptionsList .dropdown-option-item");
        items.forEach(item => {
            let text = item.querySelector("span").textContent.toLowerCase();
            if (text.includes(q)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    };

    // Tones management specifically for World Generator
    window.getSelectedWorldTones = function () {
        let checked = [...document.querySelectorAll(".wToneCheckbox:checked")].map(c => c.value);
        return checked.length > 0 ? checked : ["Any"];
    };

    window.handleWorldToneChange = function () {
        let checked = [...document.querySelectorAll(".wToneCheckbox:checked")];
        let anyBox = document.getElementById("wToneAnyCheckbox");
        if (anyBox && checked.length > 0) anyBox.checked = false;
        
        window.worldState.tones = getSelectedWorldTones();
        updateWorldToneLabel();
        window.saveWorldState();
    };

    window.handleWorldToneAnyToggle = function (checkbox) {
        if (checkbox.checked) {
            document.querySelectorAll(".wToneCheckbox").forEach(c => c.checked = false);
        }
        window.worldState.tones = ["Any"];
        updateWorldToneLabel();
        window.saveWorldState();
    };

    window.updateWorldToneLabel = function () {
        let tones = window.worldState.tones;
        let label = document.getElementById("wToneDropdownLabel");
        if (label) {
            if (tones[0] === "Any") label.textContent = "Any";
            else if (tones.length === 1) label.textContent = tones[0].replace(/_/g, " ");
            else label.textContent = tones[0].replace(/_/g, " ") + " +" + (tones.length - 1);
        }
    };

    window.loadWorldTones = function () {
        try {
            let saved = window.worldState.tones || ["Any"];
            let anyBox = document.getElementById("wToneAnyCheckbox");
            if (!saved || saved.length === 0 || saved[0] === "Any") {
                if (anyBox) anyBox.checked = true;
                document.querySelectorAll(".wToneCheckbox").forEach(c => c.checked = false);
            } else {
                if (anyBox) anyBox.checked = false;
                document.querySelectorAll(".wToneCheckbox").forEach(c => c.checked = false);
                saved.forEach(t => {
                    let box = document.querySelector(`.wToneCheckbox[value="${t}"]`);
                    if (box) box.checked = true;
                });
            }
            updateWorldToneLabel();
        } catch (e) {
            let anyBox = document.getElementById("wToneAnyCheckbox");
            if (anyBox) anyBox.checked = true;
            updateWorldToneLabel();
        }
    };
/* ==========================================================================
   AI GENERATION ENGINE FOR WORLD SECTIONS
   ========================================================================== */
    window.generateWorldSection = async function (section) {
        if (window.worldState.isGenerating[section]) return;

        // Cancel previous stream if running
        if (window.worldStreams && window.worldStreams[section]) {
            window.worldStreams[section].stop();
        }

        window.saveWorldState();

        let outputEl = document.getElementById(`w-${section}OutputEl`);
        let editBtn = document.getElementById(`w-${section}EditBtnEl`);
        let copyBtn = document.getElementById(`w-${section}CopyBtnEl`);
        let genBtn = document.getElementById(`w-${section}GenBtnEl`);
        let stopBtn = document.getElementById(`w-${section}StopBtnEl`);
        let statusEl = document.getElementById(`w-${section}StatusEl`);

        if (genBtn) genBtn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-flex";
        if (statusEl) statusEl.textContent = "⏳ Chronological compilation...";
        if (outputEl) outputEl.classList.add("generating-pulse");

        window.worldState.isGenerating[section] = true;
        setGenerationStatus(`Writing world ${section}...`);

        let wName = window.worldState.name || "Unnamed World";
        let wSetting = window.worldState.setting;
        let wTones = window.worldState.tones.join(", ");
        let wThemes = window.worldState.themes || "general fantasy/sci-fi elements";
        let sectionNotes = window.worldState.sectionNotes?.[section] || "";
        
        let lengthVal = window.worldState.activeLength || "medium";
        let lengthInstruction = getLengthInstruction(lengthVal);

        let instruction = root.prompts.worldPage.sectionGeneration.compile(section, wName, wSetting, wTones, wThemes, sectionNotes, lengthInstruction);

        if (outputEl) {
            outputEl.innerHTML = "";
            outputEl.style.display = "block";
        }

        let typewriter = new TypewriterStreamer(outputEl, { speed: 10 });
        window.worldTypewriters = window.worldTypewriters || {};
        if (window.worldTypewriters[section]) {
            window.worldTypewriters[section].destroy();
        }
        window.worldTypewriters[section] = typewriter;

        let stream = ai({
            instruction,
            onChunk: (data) => {
                typewriter.appendTargetText(data.fullTextSoFar);
            }
        });
        window.worldStreams = window.worldStreams || {};
        window.worldStreams[section] = stream;

        try {
            let result = await stream;
            typewriter.destroy();

            if (result.stopReason === "user") {
                if (statusEl) statusEl.textContent = "⛔ Stopped.";
            } else {
                let text = result.text.trim().replace(/\u2014/g, " - ");
                window.worldState.sections[section] = text;
                if (outputEl) outputEl.innerHTML = formatSectionText(text);
                if (statusEl) statusEl.textContent = "";
                if (editBtn) editBtn.style.display = "inline-flex";
                if (copyBtn) copyBtn.style.display = "inline-flex";
            }
        } catch (e) {
            console.error(`World ${section} generation failed:`, e);
            typewriter.destroy();
            if (statusEl) statusEl.textContent = "❌ Failed.";
        } finally {
            window.worldState.isGenerating[section] = false;
            if (outputEl) outputEl.classList.remove("generating-pulse");
            if (genBtn) genBtn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            window.saveWorldState();
            if (window.saveActiveWorldState) window.saveActiveWorldState();
        }
    };

    window.stopWorldSection = function (section) {
        if (window.worldStreams && window.worldStreams[section]) {
            window.worldStreams[section].stop();
        }
    };

    // Generate banner image for the active world
    window.generateWorldBanner = async function () {
        if (window.worldState.isGenerating.banner) return;
        window.saveWorldState();

        let bannerEl = document.getElementById("wBannerEl");
        let statusEl = document.getElementById("wBannerStatusEl");
        let genBtn = document.getElementById("wBannerGenBtn");

        if (statusEl) statusEl.textContent = "⏳ Extracting visual themes...";
        window.worldState.isGenerating.banner = true;
        setGenerationStatus("Creating world visualization banner...");

        let overviewText = window.worldState.sections.overview || window.worldState.themes || "";
        root.wName = window.worldState.name || "Unnamed";
        root.wSetting = window.worldState.setting;
        root.wTones = window.worldState.tones.join(", ");
        root.overviewText = overviewText;
        let instruction = root.prompts.worldPage.bannerImage.instruction.evaluateItem;

        let keyphrase = "beautiful landscape, concept art";
        try {
            let res = await ai({ instruction });
            keyphrase = res.text.trim().replace(/^"|"$/g, "");
        } catch (e) {
            console.warn("Failed to generate banner keyphrases:", e);
        }

        if (statusEl) statusEl.textContent = "🎨 Rendering landscape...";
        let style = document.getElementById("visualStyleEl")?.value || "Cinematic Realistic";
        let stylePrompt = root.visualStyles[style] ? root.visualStyles[style].prompt.evaluateItem : "concept art";

        let prompt = sanitizeImagePrompt(`landscape environment concept art, high quality, detailed, masterpiece, ${keyphrase}, ${stylePrompt}`);
        let img = image({
            prompt: prompt,
            resolution: "768x512"
        });

        try {
            let result = await img;
            if (result.dataUrl) {
                window.worldState.bannerUrl = result.dataUrl;
                updateWorldBannerUI(result.dataUrl);
                if (statusEl) statusEl.textContent = "✅ Banner generated.";
                setTimeout(() => { if (statusEl) statusEl.textContent = ""; }, 3000);
            } else {
                if (statusEl) statusEl.textContent = "❌ Image generation failed.";
            }
        } catch (e) {
            console.error("Banner generation failed:", e);
            if (statusEl) statusEl.textContent = "❌ Failed.";
        } finally {
            window.worldState.isGenerating.banner = false;
            setGenerationStatus("");
            window.saveWorldState();
            if (window.saveActiveWorldState) window.saveActiveWorldState();
        }
    };

    window.updateWorldBannerUI = function (url) {
        let bannerEl = document.getElementById("wBannerEl");
        let removeBtn = document.getElementById("wClearBannerBtn");
        let cardBg = document.getElementById("wCardBannerBgEl");

        if (bannerEl) {
            bannerEl.style.backgroundImage = url ? `url(${url})` : "none";
            bannerEl.innerHTML = url ? "" : `<i class="bi bi-image" style="font-size:2.5rem; color:var(--text-muted);"></i>`;
        }
        if (cardBg) {
            cardBg.style.backgroundImage = url ? `url(${url})` : "none";
        }
        if (removeBtn) {
            removeBtn.style.display = url ? "inline-flex" : "none";
        }
    }

    window.clearWorldBanner = function (e) {
        if (e) e.stopPropagation();
        window.worldState.bannerUrl = "";
        updateWorldBannerUI("");
        window.saveWorldState();
        if (window.saveActiveWorldState) window.saveActiveWorldState();
    };

    // Generate All sections in order
    window.generateAllWorldSections = async function () {
        let sections = ["overview", "rules", "races", "regions", "factions", "bestiary", "characters"];
        for (let s of sections) {
            // Check if user has already cancelled/stopped
            if (document.getElementById("wGenerateAllBtn")?.style.display === "none") {
                // Stopped by user
                break;
            }
            await generateWorldSection(s);
        }
    };

    window.toggleWorldSectionEdit = function (section) {
        let outputEl = document.getElementById(`w-${section}OutputEl`);
        let editBtn = document.getElementById(`w-${section}EditBtnEl`);
        if (!outputEl || !editBtn) return;

        let isEditing = outputEl.contentEditable === "true";
        outputEl.contentEditable = !isEditing;
        if (!isEditing) {
            outputEl.style.border = "1px solid var(--accent-color)";
            outputEl.style.padding = "0.4rem";
            outputEl.focus();
            editBtn.innerHTML = '<i class="bi bi-floppy"></i> save';
        } else {
            outputEl.style.border = "none";
            outputEl.style.padding = "0.5rem 0";
            editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> edit';
            window.worldState.sections[section] = outputEl.innerText;
            window.saveWorldState();
            if (window.saveActiveWorldState) window.saveActiveWorldState();
        }
    };

    window.copyWorldSectionText = function (section) {
        let outputEl = document.getElementById(`w-${section}OutputEl`);
        if (!outputEl) return;
        let text = outputEl.innerText.trim();
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            let btn = document.getElementById(`w-${section}CopyBtnEl`);
            if (btn) {
                let orig = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-lg"></i> copied!';
                setTimeout(() => { btn.innerHTML = orig; }, 1500);
            }
        });
    };

    // Clear active UI inputs/outputs
    window.clearWorldState = function () {
        window.showConfirmDialog(
            "Are you sure you want to clear the active World settings and descriptions? Unsaved work will be lost.",
            'warnOnClear',
            () => {
                document.getElementById("wNameEl").value = "";
                document.getElementById("wThemesEl").value = "";
                document.getElementById("wLengthEl").value = "medium";
                
                window.worldState.name = "";
                window.worldState.setting = "Any";
                window.worldState.tones = ["Any"];
                window.worldState.themes = "";
                window.worldState.bannerUrl = "";
                window.worldState.activeWorldId = null;
                window.worldState.sectionNotes = {
                    overview: "", rules: "", races: "", regions: "", factions: "", bestiary: "", characters: ""
                };

                // Clear sections
                let list = ["overview", "rules", "races", "regions", "factions", "bestiary", "characters"];
                list.forEach(s => {
                    window.worldState.sections[s] = "";
                    let out = document.getElementById(`w-${s}OutputEl`);
                    if (out) { out.innerHTML = ""; out.style.display = "none"; }
                    let edit = document.getElementById(`w-${s}EditBtnEl`);
                    if (edit) edit.style.display = "none";
                    let copy = document.getElementById(`w-${s}CopyBtnEl`);
                    if (copy) copy.style.display = "none";
                    let stat = document.getElementById(`w-${s}StatusEl`);
                    if (stat) stat.textContent = "";
                    let note = document.getElementById(`w-${s}NotesEl`);
                    if (note) note.value = "";
                });

                selectWorldSetting("Any", false);
                document.getElementById("wToneAnyCheckbox").checked = true;
                handleWorldToneAnyToggle({ checked: true });
                updateWorldBannerUI("");
                
                window.saveWorldState();
                if (window.saveActiveWorldState) window.saveActiveWorldState();
                updateWorldTopBarSaveButtons();
            }
        );
    };
/* ==========================================================================
   LOCAL DATABASE AND FILE SAVE SLOTS MANAGEMENT
   ========================================================================== */
    window.saveWorldButtonClickHandler = function (btn) {
        window.saveWorldState();
        let name = window.worldState.name.trim();
        if (!name) {
            alert("Please enter a World Name before saving.");
            return;
        }

        let saved = [];
        try {
            saved = JSON.parse(localStorage.savedWorlds || "[]");
        } catch (e) {}

        let activeId = window.worldState.activeWorldId;
        let isUpdate = activeId !== null && saved.some(w => w.id === activeId);

        if (isUpdate) {
            // Overwrite existing save
            window.showConfirmDialog(
                `Are you sure you want to update <b>${name}</b> with active changes? This will overwrite the saved file.`,
                'warnOnUpdate',
                () => {
                    let idx = saved.findIndex(w => w.id === activeId);
                    saved[idx] = {
                        id: activeId,
                        name: name,
                        setting: window.worldState.setting,
                        tones: window.worldState.tones,
                        themes: window.worldState.themes,
                        bannerUrl: window.worldState.bannerUrl,
                        sections: Object.assign({}, window.worldState.sections),
                        sectionNotes: Object.assign({}, window.worldState.sectionNotes),
                        timestamp: Date.now()
                    };
                    localStorage.savedWorlds = JSON.stringify(saved);
                    renderSidebarWorlds();
                    triggerWorldSelectorSync();
                    alert(`World "${name}" updated successfully.`);
                }
            );
        } else {
            // Create new save
            let newId = Date.now();
            saved.push({
                id: newId,
                name: name,
                setting: window.worldState.setting,
                tones: window.worldState.tones,
                themes: window.worldState.themes,
                bannerUrl: window.worldState.bannerUrl,
                sections: Object.assign({}, window.worldState.sections),
                sectionNotes: Object.assign({}, window.worldState.sectionNotes),
                timestamp: Date.now()
            });
            localStorage.savedWorlds = JSON.stringify(saved);
            window.worldState.activeWorldId = newId;
            window.saveWorldState();
            renderSidebarWorlds();
            triggerWorldSelectorSync();
            updateWorldTopBarSaveButtons();
            alert(`World "${name}" saved as a new slot.`);
        }
    };

    window.updateWorldTopBarSaveButtons = function () {
        let container = document.getElementById("saveWorldButtonsContainer");
        if (!container) return;

        let activeId = window.worldState.activeWorldId;
        if (activeId) {
            container.innerHTML = `
                <button onclick="saveWorldButtonClickHandler(this)" class="btn btn-secondary" style="font-size:90%; padding:0.45rem 0.8rem; height:fit-content;"><i class="bi bi-floppy-fill"></i> Update Save</button>
                <button onclick="saveWorldAsNew()" class="btn btn-ghost" style="font-size:85%; padding:0.45rem 0.7rem; height:fit-content;" title="Save as a separate world slot"><i class="bi bi-plus-square"></i> Save As New</button>
            `;
        } else {
            container.innerHTML = `
                <button onclick="saveWorldButtonClickHandler(this)" class="btn btn-secondary" style="font-size:90%; padding:0.45rem 0.8rem; height:fit-content;"><i class="bi bi-floppy"></i> Save World</button>
            `;
        }
    };

    window.saveWorldAsNew = function () {
        window.worldState.activeWorldId = null;
        window.saveWorldState();
        saveWorldButtonClickHandler();
    };

    window.loadWorld = function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = [];
        try {
            saved = JSON.parse(localStorage.savedWorlds || "[]");
        } catch (e) {}

        let w = saved.find(x => x.id === id);
        if (!w) return;

        window.showConfirmDialog(
            `Are you sure you want to load <b>${w.name}</b>? Unsaved active World edits on your screen will be overwritten.`,
            'warnOnLoad',
            () => {
                window.worldState.activeWorldId = id;
                window.worldState.name = w.name;
                window.worldState.setting = w.setting || "Any";
                window.worldState.tones = w.tones || ["Any"];
                window.worldState.themes = w.themes || "";
                window.worldState.bannerUrl = w.bannerUrl || "";
                window.worldState.sections = Object.assign({}, w.sections);
                window.worldState.sectionNotes = Object.assign({
                    overview: "", rules: "", races: "", regions: "", factions: "", bestiary: "", characters: ""
                }, w.sectionNotes || {});

                // Populate DOM
                let nameEl = document.getElementById("wNameEl");
                let themesEl = document.getElementById("wThemesEl");
                if (nameEl) nameEl.value = w.name;
                if (themesEl) themesEl.value = w.themes || "";

                let notes = window.worldState.sectionNotes;
                let overviewNotesEl = document.getElementById("w-overviewNotesEl");
                let rulesNotesEl = document.getElementById("w-rulesNotesEl");
                let racesNotesEl = document.getElementById("w-racesNotesEl");
                let regionsNotesEl = document.getElementById("w-regionsNotesEl");
                let factionsNotesEl = document.getElementById("w-factionsNotesEl");
                let bestiaryNotesEl = document.getElementById("w-bestiaryNotesEl");
                let charactersNotesEl = document.getElementById("w-charactersNotesEl");

                if (overviewNotesEl) overviewNotesEl.value = notes.overview || "";
                if (rulesNotesEl) rulesNotesEl.value = notes.rules || "";
                if (racesNotesEl) racesNotesEl.value = notes.races || "";
                if (regionsNotesEl) regionsNotesEl.value = notes.regions || "";
                if (factionsNotesEl) factionsNotesEl.value = notes.factions || "";
                if (bestiaryNotesEl) bestiaryNotesEl.value = notes.bestiary || "";
                if (charactersNotesEl) charactersNotesEl.value = notes.characters || "";

                selectWorldSetting(w.setting, false);
                loadWorldTones();
                updateWorldBannerUI(w.bannerUrl);

                // Populate sections
                let list = ["overview", "rules", "races", "regions", "factions", "bestiary", "characters"];
                list.forEach(s => {
                    let text = w.sections[s] || "";
                    let out = document.getElementById(`w-${s}OutputEl`);
                    let edit = document.getElementById(`w-${s}EditBtnEl`);
                    let copy = document.getElementById(`w-${s}CopyBtnEl`);
                    if (out) {
                        if (text) {
                            out.innerHTML = formatSectionText(text);
                            out.style.display = "block";
                            if (edit) edit.style.display = "inline-block";
                            if (copy) copy.style.display = "inline-block";
                        } else {
                            out.innerHTML = "";
                            out.style.display = "none";
                            if (edit) edit.style.display = "none";
                            if (copy) copy.style.display = "none";
                        }
                    }
                });

                window.saveWorldState();
                if (window.saveActiveWorldState) window.saveActiveWorldState();
                updateWorldTopBarSaveButtons();
                
                // Switch sidebar tab to active slot highlighting
                renderSidebarWorlds();
            }
        );
    };

    window.deleteWorld = function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedWorlds || "[]");
        let idx = saved.findIndex(x => x.id === id);
        if (idx === -1) return;

        let name = saved[idx].name;
        if (confirm(`Are you sure you want to delete the world "${name}"? This cannot be undone.`)) {
            saved.splice(idx, 1);
            localStorage.savedWorlds = JSON.stringify(saved);
            if (window.worldState.activeWorldId === id) {
                window.worldState.activeWorldId = null;
                window.saveWorldState();
                updateWorldTopBarSaveButtons();
            }
            renderSidebarWorlds();
            triggerWorldSelectorSync();
        }
    };

    window.duplicateWorld = function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedWorlds || "[]");
        let w = saved.find(x => x.id === id);
        if (!w) return;

        let copy = Object.assign({}, w, {
            id: Date.now(),
            name: w.name + " (Copy)",
            timestamp: Date.now()
        });
        saved.push(copy);
        localStorage.savedWorlds = JSON.stringify(saved);
        renderSidebarWorlds();
        triggerWorldSelectorSync();
    };

    window.renameSavedWorld = function (id, labelEl) {
        id = isNaN(Number(id)) ? id : Number(id);
        let currentName = labelEl.textContent.trim();
        let newName = prompt("Rename saved World:", currentName);
        if (newName === null) return;
        newName = newName.trim();
        if (!newName) return;

        let saved = JSON.parse(localStorage.savedWorlds || "[]");
        let idx = saved.findIndex(x => x.id === id);
        if (idx !== -1) {
            saved[idx].name = newName;
            localStorage.savedWorlds = JSON.stringify(saved);
            
            // Sync with active UI if loaded
            if (window.worldState.activeWorldId === id) {
                window.worldState.name = newName;
                let nameEl = document.getElementById("wNameEl");
                if (nameEl) nameEl.value = newName;
                window.saveWorldState();
            }
            renderSidebarWorlds();
            triggerWorldSelectorSync();
        }
    };

    // Render Saved Worlds inside Sidebar
    window.renderSidebarWorlds = function (searchQuery = "") {
        let listEl = document.getElementById("sidebarWorldListEl");
        if (!listEl) return;

        let saved = [];
        try {
            saved = JSON.parse(localStorage.savedWorlds || "[]");
        } catch (e) {}

        let query = searchQuery.toLowerCase().trim();
        let filtered = saved.filter(w => w.name.toLowerCase().includes(query));

        if (filtered.length === 0) {
            listEl.innerHTML = `<div class="sidebar-empty-state"><i class="bi bi-globe"></i>No saved worlds found.</div>`;
            return;
        }

        listEl.innerHTML = filtered.map(w => {
            let isActive = (w.id === window.worldState.activeWorldId) ? " active-save" : "";
            let cardBg = w.bannerUrl ? `background-image: url(${w.bannerUrl}); background-size: cover; background-position: center;` : `background: rgba(255, 255, 255, 0.02);`;
            let settingLabel = w.setting ? w.setting.replace(/_/g, " ") : "Any Setting";

            return `
                <div class="sidebar-save-item${isActive}" onclick="loadWorld(${w.id})">
                    <div class="sidebar-save-banner" style="${cardBg}">
                        <div class="sidebar-save-banner-overlay"></div>
                    </div>
                    <div class="sidebar-save-header">
                        <b class="sidebar-save-label" ondblclick="renameSavedWorld(${w.id}, this)" title="Double-click to rename">${w.name}</b>
                        <div class="sidebar-save-actions" onclick="event.stopPropagation()">
                            <button class="btn btn-ghost btn-sm sidebar-save-action-btn" onclick="duplicateWorld(${w.id})" title="Duplicate"><i class="bi bi-copy"></i></button>
                            <button class="btn btn-danger btn-sm sidebar-save-action-btn" onclick="deleteWorld(${w.id})" title="Delete"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                    <span class="sidebar-save-meta">Setting: ${settingLabel}</span>
                </div>
            `;
        }).join("");
    };

    // Synchronize select menus inside character and roleplay tabs
    window.triggerWorldSelectorSync = function () {
        let saved = [];
        try {
            saved = JSON.parse(localStorage.savedWorlds || "[]");
        } catch (e) {}

        let charDropdown = document.getElementById("charWorldImportSelector");
        let rpDropdown = document.getElementById("rpWorldImportSelector");

        let optionsHtml = `<option value="">-- Load Saved World --</option>`;
        optionsHtml += saved.map(w => `<option value="${w.id}">${w.name}</option>`).join("");

        if (charDropdown) charDropdown.innerHTML = optionsHtml;
        if (rpDropdown) rpDropdown.innerHTML = optionsHtml;
    };

    // Exports and imports saved worlds lists
    window.exportSavedWorlds = function () {
        let data = localStorage.savedWorlds || "[]";
        let blob = new Blob([data], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "saved_worlds.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    window.importSavedWorlds = function () {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
            let file = e.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    let parsed = JSON.parse(evt.target.result);
                    if (Array.isArray(parsed)) {
                        let saved = JSON.parse(localStorage.savedWorlds || "[]");
                        // Deduplicate by ID
                        let count = 0;
                        parsed.forEach(w => {
                            if (w.id && w.name) {
                                let idx = saved.findIndex(x => x.id === w.id);
                                if (idx !== -1) {
                                    saved[idx] = w; // Overwrite
                                } else {
                                    saved.push(w); // Append
                                }
                                count++;
                            }
                        });
                        localStorage.savedWorlds = JSON.stringify(saved);
                        renderSidebarWorlds();
                        triggerWorldSelectorSync();
                        alert(`Successfully imported ${count} world(s).`);
                    } else {
                        alert("Invalid file format. Must be a JSON list.");
                    }
                } catch (err) {
                    alert("Import failed: " + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    window.clearAllSavedWorlds = function () {
        if (confirm("Are you sure you want to delete ALL saved worlds? This cannot be undone.")) {
            localStorage.removeItem("savedWorlds");
            window.worldState.activeWorldId = null;
            window.saveWorldState();
            updateWorldTopBarSaveButtons();
            renderSidebarWorlds();
            triggerWorldSelectorSync();
        }
    };

    // Sync World into Character Generator
    window.loadSavedWorldIntoCharGen = function (id) {
        if (!id) return;
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedWorlds || "[]");
        let w = saved.find(x => x.id === id);
        if (!w) return;

        window.showConfirmDialog(
            `Import settings from world <b>${w.name}</b> into the Character Generator? This will overwrite the current active settings and World Lore text.`,
            'warnOnLoad',
            () => {
                // Populate name, lore, and visual images
                let nameEl = document.getElementById("worldNameEl");
                let loreEl = document.getElementById("worldLoreEl");
                if (nameEl) { nameEl.value = w.name; localStorage.worldName = w.name; }
                
                // Formulate lore text from Overview section
                let loreText = w.sections.overview || "";
                if (loreEl) { loreEl.value = loreText; localStorage.worldLore = loreText; }

                // Restore setting dropdown
                selectSetting(w.setting || "Any", false);

                // Restore tones
                localStorage.tones = JSON.stringify(w.tones || ["Any"]);
                loadTones();

                // Restore image URL
                if (w.bannerUrl) {
                    updateWorldLoreVisuals(w.bannerUrl);
                } else {
                    let container = document.getElementById("worldLoreImgContainer");
                    if (container) container.style.display = "none";
                    if (typeof worldLoreBgEl !== 'undefined') worldLoreBgEl.style.backgroundImage = "none";
                    localStorage.removeItem("worldLoreImageUrl");
                }

                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();

                // Display status feedback
                let bannerEl = document.getElementById("referencedCharactersBannerEl");
                if (bannerEl) {
                    let countEl = document.getElementById("referencedCharactersCountEl");
                    let origDisplay = bannerEl.style.display;
                    bannerEl.style.display = "block";
                    if (countEl) countEl.innerHTML = `<span style="color:#10b981;"><i class="bi bi-check-circle-fill"></i> Loaded details from world "${w.name}".</span>`;
                    setTimeout(() => {
                        bannerEl.style.display = origDisplay;
                        updateReferencesBanner();
                    }, 3000);
                }
            }
        );
    };

    window.importWorldFromWikiUrl = async function (url) {
        if (!url) return;
        url = url.trim();
        if (!/^https?:\/\//i.test(url)) {
            alert("Please enter a valid URL (starting with http:// or https://)");
            return;
        }
        setGenerationStatus("⏳ Fetching page content...");
        try {
            let content = "";
            let response = await superFetch(url);
            let blob = await response.blob();
            let html = await blob.text();
            let doc = new DOMParser().parseFromString(html, "text/html");
            if (/^https:\/\/[^.]+.fandom\.com\/wiki\//.test(url)) {
                let wikiPageName = url.split("/wiki/").at(-1).split("?")[0];
                let urlObj = new URL(url);
                let json = await superFetch(`https://${urlObj.hostname}/api.php?action=visualeditor&format=json&paction=wikitext&page=${wikiPageName}&uselang=en&formatversion=2`).then(r => r.json());
                content = json?.visualeditor?.content || "";
                content = content.replace(/<ref[ >].+<\/ref>/g, "");
                content = content.replace(/\[\[File:.+?\]\]/g, "");
                content = content.replace(/\[\[(.+?)\|(.+?)\]\]/g, "$2");
                content = content.replace(/\[\[(.+?)\]\]/g, "$1");
                content = content.replace(/<br>/g, "\n");
            } else {
                if (!window.Readability) {
                    window.Readability = await import("https://user.uploads.dev/file/93edd249920ca5ac663278139c31868d.js")
                        .then(m => m.Readability)
                        .catch(err => {
                            console.warn("Failed to load readability module:", err);
                            return null;
                        });
                }
                if (window.Readability) {
                    try {
                        let article = new window.Readability(new DOMParser().parseFromString(html, "text/html")).parse();
                        content = article ? article.textContent : doc.body.innerText;
                    } catch (readError) {
                        console.warn("Readability parsing error, falling back to innerText:", readError);
                        content = doc.body.innerText;
                    }
                } else {
                    content = doc.body.innerText;
                }
            }
            setGenerationStatus("🧠 Extracting world setting...");
            let override = (document.getElementById("wWikiOverrideEl") || {}).value || "";
            root.content = content;
            root.override = override;
            let instruction = root.prompts.worldPage.wikiImport.instruction.evaluateItem;
            
            let res = await ai({ instruction });
            let jsonText = res.text || "";
            let jsonMatch = jsonText.match(/\{[\s\S]*\}/);
            let cleanedJson = jsonMatch ? jsonMatch[0] : jsonText.replace(/```json|```/g, "").trim();
            let json = JSON.parse(cleanedJson);

            // Populate World Generator Tab
            if (json.name) {
                window.worldState.name = json.name;
                let wNameEl = document.getElementById("wNameEl");
                if (wNameEl) wNameEl.value = json.name;
            }
            if (json.setting) {
                window.worldState.setting = json.setting;
                window.selectWorldSetting(json.setting, false);
            }
            if (json.tones && Array.isArray(json.tones)) {
                window.worldState.tones = json.tones;
                // Update Tone checkbox checklist in DOM
                document.querySelectorAll(".wToneCheckbox").forEach(cb => {
                    cb.checked = json.tones.includes(cb.value);
                });
                let anyBox = document.getElementById("wToneAnyCheckbox");
                if (anyBox) {
                    anyBox.checked = json.tones.includes("Any") || json.tones.length === 0;
                }
                window.updateWorldToneLabel();
            }
            if (json.themes) {
                window.worldState.themes = json.themes;
                let wThemesEl = document.getElementById("wThemesEl");
                if (wThemesEl) wThemesEl.value = json.themes;
            }

            // Sections
            let list = ["overview", "rules", "races", "regions", "factions", "bestiary", "characters"];
            list.forEach(s => {
                if (json[s]) {
                    let cleanedVal = json[s].replace(/\u2014/g, " - ");
                    window.worldState.sections[s] = cleanedVal;
                    let out = document.getElementById(`w-${s}OutputEl`);
                    let edit = document.getElementById(`w-${s}EditBtnEl`);
                    let copy = document.getElementById(`w-${s}CopyBtnEl`);
                    if (out) {
                        out.innerHTML = formatSectionText(cleanedVal);
                        out.style.display = "block";
                    }
                    if (edit) edit.style.display = "inline-block";
                    if (copy) copy.style.display = "inline-block";
                }
            });

            window.saveWorldState();
            
            // Auto generate banner image if overview is present
            if (json.overview || json.themes) {
                await generateWorldBanner();
            }

            setGenerationStatus("✨ World imported!");
            setTimeout(() => setGenerationStatus(""), 3000);
        } catch (e) {
            console.error(e);
            alert("Error importing world from URL.");
            setGenerationStatus("");
        }
    };

    window.importWorldFromWikiUrlButtonClickHandler = async function () {
        let btn = document.getElementById("wWikiImportBtnEl");
        let urlEl = document.getElementById("wWikiUrlEl");
        if (!urlEl || !urlEl.value) return;
        if (btn) btn.disabled = true;
        await window.importWorldFromWikiUrl(urlEl.value);
        if (btn) btn.disabled = false;
    };

    // Load active world state on DOMContentLoaded or defer script evaluation
    setTimeout(() => {
        window.loadWorldState();
        
        // Restore name and themes textarea values if present
        let nameEl = document.getElementById("wNameEl");
        let themesEl = document.getElementById("wThemesEl");
        let lengthEl = document.getElementById("wLengthEl");

        if (nameEl) nameEl.value = window.worldState.name || "";
        if (themesEl) themesEl.value = window.worldState.themes || "";
        if (lengthEl) lengthEl.value = window.worldState.activeLength || "medium";

        let notes = window.worldState.sectionNotes || {};
        let overviewNotesEl = document.getElementById("w-overviewNotesEl");
        let rulesNotesEl = document.getElementById("w-rulesNotesEl");
        let racesNotesEl = document.getElementById("w-racesNotesEl");
        let regionsNotesEl = document.getElementById("w-regionsNotesEl");
        let factionsNotesEl = document.getElementById("w-factionsNotesEl");
        let bestiaryNotesEl = document.getElementById("w-bestiaryNotesEl");
        let charactersNotesEl = document.getElementById("w-charactersNotesEl");

        if (overviewNotesEl) overviewNotesEl.value = notes.overview || "";
        if (rulesNotesEl) rulesNotesEl.value = notes.rules || "";
        if (racesNotesEl) racesNotesEl.value = notes.races || "";
        if (regionsNotesEl) regionsNotesEl.value = notes.regions || "";
        if (factionsNotesEl) factionsNotesEl.value = notes.factions || "";
        if (bestiaryNotesEl) bestiaryNotesEl.value = notes.bestiary || "";
        if (charactersNotesEl) charactersNotesEl.value = notes.characters || "";

        // Custom setting and tones dropdown configurations
        initCustomWorldSettingDropdown();
        initCustomWorldToneDropdown();
        loadWorldTones();
        if (typeof window.sortDropdownList === "function") {
            window.sortDropdownList("wSettingOptionsList");
            window.sortDropdownList("wToneOptionsList");
        }
        updateWorldBannerUI(window.worldState.bannerUrl);

        // Populate dynamic section text outputs
        let list = ["overview", "rules", "races", "regions", "factions", "bestiary", "characters"];
        list.forEach(s => {
            let text = window.worldState.sections[s] || "";
            let out = document.getElementById(`w-${s}OutputEl`);
            let edit = document.getElementById(`w-${s}EditBtnEl`);
            let copy = document.getElementById(`w-${s}CopyBtnEl`);
            if (out && text) {
                out.innerHTML = formatSectionText(text);
                out.style.display = "block";
                if (edit) edit.style.display = "inline-block";
                if (copy) copy.style.display = "inline-block";
            }
        });

        // Initialize sidebar lists
        renderSidebarWorlds();
        triggerWorldSelectorSync();
        updateWorldTopBarSaveButtons();
    }, 100);

})();
