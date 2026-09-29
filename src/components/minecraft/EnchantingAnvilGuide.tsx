import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Hammer, 
  AlertTriangle, 
  Check, 
  Zap, 
  Swords, 
  ShieldCheck,
  Info,
  HelpCircle
} from 'lucide-react';

export const EnchantingAnvilGuide: React.FC = () => {
  // Edition selector: Java vs Bedrock
  const [edition, setEdition] = useState<'java' | 'bedrock'>('java');
  const [maceBuild, setMaceBuild] = useState<'density' | 'breach' | 'smite'>('density');

  // Interactive Anvil Cost Calculator State
  const [targetUses, setTargetUses] = useState<number>(1);
  const [sacrificeUses, setSacrificeUses] = useState<number>(1);
  const [enchantLevelCost, setEnchantLevelCost] = useState<number>(4);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  // Anvil Math (Java formula: 2^n - 1)
  const targetPWP = Math.pow(2, targetUses) - 1;
  const sacrificePWP = Math.pow(2, sacrificeUses) - 1;
  const renameCost = isRenaming ? 1 : 0;
  const totalCost = targetPWP + sacrificePWP + enchantLevelCost + renameCost;
  const nextTargetUses = Math.max(targetUses, sacrificeUses) + 1;
  const isTooExpensive = edition === 'java' && totalCost >= 40;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-[#120f29] to-[#0a071a] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-indigo-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.21+ Verified</span>
              <span>·</span>
              <span className="text-indigo-300">Level 30 & Anvil Prior Work Penalty</span>
              <span>·</span>
              <span className="text-emerald-400">1.21 Mace Compatibility Rules</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-md">
                <Hammer className="w-4 h-4 text-indigo-400" />
              </span>
              Enchanting & Anvil Order Optimizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Prevent the "Too Expensive!" (39+ levels) anvil lockout using binary tree pair combining, test exact Prior Work Penalties (PWP), and learn verified 1.21 Mace mutual exclusivity rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#10061e] p-1 rounded-xl border border-indigo-500/30">
              <button
                onClick={() => setEdition('java')}
                className={`px-2.5 py-1 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  edition === 'java'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-300 hover:text-white'
                }`}
              >
                Java Edition (39 Cap)
              </button>
              <button
                onClick={() => setEdition('bedrock')}
                className={`px-2.5 py-1 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  edition === 'bedrock'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-300 hover:text-white'
                }`}
              >
                Bedrock (No Cap)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1.21 Mace Exclusive Enchantments & Compatibility Spotlight */}
      <div className="bg-[#0b0819] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold font-hud text-slate-100">
              1.21 Heavy Mace: Verified Incompatibility & Build Rules
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-500/30">
            Density, Breach, and Smite are Mutually Exclusive!
          </span>
        </div>

        {/* Warning Notice */}
        <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Game Mechanic Rule:</strong> You <strong>cannot</strong> combine Density and Breach on the same Mace in Survival mode! In official Minecraft 1.21, <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300 font-mono">[Density, Breach, Smite, Bane of Arthropods]</code> are strictly mutually exclusive damage modifiers. You must choose one primary specialty.
          </div>
        </div>

        {/* Mace Build Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => setMaceBuild('density')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              maceBuild === 'density'
                ? 'bg-indigo-950/70 border-indigo-400 shadow-md shadow-indigo-500/10'
                : 'bg-[#110c26] border-indigo-500/20 hover:border-indigo-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 text-sm">Path A: Aerial Smasher</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">PvE & Bosses</span>
            </div>
            <div className="font-mono text-xs text-slate-200 mt-2 font-bold">
              Density V + Wind Burst III
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Adds +0.5 damage per level per block fallen (+2.5 dmg/block at Level V). Falling 15 blocks adds +37.5 smash damage, enough to one-shot Wardens and Wither bosses.
            </p>
          </button>

          <button
            onClick={() => setMaceBuild('breach')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              maceBuild === 'breach'
                ? 'bg-indigo-950/70 border-indigo-400 shadow-md shadow-indigo-500/10'
                : 'bg-[#110c26] border-indigo-500/20 hover:border-indigo-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 text-sm">Path B: Armor Piercer</span>
              <span className="text-[10px] font-mono text-purple-400 font-bold">PvP Meta</span>
            </div>
            <div className="font-mono text-xs text-slate-200 mt-2 font-bold">
              Breach IV + Wind Burst III
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Reduces target armor effectiveness by 15% per level (-60% at Breach IV). Completely penetrates Full Netherite Protection IV armor in competitive player combat.
            </p>
          </button>

          <button
            onClick={() => setMaceBuild('smite')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              maceBuild === 'smite'
                ? 'bg-indigo-950/70 border-indigo-400 shadow-md shadow-indigo-500/10'
                : 'bg-[#110c26] border-indigo-500/20 hover:border-indigo-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 text-sm">Path C: Undead Cleaver</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">Trial Chambers</span>
            </div>
            <div className="font-mono text-xs text-slate-200 mt-2 font-bold">
              Smite V + Wind Burst III
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Deals +12.5 damage against Wither Skeletons, Zombies, Drowned, and Phantoms. Excellent for farming Trial Spawners inside Trial Chambers.
            </p>
          </button>
        </div>

        {/* Universal Secondary Enchants */}
        <div className="p-3 bg-[#130d2e] border border-indigo-500/20 rounded-xl text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="font-bold text-indigo-300 font-hud">Universal Mace Addons:</span>
          <span>Unbreaking III</span>
          <span>·</span>
          <span>Mending</span>
          <span>·</span>
          <span>Fire Aspect II</span>
          <span>·</span>
          <span className="text-slate-500">Curse of Vanishing (optional)</span>
        </div>
      </div>

      {/* Interactive Anvil Cost & PWP Simulator */}
      <div className="bg-[#0b0819] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="border-b border-indigo-500/20 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold font-hud text-slate-100">
              Interactive Anvil Combining Cost & PWP Simulator
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Formula: Target PWP + Sacrifice PWP + Enchant Cost
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-mono mb-1">
              Target Item Prior Uses (N₁)
            </label>
            <input
              type="number"
              min="0"
              max="6"
              value={targetUses}
              onChange={(e) => setTargetUses(Math.max(0, Number(e.target.value)))}
              className="w-full bg-[#140f2e] border border-indigo-500/30 rounded-xl px-3 py-2 text-slate-100 font-mono"
            />
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              PWP = {targetPWP} levels (2^{targetUses} - 1)
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">
              Sacrifice Book Prior Uses (N₂)
            </label>
            <input
              type="number"
              min="0"
              max="6"
              value={sacrificeUses}
              onChange={(e) => setSacrificeUses(Math.max(0, Number(e.target.value)))}
              className="w-full bg-[#140f2e] border border-indigo-500/30 rounded-xl px-3 py-2 text-slate-100 font-mono"
            />
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              PWP = {sacrificePWP} levels (2^{sacrificeUses} - 1)
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-mono mb-1">
              Incoming Enchantments Cost
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={enchantLevelCost}
              onChange={(e) => setEnchantLevelCost(Math.max(1, Number(e.target.value)))}
              className="w-full bg-[#140f2e] border border-indigo-500/30 rounded-xl px-3 py-2 text-slate-100 font-mono"
            />
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              Base enchant weight multiplier
            </span>
          </div>

          <div className="flex flex-col justify-between">
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isRenaming}
                onChange={(e) => setIsRenaming(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
              />
              <span className="text-slate-300 text-xs">Renaming Item (+1 level)</span>
            </label>

            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center mt-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Operation Cost</span>
              <span className={`text-xl font-bold font-mono ${isTooExpensive ? 'text-red-400' : 'text-emerald-400'}`}>
                {totalCost} Levels
              </span>
            </div>
          </div>
        </div>

        {/* Cost Verdict */}
        {isTooExpensive ? (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong>Java Edition Lockout: "Too Expensive!" (Cost ≥ 40 Levels).</strong> In Java Edition, anvils will refuse this operation in Survival. Use binary tree merging so that no book or item exceeds prior work count of 3! (Note: Bedrock Edition does not enforce this 39-level cap).
            </div>
          </div>
        ) : (
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Safe Anvil Combine: Within the 39-level survival threshold. Resulting item will have Prior Work count of {nextTargetUses}.</span>
            </div>
          </div>
        )}
      </div>

      {/* Binary Tree Combining Protocol */}
      <div className="bg-[#0b0819] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="border-b border-indigo-500/20 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold font-hud text-slate-100">
              The Binary Tree Combining Protocol (Avoiding "Too Expensive!")
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
            Cap: 39 Levels Max (Java)
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Every time an item or book passes through an anvil, its <strong>Prior Work Penalty (PWP)</strong> follows the exponential series: 
          <span className="font-mono text-indigo-300 font-bold ml-1">0 ➔ 1 ➔ 3 ➔ 7 ➔ 15 ➔ 31 ➔ 63</span> levels.
          If you combine books one by one directly onto your weapon or armor, you will hit the 39 level cap by the 5th enchantment and ruin the item.
        </p>

        {/* Comparison: Linear Fail vs Binary Tree Success */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>WRONG: Linear Combining (Hits "Too Expensive!")</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
              <li>Mace + Book 1 (PWP = 1)</li>
              <li>Mace + Book 2 (PWP = 3)</li>
              <li>Mace + Book 3 (PWP = 7)</li>
              <li>Mace + Book 4 (PWP = 15)</li>
              <li>Mace + Book 5 (PWP = 31)</li>
              <li>Mace + Book 6 ➔ <strong className="text-red-400">FAILS: 63+ levels (Too Expensive!)</strong></li>
            </ol>
          </div>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Check className="w-4 h-4" />
              <span>RIGHT: Binary Tree Pair Combining</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
              <li>Combine Book 1 + Book 2 ➔ Combo A (PWP = 1)</li>
              <li>Combine Book 3 + Book 4 ➔ Combo B (PWP = 1)</li>
              <li>Combine Combo A + Combo B ➔ Master Book (PWP = 3)</li>
              <li>Combine Weapon + Master Book ➔ <strong className="text-emerald-400">SUCCESS! PWP is only 7 levels!</strong></li>
              <li>Leaves ample room for Mending, Unbreaking, and Fire Aspect.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Bookshelf Level 30 Setup Guide */}
      <div className="bg-[#0b0819] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl text-xs">
        <span className="font-bold text-indigo-300 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Optimal Level 30 Enchanting Table Setup (15 Bookshelves):
        </span>
        <p className="text-slate-300 leading-relaxed">
          Place your Enchanting Table in the center with exactly <strong>1 block of empty air</strong> between the table and bookshelves.
          Surround with 15 bookshelves in a 5x5 perimeter (2 blocks high).
          <strong>Crucial warning:</strong> Torches, carpets, snow, or lanterns placed on the ground between the table and shelves block the enchanting glyphs and downgrade your level capacity to Level 1!
        </p>
      </div>
    </div>
  );
};
