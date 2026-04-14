'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Location {
  id: string
  name: string
  description: string
  coordinates: { x: number; y: number; ring: number }
  type: string
  status: string
}

const worldLocations: Location[] = [
  {
    id: 'NEXUS',
    name: 'The Nexus',
    description: 'Central hub of the Protocol. All data flows through this ancient structure.',
    coordinates: { x: 50, y: 40, ring: 1 },
    type: 'CORE',
    status: 'ONLINE'
  },
  {
    id: 'CITADEL',
    name: 'Northern Citadel',
    description: 'A fortress of ice and steel. Home to the Vanguard training grounds.',
    coordinates: { x: 30, y: 20, ring: 2 },
    type: 'KEEP',
    status: 'ONLINE'
  },
  {
    id: 'ARCHIVE',
    name: 'The Archive',
    description: 'Repository of all human knowledge. Guarded by the Scribes.',
    coordinates: { x: 70, y: 30, ring: 2 },
    type: 'VAULT',
    status: 'SECURE'
  },
  {
    id: 'WASTELAND',
    name: 'Eastern Wasteland',
    description: 'Dangerous territory filled with remnants of the old world.',
    coordinates: { x: 80, y: 60, ring: 3 },
    type: 'ZONE',
    status: 'HOSTILE'
  },
  {
    id: 'FORGE',
    name: 'The Forge',
    description: 'Industrial center where the Architects create and innovate.',
    coordinates: { x: 20, y: 65, ring: 3 },
    type: 'FACILITY',
    status: 'ACTIVE'
  },
  {
    id: 'HAVEN',
    name: 'Southern Haven',
    description: 'A sanctuary for civilians. The last bastion of normal life.',
    coordinates: { x: 55, y: 75, ring: 3 },
    type: 'SETTLEMENT',
    status: 'PROTECTED'
  }
]

export function WorldSection() {
  const [activeLocation, setActiveLocation] = useState<string | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [glitchText, setGlitchText] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

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

    const markers = mapRef.current.querySelectorAll('.location-marker')
    markers.forEach((marker, index) => {
      gsap.fromTo(marker,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.3 + index * 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })

    const glitchInterval = setInterval(() => {
      setGlitchText(true)
      setTimeout(() => setGlitchText(false), 150)
    }, 5000)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
      clearInterval(glitchInterval)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
      case 'ACTIVE':
        return '#00d4ff'
      case 'SECURE':
      case 'PROTECTED':
        return '#14f195'
      case 'HOSTILE':
        return '#ff006e'
      default:
        return '#8b8b9b'
    }
  }

  const getRingColor = (ring: number) => {
    switch (ring) {
      case 1: return '#00d4ff'
      case 2: return '#ff006e'
      case 3: return '#9d4edd'
      default: return '#8b8b9b'
    }
  }

  const activeLocationData = activeLocation 
    ? worldLocations.find(l => l.id === activeLocation)
    : null

  return (
    <section 
      ref={sectionRef}
      id="world"
      className="relative min-h-screen py-32"
      style={{ 
        background: '#050508',
      }}
    >
      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <div className="flex items-center gap-4 mb-6 justify-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#ff006e]/50" />
          <span className={`font-mono text-xs text-[#00d4ff] tracking-[0.3em] ${glitchText ? 'animate-glitch' : ''}`}>
            &gt; SECTION_003
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#ff006e]/50" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
          <span className="text-[#e8e8ec]">The </span>
          <span className="text-[#00d4ff] text-glow-cyan" style={{ textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff' }}>Network</span>
        </h2>
        <p className="text-center text-[#8b8b9b] max-w-2xl mx-auto font-mono text-sm">
          <span className="text-[#00d4ff]">{'>'}</span> ACCESSING PROTOCOL NODES <span className="text-[#ff006e]">_</span>
        </p>
      </div>

      {/* Interactive Map */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map с фоновым изображением - БЕЗ ВСЯКИХ СЕТОК И ФОНОВ */}
          <div 
            ref={mapRef}
            className="relative flex-1 aspect-square overflow-hidden rounded-xl shadow-[0_0_30px_rgba(0,212,255,0.2)]"
          >
            {/* Фоновое изображение карты - ЕДИНСТВЕННЫЙ ФОН */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src="/image/map.webp"
                alt="World Map"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', e)
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            {/* Data Connections - линии между точками */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {worldLocations.map((loc, i) => {
                const nextLoc = worldLocations[(i + 1) % worldLocations.length]
                return (
                  <g key={`connection-${i}`}>
                    <line
                      x1={loc.coordinates.x}
                      y1={loc.coordinates.y}
                      x2={nextLoc.coordinates.x}
                      y2={nextLoc.coordinates.y}
                      stroke="#00d4ff"
                      strokeWidth="1"
                      strokeOpacity="0.6"
                      strokeDasharray="3 4"
                    />
                  </g>
                )
              })}
              {/* Центральные соединения */}
              <line x1="50" y1="40" x2="30" y2="20" stroke="#ff006e" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 4" />
              <line x1="50" y1="40" x2="70" y2="30" stroke="#9d4edd" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 4" />
              <line x1="50" y1="40" x2="80" y2="60" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 4" />
              <line x1="50" y1="40" x2="20" y2="65" stroke="#ff006e" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 4" />
              <line x1="50" y1="40" x2="55" y2="75" stroke="#9d4edd" strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 4" />
            </svg>

            {/* Location Markers - точки */}
            {worldLocations.map((location) => (
              <div
                key={location.id}
                className="location-marker absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`
                }}
                onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                onMouseEnter={() => setHoveredLocation(location.id)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                {/* Pulse Ring */}
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-60"
                  style={{ 
                    backgroundColor: getStatusColor(location.status),
                    animationDuration: '1.5s'
                  }}
                />
                
                {/* Node Marker */}
                <div 
                  className={`relative transition-all duration-300 flex items-center justify-center ${
                    activeLocation === location.id ? 'scale-150' : 'group-hover:scale-125'
                  }`}
                >
                  <div 
                    className="absolute rounded-full"
                    style={{ 
                      width: location.coordinates.ring === 1 ? '14px' : location.coordinates.ring === 2 ? '12px' : '10px',
                      height: location.coordinates.ring === 1 ? '14px' : location.coordinates.ring === 2 ? '12px' : '10px',
                      backgroundColor: getRingColor(location.coordinates.ring),
                      boxShadow: `0 0 20px ${getRingColor(location.coordinates.ring)}`,
                    }}
                  />
                  <div 
                    className="absolute rounded-full border-2"
                    style={{ 
                      width: location.coordinates.ring === 1 ? '24px' : location.coordinates.ring === 2 ? '20px' : '18px',
                      height: location.coordinates.ring === 1 ? '24px' : location.coordinates.ring === 2 ? '20px' : '18px',
                      borderColor: getRingColor(location.coordinates.ring),
                      animation: 'pulse 2s ease-out infinite',
                    }}
                  />
                </div>

                {/* Tooltip */}
                {(hoveredLocation === location.id && activeLocation !== location.id) && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-black/90 backdrop-blur-sm border border-[#00d4ff] whitespace-nowrap z-10 rounded">
                    <div className="text-[#e8e8ec] font-mono text-xs">
                      <span className="text-[#00d4ff]">{'>'}</span> {location.name}
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: getStatusColor(location.status) }}>
                      STATUS: {location.status}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00d4ff] z-30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#ff006e] z-30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#9d4edd] z-30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00d4ff] z-30" />

            {/* Map Title */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/70 backdrop-blur-sm border border-[#00d4ff]/50 rounded z-30">
              <span className="font-mono text-[10px] text-[#00d4ff] tracking-wider">
                {glitchText ? '> PROTOCOL_NETWORK_v2.4_ERR' : '> PROTOCOL_NETWORK_v2.4'}
              </span>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded p-2 text-[10px] font-mono border border-[#00d4ff]/30 z-30">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
                <span className="text-[#8b8b9b]">CORE_NODE</span>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#ff006e]" />
                <span className="text-[#8b8b9b]">SECONDARY_NODE</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#9d4edd]" />
                <span className="text-[#8b8b9b]">EDGE_NODE</span>
              </div>
            </div>

            {/* Coordinates Display */}
            <div className="absolute bottom-4 right-4 font-mono text-[8px] text-[#00d4ff] bg-black/70 px-2 py-0.5 rounded border border-[#00d4ff]/30 z-30">
              {hoveredLocation ? (
                <span>
                  NODE_{worldLocations.find(l => l.id === hoveredLocation)?.coordinates.x}_{worldLocations.find(l => l.id === hoveredLocation)?.coordinates.y}
                </span>
              ) : (
                <span>&gt; SELECT_NODE</span>
              )}
            </div>
          </div>

          {/* Location Info Panel */}
          <div className="lg:w-80 space-y-4">
            {activeLocationData ? (
              <div className="p-6 bg-black/80 backdrop-blur-md border border-[#00d4ff]/40 rounded-xl shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                <div className="flex items-center justify-between mb-4">
                  <span 
                    className="px-2 py-1 text-[10px] font-mono rounded-sm"
                    style={{ 
                      backgroundColor: `${getStatusColor(activeLocationData.status)}20`,
                      color: getStatusColor(activeLocationData.status)
                    }}
                  >
                    {activeLocationData.type}
                  </span>
                  <span 
                    className="text-[10px] font-mono flex items-center gap-1"
                    style={{ color: getStatusColor(activeLocationData.status) }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: getStatusColor(activeLocationData.status) }} />
                    {activeLocationData.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#e8e8ec] mb-2 font-mono">
                  <span className="text-[#00d4ff]">{'>'}</span> {activeLocationData.name}
                </h3>
                <p className="text-sm text-[#8b8b9b] mb-4">
                  {activeLocationData.description}
                </p>
                <div className="pt-4 border-t border-[#00d4ff]/20">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#8b8b9b]">NODE_ID</span>
                    <span className="text-[#00d4ff]">
                      {activeLocationData.id}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono mt-1">
                    <span className="text-[#8b8b9b]">COORDINATES</span>
                    <span className="text-[#ff006e]">
                      {activeLocationData.coordinates.x},{activeLocationData.coordinates.y}
                    </span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 border border-[#ff006e] hover:border-[#00d4ff] text-sm font-mono text-[#e8e8ec] transition-all duration-300 rounded hover:shadow-[0_0_10px_rgba(0,212,255,0.3)]">
                  {glitchText ? '> ACCESS_DENIED' : '> ACCESS_NODE'}
                </button>
              </div>
            ) : (
              <div className="p-6 bg-black/80 backdrop-blur-md border border-[#1a1a24] text-center rounded-xl">
                <div className="text-[#8b8b9b] text-xs font-mono mb-2">
                  <span className="text-[#00d4ff]">{'>'}</span> AWAITING INPUT
                </div>
                <div className="font-mono text-[10px] text-[#ff006e] animate-pulse">
                  SELECT_A_NODE
                </div>
              </div>
            )}

            {/* Location List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scroll">
              <div className="text-[8px] font-mono text-[#00d4ff] mb-2 px-2">
                {worldLocations.length} NODES_ACTIVE
              </div>
              {worldLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setActiveLocation(activeLocation === location.id ? null : location.id)}
                  className={`w-full flex items-center justify-between p-3 border transition-all duration-300 rounded ${
                    activeLocation === location.id
                      ? 'bg-[#00d4ff]/10 border-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.2)]'
                      : 'bg-black/40 border-[#1a1a24] hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getRingColor(location.coordinates.ring) }}
                    />
                    <span className="text-xs font-mono text-[#e8e8ec]">{location.name}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#8b8b9b]">{location.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0%, 100% { transform: skew(0deg, 0deg); opacity: 1; }
          10% { transform: skew(2deg, -1deg); opacity: 0.8; }
          20% { transform: skew(-2deg, 1deg); opacity: 0.9; }
          30% { transform: skew(1deg, -2deg); opacity: 0.85; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.2); }
        }
        
        .animate-glitch {
          animation: glitch 0.2s ease-in-out;
        }
        
        .custom-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #1a1a24;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #ff006e;
          border-radius: 10px;
        }
      `}</style>
    </section>
  )
}