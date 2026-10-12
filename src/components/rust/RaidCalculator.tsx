import React, { useState, useMemo } from 'react';
import { 
  Bomb, 
  Flame, 
  Trash2, 
  Copy, 
  Check, 
  Plus, 
  Minus, 
  ShieldAlert, 
  Clock, 
  Zap, 
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { 
  RAID_TARGETS, 
  EXPLOSIVE_RECIPES, 
  RaidTarget, 
  ExplosiveType 
} from '../../data/rustData';
import { 
  SulfurIcon, 
  CharcoalIcon, 
  GunpowderIcon, 
  ExplosivesIcon, 
  MetalFragsIcon, 
  LowGradeIcon 
} from './RustIcons';

interface CartItem {
  targetId: string;
  count: number;
}

export const RaidCalculator: React.FC = () => {
  // Cart state: list of target structures and their quantities
  const [cart, setCart] = useState<CartItem[]>([
    { targetId: 'garage-door', count: 2 },
    { targetId: 'sheet-metal-door', count: 1 }
  ]);

  // Selected single target for detailed view & eco-raid breakdown
  const [activeTargetId, setActiveTargetId] = useState<string>('garage-door');

  // Category filter for the target selector
  const [targetCategory, setTargetCategory] = useState<'all' | 'doors' | 'walls' | 'deployables'>('all');

  // Copy notification state
  const [copied, setCopied] = useState<boolean>(false);

  // Preferred primary explosive override (default: optimal mix)
  const [preferredMethod, setPreferredMethod] = useState<'optimal' | 'c4' | 'rocket' | 'satchel' | 'exploAmmo'>('optimal');

  // Add target to cart
  const handleAddToCart = (targetId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.targetId === targetId);
      if (existing) {
        return prev.map(item => item.targetId === targetId ? { ...item, count: item.count + 1 } : item);
      }
      return [...prev, { targetId, count: 1 }];
    });
    setActiveTargetId(targetId);
  };

  // Modify target count in cart
  const handleUpdateCount = (targetId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.targetId === targetId) {
            const newCount = item.count + delta;
            return newCount > 0 ? { ...item, count: newCount } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  // Clear entire cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Filtered available target list
  const filteredTargets = useMemo(() => {
    if (targetCategory === 'all') return RAID_TARGETS;
    return RAID_TARGETS.filter(t => t.category === targetCategory);
  }, [targetCategory]);

  // Active target object
  const activeTarget = useMemo(() => {
    return RAID_TARGETS.find(t => t.id === activeTargetId) || RAID_TARGETS[0];
  }, [activeTargetId]);

  // Aggregate cart math
  const cartSummary = useMemo(() => {
    let totalC4 = 0;
    let totalRockets = 0;
    let totalSatchels = 0;
    let totalExploAmmo = 0;
    let totalHvRockets = 0;

    cart.forEach(item => {
      const target = RAID_TARGETS.find(t => t.id === item.targetId);
      if (!target) return;

      if (preferredMethod === 'optimal') {
        target.optimalExplosives.forEach(exp => {
          if (exp.type === 'c4') totalC4 += exp.count * item.count;
          else if (exp.type === 'rocket') totalRockets += exp.count * item.count;
          else if (exp.type === 'satchel') totalSatchels += exp.count * item.count;
          else if (exp.type === 'exploAmmo') totalExploAmmo += exp.count * item.count;
          else if (exp.type === 'hvRocket') totalHvRockets += exp.count * item.count;
        });
      } else if (preferredMethod === 'c4') {
        totalC4 += (target.durability.c4 || 0) * item.count;
      } else if (preferredMethod === 'rocket') {
        totalRockets += (target.durability.rocket || 0) * item.count;
      } else if (preferredMethod === 'satchel') {
        totalSatchels += (target.durability.satchel || 0) * item.count;
      } else if (preferredMethod === 'exploAmmo') {
        totalExploAmmo += (target.durability.exploAmmo || 0) * item.count;
      }
    });

    // Compute raw crafting materials
    const c4Recipe = EXPLOSIVE_RECIPES.c4;
    const rocketRecipe = EXPLOSIVE_RECIPES.rocket;
    const satchelRecipe = EXPLOSIVE_RECIPES.satchel;
    const exploAmmoRecipe = EXPLOSIVE_RECIPES.exploAmmo;
    const hvRocketRecipe = EXPLOSIVE_RECIPES.hvRocket;

    const rawSulfur = 
      totalC4 * c4Recipe.sulfur +
      totalRockets * rocketRecipe.sulfur +
      totalSatchels * satchelRecipe.sulfur +
      totalExploAmmo * exploAmmoRecipe.sulfur +
      totalHvRockets * hvRocketRecipe.sulfur;

    const rawCharcoal = 
      totalC4 * c4Recipe.charcoal +
      totalRockets * rocketRecipe.charcoal +
      totalSatchels * satchelRecipe.charcoal +
      totalExploAmmo * exploAmmoRecipe.charcoal +
      totalHvRockets * hvRocketRecipe.charcoal;

    const gunpowder = 
      totalC4 * c4Recipe.gunpowder +
      totalRockets * rocketRecipe.gunpowder +
      totalSatchels * satchelRecipe.gunpowder +
      totalExploAmmo * exploAmmoRecipe.gunpowder +
      totalHvRockets * hvRocketRecipe.gunpowder;

    const metalFrags = 
      totalC4 * c4Recipe.metalFrags +
      totalRockets * rocketRecipe.metalFrags +
      totalSatchels * satchelRecipe.metalFrags +
      totalExploAmmo * exploAmmoRecipe.metalFrags +
      totalHvRockets * hvRocketRecipe.metalFrags;

    const lowGrade = 
      totalC4 * c4Recipe.lowGrade +
      totalRockets * rocketRecipe.lowGrade;

    const pipes = 
      totalRockets * rocketRecipe.pipes +
      totalHvRockets * hvRocketRecipe.pipes;

    const techTrash = totalC4 * c4Recipe.techTrash;

    const craftTimeTotalSeconds = 
      totalC4 * c4Recipe.craftTimeSeconds +
      totalRockets * rocketRecipe.craftTimeSeconds +
      totalSatchels * satchelRecipe.craftTimeSeconds +
      totalExploAmmo * exploAmmoRecipe.craftTimeSeconds +
      totalHvRockets * hvRocketRecipe.craftTimeSeconds;

    return {
      totalC4,
      totalRockets,
      totalSatchels,
      totalExploAmmo,
      totalHvRockets,
      rawSulfur,
      rawCharcoal,
      gunpowder,
      metalFrags,
      lowGrade,
      pipes,
      techTrash,
      craftTimeTotalSeconds
    };
  }, [cart, preferredMethod]);

  // Formatted copy string for Discord / Clan chat
  const handleCopyShoppingList = () => {
    if (cart.length === 0) return;

    const targetLines = cart.map(item => {
      const t = RAID_TARGETS.find(target => target.id === item.targetId);
      return `  - ${item.count}x ${t?.name || item.targetId}`;
    }).join('\n');

    const exploParts: string[] = [];
    if (cartSummary.totalC4 > 0) exploParts.push(`${cartSummary.totalC4}x C4`);
    if (cartSummary.totalRockets > 0) exploParts.push(`${cartSummary.totalRockets}x Rockets`);
    if (cartSummary.totalSatchels > 0) exploParts.push(`${cartSummary.totalSatchels}x Satchels`);
    if (cartSummary.totalExploAmmo > 0) exploParts.push(`${cartSummary.totalExploAmmo}x Explo 5.56`);
    if (cartSummary.totalHvRockets > 0) exploParts.push(`${cartSummary.totalHvRockets}x HV Rockets`);

    const text = `💥 RUST RAID PLAN — PK ULTIMATE GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGETS:
${targetLines}

EXPLOSIVES NEEDED (${preferredMethod.toUpperCase()}):
  ${exploParts.join(', ') || 'None'}

RAW MATERIALS BREAKDOWN:
  • Sulfur Ore: ${cartSummary.rawSulfur.toLocaleString()}
  • Charcoal: ${cartSummary.rawCharcoal.toLocaleString()}
  • Gunpowder: ${cartSummary.gunpowder.toLocaleString()}
  • Metal Frags: ${cartSummary.metalFrags.toLocaleString()}
  • Low Grade Fuel: ${cartSummary.lowGrade.toLocaleString()}
  • Metal Pipes: ${cartSummary.pipes}
  • Tech Trash: ${cartSummary.techTrash}
  • Total Craft Queue: ${Math.ceil(cartSummary.craftTimeTotalSeconds / 60)} minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub-Header & Method Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f141c] border border-orange-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-md shadow-orange-950/50">
            <Bomb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-hud font-bold text-white flex items-center gap-2">
              <span>EXPLOSIVE BREACH ENGINE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                ZERO-WASTE SULFUR
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Calculate exact explosives and raw sulfur for multi-door compound raids.
            </p>
          </div>
        </div>

        {/* Explosive Strategy Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#080b10] border border-white/[0.08] text-xs font-hud">
          <button
            onClick={() => setPreferredMethod('optimal')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              preferredMethod === 'optimal'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-900/40 border border-orange-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Optimal Mix
          </button>
          <button
            onClick={() => setPreferredMethod('c4')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              preferredMethod === 'c4'
                ? 'bg-orange-600 text-white shadow-md border border-orange-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pure C4
          </button>
          <button
            onClick={() => setPreferredMethod('rocket')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              preferredMethod === 'rocket'
                ? 'bg-orange-600 text-white shadow-md border border-orange-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pure Rocket
          </button>
          <button
            onClick={() => setPreferredMethod('satchel')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              preferredMethod === 'satchel'
                ? 'bg-orange-600 text-white shadow-md border border-orange-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satchel
          </button>
          <button
            onClick={() => setPreferredMethod('exploAmmo')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              preferredMethod === 'exploAmmo'
                ? 'bg-orange-600 text-white shadow-md border border-orange-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Explo 5.56
          </button>
        </div>
      </div>

      {/* Main 2-Column Raid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Selector & Active Target Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Filter Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-hud font-bold text-slate-300 uppercase tracking-wider">
                Select Raid Target to Add
              </span>
              <div className="flex items-center gap-1 text-[11px] font-hud">
                {(['all', 'doors', 'walls', 'deployables'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTargetCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      targetCategory === cat
                        ? 'bg-orange-950/70 text-orange-300 border border-orange-500/40 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredTargets.map(target => {
                const isSelected = activeTargetId === target.id;
                const inCart = cart.find(c => c.targetId === target.id);

                return (
                  <div
                    key={target.id}
                    onClick={() => setActiveTargetId(target.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-[#1a2230] border-orange-500/60 shadow-md shadow-orange-950/40'
                        : 'bg-[#0f141d] border-white/[0.07] hover:border-orange-500/30 hover:bg-[#131b26]'
                    }`}
                  >
                    {inCart && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded bg-orange-500 text-white font-mono text-[10px] font-bold">
                        {inCart.count}x
                      </span>
                    )}

                    <div>
                      <div className="text-xs font-hud font-bold text-white truncate pr-6">
                        {target.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {target.hp} HP
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <span className="text-[10px] font-mono text-orange-400">
                        {target.durability.c4} C4 / {target.durability.rocket} Rkt
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(target.id);
                        }}
                        className="p-1 rounded bg-orange-950/80 hover:bg-orange-600 text-orange-300 hover:text-white border border-orange-500/40 transition-colors"
                        title="Add to Raid Cart"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Target Deep Dive & Eco-Raid Tactics */}
          {activeTarget && (
            <div className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.09] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-hud font-bold text-white">
                      {activeTarget.name}
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {activeTarget.hp} HP
                    </span>
                    <span className="text-[11px] font-hud px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                      Decay: {activeTarget.decayDescription}
                    </span>
                  </div>
                  <p className="text-xs text-orange-300/90 mt-1 font-sans">
                    💡 <span className="font-semibold">Tactical Intel:</span> {activeTarget.weakSpotTip}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(activeTarget.id)}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-hud font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-950/50 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Single Target Explosive Durability Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.06]">
                  <div className="text-[10px] font-hud text-slate-400">C4 CHARGES</div>
                  <div className="text-lg font-mono font-bold text-red-400">
                    {activeTarget.durability.c4}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {(activeTarget.durability.c4 * 2200).toLocaleString()} Sulfur
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.06]">
                  <div className="text-[10px] font-hud text-slate-400">ROCKETS</div>
                  <div className="text-lg font-mono font-bold text-orange-400">
                    {activeTarget.durability.rocket}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {(activeTarget.durability.rocket * 1400).toLocaleString()} Sulfur
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.06]">
                  <div className="text-[10px] font-hud text-slate-400">SATCHELS</div>
                  <div className="text-lg font-mono font-bold text-amber-400">
                    {activeTarget.durability.satchel}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {(activeTarget.durability.satchel * 480).toLocaleString()} Sulfur
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.06]">
                  <div className="text-[10px] font-hud text-slate-400">EXPLO 5.56</div>
                  <div className="text-lg font-mono font-bold text-yellow-400">
                    {activeTarget.durability.exploAmmo}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {(activeTarget.durability.exploAmmo * 25).toLocaleString()} Sulfur
                  </div>
                </div>
              </div>

              {/* Eco-Raid Alternatives */}
              {activeTarget.ecoRaid && activeTarget.ecoRaid.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <span className="text-xs font-hud font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ECO-RAID ALTERNATIVES (ZERO/LOW SULFUR)</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeTarget.ecoRaid.map((eco, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#091210] border border-emerald-500/20 text-xs">
                        <div className="flex items-center justify-between text-emerald-300 font-hud font-bold">
                          <span>{eco.toolName}</span>
                          <span className="font-mono text-[11px] text-slate-400">{eco.timeEstimateSeconds}s</span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400/90 mt-0.5">
                          {eco.costDescription}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                          {eco.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Multi-Target Shopping Cart & Raw Material Requirements (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0f141c] border-2 border-orange-500/30 shadow-2xl space-y-5">
            {/* Cart Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span className="font-hud font-bold text-sm text-white">
                  RAID TARGET SHOPPING LIST
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 border border-orange-500/40">
                  {cart.reduce((a, b) => a + b.count, 0)} targets
                </span>
              </div>

              {cart.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-xs font-hud text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Clear Cart"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Target List Items */}
            {cart.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs font-hud space-y-1">
                <p>No raid targets selected.</p>
                <p className="text-[11px] text-slate-600">Click targets on the left to build a shopping list.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cart.map(item => {
                  const target = RAID_TARGETS.find(t => t.id === item.targetId);
                  if (!target) return null;

                  return (
                    <div
                      key={item.targetId}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#080b11] border border-white/[0.05] text-xs"
                    >
                      <div className="overflow-hidden pr-2">
                        <div className="font-hud font-bold text-slate-200 truncate">
                          {target.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {target.hp} HP · {target.optimalMixDescription}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleUpdateCount(item.targetId, -1)}
                          className="w-6 h-6 rounded-lg bg-[#141b26] hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono font-bold text-white text-xs">
                          {item.count}
                        </span>
                        <button
                          onClick={() => handleUpdateCount(item.targetId, 1)}
                          className="w-6 h-6 rounded-lg bg-[#141b26] hover:bg-orange-950/60 text-slate-300 hover:text-orange-400 border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total Explosives Required Summary */}
            {cart.length > 0 && (
              <div className="p-3 rounded-xl bg-[#090d14] border border-orange-500/20 space-y-2">
                <span className="text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider">
                  Total Explosive Charges Required ({preferredMethod.toUpperCase()})
                </span>
                <div className="flex flex-wrap gap-2">
                  {cartSummary.totalC4 > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 font-mono font-bold text-xs flex items-center gap-1">
                      <Bomb className="w-3.5 h-3.5" />
                      {cartSummary.totalC4}x C4
                    </span>
                  )}
                  {cartSummary.totalRockets > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-orange-950/70 border border-orange-500/40 text-orange-300 font-mono font-bold text-xs flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {cartSummary.totalRockets}x Rocket
                    </span>
                  )}
                  {cartSummary.totalSatchels > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      {cartSummary.totalSatchels}x Satchel
                    </span>
                  )}
                  {cartSummary.totalExploAmmo > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-yellow-950/70 border border-yellow-500/40 text-yellow-300 font-mono font-bold text-xs">
                      {cartSummary.totalExploAmmo}x Explo 5.56
                    </span>
                  )}
                  {cartSummary.totalHvRockets > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs">
                      {cartSummary.totalHvRockets}x HV Rocket
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Raw Material Inventory Requirements */}
            <div className="space-y-3 pt-2 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-hud font-bold text-white uppercase tracking-wider">
                  Raw Farm & Craft Materials
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>~{Math.ceil(cartSummary.craftTimeTotalSeconds / 60)}m queue</span>
                </span>
              </div>

              {/* Raw Sulfur Big Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-950/80 via-amber-950/60 to-[#0e141d] border border-yellow-500/40 shadow-inner flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-950/80 border border-yellow-500/50 flex items-center justify-center">
                    <SulfurIcon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-hud text-yellow-300/80 uppercase">
                      RAW SULFUR ORE
                    </div>
                    <div className="text-2xl font-mono font-black text-yellow-400 tracking-tight">
                      {cartSummary.rawSulfur.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-slate-400">
                  <div>{Math.ceil(cartSummary.rawSulfur / 1000)} nodes</div>
                  <div className="text-[10px] text-slate-500">(1,000/node)</div>
                </div>
              </div>

              {/* Grid of secondary materials */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CharcoalIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">Charcoal</span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    {cartSummary.rawCharcoal.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GunpowderIcon className="w-4 h-4 text-orange-400" />
                    <span className="text-slate-400">Gunpowder</span>
                  </div>
                  <span className="font-mono font-bold text-orange-300">
                    {cartSummary.gunpowder.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MetalFragsIcon className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-400">Metal Frags</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-300">
                    {cartSummary.metalFrags.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LowGradeIcon className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-400">Low Grade</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300">
                    {cartSummary.lowGrade.toLocaleString()}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05] flex items-center justify-between">
                  <span className="text-slate-400">Metal Pipes</span>
                  <span className="font-mono font-bold text-white">
                    {cartSummary.pipes}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05] flex items-center justify-between">
                  <span className="text-slate-400">Tech Trash</span>
                  <span className="font-mono font-bold text-yellow-300">
                    {cartSummary.techTrash}
                  </span>
                </div>
              </div>
            </div>

            {/* Copy Shopping List Button */}
            <button
              onClick={handleCopyShoppingList}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-xl font-hud font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-950/60'
                  : cart.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-orange-950/60 hover:shadow-orange-900/80'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>COPIED TO CLIPBOARD!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY SHOPPING LIST (DISCORD / CHAT)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
