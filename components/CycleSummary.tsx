'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function CycleSummary() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    itemsRef.current.forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, scale: 0.5, rotationY: -90 },
        { 
          opacity: 1, 
          scale: 1, 
          rotationY: 0, 
          duration: 0.6, 
          delay: index * 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })
  }, [])

  const cycles = [
    { name: 'ECHO', color: '#00d4ff', description: 'The cosmic awakening' },
    { name: 'VOID', color: '#8b5cf6', description: 'Source of raw power' },
    { name: 'ASTRO', color: '#14f195', description: 'Refined essence' },
    { name: 'PRODUCTS', color: '#ff6b35', description: 'Your collection' }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-t from-[#050508] to-[#0a0a12] flex items-center justify-center py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          THE CYCLE OF <span className="text-[#00d4ff]">CREATION</span>
        </h2>
        <p className="text-[#9ca3af] mb-12">
          From the Echo's first stir to the products in your hands — every piece of our universe is connected
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cycles.map((cycle, index) => (
            <div
              key={cycle.name}
              ref={el => { itemsRef.current[index] = el }}
              className="relative group"
            >
              <div 
                className="bg-[#0a0a12] rounded-xl p-6 border transition-all duration-300 group-hover:scale-105"
                style={{ borderColor: `${cycle.color}40` }}
              >
                <div 
                  className="text-2xl font-bold mb-2"
                  style={{ color: cycle.color }}
                >
                  {cycle.name}
                </div>
                <div className="text-xs text-[#6b7280]">
                  {cycle.description}
                </div>
              </div>
              
              {index < cycles.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 text-[#00d4ff] text-xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-sm text-[#6b7280] font-mono">
          EVERY CARD. EVERY COLLECTIBLE. EVERY STORY.
        </div>
      </div>
    </div>
  )
}