export interface PvPTip {
  id: string;
  category: 'TURRET SOAKING' | 'CAVE DEFENSE' | 'RAID PUSH' | 'BREEDING & CAKES' | 'WEAPONS & ARMOR' | 'TAMING & HARVEST';
  badgeColor: 'cyan' | 'amber' | 'emerald' | 'purple' | 'red';
  title: string;
  tip: string;
  proTip: string;
  relatedTab?: 'taming' | 'soakers' | 'pyromane' | 'breeding' | 'maps' | 'resources' | 'stats' | 'timers' | 'store';
  tabActionLabel?: string;
}

export const PVP_STRATEGY_TIPS: PvPTip[] = [
  {
    id: 'tip-stego-tail',
    category: 'TURRET SOAKING',
    badgeColor: 'cyan',
    title: 'Stegosaurus Hardened Tail Reverse Soak',
    tip: 'When draining Heavy Turrets, activate Hardened Plate mode and back into the turret firing arc in reverse. The plates and tail provide a flat 50% damage reduction and protect the rider from direct projectile hitboxes.',
    proTip: 'Tek Turrets fire explosive plasma that deals splash damage bypassing rider armor. Always pre-pot Medical Brews and carry 2 spare Flak sets on your hotbar.',
    relatedTab: 'soakers',
    tabActionLabel: 'View Soaker Matrix'
  },
  {
    id: 'tip-trike-frill',
    category: 'TURRET SOAKING',
    badgeColor: 'amber',
    title: 'Trike Head Frill 85% Damage Reduction',
    tip: 'The frontal head hitbox of a Trike absorbs an unmatched 85% of incoming bullet damage—significantly higher than a Stego. It is the premier choice for narrow cave push corridors.',
    proTip: 'Trikes do NOT prevent dismounts from flank shots or Net Projectiles. Pair with an allied Yutyrannus courage roar for an additional 20% damage resistance.',
    relatedTab: 'soakers',
    tabActionLabel: 'Compare Trike vs Stego'
  },
  {
    id: 'tip-veggie-cake',
    category: 'BREEDING & CAKES',
    badgeColor: 'emerald',
    title: 'The 21,000 HP Sweet Veggie Cake Cap',
    tip: 'Sweet Vegetable Cakes heal herbivores for 10% of their maximum Health, but are hard-capped at 2,100 HP per cake (with a 30-second consumption cooldown).',
    proTip: 'Breeding Theri or Stego lines beyond 21,000 HP yields diminishing returns on cake efficiency. Balance excess mutation points into Melee or Stamina instead.',
    relatedTab: 'breeding',
    tabActionLabel: 'Breeding Timers'
  },
  {
    id: 'tip-pyromane-water',
    category: 'TAMING & HARVEST',
    badgeColor: 'red',
    title: 'Pyromane Water Extinguish Trick',
    tip: 'To douse a wild Pyromane, kite it into shallow water puddles or construct a 1-wall high doorway box with a water trough. Deep water will make it swim erratically and drown you.',
    proTip: 'After it roars, NEVER shoot it again! A single hit cancels the ride prompt and puts the beast back into hostile aggression.',
    relatedTab: 'pyromane',
    tabActionLabel: 'Pyromane 30s Guide'
  },
  {
    id: 'tip-carcha-bloodrage',
    category: 'RAID PUSH',
    badgeColor: 'purple',
    title: 'Carcharodontosaurus 100x Bloodrage Priming',
    tip: 'At 100 stacks of Bloodrage, a Carcharodontosaurus gains a 2.75x damage multiplier and 3.5% HP/sec rapid regeneration, surpassing a standard Giga in drawn-out FOB pushes.',
    proTip: 'Keep a Cryofridge primed with small wild dinos or dodos outside your raid line to ramp up to 100 stacks before charging into enemy gigas.',
    relatedTab: 'taming',
    tabActionLabel: 'Carcha Taming Calc'
  },
  {
    id: 'tip-heavy-turret-ammo',
    category: 'CAVE DEFENSE',
    badgeColor: 'cyan',
    title: 'Heavy Turret Bullet Consumption Rate',
    tip: 'A single Heavy Turret consumes 4 Advanced Rifle Bullets per trigger shot, dealing 4x standard auto-turret damage. 1,000 bullets provides exactly 250 trigger bursts.',
    proTip: 'Set lower-level Heavy Turrets to "High Range • Only Survivors" and upper turrets to "Medium Range • Tamed Creatures" to deter suicide C4 rocket runners.',
    relatedTab: 'resources',
    tabActionLabel: 'Ammo Crafting Calculator'
  },
  {
    id: 'tip-stat-254-cap',
    category: 'BREEDING & CAKES',
    badgeColor: 'amber',
    title: 'Official Mutation Cap (254 vs 255 Points)',
    tip: 'In ARK server architecture, each wild/mutation stat caps at 255 points. However, if a stat hits 255, the game forbids you from adding survivor level-up points.',
    proTip: 'Always stop breeding mutations at 253 or 254 points. This leaves room for the 88 post-tame manual survivor level-ups.',
    relatedTab: 'stats',
    tabActionLabel: 'Dino Stat Extractor'
  },
  {
    id: 'tip-net-projectile',
    category: 'WEAPONS & ARMOR',
    badgeColor: 'emerald',
    title: 'Harpoon Net Gun Skirmish Meta',
    tip: 'A Net Projectile fired from a Harpoon Launcher traps dinos up to medium weight (Pteranodon, Tapejara, Thylacoleo, Argentavis) for a full 60 seconds.',
    proTip: 'Always carry a loaded Net Gun in hotbar slot 1. When dismounted during an aerial skirmish, net the enemy flyer before grappling the ground.',
    relatedTab: 'taming',
    tabActionLabel: 'Knockout Weapons'
  },
  {
    id: 'tip-carbo-turtle',
    category: 'TURRET SOAKING',
    badgeColor: 'cyan',
    title: 'Carbonemys Water & Hatchframe Soaking',
    tip: 'The Carbonemys shell reduces incoming bullet damage by 80%, and its legs/tail reduce damage by 50%. Its compact hitbox allows it to soak tight crouch cave entrances.',
    proTip: 'Crawl turtles backwards beneath turret line-of-sight to soak generator cables and pin enemy turret firing pins while infantry advance.',
    relatedTab: 'soakers',
    tabActionLabel: 'View Carbonemys Guide'
  },
  {
    id: 'tip-shotgun-flame',
    category: 'WEAPONS & ARMOR',
    badgeColor: 'red',
    title: 'Compound Bow Flame Arrow + Shotgun Stacking',
    tip: 'Flame Arrows inflict percentage-based damage over time that ignores armor value, ticking down heavily mutated raid dinos with 50,000+ HP.',
    proTip: 'Hit the target with a Flame Arrow first to start the 8% burn dot, then switch to a 298% Pump-Action Shotgun for lethal point-blank armor shredding.',
    relatedTab: 'resources',
    tabActionLabel: 'Check Tribe Ammo'
  },
  {
    id: 'tip-cryopod-fob',
    category: 'RAID PUSH',
    badgeColor: 'purple',
    title: 'FOB Cryofridge Range & Power Grid',
    tip: 'ASA enforces Cryofridge proximity for releasing cryopods. Always erect an enclosed metal 1x1 with a generator and Cryofridge before advancing raid dinos.',
    proTip: 'Place 4 Heavy Turrets on hatchframes around the FOB 1x1 to prevent enemy Pteranodon barrel-roll suicide C4 runs on your power supply.',
    relatedTab: 'timers',
    tabActionLabel: 'Set Raid Timers'
  },
  {
    id: 'tip-baryonyx-caves',
    category: 'CAVE DEFENSE',
    badgeColor: 'cyan',
    title: 'Baryonyx Underwater Tail Stun Lock',
    tip: 'The Baryonyx underwater tail spin applies a 10-second stun with zero cooldown against all small to medium aquatic threats (including enemy players and Megalodons).',
    proTip: 'Station mate-boosted Baryonyx inside water cave chokes on aggressive. They dismount and stun invaders indefinitely in submerged choke points.',
    relatedTab: 'taming',
    tabActionLabel: 'Baryonyx Calculator'
  }
];
