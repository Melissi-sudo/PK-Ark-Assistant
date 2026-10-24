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
      <div className="rounded-2xl p-5 sm:p-7 bg-[#181b21] border border-orange-500/30 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            {/* Meta Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-slate-400">
              <span className="text-orange-400 font-bold uppercase">THE PITSONI EMPIRE</span>
              <span>·</span>
              <span className="text-slate-300">RUST TACTICAL SUITE</span>
              <span>·</span>
              <span className="text-amber-400 font-mono font-bold">OXIDE v260+</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Rust Tactical Operations Hub</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Competitive mathematical reference tools: zero-waste explosive raiding, official Facepunch progressive upkeep tax curves, 37-monument puzzle directory, combat TTK ballistics, and tech tree scrap optimization.
            </p>

            {/* Invariant Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14161b] border border-orange-500/40 text-[11px] font-mono text-orange-300">
                <Check className="w-3.5 h-3.5 text-orange-400" />
                <span>Zero-Waste Sulfur Formulas</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14161b] border border-orange-500/40 text-[11px] font-mono text-orange-300">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Facepunch 4-Bracket Upkeep Tax</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14161b] border border-orange-500/40 text-[11px] font-mono text-orange-300">
                <Compass className="w-3.5 h-3.5 text-orange-400" />
                <span>37 Verified Monuments</span>
              </span>
            </div>
          </div>

          {/* Quick Stats / Protocol Card */}
          <div className="flex items-center gap-3 bg-[#121417] border border-[#2a2f39] rounded-xl p-3.5 lg:w-64 shadow-sm shrink-0">
            <div className="w-10 h-10 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-lg shrink-0">
              ⚡
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TACTICAL ENGINE</div>
              <div className="text-xs font-bold text-white truncate">
                Raid, TC Upkeep & Puzzles
              </div>
              <div className="text-[11px] text-orange-400 font-mono">
                Facepunch Official Spec
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Subtab Navigation Bar (Reflowable on mobile with min height 44px) */}
      <nav 
        aria-label="Rust Tactical Modules"
        className="flex items-center gap-2 p-1.5 rounded-xl bg-[#181b21] border border-[#2a2f38] shadow-sm overflow-x-auto no-scrollbar"
      >
        <button
          onClick={() => handleTabChange('raid')}
          className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
            activeTab === 'raid'
              ? 'bg-orange-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-white hover:bg-[#222731]'
          }`}
        >
          <Bomb className="w-4 h-4 shrink-0 text-orange-300" />
          <span>Raid & Sulfur Math</span>
        </button>

        <button
          onClick={() => handleTabChange('upkeep')}
          className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
            activeTab === 'upkeep'
              ? 'bg-orange-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-white hover:bg-[#222731]'
          }`}
        >
          <Package className="w-4 h-4 shrink-0 text-orange-300" />
          <span>Base Upkeep & TC Decay</span>
        </button>

        <button
          onClick={() => handleTabChange('monuments')}
          className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
            activeTab === 'monuments'
              ? 'bg-orange-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-white hover:bg-[#222731]'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0 text-orange-300" />
          <span>Monuments & Keycards</span>
        </button>

        <button
          onClick={() => handleTabChange('combat')}
          className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
            activeTab === 'combat'
              ? 'bg-orange-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-white hover:bg-[#222731]'
          }`}
        >
          <Crosshair className="w-4 h-4 shrink-0 text-orange-300" />
          <span>Combat TTK & Ballistics</span>
        </button>

        <button
          onClick={() => handleTabChange('techtree')}
          className={`px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px] ${
            activeTab === 'techtree'
              ? 'bg-orange-600 text-white shadow-sm font-bold'
              : 'text-slate-400 hover:text-white hover:bg-[#222731]'
          }`}
        >
          <GitBranch className="w-4 h-4 shrink-0 text-orange-300" />
          <span>Tech Tree & Scrap</span>
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
