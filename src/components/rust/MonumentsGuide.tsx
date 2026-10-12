import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Key, 
  Radio, 
  RotateCcw, 
  Zap, 
  Layers, 
  Info, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { 
  RUST_MONUMENTS, 
  RECYCLER_YIELDS, 
  RustMonument, 
  RecyclerYield 
} from '../../data/rustData';
import { 
  ScrapIcon, 
  HqmIcon, 
  MetalFragsIcon 
} from './RustIcons';

export const MonumentsGuide: React.FC = () => {
  // Mode tab: 'monuments' | 'recycler'
  const [activeTab, setActiveTab] = useState<'monuments' | 'recycler'>('monuments');

  // Search filter for monuments
  const [monumentSearch, setMonumentSearch] = useState<string>('');

  // Selected monument for details
  const [selectedMonumentId, setSelectedMonumentId] = useState<string>('launch-site');

  // Recycler counts input: map itemId -> count
  const [componentCounts, setComponentCounts] = useState<Record<string, number>>({
    tech_trash: 5,
    rifle_body: 2,
    smg_body: 3,
    semi_body: 4,
    gears: 6,
    sheet_metal: 8,
    road_sign: 10,
    pipes: 12,
    fuse: 3
  });

  const handleUpdateComponent = (itemId: string, value: number) => {
    setComponentCounts(prev => ({
      ...prev,
      [itemId]: Math.max(0, value)
    }));
  };

  const handleResetRecycler = () => {
    setComponentCounts({});
  };

  // Recycler yield calculations
  const recyclerTotals = useMemo(() => {
    let scrap = 0;
    let hqm = 0;
    let metalFrags = 0;
    let cloth = 0;

    RECYCLER_YIELDS.forEach(item => {
      const count = componentCounts[item.itemId] || 0;
      scrap += count * item.scrapPerItem;
      hqm += count * item.hqmPerItem;
      metalFrags += count * item.metalFragsPerItem;
      cloth += count * item.clothPerItem;
    });

    return { scrap, hqm, metalFrags, cloth };
  }, [componentCounts]);

  const filteredMonuments = useMemo(() => {
    return RUST_MONUMENTS.filter(m => 
      m.name.toLowerCase().includes(monumentSearch.toLowerCase()) ||
      m.tier.toLowerCase().includes(monumentSearch.toLowerCase()) ||
      m.puzzleStrategy.toLowerCase().includes(monumentSearch.toLowerCase())
    );
  }, [monumentSearch]);

  const selectedMonument = useMemo(() => {
    return RUST_MONUMENTS.find(m => m.id === selectedMonumentId) || RUST_MONUMENTS[0];
  }, [selectedMonumentId]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub-Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f141c] border border-orange-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-md shadow-orange-950/50">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-hud font-bold text-white flex items-center gap-2">
              <span>MONUMENT PUZZLES & RECYCLER ENGINE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                KEYCARDS & COMPONENTS
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Keycard puzzle walkthroughs, rad suit requirements, and instant component recycling yields.
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#080b10] border border-white/[0.08] text-xs font-hud">
          <button
            onClick={() => setActiveTab('monuments')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'monuments'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monument Keycards
          </button>
          <button
            onClick={() => setActiveTab('recycler')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'recycler'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recycler Yield Calc
          </button>
        </div>
      </div>

      {activeTab === 'monuments' ? (
        /* MONUMENTS DIRECTORY */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monument List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search monuments, keycards, or rads..."
                value={monumentSearch}
                onChange={(e) => setMonumentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#090d14] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredMonuments.map(m => {
                const isSelected = selectedMonumentId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMonumentId(m.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#18212e] border-orange-500/70 shadow-md text-white'
                        : 'bg-[#090d14] border-white/[0.06] hover:border-orange-500/30 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-hud font-bold truncate pr-2">
                        {m.name}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold ${
                        m.tier.includes('Red') ? 'bg-red-950 text-red-300 border border-red-500/40' :
                        m.tier.includes('Blue') ? 'bg-blue-950 text-blue-300 border border-blue-500/40' :
                        m.tier.includes('Green') ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {m.tier}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span>Card: {m.cardNeeded}</span>
                      <span>{m.radiationRads} Rads</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Monument Deep Dive (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.09] space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h4 className="text-lg font-hud font-bold text-white">
                    {selectedMonument.name}
                  </h4>
                  <span className="text-xs font-mono text-orange-400">
                    {selectedMonument.tier}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedMonument.hasRecycler && (
                    <span className="text-[10px] font-hud px-2 py-1 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                      RECYCLER ✓
                    </span>
                  )}
                  {selectedMonument.hasOilRefinery && (
                    <span className="text-[10px] font-hud px-2 py-1 rounded bg-amber-950/70 border border-amber-500/30 text-amber-300">
                      REFINERY ✓
                    </span>
                  )}
                </div>
              </div>

              {/* Requirement Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.06]">
                  <div className="text-[10px] font-hud text-slate-400">KEYCARD</div>
                  <div className="font-mono font-bold text-white mt-0.5">{selectedMonument.cardNeeded}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.06]">
                  <div className="text-[10px] font-hud text-slate-400">ELECTRIC FUSES</div>
                  <div className="font-mono font-bold text-amber-400 mt-0.5">{selectedMonument.fusesNeeded} Fuses</div>
                </div>

                <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.06]">
                  <div className="text-[10px] font-hud text-slate-400">RADIATION REQ</div>
                  <div className="font-mono font-bold text-red-400 mt-0.5">{selectedMonument.radiationRads} Rads</div>
                </div>

                <div className="p-3 rounded-xl bg-[#090d14] border border-white/[0.06]">
                  <div className="text-[10px] font-hud text-slate-400">ELITE CRATES</div>
                  <div className="font-mono font-bold text-yellow-400 mt-0.5">{selectedMonument.eliteCrates} Crates</div>
                </div>
              </div>

              {/* Puzzle Strategy Walkthrough */}
              <div className="p-4 rounded-xl bg-[#090d14] border border-orange-500/20 space-y-2">
                <div className="text-xs font-hud font-bold text-orange-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-orange-400" />
                  <span>STEP-BY-STEP PUZZLE WALKTHROUGH</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedMonument.puzzleStrategy}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* RECYCLER CALCULATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Component Inventory Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.09] space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                <span className="text-xs font-hud font-bold text-white uppercase tracking-wider">
                  Component Scrap Inventory
                </span>
                <button
                  onClick={handleResetRecycler}
                  className="text-xs font-hud text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {RECYCLER_YIELDS.map(item => {
                  const count = componentCounts[item.itemId] || 0;
                  return (
                    <div
                      key={item.itemId}
                      className="p-3 rounded-xl bg-[#090d14] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div className="overflow-hidden pr-2">
                        <div className="text-xs font-hud font-bold text-white truncate">
                          {item.itemName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {item.scrapPerItem} Scrap · {item.hqmPerItem > 0 ? `${item.hqmPerItem} HQM` : item.notes}
                        </div>
                      </div>

                      <input
                        type="number"
                        min="0"
                        max="999"
                        value={count || ''}
                        placeholder="0"
                        onChange={(e) => handleUpdateComponent(item.itemId, Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-[#141b26] border border-white/10 rounded-lg text-right font-mono font-bold text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recycler Scrap Yield Output (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-2xl bg-[#0f141c] border-2 border-amber-500/30 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="font-hud font-bold text-sm text-white">
                  RECYCLER NET YIELD
                </span>
                <span className="text-[11px] font-mono text-amber-400">
                  Instant Output
                </span>
              </div>

              {/* Big Scrap Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/80 via-yellow-950/60 to-[#0e141d] border border-yellow-500/40 shadow-inner flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-950/80 border border-yellow-500/50 flex items-center justify-center">
                    <ScrapIcon className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-hud text-yellow-300/80 uppercase">
                      TOTAL SCRAP YIELD
                    </div>
                    <div className="text-3xl font-mono font-black text-yellow-400 tracking-tight">
                      {recyclerTotals.scrap.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Resources Output */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#090d14] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <HqmIcon className="w-4 h-4 text-sky-400" />
                    <span className="text-slate-300 font-hud">High Quality Metal (HQM)</span>
                  </div>
                  <span className="font-bold text-sky-400 text-sm">
                    {recyclerTotals.hqm.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#090d14] border border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <MetalFragsIcon className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300 font-hud">Metal Fragments</span>
                  </div>
                  <span className="font-bold text-cyan-300 text-sm">
                    {recyclerTotals.metalFrags.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#090d14] border border-white/[0.05]">
                  <span className="text-slate-300 font-hud">Cloth</span>
                  <span className="font-bold text-white text-sm">
                    {recyclerTotals.cloth.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
