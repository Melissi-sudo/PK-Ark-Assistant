import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  FlaskConical, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  BookOpen,
  Award,
  Gamepad2,
  Database,
  Layers
} from 'lucide-react';

interface AboutMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutMethodologyModal: React.FC<AboutMethodologyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-md">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#060b17] border border-gray-200 dark:border-cyan-500/40 rounded-[28px] shadow-2xl overflow-hidden my-auto z-10 font-sf-text text-[#111827] dark:text-white"
        >
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gradient-to-r dark:from-cyan-950/90 dark:via-[#09152b] dark:to-slate-900 px-5 py-4 border-b border-gray-200 dark:border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-cyan-500/20 border border-gray-200 dark:border-cyan-400/40 flex items-center justify-center text-[#0066cc] dark:text-cyan-300 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-[#111827] dark:text-white tracking-tight font-sf-display">
                    Verification Methodology & Engine Rules
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-emerald-500/20 text-[#0066cc] dark:text-emerald-300 border border-blue-200 dark:border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-[#4b5563] dark:text-slate-400 font-medium">
                  Engineering tactical accuracy from decompiled mechanics and live in-game empirical testing.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-transparent text-[#4b5563] dark:text-slate-400 hover:text-[#111827] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Core Mission Callout */}
            <div className="bg-gray-50 dark:bg-gradient-to-br dark:from-[#0a1830] dark:to-[#050e1f] border border-gray-200 dark:border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#0066cc] dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Award className="w-4 h-4" />
                <span>The PK Ultimate Guide Philosophy</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-sf-display text-[#111827] dark:text-white mb-2">
                Built from Raw Mechanics. Benchmarked Against Real Gameplay.
              </h4>
              <p className="text-xs sm:text-sm text-[#374151] dark:text-slate-300 leading-relaxed font-normal">
                <strong className="text-[#111827] dark:text-cyan-300 font-bold">PK Ultimate Guide</strong> develops calculators and tactical companions engineered directly from underlying game mechanics and systematically verified against authoritative sources. Rather than relying on approximate heuristics, outdated legacy tables, or unverified secondary tools, every formula in this library is derived directly from game engine math and validated under live survival conditions.
              </p>
            </div>

            {/* 3 Pillars of Our Methodology */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white dark:bg-[#050c18] border border-gray-200 dark:border-cyan-500/20 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-cyan-500/20 border border-gray-200 dark:border-cyan-500/40 flex items-center justify-center text-[#0066cc] dark:text-cyan-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#111827] dark:text-white font-sf-display">1. Mechanics Decompilation</div>
                <p className="text-[11px] text-[#374151] dark:text-slate-400 leading-relaxed font-normal">
                  We formulate mathematical models directly from ASA DevKit parameters, game config ini variables, and Minecraft 1.21 tick processing logic.
                </p>
              </div>

              <div className="bg-white dark:bg-[#050c18] border border-gray-200 dark:border-cyan-500/20 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-emerald-500/20 border border-gray-200 dark:border-emerald-500/40 flex items-center justify-center text-[#34c759] dark:text-emerald-400">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#111827] dark:text-white font-sf-display">2. In-Game Empirical Testing</div>
                <p className="text-[11px] text-[#374151] dark:text-slate-400 leading-relaxed font-normal">
                  Every calculator outcome is verified on live Official Small Tribes clusters and standard vanilla servers to calibrate real-world performance.
                </p>
              </div>

              <div className="bg-white dark:bg-[#050c18] border border-gray-200 dark:border-cyan-500/20 rounded-2xl p-4 space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-amber-500/20 border border-gray-200 dark:border-amber-500/40 flex items-center justify-center text-[#b64400] dark:text-amber-400">
                  <Database className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-[#111827] dark:text-white font-sf-display">3. Multi-Game Coverage</div>
                <p className="text-[11px] text-[#374151] dark:text-slate-400 leading-relaxed font-normal">
                  Unified mathematical rigor across ARK Survival Ascended, Minecraft 1.21+, Terraria 1.4.4+, and Rust raid raiding math.
                </p>
              </div>
            </div>

            {/* Empire Attribution */}
            <div className="bg-gray-50 dark:bg-[#050b14] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <div className="text-xs font-bold text-[#111827] dark:text-white font-sf-display">
                  Crafted & Maintained by <span className="text-[#0066cc] dark:text-cyan-400 font-bold">The Pitsoni Empire</span>
                </div>
                <div className="text-[11px] text-[#4b5563] dark:text-slate-400 font-medium">
                  Official Small Tribes Specialists • Community Driven • Zero Advertisements
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://www.tiktok.com/@pkguides"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-pill-outline text-xs px-3 py-1.5 font-semibold flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-[#ff0050]" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.23V8.2a6.34 6.34 0 0 0-5.12 6.13A6.34 6.34 0 0 0 10.7 20.67a6.34 6.34 0 0 0 6.33-6.33V8.8a8.28 8.28 0 0 0 4.84 1.54V6.89a4.85 4.85 0 0 1-2.28-.2z"/>
                  </svg>
                  <span>TikTok</span>
                </a>

                <a
                  href="https://discord.gg/4ruEbqZSKT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-pill-blue text-xs px-3.5 py-1.5 font-semibold flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Discord</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-[#050914] border-t border-gray-200 dark:border-cyan-500/30 px-5 py-3.5 flex items-center justify-between text-xs text-[#4b5563] dark:text-slate-400 font-medium">
            <span>
              PK Ultimate Guide · Verification Methodology
            </span>
            <button
              onClick={onClose}
              className="apple-pill-blue px-4 py-1.5 text-xs cursor-pointer font-semibold"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
