// app/vape/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Fruit {
  src: string;
  size: number;
  left: string;
  top: string;
  delay: number;
  rotate?: number;
}

interface VapeFlavor {
  id: string;
  name: string;
  bgColor: string;
  vapeImage: string;
  fruits: Fruit[];
}

const flavors: VapeFlavor[] = [
  {
    id: 'peach',
    name: 'PEACH',
    bgColor: 'from-orange-400 via-amber-500 to-red-500',
    vapeImage: '/vapes/peach/vape.png',
    fruits: [
      { src: '/vapes/peach/fruit1.png', size: 140, left: '10%', top: '18%', delay: 0 },
      { src: '/vapes/peach/fruit2.png', size: 95, left: '78%', top: '25%', delay: 1.2 },
      { src: '/vapes/peach/fruit3.png', size: 125, left: '25%', top: '65%', delay: 0.6, rotate: -18 },
      { src: '/vapes/peach/fruit4.png', size: 85, left: '72%', top: '70%', delay: 2.1 },
    ],
  },
  {
    id: 'green-apple',
    name: 'GREEN APPLE',
    bgColor: 'from-emerald-400 via-green-500 to-lime-600',
    vapeImage: '/vapes/green-apple/vape.png',
    fruits: [
      { src: '/vapes/green-apple/fruit1.png', size: 135, left: '15%', top: '20%', delay: 0 },
      { src: '/vapes/green-apple/fruit2.png', size: 100, left: '77%', top: '28%', delay: 1.3 },
      { src: '/vapes/green-apple/fruit3.png', size: 115, left: '28%', top: '67%', delay: 0.8 },
      { src: '/vapes/green-apple/fruit4.png', size: 90, left: '70%', top: '72%', delay: 2 },
    ],
  },
  {
    id: 'passion-fruit',
    name: 'PASSION FRUIT',
    bgColor: 'from-purple-500 via-violet-600 to-fuchsia-500',
    vapeImage: '/vapes/passion-fruit/vape.png',
    fruits: [
      { src: '/vapes/passion-fruit/fruit1.png', size: 130, left: '12%', top: '18%', delay: 0 },
      { src: '/vapes/passion-fruit/fruit2.png', size: 105, left: '80%', top: '30%', delay: 1.1 },
      { src: '/vapes/passion-fruit/fruit3.png', size: 110, left: '25%', top: '67%', delay: 0.7 },
      { src: '/vapes/passion-fruit/fruit4.png', size: 88, left: '70%', top: '73%', delay: 2.2 },
    ],
  },
  {
    id: 'dragon-fruit',
    name: 'DRAGON FRUIT',
    bgColor: 'from-rose-500 via-pink-600 to-red-500',
    vapeImage: '/vapes/dragon-fruit/vape.png',
    fruits: [
      { src: '/vapes/dragon-fruit/fruit1.png', size: 135, left: '18%', top: '22%', delay: 0 },
      { src: '/vapes/dragon-fruit/fruit2.png', size: 95, left: '75%', top: '25%', delay: 1.4 },
      { src: '/vapes/dragon-fruit/fruit3.png', size: 120, left: '27%', top: '70%', delay: 0.9 },
      { src: '/vapes/dragon-fruit/fruit4.png', size: 85, left: '72%', top: '68%', delay: 2 },
    ],
  },
  {
    id: 'strawberry',
    name: 'STRAWBERRY',
    bgColor: 'from-red-500 via-rose-600 to-pink-500',
    vapeImage: '/vapes/strawberry/vape.png',
    fruits: [
      { src: '/vapes/strawberry/fruit1.png', size: 130, left: '13%', top: '19%', delay: 0 },
      { src: '/vapes/strawberry/fruit2.png', size: 98, left: '77%', top: '27%', delay: 1.2 },
      { src: '/vapes/strawberry/fruit3.png', size: 118, left: '26%', top: '66%', delay: 0.6 },
      { src: '/vapes/strawberry/fruit4.png', size: 82, left: '71%', top: '73%', delay: 2.3 },
    ],
  },
];

export default function VapePage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const activeFlavor = flavors[activeIndex];
  const prevFlavor = flavors[prevIndex];

  useEffect(() => {
    setPrevIndex(activeIndex);
  }, [activeIndex]);

  return (
    <main className="bg-zinc-950 text-white min-h-screen overflow-hidden">
      {/* Полноэкранная сцена */}
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
            {/* Фон с градиентом */}
            <div className={`absolute inset-0 bg-gradient-to-br ${activeFlavor.bgColor}`} />

            {/* Плавающие фрукты */}
            {activeFlavor.fruits.map((fruit, i) => (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                style={{ left: fruit.left, top: fruit.top, width: fruit.size, height: fruit.size }}
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
            ))}
          </motion.div>
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
          <span className="text-sm md:text-base font-medium text-white/90 group-hover:text-white transition-colors duration-300">
            Back
          </span>
        </motion.button>

        {/* Текст сверху */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activeFlavor.id}`}
            className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="uppercase tracking-[5px] text-sm mb-4 opacity-80">NEW FLAVOUR</div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
              {activeFlavor.name}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Центральное изображение вейпа с плавным перетеканием */}
        <div className="relative z-20 flex items-center justify-center">
          <div className="relative w-[300px] h-[300px] md:w-[430px] md:h-[430px]">
            {/* Предыдущее изображение (исчезает) */}
            <img
              src={prevFlavor.vapeImage}
              alt=""
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out"
              style={{ opacity: 0 }}
            />
            
            {/* Текущее изображение (появляется) */}
            <img
              src={activeFlavor.vapeImage}
              alt={activeFlavor.name}
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ease-in-out"
              style={{ opacity: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Кнопки-миниатюры внизу - полноценные PNG вейпов */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-3 md:gap-4 bg-black/20 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-full">
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
                <img
                  src={flavor.vapeImage}
                  alt={flavor.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Активный индикатор - маленькая точка под активной миниатюрой */}
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
    </main>
  );
}