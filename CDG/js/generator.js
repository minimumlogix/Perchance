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
    if (generateBtn) generateBtn.innerHTML = "✨ regenerate description";

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
    if (generateBehaviorBtn) generateBehaviorBtn.innerHTML = "✨ regenerate behavior examples";
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
    if (generateScenarioBtn) generateScenarioBtn.innerHTML = "✨ regenerate scenario description";
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
    if (generateRoleplayStartBtn) generateRoleplayStartBtn.innerHTML = "✨ regenerate roleplay start";
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

window.generateImagesSection = async function () {
    let outputEl = document.getElementById("outputEl");
    let generateImagesBtn = document.getElementById("generateImagesBtn");
    let stopImagesBtn = document.getElementById("stopImagesBtn");
    let imagesAreaEl = document.getElementById("imagesAreaEl");
    let imagePromptEl = document.getElementById("imagePromptEl");
    let regenImagesBtn = document.getElementById("regenImagesBtn");

    let descText = (outputEl && outputEl.innerText.trim()) || (window.lastCharacterPromptStreamObj ? window.lastCharacterPromptStreamObj.liveResponseText : "");
    if (!descText) {
        alert("Please generate a character description first!");
        return;
    }

    if (window.lastImageCaptionPromptStreamObj) await window.lastImageCaptionPromptStreamObj.stop();

    if (generateImagesBtn) generateImagesBtn.disabled = true;
    if (stopImagesBtn) stopImagesBtn.classList.remove("u-hidden");
    if (imagesAreaEl) imagesAreaEl.classList.remove("u-hidden");

    window.clearOldImageStuff();

    let textToBeSummarized = descText.replace(/\n+/g, " ");
    let physicalAppearanceText = ((descText.match(/(?:Physical Appearance|Appearance)\s*[:=]\s*(.+?)\n\n/s) || [])[1] || "").trim();
    if (!physicalAppearanceText) physicalAppearanceText = ((descText.match(/(?:Physical Appearance|Appearance)\s*[:=]\s*(.+?)\n/s) || [])[1] || "").trim();

    let captionObj;
    let captionPrompt = {
        instruction: `Below is a description of a character. Please turn it into a comma-separated list of descriptive keywords and phrases which visually capture this character, including their *gender* (if relevant), race, and **visual appearance**. Be creative and descriptive. Don't be repetitive.\n---\n${textToBeSummarized}\n---\nReply with a comma-separated list of keywords and keyphrases which *visually* capture the above character, including their gender if relevant. Imagine you're giving a list of keywords to an artist who will use them to draw the character. Describe the character's appearance with keywords/keyphrases, including their race, class, age, gender, etc. Respond with only the comma-separated visually descriptive keyphrases - nothing more, nothing less. Don't be repetitive.`,
        onChunk: (data) => {
            if (data.fullTextSoFar.length > 500) {
                let terms = data.fullTextSoFar.split(", ");
                let uniqueTerms = [...new Set(terms)];
                if (terms.length > 2 * uniqueTerms.length) captionObj.stop();
            }
        },
    };

    captionObj = window.ai(captionPrompt);
    window.lastImageCaptionPromptStreamObj = captionObj;
    if (imagePromptEl) imagePromptEl.innerHTML = "<b>Generating image prompt...</b> " + captionObj.loadingIndicatorHtml;

    let responseData = await captionObj;

    if (stopImagesBtn) stopImagesBtn.classList.add("u-hidden");
    if (generateImagesBtn) generateImagesBtn.disabled = false;

    if (responseData.stopReason === "user") return;
    let visualKeyphrasesText = responseData.text.replace(/\n+/g, " ");

    window.lastCharacterTextData = {
        generatedText: descText,
        physicalAppearanceText,
        visualKeyphrasesText,
    };

    if (regenImagesBtn) regenImagesBtn.disabled = false;
    window.generateImages();
};

/* ===========================
   IMAGE & GALLERY HELPERS
=========================== */

window.generateImages = function () {
    if (!window.lastCharacterTextData) return;

    let { generatedText, physicalAppearanceText, visualKeyphrasesText } = window.lastCharacterTextData;
    let imagePromptEl = document.getElementById("imagePromptEl");
    let imagesEl = document.getElementById("imagesEl");

    let imageHtml = "";
    for (let i = 0; i < 6; i++) {
        let basePrompt = window.overwrittenVisualKeyphrasesText || visualKeyphrasesText;
        if (i % 2 === 0) basePrompt += " - " + physicalAppearanceText;

        let promptData = {
            prompt: window.addStyleToPrompt(basePrompt),
            negativePrompt: window.addStyleToNegative(""),
            resolution: "512x768",
            style: "margin:0.25rem",
        };

        imageHtml += `<div class="imageWrapper u-flex u-flex-column u-flex-center u-mb-md">
      ${window.image(promptData).evaluateItem}
      <button class="c-button c-button--sm u-mt-xs" onclick="chatWithCharacterButtonClickHandler(this.closest('.imageWrapper').querySelector('iframe').textToImagePluginOutput, this)">💬 chat with this character</button>
    </div>`;
    }

    if (imagePromptEl) {
        imagePromptEl.innerHTML = `<div class="u-text-left"><b>Image Prompt <span style="opacity:0.6;">(editable)</span>:</b> <textarea class="c-textarea u-mt-xs" oninput="window.overwrittenVisualKeyphrasesText=this.value">${window.overwrittenVisualKeyphrasesText || visualKeyphrasesText}</textarea></div>`;
    }
    if (imagesEl) imagesEl.innerHTML = imageHtml;
};

window.clearOldImageStuff = function () {
    window.overwrittenVisualKeyphrasesText = null;
    let imagesEl = document.getElementById("imagesEl");
    let imagePromptEl = document.getElementById("imagePromptEl");
    if (imagesEl) imagesEl.innerHTML = "";
    if (imagePromptEl) imagePromptEl.innerHTML = "";
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

    let name = (description.match(/Name\s*[:=]\s*(.+)/) || [])[1] || "???";
    let firstName = name.split(/[ ,]/)[0];
    let characterImagePrompt = textToImagePluginOutput.inputs.prompt.replace(/\n/g, " ");
    let characterImageDataUrl = textToImagePluginOutput.dataUrl;

    let roleInstruction = `
  ${description}
  
  ${behaviorText ? `### Behavior Examples\n${behaviorText}\n` : ""}
  ${scenarioText ? `### Scenario Context\n${scenarioText}\n` : ""}
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

    let loadingModal = window.createLoadingModal("⌛ Generating chat link...");
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
            content: { type: "none", html: `<div style="margin-bottom:0.5rem; opacity:0.7; font-size:90%;">Your character has been created. Here's the link:</div><div style="display:flex; gap:0.5rem;"><input value="${shareUrl}" class="c-select" style="flex-grow:1; min-width:0; font-size:80%;"> <button class="c-button c-button--sm" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('input').value); this.textContent='copied ✅'; setTimeout(() => { this.textContent='📋 copy'; }, 2000);">📋 copy</button> <button class="c-button c-button--sm" onclick="window.open(this.parentElement.querySelector('input').value)">↗️ visit</button> </div>` },
        }, { cancelButtonText: null, submitButtonText: "finished", verticallyCenter: true });
    }
};

window.compressBlobWithGzip = async function (blob) {
    const cs = new CompressionStream('gzip');
    const compressedStream = blob.stream().pipeThrough(cs);
    let outputBlob = await new Response(compressedStream).blob();
    return new Blob([outputBlob], { type: "application/gzip" });
};
