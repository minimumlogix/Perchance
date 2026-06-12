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
        const sections = ["shortDescription", "role", "personality", "beliefs", "preferences", "abilities", "relations", "appearance", "background", "timeline", "lore"];
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

function renderMarkdown(text) {
    if (window.marked && typeof window.marked.parse === 'function') {
        window.marked.setOptions({
            breaks: true,
            gfm: true
        });
        return window.marked.parse(text);
    }
    // Fallback: simple escapes & basic markdown parsing
    return escapeHTML(text)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

function copyMessageText(btn) {
    const messageEl = btn.closest('.chat-message');
    const bubble = messageEl.querySelector('.message-bubble');
    const rawText = bubble ? (bubble.getAttribute('data-raw-text') || bubble.innerText) : '';
    
    navigator.clipboard.writeText(rawText).then(() => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = "bi bi-check2";
        }
        btn.style.backgroundColor = "var(--accent-color, #7c3aed)";
        btn.style.color = "white";
        btn.style.borderColor = "var(--accent-color, #7c3aed)";
        setTimeout(() => {
            if (icon) {
                icon.className = "bi bi-copy";
            }
            btn.style.backgroundColor = "";
            btn.style.color = "";
            btn.style.borderColor = "";
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

function clearAssistantChat() {
    if (confirm("Are you sure you want to clear the chat history?")) {
        const messagesEl = document.getElementById("chatMessagesEl");
        if (messagesEl) {
            messagesEl.innerHTML = `
                <div class="chat-message assistant">
                    <div class="message-bubble" data-raw-text="Hello! I am your AI Assistant. I can help you craft characters, build worlds, or generate images based on your current project. What do you need?">Hello! I am your AI Assistant. I can help you craft characters, build worlds, or generate images based on your current project. What do you need?</div>
                    <button class="copy-msg-btn" onclick="copyMessageText(this)" title="Copy message"><i class="bi bi-copy"></i></button>
                </div>
            `;
        }
    }
}

// Expose functions to window scope for HTML onclick access
window.copyMessageText = copyMessageText;
window.clearAssistantChat = clearAssistantChat;

function appendUserMessage(text) {
    const messagesEl = document.getElementById("chatMessagesEl");
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message user";
    wrapper.innerHTML = `
        <div class="message-bubble" data-raw-text="${escapeHTML(text)}">${escapeHTML(text)}</div>
        <button class="copy-msg-btn" onclick="copyMessageText(this)" title="Copy message"><i class="bi bi-copy"></i></button>
    `;
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
    
    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-msg-btn";
    copyBtn.style.display = "none";
    copyBtn.title = "Copy message";
    copyBtn.setAttribute("onclick", "copyMessageText(this)");
    copyBtn.innerHTML = `<i class="bi bi-copy"></i>`;
    
    wrapper.appendChild(thinkingBlock);
    wrapper.appendChild(bubble);
    wrapper.appendChild(copyBtn);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    return { wrapper, thinkingBlock, methodologyBlock, bubble, copyBtn };
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
                    msgBlock.bubble.setAttribute('data-raw-text', data.fullTextSoFar);
                    msgBlock.bubble.innerHTML = renderMarkdown(data.fullTextSoFar);
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
            
            // For image/both, if there's no raw text set yet, set the image prompt as raw text
            if (!msgBlock.bubble.getAttribute('data-raw-text')) {
                msgBlock.bubble.setAttribute('data-raw-text', finalImgPrompt);
            }
        }
        
        // Show copy button once generation is completed successfully
        msgBlock.copyBtn.style.display = "flex";
        
    } catch (e) {
        console.error("Assistant Error:", e);
        msgBlock.thinkingBlock.style.display = "none";
        msgBlock.bubble.style.display = "block";
        msgBlock.bubble.innerHTML = `<span style="color: #ff6b6b;">Error: ${e.message || "Failed to generate response."}</span>`;
        msgBlock.copyBtn.style.display = "none";
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
