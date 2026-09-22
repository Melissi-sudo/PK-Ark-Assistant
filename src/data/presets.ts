import { ServerRatePreset } from '../types';

export const SERVER_PRESETS: ServerRatePreset[] = [
  {
    id: 'official_small_tribes',
    name: 'Official Small Tribes',
    badge: '2.5x Rates',
    description: 'Standard Official 6-man Small Tribes PvP ruleset (2.5x taming & harvest, 2x breeding).',
    tamingMult: 2.5,
    harvestMult: 2.5,
    matingIntervalMult: 2.0,
    eggHatchMult: 2.0,
    babyMatureMult: 2.0,
    xpMult: 2.5
  },
  {
    id: 'arkpocalypse',
    name: 'ArkPocalypse',
    badge: '3.0x Wipes',
    description: 'Fast-paced monthly wipe official PvP servers with 3.0x accelerated multipliers.',
    tamingMult: 3.0,
    harvestMult: 3.0,
    matingIntervalMult: 3.0,
    eggHatchMult: 3.0,
    babyMatureMult: 3.0,
    xpMult: 3.0
  },
  {
    id: 'official_1x',
    name: 'Official Standard 1x',
    badge: '1.0x Hardcore',
    description: 'Base vanilla Ark Official 1x rates without any evolution event buffs.',
    tamingMult: 1.0,
    harvestMult: 1.0,
    matingIntervalMult: 1.0,
    eggHatchMult: 1.0,
    babyMatureMult: 1.0,
    xpMult: 1.0
  },
  {
    id: 'official_2x_evo',
    name: 'Official 2x Evolution',
    badge: '2.0x Weekend',
    description: 'Weekend Official Evolution event rate boost across all official clusters.',
    tamingMult: 2.0,
    harvestMult: 2.0,
    matingIntervalMult: 1.5,
    eggHatchMult: 2.0,
    babyMatureMult: 2.0,
    xpMult: 2.0
  },
  {
    id: 'custom',
    name: 'Custom Unofficial Rates',
    badge: 'Custom',
    description: 'Custom cluster multipliers configured for your specific private or unoffical server.',
    tamingMult: 5.0,
    harvestMult: 5.0,
    matingIntervalMult: 5.0,
    eggHatchMult: 5.0,
    babyMatureMult: 5.0,
    xpMult: 5.0
  }
];
