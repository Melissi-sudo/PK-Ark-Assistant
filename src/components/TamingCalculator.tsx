import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Crosshair, 
  Search, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Flame, 
  Plus, 
  ShieldAlert, 
  Heart, 
  Zap, 
  Info,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Skull,
  Droplets,
  ShieldCheck,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Creature, ServerRatePreset, ActiveTimer } from '../types';
import { CREATURES_DATA, KNOCKOUT_WEAPONS } from '../data/creatures';
import { getFoodPointsForFoodName } from '../data/arkMechanics';
import { TekImage } from './common/TekImage';

interface TamingCalculatorProps {
  currentPreset: ServerRatePreset;
  onAddTimer: (timer: Omit<ActiveTimer, 'id'>) => void;
  onOpenStoreModal: () => void;
  onViewSoakerGuide?: () => void;
  onViewPyromaneGuide?: () => void;
}

export const TamingCalculator: React.FC<TamingCalculatorProps> = ({
  currentPreset,
  onAddTimer,
  onOpenStoreModal,
  onViewSoakerGuide,
  onViewPyromaneGuide
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlDino = searchParams.get('dino');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreatureId, setSelectedCreatureId] = useState<string>(() => {
    if (urlDino && CREATURES_DATA.some(c => c.id === urlDino)) {
      return urlDino;
    }
    return 'tek_stegosaurus';
  });
  const [level, setLevel] = useState<number>(150);
  const [customTameMult, setCustomTameMult] = useState<number>(currentPreset.tamingMult);
  const [selectedFoodIndex, setSelectedFoodIndex] = useState<number>(0);
  const [weaponDamagePercent, setWeaponDamagePercent] = useState<number>(100);

  // Sync state if URL query param changes
  useEffect(() => {
    if (urlDino && CREATURES_DATA.some(c => c.id === urlDino) && urlDino !== selectedCreatureId) {
      setSelectedCreatureId(urlDino);
    }
  }, [urlDino]);

  // Keep custom multiplier in sync when preset changes
  useEffect(() => {
    setCustomTameMult(currentPreset.tamingMult);
  }, [currentPreset]);

  const handleSelectCreature = (cid: string) => {
    setSelectedCreatureId(cid);
    setSelectedFoodIndex(0);
    setSearchParams({ dino: cid }, { replace: true });
  };

  // Filtered creatures
  const filteredCreatures = useMemo(() => {
    if (!searchQuery.trim()) return CREATURES_DATA;
    const q = searchQuery.toLowerCase();
    return CREATURES_DATA.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.dlc.toLowerCase().includes(q) || 
      c.pvpRole.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selectedCreature = useMemo(() => {
    return CREATURES_DATA.find(c => c.id === selectedCreatureId) || CREATURES_DATA[0];
  }, [selectedCreatureId]);

  // Calculate Torpor
  const currentTorpor = useMemo(() => {
    return Math.round(selectedCreature.baseTorpor + (selectedCreature.torporPerLevel * (level - 1)));
  }, [selectedCreature, level]);

  // Calculate Torpor Depletion Time (from 100% to 0%)
  const secondsToWakeUp = useMemo(() => {
    const torporPerSec = selectedCreature.torporDepletionPerMin / 60;
    if (torporPerSec <= 0) return 600;
    return Math.max(30, Math.round(currentTorpor / torporPerSec));
  }, [currentTorpor, selectedCreature]);

  // Calculations for current food
  const currentFood = selectedCreature.preferredFoods[selectedFoodIndex] || selectedCreature.preferredFoods[0];

  // Base quantity scaled with level & taming multiplier
  const calculatedFoodQuantity = useMemo(() => {
    const levelFactor = 0.5 + (level / 150) * 0.5;
    const baseQty = currentFood.baseQuantityAtLvl150 * levelFactor;
    const finalQty = Math.max(1, Math.ceil(baseQty / customTameMult));
    return finalQty;
  }, [currentFood, level, customTameMult]);

  // Taming time in seconds
  const tamingTimeSeconds = useMemo(() => {
    const baseMin = currentFood.tamingTimeMinutesBase1x * (0.4 + (level / 150) * 0.6);
    const scaledMin = baseMin / customTameMult;
    return Math.max(15, Math.round(scaledMin * 60));
  }, [currentFood, level, customTameMult]);

  // Taming effectiveness & Bonus levels
  const bonusLevels = useMemo(() => {
    const eff = currentFood.effectivenessPercent / 100;
    const maxBonus = Math.floor(level * 0.5);
    return Math.floor(maxBonus * eff);
  }, [level, currentFood]);

  const postTameLevel = level + bonusLevels;

  // Starve taming required food drop
  // Verified: Kibble restores 80 food, Raw Mutton/Prime/Meat restores 50, Crops restore 40, Mejoberries restore 30
  const foodPointsPerItem = useMemo(() => {
    return getFoodPointsForFoodName(currentFood.foodName);
  }, [currentFood.foodName]);

  const foodPointsNeeded = useMemo(() => {
    return calculatedFoodQuantity * foodPointsPerItem;
  }, [calculatedFoodQuantity, foodPointsPerItem]);

  const starveTimeSeconds = useMemo(() => {
    const drainPerSec = selectedCreature.baseTorpor > 5000 ? 1.5 : 0.8;
    return Math.max(60, Math.round(foodPointsNeeded / drainPerSec));
  }, [foodPointsNeeded, selectedCreature]);

  // Narcotics required (standard narco gives 40 torpor over 8s)
  const narcoticsNeeded = useMemo(() => {
    const totalTorporLostDuringTame = (tamingTimeSeconds / 60) * selectedCreature.torporDepletionPerMin;
    const diff = totalTorporLostDuringTame - currentTorpor;
    if (diff <= 0) return 0;
    return Math.ceil(diff / 40);
  }, [tamingTimeSeconds, selectedCreature, currentTorpor]);

  // Format seconds to human readable
  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner with Quick Selector */}
      <div className="bg-[#070e1b] border-2 border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* ARK HUD Corner Accents */}
        <div className="absolute top-2 left-2 text-cyan-400 font-mono text-xs opacity-60">┌──</div>
        <div className="absolute top-2 right-2 text-cyan-400 font-mono text-xs opacity-60">──┐</div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                Rate Active: {currentPreset.name} ({customTameMult}x)
              </span>
              {selectedCreature.isDLCExclusive && (
                <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  DLC Creature
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-hud text-white mt-1">
              AUTOMATED TAMING CALCULATOR
            </h2>
            <p className="text-xs text-slate-300">
              Calculate exact food quotas, starve timers, knockout hits, and bonus levels for Official PvP.
            </p>
          </div>

          {/* Quick Search and Multiplier Slider */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pyromane, Stego, Trike..."
                className="w-full bg-[#050b14] border border-cyan-500/30 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-hud"
              />
            </div>

            <div className="bg-[#050b14] border border-cyan-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-tek">TAME MULT:</span>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={customTameMult}
                onChange={(e) => setCustomTameMult(Math.max(0.5, parseFloat(e.target.value) || 1))}
                className="w-14 bg-black/60 border border-cyan-500/40 rounded text-cyan-300 text-center font-tek font-bold text-xs py-1"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Quick Creature Selector */}
        <div className="flex items-center gap-2 overflow-x-auto mt-4 pt-4 border-t border-slate-800/80 no-scrollbar pb-1">
          {filteredCreatures.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCreature(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-hud font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedCreature.id === c.id
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                  : 'bg-[#0b1424] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <span>{c.name}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-tek ${
                c.pvpTier === 'S+' ? 'bg-amber-400 text-black' : 'bg-slate-700 text-slate-200'
              }`}>
                {c.pvpTier}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SPECIAL NOTICE FOR PYROMANE (As requested by user!) */}
      {selectedCreature.id === 'pyromane' && (
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-950/80 via-[#1a1106] to-amber-950/80 border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold font-hud text-amber-300 uppercase">
                  PYROMANE DOES NOT NEED A TAMING CALCULATOR • USE DEDICATED GUIDE ONLY
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-tek">
                  ARK: FANTASTIC TAMES - PYROMANE
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
                Pyromane cannot be tamed with tranquilizers, narcotics, or kibble feeding. It is tamed 100% via the active combat mechanic: lure into water to extinguish its flame, shoot until it roars and kneels, mount it, then absorb wild creature flames to reset its <strong className="text-amber-300">30-second ride timer</strong> until complete!
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (onViewPyromaneGuide) onViewPyromaneGuide();
              else navigate('/pyromane');
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold font-hud text-xs rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Flame className="w-4 h-4" />
            <span>LAUNCH PYROMANE GUIDE &amp; 30S SIMULATOR</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      {/* CRITICAL NOTICE FOR THERIZINOSAURUS (As requested by user!) */}
      {selectedCreature.id === 'therizinosaurus' && (
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-950/70 via-[#180909] to-red-950/70 border-2 border-red-500/50 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-hud text-red-300 uppercase">
                  PVP DOCTRINE: THERIZINOSAURUS IS NOT A TURRET DRAINER!
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 px-1.5 py-0.2 rounded font-tek">
                  BOSS / FLAK SHREDDER
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
                Theri has <strong className="text-red-400">zero natural bullet resistance</strong> and the rider is exposed to sniper fire. True PVP Turret Soakers are <strong className="text-cyan-300">Tek Stego / Stego</strong> (hitbox: tail), <strong className="text-amber-300">Trike</strong> (hitbox: head frill), and <strong className="text-emerald-300">Carbonemys</strong> (hitbox: shell/tail).
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (onViewSoakerGuide) onViewSoakerGuide();
              else navigate('/soakers');
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-bold font-hud text-xs rounded-xl shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>VIEW OFFICIAL TURRET SOAKER GUIDE</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      {/* NOTICE FOR OFFICIAL TURRET SOAKERS (Stego, Tek Stego, Trike, Carbonemys) */}
      {(selectedCreature.id === 'tek_stegosaurus' || selectedCreature.id === 'stegosaurus' || selectedCreature.id === 'triceratops' || selectedCreature.id === 'carbonemys') && (
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-cyan-950/60 via-[#071322] to-cyan-950/60 border-2 border-cyan-500/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-xs text-slate-200">
              <strong className="text-cyan-300 font-hud uppercase">TURRET HITBOX REQUIREMENT: </strong>
              {selectedCreature.id.includes('stego') && 'Turrets must hit its tail and back plates when backing in tail-first! 50% damage reduction + rider dismount immunity.'}
              {selectedCreature.id === 'triceratops' && 'Turrets must strike directly onto its head frill! 85% bullet damage reduction when facing forward.'}
              {selectedCreature.id === 'carbonemys' && 'Turrets must hit its shell (80% reduction) or tail/legs (50% reduction).'}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (onViewSoakerGuide) onViewSoakerGuide();
              else navigate('/soakers');
            }}
            className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 text-xs font-hud font-bold rounded-lg shrink-0 cursor-pointer"
          >
            Hitbox Diagram
          </motion.button>
        </motion.div>
      )}

      {/* Main Grid: Creature Dossier & Taming Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Creature Card & Level Slider */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-cyan-500/40 shrink-0 shadow-lg shadow-black">
                <TekImage 
                  src={selectedCreature.image} 
                  alt={`Creature dossier card for ${selectedCreature.name}, a ${selectedCreature.diet} tame with knockout and kibble calculations`} 
                  variant="dossier"
                  loadingLabel={`TRANSMITTING ${selectedCreature.name.toUpperCase()} DOSSIER...`}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[10px] text-center font-tek text-cyan-300 py-0.5 z-20">
                  {selectedCreature.diet}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-hud text-white tracking-wide">
                    {selectedCreature.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-xs font-tek font-bold">
                    Tier {selectedCreature.pvpTier}
                  </span>
                </div>
                <div className="text-xs text-cyan-400 font-hud mt-0.5 flex items-center gap-2">
                  <span>{selectedCreature.dlc}</span>
                  <span>•</span>
                  <span>{selectedCreature.pvpRole}</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {selectedCreature.pvpDescription}
                </p>
              </div>
            </div>

            {/* Level Controls */}
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-tek text-slate-300 flex items-center gap-1.5">
                  <span>WILD CREATURE LEVEL</span>
                  <span className="text-[10px] text-cyan-400">(Official Cap: 150 / Tek: 180)</span>
                </label>
                <div className="flex items-center gap-1">
                  {[150, 180, 145, 135].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      className={`px-2 py-0.5 text-[10px] font-tek font-bold rounded cursor-pointer ${
                        level === lvl ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="450"
                    value={level}
                    onChange={(e) => setLevel(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 bg-black/60 border border-cyan-500/40 rounded text-cyan-300 text-center font-tek font-bold text-xs py-1"
                  />
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="180"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              {/* Stat Summary Box */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center font-tek text-xs">
                <div className="bg-[#070e1a] border border-cyan-500/20 rounded-lg p-2">
                  <div className="text-slate-400 text-[10px]">TOTAL TORPOR</div>
                  <div className="text-cyan-300 font-bold text-sm">{currentTorpor.toLocaleString()}</div>
                </div>
                <div className="bg-[#070e1a] border border-cyan-500/20 rounded-lg p-2">
                  <div className="text-slate-400 text-[10px]">WAKEUP TIMER</div>
                  <div className="text-amber-300 font-bold text-sm">{formatDuration(secondsToWakeUp)}</div>
                </div>
                <div className="bg-[#070e1a] border border-cyan-500/20 rounded-lg p-2">
                  <div className="text-slate-400 text-[10px]">BONUS LEVELS</div>
                  <div className="text-emerald-400 font-bold text-sm">+{bonusLevels} (Lvl {postTameLevel})</div>
                </div>
              </div>
            </div>
          </div>

          {/* Knockout Weapons Section */}
          <div className="bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                KNOCKOUT WEAPON CALCULATOR
              </h4>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 font-tek">WEAPON DMG:</span>
                <select
                  value={weaponDamagePercent}
                  onChange={(e) => setWeaponDamagePercent(parseInt(e.target.value))}
                  className="bg-black/50 border border-slate-700 text-cyan-300 text-xs rounded px-1.5 py-0.5 font-tek"
                >
                  <option value={100}>100% Primitive</option>
                  <option value={150}>150% Ramshackle</option>
                  <option value={200}>200% Appr/Journ</option>
                  <option value={250}>250% Mastercraft</option>
                  <option value={298}>298% Ascendant Cap</option>
                </select>
              </div>
            </div>

            {selectedCreature.tamingType === 'passive' || selectedCreature.tamingType === 'special' ? (
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Non-Standard Knockout:</strong> {selectedCreature.name} uses{' '}
                  <span className="uppercase font-bold">{selectedCreature.tamingType}</span> taming. Do not shoot with tranq darts; follow specific mechanics (e.g. water luring and flame absorption for Pyromane, sand riding for Fasolasuchus).
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {KNOCKOUT_WEAPONS.map((wpn) => {
                  const isClubImpossible = wpn.id === 'club' && (
                    selectedCreature.canBeClubbed !== true || 
                    selectedCreature.sizeClass !== 'small' || 
                    selectedCreature.baseTorpor > 250
                  );

                  const effectiveTorpor = wpn.torporPerHit * (weaponDamagePercent / 100);
                  const shotsNeeded = Math.ceil(currentTorpor / effectiveTorpor);
                  const totalDamage = shotsNeeded * (wpn.damagePerHit * (weaponDamagePercent / 100));
                  const estimatedHealth = selectedCreature.baseStats.health + (level - 1) * selectedCreature.baseStats.healthPerWildPoint;
                  const isDangerous = isClubImpossible || totalDamage >= estimatedHealth * 0.75;

                  return (
                    <motion.div 
                      key={wpn.id}
                      whileHover={{ scale: 1.01, borderColor: 'rgba(6, 182, 212, 0.4)' }}
                      className={`border rounded-lg p-2.5 flex items-center justify-between text-xs transition-colors ${
                        isClubImpossible 
                          ? 'bg-red-950/20 border-red-500/30' 
                          : 'bg-[#070e1a] border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-hud font-bold text-slate-200 flex items-center gap-1.5">
                          {wpn.name}
                          {isClubImpossible && (
                            <span className="text-[9px] font-tek font-bold px-1.5 py-0.2 bg-red-500/20 text-red-400 border border-red-500/40 rounded">
                              NOT VIABLE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isClubImpossible 
                            ? 'Cannot be knocked out with a Wooden Club (100% Fatal)' 
                            : `${shotsNeeded} Shots (${wpn.ammo})`
                          }
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`font-tek font-bold text-sm ${
                          isClubImpossible ? 'text-red-400' : 'text-cyan-300'
                        }`}>
                          {isClubImpossible ? 'UNFEASIBLE' : `${shotsNeeded} hits`}
                        </span>
                        <div className={`text-[10px] font-tek ${isDangerous ? 'text-red-400 flex items-center gap-0.5 justify-end' : 'text-slate-400'}`}>
                          {isDangerous && <AlertTriangle className="w-3 h-3" />}
                          {isClubImpossible ? '100% Fatal Trauma' : `${Math.round(totalDamage)} dmg (${totalDamage >= estimatedHealth ? '100% Lethal' : `${Math.round((totalDamage / estimatedHealth) * 100)}% of HP`})`}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Food Quotas, Starve Timers & Action Buttons */}
        <div className="lg:col-span-7 space-y-4">
          {/* Preferred Food Selection */}
          <div className="bg-[#0b121e] border border-cyan-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold font-hud text-cyan-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              FOOD REQUIREMENTS &amp; TIMERS (LEVEL {level})
            </h4>

            <div className="space-y-2">
              {selectedCreature.preferredFoods.map((food, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSelectedFoodIndex(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedFoodIndex === idx
                      ? 'bg-cyan-950/40 border-cyan-400/60 shadow-md shadow-cyan-500/10'
                      : 'bg-[#070e1a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedFoodIndex === idx ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                    }`}>
                      {selectedFoodIndex === idx && <Check className="w-3 h-3 text-black" />}
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-hud font-bold text-slate-100">
                        {food.foodName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Base Efficiency: {food.effectivenessPercent}% • Tame Time: ~{formatDuration(tamingTimeSeconds)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-tek font-bold text-cyan-300">
                      {calculatedFoodQuantity}x
                    </div>
                    <div className="text-[10px] text-emerald-400 font-tek font-bold">
                      +{bonusLevels} Lvl
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Calculated Results Showcase Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#070e1a] border border-cyan-500/20 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Food Required</div>
                <div className="text-xl font-tek font-bold text-cyan-300 mt-0.5">{calculatedFoodQuantity}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentFood.foodName.split(' ')[0]}</div>
              </div>

              <div className="bg-[#070e1a] border border-cyan-500/20 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Taming Time</div>
                <div className="text-xl font-tek font-bold text-amber-300 mt-0.5">
                  {formatDuration(tamingTimeSeconds)}
                </div>
                <div className="text-[10px] text-slate-500">at {customTameMult}x rate</div>
              </div>

              <div className="bg-[#070e1a] border border-cyan-500/20 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Starve Drop</div>
                <div className="text-xl font-tek font-bold text-purple-300 mt-0.5">{foodPointsNeeded}</div>
                <div className="text-[10px] text-slate-500">{foodPointsPerItem} pts / item</div>
              </div>

              <div className="bg-[#070e1a] border border-cyan-500/20 rounded-xl p-3 text-center">
                <div className="text-[10px] text-slate-400 font-tek uppercase">Narcotics Rec.</div>
                <div className="text-xl font-tek font-bold text-emerald-300 mt-0.5">{narcoticsNeeded}</div>
                <div className="text-[10px] text-slate-500">to maintain torpor</div>
              </div>
            </div>

            {/* Mechanics Transparency Notice */}
            <div className="mt-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Food item point drop verified via DevKit. Quantity scaling uses normalized Lvl 150 benchmark.</span>
              </span>
              <span className="text-[10px] font-tek text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                ASA LIVE ENGINE
              </span>
            </div>

            {/* One-Click Automated Alarms Setup */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-xs font-tek text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                ONE-CLICK ACTIVE GAMEPLAY ALARMS
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onAddTimer({
                      title: `Starve Alarm: ${selectedCreature.name} (Lvl ${level})`,
                      creatureName: selectedCreature.name,
                      type: 'tame_starve',
                      targetTimestamp: Date.now() + starveTimeSeconds * 1000,
                      totalDurationSeconds: starveTimeSeconds,
                      notes: `Wait for food to drop ${foodPointsNeeded} points, then feed ${calculatedFoodQuantity}x ${currentFood.foodName}.`
                    });
                  }}
                  className="px-3 py-2.5 bg-gradient-to-r from-purple-950/60 to-purple-900/40 hover:from-purple-900/80 hover:to-purple-800/60 border border-purple-500/40 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-hud font-bold text-purple-200">
                    <span>SET STARVE ALARM</span>
                    <span className="font-tek text-purple-300">{formatDuration(starveTimeSeconds)}</span>
                  </div>
                  <p className="text-[11px] text-purple-300/70 mt-0.5">
                    Triggers alarm when creature has starved enough for instant tame.
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const safeAlertSec = Math.max(30, secondsToWakeUp - 120);
                    onAddTimer({
                      title: `Wakeup Warning: ${selectedCreature.name}`,
                      creatureName: selectedCreature.name,
                      type: 'tame_wake',
                      targetTimestamp: Date.now() + safeAlertSec * 1000,
                      totalDurationSeconds: safeAlertSec,
                      notes: `Torpor running low! Needs ~${narcoticsNeeded} narcotics to maintain.`
                    });
                  }}
                  className="px-3 py-2.5 bg-gradient-to-r from-cyan-950/60 to-cyan-900/40 hover:from-cyan-900/80 hover:to-cyan-800/60 border border-cyan-500/40 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-hud font-bold text-cyan-200">
                    <span>SET WAKEUP WARNING</span>
                    <span className="font-tek text-cyan-300">{formatDuration(secondsToWakeUp)}</span>
                  </div>
                  <p className="text-[11px] text-cyan-300/70 mt-0.5">
                    Alerts you 2 minutes before torpor depletes to 0 to prevent wake-ups.
                  </p>
                </motion.button>
              </div>
            </div>
          </div>

          {/* PK Store Tactical Ad Box */}
          <div className="bg-gradient-to-r from-[#170e06] to-[#0f0904] border border-amber-500/40 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 font-hud uppercase">
                    PK STORE // OFFICIAL CLUSTER SHORTCUT
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-tek font-bold">
                    SKIP THE GRIND
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Don't risk getting knocked out or griefed by enemy tribes during a 2-hour tame. Get boss-ready {selectedCreature.name} lines delivered directly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={onOpenStoreModal}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 rounded-lg text-amber-200 text-xs font-hud font-semibold transition-all cursor-pointer"
              >
                View Stock
              </button>
              <a
                href="https://discord.gg/C9pD2yduw9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold font-hud text-xs rounded-lg flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
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
