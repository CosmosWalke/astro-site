'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ChevronDown } from 'lucide-react'

// Pre-generated particle positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { left: 15, top: 25, duration: 4.2, delay: 0.3 },
  { left: 32, top: 68, duration: 5.1, delay: 1.2 },
  { left: 48, top: 12, duration: 3.8, delay: 0.7 },
  { left: 71, top: 45, duration: 6.2, delay: 0.1 },
  { left: 88, top: 78, duration: 4.5, delay: 1.8 },
  { left: 23, top: 91, duration: 5.8, delay: 0.5 },
  { left: 56, top: 34, duration: 3.5, delay: 1.4 },
  { left: 79, top: 56, duration: 4.9, delay: 0.9 },
  { left: 41, top: 82, duration: 5.4, delay: 1.6 },
  { left: 64, top: 19, duration: 4.1, delay: 0.2 },
  { left: 9, top: 47, duration: 6.0, delay: 1.1 },
  { left: 35, top: 73, duration: 3.9, delay: 0.6 },
  { left: 52, top: 8, duration: 5.3, delay: 1.9 },
  { left: 76, top: 61, duration: 4.7, delay: 0.4 },
  { left: 93, top: 29, duration: 5.6, delay: 1.3 },
  { left: 18, top: 54, duration: 3.6, delay: 0.8 },
  { left: 44, top: 87, duration: 4.3, delay: 1.5 },
  { left: 67, top: 41, duration: 5.9, delay: 0.0 },
  { left: 82, top: 16, duration: 4.0, delay: 1.7 },
  { left: 29, top: 63, duration: 5.2, delay: 1.0 },
]

const carouselImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=1000&fit=crop',
    title: 'KEEPER_001',
    subtitle: 'The Guardian'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1000&fit=crop',
    title: 'KEEPER_002',
    subtitle: 'The Watcher'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1000&fit=crop',
    title: 'KEEPER_003',
    subtitle: 'The Sentinel'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1000&fit=crop',
    title: 'KEEPER_004',
    subtitle: 'The Protector'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&h=1000&fit=crop',
    title: 'KEEPER_005',
    subtitle: 'The Overseer'
  }
]

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Initial animations
    const tl = gsap.timeline({ delay: 0.5 })
    
    tl.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    
    // Animate carousel items
    if (carouselRef.current) {
      const items = carouselRef.current.querySelectorAll('.carousel-item')
      tl.fromTo(items,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.5'
      )
    }
  }, [])

  const handleCardClick = (index: number) => {
    if (isAnimating || index === activeIndex) return
    setIsAnimating(true)
    setActiveIndex(index)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex
    const abseDiff = Math.abs(diff)
    
    // Base values
    let translateX = diff * 220
    let translateZ = -abseDiff * 100
    let rotateY = diff * -15
    let scale = 1 - abseDiff * 0.15
    let opacity = 1 - abseDiff * 0.3
    let zIndex = 10 - abseDiff

    // Clamp values
    scale = Math.max(scale, 0.5)
    opacity = Math.max(opacity, 0.2)

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    }
  }

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050508]"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.1)_0%,transparent_70%)]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {PARTICLE_POSITIONS.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#00d4ff]/30 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center mb-8 px-4">
        <div className="mb-4 font-mono text-xs text-[#00d4ff] tracking-[0.3em]">
          STORY PAGE 001
        </div>
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
        >
          <span className="text-[#e8e8ec]">WELCOME TO THE </span>
          <span className="text-[#00d4ff] text-glow-cyan">ASTROUNIVERSE</span>
        </h1>
        <p className="text-[#6b6b7b] text-lg md:text-xl max-w-2xl mx-auto">
          Protocol guardians of the last civilization
        </p>
      </div>

      {/* 3D Carousel */}
      <div 
        ref={carouselRef}
        className="relative w-full h-[400px] md:h-[500px] perspective-2000 flex items-center justify-center"
      >
        <div className="relative preserve-3d flex items-center justify-center">
          {carouselImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => handleCardClick(index)}
              className={`carousel-item absolute cursor-pointer transition-all duration-600 ease-out`}
              style={getCardStyle(index)}
            >
              {/* Card */}
              <div className={`relative w-[200px] md:w-[280px] h-[280px] md:h-[380px] bg-[#0a0a0f] border ${
                index === activeIndex ? 'border-[#00d4ff]' : 'border-[#1a1a24]'
              } overflow-hidden group`}>
                {/* Image */}
                <div className="absolute inset-0">
                  <img 
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    crossOrigin="anonymous"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                </div>

                {/* Scanline effect */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                  <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="font-mono text-xs text-[#00d4ff] mb-1">{image.title}</div>
                  <div className="text-sm text-[#6b6b7b]">{image.subtitle}</div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#00d4ff]/50" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#00d4ff]/50" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#00d4ff]/50" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#00d4ff]/50" />

                {/* Active indicator */}
                {index === activeIndex && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#00d4ff]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="relative z-10 flex items-center gap-2 mt-8">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(index)}
            className={`w-2 h-2 transition-all duration-300 ${
              index === activeIndex 
                ? 'w-8 bg-[#00d4ff]' 
                : 'bg-[#2a2a38] hover:bg-[#00d4ff]/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Discover Button */}
      <div className="relative z-10 mt-12">
        <a 
          href="#discover"
          className="group inline-flex flex-col items-center gap-2 text-[#6b6b7b] hover:text-[#00d4ff] transition-colors duration-300"
        >
          <span className="text-sm font-medium tracking-wider">Discover More</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>

      {/* Side Info Panels */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
        <div className="font-mono text-xs text-[#6b6b7b] writing-mode-vertical transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
          KPCO / KAI-14 / REACTOR
        </div>
      </div>

      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#00d4ff]/50 to-transparent" />
          <div className="font-mono text-xs text-[#00d4ff]">{String(activeIndex + 1).padStart(2, '0')}</div>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#2a2a38] to-transparent" />
        </div>
      </div>

      {/* Bottom Terminal */}
      <div className="absolute bottom-8 left-4 md:left-8 right-4 md:right-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 font-mono text-xs text-[#6b6b7b]">
            <span className="text-[#00d4ff]">&gt;</span>
            <span className="typing-effect">Type Your Command</span>
          </div>
        </div>
      </div>
    </section>
  )
}
