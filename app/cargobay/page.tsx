// app/cargobay/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Maximize, X } from 'lucide-react';
import Link from 'next/link';

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

  const stopVideo = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
      setIsHovered(false);
    }
  };

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

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startVideo();
  };

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
              
              {/* Значок Play в центре - ТОЛЬКО ДЛЯ МОБИЛЬНЫХ */}
              {!isPlaying && (
                <div 
                  onClick={handlePlayClick}
                  className="absolute inset-0 z-40 flex items-center justify-center lg:hidden cursor-pointer"
                >
                  <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 border border-[#00d4ff]/50 transition-all duration-300 hover:scale-110 hover:border-[#00d4ff]">
                    <Play className="w-8 h-8 text-[#00d4ff] ml-0.5" />
                  </div>
                </div>
              )}
              
              {isClient && isPlaying && (
                <button
                  onClick={handleFullscreen}
                  className="absolute bottom-4 right-4 z-40 lg:hidden bg-black/60 backdrop-blur-sm rounded-full p-2 border border-white/20"
                >
                  {isFullscreen ? <X className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
                </button>
              )}
              
              <div className="absolute bottom-4 right-4 z-30 hidden lg:block">
                <div className="px-2 py-1 bg-black/60 text-[10px] text-[#6b6b7b] rounded">
                  Hover to play
                </div>
              </div>
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

export default function CargoBayPage() {
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsDesktop(window.innerWidth >= 1024);
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen bg-[#050508]">
      <button
        onClick={goToHome}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium text-white/90 group-hover:text-white">Back to Bridge</span>
      </button>

      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/20 via-[#050508] to-[#050508]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.15)_0%,transparent_70%)]" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#00d4ff]/50" />
              <span className="font-mono text-xs text-[#00d4ff] tracking-[0.3em]">CARGO BAY</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#00d4ff]/50" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
              <span className="text-[#e8e8ec]">CARGO </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">BAY</span>
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
              Browse our collection of premium Astro products. Each item is crafted with precision and care.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Featured Products</h2>
          <p className="text-[#6b6b7b] text-sm max-w-2xl mx-auto">
            {!isMounted ? 'Loading...' : (isDesktop ? 'Hover over any video to see it in action' : 'Tap the play button to watch')}
          </p>
        </div>
        <div className="flex flex-col gap-20 md:gap-28">
          {cargoItems.map((item, index) => (
            <CargoCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Astro Cargo Bay</h3>
          <p className="text-[#6b6b7b] text-sm max-w-2xl mx-auto">
            All products are carefully inspected and packed before shipping. 
            Each item comes with a warranty and tracking number.
          </p>
        </div>
      </div>
    </main>
  );
}