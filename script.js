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
    /* ══ CIRCLE EXPAND TRANSITION — ALL PAGE LINKS ══ */
    /* ══════════════════════════════════════════════════ */
    const circleTransition = document.getElementById('circleTransition');

    if (circleTransition) {
        // Apply circle transition to ALL links that navigate to .html pages
        const pageLinks = document.querySelectorAll(
            'a[href$=".html"], .offer-cta, .section-cta, .cta-btn-primary, .cta-btn-secondary, .why-befit-btn, .nav-cta, .cart-btn'
        );

        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // Skip anchor-only links (#) and external links
                if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('javascript')) return;

                e.preventDefault();

                // ── Particle burst from click position ──
                const colors = ['#cc0000', '#ff0000', '#fff', '#ff6b6b', '#ffd93d'];
                for (let i = 0; i < 12; i++) {
                    const particle = document.createElement('span');
                    particle.classList.add('btn-particle');
                    const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
                    const dist = 40 + Math.random() * 60;
                    particle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
                    particle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
                    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                    particle.style.width = (4 + Math.random() * 6) + 'px';
                    particle.style.height = particle.style.width;
                    // Position at click point relative to button
                    const btnRect = link.getBoundingClientRect();
                    particle.style.left = (e.clientX - btnRect.left) + 'px';
                    particle.style.top = (e.clientY - btnRect.top) + 'px';
                    link.style.position = 'relative';
                    link.style.overflow = 'visible';
                    link.appendChild(particle);
                    setTimeout(() => particle.remove(), 750);
                }

                // Set circle origin to actual click position
                circleTransition.style.setProperty('--cx', e.clientX + 'px');
                circleTransition.style.setProperty('--cy', e.clientY + 'px');

                // Trigger the expanding circle
                circleTransition.classList.add('expanding');

                // Navigate after circle fills the screen
                setTimeout(() => {
                    window.location.href = href;
                }, 900);

                // Safety fallback: if navigation fails or is blocked, remove the overlay after 3 seconds
                setTimeout(() => {
                    circleTransition.classList.remove('expanding');
                }, 3000);
            });
        });

        // Fix for BFCache (when user hits the browser Back button)
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) {
                circleTransition.classList.remove('expanding');
            }
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

    // ══ STATS COUNTER-UP ANIMATION ══
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'));
                    const duration = 1500;
                    const start = performance.now();
                    function tick(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target);
                        if (progress < 1) requestAnimationFrame(tick);
                        else el.textContent = target;
                    }
                    requestAnimationFrame(tick);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => counterObserver.observe(el));
    }

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
