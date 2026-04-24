'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CardColor {
  glow: string
  glowRgb: string
  x: number
  title: string
  id: string
  video: string
  image: string
}

const cardColors: CardColor[] = [
  { 
    glow: '#00d4ff', 
    glowRgb: '0, 212, 255', 
    x: -480, 
    title: 'The Nexus Walker', 
    id: 'NW-001', 
    video: '/video/cards/astro.webm',
    image: '/image/cards/Astranauts.webp'
  },
  { 
    glow: '#9945ff', 
    glowRgb: '153, 69, 255', 
    x: -160, 
    title: 'Crystal Guardian', 
    id: 'CG-002', 
    video: '/video/cards/aliens.webm',
    image: '/image/cards/aliens.webp'
  },
  { 
    glow: '#14f195', 
    glowRgb: '20, 241, 149', 
    x: 160, 
    title: 'Flame Keeper', 
    id: 'FK-003', 
    video: '/video/cards/ships.webm',
    image: '/image/cards/FlameKeeper.webp'
  },
  { 
    glow: '#ff6b35', 
    glowRgb: '255, 107, 53', 
    x: 480, 
    title: 'Shadow Weaver', 
    id: 'SW-004', 
    video: '/video/cards/planets.webm',
    image: '/image/cards/ShadowWeaver.webp'
  }
]

export function CardsSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0)
  const [mobileCardIndex, setMobileCardIndex] = useState<number>(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const cardsSectionRef = useRef<HTMLDivElement>(null)
  const splitCardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Адаптивные x координаты для мобильных
  const adaptiveCardColors = cardColors.map((card, index) => ({
    ...card,
    x: isMobile ? 0 : card.x
  }))

  const cardWidth = isMobile ? 260 : 280
  const cardHeight = isMobile ? 480 : 520

  const nextMobileCard = () => {
    setMobileCardIndex((prev) => (prev + 1) % cardColors.length)
    setActiveCardIndex(mobileCardIndex + 1)
  }

  const prevMobileCard = () => {
    setMobileCardIndex((prev) => (prev - 1 + cardColors.length) % cardColors.length)
    setActiveCardIndex(mobileCardIndex - 1)
  }

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

  // GSAP анимация для десктопа
  useEffect(() => {
    if (isMobile || !cardsSectionRef.current) return

    const ctx = gsap.context(() => {
      // Анимация появления карточек
      gsap.fromTo(cardsSectionRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 0.5,
          scrollTrigger: {
            trigger: cardsSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Анимация карточек при скролле
      splitCardsRef.current.forEach((card, i) => {
        if (!card) return
        
        gsap.fromTo(card,
          { 
            opacity: 0, 
            scale: 0.8,
            rotateY: 15
          },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 0.8,
            delay: i * 0.15,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    }, cardsSectionRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <div 
      ref={cardsSectionRef}
      className="relative min-h-screen bg-[#050508] overflow-hidden py-32"
    >
      <div className="w-full h-full flex flex-col items-center justify-center px-4">
        {/* Заголовок секции */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-6 justify-center">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
            <span className="font-mono text-xs text-[#00d4ff] tracking-[1.8em]">CARDS</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
          </div>
        </div>
        
        {isMobile ? (
          // Мобильная версия - карусель
          <>
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
                  border: `2px solid ${adaptiveCardColors[mobileCardIndex].glow}`,
                  boxShadow: `0 0 30px ${adaptiveCardColors[mobileCardIndex].glow}`,
                }}
              >
                <video
                  src={adaptiveCardColors[mobileCardIndex].video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{ background: `radial-gradient(circle at center, ${adaptiveCardColors[mobileCardIndex].glow}40 0%, transparent 80%)` }}
                />
                
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: adaptiveCardColors[mobileCardIndex].glow }} />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: adaptiveCardColors[mobileCardIndex].glow }} />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: adaptiveCardColors[mobileCardIndex].glow }} />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: adaptiveCardColors[mobileCardIndex].glow }} />
                
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono text-[#ff6b35]">ID:</span>
                    <span className="text-[9px] font-mono" style={{ color: adaptiveCardColors[mobileCardIndex].glow }}>{adaptiveCardColors[mobileCardIndex].id}</span>
                  </div>
                  <div className="text-base font-bold text-[#e8e8ec] tracking-wide">{adaptiveCardColors[mobileCardIndex].title}</div>
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
                {adaptiveCardColors.map((_, idx) => (
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
                background: `linear-gradient(135deg, ${adaptiveCardColors[mobileCardIndex].glow}20, ${adaptiveCardColors[mobileCardIndex].glow}05)`,
                border: `1px solid ${adaptiveCardColors[mobileCardIndex].glow}`,
                color: adaptiveCardColors[mobileCardIndex].glow,
                boxShadow: `0 0 15px ${adaptiveCardColors[mobileCardIndex].glow}60`,
              }}
            >
              Explore
            </button>
          </>
        ) : (
          // Десктоп версия - 4 карты
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {adaptiveCardColors.map((cardColor, i) => {
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
                        src={cardColor.image}
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
  )
}