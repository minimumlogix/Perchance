/**
 * @file world-prompt.js
 * @description Exposes prompt compilation logic for the World Generator.
 * Defines section rules, formats, and generators for the world logging page.
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
    // WORLD PAGE PROMPTS
    // ==========================================

    window.prompts.worldPage = {
        sectionGeneration: {
            overview: {
                role: "World Overview, including Setting, Technology, Daily Life, and Secrets",
                rules: "Format your response EXACTLY as follows (Do NOT use markdown bold/italic inside headers/text, output as clean lines/bullets):\n- The Setting : A paragraph covering the core setting, themes, underlying reality, and emotional atmosphere.\n- Technology: A paragraph explaining technology level, infrastructure, and everyday practical life.\n- Daily Life: A paragraph describing lifestyle across different social groups.\n- Secrets: A paragraph revealing truths about the world that are hidden from people living inside it."
            },
            rules: {
                role: "Rules of the world",
                rules: "Format your response EXACTLY as follows:\nList world rules that shape survival, values, economics, culture, conflict, or behavior. Provide a maximum of 5 rules as a clean bulleted list."
            },
            races: {
                role: "Races residing in this world",
                rules: "For each race (fill as per appropriate race count for the setting, e.g. 2-4 major races), write its name followed by description.\nFormat each race EXACTLY as follows:\n- Race_Name: A paragraph describing appearance, origins, culture, social structure, strengths, weaknesses, relationships with others, and role in the world."
            },
            regions: {
                role: "Regions of the world",
                rules: "Provide a list of at least 5 regions.\nFormat each region EXACTLY as follows:\n- Region_Name: A paragraph description of the region's climate, landscape, landmarks, and significance."
            },
            factions: {
                role: "Major Factions shaping global power structures",
                rules: "Provide a list of at least 4 factions.\nFormat each faction EXACTLY as follows:\n- Faction_Name: A paragraph including identity, leadership, goals, one representative quote, and flag/symbol/sign information. Also talk about if its a secret group or publically known."
            },
            bestiary: {
                role: "Bestiary and common animals of the world",
                rules: "Provide at least 4 important creatures/beasts and a list of common animals.\nFormat EXACTLY as follows:\n- Creature_Name: A paragraph describing appearance, habitat, behavior, danger level, ecological role, folklore, and any unusual traits or uses.\n\n- Common animals: a list, as a sentence, comma-separated."
            },
            characters: {
                role: "Important Characters of this world",
                rules: "Provide at least 4 important characters.\nFormat each character EXACTLY as follows:\n- Character_Name: include realistic non-cliché name (grounded in setting/ethnicity; avoid tropes like Elara, Vael, Blackthorn), age, appearance, personality, role, and personal story/goal in one paragraph."
            },
            compile: function (section, wName, wSetting, wTones, wThemes, sectionNotes, lengthInstruction, existingContext) {
                let config = window.prompts.worldPage.sectionGeneration[section];
                if (!config) return "";
                let parts = ["You are an expert world-builder and lore compiler. You are writing the " + section.toUpperCase() + " section for a detailed world log."];
                parts.push("WORLD DETAILS:\n- World Name: " + wName + "\n- Setting Genre: " + wSetting + "\n- Atmospheric Tones: " + wTones + "\n- Core Themes / Keywords: " + wThemes + (sectionNotes && sectionNotes.trim() ? "\n- Section Notes/Directives: " + sectionNotes : ""));
                if (existingContext && existingContext.trim()) {
                    parts.push("EXISTING WORLD LORE & CONTEXT (Ensure your generated " + section.toUpperCase() + " section strictly aligns with, references, and builds logically upon these existing details):\n---\n" + existingContext.trim() + "\n---");
                }
                parts.push("SECTION TARGET:\nCompile the " + config.role + ".");
                parts.push("STRICT RULES:\n" + config.rules + "\n4. DO NOT use the em dash character (—) anywhere in your response. Replace it with a comma, semicolon, colon, or rewrite.\n5. Do not write introductory or concluding prose. Output the section content immediately.\n" + lengthInstruction);
                return parts.join("\n\n");
            }
        },

        bannerImage: {
            instruction: makeInstruction(() => {
                let wName = (window.root && window.root.wName) || "";
                let wSetting = (window.root && window.root.wSetting) || "";
                let wTones = (window.root && window.root.wTones) || "";
                let overviewText = (window.root && window.root.overviewText) || "";
                return window.prompts.worldPage.bannerImage.compile(wName, wSetting, wTones, overviewText);
            }),
            compile: function (wName, wSetting, wTones, overviewText) {
                return "Based on the world setting and overview details below, extract 6-8 visual keyphrases for an environment/landscape concept art prompt.\n\nName: " + (wName || "Unnamed") + "\nSetting: " + wSetting + "\nTones: " + wTones + "\nOverview details: " + overviewText + "\n\nRespond with ONLY a comma-separated list of visual descriptors. Focus on structures, color palette, lighting, climate, and landmarks. No introductory or concluding text.";
            }
        },

        wikiImport: {
            instruction: makeInstruction(() => {
                let content = (window.root && window.root.content) || "";
                let override = (window.root && window.root.override) || "";
                return window.prompts.worldPage.wikiImport.compile(content, override);
            }),
            compile: function (content, override) {
                let parts = ["TASK: Extract world-building and setting details from the provided text to populate a complete world setting profile."];
                parts.push("Text:\n" + content.slice(0, 12000));
                parts.push("Respond with ONLY a JSON object in this format:\n{\n  \"name\": \"...\",\n  \"setting\": \"...\",\n  \"tones\": [\"...\", \"...\"],\n  \"themes\": \"...\",\n  \"overview\": \"...\",\n  \"rules\": \"...\",\n  \"races\": \"...\",\n  \"regions\": \"...\",\n  \"factions\": \"...\",\n  \"bestiary\": \"...\",\n  \"characters\": \"...\"\n}\n- Keep \"name\" and \"setting\" (e.g. Fantasy, Cyberpunk) short.\n- tones: array of tones (choose from: Grounded, Thrilling Action, Dark Gritty, Light-hearted Comedic, Mysterious, Romantic, Erotic, Tragic, Whimsical, Epic, Affectionate, Flirtatious, Sensual).\n- themes: comma-separated core themes.\n- overview, rules, races, regions, factions, bestiary, and characters should be detailed descriptions describing each area based on the text.\n- If a field is unknown, use null.");
                if (override.trim()) {
                    parts.push("IMPORTANT CREATIVE TWIST - apply this override: \"" + override.trim() + "\". Reinterpret the world fully through this lens.");
                }
                parts.push("STRICT FORMATTING RULE: Do NOT use the em dash character (—) anywhere in your response. Replace any em dash with a comma, semicolon, colon, or rewrite.");
                return parts.join("\n\n");
            }
        }
    };
})();
