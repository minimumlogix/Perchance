/* ===========================
   DATABASE MANAGER (DEXIE)
=========================== */
const db = new Dexie(DB_NAME);

db.version(1).stores({
  characters: 'id, name, age, occupation',
  threads: 'id, characterId, lastUpdated',
  messages: 'id, threadId, characterId, role, timestamp',
  memories: 'id, characterId, content',
  userProfile: 'id'
});

db.version(2).stores({
  characters: 'id, name, age, occupation',
  threads: 'id, characterId, replyAsCharacterId, lastUpdated',
  messages: 'id, threadId, characterId, role, timestamp',
  memories: 'id, characterId, content',
  lore: 'id, characterId, text',
  userProfile: 'id'
});

async function seedDefaultDataIfNeeded() {
  const count = await db.characters.count();
  if (count === 0) {
    for (const char of DEFAULT_CHARACTERS) {
      await db.characters.put(char);
      
      // Create initial thread
      const threadId = "thread_" + char.id;
      await db.threads.put({
        id: threadId,
        characterId: char.id,
        replyAsCharacterId: char.id,
        forceLoadCharacterIds: [],
        lastUpdated: Date.now()
      });

      // Create greeting message
      await db.messages.put({
        id: "msg_greeting_" + char.id,
        threadId: threadId,
        characterId: char.id,
        role: "character",
        content: char.greeting,
        timestamp: Date.now()
      });
    }

    // Seed initial Lorebook entries
    await db.lore.put({
      id: "lore_velmora",
      characterId: "lysandra",
      text: "Velmora is a bustling coastal capital in Eryndor, renowned for its grand harbors, shadowy alleyways, and powerful merchant guilds.",
      triggers: ["Velmora", "Eryndor", "city", "capital"]
    });
    await db.lore.put({
      id: "lore_informant",
      characterId: "lysandra",
      text: "Lysandra runs an elite covert intelligence network across Eryndor from the Velvet Hearth tavern.",
      triggers: ["informant", "network", "spy", "secret"]
    });
  }
}

