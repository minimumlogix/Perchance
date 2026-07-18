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
                parts.push("TASK:\nGenerate a structured scenario document divided into exactly two blocks using the separator string \"=== ROLEPLAY_STARTER_SEPARATOR ===\".\n\nBefore the separator, output the SCENARIO SHEET containing:\n1. **World Expansion**: 2-3 sentences expanding on the setting specifics for this scene.\n2. **Character Sheet Details**: A concise summary of each NPC's hidden motivations, initial attitude towards the Player, and their relationships.\n3. **Plot Setup & Objective**: What is the immediate conflict, and what is the group's goal?\n\nAfter the separator, output the ROLEPLAY STARTER POST:\n- Set the scene at the very beginning of the action. Describe the immediate surroundings, sensory details (sounds, weather, light), and character actions.\n- End the starter post with an action, dialogue, or event from one of the NPCs that directly prompts the Player to speak or act, creating a natural hook.\n\nRespond using the separator \"=== ROLEPLAY_STARTER_SEPARATOR ===\" between the Scenario Sheet and the Starter Post. Output nothing else.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        }
    };
})();
