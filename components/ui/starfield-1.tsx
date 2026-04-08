'use client'

import React, { useEffect, useRef, useState } from 'react'

interface StarfieldProps {
  starColor?: string
  bgColor?: string
  mouseAdjust?: boolean
  tiltAdjust?: boolean
  easing?: number
  clickToWarp?: boolean
  hyperspace?: boolean
  warpFactor?: number
  opacity?: number
  speed?: number
  quantity?: number
}

export const Starfield: React.FC<StarfieldProps> = ({
  starColor = 'rgba(255, 255, 255, 0.8)',
  bgColor = 'rgba(0, 0, 0, 0)', // Прозрачный фон по умолчанию
  mouseAdjust = false,
  tiltAdjust = false,
  easing = 1,
  clickToWarp = false,
  hyperspace = false,
  warpFactor = 10,
  opacity = 0.1,
  speed = 1,
  quantity = 512,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  
  // Состояние звезд
  const starsRef = useRef<Array<{
    x: number
    y: number
    z: number
    size: number
    brightness: number
  }>>([])
  
  const dimensionsRef = useRef({ w: 0, h: 0, centerX: 0, centerY: 0, maxZ: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)

  // Инициализация звезд
  const initStars = (w: number, h: number, centerX: number, centerY: number, maxZ: number) => {
    const stars = []
    for (let i = 0; i < quantity; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * maxZ,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
      })
    }
    return stars
  }

  // Обновление позиций звезд
  const updateStars = () => {
    const { w, h, centerX, centerY, maxZ } = dimensionsRef.current
    const compSpeed = hyperspace ? speed * warpFactor : speed
    
    starsRef.current = starsRef.current.map(star => {
      let newStar = { ...star }
      
      // Движение звезд при движении мыши
      if (mouseAdjust) {
        newStar.x += (mouseRef.current.x / easing) * 0.5
        newStar.y += (mouseRef.current.y / easing) * 0.5
      }
      
      // Движение звезд вглубь
      newStar.z -= compSpeed
      
      // Зацикливание
      if (newStar.z < 0) {
        newStar.z = maxZ
        newStar.x = (Math.random() - 0.5) * w * 2
        newStar.y = (Math.random() - 0.5) * h * 2
      }
      
      return newStar
    })
  }

  // Отрисовка звезд
  const drawStars = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    const { w, h, centerX, centerY, maxZ } = dimensionsRef.current
    
    // Очистка canvas с прозрачным или цветным фоном
    ctx.clearRect(0, 0, w, h)
    if (bgColor !== 'rgba(0, 0, 0, 0)') {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, w, h)
    }
    
    // Рисуем каждую звезду
    starsRef.current.forEach(star => {
      // Проекция 3D в 2D
      const perspective = 300 / star.z
      const screenX = centerX + star.x * perspective
      const screenY = centerY + star.y * perspective
      
      // Пропускаем звезды за пределами экрана
      if (screenX < 0 || screenX > w || screenY < 0 || screenY > h) return
      
      // Размер звезды зависит от глубины
      const size = star.size * (1 - star.z / maxZ) * 1.5 + 0.5
      
      // Яркость зависит от глубины
      const brightness = star.brightness * (1 - star.z / maxZ * 0.5)
      
      // Мерцание
      const twinkle = Math.sin(timeRef.current * 2 + star.x * 0.01) * 0.3 + 0.7
      
      // Парсим цвет звезды (поддерживаем rgba)
      let starColorRgba = starColor
      if (starColor.startsWith('rgba')) {
        const match = starColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
        if (match) {
          const [_, r, g, b, a] = match
          starColorRgba = `rgba(${r}, ${g}, ${b}, ${parseFloat(a) * brightness * twinkle})`
        }
      } else if (starColor.startsWith('rgb')) {
        starColorRgba = starColor.replace('rgb', 'rgba').replace(')', `, ${brightness * twinkle})`)
      } else {
        starColorRgba = starColor
      }
      
      // Рисуем звезду как круг
      ctx.beginPath()
      ctx.arc(screenX, screenY, Math.max(0.5, size), 0, Math.PI * 2)
      ctx.fillStyle = starColorRgba
      ctx.fill()
      
      // Добавляем свечение для крупных звезд
      if (size > 1.5) {
        ctx.beginPath()
        ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = starColorRgba.replace(/[\d.]+\)/, '0.1)')
        ctx.fill()
      }
    })
  }

  // Анимация
  const animate = () => {
    timeRef.current += 0.02
    updateStars()
    drawStars()
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  // Обработчик движения мыши
  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (parent && mouseAdjust) {
      const rect = parent.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left - dimensionsRef.current.centerX) / dimensionsRef.current.centerX
      mouseRef.current.y = (e.clientY - rect.top - dimensionsRef.current.centerY) / dimensionsRef.current.centerY
    }
  }

  // Инициализация и ресайз
  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    
    const resize = () => {
      const w = parent.clientWidth
      const h = parent.clientHeight
      const centerX = w / 2
      const centerY = h / 2
      const maxZ = (w + h) / 2
      
      canvas.width = w
      canvas.height = h
      
      dimensionsRef.current = { w, h, centerX, centerY, maxZ }
      starsRef.current = initStars(w, h, centerX, centerY, maxZ)
    }
    
    resize()
    animate()
    
    window.addEventListener('resize', resize)
    if (mouseAdjust) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    
    const resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(parent)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
    }
  }, [mouseAdjust])

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%', 
        height: '100%',
        display: 'block',
        pointerEvents: 'none'
      }} 
    />
  )
}

export default Starfield