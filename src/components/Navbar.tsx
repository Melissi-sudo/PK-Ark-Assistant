import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Crosshair, 
  Egg, 
  ShieldAlert, 
  Search, 
  Timer, 
  Volume2, 
  VolumeX, 
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Zap,
  Globe,
  User,
  Flame,
  ShieldCheck,
  Map,
  Sparkles,
  LayoutGrid,
  Keyboard,
  X,
  BookOpen,
  Beaker,
  Pickaxe,
  Users,
  Cpu,
  Hammer,
  Skull,
  Layers,
  Bomb,
  Utensils,
  Sliders,
  Compass,
  Info,
  Swords
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServerRatePreset } from '../types';
import { SERVER_PRESETS } from '../data/presets';
import { playTekAlarmSound } from '../utils/audioAlert';
import { useAuth } from '../context/AuthContext';

export type NavTab = 
  | 'library'
  | 'taming' 
  | 'soakers' 
  | 'pyromane' 
  | 'breeding' 
  | 'maps' 
  | 'resources' 
  | 'raiding'
  | 'kibble'
  | 'stats' 
  | 'timers' 
  | 'store'
  | 'mc-portal'
  | 'mc-potions'
  | 'mc-ores'
  | 'mc-villagers'
  | 'mc-redstone'
  | 'mc-enchanting'
  | 'mc-mobs';

interface NavbarProps {
  currentPreset: ServerRatePreset;
  setCurrentPreset: (preset: ServerRatePreset) => void;
  activeTimersCount: number;
  hasExpiringTimers: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenStoreModal?: () => void;
  onOpenAuthModal: () => void;
  onReplayIntro?: () => void;
  onOpenKeyboardShortcuts?: () => void;
  onOpenQuickJump?: () => void;
  onOpenCustomRates: () => void;
  onOpenSidebar: () => void;
  onOpenAbout?: () => void;
}

export interface ArkCategoryItem {
  id: string;
  path: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  badge?: string;
  accent?: 'cyan' | 'amber' | 'emerald' | 'purple' | 'red';
}

export interface ArkCategory {
  id: string;
  label: string;
  shortLabel: string;
  defaultPath: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  accent?: 'cyan' | 'amber' | 'emerald' | 'purple' | 'red';
  items: ArkCategoryItem[];
}

export const ARK_CATEGORIES: ArkCategory[] = [
  {
    id: 'taming',
    label: 'Taming Hub',
    shortLabel: 'Taming',
    defaultPath: '/taming',
    icon: Crosshair,
    badge: '2 TOOLS',
    items: [
      { id: 'taming', path: '/taming', label: 'Taming Calculator', shortLabel: 'Knockout & Food', icon: Crosshair, desc: 'Torpor decay, food quotas & starve alerts', badge: 'CORE', accent: 'cyan' },
      { id: 'pyromane', path: '/pyromane', label: 'Pyromane Guide', shortLabel: 'Pyromane 30s', icon: Flame, desc: 'Water extinguishing strategy & 30s ride simulator', badge: 'FANTASTIC TAMES', accent: 'amber' },
    ]
  },
  {
    id: 'combat',
    label: 'Raiding & Combat',
    shortLabel: 'Raiding & Combat',
    defaultPath: '/soakers',
    icon: ShieldAlert,
    badge: 'PVP META',
    accent: 'cyan',
    items: [
      { id: 'soakers', path: '/soakers', label: 'Turret Soakers', shortLabel: 'Turret Soakers', icon: ShieldAlert, desc: 'Stego plates, Trike headshot armor & hitbox safety', badge: 'SOAKERS', accent: 'cyan' },
      { id: 'raiding', path: '/raiding', label: 'Raid Explosives Math', shortLabel: 'Raid Math (C4)', icon: Bomb, desc: 'Structure HP vs C4, Rockets, Tek Rifle & armor', badge: 'C4 & TEK', accent: 'red' },
      { id: 'resources', path: '/resources', label: 'Tribe Ammo Quota', shortLabel: 'Ammo Quotas', icon: ShieldCheck, desc: 'Heavy turret bullets & gunpowder batch quotas', badge: 'QUOTAS', accent: 'emerald' },
    ]
  },
  {
    id: 'breeding',
    label: 'Breeding & Stats',
    shortLabel: 'Breeding & Stats',
    defaultPath: '/breeding',
    icon: Egg,
    badge: 'GENETICS',
    items: [
      { id: 'breeding', path: '/breeding', label: 'Breeding & Nursery', shortLabel: 'Breeding Hub', icon: Egg, desc: 'Incubation, gestation, imprint schedules & cuddle times', accent: 'purple' },
      { id: 'stats', path: '/stats', label: 'Dino Stat Extractor', shortLabel: 'Dino Stats', icon: Search, desc: 'Extract wild level distribution & identify high-stat breeders', accent: 'cyan' },
    ]
  },
  {
    id: 'survival',
    label: 'Maps & Recipes',
    shortLabel: 'Maps & Recipes',
    defaultPath: '/maps',
    icon: Map,
    badge: '5 MAPS',
    accent: 'cyan',
    items: [
      { id: 'maps', path: '/maps', label: 'Resource Maps', shortLabel: 'Resource Maps', icon: Map, desc: 'Interactive coordinate pins for metal, silica, oil & obsidian', badge: '5 MAPS', accent: 'cyan' },
      { id: 'kibble', path: '/kibble', label: 'Kibble & Chef Matrix', shortLabel: 'Kibble & Chef', icon: Utensils, desc: 'All kibble tiers, Sweet Veggie Cakes & Rockwell stews', badge: 'RECIPES', accent: 'emerald' },
    ]
  },
  {
    id: 'timers',
    label: 'War Room Timers',
    shortLabel: 'Alarms',
    defaultPath: '/timers',
    icon: Timer,
    items: [
      { id: 'timers', path: '/timers', label: 'War Room Alarms', shortLabel: 'Tek Timers', icon: Timer, desc: 'Custom starve & hatch timers with TEK alarm audio', accent: 'cyan' },
    ]
  },
];

interface TabItem {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  accent?: 'cyan' | 'amber' | 'emerald' | 'purple' | 'red';
  desc?: string;
}

export const ARK_TABS: TabItem[] = [
  { id: 'taming', path: '/taming', label: 'Taming', icon: Crosshair, desc: 'Auto food quotas, torpor & starve alerts' },
  { id: 'soakers', path: '/soakers', label: 'Soakers', icon: ShieldAlert, badge: 'PVP META', accent: 'cyan', desc: 'Stego & Trike turret hitbox rules' },
  { id: 'raiding', path: '/raiding', label: 'Raid Math', icon: Bomb, badge: 'C4 & TEK', accent: 'red', desc: 'Structure HP vs C4, Rockets & Flak durability' },
  { id: 'kibble', path: '/kibble', label: 'Kibble & Chef', icon: Utensils, badge: 'ALL TIERS', accent: 'emerald', desc: 'Kibble matrix, Veggie Cakes & Mindwipe recipes' },
  { id: 'pyromane', path: '/pyromane', label: 'Pyromane Guide', icon: Flame, badge: '30s Ride', accent: 'amber', desc: 'Water luring & 30s simulator' },
  { id: 'maps', path: '/maps', label: 'Resource Maps', icon: Map, badge: '5 MAPS', accent: 'cyan', desc: 'Interactive metal, silica & oil nodes' },
  { id: 'breeding', path: '/breeding', label: 'Breeding', icon: Egg, desc: 'Incubation, gestation & imprint timers' },
  { id: 'resources', path: '/resources', label: 'Tribe Ammo', icon: ShieldCheck, desc: 'Heavy turret bullets & gunpowder quota' },
  { id: 'stats', path: '/stats', label: 'Dino Stats', icon: Search, desc: 'Extract wild levels & mutation points' },
  { id: 'timers', path: '/timers', label: 'Alarms', icon: Timer, desc: 'Starve & hatch TEK alarms' },
];

export const MINECRAFT_TABS: TabItem[] = [
  { id: 'mc-portal', path: '/minecraft/portal', label: 'Nether Portal', icon: Flame, badge: '3D LINK', accent: 'purple', desc: '8:1 ratio & collision testing' },
  { id: 'mc-potions', path: '/minecraft/potions', label: 'Potion Brewer', icon: Beaker, badge: '1.21 TRIALS', accent: 'emerald', desc: 'Wind Charging, Oozing & PvP elixirs' },
  { id: 'mc-ores', path: '/minecraft/ores', label: 'Ore Elevation', icon: Pickaxe, badge: 'Y: -64..320', accent: 'cyan', desc: 'Diamonds at -58 & Ancient Debris at 15' },
  { id: 'mc-villagers', path: '/minecraft/villagers', label: 'Villager Trades', icon: Users, badge: '1-EMERALD', accent: 'amber', desc: 'Mending re-rolls & zombie curing' },
  { id: 'mc-redstone', path: '/minecraft/redstone', label: 'Redstone Logic', icon: Cpu, badge: 'HOPPER CLOCK', accent: 'red', desc: 'Pulse timing & 41-1-1-1-1 sorter' },
  { id: 'mc-enchanting', path: '/minecraft/enchanting', label: 'Anvil Optimizer', icon: Hammer, badge: '1.21 MACE', accent: 'purple', desc: 'Avoid "Too Expensive!" & Mace buffs' },
  { id: 'mc-mobs', path: '/minecraft/mobs', label: 'Mob AI & Raids', icon: Skull, badge: 'LIGHT LVL 0', accent: 'cyan', desc: '24-128m despawn & Ominous Bottles' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPreset,
  setCurrentPreset,
  activeTimersCount,
  hasExpiringTimers,
  soundEnabled,
  setSoundEnabled,
  onOpenStoreModal,
  onOpenAuthModal,
  onReplayIntro,
  onOpenKeyboardShortcuts,
  onOpenQuickJump,
  onOpenCustomRates,
  onOpenSidebar,
  onOpenAbout
}) => {
  const { currentUser, profile, accountName } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  
  // Game mode: 'library' | 'ark' | 'minecraft' | 'terraria'
  const isMinecraft = currentPath.startsWith('/minecraft');
  const isTerraria = currentPath.startsWith('/terraria');
  const isLibrary = currentPath === '/' || currentPath === '/library';
  const isArk = !isMinecraft && !isTerraria && !isLibrary;

  const activeTabsList = isMinecraft ? MINECRAFT_TABS : ARK_TABS;

  // Find active ARK Category
  const activeCategory = ARK_CATEGORIES.find(cat => 
    cat.items.some(item => 
      currentPath === item.path || 
      (item.path === '/taming' && currentPath === '/') || 
      currentPath.startsWith(item.path + '/')
    )
  ) || ARK_CATEGORIES[0];

  return (
    <header className="sticky top-0 z-40 bg-[#050914]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl">
      {/* Top Bar: Brand, Game Switcher, Presets, Sound, Sync & PK Store */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Left: Sidebar Toggle + Brand Identity */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={onOpenSidebar}
            className="p-1.5 sm:p-2 rounded-xl bg-[#081222] hover:bg-cyan-950/70 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm shadow-cyan-950/40"
            title="Open Tactical Navigation Sidebar (Games, Guides & Tools)"
            aria-label="Open Sidebar Navigation"
          >
            <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
          </button>

          <Link 
            to="/library"
            className="flex items-center gap-2 sm:gap-3 shrink-0 group focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl p-0.5"
            title="PK Ultimate Guide - Tactical Game Library"
          >
            <div className="relative flex items-center justify-center h-8 sm:h-9 w-auto min-w-[34px] max-w-[140px] rounded-xl bg-gradient-to-br from-[#06152a] to-[#040810] border border-cyan-400/50 shadow-md shadow-cyan-500/20 shrink-0 group-hover:border-cyan-300 transition-all px-1.5 py-0.5 overflow-hidden">
              <img 
                src="/logo.png?v=pk-v3" 
                alt="PK Ultimate Guide Logo" 
                className="h-full w-auto max-w-[120px] object-contain filter drop-shadow-[0_0_6px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform duration-200" 
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-base font-bold font-hud text-slate-100 tracking-wider flex items-center gap-1 group-hover:text-cyan-300 transition-colors">
                  PK ULTIMATE <span className="text-cyan-400">GUIDE</span>
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-tek font-semibold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-slate-700/60 rounded">
                  Game Library
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 font-hud">
                <span className="text-slate-500 text-[9px]">BY</span>
                <span className="text-cyan-400 font-semibold tracking-wide uppercase truncate max-w-[110px] sm:max-w-none">
                  The Pitsoni Empire
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center / Game Switcher Tabs (Desktop / Tablet) */}
        <div className="hidden md:flex items-center bg-[#070e1c] p-1 rounded-xl border border-white/10 text-xs font-hud font-bold">
          <Link
            to="/library"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isLibrary
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Library</span>
          </Link>

          <Link
            to="/taming"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isArk
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-cyan-300 font-tek font-bold">◈</span>
            <span>ARK Ascended</span>
          </Link>

          <Link
            to="/minecraft/portal"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isMinecraft
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-purple-300" />
            <span>Minecraft 1.21+</span>
          </Link>

          <Link
            to="/terraria"
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isTerraria
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-emerald-300" />
            <span>Terraria 1.4.4+</span>
          </Link>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          {/* Server Preset Dropdown & Customizer (Shown on ARK pages) */}
          {isArk && (
            <div className="flex items-center gap-1">
              <div className="relative flex items-center bg-[#09101d] hover:bg-[#0c1628] border border-white/[0.08] hover:border-cyan-500/40 rounded-xl px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs text-slate-200 transition-colors">
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 mr-1 shrink-0" />
                <select
                  value={currentPreset.id}
                  onChange={(e) => {
                    const found = SERVER_PRESETS.find(p => p.id === e.target.value);
                    if (found) {
                      setCurrentPreset(found);
                      if (found.id === 'custom') {
                        onOpenCustomRates();
                      }
                    }
                  }}
                  aria-label="Server Rate Preset"
                  className="bg-transparent font-tek font-bold text-cyan-300 text-[11px] sm:text-xs focus:outline-none cursor-pointer pr-3.5 max-w-[95px] xs:max-w-[130px] sm:max-w-none truncate"
                >
                  {SERVER_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id} className="bg-[#0b1019] text-slate-100">
                      {preset.name} ({preset.badge})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-2.5 h-2.5 text-cyan-400 pointer-events-none absolute right-1.5" />
              </div>

              {/* Configure / Edit Rates Button */}
              <button
                onClick={onOpenCustomRates}
                title={currentPreset.id === 'custom' ? 'Customize server multipliers (Active Custom Preset)' : 'Customize ARK server multipliers'}
                className={`p-1.5 sm:px-2 sm:py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-hud ${
                  currentPreset.id === 'custom'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/25 ring-1 ring-cyan-400/50'
                    : 'bg-[#09101d] hover:bg-[#0c1628] border-white/[0.08] text-slate-400 hover:text-cyan-300'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline text-[11px] font-bold">RATES</span>
              </button>
            </div>
          )}

          {/* Minecraft Version Indicator (Shown on Minecraft pages) */}
          {isMinecraft && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#120a21] border border-purple-500/30 rounded-xl text-purple-300 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>v1.21 Tricky Trials</span>
            </div>
          )}

          {/* Sound Alarm Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!soundEnabled) {
                setSoundEnabled(true);
                playTekAlarmSound();
              } else {
                setSoundEnabled(false);
              }
            }}
            title={soundEnabled ? 'Alarm Sound: Enabled (Click to Mute)' : 'Alarm Sound: Muted (Click to Enable)'}
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              soundEnabled
                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300 shadow-sm shadow-cyan-500/10 hover:border-cyan-400'
                : 'bg-[#09101d] border-white/[0.06] text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </motion.button>

          {/* Replay Intro Cinematic Button */}
          {onReplayIntro && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReplayIntro}
              title="Play Tactical Intro Cinematic"
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-1 text-xs font-hud font-bold shadow-sm shadow-cyan-500/10"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline text-[10px]">INTRO</span>
            </motion.button>
          )}

          {/* User Account / Sync */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenAuthModal}
            className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-hud font-semibold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer bg-cyan-950/40 hover:bg-cyan-900/50 border-cyan-400/40 text-cyan-300 shadow-sm shadow-cyan-950/50"
            title="Survivor Account Profile & Cloud Sync"
          >
            <div className={`w-2 h-2 rounded-full ${currentUser ? 'bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse' : 'bg-cyan-400 shadow-sm shadow-cyan-400'}`} />
            <span className="hidden sm:inline max-w-[80px] md:max-w-[100px] truncate text-[11px] font-bold tracking-wide">
              {profile?.displayName || accountName || 'Survivor'}
            </span>
            <span className="text-[9px] bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 px-1 py-0.2 rounded font-tek">
              {currentUser ? 'CLOUD' : 'SYNC'}
            </span>
          </motion.button>

          {/* Official Discord Server Button */}
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://discord.gg/4ruEbqZSKT"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 sm:px-2.5 sm:py-1.5 bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/40 hover:border-[#5865F2] rounded-xl text-[#8ea1e1] hover:text-white text-xs font-hud font-bold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-[#5865F2]/10"
            title="Join the Official PK Guides Discord Server"
          >
            <svg className="w-3.5 h-3.5 fill-current text-[#5865F2]" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span className="text-[10px] sm:text-xs">DISCORD</span>
          </motion.a>

          {/* Mobile All-Tools Grid Drawer Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 text-cyan-300 flex items-center justify-center cursor-pointer"
            title="Open all tools menu"
            aria-label="Open all tools menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Sub Navigation Bar for ARK Guides */}
      {isArk && (
        <div className="relative border-t border-white/[0.06] bg-[#040711]/95 px-2.5 sm:px-6 py-2 space-y-1.5">
          {/* Row 1: 5 Consolidated Category Hubs + Quick Jump Palette */}
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <nav 
              role="tablist" 
              aria-label="ARK Guide Categories" 
              className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs no-scrollbar py-0.5 touch-pan-x"
            >
              {/* Quick Back to Library Link */}
              <Link
                to="/library"
                className="px-2 sm:px-2.5 py-1.5 text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-hud text-xs shrink-0 mr-1 rounded-xl hover:bg-white/[0.04] transition-colors"
                title="Return to Multi-Game Library"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Library</span>
              </Link>

              <span className="h-4 w-[1px] bg-white/10 shrink-0 mr-1" />

              {ARK_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isCatActive = activeCategory.id === cat.id;

                return (
                  <div key={cat.id} className="relative group shrink-0">
                    <Link
                      to={cat.defaultPath}
                      role="tab"
                      id={`cat-tab-${cat.id}`}
                      aria-selected={isCatActive}
                      className={`relative px-3 sm:px-3.5 py-1.5 rounded-xl font-hud font-semibold text-xs tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
                        isCatActive
                          ? 'text-white font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* Animated active pill indicator */}
                      {isCatActive && (
                        <motion.div
                          layoutId="activeCategoryPill"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="absolute inset-0 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-950/85 via-[#0c1f38] to-cyan-950/85 shadow-[0_0_15px_rgba(6,182,212,0.25)] -z-0"
                        />
                      )}

                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${
                          isCatActive 
                            ? 'text-cyan-400' 
                            : 'text-slate-400 group-hover:text-cyan-300'
                        }`} />
                        <span>{cat.shortLabel}</span>

                        {/* Category Badge or Tool Count */}
                        {cat.badge && (
                          <span className="hidden lg:inline-block text-[9px] px-1 py-0.2 rounded font-tek font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {cat.badge}
                          </span>
                        )}

                        {/* Timer Count Badge */}
                        {cat.id === 'timers' && activeTimersCount > 0 && (
                          <span className={`px-1.5 py-0.2 text-[10px] font-tek font-bold rounded-full ${
                            hasExpiringTimers 
                              ? 'bg-red-500 text-white animate-bounce' 
                              : 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                          }`}>
                            {activeTimersCount}
                          </span>
                        )}

                        {cat.items.length > 1 && (
                          <ChevronDown className="w-2.5 h-2.5 text-slate-500 group-hover:text-cyan-300 transition-transform group-hover:rotate-180 hidden sm:inline-block" />
                        )}
                      </span>
                    </Link>

                    {/* Desktop Hover Quick-Menu */}
                    {cat.items.length > 1 && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-[#070e1c] border border-cyan-500/30 rounded-2xl shadow-2xl p-1.5 hidden group-hover:block z-50 backdrop-blur-xl">
                        <div className="text-[10px] font-tek font-bold text-cyan-400 px-2 py-1 uppercase tracking-wider border-b border-white/[0.06] mb-1 flex items-center justify-between">
                          <span>{cat.label}</span>
                          <span className="text-slate-500">{cat.items.length} Calculators</span>
                        </div>
                        {cat.items.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = currentPath === sub.path;
                          return (
                            <Link
                              key={sub.id}
                              to={sub.path}
                              className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                                isSubActive
                                  ? 'bg-cyan-950/70 border border-cyan-500/40 text-white'
                                  : 'hover:bg-white/[0.06] text-slate-300 hover:text-white'
                              }`}
                            >
                              <SubIcon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                                isSubActive ? 'text-cyan-400' : 'text-slate-400'
                              }`} />
                              <div className="overflow-hidden">
                                <div className="text-xs font-hud font-bold leading-tight flex items-center gap-1.5">
                                  <span>{sub.label}</span>
                                  {sub.badge && (
                                    <span className="text-[8px] px-1 py-0.2 rounded font-tek bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                      {sub.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-sans">
                                  {sub.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Quick Jump Command Palette Trigger */}
            {onOpenQuickJump && (
              <button
                onClick={onOpenQuickJump}
                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 transition-all cursor-pointer text-xs font-hud font-semibold shadow-sm shadow-cyan-950/40"
                title="Search and Jump to any tool (Press / or Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Quick Jump</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-black/40 border border-cyan-500/30 rounded text-[9px] font-mono text-cyan-200">
                  /
                </kbd>
              </button>
            )}
          </div>

          {/* Row 2: Contextual Subtool Strip (1-Click Switching between sibling tools) */}
          <div className="max-w-7xl mx-auto flex items-center gap-2 pt-1 border-t border-white/[0.04]">
            <span className="text-[10px] font-tek font-bold uppercase tracking-wider text-cyan-400/80 shrink-0 hidden sm:inline-block">
              {activeCategory.shortLabel} Tools:
            </span>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 touch-pan-x flex-1">
              {activeCategory.items.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = currentPath === sub.path || (sub.path === '/taming' && currentPath === '/') || currentPath.startsWith(sub.path + '/');

                return (
                  <Link
                    key={sub.id}
                    to={sub.path}
                    className={`px-2.5 py-1 rounded-lg text-xs font-hud flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      isSubActive
                        ? 'bg-cyan-500/25 border border-cyan-400/60 text-cyan-200 font-bold shadow-sm shadow-cyan-500/10'
                        : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <SubIcon className={`w-3 h-3 ${isSubActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{sub.label}</span>
                    {sub.badge && (
                      <span className="text-[8px] px-1 py-0.2 rounded font-tek bg-white/[0.06] text-slate-300">
                        {sub.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {activeCategory.items.length === 1 && (
                <span className="text-[11px] text-slate-500 font-sans italic hidden sm:inline">
                  Audio starve & incubation alarms active in background
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tool Quick Grid Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-cyan-500/30 bg-[#070d18] px-3 py-4 shadow-2xl overflow-hidden space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[11px] font-tek font-bold text-cyan-300 uppercase tracking-wider">
                PK ULTIMATE GUIDE // ALL TOOLS
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Hub Link */}
            <Link
              to="/library"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/80 to-purple-950/80 border border-white/20 flex items-center justify-between text-xs font-hud font-bold text-white"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Browse Full Library Hub</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300">All Games ➔</span>
            </Link>

            {/* Quick Search in Drawer */}
            {onOpenQuickJump && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuickJump();
                }}
                className="w-full p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 flex items-center justify-between text-xs font-hud font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Search All Calculators & Dinos...</span>
                </div>
                <span className="text-[10px] font-mono bg-cyan-500/20 px-1.5 py-0.5 rounded">Jump</span>
              </button>
            )}

            {/* ARK Categorized Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-hud font-bold text-cyan-300">
                <span className="font-tek text-cyan-400">◈</span>
                <span>ARK SURVIVAL ASCENDED // 5 SECTIONS</span>
              </div>

              {ARK_CATEGORIES.map((cat) => (
                <div key={cat.id} className="space-y-1.5 bg-[#081120] p-2.5 rounded-xl border border-white/[0.06]">
                  <div className="text-[11px] font-tek font-bold text-cyan-400 flex items-center justify-between uppercase">
                    <span>{cat.label}</span>
                    <span className="text-[9px] text-slate-500">{cat.items.length} tools</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {cat.items.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = currentPath === tab.path;

                      return (
                        <Link
                          key={tab.id}
                          to={tab.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`p-2 rounded-lg border text-left flex items-start gap-2 transition-all ${
                            isActive
                              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                              : 'bg-[#0a1220] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-cyan-400" />
                          <div className="overflow-hidden">
                            <div className="text-xs font-hud font-bold leading-tight truncate">
                              {tab.label}
                            </div>
                            {tab.desc && (
                              <div className="text-[9px] text-slate-400 font-sans truncate mt-0.5">
                                {tab.desc}
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Minecraft Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-hud font-bold text-purple-300">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span>MINECRAFT 1.21+ GUIDES</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {MINECRAFT_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentPath === tab.path;

                  return (
                    <Link
                      key={tab.id}
                      to={tab.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-2 rounded-xl border text-left flex items-start gap-2 transition-all ${
                        isActive
                          ? 'bg-purple-950/80 border-purple-400 text-purple-200'
                          : 'bg-[#0f081c] border-purple-500/20 text-slate-300 hover:border-purple-500/40'
                      }`}
                    >
                      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-purple-400" />
                      <div className="overflow-hidden">
                        <div className="text-xs font-hud font-bold leading-tight truncate">
                          {tab.label}
                        </div>
                        {tab.badge && (
                          <div className="text-[9px] text-purple-300 font-mono mt-0.5 truncate">
                            {tab.badge}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Footer inside Mobile Drawer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-xs font-hud">
              <div className="flex items-center gap-1.5">
                <a
                  href="https://discord.gg/4ruEbqZSKT"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#8ea1e1] font-bold flex items-center gap-1.5 text-[11px]"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Discord</span>
                </a>

                {onOpenAbout && (
                  <button
                    onClick={() => {
                      onOpenAbout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center gap-1 text-[11px]"
                  >
                    <Info className="w-3 h-3" />
                    <span>About</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onOpenCustomRates();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1 text-[11px]"
                >
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>Rates</span>
                </button>
              </div>

              {onReplayIntro && (
                <button
                  onClick={() => {
                    onReplayIntro();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-tek text-[11px] flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Intro</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
