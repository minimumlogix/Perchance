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
                return window.prompts.roleplayPage.worldLore.compile(name, setting, tonesStr);
            }),
            compile: function (name, setting, tonesStr) {
                return "Write a concise world overview (3-4 sentences maximum) for a roleplay setting.\nWorld Name: " + name + "\nSetting: " + setting + "\nTones: " + tonesStr + "\n\nDo not include titles. Write in a factual, evocative style. Do not use the em-dash (—) character. Output only the lore content.";
            }
        },

        npcGeneration: {
            instruction: makeInstruction(() => {
                let worldName = (window.root && window.root.worldName) || "";
                let worldLore = (window.root && window.root.worldLore) || "";
                let setting = (window.root && window.root.setting) || "";
                return window.prompts.roleplayPage.npcGeneration.compile(worldName, worldLore, setting);
            }),
            compile: function (worldName, worldLore, setting) {
                return `Generate a single creative NPC profile fitting the world described below.
World Name: ${worldName}
Lore: ${worldLore}
Setting Genre: ${setting}

You MUST respond with exactly a JSON object matching this schema:
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
                return window.prompts.roleplayPage.roleplayScenario.compile(worldName, worldLore, setting, tonesStr, themes, pName, pRole, npcsText, scenarioNotes, lengthInstruction, rpDynamicsStr);
            }),
            compile: function (worldName, worldLore, setting, tonesStr, themes, pName, pRole, npcsText, scenarioNotes, lengthInstruction, rpDynamicsStr) {
                let parts = ["You are a creative co-writer and RPG Scenario Designer. You are creating a structured multi-character Roleplay Scenario Sheet and a Starter Message. The {{user}} is the player of this roleplay."];
                
                let worldData = "WORLD DATA:\n- World Name: " + worldName + "\n- World Lore/Setting: " + worldLore + "\n- Setting Genre: " + setting + "\n- Atmospheric Tones: " + tonesStr;
                if (themes) worldData += "\n- Themes/Keywords: " + themes;
                if (rpDynamicsStr && rpDynamicsStr !== "Any" && rpDynamicsStr !== "none") worldData += "\n- Group/Roleplay Dynamics: " + rpDynamicsStr;
                parts.push(worldData);

                parts.push("PLAYER DATA (The User):\n- Player Name: " + pName + "\n- Player Role/Background: " + pRole);
                parts.push("NPC CAST SHEET:\n" + npcsText);
                parts.push("SCENARIO INSTRUCTIONS:\n- Plot Hook / Situation: " + scenarioNotes + "\n\n" + lengthInstruction);
                parts.push("TASK:\nGenerate a structured scenario document divided into exactly two blocks using the separator string \"=== ROLEPLAY_STARTER_SEPARATOR ===\" .\n\nBefore the separator, output the SCENARIO SHEET containing:\n1. **World Expansion**: 2-3 sentences expanding on the setting specifics for this scene.\n2. **Character Sheet Details**: A concise summary of each NPC's hidden motivations, initial attitude towards the Player, and their relationships.\n3. **Plot Setup & Objective**: What is the immediate conflict, and what is the group's goal?\n\nAfter the separator, output the ROLEPLAY STARTER POST:\n- Set the scene at the very beginning of the action. Describe the immediate surroundings, sensory details (sounds, weather, light), and character actions.\n- End the starter post with an action, dialogue, or event from one of the NPCs that directly prompts the Player to speak or act, creating a natural hook.\n\nRespond using the separator \"=== ROLEPLAY_STARTER_SEPARATOR ===\" between the Scenario Sheet and the Starter Post. Output nothing else.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        // ==========================================
        // ROLEPLAY PANEL SECTION GENERATORS
        // ==========================================

        rpTimeline: {
            compile: function (worldName, worldLore, setting, tonesStr, npcsText, notes) {
                let parts = ["You are writing a WORLD & SCENARIO TIMELINE for a multi-character roleplay. This is a chronicle of key historical and biographical events that explain how the world and its characters arrived at their current situation."];
                parts.push("WORLD DATA:\n- World Name: " + worldName + "\n- Setting Genre: " + setting + "\n- Atmospheric Tones: " + tonesStr + "\n- World Lore: " + worldLore);
                parts.push("NPC CAST:\n" + (npcsText || "No NPCs defined yet."));
                if (notes) parts.push("Additional Notes: " + notes);
                parts.push("FORMAT your response EXACTLY as follows:\nTimeline =\n- [Era/Year/Age] = [Key milestone event - what happened and why it matters to the current scenario]\n- [Era/Year/Age] = [Key milestone event]\n- Continue creating a list covering: world-shaping events, each NPC's major life milestones, the event that brought these characters together, and the immediate lead-up to the current situation.\n\nWrite between 8 and 14 timeline entries. Order chronologically from oldest to most recent. Focus on facts that are relevant to the roleplay's current plot.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        rpLore: {
            compile: function (worldName, worldLore, setting, tonesStr, npcsText, notes) {
                let parts = ["You are writing LORE KEYWORD ENTRIES for a multi-character roleplay. These are contextual memory triggers that activate when specific topics are mentioned during the roleplay."];
                parts.push("WORLD DATA:\n- World Name: " + worldName + "\n- Setting Genre: " + setting + "\n- Atmospheric Tones: " + tonesStr + "\n- World Lore: " + worldLore);
                parts.push("NPC CAST:\n" + (npcsText || "No NPCs defined yet."));
                if (notes) parts.push("Additional Notes: " + notes);
                parts.push("You MUST generate a strict JSON object containing between 4 and 5 lore entries. The keys of the JSON object must be strings \"1\", \"2\", \"3\", \"4\", \"5\". Each entry must contain a \"content\" string (the lore details relevant to the roleplay world and characters) and a \"key\" array of strings (lowercase keywords/phrases that trigger this lore).\n\nJSON format example:\n{\n  \"1\": {\n    \"content\": \"The Crimson Pact is a forbidden alliance formed in secret between the three noble houses after the Night of Embers.\",\n    \"key\": [ \"crimson pact\", \"alliance\", \"noble houses\" ]\n  },\n  \"2\": {\n    \"content\": \"Elena was exiled from the Mage's Council after her forbidden spell destroyed the eastern ward.\",\n    \"key\": [ \"elena\", \"exile\", \"mage council\" ]\n  }\n}\n\nLORE RULES:\n- Use short, clear lowercase keywords tied to the world, NPCs, and scenario.\n- Anticipate player phrasing; choose words with minimal synonyms for exact matches.\n- Keep lore content concise and rich in useful roleplay context.\n- Avoid typos — only exact matches are supported.\n\nOutput ONLY the raw JSON object. Do not include any markdown formatting, do not wrap in ```json, do not write any intro or outro text. Output a valid JSON string starting with { and ending with }.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        rpExamples: {
            compile: function (worldName, worldLore, setting, tonesStr, npcsText, userName, userRole, notes) {
                let parts = ["You are writing ROLEPLAY BEHAVIOUR EXAMPLES for a multi-character roleplay scenario. These showcase how the NPC cast speaks, acts, and interacts with the player in-scene."];
                parts.push("WORLD DATA:\n- World Name: " + worldName + "\n- Setting Genre: " + setting + "\n- Atmospheric Tones: " + tonesStr + "\n- World Lore: " + worldLore);
                parts.push("NPC CAST:\n" + (npcsText || "No NPCs defined yet."));
                parts.push("PLAYER:\n- Player Name: " + (userName || "{{user}}") + "\n- Player Role: " + (userRole || "the protagonist"));
                if (notes) parts.push("Additional Notes: " + notes);
                parts.push("FORMAT your response EXACTLY as follows:\nBehaviour Example\n{{user}}: \"Dialogue\" *Action description*\n[NPC Name]: \"Dialogue\" *Action description*\n[Other NPC Name (if applicable)]: \"Dialogue\" *Action description*\n\n{{user}}: \"Dialogue\" *Action description*\n[NPC Name]: \"Dialogue\" *Action description*\n\nWrite 4 to 5 exchanges. Rules:\n1. Use asterisks for actions and descriptions, NOT bolding.\n2. Use quotation marks for all dialogue.\n3. Write authentic, humanized dialogue using each NPC's unique vocabulary, tone, and speech mannerisms.\n4. Show the distinct voices of multiple NPCs — they should feel different from each other.\n5. Reflect the world's tone and atmosphere in every exchange.\n6. The player ({{user}}) starts each exchange.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        rpIntroScenario: {
            compile: function (worldName, worldLore, setting, tonesStr, npcsText, userName, userRole, notes, lengthInstruction) {
                let parts = ["You are writing the SCENARIO CONTEXT for a multi-character roleplay session. This is the opening narrative that sets the scene before the roleplay begins."];
                parts.push("WORLD DATA:\n- World Name: " + worldName + "\n- Setting Genre: " + setting + "\n- Atmospheric Tones: " + tonesStr + "\n- World Lore: " + worldLore);
                parts.push("NPC CAST:\n" + (npcsText || "No NPCs defined yet."));
                parts.push("PLAYER:\n- Player Name: " + (userName || "{{user}}") + "\n- Player Role: " + (userRole || "the protagonist"));
                if (notes) parts.push("Additional Notes / Scene Direction: " + notes);
                if (lengthInstruction) parts.push(lengthInstruction);
                parts.push("Write a single immersive paragraph that introduces: the world and current situation, the player's role, the NPC cast and their relationship to the player, the immediate circumstances that are unfolding. The paragraph should feel like the atmospheric opening of an interactive story — visual, sensory, and engaging. Do NOT write character dialogue. Do NOT include headers or labels. Do NOT use second-person 'you' when referring to the player; describe them by their role. Output ONLY the scenario context paragraph. Do not exceed one paragraph. Do not use em-dashes.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        rpIntroStart: {
            compile: function (worldName, npcsText, userName, userRole, scenarioContext, tonesStr, notes, lengthInstruction) {
                let parts = ["You are writing the ROLEPLAY OPENING MESSAGE (Dialogue & Narration) for a multi-character roleplay. This is the first message that kicks off the roleplay, spoken by the NPC cast."];
                parts.push("World: " + worldName + "\nAtmospheric Tones: " + tonesStr);
                parts.push("NPC CAST:\n" + (npcsText || "No NPCs defined yet."));
                parts.push("PLAYER:\n- Player Name: " + (userName || "{{user}}") + "\n- Player Role: " + (userRole || "the protagonist"));
                if (scenarioContext) parts.push("SCENARIO CONTEXT (this scene takes place in this setting):\n---\n" + scenarioContext + "\n---");
                if (notes) parts.push("Additional Notes / Scene Direction: " + notes);
                if (lengthInstruction) parts.push(lengthInstruction);
                parts.push("Write the opening message continuing from the scenario context. Include narration of the immediate scene and at least one NPC speaking directly to the player. Use asterisks for actions and narration, quotation marks for all dialogue. Format: *Narration and actions in asterisks* [NPC Name]: \"Dialogue here.\" Do not use em-dashes. Output ONLY the opening message text. Do not include any headers or labels.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        }
    };
})();

