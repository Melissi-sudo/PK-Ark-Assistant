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
  Swords,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServerRatePreset } from '../types';
import { SERVER_PRESETS } from '../data/presets';
import { playTekAlarmSound } from '../utils/audioAlert';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

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
  
  // Game mode: 'library' | 'ark' | 'minecraft' | 'terraria' | 'rust'
  const isRust = currentPath.startsWith('/rust');
  const isMinecraft = currentPath.startsWith('/minecraft');
  const isTerraria = currentPath.startsWith('/terraria') || currentPath.startsWith('/bosses') || currentPath.startsWith('/evil') || currentPath.startsWith('/terraria-guide');
  const isLibrary = currentPath === '/' || currentPath === '/library' || currentPath === '/about';
  const isArk = !isMinecraft && !isTerraria && !isRust && !isLibrary;

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
    <header className={`sticky top-0 z-40 backdrop-blur-xl transition-all ${
      isLibrary
        ? 'bg-white/95 dark:bg-black/90 border-b border-gray-200 dark:border-[#2c2c2e] text-[#111827] dark:text-[#f5f5f7]'
        : isArk
        ? 'bg-[#060c18]/90 border-b border-cyan-500/30 text-white'
        : isMinecraft
        ? 'bg-[#0d091a]/90 border-b border-purple-500/30 text-white'
        : isTerraria
        ? 'bg-[#05110a]/90 border-b border-emerald-500/30 text-white'
        : 'bg-[#120a06]/90 border-b border-orange-500/30 text-white'
    }`}>
      {/* Top Bar: Brand, Game Switcher, Presets, Sound, Sync & PK Store */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 min-h-[52px]">
        {/* Left: Sidebar Toggle + Brand Identity */}
        <div className="flex items-center gap-2 shrink-0 select-none">
          <button
            onClick={onOpenSidebar}
            className={`w-8 h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              isLibrary
                ? 'bg-gray-100 hover:bg-gray-200 dark:bg-[#1c1c1e] dark:hover:bg-[#2c2c2e] border-gray-200 dark:border-[#2c2c2e] text-[#111827] dark:text-[#f5f5f7]'
                : isArk
                ? 'bg-cyan-950/60 hover:bg-cyan-900/60 border-cyan-500/40 text-cyan-300'
                : isMinecraft
                ? 'bg-purple-950/60 hover:bg-purple-900/60 border-purple-500/40 text-purple-300'
                : isTerraria
                ? 'bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300'
                : 'bg-orange-950/60 hover:bg-orange-900/60 border-orange-500/40 text-orange-300'
            }`}
            title="Open Tactical Navigation Sidebar"
            aria-label="Open Sidebar Navigation"
          >
            <Compass className="w-4 h-4" />
          </button>

          <Link 
            to="/library"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none rounded-xl py-0.5"
            title="PK Ultimate Guide - Tactical Game Library"
          >
            <div className={`relative flex items-center justify-center h-7 sm:h-8 w-auto min-w-[30px] rounded-lg border shrink-0 px-1.5 py-0.5 overflow-hidden ${
              isLibrary 
                ? 'bg-gray-100 dark:bg-[#1c1c1e] border-gray-200 dark:border-[#2c2c2e]' 
                : 'bg-black/40 border-white/10'
            }`}>
              <img 
                src="/logo.png?v=pk-v3" 
                alt="PK Ultimate Guide Logo" 
                className="h-full w-auto max-w-[110px] object-contain group-hover:scale-105 transition-transform duration-200" 
              />
            </div>

            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap transition-colors ${
                  isLibrary 
                    ? 'font-sf-display text-[#111827] dark:text-white group-hover:text-[#0066cc]' 
                    : isArk
                    ? 'font-hud text-white group-hover:text-cyan-400'
                    : isMinecraft
                    ? 'font-hud text-white group-hover:text-purple-400'
                    : isTerraria
                    ? 'font-hud text-white group-hover:text-emerald-400'
                    : 'font-hud text-white group-hover:text-orange-400'
                }`}>
                  PK Ultimate Guide
                </span>
              </div>
              <div className={`flex items-center gap-1 text-[10px] ${
                isLibrary ? 'text-[#4b5563] dark:text-[#9ca3af] font-sf-text font-medium' : 'text-slate-400 font-tek'
              }`}>
                <span>The Pitsoni Empire</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center / Game Switcher Tabs */}
        <nav 
          aria-label="Active Game Switcher"
          className={`hidden md:flex items-center p-1 rounded-full text-xs font-sf-text shrink-0 h-9 select-none mx-auto border transition-colors ${
            isLibrary
              ? 'bg-gray-100 dark:bg-[#1c1c1e] border-gray-200 dark:border-[#2c2c2e]'
              : isArk
              ? 'bg-[#0a1526]/80 border-cyan-500/30'
              : isMinecraft
              ? 'bg-[#140c24]/80 border-purple-500/30'
              : isTerraria
              ? 'bg-[#081a10]/80 border-emerald-500/30'
              : 'bg-[#1c1008]/80 border-orange-500/30'
          }`}
        >
          <Link
            to="/library"
            className={`h-7 px-3 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs ${
              isLibrary
                ? 'bg-white dark:bg-[#2c2c2e] text-[#111827] dark:text-white font-bold shadow-sm border border-gray-200/80 dark:border-[#3a3a3c]'
                : 'text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white font-medium'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Library</span>
          </Link>

          <Link
            to="/taming"
            className={`h-7 px-3 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs ${
              isArk
                ? 'bg-cyan-500/25 border border-cyan-400/60 text-cyan-200 font-bold shadow-sm shadow-cyan-500/10'
                : isLibrary
                ? 'text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>ARK</span>
            <span className="hidden xl:inline text-[11px] opacity-70">Ascended</span>
          </Link>

          <Link
            to="/minecraft/portal"
            className={`h-7 px-3 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs ${
              isMinecraft
                ? 'bg-purple-500/25 border border-purple-400/60 text-purple-200 font-bold shadow-sm shadow-purple-500/10'
                : isLibrary
                ? 'text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Minecraft</span>
            <span className="hidden xl:inline text-[11px] opacity-70">1.21+</span>
          </Link>

          <Link
            to="/terraria"
            className={`h-7 px-3 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs ${
              isTerraria
                ? 'bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 font-bold shadow-sm shadow-emerald-500/10'
                : isLibrary
                ? 'text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Terraria</span>
            <span className="hidden xl:inline text-[11px] opacity-70">1.4.4+</span>
          </Link>

          <Link
            to="/rust"
            className={`h-7 px-3 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs ${
              isRust
                ? 'bg-orange-500/25 border border-orange-400/60 text-orange-200 font-bold shadow-sm shadow-orange-500/10'
                : isLibrary
                ? 'text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bomb className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>Rust</span>
            <span className="hidden xl:inline text-[11px] opacity-70">Tactical</span>
          </Link>
        </nav>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 justify-end flex-nowrap">
          {/* Server Preset Dropdown & Customizer (Shown on ARK pages) */}
          {isArk && (
            <div className="flex items-center gap-1 shrink-0">
              <div className="relative flex items-center bg-[#f5f5f7] hover:bg-[#e6e6e8] border border-[#e6e6e8] rounded-full px-2.5 py-1 text-xs text-[#1d1d1f] transition-colors shrink-0">
                <Globe className="w-3.5 h-3.5 text-[#707070] mr-1.5 shrink-0" />
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
                  className="bg-transparent font-medium text-[#1d1d1f] text-[11px] sm:text-xs focus:outline-none cursor-pointer pr-3.5 max-w-[85px] sm:max-w-[110px] xl:max-w-[130px] truncate"
                >
                  {SERVER_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id} className="bg-white text-[#1d1d1f]">
                      {preset.name} ({preset.badge})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-2.5 h-2.5 text-[#707070] pointer-events-none absolute right-1.5" />
              </div>

              {/* Configure / Edit Rates Button */}
              <button
                onClick={onOpenCustomRates}
                title={currentPreset.id === 'custom' ? 'Customize server multipliers (Active Custom Preset)' : 'Customize ARK server multipliers'}
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-full border border-[#e6e6e8] hover:border-[#86868b] bg-[#f5f5f7] hover:bg-[#e6e6e8] text-[#1d1d1f] transition-all cursor-pointer flex items-center gap-1 text-xs shrink-0"
              >
                <Sliders className="w-3.5 h-3.5 text-[#707070] shrink-0" />
                <span className="hidden 2xl:inline text-[11px] font-medium">Rates</span>
              </button>
            </div>
          )}

          {/* Sound Alarm Toggle */}
          <button
            onClick={() => {
              if (!soundEnabled) {
                setSoundEnabled(true);
                playTekAlarmSound();
              } else {
                setSoundEnabled(false);
              }
            }}
            title={soundEnabled ? 'Alarm Sound: Enabled (Click to Mute)' : 'Alarm Sound: Muted (Click to Enable)'}
            className={`w-8 h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              soundEnabled
                ? 'bg-white dark:bg-[#2c2c2e] border-gray-200 dark:border-[#3a3a3c] text-[#0071e3] shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-[#1c1c1e] dark:hover:bg-[#2c2c2e] border-gray-200 dark:border-[#2c2c2e] text-[#4b5563] dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#0071e3]" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* User Account / Sync (Apple Pricing Blue pill) */}
          <button
            onClick={onOpenAuthModal}
            className="apple-pill-blue flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Survivor Account Profile & Cloud Sync"
          >
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentUser ? 'bg-[#34c759]' : 'bg-white/80'}`} />
            <span className="hidden sm:inline max-w-[80px] md:max-w-[100px] truncate text-xs font-semibold">
              {profile?.displayName || accountName || 'Sign In'}
            </span>
          </button>

          {/* Theme Mode Switcher */}
          <ThemeToggle />

          {/* About / Methodology Button */}
          <Link
            to="/about"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              currentPath === '/about'
                ? 'bg-[#0066cc] text-white shadow-sm'
                : 'apple-pill-outline'
            }`}
            title="Read Verification Methodology & About PK Guides"
          >
            <Info className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
            <span>About</span>
          </Link>

          {/* Official Discord Server Button */}
          <a
            href="https://discord.gg/4ruEbqZSKT"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-pill-outline hidden sm:inline-flex items-center gap-1.5 shrink-0"
            title="Join the Official Discord Server"
          >
            <svg className="w-3.5 h-3.5 fill-current text-[#5865F2]" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
          </a>

          {/* Mobile All-Tools Grid Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#1c1c1e] dark:hover:bg-[#2c2c2e] border border-gray-200 dark:border-[#2c2c2e] text-[#111827] dark:text-white flex items-center justify-center cursor-pointer shrink-0"
            title="Open all tools menu"
            aria-label="Open all tools menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>
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
            className={`md:hidden px-3 py-4 shadow-2xl overflow-hidden space-y-4 max-h-[85vh] overflow-y-auto border-t transition-colors ${
              isLibrary
                ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] border-[#e6e6e8] dark:border-[#2c2c2e]'
                : 'bg-[#070d18] text-white border-cyan-500/30'
            }`}
          >
            <div className={`flex items-center justify-between pb-2 border-b ${
              isLibrary ? 'border-[#e6e6e8] dark:border-[#2c2c2e]' : 'border-white/10'
            }`}>
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                isLibrary ? 'text-[#707070] dark:text-[#86868b] font-sf-display' : 'text-cyan-300 font-tek'
              }`}>
                PK Ultimate Guide // All Tools
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs cursor-pointer ${
                  isLibrary ? 'text-[#707070] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Close
              </button>
            </div>

            {/* Hub Link */}
            <Link
              to="/library"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold transition-colors ${
                isLibrary
                  ? 'bg-[#f5f5f7] dark:bg-[#2c2c2e] border-[#e6e6e8] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7]'
                  : 'bg-gradient-to-r from-cyan-950/80 to-purple-950/80 border-white/20 text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0066cc] dark:text-cyan-400" />
                <span>Browse Full Library Hub</span>
              </div>
              <span className="text-[10px] font-medium text-[#0066cc] dark:text-cyan-300">All Games ➔</span>
            </Link>

            {/* Quick Search in Drawer */}
            {onOpenQuickJump && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuickJump();
                }}
                className={`w-full p-2.5 rounded-2xl border flex items-center justify-between text-xs font-semibold cursor-pointer transition-colors ${
                  isLibrary
                    ? 'bg-[#f5f5f7] dark:bg-[#2c2c2e] border-[#e6e6e8] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7]'
                    : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#0066cc] dark:text-cyan-400" />
                  <span>Search All Calculators & Dinos...</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isLibrary ? 'bg-white dark:bg-black/30 text-[#0066cc] dark:text-cyan-300' : 'bg-cyan-500/20 text-cyan-300'
                }`}>Jump</span>
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

            {/* Terraria Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-hud font-bold text-emerald-300">
                <Swords className="w-3.5 h-3.5 text-emerald-400" />
                <span>TERRARIA 1.4.4+ LABOR OF LOVE</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { path: '/terraria/matrix', label: '18-Boss Health Matrix', badge: '18 BOSSES' },
                  { path: '/terraria/bosses', label: 'Boss Progression Checklist', badge: 'CHECKLIST' },
                  { path: '/terraria/evil', label: 'Quarantine & Purification', badge: 'SPREAD' },
                  { path: '/terraria/ores', label: 'Ore Depths & Shimmer', badge: 'DEPTHS' },
                  { path: '/terraria/biomes', label: 'Biome Pylons & Fishing', badge: 'PYLONS' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl border border-emerald-500/20 bg-[#06140b] text-slate-300 hover:border-emerald-400 text-left flex items-start gap-2"
                  >
                    <Swords className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-hud font-bold leading-tight truncate text-emerald-200">
                        {item.label}
                      </div>
                      <div className="text-[9px] text-emerald-400 font-mono mt-0.5 truncate">
                        {item.badge}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Rust Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-hud font-bold text-orange-300">
                <Bomb className="w-3.5 h-3.5 text-orange-400" />
                <span>RUST TACTICAL SUITE // RAID & COMBAT</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { path: '/rust/raid', label: 'Raid Cost & Raw Sulfur', badge: 'C4 & ROCKETS' },
                  { path: '/rust/upkeep', label: 'Base Upkeep & TC Decay', badge: 'TAX CURVE' },
                  { path: '/rust/combat', label: 'Combat TTK & Ballistics', badge: '1-TAP HEADSHOT' },
                  { path: '/rust/techtree', label: 'Tech Tree & Scrap Plan', badge: 'WORKBENCH 1-3' },
                  { path: '/rust/monuments', label: 'Monuments & Recycler', badge: 'KEYCARDS' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl border border-orange-500/20 bg-[#120a06] text-slate-300 hover:border-orange-400 text-left flex items-start gap-2"
                  >
                    <Bomb className="w-3.5 h-3.5 mt-0.5 shrink-0 text-orange-400" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-hud font-bold leading-tight truncate text-orange-200">
                        {item.label}
                      </div>
                      <div className="text-[9px] text-orange-400 font-mono mt-0.5 truncate">
                        {item.badge}
                      </div>
                    </div>
                  </Link>
                ))}
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

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-cyan-950/40 border border-gray-200 dark:border-cyan-500/30 text-[#111827] dark:text-cyan-300 flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Info className="w-3.5 h-3.5 text-[#0066cc] dark:text-cyan-400" />
                  <span>About</span>
                </Link>

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
