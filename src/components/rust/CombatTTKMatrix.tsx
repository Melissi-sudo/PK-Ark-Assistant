import React, { useState, useMemo } from 'react';
import { 
  Crosshair, 
  Shield, 
  Target, 
  Sliders, 
  Zap, 
  AlertCircle,
  Skull,
  User,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { 
  RUST_WEAPONS, 
  RUST_ARMOR_KITS, 
  RustWeapon, 
  RustArmorKit 
} from '../../data/rustData';

export const CombatTTKMatrix: React.FC = () => {
  // Selected weapon
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('ak47');

  // Selected armor kit
  const [selectedArmorId, setSelectedArmorId] = useState<string>('fullmetal');

  // Selected ammo type modifier
  const [ammoModifier, setAmmoModifier] = useState<'standard' | 'hv' | 'incendiary' | 'explosive'>('standard');

  // Combat engagement distance in meters (0 - 150m)
  const [distanceMeters, setDistanceMeters] = useState<number>(25);

  const weapon = useMemo(() => {
    return RUST_WEAPONS.find(w => w.id === selectedWeaponId) || RUST_WEAPONS[0];
  }, [selectedWeaponId]);

  const armor = useMemo(() => {
    return RUST_ARMOR_KITS.find(a => a.id === selectedArmorId) || RUST_ARMOR_KITS[4];
  }, [selectedArmorId]);

  // Compute damage falloff multiplier
  const distanceMultiplier = useMemo(() => {
    // Damage stays 100% until half of maxEffectiveRange, then falls off smoothly to 70% at max range
    const halfRange = weapon.maxEffectiveRange * 0.5;
    if (distanceMeters <= halfRange) return 1.0;
    const excess = distanceMeters - halfRange;
    const dropRange = weapon.maxEffectiveRange - halfRange;
    const ratio = Math.min(1.0, excess / dropRange);
    return Math.max(0.65, 1.0 - ratio * 0.35);
  }, [weapon, distanceMeters]);

  // Ammo modifiers
  const ammoMultiplier = useMemo(() => {
    switch (ammoModifier) {
      case 'hv':
        return 0.95; // slightly lower base damage, high speed
      case 'incendiary':
        return 1.15; // burning tick + extra damage
      case 'explosive':
        return 1.10;
      default:
        return 1.0;
    }
  }, [ammoModifier]);

  // Base raw bullet damage at this distance
  const currentBaseDamage = weapon.baseDamage * distanceMultiplier * ammoMultiplier;

  // Hitbox calculations (Rust base health is 100 HP)
  const hitData = useMemo(() => {
    // Head: 2.0x multiplier, reduced by helmet armor
    const headRaw = currentBaseDamage * weapon.headshotMultiplier;
    const headActual = Math.max(1, headRaw * (1 - armor.headReduction));
    const headHTK = Math.ceil(100 / headActual);
    const headTTK_ms = headHTK <= 1 ? 0 : Math.round(((headHTK - 1) / (weapon.rpm / 60)) * 1000);

    // Chest / Body: 1.0x multiplier, reduced by chestplate armor
    const chestRaw = currentBaseDamage * 1.0;
    const chestActual = Math.max(1, chestRaw * (1 - armor.chestReduction));
    const chestHTK = Math.ceil(100 / chestActual);
    const chestTTK_ms = chestHTK <= 1 ? 0 : Math.round(((chestHTK - 1) / (weapon.rpm / 60)) * 1000);

    // Legs: 0.75x multiplier, reduced by kilt/pants armor
    const legsRaw = currentBaseDamage * 0.75;
    const legsActual = Math.max(1, legsRaw * (1 - armor.legsReduction));
    const legsHTK = Math.ceil(100 / legsActual);
    const legsTTK_ms = legsHTK <= 1 ? 0 : Math.round(((legsHTK - 1) / (weapon.rpm / 60)) * 1000);

    return {
      head: { damage: headActual, htk: headHTK, ttk: headTTK_ms },
      chest: { damage: chestActual, htk: chestHTK, ttk: chestTTK_ms },
      legs: { damage: legsActual, htk: legsHTK, ttk: legsTTK_ms }
    };
  }, [currentBaseDamage, weapon, armor]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f141c] border border-orange-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-md shadow-orange-950/50">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-hud font-bold text-white flex items-center gap-2">
              <span>PVP COMBAT TTK & BALLISTICS MATRIX</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                100 HP TARGET DUMMY
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Analyze hit-to-kill (HTK), headshot 1-taps, time-to-kill (TTK), and distance damage falloff.
            </p>
          </div>
        </div>

        {/* Distance Slider Control */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#080b10] border border-white/[0.08] text-xs font-hud">
          <span className="text-slate-400 shrink-0">Distance:</span>
          <input
            type="range"
            min="0"
            max="150"
            step="5"
            value={distanceMeters}
            onChange={(e) => setDistanceMeters(Number(e.target.value))}
            className="w-28 sm:w-36 accent-orange-500 cursor-pointer"
          />
          <span className="font-mono font-bold text-orange-400 w-12 text-right">
            {distanceMeters}m
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weapon & Ammo Customizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weapon Selector Grid */}
          <div className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.09] space-y-4">
            <span className="text-xs font-hud font-bold text-slate-300 uppercase tracking-wider">
              Select Primary Weapon
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {RUST_WEAPONS.map(w => {
                const isSelected = selectedWeaponId === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeaponId(w.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18212e] border-orange-500/60 shadow-md shadow-orange-950/40 text-white'
                        : 'bg-[#090d14] border-white/[0.06] hover:border-orange-500/30 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-hud font-bold truncate pr-1">
                        {w.name}
                      </span>
                      <span className="text-[10px] font-mono text-orange-400">
                        {w.tier}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{w.baseDamage} DMG</span>
                      <span>{w.rpm} RPM</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ammo Selection */}
            <div className="pt-3 border-t border-white/[0.07] space-y-2">
              <span className="text-xs font-hud font-bold text-slate-300">
                Ammunition Type ({weapon.ammoType})
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-hud">
                <button
                  onClick={() => setAmmoModifier('standard')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    ammoModifier === 'standard'
                      ? 'bg-orange-600 text-white border-orange-400 font-bold'
                      : 'bg-[#090d14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setAmmoModifier('hv')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    ammoModifier === 'hv'
                      ? 'bg-cyan-600 text-white border-cyan-400 font-bold'
                      : 'bg-[#090d14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  High Velocity (HV)
                </button>
                <button
                  onClick={() => setAmmoModifier('incendiary')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    ammoModifier === 'incendiary'
                      ? 'bg-amber-600 text-white border-amber-400 font-bold'
                      : 'bg-[#090d14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  Incendiary (+15%)
                </button>
                <button
                  onClick={() => setAmmoModifier('explosive')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    ammoModifier === 'explosive'
                      ? 'bg-red-600 text-white border-red-400 font-bold'
                      : 'bg-[#090d14] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  Explosive 5.56
                </button>
              </div>
            </div>
          </div>

          {/* Armor Kit Selector */}
          <div className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.09] space-y-3">
            <span className="text-xs font-hud font-bold text-slate-300 uppercase tracking-wider">
              Target Enemy Armor Loadout
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RUST_ARMOR_KITS.map(a => {
                const isSelected = selectedArmorId === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelectedArmorId(a.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18212e] border-orange-500/60 text-white shadow-md'
                        : 'bg-[#090d14] border-white/[0.06] text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-hud font-bold truncate">
                      {a.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Head: {(a.headReduction * 100).toFixed(0)}% · Chest: {(a.chestReduction * 100).toFixed(0)}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: TTK Results & Interactive Hitbox Dummy (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-[#0f141c] border-2 border-orange-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="font-hud font-bold text-sm text-white">
                  BALLISTICS & TIME-TO-KILL
                </span>
              </div>
              <span className="text-[11px] font-mono text-orange-400">
                {weapon.name} vs {armor.name}
              </span>
            </div>

            {/* 3 Hitbox Breakdown Cards */}
            <div className="space-y-3">
              {/* Headshot */}
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-red-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-hud font-bold text-red-400">
                      HEADSHOT
                    </span>
                    {hitData.head.damage >= 100 ? (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-red-600 text-white font-bold uppercase">
                        1-TAP KILL 💀
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">
                        2.0x Crit Multiplier
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 mt-1">
                    {hitData.head.damage.toFixed(1)} Damage per bullet
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-mono font-black text-white">
                    {hitData.head.htk} {hitData.head.htk === 1 ? 'Hit' : 'Hits'}
                  </div>
                  <div className="text-[10px] font-mono text-red-400">
                    {hitData.head.ttk}ms TTK
                  </div>
                </div>
              </div>

              {/* Chest / Body */}
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-orange-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-hud font-bold text-orange-400">
                      CHEST / TORSO
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      1.0x Base Hit
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 mt-1">
                    {hitData.chest.damage.toFixed(1)} Damage per bullet
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-mono font-black text-white">
                    {hitData.chest.htk} Hits
                  </div>
                  <div className="text-[10px] font-mono text-orange-400">
                    {hitData.chest.ttk}ms TTK
                  </div>
                </div>
              </div>

              {/* Legs */}
              <div className="p-3.5 rounded-xl bg-[#090d14] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-hud font-bold text-slate-300">
                      LEGS & FEET
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      0.75x Reduced Hit
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 mt-1">
                    {hitData.legs.damage.toFixed(1)} Damage per bullet
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-mono font-black text-white">
                    {hitData.legs.htk} Hits
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {hitData.legs.ttk}ms TTK
                  </div>
                </div>
              </div>
            </div>

            {/* Weapon Spec Sheet */}
            <div className="p-3 rounded-xl bg-[#080b11] border border-white/[0.05] space-y-2 text-xs">
              <span className="text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider">
                Weapon Specification
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Fire Rate:</span>
                  <span className="text-white font-bold">{weapon.rpm} RPM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Velocity:</span>
                  <span className="text-white font-bold">{weapon.velocity} m/s</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Magazine:</span>
                  <span className="text-white font-bold">{weapon.magSize} rounds</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Draw Time:</span>
                  <span className="text-white font-bold">{weapon.drawTimeSeconds}s</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 font-sans border-t border-white/[0.05]">
                🔊 {weapon.soundType}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
