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
  Info
} from 'lucide-react';

export const EnchantingAnvilGuide: React.FC = () => {
  const [selectedGear, setSelectedGear] = useState<'sword' | 'mace' | 'armor' | 'bow'>('mace');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-[#120f29] to-[#0a071a] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.21+ Enchanting</span>
              <span>·</span>
              <span className="text-indigo-300">Level 30 & Anvil Prior Work Penalty</span>
              <span>·</span>
              <span className="text-emerald-400">1.21 Mace Mechanics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-md">
                <Hammer className="w-4 h-4 text-indigo-400" />
              </span>
              Enchanting & Anvil Order Optimizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Never see the "Too Expensive!" (39+ levels) anvil lockout again. Use binary tree book combining to forge 7-enchantment God armor, and equip the 1.21 Mace with Wind Burst, Density, and Breach.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs font-hud font-bold">
              15 Bookshelves Setup
            </span>
          </div>
        </div>
      </div>

      {/* 1.21 Mace Exclusive Enchantments Spotlight */}
      <div className="bg-[#0b0819] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold font-hud text-slate-100">
              1.21 Tricky Trials Exclusive Weapon: The Heavy Mace
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
            Crafted from Heavy Core + Breeze Rod
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#140f2e] border border-indigo-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 text-sm">Wind Burst (I - III)</span>
              <span className="text-[10px] font-mono text-emerald-400">Trial Vault Drop</span>
            </div>
            <p className="text-slate-300 leading-relaxed pt-1">
              Upon landing a smash attack, launches the player <strong>7 blocks upward per level</strong>. Allows skilled players to repeatedly bounce off enemies for infinite aerial smash combos without taking fall damage!
            </p>
          </div>

          <div className="p-3.5 bg-[#140f2e] border border-indigo-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 text-sm">Density (I - V)</span>
              <span className="text-[10px] font-mono text-emerald-400">Enchanting Table</span>
            </div>
            <p className="text-slate-300 leading-relaxed pt-1">
              Increases the damage dealt per block fallen by <strong>+0.5 damage (+0.25 hearts) per level</strong>. At Density V, falling just 10 blocks delivers an additional +25 damage on top of base smash scaling!
            </p>
          </div>

          <div className="p-3.5 bg-[#140f2e] border border-indigo-500/20 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 text-sm">Breach (I - IV)</span>
              <span className="text-[10px] font-mono text-emerald-400">Enchanting Table</span>
            </div>
            <p className="text-slate-300 leading-relaxed pt-1">
              Reduces the target armor effectiveness by <strong>15% per level</strong> (up to <strong>-60% armor penetration</strong> at Breach IV). Completely destroys Full Netherite Protection IV armor in PvP!
            </p>
          </div>
        </div>
      </div>

      {/* Binary Tree Anvil Combining Formula to avoid "Too Expensive!" */}
      <div className="bg-[#0b0819] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="border-b border-indigo-500/20 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold font-hud text-slate-100">
              The Binary Tree Combining Protocol (Avoiding "Too Expensive!")
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
            Cap: 39 Levels Max
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Every time an item or book passes through an anvil, its <strong>Prior Work Penalty (PWP)</strong> doubles: 
          <span className="font-mono text-indigo-300 font-bold ml-1">0 ➔ 1 ➔ 3 ➔ 7 ➔ 15 ➔ 31 ➔ 63 (Too Expensive!)</span>.
          If you combine books one by one directly onto your sword or armor, you will hit the 39 level cap by the 5th enchantment and ruin the item.
        </p>

        {/* Comparison: Linear Fail vs Binary Tree Success */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>WRONG: Linear Combining (Hits "Too Expensive!")</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
              <li>Sword + Book 1 (PWP = 1)</li>
              <li>Sword + Book 2 (PWP = 3)</li>
              <li>Sword + Book 3 (PWP = 7)</li>
              <li>Sword + Book 4 (PWP = 15)</li>
              <li>Sword + Book 5 (PWP = 31)</li>
              <li>Sword + Book 6 ➔ <strong className="text-red-400">FAILS: 63+ levels (Too Expensive!)</strong></li>
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
              <li>Combine Sword + Master Book ➔ <strong className="text-emerald-400">SUCCESS! PWP is only 7 levels!</strong></li>
              <li>Leaves plenty of room for Mending, Unbreaking, and Sharpness!</li>
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
