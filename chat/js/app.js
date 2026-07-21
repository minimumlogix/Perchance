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
      lastUpdated: Date.now()
    };
    await db.threads.put(AppState.activeThread);
  }

  // Update Header Elements
  document.getElementById("headerAvatar").src = AppState.activeCharacter.avatarUrl;
  document.getElementById("headerName").textContent = AppState.activeCharacter.name;
  document.getElementById("narrativeIntro").textContent = AppState.activeCharacter.scenario;

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

  // Delete subsequent messages to branch history
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

  // Generate fresh response from edited point
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

function setupEventListeners() {
  document.getElementById("btnSend").onclick = window.handleSendMessage;
  document.getElementById("chatInput").onkeydown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      window.handleSendMessage();
    }
  };

  document.getElementById("chatInput").oninput = function() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
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
    };
  });

  document.getElementById("btnPlayVoice").onclick = () => {
    if (AppState.activeCharacter) {
      window.speakMessageText(AppState.activeCharacter.greeting);
    }
  };

  document.getElementById("btnNewChat").onclick = () => UI.openModal("characterModal");
  document.getElementById("btnEditUserPersona").onclick = () => UI.openModal("personaModal");
  document.getElementById("btnSettings").onclick = () => {
    UI.renderThemeSelector();
    UI.openModal("settingsModal");
  };
  document.getElementById("btnEditCharacterProfile").onclick = () => UI.openModal("characterModal");

  document.getElementById("btnCloseCharModal").onclick = () => UI.closeModal("characterModal");
  document.getElementById("btnCancelCharModal").onclick = () => UI.closeModal("characterModal");
  document.getElementById("btnClosePersonaModal").onclick = () => UI.closeModal("personaModal");
  document.getElementById("btnCloseSettingsModal").onclick = () => UI.closeModal("settingsModal");
  document.getElementById("btnCloseExploreModal").onclick = () => UI.closeModal("exploreModal");

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

  document.getElementById("btnSaveCharModal").onclick = async () => {
    const name = document.getElementById("inputCharName").value.trim();
    if (!name) { alert("Please enter a character name."); return; }

    const id = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    const newChar = {
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

    await db.characters.put(newChar);

    const threadId = "thread_" + id;
    await db.threads.put({ id: threadId, characterId: id, lastUpdated: Date.now() });
    await db.messages.put({
      id: "msg_greeting_" + id,
      threadId: threadId,
      characterId: id,
      role: "character",
      content: newChar.greeting,
      variations: [newChar.greeting],
      activeVariationIndex: 0,
      timestamp: Date.now()
    });

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

  document.getElementById("btnExportDb").onclick = async () => {
    const data = {
      characters: await db.characters.toArray(),
      threads: await db.threads.toArray(),
      messages: await db.messages.toArray(),
      memories: await db.memories.toArray()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elysium-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

window.addEventListener("DOMContentLoaded", initApp);
