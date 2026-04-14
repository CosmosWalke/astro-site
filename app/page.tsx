'use client'
import { MobileMenu } from "@/components/ui/mobile-menu"
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { LoadingScreen } from '@/components/LoadingScreen'
import { GyroToggle } from '@/components/GyroToggle'
import SimpleGlobe from "@/components/ui/SimpleGlobe"

declare global {
  interface Window {
    enterLocation: (targetLocId: string, locationName: string) => void
    openSection: (name: string) => void
    closeSection: (name: string) => void
    openDoorWithVideo: () => void
    updateView: () => void
    fixPanoramaScale: () => void
    currentView: number
    panoramaReady: boolean
    openCommunityModal: () => void
    closeCommunityModal: () => void
  }
}

const sections = [
  { label: 'ABOUT', href: '/about', id: 'about', isPage: true },
  { label: 'COMMUNITY', href: '#community', id: 'community', isPage: false },
  { label: 'ASTRO CLUB', href: '#astro-club', id: 'astro-club', isPage: false },
  { label: 'CARGO BAY', href: '/cargobay', id: 'cargobay', isPage: true }, // Добавьте эту строку
]

// Социальные сети и контакты (обновленные иконки)
const socialLinks = [
  {
    name: 'INSTAGRAM',
    url: 'https://instagram.com/astrocommunity',
    icon: (className = "w-4 h-4") => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    color: '#E4405F'
  },
  {
    name: 'X (TWITTER)',
    url: 'https://twitter.com/astrocommunity',
    icon: (className = "w-4 h-4") => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: '#1DA1F2'
  },
  {
    name: 'YOUTUBE',
    url: 'https://youtube.com/@astrocommunity',
    icon: (className = "w-4 h-4") => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: '#FF0000'
  },
  {
    name: 'TELEGRAM',
    url: 'https://t.me/astrocommunity',
    icon: (className = "w-4 h-4") => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.212-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.053-.334-.375-.12l-6.87 4.326-2.96-.924c-.64-.2-.652-.64.133-.954l11.566-4.458c.532-.19.996.128.804.938z"/>
      </svg>
    ),
    color: '#26A5E4'
  },
  {
    name: 'DISCORD',
    url: 'https://discord.gg/astrocommunity',
    icon: (className = "w-4 h-4") => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.398-.875-.608-1.25a.077.077 0 0 0-.079-.037c-1.768.32-3.424.887-4.886 1.515a.072.072 0 0 0-.032.027c-2.876 4.29-3.661 8.48-3.273 12.62a.071.071 0 0 0 .026.047c2.042 1.5 4.02 2.41 5.962 3.01a.074.074 0 0 0 .08-.026c.464-.63.876-1.295 1.226-1.995a.074.074 0 0 0-.04-.105c-.675-.256-1.32-.565-1.94-.925a.074.074 0 0 1-.025-.104c.131-.19.264-.384.402-.579a.074.074 0 0 1 .082-.024c4.07 1.86 8.48 1.86 12.5 0a.074.074 0 0 1 .083.024c.138.195.27.389.402.579a.074.074 0 0 1-.025.104c-.62.36-1.265.669-1.94.925a.074.074 0 0 0-.04.105c.35.7.762 1.365 1.226 1.995a.074.074 0 0 0 .08.026c1.942-.6 3.92-1.51 5.962-3.01a.074.074 0 0 0 .026-.047c.465-4.18-.694-8.33-3.273-12.62a.072.072 0 0 0-.032-.027zM8.3 15.385c-1.2 0-2.186-1.1-2.186-2.45s.97-2.45 2.186-2.45c1.216 0 2.186 1.1 2.186 2.45s-.97 2.45-2.186 2.45zm7.4 0c-1.2 0-2.186-1.1-2.186-2.45s.97-2.45 2.186-2.45c1.216 0 2.186 1.1 2.186 2.45s-.97 2.45-2.186 2.45z"/>
      </svg>
    ),
    color: '#5865F2'
  },
  {
    name: 'WHATSAPP',
    url: 'https://wa.me/1234567890',
    icon: (className = "w-4 h-4") => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm-.04 18.19c-1.49 0-2.95-.39-4.24-1.14l-.3-.18-3.12.82.83-3.04-.2-.31c-.83-1.35-1.27-2.89-1.27-4.46 0-4.58 3.73-8.31 8.31-8.31 4.58 0 8.31 3.73 8.31 8.31 0 4.58-3.73 8.31-8.31 8.31zm4.55-6.21c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.26-.66.81-.81.98-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.15-.26-.02-.39.11-.52.11-.11.25-.29.38-.43.13-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.43-.56-.43h-.48c-.17 0-.43.06-.66.32-.23.26-.89.87-.89 2.12 0 1.25.91 2.45 1.04 2.62.13.17 1.8 2.74 4.36 3.84.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.21-.17-.45-.3z"/>
      </svg>
    ),
    color: '#25D366'
  }
]

// Контактная информация
const contactInfo = [
  { label: 'SUPPORT', value: 'support@astro.com', link: 'mailto:support@astro.com' },
  { label: 'PARTNERS', value: 'partners@astro.com', link: 'mailto:partners@astro.com' },
  { label: 'PRESS', value: 'press@astro.com', link: 'mailto:press@astro.com' },
  { label: 'HOTLINE', value: '+1 (800) ASTRO-123', link: 'tel:+18002786123' }
]

export default function PanoramaPage() {
  const isLoaded = useRef(false)
  const router = useRouter()
  const panoramaInitialized = useRef(false)
  const resourcesLoaded = useRef(false)

  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showLoading, setShowLoading] = useState(true)
  const [gyroActive, setGyroActive] = useState(false)
  const [allResourcesReady, setAllResourcesReady] = useState(false)

  let ringAnimationFrame: number | null = null
  let viewLoopId: number | null = null
  let currentTargetView = 0
  let mobileObserver: IntersectionObserver | null = null

  const afterLayout = (cb: () => void) => {
    requestAnimationFrame(() => requestAnimationFrame(cb))
  }

  // ====================== UPDATE PANORAMA ======================
  const updatePanoramaView = () => {
    const activeLoc = document.querySelector('.location.active') as HTMLElement | null
    if (!activeLoc) return

    const wrapper = activeLoc.querySelector('.panorama-wrapper') as HTMLElement | null
    if (!wrapper) return

    const vw = window.innerWidth
    const img = activeLoc.querySelector('.panorama-img') as HTMLImageElement | null
    const imgWidth = img ? (img.clientWidth || img.naturalWidth || vw * 2) : vw * 2

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
      if (Math.abs(cv - currentTargetView) > 0.5) {
        currentTargetView = cv
        updatePanoramaView()
      }
      viewLoopId = requestAnimationFrame(loop)
    }
    viewLoopId = requestAnimationFrame(loop)
  }

  const handleGyroChange = (gamma: number) => {
    if (!gyroActive) return
    
    const maxView = 75
    const minView = -75
    let newView = gamma * -2.5
    
    newView = Math.max(minView, Math.min(maxView, newView))
    
    window.currentView = newView
  }

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

  // Функции для открытия/закрытия модального окна COMMUNITY
  window.openCommunityModal = () => {
    const modal = document.getElementById('modal-community')
    if (modal) modal.style.display = 'flex'
  }

  window.closeCommunityModal = () => {
    const modal = document.getElementById('modal-community')
    if (modal) modal.style.display = 'none'
  }

// ====================== ФУНКЦИЯ ЗАГРУЗКИ ВСЕХ РЕСУРСОВ ======================
const loadAllResources = async (onProgress: (progress: number) => void) => {
  const resourcesToLoad: Promise<unknown>[] = []
  
  // Список всех изображений панорам
  const panoramaImages = [
    '/images/panorama-bridge.jpg',
    '/images/panorama-bridge.jpg',
  ]
  
  // Список видео
  const videos = [
    '/videos/intro-fly.mp4',
    '/videos/intro-enter.mp4',
  ]
  
  // Список аудио
  const audios = [
    '/sounds/intro-fly-audio.mp3',
    '/sounds/intro-enter-audio.mp3',
  ]
  
  let loadedCount = 0
  const totalCount = panoramaImages.length + videos.length + audios.length
  
  const updateProgress = () => {
    loadedCount++
    onProgress(Math.floor((loadedCount / totalCount) * 100))
  }
  
  // Загрузка изображений
  panoramaImages.forEach((src) => {
    const img = new Image()
    img.src = src
    const promise = new Promise((resolve) => {
      if (img.complete) {
        updateProgress()
        resolve(true)
      } else {
        img.onload = () => {
          updateProgress()
          resolve(true)
        }
        img.onerror = () => {
          updateProgress()
          resolve(false)
        }
      }
    })
    resourcesToLoad.push(promise)
  })
  
  // Загрузка видео
  videos.forEach((src) => {
    const promise = new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'auto'
      video.src = src
      video.addEventListener('canplaythrough', () => {
        updateProgress()
        resolve(true)
      }, { once: true })
      video.addEventListener('error', () => {
        updateProgress()
        resolve(false)
      }, { once: true })
      setTimeout(() => {
        updateProgress()
        resolve(false)
      }, 5000)
    })
    resourcesToLoad.push(promise)
  })
  
  // Загрузка аудио
  audios.forEach((src) => {
    const promise = new Promise((resolve) => {
      const audio = new Audio()
      audio.preload = 'auto'
      audio.src = src
      audio.addEventListener('canplaythrough', () => {
        updateProgress()
        resolve(true)
      }, { once: true })
      audio.addEventListener('error', () => {
        updateProgress()
        resolve(false)
      }, { once: true })
      setTimeout(() => {
        updateProgress()
        resolve(false)
      }, 5000)
    })
    resourcesToLoad.push(promise)
  })
  
  await Promise.all(resourcesToLoad)
  return true
}

// ====================== LOADING ======================
useEffect(() => {
  const startLoading = async () => {
    await loadAllResources((progress) => {
      setLoadingProgress(progress)
    })
    
    setAllResourcesReady(true)
    
    setTimeout(() => {
      setShowLoading(false)
    }, 300)
  }
  
  startLoading()
}, [])

  // Запуск видео и инициализация только после полной загрузки
  useEffect(() => {
    if (!allResourcesReady) return
    
    // Показываем main-content
    const mainContent = document.getElementById('main-content')
    if (mainContent) mainContent.style.display = 'block'
    
    // Запускаем первое видео
    const player1 = document.getElementById('intro-video-player-1') as HTMLVideoElement
    const audio1 = document.getElementById('audio-intro-1') as HTMLAudioElement
    
    if (player1) {
      player1.play().catch(e => console.log('Video 1 autoplay failed:', e))
    }
    if (audio1) {
      audio1.volume = 0.5
      audio1.play().catch(e => console.log('Audio 1 autoplay failed:', e))
    }
    
  }, [allResourcesReady])

  // ====================== MAIN INIT ======================
  useEffect(() => {
    if (isLoaded.current) return
    isLoaded.current = true

    const style = document.createElement('style')
    style.textContent = `
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
        opacity: 0; 
        visibility: hidden; 
        pointer-events: none; 
      }
      .location.active { 
        opacity: 1; 
        visibility: visible; 
        pointer-events: all; 
      }

      .layer-interactive { 
        position: absolute; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        pointer-events: none;
      }

      .layer-animated {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      #viewport { 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        overflow: hidden; 
      }

      #panorama { 
        position: absolute; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
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

      .hotspot-door { 
        position: absolute; 
        pointer-events: all !important; 
        width: 140px; 
        height: 140px; 
        transform: translate(-50%, -50%); 
        z-index: 100; 
        cursor: pointer; 
      }
      .hotspot-door .hotspot-dot { 
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

      .hotspot-label {
        position: absolute;
        top: -68px;
        left: 50%;
        transform: translateX(-50%) translateY(30px);
        background: rgba(0, 0, 0, 0.85);
        color: #0ff;
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        white-space: nowrap;
        font-family: 'CCUltimatum', monospace;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        box-shadow: 0 0 20px #0ff, 0 0 40px rgba(0, 255, 255, 0.4);
        transition: opacity 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1),
                    transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1);
        z-index: 110;
        text-align: center;
        line-height: 1.2;
      }

      .hotspot-label.show {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
      }

      /* Стили для модального окна COMMUNITY */
      .community-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
        font-family: 'CCUltimatum', monospace;
      }

      .community-modal-content {
        max-width: 600px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        background: linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(0, 0, 0, 0.98));
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 20px;
        padding: 30px;
        position: relative;
        box-shadow: 0 0 60px rgba(0, 212, 255, 0.2);
      }

      .community-modal-close {
        position: absolute;
        top: 20px;
        right: 25px;
        font-size: 40px;
        cursor: pointer;
        color: #00d4ff;
        transition: all 0.3s ease;
        line-height: 1;
      }

      .community-modal-close:hover {
        color: #fff;
        transform: rotate(90deg);
      }

      .community-title {
        text-align: center;
        font-size: 36px;
        font-weight: bold;
        color: #00d4ff;
        margin-bottom: 10px;
        letter-spacing: 4px;
        text-transform: uppercase;
      }

      .community-subtitle {
        text-align: center;
        color: #6b6b7b;
        font-size: 14px;
        margin-bottom: 30px;
        letter-spacing: 2px;
      }

      .social-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        margin-bottom: 40px;
      }

      .social-card {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 12px;
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .social-card:hover {
        border-color: #00d4ff;
        background: rgba(0, 212, 255, 0.1);
        transform: translateX(5px);
      }

      .social-icon {
        font-size: 32px;
      }

      .social-info {
        flex: 1;
      }

      .social-name {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        letter-spacing: 1px;
      }

      .social-username {
        font-size: 12px;
        color: #6b6b7b;
        margin-top: 4px;
      }

      .social-arrow {
        color: #00d4ff;
        font-size: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .social-card:hover .social-arrow {
        opacity: 1;
      }

      .contacts-section {
        border-top: 1px solid rgba(0, 212, 255, 0.2);
        padding-top: 30px;
      }

      .contacts-title {
        font-size: 20px;
        color: #00d4ff;
        margin-bottom: 20px;
        letter-spacing: 2px;
        text-align: center;
      }

      .contact-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .contact-label {
        color: #6b6b7b;
        font-size: 14px;
        letter-spacing: 1px;
      }

      .contact-value {
        color: #fff;
        font-size: 14px;
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .contact-value:hover {
        color: #00d4ff;
      }

      @media (max-width: 768px) {
        .community-modal-content {
          padding: 20px;
          width: 95%;
        }
        .community-title {
          font-size: 28px;
        }
        .social-grid {
          grid-template-columns: 1fr;
        }
        .social-card {
          padding: 12px 15px;
        }
      }

      @media (min-width: 769px) {
        .hotspot-label {
          display: none !important;
        }
      }

      @media (max-width: 768px) {
        .hotspot-label {
          top: -78px;
          font-size: 16px;
          padding: 8px 18px;
        }
      }
    `
    document.head.appendChild(style)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/css/style.css'
    document.head.appendChild(link)

    document.body.style.overflow = 'hidden'
    document.body.style.margin = '0'
    document.body.style.padding = '0'

    let ringVisible = false
    let ringTargetX = 0
    let ringTargetY = 0
    let ringCurrentX = 0
    let ringCurrentY = 0

    const fixPanoramaScale = () => {
      const activeLoc = document.querySelector('.location.active')
      if (!activeLoc) return

      const wrapper = activeLoc.querySelector('.panorama-wrapper') as HTMLElement
      const img = activeLoc.querySelector('.panorama-img') as HTMLImageElement
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
      const activeLoc = document.querySelector('.location.active')
      if (!activeLoc) return

      const hotspots = activeLoc.querySelectorAll('.hotspot')

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

      if (!document.querySelector('.cursor-follow-ring')) {
        const followRing = document.createElement('div')
        followRing.className = 'cursor-follow-ring'
        followRing.innerHTML = `<div class="click-text"><span>CLICK TO</span><span>EXPLORE</span></div>`
        document.body.appendChild(followRing)
      }
    }

    window.enterLocation = (targetLocId: string, locationName: string) => {
      document.querySelectorAll('.hotspot-label.show').forEach((label) => {
        (label as HTMLElement).classList.remove('show')
      })

      const currentActive = document.querySelector('.location.active')
      if (currentActive) currentActive.classList.remove('active')

      const targetLocation = document.getElementById(targetLocId)
      if (!targetLocation) return

      targetLocation.classList.add('active')

      const img = targetLocation.querySelector('.panorama-img') as HTMLImageElement

      const run = () => {
        fixPanoramaScale()
        afterLayout(() => {
          updatePanoramaView()
          afterLayout(() => {
            initHotspots()
            setupMobileLabels()
          })
        })
      }

      if (img && img.complete && img.naturalWidth > 0) {
        run()
      } else if (img) {
        img.onload = run
      } else {
        run()
      }
    }

    window.openSection = (name: string) => {
      if (name === 'community') {
        window.openCommunityModal()
      } else {
        const modal = document.getElementById(`modal-${name}`)
        if (modal) modal.style.display = 'flex'
      }
    }

    window.closeSection = (name: string) => {
      const modal = document.getElementById(`modal-${name}`)
      if (modal) modal.style.display = 'none'
    }

    window.openDoorWithVideo = () => {
      const introScreen = document.getElementById('intro-screen')
      const introVideo2 = document.getElementById('intro-video-2')
      const player2 = document.getElementById('intro-video-player-2') as HTMLVideoElement

      if (introScreen) {
        introScreen.style.opacity = '0'
        introScreen.style.pointerEvents = 'none'
      }
      if (introVideo2) {
        introVideo2.style.opacity = '1'
        introVideo2.style.pointerEvents = 'all'
      }
      if (player2) player2.play()
    }

    window.updateView = updatePanoramaView
    window.fixPanoramaScale = fixPanoramaScale
    window.currentView = 0
    window.panoramaReady = false

    const setupPanorama = () => {
      fixPanoramaScale()
      
      afterLayout(() => {
        updatePanoramaView()
        afterLayout(() => {
          initHotspots()
          setupMobileLabels()
          window.panoramaReady = true
          console.log('Panorama ready, hotspots positioned')
          startViewLoop()
        })
      })
    }

    const initPanoramaAfterVideo = () => {
      if (panoramaInitialized.current) return
      panoramaInitialized.current = true

      const img = document.querySelector('.location.active .panorama-img') as HTMLImageElement

      if (img && img.complete && img.naturalWidth > 0) {
        setupPanorama()
      } else if (img) {
        img.addEventListener('load', setupPanorama)
      } else {
        setupPanorama()
      }
    }

    const setupVideoEndListener = () => {
      const player2 = document.getElementById('intro-video-player-2') as HTMLVideoElement
      if (player2) {
        if (player2.ended) {
          initPanoramaAfterVideo()
        } else {
          player2.addEventListener('ended', initPanoramaAfterVideo, { once: true })
        }
      } else {
        const observer = new MutationObserver(() => {
          const video = document.getElementById('intro-video-player-2') as HTMLVideoElement
          if (video) {
            if (video.ended) initPanoramaAfterVideo()
            else video.addEventListener('ended', initPanoramaAfterVideo, { once: true })
            observer.disconnect()
          }
        })
        observer.observe(document.body, { childList: true, subtree: true })
      }
    }

    const waitForVideo = () => {
      const video = document.getElementById('intro-video-player-2') as HTMLVideoElement
      if (video) {
        setupVideoEndListener()
      } else {
        setTimeout(waitForVideo, 100)
      }
    }

    waitForVideo()

    const handleResize = () => {
      if (window.panoramaReady) {
        fixPanoramaScale()
        afterLayout(() => {
          updatePanoramaView()
        })
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      if (ringVisible) {
        updateRingPosition(e.clientX, e.clientY)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      const oldLink = document.querySelector('link[href="/css/style.css"]')
      if (oldLink) oldLink.remove()
      style.remove()

      document.body.style.overflow = ''
      document.body.style.margin = ''
      document.body.style.padding = ''

      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)

      if (ringAnimationFrame) cancelAnimationFrame(ringAnimationFrame)
      if (viewLoopId) cancelAnimationFrame(viewLoopId)
      if (mobileObserver) mobileObserver.disconnect()
    }
  }, [router])

  const handleNavigate = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    
    if (section?.isPage && section.href) {
      window.location.href = section.href
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>    
      <MobileMenu sections={sections} onNavigate={handleNavigate} />
      
      <LoadingScreen progress={loadingProgress} isVisible={showLoading} />
      
      <Script src="/js/main.js" strategy="afterInteractive" />

// Вставьте этот код в ваш PanoramaPage компонент, заменив существующее модальное окно COMMUNITY

{/* Модальное окно COMMUNITY 
<div id="modal-community" className="community-modal">
  <div className="community-modal-content">
    <div className="community-modal-close" onClick={() => window.closeCommunityModal()}>×</div>
    <div className="community-title">COMMUNITY</div>
    <div className="community-subtitle">CONNECT WITH US</div>
    
    <div className="social-grid">
  
      <a
        href="https://instagram.com/ваш_аккаунт"
        target="_blank"
        rel="noopener noreferrer"
        className="social-card"
        style={{ borderColor: '#E4405F40' }}
      >
        <div className="social-icon">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </div>
        <div className="social-info">
          <div className="social-name">INSTAGRAM</div>
          <div className="social-username">@astrocommunity</div>
        </div>
        <div className="social-arrow">→</div>
      </a>


      <a
        href="https://twitter.com/ваш_аккаунт"
        target="_blank"
        rel="noopener noreferrer"
        className="social-card"
        style={{ borderColor: '#1DA1F240' }}
      >
        <div className="social-icon">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
        <div className="social-info">
          <div className="social-name">X (TWITTER)</div>
          <div className="social-username">@astrocommunity</div>
        </div>
        <div className="social-arrow">→</div>
      </a>

    
      <a
        href="https://youtube.com/@ваш_канал"
        target="_blank"
        rel="noopener noreferrer"
        className="social-card"
        style={{ borderColor: '#FF000040' }}
      >
        <div className="social-icon">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div className="social-info">
          <div className="social-name">YOUTUBE</div>
          <div className="social-username">@astrocommunity</div>
        </div>
        <div className="social-arrow">→</div>
      </a>

   
      <a
        href="https://t.me/ваш_канал"
        target="_blank"
        rel="noopener noreferrer"
        className="social-card"
        style={{ borderColor: '#26A5E440' }}
      >
        <div className="social-icon">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.212-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.053-.334-.375-.12l-6.87 4.326-2.96-.924c-.64-.2-.652-.64.133-.954l11.566-4.458c.532-.19.996.128.804.938z"/>
          </svg>
        </div>
        <div className="social-info">
          <div className="social-name">TELEGRAM</div>
          <div className="social-username">@astrocommunity</div>
        </div>
        <div className="social-arrow">→</div>
      </a>

    
      <a
        href="https://discord.gg/ваш_сервер"
        target="_blank"
        rel="noopener noreferrer"
        className="social-card"
        style={{ borderColor: '#5865F240' }}
      >
        <div className="social-icon">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.398-.875-.608-1.25a.077.077 0 0 0-.079-.037c-1.768.32-3.424.887-4.886 1.515a.072.072 0 0 0-.032.027c-2.876 4.29-3.661 8.48-3.273 12.62a.071.071 0 0 0 .026.047c2.042 1.5 4.02 2.41 5.962 3.01a.074.074 0 0 0 .08-.026c.464-.63.876-1.295 1.226-1.995a.074.074 0 0 0-.04-.105c-.675-.256-1.32-.565-1.94-.925a.074.074 0 0 1-.025-.104c.131-.19.264-.384.402-.579a.074.074 0 0 1 .082-.024c4.07 1.86 8.48 1.86 12.5 0a.074.074 0 0 1 .083.024c.138.195.27.389.402.579a.074.074 0 0 1-.025.104c-.62.36-1.265.669-1.94.925a.074.074 0 0 0-.04.105c.35.7.762 1.365 1.226 1.995a.074.074 0 0 0 .08.026c1.942-.6 3.92-1.51 5.962-3.01a.074.074 0 0 0 .026-.047c.465-4.18-.694-8.33-3.273-12.62a.072.072 0 0 0-.032-.027zM8.3 15.385c-1.2 0-2.186-1.1-2.186-2.45s.97-2.45 2.186-2.45c1.216 0 2.186 1.1 2.186 2.45s-.97 2.45-2.186 2.45zm7.4 0c-1.2 0-2.186-1.1-2.186-2.45s.97-2.45 2.186-2.45c1.216 0 2.186 1.1 2.186 2.45s-.97 2.45-2.186 2.45z"/>
          </svg>
        </div>
        <div className="social-info">
          <div className="social-name">DISCORD</div>
          <div className="social-username">discord.gg/astro</div>
        </div>
        <div className="social-arrow">→</div>
      </a>

      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="social-card"
        style={{ borderColor: '#25D36640' }}
      >
        <div className="social-icon">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm-.04 18.19c-1.49 0-2.95-.39-4.24-1.14l-.3-.18-3.12.82.83-3.04-.2-.31c-.83-1.35-1.27-2.89-1.27-4.46 0-4.58 3.73-8.31 8.31-8.31 4.58 0 8.31 3.73 8.31 8.31 0 4.58-3.73 8.31-8.31 8.31zm4.55-6.21c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.26-.66.81-.81.98-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.15-.26-.02-.39.11-.52.11-.11.25-.29.38-.43.13-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.43-.56-.43h-.48c-.17 0-.43.06-.66.32-.23.26-.89.87-.89 2.12 0 1.25.91 2.45 1.04 2.62.13.17 1.8 2.74 4.36 3.84.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.21-.17-.45-.3z"/>
          </svg>
        </div>
        <div className="social-info">
          <div className="social-name">WHATSAPP</div>
          <div className="social-username">+1 (234) 567-890</div>
        </div>
        <div className="social-arrow">→</div>
      </a>
    </div>
    
    <div className="contacts-section">
      <div className="contacts-title">CONTACT INFO</div>
      <div className="contact-item">
        <span className="contact-label">SUPPORT</span>
        <a href="mailto:support@astro.com" className="contact-value">support@astro.com</a>
      </div>
      <div className="contact-item">
        <span className="contact-label">PARTNERS</span>
        <a href="mailto:partners@astro.com" className="contact-value">partners@astro.com</a>
      </div>
      <div className="contact-item">
        <span className="contact-label">PRESS</span>
        <a href="mailto:press@astro.com" className="contact-value">press@astro.com</a>
      </div>
      <div className="contact-item">
        <span className="contact-label">HOTLINE</span>
        <a href="tel:+18002786123" className="contact-value">+1 (800) ASTRO-123</a>
      </div>
    </div>
  </div>
</div>
*/}
      <div id="main-content" style={{ display: 'none' }}>
        <div id="hud">
          <div className="scanline"></div>
          <div className="vignette"></div>
        </div>

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

        <div id="viewport">
          <div id="panorama">
            <div className="location active" id="loc-1">
              <div className="panorama-wrapper">
                <img src="/images/panorama-bridge.jpg" className="panorama-img" alt="Bridge" />
                <div className="layer-interactive">
                  <div className="hotspot" data-percent-x="10.77" data-percent-y="51.80" data-label="COMMUNITY" onClick={() => window.openSection?.('community')}>
                    <div className="hotspot-dot"></div>
                  </div>
                  
                  {/* ХОТСПОТ ABOUT С ГЛОБУСОМ */}
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
    <div className="hotspot" data-percent-x="77.58" data-percent-y="58.43" data-label="CARGO BAY">
  <div className="hotspot-dot"></div>
  <a 
    href="/cargobay" 
    style={{ 
      position: 'absolute', 
      inset: 0, 
      opacity: 0, 
      cursor: 'pointer',
      zIndex: 10 
    }}
    onClick={(e) => {
      e.preventDefault();
      window.location.href = '/cargobay';
    }}
  />
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
              <div className="layer-animated">
                <div className="animated-object robot" style={{ left: '20%', top: '55%' }} id="robot-1"></div>
                <div className="animated-object person" style={{ left: '50%', top: '52%' }} id="person-1"></div>
                <div className="animated-object screen" style={{ left: '80%', top: '45%' }}></div>
              </div>
            </div>
            {/* ==================== COMMUNITY ==================== */}
            <div className="location" id="loc-2">
              <div className="panorama-wrapper">
                <img src="/images/panorama-bridge.jpg" className="panorama-img" alt="Community" />
                <div className="layer-interactive">
                  <div className="hotspot" data-percent-x="10" data-percent-y="55" data-label="BRIDGE" onClick={() => window.enterLocation?.('loc-1', 'BRIDGE')}>
                    <div className="hotspot-dot"></div>
                  </div>
                  <div className="hotspot" data-percent-x="90" data-percent-y="55" data-label="QUARTERS" onClick={() => window.enterLocation?.('loc-3', 'QUARTERS')}>
                    <div className="hotspot-dot"></div>
                  </div>
                  <div className="hotspot" data-percent-x="35" data-percent-y="50" data-label="BAR" onClick={() => window.openSection?.('bar')}>
                    <div className="hotspot-dot"></div>
                  </div>
                  <div className="hotspot" data-percent-x="65" data-percent-y="60" data-label="LOUNGE" onClick={() => window.openSection?.('lounge')}>
                    <div className="hotspot-dot"></div>
                  </div>
                </div>
              </div>
              <div className="layer-animated">
                <div className="animated-object person" style={{ left: '15%', top: '55%' }} id="person-2"></div>
                <div className="animated-object person" style={{ left: '45%', top: '53%' }} id="person-3"></div>
                <div className="animated-object person" style={{ left: '75%', top: '56%' }} id="person-4"></div>
              </div>
            </div>

            {/* ==================== QUARTERS ==================== */}
            <div className="location" id="loc-3">
              <div className="panorama-wrapper">
                <img src="/images/panorama-bridge.jpg" className="panorama-img" alt="Quarters" />
                <div className="layer-interactive">
                  <div className="hotspot" data-percent-x="10" data-percent-y="55" data-label="COMMUNITY" onClick={() => window.enterLocation?.('loc-2', 'COMMUNITY')}>
                    <div className="hotspot-dot"></div>
                  </div>
                  <div className="hotspot" data-percent-x="40" data-percent-y="50" data-label="QUARTERS 1" onClick={() => window.openSection?.('quarters1')}>
                    <div className="hotspot-dot"></div>
                  </div>
                  <div className="hotspot" data-percent-x="70" data-percent-y="60" data-label="STORAGE" onClick={() => window.openSection?.('storage')}>
                    <div className="hotspot-dot"></div>
                  </div>
                </div>
              </div>
              <div className="layer-animated">
                <div className="animated-object person" style={{ left: '30%', top: '60%' }} id="person-5"></div>
                <div className="animated-object person" style={{ left: '70%', top: '55%' }} id="person-6"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== MODALS ==================== */}
        <div className="section-modal" id="modal-cargo">
          <div className="section-content">
            <div className="close-btn" onClick={() => window.closeSection?.('cargo')}>×</div>
            <h2 className="section-title">📦 CARGO BAY</h2>
            <div className="stat-row"><span className="stat-label">Load:</span><span className="stat-value">78%</span></div>
            <div className="stat-row"><span className="stat-label">Cargo units:</span><span className="stat-value">12</span></div>
          </div>
        </div>

        <div className="section-modal" id="modal-bar">
          <div className="section-content">
            <div className="close-btn" onClick={() => window.closeSection?.('bar')}>×</div>
            <h2 className="section-title">🍺 BAR</h2>
            <p>Crew relaxation area</p>
            <div className="stat-row"><span className="stat-label">Drinks:</span><span className="stat-value">Available</span></div>
          </div>
        </div>

        <div className="section-modal" id="modal-lounge">
          <div className="section-content">
            <div className="close-btn" onClick={() => window.closeSection?.('lounge')}>×</div>
            <h2 className="section-title">🛋️ LOUNGE</h2>
            <p>Social & rest zone</p>
          </div>
        </div>

        <div className="section-modal" id="modal-quarters1">
          <div className="section-content">
            <div className="close-btn" onClick={() => window.closeSection?.('quarters1')}>×</div>
            <h2 className="section-title">🛏️ QUARTERS 1</h2>
            <p>Crew cabin</p>
            <div className="stat-row"><span className="stat-label">Status:</span><span className="stat-value">Vacant</span></div>
          </div>
        </div>

        <div className="section-modal" id="modal-storage">
          <div className="section-content">
            <div className="close-btn" onClick={() => window.closeSection?.('storage')}>×</div>
            <h2 className="section-title">📦 STORAGE</h2>
            <p>Supply storage</p>
          </div>
        </div>
      </div>

      <div id="intro-video-1" className="intro-video">
        <img id="static-bg-1" src="/images/space-bg.jpg" alt="Static door scene" className="static-bg" />
        <video muted playsInline id="intro-video-player-1">
          <source src="/videos/intro-fly.mp4" type="video/mp4" />
        </video>
        <audio id="audio-intro-1" preload="auto">
          <source src="/sounds/intro-fly-audio.mp3" type="audio/mpeg" />
        </audio>
      </div>

      <div id="intro-video-2" className="intro-video" style={{ opacity: 0, pointerEvents: 'none' }}>
        <img id="static-bg-2" src="/images/panorama-1-center.jpg" alt="Static bridge scene" className="static-bg" />
        <video muted playsInline id="intro-video-player-2">
          <source src="/videos/intro-enter.mp4" type="video/mp4" />
        </video>
        <audio id="audio-intro-2" preload="auto">
          <source src="/sounds/intro-enter-audio.mp3" type="audio/mpeg" />
        </audio>
      </div>

      <div id="intro-screen" className="intro-screen" style={{ opacity: 0, pointerEvents: 'none' }}>
        <div className="scene-background"></div>
        <div className="door-container">
          <div className="door door-left"></div>
          <div className="door door-right"></div>
          <div
            className="hotspot-door"
            style={{
              left: '75.28%',
              top: '65.39%',
              width: '140px',
              height: '140px',
              cursor: 'pointer',
              zIndex: 100,
            }}
            onClick={() => window.openDoorWithVideo?.()}
          >
            <div className="hotspot-dot"></div>
          </div>
        </div>
      </div>

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
  )
}