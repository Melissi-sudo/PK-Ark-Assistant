import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  Egg, 
  Beaker, 
  Flame, 
  Check, 
  Copy, 
  Sparkles, 
  Layers, 
  Search, 
  Info,
  Clock,
  Zap,
  Heart,
  Droplets
} from 'lucide-react';

interface KibbleTier {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  badgeBg: string;
  eggSize: string;
  exampleDinos: string[];
  ingredients: { item: string; qty: number }[];
  targetDinos: string[];
}

const KIBBLE_TIERS: KibbleTier[] = [
  {
    id: 'extraordinary',
    name: 'Extraordinary Kibble (Cyan)',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/50',
    badgeBg: 'bg-cyan-950/80 text-cyan-300',
    eggSize: 'Special Eggs (Golden Hesperornis, Deinonychus, Magmasaur, Rock Drake, Wyvern, Yutyrannus)',
    exampleDinos: ['Yutyrannus', 'Deinonychus', 'Wyvern', 'Magmasaur', 'Golden Hesperornis'],
    ingredients: [
      { item: 'Special Egg', qty: 1 },
      { item: 'Giant Bee Honey', qty: 1 },
      { item: 'Lazarus Chowder', qty: 1 },
      { item: 'Mejoberries', qty: 10 },
      { item: 'Fiber', qty: 5 },
      { item: 'Water (Canteen/Waterskin)', qty: 1 }
    ],
    targetDinos: ['Giganotosaurus', 'Carcharodontosaurus', 'Pyromane', 'Rhyniognatha', 'Dreadnoughtus', 'Yi Ling', 'Thylacoleo', 'Megalania']
  },
  {
    id: 'exceptional',
    name: 'Exceptional Kibble (Yellow)',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/50',
    badgeBg: 'bg-yellow-950/80 text-yellow-300',
    eggSize: 'Extra Large Eggs (Brontosaurus, Giganotosaurus, Rex, Therizinosaurus, Megachelon)',
    exampleDinos: ['Brontosaurus', 'Rex', 'Therizinosaurus', 'Giganotosaurus', 'Basilisk'],
    ingredients: [
      { item: 'Extra Large Egg', qty: 1 },
      { item: 'Focal Chili', qty: 1 },
      { item: 'Rare Flower', qty: 1 },
      { item: 'Mejoberries', qty: 10 },
      { item: 'Fiber', qty: 5 },
      { item: 'Water', qty: 1 }
    ],
    targetDinos: ['Spinosaurus', 'Therizinosaurus', 'Rex', 'Brontosaurus', 'Mosasaurus', 'Karkinos', 'Basilosaurus', 'Quetzal']
  },
  {
    id: 'superior',
    name: 'Superior Kibble (Purple)',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    badgeBg: 'bg-purple-950/80 text-purple-300',
    eggSize: 'Large Eggs (Allosaurus, Argentavis, Carno, Megalosaurus, Spino, Tapejara, Snow Owl)',
    exampleDinos: ['Argentavis', 'Allosaurus', 'Snow Owl', 'Tapejara', 'Megatherium'],
    ingredients: [
      { item: 'Large Egg', qty: 1 },
      { item: 'Prime Meat Jerky', qty: 2 },
      { item: 'Rare Mushroom', qty: 1 },
      { item: 'Sap', qty: 1 },
      { item: 'Mejoberries', qty: 5 },
      { item: 'Fiber', qty: 5 },
      { item: 'Water', qty: 1 }
    ],
    targetDinos: ['Allosaurus', 'Argentavis', 'Castoroides', 'Daeodon', 'Direwolf', 'Dunkleosteus', 'Mammoth', 'Megatherium', 'Snow Owl', 'Woolly Rhino']
  },
  {
    id: 'regular',
    name: 'Regular Kibble (Blue)',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/50',
    badgeBg: 'bg-blue-950/80 text-blue-300',
    eggSize: 'Medium Eggs (Anky, Baryonyx, Carnotaurus, Stego, Trike, Sarco, Velonasaur)',
    exampleDinos: ['Ankylosaurus', 'Stegosaurus', 'Baryonyx', 'Trike', 'Carnotaurus'],
    ingredients: [
      { item: 'Medium Egg', qty: 1 },
      { item: 'Cooked Meat Jerky', qty: 1 },
      { item: 'Longrass (Corn)', qty: 2 },
      { item: 'Savoroot (Potato)', qty: 2 },
      { item: 'Fiber', qty: 5 },
      { item: 'Water', qty: 1 }
    ],
    targetDinos: ['Ankylosaurus', 'Baryonyx', 'Carbonemys', 'Carnotaurus', 'Doedicurus', 'Equus', 'Stegosaurus', 'Tek Stegosaurus', 'Velonasaur']
  },
  {
    id: 'simple',
    name: 'Simple Kibble (Green)',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    badgeBg: 'bg-emerald-950/80 text-emerald-300',
    eggSize: 'Small Eggs (Archaeopteryx, Micro, Oviraptor, Pachy, Raptor, Trike, Pteranodon)',
    exampleDinos: ['Raptor', 'Pteranodon', 'Oviraptor', 'Trike', 'Dimorphodon'],
    ingredients: [
      { item: 'Small Egg', qty: 1 },
      { item: 'Cooked Fish Meat', qty: 1 },
      { item: 'Rockarrot (Carrot)', qty: 2 },
      { item: 'Mejoberries', qty: 5 },
      { item: 'Fiber', qty: 5 },
      { item: 'Water', qty: 1 }
    ],
    targetDinos: ['Archaeopteryx', 'Diplodocus', 'Gallimimus', 'Giant Bee', 'Iguanodon', 'Megaloceros', 'Morellatops', 'Pteranodon', 'Raptor', 'Triceratops']
  },
  {
    id: 'basic',
    name: 'Basic Kibble (Gray)',
    color: 'text-slate-300',
    borderColor: 'border-slate-700',
    badgeBg: 'bg-slate-800 text-slate-300',
    eggSize: 'Extra Small Eggs (Dodo, Dilophosaur, Featherlight, Kairuku, Parasaur, Vulture)',
    exampleDinos: ['Dodo', 'Parasaur', 'Dilophosaur', 'Kairuku'],
    ingredients: [
      { item: 'Extra Small Egg', qty: 1 },
      { item: 'Cooked Meat', qty: 1 },
      { item: 'Amarberries', qty: 10 },
      { item: 'Mejoberries', qty: 5 },
      { item: 'Tintoberries', qty: 10 },
      { item: 'Fiber', qty: 5 },
      { item: 'Water', qty: 1 }
    ],
    targetDinos: ['Dilophosaur', 'Dodo', 'Kairuku', 'Mesopithecus', 'Parasaur', 'Phiomia']
  }
];

interface ConsumableRecipe {
  id: string;
  name: string;
  category: 'Buff Tonic' | 'Healing / Recovery' | 'Creature Food';
  effect: string;
  duration: string;
  ingredients: { item: string; qty: number }[];
  notes: string;
}

const CONSUMABLES_DATA: ConsumableRecipe[] = [
  {
    id: 'sweet_veggie_cake',
    name: 'Sweet Vegetable Cake',
    category: 'Creature Food',
    effect: 'Instantly restores 10% of maximum HP (capped at 2,100 HP) over 20 seconds. Mandatory for Therizino boss armies and Stego soaking.',
    duration: '20s cooldown between cakes',
    ingredients: [
      { item: 'Giant Bee Honey', qty: 2 },
      { item: 'Sap', qty: 4 },
      { item: 'Rockarrot', qty: 2 },
      { item: 'Longrass', qty: 2 },
      { item: 'Savoroot', qty: 2 },
      { item: 'Stimulant', qty: 4 },
      { item: 'Fiber', qty: 25 },
      { item: 'Water', qty: 1 }
    ],
    notes: 'Only works on Herbivores (Therizino, Stego, Trike, Chalicotherium, Achatina). Herbivore dinos eat it automatically when HP falls below 85%.'
  },
  {
    id: 'mindwipe_tonic',
    name: 'Mindwipe Tonic',
    category: 'Buff Tonic',
    effect: 'Resets all character Stat attribute points and Engrams. Enables switching between PvP Speed/HP builds and Heavy Crafting Skill builds.',
    duration: '24 Hour In-Game Cooldown',
    ingredients: [
      { item: 'Cooked Prime Meat / Jerky', qty: 24 },
      { item: 'Mejoberries', qty: 200 },
      { item: 'Narcotics', qty: 72 },
      { item: 'Stimulants', qty: 72 },
      { item: 'Rare Mushrooms', qty: 20 },
      { item: 'Rare Flowers', qty: 20 },
      { item: 'Water', qty: 1 }
    ],
    notes: 'Cook in an Industrial Cooker or Cooking Pot with Wood/Thatch/Sparkpowder. Cannot be fed to dinos.'
  },
  {
    id: 'medical_brew',
    name: 'Medical Brew (Red Pot)',
    category: 'Healing / Recovery',
    effect: 'Instantly recovers 40 Health over 5 seconds. Essential PvP primary consumable; keep 50+ on hotbar during raids.',
    duration: '5 Seconds',
    ingredients: [
      { item: 'Tintoberries', qty: 20 },
      { item: 'Narcotics', qty: 2 },
      { item: 'Water', qty: 1 }
    ],
    notes: 'Stacks up to 100. Spoils in 2 hours in player inventory or 3 days in preserving bin.'
  },
  {
    id: 'energy_brew',
    name: 'Energy Brew (Blue Pot)',
    category: 'Healing / Recovery',
    effect: 'Instantly restores 40 Stamina over 5 seconds. Enables continuous sprinting with heavy armor or escaping torpor loops.',
    duration: '5 Seconds',
    ingredients: [
      { item: 'Azulberries', qty: 20 },
      { item: 'Stimulants', qty: 2 },
      { item: 'Water', qty: 1 }
    ],
    notes: 'Essential for running from wild Giganotosaurus or keeping stamina full during foot-PvP shotgun fights.'
  },
  {
    id: 'focal_chili',
    name: 'Focal Chili',
    category: 'Buff Tonic',
    effect: '+25% Movement Speed and +100% Crafting Speed bonus. Stack with Mindwipe for mastercraft/ascendant blueprint crafting bonuses.',
    duration: '15 Minutes',
    ingredients: [
      { item: 'Cooked Meat', qty: 9 },
      { item: 'Citronal (Lemon)', qty: 5 },
      { item: 'Amarberries', qty: 20 },
      { item: 'Azulberries', qty: 20 },
      { item: 'Tintoberries', qty: 20 },
      { item: 'Mejoberries', qty: 10 },
      { item: 'Water', qty: 1 }
    ],
    notes: 'Key ingredient in Exceptional Kibble.'
  },
  {
    id: 'lazarus_chowder',
    name: 'Lazarus Chowder',
    category: 'Buff Tonic',
    effect: 'Slows oxygen consumption by 85% underwater and grants continuous +1.2% Stamina regeneration.',
    duration: '10 Minutes',
    ingredients: [
      { item: 'Cooked Meat', qty: 9 },
      { item: 'Savoroot', qty: 5 },
      { item: 'Longrass', qty: 5 },
      { item: 'Mejoberries', qty: 10 },
      { item: 'Narcotics', qty: 2 },
      { item: 'Water', qty: 1 }
    ],
    notes: 'Key ingredient in Extraordinary Kibble.'
  },
  {
    id: 'shadow_steak',
    name: 'Shadow Steak Saute',
    category: 'Buff Tonic',
    effect: '-80% Weapon Recoil, +50 Hyperthermal Insulation (heat), and grants night vision enhancement in dark caves.',
    duration: '3 Minutes',
    ingredients: [
      { item: 'Cooked Prime Meat', qty: 3 },
      { item: 'Rare Mushrooms', qty: 2 },
      { item: 'Savoroot', qty: 1 },
      { item: 'Rockarrot', qty: 1 },
      { item: 'Mejoberries', qty: 2 },
      { item: 'Narcotics', qty: 2 },
      { item: 'Water', qty: 1 }
    ],
    notes: 'Turns Fabricated Sniper and Pump Shotgun recoil into near-zero pinpoint lasers.'
  }
];

export const ArkRecipeMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kibble' | 'consumables'>('kibble');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredKibbles = useMemo(() => {
    return KIBBLE_TIERS.filter(k => {
      const q = searchQuery.toLowerCase();
      return (
        k.name.toLowerCase().includes(q) ||
        k.targetDinos.some(d => d.toLowerCase().includes(q)) ||
        k.exampleDinos.some(d => d.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const filteredConsumables = useMemo(() => {
    return CONSUMABLES_DATA.filter(c => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.effect.toLowerCase().includes(q) ||
        c.ingredients.some(i => i.item.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const handleCopyRecipe = (name: string, items: { item: string; qty: number }[]) => {
    const list = items.map(i => `${i.qty}x ${i.item}`).join(', ');
    const text = `[ARK Recipe] ${name}: ${list}`;
    navigator.clipboard.writeText(text);
    setCopiedKey(name);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/70 border border-emerald-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-tek text-xs uppercase tracking-widest">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>ARK: Survival Ascended // Tactical Kitchen</span>
              <span>•</span>
              <span className="text-yellow-300 font-bold">Industrial Cooker & Cooking Pot</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-hud tracking-wide mt-1">
              Kibble & Consumables Recipe Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Complete recipe book for all 6 Kibble tiers, Sweet Vegetable Cakes (Theri/Stego tanking), Mindwipe Tonics, and PvP combat brews with 1-click clipboard ingredient export.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-slate-700 shrink-0">
            <button
              onClick={() => setActiveTab('kibble')}
              className={`px-3 py-1.5 rounded-lg text-xs font-hud transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'kibble'
                  ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Egg className="w-3.5 h-3.5" />
              <span>Kibble Tiers (6)</span>
            </button>
            <button
              onClick={() => setActiveTab('consumables')}
              className={`px-3 py-1.5 rounded-lg text-xs font-hud transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'consumables'
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Beaker className="w-3.5 h-3.5" />
              <span>Tonics & Cakes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={activeTab === 'kibble' ? "Search dino (e.g. Giga, Stego, Pyromane, Rex)..." : "Search tonic or ingredient (e.g. Veggie Cake, Mindwipe, Honey)..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0b1320] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Kibble Tiers Tab */}
      {activeTab === 'kibble' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKibbles.map(k => (
            <div
              key={k.id}
              className={`bg-[#0b1320] border ${k.borderColor} rounded-2xl p-5 shadow-xl space-y-3 relative overflow-hidden`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-hud font-bold text-sm ${k.color}`}>
                      {k.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {k.eggSize}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyRecipe(k.name, k.ingredients)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Copy Recipe to Clipboard"
                >
                  {copiedKey === k.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Recipe Ingredients */}
              <div className="p-3 bg-black/40 rounded-xl border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] text-slate-400 font-hud uppercase block">
                  Cooking Recipe:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  {k.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-200">
                      <span className="text-amber-400 font-bold">{ing.qty}x</span>
                      <span className="truncate">{ing.item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred Tames */}
              <div>
                <span className="text-[10px] text-slate-400 font-hud uppercase block mb-1">
                  Preferred By ({k.targetDinos.length} creatures):
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {k.targetDinos.map(dino => (
                    <span
                      key={dino}
                      className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700 text-[10px] font-mono"
                    >
                      {dino}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consumables Tab */}
      {activeTab === 'consumables' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredConsumables.map(c => (
            <div
              key={c.id}
              className="bg-[#0b1320] border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-hud font-bold text-sm text-cyan-300">
                      {c.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {c.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{c.duration}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyRecipe(c.name, c.ingredients)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Copy Recipe to Clipboard"
                >
                  {copiedKey === c.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Effect */}
              <div className="p-3 bg-black/40 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Effect:</strong> {c.effect}
              </div>

              {/* Ingredients */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-hud uppercase block">
                  Required Ingredients:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-mono">
                  {c.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-slate-200">
                      <span className="text-amber-400 font-bold">{ing.qty}x</span>
                      <span className="truncate">{ing.item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                💡 {c.notes}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
