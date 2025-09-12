document.addEventListener('DOMContentLoaded', function() {
    // Função para toggle dos cards
    function toggleCard(card) {
        const isExpanded = card.classList.contains('expanded');
        
        if (isExpanded) {
            // Se já está expandido, recolhe
            card.classList.remove('expanded');
        } else {
            // Se está fechado, fecha todos e expande este
            document.querySelectorAll('.card').forEach(c => {
                c.classList.remove('expanded');
            });
            card.classList.add('expanded');
        }
    }

    // Adiciona evento de clique a todos os cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            toggleCard(this);
        });
    });

    // Impedir que cliques dentro do conteúdo expandido fechem o card
    document.querySelectorAll('.card-expanded-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Adicionar evento de submit ao formulário
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Simulação de envio
            alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
            
            // Limpa o formulário
            contactForm.reset();
            
            // Fecha o card após 2 segundos
            setTimeout(() => {
                document.querySelectorAll('.card').forEach(c => {
                    c.classList.remove('expanded');
                });
            }, 2000);
        });
        
        // Impedir propagação de cliques dentro do formulário
        contactForm.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Impedir propagação em todos os elementos do formulário
        const formElements = contactForm.querySelectorAll('input, select, textarea, button, label');
        formElements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    }
});