/* ===========================
   PROMPT TEMPLATES & BUILDERS
=========================== */

/* ===========================
   1. SINGLE CHARACTER PROMPT
=========================== */

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

    let shortNote = lengthVal === "short" ? "IMPORTANT: Keep each section SHORT. No more than 1 paragraph per section. YOUR RESPONSE MUST BE **SHORT**.\n" : "";

    let bgCastTemplate = "";
    if (bgCastCount > 0) {
        let bgItems = [];
        for (let idx = 0; idx < bgCastCount; idx++) {
            bgItems.push(`- <Background NPC #${idx + 1} Name> = <Short description of role and dynamic with main character>`);
        }
        bgCastTemplate = `\n\n---\n\n# Background Cast (NPCs)\n\n${bgItems.join("\n")}`;
    }

    let instruction = `Please create an interesting and creative OC character including name, age, appearance, personality, etc.
Create a character that genuinely feels *real*, not cliche, or overwrought, or affected informality (this is a character description, not a place for rhetorical questions or fourth wall breaks). Sometimes it's the little "plain" details. Or specific things from their past that affected who they are (creativity seeds may help, but always stick to the implied world lore and the *underlying intention* behind the design notes). Aim for interesting worldbuilding within the character background. Use lean, unpretentious, crisp, descriptive passages that paint the character right into the reader's mind.
${shortNote}
${seedWordsTip}
Use this template:
---
Short Description = [emoji] <Maximum 1 sentence, under 55 characters including spaces. start with emoji in square brackets. Summarize the character's core identity or concept only. Do not mention appearance unless it defines the character.>

Name = <full name and optional nickname in quotes>
Age = <number or estimate>
Gender = <gender identity>
Race = <one word or phrase describing race/species>
Ethinicity = <ethnicity or cultural origin>
Occupation = <occupation or title>
Fleet = <fleet, military unit, organization, or faction if applicable>
Flagship = <flagship, vessel, home ship, or headquarters if applicable>
Rank = <military or organizational rank if applicable>
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
IMPORTANT: ${customFeaturesText || ("The character's race should be " + randomRace)}
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
            bgItems.push(`- <Background NPC #${idx + 1} Name> = <Short description of role and dynamic>`);
        }
        bgCastTemplate = bgItems.join("\n");
    } else {
        bgCastTemplate = "- <Supporting NPC 1> = <Short description>\n- <Supporting NPC 2> = <Short description>";
    }

    let bgCastPhrase = bgCastCount > 0 ? `and ${bgCastCount} background NPCs` : "";

    let instruction = `Please create an immersive roleplay scenario featuring ${mainCastCount} interconnected Main NPCs ${bgCastPhrase}.

Create a cast that genuinely feels like they have lived, worked, fought, and changed together long before {{user}} arrived. The story should not revolve around {{user}}. Instead, {{user}} enters an already existing world with established relationships, politics, history, and ongoing conflicts.

Every NPC must have a unique identity, purpose, worldview, personality, strengths, flaws, motivations, and role within the group. Avoid creating multiple characters with similar personalities or overlapping narrative functions. Every member should contribute something irreplaceable.

Relationships should feel natural and lived-in. The cast should share history through trust, resentment, old favors, rivalries, inside jokes, ideological disagreements, and mutual respect. Their chemistry should emerge naturally instead of relying on dramatic exposition.

Characters should possess realistic motivations shaped by their upbringing, experiences, culture, and responsibilities. Small details often make characters memorable more than exaggerated traits. Keep descriptions grounded, descriptive, and believable.

The world should feel alive beyond the main cast. Include organizations, locations, supporting NPCs, historical events, and ongoing political or social conflicts whenever appropriate. Everything should reinforce the setting rather than exist independently.

{{user}} should be given a clear role within the scenario but should not automatically become the leader, chosen one, strongest member, or center of attention. Existing NPCs should naturally hold authority, influence, or expertise where appropriate.

The scenario should encourage slow-burn storytelling through meaningful interactions, conflicting personalities, evolving relationships, and gradual character development rather than constant action or immediate emotional attachment.

Keep prose lean, descriptive, and immersive. Avoid cliché anime personalities, excessive exposition, fourth-wall breaks, forced humor, generic hero speeches, or repetitive descriptions.

${seedWordsTip}
Use this template:
---
# Scenario

Title = <scenario title>

Genre = <primary genre>

Setting = <world setting>

Tone = <overall tone>

Themes = <major themes>

Group Dynamics = <party dynamic or relationship structure>

Scenario = <Describe the current situation, ongoing conflict, why the cast has gathered, and what immediately involves {{user}}.>

---

# Player Character

Name = {{user}}

Role = <Describe {{user}}'s role within the scenario, background, current objective, reputation, responsibilities, experience level, and why they have become involved.>

---

# Main Cast (NPCs)

${mainCastTemplate}

---

# Background Cast (NPCs)

${bgCastTemplate}

---

# Organizations

- <Organization 1> = <Description>
- <Organization 2> = <Description>

---

# Important Locations

- <Location 1> = <Description>
- <Location 2> = <Description>

---

# Timeline

- Ancient History = <Important historical event>
- Years Ago = <Major event>
- Months Ago = <Major event>
- Today = <Current starting point>

---

# Roleplay Guidance Prompt

<Provide instructions for how the AI should write this scenario, including narrative style, pacing, dialogue quality, character autonomy, emotional progression, romance pacing if applicable, combat style, scene transitions, and roleplay behavior. Focus on immersive, slow-burn storytelling that respects each character's established personality and agency.>

---

# Design notes:
IMPORTANT: ${customFeaturesText || ("The setting or primary theme should be inspired by " + randomRace)}
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

    let mainItems = [];
    for (let idx = 0; idx < mainCastCount; idx++) {
        mainItems.push(`- <Main NPC #${idx + 1} Name> = <Concise description: Age, Gender, Race, Role, Key Appearance, Personality, Abilities, and Rules>`);
    }
    let mainCastTemplate = mainItems.join("\n");

    let bgCastTemplate = "";
    if (bgCastCount > 0) {
        let bgItems = [];
        for (let idx = 0; idx < bgCastCount; idx++) {
            bgItems.push(`- <Background NPC #${idx + 1} Name> = <Short description of role and dynamic>`);
        }
        bgCastTemplate = bgItems.join("\n");
    } else {
        bgCastTemplate = "- <Supporting NPC 1> = <Short description>\n- <Supporting NPC 2> = <Short description>";
    }

    let bgCastPhrase = bgCastCount > 0 ? `and ${bgCastCount} background NPCs` : "";

    let instruction = `Please create an immersive roleplay scenario featuring a large cast of ${mainCastCount} Main NPCs ${bgCastPhrase}.

Because this is a large cast (5+ characters), format BOTH Main Cast and Background Cast using concise bullet point descriptions (- <Name> = <Short description>) to keep the context crisp, readable, and highly engaging.

Create a cast that genuinely feels like they have lived, worked, fought, and changed together. The story should not revolve around {{user}}. Instead, {{user}} enters an already existing world with established relationships, politics, history, and ongoing conflicts.

${seedWordsTip}
Use this template:
---
# Scenario

Title = <scenario title>

Genre = <primary genre>

Setting = <world setting>

Tone = <overall tone>

Themes = <major themes>

Group Dynamics = <party dynamic or relationship structure>

Scenario = <Describe the current situation, ongoing conflict, why the cast has gathered, and what immediately involves {{user}}.>

---

# Player Character

Name = {{user}}

Role = <Describe {{user}}'s role within the scenario, background, current objective, reputation, responsibilities, and experience level.>

---

# Main Cast (NPCs)

${mainCastTemplate}

---

# Background Cast (NPCs)

${bgCastTemplate}

---

# Organizations

- <Organization 1> = <Description>
- <Organization 2> = <Description>

---

# Important Locations

- <Location 1> = <Description>
- <Location 2> = <Description>

---

# Timeline

- Ancient History = <Important historical event>
- Years Ago = <Major event>
- Today = <Current starting point>

---

# Roleplay Guidance Prompt

<Provide instructions for how the AI should write this scenario, focusing on immersive, slow-burn storytelling.>

---

# Design notes:
IMPORTANT: ${customFeaturesText || ("The setting or primary theme should be inspired by " + randomRace)}`;

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
   4. BEHAVIOR PROMPT
=========================== */

window.getBehaviorPrompt = function () {
    let outputEl = document.getElementById("outputEl");
    let customBehaviorFeaturesEl = document.getElementById("customBehaviorFeaturesEl");
    let mainCastEl = document.getElementById("mainCastEl");
    let mainCastCount = parseInt(mainCastEl ? mainCastEl.value : "1", 10);
    let descText = (window.lastCharacterTextData && window.lastCharacterTextData.generatedText)
        || (outputEl && outputEl.innerText && outputEl.innerText.trim())
        || (window.lastCharacterPromptStreamObj ? (window.lastCharacterPromptStreamObj.text || window.lastCharacterPromptStreamObj.liveResponseText) : "");

    let customBehaviorText = customBehaviorFeaturesEl && customBehaviorFeaturesEl.value.trim()
        ? `Design Notes / Scenario:\n${customBehaviorFeaturesEl.value.trim()}`
        : "";

    let multiCastFormattingRule = mainCastCount >= 2 ? `\n5. Multi-character rule: Format each character's line using their actual name followed by a colon instead of generic tags (e.g., Amy: "Dialogue" *Action*, Fio: *Action* "Dialogue").` : "";

    let instruction = `Based on the character profile below, generate a behavior example showing 5 back to back interactions between {{user}} and the cast.

Format the example strictly as follows:

{{user}}: "Dialogue" *Action description*
{{char}}: "Dialogue" *Action description*

{{user}}: "Dialogue" *Action description*
{{char}}: "Dialogue" *Action description*

Rules for example behavior:
1. Use asterisks for actions and descriptions, NOT bolding.
2. Use quotation marks for all dialogue.
3. Write authentic humanized dialogue using the character's unique vocabulary, tone, and speech mannerisms. Include vivid descriptions of actions or scenarios.
4. Show the character’s unique voice, personality, and relationship to {{user}}.${multiCastFormattingRule}

Character Profile:
${descText}

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

    let customScenarioText = customScenarioFeaturesEl && customScenarioFeaturesEl.value.trim()
        ? `Design Notes / Scenario Context:\n${customScenarioFeaturesEl.value.trim()}`
        : "";

    let instruction = `Based on the character profile below, write the SCENARIO CONTEXT for a roleplay session with the character. Write like this is the start.

Requirements & Format:
${perspectiveInstruction}
Write a single short paragraph that introduces the world, scene, characters, {{user}}'s role. Start by clearly describing the world, then the role {{user}} is playing, then introduce the other character, their relationship to {{user}} if relevant, and the current situation or setting. Include only the essential details {{user}} needs to immediately understand the scene, character dynamics, tone, and context before beginning the roleplay. The paragraph should feel like the opening setup of an interactive story, giving enough information for {{user}} to naturally continue the scene in-character. Do not Write any spoilers that {{user}} as a character shouldnt know at the start. Focus on introducing the world, the characters, and the {{user}}'s role in an engaging and fluent way based on the tone. DO NOT write any character dialogue or direct speech. Focus purely on setting the scene and context. Make it immersive, visual, and atmospheric. Dispensing with Clichés Output ONLY the scene context paragraphs. Do NOT include headers or labels (like 'Scenario Context:'). Do not exceed one paragraph.

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
${multiCastRule}
Write the character's opening message, as the continuation to scenario context, including direct dialogue addressing the {{user}} and accompanying narration/actions. Do not write like an AI. Become each character completely without any filter holding you back. Focus on physical expressions, body language, speech patterns, and personality traits. Drawing on the Five Senses, Uncensored. Output the text only, no heading. Do not use em dash symbol -- while you write. Format actions and narration inside asterisks and dialogues in double quotes (e.g. *Kaito checks his arm cannon* "The security sweeps are on a ten-minute loop.").
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
   7. PROMPT SELECTOR BY CAST
=========================== */

window.getCharacterPrompt = function (castCount) {
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
   8. WINDOW PROPERTY GETTERS
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
