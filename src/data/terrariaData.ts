/**
 * Terraria 1.4.4+ Labor of Love Tactical Guide Data
 * Comprehensive reference for Boss Progression, Biomes, Ores, Underground Layers, and Evil Biomes.
 * All health values and mechanics verified against official Terraria 1.4.4+ wiki standards.
 */

export interface BossData {
  id: string;
  name: string;
  phase: 'pre-hardmode' | 'hardmode' | 'event';
  order: number;
  health: {
    classic: number;
    expert: number;
    master: number;
  };
  hasTotalHealth?: boolean;
  summonItem: string;
  summonRecipe: string;
  spawnConditions: string;
  arenaAdvice: string[];
  classRecommendations: {
    melee: string;
    ranged: string;
    magic: string;
    summoner: string;
    armor: string;
  };
  keyDrops: string[];
  tactics: string[];
  iconId: string;
  color: string;
}

export interface BiomeData {
  id: string;
  name: string;
  layer: 'surface' | 'underground' | 'special';
  color: string;
  bannerBg: string;
  overview: string;
  keyEnemies: string[];
  uniqueLoot: string[];
  fishingCatches: string[];
  npcPreferences: string[];
  criticalTips: string[];
}

export interface OreData {
  id: string;
  name: string;
  tier: number;
  phase: 'pre-hardmode' | 'hardmode';
  counterpart: string;
  minPickaxe: number;
  pickaxeName: string;
  whereToFind: string;
  bestYLevel: string;
  keyCrafts: string[];
  color: string;
  altarOrder?: number;
}

export interface UndergroundLayerData {
  id: string;
  name: string;
  depthRange: string;
  characteristics: string;
  structures: string[];
  hazards: string[];
  keyResources: string[];
  locatingAdvice: string;
}

export interface EvilBiomeGuide {
  id: 'corruption' | 'crimson';
  name: string;
  color: string;
  bossName: string;
  expertAccessory: string;
  exclusiveMaterial: string;
  hardmodeSpell: string;
  biomeChestWeapon: string;
  bossStrategy: string[];
  quarantineRules: string[];
  spreadBehavior: string[];
  purificationTools: string[];
}

// -------------------------------------------------------------
// 1. BOSS PROGRESSION DATA (VERIFIED 1.4.4+ HEALTH MATRIX)
// -------------------------------------------------------------
export const TERRARIA_BOSSES: BossData[] = [
  // PRE-HARDMODE
  {
    id: 'king-slime',
    name: 'King Slime',
    phase: 'pre-hardmode',
    order: 1,
    health: { classic: 2000, expert: 2800, master: 3570 },
    hasTotalHealth: false,
    summonItem: 'Slime Crown',
    summonRecipe: '20 Gel + Gold/Platinum Crown at a Demon or Crimson Altar',
    spawnConditions: 'Slime Rain (kill 150 slimes), rare natural spawn in outer thirds of the map, or Slime Crown anytime.',
    arenaAdvice: [
      'Build a single horizontal platform of wooden platforms ~25-30 blocks off the ground.',
      'Rope climbing allows you to easily shoot downward while remaining out of normal jumping reach.',
      'Place a Campfire for passive health regeneration (+0.5 HP/s).'
    ],
    classRecommendations: {
      melee: 'Blade of Grass, Starfury, or Amazon yoyo',
      ranged: 'Gold or Platinum Bow with Frostburn Arrows, Snowball Cannon',
      magic: 'Gem Staff (Ruby or Diamond), Wand of Sparking',
      summoner: 'Finch Staff, Slime Staff with Leather Whip',
      armor: 'Silver, Tungsten, Gold, or Platinum Armor'
    },
    keyDrops: [
      'Ninja Armor set (bonus crit chance and movement speed)',
      'Slimy Saddle (fast ground mount that bounces on enemies)',
      'Slime Hook (3-hook grapple with high velocity)',
      'Royal Gel (Expert accessory: makes all normal slimes passive)'
    ],
    tactics: [
      'Teleports directly to player location if you run too far away — watch for the crown sinking into the gel.',
      'Spawns Spiked Slimes in Expert/Master Mode that fire icy projectiles; clear them with piercing attacks.',
      'Shrinks in size and drastically accelerates as health drops below 50%.'
    ],
    iconId: 'king-slime',
    color: '#38bdf8'
  },
  {
    id: 'eye-of-cthulhu',
    name: 'Eye of Cthulhu',
    phase: 'pre-hardmode',
    order: 2,
    health: { classic: 2800, expert: 3640, master: 4641 },
    hasTotalHealth: false,
    summonItem: 'Suspicious Looking Eye',
    summonRecipe: '6 Lens at a Demon or Crimson Altar',
    spawnConditions: 'Nighttime (7:30 PM). Spawns naturally once you have 200+ HP, 3+ NPCs, and 10+ Defense.',
    arenaAdvice: [
      '2 to 3 tiers of platforms spaced 4-5 blocks vertically to dodge dash attacks.',
      'Hermes Boots (or Flurry, Sailfish, Dunerider) are essential for outrunning Phase 2 charges.',
      'Place Campfires and Heart Lanterns across the arena for stacking health regeneration.'
    ],
    classRecommendations: {
      melee: 'Enchanted Sword, Starfury, or Falcon Blade',
      ranged: 'Silver or Gold Bow with Flaming or Jester Arrows',
      magic: 'Ruby or Diamond Staff, Thunder Zapper',
      summoner: 'Flinx Fur Coat with Flinx Staff and Snapthorn whip',
      armor: 'Gold or Platinum Armor, or Jungle Armor'
    },
    keyDrops: [
      'Demonite Ore (Corruption worlds) or Crimtane Ore (Crimson worlds)',
      'Unholy Arrows, Corrupt or Crimson Seeds',
      'Binoculars (extended camera zoom)',
      'Shield of Cthulhu (Expert accessory: double-tap dash with invulnerability frames and ram damage)'
    ],
    tactics: [
      'Phase 1: Summons Servants of Cthulhu. Kill them quickly for Heart pickups.',
      'Phase 2 (Below 50% HP): Sheds iris to reveal ravenous mouth; damage and charge velocity jump significantly.',
      'In Expert and Master Mode, executes rapid chain dashes with little warning; dodge vertically with hooks or double-jump accessories.'
    ],
    iconId: 'eye-of-cthulhu',
    color: '#ef4444'
  },
  {
    id: 'eater-of-worlds',
    name: 'Eater of Worlds',
    phase: 'pre-hardmode',
    order: 3,
    health: { classic: 10050, expert: 15120, master: 19296 },
    hasTotalHealth: false,
    summonItem: 'Worm Food',
    summonRecipe: '30 Vile Powder + 15 Rotten Chunks at a Demon Altar',
    spawnConditions: 'Smash 3 Shadow Orbs in the Corruption chasms or use Worm Food while inside the Corruption.',
    arenaAdvice: [
      'Build a surface arena or a prepared underground area with wide platforms to maneuver freely.',
      'Avoid tight, enclosed natural tunnels where segmented coils can trap you without escape.',
      'Campfire, Heart Lantern, and Sunflowers provide speed and passive health regeneration.'
    ],
    classRecommendations: {
      melee: 'Ball O\' Hurt (flail), Blade of Grass, Terragrim, Falcon Blade',
      ranged: 'Demon Bow with Jester\'s Arrows, Grenades, Molotov Cocktails',
      magic: 'Vilethorn (pierces multiple segments simultaneously), Demon Scythe',
      summoner: 'Snapthorn with Imp Staff or Vampire Frog Staff',
      armor: 'Shadow Armor or Ancient Shadow Armor'
    },
    keyDrops: [
      'Shadow Scales (crafts Nightmare Pickaxe and Shadow Armor)',
      'Demonite Ore (bulk smelting for weapons and tools)',
      'Eater\'s Bone (Baby Eater summon pet)',
      'Worm Scarf (Expert accessory: permanent -17% flat damage reduction)'
    ],
    tactics: [
      'Multi-segmented worm. Piercing attacks can hit multiple segments, producing very high damage.',
      'The head has the lowest defense (2) but highest damage, so prioritizing it can reduce the number of dangerous segments. However, prioritizing the tail is also a viable strategy depending on the situation and weapon type.',
      'Destroying a mid-body segment divides the worm into two separate, fully functioning smaller worms.'
    ],
    iconId: 'eater-of-worlds',
    color: '#8b5cf6'
  },
  {
    id: 'brain-of-cthulhu',
    name: 'Brain of Cthulhu',
    phase: 'pre-hardmode',
    order: 4,
    health: { classic: 1250, expert: 2125, master: 2709 },
    hasTotalHealth: false,
    summonItem: 'Bloody Spine',
    summonRecipe: '30 Vicious Powder + 15 Vertebrae at a Crimson Altar',
    spawnConditions: 'Smash 3 Crimson Hearts in Crimson chasms or use Bloody Spine inside the Crimson.',
    arenaAdvice: [
      'Clear out the large central cavern cavity inside the Crimson chasm and construct platform rows.',
      'Campfires and Sunflowers grant the Happy! speed buff (+10% move speed) to dodge lunges.',
      'Spike Balls or Crimson Rod blood rain clouds placed at arena centers continuously damage Creepers.'
    ],
    classRecommendations: {
      melee: 'The Rotted Fork (spear knockback), Falcon Blade, Code 1 Yoyo',
      ranged: 'The Undertaker, Boomstick, Tendon Bow with Frostburn Arrows',
      magic: 'Crimson Rod (blood rain cloud), Ruby or Diamond Staff',
      summoner: 'Snapthorn whip + Vampire Frog Staff',
      armor: 'Crimson Armor (massive health regeneration)'
    },
    keyDrops: [
      'Tissue Samples (crafts Deathbringer Pickaxe and Crimson Armor)',
      'Crimtane Ore (weapons and tool crafting)',
      'The Meatball (flail), Bone Rattle (pet)',
      'Brain of Confusion (Expert accessory: 1/6 chance to dodge attacks and grants +10% crit on dodge)'
    ],
    tactics: [
      'Phase 1: The Brain is invulnerable while 20 Creepers surround it. Defeat all 20 Creepers to begin Phase 2.',
      'Phase 2: The Brain becomes vulnerable, teleports rapidly, and aggressively charges the player.',
      'Expert/Master: The Brain creates 3 illusions that act as decoys. The real Brain is identifiable by its health bar and can also be distinguished using certain debuffs or minions.',
      'The Brain and Creepers are unusually susceptible to knockback, making knockback particularly useful during the fight.'
    ],
    iconId: 'brain-of-cthulhu',
    color: '#dc2626'
  },
  {
    id: 'queen-bee',
    name: 'Queen Bee',
    phase: 'pre-hardmode',
    order: 5,
    health: { classic: 3400, expert: 4760, master: 6069 },
    hasTotalHealth: false,
    summonItem: 'Abeemination',
    summonRecipe: '5 Honey Blocks + 1 Stinger + 5 Hive Blocks + 1 Bottled Honey (by hand)',
    spawnConditions: 'Break a Larva inside an Underground Jungle Beehive, or use Abeemination anywhere in the Jungle.',
    arenaAdvice: [
      'Do not submerge yourself in deep honey; leave shallow 1-tile dips for the 30-second honey regeneration buff.',
      'Flatten the hive floor with 2 platform tiers and clear cobwebs so mobility is never impeded.',
      'Heart Lanterns and Bezoar accessory (poison immunity) make this encounter vastly safer.'
    ],
    classRecommendations: {
      melee: 'Blade of Grass, Amazon yoyo, Thorn Chakram',
      ranged: 'Minishark with Silver or Meteor Bullets, Boomstick, Tendon or Demon Bow',
      magic: 'Space Gun with Meteor Armor, Vilethorn, Gray Zapinator',
      summoner: 'Hornet Staff, Snapthorn with Imp Staff',
      armor: 'Meteor Armor, Jungle Armor, or Shadow / Crimson Armor'
    },
    keyDrops: [
      'Beenades (extremely effective against Wall of Flesh)',
      'Bee Gun (magic piercing bees), Bee Keeper (sword that spawns killer bees)',
      'Hive Pack (Expert accessory: upgrades friendly bees into giant bees)',
      'Witch Doctor NPC unlocks for housing'
    ],
    tactics: [
      'Alternates between horizontal charging sweeps (dodge by jumping over her) and hovering while shooting stingers and small bees.',
      'Bezoar accessory completely negates her poison debuff.',
      'As her HP drops, horizontal charge speed drastically increases.'
    ],
    iconId: 'queen-bee',
    color: '#eab308'
  },
  {
    id: 'skeletron',
    name: 'Skeletron',
    phase: 'pre-hardmode',
    order: 6,
    health: { classic: 4400, expert: 8800, master: 11220 },
    hasTotalHealth: false,
    summonItem: 'Curse Speaker / Clothier Voodoo Doll',
    summonRecipe: 'Speak to the Old Man at Dungeon entrance at night and click "Curse".',
    spawnConditions: 'Nighttime at Dungeon entrance. Must be defeated before dawn (4:30 AM) or he enrages into a Dungeon Guardian.',
    arenaAdvice: [
      'Build a wide 3-layer platform arena extending over the Dungeon entrance rooftop.',
      'Space platforms 5-6 blocks apart to easily drop down or grapple upward.',
      'Place Campfires, Heart Lanterns, and Star in Bottles along the entire rooftop run.'
    ],
    classRecommendations: {
      melee: 'Molten Fury, Volcano (Fiery Greatsword), Thorn Chakram',
      ranged: 'Molten Fury with Hellfire or Frostburn Arrows, Minishark',
      magic: 'Space Gun (with Meteor Armor), Demon Scythe, Flamelash',
      summoner: 'Imp Staff, Spinal Tap whip',
      armor: 'Meteor Armor, Necro Armor, or Molten Armor'
    },
    keyDrops: [
      'Full Dungeon entrance access (disables Dungeon Guardian instant-kill barrier)',
      'Book of Skulls, Skeletron Hand hook',
      'Bone Glove (Expert accessory: tosses bones that ricochet)'
    ],
    tactics: [
      'In Expert/Master Mode, Skeletron gains massive defense while hands are alive. Destroy BOTH hands first.',
      'Once both hands are destroyed, the head shoots homing cursed skulls; run in an orbital circle to evade them.',
      'Spinning head attack deals massive damage but drops his defense to 0; unleash maximum DPS during spins.'
    ],
    iconId: 'skeletron',
    color: '#94a3b8'
  },
  {
    id: 'deerclops',
    name: 'Deerclops',
    phase: 'pre-hardmode',
    order: 7,
    health: { classic: 7000, expert: 11900, master: 15172 },
    hasTotalHealth: false,
    summonItem: 'Deer Thing',
    summonRecipe: '3 Flinx Fur + 1 Lens + 5 Demonite or Crimtane Ore at a Demon or Crimson Altar',
    spawnConditions: 'Snow biome during a Blizzard at midnight, or Deer Thing used in the Snow biome.',
    arenaAdvice: [
      'Build a flat arena with fire pits and drink Warmth Potions (reduces cold damage by 30%).',
      'Do not build platforms too high; staying within close range prevents his shadow hand barrage.',
      'Hand Warmers accessory prevents Chilled and Frozen debuffs.'
    ],
    classRecommendations: {
      melee: 'Volcano, Night\'s Edge, Dark Lance',
      ranged: 'Hellwing Bow with Wooden Arrows (converts to flaming bats), Phoenix Blaster',
      magic: 'Demon Scythe, Water Bolt, Flamelash',
      summoner: 'Spinal Tap whip with Imp Staff',
      armor: 'Molten Armor, Necro Armor, Jungle Armor'
    },
    keyDrops: [
      'Eye Bone (Chester mobile piggy bank pet)',
      'Eyebrella (rain protection vanity)',
      'Houndius Shootius (sentry turret)',
      'Bone Helm (Expert accessory: summons shadow hands against nearby enemies)'
    ],
    tactics: [
      'Immune to damage while you are more than 30 tiles away (shadow fog surrounds him).',
      'Ice spikes erupt from the ground in the direction he faces; jump over him to land behind.',
      'Periodically roars to inflict Slow and Chilled debuffs on nearby players.'
    ],
    iconId: 'deerclops',
    color: '#06b6d4'
  },
  {
    id: 'wall-of-flesh',
    name: 'Wall of Flesh',
    phase: 'pre-hardmode',
    order: 8,
    health: { classic: 8000, expert: 12000, master: 15000 },
    hasTotalHealth: false,
    summonItem: 'Guide Voodoo Doll',
    summonRecipe: 'Drop Guide Voodoo Doll into Underworld lava while the Guide NPC is alive.',
    spawnConditions: 'The Underworld (Hell). Sweeps across the map in the direction you faced when dropping the doll.',
    arenaAdvice: [
      'Build a continuous flat wooden bridge or minecart track spanning 1000-2000 blocks across the Underworld.',
      'Clear out obsidian building roofs so you never hit a ceiling while backpedaling.',
      'Place Campfires every 50 blocks. Use Water Walking Boots or Obsidian Skin Potions for accidental lava dips.'
    ],
    classRecommendations: {
      melee: 'Night\'s Edge (broad sweep attack eliminates The Hungry), Sunfury',
      ranged: 'Beenades (100+ Beenades melt him!), Phoenix Blaster, Hellwing Bow',
      magic: 'Demon Scythe (pre-cast spinning blades), Water Bolt',
      summoner: 'Spinal Tap + Imp Staff',
      armor: 'Molten Armor (Melee), Necro Armor (Ranged), Meteor Armor (Magic)'
    },
    keyDrops: [
      'Pwnhammer (smashes Demon/Crimson Altars to generate Hardmode ores)',
      'Warrior, Ranger, Sorcerer, or Summoner Emblem (+15% class damage)',
      'Breaker Blade, Clockwork Assault Rifle, Laser Rifle',
      'Demon Heart (Expert item: grants permanent +1 accessory slot)',
      'TRANSITION TO HARDMODE!'
    ],
    tactics: [
      'Aim for the eyes: they have 0 defense, while the mouth has 12 defense.',
      'Kill "The Hungry" tentacles early; they drop healing hearts to replenish your health.',
      'As low HP is reached, movement speed accelerates drastically; use Swiftness Potions and Mounts.'
    ],
    iconId: 'wall-of-flesh',
    color: '#f43f5e'
  },

  // HARDMODE
  {
    id: 'queen-slime',
    name: 'Queen Slime',
    phase: 'hardmode',
    order: 9,
    health: { classic: 18000, expert: 28800, master: 36720 },
    hasTotalHealth: false,
    summonItem: 'Gelatin Crystal',
    summonRecipe: 'Found growing in Underground Hallow crystal shards; use inside the Hallow.',
    spawnConditions: 'Use Gelatin Crystal in the Hallow (Day or Night).',
    arenaAdvice: [
      'Build a high 2-tier platform arena in the Hallow.',
      'Wing mobility (Fairy Wings, Harpy Wings) or a high-speed mount is required.',
      'Wide arenas allow dodging her high-bouncing stomps.'
    ],
    classRecommendations: {
      melee: 'Shadowflame Knife, Dao of Pow, Amarok yoyo',
      ranged: 'Daedalus Stormbow with Holy Arrows, Megashark',
      magic: 'Meteor Staff, Crystal Serpent, Spirit Flame',
      summoner: 'Sanguine Staff or Blade Staff with Cool Whip',
      armor: 'Titanium or Adamantite Armor'
    },
    keyDrops: [
      'Gelatinous Pillion (flying slime mount with fast-fall stomps)',
      'Hook of Dissonance (instant teleportation grapple)',
      'Volatile Gelatin (Expert accessory: periodic explosive slime bursts)'
    ],
    tactics: [
      'Phase 1: Bounces aggressively and shoots crystal shards in 6 directions.',
      'Spawns 3 types of mini slimes: Heavenly (flying), Bouncy (shards), and Crystal (spikes).',
      'Phase 2 (Below 50% HP): Sprouts wings and flies; run laterally to dodge aerial projectile barrages.'
    ],
    iconId: 'queen-slime',
    color: '#ec4899'
  },
  {
    id: 'the-destroyer',
    name: 'The Destroyer',
    phase: 'hardmode',
    order: 10,
    health: { classic: 80000, expert: 120000, master: 153000 },
    hasTotalHealth: false,
    summonItem: 'Mechanical Worm',
    summonRecipe: '6 Rotten Chunks or Vertebrae + 5 Iron/Lead Bars + 6 Souls of Night at Mythril/Orichalcum Anvil',
    spawnConditions: 'Nighttime (7:30 PM). Spawns naturally after smashing an altar, or via Mechanical Worm.',
    arenaAdvice: [
      'Build an elevated platform 30-40 blocks above the ground so his worm body cannot reach you.',
      'Daedalus Stormbow or Nimbus Rod rain down continuous piercing hits through his 80+ segments.',
      'Enclose sides with solid blocks to block red lasers fired by detached Probes.'
    ],
    classRecommendations: {
      melee: 'Dao of Pow, Flying Knife, Shadowflame Knife',
      ranged: 'Daedalus Stormbow with Holy Arrows, Dart Rifle/Pistol with Cursed/Ichor Darts',
      magic: 'Nimbus Rod, Meteor Staff, Crystal Vile Shard',
      summoner: 'Sanguine Staff or Blade Staff (with Ichor Flask)',
      armor: 'Adamantite, Titanium, or Frost Armor'
    },
    keyDrops: [
      'Souls of Might (essential for Megashark & Light Discs)',
      'Hallowed Bars (crafts Hallowed Armor & tools)',
      'Mechanical Wagon Piece (Minecart component)'
    ],
    tactics: [
      'Each segment damaged releases a Probe that flies and shoots lasers; kill Probes immediately for healing hearts.',
      'Immune to all debuffs (including Ichor and Cursed Flames).',
      'Piercing weapons hit dozens of segments in a single shot, dealing extraordinary total damage.'
    ],
    iconId: 'the-destroyer',
    color: '#0284c7'
  },
  {
    id: 'the-twins',
    name: 'The Twins',
    phase: 'hardmode',
    order: 11,
    health: { classic: 43000, expert: 64500, master: 82238 },
    hasTotalHealth: true,
    summonItem: 'Mechanical Eye',
    summonRecipe: '3 Lens + 5 Iron/Lead Bars + 6 Souls of Light at Mythril/Orichalcum Anvil',
    spawnConditions: 'Nighttime (7:30 PM) via Mechanical Eye.',
    arenaAdvice: [
      'Construct an ultra-long asphalt road or minecart track across 1000+ blocks.',
      'Asphalt blocks drastically boost run speed to outrun Retinazer lasers and Spazmatism flame charges.',
      'Place Campfires and Heart Lanterns along the track.'
    ],
    classRecommendations: {
      melee: 'Shadowflame Knife, Yelets yoyo with Yoyo Bag',
      ranged: 'Megashark with Crystal Bullets, Daedalus Stormbow',
      magic: 'Crystal Serpent, Sky Fracture, Golden Shower',
      summoner: 'Sanguine Staff with Durendal whip',
      armor: 'Hallowed or Titanium Armor'
    },
    keyDrops: [
      'Souls of Sight (crafts Rainbow Rod, Fairy Bell, Optic Staff)',
      'Hallowed Bars',
      'Mechanical Battery Piece'
    ],
    tactics: [
      'Spazmatism (green eye) fires Cursed Flame fireballs; Retinazer (red eye) fires lasers.',
      'FOCUS SPAZMATISM FIRST! In Phase 2, he transforms into a mechanical flamethrower with aggressive dashes.',
      'Never transition both eyes into Phase 2 at the same time.'
    ],
    iconId: 'the-twins',
    color: '#10b981'
  },
  {
    id: 'skeletron-prime',
    name: 'Skeletron Prime',
    phase: 'hardmode',
    order: 12,
    health: { classic: 59000, expert: 88500, master: 112836 },
    hasTotalHealth: true,
    summonItem: 'Mechanical Skull',
    summonRecipe: '30 Bones + 5 Iron/Lead Bars + 3 Souls of Light + 3 Souls of Night',
    spawnConditions: 'Nighttime via Mechanical Skull. Must be killed before 4:30 AM dawn.',
    arenaAdvice: [
      '3-4 tiers of wooden platforms with ample vertical headroom.',
      'Wings and Shield of Cthulhu or Master Ninja Gear allow orbiting around his 4 swinging arms.',
      'Golden Shower book provides continuous -15 defense Ichor debuff.'
    ],
    classRecommendations: {
      melee: 'Yelets, Shadowflame Knife, Dao of Pow',
      ranged: 'Megashark with Crystal or Ichor Bullets',
      magic: 'Golden Shower + Crystal Serpent, Meteor Staff',
      summoner: 'Sanguine Staff, Blade Staff with Firecracker',
      armor: 'Hallowed Armor (Holy Protection shadow dodge)'
    },
    keyDrops: [
      'Souls of Fright (crafts Flamethrower, Naughty Present)',
      'Hallowed Bars',
      'Mechanical Wheel Piece'
    ],
    tactics: [
      'Has 4 arms: Prime Cannon (bombs), Prime Saw, Prime Vice, and Prime Laser.',
      'Destroy the Prime Laser and Prime Saw first to eliminate ranged spam and melee hazard.',
      'When his head spins, his defense doubles from 24 to 48 — focus on evasive orbiting.'
    ],
    iconId: 'skeletron-prime',
    color: '#64748b'
  },
  {
    id: 'plantera',
    name: 'Plantera',
    phase: 'hardmode',
    order: 13,
    health: { classic: 30000, expert: 42000, master: 53550 },
    hasTotalHealth: false,
    summonItem: 'Plantera\'s Bulb',
    summonRecipe: 'Naturally growing pink bulbs in the Underground Jungle (post-3 Mech bosses).',
    spawnConditions: 'Break a Plantera\'s Bulb in the Underground Jungle with a pickaxe.',
    arenaAdvice: [
      'Excavate a massive rectangular arena (~100x100 blocks) inside the Underground Jungle.',
      'DO NOT leave the Jungle or go to the surface, or Plantera becomes ENRAGED with 9999 speed & defense!',
      'Place teleporters on opposite sides of the arena or circular minecart tracks to kite effortlessly.'
    ],
    classRecommendations: {
      melee: 'True Night\'s Edge, True Excalibur, Death Sickle',
      ranged: 'Megashark with Chlorophyte or Crystal Bullets, Chlorophyte Shotbow with Holy Arrows',
      magic: 'Venom Staff, Rainbow Gun, Magical Harp',
      summoner: 'Optic Staff, Sanguine Staff with Durendal',
      armor: 'Chlorophyte or Turtle Armor, Hallowed Armor'
    },
    keyDrops: [
      'Temple Key (unlocks Jungle Lihzahrd Temple)',
      'Seedler, The Axe (guitar hammer), Grenade Launcher, Venus Magnum',
      'Spore Sac (Expert accessory: creates homing spore mines around you)',
      'Unlocks Post-Plantera Hardmode Dungeon enemies and loot!'
    ],
    tactics: [
      'Phase 1: Shoots seeds, poison seeds, and bouncy thorn balls. Stay above the thorn balls at the bottom of the arena.',
      'Phase 2 (Below 50% HP): Sheds flower petals, releases dozens of fast biting tentacles, and gains massive speed.',
      'Use circling movement patterns around the arena perimeter to stay ahead of the tentacles.'
    ],
    iconId: 'plantera',
    color: '#10b981'
  },
  {
    id: 'golem',
    name: 'Golem',
    phase: 'hardmode',
    order: 14,
    health: { classic: 60000, expert: 90000, master: 114750 },
    hasTotalHealth: true,
    summonItem: 'Lihzahrd Power Cell',
    summonRecipe: 'Use Lihzahrd Power Cell at the Lihzahrd Altar inside the Jungle Temple.',
    spawnConditions: 'Inside the Jungle Temple altar room (post-Plantera).',
    arenaAdvice: [
      'Deactivate and harvest all Lihzahrd Traps (Super Dart, Spiky Ball, Spear) in the room with wire cutters!',
      'Build 1-2 platform tiers above the altar to stay clear of ground punches.',
      'Campfire, Heart Lantern, Bast Statue, and Honey pool inside the chamber.'
    ],
    classRecommendations: {
      melee: 'Terra Blade, Death Sickle, Eye of Cthulhu yoyo',
      ranged: 'Tsunami (Duke Fishron bow), Megashark, Tactical Shotgun with Chlorophyte Bullets',
      magic: 'Spectre Staff, Inferno Fork, Bat Scepter',
      summoner: 'Raven Staff, Desert Tiger Staff, Morning Star',
      armor: 'Shroomite Armor (Ranged), Spectre Armor (Magic), Beetle Armor (Melee)'
    },
    keyDrops: [
      'Picksaw (210% pickaxe: can mine Lihzahrd Bricks and Altars!)',
      'Eye of the Golem (crit accessory)',
      'Sun Stone (+10% all stats during day)',
      'Beetle Husks (crafts endgame Beetle Armor)',
      'Shiny Stone (Expert: ultra health regen when standing still)'
    ],
    tactics: [
      'Phase 1: Destroy both fists first so he cannot launch long-range punches.',
      'Aim for the head while avoiding lasers and bouncing fireballs.',
      'Phase 2: Head detaches and floats, shooting lasers through walls while the body stomps aggressively.'
    ],
    iconId: 'golem',
    color: '#d97706'
  },
  {
    id: 'empress-of-light',
    name: 'Empress of Light',
    phase: 'hardmode',
    order: 15,
    health: { classic: 70000, expert: 98000, master: 124950 },
    hasTotalHealth: false,
    summonItem: 'Prismatic Lacewing',
    summonRecipe: 'Catch Prismatic Lacewing butterfly in surface Hallow from 7:30 PM to 12:00 AM using a Bug Net.',
    spawnConditions: 'Kill a Prismatic Lacewing in any biome. (If fought during daytime, all her attacks deal INSTANT 99999 KILL!).',
    arenaAdvice: [
      'Extremely long skybridge (2000+ blocks) with Asphalt or Blessed Apple / Witch\'s Broom mount.',
      'Vertical mobility from Fishron Wings, Empress Wings, or Soaring Insignia.',
      'Memorize her strictly scripted bullet-hell attack patterns.'
    ],
    classRecommendations: {
      melee: 'Terra Blade, Influx Waver, Daybreak',
      ranged: 'Chain Gun with Chlorophyte Bullets, Tsunami',
      magic: 'Razorblade Typhoon, Laser Machinegun, Blizzard Staff',
      summoner: 'Blade Staff, Sanguine Staff, Kaleidoscope whip',
      armor: 'Hallowed Armor (Shadow dodge), Beetle Armor, Spectre Armor'
    },
    keyDrops: [
      'Terraprisma (Summoner Holy Grail: ONLY dropped if 100% of damage is dealt during daytime!)',
      'Eventide (Rainbow arrow bow)',
      'Nightglow, Starlight, Stellar Tune',
      'Soaring Insignia (Expert accessory: INFINITE wing flight time and boost!)'
    ],
    tactics: [
      'Attacks: Prismatic Bolts, Dash, Sun Dance, Everlasting Rainbow, Ethereal Lance (swords).',
      'During Ethereal Lance, watch the sword trajectory lines and step out of the beam path before they fire.',
      'Daytime fight rewards Terraprisma, the strongest summoner weapon in Terraria.'
    ],
    iconId: 'empress-of-light',
    color: '#c084fc'
  },
  {
    id: 'duke-fishron',
    name: 'Duke Fishron',
    phase: 'hardmode',
    order: 16,
    health: { classic: 60000, expert: 78000, master: 99000 },
    hasTotalHealth: false,
    summonItem: 'Truffle Worm',
    summonRecipe: 'Catch Truffle Worm in Underground Glowing Mushroom biome with Bug Net, then fish in Ocean.',
    spawnConditions: 'Fish in the Ocean using a Truffle Worm as bait.',
    arenaAdvice: [
      '2-3 rows of platforms extending across the entire Ocean width.',
      'DO NOT leave the Ocean biome or Duke enrages with double speed and attack.',
      'Asphalt runway and Master Ninja Gear (dash dodge) make dodging his charges manageable.'
    ],
    classRecommendations: {
      melee: 'Terra Blade, Possessed Hatchet, Vampire Knives',
      ranged: 'Chain Gun / Megashark with Chlorophyte Bullets, Tactical Shotgun',
      magic: 'Razorpine, Bat Scepter, Spectre Staff',
      summoner: 'Raven Staff, Desert Tiger with Kaleidoscope',
      armor: 'Beetle Armor, Shroomite Armor, Spectre Armor'
    },
    keyDrops: [
      'Tsunami (5-arrow shotgun bow)',
      'Razorblade Typhoon (infinite bouncing homing magic disc)',
      'Flairon (flail that releases homing bubbles)',
      'Fishron Wings (fastest vertical wings in the game)',
      'Shrimpy Truffle (Expert: Cute Fishron mount, +15% damage when wet)'
    ],
    tactics: [
      'Phase 1: Charges 5 times, then fires explosive bubble rings and summons Sharknados.',
      'Phase 2: Eyes glow yellow, spins to summon Cthulhunadoes (giant water tornados).',
      'Expert Phase 3: Background turns black; teleports invisibly and charges in a 1-2-3 rhythm. Shield dash into his charges to parry.'
    ],
    iconId: 'duke-fishron',
    color: '#06b6d4'
  },
  {
    id: 'lunatic-cultist',
    name: 'Lunatic Cultist',
    phase: 'hardmode',
    order: 17,
    health: { classic: 32000, expert: 48000, master: 61200 },
    hasTotalHealth: false,
    summonItem: 'Kill the 4 Dungeon Cultists',
    summonRecipe: 'Spawn naturally at the Dungeon entrance post-Golem.',
    spawnConditions: 'Defeat the 4 Cultists at the Dungeon entrance.',
    arenaAdvice: [
      'Flatten the Dungeon entrance roof and place 2 platform tiers above.',
      'Homing weapons make tracking his teleports effortless.',
      'Possess Hunter Potions or target lock to identify the real Cultist during his ritual.'
    ],
    classRecommendations: {
      melee: 'Terra Blade, Influx Waver, Flairon',
      ranged: 'Tsunami, Chain Gun with Chlorophyte Bullets',
      magic: 'Razorblade Typhoon, Blizzard Staff',
      summoner: 'Xeno Staff, Tempest Staff with Kaleidoscope',
      armor: 'Beetle, Shroomite, or Spectre Armor'
    },
    keyDrops: [
      'Ancient Manipulator (essential endgame crafting station for Lunar Fragments & Luminite)',
      'Triggers the CELESTIAL PILLARS event immediately!'
    ],
    tactics: [
      'Shoots fireballs, ice mist, lightning orbs, and ancient light.',
      'Ritual mechanic: Cultist creates duplicates in a circle. Hit ONLY the real one (the real one has a diagonal stripe on hood and emits shadows).',
      'Hitting a fake duplicate summons a Phantasm Dragon or Ancient Vision.'
    ],
    iconId: 'lunatic-cultist',
    color: '#8b5cf6'
  },
  {
    id: 'moon-lord',
    name: 'Moon Lord',
    phase: 'hardmode',
    order: 18,
    health: { classic: 145000, expert: 217500, master: 277125 },
    hasTotalHealth: true,
    summonItem: 'Celestial Sigil or Destroy 4 Lunar Pillars',
    summonRecipe: '20 Solar + 20 Vortex + 20 Nebula + 20 Stardust Fragments at Ancient Manipulator',
    spawnConditions: 'Spawns 1 minute after destroying the final Celestial Pillar, or immediately via Celestial Sigil.',
    arenaAdvice: [
      'Long skybridge of Asphalt blocks (1500+ tiles) or Witch\'s Broom / UFO mount for flight.',
      'Rod of Discord (teleport rod) is the best tool for bypassing the Phantasmal Deathray without taking hit.',
      'Campfires, Heart Lanterns, Bast Statues, and Nurse NPC box on the bridge.'
    ],
    classRecommendations: {
      melee: 'Solar Eruption (pierces hands & chest), Daybreak (stacking spears)',
      ranged: 'Vortex Beater with Chlorophyte Bullets, Phantasm with Holy Arrows',
      magic: 'Nebula Arcanum, Nebula Blaze, Razorblade Typhoon',
      summoner: 'Stardust Dragon Staff (massive single-target damage), Kaleidoscope',
      armor: 'Beetle Armor, Shroomite Armor, Spectre Armor, Spooky Armor'
    },
    keyDrops: [
      'Luminite Ore (crafts Luminite Bars & Endgame Armor)',
      'Zenith material weapons: Meowmere, Star Wrath',
      'S.D.M.G. (Space Dolphin Machine Gun)',
      'Last Prism (beam weapon), Lunar Flare',
      'Terrarian (strongest yoyo in the game)',
      'Gravity Globe, Suspicious Looking Tentacle (Expert)'
    ],
    tactics: [
      'Must destroy the 2 Hand Eyes and 1 Forehead Eye before the Core opens.',
      'PHANTASMAL DEATHRAY: Forehead eye opens and charges a giant golden sweep laser (deals 300+ damage!). Fly over his head or use Rod of Discord to teleport through it.',
      'Once an eye is destroyed, a True Eye of Cthulhu releases to hover and fire Phantasmal Bolts.',
      'When all 3 eyes are defeated, his Chest opens to expose the Moon Lord Core.'
    ],
    iconId: 'moon-lord',
    color: '#06b6d4'
  }
];

// -------------------------------------------------------------
// 2. BIOMES & RESOURCES DATA
// -------------------------------------------------------------
export const TERRARIA_BIOMES: BiomeData[] = [
  {
    id: 'forest',
    name: 'Surface Forest',
    layer: 'surface',
    color: '#22c55e',
    bannerBg: 'from-emerald-950 to-green-900',
    overview: 'The starting surface biome of every world. Peaceful by day with Green and Blue Slimes, hostile by night with Zombies and Demon Eyes. Ideal location for main spawn hub and beginner housing.',
    keyEnemies: ['Green/Blue Slime', 'Zombie', 'Demon Eye', 'Blood Zombie (Blood Moon)', 'Goblin Scout (outer thirds)'],
    uniqueLoot: ['Daybloom herbs', 'Wood and Acorns', 'Surface Chests (Hermes Boots, Aglet, Blowpipe)', 'Sunflower (blocks evil grass spread)'],
    fishingCatches: ['Bass', 'Wood Crate / Pearlwood Crate', 'Frog Leg accessory', 'Balloon Pufferfish'],
    npcPreferences: ['Guide', 'Merchant', 'Golfer', 'Zoologist'],
    criticalTips: [
      'Plant Sunflowers around early base houses to get the Happy! buff (+10% speed, -17% enemy spawn rate).',
      'Collect fallen stars at night to craft Mana Crystals (each grants +20 max mana up to 200).',
      'Fell trees completely to ensure acorns can replant and regrow forest canopy.'
    ]
  },
  {
    id: 'desert',
    name: 'The Desert',
    layer: 'surface',
    color: '#f59e0b',
    bannerBg: 'from-amber-950 to-yellow-900',
    overview: 'Sandy biome featuring Sandstorms, Antlion pits, and treacherous rolling cacti. Houses the entrance to the deep Underground Desert pyramid network.',
    keyEnemies: ['Vulture', 'Antlion', 'Antlion Charger', 'Antlion Swarmer', 'Tomb Crawler', 'Sand Elemental (Hardmode sandstorm)'],
    uniqueLoot: ['Water Walking Boots (Ocean water chests)', 'Magic Conch (teleports to Ocean)', 'Ancient Chisel (+25% mining speed)', 'Bast Statue (+5 defense)'],
    fishingCatches: ['Oasis Crate', 'Mirage Crate', 'Flounder', 'Rock Lobster'],
    npcPreferences: ['Arms Dealer', 'Dye Trader', 'Steampunker'],
    criticalTips: [
      'Watch out for Rolling Cacti: hitting them triggers rolling boulders that can easily one-shot Pre-Hardmode players.',
      'Bast Statues grant a permanent area-of-effect +5 Defense buff; collect as many as possible for boss arenas.',
      'Sandstorm events trigger Sand Elemental spawns in Hardmode, essential for Forbidden Armor fragments.'
    ]
  },
  {
    id: 'snow',
    name: 'The Snow Biome (Tundra)',
    layer: 'surface',
    color: '#38bdf8',
    bannerBg: 'from-cyan-950 to-blue-900',
    overview: 'Frozen landscape covered in Snow and Ice. Plagued by Blizzards and frozen water that inflicts the Chilled debuff. Directly connects to the Ice Caverns.',
    keyEnemies: ['Ice Slime', 'Zombie Eskimo', 'Wolf', 'Spiked Ice Slime', 'Ice Golem (Hardmode blizzard)'],
    uniqueLoot: ['Ice Boomerang', 'Ice Skates (prevents thin ice breaking and improves ice traction)', 'Blizzard in a Bottle', 'Snowball Cannon'],
    fishingCatches: ['Frozen Crate', 'Boreal Crate', 'Atlantic Cod', 'Frost Minnow'],
    npcPreferences: ['Goblin Tinkerer', 'Mechanic', 'Cyborg', 'Santa Claus'],
    criticalTips: [
      'Ice Skates are a crucial ingredient for crafting Frostspark Boots and Terraspark Boots.',
      'Equip a Hand Warmer or drink Warmth Potions to eliminate the cold damage and freezing mechanics during Deerclops fights.',
      'Defeating Ice Golems during Hardmode blizzards yields Frost Cores for Frost Armor.'
    ]
  },
  {
    id: 'jungle',
    name: 'The Jungle',
    layer: 'surface',
    color: '#10b981',
    bannerBg: 'from-emerald-950 to-teal-900',
    overview: 'Rich, hostile tropical biome with Mud blocks and tall bamboo trees. Contains surface Beehives, snapping Piranhas, and is vulnerable to world evil conversion.',
    keyEnemies: ['Snatcher', 'Jungle Bat', 'Piranha', 'Derpling (Hardmode)', 'Giant Flying Fox'],
    uniqueLoot: ['Boomstick', 'Staff of Regrowth', 'Feral Claws (+12% melee speed & autoswing)', 'Anklet of the Wind', 'Fiberglass Fishing Pole'],
    fishingCatches: ['Jungle Crate', 'Bramble Crate', 'Neon Tetra', 'Variegated Lardfish (Summoning Potions)'],
    npcPreferences: ['Dryad', 'Painter', 'Witch Doctor'],
    criticalTips: [
      'Feral Claws found in Jungle shrines are the foundational component for Titan Glove, Fire Gauntlet, and Berserker Glove.',
      'NEVER let Corruption or Crimson penetrate the Jungle; in 1.4.4, mud converted to dirt can be restored, but quarantine tunnels protect your Chlorophyte and Plantera bulbs.',
      'Surface Jungle shrines frequently spawn inside hollowed Living Mahogany Trees.'
    ]
  },
  {
    id: 'ocean',
    name: 'The Ocean',
    layer: 'surface',
    color: '#0284c7',
    bannerBg: 'from-blue-950 to-cyan-900',
    overview: 'Located at both outer edges of the world. Deep marine waters filled with Sharks and sunken Water Chests. The summoning ground for Duke Fishron.',
    keyEnemies: ['Shark', 'Crab', 'Pink Jellyfish', 'Sea Snail'],
    uniqueLoot: ['Water Walking Boots', 'Breathing Reed', 'Flipper', 'Trident', 'Shark Tooth Necklace (+5 armor penetration)'],
    fishingCatches: ['Ocean Crate', 'Seaside Crate', 'Reaver Shark', 'Sawtooth Shark (Chainsaw)', 'Swordfish'],
    npcPreferences: ['Angler', 'Pirate', 'Stylist'],
    criticalTips: [
      'Use Gills Potions or Breathing Reed to safely explore the ocean seabed without drowning.',
      'Shark Tooth Necklace drops from Blood Moon enemies in the ocean and gives a flat +5 armor penetration to all attacks.',
      'Ocean beach fishing with Truffle Worm bait is how Duke Fishron is summoned in Hardmode.'
    ]
  },
  {
    id: 'sky-islands',
    name: 'Floating Sky Islands',
    layer: 'special',
    color: '#a855f7',
    bannerBg: 'from-purple-950 to-indigo-900',
    overview: 'Heavenly celestial islands hovering in the Space layer. Feature Sunplate Blocks, Cloud and Rain Cloud foundations, and Skyware Chests.',
    keyEnemies: ['Harpy', 'Wyvern (Hardmode: drops Souls of Flight)'],
    uniqueLoot: ['Starfury (summons falling stars)', 'Shiny Red Balloon (triples jump height)', 'Lucky Horseshoe (negates ALL fall damage)', 'Celestial Magnet'],
    fishingCatches: ['Sky Crate', 'Azure Crate', 'Damselfish (Calming Potions)'],
    npcPreferences: ['Party Girl', 'Wizard'],
    criticalTips: [
      'Locate Floating Islands early by firing a Water Bolt or Meteor Bullets upward and listening for ricochet sounds, or drink Gravitation Potions.',
      'Lucky Horseshoe completely negates fall damage; combine with Shiny Red Balloon to start your mobility progression.',
      'Wyverns spawn in the sky layer immediately in Hardmode; kill them for Souls of Flight to craft your first Wings.'
    ]
  },
  {
    id: 'hallow',
    name: 'The Hallow (Fairytale Biome)',
    layer: 'special',
    color: '#ec4899',
    bannerBg: 'from-pink-950 to-purple-900',
    overview: 'Hardmode-exclusive holy biome that spawns diagonally alongside the world evil upon Wall of Flesh defeat. Pastel trees, rainbow skies, and lethal unicorns.',
    keyEnemies: ['Pixie', 'Unicorn', 'Gastropod', 'Prismatic Lacewing (Empress of Light summon)', 'Rainbow Slime'],
    uniqueLoot: ['Pixie Dust', 'Unicorn Horn', 'Blessed Apple (Unicorn mount)', 'Rod of Discord (Underground Hallow)', 'Prismatic Lacewing'],
    fishingCatches: ['Hallowed Crate', 'Divine Crate', 'Princess Fish (Love Potions)', 'Chaos Fish (Teleportation Potions)'],
    npcPreferences: ['Party Girl', 'Tavernkeep', 'Nurse'],
    criticalTips: [
      'The Hallow cannot corrupt Mud or Jungle blocks and does NOT invalidate NPC housing validity.',
      'Prismatic Lacewing spawns only on surface Hallow grass between 7:30 PM and 12:00 AM; catch with Bug Net for Empress of Light summons.',
      'Blessed Apple gives a super-fast galloping Unicorn mount that deals ram damage.'
    ]
  },
  {
    id: 'underworld',
    name: 'The Underworld (Hell)',
    layer: 'special',
    color: '#f43f5e',
    bannerBg: 'from-red-950 to-rose-950',
    overview: 'The bottommost layer of the map. Vast oceans of deadly lava, crumbling obsidian brick towers, and Shadow Chests. Wall of Flesh arena grounds.',
    keyEnemies: ['Lava Slime', 'Hellbat', 'Demon', 'Voodoo Demon (carries Guide Voodoo Doll)', 'Bone Serpent', 'Red Devil (Hardmode)'],
    uniqueLoot: ['Hellstone Ore', 'Shadow Chests (Sunfury, Dark Lance, Flamelash, Flower of Fire)', 'Hellwing Bow', 'Obsidian Rose (reduces lava damage)'],
    fishingCatches: ['Obsidian Crate', 'Hellstone Crate', 'Flarefin Koi', 'Obsidifish', 'Lavafly bait'],
    npcPreferences: ['Demolitionist', 'Tax Collector'],
    criticalTips: [
      'Always carry an Obsidian Skin Potion before mining Hellstone; mining Hellstone releases lava that can quickly submerge you.',
      'Kill Voodoo Demons ONLY over solid land; if their doll falls into lava, the Wall of Flesh is summoned immediately!',
      'Shadow Chests require a Shadow Key found inside the Dungeon; once unlocked, the key is reusable infinitely.'
    ]
  }
];

// -------------------------------------------------------------
// 3. ORES & PICKAXE PROGRESSION DATA
// -------------------------------------------------------------
export const TERRARIA_ORES: OreData[] = [
  // PRE-HARDMODE
  {
    id: 'copper-tin',
    name: 'Copper / Tin Ore',
    tier: 1,
    phase: 'pre-hardmode',
    counterpart: 'Copper ↔ Tin',
    minPickaxe: 35,
    pickaxeName: 'Any Starter Pickaxe',
    whereToFind: 'Surface dirt layer and shallow underground pockets.',
    bestYLevel: 'Surface and shallow Underground (0 to -200 ft)',
    keyCrafts: ['Copper/Tin Pickaxe (35% power)', 'Copper/Tin Broadsword', 'Copper/Tin Armor (+2 set defense)'],
    color: '#ea580c'
  },
  {
    id: 'iron-lead',
    name: 'Iron / Lead Ore',
    tier: 2,
    phase: 'pre-hardmode',
    counterpart: 'Iron ↔ Lead',
    minPickaxe: 40,
    pickaxeName: 'Copper / Tin Pickaxe',
    whereToFind: 'Common underground veins and pot/chest drops.',
    bestYLevel: 'Underground Layer (-100 to -600 ft)',
    keyCrafts: ['Iron Anvil (essential crafting station!)', 'Heavy Work Bench', 'Bucket (transports liquids)', 'Minecart Track'],
    color: '#94a3b8'
  },
  {
    id: 'silver-tungsten',
    name: 'Silver / Tungsten Ore',
    tier: 3,
    phase: 'pre-hardmode',
    counterpart: 'Silver ↔ Tungsten',
    minPickaxe: 45,
    pickaxeName: 'Iron / Lead Pickaxe',
    whereToFind: 'Mid-depth caverns and underground dirt walls.',
    bestYLevel: 'Lower Underground and upper Caverns (-400 to -1000 ft)',
    keyCrafts: ['Silver/Tungsten Pickaxe (55% power)', 'Silver/Tungsten Armor', 'Silver/Tungsten Bullets'],
    color: '#cbd5e1'
  },
  {
    id: 'gold-platinum',
    name: 'Gold / Platinum Ore',
    tier: 4,
    phase: 'pre-hardmode',
    counterpart: 'Gold ↔ Platinum',
    minPickaxe: 50,
    pickaxeName: 'Silver / Tungsten Pickaxe',
    whereToFind: 'Deep Cavern layer, often sparkling near lava pools.',
    bestYLevel: 'Deep Cavern layer (-800 to -1500 ft)',
    keyCrafts: ['Gold/Platinum Crown (crafts Slime Crown!)', 'Gold/Platinum Pickaxe (55% power, mines Demonite/Crimtane)', 'Spelunker Potions'],
    color: '#eab308'
  },
  {
    id: 'demonite-crimtane',
    name: 'Demonite / Crimtane Ore',
    tier: 5,
    phase: 'pre-hardmode',
    counterpart: 'Demonite (Corruption) ↔ Crimtane (Crimson)',
    minPickaxe: 55,
    pickaxeName: 'Gold / Platinum Pickaxe',
    whereToFind: 'Dropped by Eye of Cthulhu and Eater of Worlds / Brain of Cthulhu, or small veins in evil chasms.',
    bestYLevel: 'Evil Biome Chasms and Boss Drops',
    keyCrafts: ['Nightmare / Deathbringer Pickaxe (65% power, MINES METEORITE & HELLSTONE!)', 'Light\'s Bane / Blood Butcherer (Night\'s Edge component)', 'Shadow / Crimson Armor'],
    color: '#8b5cf6'
  },
  {
    id: 'meteorite',
    name: 'Meteorite',
    tier: 6,
    phase: 'pre-hardmode',
    counterpart: 'Crash Site Event',
    minPickaxe: 50,
    pickaxeName: 'Tungsten, Gold, or Platinum Pickaxe',
    whereToFind: 'Impact craters generated across the surface after defeating Eater of Worlds or Brain of Cthulhu.',
    bestYLevel: 'Surface Impact Site',
    keyCrafts: ['Meteor Armor (makes Space Gun cost ZERO MANA!)', 'Space Gun (rapid laser pistol)', 'Star Cannon', 'Meteor Bullets (bouncing piercing ammo)'],
    color: '#f97316'
  },
  {
    id: 'hellstone',
    name: 'Hellstone',
    tier: 7,
    phase: 'pre-hardmode',
    counterpart: 'Underworld Exclusive',
    minPickaxe: 65,
    pickaxeName: 'Nightmare or Deathbringer Pickaxe',
    whereToFind: 'Submerged in lava pools and obsidian towers in the Underworld. Smelted with Obsidian into Hellstone Bars.',
    bestYLevel: 'The Underworld bottom layer',
    keyCrafts: ['Molten Pickaxe (100% power, MINES FIRST HARDMODE ORES!)', 'Volcano sword (Night\'s Edge component)', 'Molten Armor (highest Pre-HM defense: 25)', 'Phoenix Blaster'],
    color: '#dc2626'
  },

  // HARDMODE
  {
    id: 'cobalt-palladium',
    name: 'Cobalt / Palladium Ore',
    tier: 8,
    phase: 'hardmode',
    counterpart: 'Cobalt ↔ Palladium',
    minPickaxe: 100,
    pickaxeName: 'Molten Pickaxe',
    whereToFind: 'Generated throughout Underground and Caverns upon smashing the 1st Demon/Crimson Altar with Pwnhammer.',
    bestYLevel: 'Caverns and Underground',
    keyCrafts: ['Cobalt/Palladium Pickaxe or Drill (110% power, mines Mythril/Orichalcum)', 'Palladium Armor (Rapid Healing buff)', 'Cobalt Armor'],
    color: '#0284c7',
    altarOrder: 1
  },
  {
    id: 'mythril-orichalcum',
    name: 'Mythril / Orichalcum Ore',
    tier: 9,
    phase: 'hardmode',
    counterpart: 'Mythril ↔ Orichalcum',
    minPickaxe: 110,
    pickaxeName: 'Cobalt / Palladium Pickaxe',
    whereToFind: 'Mid to deep Cavern layer upon smashing the 2nd Altar with Pwnhammer.',
    bestYLevel: 'Mid to Deep Caverns',
    keyCrafts: ['Mythril / Orichalcum Anvil (MANDATORY for all Hardmode crafting!)', 'Mythril/Orichalcum Pickaxe (135% power, mines Titanium/Adamantite)', 'Orichalcum Armor (petal swarm buff)'],
    color: '#ec4899',
    altarOrder: 2
  },
  {
    id: 'adamantite-titanium',
    name: 'Adamantite / Titanium Ore',
    tier: 10,
    phase: 'hardmode',
    counterpart: 'Adamantite ↔ Titanium',
    minPickaxe: 135,
    pickaxeName: 'Mythril / Orichalcum Pickaxe',
    whereToFind: 'Deepest Cavern layer near the Underworld lava border upon smashing the 3rd Altar.',
    bestYLevel: 'Deep Caverns just above Underworld',
    keyCrafts: ['Adamantite / Titanium Forge (smelts endgame ores!)', 'Adamantite / Titanium Armor (Titanium Barrier shard shield)', 'Class-specific helmets'],
    color: '#64748b',
    altarOrder: 3
  },
  {
    id: 'chlorophyte',
    name: 'Chlorophyte Ore',
    tier: 11,
    phase: 'hardmode',
    counterpart: 'Organic Growth',
    minPickaxe: 200,
    pickaxeName: 'Pickaxe Axe or Drax (post-3 Mech bosses)',
    whereToFind: 'Organically spawns and regenerates inside Mud blocks throughout the Underground Jungle.',
    bestYLevel: 'Underground Jungle Caverns',
    keyCrafts: ['Chlorophyte Bullets (HOMING bullets that track targets!)', 'Chlorophyte Shotbow', 'Turtle Armor (crafting ingredient for Beetle Armor)', 'Spectre / Shroomite Bars'],
    color: '#22c55e'
  },
  {
    id: 'luminite',
    name: 'Luminite',
    tier: 12,
    phase: 'hardmode',
    counterpart: 'Endgame Boss Drop',
    minPickaxe: 225,
    pickaxeName: 'Laser Drill or Picksaw',
    whereToFind: '100% drop from the Moon Lord (70-90 ore per kill). Smelted into bars at the Ancient Manipulator.',
    bestYLevel: 'Moon Lord Drops',
    keyCrafts: ['Solar Flare Armor (Melee)', 'Vortex Armor (Ranged)', 'Nebula Armor (Magic)', 'Stardust Armor (Summoner)', 'Zenith material components'],
    color: '#06b6d4'
  }
];

// -------------------------------------------------------------
// 4. UNDERGROUND & CAVERN LAYERS DATA
// -------------------------------------------------------------
export const UNDERGROUND_LAYERS: UndergroundLayerData[] = [
  {
    id: 'surface-layer',
    name: 'Surface & Purity Layer',
    depthRange: '0 feet to +1200 feet',
    characteristics: 'Sunlight, grass, trees, and sky. Background shows blue sky and distant hills.',
    structures: ['Surface Cabins', 'Living Trees', 'Dungeon Entrance', 'Ocean Trenches'],
    hazards: ['Daytime Slimes', 'Nighttime Zombies and Eyes', 'Fall damage'],
    keyResources: ['Daybloom', 'Wood', 'Surface Chests', 'Fallen Stars'],
    locatingAdvice: 'Starting zone. Dig straight down with torches to find the transition to brown dirt walls.'
  },
  {
    id: 'underground-layer',
    name: 'The Underground Layer',
    depthRange: '0 to ~500 feet below surface',
    characteristics: 'Background turns into textured brown dirt walls with embedded stones. Darkness sets in.',
    structures: ['Underground Cabins with Chests', 'Rail Tracks', 'Dart and Boulder Traps'],
    hazards: ['Boulder Traps (can one-shot you!)', 'Dart Traps', 'Mother Slime (splits into baby slimes)'],
    keyResources: ['Copper/Tin', 'Iron/Lead', 'Silver/Tungsten', 'Life Crystals (+20 max HP)'],
    locatingAdvice: 'Listen for track sounds and look for wood plank cabins containing golden chests.'
  },
  {
    id: 'cavern-layer',
    name: 'The Cavern Layer',
    depthRange: '~500 feet to bottom 200 feet',
    characteristics: 'Background changes from brown dirt to gray stone walls. Massive subterranean caves with underground water and lava lakes.',
    structures: ['Granite Caves', 'Marble Caves', 'Spider Nests', 'Underground Desert', 'Underground Jungle', 'The Aether (Shimmer)'],
    hazards: ['Lava Pools', 'Explosive Traps', 'Tim & Nymphs', 'Black Recluses (inflict Venom)'],
    keyResources: ['Gold/Platinum', 'Gems (Ruby, Diamond, Sapphire)', 'Life Crystals', 'Lava Charms'],
    locatingAdvice: 'Encompasses 60% of the entire underground. Look out for the Aether pool in the outer fifth on the Jungle side.'
  },
  {
    id: 'the-aether',
    name: 'The Aether & Shimmer Pool',
    depthRange: 'Cavern layer (Outer fifth of world)',
    characteristics: 'Starry purple-cyan celestial background with a glowing lagoon of lavender Shimmer liquid. Generates ONLY ONCE per world.',
    structures: ['Aetherium Stone blocks', 'Starry background arches', 'Shimmer Pool'],
    hazards: ['Falling into Shimmer causes Phase debuff (you fall through solid blocks until hitting empty air)'],
    keyResources: [
      'Item Uncrafting (throw crafted items in to get raw materials back!)',
      'Permanent Booster conversions (Life Crystal -> Vital Crystal, Fruit -> Aegis Fruit, Mana Crystal -> Arcane Crystal)',
      'Rod of Discord -> Rod of Harmony (infinite teleports with NO damage penalty!)',
      'Clentaminator -> Terraformer (95-tile mega beam)'
    ],
    locatingAdvice: 'Always generates on the SAME SIDE of the world as the Jungle and the Ocean! Dig down in the outer fifth of the world between the Jungle and Ocean beach until you see the starry cavern background.'
  },
  {
    id: 'spider-nests',
    name: 'Spider Nests',
    depthRange: 'Underground & Cavern layer',
    characteristics: 'Black web-covered background walls. Dense cobwebs everywhere that slow movement drastically.',
    structures: ['Web-Covered Chests', 'Cobweb clusters', 'Stylist NPC (found bound by webs)'],
    hazards: ['Wall Creepers & Black Recluses (inflict high damage and venom debuff)'],
    keyResources: ['Web Slinger grapple (8 hooks)', 'Poison Staff', 'Spider Fangs (Hardmode summoner gear)'],
    locatingAdvice: 'Bring a sword to slash webs rapidly. Use Hunter Potion to spot the Stylist NPC.'
  },
  {
    id: 'granite-marble',
    name: 'Marble & Granite Caves',
    depthRange: 'Caverns',
    characteristics: 'Smooth dark blue Granite or smooth Greek white Marble caverns with distinct mini-biome music.',
    structures: ['Marble columns & Roman structures', 'Granite clusters'],
    hazards: ['Medusa (turning to stone deals massive fall damage)', 'Hoplites (high damage javelins)'],
    keyResources: ['Medusa Head', 'Gladiator Armor', 'Granite blocks', 'Night Vision Helmet'],
    locatingAdvice: 'Stand behind blocks when Medusa appears so her gaze cannot turn you to stone.'
  }
];

// -------------------------------------------------------------
// 5. EVIL BIOMES: CRIMSON VS CORRUPTION GUIDE
// -------------------------------------------------------------
export const EVIL_BIOME_GUIDES: EvilBiomeGuide[] = [
  {
    id: 'corruption',
    name: 'The Corruption (Purple Evil)',
    color: '#8b5cf6',
    bossName: 'Eater of Worlds',
    expertAccessory: 'Worm Scarf (-17% flat damage taken)',
    exclusiveMaterial: 'Rotten Chunks, Shadow Scales, Cursed Flames',
    hardmodeSpell: 'Cursed Flames (Green fire, burns underwater, deals stacking damage over time)',
    biomeChestWeapon: 'Scourge of the Corruptor (Javelin that splits into seeking mini-eaters)',
    bossStrategy: [
      'Multi-segmented worm. Piercing attacks can hit multiple segments, producing very high damage.',
      'Fight on a surface arena or prepared underground area where you have maneuvering room.',
      'The head has the lowest defense (2) but highest damage, so prioritizing it can reduce the number of dangerous segments. However, prioritizing the tail is also a viable strategy depending on the situation and weapon type.'
    ],
    spreadBehavior: [
      'Pre-Hardmode: Spreads slowly through grass and thorn vines. Sunflowers stop surface grass spread.',
      'Hardmode: Defeating Wall of Flesh unleashes a massive diagonal V-strip of Corruption extending from Underworld to Space.',
      'Converts Stone to Ebonstone, Sand to Ebonsand, Ice to Purple Ice, and converts Mud into Corrupt Dirt (destroying Jungle!).',
      'Corrupt Thorns grow from grass up to 6 blocks away and spread corruption across gaps.'
    ],
    quarantineRules: [
      'Dig 3-tile-wide tunnels normally around the areas you want to protect.',
      'Near the surface, Corruption thorns can spread across up to 6 tiles, so a 6-tile-wide tunnel or non-corruptible lining (Wood, Hay, Dungeon Bricks, Stone Slabs) is needed there.',
      'Protect important areas such as your base, Jungle, and NPC towns rather than trying to isolate every single block.',
      'The important thing is to prevent spreading blocks from having a valid path across the quarantine; chasms and surface thorn growth need special attention.'
    ],
    purificationTools: [
      'Pre-Hardmode: Purification Powder, purchased from the Dryad for 75 copper, can cleanse Crimson and Corruption tiles.',
      'Hardmode: The Clentaminator, purchased from the Steampunker for 2 Platinum (after defeating at least one Mechanical Boss), uses Solutions such as Green Solution (15 silver) to rapidly cleanse or convert large areas with a 60-tile range.',
      'Endgame: After defeating the Moon Lord, shimmer the Clentaminator to obtain the Terraformer, which provides a 95-tile range, wider spray, and a 33% chance not to consume solution for large-scale purification.'
    ]
  },
  {
    id: 'crimson',
    name: 'The Crimson (Red Gore Evil)',
    color: '#ef4444',
    bossName: 'Brain of Cthulhu',
    expertAccessory: 'Brain of Confusion (1/6 dodge chance, +10% crit on dodge)',
    exclusiveMaterial: 'Vertebrae, Tissue Samples, Ichor',
    hardmodeSpell: 'Golden Shower (Shoots stream of Ichor, REDUCES ENEMY DEFENSE BY -15!)',
    biomeChestWeapon: 'Vampire Knives (Throws life-stealing daggers that heal you on every hit!)',
    bossStrategy: [
      'Phase 1: The Brain is invulnerable while 20 Creepers surround it. Defeat all 20 Creepers to begin Phase 2.',
      'Phase 2: The Brain becomes vulnerable, teleports rapidly, and aggressively charges the player.',
      'Expert/Master: The Brain creates 3 illusions that act as decoys. The real Brain is identifiable by its health bar and can also be distinguished using certain debuffs or minions.',
      'The Brain and Creepers are unusually susceptible to knockback, making knockback particularly useful during the fight.'
    ],
    spreadBehavior: [
      'Pre-Hardmode: Spreads through crimson grass and vicious vines. Sunflowers prevent grass expansion.',
      'Hardmode: Creates diagonal Crimson strip upon Wall of Flesh defeat.',
      'Converts Stone to Crimstone, Sand to Crimsand, Ice to Red Ice, and turns Jungle Mud into Corrupt Dirt.',
      'Crimson Thorns can grow up to 6 tiles to jump across narrow gaps.'
    ],
    quarantineRules: [
      'The current guidance recommends 3–6 tile-wide tunnels around areas you want to protect.',
      'Surface thorns are particularly important because Crimson/Corruption thorns can extend across the gap.',
      'Wood, Hay, Dungeon Bricks, Stone Slabs, etc. can be used as non-corruptible barriers; the exact setup depends on where grass/thorns are located.',
      'Sunflowers are useful pre-Hardmode because they prevent surface evil spread through grass. Once Hardmode begins, underground spread means tunnels are necessary for serious containment.'
    ],
    purificationTools: [
      'Pre-Hardmode: Purification Powder, purchased from the Dryad for 75 copper, can cleanse Crimson and Corruption tiles. (Do not confuse with Vicious Powder, which spreads Crimson!).',
      'Hardmode: The Clentaminator, purchased from the Steampunker for 2 Platinum after defeating at least one Mechanical Boss, uses Green Solution (15 silver) to rapidly cleanse or convert large areas.',
      'Endgame: After defeating the Moon Lord, shimmer the Clentaminator to obtain the Terraformer, which provides greater range and a wider spray for large-scale purification.'
    ]
  }
];
