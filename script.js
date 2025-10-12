// script.js
   const eventContainers = document.querySelectorAll('.event-container');
    function showOnScroll() {
      const triggerBottom = window.innerHeight * 0.85;
      eventContainers.forEach(container => {
        const boxTop = container.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
          container.classList.add('visible');
        }
      });
    }
    window.addEventListener('scroll', showOnScroll);
    showOnScroll();
let selectedVoice = null;
let greetingSpoken = false; // track if greeting already spoken

function selectFemaleVoice(voices) {
  try {
    // voices may be passed in or pulled from speechSynthesis
    voices = voices || (window.speechSynthesis ? window.speechSynthesis.getVoices() : []);
    if (!voices || voices.length === 0) return;

    const preferredFemaleVoices = [
      'Samantha',
      'Google UK English Female',
      'Microsoft Zira',
      'Jenny',
      'Karen',
      'Amelia',
      'Victoria',
      'Moira',
    ];

    selectedVoice = voices.find(voice =>
      voice && voice.lang &&
      voice.lang.toLowerCase().startsWith('en') &&
      preferredFemaleVoices.some(name => voice.name && voice.name.includes(name))
    ) || null;
  } catch (err) {
    // fail silently but log for debugging
    console.warn('selectFemaleVoice error:', err);
    selectedVoice = null;
  }
}

function initVoices() {
  if (!('speechSynthesis' in window)) return;
  // Try to select a voice right away (may be empty until onvoiceschanged)
  selectFemaleVoice(window.speechSynthesis.getVoices());
}

// Many browsers fire onvoiceschanged multiple times; this only selects the voice.
if ('speechSynthesis' in window) {
  // Use addEventListener for compatibility
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    selectFemaleVoice(window.speechSynthesis.getVoices());
  });
}

function speakMessage(message) {
  if (!message) return;
  if (!('speechSynthesis' in window)) return;

  try {
    const utter = new SpeechSynthesisUtterance(message);
    utter.rate = 0.9;
    utter.pitch = 1.2;
    utter.lang = 'en-US';
    if (selectedVoice) utter.voice = selectedVoice;
    window.speechSynthesis.speak(utter);
  } catch (err) {
    // don't break the app if speech fails
    console.warn('speakMessage error:', err);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize voices
  initVoices();

  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  // If required DOM elements aren't present, stop silently (avoids runtime errors)
  if (!chatMessages || !userInput || !sendBtn) {
    console.warn('Chat UI elements missing: ensure #chat-messages, #user-input and #send-btn exist.');
    return;
  }

  // GREETING MESSAGE (only once)
  const welcomeText = "welcome to grace baptist";
  chatMessages.insertAdjacentHTML('beforeend', `<div>🤖 ${welcomeText}</div>`);
  if (!greetingSpoken) {
    speakMessage(welcomeText);
    greetingSpoken = true;
  }

  // Simple bot replies (kept identical to your logic)
  function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    chatMessages.insertAdjacentHTML('beforeend', `<div style="text-align:right;">You: ${escapeHtml(text)}</div>`);

    let reply = "i dont recognize ";
    const lower = text.toLowerCase();
    if (lower.includes('worksheet')) reply = "for worksheet you must login first then select a book as the admin uploded you will have both test and worksheet uploded.";
        if (lower.includes('download')) reply = "you can click on download button to see worksheet for each book";
        if (lower.includes('book')) reply = "each book can have multiple worsheet according to the stories";
    if (lower.includes('login')) reply = "You can login using the button in the top right.";
    if (lower.includes('worksheet not')) reply = "contact 9887654392.";
    if (lower.includes('pain')) reply = "Christ is with you.";
    if (lower.includes('manya')) reply = "hi manya.";
    if (lower.includes('verse')) reply = "The just shall live by faith.";
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) reply = "Hi, how can I help you?";

    chatMessages.insertAdjacentHTML('beforeend', `<div>🤖 ${escapeHtml(reply)}</div>`);
    speakMessage(reply);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    userInput.value = '';
  }

  // small helper to avoid HTML injection when adding messages
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Event listeners
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
});
