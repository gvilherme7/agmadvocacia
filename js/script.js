// js/script.js

(function() {
    "use strict";

    function toggleCard(cardElement) {
        const isExpanded = cardElement.classList.contains('expanded');

        if (isExpanded) {
            cardElement.classList.remove('expanded');
        } else {
            document.querySelectorAll('.card').forEach(c => {
                if (c !== cardElement) {
                    c.classList.remove('expanded');
                }
            });
            cardElement.classList.add('expanded');
        }
    }

    window.toggleCard = toggleCard;

    document.addEventListener('DOMContentLoaded', function () {

        document.querySelectorAll('.card-expanded-content, .contact-form, .form-group input, .form-group select, .form-group textarea, .form-group label, .submit-btn, .child-card').forEach(element => {
            element.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
                contactForm.reset();
            });
        }
    });

})();