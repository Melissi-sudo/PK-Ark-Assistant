import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaData {
  title: string;
  description: string;
}

const ROUTE_META: Record<string, MetaData> = {
  '/': {
    title: 'PK Ultimate Guide | Multi-Game Tactical Library',
    description: 'PK Ultimate Guide - Premier multi-game tactical companion featuring ARK: Survival Ascended calculators, resource maps, soaker guides, and Minecraft 1.21+ tools.',
  },
  '/library': {
    title: 'Game Library | PK Ultimate Guide',
    description: 'Select your game suite: ARK: Survival Ascended calculators, breeding alarms, and interactive maps, or Minecraft 1.21+ Tricky Trials tools.',
  },
  '/taming': {
    title: 'ARK Taming & Starve Engine | PK Ultimate Guide',
    description: 'Calculate exact ARK: Survival Ascended creature food requirements, torpor depletion times, and starve thresholds across official and unofficial server rates.',
  },
  '/soakers': {
    title: 'ARK Turret Soaker Hitbox Matrix | PK Ultimate Guide',
    description: 'Master ARK: Survival Ascended turret soaking with exact hitbox damage reductions, saddle armor formulas, and optimal angles for Stegosaurus and Trikes.',
  },
  '/pyromane': {
    title: 'ARK Pyromane Taming & Combat Guide | PK Ultimate Guide',
    description: 'ARK: Survival Ascended Pyromane taming and combat guide. Simulate extinguishing flames, water luring, and the 30-second ride mechanic.',
  },
  '/breeding': {
    title: 'ARK Breeding & Mutation Hub | PK Ultimate Guide',
    description: 'ARK breeding, incubation, gestation, and baby maturation calculator with exact TEK alarm and imprint notifications.',
  },
  '/maps': {
    title: 'ARK Interactive Resource Maps | PK Ultimate Guide',
    description: 'Interactive ARK: Survival Ascended resource maps with high-density nodes for metal, crystal, obsidian, oil, pearls, and silica across all maps.',
  },
  '/resources': {
    title: 'ARK Tribe Ammo & Gunpowder Quota | PK Ultimate Guide',
    description: 'Calculate heavy turret ammunition quotas, advanced rifle bullets, and gunpowder production requirements for your ARK tribe.',
  },
  '/stats': {
    title: 'ARK Dino Wild Stats & Mutation Lookup | PK Ultimate Guide',
    description: 'Extract wild dino stat points, extract mutations, and evaluate post-tame stats for ARK: Survival Ascended breeding lines.',
  },
  '/timers': {
    title: 'ARK War Room Timers & Alarms | PK Ultimate Guide',
    description: 'Set custom starvation, egg hatching, and imprint TEK audio alarms for ARK: Survival Ascended operations.',
  },
  '/store': {
    title: 'PK Store Official Vault Lines | PK Ultimate Guide',
    description: 'Browse top-tier breeding lines, dinos, and blueprints crafted for Official Small Tribes and crossplay ARK servers.',
  },
  '/minecraft': {
    title: 'Minecraft 1.21+ Tactical Guide Suite | PK Ultimate Guide',
    description: 'Minecraft 1.21+ tactical tools and guides, including Tricky Trials potions, Nether portal linking, ore elevation, and redstone mechanics.',
  },
  '/minecraft/portal': {
    title: 'Minecraft 3D Nether Portal Calculator | PK Ultimate Guide',
    description: 'Link Nether and Overworld portals with exact 8:1 coordinate calculations and 3D collision radius testing.',
  },
  '/minecraft/potions': {
    title: 'Minecraft 1.21+ Potion Brewing Lab | PK Ultimate Guide',
    description: 'Interactive brewing recipes for 1.21 Tricky Trials potions: Wind Charged, Oozing, Infested, Weaving, and combat elixirs.',
  },
  '/minecraft/ores': {
    title: 'Minecraft Ore Elevation & Mining Heights | PK Ultimate Guide',
    description: 'Optimal Y-level elevation charts for mining Diamonds, Ancient Debris, Iron, Redstone, and Gold in modern Minecraft.',
  },
  '/minecraft/villagers': {
    title: 'Minecraft Villager Trading & Workstations | PK Ultimate Guide',
    description: 'Villager profession workstation guide, 1-emerald discount mechanics, and Mending trade re-rolling tips.',
  },
  '/minecraft/redstone': {
    title: 'Minecraft Redstone Timing & Logic Engine | PK Ultimate Guide',
    description: 'Redstone tick timings, hopper clock delay calculator, and item sorting filter setups.',
  },
  '/minecraft/enchanting': {
    title: 'Minecraft Enchanting & Anvil Optimizer | PK Ultimate Guide',
    description: 'Optimize anvil combine orders to avoid the "Too Expensive!" penalty and calculate Mace enchantments.',
  },
  '/minecraft/mobs': {
    title: 'Minecraft Mob Spawning & Raid Mechanics | PK Ultimate Guide',
    description: 'Mob despawn radii, light level 0 spawning rules, and 1.21 Ominous Trial Bottle mechanics.',
  },
  '/minecraft/seedmap': {
    title: 'Minecraft Chunkbase Seed Map Launcher | PK Ultimate Guide',
    description: 'Instantly launch official Chunkbase seed maps for Java and Bedrock editions to inspect biomes and structures.',
  },
  '/minecraft/text': {
    title: 'Minecraft Gradient & Command Block Generator | PK Ultimate Guide',
    description: 'Generate multi-stop gradient hex color codes for Minecraft /tellraw, /title, actionbar, and chat.',
  },
};

export const PageMetaSync: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Lookup metadata
    const meta = ROUTE_META[pathname] || {
      title: 'PK Ultimate Guide // Tactical Multi-Game Hub',
      description: 'PK Ultimate Guide - Premier multi-game tactical library featuring ARK: Survival Ascended calculators, maps, and Minecraft 1.21+ guides.',
    };

    // Update document title
    document.title = meta.title;

    // Update meta description
    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.setAttribute('name', 'description');
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', meta.description);

    // Update OpenGraph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const canonicalHref = `https://pkguides.web.app${pathname === '/' ? '' : pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalHref);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalHref);
    }
  }, [pathname]);

  return null;
};
