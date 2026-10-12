import React from 'react';

export const SulfurIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2L4.5 9.5L7 12L4 15L8 19L12 15L16 19L20 15L17 12L19.5 9.5L12 2Z" fill="#eab308" />
    <circle cx="12" cy="11" r="2.5" fill="#ca8a04" />
  </svg>
);

export const GunpowderIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M5 19L19 19L17 8L15 4L9 4L7 8L5 19Z" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
    <path d="M9 13L15 13L14 17L10 17Z" fill="#1e293b" />
    <circle cx="12" cy="6" r="1.5" fill="#f97316" />
  </svg>
);

export const ExplosivesIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <rect x="4" y="6" width="16" height="12" rx="2" fill="#b91c1c" stroke="#f87171" strokeWidth="1" />
    <rect x="7" y="4" width="2" height="2" fill="#facc15" />
    <rect x="15" y="4" width="2" height="2" fill="#facc15" />
    <path d="M7 11H17M7 14H14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ScrapIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="#78350f" stroke="#d97706" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3.5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
    <path d="M12 3V6M12 18V21M3 12H6M18 12H21" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const HqmIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
    <polygon points="12,6 18,10 18,14 12,18 6,14 6,10" fill="#0369a1" />
  </svg>
);

export const MetalFragsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <polygon points="4,18 12,5 20,18" fill="#64748b" stroke="#cbd5e1" strokeWidth="1.5" />
    <polygon points="8,17 12,9 16,17" fill="#475569" />
  </svg>
);

export const LowGradeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <rect x="5" y="7" width="14" height="14" rx="2" fill="#ea580c" stroke="#fdba74" strokeWidth="1" />
    <rect x="8" y="3" width="8" height="4" rx="1" fill="#c2410c" />
    <path d="M9 12C9 10.5 12 8 12 8C12 8 15 10.5 15 12C15 13.65 13.65 15 12 15C10.35 15 9 13.65 9 12Z" fill="#fef08a" />
  </svg>
);

export const CharcoalIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <polygon points="6,19 12,4 18,19" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
    <polygon points="9,18 12,9 15,18" fill="#0f172a" />
    <circle cx="12" cy="14" r="1.5" fill="#f97316" />
  </svg>
);
