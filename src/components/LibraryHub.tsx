import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crosshair, 
  Flame, 
  Egg, 
  Map, 
  ShieldAlert, 
  ShoppingBag, 
  Search, 
  ArrowRight, 
  Zap, 
  ExternalLink,
  ShieldCheck, 
  Check, 
  Gamepad2,
  Sparkles,
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
  Sliders,
  Info,
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu as EngineIcon,
  Swords
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkeletonBlock } from './skeletons/SkeletonBlock';

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

export const LibraryHub: React.FC = () => {
  const navigate = useNavigate();
  const { accountName, profile } = useAuth();
  const [search, setSearch] = useState<string>('');
  const [filterGame, setFilterGame] = useState<'all' | 'ark' | 'minecraft' | 'terraria' | 'rust'>('all');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  const handleSelectGameFilter = (game: 'all' | 'ark' | 'minecraft' | 'terraria' | 'rust') => {
    if (game === filterGame) return;
    setIsFiltering(true);
    setFilterGame(game);
    setTimeout(() => {
      setIsFiltering(false);
    }, 130);
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
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Hero Atmosphere Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#071326] via-[#050b16] to-[#03060d]">
        {/* Soft Ambient Radiance */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Meta Kicker */}
            <div className="flex items-center gap-2 text-xs font-hud tracking-wider text-slate-400">
              <span className="text-cyan-400 font-bold uppercase tracking-widest">THE PITSONI EMPIRE</span>
              <span>·</span>
              <span className="text-slate-300">TACTICAL ENGINE ARCHIVES</span>
              <span>·</span>
              <span className="text-emerald-400 font-tek font-bold">VERIFIED MECHANICS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-hud text-white tracking-tight leading-none drop-shadow-md">
              PK ULTIMATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">GUIDE</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Competitive tactical calculators and game companions formulated directly from underlying game engine mechanics and empirically tested on live official servers.
            </p>

            {/* Invariants Ribbon */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-hud text-cyan-300">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>100% Raw Engine Formulas</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-[11px] font-hud text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>ASA DevKit & 1.21 Aligned</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-hud text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Small Tribes Calibrated</span>
              </span>
            </div>
          </div>

          {/* Quick Survivor / Player Card */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 bg-[#081224]/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 lg:w-72 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-tek font-bold text-xl shadow-md shadow-cyan-500/30">
                ◈
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-hud text-slate-400 uppercase tracking-wider">ACTIVE PROFILE</div>
                <div className="text-sm font-hud font-bold text-white truncate">
                  {profile?.displayName || accountName || 'Survivor'}
                </div>
                <div className="text-[11px] text-cyan-400 font-mono">
                  {profile?.platform || 'Official Small Tribes'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-hud">
              <Link 
                to="/about"
                className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Methodology</span>
              </Link>

              <a
                href="https://www.tiktok.com/@pkguides"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1 font-bold"
              >
                <span>♪</span>
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Four Flagship Game Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* GAME 1: ARK: SURVIVAL ASCENDED */}
        <div className="group relative rounded-3xl overflow-hidden border-2 border-cyan-500/40 bg-gradient-to-b from-[#08162b] via-[#050f1d] to-[#030811] shadow-2xl flex flex-col justify-between hover:border-cyan-400 hover:shadow-cyan-500/10 transition-all duration-300">
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-950 via-[#0a1b32] to-cyan-950 px-4 py-3 flex items-center justify-between border-b border-cyan-500/30">
              <div className="flex items-center gap-1.5 text-cyan-300 font-hud font-bold text-xs tracking-wide truncate">
                <span className="font-tek text-cyan-400 font-bold text-sm">◈</span>
                <span className="truncate">ARK: ASCENDED</span>
              </div>
              <span className="text-[9px] font-tek font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shrink-0">
                10 TOOLS
              </span>
            </div>

            {/* Thumbnail with Shimmer Mask Background */}
            <div className="relative aspect-[16/9] overflow-hidden bg-[#06101d] border-b border-cyan-500/20 shimmer-mask shimmer-mask-cyan">
              <img
                src="/images/thumbnails/ark_official.jpg?v=asa_official_keyart"
                alt="ARK Survival Ascended"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050f1d] via-transparent to-transparent opacity-80 z-20" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-lg bg-black/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-hud font-bold backdrop-blur-md">
                  War Room & Raiding
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <h2 className="text-lg font-bold font-hud text-white tracking-wide">
                  ARK War Room
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans line-clamp-3">
                  Automated starve & food calculations, turret soaker hitbox metrics, structure HP vs C4/rockets, and custom server rates.
                </p>
              </div>

              {/* Quick Launch Pills */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-hud">
                <Link
                  to="/taming"
                  className="p-2 rounded-lg bg-[#081528] hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-center font-bold transition-all"
                >
                  Taming
                </Link>
                <Link
                  to="/soakers"
                  className="p-2 rounded-lg bg-[#081528] hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-center font-bold transition-all"
                >
                  Soakers
                </Link>
                <Link
                  to="/raiding"
                  className="p-2 rounded-lg bg-[#081528] hover:bg-rose-950/80 border border-rose-500/30 text-rose-300 text-center font-bold transition-all"
                >
                  Raid Math
                </Link>
                <Link
                  to="/maps"
                  className="p-2 rounded-lg bg-[#081528] hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-center font-bold transition-all"
                >
                  5 Maps
                </Link>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="p-4 sm:p-5 pt-0">
            <button
              onClick={() => navigate('/taming')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-hud font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Launch ARK</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* GAME 2: MINECRAFT 1.21+ */}
        <div className="group relative rounded-3xl overflow-hidden border-2 border-purple-500/40 bg-gradient-to-b from-[#150a28] via-[#0f071e] to-[#07030e] shadow-2xl flex flex-col justify-between hover:border-purple-400 hover:shadow-purple-500/10 transition-all duration-300">
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-950 via-[#1e0d38] to-purple-950 px-4 py-3 flex items-center justify-between border-b border-purple-500/30">
              <div className="flex items-center gap-1.5 text-purple-300 font-hud font-bold text-xs tracking-wide truncate">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate">MINECRAFT 1.21+</span>
              </div>
              <span className="text-[9px] font-tek font-bold px-1.5 py-0.2 rounded bg-purple-500/20 border border-purple-400/40 text-purple-300 shrink-0">
                7 TOOLS
              </span>
            </div>

            {/* Thumbnail with Shimmer Mask Background */}
            <div className="relative aspect-[16/9] overflow-hidden bg-[#120822] border-b border-purple-500/20 shimmer-mask shimmer-mask-purple">
              <img
                src="/images/thumbnails/minecraft.png"
                alt="Minecraft 1.21"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f071e] via-transparent to-transparent opacity-80 z-20" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-lg bg-black/80 border border-purple-500/30 text-purple-300 text-[10px] font-hud font-bold backdrop-blur-md">
                  Portal & Alchemy Lab
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <h2 className="text-lg font-bold font-hud text-white tracking-wide">
                  Minecraft Suite
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans line-clamp-3">
                  3D Nether Portal translation, 1.21 potion brewing lab, diamond ore elevation at Y=-58, and anvil binary trees.
                </p>
              </div>

              {/* Quick Launch Pills */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-hud">
                <Link
                  to="/minecraft/portal"
                  className="p-2 rounded-lg bg-[#1a0c33] hover:bg-purple-950/80 border border-purple-500/30 text-purple-300 text-center font-bold transition-all"
                >
                  3D Portal
                </Link>
                <Link
                  to="/minecraft/potions"
                  className="p-2 rounded-lg bg-[#1a0c33] hover:bg-purple-950/80 border border-purple-500/30 text-purple-300 text-center font-bold transition-all"
                >
                  Potions
                </Link>
                <Link
                  to="/minecraft/ores"
                  className="p-2 rounded-lg bg-[#1a0c33] hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-center font-bold transition-all"
                >
                  Ores Y-58
                </Link>
                <Link
                  to="/minecraft/villagers"
                  className="p-2 rounded-lg bg-[#1a0c33] hover:bg-amber-950/80 border border-amber-500/30 text-amber-300 text-center font-bold transition-all"
                >
                  1-Emerald
                </Link>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="p-4 sm:p-5 pt-0">
            <button
              onClick={() => navigate('/minecraft')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-hud font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Launch Minecraft</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* GAME 3: TERRARIA 1.4.4+ */}
        <div className="group relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-gradient-to-b from-[#08170e] via-[#05110a] to-[#020905] shadow-2xl flex flex-col justify-between hover:border-emerald-400 hover:shadow-emerald-500/10 transition-all duration-300">
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-[#0d2215] to-emerald-950 px-4 py-3 flex items-center justify-between border-b border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-emerald-300 font-hud font-bold text-xs tracking-wide truncate">
                <Swords className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">TERRARIA 1.4.4+</span>
              </div>
              <span className="text-[9px] font-tek font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shrink-0">
                5 GUIDES
              </span>
            </div>

            {/* Thumbnail with Shimmer Mask Background */}
            <div className="relative aspect-[16/9] overflow-hidden bg-[#07140d] border-b border-emerald-500/20 shimmer-mask shimmer-mask-emerald">
              <img
                src="/images/thumbnails/terraria_poster.jpg"
                alt="Terraria Official Poster"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05110a] via-transparent to-transparent opacity-80 z-20" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-lg bg-black/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-hud font-bold backdrop-blur-md">
                  18 Bosses & Shimmer
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <h2 className="text-lg font-bold font-hud text-white tracking-wide">
                  Terraria Companion
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans line-clamp-3">
                  18-boss progression checklists, health matrices, biome discovery, and Crimson vs Corruption quarantine tunnels.
                </p>
              </div>

              {/* Quick Launch Pills */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-hud">
                <Link
                  to="/terraria/matrix"
                  className="p-2 rounded-lg bg-[#081a10] hover:bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-center font-bold transition-all"
                >
                  18-Boss
                </Link>
                <Link
                  to="/terraria/bosses"
                  className="p-2 rounded-lg bg-[#081a10] hover:bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-center font-bold transition-all"
                >
                  Arenas
                </Link>
                <Link
                  to="/terraria/evil"
                  className="p-2 rounded-lg bg-[#081a10] hover:bg-rose-950/80 border border-rose-500/30 text-rose-300 text-center font-bold transition-all"
                >
                  Quarantine
                </Link>
                <Link
                  to="/terraria/ores"
                  className="p-2 rounded-lg bg-[#081a10] hover:bg-amber-950/80 border border-amber-500/30 text-amber-300 text-center font-bold transition-all"
                >
                  Shimmer
                </Link>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="p-4 sm:p-5 pt-0">
            <button
              onClick={() => navigate('/terraria')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-hud font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Launch Terraria</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* GAME 4: RUST TACTICAL SUITE */}
        <div className="group relative rounded-3xl overflow-hidden border-2 border-orange-500/40 bg-gradient-to-b from-[#191008] via-[#0f0c08] to-[#070503] shadow-2xl flex flex-col justify-between hover:border-orange-400 hover:shadow-orange-500/10 transition-all duration-300">
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-950 via-[#261408] to-orange-950 px-4 py-3 flex items-center justify-between border-b border-orange-500/30">
              <div className="flex items-center gap-1.5 text-orange-300 font-hud font-bold text-xs tracking-wide truncate">
                <Bomb className="w-3.5 h-3.5 text-orange-400" />
                <span className="truncate">RUST TACTICAL</span>
              </div>
              <span className="text-[9px] font-tek font-bold px-1.5 py-0.2 rounded bg-orange-500/20 border border-orange-400/40 text-orange-300 shrink-0">
                5 TOOLS
              </span>
            </div>

            {/* Thumbnail with Shimmer Mask Background */}
            <div className="relative aspect-[16/9] overflow-hidden bg-[#140c06] border-b border-orange-500/20 shimmer-mask shimmer-mask-orange">
              <img
                src="/images/thumbnails/rust_official.jpg"
                alt="Rust Tactical Operations"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c08] via-transparent to-transparent opacity-80 z-20" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-lg bg-black/80 border border-orange-500/30 text-orange-300 text-[10px] font-hud font-bold backdrop-blur-md">
                  Raid Math & TC Upkeep
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <h2 className="text-lg font-bold font-hud text-white tracking-wide">
                  Rust Tactical Suite
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans line-clamp-3">
                  Zero-waste explosive raid math (C4, rockets, explo 5.56), Facepunch progressive TC upkeep tax curve, 1-tap combat TTK, and scrap trees.
                </p>
              </div>

              {/* Quick Launch Pills */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-hud">
                <Link
                  to="/rust/raid"
                  className="p-2 rounded-lg bg-[#1f1008] hover:bg-orange-950/80 border border-orange-500/30 text-orange-300 text-center font-bold transition-all"
                >
                  Raid Math
                </Link>
                <Link
                  to="/rust/upkeep"
                  className="p-2 rounded-lg bg-[#1f1008] hover:bg-amber-950/80 border border-amber-500/30 text-amber-300 text-center font-bold transition-all"
                >
                  TC Upkeep
                </Link>
                <Link
                  to="/rust/combat"
                  className="p-2 rounded-lg bg-[#1f1008] hover:bg-red-950/80 border border-red-500/30 text-red-300 text-center font-bold transition-all"
                >
                  Combat TTK
                </Link>
                <Link
                  to="/rust/techtree"
                  className="p-2 rounded-lg bg-[#1f1008] hover:bg-yellow-950/80 border border-yellow-500/30 text-yellow-300 text-center font-bold transition-all"
                >
                  Scrap Tree
                </Link>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="p-4 sm:p-5 pt-0">
            <button
              onClick={() => navigate('/rust')}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-hud font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Launch Rust Suite</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Tool Search & Filter Bar */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-hud text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Full Tactical Directory ({filteredTools.length} Tools)</span>
            </h3>
            <p className="text-xs text-slate-400 font-hud">
              Filter across ARK: Survival Ascended, Minecraft 1.21+, and Terraria 1.4.4+ guides.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#060e1c] border border-white/10 text-xs font-hud">
            <button
              onClick={() => handleSelectGameFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterGame === 'all'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({ALL_HUB_TOOLS.length})
            </button>
            <button
              onClick={() => handleSelectGameFilter('ark')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterGame === 'ark'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ◈ ARK (10)
            </button>
            <button
              onClick={() => handleSelectGameFilter('minecraft')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterGame === 'minecraft'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 Minecraft (7)
            </button>
            <button
              onClick={() => handleSelectGameFilter('terraria')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterGame === 'terraria'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚔️ Terraria (5)
            </button>
            <button
              onClick={() => handleSelectGameFilter('rust')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterGame === 'rust'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💥 Rust (5)
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools: C4, Pyromane, Nether Portal, Stego, Diamonds, 1-Emerald Trades, Breeding..."
            className="w-full bg-[#060c18] border border-cyan-500/30 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-hud shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-tek text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 cursor-pointer"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Directory Grid with Shimmer Skeleton on Filtering Transition */}
        {isFiltering ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-white/[0.08] bg-[#070e1c]/80 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <SkeletonBlock 
                      className="w-8 h-8" 
                      theme={filterGame === 'minecraft' ? 'purple' : filterGame === 'terraria' ? 'emerald' : 'cyan'} 
                      rounded="rounded-lg" 
                    />
                    <SkeletonBlock className="h-4 w-16" rounded="rounded-full" />
                  </div>
                  <SkeletonBlock className="h-5 w-3/4" rounded="rounded" />
                  <div className="space-y-1.5 pt-1">
                    <SkeletonBlock className="h-3.5 w-full" rounded="rounded" />
                    <SkeletonBlock className="h-3.5 w-4/5" rounded="rounded" />
                  </div>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <SkeletonBlock className="h-3 w-20" rounded="rounded" />
                  <SkeletonBlock className="h-3 w-12" rounded="rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isArk = tool.game === 'ark';
            const isTerraria = tool.game === 'terraria';

            return (
              <Link
                key={tool.id}
                to={tool.path}
                className={`group p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:scale-[1.01] ${
                  isArk
                    ? 'bg-[#050e1b] hover:bg-[#071324] border-cyan-500/20 hover:border-cyan-400/50 shadow-sm'
                    : isTerraria
                    ? 'bg-[#0d1624] hover:bg-[#121f33] border-emerald-500/30 hover:border-emerald-400/60 shadow-sm'
                    : 'bg-[#0c0618] hover:bg-[#120924] border-purple-500/20 hover:border-purple-400/50 shadow-sm'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isArk 
                          ? 'bg-cyan-500/20 text-cyan-300' 
                          : isTerraria 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-tek font-bold uppercase tracking-wider text-slate-400">
                        {tool.category}
                      </span>
                    </div>

                    <span className={`text-[9px] font-tek font-bold px-1.5 py-0.5 rounded ${
                      isArk 
                        ? 'bg-cyan-950 border border-cyan-500/30 text-cyan-300' 
                        : isTerraria
                        ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                        : 'bg-purple-950 border border-purple-500/30 text-purple-300'
                    }`}>
                      {tool.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className={`font-hud font-bold text-sm text-white transition-colors ${
                      isTerraria ? 'group-hover:text-emerald-300' : 'group-hover:text-cyan-300'
                    }`}>
                      {tool.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2 mt-1">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-hud text-slate-400 group-hover:text-white transition-colors mt-2">
                  <span className={`text-[11px] font-tek ${
                    isTerraria ? 'text-emerald-400 font-bold' : 'text-slate-500'
                  }`}>
                    {isArk ? 'ARK ASCENDED' : isTerraria ? 'TERRARIA 1.4.4+' : 'MINECRAFT 1.21+'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">Open Tool</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

        {filteredTools.length === 0 && (
          <div className="p-12 text-center bg-[#050a14] border border-cyan-500/20 rounded-2xl space-y-2">
            <Search className="w-8 h-8 text-cyan-400 mx-auto opacity-40" />
            <div className="text-sm font-hud font-bold text-white">No tactical tools found</div>
            <p className="text-xs text-slate-400">
              No results matching "{search}". Try searching for "c4", "taming", "portal", or "ores".
            </p>
          </div>
        )}
      </div>

      {/* Methodology & Verification Banner */}
      <div className="bg-[#050b16] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <EngineIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-hud font-bold text-sm text-white">
              Mathematical Verification Standards
            </h4>
            <p className="text-xs text-slate-400">
              We decompile raw game mechanics rather than scraping approximations. Learn how our models are tested.
            </p>
          </div>
        </div>

        <Link
          to="/about"
          className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-hud font-bold text-xs flex items-center gap-2 transition-all shrink-0"
        >
          <span>Read Verification Methodology</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
