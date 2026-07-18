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
                rpDynamics: window.roleplayState.rpDynamics,
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
    window.generateRoleplayWorldLore = async function (btn) {
        window.saveRoleplayState();
        let name = window.roleplayState.worldName.trim() || "Unnamed World";
        let setting = document.getElementById("rpSettingEl")?.value || "Any";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";

        let origText = btn ? btn.innerHTML : "";
        if (btn) { btn.disabled = true; btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i>`; }

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
            if (btn) { btn.disabled = false; btn.innerHTML = origText; }
        }
    };

    window.generateRoleplayNPC = async function (index, btn) {
        window.saveRoleplayState();
        let worldName = window.roleplayState.worldName || "Unnamed World";
        let worldLore = window.roleplayState.worldLore || "Generic setting";
        let setting = document.getElementById("rpSettingEl")?.value || "Any";

        let origText = btn ? btn.innerHTML : "";
        if (btn) { btn.disabled = true; btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i>`; }

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

                // Trigger Text-to-Image for character (only when a btn is available to show progress)
                let imgFn = typeof window.image !== 'undefined' ? window.image : (typeof image !== 'undefined' ? image : null);
                if (imgFn && btn) {
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
            if (btn) alert("AI failed to return valid JSON for NPC. Try again.");
        } finally {
            if (btn) { btn.disabled = false; btn.innerHTML = origText; }
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
            rpDynamicsStr
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
        
        // Sync the Saved Worlds selector
        if (window.triggerWorldSelectorSync) {
            window.triggerWorldSelectorSync();
        }
    }, 100);

/* ==========================================================================
   ROLEPLAY PANEL SECTION GENERATION ENGINE
   ========================================================================== */

    /**
     * Builds a reusable roleplay context object from current roleplayState and DOM values.
     * @returns {Object} Structured context object.
     */
    window.buildRoleplayContext = function () {
        let worldName = window.roleplayState.worldName || document.getElementById("rpWorldNameEl")?.value || "an unnamed world";
        let worldLore = window.roleplayState.worldLore || document.getElementById("rpWorldLoreEl")?.value || "a mysterious world";
        let userName = window.roleplayState.userName || document.getElementById("rpUserNameEl")?.value || "{{user}}";
        let userRole = window.roleplayState.userRole || document.getElementById("rpUserRoleEl")?.value || "the protagonist";
        let setting = window.roleplayState.setting || document.getElementById("rpSettingEl")?.value || "Any";
        let tonesStr = (window.roleplayState.tones || []).join(", ") || "Any";
        let rpDynamicsStr = (window.roleplayState.rpDynamics || []).join(", ") || "Any";

        // Compile NPC text summary
        let npcsText = (window.roleplayState.npcs || []).map((npc, idx) => {
            if (!npc.name) return "";
            let lines = [`NPC #${idx + 1}:`, `- Name: ${npc.name}`];
            if (npc.age)        lines.push(`- Age: ${npc.age}`);
            if (npc.gender)     lines.push(`- Gender: ${npc.gender}`);
            let raceVal = npc.race || npc.species;
            if (raceVal)        lines.push(`- Race/Species: ${raceVal}`);
            if (npc.role)       lines.push(`- Narrative Role: ${npc.role}`);
            if (npc.appearance) lines.push(`- Appearance: ${npc.appearance}`);
            if (npc.personality)lines.push(`- Personality: ${npc.personality}`);
            if (npc.beliefs)    lines.push(`- Beliefs/Worldview: ${npc.beliefs}`);
            if (npc.likes)      lines.push(`- Likes: ${npc.likes}`);
            if (npc.dislikes)   lines.push(`- Dislikes: ${npc.dislikes}`);
            if (npc.abilities)  lines.push(`- Abilities/Skills: ${npc.abilities}`);
            if (npc.biography)  lines.push(`- Biography: ${npc.biography}`);
            return lines.join("\n");
        }).filter(Boolean).join("\n\n") || "No NPCs defined yet.";

        return { worldName, worldLore, userName, userRole, setting, tonesStr, rpDynamicsStr, npcsText };
    };

    /**
     * Generic roleplay panel section generator. Streams AI output directly into the
     * rpTab section output element using roleplay world/NPC context.
     * @param {string} section - Section key: 'timeline', 'lore', 'roleplay', 'introScenario', 'introStart'
     * @returns {Promise<boolean>} True on success, false on stop/failure.
     */
    window.generateRoleplaySection = async function (section) {
        if (!window.rpSectionStreams) window.rpSectionStreams = {};
        if (window.rpSectionStreams[section]) {
            window.rpSectionStreams[section].stop();
        }

        let genBtn   = document.getElementById("rpTab-" + section + "GenBtnEl");
        let stopBtn  = document.getElementById("rpTab-" + section + "StopBtnEl");
        let statusEl = document.getElementById("rpTab-" + section + "StatusEl");
        let outputEl = document.getElementById("rpTab-" + section + "OutputEl");
        let notesEl  = document.getElementById("rpTab-" + section + "NotesEl");
        let lengthEl = document.getElementById("rpTab-" + section + "LengthEl");

        // For introScenario and introStart the notes textarea is shared (rpTab-introNotesEl)
        if (!notesEl && (section === "introScenario" || section === "introStart")) {
            notesEl = document.getElementById("rpTab-introNotesEl");
        }

        let notes    = notesEl?.value?.trim() || "";
        let lengthVal = lengthEl?.value || localStorage[section + "Length"] || "medium";

        // Resolve length instruction
        let lengthInstruction = "";
        if (window.getLengthInstruction) {
            lengthInstruction = window.getLengthInstruction(lengthVal, section) || "";
        }

        // UI: start state
        if (genBtn)   genBtn.disabled = true;
        if (stopBtn)  stopBtn.style.display = "inline-flex";
        if (statusEl) statusEl.textContent = "⏳ Generating...";
        if (outputEl) { outputEl.innerHTML = ""; outputEl.style.display = "block"; outputEl.classList.add("generating-pulse"); }

        setGenerationStatus("Generating roleplay " + section + "...");

        // Build context
        let ctx = window.buildRoleplayContext();
        let rp  = root.prompts.roleplayPage;

        // Build section-specific prompt
        let instruction = "";
        if (section === "timeline") {
            instruction = rp.rpTimeline.compile(
                window.literal(ctx.worldName), window.literal(ctx.worldLore),
                ctx.setting, ctx.tonesStr,
                window.literal(ctx.npcsText), window.literal(notes)
            );
        } else if (section === "lore") {
            instruction = rp.rpLore.compile(
                window.literal(ctx.worldName), window.literal(ctx.worldLore),
                ctx.setting, ctx.tonesStr,
                window.literal(ctx.npcsText), window.literal(notes)
            );
        } else if (section === "roleplay") {
            instruction = rp.rpExamples.compile(
                window.literal(ctx.worldName), window.literal(ctx.worldLore),
                ctx.setting, ctx.tonesStr,
                window.literal(ctx.npcsText),
                window.literal(ctx.userName), window.literal(ctx.userRole),
                window.literal(notes)
            );
        } else if (section === "introScenario") {
            instruction = rp.rpIntroScenario.compile(
                window.literal(ctx.worldName), window.literal(ctx.worldLore),
                ctx.setting, ctx.tonesStr,
                window.literal(ctx.npcsText),
                window.literal(ctx.userName), window.literal(ctx.userRole),
                window.literal(notes), window.literal(lengthInstruction)
            );
        } else if (section === "introStart") {
            // Pass scenario context generated so far
            let scenarioText = document.getElementById("rpTab-introScenarioOutputEl")?.innerText?.trim() || "";
            instruction = rp.rpIntroStart.compile(
                window.literal(ctx.worldName),
                window.literal(ctx.npcsText),
                window.literal(ctx.userName), window.literal(ctx.userRole),
                window.literal(scenarioText),
                ctx.tonesStr,
                window.literal(notes), window.literal(lengthInstruction)
            );
        } else {
            console.warn("generateRoleplaySection: Unknown section:", section);
            if (genBtn)   genBtn.disabled = false;
            if (stopBtn)  stopBtn.style.display = "none";
            if (statusEl) statusEl.textContent = "";
            if (outputEl) outputEl.classList.remove("generating-pulse");
            return false;
        }

        let typewriter = new TypewriterStreamer(outputEl, { speed: 10 });

        let stream = ai({
            instruction,
            onChunk: (data) => {
                typewriter.appendTargetText(data.fullTextSoFar);
            }
        });
        window.rpSectionStreams[section] = stream;

        let success = false;
        try {
            let result = await stream;
            typewriter.destroy();

            if (result.stopReason === "user") {
                if (statusEl) statusEl.textContent = "⛔ Stopped.";
                // For lore, attempt partial parse
                if (section === "lore" && outputEl) {
                    window.loadLoreToUI(outputEl.innerText);
                    outputEl.style.display = "none";
                }
                return false;
            }

            let sanitized = sanitizeOutput(result.text);

            if (section === "lore") {
                // Parse JSON lore into the grid fields
                window.loadLoreToUI(sanitized);
                // Hide raw streaming output (lore shows in fields, not raw output)
                if (outputEl) outputEl.style.display = "none";
                if (statusEl) statusEl.textContent = "";
                let exportBtn = document.getElementById("rpTab-loreExportJsonBtnEl");
                if (exportBtn) exportBtn.style.display = "inline-block";
                let copyBtn = document.getElementById("rpTab-loreCopyBtnEl");
                if (copyBtn) copyBtn.style.display = "inline-block";
            } else {
                if (outputEl) {
                    outputEl.innerHTML = formatSectionText(sanitized);
                }
                if (statusEl) statusEl.textContent = "";
                // Show edit/copy buttons
                let editBtn = document.getElementById("rpTab-" + section + "EditBtnEl");
                if (editBtn) editBtn.style.display = "inline-block";
                let copyBtn = document.getElementById("rpTab-" + section + "CopyBtnEl");
                if (copyBtn) copyBtn.style.display = "inline-block";
            }

            success = true;
        } catch (e) {
            console.error("generateRoleplaySection failed for section:", section, e);
            if (statusEl) statusEl.textContent = "❌ Failed.";
            success = false;
        } finally {
            if (genBtn)   genBtn.disabled = false;
            if (stopBtn)  stopBtn.style.display = "none";
            if (outputEl) outputEl.classList.remove("generating-pulse");
            window.rpSectionStreams[section] = null;
            setGenerationStatus("");
        }

        return success;
    };

    /**
     * Stops an in-progress roleplay section generation.
     * @param {string} section - Section key.
     */
    window.stopRoleplaySection = function (section) {
        if (window.rpSectionStreams && window.rpSectionStreams[section]) {
            window.rpSectionStreams[section].stop();
        }
    };

    /**
     * Sequences roleplay intro generation: Scenario Context first, then Opening Message.
     * Uses the NPC cast and world context from roleplayState.
     */
    window.generateRoleplayIntro = async function () {
        let genBtn  = document.getElementById("rpTab-introGenBtnEl");
        let stopBtn = document.getElementById("rpTab-introStopBtnEl");

        if (genBtn)  genBtn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-flex";

        try {
            // Step 1: Scenario Context
            let scenarioOk = await window.generateRoleplaySection("introScenario");

            // Step 2: Opening Message (uses scenario from step 1)
            await window.generateRoleplaySection("introStart");
        } finally {
            if (genBtn)  genBtn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
        }
    };

    /**
     * Stops both intro sub-section streams.
     */
    window.stopRoleplayIntro = function () {
        window.stopRoleplaySection("introScenario");
        window.stopRoleplaySection("introStart");
    };

    /**
     * Generates all NPCs in the cast that have empty names.
     * Each NPC is generated sequentially using generateNPC().
     * @param {HTMLElement} [btn] - The trigger button (for spinner feedback).
     */
    window.generateAllRoleplayNPCs = async function (btn) {
        if (btn) btn.disabled = true;
        let npcs = window.roleplayState.npcs || [];
        for (let i = 0; i < npcs.length; i++) {
            if (!npcs[i].name?.trim()) {
                await window.generateRoleplayNPC(i, null);
            }
        }
        if (btn) btn.disabled = false;
    };


    /**
     * Master "Generate All Roleplay" function. Generates all panels in order,
     * intelligently skipping any section that already has content.
     */
    window.generateAllRoleplay = async function () {
        if (window.rpGenerateAllRunning) return;
        window.rpGenerateAllRunning = true;

        let genBtn  = document.getElementById("rpGenerateAllBtnEl");
        let stopBtn = document.getElementById("rpGenerateAllStopBtnEl");

        if (genBtn)  genBtn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-flex";

        setGenerationStatus("Generating full roleplay scenario...");

        // Helper: check if output element has meaningful content
        const hasContent = (id) => {
            let el = document.getElementById(id);
            return el && el.innerText?.trim().length > 20;
        };

        // Helper: check if lore fields are populated
        const hasLoreContent = () => {
            for (let i = 1; i <= 5; i++) {
                let keyEl     = document.getElementById("rpTab-loreKey" + i + "El");
                let contentEl = document.getElementById("rpTab-loreContent" + i + "El");
                if (keyEl?.value?.trim() || contentEl?.value?.trim()) return true;
            }
            return false;
        };

        try {
            // 1. World Lore
            let worldLoreEl = document.getElementById("rpWorldLoreEl");
            if (!worldLoreEl?.value?.trim()) {
                setGenerationStatus("Generating world lore...");
                if (window.generateRoleplayWorldLore) {
                    await window.generateRoleplayWorldLore(null);
                }
            }
            if (!window.rpGenerateAllRunning) return;

            // 2. NPCs (generate only the empty ones)
            let npcs = window.roleplayState.npcs || [];
            let hasEmptyNPCs = npcs.some(n => !n.name?.trim());
            if (hasEmptyNPCs) {
                setGenerationStatus("Generating NPC cast...");
                await window.generateAllRoleplayNPCs(null);
            }
            if (!window.rpGenerateAllRunning) return;

            // 3. Timeline
            if (!hasContent("rpTab-timelineOutputEl")) {
                setGenerationStatus("Generating world timeline...");
                await window.generateRoleplaySection("timeline");
            }
            if (!window.rpGenerateAllRunning) return;

            // 4. Lore Entries
            if (!hasLoreContent()) {
                setGenerationStatus("Generating lore entries...");
                await window.generateRoleplaySection("lore");
            }
            if (!window.rpGenerateAllRunning) return;

            // 5. Roleplay Examples
            if (!hasContent("rpTab-roleplayOutputEl")) {
                setGenerationStatus("Generating roleplay examples...");
                await window.generateRoleplaySection("roleplay");
            }
            if (!window.rpGenerateAllRunning) return;

            // 6. Roleplay Intro (Scenario Context + Opening Message)
            let hasScenario = hasContent("rpTab-introScenarioOutputEl");
            let hasStart    = hasContent("rpTab-introStartOutputEl");
            if (!hasScenario || !hasStart) {
                setGenerationStatus("Generating roleplay intro...");
                await window.generateRoleplayIntro();
            }

            setGenerationStatus("✅ Roleplay generation complete!");
            setTimeout(() => setGenerationStatus(""), 3000);
        } finally {
            window.rpGenerateAllRunning = false;
            if (genBtn)  genBtn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
        }
    };

    /**
     * Stops the Generate All Roleplay sequence and all active section streams.
     */
    window.stopAllRoleplay = function () {
        window.rpGenerateAllRunning = false;
        ["timeline", "lore", "roleplay", "introScenario", "introStart"].forEach(s => {
            window.stopRoleplaySection(s);
        });
        // Also stop the world lore stream if running
        if (window.activeRpWorldLoreStream) window.activeRpWorldLoreStream.stop();
        // Also stop NPC streams
        if (window.stopAllNPCGenerations) window.stopAllNPCGenerations();
        setGenerationStatus("");
    };

})();

