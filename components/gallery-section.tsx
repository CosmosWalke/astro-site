'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const galleryItems = [
  {
    id: 1,
    title: 'Genesis Event',
    category: 'ARCHIVE',
    date: '2024.01.15',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop',
    featured: true
  },
  {
    id: 2,
    title: 'Protocol Activation',
    category: 'JOURNAL',
    date: '2024.02.22',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=800&fit=crop',
    featured: false
  },
  {
    id: 3,
    title: 'The First Keep',
    category: 'MEDIA',
    date: '2024.03.08',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=800&fit=crop',
    featured: false
  },
  {
    id: 4,
    title: 'Faction Assembly',
    category: 'ARCHIVE',
    date: '2024.04.01',
    image: 'https://images.unsplash.com/photo-1484589065579-248aad0d628b?w=800&h=600&fit=crop',
    featured: true
  },
  {
    id: 5,
    title: 'Wasteland Expedition',
    category: 'JOURNAL',
    date: '2024.05.17',
    image: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=600&h=800&fit=crop',
    featured: false
  },
  {
    id: 6,
    title: 'Neural Link Test',
    category: 'MEDIA',
    date: '2024.06.30',
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&h=800&fit=crop',
    featured: false
  }
]

export function GallerySection() {
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('ALL')
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const filters = ['ALL', 'ARCHIVE', 'JOURNAL', 'MEDIA']

  const filteredItems = filter === 'ALL' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter)

  useEffect(() => {
    if (!gridRef.current) return

    const items = gridRef.current.querySelectorAll('.gallery-item')

    items.forEach((item, index) => {
      gsap.fromTo(item,
        { 
          opacity: 0, 
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [filteredItems])

  return (
    <section 
      ref={sectionRef}
      id="gallery"
      className="relative py-32 bg-[#050508] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.03)_0%,transparent_60%)]" />
        <div className="absolute inset-0 circuit-pattern opacity-20" />
      </div>

      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#ff6b35]/50" />
          <span className="font-mono text-xs text-[#ff6b35] tracking-[0.3em]">SECTION 004</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#ff6b35]/50" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
          <span className="text-[#e8e8ec]">The </span>
          <span className="text-[#ff6b35] text-glow-orange">Gallery</span>
        </h2>
        <p className="text-center text-[#6b6b7b] max-w-2xl mx-auto mb-8">
          Visual archives from the Protocol. Documented moments from our journey.
        </p>

        {/* Filters */}
        <div className="flex justify-center gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-mono transition-all duration-300 ${
                filter === f
                  ? 'bg-[#ff6b35] text-[#050508]'
                  : 'bg-transparent border border-[#2a2a38] text-[#6b6b7b] hover:border-[#ff6b35] hover:text-[#ff6b35]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div ref={gridRef} className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`gallery-item group relative cursor-pointer ${
                item.featured ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
            >
              {/* Card */}
              <div className={`relative overflow-hidden bg-[#0a0a0f] border border-[#1a1a24] group-hover:border-[#ff6b35]/50 transition-colors duration-500 ${
                item.featured ? 'aspect-video md:aspect-[16/10]' : 'aspect-[4/5]'
              }`}>
                {/* Image */}
                <div className="absolute inset-0">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    crossOrigin="anonymous"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                </div>

                {/* Scanlines */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
                  <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-1 bg-[#050508]/80 border border-[#ff6b35]/30 text-xs font-mono text-[#ff6b35]">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono text-[#6b6b7b]">
                      {item.date}
                    </span>
                  </div>

                  {/* Bottom */}
                  <div>
                    <h3 className={`font-bold text-[#e8e8ec] mb-2 group-hover:text-[#ff6b35] transition-colors duration-300 ${
                      item.featured ? 'text-2xl md:text-3xl' : 'text-lg'
                    }`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#6b6b7b] group-hover:text-[#ff6b35] transition-colors duration-300">
                      <span>View Details</span>
                      <svg 
                        className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#ff6b35]/0 group-hover:border-[#ff6b35]/50 transition-colors duration-300" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#ff6b35]/0 group-hover:border-[#ff6b35]/50 transition-colors duration-300" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#ff6b35]/0 group-hover:border-[#ff6b35]/50 transition-colors duration-300" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#ff6b35]/0 group-hover:border-[#ff6b35]/50 transition-colors duration-300" />

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#ff6b35] group-hover:w-full transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More Button */}
      <div className="relative z-10 flex justify-center mt-12">
        <button className="group relative px-8 py-3 bg-transparent border border-[#2a2a38] hover:border-[#ff6b35] transition-colors duration-300">
          <span className="text-sm font-medium text-[#e8e8ec]">Load More Archives</span>
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </section>
  )
}
