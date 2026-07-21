/* ===========================
   UI RENDERER MODULE
=========================== */
const UI = {
  async renderSidebarChats() {
    const chatsListEl = document.getElementById("chatsList");
    if (!chatsListEl) return;
    chatsListEl.innerHTML = "";

    const characters = await db.characters.toArray();
    for (const char of characters) {
      const thread = await db.threads.where({ characterId: char.id }).first();
      let lastMsgSnippet = char.greeting.substring(0, 45).replace(/\n/g, ' ') + '...';
      let lastTimeStr = "Just now";

      if (thread) {
        const lastMsg = await db.messages.where({ threadId: thread.id }).last();
        if (lastMsg) {
          const textContent = (lastMsg.variations && lastMsg.variations.length > 0) 
            ? lastMsg.variations[lastMsg.activeVariationIndex || 0] 
            : lastMsg.content;
          lastMsgSnippet = textContent.substring(0, 45).replace(/\n/g, ' ') + '...';
          lastTimeStr = this.formatTimestamp(lastMsg.timestamp);
        }
      }

      const isActive = AppState.activeCharacter && AppState.activeCharacter.id === char.id;
      const item = document.createElement("div");
      item.className = `chat-item ${isActive ? 'active' : ''}`;
      item.onclick = () => window.selectCharacter(char.id);

      item.innerHTML = `
        <div class="chat-avatar-wrapper">
          <img src="${char.avatarUrl}" class="chat-avatar" alt="${this.escapeHtml(char.name)}">
          <div class="online-indicator"></div>
        </div>
        <div class="chat-item-info">
          <div class="chat-item-top">
            <span class="chat-item-name">${this.escapeHtml(char.name)}</span>
            <span class="chat-item-time">${lastTimeStr}</span>
          </div>
          <div class="chat-item-preview">${this.escapeHtml(lastMsgSnippet)}</div>
        </div>
      `;

      chatsListEl.appendChild(item);
    }
  },

  async renderMessages() {
    const container = document.getElementById("messagesContainer");
    if (!container) return;

    // Remove old message rows, keep intro card
    container.querySelectorAll(".message-row").forEach(el => el.remove());

    if (!AppState.activeThread || !AppState.activeCharacter) return;

    const messages = await db.messages.where({ threadId: AppState.activeThread.id }).sortBy("timestamp");
    const userProf = AppState.userProfile || DEFAULT_USER_PROFILE;

    for (const msg of messages) {
      const isUser = msg.role === "user";
      const row = document.createElement("div");
      row.className = `message-row ${isUser ? 'user-row' : 'ai-row'}`;
      row.dataset.msgId = msg.id;

      const avatarSrc = isUser ? (userProf.avatarUrl || "assets/lysandra.png") : AppState.activeCharacter.avatarUrl;
      const authorName = isUser ? userProf.name : AppState.activeCharacter.name;
      const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Determine active variation content if character response has multiple candidates
      let displayContent = msg.content;
      let variations = msg.variations || [msg.content];
      let activeIndex = msg.activeVariationIndex || 0;
      if (variations.length > 0 && activeIndex < variations.length) {
        displayContent = variations[activeIndex];
      }

      // Parse markdown
      let parsedContent = displayContent;
      if (window.marked && window.DOMPurify) {
        parsedContent = DOMPurify.sanitize(marked.parse(displayContent));
      } else {
        parsedContent = this.escapeHtml(displayContent).replace(/\n/g, '<br>');
      }

      const imageHtml = msg.imageUrl ? `<img src="${msg.imageUrl}" alt="Scene Illustration">` : '';

      // Build toolbar actions & swiper controls
      let toolbarHtml = '';
      if (!isUser) {
        const totalVar = variations.length;
        const swiperControls = totalVar > 1 ? `
          <button class="action-sub-btn" onclick="window.switchVariation('${msg.id}', -1)">◀</button>
          <span class="variation-counter">${activeIndex + 1}/${totalVar}</span>
          <button class="action-sub-btn" onclick="window.switchVariation('${msg.id}', 1)">▶</button>
        ` : '';

        toolbarHtml = `
          <div class="message-actions-bar">
            <div class="actions-left">
              ${swiperControls}
              <button class="action-sub-btn" onclick="window.generateNewVariation('${msg.id}')">🔄 New</button>
              <button class="action-sub-btn" onclick="window.speakMessageText('${this.escapeJsString(displayContent)}')">🔊 Listen</button>
            </div>
            <div class="actions-right">
              <button class="action-sub-btn" onclick="window.deleteMessage('${msg.id}')">🗑 Delete</button>
            </div>
          </div>
        `;
      } else {
        toolbarHtml = `
          <div class="message-actions-bar">
            <div class="actions-left">
              <button class="action-sub-btn" onclick="window.editUserMessage('${msg.id}')">✏️ Edit</button>
            </div>
            <div class="actions-right">
              <button class="action-sub-btn" onclick="window.deleteMessage('${msg.id}')">🗑 Delete</button>
            </div>
          </div>
        `;
      }

      row.innerHTML = `
        <img src="${avatarSrc}" class="message-avatar" alt="${this.escapeHtml(authorName)}">
        <div class="message-content-wrapper">
          <div class="message-meta">
            <span class="message-author">${this.escapeHtml(authorName)}</span>
            <span>${formattedTime}</span>
          </div>
          <div class="message-bubble" id="bubble_${msg.id}">
            ${parsedContent}
            ${imageHtml}
          </div>
          ${toolbarHtml}
        </div>
      `;

      container.appendChild(row);
    }

    container.scrollTop = container.scrollHeight;
  },

  async renderMemories() {
    if (!AppState.activeCharacter) return;
    const memListEl = document.getElementById("memoryList");
    if (!memListEl) return;
    memListEl.innerHTML = "";

    const memories = await db.memories.where({ characterId: AppState.activeCharacter.id }).toArray();
    if (memories.length === 0) {
      memListEl.innerHTML = `<div style="font-style:italic; color:var(--text-muted); font-size:0.85rem;">No active memories yet. Click '+ Add Memory' to record key facts.</div>`;
      return;
    }

    for (const mem of memories) {
      const item = document.createElement("div");
      item.style.cssText = "background:var(--bg-card); padding:0.5rem 0.75rem; border-radius:6px; border:1px solid var(--border-dark); font-size:0.85rem; display:flex; justify-content:space-between; align-items:center;";
      item.innerHTML = `
        <span>${this.escapeHtml(mem.content)}</span>
        <button style="background:none; border:none; color:var(--text-muted); cursor:pointer;" onclick="window.deleteMemory('${mem.id}')">✖</button>
      `;
      memListEl.appendChild(item);
    }
  },

  renderExploreCatalog() {
    const catalogContainer = document.getElementById("exploreCatalogList");
    if (!catalogContainer) return;

    let html = `<div class="explore-grid">`;
    for (const char of EXPLORE_CATALOG) {
      html += `
        <div class="explore-card">
          <img src="${char.avatarUrl}" class="explore-avatar" alt="${this.escapeHtml(char.name)}">
          <div class="explore-name">${this.escapeHtml(char.name)}</div>
          <div class="explore-desc">${this.escapeHtml(char.scenario)}</div>
          <button class="btn-primary" style="padding:0.4rem 0.8rem; font-size:0.85rem; margin-top:auto;" onclick="window.importCatalogCharacter('${char.id}')">
            + Start Chat
          </button>
        </div>
      `;
    }
    html += `</div>`;
    catalogContainer.innerHTML = html;
  },

  renderThemeSelector() {
    const activeTheme = AppState.userProfile?.theme || "elysium";
    const container = document.getElementById("themeSelectorGrid");
    if (!container) return;

    let html = `<div class="theme-grid">`;
    for (const t of APP_THEMES) {
      const isCurrent = t.id === activeTheme;
      html += `
        <div class="theme-card ${isCurrent ? 'active' : ''}" onclick="window.applyAppTheme('${t.id}')">
          <div class="theme-preview-dot" style="background:${t.color};"></div>
          <span style="font-size:0.85rem; font-weight:500;">${t.name}</span>
        </div>
      `;
    }
    html += `</div>`;
    container.innerHTML = html;
  },

  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add("open");
  },

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove("open");
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  },

  escapeJsString(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${').replace(/'/g, "\\'");
  },

  formatTimestamp(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
};
