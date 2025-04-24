document.addEventListener('DOMContentLoaded', function() {
    console.log("Chat.js is loaded and running...");
    
    // First, add the chat container to the HTML if it doesn't exist
    if (!document.getElementById('chat-container')) {
        const chatHTML = `
        <div id="chat-container" class="chat-container" style="display:none;">
            <div class="chat-header">
                <div class="chat-title">ZANE GPT</div>
                <button id="close-chat" class="close-chat">×</button>
            </div>
            <div id="chat-messages" class="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" id="chat-input" class="chat-input" placeholder="Type a message...">
                <button id="send-message" class="send-message">Send</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }
    
    // Get all required elements
    const chatContainer = document.getElementById('chat-container');
    const messageButton = document.getElementById('message-button');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    
    // Check if all elements exist
    console.log("Chat elements found:", {
        chatContainer: !!chatContainer, 
        messageButton: !!messageButton,
        closeChat: !!closeChat,
        chatMessages: !!chatMessages,
        chatInput: !!chatInput,
        sendButton: !!sendButton
    });
    
    // Welcome message
    const welcomeMessage = "Hi there! I'm ZANE GPT. Type 'message mode' if you want to send a message directly to ZANE, or chat with me normally.";
    
    // Track conversation mode and user information
    let directMessageMode = false;
    let askingForName = false;
    let userName = "";
    
    // Simple responses for the AI
    const responses = {
        greeting: [
            "Hey there! What can I help you with today?", 
            "Hi! How are you doing?",
            "Hello! Nice to chat with you!"
        ],
        creator: [
            "I'm coded by ZANE! He specializes in creating custom websites and software.",
            "ZANE created this chat! He's a developer who makes custom websites and applications.",
            "I was made by ZANE! He's available on Instagram and Discord @zane_0xo."
        ],
        contact: [
            "You can contact ZANE at @zane_0xo on Instagram or Discord for custom websites and apps!",
            "ZANE is available at Instagram or Discord @zane_0xo for development work.",
            "ZANE's contact: Instagram or Discord @zane_0xo - he specializes in custom development."
        ],
        roblox: [
            "I love Roblox! What games do you play?",
            "Roblox is awesome! Do you have a favorite game?",
            "Gaming is so fun! What other games do you enjoy besides Roblox?"
        ],
        question: [
            "What else would you like to know?",
            "Anything specific you'd like to talk about?",
            "I'm here to chat! What's on your mind?"
        ],
        default: [
            "Tell me more about what you're interested in!",
            "What else would you like to talk about?",
            "I'm here to chat about anything you'd like!"
        ],
        message_mode: [
            "What's your name? I'd like to let ZANE know who's sending the message.",
            "Before I forward your messages to ZANE, could you tell me your name?",
            "To help ZANE respond better, could you share your name first?"
        ],
        switch_mode: [
            "Type 'message mode' if you want to send messages directly to ZANE.",
            "Want to send a message to ZANE? Type 'message mode' to switch.",
            "If you need to contact ZANE directly, type 'message mode'."
        ],
        ask_name: [
            "What's your name? This will help ZANE know who he's talking to.",
            "Before sending your message, could you tell me your name?",
            "To help ZANE respond better, could you share your name first?"
        ],
        confirm_name: [
            "Thanks, {name}! Now, what would you like to tell ZANE?",
            "Great, {name}! What message would you like me to forward to ZANE?",
            "Perfect, {name}! What would you like me to tell ZANE for you?"
        ]
    };
    
    // Keep track of sent message types to avoid repetition
    const sentMessageTypes = {
        greeting: false,
        creator: false,
        contact: false,
        roblox: false,
        question: false,
        default: false
    };
    
    // Function to add a message to the chat
    function addMessage(text, sender) {
        console.log(`Adding ${sender} message:`, text);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        console.log("Showing typing indicator");
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot', 'typing');
        typingElement.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.classList.add('typing-dot');
            typingElement.appendChild(dot);
        }
        
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to hide typing indicator
    function hideTypingIndicator() {
        console.log("Hiding typing indicator");
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Track conversation to avoid repetition
    let lastMessageType = null;
    let messageCount = 0;
    
    // Function to get AI response (simplified)
    async function getAIResponse(userMessage) {
        try {
            showTypingIndicator();
            
            // Simulate typing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simple keyword-based response
            const message = userMessage.toLowerCase();
            let messageType;
            let response;
            
            // Special command to write a paragraph and stop
            if (message.includes('write paragraph') || message.includes('write a paragraph') || message === 'no') {
                hideTypingIndicator();
                
                // Create a dedicated element for the paragraph that will be typed out
                const paragraphElement = document.createElement('div');
                paragraphElement.classList.add('message', 'bot', 'paragraph');
                paragraphElement.id = 'typing-paragraph';
                paragraphElement.textContent = '';
                chatMessages.appendChild(paragraphElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // The paragraph to be typed out
                const paragraph = "Hey, I'm Zane from the USA 🇺🇸. I do all things coding – C++, Java, Ruby, PHP, Python, HTML, CSS, JavaScript, Lua. Full-stack developer at your service.";
                
                // Type out the paragraph character by character
                let charIndex = 0;
                const typingInterval = setInterval(() => {
                    if (charIndex < paragraph.length) {
                        paragraphElement.textContent += paragraph.charAt(charIndex);
                        charIndex++;
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    } else {
                        // When finished typing, clear the interval
                        clearInterval(typingInterval);
                        
                        // Add a completion message
                        setTimeout(() => {
                            const completionElement = document.createElement('div');
                            completionElement.classList.add('message', 'bot');
                            completionElement.textContent = "Paragraph complete. Is there anything else you'd like me to help you with?";
                            chatMessages.appendChild(completionElement);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }, 1000);
                    }
                }, 50); // Typing speed - adjust as needed
                
                return null; // Return null since we're handling the message display differently
            }
            // Check for mode switching commands
            else if (message.includes('message mode') || message.includes('switch to message') || message.includes('message zane')) {
                directMessageMode = true;
                askingForName = true;
                userName = "";
                messageType = 'ask_name';
            }
            else if (message.includes('switch mode') || message.includes('normal mode') || message.includes('chat mode')) {
                directMessageMode = false;
                askingForName = false;
                messageType = 'switch_mode';
            }
            // If in direct message mode, handle accordingly
            else if (directMessageMode) {
                // If we're asking for the name, capture it now
                if (askingForName) {
                    userName = userMessage.trim();
                    askingForName = false;
                    
                    // Format the confirmation message with user's name
                    const index = Math.floor(Math.random() * responses.confirm_name.length);
                    return responses.confirm_name[index].replace('{name}', userName);
                }
                
                // Send message to Discord webhook with user name
                fetch('https://discord.com/api/webhooks/1282821531961000017/56r3vhyWh-u82fbLYVZBS9CwFTPEbUvYPVCMzx50YFq2OqDi1mNqpF9lCVbt8lr7QA39', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        embeds: [{
                            title: `Message from ${userName || 'Website Visitor'}`,
                            description: userMessage,
                            color: 3447003,
                            fields: [
                                {
                                    name: "Time",
                                    value: new Date().toLocaleString(),
                                    inline: true
                                },
                                {
                                    name: "Browser",
                                    value: navigator.userAgent.split(' ').slice(-1)[0],
                                    inline: true
                                }
                            ],
                            footer: {
                                text: "From Roblox Profile Page"
                            }
                        }],
                        username: 'ZANE Website Chat'
                    })
                }).catch(error => console.error('Error sending to Discord:', error));
                
                // Always confirm the message was sent
                return `Thanks ${userName}! I've sent your message to ZANE! He'll get back to you soon. You're still in message mode, type 'switch mode' to exit.`;
            }
            // Normal chat mode responses
            else {
                // Determine message type based on keywords
                if (message.includes('who') && (message.includes('made') || message.includes('created') || message.includes('develop'))) {
                    messageType = 'creator';
                }
                else if (message.includes('contact') || message.includes('instagram') || message.includes('discord')) {
                    messageType = 'contact';
                }
                else if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
                    messageType = 'greeting';
                } 
                else if (message.includes('roblox') || message.includes('game') || message.includes('play')) {
                    messageType = 'roblox';
                } 
                else if (message.includes('?') || message.includes('what') || message.includes('how') || message.includes('why')) {
                    messageType = 'question';
                }
                else {
                    messageType = 'default';
                }
                
                // Occasionally suggest message mode
                if (messageCount > 0 && messageCount % 5 === 0) {
                    messageType = 'switch_mode';
                }
            }
            
            // Avoid repeating the same message type consecutively
            if (messageType === lastMessageType && messageType !== 'message_mode' && messageType !== 'switch_mode' && messageType !== 'ask_name') {
                // If we've repeated the same type, switch to a different response type
                if (messageCount % 3 === 0) {
                    messageType = 'creator';
                } else {
                    messageType = messageCount % 2 === 0 ? 'question' : 'default';
                }
            }
            
            // Get a random response from the selected type
            const index = Math.floor(Math.random() * responses[messageType].length);
            response = responses[messageType][index];
            
            // Update tracking
            lastMessageType = messageType;
            messageCount++;
            
            return response;
        } 
        catch (error) {
            console.error("Error in getAIResponse:", error);
            return "Something went wrong. Let's talk about something else!";
        } 
        finally {
            if (!userMessage.toLowerCase().includes('write paragraph') && 
                !userMessage.toLowerCase().includes('write a paragraph') && 
                userMessage.toLowerCase() !== 'no') {
                hideTypingIndicator();
            }
        }
    }
    
    // Function to handle sending messages
    async function sendMessage() {
        console.log("sendMessage function called");
        const message = chatInput.value.trim();
        
        if (message) {
            console.log("Sending message:", message);
            
            // Add user message to chat
            addMessage(message, 'user');
            
            // Only send to Discord webhook when NOT in direct message mode
            // (direct message mode handles its own webhook sending with user name)
            if (!directMessageMode && !askingForName) {
                console.log("Sending regular chat webhook");
                fetch('https://discord.com/api/webhooks/1282821531961000017/56r3vhyWh-u82fbLYVZBS9CwFTPEbUvYPVCMzx50YFq2OqDi1mNqpF9lCVbt8lr7QA39', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        embeds: [{
                            title: "Regular Chat Message",
                            description: message,
                            color: 3447003,
                            fields: [
                                {
                                    name: "Time",
                                    value: new Date().toLocaleString(),
                                    inline: true
                                },
                                {
                                    name: "Browser",
                                    value: navigator.userAgent.split(' ').slice(-1)[0],
                                    inline: true
                                }
                            ],
                            footer: {
                                text: "From Roblox Profile Page - Regular Chat"
                            }
                        }],
                        username: 'ZANE Website Chat'
                    })
                }).catch(error => console.error('Error sending to Discord:', error));
            }
            
            // Clear input
            chatInput.value = '';
            
            // Get AI response
            const aiResponse = await getAIResponse(message);
            
            // Only add the response message if it's not null
            // (null is returned when we handle the typing paragraph separately)
            if (aiResponse !== null) {
                addMessage(aiResponse, 'bot');
            }
        }
    }
    
    // Event: Open chat
    if (messageButton) {
        messageButton.addEventListener('click', function() {
            console.log("Message button clicked");
            chatContainer.style.display = 'flex';
            
            // Add welcome message if chat is empty
            if (chatMessages.children.length === 0) {
                addMessage(welcomeMessage, 'bot');
            }
        });
    }
    
    // Event: Close chat
    if (closeChat) {
        closeChat.addEventListener('click', function() {
            console.log("Close button clicked");
            chatContainer.style.display = 'none';
        });
    }
    
    // Event: Send button click
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            console.log("Send button clicked");
            sendMessage();
        });
    }
    
    // Event: Enter key press in input
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log("Enter key pressed");
                sendMessage();
            }
        });
    }
    
    console.log("Chat setup complete");
});