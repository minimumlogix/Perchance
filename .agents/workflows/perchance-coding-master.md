---
description: A practical workflow for writing, debugging, and validating Perchance generators and plugin integrations.
---

# Perchance Coding Master

This guide helps you build valid Perchance generators, integrate plugins safely, and debug common syntax or logic issues.

---

## 1. Start with the goal

1. Identify the generator’s output type:
   - text output only
   - AI-generated text (`ai-text-plugin`)
   - image output (`text-to-image-plugin`)
   - interactive/custom HTML
2. Decide whether the generator should use a plugin or only standard Perchance lists.
3. Choose a consistent indentation style for this generator: either 2 spaces or 1 tab.

---

## 2. Write lists using Perchance structure

* Use top-level list names without spaces: `character`, `setting`, `output`.
* Indent nested items consistently.
* Do not use JSON arrays, commas, or JavaScript object notation.

Example:

```perchance
character
  dragon
  thief
  scholar

setting
  misty forest
  abandoned city
  crystal cave
```

---

## 3. Reference lists correctly

* Use square brackets for list calls: `[character]`, `[setting]`.
* Use dot notation for nested lists: `[weapon.sword]`.
* Use curly blocks for inline alternatives: `The hero carries a {sword|bow|staff}.`

---

## 4. Use variables when you need reuse

* Store random selections with `=` inside square brackets.
* Use `.evaluateItem` when the selected item contains further randomness.

Example:

```perchance
output
  [hero = character.selectOne.evaluateItem]
  The chosen hero is [hero] and their base setting is [setting].
```

---

## 5. Import plugins at the top

* Put imports before any list definitions.
* Use the correct plugin variable name and call syntax.

Examples:

```perchance
ai = {import:ai-text-plugin}
image = {import:text-to-image-plugin}
literal = {import:literal-plugin}
```

---

## 6. Plugin usage checklist

### AI Text Plugin
* Provide an `instruction` or list block to the plugin.
* Add `startWith`, `stopSequences`, or `endButtons` only when needed.
* Use `outputTo` if you want the generated text routed to a specific element.

Example:

```perchance
prompt
  instruction = Write a mythic short story about [character] in [setting].

output
  [ai(prompt)]
```

### Text-to-Image Plugin
* Keep prompt text in a variable if you need to display it separately.
* Use prompt options in a dedicated block for cleaner code.

Example:

```perchance
imagePrompt
  prompt = A dramatic portrait of [character] in [setting]
  resolution = 512x512

output
  [image(imagePrompt)]
```

---

## 7. Common debugging checks

1. Indentation error?
   - Mixed tabs/spaces?
   - Blank lines inside a list block?
2. Invalid list names?
   - Spaces inside the name?
   - Reserved words or stray punctuation?
3. Syntax mistakes?
   - Using `{}` in the Lists panel as if it were JavaScript.
   - Unescaped brackets inside literal text.
4. Plugin issues?
   - Plugin imported at the top?
   - Correct plugin function called?
5. Output formatting?
   - Did you use HTML tags only when needed?
   - Are spaces preserved with `&nbsp;` or `white-space:pre-wrap;` when required?

---

## 8. Quality criteria for a finished generator

* The generator runs without parser errors.
* Lists are consistently indented and named.
* Variables that should remain identical are stored and reused.
* Plugin calls are valid and appear at the top of the code.
* Output is readable and any HTML is intentionally formatted.

---

## 9. Example prompts for this skill

* "Help me build a Perchance generator that outputs a fantasy character and their quest."
* "Review this Perchance list code and find indentation or plugin errors."
* "Explain how to combine `ai-text-plugin` with a Perchance prompt list."

---

## 10. Next customization ideas

* Add a `Perchance Plugin Helper` skill for common plugin-specific patterns.
* Add a `Perchance Debug Checklist` workflow with examples of broken code and fixes.
* Add a `Perchance Output Styling` guide for advanced HTML and layout in generators.
