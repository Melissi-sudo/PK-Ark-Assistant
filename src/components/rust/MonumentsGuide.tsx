import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Key, 
  RotateCcw, 
  Zap, 
  Layers, 
  Info, 
  ChevronRight, 
  ChevronDown,
  Search,
  CheckCircle2,
  ExternalLink,
  Shield,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  RUST_MONUMENTS, 
  RUST_MONUMENT_CATEGORIES,
  RECYCLER_YIELDS, 
  RustMonument, 
  RustMonumentCategory,
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

  // Search filter for monument names
  const [monumentSearch, setMonumentSearch] = useState<string>('');

  // Expanded categories map
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Safe Zones': true,
    'Tier 0 (Puzzle-Free / Early-Game)': true,
    'Tier 1 & Industrial': true,
    'Tier 2 (Mid-to-High Loot)': true,
    'Tier 3 (End-Game)': true,
    'Quarries & Transit': true
  });

  // Expanded monument cards map (for instant mobile & desktop expansion on tap)
  const [expandedMonumentIds, setExpandedMonumentIds] = useState<Record<string, boolean>>({
    'abandoned-supermarket': true,
    'large-harbor': true,
    'water-treatment-plant': true
  });

  // Recycler counts input
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

  // Recycler yields calculation
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

  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const toggleMonumentCard = (id: string) => {
    setExpandedMonumentIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllCategories = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    RUST_MONUMENT_CATEGORIES.forEach(c => {
      next[c.name] = expand;
    });
    setExpandedCategories(next);
  };

  const scrollToKeycards = () => {
    setActiveTab('monuments');
    const el = document.getElementById('keycard-overview-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToDirectory = () => {
    setActiveTab('monuments');
    const el = document.getElementById('monuments-directory-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter monuments by search query
  const filteredMonuments = useMemo(() => {
    const q = monumentSearch.toLowerCase().trim();
    if (!q) return RUST_MONUMENTS;
    return RUST_MONUMENTS.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      (m.cardSpawned && m.cardSpawned.toLowerCase().includes(q)) ||
      (m.cardRequired && m.cardRequired.toLowerCase().includes(q))
    );
  }, [monumentSearch]);

  // Group filtered monuments by exact 6 categories
  const groupedMonuments = useMemo(() => {
    const map = new Map<RustMonumentCategory, RustMonument[]>();
    RUST_MONUMENT_CATEGORIES.forEach(c => {
      map.set(c.name, []);
    });

    filteredMonuments.forEach(m => {
      const list = map.get(m.category);
      if (list) {
        list.push(m);
      }
    });

    return map;
  }, [filteredMonuments]);

  return (
    <div className="space-y-6">
      {/* Header & Quick Jumper */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181b20] border border-[#2a2f38] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#232730] border border-[#3b4352] flex items-center justify-center text-orange-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>RUST MONUMENTS & KEYCARD GUIDE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/15 text-orange-300 border border-orange-500/30">
                37 MONUMENTS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Exact monument groupings, keycard puzzle overview, and instant puzzle walkthroughs.
            </p>
          </div>
        </div>

        {/* Action Pills & Tab Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 rounded-xl bg-[#121417] border border-[#2a2f38] text-xs">
            <button
              onClick={() => setActiveTab('monuments')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'monuments'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monument Directory
            </button>
            <button
              onClick={() => setActiveTab('recycler')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'recycler'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Recycler Yields
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'monuments' ? (
        <div className="space-y-6">
          {/* Section Jump Bar */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#14161b] border border-[#262a33] text-xs">
            <span className="text-slate-400 font-medium">Quick Jump:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={scrollToKeycards}
                className="px-2.5 py-1 rounded-lg bg-[#1f232b] hover:bg-[#282d37] border border-[#373e4a] text-slate-200 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-orange-400" />
                <span>Keycard & Puzzle Overview</span>
              </button>
              <button
                onClick={scrollToDirectory}
                className="px-2.5 py-1 rounded-lg bg-[#1f232b] hover:bg-[#282d37] border border-[#373e4a] text-slate-200 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                <span>All 37 Monuments</span>
              </button>
            </div>
          </div>

          {/* KEYCARD & PUZZLE OVERVIEW SECTION */}
          <section
            id="keycard-overview-section"
            className="p-5 sm:p-6 rounded-2xl bg-[#181b20] border border-[#2d333e] space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a2f38] pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                  <Key className="w-4 h-4 text-orange-400" />
                  <span>KEYCARD & PUZZLE OVERVIEW</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Distinguished by color, icon, and explicit text. Follow the card progression from Tier 0 to Tier 3.
                </p>
              </div>
              <button
                onClick={scrollToDirectory}
                className="text-xs text-orange-400 hover:text-orange-300 font-medium self-start sm:self-auto flex items-center gap-1 cursor-pointer"
              >
                <span>Jump to Monument Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Keycard Progression Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* GREEN CARDS */}
              <div className="p-4 rounded-xl bg-[#121915] border-2 border-emerald-500/50 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      [GREEN CARD]
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Tier 0 / Early</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    Green Keycards
                  </h4>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    Found at puzzle-free monuments like <strong className="text-emerald-300">Abandoned Cabins</strong>, <strong className="text-emerald-300">Lighthouses</strong>, <strong className="text-emerald-300">Supermarkets</strong>, <strong className="text-emerald-300">Gas Stations</strong>, and <strong className="text-emerald-300">Ferry Terminals</strong>.
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span>Usage:</span>
                  <span className="text-slate-300">Unlocks Blue Card puzzle rooms</span>
                </div>
              </div>

              {/* BLUE CARDS */}
              <div className="p-4 rounded-xl bg-[#101726] border-2 border-blue-500/50 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      [BLUE CARD]
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Tier 1 & Industrial</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    Blue Keycards
                  </h4>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    Obtained at locations like <strong className="text-blue-300">Harbors</strong>, <strong className="text-blue-300">Satellite Dish</strong>, and <strong className="text-blue-300">Sewer Branch</strong> using a green card and a fuse.
                  </p>
                </div>

                <div className="pt-2 border-t border-blue-500/20 text-[11px] text-blue-400 flex items-center gap-1 font-mono">
                  <span>Requirement:</span>
                  <span className="text-slate-300">Green Card + 1 Electric Fuse</span>
                </div>
              </div>

              {/* RED CARDS */}
              <div className="p-4 rounded-xl bg-[#201115] border-2 border-rose-500/50 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      [RED CARD]
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Tier 2 & 3 Loot</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    Red Keycards
                  </h4>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    Obtained at monuments like <strong className="text-rose-300">Water Treatment Plant</strong>, <strong className="text-rose-300">Airfield</strong>, <strong className="text-rose-300">Train Yard</strong>, <strong className="text-rose-300">Power Plant</strong>, and <strong className="text-rose-300">Arctic Research Base</strong> using blue and green cards with fuses.
                  </p>
                </div>

                <div className="pt-2 border-t border-rose-500/20 text-[11px] text-rose-400 flex items-center gap-1 font-mono">
                  <span>Requirement:</span>
                  <span className="text-slate-300">Blue & Green Cards + Fuses</span>
                </div>
              </div>
            </div>
          </section>

          {/* MONUMENT DIRECTORY SEARCH & CATEGORIES */}
          <section
            id="monuments-directory-section"
            className="space-y-4"
          >
            {/* Search Input Bar */}
            <div className="p-4 rounded-2xl bg-[#181b20] border border-[#2a2f38] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Filter 37 monuments by name, keycard, or tier..."
                  value={monumentSearch}
                  onChange={(e) => setMonumentSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 bg-[#121417] border border-[#2d333e] rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                  aria-label="Filter monument names"
                />
                {monumentSearch && (
                  <button
                    onClick={() => setMonumentSearch('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Expand / Collapse All */}
              <div className="flex items-center gap-2 text-xs shrink-0">
                <button
                  onClick={() => toggleAllCategories(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#121417] hover:bg-[#232730] border border-[#2a2f38] text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  onClick={() => toggleAllCategories(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#121417] hover:bg-[#232730] border border-[#2a2f38] text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Results Count */}
            {monumentSearch && (
              <div className="text-xs text-slate-400 px-1">
                Showing <span className="font-bold text-slate-200">{filteredMonuments.length}</span> of 37 monuments matching "{monumentSearch}".
              </div>
            )}

            {/* 6 Collapsible Categories */}
            <div className="space-y-4">
              {RUST_MONUMENT_CATEGORIES.map(category => {
                const items = groupedMonuments.get(category.name) || [];
                const isExpanded = !!expandedCategories[category.name];

                if (items.length === 0 && monumentSearch) {
                  return null;
                }

                return (
                  <div
                    key={category.name}
                    className="rounded-2xl bg-[#181b20] border border-[#2a2f38] overflow-hidden shadow-sm"
                  >
                    {/* Collapsible Category Header */}
                    <button
                      onClick={() => toggleCategory(category.name)}
                      aria-expanded={isExpanded}
                      className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#1b1f25] hover:bg-[#20252c] transition-colors text-left cursor-pointer border-b border-[#2a2f38]/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#252a33] flex items-center justify-center text-orange-400 shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm sm:text-base font-bold text-white">
                              {category.name}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#272d38] text-slate-300 border border-[#3b4352]">
                              {items.length} {items.length === 1 ? 'ENTRY' : 'ENTRIES'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 shrink-0 ml-2">
                        <span className="text-xs hidden md:inline font-mono">
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-orange-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Category Monument Cards (Single column readable mobile flow) */}
                    {isExpanded && (
                      <div className="p-3 sm:p-4 space-y-2.5">
                        {items.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400 italic">
                            No monuments in this category match your search.
                          </div>
                        ) : (
                          items.map(m => {
                            const isCardOpen = !!expandedMonumentIds[m.id];

                            return (
                              <div
                                key={m.id}
                                className={`rounded-xl border transition-all ${
                                  isCardOpen
                                    ? 'bg-[#14171d] border-orange-500/40 shadow-sm'
                                    : 'bg-[#15171c] border-[#292e38] hover:border-[#3a4250]'
                                }`}
                              >
                                {/* Monument Card Header (Tap Target >= 44px) */}
                                <button
                                  onClick={() => toggleMonumentCard(m.id)}
                                  aria-expanded={isCardOpen}
                                  className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left cursor-pointer min-h-[48px]"
                                >
                                  <div className="flex items-center gap-2.5 flex-wrap flex-1 mr-2">
                                    <span className="text-xs sm:text-sm font-bold text-slate-100">
                                      {m.name}
                                    </span>

                                    {/* Keycard Spawn Tag */}
                                    {m.cardSpawned && (
                                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                        m.cardSpawned === 'Green' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' :
                                        m.cardSpawned === 'Blue' ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40' :
                                        'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                                      }`}>
                                        Spawns {m.cardSpawned} Card
                                      </span>
                                    )}

                                    {/* Card Requirement Tag */}
                                    {m.cardRequired && m.cardRequired !== 'None' && (
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#232730] text-slate-300 border border-[#373e4a]">
                                        Requires {m.cardRequired}
                                      </span>
                                    )}

                                    {/* Recycler Tag */}
                                    {m.hasRecycler && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                                        Recycler
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                                    <span className="text-[11px] hidden sm:inline font-mono">
                                      {isCardOpen ? 'Hide' : 'Info'}
                                    </span>
                                    {isCardOpen ? (
                                      <ChevronDown className="w-4 h-4 text-orange-400" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-slate-500" />
                                    )}
                                  </div>
                                </button>

                                {/* Instant Puzzle Info on Tap / Expanded Body */}
                                {isCardOpen && (
                                  <div className="p-3 sm:p-4 pt-0 border-t border-[#262a33] mt-1 space-y-3">
                                    <div className="p-3 rounded-lg bg-[#0e1014] border border-[#22262f] space-y-2 mt-2">
                                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                        <Key className="w-3.5 h-3.5 text-orange-400" />
                                        <span>PUZZLE & ACCESS SUMMARY</span>
                                      </div>

                                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                                        {m.puzzleStrategy}
                                      </p>
                                    </div>

                                    {/* Honest Placeholder Structure for pending details */}
                                    {m.detailPlaceholder && (
                                      <div className="p-3 rounded-lg bg-[#14161b] border border-dashed border-[#383f4d] flex items-start gap-2 text-xs text-slate-400">
                                        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                        <div className="space-y-0.5">
                                          <div className="text-[11px] font-semibold text-slate-300">
                                            MONUMENT DATA SPECIFICATION
                                          </div>
                                          <div>{m.detailPlaceholder}</div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Action link to Jump to Keycard overview */}
                                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                      <span>Category: {m.category}</span>
                                      <button
                                        onClick={scrollToKeycards}
                                        className="text-orange-400 hover:text-orange-300 font-medium underline flex items-center gap-1 cursor-pointer"
                                      >
                                        <span>Keycard guide reference</span>
                                        <ChevronRight className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      ) : (
        /* RECYCLER YIELD CALCULATOR */
        <div className="p-5 sm:p-6 rounded-2xl bg-[#181b20] border border-[#2a2f38] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2a2f38] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-orange-400" />
                <span>MONUMENT RECYCLER YIELD CALCULATOR</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculate scrap, HQM, and metal fragments produced by recycling components found at monuments.
              </p>
            </div>

            <button
              onClick={handleResetRecycler}
              className="px-3 py-1.5 rounded-lg bg-[#232730] hover:bg-[#2d323e] border border-[#373e4a] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              Reset Component Counts
            </button>
          </div>

          {/* Recycler Total Output Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#121417] border border-orange-500/30 text-center space-y-1">
              <div className="text-[10px] font-mono text-orange-400 uppercase font-semibold">Total Scrap</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-white flex items-center justify-center gap-1.5">
                <ScrapIcon className="w-5 h-5 text-orange-400" />
                <span>{recyclerTotals.scrap.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121417] border border-sky-500/30 text-center space-y-1">
              <div className="text-[10px] font-mono text-sky-400 uppercase font-semibold">Total HQM</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-sky-200 flex items-center justify-center gap-1.5">
                <HqmIcon className="w-5 h-5 text-sky-400" />
                <span>{recyclerTotals.hqm.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121417] border border-cyan-500/30 text-center space-y-1">
              <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Metal Frags</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-200 flex items-center justify-center gap-1.5">
                <MetalFragsIcon className="w-5 h-5 text-cyan-400" />
                <span>{recyclerTotals.metalFrags.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121417] border border-emerald-500/30 text-center space-y-1">
              <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Cloth</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-200">
                {recyclerTotals.cloth.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Component Inputs Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Component Inventory Found at Monuments
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {RECYCLER_YIELDS.map(item => {
                const count = componentCounts[item.itemId] || 0;

                return (
                  <div
                    key={item.itemId}
                    className="p-3 rounded-xl bg-[#121417] border border-[#262a33] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{item.itemName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.scrapPerItem > 0 && `${item.scrapPerItem} scrap `}
                        {item.hqmPerItem > 0 && `${item.hqmPerItem} HQM `}
                        {item.metalFragsPerItem > 0 && `${item.metalFragsPerItem} frags `}
                        {item.clothPerItem > 0 && `${item.clothPerItem} cloth`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateComponent(item.itemId, count - 1)}
                        className="w-7 h-7 rounded-lg bg-[#1f232b] hover:bg-[#282d37] text-slate-300 flex items-center justify-center font-bold text-xs cursor-pointer"
                        aria-label={`Decrease ${item.itemName}`}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={count}
                        onChange={(e) => handleUpdateComponent(item.itemId, Number(e.target.value))}
                        className="w-12 py-1 text-center bg-[#090b0e] border border-[#2d333e] rounded-lg font-mono text-xs text-white focus:outline-none focus:border-orange-500"
                        aria-label={`${item.itemName} count`}
                      />
                      <button
                        onClick={() => handleUpdateComponent(item.itemId, count + 1)}
                        className="w-7 h-7 rounded-lg bg-[#1f232b] hover:bg-[#282d37] text-slate-300 flex items-center justify-center font-bold text-xs cursor-pointer"
                        aria-label={`Increase ${item.itemName}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
