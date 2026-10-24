/**
 * Rust Tactical Operations Data Engine
 * Authored for PK Ultimate Guide - The Pitsoni Empire
 * Authoritative mechanics, raid durability matrices, upkeep decay curves, and combat ballistics
 */

export type ExplosiveType = 
  | 'c4'
  | 'rocket'
  | 'satchel'
  | 'exploAmmo'
  | 'hvRocket'
  | 'beancan'
  | 'f1Grenade';

export interface ExplosiveRecipe {
  id: ExplosiveType;
  name: string;
  shortName: string;
  iconName: string;
  sulfur: number;         // Raw sulfur needed
  charcoal: number;       // Charcoal needed
  gunpowder: number;      // Gunpowder needed
  metalFrags: number;     // Metal fragments needed
  lowGrade: number;       // Low grade fuel needed
  pipes: number;          // Metal pipes
  techTrash: number;      // Tech trash
  cloth: number;          // Cloth
  craftTimeSeconds: number; // Craft time in seconds per unit
  soundBlast: string;
}

export const EXPLOSIVE_RECIPES: Record<ExplosiveType, ExplosiveRecipe> = {
  c4: {
    id: 'c4',
    name: 'Timed Explosive Charge (C4)',
    shortName: 'C4',
    iconName: 'Bomb',
    // 1 C4 = 20 Explosives + 5 Cloth + 2 Tech Trash
    // 20 Explosives = 1000 GP (2000 Sulfur, 3000 Charcoal) + 60 Low Grade + 200 Metal Frags + 200 Sulfur
    sulfur: 2200,
    charcoal: 3000,
    gunpowder: 1000,
    metalFrags: 200,
    lowGrade: 60,
    pipes: 0,
    techTrash: 2,
    cloth: 5,
    craftTimeSeconds: 30,
    soundBlast: 'Heavy breach concussion (instant)'
  },
  rocket: {
    id: 'rocket',
    name: 'Rocket',
    shortName: 'Rocket',
    iconName: 'Flame',
    // 1 Rocket = 10 Explosives + 150 GP + 2 Metal Pipes
    // 10 Explosives = 500 GP (1000 Sulfur, 1500 Charcoal) + 30 Low Grade + 100 Metal Frags + 100 Sulfur
    // 150 GP = 300 Sulfur + 450 Charcoal
    sulfur: 1400,
    charcoal: 1950,
    gunpowder: 650,
    metalFrags: 100,
    lowGrade: 30,
    pipes: 2,
    techTrash: 0,
    cloth: 0,
    craftTimeSeconds: 20,
    soundBlast: 'Splash radius 3.8m + structural breach'
  },
  satchel: {
    id: 'satchel',
    name: 'Satchel Charge',
    shortName: 'Satchel',
    iconName: 'Package',
    // 1 Satchel = 4 Beancans + 1 Stash (10 cloth) + 1 Rope
    // 4 Beancans = 240 GP (480 Sulfur, 720 Charcoal) + 80 Metal Frags
    sulfur: 480,
    charcoal: 720,
    gunpowder: 240,
    metalFrags: 80,
    lowGrade: 0,
    pipes: 0,
    techTrash: 0,
    cloth: 10,
    craftTimeSeconds: 15,
    soundBlast: 'Unreliable fuse dud risk (8-12s)'
  },
  exploAmmo: {
    id: 'exploAmmo',
    name: 'Explosive 5.56 Rifle Ammo',
    shortName: 'Explo 5.56',
    iconName: 'Crosshair',
    // Batch of 2 = 20 GP + 10 Metal Frags + 10 Sulfur
    // Per bullet = 25 Sulfur, 30 Charcoal, 10 GP, 5 Metal Frags
    sulfur: 25,
    charcoal: 30,
    gunpowder: 10,
    metalFrags: 5,
    lowGrade: 0,
    pipes: 0,
    techTrash: 0,
    cloth: 0,
    craftTimeSeconds: 1, // fast batched craft
    soundBlast: 'Suppressed SAR/AK stealth breach'
  },
  hvRocket: {
    id: 'hvRocket',
    name: 'High Velocity Rocket',
    shortName: 'HV Rocket',
    iconName: 'Zap',
    // 1 HV Rocket = 100 GP (200 Sulfur, 300 Charcoal) + 1 Metal Pipe
    sulfur: 200,
    charcoal: 300,
    gunpowder: 100,
    metalFrags: 0,
    lowGrade: 0,
    pipes: 1,
    techTrash: 0,
    cloth: 0,
    craftTimeSeconds: 10,
    soundBlast: 'High speed anti-personnel / anti-turret'
  },
  beancan: {
    id: 'beancan',
    name: 'Beancan Grenade',
    shortName: 'Beancan',
    iconName: 'CircleAlert',
    // 60 GP (120 Sulfur, 180 Charcoal) + 20 Metal Frags
    sulfur: 120,
    charcoal: 180,
    gunpowder: 60,
    metalFrags: 20,
    lowGrade: 0,
    pipes: 0,
    techTrash: 0,
    cloth: 0,
    craftTimeSeconds: 6,
    soundBlast: 'Random fuse (dud chance 15%)'
  },
  f1Grenade: {
    id: 'f1Grenade',
    name: 'F1 Grenade',
    shortName: 'F1 Grenade',
    iconName: 'ShieldAlert',
    // 100 Metal Frags + 30 GP (60 Sulfur, 90 Charcoal)
    sulfur: 60,
    charcoal: 90,
    gunpowder: 30,
    metalFrags: 100,
    lowGrade: 0,
    pipes: 0,
    techTrash: 0,
    cloth: 0,
    craftTimeSeconds: 5,
    soundBlast: 'Anti-door / anti-infantry frag'
  }
};

export interface EcoRaidOption {
  toolName: string;
  toolQuantity: number;
  timeEstimateSeconds: number;
  costDescription: string;
  notes: string;
}

export interface RaidTarget {
  id: string;
  name: string;
  category: 'doors' | 'walls' | 'deployables';
  hp: number;
  decayMinutes: number; // minutes to complete decay without TC
  decayDescription: string;
  durability: {
    c4: number;
    rocket: number;
    satchel: number;
    exploAmmo: number;
    hvRocket?: number;
    beancan?: number;
    f1Grenade?: number;
  };
  optimalMixDescription: string;
  optimalSulfur: number;
  optimalExplosives: { type: ExplosiveType; count: number }[];
  ecoRaid?: EcoRaidOption[];
  icon: string;
  weakSpotTip: string;
}

export const RAID_TARGETS: RaidTarget[] = [
  // DOORS
  {
    id: 'wood-door',
    name: 'Wooden Door',
    category: 'doors',
    hp: 200,
    decayMinutes: 120,
    decayDescription: '2 Hours until 0 HP',
    durability: {
      c4: 1,
      rocket: 1,
      satchel: 2,
      exploAmmo: 19,
      beancan: 6,
      f1Grenade: 7
    },
    optimalMixDescription: '2 Fire Arrows / 1 Molotov or 19 Explo Ammo',
    optimalSulfur: 475,
    optimalExplosives: [{ type: 'exploAmmo', count: 19 }],
    ecoRaid: [
      {
        toolName: 'Fire Arrows',
        toolQuantity: 2,
        timeEstimateSeconds: 15,
        costDescription: '2 Fire Arrows (10 Cloth, 20 Low Grade)',
        notes: 'Cheapest eco raid. Burns door down in under 20 seconds.'
      },
      {
        toolName: 'Molotov Cocktail',
        toolQuantity: 1,
        timeEstimateSeconds: 12,
        costDescription: '1 Molotov (50 Low Grade, 10 Cloth)',
        notes: 'Instant ignition, destroys door completely in one burn.'
      },
      {
        toolName: 'Metal Hatchet (Hard Side)',
        toolQuantity: 3,
        timeEstimateSeconds: 180,
        costDescription: '300 Metal Frags, 600 Wood',
        notes: 'Melee hit on hard side will break door after 3 hatchets.'
      }
    ],
    icon: 'DoorClosed',
    weakSpotTip: 'Vulnerable to all fire damage. Never waste rockets or C4 on wood doors.'
  },
  {
    id: 'sheet-metal-door',
    name: 'Sheet Metal Door',
    category: 'doors',
    hp: 250,
    decayMinutes: 480,
    decayDescription: '8 Hours until 0 HP',
    durability: {
      c4: 1,
      rocket: 2,
      satchel: 4,
      exploAmmo: 63,
      beancan: 18
    },
    optimalMixDescription: '1 C4 (or 4 Satchels / 63 Explo Ammo)',
    optimalSulfur: 1575,
    optimalExplosives: [{ type: 'exploAmmo', count: 63 }],
    ecoRaid: [
      {
        toolName: 'Explosive 5.56 (Silenced SAR)',
        toolQuantity: 63,
        timeEstimateSeconds: 22,
        costDescription: '1,575 Sulfur, 315 Metal Frags',
        notes: 'Lowest sulfur path and stealthiest raid method for sheet doors.'
      },
      {
        toolName: '4 Satchel Charges',
        toolQuantity: 4,
        timeEstimateSeconds: 40,
        costDescription: '1,920 Sulfur, 320 Metal Frags',
        notes: 'Standard early-wipe raid tier. Watch out for duds.'
      }
    ],
    icon: 'Shield',
    weakSpotTip: 'Hard side and soft side have identical explosive resistance.'
  },
  {
    id: 'garage-door',
    name: 'Garage Door',
    category: 'doors',
    hp: 600,
    decayMinutes: 480,
    decayDescription: '8 Hours until 0 HP',
    durability: {
      c4: 2,
      rocket: 3,
      satchel: 9,
      exploAmmo: 150,
      beancan: 42
    },
    optimalMixDescription: '1 C4 + 1 Rocket (or 3 Rockets / 150 Explo)',
    optimalSulfur: 3600,
    optimalExplosives: [
      { type: 'c4', count: 1 },
      { type: 'rocket', count: 1 }
    ],
    ecoRaid: [
      {
        toolName: '1 C4 + 40 Explo 5.56',
        toolQuantity: 1,
        timeEstimateSeconds: 35,
        costDescription: '3,200 Sulfur total (saves 400 sulfur over pure C4)',
        notes: 'Stick 1 C4, then finish remaining 100 HP with 40 suppressed explo bullets.'
      },
      {
        toolName: '3 Rockets (Direct Splash)',
        toolQuantity: 3,
        timeEstimateSeconds: 25,
        costDescription: '4,200 Sulfur, 6 Pipes',
        notes: 'If hitting 2-4 adjacent garage doors, rocket splash destroys both simultaneously.'
      }
    ],
    icon: 'Warehouse',
    weakSpotTip: 'Takes splash damage. Always aim rockets at the intersection of multiple garage doors.'
  },
  {
    id: 'armored-door',
    name: 'Armored Door',
    category: 'doors',
    hp: 1000,
    decayMinutes: 720,
    decayDescription: '12 Hours until 0 HP',
    durability: {
      c4: 3,
      rocket: 5,
      satchel: 15,
      exploAmmo: 250,
      beancan: 70
    },
    optimalMixDescription: '2 C4 + 1 Rocket + 25 Explo (or 3 C4)',
    optimalSulfur: 6600,
    optimalExplosives: [{ type: 'c4', count: 3 }],
    ecoRaid: [
      {
        toolName: '2 C4 + 1 Rocket',
        toolQuantity: 3,
        timeEstimateSeconds: 30,
        costDescription: '5,800 Sulfur (Saves 800 sulfur over 3 C4)',
        notes: 'Throw 2 C4 to deal 880 damage, finish the final 120 HP with 1 rocket or 30 explo bullets.'
      }
    ],
    icon: 'Lock',
    weakSpotTip: 'High blast deflection. 3 C4 is fast and reliable during online raids.'
  },

  // WALLS
  {
    id: 'wooden-wall',
    name: 'Wooden Wall',
    category: 'walls',
    hp: 250,
    decayMinutes: 120,
    decayDescription: '2 Hours until 0 HP',
    durability: {
      c4: 1,
      rocket: 2,
      satchel: 3,
      exploAmmo: 49,
      beancan: 13
    },
    optimalMixDescription: '49 Explo Ammo or Eco Soft-Side Spears',
    optimalSulfur: 1225,
    optimalExplosives: [{ type: 'exploAmmo', count: 49 }],
    ecoRaid: [
      {
        toolName: 'Wooden Spears (Soft-Side)',
        toolQuantity: 7,
        timeEstimateSeconds: 95,
        costDescription: '700 Wood',
        notes: 'Throws or poke with wooden spears against soft side. Zero sulfur cost.'
      },
      {
        toolName: 'Fire Arrows',
        toolQuantity: 45,
        timeEstimateSeconds: 120,
        costDescription: '225 Low Grade, 90 Cloth',
        notes: 'Burns hard or soft side down without setting off combat alerts.'
      }
    ],
    icon: 'Layers',
    weakSpotTip: 'Soft side takes 10x melee damage. Look for the flat planed wood grain.'
  },
  {
    id: 'stone-wall',
    name: 'Stone Wall',
    category: 'walls',
    hp: 500,
    decayMinutes: 240,
    decayDescription: '4 Hours until 0 HP',
    durability: {
      c4: 2,
      rocket: 4,
      satchel: 10,
      exploAmmo: 185,
      beancan: 46
    },
    optimalMixDescription: '2 C4 or 4 Rockets',
    optimalSulfur: 4400,
    optimalExplosives: [{ type: 'c4', count: 2 }],
    ecoRaid: [
      {
        toolName: 'Jackhammer (Soft-Side)',
        toolQuantity: 2,
        timeEstimateSeconds: 70,
        costDescription: '2 Workbench refuels',
        notes: 'Soft side takes 1.5 full jackhammer durabilities. Fast silent soft-side drill.'
      },
      {
        toolName: 'Metal Pickaxes (Soft-Side)',
        toolQuantity: 7,
        timeEstimateSeconds: 260,
        costDescription: '700 Metal Frags, 700 Wood',
        notes: '7 pickaxes break soft side stone wall cleanly in ~4 minutes.'
      }
    ],
    icon: 'Square',
    weakSpotTip: 'Hard side has cobblestone texture; soft side has smooth stacked stone.'
  },
  {
    id: 'sheet-metal-wall',
    name: 'Sheet Metal Wall',
    category: 'walls',
    hp: 1000,
    decayMinutes: 480,
    decayDescription: '8 Hours until 0 HP',
    durability: {
      c4: 4,
      rocket: 8,
      satchel: 23,
      exploAmmo: 400
    },
    optimalMixDescription: '4 C4 or 8 Rockets',
    optimalSulfur: 8800,
    optimalExplosives: [{ type: 'c4', count: 4 }],
    ecoRaid: [
      {
        toolName: 'Jackhammer (Soft-Side)',
        toolQuantity: 12,
        timeEstimateSeconds: 480,
        costDescription: 'Multiple refuels at bench',
        notes: 'Requires ~8 minutes of continuous drilling on the soft side.'
      }
    ],
    icon: 'Grid',
    weakSpotTip: 'Brown side with crossed reinforcement bars is the soft side.'
  },
  {
    id: 'armored-wall',
    name: 'Armored Wall (HQM)',
    category: 'walls',
    hp: 2000,
    decayMinutes: 720,
    decayDescription: '12 Hours until 0 HP',
    durability: {
      c4: 8,
      rocket: 15,
      satchel: 46,
      exploAmmo: 799
    },
    optimalMixDescription: '8 C4 or 15 Rockets',
    optimalSulfur: 17600,
    optimalExplosives: [{ type: 'c4', count: 8 }],
    ecoRaid: [
      {
        toolName: '15 Rockets (Multi-Wall Splash)',
        toolQuantity: 15,
        timeEstimateSeconds: 85,
        costDescription: '21,000 Sulfur, 30 Metal Pipes',
        notes: 'Aim rocket splash at four-corner intersections to open entire honeycomb.'
      }
    ],
    icon: 'ShieldAlert',
    weakSpotTip: 'Pound-for-pound the strongest structure in Rust. Soft side takes minimal melee damage.'
  },
  {
    id: 'high-external-stone-wall',
    name: 'High External Stone Wall / Gate',
    category: 'walls',
    hp: 1000,
    decayMinutes: 240,
    decayDescription: '4 Hours until 0 HP (Tied to external TC)',
    durability: {
      c4: 2,
      rocket: 4,
      satchel: 10,
      exploAmmo: 185
    },
    optimalMixDescription: '4 Rockets (Opens compound gap) or 2 C4',
    optimalSulfur: 4400,
    optimalExplosives: [{ type: 'c4', count: 2 }],
    ecoRaid: [
      {
        toolName: '4 Rockets (Vehicle/Compound Breach)',
        toolQuantity: 4,
        timeEstimateSeconds: 30,
        costDescription: '5,600 Sulfur, 8 Pipes',
        notes: 'Breaches wall and damages adjacent barbed wire barricades.'
      }
    ],
    icon: 'Maximize2',
    weakSpotTip: 'Barbed wire on top deals bleed damage and slows climbing players.'
  },
  {
    id: 'high-external-wooden-wall',
    name: 'High External Wooden Wall',
    category: 'walls',
    hp: 500,
    decayMinutes: 120,
    decayDescription: '2 Hours until 0 HP',
    durability: {
      c4: 2,
      rocket: 3,
      satchel: 6,
      exploAmmo: 120
    },
    optimalMixDescription: '3 Rockets or 6 Satchels',
    optimalSulfur: 2880,
    optimalExplosives: [{ type: 'satchel', count: 6 }],
    ecoRaid: [
      {
        toolName: 'Fire Arrows / Molotov',
        toolQuantity: 70,
        timeEstimateSeconds: 150,
        costDescription: '350 Low Grade, 140 Cloth',
        notes: 'Burns down wooden compound wall without explosive noise.'
      }
    ],
    icon: 'TreePine',
    weakSpotTip: 'Flammable. Can be melted with incinerator or incendiary rockets.'
  },

  // DEPLOYABLES & TURRETS
  {
    id: 'auto-turret',
    name: 'Auto Turret',
    category: 'deployables',
    hp: 1000,
    decayMinutes: 480,
    decayDescription: '8 Hours without power / upkeep',
    durability: {
      c4: 1,
      rocket: 1,
      satchel: 3,
      exploAmmo: 40,
      hvRocket: 3
    },
    optimalMixDescription: '3 HV Rockets (from range) or 40 Explo Ammo',
    optimalSulfur: 600,
    optimalExplosives: [{ type: 'hvRocket', count: 3 }],
    ecoRaid: [
      {
        toolName: 'Compound Bow & Fire Arrows',
        toolQuantity: 30,
        timeEstimateSeconds: 90,
        costDescription: '150 Low Grade',
        notes: 'Peek-shoot behind cover outside turret target range.'
      },
      {
        toolName: '3 High Velocity (HV) Rockets',
        toolQuantity: 3,
        timeEstimateSeconds: 12,
        costDescription: '600 Sulfur, 3 Pipes',
        notes: 'Safest long-distance turret neutralization in the game.'
      }
    ],
    icon: 'Crosshair',
    weakSpotTip: 'Can be drained of ammo with high-health soaker shields or peek angles.'
  },
  {
    id: 'sam-site',
    name: 'SAM Site (Surface-to-Air)',
    category: 'deployables',
    hp: 1000,
    decayMinutes: 480,
    decayDescription: '8 Hours without power / upkeep',
    durability: {
      c4: 1,
      rocket: 2,
      satchel: 4,
      exploAmmo: 43,
      hvRocket: 3
    },
    optimalMixDescription: '3 HV Rockets or 43 Explo Ammo',
    optimalSulfur: 600,
    optimalExplosives: [{ type: 'hvRocket', count: 3 }],
    ecoRaid: [
      {
        toolName: '43 Explo 5.56 Bullets',
        toolQuantity: 43,
        timeEstimateSeconds: 15,
        costDescription: '1,075 Sulfur, 215 Metal Frags',
        notes: 'Quickly silenced before fly-in with mini copter.'
      }
    ],
    icon: 'Radio',
    weakSpotTip: 'Locks onto all mini copters and scrap transport helicopters within 500m radius.'
  },
  {
    id: 'shotgun-trap',
    name: 'Shotgun Trap',
    category: 'deployables',
    hp: 300,
    decayMinutes: 480,
    decayDescription: 'Destroys when supporting wall breaks',
    durability: {
      c4: 1,
      rocket: 1,
      satchel: 1,
      exploAmmo: 8,
      hvRocket: 1
    },
    optimalMixDescription: '8 Explo Ammo or baiting ammo dry',
    optimalSulfur: 200,
    optimalExplosives: [{ type: 'exploAmmo', count: 8 }],
    ecoRaid: [
      {
        toolName: 'Bait with Armor / Spear poke',
        toolQuantity: 1,
        timeEstimateSeconds: 30,
        costDescription: 'Free (Bait shots from side corner angle)',
        notes: 'Shotgun traps only shoot forwards in a 60-degree cone.'
      }
    ],
    icon: 'AlertTriangle',
    weakSpotTip: 'Blind from the sides and above. Peek-damage with arrows or bow.'
  },
  {
    id: 'flame-turret',
    name: 'Flame Turret',
    category: 'deployables',
    hp: 300,
    decayMinutes: 480,
    decayDescription: 'Destroys when supporting floor breaks',
    durability: {
      c4: 1,
      rocket: 1,
      satchel: 1,
      exploAmmo: 8,
      hvRocket: 1
    },
    optimalMixDescription: '8 Explo Ammo or 1 HV Rocket',
    optimalSulfur: 200,
    optimalExplosives: [{ type: 'exploAmmo', count: 8 }],
    ecoRaid: [
      {
        toolName: 'Shoot fuel tank from 5m+ distance',
        toolQuantity: 15,
        timeEstimateSeconds: 20,
        costDescription: '15 Arrows or pistol shots',
        notes: 'Flame turret range is only 4 meters.'
      }
    ],
    icon: 'Flame',
    weakSpotTip: 'Has zero range beyond 4 meters. Stand back and shoot it with arrows.'
  },
  {
    id: 'tool-cupboard',
    name: 'Tool Cupboard (TC)',
    category: 'deployables',
    hp: 100,
    decayMinutes: 120,
    decayDescription: 'Base starts decaying once destroyed',
    durability: {
      c4: 1,
      rocket: 1,
      satchel: 1,
      exploAmmo: 10,
      f1Grenade: 3
    },
    optimalMixDescription: '10 Explo Ammo or 1 Molotov / 5 Fire Arrows',
    optimalSulfur: 250,
    optimalExplosives: [{ type: 'exploAmmo', count: 10 }],
    ecoRaid: [
      {
        toolName: '1 Molotov Cocktail',
        toolQuantity: 1,
        timeEstimateSeconds: 8,
        costDescription: '50 Low Grade, 10 Cloth',
        notes: 'Burns TC down instantly; resources inside drop to floor in a loot bag.'
      },
      {
        toolName: '5 Fire Arrows',
        toolQuantity: 5,
        timeEstimateSeconds: 20,
        costDescription: '25 Low Grade, 10 Cloth',
        notes: 'Silent TC destruction.'
      }
    ],
    icon: 'Package',
    weakSpotTip: 'Stores up to 24h of base upkeep as protection buffer when destroyed.'
  }
];

// UPKEEP & DECAY MATHEMATICAL FORMULAS
export interface UpkeepTaxBracket {
  name: string;
  minBlocks: number;
  maxBlocks: number;
  taxRate: number; // e.g. 0.10 for 10%
  description: string;
}

export const UPKEEP_TAX_BRACKETS: UpkeepTaxBracket[] = [
  { name: 'Bracket 1 (Base)', minBlocks: 1, maxBlocks: 15, taxRate: 0.10, description: '10% base tax for small starters' },
  { name: 'Bracket 2 (Small Base)', minBlocks: 16, maxBlocks: 40, taxRate: 0.15, description: '15% progressive tax on next 25 blocks' },
  { name: 'Bracket 3 (Medium Base)', minBlocks: 41, maxBlocks: 75, taxRate: 0.20, description: '20% progressive tax on next 35 blocks' },
  { name: 'Bracket 4 (Main Compound)', minBlocks: 76, maxBlocks: Infinity, taxRate: 0.333, description: '33.3% progressive tax on all blocks above 75' }
];

export const BASE_BLOCK_COST_PER_DAY = {
  wood: 300,        // Wood cost per wood block per 24 hours
  stone: 300,       // Stone cost per stone block per 24 hours
  metal: 200,       // Metal Fragments cost per sheet metal block per 24 hours
  hqm: 25           // High Quality Metal cost per armored block per 24 hours
};

/**
 * Calculates Facepunch official progressive upkeep tax rate.
 */
export function calculateEffectiveTaxRate(totalBlocks: number): number {
  if (totalBlocks <= 0) return 0.10;
  if (totalBlocks <= 15) return 0.10;
  
  let totalTaxSum = 15 * 0.10;
  if (totalBlocks <= 40) {
    totalTaxSum += (totalBlocks - 15) * 0.15;
    return totalTaxSum / totalBlocks;
  }
  
  totalTaxSum += 25 * 0.15;
  if (totalBlocks <= 75) {
    totalTaxSum += (totalBlocks - 40) * 0.20;
    return totalTaxSum / totalBlocks;
  }
  
  totalTaxSum += 35 * 0.20;
  totalTaxSum += (totalBlocks - 75) * 0.333;
  return totalTaxSum / totalBlocks;
}

// COMBAT BALLISTICS & WEAPONS MATRIX
export interface RustWeapon {
  id: string;
  name: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  ammoType: '5.56' | 'Pistol' | 'Arrow' | 'Shotgun';
  baseDamage: number;
  rpm: number; // rounds per minute
  magSize: number;
  velocity: number; // m/s
  headshotMultiplier: number;
  maxEffectiveRange: number; // meters before heavy falloff
  drawTimeSeconds: number;
  soundType: string;
}

export const RUST_WEAPONS: RustWeapon[] = [
  {
    id: 'ak47',
    name: 'Assault Rifle (AK-47)',
    tier: 'Tier 3',
    ammoType: '5.56',
    baseDamage: 50,
    rpm: 450,
    magSize: 30,
    velocity: 375,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 150,
    drawTimeSeconds: 1.0,
    soundType: 'Iconic loud heavy automatic 5.56 crack'
  },
  {
    id: 'lr300',
    name: 'LR-300 Assault Rifle',
    tier: 'Tier 3',
    ammoType: '5.56',
    baseDamage: 40,
    rpm: 500,
    magSize: 30,
    velocity: 375,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 130,
    drawTimeSeconds: 0.9,
    soundType: 'Smooth military spray with easy recoil'
  },
  {
    id: 'bolty',
    name: 'Bolt Action Rifle (Bolty)',
    tier: 'Tier 3',
    ammoType: '5.56',
    baseDamage: 90,
    rpm: 34,
    magSize: 4,
    velocity: 656,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 350,
    drawTimeSeconds: 1.6,
    soundType: 'Thunderous high-velocity sniper blast'
  },
  {
    id: 'l96',
    name: 'L96 Military Sniper',
    tier: 'Tier 3',
    ammoType: '5.56',
    baseDamage: 80,
    rpm: 36,
    magSize: 5,
    velocity: 1125,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 500,
    drawTimeSeconds: 1.4,
    soundType: 'Zero bullet drop laser velocity'
  },
  {
    id: 'mp5',
    name: 'MP5A4 SMG',
    tier: 'Tier 3',
    ammoType: 'Pistol',
    baseDamage: 35,
    rpm: 600,
    magSize: 30,
    velocity: 240,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 75,
    drawTimeSeconds: 0.8,
    soundType: 'Rapid burst close-quarters shredder'
  },
  {
    id: 'thompson',
    name: 'Thompson Submachine Gun',
    tier: 'Tier 2',
    ammoType: 'Pistol',
    baseDamage: 38,
    rpm: 460,
    magSize: 20,
    velocity: 300,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 80,
    drawTimeSeconds: 0.8,
    soundType: 'Roam meta king with punchy sound'
  },
  {
    id: 'sar',
    name: 'Semi-Automatic Rifle (SAR)',
    tier: 'Tier 2',
    ammoType: '5.56',
    baseDamage: 40,
    rpm: 343,
    magSize: 16,
    velocity: 375,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 120,
    drawTimeSeconds: 0.9,
    soundType: 'Crisp semi-auto tap fire'
  },
  {
    id: 'customSmg',
    name: 'Custom SMG',
    tier: 'Tier 2',
    ammoType: 'Pistol',
    baseDamage: 30,
    rpm: 600,
    magSize: 24,
    velocity: 240,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 60,
    drawTimeSeconds: 0.7,
    soundType: 'High RPM spray'
  },
  {
    id: 'python',
    name: 'Python Revolver',
    tier: 'Tier 2',
    ammoType: 'Pistol',
    baseDamage: 55,
    rpm: 400,
    magSize: 6,
    velocity: 300,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 90,
    drawTimeSeconds: 0.6,
    soundType: 'Heavy hand cannon recoil'
  },
  {
    id: 'revolver',
    name: 'Revolver',
    tier: 'Tier 1',
    ammoType: 'Pistol',
    baseDamage: 35,
    rpm: 343,
    magSize: 8,
    velocity: 300,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 60,
    drawTimeSeconds: 0.6,
    soundType: 'Wipe day primary sidearm'
  },
  {
    id: 'crossbow',
    name: 'Crossbow',
    tier: 'Tier 1',
    ammoType: 'Arrow',
    baseDamage: 60,
    rpm: 17,
    magSize: 1,
    velocity: 75,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 50,
    drawTimeSeconds: 1.2,
    soundType: 'High puncture silent bolt'
  },
  {
    id: 'bow',
    name: 'Hunting Bow',
    tier: 'Tier 1',
    ammoType: 'Arrow',
    baseDamage: 50,
    rpm: 30,
    magSize: 1,
    velocity: 50,
    headshotMultiplier: 2.0,
    maxEffectiveRange: 40,
    drawTimeSeconds: 0.5,
    soundType: 'Early game silent headshot hunter'
  }
];

export interface RustArmorKit {
  id: string;
  name: string;
  headReduction: number;  // 0 to 1 (percentage reduction)
  chestReduction: number;
  legsReduction: number;
  overallDescription: string;
}

export const RUST_ARMOR_KITS: RustArmorKit[] = [
  {
    id: 'naked',
    name: 'Naked (0% Protection)',
    headReduction: 0.0,
    chestReduction: 0.0,
    legsReduction: 0.0,
    overallDescription: 'Zero projectile armor. Lethal one-tap target.'
  },
  {
    id: 'wood',
    name: 'Wood Armor Kit',
    headReduction: 0.20,
    chestReduction: 0.15,
    legsReduction: 0.10,
    overallDescription: 'Early wipe craftable wood kit. Protects against basic arrows.'
  },
  {
    id: 'hazmat',
    name: 'Hazmat Suit',
    headReduction: 0.30,
    chestReduction: 0.30,
    legsReduction: 0.30,
    overallDescription: 'Universal 30% radiation & projectile resistance across all body parts.'
  },
  {
    id: 'roadsign',
    name: 'Roadsign Kit + Coffee Can',
    headReduction: 0.35, // Coffee Can Helmet
    chestReduction: 0.25, // Roadsign Jacket
    legsReduction: 0.25, // Roadsign Kilt
    overallDescription: 'Tier 2 standard roaming gear. Survives single headshot from SAR.'
  },
  {
    id: 'fullmetal',
    name: 'Full Metal Kit (Facemask + Chestplate)',
    headReduction: 0.50, // Metal Facemask
    chestReduction: 0.50, // Metal Chestplate
    legsReduction: 0.25, // Roadsign Kilt
    overallDescription: 'Endgame PVP armor meta. 50% head/chest damage resistance.'
  },
  {
    id: 'heavyplate',
    name: 'Heavy Plate Armor Kit',
    headReduction: 0.90, // Heavy Plate Helmet
    chestReduction: 0.75, // Heavy Plate Jacket
    legsReduction: 0.75, // Heavy Plate Pants
    overallDescription: 'Turret/Base defense juggernaut suit. Massive protection but limits vision & sprint.'
  }
];

// WORKBENCH TECH TREE NODES
export interface TechTreeNode {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  scrapCost: number;
  category: 'weapons' | 'raiding' | 'armor' | 'building' | 'electrical' | 'medical';
  isKeyMeta: boolean;
  notes: string;
}

export const TECH_TREE_NODES: TechTreeNode[] = [
  // TIER 1
  { id: 'wb1-bandage', name: 'Bandage', tier: 1, scrapCost: 20, category: 'medical', isKeyMeta: false, notes: 'Essential basic bleed stop' },
  { id: 'wb1-syringe', name: 'Medical Syringe', tier: 1, scrapCost: 75, category: 'medical', isKeyMeta: true, notes: '+15 Instant HP & +20 regen buffer' },
  { id: 'wb1-hatchet', name: 'Metal Hatchet', tier: 1, scrapCost: 75, category: 'building', isKeyMeta: true, notes: 'Farming tool upgrade' },
  { id: 'wb1-pickaxe', name: 'Metal Pickaxe', tier: 1, scrapCost: 75, category: 'building', isKeyMeta: true, notes: 'Double ore node yield' },
  { id: 'wb1-revolver', name: 'Revolver', tier: 1, scrapCost: 75, category: 'weapons', isKeyMeta: true, notes: 'Day 1 primary defense sidearm' },
  { id: 'wb1-db', name: 'Double Barrel Shotgun', tier: 1, scrapCost: 75, category: 'weapons', isKeyMeta: true, notes: 'Door camp king (2 quick buckshots)' },
  { id: 'wb1-beancan', name: 'Beancan Grenade', tier: 1, scrapCost: 75, category: 'raiding', isKeyMeta: false, notes: 'Pre-requisite for Satchel' },
  { id: 'wb1-satchel', name: 'Satchel Charge', tier: 1, scrapCost: 125, category: 'raiding', isKeyMeta: true, notes: 'Tier 1 early wipe raid tool' },

  // TIER 2
  { id: 'wb2-garagedoor', name: 'Garage Door', tier: 2, scrapCost: 75, category: 'building', isKeyMeta: true, notes: '600 HP compact airlock defense' },
  { id: 'wb2-sar', name: 'Semi-Automatic Rifle (SAR)', tier: 2, scrapCost: 125, category: 'weapons', isKeyMeta: true, notes: 'The workhorse of competitive roam' },
  { id: 'wb2-thompson', name: 'Thompson SMG', tier: 2, scrapCost: 125, category: 'weapons', isKeyMeta: true, notes: 'Fast firing medium range roamer' },
  { id: 'wb2-custom', name: 'Custom SMG', tier: 2, scrapCost: 75, category: 'weapons', isKeyMeta: false, notes: 'High DPS monument runner' },
  { id: 'wb2-coffeecan', name: 'Coffee Can Helmet', tier: 2, scrapCost: 75, category: 'armor', isKeyMeta: true, notes: '35% head protection' },
  { id: 'wb2-roadsignjacket', name: 'Roadsign Jacket', tier: 2, scrapCost: 125, category: 'armor', isKeyMeta: true, notes: '25% chest projectile guard' },
  { id: 'wb2-roadsignkilt', name: 'Roadsign Kilt', tier: 2, scrapCost: 75, category: 'armor', isKeyMeta: true, notes: 'Protects legs from sniper shots' },
  { id: 'wb2-exploammo', name: 'Explosive 5.56 Rifle Ammo', tier: 2, scrapCost: 250, category: 'raiding', isKeyMeta: true, notes: 'Silent raiding meta with silencer' },

  // TIER 3
  { id: 'wb3-ak47', name: 'Assault Rifle (AK-47)', tier: 3, scrapCost: 500, category: 'weapons', isKeyMeta: true, notes: 'Apex PVP primary weapon' },
  { id: 'wb3-facemask', name: 'Metal Facemask', tier: 3, scrapCost: 250, category: 'armor', isKeyMeta: true, notes: '50% bullet resistance' },
  { id: 'wb3-chestplate', name: 'Metal Chestplate', tier: 3, scrapCost: 250, category: 'armor', isKeyMeta: true, notes: '50% torso bullet resistance' },
  { id: 'wb3-bolty', name: 'Bolt Action Rifle', tier: 3, scrapCost: 500, category: 'weapons', isKeyMeta: true, notes: 'Tower defense & roof camper hunter' },
  { id: 'wb3-launcher', name: 'Rocket Launcher', tier: 3, scrapCost: 500, category: 'raiding', isKeyMeta: true, notes: 'Essential for main base raids' },
  { id: 'wb3-rocket', name: 'Rocket', tier: 3, scrapCost: 500, category: 'raiding', isKeyMeta: true, notes: 'Multi-wall honeycomb breaker' },
  { id: 'wb3-c4', name: 'Timed Explosive Charge (C4)', tier: 3, scrapCost: 500, category: 'raiding', isKeyMeta: true, notes: 'Instant breaching power' },
  { id: 'wb3-armoreddoor', name: 'Armored Door', tier: 3, scrapCost: 250, category: 'building', isKeyMeta: true, notes: '1,000 HP maximum security hatch' }
];

// MONUMENTS & RECYCLER SCRAP ENGINE
export type RustMonumentCategory = 
  | 'Safe Zones'
  | 'Tier 0 (Puzzle-Free / Early-Game)'
  | 'Tier 1 & Industrial'
  | 'Tier 2 (Mid-to-High Loot)'
  | 'Tier 3 (End-Game)'
  | 'Quarries & Transit';

export interface RustMonument {
  id: string;
  name: string;
  category: RustMonumentCategory;
  tier: string;
  cardSpawned?: 'Green' | 'Blue' | 'Red';
  cardRequired?: 'None' | 'Green Card' | 'Blue Card' | 'Red Card' | 'Green & Blue Cards';
  fusesNeeded?: number;
  radiationRads?: number;
  hasSuppliedInfo: boolean;
  puzzleStrategy: string;
  detailPlaceholder?: string;
  hasRecycler?: boolean;
}

export const RUST_MONUMENT_CATEGORIES: { name: RustMonumentCategory; description: string; badge: string }[] = [
  { name: 'Safe Zones', description: 'Protected zones with peacekeeper turrets, NPC vendors, and services.', badge: '6 LOCATIONS' },
  { name: 'Tier 0 (Puzzle-Free / Early-Game)', description: 'Early-game monuments with no keycard puzzle requirements. Primary sources for Green Cards.', badge: '6 LOCATIONS' },
  { name: 'Tier 1 & Industrial', description: 'Low-tier industrial monuments. Solve green card puzzles with fuses to obtain Blue Cards.', badge: '5 LOCATIONS' },
  { name: 'Tier 2 (Mid-to-High Loot)', description: 'Mid-to-high loot monuments. Solve blue and green card puzzles with fuses to obtain Red Cards.', badge: '7 LOCATIONS' },
  { name: 'Tier 3 (End-Game)', description: 'End-game military compounds and offshore rigs with elite loot crates.', badge: '7 LOCATIONS' },
  { name: 'Quarries & Transit', description: 'Resource extraction quarries, underground transit network, and ocean vessel events.', badge: '6 LOCATIONS' }
];

export const RUST_MONUMENTS: RustMonument[] = [
  // 1. Safe Zones (6)
  {
    id: 'bandit-camp',
    name: 'Bandit Camp',
    category: 'Safe Zones',
    tier: 'Safe Zone',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Safe Zone protected by automated peacekeeper guards and turrets. Puzzle-free area with NPC vendors, gambling wheel, and helicopter dealer.',
    hasRecycler: true
  },
  {
    id: 'large-barn',
    name: 'Large Barn',
    category: 'Safe Zones',
    tier: 'Safe Zone',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Safe Zone protected by peacekeeper guards. Puzzle-free location offering horse purchasing, saddle crafting, and stables.',
    hasRecycler: false
  },
  {
    id: 'large-fishing-village',
    name: 'Large Fishing Village',
    category: 'Safe Zones',
    tier: 'Safe Zone',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Safe Zone on coastal waters. Puzzle-free area with boat vendors, fishing gear, and scuba diving equipment purchases.',
    hasRecycler: true
  },
  {
    id: 'outpost',
    name: 'Outpost',
    category: 'Safe Zones',
    tier: 'Safe Zone',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Safe Zone protected by heavy peacekeeper sentries. Puzzle-free sanctuary with resource vending machines, drone delivery marketplace, research benches, and recyclers.',
    hasRecycler: true
  },
  {
    id: 'ranch',
    name: 'Ranch',
    category: 'Safe Zones',
    tier: 'Safe Zone',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Safe Zone ranch protected by guards. Puzzle-free area for purchasing horses, horse tack, and farming supplies.',
    hasRecycler: false
  },
  {
    id: 'small-fishing-village',
    name: 'Small Fishing Village',
    category: 'Safe Zones',
    tier: 'Safe Zone',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Coastal safe zone. Puzzle-free outpost for buying rowboats, RHIBs, and fishing quests.',
    hasRecycler: true
  },

  // 2. Tier 0 (Puzzle-Free / Early-Game) (6)
  {
    id: 'abandoned-cabins',
    name: 'Abandoned Cabins',
    category: 'Tier 0 (Puzzle-Free / Early-Game)',
    tier: 'Tier 0 (Puzzle-Free)',
    cardSpawned: 'Green',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Puzzle-free early-game monument. Green Cards can be found here with no card or fuse requirements.',
    hasRecycler: false
  },
  {
    id: 'abandoned-supermarket',
    name: 'Abandoned Supermarket',
    category: 'Tier 0 (Puzzle-Free / Early-Game)',
    tier: 'Tier 0 (Puzzle-Free)',
    cardSpawned: 'Green',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Puzzle-free early-game monument. Green Cards spawn inside on the rear office desk. Includes a public recycler.',
    hasRecycler: true
  },
  {
    id: 'ferry-terminal',
    name: 'Ferry Terminal',
    category: 'Tier 0 (Puzzle-Free / Early-Game)',
    tier: 'Tier 0 (Puzzle-Free)',
    cardSpawned: 'Green',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Puzzle-free early-game coastal monument. Green Cards can be found here without puzzle steps. Features ferry boat transit.',
    hasRecycler: true
  },
  {
    id: 'lighthouse',
    name: 'Lighthouse',
    category: 'Tier 0 (Puzzle-Free / Early-Game)',
    tier: 'Tier 0 (Puzzle-Free)',
    cardSpawned: 'Green',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Puzzle-free early-game monument. Green Cards spawn inside the lower office quarters. High lookout spiral staircase.',
    hasRecycler: true
  },
  {
    id: 'mining-outpost',
    name: 'Mining Outpost',
    category: 'Tier 0 (Puzzle-Free / Early-Game)',
    tier: 'Tier 0 (Puzzle-Free)',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Puzzle-free early-game roadside monument. Convenient recycler and repair bench with roadside crate spawns.',
    hasRecycler: true
  },
  {
    id: 'oxums-gas-station',
    name: "Oxum's Gas Station",
    category: 'Tier 0 (Puzzle-Free / Early-Game)',
    tier: 'Tier 0 (Puzzle-Free)',
    cardSpawned: 'Green',
    cardRequired: 'None',
    hasSuppliedInfo: true,
    puzzleStrategy: 'Puzzle-free early-game monument. Green Cards spawn in the back office desk. Features public recycler and wheelbarrow/food crates.',
    hasRecycler: true
  },

  // 3. Tier 1 & Industrial (5)
  {
    id: 'junkyard',
    name: 'Junkyard',
    category: 'Tier 1 & Industrial',
    tier: 'Tier 1 & Industrial',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Industrial shredder facility. Detailed puzzle walkthrough and vehicle scrap steps pending verification.',
    detailPlaceholder: 'Official guide data for scrap shredder operations, crane controls, and loot tables to be supplied.',
    hasRecycler: true
  },
  {
    id: 'large-harbor',
    name: 'Large Harbor',
    category: 'Tier 1 & Industrial',
    tier: 'Tier 1 & Industrial',
    cardSpawned: 'Blue',
    cardRequired: 'Green Card',
    fusesNeeded: 1,
    hasSuppliedInfo: true,
    puzzleStrategy: 'Obtained using a green card and a fuse. Insert fuse into the power terminal switch, then swipe your green card to unlock the puzzle room and retrieve the Blue Card.',
    hasRecycler: true
  },
  {
    id: 'satellite-dish-array',
    name: 'Satellite Dish Array',
    category: 'Tier 1 & Industrial',
    tier: 'Tier 1 & Industrial',
    cardSpawned: 'Blue',
    cardRequired: 'Green Card',
    fusesNeeded: 1,
    hasSuppliedInfo: true,
    puzzleStrategy: 'Obtained using a green card and a fuse. Flip the breaker switch, insert the fuse into the auxiliary terminal, and swipe your green card to enter the office and acquire the Blue Card.',
    hasRecycler: true
  },
  {
    id: 'sewer-branch',
    name: 'Sewer Branch',
    category: 'Tier 1 & Industrial',
    tier: 'Tier 1 & Industrial',
    cardSpawned: 'Blue',
    cardRequired: 'Green Card',
    fusesNeeded: 1,
    hasSuppliedInfo: true,
    puzzleStrategy: 'Obtained using a green card and a fuse. Start generator / insert fuse in pump house, swipe green card at underground sewer entrance to collect the Blue Card.',
    hasRecycler: true
  },
  {
    id: 'small-harbor',
    name: 'Small Harbor',
    category: 'Tier 1 & Industrial',
    tier: 'Tier 1 & Industrial',
    cardSpawned: 'Blue',
    cardRequired: 'Green Card',
    fusesNeeded: 1,
    hasSuppliedInfo: true,
    puzzleStrategy: 'Obtained using a green card and a fuse. Activate the dockside fuse terminal and swipe your green card to unlock the blue card spawn office.',
    hasRecycler: true
  },

  // 4. Tier 2 (Mid-to-High Loot) (7)
  {
    id: 'abandoned-military-base',
    name: 'Abandoned Military Base',
    category: 'Tier 2 (Mid-to-High Loot)',
    tier: 'Tier 2 (Mid-to-High Loot)',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Desert fortified bunker base with MLRS missile launcher. Detailed puzzle steps and loot tables pending verification.',
    detailPlaceholder: 'Official guide data for MLRS rocket targeting, perimeter defense, and scientist patrol routes to be supplied.',
    hasRecycler: true
  },
  {
    id: 'airfield',
    name: 'Airfield',
    category: 'Tier 2 (Mid-to-High Loot)',
    tier: 'Tier 2 (Mid-to-High Loot)',
    cardSpawned: 'Red',
    cardRequired: 'Green & Blue Cards',
    fusesNeeded: 2,
    hasSuppliedInfo: true,
    puzzleStrategy: 'Obtained using blue and green cards with fuses. Requires inserting fuses in underground electrical stations and swiping green then blue cards to gain entry to the Red Card room.',
    hasRecycler: true
  },
  {
    id: 'arctic-research-base',
    name: 'Arctic Research Base',
    category: 'Tier 2 (Mid-to-High Loot)',
    tier: 'Tier 2 (Mid-to-High Loot)',
    cardSpawned: 'Red',
    cardRequired: 'Green & Blue Cards',
    fusesNeeded: 1,
    hasSuppliedInfo: true,
    puzzleStrategy: 'Obtained using blue and green cards with fuses in arctic biome conditions. Snowmobiles and heaters located around base; Red Card room unlocked via card chain.',
    hasRecycler: true
  },
  {
    id: 'military-tunnels',
    name: 'Military Tunnels',
    category: 'Tier 2 (Mid-to-High Loot)',
    tier: 'Tier 2 (Mid-to-High Loot)',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Deep underground fortified rail tunnels guarded by heavily armed scientist NPCs. Detailed room-by-room walkthrough pending verification.',
    detailPlaceholder: 'Official guide data for fuse sequence, scientist patrol count, and elite underground armory crates to be supplied.',
    hasRecycler: true
  },
  {
    id: 'power-plant',
    name: 'Power Plant',
    category: 'Tier 2 (Mid-to-High Loot)',
    tier: 'Tier 2 (Mid-to-High Loot)',
    cardSpawned: 'Red',
    cardRequired: 'Green & Blue Cards',
    fusesNeeded: 2,
    hasSuppliedInfo: true,
    puzzleStrategy: 'Obtained using blue and green cards with fuses. Involves flipping 3 electrical switches across cooling towers and turbine halls to unlock the Red Card chamber.',
    hasRecycler: true
  },
  {
    id: 'the-dome',
    name: 'The Dome',
    category: 'Tier 2 (Mid-to-High Loot)',
    tier: 'Tier 2 (Mid-to-High Loot)',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Spherical industrial fuel depot. Parkour pipe-climbing to top catwalks. Puzzle-free loot access. Detailed jump guide pending verification.',
    detailPlaceholder: 'Official jump trajectory diagrams, crude oil barrel counts, and rooftop crate locations to be supplied.',
    hasRecycler: false
  },
  {
    id: 'water-treatment-plant',
    name: 'Water Treatment Plant',
    category: 'Tier 2 (Mid-to-High Loot)',
    tier: 'Tier 2 (Mid-to-High Loot)',
    cardSpawned: 'Red',
    cardRequired: 'Green & Blue Cards',
    fusesNeeded: 1,
    hasSuppliedInfo: true,
    puzzleStrategy: 'Obtained using blue and green cards with fuses. Turn the pressure wheel valve inside the water silo tower and activate the fuse to unlock the Red Card office.',
    hasRecycler: true
  },

  // 5. Tier 3 (End-Game) (7)
  {
    id: 'giant-excavator-pit',
    name: 'Giant Excavator Pit',
    category: 'Tier 3 (End-Game)',
    tier: 'Tier 3 (End-Game)',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Massive automated mining excavator running on Diesel Fuel to extract high-yield sulfur, HQM, or stone.',
    detailPlaceholder: 'Official guide data for diesel consumption ratios, scientist patrol numbers, and radio broadcast timers to be supplied.',
    hasRecycler: false
  },
  {
    id: 'launch-site',
    name: 'Launch Site',
    category: 'Tier 3 (End-Game)',
    tier: 'Tier 3 (End-Game)',
    hasSuppliedInfo: false,
    puzzleStrategy: 'End-game Cobalt Space Center with Bradley APC patrol and massive main launch complex. High radiation.',
    detailPlaceholder: 'Official guide data for Bradley APC raid math, roof elite crate access, and red keycard room sequence to be supplied.',
    hasRecycler: true
  },
  {
    id: 'large-oil-rig',
    name: 'Large Oil Rig',
    category: 'Tier 3 (End-Game)',
    tier: 'Tier 3 (End-Game)',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Offshore deep-sea oil platform guarded by scientists and Heavy Scientist chinook helicopter response wave when locked crate is hacked.',
    detailPlaceholder: 'Official guide data for offshore approach vectors, chinook wave timing, and locked crate defense positions to be supplied.',
    hasRecycler: true
  },
  {
    id: 'missile-silo',
    name: 'Missile Silo',
    category: 'Tier 3 (End-Game)',
    tier: 'Tier 3 (End-Game)',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Deep underground nuclear missile installation with wipe countdown clock and scientist security teams.',
    detailPlaceholder: 'Official guide data for elevator keypad codes, radiation levels, and radiation door mechanics to be supplied.',
    hasRecycler: false
  },
  {
    id: 'oil-rig',
    name: 'Oil Rig',
    category: 'Tier 3 (End-Game)',
    tier: 'Tier 3 (End-Game)',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Small offshore oil platform. Solo/duo-friendly offshore raid with locked crate and scientist garrison.',
    detailPlaceholder: 'Official guide data for boat docking points, sniper vantage perches, and locked crate timer breakdown to be supplied.',
    hasRecycler: true
  },
  {
    id: 'train-yard',
    name: 'Train Yard',
    category: 'Tier 3 (End-Game)',
    tier: 'Tier 3 (End-Game)',
    cardSpawned: 'Red',
    cardRequired: 'Green & Blue Cards',
    fusesNeeded: 1,
    hasSuppliedInfo: true,
    puzzleStrategy: 'Obtained using blue and green cards with fuses. Requires flipping power switch in warehouse 1, activating crane fuse terminal, and swiping blue card on 3rd floor of main tower to get Red Card.',
    hasRecycler: true
  },
  {
    id: 'underwater-labs',
    name: 'Underwater Labs',
    category: 'Tier 3 (End-Game)',
    tier: 'Tier 3 (End-Game)',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Submerged ocean laboratories accessible only via submarine or diving suit. Procedurally generated module layouts.',
    detailPlaceholder: 'Official guide data for submarine docking, CCTV camera codes, and internal airlock puzzles to be supplied.',
    hasRecycler: true
  },

  // 6. Quarries & Transit (6)
  {
    id: 'cargo-ship',
    name: 'Cargo Ship',
    category: 'Quarries & Transit',
    tier: 'Quarries & Transit',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Mobile ocean freighter event cruising around the island. Guarded by armed scientists; features 3 timed locked crates.',
    detailPlaceholder: 'Official guide data for RHIB boarding ladders, radiation fog timer at departure, and captain bridge loot to be supplied.',
    hasRecycler: true
  },
  {
    id: 'caves',
    name: 'Caves',
    category: 'Quarries & Transit',
    tier: 'Quarries & Transit',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Underground cave systems with natural building spots, parkour bucket lifts, and pressure plate spike traps.',
    detailPlaceholder: 'Official guide data for cave layout variations, building claim zones, and spike trap evasion to be supplied.',
    hasRecycler: false
  },
  {
    id: 'hqm-quarry',
    name: 'HQM Quarry',
    category: 'Quarries & Transit',
    tier: 'Quarries & Transit',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Fuel-driven automated High Quality Metal quarry. Consumes Diesel Fuel to mine HQM ore.',
    detailPlaceholder: 'Official guide data for diesel fuel burn rate and HQM yield per barrel to be supplied.',
    hasRecycler: false
  },
  {
    id: 'stone-quarry',
    name: 'Stone Quarry',
    category: 'Quarries & Transit',
    tier: 'Quarries & Transit',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Fuel-driven automated stone quarry. Consumes Diesel Fuel to extract stone and metal fragments.',
    detailPlaceholder: 'Official guide data for diesel consumption and resource yield to be supplied.',
    hasRecycler: false
  },
  {
    id: 'sulfur-quarry',
    name: 'Sulfur Quarry',
    category: 'Quarries & Transit',
    tier: 'Quarries & Transit',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Fuel-driven automated sulfur quarry. Consumes Diesel Fuel to produce raw sulfur ore for explosives.',
    detailPlaceholder: 'Official guide data for diesel-to-sulfur conversion formulas to be supplied.',
    hasRecycler: false
  },
  {
    id: 'train-tunnel-network',
    name: 'Train Tunnel Network',
    category: 'Quarries & Transit',
    tier: 'Quarries & Transit',
    hasSuppliedInfo: false,
    puzzleStrategy: 'Island-wide underground railway system connected by elevator shafts at various monuments. Features drivable locomotives and workcarts.',
    detailPlaceholder: 'Official guide data for track switching mechanics, train fuel consumption, and underground station loot to be supplied.',
    hasRecycler: false
  }
];

// RECYCLER ITEM YIELDS
export interface RecyclerYield {
  itemId: string;
  itemName: string;
  scrapPerItem: number;
  metalFragsPerItem: number;
  hqmPerItem: number;
  clothPerItem: number;
  lowGradePerItem: number;
  notes: string;
}

export const RECYCLER_YIELDS: RecyclerYield[] = [
  { itemId: 'tech_trash', itemName: 'Tech Trash', scrapPerItem: 20, metalFragsPerItem: 0, hqmPerItem: 1, clothPerItem: 0, lowGradePerItem: 0, notes: 'Top scrap generator' },
  { itemId: 'rifle_body', itemName: 'Rifle Body', scrapPerItem: 25, metalFragsPerItem: 0, hqmPerItem: 2, clothPerItem: 0, lowGradePerItem: 0, notes: 'Used for AK/Bolty or pure scrap' },
  { itemId: 'smg_body', itemName: 'SMG Body', scrapPerItem: 15, metalFragsPerItem: 0, hqmPerItem: 2, clothPerItem: 0, lowGradePerItem: 0, notes: 'Used for MP5/Custom' },
  { itemId: 'semi_body', itemName: 'Semi-Automatic Body', scrapPerItem: 15, metalFragsPerItem: 75, hqmPerItem: 2, clothPerItem: 0, lowGradePerItem: 0, notes: 'Used for SAR / SAP' },
  { itemId: 'gears', itemName: 'Gears', scrapPerItem: 10, metalFragsPerItem: 13, hqmPerItem: 0, clothPerItem: 0, lowGradePerItem: 0, notes: 'Save for Garage Doors and Armored Doors' },
  { itemId: 'springs', itemName: 'Metal Spring', scrapPerItem: 10, metalFragsPerItem: 0, hqmPerItem: 1, clothPerItem: 0, lowGradePerItem: 0, notes: 'Save for guns' },
  { itemId: 'pipes', itemName: 'Metal Pipe', scrapPerItem: 5, metalFragsPerItem: 0, hqmPerItem: 1, clothPerItem: 0, lowGradePerItem: 0, notes: 'Save for Rockets and Revolvers' },
  { itemId: 'sheet_metal', itemName: 'Sheet Metal', scrapPerItem: 8, metalFragsPerItem: 100, hqmPerItem: 1, clothPerItem: 0, lowGradePerItem: 0, notes: 'High metal frag yield' },
  { itemId: 'road_sign', itemName: 'Road Signs', scrapPerItem: 5, metalFragsPerItem: 0, hqmPerItem: 1, clothPerItem: 0, lowGradePerItem: 0, notes: 'Save for Roadsign armor kits' },
  { itemId: 'fuse', itemName: 'Electric Fuse', scrapPerItem: 20, metalFragsPerItem: 0, hqmPerItem: 0, clothPerItem: 0, lowGradePerItem: 0, notes: 'Huge early scrap source' },
  { itemId: 'tarp', itemName: 'Tarp', scrapPerItem: 0, metalFragsPerItem: 0, hqmPerItem: 0, clothPerItem: 50, lowGradePerItem: 0, notes: '50 Cloth per tarp' },
  { itemId: 'sewing_kit', itemName: 'Sewing Kit', scrapPerItem: 0, metalFragsPerItem: 0, hqmPerItem: 0, clothPerItem: 10, lowGradePerItem: 0, notes: 'Produces 10 cloth + 2 rope (30 cloth total)' },
  { itemId: 'rope', itemName: 'Rope', scrapPerItem: 0, metalFragsPerItem: 0, hqmPerItem: 0, clothPerItem: 15, lowGradePerItem: 0, notes: '15 Cloth per rope' },
  { itemId: 'propane_tank', itemName: 'Empty Propane Tank', scrapPerItem: 1, metalFragsPerItem: 50, hqmPerItem: 0, clothPerItem: 0, lowGradePerItem: 0, notes: 'Used for flame turrets or frags' }
];
