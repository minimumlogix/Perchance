/* ===========================
   AI DRIVEN CONCEPT GENERATOR (STRUCTURED JSON & VISION ENABLED)
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
     ROBUST PARSER FOR STREAMED JSON & REGEX FALLBACK
  ---------------------------------------------------- */
  function parseConceptJson(rawText) {
    if (!rawText) return null;
    
    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    try {
      let obj = JSON.parse(cleaned);
      if (obj && typeof obj === "object") return obj;
    } catch (e) {
      // Incomplete JSON during streaming chunk - fallback to regex field extraction
    }

    let result = {};

    let fields = ["roleplay_idea", "behaviour_idea", "scenario_idea", "start_idea"];
    fields.forEach(field => {
      let match = cleaned.match(new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"?`, "s"));
      if (match && match[1]) {
        result[field] = match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      }
    });

    let toneMatch = cleaned.match(/"roleplay_tone"\s*:\s*\[([^\]]*)\]?/s);
    if (toneMatch && toneMatch[1]) {
      let tags = toneMatch[1].match(/"([^"]+)"/g);
      if (tags) {
        result.roleplay_tone = tags.map(t => t.replace(/"/g, "").trim());
      }
    }

    let settingMatch = cleaned.match(/"world_setting"\s*:\s*\[([^\]]*)\]?/s);
    if (settingMatch && settingMatch[1]) {
      let tags = settingMatch[1].match(/"([^"]+)"/g);
      if (tags) {
        result.world_setting = tags.map(t => t.replace(/"/g, "").trim());
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  }

  function applyParsedConcept(parsed) {
    if (!parsed) return;

    // 1. Roleplay Idea (Premise & Character Outline + Detailed Visual Appearance if Image)
    if (parsed.roleplay_idea) {
      let el = document.getElementById("customFeaturesEl");
      if (el) {
        el.value = parsed.roleplay_idea;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    // 2. Behavior Idea
    if (parsed.behaviour_idea) {
      let el = document.getElementById("customBehaviorFeaturesEl");
      if (el) {
        el.value = parsed.behaviour_idea;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    // 3. Scenario Idea
    if (parsed.scenario_idea) {
      let el = document.getElementById("customScenarioFeaturesEl");
      if (el) {
        el.value = parsed.scenario_idea;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    // 4. Start Idea (Roleplay Start Hook)
    if (parsed.start_idea) {
      let el = document.getElementById("customRoleplayStartFeaturesEl");
      if (el) {
        el.value = parsed.start_idea;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    // 5. Roleplay Tone Tags (4 tags)
    if (Array.isArray(parsed.roleplay_tone) && parsed.roleplay_tone.length > 0 && window.toneSelector) {
      let cleanTags = parsed.roleplay_tone.map(t => String(t).trim().toLowerCase().replace(/[\s-]+/g, "_"));
      window.toneSelector.selectedTags = cleanTags.slice(0, 4);
      window.toneSelector.render();
      if (typeof window.toneSelector.onChange === "function") {
        window.toneSelector.onChange(window.toneSelector.selectedTags);
      }
    }

    // 6. World Setting Tags (2 tags)
    if (Array.isArray(parsed.world_setting) && parsed.world_setting.length > 0 && window.worldSettingSelector) {
      let cleanTags = parsed.world_setting.map(t => String(t).trim().toLowerCase().replace(/[\s-]+/g, "_"));
      window.worldSettingSelector.selectedTags = cleanTags.slice(0, 2);
      window.worldSettingSelector.render();
      if (typeof window.worldSettingSelector.onChange === "function") {
        window.worldSettingSelector.onChange(window.worldSettingSelector.selectedTags);
      }
    }
  }

  function pulseHighlightAllFields() {
    const ids = ["customFeaturesEl", "customBehaviorFeaturesEl", "customScenarioFeaturesEl", "customRoleplayStartFeaturesEl", "toneSelectorCtn", "worldSettingSelectorCtn"];
    ids.forEach(id => {
      let el = document.getElementById(id);
      if (el) {
        el.classList.add("u-highlight-pulse");
        setTimeout(() => el.classList.remove("u-highlight-pulse"), 800);
      }
    });
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
            <span>AI Concept Generator (Fills All Notes & Tags)</span>
          </div>
          <button type="button" class="c-ai-modal__close-btn" onclick="window.closeAiIdeaModal()" title="Close">&times;</button>
        </div>

        <div class="c-ai-modal__body">
          <div class="c-ai-modal__field">
            <label class="c-label c-ai-modal__label">Prompt Ideas / Keywords & Image Context:</label>
            <div class="c-ai-modal__textarea-wrapper" id="aiIdeaDropZone">
              <textarea id="aiIdeaKeywordsInput" class="c-textarea c-ai-modal__textarea" placeholder="Add character ideas, themes, or paste/drag an image here..."></textarea>
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
        </div>

        <div class="c-dialog__footer c-ai-modal__footer">
          <button type="button" class="c-button c-button--md" onclick="window.closeAiIdeaModal()">Cancel</button>
          <button type="button" id="aiIdeaGenerateBtn" class="c-button c-button--md c-button--primary" onclick="window.executeAiIdeaGeneration()">Generate Concept</button>
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

    clearImage();
    
    if (keywordsInput) {
      keywordsInput.value = targetEl ? targetEl.value : "";
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
      generateBtn.innerHTML = "Generate Concept";
    }
  };

  /* ----------------------------------------------------
     EXECUTE GENERATION VIA PERCHANCE AI PLUGIN (STRUCTURED JSON)
  ---------------------------------------------------- */
  window.executeAiIdeaGeneration = async function() {
    let keywordsInput = document.getElementById("aiIdeaKeywordsInput");
    let generateBtn = document.getElementById("aiIdeaGenerateBtn");

    let keywords = keywordsInput ? keywordsInput.value.trim() : "";
    let hasImage = !!selectedImageBlob;

    let visionHint = hasImage ? " Analyze and incorporate visual details, clothing, setting, expression, or atmosphere from the provided image." : "";
    
    let instructionPrompt = `Generate a complete, structured roleplay character & scenario concept based on these keywords/ideas: "${keywords || 'creative character concept'}".${visionHint}

You MUST output ONLY a single raw valid JSON object (no markdown formatting, no text before or after JSON) matching this exact schema:
{
  "roleplay_tone": ["tag1", "tag2", "tag3", "tag4"],
  "world_setting": ["tag1", "tag2"],
  "roleplay_idea": "Premise and character outline notes...",
  "behaviour_idea": "Behavior traits, speech habits and interaction scenario notes...",
  "scenario_idea": "World setting context, atmosphere, and scenario outline notes...",
  "start_idea": "Opening scene setup, greeting attitude, and direct action hook notes..."
}

Rules for fields:
1. "roleplay_tone": Array of exactly 4 concise tone tag strings (e.g. ["dark_romance", "flirtatious", "sensual", "dramatic"]).
2. "world_setting": Array of exactly 2 concise setting tag strings (e.g. ["academy_fantasy", "cyberpunk"]).
3. "roleplay_idea": Write a concise character premise and outline note (1-2 paragraphs). ${hasImage ? 'IMPORTANT: Provide an extremely detailed visual appearance description of the character(s) from the image (hair, eyes, facial features, outfit, body type, distinctive details) so the visual design is fully preserved in text without needing the image again, followed by personality and plot concept involving {{user}}.' : 'Include core character identity, appearance highlights, personality, and plot concept involving {{user}}.'}
4. "behaviour_idea": Write a concise note on specific behavioral traits, speech habits, emotional triggers, and interaction scenarios (1 short paragraph).
5. "scenario_idea": Write a concise note on the world context, atmosphere, ongoing conflict, and starting scenario involving {{user}} (1 short paragraph).
6. "start_idea": Write a concise opening hook note with starting scene setup, character's initial attitude, direct greeting/action hook, and roleplay momentum (1 short paragraph).`;

    let instructionPayload = hasImage ? [instructionPrompt, selectedImageBlob] : instructionPrompt;

    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<i class="bi bi-stars"></i> Generating Concept...';
    }

    try {
      if (typeof window.ai === "function") {
        activeAiStreamObj = window.ai({
          instruction: instructionPayload,
          onChunk: (data) => {
            if (data && data.fullTextSoFar) {
              let parsed = parseConceptJson(data.fullTextSoFar);
              if (parsed) applyParsedConcept(parsed);
            }
          }
        });

        let result = await activeAiStreamObj;
        let textResult = (result && typeof result === "object" && result.text) ? result.text : String(result || "");
        let finalParsed = parseConceptJson(textResult);
        if (finalParsed) {
          applyParsedConcept(finalParsed);
        }
      } else {
        // Fallback for non-Perchance offline environments
        let fallbackObj = {
          roleplay_tone: ["dark_romance", "flirtatious", "sensual", "dramatic"],
          world_setting: ["academy_fantasy", "gothic_horror"],
          roleplay_idea: hasImage 
            ? "[AI Image Analysis & Concept]: A solitary spellcaster with silver hair tied back, sharp violet eyes, wearing a gold-trimmed black velvet mage cloak with glowing arcane runes on the collar. Reserved yet fiercely loyal, searching for lost ancestral artifacts."
            : "[AI Generated Concept]: A mysterious traveler with a veiled past wanders the misty high moors, seeking a forgotten heirloom that holds the key to an ancient kingdom.",
          behaviour_idea: "Speaks with quiet confidence, often tilting her head when contemplating. Becomes deeply protective when {{user}} is endangered.",
          scenario_idea: "Set in a decaying academy ruined by past magical conflicts. Tension rises as forbidden relics begin awakening across the campus.",
          start_idea: "The heavy oaken doors burst open as she steps inside from the storm, brushing rain from her cloak before locking eyes with {{user}}."
        };
        applyParsedConcept(fallbackObj);
      }
    } catch (err) {
      console.error("AI Concept Generation Error:", err);
    } finally {
      window.closeAiIdeaModal();
      pulseHighlightAllFields();
    }
  };
})();
