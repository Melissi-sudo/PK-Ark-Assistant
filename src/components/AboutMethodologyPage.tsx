import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Cpu, 
  FlaskConical, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Award,
  Layers,
  ArrowLeft,
  Crosshair,
  Pickaxe
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

export const AboutMethodologyPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      <Breadcrumbs />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#071329] via-[#091b3b] to-[#061023] border-2 border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-tek font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            ENGINEERING & VERIFICATION STANDARDS
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-tek font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ZERO HEURISTICS
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-hud text-white tracking-wide mb-3">
          About PK Ultimate Guide · Tactical Methodology
        </h1>
        
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          <strong className="text-cyan-300 font-bold">PK Ultimate Guide</strong> was architected by <strong className="text-white">The Pitsoni Empire</strong> to provide competitive survivors and Minecraft architects with unapologetically accurate tactical tools. We develop calculators from decompiled game engine mechanics and systematically verify all figures against live server gameplay.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-5">
          <Link
            to="/taming"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-hud font-bold transition-all shadow-md shadow-cyan-600/30 flex items-center gap-2"
          >
            <Crosshair className="w-4 h-4" />
            <span>Launch ARK Calculators</span>
          </Link>
          <Link
            to="/minecraft"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-hud font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-2"
          >
            <Pickaxe className="w-4 h-4" />
            <span>Launch Minecraft Tools</span>
          </Link>
          <a
            href="https://www.tiktok.com/@pkguides"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/40 text-pink-300 rounded-xl text-xs font-hud font-bold transition-all flex items-center gap-2"
          >
            <span>♪</span>
            <span>Follow TikTok @pkguides</span>
          </a>
        </div>
      </div>

      {/* 3 Pillars of Our Methodology */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#070e1c] border border-cyan-500/30 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-hud font-bold text-base text-white">1. Mechanics Decompilation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every formula is derived directly from raw game source code, ASA DevKit schemas, and server configuration files. We model actual torpor depletion curves, bite affinity thresholds, and coordinate transformation matrices.
          </p>
        </div>

        <div className="bg-[#070e1c] border border-emerald-500/30 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h3 className="font-hud font-bold text-base text-white">2. Empirical In-Game Benchmarking</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mathematical hypotheses are proven in-game. We stress-test on Official Small Tribes 2.5x clusters, ArkPocalypse wipes, and vanilla Minecraft 1.21 worlds to ensure real server behavior matches calculations to the single digit.
          </p>
        </div>

        <div className="bg-[#070e1c] border border-purple-500/30 rounded-2xl p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-hud font-bold text-base text-white">3. Multi-Source Cross-Verification</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mechanics are cross-referenced across official dev patch manifests, community master testers, and official documentation (wiki.gg). When game patches alter values, updates are deployed rapidly.
          </p>
        </div>
      </div>

      {/* Detailed Game Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ARK Rigor */}
        <div className="bg-[#060c18] border border-cyan-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <span className="font-tek text-lg text-cyan-400 font-bold">◈</span>
              <h2 className="font-hud font-bold text-lg text-white">ARK: Survival Ascended Rigor</h2>
            </div>
            <span className="text-[10px] font-tek font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              UNOFFICIAL & OFFICIAL
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 bg-[#081324] rounded-xl border border-cyan-500/20">
              <div className="font-bold text-cyan-300 mb-1">Starve & Food Affinity Engine</div>
              <p>Computes exact food affinity values based on active server multipliers (1x, 2.5x, 5x, or custom). Calculates exact food drop required before placing food so tames never lose effectiveness or wake up prematurely.</p>
            </div>

            <div className="p-3 bg-[#081324] rounded-xl border border-cyan-500/20">
              <div className="font-bold text-cyan-300 mb-1">Turret Hitbox & Damage Mitigation</div>
              <p>Formulates the geometric protection of Stego plates (-50% incoming damage), Trike frontal bone plate (-50% to body, complete rider immunity), and Carbemys shell resistance (-80%) for PvP raid breaches.</p>
            </div>

            <div className="p-3 bg-[#081324] rounded-xl border border-cyan-500/20">
              <div className="font-bold text-cyan-300 mb-1">C4 & Structure Durability Math</div>
              <p>Direct calculations of C4 and Rocket splash damage against Metal and Tek structures, Flak armor durability decay per hit, and tribe gunpowder manufacturing quotas.</p>
            </div>
          </div>
        </div>

        {/* Minecraft Rigor */}
        <div className="bg-[#09071c] border border-purple-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h2 className="font-hud font-bold text-lg text-white">Minecraft 1.21+ Engineering</h2>
            </div>
            <span className="text-[10px] font-tek font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
              TRICKY TRIALS
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 bg-[#130b29] rounded-xl border border-purple-500/20">
              <div className="font-bold text-purple-300 mb-1">3D Nether Coordinate Mapping</div>
              <p>Implements the exact 8:1 dimensional scale ratio and the 128-block portal search logic with Y-level boundary safety validation to guarantee bidirectional linking without unwanted cross-portals.</p>
            </div>

            <div className="p-3 bg-[#130b29] rounded-xl border border-purple-500/20">
              <div className="font-bold text-purple-300 mb-1">1.21 Potion Brewing Matrix</div>
              <p>Documents all brewing recipes introduced in the 1.21 Tricky Trials update, including Breeze Rod and Heavy Core interactions, Oozing, Infested, and Wind Charged potions.</p>
            </div>

            <div className="p-3 bg-[#130b29] rounded-xl border border-purple-500/20">
              <div className="font-bold text-purple-300 mb-1">Anvil Prior-Work Penalty Optimizer</div>
              <p>Algorithms to solve optimal binary tree book combining hierarchies so your gear never triggers the "Too Expensive!" 39-level hard barrier.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empire Signature */}
      <div className="bg-[#050a16] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-tek font-bold text-xl">
            ◈
          </div>
          <div>
            <div className="font-hud font-bold text-white text-sm">
              THE PITSONI EMPIRE // DIGITAL TACTICAL ARCHIVES
            </div>
            <div className="text-xs text-slate-400">
              Crafted with zero fluff, zero approximations, and 100% verified math.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.tiktok.com/@pkguides"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 font-hud text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>♪</span>
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
  );
};
