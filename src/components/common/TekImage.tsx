import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export interface TekImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  variant?: 'map' | 'dossier' | 'card' | 'thumbnail';
  loadingLabel?: string;
  fallbackSrc?: string;
}

export const TekImage = React.forwardRef<HTMLImageElement, TekImageProps>(({
  src,
  alt,
  className = '',
  containerClassName = '',
  variant = 'card',
  loadingLabel,
  fallbackSrc = '/images/placeholder_dino.svg',
  onError,
  onLoad,
  style,
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  // When src changes (e.g. switching maps, switching dinos), immediately activate loading screen
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
    onError?.(e);
  };

  // Determine default label based on variant
  const displayLabel = loadingLabel || (
    variant === 'map' ? 'DECODING TOPOGRAPHICAL CARTOGRAPHY...' :
    variant === 'dossier' ? 'TRANSMITTING SPECIMEN DOSSIER...' :
    variant === 'thumbnail' ? 'LOADING...' :
    'CALIBRATING ASSET TELEMETRY...'
  );

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {/* Underlying Real Image */}
      <img
        ref={ref}
        src={currentSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`transition-opacity duration-300 ease-out ${
          isLoading ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
        } ${className}`}
        style={style}
        {...props}
      />

      {/* ARK TEK LOADING SCREEN OVERLAY */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#030712] border border-cyan-500/30 overflow-hidden select-none animate-fadeIn">
          {/* Tactical Background Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #06b6d4 1.2px, transparent 0)',
              backgroundSize: variant === 'thumbnail' ? '12px 12px' : '20px 20px'
            }}
          />

          {/* Holographic Scanline Sweep Animation */}
          <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent pointer-events-none animate-tek-scanline" />

          {/* Variant-Specific Loading Content */}
          {variant === 'thumbnail' ? (
            /* Compact Skeleton for Small Avatars / Thumbnails */
            <div className="relative flex flex-col items-center justify-center p-1">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute" />
            </div>
          ) : variant === 'map' ? (
            /* Full-Scale Tactical Radar Loading Screen for Maps */
            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto space-y-4">
              {/* Rotating Cybernetic Compass Hologram */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/40 animate-spin-slow" />
                <div className="absolute inset-2 rounded-full border border-cyan-400/30 animate-ping opacity-25" />
                <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <Compass className="w-6 h-6 animate-pulse text-cyan-300" />
                </div>
              </div>

              {/* Status Text */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] sm:text-xs font-tek font-bold uppercase tracking-widest text-cyan-300">
                    TRANSMITTING MAP FEED
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold font-hud text-white tracking-wide">
                  {displayLabel}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  Loading high-resolution cartography and contours...
                </p>
              </div>

              {/* Shimmering Tek Progress Indicator */}
              <div className="w-48 sm:w-56 h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-cyan-500/40 relative">
                <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 rounded-full animate-tek-shimmer" />
              </div>
            </div>
          ) : (
            /* Dossier & Card Loading Screen (Dinos, Soakers, Ammunition) */
            <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center max-w-xs mx-auto space-y-3">
              {/* Pulsing Tactical Ring */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/50 animate-spin-slow" />
                <div className="w-9 h-9 rounded-full bg-cyan-950/70 border border-cyan-400/80 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                </div>
              </div>

              {/* Status Header */}
              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] font-tek font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>DECODING ASSET</span>
                </div>
                <div className="text-xs font-bold font-hud text-white tracking-wide truncate max-w-[200px]">
                  {displayLabel}
                </div>
              </div>

              {/* Shimmer Bar */}
              <div className="w-32 sm:w-40 h-1 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30 relative">
                <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-cyan-500 via-sky-300 to-cyan-500 rounded-full animate-tek-shimmer" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TekImage.displayName = 'TekImage';
