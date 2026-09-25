import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'PK Ultimate Guide | Multi-Game Tactical Library',
  '/library': 'PK Ultimate Guide | Multi-Game Tactical Library',
  
  // ARK Routes
  '/taming': 'ARK Taming & Starve Engine | PK Ultimate Guide',
  '/soakers': 'ARK Turret Soaker Hitbox Matrix | PK Ultimate Guide',
  '/pyromane': 'ARK Pyromane Taming & Combat Guide | PK Ultimate Guide',
  '/breeding': 'ARK Breeding & Mutation Hub | PK Ultimate Guide',
  '/maps': 'ARK Interactive Resource Maps | PK Ultimate Guide',
  '/resources': 'ARK Tribe Ammo & Gunpowder Quota | PK Ultimate Guide',
  '/ammo': 'ARK Tribe Ammo & Gunpowder Quota | PK Ultimate Guide',
  '/stats': 'ARK Dino Wild Stats & Mutation Lookup | PK Ultimate Guide',
  '/timers': 'ARK War Room Timers & Alarms | PK Ultimate Guide',
  '/store': 'PK Store Official Vault Lines | PK Ultimate Guide',

  // Minecraft Routes
  '/minecraft': 'Minecraft Text Color & Gradient Generator | PK Ultimate Guide',
  '/minecraft/generator': 'Minecraft Text Color & Gradient Generator | PK Ultimate Guide',
  '/minecraft/potions': 'Minecraft 1.21+ Potion Brewing Lab | PK Ultimate Guide',
  '/minecraft/ores': 'Minecraft Ore Elevation & Mining Heights | PK Ultimate Guide',
  '/minecraft/villagers': 'Minecraft Villager Trading & Workstations | PK Ultimate Guide',
  '/minecraft/redstone': 'Minecraft Redstone Timing & Logic Engine | PK Ultimate Guide',
  '/minecraft/enchanting': 'Minecraft Enchanting & Anvil Optimizer | PK Ultimate Guide',
  '/minecraft/mobs': 'Minecraft Mob Spawning & Raid Mechanics | PK Ultimate Guide',
};

export const PageMetaSync: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll smoothly to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Match route title
    let matchedTitle = ROUTE_TITLES[pathname];
    if (!matchedTitle) {
      if (pathname.startsWith('/maps/')) {
        const mapName = pathname.replace('/maps/', '').replace(/_/g, ' ').toUpperCase();
        matchedTitle = `ARK ${mapName} Resource Map | PK Ultimate Guide`;
      } else {
        matchedTitle = 'Signal Lost (404) | PK Ultimate Guide';
      }
    }

    document.title = matchedTitle;
  }, [pathname]);

  return null;
};
