'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Menu, X } from 'lucide-react'
import { TextScramble } from "@/components/ui/text-scramble"
import { BackToShipButton } from "@/components/ui/back-to-ship-button";
import AstraButton from "@/components/ui/astra-button";
const navItems = [
  { label: 'Universe', href: '#universe' },
  { label: 'Map', href: '#world' },
  { label: 'Cards', href: '#cards' }, 
  { label: 'Comic', href: '#comic' },
  { label: 'Products', href: '#products' },
  { label: 'Media', href: '#media' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('universe')
  const [isScrolling, setIsScrolling] = useState(false)
  // Случайное начальное значение при загрузке страницы
  const [keeperCount, setKeeperCount] = useState(() => {
    return Math.floor(Math.random() * (1500 - 80 + 1) + 80)
  })
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  // Функция для генерации плавающего числа посетителей
  useEffect(() => {
    // Плавное изменение числа
    const updateKeeperCount = () => {
      // Текущее значение
      const currentCount = keeperCount
      
      // Случайное изменение от -12 до +25 (больше в сторону увеличения)
      const change = Math.floor(Math.random() * 38) - 12 // диапазон -12..25
      
      // Новое значение с ограничением от 80 до 1500
      let newCount = currentCount + change
      
      // Ограничиваем диапазон
      if (newCount < 80) newCount = 80
      if (newCount > 1500) newCount = 1500
      
      // Плавное обновление с анимацией
      const startValue = currentCount
      const endValue = newCount
      const duration = 800 // длительность анимации в мс
      const startTime = performance.now()
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Плавная функция easeOutCubic
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeProgress)
        
        setKeeperCount(currentValue)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
    
    // Интервал обновления от 3 до 10 секунд (случайно)
    let timeoutId: NodeJS.Timeout
    
    const scheduleUpdate = () => {
      const delay = Math.random() * 7000 + 3000 // 3-10 секунд
      timeoutId = setTimeout(() => {
        updateKeeperCount()
        scheduleUpdate()
      }, delay)
    }
    
    scheduleUpdate()
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [keeperCount])

  // Остальной код без изменений...
  const smoothScrollTo = (elementId: string, retryCount = 0) => {
    if (isScrolling && retryCount === 0) return

    const element = document.getElementById(elementId)
    if (!element) {
      if (retryCount < 10) {
        setTimeout(() => smoothScrollTo(elementId, retryCount + 1), 100)
      }
      return
    }

    setIsScrolling(true)
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    setActiveSection(elementId)

    const headerOffset = 80
    
    const performScroll = () => {
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const offsetPosition = rect.top + scrollTop - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      setTimeout(() => {
        const newRect = element.getBoundingClientRect()
        const newOffsetPosition = newRect.top + window.pageYOffset - headerOffset
        const currentScroll = window.pageYOffset
        
        if (Math.abs(currentScroll - newOffsetPosition) > 50 && retryCount < 3) {
          smoothScrollTo(elementId, retryCount + 1)
        }
      }, 500)
    }

    setTimeout(performScroll, 50)

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1000)
  }

  // Скролл для шапки
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Анимация логотипа
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
      )
    }
  }, [])

  // Анимация меню
  useEffect(() => {
    if (menuRef.current && isMenuOpen) {
      gsap.fromTo(menuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      )
      gsap.fromTo(menuRef.current.querySelectorAll('.menu-item'),
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' }
      )
    }
  }, [isMenuOpen])

  // Определение активной секции при скролле
  useEffect(() => {
    const handleScrollDetection = () => {
      const sections = [
        { id: 'universe', element: document.getElementById('universe') },
        { id: 'world', element: document.getElementById('world') },
        { id: 'cards', element: document.getElementById('cards') },
        { id: 'comic', element: document.getElementById('comic') },
        { id: 'products', element: document.getElementById('products') },
        { id: 'media', element: document.getElementById('media') }
      ]

      const scrollPosition = window.scrollY + 200

      let currentSection = 'universe'
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.element) {
          const offsetTop = section.element.offsetTop
          if (scrollPosition >= offsetTop - 100) {
            currentSection = section.id
            break
          }
        }
      }

      if (currentSection !== activeSection && !isScrolling) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScrollDetection)
    setTimeout(handleScrollDetection, 100)
    
    return () => window.removeEventListener('scroll', handleScrollDetection)
  }, [activeSection, isScrolling])

  // Очистка таймаута
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#050508]/90 backdrop-blur-md border-b border-[#1a1a24]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <div ref={logoRef} className="relative group">
              <a 
                href="#universe" 
                onClick={(e) => {
                  e.preventDefault()
                  smoothScrollTo('universe')
                }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 border-2 border-[#00d4ff] flex items-center justify-center relative overflow-hidden group-hover:border-[#ff6b35] transition-colors duration-300">
                    <span className="text-xl font-bold text-[#00d4ff] group-hover:text-[#ff6b35] transition-colors duration-300">A</span>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <span className="text-2xl font-bold tracking-[0.2em] text-[#e8e8ec] hidden md:block">
                  ASTRO
                </span>
              </a>
            </div>

<AstraButton 
  label="BACK TO SHIP" 
  onClick={() => {
    window.location.href = "/";
  }}
/>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => {
                const sectionId = item.href.replace('#', '')
                const isActive = activeSection === sectionId
                
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      smoothScrollTo(sectionId)
                    }}
                    className={`group relative px-6 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-[#00d4ff]' 
                        : 'text-[#6b6b7b] hover:text-[#e8e8ec]'
                    } ${isScrolling ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-[#00d4ff] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                    <span className="absolute -top-1 -right-1 text-[10px] font-mono text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      0{index + 1}
                    </span>
                  </a>
                )
              })}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1a1a24]/50 border border-[#2a2a38]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4ff]" />
                </span>
                <span className="text-xs font-mono text-[#6b6b7b]">
                  {keeperCount.toLocaleString()} Keepers Live
                </span>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-12 h-12 flex items-center justify-center border border-[#2a2a38] hover:border-[#00d4ff] transition-colors duration-300 group"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-[#e8e8ec]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#e8e8ec]" />
                )}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>

        <div className={`border-t border-[#1a1a24] transition-all duration-500 overflow-hidden ${isScrolled ? 'h-0' : 'h-8'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center">
            <div className="flex items-center gap-4 text-xs font-mono text-[#6b6b7b]">
              <span className="text-[#00d4ff]">Encrypted Protocol</span>
              <span>yq24-43335020</span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">ASTRO Mainnet</span>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="fixed inset-0 z-40 bg-[#050508]/98 backdrop-blur-lg overflow-y-auto"
        >
          <div className="absolute inset-0 grid-pattern opacity-20" />
          
          <div className="relative z-10 min-h-full flex flex-col items-center justify-center py-16 px-8">
            <nav className="flex flex-col items-center gap-2 mb-16">
              {navItems.map((item, index) => {
                const sectionId = item.href.replace('#', '')
                const isActive = activeSection === sectionId

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      smoothScrollTo(sectionId)
                      setIsMenuOpen(false)
                    }}
                    className={`menu-item group relative py-4 px-8 cursor-pointer ${isScrolling ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    {isActive ? (
                      <div className="relative inline-block">
                        <span 
                          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide 
                                     bg-[#39ff14] text-black px-8 py-3 rounded-r-3xl inline-block"
                        >
                          {item.label.toUpperCase()}
                        </span>
                        <span className="absolute -top-2 -right-2 text-[9px] font-mono bg-black text-[#39ff14] px-2 py-0.5 tracking-[2px] border border-[#39ff14]/50">
                          PAGE 00{index + 1}
                        </span>
                      </div>
                    ) : (
                      <TextScramble 
                        text={item.label.toUpperCase()} 
                        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-white group-hover:text-[#00d4ff] transition-colors duration-300"
                      />
                    )}

                    <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-sm font-mono text-[#6b6b7b] group-hover:text-[#00d4ff] transition-colors duration-300">
                      0{index + 1}
                    </span>
                    <span className="absolute -right-16 top-1/2 w-12 h-px bg-[#2a2a38] group-hover:bg-[#00d4ff] group-hover:w-24 transition-all duration-300" />
                  </a>
                )
              })}
            </nav>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-[#6b6b7b]">
              <a 
                href="https://www.instagram.com/enter.astroverse"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#00d4ff] transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <span>Instagram</span>
              </a>
              
              <a 
                href="https://x.com/EnterAstroverse"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#00d4ff] transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X (Twitter)</span>
              </a>
              
              <a 
                href="https://www.youtube.com/@enter.astroverse"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#00d4ff] transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-[#6b6b7b]">
              <div className="flex items-center gap-4">
                <span>hello@astroverse.com</span>
              </div>
              <div className="flex items-center gap-4">
                <span>PRIVACY POLICY</span>
                <span>|</span>
                <span>TERMS OF SERVICE</span>
              </div>
            </div>
          </div>

          <div className="absolute top-20 left-8 w-32 h-32 border border-[#1a1a24] opacity-50" />
          <div className="absolute bottom-20 right-8 w-48 h-48 border border-[#1a1a24] opacity-50" />
        </div>
      )}
    </>
  )
}