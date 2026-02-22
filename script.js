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
            lfo.type = "sine";
            lfo.frequency.value = 0.3 + i * 0.1;

            const lfoGain = audioContext.createGain();
            lfoGain.gain.value = 2;

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();

            const voiceGain = audioContext.createGain();
            voiceGain.gain.value = 0.25;

            osc.connect(voiceGain);
            voiceGain.connect(masterGain);
            osc.start();
            oscillators.push(osc);
        });

        // Noise
        const bufferSize = audioContext.sampleRate * 2;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = (Math.random() * 2 - 1) * 0.02; }
        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const noiseFilter = audioContext.createBiquadFilter();
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.value = 800;

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(masterGain);
        noiseSource.start();

        isMusicPlaying = true;
        animateBars();
    }

    function stopMusic() {
        if (masterGain && audioContext) {
            masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
            setTimeout(() => {
                if (audioContext) {
                    audioContext.close();
                    audioContext = null;
                    masterGain = null;
                    oscillators = [];
                }
            }, 500);
        }
        isMusicPlaying = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        // Reset bars to base heights
        musicBars.forEach(bar => {
            bar.style.height = bar.getAttribute('data-h') + 'px';
            bar.style.backgroundColor = 'rgba(3, 3, 3, 0.4)';
        });
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    function animateBars() {
        if (!isMusicPlaying) return;
        const time = Date.now() / 1000;
        musicBars.forEach((bar, i) => {
            const baseH = parseFloat(bar.getAttribute('data-h'));
            const mod = Math.sin(time * (1.5 + i * 0.2) + i) * 0.5 + 0.5; // 0 to 1
            const h = baseH + mod * (baseH * 1.2);
            bar.style.height = h + 'px';
            bar.style.backgroundColor = '#030303';
        });
        animationFrameId = requestAnimationFrame(animateBars);
    }

    musicBtn.addEventListener('click', toggleMusic);

    // Initial setting for bar heights
    musicBars.forEach(bar => {
        bar.style.height = bar.getAttribute('data-h') + 'px';
    });

});
