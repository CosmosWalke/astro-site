'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Video card component with hover effects
function VideoCard({ index }: { index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [isHovered])

  return (
    <div
      className="video-card relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out"
      style={{
        width: isHovered ? '360px' : '280px',
        height: isHovered ? '420px' : '360px',
        boxShadow: isHovered 
          ? '0 0 60px rgba(0, 212, 255, 0.4), 0 0 120px rgba(0, 212, 255, 0.2)' 
          : '0 10px 40px rgba(0,0,0,0.3)',
        zIndex: isHovered ? 50 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Static image - shown when not hovered */}
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face"
        alt={`Card ${index + 1}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        crossOrigin="anonymous"
      />
      
      {/* Video - shown when hovered */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        muted
        loop
        playsInline
      />
      
      {/* Glow border on hover */}
      <div 
        className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
          isHovered ? 'border-[#00d4ff] shadow-[inset_0_0_30px_rgba(0,212,255,0.3)]' : 'border-transparent'
        }`}
      />
      
      {/* Content overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-white/80 text-sm font-mono">Shortened sequences.</p>
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/30" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/30" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/30" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/30" />
    </div>
  )
}

export function CardsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const transitionContainerRef = useRef<HTMLDivElement>(null)
  const mainCardRef = useRef<HTMLDivElement>(null)
  const gradient1Ref = useRef<HTMLDivElement>(null)
  const gradient2Ref = useRef<HTMLDivElement>(null)
  const finalBgRef = useRef<HTMLDivElement>(null)
  const fourCardsRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !transitionContainerRef.current) return

    const ctx = gsap.context(() => {
      // Create main timeline for the transition
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: transitionContainerRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      })

      // Phase 1: Pause (0% - 20%) - nothing happens, KOIR card just sits there
      // Initial state holds

      // Phase 2: Card moves down, gradient 1 expands from behind (20% - 45%)
      tl.to(mainCardRef.current, {
        y: '25vh',
        duration: 0.25,
        ease: 'power2.inOut'
      }, 0.20)

      // Gradient 1 expands from behind card as it moves
      tl.to(gradient1Ref.current, {
        scale: 5,
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out'
      }, 0.20)

      // Phase 3: Card shrinks and moves to center, gradient 2 expands (45% - 70%)
      tl.to(mainCardRef.current, {
        y: '0vh',
        scale: 0.5,
        duration: 0.25,
        ease: 'power2.inOut'
      }, 0.45)

      // Gradient 2 expands from behind card
      tl.to(gradient2Ref.current, {
        scale: 6,
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out'
      }, 0.45)

      // Gradients fade into dark background
      tl.to([gradient1Ref.current, gradient2Ref.current], {
        opacity: 0,
        duration: 0.15
      }, 0.60)

      // Dark background appears
      tl.to(finalBgRef.current, {
        opacity: 1,
        duration: 0.15
      }, 0.60)

      // Phase 4: Card splits into 4 identical cards (70% - 90%)
      tl.to(mainCardRef.current, {
        opacity: 0,
        scale: 0.3,
        duration: 0.10
      }, 0.70)

      // Four cards appear and spread out
      const cards = fourCardsRef.current?.querySelectorAll('.video-card')
      if (cards) {
        cards.forEach((card, index) => {
          const xOffset = (index - 1.5) * 320 // Spread horizontally
          tl.fromTo(card, {
            x: 0,
            y: 0,
            scale: 0.3,
            opacity: 0,
          }, {
            x: xOffset,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.15,
            ease: 'back.out(1.4)'
          }, 0.72 + index * 0.02)
        })
      }

      // Title appears
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.10,
        ease: 'power2.out'
      }, 0.85)

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="cards"
      className="relative"
    >
      {/* Transition Container - pinned during scroll */}
      <div 
        ref={transitionContainerRef}
        className="relative h-screen overflow-hidden"
      >
        {/* Base background - KOIR purple */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a0dc] via-[#b794d4] to-[#a78bcd]" />

        {/* Gradient 1 - expands from card (purple wave) */}
        <div 
          ref={gradient1Ref}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(180,130,200,1) 0%, rgba(160,110,180,0.9) 40%, rgba(140,90,160,0.7) 60%, transparent 80%)',
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(0)',
          }}
        />

        {/* Gradient 2 - second wave (darker purple transitioning to dark) */}
        <div 
          ref={gradient2Ref}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(100,70,120,1) 0%, rgba(60,40,80,0.9) 40%, rgba(20,20,30,0.8) 70%, transparent 90%)',
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(0)',
          }}
        />

        {/* Final dark background */}
        <div 
          ref={finalBgRef}
          className="absolute inset-0 bg-[#0a0a12] opacity-0"
        />

        {/* Main Character Card - from KOIR, will split into 4 */}
        <div 
          ref={mainCardRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="relative w-[520px] h-[520px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=520&h=520&fit=crop&crop=face"
              alt="Main Character"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-purple-400/20" />
          </div>
        </div>

        {/* Four Video Cards - appear after main card splits */}
        <div 
          ref={fourCardsRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center"
        >
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="absolute">
              <VideoCard index={index} />
            </div>
          ))}
        </div>

        {/* Title - appears at the end */}
        <div 
          ref={titleRef}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-40 text-center opacity-0"
          style={{ transform: 'translateX(-50%) translateY(30px)' }}
        >
          <h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider"
            style={{ 
              background: 'linear-gradient(180deg, #00d4ff 0%, #00ffcc 50%, #00d4ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 60px rgba(0, 212, 255, 0.5)',
            }}
          >
            10,000 UNIQUE DIGITAL COLLECTIBLES
          </h2>
          <p className="mt-4 text-white/60 font-mono text-sm tracking-widest">
            INITIAL COLLECTION - 2026
          </p>
        </div>

        {/* Side navigation dots */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30 hover:bg-white/60 transition-colors cursor-pointer" />
          ))}
        </div>
      </div>
    </section>
  )
}
