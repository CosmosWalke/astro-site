'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const projectData = [
  {
    id: '001',
    title: 'VAPE',
    description: 'A decentralized system designed to protect the last remnants of civilization. The Protocol operates autonomously, guided by ancient algorithms.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=800&fit=crop',
    stats: { nodes: '2,847', uptime: '99.97%', keepers: '28' }
  },
  {
    id: '002',
    title: 'FLOWERS',
    description: 'Fortified sanctuaries scattered across the wasteland. Each Keep houses essential resources and serves as a beacon of hope in the darkness.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop',
    stats: { locations: '12', capacity: '50K', defense: 'MAX' }
  },
  {
    id: '003',
    title: 'PREROLLS',
    description: 'Diverse groups united under the Protocol. Each faction brings unique skills and perspectives to the collective mission of survival.',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&h=800&fit=crop',
    stats: { factions: '7', members: '12.5K', alliance: 'ACTIVE' }
  }
]

export function ProjectSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return

    const cards = cardsRef.current.querySelectorAll('.project-card')

    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { 
          opacity: 0, 
          y: 100,
          rotateX: 15
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Parallax effect on image
      const image = card.querySelector('.card-image')
      if (image) {
        gsap.to(image, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="project"
      className="relative py-32 bg-[#050508] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 circuit-pattern opacity-30" />
      </div>

      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
          <span className="font-mono text-xs text-[#00d4ff] tracking-[0.3em]">SECTION 001</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-center">
          <span className="text-[#e8e8ec]">ASTRO </span>
          <span className="text-[#00d4ff] text-glow-cyan">PRODUCTS</span>
        </h2>
      </div>

      {/* Cards */}
      <div ref={cardsRef} className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="space-y-32">
          {projectData.map((project, index) => (
            <div 
              key={project.id}
              className={`project-card flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-8 lg:gap-16`}
            >
              {/* Image */}
              <div className="relative w-full lg:w-1/2 aspect-[3/4] max-w-md overflow-hidden group">
                {/* Frame */}
                <div className="absolute inset-0 border border-[#1a1a24] z-10 pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00d4ff]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00d4ff]" />
                </div>

                {/* Image container with parallax */}
                <div className="card-image absolute inset-0 scale-110">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent" />

                {/* Scanlines */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.2)_2px,rgba(0,0,0,0.2)_4px)]" />
                </div>

                {/* ID Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="px-3 py-1 bg-[#050508]/80 border border-[#00d4ff]/50 font-mono text-xs text-[#00d4ff]">
                    ID: {project.id}
                  </div>
                </div>

                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#00d4ff] group-hover:w-full transition-all duration-500" />
              </div>

              {/* Content */}
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

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1a1a24]">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-[#00d4ff]">{value}</div>
                      <div className="text-xs font-mono text-[#6b6b7b] uppercase">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button className="group relative inline-flex items-center gap-3 px-6 py-3 bg-transparent border border-[#2a2a38] hover:border-[#00d4ff] transition-colors duration-300">
                  <span className="text-sm font-medium text-[#e8e8ec]">Explore More</span>
                  <svg className="w-4 h-4 text-[#00d4ff] group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative lines */}
      <div className="absolute left-0 top-1/4 w-32 h-px bg-gradient-to-r from-[#00d4ff]/50 to-transparent" />
      <div className="absolute right-0 top-2/3 w-32 h-px bg-gradient-to-l from-[#00d4ff]/50 to-transparent" />
    </section>
  )
}
