/* ===========================
   AI DRIVEN PLOT HOOK & CHARACTER IDEA GENERATOR
=========================== */

(function() {
  let currentTargetTextareaId = null;
  let activeAiStreamObj = null;

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
          Let the AI generate a full prompt based on your ideas:
        </div>

        <div class="c-ai-modal__textarea-wrapper">
          <textarea id="aiIdeaKeywordsInput" class="c-textarea c-ai-modal__textarea" placeholder="Add keywords/ideas/instructions here..."></textarea>
          <div class="c-ai-modal__bot-badge" title="AI Assistant Active"><i class="bi bi-robot"></i></div>
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

        <div class="c-ai-modal__tip">
          <b>Tip:</b> Optimize prompts with the <a href="https://perchance.org/image-prompt-optimizer" target="_blank" class="c-ai-modal__tip-link">Image Prompt Optimizer</a>.
        </div>

        <div class="c-dialog__footer c-ai-modal__footer">
          <button type="button" class="c-button c-button--md" onclick="window.closeAiIdeaModal()">Cancel</button>
          <button type="button" id="aiIdeaGenerateBtn" class="c-button c-button--md c-button--primary" onclick="window.executeAiIdeaGeneration()">Generate</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
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

    if (!targetEl) {
      window.closeAiIdeaModal();
      return;
    }

    // Build prompt based on selected response type and target notes field
    let instructionPrompt = "";
    if (responseType === "ROLEPLAY PREMISE & CHARACTER OUTLINE") {
      instructionPrompt = `Write a short, single-paragraph roleplay premise & character outline note based on these ideas/keywords: "${keywords || 'creative character concept'}". Focus on the basic identity of the character/cast, their core personality, background, and initial roleplay premise. Write ONLY one short, concise paragraph under 3 sentences.`;
    } else if (responseType === "BEHAVIOR & INTERACTION SCENARIO") {
      instructionPrompt = `Write a short, single-paragraph behavior/dialogue context note based on these ideas/keywords: "${keywords || 'character behavior scenario'}". Focus on specific behavioral traits, speech habits, emotional triggers, or interaction scenarios (e.g. an interaction demonstrating their yandere side, protective instinct, or witty banter). Write ONLY one short, concise paragraph under 3 sentences.`;
    } else if (responseType === "WORLD & SCENARIO CONTEXT") {
      instructionPrompt = `Write a short, single-paragraph world & scenario context note based on these ideas/keywords: "${keywords || 'roleplay world context'}". Focus on the world setting, atmosphere, ongoing conflict, why the cast has gathered, and the initial situation involving {{user}}. Write ONLY one short, concise paragraph under 3 sentences.`;
    } else {
      instructionPrompt = `Write a short, single-paragraph opening hook note based on these ideas/keywords: "${keywords || 'roleplay opening hook'}". Focus on the opening scene setup, the character's initial greeting attitude, direct action hook, and starting momentum for the roleplay start. Write ONLY one short, concise paragraph under 3 sentences.`;
    }

    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<i class="bi bi-stars"></i> Generating...';
    }

    try {
      if (typeof window.ai === "function") {
        activeAiStreamObj = window.ai({
          instruction: instructionPrompt,
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
        targetEl.value = `[AI Generated ${responseType}]: A mysterious traveler with a veiled past wanders the misty high moors, seeking a forgotten heirloom that holds the key to an ancient kingdom.`;
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
