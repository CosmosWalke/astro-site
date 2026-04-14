'use client'

import { useState, useRef, useEffect } from 'react'

interface Planet {
  id: string
  name: string
  x: number
  y: number
  type: string
  status: string
  color: string
}

// Твои локации в стиле старой карты
const planets: Planet[] = [
  { id: 'NEXUS', name: 'The Nexus', x: 50, y: 40, type: 'CORE', status: 'ONLINE', color: '#00d4ff' },
  { id: 'CITADEL', name: 'Northern Citadel', x: 30, y: 20, type: 'KEEP', status: 'ONLINE', color: '#14f195' },
  { id: 'ARCHIVE', name: 'The Archive', x: 70, y: 30, type: 'VAULT', status: 'SECURE', color: '#14f195' },
  { id: 'WASTELAND', name: 'Eastern Wasteland', x: 80, y: 60, type: 'ZONE', status: 'HOSTILE', color: '#ff6b35' },
  { id: 'FORGE', name: 'The Forge', x: 20, y: 65, type: 'FACILITY', status: 'ACTIVE', color: '#00d4ff' },
  { id: 'HAVEN', name: 'Southern Haven', x: 55, y: 75, type: 'SETTLEMENT', status: 'PROTECTED', color: '#14f195' },
]

interface Route {
  id: string
  from: Planet
  to: Planet
  color: string
  active: boolean
}

// Создаём маршруты между планетами
const getRoutes = (): Route[] => {
  const routes: Route[] = []
  // Циклический маршрут
  for (let i = 0; i < planets.length; i++) {
    const from = planets[i]
    const to = planets[(i + 1) % planets.length]
    routes.push({
      id: `route-${from.id}-${to.id}`,
      from,
      to,
      color: '#00d4ff',
      active: true,
    })
  }
  // Маршруты от ядра
  const nexus = planets.find(p => p.id === 'NEXUS')!
  for (const planet of planets) {
    if (planet.id !== 'NEXUS') {
      routes.push({
        id: `route-nexus-${planet.id}`,
        from: nexus,
        to: planet,
        color: '#ffd700',
        active: true,
      })
    }
  }
  return routes
}

interface TravelingShip {
  id: string
  routeId: string
  fromX: number
  fromY: number
  toX: number
  toY: number
  progress: number
  speed: number  // добавляем индивидуальную скорость
  color: string
}

export default function GalaxyMapDemo() {
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [travelingShips, setTravelingShips] = useState<TravelingShip[]>([])
  const animationRef = useRef<number | null>(null)
  const routes = getRoutes()

  // Функция для создания новой путешествующей частицы
  const spawnTraveler = () => {
    const activeRoutes = routes.filter(r => r.active)
    if (activeRoutes.length === 0) return
    
    const randomRoute = activeRoutes[Math.floor(Math.random() * activeRoutes.length)]
    
    // Случайная скорость от 0.001 до 0.003 (очень медленно)
    const speed = 0.0008 + Math.random() * 0.0012
    
    setTravelingShips(prev => [...prev, {
      id: `${randomRoute.id}-${Date.now()}-${Math.random()}`,
      routeId: randomRoute.id,
      fromX: randomRoute.from.x,
      fromY: randomRoute.from.y,
      toX: randomRoute.to.x,
      toY: randomRoute.to.y,
      progress: 0,
      speed: speed,
      color: randomRoute.color,
    }])
  }

  // Анимация движения частиц
  useEffect(() => {
    const animate = () => {
      setTravelingShips(prev => {
        const updated = prev
          .map(ship => ({
            ...ship,
            progress: ship.progress + ship.speed, // используем индивидуальную скорость
          }))
          .filter(ship => ship.progress < 1)
        
        return updated
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    // Спавним новые частицы каждые 2 секунды
    const spawnInterval = setInterval(spawnTraveler, 2000)
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      clearInterval(spawnInterval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Вычисление позиции частицы на линии (плавная интерполяция)
  const getShipPosition = (ship: TravelingShip) => {
    // Используем плавную кривую для более естественного движения
    const t = ship.progress
    // ease-in-out для плавного старта и остановки
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    
    const x = ship.fromX + (ship.toX - ship.fromX) * eased
    const y = ship.fromY + (ship.toY - ship.fromY) * eased
    return { x, y }
  }

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
        return '#8b8b9b'
    }
  }

  // Обработчики для зума и драга
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetView = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050508] to-black">
      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="flex items-center gap-4 mb-6 justify-center">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
          <span className="font-mono text-xs text-[#00d4ff] tracking-[0.3em]">SECTION 003</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          <span className="text-[#e8e8ec]">The </span>
          <span className="text-[#00d4ff]">World</span>
        </h1>
        <p className="text-center text-[#8b8b9b] mt-4 max-w-2xl mx-auto">
          Interactive Map with Traveling Ships • Click on any planet
        </p>
      </div>

      {/* Map Container */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <div className="relative rounded-xl overflow-hidden border border-[#00d4ff]/30 shadow-[0_0_30px_rgba(0,212,255,0.1)] bg-[#0a0a0f]">
          <div 
            className="w-full h-[600px] overflow-hidden cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              style={{
                transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00d4ff" strokeWidth="0.1" opacity="0.2" />
                </pattern>
              </defs>
              
              <rect x="0" y="0" width="100" height="100" fill="url(#grid)" />
              
              {/* Galaxy Rings */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="#00d4ff" strokeWidth="0.3" strokeOpacity="0.2" strokeDasharray="2 4" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="#14f195" strokeWidth="0.3" strokeOpacity="0.2" strokeDasharray="2 4" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#ff6b35" strokeWidth="0.3" strokeOpacity="0.2" strokeDasharray="2 4" />
              <circle cx="50" cy="50" r="8" fill="rgba(0,212,255,0.05)" stroke="#00d4ff" strokeWidth="0.5" strokeOpacity="0.3" />

              {/* Маршруты */}
              {routes.map((route) => (
                <g key={route.id}>
                  <line
                    x1={route.from.x}
                    y1={route.from.y}
                    x2={route.to.x}
                    y2={route.to.y}
                    stroke={route.color}
                    strokeWidth="0.4"
                    strokeOpacity="0.3"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={route.from.x}
                    y1={route.from.y}
                    x2={route.to.x}
                    y2={route.to.y}
                    stroke={route.color}
                    strokeWidth="1"
                    strokeOpacity="0.05"
                  />
                </g>
              ))}

              {/* Путешествующие частицы */}
              {travelingShips.map((ship) => {
                const pos = getShipPosition(ship)
                // Размер частицы зависит от скорости
                const size = 1.2 + (ship.speed * 500)
                return (
                  <g key={ship.id}>
                    {/* Свечение */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={size * 2.5}
                      fill={ship.color}
                      opacity={0.15}
                    />
                    {/* Ядро частицы */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={size}
                      fill={ship.color}
                      opacity={0.9}
                    />
                    {/* Внутреннее свечение */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={size * 0.6}
                      fill="white"
                      opacity={0.5}
                    />
                  </g>
                )
              })}

              {/* Планеты */}
              {planets.map((planet) => (
                <g
                  key={planet.id}
                  className="cursor-pointer"
                  onClick={() => setActivePlanet(planet)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Пульсирующее кольцо */}
                  <circle
                    cx={planet.x}
                    cy={planet.y}
                    r="5"
                    fill="none"
                    stroke={planet.color}
                    strokeWidth="0.4"
                    opacity="0.5"
                    className="planet-pulse"
                  />
                  {/* Ядро */}
                  <circle
                    cx={planet.x}
                    cy={planet.y}
                    r={planet.type === 'CORE' ? '2.5' : '2'}
                    fill={planet.color}
                    stroke="#fff"
                    strokeWidth="0.2"
                    opacity="0.95"
                  />
                  {/* Свечение */}
                  <circle
                    cx={planet.x}
                    cy={planet.y}
                    r={planet.type === 'CORE' ? '7' : '5'}
                    fill={planet.color}
                    className="planet-glow"
                  />
                  {/* Название */}
                  <text
                    x={planet.x}
                    y={planet.y - (planet.type === 'CORE' ? 7 : 6)}
                    textAnchor="middle"
                    fill="#e8e8ec"
                    fontSize="2.5"
                    className="font-mono opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  >
                    {planet.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00d4ff]/50 pointer-events-none" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00d4ff]/50 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00d4ff]/50 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00d4ff]/50 pointer-events-none" />

          {/* Map Title */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-[#00d4ff]/30">
            <span className="font-mono text-[10px] text-[#00d4ff] tracking-wider">PROTOCOL NETWORK MAP • v2.4</span>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-auto">
            <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))} className="w-8 h-8 bg-black/80 border border-[#00d4ff] rounded text-[#00d4ff] hover:bg-[#00d4ff]/20 text-lg font-bold">+</button>
            <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} className="w-8 h-8 bg-black/80 border border-[#00d4ff] rounded text-[#00d4ff] hover:bg-[#00d4ff]/20 text-lg font-bold">-</button>
            <button onClick={resetView} className="w-8 h-8 bg-black/80 border border-[#00d4ff] rounded text-[#00d4ff] hover:bg-[#00d4ff]/20 text-xs">↺</button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <div className="p-6 bg-black/60 backdrop-blur-md border border-[#00d4ff]/20 rounded-xl">
          <h3 className="font-mono text-xs text-[#00d4ff] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" />
            LOCATION DATA
          </h3>
          {activePlanet ? (
            <>
              <p className="text-2xl font-bold text-[#e8e8ec]">{activePlanet.name}</p>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="text-xs font-mono text-[#8b8b9b]">TYPE: {activePlanet.type}</span>
                <span className="text-xs font-mono" style={{ color: getStatusColor(activePlanet.status) }}>
                  STATUS: {activePlanet.status}
                </span>
              </div>
              <p className="text-sm text-[#8b8b9b] mt-3">Coordinates: {activePlanet.x}, {activePlanet.y}</p>
            </>
          ) : (
            <p className="text-sm text-[#8b8b9b] font-mono">Select a location on the map</p>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex flex-wrap justify-center gap-6 text-xs font-mono text-[#8b8b9b]">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00d4ff]" /><span>Core / Active</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#14f195]" /><span>Secure / Protected</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ff6b35]" /><span>Hostile Zone</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ffd700] animate-pulse" /><span>Traveling Ship</span></div>
        </div>
      </div>

      <style>{`
        @keyframes planetPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.15; }
        }
        
        @keyframes glowPulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.2; }
        }
        
        .planet-pulse {
          animation: planetPulse 2.5s ease-in-out infinite;
          transform-origin: center;
        }
        
        .planet-glow {
          animation: glowPulse 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}