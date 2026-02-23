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

            // ── Particle burst effect ──
            const btnRect = joinUsBtn.getBoundingClientRect();
            const colors = ['#d12229', '#d1c9b8', '#fff', '#ff6b6b', '#ffd93d', '#6bcb77'];
            for (let i = 0; i < 18; i++) {
                const particle = document.createElement('span');
                particle.classList.add('btn-particle');
                const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.5;
                const dist = 40 + Math.random() * 60;
                particle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
                particle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.width = (4 + Math.random() * 6) + 'px';
                particle.style.height = particle.style.width;
                particle.style.left = '50%';
                particle.style.top = '50%';
                joinUsBtn.appendChild(particle);
                setTimeout(() => particle.remove(), 750);
            }

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

    // ══ STACKING CARDS (CodyHouse) ══
    (function () {
        var stackCardsEls = document.getElementsByClassName('js-stack-cards');
        if (stackCardsEls.length === 0) return;

        var StackCards = function (el) {
            this.element = el;
            this.items = el.getElementsByClassName('js-stack-cards__item');
            this.scrollingFn = false;
            this.scrolling = false;
            this.init();
        };

        StackCards.prototype.init = function () {
            this.setProps();
            var self = this;
            var observer = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    if (!self.scrollingFn) {
                        self.scrollingFn = function () {
                            if (!self.scrolling) {
                                self.scrolling = true;
                                requestAnimationFrame(function () { self.animate(); });
                            }
                        };
                        window.addEventListener('scroll', self.scrollingFn);
                    }
                } else {
                    if (self.scrollingFn) {
                        window.removeEventListener('scroll', self.scrollingFn);
                        self.scrollingFn = false;
                    }
                }
            }, { threshold: [0, 1] });
            observer.observe(this.element);

            window.addEventListener('resize', function () {
                clearTimeout(self._resizeTimer);
                self._resizeTimer = setTimeout(function () { self.setProps(); }, 300);
            });
        };

        StackCards.prototype.setProps = function () {
            var gap = getComputedStyle(this.element).getPropertyValue('--stack-cards-gap');
            // Convert gap to px
            var tempDiv = document.createElement('div');
            tempDiv.style.cssText = 'position:absolute;opacity:0;height:' + gap;
            this.element.appendChild(tempDiv);
            this.marginY = parseInt(getComputedStyle(tempDiv).height);
            this.element.removeChild(tempDiv);

            this.elementHeight = this.element.offsetHeight;
            if (this.items.length > 0) {
                var cs = getComputedStyle(this.items[0]);
                this.cardTop = Math.floor(parseFloat(cs.top));
                this.cardHeight = Math.floor(parseFloat(cs.height));
            }
            this.windowHeight = window.innerHeight;

            if (isNaN(this.marginY)) {
                this.element.style.paddingBottom = '0px';
            } else {
                this.element.style.paddingBottom = (this.marginY * (this.items.length - 1)) + 'px';
            }
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].style.transform = isNaN(this.marginY)
                    ? 'none'
                    : 'translateY(' + (this.marginY * i) + 'px)';
            }
        };

        StackCards.prototype.animate = function () {
            if (isNaN(this.marginY)) { this.scrolling = false; return; }
            var top = this.element.getBoundingClientRect().top;
            if (this.cardTop - top + this.windowHeight - this.elementHeight - this.cardHeight + this.marginY + this.marginY * this.items.length > 0) {
                this.scrolling = false; return;
            }
            for (var i = 0; i < this.items.length; i++) {
                var scrolling = this.cardTop - top - i * (this.cardHeight + this.marginY);
                if (scrolling > 0) {
                    var scaling = (i === this.items.length - 1) ? 1 : (this.cardHeight - scrolling * 0.05) / this.cardHeight;
                    this.items[i].style.transform = 'translateY(' + (this.marginY * i) + 'px) scale(' + scaling + ')';
                } else {
                    this.items[i].style.transform = 'translateY(' + (this.marginY * i) + 'px)';
                }
            }
            this.scrolling = false;
        };

        for (var i = 0; i < stackCardsEls.length; i++) {
            new StackCards(stackCardsEls[i]);
        }
    })();

});
