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
  }
}
const sections = [
  { label: 'ABOUT', href: '/about', id: 'about', isPage: true },
  { label: 'COMMUNITY', href: '#community', id: 'community', isPage: false },
  { label: 'ASTRO CLUB', href: '#astro-club', id: 'astro-club', isPage: false },
  { label: 'CARGO BAY', href: '#cargo-bay', id: 'cargo-bay', isPage: false },
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

// ====================== ФУНКЦИЯ ЗАГРУЗКИ ВСЕХ РЕСУРСОВ ======================
const loadAllResources = async (onProgress: (progress: number) => void) => {
  const resourcesToLoad: Promise<unknown>[] = []
  
  // Список всех изображений панорам
  const panoramaImages = [
    '/images/panorama-bridge.webp',
    '/images/panorama-bridge.webp',
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
    // Loading screen is now hidden by the playback useEffect
    // after video is confirmed ready — no more premature hide
  }
  
  startLoading()
}, [])

  // Запуск видео и инициализация только после полной загрузки
  useEffect(() => {
    if (!allResourcesReady) return
    
    const player1 = document.getElementById('intro-video-player-1') as HTMLVideoElement
    const audio1 = document.getElementById('audio-intro-1') as HTMLAudioElement
    const mainContent = document.getElementById('main-content')
    
    // Wait for the actual player element to be ready before showing
    const startPlayback = () => {
      // Show main-content first (still behind loading screen)
      if (mainContent) mainContent.style.display = 'block'
      
      // Start video
      if (player1) {
        player1.currentTime = 0
        player1.play().catch(e => console.log('Video 1 autoplay failed:', e))
      }
      if (audio1) {
        audio1.volume = 0.5
        audio1.currentTime = 0
        audio1.play().catch(e => console.log('Audio 1 autoplay failed:', e))
      }
      
      // Only THEN hide loading screen (with slight delay for video to render first frame)
      setTimeout(() => {
        setShowLoading(false)
      }, 150)
    }
    
    if (player1 && player1.readyState >= 3) {
      // Video already buffered enough
      startPlayback()
    } else if (player1) {
      // Wait for video to be ready
      player1.addEventListener('canplaythrough', startPlayback, { once: true })
      // Fallback: don't wait forever
      setTimeout(startPlayback, 3000)
    } else {
      startPlayback()
    }
    
  }, [allResourcesReady])

  // ====================== MAIN INIT ======================
  useEffect(() => {
    if (isLoaded.current) return
    isLoaded.current = true

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
      const modal = document.getElementById(`modal-${name}`)
      if (modal) modal.style.display = 'flex'
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
    <>    <MobileMenu sections={sections} onNavigate={handleNavigate} />
    
    <LoadingScreen progress={loadingProgress} isVisible={showLoading} />
      
      <Script src="/js/main.js" strategy="afterInteractive" />

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
    <img src="/images/panorama-bridge.webp" className="panorama-img" alt="Bridge" />
    <div className="layer-interactive">
      <div className="hotspot" data-percent-x="10.77" data-percent-y="51.80" data-label="COMMUNITY" onClick={() => window.enterLocation?.('loc-2', 'COMMUNITY')}>
        <div className="hotspot-dot"></div>
      </div>
      
      {/* ХОТСПОТ ABOUT С ГЛОБУСОМ (только один!) */}
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
      <div className="hotspot" data-percent-x="77.58" data-percent-y="58.43" data-label="CARGO BAY" onClick={() => window.openSection?.('cargo')}>
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
  <div className="layer-animated">
    <div className="animated-object robot" style={{ left: '20%', top: '55%' }} id="robot-1"></div>
    <div className="animated-object person" style={{ left: '50%', top: '52%' }} id="person-1"></div>
    <div className="animated-object screen" style={{ left: '80%', top: '45%' }}></div>
  </div>
</div>
            {/* ==================== COMMUNITY ==================== */}
            <div className="location" id="loc-2">
              <div className="panorama-wrapper">
                <img src="/images/panorama-bridge.webp" className="panorama-img" alt="Community" />
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
                <img src="/images/panorama-bridge.webp" className="panorama-img" alt="Quarters" />
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
        <img id="static-bg-1" src="/images/space-bg.webp" alt="Static door scene" className="static-bg" />
        <video muted playsInline id="intro-video-player-1">
          <source src="/videos/intro-fly.mp4" type="video/mp4" />
        </video>
        <audio id="audio-intro-1" preload="auto">
          <source src="/sounds/intro-fly-audio.mp3" type="audio/mpeg" />
        </audio>
      </div>

      <div id="intro-video-2" className="intro-video" style={{ opacity: 0, pointerEvents: 'none' }}>
        <img id="static-bg-2" src="/images/panorama-1-center.webp" alt="Static bridge scene" className="static-bg" />
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