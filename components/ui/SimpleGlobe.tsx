'use client'

import { useEffect, useRef } from 'react'

interface SimpleGlobeProps {
  width?: number
  height?: number
  className?: string
  color?: string
  satelliteColor?: string
  autoRotate?: boolean
  globeSpeed?: number
  satellite?: boolean
  satelliteSpeed?: number
}

export default function SimpleGlobe({ 
  width = 120, 
  height = 120, 
  className = "",
  color = "#00d4ff",
  satelliteColor = "#ff6b35",
  autoRotate = true,
  globeSpeed = 0.15,
  satellite = true,
  satelliteSpeed = 0.8
}: SimpleGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const globeRotationRef = useRef(0)
  const satelliteRotationRef = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)
  
  const satellitePointsRef = useRef<Array<{
    x: number,
    y: number,
    opacity: number,
    targetOpacity: number
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobileForPadding = typeof window !== 'undefined' ? window.innerWidth < 768 : false
    const padding = isMobileForPadding ? 54 : 80
    const canvasWidth = width + padding
    const canvasHeight = height + padding
    
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvasWidth * dpr
    canvas.height = canvasHeight * dpr
    canvas.style.width = `${canvasWidth}px`
    canvas.style.height = `${canvasHeight}px`
    canvas.style.marginLeft = `-${padding/2}px`
    canvas.style.marginTop = `-${padding/2}px`
    ctx.scale(dpr, dpr)

    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    const globeRadius = Math.min(width, height) / 2 - 4
    const satelliteOrbitRadius = globeRadius + 20
    const satelliteBaseRadius = globeRadius * 0.28

    const generateSatellitePoints = () => {
      const points: Array<{
        x: number, y: number, opacity: number, targetOpacity: number
      }> = []
      
      for (let lon = -180; lon <= 180; lon += 12) {
        for (let lat = -75; lat <= 75; lat += 12) {
          points.push({
            x: 0, y: 0,
            opacity: 1,
            targetOpacity: 1
          })
        }
      }
      return points
    }

    satellitePointsRef.current = generateSatellitePoints()

    const drawGlobe = (x: number, y: number, radius: number, baseColor: string, rotation: number) => {
      ctx.beginPath()
      ctx.arc(x, y, radius + 2, 0, 2 * Math.PI)
      ctx.fillStyle = `${baseColor}10`
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fill()
      ctx.strokeStyle = baseColor
      ctx.lineWidth = 1.2
      ctx.stroke()

      for (let i = -60; i <= 60; i += 30) {
        const lat = (i / 90) * Math.PI / 2
        const yOffset = Math.sin(lat) * radius
        const circleRadius = Math.cos(lat) * radius
        
        ctx.beginPath()
        ctx.ellipse(x, y + yOffset, circleRadius, circleRadius * 0.4, 0, 0, 2 * Math.PI)
        ctx.strokeStyle = `${baseColor}80`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      for (let i = -180; i <= 180; i += 45) {
        const angle = (i + rotation) * Math.PI / 180
        
        ctx.beginPath()
        for (let lat = -85; lat <= 85; lat += 5) {
          const phi = lat * Math.PI / 180
          const xPos = x + Math.cos(phi) * Math.cos(angle) * radius
          const yPos = y + Math.sin(phi) * radius
          
          if (lat === -85) {
            ctx.moveTo(xPos, yPos)
          } else {
            ctx.lineTo(xPos, yPos)
          }
        }
        ctx.strokeStyle = `${baseColor}80`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    }

    const updateSatellitePoints = (
      satCenterX: number,
      satCenterY: number,
      satRadius: number,
      satRotation: number,
      z: number
    ) => {
      let pointIndex = 0

      for (let lon = -180; lon <= 180; lon += 12) {
        for (let lat = -75; lat <= 75; lat += 12) {
          if (pointIndex >= satellitePointsRef.current.length) continue

          const point = satellitePointsRef.current[pointIndex]

          const rotAngle = satRotation * Math.PI / 180
          const cosRot = Math.cos(rotAngle)
          const sinRot = Math.sin(rotAngle)

          const lonRad = lon * Math.PI / 180
          const latRad = lat * Math.PI / 180

          const baseX = Math.cos(latRad) * Math.cos(lonRad)
          const baseY = Math.sin(latRad)

          const rotatedX = baseX * cosRot - baseY * sinRot
          const rotatedY = baseX * sinRot + baseY * cosRot

          const x = satCenterX + rotatedX * satRadius
          const y = satCenterY + rotatedY * satRadius

          point.x = x
          point.y = y

          // Проверка пересечения с глобусом
          const dx = x - centerX
          const dy = y - centerY
          const distanceSquared = dx * dx + dy * dy
          const intersectsGlobe = distanceSquared < globeRadius * globeRadius

          // Спутник за глобусом, если z > 0 (дальняя сторона)
          const isBehind = intersectsGlobe && z > 0

          // Плавная прозрачность
          point.targetOpacity = isBehind ? 0.2 : 1.0
          point.opacity = point.opacity * 0.88 + point.targetOpacity * 0.12

          pointIndex++
        }
      }
    }

    const drawSatellite = (
      satCenterX: number,
      satCenterY: number,
      satRadius: number,
      baseColor: string,
      satRotation: number,
      z: number
    ) => {
      // Прозрачность зависит от глубины
      const baseOpacity = 0.5 + (z + 1) * 0.25
      const avgPointOpacity = satellitePointsRef.current.reduce((sum, p) => sum + p.opacity, 0) / 
                              satellitePointsRef.current.length
      const finalOpacity = baseOpacity * avgPointOpacity

      ctx.save()
      ctx.globalAlpha = 0.18 * finalOpacity
      ctx.beginPath()
      ctx.arc(satCenterX, satCenterY, satRadius, 0, 2 * Math.PI)
      ctx.fillStyle = baseColor
      ctx.fill()
      ctx.restore()

      for (let i = -60; i <= 60; i += 30) {
        const lat = (i / 90) * Math.PI / 2
        const yOffset = Math.sin(lat) * satRadius
        const circleRadius = Math.cos(lat) * satRadius
        
        ctx.beginPath()
        ctx.ellipse(satCenterX, satCenterY + yOffset, circleRadius, circleRadius * 0.4, 0, 0, 2 * Math.PI)
        ctx.strokeStyle = `${baseColor}${Math.floor(128 * finalOpacity).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      for (let i = -180; i <= 180; i += 45) {
        const angle = (i + satRotation) * Math.PI / 180
        
        ctx.beginPath()
        for (let lat = -85; lat <= 85; lat += 5) {
          const phi = lat * Math.PI / 180
          const xPos = satCenterX + Math.cos(phi) * Math.cos(angle) * satRadius
          const yPos = satCenterY + Math.sin(phi) * satRadius
          
          if (lat === -85) {
            ctx.moveTo(xPos, yPos)
          } else {
            ctx.lineTo(xPos, yPos)
          }
        }
        ctx.strokeStyle = `${baseColor}${Math.floor(128 * finalOpacity).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    }

    const drawSatellitePoints = (baseColor: string) => {
      for (const point of satellitePointsRef.current) {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 1.0, 0, 2 * Math.PI)
        ctx.fillStyle = baseColor
        ctx.globalAlpha = point.opacity
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      
      if (satellite) {
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, satelliteOrbitRadius, satelliteOrbitRadius * 0.6, 0, 0, 2 * Math.PI)
        ctx.strokeStyle = `${color}40`
        ctx.lineWidth = 0.5
        ctx.setLineDash([4, 6])
        ctx.stroke()
        ctx.setLineDash([])
      }

// === ПЕРСПЕКТИВА ===
const angle = satelliteRotationRef.current
const z = Math.sin(angle)  // z > 0 = сзади, z < 0 = спереди

// Масштаб: спереди БОЛЬШЕ, сзади МЕНЬШЕ
const scale = 1 + (-z) * 0.4
const scaledRadius = satelliteBaseRadius * scale

const satelliteX = centerX + Math.cos(angle) * satelliteOrbitRadius
const satelliteY = centerY + Math.sin(angle) * satelliteOrbitRadius * 0.6

      // Обновляем точки с учётом z
      updateSatellitePoints(
        satelliteX, 
        satelliteY, 
        scaledRadius, 
        satelliteRotationRef.current * 2,
        z
      )

      // Рисуем глобус
      drawGlobe(centerX, centerY, globeRadius, color, globeRotationRef.current)

      // Рисуем спутник с перспективой
      drawSatellite(
        satelliteX, 
        satelliteY, 
        scaledRadius, 
        satelliteColor, 
        satelliteRotationRef.current * 2,
        z
      )
      drawSatellitePoints(satelliteColor)
      
      // Свечение
      const avgOpacity = satellitePointsRef.current.reduce((sum, p) => sum + p.opacity, 0) / 
                         satellitePointsRef.current.length
      const glowIntensity = avgOpacity * (0.5 + (z + 1) * 0.25)
      if (glowIntensity > 0.3) {
        ctx.beginPath()
        ctx.arc(satelliteX, satelliteY, scaledRadius + 4, 0, 2 * Math.PI)
        ctx.fillStyle = `${satelliteColor}${Math.floor(20 * glowIntensity).toString(16).padStart(2, '0')}`
        ctx.fill()
      }
    }

    const animate = () => {
      if (autoRotate) {
        globeRotationRef.current = (globeRotationRef.current + globeSpeed) % 360
      }
      if (satellite) {
        satelliteRotationRef.current = (satelliteRotationRef.current + satelliteSpeed * 0.02) % (Math.PI * 2)
      }
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height, color, satelliteColor, autoRotate, globeSpeed, satellite, satelliteSpeed])

  return (
    <canvas
      ref={canvasRef}
      className={className}
    />
  )
}