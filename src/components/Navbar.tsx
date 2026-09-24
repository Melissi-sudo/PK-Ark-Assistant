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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ServerRatePreset } from '../types';
import { SERVER_PRESETS } from '../data/presets';
import { playTekAlarmSound } from '../utils/audioAlert';
import { useAuth } from '../context/AuthContext';

export type NavTab = 'taming' | 'soakers' | 'pyromane' | 'breeding' | 'maps' | 'resources' | 'stats' | 'timers' | 'store';

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
  id: NavTab;
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  accent?: 'cyan' | 'amber' | 'emerald' | 'red';
  desc?: string;
}

export const TABS: TabItem[] = [
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

  // Determine active tab based on current pathname
  const currentPath = location.pathname;
  const activeTab: NavTab = (() => {
    if (currentPath === '/' || currentPath.startsWith('/taming')) return 'taming';
    if (currentPath.startsWith('/soakers')) return 'soakers';
    if (currentPath.startsWith('/pyromane')) return 'pyromane';
    if (currentPath.startsWith('/maps')) return 'maps';
    if (currentPath.startsWith('/breeding')) return 'breeding';
    if (currentPath.startsWith('/resources') || currentPath.startsWith('/ammo')) return 'resources';
    if (currentPath.startsWith('/stats')) return 'stats';
    if (currentPath.startsWith('/timers')) return 'timers';
    if (currentPath.startsWith('/store')) return 'store';
    return 'taming';
  })();

  // Arrow key navigation across tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % TABS.length;
      navigate(TABS[nextIndex].path);
      const nextEl = document.getElementById(`tab-${TABS[nextIndex].id}`);
      nextEl?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + TABS.length) % TABS.length;
      navigate(TABS[prevIndex].path);
      const prevEl = document.getElementById(`tab-${TABS[prevIndex].id}`);
      prevEl?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050914]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl">
      {/* Top Bar: Brand, Empire Tag, Server Preset, Sound, Sync & PK Store */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Left: Brand Identity (Clicking returns to Home / Taming) */}
        <Link 
          to="/taming"
          className="flex items-center gap-2 sm:gap-3 shrink-0 group focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl p-0.5"
          title="Return to Taming & War Room Home"
        >
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-950 via-[#071324] to-[#040913] border border-cyan-400/40 shadow-md shadow-cyan-500/20 shrink-0 group-hover:border-cyan-400 transition-colors">
            <span className="text-cyan-300 font-tek font-bold text-base sm:text-lg drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">◈</span>
            <div className="absolute inset-0 bg-cyan-400/10 rounded-xl animate-pulse pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-base font-bold font-tek text-slate-100 tracking-wider flex items-center gap-1 group-hover:text-cyan-300 transition-colors">
                PK ARK <span className="hidden xs:inline">ASSISTANT</span> <span className="text-cyan-400 text-[10px] sm:text-xs px-1 py-0.2 bg-cyan-500/10 border border-cyan-500/30 rounded font-mono">PVP</span>
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-tek font-semibold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-slate-700/60 rounded">
                Official Assistant
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

        {/* Right: Controls & Actions (Optimized for Mobile Touch) */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          {/* Server Preset Dropdown */}
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

          {/* User Account / Sync (Compact on Mobile) */}
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

          {/* Keyboard Accessibility Guide Button */}
          {onOpenKeyboardShortcuts && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenKeyboardShortcuts}
              title="Keyboard Shortcuts & Accessibility Guide (Press ?)"
              aria-label="Open keyboard shortcuts guide"
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 bg-[#09101d] text-cyan-300 hover:text-white flex items-center justify-center cursor-pointer transition-all shrink-0"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </motion.button>
          )}

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
            className="sm:hidden w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 text-cyan-300 flex items-center justify-center cursor-pointer"
            title="Open all tools menu"
            aria-label="Open all tools menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Dark-Modern Navigation Bar with Animated Pill Highlight & Horizontal Scroll */}
      <div className="relative border-t border-white/[0.06] bg-[#040711]/90 px-2 sm:px-6 py-1">
        {/* Mobile visual scroll cue edge indicators */}
        <div className="sm:hidden absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#040711] to-transparent pointer-events-none z-20" />
        <div className="sm:hidden absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#040711] to-transparent pointer-events-none z-20" />

        <nav 
          role="tablist" 
          aria-label="War Room Navigation" 
          className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-1.5 overflow-x-auto text-xs no-scrollbar py-0.5 touch-pan-x"
        >
          {TABS.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Link
                key={tab.id}
                to={tab.path}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                onClick={() => setMobileMenuOpen(false)}
                className={`relative px-2.5 sm:px-3 py-1.5 rounded-xl font-hud font-semibold text-xs tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[38px] ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {/* Animated active pill indicator using motion */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-950/80 via-[#0c1f38] to-cyan-950/80 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] -z-0"
                  />
                )}

                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${
                    isActive 
                      ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]' 
                      : tab.id === 'pyromane' ? 'text-amber-400/80' : 'text-slate-400'
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

      {/* Mobile Tool Quick Grid Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-t border-cyan-500/30 bg-[#070d18] px-3 py-3 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-tek font-bold text-cyan-300 uppercase tracking-wider">
                WAR ROOM QUICK TOOL SELECTOR
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                        : 'bg-[#0a1220] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <div className="overflow-hidden">
                      <div className="text-xs font-hud font-bold leading-tight flex items-center gap-1">
                        <span>{tab.label}</span>
                        {tab.badge && (
                          <span className="text-[8px] px-1 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-tek">
                            {tab.badge}
                          </span>
                        )}
                      </div>
                      {tab.desc && (
                        <div className="text-[10px] text-slate-400 font-sans truncate mt-0.5">
                          {tab.desc}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions Footer inside Mobile Drawer */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-hud">
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
