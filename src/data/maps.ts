import { ArkMapInfo, ResourceCategory } from '../types';

export const RESOURCE_CATEGORIES_CONFIG: {
  id: ResourceCategory;
  name: string;
  iconColor: string;
  badgeBg: string;
  borderClass: string;
  desc: string;
}[] = [
  {
    id: 'metal',
    name: 'Metal & Rich Metal',
    iconColor: '#f59e0b',
    badgeBg: 'bg-amber-500/20 text-amber-300',
    borderClass: 'border-amber-500/50',
    desc: 'Pure gold and standard metallic ore nodes for ingots and ARB ammo'
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    iconColor: '#a855f7',
    badgeBg: 'bg-purple-500/20 text-purple-300',
    borderClass: 'border-purple-500/50',
    desc: 'Dense black volcanic stone required for Polymer, Cannonballs, and Artifact crafts'
  },
  {
    id: 'crystal',
    name: 'Crystal',
    iconColor: '#06b6d4',
    badgeBg: 'bg-cyan-500/20 text-cyan-300',
    borderClass: 'border-cyan-500/50',
    desc: 'Crystalline formations for Fabricators, Scopes, Greenhouse glass, and C4'
  },
  {
    id: 'oil',
    name: 'Oil & Oil Veins',
    iconColor: '#3b82f6',
    badgeBg: 'bg-blue-500/20 text-blue-300',
    borderClass: 'border-blue-500/50',
    desc: 'Crude oil rocks, underwater nodes, and dry desert oil veins for Gasoline & Fabricator fuel'
  },
  {
    id: 'pearls',
    name: 'Silica & Black Pearls',
    iconColor: '#ec4899',
    badgeBg: 'bg-pink-500/20 text-pink-300',
    borderClass: 'border-pink-500/50',
    desc: 'River clams, deep sea beds, and black pearl deposits for Electronics and Tek gear'
  },
  {
    id: 'polymer',
    name: 'Organic Poly & Beaver Dams',
    iconColor: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300',
    borderClass: 'border-emerald-500/50',
    desc: 'Kairuku colonies, mantis hunts, and Giant Beaver Dams for Cementing Paste & Poly'
  },
  {
    id: 'element',
    name: 'Element & Charge Nodes',
    iconColor: '#8b5cf6',
    badgeBg: 'bg-violet-500/20 text-violet-300',
    borderClass: 'border-violet-500/50',
    desc: 'Element veins, corrupted nodules, charge terminals, and Tek craft stations'
  },
  {
    id: 'gems_sulfur',
    name: 'Gems & Sulfur',
    iconColor: '#14b8a6',
    badgeBg: 'bg-teal-500/20 text-teal-300',
    borderClass: 'border-teal-500/50',
    desc: 'Green/Blue/Red gems, Propellant sulfur, and raw sand for Flamethrowers and Tek tools'
  },
  {
    id: 'caves_obelisks',
    name: 'Artifact Caves & Terminals',
    iconColor: '#ef4444',
    badgeBg: 'bg-red-500/20 text-red-300',
    borderClass: 'border-red-500/50',
    desc: 'Cave entrances, artifact pedestals, Red/Blue/Green Obelisks, and boss summon arenas'
  },
  {
    id: 'nests',
    name: 'Wyvern & Drake Nests',
    iconColor: '#f97316',
    badgeBg: 'bg-orange-500/20 text-orange-300',
    borderClass: 'border-orange-500/50',
    desc: 'Egg trench nests, Alpha spawns, and milk/venom gathering hotzones'
  }
];

export const ARK_MAPS_DATA: ArkMapInfo[] = [
  // 1. THE ISLAND
  {
    id: 'the_island',
    name: 'The Island',
    displayName: 'The Island (Official ASA)',
    theme: 'Tropical & Volcanic Island',
    tagline: 'The original proving ground with towering calderas, frozen icebergs, and deep sea trenches.',
    bgGradient: 'from-emerald-950/40 via-cyan-950/20 to-slate-950',
    accentColor: '#06b6d4',
    imageUrl: '/images/maps/the_island.jpg',
    credit: {
      author: 'Exhumed',
      url: 'https://steamcommunity.com/id/3xhumed',
      title: 'The Island Topographical Resource Cartography',
      notes: 'Custom map design by Exhumed featuring verified GPS coordinates, artifact caves, obelisk markers, and deep sea loot crates.'
    },
    overview: 'The Island features extreme resource stratification. Metal and Crystal peak atop mountains like Volcano (42, 37), Far\'s Peak (34, 84), and Frozen Tooth (35, 57). Oil blankets the northern tundra ice floes, while Silica Pearls cover the shallow sea floor and northwest coast. Giant Beaver dams line Hidden Lake and Redwood rivers.',
    availableResources: ['metal', 'obsidian', 'crystal', 'oil', 'pearls', 'polymer', 'caves_obelisks'],
    routes: [
      {
        id: 'island_volcano_run',
        title: 'Volcano Caldera Metal Sweep',
        primaryResource: 'Rich Metal & Obsidian',
        recommendedMount: 'Ankylosaurus + Quetzal or Argentavis',
        gpsWaypoints: 'Lat 42.5, Lon 37.0 -> Lat 35.0, Lon 57.5 (Frozen Tooth)',
        description: 'Drop an Ankylo directly into the central caldera basin. The rim and floor hold over 18 rich metal nodes and pure obsidian clusters. Fly directly east across the river to Frozen Tooth for an additional 12 nodes.',
        safetyTip: 'Volcano is an active PvP turret tower hotspot. Scout with a Pteranodon or Snow Owl before landing.'
      },
      {
        id: 'island_iceberg_poly',
        title: 'Northwest Ice Floe Polymer Sweep',
        primaryResource: 'Organic Polymer & Oil',
        recommendedMount: 'Pelagornis / Chainsaw / Moschops',
        gpsWaypoints: 'Lat 28.0, Lon 15.0 -> Lat 20.0, Lon 10.0',
        description: 'Fly along the snowy northwestern icebergs. Farm Kairuku (Penguins) with a wooden club or Pelagornis for hundreds of Organic Polymer within minutes. Mine the black oil rocks protruding along the icy shoreline.',
        safetyTip: 'Extremely cold temperatures. Carry Fur Armor or an Otter to prevent rapid hypothermia health loss.'
      },
      {
        id: 'island_hidden_lake_dams',
        title: 'Hidden Lake Cementing Paste Run',
        primaryResource: 'Giant Beaver Dams (CP, Silica, Rare Flower)',
        recommendedMount: 'Pteranodon / Baryonyx',
        gpsWaypoints: 'Lat 22.0, Lon 68.0 (Hidden Lake basin)',
        description: 'Check the sheltered oasis in the northeast for up to 4 Giant Beaver dams. Grab Cementing Paste, Silica Pearls, and Wood, then drop unwanted wood to force dams to respawn faster.',
        safetyTip: 'Never leave wood inside beaver dams! Drop wood to clear the dam so a fresh high-paste dam can spawn.'
      }
    ],
    nodes: [
      { id: 'isl_met_1', category: 'metal', name: 'Volcano Caldera Summit', lat: 42.5, lon: 37.0, quantity: 'Extremely Rich', biome: 'Volcano Crater', bestHarvester: 'Ankylosaurus (85% wt red)', dangerLevel: 'Extreme PvP Hotspot', notes: 'Top metal hotspot on The Island. Over 18 rich gold nodes.' },
      { id: 'isl_met_2', category: 'metal', name: 'Frozen Tooth Mountain', lat: 35.5, lon: 57.5, quantity: 'Extremely Rich', biome: 'Northeast Peaks', bestHarvester: 'Ankylosaurus / Mining Drill', dangerLevel: 'High Danger', notes: 'Surrounded by Rexes and Argies. 14 rich metal nodes.' },
      { id: 'isl_met_3', category: 'metal', name: 'Far\'s Peak (Griffin Mountain)', lat: 34.2, lon: 84.5, quantity: 'High', biome: 'Eastern Mountain', bestHarvester: 'Ankylosaurus', dangerLevel: 'Moderate', notes: 'Substantial metal on slopes and crystal crown on apex.' },
      { id: 'isl_met_4', category: 'metal', name: 'Redwood Central Peak', lat: 63.8, lon: 46.2, quantity: 'High', biome: 'Redwood Forest Summit', bestHarvester: 'Ankylosaurus', dangerLevel: 'High Danger', notes: 'Thylas and Purlovias populate trees below. Safe once on rock summit.' },
      { id: 'isl_met_5', category: 'metal', name: 'Whitesky Peak (Blue Obelisk Mt)', lat: 25.0, lon: 29.0, quantity: 'Extremely Rich', biome: 'Snow Mountain', bestHarvester: 'Ankylosaurus', dangerLevel: 'Extreme PvP Hotspot', notes: 'Heavy metal deposits surrounding Blue Obelisk. Watch for turret bases.' },

      { id: 'isl_obs_1', category: 'obsidian', name: 'Volcano Crater Ring', lat: 43.1, lon: 39.0, quantity: 'Extremely Rich', biome: 'Volcano', bestHarvester: 'Ankylosaurus / Mantis', dangerLevel: 'Extreme PvP Hotspot', notes: 'Vast obsidian beds encircling the central lava basin.' },
      { id: 'isl_obs_2', category: 'obsidian', name: 'Whitesky Peak Slopes', lat: 26.5, lon: 32.0, quantity: 'High', biome: 'Snow Biome', bestHarvester: 'Ankylosaurus', dangerLevel: 'Moderate', notes: 'Jet-black glassy nodes lining the south-facing frozen cliffs.' },
      { id: 'isl_obs_3', category: 'obsidian', name: 'Central Cave Floor', lat: 41.5, lon: 46.9, quantity: 'Medium', biome: 'Cave System', bestHarvester: 'Metal Pick', dangerLevel: 'Moderate', notes: 'Safe obsidian nodes along the entrance corridor of Artifact of the Clever.' },

      { id: 'isl_cry_1', category: 'crystal', name: 'Volcano Peak Ridge', lat: 42.0, lon: 36.5, quantity: 'High', biome: 'Volcano Crater', bestHarvester: 'Ankylosaurus', dangerLevel: 'High Danger', notes: 'Large crystal clusters around top rim.' },
      { id: 'isl_cry_2', category: 'crystal', name: 'Frozen Tooth Apex', lat: 34.8, lon: 58.0, quantity: 'High', biome: 'Mountain', bestHarvester: 'Ankylosaurus', dangerLevel: 'Moderate', notes: 'Abundant white crystal formations overlooking the eastern ocean.' },
      { id: 'isl_cry_3', category: 'crystal', name: 'Caverns of the Lost Faith', lat: 53.7, lon: 10.4, quantity: 'Extremely Rich', biome: 'Underwater Cave', bestHarvester: 'Dunkleosteus / Pick', dangerLevel: 'Extreme PvP Hotspot', notes: 'Massive underwater cave loaded with glowing crystal clusters and oil.' },

      { id: 'isl_oil_1', category: 'oil', name: 'Northwest Frozen Floes', lat: 15.0, lon: 20.0, quantity: 'Extremely Rich', biome: 'Arctic Coast', bestHarvester: 'Ankylosaurus / Pick', dangerLevel: 'Moderate', notes: 'Hundreds of black oil stones on icebergs and snow beaches.' },
      { id: 'isl_oil_2', category: 'oil', name: 'Deep Sea Oil Bed (East Trench)', lat: 85.0, lon: 90.0, quantity: 'High', biome: 'Abyssal Ocean', bestHarvester: 'Dunkleosteus', dangerLevel: 'High Danger', notes: 'Seafloor geysers streaming black oil rocks. Dunkle crushes them effortlessly.' },

      { id: 'isl_prl_1', category: 'pearls', name: 'Northwest Shallow Coast Clams', lat: 21.0, lon: 18.5, quantity: 'Extremely Rich', biome: 'Arctic Coast Shallows', bestHarvester: 'Hand Gather / Anglerfish', dangerLevel: 'Moderate', notes: 'Dense bed of glowing clams in waist-deep arctic water.' },
      { id: 'isl_prl_2', category: 'pearls', name: 'Redwood River Confluence', lat: 60.5, lon: 35.0, quantity: 'Medium', biome: 'River Shallows', bestHarvester: 'Hand Gather', dangerLevel: 'Safe', notes: 'Shallow fresh water pearl beds between Southern Jungle and Redwoods.' },

      { id: 'isl_ply_1', category: 'polymer', name: 'Penguin Glacier Bay', lat: 28.5, lon: 14.0, quantity: 'Extremely Rich', biome: 'Iceberg Colony', bestHarvester: 'Pelagornis / Club / Moschops', dangerLevel: 'Moderate', notes: 'Dozens of wild Kairuku. Yields thousands of Organic Poly in one sweep.' },
      { id: 'isl_ply_2', category: 'polymer', name: 'Hidden Lake Beaver Sanctuary', lat: 22.5, lon: 68.5, quantity: 'High', biome: 'Oasis Basin', bestHarvester: 'Pteranodon Snatch', dangerLevel: 'Safe', notes: 'Regular Giant Beaver Dam spawns for hundreds of Cementing Paste.' },
      { id: 'isl_ply_3', category: 'polymer', name: 'Southern Islets Beaver Estuary', lat: 82.0, lon: 58.0, quantity: 'Medium', biome: 'Swamp Estuary', bestHarvester: 'Ground mount / Pick', dangerLevel: 'Safe', notes: 'Quiet river dams away from major PvP flight paths.' },

      { id: 'isl_cav_1', category: 'caves_obelisks', name: 'Blue Obelisk Terminal', lat: 25.5, lon: 25.6, quantity: 'Extremely Rich', biome: 'Snow Mountain Terminal', bestHarvester: 'Tek Transmitter', dangerLevel: 'Extreme PvP Hotspot', notes: 'Summons Megapithecus. Prime server transfer and tribute terminal.' },
      { id: 'isl_cav_2', category: 'caves_obelisks', name: 'Red Obelisk Terminal', lat: 79.8, lon: 17.4, quantity: 'Extremely Rich', biome: 'Southwest Jungle Basin', bestHarvester: 'Tek Transmitter', dangerLevel: 'Moderate', notes: 'Summons Broodmother Lysrix. Safe coastal tribute hub.' },
      { id: 'isl_cav_3', category: 'caves_obelisks', name: 'Green Obelisk Terminal', lat: 59.0, lon: 72.3, quantity: 'Extremely Rich', biome: 'Eastern Marshland', bestHarvester: 'Tek Transmitter', dangerLevel: 'High Danger', notes: 'Summons Dragon. Surrounded by swamps and titanoboas.' },
      { id: 'isl_cav_4', category: 'caves_obelisks', name: 'Lava Cave (Artifact of the Massive)', lat: 70.6, lon: 86.1, quantity: 'High', biome: 'Southeast Lava Cavern', bestHarvester: 'Baryonyx / Megalania', dangerLevel: 'Extreme PvP Hotspot', notes: 'Extremely hot. Contains Artifact of the Massive needed for Dragon.' }
    ]
  },

  // 2. SCORCHED EARTH
  {
    id: 'scorched_earth',
    name: 'Scorched Earth',
    displayName: 'Scorched Earth (Official ASA)',
    theme: 'Desert Wasteland & Canyons',
    tagline: 'Ruthless sun, lethal superheats, vast oil veins, and the notorious World Scar Wyvern Trench.',
    bgGradient: 'from-amber-950/40 via-orange-950/20 to-slate-950',
    accentColor: '#f59e0b',
    imageUrl: '/images/maps/scorched_earth.jpg',
    credit: {
      author: 'Exhumed',
      url: 'https://steamcommunity.com/id/3xhumed',
      title: 'Scorched Earth Custom Resource Cartography',
      notes: 'Custom desert cartography by Exhumed featuring water veins, oil nodes, desert loot crates, and artifact positions.'
    },
    overview: 'Scorched Earth is the premier source of Oil and Raw Salt. Permanent Oil Veins dot the dunes and canyons where Oil Pumps generate passive crude oil. The World Scar (Lat 18-75, Lon 18-24) cuts across the west containing thousands of Wyvern eggs, sulfur, and obsidian. Raw salt and sulfur combine with cactus sap for propellant and clay.',
    availableResources: ['metal', 'obsidian', 'crystal', 'oil', 'pearls', 'polymer', 'gems_sulfur', 'caves_obelisks', 'nests'],
    routes: [
      {
        id: 'se_wyvern_scar_run',
        title: 'World Scar Wyvern Egg & Milk Raid',
        primaryResource: 'Wyvern Eggs & Wyvern Milk',
        recommendedMount: 'High Stam Pteranodon / Fasolasuchus / Pyromane',
        gpsWaypoints: 'Lat 22.0, Lon 20.0 -> Lat 65.0, Lon 22.0 (The World Scar Trench)',
        description: 'Fly into the immense western lava fissure. Spot Fire, Lightning, and Poison Wyvern nests nestled in cliff alcoves. Snatch high-level eggs (up to lvl 190) and sprint immediately out before enraged parents catch you.',
        safetyTip: 'Lightning Wyverns can snipe riders directly out of the saddle. Keep a Parachute and Med Brews on hotbar.'
      },
      {
        id: 'se_oil_pump_loop',
        title: 'Dune Oil Pump Harvesting Loop',
        primaryResource: 'Crude Oil (Passive Pumps)',
        recommendedMount: 'Thorny Dragon / Argentavis',
        gpsWaypoints: 'Lat 75.0, Lon 38.0 -> Lat 84.0, Lon 48.0 -> Lat 62.0, Lon 16.0',
        description: 'Construct Metal Oil Pumps on wild oil veins. Return every 3-4 hours to harvest 2,000+ Crude Oil per pump. Highly lucrative for crafting bulk Gasoline and Industrial Grinders.',
        safetyTip: 'Protect pumps with Metal Dinosaur Gateways and turrets to prevent rival tribes from breaking in and looting.'
      },
      {
        id: 'se_mantis_poly_hunt',
        title: 'Outer Dunes Mantis Polymer Hunt',
        primaryResource: 'Organic Polymer & Chitin',
        recommendedMount: 'Chainsaw / Megatherium / Ceratosaurus',
        gpsWaypoints: 'Lat 45.0, Lon 10.0 (Western Dune Perimeter)',
        description: 'Patrol the outer perimeter of the map. Slay wild Mantis and harvest carcasses with a Chainsaw or Megatherium for 300+ Organic Polymer per insect.',
        safetyTip: 'Deathworms patrol the outer sands. Watch for sand dust plumes indicating an underground worm breach.'
      }
    ],
    nodes: [
      { id: 'se_wyv_1', category: 'nests', name: 'World Scar Central Trench', lat: 35.0, lon: 20.5, quantity: 'Extremely Rich', biome: 'Volcanic Fissure', bestHarvester: 'Pteranodon Egg Snatch', dangerLevel: 'Extreme PvP Hotspot', notes: 'Fire, Lightning, and Poison Wyvern nests along trench walls.' },
      { id: 'se_wyv_2', category: 'nests', name: 'World Scar South Gate', lat: 68.0, lon: 23.0, quantity: 'High', biome: 'Lava Trench', bestHarvester: 'High Stam Flyer', dangerLevel: 'High Danger', notes: 'Southern exit of the trench. Good milk trap location.' },

      { id: 'se_oil_1', category: 'oil', name: 'Southern Badlands Oil Vein Hub', lat: 76.5, lon: 39.0, quantity: 'Extremely Rich', biome: 'Southern Desert', bestHarvester: 'Oil Pump', dangerLevel: 'High Danger', notes: 'Cluster of 4 natural oil veins. Prime location for a tribe pump farm.' },
      { id: 'se_oil_2', category: 'oil', name: 'Oasis Oasis Oil Vein', lat: 60.5, lon: 16.0, quantity: 'High', biome: 'West Oasis', bestHarvester: 'Oil Pump', dangerLevel: 'Moderate', notes: 'Vein beside water source. High traffic water spot.' },
      { id: 'se_oil_3', category: 'oil', name: 'Northeast Dunes Oil Vein', lat: 25.0, lon: 74.0, quantity: 'High', biome: 'Dune Edge', bestHarvester: 'Oil Pump', dangerLevel: 'Moderate', notes: 'Secluded vein near northeast mountain.' },

      { id: 'se_met_1', category: 'metal', name: 'Red Obelisk Mesa (The Spine)', lat: 70.0, lon: 35.0, quantity: 'Extremely Rich', biome: 'Red Mesa Plateau', bestHarvester: 'Ankylosaurus', dangerLevel: 'Extreme PvP Hotspot', notes: 'Over 20 rich metal nodes lining the ridge below Red Obelisk.' },
      { id: 'se_met_2', category: 'metal', name: 'Blue Obelisk Summit (Northern Peak)', lat: 22.0, lon: 32.0, quantity: 'Extremely Rich', biome: 'High Mountain', bestHarvester: 'Ankylosaurus', dangerLevel: 'High Danger', notes: 'Massive metal and crystal deposits atop the northern mountain chain.' },
      { id: 'se_met_3', category: 'metal', name: 'Central Canyons Rich Metal', lat: 50.0, lon: 58.0, quantity: 'High', biome: 'Canyon Formations', bestHarvester: 'Ankylosaurus / Argy', dangerLevel: 'Moderate', notes: 'Pillars and canyon walls loaded with gold nodes.' },

      { id: 'se_obs_1', category: 'obsidian', name: 'World Scar Rim Obsidian', lat: 40.0, lon: 23.5, quantity: 'Extremely Rich', biome: 'Trench Cliffs', bestHarvester: 'Ankylosaurus', dangerLevel: 'Extreme PvP Hotspot', notes: 'Hundreds of black obsidian blocks along the edge of the Wyvern scar.' },
      { id: 'se_obs_2', category: 'obsidian', name: 'Northern Mountain Ridge', lat: 28.0, lon: 45.0, quantity: 'High', biome: 'Mountain', bestHarvester: 'Ankylosaurus', dangerLevel: 'Moderate', notes: 'Lined with obsidian nodes and crystal formations.' },

      { id: 'se_gem_1', category: 'gems_sulfur', name: 'World Scar Sulfur Fields', lat: 48.0, lon: 22.0, quantity: 'Extremely Rich', biome: 'Sulfur Basin', bestHarvester: 'Ankylosaurus / Pick', dangerLevel: 'High Danger', notes: 'Yellow sulfur crystals. Essential for Flamethrower ammo and Propellant.' },
      { id: 'se_gem_2', category: 'gems_sulfur', name: 'Salt Flats Dry Lakebed', lat: 65.0, lon: 55.0, quantity: 'Extremely Rich', biome: 'Dry Lakebed', bestHarvester: 'Pick / Doedicurus', dangerLevel: 'Moderate', notes: 'Vast Raw Salt beds used for Preserving Salts and curing jerky.' },

      { id: 'se_prl_1', category: 'pearls', name: 'Green Obelisk Oasis Pearls', lat: 55.0, lon: 70.0, quantity: 'High', biome: 'Oasis Lake', bestHarvester: 'Hand Gather', dangerLevel: 'Moderate', notes: 'Silica pearls on lakebed floor under Green Obelisk.' },
      { id: 'se_ply_1', category: 'polymer', name: 'Dune Sand Mantis Colony', lat: 50.0, lon: 12.0, quantity: 'Extremely Rich', biome: 'Low Desert', bestHarvester: 'Chainsaw', dangerLevel: 'High Danger', notes: 'Continuous Mantis spawns. Yields thousands of Organic Poly.' },

      { id: 'se_cav_1', category: 'caves_obelisks', name: 'Blue Obelisk Terminal', lat: 17.5, lon: 32.5, quantity: 'Extremely Rich', biome: 'Northern Terminal', bestHarvester: 'Tek Transmitter', dangerLevel: 'Extreme PvP Hotspot', notes: 'High altitude obelisk. Very cold during night superheat.' },
      { id: 'se_cav_2', category: 'caves_obelisks', name: 'Red Obelisk Terminal', lat: 74.5, lon: 42.0, quantity: 'Extremely Rich', biome: 'Southern Terminal', bestHarvester: 'Tek Transmitter', dangerLevel: 'Extreme PvP Hotspot', notes: 'Major PvP base location overlooking oil veins.' },
      { id: 'se_cav_3', category: 'caves_obelisks', name: 'Green Obelisk Terminal', lat: 53.0, lon: 72.0, quantity: 'Extremely Rich', biome: 'Eastern Oasis', bestHarvester: 'Tek Transmitter', dangerLevel: 'High Danger', notes: 'Lush oasis basin. Central hub for desert operations.' },
      { id: 'se_cav_4', category: 'caves_obelisks', name: 'Old Tunnels Cave (Gatekeeper)', lat: 58.6, lon: 47.7, quantity: 'High', biome: 'Subterranean Cavern', bestHarvester: 'Thylacoleo', dangerLevel: 'High Danger', notes: 'Contains Artifact of the Gatekeeper.' }
    ]
  },

  // 3. THE CENTER
  {
    id: 'the_center',
    name: 'The Center',
    displayName: 'The Center (Official ASA)',
    theme: 'Floating Island & Subterranean World',
    tagline: 'Colossal floating continents, volcanic islands, gigantic waterfalls, and deep oceanic trenches.',
    bgGradient: 'from-blue-950/40 via-cyan-950/20 to-slate-950',
    accentColor: '#38bdf8',
    imageUrl: '/images/maps/the_center.jpg',
    credit: {
      author: 'Exhumed',
      url: 'https://steamcommunity.com/id/3xhumed',
      title: 'The Center Custom Resource & Topographical Cartography',
      notes: 'Custom map design by Exhumed with deep sea loot crates, floating island coordinates, and cave entrances.'
    },
    overview: 'The Center provides the highest density of metal, crystal, and pearls of any map in ARK. The Floating Island (Center of map) and Lava Island (North) are saturated with rich metal and obsidian. The deep ocean trench hosts hundreds of Black Pearls and Silica Clams. The Underground World below features self-contained biomes with massive resource yields.',
    availableResources: ['metal', 'obsidian', 'crystal', 'oil', 'pearls', 'polymer', 'caves_obelisks'],
    routes: [
      {
        id: 'center_lava_island_metal',
        title: 'North Lava Island Metal Blitz',
        primaryResource: 'Rich Metal, Obsidian & Charcoal',
        recommendedMount: 'Ankylosaurus + Quetzal / Rhyniognatha',
        gpsWaypoints: 'Lat 15.0, Lon 60.0 -> Lat 20.0, Lon 70.0 (Lava Island Basin)',
        description: 'Lava Island contains the highest concentration of high-density gold metal nodes in ARK. Carry an Anky with a Quetzal or Rhynio to clear 30,000+ raw metal in under 15 minutes. Burned trees yield infinite Charcoal.',
        safetyTip: 'Lethal lava pools and aggressive Rex/Carno spawns. Stay mounted on flyers when repositioning.'
      },
      {
        id: 'center_deep_pearl_trench',
        title: 'Deep Sea Abyssal Pearl Trench',
        primaryResource: 'Silica Pearls & Black Pearls',
        recommendedMount: 'Dunkleosteus / Shastasaurus / Basilosaurus',
        gpsWaypoints: 'Lat 45.0, Lon 15.0 -> Lat 65.0, Lon 12.0 (Western Ocean Fissure)',
        description: 'Descend into the underwater canyon along the western border. The sea floor is packed with glowing pearl clams and Eurypterid/Squid nests yielding hundreds of Black Pearls.',
        safetyTip: 'Electrophorus (Eels) and Cnidaria swarm this trench. Use an immune Basilosaurus or Dunkleosteus!'
      },
      {
        id: 'center_beaver_sanctuary',
        title: 'Redwood Pond Beaver Dam Blitz',
        primaryResource: 'Cementing Paste & Silica Pearls',
        recommendedMount: 'Pteranodon / Argy',
        gpsWaypoints: 'Lat 70.0, Lon 35.0 -> Lat 80.0, Lon 45.0 (Southern Redwood Valleys)',
        description: 'Visit the river chains winding through the southern Redwoods. Over 10 Giant Beaver dams spawn concurrently along the cascading waterfalls.',
        safetyTip: 'Clear dam inventories completely to force fast respawn timers.'
      }
    ],
    nodes: [
      { id: 'cen_met_1', category: 'metal', name: 'Lava Island Main Caldera', lat: 18.0, lon: 62.0, quantity: 'Extremely Rich', biome: 'Volcanic Island', bestHarvester: 'Ankylosaurus / Rhynio', dangerLevel: 'Extreme PvP Hotspot', notes: 'Premier metal deposit in all of ARK. Over 35 rich metal nodes.' },
      { id: 'cen_met_2', category: 'metal', name: 'Floating Island Underside & Top', lat: 40.0, lon: 45.0, quantity: 'Extremely Rich', biome: 'Floating Continent', bestHarvester: 'Ankylosaurus', dangerLevel: 'High Danger', notes: 'Massive plateaus loaded with rich metal veins and waterfalls.' },
      { id: 'cen_met_3', category: 'metal', name: 'Snow Mountain South Peak', lat: 78.0, lon: 25.0, quantity: 'Extremely Rich', biome: 'Snow Biome', bestHarvester: 'Ankylosaurus', dangerLevel: 'High Danger', notes: 'High altitude mountain with deep metal fields.' },

      { id: 'cen_obs_1', category: 'obsidian', name: 'Lava Island Volcanic Fields', lat: 16.0, lon: 68.0, quantity: 'Extremely Rich', biome: 'Lava Fields', bestHarvester: 'Ankylosaurus', dangerLevel: 'High Danger', notes: 'Dense obsidian clusters scattered between lava flows.' },
      { id: 'cen_obs_2', category: 'obsidian', name: 'Floating Island Caves', lat: 42.0, lon: 42.0, quantity: 'High', biome: 'Internal Caverns', bestHarvester: 'Ankylosaurus', dangerLevel: 'Moderate', notes: 'Safe interior cave rooms packed with obsidian.' },

      { id: 'cen_cry_1', category: 'crystal', name: 'Lava Island Crystal Spires', lat: 20.0, lon: 58.0, quantity: 'Extremely Rich', biome: 'Volcano Spire', bestHarvester: 'Ankylosaurus', dangerLevel: 'Moderate', notes: 'Huge clusters flanking the volcano slopes.' },
      { id: 'cen_cry_2', category: 'crystal', name: 'Snow South Ice Palaces', lat: 82.0, lon: 20.0, quantity: 'High', biome: 'Glacial Summit', bestHarvester: 'Ankylosaurus', dangerLevel: 'Moderate', notes: 'Pure crystal formations inside frozen arches.' },

      { id: 'cen_oil_1', category: 'oil', name: 'North Sea Glaciers', lat: 12.0, lon: 30.0, quantity: 'Extremely Rich', biome: 'Arctic Ocean', bestHarvester: 'Ankylosaurus / Dunkle', dangerLevel: 'Moderate', notes: 'Massive oil rocks lining frozen icebergs in the north.' },
      { id: 'cen_oil_2', category: 'oil', name: 'Underground World Sea Vents', lat: 50.0, lon: 50.0, quantity: 'High', biome: 'Subterranean Sea', bestHarvester: 'Dunkleosteus', dangerLevel: 'High Danger', notes: 'Underground world ocean bed oil deposits.' },

      { id: 'cen_prl_1', category: 'pearls', name: 'Western Deep Ocean Trench', lat: 55.0, lon: 15.0, quantity: 'Extremely Rich', biome: 'Deep Sea Abyss', bestHarvester: 'Anglerfish / Basilosaurus', dangerLevel: 'Extreme PvP Hotspot', notes: 'Dense carpets of silica pearls and black pearls.' },
      { id: 'cen_prl_2', category: 'pearls', name: 'Redwood Cascades River', lat: 75.0, lon: 40.0, quantity: 'High', biome: 'River Shallows', bestHarvester: 'Hand Gather', dangerLevel: 'Safe', notes: 'Clam clusters at the foot of waterfalls.' },

      { id: 'cen_ply_1', category: 'polymer', name: 'Redwood Beaver Dam Network', lat: 72.0, lon: 38.0, quantity: 'Extremely Rich', biome: 'Redwood Creek', bestHarvester: 'Pteranodon', dangerLevel: 'Safe', notes: 'Top beaver dam spot on The Center. Regular 6-dam clusters.' },

      { id: 'cen_cav_1', category: 'caves_obelisks', name: 'Blue Obelisk Terminal', lat: 28.0, lon: 22.0, quantity: 'Extremely Rich', biome: 'Northwest Snowy Peak', bestHarvester: 'Tek Transmitter', dangerLevel: 'Extreme PvP Hotspot', notes: 'Primary transfer terminal. Frequent PvP skirmish zone.' },
      { id: 'cen_cav_2', category: 'caves_obelisks', name: 'Green Obelisk Terminal', lat: 60.0, lon: 70.0, quantity: 'Extremely Rich', biome: 'Jungle Islands', bestHarvester: 'Tek Transmitter', dangerLevel: 'High Danger', notes: 'Lush tropical plateau terminal.' },
      { id: 'cen_cav_3', category: 'caves_obelisks', name: 'Red Obelisk Terminal', lat: 85.0, lon: 15.0, quantity: 'Extremely Rich', biome: 'Southern Snow Edge', bestHarvester: 'Tek Transmitter', dangerLevel: 'Moderate', notes: 'Remote frozen obelisk.' }
    ]
  },

  // 4. ABERRATION
  {
    id: 'aberration',
    name: 'Aberration',
    displayName: 'Aberration (Official ASA)',
    theme: 'Subterranean Cavern & Bioluminescent Zones',
    tagline: 'Broken ARK underground biosphere with glowing mushrooms, Charge Nodes, and toxic Element falls.',
    bgGradient: 'from-violet-950/40 via-purple-950/20 to-slate-950',
    accentColor: '#a855f7',
    imageUrl: '/images/maps/aberration.jpg',
    credit: {
      author: 'Exhumed',
      url: 'https://steamcommunity.com/id/3xhumed',
      title: 'Aberration Subterranean Cavern Cartography',
      notes: 'Custom underground cartography by Exhumed with Charge Nodes, artifact locations, and bioluminescent zone tiers.'
    },
    overview: 'Aberration has no standard flyers; movement relies on Ziplines, Ravagers, Rock Drakes, and Glider Suits. The map is tiered vertically: Fertile Green Zone (Top, Metal/Wood), Bioluminescent Blue Zone (Middle, Blue Gems/Metal/Poly), and Element Red Zone (Bottom, Radiation, Red Gems, Element Falls, Reaper Queens). Charge Nodes convert resources into Element Batteries.',
    availableResources: ['metal', 'obsidian', 'crystal', 'oil', 'pearls', 'polymer', 'element', 'gems_sulfur', 'caves_obelisks', 'nests'],
    routes: [
      {
        id: 'ab_blue_zone_metal',
        title: 'Blue Zone Metal & Blue Gem Sweep',
        primaryResource: 'Rich Metal & Blue Gems',
        recommendedMount: 'Ankylosaurus + Karkinos (Crab Toss)',
        gpsWaypoints: 'Lat 52.0, Lon 65.0 -> Lat 60.0, Lon 70.0 (The Luminous Marshes)',
        description: 'Pick up an Ankylo with a high-weight Karkinos (Crab). Walk along the glowing blue rivers. The Anky can be swung into hundreds of rich metal nodes and crystalline Blue Gem formations without ever dismounting.',
        safetyTip: 'Carry a charged Light Pet (Bulbdog, Glowtail) at all times to suppress Nameless and Reaper spawns!'
      },
      {
        id: 'ab_drake_trench_run',
        title: 'Red Zone Rock Drake Egg Trench',
        primaryResource: 'Rock Drake Eggs & Red Gems',
        recommendedMount: 'Spinosaurus / Megalosaurus / Karkinos',
        gpsWaypoints: 'Lat 75.0, Lon 45.0 -> Lat 82.0, Lon 52.0 (The Grave of the Lost)',
        description: 'Equip a full Hazard Suit to prevent deadly radiation damage. Descend into the deep red abyssal trench. Scale nest walls using climbing picks or a Spino to steal high-level Rock Drake eggs.',
        safetyTip: 'Hazard Suits take constant durability damage in radiation. Always carry 2 backup sets in your inventory!'
      },
      {
        id: 'ab_organic_poly_marsh',
        title: 'Blue Zone Organic Poly Plant Harvest',
        primaryResource: 'Organic Polymer & Fungal Wood',
        recommendedMount: 'Bear / Megatherium / Chainsaw',
        gpsWaypoints: 'Lat 55.0, Lon 60.0',
        description: 'Harvest the white organic poly bulbs growing along the marsh floor. Grants thousands of Organic Polymer without needing to kill creatures.',
        safetyTip: 'Avoid stepping into red hallucinogenic spore patches; they induce suffocation, nausea, and disorientation.'
      }
    ],
    nodes: [
      { id: 'ab_drake_1', category: 'nests', name: 'Rock Drake Nest Fissure', lat: 82.0, lon: 52.0, quantity: 'Extremely Rich', biome: 'Radiation Red Zone', bestHarvester: 'Egg Snatch / Hazard Suit', dangerLevel: 'Extreme PvP Hotspot', notes: 'Vertical cliff wall nests. Highly radioactive. Home of high-tier Drake eggs.' },
      { id: 'ab_ele_1', category: 'element', name: 'Element River Liquid Falls', lat: 88.0, lon: 40.0, quantity: 'Extremely Rich', biome: 'Deep Element Abyss', bestHarvester: 'Charge Battery / Terminal', dangerLevel: 'Extreme PvP Hotspot', notes: 'Pure molten liquid element. Lethal on direct physical contact.' },
      { id: 'ab_ele_2', category: 'element', name: 'Fertile Lake Charge Terminal', lat: 38.0, lon: 65.0, quantity: 'High', biome: 'Green Zone', bestHarvester: 'Charge Node Crafting', dangerLevel: 'Moderate', notes: 'Safe Charge Node for crafting Element and batteries.' },

      { id: 'ab_met_1', category: 'metal', name: 'Blue Zone Overlook Bridge', lat: 55.0, lon: 68.0, quantity: 'Extremely Rich', biome: 'Bioluminescent Marshes', bestHarvester: 'Ankylo + Karkinos', dangerLevel: 'High Danger', notes: 'Dense fields of rich gold metal nodes.' },
      { id: 'ab_met_2', category: 'metal', name: 'Fertile Edge Cliffs', lat: 30.0, lon: 60.0, quantity: 'High', biome: 'Upper Green Zone', bestHarvester: 'Ankylosaurus / Roll Rat', dangerLevel: 'Safe', notes: 'Safe early-game metal nodes without radiation.' },

      { id: 'ab_gem_1', category: 'gems_sulfur', name: 'Luminous Blue Gem Caverns', lat: 58.0, lon: 62.0, quantity: 'Extremely Rich', biome: 'Blue Zone', bestHarvester: 'Pick / Ankylo', dangerLevel: 'High Danger', notes: 'Blue crystalline gems for Glider Suits and Hazard gear.' },
      { id: 'ab_gem_2', category: 'gems_sulfur', name: 'Red Radiation Gem Fields', lat: 78.0, lon: 40.0, quantity: 'Extremely Rich', biome: 'Red Zone', bestHarvester: 'Pick / Rock Drake', dangerLevel: 'Extreme PvP Hotspot', notes: 'Red gems for Tek gear and Gas Collectors. Heavy radiation.' },
      { id: 'ab_gem_3', category: 'gems_sulfur', name: 'Fertile Green Gem Fields', lat: 35.0, lon: 58.0, quantity: 'High', biome: 'Green Zone', bestHarvester: 'Roll Rat / Pick', dangerLevel: 'Safe', notes: 'Green gems for Glowsticks and Gasoline crafts.' },

      { id: 'ab_ply_1', category: 'polymer', name: 'Polymer Plant Marsh', lat: 54.0, lon: 58.0, quantity: 'Extremely Rich', biome: 'Marsh Shallows', bestHarvester: 'Hand Gather / Bear', dangerLevel: 'Moderate', notes: 'Bulb plants yielding pure Organic Polymer directly from soil.' },

      { id: 'ab_cav_1', category: 'caves_obelisks', name: 'Rockwell Arena Gateway', lat: 82.5, lon: 48.0, quantity: 'Extremely Rich', biome: 'Terminal Vault', bestHarvester: 'Boss Tributes', dangerLevel: 'Extreme PvP Hotspot', notes: 'Summons Aberration boss: Aberrant Rockwell.' }
    ]
  },

  // 5. EXTINCTION
  {
    id: 'extinction',
    name: 'Extinction',
    displayName: 'Extinction (Official ASA)',
    theme: 'Corrupted Wasteland & Tek Biospheres',
    tagline: 'Ruined Earth overrun by Corrupted dinos, orbital supply drops, Element Veins, and the Sanctuary.',
    bgGradient: 'from-red-950/40 via-amber-950/20 to-slate-950',
    accentColor: '#ef4444',
    imageUrl: '/images/maps/extinction.jpg',
    credit: {
      author: 'Exhumed',
      url: 'https://steamcommunity.com/id/3xhumed',
      title: 'Extinction Wasteland & Dome Cartography',
      notes: 'Custom wasteland and dome cartography by Exhumed with Titan summoning terminals and Sanctuary city perimeter.'
    },
    overview: 'Extinction is the Element capital of ARK. Element Veins erupt in the Wasteland, defending which rewards raw Element and Element Shards. The central Sanctuary (Tek City) features street lampposts and tables that yield infinite Element Dust, Crystal, and Electronics with an Enforcer or Doedicurus. Snow and Desert Domes contain isolated biomes, while King Titan lurks in the north.',
    availableResources: ['metal', 'obsidian', 'crystal', 'oil', 'pearls', 'polymer', 'element', 'caves_obelisks'],
    routes: [
      {
        id: 'ext_element_vein_defense',
        title: 'Wasteland Element Vein Defense',
        primaryResource: 'Raw Element & Element Shards',
        recommendedMount: 'Giganotosaurus / Carcharodontosaurus / Wyvern',
        gpsWaypoints: 'Lat 45.0, Lon 25.0 (West Wasteland) or Lat 55.0, Lon 75.0 (East Wasteland)',
        description: 'Trigger a wild purple Element Vein (20k, 50k, or 50,000+ HP). Defend the central node against 5 waves of enraged Corrupted dinos. Once complete, harvest the purple crystal tendrils with an Ankylo or Mining Drill for 1,000+ Element.',
        safetyTip: 'Never bite the central Element Vein with your Giga/Carcha! Friendly damage will shatter the vein and destroy the payout.'
      },
      {
        id: 'ext_sanctuary_lamppost_sweep',
        title: 'Sanctuary Lamppost Element Dust Run',
        primaryResource: 'Element Dust, Electronics & Scrap Metal',
        recommendedMount: 'Doedicurus / Enforcer / Chainsaw',
        gpsWaypoints: 'Lat 50.0, Lon 50.0 -> Lat 58.0, Lon 62.0 (Central Tek City Streets)',
        description: 'Roll through the paved roads of the Sanctuary. Smash every high-tech street lamp and metal bench. Grants immense quantities of Element Dust, Electronics, and Scrap Metal (smeltable into Ingots at 1:1 ratio).',
        safetyTip: 'Enforcers receive high harvesting bonuses on Tek structures. Fast, safe, and 100% inside city boundaries.'
      },
      {
        id: 'ext_snow_dome_owl_pellets',
        title: 'Snow Dome Owl Pellet & Gacha Farm',
        primaryResource: 'Owl Pellets, Organic Poly & Blueprints',
        recommendedMount: 'Snow Owl & Gacha Pair',
        gpsWaypoints: 'Lat 28.0, Lon 60.0 (Snow Dome Interior)',
        description: 'Fly inside the giant geodesic Snow Dome. Tame Snow Owls and Gachas. Feed Owl Pellets to Gachas to produce Mastercraft/Ascendant crystal drops and Element Dust.',
        safetyTip: 'Gachas must be kept at least 14 foundations apart in male/female pairs or they become sad and stop producing quality loot.'
      }
    ],
    nodes: [
      { id: 'ext_ele_1', category: 'element', name: 'West Wasteland Element Vein Hotspot', lat: 46.0, lon: 22.0, quantity: 'Extremely Rich', biome: 'Corrupted Wasteland', bestHarvester: 'Ankylo / Mining Drill', dangerLevel: 'Extreme PvP Hotspot', notes: 'Frequent 50,000 HP Hard Element Vein spawns. Massive raw element reward.' },
      { id: 'ext_ele_2', category: 'element', name: 'East Wasteland Element Vein Field', lat: 55.0, lon: 78.0, quantity: 'Extremely Rich', biome: 'Wasteland', bestHarvester: 'Ankylo / Mining Drill', dangerLevel: 'High Danger', notes: 'Spawns 20k and 50k veins near the Desert Dome perimeter.' },
      { id: 'ext_ele_3', category: 'element', name: 'Sanctuary Central Plaza Lampposts', lat: 52.0, lon: 51.0, quantity: 'Extremely Rich', biome: 'Tek Sanctuary', bestHarvester: 'Doedicurus / Enforcer', dangerLevel: 'Safe', notes: 'Smash street lamps and benches for thousands of Element Dust.' },

      { id: 'ext_met_1', category: 'metal', name: 'Wasteland Ridge Scrap Metal', lat: 38.0, lon: 32.0, quantity: 'Extremely Rich', biome: 'Corrupted Slopes', bestHarvester: 'Ankylosaurus', dangerLevel: 'High Danger', notes: 'Spines and ridges laden with pure metal veins.' },
      { id: 'ext_met_2', category: 'metal', name: 'Desert Dome Canyon Metal', lat: 85.0, lon: 75.0, quantity: 'High', biome: 'Desert Dome', bestHarvester: 'Ankylosaurus / Velonasaur', dangerLevel: 'Moderate', notes: 'Safe interior canyon metal deposits.' },

      { id: 'ext_cry_1', category: 'crystal', name: 'Snow Dome Glacial Spires', lat: 25.0, lon: 62.0, quantity: 'Extremely Rich', biome: 'Snow Dome', bestHarvester: 'Ankylosaurus', dangerLevel: 'Moderate', notes: 'Vast ice crystal formations inside the climate barrier.' },
      { id: 'ext_obs_1', category: 'obsidian', name: 'Sulfur Fields & Wasteland Vents', lat: 60.0, lon: 20.0, quantity: 'High', biome: 'Wasteland Fissure', bestHarvester: 'Ankylosaurus', dangerLevel: 'High Danger', notes: 'Volcanic vents and black obsidian nodes.' },

      { id: 'ext_ply_1', category: 'polymer', name: 'Corrupted Nodules Harvest Hub', lat: 50.0, lon: 35.0, quantity: 'Extremely Rich', biome: 'Corrupted Plains', bestHarvester: 'Chainsaw / Therizino', dangerLevel: 'High Danger', notes: 'Corrupted dinos drop Corrupted Nodules, which function as 100% Organic Polymer.' },

      { id: 'ext_cav_1', category: 'caves_obelisks', name: 'King Titan Summoning Terminal', lat: 15.0, lon: 50.0, quantity: 'Extremely Rich', biome: 'Forbidden Zone', bestHarvester: 'Titan Mega Meka', dangerLevel: 'Extreme PvP Hotspot', notes: 'The ultimate boss arena in ARK. Summons King Titan.' },
      { id: 'ext_cav_2', category: 'caves_obelisks', name: 'Desert Titan Cave Terminal', lat: 88.0, lon: 82.0, quantity: 'High', biome: 'Desert Tomb', bestHarvester: 'Boss Tributes', dangerLevel: 'High Danger', notes: 'Summons the flying Desert Titan.' },
      { id: 'ext_cav_3', category: 'caves_obelisks', name: 'Ice Titan Cave Terminal', lat: 20.0, lon: 68.0, quantity: 'High', biome: 'Frozen Tomb', bestHarvester: 'Boss Tributes', dangerLevel: 'High Danger', notes: 'Summons the Frost/Ice Titan.' }
    ]
  }
];
