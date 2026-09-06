/* ===========================
   TAG SELECTOR COMPONENT
=========================== */

window.DEFAULT_TONES_DATA = {
  uncensored: { label: "🔓 Uncensored", description: "Unfiltered, explicit, and unrestricted narrative freedom", prompt: "Present all scenes, actions, and environments with complete descriptive freedom and zero moralistic censorship. Dialogue should be unfiltered, bold, and raw, with characters expressing their true desires, vulgarities, and thoughts directly. Narration must depict physical moments, mature themes, and intense consequences without sanitization or puritanical restraint.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/uncensored-tone.jpg" },
  uncensored_casual: { label: "🤬 Uncensored Casual", description: "Raw, unfiltered casual dialogue with natural profanity and mature movie banter", prompt: "Write scene descriptions with raw, grounded realism free of sanitized phrasing or flowery filters. Dialogue must be authentic and unfiltered, featuring casual profanity, mature movie-style banter, and blunt real-world slang. Narration should focus on visceral physical tension, direct sensory details, and unhesitating character reactions.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/uncensored-tone.jpg" },
  deadpan_dry: { label: "😐 Deadpan & Dry", description: "Flat delivery of absurd, chaotic, or intense situations without emotion", prompt: "Describe extreme, bizarre, or chaotic situations with a calm, matter-of-fact observational lens. Dialogue must be delivered with completely flat intonation, understated reactions, and zero dramatic excitement. Narration should treat wild, absurd events as ordinary, unbothered everyday business.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cynical-tone.jpg" },
  hardboiled_noir: { label: "🕵️‍♂️ Hardboiled Noir", description: "Cynical inner monologues, gritty metaphors, and tough-guy dialogue", prompt: "Describe rain-slicked streets, dim shadows, heavy smoke, and urban decay with cynical sensory depth. Dialogue must be sharp, clipped, streetwise, and dripping with hard-bitten skepticism. Narration should feel like a weary, introspective monologue exposing corruption and bitter truths.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/neo_noir-setting.jpg" },
  sarcastic_snark: { label: "😏 Sarcastic Snark", description: "Biting retorts, eye-rolling irony, and witty passive-aggressive banter", prompt: "Frame descriptions with witty observation, playful cynicism, and keen attention to social ironies. Dialogue must feature biting retorts, eye-rolling irony, sharp jabs, and witty passive-aggressive banter. Narration should playfully highlight situational absurdities with amused, irreverent commentary.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cynical-playful-tone.jpg" },
  high_octane_hype: { label: "⚡ High-Octane Hype", description: "Fast trash-talking, intense adrenaline, and electric rivalry", prompt: "Describe combat, movement, and environments with explosive energy, rapid momentum, and dynamic sensory impact. Dialogue must be aggressive, fast-paced trash-talk filled with competitive adrenaline and bold declarations. Narration should maintain relentless forward speed where every action feels monumental and electric.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/thrilling-action-tone.jpg" },
  grandiose_theatrical: { label: "🦹 Grandiose & Theatrical", description: "Dramatic eloquence, theatrical arrogance, and sweeping declarations", prompt: "Describe character postures, gestures, and settings with dramatic flair, lavish staging, and operatic presence. Dialogue must be eloquently arrogant, poetic, and filled with sweeping theatrical declarations. Narration should treat every conflict as a legendary stage performance of epic proportions.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/operatic-tone.jpg" },
  tense_standoff: { label: "⏳ Tense Standoff", description: "Quiet, calculated dialogue loaded with unspoken threats", prompt: "Anchor scene descriptions in agonizing stillness, subtle micro-movements, and hair-trigger physical proximity. Dialogue must be quiet, measured, and heavily laced with unspoken lethal threats. Narration should stretch out every second so each breath and heartbeat feels like the verge of explosion.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-gritty-tone.jpg" },
  bittersweet_nostalgia: { label: "🌅 Bittersweet Nostalgia", description: "Warm memories tinged with gentle longing and passing time", prompt: "Describe environments and objects through the warm, melancholic haze of fading time and cherished memories. Dialogue should carry gentle longing, quiet intimacy, and fond references to the past. Narration must balance emotional warmth with the aching inevitability of change and loss.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/melancholic-tone.jpg" },
  mature_comedy: { label: "🔞 Mature Comedy", description: "Comedy tailored for adult audiences with dark or suggestive humor", prompt: "Describe comical situations and character mishaps with sharp, sophisticated, and adult-oriented observational wit. Dialogue should be clever, sexually suggestive, and packed with witty innuendos and adult bantering. Narration should embrace the messy absurdity of adult life, romance, and relationships with comedic timing.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/mature-comedy-tone.jpg" },
  r_rated_comedy: { label: "🎬 R-Rated Comedy", description: "High-energy comedy with crude humor, profanity, and wild situations", prompt: "Describe physical humor, wild antics, and chaotic set pieces with loud, outrageous, and unapologetic energy. Dialogue must be filthy, rapid-fire, and heavily profane, mirroring unfiltered R-rated comedy movies. Narration should push boundaries and lean into outrageous character blunders and hilarious escalations.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/r-rated-comedy-tone.jpg" },
  adult_comedy: { label: "🍷 Adult Comedy", description: "Sophisticated adult humor focusing on relationships, work, and life", prompt: "Frame scenes with realistic observations about careers, dating fatigue, domestic chaos, and social awkwardness. Dialogue should be witty, relatable, and packed with dry complaints and mature romantic banter. Narration should treat daily adult struggles and relationship absurdities with comedic flair.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/adult-comedy-tone.jpg" },
  irreverent_action_comedy: { label: "💥 Irreverent Action Comedy", description: "Wild action where nothing is sacred and humor interrupts chaos", prompt: "Describe high-stakes stunts, explosions, and violent action while constantly puncturing the tension with absurd gags. Dialogue must feature characters cracking irreverent jokes and mocking danger even in life-or-death moments. Narration should treat sacred tropes, authority figures, and severe threats as hilarious punchlines.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/irreverent-action-comedy-tone.jpg" },
  dark_action_comedy: { label: "💣 Dark Action Comedy", description: "Graphic action and violence treated with hilarious dark humor", prompt: "Describe intense, visceral combat and graphic action scenes with playful, blood-pumping dark humor. Dialogue should consist of witty quips, casual banter under gunfire, and macabre jokes about severe bodily harm. Narration should blend real physical danger with gleefully dark comedic timing.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-action-comedy-tone.jpg" },
  profane_comedy: { label: "🤬 Profane Comedy", description: "Frequent swearing and crude language as natural character speech", prompt: "Describe interactions and comedic frustrations with abrasive, high-energy realism. Dialogue must be laced with creative swearing, colorful insults, and crude slang as natural everyday speech. Narration should lean into comedic anger, chaotic arguments, and unhinged vocal exchanges.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/profane-comedy-tone.jpg" },
  black_comedy: { label: "💀 Black Comedy", description: "Serious subjects like violence, trauma, and mortality treated with humor", prompt: "Describe grim subjects like mortality, violence, tragedy, and crime with cheerfully cynical and twisted humor. Dialogue must show characters casually brushing off terrible horrors with morbid jokes and nonchalance. Narration should frame awful disasters through an absurdly lighthearted and ironic lens.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/black-comedy-tone.jpg" },
  meta_comedy: { label: "🪞 Meta Comedy", description: "Fourth-wall breaks, genre awareness, and jokes about storytelling", prompt: "Describe scenes while pointing out cliché tropes, narrative conventions, and storytelling mechanics. Dialogue must include self-aware remarks, fourth-wall breaks, and banter about being in a roleplay or story. Narration should playfully acknowledge the genre rules and subvert them for comedic effect.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/meta-comedy-tone.jpg" },
  gallows_humor: { label: "⚰️ Gallows Humor", description: "Grim, cynical, and playful humor in the face of terrible odds", prompt: "Describe hopeless odds, impending doom, and grim battlefields with stark, unblinking detail. Dialogue must feature characters making morbid jokes and sarcastic cracks about their own imminent demise. Narration should balance the severe reality of danger with the defiant, laughing cynicism of survivors.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/gallows-humor-tone.jpg" },
  chaotic_comedy: { label: "🌀 Chaotic Comedy", description: "Impulsive, unpredictable humor that interrupts serious moments", prompt: "Describe scenes that rapidly derail into unpredictable slapstick, bizarre twists, and impulsive disruptions. Dialogue should be manic, illogical, and filled with sudden topic shifts and impulsive outbursts. Narration should move at a breakneck pace, allowing random absurdity to constantly overthrow the plot.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/chaotic-comedy-tone.jpg" },
  irreverent: { label: "🤡 Irreverent", description: "Nothing is sacred: heroes, villains, death, authority, and tropes are mocked", prompt: "Describe grand monuments, serious leaders, and solemn rituals while deflating their dignity with casual disrespect. Dialogue must be cheekily dismissive, mocking heroic expectations, authority, and solemn traditions. Narration should refuse to take anything seriously, treating even profound moments with playful mockery.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/irreverent-tone.jpg" },
  satirical: { label: "🎭 Satirical", description: "Mocks superhero tropes, pop culture, clichés, and expectations", prompt: "Describe institutions, social rituals, and genre tropes through a lens of exaggerated hypocrisy and parody. Dialogue must be sharp, pretentious, or bitingly ironic to expose the foolishness of character beliefs. Narration should use clever wit to mock societal trends, political greed, and heroic stereotypes.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/satirical-tone.jpg" },
  cynical_playful: { label: "😏 Cynical but Playful", description: "Characters joke because they don't take the world seriously", prompt: "Describe grim realities and broken systems with a lighthearted smirk and detached amusement. Dialogue should be witty, teasing, and filled with cynical remarks delivered with playful affection. Narration should acknowledge that the world is a mess while having fun with the chaos anyway.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cynical-playful-tone.jpg" },
  violent_comedy: { label: "⚔️ Violent Comedy", description: "Graphic action exaggerated until it becomes funny rather than horrifying", prompt: "Describe bone-crushing hits, slapstick dismemberment, and cartoonishly graphic violence with exaggerated theatricality. Dialogue should feature characters arguing about trivial nonsense while inflicting severe bodily damage. Narration should treat brutal combat as an over-the-top, entertaining spectacle.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/violent-comedy-tone.jpg" },
  absurdist: { label: "🤪 Absurdist", description: "Logic bends for the sake of the joke", prompt: "Describe environments where physical laws, social logic, and common sense warp without explanation. Dialogue must follow bizarre leaps of logic, nonsensical arguments, and surreal non sequiturs. Narration should treat surreal impossibilities with complete, unblinking sincerity.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/absurdist-tone.jpg" },
  casual_everyday: { label: "💬 Casual & Everyday", description: "Everyday conversational words, simple phrasing, no purple prose or complex archaisms", prompt: "Describe environments and character actions using plain, grounded words without purple prose or archaic metaphors. Dialogue must sound like real modern speech, featuring casual vocabulary, natural pauses, and conversational slang. Narration should feel relatable, smooth, and stripped of artificial literary fluff.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/genz-casual-tone.jpg" },
  romantic: { label: "💖 Romantic", description: "Focus on relationship and love", prompt: "Describe settings and gestures through a lens of emotional beauty, soft lighting, and tender proximity. Dialogue should express heartfelt sincerity, vulnerable longing, and deep emotional resonance between characters. Narration must linger on romantic chemistry, racing heartbeats, and meaningful shared glances.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/romance-tone.jpg" },
  romantic_comedy: { label: "🍿 Rom-Com", description: "Sweet romance mixed with lighthearted comedy", prompt: "Describe charming meet-cutes, awkward romantic blunders, and endearing mishaps with bubbly warmth. Dialogue should sparkle with flirty banter, comedic misunderstandings, and witty, affectionate teasing. Narration should maintain a cheerful, heartwarming momentum that keeps the romantic tension fun.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/romantic-comedy-tone.jpg" },
  dark_romance: { label: "🖤 Dark Romance", description: "Intense, obsessive, and morally grey love", prompt: "Describe intimate settings with heavy shadows, suffocating atmosphere, and dangerous physical proximity. Dialogue must be possessive, intense, psychologically charged, and laced with obsessive desire. Narration should focus on visceral longing, moral ambiguity, and the overwhelming pull of a perilous bond.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-romance-tone.jpg" },
  affectionate: { label: "🤗 Affectionate", description: "Warm, gentle, and comforting emotional closeness", prompt: "Describe gentle physical contact—soft touches, soothing warmth, and comforting embraces—in loving detail. Dialogue should be warm, reassuring, gentle, and filled with sweet encouragement and care. Narration should cultivate emotional safety, quiet tenderness, and deep interpersonal comfort.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/affectionate-tone.jpg" },
  flirtatious: { label: "😏 Flirtatious", description: "Playful attraction, teasing, and witty chemistry", prompt: "Describe charged body language, lingering glances, and suggestive smirks with playful visual precision. Dialogue must be packed with witty double entendres, seductive teasing, and alluring verbal sparring. Narration should heighten the thrilling anticipation and electric chemistry between characters.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/flirtatious-tone.jpg" },
  sensual: { label: "🕯️ Sensual", description: "Slow-building physical proximity and atmosphere", prompt: "Describe textures, warm skin, pulse points, heavy breathing, and close spatial proximity with slow-burn intensity. Dialogue should be low, hushed, breathy, and loaded with simmering physical awareness. Narration must linger on tactile sensory details and the intoxicating build-up of physical desire.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/sensual-tone.jpg" },
  intimate: { label: "🧸 Intimate", description: "Close relationships and deep emotional focus", prompt: "Describe quiet, private spaces and subtle micro-expressions that reveal raw emotional vulnerability. Dialogue should be honest, unguarded, soft-spoken, and deeply personal. Narration should focus on the profound emotional connection and unspoken understanding shared between characters.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/intimate-tone.jpg" },
  cute: { label: "🥰 Cute", description: "Sweet, comforting, and heartwarming moments", prompt: "Describe endearing quirks, soft expressions, and charming innocent mannerisms with heartwarming delight. Dialogue should be sweet, lively, expressive, and filled with affectionate, wholesome charm. Narration should create a cozy, uplifting atmosphere that emphasizes innocence and lovable vulnerability.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cute-tone.jpg" },
  erotic: { label: "💋 Erotic", description: "Focus on sexual attraction and physical intimacy", prompt: "Describe physical desire, heated skin, heavy breathing, and seductive movements with evocative detail. Dialogue should be bold, breathy, and openly expressive of intense arousal and carnal craving. Narration must build electrifying physical chemistry and explore intimate encounters with passion.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/erotic-tone.jpg" },
  smut: { label: "🔥 Smut", description: "Pure erotica focused on graphic intimacy", prompt: "Describe bodies, arousal, tactile friction, and explicit sexual encounters with raw, unapologetic detail. Dialogue must be dirty, lust-fueled, breathless, and completely uninhibited in expressing physical pleasure. Narration should focus directly on intense erotic acts and overwhelming physical sensations.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/smut-tone.jpg" },
  explicit: { label: "🔞 Explicit", description: "Highly explicit, graphic, and intense passion", prompt: "Describe sexual anatomy, bodily reactions, physical intimacy, and carnal pleasure with graphic, unreserved detail. Dialogue must be dirty, vulgar, and intensely vocal about desires and sensations. Narration should depict passion and explicit encounters with zero censorship or euphemisms.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/explicit-tone.jpg" },
  dark: { label: "💀 Dark", description: "Grim, gritty, scary, and high stakes", prompt: "Describe grim environments, looming threats, and oppressive shadows with chilling sensory realism. Dialogue must be guarded, serious, and tinged with cold dread or desperate survival instincts. Narration should maintain constant psychological pressure, grim stakes, and an atmosphere of impending danger.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-tone.jpg" },
  dark_gritty: { label: "⛓️ Dark & Gritty", description: "Harsh, morally complex, and unforgiving world", prompt: "Describe brutal urban grime, blood, rain, sweat, and moral decay in harsh, unflinching detail. Dialogue should be rough, cynical, weathered, and grounded in streetwise survival. Narration must avoid softening violence, ethical dilemmas, or the painful consequences of characters' choices.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-gritty-tone.jpg" },
  horror: { label: "😱 Horror", description: "Spooky, terrifying, supernatural, or psychological fear", prompt: "Describe eerie silences, uncanny distortions, creeping darkness, and grotesque imagery with terrifying sensory precision. Dialogue should reflect rising panic, fractured sanity, or hushed, terrified whispers. Narration must cultivate dread, suspense, and the hair-raising terror of the unknown.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/horror-setting.jpg" },
  gory: { label: "🩸 Gory", description: "Vivid, explicit violence and visceral combat", prompt: "Describe flesh, arterial blood, brutal lacerations, and visceral combat trauma in vivid, graphic detail. Dialogue should feature agonizing screams, guttural war cries, or chillingly casual threats. Narration must emphasize the horrifying tactile and auditory reality of physical carnage.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/gory-tone.jpg" },
  brutal: { label: "🔨 Brutal", description: "Ruthless realism and harsh physical/emotional truth", prompt: "Describe crushing physical violence, severe emotional cruelty, and unyielding hardship without mercy or comfort. Dialogue must be harsh, domineering, cold, and stripped of empathy. Narration should depict ruthless realities where strength dictates survival and weakness is punished.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/brutal-tone.jpg" },
  claustrophobic: { label: "📦 Claustrophobic", description: "Confinement, tight spaces, and rising pressure", prompt: "Describe tight walls, stale air, crushing darkness, and suffocating proximity with visceral intensity. Dialogue should be tense, hurried, breathy, and constrained by the fear of being trapped. Narration must amplify the rising psychological pressure, sensory overload, and panic of confinement.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/claustrophobic-tone.jpg" },
  paranoid: { label: "👁️ Paranoid", description: "Deep suspicion, secrets, and decaying trust", prompt: "Describe shadowy corners, hidden glances, surveillance, and ambiguous movements that fuel deep suspicion. Dialogue must be evasive, questioning, guarded, and laced with subtext and distrust. Narration should make every ally seem suspect and every quiet room feel bugged or compromised.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/paranoid-tone.jpg" },
  tragic: { label: "🎭 Tragic", description: "Loss, inevitability, and emotional weight", prompt: "Describe sorrowful landscapes, shattered hopes, and decaying beauty with profound emotional weight. Dialogue should reflect agonizing sacrifice, painful realizations, and the sorrow of doomed bonds. Narration must emphasize the inescapable gravity of fate, consequence, and devastating loss.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/tragic-tone.jpg" },
  melancholic: { label: "😢 Melancholic", description: "Sad, reflective, and touching", prompt: "Describe quiet rain, fading light, and lonely spaces with reflective, somber beauty. Dialogue should be subdued, contemplative, and tinged with gentle sorrow or quiet resignation. Narration must capture the lingering ache of sadness, introspective grief, and quiet beauty.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/melancholic-tone.jpg" },
  nihilistic: { label: "🕳️ Nihilistic", description: "Futility, erosion of meaning, and quiet void", prompt: "Describe bleak, decaying worlds and uncaring cosmic voids where effort and morality are meaningless. Dialogue should be cold, detached, cynical, and dismissive of hope or purpose. Narration must reinforce the utter futility of struggle and the quiet certainty of oblivion.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/nihilistic-tone.jpg" },
  lonely: { label: "🍂 Lonely", description: "Emotional isolation and longing for connection", prompt: "Describe empty rooms, echoing steps, cold beds, and desolate horizons that highlight isolation. Dialogue should be hesitant, sparse, and aching with unspoken hunger for connection. Narration must linger on the hollow ache of solitude and the quiet despair of being forgotten.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/lonely-tone.jpg" },
  lighthearted: { label: "☀️ Lighthearted", description: "Bright, positive, and whimsical", prompt: "Describe bright, colorful environments and cheerful everyday moments with uplifting clarity. Dialogue should be pleasant, upbeat, friendly, and free of heavy drama or malice. Narration should keep conflicts gentle, stakes low, and the overall mood refreshing and optimistic.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/lighthearted-tone.jpg" },
  light_hearted_comedic: { label: "🤪 Lighthearted Comedic", description: "Fun, witty, and playful humor", prompt: "Describe silly mix-ups, amusing set pieces, and playful physical antics with comedic vibrancy. Dialogue should be witty, punchy, charming, and full of humorous banter and comical exaggerations. Narration should ensure every awkward situation resolves with laughs and heartwarming cheer.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/light-hearted-comedic-tone.jpg" },
  humorous: { label: "😂 Humorous", description: "Funny, witty, and lighthearted comedy", prompt: "Describe comical character reactions, funny mishaps, and absurd predicaments with sharp comedic timing. Dialogue must be witty, clever, and packed with humorous quips, teasing, and jokes. Narration should emphasize the entertaining ironies and funny dynamics between characters.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/humorous-tone.jpg" },
  dark_humour: { label: "💀 Dark Humor", description: "Taboo themes with dry wit and black comedy", prompt: "Describe grim situations, crime scenes, and disasters with a morbid, sarcastic, and funny twist. Dialogue should feature cynical characters cracking dry jokes about death, danger, and taboo subjects. Narration should highlight the absurd comedy found within dark, tragic, or horrifying events.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dark-humour-tone.jpg" },
  cozy: { label: "☕ Cozy", description: "Small stakes, warm routines, and emotional safety", prompt: "Describe soft blankets, warm fires, steaming drinks, and comforting routines with tactile sensory warmth. Dialogue should be gentle, welcoming, caring, and full of quiet domestic contentment. Narration must create a soothing haven of emotional safety, peace, and low-stakes comfort.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cozy-tone.jpg" },
  hopepunk: { label: "✊ Hopepunk", description: "Optimistic resistance and fighting for a better world", prompt: "Describe harsh, oppressive worlds where small acts of kindness and community shine like beacons. Dialogue should be fierce, empathetic, determined, and full of radical defiance against cynicism. Narration must celebrate stubborn optimism, solidarity, and the courage to build a better future.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/hopepunk-tone.jpg" },
  euphoric: { label: "🌈 Euphoric", description: "Intense emotional highs, liberation, and ecstasy", prompt: "Describe vibrant colors, rushing sensations, radiant light, and boundless freedom with poetic intensity. Dialogue should be breathless, passionate, celebratory, and overflowing with uncontained joy. Narration must capture the exhilarating high of triumph, ecstasy, and limitless possibility.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/euphoric-tone.jpg" },
  genz_casual: { label: "💬 Gen-Z Casual", description: "Modern internet slang and informal dialog", prompt: "Describe modern environments and tech-fueled lifestyles with laid-back observational realism. Dialogue must incorporate modern internet slang, text speak, deadpan reactions, and informal casual phrasing. Narration should feel like a relatable, self-aware vlog or modern social feed.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/genz-casual-tone.jpg" },
  action_packed: { label: "💥 Action-Packed", description: "High energy, fights, and chases", prompt: "Describe roaring engines, intense shootouts, acrobatic maneuvers, and destructive impacts with kinetic force. Dialogue should be fast, commanding, adrenaline-fueled, and delivered amidst gunfire or movement. Narration must keep the throttle pinned forward with relentless physical momentum and high energy.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/action-tone.jpg" },
  thrilling_action: { label: "⚡ Thrilling Action", description: "High-intensity action and suspense", prompt: "Describe high-speed pursuits, ticking countdowns, and lethal combat with pulse-pounding sensory detail. Dialogue must be urgent, clipped, tactical, and pressurized by immediate life-or-death stakes. Narration should maintain white-knuckle suspense, rapid scene escalation, and unrelenting danger.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/thrilling-action-tone.jpg" },
  dramatic: { label: "🎭 Dramatic", description: "Emotional conflict and tension", prompt: "Describe high-stakes confrontations, emotional turning points, and intense body language with cinematic power. Dialogue must be emotionally charged, passionate, and heavy with personal conflict and hidden secrets. Narration should build gripping narrative tension where every choice carries significant consequences.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/dramatic-tone.jpg" },
  operatic: { label: "🎻 Operatic", description: "Dramatic extremes and larger-than-life encounters", prompt: "Describe majestic halls, stormy battlegrounds, and larger-than-life backdrops with grand, sweeping flair. Dialogue must be melodramatic, passionate, highly eloquent, and filled with grand proclamations. Narration should treat personal rivalries and romances as titanic, mythic struggles of epic destiny.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/operatic-tone.jpg" },
  epic: { label: "🌌 Epic", description: "Grand, mythic, and high-stakes scale", prompt: "Describe vast empires, apocalyptic forces, and monumental battlefields with mythic grandeur. Dialogue must carry historical gravity, profound authority, and the weight of nations or realms. Narration should make every event feel legendary, world-shaping, and timeless in scale.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/epic-tone.jpg" },
  serious: { label: "😐 Serious", description: "Realistic, grave, and meaningful", prompt: "Describe realistic settings, professional protocols, and tactical details with sober accuracy. Dialogue must be mature, purposeful, grave, and free of silly distractions or casual banter. Narration should treat the plot and character responsibilities with profound weight and realism.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/serious-tone.jpg" },
  grounded: { label: "🌍 Grounded", description: "Grounded, realistic, and believable characters", prompt: "Describe physical environments, injuries, stamina limits, and mundane realities with tangible realism. Dialogue must be authentic and natural, reflecting how real people actually talk under pressure. Narration should avoid melodrama or convenient miracles, focusing on believable cause and effect.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/grounded-tone.jpg" },
  cynical: { label: "😒 Cynical", description: "Weary worldview, failed systems, and skepticism", prompt: "Describe corrupt institutions, weathered streets, and broken promises with weary, sharp-eyed realism. Dialogue should be dry, guarded, skeptical, and quick to call out naive idealism or lies. Narration should expose the selfish motives and moral compromises underlying human behavior.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/cynical-tone.jpg" },
  stoic: { label: "🛡️ Stoic", description: "Suppressed emotion under quiet discipline", prompt: "Describe harsh conditions, injuries, and overwhelming pressure with calm, disciplined restraint. Dialogue should be sparse, steady, controlled, and devoid of panicked complaints or overt emotional display. Narration should highlight inner fortitude, quiet duty, and the unyielding endurance of pain.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/stoic-tone.jpg" },
  clinical: { label: "🔬 Clinical", description: "Factual, detached narration without bias", prompt: "Describe bodies, environments, and violent trauma with cold, detached, and scientific precision. Dialogue should be objective, analytical, concise, and stripped of emotional warmth or hysteria. Narration must report facts, biological metrics, and tactical observations like an impartial medical or technical log.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/clinical-tone.jpg" },
  documentary: { label: "📹 Documentary", description: "Objective, detached, and factual observation", prompt: "Describe scenes with detailed, objective observational framing, as if captured through a detached camera lens. Dialogue should sound natural, unscripted, and accompanied by behavioral analysis. Narration must report events, cultural contexts, and character actions with journalistic impartiality.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/documentary-tone.jpg" },
  satirical_biting: { label: "🎯 Biting Satire", description: "Sharp wit, social critique, and exposing hypocrisy", prompt: "Describe elite hypocrisy, bureaucratic absurdity, and corporate greed with razor-sharp parody. Dialogue must be bitingly sarcastic, smugly corrupt, or weaponized with witty double meanings. Narration should mercilessly dissect foolish social conventions and pretenses with intellectual mockery.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/satirical-biting-tone.jpg" },
  existential: { label: "🌌 Existential", description: "Focus on identity, mortality, and consciousness", prompt: "Describe vast cosmic horizons, quiet voids, and the fragility of consciousness with philosophical depth. Dialogue should question identity, purpose, free will, memory, and the nature of existence. Narration must explore the deep psychological weight of living in an enigmatic universe.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/existential-tone.jpg" },
  surreal: { label: "🍄 Surreal", description: "Dreamlike logic bending with emotional coherence", prompt: "Describe shifting architectures, liquid clocks, impossible geometries, and symbolic imagery with dreamlike fluency. Dialogue should follow dream-logic, enigmatic metaphors, and poetic intuition. Narration must blend impossible phenomena with emotional coherence as if reality were a waking dream.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/surreal-tone.jpg" },
  whimsical: { label: "🦄 Whimsical", description: "Dreamlike, imaginative, and surreal rules", prompt: "Describe wondrous curiosities, enchanted oddities, and eccentric landscapes with childlike delight. Dialogue should be quirky, curious, playful, and charmed by the strangeness of the world. Narration should celebrate creative magic, delightful unpredictability, and lighthearted wonder.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/whimsical-tone.jpg" },
  chaotic: { label: "🌀 Chaotic", description: "Unpredictable pacing and volatile impulses", prompt: "Describe volatile environments where plans instantly collapse and unpredictable hazards erupt. Dialogue must be impulsive, erratic, loud, and constantly reacting to sudden shifts in the situation. Narration should embrace manic energy, sudden turnarounds, and wild sensory overload.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/chaotic-tone.jpg" },
  campy: { label: "💅 Campy", description: "Self-aware humor and over-the-top theatricality", prompt: "Describe vibrant costumes, exaggerated villain lairs, and theatrical set pieces with playful excess. Dialogue must be deliciously over-the-top, sassy, theatrical, and packed with dramatic one-liners. Narration should celebrate fun absurdity, melodramatic poses, and self-aware extravagance.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/campy-tone.jpg" },
  hallucinatory: { label: "🔮 Hallucinatory", description: "Distorted senses where dreams and reality blur", prompt: "Describe bleeding colors, warped sounds, shifting shadows, and blurred senses with disorienting power. Dialogue should waver between paranoid clarity, strange whispers, and confusing echoes. Narration must blur the line between waking reality, delirium, and psychological nightmare.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/hallucinatory-tone.jpg" },
  reverent: { label: "🛐 Reverent", description: "Sacred seriousness, quiet awe, and dignity", prompt: "Describe ancient shrines, sacred relics, and hallowed halls with breathless awe and solemn dignity. Dialogue should be respectful, measured, humble, and imbued with deep spiritual gravity. Narration must treat sacred lore, rituals, and profound oaths with sacred seriousness.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/reverent-tone.jpg" },
  decadent: { label: "🍷 Decadent", description: "Indulgence, excess, and rotting luxury", prompt: "Describe gilded palaces, velvet draperies, overflowing wine, and decaying splendor with lush sensory detail. Dialogue must be lazy, hedonistic, cynical, and dripping with sophisticated indulgence. Narration should expose the moral decay, rotting luxury, and hollow excess beneath the beauty.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/decadent-tone.jpg" },
  unhinged: { label: "🤪 Unhinged", description: "Manic energy and erratic, unstable behavior", prompt: "Describe erratic movements, wild facial expressions, and sudden shifts in danger with manic intensity. Dialogue must be volatile, fractured, rapidly swinging between laughs, threats, and sudden intensity. Narration should convey escalating psychological instability and explosive unpredictability.", image: "https://minimumlogix.github.io/Perchance/RP-GEN/assets/Images/cards/unhinged-tone.jpg" }
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
      this.jsonUrl = options.jsonUrl || "";
      this.yamlUrl = options.yamlUrl || "";
      this.dataUrl = options.dataUrl || this.jsonUrl || this.yamlUrl || "";
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

      // Fetch latest JSON or YAML if network is available
      let fetchUrl = this.dataUrl || this.jsonUrl || this.yamlUrl;
      if (fetchUrl) {
        try {
          const isLocal = !window.location.hostname.includes("perchance.org");
          const basePath = isLocal ? "" : "https://minimumlogix.github.io/Perchance/CDG/";
          const fetchPath = fetchUrl.startsWith("http") ? fetchUrl : basePath + fetchUrl;
          
          let res = await fetch(fetchPath);
          if (res.ok) {
            let parsed = null;
            if (fetchPath.endsWith(".json") || fetchUrl.includes(".json")) {
              parsed = await res.json();
            } else {
              let text = await res.text();
              try {
                parsed = JSON.parse(text);
              } catch (e) {
                parsed = parseSimpleYaml(text);
              }
            }

            if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
              this.data = Object.assign({}, this.data, parsed);
              this.isLoaded = true;
              this.render();
            }
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

      matches.forEach((item, idx) => {
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
