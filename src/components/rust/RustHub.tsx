import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bomb, 
  Package, 
  Crosshair, 
  GitBranch, 
  Compass, 
  Flame, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { RaidCalculator } from './RaidCalculator';
import { BaseUpkeepCalculator } from './BaseUpkeepCalculator';
import { CombatTTKMatrix } from './CombatTTKMatrix';
import { TechTreePlanner } from './TechTreePlanner';
import { MonumentsGuide } from './MonumentsGuide';

export type RustSubTab = 'raid' | 'upkeep' | 'combat' | 'techtree' | 'monuments';

export const RustHub: React.FC = () => {
  const { subtab } = useParams<{ subtab?: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<RustSubTab>(() => {
    if (subtab === 'upkeep' || subtab === 'decay' || subtab === 'tc') return 'upkeep';
    if (subtab === 'combat' || subtab === 'ttk' || subtab === 'weapons') return 'combat';
    if (subtab === 'techtree' || subtab === 'scrap' || subtab === 'workbench') return 'techtree';
    if (subtab === 'monuments' || subtab === 'recycler' || subtab === 'keycards') return 'monuments';
    return 'raid';
  });

  useEffect(() => {
    if (!subtab) return;
    if (subtab === 'upkeep' || subtab === 'decay' || subtab === 'tc') setActiveTab('upkeep');
    else if (subtab === 'combat' || subtab === 'ttk' || subtab === 'weapons') setActiveTab('combat');
    else if (subtab === 'techtree' || subtab === 'scrap' || subtab === 'workbench') setActiveTab('techtree');
    else if (subtab === 'monuments' || subtab === 'recycler' || subtab === 'keycards') setActiveTab('monuments');
    else setActiveTab('raid');
  }, [subtab]);

  const handleTabChange = (tab: RustSubTab) => {
    setActiveTab(tab);
    navigate(`/rust/${tab}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Rust Atmospheric Tactical Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-orange-500/40 bg-gradient-to-br from-[#120e0c] via-[#0d1017] to-[#07090e]">
        {/* Ambient Warm Oxide Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-amber-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Meta Kicker */}
            <div className="flex items-center gap-2 text-xs font-hud tracking-wider text-slate-400">
              <span className="text-orange-400 font-bold uppercase tracking-widest">THE PITSONI EMPIRE</span>
              <span>·</span>
              <span className="text-slate-300">RUST TACTICAL SUITE</span>
              <span>·</span>
              <span className="text-amber-400 font-tek font-bold">OXIDE v260+ SPEC</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-hud text-white tracking-tight leading-none drop-shadow-md flex items-center gap-3">
              RUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500">OPERATIONS HUB</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Authoritative mathematical models for competitive Rust players: zero-waste explosive raiding, official Facepunch progressive upkeep tax curves, combat TTK ballistics, and tech tree scrap optimization.
            </p>

            {/* Invariant Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-950/70 border border-orange-500/40 text-[11px] font-hud text-orange-300">
                <Check className="w-3.5 h-3.5 text-orange-400" />
                <span>Zero-Waste Sulfur Formulas</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/70 border border-amber-500/40 text-[11px] font-hud text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Facepunch 4-Bracket Upkeep Tax</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/70 border border-red-500/40 text-[11px] font-hud text-red-300">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                <span>Multi-Target Shopping Cart</span>
              </span>
            </div>
          </div>

          {/* Quick Stats / Version Callout */}
          <div className="flex items-center gap-3 bg-[#0a0f18]/90 border border-orange-500/30 rounded-2xl p-4 lg:w-72 backdrop-blur-md shadow-xl shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center text-white font-tek font-bold text-xl shadow-md shadow-orange-500/30 shrink-0">
              ⚡
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] font-hud text-slate-400 uppercase tracking-wider">TACTICAL PROTOCOL</div>
              <div className="text-sm font-hud font-bold text-white truncate">
                Raid, Upkeep & Combat
              </div>
              <div className="text-[11px] text-orange-400 font-mono">
                Facepunch Official Spec
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Subtab Navigation Bar */}
      <nav 
        aria-label="Rust Tactical Modules"
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#090d14] border border-white/[0.08] shadow-lg overflow-x-auto no-scrollbar"
      >
        <button
          onClick={() => handleTabChange('raid')}
          className={`px-4 py-2.5 rounded-xl font-hud font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'raid'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950/50 border border-orange-400/40'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Bomb className="w-4 h-4 shrink-0 text-orange-300" />
          <span>Raid & Sulfur Math</span>
        </button>

        <button
          onClick={() => handleTabChange('upkeep')}
          className={`px-4 py-2.5 rounded-xl font-hud font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'upkeep'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950/50 border border-orange-400/40'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Package className="w-4 h-4 shrink-0 text-amber-300" />
          <span>Base Upkeep & TC Decay</span>
        </button>

        <button
          onClick={() => handleTabChange('combat')}
          className={`px-4 py-2.5 rounded-xl font-hud font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'combat'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950/50 border border-orange-400/40'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Crosshair className="w-4 h-4 shrink-0 text-red-300" />
          <span>Combat TTK & Ballistics</span>
        </button>

        <button
          onClick={() => handleTabChange('techtree')}
          className={`px-4 py-2.5 rounded-xl font-hud font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'techtree'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950/50 border border-orange-400/40'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <GitBranch className="w-4 h-4 shrink-0 text-yellow-300" />
          <span>Tech Tree & Scrap</span>
        </button>

        <button
          onClick={() => handleTabChange('monuments')}
          className={`px-4 py-2.5 rounded-xl font-hud font-bold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'monuments'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-950/50 border border-orange-400/40'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0 text-cyan-300" />
          <span>Monuments & Recycler</span>
        </button>
      </nav>

      {/* Render Active Subtool */}
      <div className="pt-2">
        {activeTab === 'raid' && <RaidCalculator />}
        {activeTab === 'upkeep' && <BaseUpkeepCalculator />}
        {activeTab === 'combat' && <CombatTTKMatrix />}
        {activeTab === 'techtree' && <TechTreePlanner />}
        {activeTab === 'monuments' && <MonumentsGuide />}
      </div>
    </div>
  );
};
