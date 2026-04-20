'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function VoidAstroCycle() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Определяем мобильное устройство
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1
      const width = window.screen.width
      const mobile = hasTouch && width < 1024
      setIsMobile(mobile)
      setIsDesktop(!mobile)
    }
    checkMobile()
    window.addEventListener('orientationchange', checkMobile)
    return () => window.removeEventListener('orientationchange', checkMobile)
  }, [])

  useEffect(() => {
    // Запуск видео только для десктопа
    if (isDesktop && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Video autoplay failed:', e))
    }

    // Анимация ТОЛЬКО для десктопа
    if (isDesktop) {
      const steps = ['.step-1', '.step-2', '.step-3', '.step-4']
      
      steps.forEach((step, index) => {
        gsap.fromTo(step,
          { opacity: 0, y: 50, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.6, 
            delay: index * 0.15,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      gsap.fromTo('.cycle-arrow',
        { opacity: 0, scaleX: 0 },
        { 
          opacity: 0.6, 
          scaleX: 1, 
          duration: 0.5, 
          delay: 0.6,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }
  }, [isDesktop])

  // Для мобильных - просто статический рендер без анимаций
  if (isMobile) {
    return (
      <div className="relative min-h-screen py-20 px-4 overflow-hidden" style={{ backgroundColor: '#050508' }}>
        {/* Фоновое изображение */}
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: "url('/image/pan1-mobile2.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            opacity: 0.7
          }}
        />
        
        {/* Затемнение с градиентом */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(5,5,8,0.9) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.4) 85%, rgba(5,5,8,0.9) 100%)'
          }}
        />

        {/* Контент */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-center text-white mb-4 px-4">
            THE <span className="text-[#00d4ff]">VOID</span> & ASTRO CYCLE
          </h2>
          <p className="text-center text-[#9ca3af] mb-12 max-w-2xl mx-auto px-4 text-sm">
            Brave miners venture into the unknown to harvest the essence that powers our universe
          </p>

          {/* Вертикальный список без анимаций */}
          <div className="flex flex-col gap-8 items-center px-4">
            {/* Step 1: The Void */}
            <div className="relative rounded-2xl overflow-hidden border border-[#1a1a2e] text-center w-full max-w-[320px] h-[420px]">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/image/ac1.webp')" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full pb-8">
                <h3 className="text-2xl font-bold text-[#8b5cf6] mb-3">THE VOID</h3>
                <p className="text-sm text-white max-w-[85%]">
                  A dimension of pure potential where reality bends and ancient energies sleep
                </p>
              </div>
            </div>

            {/* Стрелка вниз */}
            <div className="text-3xl text-[#00d4ff]/60">↓</div>

            {/* Step 2: Astro Particles Detected */}
            <div className="relative rounded-2xl overflow-hidden border border-[#00d4ff]/30 text-center w-full max-w-[320px] h-[420px]">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/image/ac2.webp')" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full pb-8">
                <h3 className="text-xl font-bold text-[#00d4ff] mb-3">ASTRO PARTICLES<br/>DETECTED</h3>
                <p className="text-sm text-white max-w-[85%]">
                  Energy signatures detected in the Void. Pure cosmic essence waiting to be harvested
                </p>
              </div>
            </div>

            {/* Стрелка вниз */}
            <div className="text-3xl text-[#00d4ff]/60">↓</div>

            {/* Step 3: Mining */}
            <div className="relative rounded-2xl overflow-hidden border border-[#1a1a2e] text-center w-full max-w-[320px] h-[420px]">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/image/ac4.webp')" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full pb-8">
                <h3 className="text-2xl font-bold text-[#ff6b35] mb-3">MINING</h3>
                <p className="text-sm text-white max-w-[85%]">
                  Brave miners extract Astro particles from the Void using advanced technology
                </p>
              </div>
            </div>

            {/* Стрелка вниз */}
            <div className="text-3xl text-[#00d4ff]/60">↓</div>

            {/* Step 4: Production */}
            <div className="relative rounded-2xl overflow-hidden border border-[#1a1a2e] text-center w-full max-w-[320px] h-[420px]">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/image/ac3.webp')" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full pb-8">
                <h3 className="text-2xl font-bold text-[#14f195] mb-3">PRODUCTION</h3>
                <p className="text-sm text-white max-w-[85%]">
                  Scientists in Federation laboratories are infusing products with extracts containing Astro particles
                </p>
              </div>
            </div>
          </div>

          {/* Цикл схема */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a0a12]/80 backdrop-blur-sm rounded-full border border-[#1a1a2e]">
              <span className="text-xs font-mono text-[#00d4ff] whitespace-nowrap">
                VOID → DETECTED → MINING → PRODUCTION
              </span>
              <span className="text-[#00d4ff] text-sm">⟳</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Десктоп версия с анимациями
  return (
    <div ref={containerRef} className="relative min-h-screen py-20 px-4 overflow-hidden">
      {/* Фоновое видео */}
      <video
        ref={videoRef}
        src="/video/pan1.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          filter: 'brightness(0.3) blur(2px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      />
      
      {/* Затемнение с градиентом */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,5,8,0.9) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.4) 85%, rgba(5,5,8,0.9) 100%)'
        }}
      />

      {/* Контент */}
      <div className="relative z-10">
        <h2 className="text-5xl font-bold text-center text-white mb-4 px-4">
          THE <span className="text-[#00d4ff]">VOID</span> & ASTRO CYCLE
        </h2>
        <p className="text-center text-[#9ca3af] mb-16 max-w-2xl mx-auto px-4 text-base">
          Brave miners venture into unknown places to extract essence that unlocks incredible abilities.
        </p>

        {/* Горизонтальный ряд с прокруткой */}
        <div className="overflow-x-auto overflow-y-hidden pb-8">
          <div className="flex flex-row gap-6 justify-center items-stretch min-w-[1200px] px-8">
            {/* Step 1: The Void */}
            <div className="step-1 relative rounded-2xl overflow-hidden border border-[#1a1a2e] text-center group w-[280px] h-[500px] flex-shrink-0">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/image/ac1.webp')" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full pb-8">
                <h3 className="text-2xl font-bold text-[#8b5cf6] mb-3">THE VOID</h3>
                <p className="text-sm text-white max-w-[90%]">
                  A dimension of pure potential where reality bends and ancient energies sleep
                </p>
              </div>
            </div>

            <div className="cycle-arrow flex items-center justify-center text-4xl text-[#00d4ff]/60 flex-shrink-0">→</div>

            {/* Step 2: Astro Particles Detected */}
            <div className="step-2 relative rounded-2xl overflow-hidden border border-[#00d4ff]/30 text-center group w-[280px] h-[500px] flex-shrink-0">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/image/ac2.webp')" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full pb-8">
                <h3 className="text-xl font-bold text-[#00d4ff] mb-3">ASTRO PARTICLES<br/>DETECTED</h3>
                <p className="text-sm text-white max-w-[90%]">
                  Energy signatures detected in the Void. Pure cosmic essence waiting to be harvested
                </p>
              </div>
            </div>

            <div className="cycle-arrow flex items-center justify-center text-4xl text-[#00d4ff]/60 flex-shrink-0">→</div>

            {/* Step 3: Mining */}
            <div className="step-3 relative rounded-2xl overflow-hidden border border-[#1a1a2e] text-center group w-[280px] h-[500px] flex-shrink-0">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/image/ac4.webp')" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full pb-8">
                <h3 className="text-2xl font-bold text-[#ff6b35] mb-3">MINING</h3>
                <p className="text-sm text-white max-w-[90%]">
                  Brave miners extract Astro particles from the Void using advanced technology
                </p>
              </div>
            </div>

            <div className="cycle-arrow flex items-center justify-center text-4xl text-[#00d4ff]/60 flex-shrink-0">→</div>

            {/* Step 4: Production */}
            <div className="step-4 relative rounded-2xl overflow-hidden border border-[#1a1a2e] text-center group w-[280px] h-[500px] flex-shrink-0">
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/image/ac3.webp')" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="relative z-10 p-6 flex flex-col items-center justify-end h-full pb-8">
                <h3 className="text-2xl font-bold text-[#14f195] mb-3">PRODUCTION</h3>
                <p className="text-sm text-white max-w-[90%]">
                  Scientists in Federation laboratories are infusing products with extracts containing Astro particles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Цикл схема */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#0a0a12]/80 backdrop-blur-sm rounded-full border border-[#1a1a2e]">
            <span className="text-sm font-mono text-[#00d4ff] whitespace-nowrap">
              VOID → DETECTED → MINING → PRODUCTION
            </span>
            <span className="text-[#00d4ff] animate-spin-slow text-base">⟳</span>
          </div>
        </div>
      </div>

      {/* Плавающие частицы */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00d4ff] rounded-full opacity-0 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float infinite ease-in-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; display: inline-block; }
      `}</style>
    </div>
  )
}