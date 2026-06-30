// Piney Digital AI Chat Bubble
// Connects to the AI server at pineydigital-production.up.railway.app

(function() {
  const AI_SERVER = 'https://pineydigital-production.up.railway.app';
  let sessionId = localStorage.getItem('piney_session_id') || null;
  let chatOpen = false;
  let messages = [];

  // Generate or retrieve session ID
  function getSessionId() {
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('piney_session_id', sessionId);
    }
    return sessionId;
  }

  // Create chat bubble UI
  function createChatBubble() {
    const bubble = document.createElement('div');
    bubble.id = 'ai-chat-bubble';
    bubble.innerHTML = `
      <style>
        #ai-chat-bubble {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        #chat-toggle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2d7f4e 0%, #1e5a8e 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        #chat-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
        }
        #chat-toggle svg {
          width: 28px;
          height: 28px;
          color: white;
        }
        #chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          max-width: calc(100vw - 48px);
          height: 500px;
          max-height: calc(100vh - 120px);
          background: #12121a;
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        #chat-window.open {
          display: flex;
        }
        #chat-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(45, 127, 78, 0.15) 0%, rgba(30, 90, 142, 0.15) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        #chat-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #chat-header h3 span {
          font-size: 20px;
        }
        #close-chat {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          display: flex;
        }
        #close-chat:hover {
          color: #fff;
        }
        #chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-message {
          max-width: 85%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
        }
        .chat-message.user {
          background: linear-gradient(135deg, #2d7f4e 0%, #1e5a8e 100%);
          color: #fff;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
        .chat-message.assistant {
          background: rgba(255, 255, 255, 0.08);
          color: #e5e7eb;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        .chat-message.typing {
          background: rgba(255, 255, 255, 0.08);
          color: #9ca3af;
        }
        #chat-input-area {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 12px;
        }
        #chat-input {
          flex: 1;
          padding: 12px 16px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: 14px;
          outline: none;
        }
        #chat-input::placeholder {
          color: #6b7280;
        }
        #chat-input:focus {
          border-color: #2d7f4e;
        }
        #send-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2d7f4e 0%, #1e5a8e 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        #send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        #send-btn svg {
          width: 20px;
          height: 20px;
          color: white;
        }
        @media (max-width: 480px) {
          #chat-window {
            width: calc(100vw - 32px);
            right: -8px;
          }
        }
      </style>
      <button id="chat-toggle" aria-label="Open AI chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      </button>
      <div id="chat-window">
        <div id="chat-header">
          <h3><span>🌲</span> Piney Digital Assistant</h3>
          <button id="close-chat" aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div id="chat-messages">
          <div class="chat-message assistant">
            👋 Hi! I'm the Piney Digital assistant. I can help you learn about our custom platforms, pricing, or schedule a consultation. What brings you here today?
          </div>
        </div>
        <div id="chat-input-area">
          <input type="text" id="chat-input" name="message" placeholder="Type your message..." aria-label="Message the Piney Digital AI assistant" autocomplete="off" />
          <button id="send-btn" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(bubble);

    // Event listeners
    const toggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('chat-messages');

    toggle.addEventListener('click', () => {
      chatOpen = !chatOpen;
      chatWindow.classList.toggle('open', chatOpen);
      if (chatOpen) {
        input.focus();
      }
    });

    closeBtn.addEventListener('click', () => {
      chatOpen = false;
      chatWindow.classList.remove('open');
    });

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    async function sendMessage() {
      const message = input.value.trim();
      if (!message) return;

      // Add user message
      addMessage(message, 'user');
      input.value = '';
      sendBtn.disabled = true;

      // Add typing indicator
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-message typing';
      typingDiv.textContent = 'Thinking...';
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      try {
        const response = await fetch(`${AI_SERVER}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message,
            sessionId: getSessionId()
          })
        });

        const data = await response.json();

        // Remove typing indicator
        typingDiv.remove();

        // Add assistant message
        addMessage(data.message, 'assistant');

        // If lead captured, show success message
        if (data.leadCaptured) {
          addMessage("🎉 I've passed your info along to Joel. He'll reach out within 24 hours!", 'assistant');
        }
      } catch (error) {
        typingDiv.remove();
        addMessage("Sorry, I'm having trouble connecting. Please try again or contact us directly at joel@pineydigital.com", 'assistant');
      }

      sendBtn.disabled = false;
    }

    function addMessage(text, type) {
      const div = document.createElement('div');
      div.className = `chat-message ${type}`;
      div.textContent = text;
      messagesContainer.appendChild(div);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatBubble);
  } else {
    createChatBubble();
  }
})();