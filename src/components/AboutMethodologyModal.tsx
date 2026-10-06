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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[#060b17] border-2 border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-950/90 via-[#09152b] to-slate-900 px-5 py-4 border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-hud font-bold text-lg text-white tracking-wide">
                    About PK Ultimate Guide · Verification Methodology
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-tek font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VERIFIED MECHANICS
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Engineering tactical accuracy from decompiled mechanics and live in-game empirical testing.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Core Mission Callout */}
            <div className="bg-gradient-to-br from-[#0a1830] to-[#050e1f] border border-cyan-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-hud font-bold uppercase tracking-wider mb-1.5">
                <Award className="w-4 h-4" />
                <span>The PK Ultimate Guide Philosophy</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold font-hud text-white mb-2">
                Built from Raw Mechanics. Benchmarked Against Real Gameplay.
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-cyan-300">PK Ultimate Guide</strong> develops calculators and tactical companions engineered directly from underlying game mechanics and systematically verified against authoritative sources. Rather than relying on approximate heuristics, outdated legacy tables, or unverified secondary tools, every formula in this library is derived directly from game engine math and validated under live survival conditions.
              </p>
            </div>

            {/* 3 Pillars of Our Methodology */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-[#050c18] border border-cyan-500/20 rounded-xl p-4 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="font-hud font-bold text-xs text-white">1. Mechanics Decompilation</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  We formulate mathematical models directly from ASA DevKit parameters, game config ini variables, and Minecraft 1.21 tick processing logic.
                </p>
              </div>

              <div className="bg-[#050c18] border border-cyan-500/20 rounded-xl p-4 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div className="font-hud font-bold text-xs text-white">2. In-Game Empirical Testing</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Every algorithm is stress-tested on live servers (Official Small Tribes 2.5x, ArkPocalypse, and vanilla 1.21) to confirm real world behavior.
                </p>
              </div>

              <div className="bg-[#050c18] border border-cyan-500/20 rounded-xl p-4 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-hud font-bold text-xs text-white">3. Source Cross-Verification</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mechanics are cross-referenced with developer patch notes, official devkits, and verified community data repositories.
                </p>
              </div>
            </div>

            {/* In-Depth Breakdown by Game */}
            <div className="space-y-4 pt-2">
              <h5 className="font-hud font-bold text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Domain-Specific Mathematical Rigor</span>
              </h5>

              {/* ARK Breakdown */}
              <div className="bg-[#050a16] border border-cyan-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-hud font-bold text-xs text-cyan-300">
                    <span className="font-tek text-cyan-400">◈</span>
                    <span>ARK: Survival Ascended Tactical Mechanics</span>
                  </div>
                  <span className="text-[10px] font-tek font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    ASA DEV-KIT ALIGNED
                  </span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pl-3 list-disc marker:text-cyan-400">
                  <li>
                    <strong>Taming & Starve Calculations:</strong> Computes exact food affinity values, natural torpor depletion rates per minute, and starvation threshold markers so players never waste kibble or wake early.
                  </li>
                  <li>
                    <strong>Turret Soaker Hitbox Analysis:</strong> Deconstructs Trike frontal damage reduction (-50%), Stegosaurus hardened plate mitigation (-50%), and rider dismount immunity angles for optimal raid tanking.
                  </li>
                  <li>
                    <strong>Raid Explosives & Structure HP:</strong> Models exact C4, Rocket, and Tek Rifle damage against Wood, Stone, Metal, and Tek structures with durability formulas and ammo quotas.
                  </li>
                  <li>
                    <strong>Genetics & Breeding:</strong> Extracts wild stat points with mutation tracking, incubation temperature envelopes, and precise maturation timers.
                  </li>
                </ul>
              </div>

              {/* Minecraft Breakdown */}
              <div className="bg-[#0a0718] border border-purple-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-hud font-bold text-xs text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Minecraft 1.21+ (Tricky Trials) Mechanics</span>
                  </div>
                  <span className="text-[10px] font-tek font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    1.21 ENGINE MATH
                  </span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pl-3 list-disc marker:text-purple-400">
                  <li>
                    <strong>3D Nether Portal Linker:</strong> Implements Mojang's exact 8:1 Overworld-to-Nether horizontal coordinate matrix with 128-block search radius collision checks.
                  </li>
                  <li>
                    <strong>1.21 Potion Brewing Matrix:</strong> Details sequential ingredient paths for Tricky Trials elixirs including Wind Charged, Oozing, Infested, and Weaving potions.
                  </li>
                  <li>
                    <strong>Ore Generation Distributions:</strong> Accurately charts triangular diamond generation peaks at Y = -58 and ancient debris clusters at Y = 15.
                  </li>
                  <li>
                    <strong>Anvil Optimizer:</strong> Solves optimal binary tree book combination sequences to avoid the dreaded "Too Expensive!" 39-level anvil cap.
                  </li>
                </ul>
              </div>
            </div>

            {/* Empire Attribution */}
            <div className="bg-[#050b14] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <div className="text-xs font-hud font-bold text-white">
                  Crafted & Maintained by <span className="text-cyan-400">The Pitsoni Empire</span>
                </div>
                <div className="text-[11px] text-slate-400 font-tek">
                  Official Small Tribes Specialists • Community Driven • Zero Advertisements
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://www.tiktok.com/@pkguides"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 font-hud text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span className="font-bold">♪</span>
                  <span>TikTok @pkguides</span>
                </a>

                <a
                  href="https://discord.gg/4ruEbqZSKT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-hud text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Join Official Discord Server (discord.gg/4ruEbqZSKT)"
                >
                  <span>Official Discord</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#050914] border-t border-cyan-500/30 px-5 py-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-tek">
              PK ULTIMATE GUIDE // METHODOLOGY VERSION 3.2
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-hud font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
