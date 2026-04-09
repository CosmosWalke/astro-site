'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const factions = [
  {
    id: 'VANGUARD',
    name: 'The Vanguard',
    description: 'Elite warriors who stand at the front lines. Masters of combat and tactical warfare.',
    color: '#00d4ff',
    symbol: 'V',
    members: '3,240',
    status: 'ACTIVE'
  },
  {
    id: 'ARCHITECTS',
    name: 'The Architects',
    description: 'Builders and engineers who construct the Keeps. They shape the physical world.',
    color: '#ff6b35',
    symbol: 'A',
    members: '2,180',
    status: 'ACTIVE'
  },
  {
    id: 'SEEKERS',
    name: 'The Seekers',
    description: 'Explorers and scouts who venture into the unknown. They discover new resources.',
    color: '#9945ff',
    symbol: 'S',
    members: '1,890',
    status: 'ACTIVE'
  },
  {
    id: 'SCRIBES',
    name: 'The Scribes',
    description: 'Keepers of knowledge and history. They preserve the wisdom of the old world.',
    color: '#14f195',
    symbol: 'SC',
    members: '1,450',
    status: 'ACTIVE'
  },
  {
    id: 'WARDENS',
    name: 'The Wardens',
    description: 'Guardians of the Protocol itself. They ensure the system remains uncorrupted.',
    color: '#f5f5f5',
    symbol: 'W',
    members: '890',
    status: 'ELITE'
  }
]

export function FactionsSection() {
  const [activeFaction, setActiveFaction] = useState<string | null>(null)
  const [hoveredFaction, setHoveredFaction] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const items = gridRef.current.querySelectorAll('.faction-card')

    items.forEach((item, index) => {
      gsap.fromTo(item,
        { 
          opacity: 0, 
          scale: 0.9,
          y: 50
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
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
  }, [])

  const handleFactionClick = (id: string) => {
    setActiveFaction(activeFaction === id ? null : id)
  }

  return (
    <section 
      ref={sectionRef}
      id=""
      className="relative py-32 bg-[#050508] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 hex-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
      </div>

      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#ff6b35]/50" />
          <span className="font-mono text-xs text-[#ff6b35] tracking-[0.3em]">SECTION 002</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#ff6b35]/50" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
          <span className="text-[#e8e8ec]">The </span>
          <span className="text-[#ff6b35] text-glow-orange">Factions</span>
        </h2>
        <p className="text-center text-[#6b6b7b] max-w-2xl mx-auto">
          Five distinct groups united under the Protocol. Each faction brings unique strengths to ensure humanitys survival.
        </p>
      </div>

      {/* Factions Grid */}
      <div ref={gridRef} className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factions.map((faction, index) => (
            <div
              key={faction.id}
              className={`faction-card relative group cursor-pointer ${
                index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
              onClick={() => handleFactionClick(faction.id)}
              onMouseEnter={() => setHoveredFaction(faction.id)}
              onMouseLeave={() => setHoveredFaction(null)}
            >
              {/* Card */}
              <div 
                className={`relative h-full min-h-[280px] p-6 bg-[#0a0a0f] border transition-all duration-500 ${
                  activeFaction === faction.id 
                    ? 'border-opacity-100' 
                    : 'border-[#1a1a24] hover:border-opacity-50'
                }`}
                style={{ 
                  borderColor: activeFaction === faction.id || hoveredFaction === faction.id 
                    ? faction.color 
                    : undefined 
                }}
              >
                {/* Symbol Background */}
                <div 
                  className="absolute top-4 right-4 text-8xl font-bold opacity-5 select-none transition-opacity duration-500 group-hover:opacity-10"
                  style={{ color: faction.color }}
                >
                  {faction.symbol}
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 flex items-center justify-center border-2 font-bold text-lg transition-all duration-300"
                      style={{ 
                        borderColor: faction.color,
                        color: faction.color
                      }}
                    >
                      {faction.symbol}
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-xs font-mono"
                        style={{ color: faction.color }}
                      >
                        {faction.status}
                      </div>
                      <div className="text-xs font-mono text-[#6b6b7b]">
                        {faction.members} members
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#e8e8ec] mb-2">
                    {faction.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#6b6b7b] leading-relaxed flex-1">
                    {faction.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-[#1a1a24]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#6b6b7b]">
                        ID: {faction.id}
                      </span>
                      <div 
                        className="flex items-center gap-2 text-xs font-medium transition-colors duration-300"
                        style={{ color: faction.color }}
                      >
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
                </div>

                {/* Corner Decorations */}
                <div 
                  className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 transition-colors duration-300"
                  style={{ borderColor: hoveredFaction === faction.id ? faction.color : '#1a1a24' }}
                />
                <div 
                  className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 transition-colors duration-300"
                  style={{ borderColor: hoveredFaction === faction.id ? faction.color : '#1a1a24' }}
                />
                <div 
                  className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 transition-colors duration-300"
                  style={{ borderColor: hoveredFaction === faction.id ? faction.color : '#1a1a24' }}
                />
                <div 
                  className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 transition-colors duration-300"
                  style={{ borderColor: hoveredFaction === faction.id ? faction.color : '#1a1a24' }}
                />

                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center, ${faction.color}10 0%, transparent 70%)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mt-20">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-8 border-t border-b border-[#1a1a24]">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00d4ff]">5</div>
            <div className="text-xs font-mono text-[#6b6b7b] uppercase">Factions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ff6b35]">9,650</div>
            <div className="text-xs font-mono text-[#6b6b7b] uppercase">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#14f195]">100%</div>
            <div className="text-xs font-mono text-[#6b6b7b] uppercase">Alliance Status</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#9945ff]">ACTIVE</div>
            <div className="text-xs font-mono text-[#6b6b7b] uppercase">Protocol Status</div>
          </div>
        </div>
      </div>
    </section>
  )
}
