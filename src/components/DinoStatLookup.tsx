import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Shield, 
  Zap, 
  Heart, 
  Activity, 
  Sword, 
  Sparkles, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Skull,
  Crosshair,
  Percent,
  Sliders,
  ChevronRight,
  Flame,
  Info,
  RotateCcw,
  Target,
  MessageSquare,
  User,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Creature, PvPRole, DLCSource, KnockoutWeaponProfile, WeaponQuality } from '../types';
import { 
  CREATURES_DATA, 
  KNOCKOUT_WEAPON_PROFILES, 
  WEAPON_QUALITIES 
} from '../data/creatures';
import { DinoTipsCommunity } from './DinoTipsCommunity';

interface DinoStatLookupProps {
  onSelectForTaming: (creatureId: string) => void;
  onSelectForBreeding: (creatureId: string) => void;
}

/**
 * Calculates log combination ln(n! / (k! * (n - k)!))
 */
function logCombination(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity;
  if (k === 0 || k === n) return 0;
  let res = 0;
  for (let i = 1; i <= k; i++) {
    res += Math.log(n - i + 1) - Math.log(i);
  }
  return res;
}

/**
 * Standard normal cumulative distribution function (Abramowitz & Stegun approximation)
 */
function normalCDF(z: number): number {
  if (z < -8) return 0;
  if (z > 8) return 1;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp(-z * z / 2);
  const prob = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - prob : prob;
}

/**
 * Calculates exact mathematical probability that a wild dino dies from knockout damage.
 * Wild points in health follow a Binomial(N, 1/7) distribution on official servers,
 * where N = level - 1.
 */
function calculateDeathProbability(
  totalDamage: number,
  baseHealth: number,
  healthPerWildPoint: number,
  level: number,
  isClub: boolean = false
): number {
  if (totalDamage <= 0) return 0;

  const wildPoints = Math.max(0, level - 1);
  const maxPossibleHealth = baseHealth + wildPoints * healthPerWildPoint;
  if (totalDamage >= maxPossibleHealth) {
    return 100;
  }

  // If totalDamage >= baseHealth:
  // Wild dino dies if wild points rolled into Health is <= kLethal
  if (totalDamage >= baseHealth) {
    const kLethal = Math.floor((totalDamage - baseHealth) / healthPerWildPoint);
    if (kLethal >= wildPoints) return 100;

    const p = 1 / 7;
    let cumulativeProb = 0;
    for (let k = 0; k <= Math.min(kLethal, wildPoints); k++) {
      const logPMF = logCombination(wildPoints, k) + k * Math.log(p) + (wildPoints - k) * Math.log(1 - p);
      cumulativeProb += Math.exp(logPMF);
    }
    const pct = cumulativeProb * 100;
    return Math.min(100, Math.max(0.1, Math.round(pct * 10) / 10));
  }

  // In ARK, total damage might be under base health (e.g. 65-98%), but in the wild:
  // 1) Wild dinos take prior damage from aggressive predators, fall damage, or biome hazards.
  // 2) Tranq arrows/darts apply torpor over 4-5 seconds. Players frequently land 1-2 extra shots while torpor is ticking.
  // 3) Blunt melee damage (clubs) on higher level dinos carries extreme attrition risk.
  const damageRatio = totalDamage / baseHealth;
  if (isClub) {
    if (damageRatio >= 0.80) return 65.0;
    if (damageRatio >= 0.65) return 40.0;
    if (damageRatio >= 0.50) return 20.0;
    if (damageRatio >= 0.35) return 8.0;
    return 2.0;
  }

  if (damageRatio >= 0.95) {
    return 35.0; // High risk of wild damage / 1 overshot killing it
  } else if (damageRatio >= 0.85) {
    return 18.0;
  } else if (damageRatio >= 0.75) {
    return 8.5;
  } else if (damageRatio >= 0.65) {
    return 2.5;
  } else if (damageRatio >= 0.50) {
    return 0.5;
  }

  return 0;
}

export const DinoStatLookup: React.FC<DinoStatLookupProps> = ({
  onSelectForTaming,
  onSelectForBreeding
}) => {
  // Navigation & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedDLC, setSelectedDLC] = useState<string>('ALL');
  const [selectedCreatureId, setSelectedCreatureId] = useState<string>('stegosaurus');

  // Active view tab inside creature card
  const [activeTab, setActiveTab] = useState<'weapons' | 'stats' | 'meta' | 'tips'>('weapons');

  // --- Tranq & Knockout Weapon Calculator State ---
  const [targetLevel, setTargetLevel] = useState<number>(150);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('longneck');
  const [selectedAmmoId, setSelectedAmmoId] = useState<string>('shocking_tranq_dart');
  const [selectedQualityId, setSelectedQualityId] = useState<string>('primitive');
  const [weaponDamagePercent, setWeaponDamagePercent] = useState<number>(100);
  const [isHeadshot, setIsHeadshot] = useState<boolean>(false);

  // --- Stat Evaluator State ---
  const [evalStat, setEvalStat] = useState<'health' | 'melee' | 'stamina' | 'weight'>('health');
  const [wildPointsInput, setWildPointsInput] = useState<number>(42);

  const tiers = ['ALL', 'S+', 'S', 'A', 'B', 'C'];
  const roles = ['ALL', 'Main Soaker', 'High DPS', 'Boss Fighter', 'Air Siege / Transport', 'Scout & Pick', 'Support & Healer', 'Cave Runner', 'Harvester'];
  const dlcs = ['ALL', "Bob's Tall Tales (ASA)", 'Extinction', 'Scorched Earth', 'Aberration', 'The Island / Base'];

  // Current weapon profile
  const weaponProfile = useMemo(() => {
    return KNOCKOUT_WEAPON_PROFILES.find(w => w.id === selectedWeaponId) || KNOCKOUT_WEAPON_PROFILES[0];
  }, [selectedWeaponId]);

  // Handle switching weapon to adjust default ammo
  const handleSelectWeapon = (weaponId: string) => {
    setSelectedWeaponId(weaponId);
    const profile = KNOCKOUT_WEAPON_PROFILES.find(w => w.id === weaponId);
    if (profile && profile.allowedAmmos.length > 0) {
      setSelectedAmmoId(profile.allowedAmmos[0].id);
    }
  };

  // Handle quality preset selection
  const handleSelectQuality = (qualityId: string) => {
    setSelectedQualityId(qualityId);
    const q = WEAPON_QUALITIES.find(item => item.id === qualityId);
    if (q) {
      setWeaponDamagePercent(q.damagePercent);
    }
  };

  // Filtered creatures list
  const filteredCreatures = useMemo(() => {
    return CREATURES_DATA.filter(c => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        c.name.toLowerCase().includes(q) || 
        c.dlc.toLowerCase().includes(q) || 
        c.pvpRole.toLowerCase().includes(q) ||
        c.pvpTier.toLowerCase() === q;
      
      const matchesTier = selectedTier === 'ALL' || c.pvpTier === selectedTier;
      const matchesRole = selectedRole === 'ALL' || c.pvpRole === selectedRole;
      const matchesDLC = selectedDLC === 'ALL' || c.dlc.includes(selectedDLC);

      return matchesQuery && matchesTier && matchesRole && matchesDLC;
    });
  }, [searchQuery, selectedTier, selectedRole, selectedDLC]);

  // Selected creature
  const creature = useMemo(() => {
    return CREATURES_DATA.find(c => c.id === selectedCreatureId) || filteredCreatures[0] || CREATURES_DATA[0];
  }, [selectedCreatureId, filteredCreatures]);

  // Active ammo profile
  const activeAmmo = useMemo(() => {
    const ammo = weaponProfile.allowedAmmos.find(a => a.id === selectedAmmoId);
    return ammo || weaponProfile.allowedAmmos[0];
  }, [weaponProfile, selectedAmmoId]);

  // --- Knockout Math Calculations ---
  const knockoutCalc = useMemo(() => {
    const baseTorpor = creature.baseTorpor;
    const torporPerLvl = creature.torporPerLevel || (baseTorpor * 0.06);
    const requiredTorpor = Math.round(baseTorpor + (targetLevel - 1) * torporPerLvl);

    const baseHealth = creature.baseStats.health;
    const hpPerWild = creature.healthPerWildPoint || (baseHealth * 0.2);
    const avgWildHpPoints = (targetLevel - 1) / 7;
    const estimatedWildHealth = Math.round(baseHealth + avgWildHpPoints * hpPerWild);
    const minWildHealth = baseHealth;
    const maxWildHealth = Math.round(baseHealth + (targetLevel - 1) * hpPerWild);

    // Multipliers
    const qualityMultiplier = weaponDamagePercent / 100;
    const headshotMultiplier = isHeadshot ? (creature.headshotMultiplier || 2.5) : 1.0;

    // Torpor and Damage dealt per shot
    const torporPerShot = activeAmmo.baseTorpor * qualityMultiplier * headshotMultiplier;
    const damagePerShot = activeAmmo.baseDamage * qualityMultiplier * headshotMultiplier;

    // 1. Check if creature is a non-knockout tame (Passive, Special, Fantastic Tames)
    if (creature.tamingType !== 'knockout') {
      return {
        isKnockoutPossible: false,
        unfeasibleBadge: 'NON-KNOCKOUT CREATURE',
        unfeasibleReason: `${creature.name.toUpperCase()} CANNOT BE KNOCKED OUT FOR TAMING. This creature requires a ${creature.tamingType === 'special' ? 'special mechanic' : 'passive'} taming method. Attacking or shooting it with tranquilizers will NOT knock it out for taming and will cause 100% lethal damage or tame failure.`,
        requiredTorpor,
        estimatedWildHealth,
        minWildHealth,
        maxWildHealth,
        torporPerShot: Math.round(torporPerShot * 10) / 10,
        damagePerShot: Math.round(damagePerShot * 10) / 10,
        shotsNeeded: 0,
        totalDamageInflicted: 0,
        deathPercent: 100,
        headshotMultiplier
      };
    }

    // 2. Check if weapon is Wooden Club on an unfeasible creature
    const isClub = selectedWeaponId === 'club';
    // In ARK, a Wooden Club is strictly viable ONLY for small starter creatures (e.g., Dodo, or bola'd Raptor/Parasaur/Pteranodon)
    // with low torpor pools (base torpor <= 250). Medium, large, massive, aquatic, or unverified creatures CANNOT be clubbed.
    const cannotBeClubbed = creature.canBeClubbed !== true || creature.sizeClass !== 'small' || creature.baseTorpor > 250;

    if (isClub && cannotBeClubbed) {
      return {
        isKnockoutPossible: false,
        unfeasibleBadge: 'CANNOT BE KNOCKED OUT WITH A CLUB',
        unfeasibleReason: `UNFEASIBLE — ${creature.name.toUpperCase()} CANNOT BE KNOCKED OUT WITH A WOODEN CLUB. In ARK, trying to club a ${creature.sizeClass || 'medium/large'} or high-torpor creature is virtually impossible: natural torpor depletion rapidly outpaces blunt strikes, cumulative blunt damage will kill the creature long before torpor fills, and multiple clubs will break in melee. Use a Crossbow with Tranq Arrows or Longneck Rifle with Tranq Darts.`,
        requiredTorpor,
        estimatedWildHealth,
        minWildHealth,
        maxWildHealth,
        torporPerShot: Math.round(torporPerShot * 10) / 10,
        damagePerShot: Math.round(damagePerShot * 10) / 10,
        shotsNeeded: 0,
        totalDamageInflicted: 0,
        deathPercent: 100,
        headshotMultiplier
      };
    }

    // 3. Torpor Drain vs Net Torpor accumulation
    const cycleTimeSec = isClub ? 1.0 : (selectedWeaponId === 'longneck' ? 4.5 : 3.5);
    const torporDrainSec = (creature.torporDepletionPerMin || 60) / 60;
    const torporLostCycle = torporDrainSec * cycleTimeSec;
    const netTorporPerShot = torporPerShot - torporLostCycle;

    if (netTorporPerShot <= 0) {
      return {
        isKnockoutPossible: false,
        unfeasibleBadge: 'TORPOR DRAIN UNFEASIBLE',
        unfeasibleReason: `UNFEASIBLE — TORPOR DRAINS FASTER THAN WEAPON INFLICTION. ${creature.name} depletes ${creature.torporDepletionPerMin || 60} torpor per minute (${torporDrainSec.toFixed(1)}/sec). This weapon cannot build torpor faster than natural depletion, resulting in infinite shots and 100% fatal damage.`,
        requiredTorpor,
        estimatedWildHealth,
        minWildHealth,
        maxWildHealth,
        torporPerShot: Math.round(torporPerShot * 10) / 10,
        damagePerShot: Math.round(damagePerShot * 10) / 10,
        shotsNeeded: 0,
        totalDamageInflicted: 0,
        deathPercent: 100,
        headshotMultiplier
      };
    }

    // 4. Feasible knockout calculation
    const shotsNeeded = Math.ceil(requiredTorpor / netTorporPerShot);
    const totalDamageInflicted = Math.round(shotsNeeded * damagePerShot);

    // Exact death probability (including wild prior damage and club attrition)
    const deathPercent = calculateDeathProbability(
      totalDamageInflicted,
      baseHealth,
      hpPerWild,
      targetLevel,
      isClub
    );

    return {
      isKnockoutPossible: true,
      unfeasibleBadge: '',
      unfeasibleReason: '',
      requiredTorpor,
      estimatedWildHealth,
      minWildHealth,
      maxWildHealth,
      torporPerShot: Math.round(torporPerShot * 10) / 10,
      damagePerShot: Math.round(damagePerShot * 10) / 10,
      shotsNeeded,
      totalDamageInflicted,
      deathPercent,
      headshotMultiplier
    };
  }, [creature, targetLevel, weaponDamagePercent, isHeadshot, activeAmmo, selectedWeaponId]);

  // Point roll rating
  const pointRating = useMemo(() => {
    if (wildPointsInput >= 45) return { label: 'GOD TIER BREEDER (TOP 0.5%)', color: 'text-amber-300 border-amber-500 bg-amber-950/40' };
    if (wildPointsInput >= 40) return { label: 'EXCELLENT STAT (OFFICIAL LINE READY)', color: 'text-emerald-300 border-emerald-500 bg-emerald-950/40' };
    if (wildPointsInput >= 35) return { label: 'DECENT STARTER BREEDER', color: 'text-cyan-300 border-cyan-500 bg-cyan-950/40' };
    if (wildPointsInput >= 30) return { label: 'AVERAGE ROLL', color: 'text-blue-300 border-blue-500 bg-blue-950/40' };
    return { label: 'LOW ROLL (TAME REJECT)', color: 'text-slate-400 border-slate-700 bg-slate-900' };
  }, [wildPointsInput]);

  // Stat point growth calculation
  const calculatedStatValue = useMemo(() => {
    const baseHealth = creature.baseStats.health;
    const hpPerWild = creature.healthPerWildPoint || (baseHealth * 0.2);
    const stamPerWild = creature.staminaPerWildPoint || (creature.baseStats.stamina * 0.1);
    const weightPerWild = creature.weightPerWildPoint || (creature.baseStats.weight * 0.02);

    if (evalStat === 'health') {
      const val = Math.round(baseHealth + wildPointsInput * hpPerWild);
      return { value: val.toLocaleString(), unit: 'HP', formula: `${baseHealth} base + (${wildPointsInput} × ${hpPerWild})` };
    }
    if (evalStat === 'stamina') {
      const val = Math.round(creature.baseStats.stamina + wildPointsInput * stamPerWild);
      return { value: val.toLocaleString(), unit: 'Stam', formula: `${creature.baseStats.stamina} base + (${wildPointsInput} × ${stamPerWild})` };
    }
    if (evalStat === 'weight') {
      const val = Math.round(creature.baseStats.weight + wildPointsInput * weightPerWild);
      return { value: val.toLocaleString(), unit: 'KG', formula: `${creature.baseStats.weight} base + (${wildPointsInput} × ${weightPerWild})` };
    }
    // Melee (100% base + 5% per wild point typical)
    const meleeVal = Math.round((100 + wildPointsInput * 5) * 10) / 10;
    return { value: `${meleeVal}%`, unit: 'Dmg', formula: `100% base + (${wildPointsInput} × 5.0%)` };
  }, [creature, evalStat, wildPointsInput]);

  // Tier color styling
  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'S+':
        return 'bg-amber-400 text-black font-bold border border-amber-300 shadow-sm shadow-amber-400/30';
      case 'S':
        return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50';
      case 'A':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
      case 'B':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'C':
        return 'bg-slate-800 text-slate-300 border border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Search & Quick Filters */}
      <div className="bg-[#0b121e] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                Dossier &amp; Knockout Terminal
              </span>
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded">
                Official Tier Balanced
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-hud text-white mt-1 tracking-wide">
              CREATURE STATS &amp; TRANQ WEAPONS CALCULATOR
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Easily navigate all creatures by PvP tier, inspect weapon lethality &amp; death probability, and calculate breeding roll values.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by creature, tier, role..."
              className="w-full bg-[#060c18] border border-cyan-500/30 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-hud"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tier Selector Bar (S+, S, A, B, C) */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-slate-400 font-tek shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              PVP TIER:
            </span>
            {tiers.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-3 py-1 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  selectedTier === t
                    ? t === 'S+' 
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30' 
                      : 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'bg-[#0e1726] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t === 'ALL' ? 'ALL TIERS' : `TIER ${t}`}
              </button>
            ))}
          </div>

          <div className="text-xs font-tek text-slate-400">
            SHOWING <strong className="text-cyan-400">{filteredCreatures.length}</strong> CREATURES
          </div>
        </div>

        {/* Role and DLC Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
            <span className="text-slate-500 font-tek uppercase mr-1">Role:</span>
            {roles.slice(0, 6).map(r => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-2 py-0.5 rounded text-[10px] font-hud whitespace-nowrap cursor-pointer transition-colors ${
                  selectedRole === r 
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-bold' 
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dual-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Clean, Fast-Navigating Dino Directory */}
        <div className="lg:col-span-4 space-y-2 max-h-[720px] overflow-y-auto pr-1">
          {filteredCreatures.length === 0 ? (
            <div className="p-6 text-center bg-[#0b121e] border border-slate-800 rounded-2xl text-slate-400 text-xs">
              No creatures match filter query.
            </div>
          ) : (
            filteredCreatures.map(c => {
              const isSelected = creature.id === c.id;
              return (
                <motion.div
                  key={c.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedCreatureId(c.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/60 to-[#0b121e] border-cyan-400 shadow-lg shadow-cyan-500/15'
                      : 'bg-[#09101c] border-slate-800/90 hover:border-slate-700 hover:bg-[#0e1828]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={c.image}
                        alt={`Dinosaur profile thumbnail of ${c.name}, classified as a ${c.pvpRole} combat tame`}
                        className={`w-11 h-11 rounded-lg object-cover border shrink-0 ${
                          isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-700'
                        }`}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith('/images/placeholder_dino.svg')) {
                            target.src = '/images/placeholder_dino.svg';
                          }
                        }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-hud tracking-wide">
                          {c.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-tek mt-0.5">
                        {c.pvpRole} • <span className="text-slate-500">{c.dlc}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-tek font-bold px-2 py-0.5 rounded-full ${getTierBadgeStyle(c.pvpTier)}`}>
                      Tier {c.pvpTier}
                    </span>
                    <div className="text-[10px] text-cyan-400 font-mono mt-1">
                      HP {c.baseStats.health.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: Active Creature Detail & Calculators */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0b121e] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
            
            {/* Creature Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <img
                  src={creature.image}
                  alt={`Full ARK Ascended combat dossier portrait of ${creature.name}, Tier ${creature.pvpTier} combat dino with ${creature.baseStats.health} base health`}
                  className="w-18 h-18 rounded-2xl object-cover border-2 border-cyan-400/60 shrink-0 shadow-xl shadow-black"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/placeholder_dino.svg')) {
                      target.src = '/images/placeholder_dino.svg';
                    }
                  }}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-bold font-hud text-white">
                      {creature.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-tek font-bold ${getTierBadgeStyle(creature.pvpTier)}`}>
                      PVP TIER {creature.pvpTier}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-300 font-hud mt-1">
                    {creature.dlc} • Role: <strong>{creature.pvpRole}</strong> • Diet: {creature.diet}
                  </div>
                  <div className="text-[11px] text-slate-400 font-tek mt-0.5">
                    Wild Level 150 Cap: Base HP {creature.baseStats.health.toLocaleString()} | Base Torpor {creature.baseTorpor.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectForTaming(creature.id)}
                  className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-black text-xs font-hud font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Tame Food Calc</span>
                </button>

                {creature.breeding && (
                  <button
                    onClick={() => onSelectForBreeding(creature.id)}
                    className="px-3.5 py-2 bg-[#121c2e] hover:bg-[#1a2840] border border-cyan-500/40 rounded-xl text-cyan-300 text-xs font-hud font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    <span>Breeding</span>
                  </button>
                )}
              </div>
            </div>

            {/* SPECIAL MECHANIC: WYVERN MILK & FEMALE KNOCKOUT HARVESTING GUIDE */}
            {creature.id === 'wyvern' && (
              <div className="bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-slate-900/90 border border-amber-500/60 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shrink-0 shadow-lg shadow-amber-500/20">
                      <Flame className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tek font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                          CRITICAL FIELD INTEL
                        </span>
                        <span className="text-[10px] font-tek font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                          YOU CAN KNOCK OUT A WYVERN!
                        </span>
                      </div>
                      <h4 className="text-base font-bold font-hud text-white mt-0.5">
                        FEMALE WYVERN KNOCKOUT &amp; WYVERN MILK BUFF BREAKDOWN
                      </h4>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-300 block">5x MILK PER FEMALE</span>
                    <span className="text-[10px] font-tek text-slate-400">50x MILK ON ALPHA KILL</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  You <strong>CAN knock out wild female Wyverns</strong> to harvest <strong>5x Wyvern Milk</strong> directly from their unconscious inventory before they wake up! Adult Wyverns are raised from wild eggs stolen from the World Scar trench (up to level 190). Consuming or force-feeding Wyvern Milk applies the immensely powerful <strong>180-second (3 minute) Insulating Warmth buff</strong>:
                </p>

                {/* Player vs Tame Buffs Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Player Drinking Buffs */}
                  <div className="bg-[#080f1d] border border-cyan-500/40 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-hud font-bold text-cyan-300 border-b border-cyan-500/20 pb-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>HUMAN PLAYER BUFFS (DRINKING)</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-white">Extreme Cold Protection:</strong> Grants <strong>+787 hypothermal insulation</strong>, allowing you to survive in the absolute coldest Arctic or Murder Snow peaks without freezing.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-white">Total Disease Immunity:</strong> Grants 100% immunity to contagious diseases (such as Lesser Fever or Swamp Fever).
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-white">Instant Stat Boost:</strong> Immediately restores <strong>100 Health</strong> and <strong>100 Food</strong> upon consumption.
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Tame Force-Feeding Buffs */}
                  <div className="bg-[#080f1d] border border-amber-500/40 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-hud font-bold text-amber-300 border-b border-amber-500/20 pb-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>TAME BUFFS (FORCE-FEEDING • BOSS FIGHTS)</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-white">100% Fire Immunity:</strong> Grants complete immunity to the &quot;Enflamed&quot; damage-over-time debuff from Fire Wyverns and the Dragon boss! (Direct impact damage still applies; does not protect against lava).
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-white">100% Bleed Immunity:</strong> Grants complete immunity to the lethal Bleed percent damage inflicted by Allosaurus, Carnotaurus, and wild Giganotosaurus!
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-white">Baby Wyvern Maturation:</strong> Mandatory feeding requirement for maturing baby Wyverns and fulfilling craving imprints.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Trapping & Harvesting Tips */}
                <div className="bg-[#040914] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300 font-sans">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Trap Design:</strong> 4-5 Dinosaur Gateways spaced 1 wall apart with reinforced doors. Wyverns cannot fit through the gateway gaps, allowing safe knockout via Longneck Shocking Tranq Darts.</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-500/40 shrink-0">
                    SPOIL TIME: 2h 40m in Preserving Bin w/ Salt
                  </span>
                </div>
              </div>
            )}

            {/* Sub-Tab Navigation for Detail View */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('weapons')}
                className={`px-4 py-2 rounded-xl text-xs font-hud font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'weapons'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                    : 'bg-[#080f1b] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Crosshair className="w-4 h-4" />
                <span>TRANQ WEAPONS &amp; DEATH CHANCE</span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-xl text-xs font-hud font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'stats'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                    : 'bg-[#080f1b] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>STAT GROWTH &amp; WILD ROLLS</span>
              </button>

              <button
                onClick={() => setActiveTab('meta')}
                className={`px-4 py-2 rounded-xl text-xs font-hud font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'meta'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                    : 'bg-[#080f1b] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>PVP TACTICS &amp; COUNTERS</span>
              </button>

              <button
                onClick={() => setActiveTab('tips')}
                className={`px-4 py-2 rounded-xl text-xs font-hud font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'tips'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                    : 'bg-[#080f1b] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>COMMUNITY TAMING TIPS &amp; COMMENTS</span>
              </button>
            </div>

            {/* TAB 1: KNOCKOUT WEAPON & TRANQ SELECTION + DEATH PROBABILITY CALCULATOR */}
            {activeTab === 'weapons' && (
              <div className="space-y-5 animate-fadeIn">
                
                {/* Level & Weapon Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Dino Level Slider */}
                  <div className="sm:col-span-4 bg-[#070e1a] border border-slate-800 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-tek text-slate-300">
                      <span>WILD DINO LEVEL</span>
                      <span className="text-cyan-400 font-bold text-sm">LVL {targetLevel}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="150"
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(parseInt(e.target.value) || 1)}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-tek">
                      <span>Lvl 1</span>
                      <button onClick={() => setTargetLevel(150)} className="text-cyan-400 hover:underline cursor-pointer">
                        Max Official (150)
                      </button>
                      <span>Lvl 150</span>
                    </div>
                  </div>

                  {/* Headshot Toggle */}
                  <div className="sm:col-span-8 bg-[#070e1a] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold font-hud text-white flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-amber-400" />
                        HEADSHOT MULTIPLIER
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {creature.headshotMultiplier && creature.headshotMultiplier > 1 ? (
                          <span>Vulnerable: <strong>{creature.headshotMultiplier}x torpor &amp; damage</strong> multiplier applies on head hits.</span>
                        ) : (
                          <span>Headshot immune or armored skull. Takes 1.0x normal body damage.</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsHeadshot(!isHeadshot)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-tek font-bold cursor-pointer transition-all ${
                        isHeadshot 
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' 
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isHeadshot ? 'HEADSHOT ON' : 'BODY SHOT'}
                    </button>
                  </div>
                </div>

                {/* Weapon Selection Grid */}
                <div className="space-y-2">
                  <div className="text-xs font-tek text-slate-300 uppercase tracking-wider">
                    1. CHOOSE KNOCKOUT WEAPON
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {KNOCKOUT_WEAPON_PROFILES.map(w => {
                      const isSel = selectedWeaponId === w.id;
                      return (
                        <button
                          key={w.id}
                          onClick={() => handleSelectWeapon(w.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                              : 'bg-[#070e1a] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold font-hud text-white">{w.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-tek">{w.category}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tranq Ammo Type & Weapon Quality Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Ammo Selection */}
                  <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <div className="text-xs font-tek text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span>2. AMMO TYPE</span>
                      <span className="text-cyan-400 text-[11px]">{activeAmmo.name}</span>
                    </div>

                    <div className="space-y-2">
                      {weaponProfile.allowedAmmos.map(ammo => {
                        const isAmmoSel = selectedAmmoId === ammo.id;
                        return (
                          <button
                            key={ammo.id}
                            onClick={() => setSelectedAmmoId(ammo.id)}
                            className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                              isAmmoSel
                                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300'
                                : 'bg-[#040810] border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-hud font-bold text-white flex items-center gap-1.5">
                                {ammo.id === 'shocking_tranq_dart' && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                                {ammo.id === 'tranq_dart' && <Crosshair className="w-3.5 h-3.5 text-emerald-400" />}
                                {ammo.id === 'tranq_arrow' && <Sword className="w-3.5 h-3.5 text-amber-400" />}
                                <span>{ammo.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Torpor: <strong>+{ammo.baseTorpor}</strong> • Base Damage: {ammo.baseDamage}
                              </div>
                            </div>

                            <span className="text-[10px] font-tek font-bold px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-cyan-400">
                              {(ammo.baseTorpor / ammo.baseDamage).toFixed(1)}x Torp/Dmg
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quality Selection */}
                  <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <div className="text-xs font-tek text-slate-300 uppercase tracking-wider flex items-center justify-between">
                      <span>3. WEAPON QUALITY</span>
                      <span className="text-amber-400 font-bold font-mono">{weaponDamagePercent}% DMG</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {WEAPON_QUALITIES.map(q => {
                        const isQSel = selectedQualityId === q.id;
                        return (
                          <button
                            key={q.id}
                            onClick={() => handleSelectQuality(q.id)}
                            className={`px-2 py-1.5 rounded-lg border text-center font-tek text-xs font-bold transition-all cursor-pointer ${
                              isQSel
                                ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                                : 'bg-[#040810] border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <div className="uppercase text-[10px]">{q.name}</div>
                            <div className="text-xs">{q.damagePercent}%</div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] font-tek text-slate-400 mb-1">
                        <span>CUSTOM WEAPON DAMAGE:</span>
                        <span className="text-amber-400 font-bold">{weaponDamagePercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="298"
                        value={weaponDamagePercent}
                        onChange={(e) => {
                          setWeaponDamagePercent(parseInt(e.target.value) || 100);
                          setSelectedQualityId('custom');
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                      />
                      <div className="text-[10px] text-slate-500 font-tek text-right mt-0.5">
                        Official Small Tribes Cap: 298.0%
                      </div>
                    </div>
                  </div>
                </div>

                {/* THE RESULT: KNOCKOUT STATS & CHANCE OF DINO DYING */}
                <div className="p-5 rounded-2xl border-2 bg-gradient-to-b from-[#070e1b] to-[#040812] border-cyan-500/40 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Skull className={`w-5 h-5 ${knockoutCalc.deathPercent > 20 ? 'text-red-400' : 'text-emerald-400'}`} />
                      <h4 className="text-base font-bold font-hud text-white">
                        KNOCKOUT REQUIREMENTS &amp; LETHALITY REPORT
                      </h4>
                    </div>
                    <span className="text-xs font-tek text-slate-400">
                      TARGET: LEVEL {targetLevel} {creature.name.toUpperCase()}
                    </span>
                  </div>

                  {/* High Level 4-Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tek text-center">
                    <div className="bg-[#0b1424] border border-cyan-500/20 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 uppercase">Total Torpor Needed</div>
                      <div className="text-2xl font-bold font-mono text-purple-300 mt-0.5">
                        {knockoutCalc.requiredTorpor.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">Torpidity Pool</div>
                    </div>

                    <div className="bg-[#0b1424] border border-cyan-500/20 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 uppercase">Shots to Knock Out</div>
                      <div className={`text-2xl font-bold font-mono mt-0.5 ${
                        !knockoutCalc.isKnockoutPossible ? 'text-red-400 text-lg sm:text-xl' : 'text-cyan-300'
                      }`}>
                        {!knockoutCalc.isKnockoutPossible ? 'UNFEASIBLE' : `${knockoutCalc.shotsNeeded} Shots`}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {!knockoutCalc.isKnockoutPossible ? 'Knockout Impossible' : `+${knockoutCalc.torporPerShot} Torp / Hit`}
                      </div>
                    </div>

                    <div className="bg-[#0b1424] border border-cyan-500/20 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 uppercase">Total Damage Dealt</div>
                      <div className={`text-2xl font-bold font-mono mt-0.5 ${
                        !knockoutCalc.isKnockoutPossible ? 'text-red-400 text-lg sm:text-xl' : 'text-red-300'
                      }`}>
                        {!knockoutCalc.isKnockoutPossible ? '100% FATAL' : `${knockoutCalc.totalDamageInflicted.toLocaleString()} HP`}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {!knockoutCalc.isKnockoutPossible ? 'Will Kill Before Torpor' : `${knockoutCalc.damagePerShot} Dmg / Hit`}
                      </div>
                    </div>

                    <div className="bg-[#0b1424] border border-cyan-500/20 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 uppercase">Avg Wild Health</div>
                      <div className="text-2xl font-bold font-mono text-emerald-300 mt-0.5">
                        {knockoutCalc.estimatedWildHealth.toLocaleString()} HP
                      </div>
                      <div className="text-[10px] text-slate-500">Range: {knockoutCalc.minWildHealth} - {knockoutCalc.maxWildHealth}</div>
                    </div>
                  </div>

                  {/* PROMINENT CHANCE OF DINO DYING GAUGE */}
                  <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    !knockoutCalc.isKnockoutPossible || knockoutCalc.deathPercent >= 70
                      ? 'bg-red-950/70 border-red-500 shadow-xl shadow-red-500/20'
                      : knockoutCalc.deathPercent >= 25
                      ? 'bg-amber-950/60 border-amber-500/80 shadow-lg shadow-amber-500/20'
                      : knockoutCalc.deathPercent > 0
                      ? 'bg-yellow-950/40 border-yellow-500/50'
                      : 'bg-emerald-950/50 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  }`}>
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        !knockoutCalc.isKnockoutPossible || knockoutCalc.deathPercent >= 70
                          ? 'bg-red-500/20 text-red-400 border border-red-400 animate-pulse'
                          : knockoutCalc.deathPercent >= 25
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-400'
                      }`}>
                        {!knockoutCalc.isKnockoutPossible || knockoutCalc.deathPercent >= 70 ? (
                          <Skull className="w-6 h-6" />
                        ) : knockoutCalc.deathPercent >= 25 ? (
                          <AlertTriangle className="w-6 h-6" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6" />
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-tek text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <span>ESTIMATED CHANCE OF DINO DYING</span>
                          {!knockoutCalc.isKnockoutPossible && (
                            <span className="bg-red-600 text-white font-bold text-[9px] px-2 py-0.5 rounded">
                              {knockoutCalc.unfeasibleBadge}
                            </span>
                          )}
                        </div>
                        <div className="text-xl sm:text-2xl font-bold font-hud text-white mt-0.5">
                          {!knockoutCalc.isKnockoutPossible ? '100% CHANCE OF DEATH (IMPOSSIBLE)' : `${knockoutCalc.deathPercent}% CHANCE OF DEATH`}
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                          {!knockoutCalc.isKnockoutPossible && knockoutCalc.unfeasibleReason}
                          {knockoutCalc.isKnockoutPossible && knockoutCalc.deathPercent === 0 && 'SAFE KNOCKOUT: 0% risk of death. Weapon delivers ample torpor before reaching the wild health threshold.'}
                          {knockoutCalc.isKnockoutPossible && knockoutCalc.deathPercent > 0 && knockoutCalc.deathPercent < 25 && 'LOW RISK: Low death probability. The creature will only die if it rolled an abnormally low wild health stat.'}
                          {knockoutCalc.isKnockoutPossible && knockoutCalc.deathPercent >= 25 && knockoutCalc.deathPercent < 70 && 'MODERATE RISK: Substantial danger! Damage dealt is close to average wild health. Recommend Shocking Darts or pausing 5s between shots.'}
                          {knockoutCalc.isKnockoutPossible && knockoutCalc.deathPercent >= 70 && 'LETHAL WEAPON WARNING: Extreme risk of killing the dino! The weapon deals too much raw damage relative to torpidity.'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-center sm:text-right">
                      <div className="text-3xl font-mono font-bold text-white">
                        {!knockoutCalc.isKnockoutPossible ? '100%' : `${knockoutCalc.deathPercent}%`}
                      </div>
                      <span className={`text-[10px] font-tek font-bold px-2 py-0.5 rounded-full ${
                        !knockoutCalc.isKnockoutPossible || knockoutCalc.deathPercent >= 70 
                          ? 'bg-red-500 text-white' 
                          : knockoutCalc.deathPercent >= 25 
                          ? 'bg-amber-500 text-black' 
                          : 'bg-emerald-500 text-black'
                      }`}>
                        {!knockoutCalc.isKnockoutPossible ? 'FATAL / UNFEASIBLE' : knockoutCalc.deathPercent >= 70 ? 'LETHAL DANGER' : knockoutCalc.deathPercent >= 25 ? 'HIGH RISK' : 'SAFE TO TAME'}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation notice */}
                  <div className="text-xs text-slate-300 bg-[#060b14] p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="font-bold text-cyan-300 font-hud flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-cyan-400" />
                      HOW TO PREVENT ACCIDENTAL DEATHS DURING KNOCKOUT
                    </div>
                    <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                      <li><strong>Shocking Tranq Darts:</strong> Delivers 300 torpor for only 26 base damage (11.5x ratio), reducing death probability to virtually 0% on fragile creatures.</li>
                      <li><strong>Crossbow Damage:</strong> Crossbows deal heavy physical arrow damage (35 damage per arrow). On low-HP creatures (e.g. Sabertooth, Direwolf, Raptor), avoid Ascendant Crossbows as they will pierce the skull and kill before torpor caps.</li>
                      <li><strong>Shot Spacing:</strong> Tranq arrows and darts apply torpor over 4–5 seconds. Spacing shots allows full torpor tick without multiplying spike impact damage!</li>
                    </ul>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: STAT GROWTH & WILD ROLLS (Fixing "dino stats doesnt make sense") */}
            {activeTab === 'stats' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Base Level 1 Matrix */}
                <div>
                  <div className="text-xs font-tek text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    BASE LEVEL 1 STATS MATRIX
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-tek">
                    <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400">BASE HEALTH</div>
                      <div className="text-lg font-bold text-red-400">{creature.baseStats.health.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">+{creature.healthPerWildPoint || (creature.baseStats.health * 0.2)} per wild point</div>
                    </div>
                    <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400">BASE STAMINA</div>
                      <div className="text-lg font-bold text-emerald-400">{creature.baseStats.stamina}</div>
                      <div className="text-[10px] text-slate-500">+{creature.staminaPerWildPoint || (creature.baseStats.stamina * 0.1)} per wild point</div>
                    </div>
                    <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400">BASE WEIGHT</div>
                      <div className="text-lg font-bold text-cyan-300">{creature.baseStats.weight}</div>
                      <div className="text-[10px] text-slate-500">+{creature.weightPerWildPoint || (creature.baseStats.weight * 0.02)} per wild point</div>
                    </div>
                    <div className="bg-[#070e1a] border border-slate-800 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400">BASE TORPIDITY</div>
                      <div className="text-lg font-bold text-purple-400">{creature.baseTorpor.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">+{creature.torporPerLevel || (creature.baseTorpor * 0.06)} per level</div>
                    </div>
                  </div>
                </div>

                {/* Interactive Wild Roll Calculator */}
                <div className="bg-[#070e1a] border border-cyan-500/30 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-xs font-tek text-cyan-300 uppercase font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        WILD BREEDING POINT ALLOCATION EVALUATOR
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Select a stat and test how many wild points were allocated to calculate the exact in-game stat!
                      </p>
                    </div>

                    {/* Stat Selector */}
                    <div className="flex items-center gap-1">
                      {(['health', 'melee', 'stamina', 'weight'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setEvalStat(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-hud font-bold uppercase transition-all cursor-pointer ${
                            evalStat === s 
                              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20' 
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Points Input Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-tek">
                      <span className="text-slate-300">WILD POINTS IN {evalStat.toUpperCase()}:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold font-mono text-base">{wildPointsInput} Points</span>
                        <span className="text-slate-500">({((wildPointsInput / 149) * 100).toFixed(1)}% of 150 cap)</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={wildPointsInput}
                      onChange={(e) => setWildPointsInput(parseInt(e.target.value) || 10)}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />

                    <div className="flex justify-between text-[10px] text-slate-500 font-tek">
                      <span>10 Pts (Reject)</span>
                      <span>35 Pts (Decent)</span>
                      <span>42 Pts (Elite Line)</span>
                      <span>50+ Pts (God Roll)</span>
                    </div>
                  </div>

                  {/* Result Display Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-xl bg-[#040810] border border-cyan-500/30 text-center sm:text-left flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-tek uppercase">Calculated Wild Stat Value</div>
                        <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300 mt-0.5">
                          {calculatedStatValue.value} {calculatedStatValue.unit}
                        </div>
                        <div className="text-[10px] text-slate-500 font-tek mt-0.5">
                          Formula: {calculatedStatValue.formula}
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex flex-col justify-center text-center font-tek font-bold ${pointRating.color}`}>
                      <div className="text-xs uppercase">{pointRating.label}</div>
                      <div className="text-sm mt-0.5 text-white">
                        {wildPointsInput} Wild Points in {evalStat.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    On Official Level 150 servers, creatures spawn with 149 points randomly allocated. Any wild dino rolling <strong>40+ points</strong> in Health or Melee is officially viable to start an alpha boss fighting or PvP breeding line. 45+ points represents a top 0.5% roll.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: PVP TACTICS & METAS */}
            {activeTab === 'meta' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-[#070e1a] p-4 rounded-xl border border-cyan-500/30 space-y-2">
                  <div className="text-xs font-tek text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    OFFICIAL PVP METAGAME ANALYSIS
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {creature.pvpDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#070e1a] p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs font-bold font-hud text-amber-300 mb-1">
                      KEY STRENGTHS &amp; UTILITY
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      <li>PVP Tier Ranking: <strong>{creature.pvpTier}</strong></li>
                      <li>Primary Meta Role: <strong>{creature.pvpRole}</strong></li>
                      <li>DLC Availability: <strong>{creature.dlc}</strong></li>
                    </ul>
                  </div>

                  <div className="bg-[#070e1a] p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs font-bold font-hud text-cyan-300 mb-1">
                      RECOMMENDED COUNTERS &amp; WEAKNESSES
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      <li>Net Projectile Vulnerability: Check before engaging in open ground.</li>
                      <li>Heavy Turret Crossfire: Verify bullet reduction hitbox prior to breaching.</li>
                      <li>Bleed / Percent Burn: High-HP targets are vulnerable to Carcha &amp; Thylacoleo bleed.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COMMUNITY TAMING TIPS & STRATEGIES */}
            {activeTab === 'tips' && (
              <div className="space-y-4 animate-fadeIn">
                <DinoTipsCommunity dinoId={creature.id} dinoName={creature.name} />
              </div>
            )}

            {/* Teaser card to prompt community tips when viewing other tabs */}
            {activeTab !== 'tips' && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#060e1c] border border-cyan-500/25 rounded-2xl p-4 shadow-lg shadow-cyan-950/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-hud font-bold text-white">
                      HAVE A TAMING TRAP BLUEPRINT OR STRATEGY FOR {creature.name.toUpperCase()}?
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                      Leave comments and advice saved to your survivor account for the community!
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('tips')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 hover:from-cyan-500/30 hover:to-cyan-400/30 border border-cyan-400/60 text-cyan-300 rounded-xl text-xs font-hud font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <span>VIEW COMMUNITY TIPS</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
