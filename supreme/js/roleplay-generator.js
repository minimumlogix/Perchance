/* ==========================================================================
   ROLEPLAY GENERATOR MODULE INITIAL STATE & LOADERS
   ========================================================================== */
(function () {
    // Initial State
    window.roleplayState = {
        worldName: "",
        worldLore: "",
        userName: "",
        userRole: "",
        setting: "Any",
        tones: ["Any"],
        themes: "",
        npcs: [
            { name: "", species: "", personality: "", role: "" }
        ],
        scenarioNotes: "",
        outputScenario: "",
        outputStarter: "",
        isGenerating: false,
        activeOutputTab: "scenario" // "scenario" or "starter"
    };

    // Load state from localStorage on init
    window.loadRoleplayState = function () {
        try {
            if (localStorage.rpState) {
                let saved = JSON.parse(localStorage.rpState);
                window.roleplayState = Object.assign(window.roleplayState, saved);
            }
        } catch (e) {
            console.warn("Failed to load roleplayState from localStorage:", e);
        }
    };

    // Save state to localStorage
    window.saveRoleplayState = window.debounce(function () {
        try {
            // Read current DOM values
            window.roleplayState.worldName = document.getElementById("rpWorldNameEl")?.value || "";
            window.roleplayState.worldLore = document.getElementById("rpWorldLoreEl")?.value || "";
            window.roleplayState.userName = document.getElementById("rpUserNameEl")?.value || "";
            window.roleplayState.userRole = document.getElementById("rpUserRoleEl")?.value || "";
            window.roleplayState.scenarioNotes = document.getElementById("rpScenarioNotesEl")?.value || "";
            window.roleplayState.activeLength = document.getElementById("rpLengthEl")?.value || "medium";
            window.roleplayState.themes = document.getElementById("rpThemesEl")?.value || "";

            localStorage.rpState = JSON.stringify({
                worldName: window.roleplayState.worldName,
                worldLore: window.roleplayState.worldLore,
                userName: window.roleplayState.userName,
                userRole: window.roleplayState.userRole,
                setting: window.roleplayState.setting,
                tones: window.roleplayState.tones,
                themes: window.roleplayState.themes,
                npcs: window.roleplayState.npcs,
                scenarioNotes: window.roleplayState.scenarioNotes,
                activeLength: window.roleplayState.activeLength,
                outputScenario: window.roleplayState.outputScenario,
                outputStarter: window.roleplayState.outputStarter
            });
        } catch (e) {
            console.warn("Failed to save roleplayState to localStorage:", e);
        }
    }, 300);

    // Load a saved world into Roleplay inputs
    window.loadSavedWorldIntoRoleplay = function (id) {
        if (!id) return;
        window.loadWorld(id);
    };

    // Sync World Name & Lore from Character Generator World Panel
    window.syncWorldFromCharGen = function () {
        window.applyWorldToWorkspace(window.worldState);
        
        // Show status feedback
        let statusEl = document.getElementById("rpStatusEl");
        let outputSec = document.getElementById("rpOutputSectionEl");
        if (outputSec) outputSec.style.display = "block";
        if (statusEl) {
            statusEl.innerHTML = `<span style="color:#10b981;"><i class="bi bi-check-circle-fill"></i> Synced active world across workspace.</span>`;
            setTimeout(() => { statusEl.textContent = ""; }, 3000);
        }
    };
/* ==========================================================================
   DYNAMIC NPC GRID AND CAST LIST MANAGEMENT
   ========================================================================== */
    window.addNPC = function () {
        window.roleplayState.npcs.push({ name: "", species: "", personality: "", role: "" });
        window.renderNPCGrid();
        window.saveRoleplayState();
    };

    window.removeNPC = function (index) {
        if (window.roleplayState.npcs.length <= 1) {
            // Keep at least one NPC card but clear its contents
            window.roleplayState.npcs[0] = { name: "", species: "", personality: "", role: "" };
        } else {
            window.roleplayState.npcs.splice(index, 1);
        }
        window.renderNPCGrid();
        window.saveRoleplayState();
    };

    window.updateNPCField = function (index, field, value) {
        if (window.roleplayState.npcs[index]) {
            window.roleplayState.npcs[index][field] = value;
            window.saveRoleplayState();
        }
    };

    // Import detail properties from saved characters list
    window.importSavedCharToNPC = function (index, charId) {
        if (!charId) return;
        try {
            let saved = JSON.parse(localStorage.savedCharacters || "[]");
            // Match isNaN vs Number
            let targetId = isNaN(Number(charId)) ? charId : Number(charId);
            let character = saved.find(c => c.id === targetId);
            
            if (character && window.roleplayState.npcs[index]) {
                let d = character.details || {};
                let sections = character.characterSections || {};

                // Map traits
                let npcName = d.name || character.name || "";
                let npcSpecies = d.species || d.race || "";
                
                // Formulate a short personality/role summary
                let pSummary = "";
                if (sections.personality) {
                    // Extract first paragraph or short snippet of personality
                    pSummary += sections.personality.split("\n")[0].replace(/Personality:\s*/i, "").trim();
                }
                if (sections.beliefs && pSummary.length < 150) {
                    let b = sections.beliefs.split("\n")[0].replace(/Mentality:\s*/i, "").trim();
                    if (b) pSummary += (pSummary ? " " : "") + "Mentality: " + b;
                }

                let npcRole = "";
                if (sections.role) {
                    npcRole += sections.role.split("\n")[0].replace(/Role:\s*/i, "").trim();
                } else if (d.gender || d.age) {
                    npcRole = `${d.gender || ""} ${d.age || ""}`.trim();
                }

                // Update state
                window.roleplayState.npcs[index] = {
                    name: npcName,
                    species: npcSpecies,
                    personality: pSummary,
                    role: npcRole
                };

                window.renderNPCGrid();
                window.saveRoleplayState();
            }
        } catch (e) {
            console.error("Failed to import saved character:", e);
        }
    };

    // Render NPC card forms
    window.renderNPCGrid = function () {
        let grid = document.getElementById("rpNPCGrid");
        if (!grid) return;

        let savedChars = [];
        try {
            savedChars = JSON.parse(localStorage.savedCharacters || "[]");
        } catch (e) {}

        grid.innerHTML = window.roleplayState.npcs.map((npc, index) => {
            // Options to import
            let importOptions = savedChars.map(c => `<option value="${c.id}">${c.name || "Unnamed"}</option>`).join("");
            
            return `
                <div class="panel" style="border: 1px solid var(--panel-border); background: rgba(0,0,0,0.1); margin: 0; display: flex; flex-direction: column; gap: 0.6rem; padding: 1rem; border-radius: 8px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--panel-border); padding-bottom: 0.4rem; margin-bottom: 0.2rem;">
                        <span style="font-size: 82%; font-weight: 700; color: var(--accent-color);"><i class="bi bi-person-fill"></i> NPC #${index + 1}</span>
                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                            <!-- Import dropdown -->
                            <select onchange="importSavedCharToNPC(${index}, this.value)" class="select-input" style="font-size: 78%; padding: 0.15rem 1.4rem 0.15rem 0.4rem; max-width: 90px; height: 22px; cursor: pointer;">
                                <option value="">Import...</option>
                                ${importOptions}
                            </select>
                            <button onclick="generateRoleplayNPC(${index}, this)" class="btn btn-primary btn-sm" style="padding: 0.15rem 0.35rem; font-size: 75%; height: 22px;" title="Generate NPC details via AI"><i class="bi bi-sparkles"></i></button>
                            <button onclick="removeNPC(${index})" class="btn btn-danger btn-sm" style="padding: 0.15rem 0.35rem; font-size: 75%; height: 22px;" title="Remove NPC"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                        <div class="detail-field">
                            <label class="detail-label" style="font-size: 72%; min-width: 45px;">Name</label>
                            <input type="text" id="rpNPC-${index}-name" class="detail-input" style="font-size: 82%; padding: 0.35rem 0.5rem;" value="${npc.name || ""}" placeholder="NPC Name" oninput="updateNPCField(${index}, 'name', this.value)">
                        </div>
                        <div class="detail-field">
                            <label class="detail-label" style="font-size: 72%; min-width: 55px;">Species</label>
                            <input type="text" id="rpNPC-${index}-species" class="detail-input" style="font-size: 82%; padding: 0.35rem 0.5rem;" value="${npc.species || ""}" placeholder="e.g. Elf, Cyborg" oninput="updateNPCField(${index}, 'species', this.value)">
                        </div>
                    </div>
                    
                    <div class="detail-field">
                        <label class="detail-label" style="font-size: 72%; min-width: 70px;">Personality</label>
                        <input type="text" id="rpNPC-${index}-personality" class="detail-input" style="font-size: 82%; padding: 0.35rem 0.5rem;" value="${npc.personality || ""}" placeholder="e.g. Gruff, secretly soft, loyal" oninput="updateNPCField(${index}, 'personality', this.value)">
                    </div>
                    
                    <div class="detail-field">
                        <label class="detail-label" style="font-size: 72%; min-width: 70px;">Narrative Role</label>
                        <input type="text" id="rpNPC-${index}-role" class="detail-input" style="font-size: 82%; padding: 0.35rem 0.5rem;" value="${npc.role || ""}" placeholder="e.g. Companion, guide, sheriff" oninput="updateNPCField(${index}, 'role', this.value)">
                    </div>
                </div>
            `;
        }).join("");
    };
/* ==========================================================================
   CUSTOM DROPDOWN CONFIGURATION
   ========================================================================== */
    window.selectRoleplaySetting = function (value, closeMenu = true) {
        window.roleplayState.setting = value;
        let labelEl = document.getElementById("rpSettingLabel");
        if (labelEl) {
            labelEl.textContent = value.replace(/_/g, " ");
        }

        // Update active checkmarks in settings options list
        let items = document.querySelectorAll("#rpSettingOptionsList .dropdown-option-item");
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
            let menu = document.getElementById("rpSettingDropdownMenu");
            if (menu) menu.style.display = "none";
        }
        window.saveRoleplayState();
    };

    window.initCustomRoleplaySettingDropdown = function () {
        window.initializeDropdownOptions({
            listElId: "rpSettingOptionsList",
            fallbackKeys: window.SETTING_KEYS,
            perchanceSource: typeof root !== "undefined" ? root.settingPrompts : null,
            selectedValue: window.roleplayState.setting || "Any",
            onSelect: "selectRoleplaySetting",
            isMultiSelect: false
        });
        selectRoleplaySetting(window.roleplayState.setting || "Any", false);
    };

    window.initCustomRoleplayToneDropdown = function () {
        window.initializeDropdownOptions({
            listElId: "rpToneOptionsList",
            fallbackKeys: window.TONE_KEYS,
            perchanceSource: typeof root !== "undefined" ? root.tonePrompts : null,
            selectedValue: window.roleplayState.tones || ["Any"],
            onSelect: "handleRoleplayTone",
            isMultiSelect: true,
            inputName: "rpTone"
        });
        loadRoleplayTones();
    };

    window.filterRoleplayTones = function (query) {
        window.filterDropdownOptions("rpToneOptionsList", query);
    };

    window.filterRoleplaySettings = function (query) {
        window.filterDropdownOptions("rpSettingOptionsList", query);
    };

    // Tones management specifically for Roleplay Generator
    window.getSelectedRoleplayTones = function () {
        let checked = [...document.querySelectorAll(".rpToneCheckbox:checked")].map(c => c.value);
        return checked.length > 0 ? checked : ["Any"];
    };

    window.handleRoleplayToneChange = function () {
        let checked = [...document.querySelectorAll(".rpToneCheckbox:checked")];
        let anyBox = document.getElementById("rpToneAnyCheckbox");
        if (anyBox && checked.length > 0) anyBox.checked = false;
        
        window.roleplayState.tones = getSelectedRoleplayTones();
        updateRoleplayToneLabel();
        window.saveRoleplayState();
    };

    window.handleRoleplayToneAnyToggle = function (checkbox) {
        if (checkbox.checked) {
            document.querySelectorAll(".rpToneCheckbox").forEach(c => c.checked = false);
        }
        window.roleplayState.tones = ["Any"];
        updateRoleplayToneLabel();
        window.saveRoleplayState();
    };

    window.updateRoleplayToneLabel = function () {
        let tones = window.roleplayState.tones || ["Any"];
        let label = document.getElementById("rpToneDropdownLabel");
        if (label) {
            if (tones[0] === "Any") label.textContent = "Any";
            else if (tones.length === 1) label.textContent = tones[0].replace(/_/g, " ");
            else label.textContent = tones[0].replace(/_/g, " ") + " +" + (tones.length - 1);
        }
    };

    window.loadRoleplayTones = function () {
        try {
            let saved = window.roleplayState.tones || ["Any"];
            let anyBox = document.getElementById("rpToneAnyCheckbox");
            if (!saved || saved.length === 0 || saved[0] === "Any") {
                if (anyBox) anyBox.checked = true;
                document.querySelectorAll(".rpToneCheckbox").forEach(c => c.checked = false);
            } else {
                if (anyBox) anyBox.checked = false;
                document.querySelectorAll(".rpToneCheckbox").forEach(c => c.checked = false);
                saved.forEach(t => {
                    let box = document.querySelector(`.rpToneCheckbox[value="${t}"]`);
                    if (box) box.checked = true;
                });
            }
            updateRoleplayToneLabel();
        } catch (e) {
            let anyBox = document.getElementById("rpToneAnyCheckbox");
            if (anyBox) anyBox.checked = true;
            updateRoleplayToneLabel();
        }
    };

    // Magic wiki import for Roleplay Generator
    window.importRoleplayFromWikiUrl = async function (url) {
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
            setGenerationStatus("🧠 Extracting scenario details...");
            let override = (document.getElementById("rpWikiOverrideEl") || {}).value || "";
            root.content = window.literal(content);
            root.override = window.literal(override);
            let instruction = root.prompts.roleplayPage.wikiImport.instruction.evaluateItem;

            let res = await ai({ instruction });
            let jsonText = res.text || "";
            let jsonMatch = jsonText.match(/\{[\s\S]*\}/);
            let cleanedJson = jsonMatch ? jsonMatch[0] : jsonText.replace(/```json|```/g, "").trim();
            let json = JSON.parse(cleanedJson);

            // Populate Roleplay state
            if (json.worldName) {
                window.roleplayState.worldName = json.worldName;
                let el = document.getElementById("rpWorldNameEl");
                if (el) el.value = json.worldName;
            }
            if (json.worldLore) {
                window.roleplayState.worldLore = json.worldLore;
                let el = document.getElementById("rpWorldLoreEl");
                if (el) el.value = json.worldLore;
            }
            if (json.setting) {
                window.roleplayState.setting = json.setting;
                window.selectRoleplaySetting(json.setting, false);
            }
            if (json.tones && Array.isArray(json.tones)) {
                window.roleplayState.tones = json.tones;
                document.querySelectorAll(".rpToneCheckbox").forEach(cb => {
                    cb.checked = json.tones.includes(cb.value);
                });
                let anyBox = document.getElementById("rpToneAnyCheckbox");
                if (anyBox) {
                    anyBox.checked = json.tones.includes("Any") || json.tones.length === 0;
                }
                window.updateRoleplayToneLabel();
            }
            if (json.themes) {
                window.roleplayState.themes = json.themes;
                let el = document.getElementById("rpThemesEl");
                if (el) el.value = json.themes;
            }
            if (json.userName) {
                window.roleplayState.userName = json.userName;
                let el = document.getElementById("rpUserNameEl");
                if (el) el.value = json.userName;
            }
            if (json.userRole) {
                window.roleplayState.userRole = json.userRole;
                let el = document.getElementById("rpUserRoleEl");
                if (el) el.value = json.userRole;
            }
            if (json.scenarioNotes) {
                window.roleplayState.scenarioNotes = json.scenarioNotes;
                let el = document.getElementById("rpScenarioNotesEl");
                if (el) el.value = json.scenarioNotes;
            }
            if (json.npcs && Array.isArray(json.npcs)) {
                window.roleplayState.npcs = json.npcs.map(n => ({
                    name: n.name || "",
                    species: n.species || "",
                    personality: n.personality || "",
                    role: n.role || ""
                }));
                window.renderNPCGrid();
            }

            window.saveRoleplayState();

            setGenerationStatus("✨ Roleplay scenario imported!");
            setTimeout(() => setGenerationStatus(""), 3000);
        } catch (e) {
            console.error(e);
            alert("Error importing roleplay scenario from URL.");
            setGenerationStatus("");
        }
    };

    window.importRoleplayFromWikiUrlButtonClickHandler = async function () {
        let btn = document.getElementById("rpWikiImportBtnEl");
        let urlEl = document.getElementById("rpWikiUrlEl");
        if (!urlEl || !urlEl.value) return;
        if (btn) btn.disabled = true;
        await window.importRoleplayFromWikiUrl(urlEl.value);
        if (btn) btn.disabled = false;
    };

    // AI generating buttons for Roleplay
    window.generateRoleplayWorldLore = async function (btn) {
        window.saveRoleplayState();
        let name = window.roleplayState.worldName.trim() || "Unnamed World";
        let setting = document.getElementById("rpSettingLabel")?.textContent.trim() || "Any setting";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";

        let origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i>`;

        root.name = window.literal(name);
        root.setting = setting;
        root.tonesStr = tonesStr;
        let instruction = root.prompts.roleplayPage.worldLore.instruction.evaluateItem;

        let loreEl = document.getElementById("rpWorldLoreEl");
        if (loreEl) {
            loreEl.value = "";
            loreEl.placeholder = "Chronicling world lore...";
        }

        try {
            let res = await ai({ instruction });
            let text = res.text.trim().replace(/\u2014/g, " - ");
            if (loreEl) {
                loreEl.value = text;
            }
            window.roleplayState.worldLore = text;
            window.saveRoleplayState();
        } catch (e) {
            console.error("Failed to generate Roleplay World Lore:", e);
        } finally {
            btn.disabled = false;
            btn.innerHTML = origText;
        }
    };

    window.generateRoleplayNPC = async function (index, btn) {
        window.saveRoleplayState();
        let worldName = window.roleplayState.worldName || "Unnamed World";
        let worldLore = window.roleplayState.worldLore || "Generic setting";
        let setting = document.getElementById("rpSettingLabel")?.textContent.trim() || "Any Setting";

        let origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i>`;

        root.worldName = window.literal(worldName);
        root.worldLore = window.literal(worldLore);
        root.setting = setting;
        let instruction = root.prompts.roleplayPage.npcGeneration.instruction.evaluateItem;

        try {
            let res = await ai({ instruction });
            let text = res.text.trim();
            // Parse JSON safety
            let cleaned = text.replace(/```json|```/g, "").trim();
            let data = JSON.parse(cleaned);

            if (data && data.name) {
                window.roleplayState.npcs[index] = {
                    name: data.name || "",
                    species: data.species || "",
                    personality: data.personality || "",
                    role: data.role || ""
                };
                window.saveRoleplayState();
                
                // Populate DOM fields directly
                let nameInput = document.getElementById(`rpNPC-${index}-name`);
                let speciesInput = document.getElementById(`rpNPC-${index}-species`);
                let persInput = document.getElementById(`rpNPC-${index}-personality`);
                let roleInput = document.getElementById(`rpNPC-${index}-role`);

                if (nameInput) nameInput.value = data.name;
                if (speciesInput) speciesInput.value = data.species;
                if (persInput) persInput.value = data.personality;
                if (roleInput) roleInput.value = data.role;
            }
        } catch (e) {
            console.error("Failed to generate Roleplay NPC:", e);
            alert("AI failed to return valid JSON for NPC. Try again.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = origText;
        }
    };

    window.generateRoleplayScenarioNotes = async function (btn) {
        window.saveRoleplayState();
        let worldName = window.roleplayState.worldName || "Unnamed World";
        let worldLore = window.roleplayState.worldLore || "Generic setting";
        
        let npcsText = window.roleplayState.npcs.map(n => n.name).filter(Boolean).join(", ");
        let userRole = window.roleplayState.userRole || "Player";

        let origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i>`;

        root.worldName = window.literal(worldName);
        root.worldLore = window.literal(worldLore);
        root.npcsText = window.literal(npcsText);
        root.userRole = window.literal(userRole);
        let instruction = root.prompts.roleplayPage.scenarioNotes.instruction.evaluateItem;

        let notesEl = document.getElementById("rpScenarioNotesEl");
        if (notesEl) {
            notesEl.value = "";
            notesEl.placeholder = "Plotting conflict hook...";
        }

        try {
            let res = await ai({ instruction });
            let text = res.text.trim().replace(/\u2014/g, " - ");
            if (notesEl) notesEl.value = text;
            window.roleplayState.scenarioNotes = text;
            window.saveRoleplayState();
        } catch (e) {
            console.error("Failed to generate Roleplay Scenario Notes:", e);
        } finally {
            btn.disabled = false;
            btn.innerHTML = origText;
        }
    };

    // Toggle Output tabs (Scenario vs Starter)
    window.switchRpOutputTab = function (tab) {
        window.roleplayState.activeOutputTab = tab;
        
        let tabScenario = document.getElementById("rpOutputTabEl-scenario");
        let tabStarter = document.getElementById("rpOutputTabEl-starter");
        let btnScenario = document.getElementById("rpOutputTabBtn-scenario");
        let btnStarter = document.getElementById("rpOutputTabBtn-starter");

        if (tab === "scenario") {
            if (tabScenario) tabScenario.style.display = "block";
            if (tabStarter) tabStarter.style.display = "none";
            if (btnScenario) {
                btnScenario.style.borderBottomColor = "var(--accent-color)";
                btnScenario.style.fontWeight = "600";
                btnScenario.style.opacity = "1";
            }
            if (btnStarter) {
                btnStarter.style.borderBottomColor = "transparent";
                btnStarter.style.fontWeight = "normal";
                btnStarter.style.opacity = "0.6";
            }
        } else {
            if (tabScenario) tabScenario.style.display = "none";
            if (tabStarter) tabStarter.style.display = "block";
            if (btnStarter) {
                btnStarter.style.borderBottomColor = "var(--accent-color)";
                btnStarter.style.fontWeight = "600";
                btnStarter.style.opacity = "1";
            }
            if (btnScenario) {
                btnScenario.style.borderBottomColor = "transparent";
                btnScenario.style.fontWeight = "normal";
                btnScenario.style.opacity = "0.6";
            }
        }
    };
/* ==========================================================================
   AI SCENARIO & STARTER GENERATION ENGINE
   ========================================================================== */
    window.generateRoleplay = async function () {
        if (window.roleplayState.isGenerating) return;

        // Cancel previous stream if any
        if (window.activeRpStream) {
            window.activeRpStream.stop();
        }

        window.saveRoleplayState();

        let outputSec = document.getElementById("rpOutputSectionEl");
        let statusEl = document.getElementById("rpStatusEl");
        let genBtn = document.getElementById("rpGenerateBtn");
        let stopBtn = document.getElementById("rpStopBtn");
        let tabScenario = document.getElementById("rpOutputTabEl-scenario");
        let tabStarter = document.getElementById("rpOutputTabEl-starter");

        if (outputSec) outputSec.style.display = "block";
        if (genBtn) genBtn.style.display = "none";
        if (stopBtn) stopBtn.style.display = "inline-flex";

        window.roleplayState.isGenerating = true;
        setSectionGenerating("roleplay", true); // Sync CPU loader
        setGenerationStatus("Weaving roleplay scenario...");

        if (statusEl) {
            statusEl.innerHTML = `<span style="color:var(--text-muted); display:inline-flex; align-items:center; gap:0.4rem;">
                <i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> Weaving roleplay details & cast interactions...
            </span>`;
        }

        // Build NPC prompt block
        let npcsText = window.roleplayState.npcs.map((npc, idx) => {
            if (!npc.name) return "";
            return `NPC #${idx + 1}:
- Name: ${npc.name}
- Species/Race: ${npc.species || "Unspecified"}
- Personality: ${npc.personality || "Unspecified"}
- Narrative Role: ${npc.role || "Unspecified"}`;
        }).filter(Boolean).join("\n\n");

        if (!npcsText) {
            npcsText = "None specified (generate 1-2 interesting NPCs fitting the world setting).";
        }

        // Starters length instructions
        let lengthVal = window.roleplayState.activeLength || "medium";
        let lengthInstruction = window.getLengthInstruction ? window.getLengthInstruction(lengthVal, 'starter') : "";
        if (!lengthInstruction) {
            if (lengthVal === "short") lengthInstruction = "Write a short, engaging starter message (1-2 paragraphs).";
            else if (lengthVal === "long") lengthInstruction = "Write an extremely rich, slow-paced, detailed starter message (5+ paragraphs) setting up the atmosphere, sensory environment, and character positions.";
            else lengthInstruction = "Write a medium-length, descriptive starter message (3-4 paragraphs).";
        }

        let worldName = window.roleplayState.worldName || "an unnamed realm";
        let worldLore = window.roleplayState.worldLore || "a mysterious world of unknown dangers";
        let pName = window.roleplayState.userName || "the Player";
        let pRole = window.roleplayState.userRole || "a protagonist";
        let scenarioNotes = window.roleplayState.scenarioNotes || "The characters are meeting for the first time or embarking on a mutual task.";

        let setting = document.getElementById("rpSettingLabel")?.textContent.trim() || "Any setting";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
        let themes = window.roleplayState.themes || "";

        let prompt = root.prompts.roleplayPage.roleplayScenario.compile(
            window.literal(worldName), 
            window.literal(worldLore), 
            setting, 
            tonesStr, 
            window.literal(themes), 
            window.literal(pName), 
            window.literal(pRole), 
            window.literal(npcsText), 
            window.literal(scenarioNotes), 
            lengthInstruction
        );

        if (tabScenario) {
            tabScenario.innerHTML = "";
            tabScenario.placeholder = "Weaving scenario...";
        }
        if (tabStarter) {
            tabStarter.innerHTML = "";
            tabStarter.placeholder = "Preparing intro scene...";
        }

        let typewriterScenario = new TypewriterStreamer(tabScenario, { speed: 8 });
        let typewriterStarter = new TypewriterStreamer(tabStarter, { speed: 8 });

        window.roleplayState.outputScenario = "";
        window.roleplayState.outputStarter = "";

        let stream = ai({
            instruction: prompt,
            onChunk: (data) => {
                let text = data.fullTextSoFar;
                // Parse separation
                if (text.includes("=== ROLEPLAY_STARTER_SEPARATOR ===")) {
                    let parts = text.split("=== ROLEPLAY_STARTER_SEPARATOR ===");
                    let scenarioPart = parts[0].trim();
                    let starterPart = parts[1].trim();

                    typewriterScenario.appendTargetText(scenarioPart);
                    if (starterPart) {
                        typewriterStarter.appendTargetText(starterPart);
                    }
                } else {
                    typewriterScenario.appendTargetText(text.trim());
                }
            }
        });
        window.activeRpStream = stream;

        try {
            let result = await stream;
            typewriterScenario.destroy();
            typewriterStarter.destroy();

            if (result.stopReason === "user") {
                if (statusEl) statusEl.innerHTML = `<span style="color:#ef4444;"><i class="bi bi-stop-circle-fill"></i> Generation stopped.</span>`;
            } else {
                let text = result.text.trim();
                let scenarioPart = text;
                let starterPart = "";

                if (text.includes("=== ROLEPLAY_STARTER_SEPARATOR ===")) {
                    let parts = text.split("=== ROLEPLAY_STARTER_SEPARATOR ===");
                    scenarioPart = parts[0].trim();
                    starterPart = parts[1].trim();
                }

                // Strip em dashes as safety net
                scenarioPart = scenarioPart.replace(/\u2014/g, " - ");
                starterPart = starterPart.replace(/\u2014/g, " - ");

                window.roleplayState.outputScenario = scenarioPart;
                window.roleplayState.outputStarter = starterPart;

                // Format with HTML markup
                if (tabScenario) tabScenario.innerHTML = formatSectionText(sanitizeOutput(scenarioPart));
                if (tabStarter) tabStarter.innerHTML = formatSectionText(sanitizeOutput(starterPart));

                if (statusEl) statusEl.innerHTML = `<span style="color:#10b981;"><i class="bi bi-check-circle-fill"></i> Roleplay ready! Check the tabs below.</span>`;

                // If starter is empty, show alert or auto switch
                if (starterPart) {
                    let btn = document.getElementById("rpEditBtn");
                    if (btn) btn.style.display = "inline-flex";
                }
            }
        } catch (e) {
            console.error("Roleplay generation failed:", e);
            typewriterScenario.destroy();
            typewriterStarter.destroy();
            if (statusEl) statusEl.innerHTML = `<span style="color:#ef4444;"><i class="bi bi-x-circle-fill"></i> Failed to generate.</span>`;
        } finally {
            window.roleplayState.isGenerating = false;
            setSectionGenerating("roleplay", false);
            setGenerationStatus("");
            if (genBtn) genBtn.style.display = "inline-flex";
            if (stopBtn) stopBtn.style.display = "none";
            window.activeRpStream = null;
            window.saveRoleplayState();
        }
    };

    window.stopRoleplayGeneration = function () {
        if (window.activeRpStream) {
            window.activeRpStream.stop();
        }
    };

    // Clear Roleplay Data
    window.clearRoleplayData = function () {
        window.showConfirmDialog(
            "Are you sure you want to clear all Roleplay fields and generated sheets? This cannot be undone.",
            'warnOnClear',
            () => {
                document.getElementById("rpWorldNameEl").value = "";
                document.getElementById("rpWorldLoreEl").value = "";
                document.getElementById("rpUserNameEl").value = "";
                document.getElementById("rpUserRoleEl").value = "";
                document.getElementById("rpScenarioNotesEl").value = "";
                document.getElementById("rpLengthEl").value = "medium";

                window.roleplayState.npcs = [{ name: "", species: "", personality: "", role: "" }];
                window.roleplayState.outputScenario = "";
                window.roleplayState.outputStarter = "";

                let tabScenario = document.getElementById("rpOutputTabEl-scenario");
                let tabStarter = document.getElementById("rpOutputTabEl-starter");
                if (tabScenario) { tabScenario.innerHTML = ""; tabScenario.contentEditable = "false"; }
                if (tabStarter) { tabStarter.innerHTML = ""; tabStarter.contentEditable = "false"; }

                let editBtn = document.getElementById("rpEditBtn");
                if (editBtn) {
                    editBtn.style.display = "none";
                    editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> edit';
                }

                let outputSec = document.getElementById("rpOutputSectionEl");
                if (outputSec) outputSec.style.display = "none";

                window.renderNPCGrid();
                window.saveRoleplayState();
            }
        );
    };

    // Edit Scenario / Starter Output
    window.toggleRpEdit = function () {
        let activeTab = window.roleplayState.activeOutputTab;
        let container = document.getElementById("rpOutputTabEl-" + activeTab);
        let btn = document.getElementById("rpEditBtn");
        
        if (!container || !btn) return;
        
        let isEditable = container.contentEditable === "true";
        container.contentEditable = isEditable ? "false" : "true";

        if (!isEditable) {
            container.style.border = "1px solid var(--accent-color)";
            container.focus();
            btn.innerHTML = '<i class="bi bi-floppy"></i> save';
        } else {
            container.style.border = "1px solid var(--input-border)";
            btn.innerHTML = '<i class="bi bi-pencil-square"></i> edit';
            
            // Save modified text back to state
            let plainText = container.innerText;
            if (activeTab === "scenario") {
                window.roleplayState.outputScenario = plainText;
            } else {
                window.roleplayState.outputStarter = plainText;
            }
            window.saveRoleplayState();
        }
    };

    // Copy active output text
    window.copyRpText = function () {
        let activeTab = window.roleplayState.activeOutputTab;
        let text = activeTab === "scenario" ? window.roleplayState.outputScenario : window.roleplayState.outputStarter;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            let statusEl = document.getElementById("rpStatusEl");
            if (statusEl) {
                let orig = statusEl.innerHTML;
                statusEl.innerHTML = `<span style="color:#10b981;"><i class="bi bi-check-lg"></i> Copied active tab to clipboard!</span>`;
                setTimeout(() => { statusEl.innerHTML = orig; }, 2000);
            }
        });
    };

    // Download combined Roleplay Scenario Markdown
    window.downloadRpMarkdown = function () {
        let scenario = window.roleplayState.outputScenario || "";
        let starter = window.roleplayState.outputStarter || "";
        
        if (!scenario && !starter) return;

        let worldName = window.roleplayState.worldName || "Unnamed World";
        let dateStr = new Date().toLocaleDateString();

        let md = `# Roleplay Scenario: ${worldName}\n`;
        md += `*Generated on ${dateStr}*\n\n`;
        
        md += `## Part 1: Scenario & Cast Sheet\n\n`;
        md += `${scenario}\n\n`;
        md += `---\n\n`;
        
        md += `## Part 2: Starting Scene / Starter Message\n\n`;
        md += `${starter}\n`;

        let safeName = worldName.toLowerCase().replace(/[^a-z0-9]/g, "_") || "roleplay";
        let filename = `${safeName}_scenario.md`;

        let blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Hook layout loading on load
    setTimeout(() => {
        window.loadRoleplayState();
        
        // Restore elements value if present
        let nameEl = document.getElementById("rpWorldNameEl");
        let loreEl = document.getElementById("rpWorldLoreEl");
        let userEl = document.getElementById("rpUserNameEl");
        let userRoleEl = document.getElementById("rpUserRoleEl");
        let notesEl = document.getElementById("rpScenarioNotesEl");
        let lengthEl = document.getElementById("rpLengthEl");
        let themesEl = document.getElementById("rpThemesEl");

        if (nameEl) nameEl.value = window.roleplayState.worldName || "";
        if (loreEl) loreEl.value = window.roleplayState.worldLore || "";
        if (userEl) userEl.value = window.roleplayState.userName || "";
        if (userRoleEl) userRoleEl.value = window.roleplayState.userRole || "";
        if (notesEl) notesEl.value = window.roleplayState.scenarioNotes || "";
        if (lengthEl) lengthEl.value = window.roleplayState.activeLength || "medium";
        if (themesEl) themesEl.value = window.roleplayState.themes || "";

        // Restore setting and tone custom elements
        initCustomRoleplaySettingDropdown();
        initCustomRoleplayToneDropdown();
        loadRoleplayTones();
        if (typeof window.sortDropdownList === "function") {
            window.sortDropdownList("rpSettingOptionsList");
            window.sortDropdownList("rpToneOptionsList");
        }

        // Restore dynamic NPC list
        window.renderNPCGrid();

        // Restore generated texts if present
        if (window.roleplayState.outputScenario || window.roleplayState.outputStarter) {
            let outputSec = document.getElementById("rpOutputSectionEl");
            if (outputSec) outputSec.style.display = "block";

            let tabScenario = document.getElementById("rpOutputTabEl-scenario");
            let tabStarter = document.getElementById("rpOutputTabEl-starter");

            if (tabScenario) tabScenario.innerHTML = formatSectionText(sanitizeOutput(window.roleplayState.outputScenario));
            if (tabStarter) tabStarter.innerHTML = formatSectionText(sanitizeOutput(window.roleplayState.outputStarter));

            let editBtn = document.getElementById("rpEditBtn");
            if (editBtn) editBtn.style.display = "inline-flex";
        }
        
        // Sync the Saved Worlds selector
        if (window.triggerWorldSelectorSync) {
            window.triggerWorldSelectorSync();
        }
    }, 100);

})();
