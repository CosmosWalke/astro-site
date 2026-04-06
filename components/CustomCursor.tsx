'use client'

import { useState, useEffect } from 'react'

interface CustomCursorProps {
  onActivate: () => void
  isActive: boolean
}

export function CustomCursor({ onActivate, isActive }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Для мобильных: размещаем курсор в центре по горизонтали, на 75% высоты экрана
  useEffect(() => {
    if (isMobile && !isActive && !isVisible) {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight * 0.75 // 75% высоты экрана (ниже середины)
      setPosition({ x: centerX, y: centerY })
      setIsVisible(true)
    }
  }, [isMobile, isActive, isVisible])

  // Обновляем позицию при изменении размера окна (для мобильных)
  useEffect(() => {
    const handleResize = () => {
      if (isMobile && !isActive) {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight * 0.75
        setPosition({ x: centerX, y: centerY })
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile, isActive])

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      if (!isMobile) {
        setPosition({ x: e.clientX, y: e.clientY })
        if (!isVisible) setIsVisible(true)
      }
    }

    const handleClick = () => {
      if (!isActive) {
        setIsClicking(true)
        setTimeout(() => setIsClicking(false), 200)
        onActivate()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (isMobile && !isActive) {
        const touch = e.touches[0]
        setPosition({ x: touch.clientX, y: touch.clientY })
        setIsClicking(true)
        setTimeout(() => setIsClicking(false), 200)
        onActivate()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isMobile && !isActive) {
        const touch = e.touches[0]
        setPosition({ x: touch.clientX, y: touch.clientY })
      }
    }

    if (!isMobile) {
      window.addEventListener('mousemove', updatePosition)
      window.addEventListener('click', handleClick)
    } else {
      window.addEventListener('touchstart', handleTouchStart)
      window.addEventListener('touchmove', handleTouchMove)
    }

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isActive, onActivate, isVisible, isMobile])

  if (isActive) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        transition: isClicking ? 'transform 0.1s ease-out' : 'transform 0.05s linear',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Тонкий внешний круг */}
        <div
          className={`rounded-full border border-[#00d4ff] bg-[#00d4ff]/5 backdrop-blur-sm
            transition-all duration-300 ${isClicking ? 'scale-90' : 'scale-100'}`}
          style={{
            width: isMobile ? '64px' : '48px',
            height: isMobile ? '64px' : '48px',
            boxShadow: '0 0 12px rgba(0, 212, 255, 0.1)',
          }}
        >
          {/* Эквалайзер */}
          <div className="absolute inset-0 flex items-center justify-center gap-[3px]">
            <div className="w-[1.5px] bg-[#00d4ff] rounded-full equalizer-bar-1" />
            <div className="w-[1.5px] bg-[#00d4ff] rounded-full equalizer-bar-2" />
            <div className="w-[1.5px] bg-[#00d4ff] rounded-full equalizer-bar-3" />
            <div className="w-[1.5px] bg-[#00d4ff] rounded-full equalizer-bar-4" />
            <div className="w-[1.5px] bg-[#00d4ff] rounded-full equalizer-bar-5" />
          </div>
        </div>

        {/* Пульсирующая волна */}
        <div 
          className="absolute inset-0 rounded-full border border-[#00d4ff]/25 cursor-ping-slow" 
          style={{ width: isMobile ? '64px' : '48px', height: isMobile ? '64px' : '48px' }}
        />

        {/* Текст под курсором */}
        <div className="absolute -bottom-7 whitespace-nowrap">
          <span className={`font-mono text-[#00d4ff]/70 tracking-wider animate-pulse ${isMobile ? 'text-[10px]' : 'text-[7px]'}`}>
            {isMobile ? 'TAP TO ENABLE SOUND' : 'CLICK TO ENABLE SOUND'}
          </span>
        </div>
      </div>
    </div>
  )
}