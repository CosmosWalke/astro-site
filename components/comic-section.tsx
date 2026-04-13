'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ComicSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const flairLeftRef = useRef<HTMLImageElement>(null)
  const flairRightRef = useRef<HTMLImageElement>(null)

  // Общая ссылка на комикс
  const comicUrl = "https://heyzine.com/flip-book/d2e1bcc5d9.html#page/1"

  const panels = [
    { title: 'Chapter 1: The Void', img: '/image/comi1.png', large: true },
    { title: 'Chapter 2: The Awakening', img: '/image/comi2.png', large: true },
    { title: 'Chapter 3: The Journey', img: '/image/comi3.png' },
    { title: 'Chapter 4: The Battle', img: '/image/comi4.png' },
    { title: 'Chapter 5: The Revelation', img: '/image/comi5.png' },
    { title: 'Chapter 6: The New Dawn', img: '/image/comi6.png' },
  ]

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Initial state - all starts hidden, flair off to sides
      gsap.set(mainContentRef.current, { y: 50, opacity: 0 })
      gsap.set(flairLeftRef.current, { x: -200, opacity: 0 })
      gsap.set(flairRightRef.current, { x: 200, opacity: 0 })

      // Single timeline for synchronized animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
        }
      })

      // Everything animates together
      tl.to(mainContentRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }, 0)

      tl.to(flairLeftRef.current, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }, 0)

      tl.to(flairRightRef.current, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }, 0)

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef} 
      id="comic"
      className="relative py-20 min-h-screen overflow-hidden"
    >
      {/* Фоновое изображение через Next.js Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/image/comicsback.webp"
          alt="Comics background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        {/* Затемнение поверх фона */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Дополнительный эффект винтажной зернистости */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            backgroundSize: 'cover'
          }}
        />
      </div>

      {/* Decorative flair - Left */}
      <img 
        ref={flairLeftRef}
        src= '/image/leftcomi.webp'
        alt="" 
        className="absolute top-0 w-[320px] object-contain object-top pointer-events-none hidden xl:block"
        style={{ zIndex: 5, left: 'calc(50% - 610px)' }}
      />
      
      {/* Decorative flair - Right */}
      <img 
        ref={flairRightRef}
        src='/image/rightcomi.webp' 
        alt="" 
        className="absolute top-0 w-[320px] object-contain object-top pointer-events-none hidden xl:block"
        style={{ zIndex: 5, right: 'calc(50% - 610px)' }}
      />

      {/* Main content */}
      <main 
        ref={mainContentRef}
        className="relative max-w-[800px] mx-auto px-4"
        style={{ zIndex: 10 }}
      >
        {/* Header */}
        <header 
          className="relative overflow-hidden rounded-t-lg"
          style={{ 
            backgroundColor: 'hsl(192, 43%, 46%)',
            border: '3px solid hsl(188, 9%, 17%)'
          }}
        >
          {/* Pattern overlay */}
          <div 
            className="absolute inset-0 opacity-25 z-[1] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          {/* Logo banner */}
          <img 
            src="/image/comiheader.webp" 
            alt="We Read Comics" 
            className="relative z-[2] block w-full h-auto mx-auto py-4"
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
          
          {/* Issue number */}
          <div className="absolute right-4 top-4 z-[3]">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: 'hsl(345, 54%, 59%)',
                border: '3px solid hsl(188, 9%, 17%)'
              }}
            >
              <span 
                style={{ 
                  fontFamily: '"Bangers", cursive',
                  fontSize: '1.5rem',
                  color: 'white'
                }}
              >
                #1
              </span>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav 
          className="flex"
          style={{ 
            backgroundColor: 'hsl(48, 70%, 57%)',
            border: '3px solid hsl(188, 9%, 17%)',
            borderTop: 'none',
            fontFamily: '"Bangers", cursive',
            fontSize: '1.1rem'
          }}
        >
          <div 
            className="relative flex items-center justify-center px-4 py-2"
            style={{ backgroundColor: 'hsl(345, 54%, 59%)' }}
          >
            <span className="text-white">In this Issue...</span>
            <div 
              className="absolute right-[-12px] top-0 h-full w-6"
              style={{
                backgroundColor: 'hsl(345, 54%, 59%)',
                clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
              }}
            />
          </div>
          <div className="flex flex-1 items-center justify-around">
            <span className="px-4 py-2 hover:underline cursor-pointer"></span>
            <span className="px-4 py-2 hover:underline cursor-pointer"></span>
            <span className="px-4 py-2 hover:underline cursor-pointer"></span>
          </div>
        </nav>

        {/* Comic panels grid - каждая панель обернута в ссылку */}
        <div 
          className="grid gap-3 p-4"
          style={{ 
            gridTemplateColumns: 'repeat(2, 1fr)',
            backgroundColor: 'hsl(48, 70%, 67%)',
            border: '3px solid hsl(188, 9%, 17%)',
            borderTop: 'none'
          }}
        >
          {panels.map((panel, i) => (
            <a
              key={i}
              href={comicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer overflow-hidden block"
              style={{ 
                border: '3px solid hsl(188, 9%, 17%)',
                backgroundColor: 'white',
                textDecoration: 'none'
              }}
            >
              <div className="relative">
                {/* Panel title */}
                <div 
                  className="absolute top-2 left-2 z-10 px-2 py-1"
                  style={{ 
                    fontFamily: '"Patrick Hand SC", cursive',
                    fontSize: '0.9rem',
                    backgroundColor: i % 2 === 0 ? 'hsl(48, 70%, 57%)' : 'hsl(345, 54%, 59%)',
                    border: '2px solid hsl(188, 9%, 17%)',
                    boxShadow: '3px 3px 0 hsla(188, 9%, 17%, 0.5)',
                    color: 'hsl(188, 9%, 17%)'
                  }}
                >
                  <span className="font-bold">{panel.title}</span>
                  <span className="block text-[10px] italic">(Click to Read More)</span>
                </div>
                
                {/* Panel image */}
                <img 
                  src={panel.img} 
                  alt={panel.title}
                  className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-105"
                  style={{ 
                    objectPosition: '50% 20%',
                    filter: 'grayscale(70%) sepia(20%)'
                  }}
                />
                
                {/* Halftone overlay on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, hsl(188, 9%, 17%) 1px, transparent 1px)',
                    backgroundSize: '4px 4px'
                  }}
                />
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <a
          href={comicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div 
            className="text-center py-4 rounded-b-lg transition-all duration-300 hover:brightness-110 cursor-pointer"
            style={{ 
              backgroundColor: 'hsl(192, 43%, 46%)',
              border: '3px solid hsl(188, 9%, 17%)',
              borderTop: 'none',
              fontFamily: "'CCUltimatum', system-ui, sans-serif",
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '400',
              letterSpacing: '0.05em'
            }}
          >
            Read More Comics
          </div>
        </a>
      </main>
    </section>
  )
}