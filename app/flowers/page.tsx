// app/flowers/page.tsx

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
  yOffset?: number;
  rotateAmount?: number;
  duration?: number;
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

interface StrainInfo {
  name: string;
  type: string;
  aroma: string;
  effects: string[];
  description: string;
}

interface FeatureInfo {
  title: string;
  description: string;
  featuresList: string[];
}

interface FlowerFlavor {
  id: string;
  name: string;
  bgImage: string;
  bgImageMobile: string;
  flowerImage: string;
  preroll: ExtraElement;
  tube: ExtraElement;
  fruits: Fruit[];
  strainInfo: StrainInfo;
}

const featuresData: Record<string, FeatureInfo> = {
  flower: {
    title: 'Premium Indoor Flower',
    description: 'Experience the pinnacle of cannabis cultivation with our premium indoor flower.',
    featuresList: [
      'Hand-trimmed premium buds',
      '60-Day Cured Live Resin',
      'Indoor hydroponic grown',
      'Rich terpene profile',
      'Lab-tested for potency',
      'Great Taste, Extra Strength',
      'Glass jar packaging'
    ]
  },
  preroll: {
    title: '.6g Quad-Infused Preroll',
    description: 'Experience a supernova of flavor and potency, featuring a perfect fusion of premium flower strains.',
    featuresList: [
      'Premium indoor flower',
      'Ice Water Bubble Hash',
      'THCA coated',
      'Live Resin infused',
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

const flavors: FlowerFlavor[] = [
  {
    id: 'blue-zlurpee',
    name: 'BLUE ZLURPEE',
    bgImage: '/flowers/blue-zlurpee/bg.webp',
    bgImageMobile: '/flowers/blue-zlurpee/bgmobile.webp',
    flowerImage: '/flowers/blue-zlurpee/flower.webp',
    preroll: {
      src: '/flowers/blue-zlurpee/preroll.webp',
      sizeMobile: 150,
      sizeDesktop: 200,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '55%',
      topDesktop: '48%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/flowers/blue-zlurpee/tube.webp',
      sizeMobile: 120,
      sizeDesktop: 200,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '17%',
      topDesktop: '20%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/flowers/blue-zlurpee/fruit1.webp', 
        sizeMobile: 140, 
        sizeDesktop: 180,
        leftMobile: '10%', 
        leftDesktop: '25%',
        topMobile: '18%', 
        topDesktop: '18%',
        delay: 0 
      },
      { 
        src: '/flowers/blue-zlurpee/fruit2.webp', 
        sizeMobile: 95, 
        sizeDesktop: 130,
        leftMobile: '75%', 
        leftDesktop: '73%',
        topMobile: '25%', 
        topDesktop: '25%',
        delay: 1.2 
      },
      { 
        src: '/flowers/blue-zlurpee/fruit3.webp', 
        sizeMobile: 200, 
        sizeDesktop: 220,
        leftMobile: '50%', 
        leftDesktop: '22%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.6, 
        rotate: -18 
      },
      { 
        src: '/flowers/blue-zlurpee/fruit4.webp', 
        sizeMobile: 150, 
        sizeDesktop: 210,
        leftMobile: '60%', 
        leftDesktop: '72%',
        topMobile: '35%', 
        topDesktop: '73%',
        delay: 2.1 
      },
    ],
    strainInfo: {
      name: 'Blue Zlurpee',
      type: 'Hybrid',
      aroma: 'Sweet blueberry, fruit punch, vanilla',
      effects: ['Relaxation', 'Euphoria', 'Mood Enhancement'],
      description: 'Blue Zlurpee is a balanced Hybrid that delivers a nostalgic blueberry candy experience with a frosty, smooth exhale. Its sweet and fruity aroma with hints of vanilla provides a soft and pleasant journey. The effects are perfectly balanced: a gentle cerebral lift paired with full-body relaxation, making it ideal for daytime relaxation or a slow-paced evening.'
    }
  },
  {
    id: 'frosted-mochi',
    name: 'FROSTED MOCHI',
    bgImage: '/flowers/frosted-mochi/bg.webp',
    bgImageMobile: '/flowers/frosted-mochi/bgmobile.webp',
    flowerImage: '/flowers/frosted-mochi/flower.webp',
    preroll: {
      src: '/flowers/frosted-mochi/preroll.webp',
      sizeMobile: 150,
      sizeDesktop: 200,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '55%',
      topDesktop: '48%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/flowers/frosted-mochi/tube.webp',
      sizeMobile: 120,
      sizeDesktop: 200,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '17%',
      topDesktop: '20%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/flowers/frosted-mochi/fruit1.webp', 
        sizeMobile: 130, 
        sizeDesktop: 170,
        leftMobile: '13%', 
        leftDesktop: '25%',
        topMobile: '19%', 
        topDesktop: '19%',
        delay: 0 
      },
      { 
        src: '/flowers/frosted-mochi/fruit2.webp', 
        sizeMobile: 98, 
        sizeDesktop: 130,
        leftMobile: '70%', 
        leftDesktop: '71%',
        topMobile: '30%', 
        topDesktop: '27%',
        delay: 1.2 
      },
      { 
        src: '/flowers/frosted-mochi/fruit3.webp', 
        sizeMobile: 200, 
        sizeDesktop: 220,
        leftMobile: '50%', 
        leftDesktop: '22%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.6, 
        rotate: -18 
      },
      { 
        src: '/flowers/frosted-mochi/fruit4.webp', 
        sizeMobile: 150, 
        sizeDesktop: 210,
        leftMobile: '60%', 
        leftDesktop: '72%',
        topMobile: '35%', 
        topDesktop: '73%',
        delay: 2.3 
      },
    ],
    strainInfo: {
      name: 'Frosted Mochi',
      type: 'Indica-dominant Hybrid',
      aroma: 'Creamy dessert, vanilla, sweet dough',
      effects: ['Deep Relaxation', 'Tranquility', 'Sleepiness'],
      description: 'Frosted Mochi is an Indica-dominant Hybrid that combines creamy vanilla notes with sweet dough. Its effect gently envelops the body, relieving stress and tension, making it perfect for evening relaxation. This strain brings a state of deep peace and tranquility.'
    }
  },
  {
    id: 'cartier-cush',
    name: 'CARTIER CUSH',
    bgImage: '/flowers/cartier-cush/bg.webp',
    bgImageMobile: '/flowers/cartier-cush/bgmobile.webp',
    flowerImage: '/flowers/cartier-cush/flower.webp',
    preroll: {
      src: '/flowers/cartier-cush/preroll.webp',
      sizeMobile: 150,
      sizeDesktop: 200,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '55%',
      topDesktop: '48%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/flowers/cartier-cush/tube.webp',
       sizeMobile: 120,
      sizeDesktop: 200,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '17%',
      topDesktop: '20%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/flowers/cartier-cush/fruit1.webp', 
        sizeMobile: 135, 
        sizeDesktop: 175,
        leftMobile: '15%', 
        leftDesktop: '25%',
        topMobile: '20%', 
        topDesktop: '20%',
        delay: 0 
      },
      { 
        src: '/flowers/cartier-cush/fruit2.webp', 
        sizeMobile: 100, 
        sizeDesktop: 135,
        leftMobile: '70%', 
        leftDesktop: '72%',
        topMobile: '28%', 
        topDesktop: '28%',
        delay: 1.3 
      },
      { 
        src: '/flowers/cartier-cush/fruit3.webp', 
        sizeMobile: 200, 
        sizeDesktop: 220,
        leftMobile: '50%', 
        leftDesktop: '22%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.6, 
        rotate: -18 
      },
      { 
        src: '/flowers/cartier-cush/fruit4.webp', 
        sizeMobile: 160, 
        sizeDesktop: 220,
        leftMobile: '60%', 
        leftDesktop: '72%',
        topMobile: '35%', 
        topDesktop: '73%',
        delay: 2 
      },
    ],
    strainInfo: {
      name: 'Cartier Cush',
      type: 'Indica',
      aroma: 'Earthy kush, sweet citrus, woody notes',
      effects: ['Full Body Relaxation', 'Stress Relief', 'Calmness'],
      description: 'Cartier Cush is a premium Indica-dominant strain with a luxurious flavor and effect. Earthy notes of classic kush are complemented by sweet citrus undertones. This strain is known for its ability to completely relax the body and mind, delivering a deep sense of calm and tranquility.'
    }
  },
  {
    id: 'milkyway-runtz',
    name: 'MILKYWAY RUNTZ',
    bgImage: '/flowers/milkyway-runtz/bg.webp',
    bgImageMobile: '/flowers/milkyway-runtz/bgmobile.webp',
    flowerImage: '/flowers/milkyway-runtz/flower.webp',
    preroll: {
      src: '/flowers/milkyway-runtz/preroll.webp',
      sizeMobile: 150,
      sizeDesktop: 200,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '55%',
      topDesktop: '48%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/flowers/milkyway-runtz/tube.webp',
      sizeMobile: 120,
      sizeDesktop: 200,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '17%',
      topDesktop: '20%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/flowers/milkyway-runtz/fruit1.webp', 
        sizeMobile: 135, 
        sizeDesktop: 175,
        leftMobile: '15%', 
        leftDesktop: '25%',
        topMobile: '20%', 
        topDesktop: '20%',
        delay: 0 
      },
      { 
        src: '/flowers/milkyway-runtz/fruit2.webp', 
        sizeMobile: 100, 
        sizeDesktop: 135,
        leftMobile: '70%', 
        leftDesktop: '72%',
        topMobile: '28%', 
        topDesktop: '28%',
        delay: 1.3 
      },
      { 
        src: '/flowers/milkyway-runtz/fruit3.webp', 
        sizeMobile: 200, 
        sizeDesktop: 220,
        leftMobile: '50%', 
        leftDesktop: '22%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.8, 
        rotate: -18 
      },
      { 
        src: '/flowers/milkyway-runtz/fruit4.webp', 
        sizeMobile: 160, 
        sizeDesktop: 220,
        leftMobile: '60%', 
        leftDesktop: '72%',
        topMobile: '35%', 
        topDesktop: '73%',
        delay: 2 
      },
    ],
    strainInfo: {
      name: 'MilkyWay Runtz',
      type: 'Hybrid',
      aroma: 'Tropical fruits, vanilla, gas',
      effects: ['Euphoria', 'Creativity', 'Relaxation'],
      description: 'MilkyWay Runtz is a Hybrid derived from Runtz (Zkittlez x Gelato). It features a bright aroma of tropical fruits with hints of vanilla and gas. This strain delivers a balanced effect: mental uplift and creativity combined with pleasant body relaxation.'
    }
  },
  {
    id: 'eternal-zlushy',
    name: 'ETERNAL ZLUSHY',
    bgImage: '/flowers/eternal-zlushy/bg.webp',
    bgImageMobile: '/flowers/eternal-zlushy/bgmobile.webp',
    flowerImage: '/flowers/eternal-zlushy/flower.webp',
    preroll: {
      src: '/flowers/eternal-zlushy/preroll.webp',
      sizeMobile: 150,
      sizeDesktop: 200,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '55%',
      topDesktop: '48%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/flowers/eternal-zlushy/tube.webp',
      sizeMobile: 120,
      sizeDesktop: 200,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '17%',
      topDesktop: '20%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/flowers/eternal-zlushy/fruit1.webp', 
        sizeMobile: 135, 
        sizeDesktop: 175,
        leftMobile: '18%', 
        leftDesktop: '24%',
        topMobile: '22%', 
        topDesktop: '22%',
        delay: 0 
      },
      { 
        src: '/flowers/eternal-zlushy/fruit2.webp', 
        sizeMobile: 95, 
        sizeDesktop: 125,
        leftMobile: '70%', 
        leftDesktop: '72%',
        topMobile: '25%', 
        topDesktop: '25%',
        delay: 1.4 
      },
      { 
        src: '/flowers/eternal-zlushy/fruit3.webp', 
        sizeMobile: 200, 
        sizeDesktop: 220,
        leftMobile: '50%', 
        leftDesktop: '22%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.9, 
        rotate: -18 
      },
      { 
        src: '/flowers/eternal-zlushy/fruit4.webp', 
        sizeMobile: 165, 
        sizeDesktop: 215,
        leftMobile: '60%', 
        leftDesktop: '72%',
        topMobile: '35%', 
        topDesktop: '73%',
        delay: 2 
      },
    ],
    strainInfo: {
      name: 'Eternal Zlushy',
      type: 'Sativa-dominant Hybrid',
      aroma: 'Frozen fruits, sweet berries, citrus',
      effects: ['Energy', 'Mood Enhancement', 'Focus'],
      description: 'Eternal Zlushy is a Sativa-dominant Hybrid that delivers an explosion of bright fruity flavors and aromas. Its effect is invigorating and mood-enhancing, making it an ideal companion for daytime activities and creative pursuits. The refreshing notes of frozen berries and citrus awaken the senses and promote focus and energy.'
    }
  },
  {
    id: 'astro-berry-gelato',
    name: 'ASTRO BERRY GELATO',
    bgImage: '/flowers/astro-berry-gelato/bg.webp',
    bgImageMobile: '/flowers/astro-berry-gelato/bgmobile.webp',
    flowerImage: '/flowers/astro-berry-gelato/flower.webp',
    preroll: {
      src: '/flowers/astro-berry-gelato/preroll.webp',
      sizeMobile: 150,
      sizeDesktop: 200,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '55%',
      topDesktop: '48%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/flowers/astro-berry-gelato/tube.webp',
      sizeMobile: 120,
      sizeDesktop: 200,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '17%',
      topDesktop: '20%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/flowers/astro-berry-gelato/fruit1.webp', 
        sizeMobile: 130, 
        sizeDesktop: 170,
        leftMobile: '13%', 
        leftDesktop: '23%',
        topMobile: '19%', 
        topDesktop: '19%',
        delay: 0 
      },
      { 
        src: '/flowers/astro-berry-gelato/fruit2.webp', 
        sizeMobile: 98, 
        sizeDesktop: 130,
        leftMobile: '70%', 
        leftDesktop: '73%',
        topMobile: '27%', 
        topDesktop: '27%',
        delay: 1.2 
      },
      { 
        src: '/flowers/astro-berry-gelato/fruit3.webp', 
        sizeMobile: 200, 
        sizeDesktop: 220,
        leftMobile: '50%', 
        leftDesktop: '22%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.6, 
        rotate: -18 
      },
      { 
        src: '/flowers/astro-berry-gelato/fruit4.webp', 
        sizeMobile: 162, 
        sizeDesktop: 210,
        leftMobile: '60%', 
        leftDesktop: '72%',
        topMobile: '35%', 
        topDesktop: '73%',
        delay: 2.3 
      },
    ],
    strainInfo: {
      name: 'Astro Berry Gelato',
      type: 'Hybrid',
      aroma: 'Mixed berries, creamy gelato, sweet dough',
      effects: ['Balanced High', 'Relaxation', 'Euphoria'],
      description: 'Astro Berry Gelato delivers a celestial combination of mixed berries and creamy gelato. This Hybrid offers a perfectly balanced experience: a gentle cerebral lift paired with soothing body effects. The sweet berry notes blend harmoniously with creamy dessert undertones, creating a delicious and memorable flavor profile.'
    }
  },
  {
    id: 'higashi',
    name: 'HIGASHI',
    bgImage: '/flowers/higashi/bg.webp',
    bgImageMobile: '/flowers/higashi/bgmobile.webp',
    flowerImage: '/flowers/higashi/flower.webp',
    preroll: {
      src: '/flowers/higashi/preroll.webp',
        sizeMobile: 150,
      sizeDesktop: 200,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '55%',
      topDesktop: '48%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/flowers/higashi/tube.webp',
       sizeMobile: 120,
      sizeDesktop: 200,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '17%',
      topDesktop: '20%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/flowers/higashi/fruit1.webp', 
        sizeMobile: 140, 
        sizeDesktop: 180,
        leftMobile: '10%', 
        leftDesktop: '21%',
        topMobile: '18%', 
        topDesktop: '18%',
        delay: 0 
      },
      { 
        src: '/flowers/higashi/fruit2.webp', 
        sizeMobile: 95, 
        sizeDesktop: 125,
        leftMobile: '70%', 
        leftDesktop: '73%',
        topMobile: '25%', 
        topDesktop: '25%',
        delay: 1.2 
      },
      { 
        src: '/flowers/higashi/fruit3.webp', 
        sizeMobile: 200, 
        sizeDesktop: 220,
        leftMobile: '50%', 
        leftDesktop: '22%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.6, 
        rotate: -18 
      },
      { 
        src: '/flowers/higashi/fruit4.webp', 
        sizeMobile: 165, 
        sizeDesktop: 210,
        leftMobile: '60%', 
        leftDesktop: '72%',
        topMobile: '35%', 
        topDesktop: '73%',
        delay: 2.1 
      },
    ],
    strainInfo: {
      name: 'Higashi',
      type: 'Indica',
      aroma: 'Sweet incense, exotic spices, sandalwood',
      effects: ['Meditative', 'Deeply Calming', 'Introspective'],
      description: 'Higashi offers a unique Indica experience inspired by Japanese incense traditions. The flavor profile features sweet, sandalwood-like incense notes combined with exotic spices and a hint of floral sweetness. Effects are deeply calming and meditative—a gentle body high that encourages introspection and peaceful relaxation. Perfect for evening meditation, yoga, or quiet nights.'
    }
  },
  {
    id: 'cosmic-caviar',
    name: 'COSMIC CAVIAR',
    bgImage: '/flowers/cosmic-caviar/bg.webp',
    bgImageMobile: '/flowers/cosmic-caviar/bgmobile.webp',
    flowerImage: '/flowers/cosmic-caviar/flower.webp',
    preroll: {
      src: '/flowers/cosmic-caviar/preroll.webp',
      sizeMobile: 150,
      sizeDesktop: 200,
      leftMobile: '25%',
      leftDesktop: '40%',
      topMobile: '55%',
      topDesktop: '48%',
      rotate: -30,
      yOffset: -15,
      rotateAmount: -10,
      duration: 6,
      zIndex: 30,
    },
    tube: {
      src: '/flowers/cosmic-caviar/tube.webp',
      sizeMobile: 120,
      sizeDesktop: 200,
      leftMobile: '78%',
      leftDesktop: '65%',
      topMobile: '17%',
      topDesktop: '20%',
      rotate: 8,
      yOffset: -18,
      rotateAmount: 6,
      duration: 6.5,
      zIndex: 10,
    },
    fruits: [
      { 
        src: '/flowers/cosmic-caviar/fruit1.webp', 
        sizeMobile: 130, 
        sizeDesktop: 170,
        leftMobile: '12%', 
        leftDesktop: '22%',
        topMobile: '18%', 
        topDesktop: '18%',
        delay: 0 
      },
      { 
        src: '/flowers/cosmic-caviar/fruit2.webp', 
        sizeMobile: 105, 
        sizeDesktop: 140,
        leftMobile: '70%', 
        leftDesktop: '70%',
        topMobile: '30%', 
        topDesktop: '30%',
        delay: 1.1 
      },
      { 
        src: '/flowers/cosmic-caviar/fruit3.webp', 
        sizeMobile: 200, 
        sizeDesktop: 220,
        leftMobile: '50%', 
        leftDesktop: '22%',
        topMobile: '65%', 
        topDesktop: '65%',
        delay: 0.7, 
        rotate: -18 
      },
      { 
        src: '/flowers/cosmic-caviar/fruit4.webp', 
        sizeMobile: 168, 
        sizeDesktop: 215,
        leftMobile: '60%', 
        leftDesktop: '72%',
        topMobile: '35%', 
        topDesktop: '73%',
        delay: 2.2 
      },
    ],
    strainInfo: {
      name: 'Cosmic Caviar',
      type: 'Indica',
      aroma: 'Rich berries, earthy notes, dark fruit',
      effects: ['Deep Relaxation', 'Full Body Melt', 'Tranquility'],
      description: 'Cosmic Caviar delivers a truly premium Indica experience with rich, complex flavors that transport you to another dimension. The taste profile features dark berries, earthy undertones, and hints of luxury. Effects are deeply sedating and relaxing—perfect for evening use when you want to completely unwind and melt into a state of cosmic tranquility.'
    }
  },
];

export default function FlowersPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showStrains, setShowStrains] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const activeFlavor = flavors[activeIndex];
  const prevFlavor = flavors[prevIndex];

  useEffect(() => {
    setPrevIndex(activeIndex);
  }, [activeIndex]);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get current styles for element (preroll, tube)
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

  // Get current styles for fruit
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

  // Feature modal with description
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

  // Product description with clickable buttons
  const DescriptionContent = () => (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">ASTRO FUEL Kit contains</h3>
        <div className="space-y-4 md:space-y-6">
          <button
            onClick={() => setSelectedFeature('flower')}
            className="w-full text-left group cursor-pointer"
          >
            <p className="font-semibold text-[#00d4ff] text-base md:text-xl group-hover:text-[#00d4ff]/80 transition-colors">Premium Indoor Flower</p>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">Hand-trimmed premium buds with rich terpene profile<br />Experience the pinnacle of cannabis cultivation.</p>
          </button>
          <button
            onClick={() => setSelectedFeature('preroll')}
            className="w-full text-left group cursor-pointer"
          >
            <p className="font-semibold text-[#00d4ff] text-base md:text-xl group-hover:text-[#00d4ff]/80 transition-colors">.6g Quad-Infused Preroll</p>
            <p className="text-sm md:text-base leading-relaxed text-gray-300">Experience a supernova of flavor and potency, featuring a perfect fusion of premium flower strains.</p>
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
            onClick={() => setSelectedFeature('flower')}
            className="px-3 py-1 md:px-4 md:py-2 bg-[#00d4ff]/20 border border-[#00d4ff]/50 rounded-full text-sm md:text-base text-[#00d4ff] hover:bg-[#00d4ff]/30 transition-all cursor-pointer"
          >
            Flower
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

  // Strain info component - expanded description for each product
  const StrainInfoContent = () => {
    const strain = activeFlavor.strainInfo;

    return (
      <div className="space-y-5">
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Strain Profile</h3>
          <div className="w-16 h-0.5 bg-[#00d4ff] mx-auto md:mx-0 mb-4"></div>
        </div>
        
        <div>
          <p className="text-sm text-white/70 mb-3">{strain.type}</p>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-white/90 mb-2">Aroma:</h5>
          <p className="text-sm text-gray-300 leading-relaxed">{strain.aroma}</p>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-white/90 mb-2">Effects:</h5>
          <div className="flex flex-wrap gap-2">
            {strain.effects.map((effect, idx) => (
              <span key={idx} className="px-2 py-1 bg-white/5 border border-white/20 rounded-full text-xs text-gray-300">
                {effect}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <h5 className="text-sm font-semibold text-white/90 mb-2">Description:</h5>
          <p className="text-sm text-gray-300 leading-relaxed">
            {strain.description}
          </p>
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
            {/* Background */}
            <div className="absolute inset-0">
              <picture>
                <source srcSet={activeFlavor.bgImageMobile} media="(max-width: 768px)" />
                <img src={activeFlavor.bgImage} alt="" className="w-full h-full object-cover" />
              </picture>
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Description for desktop (left) - no animation, stays as is */}
            {!isMobile && (
              <div className="absolute left-8 top-1/2 -translate-y-1/2 z-[15] max-w-[600px] w-[560px] bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-white/20 pointer-events-auto">
                <DescriptionContent />
              </div>
            )}

            {/* Strain Info for desktop (right) - no animation, stays as is */}
            {!isMobile && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[15] max-w-[400px] w-[360px] bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 pointer-events-auto max-h-[85vh] overflow-y-auto custom-scrollbar">
                <StrainInfoContent />
              </div>
            )}

            {/* TUBE - behind flower - slides in from left */}
            <motion.div
              key={`tube-${activeFlavor.id}`}
              initial={{ opacity: 0, x: -200, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 200, scale: 0.8 }}
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

            {/* FRUIT3 - ЗА flower - slides in from right */}
            {activeFlavor.fruits[2] && (
              <motion.div
                key={`fruit3-${activeFlavor.id}`}
                initial={{ opacity: 0, x: 200, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -200, scale: 0.8 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="absolute pointer-events-none"
                style={{ 
                  left: getFruitStyles(activeFlavor.fruits[2]).left, 
                  top: getFruitStyles(activeFlavor.fruits[2]).top, 
                  width: getFruitStyles(activeFlavor.fruits[2]).size, 
                  height: getFruitStyles(activeFlavor.fruits[2]).size, 
                  zIndex: 21
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

            {/* PREROLL - перед flower - slides in from top */}
            <motion.div
              key={`preroll-${activeFlavor.id}`}
              initial={{ opacity: 0, y: -200, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 200, scale: 0.8 }}
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

            {/* Остальные фрукты (fruit1, fruit2, fruit4) - ПЕРЕД flower - slides in from bottom */}
            {activeFlavor.fruits.map((fruit, i) => {
              if (i === 2) return null;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 200, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -200, scale: 0.8 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 + i * 0.05 }}
                  className="absolute pointer-events-none"
                  style={{ 
                    left: getFruitStyles(fruit).left, 
                    top: getFruitStyles(fruit).top, 
                    width: getFruitStyles(fruit).size, 
                    height: getFruitStyles(fruit).size, 
                    zIndex: 100
                  }}
                >
                  <motion.div
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
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Feature modal */}
        <AnimatePresence>
          {selectedFeature && <FeatureModal />}
        </AnimatePresence>

        {/* Back button */}
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

        {/* Mobile buttons */}
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
              onClick={() => setShowStrains(true)}
              className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-sm font-medium text-white">Strain Info</span>
            </motion.button>
          </div>
        )}

        {/* Mobile Description Modal */}
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

        {/* Mobile Strain Info Modal */}
        <AnimatePresence>
          {isMobile && showStrains && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setShowStrains(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-6 max-w-sm w-full border border-white/20 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowStrains(false)}
                  className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <StrainInfoContent />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title text - different for mobile and desktop - no animation on appearance, just fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activeFlavor.id}`}
            className={`z-30 ${
              isMobile 
                ? 'absolute top-20 left-1/2 -translate-x-1/2 text-center whitespace-nowrap' 
                : 'absolute top-12 right-12 text-right'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {!isMobile && (
              <div className={`uppercase tracking-[5px] text-sm mb-4 opacity-80 ${!isMobile && 'text-right'}`}>
                ASTRO FUEL KIT
              </div>
            )}
            <h2 className={`font-black tracking-tighter drop-shadow-lg ${
              isMobile 
                ? 'text-5xl' 
                : 'text-6xl md:text-8xl text-right'
            }`}>
              {activeFlavor.name}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Central flower image - no animation, just fade */}
        <div className="relative z-20 flex items-center justify-center">
          <div className="relative w-[600px] h-[600px] md:w-[860px] md:h-[860px]">
            <img
              src={prevFlavor.flowerImage}
              alt=""
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out"
              style={{ opacity: 0 }}
            />
            <img
              src={activeFlavor.flowerImage}
              alt={activeFlavor.name}
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out"
              style={{ opacity: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Thumbnail buttons - 8 products */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-3 md:gap-4 bg-black/30 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-full overflow-x-auto max-w-[95vw]">
          {flavors.map((flavor, index) => (
            <motion.button
              key={flavor.id}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-shrink-0"
            >
              <div className={`
                w-14 h-14 md:w-20 md:h-20
                transition-all duration-300
                ${activeIndex === index ? 'scale-110 drop-shadow-xl' : 'opacity-60 hover:opacity-100'}
              `}>
                <img src={flavor.flowerImage} alt={flavor.name} className="w-full h-full object-contain" />
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

      {/* Scrollbar styles */}
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