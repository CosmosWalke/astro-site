'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextScramble } from "@/components/ui/text-scramble"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const worldLocations = [
  {
    id: 'NEXUS',
    name: 'The Nexus',
    description: 'Central hub of the Protocol. All data flows through this ancient structure.',
    coordinates: { x: 50, y: 40 },
    type: 'CORE',
    status: 'ONLINE'
  },
  {
    id: 'CITADEL',
    name: 'Northern Citadel',
    description: 'A fortress of ice and steel. Home to the Vanguard training grounds.',
    coordinates: { x: 30, y: 20 },
    type: 'KEEP',
    status: 'ONLINE'
  },
  {
    id: 'ARCHIVE',
    name: 'The Archive',
    description: 'Repository of all human knowledge. Guarded by the Scribes.',
    coordinates: { x: 70, y: 30 },
    type: 'VAULT',
    status: 'SECURE'
  },
  {
    id: 'WASTELAND',
    name: 'Eastern Wasteland',
    description: 'Dangerous territory filled with remnants of the old world.',
    coordinates: { x: 80, y: 60 },
    type: 'ZONE',
    status: 'HOSTILE'
  },
  {
    id: 'FORGE',
    name: 'The Forge',
    description: 'Industrial center where the Architects create and innovate.',
    coordinates: { x: 20, y: 65 },
    type: 'FACILITY',
    status: 'ACTIVE'
  },
  {
    id: 'HAVEN',
    name: 'Southern Haven',
    description: 'A sanctuary for civilians. The last bastion of normal life.',
    coordinates: { x: 55, y: 75 },
    type: 'SETTLEMENT',
    status: 'PROTECTED'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ONLINE':
    case 'ACTIVE':
      return '#00d4ff'
    case 'SECURE':
    case 'PROTECTED':
      return '#14f195'
    case 'HOSTILE':
      return '#ff6b35'
    default:
      return '#6b6b7b'
  }
}

export function MapSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeLocation, setActiveLocation] = useState<string | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [mobileLocationIndex, setMobileLocationIndex] = useState<number>(0)
  
  const sectionRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Анимация появления карты
  useEffect(() => {
    if (!mapRef.current) return
    
    gsap.fromTo(mapRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: mapRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const nextMobileLocation = () => {
    setMobileLocationIndex((prev) => (prev + 1) % worldLocations.length)
    setActiveLocation(worldLocations[(mobileLocationIndex + 1) % worldLocations.length].id)
  }

  const prevMobileLocation = () => {
    setMobileLocationIndex((prev) => (prev - 1 + worldLocations.length) % worldLocations.length)
    setActiveLocation(worldLocations[(mobileLocationIndex - 1 + worldLocations.length) % worldLocations.length].id)
  }

  const activeLocationData = activeLocation 
    ? worldLocations.find(l => l.id === activeLocation)
    : null

  return (
    <section 
      ref={sectionRef}
      id="world"
      className="relative min-h-screen py-16 md:py-32 overflow-hidden bg-[#050508]"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className="flex items-center gap-4 mb-6 justify-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
          <span className="font-mono text-xs text-[#00d4ff] tracking-[0.3em]">
            &gt; SECTION_003
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-center">
          <span className="text-[#e8e8ec]">ASTROUNIVERSE </span>
          <span className="text-[#00d4ff]">MAP</span>
        </h2>
        <p className="text-center text-[#6b6b7b] text-sm mt-4 max-w-md mx-auto">
          Explore the open and explored territories of ASTROUNIVERSE
        </p>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full items-start">
          {/* КАРТА */}
          <div 
            ref={mapRef}
            className="relative flex-1 w-full overflow-hidden rounded-xl"
            style={{ minHeight: isMobile ? '400px' : '450px' }}
          >
            <img 
              src="/image/map.webp"
              alt="World Map"
              className="w-full h-full object-cover rounded-xl"
            />
            
            {/* Линии между точками */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {worldLocations.map((loc, i) => {
                const nextLoc = worldLocations[(i + 1) % worldLocations.length]
                return (
                  <g key={`line-${i}`}>
                    <line
                      x1={loc.coordinates.x}
                      y1={loc.coordinates.y}
                      x2={nextLoc.coordinates.x}
                      y2={nextLoc.coordinates.y}
                      stroke="#00d4ff"
                      strokeWidth={isMobile ? "0.8" : "0.6"}
                      strokeOpacity="0.5"
                      strokeDasharray="3 3"
                    />
                  </g>
                )
              })}
              <line x1="50" y1="40" x2="30" y2="20" stroke="#ff006e" strokeWidth={isMobile ? "0.8" : "0.6"} strokeOpacity="0.5" strokeDasharray="3 3" />
              <line x1="50" y1="40" x2="70" y2="30" stroke="#9d4edd" strokeWidth={isMobile ? "0.8" : "0.6"} strokeOpacity="0.5" strokeDasharray="3 3" />
              <line x1="50" y1="40" x2="80" y2="60" stroke="#00d4ff" strokeWidth={isMobile ? "0.8" : "0.6"} strokeOpacity="0.5" strokeDasharray="3 3" />
              <line x1="50" y1="40" x2="20" y2="65" stroke="#ff006e" strokeWidth={isMobile ? "0.8" : "0.6"} strokeOpacity="0.5" strokeDasharray="3 3" />
              <line x1="50" y1="40" x2="55" y2="75" stroke="#9d4edd" strokeWidth={isMobile ? "0.8" : "0.6"} strokeOpacity="0.5" strokeDasharray="3 3" />
            </svg>

            {/* Точки */}
            {worldLocations.map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`
                }}
                onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                onMouseEnter={() => setHoveredLocation(location.id)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: getStatusColor(location.status), animationDuration: '2s' }}
                />
                <div 
                  className={`relative w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-300 ${
                    activeLocation === location.id ? 'scale-150' : 'group-hover:scale-125'
                  }`}
                  style={{ 
                    borderColor: getStatusColor(location.status),
                    backgroundColor: activeLocation === location.id ? getStatusColor(location.status) : 'transparent'
                  }}
                />
                {(hoveredLocation === location.id && activeLocation !== location.id && !isMobile) && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-black/90 border border-[#00d4ff] whitespace-nowrap z-10 rounded">
                    <div className="text-xs font-medium text-[#e8e8ec]">{location.name}</div>
                    <div className="text-xs font-mono" style={{ color: getStatusColor(location.status) }}>{location.status}</div>
                  </div>
                )}
              </div>
            ))}

            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00d4ff]/50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00d4ff]/50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00d4ff]/50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00d4ff]/50" />
            
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#050508]/80 rounded-full">
              <span className="font-mono text-xs text-[#00d4ff]">ASTRO PROTOCOL NETWORK MAP v2.4</span>
            </div>
          </div>

          {/* ПАНЕЛЬ С ОПИСАНИЕМ И КНОПКОЙ */}
          <div className="w-full lg:w-80 space-y-4">
            {/* КНОПКА EXPLORE MAP */}
            <a 
              href="/galaxy-map-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <button className="w-full py-3 bg-gradient-to-r from-[#00d4ff]/10 to-[#ff006e]/10 border border-[#00d4ff] rounded-lg hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all duration-300 group">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-[#00d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <TextScramble 
                    text="EXPLORE MAP" 
                    className="text-xs font-mono font-bold tracking-wider text-[#00d4ff] leading-none" 
                  />
                  <svg className="w-4 h-4 text-[#00d4ff] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </a>

            {/* Описание локации */}
            {activeLocationData ? (
              <div className="relative p-4 md:p-6 bg-black/80 backdrop-blur-md border border-[#00d4ff]/40 rounded-xl">
                {isMobile && (
                  <div className="flex justify-between items-center mb-3">
                    <button
                      onClick={prevMobileLocation}
                      className="w-8 h-8 bg-[#0a0a0f] border border-[#1a1a24] rounded-full flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#00d4ff]" />
                    </button>
                    <span className="text-[10px] font-mono text-[#00d4ff]">
                      {mobileLocationIndex + 1}/{worldLocations.length}
                    </span>
                    <button
                      onClick={nextMobileLocation}
                      className="w-8 h-8 bg-[#0a0a0f] border border-[#1a1a24] rounded-full flex items-center justify-center"
                    >
                      <ChevronRight className="w-4 h-4 text-[#00d4ff]" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 text-[10px] font-mono rounded bg-[#00d4ff]/20 text-[#00d4ff]">
                    {activeLocationData.type}
                  </span>
                  <span className="text-[10px] font-mono text-[#00d4ff]">
                    {activeLocationData.status}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#e8e8ec] mb-2">{activeLocationData.name}</h3>
                <p className="text-xs md:text-sm text-[#6b6b7b] mb-3">{activeLocationData.description}</p>
                <div className="pt-3 border-t border-[#00d4ff]/20">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#6b6b7b]">COORDINATES</span>
                    <span className="text-[#00d4ff]">{activeLocationData.coordinates.x}, {activeLocationData.coordinates.y}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 md:p-6 bg-black/80 backdrop-blur-md border border-[#1a1a24] text-center rounded-xl">
                <div className="text-[#6b6b7b] text-xs mb-2">Select a location on the map</div>
                <div className="font-mono text-[10px] text-[#00d4ff]">{worldLocations.length} LOCATIONS AVAILABLE</div>
              </div>
            )}

            {/* Список локаций (только десктоп) */}
            {!isMobile && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {worldLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                    className={`w-full flex items-center justify-between p-3 border transition-all duration-300 rounded ${
                      activeLocation === location.id 
                        ? 'bg-[#00d4ff]/10 border-[#00d4ff]' 
                        : 'bg-black/40 border-[#1a1a24] hover:border-[#00d4ff]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(location.status) }} />
                      <span className="text-xs text-[#e8e8ec]">{location.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#6b6b7b]">{location.id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}