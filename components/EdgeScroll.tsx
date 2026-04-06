'use client'

import { useEffect, useRef } from 'react'

export function EdgeScroll() {
  const edgeScrollRef = useRef<{
    direction: 'up' | 'down' | null;
    animationId: number | null;
    isScrolling: boolean;
  }>({
    direction: null,
    animationId: null,
    isScrolling: false,
  })

  const EDGE_SIZE = 80 // Высота активной зоны в пикселях
  const SCROLL_SPEED = 1.1 // Скорость прокрутки

  const smoothEdgeScroll = () => {
    const state = edgeScrollRef.current
    if (!state.isScrolling) return
    
    const scrollAmount = window.innerHeight * 0.008 * SCROLL_SPEED
    const currentScroll = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    
    let newScroll
    if (state.direction === 'down') {
      newScroll = Math.min(currentScroll + scrollAmount, maxScroll)
    } else if (state.direction === 'up') {
      newScroll = Math.max(currentScroll - scrollAmount, 0)
    } else {
      return
    }
    
    window.scrollTo(0, newScroll)
    
    if ((state.direction === 'down' && newScroll >= maxScroll) ||
        (state.direction === 'up' && newScroll <= 0)) {
      stopEdgeScroll()
      return
    }
    
    state.animationId = requestAnimationFrame(smoothEdgeScroll)
  }

  const startEdgeScroll = (direction: 'up' | 'down') => {
    const state = edgeScrollRef.current
    if (state.isScrolling && state.direction === direction) return
    
    if (state.isScrolling) {
      stopEdgeScroll()
    }
    
    state.isScrolling = true
    state.direction = direction
    smoothEdgeScroll()
  }

  const stopEdgeScroll = () => {
    const state = edgeScrollRef.current
    if (state.animationId) {
      cancelAnimationFrame(state.animationId)
      state.animationId = null
    }
    state.isScrolling = false
    state.direction = null
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseY = e.clientY
      const state = edgeScrollRef.current
      
      if (state.isScrolling) {
        if ((state.direction === 'up' && mouseY > EDGE_SIZE) ||
            (state.direction === 'down' && mouseY < window.innerHeight - EDGE_SIZE)) {
          stopEdgeScroll()
        }
        return
      }
      
      if (mouseY <= EDGE_SIZE) {
        startEdgeScroll('up')
      } else if (mouseY >= window.innerHeight - EDGE_SIZE) {
        startEdgeScroll('down')
      }
    }
    
    const handleMouseDown = () => {
      if (edgeScrollRef.current.isScrolling) stopEdgeScroll()
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Space') {
        if (edgeScrollRef.current.isScrolling) stopEdgeScroll()
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('keydown', handleKeyDown)
      if (edgeScrollRef.current.animationId) {
        cancelAnimationFrame(edgeScrollRef.current.animationId)
      }
    }
  }, [])

  return null
}