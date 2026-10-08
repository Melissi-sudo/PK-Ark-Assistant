/**
 * PK Ultimate Guide
 * Crafted by The Pitsoni Empire
 * Multi-Game Tactical Library: ARK Survival Ascended & Minecraft 1.21+
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { TamingCalculator } from './components/TamingCalculator';
import { TurretSoakerGuide } from './components/TurretSoakerGuide';
import { PyromaneTamingGuide } from './components/PyromaneTamingGuide';
import { RaidExplosivesCalculator } from './components/RaidExplosivesCalculator';
import { ArkRecipeMatrix } from './components/ArkRecipeMatrix';
import { MatingCalculator } from './components/MatingCalculator';
import { TribeResourceHub } from './components/TribeResourceHub';
import { ResourceMaps } from './components/ResourceMaps';
import { DinoStatLookup } from './components/DinoStatLookup';
import { TimerManager } from './components/TimerManager';
import { ArkLoadingIntro } from './components/ArkLoadingIntro';
import { DailyArkTip } from './components/DailyArkTip';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { QuickJumpModal } from './components/QuickJumpModal';
import { NotFoundPage } from './components/NotFoundPage';
import { PageMetaSync } from './components/common/PageMetaSync';
import { LibraryHub } from './components/LibraryHub';
import { MinecraftHub } from './components/minecraft/MinecraftHub';
import { TerrariaHub } from './components/terraria/TerrariaHub';
import { CustomRatesModal } from './components/CustomRatesModal';
import { SidebarNavigation } from './components/SidebarNavigation';
import { Breadcrumbs } from './components/Breadcrumbs';
import { AboutMethodologyModal } from './components/AboutMethodologyModal';
import { AboutMethodologyPage } from './components/AboutMethodologyPage';
import { ServerRatePreset, ActiveTimer } from './types';
import { SERVER_PRESETS, getStoredCustomPreset } from './data/presets';
import { sendBrowserNotification, playTekAlarmSound } from './utils/audioAlert';
import { Shield, ExternalLink, Zap, Keyboard, BookOpen, Flame, Beaker, Pickaxe, Sliders, Compass, Info, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, doc, setDoc, getDoc } from './lib/firebase';

const LOCAL_STORAGE_TIMERS_KEY = 'ark_companion_active_timers_v1';
const LOCAL_STORAGE_PRESET_KEY = 'ark_companion_server_preset_v1';
const SESSION_INTRO_KEY = 'pk_intro_viewed_session';

function MainAppContent() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMinecraft = location.pathname.startsWith('/minecraft');
  const isTerraria = location.pathname.startsWith('/terraria');
  const isLibrary = location.pathname === '/' || location.pathname === '/library';
  const isArk = !isMinecraft && !isTerraria && !isLibrary;
  
  // Rate preset (default to Official Small Tribes, restore custom if chosen)
  const [currentPreset, setCurrentPreset] = useState<ServerRatePreset>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRESET_KEY);
      if (saved) {
        if (saved === 'custom') {
          return getStoredCustomPreset();
        }
        const found = SERVER_PRESETS.find(p => p.id === saved);
        if (found) return found;
      }
    }
    return SERVER_PRESETS[0]; // Official Small Tribes
  });

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals & Navigation Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState<boolean>(false);
  const [isCustomRatesOpen, setIsCustomRatesOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  
  // Holographic Boot Intro Sequence
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Timers
  const [timers, setTimers] = useState<ActiveTimer[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_TIMERS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    // Default initial demonstration alarms
    return [
      {
        id: 'timer-demo-1',
        title: 'Starve Alarm: Tek Stegosaurus (Lvl 150)',
        creatureName: 'Tek Stegosaurus',
        type: 'tame_starve',
        targetTimestamp: Date.now() + 24 * 60 * 1000,
        totalDurationSeconds: 24 * 60,
        notes: 'Starve timer for 16x Regular Kibble. Hit tail hitbox to soak without dismount.',
        soundAlerted: false
      },
      {
        id: 'timer-demo-2',
        title: 'Egg Hatch: Carcharodontosaurus',
        creatureName: 'Carcharodontosaurus',
        type: 'egg_hatch',
        targetTimestamp: Date.now() + 45 * 60 * 1000,
        totalDurationSeconds: 45 * 60,
        notes: 'Optimal temp 43-45°C. Keep raw meat inventory packed for baby hand-feed.',
        soundAlerted: false
      }
    ];
  });

  // Load cloud timers on login
  useEffect(() => {
    if (!currentUser) return;
    const fetchCloudTimers = async () => {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data()?.savedTimers) {
          const cloudTimers = snap.data().savedTimers as ActiveTimer[];
          if (cloudTimers && cloudTimers.length > 0) {
            setTimers(cloudTimers);
          }
        }
      } catch (e) {
        console.warn('Could not sync timers from Cloud, using local storage:', e);
      }
    };
    fetchCloudTimers();
  }, [currentUser]);

  // Current time tick for updating live counters every second
  const [, setTick] = useState<number>(Date.now());

  // Save preset
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRESET_KEY, currentPreset.id);
    } catch {
      // ignore
    }
  }, [currentPreset]);

  // Save timers locally and to Firestore if authenticated
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TIMERS_KEY, JSON.stringify(timers));
    } catch {
      // ignore
    }

    if (currentUser) {
      const syncToCloud = async () => {
        try {
          await setDoc(doc(db, 'users', currentUser.uid), {
            savedTimers: timers,
            lastTimerSync: Date.now()
          }, { merge: true });
        } catch {
          // ignore cloud write transient error
        }
      };
      syncToCloud();
    }
  }, [timers, currentUser]);

  // Second-by-second countdown and alarm trigger loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTick(now);

      // Check for freshly expired timers that haven't beeped yet
      setTimers(prevTimers => {
        let changed = false;
        const updated = prevTimers.map(timer => {
          if (timer.targetTimestamp <= now && !timer.soundAlerted) {
            changed = true;
            if (soundEnabled) {
              sendBrowserNotification(
                `🚨 ALERT: ${timer.title}`,
                timer.notes || 'Timer has expired! Return immediately.'
              );
              playTekAlarmSound();
            }
            return { ...timer, soundAlerted: true };
          }
          return timer;
        });
        return changed ? updated : prevTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const handleAddTimer = (newTimer: Omit<ActiveTimer, 'id'>) => {
    const timer: ActiveTimer = {
      ...newTimer,
      id: `timer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      soundAlerted: false
    };
    setTimers(prev => [timer, ...prev]);
    if (soundEnabled) {
      playTekAlarmSound();
    }
  };

  const handleDeleteTimer = (id: string) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const handleClearExpired = () => {
    const now = Date.now();
    setTimers(prev => prev.filter(t => t.targetTimestamp > now));
  };

  const hasExpiringTimers = timers.some(t => {
    const rem = t.targetTimestamp - Date.now();
    return rem <= 120000;
  });

  // Global Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (e.key === 'Escape') {
        setIsAuthModalOpen(false);
        setIsShortcutsModalOpen(false);
        setIsQuickJumpOpen(false);
        setIsCustomRatesOpen(false);
        setIsSidebarOpen(false);
        setIsAboutModalOpen(false);
        return;
      }

      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K'))) && !isInputActive) {
        e.preventDefault();
        setIsQuickJumpOpen(prev => !prev);
        return;
      }

      if (e.altKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
        return;
      }

      if (e.altKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        setIsCustomRatesOpen(prev => !prev);
        return;
      }

      if (e.key === '?' && !isInputActive) {
        e.preventDefault();
        setIsShortcutsModalOpen(prev => !prev);
        return;
      }

      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setSoundEnabled(prev => !prev);
        return;
      }

      if (e.altKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        setShowIntro(true);
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#040810] text-slate-100 flex flex-col bg-ark-grid relative">
      {/* Synchronize page document title & scroll to top on path change */}
      <PageMetaSync />

      {/* Specimen Holographic Boot Intro Sequence */}
      <AnimatePresence>
        {showIntro && (
          <ArkLoadingIntro
            key="ark-boot-intro"
            onComplete={() => {
              sessionStorage.setItem(SESSION_INTRO_KEY, 'true');
              setShowIntro(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* HUD Top Header & Multi-Game Switcher */}
      <Navbar
        currentPreset={currentPreset}
        setCurrentPreset={setCurrentPreset}
        activeTimersCount={timers.length}
        hasExpiringTimers={hasExpiringTimers}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
        onOpenKeyboardShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenQuickJump={() => setIsQuickJumpOpen(true)}
        onOpenCustomRates={() => setIsCustomRatesOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* Main Container */}
      <main 
        id="main-content" 
        tabIndex={-1} 
        aria-label="PK Ultimate Guide Main Display"
        className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 focus:outline-none"
      >
        {/* Tactical Hierarchical Breadcrumbs */}
        <Breadcrumbs />

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <Routes location={location}>
              {/* Library Home Route */}
              <Route path="/" element={<LibraryHub />} />
              <Route path="/library" element={<LibraryHub />} />

              {/* About & Methodology Route */}
              <Route path="/about" element={<AboutMethodologyPage />} />

              {/* Minecraft Hub Routes */}
              <Route path="/minecraft" element={<MinecraftHub />} />
              <Route path="/minecraft/:subtab" element={<MinecraftHub />} />

              {/* Terraria Hub Routes */}
              <Route path="/terraria" element={<TerrariaHub />} />
              <Route path="/terraria/:subtab" element={<TerrariaHub />} />

              {/* ARK Canonical & Game Routes */}
              <Route path="/ark" element={<Navigate to="/taming" replace />} />
              
              <Route
                path="/taming"
                element={
                  <TamingCalculator
                    currentPreset={currentPreset}
                    onAddTimer={handleAddTimer}
                    onViewSoakerGuide={() => navigate('/soakers')}
                    onViewPyromaneGuide={() => navigate('/pyromane')}
                  />
                }
              />

              <Route path="/soakers" element={<TurretSoakerGuide />} />

              <Route path="/raiding" element={<RaidExplosivesCalculator />} />

              <Route path="/kibble" element={<ArkRecipeMatrix />} />

              <Route path="/pyromane" element={<PyromaneTamingGuide />} />

              <Route
                path="/breeding"
                element={
                  <MatingCalculator
                    currentPreset={currentPreset}
                    onAddTimer={handleAddTimer}
                  />
                }
              />

              <Route
                path="/maps"
                element={<ResourceMaps />}
              />

              <Route
                path="/maps/:mapId"
                element={<ResourceMaps />}
              />

              <Route
                path="/resources"
                element={
                  <TribeResourceHub
                    currentPreset={currentPreset}
                  />
                }
              />

              <Route path="/ammo" element={<Navigate to="/resources" replace />} />

              <Route
                path="/stats"
                element={
                  <DinoStatLookup
                    onSelectForTaming={(cid) => {
                      navigate(`/taming?dino=${cid}`);
                    }}
                    onSelectForBreeding={(cid) => {
                      navigate(`/breeding?dino=${cid}`);
                    }}
                  />
                }
              />

              <Route
                path="/timers"
                element={
                  <TimerManager
                    timers={timers}
                    onDeleteTimer={handleDeleteTimer}
                    onClearExpired={handleClearExpired}
                    onAddTimer={handleAddTimer}
                    soundEnabled={soundEnabled}
                    setSoundEnabled={setSoundEnabled}
                  />
                }
              />

              <Route path="/store" element={<Navigate to="/" replace />} />

              {/* 404 Not Found Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        {/* Daily ARK Tip Component (shown when browsing ARK War Room) */}
        {isArk && (
          <DailyArkTip onNavigateTab={(tab) => navigate('/' + tab)} />
        )}
      </main>

      {/* Bottom Action Bar */}
      <aside className="sticky bottom-0 z-30 bg-[#060c18]/95 backdrop-blur-md border-t border-cyan-500/30 py-2 sm:py-2.5 px-3 sm:px-6 shadow-2xl pb-safe">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs font-hud">
          <div className="flex items-center gap-2 text-cyan-400 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-tek text-[11px] sm:text-xs tracking-wider text-slate-300 truncate">
              {isMinecraft ? (
                <>
                  <span className="text-emerald-400 font-bold font-minecraftia">MINECRAFT 1.21+</span> • BLOCKY COMPANION
                </>
              ) : isTerraria ? (
                <>
                  <span className="text-emerald-400 font-bold">TERRARIA 1.4.4+</span> • LABOR OF LOVE
                </>
              ) : isLibrary ? (
                <>
                  <span className="text-cyan-300 font-bold">PK ULTIMATE GUIDE</span> • GAME SELECTOR
                </>
              ) : (
                <>
                  <span className="hidden xs:inline">OFFICIAL </span>SMALL TRIBES • <span className="text-cyan-300">PVP META</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isMinecraft ? (
              <Link
                to="/library"
                className="mc-button px-3 py-1 text-[11px] sm:text-xs text-white uppercase font-bold flex items-center gap-1.5 cursor-pointer min-h-[34px]"
              >
                <span>GAME MENU</span>
              </Link>
            ) : (
              <Link
                to="/soakers"
                className="px-2.5 py-1.5 bg-[#0a1526] hover:bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 rounded-lg text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SOAKER </span><span>HITBOX</span>
              </Link>
            )}

            <a
              href="https://discord.gg/4ruEbqZSKT"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/50 text-[#8ea1e1] hover:text-white font-bold rounded-lg text-[11px] sm:text-xs transition-all shadow-md shadow-[#5865F2]/20 flex items-center gap-1.5 cursor-pointer min-h-[36px]"
              title="Join Official Discord Server (discord.gg/4ruEbqZSKT)"
            >
              <svg className="w-3.5 h-3.5 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>DISCORD</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#040810] py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Top Row: Brand & Verification Methodology Banner */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-tek font-bold text-lg shrink-0 shadow-md shadow-cyan-500/20">
                ◈
              </div>
              <div>
                <div className="font-hud font-bold text-sm text-slate-100 tracking-wider flex items-center gap-2">
                  <span>PK ULTIMATE GUIDE</span>
                  <span className="text-[10px] font-tek font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                    VERIFIED MECHANICS
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-tek mt-0.5">
                  MULTI-GAME TACTICAL LIBRARY // DEVELOPED BY <strong className="text-cyan-300">THE PITSONI EMPIRE</strong>
                </div>
              </div>
            </div>

            {/* Methodology Explanatory Callout */}
            <div className="max-w-xl text-left lg:text-right text-[11px] text-slate-400 leading-relaxed bg-[#070e1c] p-3 rounded-xl border border-cyan-500/20">
              <span className="text-cyan-300 font-bold font-hud">HOW WE BUILD TOOLS:</span> PK Ultimate Guide develops tactical calculators from raw game engine mechanics (ASA DevKit parameters & Minecraft 1.21 tick rules) and empirically benchmarks every figure on live Official servers and verified sources. Zero guesswork.
            </div>
          </div>

          {/* Bottom Row: Links, TikTok, Social & Tools */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap">
            {/* Quick Links */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091322] hover:bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-300 font-hud text-xs transition-colors cursor-pointer"
                title="Open Tactical Navigation Sidebar"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Sidebar</span>
              </button>

              <Link
                to="/library"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091322] hover:bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-300 font-hud text-xs transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>All Guides</span>
              </Link>

              <Link
                to="/about"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091322] hover:bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-300 font-hud text-xs transition-colors cursor-pointer"
                title="Read Our Methodology & Sources"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Methodology</span>
              </Link>

              <button
                onClick={() => setIsCustomRatesOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091322] hover:bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-300 font-hud text-xs transition-colors cursor-pointer"
                title="Configure ARK Server Rate Multipliers"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Rates ({currentPreset.badge})</span>
              </button>

              <button
                onClick={() => setIsShortcutsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091322] hover:bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-300 font-hud text-xs transition-colors cursor-pointer"
                title="Keyboard Shortcuts Guide (Press ?)"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Shortcuts [?]</span>
              </button>
            </div>

            {/* Social Channels: TikTok & Discord */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
              {/* Official TikTok Link */}
              <a
                href="https://www.tiktok.com/@pkguides"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-500/15 via-rose-500/15 to-purple-500/15 hover:from-pink-500/25 hover:to-purple-500/25 border border-pink-500/40 hover:border-pink-400 rounded-lg text-pink-300 font-hud font-bold text-xs transition-all shadow-md shadow-pink-500/10 cursor-pointer"
                title="Follow PK Guides on TikTok (@pkguides)"
              >
                <span className="text-pink-400 font-bold text-sm leading-none">♪</span>
                <span>TikTok @pkguides</span>
                <ExternalLink className="w-3 h-3 text-pink-400/80" />
              </a>

              {/* Official Discord Server Link */}
              <a
                href="https://discord.gg/4ruEbqZSKT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/40 hover:border-[#5865F2] rounded-lg text-[#8ea1e1] hover:text-white font-hud font-bold text-xs transition-all shadow-md shadow-[#5865F2]/10 cursor-pointer"
                title="Join the Official PK Guides Discord Server (discord.gg/4ruEbqZSKT)"
              >
                <svg className="w-4 h-4 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Official Discord Server</span>
                <ExternalLink className="w-3 h-3 text-[#8ea1e1]" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Navigation Drawers */}
      <CustomRatesModal
        isOpen={isCustomRatesOpen}
        onClose={() => setIsCustomRatesOpen(false)}
        currentPreset={currentPreset}
        onApplyPreset={(newPreset) => setCurrentPreset(newPreset)}
      />

      <SidebarNavigation
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPreset={currentPreset}
        onOpenCustomRates={() => setIsCustomRatesOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenQuickJump={() => setIsQuickJumpOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      <AboutMethodologyModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <QuickJumpModal
        isOpen={isQuickJumpOpen}
        onClose={() => setIsQuickJumpOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainAppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
