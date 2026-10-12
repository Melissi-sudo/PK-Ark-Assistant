import React from 'react';

interface SkeletonBlockProps {
  className?: string;
  theme?: 'default' | 'cyan' | 'purple' | 'emerald' | 'orange';
  rounded?: string;
  style?: React.CSSProperties;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  className = '',
  theme = 'default',
  rounded = 'rounded-xl',
  style
}) => {
  const themeClass = 
    theme === 'cyan' ? 'shimmer-mask-cyan' :
    theme === 'purple' ? 'shimmer-mask-purple' :
    theme === 'emerald' ? 'shimmer-mask-emerald' :
    theme === 'orange' ? 'shimmer-mask-orange' : '';

  return (
    <div
      style={style}
      className={`bg-[#0a1324]/80 border border-white/[0.05] shimmer-mask ${themeClass} ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
};
