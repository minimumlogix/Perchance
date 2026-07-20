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
        rpDynamics: ["Any"],
        themes: "",
        npcs: [
            {
                name: "", age: "", gender: "", race: "", role: "",
                appearance: "", personality: "", beliefs: "", likes: "", dislikes: "",
                abilities: "", biography: "", rules: "", image: ""
            },
            {
                name: "", age: "", gender: "", race: "", role: "",
                appearance: "", personality: "", beliefs: "", likes: "", dislikes: "",
                abilities: "", biography: "", rules: "", image: ""
            }
        ],
        backgroundNpcs: "",
        roleplayPromptType: "none",
        roleplayPrompt: "",
        scenarioNotes: "",
        outputScenario: "",
        outputStarter: "",
        timeline: "",
        plot: "",
        lore: "",
        roleplay: "",
        introScenario: "",
        introStart: "",
        isGenerating: false,
        activeOutputTab: "scenario" // "scenario" or "starter"
    };

    // Load state from localStorage on init
    window.loadRoleplayState = function () {
        try {
            if (localStorage.rpState) {
                let saved = JSON.parse(localStorage.rpState);
                if (saved.npcs && Array.isArray(saved.npcs)) {
                    saved.npcs = saved.npcs.map(n => Object.assign({
                        name: "", age: "", gender: "", race: "", role: "",
                        appearance: "", personality: "", beliefs: "", likes: "", dislikes: "",
                        abilities: "", biography: "", rules: "", image: ""
                    }, n));
                }
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
            window.roleplayState.worldLoreNotes = document.getElementById("rpWorldLoreNotesEl")?.value || "";
            window.roleplayState.userName = document.getElementById("rpUserNameEl")?.value || "";
            window.roleplayState.userRole = document.getElementById("rpUserRoleEl")?.value || "";
            window.roleplayState.scenarioNotes = document.getElementById("rpScenarioNotesEl")?.value || "";
            window.roleplayState.activeLength = document.getElementById("rpLengthEl")?.value || "medium";
            window.roleplayState.themes = document.getElementById("rpThemesEl")?.value || "";
            window.roleplayState.backgroundNpcs = document.getElementById("rpBackgroundCastEl")?.value || "";
            window.roleplayState.roleplayPromptType = document.getElementById("rpPromptTypeEl")?.value || "none";
            window.roleplayState.roleplayPrompt = document.getElementById("rpPromptTextEl")?.value || "";

            localStorage.rpState = JSON.stringify({
                worldName: window.roleplayState.worldName,
                worldLore: window.roleplayState.worldLore,
                worldLoreNotes: window.roleplayState.worldLoreNotes,
                userName: window.roleplayState.userName,
                userRole: window.roleplayState.userRole,
                setting: window.roleplayState.setting,
                tones: window.roleplayState.tones,
                rpDynamics: window.roleplayState.rpDynamics,
                themes: window.roleplayState.themes,
                npcs: window.roleplayState.npcs,
                backgroundNpcs: window.roleplayState.backgroundNpcs,
                roleplayPromptType: window.roleplayState.roleplayPromptType,
                roleplayPrompt: window.roleplayState.roleplayPrompt,
                scenarioNotes: window.roleplayState.scenarioNotes,
                activeLength: window.roleplayState.activeLength,
                outputScenario: window.roleplayState.outputScenario,
                outputStarter: window.roleplayState.outputStarter,
                timeline: window.roleplayState.timeline,
                plot: window.roleplayState.plot,
                lore: window.roleplayState.lore,
                roleplay: window.roleplayState.roleplay,
                introScenario: window.roleplayState.introScenario,
                introStart: window.roleplayState.introStart
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
        window.roleplayState.npcs.push({
            name: "", age: "", gender: "", race: "", role: "",
            appearance: "", personality: "", beliefs: "", likes: "", dislikes: "",
            abilities: "", biography: "", rules: "", image: ""
        });
        window.renderNPCGrid();
        window.saveRoleplayState();
    };

    window.removeNPC = function (index) {
        if (window.roleplayState.npcs.length <= 1) {
            // Keep at least one NPC card but clear its contents
            window.roleplayState.npcs[0] = {
                name: "", age: "", gender: "", race: "", role: "",
                appearance: "", personality: "", beliefs: "", likes: "", dislikes: "",
                abilities: "", biography: "", rules: "", image: ""
            };
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
                window.roleplayState.npcs[index] = {
                    name: d.name || character.name || "",
                    age: d.age || "",
                    gender: d.gender || "",
                    race: d.race || d.species || "",
                    role: sections.role || d.role || "",
                    appearance: sections.appearance || d.appearance || "",
                    personality: sections.personality || d.personality || "",
                    beliefs: sections.beliefs || d.beliefs || "",
                    likes: d.likes || "",
                    dislikes: d.dislikes || "",
                    abilities: sections.abilities || d.abilities || "",
                    biography: sections.background || d.biography || "",
                    rules: d.rules || "",
                    image: character.introCharImageUrl || character.avatarUrl || ""
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
                    
                    <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                        <!-- Image Column -->
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.3rem; flex-shrink: 0;">
                            <div id="rpNPC-${index}-imgContainer" style="width: 80px; height: 80px; border-radius: 6px; border: 1px solid var(--panel-border); background: ${npc.image ? `url(${npc.image})` : 'rgba(255,255,255,0.02)'}; background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                                ${npc.image ? '' : '<i class="bi bi-person" style="font-size: 2rem; opacity: 0.3;"></i>'}
                            </div>
                            <button class="btn btn-ghost btn-sm" onclick="generateNPCImage(${index}, this)" style="font-size: 70%; padding: 0.1rem 0.3rem; height: 18px;" title="Regenerate Image"><i class="bi bi-image"></i> Gen</button>
                        </div>

                        <!-- 2x2 Grid for core details -->
                        <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
                            <div class="detail-field">
                                <label class="detail-label" style="font-size: 70%; min-width: 35px;">Name</label>
                                <input type="text" id="rpNPC-${index}-name" class="detail-input" style="font-size: 80%; padding: 0.25rem 0.4rem;" value="${npc.name || ""}" placeholder="Name" oninput="updateNPCField(${index}, 'name', this.value)">
                            </div>
                            <div class="detail-field">
                                <label class="detail-label" style="font-size: 70%; min-width: 35px;">Age</label>
                                <input type="text" id="rpNPC-${index}-age" class="detail-input" style="font-size: 80%; padding: 0.25rem 0.4rem;" value="${npc.age || ""}" placeholder="Age" oninput="updateNPCField(${index}, 'age', this.value)">
                            </div>
                            <div class="detail-field">
                                <label class="detail-label" style="font-size: 70%; min-width: 45px;">Gender</label>
                                <input type="text" id="rpNPC-${index}-gender" class="detail-input" style="font-size: 80%; padding: 0.25rem 0.4rem;" value="${npc.gender || ""}" placeholder="Gender" oninput="updateNPCField(${index}, 'gender', this.value)">
                            </div>
                            <div class="detail-field">
                                <label class="detail-label" style="font-size: 70%; min-width: 45px;">Race</label>
                                <input type="text" id="rpNPC-${index}-race" class="detail-input" style="font-size: 80%; padding: 0.25rem 0.4rem;" value="${npc.race || npc.species || ""}" placeholder="Race" oninput="updateNPCField(${index}, 'race', this.value)">
                            </div>
                        </div>
                    </div>

                    <!-- Collapsible Trigger -->
                    <button class="btn btn-ghost btn-sm" id="rpNPC-${index}-toggleBtn" onclick="toggleNPCDetails(${index})" style="width: 100%; font-size: 76%; display: flex; align-items: center; justify-content: center; gap: 0.25rem; background: rgba(255,255,255,0.01); border: 1px solid var(--panel-border); border-radius: 4px; padding: 0.2rem 0;">
                        <i class="bi bi-chevron-down"></i> Expand Full Profile
                    </button>

                    <!-- Collapsible Details drawer -->
                    <div id="rpNPC-${index}-details" style="display: none; flex-direction: column; gap: 0.5rem; margin-top: 0.2rem; border-top: 1px dashed var(--panel-border); padding-top: 0.5rem;">
                        <div class="detail-field" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                            <label class="detail-label" style="font-size: 74%; font-weight: 600;">Narrative Role</label>
                            <textarea id="rpNPC-${index}-role" class="section-notes" style="min-height: 2.2rem; font-size: 80%; padding: 0.25rem 0.4rem; width: 100%; box-sizing: border-box;" placeholder="Role, story place, and relationship to {{user}}" oninput="updateNPCField(${index}, 'role', this.value)">${npc.role || ""}</textarea>
                        </div>
                        <div class="detail-field" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                            <label class="detail-label" style="font-size: 74%; font-weight: 600;">Appearance</label>
                            <textarea id="rpNPC-${index}-appearance" class="section-notes" style="min-height: 2.2rem; font-size: 80%; padding: 0.25rem 0.4rem; width: 100%; box-sizing: border-box;" placeholder="Hairstyle, clothing, notable features..." oninput="updateNPCField(${index}, 'appearance', this.value)">${npc.appearance || ""}</textarea>
                        </div>
                        <div class="detail-field" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                            <label class="detail-label" style="font-size: 74%; font-weight: 600;">Personality</label>
                            <textarea id="rpNPC-${index}-personality" class="section-notes" style="min-height: 2.2rem; font-size: 80%; padding: 0.25rem 0.4rem; width: 100%; box-sizing: border-box;" placeholder="Temperament, speech style, habits..." oninput="updateNPCField(${index}, 'personality', this.value)">${npc.personality || ""}</textarea>
                        </div>
                        <div class="detail-field" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                            <label class="detail-label" style="font-size: 74%; font-weight: 600;">Beliefs</label>
                            <textarea id="rpNPC-${index}-beliefs" class="section-notes" style="min-height: 2.2rem; font-size: 80%; padding: 0.25rem 0.4rem; width: 100%; box-sizing: border-box;" placeholder="Worldview, morals, code..." oninput="updateNPCField(${index}, 'beliefs', this.value)">${npc.beliefs || ""}</textarea>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
                            <div class="detail-field" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                                <label class="detail-label" style="font-size: 74%; font-weight: 600;">Likes</label>
                                <input type="text" id="rpNPC-${index}-likes" class="detail-input" style="font-size: 80%; padding: 0.25rem 0.4rem; width: 100%; box-sizing: border-box;" value="${npc.likes || ""}" placeholder="Hobbies, preferences..." oninput="updateNPCField(${index}, 'likes', this.value)">
                            </div>
                            <div class="detail-field" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                                <label class="detail-label" style="font-size: 74%; font-weight: 600;">Dislikes</label>
                                <input type="text" id="rpNPC-${index}-dislikes" class="detail-input" style="font-size: 80%; padding: 0.25rem 0.4rem; width: 100%; box-sizing: border-box;" value="${npc.dislikes || ""}" placeholder="Fears, distastes..." oninput="updateNPCField(${index}, 'dislikes', this.value)">
                            </div>
                        </div>
                        <div class="detail-field" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                            <label class="detail-label" style="font-size: 74%; font-weight: 600;">Abilities</label>
                            <textarea id="rpNPC-${index}-abilities" class="section-notes" style="min-height: 2.2rem; font-size: 80%; padding: 0.25rem 0.4rem; width: 100%; box-sizing: border-box;" placeholder="Skills, combat, powers, magic..." oninput="updateNPCField(${index}, 'abilities', this.value)">${npc.abilities || ""}</textarea>
                        </div>
                        <div class="detail-field" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                            <label class="detail-label" style="font-size: 74%; font-weight: 600;">Biography</label>
                            <textarea id="rpNPC-${index}-biography" class="section-notes" style="min-height: 2.5rem; font-size: 80%; padding: 0.25rem 0.4rem; width: 100%; box-sizing: border-box;" placeholder="Life history, trauma, secrets, motivation..." oninput="updateNPCField(${index}, 'biography', this.value)">${npc.biography || ""}</textarea>
                        </div>
                        <div class="detail-field" style="flex-direction: column; align-items: flex-start; gap: 0.2rem;">
                            <label class="detail-label" style="font-size: 74%; font-weight: 600;">Rules / Limitations</label>
                            <textarea id="rpNPC-${index}-rules" class="section-notes" style="min-height: 2.2rem; font-size: 80%; padding: 0.25rem 0.4rem; width: 100%; box-sizing: border-box;" placeholder="Important facts / boundaries that must never be violated" oninput="updateNPCField(${index}, 'rules', this.value)">${npc.rules || ""}</textarea>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    };

    window.toggleNPCDetails = function (index) {
        let detailsDiv = document.getElementById(`rpNPC-${index}-details`);
        let toggleBtn = document.getElementById(`rpNPC-${index}-toggleBtn`);
        if (detailsDiv && toggleBtn) {
            let isHidden = detailsDiv.style.display === "none";
            detailsDiv.style.display = isHidden ? "flex" : "none";
            toggleBtn.innerHTML = isHidden 
                ? `<i class="bi bi-chevron-up"></i> Collapse Full Profile` 
                : `<i class="bi bi-chevron-down"></i> Expand Full Profile`;
        }
    };

    window.generateNPCImage = async function (index, btn) {
        let npc = window.roleplayState.npcs[index];
        if (!npc) return;
        
        let imgFn = typeof window.image !== 'undefined' ? window.image : (typeof image !== 'undefined' ? image : null);
        if (!imgFn) {
            alert("Image generation plugin is not available.");
            return;
        }

        let origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i>`;

        try {
            let imgPrompt = `portrait of ${npc.name || "character"}, ${npc.gender || ""} ${npc.age || ""} ${npc.race || ""}. ${npc.appearance || ""}. Artstyle: anime cel shading, manhwa style, semi-realistic, mature, artstation quality. composition: upper-body portrait, centered, looking at the camera, pure solid white background.`;
            let imgRes = await imgFn({
                prompt: imgPrompt,
                resolution: "512x512"
            });
            if (imgRes && imgRes.dataUrl) {
                npc.image = imgRes.dataUrl;
                window.saveRoleplayState();
                
                // Update DOM directly
                let imgContainer = document.getElementById(`rpNPC-${index}-imgContainer`);
                if (imgContainer) {
                    imgContainer.style.backgroundImage = `url(${imgRes.dataUrl})`;
                    imgContainer.innerHTML = "";
                }
            }
        } catch (err) {
            console.error("Failed to generate NPC image:", err);
            alert("Image generation failed. Try again.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = origText;
        }
    };
/* ==========================================================================
   CUSTOM DROPDOWN CONFIGURATION
   ========================================================================== */
    window.selectRoleplaySetting = function (value) {
        window.roleplayState.setting = value;
        const rpSettingEl = document.getElementById("rpSettingEl");
        if (rpSettingEl) {
            rpSettingEl.value = value;
            window.syncCustomSelectLabel(rpSettingEl);
        }
        // Bidirectional sync to Characters tab settingEl
        const settingEl = document.getElementById("settingEl");
        if (settingEl) {
            settingEl.value = value;
            window.syncCustomSelectLabel(settingEl);
            localStorage.setting = value;
        }
        window.saveRoleplayState();
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.getSelectedRoleplayTones = function () {
        const sel = window.multiSelectState ? window.multiSelectState["rpToneEl"] : null;
        if (!sel || sel.size === 0 || (sel.size === 1 && sel.has("none"))) {
            return ["Any"];
        }
        return Array.from(sel).filter(v => v !== "none");
    };

    window.saveRoleplayTones = function () {
        const tones = getSelectedRoleplayTones();
        window.roleplayState.tones = tones;
        window.saveRoleplayState();
        
        // Bidirectional sync to Characters tab toneEl
        localStorage.tones = JSON.stringify(tones);
        if (window.multiSelectState && window.multiSelectState["toneEl"]) {
            const sel = new Set();
            tones.forEach(t => {
                if (t !== "Any" && t !== "none") sel.add(t);
            });
            if (sel.size === 0) sel.add("none");
            window.multiSelectState["toneEl"] = sel;
            window.syncCustomSelectLabel("toneEl");
        }
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.updateRoleplayToneLabel = function () {
        window.syncCustomSelectLabel("rpToneEl");
    };

    window.loadRoleplayTones = function () {
        try {
            let saved = window.roleplayState.tones || ["Any"];
            const sel = new Set();
            if (!saved || saved.length === 0 || saved[0] === "Any" || saved[0] === "none") {
                sel.add("none");
            } else {
                saved.forEach(t => {
                    if (t !== "Any") sel.add(t);
                });
            }
            if (window.multiSelectState) {
                window.multiSelectState["rpToneEl"] = sel;
            }
        } catch (e) {
            if (window.multiSelectState) {
                window.multiSelectState["rpToneEl"] = new Set(["none"]);
            }
        }
        window.syncCustomSelectLabel("rpToneEl");
    };

    window.changeNPCCastCount = function (count) {
        count = parseInt(count, 10);
        if (isNaN(count) || count < 1) count = 1;
        if (count > 10) count = 10;

        let currentNpcs = window.roleplayState.npcs || [];
        if (currentNpcs.length < count) {
            // Add new empty NPCs
            while (currentNpcs.length < count) {
                currentNpcs.push({
                    name: "", age: "", gender: "", race: "", role: "",
                    appearance: "", personality: "", beliefs: "", likes: "", dislikes: "",
                    abilities: "", biography: "", rules: "", image: ""
                });
            }
        } else if (currentNpcs.length > count) {
            // Truncate NPCs list
            currentNpcs.length = count;
        }

        window.roleplayState.npcs = currentNpcs;
        window.saveRoleplayState();
        window.renderNPCGrid();
    };

    window.saveRoleplayDynamics = function () {
        window.roleplayState.rpDynamics = window.getSelectedRoleplayDynamics();
        window.saveRoleplayState();
    };

    window.getSelectedRoleplayDynamics = function () {
        const sel = window.multiSelectState ? window.multiSelectState["rpDynamicEl"] : null;
        if (!sel || sel.size === 0 || (sel.size === 1 && sel.has("none"))) {
            return ["Any"];
        }
        return Array.from(sel).filter(v => v !== "none");
    };

    window.loadRoleplayDynamics = function () {
        try {
            let saved = window.roleplayState.rpDynamics || ["Any"];
            const sel = new Set();
            if (!saved || saved.length === 0 || saved[0] === "Any" || saved[0] === "none") {
                sel.add("none");
            } else {
                saved.forEach(t => {
                    if (t !== "Any") sel.add(t);
                });
            }
            if (window.multiSelectState) {
                window.multiSelectState["rpDynamicEl"] = sel;
            }
        } catch (e) {
            if (window.multiSelectState) {
                window.multiSelectState["rpDynamicEl"] = new Set(["none"]);
            }
        }
        window.syncCustomSelectLabel("rpDynamicEl");
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
                    age: n.age || "",
                    gender: n.gender || "",
                    race: n.race || n.species || "",
                    role: n.role || "",
                    appearance: n.appearance || "",
                    personality: n.personality || "",
                    beliefs: n.beliefs || "",
                    likes: n.likes || "",
                    dislikes: n.dislikes || "",
                    abilities: n.abilities || "",
                    biography: n.biography || "",
                    rules: n.rules || "",
                    image: n.image || ""
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
    window.generateRoleplayWorldLore = async function () {
        if (window.roleplayWorldLoreGenerating) return false;
        
        window.roleplayWorldLoreGenerating = true;
        let genBtn = document.getElementById("rpWorldGenBtnEl");
        let stopBtn = document.getElementById("rpWorldStopBtnEl");
        if (genBtn) genBtn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";

        let statusEl = document.getElementById("rpWorldStatusEl");
        if (statusEl) statusEl.innerHTML = `<span><i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> Chronicling world lore...</span>`;

        let outputEl = document.getElementById("rpWorldOutputEl");
        if (outputEl) {
            outputEl.innerHTML = "";
            outputEl.style.display = "block";
        }

        let name = (document.getElementById("rpWorldNameEl")?.value || "").trim() || "Unnamed World";
        let setting = document.getElementById("rpSettingEl")?.value || "Any";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
        let themes = window.roleplayState.themes || "";
        let notes = document.getElementById("rpWorldLoreNotesEl")?.value || "";

        root.name = window.literal(name);
        root.setting = setting;
        root.tonesStr = tonesStr;
        root.themes = window.literal(themes);
        root.notes = window.literal(notes);

        // Compile prompt
        let instruction = window.prompts.roleplayPage.worldLore.compile(name, setting, tonesStr, themes, notes);

        let typewriter = new TypewriterStreamer(outputEl, { speed: 12 });
        window.rpWorldLoreTypewriter = typewriter;

        let stream = ai({
            instruction,
            onChunk: (data) => {
                typewriter.appendTargetText(data.fullTextSoFar);
            }
        });
        window.rpWorldLoreStream = stream;

        try {
            let res = await stream;
            typewriter.destroy();

            if (res.stopReason === "user") {
                if (statusEl) statusEl.innerHTML = `<span style="color:#ef4444;"><i class="bi bi-stop-circle-fill"></i> Stopped.</span>`;
                return false;
            }

            let text = res.text.trim().replace(/\u2014/g, " - ");
            if (outputEl) outputEl.innerHTML = formatSectionText(text);
            
            window.roleplayState.worldLore = text;
            if (window.syncWorldLore) {
                window.syncWorldLore(text);
                window.saveWorldState();
            }

            window.saveRoleplayState();
            if (statusEl) statusEl.innerHTML = "";
            return true;
        } catch (e) {
            console.error("Failed to generate Roleplay World Lore:", e);
            if (statusEl) statusEl.innerHTML = `<span style="color:#ef4444;"><i class="bi bi-exclamation-triangle-fill"></i> Failed.</span>`;
            return false;
        } finally {
            window.roleplayWorldLoreGenerating = false;
            if (genBtn) genBtn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
        }
    };

    window.stopRoleplayWorldLore = function () {
        if (window.rpWorldLoreStream) {
            window.rpWorldLoreStream.stop();
        }
        if (window.rpWorldLoreTypewriter) {
            window.rpWorldLoreTypewriter.destroy();
        }
        window.roleplayWorldLoreGenerating = false;
    };

    window.clearRoleplayWorldLore = function () {
        if (!confirm("Are you sure you want to clear World Lore?")) return;
        let outputEl = document.getElementById("rpWorldOutputEl");
        if (outputEl) outputEl.innerHTML = "";
        let notesEl = document.getElementById("rpWorldLoreNotesEl");
        if (notesEl) notesEl.value = "";
        window.roleplayState.worldLore = "";
        window.saveRoleplayState();
    };

    window.toggleRoleplayWorldLoreEdit = function () {
        let outputEl = document.getElementById("rpWorldOutputEl");
        let editBtn = document.getElementById("rpWorldEditBtnEl");
        if (!outputEl || !editBtn) return;
        let isEditing = outputEl.contentEditable === "true";
        let nextEditing = !isEditing;

        outputEl.contentEditable = nextEditing ? "true" : "false";
        if (nextEditing) {
            outputEl.style.border = "1px solid var(--accent-color)";
            outputEl.style.padding = "0.4rem";
            editBtn.innerHTML = '<i class="bi bi-floppy"></i> save';
            outputEl.focus();
        } else {
            outputEl.style.border = "none";
            outputEl.style.padding = "0.4rem 0";
            editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> edit';
            window.roleplayState.worldLore = outputEl.innerText;
            window.saveRoleplayState();
        }
    };

    window.copyRoleplayWorldLoreText = function () {
        let outputEl = document.getElementById("rpWorldOutputEl");
        if (!outputEl) return;
        let text = outputEl.innerText;
        navigator.clipboard.writeText(text).then(() => {
            let copyBtn = document.getElementById("rpWorldCopyBtnEl");
            if (copyBtn) {
                let origHtml = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="bi bi-check"></i> copied';
                setTimeout(() => { copyBtn.innerHTML = origHtml; }, 1500);
            }
        });
    };

    window.buildRPSessionTimelinePrompt = function (notes, lengthVal, worldName, worldLore) {
        let setting = document.getElementById("rpSettingEl")?.value || "Any";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
        let themes = window.roleplayState.themes || "";
        let dynamics = window.roleplayState.rpDynamics ? window.roleplayState.rpDynamics.join(", ") : "Any";
        let userName = window.roleplayState.userName || "the Player";
        let userRole = window.roleplayState.userRole || "a protagonist";

        // Build NPC cast text
        let npcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map((n, idx) => {
            if (!n.name || !n.name.trim()) return "";
            return `NPC #${idx + 1}:\nName: ${n.name}\nRace/Species: ${n.species || "Unknown"}\nRole in Story: ${n.role || "Unknown"}\nPersonality: ${n.personality || "Unknown"}\nAppearance: ${n.appearance || "Unknown"}\nBeliefs: ${n.beliefs || "Unknown"}`;
        }).filter(Boolean).join("\n\n") : "";

        root.worldName = window.literal(worldName);
        root.worldLore = window.literal(worldLore);
        root.setting = setting;
        root.tonesStr = tonesStr;
        root.themes = window.literal(themes);
        root.npcsText = window.literal(npcsText);
        root.dynamics = window.literal(dynamics);
        root.userName = window.literal(userName);
        root.userRole = window.literal(userRole);
        root.notes = window.literal(notes);
        root.lengthVal = lengthVal;

        return root.prompts.roleplayPage.timeline.instruction.evaluateItem;
    };

    window.buildRPSessionLorePrompt = function (notes, worldName, worldLore) {
        let setting = document.getElementById("rpSettingEl")?.value || "Any";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
        let themes = window.roleplayState.themes || "";
        let dynamics = window.roleplayState.rpDynamics ? window.roleplayState.rpDynamics.join(", ") : "Any";
        let userName = window.roleplayState.userName || "the Player";
        let userRole = window.roleplayState.userRole || "a protagonist";

        // Build NPC cast text
        let npcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map((n, idx) => {
            if (!n.name || !n.name.trim()) return "";
            return `NPC #${idx + 1}:\nName: ${n.name}\nRace/Species: ${n.species || "Unknown"}\nRole in Story: ${n.role || "Unknown"}\nPersonality: ${n.personality || "Unknown"}\nAppearance: ${n.appearance || "Unknown"}\nBeliefs: ${n.beliefs || "Unknown"}`;
        }).filter(Boolean).join("\n\n") : "";

        root.worldName = window.literal(worldName);
        root.worldLore = window.literal(worldLore);
        root.setting = setting;
        root.tonesStr = tonesStr;
        root.themes = window.literal(themes);
        root.npcsText = window.literal(npcsText);
        root.dynamics = window.literal(dynamics);
        root.userName = window.literal(userName);
        root.userRole = window.literal(userRole);
        root.notes = window.literal(notes);

        return root.prompts.roleplayPage.lore.instruction.evaluateItem;
    };

    window.buildRPSessionExamplePrompt = function (notes, lengthVal, worldName, worldLore) {
        let setting = document.getElementById("rpSettingEl")?.value || "Any";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
        let themes = window.roleplayState.themes || "";
        let dynamics = window.roleplayState.rpDynamics ? window.roleplayState.rpDynamics.join(", ") : "Any";
        let userName = window.roleplayState.userName || "the Player";
        let userRole = window.roleplayState.userRole || "a protagonist";

        // Build NPC cast text
        let npcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map((n, idx) => {
            if (!n.name || !n.name.trim()) return "";
            return `NPC #${idx + 1}:\nName: ${n.name}\nRace/Species: ${n.species || "Unknown"}\nRole in Story: ${n.role || "Unknown"}\nPersonality: ${n.personality || "Unknown"}\nAppearance: ${n.appearance || "Unknown"}\nBeliefs: ${n.beliefs || "Unknown"}`;
        }).filter(Boolean).join("\n\n") : "";

        root.worldName = window.literal(worldName);
        root.worldLore = window.literal(worldLore);
        root.setting = setting;
        root.tonesStr = tonesStr;
        root.themes = window.literal(themes);
        root.npcsText = window.literal(npcsText);
        root.dynamics = window.literal(dynamics);
        root.userName = window.literal(userName);
        root.userRole = window.literal(userRole);
        root.notes = window.literal(notes);
        root.lengthVal = lengthVal;

        return root.prompts.roleplayPage.roleplay.instruction.evaluateItem;
    };

    window.buildRPSessionIntroScenarioPrompt = function (notes, lengthVal, worldName, worldLore) {
        let setting = document.getElementById("rpSettingEl")?.value || "Any";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
        let themes = window.roleplayState.themes || "";
        let dynamics = window.roleplayState.rpDynamics ? window.roleplayState.rpDynamics.join(", ") : "Any";
        let userName = window.roleplayState.userName || "the Player";
        let userRole = window.roleplayState.userRole || "a protagonist";

        // Build NPC cast text
        let npcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map((n, idx) => {
            if (!n.name || !n.name.trim()) return "";
            return `NPC #${idx + 1}:\nName: ${n.name}\nRace/Species: ${n.species || "Unknown"}\nRole in Story: ${n.role || "Unknown"}\nPersonality: ${n.personality || "Unknown"}\nAppearance: ${n.appearance || "Unknown"}\nBeliefs: ${n.beliefs || "Unknown"}`;
        }).filter(Boolean).join("\n\n") : "";

        root.worldName = window.literal(worldName);
        root.worldLore = window.literal(worldLore);
        root.setting = setting;
        root.tonesStr = tonesStr;
        root.themes = window.literal(themes);
        root.npcsText = window.literal(npcsText);
        root.dynamics = window.literal(dynamics);
        root.userName = window.literal(userName);
        root.userRole = window.literal(userRole);
        root.notes = window.literal(notes);
        root.lengthVal = lengthVal;

        return root.prompts.roleplayPage.introScenario.instruction.evaluateItem;
    };

    window.buildRPSessionIntroStartPrompt = function (notes, lengthVal, worldName, worldLore, scenarioContext) {
        let setting = document.getElementById("rpSettingEl")?.value || "Any";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
        let themes = window.roleplayState.themes || "";
        let dynamics = window.roleplayState.rpDynamics ? window.roleplayState.rpDynamics.join(", ") : "Any";
        let userName = window.roleplayState.userName || "the Player";
        let userRole = window.roleplayState.userRole || "a protagonist";

        // Build NPC cast text
        let npcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map((n, idx) => {
            if (!n.name || !n.name.trim()) return "";
            return `NPC #${idx + 1}:\nName: ${n.name}\nRace/Species: ${n.species || "Unknown"}\nRole in Story: ${n.role || "Unknown"}\nPersonality: ${n.personality || "Unknown"}\nAppearance: ${n.appearance || "Unknown"}\nBeliefs: ${n.beliefs || "Unknown"}`;
        }).filter(Boolean).join("\n\n") : "";

        root.worldName = window.literal(worldName);
        root.worldLore = window.literal(worldLore);
        root.setting = setting;
        root.tonesStr = tonesStr;
        root.themes = window.literal(themes);
        root.npcsText = window.literal(npcsText);
        root.dynamics = window.literal(dynamics);
        root.userName = window.literal(userName);
        root.userRole = window.literal(userRole);
        root.notes = window.literal(notes);
        root.lengthVal = lengthVal;
        root.scenarioContext = window.literal(scenarioContext);

        return root.prompts.roleplayPage.introStart.instruction.evaluateItem;
    };

    window.generateRoleplayNPC = async function (index, btn) {
        window.saveRoleplayState();
        let worldName = window.roleplayState.worldName || "Unnamed World";
        let worldLore = window.roleplayState.worldLore || "Generic setting";
        let setting = document.getElementById("rpSettingEl")?.value || "Any";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
        let themes = window.roleplayState.themes || "";
        let dynamics = window.roleplayState.rpDynamics ? window.roleplayState.rpDynamics.join(", ") : "Any";
        let userName = window.roleplayState.userName || "the Player";
        let userRole = window.roleplayState.userRole || "a protagonist";

        // Build existing NPC cast text (excluding current slot)
        let existingNpcsText = window.roleplayState.npcs.map((npc, idx) => {
            if (idx === index || !npc.name || !npc.name.trim()) return "";
            return `- Name: ${npc.name}, Role: ${npc.role}, Personality: ${npc.personality}`;
        }).filter(Boolean).join("\n");

        let origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i>`;

        root.worldName = window.literal(worldName);
        root.worldLore = window.literal(worldLore);
        root.setting = setting;
        root.tonesStr = tonesStr;
        root.themes = window.literal(themes);
        root.dynamics = window.literal(dynamics);
        root.userName = window.literal(userName);
        root.userRole = window.literal(userRole);
        root.existingNpcsText = window.literal(existingNpcsText);

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
                    age: data.age || "",
                    gender: data.gender || "",
                    race: data.race || data.species || "",
                    role: data.role || "",
                    appearance: data.appearance || "",
                    personality: data.personality || "",
                    beliefs: data.beliefs || "",
                    likes: data.likes || "",
                    dislikes: data.dislikes || "",
                    abilities: data.abilities || "",
                    biography: data.biography || "",
                    rules: data.rules || "",
                    image: ""
                };

                // Let's populate DOM fields directly to avoid layout disruption before image finishes
                let fields = ["name", "age", "gender", "race", "role", "appearance", "personality", "beliefs", "likes", "dislikes", "abilities", "biography", "rules"];
                fields.forEach(f => {
                    let input = document.getElementById(`rpNPC-${index}-${f}`);
                    if (input) input.value = data[f] || "";
                });

                // Trigger Text-to-Image for character
                let imgFn = typeof window.image !== 'undefined' ? window.image : (typeof image !== 'undefined' ? image : null);
                if (imgFn) {
                    try {
                        btn.innerHTML = `<i class="bi bi-image spin-icon"></i>`;
                        let imgPrompt = `portrait of ${data.name || "character"}, ${data.gender || ""} ${data.age || ""} ${data.race || ""}. ${data.appearance || ""}. Artstyle: anime cel shading, manhwa style, semi-realistic, mature, artstation quality. composition: upper-body portrait, centered, looking at the camera, pure solid white background.`;
                        let imgRes = await imgFn({
                            prompt: imgPrompt,
                            resolution: "512x512"
                        });
                        if (imgRes && imgRes.dataUrl) {
                            window.roleplayState.npcs[index].image = imgRes.dataUrl;
                            
                            let imgContainer = document.getElementById(`rpNPC-${index}-imgContainer`);
                            if (imgContainer) {
                                imgContainer.style.backgroundImage = `url(${imgRes.dataUrl})`;
                                imgContainer.innerHTML = "";
                            }
                        }
                    } catch (err) {
                        console.error("Failed to generate NPC image:", err);
                    }
                }

                window.saveRoleplayState();
                window.renderNPCGrid();
            }
        } catch (e) {
            console.error("Failed to generate Roleplay NPC:", e);
            alert("AI failed to return valid JSON for NPC. Try again.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = origText;
        }
    };

    window.generateRoleplayCast = async function () {
        let npcs = window.roleplayState.npcs || [];
        let genBtn = document.getElementById("rpCastGenBtnEl");
        let stopBtn = document.getElementById("rpCastStopBtnEl");
        if (genBtn) genBtn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";

        window.roleplayCastGenStopped = false;

        try {
            for (let i = 0; i < npcs.length; i++) {
                if (window.roleplayCastGenStopped) break;
                let npc = npcs[i];
                // Check if name is empty (indicating empty/unset card)
                if (!npc.name || !npc.name.trim()) {
                    let cardBtn = document.querySelector(`#rpNPCsPanelEl button[onclick*="generateRoleplayNPC(${i},"]`);
                    let tempBtn = cardBtn || { innerHTML: "", disabled: false };
                    
                    let statusEl = document.getElementById("rpStatusEl");
                    if (statusEl) {
                        statusEl.innerHTML = `<span><i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> Generating Cast Member #${i+1}...</span>`;
                    }
                    
                    await window.generateRoleplayNPC(i, tempBtn);
                }
            }
            return !window.roleplayCastGenStopped;
        } catch (e) {
            console.error("Cast generation failed:", e);
            return false;
        } finally {
            if (genBtn) genBtn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
        }
    };

    window.stopRoleplayCastGen = function () {
        window.roleplayCastGenStopped = true;
    };

    window.clearRoleplayCast = function () {
        if (!confirm("Are you sure you want to clear all cast members?")) return;
        window.roleplayState.npcs = window.roleplayState.npcs.map(() => ({
            name: "", age: "", gender: "", race: "", role: "",
            appearance: "", personality: "", beliefs: "", likes: "", dislikes: "",
            abilities: "", biography: "", rules: "", image: ""
        }));
        window.saveRoleplayState();
        window.renderNPCGrid();
    };

    window.clearRoleplayAll = function () {
        if (!confirm("Are you sure you want to clear all fields and outputs on the Roleplay tab?")) return;
        
        // 1. World Setting & Lore
        let worldOutput = document.getElementById("rpWorldOutputEl");
        if (worldOutput) worldOutput.innerHTML = "";
        let worldNotes = document.getElementById("rpWorldLoreNotesEl");
        if (worldNotes) worldNotes.value = "";
        window.roleplayState.worldLore = "";

        // 2. NPC Cast
        window.roleplayState.npcs = window.roleplayState.npcs.map(() => ({
            name: "", age: "", gender: "", race: "", role: "",
            appearance: "", personality: "", beliefs: "", likes: "", dislikes: "",
            abilities: "", biography: "", rules: "", image: ""
        }));
        window.renderNPCGrid();

        // 3. Timeline, Lore, Examples, Intro
        window.clearSection("timeline");
        window.clearSection("lore");
        window.clearSection("roleplay");
        window.clearIntro();

        // 4. Output Scenario and Starter
        window.roleplayState.outputScenario = "";
        window.roleplayState.outputStarter = "";

        let tabScenario = document.getElementById("rpOutputTabEl-scenario");
        let tabStarter = document.getElementById("rpOutputTabEl-starter");
        if (tabScenario) tabScenario.innerHTML = "";
        if (tabStarter) tabStarter.innerHTML = "";

        let outputSec = document.getElementById("rpOutputSectionEl");
        if (outputSec) outputSec.style.display = "none";

        let statusEl = document.getElementById("rpStatusEl");
        if (statusEl) statusEl.innerHTML = "";

        window.saveRoleplayState();
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

        try {
            // Pipeline Step 1: World Setting & Lore
            let worldOutput = document.getElementById("rpWorldOutputEl");
            if (worldOutput && !worldOutput.innerText.trim()) {
                if (statusEl) {
                    statusEl.innerHTML = `<span style="color:var(--text-muted); display:inline-flex; align-items:center; gap:0.4rem;">
                        <i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> [Pipeline] Weaving World Lore...
                    </span>`;
                }
                let success = await window.generateRoleplayWorldLore();
                if (!success) return;
            }

            // Pipeline Step 2: NPC Casts
            let npcs = window.roleplayState.npcs || [];
            let needsCastGen = npcs.some(npc => !npc.name || !npc.name.trim());
            if (needsCastGen) {
                if (statusEl) {
                    statusEl.innerHTML = `<span style="color:var(--text-muted); display:inline-flex; align-items:center; gap:0.4rem;">
                        <i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> [Pipeline] Populating NPC Cast...
                    </span>`;
                }
                let success = await window.generateRoleplayCast();
                if (!success) return;
            }

            // Pipeline Step 3: Timeline
            let timelineOutput = document.getElementById("rpTab-timelineOutputEl");
            if (timelineOutput && !timelineOutput.innerText.trim()) {
                if (statusEl) {
                    statusEl.innerHTML = `<span style="color:var(--text-muted); display:inline-flex; align-items:center; gap:0.4rem;">
                        <i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> [Pipeline] Building Scenario Timeline...
                    </span>`;
                }
                let success = await window.generateSection("timeline");
                if (!success) return;
            }

            // Pipeline Step 4: Lore Entries
            let loreOutput = document.getElementById("rpTab-loreContent1El");
            if (loreOutput && !loreOutput.value.trim()) {
                if (statusEl) {
                    statusEl.innerHTML = `<span style="color:var(--text-muted); display:inline-flex; align-items:center; gap:0.4rem;">
                        <i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> [Pipeline] Designing Lore Entries...
                    </span>`;
                }
                let success = await window.generateSection("lore");
                if (!success) return;
            }

            // Pipeline Step 5: Roleplay Examples
            let rpOutput = document.getElementById("rpTab-roleplayOutputEl");
            if (rpOutput && !rpOutput.innerText.trim()) {
                if (statusEl) {
                    statusEl.innerHTML = `<span style="color:var(--text-muted); display:inline-flex; align-items:center; gap:0.4rem;">
                        <i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> [Pipeline] Writing Roleplay Examples...
                    </span>`;
                }
                let success = await window.generateSection("roleplay");
                if (!success) return;
            }

            // Pipeline Step 6: Roleplay Intro
            let introScenarioOutput = document.getElementById("rpTab-introScenarioOutputEl");
            let introStartOutput = document.getElementById("rpTab-introStartOutputEl");
            let introScenarioEmpty = !introScenarioOutput || !introScenarioOutput.innerText.trim();
            let introStartEmpty = !introStartOutput || !introStartOutput.innerText.trim();
            if (introScenarioEmpty || introStartEmpty) {
                if (statusEl) {
                    statusEl.innerHTML = `<span style="color:var(--text-muted); display:inline-flex; align-items:center; gap:0.4rem;">
                        <i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> [Pipeline] Formatting Scene Intro...
                    </span>`;
                }
                let success = await window.generateIntro();
                if (!success) return;
            }

            // Final Step: Main Roleplay Scenario & Starter Generation
            if (statusEl) {
                statusEl.innerHTML = `<span style="color:var(--text-muted); display:inline-flex; align-items:center; gap:0.4rem;">
                    <i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> Weaving final roleplay scenario & starter...
                </span>`;
            }

            // Build NPC prompt block
            let npcsText = window.roleplayState.npcs.map((npc, idx) => {
                if (!npc.name) return "";
                let lines = [`NPC #${idx + 1}:`, `- Name: ${npc.name}`];
                if (npc.age) lines.push(`- Age: ${npc.age}`);
                if (npc.gender) lines.push(`- Gender: ${npc.gender}`);
                let raceVal = npc.race || npc.species;
                if (raceVal) lines.push(`- Species/Race: ${raceVal}`);
                if (npc.role) lines.push(`- Narrative Role: ${npc.role}`);
                if (npc.appearance) lines.push(`- Appearance: ${npc.appearance}`);
                if (npc.personality) lines.push(`- Personality: ${npc.personality}`);
                if (npc.beliefs) lines.push(`- Beliefs/Worldview: ${npc.beliefs}`);
                if (npc.likes) lines.push(`- Likes: ${npc.likes}`);
                if (npc.dislikes) lines.push(`- Dislikes: ${npc.dislikes}`);
                if (npc.abilities) lines.push(`- Abilities/Skills: ${npc.abilities}`);
                if (npc.biography) lines.push(`- Biography/Background: ${npc.biography}`);
                if (npc.rules) lines.push(`- Constraints/Rules: ${npc.rules}`);
                return lines.join("\n");
            }).filter(Boolean).join("\n\n");

            if (!npcsText) {
                npcsText = "None specified (generate 1-2 interesting NPCs fitting the world setting).";
            }

            let bgCastText = (window.roleplayState.backgroundNpcs || document.getElementById("rpBackgroundCastEl")?.value || "").trim();
            if (bgCastText) {
                if (npcsText && npcsText !== "None specified (generate 1-2 interesting NPCs fitting the world setting).") {
                    npcsText += `\n\nBACKGROUND CAST (SINGLE-LINE DESCRIPTIONS):\n${bgCastText}`;
                } else {
                    npcsText = `BACKGROUND CAST (SINGLE-LINE DESCRIPTIONS):\n${bgCastText}`;
                }
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

            let setting = document.getElementById("rpSettingEl")?.value || "Any";
            let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
            let themes = window.roleplayState.themes || "";
            let rpDynamicsStr = window.roleplayState.rpDynamics ? window.roleplayState.rpDynamics.join(", ") : "Any";
            let roleplayPrompt = window.roleplayState.roleplayPrompt || "";

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
                lengthInstruction,
                rpDynamicsStr,
                window.literal(roleplayPrompt)
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

                // If starter is not empty, show edit button
                if (starterPart) {
                    let btn = document.getElementById("rpEditBtn");
                    if (btn) btn.style.display = "inline-flex";
                }
            }
        } catch (e) {
            console.error("Roleplay generation failed:", e);
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
        window.stopRoleplayWorldLore();
        window.stopRoleplayCastGen();
        window.stopSection("timeline");
        window.stopSection("lore");
        window.stopSection("roleplay");
        window.stopIntroGeneration();
    };

    window.clearRoleplayData = function () {
        if (!confirm("Are you sure you want to clear all fields and outputs on the Roleplay tab? This cannot be undone.")) return;
        
        // 1. World Setting & Lore
        let worldOutput = document.getElementById("rpWorldOutputEl");
        if (worldOutput) worldOutput.innerHTML = "";
        let worldNotes = document.getElementById("rpWorldLoreNotesEl");
        if (worldNotes) worldNotes.value = "";
        window.roleplayState.worldLore = "";

        // 2. NPC Cast
        window.roleplayState.npcs = window.roleplayState.npcs.map(() => ({
            name: "", age: "", gender: "", race: "", role: "",
            appearance: "", personality: "", beliefs: "", likes: "", dislikes: "",
            abilities: "", biography: "", rules: "", image: ""
        }));
        window.renderNPCGrid();

        // 3. Timeline, Lore, Examples, Intro
        window.clearSection("timeline");
        window.clearSection("lore");
        window.clearSection("roleplay");
        window.clearIntro();

        // 4. Output Scenario and Starter
        window.roleplayState.outputScenario = "";
        window.roleplayState.outputStarter = "";

        let tabScenario = document.getElementById("rpOutputTabEl-scenario");
        let tabStarter = document.getElementById("rpOutputTabEl-starter");
        if (tabScenario) tabScenario.innerHTML = "";
        if (tabStarter) tabStarter.innerHTML = "";

        let outputSec = document.getElementById("rpOutputSectionEl");
        if (outputSec) outputSec.style.display = "none";

        let statusEl = document.getElementById("rpStatusEl");
        if (statusEl) statusEl.innerHTML = "";

        window.saveRoleplayState();
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

/* ==========================================================================
   BACKGROUND NPC CAST CONTROLLER & EXPORTS
   ========================================================================== */
    window.roleplayPromptPresets = {
        "slow-burn": "Act as a collaborative novelist focusing on a slow-burn narrative. Prioritize atmospheric descriptions, internal monologues, and subtle character chemistry over rapid plot progression. Do not rush the story or resolve conflicts prematurely; let tension build organically through dialogue and subtext. Avoid summarizing time skips unless requested. Instead, focus on the 'micro-moments'—the small gestures and pauses that make a scene feel lived-in and authentic.",
        "gamemaster": "Act as a hidden Gamemaster and world simulator. Your goal is to maintain a consistent, reactive environment where every action has a logical consequence. Do not play as my character or dictate my thoughts; instead, describe the world's reaction to my inputs. Keep the plot driven by environmental cues and NPC interactions. Manage the 'invisible' systems of the world—politics, weather, and NPC motivations—and reveal them only through organic discovery. Always leave the outcome of a scene open for my character to influence."
    };

    window.selectRoleplayPromptPreset = function (presetKey) {
        let textEl = document.getElementById("rpPromptTextEl");
        if (!textEl) return;

        if (presetKey === "none") {
            textEl.value = "";
        } else if (window.roleplayPromptPresets[presetKey]) {
            textEl.value = window.roleplayPromptPresets[presetKey];
        }
        window.roleplayState.roleplayPromptType = presetKey;
        window.roleplayState.roleplayPrompt = textEl.value;
        window.saveRoleplayState();
    };

    window.clearRoleplayPrompt = function () {
        let typeEl = document.getElementById("rpPromptTypeEl");
        let textEl = document.getElementById("rpPromptTextEl");
        if (typeEl) typeEl.value = "none";
        if (textEl) textEl.value = "";
        window.roleplayState.roleplayPromptType = "none";
        window.roleplayState.roleplayPrompt = "";
        window.saveRoleplayState();
    };
    window.generateRoleplayBackgroundCast = async function () {
        let genBtn = document.getElementById("rpBgCastGenBtnEl");
        let statusEl = document.getElementById("rpBgCastStatusEl");
        let outputEl = document.getElementById("rpBackgroundCastEl");
        let notesEl = document.getElementById("rpBackgroundCastNotesEl");

        if (statusEl) statusEl.innerHTML = `<span><i class="bi bi-arrow-repeat spin-icon" style="color:var(--accent-color);"></i> Generating Background NPCs...</span>`;
        if (genBtn) genBtn.disabled = true;

        try {
            let existingNpcsText = (window.roleplayState.npcs || [])
                .map(n => n.name)
                .filter(Boolean)
                .join(", ");

            let promptStr = window.prompts.roleplayPage.npcBackgroundGeneration.compile(
                window.roleplayState.worldName || "",
                window.roleplayState.worldLore || "",
                window.roleplayState.setting || "",
                Array.isArray(window.roleplayState.tones) ? window.roleplayState.tones.join(", ") : (window.roleplayState.tones || ""),
                window.roleplayState.themes || "",
                existingNpcsText,
                notesEl ? notesEl.value : ""
            );

            let res = await window.ai({ instruction: promptStr });
            let resultText = typeof res === "string" ? res : (res.text || res.generatedText || "");

            if (outputEl) {
                outputEl.value = resultText.trim();
                window.roleplayState.backgroundNpcs = outputEl.value;
                window.saveRoleplayState();
            }
            if (statusEl) statusEl.innerHTML = `<span style="color:#10b981;"><i class="bi bi-check-circle-fill"></i> Generated background cast!</span>`;
            setTimeout(() => { if (statusEl) statusEl.textContent = ""; }, 3000);
        } catch (e) {
            console.error("Background cast generation failed:", e);
            if (statusEl) statusEl.innerHTML = `<span style="color:#ef4444;"><i class="bi bi-exclamation-triangle-fill"></i> Generation failed.</span>`;
        } finally {
            if (genBtn) genBtn.disabled = false;
        }
    };

    window.clearRoleplayBackgroundCast = function () {
        let outputEl = document.getElementById("rpBackgroundCastEl");
        let notesEl = document.getElementById("rpBackgroundCastNotesEl");
        if (outputEl) outputEl.value = "";
        if (notesEl) notesEl.value = "";
        window.roleplayState.backgroundNpcs = "";
        window.saveRoleplayState();
    };

    window.copyRoleplayBackgroundCast = function () {
        let outputEl = document.getElementById("rpBackgroundCastEl");
        if (!outputEl || !outputEl.value.trim()) return;
        navigator.clipboard.writeText(outputEl.value.trim()).then(() => {
            let btn = document.getElementById("rpBgCastCopyBtnEl");
            if (btn) {
                let orig = btn.innerHTML;
                btn.innerHTML = `<i class="bi bi-check-lg"></i> Copied!`;
                setTimeout(() => { btn.innerHTML = orig; }, 1500);
            }
        });
    };

    window.exportRoleplayAsMarkdown = function () {
        let rp = window.roleplayState || {};
        let title = (rp.worldName || "Roleplay Scenario").trim();
        let safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "_");

        let lines = [];
        lines.push(`# Roleplay Scenario: ${title}`);
        lines.push(``);
        if (rp.setting && rp.setting !== "Any") lines.push(`Setting: ${rp.setting}`);
        if (rp.tones && rp.tones.length > 0) lines.push(`Tones: ${Array.isArray(rp.tones) ? rp.tones.join(", ") : rp.tones}`);
        if (rp.rpDynamics && rp.rpDynamics.length > 0) lines.push(`Group Dynamics: ${Array.isArray(rp.rpDynamics) ? rp.rpDynamics.join(", ") : rp.rpDynamics}`);
        if (rp.themes) lines.push(`Themes: ${rp.themes}`);
        lines.push(``);

        if (rp.userName || rp.userRole) {
            lines.push(`## Player Character`);
            if (rp.userName) lines.push(`- Name: ${rp.userName}`);
            if (rp.userRole) lines.push(`- Role / Background: ${rp.userRole}`);
            lines.push(``);
        }

        if (rp.npcs && rp.npcs.length > 0) {
            lines.push(`## Main Cast (NPCs)`);
            rp.npcs.forEach((npc, i) => {
                if (npc.name || npc.role || npc.appearance) {
                    lines.push(`### NPC #${i + 1}: ${npc.name || "Unnamed"}`);
                    if (npc.role) lines.push(`- Role: ${npc.role}`);
                    if (npc.age || npc.gender || npc.race) lines.push(`- Details: ${[npc.age, npc.gender, npc.race].filter(Boolean).join(", ")}`);
                    if (npc.appearance) lines.push(`- Appearance: ${npc.appearance}`);
                    if (npc.personality) lines.push(`- Personality: ${npc.personality}`);
                    if (npc.beliefs) lines.push(`- Beliefs: ${npc.beliefs}`);
                    if (npc.abilities) lines.push(`- Abilities: ${npc.abilities}`);
                    if (npc.biography) lines.push(`- Biography: ${npc.biography}`);
                    if (npc.rules) lines.push(`- Rules: ${npc.rules}`);
                    lines.push(``);
                }
            });
        }

        let bgNpcs = (rp.backgroundNpcs || document.getElementById("rpBackgroundCastEl")?.value || "").trim();
        if (bgNpcs) {
            lines.push(`## Background Cast (NPCs)`);
            lines.push(bgNpcs);
            lines.push(``);
        }

        let rpPrompt = (rp.roleplayPrompt || document.getElementById("rpPromptTextEl")?.value || "").trim();
        if (rpPrompt) {
            lines.push(`## Roleplay Guidance Prompt`);
            lines.push(rpPrompt);
            lines.push(``);
        }

        if (rp.scenarioNotes) {
            lines.push(`## Scenario Notes / Conflict`);
            lines.push(rp.scenarioNotes);
            lines.push(``);
        }

        if (rp.timeline) {
            lines.push(`## Timeline`);
            lines.push(rp.timeline);
            lines.push(``);
        }

        let plotText = (rp.plot || document.getElementById("rpTab-plotOutputEl")?.innerText || "").trim();
        if (plotText) {
            lines.push(`## Plot & Hook`);
            lines.push(plotText);
            lines.push(``);
        }

        if (rp.lore) {
            lines.push(`## Lore Entries`);
            lines.push(rp.lore);
            lines.push(``);
        }

        if (rp.introScenario) {
            lines.push(`## Scenario Context`);
            lines.push(rp.introScenario);
            lines.push(``);
        }

        if (rp.introStart) {
            lines.push(`## Roleplay Start`);
            lines.push(rp.introStart);
            lines.push(``);
        }

        if (rp.outputScenario) {
            lines.push(`## Compiled Scenario Sheet`);
            lines.push(rp.outputScenario);
            lines.push(``);
        }

        if (rp.outputStarter) {
            lines.push(`## Compiled Roleplay Starter`);
            lines.push(rp.outputStarter);
            lines.push(``);
        }

        let markdownText = lines.join("\n");
        let blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${safeTitle}_roleplay.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    window.exportRoleplayAsJson = function () {
        let rp = window.roleplayState || {};
        let title = (rp.worldName || "Roleplay Scenario").trim();
        let safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "_");

        let jsonStr = JSON.stringify(rp, null, 2);
        let blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${safeTitle}_roleplay.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    window.saveRoleplayFromTopBar = function (btn) {
        if (window.saveRoleplayState) window.saveRoleplayState();
        if (btn) {
            let orig = btn.innerHTML;
            btn.innerHTML = `<i class="bi bi-check-lg"></i> Saved!`;
            setTimeout(() => { btn.innerHTML = orig; }, 2000);
        }
    };

    // Hook layout loading on load
    setTimeout(() => {
        window.loadRoleplayState();
        
        // Restore notes and lengths for copied roleplay tab panels
        let rpTimelineNotesEl = document.getElementById("rpTab-timelineNotesEl");
        if (rpTimelineNotesEl) rpTimelineNotesEl.value = localStorage.rpTimelineNotes || "";
        let rpTimelineLengthEl = document.getElementById("rpTab-timelineLengthEl");
        if (rpTimelineLengthEl) {
            rpTimelineLengthEl.value = localStorage.rpTimelineLength || "medium";
            window.syncCustomSelectLabel(rpTimelineLengthEl);
        }

        let rpLoreNotesEl = document.getElementById("rpTab-loreNotesEl");
        if (rpLoreNotesEl) rpLoreNotesEl.value = localStorage.rpLoreNotes || "";

        let rpRoleplayNotesEl = document.getElementById("rpTab-roleplayNotesEl");
        if (rpRoleplayNotesEl) rpRoleplayNotesEl.value = localStorage.rpRoleplayNotes || "";
        let rpRoleplayLengthEl = document.getElementById("rpTab-roleplayLengthEl");
        if (rpRoleplayLengthEl) {
            rpRoleplayLengthEl.value = localStorage.rpRoleplayLength || "medium";
            window.syncCustomSelectLabel(rpRoleplayLengthEl);
        }

        let rpIntroNotesEl = document.getElementById("rpTab-introNotesEl");
        if (rpIntroNotesEl) rpIntroNotesEl.value = localStorage.rpIntroNotes || "";
        let rpIntroLengthEl = document.getElementById("rpTab-introLengthEl");
        if (rpIntroLengthEl) {
            rpIntroLengthEl.value = localStorage.rpIntroLength || "medium";
            window.syncCustomSelectLabel(rpIntroLengthEl);
        }
        
        // Restore elements value if present
        let nameEl = document.getElementById("rpWorldNameEl");
        let loreNotesEl = document.getElementById("rpWorldLoreNotesEl");
        let worldOutputEl = document.getElementById("rpWorldOutputEl");
        let userEl = document.getElementById("rpUserNameEl");
        let userRoleEl = document.getElementById("rpUserRoleEl");
        let notesEl = document.getElementById("rpScenarioNotesEl");
        let lengthEl = document.getElementById("rpLengthEl");
        let themesEl = document.getElementById("rpThemesEl");
        let bgCastEl = document.getElementById("rpBackgroundCastEl");
        let promptTypeEl = document.getElementById("rpPromptTypeEl");
        let promptTextEl = document.getElementById("rpPromptTextEl");

        if (nameEl) nameEl.value = window.roleplayState.worldName || "";
        if (loreNotesEl) loreNotesEl.value = window.roleplayState.worldLoreNotes || "";
        if (worldOutputEl && window.roleplayState.worldLore) {
            worldOutputEl.innerHTML = formatSectionText(sanitizeOutput(window.roleplayState.worldLore));
            let editBtn = document.getElementById("rpWorldEditBtnEl");
            if (editBtn) editBtn.style.display = "inline-block";
            let copyBtn = document.getElementById("rpWorldCopyBtnEl");
            if (copyBtn) copyBtn.style.display = "inline-block";
        }
        if (userEl) userEl.value = window.roleplayState.userName || "";
        if (userRoleEl) userRoleEl.value = window.roleplayState.userRole || "";
        if (notesEl) notesEl.value = window.roleplayState.scenarioNotes || "";
        if (lengthEl) lengthEl.value = window.roleplayState.activeLength || "medium";
        if (themesEl) themesEl.value = window.roleplayState.themes || "";
        if (bgCastEl) bgCastEl.value = window.roleplayState.backgroundNpcs || "";
        if (promptTypeEl) promptTypeEl.value = window.roleplayState.roleplayPromptType || "none";
        if (promptTextEl) promptTextEl.value = window.roleplayState.roleplayPrompt || "";

        // Restore setting, tone, dynamic, length custom elements
        window.selectRoleplaySetting(window.roleplayState.setting || "Any");
        window.loadRoleplayTones();
        window.loadRoleplayDynamics();

        let castCountEl = document.getElementById("rpNPCCastCountEl");
        if (castCountEl) {
            castCountEl.value = (window.roleplayState.npcs && window.roleplayState.npcs.length) || 2;
            window.syncCustomSelectLabel(castCountEl);
        }

        let globalLengthEl = document.getElementById("rpGlobalLengthEl");
        if (globalLengthEl) {
            globalLengthEl.value = localStorage.globalLength || "custom";
            window.syncCustomSelectLabel(globalLengthEl);
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

        // Restore Timeline, Lore, Examples, Intro Scenario/Start if present
        if (window.roleplayState.timeline) {
            let el = document.getElementById("rpTab-timelineOutputEl");
            if (el) {
                el.innerHTML = formatSectionText(window.roleplayState.timeline);
                let editBtn = document.getElementById("rpTab-timelineEditBtnEl");
                let copyBtn = document.getElementById("rpTab-timelineCopyBtnEl");
                if (editBtn) editBtn.style.display = "inline-block";
                if (copyBtn) copyBtn.style.display = "inline-block";
            }
        }
        if (window.roleplayState.lore) {
            let el = document.getElementById("rpTab-loreOutputEl");
            if (el) {
                el.style.display = "none";
                window.loadLoreToUI(window.roleplayState.lore, true);
                let copyBtn = document.getElementById("rpTab-loreCopyBtnEl");
                if (copyBtn) copyBtn.style.display = "inline-block";
            }
        }
        if (window.roleplayState.roleplay) {
            let el = document.getElementById("rpTab-roleplayOutputEl");
            if (el) {
                el.innerHTML = formatSectionText(window.roleplayState.roleplay);
                let editBtn = document.getElementById("rpTab-roleplayEditBtnEl");
                let copyBtn = document.getElementById("rpTab-roleplayCopyBtnEl");
                if (editBtn) editBtn.style.display = "inline-block";
                if (copyBtn) copyBtn.style.display = "inline-block";
            }
        }
        if (window.roleplayState.introScenario) {
            let el = document.getElementById("rpTab-introScenarioOutputEl");
            if (el) {
                el.innerHTML = formatSectionText(window.roleplayState.introScenario);
                let editBtn = document.getElementById("rpTab-introScenarioEditBtnEl");
                let copyBtn = document.getElementById("rpTab-introScenarioCopyBtnEl");
                if (editBtn) editBtn.style.display = "inline-block";
                if (copyBtn) copyBtn.style.display = "inline-block";
            }
        }
        if (window.roleplayState.introStart) {
            let el = document.getElementById("rpTab-introStartOutputEl");
            if (el) {
                el.innerHTML = formatSectionText(window.roleplayState.introStart);
                let editBtn = document.getElementById("rpTab-introStartEditBtnEl");
                let copyBtn = document.getElementById("rpTab-introStartCopyBtnEl");
                if (editBtn) editBtn.style.display = "inline-block";
                if (copyBtn) copyBtn.style.display = "inline-block";
            }
        }
        
        // Sync the Saved Worlds selector
        if (window.triggerWorldSelectorSync) {
            window.triggerWorldSelectorSync();
        }
    }, 100);

})();
