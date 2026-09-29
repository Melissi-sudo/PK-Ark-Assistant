import React, { useState, useMemo } from 'react';
import { 
  Bomb, 
  ShieldAlert, 
  Flame, 
  Crosshair, 
  Layers, 
  Zap, 
  Sparkles, 
  Calculator, 
  Copy, 
  Check, 
  Info,
  ShieldCheck,
  Target,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StructureTarget {
  id: string;
  name: string;
  category: 'FOB / Gates' | 'Base Walls' | 'Turrets & Power' | 'Storage';
  health: number;
  tier: 'Wood' | 'Stone' | 'Metal' | 'Tek';
  iconColor: string;
}

const STRUCTURE_TARGETS: StructureTarget[] = [
  // Base Walls & Doors
  { id: 'wood_wall', name: 'Wood Wall / Door', category: 'Base Walls', health: 10000, tier: 'Wood', iconColor: 'text-amber-600' },
  { id: 'stone_wall', name: 'Stone Wall / Door', category: 'Base Walls', health: 10000, tier: 'Stone', iconColor: 'text-stone-400' },
  { id: 'metal_wall', name: 'Metal Wall / Ceiling', category: 'Base Walls', health: 10000, tier: 'Metal', iconColor: 'text-cyan-400' },
  { id: 'metal_door', name: 'Metal Door / Hatchframe', category: 'Base Walls', health: 7500, tier: 'Metal', iconColor: 'text-cyan-300' },
  { id: 'tek_wall', name: 'Tek Wall / Ceiling', category: 'Base Walls', health: 10000, tier: 'Tek', iconColor: 'text-purple-400' },
  { id: 'tek_door', name: 'Tek Door / Hatchframe', category: 'Base Walls', health: 7500, tier: 'Tek', iconColor: 'text-purple-300' },

  // FOB & Gates
  { id: 'stone_dino_gate', name: 'Stone Dino Gate', category: 'FOB / Gates', health: 6250, tier: 'Stone', iconColor: 'text-stone-400' },
  { id: 'metal_dino_gate', name: 'Metal Dino Gate', category: 'FOB / Gates', health: 12500, tier: 'Metal', iconColor: 'text-cyan-400' },
  { id: 'metal_behemoth_gate', name: 'Metal Behemoth Gate', category: 'FOB / Gates', health: 50000, tier: 'Metal', iconColor: 'text-cyan-500' },
  { id: 'tek_dino_gate', name: 'Tek Dino Gate', category: 'FOB / Gates', health: 12500, tier: 'Tek', iconColor: 'text-purple-400' },
  { id: 'tek_behemoth_gate', name: 'Tek Behemoth Gate', category: 'FOB / Gates', health: 50000, tier: 'Tek', iconColor: 'text-purple-500' },

  // Turrets & Power
  { id: 'heavy_turret', name: 'Heavy Auto Turret (HAT)', category: 'Turrets & Power', health: 20000, tier: 'Metal', iconColor: 'text-red-400' },
  { id: 'tek_turret', name: 'Tek Turret', category: 'Turrets & Power', health: 30000, tier: 'Tek', iconColor: 'text-purple-400' },
  { id: 'auto_turret', name: 'Standard Auto Turret', category: 'Turrets & Power', health: 3000, tier: 'Metal', iconColor: 'text-amber-400' },
  { id: 'tek_generator', name: 'Tek Generator', category: 'Turrets & Power', health: 25000, tier: 'Tek', iconColor: 'text-cyan-300' },

  // Storage
  { id: 'vault', name: 'Metal Vault', category: 'Storage', health: 50000, tier: 'Metal', iconColor: 'text-blue-400' },
  { id: 'tek_storage', name: 'Tek Dedicated Storage', category: 'Storage', health: 25000, tier: 'Tek', iconColor: 'text-purple-400' },
  { id: 'fabricator', name: 'Fabricator', category: 'Storage', health: 2500, tier: 'Metal', iconColor: 'text-slate-300' }
];

interface ExplosiveWeapon {
  id: string;
  name: string;
  badge: string;
  dmgWood: number;
  dmgStone: number;
  dmgMetal: number;
  dmgTek: number;
  costPerUnit: {
    gunpowder?: number;
    sparkpowder?: number;
    charcoal?: number;
    polymer?: number;
    crystal?: number;
    electronics?: number;
    paste?: number;
    element?: number;
  };
}

const EXPLOSIVE_WEAPONS: ExplosiveWeapon[] = [
  {
    id: 'c4',
    name: 'C4 Charge (Detonator)',
    badge: 'Official PvP Meta',
    dmgWood: 23040,
    dmgStone: 13824,
    dmgMetal: 8640,
    dmgTek: 4320,
    costPerUnit: {
      gunpowder: 60,
      sparkpowder: 60,
      charcoal: 60,
      polymer: 20,
      crystal: 5,
      electronics: 5,
      paste: 50
    }
  },
  {
    id: 'rocket',
    name: 'Rocket Propelled Grenade (RPG)',
    badge: 'Long Range Breach',
    dmgWood: 5760,
    dmgStone: 3456,
    dmgMetal: 2160,
    dmgTek: 1080,
    costPerUnit: {
      gunpowder: 40,
      sparkpowder: 40,
      charcoal: 40,
      polymer: 10,
      crystal: 10,
      paste: 20
    }
  },
  {
    id: 'tek_rifle',
    name: 'Tek Rifle (Element Plasma)',
    badge: 'Tek Armor Buster',
    dmgWood: 450,
    dmgStone: 350,
    dmgMetal: 210,
    dmgTek: 210,
    costPerUnit: {
      element: 0.02 // 50 shots per 1 Element
    }
  },
  {
    id: 'grenade',
    name: 'Standard Grenade',
    badge: 'Budget FOB Clear',
    dmgWood: 1000,
    dmgStone: 600,
    dmgMetal: 375,
    dmgTek: 0,
    costPerUnit: {
      gunpowder: 30,
      sparkpowder: 30,
      charcoal: 30
    }
  },
  {
    id: 'cannon_ball',
    name: 'Cannon Ball (Platform Siege)',
    badge: 'Golem & Turret Wall Killer',
    dmgWood: 12500,
    dmgStone: 7500,
    dmgMetal: 7500,
    dmgTek: 0,
    costPerUnit: {
      gunpowder: 80,
      sparkpowder: 80,
      charcoal: 80,
      paste: 20
    }
  },
  {
    id: 'arthro_spit',
    name: 'Arthopleura Acid Spit (Tamed)',
    badge: 'Infinite Zero-Cost Acid',
    dmgWood: 1500,
    dmgStone: 900,
    dmgMetal: 540,
    dmgTek: 540,
    costPerUnit: {}
  }
];

export const RaidExplosivesCalculator: React.FC = () => {
  const [selectedStructureId, setSelectedStructureId] = useState<string>('metal_wall');
  const [structureCount, setStructureCount] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [flakDurability, setFlakDurability] = useState<number>(1200);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentStructure = useMemo(() => {
    return STRUCTURE_TARGETS.find(s => s.id === selectedStructureId) || STRUCTURE_TARGETS[2];
  }, [selectedStructureId]);

  const totalHealth = currentStructure.health * structureCount;

  // Calculate ammo needed for each weapon
  const weaponCalculations = useMemo(() => {
    return EXPLOSIVE_WEAPONS.map(weapon => {
      let dmgPerHit = 0;
      if (currentStructure.tier === 'Wood') dmgPerHit = weapon.dmgWood;
      else if (currentStructure.tier === 'Stone') dmgPerHit = weapon.dmgStone;
      else if (currentStructure.tier === 'Metal') dmgPerHit = weapon.dmgMetal;
      else if (currentStructure.tier === 'Tek') dmgPerHit = weapon.dmgTek;

      const isImmune = dmgPerHit === 0;
      const countNeeded = isImmune ? 0 : Math.ceil(totalHealth / dmgPerHit);

      // Material costs
      const totalGp = (weapon.costPerUnit.gunpowder || 0) * countNeeded;
      const totalPoly = (weapon.costPerUnit.polymer || 0) * countNeeded;
      const totalPaste = (weapon.costPerUnit.paste || 0) * countNeeded;
      const totalElement = (weapon.costPerUnit.element || 0) * countNeeded;

      return {
        ...weapon,
        dmgPerHit,
        isImmune,
        countNeeded,
        totalGp,
        totalPoly,
        totalPaste,
        totalElement
      };
    });
  }, [currentStructure, totalHealth]);

  // Flak Armor Tank Calculator
  // Pump Action Shotgun 298% Ascendant: 14 pellets * ~64 dmg * 2.98 ~ 2670 point blank raw dmg
  // Armor durability damage taken = (Raw Damage / 16)
  const flakStats = useMemo(() => {
    const rawPointBlankShotgun = 2670;
    const durLossPerShotgunBlast = Math.round(rawPointBlankShotgun / 16); // ~167 dur loss
    const shotgunBlastsToBreak = Math.max(1, Math.ceil(flakDurability / durLossPerShotgunBlast));

    const fabSniperRaw = 165 * 2.98; // ~492 dmg
    const durLossPerSniper = Math.round(fabSniperRaw / 16); // ~31 dur loss
    const sniperHitsToBreak = Math.max(1, Math.ceil(flakDurability / durLossPerSniper));

    return {
      durLossPerShotgunBlast,
      shotgunBlastsToBreak,
      durLossPerSniper,
      sniperHitsToBreak
    };
  }, [flakDurability]);

  const handleCopySummary = (weaponName: string, count: number, totalGp: number) => {
    const text = `[PK War Room Raid Kit] ${structureCount}x ${currentStructure.name} (${totalHealth.toLocaleString()} HP) requires: ${count}x ${weaponName}${totalGp > 0 ? ` (~${totalGp.toLocaleString()} Gunpowder)` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedKey(weaponName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredStructures = useMemo(() => {
    if (activeCategory === 'All') return STRUCTURE_TARGETS;
    return STRUCTURE_TARGETS.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/70 border border-red-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-tek text-xs uppercase tracking-widest">
              <Bomb className="w-4 h-4 text-red-400" />
              <span>ARK: Survival Ascended // Tactical War Room</span>
              <span>•</span>
              <span className="text-amber-300 font-bold">Official Small Tribes Parity</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-hud tracking-wide mt-1">
              Raid & Explosives Breaching Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Calculate exact C4, Rocket, Tek Rifle, and Cannon counts to wipe any enemy structure, gate, vault, or heavy turret. Includes total gunpowder crafting cost and Flak armor wear analysis.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/60 border border-red-500/30 px-3 py-2 rounded-xl text-xs font-mono shrink-0">
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">C4 vs Metal</div>
              <div className="text-amber-300 font-bold text-sm">8,640 DMG / Charge</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Selector & Count */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Card */}
          <div className="bg-[#0b1320] border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-hud font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Step 1: Choose Target Structure
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                {currentStructure.tier} Tier
              </span>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['All', 'Base Walls', 'FOB / Gates', 'Turrets & Power', 'Storage'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-hud transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Structure Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredStructures.map(struct => {
                const isSelected = struct.id === selectedStructureId;
                return (
                  <button
                    key={struct.id}
                    onClick={() => setSelectedStructureId(struct.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-hud font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                        {struct.name}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        struct.tier === 'Tek' 
                          ? 'border-purple-500/40 text-purple-300 bg-purple-950/40' 
                          : struct.tier === 'Metal'
                            ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40'
                            : 'border-slate-700 text-slate-400'
                      }`}>
                        {struct.tier}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      {struct.health.toLocaleString()} HP
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quantity Slider / Input */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-hud">
                <span className="text-slate-300">Structure Stack / Wall Count:</span>
                <span className="text-amber-300 font-mono font-bold text-sm">
                  {structureCount}x ({totalHealth.toLocaleString()} Total HP)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={structureCount}
                  onChange={(e) => setStructureCount(parseInt(e.target.value) || 1)}
                  className="flex-1 accent-cyan-400 cursor-pointer"
                />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={structureCount}
                  onChange={(e) => setStructureCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-center text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Flak Armor Wear Simulator */}
          <div className="bg-[#0b1320] border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-hud font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Flak Armor Durability Wear Simulator
              </span>
              <span className="text-[10px] text-slate-400 font-mono">298% Cap</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In ARK PvP, player armor takes durability damage equal to <strong>Raw Damage / 16</strong>. See how many point-blank shotgun blasts or sniper shots your flak set can absorb before breaking.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-hud">
                <span className="text-slate-400">Flak Armor Piece Durability:</span>
                <span className="font-mono text-cyan-300 font-bold">{flakDurability} Durability</span>
              </div>
              <div className="flex items-center gap-2">
                {[700, 1000, 1200, 1500, 1800].map(dur => (
                  <button
                    key={dur}
                    onClick={() => setFlakDurability(dur)}
                    className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                      flakDurability === dur
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-3 bg-black/40 rounded-xl border border-red-500/20 text-center">
                <div className="text-[10px] text-red-400 font-hud uppercase">Pump Shotgun (298%)</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {flakStats.shotgunBlastsToBreak} <span className="text-xs text-slate-400 font-normal">blasts</span>
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                  -{flakStats.durLossPerShotgunBlast} dur / point blank
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-cyan-500/20 text-center">
                <div className="text-[10px] text-cyan-400 font-hud uppercase">Fabricated Sniper (298%)</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  {flakStats.sniperHitsToBreak} <span className="text-xs text-slate-400 font-normal">shots</span>
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                  -{flakStats.durLossPerSniper} dur / hit
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Required Explosives Matrix */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-hud font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              Calculated Explosives to Wipe: <span className="text-amber-300 font-mono">{structureCount}x {currentStructure.name}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Total Target: {totalHealth.toLocaleString()} HP
            </span>
          </div>

          <div className="space-y-3">
            {weaponCalculations.map(w => (
              <div
                key={w.id}
                className={`p-4 rounded-2xl border transition-all ${
                  w.isImmune
                    ? 'bg-slate-900/30 border-slate-800/50 opacity-50'
                    : w.id === 'c4'
                      ? 'bg-gradient-to-r from-red-950/40 via-slate-900 to-[#0b1320] border-red-500/40 shadow-lg'
                      : 'bg-[#0b1320] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-hud font-bold text-sm text-white">{w.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {w.badge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      {w.isImmune ? (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Deals 0 DMG against {currentStructure.tier} tier structures!
                        </span>
                      ) : (
                        <span>
                          Deals <strong className="text-cyan-300">{w.dmgPerHit.toLocaleString()} DMG</strong> per unit vs {currentStructure.tier}
                        </span>
                      )}
                    </div>
                  </div>

                  {!w.isImmune && (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl font-mono font-black text-amber-300">
                          {w.countNeeded.toLocaleString()} <span className="text-xs text-slate-400 font-normal">units</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">100% Breached</div>
                      </div>

                      <button
                        onClick={() => handleCopySummary(w.name, w.countNeeded, w.totalGp)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Copy Raid Kit Quota to Clipboard"
                      >
                        {copiedKey === w.name ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Material Crafting breakdown */}
                {!w.isImmune && (w.totalGp > 0 || w.totalPoly > 0 || w.totalElement > 0) && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-4 flex-wrap text-xs font-mono">
                    <span className="text-[11px] text-slate-400 font-hud uppercase">Materials Needed:</span>
                    {w.totalGp > 0 && (
                      <span className="text-amber-400">
                        <strong>{w.totalGp.toLocaleString()}</strong> Gunpowder
                      </span>
                    )}
                    {w.totalPoly > 0 && (
                      <span className="text-cyan-300">
                        <strong>{w.totalPoly.toLocaleString()}</strong> Polymer
                      </span>
                    )}
                    {w.totalPaste > 0 && (
                      <span className="text-emerald-400">
                        <strong>{w.totalPaste.toLocaleString()}</strong> Paste
                      </span>
                    )}
                    {w.totalElement > 0 && (
                      <span className="text-purple-300">
                        <strong>{Math.ceil(w.totalElement)}</strong> Element
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tactical Raiding Advice */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
            <div className="font-hud font-bold text-cyan-300 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Pro Tribe Raiding Tips (Official Small Tribes)
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 leading-relaxed">
              <li><strong>Door vs Wall Priority:</strong> Metal doors and hatchframes have 7,500 HP (1 C4 leaves 0 HP if already damaged, or 2 C4 flat), whereas walls have 10,000 HP. Always route through doors/windows when line-of-sight allows.</li>
              <li><strong>Heavy Turrets:</strong> Take 3 C4 charges or 10 RPG rockets. If pushing on Stego hardened mode, soaking the bullets first is exponentially cheaper than rocket-running active turrets.</li>
              <li><strong>Tek Walls & Structures:</strong> Immune to standard grenades. Only C4, Tek Rifles, Tek Saddles, RPGs, and Arthopleura acid deal damage.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
