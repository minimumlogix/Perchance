---
trigger: always_on
---

The **[Text to Image Plugin](https://perchance.org/text-to-image-plugin)** allows you to generate images from text descriptions using AI directly within your Perchance generators. Because running AI models requires significant computational power, the plugin processes requests on server GPUs.

> ⚠️ **Important Note on Monetization:** To cover server GPU costs, this plugin automatically displays an ad at the bottom of the screen on your generator **only for non-logged-in users**. If you are logged into your Perchance account, or if you remove the plugin, the ad will not be shown.

---

## 🛠️ Getting Started: Importing the Plugin

To use the plugin, you must first import it by adding this line to your Perchance **lists editor** (the left-hand panel):

```perchance
image = {import:text-to-image-plugin}

```

---

## 💻 Basic Usage

Once imported, you can call the plugin like a function, passing your text prompt as the argument.

### 1. Set up your lists

Here is an example setup using random lists to dynamically build a prompt:

```perchance
character
  a {mech|demon|cyberpunk} {warrior|minion|samurai}

place
  soviet russia
  a small village
  a mountainous region
  an underwater cavern

season
  winter
  summer
  
prompt
  detailed painting of [character] in [place], [season]
  
output
  [image(prompt)]

```

### 2. Display the Image

To display the image, simply place `[output]` inside your **HTML panel** (the bottom-right panel) wherever you want the image to appear.

---

## 🔍 Displaying the Text Prompt

By default, users can hover their mouse over the generated image (or long-press on mobile) to view the exact text prompt used.

If you want to manually display the prompt text as HTML beneath your image, use the special `lastTextToImagePrompt` variable provided by the plugin:

```perchance
output
  [image(prompt)] <br> [lastTextToImagePrompt]

```

### Positioning the Prompt *Before* the Image

Because Perchance randomizes lists every time they are called, writing `[prompt] <br> [image(prompt)]` would result in two completely different descriptions. To display the text text *above* the image accurately, evaluate it into a temporary variable first:

```perchance
output
  [p = prompt.evaluateItem] <br> [image(p)]

```

---

## ⚙️ Advanced Configuration Options

You can customize your image generations by passing extra configuration options. This can be done in two ways.

### Method A: Using a `promptData` List (Cleanest)

Create a dedicated options list in your lists editor:

```perchance
promptData
  prompt = painting of [character] in [place]
  seed = 123
  size = 400 // Changes visual display size (valid for square resolutions only)
  resolution = 512x768 // Options: 512x512, 512x768, 768x512
  guidanceScale = 7 // Matches prompt strictness (Range: 1 to 30. Default: 7)
  negativePrompt = blur, blurry image, deformed, bad anatomy
  style = border:4px solid blue; margin-top:20px; // Custom CSS styling

```

Then, call it in your output using: `[image(promptData)]`

### Method B: In-Prompt Inline Options

Alternatively, you can inject settings directly inside your text string using a triple-colon `:::` syntax inside parentheses:

```perchance
prompt
  [character] in [place] (resolution:::768x512) (seed:::123) (guidanceScale:::10)
  
output
  [image(prompt)]

```

---

## 🖼️ Embedding a Public Gallery

The plugin includes built-in community gallery features, allowing users to browse, rate, and sort images generated across your platform.

To display a gallery interface automatically, create a `galleryOptions` configuration block:

```perchance
galleryOptions
  gallery = true
  sort = top // Choices: 'top', 'recent', 'trending'
  timeRange = 1-week // Choices: '1-day', '3-day', '1-week', '1-month', '1-year', 'all-time'
  hideIfScoreIsBelow = -2 
  adaptiveHeight = true

```

To render it on your page, call `[image(galleryOptions)]` in your HTML panel.

### Gallery Moderation

You can actively moderate your public gallery to block specific bad actors or flag sensitive phrases using regex or plain text:

```perchance
galleryOptions
  gallery = true
  bannedUsers 
    f50d4a0ca69251638c9d0eb5823c0e4fba538263efb15c47c2d2f398e91bf169
  bannedPromptPhrases
    pg13:blood // Bans 'blood' specifically in pg13 mode
    /twin.?towers?/ // Regex-based pattern matching

```

---

## 🚀 JavaScript Programmatic Usage

For advanced developers who want to handle the images via custom JavaScript functions rather than standard Perchance markup, you can interact with the plugin asynchronously:

```javascript
async function generateCustomImage() {
  let result = await image({
    prompt: "a cute mouse wearing a tiny crown",
    resolution: "512x512"
  });
  
  // The result object returns rich data:
  console.log("Final Prompt Used:", result.inputs.prompt);
  
  // Append the HTML5 Canvas element directly to your page
  document.body.append(result.canvas);
  
  // Or extract the raw base64 data URL to use in an <img> tag src
  let myImageSrc = result.dataUrl;
}

```