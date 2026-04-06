'use client'

import { useState, useRef, useEffect } from 'react'

export function ScrollToBottomButton() {
  const [isScrolling, setIsScrolling] = useState(false)
  const animationRef = useRef<number | null>(null)

  const smoothScrollTo = (targetY: number, duration: number) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    
    const startY = window.scrollY
    const distance = targetY - startY
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(1, elapsed / duration)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      window.scrollTo(0, startY + distance * easeProgress)
      
      if (progress < 1 && animationRef.current) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        animationRef.current = null
        setIsScrolling(false)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }

  const startAutoScroll = () => {
    if (isScrolling) return
    setIsScrolling(true)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    smoothScrollTo(maxScroll, 8000) // 8 секунд
  }

  const stopAutoScroll = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setIsScrolling(false)
  }

  return (
    <button
      onClick={() => {
        if (isScrolling) {
          stopAutoScroll()
        } else {
          startAutoScroll()
        }
      }}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black/80 backdrop-blur-sm border border-[#00d4ff] flex items-center justify-center hover:scale-110 transition-all"
    >
      {isScrolling ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      )}
    </button>
  )
}