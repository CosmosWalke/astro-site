// components/CommunityModal.tsx
'use client'

import { useEffect, useState } from 'react'

const socialLinks = [
  { name: 'INSTAGRAM', url: 'https://instagram.com/astrocommunity', username: '@astrocommunity', color: '#E4405F' },
  { name: 'X (TWITTER)', url: 'https://twitter.com/astrocommunity', username: '@astrocommunity', color: '#1DA1F2' },
  { name: 'YOUTUBE', url: 'https://youtube.com/@astrocommunity', username: '@astrocommunity', color: '#FF0000' },
  { name: 'TELEGRAM', url: 'https://t.me/astrocommunity', username: '@astrocommunity', color: '#26A5E4' },
  { name: 'DISCORD', url: 'https://discord.gg/astrocommunity', username: 'discord.gg/astro', color: '#5865F2' },
  { name: 'WHATSAPP', url: 'https://wa.me/1234567890', username: '+1 (234) 567-890', color: '#25D366' }
]

const contactInfo = [
  { label: 'SUPPORT', value: 'support@astro.com', link: 'mailto:support@astro.com' },
  { label: 'PARTNERS', value: 'partners@astro.com', link: 'mailto:partners@astro.com' },
  { label: 'PRESS', value: 'press@astro.com', link: 'mailto:press@astro.com' },
  { label: 'HOTLINE', value: '+1 (800) ASTRO-123', link: 'tel:+18002786123' }
]

interface CommunityModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CommunityModal({ isOpen, onClose }: CommunityModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !isOpen) return null

  return (
    <div className="community-modal" style={{ display: 'flex' }}>
      <div className="community-modal-content">
        <div className="community-modal-close" onClick={onClose}>×</div>
        <div className="community-title">COMMUNITY</div>
        <div className="community-subtitle">CONNECT WITH US</div>
        
        <div className="social-grid">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
              style={{ borderColor: `${social.color}40` }}
              onClick={onClose}
            >
              <div className="social-icon">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  {social.name === 'INSTAGRAM' && (
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  )}
                  {social.name === 'X (TWITTER)' && (
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  )}
                  {social.name === 'YOUTUBE' && (
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  )}
                  {social.name === 'TELEGRAM' && (
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.212-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.053-.334-.375-.12l-6.87 4.326-2.96-.924c-.64-.2-.652-.64.133-.954l11.566-4.458c.532-.19.996.128.804.938z"/>
                  )}
                  {social.name === 'DISCORD' && (
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.398-.875-.608-1.25a.077.077 0 0 0-.079-.037c-1.768.32-3.424.887-4.886 1.515a.072.072 0 0 0-.032.027c-2.876 4.29-3.661 8.48-3.273 12.62a.071.071 0 0 0 .026.047c2.042 1.5 4.02 2.41 5.962 3.01a.074.074 0 0 0 .08-.026c.464-.63.876-1.295 1.226-1.995a.074.074 0 0 0-.04-.105c-.675-.256-1.32-.565-1.94-.925a.074.074 0 0 1-.025-.104c.131-.19.264-.384.402-.579a.074.074 0 0 1 .082-.024c4.07 1.86 8.48 1.86 12.5 0a.074.074 0 0 1 .083.024c.138.195.27.389.402.579a.074.074 0 0 1-.025.104c-.62.36-1.265.669-1.94.925a.074.074 0 0 0-.04.105c.35.7.762 1.365 1.226 1.995a.074.074 0 0 0 .08.026c1.942-.6 3.92-1.51 5.962-3.01a.074.074 0 0 0 .026-.047c.465-4.18-.694-8.33-3.273-12.62a.072.072 0 0 0-.032-.027zM8.3 15.385c-1.2 0-2.186-1.1-2.186-2.45s.97-2.45 2.186-2.45c1.216 0 2.186 1.1 2.186 2.45s-.97 2.45-2.186 2.45zm7.4 0c-1.2 0-2.186-1.1-2.186-2.45s.97-2.45 2.186-2.45c1.216 0 2.186 1.1 2.186 2.45s-.97 2.45-2.186 2.45z"/>
                  )}
                  {social.name === 'WHATSAPP' && (
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm-.04 18.19c-1.49 0-2.95-.39-4.24-1.14l-.3-.18-3.12.82.83-3.04-.2-.31c-.83-1.35-1.27-2.89-1.27-4.46 0-4.58 3.73-8.31 8.31-8.31 4.58 0 8.31 3.73 8.31 8.31 0 4.58-3.73 8.31-8.31 8.31zm4.55-6.21c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.57.13-.17.26-.66.81-.81.98-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.15-.26-.02-.39.11-.52.11-.11.25-.29.38-.43.13-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.49-.41-.43-.56-.43h-.48c-.17 0-.43.06-.66.32-.23.26-.89.87-.89 2.12 0 1.25.91 2.45 1.04 2.62.13.17 1.8 2.74 4.36 3.84.61.26 1.09.42 1.46.54.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.21-.17-.45-.3z"/>
                  )}
                </svg>
              </div>
              <div className="social-info">
                <div className="social-name">{social.name}</div>
                <div className="social-username">{social.username}</div>
              </div>
              <div className="social-arrow">→</div>
            </a>
          ))}
        </div>
        
        <div className="contacts-section">
          <div className="contacts-title">CONTACT INFO</div>
          {contactInfo.map((contact, idx) => (
            <div key={idx} className="contact-item">
              <span className="contact-label">{contact.label}</span>
              <a href={contact.link} className="contact-value">{contact.value}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}