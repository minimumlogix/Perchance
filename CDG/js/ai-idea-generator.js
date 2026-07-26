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
          <div class="c-ai-modal__bot-badge" title="AI Assistant Active">🤖</div>
        </div>

        <div class="c-ai-modal__field">
          <label class="c-label c-ai-modal__label">Response type:</label>
          <select id="aiIdeaResponseTypeSelect" class="c-select c-ai-modal__select">
            <option value="CHARACTER DESCRIPTION">CHARACTER DESCRIPTION</option>
            <option value="PLOT HOOK">PLOT HOOK</option>
            <option value="SCENARIO OUTLINE">SCENARIO OUTLINE</option>
            <option value="BEHAVIOR & DIALOGUE">BEHAVIOR & DIALOGUE</option>
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
    let responseType = responseTypeSelect ? responseTypeSelect.value : "CHARACTER DESCRIPTION";

    if (!targetEl) {
      window.closeAiIdeaModal();
      return;
    }

    // Build prompt based on selected response type
    let instructionPrompt = "";
    if (responseType === "CHARACTER DESCRIPTION") {
      instructionPrompt = `Write a single, detailed, highly creative, and engaging character description paragraph based on these ideas/keywords: "${keywords || 'creative unique character'}". Focus on their physical appearance, personality traits, background, and unique visual features. Write ONLY one cohesive paragraph.`;
    } else if (responseType === "PLOT HOOK") {
      instructionPrompt = `Write a single, high-concept, compelling plot hook paragraph based on these ideas/keywords: "${keywords || 'intrigued plot'}". Focus on the initial situation, the main conflict, high stakes, and a captivating twist. Write ONLY one cohesive paragraph.`;
    } else if (responseType === "SCENARIO OUTLINE") {
      instructionPrompt = `Write a single immersive scenario description paragraph establishing an intriguing roleplay scene based on these ideas/keywords: "${keywords || 'dramatic scene'}". Focus on setting the scene, atmosphere, sensory details, and initial situation. Write ONLY one cohesive paragraph.`;
    } else {
      instructionPrompt = `Write a single paragraph detailing character speech patterns, behavioral habits, and dialogue style based on these ideas/keywords: "${keywords || 'unique persona'}". Write ONLY one cohesive paragraph.`;
    }

    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = "✨ Generating...";
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
