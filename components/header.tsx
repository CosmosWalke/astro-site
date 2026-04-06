'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Menu, X } from 'lucide-react'
import { TextScramble } from "@/components/ui/text-scramble"

const navItems = [
  { label: 'Project', href: '#project' },
  { label: 'The Keep', href: '#keep' },
  { label: 'Factions', href: '#factions' },
  { label: 'The World', href: '#world' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
      )
    }
  }, [])

  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.fromTo(menuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        )
        gsap.fromTo(menuRef.current.querySelectorAll('.menu-item'),
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' }
        )
      }
    }
  }, [isMenuOpen])

  return (
    <>
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#050508]/90 backdrop-blur-md border-b border-[#1a1a24]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <div ref={logoRef} className="relative group">
              <a href="#" className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 border-2 border-[#00d4ff] flex items-center justify-center relative overflow-hidden group-hover:border-[#ff6b35] transition-colors duration-300">
                    <span className="text-xl font-bold text-[#00d4ff] group-hover:text-[#ff6b35] transition-colors duration-300">A</span>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <span className="text-2xl font-bold tracking-[0.2em] text-[#e8e8ec] hidden md:block">
                  ASTRO
                </span>
              </a>
            </div>
<a 
  href="/"
  className="px-4 py-2 bg-[#00d4ff] text-black rounded-full text-sm font-mono hover:shadow-[0_0_15px_#00d4ff] transition-all"
>
  EXPLORE SHIP
</a>
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group relative px-6 py-2 text-sm font-medium text-[#6b6b7b] hover:text-[#e8e8ec] transition-colors duration-300"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#00d4ff] group-hover:w-full transition-all duration-300" />
                  <span className="absolute -top-1 -right-1 text-[10px] font-mono text-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    0{index + 1}
                  </span>
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1a1a24]/50 border border-[#2a2a38]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4ff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4ff]" />
                </span>
                <span className="text-xs font-mono text-[#6b6b7b]">328 Keepers Live</span>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-12 h-12 flex items-center justify-center border border-[#2a2a38] hover:border-[#00d4ff] transition-colors duration-300 group"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-[#e8e8ec]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#e8e8ec]" />
                )}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>

        <div className={`border-t border-[#1a1a24] transition-all duration-500 overflow-hidden ${isScrolled ? 'h-0' : 'h-8'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center">
            <div className="flex items-center gap-4 text-xs font-mono text-[#6b6b7b]">
              <span className="text-[#00d4ff]">Encrypted Protocol</span>
              <span>yq24-43335020</span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">ASTRO Mainnet</span>
            </div>
          </div>
        </div>
      </header>

      {/* Full Screen Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="fixed inset-0 z-40 bg-[#050508]/98 backdrop-blur-lg"
        >
          <div className="absolute inset-0 grid-pattern opacity-20" />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
            {/* Main Navigation - ТОЛЬКО ЗДЕСЬ используем TextScramble с огромным шрифтом */}
            <nav className="flex flex-col items-center gap-2 mb-16">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="menu-item group relative py-4 px-8"
                >
                  <TextScramble 
                    text={item.label.toUpperCase()} 
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wide"
                  />
                  <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-sm font-mono text-[#6b6b7b] group-hover:text-[#00d4ff] transition-colors duration-300">
                    0{index + 1}
                  </span>
                  <span className="absolute -right-16 top-1/2 w-12 h-px bg-[#2a2a38] group-hover:bg-[#00d4ff] group-hover:w-24 transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Secondary Links - БЕЗ TextScramble, обычный текст */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-[#6b6b7b]">
              {['Story', 'Journal', 'Media', 'Gallery', 'About', 'Careers'].map((link) => (
                <a 
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#00d4ff] transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Footer Info - БЕЗ TextScramble, обычный текст */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-[#6b6b7b]">
              <div className="flex items-center gap-4">
                <span>hello@astroverse.com</span>
              </div>
              <div className="flex items-center gap-4">
                <span>PRIVACY POLICY</span>
                <span>|</span>
                <span>TERMS OF SERVICE</span>
              </div>
            </div>
          </div>

          <div className="absolute top-20 left-8 w-32 h-32 border border-[#1a1a24] opacity-50" />
          <div className="absolute bottom-20 right-8 w-48 h-48 border border-[#1a1a24] opacity-50" />
        </div>
      )}
    </>
  )
}