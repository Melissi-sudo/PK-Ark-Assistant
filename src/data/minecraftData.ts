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
  corruptionTarget?: string;
}

export interface OreDistribution {
  id: string;
  name: string;
  dimension: 'Overworld' | 'Nether';
  minY: number;
  maxY: number;
  peakY: number[];
  recommendedY?: number[];
  shape: 'Triangular' | 'Uniform' | 'Reduced Air Exposure' | 'Special Biome';
  miningLevel: string;
  batches?: string;
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
  // 1.21 Tricky Trials Potions (Verified: Cannot be extended with Redstone or amplified with Glowstone)
  {
    id: 'wind-charged',
    name: 'Potion of Wind Charging',
    category: '1.21 Trials',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Breeze Rod',
    effect: 'On death, the affected entity emits a Wind Burst knocking back nearby mobs and launching nearby entities.',
    standardDuration: '3:00',
    hasExtended: false,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#bae6fd',
    accentBg: 'rgba(186, 230, 253, 0.15)',
    pvpNote: '1.21 Kinetic Meta: Cannot be extended with Redstone. Lingering cloud lasts 45 seconds (1/4 duration). Splash onto swarms to create chain-reaction blasts.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Breeze Rod -> Potion of Wind Charging (3:00)',
      'Add Gunpowder -> Splash Potion (3:00)',
      'Add Dragon Breath -> Lingering Potion (0:45 cloud)'
    ]
  },
  {
    id: 'oozing',
    name: 'Potion of Oozing',
    category: '1.21 Trials',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Slime Block',
    effect: 'On death, the affected entity spawns two medium Slimes upon demise. Does not cause infinite slime loops on slimes themselves.',
    standardDuration: '3:00',
    hasExtended: false,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#86efac',
    accentBg: 'rgba(134, 239, 172, 0.15)',
    pvpNote: 'Automated Slime Farming: Fixed 3:00 duration (Redstone cannot extend). Splash high-density mobs to harvest slime balls in any biome without slime chunks.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Slime Block -> Potion of Oozing (3:00)',
      'Add Gunpowder -> Splash Potion (3:00)',
      'Add Dragon Breath -> Lingering Potion (0:45 cloud)'
    ]
  },
  {
    id: 'weaving',
    name: 'Potion of Weaving',
    category: '1.21 Trials',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Cobweb',
    effect: 'Affected entity moves 50% faster through Cobwebs and spawns 2-3 Cobweb blocks on death.',
    standardDuration: '3:00',
    hasExtended: false,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#e2e8f0',
    accentBg: 'rgba(226, 232, 240, 0.15)',
    pvpNote: 'Trap Control: Cannot be extended with Redstone. Drink before charging cobweb-lined defense chokepoints to retain mobility.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Cobweb -> Potion of Weaving (3:00)',
      'Add Gunpowder -> Splash Potion (3:00)',
      'Add Dragon Breath -> Lingering Potion (0:45 cloud)'
    ]
  },
  {
    id: 'infested',
    name: 'Potion of Infested',
    category: '1.21 Trials',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Stone (Natural Stone)',
    effect: 'Affected entity has a 10% chance per damage tick to spawn 1-2 Silverfish.',
    standardDuration: '3:00',
    hasExtended: false,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#94a3b8',
    accentBg: 'rgba(148, 163, 184, 0.15)',
    pvpNote: 'Combat Disruption: Fixed 3:00 duration (Redstone cannot extend). Silverfish swarms interrupt shield blocks and opponent bow draws.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Stone -> Potion of Infested (3:00)',
      'Add Gunpowder -> Splash Potion (3:00)',
      'Add Dragon Breath -> Lingering Potion (0:45 cloud)'
    ]
  },
  // Core Combat Potions
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
    pvpNote: 'Mandatory in competitive sword/mace PvP. Strength II with Sharpness V Netherite Sword deals lethal burst.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Blaze Powder -> Strength I (3:00)',
      'Choice A: Add Redstone -> Strength I (8:00)',
      'Choice B: Add Glowstone -> Strength II (1:30)'
    ]
  },
  {
    id: 'speed',
    name: 'Potion of Swiftness (Speed)',
    category: 'Combat',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Sugar',
    effect: 'Increases walking and sprinting speed by +20% (Speed I) or +40% (Speed II).',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    upgradedEffect: 'Speed II (1:30)',
    hasExtended: true,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#38bdf8',
    accentBg: 'rgba(56, 189, 248, 0.15)',
    pvpNote: 'Essential for strafing, combo-locking enemies, and spacing in crystal/anchor PvP. Corrupts into Slowness!',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Sugar -> Swiftness I (3:00)',
      'Choice A: Add Redstone -> Swiftness I (8:00)',
      'Choice B: Add Glowstone -> Swiftness II (1:30)',
      'Corrupt: Add Fermented Spider Eye -> Potion of Slowness'
    ],
    corruptionTarget: 'slowness'
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
    pvpNote: 'Hotbar Staple: Always brew as Splash Healing II. Throw at feet during critical hit trades.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Glistering Melon -> Instant Health I',
      'Add Glowstone Dust -> Instant Health II',
      'Add Gunpowder -> Splash Potion of Healing II',
      'Corrupt: Add Fermented Spider Eye -> Potion of Harming'
    ],
    corruptionTarget: 'harming'
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
    pvpNote: 'Pairs with Golden Apples to sustain health regeneration during heavy totem-popping fights.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Ghast Tear -> Regeneration I (0:45)',
      'Choice A: Redstone -> Regen I (1:30)',
      'Choice B: Glowstone -> Regen II (0:22)'
    ]
  },
  {
    id: 'turtle-master',
    name: 'Potion of the Turtle Master',
    category: 'Combat',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Turtle Shell (Helmet)',
    effect: 'Level I grants Slowness IV (-60%) and Resistance III (60% damage reduction) for 20s (40s extended). Level II gives Slowness VI (-90%) and Resistance IV (80% damage reduction) for 20s.',
    standardDuration: '0:20',
    extendedDuration: '0:40',
    upgradedEffect: 'Turtle Master II (0:20 - 80% Damage Red.)',
    hasExtended: true,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#059669',
    accentBg: 'rgba(5, 150, 105, 0.15)',
    pvpNote: 'Raid Tank Meta: Drink Level II before taking End Crystal blasts or 100-block fall mace hits to survive with zero totem pops.',
    recipeSteps: [
      'Craft Turtle Helmet using 5 Scutes',
      'Brew Nether Wart -> Awkward Potion',
      'Add Turtle Helmet -> Turtle Master I (0:20)',
      'Choice A: Add Redstone -> Turtle Master I (0:40)',
      'Choice B: Add Glowstone -> Turtle Master II (0:20)'
    ]
  },
  // Survival & Utility Potions
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
    pvpNote: 'Non-negotiable for Nether lava exploration, ancient debris mining, and nullifying Flame bows or Fire Aspect swords.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Magma Cream -> Fire Resistance (3:00)',
      'Add Redstone Dust -> Fire Resistance (8:00)'
    ]
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
    pvpNote: 'Crucial for exploring Ocean Monuments, underwater conduit bases, and mining prismarine.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Pufferfish -> Water Breathing (3:00)',
      'Add Redstone Dust -> Water Breathing (8:00)'
    ]
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
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Phantom Membrane -> Slow Falling (1:30)',
      'Add Redstone Dust -> Slow Falling (4:00)'
    ]
  },
  {
    id: 'leaping',
    name: 'Potion of Leaping (Jump Boost)',
    category: 'Survival',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: "Rabbit's Foot",
    effect: 'Increases jump height by 0.5 blocks (Leaping I: 1.5 blocks jump) or 1.25 blocks (Leaping II: 2.5 blocks jump) and reduces fall damage.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    upgradedEffect: 'Leaping II (1:30)',
    hasExtended: true,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#22c55e',
    accentBg: 'rgba(34, 197, 94, 0.15)',
    pvpNote: 'Allows jumping over 1.5-block fences and defensive walls without placing blocks. Corrupts into Slowness!',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      "Add Rabbit's Foot -> Leaping I (3:00)",
      'Choice A: Add Redstone -> Leaping I (8:00)',
      'Choice B: Add Glowstone -> Leaping II (1:30)',
      'Corrupt: Add Fermented Spider Eye -> Potion of Slowness'
    ],
    corruptionTarget: 'slowness'
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
    pvpNote: 'Must-have for deepslate diamond caving and spotting submerged ocean ruins. Corrupts into Invisibility!',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Golden Carrot -> Night Vision (3:00)',
      'Add Redstone Dust -> Night Vision (8:00)',
      'Corrupt: Add Fermented Spider Eye -> Potion of Invisibility'
    ],
    corruptionTarget: 'invisibility'
  },
  {
    id: 'invisibility',
    name: 'Potion of Invisibility',
    category: 'Utility',
    baseIngredient: 'Potion of Night Vision',
    secondaryIngredient: 'Fermented Spider Eye',
    effect: 'Turns player model invisible. Hostile mob detection range drops to 7% without armor. Armor and held items remain visible.',
    standardDuration: '3:00',
    extendedDuration: '8:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#cbd5e1',
    accentBg: 'rgba(203, 213, 225, 0.15)',
    pvpNote: 'Armor and held items remain visible. For 100% stealth, take off armor and empty hands before scouting.',
    recipeSteps: [
      'Brew Potion of Night Vision (3:00 or 8:00)',
      'Add Fermented Spider Eye -> Potion of Invisibility (3:00 or 8:00)'
    ]
  },
  // Negative & Debuff Potions
  {
    id: 'poison',
    name: 'Potion of Poison',
    category: 'Negative',
    baseIngredient: 'Awkward Potion',
    secondaryIngredient: 'Spider Eye',
    effect: 'Deals 1 HP damage every 1.25s (Poison I: 36 HP over 45s) down to half a heart (cannot kill directly). Poison II deals 1 HP every 0.6s (36 HP over 21s).',
    standardDuration: '0:45',
    extendedDuration: '1:30',
    upgradedEffect: 'Poison II (0:21)',
    hasExtended: true,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#4ade80',
    accentBg: 'rgba(74, 222, 128, 0.15)',
    pvpNote: 'Reduces enemies to half a heart through armor. Corrupt with Fermented Spider Eye to create Instant Damage II.',
    recipeSteps: [
      'Brew Nether Wart into Water Bottle -> Awkward Potion',
      'Add Spider Eye -> Poison I (0:45)',
      'Choice A: Add Redstone -> Poison I (1:30)',
      'Choice B: Add Glowstone -> Poison II (0:21)',
      'Corrupt: Add Fermented Spider Eye -> Potion of Harming'
    ],
    corruptionTarget: 'harming'
  },
  {
    id: 'slowness',
    name: 'Potion of Slowness',
    category: 'Negative',
    baseIngredient: 'Potion of Swiftness or Leaping',
    secondaryIngredient: 'Fermented Spider Eye',
    effect: 'Reduces player movement speed by 15% (Slowness I, 1:30 or 4:00 extended). Level IV reduces speed by 60% (Slowness IV, 0:20 in 1.21).',
    standardDuration: '1:30',
    extendedDuration: '4:00',
    upgradedEffect: 'Slowness IV (0:20 in 1.21)',
    hasExtended: true,
    hasAmplified: true,
    canBeSplash: true,
    canBeLingering: true,
    color: '#64748b',
    accentBg: 'rgba(100, 116, 139, 0.15)',
    pvpNote: 'Debilitating in PvP: Splash on opponents to break sprint jumps, shield resets, and crystal placements.',
    recipeSteps: [
      'Brew Potion of Swiftness or Leaping',
      'Add Fermented Spider Eye -> Slowness I (1:30)',
      'Choice A: Add Redstone -> Slowness I (4:00)',
      'Choice B: Add Glowstone -> Slowness IV (0:20)'
    ]
  },
  {
    id: 'weakness',
    name: 'Potion of Weakness',
    category: 'Negative',
    baseIngredient: 'Water Bottle (No Nether Wart needed!)',
    secondaryIngredient: 'Fermented Spider Eye',
    effect: 'Reduces melee attack damage by 4 HP (-2 hearts). Used with Golden Apple to cure Zombie Villagers.',
    standardDuration: '1:30',
    extendedDuration: '4:00',
    hasExtended: true,
    hasAmplified: false,
    canBeSplash: true,
    canBeLingering: true,
    color: '#475569',
    accentBg: 'rgba(71, 85, 105, 0.15)',
    pvpNote: 'Villager Economics: Brew Splash Weakness, throw at a Zombie Villager, and feed a Golden Apple to cure for discounts.',
    recipeSteps: [
      'Place Water Bottle into Brewing Stand (NO NETHER WART)',
      'Add Fermented Spider Eye -> Potion of Weakness (1:30)',
      'Optional: Add Redstone Dust -> Weakness (4:00)',
      'Add Gunpowder -> Splash Potion of Weakness'
    ]
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
    pvpNote: 'Completely ignores Protection IV armor. Splash Harming II bypasses armor damage reduction directly.',
    recipeSteps: [
      'Brew Potion of Healing or Poison',
      'Add Fermented Spider Eye -> Potion of Harming I',
      'Add Glowstone -> Instant Damage II',
      'Add Gunpowder -> Splash Harming II'
    ]
  }
];

export const MINECRAFT_ORES: OreDistribution[] = [
  {
    id: 'diamonds',
    name: 'Diamond Ore & Deepslate Diamond',
    dimension: 'Overworld',
    minY: -64,
    maxY: 16,
    peakY: [-64],
    recommendedY: [-58, -59],
    shape: 'Triangular',
    batches: 'Single triangular distribution starting at Y=16 down to bedrock Y=-64. Air-exposed frequency is cut by 50% in caves.',
    miningLevel: 'Iron Pickaxe or better',
    optimalStrategy: 'Mathematical peak is Y = -64 (deepest bedrock layer). However, recommended strip mining level is Y = -58 or Y = -59 because open lava lakes fill cavern floors at Y = -54. Mining at -58 keeps you safely above lava lakes while maximizing diamond exposure. Deepslate reduces air exposure by 50% in open caves, making strip mining yield significantly higher raw yields.',
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
    recommendedY: [15],
    shape: 'Triangular',
    batches: 'Main triangular batch: Y=8 to Y=22 (peaks at Y=15, 1-3 veins/chunk). Secondary uniform batch: Y=8 to Y=119 (1 attempt/chunk).',
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
    peakY: [16, 256],
    recommendedY: [16, 232],
    shape: 'Triangular',
    batches: 'Batch 1: Y=80 to Y=320 (triangular, peaks at Y=256). Batch 2: Y=-24 to Y=56 (triangular, peaks at Y=16). Small uniform batch: Y=-64 to Y=-32.',
    miningLevel: 'Stone Pickaxe or better',
    optimalStrategy: 'Two massive peaks: Y = 16 for underground caving & strip mining, and Y = 256 in Mountain peaks (Jagged Peaks & Stony Peaks). For automated supply, build a 3-villager zombie iron golem farm in spawn chunks.',
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
    recommendedY: [-16],
    shape: 'Triangular',
    batches: 'Standard Overworld: Y=-64 to Y=32 (triangular, peaks at Y=-16). Badlands Biome Bonus: Y=32 to Y=256 (huge uniform generation).',
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
    peakY: [96, 256],
    recommendedY: [96],
    shape: 'Triangular',
    batches: 'Batch 1: Y=0 to Y=192 (triangular, peaks at Y=96). Batch 2: Y=136 to Y=320 (peaks at Y=256, reduced air exposure).',
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
    recommendedY: [48],
    shape: 'Triangular',
    batches: 'Single triangular distribution Y=-16 to Y=112 (peaks at Y=48). In Dripstone Caves, vein sizes and frequency are doubled.',
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
    peakY: [-64],
    recommendedY: [-58],
    shape: 'Triangular',
    batches: 'Batch 1: Y=-64 to Y=15 (uniform, 4 attempts/chunk). Batch 2: Y=-64 to Y=-32 (triangular, increasing down to -64).',
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
    recommendedY: [0],
    shape: 'Triangular',
    batches: 'Batch 1: Y=-32 to Y=32 (triangular, peaks sharply at Y=0). Batch 2: Y=-64 to Y=64 (uniform buried batch, never generates exposed to air).',
    miningLevel: 'Stone Pickaxe or better',
    optimalStrategy: 'Strict triangular peak centered at Y = 0 (sea level boundary). Generates in tight clusters of 4-8 blocks. Buried veins generate inside stone/deepslate walls rather than cave air.',
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
    peakY: [256],
    recommendedY: [232, 256],
    shape: 'Special Biome',
    batches: 'Y=-16 to Y=320 (triangular, peaks at Y=256). Exclusively generates in Windswept and Mountain biomes as single ores.',
    miningLevel: 'Iron Pickaxe or better',
    optimalStrategy: 'ONLY generates in Mountain biomes (Jagged Peaks, Frozen Peaks, Meadow, Grove, Windswept Hills). Frequency spikes dramatically the higher you climb, peaking at Y = 256. Generates as single blocks rather than veins.',
    fortuneMultiplier: 'Fortune III yields up to 4 Emeralds per block. Silk Touch is prized by collectors.',
    notes: 'Easiest way to get emeralds is NOT mining: trade sticks to Fletcher villagers or pumpkins/melons to Farmers.',
    color: '#10b981',
    bgGradient: 'from-emerald-900/40 via-emerald-950/20 to-black'
  },
  {
    id: 'nether-quartz',
    name: 'Nether Quartz Ore',
    dimension: 'Nether',
    minY: 10,
    maxY: 117,
    peakY: [10, 117],
    recommendedY: [10, 117],
    shape: 'Uniform',
    batches: 'Y=10 to Y=117 (uniform distribution). 16 attempts per chunk in all biomes; 32 attempts in Basalt Deltas.',
    miningLevel: 'Wooden Pickaxe or better',
    optimalStrategy: 'Generates uniformly across all Nether biomes between Y=10 and Y=117. Basalt Deltas have double the density. Fastest early-game XP farm (2-5 XP per block mined) and essential for Observers, Comparators, and Daylight Detectors.',
    fortuneMultiplier: 'Fortune III drops up to 4 Nether Quartz per block',
    notes: 'Crucial for redstone components, Daylight Detectors, and clean Quartz building blocks.',
    color: '#e2e8f0',
    bgGradient: 'from-slate-600/40 via-slate-800/20 to-black'
  },
  {
    id: 'nether-gold',
    name: 'Nether Gold Ore',
    dimension: 'Nether',
    minY: 10,
    maxY: 117,
    peakY: [10, 117],
    recommendedY: [10, 117],
    shape: 'Uniform',
    batches: 'Y=10 to Y=117 (uniform distribution). 10 attempts per chunk in Nether Wastes/Crimson/Warped/Soul Sand; 20 attempts in Basalt Deltas.',
    miningLevel: 'Wooden Pickaxe or better',
    optimalStrategy: 'Generates uniformly between Y=10 and Y=117. Drops 2-6 Gold Nuggets per block. Mining without Silk Touch agitates nearby Piglins unless out of direct line of sight.',
    fortuneMultiplier: 'Fortune III drops up to 24 Gold Nuggets per block! Mining with Silk Touch and smelting gives a guaranteed 1 Gold Ingot (9 nuggets).',
    notes: 'Silk Touch smelting gives 9 nuggets per block guaranteed, outperforming non-fortune mining.',
    color: '#fbbf24',
    bgGradient: 'from-amber-600/40 via-amber-800/20 to-black'
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
    curingDiscountSummary: 'Breaking and re-placing the Lectern at Novice tier re-rolls the enchanted book until Mending is offered. In 1.20.2+, a single cure provides a discount of up to -20 emeralds (reputation multiplier capped at 1 cure).',
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
    curingDiscountSummary: 'In 1.20.2+, curing grants a one-time discount of up to -20 emeralds. A 35-emerald diamond chestplate drops to 15 emeralds (not 1 emerald, since curing no longer stacks).',
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
    curingDiscountSummary: 'Provides renewable diamond swords and axes for emeralds. In 1.20.2+, one cure cuts prices by up to 20 emeralds, bringing high-tier swords down to single-digit costs.',
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
    curingDiscountSummary: 'Grants an endless supply of diamond pickaxes for perimeter digging and mining. One cure reduces pickaxe costs by up to 20 emeralds.',
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
    curingDiscountSummary: 'Sticks to emeralds is the fastest early-game emerald generation. Curing reduces stick trade from 32 sticks down to 1 stick per emerald (minimum 1 item).',
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
    curingDiscountSummary: 'Buy stacks of Ender Pearls for fast travel and strongholds without hunting Endermen. One cure cuts Ender Pearl costs from 5 down to 1 emerald.',
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
    curingDiscountSummary: 'Golden Carrots provide top-tier food saturation (14.4). One cure reduces Master Golden Carrot cost from 3 emeralds to 1 emerald for 3 carrots.',
    biomeRebalanceNote: 'Essential for automatic villager food breeding and golden carrot stockpiling.'
  },
  {
    id: 'cartographer',
    name: 'Cartographer',
    jobBlock: 'Cartography Table',
    craftingSummary: '2 Paper + 4 Wood Planks',
    iconName: 'Compass',
    topTrades: [
      { level: 'Novice', itemGiven: '24 Paper', itemReceived: '1 Emerald', cost: '24 Paper', importance: 'High' },
      { level: 'Journeyman', itemGiven: '13 Emeralds + 1 Compass', itemReceived: 'Ocean Explorer Map', cost: '13 Emeralds', importance: 'High' },
      { level: 'Expert', itemGiven: '14 Emeralds + 1 Compass', itemReceived: 'Woodland Explorer Map / Trial Chamber Map (1.21)', cost: '14 Emeralds', importance: 'Essential' }
    ],
    curingDiscountSummary: 'Locates Ocean Monuments, Woodland Mansions, and 1.21 Trial Chambers directly without external tools. One cure drops explorer map costs by up to 20 emeralds.',
    biomeRebalanceNote: 'In 1.21, Cartographers offer Trial Chamber explorer maps pointing directly to local trial vaults.'
  },
  {
    id: 'mason',
    name: 'Stone Mason',
    jobBlock: 'Stonecutter',
    craftingSummary: '1 Iron Ingot + 3 Stone',
    iconName: 'BrickWall',
    topTrades: [
      { level: 'Novice', itemGiven: '10 Clay Balls', itemReceived: '1 Emerald', cost: '10 Clay', importance: 'High' },
      { level: 'Journeyman', itemGiven: '1 Emerald', itemReceived: '1 Dripstone Block / Polished Granite', cost: '1 Emerald', importance: 'Situational' },
      { level: 'Master', itemGiven: '1 Emerald', itemReceived: '1 Quartz Block / Glazed Terracotta', cost: '1 Emerald', importance: 'Essential' }
    ],
    curingDiscountSummary: 'Infinite renewable Quartz Blocks and decorative stone. Trade clay and stone early for easy emerald generation.',
    biomeRebalanceNote: 'Crucial for mega-base builders needing bulk Quartz without strip-mining the Nether.'
  },
  {
    id: 'butcher',
    name: 'Butcher',
    jobBlock: 'Smoker',
    craftingSummary: '1 Furnace + 4 Logs/Stripped Wood',
    iconName: 'Drumstick',
    topTrades: [
      { level: 'Novice', itemGiven: '14 Raw Chicken / 7 Raw Porkchop', itemReceived: '1 Emerald', cost: 'Raw Meat', importance: 'High' },
      { level: 'Journeyman', itemGiven: 'Emeralds', itemReceived: 'Cooked Porkchops & Steak', cost: '1 Emerald', importance: 'High' },
      { level: 'Master', itemGiven: '10 Sweet Berries', itemReceived: '1 Emerald', cost: '10 Berries', importance: 'Essential' }
    ],
    curingDiscountSummary: 'Sweet Berries to emeralds at Master level enables massive emerald farming from automated Fox berry farms.',
    biomeRebalanceNote: 'Provides fast early-game emeralds if near animal pens or taiga berry fields.'
  },
  {
    id: 'leatherworker',
    name: 'Leatherworker',
    jobBlock: 'Cauldron',
    craftingSummary: '7 Iron Ingots',
    iconName: 'Shirt',
    topTrades: [
      { level: 'Novice', itemGiven: '6 Leather', itemReceived: '1 Emerald', cost: '6 Leather', importance: 'High' },
      { level: 'Journeyman', itemGiven: 'Emeralds', itemReceived: 'Leather Tunic & Pants', cost: '4-7 Emeralds', importance: 'Situational' },
      { level: 'Master', itemGiven: '6 Emeralds', itemReceived: 'Leather Horse Armor & Saddle', cost: '6 Emeralds', importance: 'High' }
    ],
    curingDiscountSummary: 'Renewable source of Leather Horse Armor (crucial for powder snow survival in cold mountain biomes) and Saddles.',
    biomeRebalanceNote: 'Provides colored leather gear and early-game mount equipment.'
  },
  {
    id: 'shepherd',
    name: 'Shepherd',
    jobBlock: 'Loom',
    craftingSummary: '2 String + 2 Wood Planks',
    iconName: 'Scissors',
    topTrades: [
      { level: 'Novice', itemGiven: '18 Wool (White, Brown, Black, Gray)', itemReceived: '1 Emerald', cost: '18 Wool', importance: 'High' },
      { level: 'Journeyman', itemGiven: '12 Dyes', itemReceived: '1 Emerald', cost: '12 Dyes', importance: 'High' },
      { level: 'Master', itemGiven: 'Emeralds', itemReceived: 'Paintings & Colored Banners', cost: '1-3 Emeralds', importance: 'Situational' }
    ],
    curingDiscountSummary: 'Turns automated sheep shears into infinite emeralds. One cure drops wool trade down to single digits.',
    biomeRebalanceNote: 'Offers custom banner patterns and decorative carpets.'
  },
  {
    id: 'fisherman',
    name: 'Fisherman',
    jobBlock: 'Barrel',
    craftingSummary: '6 Wood Planks + 2 Wood Slabs',
    iconName: 'Fish',
    topTrades: [
      { level: 'Novice', itemGiven: '20 Raw Cod / 15 Raw Salmon', itemReceived: '1 Emerald + 1 Cooked Cod', cost: 'Raw Fish', importance: 'High' },
      { level: 'Journeyman', itemGiven: '6 String', itemReceived: '1 Emerald', cost: '6 String', importance: 'High' },
      { level: 'Master', itemGiven: '3 Emeralds', itemReceived: 'Enchanted Fishing Rod (Luck of the Sea III)', cost: '3 Emeralds', importance: 'Essential' }
    ],
    curingDiscountSummary: 'Converts automated spider spawner string (6 string per emerald) into massive emerald profit. Master tier sells max-enchanted fishing rods.',
    biomeRebalanceNote: 'Provides Campfires, buckets of tropical fish, and enchanted rods.'
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
    tips: 'A hopper clock with 30 items takes exactly 12 seconds per half-cycle (24s full period), plus 3-4 gt piston extension delay in Etho clocks.'
  },
  {
    name: 'Comparator Inventory Detection',
    redstoneTicks: 1,
    gameTicks: 2,
    seconds: 0.1,
    usage: 'Formula: floor(1 + (Total Items / Full Capacity) * 14). Outputs 0 when empty.',
    tips: 'In a 5-slot hopper (320 items capacity), 45 items outputs Signal Strength 2. The 46th item outputs Signal Strength 3, powering the 3rd redstone dust.'
  },
  {
    name: 'Crafter (1.21 Tricky Trials)',
    redstoneTicks: 2,
    gameTicks: 4,
    seconds: 0.2,
    usage: 'Crafts items automatically when pulsed by a redstone signal. Emits comparator signal based on filled slots (0-9).',
    tips: 'Allows 100% automated crafting of iron blocks, gold ingots, dispensers, and armor from mob farms!'
  }
];
