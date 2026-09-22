import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ArrowUpRight, 
  Sparkles, 
  ShieldAlert, 
  Flame, 
  Egg, 
  Zap, 
  Target,
  Maximize2,
  Minimize2,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PVP_STRATEGY_TIPS, PvPTip } from '../data/pvpTips';

interface DailyArkTipProps {
  onNavigateTab?: (tab: 'taming' | 'soakers' | 'pyromane' | 'breeding' | 'maps' | 'resources' | 'stats' | 'timers' | 'store') => void;
}

export const DailyArkTip: React.FC<DailyArkTipProps> = ({ onNavigateTab }) => {
  // Determine daily tip index based on current date
  const defaultIndex = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dayOfYear % PVP_STRATEGY_TIPS.length;
  }, []);

  const [currentIndex, setCurrentIndex] = useState<number>(defaultIndex);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentTip: PvPTip = PVP_STRATEGY_TIPS[currentIndex] || PVP_STRATEGY_TIPS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PVP_STRATEGY_TIPS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PVP_STRATEGY_TIPS.length) % PVP_STRATEGY_TIPS.length);
  };

  const handleCopy = () => {
    const textToCopy = `[ARK PVP Tip - ${currentTip.title}]: ${currentTip.tip} Pro Tip: ${currentTip.proTip}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If dismissed by survivor, don't show
  if (isDismissed) {
    return (
      <div className="pt-2 pb-1 text-center">
        <button
          onClick={() => setIsDismissed(false)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[11px] font-tek cursor-pointer transition-colors"
        >
          <Lightbulb className="w-3 h-3 text-cyan-400" />
          <span>Show Daily ARK PvP Tip</span>
        </button>
      </div>
    );
  }

  // Minimized Floating Pill
  if (isMinimized) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 mb-2 flex items-center justify-between gap-3 p-2.5 sm:px-4 rounded-xl bg-[#070e1b]/90 border border-cyan-500/30 shadow-lg text-xs font-hud backdrop-blur-md"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="text-[10px] font-tek text-amber-400 font-bold uppercase tracking-wider shrink-0">
            DAILY PVP TIP:
          </span>
          <span className="text-slate-300 truncate text-[11px]">
            {currentTip.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Expand Tip Card"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline text-[10px] font-tek font-bold">EXPAND</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            title="Dismiss Tip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Badge styling
  const getBadgeStyle = (category: PvPTip['category']) => {
    switch (category) {
      case 'TURRET SOAKING':
        return 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300';
      case 'CAVE DEFENSE':
        return 'bg-blue-500/15 border-blue-500/40 text-blue-300';
      case 'RAID PUSH':
        return 'bg-purple-500/15 border-purple-500/40 text-purple-300';
      case 'BREEDING & CAKES':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
      case 'WEAPONS & ARMOR':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
      case 'TAMING & HARVEST':
        return 'bg-orange-500/15 border-orange-500/40 text-orange-300';
      default:
        return 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300';
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mt-8 mb-4 relative rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#060c18] via-[#091325] to-[#060c18] p-4 sm:p-5 shadow-2xl overflow-hidden backdrop-blur-md"
    >
      {/* Subtle background ambient corner glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar of Tip Card */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md shadow-amber-500/10 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-hud font-bold text-xs sm:text-sm tracking-wider text-slate-100 flex items-center gap-1.5">
                DAILY ARK PVP STRATEGY INTEL
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-tek font-bold uppercase tracking-wider border ${getBadgeStyle(currentTip.category)}`}>
                {currentTip.category}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-tek">
              TACTICAL FIELD DISPATCH • THE PITSONI EMPIRE WAR ROOM
            </div>
          </div>
        </div>

        {/* Controls: Prev / Counter / Next / Copy / Minimize / Dismiss */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tip Index Counter */}
          <span className="text-[11px] font-tek font-bold text-cyan-300/80 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
            TIP {currentIndex + 1} / {PVP_STRATEGY_TIPS.length}
          </span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            aria-label="Previous PvP Tip"
            className="w-7 h-7 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title="Previous Tip"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            aria-label="Next PvP Tip"
            className="w-7 h-7 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            title="Next Tip"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            aria-label="Copy Tip text"
            className="w-7 h-7 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            title="Copy Tip to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </motion.button>

          <button
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize Tip card"
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss Tip card"
            className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
            title="Dismiss Tip for this session"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tip Body with animated switch */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 pt-3.5 space-y-3"
        >
          {/* Title */}
          <h3 className="text-sm sm:text-base font-hud font-bold text-white tracking-wide flex items-center gap-2">
            <span>{currentTip.title}</span>
          </h3>

          {/* Strategy description */}
          <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans">
            {currentTip.tip}
          </p>

          {/* Pro-Tip Box & Deep-link Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex-1 bg-[#050b14]/80 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs text-amber-200/90 leading-snug">
                <strong className="text-amber-300 font-tek uppercase tracking-wider mr-1.5">
                  WAR ROOM PRO-TIP:
                </strong>
                {currentTip.proTip}
              </div>
            </div>

            {/* If tip has a related tab, offer quick navigation */}
            {currentTip.relatedTab && onNavigateTab && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigateTab(currentTip.relatedTab!)}
                className="self-start sm:self-center px-3.5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-hud font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
              >
                <span>{currentTip.tabActionLabel || 'Open Tool'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
};
