'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const footerLinks = {
  discover: [
    { label: 'Universe', href: '#universe' },
    { label: 'Map', href: '#world' },       
    { label: 'Cards', href: '#cards' }, 
    { label: 'Comic', href: '#comic' },
    { label: 'Products', href: '#products' },
  ],
  community: [
    { label: 'Instagram', href: 'https://www.instagram.com/enter.astroverse', external: true },
    { label: 'Telegram', href: 'https://t.me/+MvRVE_AG7Iw2NjQx', external: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Legal License', href: '#license' },
  ]
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  const handleLinkClick = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank', 'noopener noreferrer')
    } else {
      smoothScrollTo(href.replace('#', ''))
    }
  }

  useEffect(() => {
    if (!footerRef.current || !contentRef.current) return

    gsap.to(contentRef.current, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <footer ref={footerRef} className="relative z-0">
      {/* Reveal Spacer */}
      <div className="h-screen bg-transparent" />
      
      {/* Fixed Footer Content */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050508] pointer-events-none">
        <div 
          ref={contentRef}
          className="flex flex-col justify-end min-h-screen py-8 md:py-16 px-4 md:px-8 pointer-events-auto"
        >
          {/* Large Logo */}
          <div className="max-w-7xl mx-auto w-full mb-8 md:mb-16">
            <div className="relative overflow-hidden">
              <h2 className="text-[12vw] md:text-[20vw] font-bold text-[#1a1a24] leading-none tracking-tight select-none">
                ASTRO
              </h2>
              <h2 className="absolute inset-0 text-[12vw] md:text-[20vw] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff]/20 to-[#ff6b35]/20 leading-none tracking-tight select-none">
                ASTRO
              </h2>
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />
              </div>
            </div>
          </div>

          {/* Footer Content Grid */}
          <div className="max-w-7xl mx-auto w-full mt-auto">
            {/* Десктопная версия - 2 колонки */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 mb-12">
              {/* Discover Links */}
              <div>
                <h3 className="font-mono text-xs text-[#00d4ff] tracking-[0.2em] mb-4">
                  DISCOVER
                </h3>
                <ul className="space-y-2">
                  {footerLinks.discover.map((link) => (
                    <li key={link.label}>
                      <button 
                        onClick={() => smoothScrollTo(link.href.replace('#', ''))}
                        className="text-sm text-[#6b6b7b] hover:text-[#e8e8ec] transition-colors duration-300 cursor-pointer"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community Links */}
              <div>
                <h3 className="font-mono text-xs text-[#00d4ff] tracking-[0.2em] mb-4">
                  COMMUNITY
                </h3>
                <ul className="space-y-2">
                  {footerLinks.community.map((link) => (
                    <li key={link.label}>
                      <button 
                        onClick={() => handleLinkClick(link.href, link.external)}
                        className="text-sm text-[#6b6b7b] hover:text-[#e8e8ec] transition-colors duration-300 cursor-pointer flex items-center gap-2"
                      >
                        {link.label}
                        {link.external && (
                          <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Мобильная версия - 2 столбца */}
            <div className="grid grid-cols-2 gap-6 md:hidden mb-8">
              {/* Discover Links */}
              <div>
                <h3 className="font-mono text-lg text-[#00d4ff] tracking-[0.2em] mb-4">
                  DISCOVER
                </h3>
                <ul className="space-y-3">
                  {footerLinks.discover.map((link) => (
                    <li key={link.label}>
                      <button 
                        onClick={() => smoothScrollTo(link.href.replace('#', ''))}
                        className="text-base text-[#6b6b7b] hover:text-[#e8e8ec] transition-colors duration-300 cursor-pointer"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community Links */}
              <div>
                <h3 className="font-mono text-lg text-[#00d4ff] tracking-[0.2em] mb-4">
                  COMMUNITY
                </h3>
                <ul className="space-y-3">
                  {footerLinks.community.map((link) => (
                    <li key={link.label}>
                      <button 
                        onClick={() => handleLinkClick(link.href, link.external)}
                        className="text-base text-[#6b6b7b] hover:text-[#e8e8ec] transition-colors duration-300 cursor-pointer flex items-center gap-2"
                      >
                        {link.label}
                        {link.external && (
                          <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6 md:pt-8 border-t border-[#1a1a24]">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {footerLinks.legal.map((link, index) => (
                  <span key={link.label} className="flex items-center gap-3 md:gap-4">
                    <button 
                      onClick={() => smoothScrollTo(link.href.replace('#', ''))}
                      className="hover:text-[#e8e8ec] transition-colors duration-300 cursor-pointer text-base md:text-xs"
                    >
                      {link.label}
                    </button>
                    {index < footerLinks.legal.length - 1 && (
                      <span className="hidden md:inline text-[#2a2a38]">|</span>
                    )}
                  </span>
                ))}
              </div>
              <div className="text-base md:text-xs text-[#6b6b7b]">
                &copy; 2026 ASTRO Protocol. All rights reserved.
              </div>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
        </div>
      </div>
    </footer>
  )
}