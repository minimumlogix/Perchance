/**
 * @file assistant-prompt.js
 * @description Exposes prompt compilation logic for the AI Assistant interface.
 * Defines intent assessment, methodology, and thinking/non-thinking generation prompts.
 */

(function () {
    window.prompts = window.prompts || {};

    /**
     * Helper to wrap a prompt compiler function in an object that implements
     * the Perchance-like .evaluateItem and native .toString() interfaces.
     * @param {function} compileFn 
     * @returns {object}
     */
    function makeInstruction(compileFn) {
        return {
            get evaluateItem() {
                return compileFn();
            },
            toString: function () {
                return compileFn();
            }
        };
    }

    // ==========================================
    // ASSISTANT PAGE PROMPTS
    // ==========================================

    window.prompts.assistantPage = {
        assessIntention: {
            instruction: makeInstruction(() => {
                let text = (window.root && window.root.text) || "";
                return window.prompts.assistantPage.assessIntention.compile(text);
            }),
            compile: function (text) {
                return "You are a router. Based on the user request, output strictly ONE WORD from this list: \"image\", \"text\", \"both\". If they ask to see, draw, or generate an image/portrait, output \"image\" or \"both\". Otherwise output \"text\".\nUser Request: " + text;
            }
        },

        methodology: {
            instruction: makeInstruction(() => {
                let personalityList = (window.root && window.root.assistantPersonality) || [];
                let assistantPersonality = typeof personalityList.joinItems === "function" ? personalityList.joinItems(" ") : String(personalityList);
                let context = (window.root && window.root.context) || "";
                let text = (window.root && window.root.text) || "";
                return window.prompts.assistantPage.methodology.compile(assistantPersonality, context, text);
            }),
            compile: function (assistantPersonality, context, text) {
                let personalityStr = "";
                if (Array.isArray(assistantPersonality)) {
                    personalityStr = assistantPersonality.join(" ");
                } else if (assistantPersonality && typeof assistantPersonality.joinItems === "function") {
                    personalityStr = assistantPersonality.joinItems(" ");
                } else {
                    personalityStr = String(assistantPersonality || "");
                }
                return "CRITICAL IDENTITY & DIRECTIVE: You are the Supreme Character Generator AI Assistant co-writer. The 'Supreme Character Generator' is an application for designing, editing, and compiling structured roleplay character profiles and world settings. " + personalityStr + " Generate a brief step-by-step methodology to fulfill this user request. Only output the steps.\n" + context + "\nRequest: " + text;
            }
        },

        finalOutputThinking: {
            instruction: makeInstruction(() => {
                let personalityList = (window.root && window.root.assistantPersonality) || [];
                let assistantPersonality = typeof personalityList.joinItems === "function" ? personalityList.joinItems(" ") : String(personalityList);
                let context = (window.root && window.root.context) || "";
                let methodology = (window.root && window.root.methodology) || "";
                let text = (window.root && window.root.text) || "";
                return window.prompts.assistantPage.finalOutputThinking.compile(assistantPersonality, context, methodology, text);
            }),
            compile: function (assistantPersonality, context, methodology, text) {
                let personalityStr = "";
                if (Array.isArray(assistantPersonality)) {
                    personalityStr = assistantPersonality.join(" ");
                } else if (assistantPersonality && typeof assistantPersonality.joinItems === "function") {
                    personalityStr = assistantPersonality.joinItems(" ");
                } else {
                    personalityStr = String(assistantPersonality || "");
                }
                return "CRITICAL IDENTITY & DIRECTIVE: You are the Supreme Character Generator AI Assistant co-writer. The 'Supreme Character Generator' is an application for designing, editing, and compiling structured roleplay character profiles and world settings. " + personalityStr + " Fulfill the user request based on the methodology.\n" + context + "\nMethodology: " + methodology + "\nUser Request: " + text;
            }
        },

        finalOutputNoThinking: {
            instruction: makeInstruction(() => {
                let personalityList = (window.root && window.root.assistantPersonality) || [];
                let assistantPersonality = typeof personalityList.joinItems === "function" ? personalityList.joinItems(" ") : String(personalityList);
                let context = (window.root && window.root.context) || "";
                let text = (window.root && window.root.text) || "";
                return window.prompts.assistantPage.finalOutputNoThinking.compile(assistantPersonality, context, text);
            }),
            compile: function (assistantPersonality, context, text) {
                let personalityStr = "";
                if (Array.isArray(assistantPersonality)) {
                    personalityStr = assistantPersonality.join(" ");
                } else if (assistantPersonality && typeof assistantPersonality.joinItems === "function") {
                    personalityStr = assistantPersonality.joinItems(" ");
                } else {
                    personalityStr = String(assistantPersonality || "");
                }
                return "CRITICAL IDENTITY & DIRECTIVE: You are the Supreme Character Generator AI Assistant co-writer. The 'Supreme Character Generator' is an application for designing, editing, and compiling structured roleplay character profiles and world settings. " + personalityStr + " Fulfill the user request.\n" + context + "\nUser Request: " + text;
            }
        },

        imagePrompt: {
            instruction: makeInstruction(() => {
                let context = (window.root && window.root.context) || "";
                let text = (window.root && window.root.text) || "";
                return window.prompts.assistantPage.imagePrompt.compile(context, text);
            }),
            compile: function (context, text) {
                return "Write a succinct image generation prompt for text-to-image AI based on the user request. Describe the visuals clearly. Only output the prompt.\n" + context + "\nRequest: " + text;
            }
        }
    };
})();
