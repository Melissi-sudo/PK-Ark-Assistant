import React, { useState } from 'react';
import { 
  Cpu, 
  Clock, 
  RotateCcw, 
  Check, 
  Zap, 
  Layers, 
  Sliders, 
  Info,
  Sparkles
} from 'lucide-react';
import { REDSTONE_TICKS } from '../../data/minecraftData';

export const RedstoneTickGuide: React.FC = () => {
  // Hopper Clock Calculator state
  const [hopperItems, setHopperItems] = useState<number>(30);
  
  // Repeater Chain Calculator state
  const [repeaters1Tick, setRepeaters1Tick] = useState<number>(0);
  const [repeaters2Tick, setRepeaters2Tick] = useState<number>(0);
  const [repeaters3Tick, setRepeaters3Tick] = useState<number>(0);
  const [repeaters4Tick, setRepeaters4Tick] = useState<number>(5);

  // Hopper Math: 8 game ticks (0.4s) per item transfer
  const halfCycleSeconds = hopperItems * 0.4;
  const fullCycleSeconds = halfCycleSeconds * 2;

  // Repeater Math
  const totalRedstoneTicks = (repeaters1Tick * 1) + (repeaters2Tick * 2) + (repeaters3Tick * 3) + (repeaters4Tick * 4);
  const totalRepeaterSeconds = totalRedstoneTicks * 0.1;
  const totalRepeaterGameTicks = totalRedstoneTicks * 2;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/70 via-[#1e0a0a] to-[#120404] border border-red-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.21+ Logic Engine</span>
              <span>·</span>
              <span className="text-red-300">20 TPS Game Tick vs 10 TPS Redstone</span>
              <span>·</span>
              <span className="text-emerald-400">1.21 Crafter & Hopper Math</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-red-900/60 border border-red-500/40 flex items-center justify-center text-red-300 shadow-md">
                <Cpu className="w-4 h-4 text-red-400" />
              </span>
              Redstone Timing & Pulse Logic Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Calculate exact Hopper clock cycles, chain repeater delays, build the canonical 41-1-1-1-1 item sorter, and automate farms with the 1.21 Crafter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-red-900/40 border border-red-500/30 rounded-xl text-red-300 text-xs font-hud font-bold">
              1 Item = 0.4s (8 gt)
            </span>
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Hopper Clock Calc & Repeater Chain Calc */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hopper Clock Calculator */}
        <div className="bg-[#0f0505] border border-red-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="border-b border-red-500/20 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400" />
              <h2 className="text-base font-bold font-hud text-slate-100">
                Etho Hopper Clock Timer Calculator
              </h2>
            </div>
            <span className="text-xs font-mono text-red-400">
              Transfer: 2.5 items/sec
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Two facing hoppers with comparators and pistons create the most reliable long-duration clock in Minecraft. Enter item count to calculate period:
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">
                Number of Items in Hopper:
              </label>
              <span className="font-mono text-base font-bold text-red-400">
                {hopperItems} {hopperItems === 1 ? 'item' : 'items'}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="320"
              value={hopperItems}
              onChange={(e) => setHopperItems(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            {/* Quick buttons */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Presets:</span>
              {[
                { label: '5 items (2s)', val: 5 },
                { label: '15 items (6s)', val: 15 },
                { label: '30 items (12s)', val: 30 },
                { label: '64 items (25.6s)', val: 64 },
                { label: '150 items (1m)', val: 150 },
                { label: '300 items (2m)', val: 300 },
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => setHopperItems(preset.val)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer border ${
                    hopperItems === preset.val
                      ? 'bg-red-600 text-white border-red-400 font-bold'
                      : 'bg-[#180808] text-red-300 border-red-500/30 hover:bg-red-950/60'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Readout */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-[#1a0808] border border-red-500/30 rounded-xl text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Half-Cycle Delay</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-100 mt-1">
                {halfCycleSeconds.toFixed(1)}s
              </div>
              <div className="text-[10px] text-red-400 font-mono mt-0.5">
                {(halfCycleSeconds / 60).toFixed(2)} min
              </div>
            </div>

            <div className="p-3.5 bg-[#1a0808] border border-red-500/30 rounded-xl text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Full Period Cycle</div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-red-400 mt-1">
                {fullCycleSeconds.toFixed(1)}s
              </div>
              <div className="text-[10px] text-red-300 font-mono mt-0.5">
                {(fullCycleSeconds / 60).toFixed(2)} min
              </div>
            </div>
          </div>
        </div>

        {/* Repeater Chain Calculator */}
        <div className="bg-[#0f0505] border border-red-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="border-b border-red-500/20 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-400" />
              <h2 className="text-base font-bold font-hud text-slate-100">
                Repeater Chain Delay Calculator
              </h2>
            </div>
            <button
              onClick={() => {
                setRepeaters1Tick(0);
                setRepeaters2Tick(0);
                setRepeaters3Tick(0);
                setRepeaters4Tick(0);
              }}
              className="text-xs text-slate-400 hover:text-red-300 flex items-center gap-1 font-mono cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Combine repeaters set to different notches to calculate exact circuit delays for TNT cannons, piston doors, and mob trap flushing.
          </p>

          {/* 4 Repeater Tiers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-[#180808] border border-red-500/20 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-200">1-Tick Repeaters</span>
                <span className="font-mono text-red-400">{repeaters1Tick}</span>
              </div>
              <input
                type="number"
                min="0"
                max="50"
                value={repeaters1Tick}
                onChange={(e) => setRepeaters1Tick(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#0a0303] border border-red-500/30 rounded-lg px-2 py-1 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">0.1s each</span>
            </div>

            <div className="p-2.5 bg-[#180808] border border-red-500/20 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-200">2-Tick Repeaters</span>
                <span className="font-mono text-red-400">{repeaters2Tick}</span>
              </div>
              <input
                type="number"
                min="0"
                max="50"
                value={repeaters2Tick}
                onChange={(e) => setRepeaters2Tick(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#0a0303] border border-red-500/30 rounded-lg px-2 py-1 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">0.2s each</span>
            </div>

            <div className="p-2.5 bg-[#180808] border border-red-500/20 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-200">3-Tick Repeaters</span>
                <span className="font-mono text-red-400">{repeaters3Tick}</span>
              </div>
              <input
                type="number"
                min="0"
                max="50"
                value={repeaters3Tick}
                onChange={(e) => setRepeaters3Tick(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#0a0303] border border-red-500/30 rounded-lg px-2 py-1 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">0.3s each</span>
            </div>

            <div className="p-2.5 bg-[#180808] border border-red-500/20 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-200">4-Tick Repeaters</span>
                <span className="font-mono text-red-400">{repeaters4Tick}</span>
              </div>
              <input
                type="number"
                min="0"
                max="50"
                value={repeaters4Tick}
                onChange={(e) => setRepeaters4Tick(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#0a0303] border border-red-500/30 rounded-lg px-2 py-1 text-xs text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">0.4s each</span>
            </div>
          </div>

          {/* Delay Total Output */}
          <div className="p-4 bg-[#1a0808] border border-red-500/30 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Total Accumulated Delay</div>
              <div className="text-2xl font-bold font-mono text-red-400 mt-0.5">
                {totalRepeaterSeconds.toFixed(1)} seconds
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-300">
              <div>{totalRedstoneTicks} Redstone Ticks</div>
              <div className="text-slate-500 text-[11px]">{totalRepeaterGameTicks} Game Ticks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Impulse Item Sorter 41-1-1-1-1 Architecture & 1.21 Crafter Reference */}
      <div className="bg-[#0f0505] border border-red-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="border-b border-red-500/20 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-400" />
            <h3 className="text-base font-bold font-hud text-slate-100">
              Canonical Item Sorter Architecture: The 41-1-1-1-1 Formula
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            Overflow Proof
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-[#180808] border-2 border-red-400/80 rounded-xl text-center">
            <div className="font-mono text-red-300 font-bold text-sm">Slot 1: 41 Items</div>
            <div className="text-[11px] text-slate-400 mt-1">Item to Filter (e.g. Iron Ingot, Diamond, Gunpowder)</div>
          </div>
          <div className="p-3 bg-[#180808] border border-red-500/30 rounded-xl text-center">
            <div className="font-mono text-slate-200 font-bold text-sm">Slot 2: 1 Blocker</div>
            <div className="text-[11px] text-slate-400 mt-1">Renamed Anvil Item (e.g. "Filler #1")</div>
          </div>
          <div className="p-3 bg-[#180808] border border-red-500/30 rounded-xl text-center">
            <div className="font-mono text-slate-200 font-bold text-sm">Slot 3: 1 Blocker</div>
            <div className="text-[11px] text-slate-400 mt-1">Renamed Anvil Item (e.g. "Filler #2")</div>
          </div>
          <div className="p-3 bg-[#180808] border border-red-500/30 rounded-xl text-center">
            <div className="font-mono text-slate-200 font-bold text-sm">Slot 4: 1 Blocker</div>
            <div className="text-[11px] text-slate-400 mt-1">Renamed Anvil Item (e.g. "Filler #3")</div>
          </div>
          <div className="p-3 bg-[#180808] border border-red-500/30 rounded-xl text-center">
            <div className="font-mono text-slate-200 font-bold text-sm">Slot 5: 1 Blocker</div>
            <div className="text-[11px] text-slate-400 mt-1">Renamed Anvil Item (e.g. "Filler #4")</div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          <strong>Why exactly 41 items?</strong> In a 5-slot hopper, 45 total items emit a comparator signal strength of exactly <strong>1</strong>. When a 46th matching item enters slot 1 (raising total to 46), signal strength increases to <strong>2</strong>, triggering the redstone dust line to unlock the bottom hopper until the count drains back to 41. If the sorter backs up, signal strength never reaches 3, which guarantees neighboring filter lines never bleed or break!
        </p>
      </div>
    </div>
  );
};
