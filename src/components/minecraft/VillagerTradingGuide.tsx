import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Sword, 
  Hammer, 
  Crosshair, 
  Beaker, 
  Check, 
  Clock, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { VILLAGER_PROFESSIONS, VillagerProfession } from '../../data/minecraftData';

export const VillagerTradingGuide: React.FC = () => {
  const [selectedProfId, setSelectedProfId] = useState<string>('librarian');
  const [showExperimentalBiome, setShowExperimentalBiome] = useState<boolean>(false);
  const [edition, setEdition] = useState<'java' | 'bedrock'>('java');

  const selectedProf = VILLAGER_PROFESSIONS.find(p => p.id === selectedProfId) || VILLAGER_PROFESSIONS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-[#1c1208] to-[#100904] border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-amber-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.20.2 - 1.21+ Economics</span>
              <span>·</span>
              <span className="text-amber-300">1.20.2+ Single-Cure Rules</span>
              <span>·</span>
              <span className="text-emerald-400">All 13 Vanilla Workstations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-amber-900/60 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md">
                <Users className="w-4 h-4 text-amber-400" />
              </span>
              Villager Trading & Job Workstation Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Maximize your trading hall. Re-roll Novice Librarians for Mending, learn exact 1.20.2+ single-cure discount formulas (up to -20 emeralds), workstation locking, and experimental biome trade rules.
            </p>
          </div>

          {/* Controls: Edition and Experimental Biome Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-1 bg-[#10061e] p-1 rounded-xl border border-amber-500/30">
              <button
                onClick={() => setEdition('java')}
                className={`px-2.5 py-1 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  edition === 'java'
                    ? 'bg-amber-600 text-black shadow-md'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                Java Edition
              </button>
              <button
                onClick={() => setEdition('bedrock')}
                className={`px-2.5 py-1 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  edition === 'bedrock'
                    ? 'bg-amber-600 text-black shadow-md'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                Bedrock Edition
              </button>
            </div>

            <button
              onClick={() => setShowExperimentalBiome(!showExperimentalBiome)}
              className={`px-3 py-1.5 rounded-xl text-xs font-hud font-bold border transition-colors cursor-pointer ${
                showExperimentalBiome
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                  : 'bg-[#150d06] text-slate-300 border-amber-500/30 hover:bg-amber-950/40'
              }`}
            >
              {showExperimentalBiome ? '✓ Biome Rebalance: ON (Experimental)' : 'Biome Rebalance: OFF (Standard Vanilla)'}
            </button>
          </div>
        </div>
      </div>

      {/* Zombie Curing & Discount Calculator Hub */}
      <div className="bg-[#0e0804] border border-amber-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold font-hud text-slate-100">
              Zombie Villager Curing Mechanics & Exact Discount Formula
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded border border-emerald-500/30">
            1.20.2+ Single-Cure Cap
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#180e07] border border-amber-500/20 rounded-xl space-y-1">
            <span className="font-bold text-amber-300 block">Step 1: Inflict Weakness</span>
            <p className="text-slate-300 leading-relaxed">
              Throw a <strong>Splash Potion of Weakness</strong> (or shoot a Weakness tipped arrow) directly at the Zombie Villager. Gray swirl particles confirm the effect.
            </p>
          </div>

          <div className="p-3.5 bg-[#180e07] border border-amber-500/20 rounded-xl space-y-1">
            <span className="font-bold text-amber-300 block">Step 2: Feed Golden Apple</span>
            <p className="text-slate-300 leading-relaxed">
              Right-click the weakened zombie with a standard <strong>Golden Apple</strong> (8 gold ingots + apple). A loud sizzle plays and red particles begin shaking violently.
            </p>
          </div>

          <div className="p-3.5 bg-[#180e07] border border-amber-500/20 rounded-xl space-y-1">
            <span className="font-bold text-amber-300 block">Step 3: Conversion Time & Accelerators</span>
            <p className="text-slate-300 leading-relaxed">
              {edition === 'bedrock' ? (
                <>In <strong>Bedrock Edition</strong>, curing duration is fixed at <strong>2,000 ticks = 100 seconds (1m 40s)</strong>.</>
              ) : (
                <>In <strong>Java Edition</strong>, curing takes <strong>3 to 5 minutes (3,600 to 6,000 ticks)</strong>. Placing 14+ <strong>Iron Bars</strong> and a <strong>Bed</strong> within a 9x9x9 cube accelerates the countdown by ~4.2%.</>
              )}
            </p>
          </div>
        </div>

        {/* Curing Rules in 1.20.2+ */}
        <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Official 1.20.2+ Discount Math (No Stacking):</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            A single cure grants a <strong>Major Positive gossip of 20</strong> (100 reputation points). The discount is calculated as <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300 font-mono">floor(100 × price_multiplier)</code>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 pt-1 pl-1">
            <li><strong>High-Tier Trades (0.2 multiplier):</strong> Grants a <strong>-20 emerald discount</strong>. A 35-emerald Diamond Chestplate drops to <strong>15 emeralds</strong> (not 1 emerald). A 21-emerald Mending book drops to 1 emerald.</li>
            <li><strong>Standard Trades (0.05 multiplier):</strong> Grants a <strong>-5 emerald discount</strong>.</li>
            <li><strong>Item-for-Emerald Trades:</strong> Items like 32 Sticks or 24 Paper drop down to a floor of <strong>1 item per emerald</strong>.</li>
          </ul>
        </div>
      </div>

      {/* Main Professions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Profession Selector */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-2 font-mono">
            <span>Select Villager Profession:</span>
            <span>{VILLAGER_PROFESSIONS.length} / 13 Workstations</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {VILLAGER_PROFESSIONS.map(prof => {
              const isSelected = prof.id === selectedProf.id;
              return (
                <button
                  key={prof.id}
                  onClick={() => setSelectedProfId(prof.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-950/80 border-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-[#0f0905] border-amber-500/20 hover:bg-[#180e07] hover:border-amber-500/40'
                  }`}
                >
                  <div>
                    <div className="font-hud font-bold text-sm text-slate-100">
                      {prof.name}
                    </div>
                    <div className="text-[11px] font-mono text-amber-300 mt-0.5">
                      Workstation: {prof.jobBlock}
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 px-2 py-1 bg-black/40 rounded border border-white/5">
                    {prof.topTrades.length} Core Trades
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Profession In-Depth Guide */}
        <div className="lg:col-span-7">
          <div className="bg-[#0f0905] border border-amber-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
            {/* Header */}
            <div className="border-b border-amber-500/20 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-hud text-slate-100">
                  {selectedProf.name}
                </h3>
                <div className="text-xs font-mono text-amber-400 mt-0.5">
                  Job Site: <strong>{selectedProf.jobBlock}</strong> ({selectedProf.craftingSummary})
                </div>
              </div>

              <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                Progression: Novice ➔ Master
              </span>
            </div>

            {/* Top Trades Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200 block">
                High Priority Trades & Item Outputs:
              </span>
              <div className="space-y-2">
                {selectedProf.topTrades.map((trade, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-[#180e07] border border-amber-500/20 rounded-xl flex items-center justify-between text-xs gap-3"
                  >
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        <span>{trade.itemReceived}</span>
                        {trade.importance === 'Essential' && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-mono">
                            ESSENTIAL
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Give: {trade.itemGiven} · Level: {trade.level}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-amber-300 font-bold">
                        {trade.cost}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Default Cost
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Re-rolling & Discount Strategy */}
            <div className="p-4 bg-[#0a0603] border border-amber-500/20 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Novice Re-roll & Economics Protocol:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedProf.curingDiscountSummary}
              </p>
              <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg text-[11px] text-slate-400">
                <strong>Workstation Locking Rule:</strong> Before trading with a villager for the first time, breaking and re-placing their workstation resets their offered trades. Once you trade with them even once, their trades are permanently locked and their profession cannot be changed!
              </div>
            </div>

            {/* Biome Trade Rebalance Reference */}
            {showExperimentalBiome && selectedProf.biomeRebalanceNote && (
              <div className="p-3.5 bg-blue-950/30 border border-blue-500/40 rounded-xl text-xs text-blue-200 leading-relaxed">
                <strong className="text-blue-400 font-hud">Experimental Biome Rebalance Rule: </strong>
                {selectedProf.biomeRebalanceNote}
                <div className="text-[11px] text-blue-300 mt-1">
                  Note: The Biome Trade Rebalance is an opt-in experimental data pack feature in Java and an experimental toggle in Bedrock. It is not active in default vanilla survival worlds.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
