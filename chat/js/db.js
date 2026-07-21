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
  }
}
