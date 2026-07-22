/* ===========================
   SHARE & CLOUD IMPORT SERVICE
=========================== */

const urlNamedCharacters = {
  "assistant": "assistant",
  "psychologist": "615fdef95fa7e75cbbaf943dc44d72be.gz",
  "ai-adventure": "b33c6ff0c14f92e8095ca90765848485.gz",
  "coding-assistant": "570b3c67b8ed9ed8f83ef652be549b1c.gz",
  "story-writer": "76b20593b117ab083d746312df4df296.gz",
  "world-war-simulator": "e1cf5213432a7eb9e310ec269fe38672.gz",
  "therapist": "5cdaa39f9aabc7424c3b2e1b780a1e29.gz"
};

async function compressBlobWithGzip(blob) {
  const cs = new CompressionStream('gzip');
  const compressedStream = blob.stream().pipeThrough(cs);
  const outputBlob = await new Response(compressedStream).blob();
  return new Blob([outputBlob], { type: "application/gzip" });
}

async function decompressBlobWithGzip(blob) {
  const ds = new DecompressionStream("gzip");
  const decompressedStream = blob.stream().pipeThrough(ds);
  return await new Response(decompressedStream).blob();
}

async function generateShareLinkForCharacter(json) {
  if (!window.CompressionStream) {
    alert("Share links use a feature that's only available in modern browsers. Please upgrade your browser to the latest version to use this feature.");
    return null;
  }

  const uploadPlugin = window.uploadPlugin || window.upload || window.root?.uploadPlugin;
  if (!uploadPlugin) {
    alert("Share links require the Perchance upload-plugin.");
    return null;
  }

  const jsonString = JSON.stringify(json);
  const dataUrlJsonString = jsonString.replace(/#/g, "%23");
  const blob = await fetch("data:text/plain;charset=utf-8," + dataUrlJsonString).then(res => res.blob());

  const compressedBlob = await compressBlobWithGzip(blob);
  const { url, error } = await uploadPlugin(compressedBlob);

  if (error) {
    alert(`Error: ${error}${error === "disallowed_content" ? ". If you believe this is incorrect, edit the character description to explicitly state that the character is 18 or older." : ""}`);
    return null;
  }

  const fileName = url.replace("https://user.uploads.dev/file/", "");
  const characterName = json.addCharacter ? json.addCharacter.name.replace(/\s+/g, "_").replace(/~/g, "") : "character";
  const generatorName = window.generatorName || "ai-character-chat";
  const shareUrl = `https://perchance.org/${generatorName}?data=${characterName}~${fileName}`;
  
  return shareUrl;
}

async function loadDataFromUrlThatReferencesCloudStorageFile() {
  if (!window.DecompressionStream) {
    console.warn("Character share links require modern browser DecompressionStream support.");
    return null;
  }

  try {
    const searchParams = new URL(window.location.href).searchParams;
    let dataParamValue = searchParams.get("data");

    if (!dataParamValue) {
      if (searchParams.get("char") && urlNamedCharacters[searchParams.get("char")]) {
        dataParamValue = "foo~" + urlNamedCharacters[searchParams.get("char")];
      } else {
        return null;
      }
    }

    const fileName = dataParamValue.split("~").slice(-1)[0];
    const fileUrl = "https://user.uploads.dev/file/" + fileName;

    const blob = await fetch(fileUrl, { signal: AbortSignal.timeout ? AbortSignal.timeout(15000) : null })
      .then(res => res.ok ? res.blob() : null)
      .catch(console.error);

    if (!blob) {
      if (window.confirmAsync) {
        await confirmAsync(`Tried to load character share URL, but the file specified does not exist. Check perchance.org/quarantined-files`, { hideCancel: true });
      }
      return null;
    }

    let text;
    if (fileUrl.endsWith(".gz") || dataParamValue.includes("~")) {
      const decompressedBlob = await decompressBlobWithGzip(blob);
      text = await decompressedBlob.text();
    } else {
      text = await blob.text();
    }

    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to load chat data from cloud URL:", e);
    return null;
  }
}

async function checkAndLoadDataFromUrl() {
  return await loadDataFromUrlThatReferencesCloudStorageFile();
}

/* ===========================
   CHARACTER URL SLUG ROUTER
=========================== */
function slugifyName(name) {
  return (name || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCharacterSlug(char) {
  if (!char) return "";
  const uid = char.uniqueId || char.id.substring(0, 5);
  const nameSlug = slugifyName(char.name);
  return `${uid}-${nameSlug}`;
}

async function findCharacterBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.replace(/^#\/?/, "").replace(/^\?char=/, "").replace(/^\//, "").trim();
  if (!cleanSlug || cleanSlug === "home") return null;

  const uid = cleanSlug.split("-")[0];

  const allChars = await db.characters.toArray();
  let match = allChars.find(c => c.uniqueId === uid || c.id === cleanSlug || c.id === uid);
  if (!match) {
    match = allChars.find(c => getCharacterSlug(c) === cleanSlug || c.id.includes(uid));
  }
  if (!match && typeof EXPLORE_CATALOG !== "undefined") {
    match = EXPLORE_CATALOG.find(c => c.uniqueId === uid || getCharacterSlug(c) === cleanSlug || c.id === uid);
  }
  return match;
}

