/* ===========================
   AI SERVICE (PERCHANCE & LOCAL)
=========================== */
async function generateCharacterResponse(character, thread, userMessageText) {
  const history = await db.messages.where({ threadId: thread.id }).sortBy("timestamp");
  const memories = await db.memories.where({ characterId: character.id }).toArray();
  const userProf = AppState.userProfile || DEFAULT_USER_PROFILE;

  // Build Context String
  let promptContext = `System Role: ${character.roleInstruction}\n`;
  promptContext += `Character Details: Name: ${character.name}, Age: ${character.age}, Occupation: ${character.occupation}, Location: ${character.location}, Personality: ${character.personality}\n`;
  promptContext += `User Details: Name: ${userProf.name}, Persona: ${userProf.persona}\n`;
  
  if (memories.length > 0) {
    promptContext += `Long-Term Memories:\n` + memories.map(m => `- ${m.content}`).join("\n") + `\n`;
  }
  
  promptContext += `Current Scenario: ${character.scenario}\n\nChat History:\n`;

  // Format last 10 messages
  const recentMsgs = history.slice(-10);
  for (const m of recentMsgs) {
    const sender = m.role === "user" ? userProf.name : character.name;
    promptContext += `${sender}: ${m.content}\n`;
  }

  promptContext += `${character.name}:`;

  // 1. Check if Perchance ai-text-plugin is available
  const aiPlugin = window.ai || window.root?.ai;
  if (typeof aiPlugin === "function") {
    try {
      const result = await aiPlugin({
        instruction: promptContext,
        startWith: `${character.name}: *`,
        hideStartWith: false
      });
      if (result && (result.generatedText || result.text)) {
        return (result.generatedText || result.text).replace(new RegExp(`^${character.name}:\\s*`), '');
      }
    } catch (err) {
      console.warn("Perchance AI plugin error, falling back:", err);
    }
  }

  // 2. Local Fallback Generator
  await delay(1200);
  return generateFallbackResponse(character, userMessageText);
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
