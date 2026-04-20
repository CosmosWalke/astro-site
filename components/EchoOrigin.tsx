'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

export function EchoOrigin() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }}
      )

      gsap.fromTo(textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }}
      )

      gsap.fromTo(buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }}
      )

      gsap.fromTo(ringRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, delay: 0.5, scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }}
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden"
    >
      {/* Фоновое изображение с плавным градиентным переходом сверху И СНИЗУ */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/image/void.webp')",
          filter: 'brightness(0.8) blur(1px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      />
      
      {/* Затемнение с градиентом сверху И СНИЗУ */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,5,8,0.9) 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,0.4) 85%, rgba(5,5,8,0.9) 100%)'
        }}
      />

      {/* Текст и кнопка - на десктопе вверху слева, на мобильных по центру внизу */}
      <div className="absolute z-10 max-w-[calc(100%-2rem)] md:max-w-2xl md:text-left text-center md:top-32 md:left-16 bottom-8 left-4 right-4 md:bottom-auto md:left-auto md:right-auto">
        <h2 ref={titleRef} className="text-2xl md:text-6xl font-bold text-white mb-2 md:mb-4 tracking-tight">
          BEGINING. THE <span className="text-[#00d4ff]">ECHO AWAKENING</span>
        </h2>

        <p ref={textRef} className="text-sm md:text-lg text-[#ffffff] leading-relaxed bg-black/30 backdrop-blur-sm p-3 md:p-4 rounded-xl mb-4 md:mb-6">
          From the heart of Nexus Prime, a mysterious cosmic phenomenon awakens. 
          The Great Echo spreads across galaxies, connecting minds and unlocking 
          powers dormant for eons. This is where it all begins.
        </p>

        {/* Кнопка EXPLORE LORE - без стрелки на мобильных */}
        <div ref={buttonRef} className="flex justify-center md:block">
          <Link href="/lore">
            <button className="group relative px-6 py-2.5 md:px-8 md:py-3 bg-transparent border-2 border-[#00d4ff] text-[#00d4ff] font-mono text-sm md:text-base tracking-wider rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#00d4ff] hover:text-black hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]">
              <span className="relative z-10 flex items-center justify-center gap-2">
                EXPLORE LORE
                {/* Стрелка - скрыта на мобильных */}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-[#00d4ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </Link>
        </div>
      </div>

      {/* Пульсирующее кольцо по центру экрана */}
      <div ref={ringRef} className="relative">
        {/* Внешнее пульсирующее кольцо */}
        <div className="w-80 h-80 md:w-96 md:h-96 rounded-full border-2 border-[#00d4ff] opacity-20 animate-ping absolute" />
        
        {/* Среднее кольцо */}
        <div className="w-80 h-80 md:w-96 md:h-96 rounded-full border-2 border-[#00d4ff] opacity-40 animate-pulse" />
        
        {/* Внутреннее кольцо */}
        <div className="absolute inset-4 md:inset-4 rounded-full border border-[#00d4ff] opacity-60" />
        
        {/* Центр полностью прозрачный */}
        <div className="absolute inset-6 md:inset-8 rounded-full" />
      </div>
    </div>
  )
}