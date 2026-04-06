'use client'

import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressTextRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(scrollPercent)
      
      // Обновляем высоту полоски прогресса через GSAP
      if (progressBarRef.current) {
        gsap.set(progressBarRef.current, { scaleY: scrollPercent })
      }
      
      // Обновляем текст процента
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(scrollPercent * 100)}%`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4">
      {/* Progress line */}
      <div className="relative h-32 w-[1px] bg-gray-800 overflow-hidden">
        <div
          ref={progressBarRef}
          className="absolute bottom-0 left-0 w-full bg-white origin-bottom"
          style={{ 
            transformOrigin: 'bottom',
            transform: 'scaleY(0)'
          }}
        />
      </div>

      {/* Progress percentage */}
      <span 
        ref={progressTextRef}
        className="text-[10px] font-mono text-gray-600"
        style={{ writingMode: 'vertical-rl' }}
      >
        0%
      </span>

      {/* Section indicators */}
      <div className="flex flex-col gap-2 mt-4">
        {['01', '02', '03', '04'].map((num, i) => (
          <div
            key={num}
            className="w-2 h-2 border transition-colors duration-300"
            style={{
              backgroundColor: progress > i * 0.25 && progress <= (i + 1) * 0.25 ? '#fff' : 'transparent',
              borderColor: progress > i * 0.25 && progress <= (i + 1) * 0.25 ? '#fff' : '#333',
            }}
          />
        ))}
      </div>
    </div>
  )
}