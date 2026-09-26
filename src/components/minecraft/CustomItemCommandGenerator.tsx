import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wrench, 
  Sparkles, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Shield, 
  Zap, 
  Terminal, 
  Sliders, 
  RotateCcw, 
  Flame, 
  Info,
  HelpCircle,
  Sword,
  Gem,
  Eye,
  Hammer,
  AlertTriangle
} from 'lucide-react';
import { 
  TextEffectOptions, 
  generateGradientColors, 
  groupFormattedCharacters, 
  serializeToModernSnbtComponent,
  GRADIENT_PRESETS, 
  MINECRAFT_CLASSIC_COLORS,
  CharacterColor,
  FormattedSegment
} from '../../utils/minecraftColorUtils';

interface EnchantmentOption {
  id: string;
  name: string;
  category: 'Weapon' | 'Mace 1.21' | 'Ranged' | 'Armor' | 'Tool' | 'Utility' | 'Curse';
  maxVanilla: number;
}

const ALL_ENCHANTMENTS: EnchantmentOption[] = [
  // Weapons
  { id: 'sharpness', name: 'Sharpness', category: 'Weapon', maxVanilla: 5 },
  { id: 'smite', name: 'Smite', category: 'Weapon', maxVanilla: 5 },
  { id: 'bane_of_arthropods', name: 'Bane of Arthropods', category: 'Weapon', maxVanilla: 5 },
  { id: 'knockback', name: 'Knockback', category: 'Weapon', maxVanilla: 2 },
  { id: 'fire_aspect', name: 'Fire Aspect', category: 'Weapon', maxVanilla: 2 },
  { id: 'looting', name: 'Looting', category: 'Weapon', maxVanilla: 3 },
  { id: 'sweeping_edge', name: 'Sweeping Edge', category: 'Weapon', maxVanilla: 3 },

  // 1.21 Mace
  { id: 'density', name: 'Density (1.21 Mace)', category: 'Mace 1.21', maxVanilla: 5 },
  { id: 'breach', name: 'Breach (1.21 Mace)', category: 'Mace 1.21', maxVanilla: 4 },
  { id: 'wind_burst', name: 'Wind Burst (1.21 Mace)', category: 'Mace 1.21', maxVanilla: 3 },

  // Ranged
  { id: 'power', name: 'Power', category: 'Ranged', maxVanilla: 5 },
  { id: 'punch', name: 'Punch', category: 'Ranged', maxVanilla: 2 },
  { id: 'flame', name: 'Flame', category: 'Ranged', maxVanilla: 1 },
  { id: 'infinity', name: 'Infinity', category: 'Ranged', maxVanilla: 1 },
  { id: 'loyalty', name: 'Loyalty (Trident)', category: 'Ranged', maxVanilla: 3 },
  { id: 'channeling', name: 'Channeling (Trident)', category: 'Ranged', maxVanilla: 1 },
  { id: 'riptide', name: 'Riptide (Trident)', category: 'Ranged', maxVanilla: 3 },
  { id: 'impaling', name: 'Impaling (Trident)', category: 'Ranged', maxVanilla: 5 },
  { id: 'multishot', name: 'Multishot (Crossbow)', category: 'Ranged', maxVanilla: 1 },
  { id: 'piercing', name: 'Piercing (Crossbow)', category: 'Ranged', maxVanilla: 4 },
  { id: 'quick_charge', name: 'Quick Charge (Crossbow)', category: 'Ranged', maxVanilla: 3 },

  // Armor
  { id: 'protection', name: 'Protection', category: 'Armor', maxVanilla: 4 },
  { id: 'fire_protection', name: 'Fire Protection', category: 'Armor', maxVanilla: 4 },
  { id: 'blast_protection', name: 'Blast Protection', category: 'Armor', maxVanilla: 4 },
  { id: 'projectile_protection', name: 'Projectile Protection', category: 'Armor', maxVanilla: 4 },
  { id: 'feather_falling', name: 'Feather Falling (Boots)', category: 'Armor', maxVanilla: 4 },
  { id: 'thorns', name: 'Thorns', category: 'Armor', maxVanilla: 3 },
  { id: 'respiration', name: 'Respiration (Helmet)', category: 'Armor', maxVanilla: 3 },
  { id: 'aqua_affinity', name: 'Aqua Affinity (Helmet)', category: 'Armor', maxVanilla: 1 },
  { id: 'depth_strider', name: 'Depth Strider (Boots)', category: 'Armor', maxVanilla: 3 },
  { id: 'frost_walker', name: 'Frost Walker (Boots)', category: 'Armor', maxVanilla: 2 },
  { id: 'soul_speed', name: 'Soul Speed (Boots)', category: 'Armor', maxVanilla: 3 },
  { id: 'swift_sneak', name: 'Swift Sneak (Leggings)', category: 'Armor', maxVanilla: 3 },

  // Tools
  { id: 'efficiency', name: 'Efficiency', category: 'Tool', maxVanilla: 5 },
  { id: 'silk_touch', name: 'Silk Touch', category: 'Tool', maxVanilla: 1 },
  { id: 'fortune', name: 'Fortune', category: 'Tool', maxVanilla: 3 },

  // Universal & Utility
  { id: 'unbreaking', name: 'Unbreaking', category: 'Utility', maxVanilla: 3 },
  { id: 'mending', name: 'Mending', category: 'Utility', maxVanilla: 1 },
  { id: 'luck_of_the_sea', name: 'Luck of the Sea', category: 'Utility', maxVanilla: 3 },
  { id: 'lure', name: 'Lure', category: 'Utility', maxVanilla: 3 },

  // Curses
  { id: 'binding_curse', name: 'Curse of Binding', category: 'Curse', maxVanilla: 1 },
  { id: 'vanishing_curse', name: 'Curse of Vanishing', category: 'Curse', maxVanilla: 1 }
];

interface PopularItem {
  id: string;
  name: string;
  category: string;
  defaultEnchants?: { id: string; level: number }[];
}

const POPULAR_ITEMS: PopularItem[] = [
  { id: 'netherite_sword', name: 'Netherite Sword', category: 'Weapon' },
  { id: 'diamond_sword', name: 'Diamond Sword', category: 'Weapon' },
  { id: 'mace', name: 'Mace (1.21 Heavy Weapon)', category: 'Weapon' },
  { id: 'bow', name: 'Bow', category: 'Ranged' },
  { id: 'crossbow', name: 'Crossbow', category: 'Ranged' },
  { id: 'trident', name: 'Trident', category: 'Ranged' },
  { id: 'netherite_pickaxe', name: 'Netherite Pickaxe', category: 'Tool' },
  { id: 'diamond_pickaxe', name: 'Diamond Pickaxe', category: 'Tool' },
  { id: 'netherite_axe', name: 'Netherite Axe', category: 'Tool' },
  { id: 'netherite_shovel', name: 'Netherite Shovel', category: 'Tool' },
  { id: 'netherite_chestplate', name: 'Netherite Chestplate', category: 'Armor' },
  { id: 'netherite_helmet', name: 'Netherite Helmet', category: 'Armor' },
  { id: 'netherite_leggings', name: 'Netherite Leggings', category: 'Armor' },
  { id: 'netherite_boots', name: 'Netherite Boots', category: 'Armor' },
  { id: 'elytra', name: 'Elytra Wings', category: 'Armor' },
  { id: 'stick', name: 'Stick (Knockback God Stick)', category: 'Special' },
  { id: 'totem_of_undying', name: 'Totem of Undying', category: 'Special' },
  { id: 'enchanted_golden_apple', name: 'Enchanted Golden Apple', category: 'Special' },
  { id: 'shield', name: 'Shield', category: 'Armor' },
  { id: 'enchanted_book', name: 'Enchanted Book', category: 'Special' }
];

export const CustomItemCommandGenerator: React.FC = () => {
  // Selected Base Item
  const [selectedItemId, setSelectedItemId] = useState<string>('netherite_sword');
  const [customItemId, setCustomItemId] = useState<string>('');
  const [itemCount, setItemCount] = useState<number>(1);
  const [targetSelector, setTargetSelector] = useState<string>('@p');

  // Custom Item Name
  const [customName, setCustomName] = useState<string>('Pitsoni Annihilator');
  const [nameColorMode, setNameColorMode] = useState<'gradient' | 'solid'>('gradient');
  const [nameGradientStops, setNameGradientStops] = useState<string[]>(['#ff0000', '#ffaa00']);
  const [nameSolidColor, setNameSolidColor] = useState<string>('#ffaa00');
  const [nameEffects, setNameEffects] = useState<TextEffectOptions>({
    bold: true,
    italic: false,
    underlined: false,
    strikethrough: false,
    obfuscated: false
  });

  // Custom Lore Lines
  const [loreLines, setLoreLines] = useState<{ id: string; text: string; color: string; italic: boolean }[]>([
    { id: '1', text: 'Forged in the depths of The Pitsoni War Room', color: '#ffaa00', italic: true },
    { id: '2', text: 'Unleashes devastating shockwaves on strike', color: '#55ffff', italic: true }
  ]);

  // Selected Enchantments (ID -> Level)
  const [selectedEnchants, setSelectedEnchants] = useState<Record<string, number>>({
    sharpness: 255,
    fire_aspect: 10,
    looting: 10,
    unbreaking: 255,
    mending: 1
  });

  // Additional Item Properties
  const [isUnbreakable, setIsUnbreakable] = useState<boolean>(true);
  const [hideFlags, setHideFlags] = useState<boolean>(false);
  const [bonusAttackDamage, setBonusAttackDamage] = useState<number>(100);
  const [includeBonusAttack, setIncludeBonusAttack] = useState<boolean>(false);

  // Active Category filter for enchantments
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [enchantSearch, setEnchantSearch] = useState<string>('');

  // Copied alert
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeItemId = customItemId.trim() || selectedItemId;

  // Name gradient calculation
  const activeNameStops = useMemo(() => {
    return nameColorMode === 'solid' ? [nameSolidColor] : nameGradientStops;
  }, [nameColorMode, nameSolidColor, nameGradientStops]);

  const computedNameChars = useMemo(() => {
    return generateGradientColors(customName, activeNameStops, nameEffects);
  }, [customName, activeNameStops, nameEffects]);

  const nameSegments = useMemo(() => {
    return groupFormattedCharacters(computedNameChars);
  }, [computedNameChars]);

  // Execute Pipeline toggle
  const [useExecutePipeline, setUseExecutePipeline] = useState<boolean>(false);

  // Helper to format segments into strict JSON text component string for SNBT
  const snbtNameJson = useMemo(() => {
    if (!customName.trim()) return '';
    return serializeToModernSnbtComponent(nameSegments);
  }, [customName, nameSegments]);

  // Format lore lines
  const snbtLoreArray = useMemo(() => {
    const validLines = loreLines.filter(l => l.text.trim());
    if (validLines.length === 0) return '';
    const items = validLines.map(line => {
      const obj: any = { text: line.text, color: line.color };
      if (line.italic) obj.italic = true;
      const str = JSON.stringify(obj);
      return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
    });
    return `[${items.join(',')}]`;
  }, [loreLines]);

  // Modern Java 1.20.5+ / 1.21+ / 26.3 Give Command
  const modernJavaCommand = useMemo(() => {
    const components: string[] = [];

    // Custom Name
    if (snbtNameJson) {
      components.push(`custom_name=${snbtNameJson}`);
    }

    // Lore
    if (snbtLoreArray) {
      components.push(`lore=${snbtLoreArray}`);
    }

    // Enchantments (Modern 1.20.5+ unquoted identifier levels mapping: {levels:{sharpness:5,unbreaking:3}})
    const activeEntries = Object.entries(selectedEnchants).filter(([, lvl]) => Number(lvl) > 0);
    if (activeEntries.length > 0) {
      const levelsStr = activeEntries
        .map(([id, lvl]) => `${id}:${lvl}`)
        .join(',');
      components.push(`enchantments={levels:{${levelsStr}}}`);
    }

    // Unbreakable
    if (isUnbreakable) {
      components.push('unbreakable={}');
    }

    // Bonus Attack Attribute
    if (includeBonusAttack && bonusAttackDamage > 0) {
      components.push(`attribute_modifiers=[{type:"generic.attack_damage",name:"generic.attack_damage",amount:${bonusAttackDamage},operation:"add_value",slot:"mainhand",id:"minecraft:weapon_damage"}]`);
    }

    const componentSuffix = components.length > 0 ? `[${components.join(',')}]` : '';

    if (useExecutePipeline) {
      return `/execute as ${targetSelector} at @s run give @s minecraft:${activeItemId}${componentSuffix} ${itemCount}`;
    }

    return `/give ${targetSelector} minecraft:${activeItemId}${componentSuffix} ${itemCount}`;
  }, [
    activeItemId,
    snbtNameJson,
    snbtLoreArray,
    selectedEnchants,
    isUnbreakable,
    includeBonusAttack,
    bonusAttackDamage,
    targetSelector,
    itemCount,
    useExecutePipeline
  ]);

  // Legacy Java (1.13 - 1.20.4) Give Command
  const legacyJavaCommand = useMemo(() => {
    const nbtParts: string[] = [];

    // Display tag (Name, Lore)
    const displayParts: string[] = [];
    if (snbtNameJson) {
      displayParts.push(`Name:${snbtNameJson}`);
    }
    if (snbtLoreArray) {
      displayParts.push(`Lore:${snbtLoreArray}`);
    }
    if (displayParts.length > 0) {
      nbtParts.push(`display:{${displayParts.join(',')}}`);
    }

    // Enchantments tag
    const activeEntries = Object.entries(selectedEnchants).filter(([, lvl]) => Number(lvl) > 0);
    if (activeEntries.length > 0) {
      const enchList = activeEntries
        .map(([id, lvl]) => `{id:"minecraft:${id}",lvl:${lvl}s}`)
        .join(',');
      nbtParts.push(`Enchantments:[${enchList}]`);
    }

    // Unbreakable
    if (isUnbreakable) {
      nbtParts.push('Unbreakable:1b');
    }

    const nbtSuffix = nbtParts.length > 0 ? `{${nbtParts.join(',')}}` : '';
    return `/give ${targetSelector} minecraft:${activeItemId}${nbtSuffix} ${itemCount}`;
  }, [
    activeItemId,
    snbtNameJson,
    snbtLoreArray,
    selectedEnchants,
    isUnbreakable,
    targetSelector,
    itemCount
  ]);

  // Bedrock Edition Give & Enchant Guide
  const bedrockCommand = useMemo(() => {
    return `/give ${targetSelector} ${activeItemId} ${itemCount}`;
  }, [targetSelector, activeItemId, itemCount]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Preset Loadouts
  const applyPreset = (presetName: string) => {
    if (presetName === 'god_sword') {
      setSelectedItemId('netherite_sword');
      setCustomName('Oblivion God Sword');
      setNameGradientStops(['#ff0000', '#ff7700', '#ffff00']);
      setSelectedEnchants({
        sharpness: 255,
        fire_aspect: 10,
        looting: 10,
        sweeping_edge: 10,
        unbreaking: 255,
        mending: 1
      });
      setIsUnbreakable(true);
      setIncludeBonusAttack(true);
      setBonusAttackDamage(150);
    } else if (presetName === 'mace_god') {
      setSelectedItemId('mace');
      setCustomName('Olympus Thunder Mace');
      setNameGradientStops(['#00f2fe', '#4facfe', '#0000ff']);
      setSelectedEnchants({
        density: 5,
        wind_burst: 3,
        breach: 4,
        fire_aspect: 5,
        unbreaking: 255,
        mending: 1
      });
      setIsUnbreakable(true);
      setIncludeBonusAttack(false);
    } else if (presetName === 'knockback_stick') {
      setSelectedItemId('stick');
      setCustomName('Yeet 9000 Stick');
      setNameGradientStops(['#ff512f', '#dd2476']);
      setSelectedEnchants({
        knockback: 255,
        fire_aspect: 5
      });
      setIsUnbreakable(true);
    } else if (presetName === 'god_pickaxe') {
      setSelectedItemId('netherite_pickaxe');
      setCustomName('Bedrock Breaker');
      setNameGradientStops(['#ffe259', '#ffa751']);
      setSelectedEnchants({
        efficiency: 255,
        fortune: 255,
        unbreaking: 255,
        mending: 1
      });
      setIsUnbreakable(true);
    } else if (presetName === 'vanilla_max') {
      setSelectedItemId('netherite_sword');
      setCustomName('Excalibur');
      setNameGradientStops(['#00b09b', '#96c93d']);
      setSelectedEnchants({
        sharpness: 5,
        fire_aspect: 2,
        looting: 3,
        sweeping_edge: 3,
        unbreaking: 3,
        mending: 1
      });
      setIsUnbreakable(false);
      setIncludeBonusAttack(false);
    }
  };

  const filteredEnchants = useMemo(() => {
    return ALL_ENCHANTMENTS.filter(e => {
      const matchCat = activeCategory === 'All' || e.category === activeCategory;
      const matchSearch = e.name.toLowerCase().includes(enchantSearch.toLowerCase()) || e.id.toLowerCase().includes(enchantSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, enchantSearch]);

  const activeEnchantCount = Object.values(selectedEnchants).filter(v => Number(v) > 0).length;

  return (
    <div className="font-minecraftia space-y-6">
      {/* Banner */}
      <div className="mc-panel-dirt border-4 border-[#0e0a07] shadow-2xl overflow-hidden">
        <div className="mc-grass-header px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-[#2b4414]">
          <div>
            <div className="flex items-center gap-2 text-yellow-300 text-xs uppercase drop-shadow-[1px_1px_0px_#1e2f0d]">
              <span>Creative Mode & Command Block Matrix</span>
              <span>·</span>
              <span className="text-purple-300">Java 1.20.5+ · 1.21+ · 26.3 · Bedrock</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide drop-shadow-[2px_2px_0px_#1e2f0d] mt-0.5">
              Custom Item & Enchantment Summon Generator
            </h1>
            <p className="text-xs text-[#ccebb0] max-w-2xl mt-1 leading-relaxed drop-shadow-[1px_1px_0px_#1e2f0d]">
              Generate overpowered God items with custom gradient names, custom lore, 1.21 Mace enchantments, up to lvl 255 enchants, unbreakable tags, and custom attributes.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
            <button
              onClick={() => applyPreset('god_sword')}
              className="px-2.5 py-1 text-[11px] uppercase bg-[#8a1414] hover:bg-[#a81c1c] text-white border border-[#d32f2f] cursor-pointer shadow-md"
            >
              God Sword
            </button>
            <button
              onClick={() => applyPreset('mace_god')}
              className="px-2.5 py-1 text-[11px] uppercase bg-[#145a8a] hover:bg-[#1c71a8] text-white border border-[#29b6f6] cursor-pointer shadow-md"
            >
              1.21 Mace
            </button>
            <button
              onClick={() => applyPreset('knockback_stick')}
              className="px-2.5 py-1 text-[11px] uppercase bg-[#5b3814] hover:bg-[#784a1a] text-white border border-[#ffa726] cursor-pointer shadow-md"
            >
              KB Stick
            </button>
            <button
              onClick={() => applyPreset('god_pickaxe')}
              className="px-2.5 py-1 text-[11px] uppercase bg-[#6a5b14] hover:bg-[#88741a] text-white border border-[#fdd835] cursor-pointer shadow-md"
            >
              God Pickaxe
            </button>
          </div>
        </div>
      </div>

      {/* In Development Notice Banner */}
      <div className="p-4 bg-[#2b1808] border-4 border-[#ffaa00] text-[#ffe2a8] shadow-2xl flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 bg-[#5e3810] border border-yellow-500 text-yellow-300 text-[10px] font-bold uppercase tracking-wider">
              IN ACTIVE DEVELOPMENT
            </span>
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">
              Command Component Syntax Under Maintenance
            </span>
          </div>
          <p className="text-xs text-[#ffe2a8] leading-relaxed">
            Please note: This item generator is currently in development while we fine-tune compatibility with the latest Minecraft Java (1.20.5+, 1.21+, 26.3) and Bedrock data components. It will start working in a while. Thank you for your patience!
          </p>
        </div>
      </div>

      {/* Main Grid: Controls Left, Live Minecraft Tooltip & Output Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Item, Name, Lore, Enchantments */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Item Selection & Quantity */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="flex items-center justify-between border-b-2 border-[#332216] pb-2">
              <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Sword className="w-3.5 h-3.5" />
                Step 1: Choose Base Item & Target
              </span>
              <span className="text-[10px] text-[#a09080]">minecraft:{activeItemId}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_ITEMS.slice(0, 8).map(item => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedItemId(item.id); setCustomItemId(''); }}
                  className={`p-2 border text-left cursor-pointer transition-colors ${
                    selectedItemId === item.id && !customItemId
                      ? 'bg-[#3b2a1c] border-yellow-300 text-yellow-300 font-bold'
                      : 'bg-[#100b08] border-[#332216] text-[#c2b09e] hover:border-white'
                  }`}
                >
                  <span className="text-[11px] block truncate">{item.name}</span>
                  <span className="text-[9px] text-[#7d6c5e] uppercase">{item.category}</span>
                </button>
              ))}
            </div>

            {/* Custom Item ID & Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-[10px] text-[#9c8979] uppercase block mb-1">
                  Or Custom Item ID:
                </label>
                <input
                  type="text"
                  placeholder="e.g. netherite_sword"
                  value={customItemId}
                  onChange={(e) => setCustomItemId(e.target.value)}
                  className="w-full bg-[#100b08] border border-[#332216] px-2.5 py-1.5 text-xs text-white font-mono placeholder:text-[#554433]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#9c8979] uppercase block mb-1">
                  Target Selector:
                </label>
                <select
                  value={targetSelector}
                  onChange={(e) => setTargetSelector(e.target.value)}
                  className="w-full bg-[#100b08] border border-[#332216] px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="@p">@p (Nearest Player)</option>
                  <option value="@s">@s (Executing Player)</option>
                  <option value="@a">@a (All Players)</option>
                  <option value="@r">@r (Random Player)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9c8979] uppercase block mb-1">
                  Item Count: {itemCount}
                </label>
                <input
                  type="number"
                  min="1"
                  max="64"
                  value={itemCount}
                  onChange={(e) => setItemCount(Math.max(1, Math.min(64, parseInt(e.target.value) || 1)))}
                  className="w-full bg-[#100b08] border border-[#332216] px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Custom Name with Gradients */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="flex items-center justify-between border-b-2 border-[#332216] pb-2">
              <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Step 2: Custom Name (Colors & Gradients)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setNameColorMode('gradient')}
                  className={`px-2 py-0.5 text-[10px] uppercase cursor-pointer ${
                    nameColorMode === 'gradient'
                      ? 'bg-[#5b8731] text-yellow-300 font-bold border border-[#7cb342]'
                      : 'text-[#9c8979] hover:text-white'
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => setNameColorMode('solid')}
                  className={`px-2 py-0.5 text-[10px] uppercase cursor-pointer ${
                    nameColorMode === 'solid'
                      ? 'bg-[#5b8731] text-yellow-300 font-bold border border-[#7cb342]'
                      : 'text-[#9c8979] hover:text-white'
                  }`}
                >
                  Solid Color
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="text-[10px] text-[#9c8979] uppercase block mb-1">
                Item Custom Name:
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Leave blank for vanilla name"
                className="w-full bg-[#100b08] border border-[#332216] px-3 py-2 text-sm text-white placeholder:text-[#554433]"
              />
            </div>

            {/* Effects (Bold, Italic, etc.) */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[10px] text-[#9c8979] uppercase mr-1">Styles:</span>
              <label className="flex items-center gap-1 text-[#c2b09e] cursor-pointer">
                <input
                  type="checkbox"
                  checked={nameEffects.bold}
                  onChange={(e) => setNameEffects({ ...nameEffects, bold: e.target.checked })}
                  className="accent-[#5b8731]"
                />
                <span className="font-bold">Bold</span>
              </label>
              <label className="flex items-center gap-1 text-[#c2b09e] cursor-pointer">
                <input
                  type="checkbox"
                  checked={nameEffects.italic}
                  onChange={(e) => setNameEffects({ ...nameEffects, italic: e.target.checked })}
                  className="accent-[#5b8731]"
                />
                <span className="italic">Italic</span>
              </label>
              <label className="flex items-center gap-1 text-[#c2b09e] cursor-pointer">
                <input
                  type="checkbox"
                  checked={nameEffects.underlined}
                  onChange={(e) => setNameEffects({ ...nameEffects, underlined: e.target.checked })}
                  className="accent-[#5b8731]"
                />
                <span className="underline">Underline</span>
              </label>
              <label className="flex items-center gap-1 text-[#c2b09e] cursor-pointer">
                <input
                  type="checkbox"
                  checked={nameEffects.strikethrough}
                  onChange={(e) => setNameEffects({ ...nameEffects, strikethrough: e.target.checked })}
                  className="accent-[#5b8731]"
                />
                <span className="line-through">Strike</span>
              </label>
              <label className="flex items-center gap-1 text-[#c2b09e] cursor-pointer">
                <input
                  type="checkbox"
                  checked={nameEffects.obfuscated}
                  onChange={(e) => setNameEffects({ ...nameEffects, obfuscated: e.target.checked })}
                  className="accent-[#5b8731]"
                />
                <span className="text-pink-400">Glitch</span>
              </label>
            </div>

            {/* Gradient Stops or Solid Palette */}
            {nameColorMode === 'gradient' ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[10px] text-[#9c8979] uppercase">
                  <span>Gradient Color Stops:</span>
                  <div className="flex items-center gap-1">
                    {GRADIENT_PRESETS.slice(0, 5).map(p => (
                      <button
                        key={p.name}
                        onClick={() => setNameGradientStops(p.stops)}
                        className="px-1.5 py-0.5 bg-[#120d09] border border-[#332216] hover:border-white text-[9px] text-[#c2b09e]"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {nameGradientStops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-[#100b08] p-1 border border-[#332216]">
                      <input
                        type="color"
                        value={stop}
                        onChange={(e) => {
                          const updated = [...nameGradientStops];
                          updated[idx] = e.target.value;
                          setNameGradientStops(updated);
                        }}
                        className="w-5 h-5 bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={stop}
                        onChange={(e) => {
                          const updated = [...nameGradientStops];
                          updated[idx] = e.target.value;
                          setNameGradientStops(updated);
                        }}
                        className="w-16 bg-transparent text-[10px] font-mono text-white uppercase border-0"
                      />
                      {nameGradientStops.length > 2 && (
                        <button
                          onClick={() => setNameGradientStops(nameGradientStops.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-300 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {nameGradientStops.length < 5 && (
                    <button
                      onClick={() => setNameGradientStops([...nameGradientStops, '#ffffff'])}
                      className="px-2 py-1 bg-[#1a2b0d] border border-[#41681a] text-xs text-yellow-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Stop</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <input
                  type="color"
                  value={nameSolidColor}
                  onChange={(e) => setNameSolidColor(e.target.value)}
                  className="w-7 h-7 bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={nameSolidColor}
                  onChange={(e) => setNameSolidColor(e.target.value)}
                  className="w-24 bg-[#100b08] border border-[#332216] px-2 py-1 text-xs font-mono text-white uppercase"
                />
                <div className="flex items-center gap-1 flex-wrap">
                  {MINECRAFT_CLASSIC_COLORS.slice(0, 10).map(c => (
                    <button
                      key={c.code}
                      onClick={() => setNameSolidColor(c.hex)}
                      className="w-4 h-4 border border-black cursor-pointer"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Custom Lore Lines */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="flex items-center justify-between border-b-2 border-[#332216] pb-2">
              <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Step 3: Custom Lore (Description Lines)
              </span>
              <button
                onClick={() => setLoreLines([...loreLines, { id: Date.now().toString(), text: '', color: '#aaaaaa', italic: true }])}
                className="px-2 py-0.5 text-[10px] uppercase bg-[#1a2b0d] border border-[#41681a] text-yellow-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Lore Line</span>
              </button>
            </div>

            <div className="space-y-2">
              {loreLines.map((line, idx) => (
                <div key={line.id} className="flex items-center gap-2 bg-[#100b08] p-2 border border-[#332216]">
                  <span className="text-[10px] text-[#776655] shrink-0">#{idx + 1}</span>
                  <input
                    type="text"
                    value={line.text}
                    onChange={(e) => {
                      const updated = [...loreLines];
                      updated[idx].text = e.target.value;
                      setLoreLines(updated);
                    }}
                    placeholder={`Lore line ${idx + 1}`}
                    className="flex-1 bg-transparent text-xs text-white border-0 focus:outline-none"
                  />
                  <input
                    type="color"
                    value={line.color}
                    onChange={(e) => {
                      const updated = [...loreLines];
                      updated[idx].color = e.target.value;
                      setLoreLines(updated);
                    }}
                    className="w-5 h-5 bg-transparent border-0 cursor-pointer shrink-0"
                  />
                  <label className="flex items-center gap-1 text-[10px] text-[#c2b09e] cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={line.italic}
                      onChange={(e) => {
                        const updated = [...loreLines];
                        updated[idx].italic = e.target.checked;
                        setLoreLines(updated);
                      }}
                      className="accent-[#5b8731]"
                    />
                    <span>Italic</span>
                  </label>
                  <button
                    onClick={() => setLoreLines(loreLines.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-300 p-0.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {loreLines.length === 0 && (
                <p className="text-xs text-[#776655] italic">No lore added. Click "Add Lore Line" to attach item descriptions.</p>
              )}
            </div>
          </div>

          {/* Card 4: Enchantments Selector */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="flex items-center justify-between border-b-2 border-[#332216] pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Step 4: Enchantments Matrix
                </span>
                <span className="px-1.5 py-0.5 bg-[#2b4414] text-[10px] text-emerald-300">
                  {activeEnchantCount} active
                </span>
              </div>

              {/* Clear button */}
              {activeEnchantCount > 0 && (
                <button
                  onClick={() => setSelectedEnchants({})}
                  className="text-[10px] uppercase text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1 flex-wrap">
                {['All', 'Weapon', 'Mace 1.21', 'Ranged', 'Armor', 'Tool', 'Utility'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-0.5 text-[10px] uppercase cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#5b8731] text-yellow-300 font-bold border border-[#7cb342]'
                        : 'bg-[#100b08] text-[#9c8979] hover:text-white border border-[#332216]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search enchantment..."
                value={enchantSearch}
                onChange={(e) => setEnchantSearch(e.target.value)}
                className="bg-[#100b08] border border-[#332216] px-2 py-1 text-xs text-white placeholder:text-[#554433] w-40"
              />
            </div>

            {/* Enchantments List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredEnchants.map(ench => {
                const currentLevel = selectedEnchants[ench.id] || 0;
                return (
                  <div
                    key={ench.id}
                    className={`p-2 border flex items-center justify-between gap-2 ${
                      currentLevel > 0
                        ? 'bg-[#1e2d14] border-[#4a8028]'
                        : 'bg-[#100b08] border-[#291c13]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] truncate font-bold ${currentLevel > 0 ? 'text-yellow-300' : 'text-[#c2b09e]'}`}>
                          {ench.name}
                        </span>
                        {ench.category === 'Mace 1.21' && (
                          <span className="px-1 py-0.2 text-[8px] bg-cyan-900 text-cyan-200">1.21</span>
                        )}
                      </div>
                      <span className="text-[9px] text-[#7d6c5e]">
                        Vanilla max: {ench.maxVanilla} · OP God: 255
                      </span>
                    </div>

                    {/* Level controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={currentLevel}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                          setSelectedEnchants(prev => {
                            if (val === 0) {
                              const copy = { ...prev };
                              delete copy[ench.id];
                              return copy;
                            }
                            return { ...prev, [ench.id]: val };
                          });
                        }}
                        className="w-14 bg-black/60 border border-white/10 px-1 py-0.5 text-xs text-center text-white font-mono"
                      />
                      <button
                        onClick={() => {
                          setSelectedEnchants(prev => ({
                            ...prev,
                            [ench.id]: currentLevel === ench.maxVanilla ? 255 : ench.maxVanilla
                          }));
                        }}
                        className="px-1.5 py-0.5 text-[9px] bg-[#332216] hover:bg-[#443322] text-[#c2b09e] border border-white/10"
                        title="Toggle Vanilla Max / God 255"
                      >
                        {currentLevel === ench.maxVanilla ? '255' : 'Max'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 5: Advanced Modifiers (Unbreakable, Custom Attributes) */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="flex items-center justify-between border-b-2 border-[#332216] pb-2">
              <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Step 5: Advanced Modifiers & Unbreakable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2 bg-[#100b08] border border-[#332216] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnbreakable}
                  onChange={(e) => setIsUnbreakable(e.target.checked)}
                  className="accent-[#5b8731]"
                />
                <div>
                  <span className="text-yellow-300 font-bold block">Unbreakable Item</span>
                  <span className="text-[10px] text-[#9c8979]">Never loses durability from combat or mining.</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 bg-[#100b08] border border-[#332216] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBonusAttack}
                  onChange={(e) => setIncludeBonusAttack(e.target.checked)}
                  className="accent-[#5b8731]"
                />
                <div>
                  <span className="text-cyan-300 font-bold block">Custom Attack Damage</span>
                  <span className="text-[10px] text-[#9c8979]">One-shot bosses (Attribute modifier).</span>
                </div>
              </label>
            </div>

            {includeBonusAttack && (
              <div className="p-2 bg-[#100b08] border border-cyan-800/40 flex items-center justify-between">
                <span className="text-[11px] text-[#c2b09e]">Attack Damage Bonus:</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={bonusAttackDamage}
                  onChange={(e) => setBonusAttackDamage(parseInt(e.target.value) || 1)}
                  className="w-24 bg-black/60 border border-cyan-500/30 px-2 py-0.5 text-xs text-cyan-300 font-mono text-center"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In-Game Tooltip Preview & Generated Commands */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Authentic Minecraft In-Game Tooltip Simulation */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="border-b-2 border-[#332216] pb-2 flex items-center justify-between">
              <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Live Minecraft Tooltip Simulation
              </span>
              <span className="text-[10px] text-[#a09080]">Hover Box</span>
            </div>

            {/* Dark Purple Gradient Minecraft Tooltip Box */}
            <div className="flex justify-center p-4 bg-[#050302] border-2 border-[#1a120b]">
              <div
                className="w-full max-w-sm p-3.5 shadow-2xl relative select-none font-minecraftia"
                style={{
                  background: 'linear-gradient(135deg, #100010 0%, #170017 100%)',
                  border: '2px solid #28004f',
                  boxShadow: '0 0 0 1px #100010, 0 8px 24px rgba(0,0,0,0.8)'
                }}
              >
                {/* Item Custom Name */}
                <div className="text-sm font-bold tracking-wide">
                  {customName ? (
                    computedNameChars.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          color: c.hex,
                          fontWeight: c.bold ? 'bold' : 'normal',
                          fontStyle: c.italic ? 'italic' : 'normal',
                          textDecoration: [
                            c.underlined ? 'underline' : '',
                            c.strikethrough ? 'line-through' : ''
                          ].filter(Boolean).join(' ') || undefined,
                          textShadow: '2px 2px 0px rgba(0,0,0,0.9)'
                        }}
                      >
                        {c.char}
                      </span>
                    ))
                  ) : (
                    <span className="text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.9)]">
                      {POPULAR_ITEMS.find(i => i.id === activeItemId)?.name || activeItemId}
                    </span>
                  )}
                </div>

                {/* Enchantments list */}
                {activeEnchantCount > 0 && (
                  <div className="mt-2 space-y-0.5 text-xs text-[#a8a8a8] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.9)]">
                    {Object.entries(selectedEnchants)
                      .filter(([, lvl]) => Number(lvl) > 0)
                      .map(([id, lvl]) => {
                        const ench = ALL_ENCHANTMENTS.find(e => e.id === id);
                        return (
                          <div key={id} className="text-[#a0a0ff]">
                            {ench?.name || id} {Number(lvl) > 1 ? lvl : ''}
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Lore lines */}
                {loreLines.filter(l => l.text.trim()).length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-purple-900/40 space-y-0.5 text-xs">
                    {loreLines.filter(l => l.text.trim()).map(line => (
                      <div
                        key={line.id}
                        style={{
                          color: line.color,
                          fontStyle: line.italic ? 'italic' : 'normal',
                          textShadow: '1px 1px 0px rgba(0,0,0,0.9)'
                        }}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Unbreakable tag */}
                {isUnbreakable && (
                  <div className="mt-2 text-xs text-[#55ffff] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.9)]">
                    Unbreakable
                  </div>
                )}

                {/* Bonus damage */}
                {includeBonusAttack && (
                  <div className="mt-2 pt-2 border-t border-purple-900/40 text-xs text-[#55ff55] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.9)]">
                    +{bonusAttackDamage} Attack Damage
                  </div>
                )}

                {/* Item Identifier */}
                <div className="mt-3 text-[10px] text-[#555555] font-mono">
                  minecraft:{activeItemId}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Ready Commands for All Minecraft Versions */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="border-b-2 border-[#332216] pb-2 flex items-center justify-between">
              <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Summon Commands (1-Click Copy)
              </span>
              <span className="text-[10px] text-emerald-400 bg-[#12220b] border border-[#2b5414] px-1.5 py-0.5">
                Java 1.20.5+ · 1.21+ · 26.3
              </span>
            </div>

            <div className="space-y-3">
              {/* Composable /execute Pipeline Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-[#120d09] border border-[#2b1c13]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-white text-xs font-bold block">
                      Composable /execute Pipeline
                    </span>
                    <span className="text-[10px] text-[#9c8979]">
                      Parity standard: /execute as &lt;target&gt; at @s run give @s ...
                    </span>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useExecutePipeline}
                    onChange={(e) => setUseExecutePipeline(e.target.checked)}
                    className="accent-[#8e24aa] w-4 h-4 cursor-pointer"
                  />
                  <span className={`text-[11px] font-bold uppercase ${useExecutePipeline ? 'text-purple-300' : 'text-[#776655]'}`}>
                    {useExecutePipeline ? 'Active' : 'Off'}
                  </span>
                </label>
              </div>

              {/* Modern Java Command */}
              <div className="p-3 bg-[#100b08] border-2 border-yellow-700/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-yellow-300 font-bold text-[11px] uppercase block">
                      Java 1.20.5+ / 1.21+ / 26.3 Modern Syntax
                    </span>
                    <span className="text-[10px] text-[#9c8979]">
                      Enforces item_id[enchantments={'{...}'},custom_name='{'{...}'}']
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('modernJava', modernJavaCommand)}
                    className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedKey === 'modernJava' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'modernJava' ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-[#a09080] break-all max-h-24 overflow-y-auto p-1.5 bg-black/50 border border-white/5">
                  {modernJavaCommand}
                </div>
              </div>

              {/* Legacy Java Command */}
              <div className="p-3 bg-[#100b08] border-2 border-[#291c13] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#c2b09e] font-bold text-[11px] uppercase block">
                      Legacy Java (1.13 - 1.20.4) (/give Command)
                    </span>
                    <span className="text-[10px] text-[#9c8979]">
                      Uses classic NBT syntax (`{'{...}'}`)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('legacyJava', legacyJavaCommand)}
                    className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedKey === 'legacyJava' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'legacyJava' ? 'Copied!' : 'Copy Legacy'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-[#a09080] break-all max-h-20 overflow-y-auto p-1.5 bg-black/50 border border-white/5">
                  {legacyJavaCommand}
                </div>
              </div>

              {/* Bedrock Edition */}
              <div className="p-3 bg-[#100b08] border-2 border-cyan-900/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-cyan-300 font-bold text-[11px] uppercase block">
                      Bedrock Edition Command
                    </span>
                    <span className="text-[10px] text-[#9c8979]">
                      Bedrock does not support NBT inside /give. Run /enchant in-game.
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy('bedrock', bedrockCommand)}
                    className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedKey === 'bedrock' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'bedrock' ? 'Copied!' : 'Copy Bedrock'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-cyan-200/90 break-all p-1.5 bg-black/50 border border-cyan-500/20">
                  {bedrockCommand}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
