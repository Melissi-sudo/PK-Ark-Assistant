import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Crosshair, 
  Flame, 
  ShieldAlert, 
  Bomb, 
  Egg, 
  Map, 
  Utensils, 
  ShieldCheck, 
  Timer, 
  ShoppingBag, 
  Beaker, 
  Pickaxe, 
  Users, 
  Cpu, 
  Hammer, 
  Skull, 
  Code2, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface QuickJumpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JumpItem {
  id: string;
  title: string;
  game: 'ark' | 'minecraft' | 'library';
  category: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  desc: string;
  badge?: string;
}

export const ALL_JUMP_ITEMS: JumpItem[] = [
  // ARK - Taming
  {
    id: 'ark-taming',
    title: 'Taming Calculator',
    game: 'ark',
    category: 'Taming',
    path: '/taming',
    icon: Crosshair,
    keywords: ['tame', 'starve', 'torpor', 'narcotic', 'food', 'kibble', 'stego', 'rex', 'giga'],
    desc: 'Auto food quotas, torpor decay and starve timers',
    badge: 'CORE'
  },
  {
    id: 'ark-pyromane',
    title: 'Pyromane Taming Guide',
    game: 'ark',
    category: 'Taming',
    path: '/pyromane',
    icon: Flame,
    keywords: ['pyromane', 'fire', 'cat', 'water', 'lure', '30s', 'ride'],
    desc: 'Water extinguishing tactic & 30-second ride simulator',
    badge: 'BOB\'S TALES'
  },
  // ARK - Combat & Raiding
  {
    id: 'ark-soakers',
    title: 'Turret Soakers Matrix',
    game: 'ark',
    category: 'Combat & Raiding',
    path: '/soakers',
    icon: ShieldAlert,
    keywords: ['soaker', 'turret', 'heavy', 'stego', 'trike', 'carbo', 'saddle', 'hitbox', 'dismount'],
    desc: 'Stego plates, Trike headshot armor & turret dismount safety',
    badge: 'PVP META'
  },
  {
    id: 'ark-raiding',
    title: 'Raid Explosives & Breaching',
    game: 'ark',
    category: 'Combat & Raiding',
    path: '/raiding',
    icon: Bomb,
    keywords: ['raid', 'c4', 'rocket', 'explosive', 'tek rifle', 'grenade', 'metal', 'tek wall', 'vault', 'flak'],
    desc: 'Structure HP vs C4, Rockets, Tek Rifle & armor durability',
    badge: 'C4 & TEK'
  },
  {
    id: 'ark-resources',
    title: 'Tribe Ammo & Gunpowder Quota',
    game: 'ark',
    category: 'Combat & Raiding',
    path: '/resources',
    icon: ShieldCheck,
    keywords: ['ammo', 'arb', 'gunpowder', 'sparkpowder', 'charcoal', 'bullets', 'heavy turret', 'tribe'],
    desc: 'Advanced Rifle Bullet quotas & raw material batch calculator',
    badge: 'QUOTAS'
  },
  // ARK - Breeding & Stats
  {
    id: 'ark-breeding',
    title: 'Breeding & Nursery Hub',
    game: 'ark',
    category: 'Breeding & Stats',
    path: '/breeding',
    icon: Egg,
    keywords: ['breed', 'egg', 'hatch', 'gestation', 'imprint', 'cuddle', 'baby', 'temperature', 'maewing'],
    desc: 'Incubation, gestation and optimal cuddle timer schedules'
  },
  {
    id: 'ark-stats',
    title: 'Dino Stat & Mutation Extractor',
    game: 'ark',
    category: 'Breeding & Stats',
    path: '/stats',
    icon: Search,
    keywords: ['stats', 'lookup', 'mutation', 'wild points', 'health', 'melee', 'stamina', 'weight'],
    desc: 'Extract wild level distribution and identify high-stat breeders'
  },
  // ARK - World & Recipes
  {
    id: 'ark-maps',
    title: 'Topographical Resource Maps',
    game: 'ark',
    category: 'World & Recipes',
    path: '/maps',
    icon: Map,
    keywords: ['maps', 'metal', 'silica', 'oil', 'obsidian', 'crystal', 'island', 'scorched', 'center', 'aberration'],
    desc: 'Interactive coordinate pins for metal, silica, oil and obsidian',
    badge: '5 MAPS'
  },
  {
    id: 'ark-kibble',
    title: 'Kibble & Chef Recipe Matrix',
    game: 'ark',
    category: 'World & Recipes',
    path: '/kibble',
    icon: Utensils,
    keywords: ['kibble', 'recipe', 'cooking', 'veggie cake', 'mindwipe', 'stew', 'fria curry', 'calien', 'chef'],
    desc: 'Sweet Vegetable Cakes, all kibble tiers & Rockwell recipes',
    badge: 'RECIPES'
  },
  // ARK - Alarms & Store
  {
    id: 'ark-timers',
    title: 'War Room Timers & Alarms',
    game: 'ark',
    category: 'Alarms',
    path: '/timers',
    icon: Timer,
    keywords: ['timer', 'alarm', 'starve', 'sound', 'hatch', 'alert', 'tek alarm'],
    desc: 'Custom countdowns with browser notifications and TEK audio alerts'
  },
  {
    id: 'ark-store',
    title: 'PK Store VIP Catalog',
    game: 'ark',
    category: 'Store',
    path: '/store',
    icon: ShoppingBag,
    keywords: ['store', 'discord', 'buy', 'lines', 'vip', 'kits', 'small tribes'],
    desc: 'Small Tribes breedlines, blueprints and raid kits',
    badge: 'VIP'
  },
  // MINECRAFT TOOLS
  {
    id: 'mc-portal',
    title: 'Nether Portal 3D Linker',
    game: 'minecraft',
    category: 'Minecraft 1.21+',
    path: '/minecraft/portal',
    icon: Flame,
    keywords: ['portal', 'nether', 'overworld', 'coordinates', 'link', '8:1', 'obsidian', 'hub'],
    desc: '8:1 horizontal ratio & 3D Euclidean distance linking guarantee',
    badge: '3D LINK'
  },
  {
    id: 'mc-potions',
    title: '1.21 Potion Brewing Lab',
    game: 'minecraft',
    category: 'Minecraft 1.21+',
    path: '/minecraft/potions',
    icon: Beaker,
    keywords: ['potion', 'brewing', 'oozing', 'wind charged', 'weaving', 'strength', 'speed', 'invisibility'],
    desc: 'Interactive brewing tree with 1.21 Tricky Trials effects',
    badge: '1.21'
  },
  {
    id: 'mc-ores',
    title: 'Ore Elevation & Distribution',
    game: 'minecraft',
    category: 'Minecraft 1.21+',
    path: '/minecraft/ores',
    icon: Pickaxe,
    keywords: ['ores', 'diamonds', 'ancient debris', 'iron', 'gold', 'elevation', 'y-level', 'mining'],
    desc: 'Best Y-levels: Diamonds at Y:-58, Ancient Debris at Y:15',
    badge: 'Y:-64..320'
  },
  {
    id: 'mc-villagers',
    title: 'Villager Trading & Curing Hub',
    game: 'minecraft',
    category: 'Minecraft 1.21+',
    path: '/minecraft/villagers',
    icon: Users,
    keywords: ['villager', 'mending', 'trades', 'zombie curing', 'librarian', 'discounts'],
    desc: '1-Emerald discount loops & Mending trade mechanics',
    badge: '1-EMERALD'
  },
  {
    id: 'mc-redstone',
    title: 'Redstone Clock & Circuit Lab',
    game: 'minecraft',
    category: 'Minecraft 1.21+',
    path: '/minecraft/redstone',
    icon: Cpu,
    keywords: ['redstone', 'repeater', 'comparator', 'hopper clock', 'item sorter', 'pulse extender', 'logic'],
    desc: 'Hopper clock timing, item sorters and pulse circuits'
  },
  {
    id: 'mc-enchanting',
    title: 'Anvil Optimizer & Mace Lab',
    game: 'minecraft',
    category: 'Minecraft 1.21+',
    path: '/minecraft/enchanting',
    icon: Hammer,
    keywords: ['anvil', 'enchanting', 'mace', 'too expensive', 'xp', 'combining', 'density', 'breach'],
    desc: 'Optimal binary merge order to avoid "Too Expensive!" limit'
  },
  {
    id: 'mc-mobs',
    title: 'Mob AI, Despawn & Raids',
    game: 'minecraft',
    category: 'Minecraft 1.21+',
    path: '/minecraft/mobs',
    icon: Skull,
    keywords: ['mobs', 'spawning', 'despawn', 'light level', 'ominous bottle', 'bad omen', 'trial chambers'],
    desc: '24-128m despawn radius & 1.21 Ominous Trial Raids'
  },
  {
    id: 'mc-commands',
    title: 'Command Block & Sign Gradient Generator',
    game: 'minecraft',
    category: 'Minecraft 1.21+',
    path: '/minecraft/commands',
    icon: Code2,
    keywords: ['command', 'gradient', 'sign', 'rgb', 'hex', 'color', 'tellraw', 'motd'],
    desc: 'Rich multi-color RGB gradients for signs, books & title commands'
  },
  {
    id: 'mc-item-summon',
    title: 'Item & Enchant Summon Generator',
    game: 'minecraft',
    category: 'Minecraft 1.21+',
    path: '/minecraft/item-summon',
    icon: Sparkles,
    keywords: ['summon', 'item', 'give', 'enchantment', 'custom name', 'lore', 'unbreakable', 'nbt'],
    desc: 'Modern 1.20.5+ item_components /give command builder'
  }
];

export const QuickJumpModal: React.FC<QuickJumpModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter items
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) {
      return ALL_JUMP_ITEMS;
    }
    const q = query.toLowerCase().trim();
    return ALL_JUMP_ITEMS.filter(item => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.keywords.some(k => k.includes(q))
      );
    });
  }, [query]);

  // Handle keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        navigate(filteredItems[selectedIndex].path);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Quick Navigator"
      >
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-2xl bg-[#070e1c] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] z-10 font-hud"
        >
          {/* Top Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#091427]">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Quick Jump: Type tool name, dinosaur, resource, or keyword... (e.g. C4, Stego, Kibble, Nether)"
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm font-sans focus:outline-none"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-white p-1 text-xs"
              >
                Clear
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 bg-black/40 border border-slate-700 rounded text-[10px] text-slate-400 font-mono">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 ml-1"
              aria-label="Close Navigator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="px-4 py-2 border-b border-white/[0.06] bg-[#050b14] flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-slate-500 text-[10px] uppercase tracking-wider font-tek">Filter:</span>
            <button
              onClick={() => setQuery('')}
              className={`px-2 py-0.5 rounded-lg border cursor-pointer ${
                query === '' 
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-bold' 
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Tools ({ALL_JUMP_ITEMS.length})
            </button>
            <button
              onClick={() => setQuery('ark')}
              className={`px-2 py-0.5 rounded-lg border cursor-pointer ${
                query.toLowerCase() === 'ark' 
                  ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-bold' 
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-cyan-300'
              }`}
            >
              ARK Guides
            </button>
            <button
              onClick={() => setQuery('minecraft')}
              className={`px-2 py-0.5 rounded-lg border cursor-pointer ${
                query.toLowerCase() === 'minecraft' 
                  ? 'bg-purple-500/20 border-purple-400/50 text-purple-300 font-bold' 
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-purple-300'
              }`}
            >
              Minecraft 1.21
            </button>
            <button
              onClick={() => setQuery('raid')}
              className="px-2 py-0.5 rounded-lg border bg-white/[0.03] border-white/10 text-slate-400 hover:text-red-300 cursor-pointer"
            >
              Raid & Combat
            </button>
            <button
              onClick={() => setQuery('tame')}
              className="px-2 py-0.5 rounded-lg border bg-white/[0.03] border-white/10 text-slate-400 hover:text-cyan-300 cursor-pointer"
            >
              Taming & Starve
            </button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 max-h-[55vh]">
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Search className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">No tools found matching &quot;{query}&quot;</p>
                <p className="text-xs text-slate-500 mt-1">Try searching for &quot;c4&quot;, &quot;taming&quot;, &quot;portal&quot;, or &quot;maps&quot;</p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                const isCurrentRoute = location.pathname === item.path;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? item.game === 'minecraft'
                          ? 'bg-purple-950/50 border-purple-400 text-white shadow-md'
                          : 'bg-cyan-950/60 border-cyan-400 text-white shadow-md'
                        : 'bg-[#081120]/70 border-white/[0.06] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`p-2 rounded-xl shrink-0 border ${
                        item.game === 'minecraft'
                          ? 'bg-purple-900/30 border-purple-500/30 text-purple-300'
                          : 'bg-cyan-900/30 border-cyan-500/30 text-cyan-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-hud font-bold text-xs sm:text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                            {item.title}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-tek font-bold ${
                            item.game === 'minecraft'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {item.category}
                          </span>
                          {item.badge && (
                            <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-tek">
                              {item.badge}
                            </span>
                          )}
                          {isCurrentRoute && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-tek">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden md:inline-block text-[10px] text-slate-500 font-mono">
                        {item.path}
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        isSelected ? 'text-cyan-400' : 'text-slate-600'
                      }`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2.5 bg-[#050914] border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 font-tek">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 bg-black/50 border border-slate-700 rounded text-[9px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-black/50 border border-slate-700 rounded text-[9px]">↓</kbd> to navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-black/50 border border-slate-700 rounded text-[9px]">ENTER</kbd> to select</span>
            </div>
            <span className="text-cyan-400">Total {ALL_JUMP_ITEMS.length} tactical calculators</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
