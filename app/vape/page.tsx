// app/vape/page.tsx

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

interface VapeFlavor {
  id: string;
  name: string;
  bgImage: string;
  bgImageMobile: string;
  vapeImage: string;
  preroll: ExtraElement;
  tube: ExtraElement;
  fruits: Fruit[];
  flavorsList: FlavorInfo[];
}

const featuresData: Record<string, FeatureInfo> = {
  vape: {
    title: '2g Dual Tank Vape',
    description: 'A stellar blend of two cosmic strains, ready to launch your senses.',
    featuresList: [
      '60-Day Cured Live Resin Liquid Diamonds',
      '3-in-One Dual Chamber Vape',
      'Inhale activated with LED screen',
      'Switch between 2 flavors or activate both to get a 3rd flavor',
      'Display provides puff count and strain indicator',
      'Great Taste, Extra Strength',
      'Rechargeable USB type C'
    ]
  },
  preroll: {
    title: '.6g Quad-Infused Preroll',
    description: 'Experience a supernova of flavor and potency, featuring a perfect fusion of the vape\'s twin strains.',
    featuresList: [
      '60-Day Cured Live Resin Liquid Diamonds',
      'Ice Water Bubble Hash',
      'THCA coated',
      'Indoor Flower',
      'Natural Terpenes',
      'Great Taste, Extra Strength'
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

const flavors: VapeFlavor[] = [
  {
    id: 'peach',
    name: 'SOLAR FLARE',
    bgImage: '/vapes/peach/bg.webp',
    bgImageMobile: '/vapes/peach/bgmobile.webp',
    vapeImage: '/vapes/peach/vape.webp',
    preroll: {
      src: '/vapes/peach/preroll.webp',
      sizeMobile: 250,
      sizeDesktop: 320,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '65%',
      topDesktop: '65%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/vapes/peach/tube.webp',
      sizeMobile: 300,
      sizeDesktop: 500,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '35%',
      topDesktop: '50%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/vapes/peach/fruit1.webp', 
        sizeMobile: 140, 
        sizeDesktop: 280,
        leftMobile: '20%', 
        leftDesktop: '25%',
        topMobile: '18%', 
        topDesktop: '08%',
        delay: 0 
      },
      { 
        src: '/vapes/peach/fruit2.webp', 
        sizeMobile: 95, 
        sizeDesktop: 130,
        leftMobile: '68%', 
        leftDesktop: '70%',
        topMobile: '25%', 
        topDesktop: '35%',
        delay: 1.2 
      },
      { 
        src: '/vapes/peach/fruit3.webp', 
        sizeMobile: 225, 
        sizeDesktop: 260,
        leftMobile: '50%', 
        leftDesktop: '65%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.6, 
        rotate: -18 
      },
      { 
        src: '/vapes/peach/fruit4.webp', 
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
        name: 'Dark Matter Diesel',
        type: 'Sativa',
        description: 'A cosmic journey through notes of diesel fuel and dark berries, with a sharp, energizing exhale.',
        fullDescription: 'Dark Matter Diesel is a potent Sativa-dominant strain that launches you into a focused, creative orbit. Its complex terpene profile features gassy diesel undertones complemented by hints of dark berries and spice. Users report an immediate cerebral rush followed by sustained energy and mental clarity—perfect for daytime adventures and creative exploration.'
      },
      {
        name: 'Marsmallow Kush',
        type: 'Indica',
        description: 'Sweet and creamy marshmallow clouds with earthy kush undertones.',
        fullDescription: 'Marsmallow Kush delivers a smooth, relaxing body high that melts away stress. This Indica-dominant hybrid combines sweet, creamy notes of vanilla and toasted sugar with classic earthy kush undertones. Ideal for evening unwinding, it soothes muscles and calms the mind without heavy sedation.'
      },
      {
        name: 'Lunar Lemonade',
        type: 'Sativa',
        description: 'Zesty lemonade bursting with citrus freshness, balanced by a sweet moonlit haze.',
        fullDescription: 'Lunar Lemonade offers an uplifting, focused experience that brightens even the darkest days. This Sativa features bright citrus notes of fresh-squeezed lemons and tangy orange peel, balanced by a subtle sweet haze on the finish. Perfect for morning sessions or afternoon pick-me-ups.'
      },
      {
        name: 'Galactic GDP',
        type: 'Indica',
        description: 'Deep grape and berry notes with a hint of interstellar mystery.',
        fullDescription: 'Galactic GDP is a heavy-hitting Indica that wraps you in a blanket of interstellar calm. Rich notes of concord grape, blackberry, and plum create a deeply fruity profile. Best enjoyed in the evening as it gently guides you toward restful sleep.'
      }
    ],
  },
  {
    id: 'green-apple',
    name: 'NEBULA GREEN',
    bgImage: '/vapes/green-apple/bg.webp',
    bgImageMobile: '/vapes/green-apple/bgmobile.webp',
    vapeImage: '/vapes/green-apple/vape.webp',
    preroll: {
      src: '/vapes/green-apple/preroll.webp',
      sizeMobile: 250,
      sizeDesktop: 320,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '65%',
      topDesktop: '65%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/vapes/green-apple/tube.webp',
      sizeMobile: 300,
      sizeDesktop: 500,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '35%',
      topDesktop: '50%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/vapes/green-apple/fruit1.webp', 
        sizeMobile: 135, 
        sizeDesktop: 275,
        leftMobile: '15%', 
        leftDesktop: '25%',
        topMobile: '20%', 
        topDesktop: '10%',
        delay: 0 
      },
      { 
        src: '/vapes/green-apple/fruit2.webp', 
        sizeMobile: 100, 
        sizeDesktop: 130,
        leftMobile: '77%', 
        leftDesktop: '77%',
        topMobile: '28%', 
        topDesktop: '28%',
        delay: 1.3 
      },
      { 
        src: '/vapes/green-apple/fruit3.webp', 
        sizeMobile: 225, 
        sizeDesktop: 260,
        leftMobile: '50%', 
        leftDesktop: '65%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.8, 
        rotate: -18 
      },
      { 
        src: '/vapes/green-apple/fruit4.webp', 
        sizeMobile: 90, 
        sizeDesktop: 320,
        leftMobile: '70%', 
        leftDesktop: '65%',
        topMobile: '72%', 
        topDesktop: '62%',
        delay: 2 
      },
    ],
    flavorsList: [
      {
        name: 'Stardust Sour',
        type: 'Sativa',
        description: 'Tangy green apple candy with a cosmic sour punch.',
        fullDescription: 'Stardust Sour combines nostalgic sour green apple candy flavor with a cosmic energy boost. Features tart Granny Smith apple notes with hints of citrus and sugar. Effects are immediate and uplifting—expect heightened focus, creative flow, and a burst of euphoric energy.'
      },
      {
        name: 'Sacuramochi',
        type: 'Hybrid',
        description: 'Sweet cherry blossom and soft mochi rice cake, perfectly balanced.',
        fullDescription: 'Sacuramochi offers a beautifully balanced Hybrid experience. Features delicate cherry blossom notes combined with sweet, subtle taste of soft mochi rice cake. Effects are evenly split between cerebral uplift and physical relaxation.'
      },
      {
        name: 'Supernova Citrus Burst',
        type: 'Sativa',
        description: 'Explosive blend of mandarin, lemon, and grapefruit.',
        fullDescription: 'Supernova Citrus Burst delivers an explosive combination of mandarin orange, fresh lemon, and pink grapefruit. This Sativa-dominant strain delivers immediate energy and mental clarity. The bright, zesty flavors awaken the senses.'
      },
      {
        name: 'Nebula Nectar',
        type: 'Hybrid',
        description: 'Honey-sweet nectar with floral undertones, floating through a cloud of balance.',
        fullDescription: 'Nebula Nectar is a beautifully balanced Hybrid that floats like a cloud. Features sweet honey nectar complemented by delicate floral notes of jasmine and honeysuckle. Effects are smoothly balanced—a gentle cerebral lift paired with full-body relaxation.'
      }
    ],
  },
  {
    id: 'passion-fruit',
    name: 'GALAXY PURPLE',
    bgImage: '/vapes/passion-fruit/bg.webp',
    bgImageMobile: '/vapes/passion-fruit/bgmobile.webp',
    vapeImage: '/vapes/passion-fruit/vape.webp',
    preroll: {
      src: '/vapes/passion-fruit/preroll.webp',
      sizeMobile: 250,
      sizeDesktop: 320,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '65%',
      topDesktop: '65%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/vapes/passion-fruit/tube.webp',
      sizeMobile: 300,
      sizeDesktop: 500,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '35%',
      topDesktop: '50%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/vapes/passion-fruit/fruit1.webp', 
        sizeMobile: 130, 
        sizeDesktop: 170,
        leftMobile: '12%', 
        leftDesktop: '12%',
        topMobile: '18%', 
        topDesktop: '18%',
        delay: 0 
      },
      { 
        src: '/vapes/passion-fruit/fruit2.webp', 
        sizeMobile: 105, 
        sizeDesktop: 135,
        leftMobile: '80%', 
        leftDesktop: '80%',
        topMobile: '30%', 
        topDesktop: '30%',
        delay: 1.1 
      },
      { 
        src: '/vapes/passion-fruit/fruit3.webp', 
        sizeMobile: 225, 
        sizeDesktop: 260,
        leftMobile: '50%', 
        leftDesktop: '65%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.7, 
        rotate: -18 
      },
      { 
        src: '/vapes/passion-fruit/fruit4.webp', 
        sizeMobile: 88, 
        sizeDesktop: 115,
        leftMobile: '70%', 
        leftDesktop: '70%',
        topMobile: '73%', 
        topDesktop: '73%',
        delay: 2.2 
      },
    ],
    flavorsList: [
      {
        name: 'Skywalker OG',
        type: 'Indica',
        description: 'Earthy pine and citrus with a touch of spice, known for deeply relaxing effects.',
        fullDescription: 'Skywalker OG is a legendary Indica-dominant strain. Features earthy pine and fresh citrus with subtle spicy kick. Effects are profoundly relaxing—a gentle wave of calm that starts in the head and spreads throughout the body.'
      },
      {
        name: 'Italian Ice',
        type: 'Hybrid',
        description: 'Sweet lemon and creamy vanilla dessert notes, perfectly balanced.',
        fullDescription: 'Italian Ice delivers a perfectly balanced Hybrid experience. Features bright, sweet lemon notes combined with smooth, creamy vanilla. Effects are evenly split—a gentle cerebral euphoria paired with full-body comfort.'
      },
      {
        name: 'Comet Crasher Cookies',
        type: 'Indica',
        description: 'Sweet dough and chocolate chip cookie flavor with a cosmic twist.',
        fullDescription: 'Comet Crasher Cookies is a decadent Indica-dominant strain. Features sweet cookie dough, rich chocolate chips, and a hint of nutty warmth. Effects are deeply relaxing and slightly sedating—ideal for evening use.'
      },
      {
        name: 'Pluto Super Punch',
        type: 'Hybrid',
        description: 'Tropical fruit punch explosion with notes of passionfruit, orange, and guava.',
        fullDescription: 'Pluto Super Punch is an energetic Hybrid delivering tropical fruit explosion. Features sweet passionfruit, tangy orange, and exotic guava. Effects are uplifting and euphoric—a balanced head-and-body high.'
      }
    ],
  },
  {
    id: 'dragon-fruit',
    name: 'NEPTUNE PULSE',
    bgImage: '/vapes/dragon-fruit/bg.webp',
    bgImageMobile: '/vapes/dragon-fruit/bgmobile.webp',
    vapeImage: '/vapes/dragon-fruit/vape.webp',
    preroll: {
      src: '/vapes/dragon-fruit/preroll.webp',
      sizeMobile: 250,
      sizeDesktop: 320,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '65%',
      topDesktop: '65%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/vapes/dragon-fruit/tube.webp',
      sizeMobile: 300,
      sizeDesktop: 500,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '35%',
      topDesktop: '50%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/vapes/dragon-fruit/fruit1.webp', 
        sizeMobile: 135, 
        sizeDesktop: 175,
        leftMobile: '18%', 
        leftDesktop: '18%',
        topMobile: '22%', 
        topDesktop: '22%',
        delay: 0 
      },
      { 
        src: '/vapes/dragon-fruit/fruit2.webp', 
        sizeMobile: 95, 
        sizeDesktop: 125,
        leftMobile: '75%', 
        leftDesktop: '75%',
        topMobile: '25%', 
        topDesktop: '25%',
        delay: 1.4 
      },
      { 
        src: '/vapes/dragon-fruit/fruit3.webp', 
        sizeMobile: 225, 
        sizeDesktop: 260,
        leftMobile: '50%', 
        leftDesktop: '65%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.9, 
        rotate: -18 
      },
      { 
        src: '/vapes/dragon-fruit/fruit4.webp', 
        sizeMobile: 85, 
        sizeDesktop: 110,
        leftMobile: '72%', 
        leftDesktop: '72%',
        topMobile: '68%', 
        topDesktop: '68%',
        delay: 2 
      },
    ],
    flavorsList: [
      {
        name: 'Galactic Blue Dream',
        type: 'Sativa',
        description: 'Sweet blueberry and floral notes with a hint of interstellar haze.',
        fullDescription: 'Galactic Blue Dream is a Sativa-dominant strain offering sweet, dreamy escape. Features ripe blueberries, delicate floral notes, and a hint of cosmic haze. Effects are creative and energizing—a clear-headed euphoria.'
      },
      {
        name: 'Alien Gas',
        type: 'Indica',
        description: 'Diesel-fueled funk with earthy undertones and a mysterious alien twist.',
        fullDescription: 'Alien Gas is a potent Indica delivering otherworldly relaxation. Features intense diesel fuel notes with earthy undertones. Effects are deeply sedating—a heavy body load that melts away physical discomfort.'
      },
      {
        name: 'Supernova Strawberry Haze',
        type: 'Sativa',
        description: 'Ripe strawberries wrapped in a cosmic citrus haze.',
        fullDescription: 'Supernova Strawberry Haze explodes with bright, fruity flavor and energetic effects. Features ripe, juicy strawberries wrapped in layers of citrus haze. Effects are intensely energizing—a cerebral rush that sparks creativity.'
      },
      {
        name: 'Orbit Higashi',
        type: 'Indica',
        description: 'Sweet incense and exotic spice blend, sending you on a peaceful journey.',
        fullDescription: 'Orbit Higashi offers a unique Indica experience. Features sweet, sandalwood-like incense notes combined with exotic spices. Effects are deeply calming and meditative—a gentle body high.'
      }
    ],
  },
  {
    id: 'strawberry',
    name: 'NEBULA CRIMSON',
    bgImage: '/vapes/strawberry/bg.webp',
    bgImageMobile: '/vapes/strawberry/bgmobile.webp',
    vapeImage: '/vapes/strawberry/vape.webp',
    preroll: {
      src: '/vapes/strawberry/preroll.webp',
      sizeMobile: 250,
      sizeDesktop: 320,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '65%',
      topDesktop: '65%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/vapes/strawberry/tube.webp',
      sizeMobile: 300,
      sizeDesktop: 500,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '35%',
      topDesktop: '50%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/vapes/strawberry/fruit1.webp', 
        sizeMobile: 130, 
        sizeDesktop: 170,
        leftMobile: '13%', 
        leftDesktop: '13%',
        topMobile: '19%', 
        topDesktop: '19%',
        delay: 0 
      },
      { 
        src: '/vapes/strawberry/fruit2.webp', 
        sizeMobile: 98, 
        sizeDesktop: 130,
        leftMobile: '77%', 
        leftDesktop: '77%',
        topMobile: '27%', 
        topDesktop: '27%',
        delay: 1.2 
      },
      { 
        src: '/vapes/strawberry/fruit3.webp', 
        sizeMobile: 225, 
        sizeDesktop: 260,
        leftMobile: '50%', 
        leftDesktop: '65%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.6, 
        rotate: -18 
      },
      { 
        src: '/vapes/strawberry/fruit4.webp', 
        sizeMobile: 82, 
        sizeDesktop: 110,
        leftMobile: '71%', 
        leftDesktop: '71%',
        topMobile: '73%', 
        topDesktop: '73%',
        delay: 2.3 
      },
    ],
    flavorsList: [
      {
        name: 'Stargazer Sherbet Runtz',
        type: 'Hybrid',
        description: 'Creamy sherbet and sweet candy runt flavors, perfectly balanced.',
        fullDescription: 'Stargazer Sherbet Runtz combines creamy sherbet with sweet candy runt flavors. Effects are balanced, offering both mental uplift and physical comfort. Provides a calming and euphoric high.'
      },
      {
        name: 'WatermelonZ Space Blast',
        type: 'Hybrid',
        description: 'Juicy watermelon with a cosmic blast of sweet berries.',
        fullDescription: 'WatermelonZ Space Blast delivers juicy watermelon flavor complemented by sweet berry notes. Offers a fun, uplifting experience that balances cerebral energy with full-body comfort.'
      },
      {
        name: 'Black Hole Berry',
        type: 'Hybrid',
        description: 'Deep, dark mixed berries pulling you into a vortex of sweet and tart bliss.',
        fullDescription: 'Black Hole Berry draws you into deep, dark berry flavors—blackberry, blueberry, and boysenberry. Offers a perfectly balanced experience: gentle cerebral lift paired with soothing body effects.'
      },
      {
        name: 'Celestial Cotton Candy',
        type: 'Hybrid',
        description: 'Fluffy pink and blue cotton candy floating through the cosmos.',
        fullDescription: 'Celestial Cotton Candy features fluffy pink and blue cotton candy notes with hints of vanilla. Effects are gently euphoric and uplifting, promoting happiness and social engagement.'
      }
    ],
  },
];

export default function VapePage() {
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
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">Astro Kit contains</h3>
        <div className="space-y-4 md:space-y-6">
          <button
            onClick={() => setSelectedFeature('vape')}
            className="w-full text-left group cursor-pointer"
          >
            <p className="font-semibold text-[#00d4ff] text-base md:text-xl group-hover:text-[#00d4ff]/80 transition-colors">2g Dual Tank</p>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">60 Days Cured Live Resin Liquid Diamonds Vape<br />A stellar blend of two cosmic strains, ready to launch your senses.</p>
          </button>
          <button
            onClick={() => setSelectedFeature('preroll')}
            className="w-full text-left group cursor-pointer"
          >
            <p className="font-semibold text-[#00d4ff] text-base md:text-xl group-hover:text-[#00d4ff]/80 transition-colors">.6g Quad-Infused Preroll</p>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">Experience a supernova of flavor and potency, featuring a perfect fusion of the vape&apos;s twin strains.</p>
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
            onClick={() => setSelectedFeature('vape')}
            className="px-3 py-1 md:px-4 md:py-2 bg-[#00d4ff]/20 border border-[#00d4ff]/50 rounded-full text-sm md:text-base text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all cursor-pointer"
          >
            Vape
          </button>
          <button
            onClick={() => setSelectedFeature('preroll')}
            className="px-3 py-1 md:px-4 md:py-2 bg-[#00d4ff]/20 border border-[#00d4ff]/50 rounded-full text-sm md:text-base text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all cursor-pointer"
          >
            Pre-roll
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

            {/* TUBE - за вейпом */}
            <motion.div
              key={`tube-${activeFlavor.id}`}
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

            {/* FRUIT3 - ЗА вейпом (zIndex: 21, ниже чем у vape который z-20) */}
            {activeFlavor.fruits[2] && (
              <motion.div
                key={`fruit3-${activeFlavor.id}`}
                className="absolute pointer-events-none"
                style={{ 
                  left: getFruitStyles(activeFlavor.fruits[2]).left, 
                  top: getFruitStyles(activeFlavor.fruits[2]).top, 
                  width: getFruitStyles(activeFlavor.fruits[2]).size, 
                  height: getFruitStyles(activeFlavor.fruits[2]).size, 
                  zIndex: 21
                }}
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
            )}

            {/* PREROLL - перед вейпом */}
            <motion.div
              key={`preroll-${activeFlavor.id}`}
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

            {/* Остальные фрукты (fruit1, fruit2, fruit4) - СКРЫТЫ НА ПК (временно) */}
            {false && activeFlavor.fruits.map((fruit, i) => {
              // Пропускаем fruit3 (индекс 2), так как он уже отрендерен выше
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

        {/* Текст сверху - для мобильных по центру, для ПК - в правом верхнем углу */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activeFlavor.id}`}
            className={`z-30 ${
              isMobile 
                ? 'absolute top-24 left-1/2 -translate-x-1/2 text-center' 
                : 'absolute top-12 right-12 text-right'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`uppercase tracking-[5px] text-sm mb-4 opacity-80 ${!isMobile && 'text-right'}`}>ASTRO KIT</div>
            <h2 className={`text-6xl md:text-8xl font-black tracking-tighter drop-shadow-lg ${!isMobile && 'text-right'}`}>
              {activeFlavor.name}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Центральное изображение вейпа */}
        <div className="relative z-20 flex items-center justify-center">
          <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
            <img
              src={prevFlavor.vapeImage}
              alt=""
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out"
              style={{ opacity: 0 }}
            />
            <img
              src={activeFlavor.vapeImage}
              alt={activeFlavor.name}
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out"
              style={{ opacity: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Кнопки-миниатюры */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-3 md:gap-4 bg-black/30 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-full">
          {flavors.map((flavor, index) => (
            <motion.button
              key={flavor.id}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className={`
                w-14 h-14 md:w-20 md:h-20
                transition-all duration-300
                ${activeIndex === index ? 'scale-110 drop-shadow-xl' : 'opacity-60 hover:opacity-100'}
              `}>
                <img src={flavor.vapeImage} alt={flavor.name} className="w-full h-full object-contain" />
              </div>
              {activeIndex === index && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
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