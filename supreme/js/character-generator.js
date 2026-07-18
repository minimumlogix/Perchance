/* ==========================================================================
   CACHE STORAGE API MANAGER
   ========================================================================== */
    const CACHE_NAME = "scdg-image-cache";
    let resolvedObjectUrls = new Map();

    window.writeImageToCache = async function (virtualUrl, dataUrlOrBlob) {
        if (!dataUrlOrBlob) return;
        try {
            const cache = await window.caches.open(CACHE_NAME);
            let blob;
            if (dataUrlOrBlob instanceof Blob) {
                blob = dataUrlOrBlob;
            } else if (typeof dataUrlOrBlob === "string" && dataUrlOrBlob.startsWith("data:")) {
                const response = await fetch(dataUrlOrBlob);
                blob = await response.blob();
            } else if (typeof dataUrlOrBlob === "string" && dataUrlOrBlob.startsWith("blob:")) {
                const response = await fetch(dataUrlOrBlob);
                blob = await response.blob();
            } else {
                return;
            }
            const response = new Response(blob, {
                headers: { "Content-Type": blob.type || "image/png" }
            });
            await cache.put(virtualUrl, response);
        } catch (e) {
            console.error("Error writing to image cache:", e);
        }
    };

    window.resolveCacheUrl = async function (virtualUrl) {
        if (!virtualUrl) return "";
        if (!virtualUrl.startsWith("https://scdg-local-cache/")) {
            return virtualUrl;
        }
        if (resolvedObjectUrls.has(virtualUrl)) {
            return resolvedObjectUrls.get(virtualUrl);
        }
        try {
            const cache = await window.caches.open(CACHE_NAME);
            const response = await cache.match(virtualUrl);
            if (response) {
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                resolvedObjectUrls.set(virtualUrl, objectUrl);
                return objectUrl;
            }
        } catch (e) {
            console.error("Error resolving cache URL:", e);
        }
        return "";
    };

    window.getCachedImageAsBase64 = async function (virtualUrl) {
        if (!virtualUrl || !virtualUrl.startsWith("https://scdg-local-cache/")) {
            return virtualUrl;
        }
        try {
            const cache = await window.caches.open(CACHE_NAME);
            const response = await cache.match(virtualUrl);
            if (response) {
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }
        } catch (e) {
            console.error("Error reading cached image as base64:", e);
        }
        return "";
    };

    window.deleteCharacterCache = async function (id) {
        try {
            const cache = await window.caches.open(CACHE_NAME);
            const keys = await cache.keys();
            const prefix = `https://scdg-local-cache/characters/${id}/`;
            for (let key of keys) {
                if (key.url.startsWith(prefix)) {
                    await cache.delete(key);
                    if (resolvedObjectUrls.has(key.url)) {
                        URL.revokeObjectURL(resolvedObjectUrls.get(key.url));
                        resolvedObjectUrls.delete(key.url);
                    }
                }
            }
        } catch (e) {
            console.error("Error deleting character cache:", e);
        }
    };

    window.clearAllCharacterCache = async function () {
        try {
            await window.caches.delete(CACHE_NAME);
            for (let objectUrl of resolvedObjectUrls.values()) {
                URL.revokeObjectURL(objectUrl);
            }
            resolvedObjectUrls.clear();
        } catch (e) {
            console.error("Error clearing all character cache:", e);
        }
    };

    window.copyActiveCacheToCharacter = async function (id) {
        try {
            const cache = await window.caches.open(CACHE_NAME);
            const keys = await cache.keys();
            const activePrefix = `https://scdg-local-cache/characters/active/`;
            const charPrefix = `https://scdg-local-cache/characters/${id}/`;
            
            await window.deleteCharacterCache(id);
            
            for (let key of keys) {
                if (key.url.startsWith(activePrefix)) {
                    const response = await cache.match(key);
                    if (response) {
                        const blob = await response.blob();
                        const newUrl = key.url.replace(activePrefix, charPrefix);
                        const newResponse = new Response(blob, {
                            headers: { "Content-Type": blob.type || "image/png" }
                        });
                        await cache.put(newUrl, newResponse);
                    }
                }
            }
        } catch (e) {
            console.error("Error copying active cache to character:", e);
        }
    };

    window.copyCharacterCacheToActive = async function (id) {
        try {
            const cache = await window.caches.open(CACHE_NAME);
            const keys = await cache.keys();
            const activePrefix = `https://scdg-local-cache/characters/active/`;
            const charPrefix = `https://scdg-local-cache/characters/${id}/`;
            
            await window.deleteCharacterCache("active");
            
            for (let key of keys) {
                if (key.url.startsWith(charPrefix)) {
                    const response = await cache.match(key);
                    if (response) {
                        const blob = await response.blob();
                        const newUrl = key.url.replace(charPrefix, activePrefix);
                        const newResponse = new Response(blob, {
                            headers: { "Content-Type": blob.type || "image/png" }
                        });
                        await cache.put(newUrl, newResponse);
                    }
                }
            }
        } catch (e) {
            console.error("Error copying character cache to active:", e);
        }
    };

    window.duplicateCharacterCache = async function (oldId, newId) {
        try {
            const cache = await window.caches.open(CACHE_NAME);
            const keys = await cache.keys();
            const oldPrefix = `https://scdg-local-cache/characters/${oldId}/`;
            const newPrefix = `https://scdg-local-cache/characters/${newId}/`;
            
            for (let key of keys) {
                if (key.url.startsWith(oldPrefix)) {
                    const response = await cache.match(key);
                    if (response) {
                        const blob = await response.blob();
                        const newUrl = key.url.replace(oldPrefix, newPrefix);
                        const newResponse = new Response(blob, {
                            headers: { "Content-Type": blob.type || "image/png" }
                        });
                        await cache.put(newUrl, newResponse);
                    }
                }
            }
        } catch (e) {
            console.error("Error duplicating character cache:", e);
        }
    };

    window.translateActiveToCharKeys = function (obj, id) {
        if (!obj) return obj;
        const activePrefix = `https://scdg-local-cache/characters/active/`;
        const charPrefix = `https://scdg-local-cache/characters/${id}/`;
        
        const translateVal = (val) => {
            if (typeof val === "string" && val.startsWith(activePrefix)) {
                return val.replace(activePrefix, charPrefix);
            }
            if (Array.isArray(val)) {
                return val.map(item => translateVal(item));
            }
            if (val && typeof val === "object") {
                let copy = {};
                for (let k in val) {
                    copy[k] = translateVal(val[k]);
                }
                return copy;
            }
            return val;
        };
        
        let copy = {};
        for (let key in obj) {
            copy[key] = translateVal(obj[key]);
        }
        return copy;
    };

    window.translateCharToActiveKeys = function (obj, id) {
        if (!obj) return obj;
        const activePrefix = `https://scdg-local-cache/characters/active/`;
        const charPrefix = `https://scdg-local-cache/characters/${id}/`;
        
        const translateVal = (val) => {
            if (typeof val === "string" && val.startsWith(charPrefix)) {
                return val.replace(charPrefix, activePrefix);
            }
            if (Array.isArray(val)) {
                return val.map(item => translateVal(item));
            }
            if (val && typeof val === "object") {
                let copy = {};
                for (let k in val) {
                    copy[k] = translateVal(val[k]);
                }
                return copy;
            }
            return val;
        };
        
        let copy = {};
        for (let key in obj) {
            copy[key] = translateVal(obj[key]);
        }
        return copy;
    };

    window.translateCharacterCacheKeys = function (obj, oldId, newId) {
        if (!obj) return obj;
        const oldPrefix = `https://scdg-local-cache/characters/${oldId}/`;
        const newPrefix = `https://scdg-local-cache/characters/${newId}/`;
        
        const translateVal = (val) => {
            if (typeof val === "string" && val.startsWith(oldPrefix)) {
                return val.replace(oldPrefix, newPrefix);
            }
            if (Array.isArray(val)) {
                return val.map(item => translateVal(item));
            }
            if (val && typeof val === "object") {
                let copy = {};
                for (let k in val) {
                    copy[k] = translateVal(val[k]);
                }
                return copy;
            }
            return val;
        };
        
        let copy = {};
        for (let key in obj) {
            copy[key] = translateVal(obj[key]);
        }
        return copy;
    };

    window.resolveLazyCacheImages = async function (container) {
        if (!container) return;
        const imgs = container.querySelectorAll("img[data-src^='https://scdg-local-cache/']");
        for (let img of imgs) {
            const virtualUrl = img.getAttribute("data-src");
            const resolved = await window.resolveCacheUrl(virtualUrl);
            if (resolved) {
                img.src = resolved;
            }
        }
        const bgs = container.querySelectorAll("[data-bg-src^='https://scdg-local-cache/']");
        for (let el of bgs) {
            const virtualUrl = el.getAttribute("data-bg-src");
            const resolved = await window.resolveCacheUrl(virtualUrl);
            if (resolved) {
                el.style.backgroundImage = `url(${resolved})`;
            }
        }
    };

    window.syncActiveImagesToCache = async function () {
        // 1. Avatar
        let avatarUrl = window.selectedAvatarUrl || localStorage.selectedAvatarUrl || "";
        if (avatarUrl && (avatarUrl.startsWith("data:") || avatarUrl.startsWith("blob:"))) {
            const virtualUrl = "https://scdg-local-cache/characters/active/avatar";
            await window.writeImageToCache(virtualUrl, avatarUrl);
            window.selectedAvatarUrl = virtualUrl;
            localStorage.selectedAvatarUrl = virtualUrl;
            const avatarEl = document.getElementById("characterAvatarEl");
            if (avatarEl) {
                const resolved = await window.resolveCacheUrl(virtualUrl);
                avatarEl.style.backgroundImage = `url(${resolved})`;
            }
        }
        
        // 2. World Lore Image
        let worldLoreUrl = localStorage.worldLoreImageUrl || "";
        if (worldLoreUrl && (worldLoreUrl.startsWith("data:") || worldLoreUrl.startsWith("blob:"))) {
            const virtualUrl = "https://scdg-local-cache/characters/active/world-lore";
            await window.writeImageToCache(virtualUrl, worldLoreUrl);
            localStorage.worldLoreImageUrl = virtualUrl;
            const thumb = document.getElementById("worldLoreThumbEl");
            const bg = document.getElementById("worldLoreBgEl");
            const resolved = await window.resolveCacheUrl(virtualUrl);
            if (thumb) thumb.style.backgroundImage = `url(${resolved})`;
            if (bg) bg.style.backgroundImage = `url(${resolved})`;
        }
        
        // 3. Intro Background
        let introBgUrl = localStorage.introBgImageUrl || "";
        if (introBgUrl && (introBgUrl.startsWith("data:") || introBgUrl.startsWith("blob:"))) {
            const virtualUrl = "https://scdg-local-cache/characters/active/intro-bg";
            await window.writeImageToCache(virtualUrl, introBgUrl);
            localStorage.introBgImageUrl = virtualUrl;
            const introBg = document.getElementById("introImageBg");
            const resolved = await window.resolveCacheUrl(virtualUrl);
            if (introBg) introBg.style.backgroundImage = `url(${resolved})`;
        }
        
        // 4. Intro Character
        let introCharUrl = localStorage.introCharImageUrl || "";
        if (introCharUrl && (introCharUrl.startsWith("data:") || introCharUrl.startsWith("blob:"))) {
            const virtualUrl = "https://scdg-local-cache/characters/active/intro-char";
            await window.writeImageToCache(virtualUrl, introCharUrl);
            localStorage.introCharImageUrl = virtualUrl;
        }
        
        // 5. Active Portrait Images
        const portraitImgs = document.querySelectorAll("#imagesEl img");
        let portraitUrls = [];
        let idx = 0;
        for (let img of portraitImgs) {
            let src = img.src;
            if (src) {
                if (src.startsWith("data:") || src.startsWith("blob:")) {
                    const virtualUrl = `https://scdg-local-cache/characters/active/portrait-${idx}`;
                    await window.writeImageToCache(virtualUrl, src);
                    img.src = await window.resolveCacheUrl(virtualUrl);
                    portraitUrls.push(virtualUrl);
                } else if (src.startsWith("https://scdg-local-cache/")) {
                    portraitUrls.push(src);
                } else {
                    portraitUrls.push(src);
                }
                idx++;
            }
        }
        if (portraitUrls.length > 0) {
            localStorage.activeImages = JSON.stringify(portraitUrls);
        }
        
        await window.checkStorageUsage();
    };
/* ==========================================================================
   WORLD LORE NARRATIVE GENERATOR
   ========================================================================== */
    window.generateWorldLore = async function (force = false) {
        if (!force && worldLoreEl.value.trim().length > 0) return;

        if (window.sectionStreams && window.sectionStreams["worldLore"]) {
            window.sectionStreams["worldLore"].stop();
        }

        setSectionGenerating("worldLore", true);
        setSectionStatus("worldLore", "⏳ Chronicling world lore...");
        setGenerationStatus("Chronicling world lore...");

        let settingValue = settingEl.value;
        let toneValues = getSelectedTones();
        let toneStr = toneValues.length > 0 && toneValues[0] !== "Any" ? toneValues.join(", ") : "unspecified";
        let userNotes = (document.getElementById("worldLoreNotesEl") || {}).value || "";
        let existingWorldName = (document.getElementById("worldNameEl") || {}).value || "";
        let needsName = !existingWorldName.trim();

        let lengthVal = (document.getElementById("worldLoreLengthEl") || {}).value || "medium";
        root.settingValue = settingValue;
        root.toneStr = toneStr;
        root.userNotes = window.literal(userNotes);
        root.existingWorldName = window.literal(existingWorldName);
        root.needsName = needsName;
        root.worldLoreLengthVal = lengthVal;
        let instruction = root.prompts.characterPage.worldLore.instruction.evaluateItem;

        let lengthInstruction = getLengthInstruction(lengthVal);
        if (lengthInstruction) {
            instruction += "\n\n" + lengthInstruction;
        }

        worldLoreEl.value = "";
        worldLoreEl.placeholder = "Generating...";

        let typewriter = new TypewriterStreamer(worldLoreEl, { speed: 10 });
        window.sectionTypewriters = window.sectionTypewriters || {};
        if (window.sectionTypewriters["worldLore"]) {
            window.sectionTypewriters["worldLore"].destroy();
        }
        window.sectionTypewriters["worldLore"] = typewriter;

        let stream = ai({
            instruction,
            onChunk: (data) => {
                // Strip the WORLD_NAME line from the live typewriter display
                let displayText = data.fullTextSoFar.replace(/\nWORLD_NAME:.*$/i, "").trim();
                typewriter.appendTargetText(displayText);
            }
        });
        window.sectionStreams = window.sectionStreams || {};
        window.sectionStreams["worldLore"] = stream;

        let result;
        try {
            result = await stream;
        } catch (e) {
            console.warn("World lore generation failed:", e);
            typewriter.destroy();
            setSectionGenerating("worldLore", false);
            setSectionStatus("worldLore", "❌ Failed.");
            setGenerationStatus("");
            return false;
        }

        if (result.stopReason === "user") {
            typewriter.destroy();
            setSectionGenerating("worldLore", false);
            setSectionStatus("worldLore", "⛔ Stopped.");
            setGenerationStatus("");
            return false;
        }

        // Extract and strip the WORLD_NAME from the result
        let finalText = result.text.trim();
        if (needsName) {
            let nameMatch = finalText.match(/\nWORLD_NAME:\s*(.+)$/im);
            if (nameMatch) {
                let generatedName = nameMatch[1].trim().replace(/^\[|\]$/g, "");
                finalText = finalText.replace(/\nWORLD_NAME:.*$/im, "").trim();
                let nameEl = document.getElementById("worldNameEl");
                if (nameEl && !nameEl.value.trim()) {
                    window.syncWorldName(generatedName);
                }
            }
        }

        typewriter.appendTargetText(finalText);
        await typewriter.completionPromise;

        setSectionGenerating("worldLore", false);
        let worldNameForHistory = (document.getElementById("worldNameEl") || {}).value || "";
        window.syncWorldName(worldNameForHistory);
        window.syncWorldLore(finalText);
        setSectionStatus("worldLore", "");
        setGenerationStatus("");
        if (window.saveWorldState) window.saveWorldState();

        await generateWorldLoreImage(finalText);
        return true;
    };


    window.generateWorldLoreImage = async function (text) {
        if (!text) return;
        setSectionStatus("worldLore", "🎨 Generating world visualization...");
        setGenerationStatus("Generating world visualization...");

        root.text = text;
        let instruction = root.prompts.characterPage.worldLoreImage.instruction.evaluateItem;

        let res = await ai({ instruction });
        let visualKeyphrases = res.text.trim().replace(/^"|"$/g, "");

        let prompt = sanitizeImagePrompt(`landscape concept art, environment, cinematic lighting, ${visualKeyphrases}, high quality, detailed, masterpiece`);
        let img = image({
            prompt: prompt,
            resolution: "768x512",
        });

        let result = await img;
        if (result.dataUrl) {
            updateWorldLoreVisuals(result.dataUrl);
            window.worldState.bannerUrl = result.dataUrl;
            if (typeof window.updateWorldBannerUI === 'function') {
                window.updateWorldBannerUI(result.dataUrl);
            }
            if (window.saveWorldState) window.saveWorldState();
        }
        setSectionStatus("worldLore", "");
        setGenerationStatus("");
    };

    window.updateWorldLoreVisuals = async function (url) {
        if (!url) return;
        let virtualUrl = url;
        if (url.startsWith("data:") || url.startsWith("blob:")) {
            virtualUrl = "https://scdg-local-cache/characters/active/world-lore";
            await window.writeImageToCache(virtualUrl, url);
        }
        let resolved = await window.resolveCacheUrl(virtualUrl);
        let thumb = document.getElementById("worldLoreThumbEl");
        let container = document.getElementById("worldLoreImgContainer");
        if (thumb) {
            thumb.style.backgroundImage = `url(${resolved})`;
        }
        if (container) {
            container.style.display = "flex";
        }
        if (typeof worldLoreBgEl !== 'undefined') {
            worldLoreBgEl.style.backgroundImage = `url(${resolved})`;
        }
        localStorage.worldLoreImageUrl = virtualUrl;
    };

    window.toggleWorldLoreEdit = function () {
        let textarea = document.getElementById("worldLoreEl");
        let btn = document.getElementById("worldLoreEditBtnEl");
        if (!textarea || !btn) return;
        let isReadOnly = textarea.readOnly;
        textarea.readOnly = !isReadOnly;
        if (isReadOnly) {
            textarea.style.border = "1px solid var(--accent-color)";
            textarea.focus();
            btn.innerHTML = '<i class="bi bi-floppy"></i> save';
        } else {
            textarea.style.border = "1px solid var(--panel-border)";
            btn.innerHTML = '<i class="bi bi-pencil-square"></i> edit';
            window.syncWorldLore(textarea.value);
            if (window.saveWorldState) window.saveWorldState();
        }
    };

    window.clearWorldLore = function () {
        window.syncWorldName("");
        window.syncWorldLore("");
        window.worldState.bannerUrl = "";
        let container = document.getElementById("worldLoreImgContainer");
        if (container) { container.style.display = "none"; }
        if (typeof worldLoreBgEl !== 'undefined') { worldLoreBgEl.style.backgroundImage = "none"; }
        localStorage.removeItem("worldLoreImageUrl");
        if (typeof window.updateWorldBannerUI === 'function') window.updateWorldBannerUI("");
        setSectionStatus("worldLore", "");
        window.worldState.activeWorldId = null;
        if (window.saveWorldState) window.saveWorldState();
        if (typeof renderSidebarWorlds === 'function') renderSidebarWorlds();
    };

    window.copyWorldLoreText = function () {
        let text = worldLoreEl.value;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            let btn = document.getElementById("worldLoreCopyBtnEl");
            if (btn) {
                let orig = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check"></i> copied!';
                setTimeout(() => btn.innerHTML = orig, 2000);
            }
        });
    };

    // ─── DETAILS ─────────────────────────────────────────────────────
    window.saveDetails = function () {
        localStorage.detailName = detailNameEl.value;
        localStorage.detailAge = detailAgeEl.value;
        localStorage.detailGender = detailGenderEl.value;
        localStorage.detailOrientation = detailOrientationEl.value;
        localStorage.detailRace = detailRaceEl.value;
        localStorage.detailEthnicity = detailEthnicityEl.value;
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };
    window.loadDetails = function () {
        detailNameEl.value = localStorage.detailName || "";
        detailAgeEl.value = localStorage.detailAge || "";
        detailGenderEl.value = localStorage.detailGender || "";
        detailOrientationEl.value = localStorage.detailOrientation || "";
        detailRaceEl.value = localStorage.detailRace || "";
        detailEthnicityEl.value = localStorage.detailEthnicity || "";
    };
    window.getDetailsContext = function () {
        return {
            name: detailNameEl.value.trim(),
            age: detailAgeEl.value.trim(),
            gender: detailGenderEl.value.trim(),
            orientation: detailOrientationEl.value.trim(),
            species: detailRaceEl.value.trim(),
            ethnicity: detailEthnicityEl.value.trim(),
        };
    };
    window.applyGeneratedDetails = function (details) {
        if (!detailNameEl.value.trim() && details.name) { detailNameEl.value = sanitizeOutput(details.name); }
        if (!detailAgeEl.value.trim() && details.age) { detailAgeEl.value = sanitizeOutput(details.age); }
        if (!detailGenderEl.value.trim() && details.gender) { detailGenderEl.value = sanitizeOutput(details.gender); }
        if (!detailOrientationEl.value.trim() && details.orientation) { detailOrientationEl.value = sanitizeOutput(details.orientation); }
        if (!detailRaceEl.value.trim() && details.species) { detailRaceEl.value = sanitizeOutput(details.species); }
        if (!detailEthnicityEl.value.trim() && details.ethnicity) { detailEthnicityEl.value = sanitizeOutput(details.ethnicity); }
        saveDetails();
    };

    // ─── SHARED UTILITIES ─────────────────────────────────────────────
    window.getSectionText = function (section) {
        if (section === "lore") {
            return compileLoreFromUI();
        }
        let el = document.getElementById(section + "OutputEl");
        if (!el) return "";
        return el.innerText.trim();
    };

    window.parseLoreJSON = function(str) {
        if (!str) return null;
        let trimmed = str.trim();
        let jsonMatch = trimmed.match(/\{[\s\S]*\}/);
        let cleaned = jsonMatch ? jsonMatch[0] : trimmed.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
    };

    window.loadLoreToUI = function(loreData) {
        clearLoreFields();
        if (!loreData) return;
        
        let parsed = null;
        if (typeof loreData === 'string') {
            try {
                parsed = parseLoreJSON(loreData);
            } catch (e) {
                // Not valid JSON, treat as raw text
            }
        } else if (typeof loreData === 'object') {
            parsed = loreData;
        }
        
        if (parsed && typeof parsed === 'object') {
            for (let i = 1; i <= 5; i++) {
                let entry = parsed[String(i)] || parsed[i];
                if (entry) {
                    let keysVal = "";
                    if (Array.isArray(entry.key)) {
                        keysVal = entry.key.join("; ");
                    } else if (typeof entry.key === 'string') {
                        keysVal = entry.key;
                    }
                    let contentVal = entry.content || "";
                    
                    let keyEl = document.getElementById("loreKey" + i + "El");
                    let contentEl = document.getElementById("loreContent" + i + "El");
                    if (keyEl) keyEl.value = keysVal;
                    if (contentEl) contentEl.value = contentVal;

                    let rpKeyEl = document.getElementById("rpTab-loreKey" + i + "El");
                    let rpContentEl = document.getElementById("rpTab-loreContent" + i + "El");
                    if (rpKeyEl) rpKeyEl.value = keysVal;
                    if (rpContentEl) rpContentEl.value = contentVal;
                }
            }
        } else {
            let content1El = document.getElementById("loreContent1El");
            if (content1El) {
                content1El.value = String(loreData).trim();
            }
            let rpContent1El = document.getElementById("rpTab-loreContent1El");
            if (rpContent1El) {
                rpContent1El.value = String(loreData).trim();
            }
        }
        saveLoreToLocalStorage();
    };

    window.clearLoreFields = function() {
        for (let i = 1; i <= 5; i++) {
            let keyEl = document.getElementById("loreKey" + i + "El");
            let contentEl = document.getElementById("loreContent" + i + "El");
            if (keyEl) keyEl.value = "";
            if (contentEl) contentEl.value = "";

            let rpKeyEl = document.getElementById("rpTab-loreKey" + i + "El");
            let rpContentEl = document.getElementById("rpTab-loreContent" + i + "El");
            if (rpKeyEl) rpKeyEl.value = "";
            if (rpContentEl) rpContentEl.value = "";
        }
    };

    window.saveLoreToLocalStorage = function() {
        let jsonStr = compileLoreFromUI();
        if (jsonStr) {
            localStorage.loreText = jsonStr;
            if (window.characterSections) {
                window.characterSections.lore = jsonStr;
            }
        } else {
            localStorage.removeItem("loreText");
            if (window.characterSections) {
                delete window.characterSections.lore;
            }
        }
    };

    window.compileLoreFromUI = function() {
        let result = {};
        let hasAny = false;
        for (let i = 1; i <= 5; i++) {
            let keyVal = (document.getElementById("loreKey" + i + "El")?.value || "").trim();
            let contentVal = (document.getElementById("loreContent" + i + "El")?.value || "").trim();
            if (keyVal || contentVal) {
                hasAny = true;
                let keysArray = keyVal ? keyVal.split(";").map(k => k.trim()).filter(Boolean) : [];
                result[String(i)] = {
                    content: contentVal,
                    key: keysArray
                };
            }
        }
        if (!hasAny) return "";
        return JSON.stringify(result, null, 2);
    };

    window.exportLoreAsJson = function() {
        let jsonStr = compileLoreFromUI();
        if (!jsonStr) {
            jsonStr = "{}";
        }
        let charName = (document.getElementById("detailNameEl")?.value || "character").trim();
        let safeName = charName.toLowerCase().replace(/[^a-z0-9]/g, "_") || "character";
        let filename = safeName + "_lore.json";
        
        let blob = new Blob([jsonStr], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    window.setGenerationStatus = function (message) {
        let trimmed = (message || "").trim();
        if (!trimmed && window.generateAllRunning) {
            return; // Ignore intermediate status clears during generateAll
        }
        let el = document.getElementById("generationStatusEl");
        if (!el) return;
        
        if (!trimmed) {
            el.innerHTML = `<span style="opacity: 0.5; display: inline-flex; align-items: center; gap: 0.4rem;"><i class="bi bi-circle-fill" style="color: #64748b; font-size: 6px;"></i> Idle</span>`;
        } else {
            let iconHtml = `<i class="bi bi-arrow-repeat spin-icon" style="color: var(--accent-color); font-size: 110%;"></i>`;
            if (trimmed.includes("✨") || trimmed.includes("✅")) {
                iconHtml = `<i class="bi bi-check-circle-fill" style="color: #10b981;"></i>`;
            }
            
            let cleanMessage = trimmed.replace(/^[⏳🧠🎨✨✅\s]+/, '').trim();
            el.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.4rem; color: var(--text-main);">
                    ${iconHtml}
                    <span>${cleanMessage}</span>
                </div>
            `;
        }
    };

    window.checkStorageUsage = async function () {
        try {
            let metadataTotal = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    metadataTotal += (localStorage[key].length * 2);
                }
            }
            let metadataMB = (metadataTotal / 1024 / 1024).toFixed(2);
            
            let cacheTotalBytes = 0;
            if (window.caches) {
                const cache = await window.caches.open(CACHE_NAME);
                const keys = await cache.keys();
                for (let key of keys) {
                    const response = await cache.match(key);
                    if (response) {
                        const blob = await response.blob();
                        cacheTotalBytes += blob.size;
                    }
                }
            }
            let cacheMB = (cacheTotalBytes / 1024 / 1024).toFixed(2);
            
            let warningEl = document.getElementById("storageWarningEl");
            if (!warningEl) return;
            
            warningEl.style.display = "block";
            warningEl.style.background = "rgba(255,255,255,0.03)";
            warningEl.style.border = "1px solid var(--panel-border)";
            warningEl.style.color = "var(--text-muted)";
            warningEl.style.marginTop = "0.4rem";
            warningEl.innerHTML = `<i class="bi bi-hdd-fill"></i> Storage &middot; Metadata: <b>${metadataMB} MB</b> | Image Cache: <b>${cacheMB} MB</b>`;
        } catch (e) {
            console.error("Error checking storage usage:", e);
        }
    };
/* ==========================================================================
   AI PROMPT COMPILER AND CONTEXT BUILDERS
   ========================================================================== */
    // ⚠️ STRICT GLOBAL RULE: Apply to every AI prompt  -  dynamically build banned formatting rules
    window.getBannedFormattingRule = function () {
        let ruleParts = [];
        
        ruleParts.push("IMPORTANT: Always refer to the user as {{user}}. Do not write out the word 'user', always use the exact macro {{user}}.");
        
        let banEmDash = localStorage.getItem("banEmDash") !== "false"; // Default true
        let banBolding = localStorage.getItem("banBolding") === "true"; // Default false
        let customBanned = (localStorage.getItem("customBanned") || "").trim();
        
        if (banEmDash) {
            ruleParts.push("Do NOT use the em dash character (\u2014) or en dash character (\u2013) anywhere in your response. Replace them with a comma, semicolon, colon, or rewrite the sentence to avoid them entirely.");
        }
        
        if (banBolding) {
            ruleParts.push("Do NOT use markdown bolding (**) anywhere in your output. Do NOT bold headings or keywords. Use plain text only.");
        }
        
        if (customBanned) {
            let terms = customBanned.split(",").map(t => t.trim()).filter(t => t.length > 0);
            if (terms.length > 0) {
                ruleParts.push("Do NOT use any of the following words or characters: " + terms.map(t => `"${t}"`).join(", ") + ".");
            }
        }
        
        if (ruleParts.length === 0) return "";
        return "STRICT FORMATTING RULE: " + ruleParts.join(" ");
    };
    window.getLengthInstruction = function (lengthVal, type) {
        if (window.prompts && typeof window.prompts.getLengthInstruction === "function") {
            return window.prompts.getLengthInstruction(lengthVal, type);
        }
        if (!lengthVal || lengthVal === "custom") return "";
        let key = lengthVal.replace("-", "_");
        let spec = null;
        if (typeof root !== 'undefined' && root.lengthSpecifiers) {
            spec = root.lengthSpecifiers[key] || root.lengthSpecifiers[lengthVal];
        }
        let val = "";
        if (spec) {
            if (typeof spec === 'object' && spec && 'evaluateItem' in spec) {
                val = (typeof spec.evaluateItem === "function") ? spec.evaluateItem() : String(spec.evaluateItem);
            } else {
                val = String(spec);
            }
        }
        if (!val) {
            const fallbackMap = {
                "super_short": "Ultra concise. Target 1 sentence per field.",
                "super-short": "Ultra concise. Target 1 sentence per field.",
                "short": "Concise. Target 2 to 3 sentences per field.",
                "medium": "Standard detail. Target 4 to 5 sentences per field.",
                "long": "Detailed. Target 6 to 8 sentences per field.",
                "super_long": "Comprehensive. Target 9 to 12 sentences per field.",
                "super-long": "Comprehensive. Target 9 to 12 sentences per field."
            };
            val = fallbackMap[key] || fallbackMap[lengthVal] || "";
        }
        if (val) {
            return "IMPORTANT Length Constraint: " + val;
        }
        return "";
    };

    window.getSettingAndToneContext = function () {
        let setting = root.settingPrompts[settingEl.value] ? root.settingPrompts[settingEl.value].evaluateItem : "";
        let tones = getSelectedTones();
        let toneParts = tones
            .filter(t => t !== "Any" && root.tonePrompts[t])
            .map(t => root.tonePrompts[t].evaluateItem);
        
        let archetypes = typeof getSelectedArchetypes === "function" ? getSelectedArchetypes() : ["Any"];
        let archetypeParts = archetypes
            .filter(a => a !== "Any" && root.archetypePrompts && root.archetypePrompts[a])
            .map(a => root.archetypePrompts[a].evaluateItem);

        let dynamics = typeof getSelectedDynamics === "function" ? getSelectedDynamics() : ["Any"];
        let dynamicParts = dynamics
            .filter(d => d !== "Any" && root.dynamicPrompts && root.dynamicPrompts[d])
            .map(d => root.dynamicPrompts[d].evaluateItem);

        let themesEl = document.getElementById("wThemesEl") || document.getElementById("rpThemesEl");
        let themes = themesEl?.value || "";

        let parts = [];
        if (setting.trim()) parts.push("Setting: " + setting);
        if (toneParts.length > 0) parts.push("Tone: " + toneParts.join(" Additionally: "));
        if (themes.trim()) parts.push("Core Themes / Keywords: " + themes.trim());
        if (archetypeParts.length > 0) parts.push("Character Archetype/Traits: " + archetypeParts.join(" Also: "));
        if (dynamicParts.length > 0) parts.push("Relationship Dynamics: " + dynamicParts.join(" Also: "));
        
        if (parts.length === 0) return "";
        return "IMPORTANT SETTING, TONE, AND ARCHETYPE PARAMETERS  -  follow these closely:\n" + parts.join("\n");
    };

    window.getReferencedCharacters = function () {
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        return saved.filter(c => {
            let checkbox = document.getElementById(`ref-${c.id}`);
            return checkbox && checkbox.checked;
        });
    };

    window.trimCharacterForReference = function (c) {
        let sections = [];
        if (c.name) sections.push("Name: " + c.name);
        if (c.appearanceText) sections.push("Physical Appearance: " + c.appearanceText.slice(0, 300) + (c.appearanceText.length > 300 ? "..." : ""));
        if (c.backgroundText) sections.push("Background: " + c.backgroundText.slice(0, 300) + (c.backgroundText.length > 300 ? "..." : ""));
        return sections.join("\n");
    };

    window.getReferencedCharactersContext = function () {
        let refs = getReferencedCharacters();
        if (refs.length === 0) return "";
        let refText = refs.map(c => `--- Referenced Character ---\n${trimCharacterForReference(c)}\n---`).join("\n\n");
        return "IMPORTANT  -  EXISTING CHARACTERS FOR CONTEXT:\nThe following character(s) already exist in this world. Your new character MUST have a concrete, specific connection to at least one of them  -  something that should be reflected in the section you are writing. Do NOT be vague about this connection. Do NOT copy their traits.\n\n" + refText;
    };

    window.buildCharacterContext = function (excludeSection) {
        let d = getDetailsContext();
        let lines = [];
        let detailParts = [];
        if (d.name) detailParts.push("Name: " + d.name);
        if (d.age) detailParts.push("Age: " + d.age);
        if (d.gender) detailParts.push("Gender: " + d.gender);
        if (d.orientation) detailParts.push("Orientation: " + d.orientation);
        if (d.species) detailParts.push("Race/Species: " + d.species);
        if (d.ethnicity) detailParts.push("Ethnicity: " + d.ethnicity);
        if (detailParts.length > 0) lines.push(detailParts.join("\n"));

        let sections = ["shortDescription", "role", "personality", "beliefs", "preferences", "abilities", "relations", "appearance", "background", "timeline", "lore", "roleplay", "introScenario", "introStart"];
        for (let s of sections) {
            if (s === excludeSection) continue;
            let text = getSectionText(s);
            if (text) {
                let label = s === "shortDescription" ? "Short Description" 
                    : s === "abilities" ? "Abilities" 
                    : s === "relations" ? "Relations" 
                    : s === "timeline" ? "Timeline" 
                    : s === "appearance" ? "Physical Appearance" 
                    : s === "background" ? "Background" 
                    : s === "personality" ? "Personality" 
                    : s === "beliefs" ? "Beliefs & Morals" 
                    : s === "preferences" ? "Preferences" 
                    : s === "role" ? "Role" 
                    : s === "lore" ? "Lore" 
                    : s === "roleplay" ? "Roleplay Examples" 
                    : s === "introScenario" ? "Roleplay Intro - Scenario Context" 
                    : "Roleplay Intro - Dialogue & Narration";
                lines.push("### " + label + ":\n" + text);
            }
        }
        return lines.join("\n\n");
    };

    window.generateIdentityDetails = async function (sectionNotes, overviewOverride, worldLoreOverride, force) {
        if (force) {
            ["Name", "Age", "Gender", "Orientation", "Race", "Ethnicity"].forEach(f => {
                let el = document.getElementById("detail" + f + "El");
                if (el) el.value = "";
                localStorage.removeItem("detail" + f);
            });
            if (typeof clearAvatar === "function") clearAvatar();
        }
        let d = getDetailsContext();
        let allFilled = d.name && d.age && d.gender && d.orientation && d.species && d.ethnicity;
        
        let genBtn = document.getElementById("detailsGenBtnEl");
        let stopBtn = document.getElementById("detailsStopBtnEl");
        let statusEl = document.getElementById("detailsStatusEl");

        if (allFilled) {
            if (statusEl) {
                statusEl.textContent = "✓ All details already filled.";
                setTimeout(() => { if (statusEl.textContent === "✓ All details already filled.") statusEl.textContent = ""; }, 3000);
            }
            return true;
        }

        let blankFields = [];
        if (!d.name) blankFields.push("name");
        if (!d.age) blankFields.push("age (a number or short estimate)");
        if (!d.gender) blankFields.push("gender (one word or short phrase)");
        if (!d.orientation) blankFields.push("orientation (one word or short phrase)");
        if (!d.species) blankFields.push("species (one word or short phrase)");
        if (!d.ethnicity) blankFields.push("ethnicity (one word or short phrase)");

        let existingContext = buildCharacterContext(null);
        let settingAndTone = getSettingAndToneContext();
        let overviewNotes = overviewOverride !== undefined ? overviewOverride : (document.getElementById("overviewNotesEl") || {}).value || "";
        let worldLoreVal = worldLoreOverride !== undefined ? worldLoreOverride : (document.getElementById("worldLoreEl") || {}).value || "";
        let allUserNotes = [sectionNotes || "", overviewNotes].filter(Boolean).join("\n");
        root.existingContext = window.literal(existingContext);
        root.worldLoreVal = window.literal(worldLoreVal);
        root.allUserNotes = window.literal(allUserNotes);
        root.settingAndTone = settingAndTone;
        root.blankFields = blankFields.join(", ");
        let instruction = root.prompts.characterPage.identityDetails.instruction.evaluateItem;

        if (genBtn) genBtn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";
        if (statusEl) statusEl.textContent = "⏳ Generating identity details...";
        setGenerationStatus("Generating identity details...");

        window.detailsStream = ai({ instruction });
        
        try {
            let result = await window.detailsStream;
            if (result.stopReason === "user") {
                if (statusEl) statusEl.textContent = "⛔ Stopped.";
                return false;
            }
            let text = result.text || "";
            let jsonMatch = text.match(/\{[\s\S]*\}/);
            let cleaned = jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, "").trim();
            let json = JSON.parse(cleaned);
            applyGeneratedDetails(json);
            if (statusEl) statusEl.textContent = "";
            return true;
        } catch (e) {
            console.warn("Details extraction failed to parse JSON:", e);
            if (statusEl) statusEl.textContent = "❌ Generation failed.";
            return false;
        } finally {
            if (genBtn) genBtn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            setGenerationStatus("");
            window.detailsStream = null;
        }
    };

    window.stopDetailsGeneration = function () {
        if (window.detailsStream) {
            try { window.detailsStream.stop(); } catch(e){}
        }
        let genBtn = document.getElementById("detailsGenBtnEl");
        let stopBtn = document.getElementById("detailsStopBtnEl");
        let statusEl = document.getElementById("detailsStatusEl");
        if (genBtn) genBtn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
        if (statusEl) statusEl.textContent = "⛔ Stopped.";
        setGenerationStatus("");
    };

    window.regenerateSingleDetail = async function (field) {
        let el = document.getElementById("detail" + field + "El");
        if (el) {
            el.value = "";
            let lsKey = "detail" + field;
            localStorage.removeItem(lsKey);
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        }
        // Force is false here because we only want to generate the specific cleared field
        await generateIdentityDetails(null, undefined, undefined, false);
    };

    window.maybeGenerateDetails = window.generateIdentityDetails;

    /**
     * Sanitizes arguments before compiling the prompt template using Perchance prompts.
     */
    function literalCompile(key, context, notes, lengthVal, overview, worldLore) {
        return root.prompts.compile(
            key,
            window.literal(context),
            window.literal(notes),
            lengthVal,
            window.literal(overview),
            window.literal(worldLore)
        );
    }

    window.buildShortDescriptionPrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("shortDescription", context, notes, lengthVal, overview, worldLore);
    };

    window.buildAbilitiesPrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("abilities", context, notes, lengthVal, overview, worldLore);
    };

    window.buildRelationsPrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("relations", context, notes, lengthVal, overview, worldLore);
    };

    window.buildTimelinePrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("timeline", context, notes, lengthVal, overview, worldLore);
    };

    window.buildRolePrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("role", context, notes, lengthVal, overview, worldLore);
    };

    window.buildAppearancePrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("appearance", context, notes, lengthVal, overview, worldLore);
    };

    window.buildBackgroundPrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("background", context, notes, lengthVal, overview, worldLore);
    };

    window.buildPersonalityPrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("personality", context, notes, lengthVal, overview, worldLore);
    };

    window.buildBeliefsPrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("beliefs", context, notes, lengthVal, overview, worldLore);
    };

    window.buildPreferencesPrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("preferences", context, notes, lengthVal, overview, worldLore);
    };

    window.buildLorePrompt = function (context, notes, lengthVal, overview, worldLore) {
        return literalCompile("lore", context, notes, lengthVal, overview, worldLore);
    };

    window.splitOldIntroText = function (text) {
        if (!text) return { scenario: "", start: "" };
        
        let parts = text.split(/(?:Scene Context:|Scenario Context:|### Scene Context|### Scenario Context|Scene Context\s*:\s*|Scenario Context\s*:\s*)/i);
        let mainText = text;
        if (parts.length > 1) {
            mainText = parts[1];
        }
        
        let splitPattern = /(?:Intro Script:|Roleplay Intro Script:|Roleplay Intro:|Intro:|Start:|Dialogue & Narration:|### Intro Script|# Roleplay Intro Script|=== ROLEPLAY_STARTER_SEPARATOR ===)/i;
        let mainParts = mainText.split(splitPattern);
        
        let scenarioPart = "";
        let startPart = "";
        if (mainParts.length > 1) {
            scenarioPart = mainParts[0].trim();
            startPart = mainParts[1].trim();
        } else {
            startPart = text.trim();
        }
        
        scenarioPart = scenarioPart.replace(/^(?:Scene Context|Scenario Context|Context|Scenario)\s*:\s*/i, "").trim();
        startPart = startPart.replace(/^(?:Intro Script|Roleplay Intro Script|Intro|Start|Dialogue & Narration)\s*:\s*/i, "").trim();
        
        return {
            scenario: scenarioPart,
            start: startPart
        };
    };

    window.buildRoleplayExamplePrompt = function (context, notes, lengthVal, overview, worldLore) {
        let perspective = getSelectedPerspective();
        let perspectiveRule = perspective === "First_Person"
            ? "IMPORTANT NARRATION PERSPECTIVE: All narration and actions inside the roleplay examples must be written in the FIRST-PERSON perspective from the character's point of view (using 'I', 'me', 'my' for the character's actions and thoughts). Do NOT write narration in the third person."
            : "IMPORTANT NARRATION PERSPECTIVE: All narration must be written in the THIRD-PERSON perspective (using the character's name or 'he/she/they' for narration/actions).";

        let robustFormatRule = `FORMATTING RULES:
You MUST strictly follow this structured format for the roleplay examples:
START_OF_DIALOG
{{user}}: [user's dialogue here]
{{char}}: [character's dialogue here] *[actions, imperfections, context, etc. You can add imperfections between dialogues in italic or asterisks]*
{{user}}: [user's dialogue here]
{{char}}: [character's dialogue here] *[actions, imperfections, context, etc.]*
... up to 10 back to back interactions
END_OF_DIALOG
Note: Only add multiple characters if there are any. Write their dialogue in the same way.`;

        let extraNotes = "CRITICAL: The dialogue, inner thoughts, and narrative voice MUST strongly reflect the selected Tone. Heavily adapt the character's vocabulary, attitude, and speaking style to fit this tone.\n\n" + robustFormatRule + "\n\n" + perspectiveRule;
        let finalNotes = notes ? (notes + "\n\n" + extraNotes) : extraNotes;
        
        return root.prompts.compile(
            "roleplay",
            window.literal(context),
            window.literal(finalNotes),
            lengthVal,
            window.literal(overview),
            window.literal(worldLore)
        );
    };

    window.buildIntroScenarioPrompt = function (context, notes, lengthVal, overview, worldLore) {
        let perspective = getSelectedPerspective();
        
        let ignorePerspective = true;
        let ignorePerspectiveToggle = document.getElementById("ignorePerspectiveToggle");
        if (ignorePerspectiveToggle) {
            ignorePerspective = ignorePerspectiveToggle.checked;
        }
            
        let extraNotes = "CRITICAL: The narrative voice MUST strongly reflect the selected Tone.\n" +
            "IMPORTANT PERSPECTIVE RULE: When referring to the user in the narrative or actions, you MUST use second-person perspective ('you', 'your', 'yours'). Do not refer to the user as 'the user' or '{{user}}' in the narration; address them directly as 'you'.";
        
        if (!ignorePerspective) {
            let perspectiveRule = perspective === "First_Person"
                ? "PERSPECTIVE: Write the scenario context description from the character's first-person perspective, reflecting their thoughts and observations of the environment (using 'I', 'me', 'my')."
                : "PERSPECTIVE: Write the scenario context description from a third-person narrative perspective.";
            extraNotes += "\n" + perspectiveRule;
        }
        
        let finalNotes = notes ? (notes + "\n\n" + extraNotes) : extraNotes;
        return root.prompts.compile(
            "introScenario",
            window.literal(context),
            window.literal(finalNotes),
            lengthVal,
            window.literal(overview),
            window.literal(worldLore)
        );
    };

    window.buildIntroStartPrompt = function (context, notes, lengthVal, overview, worldLore) {
        let perspective = getSelectedPerspective();
        
        let perspectiveRule = perspective === "First_Person"
            ? "IMPORTANT NARRATION PERSPECTIVE: The narration and actions must be written in the FIRST-PERSON perspective from the character's point of view (using 'I', 'me', 'my' for the character's actions and thoughts). Do NOT write narration in the third person."
            : "IMPORTANT NARRATION PERSPECTIVE: The narration must be written in the THIRD-PERSON perspective (using the character's name or 'he/she/they' for narration/actions).";
            
        let scenarioContext = getSectionText("introScenario");
        let extraNotes = perspectiveRule + "\n" +
            "CRITICAL: The dialogue, inner thoughts, and narrative voice MUST strongly reflect the selected Tone. Heavily adapt the character's vocabulary, attitude, and speaking style to fit this tone.\n" +
            "IMPORTANT PERSPECTIVE RULE: When referring to the user in the narrative or actions, you MUST use second-person perspective ('you', 'your', 'yours'). Do not refer to the user as 'the user' or '{{user}}' in the narration; address them directly as 'you'.";
        
        if (scenarioContext) {
            extraNotes += "\nSCENARIO CONTEXT (The scene takes place in this context):\n---\n" + scenarioContext + "\n---";
        }
        
        let finalNotes = notes ? (notes + "\n\n" + extraNotes) : extraNotes;
        return root.prompts.compile(
            "introStart",
            window.literal(context),
            window.literal(finalNotes),
            lengthVal,
            window.literal(overview),
            window.literal(worldLore)
        );
    };
/* ==========================================================================
   MAIN AI GENERATION ENGINE
   ========================================================================== */
    window.generateSection = async function (section) {
        if (!window.sectionStreams) window.sectionStreams = {};
        if (window.sectionStreams[section]) window.sectionStreams[section].stop();

        setSectionGenerating(section, true);
        setSectionStatus(section, "⏳ Fleshing out character identity...");
        setGenerationStatus("Fleshing out character identity...");

        let isRp = document.getElementById("rpTab-" + section + "NotesEl") || (section === "introScenario" || section === "introStart" ? document.getElementById("rpTab-introNotesEl") : null);

        let notes = "";
        if (section === "introScenario" || section === "introStart") {
            notes = (document.getElementById(isRp ? "rpTab-introNotesEl" : "introNotesEl") || {}).value || "";
        } else {
            notes = (document.getElementById(isRp ? ("rpTab-" + section + "NotesEl") : (section + "NotesEl")) || {}).value || "";
        }
        let lengthVal = getEffectiveLengthForSection(section);
        let overview = (document.getElementById("rpThemesEl") || document.getElementById("wThemesEl") || document.getElementById("overviewNotesEl") || {}).value || "";
        let worldLore = (window.roleplayState && window.roleplayState.worldLore) || (document.getElementById("rpWorldOutputEl") || {}).innerText || (document.getElementById("worldLoreEl") || {}).value || "";
        let allSectionNotes = ["shortDescription", "role", "personality", "beliefs", "preferences", "abilities", "relations", "appearance", "background", "timeline"]
            .map(s => {
                let noteEl = document.getElementById(isRp ? ("rpTab-" + s + "NotesEl") : (s + "NotesEl"));
                return noteEl ? noteEl.value : "";
            })
            .filter(Boolean)
            .join("\n");

        let detailsSuccess = await maybeGenerateDetails(allSectionNotes, overview, worldLore);
        if (!detailsSuccess) {
            setSectionGenerating(section, false);
            setSectionStatus(section, "⛔ Stopped.");
            setGenerationStatus("");
            return false;
        }

        let context = buildCharacterContext(section);
        let instruction;
        if (section === "shortDescription") instruction = buildShortDescriptionPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "role") instruction = buildRolePrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "personality") instruction = buildPersonalityPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "beliefs") instruction = buildBeliefsPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "preferences") instruction = buildPreferencesPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "abilities") instruction = buildAbilitiesPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "relations") instruction = buildRelationsPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "appearance") instruction = buildAppearancePrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "background") instruction = buildBackgroundPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "timeline") instruction = buildTimelinePrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "lore") instruction = buildLorePrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "roleplay") instruction = buildRoleplayExamplePrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "introScenario") instruction = buildIntroScenarioPrompt(context, notes, lengthVal, overview, worldLore);
        if (section === "introStart") instruction = buildIntroStartPrompt(context, notes, lengthVal, overview, worldLore);

        let premiumLabel = {
            shortDescription: "Composing short description",
            appearance: "Designing physical appearance",
            role: "Weaving narrative role",
            personality: "Developing personality traits",
            beliefs: "Structuring beliefs & morals",
            preferences: "Defining character preferences",
            abilities: "Listing character abilities",
            relations: "Defining character relations",
            background: "Forging backstory & origins",
            timeline: "Establishing timeline milestones",
            lore: "Crafting world lore entries",
            roleplay: "Simulating roleplay examples",
            introScenario: "Structuring scenario context",
            introStart: "Composing roleplay start"
        }[section] || ("Generating " + section);
        setSectionStatus(section, "⏳ " + premiumLabel + "...");
        setGenerationStatus(premiumLabel + "...");

        let outputEl = document.getElementById(section + "OutputEl");
        outputEl.style.display = "block";
        outputEl.innerHTML = "";

        if (section === "lore") {
            clearLoreFields();
            let copyBtn = document.getElementById("loreCopyBtnEl");
            if (copyBtn) copyBtn.style.display = "none";
        }

        let typewriter = new TypewriterStreamer(outputEl, { speed: 12 });
        window.sectionTypewriters = window.sectionTypewriters || {};
        if (window.sectionTypewriters[section]) {
            window.sectionTypewriters[section].destroy();
        }
        window.sectionTypewriters[section] = typewriter;

        let stream = ai({
            instruction,
            onChunk: (data) => {
                typewriter.appendTargetText(data.fullTextSoFar);
            }
        });
        window.sectionStreams[section] = stream;

        let result;
        try {
            result = await stream;
        } catch (e) {
            console.warn("Generation failed for " + section + ":", e);
            typewriter.destroy();
            setSectionGenerating(section, false);
            setSectionStatus(section, "❌ Failed.");
            setGenerationStatus("");
            return false;
        }

        if (result.stopReason === "user") {
            typewriter.destroy();
            setSectionGenerating(section, false);
            setSectionStatus(section, "⛔ Stopped.");
            setGenerationStatus("");
            if (section === "lore") {
                try {
                    window.loadLoreToUI(outputEl.innerText);
                    outputEl.style.display = "none";
                    let copyBtn = document.getElementById("loreCopyBtnEl");
                    if (copyBtn) copyBtn.style.display = "inline-block";
                } catch (e) {
                    // Keep raw output visible
                }
            }
            return false;
        }

        typewriter.appendTargetText(result.text);
        await typewriter.completionPromise;

        setSectionGenerating(section, false);
        setSectionStatus(section, "");
        setGenerationStatus("");
        let sanitized = sanitizeOutput(result.text);

        if (section === "lore") {
            window.loadLoreToUI(sanitized);
            outputEl.style.display = "none";
            let copyBtn = document.getElementById("loreCopyBtnEl");
            if (copyBtn) copyBtn.style.display = "inline-block";
        } else {
            outputEl.innerHTML = formatSectionText(sanitized);
            let editBtn = document.getElementById(section + "EditBtnEl");
            if (editBtn) editBtn.style.display = "inline-block";
            let copyBtn = document.getElementById(section + "CopyBtnEl");
            if (copyBtn) copyBtn.style.display = "inline-block";
        }
        updateClearAllBtn();

        if (!window.characterSections) window.characterSections = {};
        window.characterSections[section] = (section === "lore") ? compileLoreFromUI() : sanitized;
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();

        let appearanceText = getSectionText("appearance");
        if (section === "appearance" && appearanceText) {
            await triggerImageGeneration(appearanceText);
        }

        pushGenerationHistory();
        return true;
    };

    window.generateIntro = async function () {
        let btn = document.getElementById("introGenBtnEl");
        let stopBtn = document.getElementById("introStopBtnEl");
        let rpTabBtn = document.getElementById("rpTab-introGenBtnEl");
        let rpTabStopBtn = document.getElementById("rpTab-introStopBtnEl");
        if (btn) btn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";
        if (rpTabBtn) rpTabBtn.disabled = true;
        if (rpTabStopBtn) rpTabStopBtn.style.display = "inline-block";
        window.generateIntroRunning = true;
        
        try {
            if (window.generateIntroRunning) {
                let success = await generateSection("introScenario");
                if (success && window.generateIntroRunning) {
                    let startSuccess = await generateSection("introStart");
                    if (startSuccess && window.generateIntroRunning) {
                        await generateRoleplayImages();
                    }
                }
            }
        } finally {
            window.generateIntroRunning = false;
            if (btn) btn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            if (rpTabBtn) rpTabBtn.disabled = false;
            if (rpTabStopBtn) rpTabStopBtn.style.display = "none";
        }
    };

    window.stopIntroGeneration = function () {
        window.generateIntroRunning = false;
        stopSection("introScenario");
        stopSection("introStart");
        let rpTabStopBtn = document.getElementById("rpTab-introStopBtnEl");
        if (rpTabStopBtn) rpTabStopBtn.style.display = "none";
    };

    window.clearIntro = function () {
        clearSection("introScenario");
        clearSection("introStart");
        let introNotesEl = document.getElementById("introNotesEl");
        if (introNotesEl) {
            introNotesEl.value = "";
            localStorage.removeItem("introNotes");
        }
        let rpIntroNotesEl = document.getElementById("rpTab-introNotesEl");
        if (rpIntroNotesEl) {
            rpIntroNotesEl.value = "";
        }
        if (typeof window.clearRoleplayImagesState === "function") {
            window.clearRoleplayImagesState();
        }
    };

    window.generateAll = async function (bypassOverviewCheck) {
        // Check overview notes  -  if empty, handle it first
        let overviewEl = document.getElementById("overviewNotesEl");
        if (!bypassOverviewCheck && overviewEl && !overviewEl.value.trim()) {
            if (localStorage.skipOverviewConfirm !== 'true') {
                // Show the approval modal
                showOverviewConfirmModal();
                return;
            }
        }

        let btn = document.getElementById("generateAllBtn");
        let stopBtn = document.getElementById("stopAllBtn");
        if (btn) btn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";
        window.generateAllRunning = true;

        try {
            // 1. Generate identity details if they are empty
            let d = getDetailsContext();
            let detailsAllFilled = d.name && d.age && d.gender && d.orientation && d.species && d.ethnicity;
            if (!detailsAllFilled) {
                let success = await generateIdentityDetails();
                if (!success) return;
            }

            if (!window.generateAllRunning) return;

            // 2. Generate overview notes if they are empty
            if (!overviewEl.value.trim()) {
                setGenerationStatus("Generating character overview...");
                let success = await generateOverviewNotes('textarea');
                if (!success) return;
            }

            if (!window.generateAllRunning) return;

            // 3. Generate world lore if empty
            if (!worldLoreEl.value.trim()) {
                let success = await generateWorldLore();
                if (!success) return;
            }

            // 4. Generate other sections sequentially
            for (let section of ["shortDescription", "appearance", "role", "personality", "beliefs", "preferences", "abilities", "relations", "background", "timeline", "lore", "roleplay", "introScenario", "introStart"]) {
                if (!window.generateAllRunning) break;
                let success = await generateSection(section);
                if (!success) break;
            }
        } catch (e) {
            console.error("Error during generateAll:", e);
        } finally {
            window.generateAllRunning = false;
            if (btn) btn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            setGenerationStatus("");
        }
    };

    window.stopAll = function () {
        window.generateAllRunning = false;
        
        // Stop Details and Overview
        stopDetailsGeneration();
        stopOverviewGeneration();
        
        // Stop World Lore
        if (window.sectionStreams && window.sectionStreams["worldLore"]) {
            try { window.sectionStreams["worldLore"].stop(); } catch(e){}
        }
        let wlTypewriter = window.sectionTypewriters && window.sectionTypewriters["worldLore"];
        if (wlTypewriter) wlTypewriter.destroy();
        setSectionGenerating("worldLore", false);
        setSectionStatus("worldLore", "⛔ Stopped.");

        // Stop sections
        ["shortDescription", "appearance", "role", "personality", "beliefs", "preferences", "abilities", "relations", "background", "timeline", "lore", "roleplay", "introScenario", "introStart"].forEach(s => stopSection(s));
        
        let btn = document.getElementById("generateAllBtn");
        let stopBtn = document.getElementById("stopAllBtn");
        if (btn) btn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
        setGenerationStatus("⛔ Stopped.");
    };

    window.stopSection = function (section) {
        let streamObj = window.sectionStreams && window.sectionStreams[section];
        if (streamObj) streamObj.stop();
        let typewriter = window.sectionTypewriters && window.sectionTypewriters[section];
        if (typewriter) typewriter.destroy();
    };

    // ─── GLOBAL LENGTH OVERRIDE ────────────────────────────────────────
    window.getEffectiveLengthForSection = function (section) {
        if (section === "shortDescription") return "custom";
        let globalVal = localStorage.globalLength || 'custom';
        if (globalVal && globalVal !== 'custom') return globalVal;
        let id = (section === "introScenario" || section === "introStart") ? "intro" : section;
        let selectEl = document.getElementById("rpTab-" + id + "LengthEl") || document.getElementById(id + "LengthEl");
        return selectEl?.value || "medium";
    };

    window.setGlobalLength = function (val, silent) {
        localStorage.globalLength = val;
        let el1 = document.getElementById("globalLengthEl");
        if (el1) {
            el1.value = val;
            window.syncCustomSelectLabel(el1);
        }
        let el2 = document.getElementById("rpGlobalLengthEl");
        if (el2) {
            el2.value = val;
            window.syncCustomSelectLabel(el2);
        }
        // Close dropdown
        let menu = document.getElementById("globalLengthDropdownMenu");
        if (menu && !silent) menu.style.display = "none";
        // Update per-section selects UI
        updateGlobalLengthUI(val);
    };

    window.removeWhiteBackground = function(canvas, tolerance = 240) {
        let ctx = canvas.getContext("2d");
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i], g = data[i+1], b = data[i+2];
            // If pixel is near-white, set alpha to 0
            if (r >= tolerance && g >= tolerance && b >= tolerance) {
                data[i+3] = 0;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        return canvas;
    };

    window.generateRoleplayImages = async function() {
        let container = document.getElementById("introImageContainer");
        if (container) container.style.display = "flex";
        let rpTabContainer = document.getElementById("rpTab-introImageContainer");
        // if (rpTabContainer) rpTabContainer.style.display = "flex";
        
        let d = getDetailsContext();
        let nameTag = document.getElementById("introImageNameTag");
        let rpTabNameTag = document.getElementById("rpTab-introImageNameTag");
        if (nameTag && d.name) {
            nameTag.textContent = d.name;
            nameTag.style.display = "block";
        } else if (nameTag) {
            nameTag.style.display = "none";
        }
        if (rpTabNameTag && d.name) {
            rpTabNameTag.textContent = d.name;
            rpTabNameTag.style.display = "block";
        } else if (rpTabNameTag) {
            rpTabNameTag.style.display = "none";
        }
        
        await Promise.all([
            generateRoleplayImageBg(),
            generateRoleplayImageChar()
        ]);
    };

    window.introBgGenRunning = false;
    window.introCharGenRunning = false;
    window.overwrittenIntroBgPrompt = localStorage.overwrittenIntroBgPrompt || "";
    window.overwrittenIntroCharPrompt = localStorage.overwrittenIntroCharPrompt || "";

    window.clearRoleplayImagesState = function() {
        window.overwrittenIntroBgPrompt = "";
        window.overwrittenIntroCharPrompt = "";
        localStorage.removeItem("overwrittenIntroBgPrompt");
        localStorage.removeItem("overwrittenIntroCharPrompt");
        localStorage.removeItem("introBgImageUrl");
        localStorage.removeItem("introCharImageUrl");
        
        let introBgPromptEl = document.getElementById("introBgPromptEl");
        let rpTabIntroBgPromptEl = document.getElementById("rpTab-introBgPromptEl");
        let introCharPromptEl = document.getElementById("introCharPromptEl");
        let rpTabIntroCharPromptEl = document.getElementById("rpTab-introCharPromptEl");
        if (introBgPromptEl) introBgPromptEl.value = "";
        if (rpTabIntroBgPromptEl) rpTabIntroBgPromptEl.value = "";
        if (introCharPromptEl) introCharPromptEl.value = "";
        if (rpTabIntroCharPromptEl) rpTabIntroCharPromptEl.value = "";
        
        let introBg = document.getElementById("introImageBg");
        if (introBg) introBg.style.backgroundImage = "";
        let rpTabIntroBg = document.getElementById("rpTab-introImageBg");
        if (rpTabIntroBg) rpTabIntroBg.style.backgroundImage = "";
        
        let introCanvas = document.getElementById("introImageCharCanvas");
        if (introCanvas) {
            let ctx = introCanvas.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, introCanvas.width, introCanvas.height);
        }
        let rpTabIntroCanvas = document.getElementById("rpTab-introImageCharCanvas");
        if (rpTabIntroCanvas) {
            let ctx = rpTabIntroCanvas.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, rpTabIntroCanvas.width, rpTabIntroCanvas.height);
        }
        
        let nameTag = document.getElementById("introImageNameTag");
        if (nameTag) nameTag.style.display = "none";
        let rpTabNameTag = document.getElementById("rpTab-introImageNameTag");
        if (rpTabNameTag) rpTabNameTag.style.display = "none";
        
        let placeholder = document.getElementById("introImagePlaceholder");
        if (placeholder) placeholder.style.display = "flex";
        let rpTabPlaceholder = document.getElementById("rpTab-introImagePlaceholder");
        if (rpTabPlaceholder) rpTabPlaceholder.style.display = "flex";
    };

    window.clearAppearanceImages = function() {
        window.overwrittenVisualKeyphrasesText = "";
        window.overwrittenStylePrompt = "";
        localStorage.removeItem("overwrittenVisualKeyphrasesText");
        localStorage.removeItem("overwrittenStylePrompt");
        localStorage.removeItem("activeImages");
        
        let styleOverrideEl = document.getElementById("styleOverrideEl");
        if (styleOverrideEl) styleOverrideEl.value = "";
        
        let promptEl = document.getElementById("appearancePromptTextarea");
        if (promptEl) promptEl.value = "";
        
        let imagesEl = document.getElementById("imagesEl");
        if (imagesEl) {
            imagesEl.innerHTML = `
                <div class="image-empty-placeholder" style="padding:2rem; text-align:center; opacity:0.5; font-size:85%; width:100%; box-sizing:border-box; border:1px dashed var(--panel-border); border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.4rem;">
                    <i class="bi bi-images" style="font-size:2rem; color:var(--accent-color);"></i>
                    <span>No character images generated yet. Use the controls above to generate portrait images.</span>
                </div>
            `;
        }
        updateStyleOverridePlaceholder();
    };
/* ==========================================================================
   ROLEPLAY PREVIEW STAGE (IMAGE/SCENE GENERATOR)
   ========================================================================== */
    window.generateRoleplayImageBg = async function() {
        let statusEl = document.getElementById("introImageStatus");
        let rpTabStatusEl = document.getElementById("rpTab-introImageStatus");
        let bgEl = document.getElementById("introImageBg");
        let rpTabBgEl = document.getElementById("rpTab-introImageBg");
        let promptEl = document.getElementById("introBgPromptEl");
        let btn = document.getElementById("introImageBgGenBtn");
        let rpTabBtn = document.getElementById("rpTab-introImageBgGenBtn");
        let stopBtn = document.getElementById("introImageBgStopBtn");
        let rpTabStopBtn = document.getElementById("rpTab-introImageBgStopBtn");
        
        if (btn) btn.style.display = "none";
        if (rpTabBtn) rpTabBtn.style.display = "none";
        if (stopBtn) stopBtn.style.display = "inline-flex";
        if (rpTabStopBtn) rpTabStopBtn.style.display = "inline-flex";
        
        let statusMessage = `<i class="bi bi-arrow-repeat spin-icon" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 0.5rem;"></i><div>Generating Background...</div>`;
        if (statusEl) {
            statusEl.style.display = "flex";
            statusEl.innerHTML = statusMessage;
        }
        if (rpTabStatusEl) {
            rpTabStatusEl.style.display = "flex";
            rpTabStatusEl.innerHTML = statusMessage;
        }
        
        window.introBgGenRunning = true;
        
        try {
            let prompt = promptEl ? promptEl.value.trim() : "";
            
            if (!prompt) {
                let scenario = getSectionText("introScenario") || "A scenic background";
                let artstyle = "semi-realistic manhwa style, painterly rendering, soft shading, Anime cel shading, artstation quality, gorgeous, refined aesthetics, sharp, clean linework, beautiful scenery, highly detailed environment";
                let bgDescription = scenario;
                
                if (scenario && scenario.length > 15 && typeof window.ai !== "undefined") {
                    try {
                        let analyzeMsg = `<i class="bi bi-arrow-repeat spin-icon" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 0.5rem;"></i><div>Analyzing Scene...</div>`;
                        if (statusEl) statusEl.innerHTML = analyzeMsg;
                        if (rpTabStatusEl) rpTabStatusEl.innerHTML = analyzeMsg;
                        root.scenario = scenario;
                        let extractPrompt = root.prompts.characterPage.backgroundImage.instruction.evaluateItem;
                        let aiResult = await window.ai(extractPrompt);
                        if (!window.introBgGenRunning) return;
                        if (aiResult && aiResult.generatedText) {
                            bgDescription = aiResult.generatedText.trim();
                        } else if (aiResult) {
                            bgDescription = aiResult.toString().trim();
                        }
                    } catch(e) {
                        console.error("AI scene extraction error:", e);
                    }
                }
                
                prompt = sanitizeImagePrompt(`Scenery only, empty background, no characters, empty environment. ${bgDescription}. Artstyle: ${artstyle}.`);
                if (promptEl) promptEl.value = prompt;
                let rpTabPromptEl = document.getElementById("rpTab-introBgPromptEl");
                if (rpTabPromptEl) rpTabPromptEl.value = prompt;
                window.overwrittenIntroBgPrompt = prompt;
            }
            
            if (!window.introBgGenRunning) return;
            let genMsg = `<i class="bi bi-arrow-repeat spin-icon" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 0.5rem;"></i><div>Generating Background Image...</div>`;
            if (statusEl) statusEl.innerHTML = genMsg;
            if (rpTabStatusEl) rpTabStatusEl.innerHTML = genMsg;
            
            let result = await image({
                prompt: prompt,
                negativePrompt: "photorealistic, characters, people, person, human, face, flat lighting, overexposed",
                resolution: "768x512"
            });
            
            if (!window.introBgGenRunning) return;
            
            if (result && result.dataUrl) {
                let virtualUrl = "https://scdg-local-cache/characters/active/intro-bg";
                await window.writeImageToCache(virtualUrl, result.dataUrl);
                let resolved = await window.resolveCacheUrl(virtualUrl);
                if (bgEl) bgEl.style.backgroundImage = `url(${resolved})`;
                if (rpTabBgEl) rpTabBgEl.style.backgroundImage = `url(${resolved})`;
                localStorage.introBgImageUrl = virtualUrl;
                
                let placeholder = document.getElementById("introImagePlaceholder");
                if (placeholder) placeholder.style.display = "none";
                let rpTabPlaceholder = document.getElementById("rpTab-introImagePlaceholder");
                if (rpTabPlaceholder) rpTabPlaceholder.style.display = "none";
            }
        } catch (e) {
            console.error("Error generating bg image:", e);
        } finally {
            window.introBgGenRunning = false;
            if (btn) btn.style.display = "inline-flex";
            if (rpTabBtn) rpTabBtn.style.display = "inline-flex";
            if (stopBtn) stopBtn.style.display = "none";
            if (rpTabStopBtn) rpTabStopBtn.style.display = "none";
            if (!window.introBgGenRunning && !window.introCharGenRunning) {
                if (statusEl) statusEl.style.display = "none";
                if (rpTabStatusEl) rpTabStatusEl.style.display = "none";
            }
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        }
    };

    window.stopRoleplayImageBgGen = function() {
        window.introBgGenRunning = false;
        let btn = document.getElementById("introImageBgGenBtn");
        let rpTabBtn = document.getElementById("rpTab-introImageBgGenBtn");
        let stopBtn = document.getElementById("introImageBgStopBtn");
        let rpTabStopBtn = document.getElementById("rpTab-introImageBgStopBtn");
        let statusEl = document.getElementById("introImageStatus");
        let rpTabStatusEl = document.getElementById("rpTab-introImageStatus");
        
        if (btn) btn.style.display = "inline-flex";
        if (rpTabBtn) rpTabBtn.style.display = "inline-flex";
        if (stopBtn) stopBtn.style.display = "none";
        if (rpTabStopBtn) rpTabStopBtn.style.display = "none";
        if (!window.introBgGenRunning && !window.introCharGenRunning) {
            if (statusEl) statusEl.style.display = "none";
            if (rpTabStatusEl) rpTabStatusEl.style.display = "none";
        }
    };

    window.generateRoleplayImageChar = async function() {
        let statusEl = document.getElementById("introImageStatus");
        let rpTabStatusEl = document.getElementById("rpTab-introImageStatus");
        let charCanvas = document.getElementById("introImageCharCanvas");
        let rpTabCharCanvas = document.getElementById("rpTab-introImageCharCanvas");
        let promptEl = document.getElementById("introCharPromptEl");
        let btn = document.getElementById("introImageCharGenBtn");
        let rpTabBtn = document.getElementById("rpTab-introImageCharGenBtn");
        let stopBtn = document.getElementById("introImageCharStopBtn");
        let rpTabStopBtn = document.getElementById("rpTab-introImageCharStopBtn");
        
        if (btn) btn.style.display = "none";
        if (rpTabBtn) rpTabBtn.style.display = "none";
        if (stopBtn) stopBtn.style.display = "inline-flex";
        if (rpTabStopBtn) rpTabStopBtn.style.display = "inline-flex";
        
        let statusMessage = `<i class="bi bi-arrow-repeat spin-icon" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 0.5rem;"></i><div>Generating Character Sprite...</div>`;
        if (statusEl) {
            statusEl.style.display = "flex";
            statusEl.innerHTML = statusMessage;
        }
        if (rpTabStatusEl) {
            rpTabStatusEl.style.display = "flex";
            rpTabStatusEl.innerHTML = statusMessage;
        }
        
        window.introCharGenRunning = true;
        
        try {
            let prompt = promptEl ? promptEl.value.trim() : "";
            
            if (!prompt) {
                let appearanceText = getSectionText("appearance") || "";
                let attireText = getSectionText("attire") || "";
                let itemsText = getSectionText("items") || "";
                let artstyle = "mature Korean-style Manhwa Art style, semi-realistic manhwa style, mature/sexy style, Noona-type character design, painterly rendering, soft shading, Anime cel shading, artstation quality, gorgeous, delicate facial features, refined aesthetics, sharp, clean linework";
                
                prompt = sanitizeImagePrompt(`Create an upper-body sprite image, pure solid white background. 1:1 ratio. Semi-realistic face, cel-shaded. Appearance: ${appearanceText}. Attire: ${attireText}. Items: ${itemsText}. Artstyle: ${artstyle}. composition: upper-body portrait, centered composition, waist-up framing, slight head tilt, looking at the camera, upper body from the waist up; ignore details below the waist for character appearance data.`);
                if (promptEl) promptEl.value = prompt;
                let rpTabPromptEl = document.getElementById("rpTab-introCharPromptEl");
                if (rpTabPromptEl) rpTabPromptEl.value = prompt;
                window.overwrittenIntroCharPrompt = prompt;
            }
            
            if (!window.introCharGenRunning) return;
            let genMsg = `<i class="bi bi-arrow-repeat spin-icon" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 0.5rem;"></i><div>Generating Character Sprite Image...</div>`;
            if (statusEl) statusEl.innerHTML = genMsg;
            if (rpTabStatusEl) rpTabStatusEl.innerHTML = genMsg;
            
            let result = await image({
                prompt: prompt,
                negativePrompt: "photorealistic, flat lighting, overexposed, symmetrical face, expressionless, text, watermark",
                resolution: "512x512"
            });
            
            if (!window.introCharGenRunning) return;
            
            if (result && result.canvas) {
                let canvases = [charCanvas, rpTabCharCanvas].filter(Boolean);
                canvases.forEach(c => {
                    c.width = result.canvas.width;
                    c.height = result.canvas.height;
                    let ctx = c.getContext("2d");
                    ctx.drawImage(result.canvas, 0, 0);
                    removeWhiteBackground(c, 240);
                });
                
                let activeCanvas = charCanvas || rpTabCharCanvas;
                let dataUrl = activeCanvas.toDataURL("image/png");
                let virtualUrl = "https://scdg-local-cache/characters/active/intro-char";
                await window.writeImageToCache(virtualUrl, dataUrl);
                localStorage.introCharImageUrl = virtualUrl;
                
                let placeholder = document.getElementById("introImagePlaceholder");
                if (placeholder) placeholder.style.display = "none";
                let rpTabPlaceholder = document.getElementById("rpTab-introImagePlaceholder");
                if (rpTabPlaceholder) rpTabPlaceholder.style.display = "none";
            }
        } catch (e) {
            console.error("Error generating char image:", e);
        } finally {
            window.introCharGenRunning = false;
            if (btn) btn.style.display = "inline-flex";
            if (rpTabBtn) rpTabBtn.style.display = "inline-flex";
            if (stopBtn) stopBtn.style.display = "none";
            if (rpTabStopBtn) rpTabStopBtn.style.display = "none";
            if (!window.introBgGenRunning && !window.introCharGenRunning) {
                if (statusEl) statusEl.style.display = "none";
                if (rpTabStatusEl) rpTabStatusEl.style.display = "none";
            }
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        }
    };

    window.stopRoleplayImageCharGen = function() {
        window.introCharGenRunning = false;
        let btn = document.getElementById("introImageCharGenBtn");
        let rpTabBtn = document.getElementById("rpTab-introImageCharGenBtn");
        let stopBtn = document.getElementById("introImageCharStopBtn");
        let rpTabStopBtn = document.getElementById("rpTab-introImageCharStopBtn");
        let statusEl = document.getElementById("introImageStatus");
        let rpTabStatusEl = document.getElementById("rpTab-introImageStatus");
        if (btn) btn.style.display = "inline-flex";
        if (rpTabBtn) rpTabBtn.style.display = "inline-flex";
        if (stopBtn) stopBtn.style.display = "none";
        if (rpTabStopBtn) rpTabStopBtn.style.display = "none";
        if (!window.introBgGenRunning && !window.introCharGenRunning) {
            if (statusEl) statusEl.style.display = "none";
            if (rpTabStatusEl) rpTabStatusEl.style.display = "none";
        }
    };

    window.updateGlobalLengthUI = function (val) {
        let isCustom = !val || val === 'custom';
        let selects = document.querySelectorAll("select[id$='LengthEl']:not(#globalLengthEl):not(#rpGlobalLengthEl):not(#rpTab-globalLengthEl)");
        selects.forEach(sel => {
            let wrapper = document.getElementById("custom-select-" + sel.id);
            let target = wrapper || sel;
            if (isCustom) {
                target.style.opacity = "1";
                target.style.pointerEvents = "auto";
                target.title = "";
            } else {
                target.style.opacity = "0.35";
                target.style.pointerEvents = "none";
                target.title = "Overridden by Global Length: " + val;
            }
        });
    };

    // ─── OVERVIEW NOTES GENERATION ─────────────────────────────────────
    window.generateOverviewNotes = async function (target) {
        // target: 'textarea' (direct write) or 'modal' (write to modal display div)
        let settingValue = settingEl ? settingEl.value : "";
        let toneValues = getSelectedTones();
        let toneStr = toneValues.length > 0 && toneValues[0] !== "Any" ? toneValues.join(", ") : "any";
        let worldLoreVal = (document.getElementById("worldLoreEl") || {}).value || "";

        let d = getDetailsContext();
        let allFilled = d.name && d.age && d.gender && d.orientation && d.species && d.ethnicity;

        let genBtn = document.getElementById("overviewGenBtnEl");
        let stopBtn = document.getElementById("overviewStopBtnEl");
        let statusEl = (target === 'textarea') 
            ? document.getElementById("overviewStatusEl")
            : document.getElementById("overviewModalStatusEl");
        let textarea = document.getElementById("overviewNotesEl");
        let contentEl = document.getElementById("overviewModalContentEl");

        if (target === 'textarea') {
            if (genBtn) genBtn.disabled = true;
            if (stopBtn) stopBtn.style.display = "inline-block";
            if (textarea) textarea.value = "";
        } else if (target === 'modal') {
            let regenBtn = document.getElementById("overviewModalRegenBtn");
            let approveBtn = document.getElementById("overviewModalApproveBtn");
            if (contentEl) contentEl.textContent = "";
            if (regenBtn) regenBtn.disabled = true;
            if (approveBtn) approveBtn.disabled = true;
        }

        let streamName = (target === 'textarea') ? "overviewStream" : "overviewModalStream";

        // Helper to cleanup UI state after generation or stop
        function cleanupOverviewUI() {
            if (target === 'textarea') {
                if (genBtn) genBtn.disabled = false;
                if (stopBtn) stopBtn.style.display = "none";
            } else if (target === 'modal') {
                let regenBtn = document.getElementById("overviewModalRegenBtn");
                let approveBtn = document.getElementById("overviewModalApproveBtn");
                if (regenBtn) regenBtn.disabled = false;
                if (approveBtn) approveBtn.disabled = false;
            }
            if (statusEl) statusEl.textContent = "";
            setGenerationStatus("");
        }

        if (!allFilled) {
            let success = await generateIdentityDetails();
            if (!success) {
                cleanupOverviewUI();
                return false;
            }
        }

        // Re-read details after generating them (or if they were already pre-filled)
        d = getDetailsContext();
        let detailsParts = [];
        if (d.name) detailsParts.push(`Name: ${d.name}`);
        if (d.age) detailsParts.push(`Age: ${d.age}`);
        if (d.gender) detailsParts.push(`Gender: ${d.gender}`);
        if (d.orientation) detailsParts.push(`Orientation: ${d.orientation}`);
        if (d.species) detailsParts.push(`Species/Race: ${d.species}`);
        if (d.ethnicity) detailsParts.push(`Ethnicity: ${d.ethnicity}`);
        let detailsStr = `Character Details (you MUST strictly base the concept on these fields):\n${detailsParts.join("\n")}`;

        root.settingValue = settingValue;
        root.toneStr = toneStr;
        root.worldLoreVal = worldLoreVal;
        root.detailsStr = detailsStr;
        let instruction = root.prompts.characterPage.overview.instruction.evaluateItem;

        if (statusEl) {
            statusEl.textContent = (target === 'textarea') 
                ? "⏳ Generating character overview notes..." 
                : "⏳ Generating character overview...";
        }
        setGenerationStatus("Generating character overview...");

        window[streamName] = ai({
            instruction,
            onChunk: (data) => {
                if (target === 'textarea' && textarea) {
                    textarea.value = sanitizeOutput(data.fullTextSoFar);
                    localStorage.overviewNotes = textarea.value;
                } else if (target === 'modal' && contentEl) {
                    contentEl.textContent = sanitizeOutput(data.fullTextSoFar);
                }
            }
        });

        try {
            let result = await window[streamName];
            if (result.stopReason === "user") {
                cleanupOverviewUI();
                return false;
            }
            let finalText = sanitizeOutput(result.text);
            if (target === 'textarea' && textarea) {
                textarea.value = finalText;
                localStorage.overviewNotes = textarea.value;
            } else if (target === 'modal' && contentEl) {
                contentEl.textContent = finalText;
            }
            cleanupOverviewUI();
            return true;
        } catch (e) {
            console.warn("Overview generation stopped:", e);
            cleanupOverviewUI();
            return false;
        }
    };

    window.stopOverviewGeneration = function () {
        if (window.detailsStream) { try { window.detailsStream.stop(); } catch(e){} }
        if (window.overviewStream) { try { window.overviewStream.stop(); } catch(e){} }
        let genBtn = document.getElementById("overviewGenBtnEl");
        let stopBtn = document.getElementById("overviewStopBtnEl");
        let statusEl = document.getElementById("overviewStatusEl");
        if (genBtn) genBtn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
        if (statusEl) statusEl.textContent = "";
        setGenerationStatus("");
    };

    // ─── OVERVIEW CONFIRM MODAL ─────────────────────────────────────────
    window.showOverviewConfirmModal = function () {
        let modal = document.getElementById("overviewConfirmModalEl");
        if (!modal) return;
        modal.style.display = "flex";
        // Sync the dont-show checkbox
        let dontShow = document.getElementById("overviewModalDontShowEl");
        if (dontShow) dontShow.checked = localStorage.skipOverviewConfirm === 'true';
        // Start generating in modal
        generateOverviewNotes('modal');
    };

    window.closeOverviewConfirmModal = function () {
        let modal = document.getElementById("overviewConfirmModalEl");
        if (modal) modal.style.display = "none";
        if (window.detailsStream) { try { window.detailsStream.stop(); } catch(e){} }
        if (window.overviewModalStream) { try { window.overviewModalStream.stop(); } catch(e){} }
    };

    window.regenOverviewModal = function () {
        if (window.overviewModalStream) { try { window.overviewModalStream.stop(); } catch(e){} }
        generateOverviewNotes('modal');
    };

    window.approveOverviewAndGenerateAll = function () {
        let contentEl = document.getElementById("overviewModalContentEl");
        let textarea = document.getElementById("overviewNotesEl");
        if (contentEl && textarea) {
            let text = contentEl.textContent.trim();
            if (text) {
                textarea.value = text;
                localStorage.overviewNotes = text;
            }
        }
        closeOverviewConfirmModal();
        generateAll(true); // bypass the overview check
    };

    // ─── IMAGE GENERATION ─────────────────────────────────────────────
    window.getCaptionPromptInstruction = function (appearanceText, settingValue, toneValues) {
        let toneStr = toneValues.length > 0 && toneValues[0] !== "Any" ? toneValues.join(", ") : "unspecified";
        root.settingValue = settingValue;
        root.toneStr = toneStr;
        root.appearanceText = appearanceText;
        return root.prompts.characterPage.imageCaption.instruction.evaluateItem;
    };

    window.buildNegativePrompt = function () {
        let tones = getSelectedTones();
        let settingValue = settingEl.value;
        let negatives = ["worst quality, low quality, blurry, jpeg artifacts, watermark, signature, text, logo, cropped, out of frame, duplicate, deformed, disfigured, bad anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, ugly, poorly drawn face, cloned face, gross proportions"];
        
        if (tones.includes("Dark_Gritty") || tones.includes("Horror")) {
            negatives.push("bright colors, cheerful, cute, cartoon, anime, soft lighting, pastel");
        }
        if (tones.includes("Light_hearted_Comedic") || tones.includes("Whimsical")) {
            negatives.push("dark, gritty, grimdark, horror, violence, disturbing");
        }
        if (tones.includes("Erotic")) {
            negatives.push("childlike, cartoon, cute, non-suggestive");
        }
        if (tones.includes("Epic")) {
            negatives.push("mundane, casual, low stakes, soft lighting, flat composition");
        }
        if (tones.includes("Mysterious")) {
            negatives.push("bright, cheerful, overexposed, flat lighting");
        }
        if (settingValue === "Sci_Fi" || settingValue === "Cyberpunk") {
            negatives.push("medieval, fantasy, nature, organic, rustic");
        }
        if (settingValue === "Real_World_Modern" || settingValue === "Historical") {
            negatives.push("fantasy, magic, unrealistic, anime");
        }
        
        let allTags = negatives.join(", ").split(",").map(t => t.trim()).filter(Boolean);
        return [...new Set(allTags)].join(", ");
    };

    window.generateVisualStyleOptionsHtml = function () {
        function styleScore(style) {
            let fantasy = style["meta:tags"]?.fantasyPortrait || 0;
            let anime = style["meta:tags"]?.basicAnime || 0;
            let anthro = style["meta:tags"]?.furryOil || 0;
            let digital = style["meta:tags"]?.digitalPainting || 0;
            let cinematic = style["meta:tags"]?.cinematic || 0;
            return anime * 1.0 + cinematic * 0.9 + anthro * 0.8 + fantasy * 0.7 + digital * 0.7;
        }
        return root.visualStyles.selectAll.sort((a, b) => styleScore(b) - styleScore(a)).map(s => `<option>${s.getName}</option>`).join("");
    };

    window.addStyleToPrompt = function (prompt) {
        let styleName = (typeof visualStyleEl !== 'undefined' && visualStyleEl) ? visualStyleEl.value : "";
        if (!root.visualStyles || !styleName || !root.visualStyles[styleName]) {
            return prompt;
        }
        let originalWindowInput = window.input;
        window.input = { description: prompt };
        let result = root.visualStyles[styleName].prompt.evaluateItem;
        window.input = originalWindowInput;
        return result;
    };

    window.addStyleToNegative = function (negative) {
        let styleName = (typeof visualStyleEl !== 'undefined' && visualStyleEl) ? visualStyleEl.value : "";
        if (!root.visualStyles || !styleName || !root.visualStyles[styleName]) {
            return negative;
        }
        let originalWindowInput = window.input;
        window.input = { negative };
        let result = root.visualStyles[styleName].negative.evaluateItem;
        window.input = originalWindowInput;
        return result;
    };

    window.pickBestVisualStyle = function () {
        let setting = settingEl.value;
        let tones = getSelectedTones();
        let weights = {
            photo: 0, casualPhoto: 0, render: 0,
            painting: 0, oilPainting: 0, digitalPainting: 0, paintedAnime: 0,
            anime: 0, basicAnime: 0, drawnAnime: 0, cuteAnime: 0, ghibli: 0, manga: 0, waifu: 0,
            illustration: 0, drawing: 0, sketch: 0, cartoon: 0, basicCartoon: 0, comic: 0,
            fantasy: 0, fantasyPortrait: 0, furry: 0, furryOil: 0,
            vintage: 0, pixelArt: 0, japanese: 0, disney: 0,
        };
        let toneBoosts = {
            "Grounded": { photo: 60, casualPhoto: 40, oilPainting: 20 },
            "Thrilling_Action": { photo: 40, digitalPainting: 30, render: 40, painting: 20 },
            "Dark_Gritty": { oilPainting: 50, painting: 30, manga: 30, sketch: 20, vintage: 20 },
            "Light_hearted_Comedic": { basicAnime: 50, anime: 40, cartoon: 60, basicCartoon: 70, illustration: 40, ghibli: 30 },
            "Mysterious": { oilPainting: 40, painting: 30, vintage: 30, sketch: 20 },
            "Romantic": { painting: 40, paintedAnime: 40, illustration: 30 },
            "Erotic": { photo: 50, waifu: 40 },
            "Tragic": { oilPainting: 50, painting: 40, manga: 40, sketch: 30 },
            "Whimsical": { fantasyPortrait: 50, fantasy: 40, painting: 40, illustration: 60, ghibli: 50, cartoon: 40, disney: 40 },
            "Epic": { fantasyPortrait: 60, fantasy: 50, digitalPainting: 40, oilPainting: 30, painting: 30 },
            "Affectionate": { painting: 40, anime: 30, illustration: 40, cuteAnime: 40, ghibli: 30 },
            "Flirtatious": { anime: 30, waifu: 50, paintedAnime: 30 },
            "Sensual": { photo: 40, waifu: 60, paintedAnime: 30 },
            "Explicit": { photo: 60, waifu: 80 },
        };
        let settingBoosts = {
            "Fantasy": { fantasyPortrait: 80, fantasy: 80, painting: 40, digitalPainting: 40, illustration: 30 },
            "High_Fantasy": { fantasyPortrait: 90, fantasy: 90, painting: 50, illustration: 40 },
            "Dark_Fantasy": { fantasyPortrait: 70, fantasy: 60, painting: 60, oilPainting: 50 },
            "Sci_Fi": { photo: 50, digitalPainting: 40, render: 60 },
            "Cyberpunk": { photo: 40, digitalPainting: 50, render: 50 },
            "Space_Opera": { fantasyPortrait: 40, fantasy: 50, digitalPainting: 50, render: 40 },
            "Real_World_Modern": { photo: 80, casualPhoto: 60 },
            "Real_World_Furry": { furryOil: 100, furry: 100 },
            "Real_World_Fantasy": { fantasyPortrait: 60, photo: 30, painting: 30 },
            "Historical": { oilPainting: 80, painting: 60, vintage: 50, sketch: 30 },
            "Post_Apocalyptic": { photo: 50, painting: 30, digitalPainting: 30, render: 30 },
            "Zombie_apocalypse": { photo: 50, painting: 30, digitalPainting: 30, render: 30 },
            "Alien_apocalypse": { photo: 40, digitalPainting: 40, render: 50, painting: 30 },
            "Horror": { oilPainting: 40, painting: 40, vintage: 30, sketch: 30 },
            "Mythology": { fantasyPortrait: 70, fantasy: 70, oilPainting: 50, painting: 60, japanese: 30 },
            "Solarpunk": { digitalPainting: 60, painting: 50, fantasy: 40, illustration: 50 },
            "Urban_Fantasy": { fantasyPortrait: 50, photo: 40, digitalPainting: 30 },
            "Steampunk": { oilPainting: 60, painting: 50, vintage: 60, comic: 30 },
            "Dieselpunk": { vintage: 70, oilPainting: 40, comic: 50 },
            "Gothic": { oilPainting: 80, painting: 60, vintage: 40 },
            "Fairy_Tale": { fantasyPortrait: 70, fantasy: 60, painting: 50, illustration: 50, disney: 40 },
            "Wuxia": { anime: 70, basicAnime: 60, painting: 40, japanese: 50, manga: 40 },
            "Isekai": { anime: 80, basicAnime: 80, fantasyPortrait: 40, manga: 50 },
            "Weird_West": { oilPainting: 50, vintage: 50, comic: 30, photo: 30 },
            "Hard_Sci_Fi": { photo: 70, render: 60, digitalPainting: 30 },
            "Dreamlike": { painting: 60, digitalPainting: 50, anime: 40, illustration: 50, ghibli: 40 },
            "Satirical": { comic: 60, cartoon: 50, basicCartoon: 40 },
        };
        let sb = settingBoosts[setting] || {};
        for (let tag in sb) if (weights[tag] !== undefined) weights[tag] += sb[tag];
        for (let tone of tones) {
            let tb = toneBoosts[tone] || {};
            for (let tag in tb) if (weights[tag] !== undefined) weights[tag] += tb[tag];
        }
        let allStyles = root.visualStyles.selectAll;
        let best = null; let bestScore = -1;
        for (let style of allStyles) {
            let tags = style["meta:tags"] || {};
            let score = 0;
            for (let tag in weights) {
                if (tags[tag]) score += (tags[tag] / 100) * weights[tag];
            }
            if (score > bestScore) { bestScore = score; best = style.getName; }
        }
        return best || "Fantasy Portrait";
    };

    window.triggerImageGeneration = async function (appearanceText) {
        imagesAreaEl.style.display = "block";
        regenImagesBtn.disabled = true;
        regenImagePromptBtn.disabled = true;
        let stopBtn = document.getElementById("stopImageGenBtn");
        if (stopBtn) stopBtn.style.display = "inline-flex";

        let settingValue = settingEl.value !== "Any" ? settingEl.value : "";
        let toneValues = getSelectedTones();

        setGenerationStatus("🎨 Generating image prompt...");

        let textarea = document.getElementById("appearancePromptTextarea");
        if (textarea) {
            textarea.value = "";
            textarea.placeholder = "Generating image prompt...";
        }

        let captionObj;
        let captionPromptObj = {
            instruction: getCaptionPromptInstruction(appearanceText, settingValue, toneValues),
            onChunk: (data) => {
                if (textarea) {
                    textarea.value = data.fullTextSoFar;
                }
                if (data.fullTextSoFar.length > 500) {
                    let terms = data.fullTextSoFar.split(", ");
                    let uniqueTerms = [...new Set(terms)];
                    if (terms.length > 2 * uniqueTerms.length) captionObj.stop();
                }
            },
        };

        captionObj = ai(captionPromptObj);
        window.lastImageCaptionPromptStreamObj = captionObj;
        window.activeImageCaptionStream = captionObj;

        let captionResult = await captionObj;
        window.activeImageCaptionStream = null;
        if (captionResult.stopReason === "user") {
            setGenerationStatus("");
            if (stopBtn) stopBtn.style.display = "none";
            regenImagesBtn.disabled = false;
            regenImagePromptBtn.disabled = false;
            return;
        }

        let visualKeyphrasesText = captionResult.text.replace(/\n+/g, " ").trim();
        if (textarea) {
            textarea.value = visualKeyphrasesText;
        }
        window.overwrittenVisualKeyphrasesText = visualKeyphrasesText;

        let bestStyle = pickBestVisualStyle();
        if (!window.overwrittenStylePrompt) {
            visualStyleEl.value = bestStyle;
            localStorage.visualStyle = bestStyle;
        }
        updateStyleOverridePlaceholder();

        if (!window.lastCharacterData) window.lastCharacterData = {};
        window.lastCharacterData.visualKeyphrasesText = visualKeyphrasesText;
        window.lastCharacterData.appearanceText = appearanceText;
        window.lastCharacterData.visualStyleName = visualStyleEl.value;

        await generateImages();
        setGenerationStatus("");
    };

    window.generateImages = async function () {
        let textarea = document.getElementById("appearancePromptTextarea");
        let basePrompt = (window.overwrittenVisualKeyphrasesText || (textarea ? textarea.value : "") || "").trim();
        
        if (!basePrompt && window.lastCharacterData && window.lastCharacterData.visualKeyphrasesText) {
            basePrompt = window.lastCharacterData.visualKeyphrasesText;
        }

        // If no prompt, try generating one first
        if (!basePrompt) {
            let appearanceText = getSectionText("appearance") || "";
            if (appearanceText) {
                await window.triggerImageGeneration(appearanceText);
                return;
            } else {
                alert("Please generate or enter an appearance description first.");
                return;
            }
        }

        window.appearanceImageGenRunning = true;

        let regenBtn = document.getElementById("regenImagesBtn");
        let promptBtn = document.getElementById("regenImagePromptBtn");
        let stopBtn = document.getElementById("stopImageGenBtn");

        if (regenBtn) regenBtn.disabled = true;
        if (promptBtn) promptBtn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-flex";

        let count = parseInt(imageCountEl.value) || 4;
        let imagesEl = document.getElementById("imagesEl");

        let imageHtml = "";
        for (let i = 0; i < count; i++) {
            let styleOverride = window.overwrittenStylePrompt || "";
            let promptData = {
                prompt: styleOverride ? styleOverride + ", " + basePrompt : addStyleToPrompt(basePrompt),
                negativePrompt: addStyleToNegative(""),
                resolution: "512x768",
                style: "margin:0",
            };
            let wrapper = '<div class="image-card-wrapper">';
            wrapper += image(promptData).evaluateItem;
            wrapper += '<div class="image-card-actions">';
            wrapper += '<button class="image-card-btn primary-btn chooseAvatarBtn" onclick="chooseAsProfileImage(this)"><i class="bi bi-person-bounding-box"></i> Use as Profile</button>';
            wrapper += '</div></div>';
            imageHtml += wrapper;
        }

        if (imagesEl) imagesEl.innerHTML = imageHtml;
        updateStyleOverridePlaceholder();

        // Monitor image loading to hide the Stop button when all are loaded (or hit error)
        if (imagesEl) {
            let images = imagesEl.querySelectorAll("img");
            if (images.length > 0) {
                let loadedCount = 0;
                images.forEach(img => {
                    let handleLoad = () => {
                        loadedCount++;
                        if (loadedCount >= images.length) {
                            if (window.appearanceImageGenRunning) {
                                window.appearanceImageGenRunning = false;
                                if (stopBtn) stopBtn.style.display = "none";
                                if (regenBtn) regenBtn.disabled = false;
                                if (promptBtn) promptBtn.disabled = false;
                                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
                            }
                        }
                    };
                    img.addEventListener("load", handleLoad);
                    img.addEventListener("error", handleLoad);
                });
            } else {
                window.appearanceImageGenRunning = false;
                if (stopBtn) stopBtn.style.display = "none";
                if (regenBtn) regenBtn.disabled = false;
                if (promptBtn) promptBtn.disabled = false;
                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
            }
        } else {
            window.appearanceImageGenRunning = false;
            if (stopBtn) stopBtn.style.display = "none";
            if (regenBtn) regenBtn.disabled = false;
            if (promptBtn) promptBtn.disabled = false;
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        }
    };

    window.stopImageGeneration = function () {
        window.appearanceImageGenRunning = false;
        // Stop the active caption stream if still running
        if (window.activeImageCaptionStream) {
            try { window.activeImageCaptionStream.stop(); } catch(e) {}
            window.activeImageCaptionStream = null;
        }
        if (window.lastImageCaptionPromptStreamObj) {
            try { window.lastImageCaptionPromptStreamObj.stop(); } catch(e) {}
        }
        // Re-enable buttons
        let stopBtn = document.getElementById("stopImageGenBtn");
        if (stopBtn) stopBtn.style.display = "none";
        let regenBtn = document.getElementById("regenImagesBtn");
        if (regenBtn) regenBtn.disabled = false;
        let promptBtn = document.getElementById("regenImagePromptBtn");
        if (promptBtn) promptBtn.disabled = false;
        // Clear the images area to indicate generation was cancelled
        let imagesContainer = document.getElementById("imagesEl");
        if (imagesContainer) {
            imagesContainer.innerHTML = `
                <div class="image-empty-placeholder" style="padding:2rem; text-align:center; opacity:0.5; font-size:85%; width:100%; box-sizing:border-box; border:1px dashed var(--panel-border); border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.4rem;">
                    <i class="bi bi-images" style="font-size:2rem; color:var(--accent-color);"></i>
                    <span>Image generation stopped. Use the controls above to generate portrait images.</span>
                </div>
            `;
        }
        setGenerationStatus("");
    };

    window.chooseAsProfileImage = function (pluginDataOrButton, buttonEl) {
        let button = buttonEl || (pluginDataOrButton instanceof HTMLElement ? pluginDataOrButton : null);
        let data = buttonEl ? pluginDataOrButton : (pluginDataOrButton instanceof HTMLElement ? null : pluginDataOrButton);
        
        let url = data?.dataUrl || "";
        if (!url && button) {
            let wrapper = button.closest('.image-card-wrapper') || button.closest('.imageWrapper');
            if (wrapper) {
                let iframe = wrapper.querySelector('iframe');
                if (iframe) {
                    try {
                        if (iframe.textToImagePluginOutput) url = iframe.textToImagePluginOutput.dataUrl;
                    } catch (e) {
                        console.warn("Could not access iframe properties (cross-origin):", e);
                    }
                }
                if (!url) {
                    let img = wrapper.querySelector('img');
                    if (img) url = img.src;
                }
            }
        }
        if (!url) {
            alert("Image is still generating. Please wait a moment!");
            return;
        }
        
        window.updateProfileAvatar(url);
        
        // Add visual selection border
        document.querySelectorAll('.image-card-wrapper').forEach(w => {
            w.classList.remove('selected-avatar');
        });
        if (button) {
            let wrapper = button.closest('.image-card-wrapper');
            if (wrapper) {
                wrapper.classList.add('selected-avatar');
            }
            
            // Show visual feedback on the button clicked
            document.querySelectorAll('.chooseAvatarBtn').forEach(btn => {
                btn.innerHTML = '<i class="bi bi-person-bounding-box"></i> Use as Profile';
                btn.style.background = "";
                btn.style.borderColor = "";
                btn.style.color = "";
            });
            button.innerHTML = '<i class="bi bi-check-lg"></i> Chosen!';
            button.style.background = "rgba(16, 185, 129, 0.2)";
            button.style.borderColor = "#10b981";
            button.style.color = "#10b981";
        }
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.updateProfileAvatar = async function (url) {
        let avatarEl = document.getElementById("characterAvatarEl");
        let placeholderIcon = document.getElementById("avatarPlaceholderIcon");
        let removeBtn = document.getElementById("clearAvatarBtn");
        
        if (avatarEl) {
            if (url) {
                let resolved = url;
                if (url.startsWith("https://scdg-local-cache/")) {
                    resolved = await window.resolveCacheUrl(url);
                }
                avatarEl.style.backgroundImage = `url(${resolved})`;
                avatarEl.innerHTML = ""; // Clear any icon
                if (placeholderIcon) placeholderIcon.style.display = "none";
                if (removeBtn) removeBtn.style.display = "inline-flex";
                window.selectedAvatarUrl = url;
                localStorage.selectedAvatarUrl = url;
            } else {
                avatarEl.style.backgroundImage = "none";
                avatarEl.innerHTML = '<i class="bi bi-person-fill" id="avatarPlaceholderIcon"></i>';
                if (removeBtn) removeBtn.style.display = "none";
                window.selectedAvatarUrl = "";
                localStorage.removeItem("selectedAvatarUrl");
            }
        }
    };

    window.clearAvatar = function (event) {
        if (event) event.stopPropagation();
        window.updateProfileAvatar("");
        document.querySelectorAll('.imageWrapper').forEach(w => {
            w.style.border = "none";
            w.style.boxShadow = "none";
        });
        document.querySelectorAll('.chooseAvatarBtn').forEach(btn => {
            btn.innerHTML = '<i class="bi bi-person-bounding-box"></i> Use as Profile';
            btn.style.background = "";
            btn.style.borderColor = "";
            btn.style.color = "";
        });
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
    };

    window.updateStyleOverridePlaceholder = function () {
        let styleOverrideEl = document.getElementById("styleOverrideEl");
        if (!styleOverrideEl) return;
        if (!window.overwrittenStylePrompt) {
            styleOverrideEl.value = addStyleToPrompt("");
            styleOverrideEl.placeholder = "";
        }
    };

    window.regenerateImagePrompt = async function () {
        if (!window.lastCharacterData) return;
        regenImagePromptBtn.disabled = true;
        setGenerationStatus("✏️ Regenerating image prompt...");
        let appearanceText = window.lastCharacterData.appearanceText || getSectionText("appearance");
        let settingValue = settingEl.value !== "Any" ? settingEl.value : "";
        let toneValues = getSelectedTones();
        let captionObj;
        let captionPromptObj = {
            instruction: getCaptionPromptInstruction(appearanceText, settingValue, toneValues),
            onChunk: (data) => {
                if (data.fullTextSoFar.length > 500) {
                    let terms = data.fullTextSoFar.split(", ");
                    let uniqueTerms = [...new Set(terms)];
                    if (terms.length > 2 * uniqueTerms.length) captionObj.stop();
                }
            },
        };
        captionObj = ai(captionPromptObj);
        let responseData = await captionObj;
        if (responseData.stopReason === "user") { regenImagePromptBtn.disabled = false; setGenerationStatus(""); return; }
        let newKeyphrases = responseData.text.replace(/\n+/g, " ").trim();
        window.overwrittenVisualKeyphrasesText = null;
        window.lastCharacterData.visualKeyphrasesText = newKeyphrases;
        let promptTextarea = imagePromptEl.querySelector("textarea");
        if (promptTextarea) promptTextarea.value = newKeyphrases;
        setGenerationStatus("");
        regenImagePromptBtn.disabled = false;
    };

    // ─── HISTORY ──────────────────────────────────────────────────────
    window.pushGenerationHistory = function () {
        let d = getDetailsContext();
        let entry = {
            name: d.name || "Unknown",
            details: d,
            shortDescriptionText: getSectionText("shortDescription"),
            roleText: getSectionText("role"),
            personalityText: getSectionText("personality"),
            beliefsText: getSectionText("beliefs"),
            preferencesText: getSectionText("preferences"),
            abilitiesText: getSectionText("abilities"),
            relationsText: getSectionText("relations"),
            appearanceText: getSectionText("appearance"),
            backgroundText: getSectionText("background"),
            timelineText: getSectionText("timeline"),
            loreText: getSectionText("lore"),
            roleplayText: getSectionText("roleplay"),
            introScenarioText: getSectionText("introScenario"),
            introStartText: getSectionText("introStart"),
            worldLore: worldLoreEl.value,
            visualKeyphrasesText: window.lastCharacterData?.visualKeyphrasesText || "",
            visualStyleName: window.lastCharacterData?.visualStyleName || "",
            selectedAvatarUrl: window.selectedAvatarUrl || "",
            imageDataUrl: window.selectedAvatarUrl || window.lastCharacterData?.imageDataUrl || "",
            timestamp: Date.now(),
        };
        let history = window.generationHistory || [];
        history.unshift(entry);
        if (history.length > 5) history = history.slice(0, 5);
        window.generationHistory = history;
        updateHistoryBtn();
    };

    window.updateHistoryBtn = function () {
        let btn = document.getElementById("historyBtn");
        if (!btn) return;
        let count = (window.generationHistory || []).length;
        btn.style.display = count > 0 ? "inline-block" : "none";
        btn.innerHTML = '<i class="bi bi-clock-history"></i> history (' + count + ')';
    };

    window.showHistoryModal = function () {
        let history = window.generationHistory || [];
        if (history.length === 0) return;
        let itemsHtml = "";
        history.forEach(function (h, i) {
            let time = new Date(h.timestamp).toLocaleTimeString();
            itemsHtml += '<div style="display:flex; align-items:center; gap:0.5rem; padding:0.4rem 0; border-bottom:1px solid var(--panel-border);">';
            itemsHtml += '<span style="flex:1; font-size:88%;">' + h.name + ' <span style="opacity:0.5; font-size:80%;">' + time + '</span></span>';
            itemsHtml += '<button class="btn btn-secondary btn-sm" onclick="restoreFromHistory(' + i + ')" style="font-size:80%;">↩ restore</button>';
            itemsHtml += '</div>';
        });
        let historyHtml = '<div style="min-width:300px;"><div style="font-weight:bold; margin-bottom:0.5rem;">🕓 Generation History</div>';
        historyHtml += '<div style="font-size:80%; opacity:0.6; margin-bottom:0.75rem;">Last 5 generations this session. Restoring will replace current text and images.</div>';
        historyHtml += itemsHtml + '</div>';
        prompt2({
            content: { type: "none", html: historyHtml }
        }, { cancelButtonText: "close", submitButtonText: null, verticallyCenter: true });
    };

    window.restoreFromHistory = function (index) {
        let history = window.generationHistory || [];
        let h = history[index];
        if (!h) return;
        if (h.details) {
            detailNameEl.value = h.details.name || "";
            detailAgeEl.value = h.details.age || "";
            detailGenderEl.value = h.details.gender || "";
            detailOrientationEl.value = h.details.orientation || "";
            detailRaceEl.value = h.details.species || h.details.race || "";
            detailEthnicityEl.value = h.details.ethnicity || "";
            saveDetails();
        }
        if (h.shortDescriptionText) setSectionOutput("shortDescription", formatSectionText(h.shortDescriptionText));
        if (h.roleText) setSectionOutput("role", formatSectionText(h.roleText));
        if (h.personalityText) setSectionOutput("personality", formatSectionText(h.personalityText));
        if (h.beliefsText) setSectionOutput("beliefs", formatSectionText(h.beliefsText));
        if (h.preferencesText) setSectionOutput("preferences", formatSectionText(h.preferencesText));
        if (h.abilitiesText) setSectionOutput("abilities", formatSectionText(h.abilitiesText));
        if (h.relationsText) setSectionOutput("relations", formatSectionText(h.relationsText));
        if (h.appearanceText) setSectionOutput("appearance", formatSectionText(h.appearanceText));
        if (h.backgroundText) setSectionOutput("background", formatSectionText(h.backgroundText));
        if (h.timelineText) setSectionOutput("timeline", formatSectionText(h.timelineText));
        if (h.loreText) {
            window.loadLoreToUI(h.loreText);
        } else {
            clearSection("lore");
        }
        if (h.roleplayText) setSectionOutput("roleplay", formatSectionText(h.roleplayText));
        if (h.introScenarioText !== undefined || h.introStartText !== undefined) {
            let scen = h.introScenarioText || "";
            let start = h.introStartText || "";
            setSectionOutput("introScenario", formatSectionText(scen));
            window.characterSections["introScenario"] = scen;
            setSectionOutput("introStart", formatSectionText(start));
            window.characterSections["introStart"] = start;
        } else if (h.introText) {
            let split = splitOldIntroText(h.introText);
            setSectionOutput("introScenario", formatSectionText(split.scenario));
            window.characterSections["introScenario"] = split.scenario;
            setSectionOutput("introStart", formatSectionText(split.start));
            window.characterSections["introStart"] = split.start;
        } else {
            clearSection("introScenario");
            clearSection("introStart");
        }
        if (h.worldLore !== undefined) {
            worldLoreEl.value = h.worldLore;
            localStorage.worldLore = h.worldLore;
        }

        let avatarUrl = h.selectedAvatarUrl || h.imageDataUrl || "";
        updateProfileAvatar(avatarUrl);

        if (h.visualKeyphrasesText) {
            window.lastCharacterData = {
                appearanceText: h.appearanceText,
                visualKeyphrasesText: h.visualKeyphrasesText,
                visualStyleName: h.visualStyleName,
                imageDataUrl: h.imageDataUrl,
            };
            window.overwrittenVisualKeyphrasesText = null;
            window.overwrittenStylePrompt = null;
            if (h.visualStyleName) visualStyleEl.value = h.visualStyleName;
            imagesAreaEl.style.display = "block";
            let restorePromptHtml = '<div style="display:flex; flex-direction:column; gap:0.5rem; text-align:left;"><div><b>Image Prompt <span style="opacity:0.6;">(editable)</span>:</b>';
            restorePromptHtml += '<textarea class="section-notes" oninput="window.overwrittenVisualKeyphrasesText=this.value; if(window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();" style="display:block; width:100%; min-height:5rem;">' + h.visualKeyphrasesText + '</textarea></div></div>';
            imagePromptEl.innerHTML = restorePromptHtml;
            updateStyleOverridePlaceholder();
            generateImages();
        }
        window.activeCharacterId = null;
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
    };

    // ─── SAVE / LOAD ──────────────────────────────────────────────────
    window.assembleFullCharacterText = function () {
        let d = getDetailsContext();
        let lines = [];
        if (d.name) lines.push("Name = " + d.name);
        if (d.age) lines.push("Age = " + d.age);
        if (d.gender) lines.push("Gender = " + d.gender);
        if (d.orientation) lines.push("Orientation = " + d.orientation);
        if (d.species) lines.push("Race = " + d.species);
        if (d.ethnicity) lines.push("Ethnicity = " + d.ethnicity);

        let shortDescription = getSectionText("shortDescription");
        let appearance = getSectionText("appearance");
        let role = getSectionText("role");
        let personality = getSectionText("personality");
        let beliefs = getSectionText("beliefs");
        let preferences = getSectionText("preferences");
        let abilities = getSectionText("abilities");
        let relations = getSectionText("relations");
        let background = getSectionText("background");
        let timeline = getSectionText("timeline");
        let lore = getSectionText("lore");
        let roleplay = getSectionText("roleplay");
        let introScenario = getSectionText("introScenario");
        let introStart = getSectionText("introStart");

        if (shortDescription) lines.push("\nShort Description:\n" + shortDescription);
        if (appearance) lines.push("\nAppearance & Attire:\n" + appearance);
        if (role) lines.push("\nRole & Rules:\n" + role);
        if (personality) lines.push("\nPersonality & Behavior:\n" + personality);
        if (beliefs) lines.push("\nBeliefs & Morals:\n" + beliefs);
        if (preferences) lines.push("\nPreferences & Romance:\n" + preferences);
        if (abilities) lines.push("\nAbilities:\n" + abilities);
        if (relations) lines.push("\nRelations:\n" + relations);
        if (background) lines.push("\nBackground & Goals:\n" + background);
        if (timeline) lines.push("\nTimeline:\n" + timeline);
        if (lore) lines.push("\nLore / World Facts:\n" + lore);
        if (roleplay) lines.push("\nRoleplay Examples:\n" + roleplay);
        if (introScenario || introStart) {
            let introLines = ["\nRoleplay Intro:"];
            if (introScenario) {
                introLines.push("Scene Context:\n" + introScenario);
            }
            if (introStart) {
                introLines.push("Intro Script:\n" + introStart);
            }
            lines.push(introLines.join("\n"));
        }

        let worldLore = worldLoreEl.value.trim();
        if (worldLore) lines.push("\nWorld Lore:\n" + worldLore);
        return lines.join("\n");
    };

    window.saveCharacterButtonClickHandler = async function (pluginDataOrButton, buttonEl) {
        let button = buttonEl || (pluginDataOrButton instanceof HTMLElement ? pluginDataOrButton : null);
        let data = buttonEl ? pluginDataOrButton : (pluginDataOrButton instanceof HTMLElement ? null : pluginDataOrButton);

        // Ensure active cache is synced first
        if (data?.dataUrl) {
            await window.writeImageToCache("https://scdg-local-cache/characters/active/avatar", data.dataUrl);
            window.selectedAvatarUrl = "https://scdg-local-cache/characters/active/avatar";
        }
        await window.syncActiveImagesToCache();

        let d = getDetailsContext();
        let name = d.name || "Unknown";
        
        let pluginOutput = null;
        let imageDataUrl = window.selectedAvatarUrl || data?.dataUrl || window.lastCharacterData?.imageDataUrl || "";
        if (button) {
            let wrapper = button.closest('.image-card-wrapper') || button.closest('.imageWrapper');
            if (wrapper) {
                let iframe = wrapper.querySelector('iframe');
                if (iframe) {
                    try {
                        if (iframe.textToImagePluginOutput) {
                            pluginOutput = iframe.textToImagePluginOutput;
                            if (!imageDataUrl) imageDataUrl = iframe.textToImagePluginOutput.dataUrl;
                        }
                    } catch (e) {
                        console.warn("Could not access iframe properties (cross-origin):", e);
                    }
                }
                if (!imageDataUrl) {
                    let img = wrapper.querySelector('img');
                    if (img) imageDataUrl = img.getAttribute("data-src") || img.src;
                }
            }
        }
        
        let newId = Date.now();
        await window.copyActiveCacheToCharacter(newId);

        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let charObj = {
            id: newId,
            name,
            details: d,
            sheetData: window.sheetsState || JSON.parse(localStorage.activeSheetData || "null") || null,
            shortDescriptionText: getSectionText("shortDescription"),
            shortDescriptionNotes: (document.getElementById("shortDescriptionNotesEl") || {}).value || "",
            roleText: getSectionText("role"),
            roleNotes: (document.getElementById("roleNotesEl") || {}).value || "",
            personalityText: getSectionText("personality"),
            personalityNotes: (document.getElementById("personalityNotesEl") || {}).value || "",
            beliefsText: getSectionText("beliefs"),
            beliefsNotes: (document.getElementById("beliefsNotesEl") || {}).value || "",
            preferencesText: getSectionText("preferences"),
            preferencesNotes: (document.getElementById("preferencesNotesEl") || {}).value || "",
            abilitiesText: getSectionText("abilities"),
            abilitiesNotes: (document.getElementById("abilitiesNotesEl") || {}).value || "",
            relationsText: getSectionText("relations"),
            relationsNotes: (document.getElementById("relationsNotesEl") || {}).value || "",
            appearanceText: getSectionText("appearance"),
            appearanceNotes: (document.getElementById("appearanceNotesEl") || {}).value || "",
            backgroundText: getSectionText("background"),
            backgroundNotes: (document.getElementById("backgroundNotesEl") || {}).value || "",
            timelineText: getSectionText("timeline"),
            timelineNotes: (document.getElementById("timelineNotesEl") || {}).value || "",
            loreText: getSectionText("lore"),
            loreNotes: (document.getElementById("loreNotesEl") || {}).value || "",
            roleplayText: getSectionText("roleplay"),
            roleplayNotes: (document.getElementById("roleplayNotesEl") || {}).value || "",
            introScenarioText: getSectionText("introScenario"),
            introStartText: getSectionText("introStart"),
            introNotes: (document.getElementById("introNotesEl") || {}).value || "",
            generatedText: assembleFullCharacterText(),
            
            selectedAvatarUrl: window.selectedAvatarUrl || "",
            imageDataUrl,
            pluginOutput,
            visualStyleName: visualStyleEl.value,
            setting: settingEl.value,
            tone: getSelectedTones(),
            archetype: typeof getSelectedArchetypes === "function" ? getSelectedArchetypes() : ["Any"],
            dynamic: typeof getSelectedDynamics === "function" ? getSelectedDynamics() : ["Any"],
            overviewNotes: (document.getElementById("overviewNotesEl") || {}).value || "",
            worldLore: (document.getElementById("worldLoreEl") || {}).value || "",
            worldName: (document.getElementById("worldNameEl") || {}).value || localStorage.worldName || "",
            worldLoreNotes: (document.getElementById("worldLoreNotesEl") || {}).value || "",
            worldLoreImageUrl: localStorage.worldLoreImageUrl || "",
            visualKeyphrasesText: window.lastCharacterData?.visualKeyphrasesText || "",
            overwrittenVisualKeyphrasesText: window.overwrittenVisualKeyphrasesText || "",
            overwrittenStylePrompt: window.overwrittenStylePrompt || "",
            overwrittenIntroBgPrompt: window.overwrittenIntroBgPrompt || "",
            overwrittenIntroCharPrompt: window.overwrittenIntroCharPrompt || "",
            introBgImageUrl: localStorage.introBgImageUrl || "",
            introCharImageUrl: localStorage.introCharImageUrl || "",
            activeImages: (function() {
                let imgUrls = [];
                document.querySelectorAll("#imagesEl img").forEach(img => {
                    let src = img.getAttribute("data-src") || img.src;
                    if (src) imgUrls.push(src);
                });
                return imgUrls;
            })(),
        };

        charObj = window.translateActiveToCharKeys(charObj, newId);
        saved.push(charObj);

        localStorage.savedCharacters = JSON.stringify(saved);
        window.activeCharacterId = newId;
        if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
        if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
        renderSidebar();
        if (button) {
            let origHtml = button.innerHTML;
            button.innerHTML = "<i class=\"bi bi-check-lg\"></i> Saved!";
            setTimeout(() => { button.innerHTML = origHtml; }, 2000);
        }
    };

    window.saveCharacterFromTopBar = function (btn) {
        saveCharacterButtonClickHandler(btn, btn);
    };

    window.saveActiveWorkspaceState = window.debounce(function () {
        localStorage.activeCharacterId = window.activeCharacterId || "";
        localStorage.activeCharacterSections = JSON.stringify(window.characterSections || {});
        localStorage.selectedAvatarUrl = window.selectedAvatarUrl || "";
        localStorage.overwrittenVisualKeyphrasesText = window.overwrittenVisualKeyphrasesText || "";
        localStorage.overwrittenStylePrompt = window.overwrittenStylePrompt || "";
        localStorage.overwrittenIntroBgPrompt = window.overwrittenIntroBgPrompt || "";
        localStorage.overwrittenIntroCharPrompt = window.overwrittenIntroCharPrompt || "";
        localStorage.lastCharacterData = JSON.stringify(window.lastCharacterData || null);
        
        let imgUrls = [];
        document.querySelectorAll("#imagesEl img").forEach(img => {
            let src = img.getAttribute("data-src") || img.src;
            if (src) imgUrls.push(src);
        });
        localStorage.activeImages = JSON.stringify(imgUrls);
        
        window.syncActiveImagesToCache();
    }, 300);

    window.updateTopBarSaveButtons = function () {
        let container = document.getElementById("saveButtonsContainer");
        if (!container) return;
        
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let activeChar = saved.find(x => x.id === window.activeCharacterId);
        
        if (activeChar) {
            container.innerHTML = `
                <button onclick="updateCharacter(${activeChar.id})" class="btn-primary" style="font-size:90%; padding:0.45rem 0.8rem; height:fit-content; background:var(--accent-color); border-color:var(--accent-color);"><i class="bi bi-floppy-fill"></i> Save Changes</button>
                <button onclick="saveCharacterButtonClickHandler(this)" class="btn-secondary" style="font-size:90%; padding:0.45rem 0.8rem; height:fit-content;" title="Save as a new character slot"><i class="bi bi-copy"></i> Save as Copy</button>
            `;
        } else {
            container.innerHTML = `
                <button id="saveCharacterTopBtn" onclick="saveCharacterFromTopBar(this)" class="btn-secondary" style="font-size:90%; padding:0.45rem 0.8rem; height:fit-content;"><i class="bi bi-floppy"></i> Save Character</button>
            `;
        }
    };

    window.loadCharacter = function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let c = saved.find(x => x.id === id);
        if (!c) return;

        window.showConfirmDialog(
            `Are you sure you want to load <b>${c.name}</b>? Any unsaved edits currently on the screen will be overwritten.`,
            'warnOnLoad',
            async () => {
                await window.copyCharacterCacheToActive(id);
                let cActive = window.translateCharToActiveKeys(c, id);

                let d = cActive.details || {};
                detailNameEl.value = d.name || (cActive.name || "");
                detailAgeEl.value = d.age || "";
                detailGenderEl.value = d.gender || "";
                detailOrientationEl.value = d.orientation || "";
                detailRaceEl.value = d.species || d.race || "";
                detailEthnicityEl.value = d.ethnicity || "";
                saveDetails();
                // Restore outputs and notes for all sections
                window.characterSections = {};
                let sections = ["shortDescription", "role", "personality", "beliefs", "preferences", "abilities", "relations", "appearance", "background", "timeline", "lore", "roleplay"];
                sections.forEach(s => {
                    let textKey = s + "Text";
                    let notesKey = s + "Notes";
                    let outputEl = document.getElementById(s + "OutputEl");
                    let notesEl = document.getElementById(s + "NotesEl");
                    let editBtn = document.getElementById(s + "EditBtnEl");
                    
                    if (s === "lore") {
                        if (cActive[textKey] !== undefined) {
                            window.loadLoreToUI(cActive[textKey]);
                            if (editBtn) editBtn.style.display = "inline-block";
                        } else {
                            clearSection(s);
                        }
                    } else {
                        if (cActive[textKey] !== undefined) {
                            setSectionOutput(s, formatSectionText(cActive[textKey]));
                            window.characterSections[s] = cActive[textKey];
                            if (editBtn) editBtn.style.display = "inline-block";
                        } else {
                            clearSection(s);
                        }
                    }
                    
                    if (cActive[notesKey] !== undefined) {
                        if (notesEl) {
                            notesEl.value = cActive[notesKey];
                            localStorage[s + "Notes"] = cActive[notesKey];
                        }
                    } else {
                        if (notesEl) {
                            notesEl.value = "";
                            localStorage.removeItem(s + "Notes");
                        }
                    }
                });

                // Restore split intro sections
                let introNotesEl = document.getElementById("introNotesEl");
                
                if (cActive.introNotes !== undefined) {
                    if (introNotesEl) {
                        introNotesEl.value = cActive.introNotes;
                        localStorage.introNotes = cActive.introNotes;
                    }
                } else {
                    if (introNotesEl) {
                        introNotesEl.value = "";
                        localStorage.removeItem("introNotes");
                    }
                }
                
                if (cActive.introScenarioText !== undefined || cActive.introStartText !== undefined) {
                    let scenText = cActive.introScenarioText || "";
                    let startText = cActive.introStartText || "";
                    
                    setSectionOutput("introScenario", formatSectionText(scenText));
                    window.characterSections["introScenario"] = scenText;
                    
                    setSectionOutput("introStart", formatSectionText(startText));
                    window.characterSections["introStart"] = startText;
                } else if (cActive.introText) {
                    let split = splitOldIntroText(cActive.introText);
                    
                    setSectionOutput("introScenario", formatSectionText(split.scenario));
                    window.characterSections["introScenario"] = split.scenario;
                    
                    setSectionOutput("introStart", formatSectionText(split.start));
                    window.characterSections["introStart"] = split.start;
                } else {
                    clearSection("introScenario");
                    clearSection("introStart");
                }

                // Restore chosen avatar
                let avatarUrl = cActive.selectedAvatarUrl || cActive.imageDataUrl || "";
                await window.updateProfileAvatar(avatarUrl);

                window.lastCharacterData = {
                    appearanceText: cActive.appearanceText || "",
                    loreText: cActive.loreText || "",
                    visualKeyphrasesText: cActive.visualKeyphrasesText || "",
                    visualStyleName: cActive.visualStyleName || "",
                    imageDataUrl: cActive.imageDataUrl || "",
                };
                window.overwrittenVisualKeyphrasesText = cActive.overwrittenVisualKeyphrasesText || null;
                window.overwrittenStylePrompt = cActive.overwrittenStylePrompt || null;
                if (cActive.visualStyleName) {
                    visualStyleEl.value = cActive.visualStyleName;
                    window.syncCustomSelectLabel(visualStyleEl);
                }
                if (cActive.setting) {
                    settingEl.value = cActive.setting;
                    window.syncCustomSelectLabel(settingEl);
                }
                
                // Restore selected tones
                if (cActive.tone) {
                    const sel = new Set();
                    if (cActive.tone.includes("Any") || cActive.tone.length === 0) {
                        sel.add("none");
                    } else {
                        cActive.tone.forEach(t => sel.add(t));
                    }
                    if (typeof multiSelectState !== "undefined") {
                        multiSelectState["toneEl"] = sel;
                    }
                    updateToneLabel();
                    saveTones();
                }

                // Restore selected archetypes
                if (cActive.archetype) {
                    const sel = new Set();
                    if (cActive.archetype.includes("Any") || cActive.archetype.length === 0) {
                        sel.add("none");
                    } else {
                        cActive.archetype.forEach(a => sel.add(a));
                    }
                    if (typeof multiSelectState !== "undefined") {
                        multiSelectState["archetypeEl"] = sel;
                    }
                    updateArchetypeLabel();
                    saveArchetypes();
                }

                // Restore selected dynamics
                if (cActive.dynamic) {
                    const sel = new Set();
                    if (cActive.dynamic.includes("Any") || cActive.dynamic.length === 0) {
                        sel.add("none");
                    } else {
                        cActive.dynamic.forEach(d => sel.add(d));
                    }
                    if (typeof multiSelectState !== "undefined") {
                        multiSelectState["dynamicEl"] = sel;
                    }
                    updateDynamicLabel();
                    saveDynamics();
                }

                let overviewEl = document.getElementById("overviewNotesEl");
                let worldEl = document.getElementById("worldLoreEl");
                let worldNameEl2 = document.getElementById("worldNameEl");
                let worldLoreNotesEl2 = document.getElementById("worldLoreNotesEl");
                if (overviewEl && cActive.overviewNotes !== undefined) { overviewEl.value = cActive.overviewNotes; localStorage.overviewNotes = cActive.overviewNotes; }
                if (worldEl && cActive.worldLore !== undefined) { worldEl.value = cActive.worldLore; localStorage.worldLore = cActive.worldLore; }
                if (worldNameEl2) { worldNameEl2.value = cActive.worldName || ""; localStorage.worldName = cActive.worldName || ""; }
                if (worldLoreNotesEl2 && cActive.worldLoreNotes !== undefined) { worldLoreNotesEl2.value = cActive.worldLoreNotes; localStorage.worldLoreNotes = cActive.worldLoreNotes; }

                if (cActive.worldLoreImageUrl) {
                    localStorage.worldLoreImageUrl = cActive.worldLoreImageUrl;
                    await window.updateWorldLoreVisuals(cActive.worldLoreImageUrl);
                } else {
                    localStorage.removeItem("worldLoreImageUrl");
                    let container = document.getElementById("worldLoreImgContainer");
                    if (container) container.style.display = "none";
                    if (typeof worldLoreBgEl !== 'undefined') worldLoreBgEl.style.backgroundImage = "none";
                }

                let imgUrls = cActive.activeImages || (cActive.imageDataUrl ? [cActive.imageDataUrl] : []);
                if (imagesAreaEl) imagesAreaEl.style.display = "block";
                
                window.overwrittenVisualKeyphrasesText = cActive.overwrittenVisualKeyphrasesText || "";
                window.overwrittenStylePrompt = cActive.overwrittenStylePrompt || "";
                if (window.lastCharacterData) {
                    window.lastCharacterData.visualKeyphrasesText = cActive.visualKeyphrasesText || "";
                    window.lastCharacterData.appearanceText = cActive.appearanceText || "";
                    window.lastCharacterData.visualStyleName = cActive.visualStyleName || "";
                } else {
                    window.lastCharacterData = {
                        visualKeyphrasesText: cActive.visualKeyphrasesText || "",
                        appearanceText: cActive.appearanceText || "",
                        visualStyleName: cActive.visualStyleName || ""
                    };
                }
                
                let promptEl = document.getElementById("appearancePromptTextarea");
                if (promptEl) promptEl.value = cActive.overwrittenVisualKeyphrasesText || cActive.visualKeyphrasesText || "";
                
                let styleOverrideEl = document.getElementById("styleOverrideEl");
                if (styleOverrideEl) {
                    styleOverrideEl.value = cActive.overwrittenStylePrompt || "";
                }
                updateStyleOverridePlaceholder();

                if (imgUrls && imgUrls.length > 0) {
                    let imageHtml = "";
                    imgUrls.forEach(url => {
                        let isSelected = (url === avatarUrl) ? " selected-avatar" : "";
                        let wrapper = '<div class="image-card-wrapper' + isSelected + '">';
                        wrapper += '<img data-src="' + url + '" src="">';
                        wrapper += '<div class="image-card-actions">';
                        wrapper += '<button class="image-card-btn primary-btn chooseAvatarBtn" onclick="chooseAsProfileImage(this)"><i class="bi bi-person-bounding-box"></i> Use as Profile</button>';
                        wrapper += '</div></div>';
                        imageHtml += wrapper;
                    });
                    if (imagesEl) {
                        imagesEl.innerHTML = imageHtml;
                        await window.resolveLazyCacheImages(imagesEl);
                    }
                } else {
                    if (imagesEl) {
                        imagesEl.innerHTML = `
                            <div class="image-empty-placeholder" style="padding:2rem; text-align:center; opacity:0.5; font-size:85%; width:100%; box-sizing:border-box; border:1px dashed var(--panel-border); border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.4rem;">
                                <i class="bi bi-images" style="font-size:2rem; color:var(--accent-color);"></i>
                                <span>No character images generated yet. Use the controls above to generate portrait images.</span>
                            </div>
                        `;
                    }
                }

                // Restore intro images and prompts
                window.overwrittenIntroBgPrompt = cActive.overwrittenIntroBgPrompt || "";
                window.overwrittenIntroCharPrompt = cActive.overwrittenIntroCharPrompt || "";
                localStorage.overwrittenIntroBgPrompt = window.overwrittenIntroBgPrompt;
                localStorage.overwrittenIntroCharPrompt = window.overwrittenIntroCharPrompt;
                
                let introBgPromptEl = document.getElementById("introBgPromptEl");
                let rpTabIntroBgPromptEl = document.getElementById("rpTab-introBgPromptEl");
                let introCharPromptEl = document.getElementById("introCharPromptEl");
                let rpTabIntroCharPromptEl = document.getElementById("rpTab-introCharPromptEl");
                if (introBgPromptEl) introBgPromptEl.value = window.overwrittenIntroBgPrompt;
                if (rpTabIntroBgPromptEl) rpTabIntroBgPromptEl.value = window.overwrittenIntroBgPrompt;
                if (introCharPromptEl) introCharPromptEl.value = window.overwrittenIntroCharPrompt;
                if (rpTabIntroCharPromptEl) rpTabIntroCharPromptEl.value = window.overwrittenIntroCharPrompt;
                
                localStorage.introBgImageUrl = cActive.introBgImageUrl || "";
                localStorage.introCharImageUrl = cActive.introCharImageUrl || "";
                
                let introBg = document.getElementById("introImageBg");
                let rpTabIntroBg = document.getElementById("rpTab-introImageBg");
                let introCanvas = document.getElementById("introImageCharCanvas");
                let rpTabIntroCanvas = document.getElementById("rpTab-introImageCharCanvas");
                let hasPreview = false;
                
                if (localStorage.introBgImageUrl) {
                    let resolved = await window.resolveCacheUrl(localStorage.introBgImageUrl);
                    if (introBg) introBg.style.backgroundImage = `url(${resolved})`;
                    if (rpTabIntroBg) rpTabIntroBg.style.backgroundImage = `url(${resolved})`;
                    hasPreview = true;
                } else {
                    if (introBg) introBg.style.backgroundImage = "";
                    if (rpTabIntroBg) rpTabIntroBg.style.backgroundImage = "";
                }
                
                if (localStorage.introCharImageUrl) {
                    let resolved = await window.resolveCacheUrl(localStorage.introCharImageUrl);
                    let img = new Image();
                    img.onload = function() {
                        let canvases = [introCanvas, rpTabIntroCanvas].filter(Boolean);
                        canvases.forEach(c => {
                            c.width = img.width;
                            c.height = img.height;
                            let ctx = c.getContext("2d");
                            if (ctx) {
                                ctx.clearRect(0, 0, c.width, c.height);
                                ctx.drawImage(img, 0, 0);
                            }
                        });
                    };
                    img.src = resolved;
                    hasPreview = true;
                } else {
                    let canvases = [introCanvas, rpTabIntroCanvas].filter(Boolean);
                    canvases.forEach(c => {
                        let ctx = c.getContext("2d");
                        if (ctx) ctx.clearRect(0, 0, c.width, c.height);
                    });
                }
                
                let placeholder = document.getElementById("introImagePlaceholder");
                if (placeholder) {
                    placeholder.style.display = hasPreview ? "none" : "flex";
                }
                let rpTabPlaceholder = document.getElementById("rpTab-introImagePlaceholder");
                if (rpTabPlaceholder) {
                    rpTabPlaceholder.style.display = hasPreview ? "none" : "flex";
                }
                
                window.sheetsState = cActive.sheetData || null;
                if (cActive.sheetData) {
                    localStorage.activeSheetData = JSON.stringify(cActive.sheetData);
                } else {
                    localStorage.removeItem("activeSheetData");
                }
                let sheetSelector = document.getElementById("sheetCharacterSelector");
                if (sheetSelector) {
                    sheetSelector.value = id;
                }
                window.activeCharacterId = id;
                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
                if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
                
                // Close sidebar on load
                let sidebar = document.getElementById("sidebarEl");
                if (sidebar) sidebar.style.transform = "translateX(100%)";
            }
        );
    };

    window.renderSidebar = async function (searchQuery = "") {
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let q = searchQuery.toLowerCase().trim();
        
        // Read input box directly if empty arg but input has text
        if (!q) {
            let input = document.getElementById("characterSearchInput");
            if (input && input.value) {
                q = input.value.toLowerCase().trim();
                let clearBtn = document.getElementById("clearSearchBtn");
                if (clearBtn) clearBtn.style.display = "inline-flex";
            }
        }

        if (q) {
            saved = saved.filter(c => c.name.toLowerCase().includes(q));
        }

        let listHtml = "";
        if (saved.length === 0) {
            listHtml = q ? '<div class="sidebar-empty-state"><i class="bi bi-people"></i>No matching characters found.</div>'
                        : '<div class="sidebar-empty-state"><i class="bi bi-people"></i>No saved characters yet.</div>';
        } else {
            for (let c of saved) {
                let card = '<div class="sidebar-char-card">';
                let cardImgUrl = c.selectedAvatarUrl || c.imageDataUrl || "";
                if (cardImgUrl) { card += '<img data-src="' + cardImgUrl + '" src="" class="sidebar-char-img">'; } else { card += '<div class="sidebar-char-img-placeholder"><i class="bi bi-person-fill"></i></div>'; }
                card += '<div class="sidebar-char-header">';
                card += '<input type="checkbox" id="ref-' + c.id + '" class="sidebar-char-checkbox">';
                card += '<label for="ref-' + c.id + '" ondblclick="renameSavedCharacter(\'' + c.id + '\', this)" class="sidebar-char-name" title="Double-click to rename">' + c.name + '</label>';
                card += '</div>';
                card += '<div class="sidebar-char-actions">';
                card += '<button onclick="loadCharacter(\'' + c.id + '\')" class="btn btn-secondary btn-sm sidebar-char-btn-load" title="Load character"><i class="bi bi-folder-open"></i> load</button>';
                card += '<button onclick="updateCharacter(\'' + c.id + '\')" class="btn btn-secondary btn-sm sidebar-char-btn-update" title="Update slot with screen edits"><i class="bi bi-floppy"></i> update</button>';
                card += '<button onclick="duplicateCharacter(\'' + c.id + '\')" class="btn btn-secondary btn-sm sidebar-char-btn-dupe" title="Duplicate"><i class="bi bi-copy"></i> dupe</button>';
                card += '<button onclick="deleteCharacter(\'' + c.id + '\')" class="btn btn-danger btn-sm sidebar-char-btn-delete" title="Delete"><i class="bi bi-trash"></i></button>';
                card += '</div></div>';
                listHtml += card;
            }
        }
        sidebarListEl.innerHTML = listHtml;
        await window.resolveLazyCacheImages(sidebarListEl);
        updateSavedCountBadge();
        updateReferencesBanner();
        await window.checkStorageUsage();
    };

    window.filterSavedCharacters = function (query) {
        let q = query.toLowerCase().trim();
        let clearBtn = document.getElementById("clearSearchBtn");
        if (clearBtn) {
            clearBtn.style.display = q ? "inline-flex" : "none";
        }
        renderSidebar(q);
    };

    window.clearCharacterSearch = function () {
        let input = document.getElementById("characterSearchInput");
        if (input) {
            input.value = "";
        }
        filterSavedCharacters("");
        if (input) input.focus();
    };

    window.deleteCharacter = async function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        localStorage.savedCharacters = JSON.stringify(saved.filter(x => x.id !== id));
        await window.deleteCharacterCache(id);
        if (window.activeCharacterId === id) {
            window.activeCharacterId = null;
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
            if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
        }
        await renderSidebar();
    };

    window.duplicateCharacter = async function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let original = saved.find(x => x.id === id);
        if (!original) return;
        let newId = Date.now();
        await window.duplicateCharacterCache(id, newId);
        let dupeMeta = window.translateCharacterCacheKeys(original, id, newId);
        let dupe = Object.assign({}, dupeMeta, { id: newId, name: original.name + " (copy)" });
        saved.push(dupe);
        localStorage.savedCharacters = JSON.stringify(saved);
        await renderSidebar();
    };

    window.renameSavedCharacter = function (id, labelEl) {
        id = isNaN(Number(id)) ? id : Number(id);
        let currentName = labelEl.textContent;
        let input = document.createElement("input");
        input.value = currentName;
        input.style.cssText = "font-size:90%; font-weight:bold; width:100%; border:1px solid var(--accent-color); background:var(--input-bg); color:var(--text-main); outline:none; border-radius:4px; padding:0.1rem 0.2rem;";
        labelEl.replaceWith(input);
        input.focus(); input.select();
        let committed = false;
        let commit = () => {
            if (committed) return;
            committed = true;
            let newName = input.value.trim() || currentName;
            let saved = JSON.parse(localStorage.savedCharacters || "[]");
            let idx = saved.findIndex(x => x.id === id);
            if (idx !== -1) { saved[idx].name = newName; localStorage.savedCharacters = JSON.stringify(saved); }
            renderSidebar();
        };
        input.addEventListener("blur", commit);
        input.addEventListener("keydown", e => {
            if (e.key === "Enter") { e.preventDefault(); input.blur(); }
            if (e.key === "Escape") { input.value = currentName; input.blur(); }
        });
    };

    window.resolveObjectCacheKeysToBase64 = async function(val) {
        if (typeof val === "string" && val.startsWith("https://scdg-local-cache/")) {
            const base64 = await window.getCachedImageAsBase64(val);
            return base64 || val;
        }
        if (Array.isArray(val)) {
            let res = [];
            for (let item of val) {
                res.push(await window.resolveObjectCacheKeysToBase64(item));
            }
            return res;
        }
        if (val && typeof val === "object") {
            let copy = {};
            for (let k in val) {
                copy[k] = await window.resolveObjectCacheKeysToBase64(val[k]);
            }
            return copy;
        }
        return val;
    };

    window.extractBase64ToCache = async function(val, charId, pathKey = "img") {
        if (typeof val === "string" && val.startsWith("data:")) {
            const virtualUrl = `https://scdg-local-cache/characters/${charId}/${pathKey}`;
            await window.writeImageToCache(virtualUrl, val);
            return virtualUrl;
        }
        if (Array.isArray(val)) {
            let res = [];
            for (let i = 0; i < val.length; i++) {
                res.push(await window.extractBase64ToCache(val[i], charId, `${pathKey}-${i}`));
            }
            return res;
        }
        if (val && typeof val === "object") {
            let copy = {};
            for (let k in val) {
                copy[k] = await window.extractBase64ToCache(val[k], charId, k);
            }
            return copy;
        }
        return val;
    };

    window.exportSavedCharacters = async function () {
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        if (saved.length === 0) { alert("No saved characters to export."); return; }
        
        let resolvedSaved = [];
        for (let char of saved) {
            let resolvedChar = await window.resolveObjectCacheKeysToBase64(char);
            resolvedSaved.push(resolvedChar);
        }
        
        let json = JSON.stringify(resolvedSaved, null, 2);
        let blob = new Blob([json], { type: "application/json" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "saved-characters.json";
        a.click();
        URL.revokeObjectURL(a.href);
    };

    window.importSavedCharacters = function () {
        let input = document.createElement("input");
        input.type = "file"; input.accept = ".json";
        input.onchange = e => {
            let file = e.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = async ev => {
                try {
                    let imported = JSON.parse(ev.target.result);
                    if (!Array.isArray(imported)) throw new Error("Invalid format");
                    
                    let processedImported = [];
                    for (let char of imported) {
                        if (!char.id) char.id = Date.now() + Math.floor(Math.random() * 1000);
                        let processedChar = await extractBase64ToCache(char, char.id);
                        processedImported.push(processedChar);
                    }
                    
                    let existing = JSON.parse(localStorage.savedCharacters || "[]");
                    localStorage.savedCharacters = JSON.stringify([...existing, ...processedImported]);
                    await renderSidebar();
                    alert("✅ Imported " + processedImported.length + " character(s).");
                } catch (err) {
                    console.error(err);
                    alert("❌ Failed to import: invalid file.");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // ─── CHARACTER CHAT ───────────────────────────────────────────────
    window.buildRoleInstruction = function (condensedInstruction, writingStyle) {
        let universalRules = "RULES:\n- Never write dialogue, actions, or thoughts for {{user}}}.\n- Never break character.";
        return [condensedInstruction, writingStyle, universalRules].filter(Boolean).join("\n\n");
    };

    window.prepareCharacterForChat = async function (characterData) {
        let { generatedText } = characterData;
        let settingValue = settingEl.value;
        let toneValues = getSelectedTones();
        let loadingModal = window.chatPrepLoadingModal;

        loadingModal.updateContent("🎨 Preparing chat: generating character style...");
        root.generatedText = generatedText;
        root.settingValue = settingValue;
        root.toneValues = toneValues.join(", ");
        let cssInstruction = root.prompts.characterPage.chatCss.instruction.evaluateItem;

        let cssResultStream = ai({ instruction: cssInstruction });
        let cssRes = await cssResultStream;
        let cssJson;
        try {
            let cssText = cssRes.text || "";
            let jsonMatch = cssText.match(/\{[\s\S]*\}/);
            let cleaned = jsonMatch ? jsonMatch[0] : cssText.replace(/```json|```/g, "").trim();
            cssJson = JSON.parse(cleaned);
        } catch (e) { cssJson = { css: "", googleFont: null }; }

        loadingModal.updateContent("📖 Preparing chat: building role instruction and lorebook...");
        let loreInstruction = root.prompts.characterPage.chatLore.instruction.evaluateItem;

        let loreResultStream = ai({ instruction: loreInstruction });
        let loreRes = await loreResultStream;
        let loreJson;
        try {
            let loreText = loreRes.text || "";
            let jsonMatch = loreText.match(/\{[\s\S]*\}/);
            let cleaned = jsonMatch ? jsonMatch[0] : loreText.replace(/```json|```/g, "").trim();
            loreJson = JSON.parse(cleaned);
        } catch (e) { loreJson = { roleInstruction: generatedText, loreEntries: [] }; }

        loadingModal.updateContent("✍️ Preparing chat: generating writing style...");
        let wrapperInstruction = root.prompts.characterPage.chatStyleGuide.instruction.evaluateItem;
        let wrapperResultStream = ai({ instruction: wrapperInstruction });
        let wrapperRes = await wrapperResultStream;
        let writingStyle = (wrapperRes.text || "").trim();

        let loreBookUrl = null;
        if (loreJson.loreEntries && loreJson.loreEntries.length > 0) {
            loadingModal.updateContent("📤 Preparing chat: uploading lorebook...");
            let loreBlob = new Blob([loreJson.loreEntries.join("\n\n")], { type: "text/plain" });
            let uploadResult = await uploadPlugin(loreBlob);
            if (uploadResult && uploadResult.url) loreBookUrl = uploadResult.url;
        }

        return {
            css: cssJson.css || "",
            googleFont: cssJson.googleFont || null,
            roleInstruction: loreJson.roleInstruction || generatedText,
            loreBookUrl,
            writingStyle,
        };
    };

    async function chatWithCharacterButtonClickHandler(pluginDataOrButton, buttonEl) {
        let button = buttonEl || (pluginDataOrButton instanceof HTMLElement ? pluginDataOrButton : null);
        let data = buttonEl ? pluginDataOrButton : (pluginDataOrButton instanceof HTMLElement ? null : pluginDataOrButton);

        let generatedText = assembleFullCharacterText();
        let d = getDetailsContext();
        let name = d.name || "???";
        let firstName = name.split(/[ ,]/)[0];
        
        let characterImagePrompt = (data?.inputs?.prompt || window.lastCharacterData?.visualKeyphrasesText || "").replace(/\n/g, " ");
        let characterImageDataUrl = data?.dataUrl || window.lastCharacterData?.imageDataUrl || "";
        if (!characterImageDataUrl && button) {
            let wrapper = button.closest('.image-card-wrapper') || button.closest('.imageWrapper');
            if (wrapper) {
                let iframe = wrapper.querySelector('iframe');
                if (iframe) {
                    try {
                        if (iframe.textToImagePluginOutput) {
                            characterImageDataUrl = iframe.textToImagePluginOutput.dataUrl;
                            characterImagePrompt = (iframe.textToImagePluginOutput.inputs?.prompt || characterImagePrompt).replace(/\n/g, " ");
                        }
                    } catch (e) {
                        console.warn("Could not access iframe properties (cross-origin):", e);
                    }
                }
                if (!characterImageDataUrl) {
                    let img = wrapper.querySelector('img');
                    if (img) characterImageDataUrl = img.src;
                }
            }
        }

        window.chatPrepLoadingModal = createLoadingModal("🎨 Preparing chat: generating character style...");
        if (button) button.disabled = true;

        let chatPrep = await prepareCharacterForChat({ generatedText });
        let fullCss = chatPrep.css || "";
        let roleInstruction = buildRoleInstruction(chatPrep.roleInstruction, chatPrep.writingStyle);

        window.chatPrepLoadingModal.updateContent("✅ Ready  -  preparing preview...");
        await new Promise(r => setTimeout(r, 400));
        window.chatPrepLoadingModal.delete();

        let colorScheme = getCurrentColorScheme();
        let previewHtml = '<div style="text-align:left; max-width:600px;">';
        previewHtml += '<div style="margin-bottom:0.5rem; font-weight:bold;">💬 Chat Role Instruction Preview</div>';
        previewHtml += '<textarea id="roleInstructionPreviewEl" class="section-notes" style="display:block; width:100%; min-height:14rem; font-size:82%; color-scheme:' + colorScheme + ';">' + roleInstruction.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</textarea>';
        previewHtml += '</div>';
        let result = await prompt2({
            content: { type: "none", html: previewHtml }
        }, { cancelButtonText: "cancel", submitButtonText: "🚀 launch chat", verticallyCenter: true });

        if (!result || result.cancelled) { if (button) button.disabled = false; return; }
        let editedRoleInstruction = document.getElementById("roleInstructionPreviewEl")?.value || roleInstruction;

        let customCode = fullCss ? 'oc.thread.on("MessageAdded", function({message}) {\n  if(message.author !== "ai") return;\n  message.wrapperStyle = ' + JSON.stringify(JSON.stringify(fullCss)) + ';\n  });' : "";

        let json = {
            addCharacter: {
                name,
                roleInstruction: editedRoleInstruction,
                imagePromptTriggers: firstName + ": " + characterImagePrompt,
                customCode,
                loreBookUrls: chatPrep.loreBookUrl ? [chatPrep.loreBookUrl] : [],
                avatar: { url: characterImageDataUrl, size: 1, shape: "square" },
            },
            quickAdd: true,
        };

        await generateShareLinkForCharacter(json);
        setGenerationStatus("");
        if (button) button.disabled = false;
    }

    async function generateShareLinkForCharacter(json) {
        if (!window.CompressionStream) {
            alert("Character chat links require a modern browser.");
            return;
        }
        let loadingModal = createLoadingModal("⌛ Generating chat link...");
        let jsonString = JSON.stringify(json);
        let blob = await fetch("data:text/plain;charset=utf-8," + jsonString.replace(/#/g, "%23")).then(res => res.blob());
        let compressedBlob = await compressBlobWithGzip(blob);
        let { url, error } = await uploadPlugin(compressedBlob);
        loadingModal.delete();
        if (error) { alert(`error: ${error}`); }
        else {
            let fileName = url.replace("https://user-uploads.perchance.org/file/", "");
            let shareUrl = `https://perchance.org/ai-character-chat?data=${encodeURIComponent(json.addCharacter.name)}~${fileName}`;
            let colorScheme = getCurrentColorScheme();
            await prompt2({
                content: { type: "none", html: `<div style="display:flex; gap:0.5rem;"><input value="${shareUrl}" style="flex-grow:1; background:var(--input-bg); border:1px solid var(--input-border); color:var(--text-main); border-radius:4px; padding:0.35rem 0.5rem; outline:none;"> <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(this.parentElement.querySelector('input').value);">📋 copy</button> </div>` },
            }, { cancelButtonText: null, submitButtonText: "finished", verticallyCenter: true });
        }
    }

    window.compressBlobWithGzip = async function (blob) {
        const cs = new CompressionStream('gzip');
        const compressedStream = blob.stream().pipeThrough(cs);
        let outputBlob = await new Response(compressedStream).blob();
        return new Blob([outputBlob], { type: "application/gzip" });
    };

    window.createLoadingModal = function (initialContent, parentElement) {
        if (!parentElement) parentElement = document.body;
        let loadingModalCtn = document.createElement("div");
        loadingModalCtn.innerHTML = `<style>
            .loadingModalCtn-856246272937 {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.45);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                z-index: 99999999;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1.5rem;
            }
            .loadingModalContent-856246272937 {
                background-color: var(--panel-bg);
                border: 1px solid var(--panel-border);
                color: var(--text-main);
                border-radius: 12px;
                padding: 1.5rem 2.25rem;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                max-width: 400px;
                width: 100%;
                box-sizing: border-box;
                font-size: 90%;
                font-weight: 500;
            }
        </style>`;
        let contentEl = document.createElement("div");
        contentEl.classList.add("loadingModalContent-856246272937");
        contentEl.innerHTML = initialContent || "";
        loadingModalCtn.appendChild(contentEl);
        loadingModalCtn.classList.add("loadingModalCtn-856246272937");
        parentElement.appendChild(loadingModalCtn);
        return {
            updateContent: function (content) { contentEl.innerHTML = content; },
            delete: function () { loadingModalCtn.remove(); },
        }
    };

    // ─── WIKI IMPORT ──────────────────────────────────────────────────
    window.importFromWikiUrl = async function (url) {
        if (!url) return;
        url = url.trim();
        if (!/^https?:\/\//i.test(url)) {
            alert("Please enter a valid URL (starting with http:// or https://)");
            return;
        }
        setGenerationStatus("⏳ Fetching page content...");
        try {
            let content = "";
            let response = await superFetch(url);
            let blob = await response.blob();
            let html = await blob.text();
            let doc = new DOMParser().parseFromString(html, "text/html");
            if (/^https:\/\/[^.]+.fandom\.com\/wiki\//.test(url)) {
                let wikiPageName = url.split("/wiki/").at(-1).split("?")[0];
                let urlObj = new URL(url);
                if (url.includes("genshin-impact.fandom.com") && !url.endsWith("/Lore")) {
                    try {
                        let json = await superFetch(`https://${urlObj.hostname}/api.php?action=visualeditor&format=json&paction=wikitext&page=${wikiPageName}/Lore&uselang=en&formatversion=2`).then(r => r.json());
                        if (json?.visualeditor?.content) content = json.visualeditor.content;
                    } catch (e) { }
                }
                if (!content) {
                    let json = await superFetch(`https://${urlObj.hostname}/api.php?action=visualeditor&format=json&paction=wikitext&page=${wikiPageName}&uselang=en&formatversion=2`).then(r => r.json());
                    content = json?.visualeditor?.content || "";
                }
                content = content.replace(/<ref[ >].+<\/ref>/g, "");
                content = content.replace(/\[\[File:.+?\]\]/g, "");
                content = content.replace(/\[\[(.+?)\|(.+?)\]\]/g, "$2");
                content = content.replace(/\[\[(.+?)\]\]/g, "$1");
                content = content.replace(/<br>/g, "\n");
            } else {
                if (!window.Readability) {
                    window.Readability = await import("https://user.uploads.dev/file/93edd249920ca5ac663278139c31868d.js")
                        .then(m => m.Readability)
                        .catch(err => {
                            console.warn("Failed to load readability module:", err);
                            return null;
                        });
                }
                if (window.Readability) {
                    try {
                        let article = new window.Readability(new DOMParser().parseFromString(html, "text/html")).parse();
                        content = article ? article.textContent : doc.body.innerText;
                    } catch (readError) {
                        console.warn("Readability parsing error, falling back to innerText:", readError);
                        content = doc.body.innerText;
                    }
                } else {
                    content = doc.body.innerText;
                }
            }
            setGenerationStatus("🧠 Extracting character data...");
            let wikiOverride = (document.getElementById("wikiOverrideEl") || {}).value || "";
            root.content = content;
            root.wikiOverride = wikiOverride;
            let instruction = root.prompts.characterPage.wikiImport.instruction.evaluateItem;
            let res = await ai({ instruction });
            let jsonText = res.text || "";
            let jsonMatch = jsonText.match(/\{[\s\S]*\}/);
            let cleanedJson = jsonMatch ? jsonMatch[0] : jsonText.replace(/```json|```/g, "").trim();
            let json = JSON.parse(cleanedJson);
            if (json.name) detailNameEl.value = json.name;
            if (json.age) detailAgeEl.value = json.age;
            if (json.gender) detailGenderEl.value = json.gender;
            if (json.orientation) detailOrientationEl.value = json.orientation;
            if (json.race) detailRaceEl.value = json.race;
            if (json.ethnicity) detailEthnicityEl.value = json.ethnicity;
            saveDetails();

            let overviewEl = document.getElementById("overviewNotesEl");
            let overviewText = "";
            if (json.overview) {
                overviewText = sanitizeOutput(json.overview);
            } else {
                let overviewInstruction = "TASK: Using the extracted character information below, write a concise overview notes paragraph suitable for the character generator's Overview Notes field. Do not output headings, labels, or JSON. Focus on the character's core concept, appearance, personality, role, and backstory in a single useful seed paragraph.\n\n" +
                    "Extracted character data:\n" +
                    (json.name ? "Name: " + json.name + "\n" : "") +
                    (json.age ? "Age: " + json.age + "\n" : "") +
                    (json.gender ? "Gender: " + json.gender + "\n" : "") +
                    (json.orientation ? "Orientation: " + json.orientation + "\n" : "") +
                    (json.race ? "Species/Race: " + json.race + "\n" : "") +
                    (json.ethnicity ? "Ethnicity: " + json.ethnicity + "\n" : "") +
                    (json.role ? "Role: " + json.role + "\n" : "") +
                    (json.appearance ? "Appearance: " + json.appearance + "\n" : "") +
                    (json.background ? "Background: " + json.background + "\n" : "") +
                    (json.personality ? "Personality: " + json.personality + "\n" : "") +
                    (json.beliefs ? "Beliefs: " + json.beliefs + "\n" : "") +
                    (json.preferences ? "Preferences: " + json.preferences + "\n" : "") +
                    (json.lore ? "Lore: " + json.lore + "\n" : "") +
                    (json.roleplay ? "Roleplay: " + json.roleplay + "\n" : "");

                setGenerationStatus("🧠 Generating overview notes...");
                try {
                    let overviewRes = await ai({ instruction: overviewInstruction });
                    overviewText = sanitizeOutput(overviewRes.text || "");
                } catch (e) {
                    console.warn("Overview generation from wiki import failed:", e);
                    overviewText = "";
                }
            }

            if (!overviewText) {
                let parts = [];
                if (json.role) parts.push(`Role: ${sanitizeOutput(json.role)}`);
                if (json.appearance) parts.push(`Appearance: ${sanitizeOutput(json.appearance)}`);
                if (json.personality) parts.push(`Personality: ${sanitizeOutput(json.personality)}`);
                if (json.background) parts.push(`Background: ${sanitizeOutput(json.background)}`);
                if (json.lore) parts.push(`Lore: ${sanitizeOutput(json.lore)}`);
                if (json.beliefs) parts.push(`Beliefs: ${sanitizeOutput(json.beliefs)}`);
                if (json.preferences) parts.push(`Preferences: ${sanitizeOutput(json.preferences)}`);
                if (json.roleplay) parts.push(`Roleplay: ${sanitizeOutput(json.roleplay)}`);
                overviewText = parts.join("\n\n");
            }

            if (overviewEl) {
                overviewEl.value = overviewText;
                localStorage.overviewNotes = overviewText;
            }

            setGenerationStatus("✨ Overview notes imported!");
            setTimeout(() => setGenerationStatus(""), 3000);
        } catch (e) {
            console.error(e);
            alert("Error importing from URL.");
            setGenerationStatus("");
        }
    };

    window.importFromWikiUrlButtonClickHandler = async function () {
        let url = wikiUrlEl.value;
        if (!url) return;
        wikiImportBtnEl.disabled = true;
        await importFromWikiUrl(url);
        wikiImportBtnEl.disabled = false;
    };

    window.createCommentsSectionHtml = function () {
        let options = root.commentsOptions;
        commentsCtn.innerHTML = `<p><button onclick="if(commentsEl.style.display == 'none') { commentsEl.style.display=''; this.textContent='hide comments'; } else { commentsEl.style.display='none'; this.textContent='💬 show comments'; }">💬 show comments</button></p>
    <p id="commentsEl" style="display:none;">${[root.comments(options)]}</p>`;
    };

    // ─── ACCENT THEME CUSTOMIZER ──────────────────────────────────────
    window.updateReferencesBanner = function () {
        let bannerEl = document.getElementById("referencedCharactersBannerEl");
        let countEl = document.getElementById("referencedCharactersCountEl");
        if (bannerEl && countEl) {
            let refs = typeof getReferencedCharacters === "function" ? getReferencedCharacters() : [];
            if (refs.length > 0) {
                countEl.textContent = refs.length;
                bannerEl.style.display = "block";
            } else {
                bannerEl.style.display = "none";
            }
        }
    };

    window.clearDetails = function () {
        ["Name", "Age", "Gender", "Orientation", "Race", "Ethnicity"].forEach(f => {
            let el = document.getElementById("detail" + f + "El");
            if (el) el.value = "";
            localStorage.removeItem("detail" + f);
        });
        if (typeof clearAvatar === "function") clearAvatar();
    };

    window.clearOverviewNotes = function () {
        let el = document.getElementById("overviewNotesEl");
        if (el) {
            el.value = "";
            localStorage.removeItem("overviewNotes");
        }
        let statusEl = document.getElementById("overviewStatusEl");
        if (statusEl) statusEl.innerText = "";
    };

    window.generateCoreIdentity = async function () {
        let btn = document.getElementById("coreGenBtnEl");
        let stopBtn = document.getElementById("coreStopBtnEl");
        if (btn) btn.disabled = true;
        if (stopBtn) stopBtn.style.display = "inline-block";
        window.coreIdentityGenRunning = true;

        try {
            // 1. Generate identity details
            await generateIdentityDetails();
        } catch (e) {
            console.error("Error during generateCoreIdentity:", e);
        } finally {
            window.coreIdentityGenRunning = false;
            if (btn) btn.disabled = false;
            if (stopBtn) stopBtn.style.display = "none";
            setGenerationStatus("");
        }
    };

    window.stopCoreIdentityGeneration = function () {
        window.coreIdentityGenRunning = false;
        stopDetailsGeneration();
        let btn = document.getElementById("coreGenBtnEl");
        let stopBtn = document.getElementById("coreStopBtnEl");
        if (btn) btn.disabled = false;
        if (stopBtn) stopBtn.style.display = "none";
    };

    window.clearCoreIdentity = function () {
        clearDetails();
    };

    window.clearAllSections = function () {
        window.showConfirmDialog(
            "Are you sure you want to clear all sections and details from the screen? This cannot be undone.",
            'warnOnClear',
            () => {
                ["shortDescription", "role", "personality", "beliefs", "preferences", "abilities", "relations", "appearance", "background", "timeline", "lore", "roleplay", "introScenario", "introStart"].forEach(s => clearSection(s));
                let introNotesEl = document.getElementById("introNotesEl");
                if (introNotesEl) {
                    introNotesEl.value = "";
                    localStorage.removeItem("introNotes");
                }
                clearDetails();
                clearOverviewNotes();
                if (typeof clearWorldLore === "function") clearWorldLore();
                if (typeof window.clearAppearanceImages === "function") {
                    window.clearAppearanceImages();
                } else {
                    if (typeof imagesEl !== 'undefined') imagesEl.innerHTML = "";
                    if (typeof imagePromptEl !== 'undefined') imagePromptEl.innerHTML = "";
                }
                if (typeof window.clearRoleplayImagesState === "function") {
                    window.clearRoleplayImagesState();
                }
                
                window.lastCharacterData = null;
                window.overwrittenVisualKeyphrasesText = "";
                window.overwrittenStylePrompt = "";
                if (typeof styleOverrideEl !== 'undefined' && styleOverrideEl) {
                    styleOverrideEl.value = "";
                }
                
                window.sheetsState = null;
                localStorage.removeItem("activeSheetData");
                let sheetSelector = document.getElementById("sheetCharacterSelector");
                if (sheetSelector) {
                    sheetSelector.value = "active";
                }
                setGenerationStatus("");
                window.activeCharacterId = null;
                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
                if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
            }
        );
    };

    window.clearAllSavedCharacters = async function () {
        if (confirm("Are you sure you want to delete ALL saved characters? This cannot be undone.")) {
            localStorage.removeItem("savedCharacters");
            await window.clearAllCharacterCache();
            window.activeCharacterId = null;
            if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
            if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
            await renderSidebar();
        }
    };

    window.updateCharacter = async function (id) {
        id = isNaN(Number(id)) ? id : Number(id);
        
        await window.syncActiveImagesToCache();
        
        let saved = JSON.parse(localStorage.savedCharacters || "[]");
        let idx = saved.findIndex(x => x.id === id);
        if (idx === -1) return;
        
        let charName = saved[idx].name;
        
        window.showConfirmDialog(
            `Are you sure you want to update <b>${charName}</b> with the current active description edits on the screen? This will permanently overwrite the saved character file.`,
            'warnOnUpdate',
            async () => {
                let d = getDetailsContext();
                let name = d.name || charName || "Unknown";
                
                await window.copyActiveCacheToCharacter(id);
                
                let imageDataUrl = window.selectedAvatarUrl || window.lastCharacterData?.imageDataUrl || saved[idx].imageDataUrl || "";
                
                let updatedData = {
                    name,
                    details: d,
                    sheetData: window.sheetsState || JSON.parse(localStorage.activeSheetData || "null") || null,
                    shortDescriptionText: getSectionText("shortDescription"),
                    shortDescriptionNotes: (document.getElementById("shortDescriptionNotesEl") || {}).value || "",
                    roleText: getSectionText("role"),
                    roleNotes: (document.getElementById("roleNotesEl") || {}).value || "",
                    personalityText: getSectionText("personality"),
                    personalityNotes: (document.getElementById("personalityNotesEl") || {}).value || "",
                    beliefsText: getSectionText("beliefs"),
                    beliefsNotes: (document.getElementById("beliefsNotesEl") || {}).value || "",
                    preferencesText: getSectionText("preferences"),
                    preferencesNotes: (document.getElementById("preferencesNotesEl") || {}).value || "",
                    abilitiesText: getSectionText("abilities"),
                    abilitiesNotes: (document.getElementById("abilitiesNotesEl") || {}).value || "",
                    relationsText: getSectionText("relations"),
                    relationsNotes: (document.getElementById("relationsNotesEl") || {}).value || "",
                    appearanceText: getSectionText("appearance"),
                    appearanceNotes: (document.getElementById("appearanceNotesEl") || {}).value || "",
                    backgroundText: getSectionText("background"),
                    backgroundNotes: (document.getElementById("backgroundNotesEl") || {}).value || "",
                    timelineText: getSectionText("timeline"),
                    timelineNotes: (document.getElementById("timelineNotesEl") || {}).value || "",
                    loreText: getSectionText("lore"),
                    loreNotes: (document.getElementById("loreNotesEl") || {}).value || "",
                    roleplayText: getSectionText("roleplay"),
                    roleplayNotes: (document.getElementById("roleplayNotesEl") || {}).value || "",
                    introScenarioText: getSectionText("introScenario"),
                    introStartText: getSectionText("introStart"),
                    introNotes: (document.getElementById("introNotesEl") || {}).value || "",
                    generatedText: assembleFullCharacterText(),
                    
                    selectedAvatarUrl: window.selectedAvatarUrl || "",
                    imageDataUrl,
                    visualStyleName: visualStyleEl.value,
                    setting: settingEl.value,
                    tone: getSelectedTones(),
                    overviewNotes: (document.getElementById("overviewNotesEl") || {}).value || "",
                    worldLore: (document.getElementById("worldLoreEl") || {}).value || "",
                    worldLoreImageUrl: localStorage.worldLoreImageUrl || "",
                    visualKeyphrasesText: window.lastCharacterData?.visualKeyphrasesText || saved[idx].visualKeyphrasesText || "",
                    overwrittenVisualKeyphrasesText: window.overwrittenVisualKeyphrasesText || saved[idx].overwrittenVisualKeyphrasesText || "",
                    overwrittenStylePrompt: window.overwrittenStylePrompt || saved[idx].overwrittenStylePrompt || "",
                    overwrittenIntroBgPrompt: window.overwrittenIntroBgPrompt || "",
                    overwrittenIntroCharPrompt: window.overwrittenIntroCharPrompt || "",
                    introBgImageUrl: localStorage.introBgImageUrl || "",
                    introCharImageUrl: localStorage.introCharImageUrl || "",
                    activeImages: (function() {
                        let imgUrls = [];
                        document.querySelectorAll("#imagesEl img").forEach(img => {
                            let src = img.getAttribute("data-src") || img.src;
                            if (src) imgUrls.push(src);
                        });
                        return imgUrls;
                    })(),
                };
                
                updatedData = window.translateActiveToCharKeys(updatedData, id);
                saved[idx] = Object.assign(saved[idx], updatedData);
                
                localStorage.savedCharacters = JSON.stringify(saved);
                window.activeCharacterId = id;
                if (window.saveActiveWorkspaceState) window.saveActiveWorkspaceState();
                if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();
                renderSidebar();
                
                // Show dynamic feedback toast notification
                let toast = document.createElement('div');
                toast.style = `
                    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
                    background: var(--accent-color); color: white; padding: 0.6rem 1.2rem;
                    border-radius: 8px; font-size: 85%; z-index: 999999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-weight: 500;
                    animation: fadeInConfirm 0.2s ease-out;
                `;
                toast.innerHTML = `✅ Updated character "${name}" successfully!`;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.style.animation = 'fadeInConfirm 0.2s ease-out reverse';
                    setTimeout(() => toast.remove(), 180);
                }, 2000);
            }
        );
    };

    // ─── INITIALIZE LOCAL STORAGE WARNING SETTINGS ───
    if (localStorage.warnOnClear === undefined) localStorage.warnOnClear = 'true';
    if (localStorage.warnOnLoad === undefined) localStorage.warnOnLoad = 'true';
    if (localStorage.warnOnUpdate === undefined) localStorage.warnOnUpdate = 'true';

    // Initial checkbox sync on startup
    setTimeout(() => {
        let clearChk = document.getElementById('settingClearConfirmEl');
        let loadChk = document.getElementById('settingLoadConfirmEl');
        let updateChk = document.getElementById('settingUpdateConfirmEl');
        let skipOverviewChk = document.getElementById('settingSkipOverviewConfirmEl');
        if (clearChk) clearChk.checked = localStorage.warnOnClear === 'true';
        if (loadChk) loadChk.checked = localStorage.warnOnLoad === 'true';
        if (updateChk) updateChk.checked = localStorage.warnOnUpdate === 'true';
        if (skipOverviewChk) skipOverviewChk.checked = localStorage.skipOverviewConfirm === 'true';
    }, 100);

    window.exportAsMarkdown = function () {
        let d = getDetailsContext();
        let name = d.name || "Unnamed Character";
        
        let md = [];
        md.push(`# ${name}`);
        md.push("");
        
        md.push("## 👤 Identity Details");
        md.push(`- Age: ${d.age || "Unknown"}`);
        md.push(`- Gender: ${d.gender || "Unknown"}`);
        md.push(`- Orientation: ${d.orientation || "Unknown"}`);
        md.push(`- Species/Race: ${d.species || d.race || "Unknown"}`);
        md.push(`- Ethnicity: ${d.ethnicity || "Unknown"}`);
        md.push("");
        
        let sections = [
            { id: "shortDescription", label: "Short Description" },
            { id: "appearance", label: "Appearance" },
            { id: "role", label: "Role" },
            { id: "personality", label: "Personality" },
            { id: "beliefs", label: "Beliefs & Morals" },
            { id: "preferences", label: "Preferences" },
            { id: "abilities", label: "Abilities" },
            { id: "relations", label: "Relations" },
            { id: "background", label: "Background" },
            { id: "timeline", label: "Timeline" },
            { id: "lore", label: "Lore Entries" },
            { id: "roleplay", label: "Roleplay Examples" },
            { id: "introScenario", label: "Roleplay Intro - Scenario Context" },
            { id: "introStart", label: "Roleplay Intro - Dialogue & Narration" }
        ];
        
        sections.forEach(s => {
            let text = getSectionText(s.id);
            if (text) {
                md.push(`## 📄 ${s.label}`);
                md.push(text);
                md.push("");
            }
        });
        
        let settingValue = typeof settingEl !== 'undefined' ? settingEl.value : "Any";
        let toneValues = getSelectedTones();
        md.push("## ⚙️ Generation Parameters");
        md.push(`- **Setting:** ${settingValue}`);
        md.push(`- **Tone:** ${toneValues.length > 0 ? toneValues.join(", ") : "Any"}`);
        md.push("");
        
        md.push("---");
        
        let fullText = md.join("\n");
        let blob = new Blob([fullText], { type: "text/markdown;charset=utf-8;" });
        let a = document.createElement("a");
        let safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "character";
        a.href = URL.createObjectURL(blob);
        a.download = `${safeName}-description.md`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    // ─── EXPORT AS ZIP ARCHIVE ─────────────────────────────────────────
    window.exportAsZip = async function () {
        let d = getDetailsContext();
        let name = d.name || "unnamed_character";
        let safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "") || "character";

        // --- Build character_description.md ---
        let md = [];
        md.push(`# ${name}`);
        md.push("");
        md.push("## Identity Details");
        md.push(`- Name: ${d.name || "Unknown"}`);
        md.push(`- Age: ${d.age || "Unknown"}`);
        md.push(`- Gender: ${d.gender || "Unknown"}`);
        md.push(`- Orientation: ${d.orientation || "Unknown"}`);
        md.push(`- Species/Race: ${d.species || d.race || "Unknown"}`);
        md.push(`- Ethnicity: ${d.ethnicity || "Unknown"}`);
        md.push("");
        let overviewText = (document.getElementById("overviewNotesEl") || {}).value || "";
        if (overviewText.trim()) {
            md.push("## Overview Notes");
            md.push(overviewText.trim());
            md.push("");
        }
        let sections = [
            { id: "shortDescription", label: "Short Description" },
            { id: "appearance", label: "Appearance" },
            { id: "role", label: "Role" },
            { id: "personality", label: "Personality" },
            { id: "beliefs", label: "Beliefs & Morals" },
            { id: "preferences", label: "Preferences" },
            { id: "abilities", label: "Abilities" },
            { id: "relations", label: "Relations" },
            { id: "background", label: "Background" },
            { id: "timeline", label: "Timeline" },
            { id: "roleplay", label: "Roleplay Examples" },
            { id: "introScenario", label: "Roleplay Intro - Scenario Context" },
            { id: "introStart", label: "Roleplay Intro - Dialogue & Narration" }
        ];
        sections.forEach(s => {
            let text = getSectionText(s.id);
            if (text) { md.push(`## ${s.label}`); md.push(text); md.push(""); }
        });
        let settingValue = typeof settingEl !== 'undefined' ? settingEl.value : "Any";
        let toneValues = getSelectedTones();
        md.push("## Generation Parameters");
        md.push(`- Setting: ${settingValue}`);
        md.push(`- Tone: ${toneValues.length > 0 ? toneValues.join(", ") : "Any"}`);
        md.push("");
        md.push("---");
        let characterMdText = md.join("\n");

        // --- Build world.md ---
        let worldLoreText = (document.getElementById("worldLoreEl") || {}).value || "";
        let worldNameFromField = (document.getElementById("worldNameEl") || {}).value || localStorage.worldName || "";
        let worldMdTitle = worldNameFromField ? `# ${worldNameFromField}` : `# World`;
        let worldMdText = `${worldMdTitle}\n\n${worldLoreText.trim() || "(No world lore generated yet.)"}`;

        // --- Build character lore JSON ---
        let loreJsonStr = compileLoreFromUI() || "{}";
        let loreFilename = `${safeName}_lore.json`;

        // --- Grab images ---
        let charImageUrl = window.selectedAvatarUrl || localStorage.selectedAvatarUrl || "";
        let worldImageUrl = localStorage.worldLoreImageUrl || "";

        // --- Determine world name for world image filename ---
        let worldSafeName = worldNameFromField
            ? worldNameFromField.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "") || "world"
            : "world";

        // Helper to convert a dataUrl to a Uint8Array
        function dataUrlToBytes(dataUrl) {
            let base64 = dataUrl.split(",")[1];
            let binaryStr = atob(base64);
            let bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
            return bytes;
        }

        // Helper to get image extension from dataUrl
        function getImageExt(dataUrl) {
            let m = dataUrl.match(/^data:image\/(\w+)/);
            return m ? m[1].replace("jpeg", "jpg") : "png";
        }

        // Try to use JSZip if available, otherwise fall back to individual downloads
        try {
            // Dynamically load JSZip from CDN
            if (typeof JSZip === "undefined") {
                await new Promise((resolve, reject) => {
                    let s = document.createElement("script");
                    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
                    s.onload = resolve;
                    s.onerror = reject;
                    document.head.appendChild(s);
                });
            }

            let zip = new JSZip();
            zip.file("character_description.md", characterMdText);
            zip.file("world.md", worldMdText);
            zip.file(loreFilename, loreJsonStr);

            if (charImageUrl && charImageUrl.startsWith("data:")) {
                let ext = getImageExt(charImageUrl);
                zip.file(`${safeName}.${ext}`, dataUrlToBytes(charImageUrl));
            }
            if (worldImageUrl && worldImageUrl.startsWith("data:")) {
                let ext = getImageExt(worldImageUrl);
                zip.file(`${worldSafeName}.${ext}`, dataUrlToBytes(worldImageUrl));
            }

            let zipBlob = await zip.generateAsync({ type: "blob" });
            let a = document.createElement("a");
            a.href = URL.createObjectURL(zipBlob);
            a.download = `${safeName}_archive.zip`;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (e) {
            console.warn("JSZip not available, falling back to individual downloads:", e);
            // Fallback: download each file individually
            function downloadText(text, filename, mimeType) {
                let blob = new Blob([text], { type: mimeType });
                let a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                a.click();
                URL.revokeObjectURL(a.href);
            }
            function downloadDataUrl(dataUrl, filename) {
                let a = document.createElement("a");
                a.href = dataUrl;
                a.download = filename;
                a.click();
            }
            downloadText(characterMdText, "character_description.md", "text/markdown");
            setTimeout(() => downloadText(worldMdText, "world.md", "text/markdown"), 300);
            setTimeout(() => downloadText(loreJsonStr, loreFilename, "application/json"), 600);
            if (charImageUrl) { setTimeout(() => downloadDataUrl(charImageUrl, `${safeName}.${getImageExt(charImageUrl)}`), 900); }
            if (worldImageUrl) { setTimeout(() => downloadDataUrl(worldImageUrl, `${worldSafeName}.${getImageExt(worldImageUrl)}`), 1200); }
            alert("JSZip library could not be loaded. Files will be downloaded individually.");
        }
    };


    var TypewriterStreamer = class TypewriterStreamer {
        constructor(element, options = {}) {
            this.element = element;
            this.speed = options.speed || 15; // default ms per character

            this.queue = [];
            this.typedText = "";
            this.isTyping = false;
            this.onComplete = options.onComplete || null;
            this.cursor = null;
            this.createCursor();
            
            this.completionPromise = new Promise(resolve => {
                this.resolveCompletion = resolve;
            });
        }

        createCursor() {
            this.cursor = document.createElement("span");
            this.cursor.className = "typed-cursor";
            this.cursor.innerHTML = "|";
            this.cursor.style.cssText = `
                color: var(--accent-color);
                font-weight: bold;
                display: inline-block;
                margin-left: 2px;
                animation: typedBlink 0.8s infinite;
            `;
            
            if (!document.getElementById("typedBlinkStyles")) {
                let style = document.createElement("style");
                style.id = "typedBlinkStyles";
                style.textContent = `
                    @keyframes typedBlink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        appendTargetText(fullText) {
            if (!fullText) return;
            let processedLength = this.typedText.length + this.queue.length;
            if (fullText.length > processedLength) {
                let newChars = fullText.slice(processedLength);
                this.queue.push(...newChars.split(""));
            }

            if (!this.isTyping && this.queue.length > 0) {
                this.startTyping();
            }
        }

        startTyping() {
            this.isTyping = true;
            this.tick();
        }

        tick() {
            if (this.queue.length === 0) {
                this.isTyping = false;
                if (this.cursor && this.cursor.parentNode) {
                    this.cursor.remove();
                }
                if (this.resolveCompletion) {
                    this.resolveCompletion();
                }
                if (this.onComplete) {
                    this.onComplete();
                }
                return;
            }

            let charsToType = 1;
            let currentSpeed = this.speed;

            if (this.queue.length > 150) {
                charsToType = 4;
                currentSpeed = 3;
            } else if (this.queue.length > 80) {
                charsToType = 3;
                currentSpeed = 5;
            } else if (this.queue.length > 30) {
                charsToType = 2;
                currentSpeed = 8;
            }

            for (let i = 0; i < charsToType; i++) {
                if (this.queue.length > 0) {
                    this.typedText += this.queue.shift();
                }
            }

            let counterpartId = null;
            if (this.element.id) {
                if (this.element.id.startsWith("rpTab-")) {
                    counterpartId = this.element.id.replace("rpTab-", "");
                } else {
                    counterpartId = "rpTab-" + this.element.id;
                }
            }
            let counterpart = counterpartId ? document.getElementById(counterpartId) : null;

            let isTextarea = this.element.tagName === "TEXTAREA" || this.element.tagName === "INPUT";
            if (isTextarea) {
                this.element.value = this.typedText + (this.queue.length > 0 ? "|" : "");
                this.element.scrollTop = this.element.scrollHeight;
                if (counterpart) {
                    counterpart.value = this.typedText + (this.queue.length > 0 ? "|" : "");
                    counterpart.scrollTop = counterpart.scrollHeight;
                }
            } else {
                let html = formatSectionText(sanitizeOutput(this.typedText));
                this.element.innerHTML = html;
                this.element.appendChild(this.cursor);
                if (counterpart) {
                    counterpart.innerHTML = html;
                    if (this.queue.length > 0) {
                        let counterpartCursor = this.cursor.cloneNode(true);
                        counterpart.appendChild(counterpartCursor);
                    }
                }
            }

            let mainContent = document.querySelector(".main-content");
            if (mainContent) {
                let isNearBottom = mainContent.scrollHeight - mainContent.scrollTop - mainContent.clientHeight < 120;
                if (isNearBottom) {
                    mainContent.scrollTop = mainContent.scrollHeight;
                }
            }

            setTimeout(() => this.tick(), currentSpeed);
        }

        destroy() {
            this.queue = [];
            this.isTyping = false;
            if (this.cursor && this.cursor.parentNode) {
                this.cursor.remove();
            }
            if (this.resolveCompletion) {
                this.resolveCompletion();
            }
        }
    }

    // ─── INIT ─────────────────────────────────────────────────────────
    updateSavedCountBadge();
    renderSidebar();
    loadDetails();
    window.loadLoreToUI(localStorage.loreText || "");
    setGenerationStatus("");
    
    // Restore active character ID
    window.activeCharacterId = localStorage.activeCharacterId ? (isNaN(Number(localStorage.activeCharacterId)) ? localStorage.activeCharacterId : Number(localStorage.activeCharacterId)) : null;
    
    // Restore generated sections
    try {
        let sections = JSON.parse(localStorage.activeCharacterSections || "{}");
        window.characterSections = sections;
        Object.keys(sections).forEach(s => {
            if (s === "lore") {
                window.loadLoreToUI(sections[s]);
            } else {
                setSectionOutput(s, formatSectionText(sections[s]));
            }
        });
    } catch(e) {
        console.warn("Failed to restore active character sections:", e);
    }
    
    // Restore chosen avatar
    window.selectedAvatarUrl = localStorage.selectedAvatarUrl || "";
    if (window.selectedAvatarUrl) {
        updateProfileAvatar(window.selectedAvatarUrl);
    }
    
    // Restore image generation prompt and keyphrases
    try {
        window.lastCharacterData = JSON.parse(localStorage.lastCharacterData || "null");
    } catch(e) {
        window.lastCharacterData = null;
    }
    window.overwrittenVisualKeyphrasesText = localStorage.overwrittenVisualKeyphrasesText || "";
    window.overwrittenStylePrompt = localStorage.overwrittenStylePrompt || "";
    if (typeof styleOverrideEl !== 'undefined' && styleOverrideEl) {
        if (window.overwrittenStylePrompt) {
            styleOverrideEl.value = window.overwrittenStylePrompt;
        } else {
            updateStyleOverridePlaceholder();
        }
    } else {
        updateStyleOverridePlaceholder();
    }
    
    // Restore active character prompts
    window.overwrittenIntroBgPrompt = localStorage.overwrittenIntroBgPrompt || "";
    window.overwrittenIntroCharPrompt = localStorage.overwrittenIntroCharPrompt || "";
    let introBgPromptEl = document.getElementById("introBgPromptEl");
    let introCharPromptEl = document.getElementById("introCharPromptEl");
    if (introBgPromptEl) introBgPromptEl.value = window.overwrittenIntroBgPrompt;
    if (introCharPromptEl) introCharPromptEl.value = window.overwrittenIntroCharPrompt;

    // Restore active character prompts & images
    (async () => {
        let introBg = document.getElementById("introImageBg");
        let rpTabIntroBg = document.getElementById("rpTab-introImageBg");
        let introCanvas = document.getElementById("introImageCharCanvas");
        let rpTabIntroCanvas = document.getElementById("rpTab-introImageCharCanvas");
        let hasPreview = false;
        
        if (localStorage.introBgImageUrl) {
            let resolved = await window.resolveCacheUrl(localStorage.introBgImageUrl);
            if (introBg) introBg.style.backgroundImage = `url(${resolved})`;
            if (rpTabIntroBg) rpTabIntroBg.style.backgroundImage = `url(${resolved})`;
            hasPreview = true;
        }
        if (localStorage.introCharImageUrl) {
            let resolved = await window.resolveCacheUrl(localStorage.introCharImageUrl);
            let img = new Image();
            img.onload = function() {
                let canvases = [introCanvas, rpTabIntroCanvas].filter(Boolean);
                canvases.forEach(c => {
                    c.width = img.width;
                    c.height = img.height;
                    let ctx = c.getContext("2d");
                    if (ctx) {
                        ctx.clearRect(0, 0, c.width, c.height);
                        ctx.drawImage(img, 0, 0);
                    }
                });
            };
            img.src = resolved;
            hasPreview = true;
        }
        let placeholder = document.getElementById("introImagePlaceholder");
        if (placeholder) {
            placeholder.style.display = hasPreview ? "none" : "flex";
        }
        let rpTabPlaceholder = document.getElementById("rpTab-introImagePlaceholder");
        if (rpTabPlaceholder) {
            rpTabPlaceholder.style.display = hasPreview ? "none" : "flex";
        }

        // Restore generated images
        try {
            let imgUrls = JSON.parse(localStorage.activeImages || "[]");
            let promptEl = document.getElementById("appearancePromptTextarea");
            let styleOverrideEl = document.getElementById("styleOverrideEl");
            
            window.overwrittenVisualKeyphrasesText = localStorage.overwrittenVisualKeyphrasesText || "";
            window.overwrittenStylePrompt = localStorage.overwrittenStylePrompt || "";
            
            if (promptEl) promptEl.value = window.overwrittenVisualKeyphrasesText || (window.lastCharacterData && window.lastCharacterData.visualKeyphrasesText) || "";
            if (styleOverrideEl) styleOverrideEl.value = window.overwrittenStylePrompt || "";
            updateStyleOverridePlaceholder();
            
            if (typeof imagesAreaEl !== 'undefined' && imagesAreaEl) {
                imagesAreaEl.style.display = "block";
            }
            
            if (imgUrls && imgUrls.length > 0) {
                let imageHtml = "";
                imgUrls.forEach(url => {
                    let isSelected = (url === window.selectedAvatarUrl) ? " selected-avatar" : "";
                    let wrapper = '<div class="image-card-wrapper' + isSelected + '">';
                    wrapper += '<img data-src="' + url + '" src="">';
                    wrapper += '<div class="image-card-actions">';
                    wrapper += '<button class="image-card-btn primary-btn chooseAvatarBtn" onclick="chooseAsProfileImage(this)"><i class="bi bi-person-bounding-box"></i> Use as Profile</button>';
                    wrapper += '</div></div>';
                    imageHtml += wrapper;
                });
                if (imagesEl) {
                    imagesEl.innerHTML = imageHtml;
                    await window.resolveLazyCacheImages(imagesEl);
                }
            } else {
                if (imagesEl) {
                    imagesEl.innerHTML = `
                        <div class="image-empty-placeholder" style="padding:2rem; text-align:center; opacity:0.5; font-size:85%; width:100%; box-sizing:border-box; border:1px dashed var(--panel-border); border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.4rem;">
                            <i class="bi bi-images" style="font-size:2rem; color:var(--accent-color);"></i>
                            <span>No character images generated yet. Use the controls above to generate portrait images.</span>
                        </div>
                    `;
                }
            }
        } catch(e) {
            console.warn("Failed to restore active character portraits:", e);
        }
    })();

    if (window.updateTopBarSaveButtons) window.updateTopBarSaveButtons();

    // ─── LOCAL STORAGE VALUE RESTORATION & DROPDOWN POPULATION (FROM HTML INLINE SCRIPTS) ───
    try {
        let wikiOverrideEl = document.getElementById("wikiOverrideEl");
        if (wikiOverrideEl) wikiOverrideEl.value = localStorage.wikiOverride || "";

        let overviewNotesEl = document.getElementById("overviewNotesEl");
        if (overviewNotesEl) overviewNotesEl.value = localStorage.overviewNotes || "";

        let worldNameEl = document.getElementById("worldNameEl");
        if (worldNameEl) worldNameEl.value = localStorage.worldName || "";

        let worldLoreNotesEl = document.getElementById("worldLoreNotesEl");
        if (worldLoreNotesEl) worldLoreNotesEl.value = localStorage.worldLoreNotes || "";

        let worldLoreEl = document.getElementById("worldLoreEl");
        if (worldLoreEl) {
            worldLoreEl.value = localStorage.worldLore || "";
            if (localStorage.worldLoreImageUrl) {
                let thumb = document.getElementById("worldLoreThumbEl");
                let container = document.getElementById("worldLoreImgContainer");
                if (thumb) thumb.style.backgroundImage = `url(${localStorage.worldLoreImageUrl})`;
                if (container) container.style.display = "flex";
                let bg = document.getElementById("worldLoreBgEl");
                if (bg) bg.style.backgroundImage = `url(${localStorage.worldLoreImageUrl})`;
            }
        }

        let worldLoreLengthEl = document.getElementById("worldLoreLengthEl");
        if (worldLoreLengthEl) worldLoreLengthEl.value = localStorage.worldLoreLength || worldLoreLengthEl.value || "medium";

        // shortDescriptionLengthEl removed

        let shortDescriptionNotesEl = document.getElementById("shortDescriptionNotesEl");
        if (shortDescriptionNotesEl) shortDescriptionNotesEl.value = localStorage.shortDescriptionNotes || "";

        let appearanceLengthEl = document.getElementById("appearanceLengthEl");
        if (appearanceLengthEl) appearanceLengthEl.value = localStorage.appearanceLength || appearanceLengthEl.value || "medium";

        let appearanceNotesEl = document.getElementById("appearanceNotesEl");
        if (appearanceNotesEl) appearanceNotesEl.value = localStorage.appearanceNotes || "";

        let visualStyleEl = document.getElementById("visualStyleEl");
        if (visualStyleEl) {
            if (typeof generateVisualStyleOptionsHtml === "function") {
                visualStyleEl.innerHTML = generateVisualStyleOptionsHtml();
            }
            visualStyleEl.value = localStorage.visualStyle || "Fantasy Portrait";
        }

        let imageCountEl = document.getElementById("imageCountEl");
        if (imageCountEl) imageCountEl.value = localStorage.imageCount || imageCountEl.value || "4";

        let roleLengthEl = document.getElementById("roleLengthEl");
        if (roleLengthEl) roleLengthEl.value = localStorage.roleLength || roleLengthEl.value || "medium";

        let roleNotesEl = document.getElementById("roleNotesEl");
        if (roleNotesEl) roleNotesEl.value = localStorage.roleNotes || "";

        let personalityLengthEl = document.getElementById("personalityLengthEl");
        if (personalityLengthEl) personalityLengthEl.value = localStorage.personalityLength || personalityLengthEl.value || "medium";

        let personalityNotesEl = document.getElementById("personalityNotesEl");
        if (personalityNotesEl) personalityNotesEl.value = localStorage.personalityNotes || "";

        let beliefsLengthEl = document.getElementById("beliefsLengthEl");
        if (beliefsLengthEl) beliefsLengthEl.value = localStorage.beliefsLength || beliefsLengthEl.value || "medium";

        let beliefsNotesEl = document.getElementById("beliefsNotesEl");
        if (beliefsNotesEl) beliefsNotesEl.value = localStorage.beliefsNotes || "";

        let preferencesLengthEl = document.getElementById("preferencesLengthEl");
        if (preferencesLengthEl) preferencesLengthEl.value = localStorage.preferencesLength || preferencesLengthEl.value || "medium";

        let preferencesNotesEl = document.getElementById("preferencesNotesEl");
        if (preferencesNotesEl) preferencesNotesEl.value = localStorage.preferencesNotes || "";

        let abilitiesLengthEl = document.getElementById("abilitiesLengthEl");
        if (abilitiesLengthEl) abilitiesLengthEl.value = localStorage.abilitiesLength || abilitiesLengthEl.value || "medium";

        let abilitiesNotesEl = document.getElementById("abilitiesNotesEl");
        if (abilitiesNotesEl) abilitiesNotesEl.value = localStorage.abilitiesNotes || "";

        let relationsLengthEl = document.getElementById("relationsLengthEl");
        if (relationsLengthEl) relationsLengthEl.value = localStorage.relationsLength || relationsLengthEl.value || "medium";

        let relationsNotesEl = document.getElementById("relationsNotesEl");
        if (relationsNotesEl) relationsNotesEl.value = localStorage.relationsNotes || "";

        let backgroundLengthEl = document.getElementById("backgroundLengthEl");
        if (backgroundLengthEl) backgroundLengthEl.value = localStorage.backgroundLength || backgroundLengthEl.value || "medium";

        let backgroundNotesEl = document.getElementById("backgroundNotesEl");
        if (backgroundNotesEl) backgroundNotesEl.value = localStorage.backgroundNotes || "";

        let timelineLengthEl = document.getElementById("timelineLengthEl");
        if (timelineLengthEl) timelineLengthEl.value = localStorage.timelineLength || timelineLengthEl.value || "medium";

        let timelineNotesEl = document.getElementById("timelineNotesEl");
        if (timelineNotesEl) timelineNotesEl.value = localStorage.timelineNotes || "";

        let loreNotesEl = document.getElementById("loreNotesEl");
        if (loreNotesEl) loreNotesEl.value = localStorage.loreNotes || "";

        let roleplayLengthEl = document.getElementById("roleplayLengthEl");
        if (roleplayLengthEl) roleplayLengthEl.value = localStorage.roleplayLength || roleplayLengthEl.value || "medium";

        let roleplayNotesEl = document.getElementById("roleplayNotesEl");
        if (roleplayNotesEl) roleplayNotesEl.value = localStorage.roleplayNotes || "";

        let introLengthEl = document.getElementById("introLengthEl");
        if (introLengthEl) introLengthEl.value = localStorage.introLength || introLengthEl.value || "medium";

        let introNotesEl = document.getElementById("introNotesEl");
        if (introNotesEl) introNotesEl.value = localStorage.introNotes || "";

        let ignorePerspectiveToggle = document.getElementById("ignorePerspectiveToggle");
        if (ignorePerspectiveToggle) {
            if (localStorage.getItem("ignorePerspective") !== null) {
                ignorePerspectiveToggle.checked = localStorage.ignorePerspective === "true";
            } else {
                ignorePerspectiveToggle.checked = true; // Default to true
            }
        }

        let settingBanEmDashEl = document.getElementById("settingBanEmDashEl");
        if (settingBanEmDashEl) settingBanEmDashEl.checked = localStorage.getItem("banEmDash") !== "false";

        let settingBanBoldingEl = document.getElementById("settingBanBoldingEl");
        if (settingBanBoldingEl) settingBanBoldingEl.checked = localStorage.getItem("banBolding") === "true";

        let settingCustomBannedEl = document.getElementById("settingCustomBannedEl");
        if (settingCustomBannedEl) settingCustomBannedEl.value = localStorage.customBanned || "";

        let galleryContentEl = document.getElementById('galleryContentEl');
        if (galleryContentEl && typeof root !== 'undefined' && root.image) {
            galleryContentEl.innerHTML = root.image(root.galleryOptions).evaluateItem;
        }

        // Initialize global length UI state on page load
        if (typeof setGlobalLength === "function") {
            setGlobalLength(localStorage.globalLength || "custom", true);
        }
    } catch(err) {
        console.warn("Error running DOM value restorations:", err);
    }

    setTimeout(createCommentsSectionHtml, 100);

