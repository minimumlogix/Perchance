/* ===========================
   IMAGE SERVICE (PERCHANCE T2I)
=========================== */
async function generateSceneIllustration(character, lastUserMsg) {
  const promptText = `detailed fantasy digital art illustration of ${character.name}, ${character.personality}, in ${character.location}, cinematic dark atmospheric lighting, high quality`;
  
  const imgPlugin = window.image || window.root?.image;
  if (typeof imgPlugin === "function") {
    try {
      const result = await imgPlugin({
        prompt: promptText,
        resolution: "512x512",
        guidanceScale: 7
      });
      if (result && result.dataUrl) {
        return result.dataUrl;
      }
    } catch (err) {
      console.warn("Perchance text-to-image plugin error:", err);
    }
  }

  // Fallback to active character avatar image
  return character.avatarUrl;
}
