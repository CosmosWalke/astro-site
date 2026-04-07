'use client'

import { useState, useEffect, useCallback } from 'react'

interface GyroToggleProps {
  onOrientationChange: (alpha: number, beta: number, gamma: number) => void
  isActive: boolean
  onToggle: () => void
}

export function GyroToggle({ onOrientationChange, isActive, onToggle }: GyroToggleProps) {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)
  }, [])

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (!isActive) return
    const alpha = event.alpha || 0
    const beta = event.beta || 0
    const gamma = event.gamma || 0
    console.log('Gyro event:', { alpha, beta, gamma })
    onOrientationChange(alpha, beta, gamma)
  }, [isActive, onOrientationChange])

  const startGyro = useCallback(() => {
    window.addEventListener('deviceorientation', handleOrientation)
    console.log('Gyro started')
  }, [handleOrientation])

  const stopGyro = useCallback(() => {
    window.removeEventListener('deviceorientation', handleOrientation)
    console.log('Gyro stopped')
  }, [handleOrientation])

  const requestPermission = async () => {
    if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          startGyro()
          onToggle()
        }
      } catch (error) {
        console.error('Permission denied:', error)
      }
    } else {
      startGyro()
      onToggle()
    }
  }

  const handleClick = () => {
    if (isActive) {
      stopGyro()
      onToggle()
    } else {
      requestPermission()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-28 left-6 z-50 w-12 h-12 rounded-full backdrop-blur-md border-2 transition-all duration-300 flex items-center justify-center ${
        isActive 
          ? 'bg-[#00d4ff]/30 border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.5)]' 
          : 'bg-black/60 border-[#2a2a38] hover:border-[#00d4ff]'
      }`}
    >
      {isActive ? (
        <svg className="w-5 h-5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
        </svg>
      ) : (
        <svg className="w-5 h-5 text-white group-hover:text-[#00d4ff] transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
          <circle cx="12" cy="16" r="1.5"/>
          <path d="M15 8h-6v2h6V8z"/>
        </svg>
      )}
    </button>
  )
}