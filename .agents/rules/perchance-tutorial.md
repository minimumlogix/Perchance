---
trigger: always_on
---

# 📚 Perchance Tutorial

Perchance is a platform for creating random text generators. It is built around **lists** that reference each other to create complex, randomized outputs.

---

## 1. The Basics: Lists and Referencing

Perchance works by defining lists and calling them within other items.

### Creating a List

List names are followed by their items, which must be indented by **one tab** or **two spaces**.

```perchance
animal
  pig
  cow
  zebra

sentence
  That [animal] is very sneaky.
  I befriended a wild [animal] yesterday.
```

In each sentence, `[animal]` is replaced by a random item from the `animal` list.

### Single-Item Lists

If a list only has one item, you can use a shortcut:

```perchance
paragraph = [sentence] [sentence] [sentence]
```

### Special Characters and Escaping

* `\s`: Use at the start or end of an item to preserve spaces.
* `\t`: Represents a tab character.
* `\\`: Literal backslash.
* `\[`: Literal square bracket.
* `\=`: Literal equals sign.

---

## 2. Probability (Odds)

You can make certain items more likely than others using the "up arrow" (`^`) character.

```perchance
condiment
  pepper ^2          // Twice as likely as others
  salt               // Default weight is 1
  chilli flakes ^0.1 // Much less likely
  oregano ^1/10      // Fractions are also allowed
```

---

## 3. Shorthand (Curly) Lists

Sometimes you want to choose between items without creating a full list. Use curly brackets `{}`.

```perchance
sentence
  That's a {very|extremely} {tiny|small} [animal]!
```

### Key Rules for Curly Blocks

* **Evaluation:** Perchance "resolves" or "executes" the block into plain text.
* **Nesting:** You can put square blocks inside curly blocks: `{[animal]|[plant]}`.
* **Spaces:** Spaces *matter* inside curly blocks (`{hi | hello}` includes spaces).
* **Odds:** You can use weights inside curly blocks: `{big|large^3|massive}`.

### Grammatical Helpers

* `{a}`: Automatically chooses "a" or "an" based on the following word (e.g., `I'm {a} [animal]`).
* `{s}`: Intelligent pluralization (e.g., `I have {1|2|3} banana{s}`).

### Ranges

* `{1-500}`: Random number between 1 and 500.
* `{a-z}`, `{A-Z}`: Random letter in the specified range.

---

## 4. Properties

Properties allow you to transform the output of a list item.

### String Transformations

* `.pluralForm` / `.singularForm`
* `.titleCase` (Capitalizes First Letter Of Each Word)
* `.sentenceCase` (Capitalizes first letter)
* `.upperCase` / `.lowerCase`

### Verb Tenses

* `.pastTense` / `.presentTense` / `.futureTense`

**Example:**

```perchance
[animal.pluralForm.titleCase] are very agile.
```

> [!NOTE]
> For more complex grammar, consider plugins like the [conjugate-plugin](https://perchance.org/conjugate-plugin) or [be-plugin](https://perchance.org/be-plugin).

---

## 5. Storing Text (Variables)

To use the *same* random selection multiple times, you must store it in a variable using the `=` sign inside square brackets.

```perchance
sentence
  Oh you've got me a [f = flower.selectOne]! Thank you, I love [f.pluralForm].
```

### The `evaluateItem` Command

If a list item contains random elements (like curly blocks), use `evaluateItem` to store the *result* rather than the "unevaluated" item.

```perchance
fruit
  {10-20} apples
  {30-70} pears

output
  [f = fruit.selectOne.evaluateItem]?! [f] is way too many!
```

Without `evaluateItem`, the second `[f]` might choose a different random number than the first.

---

## 6. Repeating and Joining Items

### Selecting Multiple Items

* `selectMany(n)`: Selects `n` items.
* `selectMany(min, max)`: Selects a random number of items between min and max.
* `selectUnique(n)`: Selects `n` unique items (no duplicates).

### Joining Items

Use `.joinItems("separator")` to format lists of items.

```perchance
sentence
  My favourite fruits are: [fruit.selectUnique(3).joinItems(", ")] and [fruit].
```

---

## 7. Consumable Lists

A **consumable list** is a copy of a list where items are removed once selected.

```perchance
t = topic.consumableList
sentence
  She mostly writes about [t] and [t]. // These will always be different
```

---

## 8. Hierarchical (Nested) Lists

Perchance allows you to create "lists of lists" using indentation.

```perchance
animal
  mammal
    kangaroo
    pig
  reptile
    lizard
    turtle

output
  A random mammal: [animal.mammal]
  A random animal of any type: [animal.selectOne]
```

### Structured Data

Hierarchies are useful for organizing complex data like character stats:

```perchance
race
  dwarf
    height = {7-15}0cm
    name = Dwarf
  elf
    height = {12-20}0cm
    name = Elf

output
  You met a [r = race.selectOne, r.name]. They are [r.height] tall.
```

---

## 9. Advanced Logic

### The "Or" Operator (`||`)

Provides a default value if a property doesn't exist.

```perchance
[a.body || "fur"] // Outputs a.body, or "fur" if a.body is undefined.
```

### Commas in Square Blocks

Allows executing multiple actions at once. Only the **last** item is displayed.

```perchance
[a=animal.selectOne, b=a.pastTense, ""] // Executes a and b, outputs nothing.
```

### Dynamic Odds

Change probabilities based on variables.

```perchance
score = {1-4}
adjective
  bad ^[s == 1]
  good ^[s == 2]
  great ^[s > 2]
```

---

## 10. Styling and HTML

Perchance outputs are rendered as HTML. You can use standard tags:

* `<b>Bold</b>`, `<i>Italic</i>`, `<u>Underline</u>`, `<s>Strikethrough</s>`
* `<br>`: New line.
* `<a href="url" target="_blank">Link</a>`: Hyperlink.

### Handling Long Items

To make long text items readable in the editor, use `$output`:

```perchance
longItem
  $output = [this.joinItems(" ")]
  This is the first part.
  This is the second part.
```

### Preserving Spaces

HTML ignores multiple spaces. Use `&nbsp;` for a single space, or wrap your output in a tag with `style="white-space:pre-wrap;"`.

---

## 11. Importing and Exporting

### Importing

Use `{import:generator-name}` to use lists from other generators.

```perchance
noun = {import:noun}
sentence = The [noun.pluralForm] are [adjective].
```

### Exporting with `$output`

When others import your generator, they get what you define in `$output`. If `$output` isn't defined, they get a random selection from all your top-level lists.

---

## 12. Sharing and Settings

Perchance is designed for sharing and remixing.

* **Public vs. Private:** By default, generators are listed on the [generators page](https://perchance.org/generators). You can make yours private in the **Settings** menu.
* **Remixing:** Anyone can click "Edit" on your generator to see the code. If they save changes, it creates a *copy* (clone) of your generator at a new URL; it does not overwrite your original.
* **Custom URLs:** You can change your generator's URL in the Settings menu.
* **Offline Use:** You can download your generator to use it without an internet connection.
* **Embedding:** Use an `<iframe>` to put your generator on your own website:

    ```html
    <iframe src="https://null.perchance.org/your-generator-name"></iframe>
    ```

---

## 13. The Perchance Editor

The editor consists of four main panels:

1. **Lists (Top Left):** Where you write your Perchance code.
2. **Preview (Top Right):** Live-updating view of your generator.
3. **Tester (Bottom Left):** A scratchpad for testing expressions.
4. **HTML (Bottom Right):** Where you customize the page structure and CSS.

### Editor Features

* **Comments:** Use `//` for notes that won't affect the output.
* **Indentation:** Highlight lines and press `Tab` to indent or `Shift+Tab` to un-indent.
* **Revisions:** If you accidentally delete work, use the "Revisions" button in the top menu to restore previous versions.
* **Saving:** `Ctrl+S` (or `Cmd+S`) to save.

---

## 14. Advanced Tips

* **Plugins:** Extend functionality with [plugins](https://perchance.org/plugins).
* **JavaScript:** Everything inside square brackets is actually JavaScript. If you know JS, you can perform complex logic.
* **Templates:** Use the [templates page](https://perchance.org/templates) to find a design you like without writing CSS.
* **Community:** Join the [friendly community](https://lemmy.world/c/perchance) to share your creations and ask questions.