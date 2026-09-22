import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, Zap, Shield, Sparkles, X } from 'lucide-react';

interface PkStoreBannerProps {
  onOpenStoreModal?: () => void;
}

export const PkStoreBanner: React.FC<PkStoreBannerProps> = ({ onOpenStoreModal }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="bg-amber-950/30 border-b border-amber-500/20 px-3 py-1 flex items-center justify-between text-xs text-amber-300/80">
        <span className="flex items-center gap-1.5 font-hud">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          SPONSORED: Need bulk ARB or boss lines fast?
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDismissed(false)}
            className="hover:text-amber-200 underline cursor-pointer"
          >
            Show Sponsor Notice
          </button>
          <a
            href="https://discord.gg/C9pD2yduw9"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded text-[11px] text-amber-200 font-bold transition-all"
          >
            PK Store Discord
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#140c06] via-[#1c1208] to-[#120a04] border-b border-amber-500/30 px-3 sm:px-4 py-2.5 shadow-lg shadow-black/40">
      {/* Background cyber accent glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0 shadow-sm shadow-amber-500/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded font-tek">
                Official PvP Sponsor
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-100 font-hud tracking-wide">
                PK STORE // SKIP THE GRIND
              </span>
            </div>
            <p className="text-xs text-amber-200/80 line-clamp-1 mt-0.5">
              Instant Boss-Ready Dinos, 254 Max Stat Lines, 200k+ Bulk ARB, & Tek Kits on Official & Small Tribes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenStoreModal && (
            <button
              onClick={onOpenStoreModal}
              className="px-2.5 py-1.5 text-xs text-amber-300 hover:text-white bg-amber-900/40 hover:bg-amber-900/70 border border-amber-500/30 rounded font-hud font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              View Services
            </button>
          )}

          <a
            href="https://discord.gg/C9pD2yduw9"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded shadow-md shadow-amber-500/20 font-hud tracking-wider flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            <span>JOIN DISCORD</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setIsDismissed(true)}
            title="Dismiss sponsor banner"
            className="p-1 text-amber-400/60 hover:text-amber-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
