document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('pillHamburger');
    const overlay = document.getElementById('overlayMenu');
    const closeBtn = document.getElementById('overlayClose');
    const overlayLinks = document.querySelectorAll('.overlay-links a');

    if (hamburger && overlay) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            overlay.classList.toggle('active');
            document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
        });
        if (closeBtn) { closeBtn.addEventListener('click', () => { hamburger.classList.remove('open'); overlay.classList.remove('active'); document.body.style.overflow = ''; }); }
        overlayLinks.forEach(link => { link.addEventListener('click', () => { hamburger.classList.remove('open'); overlay.classList.remove('active'); document.body.style.overflow = ''; }); });
    }

    const musicBtn = document.getElementById('pillMusic');
    let audio = null, isMusicPlaying = false;
    if (musicBtn) {
        audio = new Audio('tunetank-jazz-cafe-music-348267.mp3');
        audio.loop = true; audio.volume = 0.35;
        musicBtn.addEventListener('click', () => {
            if (isMusicPlaying) { audio.pause(); isMusicPlaying = false; musicBtn.classList.remove('playing'); }
            else { audio.play(); isMusicPlaying = true; musicBtn.classList.add('playing'); }
        });
    }
});
