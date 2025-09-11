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