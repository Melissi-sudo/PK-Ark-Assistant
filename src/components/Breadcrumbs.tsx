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
  Info
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
    } else if (path === '/store') {
      crumbs.push({ label: 'Official Small Tribes', path: '/store' });
      crumbs.push({ label: 'PK Store Discord Vault', icon: ShoppingBag });
    }
  }

  const isMinecraft = path.startsWith('/minecraft');

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className="mb-5 px-3 py-2 rounded-2xl bg-[#060c18]/80 backdrop-blur-md border border-white/[0.07] shadow-lg flex items-center justify-between gap-2 flex-wrap text-[11px] sm:text-xs font-hud"
    >
      <div className="flex items-center flex-wrap gap-1">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          const Icon = crumb.icon;

          return (
            <div key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              )}
              
              {crumb.path && !isLast ? (
                <Link
                  to={crumb.path}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors"
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
                  <span>{crumb.label}</span>
                </Link>
              ) : (
                <span 
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold shadow-sm ${
                    isLast 
                      ? isMinecraft 
                        ? 'bg-purple-950/70 border border-purple-500/40 text-purple-200' 
                        : 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-200' 
                      : 'text-slate-300'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
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
