// app/cards/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, Sparkles, Zap, Globe, User, Rocket, Star, X, ChevronDown } from 'lucide-react';

// --- ТИПЫ ДАННЫХ ---
interface Card {
  id: number;
  name: string;
  category: string;
  type: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  faction: string;
  power: number;
  cost: number;
  description: string;
  img: string;
  imgh: string;
  vid?: string;
}

// --- КАТЕГОРИИ ДЛЯ ФИЛЬТРАЦИИ ---
const CATEGORIES = [
  { id: 'all', name: 'ALL CARDS', icon: '✨' },
  { id: 'ASTRONAUTS', name: 'ASTRONAUTS', icon: '👨‍🚀', color: '#00d4ff' },
  { id: 'ALIENS', name: 'ALIENS', icon: '👾', color: '#9945ff' },
  { id: 'PLANETS', name: 'PLANETS', icon: '🪐', color: '#14f195' },
  { id: 'SHIPS', name: 'SHIPS', icon: '🚀', color: '#ff6b35' },
];

const RARITIES = [
  { id: 'all', name: 'ALL RARITIES', color: '#6b6b7b' },
  { id: 'common', name: 'COMMON', color: '#6b6b7b' },
  { id: 'rare', name: 'RARE', color: '#14f195' },
  { id: 'epic', name: 'EPIC', color: '#9945ff' },
  { id: 'legendary', name: 'LEGENDARY', color: '#ff6b35' },
];

// --- ВСЕ ДАННЫЕ КАРТ ---
const cardsData: Card[] = [
  // ==================== ALIENS ====================
  { id: 11, name: "Elozar the Watcher", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 57, cost: 36, description: "A mysterious watcher from beyond the stars.", img: "/cards/aliens/COMMON-Elozar the Watcher.webp", imgh: "/cards/back/COMMON-Elozar the Watcher.webp" },
  { id: 12, name: "Ithara the Ascended", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 34, cost: 56, description: "Ascended to a higher plane of existence.", img: "/cards/aliens/COMMON-Ithara the Ascended.webp", imgh: "/cards/back/COMMON-Ithara the Ascended.webp" },
  { id: 13, name: "Ixan the Forgotten", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 46, cost: 32, description: "Lost to time, but never forgotten.", img: "/cards/aliens/COMMON-Ixan the Forgotten.webp", imgh: "/cards/back/COMMON-Ixan the Forgotten.webp" },
  { id: 14, name: "Orrek the Tyrant", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 55, cost: 31, description: "A cruel ruler of a distant world.", img: "/cards/aliens/COMMON-Orrek the Tyrant.webp", imgh: "/cards/back/COMMON-Orrek the Tyrant.webp" },
  { id: 15, name: "RakXan the Executioner", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 55, cost: 56, description: "Merciless and efficient.", img: "/cards/aliens/COMMON-RakXan the Executioner.webp", imgh: "/cards/back/COMMON-RakXan the Executioner.webp" },
  { id: 16, name: "SkarVex the Betrayed", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 41, cost: 49, description: "Once loyal, now seeks revenge.", img: "/cards/aliens/COMMON-SkarVex the Betrayed.webp", imgh: "/cards/back/COMMON-SkarVex the Betrayed.webp" },
  { id: 17, name: "Thyros the Conduit", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 34, cost: 48, description: "Channeler of cosmic energy.", img: "/cards/aliens/COMMON-Thyros the Conduit.webp", imgh: "/cards/back/COMMON-Thyros the Conduit.webp" },
  { id: 18, name: "Vorrak the Warrior", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 50, cost: 51, description: "A seasoned intergalactic warrior.", img: "/cards/aliens/COMMON-Vorrak the Warrior.webp", imgh: "/cards/back/COMMON-Vorrak the Warrior.webp" },
  { id: 19, name: "YTorris the Corruptor", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 39, cost: 46, description: "Spreads corruption wherever he goes.", img: "/cards/aliens/COMMON-YTorris the Corruptor.webp", imgh: "/cards/back/COMMON-YTorris the Corruptor.webp" },
  { id: 20, name: "Zyara the Wanderer", category: "ALIENS", type: "Aliens", rarity: "common", faction: "", power: 48, cost: 43, description: "A nomad of the cosmos.", img: "/cards/aliens/COMMON-Zyara the Wanderer.webp", imgh: "/cards/back/COMMON-Zyara the Wanderer.webp" },
  // Rare Aliens
  { id: 29, name: "EkRath the Shapeshifter", category: "ALIENS", type: "Aliens", rarity: "rare", faction: "", power: 58, cost: 53, description: "Can take any form imaginable.", img: "/cards/aliens/RARE-EkRath the Shapeshifter.webp", imgh: "/cards/back/RARE-EkRath the Shapeshifter.webp" },
  { id: 30, name: "GrizZorr the Unchained", category: "ALIENS", type: "Aliens", rarity: "rare", faction: "", power: 53, cost: 72, description: "Broken free from all constraints.", img: "/cards/aliens/RARE-GrizZorr the Unchained.webp", imgh: "/cards/back/RARE-GrizZorr the Unchained.webp" },
  { id: 31, name: "JoraXel the Puppeteer", category: "ALIENS", type: "Aliens", rarity: "rare", faction: "", power: 59, cost: 68, description: "Controls minds with ease.", img: "/cards/aliens/RARE-JoraXel the Puppeteer.webp", imgh: "/cards/back/RARE-JoraXel the Puppeteer.webp" },
  { id: 32, name: "Nyxra the Silent", category: "ALIENS", type: "Aliens", rarity: "rare", faction: "", power: 68, cost: 60, description: "Moves without making a sound.", img: "/cards/aliens/RARE-Nyxra the Silent.webp", imgh: "/cards/back/RARE-Nyxra the Silent.webp" },
  { id: 33, name: "SKrell the Innovator", category: "ALIENS", type: "Aliens", rarity: "rare", faction: "", power: 50, cost: 70, description: "A genius inventor.", img: "/cards/aliens/RARE-SKrell the Innovator.webp", imgh: "/cards/back/RARE-SKrell the Innovator.webp" },
  { id: 34, name: "VaelThar the Unseen", category: "ALIENS", type: "Aliens", rarity: "rare", faction: "", power: 53, cost: 73, description: "Invisible to the naked eye.", img: "/cards/aliens/RARE-VaelThar the Unseen.webp", imgh: "/cards/back/RARE-VaelThar the Unseen.webp" },
  { id: 35, name: "Xyloz the Whisperer", category: "ALIENS", type: "Aliens", rarity: "rare", faction: "", power: 52, cost: 60, description: "His whispers drive men mad.", img: "/cards/aliens/RARE-Xyloz the Whisperer.webp", imgh: "/cards/back/RARE-Xyloz the Whisperer.webp" },
  // Epic Aliens
  { id: 21, name: "Krall Vexx", category: "ALIENS", type: "Aliens", rarity: "epic", faction: "", power: 66, cost: 79, description: "A fearsome alien warlord.", img: "/cards/aliens/EPIC-Krall Vexx.webp", imgh: "/cards/back/EPIC-Krall Vexx.webp", vid: "/video/aliens/FLFKJ_00001_p81_ztusj_1758630549.mp4" },
  { id: 22, name: "Queen Sylphara of the Nebulites", category: "ALIENS", type: "Aliens", rarity: "epic", faction: "", power: 75, cost: 82, description: "Ruler of the Nebulite race.", img: "/cards/aliens/EPIC-Queen Sylphara of the Nebulites.webp", imgh: "/cards/back/EPIC-Queen Sylphara of the Nebulites.webp", vid: "/video/aliens/FLFKJ_00002_p83_kecah_1758562701.mp4" },
  { id: 23, name: "Tz'Nara the Enchantress", category: "ALIENS", type: "Aliens", rarity: "epic", faction: "", power: 84, cost: 82, description: "Bewitches all who look upon her.", img: "/cards/aliens/EPIC-Tz'Nara the Enchantress.webp", imgh: "/cards/back/EPIC-Tz'Nara the Enchantress.webp", vid: "/video/aliens/FLFKJ_00001_p81_tvdrb_1758560140.mp4" },
  { id: 24, name: "Vul'Kar the Eternal", category: "ALIENS", type: "Aliens", rarity: "epic", faction: "", power: 74, cost: 68, description: "Has lived for millennia.", img: "/cards/aliens/EPIC-Vul'Kar the Eternal.webp", imgh: "/cards/back/EPIC-Vul'Kar the Eternal.webp", vid: "/video/aliens/FLFKJ_00001_p85_podpj_1758549731.mp4" },
  { id: 25, name: "Zyphos the Paradox", category: "ALIENS", type: "Aliens", rarity: "epic", faction: "", power: 77, cost: 84, description: "Defies the laws of reality.", img: "/cards/aliens/EPIC-Zyphos the Paradox.webp", imgh: "/cards/back/EPIC-Zyphos the Paradox.webp", vid: "/video/aliens/FLFKJ_00001_vaauc_1756030981.mp4" },
  // Legendary Aliens
  { id: 26, name: "Drozzik the Devourer", category: "ALIENS", type: "Aliens", rarity: "legendary", faction: "", power: 88, cost: 92, description: "Consumes entire planets.", img: "/cards/aliens/LEGENDARY-Drozzik the Devourer.webp", imgh: "/cards/back/LEGENDARY-Drozzik the Devourer.webp", vid: "/video/aliens/FLFKJ_00001_vdpbd_1756041487.mp4" },
  { id: 27, name: "N'Kara the Voidborn", category: "ALIENS", type: "Aliens", rarity: "legendary", faction: "", power: 94, cost: 89, description: "Born from the void itself.", img: "/cards/aliens/LEGENDARY-N'Kara the Voidborn.webp", imgh: "/cards/back/LEGENDARY-N'Kara the Voidborn.webp", vid: "/video/aliens/FLFKJ_00001_p81_plzut_1758543750.mp4" },
  { id: 28, name: "Ophus Prime", category: "ALIENS", type: "Aliens", rarity: "legendary", faction: "", power: 92, cost: 90, description: "The first of his kind.", img: "/cards/aliens/LEGENDARY-Ophus Prime.webp", imgh: "/cards/back/LEGENDARY-Ophus Prime.webp", vid: "/video/aliens/FLFKJ_00001_p84_dgycu_1758540881.mp4" },

  // ==================== ASTRONAUTS ====================
  { id: 51, name: "Axel Cometstrike", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 30, cost: 54, description: "Fast and furious pilot.", img: "/cards/astronauts/COMMON-Axel Cometstrike.webp", imgh: "/cards/back/COMMON-Axel Cometstrike.webp" },
  { id: 52, name: "Darius Eclipse", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 40, cost: 33, description: "Master of shadow operations.", img: "/cards/astronauts/COMMON-Darius Eclipse.webp", imgh: "/cards/back/COMMON-Darius Eclipse.webp" },
  { id: 53, name: "Lieutenant Vega Stride", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 48, cost: 38, description: "A promising young officer.", img: "/cards/astronauts/COMMON-Lieutenant Vega Stride.webp", imgh: "/cards/back/COMMON-Lieutenant Vega Stride.webp" },
  { id: 54, name: "Elias Quasar", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 60, cost: 54, description: "Energy manipulation expert.", img: "/cards/astronauts/COMMON-Elias Quasar.webp", imgh: "/cards/back/COMMON-Elias Quasar.webp" },
  { id: 55, name: "Mira Voidwalker", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 55, cost: 57, description: "Navigates the void with ease.", img: "/cards/astronauts/COMMON-Mira Voidwalker.webp", imgh: "/cards/back/COMMON-Mira Voidwalker.webp" },
  { id: 56, name: "Ronan Gravitas", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 55, cost: 35, description: "Controls gravity fields.", img: "/cards/astronauts/COMMON-Ronan Gravitas.webp", imgh: "/cards/back/COMMON-Ronan Gravitas.webp" },
  { id: 57, name: "Solara Vega", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 34, cost: 36, description: "Harnesses solar power.", img: "/cards/astronauts/COMMON-Solara Vega.webp", imgh: "/cards/back/COMMON-Solara Vega.webp" },
  { id: 58, name: "Selene Dusk", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 52, cost: 43, description: "Thrives in darkness.", img: "/cards/astronauts/COMMON-Selene Dusk.webp", imgh: "/cards/back/COMMON-Selene Dusk.webp" },
  { id: 59, name: "Luna Cypher", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 32, cost: 42, description: "Decrypts any code.", img: "/cards/astronauts/COMMON-Luna Cypher.webp", imgh: "/cards/back/COMMON-Luna Cypher.webp" },
  { id: 60, name: "Taryn Zenith", category: "ASTRONAUTS", type: "Astronauts", rarity: "common", faction: "", power: 40, cost: 38, description: "Reaches the highest peaks.", img: "/cards/astronauts/COMMON-Taryn Zenith.webp", imgh: "/cards/back/COMMON-Taryn Zenith.webp" },
  // Rare Astronauts
  { id: 39, name: "Commander Aiden Solace", category: "ASTRONAUTS", type: "Astronauts", rarity: "rare", faction: "", power: 56, cost: 57, description: "A calm and collected leader.", img: "/cards/astronauts/RARE-Commander Aiden Solace.webp", imgh: "/cards/back/RARE-Commander Aiden Solace.webp" },
  { id: 40, name: "Dante Helios", category: "ASTRONAUTS", type: "Astronauts", rarity: "rare", faction: "", power: 50, cost: 67, description: "Burns with the fury of the sun.", img: "/cards/astronauts/RARE-Dante Helios.webp", imgh: "/cards/back/RARE-Dante Helios.webp" },
  { id: 41, name: "Cassiopeia Lux", category: "ASTRONAUTS", type: "Astronauts", rarity: "rare", faction: "", power: 56, cost: 72, description: "Brings light to dark places.", img: "/cards/astronauts/RARE-Cassiopeia Lux.webp", imgh: "/cards/back/RARE-Cassiopeia Lux.webp" },
  { id: 42, name: "Jace Photon", category: "ASTRONAUTS", type: "Astronauts", rarity: "rare", faction: "", power: 70, cost: 72, description: "Moves at the speed of light.", img: "/cards/astronauts/RARE-Jace Photon.webp", imgh: "/cards/back/RARE-Jace Photon.webp" },
  { id: 43, name: "Seraphine Rayne", category: "ASTRONAUTS", type: "Astronauts", rarity: "rare", faction: "", power: 66, cost: 69, description: "Healing rain follows her.", img: "/cards/astronauts/RARE-Seraphine Rayne.webp", imgh: "/cards/back/RARE-Seraphine Rayne.webp" },
  { id: 44, name: "Syrus Warp", category: "ASTRONAUTS", type: "Astronauts", rarity: "rare", faction: "", power: 57, cost: 64, description: "Bends space and time.", img: "/cards/astronauts/RARE-Syrus Warp.webp", imgh: "/cards/back/RARE-Syrus Warp.webp" },
  { id: 45, name: "Felix Hypernova", category: "ASTRONAUTS", type: "Astronauts", rarity: "rare", faction: "", power: 67, cost: 63, description: "Explodes with stellar energy.", img: "/cards/astronauts/RARE-Felix Hypernova.webp", imgh: "/cards/back/RARE-Felix Hypernova.webp" },
  // Epic Astronauts
  { id: 46, name: "Dr. Nova Kessler", category: "ASTRONAUTS", type: "Astronauts", rarity: "epic", faction: "", power: 65, cost: 67, description: "Brilliant scientist and inventor.", img: "/cards/astronauts/EPIC-Dr. Nova Kessler.webp", imgh: "/cards/back/EPIC-Dr. Nova Kessler.webp", vid: "/video/astronauts/FLFKJ_00001_p80_xvxhi_1758632846.mp4" },
  { id: 47, name: "Kai Starborn", category: "ASTRONAUTS", type: "Astronauts", rarity: "epic", faction: "", power: 67, cost: 83, description: "Born from a dying star.", img: "/cards/astronauts/EPIC-Kai Starborn.webp", imgh: "/cards/back/EPIC-Kai Starborn.webp", vid: "/video/astronauts/FLFKJ_00001_p83_htmeg_1758631690.mp4" },
  { id: 48, name: "Lucian Riftwalker", category: "ASTRONAUTS", type: "Astronauts", rarity: "epic", faction: "", power: 72, cost: 69, description: "Walks between dimensions.", img: "/cards/astronauts/EPIC-Lucian Riftwalker.webp", imgh: "/cards/back/EPIC-Lucian Riftwalker.webp", vid: "/video/astronauts/FLFKJ_00001_p86_euhas_1758630005.mp4" },
  { id: 49, name: "Valeria Storm", category: "ASTRONAUTS", type: "Astronauts", rarity: "epic", faction: "", power: 68, cost: 82, description: "Commands cosmic storms.", img: "/cards/astronauts/EPIC-Valeria Storm.webp", imgh: "/cards/back/EPIC-Valeria Storm.webp", vid: "/video/astronauts/FLFKJ_00001_p84_jpsap_1758559856.mp4" },
  { id: 50, name: "Zara Eclipse", category: "ASTRONAUTS", type: "Astronauts", rarity: "epic", faction: "", power: 78, cost: 66, description: "Brings darkness to her enemies.", img: "/cards/astronauts/EPIC-Zara Eclipse.webp", imgh: "/cards/back/EPIC-Zara Eclipse.webp", vid: "/video/astronauts/FLFKJ_00001_p80_hzrpa_1758549060.mp4" },
  // Legendary Astronauts
  { id: 36, name: "Captain Orion Blaze", category: "ASTRONAUTS", type: "Astronauts", rarity: "legendary", faction: "", power: 95, cost: 86, description: "The legendary captain of the Astro fleet.", img: "/cards/astronauts/LEGENDARY-Captain Orion Blaze.webp", imgh: "/cards/back/LEGENDARY-Captain Orion Blaze.webp", vid: "/video/astronauts/FLFKJ_00001_ovvek_1756033756.mp4" },
  { id: 37, name: "Aurora Titan", category: "ASTRONAUTS", type: "Astronauts", rarity: "legendary", faction: "", power: 89, cost: 88, description: "A titan among astronauts.", img: "/cards/astronauts/LEGENDARY-Aurora Titan.webp", imgh: "/cards/back/LEGENDARY-Aurora Titan.webp", vid: "/video/astronauts/FLFKJ_00002_viebs_1756032542.mp4" },
  { id: 38, name: "Kieran Pulsar", category: "ASTRONAUTS", type: "Astronauts", rarity: "legendary", faction: "", power: 85, cost: 96, description: "Pulses with unstoppable energy.", img: "/cards/astronauts/LEGENDARY-Kieran Pulsar.webp", imgh: "/cards/back/LEGENDARY-Kieran Pulsar.webp", vid: "/video/astronauts/FLFKJ_00001_p85_kpgpl_1758544218.mp4" },

  // ==================== PLANETS ====================
  { id: 75, name: "Duskara", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 46, cost: 51, description: "A world of eternal twilight.", img: "/cards/planets/COMMON-Duskara.webp", imgh: "/cards/back/COMMON-Duskara.webp" },
  { id: 76, name: "Eclipse Minor", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 51, cost: 35, description: "A small moon with big secrets.", img: "/cards/planets/COMMON-Eclipse Minor.webp", imgh: "/cards/back/COMMON-Eclipse Minor.webp" },
  { id: 77, name: "Elysium-7", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 42, cost: 31, description: "A paradise world.", img: "/cards/planets/COMMON-Elysium-7.webp", imgh: "/cards/back/COMMON-Elysium-7.webp" },
  { id: 78, name: "Nirvanna-4", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 45, cost: 40, description: "A peaceful sanctuary.", img: "/cards/planets/COMMON-Nirvanna-4.webp", imgh: "/cards/back/COMMON-Nirvanna-4.webp" },
  { id: 80, name: "Titanfall", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 54, cost: 32, description: "A massive mining colony.", img: "/cards/planets/COMMON-Titanfall.webp", imgh: "/cards/back/COMMON-Titanfall.webp" },
  { id: 81, name: "Solstice Prime", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 57, cost: 48, description: "Where the sun never sets.", img: "/cards/planets/COMMON-Solstice Prime.webp", imgh: "/cards/back/COMMON-Solstice Prime.webp" },
  { id: 82, name: "THE EVERDARK", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 30, cost: 43, description: "A world without light.", img: "/cards/planets/COMMON-THE EVERDARK.webp", imgh: "/cards/back/COMMON-THE EVERDARK.webp" },
  { id: 83, name: "Infernum IX", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 38, cost: 47, description: "A volcanic hellscape.", img: "/cards/planets/COMMON-Infernum IX.webp", imgh: "/cards/back/COMMON-Infernum IX.webp" },
  { id: 84, name: "Zephyr-Prime", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 40, cost: 32, description: "Windswept and beautiful.", img: "/cards/planets/COMMON-Zephyr-Prime.webp", imgh: "/cards/back/COMMON-Zephyr-Prime.webp" },
  { id: 85, name: "Hyperia", category: "PLANETS", type: "planet", rarity: "common", faction: "", power: 60, cost: 52, description: "A hyper-advanced civilization.", img: "/cards/planets/COMMON-Hyperia.webp", imgh: "/cards/back/COMMON-Hyperia.webp" },
  // Rare Planets
  { id: 61, name: "Abyssion", category: "PLANETS", type: "planet", rarity: "rare", faction: "", power: 71, cost: 56, description: "The deepest ocean world.", img: "/cards/planets/RARE-Abyssion.webp", imgh: "/cards/back/RARE-Abyssion.webp" },
  { id: 62, name: "Aetheris", category: "PLANETS", type: "planet", rarity: "rare", faction: "", power: 73, cost: 69, description: "A world of pure energy.", img: "/cards/planets/RARE-Aetheris.webp", imgh: "/cards/back/RARE-Aetheris.webp" },
  { id: 63, name: "Maelstrom-22", category: "PLANETS", type: "planet", rarity: "rare", faction: "", power: 61, cost: 62, description: "Caught in an eternal storm.", img: "/cards/planets/RARE-Maelstrom-22.webp", imgh: "/cards/back/RARE-Maelstrom-22.webp" },
  { id: 64, name: "Genesis Prime", category: "PLANETS", type: "planet", rarity: "rare", faction: "", power: 54, cost: 64, description: "Where life began.", img: "/cards/planets/RARE-Genesis Prime.webp", imgh: "/cards/back/RARE-Genesis Prime.webp" },
  { id: 65, name: "Oracles Cradle", category: "PLANETS", type: "planet", rarity: "rare", faction: "", power: 75, cost: 75, description: "Home of the ancient oracles.", img: "/cards/planets/RARE-Oracles Cradle.webp", imgh: "/cards/back/RARE-Oracles Cradle.webp" },
  { id: 66, name: "Cryovale", category: "PLANETS", type: "planet", rarity: "rare", faction: "", power: 56, cost: 63, description: "A frozen wasteland.", img: "/cards/planets/RARE-Cryovale.webp", imgh: "/cards/back/RARE-Cryovale.webp" },
  { id: 68, name: "Omen-13", category: "PLANETS", type: "planet", rarity: "rare", faction: "", power: 68, cost: 56, description: "An ill-fated world.", img: "/cards/planets/RARE-Omen-13.webp", imgh: "/cards/back/RARE-Omen-13.webp" },
  // Epic Planets
  { id: 67, name: "Mythra-7", category: "PLANETS", type: "planet", rarity: "epic", faction: "", power: 67, cost: 73, description: "A world of myth and legend.", img: "/cards/planets/EPIC-Mythra-7.webp", imgh: "/cards/back/EPIC-Mythra-7.webp", vid: "/video/planets/FLFKJ_00001_p86_vazxj_1758625416.mp4" },
  { id: 69, name: "Vortexa", category: "PLANETS", type: "planet", rarity: "epic", faction: "", power: 82, cost: 67, description: "A world torn by dimensional rifts.", img: "/cards/planets/EPIC-Vortexa.webp", imgh: "/cards/back/EPIC-Vortexa.webp", vid: "/video/planets/FLFKJ_00001_p82_ydgpg_1758551308.mp4" },
  { id: 70, name: "Singularity-1", category: "PLANETS", type: "planet", rarity: "epic", faction: "", power: 72, cost: 69, description: "Orbits a black hole.", img: "/cards/planets/EPIC-Singularity-1.webp", imgh: "/cards/back/EPIC-Singularity-1.webp", vid: "/video/planets/FLFKJ_00001_p83_tboqs_1758562454.mp4" },
  { id: 71, name: "Voidborn Expanse", category: "PLANETS", type: "planet", rarity: "epic", faction: "", power: 77, cost: 81, description: "A world born from the void.", img: "/cards/planets/EPIC-Voidborn Expanse.webp", imgh: "/cards/back/EPIC-Voidborn Expanse.webp", vid: "/video/planets/FLFKJ_00001_p86_jxrno_1758558974.mp4" },
  { id: 74, name: "Zephyria", category: "PLANETS", type: "planet", rarity: "epic", faction: "", power: 84, cost: 80, description: "A world of gentle winds.", img: "/cards/planets/EPIC-Zephyria.webp", imgh: "/cards/back/EPIC-Zephyria.webp", vid: "/video/planets/FLFKJ_00001_p81_kmbod_1758545784.mp4" },
  // Legendary Planets
  { id: 72, name: "Obscura Prime", category: "PLANETS", type: "planet", rarity: "legendary", faction: "", power: 91, cost: 91, description: "A world shrouded in mystery.", img: "/cards/planets/LEGENDARY-Obscura Prime.webp", imgh: "/cards/back/LEGENDARY-Obscura Prime.webp", vid: "/video/planets/FLFKJ_00001_p87_knmxz_1758541438.mp4" },
  { id: 73, name: "The Hollow Moon", category: "PLANETS", type: "planet", rarity: "legendary", faction: "", power: 87, cost: 88, description: "An artificial moon of unknown origin.", img: "/cards/planets/LEGENDARY-The Hollow Moon.webp", imgh: "/cards/back/LEGENDARY-The Hollow Moon.webp", vid: "/video/planets/FLFKJ_00001_p81_gdpmx_1758540440.mp4" },
  { id: 79, name: "Nebulon's Tear", category: "PLANETS", type: "planet", rarity: "legendary", faction: "", power: 88, cost: 94, description: "A crystalline world of great beauty.", img: "/cards/planets/LEGENDARY-Nebulon's Tear.webp", imgh: "/cards/back/LEGENDARY-Nebulon's Tear.webp", vid: "/video/planets/FLFKJ_00001_p85_sbcqp_1758541790.mp4" },

  // ==================== SHIPS ====================
  { id: 101, name: "Hyperions Veil", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 58, cost: 32, description: "A stealth reconnaissance vessel.", img: "/cards/ships/COMMON-Hyperions Veil.webp", imgh: "/cards/back/COMMON-Hyperions Veil.webp" },
  { id: 102, name: "Nova Striker", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 60, cost: 55, description: "Fast attack fighter.", img: "/cards/ships/COMMON-Nova Striker.webp", imgh: "/cards/back/COMMON-Nova Striker.webp" },
  { id: 103, name: "Aurora's Grace", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 41, cost: 46, description: "An elegant diplomatic vessel.", img: "/cards/ships/COMMON-Auroras Grace.webp", imgh: "/cards/back/COMMON-Auroras Grace.webp" },
  { id: 104, name: "Infinity Spear", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 50, cost: 42, description: "Precision strike craft.", img: "/cards/ships/COMMON-Infinity Spear.webp", imgh: "/cards/back/COMMON-Infinity Spear.webp" },
  { id: 105, name: "The Shadow Corsair", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 30, cost: 52, description: "Pirate vessel of the void.", img: "/cards/ships/COMMON-The Shadow Corsair.webp", imgh: "/cards/back/COMMON-The Shadow Corsair.webp" },
  { id: 106, name: "Doombringer Mk-X", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 59, cost: 30, description: "Heavy artillery platform.", img: "/cards/ships/COMMON-Doombringer Mk-X.webp", imgh: "/cards/back/COMMON-Doombringer Mk-X.webp" },
  { id: 107, name: "Warpfang", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 37, cost: 55, description: "Faster than light interceptor.", img: "/cards/ships/COMMON-Warpfang.webp", imgh: "/cards/back/COMMON-Warpfang.webp" },
  { id: 108, name: "Eclipse Striker", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 59, cost: 44, description: "Night operations specialist.", img: "/cards/ships/COMMON-Eclipse Striker.webp", imgh: "/cards/back/COMMON-Eclipse Striker.webp" },
  { id: 109, name: "Nebula Nomad", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 54, cost: 36, description: "Long-range explorer.", img: "/cards/ships/COMMON-Nebula Nomad.webp", imgh: "/cards/back/COMMON-Nebula Nomad.webp" },
  { id: 110, name: "Phantom Dagger", category: "SHIPS", type: "starship", rarity: "common", faction: "", power: 49, cost: 33, description: "Cloaked assassin ship.", img: "/cards/ships/COMMON-Phantom Dagger.webp", imgh: "/cards/back/COMMON-Phantom Dagger.webp" },
  // Rare Ships
  { id: 86, name: "Event Horizon", category: "SHIPS", type: "starship", rarity: "rare", faction: "", power: 67, cost: 66, description: "Can survive near black holes.", img: "/cards/ships/RARE-Event Horizon.webp", imgh: "/cards/back/RARE-Event Horizon.webp" },
  { id: 87, name: "Celestial Herald", category: "SHIPS", type: "starship", rarity: "rare", faction: "", power: 74, cost: 56, description: "Announces the arrival of fleets.", img: "/cards/ships/RARE-Celestial Herald.webp", imgh: "/cards/back/RARE-Celestial Herald.webp" },
  { id: 88, name: "Orions Wrath", category: "SHIPS", type: "starship", rarity: "rare", faction: "", power: 52, cost: 74, description: "A formidable battleship.", img: "/cards/ships/RARE-Orions Wrath.webp", imgh: "/cards/back/RARE-Orions Wrath.webp" },
  { id: 89, name: "Oblivions Edge", category: "SHIPS", type: "starship", rarity: "rare", faction: "", power: 62, cost: 53, description: "Cuts through enemy lines.", img: "/cards/ships/RARE-Oblivions Edge.webp", imgh: "/cards/back/RARE-Oblivions Edge.webp" },
  { id: 90, name: "Titans Wrath", category: "SHIPS", type: "starship", rarity: "rare", faction: "", power: 63, cost: 51, description: "A massive dreadnought.", img: "/cards/ships/RARE-Titans Wrath.webp", imgh: "/cards/back/RARE-Titans Wrath.webp" },
  { id: 91, name: "Solar Lance", category: "SHIPS", type: "starship", rarity: "rare", faction: "", power: 69, cost: 50, description: "Fires concentrated solar beams.", img: "/cards/ships/RARE-Solar Lance.webp", imgh: "/cards/back/RARE-Solar Lance.webp" },
  { id: 92, name: "Starborn Serpent", category: "SHIPS", type: "starship", rarity: "rare", faction: "", power: 51, cost: 53, description: "A sleek and deadly corvette.", img: "/cards/ships/RARE-Starborn Serpent.webp", imgh: "/cards/back/RARE-Starborn Serpent.webp" },
  // Epic Ships
  { id: 93, name: "Zenith Prime", category: "SHIPS", type: "starship", rarity: "epic", faction: "", power: 76, cost: 77, description: "The pinnacle of ship design.", img: "/cards/ships/EPIC-Zenith Prime.webp", imgh: "/cards/back/EPIC-Zenith Prime.webp", vid: "/video/ships/FLFKJ_00001_p80_tcngr_1758547843.mp4" },
  { id: 97, name: "Chrono Voyager", category: "SHIPS", type: "starship", rarity: "epic", faction: "", power: 83, cost: 72, description: "A time-traveling vessel.", img: "/cards/ships/EPIC-Chrono Voyager.webp", imgh: "/cards/back/EPIC-Chrono Voyager.webp", vid: "/video/ships/FLFKJ_00001_p84_peduy_1758633354.mp4" },
  { id: 98, name: "Quantum Mirage", category: "SHIPS", type: "starship", rarity: "epic", faction: "", power: 81, cost: 65, description: "Creates quantum duplicates.", img: "/cards/ships/EPIC-Quantum Mirage.webp", imgh: "/cards/back/EPIC-Quantum Mirage.webp", vid: "/video/ships/FLFKJ_00001_p85_nhsbx_1758624485.mp4" },
  { id: 99, name: "Starforge Ascendant", category: "SHIPS", type: "starship", rarity: "epic", faction: "", power: 77, cost: 68, description: "A mobile shipyard.", img: "/cards/ships/EPIC-Starforge Ascendant.webp", imgh: "/cards/back/EPIC-Starforge Ascendant.webp", vid: "/video/ships/FLFKJ_00001_p83_hpgae_1758561145.mp4" },
  { id: 100, name: "The Celestial Dragon", category: "SHIPS", type: "starship", rarity: "epic", faction: "", power: 67, cost: 77, description: "A legendary warship.", img: "/cards/ships/EPIC-The Celestial Dragon.webp", imgh: "/cards/back/EPIC-The Celestial Dragon.webp", vid: "/video/ships/FLFKJ_00002_p81_nhfjq_1758560337.mp4" },
  // Legendary Ships
  { id: 94, name: "The Void Reaper", category: "SHIPS", type: "starship", rarity: "legendary", faction: "", power: 93, cost: 86, description: "A legendary bounty hunter ship.", img: "/cards/ships/LEGENDARY-The Void Reaper.webp", imgh: "/cards/back/LEGENDARY-The Void Reaper.webp", vid: "/video/ships/FLFKJ_00001_p86_ypjza_1758539941.mp4" },
  { id: 95, name: "Final Exodus", category: "SHIPS", type: "starship", rarity: "legendary", faction: "", power: 95, cost: 98, description: "A massive colony ship.", img: "/cards/ships/LEGENDARY-Final Exodus.webp", imgh: "/cards/back/LEGENDARY-Final Exodus.webp", vid: "/video/ships/FLFKJ_00001_p83_hrpdp_1758545000.mp4" },
  { id: 96, name: "Whispering Ghost", category: "SHIPS", type: "starship", rarity: "legendary", faction: "", power: 92, cost: 87, description: "A stealth vessel of legend.", img: "/cards/ships/LEGENDARY-Whispering Ghost.webp", imgh: "/cards/back/LEGENDARY-Whispering Ghost.webp", vid: "/video/ships/FLFKJ_00001_p87_tpxuh_1758539458.mp4" },
];

// --- КОМПОНЕНТ КАРТОЧКИ С 3D ПЕРЕВОРОТОМ ---
const FlipCard = ({ card, onCardClick }: { card: Card; onCardClick: (card: Card) => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCardClick(card);
  };

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return { bg: 'from-yellow-800 to-orange-900', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' };
      case 'epic': return { bg: 'from-purple-800 to-purple-900', border: 'border-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/20' };
      case 'rare': return { bg: 'from-blue-800 to-blue-900', border: 'border-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/20' };
      default: return { bg: 'from-gray-800 to-gray-900', border: 'border-gray-600', text: 'text-gray-400', glow: '' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ASTRONAUTS': return <Rocket className="w-5 h-5" />;
      case 'ALIENS': return <User className="w-5 h-5" />;
      case 'PLANETS': return <Globe className="w-5 h-5" />;
      case 'SHIPS': return <Rocket className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const styles = getRarityStyles(card.rarity);

  return (
    <div 
      className="relative w-full cursor-pointer group perspective-1000"
      onClick={handleCardClick}
    >
      <div className={`relative transition-all duration-500 transform-3d preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* ЛИЦЕВАЯ СТОРОНА */}
        <div className={`backface-hidden w-full rounded-xl overflow-hidden bg-gradient-to-b ${styles.bg} border-2 ${styles.border} shadow-xl ${styles.glow}`}>
          <div className="aspect-[3/4] relative">
            {card.vid ? (
              <video
                src={card.vid}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <img 
                src={card.img} 
                alt={card.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            
            <div className="absolute top-3 left-3">
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-xs font-mono ${styles.text}`}>
                {getCategoryIcon(card.category)}
                <span className="text-[10px] font-bold">{card.category}</span>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex justify-between gap-2 mb-1.5">
                <span className="text-xs font-mono text-white/70">⚡ POWER {card.power}</span>
                <span className="text-xs font-mono text-white/70">❤️ HEALTH {card.cost}</span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white truncate">{card.name}</h3>
            </div>
          </div>
        </div>

        {/* ОБРАТНАЯ СТОРОНА */}
        <div className={`absolute inset-0 backface-hidden w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-2 ${styles.border} rotate-y-180`}>
          <div className="aspect-[3/4] relative">
            <img 
              src={card.imgh} 
              alt={`${card.name} back`}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  {getCategoryIcon(card.category)}
                  <span className="text-xs font-mono text-white/60">{card.category}</span>
                </div>
                <span className={`text-xs font-mono ${styles.text}`}>
                  #{card.id}
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white mb-2">{card.name}</h3>
              
              <button
                onClick={handleDetailsClick}
                className={`w-full mt-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  card.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500' :
                  card.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600' :
                  card.rarity === 'rare' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600' :
                  'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
                } text-white shadow-lg`}
              >
                DETAILS
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

// --- МОДАЛЬНОЕ ОКНО С ВРАЩЕНИЕМ КАРТЫ ---
const EnlargedModal = ({ card, onClose }: { card: Card | null; onClose: () => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  if (!card) return null;

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-500';
      case 'epic': return 'border-purple-500';
      case 'rare': return 'border-blue-500';
      default: return 'border-gray-600';
    }
  };

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return { bg: 'from-yellow-800 to-orange-900', border: 'border-yellow-500', text: 'text-yellow-400' };
      case 'epic': return { bg: 'from-purple-800 to-purple-900', border: 'border-purple-500', text: 'text-purple-400' };
      case 'rare': return { bg: 'from-blue-800 to-blue-900', border: 'border-blue-500', text: 'text-blue-400' };
      default: return { bg: 'from-gray-800 to-gray-900', border: 'border-gray-600', text: 'text-gray-400' };
    }
  };

  const styles = getRarityStyles(card.rarity);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-white/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          {/* Карточка с 3D вращением */}
          <div 
            className="md:w-1/2 flex items-center justify-center cursor-pointer perspective-1000 p-6"
            onClick={handleCardClick}
          >
            <div className={`relative transition-all duration-700 transform-3d preserve-3d w-full max-w-[320px] ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* ЛИЦЕВАЯ СТОРОНА */}
              <div className={`backface-hidden w-full rounded-xl overflow-hidden bg-gradient-to-b ${styles.bg} border-2 ${styles.border}`}>
                {card.vid ? (
                  <video
                    src={card.vid}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto block"
                  />
                ) : (
                  <img 
                    src={card.img} 
                    alt={card.name}
                    className="w-full h-auto block"
                  />
                )}
              </div>

              {/* ОБРАТНАЯ СТОРОНА */}
              <div className={`absolute inset-0 backface-hidden w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-2 ${styles.border} rotate-y-180`}>
                <img 
                  src={card.imgh} 
                  alt={`${card.name} back`}
                  className="w-full h-auto block"
                />
              </div>
              
            </div>
          </div>
          
          {/* Детали карты справа */}
          <div className="md:w-1/2 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono px-2 py-1 rounded-full bg-white/10">{card.category}</span>
              <span className={`text-xs font-mono px-2 py-1 rounded-full bg-white/10 ${getRarityBorder(card.rarity)}`}>
                {card.rarity.toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{card.name}</h2>
            <div className="flex gap-4 mb-4">
              <span className="text-sm text-white/60">⚡ Power: {card.power}</span>
              <span className="text-sm text-white/60">❤️ Health: {card.cost}</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">{card.description}</p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] font-mono text-white/40">Card ID: #{card.id}</p>
            </div>
            
            {/* Подсказка для вращения */}
            <div className="mt-6 text-center text-[10px] font-mono text-white/30">
              Click on the card to flip it
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- КОМПОНЕНТ СОДЕРЖИМОГО СТРАНИЦЫ (ОБЕРНУТ В SUSPENSE) ---
function CardsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Получаем категорию из URL параметра
  const categoryFromUrl = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [visibleCards, setVisibleCards] = useState(12);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Фильтрация и сортировка
  const filteredCards = cardsData
    .filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
      const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;
      return matchesSearch && matchesCategory && matchesRarity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'power': return b.power - a.power;
        case 'cost': return b.cost - a.cost;
        case 'rarity': {
          const order = { legendary: 5, epic: 4, rare: 3, common: 2 };
          return order[b.rarity] - order[a.rarity];
        }
        default: return 0;
      }
    });

  const displayedCards = filteredCards.slice(0, visibleCards);
  const hasMore = visibleCards < filteredCards.length;

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCards(prev => prev + 12);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  // Reset visible cards on filter change
  useEffect(() => {
    setVisibleCards(12);
  }, [searchTerm, selectedCategory, selectedRarity, sortBy]);

  // Get counts for each category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return cardsData.length;
    return cardsData.filter(c => c.category === categoryId).length;
  };

  const getRarityCount = (rarityId: string) => {
    if (rarityId === 'all') return cardsData.length;
    return cardsData.filter(c => c.rarity === rarityId).length;
  };

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/image/cards-hero.webp" 
            alt="Cards Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/50" />
              <span className="font-mono text-xs text-cyan-400 tracking-[0.3em]">TRADING CARDS</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500/50" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
              COLLECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">THE UNIVERSE</span>
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
              Collect legendary cards featuring your favorite characters, ships, and worlds from the Astro universe.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.name}</span>
                  <span className="text-[10px] opacity-70">({getCategoryCount(cat.id)})</span>
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {RARITIES.map(rarity => (
                <button
                  key={rarity.id}
                  onClick={() => setSelectedRarity(rarity.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-all duration-300 ${
                    selectedRarity === rarity.id
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'
                  }`}
                  style={selectedRarity === rarity.id ? { boxShadow: `0 0 10px ${rarity.color}40` } : {}}
                >
                  {rarity.name} ({getRarityCount(rarity.id)})
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-cyan-500/50"
            >
              <option value="name">Sort: Name</option>
              <option value="power">Sort: Power ↓</option>
              <option value="cost">Sort: Health ↓</option>
              <option value="rarity">Sort: Rarity ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-white/40">
            Showing {displayedCards.length} of {filteredCards.length} cards
          </p>
        </div>

        {displayedCards.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-white/40 text-lg mb-2">No cards found</div>
            <p className="text-white/20 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {displayedCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <FlipCard card={card} onCardClick={setSelectedCard} />
              </motion.div>
            ))}
          </div>
        )}

        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Rarity Guide */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 border-t border-white/5">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          Rarity Guide
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-xl border border-gray-600/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 mx-auto mb-3 flex items-center justify-center">
              <Star className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="font-bold text-white text-sm">COMMON</h3>
            <p className="text-xs text-white/40 mt-1">Standard cards</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-blue-500/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mx-auto mb-3 flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="font-bold text-white text-sm">RARE</h3>
            <p className="text-xs text-white/40 mt-1">Enhanced cards</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-purple-500/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 mx-auto mb-3 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="font-bold text-white text-sm">EPIC</h3>
            <p className="text-xs text-white/40 mt-1">Powerful cards</p>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-xl border border-yellow-500/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-orange-700 mx-auto mb-3 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-300" />
            </div>
            <h3 className="font-bold text-white text-sm">LEGENDARY</h3>
            <p className="text-xs text-white/40 mt-1">Ultra-rare cards</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCard && (
          <EnlargedModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>

      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05, x: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium text-white/90 group-hover:text-white">Back</span>
      </motion.button>
    </main>
  );
}

// --- ОСНОВНОЙ ЭКСПОРТ С SUSPENSE ---
export default function CardsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    }>
      <CardsPageContent />
    </Suspense>
  );
}