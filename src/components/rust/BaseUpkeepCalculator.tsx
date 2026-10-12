import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Info, 
  RefreshCw,
  Building,
  CheckCircle2,
  Hourglass,
  Sliders
} from 'lucide-react';
import { 
  calculateEffectiveTaxRate, 
  BASE_BLOCK_COST_PER_DAY, 
  UPKEEP_TAX_BRACKETS 
} from '../../data/rustData';
import { 
  MetalFragsIcon, 
  HqmIcon 
} from './RustIcons';

interface BasePreset {
  name: string;
  description: string;
  wood: number;
  stone: number;
  metal: number;
  hqm: number;
}

const BASE_PRESETS: BasePreset[] = [
  {
    name: '2x1 Solo Starter',
    description: 'Compact airlock starter bunker with 2 triangle airlocks',
    wood: 4,
    stone: 24,
    metal: 4,
    hqm: 0
  },
  {
    name: '2x2 Honeycomb & Bunker',
    description: 'Standard duo/trio main with stone outer shell and metal core',
    wood: 6,
    stone: 85,
    metal: 32,
    hqm: 8
  },
  {
    name: 'Main Base Compound (Trio/Squad)',
    description: 'Multi-floor shooting floor, wide gaps, external TC links',
    wood: 12,
    stone: 190,
    metal: 140,
    hqm: 45
  },
  {
    name: 'Clan Fortress / Mega Base',
    description: 'Triple honeycomb armored vault, 360 wide peakdowns',
    wood: 20,
    stone: 420,
    metal: 380,
    hqm: 160
  }
];

export const BaseUpkeepCalculator: React.FC = () => {
  // Building block counts
  const [woodBlocks, setWoodBlocks] = useState<number>(6);
  const [stoneBlocks, setStoneBlocks] = useState<number>(85);
  const [metalBlocks, setMetalBlocks] = useState<number>(32);
  const [hqmBlocks, setHqmBlocks] = useState<number>(8);

  // Stored TC inventory quantities
  const [storedWood, setStoredWood] = useState<number>(3000);
  const [storedStone, setStoredStone] = useState<number>(15000);
  const [storedMetal, setStoredMetal] = useState<number>(8000);
  const [storedHqm, setStoredHqm] = useState<number>(250);

  // Apply a template preset
  const handleApplyPreset = (preset: BasePreset) => {
    setWoodBlocks(preset.wood);
    setStoneBlocks(preset.stone);
    setMetalBlocks(preset.metal);
    setHqmBlocks(preset.hqm);
  };

  // Reset to default
  const handleReset = () => {
    handleApplyPreset(BASE_PRESETS[1]);
  };

  // Aggregate block count
  const totalBlocks = woodBlocks + stoneBlocks + metalBlocks + hqmBlocks;

  // Facepunch progressive tax rate
  const effectiveTaxRate = useMemo(() => {
    return calculateEffectiveTaxRate(totalBlocks);
  }, [totalBlocks]);

  // Daily upkeep consumption (per 24 hours)
  const dailyConsumption = useMemo(() => {
    const wood = Math.ceil(woodBlocks * BASE_BLOCK_COST_PER_DAY.wood * effectiveTaxRate);
    const stone = Math.ceil(stoneBlocks * BASE_BLOCK_COST_PER_DAY.stone * effectiveTaxRate);
    const metal = Math.ceil(metalBlocks * BASE_BLOCK_COST_PER_DAY.metal * effectiveTaxRate);
    const hqm = Math.ceil(hqmBlocks * BASE_BLOCK_COST_PER_DAY.hqm * effectiveTaxRate);

    return { wood, stone, metal, hqm };
  }, [woodBlocks, stoneBlocks, metalBlocks, hqmBlocks, effectiveTaxRate]);

  // Hourly upkeep consumption
  const hourlyConsumption = useMemo(() => {
    return {
      wood: (dailyConsumption.wood / 24).toFixed(1),
      stone: (dailyConsumption.stone / 24).toFixed(1),
      metal: (dailyConsumption.metal / 24).toFixed(1),
      hqm: (dailyConsumption.hqm / 24).toFixed(1)
    };
  }, [dailyConsumption]);

  // Stored inventory remaining protection time (hours)
  const remainingHours = useMemo(() => {
    const calcHours = (stored: number, daily: number) => {
      if (daily <= 0) return Infinity;
      return (stored / daily) * 24;
    };

    const woodH = calcHours(storedWood, dailyConsumption.wood);
    const stoneH = calcHours(storedStone, dailyConsumption.stone);
    const metalH = calcHours(storedMetal, dailyConsumption.metal);
    const hqmH = calcHours(storedHqm, dailyConsumption.hqm);

    // Filter finite values to find bottleneck
    const validHours = [
      { name: 'Wood', hours: woodH },
      { name: 'Stone', hours: stoneH },
      { name: 'Metal Frags', hours: metalH },
      { name: 'HQM', hours: hqmH }
    ].filter(item => isFinite(item.hours));

    if (validHours.length === 0) {
      return {
        woodH,
        stoneH,
        metalH,
        hqmH,
        bottleneck: null,
        minHours: 0
      };
    }

    const bottleneck = validHours.reduce((prev, curr) => curr.hours < prev.hours ? curr : prev);

    return {
      woodH,
      stoneH,
      metalH,
      hqmH,
      bottleneck,
      minHours: bottleneck.hours
    };
  }, [storedWood, storedStone, storedMetal, storedHqm, dailyConsumption]);

  // Format hours into days / hours / minutes
  const formatTime = (hours: number) => {
    if (!isFinite(hours) || hours <= 0) return '0h 0m';
    const d = Math.floor(hours / 24);
    const h = Math.floor(hours % 24);
    const m = Math.floor((hours * 60) % 60);
    if (d > 0) return `${d}d ${h}h ${m}m`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub-header with Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f141c] border border-orange-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-md shadow-orange-950/50">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-hud font-bold text-white flex items-center gap-2">
              <span>BASE UPKEEP & TC DECAY SIMULATOR</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                FACEPUNCH PROGRESSIVE TAX
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Calculate exact 24h Tool Cupboard costs, tax curves, and decay countdowns.
            </p>
          </div>
        </div>

        {/* Quick Base Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-hud text-slate-400 mr-1">Presets:</span>
          {BASE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-[#080b10] hover:bg-orange-950/50 border border-white/[0.08] hover:border-orange-500/40 text-xs font-hud text-slate-300 hover:text-orange-300 transition-colors cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="p-1 rounded-lg bg-[#080b10] hover:bg-slate-800 border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
            title="Reset to 2x2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Structure Block Inputs & Tax Curve (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Building Blocks Matrix */}
          <div className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.09] space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-hud font-bold text-white uppercase tracking-wider">
                  Base Structure Footprint (Building Blocks)
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-950/80 border border-orange-500/30">
                {totalBlocks} Total Blocks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Wood Blocks */}
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-hud font-bold text-amber-400">
                    WOOD BLOCKS
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    300 wood/block
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={woodBlocks}
                    onChange={(e) => setWoodBlocks(Number(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={woodBlocks}
                    onChange={(e) => setWoodBlocks(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-2 py-1 bg-[#141b26] border border-white/10 rounded-lg text-right font-mono font-bold text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Stone Blocks */}
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-hud font-bold text-slate-300">
                    STONE BLOCKS
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    300 stone/block
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="400"
                    value={stoneBlocks}
                    onChange={(e) => setStoneBlocks(Number(e.target.value))}
                    className="flex-1 accent-slate-400 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={stoneBlocks}
                    onChange={(e) => setStoneBlocks(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-2 py-1 bg-[#141b26] border border-white/10 rounded-lg text-right font-mono font-bold text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Metal Blocks */}
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-hud font-bold text-cyan-400">
                    SHEET METAL BLOCKS
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    200 metal/block
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={metalBlocks}
                    onChange={(e) => setMetalBlocks(Number(e.target.value))}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={metalBlocks}
                    onChange={(e) => setMetalBlocks(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-2 py-1 bg-[#141b26] border border-white/10 rounded-lg text-right font-mono font-bold text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* HQM Blocks */}
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-hud font-bold text-sky-400">
                    ARMORED BLOCKS (HQM)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    25 HQM/block
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hqmBlocks}
                    onChange={(e) => setHqmBlocks(Number(e.target.value))}
                    className="flex-1 accent-sky-400 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={hqmBlocks}
                    onChange={(e) => setHqmBlocks(Math.max(0, Number(e.target.value)))}
                    className="w-16 px-2 py-1 bg-[#141b26] border border-white/10 rounded-lg text-right font-mono font-bold text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Progressive Tax Bracket Breakdown */}
            <div className="pt-3 border-t border-white/[0.07] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-hud font-bold text-slate-300">
                  PROGRESSIVE TAX RATE CURVE
                </span>
                <span className="text-xs font-mono font-bold text-orange-400">
                  {(effectiveTaxRate * 100).toFixed(1)}% Effective Tax
                </span>
              </div>

              {/* Visual Multi-Segment Bracket Bar */}
              <div className="h-3 w-full bg-[#080b10] rounded-full overflow-hidden flex border border-white/10">
                <div 
                  style={{ width: `${Math.min(100, (Math.min(totalBlocks, 15) / totalBlocks) * 100 || 0)}%` }} 
                  className="bg-emerald-500 h-full" 
                  title="Bracket 1 (1-15): 10%" 
                />
                <div 
                  style={{ width: `${Math.min(100, (Math.max(0, Math.min(totalBlocks, 40) - 15) / totalBlocks) * 100 || 0)}%` }} 
                  className="bg-cyan-500 h-full" 
                  title="Bracket 2 (16-40): 15%" 
                />
                <div 
                  style={{ width: `${Math.min(100, (Math.max(0, Math.min(totalBlocks, 75) - 40) / totalBlocks) * 100 || 0)}%` }} 
                  className="bg-amber-500 h-full" 
                  title="Bracket 3 (41-75): 20%" 
                />
                <div 
                  style={{ width: `${Math.min(100, (Math.max(0, totalBlocks - 75) / totalBlocks) * 100 || 0)}%` }} 
                  className="bg-red-500 h-full" 
                  title="Bracket 4 (>75): 33.3%" 
                />
              </div>

              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center text-slate-400">
                <div className="p-1 rounded bg-[#090d14] border border-emerald-500/20 text-emerald-300">
                  1-15: 10%
                </div>
                <div className="p-1 rounded bg-[#090d14] border border-cyan-500/20 text-cyan-300">
                  16-40: 15%
                </div>
                <div className="p-1 rounded bg-[#090d14] border border-amber-500/20 text-amber-300">
                  41-75: 20%
                </div>
                <div className="p-1 rounded bg-[#090d14] border border-red-500/20 text-red-300">
                  &gt;75: 33.3%
                </div>
              </div>
            </div>
          </div>

          {/* Empty TC Decay Benchmarks */}
          <div className="p-4 rounded-2xl bg-[#090d14] border border-white/[0.08] space-y-3">
            <span className="text-xs font-hud font-bold text-slate-300 flex items-center gap-1.5">
              <Hourglass className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL DECAY TIMELINES (IF TC STORES 0 RESOURCES)</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0f141c] border border-amber-500/20 text-center">
                <div className="text-[10px] font-hud text-amber-400">WOOD</div>
                <div className="text-base font-mono font-bold text-white">2 Hours</div>
                <div className="text-[9px] text-slate-500">120 minutes</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0f141c] border border-slate-500/20 text-center">
                <div className="text-[10px] font-hud text-slate-300">STONE</div>
                <div className="text-base font-mono font-bold text-white">4 Hours</div>
                <div className="text-[9px] text-slate-500">240 minutes</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0f141c] border border-cyan-500/20 text-center">
                <div className="text-[10px] font-hud text-cyan-400">SHEET METAL</div>
                <div className="text-base font-mono font-bold text-white">8 Hours</div>
                <div className="text-[9px] text-slate-500">480 minutes</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0f141c] border border-sky-500/20 text-center">
                <div className="text-[10px] font-hud text-sky-400">ARMORED (HQM)</div>
                <div className="text-base font-mono font-bold text-white">12 Hours</div>
                <div className="text-[9px] text-slate-500">720 minutes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: TC Simulator, 24h Consumption & Depletion Bottleneck (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Daily 24h Consumption Summary Card */}
          <div className="p-5 rounded-2xl bg-[#0f141c] border-2 border-orange-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-400" />
                <span className="font-hud font-bold text-sm text-white">
                  24-HOUR TC CONSUMPTION
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Rate: {(effectiveTaxRate * 100).toFixed(1)}%
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Wood Upkeep */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-300 font-hud">Wood</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white text-sm">
                    {dailyConsumption.wood.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {hourlyConsumption.wood}/hr
                  </div>
                </div>
              </div>

              {/* Stone Upkeep */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-slate-300 font-hud">Stone</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white text-sm">
                    {dailyConsumption.stone.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {hourlyConsumption.stone}/hr
                  </div>
                </div>
              </div>

              {/* Metal Frags Upkeep */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="text-slate-300 font-hud">Metal Frags</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-cyan-300 text-sm">
                    {dailyConsumption.metal.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {hourlyConsumption.metal}/hr
                  </div>
                </div>
              </div>

              {/* HQM Upkeep */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-slate-300 font-hud">HQM</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sky-300 text-sm">
                    {dailyConsumption.hqm.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {hourlyConsumption.hqm}/hr
                  </div>
                </div>
              </div>
            </div>

            {/* TC Inventory Stored Simulator */}
            <div className="pt-3 border-t border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-hud font-bold text-white uppercase tracking-wider">
                  TC Storage Simulator
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Enter current chest/TC counts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-hud text-slate-400">STORED WOOD</label>
                  <input
                    type="number"
                    value={storedWood}
                    onChange={(e) => setStoredWood(Math.max(0, Number(e.target.value)))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-[#080b11] border border-white/10 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-hud text-slate-400">STORED STONE</label>
                  <input
                    type="number"
                    value={storedStone}
                    onChange={(e) => setStoredStone(Math.max(0, Number(e.target.value)))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-[#080b11] border border-white/10 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-hud text-slate-400">STORED METAL</label>
                  <input
                    type="number"
                    value={storedMetal}
                    onChange={(e) => setStoredMetal(Math.max(0, Number(e.target.value)))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-[#080b11] border border-white/10 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-hud text-slate-400">STORED HQM</label>
                  <input
                    type="number"
                    value={storedHqm}
                    onChange={(e) => setStoredHqm(Math.max(0, Number(e.target.value)))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-[#080b11] border border-white/10 rounded-lg font-mono text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Protection Remaining Banner with Bottleneck Indicator */}
              <div className={`p-4 rounded-xl border mt-3 space-y-1.5 ${
                remainingHours.minHours <= 6
                  ? 'bg-red-950/60 border-red-500/50'
                  : remainingHours.minHours <= 24
                  ? 'bg-amber-950/60 border-amber-500/50'
                  : 'bg-emerald-950/60 border-emerald-500/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-hud font-bold">
                    {remainingHours.minHours <= 6 ? (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-white">BASE PROTECTION TIME</span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    remainingHours.minHours <= 6 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {remainingHours.minHours <= 6 ? 'CRITICAL' : 'PROTECTED'}
                  </span>
                </div>

                <div className="text-2xl font-mono font-black text-white">
                  {formatTime(remainingHours.minHours)}
                </div>

                {remainingHours.bottleneck && (
                  <div className="text-[11px] font-sans text-slate-300">
                    ⚠️ <span className="font-semibold text-white">{remainingHours.bottleneck.name}</span> will run out first! Refill TC before this window expires.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
