import React, { useState } from 'react';
import { 
  Beaker, 
  Sparkles, 
  Flame, 
  Clock, 
  Shield, 
  Search, 
  Swords, 
  Check, 
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { MINECRAFT_POTIONS, MinecraftPotion } from '../../data/minecraftData';

export const PotionBrewingLab: React.FC = () => {
  const [selectedPotionId, setSelectedPotionId] = useState<string>('wind-charged');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom interactive modifiers
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [isAmplified, setIsAmplified] = useState<boolean>(false);
  const [potionDelivery, setPotionDelivery] = useState<'drinkable' | 'splash' | 'lingering'>('drinkable');

  const selectedPotion = MINECRAFT_POTIONS.find(p => p.id === selectedPotionId) || MINECRAFT_POTIONS[0];

  // Filtering potions
  const filteredPotions = MINECRAFT_POTIONS.filter(potion => {
    const matchesCategory = activeCategory === 'All' || potion.category === activeCategory;
    const matchesSearch = potion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      potion.effect.toLowerCase().includes(searchQuery.toLowerCase()) ||
      potion.secondaryIngredient.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', '1.21 Trials', 'Combat', 'Survival', 'Utility', 'Negative'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-[#071d18] to-[#04120f] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.21+ Alchemy</span>
              <span>·</span>
              <span className="text-emerald-300">Tricky Trials Updated</span>
              <span>·</span>
              <span className="text-cyan-400">Interactive Brewer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md">
                <Beaker className="w-4 h-4 text-emerald-400" />
              </span>
              Potion Brewing Simulator & Recipe Tree
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Step-by-step brewing flowchart for every 1.21 Tricky Trials potion (Wind Charging, Oozing, Weaving, Infested) and classic PvP combat elixirs with Redstone and Glowstone modifiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-900/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-hud font-bold">
              16 Complete Recipes
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recipe Browser (Left) & Interactive Brewing Stand (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recipe Catalog & Search */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter */}
          <div className="bg-[#05110e] border border-emerald-500/20 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search potions by name, ingredient (Breeze Rod, Sugar), or effect..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a1a15] border border-emerald-500/30 focus:border-emerald-400 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-hud whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'bg-[#0a1a15] text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Potions List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredPotions.map(potion => {
              const isSelected = potion.id === selectedPotion.id;
              return (
                <button
                  key={potion.id}
                  onClick={() => {
                    setSelectedPotionId(potion.id);
                    setIsExtended(false);
                    setIsAmplified(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-500/10'
                      : 'bg-[#061410] border-emerald-500/20 hover:border-emerald-500/40 hover:bg-[#0a1a15]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">
                        {potion.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {potion.standardDuration}
                      </span>
                    </div>

                    <div className="font-hud font-bold text-sm text-slate-100 mb-1 flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: potion.color }}
                      />
                      <span>{potion.name}</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {potion.effect}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-emerald-300">
                      + {potion.secondaryIngredient}
                    </span>
                    <span className="text-[10px] text-slate-500">Click to Brew</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Brewing Simulator & Recipe Steps */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#061410] border border-emerald-500/30 rounded-2xl p-5 space-y-5 shadow-xl">
            {/* Active Potion Title */}
            <div className="border-b border-emerald-500/20 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className="w-4 h-4 rounded-full shadow-md"
                  style={{ backgroundColor: selectedPotion.color }}
                />
                <h2 className="text-base font-bold font-hud text-slate-100">
                  {selectedPotion.name}
                </h2>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {selectedPotion.category}
              </span>
            </div>

            {/* Brewing Stand Visual Mockup */}
            <div className="bg-[#030a08] border border-emerald-500/30 rounded-xl p-4 flex flex-col items-center relative">
              {/* Blaze Powder Fuel Slot (Left) */}
              <div className="absolute left-4 top-4 flex items-center gap-1.5 bg-[#0a1a15] border border-amber-500/40 rounded-lg px-2 py-1 text-[11px]">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-amber-300">Fuel: Blaze Powder (20 uses)</span>
              </div>

              {/* Top Ingredient Slot */}
              <div className="mt-6 flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-[#0d221c] border-2 border-emerald-400/60 flex flex-col items-center justify-center p-1 shadow-lg text-center">
                  <span className="text-[10px] font-mono text-emerald-300 font-bold leading-tight">
                    {selectedPotion.secondaryIngredient}
                  </span>
                </div>
                <div className="w-1 h-6 bg-emerald-500/40" />
              </div>

              {/* Central Brewing Stand Lines */}
              <div className="w-36 h-2 bg-emerald-500/30 rounded-full my-1" />

              {/* Bottom 3 Potion Bottle Slots */}
              <div className="grid grid-cols-3 gap-4 mt-2">
                {[1, 2, 3].map(slot => (
                  <div 
                    key={slot}
                    className="w-12 h-14 rounded-xl bg-[#091814] border border-emerald-500/40 flex flex-col items-center justify-center p-1 text-center"
                  >
                    <Beaker 
                      className="w-5 h-5 mb-0.5" 
                      style={{ color: selectedPotion.color }} 
                    />
                    <span className="text-[9px] font-mono text-slate-300">
                      Bottle {slot}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modifier Controls: Redstone (Extend) vs Glowstone (Amplify) & Delivery */}
            <div className="space-y-3 bg-[#081b15] border border-emerald-500/20 rounded-xl p-3.5">
              <span className="text-xs font-bold text-slate-200 block">
                Alchemy Modifiers & Potency Upgrades
              </span>

              <div className="grid grid-cols-2 gap-2">
                {selectedPotion.hasExtended && (
                  <button
                    onClick={() => {
                      setIsExtended(!isExtended);
                      if (!isExtended) setIsAmplified(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-hud transition-colors cursor-pointer text-left border ${
                      isExtended
                        ? 'bg-red-950/60 border-red-500/50 text-red-200'
                        : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-400" />
                      Redstone Dust
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Extends duration ({selectedPotion.extendedDuration || '8:00'})
                    </div>
                  </button>
                )}

                {selectedPotion.hasAmplified && (
                  <button
                    onClick={() => {
                      setIsAmplified(!isAmplified);
                      if (!isAmplified) setIsExtended(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-hud transition-colors cursor-pointer text-left border ${
                      isAmplified
                        ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                        : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Glowstone Dust
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Level II Amplification
                    </div>
                  </button>
                )}
              </div>

              {/* Delivery Mechanism: Drinkable vs Splash vs Lingering */}
              <div className="pt-2 border-t border-emerald-500/20">
                <span className="text-[11px] text-slate-400 mb-1.5 block">Delivery Type:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['drinkable', 'splash', 'lingering'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setPotionDelivery(type)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-hud capitalize transition-colors cursor-pointer ${
                        potionDelivery === type
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-black/30 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {type === 'splash' ? 'Splash (+Gunpowder)' : type === 'lingering' ? 'Lingering (+Dragon)' : 'Drinkable'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step-by-Step Recipe Guide */}
            <div className="space-y-2 bg-[#040e0b] border border-emerald-500/20 rounded-xl p-3.5 text-xs">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Brewing Order & Recipe Steps:
              </span>
              <div className="space-y-2 pt-1">
                {selectedPotion.recipeSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PvP & Meta Note */}
            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 leading-relaxed">
              <strong className="text-amber-400 font-hud">PvP & Tactical Advantage: </strong>
              {selectedPotion.pvpNote}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
