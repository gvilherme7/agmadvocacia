const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');

let conversationStage = 0;
let userData = {};
let isConfirmationStage = false;

const questions = [
    "Qual é o seu nome completo?",
    "Qual é o seu e-mail?",
    "Qual é o seu telefone?",
    "Você é uma empresa ou cliente individual?",
    "Qual é a sua mensagem ou dúvida?"
];

const botResponses = [
    "Obrigado, {nome}! Agora preciso do seu e-mail para contato.",
    "Perfeito! Agora me informe o seu telefone.",
    "Ótimo! Preciso saber que tipo de cliente você é.",
    "Entendi. Agora, preciso que descreva sua necessidade.",
    "Obrigado por todas as informações! Vou resumir os dados coletados."
];

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Verificar se estamos na etapa de confirmação
    if (isConfirmationStage) {
        // Adicionar mensagem do usuário antes de processar
        addMessage(message, 'user');
        userInput.value = '';

        handleConfirmation(message);
        return;
    }

    if (conversationStage >= questions.length) return;

    // Adicionar mensagem do usuário
    addMessage(message, 'user');
    userInput.value = '';

    // Processar resposta do bot
    setTimeout(() => {
        processUserResponse(message);
    }, 1000);
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatar = sender === 'bot' ? 'A' : 'V';
    const senderName = sender === 'bot' ? 'Assistente' : 'Você';
    const avatarClass = sender === 'bot' ? 'bot-avatar' : 'user-avatar';

    messageDiv.innerHTML = `
                <div class="message-header">
                    <div class="avatar ${avatarClass}">${avatar}</div>
                    <strong>${senderName}</strong>
                </div>
                <div class="message-content">${content}</div>
            `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processUserResponse(response) {
    // Armazenar a resposta do usuário
    userData[Object.keys(userData).length] = response;

    switch (conversationStage) {
        case 0:
            userData.nome = response;
            addMessage(botResponses[0].replace('{nome}', response), 'bot');
            break;
        case 1:
            userData.email = response;
            addMessage(botResponses[1], 'bot');
            break;
        case 2:
            userData.telefone = response;
            addMessage(botResponses[2], 'bot');
            break;
        case 3:
            userData.tipo = response;
            addMessage(botResponses[3], 'bot');
            break;
        case 4:
            userData.mensagem = response;
            addMessage(botResponses[4], 'bot');

            // Mostrar resumo dos dados
            setTimeout(() => {
                showDataSummary();
            }, 1500);
            return;
    }

    conversationStage++;

    if (conversationStage < questions.length) {
        setTimeout(() => {
            addMessage(questions[conversationStage], 'bot');
        }, 1500);
    }
}

function showDataSummary() {
    const summary = `
                <strong>Resumo dos dados coletados:</strong><br>
                Nome: ${userData.nome}<br>
                E-mail: ${userData.email}<br>
                Telefone: ${userData.telefone}<br>
                Tipo: ${userData.tipo}<br>
                Mensagem: ${userData.mensagem}<br><br>
                Está tudo correto? (Sim/Não)
            `;

    addMessage(summary, 'bot');
    isConfirmationStage = true; // Etapa de confirmação
}

function handleConfirmation(response) {
    const resposta = response.toLowerCase().trim();

    // Verifica se a resposta é válida
    if (resposta === 'sim' || resposta === 's' || resposta === 'sim, está correto' || resposta === 'ok' || resposta === 'confirmar') {
        // Enviar os dados
        sendUserDataToServer();

        // Mensagem de confirmação no chat
        addMessage("Sua solicitação foi enviada com sucesso! Em breve entraremos em contato.", 'bot');

        // Desabilitar entrada após envio
        userInput.disabled = true;
        userInput.placeholder = "Conversa encerrada";

        // Mostrar mensagem final
        setTimeout(() => {
            addMessage("Obrigado por entrar em contato conosco!", 'bot');
        }, 2000);
    } else if (resposta === 'não' || resposta === 'nao' || resposta === 'n' || resposta === 'não, está incorreto' || resposta === 'corrigir' || resposta === 'reiniciar') {
        // Reiniciar o formulário
        addMessage("Vamos recomeçar então. Por favor, informe novamente seus dados.", 'bot');

        // Resetar variáveis
        conversationStage = 0;
        userData = {};
        isConfirmationStage = false;

        // Iniciar novamente
        setTimeout(() => {
            addMessage(questions[0], 'bot');
        }, 1500);
    } else {
        // Respostas inválidas
        addMessage("Por favor, responda com 'Sim' ou 'Não'.", 'bot');
        setTimeout(() => {
            addMessage("Está tudo correto? (Sim/Não)", 'bot');
        }, 1000);
    }
}

function sendUserDataToServer() {
    // Simulação de envio de dados para servidor
    console.log("Dados enviados:", userData);
}

// Iniciar conversa
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        addMessage(questions[0], 'bot');
    }, 1000);
});