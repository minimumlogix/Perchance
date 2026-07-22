/* ===========================
   AI SERVICE & HIERARCHICAL SUMMARIZATION LOGIC
=========================== */

// 1. SANDBOX EVALUATOR FOR PERCHANCE EXPRESSIONS
async function evaluatePerchanceTextInSandbox(text, opts) {
  if (!opts) opts = {};
  let iframe = document.querySelector('#perchanceCodeEvaluationSandboxIframe');
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.src = "https://7deabe31ae18ea5ed27c5f71b9633999.perchance.org/ai-character-chat-sandboxed-executor";
    iframe.id = "perchanceCodeEvaluationSandboxIframe";
    iframe.sandbox = "allow-scripts allow-same-origin";
    iframe.style.cssText = "position:fixed; width:1px; height:1px; opacity:0.01; top:-10px; right:-10px; pointer-events:none; border:0; outline:0; user-select:none;";
    document.body.append(iframe);
    iframe._resolvers = {};
    
    let iframeLoadResolver;
    let iframeLoadPromise = new Promise(r => iframeLoadResolver = r);
    window.addEventListener('message', (event) => {
      if (event.origin === 'https://7deabe31ae18ea5ed27c5f71b9633999.perchance.org') {
        if (event.data.finishedLoading) {
          iframeLoadResolver();
          return;
        }
        const { requestId, text } = event.data;
        if (iframe._resolvers[requestId]) {
          iframe._resolvers[requestId](text);
          delete iframe._resolvers[requestId];
        }
      }
    });
    await iframeLoadPromise;
  }

  const requestId = Math.random().toString();
  return new Promise((resolve, reject) => {
    iframe._resolvers[requestId] = resolve;
    if (opts.timeout) {
      setTimeout(() => {
        if (iframe._resolvers[requestId]) reject("Sandbox did not respond in time.");
      }, opts.timeout);
    }
    iframe.contentWindow.postMessage({ text, requestId }, 'https://7deabe31ae18ea5ed27c5f71b9633999.perchance.org');
  });
}

// 2. GET UN-SUMMARIZED MESSAGE OBJECTS FOR CONTEXT
function getMessageObjsWithoutSummarizedOnes(messages, opts) {
  if (!opts) opts = {};
  messages = messages.slice(0);
  const minimumMessageLevel = opts.minimumMessageLevel || 0;

  let messageObjsWithoutSummarizedOnes = [];
  let highestLevelSeen = 0;

  while (messages.length > 0) {
    let m = messages.pop();
    let level = m.summariesEndingHere ? Math.max(...Object.keys(m.summariesEndingHere).map(n => Number(n))) : 0;
    if (level < minimumMessageLevel) continue;
    if (level >= highestLevelSeen) {
      messageObjsWithoutSummarizedOnes.unshift(m);
      highestLevelSeen = level;
    }
  }
  return messageObjsWithoutSummarizedOnes;
}

// 3. BACKGROUND HIERARCHICAL SUMMARIZATION ENGINE
async function injectHierarchicalSummariesAndComputeNextSummariesInBackgroundIfNeeded(threadId, opts) {
  if (!window.__aiHierarchicalSummaryStuff) window.__aiHierarchicalSummaryStuff = {};
  if (!window.__aiHierarchicalSummaryStuff[threadId]) {
    window.__aiHierarchicalSummaryStuff[threadId] = {};
    window.__aiHierarchicalSummaryStuff[threadId].summariesReadyToInject = [];
  }
  if (!opts) opts = {};

  let originalMessages = await db.messages.where({ threadId }).toArray();
  let idToOriginalMessage = originalMessages.reduce((a, v) => (a[v.id] = v, a), {});
  
  let preparedMessages = originalMessages;
  for (let m of preparedMessages) {
    let originalMessage = idToOriginalMessage[m.id];
    if (originalMessage.summariesEndingHere) m.summariesEndingHere = originalMessage.summariesEndingHere;
  }

  let thread = await db.threads.get(threadId);
  let threadCharacter = await db.characters.get(thread.characterId);
  let userName = thread.userCharacter?.name ?? (AppState.userProfile ? AppState.userProfile.name : "Nyx");
  let characterName = threadCharacter.name;
  let roleInstruction = (threadCharacter.roleInstruction || "")
    .replaceAll("{{char}}", characterName)
    .replaceAll("{{user}}", userName);
  let extraContext = `In case it's useful here's a description of the **${characterName}** character: ` + roleInstruction.replace(/\n+/g, " ");

  let idToPreparedMessage = preparedMessages.reduce((a, v) => (a[v.id] = v, a), {});

  // Inject summaries ready to inject
  if (window.__aiHierarchicalSummaryStuff[threadId].summariesReadyToInject.length > 0) {
    let messagesToUpdate = new Set();
    for (let { summarizedMessages, lastMessageSummarizedId, summary, memories, level } of window.__aiHierarchicalSummaryStuff[threadId].summariesReadyToInject) {
      if (level <= 0) continue;
      let lastSummarizedMessageText = summarizedMessages[summarizedMessages.length - 1];
      let lastMessageObjInSummary = idToPreparedMessage[lastMessageSummarizedId];
      if (!lastMessageObjInSummary) continue;

      let expectedLastSummarizedText = level === 1 ? `${lastMessageObjInSummary.name || characterName}: ${lastMessageObjInSummary.content}` : lastMessageObjInSummary.summariesEndingHere[level - 1];
      if (expectedLastSummarizedText && expectedLastSummarizedText.trim() === lastSummarizedMessageText.trim()) {
        let m = lastMessageObjInSummary;
        if (!m.summariesEndingHere) m.summariesEndingHere = {};
        m.summariesEndingHere[level] = summary;
        messagesToUpdate.add(m);
      }
    }

    if (window.__aiHierarchicalSummaryStuff[threadId].summariesReadyToInject.length >= 3) {
      for (let m of messagesToUpdate) {
        await db.messages.update(m.id, { summariesEndingHere: m.summariesEndingHere });
      }
      window.__aiHierarchicalSummaryStuff[threadId].summariesReadyToInject = [];
    }
  }

  const aiPlugin = window.ai || window.root?.ai;
  if (!aiPlugin) return;

  const numCharsToSummarizeAtATime = 1500;

  (async function() {
    if (window.__aiHierarchicalSummaryStuff[threadId].alreadyDoingSummary) return;
    try {
      window.__aiHierarchicalSummaryStuff[threadId].alreadyDoingSummary = true;

      const allMessageObjs = [];
      let i = 0;
      for (let m of preparedMessages) {
        allMessageObjs.push({
          text: `${m.role === 'user' ? userName : characterName}: ${m.content}`,
          index: i++,
          messageId: m.id,
          level: 0,
        });
        let summaryEntries = Object.entries(m.summariesEndingHere || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
        for (let [level, summary] of summaryEntries) {
          level = Number(level);
          allMessageObjs.push({
            text: summary,
            index: i++,
            messageId: m.id,
            level,
          });
        }
      }

      let summaryLevelToMessageBlocks = new Map();
      let summaryLevelBeingProcessed = 1;

      while (true) {
        const thisLevelAndPreviousLevelMessageObjs = allMessageObjs.filter(m => m.level === summaryLevelBeingProcessed || m.level === summaryLevelBeingProcessed - 1);
        if (thisLevelAndPreviousLevelMessageObjs.length === 0) break;

        const blocks = [];
        let currentBlock = [];
        currentBlock.messageData = [];
        for (let m of thisLevelAndPreviousLevelMessageObjs) {
          currentBlock.push(m.text);
          currentBlock.messageData.push(m);
          if (m.level === summaryLevelBeingProcessed) {
            blocks.push(currentBlock);
            currentBlock = [];
            currentBlock.messageData = [];
          }
        }
        blocks.push(currentBlock);
        summaryLevelToMessageBlocks.set(summaryLevelBeingProcessed, blocks);
        summaryLevelBeingProcessed++;
      }

      const summaryLevelBlockEntries = [...summaryLevelToMessageBlocks.entries()].sort((a, b) => a[0] - b[0]);
      for (let [summaryLevel, blocks] of summaryLevelBlockEntries) {
        let messagesToSummarizeFromFinalBlock = blocks[blocks.length - 1];
        let numCharsInFinalBlock = messagesToSummarizeFromFinalBlock.reduce((a, v) => a + v.length, 0);
        if (numCharsInFinalBlock < numCharsToSummarizeAtATime) continue;

        while (true) {
          if (messagesToSummarizeFromFinalBlock.length <= 1) break;
          let numChars = messagesToSummarizeFromFinalBlock.reduce((a, v) => a + v.length, 0);
          if (numChars < numCharsToSummarizeAtATime) break;
          messagesToSummarizeFromFinalBlock.pop();
          messagesToSummarizeFromFinalBlock.messageData.pop();
        }

        if (messagesToSummarizeFromFinalBlock.length === 0) continue;

        let lastMessageSummarizedData = messagesToSummarizeFromFinalBlock.messageData[messagesToSummarizeFromFinalBlock.length - 1];
        let lastMessageSummarizedId = lastMessageSummarizedData.messageId;

        let exampleBlocksForStartWith = blocks.slice(-3, -1);
        let exampleBlockSummaries = exampleBlocksForStartWith.map(b => b[b.length - 1]);

        let summariesAtThisLevelAndAbove = getMessageObjsWithoutSummarizedOnes(preparedMessages, { minimumMessageLevel: summaryLevel }).map(m => {
          let level = m.summariesEndingHere ? Math.max(...Object.keys(m.summariesEndingHere).map(n => Number(n))) : 0;
          if (level === 0) return m.content;
          else return m.summariesEndingHere[level];
        });

        let instructionSummaries = JSON.parse(JSON.stringify(summariesAtThisLevelAndAbove));
        while (instructionSummaries.length > 0) {
          if (exampleBlockSummaries.includes(instructionSummaries[instructionSummaries.length - 1])) {
            instructionSummaries.pop();
            continue;
          }
          break;
        }

        let startWithBlocks = exampleBlocksForStartWith.map((block) => ({ messages: block.slice(0, -1), summary: block.slice(-1)[0] }));
        startWithBlocks.push({ messages: messagesToSummarizeFromFinalBlock, summary: "" });

        let startWith = startWithBlocks.map(({ messages, summary }, blockI) => {
          let letterLabel = blockI === 0 ? "[A]" : (blockI === 1 ? "[B]" : "[C]");
          let messagesText = messages.map((message, mi) => {
            message = message.replace(/\n/g, " ").trim();
            return `${summaryLevel === 1 ? `(${mi + 1}) ` : ""}${message}`;
          }).join(" ");
          summary = (summary || "").replace(/\n/g, " ").trim();
          return `>>> FULL TEXT of ${letterLabel}: ${messagesText}\n>>> SUMMARY of ${letterLabel}: ${summary}`;
        }).join("\n---\n").trim();

        let sharedContextPrefixText = [
          `Below is${extraContext ? ` some context, plus` : ""} a summary of some events. You must use this information to complete the '@@@ TASK' specified at the bottom of this instruction.`,
          `${extraContext ? `\n# Potentially Useful Context (may or may not be relevant):\n${extraContext}\n` : ""}`,
          `# Summary of Previous Events:`,
        ].join("\n").trim();

        const summaryTaskPrompt = `@@@ TASK: Your task is to generate some text and then a 'SUMMARY' of that text, and then do that a few more times. Above are the characters and the initial scenario, and a summary of earlier events. You must write the text, and then a summary of that text that you wrote, and then some more text, and a summary of that new text, and so on. Each summary should be a single paragraph of text which summarizes the important details from the preceding 'full text' to roughly half its original size.
Use this format/template for your response:
\`\`\`
>>> FULL TEXT of [A]: <some text>
>>> SUMMARY of [A]: <a one-paragraph summary of the [A] text>
---
>>> FULL TEXT of [B]: <some text>
>>> SUMMARY of [B]: <a one-paragraph summary of the [B] text>
---
>>> FULL TEXT of [C]: <some text>
>>> SUMMARY of [C]: <a one-paragraph summary of the [C] text>
\`\`\`
Again, your task is to write some text labelled with a letter, and then a summary of that text, and then some new text, and then a summary of that new text, and so on. Each summary should be a single paragraph of text which summarizes the new text to roughly half its original length. Don't add flowery prose to summaries. Summary text should contain only the most important information, and should use well-phrased sentences with natural structure and correct grammar.
NOTE: Don't append any other commentary/notes in your summaries (e.g. no word counts or commentary after completing the task). Just do the task and then end your response.
IMPORTANT: Avoid repetition within summaries! If there are erroneously repeated elements in the full text, then remove or ignore them when writing your well-phrased summary.`.trim();

        startWith = startWith.trim().slice(0, -1) + " (full, natural, readable sentences with correct grammar):";

        let promptOptions = {
          instruction: [
            sharedContextPrefixText,
            (instructionSummaries.length > 0 ? instructionSummaries : ["(None.)"]).join("\n"),
            ``,
            summaryTaskPrompt,
          ].join("\n").trim(),
          startWith,
          stopSequences: ["\n\n", "\n---", "\n>>> FULL TEXT", "FULL TEXT"],
        };

        let data = await aiPlugin(promptOptions);
        if (data.stopReason === "error") continue;

        let summary = (data.generatedText || "").trim().replace(/\n+/g, " ").trim().replace(/---$/, "").replace(">>> FULL TEXT", "").replace("FULL TEXT", "").trim();
        if (!summary || (instructionSummaries[instructionSummaries.length - 1] || "").trim() === summary) {
          continue;
        }

        window.__aiHierarchicalSummaryStuff[threadId].summariesReadyToInject.push({
          summarizedMessages: messagesToSummarizeFromFinalBlock,
          lastMessageSummarizedId,
          summary,
          level: summaryLevel
        });
      }
    } catch (e) {
      console.error("Hierarchical summary error:", e);
    } finally {
      window.__aiHierarchicalSummaryStuff[threadId].alreadyDoingSummary = false;
    }
  })();
}

// PETRA KEYWORD SYSTEM FOR LOREBOOK & TRIGGERS
function parseLoreEntryWithTriggers(loreEntryText) {
  if (!loreEntryText) return { text: "", triggers: [] };
  const triggerRegex = /\[\{.*?\}\]$/;
  const match = loreEntryText.match(triggerRegex);

  let text = loreEntryText.trim();
  let triggers = [];

  if (match) {
    const triggerString = match[0];
    text = text.substring(0, text.length - triggerString.length).trim();
    try {
      triggers = JSON.parse(triggerString);
    } catch (error) {
      console.error("Error parsing lore triggers:", error);
    }
  }

  return {
    text: text,
    triggers: triggers || []
  };
}

function unparseLoreEntryWithTriggers(loreEntry) {
  if (!loreEntry) return "";
  return `${loreEntry.text} ${JSON.stringify(loreEntry.triggers || [])}`;
}

// 4. MAIN CHARACTER RESPONSE GENERATOR
async function generateCharacterResponse(character, thread, userMessageText) {
  // Determine replier character
  let replierChar = character;
  if (thread && thread.replyAsCharacterId && thread.replyAsCharacterId !== character.id) {
    const customReplier = await db.characters.get(thread.replyAsCharacterId);
    if (customReplier) replierChar = customReplier;
  }

  const history = await db.messages.where({ threadId: thread.id }).sortBy("timestamp");
  const memories = await db.memories.where({ characterId: replierChar.id }).toArray();
  const allLore = await db.lore.where({ characterId: replierChar.id }).toArray();
  const userProf = AppState.userProfile || DEFAULT_USER_PROFILE;

  // Dynamic Lorebook Keyword Trigger Matching
  const recentMsgsText = history.slice(-5).map(m => m.content).join(" ").toLowerCase() + " " + (userMessageText || "").toLowerCase();
  const matchedLore = [];

  for (const item of allLore) {
    let triggersArr = item.triggers;
    if (typeof triggersArr === "string") {
      triggersArr = triggersArr.split(",").map(t => t.trim());
    }
    if (!triggersArr || triggersArr.length === 0) {
      // If no triggers specified, include by default
      matchedLore.push(item.text);
      continue;
    }

    const hasMatch = triggersArr.some(trig => trig && recentMsgsText.includes(trig.toLowerCase()));
    if (hasMatch) {
      matchedLore.push(item.text);
    }
  }

  // Force-Loaded Extra Characters
  let forceLoadedText = "";
  if (thread.forceLoadCharacterIds && thread.forceLoadCharacterIds.length > 0) {
    for (const fId of thread.forceLoadCharacterIds) {
      if (fId === replierChar.id) continue;
      const fChar = await db.characters.get(fId);
      if (fChar) {
        forceLoadedText += `[Present Character: ${fChar.name} - ${fChar.roleInstruction}]\n`;
      }
    }
  }

  // Compute background summary if conversation is long
  injectHierarchicalSummariesAndComputeNextSummariesInBackgroundIfNeeded(thread.id).catch(console.error);

  // Build Context String
  let promptContext = `System Role: ${replierChar.roleInstruction}\n`;
  promptContext += `Character Details: Name: ${replierChar.name}, Age: ${replierChar.age}, Occupation: ${replierChar.occupation}, Location: ${replierChar.location}, Personality: ${replierChar.personality}\n`;
  promptContext += `User Details: Name: ${userProf.name}, Persona: ${userProf.persona}\n`;

  if (forceLoadedText) {
    promptContext += `# Force-Loaded Additional Characters:\n${forceLoadedText}\n`;
  }
  
  if (memories.length > 0) {
    promptContext += `Long-Term Memories:\n` + memories.map(m => `- ${m.content}`).join("\n") + `\n`;
  }

  if (matchedLore.length > 0) {
    promptContext += `# World Lorebook & Context:\n` + matchedLore.map(l => `- ${l}`).join("\n") + `\n`;
  }
  
  promptContext += `Current Scenario: ${character.scenario}\n\nChat History:\n`;

  // Format last 10 messages
  const recentMsgs = history.slice(-10);
  for (const m of recentMsgs) {
    let sender = userProf.name;
    if (m.role === "character") {
      const msgChar = m.characterId ? (await db.characters.get(m.characterId)) : null;
      sender = msgChar ? msgChar.name : character.name;
    }
    const textContent = (m.variations && m.variations.length > 0) ? m.variations[m.activeVariationIndex || 0] : m.content;
    promptContext += `${sender}: ${textContent}\n`;
  }

  promptContext += `${replierChar.name}:`;

  // 1. Check if Perchance ai-text-plugin is available
  const aiPlugin = window.ai || window.root?.ai;
  if (typeof aiPlugin === "function") {
    try {
      const result = await aiPlugin({
        instruction: promptContext,
        startWith: `${replierChar.name}: *`,
        hideStartWith: false
      });
      if (result && (result.generatedText || result.text)) {
        return (result.generatedText || result.text).replace(new RegExp(`^${replierChar.name}:\\s*`), '');
      }
    } catch (err) {
      console.warn("Perchance AI plugin error, falling back:", err);
    }
  }

  // 2. Local Fallback Generator
  await delay(1200);
  return generateFallbackResponse(replierChar, userMessageText);
}

function generateFallbackResponse(character, userMsg) {
  const lowerMsg = userMsg.toLowerCase();
  
  if (character.id === "lysandra") {
    if (lowerMsg.includes("secret") || lowerMsg.includes("whisper")) {
      return `*Lysandra's eyes glint beneath the tavern torchlight as she leans closer, lower voice smooth as silk.*\n\n"Secrets are currency in Velmora, my dear. What are you willing to trade for what I know?"`;
    }
    const pools = [
      `*Lysandra swirls the dark red wine in her crystal glass, a knowing glint in her eyes.*\n\n"Every whisper in Velmora has its price. But for you? Perhaps I am inclined to share a piece of the truth."`,
      `*She leans forward slightly, resting her chin upon her manicured hand.*\n\n"You speak as though danger is a stranger to you. Tell me, what is it you truly seek in these dark streets?"`,
      `*A quiet chuckle escapes her lips, soft as velvet in the amber glow of the hearth.*\n\n"Legends have a way of twisting the past. But between us, some stories don't even capture half the terror."`
    ];
    return pools[Math.floor(Math.random() * pools.length)];
  }
  
  if (character.id === "kaelen") {
    const pools = [
      `*Kaelen rests a gloved hand on the pommel of his broadsword, adjusting his coat.*\n\n"Talk is cheap when sword steel is rusted. If we're riding north at dawn, make sure your gear is sharp."`,
      `*He takes a long draught from his pewter tankard and grunts.*\n\n"I've fought sellswords, beasts, and mad lords. Trust me, the dead don't care about your noble titles."`
    ];
    return pools[Math.floor(Math.random() * pools.length)];
  }

  return `*${character.name} listens closely to your words, taking a moment to contemplate before responding.*\n\n"That is a intriguing perspective. Tell me more about what you intend to do next."`;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
