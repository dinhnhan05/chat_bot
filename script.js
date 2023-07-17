const apiKey = 'Enter_Your_Api_Key';
// Enter your key from 'platform.openai.com/account/api-keys'
const chatOutput = document.getElementById('chat-output');
const userInput = document.getElementById('user-input');
const userAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCoS1h0huK1B606Qb4j_hHmwGH8wPmvKLSKQ&usqp=CAU'; //user img
const botAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdZ9dExjxM5bzlQbdh_gLIt2cWMOzQmil8TA&usqp=CAU'; // Chat bot img

// Tạo một mảng để lưu trữ các tin nhắn, bao gồm đoạn chat mặc định ban đầu
let messages = [
  { role: 'chatbot', content: 'Chat Bot: Hello, May I help you?' },
];

// Kiểm tra xem có dữ liệu tin nhắn lưu trữ trong local storage không
if (localStorage.getItem('chatMessages')) {
  messages = JSON.parse(localStorage.getItem('chatMessages'));
  // Hiển thị lại các tin nhắn đã lưu trữ trong local storage
  messages.forEach((msg) => appendMessage(msg.content, msg.role === 'user' ? 'user' : 'chatbot'));
}

function sendMessage() {
  const message = userInput.value;
  if (message.trim() === '') return;

  appendMessage('User: ' + message, 'user');

  appendMessage('Sending...', 'chatbot');

  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const reply = data.choices[0].message['content'];

      updateLastMessage('Chat Bot: ' + reply, 'chatbot');

      messages.push({ role: 'user', content: 'User: ' + message });
      messages.push({ role: 'chatbot', content: 'Chat Bot: ' + reply });
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    })
    .catch((error) => {
      console.error('Error:', error);

      updateLastMessage('Error: An error occurred, please check the api key and try again !', 'chatbot');

      messages.push({ role: 'user', content: 'bạn: ' + message });
      messages.push({ role: 'chatbot', content: 'Error: An error occurred, please check the api key and try again !' });
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    });

  userInput.value = '';
}

function clearChat() {
  // Xoá tin nhắn trừ đoạn chat mặc định ban đầu
  chatOutput.innerHTML = '';
  messages = [{ role: 'chatbot', content: 'Chat Bot: Hello, May I help you🤓' }];
  localStorage.setItem('chatMessages', JSON.stringify(messages));

  // Hiển thị lại các tin nhắn đã lưu trữ trong local storage
  messages.forEach((msg) => appendMessage(msg.content, msg.role === 'user' ? 'user' : 'chatbot'));
}

function appendMessage(message, role) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');

  const avatarImg = document.createElement('img');
  avatarImg.src = role === 'user' ? userAvatar : botAvatar;
  avatarImg.classList.add('avatar');

  const messageText = document.createElement('div');
  messageText.classList.add('message-text');
  messageText.textContent = message;

  messageContainer.classList.add(role === 'user' ? 'user-message' : 'chatbot-message');

  messageContainer.appendChild(avatarImg);
  messageContainer.appendChild(messageText);

  chatOutput.appendChild(messageContainer);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

function updateLastMessage(message, role) {
  const lastMessageContainer = chatOutput.lastElementChild;
  const lastMessageText = lastMessageContainer.querySelector('.message-text');
  lastMessageText.textContent = message;
}
