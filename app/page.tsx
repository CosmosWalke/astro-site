'use client'
import { MobileMenu } from "@/components/ui/mobile-menu"
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingScreen } from '@/components/LoadingScreen'
import { GyroToggle } from '@/components/GyroToggle'
import SimpleGlobe from "@/components/ui/SimpleGlobe"

declare global {
  interface Window {
    currentView: number
  }
}

const sections = [
  { label: 'ABOUT', href: '/about', id: 'about', isPage: true },
  { label: 'COMMUNITY', href: '/community', id: 'community', isPage: true },
  { label: 'ASTRO CLUB', href: '#astro-club', id: 'astro-club', isPage: false },
  { label: 'CARGO BAY', href: '/cargobay', id: 'cargobay', isPage: true },
]

export default function PanoramaPage() {
  const router = useRouter()
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showLoading, setShowLoading] = useState(true)
  const [gyroActive, setGyroActive] = useState(false)
  const [showPanorama, setShowPanorama] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  let viewLoopId: number | null = null
  let currentTargetView = 0
  let isDragging = false
  let dragStartX = 0
  let dragStartView = 0
  let hasUserInteracted = false
  let ringAnimationFrame: number | null = null
  let ringVisible = false
  let ringTargetX = 0
  let ringTargetY = 0
  let ringCurrentX = 0
  let ringCurrentY = 0
  let mobileObserver: IntersectionObserver | null = null

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Инициализация window.currentView
  if (typeof window !== 'undefined' && window.currentView === undefined) {
    window.currentView = 0
  }

  const afterLayout = (cb: () => void) => {
    requestAnimationFrame(() => requestAnimationFrame(cb))
  }

  const updatePanoramaView = () => {
    const wrapper = document.querySelector('.panorama-wrapper') as HTMLElement
    const img = document.querySelector('.panorama-img') as HTMLImageElement
    
    if (!wrapper || !img) return

    const vw = window.innerWidth
    const imgWidth = img.clientWidth || img.naturalWidth || vw * 2

    if (imgWidth <= vw + 40) {
      wrapper.style.transform = 'translate3d(0px, 0px, 0px)'
      return
    }

    const maxShift = imgWidth - vw
    const normalized = (currentTargetView + 75) / 150
    const translateX = Math.round(-normalized * maxShift)

    wrapper.style.transform = `translate3d(${translateX}px, 0px, 0px)`
  }

  const startViewLoop = () => {
    const loop = () => {
      const cv = window.currentView || 0
      currentTargetView += (cv - currentTargetView) * 0.08
      updatePanoramaView()
      viewLoopId = requestAnimationFrame(loop)
    }
    viewLoopId = requestAnimationFrame(loop)
  }

  const handleGyroChange = (gamma: number) => {
    if (!gyroActive) return
    
    let newView = gamma * -2.5
    newView = Math.max(-75, Math.min(75, newView))
    window.currentView = newView
  }

  // Мобильные подписи для хотспотов
  const setupMobileLabels = () => {
    if (mobileObserver) {
      mobileObserver.disconnect()
      mobileObserver = null
    }

    const activeLoc = document.querySelector('.location.active')
    if (!activeLoc) return

    const hotspots = activeLoc.querySelectorAll('.hotspot') as NodeListOf<HTMLElement>

    hotspots.forEach((hotspot) => {
      let labelEl = hotspot.querySelector('.hotspot-label') as HTMLElement | null

      if (!labelEl) {
        const labelText = hotspot.dataset.label || ''
        if (!labelText) return

        labelEl = document.createElement('div')
        labelEl.className = 'hotspot-label'
        labelEl.textContent = labelText
        hotspot.appendChild(labelEl)
      }
    })

    mobileObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const hotspot = entry.target as HTMLElement
          const label = hotspot.querySelector('.hotspot-label') as HTMLElement | null
          if (!label) return

          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            label.classList.add('show')
          } else {
            label.classList.remove('show')
          }
        })
      },
      {
        threshold: [0, 0.25, 0.5],
        rootMargin: '-40px 0px -100px 0px'
      }
    )

    hotspots.forEach((hotspot) => mobileObserver!.observe(hotspot))
  }

  // DRAG для мыши (ПК)
  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.hotspot')) return
    
    if (!hasUserInteracted) {
      currentTargetView = window.currentView || 0
      hasUserInteracted = true
    }
    
    isDragging = true
    dragStartX = e.clientX
    dragStartView = window.currentView || 0
    document.body.style.cursor = 'grabbing'
    
    const edgeLeft = document.getElementById('edge-left')
    const edgeRight = document.getElementById('edge-right')
    if (edgeLeft) edgeLeft.style.pointerEvents = 'none'
    if (edgeRight) edgeRight.style.pointerEvents = 'none'
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStartX
    let newView = dragStartView + (deltaX * 0.3)
    newView = Math.max(-75, Math.min(75, newView))
    window.currentView = newView
  }

  const handleDragUp = () => {
    isDragging = false
    document.body.style.cursor = ''
    
    const edgeLeft = document.getElementById('edge-left')
    const edgeRight = document.getElementById('edge-right')
    if (edgeLeft) edgeLeft.style.pointerEvents = 'auto'
    if (edgeRight) edgeRight.style.pointerEvents = 'auto'
  }

  // TOUCH для мобильных (свайп с инверсией)
  const handleTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.hotspot')) return
    
    if (!hasUserInteracted) {
      currentTargetView = window.currentView || 0
      hasUserInteracted = true
    }
    
    isDragging = true
    dragStartX = e.touches[0].clientX
    dragStartView = window.currentView || 0
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    
    // ИНВЕРСИЯ: движение влево (+) → панорама вправо
    const deltaX = e.touches[0].clientX - dragStartX
    let newView = dragStartView - (deltaX * 0.3) // МИНУС для инверсии
    newView = Math.max(-75, Math.min(75, newView))
    window.currentView = newView
  }

  const handleTouchEnd = () => {
    isDragging = false
  }

  // EDGE ZONES (только для ПК)
  const setupEdgeZones = () => {
    if (isMobile) return
    
    const edgeLeft = document.getElementById('edge-left')
    const edgeRight = document.getElementById('edge-right')
    let edgeInterval: NodeJS.Timeout | null = null

    const startEdgeMove = (direction: 'left' | 'right') => {
      if (edgeInterval) clearInterval(edgeInterval)
      edgeInterval = setInterval(() => {
        const current = window.currentView || 0
        let newView = current + (direction === 'left' ? -2 : 2)
        newView = Math.max(-75, Math.min(75, newView))
        window.currentView = newView
      }, 16)
    }

    const stopEdgeMove = () => {
      if (edgeInterval) {
        clearInterval(edgeInterval)
        edgeInterval = null
      }
    }

    if (edgeLeft) {
      edgeLeft.addEventListener('mouseenter', () => startEdgeMove('left'))
      edgeLeft.addEventListener('mouseleave', stopEdgeMove)
    }
    if (edgeRight) {
      edgeRight.addEventListener('mouseenter', () => startEdgeMove('right'))
      edgeRight.addEventListener('mouseleave', stopEdgeMove)
    }
  }

  // Ring анимация для хотспотов
  const showRing = (x: number, y: number) => {
    const ring = document.querySelector('.cursor-follow-ring') as HTMLElement
    if (!ring) return
    ringTargetX = x
    ringTargetY = y
    ringCurrentX = x
    ringCurrentY = y
    ringVisible = true
    ring.classList.add('visible')
  }

  const hideRing = () => {
    ringVisible = false
    const ring = document.querySelector('.cursor-follow-ring') as HTMLElement
    if (ring) ring.classList.remove('visible')
  }

  const updateRingPosition = (x: number, y: number) => {
    if (ringVisible) {
      ringTargetX = x
      ringTargetY = y
    }
  }

  const animateRing = () => {
    if (ringVisible) {
      const ring = document.querySelector('.cursor-follow-ring') as HTMLElement
      if (ring) {
        ringCurrentX += (ringTargetX - ringCurrentX) * 0.08
        ringCurrentY += (ringTargetY - ringCurrentY) * 0.08
        ring.style.left = `${ringCurrentX}px`
        ring.style.top = `${ringCurrentY - 20}px`
      }
    }
    ringAnimationFrame = requestAnimationFrame(animateRing)
  }

  // Функция масштабирования панорамы
  const fixPanoramaScale = () => {
    const wrapper = document.querySelector('.panorama-wrapper') as HTMLElement
    const img = document.querySelector('.panorama-img') as HTMLImageElement
    if (!wrapper || !img) return

    const vh = window.innerHeight
    const vw = window.innerWidth
    
    img.style.height = `${vh}px`
    img.style.width = 'auto'

    if (img.complete && img.naturalWidth) {
      const ratio = img.naturalWidth / img.naturalHeight
      let scaledWidth = ratio * vh
      
      const minWidth = vw * 1.3
      if (scaledWidth < minWidth) {
        scaledWidth = minWidth
      }
      
      img.style.width = `${scaledWidth}px`
      wrapper.style.width = `${scaledWidth}px`
      wrapper.style.height = `${vh}px`
    } else {
      img.addEventListener('load', () => {
        fixPanoramaScale()
      })
    }
  }

  // Загрузка ресурсов
  const loadResources = async (onProgress: (progress: number) => void) => {
    const img = new Image()
    img.src = '/images/panorama-bridge.jpg'
    
    const video = document.createElement('video')
    video.src = '/videos/intro-fly2.webm'
    
    let loadedCount = 0
    const totalCount = 2
    
    const updateProgress = () => {
      loadedCount++
      onProgress(Math.floor((loadedCount / totalCount) * 100))
    }
    
    await new Promise((resolve) => {
      if (img.complete) {
        updateProgress()
        resolve(true)
      } else {
        img.onload = () => { updateProgress(); resolve(true) }
        img.onerror = () => { updateProgress(); resolve(true) }
      }
    })
    
    await new Promise((resolve) => {
      video.addEventListener('canplaythrough', () => {
        updateProgress()
        resolve(true)
      }, { once: true })
      video.addEventListener('error', () => {
        updateProgress()
        resolve(true)
      }, { once: true })
      setTimeout(() => {
        updateProgress()
        resolve(true)
      }, 3000)
    })
  }

  useEffect(() => {
    const startLoading = async () => {
      await loadResources((progress) => {
        setLoadingProgress(progress)
      })
      
      setTimeout(() => {
        setShowLoading(false)
      }, 300)
    }
    
    startLoading()
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'CCUltimatum';
        src: url('/fonts/ccultimatum.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      .panorama-wrapper { 
        position: absolute;
        top: 0; 
        left: 0; 
        height: 100vh; 
        will-change: transform; 
        overflow: visible;
      }
      .panorama-img { 
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh; 
        width: auto; 
        display: block; 
      }

      .location { 
        position: absolute; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        opacity: 1; 
        visibility: visible; 
        pointer-events: all; 
      }

      #viewport { 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        overflow: hidden; 
        background: #000;
      }

      #panorama { 
        position: absolute; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
      }

      .edge-zone {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        width: 80px;
        height: 600px;
        z-index: 50;
        cursor: pointer;
      }
      .edge-zone.left {
        left: 0;
      }
      .edge-zone.right {
        right: 0;
      }
      .edge-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255,255,255,0.5);
        font-size: 40px;
        transition: opacity 0.3s;
      }
      .edge-zone.left .edge-arrow {
        left: 20px;
      }
      .edge-zone.right .edge-arrow {
        right: 20px;
      }
      .edge-zone:hover .edge-arrow {
        opacity: 1;
        color: #0ff;
      }

      @media (max-width: 768px) {
        .edge-zone {
          display: none !important;
        }
      }

      .hotspot { 
        position: absolute; 
        pointer-events: auto !important; 
        width: 100px; 
        height: 100px; 
        transform: translate(-50%, -50%); 
        z-index: 100; 
        cursor: pointer; 
      }
      .hotspot-dot { 
        position: absolute; 
        top: 50%; 
        left: 50%; 
        width: 16px; 
        height: 16px; 
        background: #fff; 
        border-radius: 50%; 
        transform: translate(-50%, -50%); 
        box-shadow: 0 0 20px #0ff, 0 0 40px #0ff; 
        animation: dotPulse 2s infinite ease-in-out; 
      }
      @keyframes dotPulse { 
        0%,100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 
        50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; } 
      }

      .cursor-follow-ring { 
        position: fixed; 
        width: 150px; 
        height: 150px; 
        border: 2px solid rgba(255,255,255,0.95); 
        border-radius: 50%; 
        pointer-events: none; 
        opacity: 0; 
        transform: translate(-50%, -50%) scale(0.5); 
        box-shadow: 0 0 30px #0ff, 0 0 60px #0ff; 
        transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.2,0.9,0.3,1.1); 
        z-index: 9999; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: rgba(255,255,255,0.08); 
        backdrop-filter: blur(2px); 
      }
      .cursor-follow-ring.visible { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1); 
      }
      .cursor-follow-ring .click-text { 
        color: #fff; 
        font-size: 15px; 
        font-weight: 700; 
        letter-spacing: 2.5px; 
        text-transform: uppercase; 
        text-align: center; 
        line-height: 1.4; 
        text-shadow: 0 0 15px #0ff; 
        width: 100%; 
        font-family: 'CCUltimatum', monospace; 
        opacity: 0; 
        transform: translateY(20px); 
        transition: opacity 0.2s ease, transform 0.3s ease; 
      }
      .cursor-follow-ring.visible .click-text { 
        opacity: 1; 
        transform: translateY(0); 
      }
      .cursor-follow-ring .click-text span { 
        display: block; 
      }

      .center-title { 
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        font-size: clamp(60px,10vw,180px); 
        max-width: 85vw; 
        font-weight: 900; 
        color: #fff; 
        text-transform: uppercase; 
        letter-spacing: 0.02em; 
        opacity: 0; 
        pointer-events: none; 
        z-index: 5; 
        text-shadow: 0 0 30px rgba(0,255,255,0.5), 0 0 60px rgba(0,255,255,0.3); 
        text-align: center; 
        transition: opacity 0.4s ease; 
        font-family: 'CCUltimatum', monospace; 
      }
      .center-title.active { opacity: 0.9; }

      #location-name { 
        position: fixed; 
        top: 20px; 
        left: 50%; 
        transform: translateX(-50%); 
        color: #0ff; 
        font-size: 24px; 
        font-weight: bold; 
        text-transform: uppercase; 
        letter-spacing: 4px; 
        opacity: 0; 
        transition: opacity 0.6s; 
        z-index: 10; 
        pointer-events: none; 
        font-family: 'CCUltimatum', monospace; 
      }
      #location-name.show { opacity: 1; }

      #look-hint {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        z-index: 10;
        font-family: 'CCUltimatum', monospace;
        color: rgba(255,255,255,0.6);
        font-size: 12px;
        letter-spacing: 2px;
        text-transform: uppercase;
        pointer-events: none;
      }
      
      .look-arrows {
        font-size: 20px;
        margin-bottom: 5px;
        animation: fadeInOut 2s infinite;
      }
      
      @keyframes fadeInOut {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      
      .look-text {
        margin-bottom: 5px;
      }
      
      .look-subtext {
        font-size: 10px;
        opacity: 0.7;
      }
      
      .mobile-hint {
        display: none;
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        z-index: 10;
        font-family: 'CCUltimatum', monospace;
        color: #0ff;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      
      .mobile-hint-icon {
        margin-bottom: 8px;
      }
      
      @media (max-width: 768px) {
        #look-hint {
          display: none;
        }
        .mobile-hint {
          display: block;
        }
      }

.hotspot-label {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  color: #fff;
  padding: 0;
  border-radius: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 4px;
  text-transform: uppercase;
  white-space: nowrap;
  font-family: 'CCUltimatum', monospace;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3);
  transition: opacity 0.4s ease, transform 0.4s ease;
  z-index: 110;
  text-align: center;
  line-height: 1.2;
}

.hotspot-label.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-10px);
}

@media (min-width: 769px) {
  .hotspot-label {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .hotspot-label {
    font-size: 44px;
    top: -40px;
    white-space: nowrap;
    text-shadow: 0 0 30px #0ff, 0 0 60px #0ff, 0 0 90px #0ff;
    letter-spacing: 8px;
  }
  
  /* Для длинных надписей */
  .hotspot-label[data-label="JOIN THE CLUB"] {
    white-space: normal;
    font-size: 64px;
    min-width: 300px;
    text-align: center;
    line-height: 1.3;
  }
}
      /* ============================================
         КУРСОРЫ
         ============================================ */

      * {
        cursor: url('/images/A.png') 8 8, auto;
      }

      .hotspot,
      .hotspot *,
      .edge-zone,
      .mobile-menu a,
      .mobile-menu button,
      .mobile-menu a *,
      .mobile-menu button *,
      nav a,
      nav a *,
      .menu-item,
      .menu-item *,
      a,
      a *,
      button,
      button * {
        cursor: url('/images/handarrow.png') 16 16, pointer !important;
      }

      body.dragging, .grabbing {
        cursor: url('/images/A.png') 8 8, grabbing !important;
      }

      
    `
    document.head.appendChild(style)
    
    document.body.style.overflow = 'hidden'
    document.body.style.margin = '0'
    document.body.style.padding = '0'

    const followRing = document.createElement('div')
    followRing.className = 'cursor-follow-ring'
    followRing.innerHTML = `<div class="click-text"><span>CLICK TO</span><span>EXPLORE</span></div>`
    document.body.appendChild(followRing)
    animateRing()

    const handleHotspotMouseEnter = (e: MouseEvent) => {
      const hotspot = e.currentTarget as HTMLElement
      const label = hotspot.dataset.label || ''
      const centerTitle = document.getElementById('center-title')

      if (label && centerTitle) {
        centerTitle.textContent = label
        centerTitle.classList.add('active')
      }
      showRing(e.clientX, e.clientY)
    }

    const handleHotspotMouseLeave = () => {
      const centerTitle = document.getElementById('center-title')
      if (centerTitle) {
        centerTitle.classList.remove('active')
        centerTitle.textContent = ''
      }
      hideRing()
    }

    const handleHotspotMouseMove = (e: MouseEvent) => {
      if (ringVisible) {
        updateRingPosition(e.clientX, e.clientY)
      }
    }

    const initHotspots = () => {
      const hotspots = document.querySelectorAll('.hotspot')
      hotspots.forEach((hotspot) => {
        const el = hotspot as HTMLElement
        const percentX = el.dataset.percentX || '0'
        const percentY = el.dataset.percentY || '0'
        el.style.left = `${percentX}%`
        el.style.top = `${percentY}%`
        
        el.removeEventListener('mouseenter', handleHotspotMouseEnter)
        el.removeEventListener('mouseleave', handleHotspotMouseLeave)
        el.removeEventListener('mousemove', handleHotspotMouseMove)
        
        el.addEventListener('mouseenter', handleHotspotMouseEnter)
        el.addEventListener('mouseleave', handleHotspotMouseLeave)
        el.addEventListener('mousemove', handleHotspotMouseMove)
      })
    }

    const preSetupPanorama = () => {
      const img = document.querySelector('.panorama-img') as HTMLImageElement
      if (!img) return

      const setup = () => {
        fixPanoramaScale()
        updatePanoramaView()
        initHotspots()
        setupMobileLabels()
        console.log('Panorama pre-setup complete')
      }

      if (img.complete && img.naturalWidth > 0) {
        setup()
      } else {
        img.addEventListener('load', setup)
      }
    }

    const observer = new MutationObserver(() => {
      const img = document.querySelector('.panorama-img')
      if (img) {
        preSetupPanorama()
        observer.disconnect()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const video = document.getElementById('intro-video-player') as HTMLVideoElement
    const introVideoDiv = document.getElementById('intro-video')
    
    const showPanoramaAfterVideo = () => {
      setShowPanorama(true)
      const locationName = document.getElementById('location-name')
      if (locationName) locationName.classList.add('show')
      
      if (introVideoDiv) {
        introVideoDiv.style.opacity = '0'
        setTimeout(() => {
          if (introVideoDiv) introVideoDiv.style.display = 'none'
        }, 500)
      }
      
      setTimeout(() => {
        fixPanoramaScale()
        updatePanoramaView()
        initHotspots()
        setupMobileLabels()
        setupEdgeZones()
        startViewLoop()
        
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mousemove', handleDragMove)
        document.addEventListener('mouseup', handleDragUp)
        document.addEventListener('touchstart', handleTouchStart)
        document.addEventListener('touchmove', handleTouchMove)
        document.addEventListener('touchend', handleTouchEnd)
      }, 100)
    }

    if (video) {
      if (video.ended) {
        showPanoramaAfterVideo()
      } else {
        video.addEventListener('ended', showPanoramaAfterVideo)
        video.play().catch(e => console.log('Video play error:', e))
      }
    }

    const handleResize = () => {
      fixPanoramaScale()
      updatePanoramaView()
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', (e) => {
      if (ringVisible) updateRingPosition(e.clientX, e.clientY)
    })

    return () => {
      style.remove()
      document.body.style.overflow = ''
      document.body.style.margin = ''
      document.body.style.padding = ''
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragUp)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      if (viewLoopId) cancelAnimationFrame(viewLoopId)
      if (ringAnimationFrame) cancelAnimationFrame(ringAnimationFrame)
      const ring = document.querySelector('.cursor-follow-ring')
      if (ring) ring.remove()
      if (mobileObserver) mobileObserver.disconnect()
    }
  }, [isMobile])

  const handleNavigate = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (section?.isPage && section.href) {
      window.location.href = section.href
    }
  }

  return (
    <>    
      <MobileMenu sections={sections} onNavigate={handleNavigate} />
      
      <LoadingScreen progress={loadingProgress} isVisible={showLoading} />
      
      <div className="edge-zone left" id="edge-left"><div className="edge-arrow">◀</div></div>
      <div className="edge-zone right" id="edge-right"><div className="edge-arrow">▶</div></div>
      
      <div id="center-indicator"></div>
      <div className="center-title" id="center-title">BRIDGE</div>
      <div id="location-name">BRIDGE</div>
      
      <div id="look-hint">
        <div className="look-arrows">⟵ LOOK AROUND ⟶</div>
        <div className="look-text">DRAG or MOVE TO EDGE</div>
        <div className="look-subtext">Explore the spaceship</div>
      </div>
      
      <div className="mobile-hint">
        <div className="mobile-hint-icon">
          <img 
            src="/image/hand.webp" 
            alt="hand icon" 
            style={{ width: '120px', height: '80px', display: 'block' }}
          />
        </div>
        <div>SLIDE TO EXPLORE</div>
      </div>

      <div id="viewport" style={{ opacity: showPanorama ? 1 : 0, transition: 'opacity 0.5s' }}>
        <div id="panorama">
          <div className="location active" id="loc-1">
            <div className="panorama-wrapper">
              <img src="/images/panorama-bridge.jpg" className="panorama-img" alt="Bridge" />
              <div className="layer-interactive">
                <div className="hotspot" data-percent-x="10.77" data-percent-y="51.80" data-label="COMMUNITY" onClick={() => router.push('/community')}>
                  <div className="hotspot-dot"></div>
                </div>
                
                <div className="hotspot" data-percent-x="50.09" data-percent-y="43.09" data-label="ABOUT" onClick={() => router.push('/about')}>
                  <div className="hotspot-dot"></div>
                  <div className="globe-protected" style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    marginLeft: '-5px',
                    width: '180px',
                    height: '180px',
                    zIndex: -1,
                    opacity: 0.7,
                    pointerEvents: 'none',
                  }}>
                    <SimpleGlobe 
                      width={180} 
                      height={180} 
                      color="#00d4ff"
                      autoRotate={true}
                      globeSpeed={0.1}
                      satellite={true}
                      satelliteColor="#ff6b35"
                      satelliteSpeed={0.05}
                      appearDelay={12000}
                      glitchInterval={22000}
                    />
                  </div>
                </div>

                <div className="hotspot" data-percent-x="26.34" data-percent-y="58.00" data-label="LIFT" onClick={() => console.log('LIFT')}>
                  <div className="hotspot-dot"></div>
                </div>

                <div className="hotspot" data-percent-x="77.58" data-percent-y="58.43" data-label="CARGO BAY" onClick={() => router.push('/cargobay')}>
                  <div className="hotspot-dot"></div>
                </div>

                <div className="hotspot" data-percent-x="91.79" data-percent-y="54.95" data-label="JOIN THE CLUB" onClick={() => console.log('JOIN THE CLUB')}>
                  <div className="hotspot-dot"></div>
                  <div className="hotspot-label" style={{ textAlign: 'center' }}>
                    <div style={{ lineHeight: '1' }}>JOIN</div>
                    <div style={{ lineHeight: '1' }}>THE CLUB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="intro-video" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1000, 
        backgroundColor: '#000',
        transition: 'opacity 0.5s',
        opacity: 1
      }}>
        <video 
          muted 
          playsInline 
          id="intro-video-player"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="/videos/intro-fly2.webm" type="video/webm" />
        </video>
      </div>

      {isMobile && (
        <>
          <GyroToggle 
            onOrientationChange={handleGyroChange}
            isActive={gyroActive}
            onToggle={() => setGyroActive(!gyroActive)}
          />

          {gyroActive && (
            <div className="fixed bottom-40 left-6 z-50 bg-black/80 text-[#00d4ff] text-xs px-2 py-1 rounded font-mono">
              GYRO: {(window.currentView || 0).toFixed(0)}
            </div>
          )}
        </>
      )}
    </>
  )
}