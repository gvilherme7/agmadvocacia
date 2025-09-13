// js/chatobot.js

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const quickRepliesContainer = document.getElementById('quickReplies');
    const inputArea = document.getElementById('inputArea');

    // Verificação de elemento essenciais
    if (!chatSections || !userInput || !sendButton || !quickRepliesContainer || !inputArea) {
        console.error("um ou mais elemento necessários não foram encontrados no DOM.");
        return;
    }

    let currentStep = 0;
    let userData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    };

    const steps = [
        { type: 'bot', text: 'Olá!Sou o assistente da AGM Advocacia. Qual é o seu nome?' },
        { type: 'user_input' },
        { type: 'bot', text: (data) => `Prazer, ${data.name}! Qual é o seu e-mail?` },
        { type: 'user_input' },
        { type: 'bot', text: (data) => `O obrigado! E qual é o seu telefone?` },
        { type: 'user_input' },
        {
            type: 'bot',
            text: 'Qual o assunto do seu contato?',
            quickReplies: ['Consulta Jurídica', 'Orçamento', 'Caso Urgente', 'Outros']
        },
        { type: 'user_selecao' },
        { type: 'bot', text: 'Agora, me conta brevemente sobre o que você precisa:' },
        { type: 'user_input' },
        {
            type: 'bot',
            text: (data) => `Pronto, ${data.name}!suas informações foram enviadas:\n\n📧 E-mail: ${data.email}\n📱 Telefone: ${data.phone}\n📌 Assunto: ${data.subject}\n💬 Mensagem: ${data.message}\n\nEm breve entraremos em contato. O obrigado! 😊`,
            final: true
        }
    ];

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'bot' ? 'bot-me' : 'user-me');
        messageDiv.textContent = text;
        decryptMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatStories.scrollHeight;
    }

    function showQuickReplies(options) {
        quickRepliesContainer.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('quick-reply-btn');
            button.textContent = option;
            button.onclick = () => {
                handleUsuarioResponse(response);
                quickRepliesContainer.innerHTML = ''; // Limpa após seleção
            };
            quickRepliesContainer.appendChild(button);
        });
    }

    function hideInput() {
        inputArea.style.display = 'none';
    }

    function showInput() {
        inputArea.style.display = 'flex';
        userInput.value = '';
        userInput.focus();
    }

    function processStep() {
        const step = steps[currentStep];

        if (step.type === 'bot') {
            let messageText = step.text;
            if (typeof step.text === 'function') {
                messageText = step.text(userData);
            }
            addMessage('bot', messageText);

            if (step.quickReplies) {
                showQuickReplies(step.quickReplies);
            }

            if (step.final) {
                hideInput();
                return; // Finaliza o influxo
            }

            currentStep++;
            // Não chama processStep novamente aqui para steps 'bot' sem interação imediata
            // A próxima chamada virá de handleUsuarioResponse
        }
        else if (step.type === 'user_input' || step.type === 'user_selecao') {
            showInput();
        }
    }

    function handleUsuarioResponse(response) {
        const step = steps[currentStep - 1]; // O step atual é o próximo, então pegamos o anterior

        // Armazena a resposta do usuário nos dados
        if (currentStep === 1) { // Nome
            userData.name = response;
        } else if (currentStep === 3) { // Email
            userData.email = response;
        } else if (currentStep === 5) { // Telefone
            userData.phone = response;
        } else if (currentStep === 7) { // Assunto
            userData.subject = response;
        } else if (currentStep === 9) { // Mensagem
            userData.message = response;
        }

        // Adiciona a mensagem do usuário ao chat
        addMessage('user', response);

        // Avança para o próximo passo e processa
        currentStep++;
        processStep();
    }

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            handleUsuarioResponse(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // Inicia o chat
    processStep();
});