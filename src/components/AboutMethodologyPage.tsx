import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Cpu, 
  FlaskConical, 
  ExternalLink, 
  Crosshair, 
  Pickaxe,
  Bomb,
  Swords,
  ArrowRight,
  Info
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const AboutMethodologyPage: React.FC = () => {
  return (
    <div className="space-y-12 sm:space-y-16 max-w-5xl mx-auto pb-16 font-sf-text text-[#111827] dark:text-[#f5f5f7] transition-colors">
      {/* 1. Hero Header — Clean Modern Card */}
      <section className="rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#161617] p-7 sm:p-10 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4b5563] dark:text-[#9ca3af] tracking-wider uppercase">
            <span className="text-[#111827] dark:text-[#f5f5f7] font-bold">The Pitsoni Empire</span>
            <span aria-hidden="true">·</span>
            <span>Engineering & Verification Standards</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#b64400] font-bold">Zero Heuristics</span>
          </div>

          <ThemeToggle variant="segmented" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-[-0.025em] text-[#111827] dark:text-white font-sf-display mb-4">
          Tactical Methodology
        </h1>

        <p className="text-[15px] sm:text-[17px] text-[#374151] dark:text-[#d1d5db] leading-[1.47] max-w-3xl font-normal">
          <strong className="text-[#111827] dark:text-[#f5f5f7] font-bold">PK Ultimate Guide</strong> was architected by <strong className="text-[#111827] dark:text-[#f5f5f7] font-bold">The Pitsoni Empire</strong> to provide competitive survivors, builders, and architects with unapologetically accurate tactical tools. We develop calculators from decompiled game engine mechanics and systematically verify all figures against live server gameplay.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Link
            to="/taming"
            className="apple-pill-blue py-2.5 px-4 text-xs cursor-pointer gap-1.5"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Launch ARK Calculators</span>
          </Link>
          <Link
            to="/minecraft"
            className="apple-pill-outline py-2.5 px-4 text-xs cursor-pointer gap-1.5"
          >
            <Pickaxe className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
            <span>Launch Minecraft Tools</span>
          </Link>
          <Link
            to="/rust"
            className="apple-pill-outline py-2.5 px-4 text-xs cursor-pointer gap-1.5"
          >
            <Bomb className="w-3.5 h-3.5 text-[#b64400]" />
            <span>Launch Rust Tactical</span>
          </Link>
          <a
            href="https://www.tiktok.com/@pkguides"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#0066cc] dark:text-[#2997ff] hover:underline flex items-center gap-1.5 font-semibold ml-1"
          >
            <svg className="w-3.5 h-3.5 fill-current text-[#ff0050]" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.23V8.2a6.34 6.34 0 0 0-5.12 6.13A6.34 6.34 0 0 0 10.7 20.67a6.34 6.34 0 0 0 6.33-6.33V8.8a8.28 8.28 0 0 0 4.84 1.54V6.89a4.85 4.85 0 0 1-2.28-.2z"/>
            </svg>
            <span>Follow TikTok @pkguides</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      </section>

      {/* 2. Three Pillars of Our Methodology */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white font-sf-display">
          Three Engineering Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] p-7 space-y-3 shadow-sm transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2c2c2e] flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#111827] dark:text-white font-sf-display">
              1. Mechanics Decompilation
            </h3>
            <p className="text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed font-normal">
              Every formula is derived directly from raw game source code, ASA DevKit schemas, and server configuration files. We model actual torpor depletion curves, bite affinity thresholds, and coordinate transformation matrices.
            </p>
          </div>

          <div className="rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] p-7 space-y-3 shadow-sm transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2c2c2e] flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#111827] dark:text-white font-sf-display">
              2. Empirical In-Game Benchmarking
            </h3>
            <p className="text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed font-normal">
              Mathematical hypotheses are proven in-game. We stress-test on Official Small Tribes clusters, ArkPocalypse wipes, and vanilla worlds to ensure real server behavior matches calculations to the single digit.
            </p>
          </div>

          <div className="rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] p-7 space-y-3 shadow-sm transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2c2c2e] flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#111827] dark:text-white font-sf-display">
              3. Continuous Manifest Auditing
            </h3>
            <p className="text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed font-normal">
              Mechanics are cross-referenced across official dev patch manifests, community master testers, and official documentation (wiki.gg). When game patches alter values, updates are deployed rapidly.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Detailed Game Breakdown */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white font-sf-display">
          Precision By Game
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ARK Rigor */}
          <div className="rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] p-7 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#2c2c2e]">
              <h3 className="font-bold text-base text-[#111827] dark:text-white font-sf-display">
                ARK: Survival Ascended Rigor
              </h3>
              <span className="text-[11px] font-semibold text-[#4b5563] dark:text-[#9ca3af]">
                Official & Unofficial
              </span>
            </div>

            <div className="space-y-3 text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              <div className="p-4 bg-gray-50 dark:bg-[#2c2c2e] rounded-[18px] border border-gray-100 dark:border-transparent">
                <div className="font-bold text-[#111827] dark:text-white mb-1">Starve & Food Affinity Engine</div>
                <p>Computes exact food affinity values based on active server multipliers (1x, 2.5x, 5x, or custom). Calculates exact food drop required before placing food so tames never lose effectiveness or wake up prematurely.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#2c2c2e] rounded-[18px] border border-gray-100 dark:border-transparent">
                <div className="font-bold text-[#111827] dark:text-white mb-1">Turret Hitbox & Damage Mitigation</div>
                <p>Formulates the geometric protection of Stego plates (-50% incoming damage), Trike frontal bone plate (-50% to body, complete rider immunity), and Carbemys shell resistance (-80%) for PvP raid breaches.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#2c2c2e] rounded-[18px] border border-gray-100 dark:border-transparent">
                <div className="font-bold text-[#111827] dark:text-white mb-1">C4 & Structure Durability Math</div>
                <p>Direct calculations of C4 and Rocket splash damage against Metal and Tek structures, Flak armor durability decay per hit, and tribe gunpowder manufacturing quotas.</p>
              </div>
            </div>
          </div>

          {/* Rust & Minecraft Rigor */}
          <div className="rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] p-7 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#2c2c2e]">
              <h3 className="font-bold text-base text-[#111827] dark:text-white font-sf-display">
                Rust & Minecraft 1.21 Engineering
              </h3>
              <span className="text-[11px] font-semibold text-[#4b5563] dark:text-[#9ca3af]">
                Tricky Trials & Facepunch
              </span>
            </div>

            <div className="space-y-3 text-xs text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              <div className="p-4 bg-gray-50 dark:bg-[#2c2c2e] rounded-[18px] border border-gray-100 dark:border-transparent">
                <div className="font-bold text-[#111827] dark:text-white mb-1">Rust Progressive Tax Curves</div>
                <p>Calculates Facepunch progressive bracket upkeep taxes (10%, 15%, 20%, 33.3%) to the exact block, with 24h consumption rates and TC depletion timelines.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#2c2c2e] rounded-[18px] border border-gray-100 dark:border-transparent">
                <div className="font-bold text-[#111827] dark:text-white mb-1">3D Nether Coordinate Mapping</div>
                <p>Implements the exact 8:1 dimensional scale ratio and 128-block search logic with Y-level boundary safety validation to guarantee bidirectional portal linking.</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#2c2c2e] rounded-[18px] border border-gray-100 dark:border-transparent">
                <div className="font-bold text-[#111827] dark:text-white mb-1">Terraria & Anvil Optimizers</div>
                <p>Binary tree combination orders to bypass Minecraft's 39-level "Too Expensive!" hard barrier, paired with Terraria's 18-boss progression checklists.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Signature Card */}
      <section className="rounded-[28px] border border-gray-200 dark:border-[#2c2c2e] bg-white dark:bg-[#161617] p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="font-bold text-sm text-[#111827] dark:text-white font-sf-display">
            The Pitsoni Empire · Digital Tactical Archives
          </div>
          <div className="text-xs text-[#4b5563] dark:text-[#9ca3af] mt-0.5">
            Crafted with zero fluff, zero approximations, and 100% verified math.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/library"
            className="apple-pill-blue py-2 px-4 text-xs cursor-pointer gap-1.5"
          >
            <span>Back to Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://discord.gg/4ruEbqZSKT"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#0066cc] dark:text-[#2997ff] hover:underline flex items-center gap-1.5 font-semibold"
          >
            <svg className="w-3.5 h-3.5 fill-current text-[#5865F2]" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      </section>
    </div>
  );
};
