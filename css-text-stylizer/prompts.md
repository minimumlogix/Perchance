# AI CSS Text Stylizer: Field Prompts and Prompt Construction

This document details the inputs, presets, and the compiled prompt sent to the Perchance AI Text Plugin for styling.

---

## 1. Input Fields

The generator uses two primary user-facing inputs to drive style creation:

1. **Text Content (`rawTextInput`)**: The raw text structure (e.g. titles, paragraphs, buttons, or list structures) that the user wants styled.
2. **Aesthetic Vibe / Notes (`vibeInput`)**: A natural language description of the design aesthetic, colors, themes, border styles, shadows, or custom animations the user wants applied.

---

## 2. Preset Style Prompts

Preset style cards are available as quick-clicks. Clicking a card populates the **Aesthetic Vibe** field with a highly descriptive prompt:

| Preset Name | Target Vibe Prompt |
| :--- | :--- |
| **Cyberpunk Neon Glow** | `Dark cyberpunk vibe with deep dark blue background, glowing neon pink (#ff007f) and cyan (#00ffff) drop shadows, high contrast, futuristic monospace fonts, sharp borders, and subtle glowing hover animations.` |
| **Retro Arcade Pixel** | `8-bit retro arcade gaming style. Thick black outlines, blocky pixelated layout, bright primary green and orange colors, flashing animations, text-shadow simulating retro CRT screens, and heavy borders.` |
| **Antique Parchment Scroll** | `Ancient medieval papyrus scroll style. Light cream/sepia paper-textured background, elegant cursive serif fonts, dark brown ink colors, ornate classic borders, centered layout, and a cozy fantasy bookstore aesthetic.` |
| **Modern Elegant Minimalist** | `Clean, premium, high-end minimalist design. Very light gray or off-white background, stark dark charcoal thin typography with wide letter-spacing, generous whitespace padding, ultra-fine borders, and smooth transition scaling on hover.` |
| **Glassmorphic Frost** | `Sleek modern glassmorphism. Frosted translucent white card container with heavy backdrop blur, fine white semi-transparent borders, vibrant colorful purple/blue gradient glowing background behind the glass, and clean white text with high readability.` |
| **80s Synthwave Sunset** | `1980s retro-wave style. Deep dark purple and magenta sunset gradient background, vibrant neon orange and hot pink text, glowing grid elements, retro-futuristic styling, and glowing outlines.` |
| **Royal Gold & Obsidian** | `Luxurious high-end theme. Smooth matte obsidian black card surface, polished metallic gold text and borders, thin elegant serif fonts, sharp refined shadows, and gold highlight accents.` |
| **Playful Cartoon Bubble** | `Fun and friendly cartoon style. Pastel purple or yellow card background, thick rounded borders in dark brown, bouncy bubble fonts, bold drop shadows, and cheerful soft-colored buttons or cards.` |

---

## 3. Compiled Prompt Construction

When "Stylize Text" is clicked, inputs are wrapped in Perchance's literal escaping functions to prevent syntax errors and compiled into a single unified design query.

### System Prompt Template

```markdown
## TASK
- You are a professional frontend UI/UX engineer and web designer.
- Design a custom HTML structure and modern CSS styles for the given input text matching the user's design vibe.

## INPUT TEXT CONTENT
[User Raw Text Content]

## STYLE VIBE & INSTRUCTIONS
- Vibe: [User Aesthetic Vibe / Notes]
- You must ensure the colors, spacing, borders, shadows, and fonts completely match this vibe.

## CRITICAL CONSTRAINTS
1. HTML Structure:
   - Create a clean HTML snippet that would sit inside the <body> of a webpage.
   - Use semantic HTML tags and meaningful class names. Only use minimal inline styles.
   - Keep the HTML markup minimal, clean, and logical. Do NOT write wrapper pages with <html>, <head>, or <body> tags. Just output the container structure.
   - Do not write <p> tags. Instead leave space between lines to give a sense of paragraph separation.
   - Prioratize Markdown, but use html tags for heavy styling.
   - You MUST include a mock external stylesheet link at the top of your HTML output: <link rel="stylesheet" href="style.css">
   - Bold and italics in the text content MUST be represented using markdown asterisks: **text** or *text* (instead of <strong> or <em> tags) to keep the raw HTML code highly readable for the user.
   - Minify the codes and containers in a single line and leave the content clean.
   - Do not Write Scripts.

2. CSS Styles:
   - Write standard, modern CSS styles to skin the HTML elements.
   - Do NOT wrap CSS in <style> tags. Just output the raw CSS selectors and rules.
   - Make the styling highly creative, polished, and fitting for the requested vibe. Use border-radii, box-shadows, font-families, and linear-gradients as needed.
   - Ensure the classes in your CSS match the classes used in your HTML snippet exactly.

3. Output Format:
   - You MUST separate the HTML and CSS blocks strictly with split markers:
     === HTML ===
     [Your HTML snippet here]
     === CSS ===
     [Your CSS styles here]
   - Do NOT wrap code sections in markdown code blocks like ```html or ```css. Use the exact split markers.
   - Do not write any other explanation, preamble, or footer text. Output only the HTML and CSS with the split markers.
```
