// ==========================================
// PINEY DIGITAL - AI ASSISTANT CHAT WIDGET
// ==========================================

(function() {
    // Configuration
    const ASSISTANT_URL = 'https://pineydigital-production.up.railway.app';
    const STORAGE_KEY = 'piney_chat_conversation';
    const SESSION_KEY = 'piney_chat_session_id';

    // Generate or retrieve session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem(SESSION_KEY);
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(SESSION_KEY, sessionId);
        }
        return sessionId;
    }

    // Get conversation history from localStorage
    function getConversationHistory() {
        try {
            const history = localStorage.getItem(STORAGE_KEY);
            return history ? JSON.parse(history) : [];
        } catch (e) {
            console.error('Error loading conversation history:', e);
            return [];
        }
    }

    // Save conversation to localStorage
    function saveConversation(messages) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {
            console.error('Error saving conversation:', e);
        }
    }

    // Clear conversation
    function clearConversation() {
        localStorage.removeItem(STORAGE_KEY);
    }

    // Create chat widget HTML
    function createChatWidget() {
        const widgetHTML = `
            <div id="piney-chat-widget">
                <!-- Chat Toggle Button -->
                <button id="piney-chat-toggle" class="piney-chat-button" aria-label="Chat with Piney AI">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span class="piney-chat-badge">Ask AI</span>
                </button>

                <!-- Chat Window -->
                <div id="piney-chat-window" class="piney-chat-window hidden">
                    <!-- Chat Header -->
                    <div class="piney-chat-header">
                        <div class="piney-chat-header-info">
                            <span class="piney-chat-title">Piney AI Assistant</span>
                            <span class="piney-chat-subtitle">Online & ready to help</span>
                        </div>
                        <div class="piney-chat-actions">
                            <button id="piney-chat-clear" class="piney-chat-icon-btn" title="Clear conversation">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                            <button id="piney-chat-close" class="piney-chat-icon-btn" title="Close chat">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Chat Messages -->
                    <div id="piney-chat-messages" class="piney-chat-messages">
                        <div class="piney-chat-welcome">
                            <p>Hi! I'm Piney AI. Ask me about:</p>
                            <ul>
                                <li>Website packages & pricing</li>
                                <li>Piney Outreach system</li>
                                <li>SEO & Google ranking</li>
                                <li>Technical questions</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Chat Input -->
                    <div class="piney-chat-input-area">
                        <form id="piney-chat-form">
                            <input
                                type="text"
                                id="piney-chat-input"
                                class="piney-chat-input"
                                placeholder="Type your message..."
                                autocomplete="off"
                            />
                            <button type="submit" id="piney-chat-send" class="piney-chat-send">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    // Add message to chat
    function addMessage(content, isUser = false, isLoading = false) {
        const messagesContainer = document.getElementById('piney-chat-messages');
        const welcomeEl = messagesContainer.querySelector('.piney-chat-welcome');
        if (welcomeEl) welcomeEl.remove();

        const messageEl = document.createElement('div');
        messageEl.className = `piney-message ${isUser ? 'piney-message-user' : 'piney-message-ai'} ${isLoading ? 'piney-message-loading' : ''}`;

        if (isLoading) {
            messageEl.innerHTML = `
                <div class="piney-typing">
                    <span></span><span></span><span></span>
                </div>
            `;
        } else {
            messageEl.innerHTML = isUser
                ? `<div class="piney-message-content">${escapeHtml(content)}</div>`
                : `<div class="piney-message-content">${content}</div>`;
        }

        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageEl;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Send message to AI assistant
    async function sendMessage(message) {
        const history = getConversationHistory();
        const sessionId = getSessionId();

        // Add user message to UI
        addMessage(message, true);

        // Add to history
        history.push({ role: 'user', content: message });

        // Show typing indicator
        const loadingEl = addMessage('', false, true);

        try {
            const response = await fetch(`${ASSISTANT_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: sessionId
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const aiResponse = data.message || "I'm not sure about that. Can you ask about our services?";

            // Remove loading indicator
            loadingEl.remove();

            // Add AI response to UI
            addMessage(formatResponse(aiResponse));

            // Save to history
            history.push({ role: 'assistant', content: aiResponse });
            saveConversation(history);

        } catch (error) {
            console.error('Chat error:', error);
            loadingEl.remove();
            addMessage("Sorry, I'm having trouble connecting. Please check your internet and try again.");
        }
    }

    // Format AI response (basic markdown-like formatting)
    function formatResponse(text) {
        if (!text) return '';

        // Escape HTML first
        let formatted = escapeHtml(text);

        // Bold
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Italic
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        // Links
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        return formatted;
    }

    // Initialize chat widget
    function initChat() {
        createChatWidget();

        const toggleBtn = document.getElementById('piney-chat-toggle');
        const closeBtn = document.getElementById('piney-chat-close');
        const clearBtn = document.getElementById('piney-chat-clear');
        const chatWindow = document.getElementById('piney-chat-window');
        const chatForm = document.getElementById('piney-chat-form');
        const chatInput = document.getElementById('piney-chat-input');
        const messagesContainer = document.getElementById('piney-chat-messages');

        // Load previous conversation
        const history = getConversationHistory();
        if (history.length > 0) {
            // Clear welcome and show "Conversation continued" message
            const welcomeEl = messagesContainer.querySelector('.piney-chat-welcome');
            if (welcomeEl) {
                welcomeEl.innerHTML = '<p>Conversation continued. How can I help?</p>';
            }
        }

        // Toggle chat window
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            toggleBtn.classList.toggle('active');
            if (!chatWindow.classList.contains('hidden')) {
                setTimeout(() => chatInput.focus(), 300);
            }
        });

        // Close chat
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            toggleBtn.classList.remove('active');
        });

        // Clear conversation
        clearBtn.addEventListener('click', () => {
            clearConversation();
            messagesContainer.innerHTML = `
                <div class="piney-chat-welcome">
                    <p>Hi! I'm Piney AI. Ask me about:</p>
                    <ul>
                        <li>Website packages & pricing</li>
                        <li>Piney Outreach system</li>
                        <li>SEO & Google ranking</li>
                        <li>Technical questions</li>
                    </ul>
                </div>
            `;
        });

        // Handle form submission
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
                chatInput.value = '';
            }
        });

        // Handle Enter key
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    // Add chat CSS
    function addChatStyles() {
        const styles = `
            #piney-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .piney-chat-button {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: auto;
                padding: 14px 18px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 600;
            }

            .piney-chat-button:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
            }

            .piney-chat-button.active {
                transform: scale(1);
                opacity: 0;
                pointer-events: none;
            }

            .piney-chat-badge {
                background: rgba(255, 255, 255, 0.2);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
            }

            .piney-chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                max-width: calc(100vw - 40px);
                height: 550px;
                max-height: calc(100vh - 120px);
                background: var(--card-bg, #1e293b);
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: all 0.3s ease;
                border: 1px solid var(--border-color, #334155);
            }

            .piney-chat-window.hidden {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                pointer-events: none;
            }

            .piney-chat-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .piney-chat-header-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .piney-chat-title {
                font-weight: 600;
                font-size: 15px;
            }

            .piney-chat-subtitle {
                font-size: 12px;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .piney-chat-subtitle::before {
                content: '';
                width: 6px;
                height: 6px;
                background: #4ade80;
                border-radius: 50%;
                display: inline-block;
            }

            .piney-chat-actions {
                display: flex;
                gap: 8px;
            }

            .piney-chat-icon-btn {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 8px;
                cursor: pointer;
                color: white;
                transition: background 0.2s;
            }

            .piney-chat-icon-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .piney-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .piney-chat-welcome {
                background: var(--bg-primary, #0f172a);
                padding: 16px;
                border-radius: 12px;
                border: 1px solid var(--border-color, #334155);
            }

            .piney-chat-welcome p {
                margin: 0 0 12px 0;
                font-weight: 600;
                color: var(--text-primary, #e2e8f0);
            }

            .piney-chat-welcome ul {
                margin: 0;
                padding-left: 20px;
                color: var(--text-muted, #94a3b8);
                font-size: 13px;
            }

            .piney-chat-welcome li {
                margin-bottom: 4px;
            }

            .piney-message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 12px;
                animation: messageSlide 0.3s ease;
            }

            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .piney-message-user {
                align-self: flex-end;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border-bottom-right-radius: 4px;
            }

            .piney-message-ai {
                align-self: flex-start;
                background: var(--bg-primary, #0f172a);
                color: var(--text-primary, #e2e8f0);
                border: 1px solid var(--border-color, #334155);
                border-bottom-left-radius: 4px;
            }

            .piney-message-content {
                font-size: 14px;
                line-height: 1.5;
                word-wrap: break-word;
            }

            .piney-message-content a {
                color: #10b981;
                text-decoration: underline;
            }

            .piney-message-loading {
                background: var(--bg-primary, #0f172a);
                border: 1px solid var(--border-color, #334155);
            }

            .piney-typing {
                display: flex;
                gap: 4px;
                padding: 4px 0;
            }

            .piney-typing span {
                width: 8px;
                height: 8px;
                background: var(--text-muted, #94a3b8);
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .piney-typing span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .piney-typing span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 100% {
                    transform: translateY(0);
                    opacity: 0.4;
                }
                50% {
                    transform: translateY(-4px);
                    opacity: 1;
                }
            }

            .piney-chat-input-area {
                padding: 16px;
                background: var(--card-bg, #1e293b);
                border-top: 1px solid var(--border-color, #334155);
            }

            #piney-chat-form {
                display: flex;
                gap: 8px;
            }

            .piney-chat-input {
                flex: 1;
                padding: 12px 16px;
                background: var(--bg-primary, #0f172a);
                border: 1px solid var(--border-color, #334155);
                border-radius: 24px;
                color: var(--text-primary, #e2e8f0);
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }

            .piney-chat-input:focus {
                border-color: #10b981;
            }

            .piney-chat-input::placeholder {
                color: var(--text-muted, #94a3b8);
            }

            .piney-chat-send {
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .piney-chat-send:hover {
                transform: scale(1.05);
            }

            .piney-chat-send:active {
                transform: scale(0.95);
            }

            /* Mobile responsive */
            @media (max-width: 480px) {
                #piney-chat-widget {
                    bottom: 10px;
                    right: 10px;
                }

                .piney-chat-window {
                    width: calc(100vw - 20px);
                    height: calc(100vh - 80px);
                    bottom: 70px;
                    right: -10px;
                }

                .piney-chat-button span {
                    display: none;
                }

                .piney-chat-button {
                    width: 60px;
                    height: 60px;
                    padding: 18px;
                    border-radius: 50%;
                }
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.id = 'piney-chat-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addChatStyles();
            initChat();
        });
    } else {
        addChatStyles();
        initChat();
    }
})();