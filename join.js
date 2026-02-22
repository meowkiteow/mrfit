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
    /* ══ AMBIENT MUSIC (WEB AUDIO API) ══ */
    /* ══════════════════════════════════════════════════ */
    const musicBtn = document.getElementById('musicBtn');
    const musicBars = document.querySelectorAll('.music-bars .bar');
    let isMusicPlaying = false;
    let audioContext = null;
    let masterGain = null;
    let oscillators = [];
    let animationFrameId = null;

    function startMusic() {
        if (audioContext) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.15;
        masterGain.connect(audioContext.destination);
        const notes = [130.81, 164.81, 196.00, 261.63];
        notes.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            osc.type = i % 2 === 0 ? "sine" : "triangle";
            osc.frequency.value = freq;
            const lfo = audioContext.createOscillator();
            lfo.type = "sine"; lfo.frequency.value = 0.3 + i * 0.1;
            const lfoGain = audioContext.createGain(); lfoGain.gain.value = 2;
            lfo.connect(lfoGain); lfoGain.connect(osc.frequency); lfo.start();
            const voiceGain = audioContext.createGain(); voiceGain.gain.value = 0.25;
            osc.connect(voiceGain); voiceGain.connect(masterGain); osc.start();
            oscillators.push(osc);
        });
        const bufferSize = audioContext.sampleRate * 2;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = (Math.random() * 2 - 1) * 0.02; }
        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = noiseBuffer; noiseSource.loop = true;
        const noiseFilter = audioContext.createBiquadFilter();
        noiseFilter.type = "lowpass"; noiseFilter.frequency.value = 800;
        noiseSource.connect(noiseFilter); noiseFilter.connect(masterGain); noiseSource.start();
        isMusicPlaying = true;
        animateBars();
    }

    function stopMusic() {
        if (masterGain && audioContext) {
            masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
            setTimeout(() => {
                if (audioContext) { audioContext.close(); audioContext = null; masterGain = null; oscillators = []; }
            }, 500);
        }
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
