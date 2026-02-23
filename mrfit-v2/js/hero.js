document.addEventListener('DOMContentLoaded', () => {
    const heroContent = [
        { videoSrc: './assets/videos/Here_is_the_1080p_202602221708.mp4', tag: 'STRENGTH', heading: 'SILENCE EXCUSES.', subtext: 'Competition-grade iron for those who demand results. No fluff. Just work.', buttonText: 'Start the Grind', buttonLink: './join.html' },
        { videoSrc: './assets/videos/Trainer_and_Member_Video_Generated.mp4', tag: 'COACHING', heading: 'PURE PROGRESS.', subtext: 'Master your mechanics with elite coaching. We map the blueprint, you execute.', buttonText: 'Meet Your Coach', buttonLink: './trainers.html' },
        { videoSrc: './assets/videos/Video_Generation_Successful.mp4', tag: 'ENDURANCE', heading: 'PUSH PAST\nTHE LIMIT.', subtext: 'High-intensity cardio. Built for those who refuse to slow down.', buttonText: 'Explore the Facility', buttonLink: './about.html' },
        { videoSrc: './assets/videos/Here_is_the_1080p_202602221708.mp4', tag: 'COMMUNITY', heading: 'YOU ARE\nNOT ALONE.', subtext: 'Train alongside driven people. The energy here is contagious.', buttonText: 'Join the Community', buttonLink: './join.html' },
        { videoSrc: './assets/videos/Trainer_and_Member_Video_Generated.mp4', tag: 'EQUIPMENT', heading: 'TOOLS FOR\nTHE SERIOUS.', subtext: 'Premium machines. Zero wait time. Maximum performance.', buttonText: 'See What We Have', buttonLink: './about.html' }
    ];

    let currentSlide = 0, autoplayTimer = null;
    const heroVideo = document.getElementById('heroVideo'), heroTag = document.getElementById('heroTag'), heroHeading = document.getElementById('heroHeading'), heroSubtext = document.getElementById('heroSubtext'), heroBtn = document.getElementById('heroBtn'), heroBtnText = document.getElementById('heroBtnText'), heroTextWrap = document.getElementById('heroTextWrap'), dots = document.querySelectorAll('.hero-dot');
    if (!heroVideo || !heroTag) return;

    function goToSlide(index) {
        currentSlide = index;
        const slide = heroContent[index];
        heroTextWrap.style.opacity = '0';
        heroVideo.style.opacity = '0';
        setTimeout(() => { heroVideo.src = slide.videoSrc; heroVideo.load(); heroVideo.play(); heroVideo.style.opacity = '1'; }, 300);
        setTimeout(() => { heroTag.textContent = slide.tag; heroHeading.innerHTML = slide.heading.replace(/\n/g, '<br>'); heroSubtext.textContent = slide.subtext; heroBtnText.textContent = slide.buttonText; heroBtn.href = slide.buttonLink; heroTextWrap.style.opacity = '1'; }, 400);
        dots.forEach((dot, i) => { dot.classList.toggle('active', i === index); });
    }

    function nextSlide() { goToSlide((currentSlide + 1) % heroContent.length); }
    function startAutoplay() { clearInterval(autoplayTimer); autoplayTimer = setInterval(nextSlide, 7000); }
    dots.forEach((dot, i) => { dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); }); });
    goToSlide(0); startAutoplay();
});
