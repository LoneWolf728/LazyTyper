// ==UserScript==
// @name         LazyTyper with Advanced Typos - Google Docs & Slides
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Types text in a human-like manner with advanced configurable typos, typing speed, and sentence breaks.
// @match        https://docs.google.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

if (window.location.href.includes("docs.google.com/document/d") || window.location.href.includes("docs.google.com/presentation/d")) {
    console.log("Document opened, LazyTyper with Advanced Typos available!");

    // Create menu items that match Google Docs style
    const lazyTyperButton = document.createElement("span");
    lazyTyperButton.textContent = "LazyTyper";
    lazyTyperButton.style.cursor = "pointer";
    lazyTyperButton.style.color = "#4285f4";
    lazyTyperButton.style.margin = "0 10px";
    lazyTyperButton.style.fontFamily = "Google Sans, Roboto, Arial, sans-serif";
    lazyTyperButton.style.fontSize = "14px";
    lazyTyperButton.style.fontWeight = "500";
    lazyTyperButton.style.display = "inline-block";
    lazyTyperButton.style.verticalAlign = "middle";

    const stopButton = document.createElement("span");
    stopButton.textContent = "Stop Typing";
    stopButton.style.cursor = "pointer";
    stopButton.style.color = "#ea4335";
    stopButton.style.margin = "0 10px";
    stopButton.style.fontFamily = "Google Sans, Roboto, Arial, sans-serif";
    stopButton.style.fontSize = "14px";
    stopButton.style.fontWeight = "500";
    stopButton.style.display = "none";
    stopButton.style.verticalAlign = "middle";

    // Find a good place to insert our menu items
    const helpMenu = document.getElementById("docs-help-menu");
    if (helpMenu) {
        helpMenu.parentNode.insertBefore(lazyTyperButton, helpMenu);
        helpMenu.parentNode.insertBefore(stopButton, lazyTyperButton.nextSibling);
    } else {
        // Fallback placement
        const menuBar = document.querySelector('.docs-menubar');
        if (menuBar) {
            menuBar.appendChild(lazyTyperButton);
            menuBar.appendChild(stopButton);
        }
    }

    let cancelTyping = false;
    let typingInProgress = false;
    let lowerBoundValue = 60;
    let upperBoundValue = 140;
    let sentenceBreakLowerBound = 30000;
    let sentenceBreakUpperBound = 120000;
    let typoFrequency = 0.05; // 5% chance of making a typo per character

    async function showOverlay() {
        // Create styled overlay
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)";
        overlay.style.backgroundColor = "#ffffff";
        overlay.style.padding = "24px";
        overlay.style.borderRadius = "8px";
        overlay.style.zIndex = "9999";
        overlay.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
        overlay.style.width = "400px";
        overlay.style.fontFamily = "Google Sans, Roboto, Arial, sans-serif";
        overlay.style.color = "#202124";
        overlay.style.boxSizing = "border-box";

        // Add title
        const title = document.createElement("h2");
        title.textContent = "LazyTyper Settings";
        title.style.margin = "0 0 16px 0";
        title.style.fontSize = "18px";
        title.style.fontWeight = "500";
        title.style.color = "#4285f4";
        overlay.appendChild(title);

        // Create container for textarea
        const textAreaContainer = document.createElement("div");
        textAreaContainer.style.marginBottom = "16px";
        textAreaContainer.style.width = "100%";
        overlay.appendChild(textAreaContainer);

        // Create textarea label
        const textAreaLabel = document.createElement("label");
        textAreaLabel.textContent = "Text to Type";
        textAreaLabel.style.display = "block";
        textAreaLabel.style.marginBottom = "8px";
        textAreaLabel.style.fontSize = "14px";
        textAreaLabel.style.color = "#5f6368";
        textAreaContainer.appendChild(textAreaLabel);

        // Create styled textarea
        const textField = document.createElement("textarea");
        textField.rows = "5";
        textField.style.width = "100%";
        textField.style.padding = "12px";
        textField.style.border = "1px solid #dadce0";
        textField.style.borderRadius = "4px";
        textField.style.boxSizing = "border-box";
        textField.style.resize = "vertical";
        textField.style.fontFamily = "inherit";
        textField.style.fontSize = "14px";
        textField.style.lineHeight = "1.5";
        textField.placeholder = "Enter your text here...";
        textAreaContainer.appendChild(textField);

        // Create a settings container with grid layout
        const settingsContainer = document.createElement("div");
        settingsContainer.style.display = "grid";
        settingsContainer.style.gridTemplateColumns = "1fr 1fr";
        settingsContainer.style.gap = "16px";
        settingsContainer.style.marginBottom = "24px";
        overlay.appendChild(settingsContainer);

        // Helper function to create labeled inputs
        function createLabeledInput(labelText, inputType, value, placeholder, parentElement) {
            const container = document.createElement("div");
            
            const label = document.createElement("label");
            label.textContent = labelText;
            label.style.display = "block";
            label.style.marginBottom = "8px";
            label.style.fontSize = "14px";
            label.style.color = "#5f6368";
            container.appendChild(label);
            
            const input = document.createElement("input");
            input.type = inputType;
            input.value = value;
            input.placeholder = placeholder;
            input.style.width = "100%";
            input.style.padding = "8px 12px";
            input.style.border = "1px solid #dadce0";
            input.style.borderRadius = "4px";
            input.style.fontSize = "14px";
            input.style.boxSizing = "border-box";
            container.appendChild(input);
            
            parentElement.appendChild(container);
            return input;
        }

        // Create all inputs with labels
        const lowerBoundInput = createLabeledInput("Typing Speed Min (ms)", "number", lowerBoundValue, 
            "Min typing delay", settingsContainer);
            
        const upperBoundInput = createLabeledInput("Typing Speed Max (ms)", "number", upperBoundValue, 
            "Max typing delay", settingsContainer);
            
        const sentenceBreakLowerInput = createLabeledInput("Break Min (ms)", "number", sentenceBreakLowerBound, 
            "Min sentence break", settingsContainer);
            
        const sentenceBreakUpperInput = createLabeledInput("Break Max (ms)", "number", sentenceBreakUpperBound, 
            "Max sentence break", settingsContainer);
        
        // Typo frequency in its own row
        const typoContainer = document.createElement("div");
        typoContainer.style.gridColumn = "1 / span 2";
        typoContainer.style.marginTop = "8px";
        settingsContainer.appendChild(typoContainer);
        
        const typoFrequencyInput = createLabeledInput("Typo Frequency (%)", "number", typoFrequency * 100, 
            "Chance of typos", typoContainer);

        // Create styled buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "flex-end";
        buttonContainer.style.gap = "12px";
        overlay.appendChild(buttonContainer);

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.style.padding = "10px 16px";
        cancelButton.style.border = "1px solid #dadce0";
        cancelButton.style.borderRadius = "4px";
        cancelButton.style.backgroundColor = "white";
        cancelButton.style.color = "#5f6368";
        cancelButton.style.cursor = "pointer";
        cancelButton.style.fontFamily = "inherit";
        cancelButton.style.fontSize = "14px";
        cancelButton.style.fontWeight = "500";
        buttonContainer.appendChild(cancelButton);

        const confirmButton = document.createElement("button");
        confirmButton.textContent = "Start Typing";
        confirmButton.style.padding = "10px 16px";
        confirmButton.style.border = "none";
        confirmButton.style.borderRadius = "4px";
        confirmButton.style.backgroundColor = "#4285f4";
        confirmButton.style.color = "white";
        confirmButton.style.cursor = "pointer";
        confirmButton.style.fontFamily = "inherit";
        confirmButton.style.fontSize = "14px";
        confirmButton.style.fontWeight = "500";
        buttonContainer.appendChild(confirmButton);

        document.body.appendChild(overlay);

        // Create overlay backdrop
        const backdrop = document.createElement("div");
        backdrop.style.position = "fixed";
        backdrop.style.top = "0";
        backdrop.style.left = "0";
        backdrop.style.width = "100%";
        backdrop.style.height = "100%";
        backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        backdrop.style.zIndex = "9998";
        document.body.appendChild(backdrop);

        return new Promise((resolve) => {
            confirmButton.addEventListener("click", () => {
                const userInput = textField.value;
                lowerBoundValue = parseInt(lowerBoundInput.value) || lowerBoundValue;
                upperBoundValue = parseInt(upperBoundInput.value) || upperBoundValue;
                sentenceBreakLowerBound = parseInt(sentenceBreakLowerInput.value) || sentenceBreakLowerBound;
                sentenceBreakUpperBound = parseInt(sentenceBreakUpperInput.value) || sentenceBreakUpperBound;
                typoFrequency = (parseFloat(typoFrequencyInput.value) || typoFrequency * 100) / 100;

                document.body.removeChild(overlay);
                document.body.removeChild(backdrop);
                resolve(userInput);
            });

            cancelButton.addEventListener("click", () => {
                document.body.removeChild(overlay);
                document.body.removeChild(backdrop);
                resolve(null);
            });
        });
    }

    // The rest of your existing functions remain the same
    async function typeWithRandomSentenceBreaksAndTypos(inputElement, text) {
        const sentences = text.match(/[^.!?]+[.!?]/g) || [text];
        console.log("Typing text:", text);

        for (const sentence of sentences) {
            for (let char of sentence) {
                if (cancelTyping) break;

                const randomDelay = Math.floor(Math.random() * (upperBoundValue - lowerBoundValue + 1)) + lowerBoundValue;

                if (Math.random() < typoFrequency) {
                    const typoSequence = generateTypos(char);
                    for (const typoChar of typoSequence) {
                        await simulateTyping(inputElement, typoChar, randomDelay);
                    }
                    // Backspace to correct the typo
                    for (let i = 0; i < typoSequence.length; i++) {
                        await simulateTyping(inputElement, "Backspace", 100);
                    }
                }

                await simulateTyping(inputElement, char, randomDelay);
            }

            if (cancelTyping) break;
            const sentenceBreakDelay = Math.floor(Math.random() * (sentenceBreakUpperBound - sentenceBreakLowerBound + 1)) + sentenceBreakLowerBound;
            console.log(`Random break after sentence: ${sentenceBreakDelay}ms`);
            await new Promise(resolve => setTimeout(resolve, sentenceBreakDelay));
        }

        typingInProgress = false;
        stopButton.style.display = "none";
    }

    function generateTypos(correctChar) {
        const typoLength = Math.random() < 0.5 ? 1 : 2; // Randomly decide if 1 or 2 extra typos will be made
        const typoChars = [];

        for (let i = 0; i < typoLength; i++) {
            let randomChar;
            do {
                randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random lowercase letter
            } while (randomChar === correctChar); // Avoid generating the correct char as a typo
            typoChars.push(randomChar);
        }
        return typoChars;
    }

    async function simulateTyping(inputElement, char, delay) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (cancelTyping) {
                    resolve();
                    return;
                }

                let eventObj;
                if (char === "Backspace") {
                    eventObj = new KeyboardEvent("keydown", {
                        bubbles: true,
                        key: "Backspace",
                        code: "Backspace",
                        keyCode: 8,
                    });
                } else {
                    eventObj = new KeyboardEvent("keypress", {
                        bubbles: true,
                        key: char,
                        charCode: char.charCodeAt(0),
                        keyCode: char.charCodeAt(0),
                    });
                }

                inputElement.dispatchEvent(eventObj);
                console.log(`Typed: ${char}, Delay: ${delay}ms`);
                resolve();
            }, delay);
        });
    }

    lazyTyperButton.addEventListener("click", async () => {
        if (typingInProgress) {
            console.log("Typing in progress, please wait...");
            return;
        }

        cancelTyping = false;
        stopButton.style.display = "inline";

        const userInput = await showOverlay();
        if (userInput) {
            typingInProgress = true;
            const input = document.querySelector(".docs-texteventtarget-iframe").contentDocument.activeElement;
            typeWithRandomSentenceBreaksAndTypos(input, userInput);
        } else {
            stopButton.style.display = "none";
        }
    });

    stopButton.addEventListener("click", () => {
        cancelTyping = true;
        console.log("Typing canceled.");
        typingInProgress = false;
        stopButton.style.display = "none";
    });
}
else {
    console.log("Document not open, LazyTyper not available.");
}
