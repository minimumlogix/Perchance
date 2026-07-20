/**
 * @file roleplay-prompt.js
 * @description Exposes prompt compilation logic for the Roleplay Generator.
 * Defines lores, NPC generation, conflict scenarios, and roleplay starter compile helpers.
 */

(function () {
    window.prompts = window.prompts || {};

    /**
     * Helper to wrap a prompt compiler function in an object that implements
     * the Perchance-like .evaluateItem and native .toString() interfaces.
     * @param {function} compileFn 
     * @returns {object}
     */
    function makeInstruction(compileFn) {
        return {
            get evaluateItem() {
                return compileFn();
            },
            toString: function () {
                return compileFn();
            }
        };
    }

    // ==========================================
    // ROLEPLAY PAGE PROMPTS
    // ==========================================

    window.prompts.roleplayPage = {
        wikiImport: {
            instruction: makeInstruction(() => {
                let content = (window.root && window.root.content) || "";
                let override = (window.root && window.root.override) || "";
                return window.prompts.roleplayPage.wikiImport.compile(content, override);
            }),
            compile: function (content, override) {
                let parts = ["TASK: Extract roleplay scenario details from the provided text to populate a roleplay configuration."];
                parts.push("Text:\n" + content.slice(0, 12000));
                parts.push("Respond with ONLY a JSON object in this format:\n{\n  \"worldName\": \"...\",\n  \"worldLore\": \"...\",\n  \"setting\": \"...\",\n  \"tones\": [\"...\", \"...\"],\n  \"themes\": \"...\",\n  \"userName\": \"...\",\n  \"userRole\": \"...\",\n  \"npcs\": [\n    { \"name\": \"...\", \"species\": \"...\", \"personality\": \"...\", \"role\": \"...\" }\n  ],\n  \"scenarioNotes\": \"...\"\n}\n- worldName, userName, userRole: short text.\n- setting: short genre.\n- tones: array of tone names.\n- themes: comma-separated list of themes.\n- worldLore, scenarioNotes: detailed descriptions.\n- npcs: array of up to 4 major characters from the text, with name, species, personality summary, and role in story.\n- If a field is unknown, use null.");
                if (override.trim()) {
                    parts.push("IMPORTANT CREATIVE TWIST - apply this override: \"" + override.trim() + "\". Reinterpret the scenario fully through this lens.");
                }
                parts.push("STRICT FORMATTING RULE: Do NOT use the em dash character (—) anywhere in your response. Replace any em dash with a comma, semicolon, colon, or rewrite.");
                return parts.join("\n\n");
            }
        },

        worldLore: {
            instruction: makeInstruction(() => {
                let name = (window.root && window.root.name) || "";
                let setting = (window.root && window.root.setting) || "";
                let tonesStr = (window.root && window.root.tonesStr) || "";
                let themes = (window.root && window.root.themes) || "";
                let notes = (window.root && window.root.notes) || "";
                return window.prompts.roleplayPage.worldLore.compile(name, setting, tonesStr, themes, notes);
            }),
            compile: function (name, setting, tonesStr, themes, notes) {
                let prompt = "Write a concise world overview (3-4 sentences maximum) for a roleplay setting.\nWorld Name: " + name + "\nSetting: " + setting + "\nTones: " + tonesStr;
                if (themes && themes.trim()) {
                    prompt += "\nCore Themes / Keywords: " + themes;
                }
                if (notes && notes.trim()) {
                    prompt += "\nSpecific Notes/Guidance: " + notes;
                }
                prompt += "\n\nDo not include titles. Write in a factual, evocative style. Do not use the em-dash (—) character. Output only the lore content.";
                return prompt;
            }
        },

        timeline: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let setting = (window.root && window.root.setting) || "";
                let tonesStr = (window.root && window.root.tonesStr) || "";
                let themes = (window.root && window.root.themes) || "";
                let npcsText = (window.root && window.root.npcsText) || "";
                let dynamics = (window.root && window.root.dynamics) || "";
                let userName = (window.root && window.root.userName) || "";
                let userRole = (window.root && window.root.userRole) || "";
                let notes = (window.root && window.root.notes) || "";
                let lengthVal = (window.root && window.root.lengthVal) || "medium";
                return window.prompts.roleplayPage.timeline.compile(worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes, lengthVal);
            }),
            compile: function (worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes, lengthVal) {
                let lengthRule = "Generate 4 to 6 major timeline events.";
                if (lengthVal === "super-short") lengthRule = "Generate 2 to 3 major timeline events.";
                else if (lengthVal === "short") lengthRule = "Generate 3 to 4 major timeline events.";
                else if (lengthVal === "long") lengthRule = "Generate 6 to 8 major timeline events.";
                else if (lengthVal === "super-long") lengthRule = "Generate 8 to 12 major timeline events.";

                let prompt = `You are writing a chronological TIMELINE of key historical events, setup milestones, or backstory context leading up to the start of this roleplay session.

World Name: ${worldName}
Setting: ${setting}
Tones: ${tonesStr}
Themes: ${themes}
Dynamics: ${dynamics}
Player Name: ${userName}
Player Role: ${userRole}

NPC Cast in the Scene:
${npcsText}

Specific Notes/Guidance: ${notes}

Rules:
1. ${lengthRule}
2. Events must represent history, recent changes, occurrences, or actions by the NPCs and Player that set up the current scene.
3. Do NOT make it about a single character's life; it must map out the world/scenario state and the events leading up to the start.
4. Format: You MUST output exactly in this format (using a literal equals sign \\='):
- [Time/Era/Year/Event] = [Milestone/Description]
For example:
- 10 Years Ago = The first dimensional rift opened in the lower sectors.
- 3 Months Ago = Kaito was assigned as the lead warden of Sector 7.
- Yesterday = The security grid was disabled by an unknown hacker.

Do NOT include headers, markdown bolding, or introductions. Output only the list.`;
                return prompt;
            }
        },

        lore: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let setting = (window.root && window.root.setting) || "";
                let tonesStr = (window.root && window.root.tonesStr) || "";
                let themes = (window.root && window.root.themes) || "";
                let npcsText = (window.root && window.root.npcsText) || "";
                let dynamics = (window.root && window.root.dynamics) || "";
                let userName = (window.root && window.root.userName) || "";
                let userRole = (window.root && window.root.userRole) || "";
                let notes = (window.root && window.root.notes) || "";
                return window.prompts.roleplayPage.lore.compile(worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes);
            }),
            compile: function (worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes) {
                let prompt = `You are generating timeless lore entries containing factual details, faction rules, magic mechanics, or world-building facts relevant to this roleplay session.

World Name: ${worldName}
Setting: ${setting}
Tones: ${tonesStr}
Themes: ${themes}
Dynamics: ${dynamics}
Player Name: ${userName}
Player Role: ${userRole}

NPC Cast in the Scene:
${npcsText}

Specific Notes/Guidance: ${notes}

Rules:
1. You MUST generate a strict JSON object containing between 4 and 5 lore entries.
2. The keys of the JSON object must be strings "1", "2", "3", "4", "5".
3. Each entry must contain a "content" string (the lore details) and a "key" array of strings (lowercase keywords/phrases that trigger this lore during roleplay chat).
4. Output ONLY the raw JSON object. Do not wrap in markdown \`\`\`json blocks.

JSON format example:
{
  "1": {
    "content": "The Sector 7 security sweep runs on an exact ten-minute loop. Any unregistered energy signatures trigger an automatic lockdown.",
    "key": ["security", "sweep", "lockdown", "sector 7"]
  },
  "2": {
    "content": "Aether-culls are elite agents trained specifically to neutralize mana-users and dismantle illegal arcane reactors.",
    "key": ["aether-cull", "mana", "arcane", "illegal reactor"]
  }
}`;
                return prompt;
            }
        },

        roleplay: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let setting = (window.root && window.root.setting) || "";
                let tonesStr = (window.root && window.root.tonesStr) || "";
                let themes = (window.root && window.root.themes) || "";
                let npcsText = (window.root && window.root.npcsText) || "";
                let dynamics = (window.root && window.root.dynamics) || "";
                let userName = (window.root && window.root.userName) || "";
                let userRole = (window.root && window.root.userRole) || "";
                let notes = (window.root && window.root.notes) || "";
                let lengthVal = (window.root && window.root.lengthVal) || "medium";
                return window.prompts.roleplayPage.roleplay.compile(worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes, lengthVal);
            }),
            compile: function (worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes, lengthVal) {
                let lengthRule = "Write exactly 5 back-and-forth interactions.";
                if (lengthVal === "super-short") lengthRule = "Write 2 back-and-forth interactions.";
                else if (lengthVal === "short") lengthRule = "Write 3 back-and-forth interactions.";
                else if (lengthVal === "long") lengthRule = "Write 6 to 8 back-and-forth interactions.";
                else if (lengthVal === "super-long") lengthRule = "Write 8 to 12 back-and-forth interactions.";

                let prompt = `You are writing a BEHAVIOUR EXAMPLE showing roleplay interaction between the Player (${userName}) and the NPC cast list.

World Name: ${worldName}
Setting: ${setting}
Tones: ${tonesStr}
Themes: ${themes}
Dynamics: ${dynamics}
Player Name: ${userName}
Player Role: ${userRole}

NPC Cast in the Scene:
${npcsText}

Specific Notes/Guidance: ${notes}

Rules:
1. ${lengthRule}
2. Format: Format response EXACTLY as:
${userName}: "Dialogue" *Action description*
[NPC Name]: "Dialogue" *Action description*
3. The interactions should showcase how the NPCs react to the Player, how they speak based on their unique personalities, and the dynamics between the cast.
4. Use asterisks for actions/narration and double quotes for dialogue.

Do NOT include headers, labels, or introductions.`;
                return prompt;
            }
        },

        introScenario: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let setting = (window.root && window.root.setting) || "";
                let tonesStr = (window.root && window.root.tonesStr) || "";
                let themes = (window.root && window.root.themes) || "";
                let npcsText = (window.root && window.root.npcsText) || "";
                let dynamics = (window.root && window.root.dynamics) || "";
                let userName = (window.root && window.root.userName) || "";
                let userRole = (window.root && window.root.userRole) || "";
                let notes = (window.root && window.root.notes) || "";
                let lengthVal = (window.root && window.root.lengthVal) || "medium";
                return window.prompts.roleplayPage.introScenario.compile(worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes, lengthVal);
            }),
            compile: function (worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes, lengthVal) {
                let lengthRule = "Write a single cohesive paragraph (4-6 sentences).";
                if (lengthVal === "super-short") lengthRule = "Write an ultra-concise setup (1-2 sentences).";
                else if (lengthVal === "short") lengthRule = "Write a short setup (3-4 sentences).";
                else if (lengthVal === "long") lengthRule = "Write a detailed, atmospheric description (7-8 sentences).";
                else if (lengthVal === "super-long") lengthRule = "Write a comprehensive setup (9-12 sentences).";

                let prompt = `You are writing the SCENARIO CONTEXT (Starting Scene Context) to establish the beginning of this roleplay session. 

World Name: ${worldName}
Setting: ${setting}
Tones: ${tonesStr}
Themes: ${themes}
Dynamics: ${dynamics}
Player Name: ${userName}
Player Role: ${userRole}

NPC Cast in the Scene:
${npcsText}

Specific Notes/Guidance: ${notes}

Rules:
1. ${lengthRule}
2. Start by clearly describing the world first, establishing its atmosphere, setting, genre, and any essential context before introducing any characters.
3. Explain the role that **{{user}}** is playing in this world, then introduce the other character, their relationship to **{{user}}** if relevant, followed by the current situation or setting. Include only the essential details **{{user}}** needs to immediately understand the scene, character dynamics, tone, and context so they can naturally continue the roleplay in character. Do **not** reveal spoilers or information that **{{user}}** as a character should not know at the beginning.
4. Focus entirely on scene setup. Do **not** write any character dialogue, direct speech, thoughts, or narration beyond the setup. Keep the writing immersive, visual, atmospheric, and engaging while avoiding clichés. The paragraph should feel like the opening of an interactive story.
5. Output **only one paragraph** containing the scene context. Do **not** include headers, labels, titles, or explanatory text (such as "Scenario Context:"). Do **not** exceed one paragraph.`;
                return prompt;
            }
        },

        introStart: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let setting = (window.root && window.root.setting) || "";
                let tonesStr = (window.root && window.root.tonesStr) || "";
                let themes = (window.root && window.root.themes) || "";
                let npcsText = (window.root && window.root.npcsText) || "";
                let dynamics = (window.root && window.root.dynamics) || "";
                let userName = (window.root && window.root.userName) || "";
                let userRole = (window.root && window.root.userRole) || "";
                let notes = (window.root && window.root.notes) || "";
                let lengthVal = (window.root && window.root.lengthVal) || "medium";
                let scenarioContext = (window.root && window.root.scenarioContext) || "";
                return window.prompts.roleplayPage.introStart.compile(worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes, lengthVal, scenarioContext);
            }),
            compile: function (worldName, worldLore, setting, tonesStr, themes, npcsText, dynamics, userName, userRole, notes, lengthVal, scenarioContext) {
                let lengthRule = "Write 1 to 2 paragraphs of dialogue and narration.";
                if (lengthVal === "super-short") lengthRule = "Write a single line of dialogue with brief action description.";
                else if (lengthVal === "long") lengthRule = "Write 3 to 4 detailed paragraphs of dialogue and sensory atmosphere.";
                else if (lengthVal === "super-long") lengthRule = "Write 5+ comprehensive paragraphs of dialogue and deep sensory atmosphere.";

                let prompt = `You are writing the first message of the NPC cast to start the roleplay.

World Name: ${worldName}
Setting: ${setting}
Tones: ${tonesStr}
Themes: ${themes}
Dynamics: ${dynamics}
Player Name: ${userName}
Player Role: ${userRole}

NPC Cast in the Scene:
${npcsText}

Scenario Context:
${scenarioContext}

Specific Notes/Guidance: ${notes}

Rules:
1. ${lengthRule}
2. Write the character's opening message as a direct continuation of the scenario context. Include direct dialogue addressed to **{{user}}** together with narration and actions. Write naturally, not like an AI. Fully embody the character without holding back their personality, emotions, speech patterns, body language, physical expressions, or sensory observations. Draw on all five senses where appropriate.
3. Format all narration and actions inside *asterisks* and all spoken dialogue inside "double quotes". Output **only** the greeting dialogue and narration. Do **not** include headers, labels, titles, explanations, or any text such as "Intro Script:". Do **not** use the em dash (—) symbol anywhere in the writing.
4. Prefix every spoken line with the character's short name using the format \`CharacterName: "Dialogue"\`. Weave in actions, pauses, gestures, or expressions between dialogue where natural. For example: \`Kaito: "The security sweeps are on a ten-minute loop." *He checks his arm cannon before glancing toward {{user}}.* "We've got one shot at this."\` Ensure the dialogue reflects the character's personality, current emotional state, and relationship with **{{user}}**.`;
                return prompt;
            }
        },

        npcGeneration: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let setting = (window.root && window.root.setting) || "";
                let tonesStr = (window.root && window.root.tonesStr) || "";
                let themes = (window.root && window.root.themes) || "";
                let existingNpcsText = (window.root && window.root.existingNpcsText) || "";
                let dynamics = (window.root && window.root.dynamics) || "";
                let userName = (window.root && window.root.userName) || "";
                let userRole = (window.root && window.root.userRole) || "";
                return window.prompts.roleplayPage.npcGeneration.compile(worldName, worldLore, setting, tonesStr, themes, existingNpcsText, dynamics, userName, userRole);
            }),
            compile: function (worldName, worldLore, setting, tonesStr, themes, existingNpcsText, dynamics, userName, userRole) {
                let prompt = `Generate a single creative NPC profile fitting the world and existing context described below.
World Name: ${worldName}
Lore: ${worldLore}
Setting Genre: ${setting}
Tone: ${tonesStr}
Core Themes / Keywords: ${themes}
Roleplay Dynamics: ${dynamics}
Player Name: ${userName}
Player Role: ${userRole}`;

                if (existingNpcsText && existingNpcsText.trim()) {
                    prompt += `\n\nExisting NPC Cast in the Scene (DO NOT duplicate their names, roles, appearance, or personality. Create a unique character that complements them):
${existingNpcsText}`;
                }

                prompt += `\n\nYou MUST respond with exactly a JSON object matching this schema:
{
  "name": "Full name and nickname if any.",
  "age": "Current age.",
  "gender": "Gender identity.",
  "race": "Race, species, sub-race, ethnicity, or origin if applicable.",
  "role": "The character's role in the story, occupation, social status, responsibilities, place in the world, and relationship to {{user}}.",
  "appearance": "Describe physical appearance, body type, facial features, hairstyle, clothing, accessories worn, posture, mannerisms, notable scars, tattoos, or other distinguishing features.",
  "personality": "Core personality, temperament, communication style, behavior, emotional tendencies, strengths, flaws, habits, and quirks.",
  "beliefs": "Worldview, philosophy, morals, ideals, values, personal code, religious or political beliefs, and principles that guide their decisions.",
  "likes": "Things the character enjoys, hobbies, interests, comforts, guilty pleasures, favorite activities, and preferences.",
  "dislikes": "Things the character hates, fears, avoids, despises, or finds uncomfortable.",
  "abilities": "List of skills, talents, powers, combat abilities, magic, knowledge, professions, or unique capabilities.",
  "biography": "Complete life history including family, upbringing, important relationships, past events, trauma, education, residence, secrets, current circumstances, short-term goals, long-term goals, motivations, and any important lore explaining why the character is who they are.",
  "rules": "Important rules, limitations, boundaries, or facts that must never be violated when writing this character."
}

Output ONLY the valid raw JSON object. Do not wrap in markdown \`\`\`json blocks. Do not use em-dashes.`;
                return prompt;
            }
        },

        scenarioNotes: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let npcsText = (window.root && window.root.npcsText) || "";
                let userRole = (window.root && window.root.userRole) || "";
                return window.prompts.roleplayPage.scenarioNotes.compile(worldName, worldLore, npcsText, userRole);
            }),
            compile: function (worldName, worldLore, npcsText, userRole) {
                return "Generate a creative RPG roleplay conflict scenario / plot hook (2-3 sentences maximum).\nWorld Name: " + worldName + "\nWorld Lore: " + worldLore + "\nNPCs: " + (npcsText || "Generic side characters") + "\nPlayer Role: " + userRole + "\n\nEstablish an immediate danger, mystery, or conflict that unites the player and the NPCs. Output only the scenario notes. Do not write titles. Do not use em-dashes.";
            }
        },

        roleplayScenario: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let setting = (window.root && window.root.setting) || "";
                let tonesStr = (window.root && window.root.tonesStr) || "";
                let themes = (window.root && window.root.themes) || "";
                let pName = (window.root && window.root.pName) || "";
                let pRole = (window.root && window.root.pRole) || "";
                let npcsText = (window.root && window.root.npcsText) || "";
                let scenarioNotes = (window.root && window.root.scenarioNotes) || "";
                let lengthInstruction = (window.root && window.root.lengthInstruction) || "";
                let rpDynamicsStr = (window.root && window.root.rpDynamicsStr) || "";
                let roleplayPrompt = (window.root && window.root.roleplayPrompt) || "";
                return window.prompts.roleplayPage.roleplayScenario.compile(worldName, worldLore, setting, tonesStr, themes, pName, pRole, npcsText, scenarioNotes, lengthInstruction, rpDynamicsStr, roleplayPrompt);
            }),
            compile: function (worldName, worldLore, setting, tonesStr, themes, pName, pRole, npcsText, scenarioNotes, lengthInstruction, rpDynamicsStr, roleplayPrompt) {
                let parts = ["You are a creative co-writer and RPG Scenario Designer. You are creating a structured multi-character Roleplay Scenario Sheet and a Starter Message. The {{user}} is the player of this roleplay."];

                if (roleplayPrompt && roleplayPrompt.trim()) {
                    parts.push("ROLEPLAY SYSTEM GUIDANCE / NARRATIVE INSTRUCTIONS:\n" + roleplayPrompt.trim());
                }

                let worldData = "WORLD DATA:\n- World Name: " + worldName + "\n- World Lore/Setting: " + worldLore + "\n- Setting Genre: " + setting + "\n- Atmospheric Tones: " + tonesStr;
                if (themes) worldData += "\n- Themes/Keywords: " + themes;
                if (rpDynamicsStr && rpDynamicsStr !== "Any" && rpDynamicsStr !== "none") worldData += "\n- Group/Roleplay Dynamics: " + rpDynamicsStr;
                parts.push(worldData);

                parts.push("PLAYER DATA (The User):\n- Player Name: " + pName + "\n- Player Role/Background: " + pRole);
                parts.push("NPC CAST SHEET:\n" + npcsText);
                parts.push("SCENARIO INSTRUCTIONS:\n- Plot Hook / Situation: " + scenarioNotes + "\n\n" + lengthInstruction);
                parts.push("TASK:\nGenerate a structured scenario document divided into exactly two blocks using the separator string \"=== ROLEPLAY_STARTER_SEPARATOR ===\".\n\nBefore the separator, output the SCENARIO SHEET containing:\n1. **World Expansion**: 2-3 sentences expanding on the setting specifics for this scene.\n2. **Character Sheet Details**: A concise summary of each NPC's hidden motivations, initial attitude towards the Player, and their relationships.\n3. **Plot Setup & Objective**: What is the immediate conflict, and what is the group's goal?\n\nAfter the separator, output the ROLEPLAY STARTER POST:\n- Set the scene at the very beginning of the action. Describe the immediate surroundings, sensory details (sounds, weather, light), and character actions.\n- End the starter post with an action, dialogue, or event from one of the NPCs that directly prompts the Player to speak or act, creating a natural hook.\n\nRespond using the separator \"=== ROLEPLAY_STARTER_SEPARATOR ===\" between the Scenario Sheet and the Starter Post. Output nothing else.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        npcBackgroundGeneration: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let setting = (window.root && window.root.setting) || "";
                let tonesStr = (window.root && window.root.tonesStr) || "";
                let themes = (window.root && window.root.themes) || "";
                let existingNpcsText = (window.root && window.root.existingNpcsText) || "";
                let notes = (window.root && window.root.notes) || "";
                return window.prompts.roleplayPage.npcBackgroundGeneration.compile(worldName, worldLore, setting, tonesStr, themes, existingNpcsText, notes);
            }),
            compile: function (worldName, worldLore, setting, tonesStr, themes, existingNpcsText, notes) {
                let prompt = `Generate 3 to 5 background / secondary NPC descriptions fitting the world.
World Name: ${worldName}
Lore: ${worldLore}
Setting Genre: ${setting}
Tones: ${tonesStr}
Themes: ${themes}`;

                if (existingNpcsText && existingNpcsText.trim()) {
                    prompt += `\n\nExisting Main NPC Cast (DO NOT duplicate): ${existingNpcsText}`;
                }
                if (notes && notes.trim()) {
                    prompt += `\n\nSpecific Notes / Guidance: ${notes}`;
                }

                prompt += `\n\nSTRICT FORMATTING RULE:
Respond ONLY with a bulleted list where each line follows this exact format:
- character_name = details about the character (appearance, personality, role in story in a single line)

Example:
- captain_kell = A scarred city watch guard with a missing eye who accepts bribes to look the other way.
- elena_the_weaver = A soft-spoken apothecary with stained fingers who sells rare antitoxins.

Do not include introductory text, titles, or concluding remarks. Do not use the em-dash (—) symbol anywhere. Output raw single-line entries matching the format.`;
                return prompt;
            }
        }
    };
})();

