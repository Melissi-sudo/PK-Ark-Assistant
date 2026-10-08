import React, { useState, useMemo, useEffect } from 'react';
import { 
  Swords, 
  Map, 
  Pickaxe, 
  Layers, 
  Flame, 
  ShieldAlert, 
  Check, 
  Search, 
  Sparkles, 
  Award, 
  Crosshair, 
  Heart, 
  Skull, 
  Info, 
  ChevronRight, 
  ExternalLink,
  Shield,
  HelpCircle,
  Copy,
  Zap,
  CheckCircle2,
  Filter,
  Eye,
  RefreshCw,
  Sliders,
  TreePine,
  Sun,
  Moon
} from 'lucide-react';
import { 
  TERRARIA_BOSSES, 
  TERRARIA_BIOMES, 
  TERRARIA_ORES, 
  UNDERGROUND_LAYERS, 
  EVIL_BIOME_GUIDES,
  BossData,
  BiomeData,
  OreData
} from '../../data/terrariaData';

export type TerrariaTab = 'bosses' | 'biomes' | 'ores' | 'underground' | 'evil' | 'classes';

const LOCAL_STORAGE_BOSS_KEY = 'terraria_defeated_bosses_v1';

export const TerrariaHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TerrariaTab>('bosses');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Boss progression filters & checklist
  const [bossPhaseFilter, setBossPhaseFilter] = useState<'all' | 'pre-hardmode' | 'hardmode'>('all');
  const [defeatedBosses, setDefeatedBosses] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_BOSS_KEY);
        if (saved) return new Set(JSON.parse(saved));
      } catch {
        // fallback
      }
    }
    return new Set<string>();
  });

  // Selected details
  const [selectedBoss, setSelectedBoss] = useState<BossData>(TERRARIA_BOSSES[0]);
  const [selectedBiome, setSelectedBiome] = useState<BiomeData>(TERRARIA_BIOMES[0]);
  const [selectedOrePhase, setSelectedOrePhase] = useState<'all' | 'pre-hardmode' | 'hardmode'>('all');
  const [pickaxePowerInput, setPickaxePowerInput] = useState<number>(100);
  const [activeEvilTab, setActiveEvilTab] = useState<'corruption' | 'crimson'>('corruption');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync defeated bosses with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_BOSS_KEY, JSON.stringify(Array.from(defeatedBosses)));
    }
  }, [defeatedBosses]);

  const toggleBossDefeated = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDefeatedBosses(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered Bosses
  const filteredBosses = useMemo(() => {
    return TERRARIA_BOSSES.filter(b => {
      const matchesPhase = bossPhaseFilter === 'all' || b.phase === bossPhaseFilter;
      const matchesSearch = !searchQuery || 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summonItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.keyDrops.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesPhase && matchesSearch;
    });
  }, [bossPhaseFilter, searchQuery]);

  // Filtered Biomes
  const filteredBiomes = useMemo(() => {
    return TERRARIA_BIOMES.filter(b => {
      return !searchQuery ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.uniqueLoot.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  }, [searchQuery]);

  // Filtered Ores
  const filteredOres = useMemo(() => {
    return TERRARIA_ORES.filter(o => {
      const matchesPhase = selectedOrePhase === 'all' || o.phase === selectedOrePhase;
      const matchesSearch = !searchQuery ||
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.whereToFind.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.keyCrafts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesPhase && matchesSearch;
    });
  }, [selectedOrePhase, searchQuery]);

  // Boss progress percentage
  const bossProgress = Math.round((defeatedBosses.size / TERRARIA_BOSSES.length) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4">
      {/* 1. HERO SHOWCASE WITH OFFICIAL POSTER */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-[#08150e] shadow-2xl">
        {/* Official Terraria Poster Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/thumbnails/terraria_poster.jpg" 
            alt="Terraria Official Key Art Poster" 
            className="w-full h-full object-cover object-center filter brightness-[0.4] saturate-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08150e] via-[#08150e]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08150e] via-transparent to-[#08150e]/90" />
        </div>

        {/* Content over hero */}
        <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-950/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>OFFICIAL 1.4.4+ LABOR OF LOVE</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider">
                TACTICAL GUIDE
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-wide drop-shadow-md">
              Terraria Master Companion
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed drop-shadow">
              Comprehensive strategy compendium featuring complete 18-boss progression checklists, surface & underground biome discovery, ore tier pickaxe formulas, Aether Shimmer transmutation maps, and Crimson/Corruption containment tactics.
            </p>

            {/* Quick Stat Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-white/10 text-emerald-300">
                <Swords className="w-3.5 h-3.5 text-emerald-400" />
                <span>18 Bosses</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-white/10 text-cyan-300">
                <Map className="w-3.5 h-3.5 text-cyan-400" />
                <span>8 Biomes</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-white/10 text-amber-300">
                <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
                <span>12 Ore Tiers</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-white/10 text-purple-300">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>The Aether / Shimmer</span>
              </div>
            </div>
          </div>

          {/* Boss Completion Tracker Card */}
          <div className="w-full lg:w-80 p-4 sm:p-5 rounded-2xl bg-black/75 border border-emerald-500/40 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
                <Skull className="w-4 h-4 text-emerald-400" />
                Boss Progression
              </span>
              <span className="font-mono text-emerald-400 font-bold">{defeatedBosses.size} / {TERRARIA_BOSSES.length}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${bossProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{bossProgress}% Defeated</span>
              <button
                onClick={() => setDefeatedBosses(new Set())}
                className="text-[10px] text-slate-400 hover:text-rose-400 uppercase transition-colors"
                title="Reset Boss Progress"
              >
                Reset Checklist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION BAR & SEARCH */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0a121d] p-2 rounded-2xl border border-white/10 shadow-lg">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('bosses')}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'bosses'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Boss Progression</span>
          </button>

          <button
            onClick={() => setActiveTab('biomes')}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'biomes'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Biomes & Loot</span>
          </button>

          <button
            onClick={() => setActiveTab('ores')}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ores'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Pickaxe className="w-3.5 h-3.5" />
            <span>Ores & Mining</span>
          </button>

          <button
            onClick={() => setActiveTab('underground')}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'underground'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Underground & Aether</span>
          </button>

          <button
            onClick={() => setActiveTab('evil')}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'evil'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Crimson vs Corruption</span>
          </button>
        </div>

        {/* Universal Search Filter */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bosses, ores, biomes..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#050912] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. TAB 1: BOSS PROGRESSION & ARENA BLUEPRINTS */}
      {activeTab === 'bosses' && (
        <div className="space-y-6">
          {/* Phase Filter Controls */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-[#0a121d] p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 uppercase font-bold text-[11px]">Progression Filter:</span>
              <button
                onClick={() => setBossPhaseFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                  bossPhaseFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black/40 text-slate-400 hover:text-white'
                }`}
              >
                All (18)
              </button>
              <button
                onClick={() => setBossPhaseFilter('pre-hardmode')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                  bossPhaseFilter === 'pre-hardmode'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black/40 text-slate-400 hover:text-white'
                }`}
              >
                Pre-Hardmode (8)
              </button>
              <button
                onClick={() => setBossPhaseFilter('hardmode')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${
                  bossPhaseFilter === 'hardmode'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/40 text-slate-400 hover:text-white'
                }`}
              >
                Hardmode (10)
              </button>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>💡 Click any boss card to view summon recipes, arena setups, and class gear</span>
            </div>
          </div>

          {/* Two-Column Layout: Boss Grid on Left, In-Depth Dossier on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Boss List */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[850px] overflow-y-auto pr-1">
              {filteredBosses.map((boss) => {
                const isSelected = selectedBoss.id === boss.id;
                const isDefeated = defeatedBosses.has(boss.id);

                return (
                  <div
                    key={boss.id}
                    onClick={() => setSelectedBoss(boss)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-400 shadow-lg shadow-emerald-950/40'
                        : isDefeated
                        ? 'bg-[#06101a] border-emerald-800/40 opacity-80'
                        : 'bg-[#08121f] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox */}
                      <button
                        onClick={(e) => toggleBossDefeated(boss.id, e)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                          isDefeated
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'bg-black/60 border-slate-600 hover:border-slate-400 text-transparent'
                        }`}
                        title={isDefeated ? 'Mark as Not Defeated' : 'Mark as Defeated'}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      <div className="w-7 h-7 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                        <Skull className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm truncate ${isDefeated ? 'line-through text-slate-400' : 'text-white'}`}>
                            {boss.order}. {boss.name}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                            boss.phase === 'pre-hardmode' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-purple-900/60 text-purple-300'
                          }`}>
                            {boss.phase === 'pre-hardmode' ? 'Pre-HM' : 'Hardmode'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          HP: {boss.health.classic.toLocaleString()} · Summon: {boss.summonItem}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Boss Strategy Dossier */}
            <div className="lg:col-span-7 bg-[#08121f] rounded-3xl border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-black/60 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                      <Skull className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
                      {selectedBoss.order}. {selectedBoss.name}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Spawn Trigger: <span className="text-emerald-300 font-mono">{selectedBoss.spawnConditions}</span>
                  </p>
                </div>

                <button
                  onClick={() => toggleBossDefeated(selectedBoss.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 border transition-all ${
                    defeatedBosses.has(selectedBoss.id)
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                      : 'bg-black/60 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{defeatedBosses.has(selectedBoss.id) ? 'Defeated' : 'Mark Defeated'}</span>
                </button>
              </div>

              {/* Health Pools */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Classic HP</div>
                  <div className="text-sm sm:text-base font-bold font-mono text-emerald-400">{selectedBoss.health.classic.toLocaleString()}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Expert HP</div>
                  <div className="text-sm sm:text-base font-bold font-mono text-amber-400">{selectedBoss.health.expert.toLocaleString()}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Master HP</div>
                  <div className="text-sm sm:text-base font-bold font-mono text-rose-400">{selectedBoss.health.master.toLocaleString()}</div>
                </div>
              </div>

              {/* Summon Recipe Box */}
              <div className="p-3.5 rounded-2xl bg-[#0d1b2a] border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Summoning Item: {selectedBoss.summonItem}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {selectedBoss.summonRecipe}
                </p>
              </div>

              {/* Recommended Arena Setup */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Arena Blueprint & Preparation
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedBoss.arenaAdvice.map((advice, i) => (
                    <li key={i} className="flex items-start gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
                      <span className="text-amber-400 font-bold shrink-0">▸</span>
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Class Weapon Loadouts */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-cyan-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  Recommended Class Loadouts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
                    <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1"><Swords className="w-3 h-3 text-amber-400" /> Melee:</span>
                    <p className="text-slate-200">{selectedBoss.classRecommendations.melee}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1"><Crosshair className="w-3 h-3 text-emerald-400" /> Ranged:</span>
                    <p className="text-slate-200">{selectedBoss.classRecommendations.ranged}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
                    <span className="text-[10px] text-purple-400 uppercase font-bold flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-400" /> Magic:</span>
                    <p className="text-slate-200">{selectedBoss.classRecommendations.magic}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center gap-1"><Shield className="w-3 h-3 text-cyan-400" /> Summoner:</span>
                    <p className="text-slate-200">{selectedBoss.classRecommendations.summoner}</p>
                  </div>
                </div>
                <div className="p-2 bg-black/60 rounded-xl border border-white/5 text-xs text-slate-300">
                  <strong className="text-white">Armor Recommendation: </strong>
                  <span>{selectedBoss.classRecommendations.armor}</span>
                </div>
              </div>

              {/* Key Drops & Unlocks */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <h3 className="text-xs uppercase font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Key Drops & Game Unlocks
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBoss.keyDrops.map((drop, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs font-mono">
                      {drop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: BIOMES & LOOT */}
      {activeTab === 'biomes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Biome Select Grid */}
            <div className="lg:col-span-4 space-y-2 max-h-[850px] overflow-y-auto pr-1">
              {filteredBiomes.map((biome) => {
                const isSelected = selectedBiome.id === biome.id;
                return (
                  <div
                    key={biome.id}
                    onClick={() => setSelectedBiome(biome)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950/40'
                        : 'bg-[#08121f] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm">{biome.name}</h4>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{biome.layer}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                  </div>
                );
              })}
            </div>

            {/* Selected Biome Detailed Guide */}
            <div className="lg:col-span-8 bg-[#08121f] rounded-3xl border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedBiome.color }} />
                  <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
                    {selectedBiome.name}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                  {selectedBiome.overview}
                </p>
              </div>

              {/* Unique Loot & Key Resources */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-amber-300">💎 Exclusive Chest Loot & Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedBiome.uniqueLoot.map((loot, i) => (
                    <div key={i} className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-200 font-mono">
                      • {loot}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Enemies */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-rose-300">👾 Primary Hostile Enemies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBiome.keyEnemies.map((enemy, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-200 text-xs font-mono">
                      {enemy}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fishing Catches */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-cyan-300">🎣 Fishing Crates & Catches</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBiome.fishingCatches.map((fish, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-200 text-xs font-mono">
                      {fish}
                    </span>
                  ))}
                </div>
              </div>

              {/* NPC Housing Preferences */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-emerald-300">🏡 Preferred NPCs (Pylons & Happiness)</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBiome.npcPreferences.map((npc, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs font-mono">
                      {npc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Critical Survival Tips */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h3 className="text-xs uppercase font-bold text-yellow-300">⚠️ Tactical Survival Tips</h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedBiome.criticalTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-yellow-400 font-bold shrink-0">▸</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: ORES & MINING TIERS */}
      {activeTab === 'ores' && (
        <div className="space-y-6">
          {/* Mining Tier Filter & Pickaxe Calculator */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#0a121d] p-4 rounded-3xl border border-white/10 shadow-xl items-center">
            <div className="md:col-span-7 space-y-2">
              <span className="text-xs font-bold uppercase text-amber-300 flex items-center gap-1.5">
                <Pickaxe className="w-4 h-4 text-amber-400" />
                Pickaxe Power Mining Tester
              </span>
              <p className="text-xs text-slate-300">
                Enter your current Pickaxe Power percentage to highlight which ores you can mine right now:
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="35"
                  max="225"
                  step="5"
                  value={pickaxePowerInput}
                  onChange={(e) => setPickaxePowerInput(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="font-mono text-amber-400 font-bold text-sm bg-black/60 px-3 py-1 rounded-lg border border-amber-500/30 shrink-0">
                  {pickaxePowerInput}% Power
                </span>
              </div>
            </div>

            <div className="md:col-span-5 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedOrePhase('all')}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-colors ${
                  selectedOrePhase === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'bg-black/40 text-slate-400 hover:text-white'
                }`}
              >
                All (12)
              </button>
              <button
                onClick={() => setSelectedOrePhase('pre-hardmode')}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-colors ${
                  selectedOrePhase === 'pre-hardmode'
                    ? 'bg-amber-600 text-white'
                    : 'bg-black/40 text-slate-400 hover:text-white'
                }`}
              >
                Pre-HM (7)
              </button>
              <button
                onClick={() => setSelectedOrePhase('hardmode')}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-colors ${
                  selectedOrePhase === 'hardmode'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/40 text-slate-400 hover:text-white'
                }`}
              >
                Hardmode (5)
              </button>
            </div>
          </div>

          {/* Ores Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOres.map((ore) => {
              const canMine = pickaxePowerInput >= ore.minPickaxe;

              return (
                <div
                  key={ore.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    canMine
                      ? 'bg-[#081520] border-emerald-500/40 shadow-md shadow-emerald-950/30'
                      : 'bg-[#0a0f18] border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ore.color }} />
                        <h4 className="font-bold text-white text-base">{ore.name}</h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Tier {ore.tier} · {ore.phase === 'pre-hardmode' ? 'Pre-Hardmode' : 'Hardmode'}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      canMine ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {canMine ? '✓ Mineable' : `Requires ${ore.minPickaxe}%`}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div>
                      <span className="text-slate-400">Min Pickaxe: </span>
                      <strong className="text-amber-300">{ore.minPickaxe}% ({ore.pickaxeName})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Location: </span>
                      <span>{ore.whereToFind}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Best Depth: </span>
                      <span className="text-cyan-300">{ore.bestYLevel}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Essential Crafts:</div>
                    <div className="flex flex-wrap gap-1">
                      {ore.keyCrafts.map((craft, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-black/60 border border-white/5 text-[11px] text-slate-300">
                          {craft}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Demon/Crimson Altar Smashing Mechanics Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#140d22] border-2 border-purple-500/40 text-xs text-slate-300 space-y-2">
            <h3 className="font-bold text-sm text-purple-300 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Hardmode Demon & Crimson Altar Smashing Rules (1.4.4+ Patch)
            </h3>
            <p className="leading-relaxed">
              When entering Hardmode, use the <strong>Pwnhammer</strong> (dropped by Wall of Flesh) to smash Altars in the Corruption or Crimson:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <strong className="text-blue-400">1st Altar:</strong> Spawns Cobalt or Palladium Ore.
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <strong className="text-emerald-400">2nd Altar:</strong> Spawns Mythril or Orichalcum Ore.
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <strong className="text-slate-300">3rd Altar:</strong> Spawns Adamantite or Titanium Ore.
              </div>
            </div>
            <p className="text-[11px] text-emerald-300/90 pt-1">
              ✨ <strong>Quality of Life Update (1.4.4):</strong> Smashing altars NO LONGER converts a random stone block in the world into a corrupt block! You can freely smash altars without fear of infecting secret caverns.
            </p>
          </div>
        </div>
      )}

      {/* 6. TAB 4: UNDERGROUND & AETHER NAVIGATOR */}
      {activeTab === 'underground' && (
        <div className="space-y-6">
          {/* The Aether & Shimmer Dedicated Blueprint Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#12072b] via-[#1a0e38] to-[#0d0720] border-2 border-purple-400 shadow-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold uppercase text-base sm:text-lg">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                <span>The Aether & Shimmer Liquid Locator Guide</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-mono">
                1.4.4 Secret Biome
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              The Aether is a celestial subterranean biome containing the mystical <strong>Shimmer</strong> liquid. It generates exactly <strong>once per world</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-black/50 border border-purple-500/30 space-y-1">
                <strong className="text-amber-300">Exact Location Rule:</strong>
                <p className="text-slate-300 font-mono text-[11px]">
                  Always generates in the <strong>outer fifth</strong> of the world on the <strong>SAME SIDE as the Jungle</strong> (between the Jungle and the Ocean beach) in the Cavern layer!
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/50 border border-purple-500/30 space-y-1">
                <strong className="text-cyan-300">Permanent Booster Shimmer Crafts:</strong>
                <p className="text-slate-300 font-mono text-[11px]">
                  • Life Crystal → Vital Crystal (+regen)<br />
                  • Fruit → Aegis Fruit (+4 permanent defense)<br />
                  • Mana Crystal → Arcane Crystal (+mana regen)<br />
                  • Gold Worm → Gummy Worm (+3 fishing)
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/50 border border-purple-500/30 space-y-1">
                <strong className="text-emerald-300">Endgame Transmutations:</strong>
                <p className="text-slate-300 font-mono text-[11px]">
                  • Rod of Discord → <strong>Rod of Harmony</strong> (infinite teleports with 0 damage penalty!)<br />
                  • Clentaminator → <strong>Terraformer</strong> (95-tile beam)<br />
                  • Item Uncrafting: Decrafts items back to ores!
                </p>
              </div>
            </div>
          </div>

          {/* Depth Layers Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>World Depth Layers & Underground Structures</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {UNDERGROUND_LAYERS.map((layer) => (
                <div key={layer.id} className="p-4 rounded-2xl bg-[#08121f] border border-white/10 space-y-3 shadow-lg">
                  <div>
                    <h4 className="font-bold text-white text-base">{layer.name}</h4>
                    <span className="text-xs text-cyan-400 font-mono">{layer.depthRange}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {layer.characteristics}
                  </p>

                  <div className="space-y-1 text-xs">
                    <strong className="text-amber-300">Key Structures:</strong>
                    <div className="flex flex-wrap gap-1">
                      {layer.structures.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-black/60 border border-white/5 text-[11px] text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 bg-black/40 rounded-xl border border-white/5 text-[11px] text-slate-300">
                    <strong className="text-emerald-400">Locating Advice: </strong>
                    <span>{layer.locatingAdvice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 5: EVIL BIOMES (CRIMSON VS CORRUPTION) */}
      {activeTab === 'evil' && (
        <div className="space-y-6">
          {/* Evil Switcher */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveEvilTab('corruption')}
              className={`px-5 py-2.5 rounded-2xl font-bold uppercase transition-all flex items-center gap-2 text-xs sm:text-sm ${
                activeEvilTab === 'corruption'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 border-2 border-purple-400'
                  : 'bg-[#09121f] text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              <span>🟣 The Corruption (Purple)</span>
            </button>

            <button
              onClick={() => setActiveEvilTab('crimson')}
              className={`px-5 py-2.5 rounded-2xl font-bold uppercase transition-all flex items-center gap-2 text-xs sm:text-sm ${
                activeEvilTab === 'crimson'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 border-2 border-rose-400'
                  : 'bg-[#09121f] text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              <span>🔴 The Crimson (Red)</span>
            </button>
          </div>

          {/* Active Evil Detailed Guide */}
          {(() => {
            const evil = EVIL_BIOME_GUIDES.find(e => e.id === activeEvilTab) || EVIL_BIOME_GUIDES[0];

            return (
              <div className="space-y-6">
                {/* Comparison Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#08121f] border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase font-mono text-[10px]">World Boss:</span>
                    <div className="font-bold text-white text-base">{evil.bossName}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#08121f] border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase font-mono text-[10px]">Expert Accessory:</span>
                    <div className="font-bold text-amber-300 text-sm">{evil.expertAccessory}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#08121f] border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase font-mono text-[10px]">Hardmode Spell:</span>
                    <div className="font-bold text-cyan-300 text-sm">{evil.hardmodeSpell}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#08121f] border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase font-mono text-[10px]">Biome Chest Weapon:</span>
                    <div className="font-bold text-emerald-300 text-sm">{evil.biomeChestWeapon}</div>
                  </div>
                </div>

                {/* Boss Battle Tactics */}
                <div className="p-5 rounded-3xl bg-[#08121f] border border-white/10 space-y-3">
                  <h3 className="font-bold text-sm uppercase text-amber-300 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-amber-400" />
                    How to Fight & Defeat {evil.bossName}
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {evil.bossStrategy.map((strat, i) => (
                      <li key={i} className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <span className="text-amber-400 font-bold shrink-0">▸</span>
                        <span>{strat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The 3-Block Quarantine Rule (Containment Blueprint) */}
                <div className="p-5 rounded-3xl bg-[#08121f] border border-cyan-500/30 space-y-3">
                  <h3 className="font-bold text-sm uppercase text-cyan-300 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    The 3-Block Quarantine Tunnel Rule (Stop Evil Spread!)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    To prevent the {evil.name} from infecting your base, NPC villages, or the Jungle:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {evil.quarantineRules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <span className="text-cyan-400 font-bold shrink-0">✓</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cleansing & Purification Arsenal */}
                <div className="p-5 rounded-3xl bg-[#08121f] border border-emerald-500/30 space-y-3">
                  <h3 className="font-bold text-sm uppercase text-emerald-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Purification Tools (Dryad, Clentaminator, Terraformer)
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {evil.purificationTools.map((tool, i) => (
                      <li key={i} className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                        <span className="text-emerald-400 font-bold shrink-0">✦</span>
                        <span>{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
