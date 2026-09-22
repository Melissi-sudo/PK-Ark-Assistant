import React from 'react';
import { X, ExternalLink, ShieldCheck, Zap, Sparkles, CheckCircle2, Award, Clock } from 'lucide-react';

interface PkStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PkStoreModal: React.FC<PkStoreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const catalogItems = [
    {
      title: 'Boss-Ready Alpha Teams',
      category: 'Tames',
      desc: '19x Max Mated Theris or Tek Rexes + 1x Yutyrannus with 124 Armor Ascendant Saddles. Beat Alpha Overseer & Dragon day one.',
      tag: 'HOT PVP'
    },
    {
      title: '254 Stat PvP Bloodlines',
      category: 'Breeding',
      desc: 'Capped Giga & Carcharodontosaurus 254 Melee lines, 254 HP Stegosaurus hardened tanks, and top-tier Pyromane pairs.',
      tag: 'TOP STAT'
    },
    {
      title: 'Bulk Advanced Rifle Bullet Crates',
      category: 'Ammo',
      desc: '250,000 to 1,000,000+ ARB crates delivered instantly to fill your cave or cliff deathwalls without weeks of grinding.',
      tag: 'POPULAR'
    },
    {
      title: 'Turnkey TEK Deathwall Kits',
      category: 'Structures',
      desc: 'Complete base defense kits including Heavy Auto Turrets, Tek Turrets, Tek Generators, cables, and element shards.',
      tag: 'INSTANT'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e141f] border border-amber-500/40 rounded-xl shadow-2xl shadow-amber-900/40 overflow-hidden">
        {/* Top Glowing Header */}
        <div className="relative bg-gradient-to-r from-[#211409] via-[#1a0f07] to-[#0d131f] border-b border-amber-500/30 p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-tek">
                Official PvP Partner
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-400 font-hud">
                <ShieldCheck className="w-3.5 h-3.5" />
                Trusted Tribe Provider
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-hud text-amber-100 tracking-wider">
              PK STORE // SKIP THE OFFICIAL GRIND
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Official Small Tribes & 1x PvP can take thousands of hours of mindless grinding. 
              PK Store provides boss-ready tames, 254 stat lines, and bulk ammo to help active tribes dominate the server.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="p-5 space-y-4 max-h-[68vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#121b28] border border-cyan-500/20 rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-200 font-hud">Instant Hand-off</div>
              <div className="text-[11px] text-slate-400">Safe delivery on your official server</div>
            </div>
            <div className="bg-[#121b28] border border-amber-500/20 rounded-lg p-3 text-center">
              <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-200 font-hud">God-Tier Stats</div>
              <div className="text-[11px] text-slate-400">Clean 0/0 or 254 cap mutations</div>
            </div>
            <div className="bg-[#121b28] border border-emerald-500/20 rounded-lg p-3 text-center">
              <Zap className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-200 font-hud">24/7 Support</div>
              <div className="text-[11px] text-slate-400">Active ticket team in Discord</div>
            </div>
          </div>

          {/* Catalog Highlights */}
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider text-amber-400/80 font-tek font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Popular Tribe Packages
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {catalogItems.map((item, i) => (
                <div 
                  key={i}
                  className="bg-[#101724] border border-slate-700/60 hover:border-amber-500/40 rounded-lg p-3 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-100 font-hud">{item.title}</span>
                    <span className="text-[10px] font-tek px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee notice */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              All orders handled through direct Discord ticket system. Join the community to check vouches, live stock, and exclusive giveaways for Official PvP players.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#0b1019] border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            Official Discord: <strong className="text-amber-300">discord.gg/C9pD2yduw9</strong>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 text-xs font-hud font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Back to Companion
            </button>
            <a
              href="https://discord.gg/C9pD2yduw9"
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/2 sm:w-auto px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-lg shadow-amber-500/20 font-hud tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>JOIN PK STORE DISCORD</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
