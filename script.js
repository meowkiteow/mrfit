document.addEventListener('DOMContentLoaded', () => {
    // Hero Slides + Video — synced crossfade
    const bgVideo1 = document.getElementById("bgVideo1");
    const bgVideo2 = document.getElementById("bgVideo2");
    const heroSlide1 = document.getElementById("heroSlide1");
    const heroSlide2 = document.getElementById("heroSlide2");

    if (bgVideo1 && bgVideo2 && heroSlide1 && heroSlide2) {
        let isVideo1Active = true;

        setInterval(() => {
            if (isVideo1Active) {
                // Switch to Video 2 + Slide 2
                bgVideo2.classList.add('active');
                bgVideo1.classList.remove('active');
                heroSlide2.classList.add('active');
                heroSlide1.classList.remove('active');
            } else {
                // Switch to Video 1 + Slide 1
                bgVideo1.classList.add('active');
                bgVideo2.classList.remove('active');
                heroSlide1.classList.add('active');
                heroSlide2.classList.remove('active');
            }
            isVideo1Active = !isVideo1Active;
        }, 12000); // Crossfade every 12 seconds
    }

    /* ══════════════════════════════════════════════════ */
    /* ══ CIRCLE EXPAND TRANSITION ══ */
    /* ══════════════════════════════════════════════════ */
    const joinUsBtn = document.getElementById('joinUsBtn');
    const circleTransition = document.getElementById('circleTransition');

    if (joinUsBtn && circleTransition) {
        joinUsBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Get button center coordinates
            const rect = joinUsBtn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            // Set the origin point as CSS variables
            circleTransition.style.setProperty('--cx', cx + 'px');
            circleTransition.style.setProperty('--cy', cy + 'px');

            // Trigger the expanding circle
            circleTransition.classList.add('expanding');

            // Navigate to join page after circle fills the screen
            setTimeout(() => {
                window.location.href = 'join.html';
            }, 900);
        });
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
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
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

    // Initial bar heights
    musicBars.forEach(bar => {
        bar.style.height = bar.getAttribute('data-h') + 'px';
    });

});
