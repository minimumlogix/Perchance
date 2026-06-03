# 👑 Supreme Generators: Feature & Architecture Guide

Welcome to the **Supreme Generator** suite—a premium, fully integrated creative suite of AI-driven tools built for Perchance. It is designed to help writers, roleplayers, and creators build characters, structure world lore, prepare interactive roleplay scenarios, and compile visual character sheets.

This guide details all the core systems, hidden capabilities, and visual modules available within the suite.

---

## 🧭 Navigation & Core Modules

The application is structured around **six main tabs** in the sidebar, supported by a shared global database:

1. **[Characters (SCDG)](#1-supreme-character-description-generator-scdg)**: Step-by-step descriptive prose builder, AI portrait generator, and scene staging canvas.
2. **[Character Sheet](#2-interactive-character-sheet-dashboard)**: Dynamic visual dashboard compiled from unstructured character details.
3. **[World](#3-supreme-world-generator)**: Sprawling environment builder mapping factions, rules, and bestiaries.
4. **[Roleplay](#4-supreme-roleplay-scenario-generator)**: Dynamic setup creating multi-character starting points and player prompts.
5. **[Assistant](#5-context-aware-ai-assistant)**: Interactive, context-aware AI chatbot to bounce ideas off of.
6. **[Settings](#6-application-settings--generation-constraints)**: Detailed confirmation options, formatting restrictions, and theme selectors.

---

## 1. Supreme Character Description Generator (SCDG)

This module builds detailed character descriptions section-by-section using the Perchance `ai-text-plugin`.

### ⚡ Magic Wiki Import
* **Wiki to Profile**: Paste a URL from any Fandom wiki or webpage to automatically extract and parse character history, personality, and details.
* **Creative Override**: Enter optional constraints (e.g., *"Peter Parker, but he is a medieval alchemist"*) to twist the imported wiki data during parsing.

### ⚙️ Core Parameters
* **Setting Profiles**: 35+ preset setting tags (e.g., *Cyberpunk, High Fantasy, Post-Apocalyptic, Feudal Japan*) that constrain character context.
* **Emotional Tones**: 25+ tone profiles (e.g., *Grounded, Dark/Gritty, Melancholic, Gen-Z Casual, Slow Burn*) instructing the AI on narrative style.
* **Archetypes & Dynamics**: Select combinations of archetypes (*Tsundere, Kuudere, Femboy, Bully, Cyborg, Succubus*) and dynamics (*Forbidden Love, Rivals with Tension, Worship & Disgust*) to align character generation.
* **Perspective Override**: Set the narration perspective (*First Person* or *Third Person*) to format dialogue and intro text.

### 👤 Identity Details & Overview
* **Interactive Identity Panel**: Generates Name, Age, Gender, Orientation, Species, and Ethnicity. Each field can be generated or regenerated individually.
* **Overview Concept Hook**: Write optional hints (Appearance, Backstory hints) or click **Generate** to draft a starting character concept first.
* **Interactive Overview Modal**: If you click "Generate All" with empty overview notes, a popup automatically streams a character concept for your review and approval before generating other sections.

### 📄 The 11 Portrait & Prose Panels
Each section can be generated independently with customized lengths (*Super Short, Short, Medium, Long, Super Long*) and custom note overrides:
1. **Core Identity**: Initial parameter sets.
2. **World Lore**: Links world rules and name variables to contextualize character generation.
3. **Appearance**: Focuses on height, posture, hair, scars, attire style, and items.
4. **Role**: Dictates narrative function (companion, antagonist, guide) and rules they must obey.
5. **Personality**: Maps archetypes, speech style catchphrases, gestures, and conflicts.
6. **Beliefs**: Defines mentality, morals, and self-quotes.
7. **Preferences**: Details Likes, Hates, Hobbies, Values, and Romance perspectives.
8. **Background**: Blends origins, family upbringing, occupation, residence, and secrets.
9. **Lore Entries (Searchable JSON)**: A grid of 5 distinct lore facts matching specific keywords, exported as a structured JSON object.
10. **Roleplay Examples**: Action/dialogue segments matching the character's voice.
11. **Roleplay Intro**: Composes *Scenario Context* and *Roleplay Start* descriptions.

---

### 🎨 Character Portrait Generator (T2I Integration)
Embedded directly inside the **Appearance** panel:
* **Art Styles**: A drop-down menu that pulls from the Perchance Text-to-Image styling library (*Cinematic Realistic, Fantasy Portrait, Ghibli, Pixel Art, 3D Render, Anime*, etc.).
* **Smart Portrait Selection**: Select any generated portrait in the scrollable gallery to instantly set it as the character's profile avatar.
* **Prompts & Style Overrides**: Visual prompts are generated automatically, but they can be manually edited. Style override textareas allow you to force custom descriptors (lighting, medium, artists) over standard presets.

---

### 🎭 Roleplay Scene Preview Stage
Located inside the **Roleplay Intro** panel:
* **Layered Staging Canvas**: An interactive 16:9 visual stage that overlays a generated transparent character sprite onto a generated setting background.
* **Sprite Generation**: Prompts are auto-crafted from the character's description and styled to render a clean, standalone portrait.
* **Background Generation**: Prompts are auto-crafted from the intro scenario to render detailed backgrounds (blurred and darkened to emphasize the character sprite).
* **Scene Prompt Editors**: Both background and character sprite prompts are fully editable for manual adjustments.

---

## 2. Interactive Character Sheet Dashboard

This module turns unstructured prose generated under SCDG into a sleek, visual character sheet.

* **Layout Styles**: 
  * **Default Glass**: Modern glassmorphism with soft blur backdrops and clean borders.
  * **Cyberpunk Neon**: High-contrast dark cards with neon pink/blue borders and retro-grid elements.
* **Accent Color Customization**: Live-updating color schemes (*Emerald Green, Cyberpunk Pink, Sunset Gold, Sapphire Blue, Crimson Red, Amethyst Purple*).
* **Auto-Compiler**: Analyzes unstructured text and compiles it into:
  * *Overview Summary & Tagline*
  * *Identity & Physical Tables* (Age, Species, Hair, Eyes, Scars, Posture)
  * *Psychology Table* (Personality, Mentality, Fears, Motives)
  * *Dynamic Lists*: Editable bullet items for *Inventory, Relations, Lore & Facts, and Scenario quirks*.
* **Visual Slot Picker**: Open a picker modal that displays all generated images for this character, allowing you to select and assign images to:
  * *Cover Banner*
  * *Profile Avatar*
  * *Physical Portrait*
  * *Relations Portrait*
* **Offline HTML Export**: Generates a single standalone HTML file containing the entire dashboard layout, style sheets, icons, and **embedded base64 images**, allowing the file to be viewed completely offline with full styling.

---

## 3. Supreme World Generator

Builds extensive world settings with custom geography, societies, and rules.

* **Visual Landscape Banner**: Generates an environment banner showing the visual identity of the world.
* **Magic Wiki Import**: Paste world-building wiki pages (e.g., from *Genshin Impact Fandom*) to extract lore structures.
* **8 World Building Panels**:
  1. **Core Identity**: Title, setting tags, tones, and core keywords/themes.
  2. **World Overview**: Setting background, tech level, daily life, and global secrets.
  3. **Rules**: A structured bullet list of up to 5 rules shaping culture, conflict, or behavior.
  4. **Races**: Names and descriptions of major races, strengths, and weaknesses.
  5. **Regions**: A list of at least 5 geographic regions with landscapes and significance.
  6. **Major Factions**: At least 4 political or secret groups with leaders, quotes, and symbols.
  7. **Bestiary**: Creature habitats, danger levels, and lists of common animals.
  8. **Important Characters**: At least 4 prominent historical figures with backgrounds.

---

## 4. Supreme Roleplay Scenario Generator

Fleshes out multi-character scenarios where the player interacts with dynamic NPCs.

* **SCDG World Sync**: Syncs the active World Name, World Lore, setting tags, and tones from the Characters tab with a single click.
* **Player Configuration**: Define your name and custom background/role.
* **NPC Cast Grid**: Add multiple NPCs. You can:
  * *Manually fill details* (Name, Species, Personality, Role).
  * *Auto-generate individual NPCs* using setting context.
  * *Import saved characters* from your repository, which automatically extracts species, role, and personality snapshots.
* **Dual Output Panels**:
  * **Scenario Sheet**: Formulates setting rules, relationship dynamics, NPC details, and plot objectives.
  * **Starter Post**: Writes the starting descriptive narrative, dialogue hooks, and sensory details to prompt the player's first response.
* **Markdown Export**: Download the roleplay scenario as a formatted `.md` document.

---

## 5. Context-Aware AI Assistant

An interactive chatbot helper integrated directly into the workspace.

* **Concept Builder**: Bounces character concepts, refines style prompts, drafts backstory, or debugs lists.
* **Thinking Mode**: An optional toggle showing the model's step-by-step reasoning process before presenting answers.
* **Workspace Context**: Aware of settings and the active character to answer prompts with contextual accuracy.

---

## 6. Application Settings & Generation Constraints

Configure system behavior, confirmation popups, and formatting rules.

### ⚠️ Confirmation Warning Toggles
* **Confirm on Clear**: Warns before clearing active panels.
* **Confirm on Load**: Warns when loading a saved slot (prevents overwriting current edits).
* **Confirm on Update**: Warns before overwriting a saved slot.
* **Skip Overview Concept**: Bypasses the modal confirmation when generating characters from scratch.

### 🚫 Generation Constraints
* **Ban Em-Dashes (—)**: Forces the AI to use standard punctuation instead of em-dashes.
* **Ban Bolding (\*\*)**: Suppresses bold text markers in character details.
* **Custom Banned Words**: A comma-separated list of custom words or symbols (e.g., *smirk, chuckle, ~*) that the AI is forbidden from using.

---

## 💾 Local Storage & Export Controls

All work is saved locally in your browser's `localStorage` to ensure persistence across reloads.

* **Saved Characters Sidebar**: Checkboxes to toggle character references, search bar to filter slots, and double-click to rename.
* **Saved Worlds Sidebar**: List of world databases, search bar, and double-click to rename.
* **Universal Import/Export**: Export all saved characters or saved worlds as JSON backups.
* **Download ZIP Archive**: Package your current character workspace into a single `.zip` file containing:
  * `character_description.md` (Prose and details)
  * `world.md` (World overview details)
  * `[character]_lore.json` (Structured keyword entries)
  * `[character].[png/jpg]` (Portrait avatar)
  * `[world].[png/jpg]` (Setting banner)
