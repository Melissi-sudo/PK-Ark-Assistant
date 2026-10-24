import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crosshair, 
  Flame, 
  Egg, 
  Map, 
  ShieldAlert, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Bomb, 
  Utensils, 
  Timer, 
  Pickaxe, 
  Beaker, 
  Users, 
  Cpu, 
  Hammer, 
  Skull, 
  Compass, 
  Info, 
  Layers, 
  ChevronRight, 
  Swords,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface HubTool {
  id: string;
  game: 'ark' | 'minecraft' | 'terraria' | 'rust';
  title: string;
  category: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  tag: string;
  accent: 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose';
  isPopular?: boolean;
}

const ALL_HUB_TOOLS: HubTool[] = [
  // ARK
  {
    id: 'ark-taming',
    game: 'ark',
    title: 'Automated Taming Calculator',
    category: 'Taming & Starve',
    path: '/taming',
    icon: Crosshair,
    description: 'Calculates exact food quotas, bite starvation markers, and knockouts for Official and unofficial servers.',
    tag: 'AUTO STARVE',
    accent: 'cyan',
    isPopular: true
  },
  {
    id: 'ark-soakers',
    game: 'ark',
    title: 'Turret Soakers & Hitbox Geometry',
    category: 'PvP Combat',
    path: '/soakers',
    icon: ShieldAlert,
    description: 'Stego plates (-50%), Trike headshots (-50%), and rider dismount immunity angles against Heavy Turrets.',
    tag: 'PVP META',
    accent: 'cyan',
    isPopular: true
  },
  {
    id: 'ark-raiding',
    game: 'ark',
    title: 'HP vs C4 & Explosives Math',
    category: 'Raid Mechanics',
    path: '/raiding',
    icon: Bomb,
    description: 'Structure HP degradation curves vs C4 charges, Rocket Launchers, and Tek Rifle element consumption.',
    tag: 'C4 & TEK',
    accent: 'rose',
    isPopular: true
  },
  {
    id: 'ark-pyromane',
    game: 'ark',
    title: 'Pyromane 30s Fire Ride Simulator',
    category: 'DLC Guides',
    path: '/pyromane',
    icon: Flame,
    description: 'Water extinguishing strategies, extinguish flame multipliers, and 30-second absorption simulator.',
    tag: 'FANTASTIC TAMES',
    accent: 'amber',
    isPopular: true
  },
  {
    id: 'ark-maps',
    game: 'ark',
    title: 'Interactive Topographical Maps',
    category: 'World & Farming',
    path: '/maps',
    icon: Map,
    description: '5 high-resolution maps featuring metal veins, silica pearls, oil nodes, and high-yield farming runs.',
    tag: '5 MAPS',
    accent: 'cyan'
  },
  {
    id: 'ark-kibble',
    game: 'ark',
    title: 'Kibble Matrix, Cakes & Tonics',
    category: 'Cooking & Crafting',
    path: '/kibble',
    icon: Utensils,
    description: 'Full recipe cooking companion for all 6 kibble tiers, Sweet Veggie Cakes, and Mindwipe Tonics.',
    tag: 'RECIPES',
    accent: 'emerald'
  },
  {
    id: 'ark-breeding',
    game: 'ark',
    title: 'Breeding, Incubation & Nursery',
    category: 'Genetics',
    path: '/breeding',
    icon: Egg,
    description: 'Temperature envelopes, incubation periods, gestation counters, and baby imprint interval timers.',
    tag: 'GENETICS',
    accent: 'emerald'
  },
  {
    id: 'ark-stats',
    game: 'ark',
    title: 'Dino Stat Extractor & Mutations',
    category: 'Genetics',
    path: '/stats',
    icon: Search,
    description: 'Reverse-engineers wild point distribution, base HP/Melee efficiency, and mutation lineage counters.',
    tag: 'EXTRACTOR',
    accent: 'cyan'
  },
  {
    id: 'ark-resources',
    game: 'ark',
    title: 'Tribe Ammo & Gunpowder Quota',
    category: 'Tribe Logistics',
    path: '/resources',
    icon: ShieldCheck,
    description: 'Automated gunpowder, charcoal, and advanced rifle bullet quota engine for mega base defense.',
    tag: 'LOGISTICS',
    accent: 'cyan'
  },
  {
    id: 'ark-timers',
    game: 'ark',
    title: 'War Room TEK Alarm Engine',
    category: 'Alarms & HUD',
    path: '/timers',
    icon: Timer,
    description: 'Custom countdown alarms with authentic TEK synthesizer audio alerts and desktop notifications.',
    tag: 'TEK AUDIO',
    accent: 'amber'
  },

  // MINECRAFT
  {
    id: 'mc-portal',
    game: 'minecraft',
    title: '3D Nether Portal Coordinate Linker',
    category: 'Dimensions',
    path: '/minecraft/portal',
    icon: Flame,
    description: 'Exact 8:1 dimensional scale ratio with 128-block search radius collision testing and safe floor checks.',
    tag: '3D LINK',
    accent: 'purple',
    isPopular: true
  },
  {
    id: 'mc-potions',
    game: 'minecraft',
    title: '1.21 Potion Brewing Matrix',
    category: 'Alchemy',
    path: '/minecraft/potions',
    icon: Beaker,
    description: 'Interactive brewing graphs for Tricky Trials elixirs: Wind Charged, Oozing, Infested, and Weaving.',
    tag: '1.21 TRIALS',
    accent: 'purple',
    isPopular: true
  },
  {
    id: 'mc-ores',
    game: 'minecraft',
    title: 'Ore Elevation & Diamond Distribution',
    category: 'Mining & Yields',
    path: '/minecraft/ores',
    icon: Pickaxe,
    description: 'Triangular generation charts showing peak diamond veins at Y = -58 and Ancient Debris clusters at Y = 15.',
    tag: 'Y: -58',
    accent: 'cyan',
    isPopular: true
  },
  {
    id: 'mc-villagers',
    game: 'minecraft',
    title: '1-Emerald Villager Trade Optimizer',
    category: 'Economy',
    path: '/minecraft/villagers',
    icon: Users,
    description: 'Zombie curing discounts, trade lock mechanics, and librarian lectern re-roll strategies for Mending.',
    tag: 'TRADES',
    accent: 'amber'
  },
  {
    id: 'mc-redstone',
    game: 'minecraft',
    title: 'Redstone Logic & Hopper Clocks',
    category: 'Engineering',
    path: '/minecraft/redstone',
    icon: Cpu,
    description: 'Pulse timers, item sorter filters (41-1-1-1-1), Etho hopper clocks, and signal strength equations.',
    tag: 'CIRCUITS',
    accent: 'rose'
  },
  {
    id: 'mc-enchanting',
    game: 'minecraft',
    title: 'Anvil Optimizer & 1.21 Mace',
    category: 'Enchanting',
    path: '/minecraft/enchanting',
    icon: Hammer,
    description: 'Solves binary tree combine orders to bypass the 39-level "Too Expensive!" hard barrier with Mace buffs.',
    tag: 'MACE 1.21',
    accent: 'purple'
  },
  {
    id: 'mc-mobs',
    game: 'minecraft',
    title: 'Mob AI & Trial Chambers Spawner',
    category: 'Combat & AI',
    path: '/minecraft/mobs',
    icon: Skull,
    description: 'Ominous bottle mechanics, Trial Spawner wave timers, and 24-128m despawn radius spheres.',
    tag: 'SPAWNERS',
    accent: 'cyan'
  },

  // TERRARIA
  {
    id: 'terraria-bosses',
    game: 'terraria',
    title: '18-Boss Progression & Arenas',
    category: 'Progression & Bosses',
    path: '/terraria/bosses',
    icon: Swords,
    description: 'Pre-Hardmode through Moon Lord summon recipes, health pools, arena blueprints, and class gear loadouts.',
    tag: '18 BOSSES',
    accent: 'emerald',
    isPopular: true
  },
  {
    id: 'terraria-biomes',
    game: 'terraria',
    title: 'Biomes & Surface Exploration',
    category: 'World Biomes',
    path: '/terraria/biomes',
    icon: Map,
    description: 'Surface Forest, Desert, Jungle, Snow, Ocean, and Sky Island chest loot, fishing crates, and NPC housing.',
    tag: '8 BIOMES',
    accent: 'cyan',
    isPopular: true
  },
  {
    id: 'terraria-ores',
    game: 'terraria',
    title: 'Ore Tiers & Pickaxe Power',
    category: 'Mining & Smelting',
    path: '/terraria/ores',
    icon: Pickaxe,
    description: 'Pre-Hardmode and Hardmode ore depths, 35%-225% pickaxe power requirements, and Altar smashing mechanics.',
    tag: '12 ORE TIERS',
    accent: 'amber',
    isPopular: true
  },
  {
    id: 'terraria-underground',
    game: 'terraria',
    title: 'The Aether & Underground Caverns',
    category: 'Subterranean',
    path: '/terraria/underground',
    icon: Layers,
    description: 'Find the secret Aether Shimmer liquid on the outer fifth of the world; Spider nests, Granite, Marble, and Hellstone.',
    tag: 'SHIMMER MAP',
    accent: 'purple',
    isPopular: true
  },
  {
    id: 'terraria-evil',
    game: 'terraria',
    title: 'Crimson vs Corruption Containment',
    category: 'World Evils',
    path: '/terraria/evil',
    icon: ShieldAlert,
    description: '3-block quarantine hellevator rules, Eater of Worlds vs Brain of Cthulhu battle tactics, and Clentaminator cleansing.',
    tag: 'PURIFICATION',
    accent: 'rose',
    isPopular: true
  },

  // RUST
  {
    id: 'rust-raid',
    game: 'rust',
    title: 'Raid Cost & Raw Sulfur Engine',
    category: 'Raid Operations',
    path: '/rust/raid',
    icon: Bomb,
    description: 'Multi-target compound raid shopping cart, optimal explosive combinations (C4/Rockets), and raw sulfur ore breakdowns.',
    tag: 'SULFUR & C4',
    accent: 'amber',
    isPopular: true
  },
  {
    id: 'rust-upkeep',
    game: 'rust',
    title: 'Base Upkeep & TC Decay Simulator',
    category: 'Base Architecture',
    path: '/rust/upkeep',
    icon: Layers,
    description: 'Official Facepunch 4-tier progressive tax rate brackets, 24-hour resource consumption, and TC depletion countdowns.',
    tag: 'TAX CURVES',
    accent: 'amber',
    isPopular: true
  },
  {
    id: 'rust-combat',
    game: 'rust',
    title: 'Combat TTK & Ballistics Matrix',
    category: 'PvP Ballistics',
    path: '/rust/combat',
    icon: Crosshair,
    description: 'AK-47, SAR & Bolty damage falloff vs Full Metal, Roadsign and Coffee Can kits with 1-tap headshot markers.',
    tag: '1-TAP TTK',
    accent: 'rose',
    isPopular: true
  },
  {
    id: 'rust-techtree',
    game: 'rust',
    title: 'Workbench Tech Tree & Scrap Planner',
    category: 'Wipe Progression',
    path: '/rust/techtree',
    icon: Cpu,
    description: 'Workbench Tier 1-3 blueprint tree paths, scrap milestones, and essential raid/roam unlock tracks.',
    tag: 'WB 1-3',
    accent: 'cyan'
  },
  {
    id: 'rust-monuments',
    game: 'rust',
    title: 'Monuments Keycards & Recycler',
    category: 'Monuments & Scrap',
    path: '/rust/monuments',
    icon: Map,
    description: 'Green/Blue/Red puzzle walkthroughs, rad suit requirements, and instant component recycling yield calculator.',
    tag: 'PUZZLES',
    accent: 'emerald'
  }
];

const GAME_TABS: Array<{ id: 'all' | 'ark' | 'minecraft' | 'terraria' | 'rust'; label: string; count: number }> = [
  { id: 'all', label: 'All', count: ALL_HUB_TOOLS.length },
  { id: 'ark', label: 'ARK', count: 10 },
  { id: 'minecraft', label: 'Minecraft', count: 7 },
  { id: 'terraria', label: 'Terraria', count: 5 },
  { id: 'rust', label: 'Rust', count: 5 },
];

export const LibraryHub: React.FC = () => {
  const navigate = useNavigate();
  const { profile, accountName } = useAuth();
  const { isDark } = useTheme();

  const [search, setSearch] = useState<string>('');
  const [filterGame, setFilterGame] = useState<'all' | 'ark' | 'minecraft' | 'terraria' | 'rust'>('all');

  const handleSelectGameFilter = (game: 'all' | 'ark' | 'minecraft' | 'terraria' | 'rust') => {
    setFilterGame(game);
  };

  // Filtered tools list
  const filteredTools = useMemo(() => {
    return ALL_HUB_TOOLS.filter((tool) => {
      const matchesGame = filterGame === 'all' || tool.game === filterGame;
      const q = search.toLowerCase().trim();
      if (!q) return matchesGame;
      const matchesSearch = 
        tool.title.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tag.toLowerCase().includes(q);
      return matchesGame && matchesSearch;
    });
  }, [search, filterGame]);

  return (
    <div className="space-y-16 sm:space-y-20 max-w-6xl mx-auto pb-16 transition-colors">
      {/* 1. Hero Atmosphere Section — Modern Clean Story Canvas */}
      <section 
        aria-label="Library Overview"
        className="rounded-[28px] p-7 sm:p-10 lg:p-12 border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#161617] text-[#111827] dark:text-[#f5f5f7] shadow-sm transition-all"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Quiet Unboxed Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#4b5563] dark:text-[#9ca3af] tracking-wider uppercase">
              <span className="text-[#111827] dark:text-[#f5f5f7] font-bold">The Pitsoni Empire</span>
              <span aria-hidden="true">·</span>
              <span>Tactical Engine Archives</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#b64400] font-bold">Verified Mechanics</span>
            </div>

            {/* Display Hero Headline (High Legibility Ink in Light, Clean White in Dark) */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.025em] leading-[1.05] text-[#111827] dark:text-white font-sf-display">
              PK Ultimate <span className="text-[#0066cc] dark:text-[#2997ff]">Guide</span>
            </h1>

            {/* Feature Subhead (Comfortable High-Contrast Reading) */}
            <p className="text-[15px] sm:text-[17px] text-[#374151] dark:text-[#d1d5db] leading-[1.47] font-sf-text max-w-xl font-normal">
              Competitive tactical calculators and game companions formulated directly from underlying game engine mechanics and empirically tested on live official servers.
            </p>

            {/* Quiet Invariants Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 pt-2 text-xs text-[#374151] dark:text-[#9ca3af] font-sf-text font-medium">
              <span className="inline-flex items-center gap-1.5 text-[#111827] dark:text-[#f5f5f7] font-semibold">
                <Check className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                <span>100% Raw Engine Formulas</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span>ASA DevKit & 1.21 Aligned</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span>Small Tribes Calibrated</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#b64400] font-bold">New: Rust Tactical Suite</span>
            </div>
          </div>

          {/* Right: Survivor Profile & Theme Toggle Card */}
          <div className="flex flex-col gap-4 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-[#2c2c2e] rounded-[28px] p-6 lg:w-72 shadow-sm transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#3a3a3c] flex items-center justify-center text-[#111827] dark:text-[#f5f5f7] font-bold text-sm shrink-0">
                  ◈
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-[#4b5563] dark:text-[#9ca3af] font-bold">Active Profile</div>
                  <div className="text-sm font-bold text-[#111827] dark:text-white truncate">
                    {profile?.displayName || accountName || 'Survivor'}
                  </div>
                </div>
              </div>

              {/* Theme Toggle Button */}
              <ThemeToggle />
            </div>

            {/* Quick Segmented Theme Switcher */}
            <div className="pt-3 border-t border-gray-200 dark:border-[#2c2c2e] flex items-center justify-between text-xs">
              <span className="text-[#374151] dark:text-[#9ca3af] font-semibold">Interface Theme</span>
              <ThemeToggle variant="segmented" />
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-[#2c2c2e] flex items-center justify-between text-xs font-sf-text">
              <Link 
                to="/about"
                className="text-[#0066cc] dark:text-[#2997ff] hover:underline flex items-center gap-1 font-semibold"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Methodology</span>
              </Link>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-modal'))}
                className="text-[#4b5563] dark:text-[#9ca3af] hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors flex items-center gap-1 cursor-pointer font-medium"
                title="Cookie & Google Analytics Settings"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cookies</span>
              </button>

              <a
                href="https://www.tiktok.com/@pkguides"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white transition-colors flex items-center gap-1 font-medium"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#ff0050]" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.23V8.2a6.34 6.34 0 0 0-5.12 6.13A6.34 6.34 0 0 0 10.7 20.67a6.34 6.34 0 0 0 6.33-6.33V8.8a8.28 8.28 0 0 0 4.84 1.54V6.89a4.85 4.85 0 0 1-2.28-.2z"/>
                </svg>
                <span>TikTok</span>
                <span className="text-[10px] text-[#4b5563] dark:text-[#9ca3af]">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Flagship Game Story Cards — Clean High-Contrast Cards */}
      <section aria-label="Game Suites" className="space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-white font-sf-display">
              Tactical Game Suites
            </h2>
            <p className="text-sm text-[#374151] dark:text-[#9ca3af] mt-1 font-sf-text font-normal">
              Dedicated calculators and interactive references engineered for each survival universe.
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs text-[#4b5563] dark:text-[#9ca3af] font-bold">
            4 Games · 27 Tools Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* GAME 1: ARK SURVIVAL ASCENDED */}
          <motion.div 
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="group rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] overflow-hidden flex flex-col justify-between transition-all hover:border-[#0066cc] dark:hover:border-[#2997ff] shadow-sm hover:shadow-lg"
          >
            <div>
              {/* Clean Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-[#161617] p-2">
                <img
                  src="/images/thumbnails/ark_official.jpg?v=asa_official_keyart"
                  alt="ARK: Survival Ascended"
                  className="w-full h-full object-cover rounded-[20px] transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#4b5563] dark:text-[#9ca3af] font-bold">
                  <span>ARK: ASCENDED</span>
                  <span>10 Tools</span>
                </div>

                <h3 className="text-xl font-bold text-[#111827] dark:text-white tracking-tight font-sf-display group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
                  ARK War Room
                </h3>

                <p className="text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed line-clamp-2 font-sf-text font-normal">
                  Automated starve & food calculations, turret soaker hitbox metrics, structure HP vs C4/rockets, and custom rates.
                </p>

                {/* Quick Launch Links — Interactive Pills */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 text-xs font-sf-text">
                  <Link
                    to="/taming"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Taming
                  </Link>
                  <Link
                    to="/soakers"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Soakers
                  </Link>
                  <Link
                    to="/raiding"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Raid Math
                  </Link>
                  <Link
                    to="/maps"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    5 Maps
                  </Link>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="p-6 pt-0">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/taming')}
                className="w-full apple-pill-blue py-2.5 text-xs cursor-pointer gap-1.5"
              >
                <span>Launch ARK Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>

          {/* GAME 2: MINECRAFT 1.21+ */}
          <motion.div 
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="group rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] overflow-hidden flex flex-col justify-between transition-all hover:border-[#0066cc] dark:hover:border-[#2997ff] shadow-sm hover:shadow-lg"
          >
            <div>
              {/* Clean Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-[#161617] p-2">
                <img
                  src="/images/thumbnails/minecraft.png"
                  alt="Minecraft 1.21+"
                  className="w-full h-full object-cover rounded-[20px] transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#4b5563] dark:text-[#9ca3af] font-bold">
                  <span>MINECRAFT 1.21+</span>
                  <span>7 Tools</span>
                </div>

                <h3 className="text-xl font-bold text-[#111827] dark:text-white tracking-tight font-sf-display group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
                  Minecraft Suite
                </h3>

                <p className="text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed line-clamp-2 font-sf-text font-normal">
                  3D Nether Portal translation, 1.21 potion brewing lab, diamond ore elevation at Y=-58, and anvil binary trees.
                </p>

                {/* Quick Launch Links */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 text-xs font-sf-text">
                  <Link
                    to="/minecraft/portal"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    3D Portal
                  </Link>
                  <Link
                    to="/minecraft/potions"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Potions
                  </Link>
                  <Link
                    to="/minecraft/ores"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Ores Y-58
                  </Link>
                  <Link
                    to="/minecraft/villagers"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    1-Emerald
                  </Link>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="p-6 pt-0">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/minecraft')}
                className="w-full apple-pill-blue py-2.5 text-xs cursor-pointer gap-1.5"
              >
                <span>Launch Minecraft Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>

          {/* GAME 3: TERRARIA 1.4.4+ */}
          <motion.div 
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="group rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] overflow-hidden flex flex-col justify-between transition-all hover:border-[#0066cc] dark:hover:border-[#2997ff] shadow-sm hover:shadow-lg"
          >
            <div>
              {/* Clean Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-[#161617] p-2">
                <img
                  src="/images/thumbnails/terraria_poster.jpg"
                  alt="Terraria 1.4.4+"
                  className="w-full h-full object-cover rounded-[20px] transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#4b5563] dark:text-[#9ca3af] font-bold">
                  <span>TERRARIA 1.4.4+</span>
                  <span>5 Guides</span>
                </div>

                <h3 className="text-xl font-bold text-[#111827] dark:text-white tracking-tight font-sf-display group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
                  Terraria Companion
                </h3>

                <p className="text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed line-clamp-2 font-sf-text font-normal">
                  18-boss progression checklists, health matrices, biome discovery, and Crimson vs Corruption containment tunnels.
                </p>

                {/* Quick Launch Links */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 text-xs font-sf-text">
                  <Link
                    to="/terraria/matrix"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    18-Boss
                  </Link>
                  <Link
                    to="/terraria/bosses"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Arenas
                  </Link>
                  <Link
                    to="/terraria/evil"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Quarantine
                  </Link>
                  <Link
                    to="/terraria/ores"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Shimmer
                  </Link>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="p-6 pt-0">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/terraria')}
                className="w-full apple-pill-blue py-2.5 text-xs cursor-pointer gap-1.5"
              >
                <span>Launch Terraria Companion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>

          {/* GAME 4: RUST TACTICAL OPERATIONS */}
          <motion.div 
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
            className="group rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] overflow-hidden flex flex-col justify-between transition-all hover:border-[#0066cc] dark:hover:border-[#2997ff] shadow-sm hover:shadow-lg"
          >
            <div>
              {/* Clean Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-[#161617] p-2">
                <img
                  src="/images/thumbnails/rust_official.jpg"
                  alt="Rust Tactical Operations"
                  className="w-full h-full object-cover rounded-[20px] transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#b64400]">NEW RELEASE</span>
                  <span className="text-[#4b5563] dark:text-[#9ca3af]">5 Tools</span>
                </div>

                <h3 className="text-xl font-bold text-[#111827] dark:text-white tracking-tight font-sf-display group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
                  Rust Tactical Suite
                </h3>

                <p className="text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed line-clamp-2 font-sf-text font-normal">
                  Zero-waste explosive raid math, Facepunch progressive TC upkeep tax curve, 1-tap combat TTK, and scrap trees.
                </p>

                {/* Quick Launch Links */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 text-xs font-sf-text">
                  <Link
                    to="/rust/raid"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Raid Math
                  </Link>
                  <Link
                    to="/rust/upkeep"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    TC Upkeep
                  </Link>
                  <Link
                    to="/rust/combat"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Combat TTK
                  </Link>
                  <Link
                    to="/rust/techtree"
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] text-[#111827] dark:text-[#f5f5f7] text-center font-semibold transition-colors"
                  >
                    Scrap Tree
                  </Link>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="p-6 pt-0">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/rust')}
                className="w-full apple-pill-blue py-2.5 text-xs cursor-pointer gap-1.5"
              >
                <span>Launch Rust Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Interactive Tactical Directory — Clean High-Contrast Cards */}
      <section aria-label="Tactical Tool Directory" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-white font-sf-display flex items-center gap-2">
              <span>Tactical Directory</span>
              <span className="text-sm font-bold text-[#4b5563] dark:text-[#9ca3af] font-sf-text">
                ({filteredTools.length})
              </span>
            </h2>
            <p className="text-xs text-[#374151] dark:text-[#9ca3af] font-sf-text mt-0.5 font-normal">
              Instant access to every specialized calculator across ARK, Minecraft, Terraria, and Rust.
            </p>
          </div>

          {/* Clean Segmented Control Tabs with Sliding Pill Animation */}
          <div 
            role="tablist"
            aria-label="Filter tools by game"
            className="apple-segmented self-start sm:self-auto overflow-x-auto no-scrollbar max-w-full p-1 gap-1"
          >
            {GAME_TABS.map((tab) => {
              const isActive = filterGame === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectGameFilter(tab.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs cursor-pointer whitespace-nowrap transition-colors z-10 ${
                    isActive
                      ? 'text-[#111827] dark:text-white font-bold'
                      : 'text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white font-semibold'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-white dark:bg-[#2c2c2e] rounded-full shadow-sm border border-gray-200/80 dark:border-transparent -z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span>{tab.label} ({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 980px Rounded Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#4b5563] dark:text-[#9ca3af] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all tools: C4, Starve, 3D Nether Portal, Boss Progression, Raw Sulfur..."
            className="apple-input-search w-full pl-11 pr-10 py-3 text-sm font-sf-text"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Directory Grid with Smooth Framer Motion Layout Transitions */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              const gameName = 
                tool.game === 'ark' 
                  ? 'ARK ASCENDED' 
                  : tool.game === 'minecraft' 
                  ? 'MINECRAFT 1.21+' 
                  : tool.game === 'terraria' 
                  ? 'TERRARIA 1.4.4+' 
                  : 'RUST TACTICAL';

              return (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="h-full"
                >
                  <Link
                    to={tool.path}
                    className="group h-full p-6 sm:p-7 rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] hover:border-[#0066cc] dark:hover:border-[#2997ff] flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-3.5">
                      {/* Top Row: Icon + Unboxed Meta */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2c2c2e] flex items-center justify-center text-[#111827] dark:text-[#f5f5f7] group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] group-hover:scale-105 transition-all">
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Quiet Unboxed Tag */}
                        <span className="text-[11px] font-bold text-[#4b5563] dark:text-[#9ca3af] tracking-wider uppercase">
                          {tool.tag}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <div className="text-[11px] font-bold text-[#0066cc] dark:text-[#38bdf8] uppercase tracking-wider mb-1">
                          {tool.category}
                        </div>
                        <h3 className="font-bold text-base text-[#111827] dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors font-sf-display leading-snug">
                          {tool.title}
                        </h3>
                        <p className="text-xs text-[#374151] dark:text-[#d1d5db] font-sf-text leading-relaxed line-clamp-2 mt-1.5 font-normal">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Bottom Row: Quiet Game Indicator & Blue Link */}
                    <div className="pt-4 border-t border-gray-200 dark:border-[#2c2c2e] flex items-center justify-between text-xs font-sf-text mt-4">
                      <span className="text-[11px] text-[#4b5563] dark:text-[#9ca3af] font-semibold">
                        {gameName}
                      </span>
                      <span className="text-[#0066cc] dark:text-[#2997ff] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Open</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredTools.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-[#161617] border border-gray-200 dark:border-[#2c2c2e] rounded-[28px] space-y-2 shadow-sm">
            <Search className="w-8 h-8 text-[#4b5563] dark:text-[#9ca3af] mx-auto opacity-50" />
            <div className="text-sm font-bold text-[#111827] dark:text-white font-sf-display">No tactical tools found</div>
            <p className="text-xs text-[#374151] dark:text-[#d1d5db] font-sf-text">
              No results matching "{search}". Try searching for "c4", "taming", "portal", or "sulfur".
            </p>
          </div>
        )}
      </section>

      {/* 4. Methodology & Engineering Standards Callout */}
      <section 
        aria-label="Engineering Standards"
        className="rounded-[28px] p-7 sm:p-8 bg-white dark:bg-[#161617] border border-gray-200 dark:border-[#2c2c2e] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-colors"
      >
        <div className="space-y-1 max-w-2xl text-center md:text-left">
          <div className="text-xs font-bold text-[#0066cc] dark:text-[#2997ff] uppercase tracking-wider font-sf-text">
            Engineered Accuracy
          </div>
          <h3 className="text-lg font-bold text-[#111827] dark:text-white font-sf-display">
            Mathematical Verification Standards
          </h3>
          <p className="text-xs text-[#374151] dark:text-[#d1d5db] font-sf-text leading-relaxed font-normal">
            We decompile raw game engine mechanics rather than scraping community approximations. Every formula is bench-tested against official server releases.
          </p>
        </div>

        <Link
          to="/about"
          className="apple-pill-blue py-2.5 px-5 text-xs cursor-pointer shrink-0 gap-1.5"
        >
          <span>Read Verification Methodology</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
};
