// app/community/page.tsx
'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const socialLinks = [
  { name: 'INSTAGRAM', url: 'https://www.instagram.com/enter.astroverse', username: '@enter.astroverse', color: '#E4405F' },
  { name: 'TELEGRAM', url: 'https://t.me/+MvRVE_AG7Iw2NjQx', username: 'Astroverse🚀', color: '#26A5E4' }
]

const contactInfo = [
  { label: 'SUPPORT', value: 'telegram @astroverse_admin', link: 'https://t.me/astroverse_admin' }
]

export default function CommunityPage() {
  const goBack = () => {
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-[#050508]">
      {/* Кнопка Back */}
      <button
        onClick={goBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium text-white/90 group-hover:text-white">Back to Bridge</span>
      </button>

      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/20 via-[#050508] to-[#050508]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.15)_0%,transparent_70%)]" />
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
            <span className="font-mono text-xs text-[#00d4ff] tracking-[0.3em]">COMMUNITY</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            <span className="text-[#e8e8ec]">ASTRO </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">COMMUNITY</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
            Connect with us on social media and stay updated with the latest news.
          </p>
        </div>
      </div>

      {/* Социальные сети */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Follow Us</h2>
          <p className="text-[#6b6b7b] text-sm max-w-2xl mx-auto">
            Join our community and be part of the Astroverse
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-black/40 backdrop-blur-sm border border-[#1a1a24] hover:border-[#00d4ff]/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] hover:translate-x-1"
              style={{ borderColor: `${social.color}40` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" style={{ color: social.color }}>
                    {social.name === 'INSTAGRAM' && (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    )}
                    {social.name === 'TELEGRAM' && (
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.212-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.053-.334-.375-.12l-6.87 4.326-2.96-.924c-.64-.2-.652-.64.133-.954l11.566-4.458c.532-.19.996.128.804.938z"/>
                    )}
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold tracking-wide">{social.name}</div>
                  <div className="text-[#6b6b7b] text-xs">{social.username}</div>
                </div>
                <div className="text-[#00d4ff] text-xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
            </a>
          ))}
        </div>

        {/* Контакты */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="border-t border-[#1a1a24] pt-8">
            <h3 className="text-center text-[#00d4ff] text-xl mb-6 tracking-wider">CONTACT INFO</h3>
            <div className="space-y-4">
              {contactInfo.map((contact, idx) => (
                <div key={idx} className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-[#6b6b7b] text-sm">{contact.label}</span>
                  <a href={contact.link} target="_blank" rel="noopener noreferrer" className="text-white text-sm hover:text-[#00d4ff] transition-colors">{contact.value}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}