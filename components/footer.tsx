'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const footerLinks = {
  discover: [
    { label: 'Story', href: '#story' },
    { label: 'Journal', href: '#journal' },
    { label: 'Media', href: '#media' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Careers', href: '#careers' },
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

  useEffect(() => {
    if (!footerRef.current || !contentRef.current) return

    // Parallax effect for footer content
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
    <footer ref={footerRef} className="relative">
      {/* Reveal Spacer - This creates the reveal effect */}
      <div className="h-screen bg-transparent pointer-events-none" />
      
      {/* Fixed Footer Content */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050508] -z-10">
        <div 
          ref={contentRef}
          className="min-h-screen flex flex-col justify-end py-16 px-4 md:px-8"
        >
          {/* Large Logo */}
          <div className="max-w-7xl mx-auto w-full mb-16">
            <div className="relative overflow-hidden">
              <h2 className="text-[15vw] md:text-[20vw] font-bold text-[#1a1a24] leading-none tracking-tight select-none">
                ASTRO
              </h2>
              {/* Glowing overlay text */}
              <h2 className="absolute inset-0 text-[15vw] md:text-[20vw] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff]/20 to-[#ff6b35]/20 leading-none tracking-tight select-none">
                ASTRO
              </h2>
              {/* Scanlines over text */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />
              </div>
            </div>
          </div>

          {/* Footer Content Grid */}
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Discover Links */}
              <div>
                <h3 className="font-mono text-xs text-[#00d4ff] tracking-[0.2em] mb-4">
                  DISCOVER
                </h3>
                <ul className="space-y-2">
                  {footerLinks.discover.map((link) => (
                    <li key={link.label}>
                      <a 
                        href={link.href}
                        className="text-sm text-[#6b6b7b] hover:text-[#e8e8ec] transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* More Details */}
              <div>
                <h3 className="font-mono text-xs text-[#00d4ff] tracking-[0.2em] mb-4">
                  MORE DETAILS
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-[#6b6b7b]">
                    Contact us at
                  </p>
                  <a 
                    href="mailto:hello@astroverse.com"
                    className="block text-[#e8e8ec] hover:text-[#00d4ff] transition-colors duration-300"
                  >
                    hello@astroverse.com
                  </a>
                  <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#2a2a38] hover:border-[#00d4ff] text-sm text-[#e8e8ec] transition-colors duration-300">
                    Download Brand Book
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Buy On */}
              <div>
                <h3 className="font-mono text-xs text-[#00d4ff] tracking-[0.2em] mb-4">
                  BUY ON
                </h3>
                <a 
                  href="#opensea"
                  className="group inline-flex items-center gap-3 p-4 bg-[#0a0a0f] border border-[#1a1a24] hover:border-[#00d4ff] transition-colors duration-300"
                >
                  <div className="w-8 h-8 bg-[#00d4ff]/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#00d4ff]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 01.187.014c.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 01-.117.199.106.106 0 01-.09.045H6.013a.106.106 0 01-.091-.163zm13.914 1.68a.109.109 0 01-.065.101c-.243.103-1.07.485-1.414.962-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 01-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132-.026.226.017.459.125.67.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 01-.089-.173l.063-.09c.16-.231.391-.586.621-.992.156-.274.308-.566.43-.858.024-.052.043-.107.065-.16.033-.094.067-.182.091-.269a4.57 4.57 0 00.065-.223c.057-.25.081-.514.081-.787 0-.108-.004-.221-.014-.327-.005-.117-.02-.235-.034-.352a3.415 3.415 0 00-.055-.326 4.445 4.445 0 00-.098-.468l-.014-.06c-.03-.108-.056-.21-.09-.317a11.824 11.824 0 00-.328-.972 5.212 5.212 0 00-.142-.355c-.072-.178-.146-.339-.213-.49a3.56 3.56 0 01-.094-.197 4.413 4.413 0 00-.103-.213c-.024-.053-.053-.104-.072-.152l-.211-.388c-.029-.053.019-.118.077-.101l1.32.357h.01l.173.05.192.054.07.019v-.783c0-.379.302-.686.679-.686a.66.66 0 01.477.202.69.69 0 01.2.484V9.92l.141.039c.01.005.022.01.031.017.034.024.084.062.147.11.05.038.103.081.165.13a10.25 10.25 0 01.574.504c.214.199.454.432.684.691.065.074.127.146.192.226.062.079.132.156.19.232.079.104.167.212.241.325.036.053.077.108.112.16.1.14.186.288.271.435.036.072.074.152.106.227.096.216.17.436.219.66.015.044.024.092.03.14l.006.045c.015.06.019.12.024.181.019.195.01.396-.024.6a2.67 2.67 0 01-.1.373c-.034.108-.072.22-.117.33-.09.24-.203.47-.334.69a3.652 3.652 0 01-.142.24c-.053.086-.108.17-.166.251a3.78 3.78 0 01-.219.29 2.58 2.58 0 01-.159.2c-.074.09-.15.177-.231.261-.052.058-.108.115-.166.17-.058.058-.12.113-.182.165a6.86 6.86 0 01-.232.187l-.15.117a.109.109 0 01-.07.025h-1.05v1.347h1.322a1.6 1.6 0 00.834-.262c.075-.052.468-.378.891-.878a.118.118 0 01.056-.04l3.72-1.08a.108.108 0 01.138.101z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-[#e8e8ec] group-hover:text-[#00d4ff] transition-colors duration-300">
                    Opensea
                  </span>
                </a>
              </div>

              {/* Language */}
              <div>
                <h3 className="font-mono text-xs text-[#00d4ff] tracking-[0.2em] mb-4">
                  LANGUAGE
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0f] border border-[#1a1a24] hover:border-[#00d4ff] text-sm text-[#e8e8ec] transition-colors duration-300">
                  <span>EN</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#1a1a24]">
              {/* Legal Links */}
              <div className="flex flex-wrap justify-center gap-4 text-xs text-[#6b6b7b]">
                {footerLinks.legal.map((link, index) => (
                  <span key={link.label} className="flex items-center gap-4">
                    <a 
                      href={link.href}
                      className="hover:text-[#e8e8ec] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                    {index < footerLinks.legal.length - 1 && (
                      <span className="hidden md:inline text-[#2a2a38]">|</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Copyright */}
              <div className="text-xs text-[#6b6b7b]">
                &copy; 2024 ASTRO Protocol. All rights reserved.
              </div>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid */}
          <div className="absolute inset-0 grid-pattern opacity-10" />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
          
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
        </div>
      </div>
    </footer>
  )
}
