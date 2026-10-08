/**
 * Terraria 1.4.4+ Labor of Love Tactical Guide Data
 * Comprehensive reference for Boss Progression, Biomes, Ores, Underground Layers, and Evil Biomes.
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
  icon: string; // Emoji / symbol
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
// 1. BOSS PROGRESSION DATA
// -------------------------------------------------------------
export const TERRARIA_BOSSES: BossData[] = [
  // PRE-HARDMODE
  {
    id: 'king-slime',
    name: 'King Slime',
    phase: 'pre-hardmode',
    order: 1,
    health: { classic: 2000, expert: 2800, master: 3570 },
    summonItem: 'Slime Crown',
    summonRecipe: '20 Gel + Gold/Platinum Crown at a Demon / Crimson Altar',
    spawnConditions: 'Slime Rain (kill 150 slimes), rare natural spawn in outer thirds of the map, or Slime Crown anytime.',
    arenaAdvice: [
      'Build a single horizontal platform of wooden platforms ~25-30 blocks off the ground.',
      'Rope climbing allows you to easily shoot down while out of jumping reach.',
      'Place a Campfire for passive HP regeneration (+0.5 HP/s).'
    ],
    classRecommendations: {
      melee: 'Blade of Grass, Starfury, or Amazon yoyo',
      ranged: 'Gold/Platinum Bow with Frostburn Arrows, Snowball Cannon',
      magic: 'Gem Staff (Ruby/Diamond), Wand of Sparking',
      summoner: 'Finch Staff, Slime Staff with Leather Whip',
      armor: 'Silver, Tungsten, Gold, or Platinum Armor'
    },
    keyDrops: [
      'Ninja Armor set (crit chance & speed)',
      'Slimy Saddle (fast mount, stomps enemies)',
      'Slime Hook (3-hook grapple)',
      'Royal Gel (Expert: makes all slimes friendly)'
    ],
    tactics: [
      'Teleports if you get too far away — watch for the crown disappearing into the gel mass.',
      'Spawns Spiked Slimes in Expert/Master Mode that fire projectiles; clear them periodically.',
      'Shrinks in size and speeds up as health drops below 50%.'
    ],
    icon: '👑',
    color: '#3b82f6'
  },
  {
    id: 'eye-of-cthulhu',
    name: 'Eye of Cthulhu',
    phase: 'pre-hardmode',
    order: 2,
    health: { classic: 2800, expert: 3640, master: 4641 },
    summonItem: 'Suspicious Looking Eye',
    summonRecipe: '6 Lens at a Demon / Crimson Altar',
    spawnConditions: 'Nighttime (7:30 PM). Spawns naturally once you have 200+ HP, 3+ NPCs, and 10+ Defense.',
    arenaAdvice: [
      '2 to 3 tiers of platforms spaced 4-5 blocks vertically to dodge dash attacks.',
      'Hermes Boots (or Flurry/Sailfish) are essential for outrunning Phase 2 charges.',
      'Place Campfires and Heart Lanterns across the arena for stacking regeneration.'
    ],
    classRecommendations: {
      melee: 'Enchanted Sword, Starfury, or Falcon Blade',
      ranged: 'Silver/Gold Bow with Flaming or Jester Arrows',
      magic: 'Ruby / Diamond Staff, Thunder Zapper',
      summoner: 'Flinx Fur Coat with Flinx Staff & Snapthorn whip',
      armor: 'Gold / Platinum Armor or Jungle Armor'
    },
    keyDrops: [
      'Demonite Ore (Corruption) or Crimtane Ore (Crimson)',
      'Unholy Arrows, Corrupt / Crimson Seeds',
      'Binoculars (extended zoom)',
      'Shield of Cthulhu (Expert: essential double-tap dash attack with invulnerability frames)'
    ],
    tactics: [
      'Phase 1: Summons Servants of Cthulhu. Kill them quickly for Heart pickups.',
      'Phase 2 (Below 50% HP): Sheds iris to reveal mouth, charge damage spikes.',
      'In Expert/Master Mode, performs consecutive high-speed zig-zag dash chains; use Shield of Cthulhu or Hermes Boots to sidestep vertically.'
    ],
    icon: '👁️',
    color: '#ef4444'
  },
  {
    id: 'eater-of-worlds',
    name: 'Eater of Worlds',
    phase: 'pre-hardmode',
    order: 3,
    health: { classic: 10050, expert: 15120, master: 19296 },
    summonItem: 'Worm Food',
    summonRecipe: '30 Vile Powder + 15 Rotten Chunks at a Demon Altar',
    spawnConditions: 'Smash 3 Shadow Orbs in the Corruption chasm or use Worm Food in the Corruption.',
    arenaAdvice: [
      'Build wide wooden platforms on the surface or a prepared underground area.',
      'Avoid fighting in tight enclosed tunnels that trap you between multiple segments.',
      'Piercing attacks can hit multiple segments, producing very high damage.'
    ],
    classRecommendations: {
      melee: 'Ball O\' Hurt (flail), Blade of Grass, Terragrim',
      ranged: 'Demon Bow with Jester\'s Arrows, Grenades, Molotov Cocktails',
      magic: 'Vilethorn (pierces multiple segments), Demon Scythe',
      summoner: 'Snapthorn with Imp Staff or Vampire Frog Staff',
      armor: 'Shadow Armor or Ancient Shadow Armor'
    },
    keyDrops: [
      'Shadow Scales (crafts Nightmare Pickaxe & Shadow Armor)',
      'Demonite Ore',
      'Eater\'s Bone (Baby Eater pet)',
      'Worm Scarf (Expert: permanent flat -17% damage reduction)'
    ],
    tactics: [
      'Multi-segmented worm. Piercing attacks can hit multiple segments, producing very high damage.',
      'Kill head segments whenever possible to reduce overall damage output.',
      'Worm divides into independent smaller worms whenever a mid-body segment dies.'
    ],
    icon: 'Worm',
    color: '#8b5cf6'
  },
  {
    id: 'brain-of-cthulhu',
    name: 'Brain of Cthulhu',
    phase: 'pre-hardmode',
    order: 4,
    health: { classic: 1250, expert: 2125, master: 2709 },
    summonItem: 'Bloody Spine',
    summonRecipe: '30 Vicious Powder + 15 Vertebrae at a Crimson Altar',
    spawnConditions: 'Smash 3 Crimson Hearts in Crimson chasms or use Bloody Spine in the Crimson.',
    arenaAdvice: [
      'Clear out the large central cavern inside the Crimson chasm and line with platform rows.',
      'Use Campfires and Sunflowers (+10% move speed) to maneuver around Creepers.',
      'Spike Balls or Crimson Rod clouds dropped in the center damage swarms continuously.'
    ],
    classRecommendations: {
      melee: 'The Rotted Fork (spear knockback), Falcon Blade, Code 1 Yoyo',
      ranged: 'The Undertaker, Boomstick, Tendon Bow with Frostburn Arrows',
      magic: 'Crimson Rod (blood rain cloud), Ruby/Diamond Staff',
      summoner: 'Snapthorn whip + Vampire Frog Staff',
      armor: 'Crimson Armor (massive health regeneration)'
    },
    keyDrops: [
      'Tissue Samples (crafts Deathbringer Pickaxe & Crimson Armor)',
      'Crimtane Ore',
      'The Meatball (Flail)',
      'Brain of Confusion (Expert: 1/6 chance to dodge attacks, grants +10% crit on dodge)'
    ],
    tactics: [
      'Phase 1: The Brain is invulnerable while 20 Creepers surround it. Defeat all 20 Creepers to begin Phase 2.',
      'Phase 2: The Brain becomes vulnerable, teleports rapidly, and aggressively charges the player.',
      'Expert/Master: The Brain creates 3 illusions that act as decoys. The real Brain is identifiable by its health bar and debuff/minion indicators.',
      'The Brain and Creepers are unusually susceptible to knockback, making knockback weapons particularly effective.'
    ],
    icon: 'Brain',
    color: '#dc2626'
  },
  {
    id: 'queen-bee',
    name: 'Queen Bee',
    phase: 'pre-hardmode',
    order: 5,
    health: { classic: 3400, expert: 4760, master: 6069 },
    summonItem: 'Abeemination',
    summonRecipe: '5 Honey Blocks + 1 Stinger + 5 Hive Blocks + 1 Bottled Honey (craft by hand)',
    spawnConditions: 'Break a Larva inside a Jungle Beehive, or use Abeemination anywhere in the Jungle.',
    arenaAdvice: [
      'Do NOT submerge yourself in deep honey; leave 1-tile honey dips for the 30-second honey regeneration buff.',
      'Flatten the hive floor with 2 platform tiers and clear cobwebs so mobility is never impaired.',
      'Beaker / Heart Lanterns and Bezoar accessory (poison immunity) are life-savers.'
    ],
    classRecommendations: {
      melee: 'Blade of Grass, Amazon, Thorn Chakram',
      ranged: 'Minishark with Silver/Meteor Bullets, Boomstick, Tendon/Demon Bow',
      magic: 'Space Gun with Meteor Armor, Vilethorn, Gray Zapinator',
      summoner: 'Hornet Staff, Snapthorn + Imp Staff',
      armor: 'Meteor Armor, Jungle Armor, or Shadow/Crimson Armor'
    },
    keyDrops: [
      'Beenade (demolishes the Wall of Flesh!)',
      'Bee Gun (magic piercing bees)',
      'Bee Keeper (sword that spawns killer bees)',
      'Hive Pack (Expert: upgrades friendly bees into giant bees)',
      'Witch Doctor NPC unlocks'
    ],
    tactics: [
      'Alternates between horizontal swoops (dodge by jumping over her) and hovering while firing stingers/small bees.',
      'Bezoar accessory completely negates her poison debuff.',
      'As her HP drops, horizontal charge speed drastically increases.'
    ],
    icon: '🐝',
    color: '#eab308'
  },
  {
    id: 'skeletron',
    name: 'Skeletron',
    phase: 'pre-hardmode',
    order: 6,
    health: { classic: 4400, expert: 8800, master: 11220 },
    summonItem: 'Curse Speaker / Clothier Voodoo Doll',
    summonRecipe: 'Speak to the Old Man at the Dungeon entrance at night and select "Curse".',
    spawnConditions: 'Nighttime at the Dungeon entrance. Must be killed before dawn (4:30 AM) or he enrages into a one-hit Dungeon Guardian.',
    arenaAdvice: [
      'Build a wide 3-layer platform arena extending over the Dungeon entrance rooftop.',
      'Space platforms 5-6 blocks apart to easily drop down or grapple upward.',
      'Place Campfires, Heart Lanterns, and Star in Bottles along the entire run.'
    ],
    classRecommendations: {
      melee: 'Molten Fury, Volcano (Fiery Greatsword), Thorn Chakram',
      ranged: 'Molten Fury with Hellfire/Frostburn Arrows, Minishark',
      magic: 'Space Gun (with Meteor Armor), Demon Scythe, Flamelash',
      summoner: 'Imp Staff, Spinal Tap whip',
      armor: 'Meteor Armor, Necro Armor, or Molten Armor'
    },
    keyDrops: [
      'Dungeon Entry access (no more Dungeon Guardian instant-kill)',
      'Book of Skulls, Skeletron Hand hook',
      'Bone Glove (Expert: tosses bones that ricochet)'
    ],
    tactics: [
      'In Expert/Master Mode, Skeletron has 9999 defense while hands are alive! Kill BOTH hands first.',
      'Once both hands are destroyed, the head shoots homing cursed skulls; run in a circular orbit to avoid them.',
      'Spinning head attack deals massive damage but drops his defense to 0; unload your highest DPS weapons.'
    ],
    icon: '💀',
    color: '#94a3b8'
  },
  {
    id: 'deerclops',
    name: 'Deerclops',
    phase: 'pre-hardmode',
    order: 7,
    health: { classic: 7000, expert: 11900, master: 15172 },
    summonItem: 'Deer Thing',
    summonRecipe: '3 Flinx Fur + 1 Lens + 5 Demonite/Crimtane Ore at a Demon/Crimson Altar',
    spawnConditions: 'Snow biome during a Blizzard at midnight, or Deer Thing used in the Snow biome.',
    arenaAdvice: [
      'Build a flat arena with fire pits and Warmth Potions (reduces cold damage by 30%).',
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
      'Eyebrella (rain protection & cloud weather)',
      'Houndius Shootius (sentry turret)',
      'Bone Helm (Expert: summons shadow hands against nearby enemies)'
    ],
    tactics: [
      'Immune to damage while you are more than 30 tiles away (shadow fog surrounds him).',
      'Ice spikes erupt from the ground in the direction he faces; jump over him to land behind.',
      'Periodically roars to inflict Slow/Chilled debuff on nearby targets.'
    ],
    icon: '🦌',
    color: '#06b6d4'
  },
  {
    id: 'wall-of-flesh',
    name: 'Wall of Flesh',
    phase: 'pre-hardmode',
    order: 8,
    health: { classic: 8000, expert: 11200, master: 14280 },
    summonItem: 'Guide Voodoo Doll',
    summonRecipe: 'Drop Guide Voodoo Doll into Underworld lava while the Guide NPC is alive.',
    spawnConditions: 'The Underworld (Hell). Sweeps across the entire world in the direction you faced when throwing the doll.',
    arenaAdvice: [
      'Build a continuous flat wooden bridge / minecart track spanning 1000-2000 blocks across the Underworld.',
      'Clear out obsidian building roofs so you never hit a wall while backpedaling.',
      'Place Campfires every 50 blocks. Use Water Walking Boots or Obsidian Skin Potions for accidental lava dips.'
    ],
    classRecommendations: {
      melee: 'Night\'s Edge (insane sweep attack for The Hungry), Sunfury',
      ranged: 'Beenades (100+ Beenades melt him!), Phoenix Blaster, Hellwing Bow',
      magic: 'Demon Scythe (pre-cast spinning blades), Water Bolt',
      summoner: 'Spinal Tap + Imp Staff',
      armor: 'Molten Armor (Melee), Necro Armor (Ranged), Meteor Armor (Magic)'
    },
    keyDrops: [
      'Pwnhammer (smashes Demon/Crimson Altars to spawn Hardmode ores!)',
      'Warrior / Ranger / Sorcerer / Summoner Emblem (+15% damage)',
      'Breaker Blade, Clockwork Assault Rifle, Laser Rifle',
      'Demon Heart (Expert: permanent +1 accessory slot!)',
      'HARDMODE UNLOCKED!'
    ],
    tactics: [
      'Aim for the eyes: they have 0 defense, while the mouth has 12 defense.',
      'Kill "The Hungry" tentacles early; they drop healing hearts to replenish your health.',
      'As WoF reaches low HP, its movement speed accelerates faster than Hermes Boots; use Swiftness Potions and Bunny Mount.'
    ],
    icon: '🥩',
    color: '#f43f5e'
  },

  // HARDMODE
  {
    id: 'queen-slime',
    name: 'Queen Slime',
    phase: 'hardmode',
    order: 9,
    health: { classic: 18000, expert: 28800, master: 36720 },
    summonItem: 'Gelatin Crystal',
    summonRecipe: 'Found glowing in the Underground Hallow crystal farm; use in the Hallow.',
    spawnConditions: 'Use Gelatin Crystal in the Hallow (Day or Night).',
    arenaAdvice: [
      'Build a very high 2-tier platform arena in the Hallow.',
      'Wing mobility (Fairy Wings, Harpy Wings) or a high-speed mount (Gelatinous Pillion) is required.',
      'Wide arenas allow dodging her high-bouncing stomps.'
    ],
    classRecommendations: {
      melee: 'Shadowflame Knife, Dao of Pow, Amarok yoyo',
      ranged: 'Daedalus Stormbow with Holy Arrows, Megashark',
      magic: 'Meteor Staff, Crystal Serpent, Spirit Flame',
      summoner: 'Sanguine Staff / Blade Staff with Cool Whip',
      armor: 'Titanium or Adamantite Armor'
    },
    keyDrops: [
      'Gelatinous Pillion (flying slime mount with fast fall stomps)',
      'Hook of Dissonance (instant teleportation grapple)',
      'Volatile Gelatin (Expert: periodic explosive slime fires)'
    ],
    tactics: [
      'Phase 1: Bounces aggressively and shoots crystal shards in 6 directions.',
      'Spawns 3 types of mini slimes: Heavenly (flies), Bouncy (shards), and Crystal (spikes).',
      'Phase 2 (Below 50% HP): Sprouts wings and takes to the skies; run laterally to dodge aerial projectile barrages.'
    ],
    icon: '💎',
    color: '#ec4899'
  },
  {
    id: 'the-destroyer',
    name: 'The Destroyer',
    phase: 'hardmode',
    order: 10,
    health: { classic: 85000, expert: 127500, master: 162562 },
    summonItem: 'Mechanical Worm',
    summonRecipe: '6 Rotten Chunks / Vertebrae + 5 Iron/Lead Bars + 6 Souls of Night at Mythril/Orichalcum Anvil',
    spawnConditions: 'Nighttime (7:30 PM). Spawns naturally after smashing an altar, or via Mechanical Worm.',
    arenaAdvice: [
      'Build an elevated wooden box platform 30-40 blocks in the air so his body cannot reach you.',
      'Daedalus Stormbow or Nimbus Rod rain down continuous piercing hits through his 80+ segments.',
      'Enclose the sides with platforms to avoid lateral red laser spam from probes.'
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
      'Each segment destroyed releases a Probe that flies and shoots lasers; kill Probes immediately to collect healing hearts.',
      'Immune to ALL debuffs (including Ichor/Cursed Flames).',
      'Piercing weapons hit dozens of segments in a single shot, melting his 85k HP in seconds.'
    ],
    icon: '🦾',
    color: '#0284c7'
  },
  {
    id: 'the-twins',
    name: 'The Twins',
    phase: 'hardmode',
    order: 11,
    health: { classic: 43000, expert: 64500, master: 82237 },
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
    icon: '👀',
    color: '#10b981'
  },
  {
    id: 'skeletron-prime',
    name: 'Skeletron Prime',
    phase: 'hardmode',
    order: 12,
    health: { classic: 59000, expert: 88500, master: 112837 },
    summonItem: 'Mechanical Skull',
    summonRecipe: '30 Bones + 5 Iron/Lead Bars + 3 Souls of Light + 3 Souls of Night',
    spawnConditions: 'Nighttime via Mechanical Skull. Must be killed before 4:30 AM dawn.',
    arenaAdvice: [
      '3-4 tiers of wooden platforms with ample vertical headroom.',
      'Wings and Shield of Cthulhu / Master Ninja Gear allow orbiting around his 4 swinging arms.',
      'Golden Shower book provides continuous -15 defense Ichor debuff.'
    ],
    classRecommendations: {
      melee: 'Yelets, Shadowflame Knife, Dao of Pow',
      ranged: 'Megashark with Crystal / Ichor Bullets',
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
    icon: '☠️',
    color: '#64748b'
  },
  {
    id: 'plantera',
    name: 'Plantera',
    phase: 'hardmode',
    order: 13,
    health: { classic: 30000, expert: 42000, master: 53550 },
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
      ranged: 'Megashark with Chlorophyte/Crystal Bullets, Chlorophyte Shotbow with Holy Arrows',
      magic: 'Venom Staff, Rainbow Gun, Magical Harp',
      summoner: 'Optic Staff, Sanguine Staff with Durendal',
      armor: 'Chlorophyte or Turtle Armor, Hallowed Armor'
    },
    keyDrops: [
      'Temple Key (unlocks Jungle Lihzahrd Temple)',
      'Seedler, The Axe (guitar hammer), Grenade Launcher, Venus Magnum',
      'Spore Sac (Expert: spores surround you)',
      'Dungeon Post-Plantera enemy & loot unlock!'
    ],
    tactics: [
      'Phase 1: Shoots seeds, poison seeds, and bouncy thorn balls. Stay above the thorn balls at the bottom of the arena.',
      'Phase 2 (Below 50% HP): Sheds flower petals, releases dozens of fast biting tentacles, and gains massive speed.',
      'Use Circling movement patterns around the arena perimeter to stay ahead of the tentacles.'
    ],
    icon: '🌸',
    color: '#10b981'
  },
  {
    id: 'golem',
    name: 'Golem',
    phase: 'hardmode',
    order: 14,
    health: { classic: 39000, expert: 58500, master: 74587 },
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
    icon: '🗿',
    color: '#d97706'
  },
  {
    id: 'empress-of-light',
    name: 'Empress of Light',
    phase: 'hardmode',
    order: 15,
    health: { classic: 70000, expert: 98000, master: 124950 },
    summonItem: 'Prismatic Lacewing',
    summonRecipe: 'Catch Prismatic Lacewing butterfly in surface Hallow from 7:30 PM to 12:00 AM using a Bug Net.',
    spawnConditions: 'Kill a Prismatic Lacewing in any biome. (If fought during daytime, all her attacks deal INSTANT 99999 KILL!).',
    arenaAdvice: [
      'Extremely long skybridge (2000+ blocks) with Asphalt or Blessed Apple / Witch\'s Broom mount.',
      'Vertical mobility from Fishron Wings / Empress Wings or Soaring Insignia.',
      'Memorize her strictly scripted bullet hell attack patterns.'
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
      'Soaring Insignia (Expert: INFINITE wing flight time!)'
    ],
    tactics: [
      'Attacks: Prismatic Bolts, Dash, Sun Dance, Everlasting Rainbow, Ethereal Lance (swords).',
      'During Ethereal Lance, watch the sword trajectory lines and step out of the beam path before they fire.',
      'Daytime fight rewards Terraprisma, the strongest summoner weapon in Terraria.'
    ],
    icon: '✨',
    color: '#c084fc'
  },
  {
    id: 'duke-fishron',
    name: 'Duke Fishron',
    phase: 'hardmode',
    order: 16,
    health: { classic: 60000, expert: 70000, master: 89250 },
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
    icon: '🦈',
    color: '#06b6d4'
  },
  {
    id: 'lunatic-cultist',
    name: 'Lunatic Cultist',
    phase: 'hardmode',
    order: 17,
    health: { classic: 32000, expert: 48000, master: 61200 },
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
    icon: '🔮',
    color: '#8b5cf6'
  },
  {
    id: 'moon-lord',
    name: 'Moon Lord',
    phase: 'hardmode',
    order: 18,
    health: { classic: 145000, expert: 217500, master: 277312 },
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
    icon: '🪐',
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
    overview: 'The starting surface biome of every world. Peaceful by day with Green/Blue Slimes, hostile by night with Zombies and Demon Eyes. Ideal location for main town hub.',
    keyEnemies: ['Green/Blue Slime', 'Zombie', 'Demon Eye', 'Blood Zombie (Blood Moon)', 'Goblin Scout (outer thirds)'],
    uniqueLoot: ['Daybloom herbs', 'Wood & Acorns', 'Surface Chests (Hermes Boots, Aglet, Blowpipe)', 'Sunflower (blocks evil grass)'],
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
    name: 'Desert & Pyramids',
    layer: 'surface',
    color: '#eab308',
    bannerBg: 'from-amber-950 to-yellow-900',
    overview: 'Barren arid landscape characterized by Sand, Cacti, Antlions, and dangerous Sandstorms. Conceals rare Sandstone Pyramids with top-tier mobility loot.',
    keyEnemies: ['Antlion', 'Antlion Charger', 'Antlion Swarmer', 'Vulture', 'Tumbleweed', 'Sand Elemental (Hardmode)'],
    uniqueLoot: ['Waterleaf herbs', 'Cactus', 'Pyramid Chests (Flying Carpet, Sandstorm in a Bottle, Pharaoh\'s Mask)', 'Bast Statue (+5 defense aura)'],
    fishingCatches: ['Oasis Crate', 'Mirage Crate', 'Flounder', 'Rock Lobster'],
    npcPreferences: ['Dye Trader', 'Arms Dealer', 'Steampunker'],
    criticalTips: [
      'Sandstorm events feature powerful wind currents and Sand Sharks; stay underground if undergeared.',
      'Pyramids contain secret tunnel entrances covered by a single layer of sand; look for vertical sandstone shafts.',
      'Collect Bast Statues from chests to boost town and boss arena defense by +5.'
    ]
  },
  {
    id: 'snow',
    name: 'Snow & Tundra',
    layer: 'surface',
    color: '#38bdf8',
    bannerBg: 'from-sky-950 to-cyan-900',
    overview: 'Sub-zero biome on the opposite side of the world from the Desert/Jungle. Water causes the Chilled/Freezing debuff. Conceals Ice Caves with ice mobility accessories.',
    keyEnemies: ['Ice Slime', 'Zombie Eskimo', 'Wolf', 'Spiked Ice Slime', 'Ice Golem (Hardmode Blizzard)'],
    uniqueLoot: ['Shiverthorn herbs', 'Boreal Wood', 'Ice Chests (Ice Boomerang, Ice Skates, Blizzard in a Bottle)', 'Frozen Key (Hardmode)'],
    fishingCatches: ['Atlantic Cod', 'Frost Minnow', 'Frozen Crate', 'Boreal Crate'],
    npcPreferences: ['Cyborg', 'Goblin Tinkerer', 'Santa Claus', 'Mechanic'],
    criticalTips: [
      'Ice Skates prevent ice from breaking when landing and allow full movement speed on slippery ice.',
      'Blizzard in a Bottle provides the highest single-jump boost of all early-game cloud bottles.',
      'Defeat Ice Golems during Hardmode blizzards to get Frost Cores for Frost Armor.'
    ]
  },
  {
    id: 'jungle',
    name: 'Surface & Underground Jungle',
    layer: 'special',
    color: '#10b981',
    bannerBg: 'from-emerald-950 to-teal-900',
    overview: 'The richest, most dangerous natural biome in Terraria. Rich mud foundation, towering Mahogany trees, massive Beehives, and the subterranean Jungle Temple.',
    keyEnemies: ['Snatcher', 'Hornet', 'Man Eater', 'Jungle Creeper', 'Derpling (Hardmode)', 'Giant Tortoise (Hardmode 200+ dmg!)'],
    uniqueLoot: ['Moonglow herbs', 'Rich Mahogany', 'Jungle Spores', 'Stinger', 'Boomstick', 'Anklet of the Wind', 'Staff of Regrowth'],
    fishingCatches: ['Neon Tetra', 'Variegated Lardfish', 'Jungle Crate', 'Bramble Crate'],
    npcPreferences: ['Dryad', 'Painter', 'Witch Doctor'],
    criticalTips: [
      'NEVER let the Crimson or Corruption reach the Jungle! In Pre-1.4.4, evil converted Jungle mud into dirt permanently.',
      'Dig a 3-block wide quarantine trench lined with wood around your Jungle borders.',
      'Chlorophyte Ore regenerates naturally in Jungle mud during Hardmode; build underground mud grids to farm it.'
    ]
  },
  {
    id: 'ocean',
    name: 'The Ocean (Left & Right Edges)',
    layer: 'surface',
    color: '#0284c7',
    bannerBg: 'from-blue-950 to-cyan-950',
    overview: 'Bordering both extremities of the world. Home to deep seabed trenches, Shark hunting grounds, Duke Fishron summons, and the sleeping Angler NPC.',
    keyEnemies: ['Shark', 'Crab', 'Pink Jellyfish', 'Sea Snail'],
    uniqueLoot: ['Water Walking Boots', 'Diving Helmet', 'Shark Tooth Necklace (+5 armor penetration)', 'Trident', 'Coral'],
    fishingCatches: ['Reaver Shark (Pickaxe)', 'Sawtooth Shark (Chainsaw)', 'Swordfish', 'Ocean Crate', 'Bottomless Water Bucket'],
    npcPreferences: ['Angler', 'Pirate'],
    criticalTips: [
      'Look for the sleeping Angler floating on the water surface on your first visit to unlock fishing quests.',
      'Water Walking Potion or Water Walking Boots enable easy platform-free traversal across the ocean surface.',
      'Sharks drop Shark Fins needed for Megashark, Hunter Potions, and Water Walking Potions.'
    ]
  },
  {
    id: 'sky-islands',
    name: 'Space & Floating Islands',
    layer: 'surface',
    color: '#a855f7',
    bannerBg: 'from-purple-950 to-indigo-950',
    overview: 'High-altitude floating islands made of Sunplate and Cloud blocks. Floating Lakes provide pristine sky fishing. High gravity drops and Harpies/Wyverns roam the skies.',
    keyEnemies: ['Harpy (feathers for early wings)', 'Wyvern (Hardmode: drops Souls of Flight)', 'Arch Wyvern'],
    uniqueLoot: ['Skyware Chests: Starfury (star-falling sword), Lucky Horseshoe (negates fall damage), Shiny Red Balloon (+75% jump)'],
    fishingCatches: ['Damselfish', 'Sky Crate', 'Azure Crate'],
    npcPreferences: ['Tavernkeep'],
    criticalTips: [
      'Drink a Gravitation Potion and fly across the upper third of the map to easily discover all floating islands.',
      'Alternatively, shoot Water Bolt / Meteor bullets upward: ricocheting projectiles signal an island directly overhead.',
      'Collect 20 Harpy Feathers and 20 Souls of Flight to craft your first pair of wings immediately in Hardmode.'
    ]
  },
  {
    id: 'underworld',
    name: 'The Underworld (Hell)',
    layer: 'underground',
    color: '#dc2626',
    bannerBg: 'from-rose-950 to-red-950',
    overview: 'The fiery bedrock layer of the world. Features vast lava seas, Ruined Obsidian Towers, Demon Voodoo Doll carriers, and Hellstone veins.',
    keyEnemies: ['Demon', 'Voodoo Demon', 'Fire Imp', 'Hellbat', 'Lava Slime', 'Red Devil (Hardmode)'],
    uniqueLoot: ['Hellstone & Obsidian', 'Shadow Chests (Dark Lance, Sunfury, Flamelash, Flower of Fire)', 'Hellforge'],
    fishingCatches: ['Obsidian Crate', 'Hellstone Crate', 'Obsidian Swordfish', 'Demon Conch (teleports to Hell)'],
    npcPreferences: ['Demolitionist', 'Tax Collector (purified from Tortured Soul)'],
    criticalTips: [
      'NEVER kill a Voodoo Demon over lava unless you are ready to summon the Wall of Flesh instantly!',
      'Drink an Obsidian Skin Potion to swim immunity through lava while mining Hellstone.',
      'Mine an intact Hellforge from ruined houses; it is required to smelt Hellstone and Hardmode ores.'
    ]
  },
  {
    id: 'glowing-mushroom',
    name: 'Glowing Mushroom Biome',
    layer: 'special',
    color: '#06b6d4',
    bannerBg: 'from-cyan-950 to-blue-950',
    overview: 'Bioluminescent fungal biome with glowing blue vegetation. Found underground naturally, but can be built on the surface in Hardmode for the Truffle NPC.',
    keyEnemies: ['Spore Zombie', 'Anomura Fungus', 'Mushi Ladybug', 'Fungi Bulb'],
    uniqueLoot: ['Glowing Mushrooms', 'Mushroom Grass Seeds', 'Mushroom Chests (Shroomerang)', 'Truffle Worm (Hardmode bait)'],
    fishingCatches: ['Amanita Fungifin', 'Glowing Mushroom Crate'],
    npcPreferences: ['Truffle (Surface Mushroom Biome required)'],
    criticalTips: [
      'Collect Mushroom Grass Seeds and plant on Mud blocks on the surface to create an artificial surface mushroom biome.',
      'Surface Mushroom biome houses the Truffle NPC, who sells the Autohammer for Shroomite armor.',
      'Use an Invisibility Potion with a Bug Net to safely catch Truffle Worms without alerting them.'
    ]
  }
];

// -------------------------------------------------------------
// 3. ORES & MINING TIERS DATA
// -------------------------------------------------------------
export const TERRARIA_ORES: OreData[] = [
  // PRE-HARDMODE
  {
    id: 'copper-tin',
    name: 'Copper / Tin',
    tier: 1,
    phase: 'pre-hardmode',
    counterpart: 'Copper ↔ Tin',
    minPickaxe: 35,
    pickaxeName: 'Any Starter Pickaxe',
    whereToFind: 'Surface cliffs, dirt tunnels, and shallow underground.',
    bestYLevel: 'Surface to Shallow Underground',
    keyCrafts: ['Copper/Tin Broadsword', 'Copper/Tin Bow', 'Copper Watch (clock recipes)'],
    color: '#d97706'
  },
  {
    id: 'iron-lead',
    name: 'Iron / Lead',
    tier: 2,
    phase: 'pre-hardmode',
    counterpart: 'Iron ↔ Lead',
    minPickaxe: 40,
    pickaxeName: 'Copper/Tin Pickaxe',
    whereToFind: 'Underground and Cavern layers. Look in cave pockets.',
    bestYLevel: 'Underground layer (middle depth)',
    keyCrafts: ['Iron/Lead Anvil (essential workstation!)', 'Heavy Work Bench', 'Bucket (water/lava manipulation)', 'Chain'],
    color: '#94a3b8'
  },
  {
    id: 'silver-tungsten',
    name: 'Silver / Tungsten',
    tier: 3,
    phase: 'pre-hardmode',
    counterpart: 'Silver ↔ Tungsten',
    minPickaxe: 45,
    pickaxeName: 'Iron/Lead Pickaxe',
    whereToFind: 'Cavern layer. Spawns frequently around underground cabins.',
    bestYLevel: 'Deep Caverns',
    keyCrafts: ['Silver/Tungsten Armor', 'Silver/Tungsten Bow', 'Silver Bullets (pierces enemies)'],
    color: '#cbd5e1'
  },
  {
    id: 'gold-platinum',
    name: 'Gold / Platinum',
    tier: 4,
    phase: 'pre-hardmode',
    counterpart: 'Gold ↔ Platinum',
    minPickaxe: 55,
    pickaxeName: 'Silver/Tungsten Pickaxe',
    whereToFind: 'Deep Caverns near the Underworld border and Sky Islands.',
    bestYLevel: 'Deepest Caverns just above Hell',
    keyCrafts: ['Gold/Platinum Crown (King Slime summon)', 'Gold/Platinum Pickaxe (mines Meteorite!)', 'Ruby Staff'],
    color: '#eab308'
  },
  {
    id: 'demonite-crimtane',
    name: 'Demonite / Crimtane',
    tier: 5,
    phase: 'pre-hardmode',
    counterpart: 'Demonite (Corruption) ↔ Crimtane (Crimson)',
    minPickaxe: 55,
    pickaxeName: 'Gold / Platinum Pickaxe',
    whereToFind: 'Veins in Corruption/Crimson chasms, but primarily dropped in bulk by Eye of Cthulhu & EoW/BoC.',
    bestYLevel: 'Chasm walls / Boss drops',
    keyCrafts: ['Nightmare/Deathbringer Pickaxe (mines Hellstone!)', 'Demon/Tendon Bow', 'Light\'s Bane / Blood Butcherer'],
    color: '#8b5cf6'
  },
  {
    id: 'meteorite',
    name: 'Meteorite',
    tier: 6,
    phase: 'pre-hardmode',
    counterpart: 'N/A (Crashed Site)',
    minPickaxe: 50,
    pickaxeName: 'Tungsten, Gold, or Platinum Pickaxe',
    whereToFind: 'Crashes onto the surface after smashing at least one Shadow Orb / Crimson Heart.',
    bestYLevel: 'Surface Impact Site Crater',
    keyCrafts: ['Space Gun (0 mana with Meteor Armor!)', 'Meteor Armor set', 'Meteor Bullets (ricochets & pierces)'],
    color: '#f97316'
  },
  {
    id: 'hellstone',
    name: 'Hellstone',
    tier: 7,
    phase: 'pre-hardmode',
    counterpart: 'N/A (The Underworld)',
    minPickaxe: 65,
    pickaxeName: 'Nightmare / Deathbringer Pickaxe',
    whereToFind: 'Underworld ash and submerged lava beds. Inflicts burning when touched and releases lava when broken.',
    bestYLevel: 'The Underworld',
    keyCrafts: ['Molten Pickaxe (100% power: MINES FIRST HARDMODE ORES!)', 'Volcano / Fiery Greatsword', 'Molten Armor', 'Molten Fury bow'],
    color: '#ef4444'
  },

  // HARDMODE
  {
    id: 'cobalt-palladium',
    name: 'Cobalt / Palladium',
    tier: 8,
    phase: 'hardmode',
    counterpart: 'Cobalt ↔ Palladium',
    minPickaxe: 100,
    pickaxeName: 'Molten Pickaxe',
    whereToFind: 'Spawns across Underground & Caverns upon smashing the 1st Demon / Crimson Altar with Pwnhammer.',
    bestYLevel: 'Underground & Upper Caverns',
    keyCrafts: ['Cobalt/Palladium Pickaxe/Drill (mines Mythril/Orichalcum!)', 'Cobalt/Palladium Armor (Palladium grants rapid regen)'],
    color: '#3b82f6',
    altarOrder: 1
  },
  {
    id: 'mythril-orichalcum',
    name: 'Mythril / Orichalcum',
    tier: 9,
    phase: 'hardmode',
    counterpart: 'Mythril ↔ Orichalcum',
    minPickaxe: 110,
    pickaxeName: 'Cobalt / Palladium Pickaxe',
    whereToFind: 'Spawns across Caverns upon smashing the 2nd Demon / Crimson Altar.',
    bestYLevel: 'Mid to Deep Caverns',
    keyCrafts: ['Mythril/Orichalcum Anvil (essential Hardmode crafting station!)', 'Mythril/Orichalcum Pickaxe (mines Adamantite/Titanium)'],
    color: '#10b981',
    altarOrder: 2
  },
  {
    id: 'adamantite-titanium',
    name: 'Adamantite / Titanium',
    tier: 10,
    phase: 'hardmode',
    counterpart: 'Adamantite ↔ Titanium',
    minPickaxe: 150,
    pickaxeName: 'Mythril / Orichalcum Pickaxe',
    whereToFind: 'Deepest Cavern layer near the Underworld lava border upon smashing the 3rd Altar.',
    bestYLevel: 'Deep Caverns just above Underworld',
    keyCrafts: ['Adamantite/Titanium Forge (smelts endgame ores!)', 'Adamantite/Titanium Armor (Titanium Barrier shard buff)'],
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
    whereToFind: 'Spawns and organically regenerates inside Mud blocks throughout the Underground Jungle.',
    bestYLevel: 'Underground Jungle Caverns',
    keyCrafts: ['Chlorophyte Bullets (HOMING bullets!)', 'Chlorophyte Shotbow', 'Turtle Armor (pre-Beetle)', 'Spectre/Shroomite bars'],
    color: '#22c55e'
  },
  {
    id: 'luminite',
    name: 'Luminite',
    tier: 12,
    phase: 'hardmode',
    counterpart: 'Endgame Boss Drop',
    minPickaxe: 225,
    pickaxeName: 'Laser Drill / Picksaw',
    whereToFind: '100% drop from the Moon Lord (70-90 ore per kill). Smelted into bars at Ancient Manipulator.',
    bestYLevel: 'Moon Lord Drops',
    keyCrafts: ['Solar Flare Armor', 'Vortex Armor', 'Nebula Armor', 'Stardust Armor', 'Solar/Vortex/Nebula/Stardust Pickaxes'],
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
    structures: ['Underground Cabins with Chests', 'Rail Tracks', 'Traps (Dart & Boulders)'],
    hazards: ['Boulder Traps (can one-shot you!)', 'Dart Traps', 'Mother Slime (splits into baby slimes)'],
    keyResources: ['Copper/Tin', 'Iron/Lead', 'Silver/Tungsten', 'Life Crystals (+20 max HP)'],
    locatingAdvice: 'Listen for track sounds and look for wood plank structures containing golden chests.'
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
    hardmodeSpell: 'Cursed Flames (Green fire, burns underwater, damages enemies over time)',
    biomeChestWeapon: 'Scourge of the Corruptor (Javelin that splits into seeking mini-eaters)',
    bossStrategy: [
      'Multi-segmented worm. Piercing attacks can hit multiple segments, producing very high damage.',
      'Fight on a surface arena or prepared underground area where you have maneuvering room.',
      'Kill head segments whenever possible to lower overall damage output.'
    ],
    spreadBehavior: [
      'Pre-Hardmode: Spreads slowly through grass and thorn vines. Sunflowers stop surface grass spread.',
      'Hardmode: Defeating Wall of Flesh unleashes a massive diagonal V-strip of Corruption extending from Underworld to Space.',
      'Converts Stone to Ebonstone, Sand to Ebonsand, Ice to Purple Ice, and converts Mud into Corrupt Dirt (destroying Jungle!).',
      'Corrupt Thorns grow from grass up to 6 blocks away and spread corruption across gaps.'
    ],
    quarantineRules: [
      'Dig 3-tile-wide tunnels normally around the biome borders.',
      'Near the surface, Corruption thorns can spread across up to 6 tiles, so a 6-tile-wide tunnel or non-corruptible lining (Wood, Hay, Dungeon Bricks, Stone Slabs) is needed there.',
      'Protect important areas such as your base, Jungle, and towns rather than trying to isolate every single block.'
    ],
    purificationTools: [
      'Pre-Hardmode: Purification Powder purchased from the Dryad NPC for 75 copper each.',
      'Hardmode: The Clentaminator (purchased from Steampunker for 2 Platinum) + Green Solution (15 silver). Shoots a 60-tile purifying beam.',
      'Endgame: Throw Clentaminator into Shimmer after defeating Moon Lord to craft the Terraformer (95-tile range, 33% chance not to consume solution).'
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
      'Expert/Master: The Brain creates 3 illusions that act as decoys. The real Brain is identifiable by its health bar and debuffs.',
      'The Brain and Creepers are unusually susceptible to knockback.'
    ],
    spreadBehavior: [
      'Pre-Hardmode: Spreads through crimson grass and vicious vines. Sunflowers prevent grass expansion.',
      'Hardmode: Creates diagonal Crimson strip upon Wall of Flesh defeat.',
      'Converts Stone to Crimstone, Sand to Crimsand, Ice to Red Ice, and turns Jungle Mud into Corrupt Dirt.',
      'Crimson Thorns can grow up to 6 tiles to jump across narrow gaps.'
    ],
    quarantineRules: [
      'Dig 3 to 6-tile wide vertical tunnels around areas you want to protect.',
      'Use non-corruptible blocks (Wood, Hay, Dungeon Bricks, Stone Slabs) to prevent thorn vines from bridging the gap.',
      'Sunflowers are useful in Pre-Hardmode to prevent surface evil spread through grass.'
    ],
    purificationTools: [
      'Pre-Hardmode: Purification Powder from the Dryad (75 copper) cleanses Crimson/Corruption/Hallow blocks.',
      'Hardmode: Clentaminator with Green Solution (15 silver) for rapid conversion.',
      'Terraformer (Shimmered Clentaminator) provides greater range and wider spray for large-scale purification.'
    ]
  }
];
