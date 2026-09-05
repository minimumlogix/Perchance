/* ===========================
   CONSTANTS
=========================== */

const STORAGE_CUSTOM_TOOLS_KEY = "CDG_CUSTOM_TOOLS";

/* ===========================
   CONFIGURATION: ART STYLE PRESETS
=========================== */

const ART_STYLE_PRESETS = {
  "anime_webtoon": {
    label: "Anime & Korean Webtoon",
    roleText: "anime and Korean webtoon",
    tags: ["masterpiece", "best quality", "korean webtoon", "anime illustration"]
  },
  "vintage_anime": {
    label: "Vintage 80s/90s Retro Anime",
    roleText: "vintage 1980s and 1990s retro anime",
    tags: ["masterpiece", "best quality", "1980s anime style", "retro anime aesthetic", "cel shaded", "nostalgic color palette"]
  },
  "monochrome_manga": {
    label: "Monochrome Manga / Inked Comic",
    roleText: "monochrome manga and inked comic",
    tags: ["masterpiece", "best quality", "manga style", "monochrome", "screentone shading", "inked line art", "high-contrast comic"]
  },
  "painterly_anime": {
    label: "Painterly Fine Art Anime",
    roleText: "painterly fine art anime",
    tags: ["masterpiece", "best quality", "painterly anime", "textured brushstrokes", "fine art illustration", "artistic lighting"]
  },
  "semi_realistic_manhwa": {
    label: "Semi-Realistic Digital Manhwa",
    roleText: "semi-realistic digital manhwa",
    tags: ["masterpiece", "best quality", "semi-realistic manhwa", "clean digital webcomic", "luminous digital rendering", "stylish manhwa aesthetic"]
  },
  "studio_ghibli": {
    label: "Studio Ghibli Animation",
    roleText: "Studio Ghibli animation aesthetic",
    tags: ["masterpiece", "best quality", "studio ghibli style", "hand-painted aesthetic", "soft warm lighting", "anime film still"]
  },
  "3d_game_render": {
    label: "3D Game Render / CGI",
    roleText: "3D video game cinematic CGI",
    tags: ["masterpiece", "best quality", "3d game render", "unreal engine 5", "raytracing", "subsurface scattering", "intricate materials"]
  },
  "cinematic_photo": {
    label: "Cinematic Photorealism",
    roleText: "cinematic realism photography",
    tags: ["masterpiece", "best quality", "cinematic photo", "realistic portrait", "35mm lens film still", "natural skin texture", "volumetric lighting"]
  },
  "dark_fantasy": {
    label: "Dark Fantasy / Gothic Anime",
    roleText: "dark fantasy and gothic anime",
    tags: ["masterpiece", "best quality", "dark fantasy anime", "gothic aesthetic", "chiaroscuro lighting", "intricate dark illustration"]
  },
  "cyberpunk_anime": {
    label: "Cyberpunk Sci-Fi Anime",
    roleText: "cyberpunk and futuristic sci-fi anime",
    tags: ["masterpiece", "best quality", "cyberpunk anime", "neon glow aesthetic", "futuristic tech fashion", "vibrant volumetric lighting"]
  }
};

/* ===========================
   CONFIGURATION: BUILT-IN TOOLS
=========================== */

const BUILTIN_TOOLS = [
  {
    id: "image_tag_writer",
    name: "Image Tag Prompt Writer",
    icon: "bi-tags-fill",
    badge: "Built-in",
    description: "Converts character descriptions into optimized, concise Danbooru-style tag prompts for SeaArt with art style selection.",
    hasArtStyleSelect: true,
    instructionTemplate: `{
  "role": "You are a veteran {{ART_STYLE_ROLE}} prompt engineer specializing in concise Danbooru-style tag prompts for SeaArt. Your job is to convert any character description into an optimized, tag-based image prompt that prioritizes visual quality while staying within SeaArt's prompt length limitations.",
  "rules": [
    "Output ONLY a single comma-separated positive prompt.",
    "Never explain your choices.",
    "Never use natural language sentences.",
    "Keep prompts concise. Every tag must add visual value.",
    "Focus ONLY on the upper body.",
    "Never describe legs, feet, lower body, full-body clothing, or anything below the waist.",
    "Always generate mature adult characters.",
    "Never generate children, teenagers, loli, shota, petite childlike proportions, or youthful wording.",
    "If the subject is female, always include 'adult woman' and 'big bust woman'.",
    "If the subject is male, always include 'adult man'.",
    "Use descriptive visual tags instead of storytelling.",
    "Prioritize important tags first.",
    "Never repeat tags.",
    "Never include camera settings unless requested.",
    "Avoid unnecessary quality spam like ultra HD, insane quality, 8k, award winning, etc.",
    "Keep within SeaArt token limitations."
  ],
  "promptOrder": [
    "art style",
    "composition",
    "subject",
    "appearance",
    "hair",
    "face",
    "eyes",
    "body type",
    "clothing visible above waist",
    "accessories",
    "pose",
    "expression",
    "lighting",
    "background"
  ],
  "requiredTags": {
    "artStyle": {{ART_STYLE_TAGS}},
    "composition": [
      "upper body",
      "close-up",
      "portrait",
      "centered composition"
    ]
  },
  "appearanceRules": [
    "Describe hairstyle before hair color.",
    "Describe eye shape before eye color.",
    "Describe facial features.",
    "Describe visible clothing only.",
    "Describe accessories only if visible."
  ],
  "poseRules": [
    "Use a single clear upper-body pose.",
    "Hands only if visible.",
    "Shoulders and head orientation should be specified."
  ],
  "expressionRules": [
    "One dominant facial expression.",
    "Optional secondary emotion if useful."
  ],
  "backgroundRules": [
    "Simple.",
    "Supports the character.",
    "Never dominates the composition."
  ],
  "negativeRequirements": [
    "full body",
    "lower body",
    "legs",
    "feet",
    "multiple characters",
    "child",
    "teen",
    "loli",
    "shota"
  ],
  "outputExample": "masterpiece, best quality, korean webtoon, anime illustration, upper body, close-up, portrait, centered composition, adult woman, big bust woman, long black hair, layered hair, amber eyes, sharp eyes, fair skin, black military jacket, silver earrings, hand touching hair, looking at viewer, confident smile, warm cinematic lighting, blurred modern city background"
}`,
    instruction: `Converts character descriptions into optimized Danbooru-style tag prompts for SeaArt according to the detailed rules and chosen art style.`,
    accessMemory: false,
    isBuiltin: true,
    starters: [
      "Generate SeaArt tag prompt for my character",
      "Convert: Sharp-witted rogue in dark leather jacket, layered black hair, amber eyes",
      "Generate tag prompt from attached character image",
      "Create male warrior upper-body portrait prompt"
    ]
  },
  {
    id: "review_bot",
    name: "Generation Review Bot",
    icon: "bi-clipboard-check-fill",
    badge: "Built-in",
    description: "Critiques, polishes, and suggests sensory-grounded improvements for your character, scenario, and roleplay setups.",
    instruction: `You are an elite creative writing editor, character consultant, and roleplay critic.
Analyze the user's roleplay character concepts, premises, and scenarios.
Provide thoughtful, constructive, and highly actionable critiques.
Check for:
1. Pacing and emotional resonance.
2. Authentic character voice and subtext.
3. Sensory grounding (textures, scent, temperature, tactile interactions).
4. Cliches and overused fantasy/romance tropes.
When requested, rewrite or polish sections to demonstrate higher quality, visceral prose.`,
    accessMemory: false,
    isBuiltin: true,
    starters: [
      "Review my active character description",
      "How can I improve sensory details in my scenario?",
      "Suggest 3 secrets or flaws to deepen this character",
      "Check the opening dialogue hook for authentic voice"
    ]
  },
  {
    id: "roleplay_bot",
    name: "Roleplay Test Bot",
    icon: "bi-chat-heart-fill",
    badge: "Built-in",
    description: "Simulates an interactive roleplay session with you to test character personality, voice, and chemistry.",
    instruction: `You are an immersive, dynamic roleplay partner.
If memory access is enabled, step directly into the character (or an intriguing partner interacting with them) based on the main page data.
Stay completely in character. React organically with casual dialogue, tangible physical gestures, sensory details, and realistic emotion.
Keep responses engaging, grounded, and focused on driving the scene forward without excessive monologue.`,
    accessMemory: false,
    isBuiltin: true,
    starters: [
      "Let's test out the opening roleplay scene",
      "Introduce yourself in character",
      "React to me arriving late in the rain",
      "What are you doing when I walk in?"
    ]
  },
  {
    id: "dialogue_bot",
    name: "Dialogue & Banter Coach",
    icon: "bi-chat-quote-fill",
    badge: "Built-in",
    description: "Crafts sharp, authentic, and tension-filled dialogue, natural banter, and conflict exchanges.",
    instruction: `You are an expert scriptwriter and dialogue specialist.
You help users write natural, punchy dialogue with high subtext, witty banter, or raw emotional conflict.
Keep lines grounded and authentic. Avoid purple prose, exposition dumping, or melodrama.
Focus on rhythm, pauses, and the unsaid friction between characters.`,
    accessMemory: false,
    isBuiltin: true,
    starters: [
      "Write 5 witty banter lines between rivals",
      "Draft a tense argument about a hidden truth",
      "Give me dialogue showing reluctant attraction",
      "How would this character speak when cornered?"
    ]
  },
  {
    id: "worldbuilder_bot",
    name: "Lore & Worldbuilder",
    icon: "bi-compass-fill",
    badge: "Built-in",
    description: "Expands factions, localized jargon, magic/tech rules, historical events, and atmospheric flavor.",
    instruction: `You are a master worldbuilding architect and lore consultant.
You develop rich, tangible lore, underground factions, cultural mannerisms, local rumors, and atmospheric environmental details.
Ensure everything you create feels lived-in, concrete, and directly relevant to character motivations and conflict.`,
    accessMemory: false,
    isBuiltin: true,
    starters: [
      "Invent 3 local rumors or city legends",
      "Create a rival faction with distinct motives",
      "Describe a high-atmosphere local meeting spot",
      "Develop a unique cultural taboo or habit"
    ]
  }
];

/* ===========================
   GLOBAL STATE
=========================== */

let activeToolId = null;
let activeToolChatHistory = {};
let activeChatStreamObj = null;
let currentChatImageBlob = null;
let editingToolId = null;
let activeArtStyle = "anime_webtoon";

/* ===========================
   INITIALIZATION
=========================== */

function initToolsEngine() {
  renderToolsCatalog();
  setupToolsEventListeners();
}

/* ===========================
   EVENT LISTENERS
=========================== */

function setupToolsEventListeners() {
  const searchInput = document.getElementById("toolsSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      filterToolsCatalog(this.value.trim().toLowerCase());
    });
  }

  const chatInput = document.getElementById("toolChatInput");
  if (chatInput) {
    chatInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendToolChatMessage();
      }
    });
    chatInput.addEventListener("input", function() {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 140) + "px";
    });
  }

  const fileInput = document.getElementById("toolChatImageInput");
  if (fileInput) {
    fileInput.addEventListener("change", function() {
      if (this.files && this.files[0]) {
        attachChatImage(this.files[0]);
      }
    });
  }

  const memoryToggle = document.getElementById("toolChatMemoryToggle");
  if (memoryToggle) {
    memoryToggle.addEventListener("click", function() {
      toggleActiveToolMemory();
    });
  }

  const artStyleSelect = document.getElementById("toolChatArtStyleSelect");
  if (artStyleSelect) {
    artStyleSelect.addEventListener("change", function() {
      handleChatArtStyleChange(this.value);
    });
  }
}

/* ===========================
   CORE LOGIC: TOOLS DATA & STORAGE
=========================== */

function getCustomTools() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_TOOLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomTools(tools) {
  try {
    localStorage.setItem(STORAGE_CUSTOM_TOOLS_KEY, JSON.stringify(tools));
  } catch (e) {}
}

function getAllTools() {
  const custom = getCustomTools();
  return [...BUILTIN_TOOLS, ...custom];
}

function getToolById(id) {
  return getAllTools().find(t => t.id === id) || null;
}

function saveCustomTool(toolData) {
  const tools = getCustomTools();
  const existingIdx = tools.findIndex(t => t.id === toolData.id);

  if (existingIdx >= 0) {
    tools[existingIdx] = { ...tools[existingIdx], ...toolData };
  } else {
    tools.push({
      ...toolData,
      id: "tool_" + Date.now(),
      badge: "Custom",
      isBuiltin: false,
      starters: toolData.starters || ["How can you help me?", "Analyze my current project"]
    });
  }

  saveCustomTools(tools);
  renderToolsCatalog();
  return toolData;
}

function deleteCustomTool(toolId) {
  let tools = getCustomTools();
  tools = tools.filter(t => t.id !== toolId);
  saveCustomTools(tools);
  if (activeToolId === toolId) {
    closeToolChat();
  }
  renderToolsCatalog();
}

/* ===========================
   CORE LOGIC: MEMORY ACCESS SYNTHESIZER
=========================== */

function gatherMainPageContext() {
  const parts = [];

  const descNotes = document.getElementById("customFeaturesEl")?.value?.trim();
  if (descNotes) parts.push(`[Character Design Notes]:\n${descNotes}`);

  const descOutput = document.getElementById("outputEl")?.innerText?.trim();
  if (descOutput) parts.push(`[Active Generated Character Description]:\n${descOutput}`);

  if (window.toneSelector && typeof window.toneSelector.getTags === "function") {
    const tones = window.toneSelector.getTags();
    if (tones && tones.length) parts.push(`[Selected Roleplay Tones]: ${tones.join(", ")}`);
  }

  if (window.worldSettingSelector && typeof window.worldSettingSelector.getTags === "function") {
    const settings = window.worldSettingSelector.getTags();
    if (settings && settings.length) parts.push(`[Selected World Settings]: ${settings.join(", ")}`);
  }

  const scenarioNotes = document.getElementById("customScenarioFeaturesEl")?.value?.trim();
  if (scenarioNotes) parts.push(`[Scenario Outline Notes]:\n${scenarioNotes}`);

  const scenarioOutput = document.getElementById("scenarioOutputEl")?.innerText?.trim();
  if (scenarioOutput) parts.push(`[Active Scenario Description]:\n${scenarioOutput}`);

  const roleplayStartNotes = document.getElementById("customRoleplayStartFeaturesEl")?.value?.trim();
  if (roleplayStartNotes) parts.push(`[Roleplay Start Notes]:\n${roleplayStartNotes}`);

  const roleplayStartOutput = document.getElementById("roleplayStartOutputEl")?.innerText?.trim();
  if (roleplayStartOutput) parts.push(`[Active Roleplay Start Scene]:\n${roleplayStartOutput}`);

  const behaviorNotes = document.getElementById("customBehaviorFeaturesEl")?.value?.trim();
  if (behaviorNotes) parts.push(`[Behavior Notes]:\n${behaviorNotes}`);

  const behaviorOutput = document.getElementById("behaviorOutputEl")?.innerText?.trim();
  if (behaviorOutput) parts.push(`[Active Behavior Examples]:\n${behaviorOutput}`);

  if (!parts.length) {
    return "No character or scenario content has been generated on the main page yet.";
  }

  return parts.join("\n\n");
}

/* ===========================
   CORE LOGIC: CHAT & AI STREAMING
=========================== */

async function sendToolChatMessage(starterText) {
  const tool = getToolById(activeToolId);
  if (!tool) return;

  const chatInput = document.getElementById("toolChatInput");
  const text = starterText || (chatInput ? chatInput.value.trim() : "");
  const imageBlob = currentChatImageBlob;

  if (!text && !imageBlob) return;

  if (chatInput) {
    chatInput.value = "";
    chatInput.style.height = "auto";
  }

  clearChatImage();

  if (!activeToolChatHistory[activeToolId]) {
    activeToolChatHistory[activeToolId] = [];
  }

  const userMsg = {
    id: "msg_" + Date.now(),
    role: "user",
    content: text,
    imageUrl: imageBlob ? URL.createObjectURL(imageBlob) : null,
    time: Date.now()
  };
  activeToolChatHistory[activeToolId].push(userMsg);
  appendMessageToFeed(userMsg);

  const assistantMsgId = "msg_asst_" + Date.now();
  const assistantMsg = {
    id: assistantMsgId,
    role: "assistant",
    content: "",
    time: Date.now()
  };
  activeToolChatHistory[activeToolId].push(assistantMsg);
  const msgBubbleEl = appendAssistantPlaceholder(assistantMsgId);

  scrollToChatBottom();
  setChatGeneratingState(true);

  // Build System & Context Payload
  let effectiveInstruction = tool.instruction;
  if (tool.hasArtStyleSelect && tool.instructionTemplate) {
    const preset = ART_STYLE_PRESETS[activeArtStyle] || ART_STYLE_PRESETS["anime_webtoon"];
    effectiveInstruction = tool.instructionTemplate
      .replace("{{ART_STYLE_ROLE}}", preset.roleText)
      .replace("{{ART_STYLE_TAGS}}", JSON.stringify(preset.tags, null, 2));
  }

  let systemPrompt = `[TOOL INSTRUCTION - ${tool.name}]\n${effectiveInstruction}\n`;

  if (tool.accessMemory) {
    const memoryContext = gatherMainPageContext();
    systemPrompt += `\n[MAIN PAGE GENERATOR MEMORY (ACTIVE STATE)]:\n${memoryContext}\n`;
  } else {
    systemPrompt += `\n[NOTE: Memory access to the main page is currently OFF. Answer generally or based solely on conversation context unless the user explicitly asks you to turn it on.]\n`;
  }

  // Conversation history string
  let historyText = "";
  const history = activeToolChatHistory[activeToolId].slice(-8, -1);
  history.forEach(m => {
    historyText += `${m.role === "user" ? "User" : tool.name}: ${m.content}\n`;
  });

  const fullInstruction = `${systemPrompt}\n[CONVERSATION HISTORY]\n${historyText}\nUser: ${text}\n${tool.name}:`;
  const instructionPayload = imageBlob ? [fullInstruction, imageBlob] : fullInstruction;

  try {
    if (typeof window.ai === "function") {
      activeChatStreamObj = window.ai({
        instruction: instructionPayload,
        onChunk: function(data) {
          if (data && typeof data.fullTextSoFar === "string") {
            assistantMsg.content = data.fullTextSoFar;
            renderMessageContent(msgBubbleEl, assistantMsg.content, true);
            scrollToChatBottom();
          }
        }
      });

      const res = await activeChatStreamObj;
      const finalText = (res && typeof res === "object" && res.text) ? res.text : String(res || assistantMsg.content || "");
      assistantMsg.content = finalText;
      renderMessageContent(msgBubbleEl, assistantMsg.content, false);
    } else {
      await simulateFallbackResponse(tool, text, imageBlob, assistantMsg, msgBubbleEl);
    }
  } catch (err) {
    assistantMsg.content = `[Generation error: ${err.message || "Unable to reach AI generator"}]`;
    renderMessageContent(msgBubbleEl, assistantMsg.content, false);
  } finally {
    setChatGeneratingState(false);
    activeChatStreamObj = null;
    scrollToChatBottom();
  }
}

function stopChatStreaming() {
  if (activeChatStreamObj && typeof activeChatStreamObj.stop === "function") {
    activeChatStreamObj.stop();
  }
  setChatGeneratingState(false);
}

/* FALLBACK SIMULATOR FOR LOCAL OFFLINE TESTING */
async function simulateFallbackResponse(tool, userText, imageBlob, assistantMsg, bubbleEl) {
  let sampleText = "";
  if (tool.id === "image_tag_writer") {
    const preset = ART_STYLE_PRESETS[activeArtStyle] || ART_STYLE_PRESETS["anime_webtoon"];
    const stylePrefix = preset.tags.join(", ");
    const isMale = /\b(male|man|guy|warrior|knight|lord)\b/i.test(userText);
    if (isMale) {
      sampleText = `${stylePrefix}, upper body, close-up, portrait, centered composition, adult man, short messy black hair, undercut hairstyle, sharp amber eyes, intense gaze, fair skin, black leather combat jacket, silver ear cuff, hand adjusting collar, looking at viewer, calm smirk, warm cinematic lighting, dark textured urban background`;
    } else {
      sampleText = `${stylePrefix}, upper body, close-up, portrait, centered composition, adult woman, big bust woman, long black hair, layered hair, amber eyes, sharp eyes, fair skin, black military jacket, silver earrings, hand touching hair, looking at viewer, confident smile, warm cinematic lighting, blurred modern city background`;
    }
  } else if (tool.id === "review_bot") {
    sampleText = `### Critique & Polish Analysis\n\n**1. Strengths:** The concept has compelling core tension and clear stakes.\n**2. Sensory Grounding:** You can heighten the impact by anchoring interactions in tactile textures—describe the damp chill in the air, the friction of worn fabric, or hesitant touch.\n**3. Authentic Voice:** Ensure dialogue remains conversational and avoids exposition. Ground every reaction in immediate physical cues.\n\n*Ready to polish any specific section? Just send it over!*`;
  } else if (tool.id === "roleplay_bot") {
    sampleText = `*I glance up as the door clicks shut, leaning back against the wooden counter. The rain drums heavily against the window behind me, casting cold reflections across the floor.*\n\n"You took your time getting here," *I say quietly, watching you with an unreadable expression.* "Tell me you weren't followed."`;
  } else if (imageBlob) {
    sampleText = `I've inspected the attached image. The visual design shows strong atmospheric lighting and distinctive character styling. We can weave these exact visual details directly into the character's wardrobe and demeanor.`;
  } else {
    sampleText = `I've analyzed your prompt regarding "${userText.slice(0, 35)}...". Here are 3 punchy, sensory-grounded creative directions you can immediately incorporate into your roleplay setup.`;
  }

  const words = sampleText.split(" ");
  let accumulated = "";
  for (let i = 0; i < words.length; i++) {
    accumulated += (i === 0 ? "" : " ") + words[i];
    assistantMsg.content = accumulated;
    renderMessageContent(bubbleEl, accumulated, true);
    await new Promise(r => setTimeout(r, 25));
  }
  renderMessageContent(bubbleEl, accumulated, false);
}

/* ===========================
   UI LOGIC: CATALOG VIEW
=========================== */

function renderToolsCatalog(filterQuery = "") {
  const grid = document.getElementById("toolsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const allTools = getAllTools();
  const filtered = allTools.filter(tool => {
    if (!filterQuery) return true;
    return tool.name.toLowerCase().includes(filterQuery) ||
           tool.description.toLowerCase().includes(filterQuery);
  });

  // 1. Render Tool Cards
  filtered.forEach(tool => {
    const card = document.createElement("div");
    card.className = "c-tool-card-item";
    card.innerHTML = `
      <div class="c-tool-card-item__top">
        <div class="c-tool-card-item__icon">
          <i class="bi ${tool.icon || 'bi-cpu-fill'}"></i>
        </div>
        <div class="c-tool-card-item__badges">
          <span class="c-tool-badge ${tool.isBuiltin ? 'c-tool-badge--builtin' : 'c-tool-badge--custom'}">${tool.badge || 'Tool'}</span>
          ${tool.accessMemory ? '<span class="c-tool-badge c-tool-badge--memory" title="Memory Access Enabled"><i class="bi bi-memory"></i> Memory</span>' : ''}
        </div>
      </div>
      <div class="c-tool-card-item__name">${escapeHtml(tool.name)}</div>
      <div class="c-tool-card-item__desc">${escapeHtml(tool.description)}</div>
      <div class="c-tool-card-item__bottom">
        <button type="button" class="c-button c-button--generate" style="padding: 5px 12px; font-size: 0.8rem;" onclick="window.openToolChat('${tool.id}')">
          <i class="bi bi-chat-dots-fill"></i> Chat
        </button>
        <div class="c-tool-card-item__actions">
          ${!tool.isBuiltin ? `
            <button type="button" class="c-chat-msg-action-btn" title="Edit Tool" onclick="event.stopPropagation(); window.openToolEditorModal('${tool.id}')"><i class="bi bi-pencil"></i></button>
            <button type="button" class="c-chat-msg-action-btn" title="Delete Tool" onclick="event.stopPropagation(); window.confirmDeleteTool('${tool.id}')"><i class="bi bi-trash"></i></button>
          ` : `
            <button type="button" class="c-chat-msg-action-btn" title="View Instructions" onclick="event.stopPropagation(); window.openToolEditorModal('${tool.id}')"><i class="bi bi-info-circle"></i></button>
          `}
        </div>
      </div>
    `;
    card.addEventListener("click", (e) => {
      if (!e.target.closest("button")) {
        openToolChat(tool.id);
      }
    });
    grid.appendChild(card);
  });

  // 2. Render "+ Create Custom Tool" Card
  const createCard = document.createElement("div");
  createCard.className = "c-tool-card-item c-tool-card-item--create";
  createCard.innerHTML = `
    <div class="c-tool-card-item--create-icon"><i class="bi bi-plus-circle-fill"></i></div>
    <div class="c-tool-card-item--create-title">Create New AI Tool</div>
    <div class="c-tool-card-item--create-desc">Build a custom specialized bot with custom instructions & memory access.</div>
  `;
  createCard.addEventListener("click", () => openToolEditorModal());
  grid.appendChild(createCard);
}

function filterToolsCatalog(query) {
  renderToolsCatalog(query);
}

/* ===========================
   UI LOGIC: CHATBOT VIEW
=========================== */

function openToolChat(toolId) {
  const tool = getToolById(toolId);
  if (!tool) return;

  activeToolId = toolId;

  const catalogView = document.getElementById("toolsCatalogView");
  const chatView = document.getElementById("toolsChatView");

  if (catalogView && chatView) {
    catalogView.classList.add("u-hidden");
    chatView.classList.remove("u-hidden");
  }

  // Update Header
  const nameEl = document.getElementById("toolChatHeaderName");
  const descEl = document.getElementById("toolChatHeaderDesc");
  const avatarEl = document.getElementById("toolChatHeaderAvatar");
  const inputEl = document.getElementById("toolChatInput");

  if (nameEl) nameEl.textContent = tool.name;
  if (descEl) descEl.textContent = tool.description;
  if (avatarEl) avatarEl.innerHTML = `<i class="bi ${tool.icon || 'bi-cpu-fill'}"></i>`;
  if (inputEl) inputEl.placeholder = `Message ${tool.name}...`;

  const artStyleCtn = document.getElementById("toolChatArtStyleCtn");
  const artStyleSelect = document.getElementById("toolChatArtStyleSelect");
  if (tool.hasArtStyleSelect) {
    if (artStyleCtn) artStyleCtn.classList.remove("u-hidden");
    if (artStyleSelect) {
      populateArtStyleDropdown(artStyleSelect);
      artStyleSelect.value = activeArtStyle;
    }
  } else {
    if (artStyleCtn) artStyleCtn.classList.add("u-hidden");
  }

  updateChatMemoryToggleUI(tool.accessMemory);
  renderChatFeed(tool);
  clearChatImage();

  if (inputEl) inputEl.focus();
}

function closeToolChat() {
  activeToolId = null;
  const catalogView = document.getElementById("toolsCatalogView");
  const chatView = document.getElementById("toolsChatView");

  if (catalogView && chatView) {
    chatView.classList.add("u-hidden");
    catalogView.classList.remove("u-hidden");
  }
}

function updateChatMemoryToggleUI(enabled) {
  const toggleControl = document.getElementById("toolChatMemoryToggle");
  const statusLabel = document.getElementById("toolChatMemoryStatusLabel");

  if (toggleControl) {
    toggleControl.classList.toggle("is-active", !!enabled);
  }
  if (statusLabel) {
    statusLabel.innerHTML = enabled
      ? '<i class="bi bi-link-45deg"></i> Memory: Connected'
      : '<i class="bi bi-slash-circle"></i> Memory: Off';
  }
}

function toggleActiveToolMemory() {
  const tool = getToolById(activeToolId);
  if (!tool) return;

  tool.accessMemory = !tool.accessMemory;

  if (!tool.isBuiltin) {
    saveCustomTool(tool);
  }

  updateChatMemoryToggleUI(tool.accessMemory);

  const feed = document.getElementById("toolChatFeed");
  if (feed) {
    const notice = document.createElement("div");
    notice.style.textAlign = "center";
    notice.style.fontSize = "0.75rem";
    notice.style.color = tool.accessMemory ? "var(--color-primary)" : "var(--color-text-muted)";
    notice.style.padding = "4px 0";
    notice.innerHTML = tool.accessMemory
      ? '<i class="bi bi-check-circle-fill"></i> Memory connected: Assistant can now inspect character & scenario data from main page.'
      : '<i class="bi bi-info-circle"></i> Memory disconnected: Assistant is now running independently.';
    feed.appendChild(notice);
    scrollToChatBottom();
  }
}

function renderChatFeed(tool) {
  const feed = document.getElementById("toolChatFeed");
  if (!feed) return;

  feed.innerHTML = "";

  const messages = activeToolChatHistory[tool.id] || [];

  if (messages.length === 0) {
    const welcome = document.createElement("div");
    welcome.className = "c-tool-chat-welcome";
    welcome.innerHTML = `
      <div class="c-tool-chat-welcome__icon"><i class="bi ${tool.icon || 'bi-robot'}"></i></div>
      <div class="c-tool-chat-welcome__title">${escapeHtml(tool.name)}</div>
      <div class="c-tool-chat-welcome__text">${escapeHtml(tool.description)}</div>
      <div class="c-tool-chat-starters">
        ${(tool.starters || []).map(st => `
          <button type="button" class="c-tool-chat-starter-btn" onclick="window.sendToolChatMessage('${escapeHtml(st)}')">
            <span>"${escapeHtml(st)}"</span>
            <i class="bi bi-arrow-right-short"></i>
          </button>
        `).join("")}
      </div>
    `;
    feed.appendChild(welcome);
  } else {
    messages.forEach(msg => {
      if (msg.role === "user") {
        appendMessageToFeed(msg);
      } else {
        const bubbleEl = appendAssistantPlaceholder(msg.id);
        renderMessageContent(bubbleEl, msg.content, false);
      }
    });
  }

  scrollToChatBottom();
}

function appendMessageToFeed(msg) {
  const feed = document.getElementById("toolChatFeed");
  if (!feed) return;

  const row = document.createElement("div");
  row.className = `c-chat-msg c-chat-msg--${msg.role}`;
  row.id = msg.id;

  const isUser = msg.role === "user";
  const avatarHtml = isUser
    ? `<div class="c-chat-msg__avatar"><i class="bi bi-person-fill"></i></div>`
    : `<div class="c-chat-msg__avatar"><i class="bi bi-cpu-fill"></i></div>`;

  row.innerHTML = `
    ${avatarHtml}
    <div class="c-chat-msg__content-wrapper">
      <div class="c-chat-msg__bubble">
        ${msg.imageUrl ? `<img src="${msg.imageUrl}" class="c-chat-msg__attached-image" alt="Attached preview">` : ''}
        <div class="c-chat-msg__text">${escapeHtml(msg.content)}</div>
      </div>
    </div>
  `;

  feed.appendChild(row);
}

function appendAssistantPlaceholder(msgId) {
  const feed = document.getElementById("toolChatFeed");
  if (!feed) return null;

  const tool = getToolById(activeToolId);
  const row = document.createElement("div");
  row.className = "c-chat-msg c-chat-msg--assistant";
  row.id = msgId;

  const isTagWriter = activeToolId === "image_tag_writer";

  row.innerHTML = `
    <div class="c-chat-msg__avatar"><i class="bi ${tool?.icon || 'bi-cpu-fill'}"></i></div>
    <div class="c-chat-msg__content-wrapper">
      <div class="c-chat-msg__bubble">
        <div class="c-chat-msg__text"><span class="c-chat-typing-indicator"></span></div>
      </div>
      <div class="c-chat-msg__actions">
        <button type="button" class="c-chat-msg-action-btn" title="Copy response" onclick="window.copyChatMessage('${msgId}')">
          <i class="bi bi-clipboard"></i> ${isTagWriter ? 'Copy Tags' : 'Copy'}
        </button>
        ${isTagWriter ? `
        <button type="button" class="c-chat-msg-action-btn c-chat-msg-action-btn--apply" title="Apply this tag prompt to the Character Generator art field" onclick="window.applyTagPromptToMainPage('${msgId}')">
          <i class="bi bi-palette2"></i> Apply to Art Generator
        </button>
        ` : ''}
      </div>
    </div>
  `;

  feed.appendChild(row);
  return row.querySelector(".c-chat-msg__text");
}

function renderMessageContent(containerEl, content, isStreaming) {
  if (!containerEl) return;

  let formatted = formatMarkdownContent(content);
  if (isStreaming) {
    formatted += '<span class="c-chat-typing-indicator"></span>';
  }
  containerEl.innerHTML = formatted;
}

function setChatGeneratingState(generating) {
  const sendBtn = document.getElementById("toolChatSendBtn");
  const stopBtn = document.getElementById("toolChatStopBtn");

  if (sendBtn && stopBtn) {
    if (generating) {
      sendBtn.classList.add("u-hidden");
      stopBtn.classList.remove("u-hidden");
    } else {
      stopBtn.classList.add("u-hidden");
      sendBtn.classList.remove("u-hidden");
    }
  }
}

function scrollToChatBottom() {
  const feed = document.getElementById("toolChatFeed");
  if (feed) {
    feed.scrollTop = feed.scrollHeight;
  }
}

function clearChatHistory() {
  if (!activeToolId) return;
  activeToolChatHistory[activeToolId] = [];
  const tool = getToolById(activeToolId);
  if (tool) renderChatFeed(tool);
}

/* ===========================
   UI LOGIC: VISION AI ATTACHMENTS
=========================== */

function triggerChatImageUpload() {
  const input = document.getElementById("toolChatImageInput");
  if (input) input.click();
}

function attachChatImage(file) {
  if (!file || !file.type.startsWith("image/")) return;
  currentChatImageBlob = file;

  const previewBar = document.getElementById("toolChatImagePreviewBar");
  const previewThumb = document.getElementById("toolChatImagePreviewThumb");
  const previewName = document.getElementById("toolChatImagePreviewName");

  if (previewBar && previewThumb && previewName) {
    previewThumb.src = URL.createObjectURL(file);
    previewName.textContent = file.name;
    previewBar.classList.remove("u-hidden");
  }
}

function clearChatImage() {
  currentChatImageBlob = null;
  const input = document.getElementById("toolChatImageInput");
  const previewBar = document.getElementById("toolChatImagePreviewBar");
  const previewThumb = document.getElementById("toolChatImagePreviewThumb");

  if (input) input.value = "";
  if (previewThumb && previewThumb.src && previewThumb.src.startsWith("blob:")) {
    URL.revokeObjectURL(previewThumb.src);
    previewThumb.src = "";
  }
  if (previewBar) previewBar.classList.add("u-hidden");
}

/* ===========================
   UI LOGIC: TOOL BUILDER MODAL
=========================== */

function openToolEditorModal(toolId = null) {
  editingToolId = toolId;
  const modal = document.getElementById("toolEditorModalOverlay");
  const titleEl = document.getElementById("toolEditorModalTitle");
  const nameInput = document.getElementById("toolEditorNameInput");
  const descInput = document.getElementById("toolEditorDescInput");
  const instructionInput = document.getElementById("toolEditorInstructionInput");
  const memorySwitch = document.getElementById("toolEditorMemorySwitch");
  const saveBtn = document.getElementById("toolEditorSaveBtn");

  const existingTool = toolId ? getToolById(toolId) : null;

  if (existingTool) {
    if (titleEl) titleEl.textContent = existingTool.isBuiltin ? `Inspect Tool: ${existingTool.name}` : `Edit Tool: ${existingTool.name}`;
    if (nameInput) {
      nameInput.value = existingTool.name;
      nameInput.disabled = existingTool.isBuiltin;
    }
    if (descInput) {
      descInput.value = existingTool.description;
      descInput.disabled = existingTool.isBuiltin;
    }
    if (instructionInput) {
      instructionInput.value = existingTool.instruction;
      instructionInput.disabled = existingTool.isBuiltin;
    }
    if (memorySwitch) memorySwitch.checked = !!existingTool.accessMemory;
    if (saveBtn) saveBtn.style.display = existingTool.isBuiltin ? "none" : "block";
    selectToolModalIcon(existingTool.icon || "bi-cpu-fill");
  } else {
    if (titleEl) titleEl.textContent = "Create New AI Tool";
    if (nameInput) {
      nameInput.value = "";
      nameInput.disabled = false;
    }
    if (descInput) {
      descInput.value = "";
      descInput.disabled = false;
    }
    if (instructionInput) {
      instructionInput.value = "";
      instructionInput.disabled = false;
    }
    if (memorySwitch) memorySwitch.checked = false; // default off as requested
    if (saveBtn) saveBtn.style.display = "block";
    selectToolModalIcon("bi-robot");
  }

  if (modal) modal.classList.remove("u-hidden");
}

function closeToolEditorModal() {
  editingToolId = null;
  const modal = document.getElementById("toolEditorModalOverlay");
  if (modal) modal.classList.add("u-hidden");
}

function selectToolModalIcon(iconClass) {
  const options = document.querySelectorAll(".c-tool-icon-option");
  options.forEach(opt => {
    const match = opt.getAttribute("data-icon") === iconClass;
    opt.classList.toggle("is-selected", match);
  });
}

function submitToolEditorForm() {
  const nameInput = document.getElementById("toolEditorNameInput");
  const descInput = document.getElementById("toolEditorDescInput");
  const instructionInput = document.getElementById("toolEditorInstructionInput");
  const memorySwitch = document.getElementById("toolEditorMemorySwitch");
  const selectedIconEl = document.querySelector(".c-tool-icon-option.is-selected");

  const name = nameInput ? nameInput.value.trim() : "";
  const desc = descInput ? descInput.value.trim() : "";
  const instruction = instructionInput ? instructionInput.value.trim() : "";
  const accessMemory = memorySwitch ? memorySwitch.checked : false;
  const icon = selectedIconEl ? selectedIconEl.getAttribute("data-icon") : "bi-robot";

  if (!name || !instruction) {
    alert("Please enter both a Tool Name and System Instructions.");
    return;
  }

  const toolPayload = {
    id: editingToolId || ("tool_" + Date.now()),
    name: name,
    description: desc || "Custom specialized AI assistant",
    instruction: instruction,
    accessMemory: accessMemory,
    icon: icon
  };

  saveCustomTool(toolPayload);
  closeToolEditorModal();
}

function confirmDeleteTool(toolId) {
  const tool = getToolById(toolId);
  if (!tool) return;
  if (confirm(`Are you sure you want to delete "${tool.name}"?`)) {
    deleteCustomTool(toolId);
  }
}

/* ===========================
   UTILITIES
========================== */

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMarkdownContent(text) {
  if (!text) return "";

  // 1. Code blocks
  let html = text.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // 2. Inline code
  html = html.replace(/`([^`]+)`/g, (match, inline) => {
    return `<code>${escapeHtml(inline)}</code>`;
  });

  // 3. Headers
  html = html.replace(/^### (.*$)/gim, '<b style="font-size:1.05rem; display:block; margin:6px 0 2px 0;">$1</b>');
  html = html.replace(/^## (.*$)/gim, '<b style="font-size:1.15rem; display:block; margin:8px 0 4px 0; color:var(--color-primary);">$1</b>');

  // 4. Bold and Italics
  html = html.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  html = html.replace(/\*([^*]+)\*/g, '<i>$1</i>');

  // 5. Line breaks and paragraphs
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');

  return html;
}

function copyChatMessage(msgId) {
  const msgRow = document.getElementById(msgId);
  if (!msgRow) return;
  const bubble = msgRow.querySelector(".c-chat-msg__text");
  if (!bubble) return;

  const text = bubble.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = msgRow.querySelector(".c-chat-msg-action-btn");
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
      setTimeout(() => btn.innerHTML = orig, 1500);
    }
  });
}

/* ===========================
   UI LOGIC: ART STYLE & PROMPT ACTIONS
=========================== */

function populateArtStyleDropdown(selectEl) {
  if (!selectEl || selectEl.children.length > 0) return;
  selectEl.innerHTML = Object.entries(ART_STYLE_PRESETS)
    .map(([key, item]) => `<option value="${key}">${item.label}</option>`)
    .join("");
}

function handleChatArtStyleChange(key) {
  if (ART_STYLE_PRESETS[key]) {
    activeArtStyle = key;
    const feed = document.getElementById("toolChatFeed");
    if (feed) {
      const notice = document.createElement("div");
      notice.style.textAlign = "center";
      notice.style.fontSize = "0.75rem";
      notice.style.color = "var(--color-primary)";
      notice.style.padding = "4px 0";
      notice.innerHTML = `<i class="bi bi-palette-fill"></i> Art style set to <b>${ART_STYLE_PRESETS[key].label}</b>. Tag prompts will adapt to this aesthetic.`;
      feed.appendChild(notice);
      scrollToChatBottom();
    }
  }
}

function applyTagPromptToMainPage(msgId) {
  const msgRow = document.getElementById(msgId);
  if (!msgRow) return;
  const textEl = msgRow.querySelector(".c-chat-msg__text");
  if (!textEl) return;

  let rawText = textEl.innerText || textEl.textContent || "";
  rawText = rawText.replace(/^["'`]|["'`]$/g, "").trim();

  if (typeof window.onArtPromptInput === "function") {
    window.onArtPromptInput(rawText);
  } else {
    window.overwrittenVisualKeyphrasesText = rawText;
  }

  const textarea = document.getElementById("imagePromptTextarea");
  if (textarea) {
    textarea.value = rawText;
  }

  const applyBtn = msgRow.querySelector(".c-chat-msg-action-btn--apply");
  if (applyBtn) {
    const origHtml = applyBtn.innerHTML;
    applyBtn.innerHTML = '<i class="bi bi-check-lg"></i> Applied to Generator!';
    applyBtn.style.color = "var(--color-success, #22c55e)";
    setTimeout(() => {
      applyBtn.innerHTML = origHtml;
      applyBtn.style.color = "";
    }, 2000);
  }
}

/* ===========================
   EXPORTS
=========================== */

window.initToolsEngine = initToolsEngine;
window.openToolChat = openToolChat;
window.closeToolChat = closeToolChat;
window.sendToolChatMessage = sendToolChatMessage;
window.stopChatStreaming = stopChatStreaming;
window.clearChatHistory = clearChatHistory;
window.triggerChatImageUpload = triggerChatImageUpload;
window.clearChatImage = clearChatImage;
window.openToolEditorModal = openToolEditorModal;
window.closeToolEditorModal = closeToolEditorModal;
window.submitToolEditorForm = submitToolEditorForm;
window.selectToolModalIcon = selectToolModalIcon;
window.confirmDeleteTool = confirmDeleteTool;
window.copyChatMessage = copyChatMessage;
window.handleChatArtStyleChange = handleChatArtStyleChange;
window.applyTagPromptToMainPage = applyTagPromptToMainPage;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initToolsEngine);
} else {
  initToolsEngine();
}
