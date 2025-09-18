const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');

let conversationStage = 0;
let userData = {};
let isConfirmationStage = false;
let userType = null;
let preselectedService = null;

// Mensagens iniciais
const initialMessage = "Bem-vindo ao assistente virtual da AGM Advocacia! A Lei Geral de Proteção de Dados (LGPD) é fundamental para proteger a privacidade e os direitos dos cidadãos brasileiros. Estamos aqui para ajudar você a entender e se adequar a essa importante legislação.\n\nVocê é um cliente individual ou representa uma empresa?\n\n1 - Cliente Individual\n2 - Empresa";

// Opções para cliente individual
const clientOptions = [
    "1 - Consultoria sobre LGPD",
    "2 - Treinamento básico sobre proteção de dados",
    "3 - Revisão de documentos e políticas de privacidade"
];

// Opções para empresa
const companyOptions = [
    "1 - Adequação completa à LGPD",
    "2 - Treinamento corporativo sobre LGPD",
    "3 - Consultoria para implementação de políticas de privacidade",
    "4 - Auditoria de conformidade com a LGPD"
];

// Mapeamento de serviços por tipo
const serviceMap = {
    cliente: {
        'consultoria': 1,
        'treinamento': 2,
        'revisao': 3
    },
    empresa: {
        'adequacao': 1,
        'treinamento_corp': 2,
        'politicas': 3,
        'auditoria': 4
    }
};

// Nomes completos dos serviços
const serviceNameMap = {
    cliente: {
        1: "Consultoria sobre LGPD",
        2: "Treinamento básico sobre proteção de dados",
        3: "Revisão de documentos e políticas de privacidade"
    },
    empresa: {
        1: "Adequação completa à LGPD",
        2: "Treinamento corporativo sobre LGPD",
        3: "Consultoria para implementação de políticas de privacidade",
        4: "Auditoria de conformidade com a LGPD"
    }
};

// Perguntas finais (excluindo as já respondidas)
const finalQuestions = [
    "Qual é o seu nome completo?",
    "Qual é o seu e-mail?",
    "Qual é o seu telefone?",
    "Descreva brevemente sua necessidade ou dúvida:"
];

const botResponses = [
    "Obrigado pela informação! Agora, para darmos continuidade, preciso de alguns dados seus.",
    "Perfeito! Agora preciso do seu e-mail para contato.",
    "Obrigado! Por último, qual é o seu telefone?",
    "Obrigado! Agora, por favor, descreva brevemente sua necessidade ou dúvida:"
];

// Função para obter parâmetros da URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        tipo: params.get('tipo'),
        servico: params.get('servico')
    };
}

// Inicializar chat com base nos parâmetros da URL
function initializeChat() {
    const params = getUrlParams();
    
    if (params.tipo && params.servico) {
        // Pré-seleção baseada nos parâmetros
        if ((params.tipo === 'cliente' || params.tipo === 'empresa') && 
            serviceMap[params.tipo] && 
            serviceMap[params.tipo][params.servico]) {
            
            userType = params.tipo;
            userData.tipo = userType === 'cliente' ? 'Cliente Individual' : 'Empresa';
            const serviceIndex = serviceMap[params.tipo][params.servico];
            userData.servico = serviceNameMap[params.tipo][serviceIndex];
            
            // Pular para coleta de dados pessoais
            conversationStage = 2;
            addMessage(`Olá! Vi que você está interessado em ${userData.servico}. Para darmos continuidade, preciso coletar algumas informações suas.`, 'bot');
            setTimeout(() => {
                addMessage(finalQuestions[0], 'bot');
            }, 1500);
            return;
        }
    }
    
    // Fluxo normal se não houver parâmetros válidos
    addMessage(initialMessage, 'bot');
}

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
        <div class="message-content">${content.replace(/\n/g, '<br>')}</div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processUserResponse(response) {
    // Converter resposta para número
    const numResponse = parseInt(response);

    if (conversationStage === 0) {
        // Primeira etapa: identificar se é cliente individual ou empresa
        if (numResponse === 1) {
            userType = 'cliente';
            userData.tipo = 'Cliente Individual';
            addMessage("Ótimo! Agora, escolha qual serviço você está interessado:", 'bot');
            clientOptions.forEach(option => {
                setTimeout(() => {
                    addMessage(option, 'bot');
                }, 300);
            });
        } else if (numResponse === 2) {
            userType = 'empresa';
            userData.tipo = 'Empresa';
            addMessage("Excelente! Agora, escolha qual serviço você está interessado:", 'bot');
            companyOptions.forEach(option => {
                setTimeout(() => {
                    addMessage(option, 'bot');
                }, 300);
            });
        } else {
            addMessage("Por favor, responda com '1' para cliente individual ou '2' para empresa.", 'bot');
            return;
        }
    } else if (conversationStage === 1) {
        // Segunda etapa: selecionar serviço
        let service = '';
        let isValidOption = false;

        if (userType === 'cliente') {
            if (numResponse >= 1 && numResponse <= clientOptions.length) {
                service = clientOptions[numResponse - 1].split(' - ')[1];
                isValidOption = true;
            }
        } else if (userType === 'empresa') {
            if (numResponse >= 1 && numResponse <= companyOptions.length) {
                service = companyOptions[numResponse - 1].split(' - ')[1];
                isValidOption = true;
            }
        }

        if (isValidOption) {
            userData.servico = service;
            addMessage(botResponses[0], 'bot');
            setTimeout(() => {
                addMessage(finalQuestions[0], 'bot');
            }, 1500);
        } else {
            addMessage("Por favor, digite um número válido da opção desejada.", 'bot');
            return;
        }
    } else if (conversationStage >= 2 && conversationStage <= 5) {
        // Etapas finais: coletar dados pessoais
        const index = conversationStage - 2;
        switch (index) {
            case 0:
                userData.nome = response;
                addMessage(botResponses[1], 'bot');
                break;
            case 1:
                userData.email = response;
                addMessage(botResponses[2], 'bot');
                break;
            case 2:
                userData.telefone = response;
                addMessage(botResponses[3], 'bot');
                break;
            case 3:
                userData.mensagem = response;
                // Mostrar resumo dos dados
                setTimeout(() => {
                    showDataSummary();
                }, 1500);
                return;
        }
    }

    conversationStage++;
}

function showDataSummary() {
    const summary = `
        <strong>Resumo dos dados coletados:</strong>
        Tipo de cliente: ${userData.tipo}
        Serviço solicitado: ${userData.servico}
        Nome: ${userData.nome}
        E-mail: ${userData.email}
        Telefone: ${userData.telefone}
        Necessidade: ${userData.mensagem || 'Não informada'}<br>
        Está tudo correto?<br>
        1 - Sim
        2 - Não
    `;

    addMessage(summary, 'bot');
    isConfirmationStage = true; // Etapa de confirmação
}

function handleConfirmation(response) {
    const numResponse = parseInt(response);

    // Verifica se a resposta é válida
    if (numResponse === 1) {
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
    } else if (numResponse === 2) {
        // Reiniciar o formulário
        addMessage("Vamos recomeçar então. Por favor, informe novamente se você é cliente individual ou empresa:", 'bot');

        // Resetar variáveis
        conversationStage = 0;
        userData = {};
        userType = null;
        isConfirmationStage = false;

        // Mostrar opções iniciais novamente
        setTimeout(() => {
            addMessage("1 - Cliente Individual\n2 - Empresa", 'bot');
        }, 1000);
    } else {
        // Respostas inválidas
        addMessage("Por favor, responda com '1' para Sim ou '2' para Não.", 'bot');
    }
}

function sendUserDataToServer() {
    // Simulação de envio de dados para servidor
    console.log("Dados enviados:", userData);

    // Aqui você pode adicionar a lógica real para enviar os dados
    // Exemplo:
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
    */
}

// Iniciar conversa quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    initializeChat();
});