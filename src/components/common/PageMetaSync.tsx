import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'PK Ark Assistant | Official ARK PvP Companion',
  '/taming': 'Taming Calculator & Starve Engine | PK Ark Assistant',
  '/soakers': 'Turret Soaker Hitbox Matrix & PvP Meta | PK Ark Assistant',
  '/pyromane': 'Pyromane Taming & Combat Guide | PK Ark Assistant',
  '/breeding': 'Breeding, Incubation & Mutation Hub | PK Ark Assistant',
  '/maps': 'Topographical Interactive Resource Maps | PK Ark Assistant',
  '/resources': 'Tribe Ammo & Gunpowder Quota | PK Ark Assistant',
  '/ammo': 'Tribe Ammo & Gunpowder Quota | PK Ark Assistant',
  '/stats': 'Dino Wild Stats & Mutation Lookup | PK Ark Assistant',
  '/timers': 'War Room Raid Timers & Alarms | PK Ark Assistant',
  '/store': 'PK Store Small Tribes Vault Lines | PK Ark Assistant',
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
        matchedTitle = `${mapName} Resource Map | PK Ark Assistant`;
      } else {
        matchedTitle = 'Signal Lost (404) | PK Ark Assistant';
      }
    }

    document.title = matchedTitle;
  }, [pathname]);

  return null;
};
