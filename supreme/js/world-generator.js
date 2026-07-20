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

    // Helper to check if the active world has any input content
    function hasWorldContent() {
        if ((window.worldState.name || "").trim()) return true;
        if ((window.worldState.themes || "").trim()) return true;
        if (window.worldState.bannerUrl) return true;
        if (window.worldState.setting !== "Any") return true;
        if (window.worldState.tones && window.worldState.tones.length > 0 && window.worldState.tones[0] !== "Any") return true;
        
        let sections = window.worldState.sections || {};
        for (let key in sections) {
            if ((sections[key] || "").trim()) return true;
        }
        let notes = window.worldState.sectionNotes || {};
        for (let key in notes) {
            if ((notes[key] || "").trim()) return true;
        }
        return false;
    }

    // Synchronize world name inputs across all tabs
    window.syncWorldName = function (name) {
        window.worldState.name = name;
        localStorage.worldName = name;
        
        let nameEl = document.getElementById("worldNameEl");
        let wNameEl = document.getElementById("wNameEl");
        let rpWorldNameEl = document.getElementById("rpWorldNameEl");
        
        if (nameEl && nameEl.value !== name) nameEl.value = name;
        if (wNameEl && wNameEl.value !== name) wNameEl.value = name;
        if (rpWorldNameEl && rpWorldNameEl.value !== name) rpWorldNameEl.value = name;
    };

    window.worldImportScope = localStorage.worldImportScope || "overview";

    window.compileWorldLoreText = function (w, scope) {
        if (!w) w = window.worldState || {};
        scope = scope || window.worldImportScope || "overview";
        let sections = Object.assign({}, w.sections || {});
        
        let keys = ["overview", "rules", "races", "regions", "factions", "bestiary", "characters"];
        keys.forEach(k => {
            let el = document.getElementById(`w-${k}OutputEl`);
            if (el && el.innerText && el.innerText.trim()) {
                sections[k] = el.innerText.trim();
            }
        });
        
        if (scope === "overview") {
            return sections.overview || "";
        }
        
        let parts = [];
        let titles = {
            overview: "WORLD OVERVIEW",
            rules: "RULES & SYSTEM",
            races: "RACES & SPECIES",
            regions: "REGIONS & LANDMARKS",
            factions: "FACTIONS & GROUPS",
            bestiary: "BESTIARY & CREATURES",
            characters: "KEY CHARACTERS"
        };
        
        for (let key of keys) {
            let val = (sections[key] || "").trim();
            if (val) {
                parts.push(`=== ${titles[key]} ===\n${val}`);
            }
        }
        return parts.join("\n\n");
    };

    window.setWorldImportScope = function (scope) {
        window.worldImportScope = scope;
        localStorage.worldImportScope = scope;
        
        let labelText = scope === "all" ? "All Panels" : "Overview Only";
        let iconClass = scope === "all" ? "bi bi-layers-fill" : "bi bi-layers-half";
        
        document.querySelectorAll(".worldImportScopeBtn").forEach(btn => {
            btn.innerHTML = `<i class="${iconClass}"></i> ${labelText}`;
        });
        
        if (window.worldState) {
            let loreText = window.compileWorldLoreText(window.worldState, scope);
            window.syncWorldLore(loreText);
        }
        if (typeof window.updateBrainContextView === "function") {
            window.updateBrainContextView();
        }
    };

    window.toggleWorldImportScope = function () {
        let current = window.worldImportScope || "overview";
        let next = current === "overview" ? "all" : "overview";
        window.setWorldImportScope(next);
    };

    // Synchronize world lore / overview output across all tabs
    window.syncWorldLore = function (loreText) {
        localStorage.worldLore = loreText;
        
        let loreEl = document.getElementById("worldLoreEl");
        let wOverviewOutputEl = document.getElementById("w-overviewOutputEl");
        let rpWorldLoreEl = document.getElementById("rpWorldLoreEl");
        let rpWorldOutputEl = document.getElementById("rpWorldOutputEl");
        
        if (loreEl && loreEl.value !== loreText) loreEl.value = loreText;
        if (rpWorldLoreEl && rpWorldLoreEl.value !== loreText) rpWorldLoreEl.value = loreText;
        
        if (rpWorldOutputEl) {
            rpWorldOutputEl.innerHTML = window.formatSectionText(loreText);
        }
        if (window.roleplayState) {
            window.roleplayState.worldLore = loreText;
            if (typeof window.saveRoleplayState === "function") window.saveRoleplayState();
        }
        
        if (wOverviewOutputEl) {
            let overviewText = window.worldState?.sections?.overview || loreText;
            if (overviewText) {
                wOverviewOutputEl.innerHTML = window.formatSectionText(overviewText);
                wOverviewOutputEl.style.display = "block";
                let edit = document.getElementById("w-overviewEditBtnEl");
                let copy = document.getElementById("w-overviewCopyBtnEl");
                if (edit) edit.style.display = "inline-block";
                if (copy) copy.style.display = "inline-block";
            } else {
                wOverviewOutputEl.innerHTML = "";
                wOverviewOutputEl.style.display = "none";
                let edit = document.getElementById("w-overviewEditBtnEl");
                let copy = document.getElementById("w-overviewCopyBtnEl");
                if (edit) edit.style.display = "none";
                if (copy) copy.style.display = "none";
            }
        }
        if (typeof window.updateBrainContextView === "function") {
            window.updateBrainContextView();
        }
    };

    // Synchronize dropdown load selectors on Characters and Roleplay tabs
    window.syncWorldSelectors = function (id) {
        let charDropdown = document.getElementById("charWorldImportSelector");
        let rpDropdown = document.getElementById("rpWorldImportSelector");
        let rpWorldImportBtnSelect = document.getElementById("rpWorldImportBtnSelect");
        if (charDropdown) charDropdown.value = id || "";
        if (rpDropdown) rpDropdown.value = id || "";
        if (rpWorldImportBtnSelect) rpWorldImportBtnSelect.value = id || "";
    };

    // Apply world state to all DOM elements in the workspace
    window.applyWorldToWorkspace = function (w) {
        if (!w) return;
        
        // 1. Sync Name
        window.syncWorldName(w.name || "");
        
        // 2. Sync Section Notes and Sections in World tab first
        window.worldState.sectionNotes = Object.assign({
            overview: "", rules: "", races: "", regions: "", factions: "", bestiary: "", characters: ""
        }, w.sectionNotes || {});
        window.worldState.sections = Object.assign({
            overview: "", rules: "", races: "", regions: "", factions: "", bestiary: "", characters: ""
        }, w.sections || {});

        // 3. Sync Lore based on active Scope
        let compiledLore = window.compileWorldLoreText(w, window.worldImportScope);
        window.syncWorldLore(compiledLore);
        
        // 4. Sync Setting
        if (typeof selectWorldSetting === "function") selectWorldSetting(w.setting || "Any", false);
        if (typeof selectSetting === "function") selectSetting(w.setting || "Any", false);
        if (typeof selectRoleplaySetting === "function") selectRoleplaySetting(w.setting || "Any", false);
        
        // 5. Sync Tones
        window.worldState.tones = w.tones || ["Any"];
        localStorage.tones = JSON.stringify(w.tones || ["Any"]);
        if (typeof loadWorldTones === "function") loadWorldTones();
        if (typeof loadTones === "function") loadTones();
        if (typeof updateRoleplayToneLabel === "function") {
            document.querySelectorAll(".rpToneCheckbox").forEach(cb => {
                cb.checked = (w.tones || ["Any"]).includes(cb.value);
            });
            let anyBox = document.getElementById("rpToneAnyCheckbox");
            if (anyBox) anyBox.checked = (w.tones || ["Any"]).includes("Any") || (w.tones || []).length === 0;
            updateRoleplayToneLabel();
        }
        
        // 6. Sync Themes
        window.worldState.themes = w.themes || "";
        let wThemesEl = document.getElementById("wThemesEl");
        let rpThemesEl = document.getElementById("rpThemesEl");
        if (wThemesEl) wThemesEl.value = w.themes || "";
        if (rpThemesEl) rpThemesEl.value = w.themes || "";
        
        // 7. Sync Banner/Visuals
        window.worldState.bannerUrl = w.bannerUrl || "";
        if (w.bannerUrl) {
            if (typeof updateWorldLoreVisuals === "function") updateWorldLoreVisuals(w.bannerUrl);
            if (typeof updateWorldBannerUI === "function") updateWorldBannerUI(w.bannerUrl);
        } else {
            let container = document.getElementById("worldLoreImgContainer");
            if (container) container.style.display = "none";
            if (typeof worldLoreBgEl !== 'undefined') worldLoreBgEl.style.backgroundImage = "none";
            localStorage.removeItem("worldLoreImageUrl");
            if (typeof updateWorldBannerUI === "function") updateWorldBannerUI("");
        }
        
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

        let list = ["overview", "rules", "races", "regions", "factions", "bestiary", "characters"];
        list.forEach(s => {
            let text = window.worldState.sections[s] || "";
            let out = document.getElementById(`w-${s}OutputEl`);
            let edit = document.getElementById(`w-${s}EditBtnEl`);
            let copy = document.getElementById(`w-${s}CopyBtnEl`);
            if (out) {
                if (text) {
                    out.innerHTML = window.formatSectionText(text);
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
        
        window.syncWorldSelectors(w.id || window.worldState.activeWorldId);
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
    window.saveWorldState = window.debounce(function () {
        try {
            // Read basic inputs from DOM if present
            let nameEl = document.getElementById("wNameEl");
            if (nameEl) window.worldState.name = nameEl.value;

            let themesEl = document.getElementById("wThemesEl");
            if (themesEl) window.worldState.themes = themesEl.value;

            let lengthEl = document.getElementById("wLengthEl");
            if (lengthEl) window.worldState.activeLength = lengthEl.value;
            
            let overviewNotesEl = document.getElementById("w-overviewNotesEl");
            let rulesNotesEl = document.getElementById("w-rulesNotesEl");
            let racesNotesEl = document.getElementById("w-racesNotesEl");
            let regionsNotesEl = document.getElementById("w-regionsNotesEl");
            let factionsNotesEl = document.getElementById("w-factionsNotesEl");
            let bestiaryNotesEl = document.getElementById("w-bestiaryNotesEl");
            let charactersNotesEl = document.getElementById("w-charactersNotesEl");

            if (overviewNotesEl || rulesNotesEl) {
                window.worldState.sectionNotes = {
                    overview: overviewNotesEl?.value || "",
                    rules: rulesNotesEl?.value || "",
                    races: racesNotesEl?.value || "",
                    regions: regionsNotesEl?.value || "",
                    factions: factionsNotesEl?.value || "",
                    bestiary: bestiaryNotesEl?.value || "",
                    characters: charactersNotesEl?.value || ""
                };
            }

            // Save active workspace state
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

            // Autosave to savedWorlds list
            let saved = [];
            try {
                saved = JSON.parse(localStorage.savedWorlds || "[]");
            } catch (e) {}

            let activeId = window.worldState.activeWorldId;
            if (activeId !== null) {
                let idx = saved.findIndex(w => w.id === activeId);
                if (idx !== -1) {
                    saved[idx] = {
                        id: activeId,
                        name: window.worldState.name || "Unnamed World",
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
                    window.syncWorldSelectors(activeId);
                }
            } else if (hasWorldContent()) {
                // Auto-create new saved world slot
                let newId = Date.now();
                window.worldState.activeWorldId = newId;
                
                // Resave active state to update activeWorldId
                localStorage.activeWorldState = JSON.stringify({
                    name: window.worldState.name,
                    setting: window.worldState.setting,
                    tones: window.worldState.tones,
                    themes: window.worldState.themes,
                    bannerUrl: window.worldState.bannerUrl,
                    sections: window.worldState.sections,
                    sectionNotes: window.worldState.sectionNotes,
                    activeWorldId: newId,
                    activeLength: window.worldState.activeLength
                });

                saved.push({
                    id: newId,
                    name: window.worldState.name || "Unnamed World",
                    setting: window.worldState.setting,
                    tones: window.worldState.tones,
                    themes: window.worldState.themes,
                    bannerUrl: window.worldState.bannerUrl,
                    sections: Object.assign({}, window.worldState.sections),
                    sectionNotes: Object.assign({}, window.worldState.sectionNotes),
                    timestamp: Date.now()
                });
                localStorage.savedWorlds = JSON.stringify(saved);
                renderSidebarWorlds();
                triggerWorldSelectorSync();
                window.syncWorldSelectors(newId);
            }
        } catch (e) {
            console.warn("Failed to save activeWorldState:", e);
        }
    }, 300);
/* ==========================================================================
   CUSTOM DROPDOWN CONFIGURATION
   ========================================================================== */
    window.selectWorldSetting = function (value) {
        window.worldState.setting = value;
        const wSettingEl = document.getElementById("wSettingEl");
        if (wSettingEl) {
            wSettingEl.value = value;
            window.syncCustomSelectLabel(wSettingEl);
        }
        window.saveWorldState();
    };

    window.getSelectedWorldTones = function () {
        const sel = multiSelectState["wToneEl"];
        if (!sel || sel.size === 0 || (sel.size === 1 && sel.has("none"))) {
            return ["Any"];
        }
        return Array.from(sel).filter(v => v !== "none");
    };

    window.saveWorldTones = function () {
        window.worldState.tones = getSelectedWorldTones();
        window.saveWorldState();
    };

    window.updateWorldToneLabel = function () {
        window.syncCustomSelectLabel("wToneEl");
    };

    window.loadWorldTones = function () {
        try {
            let saved = window.worldState.tones || ["Any"];
            const sel = new Set();
            if (!saved || saved.length === 0 || saved[0] === "Any" || saved[0] === "none") {
                sel.add("none");
            } else {
                saved.forEach(t => {
                    if (t !== "Any") sel.add(t);
                });
            }
            multiSelectState["wToneEl"] = sel;
        } catch (e) {
            multiSelectState["wToneEl"] = new Set(["none"]);
        }
        window.syncCustomSelectLabel("wToneEl");
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

        let instruction = root.prompts.worldPage.sectionGeneration.compile(
            section,
            window.literal(wName),
            wSetting,
            wTones,
            window.literal(wThemes),
            window.literal(sectionNotes),
            lengthInstruction
        );

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
        root.wName = window.literal(window.worldState.name || "Unnamed");
        root.wSetting = window.worldState.setting;
        root.wTones = window.worldState.tones.join(", ");
        root.overviewText = window.literal(overviewText);
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
                let lengthEl = document.getElementById("wLengthEl");
                if (lengthEl) lengthEl.value = "medium";
                
                window.worldState.name = "";
                window.worldState.setting = "Any";
                window.worldState.tones = ["Any"];
                window.worldState.themes = "";
                window.worldState.bannerUrl = "";
                window.worldState.activeWorldId = null;
                window.worldState.sections = {
                    overview: "", rules: "", races: "", regions: "", factions: "", bestiary: "", characters: ""
                };
                window.worldState.sectionNotes = {
                    overview: "", rules: "", races: "", regions: "", factions: "", bestiary: "", characters: ""
                };

                // Clear statuses
                let list = ["overview", "rules", "races", "regions", "factions", "bestiary", "characters"];
                list.forEach(s => {
                    let stat = document.getElementById(`w-${s}StatusEl`);
                    if (stat) stat.textContent = "";
                });

                // Apply clear state globally across all tabs
                window.applyWorldToWorkspace(window.worldState);
                
                window.saveWorldState();
                renderSidebarWorlds();
            }
        );
    };
/* ==========================================================================
   LOCAL DATABASE AND FILE SAVE SLOTS MANAGEMENT
   ========================================================================== */
    // Stub function since manual save buttons are removed (autosaved)
    window.updateWorldTopBarSaveButtons = function () {};

    window.updateWorld = function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = [];
        try {
            saved = JSON.parse(localStorage.savedWorlds || "[]");
        } catch (e) {}
        
        let idx = saved.findIndex(x => x.id === id);
        if (idx === -1) return;
        
        let worldName = saved[idx].name;
        
        window.showConfirmDialog(
            `Are you sure you want to update <b>${worldName}</b> with the current active world edits on the screen? This will permanently overwrite the saved world file.`,
            'warnOnUpdate',
            () => {
                saved[idx] = {
                    id: id,
                    name: window.worldState.name || "Unnamed World",
                    setting: window.worldState.setting,
                    tones: window.worldState.tones,
                    themes: window.worldState.themes,
                    bannerUrl: window.worldState.bannerUrl,
                    sections: Object.assign({}, window.worldState.sections),
                    sectionNotes: Object.assign({}, window.worldState.sectionNotes),
                    timestamp: Date.now()
                };
                localStorage.savedWorlds = JSON.stringify(saved);
                window.worldState.activeWorldId = id;
                window.saveWorldState();
                renderSidebarWorlds();
                triggerWorldSelectorSync();
                window.syncWorldSelectors(id);
                alert(`World "${worldName}" updated successfully.`);
            }
        );
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
                window.applyWorldToWorkspace(w);
                window.saveWorldState();
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
        let filteredSaved = saved.filter(w => w.name.toLowerCase().includes(query));

        if (filteredSaved.length === 0) {
            listEl.innerHTML = `<div class="sidebar-empty-state"><i class="bi bi-globe"></i>No saved worlds found.</div>`;
            return;
        }

        let html = `<div class="sidebar-group-header">Saved Worlds (${filteredSaved.length})</div>`;
        html += filteredSaved.map(w => {
            let isActive = (w.id === window.worldState.activeWorldId) ? " active-save" : "";
            let cardBg = w.bannerUrl ? `background-image: url(${w.bannerUrl}); background-size: cover; background-position: center;` : `background: rgba(255, 255, 255, 0.02);`;
            let settingLabel = w.setting ? w.setting.replace(/_/g, " ") : "Any Setting";

            return `
                <div class="sidebar-save-item${isActive}">
                    <div class="sidebar-save-banner" style="${cardBg}">
                        <div class="sidebar-save-banner-overlay"></div>
                    </div>
                    <div class="sidebar-save-header">
                        <b class="sidebar-save-label" ondblclick="renameSavedWorld(${w.id}, this)" title="Double-click to rename">${w.name}</b>
                    </div>
                    <span class="sidebar-save-meta">Setting: ${settingLabel}</span>
                    <div class="sidebar-char-actions" style="margin-top:0.4rem;">
                        <button onclick="loadWorld(${w.id})" class="btn btn-secondary btn-sm sidebar-char-btn-load" title="Load world"><i class="bi bi-folder-open"></i> load</button>
                        <button onclick="updateWorld(${w.id})" class="btn btn-secondary btn-sm sidebar-char-btn-update" title="Update slot with screen edits"><i class="bi bi-floppy"></i> update</button>
                        <button onclick="duplicateWorld(${w.id})" class="btn btn-secondary btn-sm sidebar-char-btn-dupe" title="Duplicate"><i class="bi bi-copy"></i> dupe</button>
                        <button onclick="deleteWorld(${w.id})" class="btn btn-danger btn-sm sidebar-char-btn-delete" title="Delete"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;
        }).join("");

        listEl.innerHTML = html;
    };

    // Synchronize select menus inside character and roleplay tabs
    window.triggerWorldSelectorSync = function () {
        let saved = [];
        try {
            saved = JSON.parse(localStorage.savedWorlds || "[]");
        } catch (e) {}

        let charDropdown = document.getElementById("charWorldImportSelector");
        let rpDropdown = document.getElementById("rpWorldImportSelector");
        let rpWorldImportBtnSelect = document.getElementById("rpWorldImportBtnSelect");

        let optionsHtml = `<option value="">-- Load Saved World --</option>`;
        optionsHtml += saved.map(w => `<option value="${w.id}">${w.name}</option>`).join("");

        if (charDropdown) charDropdown.innerHTML = optionsHtml;
        if (rpDropdown) rpDropdown.innerHTML = optionsHtml;
        
        if (rpWorldImportBtnSelect) {
            let importBtnOptions = `<option value="">-- Select Saved World --</option>`;
            importBtnOptions += saved.map(w => `<option value="${w.id}">${w.name}</option>`).join("");
            rpWorldImportBtnSelect.innerHTML = importBtnOptions;
        }
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
        window.loadWorld(id);
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

/* ==========================================================================
   WORLD EXPORTS & TOP BAR HELPERS
   ========================================================================== */
    window.exportWorldAsMarkdown = function () {
        let w = window.worldState || {};
        let title = (w.name || "Unnamed World").trim();
        let safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "_");

        let lines = [];
        lines.push(`# ${title}`);
        lines.push(``);
        if (w.setting && w.setting !== "Any") lines.push(`**Setting / Genre:** ${w.setting}`);
        if (w.tones && w.tones.length > 0) lines.push(`**Atmospheric Tones:** ${Array.isArray(w.tones) ? w.tones.join(", ") : w.tones}`);
        if (w.themes) lines.push(`**Core Themes:** ${w.themes}`);
        lines.push(``);

        const sectionTitles = {
            overview: "World Overview",
            rules: "System & Rules",
            races: "Races & Species",
            regions: "Geography & Regions",
            factions: "Factions & Organizations",
            bestiary: "Bestiary & Creatures",
            characters: "Key Figures & History"
        };

        let sections = w.sections || {};
        for (let key in sectionTitles) {
            let text = (sections[key] || "").trim();
            if (text) {
                lines.push(`## ${sectionTitles[key]}`);
                lines.push(text);
                lines.push(``);
            }
        }

        let markdownText = lines.join("\n");
        let blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${safeTitle}_world.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    window.exportWorldAsJson = function () {
        let w = window.worldState || {};
        let title = (w.name || "Unnamed World").trim();
        let safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
        
        let jsonStr = JSON.stringify(w, null, 2);
        let blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${safeTitle}_world.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    window.saveWorldFromTopBar = function (btn) {
        if (window.saveWorldState) window.saveWorldState();
        if (btn) {
            let orig = btn.innerHTML;
            btn.innerHTML = `<i class="bi bi-check-lg"></i> Saved!`;
            setTimeout(() => { btn.innerHTML = orig; }, 2000);
        }
    };


    // Load active world state on DOMContentLoaded or defer script evaluation
    setTimeout(() => {
        window.loadWorldState();
        
        // Sync Setting and Tones custom select labels
        window.selectWorldSetting(window.worldState.setting || "Any");
        window.loadWorldTones();
        
        // Apply loaded world state to workspace
        window.applyWorldToWorkspace(window.worldState);

        // Initialize sidebar lists
        renderSidebarWorlds();
        triggerWorldSelectorSync();
    }, 100);

})();
