// app/prerolls/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';

interface Fruit {
  src: string;
  sizeMobile: number;
  sizeDesktop: number;
  leftMobile: string;
  leftDesktop: string;
  topMobile: string;
  topDesktop: string;
  delay: number;
  rotate?: number;
}

interface ExtraElement {
  src: string;
  sizeMobile: number;
  sizeDesktop: number;
  leftMobile: string;
  leftDesktop: string;
  topMobile: string;
  topDesktop: string;
  rotate?: number;
  yOffset?: number;
  rotateAmount?: number;
  duration?: number;
  zIndex?: number;
}

interface FlavorInfo {
  name: string;
  type: string;
  description: string;
  fullDescription?: string;
}

interface FeatureInfo {
  title: string;
  description: string;
  featuresList: string[];
}

interface PrerollFlavor {
  id: string;
  name: string;
  bgImage: string;
  bgImageMobile: string;
  prerollMainImage: string;
  preroll: ExtraElement;
  tube: ExtraElement;
  fruits: Fruit[];
  flavorsList: FlavorInfo[];
}

const featuresData: Record<string, FeatureInfo> = {
  preroll: {
    title: 'Quad Infuse Dark Matter Preroll',
    description: 'Experience a supernova of flavor and potency, featuring a perfect fusion of premium flower strains.',
    featuresList: [
      '6x0.75g (4.5g total)',
      'Ice Water Bubble Hash',
      'THCA coated',
      'Live Resin infused',
      'Natural Terpenes',
      'Great Taste, Extra Strength'
    ]
  },
  gummies: {
    title: 'Rosin Gummies',
    description: 'Secret encrypted galactic flavor that will transport your taste buds to another dimension.',
    featuresList: [
      'Solventless rosin infusion',
      'Secret encrypted galactic flavor',
      'Vegan & gluten-free',
      'Lab-tested for potency',
      'Fast-acting formula',
      'Delicious cosmic taste'
    ]
  },
  card: {
    title: 'Limited Edition Collector\'s Card',
    description: 'Collect legendary cards featuring your favorite characters, ships, and worlds from the Astro universe. Each card is beautifully designed with unique artwork and special abilities.',
    featuresList: [
      'Unique artwork designs',
      'Special abilities and stats',
      '4-tier exclusive collection',
      'Limited edition numbering',
      'Holographic finish'
    ]
  }
};

const flavors: PrerollFlavor[] = [
  {
    id: 'cosmic-selection',
    name: 'ASTRO SPARK',
    bgImage: '/prerolls/solar-flare/bg.webp',
    bgImageMobile: '/prerolls/solar-flare/bgmobile.webp',
    prerollMainImage: '/prerolls/solar-flare/prerollmain.webp',
    preroll: {
      src: '/prerolls/solar-flare/preroll.webp',
      sizeMobile: 130,
      sizeDesktop: 180,
      leftMobile: '25%',
      leftDesktop: '37%',
      topMobile: '58%',
      topDesktop: '50%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/prerolls/solar-flare/tube.webp',
      sizeMobile: 300,
      sizeDesktop: 480,
      leftMobile: '70%',
      leftDesktop: '65%',
      topMobile: '85%',
      topDesktop: '40%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 22,
    },
    fruits: [
      { 
        src: '/prerolls/solar-flare/fruit1.webp', 
        sizeMobile: 140, 
        sizeDesktop: 280,
        leftMobile: '20%', 
        leftDesktop: '25%',
        topMobile: '18%', 
        topDesktop: '08%',
        delay: 0 
      },
      { 
        src: '/prerolls/solar-flare/fruit2.webp', 
        sizeMobile: 95, 
        sizeDesktop: 130,
        leftMobile: '68%', 
        leftDesktop: '70%',
        topMobile: '25%', 
        topDesktop: '35%',
        delay: 1.2 
      },
      { 
        src: '/prerolls/solar-flare/fruit3.webp', 
        sizeMobile: 165, 
        sizeDesktop: 200,
        leftMobile: '60%', 
        leftDesktop: '65%',
        topMobile: '25%', 
        topDesktop: '65%',
        delay: 0.6, 
        rotate: -18 
      },
      { 
        src: '/prerolls/solar-flare/fruit4.webp', 
        sizeMobile: 85, 
        sizeDesktop: 250,
        leftMobile: '72%', 
        leftDesktop: '67%',
        topMobile: '70%', 
        topDesktop: '70%',
        delay: 2.1 
      },
    ],
    flavorsList: [
      {
        name: 'Watermelon',
        type: 'Hybrid',
        description: 'Sweet and juicy watermelon flavor with a refreshing finish.',
        fullDescription: 'Watermelon is a deliciously sweet and fruity Hybrid strain that delivers the nostalgic taste of fresh-cut watermelon on a summer day. The flavor profile features ripe melon notes with subtle candy-like sweetness and a hint of tropical fruit. Effects are uplifting and relaxing, providing a balanced experience that soothes the body while keeping the mind clear and focused. Perfect for daytime relaxation or social gatherings where you want to feel good without being overwhelmed.'
      },
      {
        name: 'Fruit Punch',
        type: 'Sativa',
        description: 'An explosive blend of tropical fruits with an energizing punch.',
        fullDescription: 'Fruit Punch is an invigorating Sativa-dominant strain that delivers a vibrant explosion of mixed tropical flavors. The taste profile features sweet pineapple, tangy orange, juicy mango, and hints of passionfruit, creating a complex and refreshing experience. Effects are energetic and uplifting, promoting creativity, focus, and social energy. Ideal for morning sessions, creative projects, or any time you need a burst of motivation and good vibes.'
      },
      {
        name: 'Blue Raspberry',
        type: 'Indica',
        description: 'Sweet and tart blue raspberry candy flavor with deeply relaxing effects.',
        fullDescription: 'Blue Raspberry is a deliciously nostalgic Indica-dominant strain that captures the sweet and tart essence of classic blue raspberry candy. The flavor profile features bold blueberry and raspberry notes with a hint of candy-like sweetness on the exhale. Effects are deeply relaxing and soothing, melting away stress and tension while promoting a sense of calm and tranquility. Perfect for evening use when you want to unwind, relax, and enjoy a flavorful journey.'
      }
    ],
  },
];

export default function PrerollsPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showFlavors, setShowFlavors] = useState(false);
  const [expandedFlavor, setExpandedFlavor] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const activeFlavor = flavors[activeIndex];
  const prevFlavor = flavors[prevIndex];

  useEffect(() => {
    setPrevIndex(activeIndex);
  }, [activeIndex]);

  // Определяем мобильное устройство
// В компоненте VapePage замени useEffect на этот:
useEffect(() => {
  // Используем физическую ширину экрана (не меняется при повороте)
  const physicalWidth = window.screen.width;
  const physicalHeight = window.screen.height;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1;
  
  // Если есть touch И физическая ширина меньше 1024px - это мобильное устройство
  const isMobileDevice = hasTouch && (physicalWidth < 1024 || physicalHeight < 1024);
  
  setIsMobile(isMobileDevice);
}, []); // Пустой массив - определяем только один раз

  // Получаем текущие размеры и позиции для элемента (preroll, tube)
  const getElementStyles = (element: ExtraElement) => {
    const size = isMobile ? element.sizeMobile : element.sizeDesktop;
    const left = isMobile ? element.leftMobile : element.leftDesktop;
    const top = isMobile ? element.topMobile : element.topDesktop;
    
    return {
      size,
      left,
      top,
      marginLeft: -size / 2,
      marginTop: -size / 2,
    };
  };

  // Получаем текущие размеры и позиции для фруктов
  const getFruitStyles = (fruit: Fruit) => {
    const size = isMobile ? fruit.sizeMobile : fruit.sizeDesktop;
    const left = isMobile ? fruit.leftMobile : fruit.leftDesktop;
    const top = isMobile ? fruit.topMobile : fruit.topDesktop;
    
    return {
      size,
      left,
      top,
    };
  };

  // Модальное окно с описанием фичи
  const FeatureModal = () => {
    if (!selectedFeature) return null;
    const data = featuresData[selectedFeature];
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={() => setSelectedFeature(null)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 max-w-md w-full border border-white/20 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setSelectedFeature(null)}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">{data.title}</h3>
            <p className="text-[#00d4ff] text-sm">{data.description}</p>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-white">Features:</h4>
              <ul className="space-y-2">
                {data.featuresList.map((feature, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-[#00d4ff] mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Описание продукта с кликабельными кнопками
  const DescriptionContent = () => (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">Booster pack contains</h3>
        <div className="space-y-4 md:space-y-6">
          <button
            onClick={() => setSelectedFeature('preroll')}
            className="w-full text-left group cursor-pointer"
          >
            <p className="font-semibold text-[#00d4ff] text-base md:text-xl group-hover:text-[#00d4ff]/80 transition-colors">Quad Infuse Dark Matter Preroll</p>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">6x0.75g (4.5g total)</p>
          </button>
          <button
            onClick={() => setSelectedFeature('gummies')}
            className="w-full text-left group cursor-pointer"
          >
            <p className="font-semibold text-[#00d4ff] text-base md:text-xl group-hover:text-[#00d4ff]/80 transition-colors">Rosin Gummies</p>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">Secret encrypted galactic flavor</p>
          </button>
          <button
            onClick={() => setSelectedFeature('card')}
            className="w-full text-left group cursor-pointer"
          >
            <p className="font-semibold text-[#00d4ff] text-base md:text-xl group-hover:text-[#00d4ff]/80 transition-colors">Limited Edition Collector&apos;s Card</p>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">Unlock the mysteries of the Astro Universe with our 4-tier exclusive collection.</p>
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">Features:</h3>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button
            onClick={() => setSelectedFeature('preroll')}
            className="px-3 py-1 md:px-4 md:py-2 bg-[#00d4ff]/20 border border-[#00d4ff]/50 rounded-full text-sm md:text-base text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all cursor-pointer"
          >
            Preroll
          </button>
          <button
            onClick={() => setSelectedFeature('gummies')}
            className="px-3 py-1 md:px-4 md:py-2 bg-[#00d4ff]/20 border border-[#00d4ff]/50 rounded-full text-sm md:text-base text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all cursor-pointer"
          >
            Gummies
          </button>
          <button
            onClick={() => setSelectedFeature('card')}
            className="px-3 py-1 md:px-4 md:py-2 bg-[#00d4ff]/20 border border-[#00d4ff]/50 rounded-full text-sm md:text-base text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all cursor-pointer"
          >
            Card set
          </button>
        </div>
      </div>
    </div>
  );

  // Компонент списка вкусов с раскрывающимся описанием
  const FlavorsListContent = () => {
    const toggleFlavor = (flavorName: string) => {
      if (expandedFlavor === flavorName) {
        setExpandedFlavor(null);
      } else {
        setExpandedFlavor(flavorName);
      }
    };

    return (
      <div className="space-y-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-5 text-center md:text-left">
          Available Flavors
        </h3>
        <div className="space-y-3 md:space-y-4">
          {activeFlavor.flavorsList.map((flavor, idx) => (
            <div key={idx} className="border-b border-white/10 pb-3">
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => toggleFlavor(flavor.name)}
              >
                <div>
                  <p className={`font-semibold text-sm md:text-base transition-colors ${
                    expandedFlavor === flavor.name ? 'text-[#00d4ff]' : 'text-white group-hover:text-[#00d4ff]'
                  }`}>
                    {flavor.name}
                  </p>
                  <p className="text-xs text-[#00d4ff] opacity-80">{flavor.type}</p>
                </div>
                <motion.svg 
                  className={`w-4 h-4 transition-colors ${
                    expandedFlavor === flavor.name ? 'text-[#00d4ff]' : 'text-white/50 group-hover:text-[#00d4ff]'
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ rotate: expandedFlavor === flavor.name ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </div>
              
              <AnimatePresence>
                {expandedFlavor === flavor.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-[#00d4ff]/30 bg-gradient-to-r from-[#00d4ff]/5 to-transparent rounded-lg p-3">
                      <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                        {flavor.fullDescription || flavor.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="bg-zinc-950 text-white min-h-screen overflow-hidden">
      <div className="relative h-screen w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFlavor.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Фон */}
            <div className="absolute inset-0">
              <picture>
                <source srcSet={activeFlavor.bgImageMobile} media="(max-width: 768px)" />
                <img src={activeFlavor.bgImage} alt="" className="w-full h-full object-cover" />
              </picture>
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Description для десктопа (слева) */}
            {!isMobile && (
              <div className="absolute left-8 top-1/2 -translate-y-1/2 z-[15] max-w-[600px] w-[560px] bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 pointer-events-auto">
                <DescriptionContent />
              </div>
            )}

            {/* Flavors для десктопа (справа) */}
            {!isMobile && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[15] max-w-[400px] w-[360px] bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 pointer-events-auto max-h-[85vh] overflow-y-auto custom-scrollbar">
                <FlavorsListContent />
              </div>
            )}

            {/* TUBE - за центральным изображением - выезжает слева */}
            <motion.div
              key={`tube-${activeFlavor.id}`}
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="absolute pointer-events-none"
              style={{
                left: getElementStyles(activeFlavor.tube).left,
                top: getElementStyles(activeFlavor.tube).top,
                width: getElementStyles(activeFlavor.tube).size,
                height: getElementStyles(activeFlavor.tube).size,
                marginLeft: getElementStyles(activeFlavor.tube).marginLeft,
                marginTop: getElementStyles(activeFlavor.tube).marginTop,
                zIndex: activeFlavor.tube.zIndex || 10,
              }}
            >
              <motion.div
                animate={{
                  y: [0, activeFlavor.tube.yOffset || -15, 0],
                  rotate: [activeFlavor.tube.rotate || 0, (activeFlavor.tube.rotate || 0) + (activeFlavor.tube.rotateAmount || 5), activeFlavor.tube.rotate || 0],
                }}
                transition={{
                  duration: activeFlavor.tube.duration || 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img src={activeFlavor.tube.src} alt="" className="w-full h-full object-contain drop-shadow-xl" />
              </motion.div>
            </motion.div>

            {/* FRUIT3 - ЗА центральным изображением - выезжает справа */}
            {activeFlavor.fruits[2] && (
              <motion.div
                key={`fruit3-${activeFlavor.id}`}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="absolute pointer-events-none"
                style={{ 
                  left: getFruitStyles(activeFlavor.fruits[2]).left, 
                  top: getFruitStyles(activeFlavor.fruits[2]).top, 
                  width: getFruitStyles(activeFlavor.fruits[2]).size, 
                  height: getFruitStyles(activeFlavor.fruits[2]).size, 
                  zIndex: 22
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -35, 0],
                    rotate: [activeFlavor.fruits[2].rotate || 0, (activeFlavor.fruits[2].rotate || 0) + 20, activeFlavor.fruits[2].rotate || 0],
                  }}
                  transition={{
                    duration: 7.5 + 2,
                    repeat: Infinity,
                    delay: activeFlavor.fruits[2].delay,
                    ease: "easeInOut",
                  }}
                >
                  <img src={activeFlavor.fruits[2].src} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
                </motion.div>
              </motion.div>
            )}

            {/* PREROLL - перед центральным изображением - выезжает сверху */}
            <motion.div
              key={`preroll-${activeFlavor.id}`}
              initial={{ opacity: 0, y: -200 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 200 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="absolute pointer-events-none"
              style={{
                left: getElementStyles(activeFlavor.preroll).left,
                top: getElementStyles(activeFlavor.preroll).top,
                width: getElementStyles(activeFlavor.preroll).size,
                height: getElementStyles(activeFlavor.preroll).size,
                marginLeft: getElementStyles(activeFlavor.preroll).marginLeft,
                marginTop: getElementStyles(activeFlavor.preroll).marginTop,
                zIndex: activeFlavor.preroll.zIndex || 30,
              }}
            >
              <motion.div
                animate={{
                  y: [0, activeFlavor.preroll.yOffset || -15, 0],
                  rotate: [activeFlavor.preroll.rotate || 0, (activeFlavor.preroll.rotate || 0) + (activeFlavor.preroll.rotateAmount || -10), activeFlavor.preroll.rotate || 0],
                }}
                transition={{
                  duration: activeFlavor.preroll.duration || 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img src={activeFlavor.preroll.src} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
              </motion.div>
            </motion.div>

            {/* Остальные фрукты (fruit1, fruit2, fruit4) - СКРЫТЫ */}
            {false && activeFlavor.fruits.map((fruit, i) => {
              if (i === 2) return null;
              return (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{ 
                    left: getFruitStyles(fruit).left, 
                    top: getFruitStyles(fruit).top, 
                    width: getFruitStyles(fruit).size, 
                    height: getFruitStyles(fruit).size, 
                    zIndex: 100
                  }}
                  animate={{
                    y: [0, -35, 0],
                    rotate: [fruit.rotate || 0, (fruit.rotate || 0) + 20, fruit.rotate || 0],
                  }}
                  transition={{
                    duration: 7.5 + i,
                    repeat: Infinity,
                    delay: fruit.delay,
                    ease: "easeInOut",
                  }}
                >
                  <img src={fruit.src} alt="" className="w-full h-full object-contain drop-shadow-2xl" />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Модальное окно для фич */}
        <AnimatePresence>
          {selectedFeature && <FeatureModal />}
        </AnimatePresence>

        {/* Кнопка назад */}
        <motion.button
          onClick={() => router.back()}
          className="fixed top-8 left-4 md:top-12 md:left-8 z-50 flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-black/30 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm md:text-base font-medium text-white/90 group-hover:text-white transition-colors duration-300">Back</span>
        </motion.button>

        {/* Кнопки для мобильных */}
        {isMobile && (
          <div className="fixed top-8 right-4 z-50 flex gap-3">
            <motion.button
              onClick={() => setShowDescription(true)}
              className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-medium text-white">Description</span>
            </motion.button>
            <motion.button
              onClick={() => setShowFlavors(true)}
              className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-sm font-medium text-white">Flavors</span>
            </motion.button>
          </div>
        )}

        {/* Модальное окно Description для мобильных */}
        <AnimatePresence>
          {isMobile && showDescription && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setShowDescription(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 max-w-sm w-full border border-white/20 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowDescription(false)}
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <DescriptionContent />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Модальное окно Flavors для мобильных */}
        <AnimatePresence>
          {isMobile && showFlavors && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setShowFlavors(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 max-w-sm w-full border border-white/20 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowFlavors(false)}
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <FlavorsListContent />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Текст сверху - для мобильных по центру и выше, для ПК - в правом верхнем углу */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activeFlavor.id}`}
            className={`z-30 ${
              isMobile 
                ? 'absolute top-24 left-1/2 -translate-x-1/2 text-center whitespace-nowrap' 
                : 'absolute top-12 right-12 text-right'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Скрываем Booster pack на мобильных */}
            {!isMobile && (
              <div className={`uppercase tracking-[5px] text-sm mb-4 opacity-80 ${!isMobile && 'text-right'}`}>
                BOOSTER PACK
              </div>
            )}
            <h2 className={`font-black tracking-tighter drop-shadow-lg ${
              isMobile 
                ? 'text-4xl' 
                : 'text-6xl md:text-8xl text-right'
            }`}>
              {activeFlavor.name}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Центральное изображение prerollmain */}
        <div className="relative z-20 flex items-center justify-center">
          <div className="relative w-[500px] h-[500px] md:w-[750px] md:h-[750px]">
            <img
              src={prevFlavor.prerollMainImage}
              alt=""
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out"
              style={{ opacity: 0 }}
            />
            <img
              src={activeFlavor.prerollMainImage}
              alt={activeFlavor.name}
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out"
              style={{ opacity: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Стили для скроллбара */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.8);
        }
      `}</style>
    </main>
  );
}