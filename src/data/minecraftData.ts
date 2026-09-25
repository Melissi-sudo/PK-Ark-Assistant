export interface MinecraftPotion {
  id: string;
  name: string;
  category: 'Combat' | 'Survival' | 'Utility' | 'Negative' | '1.21 Trials';
  baseIngredient: string;
  secondaryIngredient: string;
  effect: string;
  standardDuration: string;
  extendedDuration?: string;
  upgradedEffect?: string;
  hasExtended: boolean;
  hasAmplified: boolean;
  canBeSplash: boolean;
  canBeLingering: boolean;
  color: string;
  accentBg: string;
  pvpNote: string;
  recipeSteps: string[];
}

export interface OreDistribution {
  id: string;
  name: string;
  dimension: 'Overworld' | 'Nether';
  minY: number;
  maxY: number;
  peakY: number[];
  shape: 'Triangular' | 'Uniform' | 'Reduced Air Exposure' | 'Special Biome';
  miningLevel: string;
  optimalStrategy: string;
  fortuneMultiplier: string;
  notes: string;
  color: string;
  bgGradient: string;
}

export interface VillagerProfession {
  id: string;
  name: string;
  jobBlock: string;
  craftingSummary: string;
  iconName: string;
  topTrades: {
    level: 'Novice' | 'Apprentice' | 'Journeyman' | 'Expert' | 'Master';
    itemGiven: string;
    itemReceived: string;
    cost: string;
    importance: 'Essential' | 'High' | 'Situational';
  }[];
  curingDiscountSummary: string;
  biomeRebalanceNote?: string;
}

export interface RedstoneComponentInfo {
  name: string;
  redstoneTicks: number;
  gameTicks: number;
  seconds: number;
  usage: string;
  tips: string;
}

export const MINECRAFT_POTIONS: MinecraftPotion[] = [
  // 1.21 Tricky Trials New Potions
  {
    id: 'wind-charged',
    name: 'Potion of Wind Charging',
    category: '1.21 Trials',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Breeze Rod',
    effect: 'On death, the affected entity bursts into a Wind Charge explosion, blasting nearby mobs and knocking back players.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#bae6fd',
    accentBg: 'rgba(186, 230, 253, 0.15)',
    pvpNote: '1.21 Meta: Throw splash onto swarms or mob farms to create automated chain-reaction kinetic explosions.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Breeze Rod -> Potion of Wind Charging (3:00)', 'Optional: Add Redstone Dust -> Extended (8:00)']
  },
  {
    id: 'oozing',
    name: 'Potion of Oozing',
    category: '1.21 Trials',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Slime Block',
    effect: 'On death, the affected entity spawns two medium Slimes upon demise.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#86efac',
    accentBg: 'rgba(134, 239, 172, 0.15)',
    pvpNote: 'Crucial for automated slime farms: splash high-yield hostile mobs or chickens to harvest infinite slime balls without finding swamp/slime chunks.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Slime Block -> Potion of Oozing (3:00)', 'Optional: Add Redstone Dust -> Extended (8:00)']
  },
  {
    id: 'weaving',
    name: 'Potion of Weaving',
    category: '1.21 Trials',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Cobweb',
    effect: 'Entity gains 50% faster movement speed through cobwebs and spawns 2-3 Cobwebs on death.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#e2e8f0',
    accentBg: 'rgba(226, 232, 240, 0.15)',
    pvpNote: 'God-tier PvP trap modifier: drink before entering cobweb defenses to sprint at normal speeds while enemies crawl.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Cobweb -> Potion of Weaving (3:00)', 'Optional: Add Redstone Dust -> Extended (8:00)']
  },
  {
    id: 'infested',
    name: 'Potion of Infested',
    category: '1.21 Trials',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Stone',
    effect: 'Entity has a 10% chance when damaged to spawn 1-2 Silverfish.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#94a3b8',
    accentBg: 'rgba(148, 163, 184, 0.15)',
    pvpNote: 'Hilarious raid defense disruption: splash on invading enemy players to flood their hitboxes with distracting silverfish swarms.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Stone -> Potion of Infested (3:00)', 'Optional: Add Redstone Dust -> Extended (8:00)']
  },
  // Combat Potions
  {
    id: 'strength',
    name: 'Potion of Strength',
    category: 'Combat',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Blaze Powder',
    effect: 'Strength I adds +3 damage (+1.5 hearts) to melee hits. Strength II adds +6 damage (+3 hearts).',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    upgradedEffect: 'Strength II (1:30)',
    hasExtended: true,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#f87171',
    accentBg: 'rgba(248, 113, 113, 0.15)',
    pvpNote: 'Mandatory in competitive sword/mace PvP. Strength II with Sharpness V Netherite Sword can 2-shot unarmored or low-protection players.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Blaze Powder -> Strength I (3:00)', 'Choice A: Add Redstone -> Strength I (8:00)', 'Choice B: Add Glowstone -> Strength II (1:30)']
  },
  {
    id: 'speed',
    name: 'Potion of Swiftness (Speed)',
    category: 'Combat',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Sugar',
    effect: 'Increases FOV and walking/sprinting speed by +20% (Speed I) or +40% (Speed II).',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    upgradedEffect: 'Speed II (1:30)',
    hasExtended: true,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#38bdf8',
    accentBg: 'rgba(56, 189, 248, 0.15)',
    pvpNote: 'Essential for strafing, combo-locking enemies, and escaping bad teamfights in crystal/anchor PvP.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Sugar -> Swiftness I (3:00)', 'Choice A: Add Redstone -> Swiftness I (8:00)', 'Choice B: Add Glowstone -> Swiftness II (1:30)']
  },
  {
    id: 'healing',
    name: 'Potion of Healing (Instant Health)',
    category: 'Combat',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Glistering Melon Slice',
    effect: 'Instantly restores 4 HP (2 hearts) for Level I, or 8 HP (4 hearts) for Level II. Damages undead mobs!',
    standardDuration: 'Instant',
    upgradedEffect: 'Instant Health II (8 HP)',
    hasExtended: false,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#fb7185',
    accentBg: 'rgba(251, 113, 133, 0.15)',
    pvpNote: 'Always carry as Splash Potion of Healing II on your hotbar. Throw at your feet when hit by critical axes or maces.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Glistering Melon -> Instant Health I', 'Add Glowstone Dust -> Instant Health II', 'Add Gunpowder -> Splash Potion of Healing II']
  },
  {
    id: 'regeneration',
    name: 'Potion of Regeneration',
    category: 'Combat',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Ghast Tear',
    effect: 'Restores HP over time. Level I restores 1 heart every 2.5s (36 HP total). Level II restores 1 heart every 1.25s (36 HP over 22s).',
    standardDuration: '0:45',
    extendedDuration: '1:30',
    upgradedEffect: 'Regeneration II (0:22)',
    hasExtended: true,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#ec4899',
    accentBg: 'rgba(236, 72, 153, 0.15)',
    pvpNote: 'Pairs with Golden Apples to create unkillable regeneration stacks during sustained totem-popping fights.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Ghast Tear -> Regeneration I (0:45)', 'Choice A: Redstone -> Regen I (1:30)', 'Choice B: Glowstone -> Regen II (0:22)']
  },
  {
    id: 'turtle-master',
    name: 'Potion of the Turtle Master',
    category: 'Combat',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Turtle Shell (Helmet)',
    effect: 'Gives massive Slowness IV (-60%) but colossal Resistance III (60% damage reduction) for Level I. Level II gives Slowness VI (-90%) and Resistance IV (80% damage reduction!).',
    standardDuration: '0:20',
    extendedDuration: '0:40',
    upgradedEffect: 'Turtle Master II (0:20 - 80% Damage Red.)',
    hasExtended: true,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#059669',
    accentBg: 'rgba(5, 150, 105, 0.15)',
    pvpNote: 'Raid Tank Masterpiece: Drink Level II before taking End Crystal blasts or 100-block fall mace hits to survive with zero totem pops.',
    recipeSteps: ['Craft Turtle Helmet using 5 Scutes', 'Brew Nether Wart -> Awkward Potion', 'Add Turtle Helmet -> Turtle Master I (0:20)', 'Add Glowstone -> Turtle Master II (Resistance IV)']
  },
  // Survival & Nether
  {
    id: 'fire-res',
    name: 'Potion of Fire Resistance',
    category: 'Survival',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Magma Cream',
    effect: 'Grants total immunity to fire, lava, blaze fireballs, magma blocks, and campfire burn damage.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#ea580c',
    accentBg: 'rgba(234, 88, 12, 0.15)',
    pvpNote: 'Non-negotiable for Ancient Debris mining in the Nether lava seas and nullifying opponent Flame bows or Fire Aspect swords.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Magma Cream -> Fire Resistance (3:00)', 'Add Redstone Dust -> Fire Resistance (8:00)']
  },
  {
    id: 'water-breathing',
    name: 'Potion of Water Breathing',
    category: 'Survival',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Pufferfish',
    effect: 'Prevents oxygen bar from depleting underwater and slightly increases underwater visibility.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#2dd4bf',
    accentBg: 'rgba(45, 212, 191, 0.15)',
    pvpNote: 'Crucial for raiding Ocean Monuments (Elder Guardians) and building underwater conduits or subterranean secret bases.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Pufferfish -> Water Breathing (3:00)', 'Add Redstone Dust -> Water Breathing (8:00)']
  },
  {
    id: 'slow-falling',
    name: 'Potion of Slow Falling',
    category: 'Survival',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Phantom Membrane',
    effect: 'Slows falling speed and completely eliminates all fall damage. Also prevents crops from being trampled.',
    standardDuration: '1:30',
    extendedDuration: '4:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#fef08a',
    accentBg: 'rgba(254, 240, 138, 0.15)',
    pvpNote: 'The ultimate counter to Ender Dragon knockups, End City void falls, and 1.21 Breeze wind charges!',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Phantom Membrane -> Slow Falling (1:30)', 'Add Redstone Dust -> Slow Falling (4:00)']
  },
  {
    id: 'night-vision',
    name: 'Potion of Night Vision',
    category: 'Utility',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Golden Carrot',
    effect: 'Renders all dark areas at maximum light level 15. Greatly clears vision underwater and in caves.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#1e3a8a',
    accentBg: 'rgba(30, 58, 138, 0.15)',
    pvpNote: 'Must-have for deepslate diamond caving and spotting hidden enemy bases or submerged ocean ruins.',
    recipeSteps: ['Brew Nether Wart into Water Bottle -> Awkward Potion', 'Add Golden Carrot -> Night Vision (3:00)', 'Add Redstone Dust -> Night Vision (8:00)']
  },
  {
    id: 'invisibility',
    name: 'Potion of Invisibility',
    category: 'Utility',
    baseIngredient: 'Potion of Night Vision',
    secondaryIngredient: 'Fermented Spider Eye',
    effect: 'Turns player model invisible. Hostile mob detection range drops to 7% without armor.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#cbd5e1',
    accentBg: 'rgba(203, 213, 225, 0.15)',
    pvpNote: 'Armor pieces and held items REMAIN VISIBLE! For 100% stealth, take off armor and empty hands before scouting enemy bases.',
    recipeSteps: ['Brew Potion of Night Vision (3:00 or 8:00)', 'Add Fermented Spider Eye -> Potion of Invisibility (3:00 or 8:00)']
  },
  {
    id: 'weakness',
    name: 'Potion of Weakness',
    category: 'Negative',
    baseIngredient: 'Water Bottle (No Nether Wart needed!)',
    secondaryIngredient: 'Fermented Spider Eye',
    effect: 'Reduces melee attack damage by 4 HP (-2 hearts). Used with Golden Apple to cure Zombie Villagers!',
    standardDuration: '1:30',
    extendedDuration: '4:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#64748b',
    accentBg: 'rgba(100, 116, 139, 0.15)',
    pvpNote: 'The cornerstone of Villager economics. Always brew as Splash Potion of Weakness to cure Zombie Villagers for 1-emerald Mending trades.',
    recipeSteps: ['Place ordinary Water Bottle into Brewing Stand (NO NETHER WART)', 'Add Fermented Spider Eye -> Potion of Weakness (1:30)', 'Add Gunpowder -> Splash Potion of Weakness', 'Splash Zombie Villager + Feed Golden Apple -> Cures in 3-5 min!']
  },
  {
    id: 'harming',
    name: 'Potion of Harming (Instant Damage)',
    category: 'Negative',
    baseIngredient: 'Potion of Healing or Poison',
    secondaryIngredient: 'Fermented Spider Eye',
    effect: 'Instantly deals 6 HP (3 hearts) damage for Level I, or 12 HP (6 hearts) for Level II. Heals undead mobs!',
    standardDuration: 'Instant',
    upgradedEffect: 'Instant Damage II (12 HP / 6 Hearts)',
    hasExtended: false,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#7f1d1d',
    accentBg: 'rgba(127, 29, 29, 0.15)',
    pvpNote: 'Completely ignores Protection IV armor! Splash Harming II bypasses armor damage reduction directly.',
    recipeSteps: ['Brew Potion of Healing or Poison', 'Add Fermented Spider Eye -> Potion of Harming I', 'Add Glowstone -> Instant Damage II', 'Add Gunpowder -> Splash Harming II']
  }
];

export const MINECRAFT_ORES: OreDistribution[] = [
  {
    id: 'diamonds',
    name: 'Diamond Ore & Deepslate Diamond',
    dimension: 'Overworld',
    minY: -64,
    maxY: 16,
    peakY: [-58, -59],
    shape: 'Triangular',
    miningLevel: 'Iron Pickaxe or better',
    optimalStrategy: 'Strip mine / poke-hole at Y = -58 or -59. Bedrock lava pools rest at Y = -54. Since 1.18+, triangular distribution increases diamond frequency the deeper you go. Air exposure is reduced by 50% in open caves, so strip mining yields 2x more diamonds per hour than open cave walking.',
    fortuneMultiplier: 'Fortune III averages 2.2x diamonds per ore block (up to 4 per block)',
    notes: 'In 1.21 Tricky Trials, Vaults in Trial Chambers also reward guaranteed Diamonds and heavy trial keys.',
    color: '#38bdf8',
    bgGradient: 'from-cyan-900/40 via-cyan-950/20 to-black'
  },
  {
    id: 'ancient-debris',
    name: 'Ancient Debris (Netherite)',
    dimension: 'Nether',
    minY: 8,
    maxY: 119,
    peakY: [15],
    shape: 'Triangular',
    miningLevel: 'Diamond Pickaxe or better',
    optimalStrategy: 'Bed Blasting or TNT mining at Y = 15. Dig a straight 1x2 tunnel at Y = 15, place a bed every 5 blocks, place a stone block between you and the bed, right-click the bed to explode. Ancient Debris has blast resistance 1200 and will never be destroyed by explosions.',
    fortuneMultiplier: 'NOT affected by Fortune. Smelts into 1 Netherite Scrap (4 Scraps + 4 Gold Ingots = 1 Netherite Ingot).',
    notes: 'Upgrading diamond gear in 1.20+ requires a Netherite Upgrade Smithing Template found in Bastion Remnants (guaranteed in Treasure Bastions).',
    color: '#a855f7',
    bgGradient: 'from-purple-900/40 via-purple-950/20 to-black'
  },
  {
    id: 'iron',
    name: 'Iron Ore & Deepslate Iron',
    dimension: 'Overworld',
    minY: -64,
    maxY: 320,
    peakY: [16, 232],
    shape: 'Triangular',
    miningLevel: 'Stone Pickaxe or better',
    optimalStrategy: 'Two massive peaks: Y = 16 for underground caving & strip mining, and Y = 232 in Mountain peaks (Jagged Peaks & Stony Peaks). For automated supply, build a 3-villager zombie iron golem farm in spawn chunks.',
    fortuneMultiplier: 'Fortune III drops up to 4 Raw Iron per ore block',
    notes: 'Essential for hoppers, minecarts, pistons, and crafting heavy armor before diamond tier.',
    color: '#cbd5e1',
    bgGradient: 'from-slate-700/40 via-slate-900/20 to-black'
  },
  {
    id: 'gold',
    name: 'Gold Ore & Deepslate Gold',
    dimension: 'Overworld',
    minY: -64,
    maxY: 32,
    peakY: [-16],
    shape: 'Triangular',
    miningLevel: 'Iron Pickaxe or better',
    optimalStrategy: 'Standard peak is Y = -16 in all Overworld biomes. EXCEPTION: In Badlands (Mesa) biomes, gold generates massively from Y = 32 up to Y = 256 in exposed red sand and terracotta cliffs! In the Nether, Nether Gold Ore is everywhere.',
    fortuneMultiplier: 'Fortune III drops up to 4 Raw Gold per Overworld block and up to 24 Gold Nuggets per Nether block',
    notes: 'Crucial for Golden Apples, Piglin bartering, Powered Rails, and Netherite Ingots.',
    color: '#eab308',
    bgGradient: 'from-amber-700/40 via-amber-950/20 to-black'
  },
  {
    id: 'coal',
    name: 'Coal Ore & Deepslate Coal',
    dimension: 'Overworld',
    minY: 0,
    maxY: 320,
    peakY: [96],
    shape: 'Triangular',
    miningLevel: 'Wooden Pickaxe or better',
    optimalStrategy: 'Coal NEVER generates below Y = 0! If you are deep caving in Deepslate (Y < 0), you will find zero coal. Explore mountainous surface cliffs or mine around Y = 96 for huge 30+ block clusters.',
    fortuneMultiplier: 'Fortune III drops up to 4 Coal per ore block',
    notes: 'Used for torches, furnace fuel, campfires, and trading with Novice Armorers/Weaponsmiths for emeralds.',
    color: '#475569',
    bgGradient: 'from-zinc-800/40 via-zinc-950/20 to-black'
  },
  {
    id: 'copper',
    name: 'Copper Ore & Deepslate Copper',
    dimension: 'Overworld',
    minY: -16,
    maxY: 112,
    peakY: [48],
    shape: 'Triangular',
    miningLevel: 'Stone Pickaxe or better',
    optimalStrategy: 'Peak at Y = 48. Extremely abundant in Dripstone Caves. In 1.21 Tricky Trials, Copper is used extensively for Copper Bulbs, Crafters, Copper Grates, and Lightning Rods.',
    fortuneMultiplier: 'Fortune III drops up to 20 Raw Copper per single ore block!',
    notes: 'Raw Copper blocks can be used for compact storage and decorative building blocks.',
    color: '#f97316',
    bgGradient: 'from-orange-800/40 via-orange-950/20 to-black'
  },
  {
    id: 'redstone',
    name: 'Redstone Ore & Deepslate Redstone',
    dimension: 'Overworld',
    minY: -64,
    maxY: 16,
    peakY: [-58, -64],
    shape: 'Triangular',
    miningLevel: 'Iron Pickaxe or better',
    optimalStrategy: 'Abundant alongside diamonds in deepslate caves at Y = -58 to -64. Emits light level 9 when stepped on or clicked.',
    fortuneMultiplier: 'Fortune III drops up to 8 Redstone Dust per block',
    notes: 'Used for wiring, repeaters, comparators, potion duration extension, and Crafter recipes in 1.21.',
    color: '#ef4444',
    bgGradient: 'from-red-900/40 via-red-950/20 to-black'
  },
  {
    id: 'lapis',
    name: 'Lapis Lazuli Ore',
    dimension: 'Overworld',
    minY: -64,
    maxY: 64,
    peakY: [0],
    shape: 'Triangular',
    miningLevel: 'Stone Pickaxe or better',
    optimalStrategy: 'Strict triangular peak centered at Y = 0 (sea level boundary). Generates in tight clusters of 4-8 blocks.',
    fortuneMultiplier: 'Fortune III yields up to 36 Lapis Lazuli from a single ore block!',
    notes: 'Mandatory fuel for the Enchanting Table (1 to 3 pieces per enchantment) and blue dye crafting.',
    color: '#2563eb',
    bgGradient: 'from-blue-900/40 via-blue-950/20 to-black'
  },
  {
    id: 'emerald',
    name: 'Emerald Ore & Deepslate Emerald',
    dimension: 'Overworld',
    minY: -16,
    maxY: 320,
    peakY: [232],
    shape: 'Special Biome',
    miningLevel: 'Iron Pickaxe or better',
    optimalStrategy: 'ONLY generates in Mountain biomes (Jagged Peaks, Frozen Peaks, Meadow, Grove, Windswept Hills). Frequency spikes dramatically the higher you climb, peaking at Y = 232. Generates as single blocks rather than veins.',
    fortuneMultiplier: 'Fortune III yields up to 4 Emeralds per block. Silk Touch is prized by collectors.',
    notes: 'Easiest way to get emeralds is NOT mining: trade sticks to Fletcher villagers or pumpkins/melons to Farmers.',
    color: '#10b981',
    bgGradient: 'from-emerald-900/40 via-emerald-950/20 to-black'
  }
];

export const VILLAGER_PROFESSIONS: VillagerProfession[] = [
  {
    id: 'librarian',
    name: 'Librarian',
    jobBlock: 'Lectern',
    craftingSummary: '1 Book + 4 Wood Slabs',
    iconName: 'BookOpen',
    topTrades: [
      { level: 'Novice', itemGiven: '24 Paper', itemReceived: '1 Emerald', cost: '24 Paper', importance: 'High' },
      { level: 'Novice', itemGiven: '1 Book + Emeralds', itemReceived: 'Enchanted Book (Mending, Unbreaking III)', cost: '5 - 64 Emeralds', importance: 'Essential' },
      { level: 'Master', itemGiven: 'Emeralds', itemReceived: 'Name Tag', cost: '20 Emeralds', importance: 'High' }
    ],
    curingDiscountSummary: 'Breaking and re-placing the Lectern at Novice tier re-rolls the enchanted book until Mending is offered. Curing a zombie librarian once reduces book price to 1 emerald + 1 book!',
    biomeRebalanceNote: 'Experimental Trade Rebalance: In 1.20.2+ experimental toggle, Mending is exclusive to Swamp Biome Master librarians!'
  },
  {
    id: 'armorer',
    name: 'Armorer',
    jobBlock: 'Blast Furnace',
    craftingSummary: '1 Furnace + 5 Iron Ingots + 3 Smooth Stone',
    iconName: 'Shield',
    topTrades: [
      { level: 'Novice', itemGiven: '15 Coal', itemReceived: '1 Emerald', cost: '15 Coal', importance: 'High' },
      { level: 'Expert', itemGiven: 'Emeralds', itemReceived: 'Diamond Leggings', cost: '19-33 Emeralds', importance: 'Essential' },
      { level: 'Master', itemGiven: 'Emeralds', itemReceived: 'Enchanted Diamond Chestplate & Helmet', cost: '18-35 Emeralds', importance: 'Essential' }
    ],
    curingDiscountSummary: 'A single curing discount drops full diamond armor set purchases to 1 emerald per armor piece!',
    biomeRebalanceNote: 'Experimental Rebalance locks specific armor piece enchantments to biomes (e.g. Taiga gives Blast Protection, Savanna gives Projectile Protection).'
  },
  {
    id: 'weaponsmith',
    name: 'Weaponsmith',
    jobBlock: 'Grindstone',
    craftingSummary: '2 Sticks + 1 Stone Slab + 2 Wood Planks',
    iconName: 'Sword',
    topTrades: [
      { level: 'Novice', itemGiven: '15 Coal', itemReceived: '1 Emerald', cost: '15 Coal', importance: 'High' },
      { level: 'Expert', itemGiven: 'Emeralds', itemReceived: 'Enchanted Diamond Axe', cost: '17-31 Emeralds', importance: 'Essential' },
      { level: 'Master', itemGiven: 'Emeralds', itemReceived: 'Enchanted Diamond Sword', cost: '13-27 Emeralds', importance: 'Essential' }
    ],
    curingDiscountSummary: 'Allows infinite diamond swords and axes for emeralds, eliminating the need to mine diamonds for weapons.',
    biomeRebalanceNote: 'Offers Looting and Sharpness diamond swords depending on villager origin.'
  },
  {
    id: 'toolsmith',
    name: 'Toolsmith',
    jobBlock: 'Smithing Table',
    craftingSummary: '2 Iron Ingots + 4 Wood Planks',
    iconName: 'Hammer',
    topTrades: [
      { level: 'Novice', itemGiven: '15 Coal', itemReceived: '1 Emerald', cost: '15 Coal', importance: 'High' },
      { level: 'Expert', itemGiven: 'Emeralds', itemReceived: 'Enchanted Diamond Shovel & Hoe', cost: '10-18 Emeralds', importance: 'High' },
      { level: 'Master', itemGiven: 'Emeralds', itemReceived: 'Enchanted Diamond Pickaxe', cost: '18-32 Emeralds', importance: 'Essential' }
    ],
    curingDiscountSummary: 'Grants endless supply of diamond pickaxes for large-scale perimeter clearing or netherite mining.',
    biomeRebalanceNote: 'Master tier guarantees Efficiency III or Fortune II diamond pickaxes.'
  },
  {
    id: 'fletcher',
    name: 'Fletcher',
    jobBlock: 'Fletching Table',
    craftingSummary: '2 Flint + 4 Wood Planks',
    iconName: 'Crosshair',
    topTrades: [
      { level: 'Novice', itemGiven: '32 Sticks', itemReceived: '1 Emerald', cost: '32 Sticks', importance: 'Essential' },
      { level: 'Expert', itemGiven: '10 Flint', itemReceived: '1 Emerald', cost: '10 Flint', importance: 'High' },
      { level: 'Master', itemGiven: '2 Emeralds + 5 Arrows', itemReceived: 'Tipped Arrows (Harming II, Slowness)', cost: '2 Emeralds', importance: 'Essential' }
    ],
    curingDiscountSummary: 'Sticks to emeralds is the fastest early-game emerald generation in Minecraft. 1 cured fletcher trades 1 stick for 1 emerald!',
    biomeRebalanceNote: 'Master tier offers tipped arrows without needing Dragon Breath brewing.'
  },
  {
    id: 'cleric',
    name: 'Cleric',
    jobBlock: 'Brewing Stand',
    craftingSummary: '1 Blaze Rod + 3 Cobblestone',
    iconName: 'Beaker',
    topTrades: [
      { level: 'Novice', itemGiven: '32 Rotten Flesh', itemReceived: '1 Emerald', cost: '32 Rotten Flesh', importance: 'High' },
      { level: 'Journeyman', itemGiven: 'Emeralds', itemReceived: 'Redstone Dust & Lapis Lazuli', cost: '1-2 Emeralds', importance: 'High' },
      { level: 'Expert', itemGiven: 'Emeralds', itemReceived: 'Ender Pearl (x1)', cost: '5 Emeralds', importance: 'Essential' }
    ],
    curingDiscountSummary: 'Buy stacks of Ender Pearls for End travel and fast teleportation without farming Endermen.',
    biomeRebalanceNote: 'Provides Glowstone blocks and Bottles o\' Enchanting (XP bottles) at Master tier.'
  },
  {
    id: 'farmer',
    name: 'Farmer',
    jobBlock: 'Composter',
    craftingSummary: '7 Wood Slabs',
    iconName: 'Wheat',
    topTrades: [
      { level: 'Novice', itemGiven: '20 Wheat / 26 Carrots / 22 Potatoes', itemReceived: '1 Emerald', cost: 'Crops', importance: 'High' },
      { level: 'Journeyman', itemGiven: '6 Pumpkins / 4 Melons', itemReceived: '1 Emerald', cost: 'Pumpkins', importance: 'Essential' },
      { level: 'Master', itemGiven: '3 Emeralds', itemReceived: '3 Golden Carrots', cost: '3 Emeralds', importance: 'Essential' }
    ],
    curingDiscountSummary: 'Golden Carrots have the highest food saturation (14.4) in Minecraft. 1 cured farmer sells 3 Golden Carrots for 1 emerald!',
    biomeRebalanceNote: 'Essential for automatic villager food breeding and golden carrot stockpiling.'
  }
];

export const REDSTONE_TICKS: RedstoneComponentInfo[] = [
  {
    name: 'Game Tick (gt)',
    redstoneTicks: 0.5,
    gameTicks: 1,
    seconds: 0.05,
    usage: 'Base game logic clock (20 ticks per second at normal speed).',
    tips: 'Entity movement, hopper transfer checks, and crop growth evaluate on game ticks.'
  },
  {
    name: 'Redstone Tick (rt)',
    redstoneTicks: 1,
    gameTicks: 2,
    seconds: 0.1,
    usage: 'Standard delay unit for redstone torches and 1-tick repeaters.',
    tips: '10 redstone ticks = 1 second. Torches take 1 rt (2 gt) to invert state.'
  },
  {
    name: 'Repeater (4-Tick Max)',
    redstoneTicks: 4,
    gameTicks: 8,
    seconds: 0.4,
    usage: 'Adjustable delay: 1 rt (0.1s), 2 rt (0.2s), 3 rt (0.3s), or 4 rt (0.4s).',
    tips: 'Right-clicking shifts the lever. 10 repeaters set to 4 ticks create an exact 4-second delay.'
  },
  {
    name: 'Hopper Transfer Cycle',
    redstoneTicks: 4,
    gameTicks: 8,
    seconds: 0.4,
    usage: 'Hoppers transfer exactly 1 item every 8 game ticks (2.5 items per second).',
    tips: 'A hopper clock with 30 items takes exactly 12 seconds per half-cycle (24s full period).'
  },
  {
    name: 'Comparator Subtraction',
    redstoneTicks: 1,
    gameTicks: 2,
    seconds: 0.1,
    usage: 'Compares rear signal to side signal. In subtract mode (front torch ON), outputs Rear - Side.',
    tips: 'Essential for reading inventory fullness (0-15 signal strength) and fast pulse generation.'
  },
  {
    name: 'Crafter (1.21 Tricky Trials)',
    redstoneTicks: 2,
    gameTicks: 4,
    seconds: 0.2,
    usage: 'Crafts items automatically when pulsed by a redstone signal. Emits comparator signal based on filled slots.',
    tips: 'Allows 100% automated crafting of iron blocks, gold ingots, dispensers, and armor from farms!'
  }
];
