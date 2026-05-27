(function() {
    // ─── INITIAL STATE ───
    window.sheetsState = null;
    window.currentSheetCharacterId = "active";
    window.activeSheetStream = null;

    // Load active sheet data from localStorage immediately on startup if it exists
    if (localStorage.activeSheetData) {
        try {
            window.sheetsState = JSON.parse(localStorage.activeSheetData);
        } catch(e) {
            window.sheetsState = null;
        }
    }

    // ─── HELPERS ───
    
    // Unified helper to extract active or saved character details and prose
    function getSelectedCharacterData() {
        let selector = document.getElementById("sheetCharacterSelector");
        let val = selector ? selector.value : (window.currentSheetCharacterId || "active");
        
        if (val === "active") {
            let d = {};
            if (typeof window.getDetailsContext === "function") {
                d = window.getDetailsContext();
            } else {
                d = {
                    name: document.getElementById("detailNameEl")?.value || "",
                    age: document.getElementById("detailAgeEl")?.value || "",
                    gender: document.getElementById("detailGenderEl")?.value || "",
                    orientation: document.getElementById("detailOrientationEl")?.value || "",
                    species: document.getElementById("detailRaceEl")?.value || "",
                    ethnicity: document.getElementById("detailEthnicityEl")?.value || ""
                };
            }
            return {
                isSaved: false,
                id: "active",
                name: d.name || "Unknown",
                age: d.age || "",
                gender: d.gender || "",
                species: d.species || d.race || "",
                ethnicity: d.ethnicity || "",
                orientation: d.orientation || "",
                role: window.getSectionText("role") || "",
                personality: window.getSectionText("personality") || "",
                beliefs: window.getSectionText("beliefs") || "",
                preferences: window.getSectionText("preferences") || "",
                appearance: window.getSectionText("appearance") || "",
                background: window.getSectionText("background") || "",
                lore: window.getSectionText("lore") || "",
                roleplay: window.getSectionText("roleplay") || "",
                introScenario: window.getSectionText("introScenario") || "",
                introStart: window.getSectionText("introStart") || "",
                selectedAvatarUrl: window.selectedAvatarUrl || "",
                activeImages: (function() {
                    let imgUrls = [];
                    document.querySelectorAll("#imagesEl img").forEach(img => {
                        if (img.src) imgUrls.push(img.src);
                    });
                    return imgUrls;
                })()
            };
        } else {
            let saved = JSON.parse(localStorage.savedCharacters || "[]");
            let idVal = isNaN(Number(val)) ? val : Number(val);
            let c = saved.find(x => x.id === idVal);
            if (!c) return null;
            let d = c.details || {};
            return {
                isSaved: true,
                id: c.id,
                name: c.name || d.name || "Unknown",
                age: d.age || "",
                gender: d.gender || "",
                species: d.species || d.race || "",
                ethnicity: d.ethnicity || "",
                orientation: d.orientation || "",
                role: c.roleText || "",
                personality: c.personalityText || "",
                beliefs: c.beliefsText || "",
                preferences: c.preferencesText || "",
                appearance: c.appearanceText || "",
                background: c.backgroundText || "",
                lore: c.loreText || "",
                roleplay: c.roleplayText || "",
                introScenario: c.introScenarioText || "",
                introStart: c.introStartText || "",
                selectedAvatarUrl: c.selectedAvatarUrl || c.imageDataUrl || "",
                activeImages: c.activeImages || (c.imageDataUrl ? [c.imageDataUrl] : [])
            };
        }
    }

    // Silently persists the current sheetsState to storage
    window.autoSaveSheet = function() {
        if (!window.sheetsState) return;
        let selector = document.getElementById("sheetCharacterSelector");
        let val = selector ? selector.value : (window.currentSheetCharacterId || "active");
        
        if (val === "active") {
            localStorage.activeSheetData = JSON.stringify(window.sheetsState);
        } else {
            let saved = JSON.parse(localStorage.savedCharacters || "[]");
            let idVal = isNaN(Number(val)) ? val : Number(val);
            let idx = saved.findIndex(x => x.id === idVal);
            if (idx !== -1) {
                saved[idx].sheetData = window.sheetsState;
                localStorage.savedCharacters = JSON.stringify(saved);
            }
        }
    };

    // ─── TAB RENDER & CONTROL ───
    
    window.renderSheetTab = function() {
        let selector = document.getElementById("sheetCharacterSelector");
        if (!selector) return;
        
        // Rebuild character choices dropdown options
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let currentVal = window.currentSheetCharacterId || window.activeCharacterId || "active";
        
        // Check if currentVal is actually inside the saved list, else fall back to active
        if (currentVal !== "active") {
            let idVal = isNaN(Number(currentVal)) ? currentVal : Number(currentVal);
            if (!saved.some(c => c.id === idVal)) {
                currentVal = "active";
            }
        }
        
        let optionsHtml = `<option value="active">-- Active Workspace Character --</option>`;
        saved.forEach(c => {
            optionsHtml += `<option value="${c.id}">${c.name}</option>`;
        });
        
        selector.innerHTML = optionsHtml;
        selector.value = currentVal;
        window.currentSheetCharacterId = currentVal;
        
        // Load sheetsState based on selector choice
        loadSheetDataForSelection(currentVal);
        
        // Render content grid
        renderSheetContent();
        
        // Set the color theme dot active state
        let theme = (window.sheetsState && window.sheetsState.theme) || "emerald";
        document.querySelectorAll(".sheet-theme-dot").forEach(dot => {
            dot.classList.remove("active");
        });
        let activeDot = document.getElementById("sheet-theme-dot-" + theme);
        if (activeDot) activeDot.classList.add("active");
    };

    function loadSheetDataForSelection(val) {
        if (val === "active") {
            if (localStorage.activeSheetData) {
                try {
                    window.sheetsState = JSON.parse(localStorage.activeSheetData);
                } catch(e) {
                    window.sheetsState = null;
                }
            } else {
                window.sheetsState = null;
            }
        } else {
            let saved = JSON.parse(localStorage.savedCharacters || "[]");
            let idVal = isNaN(Number(val)) ? val : Number(val);
            let c = saved.find(x => x.id === idVal);
            if (c && c.sheetData) {
                window.sheetsState = c.sheetData;
            } else {
                window.sheetsState = null;
            }
        }
    }

    window.loadCharacterForSheet = function(val) {
        window.currentSheetCharacterId = val;
        loadSheetDataForSelection(val);
        renderSheetContent();
        
        // Update theme dot highlights to match the selected sheet's cached theme
        let theme = (window.sheetsState && window.sheetsState.theme) || "emerald";
        document.querySelectorAll(".sheet-theme-dot").forEach(dot => {
            dot.classList.remove("active");
        });
        let activeDot = document.getElementById("sheet-theme-dot-" + theme);
        if (activeDot) activeDot.classList.add("active");
    };

    window.setSheetTheme = function(theme) {
        if (!window.sheetsState) return;
        window.sheetsState.theme = theme;
        autoSaveSheet();
        
        let container = document.getElementById("sheetContentCtn");
        if (container) {
            container.className = "sheet-container theme-" + theme;
        }
        
        document.querySelectorAll(".sheet-theme-dot").forEach(dot => {
            dot.classList.remove("active");
        });
        let activeDot = document.getElementById("sheet-theme-dot-" + theme);
        if (activeDot) activeDot.classList.add("active");
    };

    // Renders the structured data inside sheetsState into HTML
    function renderSheetContent() {
        let container = document.getElementById("sheetContentCtn");
        if (!container) return;
        
        if (!window.sheetsState) {
            let charData = getSelectedCharacterData();
            let charName = charData ? charData.name : "Active Character";
            container.innerHTML = `
                <div style="padding: 3rem 1.5rem; text-align: center; border: 2px dashed var(--panel-border); border-radius: 12px; background: rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;">
                    <div style="font-size: 3rem; opacity: 0.6; color: var(--accent-color);"><i class="bi bi-file-earmark-person"></i></div>
                    <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600;">No Character Sheet Generated</h3>
                    <p style="margin: 0; color: var(--text-muted); font-size: 90%; max-width: 420px; line-height: 1.5;">
                        Generate a premium visual character sheet dashboard for <b>${charName}</b>. AI will parse the unstructured prose details from the Characters tab.
                    </p>
                    <button onclick="generateSheet()" class="btn btn-primary" style="margin-top: 0.5rem; padding: 0.6rem 1.2rem; font-size: 90%;"><i class="bi bi-sparkles"></i> Generate Sheet (AI)</button>
                </div>
            `;
            return;
        }
        
        let theme = window.sheetsState.theme || "emerald";
        container.className = "sheet-container theme-" + theme;
        container.innerHTML = renderSheetMarkup(false);
    };

    // ─── GENERATE AI SHEET ───
    
    window.generateSheet = async function() {
        let charData = getSelectedCharacterData();
        if (!charData) {
            alert("Could not load character data.");
            return;
        }
        
        let genBtn = document.getElementById("sheetGenBtn");
        let stopBtn = document.getElementById("sheetStopBtn");
        let statusEl = document.getElementById("sheetStatusEl");
        let container = document.getElementById("sheetContentCtn");
        
        if (genBtn) genBtn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";
        
        if (statusEl) {
            statusEl.innerHTML = `<span class="generating-pulse" style="display:inline-flex; align-items:center; gap:0.4rem; color:var(--accent-color); font-weight:500;"><i class="bi bi-hourglass-split"></i> AI is analyzing character prose and structuring sheet...</span>`;
        }
        
        if (container) {
            container.innerHTML = `
                <div style="padding: 5rem 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;">
                    <div class="generating-pulse" style="font-size: 3rem; color: var(--accent-color);"><i class="bi bi-sparkles"></i></div>
                    <h3 style="margin: 0; font-size: 1.1rem; font-weight: 500;">Structuring character sheet...</h3>
                    <p style="margin: 0; color: var(--text-muted); font-size: 85%;">Parsing details. This may take 10-20 seconds.</p>
                </div>
            `;
        }
        
        let prompt = `You are a character design parsing assistant. Analyze the character data below and return a structured JSON character sheet dashboard.
If details are missing, extrapolate them logically based on the character's gender, species, setting, and background.

INPUT CHARACTER PROFILE:
Name: ${charData.name}
Age: ${charData.age}
Gender: ${charData.gender}
Species/Race: ${charData.species}
Ethnicity: ${charData.ethnicity}
Orientation: ${charData.orientation}

Appearance & Attire:
${charData.appearance}

Personality & Behavior:
${charData.personality}

Role & Rules:
${charData.role}

Beliefs & Morals:
${charData.beliefs}

Preferences & Romance:
${charData.preferences}

Background & Goals:
${charData.background}

World Setting & Lore:
${charData.lore}

Dialogue Examples:
${charData.roleplay}

Intro Scenario Context:
${charData.introScenario}

Intro Start Script:
${charData.introStart}

JSON FORMAT TO RETURN (DO NOT return anything except this JSON object, wrapped in a \`\`\`json block):
{
  "tagline": "A short, catchy, thematic tagline or quotes summarizing the character, max 80 characters.",
  "summary": "A concise overview summarizing the character's narrative concept, personality, and background, max 300 characters.",
  "identity": {
    "name": "${charData.name}",
    "species": "Species or race",
    "age": "Age",
    "gender": "Gender / Pronouns",
    "orientation": "Sexual orientation",
    "occupation": "Occupation or main function",
    "status": "Alive, active, or deceased",
    "affiliation": "Factions, groups, or key associations"
  },
  "physical": {
    "height": "Height in metric or imperial",
    "build": "Build / body description",
    "hair": "Hair color and style",
    "eyes": "Eye color and shape",
    "features": "Scar, tattoos, accessories, or other distinguishing marks",
    "style": "Attire style, clothing details, or armor"
  },
  "psychology": {
    "mbti": "MBTI personality type (e.g. INFJ, ENTJ)",
    "alignment": "Moral alignment (e.g. Chaotic Good, Lawful Evil)",
    "motive": "Core motivation or goal",
    "likes": "Three things they like, comma-separated",
    "dislikes": "Three things they dislike, comma-separated",
    "fears": "Fears, phobias, or core vulnerabilities",
    "summary": "Brief summary of personality traits"
  },
  "inventory": [
    "Item 1: Brief desc",
    "Item 2: Brief desc",
    "Item 3: Brief desc"
  ],
  "relations": [
    "Name 1 (Relationship): Brief description of dynamic",
    "Name 2 (Relationship): Brief description of dynamic"
  ],
  "lore": [
    "Interesting historical or setting fact 1",
    "Interesting historical or setting fact 2",
    "Interesting historical or setting fact 3"
  ],
  "scenario": {
    "context": "Context of their starting roleplay scene",
    "speakingStyle": "Speaking style, quirks, or accents"
  }
}
`;

        try {
            window.activeSheetStream = window.ai({ instruction: prompt });
            let response = await window.activeSheetStream;
            window.activeSheetStream = null;
            
            if (genBtn) genBtn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            
            let rawText = response.text || "";
            let parsed = null;
            
            if (typeof window.parseLoreJSON === "function") {
                parsed = window.parseLoreJSON(rawText);
            } else {
                let jsonMatch = rawText.match(/\{[\s\S]*\}/);
                let cleaned = jsonMatch ? jsonMatch[0] : rawText.replace(/```json|```/g, "").trim();
                parsed = JSON.parse(cleaned);
            }
            
            if (parsed) {
                // Link images
                parsed.avatarUrl = charData.selectedAvatarUrl || "";
                parsed.coverUrl = charData.activeImages?.[0] || parsed.avatarUrl || "";
                parsed.physicalUrl = charData.activeImages?.[1] || "";
                parsed.relationsUrl = charData.activeImages?.[2] || "";
                parsed.theme = "emerald";
                
                window.sheetsState = parsed;
                autoSaveSheet();
                renderSheetContent();
                
                if (statusEl) statusEl.innerHTML = `<span>✅ Sheet generated successfully!</span>`;
            } else {
                throw new Error("Could not parse JSON output.");
            }
        } catch(e) {
            window.activeSheetStream = null;
            if (genBtn) genBtn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            if (statusEl) statusEl.innerHTML = `<span style="color: #ef4444;">❌ Failed to generate sheet: ${e.message}</span>`;
            renderSheetContent();
        }
    };

    window.stopSheetGeneration = function() {
        if (window.activeSheetStream) {
            try { window.activeSheetStream.stop(); } catch(e) {}
            window.activeSheetStream = null;
        }
        let genBtn = document.getElementById("sheetGenBtn");
        let stopBtn = document.getElementById("sheetStopBtn");
        if (genBtn) genBtn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
        
        let statusEl = document.getElementById("sheetStatusEl");
        if (statusEl) statusEl.innerHTML = "⛔ Generation stopped by user.";
        renderSheetContent();
    };

    // ─── SAVE SHEET ACTION ───
    
    window.saveSheetData = function() {
        if (!window.sheetsState) {
            alert("Please generate a character sheet first!");
            return;
        }
        
        autoSaveSheet();
        
        // Show premium feedback toast
        let toast = document.createElement('div');
        toast.style = `
            position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
            background: var(--accent-color); color: white; padding: 0.6rem 1.2rem;
            border-radius: 8px; font-size: 85%; z-index: 999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-weight: 500;
            animation: fadeInConfirm 0.2s ease-out;
        `;
        toast.innerHTML = `✅ Saved sheet successfully!`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeInConfirm 0.2s ease-out reverse';
            setTimeout(() => toast.remove(), 180);
        }, 2000);
    };

    // ─── CONTENTEDITABLE INTERACTION CORES ───
    
    window.updateStateField = function(category, fieldName, text) {
        if (window.sheetsState && window.sheetsState[category]) {
            window.sheetsState[category][fieldName] = text;
            autoSaveSheet();
        }
    };

    window.updateStateName = function(text) {
        if (window.sheetsState) {
            if (!window.sheetsState.identity) window.sheetsState.identity = {};
            window.sheetsState.identity.name = text;
            autoSaveSheet();
        }
    };

    window.updateStateTagline = function(text) {
        if (window.sheetsState) {
            window.sheetsState.tagline = text;
            autoSaveSheet();
        }
    };

    window.updateStateSummary = function(text) {
        if (window.sheetsState) {
            window.sheetsState.summary = text;
            autoSaveSheet();
        }
    };

    window.updateBulletState = function(index, listName, text) {
        if (window.sheetsState && window.sheetsState[listName]) {
            window.sheetsState[listName][index] = text;
            autoSaveSheet();
        }
    };

    window.addBulletItem = function(listName) {
        if (!window.sheetsState) return;
        if (!window.sheetsState[listName]) window.sheetsState[listName] = [];
        window.sheetsState[listName].push("New Item");
        autoSaveSheet();
        renderSheetContent();
    };

    window.removeBulletItem = function(listName, index) {
        if (!window.sheetsState) return;
        if (window.sheetsState[listName]) {
            window.sheetsState[listName].splice(index, 1);
            autoSaveSheet();
            renderSheetContent();
        }
    };

    // ─── CUSTOM IMAGE PICKER MODAL ───
    
    window.openImagePicker = function(slotName) {
        let charData = getSelectedCharacterData();
        if (!charData) return;
        let activeImages = charData.activeImages || [];
        
        let overlay = document.createElement('div');
        overlay.className = "image-picker-overlay";
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center;
            z-index: 99999; animation: fadeInConfirm 0.2s ease-out;
        `;
        
        let modal = document.createElement('div');
        modal.style = `
            background: var(--panel-bg);
            border: 1px solid var(--panel-border);
            border-radius: 12px;
            padding: 1.5rem;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.30);
            display: flex;
            flex-direction: column;
            gap: 1rem;
            color: var(--text-main);
            font-family: inherit;
        `;
        
        let title = slotName === 'coverUrl' ? 'Cover Banner' : slotName === 'avatarUrl' ? 'Profile Picture' : slotName === 'physicalUrl' ? 'Physical Portrait' : 'Relations Portrait';
        
        let titleHtml = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--panel-border); padding-bottom:0.5rem;">
                <b style="font-size:110%; display:flex; align-items:center; gap:0.5rem;"><i class="bi bi-image" style="color:var(--accent-color);"></i> Select ${title}</b>
                <button onclick="this.closest('.image-picker-overlay').remove()" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:120%;"><i class="bi bi-x-lg"></i></button>
            </div>
        `;
        
        let imagesGridHtml = "";
        if (activeImages.length === 0) {
            imagesGridHtml = `<div style="padding:2rem; text-align:center; opacity:0.5; font-size:90%;">No generated images found for this character. Generate images in the Characters tab first!</div>`;
        } else {
            imagesGridHtml = `
                <div style="font-size:85%; color:var(--text-muted); margin-bottom:0.5rem;">Select an image from this character's gallery:</div>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(90px, 1fr)); gap:0.75rem; max-height:320px; overflow-y:auto; padding:0.25rem;">
                    ${activeImages.map(img => `
                        <div class="image-picker-thumbnail" onclick="selectImageForSlot('${slotName}', '${img}'); this.closest('.image-picker-overlay').remove();" style="aspect-ratio:1; border-radius:8px; overflow:hidden; border:2px solid var(--panel-border); cursor:pointer; transition:all 0.2s;">
                            <img src="${img}" style="width:100%; height:100%; object-fit:cover;">
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Add picker styling to head if not exists
        if (!document.getElementById('imagePickerStyles')) {
            let style = document.createElement('style');
            style.id = 'imagePickerStyles';
            style.textContent = `
                .image-picker-thumbnail:hover {
                    border-color: var(--accent-color) !important;
                    transform: scale(1.05);
                    box-shadow: 0 4px 10px rgba(var(--accent-color-rgb), 0.3);
                }
            `;
            document.head.appendChild(style);
        }
        
        modal.innerHTML = titleHtml + imagesGridHtml;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    };

    window.selectImageForSlot = function(slotName, imgUrl) {
        if (window.sheetsState) {
            window.sheetsState[slotName] = imgUrl;
            autoSaveSheet();
            renderSheetContent();
        }
    };

    // ─── MARKDOWN & HTML EXPORTING ───
    
    window.copySheetMarkdown = function() {
        if (!window.sheetsState) {
            alert("Please generate a character sheet first!");
            return;
        }
        
        let s = window.sheetsState;
        let md = [];
        
        md.push(`# ${s.identity?.name || 'Character Sheet'}`);
        if (s.tagline) md.push(`*${s.tagline}*`);
        if (s.summary) {
            md.push(`\n## Overview`);
            md.push(s.summary);
        }
        
        // Identity
        md.push(`\n## Identity`);
        md.push(`| Field | Details |`);
        md.push(`| :--- | :--- |`);
        if (s.identity) {
            Object.entries(s.identity).forEach(([k, v]) => {
                md.push(`| ${k.charAt(0).toUpperCase() + k.slice(1)} | ${v} |`);
            });
        }
        
        // Physical
        md.push(`\n## Physical Description`);
        md.push(`| Field | Details |`);
        md.push(`| :--- | :--- |`);
        if (s.physical) {
            Object.entries(s.physical).forEach(([k, v]) => {
                md.push(`| ${k.charAt(0).toUpperCase() + k.slice(1)} | ${v} |`);
            });
        }
        
        // Psychology
        md.push(`\n## Psychology`);
        md.push(`| Field | Details |`);
        md.push(`| :--- | :--- |`);
        if (s.psychology) {
            Object.entries(s.psychology).forEach(([k, v]) => {
                md.push(`| ${k.charAt(0).toUpperCase() + k.slice(1)} | ${v} |`);
            });
        }
        
        // Inventory
        if (s.inventory && s.inventory.length > 0) {
            md.push(`\n## Inventory`);
            s.inventory.forEach(item => {
                md.push(`- ${item}`);
            });
        }
        
        // Relations
        if (s.relations && s.relations.length > 0) {
            md.push(`\n## Relations`);
            s.relations.forEach(rel => {
                md.push(`- ${rel}`);
            });
        }
        
        // Lore
        if (s.lore && s.lore.length > 0) {
            md.push(`\n## Lore & Setting Facts`);
            s.lore.forEach(fact => {
                md.push(`- ${fact}`);
            });
        }
        
        // Scenario
        if (s.scenario) {
            md.push(`\n## Scenario & Dialogue Quirks`);
            if (s.scenario.context) md.push(`- **Context**: ${s.scenario.context}`);
            if (s.scenario.speakingStyle) md.push(`- **Speaking Style**: ${s.scenario.speakingStyle}`);
        }
        
        let mdString = md.join("\n");
        
        navigator.clipboard.writeText(mdString).then(() => {
            let btn = document.getElementById("sheetExportMdBtn");
            if (btn) {
                let origHtml = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
                setTimeout(() => { btn.innerHTML = origHtml; }, 1500);
            }
        }).catch(err => {
            alert("Failed to copy markdown to clipboard.");
        });
    };

    window.exportSheetHTML = function() {
        if (!window.sheetsState) {
            alert("Please generate a character sheet first!");
            return;
        }
        
        let charName = window.sheetsState.identity.name || "Character";
        let theme = window.sheetsState.theme || "emerald";
        
        let cssRules = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
            
            :root {
                --bg-color: #0f111a;
                --panel-bg: #131622;
                --panel-border: #1f2335;
                --text-main: #c0caf5;
                --text-muted: #565f89;
            }
            
            body {
                background-color: var(--bg-color);
                color: var(--text-main);
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 2rem 1rem;
                display: flex;
                justify-content: center;
            }
            
            .sheet-wrapper {
                width: 100%;
                max-width: 900px;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .sheet-container {
                --sheet-accent-color: #10b981;
                --sheet-accent-rgb: 16, 185, 129;
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .sheet-container.theme-emerald { --sheet-accent-color: #10b981; --sheet-accent-rgb: 16, 185, 129; }
            .sheet-container.theme-cyberpunk { --sheet-accent-color: #ff007f; --sheet-accent-rgb: 255, 0, 127; }
            .sheet-container.theme-sunset { --sheet-accent-color: #f59e0b; --sheet-accent-rgb: 245, 158, 11; }
            .sheet-container.theme-sapphire { --sheet-accent-color: #3b82f6; --sheet-accent-rgb: 59, 130, 246; }
            .sheet-container.theme-crimson { --sheet-accent-color: #ef4444; --sheet-accent-rgb: 239, 68, 68; }
            .sheet-container.theme-amethyst { --sheet-accent-color: #7c3aed; --sheet-accent-rgb: 124, 58, 237; }
            
            .sheet-banner-wrapper {
                width: 100%;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid var(--panel-border);
                position: relative;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .sheet-cover-banner {
                width: 100%;
                height: 220px;
                background-size: cover;
                background-position: center 25%;
                position: relative;
                display: flex;
                align-items: flex-end;
                justify-content: center;
            }
            
            .sheet-cover-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(to bottom, rgba(15, 17, 26, 0.1) 0%, rgba(15, 17, 26, 0.85) 100%);
            }
            
            .sheet-banner-name {
                font-family: 'Outfit', sans-serif;
                font-size: 2.8rem;
                font-weight: 800;
                letter-spacing: 0.15em;
                color: #ffffff;
                text-transform: uppercase;
                z-index: 2;
                margin-bottom: 1.25rem;
                text-align: center;
                text-shadow: 0 0 15px rgba(var(--sheet-accent-rgb), 0.6), 0 2px 4px rgba(0,0,0,0.8);
            }
            
            .sheet-profile-card {
                background: var(--panel-bg);
                border: 1px solid var(--panel-border);
                border-radius: 12px;
                padding: 1.5rem;
                display: flex;
                gap: 1.5rem;
                align-items: center;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                flex-wrap: wrap;
            }
            
            .sheet-profile-avatar {
                width: 130px;
                height: 195px;
                border-radius: 8px;
                background-size: cover;
                background-position: center;
                border: 2px solid var(--sheet-accent-color);
                box-shadow: 0 0 15px rgba(var(--sheet-accent-rgb), 0.3);
                flex-shrink: 0;
            }
            
            .sheet-profile-info {
                flex: 1;
                min-width: 200px;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .sheet-tagline {
                font-size: 1.05rem;
                font-weight: 500;
                font-style: italic;
                color: var(--sheet-accent-color);
                line-height: 1.4;
            }
            
            .sheet-summary {
                font-size: 92%;
                color: var(--text-main);
                line-height: 1.6;
            }
            
            .sheet-dashboard-grid {
                display: grid;
                grid-template-columns: 1fr 1.2fr;
                gap: 1.5rem;
                width: 100%;
            }
            
            @media (max-width: 820px) {
                .sheet-dashboard-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            .sheet-card {
                background: var(--panel-bg);
                border: 1px solid var(--panel-border);
                border-radius: 12px;
                padding: 1.25rem 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                border-top: 4px solid var(--sheet-accent-color);
                box-sizing: border-box;
            }
            
            .sheet-card-header {
                font-size: 1.05rem;
                font-weight: 700;
                color: #ffffff;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                border-bottom: 1px solid var(--panel-border);
                padding-bottom: 0.5rem;
            }
            
            .sheet-card-header span {
                color: #ffffff;
            }
            
            .sheet-card-header i {
                color: var(--sheet-accent-color);
            }
            
            .sheet-field-list {
                display: flex;
                flex-direction: column;
                gap: 0.6rem;
            }
            
            .sheet-field-row {
                display: grid;
                grid-template-columns: 100px 1fr;
                align-items: flex-start;
                gap: 0.75rem;
                font-size: 88%;
            }
            
            .sheet-field-label {
                font-weight: 600;
                color: var(--sheet-accent-color);
                text-transform: uppercase;
                font-size: 80%;
                letter-spacing: 0.05em;
                padding-top: 0.1rem;
            }
            
            .sheet-field-value {
                color: var(--text-main);
                line-height: 1.4;
            }
            
            .sheet-bullet-list {
                display: flex;
                flex-direction: column;
                gap: 0.6rem;
                margin: 0;
                padding-left: 1.1rem;
            }
            
            .sheet-bullet-item {
                font-size: 88%;
                color: var(--text-main);
                line-height: 1.5;
                margin-bottom: 0.25rem;
            }
            
            .sheet-card-image {
                width: 100%;
                height: 180px;
                border-radius: 8px;
                background-size: cover;
                background-position: center;
                border: 1px solid var(--panel-border);
                margin-bottom: 0.5rem;
            }
            
            .sheet-gallery-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
                gap: 0.75rem;
                width: 100%;
            }
            
            .sheet-gallery-card {
                aspect-ratio: 2/3;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid var(--panel-border);
                position: relative;
                background: rgba(0,0,0,0.2);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .sheet-gallery-card img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        `;
        
        let htmlContent = renderSheetMarkup(true);
        
        let fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${charName} - Character Sheet</title>
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        ${cssRules}
    </style>
</head>
<body>
    <div class="sheet-wrapper">
        <div class="sheet-container theme-${theme}">
            ${htmlContent}
        </div>
    </div>
</body>
</html>`;

        let blob = new Blob([fullHtml], { type: "text/html" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${charName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_sheet.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // ─── UNIFIED SHEET MARKUP BUILDER ───
    
    function renderSheetMarkup(isStatic) {
        if (!window.sheetsState) return "";
        
        let s = window.sheetsState;
        let editAttr = isStatic ? "" : "contenteditable='true'";
        
        let placeholderBanner = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80";
        let placeholderAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80";
        
        let coverImg = s.coverUrl || placeholderBanner;
        let avatarImg = s.avatarUrl || placeholderAvatar;
        
        let identityHtml = `
            <div class="sheet-card">
                <div class="sheet-card-header">
                    <i class="bi bi-person-fill"></i>
                    <span>Identity</span>
                </div>
                <div class="sheet-field-list">
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Name</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('identity', 'name', this.innerText)">${s.identity?.name || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Species</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('identity', 'species', this.innerText)">${s.identity?.species || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Age</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('identity', 'age', this.innerText)">${s.identity?.age || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Gender</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('identity', 'gender', this.innerText)">${s.identity?.gender || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Orientation</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('identity', 'orientation', this.innerText)">${s.identity?.orientation || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Occupation</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('identity', 'occupation', this.innerText)">${s.identity?.occupation || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Status</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('identity', 'status', this.innerText)">${s.identity?.status || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Affiliation</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('identity', 'affiliation', this.innerText)">${s.identity?.affiliation || ''}</div>
                    </div>
                </div>
            </div>
        `;
        
        let physicalHtml = `
            <div class="sheet-card">
                <div class="sheet-card-header">
                    <i class="bi bi-eye-fill"></i>
                    <span>Physical</span>
                </div>
                ${s.physicalUrl ? `<div class="sheet-card-image" style="background-image: url('${s.physicalUrl}')" ${isStatic ? "" : "onclick='openImagePicker(\"physicalUrl\")'"} title="${isStatic ? "" : "Click to change physical card image"}"></div>` : (isStatic ? "" : `<div style="padding:1rem; border:1px dashed var(--panel-border); border-radius:8px; text-align:center; cursor:pointer; font-size:80%; color:var(--text-muted);" onclick="openImagePicker('physicalUrl')"><i class="bi bi-image"></i> Select portrait image</div>`)}
                <div class="sheet-field-list">
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Height</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('physical', 'height', this.innerText)">${s.physical?.height || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Build</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('physical', 'build', this.innerText)">${s.physical?.build || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Hair</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('physical', 'hair', this.innerText)">${s.physical?.hair || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Eyes</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('physical', 'eyes', this.innerText)">${s.physical?.eyes || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Features</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('physical', 'features', this.innerText)">${s.physical?.features || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Style</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('physical', 'style', this.innerText)">${s.physical?.style || ''}</div>
                    </div>
                </div>
            </div>
        `;
        
        let psychologyHtml = `
            <div class="sheet-card">
                <div class="sheet-card-header">
                    <i class="bi bi-brain-fill"></i>
                    <span>Psychology</span>
                </div>
                <div class="sheet-field-list">
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">MBTI</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('psychology', 'mbti', this.innerText)">${s.psychology?.mbti || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Alignment</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('psychology', 'alignment', this.innerText)">${s.psychology?.alignment || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Motive</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('psychology', 'motive', this.innerText)">${s.psychology?.motive || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Likes</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('psychology', 'likes', this.innerText)">${s.psychology?.likes || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Dislikes</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('psychology', 'dislikes', this.innerText)">${s.psychology?.dislikes || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Fears</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('psychology', 'fears', this.innerText)">${s.psychology?.fears || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Summary</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('psychology', 'summary', this.innerText)">${s.psychology?.summary || ''}</div>
                    </div>
                </div>
            </div>
        `;
        
        let inventoryList = s.inventory || [];
        let inventoryHtml = `
            <div class="sheet-card">
                <div class="sheet-card-header" style="justify-content: space-between; align-items: center;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <i class="bi bi-briefcase-fill"></i>
                        <span>Inventory</span>
                    </div>
                    ${isStatic ? "" : `<button class="btn btn-ghost btn-sm" onclick="addBulletItem('inventory')" style="padding:0.1rem 0.3rem;"><i class="bi bi-plus-lg"></i></button>`}
                </div>
                <ul class="sheet-bullet-list">
                    ${inventoryList.map((item, idx) => `
                        <li style="position:relative; list-style-type:square; font-size:88%;">
                            <span class="sheet-bullet-item" ${editAttr} onblur="updateBulletState(${idx}, 'inventory', this.innerText)">${item}</span>
                            ${isStatic ? "" : `<button onclick="removeBulletItem('inventory', ${idx})" style="background:transparent; border:none; color:#f87171; cursor:pointer; font-size:75%; padding:0; margin-left:0.3rem; opacity:0.6;"><i class="bi bi-x-lg"></i></button>`}
                        </li>
                    `).join('')}
                    ${!isStatic && inventoryList.length === 0 ? `<li style="list-style:none; opacity:0.5; font-size:80%;">Empty. Click + to add.</li>` : ""}
                </ul>
            </div>
        `;
        
        let relationsList = s.relations || [];
        let relationsHtml = `
            <div class="sheet-card">
                <div class="sheet-card-header" style="justify-content: space-between; align-items: center;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <i class="bi bi-people-fill"></i>
                        <span>Relations</span>
                    </div>
                    ${isStatic ? "" : `<button class="btn btn-ghost btn-sm" onclick="addBulletItem('relations')" style="padding:0.1rem 0.3rem;"><i class="bi bi-plus-lg"></i></button>`}
                </div>
                ${s.relationsUrl ? `<div class="sheet-card-image" style="background-image: url('${s.relationsUrl}')" ${isStatic ? "" : "onclick='openImagePicker(\"relationsUrl\")'"} title="${isStatic ? "" : "Click to change relations image"}"></div>` : (isStatic ? "" : `<div style="padding:1rem; border:1px dashed var(--panel-border); border-radius:8px; text-align:center; cursor:pointer; font-size:80%; color:var(--text-muted);" onclick="openImagePicker('relationsUrl')"><i class="bi bi-image"></i> Select relations image</div>`)}
                <ul class="sheet-bullet-list">
                    ${relationsList.map((item, idx) => `
                        <li style="position:relative; list-style-type:square; font-size:88%;">
                            <span class="sheet-bullet-item" ${editAttr} onblur="updateBulletState(${idx}, 'relations', this.innerText)">${item}</span>
                            ${isStatic ? "" : `<button onclick="removeBulletItem('relations', ${idx})" style="background:transparent; border:none; color:#f87171; cursor:pointer; font-size:75%; padding:0; margin-left:0.3rem; opacity:0.6;"><i class="bi bi-x-lg"></i></button>`}
                        </li>
                    `).join('')}
                    ${!isStatic && relationsList.length === 0 ? `<li style="list-style:none; opacity:0.5; font-size:80%;">Empty. Click + to add.</li>` : ""}
                </ul>
            </div>
        `;
        
        let loreList = s.lore || [];
        let loreHtml = `
            <div class="sheet-card">
                <div class="sheet-card-header" style="justify-content: space-between; align-items: center;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <i class="bi bi-journal-bookmark-fill"></i>
                        <span>Lore</span>
                    </div>
                    ${isStatic ? "" : `<button class="btn btn-ghost btn-sm" onclick="addBulletItem('lore')" style="padding:0.1rem 0.3rem;"><i class="bi bi-plus-lg"></i></button>`}
                </div>
                <ul class="sheet-bullet-list">
                    ${loreList.map((item, idx) => `
                        <li style="position:relative; list-style-type:square; font-size:88%;">
                            <span class="sheet-bullet-item" ${editAttr} onblur="updateBulletState(${idx}, 'lore', this.innerText)">${item}</span>
                            ${isStatic ? "" : `<button onclick="removeBulletItem('lore', ${idx})" style="background:transparent; border:none; color:#f87171; cursor:pointer; font-size:75%; padding:0; margin-left:0.3rem; opacity:0.6;"><i class="bi bi-x-lg"></i></button>`}
                        </li>
                    `).join('')}
                    ${!isStatic && loreList.length === 0 ? `<li style="list-style:none; opacity:0.5; font-size:80%;">Empty. Click + to add.</li>` : ""}
                </ul>
            </div>
        `;
        
        let scenarioHtml = `
            <div class="sheet-card">
                <div class="sheet-card-header">
                    <i class="bi bi-chat-quote-fill"></i>
                    <span>Scenario & Dialogue</span>
                </div>
                <div class="sheet-field-list">
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Context</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('scenario', 'context', this.innerText)">${s.scenario?.context || ''}</div>
                    </div>
                    <div class="sheet-field-row">
                        <div class="sheet-field-label">Speaking Style</div>
                        <div class="sheet-field-value" ${editAttr} onblur="updateStateField('scenario', 'speakingStyle', this.innerText)">${s.scenario?.speakingStyle || ''}</div>
                    </div>
                </div>
            </div>
        `;
        
        let charData = getSelectedCharacterData();
        let activeImages = charData ? charData.activeImages : [];
        
        let galleryHtml = `
            <div class="sheet-card">
                <div class="sheet-card-header">
                    <i class="bi bi-images"></i>
                    <span>Gallery</span>
                </div>
                <div class="sheet-gallery-grid">
                    ${activeImages.map(img => `
                        <div class="sheet-gallery-card">
                            <img src="${img}">
                        </div>
                    `).join('')}
                    ${activeImages.length === 0 ? `<div style="grid-column: 1/-1; padding:1.5rem; text-align:center; opacity:0.5; font-size:80%;">No gallery images found.</div>` : ""}
                </div>
            </div>
        `;
        
        let headerHtml = `
            <div class="sheet-banner-wrapper">
                <div class="sheet-cover-banner" style="background-image: url('${coverImg}')" ${isStatic ? "" : "onclick='openImagePicker(\"coverUrl\")'"} title="${isStatic ? "" : "Click to change cover image"}">
                    <div class="sheet-cover-overlay"></div>
                    <div class="sheet-banner-name" ${editAttr} onblur="updateStateName(this.innerText)">${s.identity?.name || 'UNNAMED'}</div>
                </div>
            </div>
            
            <div class="sheet-profile-card">
                <div class="sheet-profile-avatar" style="background-image: url('${avatarImg}')" ${isStatic ? "" : "onclick='openImagePicker(\"avatarUrl\")'"} title="${isStatic ? "" : "Click to change profile picture"}"></div>
                <div class="sheet-profile-info">
                    <div class="sheet-tagline" ${editAttr} onblur="updateStateTagline(this.innerText)">${s.tagline || 'Click to add tagline...'}</div>
                    <div class="sheet-summary" ${editAttr} onblur="updateStateSummary(this.innerText)">${s.summary || 'Click to add character overview summary...'}</div>
                </div>
            </div>
        `;
        
        let bodyHtml = `
            <div class="sheet-dashboard-grid">
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    ${identityHtml}
                    ${physicalHtml}
                    ${psychologyHtml}
                    ${inventoryHtml}
                </div>
                <div style="display:flex; flex-direction:column; gap:1.5rem;">
                    ${relationsHtml}
                    ${loreHtml}
                    ${scenarioHtml}
                    ${galleryHtml}
                </div>
            </div>
        `;
        
        return headerHtml + bodyHtml;
    }
})();
