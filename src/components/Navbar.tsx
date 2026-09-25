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
  Layers
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
  onOpenStoreModal: () => void;
  onOpenAuthModal: () => void;
  onReplayIntro?: () => void;
  onOpenKeyboardShortcuts?: () => void;
}

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
  { id: 'pyromane', path: '/pyromane', label: 'Pyromane Guide', icon: Flame, badge: '30s Ride', accent: 'amber', desc: 'Water luring & 30s simulator' },
  { id: 'maps', path: '/maps', label: 'Resource Maps', icon: Map, badge: '5 MAPS', accent: 'cyan', desc: 'Interactive metal, silica & oil nodes' },
  { id: 'breeding', path: '/breeding', label: 'Breeding', icon: Egg, desc: 'Incubation, gestation & imprint timers' },
  { id: 'resources', path: '/resources', label: 'Tribe Ammo', icon: ShieldCheck, desc: 'Heavy turret bullets & gunpowder quota' },
  { id: 'stats', path: '/stats', label: 'Dino Stats', icon: Search, desc: 'Extract wild levels & mutation points' },
  { id: 'timers', path: '/timers', label: 'Alarms', icon: Timer, desc: 'Starve & hatch TEK alarms' },
  { id: 'store', path: '/store', label: 'PK Store', icon: ShoppingBag, badge: 'DISCORD', accent: 'amber', desc: 'Official Small Tribes lines & vault gear' },
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
  onOpenKeyboardShortcuts
}) => {
  const { currentUser, profile, accountName } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  
  // Game mode: 'library' | 'ark' | 'minecraft'
  const isMinecraft = currentPath.startsWith('/minecraft');
  const isLibrary = currentPath === '/' || currentPath === '/library';
  const isArk = !isMinecraft && !isLibrary;

  const activeTabsList = isMinecraft ? MINECRAFT_TABS : ARK_TABS;

  return (
    <header className="sticky top-0 z-40 bg-[#050914]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl">
      {/* Top Bar: Brand, Game Switcher, Presets, Sound, Sync & PK Store */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <Link 
          to="/library"
          className="flex items-center gap-2 sm:gap-3 shrink-0 group focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl p-0.5"
          title="PK Ultimate Guide - Tactical Game Library"
        >
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-950 via-[#071324] to-[#040913] border border-cyan-400/40 shadow-md shadow-cyan-500/20 shrink-0 group-hover:border-cyan-400 transition-colors">
            <span className="text-cyan-300 font-tek font-bold text-base sm:text-lg drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">◈</span>
            <div className="absolute inset-0 bg-cyan-400/10 rounded-xl animate-pulse pointer-events-none" />
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
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          {/* Server Preset Dropdown (Shown on ARK pages) */}
          {isArk && (
            <div className="relative flex items-center bg-[#09101d] hover:bg-[#0c1628] border border-white/[0.08] hover:border-cyan-500/40 rounded-xl px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs text-slate-200 transition-colors">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 mr-1 shrink-0" />
              <select
                value={currentPreset.id}
                onChange={(e) => {
                  const found = SERVER_PRESETS.find(p => p.id === e.target.value);
                  if (found) setCurrentPreset(found);
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

          {/* PK Store Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenStoreModal}
            className="px-2 py-1 sm:px-2.5 sm:py-1.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-hud font-bold tracking-wide flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-amber-500/10"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs">STORE</span>
          </motion.button>

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
        <div className="relative border-t border-white/[0.06] bg-[#040711]/90 px-2 sm:px-6 py-1">
          <nav 
            role="tablist" 
            aria-label="Game Guide Navigation" 
            className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-1.5 overflow-x-auto text-xs no-scrollbar py-0.5 touch-pan-x"
          >
            {/* Quick Back to Library Link */}
            <Link
              to="/library"
              className="px-2 sm:px-2.5 py-1.5 text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-hud text-xs shrink-0 mr-1"
              title="Return to Multi-Game Library"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Library</span>
            </Link>

            <span className="h-4 w-[1px] bg-white/10 shrink-0 mr-1" />

            {ARK_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentPath === tab.path || (tab.path === '/taming' && currentPath === '/') || currentPath.startsWith(tab.path + '/');

              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  className={`relative px-2.5 sm:px-3 py-1.5 rounded-xl font-hud font-semibold text-xs tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[38px] ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Animated active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-950/80 via-[#0c1f38] to-cyan-950/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] -z-0"
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${
                      isActive 
                        ? 'text-cyan-400'
                        : 'text-slate-400'
                    }`} />
                    <span>{tab.label}</span>

                    {/* Badge */}
                    {tab.badge && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-tek font-bold ${
                        tab.accent === 'amber'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {tab.badge}
                      </span>
                    )}

                    {/* Timer Count Badge */}
                    {tab.id === 'timers' && activeTimersCount > 0 && (
                      <span className={`px-1.5 py-0.2 text-[10px] font-tek font-bold rounded-full ${
                        hasExpiringTimers 
                          ? 'bg-red-500 text-white animate-bounce' 
                          : 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {activeTimersCount}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
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

            {/* ARK Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-hud font-bold text-cyan-300">
                <span className="font-tek text-cyan-400">◈</span>
                <span>ARK SURVIVAL ASCENDED WAR ROOM</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {ARK_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentPath === tab.path;

                  return (
                    <Link
                      key={tab.id}
                      to={tab.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-2 rounded-xl border text-left flex items-start gap-2 transition-all ${
                        isActive
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                          : 'bg-[#0a1220] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" />
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

            {/* Quick Actions Footer inside Mobile Drawer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-hud">
              <button
                onClick={() => {
                  onOpenStoreModal();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 text-[11px]"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Open PK Store</span>
              </button>

              {onReplayIntro && (
                <button
                  onClick={() => {
                    onReplayIntro();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-tek text-[11px] flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Replay Intro</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
