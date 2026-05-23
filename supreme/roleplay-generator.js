// ─── ROLEPLAY GENERATOR MODULE ──────────────────────────────────────────
(function () {
    // Initial State
    window.roleplayState = {
        worldName: "",
        worldLore: "",
        userName: "",
        userRole: "",
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
    window.saveRoleplayState = function () {
        try {
            // Read current DOM values
            window.roleplayState.worldName = document.getElementById("rpWorldNameEl")?.value || "";
            window.roleplayState.worldLore = document.getElementById("rpWorldLoreEl")?.value || "";
            window.roleplayState.userName = document.getElementById("rpUserNameEl")?.value || "";
            window.roleplayState.userRole = document.getElementById("rpUserRoleEl")?.value || "";
            window.roleplayState.scenarioNotes = document.getElementById("rpScenarioNotesEl")?.value || "";
            window.roleplayState.activeLength = document.getElementById("rpLengthEl")?.value || "medium";

            localStorage.rpState = JSON.stringify({
                worldName: window.roleplayState.worldName,
                worldLore: window.roleplayState.worldLore,
                userName: window.roleplayState.userName,
                userRole: window.roleplayState.userRole,
                npcs: window.roleplayState.npcs,
                scenarioNotes: window.roleplayState.scenarioNotes,
                activeLength: window.roleplayState.activeLength,
                outputScenario: window.roleplayState.outputScenario,
                outputStarter: window.roleplayState.outputStarter
            });
        } catch (e) {
            console.warn("Failed to save roleplayState to localStorage:", e);
        }
    };

    // Load a saved world into Roleplay inputs
    window.loadSavedWorldIntoRoleplay = function (id) {
        if (!id) return;
        id = isNaN(Number(id)) ? id : Number(id);
        
        let saved = [];
        try {
            saved = JSON.parse(localStorage.savedWorlds || "[]");
        } catch (e) {}

        let w = saved.find(x => x.id === id);
        if (w) {
            let nameEl = document.getElementById("rpWorldNameEl");
            let loreEl = document.getElementById("rpWorldLoreEl");
            if (nameEl) nameEl.value = w.name;
            if (loreEl) loreEl.value = w.sections.overview || "";

            window.roleplayState.worldName = w.name;
            window.roleplayState.worldLore = w.sections.overview || "";
            window.saveRoleplayState();

            // Notify status
            let statusEl = document.getElementById("rpStatusEl");
            let outputSec = document.getElementById("rpOutputSectionEl");
            if (outputSec) outputSec.style.display = "block";
            if (statusEl) {
                statusEl.innerHTML = `<span style="color:#10b981;"><i class="bi bi-check-circle-fill"></i> Loaded world details from saved world "${w.name}".</span>`;
                setTimeout(() => { statusEl.textContent = ""; }, 3000);
            }
        }
    };

    // Sync World Name & Lore from Character Generator World Panel
    window.syncWorldFromCharGen = function () {
        let name = document.getElementById("worldNameEl")?.value || "";
        let lore = document.getElementById("worldLoreEl")?.value || "";

        let nameEl = document.getElementById("rpWorldNameEl");
        let loreEl = document.getElementById("rpWorldLoreEl");

        if (nameEl) nameEl.value = name;
        if (loreEl) loreEl.value = lore;

        window.roleplayState.worldName = name;
        window.roleplayState.worldLore = lore;
        
        window.saveRoleplayState();
        
        // Show status feedback
        let statusEl = document.getElementById("rpStatusEl");
        let outputSec = document.getElementById("rpOutputSectionEl");
        if (outputSec) outputSec.style.display = "block";
        if (statusEl) {
            statusEl.innerHTML = `<span style="color:#10b981;"><i class="bi bi-check-circle-fill"></i> Synced world details from Character Generator tab.</span>`;
            setTimeout(() => { statusEl.textContent = ""; }, 3000);
        }
    };

    // Dynamic NPCs list management
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
                            <select onchange="importSavedCharToNPC(${index}, this.value)" class="length-select" style="font-size: 78%; padding: 0.15rem 0.4rem; max-width: 90px; height: 22px; cursor: pointer;">
                                <option value="">Import...</option>
                                ${importOptions}
                            </select>
                            <button onclick="generateRoleplayNPC(${index}, this)" class="small-btn" style="padding: 0.15rem 0.35rem; font-size: 75%; height: 22px; border-color: rgba(var(--accent-color-rgb),0.3); color: var(--accent-color);" title="Generate NPC details via AI"><i class="bi bi-sparkles"></i></button>
                            <button onclick="removeNPC(${index})" class="small-btn clear-btn" style="padding: 0.15rem 0.35rem; font-size: 75%; height: 22px; display: inline-flex; align-items: center; justify-content: center;" title="Remove NPC"><i class="bi bi-trash"></i></button>
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

    // AI generating buttons for Roleplay
    window.generateRoleplayWorldLore = async function (btn) {
        window.saveRoleplayState();
        let name = window.roleplayState.worldName.trim() || "Unnamed World";
        let setting = document.getElementById("settingLabel")?.textContent.trim() || "Any setting";
        let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";

        let origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i>`;

        let instruction = `Write a concise world overview (3-4 sentences maximum) for a roleplay setting. 
World Name: ${name}
Setting: ${setting}
Tones: ${tonesStr}

Do not include titles. Write in a factual, evocative style. Do not use the em-dash (\u2014) character. Output only the lore content.`;

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
        let setting = document.getElementById("settingLabel")?.textContent.trim() || "Any Setting";

        let origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="bi bi-arrow-repeat spin-icon"></i>`;

        let instruction = `Generate a single creative NPC profile fitting the world described below. 
World Name: ${worldName}
Lore: ${worldLore}
Setting Genre: ${setting}

You MUST respond with exactly a JSON object containing keys: "name", "species", "personality", "role".
Example response:
{
  "name": "Kaito",
  "species": "Cyborg",
  "personality": "Quiet, tactical, distrustful.",
  "role": "Infiltrator and guide."
}

Output ONLY the valid raw JSON object. Do not wrap in markdown \`\`\`json blocks. Do not use em-dashes.`;

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

        let instruction = `Generate a creative RPG roleplay conflict scenario / plot hook (2-3 sentences maximum).
World Name: ${worldName}
World Lore: ${worldLore}
NPCs: ${npcsText || "Generic side characters"}
Player Role: ${userRole}

Establish an immediate danger, mystery, or conflict that unites the player and the NPCs. Output only the scenario notes. Do not write titles. Do not use em-dashes.`;

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

    // Generate Roleplay Scenario via AI
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
        let lengthInstruction = "";
        if (lengthVal === "short") lengthInstruction = "Write a short, engaging starter message (1-2 paragraphs).";
        else if (lengthVal === "long") lengthInstruction = "Write an extremely rich, slow-paced, detailed starter message (5+ paragraphs) setting up the atmosphere, sensory environment, and character positions.";
        else lengthInstruction = "Write a medium-length, descriptive starter message (3-4 paragraphs).";

        let worldName = window.roleplayState.worldName || "an unnamed realm";
        let worldLore = window.roleplayState.worldLore || "a mysterious world of unknown dangers";
        let pName = window.roleplayState.userName || "the Player";
        let pRole = window.roleplayState.userRole || "a protagonist";
        let scenarioNotes = window.roleplayState.scenarioNotes || "The characters are meeting for the first time or embarking on a mutual task.";

        let prompt = `You are a creative co-writer and RPG Scenario Designer. You are creating a structured multi-character Roleplay Scenario Sheet and a Starter Message. The user is the player of this roleplay.

WORLD DATA:
- World Name: ${worldName}
- World Lore/Setting: ${worldLore}

PLAYER DATA (The User):
- Player Name: ${pName}
- Player Role/Background: ${pRole}

NPC CAST SHEET:
${npcsText}

SCENARIO INSTRUCTIONS:
- Plot Hook / Situation: ${scenarioNotes}

STRICT FORMATTING RULE: Do NOT use the em dash character (\u2014) anywhere in your response. Replace any em dash with a comma, semicolon, colon, or rewrite.

TASK:
Generate a structured scenario document divided into exactly two blocks using the separator string "=== ROLEPLAY_STARTER_SEPARATOR ===".

Before the separator, output the SCENARIO SHEET containing:
1. **World Expansion**: 2-3 sentences expanding on the setting specifics for this scene.
2. **Character Sheet Details**: A concise summary of each NPC's hidden motivations, initial attitude towards ${pName}, and their relationships.
3. **Plot Setup & Objective**: What is the immediate conflict, and what is the group's goal?

After the separator, output the ROLEPLAY STARTER POST:
- Set the scene at the very beginning of the action. Describe the immediate surroundings, sensory details (sounds, weather, light), and character actions.
- Write in third-person limited (or second-person if fitting) focusing on ${pName}'s perspective.
- End the starter post with an action, dialogue, or event from one of the NPCs that directly prompts ${pName} to speak or act, creating a natural hook.
- ${lengthInstruction}

Respond using the separator "=== ROLEPLAY_STARTER_SEPARATOR ===" between the Scenario Sheet and the Starter Post. Output nothing else.`;

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
                if (tabScenario) tabScenario.innerHTML = formatSectionText(scenarioPart);
                if (tabStarter) tabStarter.innerHTML = formatSectionText(starterPart);

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

        if (nameEl) nameEl.value = window.roleplayState.worldName || "";
        if (loreEl) loreEl.value = window.roleplayState.worldLore || "";
        if (userEl) userEl.value = window.roleplayState.userName || "";
        if (userRoleEl) userRoleEl.value = window.roleplayState.userRole || "";
        if (notesEl) notesEl.value = window.roleplayState.scenarioNotes || "";
        if (lengthEl) lengthEl.value = window.roleplayState.activeLength || "medium";

        // Restore dynamic NPC list
        window.renderNPCGrid();

        // Restore generated texts if present
        if (window.roleplayState.outputScenario || window.roleplayState.outputStarter) {
            let outputSec = document.getElementById("rpOutputSectionEl");
            if (outputSec) outputSec.style.display = "block";

            let tabScenario = document.getElementById("rpOutputTabEl-scenario");
            let tabStarter = document.getElementById("rpOutputTabEl-starter");

            if (tabScenario) tabScenario.innerHTML = formatSectionText(window.roleplayState.outputScenario);
            if (tabStarter) tabStarter.innerHTML = formatSectionText(window.roleplayState.outputStarter);

            let editBtn = document.getElementById("rpEditBtn");
            if (editBtn) editBtn.style.display = "inline-flex";
        }
        
        // Sync the Saved Worlds selector
        if (window.triggerWorldSelectorSync) {
            window.triggerWorldSelectorSync();
        }
    }, 100);

})();
