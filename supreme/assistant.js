// assistant.js

document.addEventListener("DOMContentLoaded", () => {
    const aiThinkingToggle = document.getElementById("aiThinkingToggleEl");
    if (aiThinkingToggle) {
        aiThinkingToggle.checked = false;
    }
    const chatInput = document.getElementById("chatInputEl");
    if (chatInput) {
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendAssistantMessage();
            }
        });
        
        chatInput.addEventListener("input", function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            if (this.value.trim() === "") {
                this.style.height = 'auto';
            }
        });
    }
});

function getAssistantContext() {
    let context = "Context:\n";
    // Check if sections have content (from app.js / character-generator.js logic)
    if (typeof getSectionText === "function") {
        const sections = ["role", "personality", "appearance", "background", "lore"];
        sections.forEach(sec => {
            let text = getSectionText(sec);
            if (text && text.trim().length > 0) {
                context += `[Character ${sec.toUpperCase()}]: ${text.trim()}\n`;
            }
        });
    }
    
    // Add world context if available
    let worldEl = document.getElementById("worldTextEl");
    if (worldEl && worldEl.value && worldEl.value.trim().length > 0) {
        context += `[World Setting]: ${worldEl.value.trim()}\n`;
    }
    
    return context;
}

function appendUserMessage(text) {
    const messagesEl = document.getElementById("chatMessagesEl");
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message user";
    wrapper.innerHTML = `<div class="message-bubble">${escapeHTML(text)}</div>`;
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function createAssistantMessageBlock() {
    const messagesEl = document.getElementById("chatMessagesEl");
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message assistant";
    
    // Thinking block
    const thinkingBlock = document.createElement("div");
    thinkingBlock.className = "thinking-block";
    thinkingBlock.innerHTML = `Thinking <div class="typing-indicator"><span></span><span></span><span></span></div>`;
    
    // Methodology block (hidden by default)
    const methodologyBlock = document.createElement("div");
    methodologyBlock.className = "methodology-content";
    thinkingBlock.appendChild(methodologyBlock);
    
    // Message bubble
    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.style.display = "none";
    
    wrapper.appendChild(thinkingBlock);
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    return { wrapper, thinkingBlock, methodologyBlock, bubble };
}

async function sendAssistantMessage() {
    const inputEl = document.getElementById("chatInputEl");
    const sendBtn = document.getElementById("chatSendBtnEl");
    const text = inputEl.value.trim();
    
    if (!text) return;
    
    inputEl.value = "";
    inputEl.style.height = 'auto';
    inputEl.disabled = true;
    sendBtn.disabled = true;
    
    appendUserMessage(text);
    const msgBlock = createAssistantMessageBlock();
    
    const context = getAssistantContext();
    
    try {
        // Phase 1: Assess Intention
        msgBlock.thinkingBlock.childNodes[0].nodeValue = "Assessing intent ";
        root.text = text;
        const intentInstruction = root.prompts.assistantPage.assessIntention.instruction.evaluateItem;
        
        let intentResult = await window.ai({ instruction: intentInstruction });
        let intentText = (intentResult.generatedText || intentResult.text || "").toLowerCase().trim();
        
        let intent = "text";
        if (intentText.includes("both")) intent = "both";
        else if (intentText.includes("image")) intent = "image";
        
        const enableThinking = document.getElementById("aiThinkingToggleEl") ? document.getElementById("aiThinkingToggleEl").checked : false;
        let methodology = "";
        
        if (enableThinking) {
            // Phase 2: Methodology
            msgBlock.thinkingBlock.childNodes[0].nodeValue = "Developing methodology ";
            root.context = context;
            root.text = text;
            const methodInstruction = root.prompts.assistantPage.methodology.instruction.evaluateItem;
            
            let methodResult = await window.ai({ instruction: methodInstruction });
            methodology = (methodResult.generatedText || methodResult.text || "").trim();
            
            msgBlock.methodologyBlock.textContent = methodology;
        } else {
            msgBlock.thinkingBlock.childNodes[0].nodeValue = "Generating ";
        }
        
        // Phase 3: Final Output
        msgBlock.thinkingBlock.style.display = "none"; // Hide thinking indicator once done
        msgBlock.bubble.style.display = "block";
        
        if (intent === "text" || intent === "both") {
            root.context = context;
            root.methodology = methodology;
            root.text = text;
            const finalInstruction = enableThinking
                ? root.prompts.assistantPage.finalOutputThinking.instruction.evaluateItem
                : root.prompts.assistantPage.finalOutputNoThinking.instruction.evaluateItem;
            
            await window.ai({
                instruction: finalInstruction,
                onChunk: function(data) {
                    msgBlock.bubble.innerHTML = escapeHTML(data.fullTextSoFar).replace(/\n/g, "<br>");
                    document.getElementById("chatMessagesEl").scrollTop = document.getElementById("chatMessagesEl").scrollHeight;
                }
            });
        }
        
        if (intent === "image" || intent === "both") {
            if (intent === "image") {
                msgBlock.bubble.innerHTML = `<em>Generating image...</em>`;
            } else {
                msgBlock.bubble.innerHTML += `<br><br><em>Generating image...</em>`;
            }
            
            // Generate Image Prompt
            root.context = context;
            root.text = text;
            const imgPromptInstruction = root.prompts.assistantPage.imagePrompt.instruction.evaluateItem;
            let imgPromptResult = await window.ai({ instruction: imgPromptInstruction });
            let finalImgPrompt = (imgPromptResult.generatedText || imgPromptResult.text || "").trim();
            
            let imgResult = await window.image(finalImgPrompt);
            
            if (intent === "image") {
                msgBlock.bubble.innerHTML = "";
            } else {
                msgBlock.bubble.innerHTML = msgBlock.bubble.innerHTML.replace('<em>Generating image...</em>', '');
            }
            
            if (imgResult.canvas) {
                imgResult.canvas.className = "message-image";
                msgBlock.bubble.appendChild(imgResult.canvas);
            } else if (imgResult.dataUrl) {
                const img = document.createElement("img");
                img.src = imgResult.dataUrl;
                img.className = "message-image";
                msgBlock.bubble.appendChild(img);
            }
        }
        
    } catch (e) {
        console.error("Assistant Error:", e);
        msgBlock.thinkingBlock.style.display = "none";
        msgBlock.bubble.style.display = "block";
        msgBlock.bubble.innerHTML = `<span style="color: #ff6b6b;">Error: ${e.message || "Failed to generate response."}</span>`;
    }
    
    inputEl.disabled = false;
    sendBtn.disabled = false;
    inputEl.focus();
    document.getElementById("chatMessagesEl").scrollTop = document.getElementById("chatMessagesEl").scrollHeight;
}

function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}
