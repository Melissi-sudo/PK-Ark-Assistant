export type TamingType = 'knockout' | 'passive' | 'special';

export type PvPRole = 
  | 'Main Soaker' 
  | 'Secondary Soaker' 
  | 'High DPS' 
  | 'Boss Fighter' 
  | 'Air Siege / Transport' 
  | 'Scout & Pick' 
  | 'Cave Runner' 
  | 'Base Defense' 
  | 'Support & Healer' 
  | 'Harvester'
  | 'Utility & Harvester'
  | 'Mascot & Pet';

export type DLCSource = 
  | 'The Island / Base' 
  | 'Scorched Earth' 
  | 'Aberration' 
  | 'Extinction' 
  | 'Genesis 1 & 2' 
  | 'Bob\'s Tall Tales (ASA)' 
  | 'ARK: Bob\'s Tall Tales'
  | 'ARK: Fantastic Tames - Pyromane'
  | 'The Center / Base'
  | 'The Center / Mod DLC';

export interface FoodOption {
  name: string;
  foodValue: number;
  affinity: number;
  ratioMultiplier: number;
}

export interface KnockoutWeapon {
  id: string;
  name: string;
  torporPerHit: number;
  damagePerHit: number;
  ammoName: string;
}

export interface CreatureBreedingInfo {
  type: 'Egg' | 'Gestation';
  incubationSecondsBase: number;
  maturationSecondsBase: number;
  imprintIntervalSecondsBase: number;
  optimalTempMinC: number;
  optimalTempMaxC: number;
  babyFoodRatio: number; // weight of meat/berries needed in baby phase
}

export interface BaseStats {
  health: number;
  stamina: number;
  oxygen: number;
  food: number;
  weight: number;
  meleePercent: number;
  torpidity: number;
  torporDepletionBaseSec: number; // Base seconds for torpor to drop 100 points
  healthPerWildPoint?: number;
  staminaPerWildPoint?: number;
  oxygenPerWildPoint?: number;
  foodPerWildPoint?: number;
  weightPerWildPoint?: number;
  meleePerWildPoint?: number;
}

export interface Creature {
  id: string;
  name: string;
  image: string;
  dlc: DLCSource;
  tamingType: TamingType;
  diet: 'Carnivore' | 'Herbivore' | 'Omnivore' | 'Special / Fire' | 'Special / Plant';
  pvpRole: PvPRole;
  pvpTier: 'S+' | 'S' | 'A' | 'B' | 'C';
  pvpDescription: string;
  baseStats: BaseStats;
  baseTorpor: number;
  torporPerLevel: number;
  torporDepletionPerMin: number;
  headshotMultiplier?: number;
  canBeClubbed?: boolean;
  sizeClass?: 'small' | 'medium' | 'large' | 'massive' | 'aquatic';
  armorReductionNotes?: string;
  preferredFoods: {
    foodName: string;
    baseQuantityAtLvl150: number;
    tamingTimeMinutesBase1x: number;
    effectivenessPercent: number;
  }[];
  breeding?: CreatureBreedingInfo;
  isDLCExclusive?: boolean;
}

export interface ServerRatePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  tamingMult: number;
  harvestMult: number;
  matingIntervalMult: number;
  eggHatchMult: number;
  babyMatureMult: number;
  xpMult: number;
}

export interface ActiveTimer {
  id: string;
  title: string;
  creatureName?: string;
  type: 'tame_starve' | 'tame_wake' | 'egg_hatch' | 'baby_imprint' | 'custom';
  targetTimestamp: number;
  totalDurationSeconds: number;
  notes?: string;
  soundAlerted?: boolean;
}

export interface KnockoutWeaponAmmo {
  id: string;
  name: string;
  baseTorpor: number;
  baseDamage: number;
  torporDurationSec: number;
  description: string;
}

export interface KnockoutWeaponProfile {
  id: string;
  name: string;
  category: string;
  allowedAmmos: KnockoutWeaponAmmo[];
}

export interface WeaponQuality {
  id: string;
  name: string;
  damagePercent: number;
  color: string;
}

export type ResourceCategory = 
  | 'metal' 
  | 'obsidian' 
  | 'crystal' 
  | 'oil' 
  | 'pearls' 
  | 'polymer' 
  | 'element' 
  | 'gems_sulfur' 
  | 'caves_obelisks' 
  | 'nests';

export interface ResourceNode {
  id: string;
  category: ResourceCategory;
  name: string;
  lat: number; // 0 to 100
  lon: number; // 0 to 100
  quantity: 'Low' | 'Medium' | 'High' | 'Extremely Rich';
  biome: string;
  bestHarvester: string;
  dangerLevel: 'Safe' | 'Moderate' | 'High Danger' | 'Extreme PvP Hotspot';
  notes: string;
}

export interface MapFarmingRoute {
  id: string;
  title: string;
  primaryResource: string;
  recommendedMount: string;
  gpsWaypoints: string;
  description: string;
  safetyTip: string;
}

export interface ArkMapInfo {
  id: 'the_island' | 'scorched_earth' | 'the_center' | 'aberration' | 'extinction';
  name: string;
  displayName: string;
  theme: string;
  tagline: string;
  bgGradient: string;
  accentColor: string;
  overview: string;
  imageUrl?: string;
  credit?: {
    author: string;
    url: string;
    title: string;
    notes?: string;
  };
  availableResources: ResourceCategory[];
  routes: MapFarmingRoute[];
  nodes: ResourceNode[];
}

export interface DinoTip {
  id: string;
  dinoId: string;
  dinoName: string;
  authorName: string;
  authorUid?: string;
  content: string;
  category: 'Taming Trap' | 'Knockout & Torpor' | 'Narcotics & Food' | 'PvP Strategy' | 'General Tip';
  upvotes: number;
  upvotedBy?: string[];
  createdAt?: any;
  pinned?: boolean;
}

