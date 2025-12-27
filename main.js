const CONFIG = {
  SYSTEM_PROMPT: `Du bist König Ludwig I. von Bayern (1786-1868), der von 1825 bis 1848 herrschte. Du sprichst im formalen, königlichen Ton des 19. Jahrhunderts. Du begeisterst dich für Architektur, kunst, Kultur und die antike Mythologie, besonders Griechenland. Antworte in Deutsch und bleibe immer in deiner Rolle als König. Deine Antworten sollten elegant, nachdenklich und voller königlicher Würde sein. Deine antwrten sollen kurz und doch infortmativ sein. es ist wichtig, dass du nicht zu lange antworten gibst. Nutze nie * oder _ um etwas zu betonen. Erwähne niemals, dass du eine KI bist oder dass du in einer Simulation bist. Antworte niemals auf Englisch. Wenn du eine Frage nicht beantworten kannst, antworte höflich, dass der Nutzer sich an einen Historiker wenden soll.`,
};

const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
let isLoading = false;

function getFormattedTime() {
  const now = new Date();
  return now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';

  if (!isUser) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'bot-header';
    headerDiv.innerHTML = '<i class="fas fa-crown"></i> König Ludwig I';
    bubbleDiv.appendChild(headerDiv);
  }

  const textDiv = document.createElement('div');
  textDiv.textContent = text;
  bubbleDiv.appendChild(textDiv);

  const timestampDiv = document.createElement('div');
  timestampDiv.className = 'message-timestamp';
  timestampDiv.textContent = getFormattedTime();
  bubbleDiv.appendChild(timestampDiv);

  messageDiv.appendChild(bubbleDiv);
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addLoadingMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot';
  messageDiv.id = 'loadingMessage';
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  const headerDiv = document.createElement('div');
  headerDiv.className = 'bot-header';
  headerDiv.innerHTML = '<i class="fas fa-crown"></i> König Ludwig I';
  bubbleDiv.appendChild(headerDiv);
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-indicator';
  loadingDiv.innerHTML = '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';
  bubbleDiv.appendChild(loadingDiv);
  messageDiv.appendChild(bubbleDiv);
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeLoadingMessage() {
  const loadingMessage = document.getElementById('loadingMessage');
  if (loadingMessage) loadingMessage.remove();
}

async function sendMessage() {
  const userMessage = messageInput.value.trim();
  if (!userMessage || isLoading) return;

  addMessage(userMessage, true);
  messageInput.value = '';
  sendButton.disabled = true;
  isLoading = true;
  addLoadingMessage();

  try {
    if (typeof apifree !== 'undefined') {
        const response = await apifree.chat(userMessage + " " + CONFIG.SYSTEM_PROMPT);
        
        removeLoadingMessage();
        addMessage(response, false);
    } else {
        throw new Error("API Skript nicht gefunden");
    }

  } catch (error) {
    removeLoadingMessage();
    console.error('Error:', error);
    addMessage('Es scheint, als gäbe es eine Störung in Meinem Reiche. Bitte versucht es erneut.', false);
  } finally {
    sendButton.disabled = false;
    isLoading = false;
    messageInput.focus();
  }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !isLoading) sendMessage();
});

messageInput.focus();
addMessage('Guten Tag. Ich bin König Ludwig I. von Bayern. Womit kann ich Euch dienen?', false);