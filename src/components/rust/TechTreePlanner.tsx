import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Layers, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  TECH_TREE_NODES, 
  TechTreeNode 
} from '../../data/rustData';
import { ScrapIcon } from './RustIcons';

export const TechTreePlanner: React.FC = () => {
  // Selected Workbench tier filter
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(2);

  // Selected blueprints in player's target shopping list
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([
    'wb2-garagedoor',
    'wb2-sar'
  ]);

  // Include Workbench deploy craft cost
  const [includeWorkbenchCost, setIncludeWorkbenchCost] = useState<boolean>(true);

  // Toggle selection
  const handleToggleNode = (nodeId: string) => {
    setSelectedNodeIds(prev => 
      prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
    );
  };

  // Filter nodes by tier
  const tierNodes = useMemo(() => {
    return TECH_TREE_NODES.filter(n => n.tier === selectedTier);
  }, [selectedTier]);

  // Workbench crafting scrap costs
  const workbenchScrapCost = useMemo(() => {
    if (!includeWorkbenchCost) return 0;
    // WB1 = 50 scrap, WB2 = 500 scrap, WB3 = 1250 scrap
    if (selectedTier === 1) return 50;
    if (selectedTier === 2) return 500;
    return 1250;
  }, [selectedTier, includeWorkbenchCost]);

  // Blueprint scrap total
  const selectedBlueprints = useMemo(() => {
    return TECH_TREE_NODES.filter(n => selectedNodeIds.includes(n.id));
  }, [selectedNodeIds]);

  const blueprintScrapTotal = useMemo(() => {
    return selectedBlueprints.reduce((sum, n) => sum + n.scrapCost, 0);
  }, [selectedBlueprints]);

  const totalScrapNeeded = blueprintScrapTotal + workbenchScrapCost;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f141c] border border-orange-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-md shadow-orange-950/50">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-hud font-bold text-white flex items-center gap-2">
              <span>WORKBENCH TECH TREE & SCRAP PLANNER</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                WIPE DAY BLUEPRINT PATH
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Calculate exact scrap goals to unlock critical meta blueprints across all three workbenches.
            </p>
          </div>
        </div>

        {/* Workbench Tier Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#080b10] border border-white/[0.08] text-xs font-hud">
          <button
            onClick={() => setSelectedTier(1)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedTier === 1
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tier 1 (Wood Bench)
          </button>
          <button
            onClick={() => setSelectedTier(2)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedTier === 2
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tier 2 (Metal Bench)
          </button>
          <button
            onClick={() => setSelectedTier(3)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedTier === 3
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tier 3 (Armored Bench)
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tech Tree Nodes for Active Tier (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0f141c] border border-white/[0.09] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
              <span className="text-xs font-hud font-bold text-white uppercase tracking-wider">
                Workbench Tier {selectedTier} Tech Nodes
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Click to add/remove from scrap plan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tierNodes.map(node => {
                const isSelected = selectedNodeIds.includes(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => handleToggleNode(node.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1a2332] border-orange-500/70 shadow-md shadow-orange-950/40'
                        : 'bg-[#090d14] border-white/[0.06] hover:border-orange-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-hud font-bold text-white truncate pr-2">
                          {node.name}
                        </span>
                        {node.isKeyMeta && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-950 border border-orange-500/40 text-orange-300 font-bold uppercase">
                            META
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-sans">
                        {node.notes}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.05]">
                      <div className="flex items-center gap-1 font-mono text-xs font-bold text-yellow-400">
                        <ScrapIcon className="w-3.5 h-3.5" />
                        <span>{node.scrapCost} Scrap</span>
                      </div>

                      <span className={`text-[11px] font-hud font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isSelected ? 'SELECTED' : 'ADD'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Total Scrap Calculator & Wipe Milestone (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-[#0f141c] border-2 border-orange-500/30 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <ScrapIcon className="w-4 h-4 text-yellow-400" />
                <span className="font-hud font-bold text-sm text-white">
                  TOTAL SCRAP REQUIREMENT
                </span>
              </div>
              <span className="text-[11px] font-mono text-orange-400">
                {selectedBlueprints.length} Blueprints
              </span>
            </div>

            {/* Total Big Scrap Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/80 via-yellow-950/60 to-[#0e141d] border border-yellow-500/40 shadow-inner flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-950/80 border border-yellow-500/50 flex items-center justify-center">
                  <ScrapIcon className="w-7 h-7 text-yellow-400" />
                </div>
                <div>
                  <div className="text-[11px] font-hud text-yellow-300/80 uppercase">
                    SCRAP FARM GOAL
                  </div>
                  <div className="text-3xl font-mono font-black text-yellow-400 tracking-tight">
                    {totalScrapNeeded.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-slate-300 font-hud">
                  <input
                    type="checkbox"
                    id="wb-check"
                    checked={includeWorkbenchCost}
                    onChange={(e) => setIncludeWorkbenchCost(e.target.checked)}
                    className="accent-orange-500 rounded cursor-pointer"
                  />
                  <label htmlFor="wb-check" className="cursor-pointer">
                    Workbench Tier {selectedTier} Deploy Cost
                  </label>
                </div>
                <span className="font-bold text-white">
                  {workbenchScrapCost} Scrap
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d14] border border-white/[0.05]">
                <span className="text-slate-300 font-hud">
                  Selected Blueprint Unlocks ({selectedBlueprints.length})
                </span>
                <span className="font-bold text-yellow-400">
                  {blueprintScrapTotal} Scrap
                </span>
              </div>
            </div>

            {/* List of Selected Blueprints */}
            {selectedBlueprints.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                <span className="text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider">
                  Target Blueprint List
                </span>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {selectedBlueprints.map(n => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#080b11] text-xs font-hud text-slate-300"
                    >
                      <span className="truncate pr-2">{n.name} (Tier {n.tier})</span>
                      <span className="font-mono text-yellow-400 shrink-0">{n.scrapCost}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
