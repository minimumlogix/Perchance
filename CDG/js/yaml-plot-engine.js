/* ===========================
   YAML-DRIVEN RANDOM PLOT ENGINE
=========================== */

(function() {
  /* ----------------------------------------------------
     PRNG UTILITY (DETERMINISTIC SEEDING)
  ---------------------------------------------------- */
  function createPRNG(seed) {
    if (seed === undefined || seed === null) return Math.random;
    let s = typeof seed === "number" ? seed : hashString(String(seed));
    return function() {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    }
    return hash;
  }

  /* ----------------------------------------------------
     LIGHTWEIGHT YAML PARSER
  ---------------------------------------------------- */
  function parseYaml(yamlString) {
    const lines = yamlString.split(/\r?\n/);
    const result = { templates: [], categories: {} };
    let currentSection = null;
    let currentCategory = null;
    let currentItem = null;

    for (let rawLine of lines) {
      // Strip comments
      let line = rawLine.split("#")[0].trimEnd();
      if (!line.trim()) continue;

      let indent = rawLine.search(/\S/);

      if (indent === 0 && line.endsWith(":")) {
        currentSection = line.slice(0, -1).trim();
        currentCategory = null;
        currentItem = null;
        continue;
      }

      if (currentSection === "templates") {
        if (line.trim().startsWith("- ")) {
          let content = line.trim().substring(2);
          currentItem = {};
          result.templates.push(currentItem);
          if (content.includes(":")) {
            let [k, v] = content.split(/:(.+)/);
            currentItem[k.trim()] = parseVal(v.trim());
          }
        } else if (currentItem && indent > 2 && line.includes(":")) {
          let [k, v] = line.trim().split(/:(.+)/);
          let key = k.trim();
          let val = v ? v.trim() : "";
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          currentItem[key] = parseVal(val);
        }
      } else if (currentSection === "categories") {
        if (indent === 2 && line.trim().endsWith(":")) {
          currentCategory = line.trim().slice(0, -1);
          result.categories[currentCategory] = [];
          currentItem = null;
        } else if (currentCategory && line.trim().startsWith("- ")) {
          let content = line.trim().substring(2);
          currentItem = {};
          result.categories[currentCategory].push(currentItem);
          if (content.includes(":")) {
            let [k, v] = content.split(/:(.+)/);
            currentItem[k.trim()] = parseVal(v.trim());
          }
        } else if (currentCategory && currentItem && indent > 4 && line.includes(":")) {
          let [k, v] = line.trim().split(/:(.+)/);
          let key = k.trim();
          let val = v ? v.trim() : "";
          if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          
          if (key === "tags" && val.startsWith("[") && val.endsWith("]")) {
            currentItem[key] = val.slice(1, -1).split(",").map(t => t.trim().replace(/['"]/g, ""));
          } else {
            currentItem[key] = parseVal(val);
          }
        }
      }
    }
    return result;
  }

  function parseVal(val) {
    if (!val) return "";
    if (val === "true") return true;
    if (val === "false") return false;
    if (!isNaN(Number(val))) return Number(val);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      return val.slice(1, -1);
    }
    return val;
  }

  /* ----------------------------------------------------
     EMBEDDED FALLBACK DATABASE
  ---------------------------------------------------- */
  const DEFAULT_YAML_DATA = `# ==========================================
# RANDOM PLOT & CHARACTER PREMISE DATABASE
# ==========================================

templates:
  - id: "three_part_plot"
    format: "Part 1: Initial Situation\\n{initial_situation}\\n\\nPart 2: Main Conflict\\n{main_conflict}\\n\\nPart 3: Twist / Complication / Goal\\n{twist_complication_goal}"
    weight: 5

categories:
  initial_situation:
    - text: "A retired dragon hunter opens a small bakery in a quiet mountain village."
      weight: 4
      tags: ["fantasy", "cozy"]
    - text: "A college student inherits a haunted apartment from an eccentric distant relative."
      weight: 4
      tags: ["modern", "supernatural"]
    - text: "An AI awakens inside an abandoned colony starship drifting through deep space."
      weight: 4
      tags: ["sci-fi", "mystery"]
    - text: "The kingdom celebrates its thousandth year of unbroken peace and prosperity."
      weight: 4
      tags: ["fantasy", "political"]
    - text: "A disgraced alchemy professor takes a night job at an illegal potion clinic."
      weight: 3
      tags: ["fantasy", "urban"]
    - text: "A solitude-loving lighthouse keeper discovers a siren washed ashore during a cosmic storm."
      weight: 3
      tags: ["supernatural", "nautical"]
    - text: "A cybernetic bounty hunter takes one last routine contract before retiring to Mars."
      weight: 3
      tags: ["sci-fi", "cyberpunk"]
    - text: "A quiet antique restorer uncovers an unlabeled leather journal written in cipher."
      weight: 3
      tags: ["mystery", "historical"]
    - text: "A disgraced royal knight works as a quiet tavern bouncer in the city slums."
      weight: 3
      tags: ["fantasy", "grit"]
    - text: "A subterranean cartographer discovers an uncharted bioluminescent forest beneath the capitol."
      weight: 3
      tags: ["adventure", "fantasy"]

  main_conflict:
    - text: "...until mysterious disappearances begin plaguing the surrounding countryside."
      weight: 4
      tags: ["mystery", "supernatural"]
    - text: "...when a forbidden relic of catastrophic power is stolen from the high vault."
      weight: 4
      tags: ["fantasy", "action"]
    - text: "...after an ancient god starts speaking directly through their nightly dreams."
      weight: 4
      tags: ["supernatural", "cosmic"]
    - text: "...because a rival empire unexpectedly launches a surprise full-scale invasion."
      weight: 4
      tags: ["political", "war"]
    - text: "...when time begins fracturing, causing past and future events to bleed together."
      weight: 3
      tags: ["sci-fi", "mystery"]
    - text: "...after discovering that the city's governor has secretly put a bounty on their head."
      weight: 3
      tags: ["crime", "thriller"]
    - text: "...when an automated orbital defense grid goes rogue and locks down the continent."
      weight: 3
      tags: ["sci-fi", "dystopian"]
    - text: "...after an accidental magical surge links their life force with a notorious outlaw boss."
      weight: 3
      tags: ["urban", "magic"]

  twist_complication_goal:
    - text: "The real enemy behind the catastrophe is secretly the protagonist's future self."
      weight: 4
      tags: ["twist", "sci-fi"]
    - text: "Every victory earned erases one precious core memory from their mind."
      weight: 4
      tags: ["complication", "tragedy"]
    - text: "The villain is secretly protecting humanity from an even more devastating cosmic truth."
      weight: 4
      tags: ["twist", "morality"]
    - text: "The protagonist must work alongside the exact person who betrayed them years ago."
      weight: 4
      tags: ["relationship", "drama"]
    - text: "The magical power keeping them alive is slowly corrupting the surrounding land."
      weight: 3
      tags: ["complication", "stakes"]
    - text: "They only have 72 hours to resolve the crisis before the rift becomes permanent."
      weight: 3
      tags: ["goal", "timer"]
    - text: "Unlocking the final door requires sacrificing the memory of the person they value most."
      weight: 3
      tags: ["goal", "tragedy"]
    - text: "Uncovering the truth reveals that the entire world is an artificial memory simulation."
      weight: 3
      tags: ["twist", "cyberpunk"]
`;

  /* ----------------------------------------------------
     ENGINE CORE
  ---------------------------------------------------- */
  class YAMLPlotEngine {
    constructor() {
      this.database = parseYaml(DEFAULT_YAML_DATA);
      this.loadRemoteDatabase();
    }

    async loadRemoteDatabase() {
      try {
        let isLocal = !window.location.hostname.includes("perchance.org");
        let jsonPath = isLocal ? "data/plots.json" : "https://minimumlogix.github.io/Perchance/CDG/data/plots.json";
        let yamlPath = isLocal ? "data/plots.yaml" : "https://minimumlogix.github.io/Perchance/CDG/data/plots.yaml";
        
        let resJson = await fetch(jsonPath);
        if (resJson.ok) {
          let data = await resJson.json();
          if (data && data.templates && data.categories) {
            this.database = data;
            return;
          }
        }

        let resYaml = await fetch(yamlPath);
        if (resYaml.ok) {
          let text = await resYaml.text();
          this.database = parseYaml(text);
        }
      } catch (e) {
        // Fallback to embedded default database
      }
    }

    selectWeighted(items, rng) {
      if (!items || items.length === 0) return null;
      let totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
      let randomVal = rng() * totalWeight;
      let cumulative = 0;
      for (let item of items) {
        cumulative += (item.weight || 1);
        if (randomVal <= cumulative) return item;
      }
      return items[items.length - 1];
    }

    generatePlot(options = {}) {
      const rng = createPRNG(options.seed);
      const db = this.database;

      // Select template
      let templateObj = this.selectWeighted(db.templates, rng) || {
        format: "Part 1: Initial Situation\n{initial_situation}\n\nPart 2: Main Conflict\n{main_conflict}\n\nPart 3: Twist / Complication / Goal\n{twist_complication_goal}"
      };

      let resultText = templateObj.format;
      let matches = resultText.match(/\{([a-zA-Z0-9_]+)\}/g) || [];

      for (let token of matches) {
        let categoryKey = token.slice(1, -1);
        let items = db.categories[categoryKey];
        if (items && items.length > 0) {
          // Filter by tag if requested
          if (options.tag) {
            let filtered = items.filter(i => i.tags && i.tags.includes(options.tag));
            if (filtered.length > 0) items = filtered;
          }
          let selected = this.selectWeighted(items, rng);
          let val = selected ? selected.text : "";
          resultText = resultText.replace(token, val);
        }
      }

      return resultText;
    }
  }

  // Instantiate global engine
  window.YAMLPlotEngine = new YAMLPlotEngine();

  /* ----------------------------------------------------
     GLOBAL UI HANDLER FOR DICE BUTTON
  ---------------------------------------------------- */
  window.generateRandomPlotIdea = function(targetTextareaId) {
    let textarea = document.getElementById(targetTextareaId);
    if (!textarea) return;

    let generatedIdea = window.YAMLPlotEngine.generatePlot();
    textarea.value = generatedIdea;

    // Trigger input event to update localStorage & state
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    // Visual effect/feedback
    textarea.classList.add("u-highlight-pulse");
    setTimeout(() => textarea.classList.remove("u-highlight-pulse"), 600);
  };
})();
