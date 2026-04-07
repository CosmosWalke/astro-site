'use client'

import { useState, useEffect } from 'react'

interface GyroToggleProps {
  onOrientationChange: (gamma: number) => void
  isActive: boolean
  onToggle: () => void
}

export function GyroToggle({ onOrientationChange, isActive, onToggle }: GyroToggleProps) {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
  }, [])

  // Упрощённый обработчик без сглаживания
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!isActive) return
      const gamma = event.gamma || 0
      onOrientationChange(gamma)
    }

    window.addEventListener('deviceorientation', handleOrientation)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [isActive, onOrientationChange])

  const requestPermission = async () => {
    console.log('Requesting DeviceOrientation permission...')

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        console.log('Permission result:', permission)
        if (permission === 'granted') {
          onToggle()
        }
      } catch (error) {
        console.error('Permission error:', error)
      }
    } else {
      onToggle()
    }
  }

  const handleClick = () => {
    if (isActive) {
      onToggle()
    } else {
      requestPermission()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-28 left-6 z-50 w-12 h-12 rounded-full backdrop-blur-md border-2 transition-all duration-300 flex items-center justify-center font-mono font-bold text-sm ${
        isActive 
          ? 'bg-[#00d4ff]/30 border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.5)] text-[#00d4ff]' 
          : 'bg-black/60 border-[#2a2a38] hover:border-[#00d4ff] text-white hover:text-[#00d4ff]'
      }`}
    >
      {isActive ? (
        <svg className="w-5 h-5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
        </svg>
      ) : (
        <span className="text-sm font-bold tracking-wider">VR</span>
      )}
    </button>
  )
}