/* ===========================
   MAIN APPLICATION LOGIC
=========================== */

// 1. SELECT CHARACTER
window.selectCharacter = async function(characterId) {
  AppState.activeCharacter = await db.characters.get(characterId);
  if (!AppState.activeCharacter) return;

  AppState.activeThread = await db.threads.where({ characterId: characterId }).first();
  if (!AppState.activeThread) {
    AppState.activeThread = {
      id: "thread_" + characterId + "_" + Date.now(),
      characterId: characterId,
      isBookmarked: false,
      lastUpdated: Date.now()
    };
    await db.threads.put(AppState.activeThread);
  }

  // Update Header Elements
  document.getElementById("headerAvatar").src = AppState.activeCharacter.avatarUrl;
  document.getElementById("headerName").textContent = AppState.activeCharacter.name;
  document.getElementById("narrativeIntro").textContent = AppState.activeCharacter.scenario;

  const btnBookmark = document.getElementById("btnBookmark");
  if (btnBookmark) {
    btnBookmark.textContent = AppState.activeThread.isBookmarked ? "🔖" : "📑";
    btnBookmark.title = AppState.activeThread.isBookmarked ? "Remove Bookmark" : "Bookmark Chat";
  }

  // Update Right Info Panel
  document.getElementById("infoCharName").textContent = AppState.activeCharacter.name;
  document.getElementById("infoPortraitImg").src = AppState.activeCharacter.avatarUrl;
  document.getElementById("infoAge").textContent = AppState.activeCharacter.age || "Unknown";
  document.getElementById("infoOccupation").textContent = AppState.activeCharacter.occupation || "N/A";
  document.getElementById("infoLocation").textContent = AppState.activeCharacter.location || "N/A";
  document.getElementById("infoPersonality").textContent = AppState.activeCharacter.personality || "N/A";
  document.getElementById("infoScenario").textContent = AppState.activeCharacter.scenario || "N/A";
  document.getElementById("voiceNameDisplay").textContent = AppState.activeCharacter.voiceName || "Velvet Whisper";

  // Render Subsystems
  await UI.renderMessages();
  await UI.renderMemories();
  await UI.renderLore();
  await UI.renderSidebarChats();

  // Close mobile sidebar
  document.getElementById("sidebar").classList.remove("open");
};

// 2. SEND MESSAGE & GENERATE RESPONSE
window.handleSendMessage = async function() {
  const inputEl = document.getElementById("chatInput");
  const text = inputEl.value.trim();
  if (!text || !AppState.activeThread || !AppState.activeCharacter || AppState.isGenerating) return;

  inputEl.value = "";
  inputEl.style.height = "auto";

  // Save user message to IndexedDB
  const userMsgId = "msg_" + Date.now();
  await db.messages.put({
    id: userMsgId,
    threadId: AppState.activeThread.id,
    characterId: AppState.activeCharacter.id,
    role: "user",
    content: text,
    timestamp: Date.now()
  });

  await UI.renderMessages();

  // Show Typing Indicator
  AppState.isGenerating = true;
  const container = document.getElementById("messagesContainer");
  const typingRow = document.createElement("div");
  typingRow.className = "message-row ai-row";
  typingRow.id = "typingRow";
  typingRow.innerHTML = `
    <img src="${AppState.activeCharacter.avatarUrl}" class="message-avatar">
    <div class="message-content-wrapper">
      <div class="message-meta">
        <span class="message-author">${UI.escapeHtml(AppState.activeCharacter.name)}</span>
        <span>typing...</span>
      </div>
      <div class="message-bubble">
        <em>*studies you thoughtfully, preparing to answer...*</em>
      </div>
    </div>
  `;
  container.appendChild(typingRow);
  container.scrollTop = container.scrollHeight;

  // Generate AI Response
  const aiText = await generateCharacterResponse(AppState.activeCharacter, AppState.activeThread, text);

  typingRow.remove();

  // Save AI Message to IndexedDB with variations array
  const aiMsgId = "msg_ai_" + Date.now();
  await db.messages.put({
    id: aiMsgId,
    threadId: AppState.activeThread.id,
    characterId: AppState.activeCharacter.id,
    role: "character",
    content: aiText,
    variations: [aiText],
    activeVariationIndex: 0,
    timestamp: Date.now()
  });

  await db.threads.update(AppState.activeThread.id, { lastUpdated: Date.now() });
  AppState.isGenerating = false;

  await UI.renderMessages();
  await UI.renderSidebarChats();
};

// 3. RESPONSE VARIATIONS SWIPER
window.switchVariation = async function(msgId, delta) {
  const msg = await db.messages.get(msgId);
  if (!msg || !msg.variations || msg.variations.length <= 1) return;

  let newIndex = (msg.activeVariationIndex || 0) + delta;
  if (newIndex < 0) newIndex = msg.variations.length - 1;
  if (newIndex >= msg.variations.length) newIndex = 0;

  await db.messages.update(msgId, { activeVariationIndex: newIndex });
  await UI.renderMessages();
};

window.generateNewVariation = async function(msgId) {
  const msg = await db.messages.get(msgId);
  if (!msg || AppState.isGenerating) return;

  AppState.isGenerating = true;
  const history = await db.messages.where({ threadId: AppState.activeThread.id }).sortBy("timestamp");
  const lastUserMsg = history.filter(m => m.role === "user").pop();
  const promptText = lastUserMsg ? lastUserMsg.content : "Hello";

  const newCandidate = await generateCharacterResponse(AppState.activeCharacter, AppState.activeThread, promptText);

  const updatedVariations = [...(msg.variations || [msg.content]), newCandidate];
  const newIndex = updatedVariations.length - 1;

  await db.messages.update(msgId, {
    content: newCandidate,
    variations: updatedVariations,
    activeVariationIndex: newIndex
  });

  AppState.isGenerating = false;
  await UI.renderMessages();
};

// 4. USER MESSAGE INLINE EDIT
window.editUserMessage = async function(msgId) {
  const msg = await db.messages.get(msgId);
  if (!msg) return;

  const bubbleEl = document.getElementById(`bubble_${msgId}`);
  if (!bubbleEl) return;

  bubbleEl.innerHTML = `
    <div class="inline-edit-wrapper">
      <textarea class="inline-edit-textarea" id="editInput_${msgId}" rows="3">${UI.escapeHtml(msg.content)}</textarea>
      <div class="inline-edit-buttons">
        <button class="btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.8rem;" onclick="UI.renderMessages()">Cancel</button>
        <button class="btn-primary" style="padding:0.3rem 0.6rem; font-size:0.8rem;" onclick="window.saveEditedUserMessage('${msgId}')">Save & Regenerate</button>
      </div>
    </div>
  `;
};

window.saveEditedUserMessage = async function(msgId) {
  const inputEl = document.getElementById(`editInput_${msgId}`);
  if (!inputEl) return;
  const newText = inputEl.value.trim();
  if (!newText) return;

  await db.messages.update(msgId, { content: newText });

  const msg = await db.messages.get(msgId);
  const history = await db.messages.where({ threadId: msg.threadId }).sortBy("timestamp");
  const cutIndex = history.findIndex(m => m.id === msgId);
  
  if (cutIndex !== -1 && cutIndex < history.length - 1) {
    const toDelete = history.slice(cutIndex + 1);
    for (const d of toDelete) {
      await db.messages.delete(d.id);
    }
  }

  await UI.renderMessages();

  AppState.isGenerating = true;
  const aiText = await generateCharacterResponse(AppState.activeCharacter, AppState.activeThread, newText);

  await db.messages.put({
    id: "msg_ai_" + Date.now(),
    threadId: AppState.activeThread.id,
    characterId: AppState.activeCharacter.id,
    role: "character",
    content: aiText,
    variations: [aiText],
    activeVariationIndex: 0,
    timestamp: Date.now()
  });

  AppState.isGenerating = false;
  await UI.renderMessages();
  await UI.renderSidebarChats();
};

// 5. THEMES ENGINE
window.applyAppTheme = async function(themeId) {
  document.body.setAttribute("data-theme", themeId);
  if (AppState.userProfile) {
    AppState.userProfile.theme = themeId;
    await db.userProfile.put(AppState.userProfile);
  }
  UI.renderThemeSelector();
};

// 6. EXPLORE CATALOG IMPORT
window.importCatalogCharacter = async function(catalogId) {
  const char = EXPLORE_CATALOG.find(c => c.id === catalogId);
  if (!char) return;

  await db.characters.put(char);
  
  const threadId = "thread_" + char.id;
  const existingThread = await db.threads.get(threadId);
  if (!existingThread) {
    await db.threads.put({ id: threadId, characterId: char.id, lastUpdated: Date.now() });
    await db.messages.put({
      id: "msg_greeting_" + char.id,
      threadId: threadId,
      characterId: char.id,
      role: "character",
      content: char.greeting,
      variations: [char.greeting],
      activeVariationIndex: 0,
      timestamp: Date.now()
    });
  }

  UI.closeModal("exploreModal");
  await window.selectCharacter(char.id);
};

// 7. PERCHANCE CODE BUNDLE EXPORTER
window.exportPerchanceBundle = async function() {
  const code = `// --- COPY & PASTE THIS INTO YOUR PERCHANCE LISTS PANEL ---
loadDependencies = {import:ai-character-chat-dependencies-v1}
ai = {import:ai-text-plugin}
image = {import:text-to-image-plugin}
uploadPlugin = {import:upload-plugin}
superFetch = {import:super-fetch-plugin}
literal = {import:literal-plugin}

output
  [this.joinItems("\\n")]
  <iframe src="https://minimumlogix.github.io/Perchance/chat/" style="width:100%; height:100vh; border:none;"></iframe>
`;
  await navigator.clipboard.writeText(code);
  alert("Perchance export snippet copied to clipboard! You can now paste it into your Perchance Lists editor.");
};

window.deleteMessage = async function(msgId) {
  await db.messages.delete(msgId);
  await UI.renderMessages();
};

window.deleteMemory = async function(memId) {
  await db.memories.delete(memId);
  await UI.renderMemories();
};

window.deleteLore = async function(loreId) {
  await db.lore.delete(loreId);
  await UI.renderLore();
};

window.toggleForceLoadChar = async function(charId, isChecked) {
  if (!AppState.activeThread) return;
  let forceIds = AppState.activeThread.forceLoadCharacterIds || [];
  if (isChecked) {
    if (!forceIds.includes(charId)) forceIds.push(charId);
  } else {
    forceIds = forceIds.filter(id => id !== charId);
  }
  AppState.activeThread.forceLoadCharacterIds = forceIds;
  await db.threads.update(AppState.activeThread.id, { forceLoadCharacterIds: forceIds });
};

window.speakMessageText = function(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\*.*?\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;

    const waveform = document.getElementById("waveform");
    const btnPlay = document.getElementById("btnPlayVoice");

    utterance.onstart = () => {
      waveform?.classList.add("playing");
      if (btnPlay) btnPlay.textContent = "⏸";
    };
    utterance.onend = () => {
      waveform?.classList.remove("playing");
      if (btnPlay) btnPlay.textContent = "▶";
    };
    utterance.onerror = () => {
      waveform?.classList.remove("playing");
      if (btnPlay) btnPlay.textContent = "▶";
    };

    window.speechSynthesis.speak(utterance);
  } else {
    alert("Speech synthesis is not supported by your browser.");
  }
};

// 8. APP INIT
async function initApp() {
  await seedDefaultDataIfNeeded();

  // Load User Profile & Theme
  AppState.userProfile = await db.userProfile.get("default") || DEFAULT_USER_PROFILE;
  document.getElementById("userName").textContent = AppState.userProfile.name;
  document.getElementById("inputUserName").value = AppState.userProfile.name;
  document.getElementById("inputUserPersona").value = AppState.userProfile.persona || "";

  if (AppState.userProfile.theme) {
    document.body.setAttribute("data-theme", AppState.userProfile.theme);
  }

  // Check URL Cloud Share Data
  const importedChar = await checkAndLoadDataFromUrl();
  if (importedChar && importedChar.addCharacter) {
    const newChar = importedChar.addCharacter;
    await db.characters.put(newChar);
    await window.selectCharacter(newChar.id);
  } else {
    const characters = await db.characters.toArray();
    if (characters.length > 0) {
      await window.selectCharacter(characters[0].id);
    }
  }

  setupEventListeners();
}

let userSentHistory = [];
let userHistoryIndex = -1;

function setupEventListeners() {
  document.getElementById("btnSend").onclick = window.handleSendMessage;
  
  const chatInputEl = document.getElementById("chatInput");
  chatInputEl.onkeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      window.handleSendMessage();
    } else if (e.key === "ArrowUp" && chatInputEl.selectionStart === 0 && userSentHistory.length > 0) {
      e.preventDefault();
      if (userHistoryIndex === -1) userHistoryIndex = userSentHistory.length;
      userHistoryIndex = Math.max(0, userHistoryIndex - 1);
      chatInputEl.value = userSentHistory[userHistoryIndex] || "";
    } else if (e.key === "ArrowDown" && userHistoryIndex !== -1) {
      e.preventDefault();
      userHistoryIndex = Math.min(userSentHistory.length, userHistoryIndex + 1);
      chatInputEl.value = userSentHistory[userHistoryIndex] || "";
      if (userHistoryIndex >= userSentHistory.length) userHistoryIndex = -1;
    }
  };

  chatInputEl.oninput = function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
  };

  // Reply As (Group Chat) Selector
  document.getElementById("btnReplyAs").onclick = async () => {
    if (!AppState.activeThread) return;
    const characters = await db.characters.toArray();
    if (characters.length === 0) return;

    let charOptionsStr = characters.map((c, i) => `${i + 1}. ${c.name} (${c.occupation || 'Character'})`).join("\n");
    const choice = prompt(`Select character to reply next (Group Chat mode):\n\n${charOptionsStr}\n\nEnter number (1-${characters.length}):`);
    
    if (choice) {
      const idx = parseInt(choice.trim(), 10) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < characters.length) {
        const selectedChar = characters[idx];
        AppState.activeThread.replyAsCharacterId = selectedChar.id;
        await db.threads.update(AppState.activeThread.id, { replyAsCharacterId: selectedChar.id });
        document.getElementById("btnReplyAs").textContent = `💬 Reply As (${selectedChar.name})`;
      }
    }
  };

  // Force Load Modal
  document.getElementById("btnForceLoad").onclick = async () => {
    await UI.renderForceLoadSelector();
    UI.openModal("forceLoadModal");
  };
  document.getElementById("btnCloseForceLoadModal").onclick = () => UI.closeModal("forceLoadModal");
  document.getElementById("btnSaveForceLoadModal").onclick = () => UI.closeModal("forceLoadModal");

  // Community Comments Modal
  document.getElementById("btnComments").onclick = () => {
    UI.renderComments();
    UI.openModal("commentsModal");
  };
  document.getElementById("btnCloseCommentsModal").onclick = () => UI.closeModal("commentsModal");

  // Bookmark Toggle Button
  document.getElementById("btnBookmark").onclick = async () => {
    if (!AppState.activeThread) return;
    const newStatus = !AppState.activeThread.isBookmarked;
    AppState.activeThread.isBookmarked = newStatus;
    await db.threads.update(AppState.activeThread.id, { isBookmarked: newStatus });
    
    document.getElementById("btnBookmark").textContent = newStatus ? "🔖" : "📑";
    await UI.renderSidebarChats();
  };

  // Search Toggle & Handler
  document.getElementById("btnSearchChats").onclick = () => {
    const searchContainer = document.getElementById("sidebarSearchContainer");
    if (!searchContainer) return;
    const isHidden = searchContainer.style.display === "none";
    searchContainer.style.display = isHidden ? "block" : "none";
    if (isHidden) document.getElementById("inputSearchChats").focus();
  };

  document.getElementById("inputSearchChats").oninput = function() {
    UI.renderSidebarChats(this.value);
  };

  // Share Character Button
  document.getElementById("btnShareCharacter").onclick = async () => {
    if (!AppState.activeCharacter) return;
    const payload = { addCharacter: AppState.activeCharacter };
    const shareUrl = await generateShareLinkForCharacter(payload);
    if (shareUrl) {
      await window.confirmAsync(`Here is your character share URL:\n\n${shareUrl}`, { hideCancel: true });
    }
  };

  document.getElementById("btnGenImage").onclick = async () => {
    if (!AppState.activeCharacter || !AppState.activeThread) return;
    
    const history = await db.messages.where({ threadId: AppState.activeThread.id }).sortBy("timestamp");
    const lastUserMsg = history.filter(m => m.role === "user").pop();
    
    const imgUrl = await generateSceneIllustration(AppState.activeCharacter, lastUserMsg?.content);
    
    await db.messages.put({
      id: "msg_img_" + Date.now(),
      threadId: AppState.activeThread.id,
      characterId: AppState.activeCharacter.id,
      role: "character",
      content: `*Generates scene illustration for ${AppState.activeCharacter.name}*`,
      imageUrl: imgUrl,
      timestamp: Date.now()
    });

    await UI.renderMessages();
  };

  document.getElementById("btnDiceRoll").onclick = () => {
    const prompts = [
      "*asks about their darkest secret*",
      "*offers a gold coin and asks for advice*",
      "*notices an old scar on their hand*",
      "*whispers a rumor you heard in the marketplace*",
      "*draws a weapon and steps into the shadows*"
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    document.getElementById("chatInput").value = randomPrompt;
  };

  document.getElementById("btnQuickPrompt").onclick = () => {
    const prompts = [
      "Tell me about your backstory and how you ended up here.",
      "What is your greatest goal or ambition?",
      "Can you teach me something about your profession?",
      "Do you trust the people in this town?"
    ];
    const chosen = prompts[Math.floor(Math.random() * prompts.length)];
    document.getElementById("chatInput").value = chosen;
  };

  document.getElementById("btnToggleInfo").onclick = () => {
    document.getElementById("infoPanel").classList.toggle("open");
  };
  document.getElementById("btnCloseInfo").onclick = () => {
    document.getElementById("infoPanel").classList.remove("open");
  };
  document.getElementById("btnMobileMenu").onclick = () => {
    document.getElementById("sidebar").classList.toggle("open");
  };

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = function() {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      const tab = this.dataset.tab;
      document.getElementById("tabContentInfo").style.display = tab === "info" ? "flex" : "none";
      document.getElementById("tabContentMemory").style.display = tab === "memory" ? "flex" : "none";
      document.getElementById("tabContentLore").style.display = tab === "lore" ? "flex" : "none";
      if (tab === "lore") UI.renderLore();
    };
  });

  document.getElementById("btnPlayVoice").onclick = () => {
    if (AppState.activeCharacter) {
      window.speakMessageText(AppState.activeCharacter.greeting);
    }
  };

  // Open Create Modal
  document.getElementById("btnNewChat").onclick = () => {
    document.getElementById("charModalTitle").textContent = "Create Character";
    document.getElementById("inputCharId").value = "";
    document.getElementById("inputCharName").value = "";
    document.getElementById("inputCharAvatar").value = "";
    document.getElementById("inputCharAge").value = "";
    document.getElementById("inputCharOccupation").value = "";
    document.getElementById("inputCharLocation").value = "";
    document.getElementById("inputCharPersonality").value = "";
    document.getElementById("inputCharScenario").value = "";
    document.getElementById("inputCharGreeting").value = "";
    document.getElementById("inputCharRoleInstruction").value = "";
    document.getElementById("inputCharImportUrl").value = "";
    UI.openModal("characterModal");
  };

  // Magic Character Import from Share URL
  document.getElementById("btnImportCharFromUrl").onclick = async () => {
    const link = document.getElementById("inputCharImportUrl").value.trim();
    if (!link) { alert("Please paste a character share URL."); return; }
    
    const loadingModal = UI.createLoadingModal ? UI.createLoadingModal("Loading character data...") : null;
    try {
      const data = await loadDataFromUrlThatReferencesCloudStorageFile(link);
      loadingModal?.delete();
      if (data && data.addCharacter) {
        const c = data.addCharacter;
        document.getElementById("inputCharName").value = c.name || "";
        document.getElementById("inputCharAvatar").value = c.avatarUrl || "";
        document.getElementById("inputCharAge").value = c.age || "25";
        document.getElementById("inputCharOccupation").value = c.occupation || "";
        document.getElementById("inputCharLocation").value = c.location || "";
        document.getElementById("inputCharPersonality").value = c.personality || "";
        document.getElementById("inputCharScenario").value = c.scenario || "";
        document.getElementById("inputCharGreeting").value = c.greeting || "";
        document.getElementById("inputCharRoleInstruction").value = c.roleInstruction || "";
        alert(`Successfully imported character: ${c.name}!`);
      } else {
        alert("Could not extract character data from the provided URL.");
      }
    } catch(err) {
      loadingModal?.delete();
      alert("Failed to load character: " + err.message);
    }
  };

  // Edit Active Character Profile
  document.getElementById("btnEditCharacterProfile").onclick = () => {
    if (!AppState.activeCharacter) return;
    const char = AppState.activeCharacter;
    document.getElementById("charModalTitle").textContent = "Edit Character Profile";
    document.getElementById("inputCharId").value = char.id;
    document.getElementById("inputCharName").value = char.name || "";
    document.getElementById("inputCharAvatar").value = char.avatarUrl || "";
    document.getElementById("inputCharAge").value = char.age || "";
    document.getElementById("inputCharOccupation").value = char.occupation || "";
    document.getElementById("inputCharLocation").value = char.location || "";
    document.getElementById("inputCharPersonality").value = char.personality || "";
    document.getElementById("inputCharScenario").value = char.scenario || "";
    document.getElementById("inputCharGreeting").value = char.greeting || "";
    document.getElementById("inputCharRoleInstruction").value = char.roleInstruction || "";
    UI.openModal("characterModal");
  };

  document.getElementById("btnEditUserPersona").onclick = () => UI.openModal("personaModal");
  document.getElementById("btnSettings").onclick = () => {
    UI.renderThemeSelector();
    UI.openModal("settingsModal");
  };

  document.getElementById("btnCloseCharModal").onclick = () => UI.closeModal("characterModal");
  document.getElementById("btnCancelCharModal").onclick = () => UI.closeModal("characterModal");
  document.getElementById("btnClosePersonaModal").onclick = () => UI.closeModal("personaModal");
  document.getElementById("btnCloseSettingsModal").onclick = () => UI.closeModal("settingsModal");
  document.getElementById("btnCloseExploreModal").onclick = () => UI.closeModal("exploreModal");
  document.getElementById("btnCloseLoreModal").onclick = () => UI.closeModal("loreModal");
  document.getElementById("btnCancelLoreModal").onclick = () => UI.closeModal("loreModal");

  document.getElementById("btnSavePersona").onclick = async () => {
    const name = document.getElementById("inputUserName").value.trim() || "Nyx";
    const persona = document.getElementById("inputUserPersona").value.trim();
    
    AppState.userProfile.name = name;
    AppState.userProfile.persona = persona;
    await db.userProfile.put(AppState.userProfile);
    
    document.getElementById("userName").textContent = name;
    UI.closeModal("personaModal");
    await UI.renderMessages();
  };

  // Save / Update Character
  document.getElementById("btnSaveCharModal").onclick = async () => {
    const name = document.getElementById("inputCharName").value.trim();
    if (!name) { alert("Please enter a character name."); return; }

    const existingId = document.getElementById("inputCharId").value;
    const id = existingId || (name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now());

    const charObj = {
      id: id,
      name: name,
      avatarUrl: document.getElementById("inputCharAvatar").value.trim() || "assets/lysandra.png",
      age: document.getElementById("inputCharAge").value.trim() || "25",
      occupation: document.getElementById("inputCharOccupation").value.trim() || "Wanderer",
      location: document.getElementById("inputCharLocation").value.trim() || "Unknown",
      personality: document.getElementById("inputCharPersonality").value.trim() || "Mysterious",
      scenario: document.getElementById("inputCharScenario").value.trim() || "You meet in a tavern.",
      greeting: document.getElementById("inputCharGreeting").value.trim() || `*${name} looks up at you with interest.*`,
      roleInstruction: document.getElementById("inputCharRoleInstruction").value.trim() || `You are ${name}.`,
      voiceName: "Velvet Whisper"
    };

    await db.characters.put(charObj);

    if (!existingId) {
      const threadId = "thread_" + id;
      await db.threads.put({ id: threadId, characterId: id, lastUpdated: Date.now() });
      await db.messages.put({
        id: "msg_greeting_" + id,
        threadId: threadId,
        characterId: id,
        role: "character",
        content: charObj.greeting,
        variations: [charObj.greeting],
        activeVariationIndex: 0,
        timestamp: Date.now()
      });
    }

    UI.closeModal("characterModal");
    await window.selectCharacter(id);
  };

  document.getElementById("btnAddMemory").onclick = async () => {
    if (!AppState.activeCharacter) return;
    const text = prompt("Enter long-term memory fact for " + AppState.activeCharacter.name + ":");
    if (text && text.trim()) {
      await db.memories.put({
        id: "mem_" + Date.now(),
        characterId: AppState.activeCharacter.id,
        content: text.trim()
      });
      await UI.renderMemories();
    }
  };

  // Lorebook Modal Handlers
  document.getElementById("btnAddLore").onclick = () => {
    if (!AppState.activeCharacter) return;
    document.getElementById("inputLoreId").value = "";
    document.getElementById("inputLoreText").value = "";
    document.getElementById("inputLoreTriggers").value = "";
    UI.openModal("loreModal");
  };

  document.getElementById("btnSaveLoreModal").onclick = async () => {
    if (!AppState.activeCharacter) return;
    const text = document.getElementById("inputLoreText").value.trim();
    if (!text) { alert("Please enter lore text."); return; }

    const rawTriggers = document.getElementById("inputLoreTriggers").value.trim();
    const triggersArr = rawTriggers ? rawTriggers.split(",").map(t => t.trim()).filter(Boolean) : [];

    const loreObj = {
      id: "lore_" + Date.now(),
      characterId: AppState.activeCharacter.id,
      text: text,
      triggers: triggersArr
    };

    await db.lore.put(loreObj);
    UI.closeModal("loreModal");
    await UI.renderLore();
  };

  // Export DB JSON
  document.getElementById("btnExportDb").onclick = async () => {
    const data = {
      characters: await db.characters.toArray(),
      threads: await db.threads.toArray(),
      messages: await db.messages.toArray(),
      memories: await db.memories.toArray(),
      lore: await db.lore.toArray()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elysium-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import DB JSON File
  document.getElementById("inputImportDb").onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.characters) await db.characters.bulkPut(data.characters);
        if (data.threads) await db.threads.bulkPut(data.threads);
        if (data.messages) await db.messages.bulkPut(data.messages);
        if (data.memories) await db.memories.bulkPut(data.memories);

        alert("Database successfully restored from JSON backup!");
        window.location.reload();
      } catch (err) {
        alert("Failed to parse JSON backup file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  document.getElementById("btnResetDb").onclick = async () => {
    if (confirm("Are you sure you want to reset all chats and restore default settings?")) {
      await db.delete();
      window.location.reload();
    }
  };

  document.getElementById("navChat")?.addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("infoPanel").classList.remove("open");
  });
  document.getElementById("navCreate")?.addEventListener("click", () => UI.openModal("characterModal"));
  document.getElementById("navExplore")?.addEventListener("click", () => {
    UI.renderExploreCatalog();
    UI.openModal("exploreModal");
  });
  document.getElementById("navProfile")?.addEventListener("click", () => UI.openModal("personaModal"));
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

