// app/lore/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Starfield } from '@/components/ui/starfield-1';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LorePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Анимации при скролле
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero анимация
      gsap.fromTo('.lore-hero-title',
        { opacity: 0, y: 80, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
      );
      
      gsap.fromTo('.lore-hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
      );
      
      gsap.fromTo('.lore-hero-cta',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.6, ease: 'back.out(0.5)' }
      );
      
      // Анимация карточек при скролле
      sectionsRef.current.forEach((section, i) => {
        if (section) {
          gsap.fromTo(section,
            { 
              opacity: 0, 
              y: 60,
              rotateX: 15,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.8,
              delay: i * 0.1,
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              }
            }
          );
        }
      });
    }, heroRef);
    
    return () => ctx.revert();
  }, []);
  
  const loreData = [
    {
      id: 1,
      title: 'The Great Echo',
      category: 'Mysteries',
      description: 'A mysterious cosmic phenomenon that began emanating from Nexus Prime, connecting minds across the galaxy and awakening ancient powers. The Echo\'s true origin remains unknown, but its influence shapes the destiny of all civilizations.',
      longDescription: 'Scientists theorize the Echo is not a signal but a consciousness—a cosmic entity that has existed since the dawn of time. Those who hear it describe visions of impossible geometries and memories not their own. The Echo does not choose based on worthiness; it awakens what was always there: the truth of who you really are.',
      image: '/image/pan1.webp',
      tags: ['Nexus Prime', 'Echo Mind', 'Cosmic Awakening'],
      color: '#00d4ff',
      accent: 'from-cyan-500 to-blue-500'
    },
    {
      id: 2,
      title: 'The Stellar Federation',
      category: 'Factions',
      description: 'United alliance of human colonies dedicated to exploration, peace, and the protection of inhabited worlds. Founded after the Great Convergence, the Federation represents humanity\'s hope for a unified future among the stars.',
      longDescription: 'The Federation operates on three core principles: exploration without exploitation, peace through understanding, and protection of all sentient life. Their fleet of quantum-drive vessels patrols the outer reaches, while diplomats work tirelessly to maintain fragile alliances with alien species.',
      image: '/image/pan2.webp',
      tags: ['Commander Zara Nova', 'Astro Sovereign', 'Interstellar Alliance'],
      color: '#9945ff',
      accent: 'from-purple-500 to-violet-500'
    },
    {
      id: 3,
      title: 'Quantum Technology',
      category: 'Technology',
      description: 'Advanced technology that harnesses quantum mechanics for faster-than-light travel, reality manipulation, and dimensional communication. Developed through centuries of research, quantum tech is the foundation of interstellar civilization.',
      longDescription: 'Quantum entanglement allows instant communication across light-years. Quantum drives fold space rather than traversing it, reducing journeys that once took generations to mere days. But this power comes at a cost—each jump creates microscopic tears in the fabric of reality.',
      image: '/image/pan3.webp',
      tags: ['Dr. Luna Starweaver', 'Quantum Drive', 'Dimensional Gates'],
      color: '#14f195',
      accent: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      title: 'The Void Entities',
      category: 'Beings',
      description: 'Ancient beings that exist between dimensions, awakened by the Echo\'s call. Neither fully malevolent nor benevolent, they seek to understand the mortal realms while pursuing their own inscrutable goals.',
      longDescription: 'The Void Entities are living paradoxes—existing and not existing simultaneously. They communicate through dreams and visions, their language a symphony of impossible sounds. Some whisper that they are the echoes of universes that came before, preserved in the spaces between realities.',
      image: '/image/pan4.webp',
      tags: ['Void Walkers', 'Echo Sensitives', 'Dimensional Travelers'],
      color: '#ff6b35',
      accent: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      title: 'Nexus Prime',
      category: 'Locations',
      description: 'The legendary planet where the Echo was first detected. A world of impossible geography and ancient ruins, Nexus Prime holds the key to understanding the Echo\'s true purpose.',
      longDescription: 'Nexus Prime exists at a convergence point of dimensional energies. Its mountains float, its oceans flow upward, and its ruins predate all known civilizations. The planet seems to shift and change, as if it were alive—or dreaming. Those who visit report that the Echo is strongest here, almost deafening.',
      image: '/image/pan5.webp',
      tags: ['Ancient Ruins', 'Echo Origin', 'Forbidden Zone'],
      color: '#00d4ff',
      accent: 'from-cyan-500 to-blue-500'
    },
    {
      id: 6,
      title: 'The Keepers',
      category: 'Order',
      description: 'A secretive order dedicated to protecting the secrets of the Echo and maintaining balance across the universe. The Keepers operate from the shadows, guiding civilizations without direct interference.',
      longDescription: 'The Keepers were the first to hear the Echo—or perhaps the Echo created them. Their origins are lost to time, but their purpose remains clear: preserve the balance between order and chaos, light and dark, existence and void. They are watchers, never interveners, bound by an oath older than stars.',
      image: '/image/hero.webp',
      tags: ['Ancient Wisdom', 'Balance Keepers', 'Echo Guardians'],
      color: '#9945ff',
      accent: 'from-purple-500 to-pink-500'
    }
  ];
  
  const categories = ['all', ...new Set(loreData.map(item => item.category))];
  const filteredLore = activeCategory === 'all' 
    ? loreData 
    : loreData.filter(item => item.category === activeCategory);
  
  return (
    <div className="relative min-h-screen bg-[#050508] overflow-x-hidden">
      {/* Фоновый слой с черной дырой и звездами */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#0a0a1a] to-[#050508]" />
        <Starfield
          starColor="rgba(0, 212, 255, 0.6)"
          bgColor="rgba(0, 0, 0, 0)"
          mouseAdjust={true}
          speed={0.2}
          quantity={800}
        />
        {/* Анимированное свечение в центре */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#00d4ff]/5 blur-[120px] animate-pulse" />
      </div>
      
      {/* HERO СЕКЦИЯ — кинематографичная, как в Takamo Universe [citation:3] */}
      <section 
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center px-4 overflow-hidden"
      >
        {/* Параллакс слой */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/image/hero.webp"
            alt="Astro Universe Lore"
            className="w-full h-full object-cover opacity-20 scale-110 animate-slow-zoom"
            style={{ filter: 'brightness(0.4) saturate(0.8)' }}
          />
        </div>
        
        {/* Градиентные наложения */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/10 via-transparent to-[#9945ff]/10" />
        
        {/* Контент */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="lore-hero-title">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
              <span className="font-mono text-xs text-[#00d4ff] tracking-widest">THE ECHO CHRONICLES — VOLUME I</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tighter">
              ASTRO Universe
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#9945ff]"> Lore</span>
            </h1>
          </div>
          
          <p className="lore-hero-subtitle text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Dive deep into the rich history, factions, and mysteries that shape the Astro universe.
            <br />
            <span className="text-[#00d4ff]">The Echo connects all things</span> — discover its secrets.
          </p>
          
<div className="lore-hero-cta mt-10 flex flex-wrap gap-4 justify-center">
  {/* Кнопка BACK - ПЕРВАЯ */}
  <Link href="/about">
    <button className="group relative px-8 py-4 bg-transparent border-2 border-white/20 text-white/70 font-mono text-sm tracking-wider rounded-lg transition-all duration-300 hover:border-[#00d4ff] hover:text-[#00d4ff]">
      <span className="relative z-10 flex items-center gap-2">
        ← BACK
      </span>
    </button>
  </Link>
  
  {/* Кнопка EXPLORE - ВТОРАЯ */}
  <button 
    onClick={() => document.getElementById('lore-grid')?.scrollIntoView({ behavior: 'smooth' })}
    className="group relative px-8 py-4 bg-transparent border-2 border-[#00d4ff] text-[#00d4ff] font-mono text-sm tracking-wider rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#00d4ff] hover:text-black hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]"
  >
    <span className="relative z-10 flex items-center gap-2">
      EXPLORE
      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </span>
    <span className="absolute inset-0 bg-[#00d4ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
  </button>
</div>
        </div>
        
        {/* Скролл индикатор */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] font-mono text-white/40 tracking-widest">SCROLL</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>
      
      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div id="lore-grid" className="relative z-10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Категории фильтр — как в Star Atlas с HUD-стилем [citation:4] */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 font-mono text-sm tracking-wide rounded-lg transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#00d4ff] text-black shadow-[0_0_20px_rgba(0,212,255,0.5)]'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* Сетка карточек — дизайн вдохновлен Cosmic UI Lite [citation:5][citation:9] */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredLore.map((item, index) => (
              <article
                key={item.id}
                ref={(el) => { sectionsRef.current[index] = el; }}
                className="group relative bg-[#0a0a12]/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#2a2a3a] hover:border-[#00d4ff]/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,212,255,0.15)]"
              >
                {/* Изображение с параллакс-эффектом при наведении */}
                <div className="relative h-64 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent z-10"
                    style={{ background: `linear-gradient(to top, #050508, transparent 60%)` }}
                  />
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Категория бейдж */}
                  <div className="absolute top-4 left-4 z-20">
                    <span 
                      className="text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm border"
                      style={{ 
                        backgroundColor: `${item.color}20`,
                        borderColor: `${item.color}40`,
                        color: item.color
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  
                  {/* Светящийся акцент */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}80, transparent)` }}
                  />
                </div>
                
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[#00d4ff] transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 border-l-2 border-[#00d4ff]/30 pl-4 italic">
                    {item.longDescription}
                  </p>
                  
                  {/* Теги как в Takamo Universe */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-white/40 hover:text-white/70 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Кнопка Read More с анимацией */}
                  <button className="group/btn flex items-center gap-2 text-sm font-mono transition-all hover:gap-3" style={{ color: item.color }}>
                    <span>READ THE CHRONICLE</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
                
                {/* Декоративные уголки как в Cosmic UI [citation:9] */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#00d4ff]/20 group-hover:border-[#00d4ff]/50 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#00d4ff]/20 group-hover:border-[#00d4ff]/50 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#00d4ff]/20 group-hover:border-[#00d4ff]/50 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#00d4ff]/20 group-hover:border-[#00d4ff]/50 transition-all duration-300" />
              </article>
            ))}
          </div>
        </div>
      </div>
      
      {/* ЦИТАТА СЕКЦИЯ — атмосферная, как в Seance [citation:1] */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 via-transparent to-[#9945ff]/5" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="text-[#00d4ff] text-7xl font-serif opacity-20 mb-4">"</div>
          <p className="text-2xl md:text-3xl text-white/80 italic leading-relaxed">
            The Echo does not choose the worthy or the unworthy. 
            <br />
            It simply awakens what was always there — 
            <span className="text-[#00d4ff]"> the truth of who you really are.</span>
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#00d4ff]" />
            <span className="font-mono text-sm text-[#00d4ff] tracking-wider">KEEPER'S CODEX — VERSE 7</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#00d4ff]" />
          </div>
        </div>
      </section>
      
      {/* TIMELINE СЕКЦИЯ — добавляет глубины лору */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="font-mono text-[#00d4ff] text-sm tracking-widest">COSMIC TIMELINE</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">The Echo's Awakening</h2>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent mx-auto mt-4" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { year: 'Era Zero', title: 'The First Echo', desc: 'The cosmic phenomenon is detected at Nexus Prime' },
              { year: 'Year 1', title: 'The Awakening', desc: 'First individuals begin hearing the Echo\'s call' },
              { year: 'Year 47', title: 'The Convergence', desc: 'Factions unite to study the Echo\'s purpose' },
              { year: 'Present', title: 'The Revelation', desc: 'Ancient truths about the Echo emerge' }
            ].map((item, i) => (
              <div key={i} className="relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 group hover:border-[#00d4ff]/30 transition-all duration-300">
                <div className="text-[#00d4ff] font-mono text-sm mb-2">{item.year}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-0 h-0 group-hover:w-full group-hover:h-px bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA СЕКЦИЯ */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/10 via-[#9945ff]/10 to-[#00d4ff]/10 rounded-3xl" />
            <div className="absolute inset-0 backdrop-blur-xl rounded-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to begin your journey?
              </h2>
              <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                The Echo awaits. Discover more stories, collectible cards, and the complete Astro experience.
              </p>
              <Link href="/about">
                <button className="px-8 py-4 bg-gradient-to-r from-[#00d4ff] to-[#00a0cc] text-black font-bold rounded-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all duration-300">
                  EXPLORE THE ASTROUNIVERSE
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Добавляем CSS анимации */}
      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-out forwards;
        }
      `}</style>
    </div>
  );
}