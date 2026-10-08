import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  Gamepad2, 
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
  Flame, 
  Sliders, 
  BookOpen, 
  ShoppingBag, 
  Info, 
  Sparkles,
  ExternalLink,
  Keyboard,
  Compass
} from 'lucide-react';
import { ServerRatePreset } from '../types';

interface SidebarNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreset: ServerRatePreset;
  onOpenCustomRates: () => void;
  onOpenStoreModal?: () => void;
  onOpenShortcuts: () => void;
  onOpenQuickJump: () => void;
  onOpenAbout: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isOpen,
  onClose,
  currentPreset,
  onOpenCustomRates,
  onOpenStoreModal,
  onOpenShortcuts,
  onOpenQuickJump,
  onOpenAbout
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [arkOpen, setArkOpen] = useState(true);
  const [mcOpen, setMcOpen] = useState(true);

  if (!isOpen) return null;

  const isActive = (path: string) => {
    if (path === '/taming' && currentPath === '/') return true;
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Sidebar Drawer */}
        <motion.aside
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="relative w-80 max-w-[85vw] h-full bg-[#050914] border-r border-cyan-500/30 shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Top Brand Header */}
          <div className="p-4 border-b border-white/[0.08] bg-[#070e1c] flex items-center justify-between">
            <Link 
              to="/library" 
              onClick={onClose}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center p-1 shadow-md shadow-cyan-500/20">
                <img src="/logo.png?v=pk-v3" alt="PK Logo" className="h-full w-auto object-contain" />
              </div>
              <div>
                <div className="text-xs font-hud font-bold text-white group-hover:text-cyan-300 transition-colors">
                  PK ULTIMATE <span className="text-cyan-400">GUIDE</span>
                </div>
                <div className="text-[10px] text-slate-400 font-tek">
                  TACTICAL NAVIGATION HUB
                </div>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close sidebar navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Jump Search Button in Sidebar */}
          <div className="p-3 border-b border-white/[0.06] bg-[#040810]">
            <button
              onClick={() => {
                onClose();
                onOpenQuickJump();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#091222] hover:bg-cyan-950/60 border border-cyan-500/30 text-xs font-hud text-slate-300 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quick Jump Search...</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-cyan-400">
                /
              </span>
            </button>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
            {/* Library Home */}
            <Link
              to="/library"
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-hud font-bold transition-all ${
                currentPath === '/' || currentPath === '/library'
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Game Library Home</span>
            </Link>

            {/* SECTION 1: ARK SURVIVAL ASCENDED */}
            <div className="space-y-1">
              <button
                onClick={() => setArkOpen(!arkOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-tek text-cyan-400">◈</span>
                  <span>ARK Ascended</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
                    10 Tools
                  </span>
                </div>
                {arkOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {arkOpen && (
                <div className="space-y-0.5 pl-2 border-l border-cyan-500/20 ml-2 mt-1">
                  {[
                    { path: '/taming', label: 'Taming & Starve Engine', icon: Crosshair, badge: 'AUTO' },
                    { path: '/pyromane', label: 'Pyromane 30s Fire Ride', icon: Flame, badge: 'DLC' },
                    { path: '/soakers', label: 'Turret Soakers & Hitbox', icon: ShieldAlert, badge: 'PVP' },
                    { path: '/raiding', label: 'HP vs C4 Raid Math', icon: Bomb, badge: 'C4' },
                    { path: '/resources', label: 'Tribe Ammo & Gunpowder', icon: ShieldCheck, badge: 'QUOTA' },
                    { path: '/breeding', label: 'Breeding & Nursery', icon: Egg },
                    { path: '/stats', label: 'Dino Stat Extractor', icon: Search },
                    { path: '/maps', label: '5 Interactive Resource Maps', icon: Map, badge: 'MAPS' },
                    { path: '/kibble', label: 'Kibble Matrix & Recipes', icon: Utensils },
                    { path: '/timers', label: 'War Room TEK Alarms', icon: Timer, badge: 'AUDIO' }
                  ].map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-hud transition-all ${
                          active
                            ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-tek font-bold px-1 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2: MINECRAFT 1.21+ */}
            <div className="space-y-1">
              <button
                onClick={() => setMcOpen(!mcOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-purple-400" />
                  <span>Minecraft 1.21+</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 border border-purple-400/30 text-purple-300">
                    7 Tools
                  </span>
                </div>
                {mcOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {mcOpen && (
                <div className="space-y-0.5 pl-2 border-l border-purple-500/20 ml-2 mt-1">
                  {[
                    { path: '/minecraft/portal', label: 'Nether Portal 3D Linker', icon: Flame, badge: '3D' },
                    { path: '/minecraft/potions', label: '1.21 Potion Brewing Matrix', icon: Beaker, badge: '1.21' },
                    { path: '/minecraft/ores', label: 'Ore Elevation & Diamonds', icon: Pickaxe, badge: 'Y: -58' },
                    { path: '/minecraft/villagers', label: '1-Emerald Villager Trades', icon: Users, badge: 'TRADES' },
                    { path: '/minecraft/redstone', label: 'Redstone Logic & Clocks', icon: Cpu },
                    { path: '/minecraft/enchanting', label: 'Anvil Optimizer & Mace', icon: Hammer, badge: 'MACE' },
                    { path: '/minecraft/mobs', label: 'Mob AI & Trial Chambers', icon: Skull }
                  ].map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-hud transition-all ${
                          active
                            ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-purple-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-tek font-bold px-1 py-0.2 rounded bg-purple-950 border border-purple-500/30 text-purple-400">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 3: UTILITIES & ENGINE CONFIG */}
            <div className="pt-2 border-t border-white/[0.08] space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider">
                Tactical Utilities & Engine
              </div>

              {/* Configure ARK Rates Button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenCustomRates();
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#091322] hover:bg-cyan-950/60 border border-cyan-500/30 text-xs font-hud text-cyan-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Configure Server Rates</span>
                </div>
                <span className="text-[10px] font-tek font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {currentPreset.badge}
                </span>
              </button>

              {/* About & Methodology */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAbout();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-hud text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>About & Methodology</span>
              </button>

              {/* Keyboard Shortcuts */}
              <button
                onClick={() => {
                  onClose();
                  onOpenShortcuts();
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-hud text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Shortcuts Cheat Sheet</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">[?]</span>
              </button>

              {/* Official Discord Server */}
              <a
                href="https://discord.gg/4ruEbqZSKT"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/40 text-xs font-hud font-bold text-[#8ea1e1] hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Official Discord Community</span>
                </div>
                <ExternalLink className="w-3 h-3 text-[#8ea1e1]" />
              </a>
            </div>
          </div>

          {/* Footer Social & Empire Credit */}
          <div className="p-3 border-t border-white/[0.08] bg-[#040810] flex items-center justify-between text-[11px] font-hud text-slate-400">
            <div className="flex items-center gap-2">
              <a
                href="https://www.tiktok.com/@pkguides"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                title="Follow PK Guides on TikTok"
              >
                <span className="text-pink-400 font-bold">♪</span>
                <span>TikTok</span>
              </a>
              <span>•</span>
              <a
                href="https://discord.gg/4ruEbqZSKT"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-300 transition-colors flex items-center gap-1"
                title="Join Official Discord Server (discord.gg/4ruEbqZSKT)"
              >
                <span className="text-indigo-400 font-bold">◈</span>
                <span>Official Discord</span>
              </a>
            </div>
            <span className="text-[10px] text-slate-400 font-tek">THE PITSONI EMPIRE</span>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
