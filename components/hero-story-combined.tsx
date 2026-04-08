'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { TextScramble } from "@/components/ui/text-scramble"
import { Starfield } from '@/components/ui/starfield-1'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const worldLocations = [
  {
    id: 'NEXUS',
    name: 'The Nexus',
    description: 'Central hub of the Protocol. All data flows through this ancient structure.',
    coordinates: { x: 50, y: 40 },
    type: 'CORE',
    status: 'ONLINE'
  },
  {
    id: 'CITADEL',
    name: 'Northern Citadel',
    description: 'A fortress of ice and steel. Home to the Vanguard training grounds.',
    coordinates: { x: 30, y: 20 },
    type: 'KEEP',
    status: 'ONLINE'
  },
  {
    id: 'ARCHIVE',
    name: 'The Archive',
    description: 'Repository of all human knowledge. Guarded by the Scribes.',
    coordinates: { x: 70, y: 30 },
    type: 'VAULT',
    status: 'SECURE'
  },
  {
    id: 'WASTELAND',
    name: 'Eastern Wasteland',
    description: 'Dangerous territory filled with remnants of the old world.',
    coordinates: { x: 80, y: 60 },
    type: 'ZONE',
    status: 'HOSTILE'
  },
  {
    id: 'FORGE',
    name: 'The Forge',
    description: 'Industrial center where the Architects create and innovate.',
    coordinates: { x: 20, y: 65 },
    type: 'FACILITY',
    status: 'ACTIVE'
  },
  {
    id: 'HAVEN',
    name: 'Southern Haven',
    description: 'A sanctuary for civilians. The last bastion of normal life.',
    coordinates: { x: 55, y: 75 },
    type: 'SETTLEMENT',
    status: 'PROTECTED'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ONLINE':
    case 'ACTIVE':
      return '#00d4ff'
    case 'SECURE':
    case 'PROTECTED':
      return '#14f195'
    case 'HOSTILE':
      return '#ff6b35'
    default:
      return '#6b6b7b'
  }
}

const panoramaImages = {
  desktop: [
    '/image/pan1.webp',
    '/image/pan2.webp',
    '/image/pan3.webp',
    '/image/pan4.webp',
    '/image/pan5.webp',
  ],
  mobile: [
    '/image/pan1-mobile.webp',
    '/image/pan2-mobile.webp',
    '/image/pan3-mobile.webp',
    '/image/pan4-mobile.webp',
    '/image/pan5-mobile.webp',
  ]
}

const panoramaVideos = {
  desktop: '/video/pan1.webm',
  mobile: '/video/pan1-mobile.webm'
}

// Статусы для загрузочного экрана
const statusMessages = [
  '// initializing',
  'new files in database',
  'astro_connection',
  'audio_log_2018116.wav',
  'activate console for access...',
  '// loading assets',
  '// establishing connection',
  '// protocol ready'
]

const barcodeWidths = [2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 1, 1, 2]

// Добавь эту функцию перед useEffect с загрузкой (примерно после всех констант и перед export function HeroStoryCombined)

// Функция загрузки всех ресурсов
const loadAllResources = async (onProgress: (progress: number) => void) => {
  console.log('🚀 НАЧАЛО ЗАГРУЗКИ ВСЕХ РЕСУРСОВ...')
  
  const resourcesToLoad: Promise<unknown>[] = []
  
  // Список изображений hero
  const heroImages = [
    { src: '/image/hero.webp', name: 'Hero Desktop' },
    { src: '/image/hero-mobile.webp', name: 'Hero Mobile' },
  ]
  
  // Список изображений панорамы (десктоп)
  const panoramaDesktopImages = [
    '/image/pan1.webp',
    '/image/pan2.webp',
    '/image/pan3.webp',
    '/image/pan4.webp',
    '/image/pan5.webp',
  ]
  
  // Список изображений панорамы (мобильные)
  const panoramaMobileImages = [
    '/image/pan1-mobile.webp',
    '/image/pan2-mobile.webp',
    '/image/pan3-mobile.webp',
    '/image/pan4-mobile.webp',
    '/image/pan5-mobile.webp',
  ]
  
  // Видео панорамы
  const panoramaVideos = [
    { src: '/video/pan1.webm', name: 'Panorama Desktop' },
    { src: '/video/pan1-mobile.webm', name: 'Panorama Mobile' },
  ]
  
  // Видео для флип карты
  const flipVideo = { src: '/video/void.webm', name: 'Flip Card Video' }
  
  // Загрузочное видео
  const loadingVideo = { src: '/video/loading.webm', name: 'Loading Video' }
  
  let loadedCount = 0
  const totalCount = heroImages.length + 
    panoramaDesktopImages.length + 
    panoramaMobileImages.length + 
    panoramaVideos.length + 
    1 + // flip video
    1   // loading video
  
  const updateProgress = (resourceName: string) => {
    loadedCount++
    const progress = Math.floor((loadedCount / totalCount) * 100)
    console.log(`✅ Загружено: ${resourceName} (${loadedCount}/${totalCount}) - ${progress}%`)
    onProgress(progress)
  }
  
  // Загрузка hero изображений
  heroImages.forEach(({ src, name }) => {
    const img = new Image()
    img.src = src
    console.log(`🖼️ Начинаю загрузку: ${name} (${src})`)
    const promise = new Promise((resolve) => {
      if (img.complete) {
        console.log(`⚡ ${name} - уже в кеше`)
        updateProgress(name)
        resolve(true)
      } else {
        img.onload = () => {
          console.log(`📷 ${name} - загружено!`)
          updateProgress(name)
          resolve(true)
        }
        img.onerror = (e) => {
          console.error(`❌ Ошибка загрузки ${name}:`, e)
          updateProgress(name)
          resolve(false)
        }
      }
    })
    resourcesToLoad.push(promise)
  })
  
  // Загрузка панорамных изображений (десктоп)
  panoramaDesktopImages.forEach((src) => {
    const img = new Image()
    img.src = src
    const name = `Panorama Desktop: ${src.split('/').pop()}`
    console.log(`🖼️ Начинаю загрузку: ${name}`)
    const promise = new Promise((resolve) => {
      if (img.complete) {
        updateProgress(name)
        resolve(true)
      } else {
        img.onload = () => {
          updateProgress(name)
          resolve(true)
        }
        img.onerror = () => {
          updateProgress(name)
          resolve(false)
        }
      }
    })
    resourcesToLoad.push(promise)
  })
  
  // Загрузка панорамных изображений (мобильные)
  panoramaMobileImages.forEach((src) => {
    const img = new Image()
    img.src = src
    const name = `Panorama Mobile: ${src.split('/').pop()}`
    console.log(`🖼️ Начинаю загрузку: ${name}`)
    const promise = new Promise((resolve) => {
      if (img.complete) {
        updateProgress(name)
        resolve(true)
      } else {
        img.onload = () => {
          updateProgress(name)
          resolve(true)
        }
        img.onerror = () => {
          updateProgress(name)
          resolve(false)
        }
      }
    })
    resourcesToLoad.push(promise)
  })
  
  // Загрузка видео панорамы
  panoramaVideos.forEach(({ src, name }) => {
    console.log(`🎬 Начинаю загрузку: ${name} (${src})`)
    const promise = new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'auto'
      video.src = src
      
      let resolved = false
      
      video.addEventListener('canplaythrough', () => {
        if (!resolved) {
          resolved = true
          console.log(`📹 ${name} - загружено!`)
          updateProgress(name)
          resolve(true)
        }
      }, { once: true })
      
      video.addEventListener('error', (e) => {
        if (!resolved) {
          resolved = true
          console.error(`❌ Ошибка загрузки ${name}:`, e)
          updateProgress(name)
          resolve(false)
        }
      }, { once: true })
      
      setTimeout(() => {
        if (!resolved) {
          resolved = true
          console.warn(`⚠️ Таймаут загрузки ${name}, продолжаем...`)
          updateProgress(name)
          resolve(false)
        }
      }, 10000)
    })
    resourcesToLoad.push(promise)
  })
  
  // Загрузка видео для флип карты
  console.log(`🎬 Начинаю загрузку: ${flipVideo.name} (${flipVideo.src})`)
  const flipVideoPromise = new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.src = flipVideo.src
    
    let resolved = false
    
    video.addEventListener('canplaythrough', () => {
      if (!resolved) {
        resolved = true
        console.log(`📹 ${flipVideo.name} - загружено!`)
        updateProgress(flipVideo.name)
        resolve(true)
      }
    }, { once: true })
    
    video.addEventListener('error', (e) => {
      if (!resolved) {
        resolved = true
        console.error(`❌ Ошибка загрузки ${flipVideo.name}:`, e)
        updateProgress(flipVideo.name)
        resolve(false)
      }
    }, { once: true })
    
    setTimeout(() => {
      if (!resolved) {
        resolved = true
        console.warn(`⚠️ Таймаут загрузки ${flipVideo.name}, продолжаем...`)
        updateProgress(flipVideo.name)
        resolve(false)
      }
    }, 10000)
  })
  resourcesToLoad.push(flipVideoPromise)
  
  // Загрузка загрузочного видео
  console.log(`🎬 Начинаю загрузку: ${loadingVideo.name} (${loadingVideo.src})`)
  const loadingVideoPromise = new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.src = loadingVideo.src
    
    let resolved = false
    
    video.addEventListener('canplaythrough', () => {
      if (!resolved) {
        resolved = true
        console.log(`📹 ${loadingVideo.name} - загружено!`)
        updateProgress(loadingVideo.name)
        resolve(true)
      }
    }, { once: true })
    
    video.addEventListener('error', (e) => {
      if (!resolved) {
        resolved = true
        console.error(`❌ Ошибка загрузки ${loadingVideo.name}:`, e)
        updateProgress(loadingVideo.name)
        resolve(false)
      }
    }, { once: true })
    
    setTimeout(() => {
      if (!resolved) {
        resolved = true
        console.warn(`⚠️ Таймаут загрузки ${loadingVideo.name}, продолжаем...`)
        updateProgress(loadingVideo.name)
        resolve(false)
      }
    }, 10000)
  })
  resourcesToLoad.push(loadingVideoPromise)
  
  console.log('⏳ Ожидание загрузки всех ресурсов...')
  await Promise.all(resourcesToLoad)
  console.log('🎉 ВСЕ РЕСУРСЫ ЗАГРУЖЕНЫ!')
  return true
}


export function HeroStoryCombined() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLowEnd, setIsLowEnd] = useState(false)
  
  // Hero refs
  const heroImageRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const contentLayerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const trailerCardRef = useRef<HTMLDivElement>(null)
  const thumbnailFrameRef = useRef<HTMLDivElement>(null)
  const overlayFrameRef = useRef<HTMLDivElement>(null)
  const textOverlayFrameRef = useRef<HTMLDivElement>(null) 
  const leftContentRef = useRef<HTMLDivElement>(null)
  
  // Flip card refs
  const flipCardContainerRef = useRef<HTMLDivElement>(null)
  const flipCardWrapperRef = useRef<HTMLDivElement>(null)
  const flipCardRef = useRef<HTMLDivElement>(null)
  const cardFrontRef = useRef<HTMLDivElement>(null)
  const cardBackRef = useRef<HTMLDivElement>(null)
  
  // 3D Mask refs
  const maskContainerRef = useRef<HTMLDivElement>(null)
  const maskWrapperRef = useRef<HTMLDivElement>(null)
  const maskCardRef = useRef<HTMLDivElement>(null)
  
  // Panorama refs
  const panoramaRef = useRef<HTMLDivElement>(null)
  const panoramaInnerRef = useRef<HTMLDivElement>(null)
  const text1Ref = useRef<HTMLDivElement>(null)
  const text2Ref = useRef<HTMLDivElement>(null)
  const uiPanelRef = useRef<HTMLDivElement>(null)
  const keeperSymbolRef = useRef<HTMLDivElement>(null)
  
  // Layer refs для панорамы
  const layerRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const img1WrapperRef = useRef<HTMLDivElement>(null)
  const img2WrapperRef = useRef<HTMLDivElement>(null)
  const img3WrapperRef = useRef<HTMLDivElement>(null)
  const img4WrapperRef = useRef<HTMLDivElement>(null)
  const img5WrapperRef = useRef<HTMLDivElement>(null)
  
  const frameContainerRef = useRef<HTMLDivElement>(null)
  const frameWrapperRef = useRef<HTMLDivElement>(null)
  const frameCardRef = useRef<HTMLDivElement>(null)
  
  const gradient1Ref = useRef<HTMLDivElement>(null)
  const gradient2Ref = useRef<HTMLDivElement>(null)
  
  const worldSectionRef = useRef<HTMLDivElement>(null)
  const worldHeaderRef = useRef<HTMLDivElement>(null)
  const worldMapRef = useRef<HTMLDivElement>(null)
  const worldPanelRef = useRef<HTMLDivElement>(null)
  
  const cardsSectionRef = useRef<HTMLDivElement>(null)
  const splitCardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0)
  const [mobileCardIndex, setMobileCardIndex] = useState<number>(0)
  
  const [activeLocation, setActiveLocation] = useState<string | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  
  const [framePos, setFramePos] = useState({ x: 100, y: 290, width: 180, height: 225 })
  const [panoramaMoveValue, setPanoramaMoveValue] = useState('-40vh')

  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Состояния для загрузочного экрана
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('// initializing')
  const loadingContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsLowEnd((navigator.hardwareConcurrency || 8) <= 4)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

// Эффект загрузки - реальная загрузка ресурсов
useEffect(() => {
  let isMounted = true
  
  const startLoading = async () => {
    // Загружаем все ресурсы с реальным прогрессом
    await loadAllResources((progress) => {
      if (isMounted) {
        setLoadingProgress(progress)
        
        // Обновляем текст загрузки на основе прогресса
        const statusIndex = Math.floor((progress / 100) * (statusMessages.length - 1))
        setLoadingText(statusMessages[Math.min(statusIndex, statusMessages.length - 1)])
      }
    })
    
    if (isMounted) {
      setLoadingProgress(100)
      setLoadingText(statusMessages[statusMessages.length - 1])
      
      // Плавно скрываем загрузочный экран
      setTimeout(() => {
        if (loadingContainerRef.current) {
          gsap.to(loadingContainerRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              if (isMounted) {
                setIsLoading(false)
              }
            }
          })
        }
      }, 500)
    }
  }
  
  startLoading()
  
  return () => {
    isMounted = false
  }
}, [])
  useEffect(() => {
    const updatePositions = () => {
      if (thumbnailFrameRef.current && stickyRef.current) {
        if (isMobile) {
          setFramePos({
            x: 30,
            y: 80,
            width: 360,
            height: 450
          })
        } else {
          setFramePos({
            x: 320,
            y: 400,
            width: 700,
            height: 380
          })
        }
      }
    }
    
    updatePositions()
    window.addEventListener('resize', updatePositions)
    const timer = setTimeout(updatePositions, 100)
    
    return () => {
      window.removeEventListener('resize', updatePositions)
      clearTimeout(timer)
    }
  }, [isMobile])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.preload = 'metadata'
      videoRef.current.muted = true
      videoRef.current.playsInline = true
      videoRef.current.disablePictureInPicture = true
      videoRef.current.play().catch(e => console.log('Video autoplay failed:', e))
    }
  }, [])

  // Добавляем класс lenis на html
  useEffect(() => {
    document.documentElement.classList.add('lenis')
    return () => document.documentElement.classList.remove('lenis')
  }, [])

 // === LENIS + SCROLLTRIGGER SYNC ===
useEffect(() => {
  // Включаем Lenis ТОЛЬКО на десктопе
  if (typeof window === 'undefined' || isMobile) return

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time: number) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  return () => {
    lenis.destroy()
    gsap.ticker.remove((time: number) => lenis.raf(time * 1000))
  }
}, [isMobile])

  // Функция обновления прогресса панорамы - на мобильных скрываем лишние слои
  const updatePanoramaProgress = (progress: number) => {
    const moveDistance = isMobile ? 40 : 80
    const moveUp = -progress * moveDistance

    const parallaxSpeeds = isMobile 
      ? [0.35, 0.55, 0.75, 0.95, 1.15]
      : [0.3, 0.5, 0.7, 0.9, 1.1]

    layerRefs.forEach((ref, index) => {
      if (ref.current) {
        gsap.set(ref.current, {
          y: moveUp * parallaxSpeeds[index],
          force3D: true,
          overwrite: true
        })
      }
    })

    if (videoRef.current && layerRefs[0].current) {
      gsap.set(videoRef.current, {
        y: moveUp * parallaxSpeeds[0],
        force3D: true,
        overwrite: true
      })
    }
    
    // НА МОБИЛЬНЫХ СКРЫВАЕМ СЛОИ 2-5
    if (isMobile) {
      if (img2WrapperRef.current) {
        gsap.set(img2WrapperRef.current, { opacity: 0, display: 'none' })
      }
      if (img3WrapperRef.current) {
        gsap.set(img3WrapperRef.current, { opacity: 0, display: 'none' })
      }
      if (img4WrapperRef.current) {
        gsap.set(img4WrapperRef.current, { opacity: 0, display: 'none' })
      }
      if (img5WrapperRef.current) {
        gsap.set(img5WrapperRef.current, { opacity: 0, display: 'none' })
      }
      return // Выходим, остальная логика не нужна на мобильных
    }
    
    // ДЕСКТОПНАЯ ЛОГИКА
    const mobileScale = isLowEnd ? 1.15 : 1.30
    const desktopScale = 1.1
    
    if (img2WrapperRef.current) {
      let scale2 = isMobile ? mobileScale : desktopScale
      if (progress > 0.08 && progress < 0.22) {
        const localProgress = (progress - 0.08) / 0.14
        scale2 = (isMobile ? mobileScale : desktopScale) - (localProgress * (isMobile ? 0.3 : 0.1))
      } else if (progress >= 0.22) {
        scale2 = 1.0
      }
      gsap.set(img2WrapperRef.current, { 
        scale: scale2,
        force3D: true,
        overwrite: true
      })
    }
    
    if (img3WrapperRef.current) {
      let scale3 = isMobile ? mobileScale : desktopScale
      if (progress > 0.16 && progress < 0.30) {
        const localProgress = (progress - 0.16) / 0.14
        scale3 = (isMobile ? mobileScale : desktopScale) - (localProgress * (isMobile ? 0.3 : 0.1))
      } else if (progress >= 0.30) {
        scale3 = 1.0
      }
      gsap.set(img3WrapperRef.current, { 
        scale: scale3,
        force3D: true,
        overwrite: true
      })
    }
    
    if (img4WrapperRef.current) {
      let scale4 = isMobile ? mobileScale : desktopScale
      if (progress > 0.24 && progress < 0.38) {
        const localProgress = (progress - 0.24) / 0.14
        scale4 = (isMobile ? mobileScale : desktopScale) - (localProgress * (isMobile ? 0.3 : 0.1))
      } else if (progress >= 0.38) {
        scale4 = 1.0
      }
      gsap.set(img4WrapperRef.current, { 
        scale: scale4,
        force3D: true,
        overwrite: true
      })
    }
    
    if (img5WrapperRef.current) {
      let scale5 = isMobile ? mobileScale : desktopScale
      if (progress > 0.32 && progress < 0.52) {
        const localProgress = (progress - 0.32) / 0.20
        scale5 = (isMobile ? mobileScale : desktopScale) - (localProgress * (isMobile ? 0.3 : 0.1))
      } else if (progress >= 0.52) {
        scale5 = 1.0
      }
      gsap.set(img5WrapperRef.current, { 
        scale: scale5,
        force3D: true,
        overwrite: true
      })
    }
    
    if (progress < 0.16) {
      gsap.set(text1Ref.current, { opacity: 1, force3D: true })
      if (!isMobile) gsap.set(uiPanelRef.current, { opacity: 1 })
      gsap.set(text2Ref.current, { opacity: 0 })
    } else if (progress < 0.32) {
      gsap.set(text1Ref.current, { opacity: 0 })
      gsap.set(uiPanelRef.current, { opacity: 0 })
      gsap.set(text2Ref.current, { opacity: 1, force3D: true })
    } else {
      gsap.set(text1Ref.current, { opacity: 0 })
      gsap.set(uiPanelRef.current, { opacity: 0 })
      gsap.set(text2Ref.current, { opacity: 0 })
    }
  }

  const nextMobileCard = () => {
    setMobileCardIndex((prev) => (prev + 1) % cardColors.length)
    setActiveCardIndex(mobileCardIndex + 1)
  }

  const prevMobileCard = () => {
    setMobileCardIndex((prev) => (prev - 1 + cardColors.length) % cardColors.length)
    setActiveCardIndex(mobileCardIndex - 1)
  }

  // ОСНОВНОЙ GSAP useEffect с masterTl
// ОСНОВНОЙ GSAP useEffect с masterTl
useEffect(() => {
  const ctx = gsap.context(() => {
    if (!containerRef.current || !heroImageRef.current || !flipCardWrapperRef.current) return

    const startDelay = isMobile ? 0.1 : 0.05

    gsap.set(headingRef.current, { opacity: 0, y: 60 })
    gsap.set(leftContentRef.current, { opacity: 0, y: 40 })
    gsap.set(flipCardContainerRef.current, { opacity: 0, scale: 0.8 })
    gsap.set(trailerCardRef.current, { opacity: 0, x: 100 })
    gsap.set(panoramaRef.current, { opacity: 0, visibility: 'hidden' })
    gsap.set(maskContainerRef.current, { opacity: 1 })
    gsap.set(heroImageRef.current, { opacity: 1 }) 
    
    if (isMobile) {
      gsap.set(maskContainerRef.current, { display: 'none' })
    }
    
    gsap.set(text1Ref.current, { opacity: 0, y: 80 })
    gsap.set(text2Ref.current, { opacity: 0, y: 80 })
    gsap.set(uiPanelRef.current, { opacity: 0, x: 50 })
    gsap.set(keeperSymbolRef.current, { opacity: 0, scale: 0.3 })
    gsap.set(frameContainerRef.current, { opacity: 0 })
    gsap.set(frameWrapperRef.current, { opacity: 0, scale: 0.8 })
    gsap.set(worldSectionRef.current, { opacity: 0 })
    gsap.set(worldHeaderRef.current, { opacity: 0, y: 40 })
    gsap.set(worldMapRef.current, { opacity: 0, scale: 0.95 })
    gsap.set(worldPanelRef.current, { opacity: 0, x: 50 })
    gsap.set(cardsSectionRef.current, { opacity: 0, pointerEvents: 'none' })
    gsap.set(gradient1Ref.current, { opacity: 0 })
    gsap.set(gradient2Ref.current, { opacity: 0 })
    
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobile ? 1.6 : 2.0,
        pin: stickyRef.current,
        anticipatePin: 1,
        fastScrollEnd: true,
        preventOverlaps: true,
        invalidateOnRefresh: true,
      }
    });
  
    masterTl.to(heroTextRef.current, { opacity: 0, scale: 0.95, duration: 0.02 }, 0 + startDelay)
    masterTl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.02 }, 0.01 + startDelay)
    masterTl.to(leftContentRef.current, { opacity: 1, y: 0, duration: 0.02 }, 0.02 + startDelay)
    
    // ВСЕ ЭЛЕМЕНТЫ ПОЯВЛЯЮТСЯ ОДНОВРЕМЕННО на 0.02 + startDelay
    masterTl.to(trailerCardRef.current, { opacity: 1, x: 0, duration: 0.02 }, 0.02 + startDelay)
    masterTl.to(flipCardContainerRef.current, { opacity: 1, scale: 1, duration: 0.02 }, 0.02 + startDelay)
    masterTl.to(overlayFrameRef.current, { opacity: 1, duration: 0.02 }, 0.02 + startDelay)
    masterTl.to(textOverlayFrameRef.current, { opacity: 1, duration: 0.02 }, 0.02 + startDelay)

    // Анимация сжатия hero ТОЛЬКО ДЛЯ ДЕСКТОПА
    if (!isMobile) {
      masterTl.to(heroImageRef.current, {
        width: framePos.width,
        height: framePos.height,
        left: framePos.x,
        top: framePos.y,
        borderRadius: 12,
        duration: 0.04,
        ease: 'power2.inOut'
      }, 0.01 + startDelay)
    }
    // НА МОБИЛЬНЫХ hero ОСТАЕТСЯ НА МЕСТЕ
    
    // НА МОБИЛЬНЫХ НЕ СКРЫВАЕМ trailerCardRef
    if (!isMobile) {
      masterTl.to([heroImageRef.current, headingRef.current, leftContentRef.current, trailerCardRef.current], {
        opacity: 0,
        duration: 0.02
      }, 0.08 + startDelay)
    } else {
      // На мобильных скрываем только heroImageRef, headingRef, leftContentRef
      masterTl.to([heroImageRef.current, headingRef.current, leftContentRef.current], {
        opacity: 0,
        duration: 0.15
      }, 0.08 + startDelay)
      // trailerCardRef остается видимым
    }

    if (isMobile) {
      gsap.set(panoramaRef.current, { opacity: 0, visibility: 'hidden' })
      gsap.set(flipCardWrapperRef.current, { width: 140, height: 200 })
      
      masterTl.to([overlayFrameRef.current, textOverlayFrameRef.current, trailerCardRef.current], {
        opacity: 0,
        duration: 0.01,
        ease: 'none'
      }, 0.07 + startDelay)

      masterTl.to(flipCardWrapperRef.current, {
        scale: 2.5,
        duration: 0.18,
        ease: 'power2.inOut'
      }, 0.09 + startDelay)

      masterTl.to(flipCardRef.current, { 
        rotateY: 180, 
        duration: 0.22,
        ease: 'power2.inOut'
      }, 0.13 + startDelay)
      
      masterTl.to(panoramaRef.current, { 
        opacity: 1, 
        visibility: 'visible',
        duration: 0.03,
        onComplete: () => {
          requestAnimationFrame(() => {
            updatePanoramaProgress(0)
          })
        }
      }, 0.22 + startDelay)
      
      masterTl.set(contentLayerRef.current, { opacity: 0 }, 0.14 + startDelay)

      masterTl.to(flipCardWrapperRef.current, { 
        opacity: 0,
        duration: 0.04,
        ease: 'power2.out'
      }, 0.26 + startDelay)
      
      masterTl.to(flipCardContainerRef.current, { 
        opacity: 0, 
        duration: 0.02 
      }, 0.28 + startDelay)
    } else {
      // ДЕСКТОП - без изменений
      gsap.set(panoramaRef.current, { opacity: 0, visibility: 'hidden' })
      gsap.set(flipCardWrapperRef.current, { width: 220, height: 320 })
      
      masterTl.to([overlayFrameRef.current, textOverlayFrameRef.current], {
        opacity: 0,
        duration: 0.01,
        ease: 'none'
      }, 0.07 + startDelay)

      masterTl.to(flipCardWrapperRef.current, {
        scale: 2.5,
        duration: 0.04,
        ease: 'power2.inOut'
      }, 0.09 + startDelay)

      masterTl.to(flipCardRef.current, { 
        rotateY: 180, 
        duration: 0.05,
        ease: 'power2.inOut'
      }, 0.13 + startDelay)
      
      masterTl.to(panoramaRef.current, { 
        opacity: 1, 
        visibility: 'visible',
        duration: 0.02
      }, 0.161 + startDelay)
      
      masterTl.set(contentLayerRef.current, { opacity: 0 }, 0.14 + startDelay)

      masterTl.to(flipCardWrapperRef.current, { 
        opacity: 0,
        duration: 0.03,
        ease: 'power2.out'
      }, 0.18 + startDelay)
      
      masterTl.to(flipCardContainerRef.current, { 
        opacity: 0, 
        duration: 0.01 
      }, 0.18 + startDelay)
    }
    
    // ВСЁ ОСТАЛЬНОЕ БЕЗ ИЗМЕНЕНИЙ
    masterTl.to(text1Ref.current, { opacity: 1, y: 0, duration: 0.02 }, 0.20 + startDelay)
    
    if (!isMobile) {
      masterTl.to(uiPanelRef.current, { opacity: 1, x: 0, duration: 0.02 }, 0.21 + startDelay)
    }

    masterTl.to(panoramaInnerRef.current, { 
  y: panoramaMoveValue, 
  duration: isMobile ? 0.15 : 0.3,  // для десктопа 0.4, для мобильных 0.25
  ease: 'none' 
}, isMobile ? 0.35 + startDelay : 0.22 + startDelay)  // для мобильных старт позже

 masterTl.eventCallback('onUpdate', () => {
  const totalProgress = masterTl.progress()
  const startPanProgress = isMobile ? 0.35 : 0.22  // для мобильных старт позже
  const endPanProgress = isMobile ? 0.71 : 0.58    // для мобильных конец позже
  
  if (totalProgress >= (startPanProgress + startDelay) && totalProgress <= (endPanProgress + startDelay)) {
    const divider = endPanProgress - startPanProgress
    const panoramaProgress = (totalProgress - (startPanProgress + startDelay)) / divider
    updatePanoramaProgress(panoramaProgress)
  }
})

    masterTl.to({}, { duration: 0.02 }, 0.62 + startDelay)
    masterTl.to(keeperSymbolRef.current, { opacity: 1, scale: 1, duration: 0.12, ease: 'back.out(0.8)', clearProps: 'all' }, 0.58 + startDelay)
    masterTl.to(keeperSymbolRef.current, { opacity: 1, duration: 0.02 }, 0.60 + startDelay)
    
    const clipInset = isMobile ? 'calc(50% - 100px)' : 'calc(50% - 260px)'
    
    masterTl.fromTo(panoramaRef.current, {
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
    }, {
      clipPath: `inset(${clipInset} ${clipInset} ${clipInset} ${clipInset} round ${isMobile ? '8px' : '16px'})`,
      rotateY: isMobile ? -15 : -35,
      rotateX: isMobile ? 3 : 8,
      rotateZ: isMobile ? -2 : -4,
       duration: isMobile ? 0.04 : 0.04,  // для мобильных увеличил с 0.04 до 0.12
      ease: 'power2.inOut'
    }, 0.63 + startDelay)
    
    masterTl.to(panoramaRef.current, { rotateY: -90, duration: 0.02, ease: 'power2.in' }, 0.65 + startDelay)
    masterTl.to(panoramaRef.current, { opacity: 0, duration: 0.01 }, 0.67 + startDelay)

    masterTl.to(frameContainerRef.current, { opacity: 1, duration: 0.02 }, 0.68 + startDelay)
    masterTl.to(frameWrapperRef.current, { opacity: 1, scale: 1, duration: 0.02, ease: 'power2.out' }, 0.68 + startDelay)
    masterTl.to(worldSectionRef.current, { opacity: 1, duration: 0.02 }, 0.70 + startDelay)
    masterTl.to(worldHeaderRef.current, { opacity: 1, y: 0, duration: 0.03, ease: 'power2.out' }, 0.71 + startDelay)
    masterTl.to(worldMapRef.current, { opacity: 1, scale: 1, duration: 0.04, ease: 'back.out(0.8)' }, 0.73 + startDelay)
    masterTl.to(worldPanelRef.current, { opacity: 1, x: 0, duration: 0.04, ease: 'power2.out' }, 0.74 + startDelay)

    masterTl.to(gradient1Ref.current, { opacity: 1, duration: 0.08, ease: 'power2.out' }, 0.76 + startDelay)
    masterTl.to(gradient2Ref.current, { opacity: 1, duration: 0.05, ease: 'power2.out' }, 0.83 + startDelay)
    masterTl.to(worldSectionRef.current, { opacity: 0, duration: 0.03 }, 0.86 + startDelay)
    masterTl.to(frameContainerRef.current, { opacity: 0, duration: 0.03 }, 0.86 + startDelay)
    masterTl.set(cardsSectionRef.current, { opacity: 1, pointerEvents: 'auto' }, 0.89 + startDelay)
    masterTl.to([gradient1Ref.current, gradient2Ref.current], { opacity: 0, duration: 0.04 }, 0.90 + startDelay)

    if (!isMobile) {
      const cardRanges = [
        { start: 1.03, end: 1.105 },
        { start: 1.105, end: 1.18 },
        { start: 1.18, end: 1.255 },
        { start: 1.255, end: 1.33 }
      ]
      
      cardRanges.forEach((range, i) => {
        masterTl.call(() => {
          if (hoveredCard === null) {
            setActiveCardIndex(i)
          }
        }, [], range.start + startDelay)
      })
      
      masterTl.call(() => {
        if (hoveredCard === null) {
          setActiveCardIndex(0)
        }
      }, [], 1.02 + startDelay)
    }

  }, containerRef)

  return () => ctx.revert()
}, [framePos, hoveredCard, isMobile, panoramaMoveValue])

  useEffect(() => {
    const adjustOverlap = () => {
      if (img1WrapperRef.current && img2WrapperRef.current) {
        const img1Height = img1WrapperRef.current.offsetHeight
        const firstOverlapPercent = isMobile ? 0.6418 : 0.6
        const firstOverlap = img1Height * firstOverlapPercent
        
        if (img2WrapperRef.current) {
          img2WrapperRef.current.style.marginTop = `-${firstOverlap}px`
          if (isMobile) {
            img2WrapperRef.current.style.willChange = 'transform'
          }
        }
        
        if (isMobile) {
          const overlap3 = 280
          const overlap4 = 500
          const overlap5 = 400
          
          if (img3WrapperRef.current) {
            img3WrapperRef.current.style.marginTop = `-${overlap3}px`
            img3WrapperRef.current.style.willChange = 'transform'
          }
          if (img4WrapperRef.current) {
            img4WrapperRef.current.style.marginTop = `-${overlap4}px`
            img4WrapperRef.current.style.willChange = 'transform'
          }
          if (img5WrapperRef.current) {
            img5WrapperRef.current.style.marginTop = `-${overlap5}px`
            img5WrapperRef.current.style.willChange = 'transform'
          }
        } else {
          const standardOverlap = window.innerHeight * 0.45
          if (img3WrapperRef.current) img3WrapperRef.current.style.marginTop = `-${standardOverlap}px`
          if (img4WrapperRef.current) img4WrapperRef.current.style.marginTop = `-${standardOverlap}px`
          if (img5WrapperRef.current) img5WrapperRef.current.style.marginTop = `-${standardOverlap}px`
        }
      }
    }
    
    const img1 = img1WrapperRef.current?.querySelector('img')
    if (img1) {
      if (img1.complete) {
        adjustOverlap()
      } else {
        img1.addEventListener('load', adjustOverlap)
      }
    }
    
    window.addEventListener('resize', adjustOverlap)
    return () => {
      window.removeEventListener('resize', adjustOverlap)
    }
  }, [isMobile])

  useEffect(() => {
    if (!panoramaInnerRef.current || !img1WrapperRef.current) return

const calculateOptimalMove = () => {
  const wrappers = [img1WrapperRef, img2WrapperRef, img3WrapperRef, img4WrapperRef, img5WrapperRef]
  let totalHeight = 0
  let totalOverlap = 0
  
  wrappers.forEach((wrapper, idx) => {
    if (wrapper.current) {
      const height = wrapper.current.offsetHeight
      totalHeight += height
      
      if (idx > 0) {
        const computedStyle = getComputedStyle(wrapper.current)
        const marginTop = parseFloat(computedStyle.marginTop)
        if (!isNaN(marginTop) && marginTop < 0) {
          totalOverlap += Math.abs(marginTop)
        }
      }
    }
  })
  
  const actualHeight = totalHeight - totalOverlap
  const viewportHeight = window.innerHeight
  
  let neededScroll = actualHeight - viewportHeight
  // Для мобильных увеличиваем минимальный скролл
  const minScroll = isMobile ? viewportHeight * 0.8 : viewportHeight * 0.3
  neededScroll = Math.max(neededScroll, minScroll)
  
  let moveInVh = (neededScroll / viewportHeight) * 100
  // Для мобильных увеличиваем максимальное значение
  const maxMove = isMobile ? 800 : 500
  moveInVh = Math.min(Math.max(moveInVh, 30), maxMove)
  
  setPanoramaMoveValue(`-${Math.round(moveInVh)}vh`)
}
    
    const timer = setTimeout(calculateOptimalMove, 500)
    
    window.addEventListener('resize', () => {
      setTimeout(calculateOptimalMove, 200)
    })
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateOptimalMove)
    }
  }, [isMobile])

  // MOUSE PARALLAX + TILT (только для десктопа)
  useEffect(() => {
    if (isMobile || isLowEnd) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;

      const strength = 24;

      const wrappers = [img2WrapperRef, img3WrapperRef, img4WrapperRef, img5WrapperRef];

      wrappers.forEach((ref, index) => {
        if (!ref.current) return;

        const layerIndex = index + 1;

        const xMult = 0.45 + layerIndex * 0.18;
        const yMult = 0.45 + layerIndex * 0.14;

        gsap.to(ref.current, {
          x: x * strength * xMult,
          y: y * strength * yMult * 0.45,
          duration: 1.35,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isLowEnd]);

  useEffect(() => {
    if (overlayFrameRef.current) {
      overlayFrameRef.current.style.width = `${framePos.width}px`
      overlayFrameRef.current.style.height = `${framePos.height}px`
      overlayFrameRef.current.style.left = `${framePos.x}px`
      overlayFrameRef.current.style.top = `${framePos.y}px`
    }
  }, [framePos])

  useEffect(() => {
    const updateOverlayPositions = () => {
      if (overlayFrameRef.current) {
        overlayFrameRef.current.style.width = `${framePos.width}px`
        overlayFrameRef.current.style.height = `${framePos.height}px`
        overlayFrameRef.current.style.left = `${framePos.x}px`
        overlayFrameRef.current.style.top = `${framePos.y}px`
      }
      
      if (textOverlayFrameRef.current) {
        if (isMobile) {
          textOverlayFrameRef.current.style.left = `90px`
          textOverlayFrameRef.current.style.top = `90px`
        } else {
          textOverlayFrameRef.current.style.left = `${framePos.x + framePos.width - 640}px`
          textOverlayFrameRef.current.style.top = `${framePos.y + (framePos.height / 2) - 80}px`
        }
      }
    }
    
    updateOverlayPositions()
    window.addEventListener('resize', updateOverlayPositions)
    
    return () => window.removeEventListener('resize', updateOverlayPositions)
  }, [framePos, isMobile])
  
  const activeLocationData = activeLocation 
    ? worldLocations.find(l => l.id === activeLocation)
    : null

  const cardColors = [
    { glow: '#00d4ff', glowRgb: '0, 212, 255', x: isMobile ? 0 : -480, title: 'The Nexus Walker', id: 'NW-001', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { glow: '#9945ff', glowRgb: '153, 69, 255', x: isMobile ? 0 : -160, title: 'Crystal Guardian', id: 'CG-002', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    { glow: '#14f195', glowRgb: '20, 241, 149', x: isMobile ? 0 : 160, title: 'Flame Keeper', id: 'FK-003', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
    { glow: '#ff6b35', glowRgb: '255, 107, 53', x: isMobile ? 0 : 480, title: 'Shadow Weaver', id: 'SW-004', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' }
  ]

  const cardWidth = isMobile ? 260 : 280
  const cardHeight = isMobile ? 480 : 520
  
  // Автопрокрутка карусели на мобильных
  useEffect(() => {
    if (!isMobile) return;
    
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
    
    if (isAutoPlaying) {
      autoPlayIntervalRef.current = setInterval(() => {
        setMobileCardIndex((prev) => (prev + 1) % cardColors.length);
      }, 5000);
    }
    
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isMobile, isAutoPlaying, cardColors.length]);

  return (
    <>
      {/* ЗАГРУЗОЧНЫЙ ЭКРАН */}
      {isLoading && (
        <div
          ref={loadingContainerRef}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden"
        >
          <video
            src="/video/loading.webm"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative z-10 flex flex-col items-center gap-10">
            <div className="font-mono text-sm md:text-base text-white/80 text-center min-h-[1.5em] tracking-wide">
              {loadingText}
            </div>
            
            <div className="w-72 flex flex-col gap-3">
              <div className="flex justify-between text-xs font-mono uppercase tracking-[2px] text-white/70">
                <span>LOADING</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <div className="h-px bg-white/20 relative overflow-hidden rounded">
                <div
                  className="h-full bg-white transition-all duration-75 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
            
            <div className="flex gap-[2px] h-9 items-end">
              {barcodeWidths.map((width, i) => (
                <div
                  key={i}
                  className="bg-white transition-all duration-150"
                  style={{
                    width: `${width}px`,
                    height: '100%',
                    opacity: loadingProgress > i * 3.2 ? 1 : 0.25,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} className="relative bg-[#050508]" style={{ height: isMobile ? '350vh' : '800vh' }}>
        <div 
          ref={stickyRef} 
          className="h-screen w-full overflow-hidden"
          style={{ perspective: '800px', perspectiveOrigin: '50% 50%' }}
        >
          
          <div ref={gradient1Ref} className="absolute inset-0 z-[30] pointer-events-none opacity-0" style={{ background: 'rgb(88, 28, 135)' }} />
          <div ref={gradient2Ref} className="absolute inset-0 z-[31] pointer-events-none opacity-0" style={{ background: 'rgb(5, 5, 8)' }} />

          <div ref={frameContainerRef} className="absolute inset-0 z-[35] pointer-events-none flex items-center justify-center opacity-0" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
            <div ref={frameWrapperRef} className="relative will-change-transform origin-center opacity-0" style={{ width: 'min(90vw, 1400px)', height: 'min(85vh, 800px)', transformStyle: 'preserve-3d' }}>
              <div ref={frameCardRef} className="relative w-full h-full will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ backfaceVisibility: 'hidden', background: 'rgba(5, 5, 8, 0.7)', backdropFilter: 'blur(2px)', border: '2px solid rgba(0, 212, 255, 0.4)', boxShadow: '0 0 60px rgba(0, 212, 255, 0.25), inset 0 0 40px rgba(0, 212, 255, 0.08)' }}>
                  <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#00d4ff]" />
                  <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#00d4ff]" />
                  <div className="absolute inset-2 rounded-2xl border border-[#00d4ff]/20" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/5 via-transparent to-[#ff6b35]/5" />
                </div>
                <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'rgba(5, 5, 8, 0.7)', backdropFilter: 'blur(2px)', border: '2px solid rgba(0, 212, 255, 0.4)', boxShadow: '0 0 60px rgba(0, 212, 255, 0.25)' }}>
                  <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#00d4ff]" />
                  <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#00d4ff]" />
                  <div className="absolute inset-2 rounded-2xl border border-[#00d4ff]/20" />
                </div>
              </div>
            </div>
          </div>

          {/* WORLD SECTION */}
          <div ref={worldSectionRef} className="absolute inset-0 z-[36] flex items-center justify-center pointer-events-auto opacity-0" style={{ padding: '2rem' }}>
            <div className="w-full max-w-[1300px] h-full">
              <div className="py-8 px-6">
                <div ref={worldHeaderRef} className="text-center mb-12 opacity-0 translate-y-10">
                  <div className="flex items-center gap-4 mb-6 justify-center">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
                    <span className="font-mono text-xs text-[#00d4ff] tracking-[0.3em]">SECTION 003</span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold">
                    <span className="text-[#e8e8ec]">The </span>
                    <span className="text-[#00d4ff]">World</span>
                  </h2>
                  <p className="text-center text-[#6b6b7b] text-sm mt-4 max-w-md mx-auto">
                    Explore the territories under the Protocol&apos;s protection
                  </p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                  <div 
                    ref={worldMapRef}
                    className="relative flex-1 bg-[#0a0a0f]/80 border border-[#1a1a24] overflow-hidden min-h-[450px] rounded-xl opacity-0 scale-95"
                  >
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {[...Array(10)].map((_, i) => (
                        <g key={i}>
                          <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#1a1a24" strokeWidth="0.2" />
                          <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#1a1a24" strokeWidth="0.2" />
                        </g>
                      ))}
                      {worldLocations.map((loc, i) => {
                        const nextLoc = worldLocations[(i + 1) % worldLocations.length]
                        return (
                          <line
                            key={`line-${i}`}
                            x1={loc.coordinates.x}
                            y1={loc.coordinates.y}
                            x2={nextLoc.coordinates.x}
                            y2={nextLoc.coordinates.y}
                            stroke="#00d4ff"
                            strokeWidth="0.3"
                            strokeOpacity="0.3"
                            strokeDasharray="2 2"
                          />
                        )
                      })}
                    </svg>

                    {worldLocations.map((location) => (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        style={{
                          left: `${location.coordinates.x}%`,
                          top: `${location.coordinates.y}%`
                        }}
                        onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                        onMouseEnter={() => setHoveredLocation(location.id)}
                        onMouseLeave={() => setHoveredLocation(null)}
                      >
                        <div 
                          className="absolute inset-0 rounded-full animate-ping opacity-30"
                          style={{ backgroundColor: getStatusColor(location.status), animationDuration: '2s' }}
                        />
                        <div 
                          className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                            activeLocation === location.id ? 'scale-150' : 'group-hover:scale-125'
                          }`}
                          style={{ 
                            borderColor: getStatusColor(location.status),
                            backgroundColor: activeLocation === location.id ? getStatusColor(location.status) : 'transparent'
                          }}
                        />
                        {(hoveredLocation === location.id && activeLocation !== location.id) && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-[#0a0a0f] border border-[#1a1a24] whitespace-nowrap z-10 rounded">
                            <div className="text-xs font-medium text-[#e8e8ec]">{location.name}</div>
                            <div className="text-xs font-mono" style={{ color: getStatusColor(location.status) }}>{location.status}</div>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00d4ff]/50" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00d4ff]/50" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00d4ff]/50" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00d4ff]/50" />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#050508]/80 rounded-full">
                      <span className="font-mono text-xs text-[#00d4ff]">PROTOCOL NETWORK MAP v2.4</span>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-[#6b6b7b]">
                      {hoveredLocation ? (
                        <span>X: {worldLocations.find(l => l.id === hoveredLocation)?.coordinates.x} | Y: {worldLocations.find(l => l.id === hoveredLocation)?.coordinates.y}</span>
                      ) : (
                        <span>HOVER TO VIEW COORDINATES</span>
                      )}
                    </div>
                  </div>

                  {/* Панель с описанием планет */}
                  <div ref={worldPanelRef} className="lg:w-80 space-y-4 opacity-0 translate-x-12">
                    <a 
                      href="/galaxy-map-demo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <button className="w-full py-2.5 bg-gradient-to-r from-[#00d4ff]/10 to-[#ff006e]/10 border border-[#00d4ff] rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:from-[#00d4ff]/20 hover:to-[#ff006e]/20 transition-all duration-300 group">
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-3.5 h-3.5 text-[#00d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="flex items-center">
                            <TextScramble 
                              text="EXPLORE MAP" 
                              className="text-xs font-mono font-bold tracking-wider text-[#00d4ff] leading-none" 
                            />
                          </span>
                          <svg className="w-3.5 h-3.5 text-[#00d4ff] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </button>
                    </a>

                    {activeLocationData ? (
                      <div className="p-6 bg-[#0a0a0f]/80 border border-[#1a1a24] rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-2 py-1 text-xs font-mono rounded" style={{ backgroundColor: `${getStatusColor(activeLocationData.status)}20`, color: getStatusColor(activeLocationData.status) }}>{activeLocationData.type}</span>
                          <span className="text-xs font-mono" style={{ color: getStatusColor(activeLocationData.status) }}>{activeLocationData.status}</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#e8e8ec] mb-2">{activeLocationData.name}</h3>
                        <p className="text-sm text-[#6b6b7b] mb-4">{activeLocationData.description}</p>
                        <div className="pt-4 border-t border-[#1a1a24]">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-[#6b6b7b]">COORDINATES</span>
                            <span className="text-[#00d4ff]">{activeLocationData.coordinates.x}, {activeLocationData.coordinates.y}</span>
                          </div>
                        </div>
                        <button className="w-full mt-4 py-2 border border-[#2a2a38] hover:border-[#00d4ff] text-sm font-medium text-[#e8e8ec] transition-colors duration-300 rounded">
                          View Full Details
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 bg-[#0a0a0f]/80 border border-[#1a1a24] text-center rounded-xl">
                        <div className="text-[#6b6b7b] text-sm mb-2">Select a location on the map</div>
                        <div className="font-mono text-xs text-[#00d4ff]">{worldLocations.length} LOCATIONS AVAILABLE</div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {worldLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                          className={`w-full flex items-center justify-between p-3 border transition-all duration-300 rounded ${
                            activeLocation === location.id ? 'bg-[#0a0a0f] border-[#00d4ff]' : 'bg-transparent border-[#1a1a24] hover:border-[#2a2a38]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(location.status) }} />
                            <span className="text-xs text-[#e8e8ec]">{location.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#6b6b7b]">{location.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARDS SECTION */}
          <div ref={cardsSectionRef} className="absolute inset-0 z-[100] bg-[#050508] opacity-0 pointer-events-none">
            <div className="w-full h-full flex flex-col items-center justify-center px-4">
              
              {isMobile ? (
                <>
                  <div className="text-center mb-6">
                    <span className="font-mono text-[10px] text-[#00d4ff] tracking-wider">CHARACTERS</span>
                    <h3 className="text-lg font-bold text-[#e8e8ec] mt-1">Choose Your Path</h3>
                  </div>
                  
                  <div 
                    className="relative"
                    onTouchStart={() => {
                      setIsAutoPlaying(false);
                      setTimeout(() => setIsAutoPlaying(true), 10000);
                    }}
                  >
                    <div
                      className="rounded-2xl overflow-hidden transition-all duration-500"
                      style={{
                        width: cardWidth,
                        height: cardHeight,
                        border: `2px solid ${cardColors[mobileCardIndex].glow}`,
                        boxShadow: `0 0 30px ${cardColors[mobileCardIndex].glow}`,
                      }}
                    >
                      <video
                        src={cardColors[mobileCardIndex].video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                      
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{ background: `radial-gradient(circle at center, ${cardColors[mobileCardIndex].glow}40 0%, transparent 80%)` }}
                      />
                      
                      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: cardColors[mobileCardIndex].glow }} />
                      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: cardColors[mobileCardIndex].glow }} />
                      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: cardColors[mobileCardIndex].glow }} />
                      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: cardColors[mobileCardIndex].glow }} />
                      
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-mono text-[#ff6b35]">ID:</span>
                          <span className="text-[9px] font-mono" style={{ color: cardColors[mobileCardIndex].glow }}>{cardColors[mobileCardIndex].id}</span>
                        </div>
                        <div className="text-base font-bold text-[#e8e8ec] tracking-wide">{cardColors[mobileCardIndex].title}</div>
                        <div className="w-8 h-px bg-gradient-to-r from-[#00d4ff] to-transparent mt-2" />
                      </div>
                    </div>
                    
                    {!isAutoPlaying && (
                      <div className="absolute top-3 right-12 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full font-mono">
                        PAUSED
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        prevMobileCard();
                        setIsAutoPlaying(false);
                        setTimeout(() => setIsAutoPlaying(true), 10000);
                      }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 w-8 h-8 bg-[#0a0a0f] border border-[#1a1a24] rounded-full flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#00d4ff]" />
                    </button>
                    
                    <button
                      onClick={() => {
                        nextMobileCard();
                        setIsAutoPlaying(false);
                        setTimeout(() => setIsAutoPlaying(true), 10000);
                      }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 w-8 h-8 bg-[#0a0a0f] border border-[#1a1a24] rounded-full flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4 text-[#00d4ff]" />
                    </button>
                    
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                      {cardColors.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setMobileCardIndex(idx);
                            setIsAutoPlaying(false);
                            setTimeout(() => setIsAutoPlaying(true), 10000);
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === mobileCardIndex ? 'w-4 bg-[#00d4ff]' : 'bg-[#2a2a3a]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    className="mt-12 relative px-6 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${cardColors[mobileCardIndex].glow}20, ${cardColors[mobileCardIndex].glow}05)`,
                      border: `1px solid ${cardColors[mobileCardIndex].glow}`,
                      color: cardColors[mobileCardIndex].glow,
                      boxShadow: `0 0 15px ${cardColors[mobileCardIndex].glow}60`,
                    }}
                  >
                    Explore
                  </button>
                </>
              ) : (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  {cardColors.map((cardColor, i) => {
                    const isActive = hoveredCard !== null ? hoveredCard === i : activeCardIndex === i
                    return (
                      <div
                        key={i}
                        ref={el => { splitCardsRef.current[i] = el }}
                        className="absolute cursor-pointer"
                        style={{
                          width: cardWidth,
                          height: cardHeight,
                          transform: `translateX(${cardColor.x}px) ${isActive ? 'scale(1.1)' : 'scale(1)'}`,
                          transition: 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                          zIndex: isActive ? 110 : 5,
                          willChange: 'transform'
                        }}
                        onMouseEnter={() => {
                          setHoveredCard(i)
                          setActiveCardIndex(i)
                        }}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div 
                          className="relative w-full h-full rounded-2xl overflow-hidden transition-all duration-500"
                          style={{
                            border: `2px solid ${isActive ? cardColor.glow : `rgba(${cardColor.glowRgb}, 0.2)`}`,
                            boxShadow: isActive 
                              ? `0 0 60px ${cardColor.glow}, 0 0 120px ${cardColor.glow}80, inset 0 0 40px ${cardColor.glow}40` 
                              : '0 10px 40px rgba(0, 0, 0, 0.4)',
                            transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
                          }}
                        >
                          {isActive ? (
                            <video
                              src={cardColor.video}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={`https://images.unsplash.com/photo-${i === 0 ? '1507003211169-0a1dd7228f2d' : i === 1 ? '1534528741775-53994a69daeb' : i === 2 ? '1531746020798-e6953c6e8e04' : '1534447677768-be436bb09401'}?w=560&h=1040&fit=crop`}
                              alt="Character Card"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                          
                          {isActive && (
                            <div 
                              className="absolute inset-0 opacity-30"
                              style={{ background: `radial-gradient(circle at center, ${cardColor.glow}40 0%, transparent 80%)` }}
                            />
                          )}
                          
                          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 transition-all duration-300" style={{ borderColor: isActive ? cardColor.glow : `rgba(${cardColor.glowRgb}, 0.5)` }} />
                          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 transition-all duration-300" style={{ borderColor: isActive ? cardColor.glow : `rgba(${cardColor.glowRgb}, 0.5)` }} />
                          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 transition-all duration-300" style={{ borderColor: isActive ? cardColor.glow : `rgba(${cardColor.glowRgb}, 0.5)` }} />
                          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 transition-all duration-300" style={{ borderColor: isActive ? cardColor.glow : `rgba(${cardColor.glowRgb}, 0.5)` }} />
                          
                          <div className="absolute bottom-5 left-5 right-5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-mono tracking-wider text-[#ff6b35]">ID:</span>
                              <span className="text-[9px] font-mono" style={{ color: cardColor.glow }}>{cardColor.id}</span>
                            </div>
                            <div className="text-sm font-bold text-[#e8e8ec] tracking-wide">{cardColor.title}</div>
                            <div className="w-8 h-px bg-gradient-to-r from-[#00d4ff] to-transparent mt-2" />
                          </div>
                        </div>
                        
                        <div 
                          className="absolute -bottom-12 left-1/2 transition-all duration-500"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: `translateX(-50%) translateY(${isActive ? '0' : '10px'})`,
                            transitionDelay: isActive ? '0.2s' : '0s'
                          }}
                        >
                          <button
                            className="group relative px-6 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${cardColor.glow}20, ${cardColor.glow}05)`,
                              border: `1px solid ${cardColor.glow}`,
                              color: cardColor.glow,
                              boxShadow: `0 0 15px ${cardColor.glow}60`,
                              backdropFilter: 'blur(4px)'
                            }}
                          >
                            <span className="relative z-10">Explore</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* PANORAMA */}
          <div ref={panoramaRef} className="absolute inset-0 z-10 overflow-hidden">
            <div ref={panoramaInnerRef} className="absolute top-0 left-0 w-full" style={{ height: 'auto' }}>
              <div 
                className="relative w-full"
                style={{ 
                  transform: 'scale(1.05) translateY(0px)', 
                  transformOrigin: 'center top',
                  position: 'relative'
                }}
              >
                <div 
                  ref={img1WrapperRef}
                  className="relative w-full will-change-transform"
                  style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 1 }}
                >
                  <img
                    src={isMobile ? panoramaImages.mobile[0] : panoramaImages.desktop[0]}
                    alt="Panorama 1"
                    className="w-full h-auto"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    style={{ display: 'block', width: '100%', height: 'auto' }}
                  />
                </div>
                <video
                  ref={videoRef}
                  src={isMobile ? panoramaVideos.mobile : panoramaVideos.desktop}
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  className="absolute top-0 left-0"
                  style={{ 
                    pointerEvents: 'none',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    width: '100%',
                    height: 'auto',
                    zIndex: 2,
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                  }}
                />
              </div>
              
              {/* Слой 2 - скрываем на мобильных */}
              <div 
                ref={img2WrapperRef}
                className="relative w-full will-change-transform"
                style={{ 
                  marginTop: isMobile ? '-4.55vh' : '-45vh',
                  transform: `scale(${isMobile ? (isLowEnd ? 1.15 : 1.30) : 1.1}) translateY(0px)`,
                  transformOrigin: 'center top',
                  display: isMobile ? 'none' : 'block',
                }}
              >
                <img
                  src={isMobile ? panoramaImages.mobile[1] : panoramaImages.desktop[1]}
                  alt="Panorama 2"
                  className="w-full"
                  style={{ height: isMobile ? 'auto' : '100vh' }}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
              
              {/* Слой 3 - скрываем на мобильных */}
              <div 
                ref={img3WrapperRef}
                className="relative w-full will-change-transform"
                style={{ 
                  marginTop: isMobile ? '-4.55vh' : '-45vh',
                  transform: `scale(${isMobile ? (isLowEnd ? 1.15 : 1.30) : 1.1}) translateY(0px)`,
                  transformOrigin: 'center top',
                  display: isMobile ? 'none' : 'block',
                }}
              >
                <img
                  src={isMobile ? panoramaImages.mobile[2] : panoramaImages.desktop[2]}
                  alt="Panorama 3"
                  className="w-full"
                  style={{ height: isMobile ? 'auto' : '100vh' }}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
              
              {/* Слой 4 - скрываем на мобильных */}
              <div 
                ref={img4WrapperRef}
                className="relative w-full will-change-transform"
                style={{ 
                  marginTop: isMobile ? '-4.55vh' : '-45vh',
                  transform: `scale(${isMobile ? (isLowEnd ? 1.15 : 1.30) : 1.1}) translateY(0px)`,
                  transformOrigin: 'center top',
                  display: isMobile ? 'none' : 'block',
                }}
              >
                <img
                  src={isMobile ? panoramaImages.mobile[3] : panoramaImages.desktop[3]}
                  alt="Panorama 4"
                  className="w-full"
                  style={{ height: isMobile ? 'auto' : '100vh' }}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
              
              {/* Слой 5 - скрываем на мобильных */}
              <div 
                ref={img5WrapperRef}
                className="relative w-full will-change-transform"
                style={{ 
                  marginTop: isMobile ? '-4.55vh' : '-45vh',
                  transform: `scale(${isMobile ? (isLowEnd ? 1.15 : 1.30) : 1.1}) translateY(0px)`,
                  transformOrigin: 'center top',
                  display: isMobile ? 'none' : 'block',
                }}
              >
                <img
                  src={isMobile ? panoramaImages.mobile[4] : panoramaImages.desktop[4]}
                  alt="Panorama 5"
                  className="w-full"
                  style={{ height: isMobile ? 'auto' : '100vh' }}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
            </div>

            <div
              ref={text1Ref}
              className={`absolute z-20 ${isMobile ? 'left-4 right-4 bottom-20 top-auto text-center' : 'left-8 md:left-16 top-1/2 -translate-y-1/2 max-w-2xl'}`}
            >
              <div className={`flex items-center gap-2 mb-2 ${isMobile ? 'justify-center' : ''}`}>
                <span className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full" />
                <span className="font-mono text-[10px] text-[#00d4ff] tracking-widest">002</span>
              </div>
              <h2 className={`font-bold text-white/90 leading-tight tracking-tight ${isMobile ? 'text-xs' : 'text-3xl md:text-5xl lg:text-6xl'}`}>
                YOU ARE A KEEPER: AN AGENT OF POWER AND CHANGE IN THIS WORLD.
              </h2>
            </div>

            <div
              ref={text2Ref}
              className={`absolute z-20 ${isMobile ? 'left-4 right-4 bottom-20 top-auto text-center' : 'right-8 md:right-16 top-1/2 -translate-y-1/2 max-w-2xl text-right'}`}
            >
              <div className={`flex items-center gap-2 mb-2 ${isMobile ? 'justify-center' : 'justify-end'}`}>
                <span className="font-mono text-[10px] text-[#00d4ff] tracking-widest">003</span>
                <span className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full" />
              </div>
              <h2 className={`font-bold text-white/90 leading-tight tracking-tight ${isMobile ? 'text-xs' : 'text-3xl md:text-5xl lg:text-6xl'}`}>
                WHAT WILL YOU DO WITH THIS POWER? WILL YOU CHOOSE TO PROTECT OR DESTROY?
              </h2>
            </div>

            <div ref={uiPanelRef} className="absolute top-1/2 -translate-y-1/2 right-8 md:right-16 z-20" style={{ opacity: isMobile ? 0 : 1 }}>
              <div className="bg-[#0a0a12]/60 backdrop-blur-sm border border-[#2a2a3a] rounded-lg p-4 font-mono text-xs">
                <div className="text-[#6b6b7b] mb-2">// INITIALIZING</div>
                <div className="text-[#00d4ff] mb-1">KEEPER_STORY</div>
                <div className="text-[#4a4a5a] mb-3">LOADING... [47%]</div>
                <div className="space-y-1 text-[#6b6b7b]">
                  <div>LOCATION_DATA</div>
                  <div>CHARACTER_ATTRIBUTES</div>
                  <div>KLNK_TRANSMISSIONS</div>
                </div>
              </div>
            </div>

            <div
              ref={keeperSymbolRef}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            >
              <svg width={isMobile ? "80" : "200"} height={isMobile ? "120" : "300"} viewBox="0 0 100 150" className="text-white opacity-80">
                <path d="M50 0 L50 45 M50 105 L50 150 M0 75 L45 75 M55 75 L100 75" stroke="currentColor" strokeWidth={isMobile ? 5 : 8} fill="none" />
                <rect x="35" y="60" width="30" height="30" fill="none" stroke="currentColor" strokeWidth={isMobile ? 5 : 8} />
              </svg>
            </div>
          </div>

          {/* CONTENT LAYER */}
          <div ref={contentLayerRef} className="absolute inset-0 z-26">
            <div className="h-full px-4 md:px-8 lg:px-16 py-12">
              <div className="max-w-7xl mx-auto h-full flex flex-col">
                
                {!isMobile && (
                  <div ref={headingRef} className="mb-8 lg:mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="inline-flex items-center gap-2 font-mono text-xs text-[#00d4ff]">
                        <span className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" />
                        001
                      </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#e8e8ec] leading-[1.05] max-w-5xl tracking-tight">
                      A FAMILIAR WORLD... SET ON A DIFFERENT PATH.
                    </h2>
                  </div>
                )}

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-center">
                  
                  <div 
                    ref={leftContentRef}
                    className="lg:col-span-3 mt-8"
                    style={{
                      position: 'relative',
                      left: isMobile ? '20px' : '50px',
                      top: isMobile ? '-30px' : '50px',
                      opacity: 0,
                      visibility: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: isMobile ? '160px' : '180px',
                        height: isMobile ? '200px' : '150px',
                      }}
                    >
                      <div
                        ref={thumbnailFrameRef}
                        className="w-full h-full rounded-xl overflow-hidden bg-[#0a0a0f] border-2 border-[#1a1a24]"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=360&h=400&fit=crop"
                          alt="Character thumbnail"
                          className="w-full object-cover"
                          style={{
                            height: isMobile ? '120%' : '100%',
                            objectPosition: isMobile ? 'top 50% center' : 'center',
                            transform: isMobile ? 'translateY(-10%)' : 'none'
                          }}
                        />
                      </div>
                      
                      <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00d4ff]" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00d4ff]" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00d4ff]" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00d4ff]" />
                      </div>
                    </div>
                    
                    <p 
                      className="mt-6 text-sm text-[#6b6b7b] leading-relaxed"
                      style={{
                        maxWidth: isMobile ? '120px' : '180px',
                        fontSize: isMobile ? '11px' : '14px',
                        marginLeft: isMobile ? '5px' : '0',
                      }}
                    >
                      Isolated within the New Eden safe zone, you witness humanity struggling to avoid descending into chaos.
                    </p>
                  </div>

                  <div className="lg:col-span-4" />

                  <div className="lg:col-span-5">
                    <div 
                      ref={trailerCardRef} 
                      className="relative"
                      style={{
                        marginTop: isMobile ? '60px' : '0',
                        paddingLeft: isMobile ? '10px' : '0',
                        paddingRight: isMobile ? '10px' : '0',
                         zIndex: 30,  // Добавь эту строку
                      }}
                    >
                      <div 
                        className="relative rounded-xl overflow-hidden bg-[#0a0a15] border border-[#2a2a3a] cursor-pointer group"
                        style={{
                          aspectRatio: '16/9',
                          width: isMobile ? 'calc(100% - 20px)' : '100%',
                          marginLeft: isMobile ? '10px' : '0',
                        }}
                      >
                        {/* видео контент */}
                      </div>
                      
                      {!isMobile && (
                        <div className="flex gap-3 mt-4">
                          <button className="px-6 py-2.5 bg-[#00d4ff] hover:bg-[#00b8e0] text-[#050508] rounded-lg text-sm font-medium transition-colors">
                            Watch Now
                          </button>
                          <button className="px-6 py-2.5 border border-[#3a3a4a] hover:border-[#5a5a6a] text-[#e8e8ec] rounded-lg text-sm font-medium transition-colors">
                            Add to List
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div
            ref={heroImageRef}
            className="absolute z-25 overflow-hidden"
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <img
              src={isMobile ? "/image/hero-mobile.webp" : "/image/hero.webp"}
              alt="Hero character"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508]" />
            
            <div
              ref={heroTextRef}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
            >
              <h1 
                className="font-heavy text-white mb-4 leading-[1.2]"
                style={{ 
                  fontFamily: "'CCUltimatum', sans-serif",
                  letterSpacing: '0.06em',
                  fontSize: isMobile ? '40px' : '5rem',
                  maxWidth: isMobile ? '90%' : '100%',
                }}
              >
                WELCOME TO THE
                <br />
                <span className="text-[#00d4ff]">ASTROUNIVERSE</span>
              </h1>
              
              <p 
                className="text-white/70 max-w-2xl"
                style={{
                  fontSize: isMobile ? '14px' : '1.25rem',
                  paddingLeft: isMobile ? '20px' : '0',
                  paddingRight: isMobile ? '20px' : '0',
                }}
              >
                A world forever changed. A power that could save or destroy.
              </p>
              
              <div className="absolute inset-0 z-30 pointer-events-none">
                <Starfield
                  starColor="rgba(0, 212, 255, 0.8)"
                  bgColor="rgba(0, 0, 0, 0)"
                  mouseAdjust={true}
                  speed={0.5}
                  quantity={400}
                />
              </div>
              
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs font-mono text-[#00d4ff] tracking-widest">SCROLL</span>
                <div className="w-6 h-10 border-2 border-[#00d4ff]/50 rounded-full flex justify-center pt-2">
                  <div className="w-1.5 h-3 bg-[#00d4ff] rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
          
          {/* РАМКА-ОВЕРЛЕЙ */}
          <div
            ref={overlayFrameRef}
            className="absolute z-[100] pointer-events-none"
            style={{
              opacity: 0,
              position: 'absolute',
              width: framePos.width,
              height: framePos.height,
              left: framePos.x,
              top: framePos.y,
            }}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00d4ff]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00d4ff]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00d4ff]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00d4ff]" />
            </div>
          </div>

          {/* ТЕКСТОВАЯ РАМКА-ОВЕРЛЕЙ */}
          <div
            ref={textOverlayFrameRef}
            className="absolute z-[100] pointer-events-none"
            style={{
              opacity: 0,
              position: 'absolute',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: isMobile ? '250px' : '180px',
                height: isMobile ? '150px' : '150px',
                marginBottom: '16px',
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#00d4ff]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#00d4ff]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#00d4ff]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00d4ff]" />
              </div>
            </div>
            
            <div 
              className="text-sm text-[#FFFFFF] leading-relaxed"
              style={{
                maxWidth: isMobile ? '350px' : '180px',
                fontSize: isMobile ? '16px' : '14px',
                marginLeft: isMobile ? '-40px' : '0',
              }}
            >
              A mysterious cosmic phenomenon connecting minds across the galaxy and awakening ancient powers. 
            </div>
          </div>
          
          {/* FLIP CARD */}
          <div
            ref={flipCardContainerRef}
            className="absolute z-30 pointer-events-none"
            style={{
              left: isMobile ? '50%' : '45%',
              top: isMobile ? '50%' : '64%',
              transform: isMobile ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              <div
                ref={flipCardWrapperRef}
                className="relative will-change-transform origin-center"
                style={{ 
                  width: isMobile ? 140 : 220,
                  height: isMobile ? 200 : 320,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  ref={flipCardRef}
                  className="relative w-full h-full will-change-transform"
                  style={{ 
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    ref={cardFrontRef}
                    className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[#00d4ff]/50"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      boxShadow: '0 0 30px rgba(0, 212, 255, 0.3), inset 0 0 60px rgba(0, 212, 255, 0.1)'
                    }}
                  >
                    <video
                      src="/video/void.webm"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#00d4ff]" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#00d4ff]" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#00d4ff]" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#00d4ff]" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-[#ff6b35]">ID:</span>
                        <span className="text-[10px] font-mono text-[#00d4ff]">ANM-001</span>
                      </div>
                      <div className="text-sm text-[#e8e8ec] font-medium">Nexus Walker</div>
                    </div>
                  </div>
                  
                  <div
                    ref={cardBackRef}
                    className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[#00d4ff]/30"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: 'transparent',
                    }}
                  >
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#00d4ff]/50" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#00d4ff]/50" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#00d4ff]/50" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#00d4ff]/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}