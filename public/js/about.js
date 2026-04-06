// about.js — Полная версия с автопрокруткой + ЗАЩИТА ОТ КАШИ (с исключением зоны перехода)

document.body.style.overflow = 'auto';
document.documentElement.style.overflow = 'auto';

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Переменные для автопрокрутки
let autoScrollAnimationId = null;
let isAutoScrolling = false;

// ====================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ======================
let firstImageClone = null;
let fourthClone = null;
let cardClone = null;

let phase2Active = false;
let transitionActive = false;
let isTransitionActive = false;
let hasSwitched = false;
let indicatorAdded = false;
let lastRotationY = 0;
let isHovering = false;

let glitchContainer = null;
let glitchCanvas = null;
let glitchAnimationId = null;
let isGlitchActive = false;

// Флаги для защиты от повторных сбросов
let isResetting = false;
let lastProgress = {};

// ============================================================================

// ========== ЭКРАН ЗАГРУЗКИ ==========
(function createLoadingScreen() {
    const barcodeWidths = [2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 1, 1, 2];
    let progress = 0;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-screen';
    loadingDiv.innerHTML = `
        <div class="loading-container">
            <div class="loading-triangles">
                <svg viewBox="0 0 100 100" class="triangles-svg">
                    <polygon points="50,10 90,90 10,90" fill="none" stroke="#000" stroke-width="2" class="triangle-outer" />
                    <polygon points="50,25 75,75 25,75" fill="none" stroke="#000" stroke-width="1" class="triangle-middle" />
                    <polygon points="50,40 60,60 40,60" fill="#000" class="triangle-inner" />
                </svg>
            </div>
            <div class="progress-container">
                <div class="progress-header">
                    <span class="progress-label">Loading</span>
                    <span class="progress-percent">0%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill"></div>
                </div>
            </div>
            <div class="barcode-container" id="barcode-container"></div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.id = 'loading-screen-styles';
    style.textContent = `
        #loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease, visibility 0.5s ease;
            font-family: monospace;
        }
        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 32px;
        }
        .loading-triangles {
            position: relative;
            width: 64px;
            height: 64px;
            animation: pulseGlow 1.5s ease-in-out infinite;
        }
        .triangles-svg {
            width: 100%;
            height: 100%;
        }
        .triangle-outer {
            animation: pulse 1.5s ease-in-out infinite;
        }
        .triangle-middle {
            animation: pulse 1.5s ease-in-out infinite;
            animation-delay: 0.2s;
        }
        .triangle-inner {
            animation: pulse 1.5s ease-in-out infinite;
            animation-delay: 0.4s;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        @keyframes pulseGlow {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .progress-container {
            width: 256px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .progress-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #000000;
            font-family: monospace;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .progress-bar-bg {
            height: 1px;
            background-color: #e5e7eb;
            position: relative;
            overflow: hidden;
        }
        .progress-bar-fill {
            height: 100%;
            background-color: #000000;
            transition: width 0.1s ease;
            width: 0%;
        }
        .barcode-container {
            display: flex;
            gap: 2px;
            height: 32px;
        }
        .barcode-bar {
            background-color: #000000;
            transition: opacity 0.2s ease;
        }
        #loading-screen.hide {
            opacity: 0;
            visibility: hidden;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingDiv);
    
    const barcodeContainer = loadingDiv.querySelector('#barcode-container');
    barcodeWidths.forEach((width) => {
        const bar = document.createElement('div');
        bar.className = 'barcode-bar';
        bar.style.width = `${width}px`;
        bar.style.height = '100%';
        bar.style.opacity = '0.2';
        barcodeContainer.appendChild(bar);
    });
    
    const barcodeBars = document.querySelectorAll('.barcode-bar');
    const progressBar = loadingDiv.querySelector('.progress-bar-fill');
    const percentText = loadingDiv.querySelector('.progress-percent');
    
    const interval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (percentText) percentText.textContent = `${Math.floor(progress)}%`;
        barcodeBars.forEach((bar, i) => {
            if (progress > i * 3.33) bar.style.opacity = '1';
        });
    }, 100);
    
    setTimeout(() => {
        clearInterval(interval);
        progress = 100;
        if (progressBar) progressBar.style.width = '100%';
        if (percentText) percentText.textContent = '100%';
        barcodeBars.forEach(bar => bar.style.opacity = '1');
        
        setTimeout(() => {
            loadingDiv.classList.add('hide');
            setTimeout(() => {
                if (loadingDiv && loadingDiv.parentNode) loadingDiv.remove();
                const styleElement = document.getElementById('loading-screen-styles');
                if (styleElement) styleElement.remove();
            }, 500);
        }, 200);
    }, 1500);
})();

// ========== ПРОВЕРКА, НАХОДИМСЯ ЛИ МЫ В ЗОНЕ ПЕРЕХОДА STORY ↔ CARDS ==========
function isInTransitionZone(progress, direction) {
    const transitionStart = 0.84;
    const transitionEnd = 0.98;
    const buffer = 0.03;
    const inZone = (progress >= transitionStart - buffer && progress <= transitionEnd + buffer);
    if (inZone) return true;
    const isExiting = (progress > transitionEnd && progress < transitionEnd + buffer);
    if (isExiting) return true;
    return false;
}

// ========== ЗАЩИТНАЯ ОБЁРТКА С ИСКЛЮЧЕНИЕМ ЗОНЫ ПЕРЕХОДА ==========
function safeOnUpdate(self, originalLogic) {
    const progress = self.progress;
    const direction = self.direction;
    const triggerId = self.trigger?.id || self.trigger?.className || 'unknown';
    const inTransitionZone = isInTransitionZone(progress, direction);
    
    if (lastProgress[triggerId] !== undefined && !inTransitionZone) {
        const delta = Math.abs(lastProgress[triggerId] - progress);
        if (delta > 0.35) {
            console.warn(`⚠️ Large jump detected (delta: ${delta.toFixed(2)}), resetting (excluding transition zone)`);
            forceResetAllTransitions(direction === -1);
        }
    }
    lastProgress[triggerId] = progress;
    originalLogic(self);
}

// ========== УЛУЧШЕННЫЙ СБРОС С ЗАЩИТОЙ ОТ ПОВТОРОВ ==========
function forceResetAllTransitions(isReverse = false) {
    if (isResetting) {
        console.log('⏭️ Skip reset - already in progress');
        return;
    }
    
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (isInTransitionZone(scrollProgress, isReverse ? -1 : 1)) {
        console.log('⏭️ Skip reset - in transition zone');
        return;
    }
    
    isResetting = true;
    console.warn(`%c🔄 RESET (reverse: ${isReverse})`, 'color:#ff8800;font-weight:bold');

    if (firstImageClone && firstImageClone.parentNode) firstImageClone.remove();
    if (fourthClone && fourthClone.parentNode) fourthClone.remove();
    if (cardClone && cardClone.parentNode) cardClone.remove();

    firstImageClone = null;
    fourthClone = null;
    cardClone = null;
    phase2Active = false;
    transitionActive = false;
    isTransitionActive = false;
    hasSwitched = false;
    indicatorAdded = false;
    lastRotationY = 0;
    isHovering = false;

    const hero = document.getElementById('heroImageBlock');
    const second = document.getElementById('secondImageBlock');
    const third = document.getElementById('thirdImageBlock');
    const fourth = document.getElementById('fourthImageBlock');
    const cardsSection = document.getElementById('cards');
    const carouselSection = document.getElementById('cardsCarousel');
    const thumbnailPlaceholder = document.getElementById('thumbnailPlaceholder');
    const storyFixedContent = document.getElementById('storyFixedContent');

    if (hero) gsap.killTweensOf(hero);
    if (second) gsap.killTweensOf(second);
    if (third) gsap.killTweensOf(third);
    if (fourth) gsap.killTweensOf(fourth);
    if (cardsSection) gsap.killTweensOf(cardsSection);
    if (carouselSection) gsap.killTweensOf(carouselSection);

    if (hero) {
        gsap.set(hero, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
            zIndex: 20, borderRadius: 0, opacity: 1, visibility: 'visible', display: 'block', y: 0
        });
    }
    if (second) {
        gsap.set(second, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
            zIndex: 25, opacity: 0, visibility: 'hidden', rotationY: 0, y: 0
        });
        second.classList.remove('active');
    }
    if (third) {
        gsap.set(third, {
            position: 'fixed', top: '100vh', left: 0, width: '100%', height: '100vh',
            zIndex: 30, opacity: 1, visibility: 'visible', y: 0
        });
    }
    if (fourth) {
        gsap.set(fourth, {
            position: 'fixed', top: '200vh', left: 0, width: '100%', height: '100vh',
            zIndex: 35, opacity: 1, visibility: 'visible', y: 0
        });
    }
    if (thumbnailPlaceholder) {
        thumbnailPlaceholder.innerHTML = '';
        gsap.set(thumbnailPlaceholder, { opacity: 0, visibility: 'hidden' });
    }
    if (cardsSection) {
        gsap.set(cardsSection, { visibility: 'hidden', opacity: 0 });
    }
    if (carouselSection) {
        carouselSection.classList.remove('visible');
        gsap.set(carouselSection, { opacity: 0 });
    }
    const secondText = second?.querySelector('.second-text');
    const thirdText = third?.querySelector('.third-text');
    const fourthText = fourth?.querySelector('.fourth-text');
    if (secondText) gsap.set(secondText, { opacity: 0 });
    if (thirdText) gsap.set(thirdText, { opacity: 0 });
    if (fourthText) gsap.set(fourthText, { opacity: 0 });
    if (storyFixedContent) {
        storyFixedContent.style.display = 'flex';
        gsap.set(storyFixedContent, { opacity: 1 });
    }
    document.querySelector('.thumbnail-indicator')?.remove();
    if (typeof triggerGlitchTimeShift === 'function') triggerGlitchTimeShift(false);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    setTimeout(() => { isResetting = false; }, 300);
    console.log('✅ Reset complete');
}

// ========== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - about.js with transition zone protection');
    window.scrollTo(0, 0);
    
    initStoryAnimation();
    initCardsTransition();
    initCarouselTransition();
    initScrollHint();
    initSmoothScroll();
    initAutoScroll();
    initGlitchTimeShift();
    initEdgeScroll();
    
    setTimeout(() => {
        animateTitleLetters();
    }, 500);
    
    const carouselObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const carouselSection = document.getElementById('cardsCarousel');
                if (carouselSection && carouselSection.classList.contains('visible')) {
                    setTimeout(() => {
                        addCornerMarkers();
                        initVideoCards();
                    }, 300);
                }
            }
        });
    });
    
    const carouselSection = document.getElementById('cardsCarousel');
    if (carouselSection) {
        carouselObserver.observe(carouselSection, { attributes: true });
    }
    
    setTimeout(() => {
        const carouselSection = document.getElementById('cardsCarousel');
        if (carouselSection && carouselSection.classList.contains('visible')) {
            addCornerMarkers();
            initVideoCards();
        }
    }, 1000);
    
    setTimeout(() => {
        addGlitchEffect();
    }, 1000);
});

// ========== ИНИЦИАЛИЗАЦИЯ ВИДЕО КАРТ ==========
function initVideoCards() {
    const videoCards = document.querySelectorAll('.video-card');
    console.log('Initializing video cards, found:', videoCards.length);
    
    videoCards.forEach((card, index) => {
        const video = card.querySelector('.card-video');
        if (!video) return;
        
        // Убедимся что видео настроено правильно
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        
        // Удаляем старые обработчики, если есть
        const oldMouseEnter = card.onmouseenter;
        const oldMouseLeave = card.onmouseleave;
        
        // Добавляем новые обработчики
        card.addEventListener('mouseenter', (e) => {
            e.stopPropagation();
            if (video) {
                video.currentTime = 0;
                video.play().catch(err => console.log('Video play error:', err));
            }
        });
        
        card.addEventListener('mouseleave', (e) => {
            e.stopPropagation();
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
        
        // Для touch устройств
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (video) {
                if (video.paused) {
                    video.play().catch(err => console.log('Video play error:', err));
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
        
        console.log('Video card', index, 'initialized');
    });
}

// ========== STORY ANIMATION ==========
function initStoryAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const heroImageBlock   = document.getElementById('heroImageBlock');
    const secondImageBlock = document.getElementById('secondImageBlock');
    const thirdImageBlock  = document.getElementById('thirdImageBlock');
    const fourthImageBlock = document.getElementById('fourthImageBlock');
    const thumbnailPlaceholder = document.getElementById('thumbnailPlaceholder');
    const storyLeft        = document.getElementById('storyLeft');
    const storyFixedContent = document.getElementById('storyFixedContent');

    const secondText = secondImageBlock ? secondImageBlock.querySelector('.second-text') : null;
    const thirdText  = thirdImageBlock  ? thirdImageBlock.querySelector('.third-text')  : null;
    const fourthText = fourthImageBlock ? fourthImageBlock.querySelector('.fourth-text') : null;

    if (!heroImageBlock || !thumbnailPlaceholder || !storyLeft) return;

    gsap.set(heroImageBlock, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 20, y: 0, borderRadius: 0, opacity: 1, display: 'block' });
    gsap.set(secondImageBlock, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 25, opacity: 0, visibility: 'hidden', rotationY: 0, transformPerspective: 1000, borderRadius: 0 });
    gsap.set(thirdImageBlock, { position: 'fixed', top: '100vh', left: 0, width: '100%', height: '100vh', zIndex: 30, opacity: 1, visibility: 'visible', borderRadius: 0 });
    gsap.set(fourthImageBlock, { position: 'fixed', top: '200vh', left: 0, width: '100%', height: '100vh', zIndex: 35, opacity: 1, visibility: 'visible', borderRadius: 0 });

    if (secondText) gsap.set(secondText, { opacity: 0 });
    if (thirdText)  gsap.set(thirdText,  { opacity: 0 });
    if (fourthText) gsap.set(fourthText, { opacity: 0 });

    function enterPhase2() {
        gsap.set(heroImageBlock, { display: 'none', opacity: 0, visibility: 'hidden' });
        if (!thumbnailPlaceholder.querySelector('img')) {
            const heroImg = heroImageBlock.querySelector('.hero-img');
            if (heroImg) {
                thumbnailPlaceholder.innerHTML = '';
                const clonedImg = heroImg.cloneNode(true);
                clonedImg.style.cssText = 'width:100%; height:100%; object-fit:cover;';
                thumbnailPlaceholder.appendChild(clonedImg);
            }
        }
        const rect = storyLeft.getBoundingClientRect();
        firstImageClone = thumbnailPlaceholder.cloneNode(true);
        Object.assign(firstImageClone.style, {
            position: 'fixed', top: rect.top + 'px', left: rect.left + 'px',
            width: rect.width + 'px', height: rect.height + 'px',
            borderRadius: '20px', overflow: 'hidden', zIndex: '105', opacity: '1'
        });
        document.body.appendChild(firstImageClone);

        gsap.set(secondImageBlock, {
            position: 'fixed', top: rect.top, left: rect.left, width: rect.width, height: rect.height,
            borderRadius: '20px', opacity: 0, visibility: 'visible', zIndex: 110, rotationY: 0
        });
        secondImageBlock.classList.add('active');
        gsap.set(thumbnailPlaceholder, { opacity: 0, visibility: 'hidden' });
        document.querySelector('.thumbnail-indicator')?.remove();
        phase2Active = true;
    }

    function exitPhase2() {
        if (firstImageClone) { 
            firstImageClone.remove(); 
            firstImageClone = null; 
        }
        thumbnailPlaceholder.innerHTML = '';
        gsap.set(thumbnailPlaceholder, { opacity: 0, visibility: 'hidden' });
        gsap.set(secondImageBlock, { opacity: 0, visibility: 'hidden', rotationY: 0 });
        secondImageBlock.classList.remove('active');
        gsap.set(heroImageBlock, { display: 'block', opacity: 1, visibility: 'visible' });
        phase2Active = false;
    }

    function addIndicator() {
        if (document.querySelector('.thumbnail-indicator')) return;
        const indicator = document.createElement('div');
        indicator.className = 'thumbnail-indicator';
        indicator.innerHTML = '↓ SCROLL FOR 3D FLIP ↓';
        storyLeft.style.position = 'relative';
        storyLeft.appendChild(indicator);
    }

    ScrollTrigger.create({
        trigger: '.story-section',
        start: 'top top',
        end: '+=850%',
        scrub: 3,
        fastScrollEnd: true,
        preventOverlaps: true,

        onUpdate: (self) => safeOnUpdate(self, (self) => {
            const progress = self.progress;
            const phase1End   = 0.14;
            const phase2Start = 0.20;
            const phase2End   = 0.34;
            const phase3Start = 0.40;
            const phase3End   = 0.64;
            const phase4Start = 0.68;
            const phase4End   = 0.82;

            if (progress >= phase2Start && !phase2Active) enterPhase2();
            else if (progress < phase2Start && phase2Active) exitPhase2();

            if (progress < phase2Start && !phase2Active) {
                const target = storyLeft.getBoundingClientRect();
                gsap.set(heroImageBlock, {
                    display: 'block', opacity: 1, visibility: 'visible',
                    width: target.width, height: target.height,
                    top: target.top, left: target.left, borderRadius: '20px'
                });
            }
            if (progress <= phase1End) {
                const p = progress / phase1End;
                const target = storyLeft.getBoundingClientRect();
                const newWidth  = window.innerWidth  + (target.width  - window.innerWidth)  * p;
                const newHeight = window.innerHeight + (target.height - window.innerHeight) * p;
                const newTop    = target.top * p;
                const newLeft   = target.left * p;
                const newRadius = p * 20;
                gsap.set(heroImageBlock, { width: newWidth, height: newHeight, top: newTop, left: newLeft, borderRadius: newRadius, opacity: 1 });
                if (p >= 0.95 && !indicatorAdded) {
                    addIndicator();
                    indicatorAdded = true;
                }
            }
            else if (progress >= phase2Start && progress <= phase2End && phase2Active) {
                const p2 = (progress - phase2Start) / (phase2End - phase2Start);
                const easeProgress = Math.min(1, Math.max(0, p2));
                if (firstImageClone) gsap.set(firstImageClone, { opacity: 1 - easeProgress, scale: 1 - easeProgress * 0.3 });
                const rect = storyLeft.getBoundingClientRect();
                const targetW = window.innerWidth;
                const targetH = window.innerHeight;
                const newWidth  = rect.width  + (targetW - rect.width)  * easeProgress;
                const newHeight = rect.height + (targetH - rect.height) * easeProgress;
                const newTop    = rect.top  + (0 - rect.top)  * easeProgress;
                const newLeft   = rect.left + (0 - rect.left) * easeProgress;
                const newRadius = 20 * (1 - easeProgress);
                gsap.set(secondImageBlock, { width: newWidth, height: newHeight, top: newTop, left: newLeft, borderRadius: newRadius, opacity: easeProgress, rotationY: easeProgress * 360 });
                if (secondText) {
                    const textOpacity = Math.min(1, Math.max(0, (easeProgress - 0.5) * 2));
                    gsap.set(secondText, { opacity: textOpacity });
                }
            }
            else if (progress > phase2End && progress < phase3Start && phase2Active) {
                gsap.set(secondImageBlock, { width: '100%', height: '100vh', top: 0, left: 0, borderRadius: 0, opacity: 1, rotationY: 360 });
                if (secondText) gsap.set(secondText, { opacity: 1 });
            }
            else if (progress >= phase3Start && progress <= phase3End && phase2Active && thirdImageBlock) {
                const p3 = (progress - phase3Start) / (phase3End - phase3Start);
                const easeProgress = Math.min(1, Math.max(0, p3));
                gsap.set(secondImageBlock, { y: -easeProgress * window.innerHeight });
                if (secondText) gsap.set(secondText, { opacity: 1 - easeProgress });
                gsap.set(thirdImageBlock, { top: (1 - easeProgress) * window.innerHeight });
                if (thirdText) {
                    const textOpacity = Math.min(1, Math.max(0, (easeProgress - 0.2) * 1.2));
                    gsap.set(thirdText, { opacity: textOpacity });
                }
            }
            else if (progress >= phase4Start && progress <= phase4End && phase2Active && fourthImageBlock) {
                const p4 = (progress - phase4Start) / (phase4End - phase4Start);
                const easeProgress = Math.min(1, Math.max(0, p4));
                gsap.set(thirdImageBlock, { y: -easeProgress * window.innerHeight });
                if (thirdText) gsap.set(thirdText, { opacity: 1 - easeProgress });
                gsap.set(fourthImageBlock, { top: (1 - easeProgress) * window.innerHeight });
                if (fourthText) {
                    const textOpacity = Math.min(1, Math.max(0, (easeProgress - 0.15) * 1.2));
                    gsap.set(fourthText, { opacity: textOpacity });
                }
            }
            
            if (storyFixedContent) {
                if (progress < 0.92) {
                    storyFixedContent.style.display = 'flex';
                    gsap.set(storyFixedContent, { opacity: 1 });
                } else if (progress >= 0.92 && progress < 0.98) {
                    const fadeProgress = (progress - 0.92) / 0.06;
                    gsap.set(storyFixedContent, { opacity: 1 - fadeProgress });
                } else if (progress >= 0.98) {
                    gsap.set(storyFixedContent, { opacity: 0 });
                    storyFixedContent.style.display = 'none';
                }
            }
        }),
        onLeaveBack: () => { console.log('🔄 Story: onLeaveBack'); },
        onEnterBack: () => { console.log('🔄 Story: onEnterBack'); }
    });
}

// ========== CARDS TRANSITION ==========
function initCardsTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const fourthImageBlock = document.getElementById('fourthImageBlock');
    const cardsSection = document.getElementById('cards');
    const cardsCenter = document.getElementById('cardsCenter');
    const cardsRight = document.querySelector('.cards-right');
    const cardsLeft = document.querySelector('.cards-left');
    
    if (!fourthImageBlock || !cardsSection || !cardsCenter) return;

    let fourthCloneLocal = null;
    let transitionActiveLocal = false;
    let hasSwitchedLocal = false;
    let lastRotationYLocal = 0;

    const originalFourthSrc = fourthImageBlock.querySelector('.fourth-img')?.src || "https://picsum.photos/id/126/1200/800";
    const fifthSrc = document.querySelector('.cards-main-img')?.src || "https://picsum.photos/id/100/800/1000";

    ScrollTrigger.create({
        trigger: '.story-section',
        start: 'top top',
        end: '+=850%',
        scrub: 2.5,
        fastScrollEnd: true,
        preventOverlaps: true,

        onUpdate: (self) => safeOnUpdate(self, (self) => {
            const progress = self.progress;
            const transitionStart = 0.84;
            const transitionEnd = 0.98;
            
            if (progress >= transitionStart && progress <= transitionEnd) {
                const p = (progress - transitionStart) / (transitionEnd - transitionStart);
                const intensity = Math.max(0.6, Math.sin(p * Math.PI) * 1.4);
                triggerGlitchTimeShift(true, intensity);
            } else if (isGlitchActive) {
                triggerGlitchTimeShift(false);
            }
            
            if (progress >= transitionStart && progress <= transitionEnd) {
                const p = (progress - transitionStart) / (transitionEnd - transitionStart);
                const easeProgress = Math.min(1, Math.max(0, p));
                const currentRotationY = easeProgress * 180;
                
                if (easeProgress > 0.05 && !fourthCloneLocal && !transitionActiveLocal) {
                    transitionActiveLocal = true;
                    const fourthImg = fourthImageBlock.querySelector('.fourth-img');
                    if (fourthImg) {
                        fourthCloneLocal = fourthImg.cloneNode(true);
                        const rect = fourthImageBlock.getBoundingClientRect();
                        Object.assign(fourthCloneLocal.style, {
                            position: 'fixed', top: rect.top + 'px', left: rect.left + 'px',
                            width: rect.width + 'px', height: rect.height + 'px',
                            objectFit: 'cover', zIndex: '200', borderRadius: '0', opacity: '1'
                        });
                        document.body.appendChild(fourthCloneLocal);
                        gsap.set(cardsSection, { visibility: 'visible', opacity: 1 });
                        gsap.to(fourthImageBlock, { opacity: 0, duration: 0.5 });
                        hasSwitchedLocal = false;
                        fourthClone = fourthCloneLocal;
                    }
                }
                
                if (fourthCloneLocal) {
                    const targetRect = cardsCenter.getBoundingClientRect();
                    const startRect = fourthImageBlock.getBoundingClientRect();
                    const newWidth = startRect.width + (targetRect.width - startRect.width) * easeProgress;
                    const newHeight = startRect.height + (targetRect.height - startRect.height) * easeProgress;
                    const newTop = startRect.top + (targetRect.top - startRect.top) * easeProgress;
                    const newLeft = startRect.left + (targetRect.left - startRect.left) * easeProgress;
                    const newRadius = 20 * easeProgress;
                    const newRotationY = easeProgress * 180;
                    
                    gsap.set(fourthCloneLocal, {
                        width: newWidth, height: newHeight, top: newTop, left: newLeft,
                        borderRadius: newRadius, rotationY: newRotationY, opacity: 1 - easeProgress * 0.3
                    });
                    
                    const crossed90Forward = (lastRotationYLocal < 90 && newRotationY >= 90);
                    const crossed90Backward = (lastRotationYLocal > 90 && newRotationY <= 90);
                    
                    if (crossed90Forward && !hasSwitchedLocal) {
                        if (fourthCloneLocal.src !== fifthSrc) {
                            fourthCloneLocal.src = fifthSrc;
                            hasSwitchedLocal = true;
                        }
                    } else if (crossed90Backward && !hasSwitchedLocal) {
                        if (fourthCloneLocal.src !== originalFourthSrc) {
                            fourthCloneLocal.src = originalFourthSrc;
                            hasSwitchedLocal = true;
                        }
                    }
                    if (newRotationY > 120 || newRotationY < 60) hasSwitchedLocal = false;
                    lastRotationYLocal = newRotationY;
                }
                
                gsap.set(cardsCenter, { scale: 0.7 + easeProgress * 0.3, opacity: easeProgress, y: 30 * (1 - easeProgress) });
                gsap.set(cardsRight, { x: 80 * (1 - easeProgress), opacity: easeProgress });
                gsap.set(cardsLeft, { x: -80 * (1 - easeProgress), opacity: easeProgress });
            }
            
            if (progress > transitionEnd && fourthCloneLocal) {
                fourthCloneLocal.remove();
                fourthCloneLocal = null;
                fourthClone = null;
                transitionActiveLocal = false;
                hasSwitchedLocal = false;
                lastRotationYLocal = 0;
                gsap.set(fourthImageBlock, { opacity: 0 });
                gsap.set(cardsCenter, { scale: 1, opacity: 1, y: 0 });
                gsap.set(cardsRight, { x: 0, opacity: 1 });
                gsap.set(cardsLeft, { x: 0, opacity: 1 });
            }
            
            if (progress < transitionStart && (fourthCloneLocal || transitionActiveLocal)) {
                if (fourthCloneLocal) fourthCloneLocal.remove();
                fourthCloneLocal = null;
                fourthClone = null;
                transitionActiveLocal = false;
                hasSwitchedLocal = false;
                lastRotationYLocal = 0;
                gsap.set(fourthImageBlock, { opacity: 1 });
                gsap.set(cardsSection, { visibility: 'hidden', opacity: 0 });
                gsap.set(cardsCenter, { scale: 0.7, opacity: 0, y: 30 });
                gsap.set(cardsRight, { x: 80, opacity: 0 });
                gsap.set(cardsLeft, { x: -80, opacity: 0 });
            }
        }),
        onLeaveBack: () => { console.log('🔄 Cards: onLeaveBack - no reset (transition zone protected)'); },
        onEnterBack: () => { console.log('🔄 Cards: onEnterBack - no reset (transition zone protected)'); }
    });
}

// ========== CAROUSEL TRANSITION + КОМИКС ==========
function initCarouselTransition() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const cardsSection = document.getElementById('cards');
    const cardsCenter = document.getElementById('cardsCenter');
    const card5Image = document.getElementById('card5Image');
    const carouselSection = document.getElementById('cardsCarousel');
    const carouselTitle = document.querySelector('.carousel-title');
    const carouselSubtitle = document.querySelector('.carousel-subtitle');
    const comicSection = document.getElementById('comicSection');

    if (!cardsSection || !cardsCenter || !carouselSection) return;

    let currentCardIndex = 0;
    let isTransitionActiveLocal = false;
    let cardCloneLocal = null;
    let hintTimeout = null;

    function showCardHint(cardNumber) {
        const hint = document.getElementById('cardHint');
        const hintText = document.querySelector('.card-hint-text');
        if (!hint || !hintText) return;
        if (hintTimeout) clearTimeout(hintTimeout);
        hintText.textContent = `CARD ${cardNumber + 1}`;
        hint.classList.add('visible');
        hintTimeout = setTimeout(() => hint.classList.remove('visible'), 1500);
    }

    function addCardHandlers() {
        const allCards = document.querySelectorAll('.carousel-card');
        for (let i = 0; i < allCards.length; i++) {
            const card = allCards[i];
            const idx = i;
            if (card.hasAttribute('data-handlers-added')) continue;
            card.setAttribute('data-handlers-added', 'true');
            
            card.onmouseenter = function(e) {
                e.stopPropagation();
                isHovering = true;
                document.querySelectorAll('.carousel-card').forEach(c => c.classList.remove('active-card'));
                this.classList.add('active-card');
                currentCardIndex = idx;
                showCardHint(idx);
            };
            card.onmouseleave = function(e) {
                e.stopPropagation();
                isHovering = false;
            };
            card.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                document.querySelectorAll('.carousel-card').forEach(c => c.classList.remove('active-card'));
                this.classList.add('active-card');
                currentCardIndex = idx;
                showCardHint(idx);
            };
            card.style.cursor = 'pointer';
        }
        initVideoCards();
    }

    const spacer = document.createElement('div');
    spacer.style.height = '900vh';
    spacer.style.width = '100%';
    document.body.appendChild(spacer);

    ScrollTrigger.create({
        trigger: spacer,
        start: 'top top',
        end: '+=750%',
        scrub: 2,
        fastScrollEnd: true,
        preventOverlaps: true,

        onUpdate: (self) => safeOnUpdate(self, (self) => {
            const progress = self.progress;
            
            // === ПЕРЕХОД ИЗ CARDS В КАРУСЕЛЬ (0.10 - 0.20) ===
            if (progress >= 0.10 && progress <= 0.20) {
                const t = (progress - 0.10) / (0.20 - 0.10);
                const backward = 1 - t;
                
                if (!cardCloneLocal && !isTransitionActiveLocal && t > 0.05) {
                    isTransitionActiveLocal = true;
                    carouselSection.classList.add('visible');
                    const rect = cardsCenter.getBoundingClientRect();
                    const clone = card5Image.cloneNode(true);
                    Object.assign(clone.style, {
                        position: 'fixed', top: rect.top + 'px', left: rect.left + 'px',
                        width: rect.width + 'px', height: rect.height + 'px',
                        objectFit: 'cover', borderRadius: '20px', zIndex: '250'
                    });
                    document.body.appendChild(clone);
                    cardCloneLocal = clone;
                    cardClone = cardCloneLocal;
                }
                
                if (cardCloneLocal) {
                    const targetCard = document.querySelector('.carousel-card');
                    if (targetCard) {
                        const targetRect = targetCard.getBoundingClientRect();
                        const startRect = cardsCenter.getBoundingClientRect();
                        cardCloneLocal.style.width = startRect.width + (targetRect.width - startRect.width) * t + 'px';
                        cardCloneLocal.style.height = startRect.height + (targetRect.height - startRect.height) * t + 'px';
                        cardCloneLocal.style.left = startRect.left + (targetRect.left - startRect.left) * t + 'px';
                        cardCloneLocal.style.top = startRect.top + (targetRect.top - startRect.top) * t + 'px';
                        cardCloneLocal.style.opacity = 1 - t;
                    }
                }
                
                cardsSection.style.opacity = backward;
                carouselSection.style.opacity = t;
                
                if (carouselTitle) {
                    carouselTitle.style.opacity = t;
                    carouselTitle.style.transform = `translateY(${-20 * backward}px)`;
                }
                if (carouselSubtitle) {
                    carouselSubtitle.style.opacity = t;
                    carouselSubtitle.style.transform = `translateY(${-20 * backward}px)`;
                }
                
                if (t >= 0.99 && cardCloneLocal) {
                    cardCloneLocal.remove();
                    cardCloneLocal = null;
                    cardClone = null;
                    isTransitionActiveLocal = false;
                    carouselSection.classList.add('visible');
                    carouselSection.style.opacity = '1';
                    cardsSection.style.opacity = '0';
                    cardsSection.style.visibility = 'hidden';
                    
                    if (carouselTitle) {
                        carouselTitle.style.opacity = '1';
                        carouselTitle.style.transform = 'translateY(0)';
                    }
                    if (carouselSubtitle) {
                        carouselSubtitle.style.opacity = '1';
                        carouselSubtitle.style.transform = 'translateY(0)';
                    }
                    
                    const cards = document.querySelectorAll('.carousel-card');
                    cards.forEach(card => card.classList.remove('active-card'));
                    if (cards[0]) cards[0].classList.add('active-card');
                    currentCardIndex = 0;
                    addCardHandlers();
                }
            }
            
            // === СКРОЛЛ ВНУТРИ КАРУСЕЛИ (0.20 - 0.80) ===
            if (progress > 0.20 && progress <= 0.80 && !isHovering) {
                const cards = document.querySelectorAll('.carousel-card');
                if (cards.length) {
                    const carouselProgress = (progress - 0.20) / (0.80 - 0.20);
                    let targetIndex = Math.floor(carouselProgress * cards.length);
                    if (targetIndex >= cards.length) targetIndex = cards.length - 1;
                    if (targetIndex < 0) targetIndex = 0;
                    
                    if (currentCardIndex !== targetIndex) {
                        cards.forEach(card => card.classList.remove('active-card'));
                        cards[targetIndex].classList.add('active-card');
                        currentCardIndex = targetIndex;
                        showCardHint(currentCardIndex);
                    }
                }
            }
            
            // === ФИКСАЦИЯ НА ПОСЛЕДНЕЙ КАРТЕ (0.80 - 0.85) ===
            if (progress > 0.80 && progress <= 0.85 && !isHovering) {
                const cards = document.querySelectorAll('.carousel-card');
                if (cards.length && currentCardIndex < cards.length - 1) {
                    cards.forEach(card => card.classList.remove('active-card'));
                    cards[cards.length - 1].classList.add('active-card');
                    currentCardIndex = cards.length - 1;
                    showCardHint(currentCardIndex);
                }
            }
            
            // === ПЕРЕХОД В КОМИКС (0.85 - 1.00) ===
            if (progress > 0.85 && progress <= 1.00) {
                const comicProgress = Math.min(1, (progress - 0.85) / 0.15);
                
                // Карусель исчезает
                if (carouselSection) {
                    carouselSection.style.opacity = 1 - comicProgress;
                    if (comicProgress >= 0.95) {
                        carouselSection.classList.remove('visible');
                        carouselSection.style.visibility = 'hidden';
                    }
                }
                
                // Комикс появляется
                if (comicSection) {
                    comicSection.style.opacity = comicProgress;
                    comicSection.style.visibility = 'visible';
                    if (comicProgress > 0.05) {
                        comicSection.classList.add('visible');
                    }
                }
            }
            
            // === ВОЗВРАТ ИЗ КАРУСЕЛИ В CARDS (progress < 0.08) ===
            if (progress < 0.08 && (cardCloneLocal || isTransitionActiveLocal)) {
                if (cardCloneLocal) cardCloneLocal.remove();
                cardCloneLocal = null;
                cardClone = null;
                isTransitionActiveLocal = false;
                isHovering = false;
                
                cardsSection.style.opacity = '1';
                cardsSection.style.visibility = 'visible';
                carouselSection.classList.remove('visible');
                carouselSection.style.opacity = '0';
                carouselSection.style.visibility = 'visible';
                
                if (carouselTitle) {
                    carouselTitle.style.opacity = '0';
                    carouselTitle.style.transform = 'translateY(-20px)';
                }
                if (carouselSubtitle) {
                    carouselSubtitle.style.opacity = '0';
                    carouselSubtitle.style.transform = 'translateY(-20px)';
                }
                
                const cards = document.querySelectorAll('.carousel-card');
                cards.forEach(card => card.classList.remove('active-card'));
                currentCardIndex = 0;
                
                // Скрываем комикс
                if (comicSection) {
                    comicSection.style.opacity = '0';
                    comicSection.style.visibility = 'hidden';
                    comicSection.classList.remove('visible');
                }
            }
            
            // === ВОЗВРАТ ИЗ КОМИКСА В КАРУСЕЛЬ (progress < 0.8) ===
            if (progress < 0.8 && comicSection && comicSection.classList.contains('visible')) {
                comicSection.style.opacity = '0';
                comicSection.style.visibility = 'hidden';
                comicSection.classList.remove('visible');
                
                // Возвращаем карусель, если она была скрыта
                if (carouselSection && !carouselSection.classList.contains('visible') && progress > 0.1) {
                    carouselSection.style.opacity = '1';
                    carouselSection.style.visibility = 'visible';
                    carouselSection.classList.add('visible');
                }
            }
        }),
        onLeaveBack: () => { 
            console.log('🔄 Carousel: onLeaveBack');
        },
        onEnterBack: () => { 
            console.log('🔄 Carousel: onEnterBack');
        }
    });
}

// ========== GLITCH TIME SHIFT ==========
function initGlitchTimeShift() {
    if (glitchContainer) glitchContainer.remove();

    glitchContainer = document.createElement('div');
    glitchContainer.id = 'glitch-time-shift';
    glitchContainer.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 9998;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        background: #000;
        overflow: hidden;
        mix-blend-mode: screen;
    `;

    glitchCanvas = document.createElement('canvas');
    glitchCanvas.style.cssText = `width: 100%; height: 100%;`;
    glitchContainer.appendChild(glitchCanvas);
    document.body.appendChild(glitchContainer);

    const resize = () => {
        if (glitchCanvas) {
            glitchCanvas.width = window.innerWidth;
            glitchCanvas.height = window.innerHeight;
        }
    };
    window.addEventListener('resize', resize);
    resize();

    console.log('Glitch Time Shift initialized');
}

function startGlitchEffect(intensity = 1) {
    if (!glitchCanvas || isGlitchActive) return;
    isGlitchActive = true;

    const ctx = glitchCanvas.getContext('2d');
    let time = 0;

    if (glitchAnimationId) cancelAnimationFrame(glitchAnimationId);

    function draw() {
        if (!isGlitchActive) return;

        const w = glitchCanvas.width;
        const h = glitchCanvas.height;
        time += 0.035 * intensity;

        ctx.save();
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        const sliceCount = 28;
        for (let i = 0; i < sliceCount; i++) {
            const y = (h / sliceCount) * i;
            const offset = Math.sin(time * 12 + i) * 18 * intensity * (Math.random() * 0.6 + 0.4);
            
            ctx.globalAlpha = 0.7;
            ctx.drawImage(glitchCanvas, 0, y, w, h/sliceCount, offset, y, w, h/sliceCount);
            ctx.globalAlpha = 0.6;
            ctx.drawImage(glitchCanvas, 0, y, w, h/sliceCount, -offset*0.8, y, w, h/sliceCount);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(glitchCanvas, 0, y, w, h/sliceCount, offset*1.3, y, w, h/sliceCount);
        }

        ctx.globalAlpha = 0.15 * intensity;
        for (let i = 0; i < 1200; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            ctx.fillStyle = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
            ctx.fillRect(x, y, 1 + Math.random() * 3, 1);
        }

        ctx.globalAlpha = 0.12 * intensity;
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < h; i += 4) {
            if (Math.random() > 0.85) {
                ctx.fillRect(0, i + Math.sin(time*20)*2, w, 1.5);
            }
        }

        if (Math.random() > 0.92) {
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#ff0088';
            ctx.fillRect(0, Math.random()*h, w, 3 + Math.random()*12);
        }

        ctx.restore();
        glitchAnimationId = requestAnimationFrame(draw);
    }

    draw();
}

function triggerGlitchTimeShift(show = true, intensity = 1) {
    if (!glitchContainer) return;

    if (show) {
        glitchContainer.style.visibility = 'visible';
        glitchContainer.style.transition = 'opacity 0.4s ease';
        glitchContainer.style.opacity = '1';
        startGlitchEffect(intensity);
    } else {
        glitchContainer.style.opacity = '0';
        isGlitchActive = false;
        if (glitchAnimationId) {
            cancelAnimationFrame(glitchAnimationId);
            glitchAnimationId = null;
        }
        setTimeout(() => {
            if (glitchContainer) glitchContainer.style.visibility = 'hidden';
        }, 600);
    }
}

// ========== SCROLL HINT ==========
function initScrollHint() {
    const hint = document.getElementById('scroll-hint');
    if (!hint) return;

    let scrolled = false;
    const hideHint = () => {
        if (!scrolled) {
            scrolled = true;
            hint.classList.add('hidden');
        }
    };

    window.addEventListener('scroll', hideHint, { once: true });
    setTimeout(hideHint, 8000);
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    window.scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };
}

// ========== AUTO SCROLL ==========
function initAutoScroll() {
    const autoScrollControl = document.getElementById('autoScrollControl');
    const pausePlayBtn = document.getElementById('pausePlayBtn');
    const watchAboutBtn = document.getElementById('watchAboutBtn');
    const pauseIcon = document.querySelector('.pause-icon');
    const playIcon = document.querySelector('.play-icon');
    
    if (!watchAboutBtn) return;

    function smoothScrollTo(targetY, duration = 2000, callback = null) {
        if (autoScrollAnimationId) {
            cancelAnimationFrame(autoScrollAnimationId);
            autoScrollAnimationId = null;
        }
        
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();
        
        function animate(currentTime) {
            if (!isAutoScrolling) {
                autoScrollAnimationId = null;
                return;
            }
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, startY + distance * easeProgress);
            
            if (progress < 1) {
                autoScrollAnimationId = requestAnimationFrame(animate);
            } else {
                autoScrollAnimationId = null;
                if (callback) callback();
            }
        }
        
        autoScrollAnimationId = requestAnimationFrame(animate);
    }

    function startAutoScroll() {
        if (isAutoScrolling) stopAutoScroll();
        isAutoScrolling = true;
        
        if (autoScrollControl) autoScrollControl.classList.add('visible');
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (playIcon) playIcon.style.display = 'none';
        
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const startY = window.scrollY;
        const remaining = maxScroll - startY;
        const duration = Math.min(64000, Math.max(24000, remaining / 0.25));
        
        smoothScrollTo(maxScroll, duration, () => {
            if (isAutoScrolling) stopAutoScroll();
        });
    }

    function stopAutoScroll() {
        if (!isAutoScrolling) return;
        
        if (autoScrollAnimationId) {
            cancelAnimationFrame(autoScrollAnimationId);
            autoScrollAnimationId = null;
        }
        
        isAutoScrolling = false;
        
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (playIcon) playIcon.style.display = 'block';
    }

    function resumeAutoScroll() {
        if (isAutoScrolling) return;
        isAutoScrolling = true;
        
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (playIcon) playIcon.style.display = 'none';
        
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const currentY = window.scrollY;
        const remaining = maxScroll - currentY;
        const duration = Math.min(48000, Math.max(16000, remaining / 0.25));
        
        smoothScrollTo(maxScroll, duration, () => {
            if (isAutoScrolling) stopAutoScroll();
        });
    }

    watchAboutBtn.addEventListener('click', () => {
        startAutoScroll();
    });

    if (pausePlayBtn) {
        pausePlayBtn.addEventListener('click', () => {
            if (isAutoScrolling) {
                stopAutoScroll();
            } else {
                resumeAutoScroll();
            }
        });
    }

    window.addEventListener('wheel', () => {
        if (isAutoScrolling) stopAutoScroll();
    }, { passive: true });

    window.addEventListener('touchmove', () => {
        if (isAutoScrolling) stopAutoScroll();
    }, { passive: true });
}

// ========== ANIMATE TITLE LETTERS ==========
function animateTitleLetters() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    heroTitle.innerHTML = '';
    heroTitle.style.display = 'block';
    heroTitle.style.textAlign = 'center';
    heroTitle.style.lineHeight = '1.2';
    
    const lines = ['WELCOME TO THE', 'ASTROUNIVERSE'];
    
    lines.forEach((line, lineIndex) => {
        const lineDiv = document.createElement('div');
        lineDiv.style.display = 'flex';
        lineDiv.style.justifyContent = 'center';
        lineDiv.style.flexWrap = 'wrap';
        lineDiv.style.gap = '0.1em';
        lineDiv.style.marginBottom = lineIndex === 0 ? '0.2em' : '0';
        
        const letters = line.split('');
        letters.forEach((letter, i) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(50px) rotateX(-90deg);
                animation: letterPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                animation-delay: ${0.3 + (lineIndex * 10 + i) * 0.03}s;
            `;
            lineDiv.appendChild(span);
        });
        
        heroTitle.appendChild(lineDiv);
    });
    
    if (!document.querySelector('#letter-animation-style')) {
        const style = document.createElement('style');
        style.id = 'letter-animation-style';
        style.textContent = `
            @keyframes letterPop {
                0% {
                    opacity: 0;
                    transform: translateY(50px) rotateX(-90deg);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) rotateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========== ADD CORNER MARKERS ==========
function addCornerMarkers() {
    const carouselCards = document.querySelectorAll('.carousel-card');
    
    carouselCards.forEach(card => {
        if (card.querySelector('.corner-tl')) return;
        
        card.classList.add('corner-markers');
        card.style.position = 'relative';
        
        const corners = ['tl', 'tr', 'bl', 'br'];
        corners.forEach(corner => {
            const cornerDiv = document.createElement('div');
            cornerDiv.className = `corner-${corner}`;
            cornerDiv.style.cssText = `
                position: absolute;
                width: 12px;
                height: 12px;
                transition: all 0.3s ease;
                pointer-events: none;
            `;
            
            switch(corner) {
                case 'tl':
                    cornerDiv.style.top = '8px';
                    cornerDiv.style.left = '8px';
                    cornerDiv.style.borderTop = '1px solid rgba(0, 255, 255, 0.3)';
                    cornerDiv.style.borderLeft = '1px solid rgba(0, 255, 255, 0.3)';
                    break;
                case 'tr':
                    cornerDiv.style.top = '8px';
                    cornerDiv.style.right = '8px';
                    cornerDiv.style.borderTop = '1px solid rgba(0, 255, 255, 0.3)';
                    cornerDiv.style.borderRight = '1px solid rgba(0, 255, 255, 0.3)';
                    break;
                case 'bl':
                    cornerDiv.style.bottom = '8px';
                    cornerDiv.style.left = '8px';
                    cornerDiv.style.borderBottom = '1px solid rgba(0, 255, 255, 0.3)';
                    cornerDiv.style.borderLeft = '1px solid rgba(0, 255, 255, 0.3)';
                    break;
                case 'br':
                    cornerDiv.style.bottom = '8px';
                    cornerDiv.style.right = '8px';
                    cornerDiv.style.borderBottom = '1px solid rgba(0, 255, 255, 0.3)';
                    cornerDiv.style.borderRight = '1px solid rgba(0, 255, 255, 0.3)';
                    break;
            }
            
            card.appendChild(cornerDiv);
        });
        
        card.addEventListener('mouseenter', () => {
            const corners = card.querySelectorAll('[class^="corner-"]');
            corners.forEach(corner => {
                corner.style.width = '20px';
                corner.style.height = '20px';
                corner.style.borderColor = '#00ffff';
            });
        });
        
        card.addEventListener('mouseleave', () => {
            const corners = card.querySelectorAll('[class^="corner-"]');
            corners.forEach(corner => {
                corner.style.width = '12px';
                corner.style.height = '12px';
                corner.style.borderColor = 'rgba(0, 255, 255, 0.3)';
            });
        });
    });
}

// ========== ADD GLITCH EFFECT ==========
function addGlitchEffect() {
    const glitchElements = document.querySelectorAll('.hero-quote, .second-quote, .third-quote, .fourth-quote');
    
    glitchElements.forEach(el => {
        el.classList.add('glitch-text');
        el.setAttribute('data-text', el.textContent);
    });
    
    if (!document.querySelector('#glitch-animation-style')) {
        const style = document.createElement('style');
        style.id = 'glitch-animation-style';
        style.textContent = `
            .glitch-text {
                position: relative;
            }
            .glitch-text::before,
            .glitch-text::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                opacity: 0.6;
            }
            .glitch-text::before {
                animation: glitch-before 0.4s infinite;
                color: #00ffff;
                z-index: -1;
            }
            .glitch-text::after {
                animation: glitch-after 0.4s infinite;
                color: #ff00ff;
                z-index: -2;
            }
            @keyframes glitch-before {
                0%, 100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
                25% { transform: translate(-1px, 0); clip-path: inset(30% 0 70% 0); }
                75% { transform: translate(1px, 0); clip-path: inset(70% 0 30% 0); }
            }
            @keyframes glitch-after {
                0%, 100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
                25% { transform: translate(1px, 0); clip-path: inset(70% 0 30% 0); }
                75% { transform: translate(-1px, 0); clip-path: inset(30% 0 70% 0); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========== CARDS 3D EFFECT ==========
function initCards3DEffect() {
    const cards = document.querySelectorAll('.carousel-card');
    
    if (cards.length === 0) {
        setTimeout(initCards3DEffect, 1000);
        return;
    }
    
    cards.forEach(card => {
        const video = card.querySelector('.card-video');
        const poster = card.querySelector('.card-poster');
        const element = video || poster;
        if (!element) return;
        
        const corners = card.querySelectorAll('[class^="corner-"]');
        
        element.style.transition = 'transform 0.3s ease-out';
        element.style.willChange = 'transform';
        element.style.backfaceVisibility = 'hidden';
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateY = ((x / rect.width) - 0.5) * 12;
            const rotateX = ((y / rect.height) - 0.5) * -12;
            
            element.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            element.style.transition = 'transform 0.05s linear';
            
            corners.forEach(corner => {
                corner.style.transform = `translate(${rotateY * 0.3}px, ${rotateX * 0.3}px)`;
                corner.style.transition = 'transform 0.05s linear';
            });
        });
        
        card.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
            element.style.transition = 'transform 0.3s ease-out';
            
            corners.forEach(corner => {
                corner.style.transform = 'translate(0, 0)';
                corner.style.transition = 'transform 0.3s ease-out';
            });
        });
    });
}

// Инициализация 3D эффекта
setTimeout(() => {
    initCards3DEffect();
}, 1500);

const carouselSectionObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            const carouselSection = document.getElementById('cardsCarousel');
            if (carouselSection && carouselSection.classList.contains('visible')) {
                setTimeout(initCards3DEffect, 300);
            }
        }
    });
});

const carouselSectionEl = document.getElementById('cardsCarousel');
if (carouselSectionEl) {
    carouselSectionObserver.observe(carouselSectionEl, { attributes: true });
}

window.addEventListener('resize', () => {
    if (glitchCanvas) {
        glitchCanvas.width = window.innerWidth;
        glitchCanvas.height = window.innerHeight;
    }
});

// ========== АВТОПРОКРУТКА ПРИ НАВЕДЕНИИ НА КРАЯ ЭКРАНА ==========
function initEdgeScroll() {
    // ========== НАСТРОЙКИ (МЕНЯЙТЕ ЗДЕСЬ) ==========
    const EDGE_SIZE = 80;           // Высота активной зоны в пикселях
    const SCROLL_SPEED = 1.1;       // Скорость прокрутки (0.5 = медленно, 1 = нормально, 1.5 = быстро)
    const TRIANGLE_WIDTH = 40;      // Ширина треугольника (пиксели)
    const TRIANGLE_HEIGHT = 20;     // Высота треугольника (пиксели)
    // ================================================
    
    let edgeScrollDirection = null;
    let edgeScrollAnimationId = null;
    let isEdgeScrolling = false;
    
    // Создаём треугольные индикаторы
    const topIndicator = document.createElement('div');
    const bottomIndicator = document.createElement('div');
    
    // Верхний индикатор (остриём вверх)
    topIndicator.id = 'edge-scroll-top';
    topIndicator.innerHTML = `
        <svg width="${TRIANGLE_WIDTH}" height="${TRIANGLE_HEIGHT}" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,2 5,18 35,18" fill="rgba(0, 255, 255, 0.4)" stroke="rgba(0, 255, 255, 0.8)" stroke-width="1.5"/>
        </svg>
    `;
    topIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        pointer-events: none;
        filter: drop-shadow(0 0 5px rgba(0, 255, 255, 0.5));
    `;
    
    // Нижний индикатор (остриём вниз)
    bottomIndicator.id = 'edge-scroll-bottom';
    bottomIndicator.innerHTML = `
        <svg width="${TRIANGLE_WIDTH}" height="${TRIANGLE_HEIGHT}" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,18 5,2 35,2" fill="rgba(0, 255, 255, 0.4)" stroke="rgba(0, 255, 255, 0.8)" stroke-width="1.5"/>
        </svg>
    `;
    bottomIndicator.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        pointer-events: none;
        filter: dropShadow(0 0 5px rgba(0, 255, 255, 0.5));
    `;
    
    document.body.appendChild(topIndicator);
    document.body.appendChild(bottomIndicator);
    
    // Анимация пульсации для индикатора
    function pulseIndicator(indicator, show) {
        if (show) {
            indicator.style.opacity = '1';
            indicator.style.visibility = 'visible';
            
            if (!document.querySelector('#edge-scroll-animation-style')) {
                const style = document.createElement('style');
                style.id = 'edge-scroll-animation-style';
                style.textContent = `
                    @keyframes edgeScrollPulse {
                        0%, 100% {
                            opacity: 0.4;
                            transform: translateX(-50%) scale(0.95);
                        }
                        50% {
                            opacity: 0.9;
                            transform: translateX(-50%) scale(1.05);
                            filter: drop-shadow(0 0 12px rgba(0, 255, 255, 0.8));
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            indicator.style.animation = 'edgeScrollPulse 1s ease-in-out infinite';
        } else {
            indicator.style.opacity = '0';
            indicator.style.visibility = 'hidden';
            indicator.style.animation = '';
        }
    }
    
    // Функция плавной прокрутки
    function smoothEdgeScroll() {
        if (!isEdgeScrolling) return;
        
        const scrollAmount = window.innerHeight * 0.008 * SCROLL_SPEED;
        const currentScroll = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        
        let newScroll;
        if (edgeScrollDirection === 'down') {
            newScroll = Math.min(currentScroll + scrollAmount, maxScroll);
        } else if (edgeScrollDirection === 'up') {
            newScroll = Math.max(currentScroll - scrollAmount, 0);
        } else {
            return;
        }
        
        window.scrollTo(0, newScroll);
        
        if ((edgeScrollDirection === 'down' && newScroll >= maxScroll) ||
            (edgeScrollDirection === 'up' && newScroll <= 0)) {
            stopEdgeScroll();
            return;
        }
        
        edgeScrollAnimationId = requestAnimationFrame(smoothEdgeScroll);
    }
    
    function startEdgeScroll(direction) {
        if (isEdgeScrolling && edgeScrollDirection === direction) return;
        
        if (isEdgeScrolling) {
            stopEdgeScroll();
        }
        
        isEdgeScrolling = true;
        edgeScrollDirection = direction;
        
        if (direction === 'up') {
            pulseIndicator(topIndicator, true);
            pulseIndicator(bottomIndicator, false);
        } else if (direction === 'down') {
            pulseIndicator(bottomIndicator, true);
            pulseIndicator(topIndicator, false);
        }
        
        smoothEdgeScroll();
    }
    
    function stopEdgeScroll() {
        if (edgeScrollAnimationId) {
            cancelAnimationFrame(edgeScrollAnimationId);
            edgeScrollAnimationId = null;
        }
        
        isEdgeScrolling = false;
        edgeScrollDirection = null;
        
        pulseIndicator(topIndicator, false);
        pulseIndicator(bottomIndicator, false);
    }
    
    // Отслеживаем движение мыши
    document.addEventListener('mousemove', function(e) {
        const mouseY = e.clientY;
        
        if (isEdgeScrolling) {
            if ((edgeScrollDirection === 'up' && mouseY > EDGE_SIZE) ||
                (edgeScrollDirection === 'down' && mouseY < window.innerHeight - EDGE_SIZE)) {
                stopEdgeScroll();
            }
            return;
        }
        
        if (mouseY <= EDGE_SIZE) {
            startEdgeScroll('up');
        } else if (mouseY >= window.innerHeight - EDGE_SIZE) {
            startEdgeScroll('down');
        }
    });
    
    // Останавливаем прокрутку при клике
    document.addEventListener('mousedown', function() {
        if (isEdgeScrolling) stopEdgeScroll();
    });
    
    // Останавливаем прокрутку при нажатии клавиш
    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Space') {
            if (isEdgeScrolling) stopEdgeScroll();
        }
    });
    
    console.log('Edge scroll initialized - SCROLL_SPEED =', SCROLL_SPEED);
}

// ========== АВТОМАТИЧЕСКОЕ ВОСПРОИЗВЕДЕНИЕ ВИДЕО ПРИ АКТИВНОЙ КАРТЕ В КАРУСЕЛИ ==========
(function autoPlayVideoOnActiveCard() {
    let currentActiveVideo = null;
    let autoPlayTimeout = null;
    let isCarouselVisible = false;
    
    // Проверяем, видна ли карусель
    function checkCarouselVisibility() {
        const carousel = document.getElementById('cardsCarousel');
        isCarouselVisible = carousel && carousel.classList.contains('visible');
        return isCarouselVisible;
    }
    
    // Функция для воспроизведения видео на активной карте (только если карусель видна)
    function playVideoOnActiveCard() {
        if (!checkCarouselVisibility()) return; // Только когда карусель активна
        
        const activeCard = document.querySelector('.carousel-card.active-card');
        if (!activeCard) return;
        
        const video = activeCard.querySelector('.card-video');
        if (!video) return;
        
        // Если это уже активное видео и оно играет - не трогаем
        if (currentActiveVideo === video && !video.paused) return;
        
        // Останавливаем предыдущее видео
        if (currentActiveVideo && currentActiveVideo !== video) {
            currentActiveVideo.pause();
            currentActiveVideo.currentTime = 0;
        }
        
        // Небольшая задержка перед воспроизведением нового видео
        if (autoPlayTimeout) clearTimeout(autoPlayTimeout);
        
        autoPlayTimeout = setTimeout(() => {
            if (video && video.readyState >= 2) {
                video.currentTime = 0;
                video.play().catch(err => console.log('Auto play error:', err));
                currentActiveVideo = video;
            } else if (video) {
                // Если видео ещё не загружено, ждём
                video.addEventListener('loadeddata', function onLoaded() {
                    video.currentTime = 0;
                    video.play().catch(err => console.log('Auto play error:', err));
                    video.removeEventListener('loadeddata', onLoaded);
                });
                currentActiveVideo = video;
            }
        }, 150);
    }
    
    // Функция для остановки видео на неактивной карте
    function stopVideoOnInactiveCard() {
        if (!checkCarouselVisibility()) return;
        
        const activeCard = document.querySelector('.carousel-card.active-card');
        const allVideos = document.querySelectorAll('.carousel-card .card-video');
        
        allVideos.forEach(video => {
            const card = video.closest('.carousel-card');
            if (card !== activeCard) {
                video.pause();
                video.currentTime = 0;
            }
        });
    }
    
    // Отслеживаем изменение активной карты с помощью MutationObserver
    function initObservers() {
        const allCards = document.querySelectorAll('.carousel-card');
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList && target.classList.contains('active-card')) {
                        // Новая карта стала активной
                        playVideoOnActiveCard();
                        stopVideoOnInactiveCard();
                    }
                }
            });
        });
        
        allCards.forEach(card => {
            if (!card.hasAttribute('data-video-observer')) {
                card.setAttribute('data-video-observer', 'true');
                observer.observe(card, { attributes: true });
            }
        });
    }
    
    // Отслеживаем появление карусели и новых карт
    const carouselSection = document.getElementById('cardsCarousel');
    if (carouselSection) {
        const carouselObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (carouselSection.classList.contains('visible')) {
                        // Карусель появилась - инициализируем
                        setTimeout(function() {
                            initObservers();
                            playVideoOnActiveCard();
                        }, 200);
                    } else {
                        // Карусель скрыта - останавливаем все видео
                        const allVideos = document.querySelectorAll('.carousel-card .card-video');
                        allVideos.forEach(video => {
                            video.pause();
                            video.currentTime = 0;
                        });
                        currentActiveVideo = null;
                    }
                }
            });
        });
        carouselObserver.observe(carouselSection, { attributes: true });
        
        // Если карусель уже видна
        if (carouselSection.classList.contains('visible')) {
            setTimeout(function() {
                initObservers();
                playVideoOnActiveCard();
            }, 200);
        }
    }
    
    // Также при скролле в карусели - проверяем активную карту
    let scrollTimeout = null;
    window.addEventListener('scroll', function() {
        if (!checkCarouselVisibility()) return;
        
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            playVideoOnActiveCard();
            stopVideoOnInactiveCard();
        }, 100);
    });
    
    console.log('Auto-play video on active card initialized (scroll does NOT auto-scroll)');
})();

console.log('about.js fully loaded with transition zone protection');