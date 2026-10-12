import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// -------------------------------------------------------------
// TERRARIA HEARTS, STARS & COINS
// -------------------------------------------------------------
export const TerrariaHeart: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 16 16" 
    width={size} 
    height={size} 
    className={`inline-block shrink-0 fill-current ${className}`}
    shapeRendering="crispEdges"
  >
    {/* Pixel Art Red Health Heart */}
    <rect x="2" y="1" width="4" height="2" fill="#ef4444" />
    <rect x="10" y="1" width="4" height="2" fill="#ef4444" />
    <rect x="1" y="3" width="6" height="2" fill="#dc2626" />
    <rect x="9" y="3" width="6" height="2" fill="#dc2626" />
    <rect x="0" y="5" width="16" height="4" fill="#b91c1c" />
    <rect x="2" y="9" width="12" height="2" fill="#991b1b" />
    <rect x="4" y="11" width="8" height="2" fill="#7f1d1d" />
    <rect x="6" y="13" width="4" height="2" fill="#450a0a" />
    {/* Highlight */}
    <rect x="3" y="2" width="2" height="2" fill="#fca5a5" />
    <rect x="2" y="4" width="2" height="2" fill="#f87171" />
  </svg>
);

export const TerrariaGoldHeart: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 16 16" 
    width={size} 
    height={size} 
    className={`inline-block shrink-0 fill-current ${className}`}
    shapeRendering="crispEdges"
  >
    {/* Life Fruit Golden Heart */}
    <rect x="2" y="1" width="4" height="2" fill="#facc15" />
    <rect x="10" y="1" width="4" height="2" fill="#facc15" />
    <rect x="1" y="3" width="6" height="2" fill="#eab308" />
    <rect x="9" y="3" width="6" height="2" fill="#eab308" />
    <rect x="0" y="5" width="16" height="4" fill="#ca8a04" />
    <rect x="2" y="9" width="12" height="2" fill="#a16207" />
    <rect x="4" y="11" width="8" height="2" fill="#854d0e" />
    <rect x="6" y="13" width="4" height="2" fill="#713f12" />
    {/* Highlight */}
    <rect x="3" y="2" width="2" height="2" fill="#fef08a" />
    <rect x="2" y="4" width="2" height="2" fill="#fef9c3" />
  </svg>
);

export const TerrariaManaStar: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg 
    viewBox="0 0 16 16" 
    width={size} 
    height={size} 
    className={`inline-block shrink-0 fill-current ${className}`}
    shapeRendering="crispEdges"
  >
    {/* Blue Mana Star */}
    <rect x="7" y="0" width="2" height="2" fill="#60a5fa" />
    <rect x="6" y="2" width="4" height="2" fill="#3b82f6" />
    <rect x="1" y="5" width="14" height="2" fill="#2563eb" />
    <rect x="3" y="7" width="10" height="2" fill="#1d4ed8" />
    <rect x="5" y="9" width="6" height="2" fill="#1e40af" />
    <rect x="3" y="11" width="3" height="3" fill="#1e3a8a" />
    <rect x="10" y="11" width="3" height="3" fill="#1e3a8a" />
    <rect x="7" y="3" width="2" height="4" fill="#93c5fd" />
  </svg>
);

export type CoinTier = 'copper' | 'silver' | 'gold' | 'platinum';

export const TerrariaCoin: React.FC<IconProps & { tier: CoinTier }> = ({ tier, className = 'w-3.5 h-3.5', size }) => {
  const colors = {
    copper: { main: '#ea580c', border: '#9a3412', light: '#fdba74' },
    silver: { main: '#94a3b8', border: '#475569', light: '#f1f5f9' },
    gold: { main: '#eab308', border: '#854d0e', light: '#fef08a' },
    platinum: { main: '#06b6d4', border: '#0e7490', light: '#cffafe' }
  }[tier];

  return (
    <svg 
      viewBox="0 0 12 12" 
      width={size} 
      height={size} 
      className={`inline-block shrink-0 ${className}`}
      shapeRendering="crispEdges"
    >
      <rect x="3" y="1" width="6" height="10" fill={colors.border} />
      <rect x="1" y="3" width="10" height="6" fill={colors.border} />
      <rect x="2" y="2" width="8" height="8" fill={colors.main} />
      <rect x="3" y="3" width="3" height="3" fill={colors.light} />
      <rect x="5" y="5" width="2" height="2" fill={colors.border} />
    </svg>
  );
};

// -------------------------------------------------------------
// 18 BOSS ICONS (AUTHENTIC PIXEL-VECTOR ART)
// -------------------------------------------------------------

export const KingSlimeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none" stroke="currentColor">
    {/* Slime body */}
    <path 
      d="M4 17C4 11 7 8 12 8C17 8 20 11 20 17C20 20 17 21 12 21C7 21 4 20 4 17Z" 
      fill="#38bdf8" 
      fillOpacity="0.75" 
      stroke="#0284c7" 
      strokeWidth="1.5"
    />
    {/* Inside ninja core */}
    <circle cx="12" cy="15" r="2.5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
    {/* Gold Crown */}
    <path 
      d="M8 8L7 3L10 5L12 2L14 5L17 3L16 8H8Z" 
      fill="#facc15" 
      stroke="#ca8a04" 
      strokeWidth="1.2"
      strokeLinejoin="round" 
    />
    <circle cx="12" cy="5" r="0.8" fill="#ef4444" />
    <circle cx="9" cy="5.5" r="0.6" fill="#3b82f6" />
    <circle cx="15" cy="5.5" r="0.6" fill="#10b981" />
  </svg>
);

export const EyeOfCthulhuIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Eyeball body */}
    <ellipse cx="12" cy="12" rx="9" ry="8" fill="#f8fafc" stroke="#dc2626" strokeWidth="1.5" />
    {/* Red blood veins */}
    <path d="M4 10C6 11 8 10 9 12M5 15C7 14 8 15 10 13M19 9C17 10 16 10 15 11" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
    {/* Blue iris */}
    <circle cx="13" cy="12" r="4.5" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
    {/* Black pupil with highlight */}
    <circle cx="13" cy="12" r="2.2" fill="#0f172a" />
    <circle cx="14" cy="11" r="0.8" fill="#ffffff" />
    {/* Back tendrils */}
    <path d="M3 11L1 10M3 13L0.5 13M3 15L1 16" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const EaterOfWorldsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Corrupt worm head & segments */}
    <circle cx="7" cy="17" r="3.5" fill="#6d28d9" stroke="#4c1d95" strokeWidth="1" />
    <circle cx="11" cy="14" r="4" fill="#7c3aed" stroke="#5b21b6" strokeWidth="1" />
    <circle cx="16" cy="10" r="4.5" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1.2" />
    {/* Mandible teeth */}
    <path d="M19 7L23 5L20 9" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
    <path d="M21 11L24 13L19 13" fill="#22c55e" stroke="#15803d" strokeWidth="0.8" />
    {/* Multiple glowing green eyes */}
    <circle cx="15" cy="8.5" r="0.9" fill="#4ade80" />
    <circle cx="17.5" cy="8.5" r="0.9" fill="#4ade80" />
    <circle cx="16" cy="11.5" r="0.9" fill="#4ade80" />
    <circle cx="10" cy="13.5" r="0.8" fill="#4ade80" />
  </svg>
);

export const BrainOfCthulhuIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Brain lobes */}
    <path 
      d="M7 6C4 7 4 11 5 13C4 16 6 18 9 18C10 20 14 20 15 18C18 18 20 16 19 13C20 11 20 7 17 6C15 5 13 6 12 7C11 6 9 5 7 6Z" 
      fill="#ef4444" 
      stroke="#b91c1c" 
      strokeWidth="1.5"
    />
    {/* Creepers floating */}
    <circle cx="4" cy="5" r="2" fill="#f87171" stroke="#991b1b" strokeWidth="0.8" />
    <circle cx="4" cy="5" r="0.8" fill="#450a0a" />
    <circle cx="20" cy="6" r="2" fill="#f87171" stroke="#991b1b" strokeWidth="0.8" />
    <circle cx="20" cy="6" r="0.8" fill="#450a0a" />
    {/* Brain fissures & center eye */}
    <path d="M12 7V16M9 9C8 11 8 13 9 15M15 9C16 11 16 13 15 15" stroke="#7f1d1d" strokeWidth="1" strokeLinecap="round" />
    <ellipse cx="12" cy="13" rx="2.5" ry="3" fill="#fef2f2" stroke="#991b1b" strokeWidth="1" />
    <circle cx="12" cy="13" r="1.3" fill="#dc2626" />
  </svg>
);

export const QueenBeeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Wings */}
    <ellipse cx="8" cy="7" rx="5" ry="3" fill="#e0f2fe" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="0.8" transform="rotate(-25 8 7)" />
    <ellipse cx="16" cy="7" rx="5" ry="3" fill="#e0f2fe" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="0.8" transform="rotate(25 16 7)" />
    {/* Striped Bee Body */}
    <ellipse cx="12" cy="14" rx="5" ry="6.5" fill="#facc15" stroke="#854d0e" strokeWidth="1.2" />
    <rect x="7.5" y="11" width="9" height="1.8" fill="#1c1917" rx="0.5" />
    <rect x="7.5" y="14" width="9" height="1.8" fill="#1c1917" rx="0.5" />
    <rect x="8.5" y="17" width="7" height="1.5" fill="#1c1917" rx="0.5" />
    {/* Stinger */}
    <polygon points="12,22 10.5,19 13.5,19" fill="#1c1917" />
    {/* Head & antennas */}
    <circle cx="12" cy="8.5" r="3" fill="#713f12" />
    <circle cx="10.8" cy="8" r="0.8" fill="#ef4444" />
    <circle cx="13.2" cy="8" r="0.8" fill="#ef4444" />
    <path d="M11 6L9 3M13 6L15 3" stroke="#713f12" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const SkeletronIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Skeletal Hands */}
    <path d="M2 14L4 12L5 15L3 17Z" fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
    <path d="M22 14L20 12L19 15L21 17Z" fill="#e2e8f0" stroke="#475569" strokeWidth="0.8" />
    {/* Skull cranium */}
    <path 
      d="M6 10C6 5.5 8.5 3 12 3C15.5 3 18 5.5 18 10C18 13 16.5 15 15 15V19C15 20 14 21 13 21H11C10 21 9 20 9 19V15C7.5 15 6 13 6 10Z" 
      fill="#f1f5f9" 
      stroke="#64748b" 
      strokeWidth="1.4"
    />
    {/* Deep dark eye sockets */}
    <ellipse cx="9.5" cy="10" rx="1.8" ry="2.2" fill="#0f172a" />
    <ellipse cx="14.5" cy="10" rx="1.8" ry="2.2" fill="#0f172a" />
    {/* Nasal cavity & teeth */}
    <polygon points="12,13 11,15 13,15" fill="#0f172a" />
    <path d="M10 18H14M11 16V20M13 16V20" stroke="#0f172a" strokeWidth="1" />
  </svg>
);

export const DeerclopsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Antlers */}
    <path d="M5 8L3 3M4 5L1 5M19 8L21 3M20 5L23 5" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
    {/* Beast face */}
    <path 
      d="M7 8C7 6 9 5 12 5C15 5 17 6 17 8C18 12 18 16 16 19C14 21 10 21 8 19C6 16 6 12 7 8Z" 
      fill="#334155" 
      stroke="#1e293b" 
      strokeWidth="1.4"
    />
    {/* Fur mane */}
    <path d="M6 12L4 14L6 16M18 12L20 14L18 16" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
    {/* Single giant blue eye */}
    <circle cx="12" cy="11.5" r="3.2" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
    <circle cx="12" cy="11.5" r="1.5" fill="#0f172a" />
    <circle cx="12.7" cy="10.8" r="0.6" fill="#ffffff" />
    {/* Jagged teeth */}
    <path d="M9 17L10 16L11 17L12 16L13 17L14 16L15 17" stroke="#e2e8f0" strokeWidth="1.2" />
  </svg>
);

export const WallOfFleshIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Flesh column border */}
    <rect x="2" y="2" width="6" height="20" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.2" rx="1" />
    <rect x="5" y="4" width="2" height="16" fill="#dc2626" />
    {/* Top Eye */}
    <circle cx="13" cy="6" r="3.5" fill="#f8fafc" stroke="#991b1b" strokeWidth="1" />
    <circle cx="14" cy="6" r="1.8" fill="#dc2626" />
    <circle cx="14" cy="6" r="0.8" fill="#0f172a" />
    {/* Bottom Eye */}
    <circle cx="13" cy="18" r="3.5" fill="#f8fafc" stroke="#991b1b" strokeWidth="1" />
    <circle cx="14" cy="18" r="1.8" fill="#dc2626" />
    <circle cx="14" cy="18" r="0.8" fill="#0f172a" />
    {/* Giant Mouth Maw */}
    <path d="M10 10C14 10 19 11 19 12C19 13 14 14 10 14Z" fill="#450a0a" stroke="#7f1d1d" strokeWidth="1" />
    <path d="M12 10.5L13 11.5L14 10.5M12 13.5L13 12.5L14 13.5" stroke="#f8fafc" strokeWidth="1" />
    {/* Hungry Leech Tentacle */}
    <path d="M19 12C21 11 22 13 23 12" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const QueenSlimeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Translucent Crystal Wings */}
    <path d="M6 10C3 7 2 4 4 3C7 3 9 7 8 10Z" fill="#f472b6" fillOpacity="0.7" stroke="#ec4899" strokeWidth="1" />
    <path d="M18 10C21 7 22 4 20 3C17 3 15 7 16 10Z" fill="#f472b6" fillOpacity="0.7" stroke="#ec4899" strokeWidth="1" />
    {/* Gelatin body */}
    <path 
      d="M5 17C5 11 8 8 12 8C16 8 19 11 19 17C19 20 16 21 12 21C8 21 5 20 5 17Z" 
      fill="#f472b6" 
      fillOpacity="0.85" 
      stroke="#db2777" 
      strokeWidth="1.5"
    />
    {/* Floating Gelatin Crystal inside */}
    <polygon points="12,11 15,14 12,17 9,14" fill="#a855f7" stroke="#9333ea" strokeWidth="1" />
    {/* Crystal Crown */}
    <path d="M9 8L8 4L10.5 5.5L12 3L13.5 5.5L16 4L15 8H9Z" fill="#e879f9" stroke="#c026d3" strokeWidth="1" />
  </svg>
);

export const TheDestroyerIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Mechanical Steel Worm Segments */}
    <rect x="2" y="13" width="5" height="6" rx="1.5" fill="#475569" stroke="#334155" strokeWidth="1" />
    <rect x="7" y="10" width="6" height="7" rx="1.5" fill="#64748b" stroke="#475569" strokeWidth="1" />
    <rect x="13" y="6" width="7" height="9" rx="2" fill="#94a3b8" stroke="#64748b" strokeWidth="1.2" />
    {/* Head Mandibles */}
    <path d="M20 7L24 5L21 9M20 14L24 16L21 12" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
    {/* Glowing Red Laser Probes */}
    <circle cx="16.5" cy="10.5" r="1.8" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
    <circle cx="10" cy="13.5" r="1.2" fill="#ef4444" />
    <circle cx="4.5" cy="16" r="1" fill="#ef4444" />
  </svg>
);

export const TheTwinsIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Connecting optic nerve cord */}
    <path d="M8 12C10 15 14 9 16 12" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2 1" />
    {/* Retinazer (Red laser eye) */}
    <circle cx="7" cy="12" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.2" />
    <circle cx="6" cy="12" r="2.2" fill="#dc2626" />
    <circle cx="5" cy="12" r="0.8" fill="#f87171" />
    {/* Spazmatism (Green cursed flame eye) */}
    <circle cx="17" cy="12" r="5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.2" />
    <circle cx="18" cy="12" r="2.2" fill="#16a34a" />
    <circle cx="19" cy="12" r="0.8" fill="#4ade80" />
    {/* Mechanical plating trims */}
    <path d="M3 10V14M21 10V14" stroke="#334155" strokeWidth="1.2" />
  </svg>
);

export const SkeletronPrimeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Mechanical Arms: Prime Saw & Prime Laser */}
    <path d="M2 5L6 9M2 5L4 4M2 5L1 7" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M22 5L18 9M22 5L20 4M22 5L23 7" stroke="#eab308" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M3 19L7 16" stroke="#94a3b8" strokeWidth="1.2" />
    <path d="M21 19L17 16" stroke="#94a3b8" strokeWidth="1.2" />
    {/* Steel skull cranium */}
    <path 
      d="M7 10C7 6 9 4 12 4C15 4 17 6 17 10C17 12 16 14 15 15V19H9V15C8 14 7 12 7 10Z" 
      fill="#cbd5e1" 
      stroke="#475569" 
      strokeWidth="1.4"
    />
    {/* Glowing Red Laser Eye Sockets */}
    <circle cx="10" cy="10" r="1.6" fill="#dc2626" />
    <circle cx="14" cy="10" r="1.6" fill="#dc2626" />
    {/* Steel rivets */}
    <rect x="9.5" y="16" width="5" height="2" fill="#334155" />
    <circle cx="12" cy="6" r="0.8" fill="#ef4444" />
  </svg>
);

export const PlanteraIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Vine Hooks */}
    <path d="M3 14C5 12 7 15 9 13M21 14C19 12 17 15 15 13" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
    {/* Pink outer petals */}
    <path d="M7 12C6 7 10 5 12 7C14 5 18 7 17 12C18 16 14 19 12 20C10 19 6 16 7 12Z" fill="#ec4899" stroke="#be185d" strokeWidth="1.2" />
    {/* Sharp Carnivorous Jungle Flower Maw */}
    <ellipse cx="12" cy="12" rx="3.5" ry="4.5" fill="#f43f5e" stroke="#9f1239" strokeWidth="1" />
    {/* Spiked teeth */}
    <path d="M9.5 11L10.5 12L9.5 13M14.5 11L13.5 12L14.5 13" stroke="#fef08a" strokeWidth="1.2" />
    {/* Spore particles */}
    <circle cx="12" cy="4" r="1" fill="#4ade80" />
    <circle cx="6" cy="6" r="0.8" fill="#4ade80" />
    <circle cx="18" cy="6" r="0.8" fill="#4ade80" />
  </svg>
);

export const GolemIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Lihzahrd Sun Altar Idol Head */}
    <rect x="6" y="5" width="12" height="12" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="1.4" />
    {/* Stone Brow */}
    <rect x="5" y="4" width="14" height="3" fill="#b45309" rx="1" />
    {/* Glowing Orange Sun Gem Eyes */}
    <circle cx="9.5" cy="10" r="1.5" fill="#fef08a" stroke="#ea580c" strokeWidth="0.8" />
    <circle cx="14.5" cy="10" r="1.5" fill="#fef08a" stroke="#ea580c" strokeWidth="0.8" />
    {/* Lihzahrd Maw with fire laser emitter */}
    <rect x="9" y="13" width="6" height="2.5" fill="#451a03" />
    <rect x="10.5" y="13.5" width="3" height="1.5" fill="#f97316" />
    {/* Stone Fists */}
    <rect x="2" y="11" width="3" height="5" rx="1" fill="#b45309" stroke="#78350f" strokeWidth="1" />
    <rect x="19" y="11" width="3" height="5" rx="1" fill="#b45309" stroke="#78350f" strokeWidth="1" />
  </svg>
);

export const EmpressOfLightIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Prismatic Fairy Butterfly Wings */}
    <path d="M12 11C8 4 2 5 3 10C4 13 8 13 12 14Z" fill="#c084fc" fillOpacity="0.85" stroke="#9333ea" strokeWidth="1" />
    <path d="M12 11C16 4 22 5 21 10C20 13 16 13 12 14Z" fill="#38bdf8" fillOpacity="0.85" stroke="#0284c7" strokeWidth="1" />
    <path d="M12 14C9 17 4 19 6 22C9 22 11 18 12 15Z" fill="#f472b6" fillOpacity="0.8" stroke="#db2777" strokeWidth="0.8" />
    <path d="M12 14C15 17 20 19 18 22C15 22 13 18 12 15Z" fill="#facc15" fillOpacity="0.8" stroke="#ca8a04" strokeWidth="0.8" />
    {/* Radiant Empress Crown & Body */}
    <ellipse cx="12" cy="11" rx="2" ry="4" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
    <polygon points="12,3 10.5,6 13.5,6" fill="#facc15" />
    {/* Prismatic Lance swords */}
    <line x1="12" y1="1" x2="12" y2="4" stroke="#f43f5e" strokeWidth="1.5" />
  </svg>
);

export const DukeFishronIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Ocean Dragon Wings */}
    <path d="M10 8C7 4 4 4 5 7C6 9 8 10 10 11Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
    <path d="M15 8C18 4 21 4 20 7C19 9 17 10 15 11Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
    {/* Mutant Shark Pig Body */}
    <path 
      d="M5 13C5 9 8 8 13 8C18 8 20 10 20 14C20 18 17 20 12 20C7 20 5 18 5 13Z" 
      fill="#06b6d4" 
      stroke="#0891b2" 
      strokeWidth="1.4"
    />
    {/* Yellow Glowing Eyes */}
    <circle cx="16" cy="11.5" r="1.8" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
    <circle cx="16.5" cy="11.5" r="0.8" fill="#0f172a" />
    {/* Shark Fin & Tusks */}
    <path d="M12 4L14 8H10Z" fill="#0891b2" />
    <polygon points="18,15 21,17 18,17" fill="#f8fafc" />
    {/* Cthulhunado water bubbles */}
    <circle cx="4" cy="10" r="1" fill="#38bdf8" />
    <circle cx="3" cy="14" r="1.2" fill="#38bdf8" />
  </svg>
);

export const LunaticCultistIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Mystical Lunar Sigil halo */}
    <circle cx="12" cy="8" r="7" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 2" />
    {/* Plague Bird Hood & Robe */}
    <path 
      d="M12 3C9 3 7 6 7 10C7 14 6 18 5 21H19C18 18 17 14 17 10C17 6 15 3 12 3Z" 
      fill="#1e1b4b" 
      stroke="#312e81" 
      strokeWidth="1.4"
    />
    {/* Golden Beak Mask */}
    <polygon points="12,14 10,9 14,9" fill="#eab308" stroke="#ca8a04" strokeWidth="0.8" />
    {/* Glowing Blue Cultist Eyes */}
    <circle cx="9.5" cy="8.5" r="1" fill="#38bdf8" />
    <circle cx="14.5" cy="8.5" r="1" fill="#38bdf8" />
    {/* Ancient manipulator talisman */}
    <circle cx="12" cy="17" r="1.5" fill="#f43f5e" />
  </svg>
);

export const MoonLordIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} fill="none">
    {/* Cosmic Celestial Head */}
    <path 
      d="M7 9C7 5 9 3 12 3C15 3 17 5 17 9C18 12 18 15 17 17C16 19 14 20 12 20C10 20 8 19 7 17C6 15 6 12 7 9Z" 
      fill="#0d9488" 
      stroke="#115e59" 
      strokeWidth="1.4"
    />
    {/* Forehead Phantasmal Eye */}
    <ellipse cx="12" cy="7" rx="2.2" ry="1.4" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
    <circle cx="12" cy="7" r="0.7" fill="#0f172a" />
    {/* True Eyes of Cthulhu (Hands) */}
    <circle cx="3.5" cy="12" r="2.5" fill="#ccfbf1" stroke="#0f766e" strokeWidth="1" />
    <circle cx="3.5" cy="12" r="1" fill="#0f172a" />
    <circle cx="20.5" cy="12" r="2.5" fill="#ccfbf1" stroke="#0f766e" strokeWidth="1" />
    <circle cx="20.5" cy="12" r="1" fill="#0f172a" />
    {/* Cephalopod Beard Tentacles */}
    <path d="M10 17C9 19 9 21 8 22M12 18V23M14 17C15 19 15 21 16 22" stroke="#14b8a6" strokeWidth="1.3" strokeLinecap="round" />
    {/* Chest Core */}
    <circle cx="12" cy="14" r="1.8" fill="#f43f5e" stroke="#9f1239" strokeWidth="0.8" />
  </svg>
);

// -------------------------------------------------------------
// ITEMS, TOOLS & CONTAINMENT ICONS
// -------------------------------------------------------------

export const PurificationPowderIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
    {/* Pouch */}
    <path d="M5 8C5 6 7 5 10 5C13 5 15 6 15 8L16 15C16 17 14 18 10 18C6 18 4 17 4 15L5 8Z" fill="#15803d" stroke="#166534" strokeWidth="1.2" />
    {/* Golden tie string */}
    <line x1="7" y1="8" x2="13" y2="8" stroke="#facc15" strokeWidth="1.5" />
    {/* Sparkling powder dots */}
    <circle cx="10" cy="12" r="1" fill="#86efac" />
    <circle cx="8" cy="14" r="0.8" fill="#86efac" />
    <circle cx="12" cy="14" r="0.8" fill="#86efac" />
    <path d="M14 3L15 5L17 5L15.5 6.5L16 8.5L14 7.2L12 8.5L12.5 6.5L11 5L13 5Z" fill="#facc15" />
  </svg>
);

export const ClentaminatorIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
    {/* Steampunk Pressurized Rifle Barrel */}
    <rect x="2" y="9" width="13" height="3" rx="0.5" fill="#b45309" stroke="#78350f" strokeWidth="1" />
    <rect x="14" y="8.5" width="4" height="4" rx="1" fill="#facc15" stroke="#a16207" strokeWidth="1" />
    {/* Solution Canister tank */}
    <rect x="5" y="5" width="5" height="4" rx="1" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
    {/* Grip */}
    <path d="M4 12L3 16H6L7 12" fill="#78350f" stroke="#451a03" strokeWidth="1" />
    {/* Pressure gauge */}
    <circle cx="11" cy="7" r="1.5" fill="#f8fafc" stroke="#475569" strokeWidth="0.8" />
  </svg>
);

export const TerraformerIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
    {/* Shimmer-infused Upgraded Beam Cannon */}
    <rect x="2" y="9" width="13" height="3.5" rx="0.5" fill="#6366f1" stroke="#4338ca" strokeWidth="1" />
    <rect x="14" y="7.5" width="5" height="6" rx="1.5" fill="#c084fc" stroke="#7e22ce" strokeWidth="1.2" />
    {/* Lavender Shimmer tank */}
    <rect x="5" y="4" width="6" height="5" rx="1" fill="#e879f9" stroke="#a21caf" strokeWidth="1" />
    {/* Energy coils */}
    <line x1="7" y1="10.5" x2="13" y2="10.5" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="1.5 1" />
    {/* Grip */}
    <path d="M4 12.5L3 16.5H6L7 12.5" fill="#4338ca" stroke="#312e81" strokeWidth="1" />
  </svg>
);

export const GreenSolutionIcon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" className={`shrink-0 ${className}`} fill="none">
    {/* Solution Ampoule / Vial */}
    <rect x="6" y="2" width="4" height="2" fill="#94a3b8" />
    <path d="M4 4H12V13C12 14.1 11.1 15 10 15H6C4.9 15 4 14.1 4 13V4Z" fill="#15803d" stroke="#166534" strokeWidth="1" />
    <rect x="5" y="6" width="6" height="7" rx="1" fill="#22c55e" />
    <circle cx="7" cy="9" r="0.8" fill="#86efac" />
    <circle cx="9" cy="11" r="0.6" fill="#86efac" />
  </svg>
);

export const SunflowerIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
    {/* Stem */}
    <path d="M10 10V18" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 14C8 13 7 14 6 15" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 13C12 12 13 13 14 14" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
    {/* Petals */}
    <circle cx="10" cy="7" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
    {/* Seed center */}
    <circle cx="10" cy="7" r="2.2" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
  </svg>
);

export const QuarantineTunnelIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
    {/* 3-6 block gap schematic */}
    <rect x="2" y="2" width="5" height="16" fill="#7e22ce" stroke="#581c87" strokeWidth="1" />
    <rect x="13" y="2" width="5" height="16" fill="#15803d" stroke="#166534" strokeWidth="1" />
    {/* Non-corruptible wood/brick barrier */}
    <rect x="7" y="2" width="2" height="16" fill="#92400e" stroke="#78350f" strokeWidth="0.8" />
    <rect x="9" y="2" width="4" height="16" fill="#090d16" stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />
    {/* Measuring arrows */}
    <path d="M9 10H13M9 10L10.5 8.5M9 10L10.5 11.5M13 10L11.5 8.5M13 10L11.5 11.5" stroke="#38bdf8" strokeWidth="1" />
  </svg>
);

export const PwnhammerIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
    {/* Hammer Handle */}
    <line x1="6" y1="17" x2="13" y2="8" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
    {/* Ancient Hammer Head */}
    <polygon points="10,5 17,2 18,9 11,12" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.2" />
    <rect x="11.5" y="4" width="4" height="4" fill="#facc15" rx="0.5" />
  </svg>
);

export const ShimmerIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
    <ellipse cx="10" cy="12" rx="8" ry="5" fill="#a855f7" fillOpacity="0.75" stroke="#c084fc" strokeWidth="1.2" />
    <path d="M4 11C7 10 9 13 12 11C14 10 15 12 16 11" stroke="#f472b6" strokeWidth="1" strokeLinecap="round" />
    {/* Celestial sparkles */}
    <polygon points="10,2 10.8,4.2 13,5 10.8,5.8 10,8 9.2,5.8 7,5 9.2,4.2" fill="#38bdf8" />
    <polygon points="4,5 4.5,6.5 6,7 4.5,7.5 4,9 3.5,7.5 2,7 3.5,6.5" fill="#f472b6" />
  </svg>
);

// -------------------------------------------------------------
// DYNAMIC BOSS ICON RESOLVER
// -------------------------------------------------------------
export const TerrariaBossIcon: React.FC<{ bossId: string; className?: string }> = ({ bossId, className = 'w-6 h-6' }) => {
  switch (bossId) {
    case 'king-slime':
      return <KingSlimeIcon className={className} />;
    case 'eye-of-cthulhu':
      return <EyeOfCthulhuIcon className={className} />;
    case 'eater-of-worlds':
      return <EaterOfWorldsIcon className={className} />;
    case 'brain-of-cthulhu':
      return <BrainOfCthulhuIcon className={className} />;
    case 'queen-bee':
      return <QueenBeeIcon className={className} />;
    case 'skeletron':
      return <SkeletronIcon className={className} />;
    case 'deerclops':
      return <DeerclopsIcon className={className} />;
    case 'wall-of-flesh':
      return <WallOfFleshIcon className={className} />;
    case 'queen-slime':
      return <QueenSlimeIcon className={className} />;
    case 'the-destroyer':
      return <TheDestroyerIcon className={className} />;
    case 'the-twins':
      return <TheTwinsIcon className={className} />;
    case 'skeletron-prime':
      return <SkeletronPrimeIcon className={className} />;
    case 'plantera':
      return <PlanteraIcon className={className} />;
    case 'golem':
      return <GolemIcon className={className} />;
    case 'empress-of-light':
      return <EmpressOfLightIcon className={className} />;
    case 'duke-fishron':
      return <DukeFishronIcon className={className} />;
    case 'lunatic-cultist':
      return <LunaticCultistIcon className={className} />;
    case 'moon-lord':
      return <MoonLordIcon className={className} />;
    default:
      return <KingSlimeIcon className={className} />;
  }
};
