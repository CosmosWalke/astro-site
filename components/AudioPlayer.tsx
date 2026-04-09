'use client'

import { useState, useRef, useEffect } from 'react'
import { CustomCursor } from './CustomCursor'

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.07)
  const [isMuted, setIsMuted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Останавливаем музыку при уходе с вкладки/сворачивании браузера
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Вкладка скрыта (пользователь ушел или свернул браузер)
        if (audioRef.current && isPlaying) {
          audioRef.current.pause()
          console.log('Tab hidden - music paused')
        }
      } else {
        // Вкладка снова активна
        if (audioRef.current && isPlaying && isSoundEnabled) {
          audioRef.current.play().catch(e => console.log('Resume play failed:', e))
          console.log('Tab active - music resumed')
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isPlaying, isSoundEnabled])

  const enableSound = () => {
    if (audioRef.current && !isSoundEnabled) {
      audioRef.current.volume = 0.07
      audioRef.current.play()
        .then(() => {
          console.log('Sound enabled')
          setIsPlaying(true)
          setIsSoundEnabled(true)
        })
        .catch(e => console.log('Failed to enable sound:', e))
    }
  }

  const togglePlay = () => {
    if (!isSoundEnabled) {
      enableSound()
      return
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (!isSoundEnabled) {
      enableSound()
      return
    }
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSoundEnabled) {
      enableSound()
      return
    }
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      if (newVolume > 0 && isMuted) {
        setIsMuted(false)
      }
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.07
    }
  }, [])

  // Для десктопа: показываем при наведении
  const showVolumeOnHover = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    setIsHovered(true)
  }

  const startHideTimer = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
    }, 800)
  }

  // Для мобильных: показываем/скрываем по тапу
  const toggleVolumeControl = () => {
    if (showVolumeControl) {
      setShowVolumeControl(false)
    } else {
      setShowVolumeControl(true)
      setTimeout(() => {
        setShowVolumeControl(false)
      }, 3000)
    }
  }

  const handleMouseEnter = () => !isMobile && showVolumeOnHover()
  const handleMouseLeave = () => !isMobile && startHideTimer()
  const handleVolumeMouseEnter = () => !isMobile && showVolumeOnHover()
  const handleVolumeMouseLeave = () => !isMobile && startHideTimer()

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  const shouldShowVolume = isMobile 
    ? showVolumeControl && isSoundEnabled 
    : isHovered && isSoundEnabled

  return (
    <>
      <CustomCursor onActivate={enableSound} isActive={isSoundEnabled} />

      <div 
        className="fixed bottom-6 left-6 z-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Вертикальный регулятор громкости */}
        <div 
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-300 ${
            shouldShowVolume ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
          onMouseEnter={handleVolumeMouseEnter}
          onMouseLeave={handleVolumeMouseLeave}
        >
          <div className="bg-black/80 backdrop-blur-md border border-[#00d4ff] rounded-full py-4 px-2 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-3.5 h-3.5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3,9H7L12,4V20L7,15H3V9Z M16.5,12A4.5,4.5 0 0,0 14,7.97V16.03C15.32,15.44 16.5,13.85 16.5,12Z M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.19,19.86 21,16.28 21,12C21,7.72 18.19,4.14 14,3.23Z"/>
              </svg>
              
              <div className="relative h-24 flex items-center justify-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute w-24 h-1 bg-[#1a1a24] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-2.5 
                    [&::-webkit-slider-thumb]:h-2.5 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-[#00d4ff]
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-[0_0_8px_#00d4ff]
                    [&::-webkit-slider-thumb]:hover:scale-125
                    [&::-webkit-slider-thumb]:transition-transform"
                  style={{ 
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center'
                  }}
                />
              </div>
              
              <span className="text-[9px] font-mono text-[#00d4ff] font-bold mt-2">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Основная кнопка */}
        <div 
          className={`flex items-center gap-3 bg-black/80 backdrop-blur-md border border-[#00d4ff] rounded-full px-4 py-2 shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300 ${!isSoundEnabled ? 'opacity-70' : ''}`}
          onClick={isMobile ? toggleVolumeControl : undefined}
        >
          <audio
            ref={audioRef}
            src="/audio/Audio1.mp3"
            loop
            preload="auto"
          />
          
          <button
            onClick={togglePlay}
            className={`relative w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
              isSoundEnabled 
                ? 'bg-[#00d4ff]/20 hover:bg-[#00d4ff]/40' 
                : 'bg-[#00d4ff]/10 cursor-pointer'
            }`}
          >
            {isPlaying ? (
              <svg className="w-4 h-4 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[#00d4ff] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
            
            {isPlaying && isSoundEnabled && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00d4ff]" />
              </span>
            )}
          </button>

          <button
            onClick={toggleMute}
            className={`relative w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 group ${
              isSoundEnabled ? 'hover:bg-[#00d4ff]/20' : ''
            }`}
          >
            {isMuted ? (
              <svg className="w-4 h-4 text-[#ff006e] group-hover:text-[#00d4ff] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3,9H7L12,4V20L7,15H3V9Z M16.5,12A4.5,4.5 0 0,0 14,7.97V16.03C15.32,15.44 16.5,13.85 16.5,12Z M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.19,19.86 21,16.28 21,12C21,7.72 18.19,4.14 14,3.23Z"/>
                <line x1="18" y1="6" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="22" y1="6" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[#00d4ff] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3,9H7L12,4V20L7,15H3V9Z M16.5,12A4.5,4.5 0 0,0 14,7.97V16.03C15.32,15.44 16.5,13.85 16.5,12Z M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.19,19.86 21,16.28 21,12C21,7.72 18.19,4.14 14,3.23Z"/>
              </svg>
            )}
            
            {isSoundEnabled && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 border border-[#00d4ff] rounded text-[9px] font-mono text-[#00d4ff] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {isMuted ? 'UNMUTE' : 'MUTE'}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}