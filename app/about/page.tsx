'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Header } from '@/components/header'
import { HeroStoryCombined } from '@/components/hero-story-combined'
import { ComicSection } from '@/components/comic-section'
import { ProjectSection } from '@/components/project-section'
import { FactionsSection } from '@/components/factions-section'
import { GallerySection } from '@/components/gallery-section'
import { Footer } from '@/components/footer'
import { ScrollProgress } from '@/components/ScrollProgress'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function AboutPage() {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(mainRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
      )
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <>
      <ScrollProgress />
      
      {/* Main Content */}
      <div ref={mainRef} className="relative opacity-0">
        {/* Header */}
        <Header />

        {/* Main Wrapper - for reveal footer effect */}
        <div className="relative z-10 bg-[#050508]">
          {/* Hero + Story Combined */}
          <HeroStoryCombined />

          {/* Comic Section */}
          <ComicSection />

          {/* Project Section */}
          <ProjectSection />

          {/* Factions Section */}
          <FactionsSection />

          {/* Gallery Section */}
          <GallerySection />
        </div>

        {/* Footer with reveal effect */}
        <Footer />

        {/* Cursor Follower Effect */}
        <CursorFollower />

        {/* Background Noise */}
        <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.015]">
          <div className="absolute inset-0 noise" />
        </div>
      </div>
    </>
  )
}

// Custom cursor follower component
function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current

    if (!cursor || !follower) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let followerX = 0
    let followerY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // Cursor (fast follow)
      cursorX += (mouseX - cursorX) * 0.2
      cursorY += (mouseY - cursorY) * 0.2
      cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`

      // Follower (slow follow)
      followerX += (mouseX - followerX) * 0.08
      followerY += (mouseY - followerY) * 0.08
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`

      requestAnimationFrame(animate)
    }

    // Handle hover states
    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 0.5, duration: 0.3 })
      gsap.to(follower, { scale: 1.5, duration: 0.3 })
    }

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 })
      gsap.to(follower, { scale: 1, duration: 0.3 })
    }

    // Add listeners
    window.addEventListener('mousemove', handleMouseMove)
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  // Only show on desktop
  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#00d4ff] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
      />
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[#00d4ff]/50 rounded-full pointer-events-none z-[9998] hidden lg:block"
      />
    </>
  )
}