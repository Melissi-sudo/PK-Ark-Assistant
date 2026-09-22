import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Terminal, Activity, Zap, ChevronRight, Play } from 'lucide-react';

interface ArkLoadingIntroProps {
  onComplete: () => void;
}

const TELEMETRY_STEPS = [
  { at: 10, text: 'BOOTING SPECIMEN IMPLANT TELEMETRY...' },
  { at: 30, text: 'CONNECTING TO OFFICIAL PVP CLUSTER (SMALL TRIBES)...' },
  { at: 55, text: 'CALIBRATING TORPOR DEPLETION & STARVE ALGORITHMS...' },
  { at: 75, text: 'SYNCING EXHUMED HIGH-RES CARTOGRAPHY MATRIX...' },
  { at: 92, text: 'INITIALIZING PITSONI EMPIRE WAR ROOM PROTOCOLS...' },
  { at: 100, text: 'SYSTEM READY // SURVIVOR IDENTIFIED' },
];

export const ArkLoadingIntro: React.FC<ArkLoadingIntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState('BOOTING SPECIMEN IMPLANT TELEMETRY...');
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFinishing(true);
          setTimeout(() => {
            onComplete();
          }, 450);
          return 100;
        }

        // Variable increment for authentic tech boot feel
        const inc = prev < 35 ? 4 : prev < 70 ? 3 : prev < 90 ? 2 : 5;
        const next = Math.min(100, prev + inc);

        // Update step log
        const matched = [...TELEMETRY_STEPS].reverse().find(s => next >= s.at);
        if (matched) {
          setCurrentLog(matched.text);
        }

        return next;
      });
    }, 45);

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
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02050e] text-slate-100 overflow-hidden select-none"
    >
      {/* Background Animated Holographic Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#081b33_1px,transparent_1px),linear-gradient(to_bottom,#081b33_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />
      
      {/* Ambient Pulsing Glow Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"
      />

      {/* Top Bar with Skip Button & Terminal Status */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-cyan-400/80 truncate mr-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">SPECIMEN IMPLANT LINK // </span>SECURE TEK CONNECTION
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSkip}
          className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:text-white font-tek font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/10 flex items-center gap-1.5"
        >
          <span>SKIP INTRO</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Center Holographic Core: ARK Specimen Implant */}
      <div className="relative flex flex-col items-center justify-center z-10 max-w-lg px-4 text-center">
        {/* Holographic Ring Cluster */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-6">
          {/* Outer Dashed Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30"
          />

          {/* Inner Counter-Rotating Hex Segment */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3 rounded-full border border-cyan-500/20 border-t-cyan-400/80 border-b-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          />

          {/* Animated Scanning Laser Line */}
          <motion.div
            animate={{ y: [-60, 60, -60] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_10px_#22d3ee] pointer-events-none"
          />

          {/* Core ARK Specimen Implant Diamond Prism */}
          <motion.div
            animate={{ 
              scale: [0.95, 1.05, 0.95],
              filter: [
                'drop-shadow(0 0 12px rgba(6,182,212,0.6))',
                'drop-shadow(0 0 24px rgba(6,182,212,0.95))',
                'drop-shadow(0 0 12px rgba(6,182,212,0.6))'
              ]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
              {/* Outer Diamond */}
              <polygon
                points="50,5 95,50 50,95 5,50"
                stroke="#06b6d4"
                strokeWidth="2.5"
                fill="rgba(6, 182, 212, 0.12)"
              />
              {/* Inner Diamond */}
              <polygon
                points="50,20 80,50 50,80 20,50"
                stroke="#22d3ee"
                strokeWidth="1.8"
                fill="rgba(6, 182, 212, 0.25)"
              />
              {/* Central Core Element */}
              <circle cx="50" cy="50" r="8" fill="#a5f3fc" />
              {/* Crosshair accents */}
              <line x1="50" y1="0" x2="50" y2="100" stroke="#06b6d4" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#06b6d4" strokeWidth="0.8" strokeOpacity="0.4" />
            </svg>
          </motion.div>
        </div>

        {/* Title & Brand Identity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded shadow-sm">
              SPECIMEN IDENTIFIER // SURVIVOR
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-hud text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 tracking-wider">
            PK ARK ASSISTANT
          </h1>

          <p className="text-xs text-slate-400 font-tek uppercase tracking-widest">
            THE PITSONI EMPIRE // OFFICIAL PVP WAR ROOM
          </p>
        </motion.div>

        {/* Telemetry Progress Bar & Live Percent */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400/90 truncate max-w-[280px] sm:max-w-xs text-left">
              {currentLog}
            </span>
            <span className="text-white font-bold ml-2 shrink-0">
              {progress}%
            </span>
          </div>

          {/* Outer bar with glowing border */}
          <div className="relative w-full h-2.5 bg-[#040c1a] border border-cyan-500/40 rounded-full overflow-hidden p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-blue-400 rounded-full relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] opacity-80" />
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>OFFICIAL MESH CLUSTER: ACTIVE</span>
            <span>DATA RATE: 4.8 GB/S</span>
          </div>
        </div>

        {/* Quick Launch CTA Button */}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSkip}
          className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-hud font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-lg shadow-cyan-500/25 flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>ENTER WAR ROOM NOW</span>
        </motion.button>
      </div>

      {/* Bottom Corner HUD Details */}
      <div className="absolute bottom-4 left-6 right-6 hidden sm:flex items-center justify-between text-[10px] font-mono text-slate-600 z-20">
        <div>SYS_VER: 2.4.0-ASA // PITSONI PROTOCOL</div>
        <div>AUTHORIZED ACCESS ONLY // PVP COMBAT READY</div>
      </div>
    </motion.div>
  );
};
