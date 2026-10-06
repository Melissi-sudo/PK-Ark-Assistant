import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sliders, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Zap, 
  Info,
  Shield,
  Egg,
  Heart,
  Utensils,
  Gauge
} from 'lucide-react';
import { ServerRatePreset } from '../types';
import { DEFAULT_CUSTOM_PRESET, saveStoredCustomPreset } from '../data/presets';

interface CustomRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreset: ServerRatePreset;
  onApplyPreset: (preset: ServerRatePreset) => void;
}

export const CustomRatesModal: React.FC<CustomRatesModalProps> = ({
  isOpen,
  onClose,
  currentPreset,
  onApplyPreset
}) => {
  const [formData, setFormData] = useState<ServerRatePreset>(() => ({
    ...DEFAULT_CUSTOM_PRESET,
    ...currentPreset,
    id: 'custom'
  }));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // When modal opens, sync with current preset
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...DEFAULT_CUSTOM_PRESET,
        ...currentPreset,
        id: 'custom',
        name: currentPreset.id === 'custom' ? currentPreset.name : 'Custom Unofficial Rates'
      });
      setSaveSuccess(false);
    }
  }, [isOpen, currentPreset]);

  if (!isOpen) return null;

  const handleApply = () => {
    const updated: ServerRatePreset = {
      ...formData,
      id: 'custom',
      badge: `${formData.tamingMult}x Custom`,
      description: `Custom configured multipliers (${formData.tamingMult}x Tame, ${formData.eggHatchMult}x Hatch, ${formData.babyMatureMult}x Mature).`
    };
    saveStoredCustomPreset(updated);
    onApplyPreset(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleTemplate = (tame: number, harvest: number, mating: number, hatch: number, mature: number, xp: number, label: string) => {
    setFormData(prev => ({
      ...prev,
      name: label,
      tamingMult: tame,
      harvestMult: harvest,
      matingIntervalMult: mating,
      eggHatchMult: hatch,
      babyMatureMult: mature,
      xpMult: xp
    }));
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_CUSTOM_PRESET });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#070e1c] border-2 border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto z-10"
        >
          {/* Top HUD Header */}
          <div className="bg-gradient-to-r from-cyan-950/80 via-[#0a162b] to-slate-900 px-5 py-4 border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-hud font-bold text-lg text-white tracking-wide">
                    ARK SERVER RATE CONFIGURATOR
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-tek font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    CUSTOM MULTIPLIERS
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Calibrate exact server ini multipliers for private clusters, unofficial servers, and custom events.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Quick Templates */}
            <div>
              <div className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Rate Presets & Clusters</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Official 1x', tame: 1, harvest: 1, mating: 1, hatch: 1, mature: 1, xp: 1 },
                  { label: 'Small Tribes (2.5x)', tame: 2.5, harvest: 2.5, mating: 2, hatch: 2, mature: 2, xp: 2.5 },
                  { label: 'ArkPocalypse (3x)', tame: 3, harvest: 3, mating: 3, hatch: 3, mature: 3, xp: 3 },
                  { label: 'Unofficial 5x', tame: 5, harvest: 5, mating: 5, hatch: 5, mature: 5, xp: 5 },
                  { label: 'Boosted 10x', tame: 10, harvest: 8, mating: 8, hatch: 10, mature: 10, xp: 5 },
                  { label: 'Mega 25x PvP', tame: 25, harvest: 15, mating: 15, hatch: 25, mature: 25, xp: 10 },
                  { label: 'Fibercraft 100x', tame: 100, harvest: 50, mating: 50, hatch: 100, mature: 100, xp: 50 },
                  { label: 'MTS Style (3.5x)', tame: 3.5, harvest: 3.5, mating: 3, hatch: 5, mature: 5, xp: 3 }
                ].map((tpl) => (
                  <button
                    key={tpl.label}
                    onClick={() => handleTemplate(tpl.tame, tpl.harvest, tpl.mating, tpl.hatch, tpl.mature, tpl.xp, tpl.label)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#0a1526] hover:bg-cyan-950/70 border border-cyan-500/20 hover:border-cyan-400/50 text-[11px] font-hud text-slate-300 hover:text-cyan-300 transition-all text-left truncate flex items-center justify-between"
                  >
                    <span className="truncate">{tpl.label}</span>
                    <span className="text-[10px] text-cyan-400 font-tek ml-1">{tpl.tame}x</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Server Profile Name */}
            <div className="bg-[#050b14] border border-cyan-500/20 rounded-xl p-3 sm:p-4">
              <label className="block text-xs font-hud font-bold text-slate-300 mb-1">
                Custom Server / Cluster Tag
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. My 10x Mega Cluster, MTS Season 15, Fibercraft Ark"
                className="w-full bg-[#081220] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-hud"
              />
            </div>

            {/* Multipliers Grid */}
            <div className="space-y-4">
              <div className="text-xs font-hud font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" />
                <span>Core Gameplay Multipliers (Taming, Breeding, Harvest)</span>
              </div>

              {/* Taming Multiplier */}
              <div className="bg-[#050b14] border border-cyan-500/20 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-hud font-bold text-white">TamingSpeedMultiplier</div>
                      <div className="text-[10px] text-slate-400">Scales food affinity gained per bite. Reduces total food needed.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={formData.tamingMult}
                      onChange={(e) => setFormData(prev => ({ ...prev, tamingMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-18 bg-[#091424] border border-cyan-500/40 rounded px-2 py-1 text-xs font-tek font-bold text-cyan-300 text-right focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-xs text-cyan-400 font-tek font-bold">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="30"
                  step="0.5"
                  value={Math.min(30, formData.tamingMult)}
                  onChange={(e) => setFormData(prev => ({ ...prev, tamingMult: parseFloat(e.target.value) }))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Food Drain Multiplier */}
              <div className="bg-[#050b14] border border-cyan-500/20 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-hud font-bold text-white">DinoCharacterFoodDrainMultiplier</div>
                      <div className="text-[10px] text-slate-400">Controls how fast wild dinos get hungry. Directly affects starve timer.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      value={formData.dinoFoodDrainMult || 1.0}
                      onChange={(e) => setFormData(prev => ({ ...prev, dinoFoodDrainMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-18 bg-[#091424] border border-amber-500/40 rounded px-2 py-1 text-xs font-tek font-bold text-amber-300 text-right focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-xs text-amber-400 font-tek font-bold">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="5"
                  step="0.1"
                  value={Math.min(5, formData.dinoFoodDrainMult || 1.0)}
                  onChange={(e) => setFormData(prev => ({ ...prev, dinoFoodDrainMult: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Breeding: Egg Hatch Speed Multiplier */}
              <div className="bg-[#050b14] border border-cyan-500/20 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Egg className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-hud font-bold text-white">EggHatchSpeedMultiplier</div>
                      <div className="text-[10px] text-slate-400">Accelerates egg incubation & mammal gestation countdowns.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={formData.eggHatchMult}
                      onChange={(e) => setFormData(prev => ({ ...prev, eggHatchMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-18 bg-[#091424] border border-emerald-500/40 rounded px-2 py-1 text-xs font-tek font-bold text-emerald-300 text-right focus:outline-none focus:border-emerald-400"
                    />
                    <span className="text-xs text-emerald-400 font-tek font-bold">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={Math.min(50, formData.eggHatchMult)}
                  onChange={(e) => setFormData(prev => ({ ...prev, eggHatchMult: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Breeding: Baby Mature Speed Multiplier */}
              <div className="bg-[#050b14] border border-cyan-500/20 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="text-xs font-hud font-bold text-white">BabyMatureSpeedMultiplier</div>
                      <div className="text-[10px] text-slate-400">Accelerates baby maturation phase (Baby → Juvenile → Adolescent → Adult).</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={formData.babyMatureMult}
                      onChange={(e) => setFormData(prev => ({ ...prev, babyMatureMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-18 bg-[#091424] border border-rose-500/40 rounded px-2 py-1 text-xs font-tek font-bold text-rose-300 text-right focus:outline-none focus:border-rose-400"
                    />
                    <span className="text-xs text-rose-400 font-tek font-bold">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={Math.min(50, formData.babyMatureMult)}
                  onChange={(e) => setFormData(prev => ({ ...prev, babyMatureMult: parseFloat(e.target.value) }))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>

              {/* Mating Interval & Harvest & XP in 3 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#050b14] border border-cyan-500/20 rounded-xl p-3 space-y-1">
                  <div className="text-[11px] font-hud font-bold text-white">Mating Interval Mult</div>
                  <div className="text-[9px] text-slate-400">Cooldown reduction between breedings</div>
                  <div className="flex items-center gap-1 pt-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={formData.matingIntervalMult}
                      onChange={(e) => setFormData(prev => ({ ...prev, matingIntervalMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-full bg-[#091424] border border-cyan-500/30 rounded px-2 py-1 text-xs font-tek text-cyan-300 focus:outline-none"
                    />
                    <span className="text-xs text-cyan-400 font-tek font-bold">x</span>
                  </div>
                </div>

                <div className="bg-[#050b14] border border-cyan-500/20 rounded-xl p-3 space-y-1">
                  <div className="text-[11px] font-hud font-bold text-white">Harvest Amount Mult</div>
                  <div className="text-[9px] text-slate-400">Metal, gunpowder & resource yield</div>
                  <div className="flex items-center gap-1 pt-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={formData.harvestMult}
                      onChange={(e) => setFormData(prev => ({ ...prev, harvestMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-full bg-[#091424] border border-cyan-500/30 rounded px-2 py-1 text-xs font-tek text-cyan-300 focus:outline-none"
                    />
                    <span className="text-xs text-cyan-400 font-tek font-bold">x</span>
                  </div>
                </div>

                <div className="bg-[#050b14] border border-cyan-500/20 rounded-xl p-3 space-y-1">
                  <div className="text-[11px] font-hud font-bold text-white">XP Multiplier</div>
                  <div className="text-[9px] text-slate-400">Player & creature level up speed</div>
                  <div className="flex items-center gap-1 pt-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={formData.xpMult}
                      onChange={(e) => setFormData(prev => ({ ...prev, xpMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-full bg-[#091424] border border-cyan-500/30 rounded px-2 py-1 text-xs font-tek text-cyan-300 focus:outline-none"
                    />
                    <span className="text-xs text-cyan-400 font-tek font-bold">x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note on sync */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300/80 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Applying these rates immediately recalculates all starve alarms, food quantities, kibble quotas, gestation times, and incubator requirements across the entire app. Your custom settings are saved persistently in local storage.
              </span>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="bg-[#050a16] border-t border-cyan-500/30 px-5 py-3.5 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-hud transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-[#0a1526] hover:bg-white/10 text-slate-300 text-xs font-hud transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleApply}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-hud font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Apply Custom Rates</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
