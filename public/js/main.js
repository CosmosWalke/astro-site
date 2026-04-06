let currentView = -10;
let isDragging = false;
let startX = 0;
let startView = 0;
let isTransitioning = false;
let autoScrollActive = false;
let autoScrollDirection = 0;
let autoScrollSpeed = 0;

const VIEW_MIN = -75;
const VIEW_MAX = 75;

let resizeTimer;
let initialScale = 1.13;
let isInitialZoom = true;

// Элементы круга
let followRing = null;
let currentHotspotElement = null;
let ringAnimationFrame = null;
let ringTargetX = 0, ringTargetY = 0;
let ringCurrentX = 0, ringCurrentY = 0;
let ringVisible = false;
const RING_SMOOTHING = 0.08;

// Хранилище позиций хотспотов
let hotspotPositions = {};
let isHotspotsPositioned = false;

// Отдельный элемент для надписи на двери
let doorTitleElement = null;
let doorHotspotActive = false;

window.addEventListener('load', () => {
    const introVideo1 = document.getElementById('intro-video-1');
    const player1 = document.getElementById('intro-video-player-1');
    const audio1 = document.getElementById('audio-intro-1');
    const staticBg1 = document.getElementById('static-bg-1');

    const introVideo2 = document.getElementById('intro-video-2');
    const player2 = document.getElementById('intro-video-player-2');
    const audio2 = document.getElementById('audio-intro-2');
    const staticBg2 = document.getElementById('static-bg-2');

    const introScreen = document.getElementById('intro-screen');

    // Создаем отдельный элемент для надписи на двери
    doorTitleElement = document.createElement('div');
    doorTitleElement.id = 'door-title';
    doorTitleElement.textContent = 'ENTER THE SHIP';
    doorTitleElement.style.position = 'fixed';
    doorTitleElement.style.top = '35%';
    doorTitleElement.style.left = '50%';
    doorTitleElement.style.transform = 'translate(-50%, -50%)';
    doorTitleElement.style.fontSize = 'clamp(60px, 10vw, 180px)';
    doorTitleElement.style.fontWeight = '700';
    doorTitleElement.style.fontFamily = 'CCUltimatum, Courier New, monospace';
    doorTitleElement.style.color = '#ffffff';
    doorTitleElement.style.textTransform = 'uppercase';
    doorTitleElement.style.letterSpacing = '0.02em';
    doorTitleElement.style.lineHeight = '0.8';
    doorTitleElement.style.textShadow = '0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)';
    doorTitleElement.style.opacity = '0';
    doorTitleElement.style.transition = 'opacity 0.4s ease';
    doorTitleElement.style.pointerEvents = 'none';
    doorTitleElement.style.zIndex = '10000';
    doorTitleElement.style.textAlign = 'center';
    document.body.appendChild(doorTitleElement);

    // ========== ПЕРВОЕ ВИДЕО (пролет) ==========
    player1.addEventListener('play', () => {
        audio1.currentTime = player1.currentTime;
        audio1.play().catch(e => console.log("Audio blocked:", e));
    });

    player1.addEventListener('timeupdate', () => {
        if (player1.currentTime >= player1.duration - 0.15 && !player1.dataset.preEnded) {
            player1.dataset.preEnded = 'true';
            staticBg1.style.opacity = '1';
        }
    });

player1.addEventListener('ended', () => {
    audio1.pause();
    audio1.currentTime = 0;
    introVideo1.style.display = 'none';
    introScreen.style.opacity = '1';
    introScreen.style.pointerEvents = 'all';
    
    // Небольшая задержка перед инициализацией хотспота
    setTimeout(() => {
        initDoorHotspot();
    }, 50);
});

    setTimeout(() => {
        if (introVideo1.style.display !== 'none') {
            audio1.pause();
            introVideo1.style.display = 'none';
            introScreen.style.opacity = '1';
            introScreen.style.pointerEvents = 'all';
            initDoorHotspot();
        }
    }, 7000);

    // ========== ВТОРОЕ ВИДЕО (вход) ==========
    player2.addEventListener('play', () => {
        audio2.currentTime = player2.currentTime;
        audio2.play().catch(e => console.log("Audio blocked:", e));
        preparePanoramaDuringVideo();
    });

    player2.addEventListener('timeupdate', () => {
        if (player2.currentTime >= player2.duration - 0.15 && !player2.dataset.preEnded) {
            player2.dataset.preEnded = 'true';
            staticBg2.style.opacity = '1';
        }
    });

    player2.addEventListener('ended', () => {
        audio2.pause();
        audio2.currentTime = 0;
        introVideo2.style.display = 'none';
        finalizePanorama();
    });
});

function initDoorHotspot() {
    console.log("initDoorHotspot called");
    
    const doorHotspot = document.querySelector('.hotspot-door');
    
    if (!doorHotspot) {
        console.log("Door hotspot not found, retrying in 100ms...");
        setTimeout(initDoorHotspot, 100);
        return;
    }
    
    console.log("Door hotspot found, initializing...");
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        if (doorTitleElement) doorTitleElement.style.display = 'none';
        return;
    }
    
    if (doorTitleElement) doorTitleElement.style.display = 'block';
    createFollowRing();
    
    // Очищаем старые обработчики
    doorHotspot.removeEventListener('mouseenter', handleDoorMouseEnter);
    doorHotspot.removeEventListener('mouseleave', handleDoorMouseLeave);
    doorHotspot.removeEventListener('mousemove', handleDoorMouseMove);
    
    // Добавляем новые
    doorHotspot.addEventListener('mouseenter', handleDoorMouseEnter);
    doorHotspot.addEventListener('mouseleave', handleDoorMouseLeave);
    doorHotspot.addEventListener('mousemove', handleDoorMouseMove);
    
    // Убеждаемся, что хотспот видим
    doorHotspot.style.opacity = '';
    doorHotspot.style.pointerEvents = 'all';
    doorHotspotActive = true;
    
    console.log("Door hotspot initialized successfully");
}

// Скрытие хотспота двери (при наведении)
function hideDoorHotspot() {
    const doorHotspot = document.querySelector('.hotspot-door');
    if (doorHotspot && doorHotspotActive) {
        doorHotspot.style.opacity = '0';
        doorHotspot.style.pointerEvents = 'none';
    }
}

// Показ хотспота двери (при уходе курсора)
function showDoorHotspot() {
    const doorHotspot = document.querySelector('.hotspot-door');
    if (doorHotspot && doorHotspotActive) {
        doorHotspot.style.opacity = '';
        doorHotspot.style.pointerEvents = 'all';
    }
}

// Отключение хотспота двери (при переходе на панораму)
function disableDoorHotspot() {
    const doorHotspot = document.querySelector('.hotspot-door');
    if (doorHotspot && doorHotspotActive) {
        doorHotspot.removeEventListener('mouseenter', handleDoorMouseEnter);
        doorHotspot.removeEventListener('mouseleave', handleDoorMouseLeave);
        doorHotspot.removeEventListener('mousemove', handleDoorMouseMove);
        doorHotspotActive = false;
    }
    if (doorTitleElement) {
        doorTitleElement.style.opacity = '0';
    }
}

function handleDoorMouseEnter(e) {
    console.log("Door hotspot mouse enter - showing ENTER THE SHIP");
    // Скрываем точку хотспота
    hideDoorHotspot();
    
    if (doorTitleElement) {
        doorTitleElement.style.opacity = '0.9';
    }
    showRing(e.clientX, e.clientY);
    currentHotspotElement = e.currentTarget;
}

function handleDoorMouseLeave(e) {
    console.log("Door hotspot mouse leave - hiding");
    // Показываем точку хотспота обратно
    showDoorHotspot();
    
    if (doorTitleElement) {
        doorTitleElement.style.opacity = '0';
    }
    hideRing();
    currentHotspotElement = null;
}

function handleDoorMouseMove(e) {
    if (ringVisible) {
        updateRingPosition(e.clientX, e.clientY);
    }
}

function preparePanoramaDuringVideo() {
    // Отключаем хотспот двери, чтобы он не мешал
    disableDoorHotspot();
    
    const mainContent = document.getElementById('main-content');
    mainContent.style.display = 'block';
    mainContent.style.opacity = '0';
    
    // Скрываем надпись двери
    if (doorTitleElement) {
        doorTitleElement.style.opacity = '0';
    }
    
    const panoramaImg = document.querySelector('.location.active .panorama-img');
    
    if (panoramaImg) {
        if (panoramaImg.complete) {
            setupPanorama();
        } else {
            panoramaImg.addEventListener('load', () => {
                setupPanorama();
            });
        }
    } else {
        setupPanorama();
    }
}

function setupPanorama() {
    updateView();
    storeHotspotPositions();
    initAnimations();
    initHotspots();
}

function finalizePanorama() {
    const mainContent = document.getElementById('main-content');
    mainContent.style.opacity = '1';
    
    updateView();
    checkHotspots();
    showLocationName('BRIDGE');
    
    const wrapper = document.querySelector('.location.active .panorama-wrapper');
    if (wrapper) {
        gsap.to(wrapper, {
            scale: 1,
            duration: 2,
            delay: 0,
            ease: 'sine.out',
            onUpdate: () => {},
            onComplete: () => {
                isInitialZoom = false;
                updateView();
                positionHotspotsOnce();
            }
        });
    }
}

function positionHotspotsOnce() {
    if (isHotspotsPositioned) return;
    
    const activeLoc = document.querySelector('.location.active');
    if (!activeLoc) return;
    
    const img = activeLoc.querySelector('.panorama-img');
    const hotspots = activeLoc.querySelectorAll('.hotspot');
    
    if (!img) return;
    if (!img.complete) return;
    
    const imgRect = img.getBoundingClientRect();
    if (imgRect.width === 0 || imgRect.height === 0) return;
    
    const imgWidth = imgRect.width;
    const imgHeight = imgRect.height;
    const imgLeft = imgRect.left;
    const imgTop = imgRect.top;
    
    hotspots.forEach(hotspot => {
        const percentX = parseFloat(hotspot.dataset.percentX);
        const percentY = parseFloat(hotspot.dataset.percentY);
        
        if (!isNaN(percentX) && !isNaN(percentY)) {
            const imgPixelX = (percentX / 100) * imgWidth;
            const imgPixelY = (percentY / 100) * imgHeight;
            
            const screenX = imgLeft + imgPixelX;
            const screenY = imgTop + imgPixelY;
            
            const hotspotsLayer = hotspot.parentElement;
            if (hotspotsLayer) {
                const layerRect = hotspotsLayer.getBoundingClientRect();
                const relativeX = screenX - layerRect.left;
                const relativeY = screenY - layerRect.top;
                
                hotspot.style.left = `${relativeX}px`;
                hotspot.style.top = `${relativeY}px`;
                hotspot.dataset.fixedLeft = relativeX;
                hotspot.dataset.fixedTop = relativeY;
            }
        }
    });
    
    isHotspotsPositioned = true;
}

function updateAllHotspotsPosition() {
    if (isHotspotsPositioned) return;
    
    const activeLoc = document.querySelector('.location.active');
    if (!activeLoc) return;
    
    const img = activeLoc.querySelector('.panorama-img');
    const hotspots = activeLoc.querySelectorAll('.hotspot');
    
    if (!img) return;
    if (!img.complete) return;
    
    const imgRect = img.getBoundingClientRect();
    if (imgRect.width === 0 || imgRect.height === 0) return;
    
    const imgWidth = imgRect.width;
    const imgHeight = imgRect.height;
    const imgLeft = imgRect.left;
    const imgTop = imgRect.top;
    
    hotspots.forEach(hotspot => {
        const percentX = parseFloat(hotspot.dataset.storedX);
        const percentY = parseFloat(hotspot.dataset.storedY);
        
        if (!isNaN(percentX) && !isNaN(percentY)) {
            const imgPixelX = (percentX / 100) * imgWidth;
            const imgPixelY = (percentY / 100) * imgHeight;
            
            const screenX = imgLeft + imgPixelX;
            const screenY = imgTop + imgPixelY;
            
            const hotspotsLayer = hotspot.parentElement;
            if (hotspotsLayer) {
                const layerRect = hotspotsLayer.getBoundingClientRect();
                const relativeX = screenX - layerRect.left;
                const relativeY = screenY - layerRect.top;
                
                hotspot.style.left = `${relativeX}px`;
                hotspot.style.top = `${relativeY}px`;
            }
        }
    });
}

function openDoorWithVideo() {
    document.getElementById('intro-screen').style.opacity = '0';
    document.getElementById('intro-screen').style.pointerEvents = 'none';
    document.getElementById('intro-video-2').style.opacity = '1';
    document.getElementById('intro-video-2').style.pointerEvents = 'all';
    document.getElementById('intro-video-player-2').play();
}

function initAnimations() {
    gsap.to('#robot-1', { left: '25%', duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#person-1', { left: '55%', duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#person-2', { left: '20%', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#person-3', { left: '45%', duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#person-4', { left: '75%', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#person-5', { left: '35%', duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#person-6', { left: '70%', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.person', { scaleY: 1.02, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'center bottom' });
}

function storeHotspotPositions() {
    const activeLoc = document.querySelector('.location.active');
    if (!activeLoc) return;
    
    const hotspots = activeLoc.querySelectorAll('.hotspot');
    hotspots.forEach((hotspot) => {
        const percentX = parseFloat(hotspot.dataset.percentX);
        const percentY = parseFloat(hotspot.dataset.percentY);
        if (!isNaN(percentX) && !isNaN(percentY)) {
            hotspot.dataset.storedX = percentX;
            hotspot.dataset.storedY = percentY;
        }
    });
}

// ========== КРУГ-КУРСОР ==========

function createFollowRing() {
    if (followRing) return;
    followRing = document.createElement('div');
    followRing.className = 'cursor-follow-ring';
    followRing.innerHTML = '<div class="click-text"><span>CLICK TO</span><span>EXPLORE</span></div>';
    document.body.appendChild(followRing);
    
    function animateRing() {
        if (ringVisible && followRing) {
            ringCurrentX += (ringTargetX - ringCurrentX) * RING_SMOOTHING;
            ringCurrentY += (ringTargetY - ringCurrentY) * RING_SMOOTHING;
            const offsetY = -20;
            followRing.style.left = `${ringCurrentX}px`;
            followRing.style.top = `${ringCurrentY + offsetY}px`;
        }
        ringAnimationFrame = requestAnimationFrame(animateRing);
    }
    animateRing();
}

function showRing(x, y) {
    if (!followRing) createFollowRing();
    ringTargetX = x;
    ringTargetY = y;
    ringCurrentX = x;
    ringCurrentY = y;
    ringVisible = true;
    followRing.classList.add('visible');
}

function hideRing() {
    ringVisible = false;
    if (followRing) followRing.classList.remove('visible');
}

function updateRingPosition(x, y) {
    if (ringVisible) {
        ringTargetX = x;
        ringTargetY = y;
    }
}

function hideAllHotspots() {
    document.querySelectorAll('.location.active .hotspot').forEach(h => {
        h.style.opacity = '0';
        h.style.pointerEvents = 'none';
    });
}

function showAllHotspots() {
    document.querySelectorAll('.location.active .hotspot').forEach(h => {
        h.style.opacity = '';
        h.style.pointerEvents = '';
    });
}

function initHotspots() {
    const activeLoc = document.querySelector('.location.active');
    if (!activeLoc) return;
    
    const isMobile = window.innerWidth <= 768;
    const centerTitle = document.getElementById('center-title');
    
    if (isMobile) {
        if (centerTitle) centerTitle.style.display = 'none';
        return;
    }
    
    if (centerTitle) {
        centerTitle.style.display = 'block';
        centerTitle.style.mixBlendMode = 'normal';
        centerTitle.style.color = '#ffffff';
        centerTitle.style.textShadow = '0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)';
        centerTitle.style.opacity = '0';
        centerTitle.style.transition = 'opacity 0.4s ease';
        centerTitle.style.fontFamily = 'CCUltimatum, Courier New, monospace';
        centerTitle.style.fontWeight = '700';
    }
    createFollowRing();
    
    const hotspots = activeLoc.querySelectorAll('.hotspot');
    
    hotspots.forEach(hotspot => {
        hotspot.removeEventListener('mouseenter', handleMouseEnter);
        hotspot.removeEventListener('mouseleave', handleMouseLeave);
        hotspot.removeEventListener('mousemove', handleMouseMove);
        
        hotspot.addEventListener('mouseenter', handleMouseEnter);
        hotspot.addEventListener('mouseleave', handleMouseLeave);
        hotspot.addEventListener('mousemove', handleMouseMove);
        
        hotspot.style.opacity = '';
        hotspot.style.pointerEvents = '';
    });
}

function handleMouseEnter(e) {
    const hotspot = e.currentTarget;
    const label = hotspot.dataset.label || '';
    const centerTitle = document.getElementById('center-title');
    
    if (label && centerTitle) {
        centerTitle.textContent = label;
        centerTitle.classList.add('active');
        centerTitle.style.opacity = '0.9';
    }
    
    hideAllHotspots();
    showRing(e.clientX, e.clientY);
    currentHotspotElement = hotspot;
}

function handleMouseLeave(e) {
    const centerTitle = document.getElementById('center-title');
    if (centerTitle) {
        centerTitle.classList.remove('active');
        centerTitle.style.opacity = '0';
        centerTitle.textContent = '';
    }
    
    showAllHotspots();
    hideRing();
    currentHotspotElement = null;
}

function handleMouseMove(e) {
    if (ringVisible) {
        updateRingPosition(e.clientX, e.clientY);
    }
}

// ========== УПРАВЛЕНИЕ ПАНОРАМОЙ ==========

const viewport = document.getElementById('viewport');

if (viewport) {
    viewport.addEventListener('mousedown', e => {
        if (isTransitioning || autoScrollActive) return;
        isDragging = true;
        startX = e.clientX;
        startView = currentView;
        viewport.style.cursor = 'grabbing';
        hideHint();
    });
}

document.addEventListener('mousemove', e => {
    if (!isDragging || isTransitioning) return;
    e.preventDefault();
    const delta = e.clientX - startX;
    const sensitivity = window.innerWidth < 768 ? 0.4 : 0.3;
    currentView = startView + delta * sensitivity;
    currentView = Math.max(VIEW_MIN, Math.min(VIEW_MAX, currentView));
    updateView();
    updateAllHotspotsPosition();
    checkHotspots();
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    if (viewport) viewport.style.cursor = 'grab';
});

if (viewport) {
    viewport.addEventListener('touchstart', e => {
        if (isTransitioning || autoScrollActive) return;
        isDragging = true;
        startX = e.touches[0].clientX;
        startView = currentView;
        hideHint();
    }, { passive: true });

    viewport.addEventListener('touchmove', e => {
        if (!isDragging || isTransitioning) return;
        e.preventDefault();
        const delta = e.touches[0].clientX - startX;
        currentView = startView + delta * 0.4;
        currentView = Math.max(VIEW_MIN, Math.min(VIEW_MAX, currentView));
        updateView();
        updateAllHotspotsPosition();
        checkHotspots();
    }, { passive: false });

    viewport.addEventListener('touchend', () => {
        isDragging = false;
    });
}

if (window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
        if (isDragging || isTransitioning) return;
        const edge = 80;
        const maxSpeed = 0.5;
        
        if (e.clientX < edge) {
            autoScrollActive = true;
            autoScrollDirection = 1;
            autoScrollSpeed = maxSpeed * (1 - e.clientX / edge);
            const leftEdge = document.getElementById('edge-left');
            const rightEdge = document.getElementById('edge-right');
            if (leftEdge) leftEdge.classList.add('active');
            if (rightEdge) rightEdge.classList.remove('active');
        } else if (e.clientX > window.innerWidth - edge) {
            autoScrollActive = true;
            autoScrollDirection = -1;
            autoScrollSpeed = maxSpeed * (1 - (window.innerWidth - e.clientX) / edge);
            const leftEdge = document.getElementById('edge-left');
            const rightEdge = document.getElementById('edge-right');
            if (rightEdge) rightEdge.classList.add('active');
            if (leftEdge) leftEdge.classList.remove('active');
        } else {
            autoScrollActive = false;
            autoScrollSpeed = 0;
            const leftEdge = document.getElementById('edge-left');
            const rightEdge = document.getElementById('edge-right');
            if (leftEdge) leftEdge.classList.remove('active');
            if (rightEdge) rightEdge.classList.remove('active');
        }
    });

    function autoScrollLoop() {
        if (autoScrollActive && !isDragging && !isTransitioning) {
            currentView += autoScrollDirection * autoScrollSpeed;
            currentView = Math.max(VIEW_MIN, Math.min(VIEW_MAX, currentView));
            updateView();
            updateAllHotspotsPosition();
            checkHotspots();
        }
        requestAnimationFrame(autoScrollLoop);
    }
    autoScrollLoop();
}

function updateView() {
    const activeLoc = document.querySelector('.location.active');
    if (!activeLoc) return;
    const wrapper = activeLoc.querySelector('.panorama-wrapper');
    if (!wrapper) return;
    
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    const img = wrapper.querySelector('.panorama-img');
    let ratio = 4032 / 1056;
    
    if (img && img.complete && img.naturalWidth > 0) {
        ratio = img.naturalWidth / img.naturalHeight;
    }
    
    const scaledWidth = ratio * vh;
    const halfRange = (scaledWidth - vw) / 2;
    const centerOffset = (vw - scaledWidth) / 2;
    const normalized = currentView / 75;
    let shift = normalized * halfRange;
    let translateX = centerOffset + shift;
    translateX = Math.max(vw - scaledWidth, Math.min(0, translateX));
    let currentScale = isInitialZoom ? initialScale : 1;
    wrapper.style.transform = `translateX(${translateX}px) scale(${currentScale})`;
    wrapper.style.transformOrigin = 'center center';
}

function checkHotspots() {
    const center = 50;
    const threshold = 15;
    const activeLoc = document.querySelector('.location.active');
    if (!activeLoc) return;
    let hasActiveHotspot = false;
    activeLoc.querySelectorAll('.hotspot').forEach(hotspot => {
        const posX = parseFloat(hotspot.dataset.x);
        const distance = Math.abs(posX - (center + currentView));
        if (distance < threshold) hasActiveHotspot = true;
    });
    const indicator = document.getElementById('center-indicator');
    if (indicator) indicator.classList.toggle('active', hasActiveHotspot);
}

function enterLocation(targetLocId, locationName) {
    if (isTransitioning) return;
    isTransitioning = true;
    autoScrollActive = false;
    
    isHotspotsPositioned = false;
    
    if (currentHotspotElement) {
        showAllHotspots();
        hideRing();
        currentHotspotElement = null;
    }
    
    const currentActive = document.querySelector('.location.active');
    if (currentActive) currentActive.classList.remove('active');
    const targetLocation = document.getElementById(targetLocId);
    if (targetLocation) targetLocation.classList.add('active');
    
    currentView = 0;
    updateView();
    checkHotspots();
    
    setTimeout(() => {
        initHotspots();
        storeHotspotPositions();
        setTimeout(() => {
            positionHotspotsOnce();
        }, 50);
    }, 100);
    
    showLocationName(locationName);
    isTransitioning = false;
}

function showLocationName(name) {
    const el = document.getElementById('location-name');
    if (el) {
        el.textContent = name;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 3000);
    }
}

function openSection(name) {
    const modal = document.getElementById('modal-' + name);
    if (modal) modal.style.display = 'flex';
}

function closeSection(name) {
    const modal = document.getElementById('modal-' + name);
    if (modal) modal.style.display = 'none';
}

document.querySelectorAll('.section-modal').forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target === modal) closeSection(modal.id.replace('modal-', ''));
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.section-modal[style*="flex"]').forEach(m => {
            closeSection(m.id.replace('modal-', ''));
        });
    }
    if (e.key === 'ArrowLeft') {
        currentView = Math.min(VIEW_MAX, currentView + 10);
        updateView();
        updateAllHotspotsPosition();
        checkHotspots();
    }
    if (e.key === 'ArrowRight') {
        currentView = Math.max(VIEW_MIN, currentView - 10);
        updateView();
        updateAllHotspotsPosition();
        checkHotspots();
    }
});

let hasInteracted = false;
function hideHint() {
    if (!hasInteracted) {
        hasInteracted = true;
        const hint = document.getElementById('look-hint');
        if (hint) gsap.to(hint, { opacity: 0, duration: 0.5, delay: 2 });
    }
}

window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        isHotspotsPositioned = false;
        updateAllHotspotsPosition();
        positionHotspotsOnce();
        initHotspots();
        updateView();
        checkHotspots();
    }, 250);
});

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768;
    const lookHint = document.getElementById('look-hint');
    const mobileHint = document.querySelector('.mobile-hint');
    if (isMobile) {
        if (lookHint) lookHint.style.display = 'none';
        if (mobileHint) mobileHint.style.display = 'block';
    } else {
        if (lookHint) lookHint.style.display = 'block';
        if (mobileHint) mobileHint.style.display = 'none';
    }
});