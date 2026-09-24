import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Crosshair, 
  Flame, 
  Zap, 
  Bomb, 
  Box, 
  Sparkles, 
  ExternalLink,
  Layers,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { ServerRatePreset } from '../types';
import { INDUSTRIAL_FORGE_MECHANICS } from '../data/arkMechanics';
import { TekImage } from './common/TekImage';

interface TribeResourceHubProps {
  currentPreset: ServerRatePreset;
  onOpenStoreModal: () => void;
}

export const TribeResourceHub: React.FC<TribeResourceHubProps> = ({
  currentPreset,
  onOpenStoreModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'arb' | 'tek' | 'raid' | 'forge'>('arb');

  // ARB State
  const [heavyTurretCount, setHeavyTurretCount] = useState<number>(50);
  const [bulletsPerTurret, setBulletsPerTurret] = useState<number>(5000); // 50 stacks

  // TEK Turret State
  const [tekTurretCount, setTekTurretCount] = useState<number>(20);
  const [shardsPerTurret, setShardsPerTurret] = useState<number>(2000);

  // Raid Planner State
  const [targetType, setTargetType] = useState<string>('vault');
  const [targetQuantity, setTargetQuantity] = useState<number>(3);

  // Forge Runs State
  const [rawMetalInput, setRawMetalInput] = useState<number>(100000); // 100k raw metal
  const [woodForCharcoal, setWoodForCharcoal] = useState<number>(100000);

  // --- ARB Calculations ---
  // In Ark: 2 ARB requires 9 Gunpowder + 1 Metal Ingot
  // 1 Gunpowder (in Chem Bench) requires 1 Sparkpowder + 1 Charcoal (gives 6 GP for 4 SP + 4 Charcoal -> 1.5 ratio)
  // Sparkpowder requires 1 Flint + 2 Stone (gives 6 SP for 4 Flint + 8 Stone)
  const totalArbNeeded = heavyTurretCount * bulletsPerTurret;
  const arbIngotsNeeded = Math.ceil(totalArbNeeded * 0.5);
  const arbGunpowderNeeded = Math.ceil(totalArbNeeded * 4.5);
  const arbSparkpowderNeeded = Math.ceil(arbGunpowderNeeded / 1.5);
  const arbCharcoalNeeded = Math.ceil(arbGunpowderNeeded / 1.5);
  const arbFlintNeeded = Math.ceil(arbSparkpowderNeeded * (4 / 6));
  const arbStoneNeeded = Math.ceil(arbSparkpowderNeeded * (8 / 6));

  // Chem bench run time (approx 10,000 GP per hour per chem bench)
  const chemBenchHours = (arbGunpowderNeeded / 10000).toFixed(1);

  // --- Tek Turret Calculations ---
  // 1 Element = 100 Shards. 2 Shards per burst shot.
  const totalShardsNeeded = tekTurretCount * shardsPerTurret;
  const totalElementNeeded = Math.ceil(totalShardsNeeded / 100);
  const totalTekShots = Math.floor(totalShardsNeeded / 2);

  // --- Raid Target Structures ---
  const raidTargets: Record<string, { name: string; c4PerUnit: number; rocketsPerUnit: number; hp: number }> = {
    vault: { name: 'Vault (Metal)', c4PerUnit: 16, rocketsPerUnit: 48, hp: 50000 },
    heavy_turret: { name: 'Heavy Auto Turret', c4PerUnit: 2, rocketsPerUnit: 6, hp: 20000 },
    tek_turret: { name: 'Tek Turret', c4PerUnit: 3, rocketsPerUnit: 9, hp: 30000 },
    tek_wall: { name: 'Tek Wall / Gate', c4PerUnit: 2, rocketsPerUnit: 12, hp: 20000 },
    metal_wall: { name: 'Metal Wall', c4PerUnit: 1, rocketsPerUnit: 3, hp: 10000 },
    giant_hatch: { name: 'Giant Metal Trapdoor', c4PerUnit: 4, rocketsPerUnit: 12, hp: 20000 },
    tek_gen: { name: 'Tek Generator', c4PerUnit: 2, rocketsPerUnit: 6, hp: 15000 }
  };

  const selectedTarget = raidTargets[targetType] || raidTargets.vault;
  const totalC4 = selectedTarget.c4PerUnit * targetQuantity;
  const totalRockets = selectedTarget.rocketsPerUnit * targetQuantity;

  // C4 Crafting: 1 C4 = 60 Gunpowder, 10 Crystal, 5 Polymer, 50 Fiber, 5 Hide, 5 Electronics
  const c4Gunpowder = totalC4 * 60;
  const c4Polymer = totalC4 * 5;
  const c4Crystal = totalC4 * 10;
  const c4Electronics = totalC4 * 5;

  // --- Forge Smelting ---
  // Verified DevKit Industrial Forge: 1 batch = 40 Raw Metal -> 20 Metal Ingots every 1.50 seconds
  const refinedIngots = Math.floor(rawMetalInput / INDUSTRIAL_FORGE_MECHANICS.rawMetalToIngotRatio);
  const indyForgeSmeltSeconds = INDUSTRIAL_FORGE_MECHANICS.calculateSmeltTimeSeconds(rawMetalInput);
  const indyForgeCharcoalSeconds = INDUSTRIAL_FORGE_MECHANICS.calculateCharcoalTimeSeconds(woodForCharcoal);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-[#0b121e] border border-cyan-500/30 rounded-xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                The Pitsoni Empire Logistics Engine
              </span>
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                Official PvP Tribe Hub
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-hud text-white mt-1">
              TRIBE RESOURCE & PVP QUOTA CALCULATOR
            </h2>
            <p className="text-xs text-slate-400">
              Calculate exact deathwall bullet quotas, gunpowder breakdown, Tek shard upkeep, and raid breaching costs.
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-800 pt-3">
          <button
            onClick={() => setActiveSubTab('arb')}
            className={`px-3 py-2 rounded-lg text-xs font-hud font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'arb'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-[#121c2c] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Heavy Turret ARB</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tek')}
            className={`px-3 py-2 rounded-lg text-xs font-hud font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'tek'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-[#121c2c] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tek Turrets & Shards</span>
          </button>

          <button
            onClick={() => setActiveSubTab('raid')}
            className={`px-3 py-2 rounded-lg text-xs font-hud font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'raid'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-[#121c2c] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Bomb className="w-3.5 h-3.5" />
            <span>Raid & C4 Explosives</span>
          </button>

          <button
            onClick={() => setActiveSubTab('forge')}
            className={`px-3 py-2 rounded-lg text-xs font-hud font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'forge'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-[#121c2c] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Indy Forge & Smelting</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: HEAVY TURRET ARB */}
      {activeSubTab === 'arb' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-5 bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                TURRET CONFIGURATION
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-tek text-slate-300 mb-1">
                    <span>HEAVY TURRET COUNT</span>
                    <span className="text-cyan-400 font-bold">{heavyTurretCount} Turrets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="300"
                      value={heavyTurretCount}
                      onChange={(e) => setHeavyTurretCount(parseInt(e.target.value) || 1)}
                      className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={heavyTurretCount}
                      onChange={(e) => setHeavyTurretCount(parseInt(e.target.value) || 1)}
                      className="w-16 bg-black/60 border border-cyan-500/40 rounded text-cyan-300 text-center font-tek font-bold text-xs py-1"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    {[20, 50, 100, 150, 200].map(cnt => (
                      <button
                        key={cnt}
                        onClick={() => setHeavyTurretCount(cnt)}
                        className={`px-2 py-0.5 text-[10px] font-tek font-bold rounded cursor-pointer ${
                          heavyTurretCount === cnt ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-tek text-slate-300 mb-1">
                    <span>BULLETS PER TURRET</span>
                    <span className="text-amber-400 font-bold">{bulletsPerTurret.toLocaleString()} ARB ({bulletsPerTurret / 100} Stacks)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="500"
                      value={bulletsPerTurret}
                      onChange={(e) => setBulletsPerTurret(parseInt(e.target.value) || 500)}
                      className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <input
                      type="number"
                      min="100"
                      max="10000"
                      step="100"
                      value={bulletsPerTurret}
                      onChange={(e) => setBulletsPerTurret(parseInt(e.target.value) || 100)}
                      className="w-20 bg-black/60 border border-amber-500/40 rounded text-amber-300 text-center font-tek font-bold text-xs py-1"
                    />
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    {[2500, 5000, 7500, 10000].map(b => (
                      <button
                        key={b}
                        onClick={() => setBulletsPerTurret(b)}
                        className={`px-2 py-0.5 text-[10px] font-tek font-bold rounded cursor-pointer ${
                          bulletsPerTurret === b ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {b / 100} Stacks ({b / 1000}k)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Output Card */}
              <div className="bg-[#070e1a] border border-cyan-500/30 rounded-xl p-4 mt-4 flex items-center gap-4">
                <TekImage 
                  src="/images/arb.jpg" 
                  alt="Advanced Rifle Bullet (ARB) ammunition stack crate utilized in automated heavy defense turrets" 
                  variant="card"
                  loadingLabel="LOADING AMMUNITION CRATE..."
                  containerClassName="w-14 h-14 rounded-xl border-2 border-cyan-500/40 p-0.5 bg-black/60 shadow-lg shadow-cyan-500/20 shrink-0"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div>
                  <div className="text-[10px] text-slate-400 font-tek uppercase">Total Deathwall Ammo Target</div>
                  <div className="text-2xl sm:text-3xl font-tek font-bold text-cyan-300 mt-0.5">
                    {totalArbNeeded.toLocaleString()} ARB
                  </div>
                  <div className="text-xs text-slate-400 font-hud">
                    {(totalArbNeeded / 100).toLocaleString()} Ammo Boxes / Stacks (Advanced Rifle Bullets)
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown Quotas */}
            <div className="lg:col-span-7 bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                EXACT FARMING & CRAFTING INGREDIENTS
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 font-tek uppercase">Gunpowder (GP)</div>
                  <div className="text-lg font-tek font-bold text-amber-300 mt-0.5">
                    {arbGunpowderNeeded.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">4.5 GP per bullet</div>
                </div>

                <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 font-tek uppercase">Metal Ingots</div>
                  <div className="text-lg font-tek font-bold text-cyan-300 mt-0.5">
                    {arbIngotsNeeded.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">{(arbIngotsNeeded * 2).toLocaleString()} raw metal</div>
                </div>

                <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 font-tek uppercase">Sparkpowder</div>
                  <div className="text-lg font-tek font-bold text-emerald-300 mt-0.5">
                    {arbSparkpowderNeeded.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">Craft in Chem Bench</div>
                </div>

                <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 font-tek uppercase">Charcoal</div>
                  <div className="text-lg font-tek font-bold text-purple-300 mt-0.5">
                    {arbCharcoalNeeded.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">Burn in Indy Forge</div>
                </div>

                <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 font-tek uppercase">Raw Flint</div>
                  <div className="text-lg font-tek font-bold text-slate-200 mt-0.5">
                    {arbFlintNeeded.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">Anky mountain runs</div>
                </div>

                <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 font-tek uppercase">Raw Stone</div>
                  <div className="text-lg font-tek font-bold text-slate-200 mt-0.5">
                    {arbStoneNeeded.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500">Doedicurus runs</div>
                </div>
              </div>

              {/* Chem bench advice */}
              <div className="bg-[#070e1a] border border-cyan-500/20 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Chemistry Bench Estimation:</strong> Crafting {arbGunpowderNeeded.toLocaleString()} GP takes roughly{' '}
                  <span className="text-cyan-300 font-bold font-tek">{chemBenchHours} hours</span> on a single Chem Bench. 
                  Recommended: Run a line of <strong>4 Chemistry Benches simultaneously</strong> to finish in ~{Math.ceil(parseFloat(chemBenchHours) / 4)} hours.
                </div>
              </div>

              {/* PK Store Sponsor Callout */}
              <div className="bg-gradient-to-r from-[#1c1208] to-[#120a04] border border-amber-500/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-amber-300 font-hud flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    NEED {totalArbNeeded.toLocaleString()} ARB FAST BEFORE GETTING RAIDED?
                  </div>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">
                    Skip 20+ hours of metal and stone grinding. PK Store delivers 250k - 1,000,000+ ARB crates directly on Official PvP.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={onOpenStoreModal}
                    className="px-2.5 py-1 text-xs font-hud font-bold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 rounded cursor-pointer"
                  >
                    Check Price
                  </button>
                  <a
                    href="https://discord.gg/C9pD2yduw9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-hud font-bold text-xs rounded flex items-center gap-1"
                  >
                    <span>Discord</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: TEK TURRETS & SHARDS */}
      {activeSubTab === 'tek' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              TEK TURRET CONFIGURATION
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-tek text-slate-300 mb-1">
                  <span>TEK TURRET COUNT</span>
                  <span className="text-cyan-400 font-bold">{tekTurretCount} Tek Turrets</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={tekTurretCount}
                  onChange={(e) => setTekTurretCount(parseInt(e.target.value) || 1)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-tek text-slate-300 mb-1">
                  <span>SHARDS PER TEK TURRET</span>
                  <span className="text-amber-400 font-bold">{shardsPerTurret.toLocaleString()} Shards</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="200"
                  value={shardsPerTurret}
                  onChange={(e) => setShardsPerTurret(parseInt(e.target.value) || 200)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            <div className="bg-[#070e1a] border border-cyan-500/30 rounded-xl p-4 text-center mt-4">
              <div className="text-[10px] text-slate-400 font-tek uppercase">Total Element Shards Needed</div>
              <div className="text-2xl sm:text-3xl font-tek font-bold text-cyan-300 mt-1">
                {totalShardsNeeded.toLocaleString()} Shards
              </div>
              <div className="text-xs text-amber-300 font-tek mt-0.5">
                = {totalElementNeeded.toLocaleString()} Full Element (or {totalTekShots.toLocaleString()} Plasma Bursts)
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              TEK GENERATOR UPKEEP & RANGE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3">
                <div className="text-xs font-hud font-bold text-slate-200">1.0x Radius Power</div>
                <div className="text-sm font-tek font-bold text-cyan-300 mt-1">1 Element per 24 Hours</div>
                <p className="text-[11px] text-slate-400 mt-1">Perfect for small cave chokes or rat holes.</p>
              </div>

              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3">
                <div className="text-xs font-hud font-bold text-slate-200">5.0x Max Radius Power</div>
                <div className="text-sm font-tek font-bold text-amber-300 mt-1">5 Element per 24 Hours</div>
                <p className="text-[11px] text-slate-400 mt-1">Powers entire compound deathwalls.</p>
              </div>
            </div>

            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-3 text-xs text-slate-300">
              <strong>PvP Meta Tip:</strong> Tek Turrets shoot through enemy Stego hardened plates, dealing direct plasma splash damage to the rider! Always mix 1 Tek Turret for every 4 Heavy Auto Turrets on official PvP.
            </div>

            {/* PK Store Tek Sponsor */}
            <div className="bg-[#140d06] border border-amber-500/40 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-300 font-hud">Need Element Shards or Tek Kits?</div>
                <div className="text-[11px] text-slate-400">PK Store supplies pre-farmed Element & Shards on Official.</div>
              </div>
              <a
                href="https://discord.gg/C9pD2yduw9"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-amber-500 text-black text-xs font-hud font-bold rounded flex items-center gap-1"
              >
                <span>Discord</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: RAID PLANNER & C4 */}
      {activeSubTab === 'raid' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
              <Bomb className="w-4 h-4 text-cyan-400" />
              TARGET STRUCTURE BREACH PLANNER
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-tek text-slate-300">SELECT TARGET STRUCTURE</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full bg-[#070e1a] border border-slate-700 text-slate-100 rounded-lg p-2 text-xs font-hud mt-1"
                >
                  {Object.entries(raidTargets).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.name} (HP: {info.hp.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-tek text-slate-300 mb-1">
                  <span>TARGET QUANTITY</span>
                  <span className="text-cyan-400 font-bold">{targetQuantity} units</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(parseInt(e.target.value) || 1)}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-center">
              <div className="bg-[#070e1a] border border-amber-500/30 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 font-tek uppercase">C4 Charges Needed</div>
                <div className="text-2xl font-tek font-bold text-amber-300 mt-1">{totalC4}x C4</div>
                <div className="text-[10px] text-slate-500">{selectedTarget.c4PerUnit} C4 each</div>
              </div>

              <div className="bg-[#070e1a] border border-cyan-500/30 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Or Rocket RPGs</div>
                <div className="text-2xl font-tek font-bold text-cyan-300 mt-1">{totalRockets}x RPGs</div>
                <div className="text-[10px] text-slate-500">{selectedTarget.rocketsPerUnit} rockets each</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-cyan-400" />
              MATERIALS FOR {totalC4}x C4 CHARGES
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Gunpowder</div>
                <div className="text-lg font-tek font-bold text-amber-300 mt-0.5">{c4Gunpowder.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">60 per C4</div>
              </div>

              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Polymer</div>
                <div className="text-lg font-tek font-bold text-cyan-300 mt-0.5">{c4Polymer.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">5 per C4</div>
              </div>

              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Crystal</div>
                <div className="text-lg font-tek font-bold text-purple-300 mt-0.5">{c4Crystal.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">10 per C4</div>
              </div>

              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Electronics</div>
                <div className="text-lg font-tek font-bold text-emerald-300 mt-0.5">{c4Electronics.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">5 per C4</div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-300">
              <strong>PvP Raid Tip:</strong> Keep C4 detonators hotkeyed to Slot 8. When blowing enemy vault walls, place 16 C4 simultaneously on the pin code pad to instagib the vault before defenders can repair!
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: FORGE & SMELTING */}
      {activeSubTab === 'forge' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-cyan-400" />
              RAW METAL SMELTING ESTIMATOR
            </h3>

            <div>
              <div className="flex items-center justify-between text-xs font-tek text-slate-300 mb-1">
                <span>RAW METAL INPUT</span>
                <span className="text-cyan-400 font-bold">{rawMetalInput.toLocaleString()} Metal</span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={rawMetalInput}
                onChange={(e) => setRawMetalInput(parseInt(e.target.value) || 10000)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-center">
              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Refined Metal Ingots</div>
                <div className="text-xl font-tek font-bold text-cyan-300 mt-1">{refinedIngots.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">2 Raw = 1 Ingot</div>
              </div>

              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Indy Forge Smelt Time</div>
                <div className="text-xl font-tek font-bold text-amber-300 mt-1">
                  {Math.ceil(indyForgeSmeltSeconds / 60)} Minutes
                </div>
                <div className="text-[10px] text-slate-500">40 raw / 1.5s cycle (26.7/s)</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              CHARCOAL BAKE ESTIMATOR
            </h3>

            <div>
              <div className="flex items-center justify-between text-xs font-tek text-slate-300 mb-1">
                <span>WOOD QUANTITY TO BURN</span>
                <span className="text-purple-400 font-bold">{woodForCharcoal.toLocaleString()} Wood</span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={woodForCharcoal}
                onChange={(e) => setWoodForCharcoal(parseInt(e.target.value) || 10000)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-center">
              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Charcoal Yield</div>
                <div className="text-xl font-tek font-bold text-purple-300 mt-1">{woodForCharcoal.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">1 Wood = 1 Charcoal</div>
              </div>

              <div className="bg-[#070e1a] border border-slate-800 rounded-lg p-3">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Indy Forge Bake Time</div>
                <div className="text-xl font-tek font-bold text-amber-300 mt-1">
                  {Math.ceil(indyForgeCharcoalSeconds / 60)} Minutes
                </div>
                <div className="text-[10px] text-slate-500">Single Industrial Forge</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
