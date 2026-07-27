/* ===========================
   AI DRIVEN PLOT HOOK & CHARACTER IDEA GENERATOR (VISION ENABLED)
=========================== */

(function() {
  let currentTargetTextareaId = null;
  let activeAiStreamObj = null;
  let selectedImageBlob = null;

  /* ----------------------------------------------------
     IMAGE SELECTION & PREVIEW HELPERS
  ---------------------------------------------------- */
  function setImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    selectedImageBlob = file;

    let previewContainer = document.getElementById("aiIdeaImagePreviewContainer");
    let previewImg = document.getElementById("aiIdeaImagePreviewImg");
    let imageNameEl = document.getElementById("aiIdeaImageName");
    let imageSizeEl = document.getElementById("aiIdeaImageSize");

    if (previewContainer && previewImg && imageNameEl && imageSizeEl) {
      if (previewImg.src && previewImg.src.startsWith("blob:")) {
        URL.revokeObjectURL(previewImg.src);
      }
      previewImg.src = URL.createObjectURL(file);
      imageNameEl.textContent = file.name || "Attached Image";
      imageSizeEl.textContent = Math.round(file.size / 1024) + " KB";
      previewContainer.classList.remove("u-hidden");
    }
  }

  function clearImage() {
    selectedImageBlob = null;
    let previewContainer = document.getElementById("aiIdeaImagePreviewContainer");
    let previewImg = document.getElementById("aiIdeaImagePreviewImg");
    let fileInput = document.getElementById("aiIdeaImageInput");

    if (previewImg && previewImg.src && previewImg.src.startsWith("blob:")) {
      URL.revokeObjectURL(previewImg.src);
      previewImg.src = "";
    }
    if (previewContainer) {
      previewContainer.classList.add("u-hidden");
    }
    if (fileInput) {
      fileInput.value = "";
    }
  }

  /* ----------------------------------------------------
     MODAL HTML GENERATOR & INJECTION
  ---------------------------------------------------- */
  function ensureAiIdeaModalExists() {
    let existingModal = document.getElementById("aiIdeaModalOverlay");
    if (existingModal) return existingModal;

    let overlay = document.createElement("div");
    overlay.id = "aiIdeaModalOverlay";
    overlay.className = "c-dialog-overlay u-hidden";

    overlay.innerHTML = `
      <div class="c-dialog c-ai-modal">
        <div class="c-ai-modal__header">
          <div class="c-ai-modal__header-title">
            <i class="bi bi-stars c-ai-modal__icon"></i>
            <span>AI Idea Generator</span>
          </div>
          <button type="button" class="c-ai-modal__close-btn" onclick="window.closeAiIdeaModal()" title="Close">&times;</button>
        </div>

        <div class="c-ai-modal__body">
          <div class="c-ai-modal__field">
            <label class="c-label c-ai-modal__label">Prompt Ideas / Keywords & Image Context:</label>
            <div class="c-ai-modal__textarea-wrapper" id="aiIdeaDropZone">
              <textarea id="aiIdeaKeywordsInput" class="c-textarea c-ai-modal__textarea" placeholder="Add keywords, ideas, instructions, or paste/drag an image here..."></textarea>
              <div class="c-ai-modal__bot-badge" title="AI Assistant Active"><i class="bi bi-robot"></i></div>
            </div>
          </div>

          <!-- IMAGE ATTACHMENT SECTION -->
          <div class="c-ai-modal__field">
            <div class="c-ai-modal__image-bar">
              <label for="aiIdeaImageInput" class="c-button c-button--sm c-ai-modal__attach-btn">
                <i class="bi bi-image"></i>
                <span>Attach Image (Vision AI)</span>
              </label>
              <input type="file" id="aiIdeaImageInput" accept="image/png, image/jpeg, image/webp" style="display: none;">
              <span class="c-ai-modal__image-hint">PNG, JPG, WebP (~570 tokens)</span>
            </div>

            <div id="aiIdeaImagePreviewContainer" class="c-ai-modal__image-preview-container u-hidden">
              <div class="c-ai-modal__image-preview-card">
                <img id="aiIdeaImagePreviewImg" class="c-ai-modal__image-preview-thumb" src="" alt="Attached Image">
                <div class="c-ai-modal__image-info">
                  <span id="aiIdeaImageName" class="c-ai-modal__image-name">image.png</span>
                  <span id="aiIdeaImageSize" class="c-ai-modal__image-size">0 KB</span>
                </div>
                <button type="button" id="aiIdeaRemoveImageBtn" class="c-ai-modal__remove-img-btn" title="Remove image">&times;</button>
              </div>
            </div>
          </div>

          <div class="c-ai-modal__field">
            <label class="c-label c-ai-modal__label">Response type:</label>
            <select id="aiIdeaResponseTypeSelect" class="c-select c-ai-modal__select">
              <option value="ROLEPLAY PREMISE & CHARACTER OUTLINE">ROLEPLAY PREMISE & CHARACTER OUTLINE</option>
              <option value="BEHAVIOR & INTERACTION SCENARIO">BEHAVIOR & INTERACTION SCENARIO</option>
              <option value="WORLD & SCENARIO CONTEXT">WORLD & SCENARIO CONTEXT</option>
              <option value="ROLEPLAY START OPENING HOOK">ROLEPLAY START OPENING HOOK</option>
            </select>
          </div>
        </div>

        <div class="c-dialog__footer c-ai-modal__footer">
          <button type="button" class="c-button c-button--md" onclick="window.closeAiIdeaModal()">Cancel</button>
          <button type="button" id="aiIdeaGenerateBtn" class="c-button c-button--md c-button--primary" onclick="window.executeAiIdeaGeneration()">Generate</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Bind File Input listener
    let fileInput = overlay.querySelector("#aiIdeaImageInput");
    if (fileInput) {
      fileInput.addEventListener("change", function(e) {
        if (e.target.files && e.target.files[0]) {
          setImage(e.target.files[0]);
        }
      });
    }

    // Bind Remove Image listener
    let removeBtn = overlay.querySelector("#aiIdeaRemoveImageBtn");
    if (removeBtn) {
      removeBtn.addEventListener("click", clearImage);
    }

    // Bind Paste Event (Clipboard Image)
    let keywordsInput = overlay.querySelector("#aiIdeaKeywordsInput");
    if (keywordsInput) {
      keywordsInput.addEventListener("paste", function(e) {
        let items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
        if (!items) return;
        for (let item of items) {
          if (item.type.indexOf("image") === 0) {
            let blob = item.getAsFile();
            if (blob) {
              setImage(blob);
              e.preventDefault();
              break;
            }
          }
        }
      });
    }

    // Bind Drag & Drop Event
    let dropZone = overlay.querySelector("#aiIdeaDropZone");
    if (dropZone) {
      ["dragenter", "dragover"].forEach(evtName => {
        dropZone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add("is-dragover");
        });
      });
      ["dragleave", "drop"].forEach(evtName => {
        dropZone.addEventListener(evtName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove("is-dragover");
        });
      });
      dropZone.addEventListener("drop", (e) => {
        let files = e.dataTransfer?.files;
        if (files && files[0] && files[0].type.startsWith("image/")) {
          setImage(files[0]);
        }
      });
    }

    return overlay;
  }

  /* ----------------------------------------------------
     OPEN / CLOSE MODAL CONTROLLERS
  ---------------------------------------------------- */
  window.openAiIdeaModal = function(targetTextareaId) {
    currentTargetTextareaId = targetTextareaId;
    let overlay = ensureAiIdeaModalExists();

    let targetEl = document.getElementById(targetTextareaId);
    let keywordsInput = document.getElementById("aiIdeaKeywordsInput");
    let responseTypeSelect = document.getElementById("aiIdeaResponseTypeSelect");

    clearImage();
    
    if (keywordsInput) {
      keywordsInput.value = targetEl ? targetEl.value : "";
    }

    if (responseTypeSelect) {
      if (targetTextareaId === "customBehaviorFeaturesEl") {
        responseTypeSelect.value = "BEHAVIOR & INTERACTION SCENARIO";
      } else if (targetTextareaId === "customScenarioFeaturesEl") {
        responseTypeSelect.value = "WORLD & SCENARIO CONTEXT";
      } else if (targetTextareaId === "customRoleplayStartFeaturesEl") {
        responseTypeSelect.value = "ROLEPLAY START OPENING HOOK";
      } else {
        responseTypeSelect.value = "ROLEPLAY PREMISE & CHARACTER OUTLINE";
      }
    }

    overlay.classList.remove("u-hidden");
    if (keywordsInput) keywordsInput.focus();
  };

  window.closeAiIdeaModal = function() {
    if (activeAiStreamObj && typeof activeAiStreamObj.stop === "function") {
      activeAiStreamObj.stop();
    }
    activeAiStreamObj = null;

    clearImage();

    let overlay = document.getElementById("aiIdeaModalOverlay");
    if (overlay) overlay.classList.add("u-hidden");

    let generateBtn = document.getElementById("aiIdeaGenerateBtn");
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.innerHTML = "Generate";
    }
  };

  /* ----------------------------------------------------
     EXECUTE GENERATION VIA PERCHANCE AI PLUGIN
  ---------------------------------------------------- */
  window.executeAiIdeaGeneration = async function() {
    let keywordsInput = document.getElementById("aiIdeaKeywordsInput");
    let responseTypeSelect = document.getElementById("aiIdeaResponseTypeSelect");
    let generateBtn = document.getElementById("aiIdeaGenerateBtn");
    let targetEl = document.getElementById(currentTargetTextareaId);

    let keywords = keywordsInput ? keywordsInput.value.trim() : "";
    let responseType = responseTypeSelect ? responseTypeSelect.value : "ROLEPLAY PREMISE & CHARACTER OUTLINE";
    let hasImage = !!selectedImageBlob;

    if (!targetEl) {
      window.closeAiIdeaModal();
      return;
    }

    // Build prompt based on selected response type, keywords, and image vision context
    let visionHint = hasImage ? " Analyze and incorporate visual details, clothing, setting, expression, or atmosphere from the provided image." : "";
    let instructionPrompt = "";

    if (responseType === "ROLEPLAY PREMISE & CHARACTER OUTLINE") {
      instructionPrompt = `Write a short, single-paragraph roleplay premise & character outline note based on ${keywords ? `these ideas/keywords: "${keywords}"` : 'the provided content'}.${visionHint} Focus on the basic identity of the character/cast, their core personality, background, and initial roleplay premise. Write ONLY one short, concise paragraph under 3 sentences.`;
    } else if (responseType === "BEHAVIOR & INTERACTION SCENARIO") {
      instructionPrompt = `Write a short, single-paragraph behavior/dialogue context note based on ${keywords ? `these ideas/keywords: "${keywords}"` : 'the provided content'}.${visionHint} Focus on specific behavioral traits, speech habits, emotional triggers, or interaction scenarios (e.g. an interaction demonstrating their yandere side, protective instinct, or witty banter). Write ONLY one short, concise paragraph under 3 sentences.`;
    } else if (responseType === "WORLD & SCENARIO CONTEXT") {
      instructionPrompt = `Write a short, single-paragraph world & scenario context note based on ${keywords ? `these ideas/keywords: "${keywords}"` : 'the provided content'}.${visionHint} Focus on the world setting, atmosphere, ongoing conflict, why the cast has gathered, and the initial situation involving {{user}}. Write ONLY one short, concise paragraph under 3 sentences.`;
    } else {
      instructionPrompt = `Write a short, single-paragraph opening hook note based on ${keywords ? `these ideas/keywords: "${keywords}"` : 'the provided content'}.${visionHint} Focus on the opening scene setup, the character's initial greeting attitude, direct action hook, and starting momentum for the roleplay start. Write ONLY one short, concise paragraph under 3 sentences.`;
    }

    let instructionPayload = hasImage ? [instructionPrompt, selectedImageBlob] : instructionPrompt;

    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<i class="bi bi-stars"></i> Generating...';
    }

    try {
      if (typeof window.ai === "function") {
        activeAiStreamObj = window.ai({
          instruction: instructionPayload,
          onChunk: (data) => {
            if (targetEl) {
              targetEl.value = data.fullTextSoFar;
              targetEl.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
        });

        let result = await activeAiStreamObj;
        if (result && result.text) {
          targetEl.value = result.text.trim();
          targetEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
      } else {
        // Fallback for non-Perchance environments
        targetEl.value = `[AI Generated ${responseType}${hasImage ? ' + Image Analysis' : ''}]: A mysterious traveler with a veiled past wanders the misty high moors, seeking a forgotten heirloom that holds the key to an ancient kingdom.`;
        targetEl.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
    } finally {
      window.closeAiIdeaModal();
      targetEl.classList.add("u-highlight-pulse");
      setTimeout(() => targetEl.classList.remove("u-highlight-pulse"), 600);
    }
  };
})();
