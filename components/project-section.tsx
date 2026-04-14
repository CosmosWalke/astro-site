'use client'

import { useEffect, useRef, memo } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'

const projectData = [
  {
    id: '001',
    title: 'VAPE',
    description: 'Our dual-tank inhale-activated system features a digital screen on the front panel to allow the customers to have a more simplified and smooth experience. It will display our brand logo, provide what strain your are hitting and puff count. Simply inhale to activate and press button to alternate between flavors, its that simple.',
    image: '/image/vape.webp',
    stats: { FLAVORS: '20', MASTERBOX: '50 PCS', QUALITY: 'BEST' },
    slug: '/vape'
  },
  {
    id: '002',
    title: 'FLOWERS',
    description: 'NEW ASTRO FUEL. EVERY UNIVERSAL RATION PACK IS EQUIPPED WITH A DARK MATTER QUAD INFUSED PREROLL',
    image: '/image/flowers.webp',
    stats: { FLAVORS: '20', MASTERBOX: '64 PCS', defense: 'MAX' },
    slug: '/flowers'
  },
  {
    id: '003',
    title: 'PREROLLS',
    description: 'Quad Infuse Dark Matter Preroll Experience a supernova of flavor and potency, featuring a perfect fusion of premium flower strains.Features:6x0.75g (4.5g total)Ice Water Bubble HashLive Resin infusedNatural Terpenes.reat Taste, Extra Strength',
    image: '/image/prerolls.webp',
    stats: { FLAVORS: '10', MASTERBOX: '50 PCS', QUALITY: 'BEST' },
    slug: '/prerolls'
  }
]

// Компонент кнопки с memo
const ExploreMoreButton = memo(({ slug }: { slug: string }) => {
  const buttonContent = (
    <button className="group relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-transparent border border-[#2a2a38] hover:border-[#00d4ff] transition-colors duration-300">
      <span className="text-xs sm:text-sm font-medium text-[#e8e8ec]">Explore More</span>
      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#00d4ff] group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
      <div className="absolute top-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-t border-l border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 border-b border-r border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  )

  if (slug && slug !== '/prerolls') {
    return <Link href={slug}>{buttonContent}</Link>
  }
  return buttonContent
})

ExploreMoreButton.displayName = 'ExploreMoreButton'

// Карточка продукта с memo
const ProductCard = memo(({ 
  project, 
  index 
}: { 
  project: typeof projectData[0]; 
  index: number;
}) => {
  return (
    <div 
      className={`product-card flex flex-col ${
        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } items-start gap-6 sm:gap-8 lg:gap-16`}
      data-index={index}
    >
      {/* Изображение продукта */}
      <div className="relative w-full lg:w-1/2 overflow-hidden group">
        <div className="relative inline-block w-full">
          <img 
            src={project.image}
            alt={project.title}
            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
          />

          {/* Рамка с углами */}
          <div className="absolute inset-0 border border-[#1a1a24] z-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 md:w-8 border-t-2 border-l-2 border-[#00d4ff]" />
            <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 md:w-8 border-t-2 border-r-2 border-[#00d4ff]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 sm:w-6 md:w-8 border-b-2 border-l-2 border-[#00d4ff]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 md:w-8 border-b-2 border-r-2 border-[#00d4ff]" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent pointer-events-none" />
          
          <div className="absolute top-2 left-2 sm:top-3 md:top-4 sm:left-3 md:left-4 z-20">
            <div className="px-1.5 py-0.5 sm:px-2 md:px-3 sm:py-1 bg-[#050508]/80 border border-[#00d4ff]/50 font-mono text-[9px] sm:text-[10px] md:text-xs text-[#00d4ff] whitespace-nowrap">
              ID: {project.id}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-[#00d4ff] group-hover:w-full transition-all duration-500 pointer-events-none" />
        </div>
      </div>

      {/* Информация о продукте */}
      <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
        <div className="font-mono text-[10px] sm:text-xs text-[#6b6b7b] tracking-wider">
          PROTOCOL / {project.id}
        </div>
        
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e8e8ec]">
          {project.title}
        </h3>
        
        <p className="text-[#6b6b7b] text-sm sm:text-base md:text-lg leading-relaxed">
          {project.description}
        </p>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-[#1a1a24]">
          {Object.entries(project.stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#00d4ff]">{value}</div>
              <div className="text-[9px] sm:text-[10px] md:text-xs font-mono text-[#6b6b7b] uppercase">{key}</div>
            </div>
          ))}
        </div>

        <ExploreMoreButton slug={project.slug} />
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export function ProjectSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isAnimatedRef = useRef<Set<Element>>(new Set())

  // Оптимизированный IntersectionObserver - без зависимостей!
  useEffect(() => {
    // Убеждаемся, что DOM готов
    if (!containerRef.current) return

    // Создаем observer один раз
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Проверяем, что элемент видим и еще не анимирован
          if (entry.isIntersecting && !isAnimatedRef.current.has(entry.target)) {
            // Добавляем в Set анимированных
            isAnimatedRef.current.add(entry.target)
            
            // Запускаем анимацию GSAP
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out'
            })
            
            // Отключаем наблюдение за этим элементом
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '80px 0px 80px 0px'
      }
    )

    // Находим все карточки внутри контейнера и устанавливаем начальное состояние
    const cards = containerRef.current.querySelectorAll('.product-card')
    
    // Устанавливаем начальные стили через GSAP (без CSS классов)
    gsap.set(cards, { 
      opacity: 0, 
      y: 40 
    })
    
    // Начинаем наблюдение
    cards.forEach((card) => {
      observerRef.current?.observe(card)
    })

    // Очистка
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      isAnimatedRef.current.clear()
    }
  }, []) // Пустой массив зависимостей

  return (
    <section 
      ref={sectionRef}
      id="products"
      className="relative py-16 sm:py-24 lg:py-32 bg-[#050508] overflow-hidden"
    >
      {/* Фоновые эффекты */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Заголовок секции */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
          <span className="font-mono text-[10px] sm:text-xs text-[#00d4ff] tracking-[0.2em] sm:tracking-[0.3em]">SECTION 001</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4">
          <span className="text-[#e8e8ec]">ASTRO </span>
          <span className="text-[#00d4ff]">PRODUCTS</span>
        </h2>
        <p className="text-center text-[#6b6b7b] text-sm sm:text-base max-w-2xl mx-auto px-4">
          Welcome to Astro Universe — where we take your experience to a whole new dimension. 
          Our premium cannabis products are crafted to launch your mind, body, and spirit into the cosmos. 
          Get ready to explore bold flavors, stellar highs, and an otherworldly vibe. The universe is vast, 
          and your journey is just beginning. Buckle up — it's time to elevate with Astro Universe!
        </p>
      </div>

      {/* Карточки продуктов */}
      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="space-y-16 sm:space-y-24 lg:space-y-32">
          {projectData.map((project, index) => (
            <ProductCard 
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Декоративные линии */}
      <div className="absolute left-0 top-1/4 w-16 sm:w-24 lg:w-32 h-px bg-gradient-to-r from-[#00d4ff]/50 to-transparent" />
      <div className="absolute right-0 top-2/3 w-16 sm:w-24 lg:w-32 h-px bg-gradient-to-l from-[#00d4ff]/50 to-transparent" />
    </section>
  )
}