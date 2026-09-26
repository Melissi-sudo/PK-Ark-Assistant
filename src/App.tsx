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
import { PkStoreBanner } from './components/PkStoreBanner';
import { PkStoreModal } from './components/PkStoreModal';
import { TamingCalculator } from './components/TamingCalculator';
import { TurretSoakerGuide } from './components/TurretSoakerGuide';
import { PyromaneTamingGuide } from './components/PyromaneTamingGuide';
import { MatingCalculator } from './components/MatingCalculator';
import { TribeResourceHub } from './components/TribeResourceHub';
import { ResourceMaps } from './components/ResourceMaps';
import { DinoStatLookup } from './components/DinoStatLookup';
import { TimerManager } from './components/TimerManager';
import { PkStoreCatalog } from './components/PkStoreCatalog';
import { ArkLoadingIntro } from './components/ArkLoadingIntro';
import { DailyArkTip } from './components/DailyArkTip';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { NotFoundPage } from './components/NotFoundPage';
import { PageMetaSync } from './components/common/PageMetaSync';
import { LibraryHub } from './components/LibraryHub';
import { MinecraftHub } from './components/minecraft/MinecraftHub';
import { ServerRatePreset, ActiveTimer } from './types';
import { SERVER_PRESETS } from './data/presets';
import { sendBrowserNotification, playTekAlarmSound } from './utils/audioAlert';
import { Shield, ExternalLink, Zap, Keyboard, BookOpen, Flame, Beaker, Pickaxe } from 'lucide-react';
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
  const isLibrary = location.pathname === '/' || location.pathname === '/library';
  const isArk = !isMinecraft && !isLibrary;
  
  // Rate preset (default to Official Small Tribes)
  const [currentPreset, setCurrentPreset] = useState<ServerRatePreset>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRESET_KEY);
      if (saved) {
        const found = SERVER_PRESETS.find(p => p.id === saved);
        if (found) return found;
      }
    }
    return SERVER_PRESETS[0]; // Official Small Tribes
  });

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [isStoreModalOpen, setIsStoreModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  
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
        setIsStoreModalOpen(false);
        setIsAuthModalOpen(false);
        setIsShortcutsModalOpen(false);
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

      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsStoreModalOpen(prev => !prev);
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

      {/* PK Store Global Promotional Banner */}
      <PkStoreBanner onOpenStoreModal={() => setIsStoreModalOpen(true)} />

      {/* HUD Top Header & Multi-Game Switcher */}
      <Navbar
        currentPreset={currentPreset}
        setCurrentPreset={setCurrentPreset}
        activeTimersCount={timers.length}
        hasExpiringTimers={hasExpiringTimers}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenStoreModal={() => setIsStoreModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
        onOpenKeyboardShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* Main Container */}
      <main 
        id="main-content" 
        tabIndex={-1} 
        aria-label="PK Ultimate Guide Main Display"
        className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 focus:outline-none"
      >
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

              {/* Minecraft Hub Routes */}
              <Route path="/minecraft" element={<MinecraftHub />} />
              <Route path="/minecraft/:subtab" element={<MinecraftHub />} />

              {/* ARK Canonical & Game Routes */}
              <Route path="/ark" element={<Navigate to="/taming" replace />} />
              
              <Route
                path="/taming"
                element={
                  <TamingCalculator
                    currentPreset={currentPreset}
                    onAddTimer={handleAddTimer}
                    onOpenStoreModal={() => setIsStoreModalOpen(true)}
                    onViewSoakerGuide={() => navigate('/soakers')}
                    onViewPyromaneGuide={() => navigate('/pyromane')}
                  />
                }
              />

              <Route path="/soakers" element={<TurretSoakerGuide />} />

              <Route path="/pyromane" element={<PyromaneTamingGuide />} />

              <Route
                path="/breeding"
                element={
                  <MatingCalculator
                    currentPreset={currentPreset}
                    onAddTimer={handleAddTimer}
                    onOpenStoreModal={() => setIsStoreModalOpen(true)}
                  />
                }
              />

              <Route
                path="/maps"
                element={
                  <ResourceMaps
                    onOpenStoreModal={() => setIsStoreModalOpen(true)}
                  />
                }
              />

              <Route
                path="/maps/:mapId"
                element={
                  <ResourceMaps
                    onOpenStoreModal={() => setIsStoreModalOpen(true)}
                  />
                }
              />

              <Route
                path="/resources"
                element={
                  <TribeResourceHub
                    currentPreset={currentPreset}
                    onOpenStoreModal={() => setIsStoreModalOpen(true)}
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

              <Route path="/store" element={<PkStoreCatalog />} />

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

            <Link
              to="/store"
              className="px-2.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-lg text-[11px] sm:text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer min-h-[36px]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>PK STORE</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#040810] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-tek font-bold">
              ◈
            </div>
            <div>
              <div className="font-hud font-bold text-slate-200 tracking-wider">
                PK ULTIMATE GUIDE // MULTI-GAME TACTICAL LIBRARY
              </div>
              <div className="text-[11px] text-slate-400 font-tek mt-0.5">
                CRAFTED BY <strong className="text-cyan-300">THE PITSONI EMPIRE</strong> // ARK SURVIVAL ASCENDED & MINECRAFT 1.21+
              </div>
            </div>
          </div>

          {/* Links & Quick Nav */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <Link
              to="/library"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091322] hover:bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-300 font-hud text-xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>All Guides</span>
            </Link>

            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091322] hover:bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-300 font-hud text-xs transition-colors cursor-pointer"
              title="Keyboard Shortcuts Guide (Press ?)"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Shortcuts [?]</span>
            </button>

            <a
              href="https://discord.gg/C9pD2yduw9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 font-hud font-bold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>PK Store Discord</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PkStoreModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
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
