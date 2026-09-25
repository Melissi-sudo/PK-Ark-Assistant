import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Palette, 
  Map, 
  Wrench, 
  Compass, 
  Flame, 
  Beaker, 
  Pickaxe, 
  Users, 
  BookOpen, 
  Skull, 
  Cpu, 
  Sparkles,
  Shield,
  Terminal,
  Heart,
  Wand2,
  Layers,
  ChevronRight
} from 'lucide-react';

import { MinecraftTextColorGenerator } from './MinecraftTextColorGenerator';
import { CustomItemCommandGenerator } from './CustomItemCommandGenerator';
import { MinecraftSeedMapViewer } from './MinecraftSeedMapViewer';
import { NetherPortalCalculator } from './NetherPortalCalculator';
import { PotionBrewingLab } from './PotionBrewingLab';
import { OreDistributionGuide } from './OreDistributionGuide';
import { VillagerTradingGuide } from './VillagerTradingGuide';
import { EnchantingAnvilGuide } from './EnchantingAnvilGuide';
import { MobMechanicsGuide } from './MobMechanicsGuide';
import { RedstoneTickGuide } from './RedstoneTickGuide';

type GameModeCategory = 'all' | 'survival' | 'creative';
type ToolTab = 
  | 'seed_map'
  | 'item_summon'
  | 'text_generator'
  | 'portal'
  | 'potions'
  | 'ores'
  | 'villagers'
  | 'enchanting'
  | 'mobs'
  | 'redstone';

interface ToolItem {
  id: ToolTab;
  title: string;
  shortDesc: string;
  category: 'survival' | 'creative';
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const TOOLS_CONFIG: ToolItem[] = [
  // Creative & Commands
  {
    id: 'item_summon',
    title: 'Item & Enchant Summon Generator',
    shortDesc: 'Summon items with custom names, lore, and enchants (Note: Currently in development, will start working in a while).',
    category: 'creative',
    categoryLabel: 'Creative / Command',
    icon: Wand2,
    tag: 'In Development'
  },
  {
    id: 'text_generator',
    title: 'Command Block & Sign Gradient Generator',
    shortDesc: 'Generate gradient hex color codes for Command Blocks (/tellraw, /title) and chat. Sign generator currently in development.',
    category: 'creative',
    categoryLabel: 'Creative / Command',
    icon: Palette,
    tag: 'Cmds Active · Sign Dev'
  },
  // Survival
  {
    id: 'seed_map',
    title: 'Chunkbase Seed Map',
    shortDesc: 'Official 100% accurate biome and structure map via Chunkbase Seed Map launcher.',
    category: 'survival',
    categoryLabel: 'Survival Mode',
    icon: Map,
    tag: 'Chunkbase'
  },
  {
    id: 'portal',
    title: 'Nether Portal 3D Linking',
    shortDesc: 'Exact 8:1 coordinate converter with 3D spherical euclidean distance verification and portal room layouts.',
    category: 'survival',
    categoryLabel: 'Survival Mode',
    icon: Flame,
    tag: 'Dimension Travel'
  },
  {
    id: 'potions',
    title: '1.21 Potion Brewing Lab',
    shortDesc: 'Interactive brewing simulator with 1.21 Tricky Trials effects (Oozing, Infested, Weaving, Wind Charged).',
    category: 'survival',
    categoryLabel: 'Survival Mode',
    icon: Beaker,
    tag: 'Alchemy'
  },
  {
    id: 'ores',
    title: 'Ore Elevation & Mining Heights',
    shortDesc: '1.21+ triangular distribution graphs, Y-level scanner, Fortune III drop rates & Ancient Debris mining.',
    category: 'survival',
    categoryLabel: 'Survival Mode',
    icon: Pickaxe,
    tag: 'Mining'
  },
  {
    id: 'villagers',
    title: 'Villager Trading Matrix',
    shortDesc: 'Workstation assignment, optimal Mending trade cycles, 1-emerald discount logic & biome trades.',
    category: 'survival',
    categoryLabel: 'Survival Mode',
    icon: Users,
    tag: 'Villages & Economy'
  },
  {
    id: 'enchanting',
    title: 'Enchanting & Anvil Optimal Path',
    shortDesc: 'Level 30 bookshelf layout, prior work penalty solver, and optimal Mace 1.21 combination sequences.',
    category: 'survival',
    categoryLabel: 'Survival Mode',
    icon: BookOpen,
    tag: 'Enchanting'
  },
  {
    id: 'mobs',
    title: 'Mob Spawning & Light Rules',
    shortDesc: 'Light level 0 spawn mechanics, despawn radius spheres (0-24, 24-32, 32-128), and Raid wave composition.',
    category: 'survival',
    categoryLabel: 'Survival Mode',
    icon: Skull,
    tag: 'Combat & Spawns'
  },
  {
    id: 'redstone',
    title: 'Redstone & Tick Delay Engine',
    shortDesc: 'Game tick (20 Hz) vs Redstone tick (10 Hz) converter, repeater pulse delays & hopper transfer rates.',
    category: 'survival',
    categoryLabel: 'Survival Mode',
    icon: Cpu,
    tag: 'Automation'
  }
];

export const MinecraftHub: React.FC = () => {
  const navigate = useNavigate();

  // Mode Filter: All, Survival, Creative
  const [filterMode, setFilterMode] = useState<GameModeCategory>('all');

  // Currently Active Tool
  const [activeTab, setActiveTab] = useState<ToolTab>('seed_map');

  const filteredTools = TOOLS_CONFIG.filter(tool => {
    if (filterMode === 'all') return true;
    return tool.category === filterMode;
  });

  return (
    <div className="font-mojangles min-h-[85vh] flex flex-col space-y-6">
      {/* Minecraft Blocky Top Grass Header */}
      <div className="mc-panel-dirt rounded-none border-4 border-[#0e0a07] shadow-2xl overflow-hidden">
        {/* Grass Block Green Top Layer */}
        <div className="mc-grass-header px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-[#2b4414]">
          <div className="flex items-center gap-3">
            <Link
              to="/library"
              className="mc-button px-3 py-1.5 text-xs text-white uppercase flex items-center gap-2 cursor-pointer"
              title="Return to PK Ultimate Guide Menu"
            >
              <ArrowLeft className="w-4 h-4 text-yellow-300" />
              <span>Library Menu</span>
            </Link>

            <div className="text-white drop-shadow-[2px_2px_0px_#1e2f0d]">
              <span className="text-xs text-yellow-300 uppercase block tracking-wider">
                PK Ultimate Guide
              </span>
              <h1 className="text-lg sm:text-2xl font-bold uppercase tracking-wide">
                Minecraft Tactical Suite
              </h1>
            </div>
          </div>

          {/* Mode Divider Switcher: All vs Survival Mode vs Creative & Commands */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#1a2b0d] p-1 border-2 border-[#41681a] flex-wrap">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs uppercase cursor-pointer transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#5b8731] text-yellow-300 font-bold border border-[#7cb342]'
                  : 'text-[#ccebb0] hover:text-white'
              }`}
            >
              All Tools ({TOOLS_CONFIG.length})
            </button>

            <button
              onClick={() => {
                setFilterMode('survival');
                if (TOOLS_CONFIG.find(t => t.id === activeTab)?.category !== 'survival') {
                  setActiveTab('seed_map');
                }
              }}
              className={`px-3 py-1.5 text-xs uppercase cursor-pointer transition-colors flex items-center gap-1.5 ${
                filterMode === 'survival'
                  ? 'bg-[#2b5414] text-emerald-300 font-bold border border-[#4a8028]'
                  : 'text-[#ccebb0] hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>Survival Mode ({TOOLS_CONFIG.filter(t => t.category === 'survival').length})</span>
            </button>

            <button
              onClick={() => {
                setFilterMode('creative');
                if (TOOLS_CONFIG.find(t => t.id === activeTab)?.category !== 'creative') {
                  setActiveTab('item_summon');
                }
              }}
              className={`px-3 py-1.5 text-xs uppercase cursor-pointer transition-colors flex items-center gap-1.5 ${
                filterMode === 'creative'
                  ? 'bg-[#4a148c] text-purple-200 font-bold border border-[#8e24aa]'
                  : 'text-[#ccebb0] hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-300" />
              <span>Creative & Commands ({TOOLS_CONFIG.filter(t => t.category === 'creative').length})</span>
            </button>
          </div>
        </div>

        {/* Experience Bar Strip */}
        <div className="bg-[#120d09] px-4 py-2 border-b-2 border-[#2b1c13] flex items-center justify-between text-xs text-[#a0907e] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">Level 30</span>
            <div className="w-32 sm:w-48 h-2 bg-[#261b14] border border-[#3d2c20] rounded-none overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 w-3/4" />
            </div>
            <span className="text-[10px] text-[#7d6c5e] hidden sm:inline">
              1.21 Tricky Trials & 26.3 Certified
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Survival Calculators
            </span>
            <span className="flex items-center gap-1 text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
              Command / Creative Cheats
            </span>
          </div>
        </div>

        {/* Tool Navigation Pill Strip */}
        <div className="p-3 sm:p-4 bg-[#140e09] border-b-2 border-[#2b1c13] space-y-2.5">
          {/* Survival Mode Helpers Row */}
          {(filterMode === 'all' || filterMode === 'survival') && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                <Heart className="w-3 h-3 fill-emerald-400" />
                <span>Survival Mode Guides & Cartography:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {TOOLS_CONFIG.filter(t => t.category === 'survival').map(tool => {
                  const Icon = tool.icon;
                  const isActive = activeTab === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTab(tool.id)}
                      className={`px-3 py-2 text-xs uppercase cursor-pointer shrink-0 flex items-center gap-2 transition-all border-2 ${
                        isActive
                          ? 'bg-[#2b5414] border-yellow-300 text-yellow-300 font-bold shadow-lg shadow-emerald-900/40 scale-[1.02]'
                          : 'bg-[#100b08] border-[#382618] text-[#c2b09e] hover:text-white hover:border-[#527d28]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="tracking-wide">{tool.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Creative Mode & Commands Row */}
          {(filterMode === 'all' || filterMode === 'creative') && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                <Wand2 className="w-3 h-3 text-purple-400" />
                <span>Creative & Command Block Generators:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {TOOLS_CONFIG.filter(t => t.category === 'creative').map(tool => {
                  const Icon = tool.icon;
                  const isActive = activeTab === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTab(tool.id)}
                      className={`px-3 py-2 text-xs uppercase cursor-pointer shrink-0 flex items-center gap-2 transition-all border-2 ${
                        isActive
                          ? 'bg-[#4a148c] border-purple-300 text-white font-bold shadow-lg shadow-purple-900/40 scale-[1.02]'
                          : 'bg-[#100b08] border-[#382618] text-[#c2b09e] hover:text-white hover:border-purple-600/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-purple-300 shrink-0" />
                      <span className="tracking-wide">{tool.title}</span>
                      {tool.id === 'item_summon' ? (
                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-600/50 font-mono">
                          IN DEV
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-mono">
                          ACTIVE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 bg-[#18110b]">
          {activeTab === 'seed_map' && <MinecraftSeedMapViewer />}
          {activeTab === 'item_summon' && <CustomItemCommandGenerator />}
          {activeTab === 'text_generator' && <MinecraftTextColorGenerator />}
          {activeTab === 'portal' && <NetherPortalCalculator />}
          {activeTab === 'potions' && <PotionBrewingLab />}
          {activeTab === 'ores' && <OreDistributionGuide />}
          {activeTab === 'villagers' && <VillagerTradingGuide />}
          {activeTab === 'enchanting' && <EnchantingAnvilGuide />}
          {activeTab === 'mobs' && <MobMechanicsGuide />}
          {activeTab === 'redstone' && <RedstoneTickGuide />}
        </div>
      </div>
    </div>
  );
};
