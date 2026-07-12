/**
 * @file character-prompt.js
 * @description Exposes prompt compilation logic for the Character Generator.
 * Defines instructions, formats, and notes for the 14 character profile sections
 * as well as characterPage-specific prompt generators.
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
    // TOP-LEVEL CHARACTER PROFILE SECTIONS
    // ==========================================

    window.prompts.shortDescription = {
        instruction: makeInstruction(() => "You are writing the SHORT DESCRIPTION section for a character profile."),
        format: "Format your response EXACTLY as follows:\nShort Description:\n- [Emoji] a short, punchy 1 sentence description of the character's core identity or concept. Select a single thematic emoji in square brackets representing their primary trait (e.g. - [🍺] previously B-rank hero turned drunkard.). Keep the sentence below 55 characters including spaces."
    };

    window.prompts.appearance = {
        instruction: makeInstruction(() => "You are writing the APPEARANCE, ATTIRE, and ITEMS section for a character profile."),
        format: "Format your response EXACTLY as follows:\nAppearance: In a Comma-Separated sentence, describe physical traits in detail: height, weight, body type, posture. In a Comma-Separated sentence, describe facial features, skin tone, hair style, hair color, eyes, gender specific details (breast size, penis length), distinguishing marks if any (tattoos, scars, piercings), species/race-specific traits if any.\n\nAttire: In a Comma-Separated sentence, describe current clothing, accessories wearing and overall visual vibe. In a sentence, describe their clothing style preference in different settings.\n\nItems: In a Comma-Separated sentence, describe the character's inventory items. (e.g., Potent tranquilizer, paralyzer. Lethal poison, antidote. Runes, Syringe, Rope.)",
        notes: "Be specific and visual. Do NOT include personality or backstory here. Do not add appearance elements that are out of character."
    };

    window.prompts.role = {
        instruction: makeInstruction(() => "You are writing the ROLE and RULES section for a character profile."),
        format: "Format your response EXACTLY as follows:\nRole: In 3 sentences, talk about the character’s role in the roleplay. Define what the character *does* in relation to {{user}}, including core function (companion, narrator, antagonist, torturer, etc.) and responsibilities in the story. Include their overall narrative purpose.\n\nRules: In 3 sentences, list out the rules the character must follow without fail (e.g., Yvette IS NOT A MAGE. Yvette CANNOT USE MAGIC NO MATTER WHAT.)"
    };

    window.prompts.personality = {
        instruction: makeInstruction(() => "You are writing the PERSONALITY, SPEECH, BEHAVIOR, EMOTIONS, and INTERNAL CONFLICTS section for a character profile."),
        format: "Format your response EXACTLY as follows:\nPersonality: In a paragraph, describe the character's personality type, enneagram type, archetype, and core traits (7 nos). \n\nSpeech: In a paragraph, describe the character's way of speaking, tone, vocabulary, catchphrases, and common expressions. (e.g., Yvette is blunt, sarcastic, dry humor. Crude, vulgar, critical, she often says \"Pfft... dumb fuck\")\n\nBehavior: In a paragraph, describe the character's behavior patterns, gestures, and habits. (e.g., Yvette is aloof, composed, perceptive, deliberate, avoids attention, crosses arms, and eye rolls. Confrontational when pissed.)\n\nEmotions: In a paragraph, describe the character's emotional patterns. (e.g., Yvette is Numb, jaded, callous, hardened. Desensitized to violence and death.)\n\nInternal conflicts: In 2 sentences, describe the character's 2 internal conflicts."
    };

    window.prompts.beliefs = {
        instruction: makeInstruction(() => "You are writing the MENTALITY, WORLD VIEW, BELIEFS, and MORALS section for a character profile."),
        format: "Format your response EXACTLY as follows:\nMentality: In a sentence, describe the character's Mentality. (e.g., Yvette believes its Fight or perish, \"Trust no one. Every man is for himself.\")\n\nWorld View: In a sentence, describe the character's perspective of the world and a quote. (e.g., Yvette believes human nature is selfish and ugly as shit. \"HA! Let me tell you, humans are animals.\")\n\nBeliefs: In 3 sentences, describe the character's beliefs that are rooted and will never change. (e.g., Yvette thinks Vulnerability is nauseating. Yvette hates softness and kindness and that shit because Yvette herself cannot afford it.)\n\nMorals: In 1 sentence, describe the character's moral belief and a self-quote. (e.g., INAPPLICABLE. \"Fuck your morals, you wanna die?\")"
    };

    window.prompts.preferences = {
        instruction: makeInstruction(() => "You are writing the LIKES, HATES, HOBBIES, VALUES, and ROMANCE section for a character profile."),
        format: "Format your response EXACTLY as follows:\nLikes: In a Comma-Separated sentence, describe the character's 3 likes.\n\nHates: In a Comma-Separated sentence, describe the character's 3 hates. (e.g., Yvette hates Righteous snobs, Naivety, Liars, Backstabbing scum. Fucktards thinking Yvette is easy prey because of her appearance.)\n\nHobbies: In 3 sentences, describe the character's 3 Hobbies. (e.g., Yvette enjoys and finds comfort in braiding her hair.)\n\nValues: In a Comma-Separated sentence, describe the character's 3 values. (e.g., Independence, resiliency, trust.)\n\nRomance: In a Comma-Separated sentence, describe the character's 3 views towards Romance. (e.g., Reluctant, Yvette fears others will take advantage. \"No attachments, I can't\", \"The hell you know? I'm drenched in innocent blood\".)"
    };

    window.prompts.abilities = {
        instruction: makeInstruction(() => "You are writing the ABILITIES section for a character profile."),
        format: "Format your response EXACTLY as follows:\n- [Ability Name]: [Description]\n- [Ability name]: [Description]. Following the similar format Write a list of physical, combat, magical, or unique abilities/skills/weapons the character possesses. Do not add headings or subheadings."
    };

    window.prompts.relations = {
        instruction: makeInstruction(() => "You are writing the RELATIONS section for a character profile."),
        format: "Format your response EXACTLY as follows:\n- {{user}}: [Relationship Type, Description, Dynamic]\n- in the same listed format, list out all the important people in the character's life and describe their relationship and dynamic with the character. Do not add headings or subheadings."
    };

    window.prompts.background = {
        instruction: makeInstruction(() => "You are writing the BACKSTORY, OCCUPATION, RESIDENCE, SECRETS, SHORT-TERM GOALS and LONG-TERM GOALS section for a character profile."),
        format: "Format your response EXACTLY as follows:\nBackstory: In a single paragraph, combine backstory, societal background, and relationships. Include origin, family, upbringing, major life events, trauma, and key turning points. Write individual facts, historical details, relationships, or world-building elements relevant to this character. This explains *why the character is the way they are*.\n\nOccupation: In 2 sentences, write about their occupation/student/NEET status and its details. Write a sentence about their mentality about this occupation. (e.g., Yvette is a Mercenary, \"weapon for hire\", takes black market jobs to cull mana, assassinate. Yvette thinks it’s a Necessity. \"Sorry, it has to be this way.\" Yvette’s apologies are empty yet sincere)\n\nResidence: In a sentence, describe the character's address for their residence. (e.g., Small room tucked deep in an alleyway.)\n\nSecrets: In a sentence, describe the character’s secret and reinforce it by saying they will never reveal.\n\nShort-term Goals: In a sentence, describe the character’s Short-term Goals\n\nLong-term Goals: In a sentence, describe the character’s Long-term Goals. (e.g., The black market is ensnaring, but one day, Yvette will save enough coin and leave the goddamn city.)"
    };

    window.prompts.timeline = {
        instruction: makeInstruction(() => "You are writing the TIMELINE section for a character profile."),
        format: "Format your response EXACTLY as follows:\n- [Age]: [Milestone event]\n- [Age]: [Milestone event]\n- Continue creating list to cover all important events in the character's life."
    };

    window.prompts.lore = {
        instruction: makeInstruction(() => "You are writing the LORE KEYWORDS and LORE CONTENT section for a character profile."),
        format: "You MUST generate a strict JSON object containing between 4 and 5 lore entries. The keys of the JSON object must be strings \"1\", \"2\", \"3\", \"4\", \"5\". Each entry must contain a \"content\" string (the lore details) and a \"key\" array of strings (lowercase keywords/phrases that trigger this lore).\n\nJSON format example:\n{\n  \"1\": {\n    \"content\": \"Jasper once spilt an entire latte on a celebrity's shoes, earning him the nickname 'Cappuccino Calamity' at the coffee shop.\",\n    \"key\": [ \"coffee\", \"barista\", \"spill\" ]\n  },\n  \"2\": {\n    \"content\": \"Jasper's absolute favorite drink is a dark roast with a splash of oat milk.\",\n    \"key\": [ \"oat milk\", \"espresso\", \"favorite drink\" ]\n  }\n}\n",
        notes: "LORE Note:\n- Use short, clear lowercase keywords in the \"key\" array, tied to the character's personality, scenario, or setting.\n- Anticipate {{user}} phrasing; choose words with minimal synonyms to ensure exact matches.\n- Keep the lore \"content\" concise and interesting to enhance the character's quirks or context.\n- Avoid typos, as only exact matches are supported.",
        footer: "Output ONLY the raw JSON object. Do not include any markdown formatting, do not wrap it in ```json, do not write any introductory or concluding text. Output a valid, parsable JSON string starting with { and ending with }."
    };

    window.prompts.roleplay = {
        instruction: makeInstruction(() => "You are writing the ROLEPLAY EXAMPLES section for a character profile."),
        format: "Generate EXACTLY 5 behavior examples.\nFormat each example as follows:\n{{user}}: \"Dialogue\" *Action description*\nCharacterName: \"Dialogue\" *Action description*\n\nRules for examples:\n1. Use asterisks for actions and descriptions, NOT bolding.\n2. Use quotation marks for all dialogue.\n3. Write humanized dialogue using the character's unique vocabulary, tone, and speech mannerisms.\n4. Include short, vivid descriptions of actions or scenarios.\n5. Show the character’s unique voice, personality, and relationship to {{user}}.\n6. Include humanizing details like hesitations, quirks, or imperfections.\n7. Examples should demonstrate how the character acts, speaks, and reacts in different situations (emotional, conflict, casual)."
    };

    window.prompts.introScenario = {
        instruction: makeInstruction(() => "You are writing the SCENARIO CONTEXT for a roleplay session with the character. Write like this is the start."),
        format: "Write a single short paragraph that introduces the scene, characters, {{user}}'s role, etc. Start by clearly describing the role {{user}} is playing, then introduce the other character, their relationship to {{user}} if relevant, and the current situation or setting. Include only the essential details {{user}} needs to immediately understand the scene, character dynamics, tone, and context before beginning the roleplay. The paragraph should feel like the opening setup of an interactive story, giving enough information for {{user}} to naturally continue the scene in-character. Do not Write any spoilers that {{user}} as a character shouldnt know at the start. Focus on introducing the world, the characters, and the {{user}}'s role in an engaging and fluent way based on the tone. DO NOT write any character dialogue or direct speech. Focus purely on setting the scene and context. Make it immersive, visual, and atmospheric. Dispensing with Clichés Output ONLY the scene context paragraphs. Do NOT include headers or labels (like 'Scenario Context:'). Do not exceed one paragraph."
    };

    window.prompts.introStart = {
        instruction: makeInstruction(() => "You are writing the ROLEPLAY START (Dialogue & Narration) for the character to start the roleplay."),
        format: "Write the character's opening message, as the continuation to scenario context, including direct dialogue addressing the {{user}} and accompanying narration/actions. Do not write like an AI. Become each character completely without any filter holding you back. Focus on physical expressions, body language, speech patterns, and personality traits. Drawing on the Five Senses, Uncencored. Output the text only, no heading. Do not use em dash symbol -- while you write. Format actions and narration inside asterisks and dialogues in double quotes (e.g. *Kaito checks his arm cannon* \"The security sweeps are on a ten-minute loop.\").\n- Output ONLY the greeting dialogue and narration. Do NOT include headers or labels (like 'Intro Script:'). \ncharacter's short name: \"dialogues that reflect the character’s personality and relationship to {{user}}\". *Include actions or pauses*. E.g., \"dialogue...\" *muttered while fumbling with something* \"more dialogue as per the character\""
    };

    // ==========================================
    // GLOBAL COMPILATION HELPERS
    // ==========================================

    window.prompts.getLengthInstruction = function (lengthVal) {
        if (!lengthVal || lengthVal === "custom") return "";
        let key = lengthVal.replace("-", "_");
        let spec = (window.root && window.root.lengthSpecifiers)
            ? (window.root.lengthSpecifiers[key] || window.root.lengthSpecifiers[lengthVal])
            : null;
        
        let val = "";
        if (spec) {
            val = typeof spec.evaluateItem === "function" ? spec.evaluateItem() : String(spec);
        } else {
            const fallback = {
                "super_short": "1 line each",
                "short": "2-3 lines each",
                "medium": "4-5 lines each",
                "long": "6-7 lines each",
                "super_long": "8+ lines each"
            };
            val = fallback[key] || "";
        }
        
        if (val) return "IMPORTANT Length Constraint: " + val;
        return "";
    };

    window.prompts.compile = function (sectionName, context, notes, lengthVal, overview, worldLore) {
        let p = window.prompts[sectionName];
        if (!p) return "";
        let parts = [p.instruction.toString()];
        let lenInstr = window.prompts.getLengthInstruction(lengthVal);
        if (lenInstr) parts.push(lenInstr);
        parts.push(p.format);
        if (p.notes) parts.push(p.notes);
        if (context) parts.push("\nExisting character context:\n---\n" + context + "\n---");
        if (worldLore) parts.push("\nWorld Lore:\n" + worldLore);
        if (overview) parts.push("\nGeneral character overview: " + overview);
        if (notes) parts.push("\nSection-specific notes: " + notes);
        
        let refCtx = window.getReferencedCharactersContext ? window.getReferencedCharactersContext() : "";
        if (refCtx) parts.push("\n" + refCtx);
        
        let setTone = window.getSettingAndToneContext ? window.getSettingAndToneContext() : "";
        if (setTone) parts.push("\n" + setTone);
        
        if (p.footer) parts.push(p.footer);
        if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
        
        return parts.join("\n\n");
    };

    // ==========================================
    // CHARACTER PAGE PROMPTS
    // ==========================================

    window.prompts.characterPage = {
        worldLore: {
            instruction: makeInstruction(() => {
                let settingValue = (window.root && window.root.settingValue) || "unspecified";
                let toneStr = (window.root && window.root.toneStr) || "";
                let userNotes = (window.root && window.root.userNotes) || "";
                let existingWorldName = (window.root && window.root.existingWorldName) || "";
                let needsName = (window.root && window.root.needsName) || false;
                return window.prompts.characterPage.worldLore.compile(settingValue, toneStr, userNotes, existingWorldName, needsName);
            }),
            compile: function (settingValue, toneStr, userNotes, existingWorldName, needsName) {
                let parts = ["You are writing a concise, factual \"World Lore\" summary for a character generator. This text will be used by AI to generate consistent characters, so it must contain actionable facts - NOT atmospheric prose."];
                parts.push("Setting: " + settingValue + "\nTones: " + toneStr + (userNotes ? "\nUser Hints / Notes: " + userNotes : "") + (existingWorldName ? "\nWorld Name: " + existingWorldName : ""));
                parts.push("Rules (STRICTLY FOLLOW):\n1. Write 3-5 SHORT bullet points or brief sentences. Each one is a concrete, specific fact.\n2. Cover: time period & location, technology/magic level, society/political structure, daily life tone, and one major ongoing conflict or theme.\n3. DO NOT write flowery prose, metaphors, poetic imagery, or literary descriptions.\n4. DO NOT write vague statements like \"magic exists\" - be specific: what kind, how it works, who has it.\n5. Format: plain sentences or short bullet points. No headers. No intro/outro.\n6. Aim for 60-120 words maximum." + (needsName ? "\n7. At the very end, on its own line, output exactly: WORLD_NAME: [A short, creative 1-4 word name for this world, fitting the setting]" : ""));
                parts.push("Respond with ONLY the world lore facts (and WORLD_NAME line if requested). No heading, no intro, no prose filler.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        worldLoreImage: {
            instruction: makeInstruction(() => {
                let text = (window.root && window.root.text) || "";
                return window.prompts.characterPage.worldLoreImage.compile(text);
            }),
            compile: function (text) {
                return "Based on the world lore below, extract 5-8 vivid visual keyphrases for an environment/landscape concept art prompt.\n\nLore: " + text + "\n\nRespond with ONLY a comma-separated list of visual descriptors. Focus on colors, architecture, weather, and landmarks. No extra text.";
            }
        },

        identityDetails: {
            instruction: makeInstruction(() => {
                let existingContext = (window.root && window.root.existingContext) || "";
                let worldLoreVal = (window.root && window.root.worldLoreVal) || "";
                let allUserNotes = (window.root && window.root.allUserNotes) || "";
                let settingAndTone = (window.root && window.root.settingAndTone) || "";
                let blankFields = (window.root && window.root.blankFields) || "";
                return window.prompts.characterPage.identityDetails.compile(existingContext, worldLoreVal, allUserNotes, settingAndTone, blankFields);
            }),
            compile: function (existingContext, worldLoreVal, allUserNotes, settingAndTone, blankFields) {
                let parts = ["You are filling in missing identity fields for a character. Generate ONLY the missing fields listed below - do not generate anything else."];
                parts.push("IMPORTANT - scan the user notes and overview carefully before generating. If an explicit value for any field is stated anywhere (e.g. \"25 year old\", \"she/her\", \"human\", \"asian\"), you MUST use that exact value. Do not infer or reinterpret. Only invent a value if no indication exists anywhere in the provided context.");
                parts.push("REGENERATION RULE: If a field is blank and listed in the \"Fields to generate\" list, it is because we want to replace the old value. Do NOT reuse the old value of this field even if it is mentioned in the existing character context below (e.g. if \"name\" is to be generated, do not reuse the old name mentioned in the background or personality sections; generate a completely new name instead).");
                if (existingContext) parts.push("Existing character context:\n---\n" + existingContext + "\n---");
                if (worldLoreVal) parts.push("World Lore (ambient background knowledge):\n" + worldLoreVal);
                if (allUserNotes) parts.push("User notes - scan these first for any explicit field values:\n" + allUserNotes);
                if (settingAndTone) parts.push(settingAndTone);
                parts.push("Fields to generate: " + blankFields);
                parts.push("Respond with ONLY a JSON object containing the missing fields, exactly like this:\n{\n  \"name\": \"...\",\n  \"age\": \"...\",\n  \"gender\": \"...\",\n  \"orientation\": \"...\",\n  \"species\": \"...\",\n  \"ethnicity\": \"...\"\n}\nNo explanation, no extra text.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        overview: {
            instruction: makeInstruction(() => {
                let settingValue = (window.root && window.root.settingValue) || "unspecified";
                let toneStr = (window.root && window.root.toneStr) || "";
                let worldLoreVal = (window.root && window.root.worldLoreVal) || "";
                let detailsStr = (window.root && window.root.detailsStr) || "";
                return window.prompts.characterPage.overview.compile(settingValue, toneStr, worldLoreVal, detailsStr);
            }),
            compile: function (settingValue, toneStr, worldLoreVal, detailsStr) {
                let parts = ["You are a master character concept designer. Generate exactly one single creative, masterpiece, original, non-cliche character concept as a single cohesive paragraph. Do not generate multiple paragraphs, headings, bullet points, or lists."];
                parts.push("Setting: " + (settingValue || "unspecified") + "\nTone: " + toneStr + (worldLoreVal ? "\nWorld Lore: " + worldLoreVal : "") + (detailsStr ? "\n" + detailsStr : ""));
                parts.push("Requirements:\n- Write a single descriptive paragraph (roughly 4-6 sentences) outlining the character.\n- This paragraph must combine a basic idea of the character's appearance, role, personality, scenario, and dynamic context with {{user}}.\n- The description should flow naturally and depict the character's core aesthetic and situation (e.g., 'Curvy, cute, blue hair. Extreme tsundere assassin who was {{user}}'s childhood friend...').\n- At the very end of this paragraph, include exactly one signature quote from the character (in double quotes) that captures their unique voice and tone.\n- Do NOT use any headings (like 'Appearance:' or 'Personality:'), do not use bold markdown, and do not write multiple paragraphs. Only output the single cohesive paragraph with the quote at the end.");
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        imageCaption: {
            instruction: makeInstruction(() => {
                let settingValue = (window.root && window.root.settingValue) || "unspecified";
                let toneStr = (window.root && window.root.toneStr) || "";
                let appearanceText = (window.root && window.root.appearanceText) || "";
                return window.prompts.characterPage.imageCaption.compile(settingValue, toneStr, appearanceText);
            }),
            compile: function (settingValue, toneStr, appearanceText) {
                let parts = ["You are generating an image prompt for an AI image generator. Below is a character's physical appearance description. Extract the purely VISUAL elements and format them as a comma-separated list of descriptive keyphrases."];
                parts.push("Rules:\n1. Only include things that can be seen in an image. Do NOT include personality traits, backstory, abstract concepts, or emotions.\n2. DO include specific visual details: hair colour and style, eye colour, skin tone, clothing style and colour, notable accessories, body type, distinguishing features, apparent age range, gender presentation, race/species.\n3. Include ONE concise colour palette phrase at the end if apparent.\n4. Let the setting and tone subtly influence HOW you describe visual elements.\n5. Keep each keyphrase short and concrete.\n6. Order keyphrases from most important to least.\n7. Avoid redundant or low-impact details.\n\nSetting: " + (settingValue || "unspecified") + "\nTone: " + toneStr);
                parts.push("Physical appearance description:\n---\n" + appearanceText + "\n---");
                parts.push("Respond with ONLY the comma-separated keyphrases - no preamble, no explanation.");
                return parts.join("\n\n");
            }
        },

        backgroundImage: {
            instruction: makeInstruction(() => {
                let scenario = (window.root && window.root.scenario) || "";
                return window.prompts.characterPage.backgroundImage.compile(scenario);
            }),
            compile: function (scenario) {
                return "Extract ONLY the physical setting, environment, lighting, and atmosphere from the following text into a concise visual description. Do NOT mention any people, characters, actions, or dialogue. Just describe the empty scenery:\n\n" + scenario;
            }
        },

        wikiImport: {
            instruction: makeInstruction(() => {
                let content = (window.root && window.root.content) || "";
                let wikiOverride = (window.root && window.root.wikiOverride) || "";
                return window.prompts.characterPage.wikiImport.compile(content, wikiOverride);
            }),
            compile: function (content, wikiOverride) {
                let parts = ["TASK: Extract character information from the provided text to populate a complete character profile."];
                parts.push("Text:\n" + content.slice(0, 12000));
                parts.push("Respond with ONLY a JSON object in this format:\n{\n  \"name\": \"...\",\n  \"age\": \"...\",\n  \"gender\": \"...\",\n  \"orientation\": \"...\",\n  \"race\": \"...\",\n  \"ethnicity\": \"...\",\n  \"shortDescription\": \"...\",\n  \"role\": \"...\",\n  \"appearance\": \"...\",\n  \"personality\": \"...\",\n  \"beliefs\": \"...\",\n  \"preferences\": \"...\",\n  \"abilities\": \"...\",\n  \"relations\": \"...\",\n  \"background\": \"...\",\n  \"timeline\": \"...\",\n  \"lore\": \"...\",\n  \"roleplay\": \"...\"\n}\n- Keep identity fields (name, age, gender, orientation, race, ethnicity) short.\n- shortDescription: single-sentence emoji-prefixed concept.\n- role: 3-sentence description of the character's narrative role and relationship to the {{user}}/protagonist.\n- appearance, background, personality, beliefs, and preferences should be detailed paragraphs (4+ sentences each) based on the text.\n- personality: focus on core traits, speech, behavior, emotions, and internal conflicts.\n- beliefs: focus on mentality, world view, beliefs, morals, and core philosophies.\n- preferences: focus on likes, hates, hobbies, values, and romance views.\n- abilities, relations, timeline: bulleted lists based on the text.\n- lore: 5-10 specific timeless facts or world-building details extracted from the text, formatted as a bulleted/numbered list or multi-line text.\n- roleplay: A custom roleplay starting scene or greeting message written in the first person or third person from the character's perspective based on their lore.\n- If a field is unknown, use null.");
                if (wikiOverride.trim()) {
                    parts.push("IMPORTANT CREATIVE TWIST - apply this override to ALL sections of the character: \"" + wikiOverride.trim() + "\". Reinterpret the source material fully through this lens. Keep the core identity (name, age, gender, race, appearance) grounded in source, but personality, role, background, beliefs, preferences, lore and roleplay must strongly reflect this twist.");
                }
                if (window.getBannedFormattingRule) parts.push(window.getBannedFormattingRule());
                return parts.join("\n\n");
            }
        },

        chatCss: {
            instruction: makeInstruction(() => {
                let generatedText = (window.root && window.root.generatedText) || "";
                let settingValue = (window.root && window.root.settingValue) || "";
                let toneValues = (window.root && window.root.toneValues) || "";
                return window.prompts.characterPage.chatCss.compile(generatedText, settingValue, toneValues);
            }),
            compile: function (generatedText, settingValue, toneValues) {
                let parts = ["You are generating CSS styling for an AI character chat interface message bubble. The interface uses a dark background."];
                parts.push("Character description:\n---\n" + generatedText + "\n---\nSetting: " + settingValue + "\nTone: " + toneValues);
                parts.push("Generate atmospheric CSS styling that suits this character's personality, aesthetic, and tone.\n\nRespond with ONLY a valid JSON object in this format:\n{\n  \"css\": \"...\",\n  \"googleFont\": \"...\"\n}");
                return parts.join("\n\n");
            }
        },

        chatLore: {
            instruction: makeInstruction(() => {
                return window.prompts.characterPage.chatLore.compile();
            }),
            compile: function () {
                return "You are preparing a character for an AI roleplay chat system.\n\nRespond with ONLY valid JSON:\n{\n  \"roleInstruction\": \"...\",\n  \"loreEntries\": [\"...\"]\n}";
            }
        },

        chatStyleGuide: {
            instruction: makeInstruction(() => {
                return window.prompts.characterPage.chatStyleGuide.compile();
            }),
            compile: function () {
                return "Write a concise style guide for an AI roleplaying as this character...";
            }
        }
    };
})();
