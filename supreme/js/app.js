    // ─── PERCHANCE CONTEXT STANDALONE MOCK ────────────────────────────────
    // This allows the HTML file to run and be tested standalone in a local browser,
    // while seamlessly using the live Perchance engine bindings when compiled online.
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
            prompts: {
                compile: function(sectionName, context, notes, lengthVal, overview, worldLore) {
                    let p = this[sectionName];
                    if (!p) return "";
                    let parts = [p.instruction ? p.instruction.evaluateItem : ""];
                    let lenInstr = window.getLengthInstruction ? window.getLengthInstruction(lengthVal) : "";
                    if (lenInstr) parts.push(lenInstr);
                    parts.push(p.format ? p.format.evaluateItem : "");
                    if (p.notes && p.notes.evaluateItem) parts.push(p.notes.evaluateItem);
                    if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
                    if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
                    if (overview) parts.push("\nGeneral character overview: " + overview);
                    if (notes) parts.push("\nSection-specific notes: " + notes);
                    let refCtx = window.getReferencedCharactersContext ? window.getReferencedCharactersContext() : "";
                    if (refCtx) parts.push("\n" + refCtx);
                    let setTone = window.getSettingAndToneContext ? window.getSettingAndToneContext() : "";
                    if (setTone) parts.push("\n" + setTone);
                    if (p.footer && p.footer.evaluateItem) parts.push(p.footer.evaluateItem);
                    if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                    return parts.join("\n\n");
                },
                role: { instruction: { evaluateItem: "You are writing the ROLE and RULES section." }, format: { evaluateItem: "Format: Role: ... Rules: ..." } },
                appearance: { instruction: { evaluateItem: "You are writing the APPEARANCE, ATTIRE, and ITEMS section." }, format: { evaluateItem: "Format: Appearance: ... Attire: ..." }, notes: { evaluateItem: "Be specific and visual." } },
                background: { instruction: { evaluateItem: "You are writing the BACKSTORY, OCCUPATION, RESIDENCE, SECRETS, SHORT-TERM GOALS, LONG-TERM GOALS, and SKILLS section." }, format: { evaluateItem: "Format: Backstory: ... Occupation: ..." } },
                personality: { instruction: { evaluateItem: "You are writing the PERSONALITY, SPEECH, BEHAVIOR, EMOTIONS, and INTERNAL CONFLICTS section." }, format: { evaluateItem: "Format: Personality: ... Speech: ..." } },
                beliefs: { instruction: { evaluateItem: "You are writing the MENTALITY, WORLD VIEW, BELIEFS, and MORALS section." }, format: { evaluateItem: "Format: Mentality: ... World View: ..." } },
                preferences: { instruction: { evaluateItem: "You are writing the LIKES, HATES, HOBBIES, VALUES, and ROMANCE section." }, format: { evaluateItem: "Format: Likes: ... Hates: ..." } },
                abilities: { instruction: { evaluateItem: "You are writing the ABILITIES section." }, format: { evaluateItem: "Format: - Ability: ..." } },
                relations: { instruction: { evaluateItem: "You are writing the RELATIONS section." }, format: { evaluateItem: "Format: - user: ..." } },
                timeline: { instruction: { evaluateItem: "You are writing the TIMELINE section." }, format: { evaluateItem: "Format: - Age: ..." } },
                lore: {
                    instruction: { evaluateItem: "You are writing the LORE KEYWORDS and LORE CONTENT section for a character profile." },
                    format: { evaluateItem: "You MUST generate a strict JSON object containing between 4 and 5 lore entries." },
                    notes: { evaluateItem: "LORE Note..." },
                    footer: { evaluateItem: "Output ONLY the raw JSON object." }
                },
                roleplay: { instruction: { evaluateItem: "You are writing the ROLEPLAY EXAMPLES section." }, format: { evaluateItem: "Format: <user>: ... CharacterName: ..." } },
                introScenario: { instruction: { evaluateItem: "You are writing the SCENE CONTEXT / SCENARIO CONTEXT section." }, format: { evaluateItem: "Format: Scene Context: ..." }, notes: { evaluateItem: "Focusing on Physical Reactions." } },
                introStart: { instruction: { evaluateItem: "You are writing the ROLEPLAY START (Dialogue & Narration) section." }, format: { evaluateItem: "Format: Intro Script: ..." }, notes: { evaluateItem: "Focusing on Physical Reactions." } },
                characterPage: {
                    worldLore: {
                        compile: function(settingValue, toneStr, userNotes, existingWorldName, needsName) {
                            return "You are writing a concise, factual \"World Lore\" summary.\nSetting: " + settingValue + "\nTones: " + toneStr;
                        }
                    },
                    worldLoreImage: {
                        compile: function(text) { return "Extract environment visual keyphrases from:\n" + text; }
                    },
                    identityDetails: {
                        compile: function(existingContext, worldLoreVal, allUserNotes, settingAndTone, blankFields) {
                            return "Fill missing identity fields: " + blankFields;
                        }
                    },
                    overview: {
                        compile: function(settingValue, toneStr, worldLoreVal, detailsStr) {
                            return "Generate one single character concept paragraph.\nSetting: " + settingValue;
                        }
                    },
                    imageCaption: {
                        compile: function(settingValue, toneStr, appearanceText) {
                            return "Extract purely VISUAL elements from:\n" + appearanceText;
                        }
                    },
                    backgroundImage: {
                        compile: function(scenario) { return "Extract background environment from:\n" + scenario; }
                    },
                    wikiImport: {
                        compile: function(content, wikiOverride) { return "Extract character info from text."; }
                    },
                    chatCss: {
                        compile: function(generatedText, settingValue, toneValues) { return "Generate bubble CSS."; }
                    },
                    chatLore: {
                        compile: function() { return "Prepare for AI chat system."; }
                    },
                    chatStyleGuide: {
                        compile: function() { return "Write concise style guide."; }
                    }
                },
                worldPage: {
                    sectionGeneration: {
                        compile: function(section, wName, wSetting, wTones, wThemes, sectionNotes, lengthInstruction) {
                            return "Expert world-builder writing " + section + ".\nWorld Name: " + wName;
                        }
                    },
                    bannerImage: {
                        compile: function(wName, wSetting, wTones, overviewText) {
                            return "Extract environment visual keyphrases for " + wName;
                        }
                    },
                    wikiImport: {
                        compile: function(content, override) { return "Extract world-building details."; }
                    }
                },
                roleplayPage: {
                    wikiImport: {
                        compile: function(content, override) { return "Extract roleplay details."; }
                    },
                    worldLore: {
                        compile: function(name, setting, tonesStr) { return "Write concise world overview."; }
                    },
                    npcGeneration: {
                        compile: function(worldName, worldLore, setting) { return "Generate single NPC profile."; }
                    },
                    scenarioNotes: {
                        compile: function(worldName, worldLore, npcsText, userRole) { return "Generate creative plot hook."; }
                    },
                    roleplayScenario: {
                        compile: function(worldName, worldLore, setting, tonesStr, themes, pName, pRole, npcsText, scenarioNotes, lengthInstruction) {
                            return "Create roleplay scenario sheet.\nWorld Name: " + worldName;
                        }
                    }
                },
                characterSheetPage: {
                    sheetGeneration: {
                        compile: function(charData) { return "Return structured JSON character sheet dashboard."; }
                    }
                },
                assistantPage: {
                    assessIntention: {
                        compile: function(text) { return "Assess intent for " + text; }
                    },
                    methodology: {
                        compile: function(assistantPersonality, context, text) { return "Generate methodology."; }
                    },
                    finalOutputThinking: {
                        compile: function(assistantPersonality, context, methodology, text) { return "Fulfill request based on methodology."; }
                    },
                    finalOutputNoThinking: {
                        compile: function(assistantPersonality, context, text) { return "Fulfill request."; }
                    },
                    imagePrompt: {
                        compile: function(context, text) { return "Write image prompt."; }
                    }
                }
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
                "short": { evaluateItem: "2-3 lines each" },
                "medium": { evaluateItem: "4-5 lines each" },
                "long": { evaluateItem: "6-7 lines each" },
                "super-long": { evaluateItem: "8+ lines each" }
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
    }

    // ─── PERCHANCE CONTEXT ──────────────────────────────────────────────
    // Note for AI Models: Most core variables (ai, image, root, etc.) are 
    // defined in 'SCD_LIST.txt' (the Perchance "Lists" panel). 
    // Perchance automatically injects these into the global scope. 
    // Do not re-declare them here unless local overrides are needed.

    // ─── PANEL COLLAPSE ───────────────────────────────────────────────
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

    // ─── CUSTOM DROPDOWNS (SETTING & TONE) ──────────────────────────────
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
                if (menuId === "settingDropdownMenu") sortDropdownList("settingOptionsList");
                else if (menuId === "wSettingDropdownMenu") sortDropdownList("wSettingOptionsList");
                else if (menuId === "rpSettingDropdownMenu") sortDropdownList("rpSettingOptionsList");
                else if (menuId === "toneDropdownMenu") sortDropdownList("toneOptionsList");
                else if (menuId === "wToneDropdownMenu") sortDropdownList("wToneOptionsList");
                else if (menuId === "rpToneDropdownMenu") sortDropdownList("rpToneOptionsList");
                else if (menuId === "archetypeDropdownMenu") sortDropdownList("archetypeOptionsList");
                else if (menuId === "dynamicDropdownMenu") sortDropdownList("dynamicOptionsList");
            } else {
                menu.style.display = "none";
                if (dropdown) dropdown.classList.remove("open");
            }
            // Focus search input if opening setting/tone/archetype dropdown
            if (menu.style.display === "block") {
                let search = menu.querySelector(".dropdown-search-input");
                if (search) {
                    search.value = "";
                    if (menuId === "settingDropdownMenu") filterSettings("");
                    else if (menuId === "wSettingDropdownMenu" && typeof filterWorldSettings === "function") filterWorldSettings("");
                    else if (menuId === "rpSettingDropdownMenu" && typeof filterRoleplaySettings === "function") filterRoleplaySettings("");
                    else if (menuId === "toneDropdownMenu" && typeof filterTones === "function") filterTones("");
                    else if (menuId === "wToneDropdownMenu" && typeof filterWorldTones === "function") filterWorldTones("");
                    else if (menuId === "rpToneDropdownMenu" && typeof filterRoleplayTones === "function") filterRoleplayTones("");
                    else if (menuId === "archetypeDropdownMenu" && typeof filterArchetypes === "function") filterArchetypes("");
                    else if (menuId === "dynamicDropdownMenu" && typeof filterDynamics === "function") filterDynamics("");
                    
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

    var SETTING_KEYS = [
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

    var TONE_KEYS = [
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

    var ARCHETYPE_KEYS = [
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

    var DYNAMIC_KEYS = [
        "Any", "Enemies_To_Lovers", "Forbidden_Love", "Mentor_Student", "Hunter_And_Prey",
        "Mutual_Obsession", "Forced_Cohabitation", "Fake_Relationship", "Protector_And_Protected",
        "Rivals_With_Tension", "Betrayal_Reconciliation", "Toxic_Codependency", "Worship_And_Disgust",
        "Captor_And_Captive", "Cat_And_Mouse", "Sun_And_Moon", "Brain_And_Brawn", "Beauty_And_Beast",
        "Master_And_Servant", "Creator_And_Creation"
    ];


    window.initCustomSettingDropdown = function () {
        let listEl = document.getElementById("settingOptionsList");
        if (!listEl) return;
        
        let keys = [];
        const isPerchance = window.location.hostname.includes("perchance.org");
        if (isPerchance && typeof window.root !== "undefined" && window.root.settingPrompts) {
            keys = window.getPerchanceListKeys(window.root.settingPrompts);
        }
        if (!keys || keys.length === 0) {
            keys = SETTING_KEYS;
        }
        if (!keys.includes("Any")) {
            keys.unshift("Any");
        }
        
        listEl.innerHTML = keys.map(k => {
            let label = window.getDropdownDisplayLabel(k);
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

    // Archetype Dropdown functions
    window.getSelectedArchetypes = function () {
        let checked = [...document.querySelectorAll(".archetypeCheckbox:checked")].map(c => c.value);
        return checked.length > 0 ? checked : ["Any"];
    };

    window.handleArchetypeChange = function () {
        let checked = [...document.querySelectorAll(".archetypeCheckbox:checked")];
        let anyBox = document.getElementById("archetypeAnyCheckbox");
        if (checked.length > 0 && anyBox) anyBox.checked = false;
        updateArchetypeLabel();
        saveArchetypes();
    };

    window.handleArchetypeAnyToggle = function (checkbox) {
        if (checkbox.checked) {
            document.querySelectorAll(".archetypeCheckbox").forEach(c => c.checked = false);
        }
        updateArchetypeLabel();
        saveArchetypes();
    };

    window.updateArchetypeLabel = function () {
        let archs = getSelectedArchetypes();
        let label = document.getElementById("archetypeDropdownLabel");
        if (label) {
            if (archs[0] === "Any") label.textContent = "Any";
            else if (archs.length === 1) label.textContent = archs[0].replace(/_/g, " ");
            else label.textContent = archs[0].replace(/_/g, " ") + " +" + (archs.length - 1);
        }
    };

    window.saveArchetypes = function () {
        localStorage.archetypes = JSON.stringify(getSelectedArchetypes());
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.loadArchetypes = function () {
        try {
            let saved = JSON.parse(localStorage.archetypes || '["Any"]');
            let anyBox = document.getElementById("archetypeAnyCheckbox");
            if (!saved || saved.length === 0 || saved[0] === "Any") {
                if (anyBox) anyBox.checked = true;
            } else {
                if (anyBox) anyBox.checked = false;
                saved.forEach(t => {
                    let box = document.querySelector(`.archetypeCheckbox[value="${t}"]`);
                    if (box) box.checked = true;
                });
            }
            updateArchetypeLabel();
        } catch (e) {
            let anyBox = document.getElementById("archetypeAnyCheckbox");
            if (anyBox) anyBox.checked = true;
            updateArchetypeLabel();
        }
    };

    window.initCustomToneDropdown = function () {
        let listEl = document.getElementById("toneOptionsList");
        if (!listEl) return;
        
        let keys = [];
        const isPerchance = window.location.hostname.includes("perchance.org");
        if (isPerchance && typeof window.root !== "undefined" && window.root.tonePrompts) {
            keys = window.getPerchanceListKeys(window.root.tonePrompts);
        }
        if (!keys || keys.length === 0) {
            keys = TONE_KEYS;
        }
        
        keys = keys.filter(k => k !== "Any");
        
        let html = `
            <label class="dropdown-option-item-checkbox">
                <input type="checkbox" id="toneAnyCheckbox" value="Any"
                    onchange="handleToneAnyToggle(this)"
                    style="accent-color:var(--accent-color);">
                <span>Any</span>
            </label>
            <hr style="margin:0.25rem 0; border-color:var(--panel-border);">
        `;
        
        html += keys.map(k => {
            let label = window.getDropdownDisplayLabel(k);
            return `
                <label class="dropdown-option-item-checkbox">
                    <input type="checkbox" class="toneCheckbox" value="${k}"
                        onchange="handleToneChange()" style="accent-color:var(--accent-color);">
                    <span>${label}</span>
                </label>
            `;
        }).join("");
        
        listEl.innerHTML = html;
    };

    window.initCustomArchetypeDropdown = function () {
        let listEl = document.getElementById("archetypeOptionsList");
        if (!listEl) return;
        
        let keys = [];
        const isPerchance = window.location.hostname.includes("perchance.org");
        if (isPerchance && typeof window.root !== "undefined" && window.root.archetypePrompts) {
            keys = window.getPerchanceListKeys(window.root.archetypePrompts);
        }
        if (!keys || keys.length === 0) {
            keys = ARCHETYPE_KEYS;
        }
        
        keys = keys.filter(k => k !== "Any");
        
        let html = `
            <label class="dropdown-option-item-checkbox">
                <input type="checkbox" id="archetypeAnyCheckbox" value="Any"
                    onchange="handleArchetypeAnyToggle(this)"
                    style="accent-color:var(--accent-color);">
                <span>Any</span>
            </label>
            <hr style="margin:0.25rem 0; border-color:var(--panel-border);">
        `;
        
        html += keys.map(k => {
            let label = window.getDropdownDisplayLabel(k);
            return `
                <label class="dropdown-option-item-checkbox">
                    <input type="checkbox" class="archetypeCheckbox" value="${k}"
                        onchange="handleArchetypeChange()" style="accent-color:var(--accent-color);">
                    <span>${label}</span>
                </label>
            `;
        }).join("");
        
        listEl.innerHTML = html;
    };

    window.filterTones = function (query) {
        let q = query.toLowerCase().trim();
        let items = document.querySelectorAll("#toneOptionsList .dropdown-option-item-checkbox");
        items.forEach(item => {
            let text = item.querySelector("span").textContent.toLowerCase();
            if (item.querySelector("#toneAnyCheckbox")) {
                item.style.display = "flex";
                return;
            }
            if (text.includes(q)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    };

    window.filterArchetypes = function (query) {
        let q = query.toLowerCase().trim();
        let items = document.querySelectorAll("#archetypeOptionsList .dropdown-option-item-checkbox");
        items.forEach(item => {
            let text = item.querySelector("span").textContent.toLowerCase();
            if (item.querySelector("#archetypeAnyCheckbox")) {
                item.style.display = "flex";
                return;
            }
            if (text.includes(q)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    };

    // Dynamic Dropdown functions
    window.getSelectedDynamics = function () {
        let checked = [...document.querySelectorAll(".dynamicCheckbox:checked")].map(c => c.value);
        return checked.length > 0 ? checked : ["Any"];
    };

    window.handleDynamicChange = function () {
        let checked = [...document.querySelectorAll(".dynamicCheckbox:checked")];
        let anyBox = document.getElementById("dynamicAnyCheckbox");
        if (checked.length > 0 && anyBox) anyBox.checked = false;
        updateDynamicLabel();
        saveDynamics();
    };

    window.handleDynamicAnyToggle = function (checkbox) {
        if (checkbox.checked) {
            document.querySelectorAll(".dynamicCheckbox").forEach(c => c.checked = false);
        }
        updateDynamicLabel();
        saveDynamics();
    };

    window.updateDynamicLabel = function () {
        let dynamics = getSelectedDynamics();
        let label = document.getElementById("dynamicDropdownLabel");
        if (label) {
            if (dynamics[0] === "Any") label.textContent = "Any";
            else if (dynamics.length === 1) label.textContent = dynamics[0].replace(/_/g, " ");
            else label.textContent = dynamics[0].replace(/_/g, " ") + " +" + (dynamics.length - 1);
        }
    };

    window.saveDynamics = function () {
        localStorage.dynamics = JSON.stringify(getSelectedDynamics());
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.loadDynamics = function () {
        try {
            let saved = JSON.parse(localStorage.dynamics || '["Any"]');
            let anyBox = document.getElementById("dynamicAnyCheckbox");
            if (!saved || saved.length === 0 || saved[0] === "Any") {
                if (anyBox) anyBox.checked = true;
            } else {
                if (anyBox) anyBox.checked = false;
                saved.forEach(t => {
                    let box = document.querySelector(`.dynamicCheckbox[value="${t}"]`);
                    if (box) box.checked = true;
                });
            }
            updateDynamicLabel();
        } catch (e) {
            let anyBox = document.getElementById("dynamicAnyCheckbox");
            if (anyBox) anyBox.checked = true;
            updateDynamicLabel();
        }
    };

    window.initCustomDynamicDropdown = function () {
        let listEl = document.getElementById("dynamicOptionsList");
        if (!listEl) return;
        
        let keys = [];
        const isPerchance = window.location.hostname.includes("perchance.org");
        if (isPerchance && typeof window.root !== "undefined" && window.root.dynamicPrompts) {
            keys = window.getPerchanceListKeys(window.root.dynamicPrompts);
        }
        if (!keys || keys.length === 0) {
            keys = DYNAMIC_KEYS;
        }
        
        keys = keys.filter(k => k !== "Any");
        
        let html = `
            <label class="dropdown-option-item-checkbox">
                <input type="checkbox" id="dynamicAnyCheckbox" value="Any"
                    onchange="handleDynamicAnyToggle(this)"
                    style="accent-color:var(--accent-color);">
                <span>Any</span>
            </label>
            <hr style="margin:0.25rem 0; border-color:var(--panel-border);">
        `;
        
        html += keys.map(k => {
            let label = window.getDropdownDisplayLabel(k);
            return `
                <label class="dropdown-option-item-checkbox">
                    <input type="checkbox" class="dynamicCheckbox" value="${k}"
                        onchange="handleDynamicChange()" style="accent-color:var(--accent-color);">
                    <span>${label}</span>
                </label>
            `;
        }).join("");
        
        listEl.innerHTML = html;
    };

    window.filterDynamics = function (query) {
        let q = query.toLowerCase().trim();
        let items = document.querySelectorAll("#dynamicOptionsList .dropdown-option-item-checkbox");
        items.forEach(item => {
            let text = item.querySelector("span").textContent.toLowerCase();
            if (item.querySelector("#dynamicAnyCheckbox")) {
                item.style.display = "flex";
                return;
            }
            if (text.includes(q)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    };

    // Perspective Dropdown functions
    window.getSelectedPerspective = function () {
        return localStorage.perspective || "Third_Person";
    };

    window.selectPerspective = function (value, closeMenu = true) {
        localStorage.perspective = value;
        let labelEl = document.getElementById("perspectiveLabel");
        if (labelEl) {
            labelEl.textContent = value.replace(/_/g, " ");
        }

        // Update active checkmarks
        let items = document.querySelectorAll("#perspectiveDropdownMenu .dropdown-option-item");
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
            let menu = document.getElementById("perspectiveDropdownMenu");
            if (menu) menu.style.display = "none";
        }
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.loadPerspective = function () {
        let val = localStorage.perspective || "Third_Person";
        selectPerspective(val, false);
    };

    window.initCustomLengthDropdowns = function () {
        let selects = document.querySelectorAll("select.length-select");
        selects.forEach(selectEl => {
            if (selectEl.dataset.customDropdownInitialized) return;
            selectEl.dataset.customDropdownInitialized = "true";

            // Hide original select
            selectEl.style.display = "none";
            selectEl.classList.remove("length-select");
            selectEl.classList.add("hidden-length-select");

            // Create wrapper
            let wrapper = document.createElement("div");
            wrapper.className = "custom-dropdown";
            wrapper.style.display = "inline-block";
            wrapper.style.fontSize = "85%";

            let menuId = selectEl.id + "Menu";

            // Create trigger button
            let trigger = document.createElement("button");
            trigger.className = "dropdown-trigger length-select";
            trigger.style.minWidth = "120px";
            trigger.style.padding = "0.35rem 0.6rem";
            trigger.style.height = "31px";
            trigger.style.fontSize = "85%";
            trigger.style.display = "flex";
            trigger.style.alignItems = "center";
            trigger.style.justifyContent = "space-between";
            trigger.style.gap = "0.4rem";
            trigger.style.backgroundImage = "none"; // Avoid inheriting double chevron arrows from CSS .length-select

            let valSpan = document.createElement("span");
            valSpan.className = "dropdown-value";
            valSpan.style.marginRight = "0.25rem";
            
            let iconClass = selectEl.dataset.dropdownIcon;
            if (iconClass) {
                let iconEl = document.createElement("i");
                iconEl.className = iconClass;
                iconEl.style.marginRight = "0.4rem";
                iconEl.style.flexShrink = "0";
                trigger.appendChild(iconEl);
            }

            let activeOption = selectEl.options[selectEl.selectedIndex];
            valSpan.textContent = activeOption ? activeOption.text : selectEl.value;
            trigger.appendChild(valSpan);

            let arrow = document.createElement("i");
            arrow.className = "bi bi-chevron-down dropdown-arrow";
            arrow.style.fontSize = "70%";
            arrow.style.marginLeft = "auto";
            trigger.appendChild(arrow);

            trigger.onclick = function (e) {
                toggleCustomDropdown(menuId, e);
            };

            wrapper.appendChild(trigger);

            // Create menu
            let menu = document.createElement("div");
            menu.className = "dropdown-menu-custom";
            menu.id = menuId;
            menu.style.display = "none";
            menu.style.width = "150px";
            menu.onclick = function(e) { e.stopPropagation(); };

            let optionsContainer = document.createElement("div");
            optionsContainer.className = "dropdown-options";

            Array.from(selectEl.options).forEach(opt => {
                let optDiv = document.createElement("div");
                optDiv.className = "dropdown-option-item";
                optDiv.dataset.value = opt.value;
                
                let textSpan = document.createElement("span");
                textSpan.textContent = opt.text;
                optDiv.appendChild(textSpan);

                let checkIcon = document.createElement("i");
                checkIcon.className = "bi bi-check-lg";
                checkIcon.style.color = "#fff"; // White checkmark on selected purple background
                optDiv.appendChild(checkIcon);

                optDiv.onclick = function() {
                    selectEl.value = opt.value;
                    selectEl.dispatchEvent(new Event('change'));
                    menu.style.display = "none";
                    wrapper.classList.remove("open");
                };

                optionsContainer.appendChild(optDiv);
            });

            menu.appendChild(optionsContainer);
            wrapper.appendChild(menu);

            // Insert wrapper after selectEl
            selectEl.parentNode.insertBefore(wrapper, selectEl.nextSibling);

            function updateUI(val) {
                let selectedOpt = Array.from(selectEl.options).find(o => o.value === val);
                valSpan.textContent = selectedOpt ? selectedOpt.text : val;

                let items = optionsContainer.querySelectorAll(".dropdown-option-item");
                items.forEach(item => {
                    if (item.dataset.value === val) {
                        item.classList.add("selected");
                    } else {
                        item.classList.remove("selected");
                    }
                });
            }

            let descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
            Object.defineProperty(selectEl, 'value', {
                get: function() {
                    return descriptor.get.call(selectEl);
                },
                set: function(val) {
                    descriptor.set.call(selectEl, val);
                    updateUI(val);
                }
            });

            updateUI(selectEl.value);
        });
    };

    // Initialize custom dropdowns on load
    setTimeout(() => {
        initCustomSettingDropdown();
        initCustomToneDropdown();
        initCustomArchetypeDropdown();
        initCustomDynamicDropdown();
        loadTones();
        loadArchetypes();
        loadDynamics();
        loadPerspective();
        initCustomLengthDropdowns();
        
        // Sort custom dropdowns under Core identity & Parameters
        if (typeof sortDropdownList === "function") {
            sortDropdownList("settingOptionsList");
            sortDropdownList("toneOptionsList");
            sortDropdownList("archetypeOptionsList");
            sortDropdownList("dynamicOptionsList");
        }
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
            outputEl.style.display = "block";
        }
        if (notesEl) {
            notesEl.value = "";
            localStorage.removeItem(section + "Notes");
        }
        if (statusEl) statusEl.textContent = "";

        if (section === "lore") {
            clearLoreFields();
            localStorage.removeItem("loreText");
        }

        if (window.characterSections) delete window.characterSections[section];
        updateClearAllBtn();
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
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
        
        let outputEl = document.getElementById(section + "OutputEl");
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
        let characterSheetTab = document.getElementById('characterSheetTabEl');
        let settingsTab = document.getElementById('settingsTabEl');
        let roleplayTab = document.getElementById('roleplayTabEl');
        let worldTab = document.getElementById('worldTabEl');
        let assistantTab = document.getElementById('assistantTabEl');
        if (generatorTab) generatorTab.style.display = 'none';
        if (characterSheetTab) characterSheetTab.style.display = 'none';
        if (settingsTab) settingsTab.style.display = 'none';
        if (roleplayTab) roleplayTab.style.display = 'none';
        if (worldTab) worldTab.style.display = 'none';
        if (assistantTab) assistantTab.style.display = 'none';
        
        if (tabName === 'characters') {
            let activeItem = document.getElementById('sidebar-item-characters');
            if (activeItem) activeItem.classList.add('active');
            if (generatorTab) generatorTab.style.display = 'flex';
        } else if (tabName === 'character-sheet') {
            let activeItem = document.getElementById('sidebar-item-character-sheet');
            if (activeItem) activeItem.classList.add('active');
            if (characterSheetTab) characterSheetTab.style.display = 'flex';
            if (typeof renderCharacterSheetTab === 'function') renderCharacterSheetTab();
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
