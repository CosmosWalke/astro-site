'use client'

import { useState, useEffect } from 'react'

interface GyroToggleProps {
  onOrientationChange: (gamma: number) => void  // ← только gamma
  isActive: boolean
  onToggle: () => void
}

export function GyroToggle({ onOrientationChange, isActive, onToggle }: GyroToggleProps) {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)
  }, [])

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!isActive) return
      const gamma = event.gamma || 0
      console.log('Gyro gamma:', gamma)
      onOrientationChange(gamma)  // ← передаём только gamma
    }

    if (isActive) {
      console.log('Adding gyro listener')
      window.addEventListener('deviceorientation', handleOrientation)
    } else {
      console.log('Removing gyro listener')
      window.removeEventListener('deviceorientation', handleOrientation)
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [isActive, onOrientationChange])

  const requestPermission = async () => {
    console.log('Requesting permission...')
    if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          console.log('Permission granted')
          onToggle()
        }
      } catch (error) {
        console.error('Permission denied:', error)
      }
    } else {
      console.log('No permission needed, toggling')
      onToggle()
    }
  }

  const handleClick = () => {
    console.log('Button clicked, isActive:', isActive)
    if (isActive) {
      onToggle()
    } else {
      requestPermission()
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '20px',
        zIndex: 99999,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: isActive ? '#00ff00' : '#ff0000',
        border: '3px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '20px',
        fontWeight: 'bold'
      }}
    >
      {isActive ? 'ON' : 'OFF'}
    </button>
  )
}