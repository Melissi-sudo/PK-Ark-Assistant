import React, { useState } from 'react';
import { 
  Pickaxe, 
  Gem, 
  Layers, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  Check, 
  ArrowUpDown,
  Search
} from 'lucide-react';
import { MINECRAFT_ORES, OreDistribution } from '../../data/minecraftData';

export const OreDistributionGuide: React.FC = () => {
  const [selectedY, setSelectedY] = useState<number>(-58);
  const [selectedOreId, setSelectedOreId] = useState<string>('diamonds');
  const [dimensionFilter, setDimensionFilter] = useState<'All' | 'Overworld' | 'Nether'>('All');

  const selectedOre = MINECRAFT_ORES.find(o => o.id === selectedOreId) || MINECRAFT_ORES[0];

  // Find ores that generate at the chosen Y level
  const oresAtCurrentY = MINECRAFT_ORES.filter(ore => {
    return selectedY >= ore.minY && selectedY <= ore.maxY;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950/70 via-[#0a1829] to-[#040f1a] border border-sky-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.21+ Geology</span>
              <span>·</span>
              <span className="text-sky-300">Deepslate Bedrock to Mountain Peaks</span>
              <span>·</span>
              <span className="text-emerald-400">Tricky Trials Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-sky-900/60 border border-sky-500/40 flex items-center justify-center text-sky-300 shadow-md">
                <Pickaxe className="w-4 h-4 text-sky-400" />
              </span>
              Ore Distribution & Mining Elevation Guide
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Master the 1.18 - 1.21+ triangular ore generation curves. Discover why Diamond strip mining at Y = -58/-59 yields 2x more than caves, and how Ancient Debris bed mining at Y = 15 maximizes Netherite scrap.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-sky-900/40 border border-sky-500/30 rounded-xl text-sky-300 text-xs font-hud font-bold">
              Y = -64 to Y = 320 Chart
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Y-Level Elevation Inspector */}
      <div className="bg-[#06101d] border border-sky-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-500/20 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold font-hud text-slate-100">
              Interactive Elevation Inspector: <span className="text-sky-300 font-mono">Y = {selectedY}</span>
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-400">
            {selectedY < 0 
              ? 'Deepslate & Bedrock Layer (Y < 0)' 
              : selectedY > 64 
              ? 'Mountain & Surface Layer (Y > 64)' 
              : 'Standard Underground Stone (Y 0 to 64)'}
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Y = -64 (Bedrock Lava)</span>
            <span className="text-sky-300 font-bold text-sm">Y = {selectedY}</span>
            <span>Y = 320 (Peak Mountains)</span>
          </div>
          <input
            type="range"
            min="-64"
            max="320"
            step="1"
            value={selectedY}
            onChange={(e) => setSelectedY(Number(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-slate-400">Quick Jump Heights:</span>
            {[
              { label: 'Diamonds (-58)', y: -58 },
              { label: 'Ancient Debris (15)', y: 15 },
              { label: 'Iron Peak (16)', y: 16 },
              { label: 'Copper Peak (48)', y: 48 },
              { label: 'Coal Peak (96)', y: 96 },
              { label: 'Mountain Emeralds (232)', y: 232 },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={() => setSelectedY(btn.y)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer border ${
                  selectedY === btn.y
                    ? 'bg-sky-600 text-white border-sky-400 font-bold'
                    : 'bg-[#0b1c30] text-sky-300 border-sky-500/30 hover:bg-sky-900/50'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ores Active at this Height */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-300 mb-2 block">
            Ores Generating at Elevation Y = {selectedY} ({oresAtCurrentY.length} types):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {oresAtCurrentY.map(ore => {
              const isPeak = ore.peakY.includes(selectedY);
              return (
                <button
                  key={ore.id}
                  onClick={() => setSelectedOreId(ore.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedOreId === ore.id
                      ? 'bg-sky-950/70 border-sky-400'
                      : 'bg-[#091728] border-sky-500/20 hover:border-sky-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: ore.color }} 
                    />
                    {isPeak && (
                      <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-mono font-bold">
                        PEAK HEIGHT!
                      </span>
                    )}
                  </div>
                  <div className="font-hud font-bold text-xs text-slate-100 mt-1 truncate">
                    {ore.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {ore.shape}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Ore Selection & In-Depth Mining Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ore Selector Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Select Ore for Mining Blueprint:</span>
            <span>{MINECRAFT_ORES.length} Recorded</span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {MINECRAFT_ORES.map(ore => {
              const isSelected = ore.id === selectedOre.id;
              return (
                <button
                  key={ore.id}
                  onClick={() => {
                    setSelectedOreId(ore.id);
                    if (ore.peakY[0] !== undefined) setSelectedY(ore.peakY[0]);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-950/80 border-sky-400 shadow-md shadow-sky-500/10'
                      : 'bg-[#061220] border-sky-500/20 hover:bg-[#0a1a2e] hover:border-sky-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: ore.color }}
                    />
                    <div>
                      <div className="font-hud font-bold text-sm text-slate-100">
                        {ore.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Elevation: Y = {ore.minY} to {ore.maxY}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono text-sky-300 font-bold">
                      Peak: Y = {ore.peakY.join(', ')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {ore.dimension}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Deep-Dive for Selected Ore */}
        <div className="lg:col-span-7">
          <div className="bg-[#061220] border border-sky-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
            {/* Title & Dimension */}
            <div className="border-b border-sky-500/20 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-4 h-4 rounded-full shadow-md"
                  style={{ backgroundColor: selectedOre.color }}
                />
                <div>
                  <h3 className="text-lg font-bold font-hud text-slate-100">
                    {selectedOre.name}
                  </h3>
                  <div className="text-xs font-mono text-sky-400">
                    Dimension: {selectedOre.dimension} · Required Tool: {selectedOre.miningLevel}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 bg-sky-950/60 border border-sky-500/30 rounded-lg text-xs font-mono text-sky-300">
                  Peak Y: {selectedOre.peakY.join(', ')}
                </span>
              </div>
            </div>

            {/* Key Specs Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#0a1a2e] border border-sky-500/20 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Spawn Range</span>
                <span className="font-mono font-bold text-slate-100 text-sm mt-0.5 block">
                  Y = {selectedOre.minY} to {selectedOre.maxY}
                </span>
              </div>

              <div className="p-3 bg-[#0a1a2e] border border-sky-500/20 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Distribution Shape</span>
                <span className="font-mono font-bold text-sky-300 text-sm mt-0.5 block">
                  {selectedOre.shape}
                </span>
              </div>

              <div className="p-3 bg-[#0a1a2e] border border-sky-500/20 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[11px]">Fortune III Boost</span>
                <span className="font-mono font-bold text-emerald-300 text-sm mt-0.5 block truncate">
                  Fortune 3 Active
                </span>
              </div>
            </div>

            {/* Optimal Mining Strategy Blueprint */}
            <div className="space-y-2 bg-[#040c17] border border-sky-500/20 rounded-xl p-4">
              <span className="font-bold text-sky-300 flex items-center gap-1.5 text-xs">
                <Pickaxe className="w-3.5 h-3.5" />
                Optimal Mining Blueprint & Tactics:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {selectedOre.optimalStrategy}
              </p>
            </div>

            {/* Fortune III Multiplier breakdown */}
            <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-200">
              <strong className="text-emerald-400 font-hud">Fortune vs Silk Touch: </strong>
              {selectedOre.fortuneMultiplier}
            </div>

            {/* Extra Pro Note */}
            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 leading-relaxed">
              <strong className="text-amber-400 font-hud">1.21 Tricky Trials Update Note: </strong>
              {selectedOre.notes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
