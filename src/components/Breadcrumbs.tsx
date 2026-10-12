import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronRight, 
  Gamepad2, 
  Flame, 
  Crosshair, 
  ShieldAlert, 
  Bomb, 
  Egg, 
  Map, 
  Utensils, 
  Timer, 
  Search, 
  ShieldCheck, 
  Pickaxe, 
  Beaker, 
  Users, 
  Cpu, 
  Hammer, 
  Skull, 
  BookOpen,
  ShoppingBag,
  Info,
  Swords,
  Heart,
  Layers
} from 'lucide-react';

interface Crumb {
  label: string;
  path?: string;
  icon?: React.FC<{ className?: string }>;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/' || path === '/library') {
    return (
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs font-hud text-slate-400">
        <span className="flex items-center gap-1.5 text-cyan-300 font-bold px-2 py-1 rounded bg-cyan-950/40 border border-cyan-500/20">
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tactical Game Library</span>
        </span>
        <span className="text-slate-600 font-tek">/</span>
        <span className="text-slate-400">Select Game to Launch Specialized Tools</span>
      </nav>
    );
  }

  const crumbs: Crumb[] = [
    { label: 'Games', path: '/library', icon: Gamepad2 }
  ];

  if (path.startsWith('/minecraft')) {
    crumbs.push({ label: 'Minecraft 1.21+', path: '/minecraft', icon: Flame });

    if (path.includes('/portal')) {
      crumbs.push({ label: 'Dimensions', path: '/minecraft/portal' });
      crumbs.push({ label: '3D Nether Portal Linker', icon: Flame });
    } else if (path.includes('/potions')) {
      crumbs.push({ label: 'Brewing & Elixirs', path: '/minecraft/potions' });
      crumbs.push({ label: '1.21 Potion Matrix', icon: Beaker });
    } else if (path.includes('/ores')) {
      crumbs.push({ label: 'Mining & Y-Levels', path: '/minecraft/ores' });
      crumbs.push({ label: 'Ore Elevation Guide', icon: Pickaxe });
    } else if (path.includes('/villagers')) {
      crumbs.push({ label: 'Economy & Trades', path: '/minecraft/villagers' });
      crumbs.push({ label: '1-Emerald Villager Trades', icon: Users });
    } else if (path.includes('/redstone')) {
      crumbs.push({ label: 'Logic & Circuits', path: '/minecraft/redstone' });
      crumbs.push({ label: 'Hopper Clocks & Sorters', icon: Cpu });
    } else if (path.includes('/enchanting')) {
      crumbs.push({ label: 'Anvil Mechanics', path: '/minecraft/enchanting' });
      crumbs.push({ label: 'Mace 1.21 Optimizer', icon: Hammer });
    } else if (path.includes('/mobs')) {
      crumbs.push({ label: 'Mob AI & Spawners', path: '/minecraft/mobs' });
      crumbs.push({ label: 'Trial Chambers & Despawn', icon: Skull });
    } else {
      crumbs.push({ label: 'Tactical Hub' });
    }
  } else if (path.startsWith('/terraria') || path.startsWith('/bosses') || path.startsWith('/evil') || path.startsWith('/terraria-guide')) {
    crumbs.push({ label: 'Terraria 1.4.4+', path: '/terraria', icon: Swords });

    if (path.includes('/bosses')) {
      crumbs.push({ label: 'Boss Progression & Arenas', icon: Skull });
    } else if (path.includes('/matrix') || path.includes('/table') || path.includes('/health')) {
      crumbs.push({ label: '18-Boss Health Matrix', icon: Heart });
    } else if (path.includes('/biomes')) {
      crumbs.push({ label: 'Biomes, Fishing & NPC Housing', icon: Map });
    } else if (path.includes('/ores')) {
      crumbs.push({ label: 'Ore Tiers & Pickaxe Progression', icon: Pickaxe });
    } else if (path.includes('/underground')) {
      crumbs.push({ label: 'Caverns & The Aether Shimmer', icon: Layers });
    } else if (path.includes('/evil')) {
      crumbs.push({ label: 'World Evils & Quarantine (Crimson / Corruption)', icon: ShieldAlert });
    } else {
      crumbs.push({ label: 'Master Strategy Companion & Boss Checklist', icon: Skull });
    }
  } else if (path.startsWith('/rust')) {
    crumbs.push({ label: 'Rust Tactical', path: '/rust', icon: Bomb });

    if (path.includes('/raid')) {
      crumbs.push({ label: 'Raid Cost & Raw Sulfur Math', icon: Bomb });
    } else if (path.includes('/upkeep') || path.includes('/decay')) {
      crumbs.push({ label: 'Base Upkeep & TC Decay Simulator', icon: Layers });
    } else if (path.includes('/combat') || path.includes('/ttk')) {
      crumbs.push({ label: 'Combat TTK & Ballistics Matrix', icon: Crosshair });
    } else if (path.includes('/techtree') || path.includes('/scrap')) {
      crumbs.push({ label: 'Tech Tree & Scrap Blueprint Planner', icon: Cpu });
    } else if (path.includes('/monuments') || path.includes('/recycler')) {
      crumbs.push({ label: 'Monuments Keycards & Recycler Yields', icon: Map });
    } else {
      crumbs.push({ label: 'Operations Suite', icon: Bomb });
    }
  } else if (path === '/about') {
    crumbs.push({ label: 'About & Methodology', icon: Info });
  } else {
    // ARK routes
    crumbs.push({ label: 'ARK Ascended', path: '/taming' });

    if (path === '/taming') {
      crumbs.push({ label: 'Taming Hub', path: '/taming' });
      crumbs.push({ label: 'Automated Taming & Starve Engine', icon: Crosshair });
    } else if (path === '/pyromane') {
      crumbs.push({ label: 'Taming Hub', path: '/taming' });
      crumbs.push({ label: 'Pyromane 30s Fire Ride Guide', icon: Flame });
    } else if (path === '/soakers') {
      crumbs.push({ label: 'Combat & Raiding', path: '/soakers' });
      crumbs.push({ label: 'Turret Soakers & Hitbox Geometry', icon: ShieldAlert });
    } else if (path === '/raiding') {
      crumbs.push({ label: 'Combat & Raiding', path: '/raiding' });
      crumbs.push({ label: 'HP vs C4 & Explosives Math', icon: Bomb });
    } else if (path === '/resources') {
      crumbs.push({ label: 'Combat & Raiding', path: '/resources' });
      crumbs.push({ label: 'Tribe Ammo & Gunpowder Quota', icon: ShieldCheck });
    } else if (path === '/breeding') {
      crumbs.push({ label: 'Breeding & Genetics', path: '/breeding' });
      crumbs.push({ label: 'Incubation, Gestation & Nursery', icon: Egg });
    } else if (path === '/stats') {
      crumbs.push({ label: 'Breeding & Genetics', path: '/stats' });
      crumbs.push({ label: 'Dino Stat Extractor & Mutations', icon: Search });
    } else if (path.startsWith('/maps')) {
      crumbs.push({ label: 'World & Survival', path: '/maps' });
      crumbs.push({ label: 'Interactive Resource Maps', icon: Map });
    } else if (path === '/kibble') {
      crumbs.push({ label: 'World & Survival', path: '/kibble' });
      crumbs.push({ label: 'Kibble Matrix, Cakes & Tonics', icon: Utensils });
    } else if (path === '/timers') {
      crumbs.push({ label: 'Tactical War Room', path: '/timers' });
      crumbs.push({ label: 'Starve & Hatch Alarms', icon: Timer });
    }
  }

  const isMinecraft = path.startsWith('/minecraft');
  const isTerraria = path.startsWith('/terraria') || path.startsWith('/bosses') || path.startsWith('/evil') || path.startsWith('/terraria-guide');
  const isRust = path.startsWith('/rust');

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className={`mb-5 px-3 py-2 rounded-2xl backdrop-blur-md shadow-lg flex items-center justify-between gap-2 flex-wrap text-[11px] sm:text-xs font-hud transition-colors ${
        isTerraria
          ? 'bg-[#14182b]/95 border-2 border-[#3b476e] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
          : isRust
          ? 'bg-[#140f0c]/90 border border-orange-500/30'
          : 'bg-[#060c18]/80 border border-white/[0.07]'
      }`}
    >
      <div className="flex items-center flex-wrap gap-1">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          const Icon = crumb.icon;

          return (
            <div key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight className={`w-3 h-3 shrink-0 ${isTerraria ? 'text-[#e5d5b7]' : isRust ? 'text-orange-500/50' : 'text-slate-500'}`} />
              )}
              
              {crumb.path && !isLast ? (
                <Link
                  to={crumb.path}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                    isTerraria 
                      ? 'text-[#e2d5b7] hover:text-[#fde047] hover:bg-[#2b3558]' 
                      : isRust
                      ? 'text-slate-400 hover:text-orange-300 hover:bg-orange-950/40'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 shrink-0 ${isTerraria ? 'text-[#facc15]' : isRust ? 'text-orange-400' : 'text-slate-400'}`} />}
                  <span>{crumb.label}</span>
                </Link>
              ) : (
                <span 
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold shadow-sm ${
                    isLast 
                      ? isTerraria
                        ? 'bg-[#252e4e] border-2 border-[#c89f46] text-[#fef08a] shadow-[0_0_10px_rgba(200,159,70,0.3)]'
                        : isMinecraft 
                          ? 'bg-purple-950/70 border border-purple-500/40 text-purple-200' 
                          : isRust
                            ? 'bg-orange-950/70 border border-orange-500/40 text-orange-200'
                            : 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-200' 
                      : isTerraria ? 'text-[#e2d5b7]' : 'text-slate-300'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 shrink-0 ${isTerraria ? 'text-[#facc15]' : isRust ? 'text-orange-400' : ''}`} />}
                  <span>{crumb.label}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 font-tek">
        <span className="text-slate-400">QUICK SEARCH</span>
        <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300 font-mono text-[10px]">
          /
        </kbd>
      </div>
    </nav>
  );
};
