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

        // Dynamically define getters for prompts that use compile() via instruction.evaluateItem
        const categories = ['characterPage', 'worldPage', 'roleplayPage', 'assistantPage'];
        categories.forEach(cat => {
            let prompts = window.root.prompts[cat];
            if (!prompts) return;
            Object.keys(prompts).forEach(key => {
                let prompt = prompts[key];
                if (prompt && typeof prompt.compile === 'function') {
                    Object.defineProperty(prompt, 'instruction', {
                        get: function() {
                            return {
                                get evaluateItem() {
                                    if (cat === 'characterPage') {
                                        if (key === 'worldLore') return prompt.compile(window.root.settingValue, window.root.toneStr, window.root.userNotes, window.root.existingWorldName, window.root.needsName);
                                        if (key === 'worldLoreImage') return prompt.compile(window.root.text);
                                        if (key === 'identityDetails') return prompt.compile(window.root.existingContext, window.root.worldLoreVal, window.root.allUserNotes, window.root.settingAndTone, window.root.blankFields);
                                        if (key === 'overview') return prompt.compile(window.root.settingValue, window.root.toneStr, window.root.worldLoreVal, window.root.detailsStr);
                                        if (key === 'imageCaption') return prompt.compile(window.root.settingValue, window.root.toneStr, window.root.appearanceText);
                                        if (key === 'backgroundImage') return prompt.compile(window.root.scenario);
                                        if (key === 'wikiImport') return prompt.compile(window.root.content, window.root.wikiOverride);
                                        if (key === 'chatCss') return prompt.compile(window.root.generatedText, window.root.settingValue, window.root.toneValues);
                                        if (key === 'chatLore') return prompt.compile();
                                        if (key === 'chatStyleGuide') return prompt.compile();
                                    }
                                    if (cat === 'worldPage') {
                                        if (key === 'bannerImage') return prompt.compile(window.root.wName, window.root.wSetting, window.root.wTones, window.root.overviewText);
                                        if (key === 'wikiImport') return prompt.compile(window.root.content, window.root.override);
                                    }
                                    if (cat === 'roleplayPage') {
                                        if (key === 'wikiImport') return prompt.compile(window.root.content, window.root.override);
                                        if (key === 'worldLore') return prompt.compile(window.root.name, window.root.setting, window.root.tonesStr);
                                        if (key === 'npcGeneration') return prompt.compile(window.root.worldName, window.root.worldLore, window.root.setting);
                                        if (key === 'scenarioNotes') return prompt.compile(window.root.worldName, window.root.worldLore, window.root.npcsText, window.root.userRole);
                                    }
                                    if (cat === 'assistantPage') {
                                        if (key === 'assessIntention') return prompt.compile(window.root.text);
                                        if (key === 'methodology') return prompt.compile(window.root.assistantPersonality, window.root.context, window.root.text);
                                        if (key === 'finalOutputThinking') return prompt.compile(window.root.assistantPersonality, window.root.context, window.root.methodology, window.root.text);
                                        if (key === 'finalOutputNoThinking') return prompt.compile(window.root.assistantPersonality, window.root.context, window.root.text);
                                        if (key === 'imagePrompt') return prompt.compile(window.root.context, window.root.text);
                                    }
                                    return "";
                                }
                            };
                        },
                        configurable: true
                    });
                }
            });
        });
        
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

    window.initCustomSettingDropdown = function () {
        window.initializeDropdownOptions({
            listElId: "settingOptionsList",
            fallbackKeys: window.SETTING_KEYS,
            perchanceSource: typeof root !== "undefined" ? root.settingPrompts : null,
            selectedValue: localStorage.setting || "Any",
            onSelect: "selectSetting",
            isMultiSelect: false
        });
        selectSetting(localStorage.setting || "Any", false);
    };

    window.filterSettings = function (query) {
        window.filterDropdownOptions("settingOptionsList", query);
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
        let saved = ["Any"];
        try {
            if (localStorage.tones) saved = JSON.parse(localStorage.tones);
        } catch (e) {}
        window.initializeDropdownOptions({
            listElId: "toneOptionsList",
            fallbackKeys: window.TONE_KEYS,
            perchanceSource: typeof root !== "undefined" ? root.tonePrompts : null,
            selectedValue: saved,
            onSelect: "handleTone",
            isMultiSelect: true,
            inputName: "tone"
        });
        loadTones();
    };

    window.initCustomArchetypeDropdown = function () {
        let saved = ["Any"];
        try {
            if (localStorage.archetypes) saved = JSON.parse(localStorage.archetypes);
        } catch (e) {}
        window.initializeDropdownOptions({
            listElId: "archetypeOptionsList",
            fallbackKeys: window.ARCHETYPE_KEYS,
            perchanceSource: typeof root !== "undefined" ? root.archetypePrompts : null,
            selectedValue: saved,
            onSelect: "handleArchetype",
            isMultiSelect: true,
            inputName: "archetype"
        });
        loadArchetypes();
    };

    window.filterTones = function (query) {
        window.filterDropdownOptions("toneOptionsList", query);
    };

    window.filterArchetypes = function (query) {
        window.filterDropdownOptions("archetypeOptionsList", query);
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
        let saved = ["Any"];
        try {
            if (localStorage.dynamics) saved = JSON.parse(localStorage.dynamics);
        } catch (e) {}
        window.initializeDropdownOptions({
            listElId: "dynamicOptionsList",
            fallbackKeys: window.DYNAMIC_KEYS,
            perchanceSource: typeof root !== "undefined" ? root.dynamicPrompts : null,
            selectedValue: saved,
            onSelect: "handleDynamic",
            isMultiSelect: true,
            inputName: "dynamic"
        });
        loadDynamics();
    };

    window.filterDynamics = function (query) {
        window.filterDropdownOptions("dynamicOptionsList", query);
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
/* ==========================================================================
   MOBILE-FIRST SELECT DROPDOWN DRAWER INTEGRATION
   ========================================================================== */
    let currentActiveSelectEl = null;
    let currentActiveWrapper = null;
    const multiSelectIds = new Set();
    const multiSelectState = {};

    const selectToListNameMap = {
        'visualStyleEl': 'visualStyles'
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
        'rpWorldImportSelector': 'LOAD SAVED WORLD'
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

        if (isAlreadyOpen) {
            scrollBox.classList.add('fade-out');
            setTimeout(() => {
                setupDrawerContent(selectEl, wrapper, scrollBox, drawer);
                setTimeout(() => {
                    scrollBox.classList.remove('fade-out');
                }, 50);
            }, 150);
        } else {
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

        function updateTriggerText() {
            if (multiSelectIds.has(selectEl.id)) {
                updateMultiSelectLabel(selectEl, wrapper);
            } else {
                const sel = selectEl.options[selectEl.selectedIndex];
                labelSpan.textContent = sel ? sel.textContent : '';
            }
        }

        updateTriggerText();

        new MutationObserver(updateTriggerText)
            .observe(selectEl, { childList: true, attributes: true, subtree: true });

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSelectDrawer(selectEl, wrapper);
        });
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
        let brainSidebarToggleBtn = document.getElementById("brainSidebarToggleBtn");
        
        if (!sidebar || !brainSidebar || !sidebarToggleBtn || !brainSidebarToggleBtn) return;
        
        let isSavedOpen = sidebar.style.transform === "translateX(0%)";
        let isBrainOpen = brainSidebar.style.transform === "translateX(0%)";
        
        if (isSavedOpen) {
            brainSidebarToggleBtn.style.opacity = "0";
            brainSidebarToggleBtn.style.pointerEvents = "none";
            sidebarToggleBtn.style.opacity = "1";
            sidebarToggleBtn.style.pointerEvents = "auto";
        } else if (isBrainOpen) {
            sidebarToggleBtn.style.opacity = "0";
            sidebarToggleBtn.style.pointerEvents = "none";
            brainSidebarToggleBtn.style.opacity = "1";
            brainSidebarToggleBtn.style.pointerEvents = "auto";
        } else {
            sidebarToggleBtn.style.opacity = "1";
            sidebarToggleBtn.style.pointerEvents = "auto";
            brainSidebarToggleBtn.style.opacity = "1";
            brainSidebarToggleBtn.style.pointerEvents = "auto";
        }
    };
    
    window.updateBrainContextView = function() {
        const textarea = document.getElementById('brainContextTextarea');
        if (!textarea) return;
        textarea.value = window.getCurrentAIContextPrompt ? window.getCurrentAIContextPrompt() : "";
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
                { value: 'rpWorldLore', text: 'World Lore Summary' },
                { value: 'npcGeneration', text: 'NPC Cast Generation' },
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
                
                const sections = ["shortDescription", "appearance", "role", "personality", "beliefs", "preferences", "abilities", "relations", "timeline", "lore", "roleplay", "introScenario", "introStart"];
                if (sections.includes(val)) {
                    let context = window.buildCharacterContext ? window.buildCharacterContext(val) : "";
                    let notes = (document.getElementById(val + "NotesEl") || {}).value || "";
                    let lengthVal = window.getEffectiveLengthForSection ? window.getEffectiveLengthForSection(val) : "medium";
                    let overview = (document.getElementById("overviewNotesEl") || {}).value || "";
                    let worldLore = (document.getElementById("worldLoreEl") || {}).value || "";
                    
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
                    let wSetting = window.worldState.setting;
                    let wTones = window.worldState.tones ? window.worldState.tones.join(", ") : "";
                    let wThemes = window.worldState.themes;
                    let notesEl = document.getElementById("w" + section.charAt(0).toUpperCase() + section.slice(1) + "NotesEl");
                    let sectionNotes = notesEl ? notesEl.value : "";
                    let lenEl = document.getElementById("w" + section.charAt(0).toUpperCase() + section.slice(1) + "LengthEl");
                    let lenVal = lenEl ? lenEl.value : "medium";
                    let lengthInstruction = window.getLengthInstruction ? window.getLengthInstruction(lenVal) : "";
                    
                    return root.prompts.worldPage.sectionGeneration.compile(
                        section,
                        wName,
                        wSetting,
                        wTones,
                        wThemes,
                        sectionNotes,
                        lengthInstruction
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
                    let setting = document.getElementById("rpSettingLabel")?.textContent || "Any setting";
                    let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
                    return root.prompts.roleplayPage.worldLore.compile(name, setting, tonesStr);
                }
                if (val === 'npcGeneration') {
                    let worldName = window.roleplayState.worldName || "Unnamed World";
                    let worldLore = window.roleplayState.worldLore || "";
                    let setting = document.getElementById("rpSettingLabel")?.textContent || "Any setting";
                    return root.prompts.roleplayPage.npcGeneration.compile(worldName, worldLore, setting);
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
                    let setting = document.getElementById("rpSettingLabel")?.textContent || "Any setting";
                    let tonesStr = window.roleplayState.tones ? window.roleplayState.tones.join(", ") : "Any tone";
                    let themes = window.roleplayState.themes || "";
                    let pName = window.roleplayState.userName || "Player";
                    let pRole = window.roleplayState.userRole || "";
                    let npcsText = window.roleplayState.npcs ? window.roleplayState.npcs.map(n => {
                        return `Name: ${n.name}\nSpecies/Race: ${n.species}\nPersonality: ${n.personality}\nRole in Scenario: ${n.role}`;
                    }).join("\n\n") : "";
                    let scenarioNotes = window.roleplayState.scenarioNotes || "";
                    let lengthVal = document.getElementById("rpLengthEl")?.value || "medium";
                    let lengthInstruction = window.getLengthInstruction ? window.getLengthInstruction(lengthVal) : "";
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
    document.addEventListener('input', function() {
        let brainSidebar = document.getElementById('brainSidebarEl');
        if (brainSidebar && brainSidebar.style.transform === "translateX(0%)") {
            window.updateBrainContextView();
        }
    });
    
    document.addEventListener('change', function() {
        let brainSidebar = document.getElementById('brainSidebarEl');
        if (brainSidebar && brainSidebar.style.transform === "translateX(0%)") {
            window.updateBrainContextView();
        }
    });
