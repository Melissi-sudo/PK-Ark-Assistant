import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Swords, 
  Map, 
  Pickaxe, 
  Layers, 
  ShieldAlert, 
  Check, 
  Search, 
  Skull, 
  ChevronRight, 
  Shield, 
  Copy, 
  Sparkles,
  TreePine,
  CheckCircle2,
  Table as TableIcon
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
import {
  TerrariaBossIcon,
  TerrariaHeart,
  TerrariaGoldHeart,
  TerrariaManaStar,
  TerrariaCoin,
  PurificationPowderIcon,
  ClentaminatorIcon,
  TerraformerIcon,
  GreenSolutionIcon,
  SunflowerIcon,
  QuarantineTunnelIcon,
  PwnhammerIcon,
  ShimmerIcon
} from './TerrariaIcons';

export type TerrariaTab = 'bosses' | 'table' | 'evil' | 'ores' | 'biomes' | 'underground';
export type DifficultyMode = 'classic' | 'expert' | 'master';

const LOCAL_STORAGE_BOSS_KEY = 'terraria_defeated_bosses_v2';
const LOCAL_STORAGE_DIFF_KEY = 'terraria_difficulty_preference';

export const TerrariaHub: React.FC = () => {
  const { subtab } = useParams<{ subtab?: string }>();
  const navigate = useNavigate();

  // Active tab state synced with route parameter
  const [activeTab, setActiveTab] = useState<TerrariaTab>(() => {
    if (subtab === 'table' || subtab === 'health' || subtab === 'matrix') return 'table';
    if (subtab === 'evil' || subtab === 'quarantine' || subtab === 'purification') return 'evil';
    if (subtab === 'ores' || subtab === 'mining') return 'ores';
    if (subtab === 'biomes' || subtab === 'fishing') return 'biomes';
    if (subtab === 'underground' || subtab === 'aether' || subtab === 'shimmer') return 'underground';
    return 'bosses';
  });

  // Sync state if subtab in URL changes
  useEffect(() => {
    if (!subtab) return;
    if (subtab === 'table' || subtab === 'health' || subtab === 'matrix') setActiveTab('table');
    else if (subtab === 'evil' || subtab === 'quarantine') setActiveTab('evil');
    else if (subtab === 'ores' || subtab === 'mining') setActiveTab('ores');
    else if (subtab === 'biomes') setActiveTab('biomes');
    else if (subtab === 'underground' || subtab === 'shimmer') setActiveTab('underground');
    else if (subtab === 'bosses') setActiveTab('bosses');
  }, [subtab]);

  const handleTabChange = (tab: TerrariaTab) => {
    setActiveTab(tab);
    navigate(`/terraria/${tab}`);
  };

  // Difficulty Mode selector (Classic / Expert / Master)
  const [difficulty, setDifficulty] = useState<DifficultyMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_DIFF_KEY);
      if (saved === 'classic' || saved === 'expert' || saved === 'master') return saved;
    }
    return 'classic';
  });

  const handleDifficultyChange = (mode: DifficultyMode) => {
    setDifficulty(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_DIFF_KEY, mode);
    }
  };

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

  // Selected items
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

  // Helper to format health with total tag if applicable
  const getBossHp = (boss: BossData, mode: DifficultyMode) => {
    const hp = boss.health[mode];
    return `${hp.toLocaleString()}${boss.hasTotalHealth ? ' total' : ''}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 text-[#e2d5b7] font-sans">
      
      {/* 1. TERRARIA HEADER BANNER WITH POSTER & STONE/GOLD FRAME */}
      <div className="relative rounded-2xl overflow-hidden border-4 border-[#3b476e] bg-[#161a2e] shadow-2xl">
        {/* Background Key Art */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/thumbnails/terraria_poster.jpg" 
            alt="Terraria Official Labor of Love Key Art" 
            className="w-full h-full object-cover object-center filter brightness-[0.35] saturate-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14182b] via-[#14182b]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14182b] via-transparent to-[#14182b]/95" />
        </div>

        {/* Terraria Corner Ornament Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#d4af37] z-20 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#d4af37] z-20 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#d4af37] z-20 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#d4af37] z-20 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-7 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Terraria Version Badge & Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded bg-[#232a48] border-2 border-[#54628d] text-[#fef08a] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span>TERRARIA 1.4.4+ LABOR OF LOVE</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-[#3b2d18] border-2 border-[#927129] text-[#fde047] font-bold text-xs uppercase tracking-wider">
                MASTER STRATEGY COMPENDIUM
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Terraria Master Companion
            </h1>

            <p className="text-xs sm:text-sm text-[#e5d7b8] leading-relaxed drop-shadow">
              Verified 18-boss progression checklists, Pre-Hardmode through Moon Lord summon recipes, accurate multi-difficulty health pools, authentic quarantine hellevator blueprints, and Shimmer locator maps.
            </p>

            {/* Quick Terraria Stat Chips */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
              <div className="flex items-center gap-1.5 bg-[#1b223c]/90 px-3 py-1.5 rounded-lg border-2 border-[#3b476e] text-[#facc15]">
                <Swords className="w-4 h-4 text-[#eab308]" />
                <span className="font-bold">18 Bosses</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1b223c]/90 px-3 py-1.5 rounded-lg border-2 border-[#3b476e] text-[#38bdf8]">
                <Map className="w-4 h-4 text-[#38bdf8]" />
                <span className="font-bold">8 Biomes</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1b223c]/90 px-3 py-1.5 rounded-lg border-2 border-[#3b476e] text-[#f97316]">
                <Pickaxe className="w-4 h-4 text-[#f97316]" />
                <span className="font-bold">12 Ore Tiers</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1b223c]/90 px-3 py-1.5 rounded-lg border-2 border-[#3b476e] text-[#c084fc]">
                <ShimmerIcon className="w-4 h-4" />
                <span className="font-bold">The Aether Shimmer</span>
              </div>
            </div>
          </div>

          {/* Right Card: Terraria Boss Progression Tracker & Difficulty Switcher */}
          <div className="w-full lg:w-84 p-4 sm:p-5 rounded-xl bg-[#1a2037]/95 border-2 border-[#4a5888] shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#fef08a] uppercase font-bold flex items-center gap-1.5 tracking-wider">
                <Skull className="w-4 h-4 text-[#facc15]" />
                Boss Progression
              </span>
              <span className="font-mono text-[#4ade80] font-bold text-sm">
                {defeatedBosses.size} / {TERRARIA_BOSSES.length}
              </span>
            </div>

            {/* Authentic Terraria Boss Progress Bar */}
            <div className="relative w-full h-4 bg-[#0a0d17] rounded-md border-2 border-[#343e62] overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-[#dc2626] via-[#ea580c] to-[#22c55e] rounded transition-all duration-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                style={{ width: `${bossProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#cbd5e1] font-mono">
              <span className="font-bold text-[#fef08a]">{bossProgress}% Conquered</span>
              <button
                onClick={() => setDefeatedBosses(new Set())}
                className="text-[10px] text-[#f87171] hover:text-[#ef4444] uppercase transition-colors underline cursor-pointer"
                title="Reset Boss Progress Checklist"
              >
                Reset Checklist
              </button>
            </div>

            {/* Difficulty Mode Selector */}
            <div className="pt-2 border-t border-[#343e62] space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider flex items-center justify-between">
                <span>World Difficulty:</span>
                <span className="text-[#fef08a] font-mono uppercase">{difficulty} Mode</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['classic', 'expert', 'master'] as DifficultyMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleDifficultyChange(mode)}
                    className={`py-1.5 rounded text-xs font-bold uppercase transition-all border cursor-pointer ${
                      difficulty === mode
                        ? mode === 'master'
                          ? 'bg-[#7f1d1d] border-[#ef4444] text-[#fee2e2] shadow-sm'
                          : mode === 'expert'
                          ? 'bg-[#78350f] border-[#f59e0b] text-[#fef3c7] shadow-sm'
                          : 'bg-[#1e293b] border-[#38bdf8] text-[#e0f2fe] shadow-sm'
                        : 'bg-[#121626] border-[#293252] text-[#94a3b8] hover:text-white hover:bg-[#1a2035]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TERRARIA INVENTORY TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#151a2d] p-2.5 rounded-xl border-2 border-[#3a476f] shadow-xl">
        {/* Terraria Inventory-Style Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => handleTabChange('bosses')}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
              activeTab === 'bosses'
                ? 'bg-[#293457] border-[#d4af37] text-[#fef08a] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                : 'bg-[#181e33] border-[#2d385a] text-[#cbd5e1] hover:text-white hover:bg-[#202742]'
            }`}
          >
            <Swords className="w-4 h-4 text-[#eab308]" />
            <span>Boss Progression</span>
          </button>

          <button
            onClick={() => handleTabChange('table')}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
              activeTab === 'table'
                ? 'bg-[#293457] border-[#d4af37] text-[#fef08a] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                : 'bg-[#181e33] border-[#2d385a] text-[#cbd5e1] hover:text-white hover:bg-[#202742]'
            }`}
          >
            <TableIcon className="w-4 h-4 text-[#f43f5e]" />
            <span>18-Boss Health Matrix</span>
          </button>

          <button
            onClick={() => handleTabChange('evil')}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
              activeTab === 'evil'
                ? 'bg-[#293457] border-[#d4af37] text-[#fef08a] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                : 'bg-[#181e33] border-[#2d385a] text-[#cbd5e1] hover:text-white hover:bg-[#202742]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#a855f7]" />
            <span>World Evils & Quarantine</span>
          </button>

          <button
            onClick={() => handleTabChange('ores')}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
              activeTab === 'ores'
                ? 'bg-[#293457] border-[#d4af37] text-[#fef08a] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                : 'bg-[#181e33] border-[#2d385a] text-[#cbd5e1] hover:text-white hover:bg-[#202742]'
            }`}
          >
            <Pickaxe className="w-4 h-4 text-[#f59e0b]" />
            <span>Ores & Mining</span>
          </button>

          <button
            onClick={() => handleTabChange('biomes')}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
              activeTab === 'biomes'
                ? 'bg-[#293457] border-[#d4af37] text-[#fef08a] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                : 'bg-[#181e33] border-[#2d385a] text-[#cbd5e1] hover:text-white hover:bg-[#202742]'
            }`}
          >
            <Map className="w-4 h-4 text-[#38bdf8]" />
            <span>Biomes & Loot</span>
          </button>

          <button
            onClick={() => handleTabChange('underground')}
            className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
              activeTab === 'underground'
                ? 'bg-[#293457] border-[#d4af37] text-[#fef08a] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                : 'bg-[#181e33] border-[#2d385a] text-[#cbd5e1] hover:text-white hover:bg-[#202742]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#c084fc]" />
            <span>Underground & Aether</span>
          </button>
        </div>

        {/* Universal Search Filter */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bosses, ores, solutions..."
            className="w-full pl-9 pr-7 py-1.5 bg-[#0e1220] border-2 border-[#2f395b] rounded-lg text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#d4af37]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. TAB 1: BOSS PROGRESSION & IN-DEPTH DOSSIER */}
      {activeTab === 'bosses' && (
        <div className="space-y-6">
          {/* Phase Filter & Quick Boss Tray */}
          <div className="p-3.5 rounded-xl bg-[#151a2d] border-2 border-[#3a476f] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#94a3b8] uppercase font-bold text-[11px]">Progression Filter:</span>
                <button
                  onClick={() => setBossPhaseFilter('all')}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors border cursor-pointer ${
                    bossPhaseFilter === 'all'
                      ? 'bg-[#293457] border-[#d4af37] text-[#fef08a]'
                      : 'bg-[#101423] border-[#26304d] text-slate-400 hover:text-white'
                  }`}
                >
                  All (18)
                </button>
                <button
                  onClick={() => setBossPhaseFilter('pre-hardmode')}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors border cursor-pointer ${
                    bossPhaseFilter === 'pre-hardmode'
                      ? 'bg-[#14532d] border-[#22c55e] text-[#dcfce7]'
                      : 'bg-[#101423] border-[#26304d] text-slate-400 hover:text-white'
                  }`}
                >
                  Pre-Hardmode (8)
                </button>
                <button
                  onClick={() => setBossPhaseFilter('hardmode')}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors border cursor-pointer ${
                    bossPhaseFilter === 'hardmode'
                      ? 'bg-[#581c87] border-[#a855f7] text-[#f3e8ff]'
                      : 'bg-[#101423] border-[#26304d] text-slate-400 hover:text-white'
                  }`}
                >
                  Hardmode (10)
                </button>
              </div>

              <div className="text-[11px] text-[#cbd5e1] font-mono flex items-center gap-2">
                <span>Displaying health in <strong>{difficulty.toUpperCase()}</strong> mode</span>
              </div>
            </div>

            {/* Quick 18-Boss Icon Strip (Terraria Style Inventory Slots) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
              {TERRARIA_BOSSES.map((b) => {
                const isSelected = selectedBoss.id === b.id;
                const isDefeated = defeatedBosses.has(b.id);

                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBoss(b)}
                    className={`relative w-11 h-11 shrink-0 rounded-lg flex items-center justify-center transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-[#2e3b62] border-[#facc15] shadow-[0_0_12px_rgba(250,204,21,0.35)] scale-105 z-10'
                        : isDefeated
                        ? 'bg-[#162238] border-[#10b981]/50 opacity-80 hover:opacity-100 hover:border-[#10b981]'
                        : 'bg-[#141a2c] border-[#2f395b] hover:border-[#54628d] hover:bg-[#1a2138]'
                    }`}
                    title={`${b.order}. ${b.name} (${b.phase})`}
                  >
                    <TerrariaBossIcon bossId={b.id} className="w-6 h-6" />
                    
                    {/* Boss Order Number Badge */}
                    <span className="absolute -top-1.5 -left-1.5 px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-[#0a0d17] border border-[#3b476e] text-slate-300">
                      #{b.order}
                    </span>

                    {/* Defeated Checkmark Badge */}
                    {isDefeated && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10b981] text-black flex items-center justify-center font-bold text-[9px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-Column Dossier: Boss List on Left, Active Dossier on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left: Interactive Boss Progression Checklist */}
            <div className="lg:col-span-5 space-y-2 max-h-[850px] overflow-y-auto pr-1">
              {filteredBosses.map((boss) => {
                const isSelected = selectedBoss.id === boss.id;
                const isDefeated = defeatedBosses.has(boss.id);

                return (
                  <div
                    key={boss.id}
                    onClick={() => setSelectedBoss(boss)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#222c4a] border-[#facc15] shadow-lg shadow-black/40'
                        : isDefeated
                        ? 'bg-[#121929] border-[#1e3a5f] opacity-85 hover:border-[#2e4c75]'
                        : 'bg-[#14192b] border-[#2b3554] hover:border-[#42507c] hover:bg-[#181f35]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Defeated Toggle Button */}
                      <button
                        onClick={(e) => toggleBossDefeated(boss.id, e)}
                        className={`w-6 h-6 rounded flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer ${
                          isDefeated
                            ? 'bg-[#10b981] border-[#34d399] text-black font-black'
                            : 'bg-[#0b0e18] border-[#475569] hover:border-[#94a3b8] text-transparent'
                        }`}
                        title={isDefeated ? 'Mark as Not Defeated' : 'Mark as Defeated'}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      {/* Boss Icon Slot */}
                      <div className="w-9 h-9 rounded-lg bg-[#1a2138] border border-[#3b476e] flex items-center justify-center shrink-0 shadow-inner">
                        <TerrariaBossIcon bossId={boss.id} className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm truncate ${isDefeated ? 'line-through text-slate-400' : 'text-white'}`}>
                            {boss.order}. {boss.name}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            boss.phase === 'pre-hardmode' ? 'bg-[#14532d] text-[#86efac]' : 'bg-[#581c87] text-[#e9d5ff]'
                          }`}>
                            {boss.phase === 'pre-hardmode' ? 'Pre-HM' : 'Hardmode'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#94a3b8] font-mono truncate flex items-center gap-1.5 mt-0.5">
                          <TerrariaHeart className="w-3 h-3 text-[#ef4444]" />
                          <span>{getBossHp(boss, difficulty)}</span>
                          <span className="text-slate-600">·</span>
                          <span className="truncate text-slate-400">{boss.summonItem}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-[#facc15] translate-x-1' : 'text-slate-600'}`} />
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Boss Authentic Terraria Strategy Dossier */}
            <div className="lg:col-span-7 bg-[#161a2e] rounded-2xl border-3 border-[#3b476e] p-5 sm:p-6 space-y-5 shadow-2xl">
              
              {/* Boss Header & Official Boss Health Bar Banner */}
              <div className="space-y-3 pb-4 border-b-2 border-[#2b3554]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#232b49] border-2 border-[#54628d] flex items-center justify-center shrink-0 shadow-inner">
                      <TerrariaBossIcon bossId={selectedBoss.id} className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                          {selectedBoss.order}. {selectedBoss.name}
                        </h2>
                      </div>
                      <p className="text-xs text-[#cbd5e1] mt-0.5">
                        Spawn Trigger: <span className="text-[#fde047] font-mono">{selectedBoss.spawnConditions}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBossDefeated(selectedBoss.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                      defeatedBosses.has(selectedBoss.id)
                        ? 'bg-[#14532d] border-[#22c55e] text-[#dcfce7]'
                        : 'bg-[#1a2138] border-[#3b476e] text-slate-300 hover:text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{defeatedBosses.has(selectedBoss.id) ? 'Defeated' : 'Mark Defeated'}</span>
                  </button>
                </div>

                {/* Terraria Official Boss Health Bar Graphic */}
                <div className="p-3 rounded-xl bg-[#0e1220] border-2 border-[#303c62] space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#94a3b8] uppercase font-bold flex items-center gap-1.5">
                      <TerrariaHeart className="w-3.5 h-3.5 text-[#ef4444]" />
                      Health Pool ({difficulty.toUpperCase()} MODE)
                    </span>
                    <span className="text-[#fef08a] font-bold text-sm">
                      {getBossHp(selectedBoss, difficulty)}
                    </span>
                  </div>

                  <div className="relative w-full h-5 bg-[#2a0e10] rounded border-2 border-[#7f1d1d] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#ef4444] rounded-sm relative">
                      {/* Segment tick lines */}
                      <div className="absolute inset-0 flex justify-between px-2 opacity-30 pointer-events-none">
                        <span className="w-0.5 h-full bg-black" />
                        <span className="w-0.5 h-full bg-black" />
                        <span className="w-0.5 h-full bg-black" />
                        <span className="w-0.5 h-full bg-black" />
                      </div>
                    </div>
                  </div>

                  {/* 3-Tier Multi-Difficulty Breakdown */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                    <div className={`p-1.5 rounded border ${difficulty === 'classic' ? 'bg-[#1a233d] border-[#38bdf8] text-[#38bdf8]' : 'bg-[#121626] border-[#232b45] text-slate-400'}`}>
                      <div className="text-[10px] uppercase font-bold">Classic</div>
                      <div className="text-xs font-bold">{selectedBoss.health.classic.toLocaleString()}</div>
                    </div>
                    <div className={`p-1.5 rounded border ${difficulty === 'expert' ? 'bg-[#2a1d0f] border-[#f59e0b] text-[#fbbf24]' : 'bg-[#121626] border-[#232b45] text-slate-400'}`}>
                      <div className="text-[10px] uppercase font-bold">Expert</div>
                      <div className="text-xs font-bold">{selectedBoss.health.expert.toLocaleString()}</div>
                    </div>
                    <div className={`p-1.5 rounded border ${difficulty === 'master' ? 'bg-[#2d1214] border-[#ef4444] text-[#f87171]' : 'bg-[#121626] border-[#232b45] text-slate-400'}`}>
                      <div className="text-[10px] uppercase font-bold">Master</div>
                      <div className="text-xs font-bold">{selectedBoss.health.master.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summon Recipe & Trigger */}
              <div className="p-3.5 rounded-xl bg-[#1f2742] border-2 border-[#3a476f] space-y-1">
                <span className="text-[10px] text-[#facc15] uppercase font-bold tracking-wider">
                  Summon Item & Crafting Recipe:
                </span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{selectedBoss.summonItem}</span>
                </div>
                <p className="text-xs text-[#cbd5e1] font-mono leading-relaxed">
                  {selectedBoss.summonRecipe}
                </p>
              </div>

              {/* Battle Tactics & Wiki-Verified Advice */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-[#fef08a] flex items-center gap-1.5 tracking-wider">
                  <Swords className="w-3.5 h-3.5 text-[#eab308]" />
                  <span>Encounter Strategy & Phase Mechanics</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-[#e5d7b8]">
                  {selectedBoss.tactics.map((tac, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[#121626] p-2.5 rounded-lg border border-[#2b3554]">
                      <span className="text-[#facc15] font-black shrink-0">▸</span>
                      <span>{tac}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arena Blueprint */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-[#38bdf8] flex items-center gap-1.5 tracking-wider">
                  <TreePine className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Arena Construction Blueprint</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-[#e5d7b8]">
                  {selectedBoss.arenaAdvice.map((adv, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[#121626] p-2.5 rounded-lg border border-[#2b3554]">
                      <span className="text-[#38bdf8] font-black shrink-0">✓</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Class Loadouts (Terraria Item Slot Style) */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-[#fef08a] tracking-wider">
                  Recommended Class Loadouts:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#14192b] border border-[#2d385a] space-y-0.5">
                    <span className="text-[10px] text-[#ef4444] font-bold uppercase">Melee:</span>
                    <p className="text-slate-200 font-mono text-[11px]">{selectedBoss.classRecommendations.melee}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14192b] border border-[#2d385a] space-y-0.5">
                    <span className="text-[10px] text-[#38bdf8] font-bold uppercase">Ranged:</span>
                    <p className="text-slate-200 font-mono text-[11px]">{selectedBoss.classRecommendations.ranged}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14192b] border border-[#2d385a] space-y-0.5">
                    <span className="text-[10px] text-[#a855f7] font-bold uppercase flex items-center gap-1">
                      <TerrariaManaStar className="w-3 h-3 text-[#38bdf8]" />
                      <span>Magic:</span>
                    </span>
                    <p className="text-slate-200 font-mono text-[11px]">{selectedBoss.classRecommendations.magic}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14192b] border border-[#2d385a] space-y-0.5">
                    <span className="text-[10px] text-[#22c55e] font-bold uppercase">Summoner:</span>
                    <p className="text-slate-200 font-mono text-[11px]">{selectedBoss.classRecommendations.summoner}</p>
                  </div>
                </div>
              </div>

              {/* Key Drops */}
              <div className="space-y-2 pt-2 border-t-2 border-[#2b3554]">
                <h3 className="text-xs font-bold uppercase text-[#fde047] tracking-wider">
                  Key Rewards & Drops:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBoss.keyDrops.map((drop, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-[#202844] border border-[#435284] text-[11px] text-[#e2d5b7] font-mono">
                      {drop}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: COMPLETE 18-BOSS HEALTH MATRIX (USER'S VERIFIED TABLE) */}
      {activeTab === 'table' && (
        <div className="space-y-4 bg-[#161a2e] p-5 sm:p-6 rounded-2xl border-3 border-[#3b476e] shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#2d385a]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-[#f43f5e]" />
                <span>Terraria 1.4.4+ Boss Health Progression Matrix</span>
              </h2>
              <p className="text-xs text-[#cbd5e1] mt-1">
                Official health scaling across all 18 primary bosses in Terraria 1.4.4+ Labor of Love. Click any boss to view full arena and strategy guide.
              </p>
            </div>

            {/* Quick Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#94a3b8] font-bold uppercase">Highlight:</span>
              <button
                onClick={() => setBossPhaseFilter('all')}
                className={`px-2.5 py-1 rounded text-xs font-bold uppercase border cursor-pointer ${
                  bossPhaseFilter === 'all' ? 'bg-[#293457] border-[#d4af37] text-[#fef08a]' : 'bg-[#101423] border-[#293252] text-slate-400'
                }`}
              >
                All (18)
              </button>
              <button
                onClick={() => setBossPhaseFilter('pre-hardmode')}
                className={`px-2.5 py-1 rounded text-xs font-bold uppercase border cursor-pointer ${
                  bossPhaseFilter === 'pre-hardmode' ? 'bg-[#14532d] border-[#22c55e] text-white' : 'bg-[#101423] border-[#293252] text-slate-400'
                }`}
              >
                Pre-HM
              </button>
              <button
                onClick={() => setBossPhaseFilter('hardmode')}
                className={`px-2.5 py-1 rounded text-xs font-bold uppercase border cursor-pointer ${
                  bossPhaseFilter === 'hardmode' ? 'bg-[#581c87] border-[#a855f7] text-white' : 'bg-[#101423] border-[#293252] text-slate-400'
                }`}
              >
                Hardmode
              </button>
            </div>
          </div>

          {/* Authentic Terraria Stone Frame Table */}
          <div className="overflow-x-auto rounded-xl border-2 border-[#333e62] bg-[#0f1322]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1f2742] text-[#fef08a] font-bold uppercase border-b-2 border-[#3b476e] text-[11px] tracking-wider">
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  <th className="py-3 px-4">Boss</th>
                  <th className="py-3 px-3 text-center">Phase</th>
                  <th className="py-3 px-4 text-right">Classic</th>
                  <th className="py-3 px-4 text-right text-[#fbbf24]">Expert</th>
                  <th className="py-3 px-4 text-right text-[#f87171]">Master</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232b45] font-mono">
                {TERRARIA_BOSSES.filter(b => bossPhaseFilter === 'all' || b.phase === bossPhaseFilter).map((boss) => {
                  const isDefeated = defeatedBosses.has(boss.id);
                  const isSelected = selectedBoss.id === boss.id;

                  return (
                    <tr 
                      key={boss.id}
                      onClick={() => {
                        setSelectedBoss(boss);
                        handleTabChange('bosses');
                      }}
                      className={`transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#252f52] text-white font-bold' 
                          : isDefeated
                          ? 'bg-[#111626]/70 hover:bg-[#192138] text-slate-300'
                          : 'hover:bg-[#1a2139] text-[#e2d5b7]'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                        {boss.order}
                      </td>

                      <td className="py-2.5 px-4 font-sans font-bold flex items-center gap-2.5">
                        <TerrariaBossIcon bossId={boss.id} className="w-5 h-5 shrink-0" />
                        <span className={isDefeated ? 'line-through text-slate-400' : 'text-white'}>
                          {boss.name}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          boss.phase === 'pre-hardmode' ? 'bg-[#14532d] text-[#86efac]' : 'bg-[#581c87] text-[#e9d5ff]'
                        }`}>
                          {boss.phase === 'pre-hardmode' ? 'Pre-HM' : 'Hardmode'}
                        </span>
                      </td>

                      <td className="py-2.5 px-4 text-right font-bold text-[#e2e8f0]">
                        {boss.health.classic.toLocaleString()}{boss.hasTotalHealth ? ' total' : ''}
                      </td>

                      <td className="py-2.5 px-4 text-right font-bold text-[#facc15]">
                        {boss.health.expert.toLocaleString()}{boss.hasTotalHealth ? ' total' : ''}
                      </td>

                      <td className="py-2.5 px-4 text-right font-bold text-[#f87171]">
                        {boss.health.master.toLocaleString()}{boss.hasTotalHealth ? ' total' : ''}
                      </td>

                      <td className="py-2.5 px-4 text-center font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBossDefeated(boss.id);
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            isDefeated
                              ? 'bg-[#10b981] text-black font-extrabold'
                              : 'bg-[#1c233c] text-slate-400 hover:text-white border border-[#3b476e]'
                          }`}
                        >
                          {isDefeated ? 'Defeated ✓' : 'Incomplete'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 3: WORLD EVILS & QUARANTINE (CRIMSON VS CORRUPTION) */}
      {activeTab === 'evil' && (
        <div className="space-y-6">
          
          {/* Evil Switcher */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveEvilTab('corruption')}
              className={`px-5 py-2.5 rounded-xl font-black uppercase transition-all flex items-center gap-2 text-xs sm:text-sm border-2 cursor-pointer ${
                activeEvilTab === 'corruption'
                  ? 'bg-[#4c1d95] text-white shadow-lg shadow-purple-950/60 border-[#a855f7]'
                  : 'bg-[#14192b] text-[#94a3b8] border-[#2d385a] hover:text-white'
              }`}
            >
              <TerrariaBossIcon bossId="eater-of-worlds" className="w-5 h-5" />
              <span>The Corruption (Purple Evil)</span>
            </button>

            <button
              onClick={() => setActiveEvilTab('crimson')}
              className={`px-5 py-2.5 rounded-xl font-black uppercase transition-all flex items-center gap-2 text-xs sm:text-sm border-2 cursor-pointer ${
                activeEvilTab === 'crimson'
                  ? 'bg-[#881337] text-white shadow-lg shadow-rose-950/60 border-[#f43f5e]'
                  : 'bg-[#14192b] text-[#94a3b8] border-[#2d385a] hover:text-white'
              }`}
            >
              <TerrariaBossIcon bossId="brain-of-cthulhu" className="w-5 h-5" />
              <span>The Crimson (Red Gore Evil)</span>
            </button>
          </div>

          {/* Active Evil Detailed Guide */}
          {(() => {
            const evil = EVIL_BIOME_GUIDES.find(e => e.id === activeEvilTab) || EVIL_BIOME_GUIDES[0];

            return (
              <div className="space-y-5">
                {/* Comparison Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#161a2e] border-2 border-[#3a476f] space-y-1">
                    <span className="text-[#94a3b8] uppercase font-mono text-[10px]">World Boss:</span>
                    <div className="font-black text-white text-base flex items-center gap-2">
                      <TerrariaBossIcon bossId={evil.id === 'corruption' ? 'eater-of-worlds' : 'brain-of-cthulhu'} className="w-5 h-5" />
                      <span>{evil.bossName}</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#161a2e] border-2 border-[#3a476f] space-y-1">
                    <span className="text-[#94a3b8] uppercase font-mono text-[10px]">Expert Accessory:</span>
                    <div className="font-bold text-[#fde047] text-sm">{evil.expertAccessory}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#161a2e] border-2 border-[#3a476f] space-y-1">
                    <span className="text-[#94a3b8] uppercase font-mono text-[10px]">Hardmode Spell:</span>
                    <div className="font-bold text-[#38bdf8] text-sm">{evil.hardmodeSpell}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#161a2e] border-2 border-[#3a476f] space-y-1">
                    <span className="text-[#94a3b8] uppercase font-mono text-[10px]">Biome Chest Weapon:</span>
                    <div className="font-bold text-[#4ade80] text-sm">{evil.biomeChestWeapon}</div>
                  </div>
                </div>

                {/* Boss Battle Tactics & Mechanics */}
                <div className="p-5 rounded-2xl bg-[#161a2e] border-2 border-[#3a476f] space-y-3 shadow-xl">
                  <h3 className="font-black text-sm uppercase text-[#fef08a] flex items-center gap-2 tracking-wide">
                    <Swords className="w-4 h-4 text-[#eab308]" />
                    <span>How to Fight & Defeat {evil.bossName}</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-[#e5d7b8]">
                    {evil.bossStrategy.map((strat, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-[#0f1322] p-3 rounded-lg border border-[#2b3554]">
                        <span className="text-[#facc15] font-black shrink-0 text-sm">▸</span>
                        <span className="leading-relaxed">{strat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The 3-6 Block Quarantine Tunnel Rule (Verified Terraria Wiki Guidelines) */}
                <div className="p-5 rounded-2xl bg-[#141a2e] border-3 border-[#38bdf8]/60 space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-black text-sm uppercase text-[#38bdf8] flex items-center gap-2 tracking-wide">
                      <QuarantineTunnelIcon className="w-5 h-5 text-[#38bdf8]" />
                      <span>Quarantine Tunnel & Hellevator Rules (Prevent Evil Spread!)</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0c223c] border border-[#38bdf8]/40 text-[#7dd3fc]">
                      3 to 6-Tile Rule
                    </span>
                  </div>

                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    Protect critical areas such as your <strong>main base</strong>, <strong>NPC villages</strong>, and the <strong>Jungle</strong> from infection upon entering Hardmode:
                  </p>

                  {/* Visual Quarantine Schematic */}
                  <div className="p-3.5 rounded-xl bg-[#0b101e] border border-[#2d385a] grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#141a2c] border border-[#343e62] space-y-1">
                      <strong className="text-[#facc15]">Standard Tunnels (Underground):</strong>
                      <p className="text-slate-300 font-mono text-[11px]">
                        3-tile-wide tunnels are generally recommended throughout subterranean stone and dirt.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#141a2c] border border-[#343e62] space-y-1">
                      <strong className="text-[#ef4444]">Surface Thorns Warning (6 Tiles):</strong>
                      <p className="text-slate-300 font-mono text-[11px]">
                        Near the surface, Corruption & Crimson thorns grow across up to 6 tiles. Line tunnels with non-corruptible blocks!
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#141a2c] border border-[#343e62] space-y-1">
                      <strong className="text-[#4ade80]">Non-Corruptible Barriers:</strong>
                      <p className="text-slate-300 font-mono text-[11px]">
                        Wood, Hay, Dungeon Bricks, and Gray Bricks prevent thorn growth from bridging quarantine gaps.
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-[#e5d7b8]">
                    {evil.quarantineRules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2.5 bg-[#0f1322] p-3 rounded-lg border border-[#2b3554]">
                        <span className="text-[#38bdf8] font-black shrink-0">✓</span>
                        <span className="leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Purification Tools (Dryad, Clentaminator, Terraformer) with Exact Coin Costs */}
                <div className="p-5 rounded-2xl bg-[#142220] border-3 border-[#22c55e]/50 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-black text-sm uppercase text-[#4ade80] flex items-center gap-2 tracking-wide">
                      <Sparkles className="w-5 h-5 text-[#22c55e]" />
                      <span>Purification Tools & Solution Pricing (Verified Costs)</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0f2e1e] border border-[#22c55e]/40 text-[#86efac]">
                      Dryad · Steampunker · Shimmer
                    </span>
                  </div>

                  {/* 3 Dedicated Item Cards with Coins */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                    
                    {/* Pre-Hardmode: Purification Powder */}
                    <div className="p-3.5 rounded-xl bg-[#0b1512] border-2 border-[#1f4a34] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PurificationPowderIcon className="w-5 h-5" />
                          <strong className="text-white text-sm">Purification Powder</strong>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#14532d] text-[#86efac]">
                          Pre-Hardmode
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#cbd5e1]">
                        <span>Cost: </span>
                        <span className="font-bold text-[#ea580c] flex items-center gap-1">
                          75 <TerrariaCoin tier="copper" /> copper
                        </span>
                        <span>from Dryad NPC</span>
                      </div>

                      <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                        Cleanses Crimson and Corruption tiles on contact. Note: <em>Vicious Powder</em> is NOT for cleansing (it spreads Crimson!).
                      </p>
                    </div>

                    {/* Hardmode: Clentaminator & Green Solution */}
                    <div className="p-3.5 rounded-xl bg-[#0b1512] border-2 border-[#1f4a34] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ClentaminatorIcon className="w-5 h-5" />
                          <strong className="text-white text-sm">Clentaminator</strong>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#581c87] text-[#e9d5ff]">
                          Hardmode
                        </span>
                      </div>

                      <div className="space-y-1 font-mono text-[11px] text-[#cbd5e1]">
                        <div className="flex items-center gap-1">
                          <span>Tool: </span>
                          <span className="font-bold text-[#38bdf8] flex items-center gap-1">
                            2 <TerrariaCoin tier="platinum" /> Platinum
                          </span>
                          <span>(Steampunker)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Ammo: </span>
                          <span className="font-bold text-[#94a3b8] flex items-center gap-1">
                            15 <TerrariaCoin tier="silver" /> silver
                          </span>
                          <span>(Green Solution)</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                        Fires a pressurized 60-tile purifying beam through walls and ceilings after at least 1 Mechanical Boss.
                      </p>
                    </div>

                    {/* Endgame: Terraformer */}
                    <div className="p-3.5 rounded-xl bg-[#0b1512] border-2 border-[#1f4a34] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TerraformerIcon className="w-5 h-5" />
                          <strong className="text-white text-sm">The Terraformer</strong>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#78350f] text-[#fef08a]">
                          Endgame
                        </span>
                      </div>

                      <div className="font-mono text-[11px] text-[#cbd5e1]">
                        <span>Recipe: Throw Clentaminator into </span>
                        <strong className="text-[#c084fc]">Shimmer</strong>
                        <span> post-Moon Lord</span>
                      </div>

                      <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                        Mega 95-tile range beam, wider spray trajectory, and a permanent <strong>33% chance not to consume solution</strong>!
                      </p>
                    </div>

                  </div>

                  <ul className="space-y-2 text-xs text-[#e5d7b8] pt-1">
                    {evil.purificationTools.map((tool, i) => (
                      <li key={i} className="flex items-start gap-2 bg-[#091510] p-3 rounded-lg border border-[#1b3d2b]">
                        <span className="text-[#22c55e] font-black shrink-0">✦</span>
                        <span className="leading-relaxed">{tool}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* 6. TAB 4: ORES & MINING PROGRESSION */}
      {activeTab === 'ores' && (
        <div className="space-y-6">
          {/* Phase Filter & Pickaxe Power Tool */}
          <div className="p-4 rounded-xl bg-[#161a2e] border-2 border-[#3a476f] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#94a3b8] uppercase font-bold text-[11px]">Ore Phase:</span>
              <button
                onClick={() => setSelectedOrePhase('all')}
                className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors border cursor-pointer ${
                  selectedOrePhase === 'all'
                    ? 'bg-[#293457] border-[#d4af37] text-[#fef08a]'
                    : 'bg-[#101423] border-[#26304d] text-slate-400 hover:text-white'
                }`}
              >
                All (12)
              </button>
              <button
                onClick={() => setSelectedOrePhase('pre-hardmode')}
                className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors border cursor-pointer ${
                  selectedOrePhase === 'pre-hardmode'
                    ? 'bg-[#14532d] border-[#22c55e] text-white'
                    : 'bg-[#101423] border-[#26304d] text-slate-400 hover:text-white'
                }`}
              >
                Pre-Hardmode (7)
              </button>
              <button
                onClick={() => setSelectedOrePhase('hardmode')}
                className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors border cursor-pointer ${
                  selectedOrePhase === 'hardmode'
                    ? 'bg-[#581c87] border-[#a855f7] text-white'
                    : 'bg-[#101423] border-[#26304d] text-slate-400 hover:text-white'
                }`}
              >
                Hardmode (5)
              </button>
            </div>

            {/* Interactive Pickaxe Power Calculator */}
            <div className="flex items-center gap-2 text-xs font-mono bg-[#0f1322] px-3 py-1.5 rounded-lg border border-[#2d385a]">
              <span className="text-[#facc15] font-bold">My Pickaxe Power:</span>
              <input
                type="number"
                min="35"
                max="225"
                value={pickaxePowerInput}
                onChange={(e) => setPickaxePowerInput(Number(e.target.value))}
                className="w-16 px-1.5 py-0.5 bg-[#1b223c] border border-[#435284] rounded text-center text-white font-bold"
              />
              <span className="text-slate-400">%</span>
            </div>
          </div>

          {/* Ore Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOres.map((ore) => {
              const canMine = pickaxePowerInput >= ore.minPickaxe;

              return (
                <div 
                  key={ore.id} 
                  className={`p-4 rounded-xl border-2 transition-all space-y-3 shadow-lg ${
                    canMine 
                      ? 'bg-[#161b2e] border-[#3b476e]' 
                      : 'bg-[#111422] border-[#262c45] opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-sm shrink-0 border border-black/40" style={{ backgroundColor: ore.color }} />
                        <h4 className="font-black text-white text-base">{ore.name}</h4>
                      </div>
                      <span className="text-[11px] text-[#cbd5e1] font-mono">
                        Tier {ore.tier} · {ore.counterpart}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      canMine ? 'bg-[#14532d] text-[#86efac]' : 'bg-[#7f1d1d] text-[#fca5a5]'
                    }`}>
                      {canMine ? 'Minable ✓' : `Need ${ore.minPickaxe}%`}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono bg-[#0e1220] p-2.5 rounded-lg border border-[#26304d]">
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">Min Pickaxe:</span>
                      <strong className="text-[#facc15]">{ore.minPickaxe}% ({ore.pickaxeName})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">Best Depth:</span>
                      <span className="text-[#38bdf8] truncate ml-1">{ore.bestYLevel}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <div className="text-[10px] text-[#94a3b8] uppercase font-bold mb-1">Key Crafts:</div>
                    <div className="flex flex-wrap gap-1">
                      {ore.keyCrafts.map((craft, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#202844] border border-[#3b476e] text-[11px] text-[#cbd5e1] font-mono">
                          {craft}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hardmode Altar Smashing Mechanics Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1c122e] border-2 border-[#a855f7]/60 text-xs text-[#e9d5ff] space-y-2 shadow-xl">
            <h3 className="font-bold text-sm text-[#fef08a] uppercase flex items-center gap-2 tracking-wide">
              <PwnhammerIcon className="w-5 h-5 text-[#facc15]" />
              <span>Hardmode Demon & Crimson Altar Smashing Rules (1.4.4+ Patch)</span>
            </h3>
            <p className="leading-relaxed">
              When entering Hardmode, use the <strong>Pwnhammer</strong> (dropped by Wall of Flesh) to smash Altars in the Corruption or Crimson:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#0e101f] border border-[#3b476e]">
                <strong className="text-[#38bdf8]">1st Altar:</strong> Spawns Cobalt or Palladium Ore.
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e101f] border border-[#3b476e]">
                <strong className="text-[#22c55e]">2nd Altar:</strong> Spawns Mythril or Orichalcum Ore.
              </div>
              <div className="p-2.5 rounded-lg bg-[#0e101f] border border-[#3b476e]">
                <strong className="text-[#cbd5e1]">3rd Altar:</strong> Spawns Adamantite or Titanium Ore.
              </div>
            </div>
            <p className="text-[11px] text-[#86efac] pt-1">
              ✓ <strong>Quality of Life Update (1.4.4):</strong> Smashing altars NO LONGER converts a random stone block in the world into an infected block! You can freely smash altars without fear of corrupting caverns.
            </p>
          </div>
        </div>
      )}

      {/* 7. TAB 5: BIOMES & SURFACE EXPLORATION */}
      {activeTab === 'biomes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left: Biome Selector List */}
            <div className="md:col-span-4 space-y-2">
              {filteredBiomes.map((biome) => {
                const isSelected = selectedBiome.id === biome.id;

                return (
                  <button
                    key={biome.id}
                    onClick={() => setSelectedBiome(biome)}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#242e4e] border-[#d4af37] shadow-lg shadow-black/40 text-white'
                        : 'bg-[#151a2d] border-[#2b3554] text-[#cbd5e1] hover:bg-[#1a2139] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: biome.color }} />
                      <span className="font-bold text-sm">{biome.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-[#facc15] translate-x-1' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right: Selected Biome Dossier */}
            <div className="md:col-span-8 bg-[#161a2e] rounded-2xl border-3 border-[#3b476e] p-5 sm:p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#2b3554]">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedBiome.color }} />
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                    {selectedBiome.name}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono uppercase bg-[#202844] border border-[#3b476e] text-[#fef08a]">
                  Layer: {selectedBiome.layer}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                {selectedBiome.overview}
              </p>

              {/* Unique Loot & Fishing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0f1322] border border-[#2b3554] space-y-1.5">
                  <strong className="text-[#facc15] uppercase text-[11px] block">Unique Chest & Drop Loot:</strong>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    {selectedBiome.uniqueLoot.map((l, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#1c233c] border border-[#3a476f] text-slate-200">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f1322] border border-[#2b3554] space-y-1.5">
                  <strong className="text-[#38bdf8] uppercase text-[11px] block">Fishing Catches & Crates:</strong>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    {selectedBiome.fishingCatches.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#1c233c] border border-[#3a476f] text-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preferred NPCs */}
              <div className="p-3 rounded-xl bg-[#1f2742] border border-[#3b476e] text-xs">
                <strong className="text-[#fef08a] uppercase text-[11px] block mb-1">Optimal NPC Happiness Housing:</strong>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {selectedBiome.npcPreferences.map((npc, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded bg-[#14192b] border border-[#4a5888] text-white font-bold">
                      {npc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Critical Exploration Advice */}
              <div className="space-y-1.5 pt-1">
                <strong className="text-[#fef08a] uppercase text-xs block">Exploration Tips:</strong>
                <ul className="space-y-1.5 text-xs text-[#cbd5e1]">
                  {selectedBiome.criticalTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[#0f1322] p-2.5 rounded-lg border border-[#26304d]">
                      <span className="text-[#facc15] font-black shrink-0">▸</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 6: UNDERGROUND & AETHER LOCATOR */}
      {activeTab === 'underground' && (
        <div className="space-y-6">
          
          {/* The Aether & Shimmer Dedicated Blueprint Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1b0d36] via-[#231245] to-[#120a24] border-3 border-[#c084fc] shadow-2xl space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-[#f3e8ff] font-black uppercase text-base sm:text-xl">
                <ShimmerIcon className="w-6 h-6 text-[#c084fc]" />
                <span>The Aether & Shimmer Liquid Locator Guide</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#3b1764] border border-[#c084fc]/50 text-[#f3e8ff] text-xs font-mono font-bold">
                1.4.4 Secret Biome
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#e9d5ff] leading-relaxed">
              The Aether is a celestial subterranean biome containing the mystical <strong>Shimmer</strong> liquid. It generates exactly <strong>once per world</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0e061c]/80 border border-[#a855f7]/40 space-y-1.5">
                <strong className="text-[#fde047] uppercase text-[11px] block">Exact World Generation Location:</strong>
                <p className="text-[#e2e8f0] font-mono text-[11px] leading-relaxed">
                  Always generates in the <strong>outer fifth</strong> of the world on the <strong>SAME SIDE as the Jungle</strong> (between the Jungle and the Ocean beach) in the Cavern layer!
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e061c]/80 border border-[#a855f7]/40 space-y-1.5">
                <strong className="text-[#38bdf8] uppercase text-[11px] block">Permanent Booster Transformations:</strong>
                <p className="text-[#e2e8f0] font-mono text-[11px] leading-relaxed">
                  • Life Crystal → Vital Crystal (+regen)<br />
                  • Fruit → Aegis Fruit (+4 permanent defense)<br />
                  • Mana Crystal → Arcane Crystal (+mana regen)<br />
                  • Gold Worm → Gummy Worm (+3 fishing)
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e061c]/80 border border-[#a855f7]/40 space-y-1.5">
                <strong className="text-[#4ade80] uppercase text-[11px] block">Endgame Transmutations:</strong>
                <p className="text-[#e2e8f0] font-mono text-[11px] leading-relaxed">
                  • Rod of Discord → <strong>Rod of Harmony</strong> (infinite teleports with 0 penalty!)<br />
                  • Clentaminator → <strong>Terraformer</strong> (95-tile beam)<br />
                  • Item Uncrafting: Decrafts items back to raw ores!
                </p>
              </div>
            </div>
          </div>

          {/* Depth Layers Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#38bdf8]" />
              <span>World Depth Layers & Underground Structures</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {UNDERGROUND_LAYERS.map((layer) => (
                <div key={layer.id} className="p-4 rounded-xl bg-[#161a2e] border-2 border-[#3b476e] space-y-3 shadow-lg">
                  <div>
                    <h4 className="font-black text-white text-base">{layer.name}</h4>
                    <span className="text-xs text-[#38bdf8] font-mono">{layer.depthRange}</span>
                  </div>

                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {layer.characteristics}
                  </p>

                  <div className="space-y-1 text-xs">
                    <strong className="text-[#fde047]">Key Structures:</strong>
                    <div className="flex flex-wrap gap-1">
                      {layer.structures.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#101423] border border-[#2f395b] text-[11px] text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#0e1220] rounded-lg border border-[#2b3554] text-[11px] text-[#cbd5e1]">
                    <strong className="text-[#4ade80]">Locating Advice: </strong>
                    <span>{layer.locatingAdvice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
