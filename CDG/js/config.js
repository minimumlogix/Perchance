/* ===========================
   CONFIGURATION & APP DEFAULTS
=========================== */

window.CDG_SETTINGS_DEFAULTS = {
  theme: "dark",
  descLength: "medium",
  mainCast: "1",
  bgCast: "0",
  visualStyle: "",
  scenarioPerspective: "thirdperson",
  roleplayStartPerspective: "firstperson",
  customFeatures: "",
  customBehaviorFeatures: "",
  customScenarioFeatures: "",
  customRoleplayStartFeatures: ""
};

window.CDGConfig = {
  lengthSpecifiers: {
    short: "at most 1 short paragraph",
    medium: "1-2 paragraphs",
    long: "2-4 paragraphs"
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
