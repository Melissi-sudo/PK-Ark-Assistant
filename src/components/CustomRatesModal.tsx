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
    setFormData(DEFAULT_CUSTOM_PRESET);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Server Multipliers Configurator"
      >
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#070e1c] border border-[#e6e6e8] dark:border-cyan-500/40 rounded-[28px] shadow-2xl overflow-hidden my-auto z-10 font-sf-text text-[#1d1d1f] dark:text-white"
        >
          {/* Top Header */}
          <div className="bg-[#f5f5f7] dark:bg-gradient-to-r dark:from-cyan-950/80 dark:via-[#0a162b] dark:to-slate-900 px-5 py-4 border-b border-[#e6e6e8] dark:border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-cyan-500/20 border border-[#e6e6e8] dark:border-cyan-400/40 flex items-center justify-center text-[#0066cc] dark:text-cyan-300 shadow-sm">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base sm:text-lg text-[#1d1d1f] dark:text-white tracking-tight font-sf-display">
                    ARK Server Rate Configurator
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e6e6e8] dark:bg-cyan-500/20 text-[#0066cc] dark:text-cyan-300 border border-[#d6d6d6] dark:border-cyan-500/30">
                    MULTIPLIERS
                  </span>
                </div>
                <p className="text-xs text-[#707070] dark:text-slate-400">
                  Calibrate exact server ini multipliers for private clusters, unofficial servers, and custom events.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white dark:bg-white/10 border border-[#e6e6e8] dark:border-transparent text-[#707070] dark:text-slate-400 hover:text-[#1d1d1f] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Quick Templates */}
            <div>
              <div className="text-xs font-semibold text-[#0066cc] dark:text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                    className="px-2.5 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#0a1526] hover:bg-[#e6e6e8] dark:hover:bg-cyan-950/70 border border-[#e6e6e8] dark:border-cyan-500/20 text-[11px] text-[#1d1d1f] dark:text-slate-300 transition-all text-left truncate flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate font-medium">{tpl.label}</span>
                    <span className="text-[10px] text-[#0066cc] dark:text-cyan-400 font-semibold ml-1">{tpl.tame}x</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Server Profile Name */}
            <div className="bg-[#f5f5f7] dark:bg-[#050b14] border border-[#e6e6e8] dark:border-cyan-500/20 rounded-2xl p-4">
              <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-slate-300 mb-1">
                Custom Server / Cluster Tag
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. My 10x Mega Cluster, MTS Season 15, Fibercraft Ark"
                className="w-full bg-white dark:bg-[#081220] border border-[#e6e6e8] dark:border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            {/* Multipliers Grid */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-[#0066cc] dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" />
                <span>Core Gameplay Multipliers (Taming, Breeding, Harvest)</span>
              </div>

              {/* Taming Multiplier */}
              <div className="bg-[#f5f5f7] dark:bg-[#050b14] border border-[#e6e6e8] dark:border-cyan-500/20 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#0066cc] dark:text-cyan-400" />
                    <div>
                      <div className="text-xs font-semibold text-[#1d1d1f] dark:text-white">TamingSpeedMultiplier</div>
                      <div className="text-[10px] text-[#707070] dark:text-slate-400">Scales food affinity gained per bite. Reduces total food needed.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-[#091424] border border-[#e6e6e8] dark:border-cyan-500/30 rounded-xl px-2.5 py-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={formData.tamingMult}
                      onChange={(e) => setFormData(prev => ({ ...prev, tamingMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-16 bg-transparent text-xs font-semibold text-[#0066cc] dark:text-cyan-300 focus:outline-none text-right"
                    />
                    <span className="text-xs text-[#0066cc] dark:text-cyan-400 font-bold">x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="25"
                  step="0.5"
                  value={Math.min(25, formData.tamingMult)}
                  onChange={(e) => setFormData(prev => ({ ...prev, tamingMult: parseFloat(e.target.value) }))}
                  className="w-full accent-[#0071e3]"
                />
              </div>

              {/* Breeding Multipliers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#f5f5f7] dark:bg-[#050b14] border border-[#e6e6e8] dark:border-cyan-500/20 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f] dark:text-white">
                      <Egg className="w-3.5 h-3.5 text-[#34c759] dark:text-emerald-400" />
                      <span>EggHatchSpeed</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white dark:bg-[#091424] border border-[#e6e6e8] dark:border-cyan-500/30 rounded-xl px-2 py-0.5">
                      <input
                        type="number"
                        step="0.5"
                        min="0.1"
                        max="100"
                        value={formData.eggHatchMult}
                        onChange={(e) => setFormData(prev => ({ ...prev, eggHatchMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                        className="w-12 bg-transparent text-xs font-semibold text-[#0066cc] dark:text-cyan-300 focus:outline-none text-right"
                      />
                      <span className="text-xs text-[#0066cc] dark:text-cyan-400 font-bold">x</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#707070] dark:text-slate-400">Incubation speed acceleration</div>
                </div>

                <div className="bg-[#f5f5f7] dark:bg-[#050b14] border border-[#e6e6e8] dark:border-cyan-500/20 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1f] dark:text-white">
                      <Heart className="w-3.5 h-3.5 text-[#ff2d55] dark:text-rose-400" />
                      <span>BabyMatureSpeed</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white dark:bg-[#091424] border border-[#e6e6e8] dark:border-cyan-500/30 rounded-xl px-2 py-0.5">
                      <input
                        type="number"
                        step="0.5"
                        min="0.1"
                        max="100"
                        value={formData.babyMatureMult}
                        onChange={(e) => setFormData(prev => ({ ...prev, babyMatureMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                        className="w-12 bg-transparent text-xs font-semibold text-[#0066cc] dark:text-cyan-300 focus:outline-none text-right"
                      />
                      <span className="text-xs text-[#0066cc] dark:text-cyan-400 font-bold">x</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#707070] dark:text-slate-400">Maturation growth rate multiplier</div>
                </div>
              </div>

              {/* Harvest & XP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#f5f5f7] dark:bg-[#050b14] border border-[#e6e6e8] dark:border-cyan-500/20 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[11px] font-semibold text-[#1d1d1f] dark:text-white">HarvestAmountMultiplier</div>
                  <div className="text-[9px] text-[#707070] dark:text-slate-400">Metal, wood, stone per node yield</div>
                  <div className="flex items-center gap-1 pt-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={formData.harvestMult}
                      onChange={(e) => setFormData(prev => ({ ...prev, harvestMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-full bg-white dark:bg-[#091424] border border-[#e6e6e8] dark:border-cyan-500/30 rounded-xl px-2 py-1 text-xs font-semibold text-[#0066cc] dark:text-cyan-300 focus:outline-none"
                    />
                    <span className="text-xs text-[#0066cc] dark:text-cyan-400 font-bold">x</span>
                  </div>
                </div>

                <div className="bg-[#f5f5f7] dark:bg-[#050b14] border border-[#e6e6e8] dark:border-cyan-500/20 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[11px] font-semibold text-[#1d1d1f] dark:text-white">XPMultiplier</div>
                  <div className="text-[9px] text-[#707070] dark:text-slate-400">Player & creature level up speed</div>
                  <div className="flex items-center gap-1 pt-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={formData.xpMult}
                      onChange={(e) => setFormData(prev => ({ ...prev, xpMult: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                      className="w-full bg-white dark:bg-[#091424] border border-[#e6e6e8] dark:border-cyan-500/30 rounded-xl px-2 py-1 text-xs font-semibold text-[#0066cc] dark:text-cyan-300 focus:outline-none"
                    />
                    <span className="text-xs text-[#0066cc] dark:text-cyan-400 font-bold">x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note on sync */}
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] dark:bg-cyan-950/30 border border-[#e6e6e8] dark:border-cyan-500/20 text-xs text-[#707070] dark:text-cyan-300/80 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#0066cc] dark:text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Applying these rates immediately recalculates all starve alarms, food quantities, kibble quotas, gestation times, and incubator requirements across the entire app. Your custom settings are saved persistently in local storage.
              </span>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="bg-[#f5f5f7] dark:bg-[#050a16] border-t border-[#e6e6e8] dark:border-cyan-500/30 px-5 py-3.5 flex items-center justify-between gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-[#e6e6e8] dark:border-transparent text-[#707070] dark:text-slate-300 hover:text-[#1d1d1f] dark:hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="apple-pill-outline px-4 py-1.5 text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleApply}
                className="apple-pill-blue px-4 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
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
