document.addEventListener('DOMContentLoaded', () => {
    /* Fade Up */
    const animEls = document.querySelectorAll('.anim');
    const animObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); animObserver.unobserve(entry.target); } }); }, { threshold: 0.15 });
    animEls.forEach(el => animObserver.observe(el));

    /* Stagger */
    const grids = document.querySelectorAll('.anim-stagger');
    const gridObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { Array.from(entry.target.children).forEach((child, i) => { child.style.transitionDelay = (i * 0.1) + 's'; child.classList.add('is-visible'); }); gridObserver.unobserve(entry.target); } }); }, { threshold: 0.1 });
    grids.forEach(g => gridObserver.observe(g));

    /* Stats Count Up */
    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        let counted = false;
        const statsObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting && !counted) { counted = true; statsSection.querySelectorAll('[data-count]').forEach(el => { const target = parseInt(el.getAttribute('data-count')); if (isNaN(target)) { el.style.opacity = '1'; return; } animateCount(el, target, 1500); }); statsSection.querySelectorAll('[data-fade]').forEach(el => { el.style.opacity = '1'; }); statsObserver.unobserve(entry.target); } }); }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    function animateCount(el, target, duration) {
        const start = performance.now(); const suffix = el.getAttribute('data-suffix') || '';
        function update(now) { const elapsed = now - start; const progress = Math.min(elapsed / duration, 1); const eased = 1 - Math.pow(1 - progress, 4); el.textContent = Math.round(eased * target) + suffix; if (progress < 1) requestAnimationFrame(update); }
        requestAnimationFrame(update);
    }

    /* Stacking Cards */
    const stackSection = document.querySelector('.stack-section');
    if (stackSection) {
        const cards = stackSection.querySelectorAll('.stack-card');
        if (window.innerWidth <= 768) { cards.forEach(c => c.classList.add('active')); return; }
        window.addEventListener('scroll', () => {
            const rect = stackSection.getBoundingClientRect();
            const scrollInSection = -rect.top;
            const progress = Math.max(0, Math.min(1, scrollInSection / (stackSection.offsetHeight - window.innerHeight)));
            const cardIndex = Math.min(Math.floor(progress * cards.length), cards.length - 1);
            cards.forEach((card, i) => { card.classList.toggle('active', i <= cardIndex); });
        });
    }
});
