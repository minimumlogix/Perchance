/* ===========================
   GENERATION STATE MANAGEMENT
=========================== */

window.generationStates = {
    desc: "initial",
    scenario: "initial",
    roleplayStart: "initial",
    behavior: "initial",
    images: "initial"
};

window.buttonConfigs = {
    desc: {
        btnId: "generateBtn",
        streamObjKey: "lastCharacterPromptStreamObj",
        initialLabel: '<i class="bi bi-stars"></i> generate description',
        generatingLabel: '<i class="bi bi-stop-circle-fill"></i> stop generation',
        completedLabel: '<i class="bi bi-arrow-clockwise"></i> regenerate description'
    },
    scenario: {
        btnId: "generateScenarioBtn",
        streamObjKey: "lastScenarioPromptStreamObj",
        initialLabel: '<i class="bi bi-stars"></i> generate scenario description',
        generatingLabel: '<i class="bi bi-stop-circle-fill"></i> stop generation',
        completedLabel: '<i class="bi bi-arrow-clockwise"></i> regenerate scenario description'
    },
    roleplayStart: {
        btnId: "generateRoleplayStartBtn",
        streamObjKey: "lastRoleplayStartPromptStreamObj",
        initialLabel: '<i class="bi bi-stars"></i> generate roleplay start',
        generatingLabel: '<i class="bi bi-stop-circle-fill"></i> stop generation',
        completedLabel: '<i class="bi bi-arrow-clockwise"></i> regenerate roleplay start'
    },
    behavior: {
        btnId: "generateBehaviorBtn",
        streamObjKey: "lastBehaviorPromptStreamObj",
        initialLabel: '<i class="bi bi-stars"></i> generate behavior examples',
        generatingLabel: '<i class="bi bi-stop-circle-fill"></i> stop generation',
        completedLabel: '<i class="bi bi-arrow-clockwise"></i> regenerate behavior examples'
    },
    images: {
        btnId: "generateImagesBtn",
        streamObjKey: "lastImageCaptionPromptStreamObj",
        initialLabel: '<i class="bi bi-images"></i> generate images',
        generatingLabel: '<i class="bi bi-stop-circle-fill"></i> stop generation',
        completedLabel: '<i class="bi bi-images"></i> generate images'
    }
};

window.setButtonState = function (sectionKey, state) {
    window.generationStates[sectionKey] = state;
    let cfg = window.buttonConfigs[sectionKey];
    if (!cfg) return;
    let btn = document.getElementById(cfg.btnId);
    if (!btn) return;

    if (state === "generating") {
        btn.innerHTML = cfg.generatingLabel;
        btn.classList.add("is-generating", "c-button--stop");
        btn.disabled = false;
    } else if (state === "completed") {
        btn.innerHTML = cfg.completedLabel;
        btn.classList.remove("is-generating", "c-button--stop");
        btn.disabled = false;
    } else { // "initial"
        btn.innerHTML = cfg.initialLabel;
        btn.classList.remove("is-generating", "c-button--stop");
        btn.disabled = false;
    }
};

window.stopSectionGeneration = async function (sectionKey) {
    let cfg = window.buttonConfigs[sectionKey];
    if (!cfg) return;
    let streamObj = window[cfg.streamObjKey];
    if (streamObj && typeof streamObj.stop === "function") {
        await streamObj.stop();
    }
    window.setButtonState(sectionKey, "completed");
};

/* ===========================
   GENERATION CONTROL LOGIC
=========================== */

window.regenerate = async function () {
    if (window.generationStates.desc === "generating") {
        await window.stopSectionGeneration("desc");
        return;
    }

    if (window.lastCharacterPromptStreamObj) await window.lastCharacterPromptStreamObj.stop();

    let outputEl = document.getElementById("outputEl");
    let mainCastEl = document.getElementById("mainCastEl");

    let mainCastCount = parseInt(mainCastEl ? mainCastEl.value : "1", 10);
    let promptToUse = window.getCharacterPrompt(mainCastCount);

    window.setButtonState("desc", "generating");

    window.lastCharacterPromptStreamObj = window.ai(promptToUse);
    if (outputEl) outputEl.innerHTML = window.lastCharacterPromptStreamObj;

    let res = await window.lastCharacterPromptStreamObj;

    window.setButtonState("desc", "completed");

    if (res && res.stopReason === "user") return;

    if (outputEl) {
        window.renderResponseToolbar("outputEl", "regenerate");
        window.CDGStorage.setCache("outputEl", outputEl.innerHTML);
    }
};

window.generateBehavior = async function () {
    if (window.generationStates.behavior === "generating") {
        await window.stopSectionGeneration("behavior");
        return;
    }

    let outputEl = document.getElementById("outputEl");
    let behaviorOutputEl = document.getElementById("behaviorOutputEl");

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    if (!descText) {
        alert("Please generate a character description first!");
        return;
    }

    if (window.lastBehaviorPromptStreamObj) await window.lastBehaviorPromptStreamObj.stop();

    window.setButtonState("behavior", "generating");
    if (behaviorOutputEl) behaviorOutputEl.innerHTML = "";

    window.lastBehaviorPromptStreamObj = window.ai(window.behaviorPrompt);
    if (behaviorOutputEl) behaviorOutputEl.innerHTML = window.lastBehaviorPromptStreamObj;

    let res = await window.lastBehaviorPromptStreamObj;

    window.setButtonState("behavior", "completed");

    if (res && res.stopReason === "user") return;

    if (behaviorOutputEl) {
        window.renderResponseToolbar("behaviorOutputEl", "generateBehavior");
        window.CDGStorage.setCache("behaviorOutputEl", behaviorOutputEl.innerHTML);
    }
};

window.generateScenario = async function () {
    if (window.generationStates.scenario === "generating") {
        await window.stopSectionGeneration("scenario");
        return;
    }

    let outputEl = document.getElementById("outputEl");
    let scenarioOutputEl = document.getElementById("scenarioOutputEl");

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    if (!descText) {
        alert("Please generate a character description first!");
        return;
    }

    if (window.lastScenarioPromptStreamObj) await window.lastScenarioPromptStreamObj.stop();

    window.setButtonState("scenario", "generating");
    if (scenarioOutputEl) scenarioOutputEl.innerHTML = "";

    window.lastScenarioPromptStreamObj = window.ai(window.scenarioPrompt);
    if (scenarioOutputEl) scenarioOutputEl.innerHTML = window.lastScenarioPromptStreamObj;

    let res = await window.lastScenarioPromptStreamObj;

    window.setButtonState("scenario", "completed");

    if (res && res.stopReason === "user") return;

    if (scenarioOutputEl) {
        window.renderResponseToolbar("scenarioOutputEl", "generateScenario");
        window.CDGStorage.setCache("scenarioOutputEl", scenarioOutputEl.innerHTML);
    }
};

window.generateRoleplayStart = async function () {
    if (window.generationStates.roleplayStart === "generating") {
        await window.stopSectionGeneration("roleplayStart");
        return;
    }

    let outputEl = document.getElementById("outputEl");
    let roleplayStartOutputEl = document.getElementById("roleplayStartOutputEl");

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    if (!descText) {
        alert("Please generate a character description first!");
        return;
    }

    if (window.lastRoleplayStartPromptStreamObj) await window.lastRoleplayStartPromptStreamObj.stop();

    window.setButtonState("roleplayStart", "generating");
    if (roleplayStartOutputEl) roleplayStartOutputEl.innerHTML = "";

    window.lastRoleplayStartPromptStreamObj = window.ai(window.roleplayStartPrompt);
    if (roleplayStartOutputEl) roleplayStartOutputEl.innerHTML = window.lastRoleplayStartPromptStreamObj;

    let res = await window.lastRoleplayStartPromptStreamObj;

    window.setButtonState("roleplayStart", "completed");

    if (res && res.stopReason === "user") return;

    if (roleplayStartOutputEl) {
        window.renderResponseToolbar("roleplayStartOutputEl", "generateRoleplayStart");
        window.CDGStorage.setCache("roleplayStartOutputEl", roleplayStartOutputEl.innerHTML);
    }
};

/* ===========================
   JSON ART CONFIG PARSER & UI RENDERER
/* ===========================
   CHARACTER DISCOVERY & EXTRACTION HELPERS
=========================== */

window.lastArtConfigData = null;
window.activeArtCharacterIndex = 0;

window.extractMainCharacterNames = function (descText) {
    if (!descText) return [];
    let names = [];

    // Pattern 1: <NPC>'s Role: (Compact detailed format)
    let roleMatches = descText.matchAll(/(?:^|\n)\s*([a-zA-Z0-9_' -]+)'s Role\s*:/gi);
    for (let m of roleMatches) {
        let name = m[1].replace(/^<|>$/g, "").trim();
        if (name && !names.includes(name)) names.push(name);
    }

    // Pattern 2: Markdown headers # Character Name or ## NPC 1: Name
    let headerMatches = descText.matchAll(/(?:^|\n)\s*#+\s*(?:Main Cast|Main NPCs|NPC\s*\d+\s*[-:]\s*)?([^\n:(=#]+)/gi);
    for (let m of headerMatches) {
        let name = m[1].replace(/^<|>$/g, "").trim();
        let lower = name.toLowerCase();
        if (name && !lower.includes("cast") && !lower.includes("world") && !lower.includes("scenario") && !lower.includes("guidance") && !lower.includes("rules") && !lower.includes("description") && !lower.includes("spoiler") && !names.includes(name)) {
            if (name.length > 1 && name.length < 50) names.push(name);
        }
    }

    // Pattern 3: Name = ...
    let nameMatches = descText.matchAll(/(?:^|\n)\s*Name\s*[:=]\s*([^\n]+)/gi);
    for (let m of nameMatches) {
        let name = m[1].replace(/^<|>$/g, "").trim();
        if (name && !names.includes(name)) names.push(name);
    }

    // Pattern 4: Title = ...
    if (names.length === 0) {
        let titleMatch = descText.match(/(?:^|\n)\s*Title\s*[:=]\s*([^\n]+)/i);
        if (titleMatch) {
            let name = titleMatch[1].replace(/^<|>$/g, "").trim();
            if (name) names.push(name);
        }
    }

    return names;
};

window.extractAppearanceForCharacter = function (descText, charName) {
    if (!descText || !charName) return "";
    let safeName = charName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let m = descText.match(new RegExp(`${safeName}'s Physical Appearance\\s*:\\s*([^\\n]+)`, 'i'))
        || descText.match(/(?:Physical Appearance|Appearance)\s*[:=]\s*(.+?)(?:\n[A-Z]|\n#|$)/s);
    return m ? m[1].trim() : "";
};

window.parseArtConfigJson = function (rawText) {
    if (!rawText) return null;
    let cleaned = rawText.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    try {
        let obj = JSON.parse(cleaned);
        if (obj && typeof obj === "object") return obj;
    } catch (e) {}

    let jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            let obj = JSON.parse(jsonMatch[0]);
            if (obj && typeof obj === "object") return obj;
        } catch (e) {}
    }
    return null;
};

/* ===========================
   ART CONFIG UI RENDERER
=========================== */

window.renderArtConfigUI = function (config) {
    let container = document.getElementById("artConfigViewCtn");
    if (!container || !config) return;

    let type = config.type || "character";
    let html = "";

    if (type === "character") {
        let characters = Array.isArray(config.characters) && config.characters.length > 0
            ? config.characters
            : [{ name: "Main Character", visual_appearance: "", visual_keyphrases: "" }];

        let activeIdx = Math.min(window.activeArtCharacterIndex || 0, characters.length - 1);
        let activeChar = characters[activeIdx] || characters[0];

        let tabHtml = "";
        if (characters.length > 1) {
            tabHtml = `<div class="c-art-tab-bar">` + characters.map((c, i) => `
                <button type="button" class="c-art-tab ${i === activeIdx ? 'is-active' : ''}" onclick="window.selectArtCharacter(${i})">
                  <i class="bi bi-person-badge"></i> ${c.name || ('Character ' + (i + 1))}
                </button>
            `).join("") + `</div>`;
        }

        html = `
          <div class="c-art-meta-card">
            ${tabHtml}
            <div class="c-art-meta-header">
              <div class="c-art-meta-title"><i class="bi bi-person-bounding-box"></i> ${activeChar.name || 'Character Portrait'}</div>
            </div>
            ${activeChar.visual_appearance ? `<div class="c-art-meta-desc">${activeChar.visual_appearance}</div>` : ''}
            <div class="c-art-prompt-box" style="margin-top:4px;">
              <div class="c-art-prompt-header">
                <span><i class="bi bi-chat-left-text-fill"></i> Visual Keyphrase Prompt:</span>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="c-button c-button--clear c-button--sm" title="Regenerate this prompt" onclick="window.generateVisualPromptForActiveTab(undefined, true)"><i class="bi bi-arrow-clockwise"></i> regen prompt</button>
                  <button type="button" class="c-button c-button--clear c-button--sm" title="Copy visual prompt" onclick="window.copyArtPrompt(this)"><i class="bi bi-clipboard"></i> copy prompt</button>
                </div>
              </div>
              <textarea id="imagePromptTextarea" class="c-art-prompt-textarea" placeholder="Generating visual prompt..." oninput="window.onArtPromptInput(this.value)">${activeChar.visual_keyphrases || ''}</textarea>
            </div>
          </div>
        `;
    } else if (type === "group") {
        html = `
          <div class="c-art-meta-card">
            <div class="c-art-meta-header">
              <div class="c-art-meta-title"><i class="bi bi-people-fill"></i> Group Scene</div>
            </div>
            <div class="c-art-prompt-box" style="margin-top:4px;">
              <div class="c-art-prompt-header">
                <span><i class="bi bi-chat-left-text-fill"></i> Group Visual Keyphrase Prompt:</span>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="c-button c-button--clear c-button--sm" title="Regenerate this prompt" onclick="window.generateVisualPromptForActiveTab(undefined, true)"><i class="bi bi-arrow-clockwise"></i> regen prompt</button>
                  <button type="button" class="c-button c-button--clear c-button--sm" title="Copy visual prompt" onclick="window.copyArtPrompt(this)"><i class="bi bi-clipboard"></i> copy prompt</button>
                </div>
              </div>
              <textarea id="imagePromptTextarea" class="c-art-prompt-textarea" placeholder="Generating group visual prompt..." oninput="window.onArtPromptInput(this.value)">${config.visual_keyphrases || ''}</textarea>
            </div>
          </div>
        `;
    } else if (type === "poster") {
        html = `
          <div class="c-art-meta-card">
            <div class="c-art-meta-header">
              <div class="c-art-meta-title"><i class="bi bi-film"></i> Story Poster</div>
            </div>
            <div class="c-art-prompt-box" style="margin-top:4px;">
              <div class="c-art-prompt-header">
                <span><i class="bi bi-chat-left-text-fill"></i> Poster Visual Keyphrase Prompt:</span>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="c-button c-button--clear c-button--sm" title="Regenerate this prompt" onclick="window.generateVisualPromptForActiveTab(undefined, true)"><i class="bi bi-arrow-clockwise"></i> regen prompt</button>
                  <button type="button" class="c-button c-button--clear c-button--sm" title="Copy visual prompt" onclick="window.copyArtPrompt(this)"><i class="bi bi-clipboard"></i> copy prompt</button>
                </div>
              </div>
              <textarea id="imagePromptTextarea" class="c-art-prompt-textarea" placeholder="Generating story poster visual prompt..." oninput="window.onArtPromptInput(this.value)">${config.visual_keyphrases || ''}</textarea>
            </div>
          </div>
        `;
    }

    container.innerHTML = html;
};

window.copyArtPrompt = function (btn) {
    let textarea = document.getElementById("imagePromptTextarea");
    if (!textarea || !textarea.value) return;
    navigator.clipboard.writeText(textarea.value.trim()).then(() => {
        let originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check2"></i> copied!';
        setTimeout(() => {
            btn.innerHTML = originalHtml;
        }, 1800);
    });
};

window.selectArtCharacter = async function (index) {
    window.activeArtCharacterIndex = index;
    window.overwrittenVisualKeyphrasesText = null;
    if (window.lastArtConfigData && window.lastArtConfigData.characters) {
        let activeChar = window.lastArtConfigData.characters[index];
        window.renderArtConfigUI(window.lastArtConfigData);
        if (activeChar && activeChar.visual_keyphrases) {
            window.generateImages();
        } else {
            await window.generateVisualPromptForActiveTab(index);
        }
    }
};

window.onArtPromptInput = function (val) {
    window.overwrittenVisualKeyphrasesText = val;
    if (window.lastArtConfigData) {
        let type = window.lastArtConfigData.type || "character";
        if (type === "character" && Array.isArray(window.lastArtConfigData.characters)) {
            let activeIdx = Math.min(window.activeArtCharacterIndex || 0, window.lastArtConfigData.characters.length - 1);
            if (window.lastArtConfigData.characters[activeIdx]) {
                window.lastArtConfigData.characters[activeIdx].visual_keyphrases = val;
            }
        } else {
            window.lastArtConfigData.visual_keyphrases = val;
        }
    }
};

/* ===========================
   ART STYLE & KEYWORD HELPERS
=========================== */

window.stripArtStyleKeywords = function (prompt) {
    if (!prompt) return "";
    const styleKeywordsRegex = /\b(?:anime|vintage anime|80s anime|retro anime|manga|screentone|manhwa|korean manhwa|webtoon|ghibli|studio ghibli|disney|oil painting|impasto|chiaroscuro|photorealistic|photo|photograph|photography|candid photo|cinematic photo|cinematic film still|cinematic portrait|cinematic lighting|3d render|3d game|unreal engine|cgi|2d game|game sprite|pixel art|8-bit|16-bit|illustration|digital art|drawing|sketch|artwork|masterpiece)\b/gi;
    return prompt
        .replace(styleKeywordsRegex, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\s*,\s*,\s*/g, ", ")
        .replace(/^[\s,]+|[\s,]+$/g, "");
};

window.generateVisualStyleOptionsHtml = function () {
    if (!window.CDG_ART_STYLES) return "";
    return Object.entries(window.CDG_ART_STYLES).map(([key, item]) => 
        `<option value="${key}">${item.name}</option>`
    ).join("");
};

window.addStyleToPrompt = function (prompt) {
    let visualStyleEl = document.getElementById("visualStyleEl");
    let selectedKey = visualStyleEl ? visualStyleEl.value : "painterly_anime";
    let styleObj = (window.CDG_ART_STYLES && window.CDG_ART_STYLES[selectedKey]) || (window.CDG_ART_STYLES && window.CDG_ART_STYLES["painterly_anime"]);
    let suffix = styleObj ? styleObj.promptSuffix : "";
    if (!suffix) return prompt || "";
    return prompt ? `${prompt}, ${suffix}` : suffix;
};

window.addStyleToNegative = function (negative) {
    let visualStyleEl = document.getElementById("visualStyleEl");
    let selectedKey = visualStyleEl ? visualStyleEl.value : "painterly_anime";
    let styleObj = (window.CDG_ART_STYLES && window.CDG_ART_STYLES[selectedKey]) || (window.CDG_ART_STYLES && window.CDG_ART_STYLES["painterly_anime"]);
    let styleNegative = styleObj ? styleObj.negativePrompt : "";
    if (!negative) return styleNegative || "";
    if (!styleNegative) return negative;
    return `${negative}, ${styleNegative}`;
};

/* ===========================
   STEP 1: DISCOVER TABS & START GENERATION
=========================== */

window.generateImagesSection = async function () {
    if (window.generationStates.images === "generating") {
        await window.stopSectionGeneration("images");
        let artLoadingBanner = document.getElementById("artLoadingBanner");
        if (artLoadingBanner) artLoadingBanner.style.display = "none";
        return;
    }

    let outputEl = document.getElementById("outputEl");
    let artLoadingBanner = document.getElementById("artLoadingBanner");
    let artLoadingText = document.getElementById("artLoadingText");
    let imageTypeEl = document.getElementById("imageTypeEl");
    let imageFramingEl = document.getElementById("imageFramingEl");

    let imageType = imageTypeEl ? imageTypeEl.value : "character";
    let imageFraming = imageFramingEl ? imageFramingEl.value : "portrait";

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    if (!descText) {
        alert("Please generate a character description or scenario first!");
        return;
    }

    if (window.lastImageCaptionPromptStreamObj) await window.lastImageCaptionPromptStreamObj.stop();

    window.setButtonState("images", "generating");
    if (artLoadingBanner) {
        artLoadingBanner.style.display = "flex";
        if (artLoadingText) artLoadingText.innerHTML = `Identifying character cast...`;
    }

    window.clearOldImageStuff(false);

    let textToBeSummarized = descText.replace(/\n+/g, " ");

    if (imageType === "character") {
        // Step 1: Extract character names
        let characterNames = window.extractMainCharacterNames(descText);

        if (characterNames.length === 0) {
            // Quick AI JSON array fallback to get names
            try {
                let namesPrompt = {
                    instruction: `Analyze the text below and extract only the names of the main characters/NPCs. Output ONLY a valid JSON array matching this exact schema: {"characters": ["Name 1", "Name 2"]}\n\nText:\n${textToBeSummarized}`
                };
                let resObj = window.ai(namesPrompt);
                window.lastImageCaptionPromptStreamObj = resObj;
                let res = await resObj;
                let raw = (res && res.text) || String(res || "");
                let parsed = window.parseArtConfigJson(raw);
                if (parsed && Array.isArray(parsed.characters)) {
                    characterNames = parsed.characters.map(c => typeof c === "string" ? c : (c.name || "")).filter(Boolean);
                }
            } catch (e) {}
        }

        if (characterNames.length === 0) {
            characterNames = ["Main Character"];
        }

        window.lastArtConfigData = {
            type: "character",
            framing: imageFraming,
            characters: characterNames.map(name => ({
                name: name,
                visual_appearance: window.extractAppearanceForCharacter(descText, name),
                visual_keyphrases: ""
            }))
        };
    } else if (imageType === "group") {
        window.lastArtConfigData = {
            type: "group",
            framing: imageFraming,
            visual_keyphrases: ""
        };
    } else { // poster
        window.lastArtConfigData = {
            type: "poster",
            framing: imageFraming,
            visual_keyphrases: ""
        };
    }

    window.activeArtCharacterIndex = 0;
    window.renderArtConfigUI(window.lastArtConfigData);

    // Step 2: Generate visual prompt for active tab without JSON
    await window.generateVisualPromptForActiveTab(0);
};

/* ===========================
   STEP 2: GENERATE PROMPT FOR TAB (WITHOUT JSON)
=========================== */

window.generateVisualPromptForActiveTab = async function (charIndex, forceRegen = false) {
    let outputEl = document.getElementById("outputEl");
    let imageTypeEl = document.getElementById("imageTypeEl");
    let imageFramingEl = document.getElementById("imageFramingEl");
    let regenImagesBtn = document.getElementById("regenImagesBtn");
    let artLoadingBanner = document.getElementById("artLoadingBanner");
    let artLoadingText = document.getElementById("artLoadingText");

    let imageType = imageTypeEl ? imageTypeEl.value : "character";
    let imageFraming = imageFramingEl ? imageFramingEl.value : "portrait";

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    let textToBeSummarized = descText.replace(/\n+/g, " ");

    let promptInstruction = "";
    let currentActiveChar = null;

    if (imageType === "character") {
        let chars = window.lastArtConfigData && window.lastArtConfigData.characters;
        if (!chars || chars.length === 0) return;
        let idx = Math.min(charIndex !== undefined ? charIndex : (window.activeArtCharacterIndex || 0), chars.length - 1);
        currentActiveChar = chars[idx];

        if (currentActiveChar.visual_keyphrases && !forceRegen) {
            window.setButtonState("images", "completed");
            window.generateImages();
            return;
        }

        let framingText = imageFraming === "fullbody"
            ? "Full body framing (full length head to toe shot). Describe the full figure from head to toe, complete outfit, posture, stance, legs, and footwear."
            : "Portrait framing (upper body / head & shoulders / chest up shot). Focus ONLY on facial details, hair, gaze, facial expression, collar, chest/shoulders, and upper clothing. Do NOT include lower body or shoes.";

        promptInstruction = `You are an AI text-to-image prompt expert. Write a detailed, comma-separated visual keyphrase prompt describing the character "${currentActiveChar.name}" for image generation based on the text below.

Framing requirement: ${framingText}

CRITICAL RULES:
1. Focus ONLY on physical subject features, face, hair, eyes, facial expression, posture, clothing, lighting, textures, and background environment.
2. Output ONLY the raw comma-separated prompt keyphrases in plain text.
3. NEVER output JSON, markdown fences, curly brackets, quotes, or conversational preamble.
4. NEVER include any art style, medium, or rendering keywords (e.g. do NOT include 'anime', 'manga', 'manhwa', 'oil painting', 'photo', 'photorealistic', '3D render', 'CGI', 'pixel art', 'digital art', 'masterpiece', 'cinematic portrait'). The art style will be automatically appended as a suffix.

Text context:
---
${textToBeSummarized}
---`;

        if (artLoadingText) artLoadingText.innerHTML = `Generating visual prompt for ${currentActiveChar.name}...`;
    } else if (imageType === "group") {
        let framingText = imageFraming === "fullbody" ? "full body shot of characters together head to toe" : "medium shot upper body group composition";
        promptInstruction = `You are an AI text-to-image prompt expert. Write a detailed, comma-separated visual keyphrase prompt describing a GROUP SCENE / CAST INTERACTION based on the text below.

Framing requirement: ${framingText}

CRITICAL RULES:
1. Focus ONLY on physical subjects, interaction, poses, costumes, environment, and lighting.
2. Output ONLY the raw comma-separated prompt keyphrases in plain text.
3. NEVER output JSON, markdown fences, curly brackets, quotes, or conversational preamble.
4. NEVER include any art style or rendering medium keywords (e.g. do NOT include 'anime', 'manga', 'oil painting', 'photo', '3D render', 'pixel art', 'digital art', 'masterpiece').

Text context:
---
${textToBeSummarized}
---`;
        if (artLoadingText) artLoadingText.innerHTML = `Generating group scene visual prompt...`;
    } else { // poster
        promptInstruction = `You are an AI text-to-image prompt expert. Write a detailed, comma-separated visual keyphrase prompt describing a cinematic STORY / MOVIE POSTER based on the text below.

CRITICAL RULES:
1. Focus ONLY on symbolic storytelling elements, key characters presence, composition layout, atmospheric lighting, mood, and dramatic background.
2. Output ONLY the raw comma-separated prompt keyphrases in plain text.
3. NEVER output JSON, markdown fences, curly brackets, quotes, or conversational preamble.
4. NEVER include any art style or rendering medium keywords (e.g. do NOT include 'anime', 'manga', 'oil painting', 'photo', '3D render', 'pixel art', 'digital art', 'masterpiece').

Text context:
---
${textToBeSummarized}
---`;
        if (artLoadingText) artLoadingText.innerHTML = `Generating story poster visual prompt...`;
    }

    if (artLoadingBanner) artLoadingBanner.style.display = "flex";
    window.setButtonState("images", "generating");

    let promptTextarea = document.getElementById("imagePromptTextarea");

    let captionObj = window.ai({
        instruction: promptInstruction,
        onChunk: (data) => {
            if (data && data.fullTextSoFar) {
                let cleanText = data.fullTextSoFar.replace(/```(?:json)?|```/g, "").replace(/^[{\["\s]+|[}\]"\s]+$/g, "").trim();
                if (promptTextarea) promptTextarea.value = cleanText;
                if (currentActiveChar) {
                    currentActiveChar.visual_keyphrases = cleanText;
                } else if (window.lastArtConfigData) {
                    window.lastArtConfigData.visual_keyphrases = cleanText;
                }
            }
        }
    });
    window.lastImageCaptionPromptStreamObj = captionObj;

    let res = await captionObj;

    window.setButtonState("images", "completed");
    if (artLoadingBanner) artLoadingBanner.style.display = "none";

    if (res.stopReason === "user") return;

    let rawResult = (res && typeof res === "object" && res.text) ? res.text : String(res || "");
    let finalPrompt = window.stripArtStyleKeywords(rawResult.replace(/```(?:json)?|```/g, "").replace(/^[{\["\s]+|[}\]"\s]+$/g, "").trim());

    if (promptTextarea) promptTextarea.value = finalPrompt;
    if (currentActiveChar) {
        currentActiveChar.visual_keyphrases = finalPrompt;
    } else if (window.lastArtConfigData) {
        window.lastArtConfigData.visual_keyphrases = finalPrompt;
    }

    if (regenImagesBtn) regenImagesBtn.disabled = false;
    window.generateImages();
};

/* ===========================
   IMAGE & GALLERY RENDERING
=========================== */

window.generateImages = function () {
    let imagesEl = document.getElementById("imagesEl");
    let regenImagesBtn = document.getElementById("regenImagesBtn");
    let imagePromptTextarea = document.getElementById("imagePromptTextarea");
    let imageFramingEl = document.getElementById("imageFramingEl");
    let imageFraming = imageFramingEl ? imageFramingEl.value : "portrait";

    let currentPrompt = "";
    let appearanceExtra = "";

    if (window.lastArtConfigData) {
        let type = window.lastArtConfigData.type || "character";
        if (type === "character" && Array.isArray(window.lastArtConfigData.characters)) {
            let activeIdx = Math.min(window.activeArtCharacterIndex || 0, window.lastArtConfigData.characters.length - 1);
            let activeChar = window.lastArtConfigData.characters[activeIdx] || {};
            currentPrompt = window.overwrittenVisualKeyphrasesText || (imagePromptTextarea ? imagePromptTextarea.value.trim() : "") || activeChar.visual_keyphrases || "";
            appearanceExtra = activeChar.visual_appearance || "";
        } else {
            currentPrompt = window.overwrittenVisualKeyphrasesText || (imagePromptTextarea ? imagePromptTextarea.value.trim() : "") || window.lastArtConfigData.visual_keyphrases || "";
        }
    } else if (window.lastCharacterTextData) {
        currentPrompt = window.overwrittenVisualKeyphrasesText || window.lastCharacterTextData.visualKeyphrasesText || "";
        appearanceExtra = window.lastCharacterTextData.physicalAppearanceText || "";
    }

    if (!currentPrompt) return;

    // Clean any accidental style keywords or stray json brackets from the prompt
    currentPrompt = window.stripArtStyleKeywords(currentPrompt.replace(/^[{\["\s]+|[}\]"\s]+$/g, ""));

    // Apply framing guidance
    let framingPrefix = (imageFraming === "fullbody")
        ? "full body shot, full length figure, head to toe"
        : "upper body portrait, chest up, head and shoulders";

    let lowerPrompt = currentPrompt.toLowerCase();
    if (!lowerPrompt.includes("portrait") && !lowerPrompt.includes("full body") && !lowerPrompt.includes("head and shoulders") && !lowerPrompt.includes("full length")) {
        currentPrompt = `${framingPrefix}, ${currentPrompt}`;
    }

    if (regenImagesBtn) regenImagesBtn.disabled = false;

    let imageHtml = "";
    for (let i = 0; i < 6; i++) {
        let basePrompt = currentPrompt;
        if (appearanceExtra && i % 2 === 0 && !basePrompt.includes(appearanceExtra)) {
            basePrompt += " - " + appearanceExtra;
        }

        let styledPrompt = window.addStyleToPrompt(basePrompt);
        let styledNegative = window.addStyleToNegative("");

        let promptData = {
            prompt: styledPrompt,
            negativePrompt: styledNegative,
            resolution: "512x768",
            style: "margin:0.25rem",
        };

        let artId = `a:art-${i}`;
        let reactionPills = (typeof window.renderReactionPillsHtml === "function") ? window.renderReactionPillsHtml(artId) : "";

        imageHtml += `
        <div class="c-art-card" id="artCard-${i}" data-art-id="${artId}">
          <div class="c-art-card-media">
            <div class="c-art-card-tag"><i class="bi bi-image"></i> #${i + 1}</div>
            ${window.image(promptData).evaluateItem}
            <div class="c-art-card-overlay">
              <button class="c-art-card-btn" title="Add Reaction" onclick="window.openChatReactionPicker('${artId}', this)">🙂</button>
              <button class="c-art-card-btn" title="Chat with this character" onclick="window.chatWithCharacterButtonClickHandler(this.closest('.c-art-card').querySelector('iframe').textToImagePluginOutput, this)">💬</button>
              <button class="c-art-card-btn" title="Share to #general" onclick="window.shareArtToGeneral(${i})">↗️</button>
            </div>
          </div>
          <div class="c-art-card-footer">
            <button class="c-art-card-chat-btn" onclick="window.chatWithCharacterButtonClickHandler(this.closest('.c-art-card').querySelector('iframe').textToImagePluginOutput, this)"><i class="bi bi-chat-quote-fill"></i> chat with character</button>
            <div class="c-chat-reactions" id="chatReactions-${artId}">
              ${reactionPills}
            </div>
          </div>
        </div>`;
    }

    if (imagesEl) imagesEl.innerHTML = imageHtml;
};

window.clearOldImageStuff = function (resetButton = true) {
    window.overwrittenVisualKeyphrasesText = null;
    window.lastArtConfigData = null;
    window.activeArtCharacterIndex = 0;
    let artConfigViewCtn = document.getElementById("artConfigViewCtn");
    let imagesEl = document.getElementById("imagesEl");
    let regenImagesBtn = document.getElementById("regenImagesBtn");

    if (resetButton) {
        window.setButtonState("images", "initial");
    }

    if (artConfigViewCtn) artConfigViewCtn.innerHTML = "";
    if (regenImagesBtn) regenImagesBtn.disabled = true;
    if (imagesEl) {
        imagesEl.innerHTML = `
          <div class="c-chat-empty-state" style="grid-column: 1 / -1;">
            <div class="c-chat-empty-icon"><i class="bi bi-palette"></i></div>
            <div class="c-chat-empty-text">No character images generated yet</div>
            <div class="c-chat-empty-subtext">Generate a character description above, then hit 'generate images' to see 6 stylized portraits.</div>
          </div>`;
    }
};

/* ===========================
   CHARACTER CHAT EXPORT
=========================== */

window.chatWithCharacterButtonClickHandler = async function (textToImagePluginOutput, buttonEl) {
    let description = window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "";
    let behaviorText = window.lastBehaviorPromptStreamObj ? window.lastBehaviorPromptStreamObj.liveResponseText : "";
    let scenarioText = window.lastScenarioPromptStreamObj ? window.lastScenarioPromptStreamObj.liveResponseText : "";
    let roleplayStartText = window.lastRoleplayStartPromptStreamObj ? window.lastRoleplayStartPromptStreamObj.liveResponseText : "";

    let name = (window.lastArtConfigData && window.lastArtConfigData.characters && window.lastArtConfigData.characters[window.activeArtCharacterIndex]?.name) || (description.match(/(?:^|\n)\s*([a-zA-Z0-9_' -]+)'s Role\s*:/i) || description.match(/Name\s*[:=]\s*([^\n]+)/) || description.match(/Title\s*[:=]\s*([^\n]+)/) || [])[1] || "???";
    name = name.replace(/^<|>$/g, "").trim();
    let firstName = name.split(/[ ,]/)[0];
    let characterImagePrompt = textToImagePluginOutput.inputs.prompt.replace(/\n/g, " ");
    let characterImageDataUrl = textToImagePluginOutput.dataUrl;

    let roleInstruction = `
  ${description}
  
  ${scenarioText ? `### Scenario Context\n${scenarioText}\n` : ""}
  ${behaviorText ? `### Behavior Examples\n${behaviorText}\n` : ""}
  Creatively improvise the roleplay between {{char}} and {{user}} to create an interesting and engaging experience/story/chat, no matter where {{user}} decides to lead it. The overall goal is to create a genuinely fascinating and engaging roleplay/story. So good that you can't stop reading.
  For roleplays, messages should be detailed and descriptive, including dialogue, actions (enclosed in asterisks), and thoughts. Utilize all five senses for character experiences.
  `.trim();

    let initialMessages = [
        { author: "system", content: `*Introduce yourself to ${name}, or perhaps <b style="color:#00af00;">tap the Narrator button</b> and tell it to generate an initial roleplay scenario based on some keywords/themes. You can change your name using the 'options' button.*`, hiddenFrom: ["ai"] },
    ];
    if (roleplayStartText) {
        initialMessages.push({ author: "char", content: roleplayStartText });
    }

    let json = {
        addCharacter: {
            name,
            roleInstruction,
            reminderMessage: "",
            imagePromptPrefix: "",
            imagePromptSuffix: `${window.addStyleToPrompt("")} (negativePrompt:::${window.addStyleToNegative("")}) (resolution:::512x768)`,
            imagePromptTriggers: `${firstName}: ${characterImagePrompt}`,
            messageWrapperStyle: "",
            customCode: "",
            metaTitle: "",
            metaDescription: "",
            metaImage: "",
            initialMessages,
            loreBookUrls: [],
            avatar: { url: characterImageDataUrl, size: 1, shape: "square" },
            scene: { background: { url: "" }, music: { url: "" } },
            userCharacter: { avatar: {} },
            systemCharacter: { avatar: {} },
        },
        quickAdd: true,
    };

    buttonEl.disabled = true;
    await window.generateShareLinkForCharacter(json);
    buttonEl.disabled = false;
};

window.generateShareLinkForCharacter = async function (json) {
    if (!window.CompressionStream) {
        alert("Character chat links use a feature that's only available in modern browsers. Please upgrade your browser to the latest version to use this feature. If you're using Safari, switch to Chrome instead.");
        return;
    }

    let loadingModal = window.createLoadingModal('<i class="bi bi-hourglass-split"></i> Generating chat link...');
    let jsonString = JSON.stringify(json);
    let dataUrlJsonString = jsonString.replace(/#/g, "%23");
    let blob = await fetch("data:text/plain;charset=utf-8," + dataUrlJsonString).then(res => res.blob());
    let compressedBlob = await window.compressBlobWithGzip(blob);

    let { url, error } = await window.uploadPlugin(compressedBlob);
    if (error) {
        loadingModal.delete();
        alert(`error: ${error}`);
    } else {
        loadingModal.delete();
        let fileName = url.replace("https://user-uploads.perchance.org/file/", "");
        let characterName = encodeURIComponent(json.addCharacter.name.replace(/\s+/g, "_").replaceAll("~", "").replaceAll('"', ""));
        let shareUrl = `https://perchance.org/ai-character-chat?data=${characterName}~${fileName}`;

        await window.prompt2({
            content: { type: "none", html: `<div style="margin-bottom:0.5rem; opacity:0.7; font-size:90%;">Your character has been created. Here's the link:</div><div style="display:flex; gap:0.5rem;"><input value="${shareUrl}" class="c-select" style="flex-grow:1; min-width:0; font-size:80%;"> <button class="c-button c-button--sm" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('input').value); this.textContent='<i class=\"bi bi-check-lg\"></i> copied'; setTimeout(() => { this.textContent='<i class=\"bi bi-clipboard\"></i> copy'; }, 2000);"><i class="bi bi-clipboard"></i> copy</button> <button class="c-button c-button--sm" onclick="window.open(this.parentElement.querySelector('input').value)"><i class="bi bi-box-arrow-up-right"></i> visit</button> </div>` },
        }, { cancelButtonText: null, submitButtonText: "finished", verticallyCenter: true });
    }
};

window.compressBlobWithGzip = async function (blob) {
    const cs = new CompressionStream('gzip');
    const compressedStream = blob.stream().pipeThrough(cs);
    let outputBlob = await new Response(compressedStream).blob();
    return new Blob([outputBlob], { type: "application/gzip" });
};
