    // ─── PERCHANCE CONTEXT STANDALONE MOCK ────────────────────────────────
    // This allows the HTML file to run and be tested standalone in a local browser,
    // while seamlessly using the live Perchance engine bindings when compiled online.
    if (typeof window.root === "undefined") {
        console.info("🔧 Supreme Character Description: Running in standalone local context. Injected developer mocks for Perchance engine.");
        
        window.root = {
            settingPrompts: {
                Any: { evaluateItem: "" },
                Fantasy: { evaluateItem: "The setting is a fantasy world with magic, mythical creatures, and ancient lore." },
                High_Fantasy: { evaluateItem: "The setting is an epic high fantasy world." },
                "Sci_Fi": { evaluateItem: "The setting is a science fiction universe with advanced technology." },
                Cyberpunk: { evaluateItem: "The setting is a near-future cyberpunk megalopolis  -  neon-lit, corporate-controlled." },
                "Real_World_Modern": { evaluateItem: "The setting is the contemporary real world." }
            },
            tonePrompts: {
                Any: { evaluateItem: "" },
                Grounded: { evaluateItem: "The tone is grounded and realistic." },
                Dark_Gritty: { evaluateItem: "The tone is dark and gritty." },
                Light_hearted_Comedic: { evaluateItem: "The tone is lighthearted and comedic." },
                Mysterious: { evaluateItem: "The tone is mysterious and atmospheric." }
            },
            prompts: new Proxy({
                role: { instruction: { evaluateItem: "You are writing the ROLE and RULES section." }, format: { evaluateItem: "Format: Role: ... Rules: ..." } },
                appearance: { instruction: { evaluateItem: "You are writing the APPEARANCE, ATTIRE, and ITEMS section." }, format: { evaluateItem: "Format: Appearance: ... Attire: ..." }, notes: { evaluateItem: "Be specific and visual." } },
                background: { instruction: { evaluateItem: "You are writing the BACKSTORY, OCCUPATION, RESIDENCE, SECRETS, SHORT-TERM GOALS, LONG-TERM GOALS, and SKILLS section." }, format: { evaluateItem: "Format: Backstory: ... Occupation: ..." } },
                personality: { instruction: { evaluateItem: "You are writing the PERSONALITY, SPEECH, BEHAVIOR, EMOTIONS, and INTERNAL CONFLICTS section." }, format: { evaluateItem: "Format: Personality: ... Speech: ..." } },
                beliefs: { instruction: { evaluateItem: "You are writing the MENTALITY, WORLD VIEW, BELIEFS, and MORALS section." }, format: { evaluateItem: "Format: Mentality: ... World View: ..." } },
                preferences: { instruction: { evaluateItem: "You are writing the LIKES, HATES, HOBBIES, VALUES, and ROMANCE section." }, format: { evaluateItem: "Format: Likes: ... Hates: ..." } },
                lore: {
                    instruction: { evaluateItem: "You are writing the LORE KEYWORDS and LORE CONTENT section for a character profile." },
                    format: { evaluateItem: "You MUST generate a strict JSON object containing between 4 and 5 lore entries. The keys of the JSON object must be strings \"1\", \"2\", \"3\", \"4\", \"5\". Each entry must contain a \"content\" string (the lore details) and a \"key\" array of strings (lowercase keywords/phrases that trigger this lore).\n\nJSON format example:\n{\n  \"1\": {\n    \"content\": \"Jasper once spilt an entire latte on a celebrity's shoes, earning him the nickname 'Cappuccino Calamity' at the coffee shop.\",\n    \"key\": [\"coffee\", \"barista\", \"spill\"]\n  },\n  \"2\": {\n    \"content\": \"Jasper's absolute favorite drink is a dark roast with a splash of oat milk.\",\n    \"key\": [\"oat milk\", \"espresso\", \"favorite drink\"]\n  }\n}" },
                    notes: { evaluateItem: "LORE Note:\n- Use short, clear lowercase keywords in the \"key\" array, tied to the character's personality, scenario, or setting.\n- Anticipate user phrasing; choose words with minimal synonyms to ensure exact matches.\n- Keep the lore \"content\" concise and interesting to enhance the character's quirks or context.\n- Avoid typos, as only exact matches are supported." },
                    footer: { evaluateItem: "Output ONLY the raw JSON object. Do not include any markdown formatting, do not wrap it in ```json, do not write any introductory or concluding text. Output a valid, parsable JSON string starting with { and ending with }." }
                },
                roleplay: { instruction: { evaluateItem: "You are writing the ROLEPLAY EXAMPLES section." }, format: { evaluateItem: "Format: <user>: ... CharacterName: ..." } },
                intro: { instruction: { evaluateItem: "You are writing the SCENE CONTEXT and ROLEPLAY INTRO SCRIPT section." }, format: { evaluateItem: "Format: Scene Context: ... Intro Script: ..." }, notes: { evaluateItem: "Focusing on Physical Reactions." } }
            }, {
                get: (target, prop) => {
                    if (prop in target) {
                        return new Proxy(target[prop], {
                            get: (t, p) => {
                                if (p in t) return t[p];
                                return { evaluateItem: "" };
                            }
                        });
                    }
                    return new Proxy({}, {
                        get: (t, p) => ({ evaluateItem: "" })
                    });
                }
            }),
            visualStyles: {
                selectAll: [
                    { getName: "Anime Portrait", "meta:tags": { basicAnime: 1 } },
                    { getName: "Fantasy Oil Painting", "meta:tags": { fantasyPortrait: 1 } },
                    { getName: "Cinematic Realistic", "meta:tags": { realistic: 1 } }
                ],
                "Anime Portrait": { prompt: { evaluateItem: "anime style, colorful" }, negative: { evaluateItem: "lowres, bad hands" } },
                "Fantasy Oil Painting": { prompt: { evaluateItem: "oil painting, highly detailed" }, negative: { evaluateItem: "modern, clean" } },
                "Cinematic Realistic": { prompt: { evaluateItem: "cinematic photo, realistic" }, negative: { evaluateItem: "cgi, 3d render" } }
            },
            image: function(promptData) {
                return {
                    evaluateItem: `<div class="imageWrapper" style="border-radius:6px; overflow:hidden; background:#222; aspect-ratio:2/3; display:flex; justify-content:center; align-items:center; color:#555; border:1px dashed #444;">
                        <iframe style="display:none;"></iframe>
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop" style="width:100%; height:100%; object-fit:cover;">
                    </div>`
                };
            },
            comments: function() { return "<div style='color:#555;'>[Comments section comments-plugin loaded in Perchance]</div>"; },
            commentsOptions: {},
            galleryOptions: {}
        };
        
        // Setup missing plugin functions so generator preview works locally
        if (typeof window.ai === "undefined") {
            window.ai = async function(options) {
                let instruction = options.instruction || "";
                let onChunk = options.onChunk;
                
                console.info("🤖 Mock AI called with instruction:", instruction);
                
                let responseText = "Simulated generated text for the requested section. Astraea Vance is a brilliantly resourceful systems engineer working within the solarpunk sectors. Her background is deeply tied to green technology integrations, and she stands ready to assist.";
                if (instruction.includes("missing identity fields")) {
                    responseText = JSON.stringify({
                        name: "Astraea Vance",
                        age: "24",
                        gender: "Female (she/her)",
                        orientation: "Bisexual",
                        species: "Human (augmented)",
                        ethnicity: "Neo-Grecian"
                    });
                } else if (instruction.includes("character chat interface bubble")) {
                    responseText = JSON.stringify({
                        css: ".bubble { background: #1e1e2e; color: #cdd6f4; border: 1px solid #cba6f7; }",
                        googleFont: "Outfit"
                    });
                } else if (instruction.includes("roleplay chat system")) {
                    responseText = JSON.stringify({
                        roleInstruction: "Astraea is an augmented human engineer in a solarpunk metropolis.",
                        loreEntries: [
                            "- Keywords: tea, jasmine, drink\n- Content: Astraea Vance loves high-grade jasmine tea and brews it with precision.",
                            "- Keywords: wrench, multi-wrench, gear\n- Content: Astraea carries a customized solarpunk mechanical multi-wrench at all times."
                        ]
                    });
                } else if (instruction.includes("OVERVIEW section")) {
                    responseText = "This is a comprehensive overview of the world. It details the physical geography, spanning from neon-lit high-altitude metropolises to decaying industrial lowlands. The weather patterns are unstable, often characterized by heavy radioactive rains and dense auroral fogs. Core societal structures revolve around corporate enclaves and underground networks of scavengers.";
                } else if (instruction.includes("FACTIONS section")) {
                    responseText = "1. The Solarpunk Coalition: A green-tech faction dedicated to restoring natural biomes using organic technology.\n2. Arasaka Conglomerate: A ruthless military corporation controlling major urban sectors and cybernetic assets.\n3. The Subterranean Rust Guild: A group of scavengers, hackers, and engineers living in the abandoned sewer networks, smuggling tech.";
                } else if (instruction.includes("RULES section")) {
                    responseText = "Magic functions through nano-computational frequencies present in the atmosphere. Access is restricted to those with cerebral augmentations or ancient genetic markers. Limitations include neural burnout and biological cell degradation if overused. The technological epoch is late-stage cyberpunk, with crude fusion reactors and quantum-encrypted nets.";
                } else if (instruction.includes("LOCATIONS section")) {
                    responseText = "1. Neo-Genoa: A towering city-state built on granite pillars above a radioactive sea.\n2. The Whispering Gardens: A massive, overgrown biosphere located inside a dome-shaped corporate research facility.\n3. Sector 9 Ruins: A scarred valley filled with crashed starships and active security drones.";
                } else if (instruction.includes("CONFLICTS section")) {
                    responseText = "The main tensions arise from a resource war between the corporate coalition and the solar syndicates. The immediate threat is a massive energy grid failure that could plunge the undercity into absolute darkness. The long-term threat is the slow expansion of the toxic dust wasteland, encroaching upon the arable domes.";
                } else if (instruction.includes("concise world overview (3-4 sentences maximum)")) {
                    responseText = "Neo-Genoa is a high-tech metropolis built over a toxic ocean. Solar-powered spires shelter the wealthy, while the working class dwells in neon-lit shadow sectors. A fragile peace exists between green-tech syndicates and heavy-industry corporations.";
                } else if (instruction.includes("Generate a single creative NPC profile")) {
                    responseText = JSON.stringify({
                        name: "Cassian Thorne",
                        species: "Augmented Human",
                        personality: "Sardonic, hyper-observant, fiercely protective of his allies.",
                        role: "Recon specialist and mercenary contact."
                    });
                } else if (instruction.includes("conflict scenario / plot hook")) {
                    responseText = "A sudden power surge in the undercity grid has unlocked a sealed pre-apocalypse laboratory. The Arasaka corp is sending a retrieval squad, and you must secure the research database before they do.";
                } else if (instruction.includes("Roleplay Scenario Sheet")) {
                    responseText = `**World Lore Expansion:** The neon skyline of Cyber-Tokyo is constantly shrouded in acid rain. Megacorporations control the main districts, while hackers navigate the subterranean nets.
 
**NPC Cast & Motivations:**
1. **Kaito (Cyborg Mercenary):** Wants to secure the data drive. Secretly distrusts corporations but needs their credits to survive.
2. **Reina (Netrunner):** Looking to avenge her brother. She is cautious but sees the Player as a valuable ally.
 
**Plot Objectives:** Infiltrate the Arasaka mainframe, extract the project files, and escape before security locks down.
 
=== ROLEPLAY_STARTER_SEPARATOR ===
 
*The rain drops drum rhythmically against the metal fire escape. Below you, the streets of District 6 flicker with neon advertisements. Kaito checks his arm cannon, the soft hum of cooling fans whining in the damp night air.*
 
"The security sweeps are on a ten-minute loop," *he whispers, his cybernetic eye glowing amber.* "If we're going in, we go now."
 
*Reina taps her temple, her optic neural link blinking green.* "Grid is quiet. Go."
 
*Kaito looks over at you, his metal hand resting on his gun holster.* "Well, boss. What's the play? Do we breach the front gate or take the vents?"`;
                } else if (instruction.includes("Extract world-building and setting details")) {
                    responseText = JSON.stringify({
                        name: "Luminaria",
                        setting: "Fantasy",
                        tones: ["Mysterious", "Epic"],
                        themes: "crystal magic, floating islands, ancient sky ruins",
                        overview: "Luminaria is a majestic world composed of shattered continents suspended in a vast glowing aether. Gravity operates irregularly, anchored by massive floating crystals.",
                        factions: "- Crystal Sentinels: Guard the core levitation crystals.\n- Sky Pirates: Outlaws who scavenge drifting ruins.",
                        rules: "Magic is fueled by raw aetheric energy tapped from the float-stones. Limitations include crystal decay and gravity field collapses.",
                        locations: "- The Prism Tower: An ancient monolith floating at the center.\n- Aether Rift: A deep rift of raw gravity energy.",
                        conflicts: "A slowly spreading darkness is decaying the levitation crystals, causing islands to fall into the abyss."
                    });
                } else if (instruction.includes("Extract roleplay scenario details")) {
                    responseText = JSON.stringify({
                        worldName: "Galeport",
                        worldLore: "A steampunk city built on high cliffs overlooking a sea of endless clouds, constantly battered by gale-force winds.",
                        setting: "Steampunk",
                        tones: ["Thrilling_Action", "Grounded"],
                        themes: "airships, storm piracy, mechanical wings",
                        userName: "Marcus",
                        userRole: "A rogue aeronautical mechanic",
                        npcs: [
                            { name: "Captain Zephyr", species: "Human", personality: "Dashing, daring, loyal.", role: "Pilot of the airship Storm-Cutter" },
                            { name: "Cinder", species: "Goblinal", personality: "Jittery, pyro-obsessed.", role: "Demolitions expert" }
                        ],
                        scenarioNotes: "Your airship has been sabotaged mid-flight during a severe thunderstorm. You must fix the engine while defending against sky pirates."
                    });
                }
                
                if (onChunk) {
                    let words = responseText.split(" ");
                    let current = "";
                    for (let word of words) {
                        current += (current ? " " : "") + word;
                        onChunk({ fullTextSoFar: current });
                        await new Promise(r => setTimeout(r, 8));
                    }
                } else {
                    await new Promise(r => setTimeout(r, 400));
                }
                
                return { text: responseText };
            };
        }
        
        if (typeof window.prompt2 === "undefined") {
            window.prompt2 = async function(content, options) {
                console.info("🎭 Mock prompt2 called:", content, options);
                let confirmAction = confirm("Mock Preview Modal:\n" + (content?.content?.html ? "HTML Content Loaded Successfully." : "Empty Content") + "\n\nClick OK to launch / confirm, Cancel to close.");
                return { cancelled: !confirmAction };
            };
        }

        if (typeof window.superFetch === "undefined") {
            window.superFetch = async function(url) {
                console.info("🌐 Mock superFetch called for url:", url);
                return {
                    blob: async () => new Blob(["Mock Fandom Page Content"], { type: "text/html" }),
                    json: async () => ({ visualeditor: { content: "Mock Wikipedia/Fandom Page Text Content" } })
                };
            };
        }

        if (typeof window.uploadPlugin === "undefined") {
            window.uploadPlugin = async function(blob) {
                console.info("📤 Mock uploadPlugin called with blob size:", blob.size);
                return { url: "https://user.uploads.dev/mock-lorebook-url.txt" };
            };
        }
    }

    // ─── PERCHANCE CONTEXT ──────────────────────────────────────────────
    // Note for AI Models: Most core variables (ai, image, root, etc.) are 
    // defined in 'SCD_LIST.txt' (the Perchance "Lists" panel). 
    // Perchance automatically injects these into the global scope. 
    // Do not re-declare them here unless local overrides are needed.

    // ─── PANEL COLLAPSE ───────────────────────────────────────────────
    window.togglePanel = function (panelId) {
        let panel = document.getElementById(panelId);
        let body = panel.querySelector('.panel-body');
        let chevron = panel.querySelector('.panel-chevron');
        let collapsed = panel.classList.toggle('collapsed');
        if (chevron) {
            if (collapsed) {
                chevron.classList.remove('bi-chevron-down');
                chevron.classList.add('bi-chevron-right');
            } else {
                chevron.classList.remove('bi-chevron-right');
                chevron.classList.add('bi-chevron-down');
            }
        }
    };

    // ─── CUSTOM DROPDOWNS (SETTING & TONE) ──────────────────────────────
    window.toggleCustomDropdown = function (menuId, event) {
        if (event) event.stopPropagation();
        
        // Close all other custom dropdowns
        document.querySelectorAll(".dropdown-menu-custom").forEach(menu => {
            if (menu.id !== menuId) {
                menu.style.display = "none";
            }
        });

        let menu = document.getElementById(menuId);
        if (menu) {
            menu.style.display = menu.style.display === "none" ? "block" : "none";
            // Focus search input if opening setting dropdown
            if ((menuId === "settingDropdownMenu" || menuId === "wSettingDropdownMenu" || menuId === "rpSettingDropdownMenu") && menu.style.display === "block") {
                let search = menu.querySelector(".dropdown-search-input");
                if (search) {
                    search.value = "";
                    if (menuId === "settingDropdownMenu") {
                        filterSettings("");
                    } else if (menuId === "wSettingDropdownMenu" && typeof filterWorldSettings === "function") {
                        filterWorldSettings("");
                    } else if (menuId === "rpSettingDropdownMenu" && typeof filterRoleplaySettings === "function") {
                        filterRoleplaySettings("");
                    }
                    setTimeout(() => search.focus(), 50);
                }
            }
        }
    };

    // Close dropdowns when clicking outside
    document.addEventListener("click", function (e) {
        document.querySelectorAll(".dropdown-menu-custom").forEach(menu => {
            let dropdown = menu.closest(".custom-dropdown");
            if (dropdown && !dropdown.contains(e.target)) {
                menu.style.display = "none";
            }
        });
    });

    var SETTING_KEYS = [
        "Any", "Fantasy", "High_Fantasy", "Sci_Fi", "Cyberpunk",
        "Real_World_Modern", "Real_World_Furry", "Real_World_Fantasy", "Historical", "Post_Apocalyptic",
        "Horror", "Mythology", "Solarpunk", "Dark_Fantasy", "Urban_Fantasy",
        "Steampunk", "Dieselpunk", "Space_Opera", "Hard_Sci_Fi", "Weird_West",
        "Gothic", "Fairy_Tale", "Wuxia", "Isekai", "Biopunk",
        "Frozen_Apocalypse", "Underwater", "Dreamlike", "Satirical"
    ];

    window.initCustomSettingDropdown = function () {
        let listEl = document.getElementById("settingOptionsList");
        if (!listEl) return;
        
        let keys = SETTING_KEYS;
        
        listEl.innerHTML = keys.map(k => {
            let label = k.replace(/_/g, " ");
            return `
                <div class="dropdown-option-item" data-value="${k}" onclick="selectSetting('${k}', true)">
                    <span>${label}</span>
                    <i class="bi bi-check-lg" style="display: none; color: var(--accent-color);"></i>
                </div>
            `;
        }).join("");

        // Select initial value from localStorage or default to "Any"
        let currentSetting = localStorage.setting || "Any";
        selectSetting(currentSetting, false);
    };

    window.filterSettings = function (query) {
        let q = query.toLowerCase().trim();
        let items = document.querySelectorAll("#settingOptionsList .dropdown-option-item");
        items.forEach(item => {
            let text = item.querySelector("span").textContent.toLowerCase();
            if (text.includes(q)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    };

    window.selectSetting = function (value, closeMenu = true) {
        localStorage.setting = value;
        let labelEl = document.getElementById("settingLabel");
        if (labelEl) {
            labelEl.textContent = value.replace(/_/g, " ");
        }

        // Update active checkmarks
        let items = document.querySelectorAll("#settingOptionsList .dropdown-option-item");
        items.forEach(item => {
            let check = item.querySelector("i");
            if (item.getAttribute("data-value") === value) {
                item.classList.add("active");
                if (check) check.style.display = "inline-block";
            } else {
                item.classList.remove("active");
                if (check) check.style.display = "none";
            }
        });

        if (closeMenu) {
            let menu = document.getElementById("settingDropdownMenu");
            if (menu) menu.style.display = "none";
        }
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    // Define virtual settingEl for backwards compatibility
    Object.defineProperty(window, 'settingEl', {
        get: () => ({
            get value() { return localStorage.setting || "Any"; },
            set value(val) {
                localStorage.setting = val;
                selectSetting(val, false);
            }
        }),
        configurable: true
    });

    // Tone Dropdown functions
    window.getSelectedTones = function () {
        let checked = [...document.querySelectorAll(".toneCheckbox:checked")].map(c => c.value);
        return checked.length > 0 ? checked : ["Any"];
    };

    window.handleToneChange = function () {
        let checked = [...document.querySelectorAll(".toneCheckbox:checked")];
        let anyBox = document.getElementById("toneAnyCheckbox");
        if (checked.length > 0 && anyBox) anyBox.checked = false;
        updateToneLabel();
        saveTones();
    };

    window.handleToneAnyToggle = function (checkbox) {
        if (checkbox.checked) {
            document.querySelectorAll(".toneCheckbox").forEach(c => c.checked = false);
        }
        updateToneLabel();
        saveTones();
    };

    window.updateToneLabel = function () {
        let tones = getSelectedTones();
        let label = document.getElementById("toneDropdownLabel");
        if (label) {
            if (tones[0] === "Any") label.textContent = "Any";
            else if (tones.length === 1) label.textContent = tones[0].replace(/_/g, " ");
            else label.textContent = tones[0].replace(/_/g, " ") + " +" + (tones.length - 1);
        }
    };

    window.saveTones = function () {
        localStorage.tones = JSON.stringify(getSelectedTones());
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.loadTones = function () {
        try {
            let saved = JSON.parse(localStorage.tones || '["Any"]');
            let anyBox = document.getElementById("toneAnyCheckbox");
            if (!saved || saved.length === 0 || saved[0] === "Any") {
                if (anyBox) anyBox.checked = true;
            } else {
                if (anyBox) anyBox.checked = false;
                saved.forEach(t => {
                    let box = document.querySelector(`.toneCheckbox[value="${t}"]`);
                    if (box) box.checked = true;
                });
            }
            updateToneLabel();
        } catch (e) {
            let anyBox = document.getElementById("toneAnyCheckbox");
            if (anyBox) anyBox.checked = true;
            updateToneLabel();
        }
    };

    // Initialize custom dropdowns on load
    setTimeout(() => {
        initCustomSettingDropdown();
        loadTones();
    }, 20);

    window.setAccentTheme = function (themeName) {
        const themes = {
            amethyst: { color: "#7c3aed", hover: "#6d28d9", rgb: "124, 58, 237" },
            cyberpunk: { color: "#ff007f", hover: "#d00068", rgb: "255, 0, 127" },
            emerald: { color: "#10b981", hover: "#059669", rgb: "16, 185, 129" },
            sapphire: { color: "#3b82f6", hover: "#2563eb", rgb: "59, 130, 246" },
            crimson: { color: "#ef4444", hover: "#dc2626", rgb: "239, 68, 68" },
            sunset: { color: "#f59e0b", hover: "#d97706", rgb: "245, 158, 11" }
        };
        const config = themes[themeName] || themes.amethyst;
        localStorage.activeThemeAccent = themeName;

        // Apply dynamically onto :root
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--accent-color', config.color);
        rootStyle.setProperty('--accent-hover', config.hover);
        rootStyle.setProperty('--accent-color-rgb', config.rgb);

        // Highlight selected in DOM
        document.querySelectorAll('.theme-card-option').forEach(el => {
            if (el.getAttribute('data-theme') === themeName) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    };

    // Load active theme accent immediately on startup
    if (localStorage.activeThemeAccent) {
        setAccentTheme(localStorage.activeThemeAccent);
    } else {
        setAccentTheme('amethyst');
    }

    // ─── DARK MODE ────────────────────────────────────────────────────
    window.toggleManualDarkMode = function () {
        let newScheme = getCurrentColorScheme() === "dark" ? "light" : "dark";
        localStorage.forceColorScheme = newScheme;
        setColorScheme(newScheme);
        let sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
        if (sys === newScheme) localStorage.removeItem("forceColorScheme");
    };
    window.getCurrentColorScheme = function () {
        if (localStorage.forceColorScheme !== undefined) return localStorage.forceColorScheme;
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    };
    window.setColorScheme = function (scheme) {
        let btn = document.querySelector("#darkModeBtn");
        if (btn) {
            btn.innerHTML = scheme === "dark" ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
        }
        if (scheme === "dark") {
            document.documentElement.classList.remove("light");
            document.documentElement.style.colorScheme = "dark";
            document.body.style.color = "";
            document.body.style.backgroundColor = "";
            document.documentElement.style.setProperty('--box-color', '#2a2a2a');
            document.documentElement.style.setProperty('--panel-border', '#2a2b36');
            document.documentElement.style.setProperty('--panel-header-bg', '#171923');
        } else {
            document.documentElement.classList.add("light");
            document.documentElement.style.colorScheme = "light";
            document.body.style.color = "";
            document.body.style.backgroundColor = "";
            document.documentElement.style.setProperty('--box-color', '#f8fafc');
            document.documentElement.style.setProperty('--panel-border', '#cbd5e1');
            document.documentElement.style.setProperty('--panel-header-bg', '#ffffff');
        }
    };
    if (localStorage.forceColorScheme !== undefined) setColorScheme(localStorage.forceColorScheme);
    else setColorScheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");

    window.toggleFeedbackPanel = function (btn) {
        let ctn = document.getElementById("feedbackCommentsCtn");
        if (ctn.innerHTML.length === 0) {
            ctn.innerHTML = generateFeedbackCommentsHtml();
            btn.innerHTML = '<i class="bi bi-x-lg"></i> close';
        } else {
            ctn.innerHTML = '';
            btn.innerHTML = '<i class="bi bi-chat-left-text"></i> feedback';
        }
    };

    window.generateFeedbackCommentsHtml = function () {
        let options = { channel: "feedback", hideComments: location.hash.includes("#showfeedback") ? false : true, height: location.hash.includes("#showfeedback") ? 500 : 120, commentPlaceholderText: "Share some feedback. Do not share personal info, data is public.", submitButtonText: "submit feedback" };
        if (localStorage.forceColorScheme) options.forceColorScheme = localStorage.forceColorScheme;
        return root.comments(options);
    };

    // ─── UI UPDATES ───────────────────────────────────────────────────
    window.updateSavedCountBadge = function () {
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let badgeEl = document.getElementById("savedCountBadgeEl");
        if (badgeEl) {
            if (saved.length > 0) {
                badgeEl.textContent = saved.length;
                badgeEl.style.display = "inline-block";
            } else {
                badgeEl.style.display = "none";
            }
        }
    };

    window.toggleSidebar = function () {
        let sidebar = document.getElementById("sidebarEl");
        let isOpen = sidebar.style.transform === "translateX(0%)";
        sidebar.style.transform = isOpen ? "translateX(100%)" : "translateX(0%)";
    };

    window.toggleGallery = function () {
        togglePanel('gallerySectionEl');
    };

    window.toggleSectionEdit = function (section) {
        let outputEl = document.getElementById(section + "OutputEl");
        let editBtn = document.getElementById(section + "EditBtnEl");
        if (!outputEl || !editBtn) return;
        let isEditing = outputEl.contentEditable === "true";
        outputEl.contentEditable = !isEditing;
        if (!isEditing) {
            outputEl.style.border = "1px solid var(--accent-color)";
            outputEl.style.padding = "0.4rem";
            outputEl.focus();
            editBtn.innerHTML = '<i class="bi bi-floppy"></i> save';
        } else {
            outputEl.style.border = "none";
            outputEl.style.padding = "0.4rem 0";
            editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> edit';
            // Update the internal cache
            if (!window.characterSections) window.characterSections = {};
            window.characterSections[section] = outputEl.innerText;
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        }
    };

    window.clearSection = function (section) {
        let outputEl = document.getElementById(section + "OutputEl");
        let notesEl = document.getElementById(section + "NotesEl");
        let editBtn = document.getElementById(section + "EditBtnEl");
        let copyBtn = document.getElementById(section + "CopyBtnEl");
        let statusEl = document.getElementById(section + "StatusEl");

        if (outputEl) {
            outputEl.innerHTML = "";
            outputEl.style.display = "none";
        }
        if (notesEl) {
            notesEl.value = "";
            localStorage.removeItem(section + "Notes");
        }
        if (editBtn) editBtn.style.display = "none";
        if (copyBtn) copyBtn.style.display = "none";
        if (statusEl) statusEl.textContent = "";

        if (section === "lore") {
            clearLoreFields();
            localStorage.removeItem("loreText");
        }

        if (window.characterSections) delete window.characterSections[section];
        updateClearAllBtn();
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    // ─── COPY SECTION TEXT ────────────────────────────────────────────
    window.copySectionText = function (section) {
        let text = "";
        if (section === "lore") {
            text = compileLoreFromUI();
        } else {
            let el = document.getElementById(section + "OutputEl");
            if (el) text = el.innerText.trim();
        }
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            let btn = document.getElementById(section + "CopyBtnEl");
            if (btn) {
                let origHtml = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-lg"></i> copied!';
                setTimeout(() => { btn.innerHTML = origHtml; }, 1500);
            }
        }).catch(err => {
            console.warn("Clipboard write failed:", err);
            // Fallback for older browsers
            let ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        });
    };

    window.setSectionStatus = function (section, message) {
        let el = document.getElementById(section + "StatusEl");
        if (el) el.textContent = message;
    };

    window.setSectionOutput = function (section, html) {
        let el = document.getElementById(section + "OutputEl");
        if (el) {
            el.innerHTML = html;
            el.style.display = "block";
        }
        let editBtn = document.getElementById(section + "EditBtnEl");
        if (editBtn) editBtn.style.display = "inline-block";
        let copyBtn = document.getElementById(section + "CopyBtnEl");
        if (copyBtn) copyBtn.style.display = "inline-block";
    };

    window.setSectionGenerating = function (section, isGenerating) {
        let genBtn = document.getElementById(section + "GenBtnEl");
        let stopBtn = document.getElementById(section + "StopBtnEl");
        if (genBtn) genBtn.disabled = isGenerating;
        if (stopBtn) stopBtn.style.display = isGenerating ? "inline-block" : "none";
    };

    window.updateClearAllBtn = function () {
        let hasContent = ["role", "personality", "beliefs", "preferences", "appearance", "background", "lore", "roleplay"].some(s => getSectionText(s).length > 0);
        let btn = document.getElementById("clearAllBtn");
        if (btn) btn.style.opacity = hasContent ? "1" : "0.7";
    };

    // ─── TAB NAVIGATION ───
    window.switchTab = function (tabName) {
        // Toggle active navigation items
        document.querySelectorAll('.left-sidebar .sidebar-item').forEach(el => {
            el.classList.remove('active');
        });
        
        // Hide all tabs
        let generatorTab = document.getElementById('generatorTabEl');
        let settingsTab = document.getElementById('settingsTabEl');
        let roleplayTab = document.getElementById('roleplayTabEl');
        let worldTab = document.getElementById('worldTabEl');
        if (generatorTab) generatorTab.style.display = 'none';
        if (settingsTab) settingsTab.style.display = 'none';
        if (roleplayTab) roleplayTab.style.display = 'none';
        if (worldTab) worldTab.style.display = 'none';
        
        if (tabName === 'characters') {
            let activeItem = document.getElementById('sidebar-item-characters');
            if (activeItem) activeItem.classList.add('active');
            if (generatorTab) generatorTab.style.display = 'flex';
        } else if (tabName === 'world') {
            let activeItem = document.getElementById('sidebar-item-world');
            if (activeItem) activeItem.classList.add('active');
            if (worldTab) worldTab.style.display = 'flex';
        } else if (tabName === 'roleplay') {
            let activeItem = document.getElementById('sidebar-item-roleplay');
            if (activeItem) activeItem.classList.add('active');
            if (roleplayTab) roleplayTab.style.display = 'flex';
        } else if (tabName === 'settings') {
            let activeItem = document.getElementById('sidebar-item-settings');
            if (activeItem) activeItem.classList.add('active');
            if (settingsTab) settingsTab.style.display = 'flex';
            
            // Sync checkbox checked states with localStorage when entering settings tab
            let clearChk = document.getElementById('settingClearConfirmEl');
            let loadChk = document.getElementById('settingLoadConfirmEl');
            let updateChk = document.getElementById('settingUpdateConfirmEl');
            if (clearChk) clearChk.checked = localStorage.warnOnClear === 'true';
            if (loadChk) loadChk.checked = localStorage.warnOnLoad === 'true';
            if (updateChk) updateChk.checked = localStorage.warnOnUpdate === 'true';

            // Sync active theme accent DOM highlighting
            if (typeof setAccentTheme === 'function') {
                setAccentTheme(localStorage.activeThemeAccent || 'amethyst');
            }
        }
    };

    // ─── SIDEBAR TAB NAVIGATION ───
    window.switchSidebarTab = function (tabName) {
        let charTab = document.getElementById('sidebarCharacterSection');
        let worldTab = document.getElementById('sidebarWorldSection');
        let charBtn = document.getElementById('sidebarTabBtn-characters');
        let worldBtn = document.getElementById('sidebarTabBtn-worlds');
        let titleEl = document.getElementById('sidebarHeaderTitleEl');

        if (tabName === 'characters') {
            if (charTab) charTab.style.display = 'flex';
            if (worldTab) worldTab.style.display = 'none';
            if (charBtn) charBtn.classList.add('active');
            if (worldBtn) worldBtn.classList.remove('active');
            if (titleEl) titleEl.innerHTML = `<i class="bi bi-floppy-fill" style="color:var(--accent-color);"></i> Saved Characters`;
        } else {
            if (charTab) charTab.style.display = 'none';
            if (worldTab) worldTab.style.display = 'flex';
            if (charBtn) charBtn.classList.remove('active');
            if (worldBtn) worldBtn.classList.add('active');
            if (titleEl) titleEl.innerHTML = `<i class="bi bi-globe-americas" style="color:var(--accent-color);"></i> Saved Worlds`;
            if (typeof renderSidebarWorlds === 'function') {
                renderSidebarWorlds();
            }
        }
    };

    // ─── PREMIUM CUSTOM CONFIRM DIALOG ───
    window.showConfirmDialog = function (message, settingKey, onConfirm) {
        // If warning is disabled by settingKey, execute immediately
        if (settingKey && localStorage[settingKey] === 'false') {
            onConfirm();
            return;
        }

        // Create overlay element
        let overlay = document.createElement('div');
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center;
            z-index: 99999; animation: fadeInConfirm 0.2s ease-out;
        `;

        // Create modal card container
        let modal = document.createElement('div');
        modal.style = `
            background: var(--panel-bg);
            border: 1px solid var(--panel-border);
            border-radius: 12px;
            padding: 1.5rem;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.20);
            display: flex;
            flex-direction: column;
            gap: 1rem;
            color: var(--text-main);
            font-family: inherit;
            animation: scaleInConfirm 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;

        // Inject keyframes styling if not present
        if (!document.getElementById('confirmModalStyles')) {
            let style = document.createElement('style');
            style.id = 'confirmModalStyles';
            style.textContent = `
                @keyframes fadeInConfirm { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleInConfirm { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `;
            document.head.appendChild(style);
        }

        let titleHtml = `
            <div style="display:flex; align-items:center; gap:0.5rem; font-weight:600; font-size:110%; color:var(--text-main);">
                <i class="bi bi-exclamation-triangle-fill" style="color:var(--accent-color);"></i>
                <span>Confirm Action</span>
            </div>
        `;

        let checkboxHtml = '';
        if (settingKey) {
            checkboxHtml = `
                <label style="display:inline-flex; align-items:center; gap:0.5rem; cursor:pointer; font-size:82%; color:var(--text-muted); margin-top:0.25rem; user-select:none;">
                    <input type="checkbox" id="confirmDontWarnCheckbox" style="cursor:pointer; accent-color:var(--accent-color);">
                    <span>Don't warn me again</span>
                </label>
            `;
        }

        let bodyHtml = `
            <div style="font-size:90%; line-height:1.5; color:var(--text-main);">${message}</div>
            ${checkboxHtml}
        `;

        let buttonsHtml = `
            <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.5rem;">
                <button id="confirmCancelBtn" class="btn-secondary" style="padding:0.4rem 1rem; border-radius:6px; font-size:85%;"><i class="bi bi-x-lg"></i> Cancel</button>
                <button id="confirmOkBtn" class="btn-primary" style="padding:0.4rem 1rem; border-radius:6px; font-size:85%;"><i class="bi bi-check-lg"></i> Confirm</button>
            </div>
        `;

        modal.innerHTML = titleHtml + bodyHtml + buttonsHtml;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Autofocus ok button
        setTimeout(() => {
            let okBtn = document.getElementById('confirmOkBtn');
            if (okBtn) okBtn.focus();
        }, 50);

        const close = () => {
            overlay.style.animation = 'fadeInConfirm 0.15s ease-out reverse';
            modal.style.animation = 'scaleInConfirm 0.15s ease-out reverse';
            setTimeout(() => overlay.remove(), 140);
        };

        let cancelBtn = document.getElementById('confirmCancelBtn');
        if (cancelBtn) cancelBtn.onclick = close;

        let okBtn = document.getElementById('confirmOkBtn');
        if (okBtn) {
            okBtn.onclick = () => {
                let checkbox = document.getElementById('confirmDontWarnCheckbox');
                if (settingKey && checkbox && checkbox.checked) {
                    localStorage[settingKey] = 'false';
                    
                    // Keep checkboxes in Settings tab synchronized
                    let checkboxElMap = {
                        'warnOnClear': 'settingClearConfirmEl',
                        'warnOnLoad': 'settingLoadConfirmEl',
                        'warnOnUpdate': 'settingUpdateConfirmEl'
                    };
                    let inputId = checkboxElMap[settingKey];
                    if (inputId) {
                        let settingCheckEl = document.getElementById(inputId);
                        if (settingCheckEl) settingCheckEl.checked = false;
                    }
                }
                close();
                onConfirm();
            };
        }
    };

    // ─── OVERWRITE CHARACTER SLOT CONTROLLER ───
    setTimeout(() => {
        if (typeof Typed !== 'undefined') {
            new Typed('#typed-tagline', {
                strings: [
                    'or let the AI fill in the blanks.',
                    'create immersive Cyberpunk heroes.',
                    'design intricate Dark Fantasy legends.',
                    'generate colorful Anime companions.',
                    'craft unique Steampunk adventurers.'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }, 500);
