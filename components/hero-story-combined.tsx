'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Starfield } from '@/components/ui/starfield-1'

// Упрощенная загрузка
const loadHeroImages = async (onProgress: (progress: number) => void) => {
  const images = [
    { src: '/image/hero.webp', name: 'Hero Desktop' },
    { src: '/image/hero-mobile.webp', name: 'Hero Mobile' },
  ]
  
  let loaded = 0
  for (const { src, name } of images) {
    await new Promise((resolve) => {
      const img = new Image()
      img.src = src
      if (img.complete) {
        loaded++
        onProgress(Math.floor((loaded / images.length) * 100))
        resolve(true)
      } else {
        img.onload = () => {
          loaded++
          onProgress(Math.floor((loaded / images.length) * 100))
          resolve(true)
        }
        img.onerror = () => resolve(false)
      }
    })
  }
}

export function HeroStoryCombined() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1
      const width = window.screen.width
      setIsMobile(hasTouch && width < 1024)
    }
    checkMobile()
    window.addEventListener('orientationchange', checkMobile)
    return () => window.removeEventListener('orientationchange', checkMobile)
  }, [])

  useEffect(() => {
    loadHeroImages((p) => setProgress(p)).then(() => {
      setTimeout(() => setIsLoading(false), 500)
    })
  }, [])

  useEffect(() => {
    if (!isLoading && heroRef.current) {
      gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
      gsap.fromTo(textRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-[#00d4ff] font-mono mb-4">LOADING UNIVERSE</div>
          <div className="w-64 h-px bg-white/20">
            <div className="h-full bg-[#00d4ff]" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-white/40 text-xs mt-2 font-mono">{progress}%</div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      <div ref={heroRef} className="absolute inset-0">
        <img
          src={isMobile ? "/image/hero-mobile.webp" : "/image/hero.webp"}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508]" />
      </div>

      <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-bold text-white mb-4 leading-[1.2]" style={{ 
          fontFamily: "'CCUltimatum', sans-serif",
          fontSize: isMobile ? '40px' : '80px',
          letterSpacing: '0.06em'
        }}>
          WELCOME TO THE
          <br />
          <span className="text-[#00d4ff]">ASTROUNIVERSE</span>
        </h1>
        
        <p className="text-white/70 max-w-2xl" style={{ fontSize: isMobile ? '14px' : '20px' }}>
          We are all connected in the cosmic web. One signal can change everything
        </p>

        <div className="absolute inset-0 pointer-events-none">
          <Starfield starColor="rgba(0, 212, 255, 0.8)" quantity={400} speed={0.5} />
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#00d4ff]/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#00d4ff] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}