---
trigger: always_on
---

#🖋️📜 AI Text Plugin: Detailed Instruction Guide

The [AI Text Plugin](https://perchance.org/ai-text-plugin) allows you to generate AI-driven text within Perchance. Because it requires significant computational power, it runs on server GPUs and is ad-funded for non-logged-in users (ads appear at the bottom of the generator).

Here is a comprehensive guide on how to import, use, and configure the plugin.

---

### 1. Importing the Plugin

To begin using the AI text generation capabilities, you must first import the plugin into your lists editor by adding the following line:

```perchance
ai = {import:ai-text-plugin}

```

### 2. Basic Usage

You can generate text by passing an instruction directly to the plugin or by referencing a structured list.

**Direct Text Input:**
Passing text directly into the plugin treats the text as the `instruction`.

```perchance
output
  [ai("Explain quantum field theory to a toddler.")]

```

**Using a Prompt List:**
You can create a structured list to dynamically generate prompts.

```perchance
character
  {mech|demon|cyberpunk}

place
  a retropunk distopia
  an underwater cavern

poemPrompt
  instruction = Write a haiku about a [character] in [place].
  
output
  [ai(poemPrompt)]

```

### 3. Prompt Options and Configuration

When passing a structured list to the `ai` plugin, you can use several properties to control the AI's behavior and output format:

* **`instruction`**: The core command telling the AI what to write.
* **`startWith`**: Text that the AI must use as the beginning of its response.
* **`hideStartWith`**: Set to `true` if you want the `startWith` text to remain hidden from the final displayed output.
* **`stopSequences`**: A list of words or phrases that will force the AI to stop generating text if it encounters them.
* **`outputTo`**: Directs the generated text into a specific HTML element based on its ID (e.g., `outputTo = [myCoolElement]`).
* **`endButtons`**: Set this to `none` (i.e., `endButtons = none`) to hide the default edit/continue buttons that appear at the end of the AI's response.
* **`style`**: Allows you to apply CSS styling directly to the output container (e.g., `style = text-align:left; color:blue;`).

### 4. Advanced Event Handling (JavaScript/Functions)

The plugin provides hooks to execute custom code at different stages of the generation process:

* **`onStart(data)`**: Runs when generation begins. Access inputs via `data.inputs.instruction` or `data.inputs.startWith`.
* **`onChunk(data)`**: Runs after every generated chunk (usually a word). You can access `data.textChunk`, `data.fullTextSoFar`, and `data.isFromStartWith`.
* **`onFinish(data)`**: Runs when generation completes. `data.text` contains the final text including the `startWith` text. `data.generatedText` contains the text *excluding* the `startWith` text.
* **`render(data)`**: Allows you to transform the visual output of the chunks (e.g., parsing asterisks into HTML bold tags). `data.text` contains the text so far, and `data.isPartial` indicates if the AI is still generating.

### 5. Multi-line Inputs

If your `instruction` or `startWith` requires multiple lines (like a script or dialogue), configure the list to join the items with a newline (`\n`) rather than a standard HTML break, as the AI is trained primarily on raw text.

```perchance
catGymPrompt
  startWith
    cat: i umm... *muffled heavy breathing* i am a cat
    kind staff member: sure! i can help you with that
    cat:
    $output = [this.joinItems("\n")] 

```

### 6. JavaScript Integration

You can call the plugin directly via JavaScript if you need programmatic control over the generation.

```javascript
async start() =>
  let result = await ai({
    instruction: "write a poem",
    onChunk: function(data) {
      console.log("chunk:", data);
    },
  });
  console.log(result.generatedText, result);

```

*Note: The returned `result` object also functions as a String, meaning you can assign it directly to an element's `innerHTML` (e.g., `foo.innerHTML = result`).*