/* ===========================
   CONFIGURATION & APP DEFAULTS
=========================== */

window.CDG_SETTINGS_DEFAULTS = {
  theme: "dark",
  descLength: "medium",
  mainCast: "1",
  bgCast: "0",
  visualStyle: "painterly_anime",
  imageFraming: "portrait",
  imageType: "character",
  scenarioPerspective: "thirdperson",
  roleplayStartPerspective: "firstperson",
  tones: [],
  worldSettings: [],
  customFeatures: "",
  customBehaviorFeatures: "",
  customScenarioFeatures: "",
  customRoleplayStartFeatures: ""
};

/* ===========================
   CUSTOM ART STYLES
=========================== */

window.CDG_ART_STYLES = {
  "painterly_anime": {
    name: "Painterly Anime",
    promptSuffix: "Overall, it's an absolute world-class masterpiece painterly anime artwork. It's an aesthetically pleasing painterly anime artwork with impeccable attention to detail and impressive composition.",
    negativePrompt: "photorealistic, photograph, 3d render, low quality, blurry, deformed"
  },
  "vintage_anime": {
    name: "Vintage Anime",
    promptSuffix: "80s vintage anime style, retro cel shaded anime aesthetic, classic 1980s hand-drawn animation style, nostalgic color palette, film grain texture.",
    negativePrompt: "modern 3d cgi, photorealistic, photograph, blurry, low resolution"
  },
  "manga": {
    name: "Manga",
    promptSuffix: "Manga black and white shaded aesthetic, traditional screentone shading, crisp inked line art, high-contrast monochrome comic illustration, detailed crosshatching.",
    negativePrompt: "color, colorful, painting, photorealistic, blurry"
  },
  "korean_manhwa": {
    name: "Korean Manhwa",
    promptSuffix: "Korean manhwa style not anime. Manhwa rendering and character style, webtoon illustration, clean digital webcomic art style, luminous digital color shading, stylish aesthetic.",
    negativePrompt: "western comic, low quality, blurry, photorealistic, flat sketch"
  },
  "studio_ghibli": {
    name: "Studio Ghibli",
    promptSuffix: "Studio Ghibli rendering and character style, Hayao Miyazaki inspired animation aesthetic, hand-painted scenic background, soft warm lighting, lush painterly textures, nostalgic whimsy.",
    negativePrompt: "3d cgi render, photorealistic, harsh lighting, dark gritty, blurry"
  },
  "disney": {
    name: "Disney",
    promptSuffix: "Disney rendering and character style, expressive character design, smooth vibrant digital rendering, magical atmospheric lighting, storybook charm.",
    negativePrompt: "anime, gritty, photorealistic, deformed, flat sketch"
  },
  "oil_painting": {
    name: "Oil Painting",
    promptSuffix: "Classic fine art oil painting, visible textured brushstrokes, rich canvas impasto, dramatic chiaroscuro lighting, traditional oil on canvas masterpiece.",
    negativePrompt: "anime, cartoon, digital vector, 3d cgi, flat, blurry"
  },
  "casual_photo": {
    name: "Casual Photo",
    promptSuffix: "Realistic casual candid photography, authentic natural lighting, lifelike skin texture, real world portrait photo, shot on 35mm lens, depth of field.",
    negativePrompt: "anime, illustration, cartoon, 3d render, painting, fake, airbrushed, drawing"
  },
  "cinematic_photo": {
    name: "Cinematic Photo",
    promptSuffix: "Cinematic casual photography, high-end film still, dramatic volumetric lighting, anamorphic lens depth of field, 8k resolution, color graded cinematic atmosphere.",
    negativePrompt: "anime, cartoon, drawing, painting, 3d render, blurry, low quality"
  },
  "3d_game": {
    name: "3D Game",
    promptSuffix: "3D game rendering and character style, Unreal Engine 5 render, raytracing, highly detailed subsurface scattering, intricate materials, video game cinematic aesthetic.",
    negativePrompt: "flat 2d, 2d drawing, watercolor, sketch, blurry"
  },
  "2d_game_sprite": {
    name: "2D Game Sprite",
    promptSuffix: "2D game sprite art, clean digital character sprite illustration, vibrant game asset design, distinct outlines, dynamic game concept art.",
    negativePrompt: "photorealistic, real photo, 3d cgi, blurry, messy"
  },
  "pixel_art": {
    name: "Pixel Art",
    promptSuffix: "Detailed 16-bit / 32-bit pixel art, authentic retro pixel aesthetic, handcrafted pixel placement, crisp dithering, vibrant game art palette.",
    negativePrompt: "blurry, anti-aliased, smooth illustration, 3d render, photograph, vector"
  }
};

window.CDGConfig = {
  lengthSpecifiers: {
    short: "at most 1 short paragraph",
    medium: "1-2 paragraphs",
    long: "2-4 paragraphs",
    compact_detailed: "compact and detailed summary"
  }
};

/* ===========================
   SEED WORD HELPERS
=========================== */

window.getOptionalSeedWordsTip = function() {
  if (window.massiveWordList && window.massiveWordList.length > 0) {
    let seedWords = (new Array(20).fill(0)).map(_ => 
      window.massiveWordList[Math.floor(Math.random() * window.massiveWordList.length)].replace(/,/g, ' ')
    );
    return `Creativity Booster: If the design notes don't give much detail to go by, then try to be loosely inspired by *one* of the following seed words to improve your creativity. You should ignore rare/weird words, and completely ignore all of them if they're all utterly irrelevant. You don't need to use a seed word exactly as written - just try to let your creativity be inspired by it. And ensure you always *stay faithful to the design notes*. See if you can use a concept from one or more of these seeds:\n<creativity_seeds>${seedWords.join(", ")}</creativity_seeds>\nCan you see a seed word that might be interesting to riff off? Then use it!\n`;
  }
  return "";
};
