---
trigger: always_on
---

# Overview of `literal-plugin`

The **`literal-plugin`** is a utility for Perchance used to **escape** or **sanitize** text. By default, Perchance treats square brackets `[...]` and curly brackets `{...}` as special syntax for executing code or picking random options.

If a user inputs text containing these brackets (e.g., a username like `[Cool][Kid]`), Perchance will attempt to parse them, resulting in a broken generator or a syntax error. The `literal-plugin` automatically inserts backslashes (`\`) before these characters so they are treated as literal text.

---

## Step-by-Step Implementation

### 1. Import the Plugin

To use the plugin, you must first import it at the top of your Perchance code block:

```perchance
literal = {import:literal-plugin}

```

### 2. Basic Usage (Escaping Brackets)

Wrap any unpredictable dynamic variables, user inputs (like HTML input box values), or text strings inside the `literal()` function.

```perchance
// Scenario: nameBox.value contains user input like "[Hawk_Eye]"

output
  Your username is [literal(nameBox.value)]!

```

* **Without the plugin:** Perchance looks for a list or variable named `Hawk_Eye`. If it doesn't exist, the generator crashes.
* **With the plugin:** The output safely renders as `Your username is [Hawk_Eye]!`.

### 3. Escaping HTML Characters

If you want to display raw HTML tags as plain text rather than letting the browser render them (e.g., showing the actual characters `<b>text</b>` instead of making the text **bold**), pass `"+html"` as the second argument.

```perchance
// Scenario: input contains "<b>Hello</b>"

output
  The raw code is: [literal(input.value, "+html")]

```

---

## Quick Reference Summary

| Feature | Syntax | Example Input | Resulting Output |
| --- | --- | --- | --- |
| **Standard Escaping** | `[literal(variable)]` | `{Awesome}` | `{Awesome}` (as plain text) |
| **HTML Escaping** | `[literal(variable, "+html")]` | `<i>Text</i>` | `<i>Text</i>` (not italicized) |

---

> ℹ️ **Note:** In general software development, this process is standard practice and is typically referred to as **escaping** or **sanitizing** input data to prevent code injection or compilation errors.