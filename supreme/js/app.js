/* ==========================================================================
   STANDALONE DEVELOPMENT MOCK CONTEXT
   ========================================================================== */
    const isPerchance = window.location.hostname.includes("perchance.org");
    if (typeof window.root === "undefined" && !isPerchance) {
        console.info("🔧 Supreme Character Description: Running in standalone local context. Injected developer mocks for Perchance engine.");
        
        window.root = {
            settingPrompts: {
                Any: { evaluateItem: "" },
                Fantasy: { evaluateItem: "The setting is a fantasy world with magic, mythical creatures, and ancient lore." },
                High_Fantasy: { evaluateItem: "The setting is an epic high fantasy world." },
                "Sci_Fi": { evaluateItem: "The setting is a science fiction universe with advanced technology." },
                Cyberpunk: { evaluateItem: "The setting is a near-future cyberpunk megalopolis  -  neon-lit, corporate-controlled." },
                "Real_World_Modern": { evaluateItem: "The setting is the contemporary real world." },
                Zombie_apocalypse: { evaluateItem: "The setting is a zombie apocalypse." },
                Alien_apocalypse: { evaluateItem: "The setting is an alien apocalypse." }
            },
            tonePrompts: {
                Any: { evaluateItem: "" },
                Grounded: { evaluateItem: "The tone is grounded and realistic." },
                Dark_Gritty: { evaluateItem: "The tone is dark and gritty." },
                Light_hearted_Comedic: { evaluateItem: "The tone is lighthearted and comedic." },
                Mysterious: { evaluateItem: "The tone is mysterious and atmospheric." }
            },
            archetypePrompts: {
                Any: { evaluateItem: "" },
                Tsundere: { evaluateItem: "The character behaves in a Tsundere manner." },
                Yandere: { evaluateItem: "The character behaves in a Yandere manner." },
                Kuudere: { evaluateItem: "The character behaves in a Kuudere manner." },
                Dandere: { evaluateItem: "The character behaves in a Dandere manner." },
                Deredere: { evaluateItem: "The character behaves in a Deredere manner." },
                Himedere: { evaluateItem: "The character behaves in a Himedere manner." },
                Kamidere: { evaluateItem: "The character behaves in a Kamidere manner." },
                Female: { evaluateItem: "The character is female." },
                Male: { evaluateItem: "The character is male." },
                Femboy: { evaluateItem: "The character is a femboy." },
                Tomboy: { evaluateItem: "The character is a tomboy." },
                Futa: { evaluateItem: "The character is a futanari." },
                childhood_friend: { evaluateItem: "The character is a childhood friend." },
                Bestie: { evaluateItem: "The character is a best friend." },
                FWB: { evaluateItem: "The character is friends with benefits." }
            },
            dynamicPrompts: {
                Any: { evaluateItem: "" },
                Enemies_To_Lovers: { evaluateItem: "The relationship dynamic is enemies-to-lovers." },
                Forbidden_Love: { evaluateItem: "The relationship dynamic is forbidden love." },
                Mentor_Student: { evaluateItem: "The relationship dynamic is mentor and student." },
                Hunter_And_Prey: { evaluateItem: "The relationship dynamic is hunter and prey." },
                Mutual_Obsession: { evaluateItem: "The relationship dynamic is mutual obsession." },
                Forced_Cohabitation: { evaluateItem: "The relationship dynamic is forced cohabitation." },
                Fake_Relationship: { evaluateItem: "The relationship dynamic is a fake relationship." }
            },

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
            lengthSpecifiers: {
                "super-short": { evaluateItem: "1 line each" },
                "super_short": { evaluateItem: "1 line each" },
                "short": { evaluateItem: "2-3 lines each" },
                "medium": { evaluateItem: "4-5 lines each" },
                "long": { evaluateItem: "6-7 lines each" },
                "super-long": { evaluateItem: "8+ lines each" },
                "super_long": { evaluateItem: "8+ lines each" }
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

        // Bind prompt modules to root objects
        (function () {
            if (typeof root !== 'undefined') {
                try {
                    Object.defineProperty(root, 'prompts', {
                        get: function () {
                            return window.prompts;
                        },
                        configurable: true
                    });
                } catch (e) {
                    root.prompts = window.prompts;
                }
            }
            if (window.root) {
                try {
                    Object.defineProperty(window.root, 'prompts', {
                        get: function () {
                            return window.prompts;
                        },
                        configurable: true
                    });
                } catch (e) {
                    window.root.prompts = window.prompts;
                }
            }
        })();
        
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
                    responseText = "- The Setting : A majestic solarpunk city built on high cliffs overlooking a sea of endless clouds, constantly battered by gale-force winds.\n- Technology: High-level clean energy grids, wind-turbines, airships, and mechanical wings.\n- Daily Life: Wind-harvesters, engineers, and sky pirates thrive in the breezy sky sectors.\n- Secrets: The wind turbines are slowly draining the planetary core energy, leading to eventual atmospheric collapse.";
                } else if (instruction.includes("RULES section")) {
                    responseText = "1. Gravity shifts randomly at night; tethering is mandatory.\n2. Storm harvesting is restricted to certified syndicates.\n3. Organic matter cannot be imported to the floating city.\n4. Standard tech uses steam-compression instead of electrical combustion.\n5. Defying the Wind Marshal is punishable by exile into the Cloud Sea.";
                } else if (instruction.includes("RACES section")) {
                    responseText = "- Aether-born: Ethereal humanoids with pale, glowing skin who can naturally manipulate atmospheric pressure. They lead the green research initiatives.\n- Rust-dwellers: Sturdy, heavily augmented humanoids who work the under-turbines and scavenge drifting iron wreckage.";
                } else if (instruction.includes("REGIONS section")) {
                    responseText = "- Galeport: The main trading hub city perched on the edge of the highest cliff.\n- The Howling Spires: Tall stone needle formations where storm winds are at their peak density.\n- The Cloud Sea Basin: The mysterious foggy expanse beneath the cliffs, mostly unexplored.\n- Whisperwood Domes: Biodomes sheltering the only organic flora on the planet.\n- The Rust Shallows: A valley of wrecked airships and active defense drones.";
                } else if (instruction.includes("FACTIONS section")) {
                    responseText = "- The Cloud-Harvester Guild: A public, wealthy organization managing clean energy harvesting and distribution.\n- Sky Raiders: Outlaws who scavenge drifting sky ruins, publicly known and feared.\n- Solarpunk Initiative: A green-tech research faction aiming to restore the planet's core.\n- The Whisperers: A secret faction working in the shadows to sabotage turbine operations and save the core.";
                } else if (instruction.includes("BESTIARY section")) {
                    responseText = "- Sky Leviathan: Colossal winged creatures that float through the Cloud Sea, feeding on storm static. Danger level: Extreme.\n- Gale Hawk: Rapid predatory birds that navigate the spires. Danger level: Medium.\n- Rust Spiders: Small mechanical scavengers that clean the city structures. Danger level: Low.\n- Auroral Jellyfish: Floating glowing invertebrates found in the Whisperwood domes. Danger level: None.\n\n- Common animals: wind-mice, cliff-gulls, and storm-beetles.";
                } else if (instruction.includes("CHARACTERS section")) {
                    responseText = "- Captain Zephyr (Age 34): A dashing airship pilot with a wind-carved face and cybernetic eye. He seeks to uncover the harvesters' secret plots.\n- Cinder (Age 22): A twitchy, fire-obsessed mechanical engineer who keeps the engines running. Her goal is to build the first infinite-range glider.\n- Arch-Marshal Vance (Age 52): The stern ruler of Galeport, determined to maintain order and energy supply at any cost.\n- Lyra the Rogue (Age 26): A quiet information broker who knows the truth about the core's decay and smuggles data to the Whisperers.";
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
                        overview: "- The Setting : A majestic world composed of shattered continents suspended in a vast glowing aether.\n- Technology: Float-stones, crystal engines, and ancient runes.\n- Daily Life: Airship sailors, miners of crystals, and floating hermits.\n- Secrets: The crystals are living deities slowly dying.",
                        rules: "1. Magic requires attunement to a float-stone.\n2. Islands falling below the clouds cannot be recovered.\n3. Crystal pollution causes physical crystallization.",
                        races: "- Aether-born: Ethereal humanoids with pale, glowing skin who can naturally manipulate atmospheric pressure.\n- Rust-dwellers: Sturdy, heavily augmented humanoids who work the under-turbines.",
                        regions: "- Galeport: The main trading hub city.\n- The Howling Spires: Tall stone needle formations.\n- The Cloud Sea Basin: The mysterious foggy expanse.\n- Whisperwood Domes: Biodomes sheltering organic flora.\n- The Rust Shallows: A valley of wrecked airships.",
                        factions: "- Crystal Sentinels: A public, wealthy organization managing clean energy.\n- Sky Pirates: Outlaws who scavenge drifting sky ruins.\n- Solarpunk Initiative: A green-tech research faction.\n- The Whisperers: A secret faction working in the shadows.",
                        bestiary: "- Sky Leviathan: Colossal winged creatures.\n- Gale Hawk: Rapid predatory birds.\n- Rust Spiders: Small mechanical scavengers.\n- Auroral Jellyfish: Floating glowing invertebrates.\n\n- Common animals: wind-mice, cliff-gulls, and storm-beetles.",
                        characters: "- Captain Zephyr (Age 34): A dashing airship pilot.\n- Cinder (Age 22): A twitchy, fire-obsessed mechanical engineer.\n- Arch-Marshal Vance (Age 52): The stern ruler of Galeport.\n- Lyra the Rogue (Age 26): A quiet information broker."
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

        if (typeof window.literal === "undefined") {
            window.literal = function(text) {
                if (typeof text !== "string") return text;
                return text.replace(/([\[\]\{\}])/g, "\\$1");
            };
        }
    }

    // ─── PERCHANCE CONTEXT ──────────────────────────────────────────────
    // Note for AI Models: Most core variables (ai, image, root, etc.) are 
    // defined in 'SCD_LIST.txt' (the Perchance "Lists" panel). 
    // Perchance automatically injects these into the global scope. 
    // Do not re-declare them here unless local overrides are needed.
/* ==========================================================================
   PANEL COLLAPSE UTILITY
   ========================================================================== */
    window.togglePanel = function (panelId) {
        let panel = document.getElementById(panelId);
        let header = panel.querySelector('.panel-header');
        let body = panel.querySelector('.panel-body');
        let chevron = panel.querySelector('.panel-chevron');
        let collapsed = panel.classList.toggle('collapsed');
        
        if (header) header.setAttribute('aria-expanded', !collapsed);
        if (body) body.setAttribute('aria-hidden', collapsed);

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
/* ==========================================================================
   CUSTOM DROPDOWN COMPONENT CONTROLLER
   ========================================================================== */
    window.sortDropdownList = function (listElId) {
        const listEl = document.getElementById(listElId);
        if (!listEl) return;

        const children = Array.from(listEl.children);
        
        // Find if there is a separator <hr>
        const hrIndex = children.findIndex(child => child.tagName === 'HR');
        
        let prefixItems = [];
        let hrItem = null;
        let itemsToSort = [];

        if (hrIndex !== -1) {
            prefixItems = children.slice(0, hrIndex);
            hrItem = children[hrIndex];
            itemsToSort = children.slice(hrIndex + 1);
        } else {
            itemsToSort = children;
        }

        // Helper to check if an item is checked/active
        const isChecked = (item) => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) return checkbox.checked;
            if (item.classList.contains('active')) return true;
            const checkIcon = item.querySelector('.bi-check-lg');
            if (checkIcon && checkIcon.style.display !== 'none') return true;
            return false;
        };

        // Helper to get sorting text (display label)
        const getLabelText = (item) => {
            const span = item.querySelector('span');
            return span ? span.textContent.trim().toLowerCase() : item.textContent.trim().toLowerCase();
        };

        // Sort itemsToSort: checked first (alphabetical), then unchecked (alphabetical)
        itemsToSort.sort((a, b) => {
            const aChecked = isChecked(a);
            const bChecked = isChecked(b);
            if (aChecked && !bChecked) return -1;
            if (!aChecked && bChecked) return 1;
            
            // Sort alphabetically by label
            return getLabelText(a).localeCompare(getLabelText(b));
        });

        // Re-append items in the new order (without clearing innerHTML to preserve event listeners)
        prefixItems.forEach(item => listEl.appendChild(item));
        if (hrItem) {
            listEl.appendChild(hrItem);
        }
        itemsToSort.forEach(item => listEl.appendChild(item));
    };

    window.toggleCustomDropdown = function (menuId, event) {
        if (event) event.stopPropagation();
        
        // Close all other custom dropdowns
        document.querySelectorAll(".dropdown-menu-custom").forEach(menu => {
            if (menu.id !== menuId) {
                menu.style.display = "none";
                let dropdown = menu.closest(".custom-dropdown");
                if (dropdown) dropdown.classList.remove("open");
            }
        });

        let menu = document.getElementById(menuId);
        if (menu) {
            let dropdown = menu.closest(".custom-dropdown");
            if (menu.style.display === "none") {
                menu.style.display = "block";
                if (dropdown) dropdown.classList.add("open");
                
                // Sort when opened
                let listId = menuId.replace("DropdownMenu", "OptionsList");
                sortDropdownList(listId);
            } else {
                menu.style.display = "none";
                if (dropdown) dropdown.classList.remove("open");
            }
            // Focus search input if opening setting/tone/archetype dropdown
            if (menu.style.display === "block") {
                let search = menu.querySelector(".dropdown-search-input");
                if (search) {
                    search.value = "";
                    let listId = menuId.replace("DropdownMenu", "OptionsList");
                    window.filterDropdownOptions(listId, "");
                    
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
                dropdown.classList.remove("open");
            }
        });
    });

    window.getPerchanceListKeys = function (listObj) {
        if (!listObj || typeof listObj !== "object") return [];
        const ignored = new Set([
            'selectOne', 'evaluateItem', 'selectMany', 'selectUnique', 
            'joinItems', 'consumableList', 'getName', 'toString', 
            'valueOf', 'constructor', 'hasOwnProperty', 'isPrototypeOf',
            'propertyIsEnumerable', 'toLocaleString'
        ]);
        return Object.keys(listObj).filter(k => {
            if (k.startsWith('$')) return false;
            if (ignored.has(k)) return false;
            if (typeof listObj[k] === 'function' && k !== 'evaluateItem') return false;
            return true;
        });
    };

    window.getDropdownDisplayLabel = function (key) {
        const specialMap = {
            "Thrilling_Action": "Thrilling / Action",
            "Dark_Gritty": "Dark / Gritty",
            "Light_hearted_Comedic": "Light-hearted / Comedic",
            "Romantic_Comedy": "Romantic Comedy",
            "Dark_Humour": "Dark Humour",
            "Dark_Romance": "Dark Romance",
            "GenZ_Casual": "GenZ Casual",
            "Slow_Burn": "Slow Burn",
            "Don": "Don (Mafia)",
            "Succubus": "Succubus/Incubus",
            "Anti_Hero": "Anti-Hero",
            "Monster_Girl": "Monster Girl/Guy",
            "childhood_friend": "Childhood Friend",
            "FWB": "FWB",
            // Settings
            "Sci_Fi": "Sci-Fi",
            "Sci-Fi": "Sci-Fi",
            "Hard_Sci_Fi": "Hard Sci-Fi",
            "Zombie_apocalypse": "Zombie Apocalypse",
            "Alien_apocalypse": "Alien Apocalypse",
            "Post_Apocalyptic": "Post-Apocalyptic",
            "Frozen_Apocalypse": "Frozen Apocalypse",
            "Kaiju_Apocalypse": "Kaiju Apocalypse",
            "Heaven_Hell_War": "Heaven-Hell War",
            "Neo_Noir": "Neo-Noir",
            // Tones
            "Satirical_Biting": "Satirical (Biting)",
            // Dynamics
            "Enemies_To_Lovers": "Enemies to Lovers",
            "Forbidden_Love": "Forbidden Love",
            "Mentor_Student": "Mentor / Student",
            "Hunter_And_Prey": "Hunter and Prey",
            "Mutual_Obsession": "Mutual Obsession",
            "Forced_Cohabitation": "Forced Cohabitation",
            "Fake_Relationship": "Fake Relationship",
            "Protector_And_Protected": "Protector & Protected",
            "Rivals_With_Tension": "Rivals with Tension",
            "Betrayal_Reconciliation": "Betrayal & Reconciliation",
            "Toxic_Codependency": "Toxic Codependency",
            "Worship_And_Disgust": "Worship & Disgust",
            "Captor_And_Captive": "Captor & Captive",
            "Cat_And_Mouse": "Cat and Mouse",
            "Sun_And_Moon": "Sun & Moon",
            "Brain_And_Brawn": "Brain & Brawn",
            "Beauty_And_Beast": "Beauty & Beast",
            "Master_And_Servant": "Master & Servant",
            "Creator_And_Creation": "Creator & Creation"
        };
        if (specialMap[key]) return specialMap[key];
        return key.replace(/_/g, " ");
    };

    window.SETTING_KEYS = [
        "Any", "Fantasy", "Medieval_Fantasy", "High_Fantasy", "Sci_Fi", "Cyberpunk",
        "Real_World_Modern", "Real_World_Furry", "Real_World_Fantasy", "Historical", "Post_Apocalyptic",
        "Zombie_apocalypse", "Alien_apocalypse",
        "Horror", "Mythology", "Solarpunk", "Dark_Fantasy", "Urban_Fantasy",
        "Steampunk", "Dieselpunk", "Space_Opera", "Hard_Sci_Fi", "Weird_West",
        "Gothic", "Fairy_Tale", "Wuxia", "Isekai", "Biopunk",
        "Frozen_Apocalypse", "Underwater", "Dreamlike", "Satirical",
        "Academy_Fantasy", "Cultivation", "Pirate_Fantasy", "Magitech", "Cosmic_Horror",
        "Prehistoric_Fantasy", "Divine_War", "Prison_World", "Megadungeon", "Floating_Islands",
        "Vampire_Gothic", "Neo_Noir", "Retrofuturism", "Kaiju_Apocalypse", "Eldritch_Seafaring",
        "Feudal_Japan_Fantasy", "Tribal_Fantasy", "Corporate_Dystopia", "Virtual_World",
        "Heaven_Hell_War", "Broken_Moon", "Monster_Hunter", "Time_Collapse", "Biohorror",
        "Desertpunk", "Lunar_Colony", "Deep_Jungle", "Arcology", "Celestial_Court",
        "Dream_War", "Necropunk", "Infernal_Modern", "Ruined_Utopia"
    ];

    window.TONE_KEYS = [
        "Any", "Grounded", "Thrilling_Action", "Dark_Gritty", "Light_hearted_Comedic",
        "Mysterious", "Romantic", "Erotic", "Tragic", "Whimsical", "Epic",
        "Affectionate", "Flirtatious", "Sensual", "Explicit", "Romantic_Comedy",
        "Dark_Humour", "Gory", "Cute", "Dark_Romance", "Smut", "GenZ_Casual",
        "Documentary", "Slow_Burn",
        "Paranoid", "Claustrophobic", "Hopepunk", "Nihilistic", "Melancholic",
        "Chaotic", "Cozy", "Brutal", "Operatic", "Cynical", "Surreal",
        "Tense", "Intimate", "Campy", "Hallucinatory", "Reverent", "Decadent",
        "Stoic", "Satirical_Biting", "Existential", "Lonely", "Euphoric",
        "Clinical", "Unhinged"
    ];

    window.ARCHETYPE_KEYS = [
        "Any", "Tsundere", "Yandere", "Kuudere", "Dandere", "Deredere", "Himedere", "Kamidere",
        "Female", "Male", "Femboy", "Tomboy", "Futa", "childhood_friend", "Bestie", "FWB",
        "Don", "Boss", "Milf", "Furry", "Ghost", "Maid", "Butler", "Detective", "Knight", "Royalty",
        "Assassin", "Scholar", "Deity", "Cyborg", "Android", "Vampire", "Werewolf", "Neko",
        "Succubus", "Villain", "Anti_Hero", "Monster_Girl", "Bully", "Enemy", "Cute", "Psychopath",
        "Gyaru", "Chuuni", "Onee_San", "Sadist", "Masochist", "Menhera", "Genki", "Jock",
        "Delinquent", "Idol", "NEET", "Hikikomori", "Gamer", "Mentor", "Rival", "Ex_Lover",
        "Bodyguard", "Handler", "Handler_And_Asset", "Arranged_Partner", "Devoted_Follower",
        "Caretaker", "Worshipper", "Narcissist", "Sociopath", "Martyr", "Zealot", "Coward",
        "Perfectionist", "Hedonist", "Paranoid", "Control_Freak", "Survivor", "Broken_Hero",
        "Fanatic", "Mercenary", "Priest", "Smuggler", "Gladiator", "Revolutionary", "CEO",
        "Influencer", "Streamer", "Hacker", "Scientist", "Cult_Leader", "Bounty_Hunter",
        "Survivor_Leader", "Dragon", "Angel", "Demon", "Slime_Girl", "Eldritch",
        "Artificial_Intelligence", "Parasite", "Hive_Mind", "Living_Weapon", "Chimera",
        "Doll", "Mimic"
    ];

    window.DYNAMIC_KEYS = [
        "Any", "Enemies_To_Lovers", "Forbidden_Love", "Mentor_Student", "Hunter_And_Prey",
        "Mutual_Obsession", "Forced_Cohabitation", "Fake_Relationship", "Protector_And_Protected",
        "Rivals_With_Tension", "Betrayal_Reconciliation", "Toxic_Codependency", "Worship_And_Disgust",
        "Captor_And_Captive", "Cat_And_Mouse", "Sun_And_Moon", "Brain_And_Brawn", "Beauty_And_Beast",
        "Master_And_Servant", "Creator_And_Creation"
    ];

    window.RP_DYNAMIC_KEYS = [
        "Any", "Best_friends", "Bullies", "Party_members", "Betrayers", "Harem",
        "Enemies_To_Lovers", "Forbidden_Love", "Mutual_Obsession", "Forced_Cohabitation",
        "Fake_Relationship", "Protector_And_Protected", "Rivals_With_Tension",
        "Toxic_Codependency", "Captor_And_Captive", "Sun_And_Moon", "Brain_And_Brawn", "Master_And_Servant"
    ];

    window.roleplayDynamics = {
        "Best_friends": "Close, loyal, and supportive bond with inside jokes and mutual trust.",
        "Bullies": "Hostile, teasing, or domineering relationships where characters pick on each other.",
        "Party_members": "Teammates working towards a common goal or adventuring together.",
        "Betrayers": "Hidden agendas, distrust, or a past/looming backstab.",
        "Harem": "Multiple characters vying for or sharing affection with the protagonist.",
        "Enemies_To_Lovers": "Deep-seated hostility that slowly transforms into romantic connection.",
        "Forbidden_Love": "Secretive, high-tension romance blocked by factions or rules.",
        "Mutual_Obsession": "Consuming focus and intense devotion to one another.",
        "Forced_Cohabitation": "Forced to share a small space, leading to friction and adaptation.",
        "Fake_Relationship": "Pretending to be together for a mission, hiding real feelings.",
        "Protector_And_Protected": "Strong protective instincts, dependency, and duty-bound closeness.",
        "Rivals_With_Tension": "Constant competition, playful teasing, and friction.",
        "Toxic_Codependency": "Spurred by destructive reliance on each other to survive.",
        "Captor_And_Captive": "Power imbalance, forced custody, and psychological adaptation.",
        "Sun_And_Moon": "Contrasting personalities (bright/warm vs quiet/cold) that complete each other.",
        "Brain_And_Brawn": "Intellect and planning paired with physical power and execution.",
        "Master_And_Servant": "Service, duty, and the complex boundaries of class and connection."
    };


    /**
     * Dynamically populates custom select dropdown element.
     */
    window.initializeDropdownOptions = function (config) {
        let listEl = document.getElementById(config.listElId);
        if (!listEl) return;
        
        let keys = [];
        const isPerchance = window.location.hostname.includes("perchance.org");
        if (isPerchance && config.perchanceSource) {
            keys = window.getPerchanceListKeys(config.perchanceSource);
        }
        if (!keys || keys.length === 0) {
            keys = config.fallbackKeys;
        }
        if (!keys.includes("Any")) {
            keys.unshift("Any");
        }
        
        if (config.isMultiSelect) {
            keys = keys.filter(k => k !== "Any");
            let html = `
                <div class="dropdown-option-item-checkbox" data-value="Any">
                    <label style="display: flex; align-items: center; width: 100%; height: 100%; padding: 0.35rem 0.5rem; cursor: pointer; user-select: none; gap: 0.5rem; margin: 0;">
                        <input type="checkbox" id="${config.inputName}AnyCheckbox" value="Any" onchange="${config.onSelect}AnyToggle(this)" style="cursor: pointer; accent-color: var(--accent-color);">
                        <span>Any</span>
                    </label>
                </div>
                <hr style="margin:0.25rem 0; border-color:var(--panel-border);">
            `;
            html += keys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `
                    <div class="dropdown-option-item-checkbox" data-value="${k}">
                        <label style="display: flex; align-items: center; width: 100%; height: 100%; padding: 0.35rem 0.5rem; cursor: pointer; user-select: none; gap: 0.5rem; margin: 0;">
                            <input type="checkbox" class="${config.inputName}Checkbox" value="${k}" onchange="${config.onSelect}Change()" style="cursor: pointer; accent-color: var(--accent-color);">
                            <span>${label}</span>
                        </label>
                    </div>
                `;
            }).join("");
            listEl.innerHTML = html;
        } else {
            listEl.innerHTML = keys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `
                    <div class="dropdown-option-item" data-value="${k}" onclick="${config.onSelect}('${k}', true)">
                        <span>${label}</span>
                        <i class="bi bi-check-lg" style="display: none; color: var(--accent-color);"></i>
                    </div>
                `;
            }).join("");
        }
    };

    /**
     * Filters list items in a custom dropdown.
     */
    window.filterDropdownOptions = function (listId, query) {
        let q = query.toLowerCase().trim();
        let listEl = document.getElementById(listId);
        if (!listEl) return;
        
        let items = listEl.querySelectorAll(".dropdown-option-item, .dropdown-option-item-checkbox");
        items.forEach(item => {
            if (item.getAttribute("data-value") === "Any" || item.querySelector("[value='Any']")) {
                item.style.display = "flex";
                return;
            }
            let span = item.querySelector("span");
            let text = span ? span.textContent.toLowerCase() : item.textContent.toLowerCase();
            if (text.includes(q)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    };

    window.populateParameterSelects = function () {
        // Helper to get sorted keys
        function getKeys(perchanceSource, fallbackKeys) {
            let keys = [];
            const isPerchance = window.location.hostname.includes("perchance.org");
            if (isPerchance && typeof root !== "undefined" && perchanceSource) {
                keys = window.getPerchanceListKeys(perchanceSource);
            }
            if (!keys || keys.length === 0) {
                keys = fallbackKeys;
            }
            keys = keys.filter(k => k !== "Any" && k !== "none");
            keys.sort((a, b) => a.localeCompare(b));
            return keys;
        }

        // 1. Populate Setting
        const settingEl = document.getElementById("settingEl");
        if (settingEl) {
            let settingKeys = [];
            const isPerchance = window.location.hostname.includes("perchance.org");
            if (isPerchance && typeof root !== "undefined" && root.settingPrompts) {
                settingKeys = window.getPerchanceListKeys(root.settingPrompts);
            }
            if (!settingKeys || settingKeys.length === 0) {
                settingKeys = window.SETTING_KEYS;
            }
            settingKeys = settingKeys.filter(k => k !== "Any" && k !== "none");
            settingKeys.sort((a, b) => a.localeCompare(b));
            settingKeys.unshift("Any");
            settingEl.innerHTML = settingKeys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `<option value="${k}">${label}</option>`;
            }).join("");
            settingEl.value = localStorage.setting || "Any";
        }

        // 2. Populate Tone
        const toneEl = document.getElementById("toneEl");
        if (toneEl) {
            let keys = getKeys(typeof root !== "undefined" ? root.tonePrompts : null, window.TONE_KEYS);
            let html = `<option value="none">Any</option>`;
            html += keys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `<option value="${k}">${label}</option>`;
            }).join("");
            toneEl.innerHTML = html;
        }

        // 3. Populate Archetypes
        const archetypeEl = document.getElementById("archetypeEl");
        if (archetypeEl) {
            let keys = getKeys(typeof root !== "undefined" ? root.archetypePrompts : null, window.ARCHETYPE_KEYS);
            let html = `<option value="none">Any</option>`;
            html += keys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `<option value="${k}">${label}</option>`;
            }).join("");
            archetypeEl.innerHTML = html;
        }

        // 4. Populate Dynamics
        const dynamicEl = document.getElementById("dynamicEl");
        if (dynamicEl) {
            let keys = getKeys(typeof root !== "undefined" ? root.relationshipDynamics : null, window.DYNAMIC_KEYS);
            let html = `<option value="none">Any</option>`;
            html += keys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `<option value="${k}">${label}</option>`;
            }).join("");
            dynamicEl.innerHTML = html;
        }

        // 5. Populate World Setting
        const wSettingEl = document.getElementById("wSettingEl");
        if (wSettingEl) {
            let settingKeys = [];
            const isPerchance = window.location.hostname.includes("perchance.org");
            if (isPerchance && typeof root !== "undefined" && root.settingPrompts) {
                settingKeys = window.getPerchanceListKeys(root.settingPrompts);
            }
            if (!settingKeys || settingKeys.length === 0) {
                settingKeys = window.SETTING_KEYS;
            }
            settingKeys = settingKeys.filter(k => k !== "Any" && k !== "none");
            settingKeys.sort((a, b) => a.localeCompare(b));
            settingKeys.unshift("Any");
            wSettingEl.innerHTML = settingKeys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `<option value="${k}">${label}</option>`;
            }).join("");
            wSettingEl.value = (window.worldState && window.worldState.setting) || "Any";
        }

        // 6. Populate World Tone
        const wToneEl = document.getElementById("wToneEl");
        if (wToneEl) {
            let keys = getKeys(typeof root !== "undefined" ? root.tonePrompts : null, window.TONE_KEYS);
            let html = `<option value="none">Any</option>`;
            html += keys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `<option value="${k}">${label}</option>`;
            }).join("");
            wToneEl.innerHTML = html;
        }

        // 7. Populate Roleplay Setting
        const rpSettingEl = document.getElementById("rpSettingEl");
        if (rpSettingEl) {
            let settingKeys = [];
            const isPerchance = window.location.hostname.includes("perchance.org");
            if (isPerchance && typeof root !== "undefined" && root.settingPrompts) {
                settingKeys = window.getPerchanceListKeys(root.settingPrompts);
            }
            if (!settingKeys || settingKeys.length === 0) {
                settingKeys = window.SETTING_KEYS;
            }
            settingKeys = settingKeys.filter(k => k !== "Any" && k !== "none");
            settingKeys.sort((a, b) => a.localeCompare(b));
            settingKeys.unshift("Any");
            rpSettingEl.innerHTML = settingKeys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `<option value="${k}">${label}</option>`;
            }).join("");
            rpSettingEl.value = (window.roleplayState && window.roleplayState.setting) || "Any";
        }

        // 8. Populate Roleplay Tone
        const rpToneEl = document.getElementById("rpToneEl");
        if (rpToneEl) {
            let keys = getKeys(typeof root !== "undefined" ? root.tonePrompts : null, window.TONE_KEYS);
            let html = `<option value="none">Any</option>`;
            html += keys.map(k => {
                let label = window.getDropdownDisplayLabel ? window.getDropdownDisplayLabel(k) : k.replace(/_/g, " ");
                return `<option value="${k}">${label}</option>`;
            }).join("");
            rpToneEl.innerHTML = html;
        }

        // 9. Populate rpDynamicEl
        const rpDynamicEl = document.getElementById("rpDynamicEl");
        if (rpDynamicEl) {
            let keys = window.RP_DYNAMIC_KEYS || [];
            let html = `<option value="none">Any</option>`;
            html += keys.filter(k => k !== "Any").map(k => {
                let label = k.replace(/_/g, " ");
                return `<option value="${k}">${label}</option>`;
            }).join("");
            rpDynamicEl.innerHTML = html;
        }
    };

    window.selectSetting = function (value) {
        localStorage.setting = value;
        const settingEl = document.getElementById("settingEl");
        if (settingEl) {
            settingEl.value = value;
            window.syncCustomSelectLabel(settingEl);
        }
        const rpSettingEl = document.getElementById("rpSettingEl");
        if (rpSettingEl) {
            rpSettingEl.value = value;
            window.syncCustomSelectLabel(rpSettingEl);
        }
        if (window.roleplayState) {
            window.roleplayState.setting = value;
            window.saveRoleplayState();
        }
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    // Tone Dropdown functions
    window.getSelectedTones = function () {
        const sel = multiSelectState["toneEl"];
        if (!sel || sel.size === 0 || (sel.size === 1 && sel.has("none"))) {
            return ["Any"];
        }
        return Array.from(sel).filter(v => v !== "none");
    };

    window.updateToneLabel = function () {
        window.syncCustomSelectLabel("toneEl");
        window.syncCustomSelectLabel("rpToneEl");
    };

    window.saveTones = function () {
        let activeId = currentActiveSelectEl ? currentActiveSelectEl.id : "toneEl";
        if (activeId === "toneEl" || activeId === "rpToneEl") {
            let activeSel = multiSelectState[activeId];
            multiSelectState["toneEl"] = new Set(activeSel);
            multiSelectState["rpToneEl"] = new Set(activeSel);
            window.syncCustomSelectLabel("toneEl");
            window.syncCustomSelectLabel("rpToneEl");
        }
        let tones = getSelectedTones();
        localStorage.tones = JSON.stringify(tones);
        if (window.roleplayState) {
            window.roleplayState.tones = tones;
            window.saveRoleplayState();
        }
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.loadTones = function () {
        try {
            let saved = JSON.parse(localStorage.tones || '["Any"]');
            const sel = new Set();
            if (!saved || saved.length === 0 || saved[0] === "Any" || saved[0] === "none") {
                sel.add("none");
            } else {
                saved.forEach(t => {
                    if (t !== "Any") sel.add(t);
                });
            }
            multiSelectState["toneEl"] = new Set(sel);
            multiSelectState["rpToneEl"] = new Set(sel);
        } catch (e) {
            multiSelectState["toneEl"] = new Set(["none"]);
            multiSelectState["rpToneEl"] = new Set(["none"]);
        }
        window.syncCustomSelectLabel("toneEl");
        window.syncCustomSelectLabel("rpToneEl");
    };

    // Archetype Dropdown functions
    window.getSelectedArchetypes = function () {
        const sel = multiSelectState["archetypeEl"];
        if (!sel || sel.size === 0 || (sel.size === 1 && sel.has("none"))) {
            return ["Any"];
        }
        return Array.from(sel).filter(v => v !== "none");
    };

    window.updateArchetypeLabel = function () {
        window.syncCustomSelectLabel("archetypeEl");
    };

    window.saveArchetypes = function () {
        let activeId = currentActiveSelectEl ? currentActiveSelectEl.id : "archetypeEl";
        if (activeId === "archetypeEl") {
            let activeSel = multiSelectState[activeId];
            multiSelectState["archetypeEl"] = new Set(activeSel);
            window.syncCustomSelectLabel("archetypeEl");
        }
        localStorage.archetypes = JSON.stringify(getSelectedArchetypes());
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.loadArchetypes = function () {
        try {
            let saved = JSON.parse(localStorage.archetypes || '["Any"]');
            const sel = new Set();
            if (!saved || saved.length === 0 || saved[0] === "Any" || saved[0] === "none") {
                sel.add("none");
            } else {
                saved.forEach(t => {
                    if (t !== "Any") sel.add(t);
                });
            }
            multiSelectState["archetypeEl"] = new Set(sel);
        } catch (e) {
            multiSelectState["archetypeEl"] = new Set(["none"]);
        }
        window.syncCustomSelectLabel("archetypeEl");
    };

    // Dynamic Dropdown functions
    window.getSelectedDynamics = function () {
        const sel = multiSelectState["dynamicEl"];
        if (!sel || sel.size === 0 || (sel.size === 1 && sel.has("none"))) {
            return ["Any"];
        }
        return Array.from(sel).filter(v => v !== "none");
    };

    window.updateDynamicLabel = function () {
        window.syncCustomSelectLabel("dynamicEl");
    };

    window.saveDynamics = function () {
        let activeId = currentActiveSelectEl ? currentActiveSelectEl.id : "dynamicEl";
        if (activeId === "dynamicEl") {
            let activeSel = multiSelectState[activeId];
            multiSelectState["dynamicEl"] = new Set(activeSel);
            window.syncCustomSelectLabel("dynamicEl");
        }
        localStorage.dynamics = JSON.stringify(getSelectedDynamics());
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.loadDynamics = function () {
        try {
            let saved = JSON.parse(localStorage.dynamics || '["Any"]');
            const sel = new Set();
            if (!saved || saved.length === 0 || saved[0] === "Any" || saved[0] === "none") {
                sel.add("none");
            } else {
                saved.forEach(t => {
                    if (t !== "Any") sel.add(t);
                });
            }
            multiSelectState["dynamicEl"] = new Set(sel);
        } catch (e) {
            multiSelectState["dynamicEl"] = new Set(["none"]);
        }
        window.syncCustomSelectLabel("dynamicEl");
    };

    // Perspective Dropdown functions
    window.getSelectedPerspective = function () {
        const perspectiveEl = document.getElementById("perspectiveEl");
        return perspectiveEl ? perspectiveEl.value : (localStorage.perspective || "Third_Person");
    };

    window.selectPerspective = function (value) {
        localStorage.perspective = value;
        const perspectiveEl = document.getElementById("perspectiveEl");
        if (perspectiveEl) {
            perspectiveEl.value = value;
            window.syncCustomSelectLabel(perspectiveEl);
        }
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.loadPerspective = function () {
        let val = localStorage.perspective || "Third_Person";
        window.selectPerspective(val);
    };
/* ==========================================================================
   MOBILE-FIRST SELECT DROPDOWN DRAWER INTEGRATION
   ========================================================================== */
    let currentActiveSelectEl = null;
    let currentActiveWrapper = null;
    const multiSelectIds = new Set(['toneEl', 'archetypeEl', 'dynamicEl', 'wToneEl', 'rpToneEl', 'rpDynamicEl']);
    const multiSelectState = {};
    window.multiSelectState = multiSelectState;

    const selectToListNameMap = {
        'visualStyleEl': 'visualStyles',
        'settingEl': 'settingPrompts',
        'toneEl': 'tonePrompts',
        'archetypeEl': 'archetypePrompts',
        'dynamicEl': 'relationshipDynamics',
        'wSettingEl': 'settingPrompts',
        'wToneEl': 'tonePrompts',
        'rpSettingEl': 'settingPrompts',
        'rpToneEl': 'tonePrompts',
        'rpDynamicEl': 'roleplayDynamics'
    };

    const drawerHeaders = {
        'worldLoreLengthEl': 'WORLD LORE LENGTH',
        'charWorldImportSelector': 'LOAD SAVED WORLD',
        'shortDescriptionLengthEl': 'SHORT DESCRIPTION LENGTH',
        'appearanceLengthEl': 'APPEARANCE LENGTH',
        'visualStyleEl': 'VISUAL STYLE',
        'imageCountEl': 'IMAGE COUNT',
        'roleLengthEl': 'ROLE/BACKGROUND LENGTH',
        'personalityLengthEl': 'PERSONALITY LENGTH',
        'beliefsLengthEl': 'BELIEFS LENGTH',
        'preferencesLengthEl': 'PREFERENCES LENGTH',
        'abilitiesLengthEl': 'ABILITIES LENGTH',
        'relationsLengthEl': 'RELATIONS LENGTH',
        'backgroundLengthEl': 'BACKGROUND LENGTH',
        'timelineLengthEl': 'TIMELINE LENGTH',
        'roleplayLengthEl': 'ROLEPLAY LENGTH',
        'introLengthEl': 'INTRO LENGTH',
        'wLengthEl': 'WORLD LORE LENGTH',
        'rpLengthEl': 'STARTER LENGTH',
        'rpWorldImportSelector': 'LOAD SAVED WORLD',
        'settingEl': 'WORLD SETTING',
        'toneEl': 'ATMOSPHERIC TONES',
        'archetypeEl': 'CHARACTER ARCHETYPES',
        'dynamicEl': 'RELATIONSHIP DYNAMICS',
        'globalLengthEl': 'GLOBAL TEXT LENGTH',
        'perspectiveEl': 'NARRATION PERSPECTIVE',
        'wSettingEl': 'WORLD SETTING',
        'wToneEl': 'ATMOSPHERIC TONES',
        'rpSettingEl': 'ROLEPLAY SETTING',
        'rpToneEl': 'ATMOSPHERIC TONES',
        'rpDynamicEl': 'ROLEPLAY DYNAMICS',
        'rpGlobalLengthEl': 'GLOBAL TEXT LENGTH',
        'rpNPCCastCountEl': 'NPC CAST COUNT',
        'rpTab-timelineLengthEl': 'TIMELINE LENGTH',
        'rpTab-roleplayLengthEl': 'ROLEPLAY LENGTH',
        'rpTab-introLengthEl': 'INTRO LENGTH'
    };

    const gradients = [
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(135deg, #a6c0fe 0%, #f1a7f1 100%)',
        'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
        'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
        'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)'
    ];

    function getGradientForString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return gradients[Math.abs(hash) % gradients.length];
    }

    function extractEmoji(text) {
        if (!text) return '✨';
        try {
            const match = text.match(/(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u);
            return match ? match[0] : text.charAt(0).toUpperCase();
        } catch { return text.charAt(0).toUpperCase(); }
    }

    // Close drawer (Done button)
    window.closeDrawer = function () {
        const drawer = document.getElementById('customDropdownDrawer');
        if (!drawer) return;
        drawer.classList.remove('open', 'expanded');
        if (currentActiveWrapper) currentActiveWrapper.classList.remove('open');
        
        if (currentActiveSelectEl) {
            const id = currentActiveSelectEl.id;
            if (id === 'toneEl') saveTones();
            else if (id === 'archetypeEl') saveArchetypes();
            else if (id === 'dynamicEl') saveDynamics();
            else if (id === 'wToneEl' && typeof saveWorldTones === 'function') saveWorldTones();
            else if (id === 'rpToneEl' && typeof saveRoleplayTones === 'function') saveRoleplayTones();
            
            currentActiveSelectEl.dispatchEvent(new Event('change', { bubbles: true }));
            if (typeof currentActiveSelectEl.onchange === 'function') {
                currentActiveSelectEl.onchange();
            }
        }
        
        currentActiveSelectEl = null;
        currentActiveWrapper = null;
    };

    // Clear select values (Clear button)
    window.clearSelection = function () {
        if (!currentActiveSelectEl) return;
        const id = currentActiveSelectEl.id;
        const isMulti = multiSelectIds.has(id);
        if (isMulti) {
            const sel = new Set();
            const hasNoneOption = Array.from(currentActiveSelectEl.options).some(o => o.value === 'none');
            if (hasNoneOption) {
                sel.add('none');
            }
            multiSelectState[id] = sel;
            updateMultiSelectLabel(currentActiveSelectEl, currentActiveWrapper);
            
            const scrollBox = document.getElementById('customDropdownDrawerContent');
            if (scrollBox) {
                scrollBox.querySelectorAll('.custom-select-card').forEach(c => {
                    c.classList.toggle('selected', c.dataset.value === 'none');
                });
            }
        } else {
            currentActiveSelectEl.selectedIndex = 0;
            currentActiveSelectEl.dispatchEvent(new Event('change', { bubbles: true }));
            if (typeof currentActiveSelectEl.onchange === 'function') currentActiveSelectEl.onchange();
            
            const labelSpan = currentActiveWrapper.querySelector('.custom-select-label');
            if (labelSpan && currentActiveSelectEl.options[0]) {
                labelSpan.textContent = currentActiveSelectEl.options[0].textContent;
            }
            
            const scrollBox = document.getElementById('customDropdownDrawerContent');
            if (scrollBox) {
                scrollBox.querySelectorAll('.custom-select-card').forEach(c => {
                    c.classList.toggle('selected', parseInt(c.dataset.index) === 0);
                });
            }
        }
    };

    // Select all multi-select items (Clear "none" and select all others)
    window.selectAllMultiSelect = function () {
        if (!currentActiveSelectEl) return;
        const id = currentActiveSelectEl.id;
        if (!multiSelectIds.has(id)) return;
        
        const sel = new Set();
        const originalOptions = Array.from(currentActiveSelectEl.options);
        originalOptions.forEach(opt => {
            if (opt.value !== 'none') {
                sel.add(opt.value);
            }
        });
        
        multiSelectState[id] = sel;
        
        // Update all card selected states in drawer
        const scrollBox = document.getElementById('customDropdownDrawerContent');
        if (scrollBox) {
            scrollBox.querySelectorAll('.custom-select-card').forEach(c => {
                if (c.dataset.value !== 'none') {
                    c.classList.add('selected');
                } else {
                    c.classList.remove('selected');
                }
            });
        }
        updateMultiSelectLabel(currentActiveSelectEl, currentActiveWrapper);
    };

    // Update trigger label + badge for a multi-select
    function updateMultiSelectLabel(selectEl, wrapper) {
        const labelSpan = wrapper.querySelector('.custom-select-label');
        if (!labelSpan) return;
        const sel = multiSelectState[selectEl.id];
        if (!sel || sel.size === 0) {
            labelSpan.textContent = selectEl.options[0] ? selectEl.options[0].textContent : '';
            const existingBadge = wrapper.querySelector('.custom-select-badge');
            if (existingBadge) existingBadge.remove();
            return;
        }
        const values = Array.from(sel);
        const firstOpt = Array.from(selectEl.options).find(o => o.value === values[0]);
        labelSpan.textContent = firstOpt ? firstOpt.textContent : values[0];
        let badge = wrapper.querySelector('.custom-select-badge');
        if (sel.size > 1) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'custom-select-badge';
                labelSpan.after(badge);
            }
            badge.textContent = `+${sel.size - 1}`;
        } else {
            if (badge) badge.remove();
        }
    }

    function buildCard(opt, idx, selectEl, wrapper, isMulti, scrollBox) {
        const card = document.createElement('div');
        card.dataset.value = opt.value;
        card.dataset.index = idx;

        let isSelected = false;
        if (isMulti) {
            isSelected = (multiSelectState[selectEl.id] || new Set()).has(opt.value);
        } else {
            isSelected = idx === selectEl.selectedIndex;
        }
        card.className = 'custom-select-card' + (isSelected ? ' selected' : '');

        let imageUrl = null;
        let itemDescription = '';
        
        // Custom lookup for saved worlds selector
        if (selectEl.id === 'charWorldImportSelector' || selectEl.id === 'rpWorldImportSelector') {
            try {
                const saved = JSON.parse(localStorage.savedWorlds || '[]');
                const world = saved.find(w => String(w.id) === String(opt.value));
                if (world) {
                    if (world.bannerUrl) imageUrl = world.bannerUrl;
                    let descParts = [];
                    if (world.setting && world.setting !== 'Any') descParts.push("Setting: " + world.setting.replace(/_/g, ' '));
                    if (world.tones && world.tones.length > 0 && world.tones[0] !== 'Any') descParts.push("Tones: " + world.tones.join(', ').replace(/_/g, ' '));
                    if (world.sections && world.sections.worldLore) {
                        let lore = String(world.sections.worldLore).replace(/<[^>]*>/g, '').trim();
                        if (lore) {
                            if (lore.length > 100) lore = lore.substring(0, 97) + '...';
                            descParts.push(lore);
                        }
                    }
                    itemDescription = descParts.join(' | ');
                }
            } catch(e) {}
        }

        const listName = selectToListNameMap[selectEl.id];
        if (listName && !imageUrl && !itemDescription) {
            try {
                let listObj = null;
                try {
                    listObj = eval(listName);
                } catch (e) {
                    listObj = window[listName];
                }
                if (!listObj && typeof root !== 'undefined') {
                    listObj = root[listName];
                }
                if (!listObj && typeof window.root !== 'undefined') {
                    listObj = window.root[listName];
                }

                let itemObj = null;
                if (listObj) {
                    if (listObj.selectAll) {
                        itemObj = listObj.selectAll.find(item => item.getName === opt.value);
                    } else {
                        itemObj = listObj[opt.value];
                    }
                }

                if (itemObj) {
                    if (typeof itemObj === 'object') {
                        let rawImg = String(itemObj.image ?? '').trim();
                        if (rawImg && rawImg !== 'undefined') {
                            imageUrl = rawImg;
                            if (imageUrl.startsWith('assets/images/')) {
                                imageUrl = imageUrl.replace('assets/images/', 'assets/Images/');
                            }
                        }
                        let rawDesc = String(itemObj.description ?? '').trim();
                        if (rawDesc && rawDesc !== 'undefined') {
                            itemDescription = rawDesc;
                        }
                    } else if (typeof itemObj === 'string') {
                        itemDescription = itemObj.trim();
                    }
                }
            } catch (e) { /* silent */ }
        }

        // Thumbnail
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'card-image-wrapper';
        const fallback = document.createElement('div');
        fallback.className = 'card-image-fallback';
        fallback.style.background = getGradientForString(opt.textContent);
        fallback.textContent = extractEmoji(opt.textContent);

        const img = document.createElement('img');
        img.className = 'card-image';
        img.alt = opt.textContent;

        let hasTriedListUrl = false;
        let hasTriedFallbackUrl = false;

        img.onload = () => {
            img.style.display = 'block';
            fallback.style.display = 'none';
        };

        img.onerror = () => {
            if (imageUrl && !hasTriedListUrl) {
                hasTriedListUrl = true;
            }
            if (!hasTriedFallbackUrl) {
                hasTriedFallbackUrl = true;
                let cleanPromptName = opt.textContent.replace(/[\p{Emoji_Presentation}|\p{Emoji}\uFE0F]\s*/gu, '').trim();
                if (!cleanPromptName) cleanPromptName = opt.textContent.trim();
                let keyword = cleanPromptName.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-');
                img.src = 'https://loremflickr.com/800/600/' + keyword;
            } else {
                img.style.display = 'none';
                fallback.style.display = 'flex';
            }
        };

        if (imageUrl) {
            img.src = imageUrl;
        } else {
            hasTriedFallbackUrl = true;
            let cleanPromptName = opt.textContent.replace(/[\p{Emoji_Presentation}|\p{Emoji}\uFE0F]\s*/gu, '').trim();
            if (!cleanPromptName) cleanPromptName = opt.textContent.trim();
            let keyword = cleanPromptName.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-');
            img.src = 'https://loremflickr.com/800/600/' + keyword;
        }

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(fallback);

        // Content
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'card-content';
        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = opt.textContent;
        contentWrapper.appendChild(title);

        if (itemDescription) {
            const desc = document.createElement('div');
            desc.className = 'card-description';
            desc.textContent = itemDescription;
            contentWrapper.appendChild(desc);
        }

        // Checkmark circle
        const check = document.createElement('div');
        check.className = 'card-check';
        check.innerHTML = '<i class="bi bi-check-lg"></i>';
        card.appendChild(check);

        card.appendChild(imgWrapper);
        card.appendChild(contentWrapper);

        // Click handler
        card.addEventListener('click', (e) => {
            e.stopPropagation();

            if (isMulti) {
                const sel = multiSelectState[selectEl.id] || new Set();
                if (opt.value === 'none') {
                    if (sel.has('none')) {
                        sel.delete('none');
                        card.classList.remove('selected');
                    } else {
                        sel.clear();
                        sel.add('none');
                        scrollBox.querySelectorAll('.custom-select-card').forEach(c => {
                            c.classList.toggle('selected', c.dataset.value === 'none');
                        });
                    }
                } else {
                    if (sel.has(opt.value)) {
                        sel.delete(opt.value);
                        card.classList.remove('selected');
                    } else {
                        if (sel.has('none')) {
                            sel.delete('none');
                            const noneCard = scrollBox.querySelector('.custom-select-card[data-value="none"]');
                            if (noneCard) noneCard.classList.remove('selected');
                        }
                        sel.add(opt.value);
                        card.classList.add('selected');
                    }
                }
                multiSelectState[selectEl.id] = sel;
                updateMultiSelectLabel(selectEl, wrapper);
            } else {
                selectEl.value = opt.value;
                selectEl.dispatchEvent(new Event('change', { bubbles: true }));
                if (typeof selectEl.onchange === 'function') selectEl.onchange();
                const labelSpan = wrapper.querySelector('.custom-select-label');
                if (labelSpan) labelSpan.textContent = opt.textContent;
                scrollBox.querySelectorAll('.custom-select-card').forEach(c => {
                    c.classList.toggle('selected', parseInt(c.dataset.index) === idx);
                });
                window.closeDrawer();
            }
        });

        return card;
    }

    function setupDrawerContent(selectEl, wrapper, scrollBox, drawer) {
        currentActiveSelectEl = selectEl;
        currentActiveWrapper = wrapper;
        wrapper.classList.add('open');

        const headerTitleEl = document.getElementById('drawerHeaderTitle');
        if (headerTitleEl) {
            headerTitleEl.textContent = drawerHeaders[selectEl.id] || selectEl.id.toUpperCase();
        }

        const isMulti = multiSelectIds.has(selectEl.id);

        const headerBadgeEl = document.getElementById('drawerHeaderBadge');
        if (headerBadgeEl) {
            if (isMulti) {
                headerBadgeEl.textContent = 'Multi-Select';
                headerBadgeEl.className = 'badge rounded-pill fw-semibold text-uppercase bg-primary-subtle text-primary border border-primary-subtle';
            } else {
                headerBadgeEl.textContent = 'Single-Select';
                headerBadgeEl.className = 'badge rounded-pill fw-semibold text-uppercase bg-secondary-subtle text-secondary border border-secondary-subtle';
            }
            headerBadgeEl.style.display = 'inline-block';
        }

        const originalOptions = Array.from(selectEl.options);
        const itemsCount = originalOptions.length;
        scrollBox.innerHTML = '';

        if (itemsCount === 0) { drawer.classList.remove('open', 'expanded'); return; }

        const searchInput = document.getElementById('customDropdownSearchInput');
        if (searchInput) {
            searchInput.value = '';
            const clearBtn = document.getElementById('customDropdownSearchClear');
            if (clearBtn) clearBtn.style.display = 'none';
        }

        const selectAllBtn = document.getElementById('drawerSelectAllBtn');
        if (selectAllBtn) {
            selectAllBtn.style.display = isMulti ? 'inline-block' : 'none';
        }

        const sortedOptions = originalOptions.map((opt, idx) => ({ opt, idx }));
        sortedOptions.sort((a, b) => {
            let aSelected = false;
            let bSelected = false;
            if (isMulti) {
                const sel = multiSelectState[selectEl.id] || new Set();
                const isAImplicit = sel.size === 0 && a.opt.value === 'none';
                const isBImplicit = sel.size === 0 && b.opt.value === 'none';
                aSelected = sel.has(a.opt.value) || isAImplicit;
                bSelected = sel.has(b.opt.value) || isBImplicit;
            } else {
                aSelected = a.idx === selectEl.selectedIndex;
                bSelected = b.idx === selectEl.selectedIndex;
            }
            
            if (aSelected && !bSelected) return -1;
            if (!aSelected && bSelected) return 1;
            return a.idx - b.idx;
        });

        sortedOptions.forEach(({ opt, idx }, sortedIdx) => {
            const card = buildCard(opt, idx, selectEl, wrapper, isMulti, scrollBox);
            card.style.animationDelay = `${sortedIdx * 20}ms`;
            scrollBox.appendChild(card);
        });

        drawer.classList.add('open', 'expanded');

        setTimeout(() => {
            let targetIdx;
            if (isMulti) {
                const sel = multiSelectState[selectEl.id];
                if (sel && sel.size > 0) {
                    const firstVal = Array.from(sel)[0];
                    targetIdx = originalOptions.findIndex(o => o.value === firstVal);
                }
            } else {
                targetIdx = selectEl.selectedIndex;
            }
            if (targetIdx != null && targetIdx >= 0) {
                const targetCard = scrollBox.querySelector(`.custom-select-card[data-index="${targetIdx}"]`);
                if (targetCard) {
                    scrollBox.scrollTop = targetCard.offsetTop - (scrollBox.clientHeight / 2) + (targetCard.clientHeight / 2);
                }
            }
        }, 20);
    }

    function toggleSelectDrawer(selectEl, wrapper) {
        const drawer = document.getElementById('customDropdownDrawer');
        const scrollBox = document.getElementById('customDropdownDrawerContent');
        if (!drawer || !scrollBox) return;

        if (currentActiveSelectEl === selectEl && drawer.classList.contains('open')) {
            window.closeDrawer();
            return;
        }

        if (currentActiveWrapper) currentActiveWrapper.classList.remove('open');

        const isAlreadyOpen = drawer.classList.contains('open');
        const targetPanel = selectEl.closest('.panel');
        const currentPanel = drawer.parentNode;

        if (isAlreadyOpen) {
            if (targetPanel && currentPanel !== targetPanel) {
                // Instantly close/reset the drawer, move to the new panel, then trigger slide down
                drawer.classList.remove('open', 'expanded');
                drawer.style.transition = 'none';
                if (targetPanel.classList.contains('collapsed')) {
                    window.togglePanel(targetPanel.id);
                }
                targetPanel.appendChild(drawer);
                drawer.offsetHeight; // Force reflow
                drawer.style.transition = '';
                setupDrawerContent(selectEl, wrapper, scrollBox, drawer);
            } else {
                scrollBox.classList.add('fade-out');
                setTimeout(() => {
                    setupDrawerContent(selectEl, wrapper, scrollBox, drawer);
                    setTimeout(() => {
                        scrollBox.classList.remove('fade-out');
                    }, 50);
                }, 150);
            }
        } else {
            if (targetPanel) {
                if (targetPanel.classList.contains('collapsed')) {
                    window.togglePanel(targetPanel.id);
                }
                if (currentPanel !== targetPanel) {
                    targetPanel.appendChild(drawer);
                }
            } else {
                if (currentPanel !== document.body) {
                    document.body.appendChild(drawer);
                }
            }
            setupDrawerContent(selectEl, wrapper, scrollBox, drawer);
        }
    }

    window.initializeCustomSelect = function (selectEl) {
        if (!selectEl || selectEl.classList.contains('custom-select-hidden')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        wrapper.id = 'custom-select-' + selectEl.id;

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'custom-select-trigger';

        let iconClass = selectEl.dataset.dropdownIcon;
        if (iconClass) {
            let iconEl = document.createElement("i");
            iconEl.className = iconClass;
            iconEl.style.marginRight = "0.4rem";
            iconEl.style.flexShrink = "0";
            trigger.appendChild(iconEl);
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'custom-select-label';
        const arrowSpan = document.createElement('span');
        arrowSpan.className = 'custom-select-arrow';
        arrowSpan.innerHTML = '<i class="bi bi-chevron-down"></i>';
        trigger.appendChild(labelSpan);
        trigger.appendChild(arrowSpan);

        selectEl.parentNode.insertBefore(wrapper, selectEl.nextSibling);
        wrapper.appendChild(trigger);
        selectEl.classList.add('custom-select-hidden');

        selectEl.updateCustomSelectLabel = function () {
            if (multiSelectIds.has(selectEl.id)) {
                updateMultiSelectLabel(selectEl, wrapper);
            } else {
                const sel = selectEl.options[selectEl.selectedIndex];
                labelSpan.textContent = sel ? sel.textContent : '';
            }
        };

        selectEl.updateCustomSelectLabel();

        new MutationObserver(() => selectEl.updateCustomSelectLabel())
            .observe(selectEl, { childList: true, attributes: true, subtree: true });

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSelectDrawer(selectEl, wrapper);
        });
    };

    window.syncCustomSelectLabel = function (selectEl) {
        if (typeof selectEl === 'string') selectEl = document.getElementById(selectEl);
        if (selectEl && typeof selectEl.updateCustomSelectLabel === 'function') {
            selectEl.updateCustomSelectLabel();
        }
    };

    window.filterDrawerCards = function (query) {
        const clearBtn = document.getElementById('customDropdownSearchClear');
        const scrollBox = document.getElementById('customDropdownDrawerContent');
        if (!scrollBox) return;
        query = query.toLowerCase().trim();
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';
        
        let visibleCount = 0;
        scrollBox.querySelectorAll('.custom-select-card').forEach(card => {
            const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('.card-description')?.textContent || '').toLowerCase();
            const matches = title.includes(query) || desc.includes(query);
            card.style.display = matches ? 'flex' : 'none';
            if (matches) visibleCount++;
        });

        let noResultsEl = document.getElementById('customDropdownNoResults');
        if (visibleCount === 0) {
            if (!noResultsEl) {
                noResultsEl = document.createElement('div');
                noResultsEl.id = 'customDropdownNoResults';
                noResultsEl.className = 'w-100 py-4 text-center text-muted d-flex flex-column align-items-center justify-content-center';
                noResultsEl.innerHTML = `
                    <i class="bi bi-search mb-2 opacity-50" style="font-size: 1.5rem;"></i>
                    <span class="small fw-medium">No matching options found</span>
                    <button class="btn btn-sm btn-link text-decoration-none p-0 mt-1" style="font-size: 80%; color: var(--accent-color);" onclick="clearDrawerSearch()">Reset search</button>
                `;
                scrollBox.appendChild(noResultsEl);
            } else {
                noResultsEl.style.display = 'flex';
            }
        } else {
            if (noResultsEl) noResultsEl.style.display = 'none';
        }
    };

    window.clearDrawerSearch = function () {
        const inp = document.getElementById('customDropdownSearchInput');
        if (inp) { inp.value = ''; filterDrawerCards(''); inp.focus(); }
    };

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (!currentActiveSelectEl) return;
        if (e.target.closest('.custom-select-trigger') || e.target.closest('#customDropdownDrawer')) return;
        window.closeDrawer();
    });

    window.initCustomLengthDropdowns = function () {
        let selects = document.querySelectorAll("select.length-select");
        selects.forEach(selectEl => {
            if (selectEl.dataset.customDropdownInitialized) return;
            selectEl.dataset.customDropdownInitialized = "true";

            window.initializeCustomSelect(selectEl);
        });
    };

    // Initialize custom dropdowns on load
    setTimeout(() => {
        populateParameterSelects();
        initCustomLengthDropdowns();
        loadTones();
        loadArchetypes();
        loadDynamics();
        loadPerspective();
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
/* ==========================================================================
   THEME AND COLOR SCHEME CONTROLLER (DARK/LIGHT MODE)
   ========================================================================== */
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
/* ==========================================================================
   UI STATUS AND STATE HELPERS
   ========================================================================== */
    /**
     * Debounces a function call so that it only executes after a specified delay.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The delay in milliseconds.
     * @returns {Function} A debounced wrapper function.
     */
    window.debounce = function (func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    };

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

    window.toggleSidebarTab = function (tabName) {
        let sidebar = document.getElementById("sidebarEl");
        let brainSidebar = document.getElementById("brainSidebarEl");
        if (!sidebar) return;
        
        if (brainSidebar && brainSidebar.style.transform === "translateX(0%)") {
            brainSidebar.style.transform = "translateX(100%)";
        }
        
        let isSidebarOpen = sidebar.style.transform === "translateX(0%)";
        let activeTab = window.sidebarActiveTab || 'characters';
        
        if (isSidebarOpen && activeTab === tabName) {
            sidebar.style.transform = "translateX(100%)";
        } else {
            sidebar.style.transform = "translateX(0%)";
            window.switchSidebarTab(tabName);
        }
        
        if (typeof window.syncSidebarToggleButtons === 'function') {
            window.syncSidebarToggleButtons();
        }
    };

    window.toggleSidebar = function () {
        let sidebar = document.getElementById("sidebarEl");
        let brainSidebar = document.getElementById("brainSidebarEl");
        if (brainSidebar && brainSidebar.style.transform === "translateX(0%)") {
            brainSidebar.style.transform = "translateX(100%)";
        }
        let isOpen = sidebar.style.transform === "translateX(0%)";
        sidebar.style.transform = isOpen ? "translateX(100%)" : "translateX(0%)";
        if (typeof window.syncSidebarToggleButtons === 'function') {
            window.syncSidebarToggleButtons();
        }
    };

    window.toggleGallery = function () {
        togglePanel('gallerySectionEl');
    };

    window.toggleSectionEdit = function (section) {
        let isRp = (window.activeTab === "roleplay");
        let prefix = isRp ? "rpTab-" : "";
        let outputEl = document.getElementById(prefix + section + "OutputEl");
        let editBtn = document.getElementById(prefix + section + "EditBtnEl");
        
        if (!outputEl || !editBtn) return;
        let isEditing = outputEl.contentEditable === "true";
        let nextEditing = !isEditing;

        outputEl.contentEditable = nextEditing ? "true" : "false";
        if (nextEditing) {
            outputEl.style.border = "1px solid var(--accent-color)";
            outputEl.style.padding = "0.4rem";
            editBtn.innerHTML = '<i class="bi bi-floppy"></i> save';
            outputEl.focus();
        } else {
            outputEl.style.border = "none";
            outputEl.style.padding = "0.4rem 0";
            editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> edit';
            
            // Update the internal cache
            if (isRp) {
                if (section === "timeline") window.roleplayState.timeline = outputEl.innerText;
                if (section === "lore") window.roleplayState.lore = outputEl.innerText;
                if (section === "roleplay") window.roleplayState.roleplay = outputEl.innerText;
                if (section === "introScenario") window.roleplayState.introScenario = outputEl.innerText;
                if (section === "introStart") window.roleplayState.introStart = outputEl.innerText;
                if (typeof window.saveRoleplayState === "function") window.saveRoleplayState();
            } else {
                if (!window.characterSections) window.characterSections = {};
                window.characterSections[section] = outputEl.innerText;
                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
            }
        }
    };

    window.clearSection = function (section) {
        let isRp = (window.activeTab === "roleplay");
        let prefix = isRp ? "rpTab-" : "";

        let outputEl = document.getElementById(prefix + section + "OutputEl");
        let notesEl = document.getElementById(prefix + section + "NotesEl");
        let statusEl = document.getElementById(prefix + section + "StatusEl");

        if (outputEl) {
            outputEl.innerHTML = "";
            outputEl.style.display = "block";
        }
        if (notesEl) {
            notesEl.value = "";
            if (!isRp) {
                localStorage.removeItem(section + "Notes");
            }
        }
        if (statusEl) statusEl.textContent = "";

        if (isRp) {
            if (section === "timeline") window.roleplayState.timeline = "";
            if (section === "lore") window.roleplayState.lore = "";
            if (section === "roleplay") window.roleplayState.roleplay = "";
            if (section === "introScenario") window.roleplayState.introScenario = "";
            if (section === "introStart") window.roleplayState.introStart = "";
            if (typeof window.saveRoleplayState === "function") window.saveRoleplayState();
        } else {
            if (section === "lore") {
                clearLoreFields();
                localStorage.removeItem("loreText");
            }
            if (window.characterSections) delete window.characterSections[section];
            updateClearAllBtn();
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        }
    };

    // ─── COPY HELPERS ──────────────────────────────────────────────────
    window.copyText = function(text, btn) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            if (btn) {
                let origHtml = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-lg"></i>';
                setTimeout(() => { btn.innerHTML = origHtml; }, 1500);
            }
        }).catch(err => {
            console.warn("Clipboard write failed:", err);
        });
    };

    // ─── COPY SECTION TEXT ────────────────────────────────────────────
    window.copySectionText = function (section) {
        let isRp = (window.activeTab === "roleplay");
        let prefix = isRp ? "rpTab-" : "";
        let text = "";
        
        if (section === "lore" && !isRp) {
            text = compileLoreFromUI();
        } else {
            let el = document.getElementById(prefix + section + "OutputEl");
            if (el) text = el.innerText.trim();
        }
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            let btn = document.getElementById(prefix + section + "CopyBtnEl");
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
        let isRp = (window.activeTab === "roleplay");
        let prefix = isRp ? "rpTab-" : "";
        let el = document.getElementById(prefix + section + "StatusEl");
        if (el) el.textContent = message;
    };

    window.setSectionOutput = function (section, html) {
        let isRp = (window.activeTab === "roleplay");
        let prefix = isRp ? "rpTab-" : "";
        let el = document.getElementById(prefix + section + "OutputEl");
        if (el) {
            el.innerHTML = html;
            el.style.display = "block";
        }
        let editBtn = document.getElementById(prefix + section + "EditBtnEl");
        if (editBtn) editBtn.style.display = "inline-block";
        let copyBtn = document.getElementById(prefix + section + "CopyBtnEl");
        if (copyBtn) copyBtn.style.display = "inline-block";
    };

    window.setSectionGenerating = function (section, isGenerating) {
        let isRp = (window.activeTab === "roleplay");
        let prefix = isRp ? "rpTab-" : "";
        
        let genBtn = document.getElementById(prefix + section + "GenBtnEl");
        let stopBtn = document.getElementById(prefix + section + "StopBtnEl");
        if (genBtn) genBtn.disabled = isGenerating;
        if (stopBtn) stopBtn.style.display = isGenerating ? "inline-block" : "none";
        
        let outputEl = document.getElementById(prefix + section + "OutputEl");
        if (outputEl) {
            if (isGenerating) {
                outputEl.classList.add("generating-pulse");
                outputEl.style.display = "block";
            } else {
                outputEl.classList.remove("generating-pulse");
            }
        }
    };

    window.sanitizeImagePrompt = function(text) {
        if (!text) return "";
        return text.replace(/:::/g, ""); // Prevent Perchance image plugin prompt injection
    };

    /**
     * Formats generated AI section text to bold headers/labels.
     * @param {string} text - The raw generated text.
     * @returns {string} The formatted HTML string.
     */
    window.formatSectionText = function (text) {
        if (!text) return "";
        let r = text.replace(/(^|\n)([#*a-zA-Z/ _\-0-9]{1,50})(:\s?)/g, (m, p1, p2, p3) => p1 + `<b style="color:var(--accent-color)">${p2.replace(/[#*]/g, "").trim()}</b>` + (p3 === ":" ? ": " : p3));
        return r.replace(/(^|\n)([#*]+[a-zA-Z/ _\-0-9]{1,50})(\n)/g, (m, p1, p2, p3) => p1 + `<b style="color:var(--accent-color)">${p2.replace(/[#*]/g, "").trim()}</b>` + p3);
    };

    /**
     * Sanitizes AI generated text by applying user formatting preferences (banning em-dashes, bolding, or custom terms).
     * @param {string} text - The raw text from the AI stream.
     * @returns {string} The sanitized text.
     */
    window.sanitizeOutput = function (text) {
        if (!text) return "";
        let result = text;
        
        let banEmDash = localStorage.getItem("banEmDash") !== "false";
        let banBolding = localStorage.getItem("banBolding") === "true";
        let customBanned = (localStorage.getItem("customBanned") || "").trim();
        
        if (banEmDash) {
            result = result.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");
        }
        
        if (banBolding) {
            result = result.replace(/\*\*/g, "");
        }
        
        if (customBanned) {
            let terms = customBanned.split(",").map(t => t.trim()).filter(t => t.length > 0);
            for (let term of terms) {
                // Remove custom banned terms case-insensitively
                let escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                let regex = new RegExp(escaped, 'gi');
                result = result.replace(regex, "");
            }
        }
        
        return result;
    };

    window.updateClearAllBtn = function () {
        let hasContent = ["role", "personality", "beliefs", "preferences", "appearance", "background", "lore", "roleplay"].some(s => getSectionText(s).length > 0);
        let btn = document.getElementById("clearAllBtn");
        if (btn) btn.style.opacity = hasContent ? "1" : "0.7";
    };
/* ==========================================================================
   TAB NAVIGATION AND MAIN WORKSPACE CONTROLLER
   ========================================================================== */
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
        let assistantTab = document.getElementById('assistantTabEl');
        if (generatorTab) generatorTab.style.display = 'none';
        if (settingsTab) settingsTab.style.display = 'none';
        if (roleplayTab) roleplayTab.style.display = 'none';
        if (worldTab) worldTab.style.display = 'none';
        if (assistantTab) assistantTab.style.display = 'none';
        
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
        } else if (tabName === 'assistant') {
            let activeItem = document.getElementById('sidebar-item-assistant');
            if (activeItem) activeItem.classList.add('active');
            if (assistantTab) assistantTab.style.display = 'flex';
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
        window.activeTab = tabName;
        let brainSidebar = document.getElementById('brainSidebarEl');
        if (brainSidebar && brainSidebar.style.transform === "translateX(0%)") {
            window.updateBrainContextOptions();
            window.updateBrainContextView();
        }
    };

    // ─── SIDEBAR TAB NAVIGATION ───
    window.switchSidebarTab = function (tabName) {
        window.sidebarActiveTab = tabName;
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
        
        if (typeof window.syncSidebarToggleButtons === 'function') {
            window.syncSidebarToggleButtons();
        }
    };
/* ==========================================================================
   PREMIUM CUSTOM CONFIRMATION MODALS
   ========================================================================== */
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
        if (typeof window.syncSidebarToggleButtons === 'function') {
            window.syncSidebarToggleButtons();
        }
    }, 500);
/* ==========================================================================
   REAL-TIME CONTEXT BRAIN VIEWER AND DEBUGGER
   ========================================================================== */
    window.toggleBrainDrawer = function() {
        let sidebar = document.getElementById("sidebarEl");
        let brainSidebar = document.getElementById("brainSidebarEl");
        if (!brainSidebar) return;
        
        if (sidebar && sidebar.style.transform === "translateX(0%)") {
            sidebar.style.transform = "translateX(100%)";
        }
        
        let isOpen = brainSidebar.style.transform === "translateX(0%)";
        brainSidebar.style.transform = isOpen ? "translateX(100%)" : "translateX(0%)";
        
        if (!isOpen) {
            window.updateBrainContextOptions();
            window.updateBrainContextView();
        }
        if (typeof window.syncSidebarToggleButtons === 'function') {
            window.syncSidebarToggleButtons();
        }
    };
    
    window.closeAllDrawers = function() {
        let sidebar = document.getElementById("sidebarEl");
        let brainSidebar = document.getElementById("brainSidebarEl");
        if (sidebar) sidebar.style.transform = "translateX(100%)";
        if (brainSidebar) brainSidebar.style.transform = "translateX(100%)";
        if (typeof window.syncSidebarToggleButtons === 'function') {
            window.syncSidebarToggleButtons();
        }
    };

    window.syncSidebarToggleButtons = function() {
        let sidebar = document.getElementById("sidebarEl");
        let brainSidebar = document.getElementById("brainSidebarEl");
        let sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
        let worldSidebarToggleBtn = document.getElementById("worldSidebarToggleBtn");
        let brainSidebarToggleBtn = document.getElementById("brainSidebarToggleBtn");
        
        if (!sidebar || !brainSidebar || !sidebarToggleBtn || !brainSidebarToggleBtn) return;
        
        let isSavedOpen = sidebar.style.transform === "translateX(0%)";
        let isBrainOpen = brainSidebar.style.transform === "translateX(0%)";
        let activeTab = window.sidebarActiveTab || 'characters';
        
        // Reset active classes
        sidebarToggleBtn.classList.remove('active');
        if (worldSidebarToggleBtn) worldSidebarToggleBtn.classList.remove('active');
        brainSidebarToggleBtn.classList.remove('active');
        
        if (isSavedOpen) {
            brainSidebarToggleBtn.style.opacity = "0";
            brainSidebarToggleBtn.style.pointerEvents = "none";
            
            sidebarToggleBtn.style.opacity = "1";
            sidebarToggleBtn.style.pointerEvents = "auto";
            if (worldSidebarToggleBtn) {
                worldSidebarToggleBtn.style.opacity = "1";
                worldSidebarToggleBtn.style.pointerEvents = "auto";
            }
            
            // Set active class based on open tab
            if (activeTab === 'characters') {
                sidebarToggleBtn.classList.add('active');
            } else {
                if (worldSidebarToggleBtn) worldSidebarToggleBtn.classList.add('active');
            }
        } else if (isBrainOpen) {
            sidebarToggleBtn.style.opacity = "0";
            sidebarToggleBtn.style.pointerEvents = "none";
            if (worldSidebarToggleBtn) {
                worldSidebarToggleBtn.style.opacity = "0";
                worldSidebarToggleBtn.style.pointerEvents = "none";
            }
            
            brainSidebarToggleBtn.style.opacity = "1";
            brainSidebarToggleBtn.style.pointerEvents = "auto";
            brainSidebarToggleBtn.classList.add('active');
        } else {
            sidebarToggleBtn.style.opacity = "1";
            sidebarToggleBtn.style.pointerEvents = "auto";
            if (worldSidebarToggleBtn) {
                worldSidebarToggleBtn.style.opacity = "1";
                worldSidebarToggleBtn.style.pointerEvents = "auto";
            }
            brainSidebarToggleBtn.style.opacity = "1";
            brainSidebarToggleBtn.style.pointerEvents = "auto";
        }
    };
    
    window.formatPromptForDisplay = function(text) {
        if (!text) return "";
        let escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        
        let formatted = escaped;
        
        // 1. Length Constraint Highlight
        formatted = formatted.replace(
            /(IMPORTANT Length Constraint: [^\n]+)/g,
            '<span style="display:inline-block; background:rgba(255,165,0,0.15); color:#ffd07b; padding:2px 6px; border-radius:4px; border:1px solid rgba(255,165,0,0.3); font-weight:600; margin: 2px 0;">$1</span>'
        );
        
        // 2. Section highlights
        const sectionsToHighlight = [
            { regex: /(Existing character context:)\n---\n([\s\S]*?)\n---/g, label: "Character Context", color: "#7ee787", bg: "rgba(40,167,69,0.08)" },
            { regex: /(World Lore:)\n([\s\S]*?)(?=\n\n|\n[A-Z]|$)/g, label: "World Lore", color: "#86edfb", bg: "rgba(23,162,184,0.08)" },
            { regex: /(General character overview: [^\n]+)/g, label: "Overview", color: "#79c0ff", bg: "rgba(0,123,255,0.08)" },
            { regex: /(Section-specific notes: [^\n]+)/g, label: "Section Notes", color: "#ffd07b", bg: "rgba(224,153,36,0.08)" },
            { regex: /(Format your response EXACTLY as follows:[\s\S]*?)(?=\n\n|\n[A-Z]|$)/g, label: "Format Instructions", color: "#d1b3ff", bg: "rgba(111,66,193,0.08)" },
            { regex: /(SCENARIO INSTRUCTIONS:[\s\S]*?)(?=\n\n|\n[A-Z]|$)/g, label: "Scenario Rules", color: "#86edfb", bg: "rgba(23,162,184,0.08)" },
            { regex: /(STRICT RULES:[\s\S]*?)(?=\n\n|\n[A-Z]|$)/g, label: "Strict Rules", color: "#ff7b72", bg: "rgba(220,53,69,0.12)" }
        ];
        
        sectionsToHighlight.forEach(sec => {
            formatted = formatted.replace(sec.regex, (match, header, content) => {
                let innerContent = content || "";
                return `<div style="background:${sec.bg}; border-left: 3px solid ${sec.color}; padding:6px 10px; margin: 8px 0; border-radius: 0 6px 6px 0; box-sizing:border-box;">` +
                       `<span style="color:${sec.color}; font-weight:bold; font-size:75%; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">${sec.label}</span>` +
                       (header.includes('\n') ? `<div style="font-size: 11px;">${innerContent}</div>` : `<div style="font-size: 11px;">${match}</div>`) +
                       `</div>`;
            });
        });
        
        return formatted;
    };

    window.setBrainViewMode = function(mode) {
        localStorage.brainViewMode = mode;
        const textarea = document.getElementById('brainContextTextarea');
        const formattedDiv = document.getElementById('brainContextFormatted');
        const rawBtn = document.getElementById('brainViewRawBtn');
        const formattedBtn = document.getElementById('brainViewFormattedBtn');
        
        if (mode === 'formatted') {
            if (textarea) textarea.style.display = 'none';
            if (formattedDiv) formattedDiv.style.display = 'block';
            if (rawBtn) {
                rawBtn.classList.remove('btn-primary');
                rawBtn.classList.add('btn-ghost');
            }
            if (formattedBtn) {
                formattedBtn.classList.remove('btn-ghost');
                formattedBtn.classList.add('btn-primary');
            }
        } else {
            if (textarea) textarea.style.display = 'block';
            if (formattedDiv) formattedDiv.style.display = 'none';
            if (rawBtn) {
                rawBtn.classList.remove('btn-ghost');
                rawBtn.classList.add('btn-primary');
            }
            if (formattedBtn) {
                formattedBtn.classList.remove('btn-primary');
                formattedBtn.classList.add('btn-ghost');
            }
        }
    };

    window.filterBrainContext = function() {
        const searchInput = document.getElementById('brainContextSearch');
        if (!searchInput) return;
        const query = searchInput.value.trim();
        
        // Refresh values first
        const textarea = document.getElementById('brainContextTextarea');
        const formattedDiv = document.getElementById('brainContextFormatted');
        const rawText = window.getCurrentAIContextPrompt ? window.getCurrentAIContextPrompt() : "";
        
        if (textarea) textarea.value = rawText;
        if (formattedDiv) formattedDiv.innerHTML = window.formatPromptForDisplay(rawText);
        
        if (!query) return;
        
        if (formattedDiv) {
            let html = formattedDiv.innerHTML;
            const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`(${escapedQuery})`, 'gi');
            
            let parts = html.split(/(<[^>]*>)/);
            for (let i = 0; i < parts.length; i++) {
                if (parts[i] && !parts[i].startsWith('<')) {
                    parts[i] = parts[i].replace(regex, '<mark style="background:#ffeb3b; color:#000; padding:1px 2px; border-radius:2px;">$1</mark>');
                }
            }
            formattedDiv.innerHTML = parts.join('');
        }
    };

    window.updateBrainContextView = function() {
        const textarea = document.getElementById('brainContextTextarea');
        const formattedDiv = document.getElementById('brainContextFormatted');
        if (!textarea) return;
        
        const rawText = window.getCurrentAIContextPrompt ? window.getCurrentAIContextPrompt() : "";
        
        // Update raw textarea
        textarea.value = rawText;
        
        // Update formatted view
        if (formattedDiv) {
            formattedDiv.innerHTML = window.formatPromptForDisplay(rawText);
        }
        
        // Highlight if there is an active search query
        const searchInput = document.getElementById('brainContextSearch');
        if (searchInput && searchInput.value.trim()) {
            window.filterBrainContext();
        }
        
        // Update stats
        const charCount = rawText.length;
        const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
        const tokenCount = Math.round(charCount / 3.8); // standard char-to-token approximation
        
        const charCountEl = document.getElementById('brainCharCount');
        const wordCountEl = document.getElementById('brainWordCount');
        const tokenCountEl = document.getElementById('brainTokenCount');
        
        if (charCountEl) charCountEl.textContent = charCount.toLocaleString();
        if (wordCountEl) wordCountEl.textContent = wordCount.toLocaleString();
        if (tokenCountEl) tokenCountEl.textContent = tokenCount.toLocaleString();
    };
    
    window.copyBrainContext = function() {
        const el = document.getElementById('brainContextTextarea');
        const btn = document.getElementById('copyBrainContextBtn');
        if (!el || !btn) return;
        navigator.clipboard.writeText(el.value);
        const oldHtml = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check2"></i> Copied!';
        btn.classList.replace('btn-secondary', 'btn-success');
        setTimeout(() => {
            btn.innerHTML = oldHtml;
            btn.classList.replace('btn-success', 'btn-secondary');
        }, 2000);
    };

    window.updateBrainContextOptions = function() {
        const select = document.getElementById('contextPromptSelect');
        if (!select) return;
        
        let tab = window.activeTab || 'characters';
        const prevValue = select.value;
        select.innerHTML = '';
        
        let options = [];
        if (tab === 'characters') {
            options = [
                { value: 'worldLore', text: 'World Lore Summary' },
                { value: 'worldLoreImage', text: 'World Lore Landscape Image Prompt' },
                { value: 'identityDetails', text: 'Core Identity Details' },
                { value: 'overview', text: 'General Overview / Concept' },
                { value: 'shortDescription', text: 'Short Description' },
                { value: 'appearance', text: 'Appearance & Attire' },
                { value: 'role', text: 'Role & Rules' },
                { value: 'personality', text: 'Personality & Behavior' },
                { value: 'beliefs', text: 'Mentality & Beliefs' },
                { value: 'preferences', text: 'Likes, Hates & Romance' },
                { value: 'abilities', text: 'Abilities & Skills' },
                { value: 'relations', text: 'Relations & Dynamic' },
                { value: 'background', text: 'Backstory & Goals' },
                { value: 'timeline', text: 'Timeline & History' },
                { value: 'plot', text: 'Plot & Story Hook' },
                { value: 'lore', text: 'Lore Keywords & Content JSON' },
                { value: 'roleplay', text: 'Dialogue Examples' },
                { value: 'introScenario', text: 'Starting Scene Context' },
                { value: 'introStart', text: 'First Message Start Script' },
                { value: 'chatCss', text: 'Chat bubble CSS Styling' },
                { value: 'chatLore', text: 'Chat Lorebook JSON' },
                { value: 'chatStyleGuide', text: 'Chat Writing Style Guide' },
                { value: 'imageCaption', text: 'Avatar Image Caption Prompt' },
                { value: 'backgroundImage', text: 'Scene Background Image Prompt' },
                { value: 'wikiImport', text: 'Wiki Importer Data Extractor' }
            ];
        } else if (tab === 'world') {
            options = [
                { value: 'worldOverview', text: 'World Overview' },
                { value: 'worldRules', text: 'Rules of the World' },
                { value: 'worldRaces', text: 'Races residing in World' },
                { value: 'worldRegions', text: 'Regions of the World' },
                { value: 'worldFactions', text: 'Major Factions' },
                { value: 'worldBestiary', text: 'Bestiary & Animals' },
                { value: 'worldCharacters', text: 'Important Characters' },
                { value: 'bannerImage', text: 'World Banner Image Prompt' },
                { value: 'wikiImportWorld', text: 'Wiki Importer Data Extractor' }
            ];
        } else if (tab === 'roleplay') {
            options = [
                { value: 'rpWorldLore', text: 'World Setting & Lore' },
                { value: 'rpPrompt', text: 'Roleplay Guidance Prompt' },
                { value: 'npcGeneration', text: 'NPC Main Cast Generation' },
                { value: 'npcBackgroundGeneration', text: 'NPC Background Cast Generation' },
                { value: 'timeline', text: 'Timeline & History' },
                { value: 'plot', text: 'Plot & Story Hook' },
                { value: 'lore', text: 'Lore Keywords & Content JSON' },
                { value: 'roleplay', text: 'Dialogue Examples' },
                { value: 'introScenario', text: 'Starting Scene Context' },
                { value: 'introStart', text: 'First Message Start Script' },
                { value: 'scenarioNotes', text: 'Conflict / Plot Hook' },
                { value: 'roleplayScenario', text: 'Full Scenario Sheet & Starter' },
                { value: 'wikiImportRP', text: 'Wiki Importer Data Extractor' }
            ];
        } else if (tab === 'assistant') {
            options = [
                { value: 'assessIntention', text: 'User Request Routing (Intention)' },
                { value: 'methodology', text: 'Fulfillment Methodology Steps' },
                { value: 'finalOutputThinking', text: 'Response (With Thinking)' },
                { value: 'finalOutputNoThinking', text: 'Response (Without Thinking)' },
                { value: 'imagePrompt', text: 'Image Prompt Generator' }
            ];
        } else {
            options = [
                { value: 'none', text: 'No prompts in this tab' }
            ];
        }
        
        options.forEach(opt => {
            let el = document.createElement('option');
            el.value = opt.value;
            el.textContent = opt.text;
            select.appendChild(el);
        });
        
        if (Array.from(select.options).some(o => o.value === prevValue)) {
            select.value = prevValue;
        }
    };

    window.getCurrentAIContextPrompt = function() {
        let select = document.getElementById('contextPromptSelect');
        if (!select) return "";
        let val = select.value;
        let tab = window.activeTab || 'characters';
        
        const getTonesStr = () => {
            if (typeof window.getSelectedTones === 'function') {
                return window.getSelectedTones().join(", ");
            }
            return "unspecified";
        };

        const getSettingVal = () => {
            return document.getElementById("settingEl")?.value || "unspecified";
        };

        const getNotesVal = () => {
            return document.getElementById("loreNotesEl")?.value || "";
        };

        const getWNameVal = () => {
            return document.getElementById("worldNameEl")?.value || "";
        };
        
        try {
            if (tab === 'characters') {
                if (val === 'worldLore') {
                    return root.prompts.characterPage.worldLore.compile(
                        getSettingVal(),
                        getTonesStr(),
                        getNotesVal(),
                        getWNameVal(),
                        true
                    );
                }
                if (val === 'worldLoreImage') {
                    let lore = window.getSectionText ? window.getSectionText("lore") : "";
                    return root.prompts.characterPage.worldLoreImage.compile(lore);
                }
                if (val === 'identityDetails') {
                    let existing = window.buildCharacterContext ? window.buildCharacterContext() : "";
                    let lore = window.getSectionText ? window.getSectionText("lore") : "";
                    
                    let allSectionNotes = ["shortDescription", "role", "personality", "beliefs", "preferences", "abilities", "relations", "appearance", "background", "timeline"]
                        .map(s => (document.getElementById(s + "NotesEl") || {}).value || "")
                        .filter(Boolean)
                        .join("\n");
                    
                    let setTone = window.getSettingAndToneContext ? window.getSettingAndToneContext() : "";
                    return root.prompts.characterPage.identityDetails.compile(
                        existing,
                        lore,
                        allSectionNotes,
                        setTone,
                        "name, age, gender, orientation, species, ethnicity"
                    );
                }
                if (val === 'overview') {
                    let lore = window.getSectionText ? window.getSectionText("lore") : "";
                    let detailsStr = "";
                    if (typeof window.getDetailsContext === 'function') {
                        let details = window.getDetailsContext();
                        let detailsParts = [];
                        if (details.name) detailsParts.push(`Name: ${details.name}`);
                        if (details.age) detailsParts.push(`Age: ${details.age}`);
                        if (details.gender) detailsParts.push(`Gender: ${details.gender}`);
                        if (details.orientation) detailsParts.push(`Orientation: ${details.orientation}`);
                        if (details.species) detailsParts.push(`Species/Race: ${details.species}`);
                        if (details.ethnicity) detailsParts.push(`Ethnicity: ${details.ethnicity}`);
                        detailsStr = `Character Details (you MUST strictly base the concept on these fields):\n${detailsParts.join("\n")}`;
                    }
                    return root.prompts.characterPage.overview.compile(
                        getSettingVal(),
                        getTonesStr(),
                        lore,
                        detailsStr
                    );
                }
                if (val === 'imageCaption') {
                    let appText = window.getSectionText ? window.getSectionText("appearance") : "";
                    return root.prompts.characterPage.imageCaption.compile(
                        getSettingVal(),
                        getTonesStr(),
                        appText
                    );
                }
                if (val === 'backgroundImage') {
                    let scenario = window.getSectionText ? window.getSectionText("introScenario") : "A scenic background";
                    return root.prompts.characterPage.backgroundImage.compile(scenario);
                }
                if (val === 'wikiImport') {
                    let wikiOverride = document.getElementById("wikiOverrideEl")?.value || "";
                    return root.prompts.characterPage.wikiImport.compile("Source Text Here", wikiOverride);
                }
                if (val === 'chatCss') {
                    let generated = window.getSectionText ? window.getSectionText("appearance") : "";
                    return root.prompts.characterPage.chatCss.compile(generated, getSettingVal(), getTonesStr());
                }
                if (val === 'chatLore') {
                    return root.prompts.characterPage.chatLore.compile();
                }
                if (val === 'chatStyleGuide') {
                    return root.prompts.characterPage.chatStyleGuide.compile();
                }
                
                const sections = ["shortDescription", "appearance", "role", "personality", "beliefs", "preferences", "abilities", "relations", "background", "timeline", "plot", "lore", "roleplay", "introScenario", "introStart"];
                if (sections.includes(val)) {
                    let context = window.buildCharacterContext ? window.buildCharacterContext(val) : "";
                    let notes = (document.getElementById(val + "NotesEl") || {}).value || "";
                    let lengthVal = window.getEffectiveLengthForSection ? window.getEffectiveLengthForSection(val) : "medium";
                    let overview = (document.getElementById("overviewNotesEl") || {}).value || "";
                    let worldLore = (document.getElementById("worldLoreEl") || {}).value || "";
                    
                    if (val === "plot" && window.buildPlotPrompt) {
                        return window.buildPlotPrompt(context, notes, lengthVal, overview, worldLore);
                    }
                    if (val === "roleplay" && window.buildRoleplayExamplePrompt) {
                        return window.buildRoleplayExamplePrompt(context, notes, lengthVal, overview, worldLore);
                    }
                    if (val === "introScenario" && window.buildIntroScenarioPrompt) {
                        return window.buildIntroScenarioPrompt(context, notes, lengthVal, overview, worldLore);
                    }
                    if (val === "introStart" && window.buildIntroStartPrompt) {
                        return window.buildIntroStartPrompt(context, notes, lengthVal, overview, worldLore);
                    }
                    return root.prompts.compile(val, context, notes, lengthVal, overview, worldLore);
                }
            }
            
            if (tab === 'world' && window.worldState) {
                if (val.startsWith('world')) {
                    let section = val.replace('world', '');
                    section = section.charAt(0).toLowerCase() + section.slice(1);
                    
                    let wName = window.worldState.name || "Unnamed";
                    let wSetting = window.worldState.setting || "Any";
                    let wTones = window.worldState.tones ? window.worldState.tones.join(", ") : "";
                    let wThemes = window.worldState.themes || "";
                    let notesEl = document.getElementById(`w-${section}NotesEl`);
                    let sectionNotes = notesEl ? notesEl.value : (window.worldState.sectionNotes?.[section] || "");
                    let lenEl = document.getElementById("wLengthEl") || document.getElementById(`w-${section}LengthEl`);
                    let lenVal = lenEl ? lenEl.value : (window.worldState.activeLength || "medium");
                    let lengthInstruction = window.getLengthInstruction ? window.getLengthInstruction(lenVal) : "";
                    
                    let existingContext = window.buildWorldContext ? window.buildWorldContext(section) : "";
                    return root.prompts.worldPage.sectionGeneration.compile(
                        section,
                        wName,
                        wSetting,
                        wTones,
                        wThemes,
                        sectionNotes,
                        lengthInstruction,
                        existingContext
                    );
                }
                if (val === 'bannerImage') {
                    let wName = window.worldState.name || "Unnamed";
                    let wSetting = window.worldState.setting;
                    let wTones = window.worldState.tones ? window.worldState.tones.join(", ") : "";
                    let overviewText = window.worldState.sections.overview || window.worldState.themes || "";
                    return root.prompts.worldPage.bannerImage.compile(wName, wSetting, wTones, overviewText);
                }
                if (val === 'wikiImportWorld') {
                    let override = document.getElementById("wWikiOverrideEl")?.value || "";
                    return root.prompts.worldPage.wikiImport.compile("Source Text Here", override);
                }
            }
            
            if (tab === 'roleplay' && window.roleplayState) {
                if (val === 'rpWorldLore') {
                    let name = window.roleplayState.worldName || "Unnamed World";
                    let setting = document.getElementById("rpSettingEl")?.value || "Any";
                    let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
                    let notes = document.getElementById("rpWorldLoreNotesEl")?.value || "";
                    return root.prompts.roleplayPage.worldLore.compile(name, setting, tonesStr, notes);
                }
                if (val === 'rpPrompt') {
                    return window.roleplayState.roleplayPrompt || document.getElementById("rpPromptTextEl")?.value || "No custom roleplay guidance prompt set.";
                }
                if (val === 'npcGeneration') {
                    let worldName = window.roleplayState.worldName || "Unnamed World";
                    let worldLore = window.roleplayState.worldLore || (document.getElementById("rpWorldOutputEl") || {}).innerText || "";
                    let setting = document.getElementById("rpSettingEl")?.value || "Any";
                    let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
                    let themes = window.roleplayState.themes || "";
                    let existingNpcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map((n, idx) => {
                        if (!n.name || !n.name.trim()) return "";
                        return `- Name: ${n.name}, Role: ${n.role}, Personality: ${n.personality}`;
                    }).filter(Boolean).join("\n") : "";
                    let dynamics = window.roleplayState.rpDynamics ? window.roleplayState.rpDynamics.join(", ") : "Any";
                    let userName = window.roleplayState.userName || "the Player";
                    let userRole = window.roleplayState.userRole || "a protagonist";
                    return root.prompts.roleplayPage.npcGeneration.compile(worldName, worldLore, setting, tonesStr, themes, existingNpcsText, dynamics, userName, userRole);
                }
                if (val === 'npcBackgroundGeneration') {
                    let worldName = window.roleplayState.worldName || "Unnamed World";
                    let worldLore = window.roleplayState.worldLore || (document.getElementById("rpWorldOutputEl") || {}).innerText || "";
                    let setting = document.getElementById("rpSettingEl")?.value || "Any";
                    let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
                    let themes = window.roleplayState.themes || "";
                    let existingNpcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map(n => n.name).filter(Boolean).join(", ") : "";
                    let notes = document.getElementById("rpBackgroundCastNotesEl")?.value || "";
                    return root.prompts.roleplayPage.npcBackgroundGeneration.compile(worldName, worldLore, setting, tonesStr, themes, existingNpcsText, notes);
                }
                if (val === 'scenarioNotes') {
                    let worldName = window.roleplayState.worldName || "Unnamed World";
                    let worldLore = window.roleplayState.worldLore || "";
                    let npcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map(n => n.name).filter(Boolean).join(", ") : "";
                    let userRole = window.roleplayState.userRole || "Player";
                    return root.prompts.roleplayPage.scenarioNotes.compile(worldName, worldLore, npcsText, userRole);
                }
                if (val === 'roleplayScenario') {
                    let worldName = window.roleplayState.worldName || "Unnamed World";
                    let worldLore = window.roleplayState.worldLore || "";
                    let setting = document.getElementById("rpSettingEl")?.value || "Any";
                    let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
                    let themes = window.roleplayState.themes || "";
                    let pName = window.roleplayState.userName || "Player";
                    let pRole = window.roleplayState.userRole || "";
                    let npcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map(n => {
                        return `Name: ${n.name}\nSpecies/Race: ${n.species}\nPersonality: ${n.personality}\nRole in Scenario: ${n.role}`;
                    }).join("\n\n") : "";
                    let scenarioNotes = window.roleplayState.scenarioNotes || "";
                    let lengthVal = document.getElementById("rpLengthEl")?.value || "medium";
                    let lengthInstruction = window.getLengthInstruction ? window.getLengthInstruction(lengthVal, 'starter') : "";
                    return root.prompts.roleplayPage.roleplayScenario.compile(
                        worldName,
                        worldLore,
                        setting,
                        tonesStr,
                        themes,
                        pName,
                        pRole,
                        npcsText,
                        scenarioNotes,
                        lengthInstruction
                    );
                }
                if (val === 'wikiImportRP') {
                    let override = document.getElementById("rpWikiOverrideEl")?.value || "";
                    return root.prompts.roleplayPage.wikiImport.compile("Source Text Here", override);
                }

                const copiedSections = ["timeline", "plot", "lore", "roleplay", "introScenario", "introStart"];
                if (copiedSections.includes(val)) {
                    let notes = "";
                    if (val === "introScenario" || val === "introStart") {
                        notes = (document.getElementById("rpTab-introNotesEl") || {}).value || "";
                    } else {
                        notes = (document.getElementById("rpTab-" + val + "NotesEl") || {}).value || "";
                    }
                    
                    let lengthVal = "medium";
                    if (val !== "introScenario" && val !== "introStart") {
                        lengthVal = (document.getElementById("rpTab-" + val + "LengthEl") || {}).value || "medium";
                    }
                    let globalVal = localStorage.globalLength || 'custom';
                    if (globalVal && globalVal !== 'custom') lengthVal = globalVal;
                    
                    let worldName = window.roleplayState?.worldName || "";
                    let worldLore = window.roleplayState?.worldLore || (document.getElementById("rpWorldOutputEl") || {}).innerText || (document.getElementById("worldLoreEl") || {}).value || "";
                    
                    if (val === "timeline" && window.buildRPSessionTimelinePrompt) {
                        return window.buildRPSessionTimelinePrompt(notes, lengthVal, worldName, worldLore);
                    }
                    if (val === "plot" && window.buildRPSessionPlotPrompt) {
                        return window.buildRPSessionPlotPrompt(notes, lengthVal, worldName, worldLore);
                    }
                    if (val === "lore" && window.buildRPSessionLorePrompt) {
                        return window.buildRPSessionLorePrompt(notes, worldName, worldLore);
                    }
                    if (val === "roleplay" && window.buildRPSessionExamplePrompt) {
                        return window.buildRPSessionExamplePrompt(notes, lengthVal, worldName, worldLore);
                    }
                    if (val === "introScenario" && window.buildRPSessionIntroScenarioPrompt) {
                        return window.buildRPSessionIntroScenarioPrompt(notes, lengthVal, worldName, worldLore);
                    }
                    if (val === "introStart" && window.buildRPSessionIntroStartPrompt) {
                        let scenarioContext = (document.getElementById("rpTab-introScenarioOutputEl") || {}).innerText || "";
                        return window.buildRPSessionIntroStartPrompt(notes, lengthVal, worldName, worldLore, scenarioContext);
                    }
                    return "Compiler not ready.";
                }
            }
            
            if (tab === 'assistant') {
                let text = document.getElementById("assistantChatInput")?.value || "User Request Here";
                let context = window.getAssistantContext ? window.getAssistantContext() : "";
                let personality = root.assistantPersonality;
                
                if (val === 'assessIntention') {
                    return root.prompts.assistantPage.assessIntention.compile(text);
                }
                if (val === 'methodology') {
                    return root.prompts.assistantPage.methodology.compile(personality, context, text);
                }
                if (val === 'finalOutputThinking') {
                    return root.prompts.assistantPage.finalOutputThinking.compile(personality, context, "Steps here...", text);
                }
                if (val === 'finalOutputNoThinking') {
                    return root.prompts.assistantPage.finalOutputNoThinking.compile(personality, context, text);
                }
                if (val === 'imagePrompt') {
                    return root.prompts.assistantPage.imagePrompt.compile(context, text);
                }
            }
        } catch (e) {
            return "Error compiling prompt:\n" + e.message;
        }
        
        return "No prompt context available.";
    };

    // Real-time updates when inputs or settings change
    document.addEventListener('input', function(e) {
        let brainSidebar = document.getElementById('brainSidebarEl');
        if (brainSidebar && brainSidebar.style.transform === "translateX(0%)") {
            window.updateBrainContextView();
        }

        // Bidirectional input synchronization between Characters tab and Roleplay tab
        if (e && e.target && e.target.id) {
            let id = e.target.id;
            let isRoleplayCopiedInput = id.startsWith("rpTab-") || document.getElementById("rpTab-" + id);
            if (isRoleplayCopiedInput) return;

            let counterpartId = null;
            if (id === "rpThemesEl") {
                counterpartId = "wThemesEl";
            } else if (id === "wThemesEl") {
                counterpartId = "rpThemesEl";
            } else if (id.startsWith("rpTab-")) {
                counterpartId = id.replace("rpTab-", "");
            } else {
                counterpartId = "rpTab-" + id;
            }
            let counterpart = counterpartId ? document.getElementById(counterpartId) : null;
            if (counterpart) {
                if (counterpart.value !== e.target.value) {
                    counterpart.value = e.target.value;
                    counterpart.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }
    });
    
    document.addEventListener('change', function(e) {
        let brainSidebar = document.getElementById('brainSidebarEl');
        if (brainSidebar && brainSidebar.style.transform === "translateX(0%)") {
            window.updateBrainContextView();
        }

        // Bidirectional change synchronization between Characters tab and Roleplay tab
        if (e && e.target && e.target.id) {
            let id = e.target.id;
            let isRoleplayCopiedInput = id.startsWith("rpTab-") || document.getElementById("rpTab-" + id);
            if (isRoleplayCopiedInput) return;

            let counterpartId = null;
            if (id === "rpThemesEl") {
                counterpartId = "wThemesEl";
            } else if (id === "wThemesEl") {
                counterpartId = "rpThemesEl";
            } else if (id.startsWith("rpTab-")) {
                counterpartId = id.replace("rpTab-", "");
            } else {
                counterpartId = "rpTab-" + id;
            }
            let counterpart = counterpartId ? document.getElementById(counterpartId) : null;
            if (counterpart) {
                if (counterpart.value !== e.target.value) {
                    counterpart.value = e.target.value;
                    counterpart.dispatchEvent(new Event('change', { bubbles: true }));
                    // For custom select dropdowns, update label
                    if (counterpart.classList.contains('custom-select-hidden')) {
                        window.syncCustomSelectLabel(counterpart);
                    }
                }
            }
        }
    });

    // Initialize view mode on load
    setTimeout(() => {
        let savedMode = localStorage.brainViewMode || 'raw';
        if (window.setBrainViewMode) {
            window.setBrainViewMode(savedMode);
        }
    }, 100);
