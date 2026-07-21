/* ===========================
   SHARE & CLOUD IMPORT SERVICE
=========================== */
async function generateCharacterShareLink(characterObj) {
  const upload = window.uploadPlugin || window.upload || window.root?.uploadPlugin;
  if (!upload) {
    alert("Share links require the Perchance upload-plugin when running on Perchance.");
    return null;
  }

  if (!window.CompressionStream) {
    alert("Share links require modern browser CompressionStream support.");
    return null;
  }

  try {
    const jsonString = JSON.stringify(characterObj);
    const blob = new Blob([jsonString], { type: "application/json" });

    // Gzip compress
    const cs = new CompressionStream('gzip');
    const compressedStream = blob.stream().pipeThrough(cs);
    const compressedBlob = await new Response(compressedStream).blob();

    const { url, error } = await upload(compressedBlob);
    if (error) {
      alert("Error uploading share link: " + error);
      return null;
    }

    const fileName = url.replace("https://user.uploads.dev/file/", "");
    const safeCharName = characterObj.name.replace(/\s+/g, "_").replace(/~/g, "");
    const generatorName = window.generatorName || "ai-character-chat";
    const shareUrl = `https://perchance.org/${generatorName}?data=${safeCharName}~${fileName}`;
    return shareUrl;
  } catch (err) {
    console.error("Failed to generate share link:", err);
    alert("Failed to generate share link: " + err.message);
    return null;
  }
}

async function checkAndLoadDataFromUrl() {
  const searchParams = new URLSearchParams(window.location.search);
  const dataParam = searchParams.get("data");
  if (!dataParam) return null;

  if (!window.DecompressionStream) {
    console.warn("DecompressionStream not supported by browser.");
    return null;
  }

  try {
    const fileName = dataParam.split("~").slice(-1)[0];
    const fileUrl = "https://user.uploads.dev/file/" + fileName;

    const res = await fetch(fileUrl);
    if (!res.ok) return null;

    const blob = await res.blob();
    let jsonText = "";

    if (fileUrl.endsWith(".gz") || dataParam.includes("~")) {
      const ds = new DecompressionStream('gzip');
      const decompressedStream = blob.stream().pipeThrough(ds);
      jsonText = await new Response(decompressedStream).text();
    } else {
      jsonText = await blob.text();
    }

    const characterObj = JSON.parse(jsonText);
    return characterObj;
  } catch (err) {
    console.error("Error loading share link data:", err);
    return null;
  }
}
