'use client'

import { useEffect, useRef, useState } from 'react'

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
  appearDelay?: number
  glitchInterval?: number
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
  satelliteSpeed = 0.8,
  appearDelay = 1500,
  glitchInterval = 5000
}: SimpleGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const globeRotationRef = useRef(0)
  const satelliteRotationRef = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)
  const [isVisible, setIsVisible] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const periodicGlitchRef = useRef<NodeJS.Timeout | null>(null)
  
  const satellitePointsRef = useRef<Array<{
    x: number,
    y: number,
    opacity: number,
    targetOpacity: number
  }>>([])

  // Функция запуска глитча
  const startGlitch = () => {
    setGlitchActive(true)
    setTimeout(() => {
      setGlitchActive(false)
    }, 150)
  }

  // Эффект появления
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      startGlitch()
    }, appearDelay)
    return () => clearTimeout(timer)
  }, [appearDelay])

  // Периодический глитч
  useEffect(() => {
    if (!isVisible || glitchInterval === 0) return
    periodicGlitchRef.current = setInterval(() => {
      startGlitch()
    }, glitchInterval)
    return () => {
      if (periodicGlitchRef.current) clearInterval(periodicGlitchRef.current)
    }
  }, [isVisible, glitchInterval])

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
          points.push({ x: 0, y: 0, opacity: 1, targetOpacity: 1 })
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
          if (lat === -85) ctx.moveTo(xPos, yPos)
          else ctx.lineTo(xPos, yPos)
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
          const dx = x - centerX
          const dy = y - centerY
          const distanceSquared = dx * dx + dy * dy
          const intersectsGlobe = distanceSquared < globeRadius * globeRadius
          const isBehind = intersectsGlobe && z > 0
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
          if (lat === -85) ctx.moveTo(xPos, yPos)
          else ctx.lineTo(xPos, yPos)
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

    // Глитч-эффект ТОЛЬКО для глобуса и спутника
    const applyGlitchToGlobe = () => {
      if (!glitchActive) return
      
      // Вычисляем область вокруг глобуса и спутника
      const maxRadius = Math.max(globeRadius, satelliteOrbitRadius + 40)
      const globeBounds = {
        x: centerX - maxRadius,
        y: centerY - maxRadius,
        w: maxRadius * 2,
        h: maxRadius * 2
      }
      
      // Ограничиваем область canvas
      const startX = Math.max(0, Math.floor(globeBounds.x))
      const startY = Math.max(0, Math.floor(globeBounds.y))
      const endX = Math.min(canvasWidth, startX + globeBounds.w)
      const endY = Math.min(canvasHeight, startY + globeBounds.h)
      
      if (endX <= startX || endY <= startY) return
      
      const imageData = ctx.getImageData(startX, startY, endX - startX, endY - startY)
      const data = imageData.data
      
      // Смещение красного канала
      for (let y = 0; y < imageData.height; y++) {
        if (Math.random() > 0.6) {
          const shift = Math.floor(Math.random() * 6) + 2
          for (let x = shift; x < imageData.width; x++) {
            const idx = (y * imageData.width + x) * 4
            const shiftIdx = (y * imageData.width + (x - shift)) * 4
            if (shiftIdx >= 0 && shiftIdx < data.length) {
              data[idx] = data[shiftIdx]
            }
          }
        }
      }
      
      ctx.putImageData(imageData, startX, startY)
      
      // Белые полосы только в области глобуса
      for (let i = 0; i < 5; i++) {
        const y = startY + Math.random() * (endY - startY)
        const height = Math.random() * 2 + 1
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.6})`
        ctx.fillRect(startX, y, endX - startX, height)
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      if (!isVisible) return
      
      const appearProgress = Math.min(1, (Date.now() - appearDelay) / 300)
      const currentOpacity = Math.min(1, appearProgress)
      
      if (satellite) {
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, satelliteOrbitRadius, satelliteOrbitRadius * 0.6, 0, 0, 2 * Math.PI)
        ctx.strokeStyle = `${color}40`
        ctx.lineWidth = 0.5
        ctx.setLineDash([4, 6])
        ctx.stroke()
        ctx.setLineDash([])
      }

      const angle = satelliteRotationRef.current
      const z = Math.sin(angle)
      const scale = 1 + (-z) * 0.4
      const scaledRadius = satelliteBaseRadius * scale
      const satelliteX = centerX + Math.cos(angle) * satelliteOrbitRadius
      const satelliteY = centerY + Math.sin(angle) * satelliteOrbitRadius * 0.6

      updateSatellitePoints(satelliteX, satelliteY, scaledRadius, satelliteRotationRef.current * 2, z)

      ctx.save()
      
      // Рисуем глобус и спутник
      drawGlobe(centerX, centerY, globeRadius, color, globeRotationRef.current)
      drawSatellite(satelliteX, satelliteY, scaledRadius, satelliteColor, satelliteRotationRef.current * 2, z)
      drawSatellitePoints(satelliteColor)
      
      // Применяем глитч ТОЛЬКО к глобусу и спутнику
      applyGlitchToGlobe()
      
      ctx.restore()
      
      // Свечение
      const avgOpacity = satellitePointsRef.current.reduce((sum, p) => sum + p.opacity, 0) / 
                         satellitePointsRef.current.length
      const glowIntensity = avgOpacity * (0.5 + (z + 1) * 0.25) * currentOpacity
      if (glowIntensity > 0.3) {
        ctx.beginPath()
        ctx.arc(satelliteX, satelliteY, scaledRadius + 4, 0, 2 * Math.PI)
        ctx.fillStyle = `${satelliteColor}${Math.floor(20 * glowIntensity).toString(16).padStart(2, '0')}`
        ctx.fill()
      }
    }

    const animate = () => {
      if (autoRotate) globeRotationRef.current = (globeRotationRef.current + globeSpeed) % 360
      if (satellite) satelliteRotationRef.current = (satelliteRotationRef.current + satelliteSpeed * 0.02) % (Math.PI * 2)
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [width, height, color, satelliteColor, autoRotate, globeSpeed, satellite, satelliteSpeed, isVisible, glitchActive, appearDelay])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out'
      }}
    />
  )
}