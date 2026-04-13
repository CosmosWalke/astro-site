'use client'

import { useState, useRef, useEffect } from 'react'
import { CustomCursor } from './CustomCursor'

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.07)
  const [isMuted, setIsMuted] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Запускаем таймер на сворачивание после монтирования (только для десктопа)
  useEffect(() => {
    if (isMobile === false && !isSoundEnabled) {
      startHideTimer()
    }
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [isMobile, isSoundEnabled])

  // Для мобильных - запускаем таймер на сворачивание
  useEffect(() => {
    if (isMobile === true && !isOpen && !isCollapsed) {
      const timer = setTimeout(() => {
        setIsCollapsed(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isMobile, isOpen, isCollapsed])

  // Останавливаем музыку при уходе с вкладки
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audioRef.current && isPlaying) {
          audioRef.current.pause()
        }
      } else {
        if (audioRef.current && isPlaying && isSoundEnabled) {
          audioRef.current.play().catch(e => console.log('Resume play failed:', e))
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isPlaying, isSoundEnabled])

  const startHideTimer = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(true)
    }, 3000)
  }

  const cancelHideTimer = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
  }

  const expand = () => {
    setIsCollapsed(false)
    cancelHideTimer()
    startHideTimer()
  }

  const enableSound = () => {
    if (audioRef.current && !isSoundEnabled) {
      audioRef.current.volume = 0.07
      audioRef.current.play()
        .then(() => {
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
    cancelHideTimer()
    startHideTimer()
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
    cancelHideTimer()
    startHideTimer()
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
    cancelHideTimer()
    startHideTimer()
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.07
    }
  }, [])

  const handleCustomCursorActivate = () => {
    if (!isSoundEnabled) {
      enableSound()
    }
  }

  // Пока не определили тип устройства
  if (isMobile === null) {
    return null
  }

  // ========== ДЕСКТОП ВЕРСИЯ ==========
  if (!isMobile) {
    // Свернутая версия для десктопа
    if (isCollapsed) {
      return (
        <>
          <CustomCursor 
            onActivate={handleCustomCursorActivate} 
            isActive={isSoundEnabled}
          />
          <button
            onClick={expand}
            onMouseEnter={expand}
            className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-black/80 backdrop-blur-md border border-[#00d4ff] rounded-full shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <svg className="w-4 h-4 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3,9H7L12,4V20L7,15H3V9Z M16.5,12A4.5,4.5 0 0,0 14,7.97V16.03C15.32,15.44 16.5,13.85 16.5,12Z M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.19,19.86 21,16.28 21,12C21,7.72 18.19,4.14 14,3.23Z"/>
            </svg>
          </button>
        </>
      )
    }

    // Развернутая версия для десктопа
    return (
      <>
        <CustomCursor 
          onActivate={handleCustomCursorActivate} 
          isActive={isSoundEnabled}
        />

        <div 
          className="fixed bottom-6 left-6 z-50"
          onMouseEnter={expand}
          onMouseLeave={startHideTimer}
        >
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-[#00d4ff] rounded-full px-4 py-2 shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all duration-300">
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
              className="relative w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 group"
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

            {isSoundEnabled && (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-[#1a1a24] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-2.5 
                    [&::-webkit-slider-thumb]:h-2.5 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-[#00d4ff]
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-[0_0_8px_#00d4ff]
                    [&::-webkit-slider-thumb]:hover:scale-125
                    [&::-webkit-slider-thumb]:transition-transform"
                />
                <span className="text-[9px] font-mono text-[#00d4ff] min-w-[30px]">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  // ========== МОБИЛЬНАЯ ВЕРСИЯ ==========
  
  // Свернутая кнопка на мобильных (очень маленькая)
  if (isCollapsed && !isOpen) {
    return (
      <>
        <CustomCursor 
          onActivate={handleCustomCursorActivate} 
          isActive={isSoundEnabled}
          targetElementId="audio-collapsed-button"
          hideText={true}
        />
        <button
          id="audio-collapsed-button"
          onClick={() => {
            setIsCollapsed(false)
            setIsOpen(true)
          }}
          className="fixed bottom-6 right-6 z-50 w-6 h-6 bg-black/80 backdrop-blur-md border border-[#00d4ff] rounded-full shadow-[0_0_10px_rgba(0,212,255,0.3)] flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <svg className="w-2.5 h-2.5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3,9H7L12,4V20L7,15H3V9Z M16.5,12A4.5,4.5 0 0,0 14,7.97V16.03C15.32,15.44 16.5,13.85 16.5,12Z M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.19,19.86 21,16.28 21,12C21,7.72 18.19,4.14 14,3.23Z"/>
          </svg>
        </button>
      </>
    )
  }

  // Развернутое модальное окно на мобильных
  if (isOpen) {
    return (
      <>
        <CustomCursor 
          onActivate={handleCustomCursorActivate} 
          isActive={isSoundEnabled}
          hideText={true}
        />
        <div 
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setIsOpen(false)
            // Запускаем таймер на сворачивание после закрытия
            setTimeout(() => {
              setIsCollapsed(true)
            }, 3000)
          }}
        />
        <div className="fixed bottom-24 right-6 z-[70] bg-black/90 backdrop-blur-md border border-[#00d4ff] rounded-2xl p-4 shadow-[0_0_30px_rgba(0,212,255,0.3)]">
          <audio
            ref={audioRef}
            src="/audio/Audio1.mp3"
            loop
            preload="auto"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#00d4ff]/20"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[#00d4ff] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-32 h-1 bg-[#1a1a24] rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-3 
                [&::-webkit-slider-thumb]:h-3 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-[#00d4ff]
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-[0_0_8px_#00d4ff]"
            />
            
            <button
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center"
            >
              {isMuted ? (
                <svg className="w-4 h-4 text-[#ff006e]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,9H7L12,4V20L7,15H3V9Z M16.5,12A4.5,4.5 0 0,0 14,7.97V16.03C15.32,15.44 16.5,13.85 16.5,12Z M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.19,19.86 21,16.28 21,12C21,7.72 18.19,4.14 14,3.23Z"/>
                  <line x1="18" y1="6" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="22" y1="6" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,9H7L12,4V20L7,15H3V9Z M16.5,12A4.5,4.5 0 0,0 14,7.97V16.03C15.32,15.44 16.5,13.85 16.5,12Z M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.19,19.86 21,16.28 21,12C21,7.72 18.19,4.14 14,3.23Z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </>
    )
  }

  // Начальное состояние на мобильных - показываем обычную кнопку (48x48)
  return (
    <>
      <CustomCursor 
        onActivate={handleCustomCursorActivate} 
        isActive={isSoundEnabled}
        targetElementId="audio-button"
        hideText={true}
      />
      <button
        id="audio-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-black/80 backdrop-blur-md border border-[#00d4ff] rounded-full shadow-[0_0_15px_rgba(0,212,255,0.3)] flex items-center justify-center transition-all duration-300"
      >
        <svg className="w-5 h-5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3,9H7L12,4V20L7,15H3V9Z M16.5,12A4.5,4.5 0 0,0 14,7.97V16.03C15.32,15.44 16.5,13.85 16.5,12Z M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.19,19.86 21,16.28 21,12C21,7.72 18.19,4.14 14,3.23Z"/>
        </svg>
      </button>
    </>
  )
}