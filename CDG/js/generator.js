/* ===========================
   GENERATION CONTROL LOGIC
=========================== */

window.regenerate = async function () {
    if (window.lastCharacterPromptStreamObj) await window.lastCharacterPromptStreamObj.stop();

    let generateBtn = document.getElementById("generateBtn");
    let stopBtn = document.getElementById("stopBtn");
    let outputEl = document.getElementById("outputEl");
    let mainCastEl = document.getElementById("mainCastEl");

    let mainCastCount = parseInt(mainCastEl ? mainCastEl.value : "1", 10);
    let promptToUse = window.getCharacterPrompt(mainCastCount);

    if (generateBtn) generateBtn.disabled = true;
    if (stopBtn) stopBtn.classList.remove("u-hidden");
    if (generateBtn) generateBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> regenerate description';

    window.lastCharacterPromptStreamObj = window.ai(promptToUse);
    if (outputEl) outputEl.innerHTML = window.lastCharacterPromptStreamObj;

    await window.lastCharacterPromptStreamObj;

    if (stopBtn) stopBtn.classList.add("u-hidden");
    if (generateBtn) generateBtn.disabled = false;

    if (outputEl) {
        window.renderResponseToolbar("outputEl", "regenerate");
        window.CDGStorage.setCache("outputEl", outputEl.innerHTML);
    }
};

window.generateBehavior = async function () {
    let outputEl = document.getElementById("outputEl");
    let behaviorOutputEl = document.getElementById("behaviorOutputEl");
    let generateBehaviorBtn = document.getElementById("generateBehaviorBtn");
    let stopBehaviorBtn = document.getElementById("stopBehaviorBtn");

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    if (!descText) {
        alert("Please generate a character description first!");
        return;
    }

    if (window.lastBehaviorPromptStreamObj) await window.lastBehaviorPromptStreamObj.stop();

    if (generateBehaviorBtn) generateBehaviorBtn.disabled = true;
    if (stopBehaviorBtn) stopBehaviorBtn.classList.remove("u-hidden");
    if (generateBehaviorBtn) generateBehaviorBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> regenerate behavior examples';
    if (behaviorOutputEl) behaviorOutputEl.innerHTML = "";

    window.lastBehaviorPromptStreamObj = window.ai(window.behaviorPrompt);
    if (behaviorOutputEl) behaviorOutputEl.innerHTML = window.lastBehaviorPromptStreamObj;

    await window.lastBehaviorPromptStreamObj;

    if (stopBehaviorBtn) stopBehaviorBtn.classList.add("u-hidden");
    if (generateBehaviorBtn) generateBehaviorBtn.disabled = false;

    if (behaviorOutputEl) {
        window.renderResponseToolbar("behaviorOutputEl", "generateBehavior");
        window.CDGStorage.setCache("behaviorOutputEl", behaviorOutputEl.innerHTML);
    }
};

window.generateScenario = async function () {
    let outputEl = document.getElementById("outputEl");
    let scenarioOutputEl = document.getElementById("scenarioOutputEl");
    let generateScenarioBtn = document.getElementById("generateScenarioBtn");
    let stopScenarioBtn = document.getElementById("stopScenarioBtn");

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    if (!descText) {
        alert("Please generate a character description first!");
        return;
    }

    if (window.lastScenarioPromptStreamObj) await window.lastScenarioPromptStreamObj.stop();

    if (generateScenarioBtn) generateScenarioBtn.disabled = true;
    if (stopScenarioBtn) stopScenarioBtn.classList.remove("u-hidden");
    if (generateScenarioBtn) generateScenarioBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> regenerate scenario description';
    if (scenarioOutputEl) scenarioOutputEl.innerHTML = "";

    window.lastScenarioPromptStreamObj = window.ai(window.scenarioPrompt);
    if (scenarioOutputEl) scenarioOutputEl.innerHTML = window.lastScenarioPromptStreamObj;

    await window.lastScenarioPromptStreamObj;

    if (stopScenarioBtn) stopScenarioBtn.classList.add("u-hidden");
    if (generateScenarioBtn) generateScenarioBtn.disabled = false;

    if (scenarioOutputEl) {
        window.renderResponseToolbar("scenarioOutputEl", "generateScenario");
        window.CDGStorage.setCache("scenarioOutputEl", scenarioOutputEl.innerHTML);
    }
};

window.generateRoleplayStart = async function () {
    let outputEl = document.getElementById("outputEl");
    let roleplayStartOutputEl = document.getElementById("roleplayStartOutputEl");
    let generateRoleplayStartBtn = document.getElementById("generateRoleplayStartBtn");
    let stopRoleplayStartBtn = document.getElementById("stopRoleplayStartBtn");

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    if (!descText) {
        alert("Please generate a character description first!");
        return;
    }

    if (window.lastRoleplayStartPromptStreamObj) await window.lastRoleplayStartPromptStreamObj.stop();

    if (generateRoleplayStartBtn) generateRoleplayStartBtn.disabled = true;
    if (stopRoleplayStartBtn) stopRoleplayStartBtn.classList.remove("u-hidden");
    if (generateRoleplayStartBtn) generateRoleplayStartBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> regenerate roleplay start';
    if (roleplayStartOutputEl) roleplayStartOutputEl.innerHTML = "";

    window.lastRoleplayStartPromptStreamObj = window.ai(window.roleplayStartPrompt);
    if (roleplayStartOutputEl) roleplayStartOutputEl.innerHTML = window.lastRoleplayStartPromptStreamObj;

    await window.lastRoleplayStartPromptStreamObj;

    if (stopRoleplayStartBtn) stopRoleplayStartBtn.classList.add("u-hidden");
    if (generateRoleplayStartBtn) generateRoleplayStartBtn.disabled = false;

    if (roleplayStartOutputEl) {
        window.renderResponseToolbar("roleplayStartOutputEl", "generateRoleplayStart");
        window.CDGStorage.setCache("roleplayStartOutputEl", roleplayStartOutputEl.innerHTML);
    }
};

/* ===========================
   JSON ART CONFIG PARSER & UI RENDERER
=========================== */

window.lastArtConfigData = null;
window.activeArtCharacterIndex = 0;

window.parseArtConfigJson = function(rawText) {
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

window.renderArtConfigUI = function(config) {
    let container = document.getElementById("artConfigViewCtn");
    if (!container || !config) return;

    let type = config.type || "character";
    let html = "";

    if (type === "character") {
        let characters = Array.isArray(config.characters) && config.characters.length > 0
            ? config.characters
            : [{
                name: config.name || "Character",
                gender: config.gender || "",
                race: config.race || "",
                visual_appearance: config.visual_appearance || "",
                outfit: config.outfit || "",
                expression_or_pose: config.expression_or_pose || "",
                visual_keyphrases: config.visual_keyphrases || ""
            }];

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

        let badges = [];
        if (activeChar.gender) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-gender-ambiguous"></i> <strong>Gender:</strong> ${activeChar.gender}</span>`);
        if (activeChar.race) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-person-fill"></i> <strong>Race:</strong> ${activeChar.race}</span>`);
        if (activeChar.outfit) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-person-lines-fill"></i> <strong>Attire:</strong> ${activeChar.outfit}</span>`);
        if (activeChar.expression_or_pose) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-emoji-smile"></i> <strong>Pose:</strong> ${activeChar.expression_or_pose}</span>`);

        html = `
          <div class="c-art-meta-card">
            ${tabHtml}
            <div class="c-art-meta-header">
              <div class="c-art-meta-title"><i class="bi bi-person-bounding-box"></i> ${activeChar.name || 'Character Portrait'}</div>
              <div class="c-art-meta-badges">${badges.join("")}</div>
            </div>
            ${activeChar.visual_appearance ? `<div class="c-art-meta-desc">${activeChar.visual_appearance}</div>` : ''}
            <div class="c-art-prompt-box" style="margin-top:4px;">
              <div class="c-art-prompt-header">
                <span><i class="bi bi-chat-left-text-fill"></i> Visual Keyphrase Prompt:</span>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="c-button c-button--clear c-button--sm" title="Copy visual prompt" onclick="window.copyArtPrompt(this)"><i class="bi bi-clipboard"></i> copy prompt</button>
                </div>
              </div>
              <textarea id="imagePromptTextarea" class="c-art-prompt-textarea" oninput="window.onArtPromptInput(this.value)">${activeChar.visual_keyphrases || ''}</textarea>
            </div>
          </div>
        `;
    } else if (type === "group") {
        let charsPresent = Array.isArray(config.characters_present) ? config.characters_present.join(", ") : (config.characters_present || "");
        let badges = [];
        if (charsPresent) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-people-fill"></i> <strong>Cast:</strong> ${charsPresent}</span>`);
        if (config.setting_and_atmosphere) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-cloud-sun-fill"></i> <strong>Atmosphere:</strong> ${config.setting_and_atmosphere}</span>`);
        if (config.composition) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-aspect-ratio"></i> <strong>Composition:</strong> ${config.composition}</span>`);

        html = `
          <div class="c-art-meta-card">
            <div class="c-art-meta-header">
              <div class="c-art-meta-title"><i class="bi bi-people-fill"></i> ${config.title || 'Group Scene'}</div>
              <div class="c-art-meta-badges">${badges.join("")}</div>
            </div>
            ${config.scene_description ? `<div class="c-art-meta-desc">${config.scene_description}</div>` : ''}
            <div class="c-art-prompt-box" style="margin-top:4px;">
              <div class="c-art-prompt-header">
                <span><i class="bi bi-chat-left-text-fill"></i> Group Visual Keyphrase Prompt:</span>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="c-button c-button--clear c-button--sm" title="Copy visual prompt" onclick="window.copyArtPrompt(this)"><i class="bi bi-clipboard"></i> copy prompt</button>
                </div>
              </div>
              <textarea id="imagePromptTextarea" class="c-art-prompt-textarea" oninput="window.onArtPromptInput(this.value)">${config.visual_keyphrases || ''}</textarea>
            </div>
          </div>
        `;
    } else if (type === "poster") {
        let badges = [];
        if (config.tagline) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-quote"></i> <strong>Tagline:</strong> "${config.tagline}"</span>`);
        if (config.theme_and_atmosphere) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-stars"></i> <strong>Theme:</strong> ${config.theme_and_atmosphere}</span>`);
        if (config.composition) badges.push(`<span class="c-art-meta-badge"><i class="bi bi-aspect-ratio"></i> <strong>Layout:</strong> ${config.composition}</span>`);

        html = `
          <div class="c-art-meta-card">
            <div class="c-art-meta-header">
              <div class="c-art-meta-title"><i class="bi bi-film"></i> ${config.title || 'Story Poster'}</div>
              <div class="c-art-meta-badges">${badges.join("")}</div>
            </div>
            ${config.theme_and_atmosphere ? `<div class="c-art-meta-desc">${config.theme_and_atmosphere}</div>` : ''}
            <div class="c-art-prompt-box" style="margin-top:4px;">
              <div class="c-art-prompt-header">
                <span><i class="bi bi-chat-left-text-fill"></i> Poster Visual Keyphrase Prompt:</span>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="c-button c-button--clear c-button--sm" title="Copy visual prompt" onclick="window.copyArtPrompt(this)"><i class="bi bi-clipboard"></i> copy prompt</button>
                </div>
              </div>
              <textarea id="imagePromptTextarea" class="c-art-prompt-textarea" oninput="window.onArtPromptInput(this.value)">${config.visual_keyphrases || ''}</textarea>
            </div>
          </div>
        `;
    }

    container.innerHTML = html;
};

window.copyArtPrompt = function(btn) {
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

window.selectArtCharacter = function(index) {
    window.activeArtCharacterIndex = index;
    window.overwrittenVisualKeyphrasesText = null;
    if (window.lastArtConfigData) {
        window.renderArtConfigUI(window.lastArtConfigData);
        window.generateImages();
    }
};

window.onArtPromptInput = function(val) {
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
   EXECUTE IMAGE SECTION GENERATION (AI JSON STEP)
=========================== */

window.generateImagesSection = async function () {
    let outputEl = document.getElementById("outputEl");
    let generateImagesBtn = document.getElementById("generateImagesBtn");
    let stopImagesBtn = document.getElementById("stopImagesBtn");
    let regenImagesBtn = document.getElementById("regenImagesBtn");
    let artLoadingBanner = document.getElementById("artLoadingBanner");
    let artLoadingText = document.getElementById("artLoadingText");
    let imageTypeEl = document.getElementById("imageTypeEl");
    let imageType = imageTypeEl ? imageTypeEl.value : "character";

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    if (!descText) {
        alert("Please generate a character description or scenario first!");
        return;
    }

    if (window.lastImageCaptionPromptStreamObj) await window.lastImageCaptionPromptStreamObj.stop();

    if (generateImagesBtn) generateImagesBtn.disabled = true;
    if (stopImagesBtn) stopImagesBtn.classList.remove("u-hidden");
    if (artLoadingBanner) {
        artLoadingBanner.style.display = "flex";
        if (artLoadingText) artLoadingText.innerHTML = `Generating ${imageType} visual settings & prompt...`;
    }

    window.clearOldImageStuff();

    let textToBeSummarized = descText.replace(/\n+/g, " ");

    let promptInstruction = "";
    if (imageType === "character") {
        promptInstruction = `Analyze the character/scenario text below and generate a structured visual prompt configuration for individual character portraits.
You MUST output ONLY a single raw valid JSON object (no markdown formatting, no preamble or trailing text) matching this exact schema:
{
  "type": "character",
  "title": "Character Visual Profile",
  "characters": [
    {
      "name": "Character Name",
      "gender": "Gender",
      "race": "Race or Species",
      "visual_appearance": "Brief summary of physical appearance (hair, eyes, skin, build, distinct traits)",
      "outfit": "Clothing, uniform, armor, or attire details",
      "expression_or_pose": "Characteristic expression, gaze, posture",
      "visual_keyphrases": "rich comma-separated visually descriptive keyphrases for text-to-image AI describing race, gender, age, face, hair, outfit, lighting, textures, cinematic portrait composition"
    }
  ]
}
If the description features multiple main characters / NPCs, include an entry for each main character in the "characters" array.
Text:
---
${textToBeSummarized}
---`;
    } else if (imageType === "group") {
        promptInstruction = `Analyze the character/scenario text below and generate a structured visual prompt configuration for a GROUP SCENE / CAST INTERACTION photo.
You MUST output ONLY a single raw valid JSON object (no markdown formatting, no preamble or trailing text) matching this exact schema:
{
  "type": "group",
  "title": "Group Scene Title",
  "characters_present": ["Character 1", "Character 2"],
  "scene_description": "What is happening between the characters in this scene",
  "setting_and_atmosphere": "The physical environment, mood, lighting, and weather",
  "composition": "Framing and spatial layout of the group (e.g. wide shot, two characters close together, dramatic depth)",
  "visual_keyphrases": "rich comma-separated visually descriptive keyphrases for text-to-image AI capturing the full group together in the environment, physical proximity, interactions, dynamic poses, detailed costumes, atmospheric lighting, high resolution group shot"
}
Do NOT generate separate prompts for individual characters; generate a unified group visual prompt.
Text:
---
${textToBeSummarized}
---`;
    } else if (imageType === "poster") {
        promptInstruction = `Analyze the character/scenario text below and generate a structured visual prompt configuration for a cinematic STORY / MOVIE POSTER.
You MUST output ONLY a single raw valid JSON object (no markdown formatting, no preamble or trailing text) matching this exact schema:
{
  "type": "poster",
  "title": "Story / Scenario Title",
  "tagline": "Compelling short tagline or theme",
  "theme_and_atmosphere": "The overarching mood, emotional stakes, and world atmosphere",
  "composition": "Cinematic poster layout (e.g. dramatic focal points, contrasting lighting, layered background, high-tension atmosphere)",
  "visual_keyphrases": "cinematic movie poster, comma-separated visually descriptive keyphrases for text-to-image AI, dramatic lighting, iconic composition, rich textures, moody ambiance, epic visual storytelling"
}
Text:
---
${textToBeSummarized}
---`;
    }

    let captionObj;
    let captionPrompt = {
        instruction: promptInstruction,
        onChunk: (data) => {
            if (data && data.fullTextSoFar) {
                let partial = window.parseArtConfigJson(data.fullTextSoFar);
                if (partial) {
                    window.lastArtConfigData = partial;
                    window.renderArtConfigUI(partial);
                }
            }
        }
    };

    captionObj = window.ai(captionPrompt);
    window.lastImageCaptionPromptStreamObj = captionObj;

    let responseData = await captionObj;

    if (stopImagesBtn) stopImagesBtn.classList.add("u-hidden");
    if (generateImagesBtn) generateImagesBtn.disabled = false;
    if (artLoadingBanner) artLoadingBanner.style.display = "none";

    if (responseData.stopReason === "user") return;

    let textResult = (responseData && typeof responseData === "object" && responseData.text) ? responseData.text : String(responseData || "");
    let finalConfig = window.parseArtConfigJson(textResult);

    if (!finalConfig) {
        if (imageType === "character") {
            let physicalAppearanceText = ((descText.match(/(?:Physical Appearance|Appearance)\s*[:=]\s*(.+?)\n/s) || [])[1] || "").trim();
            finalConfig = {
                type: "character",
                title: "Character Portrait",
                characters: [{
                    name: "Main Character",
                    gender: "",
                    race: "",
                    visual_appearance: physicalAppearanceText,
                    outfit: "",
                    expression_or_pose: "",
                    visual_keyphrases: textResult.replace(/```(?:json)?|```/g, "").trim().replace(/\n+/g, " ") || physicalAppearanceText || "character portrait, detailed features, cinematic lighting"
                }]
            };
        } else if (imageType === "group") {
            finalConfig = {
                type: "group",
                title: "Group Scene",
                characters_present: ["Main Cast"],
                scene_description: "Cast gathered together in the scenario setting.",
                setting_and_atmosphere: "Atmospheric roleplay setting",
                composition: "Medium wide group composition",
                visual_keyphrases: textResult.replace(/```(?:json)?|```/g, "").trim().replace(/\n+/g, " ") || "group photo of characters together, cinematic lighting, detailed costumes"
            };
        } else {
            finalConfig = {
                type: "poster",
                title: "Story Poster",
                tagline: "A Tale of High Stakes & Unspoken Longing",
                theme_and_atmosphere: "Dramatic cinematic roleplay atmosphere",
                composition: "Iconic cinematic poster arrangement",
                visual_keyphrases: textResult.replace(/```(?:json)?|```/g, "").trim().replace(/\n+/g, " ") || "cinematic story poster, dramatic lighting, high tension, detailed composition"
            };
        }
    }

    window.lastArtConfigData = finalConfig;
    window.activeArtCharacterIndex = 0;
    window.renderArtConfigUI(finalConfig);

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

    if (regenImagesBtn) regenImagesBtn.disabled = false;

    let imageHtml = "";
    for (let i = 0; i < 6; i++) {
        let basePrompt = currentPrompt;
        if (appearanceExtra && i % 2 === 0 && !basePrompt.includes(appearanceExtra)) {
            basePrompt += " - " + appearanceExtra;
        }

        let promptData = {
            prompt: window.addStyleToPrompt(basePrompt),
            negativePrompt: window.addStyleToNegative(""),
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

window.clearOldImageStuff = function () {
    window.overwrittenVisualKeyphrasesText = null;
    window.lastArtConfigData = null;
    window.activeArtCharacterIndex = 0;
    let artConfigViewCtn = document.getElementById("artConfigViewCtn");
    let imagesEl = document.getElementById("imagesEl");
    let regenImagesBtn = document.getElementById("regenImagesBtn");

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

window.generateVisualStyleOptionsHtml = function () {
    if (!window.visualStyles || !window.visualStyles.selectAll) return "";

    function styleScore(style) {
        let fantasy = style["meta:tags"]?.fantasyPortrait || 0;
        let anime = style["meta:tags"]?.basicAnime || 0;
        let anthro = style["meta:tags"]?.furryOil || 0;
        let digital = style["meta:tags"]?.digitalPainting || 0;
        let cinematic = style["meta:tags"]?.cinematic || 0;
        return anime * 1.0 + cinematic * 0.9 + anthro * 0.8 + fantasy * 0.7 + digital * 0.7;
    }

    return window.visualStyles.selectAll.sort((a, b) => styleScore(b) - styleScore(a)).map(s => `<option>${s.getName}</option>`).join("");
};

window.addStyleToPrompt = function (prompt) {
    if (!window.visualStyles) return prompt;
    let visualStyleEl = document.getElementById("visualStyleEl");
    let originalWindowInput = window.input;
    window.input = { description: prompt };
    let result = window.visualStyles[visualStyleEl ? visualStyleEl.value : "default"].prompt.evaluateItem;
    window.input = originalWindowInput;
    return result;
};

window.addStyleToNegative = function (negative) {
    if (!window.visualStyles) return negative;
    let visualStyleEl = document.getElementById("visualStyleEl");
    let originalWindowInput = window.input;
    window.input = { negative };
    let result = window.visualStyles[visualStyleEl ? visualStyleEl.value : "default"].negative.evaluateItem;
    window.input = originalWindowInput;
    return result;
};

/* ===========================
   CHARACTER CHAT EXPORT
=========================== */

window.chatWithCharacterButtonClickHandler = async function (textToImagePluginOutput, buttonEl) {
    let description = window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "";
    let behaviorText = window.lastBehaviorPromptStreamObj ? window.lastBehaviorPromptStreamObj.liveResponseText : "";
    let scenarioText = window.lastScenarioPromptStreamObj ? window.lastScenarioPromptStreamObj.liveResponseText : "";
    let roleplayStartText = window.lastRoleplayStartPromptStreamObj ? window.lastRoleplayStartPromptStreamObj.liveResponseText : "";

    let name = (description.match(/Name\s*[:=]\s*([^\n]+)/) || description.match(/(?:^|\n)([a-zA-Z0-9_ -]+)'s Role/i) || description.match(/Title\s*[:=]\s*([^\n]+)/) || [])[1] || "???";
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
