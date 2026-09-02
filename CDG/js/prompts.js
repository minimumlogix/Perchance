window.getToneAndSettingInstruction = function () {
    let tonePrompts = window.toneSelector ? window.toneSelector.getSelectedPrompts() : [];
    let settingPrompts = window.worldSettingSelector ? window.worldSettingSelector.getSelectedPrompts() : [];

    let result = "";
    if (tonePrompts.length > 0) {
        result += `\nROLEPLAY TONE: ${tonePrompts.join("; ")}\n`;
    }
    if (settingPrompts.length > 0) {
        result += `\nWORLD SETTING: ${settingPrompts.join("; ")}\n`;
    }
    return result;
};

window.getFantasyCharacterPrompt = function () {
    let customFeaturesEl = document.getElementById("customFeaturesEl");
    let descLengthEl = document.getElementById("descLengthEl");
    let bgCastEl = document.getElementById("bgCastEl");

    let lengthVal = descLengthEl ? descLengthEl.value : "medium";
    let bgCastCount = parseInt(bgCastEl ? bgCastEl.value : "0", 10);
    let lengthSpec = (window.CDGConfig && window.CDGConfig.lengthSpecifiers && window.CDGConfig.lengthSpecifiers[lengthVal]) || "1-2 paragraphs";
    let customFeaturesText = customFeaturesEl ? customFeaturesEl.value.trim() : "";
    let randomRace = (window.root && window.root.race && window.root.race.selectOne) || (window.race && window.race.selectOne) || "Human";
    let seedWordsTip = typeof window.getOptionalSeedWordsTip === "function" ? window.getOptionalSeedWordsTip() : "";
    let toneAndSettingNote = window.getToneAndSettingInstruction();

    let shortNote = lengthVal === "short" ? "IMPORTANT: Keep each section SHORT. No more than 1 paragraph per section. YOUR RESPONSE MUST BE **SHORT**.\n" : "";

    let bgCastTemplate = "";
    if (bgCastCount > 0) {
        let bgItems = [];
        for (let idx = 0; idx < bgCastCount; idx++) {
            bgItems.push(`- <Background NPC #${idx + 1} Name> = <Short description of role and dynamic with main character>`);
        }
        bgCastTemplate = `\n\n---\n\n## Background Cast (NPCs)\n\n${bgItems.join("\n")}`;
    }

    let instruction = `Please create an interesting and creative OC character including name, age, appearance, personality, etc.
Writing Style & Tone:
- Drop the flowery prose and moral filters; write in a raw, grounded style with casual vocabulary, heavy sensory descriptions of touch and scent, and a slow-burn pace that focuses on visceral physical tension and high-stakes longing.
- Sensory Grounding: Anchor descriptions in concrete, tangible details (textures, skin heat, breathing, pulse points, scents like rain, smoke, worn leather, cologne, clean skin) rather than abstract metaphors.
- Avoid Cliches & AI Tropes: Strictly avoid purple prose, poetic fluff, melodrama, and artificially sophisticated/archaic AI vocabulary. Use lean, unpretentious, crisp, descriptive passages that paint the character vividly into the reader's mind.
- Real & Believable: Create a character that genuinely feels real, not cliche or overwrought (this is a character description, not a place for rhetorical questions or fourth wall breaks). Focus on the little grounded details, history, and underlying intention behind design notes.
- Realistic & Non-Cliché Naming: Strictly avoid overused fantasy naming tropes and cliché names (e.g., Elara, Vael, Blackthorn, Zephyr, Lyra). Avoid fancy or overly melodramatic naming. Generate grounded, realistic names—whether unique or common—that naturally fit the character's specific world, setting, culture, and ethnicity. (For example, an Elf should NOT default to Elara or generic trope names).
${shortNote}
${seedWordsTip}
Use this template:
---
Short Description = [emoji] <Maximum 1 sentence, under 55 characters including spaces. start with emoji in square brackets. Summarize the character's core identity or concept only. Do not mention appearance unless it defines the character.>

Name = <full name and optional nickname in quotes (must be non-cliché and realistic, tailored to world, culture, and ethnicity; avoid fantasy tropes like Elara, Vael, or Blackthorn)>
Age = <number or estimate>
Gender = <gender identity>
Race = <one word or phrase describing race/species>
Ethinicity = <ethnicity or cultural origin>
Occupation = <occupation or title>
Father's Name = <father's full name and title if relevant>
Mother's Name = <mother's full name and title if relevant>
Siblings = <siblings' names and details if relevant>

Role = <${lengthSpec} detailed description of the character's role in relation to {{user}}, how they encountered {{user}}, and why their decisions affect {{user}}'s immediate fate>

Rules = <specific behavioral rules, strict boundaries, and roleplay constraints regarding {{user}} and their interactions (e.g. what the character NEVER does or ALWAYS refuses to do)>

Appearance = <${lengthSpec} height, weight, body build, posture, facial features, eyes, hair color and style, skin tone, distinctive markings, tattoos, or jewelry>

Attire = <clothing, uniform, coat, armor, footwear, and off-duty outfits>

Accessories = <weapons, magical items, tools, logbooks, equipment, and personal belongings>

Core Personality = <in-depth summary of core personality traits, dominant strengths, major flaws, and quirks>

Enneagram Type = <enneagram type number and title, e.g. Type 8, The Challenger>

Archetype = <character archetype, e.g. Proud Military Commander>

Communication Style = <speech pattern, tone, military precision or slang, swearing habits, insults, and common catchphrases/quotes>

Behavior = <mannerisms, physical habits, situational awareness, body language when irritated or calm, combat behavior>

Emotions = <emotional disposition, control level, vulnerabilities, triggers, trust pace>

Beliefs = <core philosophies, principles, stance on justice vs mercy, authority>

World View = <philosophical view of the world or society, including a representative quote in double quotes>

Mentality = <decision-making mindset under pressure, including a representative quote in double quotes>

Morals = <moral code and boundaries, including a representative quote in double quotes>

Likes = <favorite activities, drinks, conditions, rivals, strategies>

Dislikes = <pet peeves, hated things, intolerances, behaviors they despise>

Hobbies = <interests, pastimes, collections, weapon maintenance, celestial navigation, reading history>

Values = <core personal and professional values>

Romance = <attitude toward romance, pace, standards, workplace policies, boundaries>

Abilities =
- <Ability 1 Name> = <description of martial, magical, tactical, or physical skill>
- <Ability 2 Name> = <description>
- <Ability 3 Name> = <description>
- <Ability 4 Name> = <description>

Relations =
- {{user}} = <initial stance, relationship, and dynamic toward {{user}}>
- <Related Person 1> = <relation and short context>
- <Related Person 2> = <relation and short context>

Biography = <${lengthSpec} full backstory detailing origins, family expectations, military/life milestones, defining events, and how they encountered {{user}}>

Occupation = <summary of current post, duties, and overall mission focus>

Residence = <living quarters, ship cabin, base, or home location>

Secrets = <hidden truths, past mistakes, secret feelings, guilt, or doubts they will never willingly reveal>

Internal conflicts = <personal dilemmas, emotional struggles, competing priorities>

Short-term Goals = <immediate goals>

Long-term Goals = <ultimate ambitions>${bgCastTemplate}
---

# Design notes:
${toneAndSettingNote}IMPORTANT: ${customFeaturesText || ("The character's race should be " + randomRace)}
${shortNote}`;

    return {
        instruction,
        startWith: "Short Description = ",
        render: function (data) {
            let text = data.text.replace(/(^|\n)([#a-zA-Z/ _'\-0-9]{1,50})(\s*[:=]\s*)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            text = text.replace(/(^|\n)(\s*-\s*)([#a-zA-Z/ _'\-0-9{}\(\)]{1,50})(\s*[:=]\s*)/g, (m, p1, p2, p3, p4) => p1 + p2 + `<b style="color:#13a000">${p3.trim()}</b>` + p4);
            text = text.replace(/(^|\n)(#+[a-zA-Z/ _'\-0-9]{1,50})(\n)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            text = text.replace(/(^|\n)\*\*([a-zA-Z/ _'\-0-9#]{1,50})\*\*(:\s?)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            return text;
        },
        onStart: function (data) {
            if (typeof window.clearOldImageStuff === "function") window.clearOldImageStuff();
        },
        onFinish: async function (data) {
            if (data.stopReason === "user") return;
            let generatedText = data.text;
            let physicalAppearanceText = ((generatedText.match(/(?:Physical Appearance|Appearance)\s*[:=]\s*(.+?)\n\n/s) || [])[1] || "").trim();
            if (!physicalAppearanceText) physicalAppearanceText = ((generatedText.match(/(?:Physical Appearance|Appearance)\s*[:=]\s*(.+?)\n/s) || [])[1] || "").trim();
            window.lastCharacterTextData = { generatedText, physicalAppearanceText };
        }
    };
};

/* ===========================
   2. MULTI CHARACTER SCENARIO PROMPT (2-4 NPCs)
=========================== */

window.getMultiCharacterScenarioPrompt = function () {
    let customFeaturesEl = document.getElementById("customFeaturesEl");
    let descLengthEl = document.getElementById("descLengthEl");
    let mainCastEl = document.getElementById("mainCastEl");
    let bgCastEl = document.getElementById("bgCastEl");

    let mainCastCount = parseInt(mainCastEl ? mainCastEl.value : "2", 10);
    let bgCastCount = parseInt(bgCastEl ? bgCastEl.value : "0", 10);
    let lengthVal = descLengthEl ? descLengthEl.value : "medium";
    let customFeaturesText = customFeaturesEl ? customFeaturesEl.value.trim() : "";
    let randomRace = (window.root && window.root.race && window.root.race.selectOne) || (window.race && window.race.selectOne) || "Human";
    let seedWordsTip = typeof window.getOptionalSeedWordsTip === "function" ? window.getOptionalSeedWordsTip() : "";
    let toneAndSettingNote = window.getToneAndSettingInstruction();

    let shortNote = lengthVal === "short" ? "IMPORTANT: Keep each section SHORT. No more than 1 paragraph per section. YOUR RESPONSE MUST BE **SHORT**.\n" : "";

    let npcBlocks = [];
    for (let i = 1; i <= mainCastCount; i++) {
        npcBlocks.push(`## NPC #${i}: <Full Name>

Role = <Describe the NPC's role within the group, responsibilities, relationship with {{user}}, and why their actions significantly affect {{user}}'s immediate future.>

Details = <Age, Gender, Race>

Appearance = <Describe physique, posture, facial features, eyes, hair, clothing, equipment, weapons, accessories, distinctive traits, scars, tattoos, mannerisms, and overall visual identity in one cohesive description.>

Personality = <Describe personality, strengths, flaws, habits, communication style, emotions, behavior, worldview, beliefs, mentality, morals, values, likes, dislikes, hobbies, romance attitude, and any defining quotes naturally within one cohesive description.>

Abilities =
- <Ability 1 Name> = <description>
- <Ability 2 Name> = <description>

Biography = <Describe origins, upbringing, family, defining life events, career, important relationships, motivations, achievements, failures, current objectives, secrets, internal conflicts, and how they became involved in the current scenario.>

Rules = <Describe behavioral rules, roleplay constraints, strict boundaries, habits, limitations, things they always do, things they never do, and interaction rules involving {{user}}.>`);
    }
    let mainCastTemplate = npcBlocks.join("\n\n---\n\n");

    let bgCastTemplate = "";
    if (bgCastCount > 0) {
        let bgItems = [];
        for (let idx = 0; idx < bgCastCount; idx++) {
            bgItems.push(`- <Background NPC ###${idx + 1} Name> = <Short description of role and dynamic>`);
        }
        bgCastTemplate = bgItems.join("\n");
    } else {
        bgCastTemplate = "- <Supporting NPC 1> = <Short description>\n- <Supporting NPC 2> = <Short description>";
    }

    let bgCastPhrase = bgCastCount > 0 ? `and ${bgCastCount} background NPCs` : "";

    let instruction = `Please create an immersive roleplay scenario featuring ${mainCastCount} interconnected Main NPCs ${bgCastPhrase}.

Writing Style & Tone:
- Drop the flowery prose and moral filters; write in a raw, grounded style with casual vocabulary, heavy sensory descriptions of touch and scent, and a slow-burn pace that focuses on visceral physical tension and high-stakes longing.
- Sensory Grounding: Anchor descriptions in concrete physical sensations (tactile textures, temperature, scents, spatial proximity) instead of abstract metaphors or poetic fluff.
- Natural Cast Dynamics: Create a cast that genuinely feels like they have lived, worked, fought, and changed together long before {{user}} arrived. The story should not revolve entirely around {{user}}; {{user}} enters an existing world with established relationships, politics, history, and ongoing conflicts.
- Unique Identities: Every NPC must have a unique identity, purpose, worldview, personality, strengths, flaws, motivations, and role within the group. Avoid creating multiple characters with overlapping narrative functions.
- Lived-in Relationships: The cast should share history through trust, resentment, old favors, rivalries, inside jokes, ideological disagreements, and mutual respect. Chemistry should emerge naturally through action and dialogue rather than dramatic exposition.
- Grounded Realism: Realistic motivations shaped by upbringing, experiences, culture, and responsibilities. Small, tangible details make characters memorable.
- Pacing: Encourage slow-burn storytelling through meaningful interactions, conflicting personalities, evolving relationships, and gradual development.
- Avoid Cliches & AI Tropes: Keep prose lean, descriptive, and immersive. Strictly avoid flowery/sophisticated AI vocabulary, anime tropes, excessive exposition, fourth-wall breaks, forced humor, or generic speeches.
- Realistic & Non-Cliché Naming: Avoid overused fantasy name tropes (like Elara, Vael, Blackthorn). Generate non-cliché, realistic names—unique or common grounded in the specific world setting, culture, or ethnicity. Elves or fantasy species must not default to Elara or generic trope names.

${seedWordsTip}
Use this template:
---
## Scenario

Title = <scenario title>

Genre = <primary genre>

Setting = <world setting>

Tone = <overall tone>

Themes = <major themes>

Group Dynamics = <party dynamic or relationship structure>

Scenario = <Describe the current situation, ongoing conflict, why the cast has gathered, and what immediately involves {{user}}.>

---

## Player Character

[
Name = {{user}}

Role = <Describe {{user}}'s role within the scenario, background, current objective, reputation, responsibilities, experience level, and why they have become involved.>
]

---

## Main Cast (NPCs)

[
${mainCastTemplate}
]

---

## Background Cast (NPCs)

[
${bgCastTemplate}
]

---

## Organizations

- <Organization 1> = <Description>
- <Organization 2> = <Description>

---

## Important Locations

- <Location 1> = <Description>
- <Location 2> = <Description>

---

## Timeline

- Ancient History = <Important historical event>
- Years Ago = <Major event>
- Months Ago = <Major event>
- Today = <Current starting point>

---

## Roleplay Guidance Prompt

<Provide instructions for how the AI should write this scenario, including narrative style, pacing, dialogue quality, character autonomy, emotional progression, romance pacing if applicable, combat style, scene transitions, and roleplay behavior. Focus on raw, sensory-grounded, slow-burn storytelling that respects each character's established personality, agency, and visceral physical tension.>

---

# Design notes:
${toneAndSettingNote}IMPORTANT: ${customFeaturesText || ("The setting or primary theme should be inspired by " + randomRace)}
${shortNote}`;

    return {
        instruction,
        startWith: "# Scenario\n\nTitle = ",
        render: function (data) {
            let text = data.text.replace(/(^|\n)([#a-zA-Z/ _'\-0-9]{1,50})(\s*[:=]\s*)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            text = text.replace(/(^|\n)(\s*-\s*)([#a-zA-Z/ _'\-0-9{}\(\)]{1,50})(\s*[:=]\s*)/g, (m, p1, p2, p3, p4) => p1 + p2 + `<b style="color:#13a000">${p3.trim()}</b>` + p4);
            text = text.replace(/(^|\n)(#+[a-zA-Z/ _'\-0-9]{1,50})(\n)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            return text;
        },
        onStart: function (data) {
            if (typeof window.clearOldImageStuff === "function") window.clearOldImageStuff();
        },
        onFinish: async function (data) {
            if (data.stopReason === "user") return;
            let generatedText = data.text;
            let physicalAppearanceText = ((generatedText.match(/(?:Appearance)\s*[:=]\s*(.+?)\n/s) || [])[1] || "").trim();
            window.lastCharacterTextData = { generatedText, physicalAppearanceText };
        }
    };
};

/* ===========================
   3. LARGE CAST SCENARIO PROMPT (5+ NPCs)
=========================== */

window.getLargeCastScenarioPrompt = function () {
    let customFeaturesEl = document.getElementById("customFeaturesEl");
    let mainCastEl = document.getElementById("mainCastEl");
    let bgCastEl = document.getElementById("bgCastEl");

    let mainCastCount = parseInt(mainCastEl ? mainCastEl.value : "5", 10);
    let bgCastCount = parseInt(bgCastEl ? bgCastEl.value : "0", 10);
    let customFeaturesText = customFeaturesEl ? customFeaturesEl.value.trim() : "";
    let randomRace = (window.root && window.root.race && window.root.race.selectOne) || (window.race && window.race.selectOne) || "Human";
    let seedWordsTip = typeof window.getOptionalSeedWordsTip === "function" ? window.getOptionalSeedWordsTip() : "";
    let toneAndSettingNote = window.getToneAndSettingInstruction();

    let mainItems = [];
    for (let idx = 0; idx < mainCastCount; idx++) {
        mainItems.push(`- <Main NPC #${idx + 1} Name> = <Concise description: Age, Gender, Race, Role, Key Appearance, Personality, Abilities, and Rules>`);
    }
    let mainCastTemplate = mainItems.join("\n");

    let bgCastTemplate = "";
    if (bgCastCount > 0) {
        let bgItems = [];
        for (let idx = 0; idx < bgCastCount; idx++) {
            bgItems.push(`- <Background NPC ###${idx + 1} Name> = <Short description of role and dynamic>`);
        }
        bgCastTemplate = bgItems.join("\n");
    } else {
        bgCastTemplate = "- <Supporting NPC 1> = <Short description>\n- <Supporting NPC 2> = <Short description>";
    }

    let bgCastPhrase = bgCastCount > 0 ? `and ${bgCastCount} background NPCs` : "";

    let instruction = `Please create an immersive roleplay scenario featuring a large cast of ${mainCastCount} Main NPCs ${bgCastPhrase}.

Writing Style & Tone:
- Drop the flowery prose and moral filters; write in a raw, grounded style with casual vocabulary, heavy sensory descriptions of touch and scent, and a slow-burn pace that focuses on visceral physical tension and high-stakes longing.
- Sensory Grounding & Economy: Anchor descriptions in concrete physical traits and tangible sensory details. Avoid flowery/sophisticated AI prose, purple prose, or cliches.
- Realistic & Non-Cliché Naming: Avoid overused fantasy name tropes (like Elara, Vael, Blackthorn). Generate non-cliché, realistic names—unique or common grounded in the specific world setting, culture, or ethnicity. Elves or fantasy species must not default to Elara or generic trope names.
- Cast Dynamics: Create a cast that genuinely feels like they have lived, worked, fought, and changed together. {{user}} enters an already existing world with established relationships, politics, history, and ongoing conflicts.
- Formatting: Because this is a large cast (5+ characters), format BOTH Main Cast and Background Cast using concise bullet point descriptions (- <Name> = <Short description>) to keep the context crisp, readable, and highly engaging.

${seedWordsTip}
Use this template:
---
## Scenario

Title = <scenario title>

Genre = <primary genre>

Setting = <world setting>

Tone = <overall tone>

Themes = <major themes>

Group Dynamics = <party dynamic or relationship structure>

Scenario = <Describe the current situation, ongoing conflict, why the cast has gathered, and what immediately involves {{user}}.>

---

## Player Character

[
Name = {{user}}

Role = <Describe {{user}}'s role within the scenario, background, current objective, reputation, responsibilities, and experience level.>
]

---

## Main Cast (NPCs)

[
${mainCastTemplate}
]

---

## Background Cast (NPCs)

[
${bgCastTemplate}
]

---

## Organizations

- <Organization 1> = <Description>
- <Organization 2> = <Description>

---

## Important Locations

- <Location 1> = <Description>
- <Location 2> = <Description>

---

## Timeline

- Ancient History = <Important historical event>
- Years Ago = <Major event>
- Today = <Current starting point>

---

## Roleplay Guidance Prompt

<Provide instructions for how the AI should write this scenario, focusing on raw, sensory-grounded, slow-burn storytelling with visceral physical tension and natural character agency.>

---

# Design notes:
${toneAndSettingNote}IMPORTANT: ${customFeaturesText || ("The setting or primary theme should be inspired by " + randomRace)}`;

    return {
        instruction,
        startWith: "# Scenario\n\nTitle = ",
        render: function (data) {
            let text = data.text.replace(/(^|\n)([#a-zA-Z/ _'\-0-9]{1,50})(\s*[:=]\s*)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            text = text.replace(/(^|\n)(\s*-\s*)([#a-zA-Z/ _'\-0-9{}\(\)]{1,50})(\s*[:=]\s*)/g, (m, p1, p2, p3, p4) => p1 + p2 + `<b style="color:#13a000">${p3.trim()}</b>` + p4);
            text = text.replace(/(^|\n)(#+[a-zA-Z/ _'\-0-9]{1,50})(\n)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            return text;
        },
        onStart: function (data) {
            if (typeof window.clearOldImageStuff === "function") window.clearOldImageStuff();
        },
        onFinish: async function (data) {
            if (data.stopReason === "user") return;
            let generatedText = data.text;
            let physicalAppearanceText = ((generatedText.match(/(?:Appearance)\s*[:=]\s*(.+?)\n/s) || [])[1] || "").trim();
            window.lastCharacterTextData = { generatedText, physicalAppearanceText };
        }
    };
};

/* ===========================
   4. COMPACT DETAILED SCENARIO PROMPT
=========================== */

window.getCompactDetailedPrompt = function () {
    let customFeaturesEl = document.getElementById("customFeaturesEl");
    let mainCastEl = document.getElementById("mainCastEl");
    let bgCastEl = document.getElementById("bgCastEl");

    let mainCastCount = parseInt(mainCastEl ? mainCastEl.value : "1", 10);
    let bgCastCount = parseInt(bgCastEl ? bgCastEl.value : "0", 10);
    let customFeaturesText = customFeaturesEl ? customFeaturesEl.value.trim() : "";
    let randomRace = (window.root && window.root.race && window.root.race.selectOne) || (window.race && window.race.selectOne) || "Human";
    let seedWordsTip = typeof window.getOptionalSeedWordsTip === "function" ? window.getOptionalSeedWordsTip() : "";
    let toneAndSettingNote = window.getToneAndSettingInstruction();

    let mainBlocks = [];
    for (let i = 1; i <= mainCastCount; i++) {
        let label = mainCastCount === 1 ? "<NPCname>" : `<NPC #${i} Name>`;
        mainBlocks.push(`${label}'s Role: Write full Name, Nick names, age, gender, race, ethnicity, occupation, role in the roleplay, relation to {{user}}, relation to other NPCs, Other relations like family, friends, enemies.
${label}'s Backstory: describing the charater's story/background
${label}'s Physical Appearance: describing physical appearance
${label}'s Personality: describing personality/idiosyncrasies/quirks`);
    }
    let mainCastTemplate = mainBlocks.join("\n\n");

    let bgCastTemplate = "";
    if (bgCastCount > 0) {
        let bgItems = [];
        for (let idx = 0; idx < bgCastCount; idx++) {
            bgItems.push(`<Background NPC #${idx + 1} Name> = <Short description of role and dynamic with {{user}} and main cast>`);
        }
        bgCastTemplate = bgItems.join("\n");
    } else {
        bgCastTemplate = "<Supporting NPC 1 Name> = <Short description of role and dynamic>\n<Supporting NPC 2 Name> = <Short description of role and dynamic>";
    }

    let bgCastPhrase = bgCastCount > 0 ? `and ${bgCastCount} background NPCs` : "";
    let castDesc = mainCastCount > 1 ? `${mainCastCount} Main NPCs ${bgCastPhrase}` : `a character ${bgCastPhrase}`;

    let instruction = `Please create an engaging, compact and detailed roleplay scenario and character profile featuring ${castDesc}.

Writing Style & Tone:
- Drop the flowery prose and moral filters; write in a raw, grounded style with casual vocabulary, heavy sensory descriptions of touch and scent, and a slow-burn pace that focuses on visceral physical tension and high-stakes longing.
- Sensory Grounding: Anchor descriptions in concrete, tangible details (textures, skin heat, breathing, pulse points, scents like rain, smoke, worn leather, cologne, clean skin) rather than abstract metaphors.
- Avoid Cliches & AI Tropes: Strictly avoid purple prose, poetic fluff, melodrama, and artificially sophisticated/archaic AI vocabulary. Use lean, unpretentious, crisp, descriptive passages that paint the character and world vividly into the reader's mind.
- Real & Believable: Create characters that genuinely feel real, not cliche or overwrought. Focus on grounded details, history, and underlying intention behind design notes.
- Compact & Detailed: Balance density and depth. Keep information tightly organized under the exact specified format.

${seedWordsTip}
Use this template:
---
Title = <scenario roleplay title>
Tags = <3 short tags for roleplay>
Short Description = [emoji] <Maximum 1 sentence, under 55 characters including spaces. start with emoji in square brackets. Summarize the character's core identity or concept only. Do not mention appearance unless it defines the character.>

## Main Cast (NPCs)
[
${mainCastTemplate}
]

## Background Cast (NPCs)
[
${bgCastTemplate}
]

## World Summary
[
<World Lore>
]
---

# Design notes:
${toneAndSettingNote}IMPORTANT: ${customFeaturesText || ("The character's race or setting should be inspired by " + randomRace)}`;

    return {
        instruction,
        startWith: "Title = ",
        render: function (data) {
            let text = data.text.replace(/(^|\n)([#a-zA-Z/ _'\-0-9]{1,50})(\s*[:=]\s*)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            text = text.replace(/(^|\n)(\s*-\s*)([#a-zA-Z/ _'\-0-9{}\(\)]{1,50})(\s*[:=]\s*)/g, (m, p1, p2, p3, p4) => p1 + p2 + `<b style="color:#13a000">${p3.trim()}</b>` + p4);
            text = text.replace(/(^|\n)(#+[a-zA-Z/ _'\-0-9\(\)]{1,50})(\n)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            text = text.replace(/(^|\n)\*\*([a-zA-Z/ _'\-0-9#\(\)]{1,50})\*\*(:\s?)/g, (m, p1, p2, p3) => p1 + `<b style="color:#13a000">${p2.replaceAll("#", "").trim()}</b>` + p3);
            return text;
        },
        onStart: function (data) {
            if (typeof window.clearOldImageStuff === "function") window.clearOldImageStuff();
        },
        onFinish: async function (data) {
            if (data.stopReason === "user") return;
            let generatedText = data.text;
            let physicalAppearanceText = ((generatedText.match(/(?:Physical Appearance|Appearance)\s*[:=]\s*(.+?)(?:\n\n|\n[#A-Za-z]|$)/s) || [])[1] || "").trim();
            if (!physicalAppearanceText) physicalAppearanceText = ((generatedText.match(/(?:'s Physical Appearance|\bAppearance)\s*[:=]\s*(.+?)(?:\n|$)/is) || [])[1] || "").trim();
            window.lastCharacterTextData = { generatedText, physicalAppearanceText };
        }
    };
};

/* ===========================
   5. SCENARIO CONTEXT PROMPT
=========================== */

window.getScenarioPrompt = function () {
    let outputEl = document.getElementById("outputEl");
    let customScenarioFeaturesEl = document.getElementById("customScenarioFeaturesEl");
    let scenarioPerspectiveEl = document.getElementById("scenarioPerspectiveEl");
    let descText = (window.lastCharacterTextData && window.lastCharacterTextData.generatedText)
        || (outputEl && outputEl.innerText && outputEl.innerText.trim())
        || (window.lastCharacterPromptStreamObj ? (window.lastCharacterPromptStreamObj.text || window.lastCharacterPromptStreamObj.liveResponseText) : "");

    let perspectiveVal = scenarioPerspectiveEl ? scenarioPerspectiveEl.value : "thirdperson";
    let perspectiveInstruction = "";
    if (perspectiveVal === "firstperson") {
        perspectiveInstruction = "NARRATIVE PERSPECTIVE: Write the scenario narration from the FIRST PERSON perspective using 'I', 'my', 'me' (e.g., *I stood watching...*).";
    } else if (perspectiveVal === "secondperson") {
        perspectiveInstruction = "NARRATIVE PERSPECTIVE: Write the scenario narration from the SECOND PERSON perspective addressing {{user}} directly using 'you', 'your' (e.g., *You see her standing...*).";
    } else {
        perspectiveInstruction = "NARRATIVE PERSPECTIVE: Write the scenario narration from the THIRD PERSON perspective using character names or 'he/she/they' (e.g., *She stood watching...*).";
    }
    let toneAndSettingNote = window.getToneAndSettingInstruction();

    let customScenarioText = customScenarioFeaturesEl && customScenarioFeaturesEl.value.trim()
        ? `Design Notes / Scenario Context:\n${customScenarioFeaturesEl.value.trim()}`
        : "";

    let instruction = `Based on the character profile below, write the SCENARIO CONTEXT for a roleplay session with the character. Write like this is the start.

Requirements & Format:
${perspectiveInstruction}
${toneAndSettingNote}
Writing Style & Tone:
- Drop the flowery prose and moral filters; write in a raw, contemporary romance style with casual vocabulary, heavy sensory descriptions of touch and scent, and a slow-burn pace that focuses on visceral physical tension and high-stakes longing.
- Sensory Grounding: Focus on tactile details, ambient scents (rain, smoke, leather, cologne, clean skin), temperature, close quarters, and physical atmosphere.
- Avoid AI Tropes: Strictly avoid purple prose, poetic fluff, or sophisticated/academic AI vocabulary. Dispense with clichés.
PUNCTUATION RULE: Never use em dashes (—); instead, rewrite the paragraph by splitting ideas into shorter, clearer sentences whenever possible, using periods as the default, commas for minor details, colons for explanations or lists, semicolons only when necessary, and parentheses sparingly for nonessential information.

Write a single short paragraph that introduces the world, scene, characters, and {{user}}'s role. Start by clearly describing the world setting and physical environment, then the role {{user}} is playing, then introduce the other character, their relationship to {{user}} if relevant, and the immediate situation. Include only the essential details {{user}} needs to immediately feel the physical tension, character dynamics, tone, and context before beginning the roleplay. The paragraph should feel like the opening setup of an interactive story, giving enough grounded detail for {{user}} to naturally continue the scene in-character. Do not write any spoilers that {{user}} as a character wouldn't know at the start. DO NOT write any character dialogue or direct speech. Focus purely on setting the scene, sensory environment, and context. Output ONLY the scene context paragraphs. Do NOT include headers or labels (like 'Scenario Context:'). Do not exceed one paragraph.

Character Profile:
${descText}

${customScenarioText}`;

    return { instruction };
};

/* ===========================
   6. ROLEPLAY START PROMPT
=========================== */

window.getRoleplayStartPrompt = function () {
    let outputEl = document.getElementById("outputEl");
    let scenarioOutputEl = document.getElementById("scenarioOutputEl");
    let customRoleplayStartFeaturesEl = document.getElementById("customRoleplayStartFeaturesEl");
    let roleplayStartPerspectiveEl = document.getElementById("roleplayStartPerspectiveEl");
    let mainCastEl = document.getElementById("mainCastEl");

    let mainCastCount = parseInt(mainCastEl ? mainCastEl.value : "1", 10);
    let defaultPersp = mainCastCount >= 2 ? "thirdperson" : "firstperson";
    let perspectiveVal = roleplayStartPerspectiveEl ? roleplayStartPerspectiveEl.value : defaultPersp;
    let toneAndSettingNote = window.getToneAndSettingInstruction();

    let descText = (window.lastCharacterTextData && window.lastCharacterTextData.generatedText)
        || (outputEl && outputEl.innerText && outputEl.innerText.trim())
        || (window.lastCharacterPromptStreamObj ? (window.lastCharacterPromptStreamObj.text || window.lastCharacterPromptStreamObj.liveResponseText) : "");

    let scenarioText = scenarioOutputEl && scenarioOutputEl.innerText && scenarioOutputEl.innerText.trim()
        ? `Scenario Context:\n${scenarioOutputEl.innerText.trim()}`
        : "";

    let customRoleplayText = customRoleplayStartFeaturesEl && customRoleplayStartFeaturesEl.value.trim()
        ? `Design Notes / Opening Context:\n${customRoleplayStartFeaturesEl.value.trim()}`
        : "";

    let perspectiveInstruction = "";
    if (perspectiveVal === "firstperson") {
        perspectiveInstruction = `NARRATIVE PERSPECTIVE: Write narration and actions in FIRST PERSON from the character's perspective using 'I', 'my', 'me' (e.g. *I saw you standing there alone* "Why the hell are you so early?").`;
    } else if (perspectiveVal === "secondperson") {
        perspectiveInstruction = `NARRATIVE PERSPECTIVE: Write narration in SECOND PERSON addressing {{user}} directly using 'you', 'your' (e.g. *You saw her standing there alone* "Why are you early?").`;
    } else {
        perspectiveInstruction = `NARRATIVE PERSPECTIVE: Write narration and actions in THIRD PERSON using character names or 'he/she/they' (e.g. *She saw you standing there alone* "Why the heck are you so early?").`;
    }

    let multiCastRule = "";
    if (mainCastCount >= 2) {
        multiCastRule = `\nMULTI-CHARACTER FORMATTING RULE:
Since this scenario features multiple characters (${mainCastCount} Main Cast), EVERY line of dialogue and narration MUST start with the specific character's name followed by a colon.

Example format:
Amy: *She saw you standing there alone* "Why the heck are you so early?"
Fio: *she follows Amy with a creepy smile only meant for you* "Thats right loser," *she snickers* "why did you come so early?"\n`;
    }

    let instruction = `Based on the character profile and scenario context below, write the ROLEPLAY START (Dialogue & Narration) for the character to start the roleplay.

Requirements & Format:
${perspectiveInstruction}
${toneAndSettingNote}
${multiCastRule}
Writing Style & Tone:
- Drop the flowery prose and the moral filters; write in a raw, contemporary romance style with casual vocabulary, heavy sensory descriptions of touch and scent, and a slow-burn pace that focuses on visceral physical tension and high-stakes longing.
- Sensory Grounding: Anchor the greeting and narration in concrete physical sensations—touch, skin heat, breathing, pulse points, scents (smoke, rain, cologne, clean skin, leather), and close physical proximity.
- Avoid AI Tropes: Do not write like an AI. Avoid poetic fluff, purple prose, melodramatic cliches, and overly sophisticated vocabulary. Use authentic, casual speech patterns and raw, natural expressions.
- Unfiltered Immersion: Become each character completely without any moral filter holding you back. Focus on genuine physical expressions, body language, speech quirks, and personality traits.
PUNCTUATION RULE: Never use em dashes (—); instead, rewrite the paragraph by splitting ideas into shorter, clearer sentences whenever possible, using periods as the default, commas for minor details, colons for explanations or lists, semicolons only when necessary, and parentheses sparingly for nonessential information.

Write the character's opening message, as the continuation to scenario context, including direct dialogue addressing {{user}} and accompanying narration/actions. Format actions and narration inside asterisks and dialogues in double quotes (e.g. *Kaito leans against the damp brick wall, the faint scent of rain and tobacco clinging to his jacket* "You're late.").
- Output ONLY the greeting dialogue and narration. Do NOT include headers or labels (like 'Intro Script:').

Character Profile:
${descText}

${scenarioText}

${customRoleplayText}`;

    return {
        instruction,
        render: function (data) {
            let text = data.text.replace(/(^|\n)(\{\{(?:user|char)\}\}:?|[a-zA-Z0-9_ -]{1,30}:)/g, (m, p1, p2) => p1 + `<b style="color:#13a000">${p2}</b>`);
            return text;
        }
    };
};

/* ===========================
   7. BEHAVIOR EXAMPLES PROMPT
=========================== */

window.getBehaviorPrompt = function () {
    let outputEl = document.getElementById("outputEl");
    let scenarioOutputEl = document.getElementById("scenarioOutputEl");
    let roleplayStartOutputEl = document.getElementById("roleplayStartOutputEl");
    let customBehaviorFeaturesEl = document.getElementById("customBehaviorFeaturesEl");
    let roleplayStartPerspectiveEl = document.getElementById("roleplayStartPerspectiveEl");
    let mainCastEl = document.getElementById("mainCastEl");

    let mainCastCount = parseInt(mainCastEl ? mainCastEl.value : "1", 10);
    let defaultPersp = mainCastCount >= 2 ? "thirdperson" : "firstperson";
    let perspectiveVal = roleplayStartPerspectiveEl ? roleplayStartPerspectiveEl.value : defaultPersp;

    let descText = (window.lastCharacterTextData && window.lastCharacterTextData.generatedText)
        || (outputEl && outputEl.innerText && outputEl.innerText.trim())
        || (window.lastCharacterPromptStreamObj ? (window.lastCharacterPromptStreamObj.text || window.lastCharacterPromptStreamObj.liveResponseText) : "");

    let scenarioText = scenarioOutputEl && scenarioOutputEl.innerText && scenarioOutputEl.innerText.trim()
        ? `Scenario Context:\n${scenarioOutputEl.innerText.trim()}`
        : "";

    let roleplayStartText = roleplayStartOutputEl && roleplayStartOutputEl.innerText && roleplayStartOutputEl.innerText.trim()
        ? `Roleplay Start Greeting / Action:\n${roleplayStartOutputEl.innerText.trim()}`
        : "";

    let customBehaviorText = customBehaviorFeaturesEl && customBehaviorFeaturesEl.value.trim()
        ? `Design Notes / Behavior Context:\n${customBehaviorFeaturesEl.value.trim()}`
        : "";

    let perspectiveInstruction = "";
    if (perspectiveVal === "firstperson") {
        perspectiveInstruction = `NARRATIVE PERSPECTIVE: Write character actions and narration in FIRST PERSON from the character's perspective using 'I', 'my', 'me' (e.g. *I step closer, narrowing my eyes* "Don't test me.").`;
    } else if (perspectiveVal === "secondperson") {
        perspectiveInstruction = `NARRATIVE PERSPECTIVE: Write character actions and narration in SECOND PERSON addressing {{user}} directly using 'you', 'your' (e.g. *You see her step closer, her eyes fixed on you* "Don't test me.").`;
    } else {
        perspectiveInstruction = `NARRATIVE PERSPECTIVE: Write character actions and narration in THIRD PERSON using character names or 'he/she/they' (e.g. *She steps closer, narrowing her eyes* "Don't test me.").`;
    }

    let toneAndSettingNote = window.getToneAndSettingInstruction();
    let multiCastFormattingRule = mainCastCount >= 2 ? `\n8. Multi-character rule: Format each character's line using their actual name followed by a colon instead of generic tags (e.g., Amy: *Action* "Dialogue", Fio: "Dialogue" *Action*).` : "";

    let formatExample = mainCastCount >= 2
        ? `{{user}}: "Dialogue" *Action description*
Amy: *Action description* "Dialogue"
Fio: "Dialogue" *Action description*

{{user}}: "Dialogue" *Action description*
Amy: "Dialogue" *Action description*`
        : `{{user}}: "Dialogue" *Action description*
{{char}}: "Dialogue" *Action description*

{{user}}: "Dialogue" *Action description*
{{char}}: "Dialogue" *Action description*`;

    let instruction = `Based on the character profile, scenario context, and opening roleplay start below, generate a behavior example showing 5 back to back interactions between {{user}} and the cast.

Format the example strictly as follows:

${formatExample}

Requirements & Format:
${perspectiveInstruction}
${toneAndSettingNote}
Rules for example behavior:
1. Narrative Perspective: Follow the specified narrative perspective for all actions and descriptions (${perspectiveVal}).
2. Writing Style: Drop the flowery prose and the moral filters; write in a raw style with casual vocabulary, heavy sensory descriptions of touch and scent, and a slow-burn pace that focuses on visceral physical tension and high-stakes longing.
3. Sensory Grounding: Focus heavily on tangible body language, physical proximity, tactile contact, skin heat, breathing, scents, and unyielding eye contact. Avoid poetic flourishes, melodrama, or sophisticated AI phrasing.
4. Punctuation: Never use em dashes (—); split ideas into shorter, clearer sentences whenever possible.
5. Use asterisks for actions and descriptions, NOT bolding.
6. Use quotation marks for all dialogue.
7. Write authentic humanized dialogue using each character's unique casual vocabulary, tone, and speech mannerisms. Include vivid, grounded descriptions of actions.
8. Show the character’s unique voice, personality, dynamic, and relationship to {{user}}.${multiCastFormattingRule}

Character Profile:
${descText}

${scenarioText}

${roleplayStartText}

${customBehaviorText}`;

    return {
        instruction,
        render: function (data) {
            let text = data.text.replace(/(^|\n)(\{\{(?:user|char)\}\}:?|[a-zA-Z0-9_ -]{1,30}:)/g, (m, p1, p2) => p1 + `<b style="color:#13a000">${p2}</b>`);
            return text;
        }
    };
};

/* ===========================
   8. PROMPT SELECTOR BY CAST & LENGTH
=========================== */

window.getCharacterPrompt = function (castCount) {
    let descLengthEl = document.getElementById("descLengthEl");
    let lengthVal = descLengthEl ? descLengthEl.value : "medium";

    if (lengthVal === "compact_detailed" || lengthVal === "compact-detailed") {
        return window.getCompactDetailedPrompt();
    }

    let count = typeof castCount === "number" ? castCount : parseInt(document.getElementById("mainCastEl")?.value || "1", 10);
    if (count >= 5) {
        return window.getLargeCastScenarioPrompt();
    } else if (count >= 2) {
        return window.getMultiCharacterScenarioPrompt();
    } else {
        return window.getFantasyCharacterPrompt();
    }
};

/* ===========================
   9. WINDOW PROPERTY GETTERS
=========================== */

Object.defineProperties(window, {
    fantasyCharacterPrompt: {
        get: function () { return window.getFantasyCharacterPrompt(); },
        configurable: true
    },
    multiCharacterScenarioPrompt: {
        get: function () { return window.getMultiCharacterScenarioPrompt(); },
        configurable: true
    },
    largeCastScenarioPrompt: {
        get: function () { return window.getLargeCastScenarioPrompt(); },
        configurable: true
    },
    compactDetailedPrompt: {
        get: function () { return window.getCompactDetailedPrompt(); },
        configurable: true
    },
    behaviorPrompt: {
        get: function () { return window.getBehaviorPrompt(); },
        configurable: true
    },
    scenarioPrompt: {
        get: function () { return window.getScenarioPrompt(); },
        configurable: true
    },
    roleplayStartPrompt: {
        get: function () { return window.getRoleplayStartPrompt(); },
        configurable: true
    }
});
