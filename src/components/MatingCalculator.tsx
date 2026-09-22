import React, { useState, useMemo } from 'react';
import { 
  Egg, 
  Search, 
  Thermometer, 
  Clock, 
  Heart, 
  Flame, 
  Snowflake, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Creature, ServerRatePreset, ActiveTimer } from '../types';
import { CREATURES_DATA } from '../data/creatures';

interface MatingCalculatorProps {
  currentPreset: ServerRatePreset;
  onAddTimer: (timer: Omit<ActiveTimer, 'id'>) => void;
  onOpenStoreModal: () => void;
}

export const MatingCalculator: React.FC<MatingCalculatorProps> = ({
  currentPreset,
  onAddTimer,
  onOpenStoreModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreatureId, setSelectedCreatureId] = useState<string>('carcharodontosaurus');
  const [customHatchMult, setCustomHatchMult] = useState<number>(currentPreset.eggHatchMult);
  const [customMatureMult, setCustomMatureMult] = useState<number>(currentPreset.babyMatureMult);

  React.useEffect(() => {
    setCustomHatchMult(currentPreset.eggHatchMult);
    setCustomMatureMult(currentPreset.babyMatureMult);
  }, [currentPreset]);

  // Creatures that can breed
  const breedableCreatures = useMemo(() => {
    return CREATURES_DATA.filter(c => c.breeding !== undefined);
  }, []);

  const filteredCreatures = useMemo(() => {
    if (!searchQuery.trim()) return breedableCreatures;
    const q = searchQuery.toLowerCase();
    return breedableCreatures.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.dlc.toLowerCase().includes(q) ||
      c.breeding?.type.toLowerCase().includes(q)
    );
  }, [searchQuery, breedableCreatures]);

  const creature = useMemo(() => {
    return breedableCreatures.find(c => c.id === selectedCreatureId) || breedableCreatures[0];
  }, [selectedCreatureId, breedableCreatures]);

  const breedingInfo = creature.breeding!;

  // Incubation / Gestation time in seconds
  const hatchDurationSec = useMemo(() => {
    return Math.max(30, Math.round(breedingInfo.incubationSecondsBase / customHatchMult));
  }, [breedingInfo, customHatchMult]);

  // Maturation time in seconds
  const matureDurationSec = useMemo(() => {
    return Math.max(60, Math.round(breedingInfo.maturationSecondsBase / customMatureMult));
  }, [breedingInfo, customMatureMult]);

  // Baby phase (first 10% of maturation)
  const babyPhaseSec = useMemo(() => {
    return Math.round(matureDurationSec * 0.1);
  }, [matureDurationSec]);

  // Juvenile phase (10% to 50%)
  const juvenilePhaseSec = useMemo(() => {
    return Math.round(matureDurationSec * 0.4);
  }, [matureDurationSec]);

  // Adolescent phase (50% to 100%)
  const adolescentPhaseSec = useMemo(() => {
    return Math.round(matureDurationSec * 0.5);
  }, [matureDurationSec]);

  // Imprint interval (Official is standard 8h base / multiplier)
  const imprintIntervalSec = useMemo(() => {
    return Math.max(300, Math.round(breedingInfo.imprintIntervalSecondsBase / customMatureMult));
  }, [breedingInfo, customMatureMult]);

  const totalImprintsNeeded = useMemo(() => {
    return Math.max(1, Math.round(matureDurationSec / imprintIntervalSec));
  }, [matureDurationSec, imprintIntervalSec]);

  const imprintPercentagePerAction = useMemo(() => {
    return (100 / totalImprintsNeeded).toFixed(1);
  }, [totalImprintsNeeded]);

  // Estimated Food stacks needed for baby phase (hand-feeding)
  const babyMeatBerryStacks = useMemo(() => {
    const hoursInBaby = babyPhaseSec / 3600;
    const baseStacksPerHour = creature.diet === 'Herbivore' ? 4 : 6;
    return Math.max(1, Math.round(hoursInBaby * baseStacksPerHour * breedingInfo.babyFoodRatio));
  }, [babyPhaseSec, creature, breedingInfo]);

  // Air conditioners recommendation
  const acUnitsRecommended = useMemo(() => {
    const tempDelta = Math.abs(breedingInfo.optimalTempMaxC - 20);
    if (tempDelta > 40) return '14 - 18 Air Conditioners (or 2-3 High Melee Otters / Egg Incubator)';
    if (tempDelta > 20) return '6 - 10 Air Conditioners';
    return '2 - 4 Air Conditioners';
  }, [breedingInfo]);

  const formatDuration = (totalSec: number) => {
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    if (days > 0) return `${days}d ${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Multiplier Presets */}
      <div className="bg-[#0b121e] border border-amber-500/30 rounded-xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded">
                Breeding Preset: {currentPreset.name}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                Hatch: {customHatchMult}x • Mature: {customMatureMult}x
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-hud text-white mt-1">
              BREEDING & INCUBATION CALCULATOR
            </h2>
            <p className="text-xs text-slate-400">
              Calculate exact egg incubation, gestation, trough timings, and set automated imprint alerts for baby lines.
            </p>
          </div>

          {/* Search bar & Rate Overrides */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Giga, Theri, Stego, Pyromane..."
                className="w-full bg-[#070d17] border border-amber-500/30 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-hud"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#070d17] border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-tek">HATCH:</span>
                <input
                  type="number"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={customHatchMult}
                  onChange={(e) => setCustomHatchMult(Math.max(0.5, parseFloat(e.target.value) || 1))}
                  className="w-12 bg-black/50 border border-amber-500/40 rounded text-amber-300 text-center font-tek font-bold text-xs py-0.5"
                />
              </div>

              <div className="bg-[#070d17] border border-slate-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-tek">MATURE:</span>
                <input
                  type="number"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={customMatureMult}
                  onChange={(e) => setCustomMatureMult(Math.max(0.5, parseFloat(e.target.value) || 1))}
                  className="w-12 bg-black/50 border border-amber-500/40 rounded text-amber-300 text-center font-tek font-bold text-xs py-0.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick select chips */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
          {filteredCreatures.slice(0, 10).map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCreatureId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-hud font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                creature.id === c.id
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                  : 'bg-[#121c2c] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[10px] px-1 py-0.2 rounded font-tek bg-black/40 text-amber-200">
                {c.breeding?.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Breeding Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Creature Profile & Incubation Temp Gauge */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0b121e] border border-amber-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-500/40 shrink-0">
                <img 
                  src={creature.image} 
                  alt={`ARK Ascended creature profile for ${creature.name}, displaying ${breedingInfo.type} gestation and incubation metrics`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/placeholder_dino.svg')) {
                      target.src = '/images/placeholder_dino.svg';
                    }
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[10px] text-center font-tek text-amber-300 py-0.5">
                  {breedingInfo.type}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-hud text-white">{creature.name}</h3>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-xs font-tek font-bold">
                    {creature.pvpRole}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-hud mt-0.5">
                  {creature.dlc} • Diet: {creature.diet}
                </div>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                  {creature.pvpDescription}
                </p>
              </div>
            </div>

            {/* Optimal Temperature Gauge */}
            {breedingInfo.type === 'Egg' && (
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-tek">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    OPTIMAL EGG TEMPERATURE
                  </span>
                  <span className="text-amber-300 font-bold">
                    {breedingInfo.optimalTempMinC}°C — {breedingInfo.optimalTempMaxC}°C
                  </span>
                </div>

                <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 via-amber-400 to-red-500"
                    style={{ width: '100%' }}
                  />
                  {/* Indicator marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-2 bg-white shadow-md shadow-black"
                    style={{ left: `${Math.min(95, Math.max(5, (breedingInfo.optimalTempMinC / 90) * 100))}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Incubation Setup:</strong> {acUnitsRecommended}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Incubation Summary */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-center font-tek text-xs">
              <div className="bg-[#070e1a] border border-amber-500/20 rounded-lg p-2.5">
                <div className="text-slate-400 text-[10px] uppercase">
                  {breedingInfo.type === 'Egg' ? 'Hatch Time' : 'Gestation Time'}
                </div>
                <div className="text-amber-300 font-bold text-sm mt-0.5">
                  {formatDuration(hatchDurationSec)}
                </div>
              </div>

              <div className="bg-[#070e1a] border border-amber-500/20 rounded-lg p-2.5">
                <div className="text-slate-400 text-[10px] uppercase">Total Maturation</div>
                <div className="text-cyan-300 font-bold text-sm mt-0.5">
                  {formatDuration(matureDurationSec)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Alarm Launcher */}
          <div className="bg-[#0b121e] border border-amber-500/30 rounded-xl p-5 shadow-xl space-y-3">
            <h4 className="text-sm font-bold font-hud text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              ONE-CLICK BREEDING ALARMS
            </h4>

            <button
              onClick={() => {
                onAddTimer({
                  title: `${breedingInfo.type === 'Egg' ? 'Egg Hatch' : 'Gestation'}: ${creature.name}`,
                  creatureName: creature.name,
                  type: 'egg_hatch',
                  targetTimestamp: Date.now() + hatchDurationSec * 1000,
                  totalDurationSeconds: hatchDurationSec,
                  notes: `Egg is hatching! Have ${babyMeatBerryStacks} stacks of ${creature.diet === 'Herbivore' ? 'Berries' : 'Meat'} ready to hand-feed.`
                });
              }}
              className="w-full px-3 py-2.5 bg-gradient-to-r from-amber-950/60 to-amber-900/40 hover:from-amber-900/80 hover:to-amber-800/60 border border-amber-500/40 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-hud font-bold text-amber-200">
                <span>SET {breedingInfo.type.toUpperCase()} TIMER</span>
                <span className="font-tek text-amber-300">{formatDuration(hatchDurationSec)}</span>
              </div>
              <p className="text-[11px] text-amber-300/70 mt-0.5">
                Alerts right before egg hatches so baby doesn't starve to death on floor.
              </p>
            </button>

            <button
              onClick={() => {
                onAddTimer({
                  title: `Imprint Alarm: ${creature.name}`,
                  creatureName: creature.name,
                  type: 'baby_imprint',
                  targetTimestamp: Date.now() + imprintIntervalSec * 1000,
                  totalDurationSeconds: imprintIntervalSec,
                  notes: `Imprint cuddle / walk / kibble request (+${imprintPercentagePerAction}% imprint stat boost).`
                });
              }}
              className="w-full px-3 py-2.5 bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 hover:from-emerald-900/80 hover:to-emerald-800/60 border border-emerald-500/40 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-hud font-bold text-emerald-200">
                <span>SET NEXT IMPRINT ALARM</span>
                <span className="font-tek text-emerald-300">{formatDuration(imprintIntervalSec)}</span>
              </div>
              <p className="text-[11px] text-emerald-300/70 mt-0.5">
                Alarms every {formatDuration(imprintIntervalSec)} to hit 100% imprint (+20% stats, +30% rider buff).
              </p>
            </button>
          </div>
        </div>

        {/* Right Column: Maturation Stages & Food Consumption */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b121e] border border-amber-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold font-hud text-amber-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              MATURATION PHASES & TROUGH TIMINGS
            </h4>

            {/* Visual Timeline */}
            <div className="space-y-3">
              {/* Baby Phase Card */}
              <div className="bg-[#070e1a] border border-red-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 font-tek font-bold text-xs">
                    0-10%
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-hud font-bold text-red-300 flex items-center gap-1.5">
                      <span>BABY STAGE (HAND-FEED ONLY)</span>
                      <span className="px-1.5 py-0.2 bg-red-500/20 text-red-300 text-[9px] rounded font-tek font-bold">
                        HIGH RISK
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Cannot eat from feeding trough! Must keep inventory packed with food.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-tek font-bold text-red-300">
                    {formatDuration(babyPhaseSec)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ~{babyMeatBerryStacks} stacks required
                  </div>
                </div>
              </div>

              {/* Juvenile Phase Card */}
              <div className="bg-[#070e1a] border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 font-tek font-bold text-xs">
                    10-50%
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-hud font-bold text-amber-300">
                      JUVENILE STAGE (TROUGH ENABLED)
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Can now eat directly from standard feeding troughs or TEK troughs.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-tek font-bold text-amber-300">
                    {formatDuration(juvenilePhaseSec)}
                  </div>
                  <div className="text-[10px] text-slate-400">Normal food consumption</div>
                </div>
              </div>

              {/* Adolescent Phase Card */}
              <div className="bg-[#070e1a] border border-emerald-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 font-tek font-bold text-xs">
                    50-100%
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-hud font-bold text-emerald-300">
                      ADOLESCENT STAGE (FINAL PUSH)
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Large food inventory capacity, finish final imprinting cycles.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-tek font-bold text-emerald-300">
                    {formatDuration(adolescentPhaseSec)}
                  </div>
                  <div className="text-[10px] text-slate-400">Ready for battle saddle</div>
                </div>
              </div>
            </div>

            {/* Imprinting Breakdown Metric */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Imprint Interval</div>
                <div className="text-sm sm:text-base font-tek font-bold text-emerald-400 mt-0.5">
                  {formatDuration(imprintIntervalSec)}
                </div>
              </div>

              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Total Imprints</div>
                <div className="text-sm sm:text-base font-tek font-bold text-amber-400 mt-0.5">
                  {totalImprintsNeeded} times
                </div>
              </div>

              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">% Per Imprint</div>
                <div className="text-sm sm:text-base font-tek font-bold text-cyan-400 mt-0.5">
                  +{imprintPercentagePerAction}%
                </div>
              </div>
            </div>
          </div>

          {/* PK Store Sponsor Promotion for Breeding */}
          <div className="bg-gradient-to-r from-[#1c1208] to-[#120a04] border border-amber-500/40 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300 font-hud">
                  SKIP WEEKS OF MUTATION STACKING WITH PK STORE
                </div>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Don't wait 4 months to breed 254 melee and HP mutations. PK Store offers fully capped, sterile and clean breeding pairs ready for official PvP wars.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={onOpenStoreModal}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 rounded-lg text-amber-200 text-xs font-hud font-semibold cursor-pointer"
              >
                Line Catalog
              </button>
              <a
                href="https://discord.gg/C9pD2yduw9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold font-hud text-xs rounded-lg flex items-center justify-center gap-1 shadow-md shadow-amber-500/20"
              >
                <span>Discord</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
