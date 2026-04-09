'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const projectData = [
  {
    id: '001',
    title: 'VAPE',
    description: 'Our dual-tank inhale-activated system features a digital screen on the front panel to allow the customers to have a more simplified and smooth experience. It will display our brand logo, provide what strain your are hitting and puff count. Simply inhale to activate and press button to alternate between flavors, its that simple.',
    image: '/image/vape.webp',
    stats: { FLAVORS: '20', uptime: '99.97%', keepers: '28' }
  },
  {
    id: '002',
    title: 'FLOWERS',
    description: 'NEW ASTRO FUEL. EVERY UNIVERSAL RATION PACK IS EQUIPPED WITH A DARK MATTER QUAD INFUSED PREROLL',
    image: '/image/flowers.webp',
    stats: { FLAVORS: '8', capacity: '50K', defense: 'MAX' }
  },
  {
    id: '003',
    title: 'PREROLLS',
    description: 'Diverse groups united under the Protocol. Each faction brings unique skills and perspectives to the collective mission of survival.',
    image: '/image/prerolls.webp',
    stats: { factions: '7', members: '12.5K', alliance: 'ACTIVE' }
  }
]

export function ProjectSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())

  // Анимация появления карточек с помощью Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = Number(entry.target.getAttribute('data-index'))
          
          if (entry.isIntersecting && !visibleCards.has(cardId)) {
            // Добавляем карточку в видимые
            setVisibleCards(prev => new Set([...prev, cardId]))
            
            // Дополнительная анимация с GSAP для более плавного эффекта
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              clearProps: 'all'
            })
          }
        })
      },
      {
        threshold: 0.15, // 15% видимости достаточно для появления
        rootMargin: '50px 0px 50px 0px' // Немного提前触发 для плавности
      }
    )

    // Наблюдаем за всеми карточками
    const cards = document.querySelectorAll('.project-card')
    cards.forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
    }
  }, [visibleCards])

  // Предзагрузка изображений для плавности
  useEffect(() => {
    const preloadImages = () => {
      projectData.forEach((project) => {
        const img = new Image()
        img.src = project.image
      })
    }
    preloadImages()
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="products"
      className="relative py-32 bg-[#050508] overflow-hidden"
    >
      {/* Фоновые эффекты */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 circuit-pattern opacity-30" />
      </div>

      {/* Заголовок секции */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
          <span className="font-mono text-xs text-[#00d4ff] tracking-[0.3em]">SECTION 001</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
          <span className="text-[#e8e8ec]">ASTRO </span>
          <span className="text-[#00d4ff] text-glow-cyan">PRODUCTS</span>
        </h2>
        <p className="text-center text-[#6b6b7b] max-w-2xl mx-auto">
          Welcome to Astro Universe — where we take your experience to a whole new dimension. 
          Our premium cannabis products are crafted to launch your mind, body, and spirit into the cosmos. 
          Get ready to explore bold flavors, stellar highs, and an otherworldly vibe. The universe is vast, 
          and your journey is just beginning. Buckle up — it's time to elevate with Astro Universe!
        </p>
      </div>

      {/* Карточки продуктов */}
      <div ref={cardsRef} className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="space-y-32">
          {projectData.map((project, index) => (
            <div 
              key={project.id}
              data-index={index}
              className={`project-card flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-8 lg:gap-16 transition-all duration-700 ${
                visibleCards.has(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{
                opacity: visibleCards.has(index) ? 1 : 0,
                transform: visibleCards.has(index) ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
              }}
            >
              {/* Изображение продукта */}
              <div className="relative w-full lg:w-1/2 aspect-[3/4] max-w-md overflow-hidden group">
                {/* Рамка с углами */}
                <div className="absolute inset-0 border border-[#1a1a24] z-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00d4ff]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00d4ff]" />
                </div>

                {/* Изображение */}
                <div className="card-image absolute inset-0">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
                    style={{ 
                      objectPosition: 'center',
                      willChange: 'transform'
                    }}
                  />
                </div>

                {/* Градиентный оверлей */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent" />

                {/* Текстура */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)]" />
                </div>

                {/* ID продукта */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1 bg-[#050508]/80 border border-[#00d4ff]/50 font-mono text-xs text-[#00d4ff]">
                    ID: {project.id}
                  </div>
                </div>

                {/* Нижняя линия при ховере */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#00d4ff] group-hover:w-full transition-all duration-500" />
              </div>

              {/* Информация о продукте */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="font-mono text-xs text-[#6b6b7b] tracking-wider">
                  PROTOCOL / {project.id}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-[#e8e8ec]">
                  {project.title}
                </h3>
                
                <p className="text-[#6b6b7b] text-lg leading-relaxed">
                  {project.description}
                </p>

                {/* Статистика */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1a1a24]">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-[#00d4ff]">{value}</div>
                      <div className="text-xs font-mono text-[#6b6b7b] uppercase">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Кнопка Explore More */}
                <button className="group relative inline-flex items-center gap-3 px-6 py-3 bg-transparent border border-[#2a2a38] hover:border-[#00d4ff] transition-colors duration-300">
                  <span className="text-sm font-medium text-[#e8e8ec]">Explore More</span>
                  <svg className="w-4 h-4 text-[#00d4ff] group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Декоративные линии */}
      <div className="absolute left-0 top-1/4 w-32 h-px bg-gradient-to-r from-[#00d4ff]/50 to-transparent" />
      <div className="absolute right-0 top-2/3 w-32 h-px bg-gradient-to-l from-[#00d4ff]/50 to-transparent" />
    </section>
  )
}