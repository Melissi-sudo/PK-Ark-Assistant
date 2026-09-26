import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Terminal, Activity, Zap, ChevronRight, Play, Gamepad2, Compass, Layers } from 'lucide-react';

interface ArkLoadingIntroProps {
  onComplete: () => void;
}

const TELEMETRY_STEPS = [
  { at: 10, text: 'INITIALIZING PITSONI EMPIRE TACTICAL MAINFRAME...' },
  { at: 28, text: 'CALIBRATING ARK: SURVIVAL ASCENDED SIMULATORS & MATRICES...' },
  { at: 50, text: 'LINKING MINECRAFT 1.21+ TRICKY TRIALS ENGINE & SEED CARTOGRAPHY...' },
  { at: 72, text: 'DECRYPTING TURRET DAMAGE CURVES, BREEDING TIMERS & ORE ELEVATIONS...' },
  { at: 90, text: 'SYNCING MULTI-GAME CLUSTER // ESTABLISHING LOW-LATENCY LINK...' },
  { at: 100, text: 'WAR ROOM ONLINE // ACCESS GRANTED' },
];

export const ArkLoadingIntro: React.FC<ArkLoadingIntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState('BOOTING TACTICAL GAMING SUITE...');
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFinishing(true);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }

        // Varied step increments for an authentic cinematic gaming boot feel
        const inc = prev < 25 ? 4 : prev < 60 ? 3 : prev < 85 ? 2 : 3;
        const next = Math.min(100, prev + inc);

        // Update step log
        const matched = [...TELEMETRY_STEPS].reverse().find(s => next >= s.at);
        if (matched) {
          setCurrentLog(matched.text);
        }

        return next;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFinishing(true);
    setTimeout(onComplete, 200);
  };

  // Keyboard shortcut listener to skip intro with Space, Enter, or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02050e] text-slate-100 overflow-hidden select-none"
    >
      {/* Background Animated Cyber Holographic Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#081b33_1px,transparent_1px),linear-gradient(to_bottom,#081b33_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      {/* Ambient Pulsing Glow Orbs in Cyber Cyan & Electric Blue */}
      <motion.div 
        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[160px] pointer-events-none"
      />

      {/* Top Bar with Tactical Status & Skip Button */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="font-semibold tracking-wider">
            PK ULTIMATE GUIDE // MULTI-GAME TACTICAL HUB
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.25)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/50 text-cyan-300 hover:text-white font-tek font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/10 flex items-center gap-1.5 backdrop-blur-md"
        >
          <span>SKIP INTRO (ESC)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Center Cinematic Emblem & Logo Showcase */}
      <div className="relative flex flex-col items-center justify-center z-10 max-w-xl w-full px-4 text-center">
        {/* Holographic Glowing Badge Frame */}
        <div className="relative w-64 sm:w-80 h-48 sm:h-60 flex items-center justify-center mb-4">
          {/* Outer Dashed Cyan Orbit Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40"
          />

          {/* Inner Counter-Rotating Hex Segments */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 rounded-full border border-cyan-500/30 border-t-cyan-300 border-b-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          />

          {/* Animated Scanning Laser Line */}
          <motion.div
            animate={{ y: [-75, 75, -75] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-52 sm:w-68 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_14px_#22d3ee] pointer-events-none z-20"
          />

          {/* Center Official Gaming Logo Badge */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ 
              scale: [0.96, 1.03, 0.96],
              opacity: 1,
              filter: [
                'drop-shadow(0 0 16px rgba(6,182,212,0.6))',
                'drop-shadow(0 0 32px rgba(6,182,212,0.95))',
                'drop-shadow(0 0 16px rgba(6,182,212,0.6))'
              ]
            }}
            transition={{ 
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              filter: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.6 }
            }}
            className="relative z-10 w-full h-full flex items-center justify-center p-2"
          >
            <img 
              src="/logo.png?v=pk-v3" 
              alt="PK Ultimate Guide Official Logo"
              className="max-h-full max-w-full object-contain pointer-events-none select-none filter drop-shadow-[0_0_20px_rgba(6,182,212,0.7)]"
            />
          </motion.div>
        </div>

        {/* Sub-header Badge & Creator Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-0.5 text-[10px] sm:text-[11px] font-tek font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-full shadow-sm">
              THE PITSONI EMPIRE // OFFICIAL COMPANION
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-hud tracking-wide max-w-md mx-auto">
            ARK: Survival Ascended & Minecraft 1.21+ Tactical Knowledge Archives
          </p>
        </motion.div>

        {/* Multi-Game Feature Highlights */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-md mt-4 text-left">
          <div className="bg-[#050f1e]/80 border border-cyan-500/20 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 font-tek font-bold">
              ARK
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold text-white font-hud truncate">ARK: ASCENDED</div>
              <div className="text-[9px] text-cyan-400/80 font-mono truncate">Taming, Soakers, Maps</div>
            </div>
          </div>

          <div className="bg-[#120a1c]/80 border border-purple-500/20 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 font-tek font-bold">
              MC
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold text-white font-hud truncate">MINECRAFT 1.21+</div>
              <div className="text-[9px] text-purple-400/80 font-mono truncate">Portals, Seeds, Redstone</div>
            </div>
          </div>
        </div>

        {/* Telemetry Progress Bar & Live Percent */}
        <div className="w-full max-w-md mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 truncate max-w-[260px] sm:max-w-xs text-left font-medium">
              {currentLog}
            </span>
            <span className="text-white font-bold ml-2 shrink-0 font-tek text-sm tracking-wider">
              {progress}%
            </span>
          </div>

          {/* Outer bar with glowing border */}
          <div className="relative w-full h-2.5 bg-[#040c1a] border border-cyan-500/40 rounded-full overflow-hidden p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-blue-400 rounded-full relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] opacity-90" />
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>ENGINE: ONLINE</span>
            <span>SYSTEM: LOW-LATENCY</span>
            <span>PRESS SPACE OR ESC</span>
          </div>
        </div>

        {/* Quick Launch CTA Button */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(6,182,212,0.5)' }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSkip}
          className="mt-5 px-7 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-hud font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-lg shadow-cyan-500/30 flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>ENTER PK ULTIMATE GUIDE</span>
        </motion.button>
      </div>

      {/* Bottom Corner HUD Details */}
      <div className="absolute bottom-4 left-6 right-6 hidden sm:flex items-center justify-between text-[10px] font-mono text-slate-600 z-20">
        <div>SYS_VER: 3.2.0-ULTIMATE // PITSONI PROTOCOL</div>
        <div>TACTICAL COMPANION SUITE // 100% OPERATIONAL</div>
      </div>
    </motion.div>
  );
};
