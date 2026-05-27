    // ─── WORLD LORE ───────────────────────────────────────────────────
    window.generateWorldLore = async function (force = false) {
        if (!force && worldLoreEl.value.trim().length > 0) return;

        if (window.sectionStreams && window.sectionStreams["worldLore"]) {
            window.sectionStreams["worldLore"].stop();
        }

        setSectionGenerating("worldLore", true);
        setSectionStatus("worldLore", "⏳ Chronicling world lore...");
        setGenerationStatus("Chronicling world lore...");

        let settingValue = settingEl.value;
        let toneValues = getSelectedTones();
        let toneStr = toneValues.length > 0 && toneValues[0] !== "Any" ? toneValues.join(", ") : "unspecified";
        let userNotes = (document.getElementById("worldLoreNotesEl") || {}).value || "";
        let existingWorldName = (document.getElementById("worldNameEl") || {}).value || "";
        let needsName = !existingWorldName.trim();

        let instruction = `You are writing a concise, factual "World Lore" summary for a character generator. This text will be used by AI to generate consistent characters, so it must contain actionable facts  -  NOT atmospheric prose.
Setting: ${settingValue}
Tones: ${toneStr}${userNotes ? `\nUser Hints / Notes: ${userNotes}` : ""}${existingWorldName ? `\nWorld Name: ${existingWorldName}` : ""}

Rules (STRICTLY FOLLOW):
1. Write 3-5 SHORT bullet points or brief sentences. Each one is a concrete, specific fact.
2. Cover: time period & location, technology/magic level, society/political structure, daily life tone, and one major ongoing conflict or theme.
3. DO NOT write flowery prose, metaphors, poetic imagery, or literary descriptions.
4. DO NOT write vague statements like "magic exists"  -  be specific: what kind, how it works, who has it.
5. Format: plain sentences or short bullet points. No headers. No intro/outro.
6. Aim for 60-120 words maximum.${needsName ? `\n7. At the very end, on its own line, output exactly: WORLD_NAME: [A short, creative 1-4 word name for this world, fitting the setting]` : ""}

Good example output (for "Contemporary Japan, college life"):
- Contemporary Tokyo, Japan, year 2026.
- High-tech society; smartphones, social media, and convenience stores define daily life.
- Characters are primarily college students navigating academic pressure, part-time jobs, and social hierarchies.
- Society values harmony and group belonging, but young people increasingly struggle with loneliness and identity.
- Major tension: the gap between tradition (family expectations, senpai/kouhai culture) and individual freedom.

Respond with ONLY the world lore facts (and WORLD_NAME line if requested). No heading, no intro, no prose filler.

${getBannedFormattingRule()}`;

        worldLoreEl.value = "";
        worldLoreEl.placeholder = "Generating...";

        let typewriter = new TypewriterStreamer(worldLoreEl, { speed: 10 });
        window.sectionTypewriters = window.sectionTypewriters || {};
        if (window.sectionTypewriters["worldLore"]) {
            window.sectionTypewriters["worldLore"].destroy();
        }
        window.sectionTypewriters["worldLore"] = typewriter;

        let stream = ai({
            instruction,
            onChunk: (data) => {
                // Strip the WORLD_NAME line from the live typewriter display
                let displayText = data.fullTextSoFar.replace(/\nWORLD_NAME:.*$/i, "").trim();
                typewriter.appendTargetText(displayText);
            }
        });
        window.sectionStreams = window.sectionStreams || {};
        window.sectionStreams["worldLore"] = stream;

        let result;
        try {
            result = await stream;
        } catch (e) {
            console.warn("World lore generation failed:", e);
            typewriter.destroy();
            setSectionGenerating("worldLore", false);
            setSectionStatus("worldLore", "❌ Failed.");
            setGenerationStatus("");
            return false;
        }

        if (result.stopReason === "user") {
            typewriter.destroy();
            setSectionGenerating("worldLore", false);
            setSectionStatus("worldLore", "⛔ Stopped.");
            setGenerationStatus("");
            return false;
        }

        // Extract and strip the WORLD_NAME from the result
        let finalText = result.text.trim();
        if (needsName) {
            let nameMatch = finalText.match(/\nWORLD_NAME:\s*(.+)$/im);
            if (nameMatch) {
                let generatedName = nameMatch[1].trim().replace(/^\[|\]$/g, "");
                finalText = finalText.replace(/\nWORLD_NAME:.*$/im, "").trim();
                let nameEl = document.getElementById("worldNameEl");
                if (nameEl && !nameEl.value.trim()) {
                    nameEl.value = generatedName;
                    localStorage.worldName = generatedName;
                }
            }
        }

        typewriter.appendTargetText(finalText);
        await typewriter.completionPromise;

        setSectionGenerating("worldLore", false);
        worldLoreEl.value = finalText;
        localStorage.worldLore = worldLoreEl.value;
        setSectionStatus("worldLore", "");
        setGenerationStatus("");
        let worldNameForHistory = (document.getElementById("worldNameEl") || {}).value || "";
        pushWorldLoreHistory(worldLoreEl.value, null, worldNameForHistory);
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();

        await generateWorldLoreImage(worldLoreEl.value);
        return true;
    };


    window.generateWorldLoreImage = async function (text) {
        if (!text) return;
        setSectionStatus("worldLore", "🎨 Generating world visualization...");
        setGenerationStatus("Generating world visualization...");

        let instruction = `Based on the world lore below, extract 5-8 vivid visual keyphrases for an environment/landscape concept art prompt.
Lore: ${text}

Respond with ONLY a comma-separated list of visual descriptors. Focus on colors, architecture, weather, and landmarks. No extra text.`;

        let res = await ai({ instruction });
        let visualKeyphrases = res.text.trim().replace(/^"|"$/g, "");

        let prompt = sanitizeImagePrompt(`landscape concept art, environment, cinematic lighting, ${visualKeyphrases}, high quality, detailed, masterpiece`);
        let img = image({
            prompt: prompt,
            resolution: "768x512",
        });

        let result = await img;
        if (result.dataUrl) {
            updateWorldLoreVisuals(result.dataUrl);
            let worldNameForHistory = (document.getElementById("worldNameEl") || {}).value || "";
            pushWorldLoreHistory(text, result.dataUrl, worldNameForHistory);
        }
        setSectionStatus("worldLore", "");
        setGenerationStatus("");
    };

    window.updateWorldLoreVisuals = function (url) {
        if (!url) return;
        let thumb = document.getElementById("worldLoreThumbEl");
        let container = document.getElementById("worldLoreImgContainer");
        if (thumb) {
            thumb.style.backgroundImage = `url(${url})`;
        }
        if (container) {
            container.style.display = "flex";
        }
        if (typeof worldLoreBgEl !== 'undefined') {
            worldLoreBgEl.style.backgroundImage = `url(${url})`;
        }
        localStorage.worldLoreImageUrl = url;
    };

    window.toggleWorldLoreEdit = function () {
        let textarea = document.getElementById("worldLoreEl");
        let btn = document.getElementById("worldLoreEditBtnEl");
        if (!textarea || !btn) return;
        let isReadOnly = textarea.readOnly;
        textarea.readOnly = !isReadOnly;
        if (isReadOnly) {
            textarea.style.border = "1px solid var(--accent-color)";
            textarea.focus();
            btn.innerHTML = '<i class="bi bi-floppy"></i> save';
        } else {
            textarea.style.border = "1px solid var(--panel-border)";
            btn.innerHTML = '<i class="bi bi-pencil-square"></i> edit';
            localStorage.worldLore = textarea.value;
        }
    };

    window.clearWorldLore = function () {
        let textarea = document.getElementById("worldLoreEl");
        if (textarea) { textarea.value = ""; }
        let nameEl = document.getElementById("worldNameEl");
        if (nameEl) { nameEl.value = ""; }
        localStorage.removeItem("worldLore");
        localStorage.removeItem("worldLoreImageUrl");
        localStorage.removeItem("worldName");
        let container = document.getElementById("worldLoreImgContainer");
        if (container) { container.style.display = "none"; }
        if (typeof worldLoreBgEl !== 'undefined') { worldLoreBgEl.style.backgroundImage = "none"; }
        setSectionStatus("worldLore", "");
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.pushWorldLoreHistory = function (text, imageUrl, worldName) {
        if (!text || text.trim().length < 10) return;
        let history = JSON.parse(localStorage.worldLoreHistory || "[]");
        // Update if it's the same text but now has an image or name
        if (history.length > 0 && history[0].text === text) {
            if (imageUrl) history[0].imageUrl = imageUrl;
            if (worldName) history[0].worldName = worldName;
            localStorage.worldLoreHistory = JSON.stringify(history);
            return;
        }
        history.unshift({ text, imageUrl: imageUrl || null, worldName: worldName || "" });
        if (history.length > 10) history = history.slice(0, 10);
        localStorage.worldLoreHistory = JSON.stringify(history);
    };

    window.showWorldLoreHistoryModal = function () {
        let history = JSON.parse(localStorage.worldLoreHistory || "[]");
        if (history.length === 0) {
            prompt2({ content: { type: "none", html: `<div style="padding:1rem; text-align:center; opacity:0.6; font-size:90%;"><i class="bi bi-globe" style="font-size:2rem; display:block; margin-bottom:0.5rem;"></i>No world lore history yet.</div>` } }, { cancelButtonText: "close", submitButtonText: null });
            return;
        }

        let cardsHtml = history.map((h, i) => {
            let text = typeof h === 'string' ? h : h.text;
            let imageUrl = typeof h === 'object' ? h.imageUrl : null;
            let worldName = typeof h === 'object' ? (h.worldName || "") : "";
            let truncated = text.length > 150 ? text.substring(0, 150) + "..." : text;
            let cardBg = imageUrl ? `background-image: url(${imageUrl}); background-size: cover; background-position: center;` : `background: var(--input-bg);`;
            return `
            <div style="border-radius:10px; border:1px solid var(--panel-border); overflow:hidden; background:var(--panel-bg); box-shadow:0 2px 8px rgba(0,0,0,0.18); display:flex; flex-direction:column;">
                <div style="height:90px; position:relative; ${cardBg} flex-shrink:0;">
                    <div style="position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%);"></div>
                    <div style="position:absolute; bottom:0.4rem; left:0.6rem; right:0.4rem; display:flex; align-items:flex-end; justify-content:space-between; gap:0.3rem;">
                        <span style="font-size:85%; font-weight:700; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,0.9); flex:1; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">${worldName ? `🌍 ${worldName}` : `🌍 World ${i + 1}`}</span>
                    </div>
                </div>
                <div style="padding:0.6rem 0.7rem 0.5rem; display:flex; flex-direction:column; gap:0.4rem; flex:1;">
                    <div style="font-size:79%; opacity:0.72; line-height:1.4; overflow:hidden; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;">${truncated.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
                    <button class="btn btn-primary btn-sm" onclick="restoreWorldLore(${i})" style="align-self:stretch; font-size:80%; padding:0.3rem 0.6rem; margin-top:auto;"><i class="bi bi-box-arrow-in-down"></i> Load World</button>
                </div>
            </div>
            `;
        }).join("");

        let html = `
        <div style="min-width:min(520px, 92vw); max-width:600px;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem;">
                <i class="bi bi-globe" style="color:var(--accent-color); font-size:1.15rem;"></i>
                <b style="font-size:105%;">World Lore History</b>
                <span style="font-size:78%; opacity:0.5; margin-left:auto;">${history.length} saved world${history.length !== 1 ? 's' : ''}</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:0.75rem; max-height:460px; overflow-y:auto; padding-bottom:0.25rem;">
                ${cardsHtml}
            </div>
        </div>`;

        prompt2({ content: { type: "none", html } }, { cancelButtonText: "close", submitButtonText: null });
    };

    window.restoreWorldLore = function (index) {
        let history = JSON.parse(localStorage.worldLoreHistory || "[]");
        let h = history[index];
        if (h) {
            let text = typeof h === 'string' ? h : h.text;
            let url = typeof h === 'object' ? h.imageUrl : null;
            let worldName = typeof h === 'object' ? (h.worldName || "") : "";

            worldLoreEl.value = text;
            localStorage.worldLore = text;

            // Restore world name
            let nameEl = document.getElementById("worldNameEl");
            if (nameEl) { nameEl.value = worldName; localStorage.worldName = worldName; }

            if (url) updateWorldLoreVisuals(url);
            else {
                // Clear visuals if no image in history
                let container = document.getElementById("worldLoreImgContainer");
                if (container) container.style.display = "none";
                if (typeof worldLoreBgEl !== 'undefined') worldLoreBgEl.style.backgroundImage = "none";
                localStorage.removeItem("worldLoreImageUrl");
            }

            document.querySelectorAll(".prompt2-modal").forEach(el => el.remove());
            document.querySelectorAll(".prompt2-overlay").forEach(el => el.remove());
        }
    };

    // ─── DETAILS ─────────────────────────────────────────────────────
    window.saveDetails = function () {
        localStorage.detailName = detailNameEl.value;
        localStorage.detailAge = detailAgeEl.value;
        localStorage.detailGender = detailGenderEl.value;
        localStorage.detailOrientation = detailOrientationEl.value;
        localStorage.detailRace = detailRaceEl.value;
        localStorage.detailEthnicity = detailEthnicityEl.value;
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };
    window.loadDetails = function () {
        detailNameEl.value = localStorage.detailName || "";
        detailAgeEl.value = localStorage.detailAge || "";
        detailGenderEl.value = localStorage.detailGender || "";
        detailOrientationEl.value = localStorage.detailOrientation || "";
        detailRaceEl.value = localStorage.detailRace || "";
        detailEthnicityEl.value = localStorage.detailEthnicity || "";
    };
    window.getDetailsContext = function () {
        return {
            name: detailNameEl.value.trim(),
            age: detailAgeEl.value.trim(),
            gender: detailGenderEl.value.trim(),
            orientation: detailOrientationEl.value.trim(),
            species: detailRaceEl.value.trim(),
            ethnicity: detailEthnicityEl.value.trim(),
        };
    };
    window.applyGeneratedDetails = function (details) {
        if (!detailNameEl.value.trim() && details.name) { detailNameEl.value = sanitizeOutput(details.name); }
        if (!detailAgeEl.value.trim() && details.age) { detailAgeEl.value = sanitizeOutput(details.age); }
        if (!detailGenderEl.value.trim() && details.gender) { detailGenderEl.value = sanitizeOutput(details.gender); }
        if (!detailOrientationEl.value.trim() && details.orientation) { detailOrientationEl.value = sanitizeOutput(details.orientation); }
        if (!detailRaceEl.value.trim() && details.species) { detailRaceEl.value = sanitizeOutput(details.species); }
        if (!detailEthnicityEl.value.trim() && details.ethnicity) { detailEthnicityEl.value = sanitizeOutput(details.ethnicity); }
        saveDetails();
    };

    // ─── SHARED UTILITIES ─────────────────────────────────────────────
    window.getSectionText = function (section) {
        if (section === "lore") {
            return compileLoreFromUI();
        }
        let el = document.getElementById(section + "OutputEl");
        if (!el) return "";
        return el.innerText.trim();
    };

    window.parseLoreJSON = function(str) {
        if (!str) return null;
        let trimmed = str.trim();
        let jsonMatch = trimmed.match(/\{[\s\S]*\}/);
        let cleaned = jsonMatch ? jsonMatch[0] : trimmed.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
    };

    window.loadLoreToUI = function(loreData) {
        clearLoreFields();
        if (!loreData) return;
        
        let parsed = null;
        if (typeof loreData === 'string') {
            try {
                parsed = parseLoreJSON(loreData);
            } catch (e) {
                // Not valid JSON, treat as raw text
            }
        } else if (typeof loreData === 'object') {
            parsed = loreData;
        }
        
        if (parsed && typeof parsed === 'object') {
            for (let i = 1; i <= 5; i++) {
                let entry = parsed[String(i)] || parsed[i];
                if (entry) {
                    let keysVal = "";
                    if (Array.isArray(entry.key)) {
                        keysVal = entry.key.join("; ");
                    } else if (typeof entry.key === 'string') {
                        keysVal = entry.key;
                    }
                    let contentVal = entry.content || "";
                    
                    let keyEl = document.getElementById("loreKey" + i + "El");
                    let contentEl = document.getElementById("loreContent" + i + "El");
                    if (keyEl) keyEl.value = keysVal;
                    if (contentEl) contentEl.value = contentVal;
                }
            }
        } else {
            let content1El = document.getElementById("loreContent1El");
            if (content1El) {
                content1El.value = String(loreData).trim();
            }
        }
        saveLoreToLocalStorage();
    };

    window.clearLoreFields = function() {
        for (let i = 1; i <= 5; i++) {
            let keyEl = document.getElementById("loreKey" + i + "El");
            let contentEl = document.getElementById("loreContent" + i + "El");
            if (keyEl) keyEl.value = "";
            if (contentEl) contentEl.value = "";
        }
    };

    window.saveLoreToLocalStorage = function() {
        let jsonStr = compileLoreFromUI();
        if (jsonStr) {
            localStorage.loreText = jsonStr;
            if (window.characterSections) {
                window.characterSections.lore = jsonStr;
            }
        } else {
            localStorage.removeItem("loreText");
            if (window.characterSections) {
                delete window.characterSections.lore;
            }
        }
    };

    window.compileLoreFromUI = function() {
        let result = {};
        let hasAny = false;
        for (let i = 1; i <= 5; i++) {
            let keyVal = (document.getElementById("loreKey" + i + "El")?.value || "").trim();
            let contentVal = (document.getElementById("loreContent" + i + "El")?.value || "").trim();
            if (keyVal || contentVal) {
                hasAny = true;
                let keysArray = keyVal ? keyVal.split(";").map(k => k.trim()).filter(Boolean) : [];
                result[String(i)] = {
                    content: contentVal,
                    key: keysArray
                };
            }
        }
        if (!hasAny) return "";
        return JSON.stringify(result, null, 2);
    };

    window.exportLoreAsJson = function() {
        let jsonStr = compileLoreFromUI();
        if (!jsonStr) {
            jsonStr = "{}";
        }
        let charName = (document.getElementById("detailNameEl")?.value || "character").trim();
        let safeName = charName.toLowerCase().replace(/[^a-z0-9]/g, "_") || "character";
        let filename = safeName + "_lore.json";
        
        let blob = new Blob([jsonStr], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    window.formatSectionText = function (text) {
        if (!text) return "";
        let r = text.replace(/(^|\n)([#*a-zA-Z/ _\-0-9]{1,50})(:\s?)/g, (m, p1, p2, p3) => p1 + `<b style="color:var(--accent-color)">${p2.replace(/[#*]/g, "").trim()}</b>` + (p3 === ":" ? ": " : p3));
        return r.replace(/(^|\n)([#*]+[a-zA-Z/ _\-0-9]{1,50})(\n)/g, (m, p1, p2, p3) => p1 + `<b style="color:var(--accent-color)">${p2.replace(/[#*]/g, "").trim()}</b>` + p3);
    };

    window.setGenerationStatus = function (message) {
        let trimmed = (message || "").trim();
        if (!trimmed && window.generateAllRunning) {
            return; // Ignore intermediate status clears during generateAll
        }
        let el = document.getElementById("generationStatusEl");
        if (!el) return;
        
        if (!trimmed) {
            el.innerHTML = `<span style="opacity: 0.5; display: inline-flex; align-items: center; gap: 0.4rem;"><i class="bi bi-circle-fill" style="color: #64748b; font-size: 6px;"></i> Idle</span>`;
        } else {
            let iconHtml = `<i class="bi bi-arrow-repeat spin-icon" style="color: var(--accent-color); font-size: 110%;"></i>`;
            if (trimmed.includes("✨") || trimmed.includes("✅")) {
                iconHtml = `<i class="bi bi-check-circle-fill" style="color: #10b981;"></i>`;
            }
            
            let cleanMessage = trimmed.replace(/^[⏳🧠🎨✨✅\s]+/, '').trim();
            el.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.4rem; color: var(--text-main);">
                    ${iconHtml}
                    <span>${cleanMessage}</span>
                </div>
            `;
        }
    };

    window.checkStorageUsage = function () {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) total += (localStorage[key].length * 2);
            }
            let usedMB = (total / 1024 / 1024).toFixed(1);
            let warningEl = document.getElementById("storageWarningEl");
            if (!warningEl) return;
            if (usedMB > 4) {
                warningEl.style.display = "block";
                warningEl.textContent = "⚠️ Storage is " + usedMB + "MB / ~5MB limit. Consider deleting some saved characters.";
            } else {
                warningEl.style.display = "none";
            }
        } catch (e) { }
    };

    // ─── PROMPT BUILDING ──────────────────────────────────────────────
    // ⚠️ STRICT GLOBAL RULE: Apply to every AI prompt  -  dynamically build banned formatting rules
    window.getBannedFormattingRule = function () {
        let ruleParts = [];
        
        ruleParts.push("IMPORTANT: Always refer to the user as {{user}}. Do not write out the word 'user', always use the exact macro {{user}}.");
        
        let banEmDash = localStorage.getItem("banEmDash") !== "false"; // Default true
        let banBolding = localStorage.getItem("banBolding") === "true"; // Default false
        let customBanned = (localStorage.getItem("customBanned") || "").trim();
        
        if (banEmDash) {
            ruleParts.push("Do NOT use the em dash character (\u2014) or en dash character (\u2013) anywhere in your response. Replace them with a comma, semicolon, colon, or rewrite the sentence to avoid them entirely.");
        }
        
        if (banBolding) {
            ruleParts.push("Do NOT use markdown bolding (**) anywhere in your output. Do NOT bold headings or keywords. Use plain text only.");
        }
        
        if (customBanned) {
            let terms = customBanned.split(",").map(t => t.trim()).filter(t => t.length > 0);
            if (terms.length > 0) {
                ruleParts.push("Do NOT use any of the following words or characters: " + terms.map(t => `"${t}"`).join(", ") + ".");
            }
        }
        
        if (ruleParts.length === 0) return "";
        return "STRICT FORMATTING RULE: " + ruleParts.join(" ");
    };
    window.sanitizeOutput = function (text) {
        if (!text) return "";
        let result = text;
        
        let banEmDash = localStorage.getItem("banEmDash") !== "false";
        let banBolding = localStorage.getItem("banBolding") === "true";
        let customBanned = (localStorage.getItem("customBanned") || "").trim();
        
        if (banEmDash) {
            result = result.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");
        }
        
        if (banBolding) {
            result = result.replace(/\*\*/g, "");
        }
        
        if (customBanned) {
            let terms = customBanned.split(",").map(t => t.trim()).filter(t => t.length > 0);
            for (let term of terms) {
                // Remove custom banned terms case-insensitively
                let escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                let regex = new RegExp(escaped, 'gi');
                result = result.replace(regex, "");
            }
        }
        
        return result;
    };

    window.getLengthInstruction = function (lengthVal) {
        if (!lengthVal || lengthVal === "custom") return "";
        if (typeof root !== 'undefined' && root.lengthSpecifiers && root.lengthSpecifiers[lengthVal]) {
            return "IMPORTANT Length Constraint: " + root.lengthSpecifiers[lengthVal].evaluateItem;
        }
        return "";
    };

    window.getSettingAndToneContext = function () {
        let setting = root.settingPrompts[settingEl.value] ? root.settingPrompts[settingEl.value].evaluateItem : "";
        let tones = getSelectedTones();
        let toneParts = tones
            .filter(t => t !== "Any" && root.tonePrompts[t])
            .map(t => root.tonePrompts[t].evaluateItem);
        
        let archetypes = typeof getSelectedArchetypes === "function" ? getSelectedArchetypes() : ["Any"];
        let archetypeParts = archetypes
            .filter(a => a !== "Any" && root.archetypePrompts && root.archetypePrompts[a])
            .map(a => root.archetypePrompts[a].evaluateItem);

        let parts = [];
        if (setting.trim()) parts.push("Setting: " + setting);
        if (toneParts.length > 0) parts.push("Tone: " + toneParts.join(" Additionally: "));
        if (archetypeParts.length > 0) parts.push("Character Archetype/Traits: " + archetypeParts.join(" Also: "));
        
        if (parts.length === 0) return "";
        return "IMPORTANT SETTING, TONE, AND ARCHETYPE PARAMETERS  -  follow these closely:\n" + parts.join("\n");
    };

    window.getReferencedCharacters = function () {
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        return saved.filter(c => {
            let checkbox = document.getElementById(`ref-${c.id}`);
            return checkbox && checkbox.checked;
        });
    };

    window.trimCharacterForReference = function (c) {
        let sections = [];
        if (c.name) sections.push("Name: " + c.name);
        if (c.appearanceText) sections.push("Physical Appearance: " + c.appearanceText.slice(0, 300) + (c.appearanceText.length > 300 ? "..." : ""));
        if (c.backgroundText) sections.push("Background: " + c.backgroundText.slice(0, 300) + (c.backgroundText.length > 300 ? "..." : ""));
        return sections.join("\n");
    };

    window.getReferencedCharactersContext = function () {
        let refs = getReferencedCharacters();
        if (refs.length === 0) return "";
        let refText = refs.map(c => `--- Referenced Character ---\n${trimCharacterForReference(c)}\n---`).join("\n\n");
        return "IMPORTANT  -  EXISTING CHARACTERS FOR CONTEXT:\nThe following character(s) already exist in this world. Your new character MUST have a concrete, specific connection to at least one of them  -  something that should be reflected in the section you are writing. Do NOT be vague about this connection. Do NOT copy their traits.\n\n" + refText;
    };

    window.buildCharacterContext = function (excludeSection) {
        let d = getDetailsContext();
        let lines = [];
        let detailParts = [];
        if (d.name) detailParts.push("Name: " + d.name);
        if (d.age) detailParts.push("Age: " + d.age);
        if (d.gender) detailParts.push("Gender: " + d.gender);
        if (d.orientation) detailParts.push("Orientation: " + d.orientation);
        if (d.species) detailParts.push("Race/Species: " + d.species);
        if (d.ethnicity) detailParts.push("Ethnicity: " + d.ethnicity);
        if (detailParts.length > 0) lines.push(detailParts.join("\n"));

        let sections = ["role", "personality", "beliefs", "preferences", "appearance", "background", "lore", "roleplay", "introScenario", "introStart"];
        for (let s of sections) {
            if (s === excludeSection) continue;
            let text = getSectionText(s);
            if (text) {
                let label = s === "appearance" ? "Physical Appearance" : s === "background" ? "Background" : s === "personality" ? "Personality" : s === "beliefs" ? "Beliefs & Morals" : s === "preferences" ? "Preferences" : s === "role" ? "Role" : s === "lore" ? "Lore" : s === "roleplay" ? "Roleplay Examples" : s === "introScenario" ? "Roleplay Intro - Scenario Context" : "Roleplay Intro - Dialogue & Narration";
                lines.push("### " + label + ":\n" + text);
            }
        }
        return lines.join("\n\n");
    };

    window.generateIdentityDetails = async function (sectionNotes, overviewOverride, worldLoreOverride, force) {
        if (force) {
            ["Name", "Age", "Gender", "Orientation", "Race", "Ethnicity"].forEach(f => {
                let el = document.getElementById("detail" + f + "El");
                if (el) el.value = "";
                localStorage.removeItem("detail" + f);
            });
            if (typeof clearAvatar === "function") clearAvatar();
        }
        let d = getDetailsContext();
        let allFilled = d.name && d.age && d.gender && d.orientation && d.species && d.ethnicity;
        
        let genBtn = document.getElementById("detailsGenBtnEl");
        let stopBtn = document.getElementById("detailsStopBtnEl");
        let statusEl = document.getElementById("detailsStatusEl");

        if (allFilled) {
            if (statusEl) {
                statusEl.textContent = "✓ All details already filled.";
                setTimeout(() => { if (statusEl.textContent === "✓ All details already filled.") statusEl.textContent = ""; }, 3000);
            }
            return true;
        }

        let blankFields = [];
        if (!d.name) blankFields.push("name");
        if (!d.age) blankFields.push("age (a number or short estimate)");
        if (!d.gender) blankFields.push("gender (one word or short phrase)");
        if (!d.orientation) blankFields.push("orientation (one word or short phrase)");
        if (!d.species) blankFields.push("species (one word or short phrase)");
        if (!d.ethnicity) blankFields.push("ethnicity (one word or short phrase)");

        let existingContext = buildCharacterContext(null);
        let settingAndTone = getSettingAndToneContext();
        let overviewNotes = overviewOverride !== undefined ? overviewOverride : (document.getElementById("overviewNotesEl") || {}).value || "";
        let worldLoreVal = worldLoreOverride !== undefined ? worldLoreOverride : (document.getElementById("worldLoreEl") || {}).value || "";
        let allUserNotes = [sectionNotes || "", overviewNotes].filter(Boolean).join("\n");
        let instruction = `You are filling in missing identity fields for a character. Generate ONLY the missing fields listed below  -  do not generate anything else.

IMPORTANT  -  scan the user notes and overview carefully before generating. If an explicit value for any field is stated anywhere (e.g. "25 year old", "she/her", "human", "asian"), you MUST use that exact value. Do not infer or reinterpret. Only invent a value if no indication exists anywhere in the provided context.

REGENERATION RULE: If a field is blank and listed in the "Fields to generate" list, it is because we want to replace the old value. Do NOT reuse the old value of this field even if it is mentioned in the existing character context below (e.g. if "name" is to be generated, do not reuse the old name mentioned in the background or personality sections; generate a completely new name instead).

${existingContext ? "Existing character context:\n---\n" + existingContext + "\n---\n" : ""}
${worldLoreVal ? "World Lore (ambient background knowledge):\n" + worldLoreVal + "\n" : ""}
${allUserNotes ? "User notes  -  scan these first for any explicit field values:\n" + allUserNotes + "\n" : ""}
${settingAndTone ? settingAndTone + "\n" : ""}
Fields to generate: ${blankFields.join(", ")}

Respond with ONLY a JSON object containing the missing fields, exactly like this:
{
  "name": "...",
  "age": "...",
  "gender": "...",
  "orientation": "...",
  "species": "...",
  "ethnicity": "..."
}
No explanation, no extra text.\n\n${getBannedFormattingRule()}`;

        if (genBtn) genBtn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";
        if (statusEl) statusEl.textContent = "⏳ Generating identity details...";
        setGenerationStatus("Generating identity details...");

        window.detailsStream = ai({ instruction });
        
        try {
            let result = await window.detailsStream;
            if (result.stopReason === "user") {
                if (statusEl) statusEl.textContent = "⛔ Stopped.";
                return false;
            }
            let text = result.text || "";
            let jsonMatch = text.match(/\{[\s\S]*\}/);
            let cleaned = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, "").trim();
            let json = JSON.parse(cleaned);
            applyGeneratedDetails(json);
            if (statusEl) statusEl.textContent = "";
            return true;
        } catch (e) {
            console.warn("Details extraction failed to parse JSON:", e);
            if (statusEl) statusEl.textContent = "❌ Generation failed.";
            return false;
        } finally {
            if (genBtn) genBtn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            setGenerationStatus("");
            window.detailsStream = null;
        }
    };

    window.stopDetailsGeneration = function () {
        if (window.detailsStream) {
            try { window.detailsStream.stop(); } catch(e){}
        }
        let genBtn = document.getElementById("detailsGenBtnEl");
        let stopBtn = document.getElementById("detailsStopBtnEl");
        let statusEl = document.getElementById("detailsStatusEl");
        if (genBtn) genBtn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
        if (statusEl) statusEl.textContent = "⛔ Stopped.";
        setGenerationStatus("");
    };

    window.regenerateSingleDetail = async function (field) {
        let el = document.getElementById("detail" + field + "El");
        if (el) {
            el.value = "";
            let lsKey = "detail" + field;
            localStorage.removeItem(lsKey);
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        }
        // Force is false here because we only want to generate the specific cleared field
        await generateIdentityDetails(null, undefined, undefined, false);
    };

    window.maybeGenerateDetails = window.generateIdentityDetails;

    window.buildRolePrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let p = root.prompts.role;
        let parts = [p.instruction.evaluateItem];
        let lenInstr = getLengthInstruction(lengthVal);
        if (lenInstr) parts.push(lenInstr);
        parts.push(p.format.evaluateItem);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    window.buildAppearancePrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let p = root.prompts.appearance;
        let parts = [p.instruction.evaluateItem];
        let lenInstr = getLengthInstruction(lengthVal);
        if (lenInstr) parts.push(lenInstr);
        parts.push(p.format.evaluateItem);
        parts.push(p.notes.evaluateItem);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    window.buildBackgroundPrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let p = root.prompts.background;
        let parts = [p.instruction.evaluateItem];
        let lenInstr = getLengthInstruction(lengthVal);
        if (lenInstr) parts.push(lenInstr);
        parts.push(p.format.evaluateItem);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    window.buildPersonalityPrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let p = root.prompts.personality;
        let parts = [p.instruction.evaluateItem];
        let lenInstr = getLengthInstruction(lengthVal);
        if (lenInstr) parts.push(lenInstr);
        parts.push(p.format.evaluateItem);
        parts.push("CRITICAL: The dialogue, inner thoughts, and narrative voice MUST strongly reflect the selected Tone. Heavily adapt the character's vocabulary, attitude, and speaking style to fit this tone.");
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    window.buildBeliefsPrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let p = root.prompts.beliefs;
        let parts = [p.instruction.evaluateItem];
        let lenInstr = getLengthInstruction(lengthVal);
        if (lenInstr) parts.push(lenInstr);
        parts.push(p.format.evaluateItem);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    window.buildPreferencesPrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let p = root.prompts.preferences;
        let parts = [p.instruction.evaluateItem];
        let lenInstr = getLengthInstruction(lengthVal);
        if (lenInstr) parts.push(lenInstr);
        parts.push(p.format.evaluateItem);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    window.buildLorePrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let p = root.prompts.lore;
        let parts = [p.instruction.evaluateItem];
        let lenInstr = getLengthInstruction(lengthVal);
        if (lenInstr) parts.push(lenInstr);
        parts.push(p.format.evaluateItem);
        parts.push(p.notes.evaluateItem);
        parts.push(p.footer.evaluateItem);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    window.splitOldIntroText = function (text) {
        if (!text) return { scenario: "", start: "" };
        
        let parts = text.split(/(?:Scene Context:|Scenario Context:|### Scene Context|### Scenario Context|Scene Context\s*:\s*|Scenario Context\s*:\s*)/i);
        let mainText = text;
        if (parts.length > 1) {
            mainText = parts[1];
        }
        
        let splitPattern = /(?:Intro Script:|Roleplay Intro Script:|Roleplay Intro:|Intro:|Start:|Dialogue & Narration:|### Intro Script|# Roleplay Intro Script|=== ROLEPLAY_STARTER_SEPARATOR ===)/i;
        let mainParts = mainText.split(splitPattern);
        
        let scenarioPart = "";
        let startPart = "";
        if (mainParts.length > 1) {
            scenarioPart = mainParts[0].trim();
            startPart = mainParts[1].trim();
        } else {
            startPart = text.trim();
        }
        
        scenarioPart = scenarioPart.replace(/^(?:Scene Context|Scenario Context|Context|Scenario)\s*:\s*/i, "").trim();
        startPart = startPart.replace(/^(?:Intro Script|Roleplay Intro Script|Intro|Start|Dialogue & Narration)\s*:\s*/i, "").trim();
        
        return {
            scenario: scenarioPart,
            start: startPart
        };
    };

    window.buildRoleplayExamplePrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let p = root.prompts.roleplay;
        let perspective = getSelectedPerspective();
        
        let perspectiveRule = perspective === "First_Person"
            ? "IMPORTANT NARRATION PERSPECTIVE: All narration and actions inside the roleplay examples must be written in the FIRST-PERSON perspective from the character's point of view (using 'I', 'me', 'my' for the character's actions and thoughts). Do NOT write narration in the third person."
            : "IMPORTANT NARRATION PERSPECTIVE: All narration must be written in the THIRD-PERSON perspective (using the character's name or 'he/she/they' for narration/actions).";

        let robustFormatRule = `FORMATTING RULES:
You MUST strictly follow this structured format for the roleplay examples:
START_OF_DIALOG
user: [user's dialogue here]
<character-name>: [character's dialogue here] *[actions, imperfections, context, etc. You can add imperfections between dialogues in italic or asterisks]*
user: [user's dialogue here]
<character-name>: [character's dialogue here] *[actions, imperfections, context, etc.]*
... up to 10 back to back interactions
END_OF_DIALOG
Note: Only add multiple characters if there are any. Write their dialogue in the same way.`;

        let parts = [p.instruction.evaluateItem];
        let lenInstr = getLengthInstruction(lengthVal);
        if (lenInstr) parts.push(lenInstr);
        parts.push(p.format.evaluateItem);
        parts.push("CRITICAL: The dialogue, inner thoughts, and narrative voice MUST strongly reflect the selected Tone. Heavily adapt the character's vocabulary, attitude, and speaking style to fit this tone.");
        parts.push(robustFormatRule);
        parts.push(perspectiveRule);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    window.buildIntroScenarioPrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let lengthInstruction = getLengthInstruction(lengthVal);
        let perspective = getSelectedPerspective();
        
        let ignorePerspective = true;
        let ignorePerspectiveToggle = document.getElementById("ignorePerspectiveToggle");
        if (ignorePerspectiveToggle) {
            ignorePerspective = ignorePerspectiveToggle.checked;
        }
            
        let parts = [root.prompts.introScenario.instruction.evaluateItem];
        parts.push(root.prompts.introScenario.format.evaluateItem);
        
        parts.push("CRITICAL: The narrative voice MUST strongly reflect the selected Tone.");
        parts.push("IMPORTANT PERSPECTIVE RULE: When referring to the user in the narrative or actions, you MUST use second-person perspective ('you', 'your', 'yours'). Do not refer to the user as 'the user' or '{{user}}' in the narration; address them directly as 'you'.");
        
        if (!ignorePerspective) {
            let perspectiveRule = perspective === "First_Person"
                ? "PERSPECTIVE: Write the scenario context description from the character's first-person perspective, reflecting their thoughts and observations of the environment (using 'I', 'me', 'my')."
                : "PERSPECTIVE: Write the scenario context description from a third-person narrative perspective.";
            parts.push(perspectiveRule);
        }
        
        if (lengthInstruction) parts.push(lengthInstruction);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    window.buildIntroStartPrompt = function (context, notes, lengthVal, overview, worldLore) {
        let settingAndTone = getSettingAndToneContext();
        let referencedCtx = getReferencedCharactersContext();
        let lengthInstruction = getLengthInstruction(lengthVal);
        let perspective = getSelectedPerspective();
        
        let perspectiveRule = perspective === "First_Person"
            ? "IMPORTANT NARRATION PERSPECTIVE: The narration and actions must be written in the FIRST-PERSON perspective from the character's point of view (using 'I', 'me', 'my' for the character's actions and thoughts). Do NOT write narration in the third person."
            : "IMPORTANT NARRATION PERSPECTIVE: The narration must be written in the THIRD-PERSON perspective (using the character's name or 'he/she/they' for narration/actions).";
            
        let scenarioContext = getSectionText("introScenario");
        
        let parts = [root.prompts.introStart.instruction.evaluateItem];
        parts.push(root.prompts.introStart.format.evaluateItem);
        parts.push(perspectiveRule);
        
        parts.push("CRITICAL: The dialogue, inner thoughts, and narrative voice MUST strongly reflect the selected Tone. Heavily adapt the character's vocabulary, attitude, and speaking style to fit this tone.");
        parts.push("IMPORTANT PERSPECTIVE RULE: When referring to the user in the narrative or actions, you MUST use second-person perspective ('you', 'your', 'yours'). Do not refer to the user as 'the user' or '{{user}}' in the narration; address them directly as 'you'.");
        
        if (scenarioContext) {
            parts.push("SCENARIO CONTEXT (The scene takes place in this context):\n---\n" + scenarioContext + "\n---");
        }
        
        if (lengthInstruction) parts.push(lengthInstruction);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        if (referencedCtx) parts.push("\n" + referencedCtx);
        if (settingAndTone) parts.push("\n" + settingAndTone);
        parts.push(getBannedFormattingRule());
        return parts.join("\n\n");
    };

    // ─── MAIN GENERATION ──────────────────────────────────────────────
    window.generateSection = async function (section) {
        if (!window.sectionStreams) window.sectionStreams = {};
        if (window.sectionStreams[section]) window.sectionStreams[section].stop();

        setSectionGenerating(section, true);
        setSectionStatus(section, "⏳ Fleshing out character identity...");
        setGenerationStatus("Fleshing out character identity...");

        let notes = "";
        if (section === "introScenario" || section === "introStart") {
            notes = (document.getElementById("introNotesEl") || {}).value || "";
        } else {
            notes = (document.getElementById(section + "NotesEl") || {}).value || "";
        }
        let lengthVal = getEffectiveLengthForSection(section);
        let overview = (document.getElementById("overviewNotesEl") || {}).value || "";
        let worldLore = (document.getElementById("worldLoreEl") || {}).value || "";
        let allSectionNotes = ["role", "personality", "beliefs", "preferences", "appearance", "background"]
            .map(s => (document.getElementById(s + "NotesEl") || {}).value || "")
            .filter(Boolean)
            .join("\n");

        let detailsSuccess = await maybeGenerateDetails(allSectionNotes, overview, worldLore);
        if (!detailsSuccess) {
            setSectionGenerating(section, false);
            setSectionStatus(section, "⛔ Stopped.");
            setGenerationStatus("");
            return false;
        }

        let context = buildCharacterContext(section);
        let instruction;
        if (section === "role") instruction = buildRolePrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "personality") instruction = buildPersonalityPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "beliefs") instruction = buildBeliefsPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "preferences") instruction = buildPreferencesPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "appearance") instruction = buildAppearancePrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "background") instruction = buildBackgroundPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "lore") instruction = buildLorePrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "roleplay") instruction = buildRoleplayExamplePrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "introScenario") instruction = buildIntroScenarioPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "introStart") instruction = buildIntroStartPrompt(context, notes, lengthVal, overview, worldLore);

        let premiumLabel = {
            appearance: "Designing physical appearance",
            role: "Weaving narrative role",
            personality: "Developing personality traits",
            beliefs: "Structuring beliefs & morals",
            preferences: "Defining character preferences",
            background: "Forging backstory & origins",
            lore: "Crafting world lore entries",
            roleplay: "Simulating roleplay examples",
            introScenario: "Structuring scenario context",
            introStart: "Composing roleplay start"
        }[section] || ("Generating " + section);
        setSectionStatus(section, "⏳ " + premiumLabel + "...");
        setGenerationStatus(premiumLabel + "...");

        let outputEl = document.getElementById(section + "OutputEl");
        outputEl.style.display = "block";
        outputEl.innerHTML = "";

        if (section === "lore") {
            clearLoreFields();
            let copyBtn = document.getElementById("loreCopyBtnEl");
            if (copyBtn) copyBtn.style.display = "none";
        }

        let typewriter = new TypewriterStreamer(outputEl, { speed: 12 });
        window.sectionTypewriters = window.sectionTypewriters || {};
        if (window.sectionTypewriters[section]) {
            window.sectionTypewriters[section].destroy();
        }
        window.sectionTypewriters[section] = typewriter;

        let stream = ai({
            instruction,
            onChunk: (data) => {
                typewriter.appendTargetText(data.fullTextSoFar);
            }
        });
        window.sectionStreams[section] = stream;

        let result;
        try {
            result = await stream;
        } catch (e) {
            console.warn("Generation failed for " + section + ":", e);
            typewriter.destroy();
            setSectionGenerating(section, false);
            setSectionStatus(section, "❌ Failed.");
            setGenerationStatus("");
            return false;
        }

        if (result.stopReason === "user") {
            typewriter.destroy();
            setSectionGenerating(section, false);
            setSectionStatus(section, "⛔ Stopped.");
            setGenerationStatus("");
            if (section === "lore") {
                try {
                    window.loadLoreToUI(outputEl.innerText);
                    outputEl.style.display = "none";
                    let copyBtn = document.getElementById("loreCopyBtnEl");
                    if (copyBtn) copyBtn.style.display = "inline-block";
                } catch (e) {
                    // Keep raw output visible
                }
            }
            return false;
        }

        typewriter.appendTargetText(result.text);
        await typewriter.completionPromise;

        setSectionGenerating(section, false);
        setSectionStatus(section, "");
        setGenerationStatus("");
        let sanitized = sanitizeOutput(result.text);

        if (section === "lore") {
            window.loadLoreToUI(sanitized);
            outputEl.style.display = "none";
            let copyBtn = document.getElementById("loreCopyBtnEl");
            if (copyBtn) copyBtn.style.display = "inline-block";
        } else {
            outputEl.innerHTML = formatSectionText(sanitized);
            let editBtn = document.getElementById(section + "EditBtnEl");
            if (editBtn) editBtn.style.display = "inline-block";
            let copyBtn = document.getElementById(section + "CopyBtnEl");
            if (copyBtn) copyBtn.style.display = "inline-block";
        }
        updateClearAllBtn();

        if (!window.characterSections) window.characterSections = {};
        window.characterSections[section] = (section === "lore") ? compileLoreFromUI() : sanitized;
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();

        let appearanceText = getSectionText("appearance");
        if (section === "appearance" && appearanceText) {
            await triggerImageGeneration(appearanceText);
        }

        pushGenerationHistory();
        return true;
    };

    window.generateIntro = async function () {
        let btn = document.getElementById("introGenBtnEl");
        let stopBtn = document.getElementById("introStopBtnEl");
        if (btn) btn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";
        window.generateIntroRunning = true;
        
        try {
            if (window.generateIntroRunning) {
                let success = await generateSection("introScenario");
                if (success && window.generateIntroRunning) {
                    let startSuccess = await generateSection("introStart");
                    if (startSuccess && window.generateIntroRunning) {
                        await generateRoleplayImages();
                    }
                }
            }
        } finally {
            window.generateIntroRunning = false;
            if (btn) btn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
        }
    };

    window.stopIntroGeneration = function () {
        window.generateIntroRunning = false;
        stopSection("introScenario");
        stopSection("introStart");
    };

    window.clearIntro = function () {
        clearSection("introScenario");
        clearSection("introStart");
        let introNotesEl = document.getElementById("introNotesEl");
        if (introNotesEl) {
            introNotesEl.value = "";
            localStorage.removeItem("introNotes");
        }
    };

    window.generateAll = async function (bypassOverviewCheck) {
        // Check overview notes  -  if empty, handle it first
        let overviewEl = document.getElementById("overviewNotesEl");
        if (!bypassOverviewCheck && overviewEl && !overviewEl.value.trim()) {
            if (localStorage.skipOverviewConfirm !== 'true') {
                // Show the approval modal
                showOverviewConfirmModal();
                return;
            }
        }

        let btn = document.getElementById("generateAllBtn");
        let stopBtn = document.getElementById("stopAllBtn");
        if (btn) btn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";
        window.generateAllRunning = true;

        try {
            // 1. Generate identity details if they are empty
            let d = getDetailsContext();
            let detailsAllFilled = d.name && d.age && d.gender && d.orientation && d.species && d.ethnicity;
            if (!detailsAllFilled) {
                let success = await generateIdentityDetails();
                if (!success) return;
            }

            if (!window.generateAllRunning) return;

            // 2. Generate overview notes if they are empty
            if (!overviewEl.value.trim()) {
                setGenerationStatus("Conceptualizing masterpiece archetype...");
                let success = await generateOverviewNotes('textarea');
                if (!success) return;
            }

            if (!window.generateAllRunning) return;

            // 3. Generate world lore if empty
            if (!worldLoreEl.value.trim()) {
                let success = await generateWorldLore();
                if (!success) return;
            }

            // 4. Generate other sections sequentially
            for (let section of ["appearance", "role", "personality", "beliefs", "preferences", "background", "lore", "roleplay", "introScenario", "introStart"]) {
                if (!window.generateAllRunning) break;
                let success = await generateSection(section);
                if (!success) break;
            }
        } catch (e) {
            console.error("Error during generateAll:", e);
        } finally {
            window.generateAllRunning = false;
            if (btn) btn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            setGenerationStatus("");
        }
    };

    window.stopAll = function () {
        window.generateAllRunning = false;
        
        // Stop Details and Overview
        stopDetailsGeneration();
        stopOverviewGeneration();
        
        // Stop World Lore
        if (window.sectionStreams && window.sectionStreams["worldLore"]) {
            try { window.sectionStreams["worldLore"].stop(); } catch(e){}
        }
        let wlTypewriter = window.sectionTypewriters && window.sectionTypewriters["worldLore"];
        if (wlTypewriter) wlTypewriter.destroy();
        setSectionGenerating("worldLore", false);
        setSectionStatus("worldLore", "⛔ Stopped.");

        // Stop sections
        ["appearance", "role", "personality", "beliefs", "preferences", "background", "lore", "roleplay", "introScenario", "introStart"].forEach(s => stopSection(s));
        
        let btn = document.getElementById("generateAllBtn");
        let stopBtn = document.getElementById("stopAllBtn");
        if (btn) btn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
        setGenerationStatus("⛔ Stopped.");
    };

    window.stopSection = function (section) {
        let streamObj = window.sectionStreams && window.sectionStreams[section];
        if (streamObj) streamObj.stop();
        let typewriter = window.sectionTypewriters && window.sectionTypewriters[section];
        if (typewriter) typewriter.destroy();
    };

    // ─── GLOBAL LENGTH OVERRIDE ────────────────────────────────────────
    window.getEffectiveLengthForSection = function (section) {
        let globalVal = localStorage.globalLength || 'custom';
        if (globalVal && globalVal !== 'custom') return globalVal;
        let id = (section === "introScenario" || section === "introStart") ? "intro" : section;
        return (document.getElementById(id + "LengthEl") || {}).value || "medium";
    };

    window.setGlobalLength = function (val, silent) {
        localStorage.globalLength = val;
        // Update label
        let label = document.getElementById("globalLengthLabel");
        if (label) {
            let names = { 'super-short': 'Super Short', 'short': 'Short', 'medium': 'Medium', 'long': 'Long', 'super-long': 'Super Long', 'custom': 'Custom' };
            label.textContent = names[val] || 'Custom';
        }
        // Close dropdown
        let menu = document.getElementById("globalLengthDropdownMenu");
        if (menu && !silent) menu.style.display = "none";
        // Update per-section selects UI
        updateGlobalLengthUI(val);
    };

    window.removeWhiteBackground = function(canvas, tolerance = 240) {
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i+1], b = data[i+2];
            // If pixel is near-white, set alpha to 0
            if (r >= tolerance && g >= tolerance && b >= tolerance) {
                data[i+3] = 0;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        return canvas;
    };

    window.generateRoleplayImages = async function() {
        let container = document.getElementById("introImageContainer");
        if (container) container.style.display = "flex";
        
        let d = getDetailsContext();
        let nameTag = document.getElementById("introImageNameTag");
        if (nameTag && d.name) {
            nameTag.textContent = d.name;
            nameTag.style.display = "block";
        } else if (nameTag) {
            nameTag.style.display = "none";
        }
        
        await Promise.all([
            generateRoleplayImageBg(),
            generateRoleplayImageChar()
        ]);
    };

    window.generateRoleplayImageBg = async function() {
        let statusEl = document.getElementById("introImageStatus");
        let bgEl = document.getElementById("introImageBg");
        let promptEl = document.getElementById("introBgPromptEl");
        let btn = document.getElementById("introImageBgGenBtn");
        
        if (btn) btn.disabled = true;
        if (statusEl) { statusEl.style.display = "flex"; statusEl.textContent = "Generating Background..."; }
        
        try {
            let scenario = getSectionText("introScenario") || "A scenic background";
            let artstyle = "semi-realistic manhwa style, painterly rendering, soft shading, Anime cel shading, artstation quality, gorgeous, refined aesthetics, sharp, clean linework, beautiful scenery, highly detailed environment";
            
            let bgDescription = scenario;
            
            // Extract only the background using AI if the text is long enough
            if (scenario && scenario.length > 15 && typeof window.ai !== "undefined") {
                try {
                    if (statusEl) statusEl.textContent = "Analyzing Scene...";
                    let extractPrompt = `Extract ONLY the physical setting, environment, lighting, and atmosphere from the following text into a concise visual description. Do NOT mention any people, characters, actions, or dialogue. Just describe the empty scenery:\\n\\n${scenario}`;
                    let aiResult = await window.ai(extractPrompt);
                    if (aiResult && aiResult.generatedText) {
                        bgDescription = aiResult.generatedText.trim();
                    } else if (aiResult) {
                        bgDescription = aiResult.toString().trim();
                    }
                } catch(e) {
                    console.error("AI scene extraction error:", e);
                }
                if (statusEl) statusEl.textContent = "Generating Background...";
            }
            
            let prompt = sanitizeImagePrompt(`Scenery only, empty background, no characters, empty environment. ${bgDescription}. Artstyle: ${artstyle}.`);
            let negative = "photorealistic, characters, people, person, human, face, flat lighting, overexposed";
            
            if (promptEl) promptEl.value = prompt;
            
            let result = await image({
                prompt: prompt,
                negativePrompt: negative,
                resolution: "768x512"
            });
            
            if (bgEl && result && result.dataUrl) {
                bgEl.style.backgroundImage = `url(${result.dataUrl})`;
            }
        } catch (e) {
            console.error("Error generating bg image:", e);
        } finally {
            if (btn) btn.disabled = false;
            if (statusEl) statusEl.style.display = "none";
        }
    };

    window.generateRoleplayImageChar = async function() {
        let statusEl = document.getElementById("introImageStatus");
        let charCanvas = document.getElementById("introImageCharCanvas");
        let promptEl = document.getElementById("introCharPromptEl");
        let btn = document.getElementById("introImageCharGenBtn");
        
        if (btn) btn.disabled = true;
        if (statusEl) { statusEl.style.display = "flex"; statusEl.textContent = "Generating Character Sprite..."; }
        
        try {
            let appearanceText = getSectionText("appearance") || "";
            let attireText = getSectionText("attire") || "";
            let itemsText = getSectionText("items") || "";
            
            let artstyle = "mature Korean-style Manhwa Art style, semi-realistic manhwa style, mature/sexy style, Noona-type character design, painterly rendering, soft shading, Anime cel shading, artstation quality, gorgeous, delicate facial features, refined aesthetics, sharp, clean linework";
            
            let prompt = sanitizeImagePrompt(`Create an upper-body sprite image, pure solid white background. 1:1 ratio. Semi-realistic face, cel-shaded. Appearance: ${appearanceText}. Attire: ${attireText}. Items: ${itemsText}. Artstyle: ${artstyle}. composition: upper-body portrait, centered composition, waist-up framing, slight head tilt, looking at the camera, upper body from the waist up; ignore details below the waist for character appearance data.`);
            let negative = "photorealistic, flat lighting, overexposed, symmetrical face, expressionless, text, watermark";
            
            if (promptEl) promptEl.value = prompt;
            
            let result = await image({
                prompt: prompt,
                negativePrompt: negative,
                resolution: "512x512"
            });
            
            if (charCanvas && result && result.canvas) {
                charCanvas.width = result.canvas.width;
                charCanvas.height = result.canvas.height;
                let ctx = charCanvas.getContext("2d");
                ctx.drawImage(result.canvas, 0, 0);
                removeWhiteBackground(charCanvas, 240);
            }
        } catch (e) {
            console.error("Error generating char image:", e);
        } finally {
            if (btn) btn.disabled = false;
            if (statusEl) statusEl.style.display = "none";
        }
    };

    window.updateGlobalLengthUI = function (val) {
        let isCustom = !val || val === 'custom';
        let selects = document.querySelectorAll(".length-select");
        selects.forEach(sel => {
            if (isCustom) {
                sel.style.opacity = "1";
                sel.style.pointerEvents = "auto";
                sel.title = "";
            } else {
                sel.style.opacity = "0.35";
                sel.style.pointerEvents = "none";
                sel.title = "Overridden by Global Length: " + val;
            }
        });
    };

    // ─── OVERVIEW NOTES GENERATION ─────────────────────────────────────
    window.generateOverviewNotes = async function (target) {
        // target: 'textarea' (direct write) or 'modal' (write to modal display div)
        let settingValue = settingEl ? settingEl.value : "";
        let toneValues = getSelectedTones();
        let toneStr = toneValues.length > 0 && toneValues[0] !== "Any" ? toneValues.join(", ") : "any";
        let worldLoreVal = (document.getElementById("worldLoreEl") || {}).value || "";

        let d = getDetailsContext();
        let allFilled = d.name && d.age && d.gender && d.orientation && d.species && d.ethnicity;

        let genBtn = document.getElementById("overviewGenBtnEl");
        let stopBtn = document.getElementById("overviewStopBtnEl");
        let statusEl = (target === 'textarea') 
            ? document.getElementById("overviewStatusEl")
            : document.getElementById("overviewModalStatusEl");
        let textarea = document.getElementById("overviewNotesEl");
        let contentEl = document.getElementById("overviewModalContentEl");

        if (target === 'textarea') {
            if (genBtn) genBtn.disabled = true;
            if (stopBtn) stopBtn.style.display = "inline-block";
            if (textarea) textarea.value = "";
        } else if (target === 'modal') {
            let regenBtn = document.getElementById("overviewModalRegenBtn");
            let approveBtn = document.getElementById("overviewModalApproveBtn");
            if (contentEl) contentEl.textContent = "";
            if (regenBtn) regenBtn.disabled = true;
            if (approveBtn) approveBtn.disabled = true;
        }

        let streamName = (target === 'textarea') ? "overviewStream" : "overviewModalStream";

        // Helper to cleanup UI state after generation or stop
        function cleanupOverviewUI() {
            if (target === 'textarea') {
                if (genBtn) genBtn.disabled = false;
                if (stopBtn) stopBtn.style.display = "none";
            } else if (target === 'modal') {
                let regenBtn = document.getElementById("overviewModalRegenBtn");
                let approveBtn = document.getElementById("overviewModalApproveBtn");
                if (regenBtn) regenBtn.disabled = false;
                if (approveBtn) approveBtn.disabled = false;
            }
            if (statusEl) statusEl.textContent = "";
            setGenerationStatus("");
        }

        if (!allFilled) {
            let success = await generateIdentityDetails();
            if (!success) {
                cleanupOverviewUI();
                return false;
            }
        }

        // Re-read details after generating them (or if they were already pre-filled)
        d = getDetailsContext();
        let detailsParts = [];
        if (d.name) detailsParts.push(`Name: ${d.name}`);
        if (d.age) detailsParts.push(`Age: ${d.age}`);
        if (d.gender) detailsParts.push(`Gender: ${d.gender}`);
        if (d.orientation) detailsParts.push(`Orientation: ${d.orientation}`);
        if (d.species) detailsParts.push(`Species/Race: ${d.species}`);
        if (d.ethnicity) detailsParts.push(`Ethnicity: ${d.ethnicity}`);
        let detailsStr = `Character Details (you MUST strictly base the concept on these fields):\n${detailsParts.join("\n")}`;

        let instruction = `You are a master character concept designer. Generate exactly one single creative, masterpiece, original, non-cliche character concept. Do not generate multiple characters or options.

Setting: ${settingValue || "unspecified"}
Tone: ${toneStr}
${worldLoreVal ? "World Lore: " + worldLoreVal : ""}
${detailsStr ? "\n" + detailsStr : ""}

Requirements:
- Focus on creating a high-quality character concept seed that will serve as the foundation for this character. It must be highly creative and feel like a masterpiece.
- Strictly base the concept sections on the Character Details provided. Do not contradict, ignore, or omit them.
- Format the output strictly under these plain text headings (do NOT bold them):
Appearance: [A brief, masterpiece concept of their appearance and design, incorporating their Age, Gender, Species, and Ethnicity if provided]
Personality: [A brief, masterpiece concept of their personality, core traits, and intriguing quirks, aligning with their details]
Context: [A brief, masterpiece concept of their current situation, role, and relationship context with the {{user}} in terms of roleplaying (how they view the {{user}}, their dynamic, etc.)]
Backstory: [A brief, masterpiece concept of their backstory or origin that shaped who they are today, incorporating their details naturally]
- Do NOT write a long biography or use bullet points within the sections  -  write a brief, cohesive, evocative description for each section.
- Keep it focused and descriptive.

${getBannedFormattingRule()}`;

        if (statusEl) {
            statusEl.textContent = (target === 'textarea') 
                ? "⏳ Conceptualizing masterpiece archetype..." 
                : "⏳ Conceptualizing archetype...";
        }
        setGenerationStatus("Conceptualizing masterpiece archetype...");

        window[streamName] = ai({
            instruction,
            onChunk: (data) => {
                if (target === 'textarea' && textarea) {
                    textarea.value = sanitizeOutput(data.fullTextSoFar);
                    localStorage.overviewNotes = textarea.value;
                } else if (target === 'modal' && contentEl) {
                    contentEl.textContent = sanitizeOutput(data.fullTextSoFar);
                }
            }
        });

        try {
            let result = await window[streamName];
            if (result.stopReason === "user") {
                cleanupOverviewUI();
                return false;
            }
            let finalText = sanitizeOutput(result.text);
            if (target === 'textarea' && textarea) {
                textarea.value = finalText;
                localStorage.overviewNotes = textarea.value;
            } else if (target === 'modal' && contentEl) {
                contentEl.textContent = finalText;
            }
            cleanupOverviewUI();
            return true;
        } catch (e) {
            console.warn("Overview generation stopped:", e);
            cleanupOverviewUI();
            return false;
        }
    };

    window.stopOverviewGeneration = function () {
        if (window.detailsStream) { try { window.detailsStream.stop(); } catch(e){} }
        if (window.overviewStream) { try { window.overviewStream.stop(); } catch(e){} }
        let genBtn = document.getElementById("overviewGenBtnEl");
        let stopBtn = document.getElementById("overviewStopBtnEl");
        let statusEl = document.getElementById("overviewStatusEl");
        if (genBtn) genBtn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
        if (statusEl) statusEl.textContent = "";
        setGenerationStatus("");
    };

    // ─── OVERVIEW CONFIRM MODAL ─────────────────────────────────────────
    window.showOverviewConfirmModal = function () {
        let modal = document.getElementById("overviewConfirmModalEl");
        if (!modal) return;
        modal.style.display = "flex";
        // Sync the dont-show checkbox
        let dontShow = document.getElementById("overviewModalDontShowEl");
        if (dontShow) dontShow.checked = localStorage.skipOverviewConfirm === 'true';
        // Start generating in modal
        generateOverviewNotes('modal');
    };

    window.closeOverviewConfirmModal = function () {
        let modal = document.getElementById("overviewConfirmModalEl");
        if (modal) modal.style.display = "none";
        if (window.detailsStream) { try { window.detailsStream.stop(); } catch(e){} }
        if (window.overviewModalStream) { try { window.overviewModalStream.stop(); } catch(e){} }
    };

    window.regenOverviewModal = function () {
        if (window.overviewModalStream) { try { window.overviewModalStream.stop(); } catch(e){} }
        generateOverviewNotes('modal');
    };

    window.approveOverviewAndGenerateAll = function () {
        let contentEl = document.getElementById("overviewModalContentEl");
        let textarea = document.getElementById("overviewNotesEl");
        if (contentEl && textarea) {
            let text = contentEl.textContent.trim();
            if (text) {
                textarea.value = text;
                localStorage.overviewNotes = text;
            }
        }
        closeOverviewConfirmModal();
        generateAll(true); // bypass the overview check
    };

    // ─── IMAGE GENERATION ─────────────────────────────────────────────
    window.getCaptionPromptInstruction = function (appearanceText, settingValue, toneValues) {
        let toneStr = toneValues.length > 0 && toneValues[0] !== "Any" ? toneValues.join(", ") : "unspecified";
        let parts = [];
        parts.push("You are generating an image prompt for an AI image generator. Below is a character's physical appearance description. Extract the purely VISUAL elements and format them as a comma-separated list of descriptive keyphrases.");
        parts.push("Rules:\n1. Only include things that can be seen in an image. Do NOT include personality traits, backstory, abstract concepts, or emotions.\n2. DO include specific visual details: hair colour and style, eye colour, skin tone, clothing style and colour, notable accessories, body type, distinguishing features, apparent age range, gender presentation, race/species.\n3. Include ONE concise colour palette phrase at the end if apparent.\n4. Let the setting and tone subtly influence HOW you describe visual elements.\n5. Keep each keyphrase short and concrete.\n6. Order keyphrases from most important to least.\n7. Avoid redundant or low-impact details.");
        parts.push("Setting: " + (settingValue || "unspecified") + "\nTone: " + toneStr);
        parts.push("Physical appearance description:\n---\n" + appearanceText + "\n---");
        parts.push("Respond with ONLY the comma-separated keyphrases  -  no preamble, no explanation.");
        return parts.join("\n\n");
    };

    window.buildNegativePrompt = function () {
        let tones = getSelectedTones();
        let settingValue = settingEl.value;
        let negatives = ["worst quality, low quality, blurry, jpeg artifacts, watermark, signature, text, logo, cropped, out of frame, duplicate, deformed, disfigured, bad anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, ugly, poorly drawn face, cloned face, gross proportions"];
        
        if (tones.includes("Dark_Gritty") || tones.includes("Horror")) {
            negatives.push("bright colors, cheerful, cute, cartoon, anime, soft lighting, pastel");
        }
        if (tones.includes("Light_hearted_Comedic") || tones.includes("Whimsical")) {
            negatives.push("dark, gritty, grimdark, horror, violence, disturbing");
        }
        if (tones.includes("Erotic")) {
            negatives.push("childlike, cartoon, cute, non-suggestive");
        }
        if (tones.includes("Epic")) {
            negatives.push("mundane, casual, low stakes, soft lighting, flat composition");
        }
        if (tones.includes("Mysterious")) {
            negatives.push("bright, cheerful, overexposed, flat lighting");
        }
        if (settingValue === "Sci_Fi" || settingValue === "Cyberpunk") {
            negatives.push("medieval, fantasy, nature, organic, rustic");
        }
        if (settingValue === "Real_World_Modern" || settingValue === "Historical") {
            negatives.push("fantasy, magic, unrealistic, anime");
        }
        
        let allTags = negatives.join(", ").split(",").map(t => t.trim()).filter(Boolean);
        return [...new Set(allTags)].join(", ");
    };

    window.generateVisualStyleOptionsHtml = function () {
        function styleScore(style) {
            let fantasy = style["meta:tags"]?.fantasyPortrait || 0;
            let anime = style["meta:tags"]?.basicAnime || 0;
            let anthro = style["meta:tags"]?.furryOil || 0;
            let digital = style["meta:tags"]?.digitalPainting || 0;
            let cinematic = style["meta:tags"]?.cinematic || 0;
            return anime * 1.0 + cinematic * 0.9 + anthro * 0.8 + fantasy * 0.7 + digital * 0.7;
        }
        return root.visualStyles.selectAll.sort((a, b) => styleScore(b) - styleScore(a)).map(s => `<option>${s.getName}</option>`).join("");
    };

    window.addStyleToPrompt = function (prompt) {
        let styleName = (typeof visualStyleEl !== 'undefined' && visualStyleEl) ? visualStyleEl.value : "";
        if (!root.visualStyles || !styleName || !root.visualStyles[styleName]) {
            return prompt;
        }
        let originalWindowInput = window.input;
        window.input = { description: prompt };
        let result = root.visualStyles[styleName].prompt.evaluateItem;
        window.input = originalWindowInput;
        return result;
    };

    window.addStyleToNegative = function (negative) {
        let styleName = (typeof visualStyleEl !== 'undefined' && visualStyleEl) ? visualStyleEl.value : "";
        if (!root.visualStyles || !styleName || !root.visualStyles[styleName]) {
            return negative;
        }
        let originalWindowInput = window.input;
        window.input = { negative };
        let result = root.visualStyles[styleName].negative.evaluateItem;
        window.input = originalWindowInput;
        return result;
    };

    window.pickBestVisualStyle = function () {
        let setting = settingEl.value;
        let tones = getSelectedTones();
        let weights = {
            photo: 0, casualPhoto: 0, render: 0,
            painting: 0, oilPainting: 0, digitalPainting: 0, paintedAnime: 0,
            anime: 0, basicAnime: 0, drawnAnime: 0, cuteAnime: 0, ghibli: 0, manga: 0, waifu: 0,
            illustration: 0, drawing: 0, sketch: 0, cartoon: 0, basicCartoon: 0, comic: 0,
            fantasy: 0, fantasyPortrait: 0, furry: 0, furryOil: 0,
            vintage: 0, pixelArt: 0, japanese: 0, disney: 0,
        };
        let toneBoosts = {
            "Grounded": { photo: 60, casualPhoto: 40, oilPainting: 20 },
            "Thrilling_Action": { photo: 40, digitalPainting: 30, render: 40, painting: 20 },
            "Dark_Gritty": { oilPainting: 50, painting: 30, manga: 30, sketch: 20, vintage: 20 },
            "Light_hearted_Comedic": { basicAnime: 50, anime: 40, cartoon: 60, basicCartoon: 70, illustration: 40, ghibli: 30 },
            "Mysterious": { oilPainting: 40, painting: 30, vintage: 30, sketch: 20 },
            "Romantic": { painting: 40, paintedAnime: 40, illustration: 30 },
            "Erotic": { photo: 50, waifu: 40 },
            "Tragic": { oilPainting: 50, painting: 40, manga: 40, sketch: 30 },
            "Whimsical": { fantasyPortrait: 50, fantasy: 40, painting: 40, illustration: 60, ghibli: 50, cartoon: 40, disney: 40 },
            "Epic": { fantasyPortrait: 60, fantasy: 50, digitalPainting: 40, oilPainting: 30, painting: 30 },
            "Affectionate": { painting: 40, anime: 30, illustration: 40, cuteAnime: 40, ghibli: 30 },
            "Flirtatious": { anime: 30, waifu: 50, paintedAnime: 30 },
            "Sensual": { photo: 40, waifu: 60, paintedAnime: 30 },
            "Explicit": { photo: 60, waifu: 80 },
        };
        let settingBoosts = {
            "Fantasy": { fantasyPortrait: 80, fantasy: 80, painting: 40, digitalPainting: 40, illustration: 30 },
            "High_Fantasy": { fantasyPortrait: 90, fantasy: 90, painting: 50, illustration: 40 },
            "Dark_Fantasy": { fantasyPortrait: 70, fantasy: 60, painting: 60, oilPainting: 50 },
            "Sci_Fi": { photo: 50, digitalPainting: 40, render: 60 },
            "Cyberpunk": { photo: 40, digitalPainting: 50, render: 50 },
            "Space_Opera": { fantasyPortrait: 40, fantasy: 50, digitalPainting: 50, render: 40 },
            "Real_World_Modern": { photo: 80, casualPhoto: 60 },
            "Real_World_Furry": { furryOil: 100, furry: 100 },
            "Real_World_Fantasy": { fantasyPortrait: 60, photo: 30, painting: 30 },
            "Historical": { oilPainting: 80, painting: 60, vintage: 50, sketch: 30 },
            "Post_Apocalyptic": { photo: 50, painting: 30, digitalPainting: 30, render: 30 },
            "Zombie_apocalypse": { photo: 50, painting: 30, digitalPainting: 30, render: 30 },
            "Alien_apocalypse": { photo: 40, digitalPainting: 40, render: 50, painting: 30 },
            "Horror": { oilPainting: 40, painting: 40, vintage: 30, sketch: 30 },
            "Mythology": { fantasyPortrait: 70, fantasy: 70, oilPainting: 50, painting: 60, japanese: 30 },
            "Solarpunk": { digitalPainting: 60, painting: 50, fantasy: 40, illustration: 50 },
            "Urban_Fantasy": { fantasyPortrait: 50, photo: 40, digitalPainting: 30 },
            "Steampunk": { oilPainting: 60, painting: 50, vintage: 60, comic: 30 },
            "Dieselpunk": { vintage: 70, oilPainting: 40, comic: 50 },
            "Gothic": { oilPainting: 80, painting: 60, vintage: 40 },
            "Fairy_Tale": { fantasyPortrait: 70, fantasy: 60, painting: 50, illustration: 50, disney: 40 },
            "Wuxia": { anime: 70, basicAnime: 60, painting: 40, japanese: 50, manga: 40 },
            "Isekai": { anime: 80, basicAnime: 80, fantasyPortrait: 40, manga: 50 },
            "Weird_West": { oilPainting: 50, vintage: 50, comic: 30, photo: 30 },
            "Hard_Sci_Fi": { photo: 70, render: 60, digitalPainting: 30 },
            "Dreamlike": { painting: 60, digitalPainting: 50, anime: 40, illustration: 50, ghibli: 40 },
            "Satirical": { comic: 60, cartoon: 50, basicCartoon: 40 },
        };
        let sb = settingBoosts[setting] || {};
        for (let tag in sb) if (weights[tag] !== undefined) weights[tag] += sb[tag];
        for (let tone of tones) {
            let tb = toneBoosts[tone] || {};
            for (let tag in tb) if (weights[tag] !== undefined) weights[tag] += tb[tag];
        }
        let allStyles = root.visualStyles.selectAll;
        let best = null; let bestScore = -1;
        for (let style of allStyles) {
            let tags = style["meta:tags"] || {};
            let score = 0;
            for (let tag in weights) {
                if (tags[tag]) score += (tags[tag] / 100) * weights[tag];
            }
            if (score > bestScore) { bestScore = score; best = style.getName; }
        }
        return best || "Fantasy Portrait";
    };

    window.triggerImageGeneration = async function (appearanceText) {
        imagesAreaEl.style.display = "block";
        regenImagesBtn.disabled = true;
        regenImagePromptBtn.disabled = true;
        let stopBtn = document.getElementById("stopImageGenBtn");
        if (stopBtn) stopBtn.style.display = "inline-flex";

        let settingValue = settingEl.value !== "Any" ? settingEl.value : "";
        let toneValues = getSelectedTones();

        setGenerationStatus("🎨 Generating image prompt...");

        let captionObj;
        let captionPromptObj = {
            instruction: getCaptionPromptInstruction(appearanceText, settingValue, toneValues),
            onChunk: (data) => {
                if (data.fullTextSoFar.length > 500) {
                    let terms = data.fullTextSoFar.split(", ");
                    let uniqueTerms = [...new Set(terms)];
                    if (terms.length > 2 * uniqueTerms.length) captionObj.stop();
                }
            },
        };

        captionObj = ai(captionPromptObj);
        window.lastImageCaptionPromptStreamObj = captionObj;
        window.activeImageCaptionStream = captionObj;
        imagePromptEl.innerHTML = "<b>Generating image prompt...</b> " + captionObj.loadingIndicatorHtml;

        let captionResult = await captionObj;
        window.activeImageCaptionStream = null;
        if (captionResult.stopReason === "user") {
            setGenerationStatus("");
            if (stopBtn) stopBtn.style.display = "none";
            regenImagesBtn.disabled = false;
            regenImagePromptBtn.disabled = false;
            return;
        }

        let visualKeyphrasesText = captionResult.text.replace(/\n+/g, " ");
        let bestStyle = pickBestVisualStyle();
        if (!window.overwrittenStylePrompt) {
            visualStyleEl.value = bestStyle;
            localStorage.visualStyle = bestStyle;
        }
        updateStyleOverridePlaceholder();

        if (!window.lastCharacterData) window.lastCharacterData = {};
        window.lastCharacterData.visualKeyphrasesText = visualKeyphrasesText;
        window.lastCharacterData.appearanceText = appearanceText;
        window.lastCharacterData.visualStyleName = visualStyleEl.value;

        regenImagesBtn.disabled = false;
        regenImagePromptBtn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
        generateImages();
        setGenerationStatus("");
    };

    window.generateImages = function () {
        if (!window.lastCharacterData || !window.lastCharacterData.visualKeyphrasesText) return;
        let { visualKeyphrasesText } = window.lastCharacterData;
        let count = parseInt(imageCountEl.value) || 4;
        let basePrompt = window.overwrittenVisualKeyphrasesText || visualKeyphrasesText;
        let imageHtml = "";
        for (let i = 0; i < count; i++) {
            let styleOverride = window.overwrittenStylePrompt || "";
            let promptData = {
                prompt: styleOverride ? styleOverride + ", " + basePrompt : addStyleToPrompt(basePrompt),
                negativePrompt: addStyleToNegative(""),
                resolution: "512x768",
                style: "margin:0",
            };
            let wrapper = '<div class="image-card-wrapper">';
            wrapper += image(promptData).evaluateItem;
            wrapper += '<div class="image-card-actions">';
            wrapper += '<button class="image-card-btn primary-btn chooseAvatarBtn" onclick="chooseAsProfileImage(this)"><i class="bi bi-person-bounding-box"></i> Use as Profile</button>';
            
            wrapper += '</div></div>';
            imageHtml += wrapper;
        }
        let promptHtml = '<div style="display:flex; flex-direction:column; gap:0.5rem; text-align:left; width:100%; box-sizing:border-box;">';
        promptHtml += '<div><b style="font-size:80%; display:inline-flex; align-items:center; gap:0.3rem;"><i class="bi bi-pencil-fill" style="color:var(--accent-color);"></i> Image Prompt <span style="opacity:0.6;">(editable)</span>:</b>';
        promptHtml += '<textarea oninput="window.overwrittenVisualKeyphrasesText=this.value; if(window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();" class="image-tools-textarea" style="min-height:5rem; margin-top:0.25rem;">' + (window.overwrittenVisualKeyphrasesText || visualKeyphrasesText) + '</textarea></div></div>';
        imagePromptEl.innerHTML = promptHtml;
        imagesEl.innerHTML = imageHtml;
        updateStyleOverridePlaceholder();
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.stopImageGeneration = function () {
        // Stop the active caption stream if still running
        if (window.activeImageCaptionStream) {
            try { window.activeImageCaptionStream.stop(); } catch(e) {}
            window.activeImageCaptionStream = null;
        }
        if (window.lastImageCaptionPromptStreamObj) {
            try { window.lastImageCaptionPromptStreamObj.stop(); } catch(e) {}
        }
        // Re-enable buttons
        let stopBtn = document.getElementById("stopImageGenBtn");
        if (stopBtn) stopBtn.style.display = "none";
        let regenBtn = document.getElementById("regenImagesBtn");
        if (regenBtn) regenBtn.disabled = false;
        let promptBtn = document.getElementById("regenImagePromptBtn");
        if (promptBtn) promptBtn.disabled = false;
        // Clear the images area to indicate generation was cancelled
        let imagesContainer = document.getElementById("imagesEl");
        if (imagesContainer && imagesContainer.innerHTML === "") {
            imagesContainer.innerHTML = '<div style="padding:1rem; text-align:center; opacity:0.5; font-size:85%;">⛔ Image generation stopped.</div>';
        }
        setGenerationStatus("");
    };

    window.chooseAsProfileImage = function (pluginDataOrButton, buttonEl) {
        let button = buttonEl || (pluginDataOrButton instanceof HTMLElement ? pluginDataOrButton : null);
        let data = buttonEl ? pluginDataOrButton : (pluginDataOrButton instanceof HTMLElement ? null : pluginDataOrButton);
        
        let url = data?.dataUrl || "";
        if (!url && button) {
            let wrapper = button.closest('.image-card-wrapper') || button.closest('.imageWrapper');
            if (wrapper) {
                let iframe = wrapper.querySelector('iframe');
                if (iframe) {
                    try {
                        if (iframe.textToImagePluginOutput) url = iframe.textToImagePluginOutput.dataUrl;
                    } catch (e) {
                        console.warn("Could not access iframe properties (cross-origin):", e);
                    }
                }
                if (!url) {
                    let img = wrapper.querySelector('img');
                    if (img) url = img.src;
                }
            }
        }
        if (!url) {
            alert("Image is still generating. Please wait a moment!");
            return;
        }
        
        window.updateProfileAvatar(url);
        
        // Add visual selection border
        document.querySelectorAll('.image-card-wrapper').forEach(w => {
            w.classList.remove('selected-avatar');
        });
        if (button) {
            let wrapper = button.closest('.image-card-wrapper');
            if (wrapper) {
                wrapper.classList.add('selected-avatar');
            }
            
            // Show visual feedback on the button clicked
            document.querySelectorAll('.chooseAvatarBtn').forEach(btn => {
                btn.innerHTML = '<i class="bi bi-person-bounding-box"></i> Use as Profile';
                btn.style.background = "";
                btn.style.borderColor = "";
                btn.style.color = "";
            });
            button.innerHTML = '<i class="bi bi-check-lg"></i> Chosen!';
            button.style.background = "rgba(16, 185, 129, 0.2)";
            button.style.borderColor = "#10b981";
            button.style.color = "#10b981";
        }
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.updateProfileAvatar = function (url) {
        let avatarEl = document.getElementById("characterAvatarEl");
        let placeholderIcon = document.getElementById("avatarPlaceholderIcon");
        let removeBtn = document.getElementById("clearAvatarBtn");
        
        if (avatarEl) {
            if (url) {
                avatarEl.style.backgroundImage = `url(${url})`;
                avatarEl.innerHTML = ""; // Clear any icon
                if (placeholderIcon) placeholderIcon.style.display = "none";
                if (removeBtn) removeBtn.style.display = "inline-flex";
                window.selectedAvatarUrl = url;
                localStorage.selectedAvatarUrl = url;
            } else {
                avatarEl.style.backgroundImage = "none";
                avatarEl.innerHTML = '<i class="bi bi-person-fill" id="avatarPlaceholderIcon"></i>';
                if (removeBtn) removeBtn.style.display = "none";
                window.selectedAvatarUrl = "";
                localStorage.removeItem("selectedAvatarUrl");
            }
        }
    };

    window.clearAvatar = function (event) {
        if (event) event.stopPropagation();
        window.updateProfileAvatar("");
        document.querySelectorAll('.imageWrapper').forEach(w => {
            w.style.border = "none";
            w.style.boxShadow = "none";
        });
        document.querySelectorAll('.chooseAvatarBtn').forEach(btn => {
            btn.innerHTML = '<i class="bi bi-person-bounding-box"></i> Use as Profile';
            btn.style.background = "";
            btn.style.borderColor = "";
            btn.style.color = "";
        });
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.updateStyleOverridePlaceholder = function () {
        let styleOverrideEl = document.getElementById("styleOverrideEl");
        if (!styleOverrideEl) return;
        if (!window.overwrittenStylePrompt) {
            styleOverrideEl.value = addStyleToPrompt("");
            styleOverrideEl.placeholder = "";
        }
    };

    window.regenerateImagePrompt = async function () {
        if (!window.lastCharacterData) return;
        regenImagePromptBtn.disabled = true;
        setGenerationStatus("✏️ Regenerating image prompt...");
        let appearanceText = window.lastCharacterData.appearanceText || getSectionText("appearance");
        let settingValue = settingEl.value !== "Any" ? settingEl.value : "";
        let toneValues = getSelectedTones();
        let captionObj;
        let captionPromptObj = {
            instruction: getCaptionPromptInstruction(appearanceText, settingValue, toneValues),
            onChunk: (data) => {
                if (data.fullTextSoFar.length > 500) {
                    let terms = data.fullTextSoFar.split(", ");
                    let uniqueTerms = [...new Set(terms)];
                    if (terms.length > 2 * uniqueTerms.length) captionObj.stop();
                }
            },
        };
        captionObj = ai(captionPromptObj);
        let responseData = await captionObj;
        if (responseData.stopReason === "user") { regenImagePromptBtn.disabled = false; setGenerationStatus(""); return; }
        let newKeyphrases = responseData.text.replace(/\n+/g, " ").trim();
        window.overwrittenVisualKeyphrasesText = null;
        window.lastCharacterData.visualKeyphrasesText = newKeyphrases;
        let promptTextarea = imagePromptEl.querySelector("textarea");
        if (promptTextarea) promptTextarea.value = newKeyphrases;
        setGenerationStatus("");
        regenImagePromptBtn.disabled = false;
    };

    // ─── HISTORY ──────────────────────────────────────────────────────
    window.pushGenerationHistory = function () {
        let d = getDetailsContext();
        let entry = {
            name: d.name || "Unknown",
            details: d,
            roleText: getSectionText("role"),
            personalityText: getSectionText("personality"),
            beliefsText: getSectionText("beliefs"),
            preferencesText: getSectionText("preferences"),
            appearanceText: getSectionText("appearance"),
            backgroundText: getSectionText("background"),
            loreText: getSectionText("lore"),
            roleplayText: getSectionText("roleplay"),
            introScenarioText: getSectionText("introScenario"),
            introStartText: getSectionText("introStart"),
            worldLore: worldLoreEl.value,
            visualKeyphrasesText: window.lastCharacterData?.visualKeyphrasesText || "",
            visualStyleName: window.lastCharacterData?.visualStyleName || "",
            selectedAvatarUrl: window.selectedAvatarUrl || "",
            imageDataUrl: window.selectedAvatarUrl || window.lastCharacterData?.imageDataUrl || "",
            timestamp: Date.now(),
        };
        let history = window.generationHistory || [];
        history.unshift(entry);
        if (history.length > 5) history = history.slice(0, 5);
        window.generationHistory = history;
        updateHistoryBtn();
    };

    window.updateHistoryBtn = function () {
        let btn = document.getElementById("historyBtn");
        if (!btn) return;
        let count = (window.generationHistory || []).length;
        btn.style.display = count > 0 ? "inline-block" : "none";
        btn.innerHTML = '<i class="bi bi-clock-history"></i> history (' + count + ')';
    };

    window.showHistoryModal = function () {
        let history = window.generationHistory || [];
        if (history.length === 0) return;
        let itemsHtml = "";
        history.forEach(function (h, i) {
            let time = new Date(h.timestamp).toLocaleTimeString();
            itemsHtml += '<div style="display:flex; align-items:center; gap:0.5rem; padding:0.4rem 0; border-bottom:1px solid var(--panel-border);">';
            itemsHtml += '<span style="flex:1; font-size:88%;">' + h.name + ' <span style="opacity:0.5; font-size:80%;">' + time + '</span></span>';
            itemsHtml += '<button class="btn btn-secondary btn-sm" onclick="restoreFromHistory(' + i + ')" style="font-size:80%;">↩ restore</button>';
            itemsHtml += '</div>';
        });
        let historyHtml = '<div style="min-width:300px;"><div style="font-weight:bold; margin-bottom:0.5rem;">🕓 Generation History</div>';
        historyHtml += '<div style="font-size:80%; opacity:0.6; margin-bottom:0.75rem;">Last 5 generations this session. Restoring will replace current text and images.</div>';
        historyHtml += itemsHtml + '</div>';
        prompt2({
            content: { type: "none", html: historyHtml }
        }, { cancelButtonText: "close", submitButtonText: null, verticallyCenter: true });
    };

    window.restoreFromHistory = function (index) {
        let history = window.generationHistory || [];
        let h = history[index];
        if (!h) return;
        if (h.details) {
            detailNameEl.value = h.details.name || "";
            detailAgeEl.value = h.details.age || "";
            detailGenderEl.value = h.details.gender || "";
            detailOrientationEl.value = h.details.orientation || "";
            detailRaceEl.value = h.details.species || h.details.race || "";
            detailEthnicityEl.value = h.details.ethnicity || "";
            saveDetails();
        }
        if (h.roleText) setSectionOutput("role", formatSectionText(h.roleText));
        if (h.personalityText) setSectionOutput("personality", formatSectionText(h.personalityText));
        if (h.beliefsText) setSectionOutput("beliefs", formatSectionText(h.beliefsText));
        if (h.preferencesText) setSectionOutput("preferences", formatSectionText(h.preferencesText));
        if (h.appearanceText) setSectionOutput("appearance", formatSectionText(h.appearanceText));
        if (h.backgroundText) setSectionOutput("background", formatSectionText(h.backgroundText));
        if (h.loreText) {
            window.loadLoreToUI(h.loreText);
        } else {
            clearSection("lore");
        }
        if (h.roleplayText) setSectionOutput("roleplay", formatSectionText(h.roleplayText));
        if (h.introScenarioText !== undefined || h.introStartText !== undefined) {
            let scen = h.introScenarioText || "";
            let start = h.introStartText || "";
            setSectionOutput("introScenario", formatSectionText(scen));
            window.characterSections["introScenario"] = scen;
            setSectionOutput("introStart", formatSectionText(start));
            window.characterSections["introStart"] = start;
        } else if (h.introText) {
            let split = splitOldIntroText(h.introText);
            setSectionOutput("introScenario", formatSectionText(split.scenario));
            window.characterSections["introScenario"] = split.scenario;
            setSectionOutput("introStart", formatSectionText(split.start));
            window.characterSections["introStart"] = split.start;
        } else {
            clearSection("introScenario");
            clearSection("introStart");
        }
        if (h.worldLore !== undefined) {
            worldLoreEl.value = h.worldLore;
            localStorage.worldLore = h.worldLore;
        }

        let avatarUrl = h.selectedAvatarUrl || h.imageDataUrl || "";
        updateProfileAvatar(avatarUrl);

        if (h.visualKeyphrasesText) {
            window.lastCharacterData = {
                appearanceText: h.appearanceText,
                visualKeyphrasesText: h.visualKeyphrasesText,
                visualStyleName: h.visualStyleName,
                imageDataUrl: h.imageDataUrl,
            };
            window.overwrittenVisualKeyphrasesText = null;
            window.overwrittenStylePrompt = null;
            if (h.visualStyleName) visualStyleEl.value = h.visualStyleName;
            imagesAreaEl.style.display = "block";
            let restorePromptHtml = '<div style="display:flex; flex-direction:column; gap:0.5rem; text-align:left;"><div><b>Image Prompt <span style="opacity:0.6;">(editable)</span>:</b>';
            restorePromptHtml += '<textarea class="section-notes" oninput="window.overwrittenVisualKeyphrasesText=this.value; if(window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();" style="display:block; width:100%; min-height:5rem;">' + h.visualKeyphrasesText + '</textarea></div></div>';
            imagePromptEl.innerHTML = restorePromptHtml;
            updateStyleOverridePlaceholder();
            generateImages();
        }
        window.activeCharacterId = null;
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
    };

    // ─── SAVE / LOAD ──────────────────────────────────────────────────
    window.assembleFullCharacterText = function () {
        let d = getDetailsContext();
        let lines = [];
        if (d.name) lines.push("Name: " + d.name);
        if (d.age) lines.push("Age: " + d.age);
        if (d.gender) lines.push("Gender: " + d.gender);
        if (d.orientation) lines.push("Orientation: " + d.orientation);
        if (d.species) lines.push("Species: " + d.species);
        if (d.ethnicity) lines.push("Ethnicity: " + d.ethnicity);

        let appearance = getSectionText("appearance");
        let role = getSectionText("role");
        let personality = getSectionText("personality");
        let beliefs = getSectionText("beliefs");
        let preferences = getSectionText("preferences");
        let background = getSectionText("background");
        let lore = getSectionText("lore");
        let roleplay = getSectionText("roleplay");
        let introScenario = getSectionText("introScenario");
        let introStart = getSectionText("introStart");

        if (appearance) lines.push("\nAppearance & Attire:\n" + appearance);
        if (role) lines.push("\nRole & Rules:\n" + role);
        if (personality) lines.push("\nPersonality & Behavior:\n" + personality);
        if (beliefs) lines.push("\nBeliefs & Morals:\n" + beliefs);
        if (preferences) lines.push("\nPreferences & Romance:\n" + preferences);
        if (background) lines.push("\nBackground & Goals:\n" + background);
        if (lore) lines.push("\nLore / World Facts:\n" + lore);
        if (roleplay) lines.push("\nRoleplay Examples:\n" + roleplay);
        if (introScenario || introStart) {
            let introLines = ["\nRoleplay Intro:"];
            if (introScenario) {
                introLines.push("Scene Context:\n" + introScenario);
            }
            if (introStart) {
                introLines.push("Intro Script:\n" + introStart);
            }
            lines.push(introLines.join("\n"));
        }

        let worldLore = worldLoreEl.value.trim();
        if (worldLore) lines.push("\nWorld Lore:\n" + worldLore);
        return lines.join("\n");
    };

    window.saveCharacterButtonClickHandler = async function (pluginDataOrButton, buttonEl) {
        let button = buttonEl || (pluginDataOrButton instanceof HTMLElement ? pluginDataOrButton : null);
        let data = buttonEl ? pluginDataOrButton : (pluginDataOrButton instanceof HTMLElement ? null : pluginDataOrButton);

        let d = getDetailsContext();
        let name = d.name || "Unknown";
        
        let pluginOutput = null;
        let imageDataUrl = window.selectedAvatarUrl || data?.dataUrl || window.lastCharacterData?.imageDataUrl || "";
        if (button) {
            let wrapper = button.closest('.image-card-wrapper') || button.closest('.imageWrapper');
            if (wrapper) {
                let iframe = wrapper.querySelector('iframe');
                if (iframe) {
                    try {
                        if (iframe.textToImagePluginOutput) {
                            pluginOutput = iframe.textToImagePluginOutput;
                            if (!imageDataUrl) imageDataUrl = iframe.textToImagePluginOutput.dataUrl;
                        }
                    } catch (e) {
                        console.warn("Could not access iframe properties (cross-origin):", e);
                    }
                }
                if (!imageDataUrl) {
                    let img = wrapper.querySelector('img');
                    if (img) imageDataUrl = img.src;
                }
            }
        }
        
        let newId = Date.now();
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        saved.push({
            id: newId,
            name,
            details: d,
            sheetData: window.sheetsState || JSON.parse(localStorage.activeSheetData || "null") || null,
            roleText: getSectionText("role"),
            roleNotes: (document.getElementById("roleNotesEl") || {}).value || "",
            personalityText: getSectionText("personality"),
            personalityNotes: (document.getElementById("personalityNotesEl") || {}).value || "",
            beliefsText: getSectionText("beliefs"),
            beliefsNotes: (document.getElementById("beliefsNotesEl") || {}).value || "",
            preferencesText: getSectionText("preferences"),
            preferencesNotes: (document.getElementById("preferencesNotesEl") || {}).value || "",
            appearanceText: getSectionText("appearance"),
            appearanceNotes: (document.getElementById("appearanceNotesEl") || {}).value || "",
            backgroundText: getSectionText("background"),
            backgroundNotes: (document.getElementById("backgroundNotesEl") || {}).value || "",
            loreText: getSectionText("lore"),
            loreNotes: (document.getElementById("loreNotesEl") || {}).value || "",
            roleplayText: getSectionText("roleplay"),
            roleplayNotes: (document.getElementById("roleplayNotesEl") || {}).value || "",
            introScenarioText: getSectionText("introScenario"),
            introStartText: getSectionText("introStart"),
            introNotes: (document.getElementById("introNotesEl") || {}).value || "",
            generatedText: assembleFullCharacterText(),
            
            selectedAvatarUrl: window.selectedAvatarUrl || "",
            imageDataUrl,
            pluginOutput,
            visualStyleName: visualStyleEl.value,
            setting: settingEl.value,
            tone: getSelectedTones(),
            archetype: typeof getSelectedArchetypes === "function" ? getSelectedArchetypes() : ["Any"],
            overviewNotes: (document.getElementById("overviewNotesEl") || {}).value || "",
            worldLore: (document.getElementById("worldLoreEl") || {}).value || "",
            worldName: (document.getElementById("worldNameEl") || {}).value || localStorage.worldName || "",
            worldLoreNotes: (document.getElementById("worldLoreNotesEl") || {}).value || "",
            worldLoreImageUrl: localStorage.worldLoreImageUrl || "",
            visualKeyphrasesText: window.lastCharacterData?.visualKeyphrasesText || "",
            overwrittenVisualKeyphrasesText: window.overwrittenVisualKeyphrasesText || "",
            overwrittenStylePrompt: window.overwrittenStylePrompt || "",
            activeImages: (function() {
                let imgUrls = [];
                document.querySelectorAll("#imagesEl img").forEach(img => {
                    if (img.src) imgUrls.push(img.src);
                });
                return imgUrls;
            })(),
        });
        localStorage.savedCharacters = JSON.stringify(saved);
        window.activeCharacterId = newId;
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
        renderSidebar();
        if (button) {
            let origHtml = button.innerHTML;
            button.innerHTML = "<i class=\"bi bi-check-lg\"></i> Saved!";
            setTimeout(() => { button.innerHTML = origHtml; }, 2000);
        }
    };

    window.saveCharacterFromTopBar = function (btn) {
        saveCharacterButtonClickHandler(btn, btn);
    };

    window.saveActiveWorkspaceState = function () {
        localStorage.activeCharacterId = window.activeCharacterId || "";
        localStorage.activeCharacterSections = JSON.stringify(window.characterSections || {});
        localStorage.selectedAvatarUrl = window.selectedAvatarUrl || "";
        localStorage.overwrittenVisualKeyphrasesText = window.overwrittenVisualKeyphrasesText || "";
        localStorage.overwrittenStylePrompt = window.overwrittenStylePrompt || "";
        localStorage.lastCharacterData = JSON.stringify(window.lastCharacterData || null);
        
        let imgUrls = [];
        document.querySelectorAll("#imagesEl img").forEach(img => {
            if (img.src) imgUrls.push(img.src);
        });
        localStorage.activeImages = JSON.stringify(imgUrls);
    };

    window.updateTopBarSaveButtons = function () {
        let container = document.getElementById("saveButtonsContainer");
        if (!container) return;
        
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let activeChar = saved.find(x => x.id === window.activeCharacterId);
        
        if (activeChar) {
            container.innerHTML = `
                <button onclick="updateCharacter(${activeChar.id})" class="btn-primary" style="font-size:90%; padding:0.45rem 0.8rem; height:fit-content; background:var(--accent-color); border-color:var(--accent-color);"><i class="bi bi-floppy-fill"></i> Save Changes</button>
                <button onclick="saveCharacterButtonClickHandler(this)" class="btn-secondary" style="font-size:90%; padding:0.45rem 0.8rem; height:fit-content;" title="Save as a new character slot"><i class="bi bi-copy"></i> Save as Copy</button>
            `;
        } else {
            container.innerHTML = `
                <button id="saveCharacterTopBtn" onclick="saveCharacterFromTopBar(this)" class="btn-secondary" style="font-size:90%; padding:0.45rem 0.8rem; height:fit-content;"><i class="bi bi-floppy"></i> Save Character</button>
            `;
        }
    };

    window.loadCharacter = function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let c = saved.find(x => x.id === id);
        if (!c) return;

        window.showConfirmDialog(
            `Are you sure you want to load <b>${c.name}</b>? Any unsaved edits currently on the screen will be overwritten.`,
            'warnOnLoad',
            () => {
                let d = c.details || {};
                detailNameEl.value = d.name || (c.name || "");
                detailAgeEl.value = d.age || "";
                detailGenderEl.value = d.gender || "";
                detailOrientationEl.value = d.orientation || "";
                detailRaceEl.value = d.species || d.race || "";
                detailEthnicityEl.value = d.ethnicity || "";
                saveDetails();
                // Restore outputs and notes for all sections
                window.characterSections = {};
                let sections = ["role", "personality", "beliefs", "preferences", "appearance", "background", "lore", "roleplay"];
                sections.forEach(s => {
                    let textKey = s + "Text";
                    let notesKey = s + "Notes";
                    let outputEl = document.getElementById(s + "OutputEl");
                    let notesEl = document.getElementById(s + "NotesEl");
                    let editBtn = document.getElementById(s + "EditBtnEl");
                    
                    if (s === "lore") {
                        if (c[textKey] !== undefined) {
                            window.loadLoreToUI(c[textKey]);
                            if (editBtn) editBtn.style.display = "inline-block";
                        } else {
                            clearSection(s);
                        }
                    } else {
                        if (c[textKey] !== undefined) {
                            setSectionOutput(s, formatSectionText(c[textKey]));
                            window.characterSections[s] = c[textKey];
                            if (editBtn) editBtn.style.display = "inline-block";
                        } else {
                            clearSection(s);
                        }
                    }
                    
                    if (c[notesKey] !== undefined) {
                        if (notesEl) {
                            notesEl.value = c[notesKey];
                            localStorage[s + "Notes"] = c[notesKey];
                        }
                    } else {
                        if (notesEl) {
                            notesEl.value = "";
                            localStorage.removeItem(s + "Notes");
                        }
                    }
                });

                // Restore split intro sections
                let introNotesEl = document.getElementById("introNotesEl");
                
                if (c.introNotes !== undefined) {
                    if (introNotesEl) {
                        introNotesEl.value = c.introNotes;
                        localStorage.introNotes = c.introNotes;
                    }
                } else {
                    if (introNotesEl) {
                        introNotesEl.value = "";
                        localStorage.removeItem("introNotes");
                    }
                }
                
                if (c.introScenarioText !== undefined || c.introStartText !== undefined) {
                    let scenText = c.introScenarioText || "";
                    let startText = c.introStartText || "";
                    
                    setSectionOutput("introScenario", formatSectionText(scenText));
                    window.characterSections["introScenario"] = scenText;
                    
                    setSectionOutput("introStart", formatSectionText(startText));
                    window.characterSections["introStart"] = startText;
                } else if (c.introText) {
                    let split = splitOldIntroText(c.introText);
                    
                    setSectionOutput("introScenario", formatSectionText(split.scenario));
                    window.characterSections["introScenario"] = split.scenario;
                    
                    setSectionOutput("introStart", formatSectionText(split.start));
                    window.characterSections["introStart"] = split.start;
                } else {
                    clearSection("introScenario");
                    clearSection("introStart");
                }

                // Restore chosen avatar
                let avatarUrl = c.selectedAvatarUrl || c.imageDataUrl || "";
                updateProfileAvatar(avatarUrl);

                window.lastCharacterData = {
                    appearanceText: c.appearanceText || "",
                    loreText: c.loreText || "",
                    visualKeyphrasesText: c.visualKeyphrasesText || "",
                    visualStyleName: c.visualStyleName || "",
                    imageDataUrl: c.imageDataUrl || "",
                };
                window.overwrittenVisualKeyphrasesText = c.overwrittenVisualKeyphrasesText || null;
                window.overwrittenStylePrompt = c.overwrittenStylePrompt || null;
                if (c.visualStyleName) visualStyleEl.value = c.visualStyleName;
                if (c.setting) {
                    settingEl.value = c.setting;
                }
                
                // Restore selected tones
                if (c.tone) {
                    document.querySelectorAll(".toneCheckbox").forEach(box => box.checked = false);
                    let anyBox = document.getElementById("toneAnyCheckbox");
                    if (c.tone.includes("Any") || c.tone.length === 0) {
                        if (anyBox) anyBox.checked = true;
                    } else {
                        if (anyBox) anyBox.checked = false;
                        c.tone.forEach(t => {
                            let box = document.querySelector(`.toneCheckbox[value="${t}"]`);
                            if (box) box.checked = true;
                        });
                    }
                    updateToneLabel();
                    saveTones();
                }

                // Restore selected archetypes
                if (typeof updateArchetypeLabel === "function") {
                    document.querySelectorAll(".archetypeCheckbox").forEach(box => box.checked = false);
                    let anyArchetypeBox = document.getElementById("archetypeAnyCheckbox");
                    if (c.archetype && c.archetype.length > 0 && !c.archetype.includes("Any")) {
                        if (anyArchetypeBox) anyArchetypeBox.checked = false;
                        c.archetype.forEach(a => {
                            let box = document.querySelector(`.archetypeCheckbox[value="${a}"]`);
                            if (box) box.checked = true;
                        });
                    } else {
                        if (anyArchetypeBox) anyArchetypeBox.checked = true;
                    }
                    updateArchetypeLabel();
                    saveArchetypes();
                }

                let overviewEl = document.getElementById("overviewNotesEl");
                let worldEl = document.getElementById("worldLoreEl");
                let worldNameEl2 = document.getElementById("worldNameEl");
                let worldLoreNotesEl2 = document.getElementById("worldLoreNotesEl");
                if (overviewEl && c.overviewNotes !== undefined) { overviewEl.value = c.overviewNotes; localStorage.overviewNotes = c.overviewNotes; }
                if (worldEl && c.worldLore !== undefined) { worldEl.value = c.worldLore; localStorage.worldLore = c.worldLore; }
                if (worldNameEl2) { worldNameEl2.value = c.worldName || ""; localStorage.worldName = c.worldName || ""; }
                if (worldLoreNotesEl2 && c.worldLoreNotes !== undefined) { worldLoreNotesEl2.value = c.worldLoreNotes; localStorage.worldLoreNotes = c.worldLoreNotes; }

                if (c.worldLoreImageUrl) {
                    localStorage.worldLoreImageUrl = c.worldLoreImageUrl;
                    updateWorldLoreVisuals(c.worldLoreImageUrl);
                } else {
                    localStorage.removeItem("worldLoreImageUrl");
                    let container = document.getElementById("worldLoreImgContainer");
                    if (container) container.style.display = "none";
                    if (typeof worldLoreBgEl !== 'undefined') worldLoreBgEl.style.backgroundImage = "none";
                }

                let imgUrls = c.activeImages || (c.imageDataUrl ? [c.imageDataUrl] : []);
                if (imgUrls && imgUrls.length > 0) {
                    imagesAreaEl.style.display = "block";
                    let imageHtml = "";
                    imgUrls.forEach(url => {
                        let isSelected = (url === avatarUrl) ? " selected-avatar" : "";
                        let wrapper = '<div class="image-card-wrapper' + isSelected + '">';
                        wrapper += '<img src="' + url + '">';
                        wrapper += '<div class="image-card-actions">';
                        wrapper += '<button class="image-card-btn primary-btn chooseAvatarBtn" onclick="chooseAsProfileImage(this)"><i class="bi bi-person-bounding-box"></i> Use as Profile</button>';
                        
                        wrapper += '</div></div>';
                        imageHtml += wrapper;
                    });
                    imagesEl.innerHTML = imageHtml;
                    
                    // Re-render editable prompt textarea
                    let basePrompt = c.overwrittenVisualKeyphrasesText || c.visualKeyphrasesText || "";
                    let promptHtml = '<div style="display:flex; flex-direction:column; gap:0.5rem; text-align:left; width:100%; box-sizing:border-box;">';
                    promptHtml += '<div><b style="font-size:80%; display:inline-flex; align-items:center; gap:0.3rem;"><i class="bi bi-pencil-fill" style="color:var(--accent-color);"></i> Image Prompt <span style="opacity:0.6;">(editable)</span>:</b>';
                    promptHtml += '<textarea oninput="window.overwrittenVisualKeyphrasesText=this.value; if(window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();" class="image-tools-textarea" style="min-height:5rem; margin-top:0.25rem;">' + basePrompt + '</textarea></div></div>';
                    imagePromptEl.innerHTML = promptHtml;
                    
                    // Update style override field
                    if (typeof styleOverrideEl !== 'undefined' && styleOverrideEl) {
                        if (c.overwrittenStylePrompt) {
                            styleOverrideEl.value = c.overwrittenStylePrompt;
                        } else {
                            updateStyleOverridePlaceholder();
                        }
                    } else {
                        updateStyleOverridePlaceholder();
                    }
                } else {
                    if (typeof imagesAreaEl !== 'undefined') imagesAreaEl.style.display = "none";
                    if (typeof imagesEl !== 'undefined') imagesEl.innerHTML = "";
                    if (typeof imagePromptEl !== 'undefined') imagePromptEl.innerHTML = "";
                }
                
                window.sheetsState = c.sheetData || null;
                if (c.sheetData) {
                    localStorage.activeSheetData = JSON.stringify(c.sheetData);
                } else {
                    localStorage.removeItem("activeSheetData");
                }
                let sheetSelector = document.getElementById("sheetCharacterSelector");
                if (sheetSelector) {
                    sheetSelector.value = id;
                }
                window.activeCharacterId = id;
                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
                if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
                
                // Close sidebar on load
                let sidebar = document.getElementById("sidebarEl");
                if (sidebar) sidebar.style.transform = "translateX(100%)";
            }
        );
    };

    window.renderSidebar = function (searchQuery = "") {
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let q = searchQuery.toLowerCase().trim();
        
        // Read input box directly if empty arg but input has text
        if (!q) {
            let input = document.getElementById("characterSearchInput");
            if (input && input.value) {
                q = input.value.toLowerCase().trim();
                let clearBtn = document.getElementById("clearSearchBtn");
                if (clearBtn) clearBtn.style.display = "inline-flex";
            }
        }

        if (q) {
            saved = saved.filter(c => c.name.toLowerCase().includes(q));
        }

        let listHtml = "";
        if (saved.length === 0) {
            listHtml = q ? '<p style="opacity:0.5; font-size:82%; text-align:center; padding:1.5rem 0.5rem; color:var(--text-muted);">No matching characters found.</p>'
                        : '<p style="opacity:0.5; font-size:85%; text-align:center; padding:1.5rem 0.5rem; color:var(--text-muted);">No saved characters yet.</p>';
        } else {
            for (let c of saved) {
                let card = '<div style="display:flex; flex-direction:column; gap:0.4rem; padding:0.6rem; border:1px solid var(--panel-border); border-radius:8px; background:var(--panel-bg); box-shadow: 0 2px 4px rgba(0,0,0,0.05);">';
                let cardImgUrl = c.selectedAvatarUrl || c.imageDataUrl || "";
                if (cardImgUrl) { card += '<img src="' + cardImgUrl + '" style="width:100%; border-radius:6px; object-fit:cover; max-height:180px;">'; } else { card += '<div style="width:100%; height:80px; border-radius:6px; background:var(--input-bg); display:flex; align-items:center; justify-content:center; font-size:200%; opacity:0.3; color:var(--text-main);"><i class="bi bi-person-fill"></i></div>'; }
                card += '<div style="display:flex; align-items:center; gap:0.45rem;">';
                card += '<input type="checkbox" id="ref-' + c.id + '" style="cursor:pointer; accent-color:var(--accent-color);">';
                card += '<label for="ref-' + c.id + '" ondblclick="renameSavedCharacter(\'' + c.id + '\', this)" style="font-weight:bold; font-size:90%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; cursor:pointer; flex:1; color:var(--text-main);" title="Double-click to rename">' + c.name + '</label>';
                card += '</div>';
                card += '<div style="display:flex; gap:0.25rem;">';
                card += '<button onclick="loadCharacter(\'' + c.id + '\')" class="btn btn-secondary btn-sm" style="flex:1; font-size:72%; padding:0.25rem 0.35rem; display:inline-flex; align-items:center; justify-content:center; gap:0.15rem;" title="Load character"><i class="bi bi-folder-open"></i> load</button>';
                card += '<button onclick="updateCharacter(\'' + c.id + '\')" class="btn btn-secondary btn-sm" style="flex:1.1; font-size:72%; padding:0.25rem 0.35rem; display:inline-flex; align-items:center; justify-content:center; gap:0.15rem;" title="Update slot with screen edits"><i class="bi bi-floppy"></i> update</button>';
                card += '<button onclick="duplicateCharacter(\'' + c.id + '\')" class="btn btn-secondary btn-sm" style="flex:0.8; font-size:72%; padding:0.25rem 0.35rem; display:inline-flex; align-items:center; justify-content:center; gap:0.15rem;" title="Duplicate"><i class="bi bi-copy"></i> dupe</button>';
                card += '<button onclick="deleteCharacter(\'' + c.id + '\')" class="btn btn-danger btn-sm" style="flex:0.5; font-size:72%; padding:0.25rem 0.35rem; display:inline-flex; align-items:center; justify-content:center;" title="Delete"><i class="bi bi-trash"></i></button>';
                card += '</div></div>';
                listHtml += card;
            }
        }
        sidebarListEl.innerHTML = listHtml;
        updateSavedCountBadge();
        updateReferencesBanner();
        checkStorageUsage();
    };

    window.filterSavedCharacters = function (query) {
        let q = query.toLowerCase().trim();
        let clearBtn = document.getElementById("clearSearchBtn");
        if (clearBtn) {
            clearBtn.style.display = q ? "inline-flex" : "none";
        }
        renderSidebar(q);
    };

    window.clearCharacterSearch = function () {
        let input = document.getElementById("characterSearchInput");
        if (input) {
            input.value = "";
        }
        filterSavedCharacters("");
        if (input) input.focus();
    };

    window.deleteCharacter = function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        localStorage.savedCharacters = JSON.stringify(saved.filter(x => x.id !== id));
        if (window.activeCharacterId === id) {
            window.activeCharacterId = null;
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
            if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
        }
        renderSidebar();
    };

    window.duplicateCharacter = function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let original = saved.find(x => x.id === id);
        if (!original) return;
        let dupe = Object.assign({}, original, { id: Date.now(), name: original.name + " (copy)" });
        saved.push(dupe);
        localStorage.savedCharacters = JSON.stringify(saved);
        renderSidebar();
    };

    window.renameSavedCharacter = function (id, labelEl) {
        id = isNaN(Number(id)) ? id : Number(id);
        let currentName = labelEl.textContent;
        let input = document.createElement("input");
        input.value = currentName;
        input.style.cssText = "font-size:90%; font-weight:bold; width:100%; border:1px solid var(--accent-color); background:var(--input-bg); color:var(--text-main); outline:none; border-radius:4px; padding:0.1rem 0.2rem;";
        labelEl.replaceWith(input);
        input.focus(); input.select();
        let committed = false;
        let commit = () => {
            if (committed) return;
            committed = true;
            let newName = input.value.trim() || currentName;
            let saved = JSON.parse(localStorage.savedCharacters || "[]");
            let idx = saved.findIndex(x => x.id === id);
            if (idx !== -1) { saved[idx].name = newName; localStorage.savedCharacters = JSON.stringify(saved); }
            renderSidebar();
        };
        input.addEventListener("blur", commit);
        input.addEventListener("keydown", e => {
            if (e.key === "Enter") { e.preventDefault(); input.blur(); }
            if (e.key === "Escape") { input.value = currentName; input.blur(); }
        });
    };

    window.exportSavedCharacters = function () {
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        if (saved.length === 0) { alert("No saved characters to export."); return; }
        let json = JSON.stringify(saved, null, 2);
        let blob = new Blob([json], { type: "application/json" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "saved-characters.json";
        a.click();
        URL.revokeObjectURL(a.href);
    };

    window.importSavedCharacters = function () {
        let input = document.createElement("input");
        input.type = "file"; input.accept = ".json";
        input.onchange = e => {
            let file = e.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = ev => {
                try {
                    let imported = JSON.parse(ev.target.result);
                    if (!Array.isArray(imported)) throw new Error("Invalid format");
                    let existing = JSON.parse(localStorage.savedCharacters || "[]");
                    localStorage.savedCharacters = JSON.stringify([...existing, ...imported]);
                    renderSidebar();
                    alert("✅ Imported " + imported.length + " character(s).");
                } catch (err) { alert("❌ Failed to import: invalid file."); }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // ─── CHARACTER CHAT ───────────────────────────────────────────────
    window.buildRoleInstruction = function (condensedInstruction, writingStyle) {
        let universalRules = "RULES:\n- Never write dialogue, actions, or thoughts for {{user}}}.\n- Never break character.";
        return [condensedInstruction, writingStyle, universalRules].filter(Boolean).join("\n\n");
    };

    window.prepareCharacterForChat = async function (characterData) {
        let { generatedText } = characterData;
        let settingValue = settingEl.value;
        let toneValues = getSelectedTones();
        let loadingModal = window.chatPrepLoadingModal;

        loadingModal.updateContent("🎨 Preparing chat: generating character style...");
        let cssParts = [];
        cssParts.push("You are generating CSS styling for an AI character chat interface message bubble. The interface uses a dark background.");
        cssParts.push("Character description:\n---\n" + generatedText + "\n---\nSetting: " + settingValue + "\nTone: " + toneValues.join(", "));
        cssParts.push("Generate atmospheric CSS styling that suits this character's personality, aesthetic, and tone.");
        cssParts.push('Respond with ONLY a valid JSON object in this format:\n{\n  "css": "...",\n  "googleFont": "..."\n}');
        let cssInstruction = cssParts.join("\n\n");

        let cssResultStream = ai({ instruction: cssInstruction });
        let cssRes = await cssResultStream;
        let cssJson;
        try {
            let cssText = cssRes.text || "";
            let jsonMatch = cssText.match(/\{[\s\S]*\}/);
            let cleaned = jsonMatch ? jsonMatch[0] : cssText.replace(/```json|```/g, "").trim();
            cssJson = JSON.parse(cleaned);
        } catch (e) { cssJson = { css: "", googleFont: null }; }

        loadingModal.updateContent("📖 Preparing chat: building role instruction and lorebook...");
        let loreParts = [];
        loreParts.push("You are preparing a character for an AI roleplay chat system.");
        loreParts.push('Respond with ONLY valid JSON:\n{\n  "roleInstruction": "...",\n  "loreEntries": ["..."]\n}');
        let loreInstruction = loreParts.join("\n\n");

        let loreResultStream = ai({ instruction: loreInstruction });
        let loreRes = await loreResultStream;
        let loreJson;
        try {
            let loreText = loreRes.text || "";
            let jsonMatch = loreText.match(/\{[\s\S]*\}/);
            let cleaned = jsonMatch ? jsonMatch[0] : loreText.replace(/```json|```/g, "").trim();
            loreJson = JSON.parse(cleaned);
        } catch (e) { loreJson = { roleInstruction: generatedText, loreEntries: [] }; }

        loadingModal.updateContent("✍️ Preparing chat: generating writing style...");
        let wrapperInstruction = "Write a concise style guide for an AI roleplaying as this character...";
        let wrapperResultStream = ai({ instruction: wrapperInstruction });
        let wrapperRes = await wrapperResultStream;
        let writingStyle = (wrapperRes.text || "").trim();

        let loreBookUrl = null;
        if (loreJson.loreEntries && loreJson.loreEntries.length > 0) {
            loadingModal.updateContent("📤 Preparing chat: uploading lorebook...");
            let loreBlob = new Blob([loreJson.loreEntries.join("\n\n")], { type: "text/plain" });
            let uploadResult = await uploadPlugin(loreBlob);
            if (uploadResult && uploadResult.url) loreBookUrl = uploadResult.url;
        }

        return {
            css: cssJson.css || "",
            googleFont: cssJson.googleFont || null,
            roleInstruction: loreJson.roleInstruction || generatedText,
            loreBookUrl,
            writingStyle,
        };
    };

    async function chatWithCharacterButtonClickHandler(pluginDataOrButton, buttonEl) {
        let button = buttonEl || (pluginDataOrButton instanceof HTMLElement ? pluginDataOrButton : null);
        let data = buttonEl ? pluginDataOrButton : (pluginDataOrButton instanceof HTMLElement ? null : pluginDataOrButton);

        let generatedText = assembleFullCharacterText();
        let d = getDetailsContext();
        let name = d.name || "???";
        let firstName = name.split(/[ ,]/)[0];
        
        let characterImagePrompt = (data?.inputs?.prompt || window.lastCharacterData?.visualKeyphrasesText || "").replace(/\n/g, " ");
        let characterImageDataUrl = data?.dataUrl || window.lastCharacterData?.imageDataUrl || "";
        if (!characterImageDataUrl && button) {
            let wrapper = button.closest('.image-card-wrapper') || button.closest('.imageWrapper');
            if (wrapper) {
                let iframe = wrapper.querySelector('iframe');
                if (iframe) {
                    try {
                        if (iframe.textToImagePluginOutput) {
                            characterImageDataUrl = iframe.textToImagePluginOutput.dataUrl;
                            characterImagePrompt = (iframe.textToImagePluginOutput.inputs?.prompt || characterImagePrompt).replace(/\n/g, " ");
                        }
                    } catch (e) {
                        console.warn("Could not access iframe properties (cross-origin):", e);
                    }
                }
                if (!characterImageDataUrl) {
                    let img = wrapper.querySelector('img');
                    if (img) characterImageDataUrl = img.src;
                }
            }
        }

        window.chatPrepLoadingModal = createLoadingModal("🎨 Preparing chat: generating character style...");
        if (button) button.disabled = true;

        let chatPrep = await prepareCharacterForChat({ generatedText });
        let fullCss = chatPrep.css || "";
        let roleInstruction = buildRoleInstruction(chatPrep.roleInstruction, chatPrep.writingStyle);

        window.chatPrepLoadingModal.updateContent("✅ Ready  -  preparing preview...");
        await new Promise(r => setTimeout(r, 400));
        window.chatPrepLoadingModal.delete();

        let colorScheme = getCurrentColorScheme();
        let previewHtml = '<div style="text-align:left; max-width:600px;">';
        previewHtml += '<div style="margin-bottom:0.5rem; font-weight:bold;">💬 Chat Role Instruction Preview</div>';
        previewHtml += '<textarea id="roleInstructionPreviewEl" class="section-notes" style="display:block; width:100%; min-height:14rem; font-size:82%; color-scheme:' + colorScheme + ';">' + roleInstruction.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</textarea>';
        previewHtml += '</div>';
        let result = await prompt2({
            content: { type: "none", html: previewHtml }
        }, { cancelButtonText: "cancel", submitButtonText: "🚀 launch chat", verticallyCenter: true });

        if (!result || result.cancelled) { if (button) button.disabled = false; return; }
        let editedRoleInstruction = document.getElementById("roleInstructionPreviewEl")?.value || roleInstruction;

        let customCode = fullCss ? 'oc.thread.on("MessageAdded", function({message}) {\n  if(message.author !== "ai") return;\n  message.wrapperStyle = ' + JSON.stringify(JSON.stringify(fullCss)) + ';\n  });' : "";

        let json = {
            addCharacter: {
                name,
                roleInstruction: editedRoleInstruction,
                imagePromptTriggers: firstName + ": " + characterImagePrompt,
                customCode,
                loreBookUrls: chatPrep.loreBookUrl ? [chatPrep.loreBookUrl] : [],
                avatar: { url: characterImageDataUrl, size: 1, shape: "square" },
            },
            quickAdd: true,
        };

        await generateShareLinkForCharacter(json);
        setGenerationStatus("");
        if (button) button.disabled = false;
    }

    async function generateShareLinkForCharacter(json) {
        if (!window.CompressionStream) {
            alert("Character chat links require a modern browser.");
            return;
        }
        let loadingModal = createLoadingModal("⌛ Generating chat link...");
        let jsonString = JSON.stringify(json);
        let blob = await fetch("data:text/plain;charset=utf-8," + jsonString.replace(/#/g, "%23")).then(res => res.blob());
        let compressedBlob = await compressBlobWithGzip(blob);
        let { url, error } = await uploadPlugin(compressedBlob);
        loadingModal.delete();
        if (error) { alert(`error: ${error}`); }
        else {
            let fileName = url.replace("https://user-uploads.perchance.org/file/", "");
            let shareUrl = `https://perchance.org/ai-character-chat?data=${encodeURIComponent(json.addCharacter.name)}~${fileName}`;
            let colorScheme = getCurrentColorScheme();
            await prompt2({
                content: { type: "none", html: `<div style="display:flex; gap:0.5rem;"><input value="${shareUrl}" style="flex-grow:1; background:var(--input-bg); border:1px solid var(--input-border); color:var(--text-main); border-radius:4px; padding:0.35rem 0.5rem; outline:none;"> <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('input').value);">📋 copy</button> </div>` },
            }, { cancelButtonText: null, submitButtonText: "finished", verticallyCenter: true });
        }
    }

    window.compressBlobWithGzip = async function (blob) {
        const cs = new CompressionStream('gzip');
        const compressedStream = blob.stream().pipeThrough(cs);
        let outputBlob = await new Response(compressedStream).blob();
        return new Blob([outputBlob], { type: "application/gzip" });
    };

    window.createLoadingModal = function (initialContent, parentElement) {
        if (!parentElement) parentElement = document.body;
        let loadingModalCtn = document.createElement("div");
        loadingModalCtn.innerHTML = `<style>
            .loadingModalCtn-856246272937 {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.45);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                z-index: 99999999;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1.5rem;
            }
            .loadingModalContent-856246272937 {
                background-color: var(--panel-bg);
                border: 1px solid var(--panel-border);
                color: var(--text-main);
                border-radius: 12px;
                padding: 1.5rem 2.25rem;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                max-width: 400px;
                width: 100%;
                box-sizing: border-box;
                font-size: 90%;
                font-weight: 500;
            }
        </style>`;
        let contentEl = document.createElement("div");
        contentEl.classList.add("loadingModalContent-856246272937");
        contentEl.innerHTML = initialContent || "";
        loadingModalCtn.appendChild(contentEl);
        loadingModalCtn.classList.add("loadingModalCtn-856246272937");
        parentElement.appendChild(loadingModalCtn);
        return {
            updateContent: function (content) { contentEl.innerHTML = content; },
            delete: function () { loadingModalCtn.remove(); },
        }
    };

    // ─── WIKI IMPORT ──────────────────────────────────────────────────
    window.importFromWikiUrl = async function (url) {
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
                if (url.includes("genshin-impact.fandom.com") && !url.endsWith("/Lore")) {
                    try {
                        let json = await superFetch(`https://${urlObj.hostname}/api.php?action=visualeditor&format=json&paction=wikitext&page=${wikiPageName}/Lore&uselang=en&formatversion=2`).then(r => r.json());
                        if (json?.visualeditor?.content) content = json.visualeditor.content;
                    } catch (e) { }
                }
                if (!content) {
                    let json = await superFetch(`https://${urlObj.hostname}/api.php?action=visualeditor&format=json&paction=wikitext&page=${wikiPageName}&uselang=en&formatversion=2`).then(r => r.json());
                    content = json?.visualeditor?.content || "";
                }
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
            setGenerationStatus("🧠 Extracting character data...");
            let wikiOverride = (document.getElementById("wikiOverrideEl") || {}).value || "";
            let instruction = `TASK: Extract character information from the provided text to populate a complete character profile.\n\nText:\n${content.slice(0, 12000)}\n\nRespond with ONLY a JSON object in this format:\n{\n  "name": "...",\n  "age": "...",\n  "gender": "...",\n  "orientation": "...",\n  "race": "...",\n  "ethnicity": "...",\n  "role": "...",\n  "appearance": "...",\n  "background": "...",\n  "personality": "...",\n  "beliefs": "...",\n  "preferences": "...",\n  "lore": "...",\n  "roleplay": "..."\n}\n- Keep identity fields (name, age, gender, orientation, race, ethnicity) short.\n- role: 3-sentence description of the character's narrative role and relationship to the {{user}}/protagonist.\n- appearance, background, personality, beliefs, and preferences should be detailed paragraphs (4+ sentences each) based on the text.\n- personality: focus on core traits, speech, behavior, emotions, and internal conflicts.\n- beliefs: focus on mentality, world view, beliefs, morals, and core philosophies.\n- preferences: focus on likes, hates, hobbies, values, and romance views.\n- lore: 5-10 specific timeless facts or world-building details extracted from the text, formatted as a bulleted/numbered list or multi-line text.\n- roleplay: A custom roleplay starting scene or greeting message written in the first person or third person from the character's perspective based on their lore.\n- If a field is unknown, use null.${wikiOverride.trim() ? `\n\nIMPORTANT CREATIVE TWIST  -  apply this override to ALL sections of the character: "${wikiOverride.trim()}". Reinterpret the source material fully through this lens. Keep the core identity (name, age, gender, race, appearance) grounded in source, but personality, role, background, beliefs, preferences, lore and roleplay must strongly reflect this twist.` : ""}\n\n${getBannedFormattingRule()}`;
            let res = await ai({ instruction });
            let jsonText = res.text || "";
            let jsonMatch = jsonText.match(/\{[\s\S]*\}/);
            let cleanedJson = jsonMatch ? jsonMatch[0] : jsonText.replace(/```json|```/g, "").trim();
            let json = JSON.parse(cleanedJson);
            if (json.name) detailNameEl.value = json.name;
            if (json.age) detailAgeEl.value = json.age;
            if (json.gender) detailGenderEl.value = json.gender;
            if (json.orientation) detailOrientationEl.value = json.orientation;
            if (json.race) detailRaceEl.value = json.race;
            if (json.ethnicity) detailEthnicityEl.value = json.ethnicity;
            saveDetails();
            
            if (json.role) setSectionOutput("role", formatSectionText(sanitizeOutput(json.role)));
            if (json.personality) setSectionOutput("personality", formatSectionText(sanitizeOutput(json.personality)));
            if (json.beliefs) setSectionOutput("beliefs", formatSectionText(sanitizeOutput(json.beliefs)));
            if (json.preferences) setSectionOutput("preferences", formatSectionText(sanitizeOutput(json.preferences)));
            if (json.appearance) setSectionOutput("appearance", formatSectionText(sanitizeOutput(json.appearance)));
            if (json.background) setSectionOutput("background", formatSectionText(sanitizeOutput(json.background)));
            if (json.lore) setSectionOutput("lore", formatSectionText(sanitizeOutput(json.lore)));
            if (json.roleplay) setSectionOutput("roleplay", formatSectionText(sanitizeOutput(json.roleplay)));

            if (!window.characterSections) window.characterSections = {};
            if (json.role) window.characterSections.role = json.role;
            if (json.personality) window.characterSections.personality = json.personality;
            if (json.beliefs) window.characterSections.beliefs = json.beliefs;
            if (json.preferences) window.characterSections.preferences = json.preferences;
            if (json.appearance) window.characterSections.appearance = json.appearance;
            if (json.background) window.characterSections.background = json.background;
            if (json.lore) window.characterSections.lore = json.lore;
            if (json.roleplay) window.characterSections.roleplay = json.roleplay;
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
            
            if (json.appearance) { await triggerImageGeneration(json.appearance); }
            setGenerationStatus("✨ Character imported!");
            setTimeout(() => setGenerationStatus(""), 3000);
        } catch (e) {
            console.error(e);
            alert("Error importing from URL.");
            setGenerationStatus("");
        }
    };

    window.importFromWikiUrlButtonClickHandler = async function () {
        let url = wikiUrlEl.value;
        if (!url) return;
        wikiImportBtnEl.disabled = true;
        await importFromWikiUrl(url);
        wikiImportBtnEl.disabled = false;
    };

    window.createCommentsSectionHtml = function () {
        let options = root.commentsOptions;
        commentsCtn.innerHTML = `<p><button onclick="if(commentsEl.style.display == 'none') { commentsEl.style.display=''; this.textContent='hide comments'; } else { commentsEl.style.display='none'; this.textContent='💬 show comments'; }">💬 show comments</button></p>
    <p id="commentsEl" style="display:none;">${[root.comments(options)]}</p>`;
    };

    // ─── ACCENT THEME CUSTOMIZER ──────────────────────────────────────
    window.updateReferencesBanner = function () {
        let bannerEl = document.getElementById("referencedCharactersBannerEl");
        let countEl = document.getElementById("referencedCharactersCountEl");
        if (bannerEl && countEl) {
            let refs = typeof getReferencedCharacters === "function" ? getReferencedCharacters() : [];
            if (refs.length > 0) {
                countEl.textContent = refs.length;
                bannerEl.style.display = "block";
            } else {
                bannerEl.style.display = "none";
            }
        }
    };

    window.clearDetails = function () {
        ["Name", "Age", "Gender", "Orientation", "Race", "Ethnicity"].forEach(f => {
            let el = document.getElementById("detail" + f + "El");
            if (el) el.value = "";
            localStorage.removeItem("detail" + f);
        });
        if (typeof clearAvatar === "function") clearAvatar();
    };

    window.clearOverviewNotes = function () {
        let el = document.getElementById("overviewNotesEl");
        if (el) {
            el.value = "";
            localStorage.removeItem("overviewNotes");
        }
        let statusEl = document.getElementById("overviewStatusEl");
        if (statusEl) statusEl.innerText = "";
    };

    window.generateCoreIdentity = async function () {
        let btn = document.getElementById("coreGenBtnEl");
        let stopBtn = document.getElementById("coreStopBtnEl");
        if (btn) btn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";
        window.coreIdentityGenRunning = true;

        try {
            // 1. Generate identity details
            let success = await generateIdentityDetails();
            if (!success || !window.coreIdentityGenRunning) return;

            // 2. Generate overview notes
            setGenerationStatus("Conceptualizing masterpiece archetype...");
            await generateOverviewNotes('textarea');
        } catch (e) {
            console.error("Error during generateCoreIdentity:", e);
        } finally {
            window.coreIdentityGenRunning = false;
            if (btn) btn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            setGenerationStatus("");
        }
    };

    window.stopCoreIdentityGeneration = function () {
        window.coreIdentityGenRunning = false;
        stopDetailsGeneration();
        stopOverviewGeneration();
        let btn = document.getElementById("coreGenBtnEl");
        let stopBtn = document.getElementById("coreStopBtnEl");
        if (btn) btn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
    };

    window.clearCoreIdentity = function () {
        clearDetails();
        clearOverviewNotes();
    };

    window.clearAllSections = function () {
        window.showConfirmDialog(
            "Are you sure you want to clear all sections and details from the screen? This cannot be undone.",
            'warnOnClear',
            () => {
                ["role", "personality", "beliefs", "preferences", "appearance", "background", "lore", "roleplay", "introScenario", "introStart"].forEach(s => clearSection(s));
                let introNotesEl = document.getElementById("introNotesEl");
                if (introNotesEl) {
                    introNotesEl.value = "";
                    localStorage.removeItem("introNotes");
                }
                clearDetails();
                clearOverviewNotes();
                if (typeof clearWorldLore === "function") clearWorldLore();
                if (typeof imagesAreaEl !== 'undefined') imagesAreaEl.style.display = "none";
                if (typeof imagesEl !== 'undefined') imagesEl.innerHTML = "";
                if (typeof imagePromptEl !== 'undefined') imagePromptEl.innerHTML = "";
                
                window.lastCharacterData = null;
                window.overwrittenVisualKeyphrasesText = "";
                window.overwrittenStylePrompt = "";
                if (typeof styleOverrideEl !== 'undefined' && styleOverrideEl) {
                    styleOverrideEl.value = "";
                }
                
                window.sheetsState = null;
                localStorage.removeItem("activeSheetData");
                let sheetSelector = document.getElementById("sheetCharacterSelector");
                if (sheetSelector) {
                    sheetSelector.value = "active";
                }
                setGenerationStatus("");
                window.activeCharacterId = null;
                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
                if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
            }
        );
    };

    window.clearAllSavedCharacters = function () {
        if (confirm("Are you sure you want to delete ALL saved characters? This cannot be undone.")) {
            localStorage.removeItem("savedCharacters");
            window.activeCharacterId = null;
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
            if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
            renderSidebar();
        }
    };

    window.updateCharacter = function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let idx = saved.findIndex(x => x.id === id);
        if (idx === -1) return;
        
        let charName = saved[idx].name;
        
        window.showConfirmDialog(
            `Are you sure you want to update <b>${charName}</b> with the current active description edits on the screen? This will permanently overwrite the saved character file.`,
            'warnOnUpdate',
            () => {
                let d = getDetailsContext();
                let name = d.name || charName || "Unknown";
                let imageDataUrl = window.selectedAvatarUrl || window.lastCharacterData?.imageDataUrl || saved[idx].imageDataUrl || "";
                
                saved[idx] = Object.assign(saved[idx], {
                    name,
                    details: d,
                    sheetData: window.sheetsState || JSON.parse(localStorage.activeSheetData || "null") || null,
                    roleText: getSectionText("role"),
                    roleNotes: (document.getElementById("roleNotesEl") || {}).value || "",
                    personalityText: getSectionText("personality"),
                    personalityNotes: (document.getElementById("personalityNotesEl") || {}).value || "",
                    beliefsText: getSectionText("beliefs"),
                    beliefsNotes: (document.getElementById("beliefsNotesEl") || {}).value || "",
                    preferencesText: getSectionText("preferences"),
                    preferencesNotes: (document.getElementById("preferencesNotesEl") || {}).value || "",
                    appearanceText: getSectionText("appearance"),
                    appearanceNotes: (document.getElementById("appearanceNotesEl") || {}).value || "",
                    backgroundText: getSectionText("background"),
                    backgroundNotes: (document.getElementById("backgroundNotesEl") || {}).value || "",
                    loreText: getSectionText("lore"),
                    loreNotes: (document.getElementById("loreNotesEl") || {}).value || "",
                    roleplayText: getSectionText("roleplay"),
                    roleplayNotes: (document.getElementById("roleplayNotesEl") || {}).value || "",
                    introScenarioText: getSectionText("introScenario"),
                    introStartText: getSectionText("introStart"),
                    introNotes: (document.getElementById("introNotesEl") || {}).value || "",
                    generatedText: assembleFullCharacterText(),
                    
                    selectedAvatarUrl: window.selectedAvatarUrl || "",
                    imageDataUrl,
                    visualStyleName: visualStyleEl.value,
                    setting: settingEl.value,
                    tone: getSelectedTones(),
                    overviewNotes: (document.getElementById("overviewNotesEl") || {}).value || "",
                    worldLore: (document.getElementById("worldLoreEl") || {}).value || "",
                    worldLoreImageUrl: localStorage.worldLoreImageUrl || "",
                    visualKeyphrasesText: window.lastCharacterData?.visualKeyphrasesText || saved[idx].visualKeyphrasesText || "",
                    overwrittenVisualKeyphrasesText: window.overwrittenVisualKeyphrasesText || saved[idx].overwrittenVisualKeyphrasesText || "",
                    overwrittenStylePrompt: window.overwrittenStylePrompt || saved[idx].overwrittenStylePrompt || "",
                    activeImages: (function() {
                        let imgUrls = [];
                        document.querySelectorAll("#imagesEl img").forEach(img => {
                            if (img.src) imgUrls.push(img.src);
                        });
                        return imgUrls;
                    })(),
                });
                
                localStorage.savedCharacters = JSON.stringify(saved);
                window.activeCharacterId = id;
                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
                if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
                renderSidebar();
                
                // Show dynamic feedback toast notification
                let toast = document.createElement('div');
                toast.style = `
                    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
                    background: var(--accent-color); color: white; padding: 0.6rem 1.2rem;
                    border-radius: 8px; font-size: 85%; z-index: 999999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-weight: 500;
                    animation: fadeInConfirm 0.2s ease-out;
                `;
                toast.innerHTML = `✅ Updated character "${name}" successfully!`;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.animation = 'fadeInConfirm 0.2s ease-out reverse';
                    setTimeout(() => toast.remove(), 180);
                }, 2000);
            }
        );
    };

    // ─── INITIALIZE LOCAL STORAGE WARNING SETTINGS ───
    if (localStorage.warnOnClear === undefined) localStorage.warnOnClear = 'true';
    if (localStorage.warnOnLoad === undefined) localStorage.warnOnLoad = 'true';
    if (localStorage.warnOnUpdate === undefined) localStorage.warnOnUpdate = 'true';

    // Initial checkbox sync on startup
    setTimeout(() => {
        let clearChk = document.getElementById('settingClearConfirmEl');
        let loadChk = document.getElementById('settingLoadConfirmEl');
        let updateChk = document.getElementById('settingUpdateConfirmEl');
        let skipOverviewChk = document.getElementById('settingSkipOverviewConfirmEl');
        if (clearChk) clearChk.checked = localStorage.warnOnClear === 'true';
        if (loadChk) loadChk.checked = localStorage.warnOnLoad === 'true';
        if (updateChk) updateChk.checked = localStorage.warnOnUpdate === 'true';
        if (skipOverviewChk) skipOverviewChk.checked = localStorage.skipOverviewConfirm === 'true';
    }, 100);

    window.exportAsMarkdown = function () {
        let d = getDetailsContext();
        let name = d.name || "Unnamed Character";
        
        let md = [];
        md.push(`# ${name}`);
        md.push("");
        
        md.push("## 👤 Identity Details");
        md.push(`- **Age:** ${d.age || "Unknown"}`);
        md.push(`- **Gender:** ${d.gender || "Unknown"}`);
        md.push(`- **Orientation:** ${d.orientation || "Unknown"}`);
        md.push(`- **Species/Race:** ${d.species || d.race || "Unknown"}`);
        md.push(`- **Ethnicity:** ${d.ethnicity || "Unknown"}`);
        md.push("");
        
        let sections = [
            { id: "appearance", label: "Appearance" },
            { id: "role", label: "Role" },
            { id: "personality", label: "Personality" },
            { id: "beliefs", label: "Beliefs & Morals" },
            { id: "preferences", label: "Preferences" },
            { id: "background", label: "Background" },
            { id: "lore", label: "Lore Entries" },
            { id: "roleplay", label: "Roleplay Examples" },
            { id: "introScenario", label: "Roleplay Intro - Scenario Context" },
            { id: "introStart", label: "Roleplay Intro - Dialogue & Narration" }
        ];
        
        sections.forEach(s => {
            let text = getSectionText(s.id);
            if (text) {
                md.push(`## 📄 ${s.label}`);
                md.push(text);
                md.push("");
            }
        });
        
        let settingValue = typeof settingEl !== 'undefined' ? settingEl.value : "Any";
        let toneValues = getSelectedTones();
        md.push("## ⚙️ Generation Parameters");
        md.push(`- **Setting:** ${settingValue}`);
        md.push(`- **Tone:** ${toneValues.length > 0 ? toneValues.join(", ") : "Any"}`);
        md.push("");
        
        md.push("---");
        md.push(`*Generated via Supreme Character Description on ${new Date().toLocaleDateString()}*`);
        
        let fullText = md.join("\n");
        let blob = new Blob([fullText], { type: "text/markdown;charset=utf-8;" });
        let a = document.createElement("a");
        let safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "character";
        a.href = URL.createObjectURL(blob);
        a.download = `${safeName}-description.md`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    // ─── EXPORT AS ZIP ARCHIVE ─────────────────────────────────────────
    window.exportAsZip = async function () {
        let d = getDetailsContext();
        let name = d.name || "unnamed_character";
        let safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "") || "character";

        // --- Build character_description.md ---
        let md = [];
        md.push(`# ${name}`);
        md.push("");
        md.push("## Identity Details");
        md.push(`- **Name:** ${d.name || "Unknown"}`);
        md.push(`- **Age:** ${d.age || "Unknown"}`);
        md.push(`- **Gender:** ${d.gender || "Unknown"}`);
        md.push(`- **Orientation:** ${d.orientation || "Unknown"}`);
        md.push(`- **Species/Race:** ${d.species || d.race || "Unknown"}`);
        md.push(`- **Ethnicity:** ${d.ethnicity || "Unknown"}`);
        md.push("");
        let overviewText = (document.getElementById("overviewNotesEl") || {}).value || "";
        if (overviewText.trim()) {
            md.push("## Overview Notes");
            md.push(overviewText.trim());
            md.push("");
        }
        let sections = [
            { id: "appearance", label: "Appearance" },
            { id: "role", label: "Role" },
            { id: "personality", label: "Personality" },
            { id: "beliefs", label: "Beliefs & Morals" },
            { id: "preferences", label: "Preferences" },
            { id: "background", label: "Background" },
            { id: "roleplay", label: "Roleplay Examples" },
            { id: "introScenario", label: "Roleplay Intro - Scenario Context" },
            { id: "introStart", label: "Roleplay Intro - Dialogue & Narration" }
        ];
        sections.forEach(s => {
            let text = getSectionText(s.id);
            if (text) { md.push(`## ${s.label}`); md.push(text); md.push(""); }
        });
        let settingValue = typeof settingEl !== 'undefined' ? settingEl.value : "Any";
        let toneValues = getSelectedTones();
        md.push("## Generation Parameters");
        md.push(`- **Setting:** ${settingValue}`);
        md.push(`- **Tone:** ${toneValues.length > 0 ? toneValues.join(", ") : "Any"}`);
        md.push("");
        md.push("---");
        md.push(`*Generated via Supreme Character Description on ${new Date().toLocaleDateString()}*`);
        let characterMdText = md.join("\n");

        // --- Build world.md ---
        let worldLoreText = (document.getElementById("worldLoreEl") || {}).value || "";
        let worldNameFromField = (document.getElementById("worldNameEl") || {}).value || localStorage.worldName || "";
        let worldMdTitle = worldNameFromField ? `# ${worldNameFromField}` : `# World`;
        let worldMdText = `${worldMdTitle}\n\n${worldLoreText.trim() || "(No world lore generated yet.)"}`;

        // --- Build character lore JSON ---
        let loreJsonStr = compileLoreFromUI() || "{}";
        let loreFilename = `${safeName}_lore.json`;

        // --- Grab images ---
        let charImageUrl = window.selectedAvatarUrl || localStorage.selectedAvatarUrl || "";
        let worldImageUrl = localStorage.worldLoreImageUrl || "";

        // --- Determine world name for world image filename ---
        let worldSafeName = worldNameFromField
            ? worldNameFromField.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "") || "world"
            : "world";

        // Helper to convert a dataUrl to a Uint8Array
        function dataUrlToBytes(dataUrl) {
            let base64 = dataUrl.split(",")[1];
            let binaryStr = atob(base64);
            let bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
            return bytes;
        }

        // Helper to get image extension from dataUrl
        function getImageExt(dataUrl) {
            let m = dataUrl.match(/^data:image\/(\w+)/);
            return m ? m[1].replace("jpeg", "jpg") : "png";
        }

        // Try to use JSZip if available, otherwise fall back to individual downloads
        try {
            // Dynamically load JSZip from CDN
            if (typeof JSZip === "undefined") {
                await new Promise((resolve, reject) => {
                    let s = document.createElement("script");
                    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
                    s.onload = resolve;
                    s.onerror = reject;
                    document.head.appendChild(s);
                });
            }

            let zip = new JSZip();
            zip.file("character_description.md", characterMdText);
            zip.file("world.md", worldMdText);
            zip.file(loreFilename, loreJsonStr);

            if (charImageUrl && charImageUrl.startsWith("data:")) {
                let ext = getImageExt(charImageUrl);
                zip.file(`${safeName}.${ext}`, dataUrlToBytes(charImageUrl));
            }
            if (worldImageUrl && worldImageUrl.startsWith("data:")) {
                let ext = getImageExt(worldImageUrl);
                zip.file(`${worldSafeName}.${ext}`, dataUrlToBytes(worldImageUrl));
            }

            let zipBlob = await zip.generateAsync({ type: "blob" });
            let a = document.createElement("a");
            a.href = URL.createObjectURL(zipBlob);
            a.download = `${safeName}_archive.zip`;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (e) {
            console.warn("JSZip not available, falling back to individual downloads:", e);
            // Fallback: download each file individually
            function downloadText(text, filename, mimeType) {
                let blob = new Blob([text], { type: mimeType });
                let a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                a.click();
                URL.revokeObjectURL(a.href);
            }
            function downloadDataUrl(dataUrl, filename) {
                let a = document.createElement("a");
                a.href = dataUrl;
                a.download = filename;
                a.click();
            }
            downloadText(characterMdText, "character_description.md", "text/markdown");
            setTimeout(() => downloadText(worldMdText, "world.md", "text/markdown"), 300);
            setTimeout(() => downloadText(loreJsonStr, loreFilename, "application/json"), 600);
            if (charImageUrl) { setTimeout(() => downloadDataUrl(charImageUrl, `${safeName}.${getImageExt(charImageUrl)}`), 900); }
            if (worldImageUrl) { setTimeout(() => downloadDataUrl(worldImageUrl, `${worldSafeName}.${getImageExt(worldImageUrl)}`), 1200); }
            alert("JSZip library could not be loaded. Files will be downloaded individually.");
        }
    };


    var TypewriterStreamer = class TypewriterStreamer {
        constructor(element, options = {}) {
            this.element = element;
            this.speed = options.speed || 15; // default ms per character

            this.queue = [];
            this.typedText = "";
            this.isTyping = false;
            this.onComplete = options.onComplete || null;
            this.cursor = null;
            this.createCursor();
            
            this.completionPromise = new Promise(resolve => {
                this.resolveCompletion = resolve;
            });
        }

        createCursor() {
            this.cursor = document.createElement("span");
            this.cursor.className = "typed-cursor";
            this.cursor.innerHTML = "|";
            this.cursor.style.cssText = `
                color: var(--accent-color);
                font-weight: bold;
                display: inline-block;
                margin-left: 2px;
                animation: typedBlink 0.8s infinite;
            `;
            
            if (!document.getElementById("typedBlinkStyles")) {
                let style = document.createElement("style");
                style.id = "typedBlinkStyles";
                style.textContent = `
                    @keyframes typedBlink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        appendTargetText(fullText) {
            if (!fullText) return;
            let processedLength = this.typedText.length + this.queue.length;
            if (fullText.length > processedLength) {
                let newChars = fullText.slice(processedLength);
                this.queue.push(...newChars.split(""));
            }

            if (!this.isTyping && this.queue.length > 0) {
                this.startTyping();
            }
        }

        startTyping() {
            this.isTyping = true;
            this.tick();
        }

        tick() {
            if (this.queue.length === 0) {
                this.isTyping = false;
                if (this.cursor && this.cursor.parentNode) {
                    this.cursor.remove();
                }
                if (this.resolveCompletion) {
                    this.resolveCompletion();
                }
                if (this.onComplete) {
                    this.onComplete();
                }
                return;
            }

            let charsToType = 1;
            let currentSpeed = this.speed;

            if (this.queue.length > 150) {
                charsToType = 4;
                currentSpeed = 3;
            } else if (this.queue.length > 80) {
                charsToType = 3;
                currentSpeed = 5;
            } else if (this.queue.length > 30) {
                charsToType = 2;
                currentSpeed = 8;
            }

            for (let i = 0; i < charsToType; i++) {
                if (this.queue.length > 0) {
                    this.typedText += this.queue.shift();
                }
            }

            let isTextarea = this.element.tagName === "TEXTAREA" || this.element.tagName === "INPUT";
            if (isTextarea) {
                this.element.value = this.typedText + (this.queue.length > 0 ? "|" : "");
                this.element.scrollTop = this.element.scrollHeight;
            } else {
                this.element.innerHTML = formatSectionText(sanitizeOutput(this.typedText));
                this.element.appendChild(this.cursor);
            }

            let mainContent = document.querySelector(".main-content");
            if (mainContent) {
                let isNearBottom = mainContent.scrollHeight - mainContent.scrollTop - mainContent.clientHeight < 120;
                if (isNearBottom) {
                    mainContent.scrollTop = mainContent.scrollHeight;
                }
            }

            setTimeout(() => this.tick(), currentSpeed);
        }

        destroy() {
            this.queue = [];
            this.isTyping = false;
            if (this.cursor && this.cursor.parentNode) {
                this.cursor.remove();
            }
            if (this.resolveCompletion) {
                this.resolveCompletion();
            }
        }
    }

    // ─── INIT ─────────────────────────────────────────────────────────
    updateSavedCountBadge();
    renderSidebar();
    loadDetails();
    window.loadLoreToUI(localStorage.loreText || "");
    setGenerationStatus("");
    
    // Restore active character ID
    window.activeCharacterId = localStorage.activeCharacterId ? (isNaN(Number(localStorage.activeCharacterId)) ? localStorage.activeCharacterId : Number(localStorage.activeCharacterId)) : null;
    
    // Restore generated sections
    try {
        let sections = JSON.parse(localStorage.activeCharacterSections || "{}");
        window.characterSections = sections;
        Object.keys(sections).forEach(s => {
            if (s === "lore") {
                window.loadLoreToUI(sections[s]);
            } else {
                setSectionOutput(s, formatSectionText(sections[s]));
            }
        });
    } catch(e) {
        console.warn("Failed to restore active character sections:", e);
    }
    
    // Restore chosen avatar
    window.selectedAvatarUrl = localStorage.selectedAvatarUrl || "";
    if (window.selectedAvatarUrl) {
        updateProfileAvatar(window.selectedAvatarUrl);
    }
    
    // Restore image generation prompt and keyphrases
    try {
        window.lastCharacterData = JSON.parse(localStorage.lastCharacterData || "null");
    } catch(e) {
        window.lastCharacterData = null;
    }
    window.overwrittenVisualKeyphrasesText = localStorage.overwrittenVisualKeyphrasesText || "";
    window.overwrittenStylePrompt = localStorage.overwrittenStylePrompt || "";
    if (typeof styleOverrideEl !== 'undefined' && styleOverrideEl) {
        if (window.overwrittenStylePrompt) {
            styleOverrideEl.value = window.overwrittenStylePrompt;
        } else {
            updateStyleOverridePlaceholder();
        }
    } else {
        updateStyleOverridePlaceholder();
    }
    
    // Restore generated images
    try {
        let imgUrls = JSON.parse(localStorage.activeImages || "[]");
        if (imgUrls && imgUrls.length > 0) {
            imagesAreaEl.style.display = "block";
            let imageHtml = "";
            imgUrls.forEach(url => {
                let isSelected = (url === window.selectedAvatarUrl) ? " selected-avatar" : "";
                let wrapper = '<div class="image-card-wrapper' + isSelected + '">';
                wrapper += '<img src="' + url + '">';
                wrapper += '<div class="image-card-actions">';
                wrapper += '<button class="image-card-btn primary-btn chooseAvatarBtn" onclick="chooseAsProfileImage(this)"><i class="bi bi-person-bounding-box"></i> Use as Profile</button>';
                
                wrapper += '</div></div>';
                imageHtml += wrapper;
            });
            imagesEl.innerHTML = imageHtml;
            
            // Re-render editable prompt textarea
            let basePrompt = window.overwrittenVisualKeyphrasesText || window.lastCharacterData?.visualKeyphrasesText || "";
            let promptHtml = '<div style="display:flex; flex-direction:column; gap:0.5rem; text-align:left; width:100%; box-sizing:border-box;">';
            promptHtml += '<div><b style="font-size:80%; display:inline-flex; align-items:center; gap:0.3rem;"><i class="bi bi-pencil-fill" style="color:var(--accent-color);"></i> Image Prompt <span style="opacity:0.6;">(editable)</span>:</b>';
            promptHtml += '<textarea oninput="window.overwrittenVisualKeyphrasesText=this.value; saveActiveWorkspaceState();" class="image-tools-textarea" style="min-height:5rem; margin-top:0.25rem;">' + basePrompt + '</textarea></div></div>';
            imagePromptEl.innerHTML = promptHtml;
            updateStyleOverridePlaceholder();
        }
    } catch(e) {
        console.warn("Failed to restore active images:", e);
    }

    if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();

    // ─── LOCAL STORAGE VALUE RESTORATION & DROPDOWN POPULATION (FROM HTML INLINE SCRIPTS) ───
    try {
        let wikiOverrideEl = document.getElementById("wikiOverrideEl");
        if (wikiOverrideEl) wikiOverrideEl.value = localStorage.wikiOverride || "";

        let overviewNotesEl = document.getElementById("overviewNotesEl");
        if (overviewNotesEl) overviewNotesEl.value = localStorage.overviewNotes || "";

        let worldNameEl = document.getElementById("worldNameEl");
        if (worldNameEl) worldNameEl.value = localStorage.worldName || "";

        let worldLoreNotesEl = document.getElementById("worldLoreNotesEl");
        if (worldLoreNotesEl) worldLoreNotesEl.value = localStorage.worldLoreNotes || "";

        let worldLoreEl = document.getElementById("worldLoreEl");
        if (worldLoreEl) {
            worldLoreEl.value = localStorage.worldLore || "";
            if (localStorage.worldLoreImageUrl) {
                let thumb = document.getElementById("worldLoreThumbEl");
                let container = document.getElementById("worldLoreImgContainer");
                if (thumb) thumb.style.backgroundImage = `url(${localStorage.worldLoreImageUrl})`;
                if (container) container.style.display = "flex";
                let bg = document.getElementById("worldLoreBgEl");
                if (bg) bg.style.backgroundImage = `url(${localStorage.worldLoreImageUrl})`;
            }
        }

        let appearanceLengthEl = document.getElementById("appearanceLengthEl");
        if (appearanceLengthEl) appearanceLengthEl.value = localStorage.appearanceLength || appearanceLengthEl.value || "medium";

        let appearanceNotesEl = document.getElementById("appearanceNotesEl");
        if (appearanceNotesEl) appearanceNotesEl.value = localStorage.appearanceNotes || "";

        let visualStyleEl = document.getElementById("visualStyleEl");
        if (visualStyleEl) {
            if (typeof generateVisualStyleOptionsHtml === "function") {
                visualStyleEl.innerHTML = generateVisualStyleOptionsHtml();
            }
            visualStyleEl.value = localStorage.visualStyle || "Fantasy Portrait";
        }

        let imageCountEl = document.getElementById("imageCountEl");
        if (imageCountEl) imageCountEl.value = localStorage.imageCount || imageCountEl.value || "4";

        let roleLengthEl = document.getElementById("roleLengthEl");
        if (roleLengthEl) roleLengthEl.value = localStorage.roleLength || roleLengthEl.value || "medium";

        let roleNotesEl = document.getElementById("roleNotesEl");
        if (roleNotesEl) roleNotesEl.value = localStorage.roleNotes || "";

        let personalityLengthEl = document.getElementById("personalityLengthEl");
        if (personalityLengthEl) personalityLengthEl.value = localStorage.personalityLength || personalityLengthEl.value || "medium";

        let personalityNotesEl = document.getElementById("personalityNotesEl");
        if (personalityNotesEl) personalityNotesEl.value = localStorage.personalityNotes || "";

        let beliefsLengthEl = document.getElementById("beliefsLengthEl");
        if (beliefsLengthEl) beliefsLengthEl.value = localStorage.beliefsLength || beliefsLengthEl.value || "medium";

        let beliefsNotesEl = document.getElementById("beliefsNotesEl");
        if (beliefsNotesEl) beliefsNotesEl.value = localStorage.beliefsNotes || "";

        let preferencesLengthEl = document.getElementById("preferencesLengthEl");
        if (preferencesLengthEl) preferencesLengthEl.value = localStorage.preferencesLength || preferencesLengthEl.value || "medium";

        let preferencesNotesEl = document.getElementById("preferencesNotesEl");
        if (preferencesNotesEl) preferencesNotesEl.value = localStorage.preferencesNotes || "";

        let backgroundLengthEl = document.getElementById("backgroundLengthEl");
        if (backgroundLengthEl) backgroundLengthEl.value = localStorage.backgroundLength || backgroundLengthEl.value || "medium";

        let backgroundNotesEl = document.getElementById("backgroundNotesEl");
        if (backgroundNotesEl) backgroundNotesEl.value = localStorage.backgroundNotes || "";

        let loreNotesEl = document.getElementById("loreNotesEl");
        if (loreNotesEl) loreNotesEl.value = localStorage.loreNotes || "";

        let roleplayLengthEl = document.getElementById("roleplayLengthEl");
        if (roleplayLengthEl) roleplayLengthEl.value = localStorage.roleplayLength || roleplayLengthEl.value || "medium";

        let roleplayNotesEl = document.getElementById("roleplayNotesEl");
        if (roleplayNotesEl) roleplayNotesEl.value = localStorage.roleplayNotes || "";

        let introLengthEl = document.getElementById("introLengthEl");
        if (introLengthEl) introLengthEl.value = localStorage.introLength || introLengthEl.value || "medium";

        let introNotesEl = document.getElementById("introNotesEl");
        if (introNotesEl) introNotesEl.value = localStorage.introNotes || "";

        let ignorePerspectiveToggle = document.getElementById("ignorePerspectiveToggle");
        if (ignorePerspectiveToggle) {
            if (localStorage.getItem("ignorePerspective") !== null) {
                ignorePerspectiveToggle.checked = localStorage.ignorePerspective === "true";
            } else {
                ignorePerspectiveToggle.checked = true; // Default to true
            }
        }

        let settingBanEmDashEl = document.getElementById("settingBanEmDashEl");
        if (settingBanEmDashEl) settingBanEmDashEl.checked = localStorage.getItem("banEmDash") !== "false";

        let settingBanBoldingEl = document.getElementById("settingBanBoldingEl");
        if (settingBanBoldingEl) settingBanBoldingEl.checked = localStorage.getItem("banBolding") === "true";

        let settingCustomBannedEl = document.getElementById("settingCustomBannedEl");
        if (settingCustomBannedEl) settingCustomBannedEl.value = localStorage.customBanned || "";

        let galleryContentEl = document.getElementById('galleryContentEl');
        if (galleryContentEl && typeof root !== 'undefined' && root.image) {
            galleryContentEl.innerHTML = root.image(root.galleryOptions).evaluateItem;
        }
    } catch(err) {
        console.warn("Error running DOM value restorations:", err);
    }

    setTimeout(createCommentsSectionHtml, 100);

