---
description: The [Literal Plugin](https://perchance.org/literal-plugin) is used to sanitize or "escape" text inputs. It automatically places backslashes in front of square (`[]`) or curly (`{}`) brackets within a string of text.
---

# Overview of `literal-plugin`

The [Literal Plugin](https://perchance.org/literal-plugin) is used to sanitize or "escape" text inputs. It automatically places backslashes in front of square (`[]`) or curly (`{}`) brackets within a string of text. This ensures Perchance reads these characters as literal text rather than special generator syntax, preventing code errors when users input custom text containing brackets.

---

### Step 1: Import the Plugin

To use the plugin, you must first assign it to a variable in your Perchance code. It is standard practice to name the variable `literal`.

Add the following line to your code:

```perchance
literal = {import:literal-plugin}

```

---

### Step 2: Basic Usage (Escaping Brackets)

If you have an HTML input box (e.g., `<input id="nameBox">`) where users can type a nickname, they might input a name like `[C]ool[K]id`. If you call `[nameBox.value]` directly in your output, Perchance will attempt to evaluate `[C]` and `[K]` as lists and throw an error.

To prevent this, wrap the input value in the `literal()` function:

```perchance
output
  Your name is [literal(nameBox.value)] - what a {cool|interesting} name!

```

By doing this, any brackets the user types will be printed exactly as they typed them without breaking your generator.

---

### Step 3: Advanced Usage (Sanitizing HTML)

The plugin also includes a secondary function to convert HTML tags into plain text. If a user inputs `<b>blah</b>`, standard Perchance behavior will render the text as bold. If you want the exact characters `<b>blah</b>` to appear on the screen instead, you can pass `"+html"` as a second argument to the function.

Add the `"+html"` parameter like so:

```perchance
output
  Your name is [literal(nameBox.value, "+html")] ...

```