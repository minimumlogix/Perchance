/* ===========================
   TAG SELECTOR COMPONENT
=========================== */

window.DEFAULT_TONES_DATA = {
  casual_everyday: { label: "💬 Casual & Everyday", description: "Everyday conversational words, simple phrasing, no purple prose or complex archaisms", prompt: "The tone is casual, modern, and natural. Use everyday words, plain spoken vocabulary, and natural conversational phrasing. Strictly avoid purple prose, overly complex vocabulary, Shakespearean archaisms, flowery metaphors, or unnaturally formal dialogue.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/genz-casual-tone.jpg" },
  romantic: { label: "💖 Romantic", description: "Focus on relationship and love", prompt: "A romantic tone focusing on relationship and love.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/romance-tone.jpg" },
  romantic_comedy: { label: "🍿 Rom-Com", description: "Sweet romance mixed with lighthearted comedy", prompt: "The tone is a romantic comedy. Center the narrative around romantic attraction, misunderstandings, light-hearted humor, and comedic timing. Keep it entertaining, witty, and sweet.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/romantic-comedy-tone.jpg" },
  dark_romance: { label: "🖤 Dark Romance", description: "Intense, obsessive, and morally grey love", prompt: "The tone is dark romance. Center the narrative around intense, obsessive, toxic, or morally complex romantic dynamics. Boundaries between love, possession, and danger are blurred. Tension should be extremely high, and relationships are consuming, overwhelming, and often unhealthy.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-romance-tone.jpg" },
  affectionate: { label: "🤗 Affectionate", description: "Warm, gentle, and comforting emotional closeness", prompt: "The tone is affectionate. Focus on warmth, care, and emotional closeness expressed through small, meaningful gestures. Physical contact is gentle and non-sexual-touches, smiles, quiet support. Prioritize comfort, trust, and soft emotional connection.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/affectionate-tone.jpg" },
  flirtatious: { label: "😏 Flirtatious", description: "Playful attraction, teasing, and witty chemistry", prompt: "The tone is flirtatious. Emphasize playful attraction, teasing, and suggestive banter. Dialogue should carry double meanings, light tension, and charm without becoming explicit. Keep interactions fun, lively, and driven by chemistry rather than emotional depth or physical detail.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/flirtatious-tone.jpg" },
  sensual: { label: "🕯️ Sensual", description: "Slow-building physical proximity and atmosphere", prompt: "The tone is sensual. Focus on physical presence, atmosphere, and slow-building intimacy. Describe touch, proximity, body language, and unspoken tension in detail. Keep it restrained-emphasize anticipation, awareness, and lingering moments rather than explicit acts.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/sensual-tone.jpg" },
  intimate: { label: "🧸 Intimate", description: "Close relationships and deep emotional focus", prompt: "The tone is intimate. Deep emotional focus, quiet interactions, and close interpersonal dynamics.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/intimate-tone.jpg" },
  cute: { label: "🥰 Cute", description: "Sweet, comforting, and heartwarming moments", prompt: "The tone is cute and heartwarming (moe). Prioritize adorable behaviors, sweetness, comforting interactions, and soft, endearing moments. Focus on innocence and charm.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cute-tone.jpg" },
  erotic: { label: "💋 Erotic", description: "Focus on sexual attraction and physical intimacy", prompt: "The tone is erotic. Sexual attraction and physical intimacy take center stage. Describe arousal, bodies, and sexual interaction with clear intent and detail. Prioritize desire, chemistry, and physical experience, but allow for some restraint and buildup rather than constant explicitness.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/erotic-tone.jpg" },
  smut: { label: "🔥 Smut", description: "Pure erotica focused on graphic intimacy", prompt: "The tone is smut and pure erotica. Focus intensely on graphic, unapologetic sexual intimacy, desire, arousal, and physical interactions. Prioritize raw lust and explicit detail, leaving nothing to the imagination. The plot serves strictly as a vehicle for sexual encounters.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/smut-tone.jpg" },
  explicit: { label: "🔞 Explicit", description: "Highly explicit, graphic, and intense passion", prompt: "The tone is pornographic and highly explicit. Raw, graphic, and shamelessly sexual. Focus intensely on detailed descriptions of bodies, sexual acts, arousal, fetishes, fluids, sounds, smells, and physical sensations. Be hardcore. Prioritize pure eroticism, lust, and explicit sex over plot or emotion. Leave nothing to the imagination - be as vulgar, lewd, and visually descriptive as possible.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/explicit-tone.jpg" },
  dark: { label: "💀 Dark", description: "Grim, gritty, scary, and high stakes", prompt: "A dark, grim, gritty, scary, and high stakes tone.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-tone.jpg" },
  dark_gritty: { label: "⛓️ Dark & Gritty", description: "Harsh, morally complex, and unforgiving world", prompt: "The tone is dark and gritty. The world is harsh, unforgiving, and morally complex. Characters are flawed, survival often comes at a cost, and hope is fragile or absent. Do not soften violence, suffering, or ethical ambiguity-lean into discomfort, tension, and realism.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-gritty-tone.jpg" },
  horror: { label: "😱 Horror", description: "Spooky, terrifying, supernatural, or psychological fear", prompt: "A horror setting designed to evoke spooky, terrifying, supernatural, or psychological fear.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/horror-setting.jpg" },
  gory: { label: "🩸 Gory", description: "Vivid, explicit violence and visceral combat", prompt: "The tone is gory and visceral. Describe physical violence, wounds, blood, and body horror in explicit, vivid detail. Emphasize the visceral nature of combat or horror.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/gory-tone.jpg" },
  brutal: { label: "🔨 Brutal", description: "Ruthless realism and harsh physical/emotional truth", prompt: "The tone is brutal. Ruthless realism, harsh physical and emotional cruelty, and unvarnished truth.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/brutal-tone.jpg" },
  claustrophobic: { label: "📦 Claustrophobic", description: "Confinement, tight spaces, and rising pressure", prompt: "The tone is claustrophobic. Confinement, emotional suffocation, rising pressure, and small spaces.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/claustrophobic-tone.jpg" },
  paranoid: { label: "👁️ Paranoid", description: "Deep suspicion, secrets, and decaying trust", prompt: "The tone is paranoid. Everyone hides something, trust decays constantly, and safety is an illusion.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/paranoid-tone.jpg" },
  tragic: { label: "🎭 Tragic", description: "Loss, inevitability, and emotional weight", prompt: "The tone is tragic. Center the narrative around loss, inevitability, and emotional weight. Characters may struggle, hope, or resist, but their path is shaped by forces they cannot fully escape. Emphasize sacrifice, consequence, and the slow or sudden collapse of what matters most.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/tragic-tone.jpg" },
  melancholic: { label: "😢 Melancholic", description: "Sad, reflective, and touching", prompt: "A melancholic tone that is sad, reflective, and touching.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/melancholic-tone.jpg" },
  nihilistic: { label: "🕳️ Nihilistic", description: "Futility, erosion of meaning, and quiet void", prompt: "The tone is nihilistic. Meaninglessness, futility, emotional erosion, and a quiet acceptance of the void.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/nihilistic-tone.jpg" },
  lonely: { label: "🍂 Lonely", description: "Emotional isolation and longing for connection", prompt: "The tone is lonely. Isolation, quiet spaces, and the longing for connection form the emotional core.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/lonely-tone.jpg" },
  lighthearted: { label: "☀️ Lighthearted", description: "Bright, positive, and whimsical", prompt: "A lighthearted, bright, positive, and whimsical tone.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/lighthearted-tone.jpg" },
  light_hearted_comedic: { label: "🤪 Lighthearted Comedic", description: "Fun, witty, and playful humor", prompt: "The tone is lighthearted and comedic. Prioritize humor, charm, and entertainment. Dialogue should be witty or playful, situations can be exaggerated for comedic effect, and emotional weight is kept low. Even conflict should feel fun, absurd, or endearing rather than heavy.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/light-hearted-comedic-tone.jpg" },
  humorous: { label: "😂 Humorous", description: "Funny, witty, and lighthearted comedy", prompt: "A humorous, witty, and lighthearted comedic tone.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/humorous-tone.jpg" },
  dark_humour: { label: "💀 Dark Humor", description: "Taboo themes with dry wit and black comedy", prompt: "The tone is dark humor. Combine morbid, taboo, or tragic themes with dry wit, sarcasm, and black comedy. Contrast serious situations with comedic absurdity.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-humour-tone.jpg" },
  cozy: { label: "☕ Cozy", description: "Small stakes, warm routines, and emotional safety", prompt: "The tone is cozy. Small stakes, comforting routines, emotional safety, warmth, and quiet moments.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cozy-tone.jpg" },
  hopepunk: { label: "✊ Hopepunk", description: "Optimistic resistance and fighting for a better world", prompt: "The tone is hopepunk. Defiant optimism, kindness as resistance, and fighting for a better world against impossible odds.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/hopepunk-tone.jpg" },
  euphoric: { label: "🌈 Euphoric", description: "Intense emotional highs, liberation, and ecstasy", prompt: "The tone is euphoric. Intense emotional highs, liberation, ecstasy, and overwhelming joy or energy.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/euphoric-tone.jpg" },
  genz_casual: { label: "💬 Gen-Z Casual", description: "Modern internet slang and informal dialog", prompt: "The tone is Gen-Z casual. Characters use modern internet slang, text-speak, and contemporary casual phrasing. Emphasize a laid-back, highly informal, sarcastic, or culturally-aware voice. Dialogue should feel like a modern group chat or TikTok comment section.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/genz-casual-tone.jpg" },
  action_packed: { label: "💥 Action-Packed", description: "High energy, fights, and chases", prompt: "An action-packed tone with high energy, fights, and chases.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/action-tone.jpg" },
  thrilling_action: { label: "⚡ Thrilling Action", description: "High-intensity action and suspense", prompt: "The tone is thrilling and high-intensity. Maintain constant momentum, urgency, and tension. Stakes are immediate and pressing, danger is ever-present, and scenes should push forward with speed and purpose. Minimize downtime-prioritize action, suspense, and escalation.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/thrilling-action-tone.jpg" },
  dramatic: { label: "🎭 Dramatic", description: "Emotional conflict and tension", prompt: "A dramatic tone with emotional conflict and tension.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dramatic-tone.jpg" },
  operatic: { label: "🎻 Operatic", description: "Dramatic extremes and larger-than-life encounters", prompt: "The tone is operatic. Massive emotional extremes, larger-than-life confrontations, and dramatic staging.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/operatic-tone.jpg" },
  epic: { label: "🌌 Epic", description: "Grand, mythic, and high-stakes scale", prompt: "The tone is epic and grand in scale. Events feel monumental, legendary, and larger than life. Emphasize vast settings, powerful forces, and high stakes that extend beyond individuals. Use elevated language and dramatic weight-this story should feel mythic and significant.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/epic-tone.jpg" },
  serious: { label: "😐 Serious", description: "Realistic, grave, and meaningful", prompt: "A serious, realistic, and meaningful tone.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/serious-tone.jpg" },
  grounded: { label: "🌍 Grounded", description: "Grounded, realistic, and believable characters", prompt: "The tone is grounded and realistic. Characters behave like real people with believable motivations, limitations, and consequences. Dialogue is natural, emotions are restrained, and events unfold without exaggeration, spectacle, or melodrama. Avoid stylization, fantasy logic, or convenient outcomes.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/grounded-tone.jpg" },
  cynical: { label: "😒 Cynical", description: "Weary worldview, failed systems, and skepticism", prompt: "The tone is cynical. A dry, weary worldview where institutions fail and idealists are viewed with skepticism.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cynical-tone.jpg" },
  stoic: { label: "🛡️ Stoic", description: "Suppressed emotion under quiet discipline", prompt: "The tone is stoic. Emotion is suppressed beneath a quiet restraint, calm discipline, and acceptance of fate.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/stoic-tone.jpg" },
  clinical: { label: "🔬 Clinical", description: "Factual, detached narration without bias", prompt: "The tone is clinical. Detached, cold, observational narration that reports facts and actions without emotional bias.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/clinical-tone.jpg" },
  documentary: { label: "📹 Documentary", description: "Objective, detached, and factual observation", prompt: "The tone is documentary. The narrative is objective, analytical, and highly descriptive, as if observed through a camera lens by a detached third-party narrator. Focus on observable facts, environments, and behavioral analysis rather than inner subjective emotions.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/documentary-tone.jpg" },
  satirical_biting: { label: "🎯 Biting Satire", description: "Sharp wit, social critique, and exposing hypocrisy", prompt: "The tone is bitingly satirical. Aggressive social critique, sharp wit, and expose of hypocrisy.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/satirical-biting-tone.jpg" },
  existential: { label: "🌌 Existential", description: "Focus on identity, mortality, and consciousness", prompt: "The tone is existential. Deep focus on identity, purpose, mortality, and the nature of consciousness.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/existential-tone.jpg" },
  surreal: { label: "🍄 Surreal", description: "Dreamlike logic bending with emotional coherence", prompt: "The tone is surreal. Logic bends constantly but remains emotionally coherent and dreamlike.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/surreal-tone.jpg" },
  whimsical: { label: "🦄 Whimsical", description: "Dreamlike, imaginative, and surreal rules", prompt: "The tone is whimsical and dreamlike. Embrace imagination, strangeness, and playful absurdity. The world may operate on surreal or illogical rules, and characters can react with curiosity or delight rather than concern. Prioritize wonder, oddity, and creative unpredictability.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/whimsical-tone.jpg" },
  chaotic: { label: "🌀 Chaotic", description: "Unpredictable pacing and volatile impulses", prompt: "The tone is chaotic. Unpredictable pacing, unstable situations, and volatile characters acting on impulse.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/chaotic-tone.jpg" },
  campy: { label: "💅 Campy", description: "Self-aware humor and over-the-top theatricality", prompt: "The tone is campy. Over-the-top theatrical absurdity, self-aware humor, and exaggerated playfulness.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/campy-tone.jpg" },
  hallucinatory: { label: "🔮 Hallucinatory", description: "Distorted senses where dreams and reality blur", prompt: "The tone is hallucinatory. Reality is uncertain, senses are distorted, and dream and waking states blur.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/hallucinatory-tone.jpg" },
  reverent: { label: "🛐 Reverent", description: "Sacred seriousness, quiet awe, and dignity", prompt: "The tone is reverent. Treat all events and lore with sacred seriousness, quiet awe, and dignity.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/reverent-tone.jpg" },
  decadent: { label: "🍷 Decadent", description: "Indulgence, excess, and rotting luxury", prompt: "The tone is decadent. Excess, indulgence, moral decay, and luxury rotting from within.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/decadent-tone.jpg" },
  unhinged: { label: "🤪 Unhinged", description: "Manic energy and erratic, unstable behavior", prompt: "The tone is unhinged. Escalating instability, manic energy, and erratic behavioral choices.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/unhinged-tone.jpg" }
};

window.DEFAULT_WORLD_SETTINGS_DATA = {
  academy_fantasy: { label: "🏫 Academy Fantasy", description: "Magic schools, rival houses, and forbidden libraries", prompt: "The setting is a magic academy - magic schools, rival houses, forbidden libraries, elite bloodlines, exam arcs, and ancient faculty conspiracies.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/academy_fantasy-setting.jpg" },
  adventure: { label: "🏞️ Adventure", description: "Quests, exploration, and thrilling journeys", prompt: "An adventure setting filled with quests, exploration, and thrilling journeys.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/adventure-setting.jpg" },
  alien_apocalypse: { label: "👽 Alien Apocalypse", description: "Earth invaded and conquered by a hostile alien species", prompt: "The setting is an alien apocalypse. Earth has been invaded and conquered by a hostile, highly advanced extraterrestrial species. Humans are hunted, enslaved, or forced into hiding among the ruins of civilization.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/alien_apocalypse-setting.jpg" },
  arcology: { label: "🗼 Arcology", description: "Single giant vertical city containing millions vertically stacked", prompt: "The setting is an arcology - a single giant vertical city containing millions vertically stacked.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/arcology-setting.jpg" },
  biohorror: { label: "🥩 Biohorror", description: "Flesh architecture, parasitic cities, and mutating ecosystems", prompt: "The setting is biohorror - flesh architecture, parasitic cities, and mutating ecosystems.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/biohorror-setting.jpg" },
  biopunk: { label: "🧬 Biopunk", description: "Biotech, genetic engineering, and organic machines", prompt: "The setting is driven by biotechnology - genetic engineering, organic machines, and body modification. Society is shaped by biological manipulation rather than mechanical tech. Races may include modified humans, lab-grown beings, or hybrids.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/biopunk-setting.jpg" },
  broken_moon: { label: "🌙 Broken Moon", description: "Reality shaped by a shattered moon raining magic or disasters", prompt: "The setting is a broken moon world - reality is shaped by a shattered moon raining magic or disasters.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/broken_moon-setting.jpg" },
  celestial_court: { label: "⭐ Celestial Court", description: "Politics among stars where constellations are living beings", prompt: "The setting is a celestial court - politics among stars, where constellations are living beings.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/celestial_court-setting.jpg" },
  corporate_dystopia: { label: "🏢 Corporate Dystopia", description: "Nations have been replaced by all-powerful corporations", prompt: "The setting is a corporate dystopia - nations have been replaced by all-powerful corporations.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/corporate_dystopia-setting.jpg" },
  cosmic_horror: { label: "🐙 Cosmic Horror", description: "Reality-breaking entities, incomprehensible truths, and doomed civilizations", prompt: "The setting is cosmic horror - reality-breaking entities, incomprehensible truths, and doomed civilizations.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cosmic_horror-setting.jpg" },
  cultivation: { label: "🧘 Cultivation", description: "Spiritual realms, immortality paths, and sect politics", prompt: "The setting is a cultivation world inspired by Xianxia/Xuanhuan - spiritual realms, immortality paths, sect politics, and heavenly tribulations.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cultivation-setting.jpg" },
  cyberpunk: { label: "🦾 Cyberpunk", description: "High tech, low life, and neon cities", prompt: "A cyberpunk setting featuring high tech, low life, neon lights, and megacorps.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cyberpunk-setting.jpg" },
  dark_fantasy: { label: "🔮 Dark Fantasy", description: "Grim, brutal, and morally bleak fantasy world", prompt: "The setting is a grim dark fantasy world - brutal, morally bleak, and unforgiving. Magic is dangerous, corrupting, or rare. Survival often comes at a cost. Any race is appropriate, but tone should remain oppressive and tragic.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark_fantasy-setting.jpg" },
  deep_jungle: { label: "🌴 Deep Jungle", description: "Lost civilizations, fungal intelligence, and predator ecology", prompt: "The setting is deep jungle - lost civilizations, fungal intelligence, and predator ecology.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/deep_jungle-setting.jpg" },
  desertpunk: { label: "🏜️ Desertpunk", description: "Sand empires, scavenger caravans, and solar dynasties", prompt: "The setting is desertpunk - sand empires, scavenger caravans, and solar dynasties.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/desertpunk-setting.jpg" },
  dieselpunk: { label: "🏭 Dieselpunk", description: "1920s-1940s gritty industrial technology and noir tones", prompt: "The setting is inspired by the 1920s-1940s with gritty industrial technology, war-era machinery, and noir tones. Think propaganda, rebellion, and looming conflict. Races should be human or human-like unless otherwise justified.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dieselpunk-setting.jpg" },
  divine_war: { label: "🔱 Divine War", description: "Gods openly waging war through mortal nations and avatars", prompt: "The setting is a divine war - gods openly waging war through mortal nations and avatars.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/divine_war-setting.jpg" },
  dream_war: { label: "💤 Dream War", description: "Conflicts fought through dreams and subconscious landscapes", prompt: "The setting is a dream war - conflicts fought through dreams and subconscious landscapes.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dream_war-setting.jpg" },
  dreamlike: { label: "💭 Dreamlike", description: "Surreal, shifting, and symbolic dream logic", prompt: "The setting follows dream logic - surreal, shifting, and symbolic. Reality is unstable and may not obey consistent rules. Any race is appropriate, but the tone should feel strange and fluid.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dreamlike-setting.jpg" },
  eldritch_seafaring: { label: "⚓ Eldritch Seafaring", description: "Whaling horror, abyss cults, and sentient oceans", prompt: "The setting is eldritch seafaring - whaling horror, abyss cults, and sentient oceans.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/eldritch_seafaring-setting.jpg" },
  fairy_tale: { label: "🍄 Fairy Tale", description: "Whimsical and symbolic forest world of curses and rules", prompt: "The setting follows the logic of fairy tales - symbolic, whimsical, and often dark beneath the surface. Forests, curses, royalty, and strange rules define reality. Any race is appropriate, especially magical beings.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/fairy_tale-setting.jpg" },
  fantasy: { label: "🏰 Fantasy", description: "Magic, mythical creatures, and ancient kingdoms", prompt: "A fantasy setting defined by magic, mythical creatures, and ancient kingdoms.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/fantasy-setting.jpg" },
  feudal_japan_fantasy: { label: "🏯 Feudal Japan Fantasy", description: "Yokai clans, oni wars, and samurai politics", prompt: "The setting is feudal Japan fantasy - yokai clans, oni wars, and samurai politics.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/feudal_japan_fantasy-setting.jpg" },
  floating_islands: { label: "☁️ Floating Islands", description: "Sky airship economies, sky whales, and falling kingdoms", prompt: "The setting is floating islands - sky airship economies, sky whales, and falling kingdoms.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/floating_islands-setting.jpg" },
  frozen_apocalypse: { label: "❄️ Frozen Apocalypse", description: "Ice, snowstorms, and survival in extreme cold", prompt: "The setting is a world locked in extreme cold - ice, snowstorms, and dwindling resources dominate survival. Civilization has adapted or collapsed under the cold. Characters are typically human or cold-adapted variants.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/frozen_apocalypse-setting.jpg" },
  gothic: { label: "🥀 Gothic", description: "Decaying grandeur, haunted mansions, and tragic figures", prompt: "The setting is a gothic world of decaying grandeur - haunted mansions, tragic figures, and heavy atmosphere. Themes of obsession, decay, and melancholy dominate. Any race is appropriate, but lean toward human or near-human.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/gothic-setting.jpg" },
  grimdark: { label: "💀 Grimdark", description: "Dark, gritty, and amoral worlds", prompt: "A grimdark setting characterized by dark, gritty, and amoral fantasy or sci-fi environments.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/grimdark-setting.jpg" },
  hard_sci_fi: { label: "📡 Hard Sci-Fi", description: "Grounded science fiction with scientific accuracy", prompt: "The setting is grounded science fiction with a strong emphasis on scientific accuracy and realism. Technology should feel plausible and well-explained. Races are typically human or scientifically plausible alien lifeforms.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/hard_sci_fi-setting.jpg" },
  heaven_hell_war: { label: "👼 Heaven & Hell War", description: "Bureaucratic angels, infernal politics, and souls as currency", prompt: "The setting is a heaven and hell war - bureaucratic angels, infernal politics, and souls used as currency.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/heaven_hell_war-setting.jpg" },
  high_fantasy: { label: "👑 High Fantasy", description: "Warring kingdoms, world-altering prophecies, and ancient magic", prompt: "The setting is an epic high fantasy world of warring kingdoms, world-altering prophecies, and ancient magic. Any race or species is appropriate - lean toward the fantastical.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/high_fantasy-setting.jpg" },
  historical: { label: "📜 Historical", description: "Set in a specific historical era", prompt: "A historical setting set in a specific real-world historical era.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/historical-setting.jpg" },
  horror: { label: "😱 Horror", description: "Spooky, terrifying, and psychological fear", prompt: "A horror setting designed to evoke spooky, terrifying, supernatural, or psychological fear.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/horror-setting.jpg" },
  infernal_modern: { label: "😈 Infernal Modern", description: "Modern world where demons are normalized institutions", prompt: "The setting is infernal modern - a modern world where demons are normalized institutions.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/infernal_modern-setting.jpg" },
  isekai: { label: "🧙‍♂️ Isekai", description: "Reborn or transported to another world", prompt: "An isekai setting where protagonist is reborn or transported to a completely different world.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/isekai-setting.jpg" },
  kaiju_apocalypse: { label: "🦖 Kaiju Apocalypse", description: "Humanity survives between roaming titanic monsters", prompt: "The setting is a kaiju apocalypse - humanity survives between roaming titanic monsters and ruined landscapes.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/kaiju_apocalypse-setting.jpg" },
  lunar_colony: { label: "🌑 Lunar Colony", description: "Harsh moon survival, corporate exploitation, and isolation", prompt: "The setting is a lunar colony - harsh moon survival, corporate exploitation, and psychological isolation.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/lunar_colony-setting.jpg" },
  magitech: { label: "🔌 Magitech", description: "Fantasy powered by industrialized magic and arcane reactors", prompt: "The setting is a magitech world - fantasy powered by industrialized magic, arcane reactors, spell-guns, and a magical internet.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/magitech-setting.jpg" },
  medieval_fantasy: { label: "⚔️ Medieval Fantasy", description: "Castles, knights, and feudal politics", prompt: "The setting is a medieval fantasy world with castles, knights, and feudal politics. Any race or species is appropriate.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/medieval_fantasy-setting.jpg" },
  megadungeon: { label: "🕳️ Megadungeon", description: "Sprawling dungeon ecosystem and civilization", prompt: "The setting is a megadungeon world - civilization revolves around a massive, sprawling dungeon ecosystem.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/megadungeon-setting.jpg" },
  modern: { label: "🏙️ Modern", description: "Present-day world and contemporary life", prompt: "A modern, contemporary setting reflecting present-day life.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/modern-setting.jpg" },
  monster_hunter: { label: "🏹 Monster Hunter", description: "Civilization tracking, hunting, and harvesting giant beasts", prompt: "The setting is a monster hunter world - entire civilization is built around tracking, hunting, and harvesting giant beasts.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/monster_hunter-setting.jpg" },
  mythology: { label: "🏛️ Mythology", description: "Gods, heroes, monsters, and ancient powers", prompt: "The setting draws from real-world mythology - gods, heroes, monsters, and ancient powers made flesh. Any mythological race or creature is appropriate.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/mythology-setting.jpg" },
  necropunk: { label: "💀 Necropunk", description: "Society powered by necromancy, death magic, and corpse labor", prompt: "The setting is necropunk - society powered by necromancy, death magic, and corpse labor.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/necropunk-setting.jpg" },
  neo_noir: { label: "🕶️ Neo-Noir", description: "Rain-soaked urban corruption, cynical detectives, and decay", prompt: "The setting is neo-noir - rain-soaked urban corruption, cynical detectives, and moral decay.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/neo_noir-setting.jpg" },
  pirate_fantasy: { label: "🏴‍☠️ Pirate Fantasy", description: "Sea empires, cursed oceans, leviathans, and living islands", prompt: "The setting is a pirate fantasy world - sea empires, cursed oceans, leviathans, black markets, and living islands.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/pirate_fantasy-setting.jpg" },
  post_apocalyptic: { label: "☢️ Post-Apocalyptic", description: "Survival in a ruined, desolate world", prompt: "A post-apocalyptic setting of survival in a ruined, desolate world.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/post-apocalyptic-setting.jpg" },
  prehistoric_fantasy: { label: "🦖 Prehistoric Fantasy", description: "Stone-age tribes, megafauna, and primitive mysticism", prompt: "The setting is prehistoric fantasy - stone-age tribes, megafauna, primitive mysticism, and volcanic gods.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/prehistoric_fantasy-setting.jpg" },
  prison_world: { label: "🔒 Prison World", description: "Giant prison planet or prison society", prompt: "The setting is a prison world - the entire world or planet is one giant prison society.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/prison_world-setting.jpg" },
  real_world_fantasy: { label: "🪄 Real World Fantasy", description: "Modern world where magic and fantasy races exist", prompt: "The setting is the contemporary real world but magic is real and many fantasy races exist alongside humans. Modern institutions and culture coexist with ancient magical powers. Any race is appropriate.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/real_world_fantasy-setting.jpg" },
  real_world_furry: { label: "🐾 Real World Furry", description: "Modern world populated by anthropomorphic animal characters", prompt: "The setting is the contemporary real world - grounded and realistic in every way except all people are anthropomorphic animal characters (furries). The character must be an anthro animal. Their background should engage with real contemporary culture and social dynamics.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/real_world_furry-setting.jpg" },
  real_world_modern: { label: "🏢 Real World Modern", description: "Contemporary real world, grounded and realistic", prompt: "The setting is the contemporary real world. No magic, no fantasy - grounded and realistic. The character MUST be human. Their background should engage with real contemporary culture, institutions, and social dynamics.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/real_world_modern-setting.jpg" },
  retrofuturism: { label: "📻 Retrofuturism", description: "Old visions of the future, cassette futurism, and VHS aesthetics", prompt: "The setting is retrofuturism - old visions of the future, cassette futurism, atomic optimism, and VHS aesthetics.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/retrofuturism-setting.jpg" },
  romance: { label: "🌹 Romance", description: "Passionate, emotional, and relationship-driven", prompt: "A romance setting focused on passionate, emotional, and relationship-driven stories.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/romance-setting.jpg" },
  ruined_utopia: { label: "🏚️ Ruined Utopia", description: "Former paradise collapsing from hidden flaws", prompt: "The setting is a ruined utopia - a former paradise now collapsing from hidden flaws.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/ruined_utopia-setting.jpg" },
  satirical: { label: "🤡 Satirical", description: "Exaggerated world designed to parody systems or cultures", prompt: "The setting is exaggerated and designed to parody or critique real-world systems, genres, or cultures. Tone can range from comedic to biting. Any race is appropriate depending on what is being satirized.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/satirical-setting.jpg" },
  scifi: { label: "🛸 Sci-Fi", description: "Advanced tech, space travel, and future societies", prompt: "A science fiction setting characterized by advanced technology, space travel, and future societies.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/scifi-setting.jpg" },
  slice_of_life: { label: "🍰 Slice of Life", description: "Everyday experiences and calm vibes", prompt: "A slice of life setting depicting everyday experiences, calm vibes, and small moments.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/slice-of-life-setting.jpg" },
  solarpunk: { label: "☀️ Solarpunk", description: "Optimistic coexistence of nature and technology", prompt: "The setting is a solarpunk world - optimistic, ecological, communal, and beautifully overgrown. Technology and nature coexist. Any race is appropriate.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/solarpunk-setting.jpg" },
  space_opera: { label: "🚀 Space Opera", description: "Grand interstellar saga, empires, and sweeping stakes", prompt: "The setting is a grand, dramatic interstellar saga - empires, rebels, alien civilizations, and sweeping stakes. Technology is advanced but stylized. Any race is appropriate - go bold and imaginative.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/space_opera-setting.jpg" },
  steampunk: { label: "⚙️ Steampunk", description: "Steam-powered machines in Victorian aesthetics", prompt: "A steampunk setting with steam-powered machines in a Victorian aesthetic.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/steampunk-setting.jpg" },
  time_collapse: { label: "⏳ Time Collapse", description: "Multiple historical and future eras overlapping simultaneously", prompt: "The setting is a time collapse - multiple historical and future eras overlapping simultaneously.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/time_collapse-setting.jpg" },
  tribal_fantasy: { label: "🏕️ Tribal Fantasy", description: "Clan structures, oral traditions, and animist magic", prompt: "The setting is tribal fantasy - clan structures, oral traditions, and animist magic systems.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/tribal_fantasy-setting.jpg" },
  underwater: { label: "🌊 Underwater", description: "Deep sea cities, aquatic life, and crushing pressure", prompt: "The setting takes place beneath the ocean - deep sea cities, alien ecosystems, and crushing pressure define life. Races should be aquatic or adapted to underwater environments.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/underwater-setting.jpg" },
  urban_fantasy: { label: "🌃 Urban Fantasy", description: "Magic coexisting secretly within a modern city", prompt: "The setting is a modern city where magic exists in secret or just beneath the surface. Hidden societies, supernatural politics, and double lives are common. Any race is appropriate, but they must plausibly exist within or alongside human society.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/urban_fantasy-setting.jpg" },
  vampire_gothic: { label: "🦇 Vampire Gothic", description: "Ruled by immortal aristocrats, dark castles, and blood politics", prompt: "The setting is vampire gothic - entire societies ruled by immortal aristocrats, dark castles, and blood-soaked politics.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/vampire_gothic-setting.jpg" },
  virtual_world: { label: "🌐 Virtual World", description: "Virtual simulation or MMO game setting", prompt: "The setting is a virtual world - the entire setting exists inside a simulation or MMO game.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/virtual_world-setting.jpg" },
  weird_west: { label: "🤠 Weird West", description: "Wild west frontier with supernatural or occult forces", prompt: "The setting is a wild west frontier with strange or supernatural elements - occult forces, bizarre technology, or alien influence. Gunslingers, outlaws, and isolated towns are central. Any race is appropriate but should fit the frontier tone.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/weird_west-setting.jpg" },
  wuxia: { label: "☯️ Wuxia", description: "East Asian martial arts epics and rival sects", prompt: "The setting is inspired by martial arts epics - wandering heroes, rival sects, honor codes, and mystical techniques. Set in a stylized historical East Asian world. Characters are typically human but may have exaggerated, near-supernatural abilities.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/wuxia-setting.jpg" },
  zombie_apocalypse: { label: "🧟 Zombie Apocalypse", description: "Ruined cities, scavengers, and reanimated dead", prompt: "The setting is a zombie apocalypse. A viral outbreak or supernatural plague has reanimated the dead. Survivors scavenge for food, water, and ammunition in ruined cities while defending against swarms of infected.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/zombie_apocalypse-setting.jpg" }
};

(function () {
  function parseSimpleYaml(yamlText) {
    let result = {};
    let currentKey = null;
    let lines = yamlText.split("\n");
    for (let line of lines) {
      if (!line.trim() || line.trim().startsWith("#") || line.trim().startsWith("//")) continue;
      let indent = line.search(/\S/);
      let trimmed = line.trim();
      if (indent === 0 && trimmed.includes(":")) {
        let parts = trimmed.split(":");
        currentKey = parts[0].trim();
        result[currentKey] = {};
      } else if (currentKey && indent > 0 && trimmed.includes(":")) {
        let colonIdx = trimmed.indexOf(":");
        let subKey = trimmed.substring(0, colonIdx).trim();
        let subVal = trimmed.substring(colonIdx + 1).trim();
        if ((subVal.startsWith('"') && subVal.endsWith('"')) || (subVal.startsWith("'") && subVal.endsWith("'"))) {
          subVal = subVal.substring(1, subVal.length - 1);
        }
        result[currentKey][subKey] = subVal;
      }
    }
    return result;
  }

  // Single global hover card preview tooltip
  let globalHoverCard = null;

  function ensureHoverCard() {
    if (!globalHoverCard && typeof document !== "undefined" && document.body) {
      globalHoverCard = document.createElement("div");
      globalHoverCard.id = "cTagGlobalHoverCard";
      globalHoverCard.className = "c-tag-hover-card";
      globalHoverCard.innerHTML = `
        <div class="c-tag-hover-card__overlay">
          <div class="c-tag-hover-card__title" id="cTagCardTitle"></div>
          <div class="c-tag-hover-card__desc" id="cTagCardDesc"></div>
          <div class="c-tag-hover-card__prompt" id="cTagCardPrompt"></div>
        </div>
      `;
      document.body.appendChild(globalHoverCard);
    }
  }

  function showHoverCard(e, tagInfo) {
    ensureHoverCard();
    if (!globalHoverCard || !tagInfo) return;

    let titleEl = document.getElementById("cTagCardTitle");
    let descEl = document.getElementById("cTagCardDesc");
    let promptEl = document.getElementById("cTagCardPrompt");

    if (titleEl) titleEl.innerText = tagInfo.label || tagInfo.key;
    if (descEl) descEl.innerText = tagInfo.description || "";
    if (promptEl) promptEl.innerText = tagInfo.prompt ? `"${tagInfo.prompt}"` : "";

    if (tagInfo.image) {
      globalHoverCard.style.backgroundImage = `url("${tagInfo.image}")`;
    } else {
      globalHoverCard.style.backgroundImage = "none";
    }

    positionHoverCard(e);
    globalHoverCard.classList.add("c-tag-hover-card--visible");
  }

  function positionHoverCard(e) {
    if (!globalHoverCard) return;
    let x = e.clientX + 16;
    let y = e.clientY + 16;
    let cardRect = globalHoverCard.getBoundingClientRect();
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;

    if (x + cardRect.width > winWidth - 16) {
      x = e.clientX - cardRect.width - 16;
    }
    if (y + cardRect.height > winHeight - 16) {
      y = e.clientY - cardRect.height - 16;
    }

    globalHoverCard.style.left = Math.max(10, x) + "px";
    globalHoverCard.style.top = Math.max(10, y) + "px";
  }

  function hideHoverCard() {
    if (globalHoverCard) {
      globalHoverCard.classList.remove("c-tag-hover-card--visible");
    }
  }

  class TagSelector {
    constructor(containerId, options) {
      this.containerId = containerId;
      this.options = options || {};
      this.title = options.title || "Tags";
      this.yamlUrl = options.yamlUrl || "";
      this.placeholder = options.placeholder || "Type to search or add custom tag...";
      this.onChange = options.onChange || function () {};
      this.selectedTags = options.initialTags || [];
      this.data = options.defaultData || {};
      this.isLoaded = false;
      this.activeSuggestionIdx = -1;

      this.init();
    }

    async init() {
      this.containerEl = document.getElementById(this.containerId);
      if (!this.containerEl) {
        let attempts = 0;
        let timer = setInterval(() => {
          attempts++;
          this.containerEl = document.getElementById(this.containerId);
          if (this.containerEl) {
            clearInterval(timer);
            this.render();
          } else if (attempts > 30) {
            clearInterval(timer);
          }
        }, 50);
      } else {
        // Render immediately with default embedded data
        this.render();
      }

      // Fetch latest YAML if network is available
      if (this.yamlUrl) {
        try {
          const isLocal = !window.location.hostname.includes("perchance.org");
          const basePath = isLocal ? "" : "https://minimumlogix.github.io/Perchance/CDG/";
          const fetchPath = this.yamlUrl.startsWith("http") ? this.yamlUrl : basePath + this.yamlUrl;
          
          let res = await fetch(fetchPath);
          let text = await res.text();
          let parsed = parseSimpleYaml(text);
          if (parsed && Object.keys(parsed).length > 0) {
            this.data = Object.assign({}, this.data, parsed);
            this.isLoaded = true;
            this.render();
          }
        } catch (err) {
          // Fallback to embedded default data silently
        }
      }
    }

    render() {
      this.containerEl = document.getElementById(this.containerId);
      if (!this.containerEl) return;
      this.containerEl.innerHTML = "";

      let sectionEl = document.createElement("div");
      sectionEl.className = "c-tag-section";

      let labelEl = document.createElement("div");
      labelEl.className = "c-tag-section__label";
      labelEl.innerText = `${this.title}:`;

      let wrapperEl = document.createElement("div");
      wrapperEl.className = "c-tag-wrapper";

      let tagBoxEl = document.createElement("div");
      tagBoxEl.className = "c-tag-container";

      // Render existing selected tag pills
      this.selectedTags.forEach((tagText) => {
        let tagInfo = this.findTagInfo(tagText);
        let pillEl = document.createElement("div");
        pillEl.className = "c-tag-pill";
        pillEl.innerHTML = `
          <span>${tagInfo ? (tagInfo.label || tagText) : tagText}</span>
          <button type="button" class="c-tag-pill__remove" title="Remove">&times;</button>
        `;

        if (tagInfo) {
          pillEl.addEventListener("mouseenter", (e) => showHoverCard(e, tagInfo));
          pillEl.addEventListener("mousemove", (e) => positionHoverCard(e));
          pillEl.addEventListener("mouseleave", () => hideHoverCard());
        }

        let removeBtn = pillEl.querySelector(".c-tag-pill__remove");
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          hideHoverCard();
          this.removeTag(tagText);
        });

        tagBoxEl.appendChild(pillEl);
      });

      // Input field
      let inputWrapper = document.createElement("div");
      inputWrapper.className = "c-tag-input-wrapper";
      let inputEl = document.createElement("input");
      inputEl.type = "text";
      inputEl.className = "c-tag-input";
      inputEl.placeholder = this.placeholder;

      inputWrapper.appendChild(inputEl);
      tagBoxEl.appendChild(inputWrapper);

      // Dropdown container
      let dropdownEl = document.createElement("div");
      dropdownEl.className = "c-tag-dropdown u-hidden";
      tagBoxEl.appendChild(dropdownEl);

      // Right-side dice button matching c-textarea-actions
      let actionsEl = document.createElement("div");
      actionsEl.className = "c-tag-actions";
      actionsEl.innerHTML = `
        <button type="button" class="c-textarea-btn" title="Pick 3 Random ${this.title}s">
          <i class="bi bi-dice-5-fill"></i>
        </button>
      `;

      let randomBtn = actionsEl.querySelector(".c-textarea-btn");
      randomBtn.addEventListener("click", () => this.randomize());

      wrapperEl.appendChild(tagBoxEl);
      wrapperEl.appendChild(actionsEl);

      sectionEl.appendChild(labelEl);
      sectionEl.appendChild(wrapperEl);
      this.containerEl.appendChild(sectionEl);

      this.inputEl = inputEl;
      this.dropdownEl = dropdownEl;

      this.bindEvents();
    }

    bindEvents() {
      if (!this.inputEl) return;

      this.inputEl.addEventListener("input", (e) => {
        if (this.inputEl.value.includes(",")) {
          let parts = this.inputEl.value.split(",");
          this.inputEl.value = parts.pop();
          parts.forEach((p) => {
            if (p.trim()) this.addTag(p.trim());
          });
        }
        this.onSearchInput();
      });

      this.inputEl.addEventListener("focus", () => this.onSearchInput());

      this.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          this.selectActiveOrAddCustom();
        } else if (e.key === "Backspace" && !this.inputEl.value && this.selectedTags.length > 0) {
          this.removeTag(this.selectedTags[this.selectedTags.length - 1]);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          this.moveActiveSuggestion(1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.moveActiveSuggestion(-1);
        } else if (e.key === "Escape") {
          this.closeDropdown();
        }
      });

      document.addEventListener("click", (e) => {
        if (this.containerEl && !this.containerEl.contains(e.target)) {
          this.closeDropdown();
        }
      });
    }

    findTagInfo(tagText) {
      if (!this.data) return null;
      if (this.data[tagText]) return Object.assign({ key: tagText }, this.data[tagText]);
      for (let k in this.data) {
        if (this.data[k].label === tagText || k === tagText) {
          return Object.assign({ key: k }, this.data[k]);
        }
      }
      return null;
    }

    onSearchInput() {
      let query = this.inputEl.value.trim().toLowerCase();
      let matches = [];

      for (let k in this.data) {
        let item = this.data[k];
        let label = (item.label || k).toLowerCase();
        let desc = (item.description || "").toLowerCase();

        let isAlreadySelected = this.selectedTags.some((t) => t === k || t === item.label);
        if (!isAlreadySelected && (label.includes(query) || desc.includes(query) || k.toLowerCase().includes(query))) {
          matches.push(Object.assign({ key: k }, item));
        }
      }

      this.renderDropdown(matches);
    }

    renderDropdown(matches) {
      if (!this.dropdownEl) return;
      this.dropdownEl.innerHTML = "";
      this.activeSuggestionIdx = -1;

      if (matches.length === 0) {
        this.closeDropdown();
        return;
      }

      matches.slice(0, 10).forEach((item, idx) => {
        let itemEl = document.createElement("div");
        itemEl.className = "c-tag-dropdown__item";
        itemEl.dataset.key = item.key;
        itemEl.dataset.label = item.label || item.key;
        itemEl.innerHTML = `
          <div class="c-tag-dropdown__title">${item.label || item.key}</div>
          ${item.description ? `<div class="c-tag-dropdown__desc">${item.description}</div>` : ""}
        `;

        itemEl.addEventListener("mouseenter", (e) => {
          this.setActiveSuggestion(idx);
          showHoverCard(e, item);
        });
        itemEl.addEventListener("mousemove", (e) => positionHoverCard(e));
        itemEl.addEventListener("mouseleave", () => hideHoverCard());

        itemEl.addEventListener("click", () => {
          hideHoverCard();
          this.addTag(item.key);
          this.inputEl.value = "";
          this.closeDropdown();
        });

        this.dropdownEl.appendChild(itemEl);
      });

      this.dropdownEl.classList.remove("u-hidden");
    }

    setActiveSuggestion(idx) {
      let items = this.dropdownEl.querySelectorAll(".c-tag-dropdown__item");
      items.forEach((el, i) => {
        if (i === idx) {
          el.classList.add("c-tag-dropdown__item--active");
        } else {
          el.classList.remove("c-tag-dropdown__item--active");
        }
      });
      this.activeSuggestionIdx = idx;
    }

    moveActiveSuggestion(dir) {
      let items = this.dropdownEl.querySelectorAll(".c-tag-dropdown__item");
      if (items.length === 0) return;

      let newIdx = this.activeSuggestionIdx + dir;
      if (newIdx < 0) newIdx = items.length - 1;
      if (newIdx >= items.length) newIdx = 0;

      this.setActiveSuggestion(newIdx);

      let activeEl = items[newIdx];
      let itemKey = activeEl.dataset.key;
      let tagInfo = this.findTagInfo(itemKey);
      if (tagInfo) {
        let rect = activeEl.getBoundingClientRect();
        showHoverCard({ clientX: rect.right, clientY: rect.top }, tagInfo);
      }
    }

    selectActiveOrAddCustom() {
      let items = this.dropdownEl.querySelectorAll(".c-tag-dropdown__item");
      if (this.activeSuggestionIdx >= 0 && items[this.activeSuggestionIdx]) {
        let key = items[this.activeSuggestionIdx].dataset.key;
        this.addTag(key);
      } else if (this.inputEl.value.trim()) {
        this.addTag(this.inputEl.value.trim());
      }
      this.inputEl.value = "";
      this.closeDropdown();
    }

    closeDropdown() {
      if (this.dropdownEl) {
        this.dropdownEl.classList.add("u-hidden");
      }
      hideHoverCard();
    }

    addTag(tag) {
      if (!tag) return;
      let cleaned = tag.replace(/,/g, "").trim();
      if (cleaned && !this.selectedTags.includes(cleaned)) {
        this.selectedTags.push(cleaned);
        this.render();
        this.onChange(this.selectedTags);
      }
    }

    removeTag(tag) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
      this.render();
      this.onChange(this.selectedTags);
    }

    randomize() {
      if (!this.data) return;
      let keys = Object.keys(this.data);
      if (keys.length === 0) return;

      let shuffled = keys.slice().sort(() => 0.5 - Math.random());
      this.selectedTags = shuffled.slice(0, Math.min(3, keys.length));
      this.render();
      this.onChange(this.selectedTags);
    }

    getSelectedPrompts() {
      let prompts = [];
      let seen = new Set();

      this.selectedTags.forEach((t) => {
        let info = this.findTagInfo(t);
        let val = (info && info.prompt) ? info.prompt : t;
        if (val && !seen.has(val)) {
          seen.add(val);
          prompts.push(val);
        }
      });

      // Capture active typed input text even if user didn't press Enter before generating
      let rawInput = (this.inputEl && typeof this.inputEl.value === "string") ? this.inputEl.value.trim() : "";
      if (rawInput) {
        let typedVal = rawInput.replace(/,/g, "");
        if (typedVal) {
          let info = this.findTagInfo(typedVal);
          let val = (info && info.prompt) ? info.prompt : typedVal;
          if (val && !seen.has(val)) {
            seen.add(val);
            prompts.push(val);
          }
        }
      }

      return prompts;
    }
  }

  window.TagSelector = TagSelector;
})();
