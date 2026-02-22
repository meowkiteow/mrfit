document.addEventListener('DOMContentLoaded', () => {

    /* ══════════════════════════════════════════════════ */
    /* ══ PAGE REVEAL ANIMATION ══ */
    /* ══════════════════════════════════════════════════ */
    const pageReveal = document.getElementById('pageReveal');
    if (pageReveal) {
        // Shrink the circle after a brief moment to reveal the page
        setTimeout(() => {
            pageReveal.classList.add('shrink');
        }, 100);
        // Remove from DOM after animation completes
        setTimeout(() => {
            pageReveal.style.display = 'none';
        }, 1000);
    }

    /* ══════════════════════════════════════════════════ */
    /* ══ NAVBAR LOGIC ══ */
    /* ══════════════════════════════════════════════════ */
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            menuBtn.classList.add('open');
            navMenu.classList.add('open');
            navOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden';
        } else {
            menuBtn.classList.remove('open');
            navMenu.classList.remove('open');
            navOverlay.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
    }));

    /* ══════════════════════════════════════════════════ */
    /* ══ MUSIC PLAYER (MP3) ══ */
    /* ══════════════════════════════════════════════════ */
    const musicBtn = document.getElementById('musicBtn');
    const musicBars = document.querySelectorAll('.music-bars .bar');
    let isMusicPlaying = false;
    let animationFrameId = null;

    const audio = new Audio('tunetank-jazz-cafe-music-348267.mp3');
    audio.loop = true;
    audio.volume = 0.4;

    function startMusic() {
        audio.play();
        isMusicPlaying = true;
        animateBars();
    }

    function stopMusic() {
        audio.pause();
        isMusicPlaying = false;
        if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; }
        musicBars.forEach(bar => {
            bar.style.height = bar.getAttribute('data-h') + 'px';
            bar.style.backgroundColor = 'rgba(3, 3, 3, 0.4)';
        });
    }

    function toggleMusic() {
        if (isMusicPlaying) { stopMusic(); } else { startMusic(); }
    }

    function animateBars() {
        if (!isMusicPlaying) return;
        const time = Date.now() / 1000;
        musicBars.forEach((bar, i) => {
            const baseH = parseFloat(bar.getAttribute('data-h'));
            const mod = Math.sin(time * (1.5 + i * 0.2) + i) * 0.5 + 0.5;
            const h = baseH + mod * (baseH * 1.2);
            bar.style.height = h + 'px';
            bar.style.backgroundColor = '#030303';
        });
        animationFrameId = requestAnimationFrame(animateBars);
    }

    musicBtn.addEventListener('click', toggleMusic);
    musicBars.forEach(bar => { bar.style.height = bar.getAttribute('data-h') + 'px'; });

    /* ══════════════════════════════════════════════════ */
    /* ══ CARD HOVER TILT EFFECT ══ */
    /* ══════════════════════════════════════════════════ */
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
