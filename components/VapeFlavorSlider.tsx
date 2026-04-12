'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
  vapeImage: string;        // ← уникальный PNG вейпа для каждого вкуса
  fruits: Fruit[];
}

const flavors: VapeFlavor[] = [
  {
    id: 'peach',
    name: 'PEACH',
    bgColor: 'from-orange-400 via-amber-500 to-red-500',
    vapeImage: '/vapes/peach/vape.png',           // ← твой уникальный персиковый вейп
    fruits: [
      { src: '/vapes/peach/fruit1.png', size: 135, left: '10%', top: '20%', delay: 0 },
      { src: '/vapes/peach/fruit2.png', size: 95,  left: '78%', top: '25%', delay: 1.4 },
      { src: '/vapes/peach/fruit3.png', size: 120, left: '28%', top: '65%', delay: 0.6, rotate: -15 },
      { src: '/vapes/peach/fruit4.png', size: 80,  left: '72%', top: '70%', delay: 2.2 },
    ],
  },
  {
    id: 'green-apple',
    name: 'GREEN APPLE',
    bgColor: 'from-emerald-400 via-green-500 to-lime-600',
    vapeImage: '/vapes/green-apple/vape.png',     // ← твой уникальный зелёный вейп
    fruits: [
      { src: '/vapes/green-apple/fruit1.png', size: 130, left: '15%', top: '18%', delay: 0 },
      { src: '/vapes/green-apple/fruit2.png', size: 100, left: '75%', top: '30%', delay: 1.1 },
      { src: '/vapes/green-apple/fruit3.png', size: 115, left: '25%', top: '68%', delay: 0.9 },
      { src: '/vapes/green-apple/fruit4.png', size: 90,  left: '70%', top: '72%', delay: 2 },
    ],
  },
  {
    id: 'passion-fruit',
    name: 'PASSION FRUIT',
    bgColor: 'from-purple-500 via-violet-600 to-fuchsia-500',
    vapeImage: '/vapes/passion-fruit/vape.png',   // ← уникальный вейп под маракуйю
    fruits: [
      { src: '/vapes/passion-fruit/fruit1.png', size: 125, left: '12%', top: '22%', delay: 0 },
      { src: '/vapes/passion-fruit/fruit2.png', size: 105, left: '80%', top: '28%', delay: 1.3 },
      { src: '/vapes/passion-fruit/fruit3.png', size: 110, left: '30%', top: '65%', delay: 0.7 },
      { src: '/vapes/passion-fruit/fruit4.png', size: 85,  left: '68%', top: '75%', delay: 2.1 },
    ],
  },
  {
    id: 'dragon-fruit',
    name: 'DRAGON FRUIT',
    bgColor: 'from-rose-500 via-pink-600 to-red-500',
    vapeImage: '/vapes/dragon-fruit/vape.png',    // ← уникальный вейп под драгонфрут
    fruits: [
      { src: '/vapes/dragon-fruit/fruit1.png', size: 130, left: '18%', top: '20%', delay: 0 },
      { src: '/vapes/dragon-fruit/fruit2.png', size: 95,  left: '75%', top: '25%', delay: 1.2 },
      { src: '/vapes/dragon-fruit/fruit3.png', size: 120, left: '25%', top: '70%', delay: 0.8 },
      { src: '/vapes/dragon-fruit/fruit4.png', size: 88,  left: '70%', top: '68%', delay: 2 },
    ],
  },
  {
    id: 'strawberry',
    name: 'STRAWBERRY',
    bgColor: 'from-red-500 via-rose-600 to-pink-500',
    vapeImage: '/vapes/strawberry/vape.png',      // ← уникальный клубничный вейп
    fruits: [
      { src: '/vapes/strawberry/fruit1.png', size: 128, left: '13%', top: '19%', delay: 0 },
      { src: '/vapes/strawberry/fruit2.png', size: 98,  left: '77%', top: '27%', delay: 1.3 },
      { src: '/vapes/strawberry/fruit3.png', size: 118, left: '27%', top: '67%', delay: 0.5 },
      { src: '/vapes/strawberry/fruit4.png', size: 82,  left: '71%', top: '73%', delay: 2.3 },
    ],
  },
];

export default function VapeFlavorSlider() {
  return (
    <section className="py-12 bg-zinc-950 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-12 tracking-tight">
          OUR FLAVOURS
        </h2>

        <div className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory pb-12 scrollbar-hide scroll-smooth">
          {flavors.map((flavor) => (
            <div
              key={flavor.id}
              className="min-w-[92vw] md:min-w-[780px] lg:min-w-[880px] xl:min-w-[960px] flex-shrink-0 snap-center"
            >
              <div className={`relative h-[540px] md:h-[660px] rounded-3xl overflow-hidden bg-gradient-to-br ${flavor.bgColor} shadow-2xl`}>

                {/* Плавающие фрукты */}
                {flavor.fruits.map((fruit, i) => (
                  <motion.div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                      left: fruit.left,
                      top: fruit.top,
                      width: fruit.size,
                      height: fruit.size,
                    }}
                    animate={{
                      y: [0, -32, 0],
                      rotate: [fruit.rotate || 0, (fruit.rotate || 0) + 18, fruit.rotate || 0],
                    }}
                    transition={{
                      duration: 6.5 + i,
                      repeat: Infinity,
                      delay: fruit.delay,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={fruit.src}
                      alt=""
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </motion.div>
                ))}

                {/* Уникальный вейп для каждого вкуса */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[8%] z-20">
                  <motion.div
                    whileHover={{ scale: 1.07, rotate: 7 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Image
                      src={flavor.vapeImage}
                      alt={`${flavor.name} Vape`}
                      width={360}
                      height={520}
                      className="drop-shadow-2xl"
                      priority
                    />
                  </motion.div>
                </div>

                {/* Ауры вокруг вейпа */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/25 rounded-full"
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 9, repeat: Infinity }}
                />
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[410px] h-[410px] border border-white/10 rounded-full"
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 7.5, repeat: Infinity, delay: 1.2 }}
                />

                {/* Информация */}
                <div className="absolute bottom-8 left-8 md:left-12 text-white z-30">
                  <div className="uppercase tracking-[4px] text-sm mb-2 opacity-80">NEW FLAVOUR</div>
                  <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 drop-shadow-lg">
                    {flavor.name}
                  </h3>
                  <button className="mt-4 px-10 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/95 transition-all active:scale-95 text-lg">
                    VIEW FLAVOUR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}