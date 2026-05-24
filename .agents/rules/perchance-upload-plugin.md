---
trigger: always_on
---

The **[Upload Plugin](https://perchance.org/upload-plugin)** allows you to programmatically upload files and data directly to Perchance's file storage server using JavaScript. This is incredibly useful for creating complex generators where users can save their results, create shareable URLs, or cache custom data without needing to be logged into a Perchance account.

---

## 🛠️ Getting Started: Importing the Plugin

To use the plugin, add the following line to your Perchance **lists editor** panel:

```perchance
upload = {import:upload-plugin}

```

---

## 💻 Core Usage (JavaScript)

Because this plugin relies on asynchronous server requests, it must be used inside an `async` JavaScript function.

### Basic Text Upload

You can pass a raw string directly to the `upload()` function. It will upload the text as a file and return a unique URL.

```javascript
async function saveMyData() {
  // Always use 'await' since uploading takes a moment
  let response = await upload("This is the text content of my file.");
  
  if (!response.error) {
    console.log("Uploaded successfully! URL:", response.url);
    console.log("File size in bytes:", response.size);
  } else {
    console.error("Upload failed:", response.error);
  }
}

```

### The Response Object

The `upload()` function always returns an object containing three properties:

* `url`: The public link to the uploaded file (returns `null` if the upload fails).
* `size`: The total size of the uploaded file in bytes.
* `error`: Returns `null` if successful. If it fails, it returns a string error code such as:
* `"file_too_big"`
* `"over_daily_allowance"`
* `"invalid_filetype"`



---

## ⏳ Optimizing with Temporary Files (Highly Recommended)

If the data or files you are uploading only need to exist for a limited time, you should use the **`expires`** parameter.

> 💡 **Why do this?** Perchance rewards temporary storage with massive limit increases. Setting an expiry window of 24 hours or less gives you up to a **400x higher file size limit and daily upload quota**. Even a 1-year expiry gives you a 20x boost.

To set an expiration, pass an options object as the second argument with a timestamp in milliseconds:

```javascript
async function saveTemporaryText() {
  // Calculate a timestamp for 24 hours from right now
  let oneDayFromNow = Date.now() + (1000 * 60 * 60 * 24);
  
  let { url, error } = await upload("Temporary data", { expires: oneDayFromNow });
  
  if (!error) {
    // The file is guaranteed to live for AT LEAST 24 hours
    document.getElementById("output").innerHTML = url;
  }
}

```

---

## 🗑️ Manual Deletion

If you need the ability to delete a file immediately after uploading it (for instance, if a user changes their mind), you can leverage the `deletionUrl` returned by the response.

*Note: Manual deletion via this URL is only valid within **3 days** of the initial upload.*

```javascript
// 1. Upload the file
let { url, deletionUrl } = await upload("Some data to delete later");

// 2. Trigger the deletion later by sending a fetch request to the deletion URL
async function deleteFile() {
  let response = await fetch(deletionUrl).then(r => r.json());
  if (response.success) {
    console.log("File successfully wiped from the server.");
  }
}

```

---

## 🔒 Moderation & NSFW Detection

If your generator allows users to upload custom files or images that will be displayed publicly to other visitors, you should check Perchance's automated safety tags before rendering them:

```javascript
let { url } = await upload(userBlobData);

// Query the Perchance fileInfo API using the generated URL
let fileData = await fetch(`https://upload.perchance.org/api/fileInfo?url=${url}`).then(r => r.json());

if (fileData && fileData.tags.includes("nsfw")) {
  alert("This content has been flagged as NSFW and cannot be shared publicly.");
} else {
  // Proceed with displaying the file safely
}

```

---

## 🗜️ Advanced Pro-Tip: Data Compression

Because the programmatic upload limits are structurally smaller than the manual drag-and-drop interface at [perchance.org/upload](https://perchance.org/upload), compressing your strings before uploading them is highly effective. You can check out this [compression/decompression example](https://www.google.com/search?q=https://perchance.org/upload-plugin-compress-example) to learn how to pack up to **10x more data** into your file size allowance.