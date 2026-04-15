'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { Maximize, X, Play } from 'lucide-react'
import { motion } from 'framer-motion'

interface CargoItem {
  id: string;
  name: string;
  description: string;
  image: string;
  video: string;
  slug: string;
}

const cargoItems: CargoItem[] = [
  {
    id: 'VAPE-001',
    name: 'ASTRO VAPE',
    description: 'Our dual-tank inhale-activated system features a digital screen on the front panel to allow the customers to have a more simplified and smooth experience. Premium build quality with advanced temperature control and long-lasting battery life.',
    image: '/image/vape.webp',
    video: '/video/vape.webm',
    slug: '/vape'
  },
  {
    id: 'FLOWER-002',
    name: 'ASTRO FLOWERS',
    description: 'NEW ASTRO FUEL. EVERY UNIVERSAL RATION PACK IS EQUIPPED WITH A DARK MATTER QUAD INFUSED PREROLL. Premium selection of exotic strains with potent effects and rich terpene profiles.',
    image: '/image/flowers.webp',
    video: '/video/flowers.webm',
    slug: '/flowers'
  },
  {
    id: 'PREROLL-003',
    name: 'ASTRO PREROLLS',
    description: 'Quad Infuse Dark Matter Preroll Experience a supernova of flavor and potency, featuring a perfect fusion of premium flower strains. Each preroll is handcrafted for consistent burn and maximum enjoyment.',
    image: '/image/prerolls.webp',
    video: '/video/prerolls.webm',
    slug: '/prerolls'
  }
];

// Компонент карточки товара в стиле Cargo Bay
const CargoCard = ({ item, index }: { item: CargoItem; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Запуск видео
  const startVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsHovered(true);
        })
        .catch(e => console.log('Video play failed:', e));
    }
  };

  // Остановка видео
  const stopVideo = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
      setIsHovered(false);
    }
  };

  // Для десктопа: при наведении мыши
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    startVideo();
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      stopVideo();
    }, 100);
  };

  // Для мобильных: клик по значку Play
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startVideo();
  };

  // Для мобильных: клик по видео для паузы
  const handleVideoClick = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
      setIsHovered(false);
    }
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.log('Fullscreen error:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full"
    >
      <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        <div className="w-full lg:w-[60%]" ref={containerRef}>
          <div 
            className="relative w-full rounded-2xl overflow-hidden bg-black group/video"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full aspect-video overflow-hidden">
              {isClient && (
                <video
                  ref={videoRef}
                  src={item.video}
                  muted={!isFullscreen}
                  loop
                  playsInline
                  onClick={handleVideoClick}
                  className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 ${
                    isPlaying ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
              
              <img 
                src={item.image}
                alt={item.name}
                className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
                  isPlaying ? 'opacity-0' : 'opacity-100'
                }`}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />
              
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00d4ff] z-30 hidden lg:block" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00d4ff] z-30 hidden lg:block" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00d4ff] z-30 hidden lg:block" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00d4ff] z-30 hidden lg:block" />
              
              <div className="absolute top-4 left-4 z-40 hidden lg:block">
                <div className="px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-[#00d4ff]/50 font-mono text-xs text-[#00d4ff] rounded">
                  ID: {item.id}
                </div>
              </div>
              
              {/* Значок Play в центре - показываем только если видео не играет */}
              {!isPlaying && (
                <div 
                  onClick={handlePlayClick}
                  className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer"
                >
                  <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 border border-[#00d4ff]/50 transition-all duration-300 hover:scale-110 hover:border-[#00d4ff]">
                    <Play className="w-8 h-8 text-[#00d4ff] ml-0.5" />
                  </div>
                </div>
              )}
              
              {isClient && isPlaying && (
                <button
                  onClick={handleFullscreen}
                  className="absolute bottom-4 right-4 z-40 bg-black/60 backdrop-blur-sm rounded-full p-2 border border-white/20"
                >
                  {isFullscreen ? <X className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[40%] space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-gradient-to-r from-[#00d4ff] to-transparent" />
              <span className="text-xs font-mono text-[#00d4ff] tracking-wider">PRODUCT DETAILS</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{item.name}</h3>
            
            <p className="text-[#e8e8ec]/80 text-base md:text-lg leading-relaxed">
              {item.description}
            </p>
            
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#6b6b7b]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6b6b7b]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
                <span>Lab Tested</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6b6b7b]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
                <span>Limited Edition</span>
              </div>
            </div>
          </div>

          <Link
            href={item.slug}
            className="group relative inline-flex items-center gap-3 px-8 py-3 bg-transparent border border-[#2a2a38] hover:border-[#00d4ff] transition-all duration-300 rounded-lg w-full justify-center"
          >
            <span className="text-sm font-medium text-[#e8e8ec]">EXPLORE MORE</span>
            <svg className="w-5 h-5 text-[#00d4ff] group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export function ProjectSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section 
      ref={sectionRef}
      id="products"
      className="relative py-16 sm:py-24 lg:py-32 bg-[#050508] overflow-hidden"
    >
      {/* Фоновые эффекты */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Заголовок секции */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
          <span className="font-mono text-[10px] sm:text-xs text-[#00d4ff] tracking-[0.2em] sm:tracking-[0.3em]">CARGO BAY</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4">
          <span className="text-[#e8e8ec]">ASTRO </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">PRODUCTS</span>
        </h2>
        <p className="text-center text-[#6b6b7b] text-sm sm:text-base max-w-2xl mx-auto px-4">
          Welcome to Astro Universe — where we take your experience to a whole new dimension. 
          Our premium cannabis products are crafted to launch your mind, body, and spirit into the cosmos. 
          Get ready to explore bold flavors, stellar highs, and an otherworldly vibe. The universe is vast, 
          and your journey is just beginning. Buckle up — it's time to elevate with Astro Universe!
        </p>
      </div>

      {/* Карточки продуктов в стиле Cargo Bay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-20 md:gap-28">
          {cargoItems.map((item, index) => (
            <CargoCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>

      {/* Декоративные линии */}
      <div className="absolute left-0 top-1/4 w-16 sm:w-24 lg:w-32 h-px bg-gradient-to-r from-[#00d4ff]/50 to-transparent" />
      <div className="absolute right-0 top-2/3 w-16 sm:w-24 lg:w-32 h-px bg-gradient-to-l from-[#00d4ff]/50 to-transparent" />
    </section>
  )
}