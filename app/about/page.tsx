'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Header } from '@/components/header'
import { HeroStoryCombined } from '@/components/hero-story-combined'
import { EchoOrigin } from '@/components/EchoOrigin'
import { VoidAstroCycle } from '@/components/VoidAstroCycle'
import { ComicSection } from '@/components/comic-section'
import { ProjectSection } from '@/components/project-section'
import { CardsSection } from '@/components/CardsSection'
import { MapSection } from '@/components/MapSection'
import { GallerySection } from '@/components/gallery-section'
import { Footer } from '@/components/footer'
import { ScrollProgress } from '@/components/ScrollProgress'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
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

// Функция загрузки всех ресурсов
const loadAllResources = async (onProgress: (progress: number) => void) => {
  console.log('🚀 НАЧАЛО ЗАГРУЗКИ ВСЕХ РЕСУРСОВ...')
  
  const resourcesToLoad: Promise<unknown>[] = []
  
  // Список всех изображений на странице
  const allImages = [
    // Hero
    '/image/hero.webp',
    '/image/hero-mobile.webp',
    // EchoOrigin
    '/image/void.webp',
    // VoidAstroCycle
    '/image/ac1.webp',
    '/image/ac2.webp',
    '/image/ac3.webp',
    '/image/ac4.webp',
    '/image/pan1-mobile2.webp',
    // ComicSection
    '/image/comicsback.webp',
    '/image/comi1.png',
    '/image/comi2.png',
    '/image/comi3.png',
    '/image/comi4.png',
    '/image/comi5.png',
    '/image/comi6.png',
    '/image/comiheader.webp',
    '/image/leftcomi.webp',
    '/image/rightcomi.webp',
    // ProjectSection
    '/image/vape.webp',
    '/image/flowers.webp',
    '/image/prerolls.webp',
    // CardsSection
    '/image/card1.png',
    '/image/card2.png',
    '/image/card3.png',
    '/image/card4.png',
    // MapSection
    '/image/map.webp',
    // GallerySection
    '/image/gallery1.webp',
    '/image/gallery2.webp',
    '/image/gallery3.webp',
    '/image/gallery4.webp',
  ]
  
  // Список всех видео
  const allVideos = [
    '/video/pan1.webm',
    '/video/void.webm',
    '/video/vape.webm',
    '/video/flowers.webm',
    '/video/prerolls.webm',
    '/video/loading.webm',
  ]
  
  let loadedCount = 0
  const totalCount = allImages.length + allVideos.length
  
  const updateProgress = (resourceName: string) => {
    loadedCount++
    const progress = Math.floor((loadedCount / totalCount) * 100)
    console.log(`✅ Загружено: ${resourceName} (${loadedCount}/${totalCount}) - ${progress}%`)
    onProgress(progress)
  }
  
  // Загрузка изображений
  allImages.forEach((src) => {
    const img = new Image()
    img.src = src
    const name = src.split('/').pop()
    const promise = new Promise((resolve) => {
      if (img.complete) {
        updateProgress(name || src)
        resolve(true)
      } else {
        img.onload = () => {
          updateProgress(name || src)
          resolve(true)
        }
        img.onerror = () => {
          updateProgress(name || src)
          resolve(false)
        }
      }
    })
    resourcesToLoad.push(promise)
  })
  
  // Загрузка видео
  allVideos.forEach((src) => {
    const name = src.split('/').pop()
    const promise = new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'auto'
      video.src = src
      
      let resolved = false
      
      video.addEventListener('canplaythrough', () => {
        if (!resolved) {
          resolved = true
          updateProgress(name || src)
          resolve(true)
        }
      }, { once: true })
      
      video.addEventListener('error', (e) => {
        if (!resolved) {
          resolved = true
          console.error(`❌ Ошибка загрузки ${name}:`, e)
          updateProgress(name || src)
          resolve(false)
        }
      }, { once: true })
      
      setTimeout(() => {
        if (!resolved) {
          resolved = true
          console.warn(`⚠️ Таймаут загрузки ${name}, продолжаем...`)
          updateProgress(name || src)
          resolve(false)
        }
      }, 10000)
    })
    resourcesToLoad.push(promise)
  })
  
  console.log('⏳ Ожидание загрузки всех ресурсов...')
  await Promise.all(resourcesToLoad)
  console.log('🎉 ВСЕ РЕСУРСЫ ЗАГРУЖЕНЫ!')
  return true
}

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Состояния для загрузочного экрана
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('// initializing')
  const loadingContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const physicalWidth = window.screen.width;
    const physicalHeight = window.screen.height;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1;
    
    const isMobileDevice = hasTouch && (physicalWidth < 1024 || physicalHeight < 1024);
    
    setIsMobile(isMobileDevice);
  }, []);

  // Загрузка ресурсов
  useEffect(() => {
    let isMounted = true
    
    const startLoading = async () => {
      await loadAllResources((progress) => {
        if (isMounted) {
          setLoadingProgress(progress)
          const statusIndex = Math.floor((progress / 100) * (statusMessages.length - 1))
          setLoadingText(statusMessages[Math.min(statusIndex, statusMessages.length - 1)])
        }
      })
      
      if (isMounted) {
        setLoadingProgress(100)
        setLoadingText(statusMessages[statusMessages.length - 1])
        
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
    if (!isLoading && mainRef.current) {
      gsap.fromTo(mainRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
      )
      ScrollTrigger.refresh()
    }
  }, [isLoading])

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

      <ScrollProgress />
      
      <div ref={mainRef} className="relative opacity-0">
        <Header />

        <div className="relative z-10 bg-[#050508]">
          {/* Universe Section - Hero */}
          <div id="universe" className="relative">
            <HeroStoryCombined />
          </div>

          {/* Секция - The Echo Origin */}
          <div id="echo-origin" className="relative">
            <EchoOrigin />
          </div>

          {/* Секция - Void & Astro Cycle */}
          <div id="void-cycle" className="relative">
            <VoidAstroCycle />
          </div>

          {/* World/Map Section - прямой переход от VoidAstroCycle */}
          <div id="world" className="relative">
            <MapSection />
          </div>
          
          {/* Card section */}
          <div id="cards" className="relative">
            <CardsSection />
          </div>
          
          {/* Comic Section */}
          <div id="comic" className="relative">
            <ComicSection />
          </div>

          {/* Products Section */}
          <div id="products" className="relative">
            <ProjectSection />
          </div>

          {/* Media/Gallery Section */}
          <div id="media" className="relative">
            <GallerySection />
          </div>
        </div>

        <Footer />
        <CursorFollower />

        <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.015]">
          <div className="absolute inset-0 noise" />
        </div>
      </div>
    </>
  )
}

// Custom cursor follower component
function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current

    if (!cursor || !follower) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let followerX = 0
    let followerY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.2
      cursorY += (mouseY - cursorY) * 0.2
      cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`

      followerX += (mouseX - followerX) * 0.08
      followerY += (mouseY - followerY) * 0.08
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`

      requestAnimationFrame(animate)
    }

    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 0.5, duration: 0.3 })
      gsap.to(follower, { scale: 1.5, duration: 0.3 })
    }

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 })
      gsap.to(follower, { scale: 1, duration: 0.3 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#00d4ff] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
      />
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[#00d4ff]/50 rounded-full pointer-events-none z-[9998] hidden lg:block"
      />
    </>
  )
}