'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { gsap } from 'gsap'
import { TextScramble } from "@/components/ui/text-scramble"

interface MobileMenuProps {
  sections: Array<{ 
    label: string; 
    href: string; 
    id: string;
    isPage?: boolean;
  }>
  onNavigate: (sectionId: string, isPage?: boolean, href?: string) => void
}

export function MobileMenu({ sections, onNavigate }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '')
  const [isScrolling, setIsScrolling] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [backgroundLoaded, setBackgroundLoaded] = useState(true) // По умолчанию true, чтобы не блокировать
  const [preloadedImage, setPreloadedImage] = useState<string | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Определяем мобильное устройство (учитываем поворот)
  useEffect(() => {
    // Используем физическую ширину экрана (не меняется при повороте)
    const physicalWidth = window.screen.width;
    const physicalHeight = window.screen.height;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1;
    
    // Если есть touch И физическая ширина меньше 1024px - это мобильное устройство
    const isMobileDevice = hasTouch && (physicalWidth < 1024 || physicalHeight < 1024);
    
    setIsMobile(isMobileDevice);
  }, []);

  // Предзагрузка изображения при открытии меню
  useEffect(() => {
    if (isMenuOpen) {
      const imageUrl = `/image/${isMobile ? 'menu-mobile.webp' : 'menu.webp'}`
      
      // Если изображение уже предзагружено и совпадает с текущим, не загружаем заново
      if (preloadedImage === imageUrl) {
        setBackgroundLoaded(true)
        return
      }
      
      setBackgroundLoaded(false)
      
      const img = new Image()
      img.src = imageUrl
      img.onload = () => {
        setPreloadedImage(imageUrl)
        setBackgroundLoaded(true)
      }
      img.onerror = () => {
        // Если ошибка загрузки, всё равно показываем меню
        setBackgroundLoaded(true)
      }
    }
  }, [isMenuOpen, isMobile, preloadedImage])

  // Скролл для определения прозрачности кнопки
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Анимация меню (только после загрузки фона)
  useEffect(() => {
    if (menuRef.current && isMenuOpen && backgroundLoaded) {
      gsap.fromTo(menuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      )
      gsap.fromTo(menuRef.current.querySelectorAll('.menu-item'),
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' }
      )
    }
  }, [isMenuOpen, backgroundLoaded])

  // Определение активной секции при скролле
  useEffect(() => {
    const handleScrollDetection = () => {
      const scrollPosition = window.scrollY + 200
      let currentSection = sections[0]?.id || ''

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section.id)
        if (element) {
          const offsetTop = element.offsetTop
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
  }, [activeSection, isScrolling, sections])

  // Очистка таймаута
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Функция навигации
  const handleNavigate = (sectionId: string, isPage?: boolean, href?: string) => {
    if (isPage && href) {
      // Для страниц типа ABOUT и CARGO BAY
      window.location.href = href
      // или если используете Next.js router:
      // router.push(href)
    } else {
      // Для обычных секций на странице
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Процентное позиционирование текста относительно фонового изображения
  const textPosition = isMobile
    ? { left: '22%', top: '15%' }
    : { left: '35%', top: '10%' }

  // Получаем URL фона
  const backgroundImageUrl = `/image/${isMobile ? 'menu-mobile.webp' : 'menu.webp'}`

  return (
    <>
      {/* Кнопка меню */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed z-50 transition-transform duration-300 hover:scale-105 active:scale-95"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        style={
          isMenuOpen
            ? {
                top: isMobile ? '90px' : '24px',
                right: isMobile ? '60px' : '25px',
                width: isMobile ? '60px' : '80px',
                height: isMobile ? '60px' : '80px',
                padding: isMobile ? '8px' : '10px',
                backgroundImage: `url('/image/menuxbutton.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: `url('/images/handarrow.png') 0 0, pointer`,
              }
            : {
                top: isMobile ? '16px' : '24px',
                right: isMobile ? '16px' : '25px',
                width: isMobile ? '60px' : '80px',
                height: isMobile ? '60px' : '80px',
                padding: isMobile ? '8px' : '10px',
                backgroundImage: `url('/image/menubutton.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }
        }
      />

      {/* Full Screen Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="fixed inset-0 z-40"
          style={{
            backgroundImage: backgroundLoaded ? `url(${backgroundImageUrl})` : 'none',
            backgroundColor: !backgroundLoaded ? '#000' : 'transparent',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: backgroundLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          {/* Паттерн поверх фона */}
          <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
          
          {/* Текст с процентным позиционированием - показываем только после загрузки фона */}
          <div 
            className="absolute"
            style={{
              left: textPosition.left,
              top: textPosition.top,
              opacity: backgroundLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            <nav className={`flex flex-col items-start ${isMobile ? 'gap-0' : 'gap-2'}`}>
              {sections.map((section, index) => {
                return (
                  <a
                    key={section.label}
                    href={section.href}
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigate(section.id)
                    }}
                    className={`menu-item group relative py-4 px-8 cursor-pointer ${isScrolling ? 'pointer-events-none opacity-50' : ''}`}
                    style={{ cursor: `url('/images/handarrow.png') 0 0, pointer` }}
                  >
                    <TextScramble 
                      text={section.label.toUpperCase()} 
                      className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide text-black group-hover:text-[#00d4ff] transition-colors duration-300"
                    />
                    
                    {/* Цифры только на ПК */}
                    {!isMobile && (
                      <span className="absolute -left-14 top-1/2 -translate-y-1/2 text-sm font-mono text-[#6b6b7b] group-hover:text-[#00d4ff] transition-colors duration-300">
                        0{index + 1}
                      </span>
                    )}
                  </a>
                )
              })}
            </nav>

            {/* Социальные ссылки */}
            <div 
              className={`${isMobile ? 'flex flex-col items-start gap-3' : 'flex flex-wrap justify-start gap-6'} text-sm text-[#6b6b7b]`}
              style={{ 
                marginTop: isMobile ? '0px' : '40px',
                left: isMobile ? '10%' : '-50%',
                position: 'relative'
              }}
            >
              <a 
                href="https://www.instagram.com/enter.astroverse"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#00d4ff] transition-colors duration-300 flex items-center gap-2 text-black"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <span>Instagram</span>
              </a>
              
              <a 
                href="https://t.me/+MvRVE_AG7Iw2NjQx"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#00d4ff] transition-colors duration-300 flex items-center gap-2 text-black"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.212-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.053-.334-.375-.12l-6.87 4.326-2.96-.924c-.64-.2-.652-.64.133-.954l11.566-4.458c.532-.19.996.128.804.938z"/>
                </svg>
                <span>Telegram</span>
              </a>
            </div>

            {/* Нижний колонтитул - только на ПК */}
            {!isMobile && (
              <div className="flex flex-col md:flex-row justify-start items-start gap-4 text-xs font-mono text-[#6b6b7b] mt-16">
                <div className="flex items-center gap-4">
                  <span>hello@astroverse.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>PRIVACY POLICY</span>
                  <span>|</span>
                  <span>TERMS OF SERVICE</span>
                </div>
              </div>
            )}
          </div>

          {/* Индикатор загрузки (опционально) */}
          {!backgroundLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
    </>
  )
}