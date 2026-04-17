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
  width: propWidth = 120, 
  height: propHeight = 120, 
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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const globeRotationRef = useRef(0)
  const satelliteRotationRef = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)
  const [isVisible, setIsVisible] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const periodicGlitchRef = useRef<NodeJS.Timeout | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Храним размеры canvas в refs
  const canvasWidthRef = useRef(0)
  const canvasHeightRef = useRef(0)
  const centerXRef = useRef(0)
  const centerYRef = useRef(0)
  const globeRadiusRef = useRef(0)
  const satelliteOrbitRadiusRef = useRef(0)
  const satelliteBaseRadiusRef = useRef(0)
  
  const satellitePointsRef = useRef<Array<{
    x: number,
    y: number,
    opacity: number,
    targetOpacity: number
  }>>([])

  // Определяем мобильное устройство (по физическим параметрам)
  useEffect(() => {
    const checkDevice = () => {
      const physicalWidth = window.screen.width;
      const physicalHeight = window.screen.height;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1;
      const isMobileDevice = hasTouch && (physicalWidth < 1024 || physicalHeight < 1024);
      setIsMobile(isMobileDevice);
    }
    
    checkDevice()
    window.addEventListener('orientationchange', checkDevice)
    return () => window.removeEventListener('orientationchange', checkDevice)
  }, [])

  // Функция расчета размера в зависимости от устройства и поворота
  const getCurrentSize = () => {
    if (!isMobile) {
      // На ПК - исходный размер
      return { width: propWidth, height: propHeight };
    }
    
    // На мобильных - уменьшаем при повороте в зависимости от ширины экрана
    const windowWidth = window.innerWidth;
    let multiplier = 1;
    
    if (windowWidth < 480) {
      multiplier = 0.9;
    } else if (windowWidth < 640) {
      multiplier = 0.6;
    } else if (windowWidth < 768) {
      multiplier = 0.5;
    } else if (windowWidth < 1024) {
      multiplier = 0.45;
    } else {
      multiplier = 0.4;
    }
    
    const newSize = Math.max(40, Math.min(propWidth, propWidth * multiplier));
    return { width: newSize, height: newSize };
  }

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

    // Функция обновления размеров canvas
    const updateCanvasSize = () => {
      const currentSize = getCurrentSize();
      const padding = 20
      canvasWidthRef.current = currentSize.width + padding
      canvasHeightRef.current = currentSize.height + padding
      
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvasWidthRef.current * dpr
      canvas.height = canvasHeightRef.current * dpr
      canvas.style.width = `${canvasWidthRef.current}px`
      canvas.style.height = `${canvasHeightRef.current}px`
      ctx.scale(dpr, dpr)
      
      // Обновляем центры и радиусы
      centerXRef.current = canvasWidthRef.current / 2
      centerYRef.current = canvasHeightRef.current / 2
      globeRadiusRef.current = Math.min(currentSize.width, currentSize.height) / 2 - 2
      satelliteOrbitRadiusRef.current = globeRadiusRef.current + 12
      satelliteBaseRadiusRef.current = globeRadiusRef.current * 0.28
    }
    
    updateCanvasSize()

    const generateSatellitePoints = () => {
      const points: Array<{
        x: number, y: number, opacity: number, targetOpacity: number
      }> = []
      const currentSize = getCurrentSize();
      const step = currentSize.width < 70 ? 24 : currentSize.width < 90 ? 18 : 12
      for (let lon = -180; lon <= 180; lon += step) {
        for (let lat = -75; lat <= 75; lat += step) {
          points.push({ x: 0, y: 0, opacity: 1, targetOpacity: 1 })
        }
      }
      return points
    }

    satellitePointsRef.current = generateSatellitePoints()

    const drawGlobe = (x: number, y: number, radius: number, baseColor: string, rotation: number) => {
      ctx.beginPath()
      ctx.arc(x, y, radius + 1, 0, 2 * Math.PI)
      ctx.fillStyle = `${baseColor}10`
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
      ctx.fill()
      ctx.strokeStyle = baseColor
      ctx.lineWidth = 1
      ctx.stroke()

      const latSteps = radius < 35 ? 3 : 5
      for (let i = -60; i <= 60; i += (120 / latSteps)) {
        const lat = (i / 90) * Math.PI / 2
        const yOffset = Math.sin(lat) * radius
        const circleRadius = Math.cos(lat) * radius
        ctx.beginPath()
        ctx.ellipse(x, y + yOffset, circleRadius, circleRadius * 0.4, 0, 0, 2 * Math.PI)
        ctx.strokeStyle = `${baseColor}80`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      const lonSteps = radius < 35 ? 4 : 8
      for (let i = -180; i <= 180; i += (360 / lonSteps)) {
        const angle = (i + rotation) * Math.PI / 180
        ctx.beginPath()
        for (let lat = -85; lat <= 85; lat += 10) {
          const phi = lat * Math.PI / 180
          const xPos = x + Math.cos(phi) * Math.cos(angle) * radius
          const yPos = y + Math.sin(phi) * radius
          if (lat === -85) ctx.moveTo(xPos, yPos)
          else ctx.lineTo(xPos, yPos)
        }
        ctx.strokeStyle = `${baseColor}80`
        ctx.lineWidth = 0.5
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
      const currentSize = getCurrentSize();
      const step = currentSize.width < 70 ? 24 : currentSize.width < 90 ? 18 : 12
      for (let lon = -180; lon <= 180; lon += step) {
        for (let lat = -75; lat <= 75; lat += step) {
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
          const dx = x - centerXRef.current
          const dy = y - centerYRef.current
          const distanceSquared = dx * dx + dy * dy
          const intersectsGlobe = distanceSquared < globeRadiusRef.current * globeRadiusRef.current
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

      const latSteps = satRadius < 25 ? 3 : 5
      for (let i = -60; i <= 60; i += (120 / latSteps)) {
        const lat = (i / 90) * Math.PI / 2
        const yOffset = Math.sin(lat) * satRadius
        const circleRadius = Math.cos(lat) * satRadius
        ctx.beginPath()
        ctx.ellipse(satCenterX, satCenterY + yOffset, circleRadius, circleRadius * 0.4, 0, 0, 2 * Math.PI)
        ctx.strokeStyle = `${baseColor}${Math.floor(128 * finalOpacity).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      const lonSteps = satRadius < 25 ? 4 : 8
      for (let i = -180; i <= 180; i += (360 / lonSteps)) {
        const angle = (i + satRotation) * Math.PI / 180
        ctx.beginPath()
        for (let lat = -85; lat <= 85; lat += 10) {
          const phi = lat * Math.PI / 180
          const xPos = satCenterX + Math.cos(phi) * Math.cos(angle) * satRadius
          const yPos = satCenterY + Math.sin(phi) * satRadius
          if (lat === -85) ctx.moveTo(xPos, yPos)
          else ctx.lineTo(xPos, yPos)
        }
        ctx.strokeStyle = `${baseColor}${Math.floor(128 * finalOpacity).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }

    const drawSatellitePoints = (baseColor: string) => {
      const currentSize = getCurrentSize();
      const pointSize = currentSize.width < 70 ? 0.5 : 0.8
      for (const point of satellitePointsRef.current) {
        ctx.beginPath()
        ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI)
        ctx.fillStyle = baseColor
        ctx.globalAlpha = point.opacity
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const applyGlitchToGlobe = () => {
      if (!glitchActive) return
      
      const maxRadius = Math.max(globeRadiusRef.current, satelliteOrbitRadiusRef.current + 30)
      const globeBounds = {
        x: centerXRef.current - maxRadius,
        y: centerYRef.current - maxRadius,
        w: maxRadius * 2,
        h: maxRadius * 2
      }
      
      const startX = Math.max(0, Math.floor(globeBounds.x))
      const startY = Math.max(0, Math.floor(globeBounds.y))
      const endX = Math.min(canvasWidthRef.current, startX + globeBounds.w)
      const endY = Math.min(canvasHeightRef.current, startY + globeBounds.h)
      
      if (endX <= startX || endY <= startY) return
      
      const imageData = ctx.getImageData(startX, startY, endX - startX, endY - startY)
      const data = imageData.data
      
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
      
      for (let i = 0; i < 3; i++) {
        const y = startY + Math.random() * (endY - startY)
        const height = Math.random() * 2 + 1
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`
        ctx.fillRect(startX, y, endX - startX, height)
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidthRef.current, canvasHeightRef.current)
      if (!isVisible) return
      
      const appearProgress = Math.min(1, (Date.now() - appearDelay) / 300)
      const currentOpacity = Math.min(1, appearProgress)
      
      if (satellite) {
        ctx.beginPath()
        ctx.ellipse(centerXRef.current, centerYRef.current, satelliteOrbitRadiusRef.current, satelliteOrbitRadiusRef.current * 0.6, 0, 0, 2 * Math.PI)
        ctx.strokeStyle = `${color}40`
        ctx.lineWidth = 0.5
        ctx.setLineDash([4, 6])
        ctx.stroke()
        ctx.setLineDash([])
      }

      const angle = satelliteRotationRef.current
      const z = Math.sin(angle)
      const scale = 1 + (-z) * 0.4
      const scaledRadius = satelliteBaseRadiusRef.current * scale
      const satelliteX = centerXRef.current + Math.cos(angle) * satelliteOrbitRadiusRef.current
      const satelliteY = centerYRef.current + Math.sin(angle) * satelliteOrbitRadiusRef.current * 0.6

      updateSatellitePoints(satelliteX, satelliteY, scaledRadius, satelliteRotationRef.current * 2, z)

      ctx.save()
      
      drawGlobe(centerXRef.current, centerYRef.current, globeRadiusRef.current, color, globeRotationRef.current)
      drawSatellite(satelliteX, satelliteY, scaledRadius, satelliteColor, satelliteRotationRef.current * 2, z)
      drawSatellitePoints(satelliteColor)
      
      applyGlitchToGlobe()
      
      ctx.restore()
      
      const avgOpacity = satellitePointsRef.current.reduce((sum, p) => sum + p.opacity, 0) / 
                         satellitePointsRef.current.length
      const glowIntensity = avgOpacity * (0.5 + (z + 1) * 0.25) * currentOpacity
      if (glowIntensity > 0.3) {
        ctx.beginPath()
        ctx.arc(satelliteX, satelliteY, scaledRadius + 3, 0, 2 * Math.PI)
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

    const handleOrientationChange = () => {
      updateCanvasSize()
      satellitePointsRef.current = generateSatellitePoints()
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [color, satelliteColor, autoRotate, globeSpeed, satellite, satelliteSpeed, isVisible, glitchActive, appearDelay, isMobile])

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          display: 'block',
          pointerEvents: 'auto'
        }}
      />
    </div>
  )
}