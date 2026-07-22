/* ===========================
   UI RENDERER & DIALOG MODULE
=========================== */
const UI = {
  async renderSidebarChats(filterText = "") {
    const chatsListEl = document.getElementById("chatsList");
    if (!chatsListEl) return;
    chatsListEl.innerHTML = "";

    const query = filterText.toLowerCase().trim();
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

      // Filter check
      if (query) {
        const matchName = char.name.toLowerCase().includes(query);
        const matchOccupation = (char.occupation || "").toLowerCase().includes(query);
        const matchSnippet = lastMsgSnippet.toLowerCase().includes(query);
        if (!matchName && !matchOccupation && !matchSnippet) continue;
      }

      const isActive = AppState.activeCharacter && AppState.activeCharacter.id === char.id;
      const isBookmarked = thread?.isBookmarked || char.isBookmarked;

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
            <span class="chat-item-name">${this.escapeHtml(char.name)} ${isBookmarked ? '🔖' : ''}</span>
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

      // Determine active variation content
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

  async renderLore() {
    if (!AppState.activeCharacter) return;
    const loreListEl = document.getElementById("loreList");
    if (!loreListEl) return;
    loreListEl.innerHTML = "";

    const loreEntries = await db.lore.where({ characterId: AppState.activeCharacter.id }).toArray();
    if (loreEntries.length === 0) {
      loreListEl.innerHTML = `<div style="font-style:italic; color:var(--text-muted); font-size:0.85rem;">No lorebook entries yet. Click '+ Add Lore Entry' to add world context & keywords.</div>`;
      return;
    }

    for (const l of loreEntries) {
      let triggerChips = "";
      let triggersArr = l.triggers || [];
      if (typeof triggersArr === "string") triggersArr = triggersArr.split(",");
      if (triggersArr.length > 0) {
        triggerChips = `<div style="display:flex; flex-wrap:wrap; gap:0.25rem; margin-top:0.3rem;">` +
          triggersArr.map(t => `<span style="background:rgba(224, 159, 135, 0.15); color:var(--accent-copper); padding:1px 6px; border-radius:4px; font-size:0.75rem;">🔑 ${this.escapeHtml(t.trim())}</span>`).join("") +
          `</div>`;
      }

      const item = document.createElement("div");
      item.style.cssText = "background:var(--bg-card); padding:0.6rem 0.75rem; border-radius:6px; border:1px solid var(--border-dark); font-size:0.85rem; display:flex; flex-direction:column; gap:0.25rem;";
      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <span style="font-weight:500;">${this.escapeHtml(l.text)}</span>
          <button style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.9rem;" onclick="window.deleteLore('${l.id}')">✖</button>
        </div>
        ${triggerChips}
      `;
      loreListEl.appendChild(item);
    }
  },

  async renderForceLoadSelector() {
    const listEl = document.getElementById("forceLoadCharacterList");
    if (!listEl || !AppState.activeThread) return;
    listEl.innerHTML = "";

    const characters = await db.characters.toArray();
    const activeForceIds = AppState.activeThread.forceLoadCharacterIds || [];

    for (const char of characters) {
      if (char.id === AppState.activeCharacter?.id) continue;
      const isChecked = activeForceIds.includes(char.id);

      const label = document.createElement("label");
      label.style.cssText = "display:flex; align-items:center; gap:0.75rem; background:var(--bg-card); padding:0.6rem 0.8rem; border-radius:8px; border:1px solid var(--border-dark); cursor:pointer;";
      label.innerHTML = `
        <input type="checkbox" value="${char.id}" ${isChecked ? 'checked' : ''} onchange="window.toggleForceLoadChar('${char.id}', this.checked)">
        <img src="${char.avatarUrl}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">
        <div>
          <div style="font-weight:600; font-size:0.9rem;">${this.escapeHtml(char.name)}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${this.escapeHtml(char.occupation || '')}</div>
        </div>
      `;
      listEl.appendChild(label);
    }
  },

  renderComments() {
    const container = document.getElementById("commentsPluginContainer");
    if (!container) return;

    const commentsPlugin = window.commentsPlugin || window.root?.commentsPlugin || window.root?.tabbedCommentsPlugin;
    if (typeof commentsPlugin === "function") {
      try {
        container.innerHTML = commentsPlugin({ width: "100%", height: "100%" });
        return;
      } catch (err) {
        console.warn("Failed to render comments plugin:", err);
      }
    }
    container.innerHTML = `
      <div style="text-align:center; padding:3rem; color:var(--text-muted);">
        <p style="font-weight:600; margin-bottom:0.5rem;">Community Comments & Feedback</p>
        <p style="font-size:0.85rem;">Perchance comments plugin will render automatically when running on Perchance.org</p>
      </div>
    `;
  },

  async renderHomePage(filterSearch = "") {
    const gridEl = document.getElementById("homeCharacterGrid");
    if (!gridEl) return;
    gridEl.innerHTML = "";

    const userProf = AppState.userProfile || DEFAULT_USER_PROFILE;

    // Render User Header Profile & Banner
    const homeProfileName = document.getElementById("homeProfileName");
    if (homeProfileName) homeProfileName.textContent = userProf.name || "Odin";

    // Combine IndexedDB characters + Explore catalog
    const dbChars = await db.characters.toArray();
    const map = new Map();
    [...dbChars, ...EXPLORE_CATALOG].forEach(c => map.set(c.id, c));
    const allChars = Array.from(map.values());

    const query = filterSearch.toLowerCase().trim();

    for (const char of allChars) {
      if (query) {
        const matchName = char.name.toLowerCase().includes(query);
        const matchOcc = (char.occupation || "").toLowerCase().includes(query);
        const matchScen = (char.scenario || "").toLowerCase().includes(query);
        const matchTag = (char.tags || []).some(t => t.toLowerCase().includes(query));
        if (!matchName && !matchOcc && !matchScen && !matchTag) continue;
      }

      const slug = getCharacterSlug(char);
      const tagsHtml = (char.tags || ["Yandere", "Calm", "Quiet"]).map(t => `<span class="tag-pill">${this.escapeHtml(t)}</span>`).join("");

      const card = document.createElement("div");
      card.className = "bot-card";
      card.onclick = () => window.selectCharacter(char.id);

      card.innerHTML = `
        <div class="bot-card-media">
          <img src="${char.avatarUrl}" class="bot-card-img" alt="${this.escapeHtml(char.name)}">
          <button class="bot-card-menu-btn" onclick="event.stopPropagation(); window.shareOrEditChar('${char.id}')">⋮</button>
          <div class="bot-card-overlay-bottom">
            <span class="bot-card-badge">💬 ${char.chats || '12.4k'}</span>
            <span class="bot-card-badge">❤️ ${char.likes || '24'}</span>
          </div>
        </div>
        <div class="bot-card-body">
          <div class="bot-card-title-row">
            <span class="bot-card-title">${this.escapeHtml(char.name)}</span>
            <span class="verified-badge">✓</span>
          </div>
          <div class="bot-card-subtitle">${this.escapeHtml(char.scenario || char.roleInstruction || '')}</div>
          <div class="bot-card-tags">
            ${tagsHtml}
          </div>
        </div>
      `;

      gridEl.appendChild(card);
    }
  },

  showHomeView() {
    const homeView = document.getElementById("homeView");
    const appView = document.getElementById("app");
    if (homeView) homeView.style.display = "flex";
    if (appView) appView.style.display = "none";
    window.location.hash = "home";
    this.renderHomePage();
  },

  showChatView() {
    const homeView = document.getElementById("homeView");
    const appView = document.getElementById("app");
    if (homeView) homeView.style.display = "none";
    if (appView) appView.style.display = "flex";
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

window.confirmAsync = async function(message, opts) {
  if (!opts) opts = {};
  if (!message) message = "Are you sure?";
  return new Promise(resolve => {
    const overlay = Object.assign(document.createElement("div"), { tabIndex: 0 });
    overlay.style.cssText = `position:fixed;inset:0;z-index:99999999;display:grid;place-items:center;background-color:rgba(0,0,0,.65);font:16px/1.4 var(--font-ui, system-ui);`;
    overlay.innerHTML = `<div style="text-align:left !important;max-width:min(97vw, 450px);padding:20px;border-radius:12px;background-color:var(--bg-panel, #222);color:var(--text-main, #fff);border:1px solid var(--border-dark, #444);box-shadow:0 4px 20px rgba(0,0,0,.5);">
      <p style="margin:0 0 20px;white-space:pre-wrap;line-height:1.5;">${message.replace(/[<>&]/g, m => ({ "<": "&lt;", "&": "&amp;", ">": "&gt;" }[m]))}</p>
      <div style="display:flex;justify-content:flex-end;gap:8px;">
        <button ${opts.hideCancel ? "hidden" : ""} class="btn-secondary" style="padding:6px 16px;">Cancel</button>
        <button autofocus class="btn-primary" style="padding:6px 16px;">Okay</button>
      </div>
    </div>`;
    const [cancelBtn, okBtn] = overlay.querySelectorAll("button");
    const finish = val => { overlay.remove(); resolve(val); };
    cancelBtn.onclick = () => finish(false);
    okBtn.onclick = () => finish(true);
    overlay.onkeydown = e => {
      if (e.key === "Escape") finish(false);
      else if (e.key === "Enter") finish(true);
    };
    document.body.append(overlay);
    overlay.focus({ preventScroll: true });
  });
};

window.createLoadingModal = function(text) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `position:fixed;inset:0;z-index:99999999;display:grid;place-items:center;background-color:rgba(0,0,0,.65);font:16px/1.4 var(--font-ui, system-ui); color:#fff;`;
  overlay.innerHTML = `<div style="padding:20px 30px; border-radius:12px; background:var(--bg-panel, #222); border:1px solid var(--border-dark, #444); font-weight:600;">${text}</div>`;
  document.body.append(overlay);
  return {
    delete() { overlay.remove(); }
  };
};
