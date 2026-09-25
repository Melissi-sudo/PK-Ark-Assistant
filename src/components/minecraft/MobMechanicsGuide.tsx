import React, { useState } from 'react';
import { 
  Skull, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  Flame, 
  HelpCircle, 
  Check, 
  Info,
  Zap
} from 'lucide-react';

export const MobMechanicsGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950/80 via-[#18181b] to-[#0c0c0e] border border-zinc-700/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.21+ Mob AI</span>
              <span>·</span>
              <span className="text-zinc-300">Light Level 0 Spawning</span>
              <span>·</span>
              <span className="text-amber-400">1.21 Ominous Bottle & Raids</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-600/40 flex items-center justify-center text-zinc-300 shadow-md">
                <Skull className="w-4 h-4 text-zinc-300" />
              </span>
              Mob Spawning & Raid Wave Mechanics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Design maximum-efficiency mob farms. Understand the 24-128 block despawn spheres, Nether Fortress Wither Skeleton bounding boxes, and 1.21 Ominous Trial Raids.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-zinc-800/60 border border-zinc-600/30 rounded-xl text-zinc-200 text-xs font-hud font-bold">
              Light Level 0 Rule
            </span>
          </div>
        </div>
      </div>

      {/* 24-128 Block Despawn Spheres */}
      <div className="bg-[#0e0e11] border border-zinc-700/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-bold font-hud text-slate-100">
              The 3 Despawn Spheres Around the Player
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Hostile Mob Cap: 70 in Singleplayer
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#141418] border border-zinc-700/30 rounded-xl space-y-1">
            <div className="font-mono text-amber-400 font-bold text-sm">
              0 - 24 Blocks (Dead Zone)
            </div>
            <p className="text-slate-300 leading-relaxed pt-1">
              <strong>No hostile mobs can ever spawn</strong> within 24 spherical blocks of the player. Mobs in this zone will never naturally despawn and will target or attack you freely.
            </p>
          </div>

          <div className="p-4 bg-[#141418] border border-emerald-500/30 rounded-xl space-y-1">
            <div className="font-mono text-emerald-400 font-bold text-sm">
              24 - 32 Blocks (Golden Spawning Zone)
            </div>
            <p className="text-slate-300 leading-relaxed pt-1">
              <strong>Optimal Mob Farm Range:</strong> Hostile mobs spawn here actively and do NOT despawn randomly. Always position your AFK spot 24-28 blocks above or away from your spawning platforms!
            </p>
          </div>

          <div className="p-4 bg-[#141418] border border-red-500/30 rounded-xl space-y-1">
            <div className="font-mono text-red-400 font-bold text-sm">
              32 - 128+ Blocks (Despawn Zone)
            </div>
            <p className="text-slate-300 leading-relaxed pt-1">
              Between 32-128 blocks, mobs have a 1 in 800 tick chance (every 40 seconds) to despawn. At <strong>&gt; 128 blocks</strong>, mobs despawn <strong>instantly</strong> on the very next tick!
            </p>
          </div>
        </div>
      </div>

      {/* 1.21 Ominous Bottle & Village Raid Mechanics */}
      <div className="bg-[#0e0e11] border border-zinc-700/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold font-hud text-slate-100">
              1.21 Tricky Trials Raid Mechanics: The Ominous Bottle
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
            No Accidental Village Raids!
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          In 1.21+, killing an Illager Captain with a banner no longer inflicts Bad Omen instantly. Instead, the Captain drops an <strong>Ominous Bottle (Tier I to V)</strong>. You can safely store the bottle in a chest and drink it only when your raid defense trap or Trial Chamber is prepared!
        </p>

        {/* Raid Waves Breakdown */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-200 block">
            Standard Village Raid Waves & High-Value Drops:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="p-3 bg-[#15151a] border border-zinc-700/30 rounded-xl">
              <span className="font-mono text-zinc-300 font-bold">Waves 1 - 2</span>
              <div className="text-[11px] text-slate-400 mt-1">Pillagers & Vindicators with iron axes.</div>
            </div>

            <div className="p-3 bg-[#15151a] border border-zinc-700/30 rounded-xl">
              <span className="font-mono text-zinc-300 font-bold">Waves 3 - 4</span>
              <div className="text-[11px] text-slate-400 mt-1">First Ravager spawns (100 HP, massive knockback).</div>
            </div>

            <div className="p-3 bg-[#15151a] border border-zinc-700/30 rounded-xl">
              <span className="font-mono text-amber-400 font-bold">Wave 5</span>
              <div className="text-[11px] text-slate-400 mt-1">Evokers spawn! Guaranteed <strong>Totem of Undying</strong> drops.</div>
            </div>

            <div className="p-3 bg-[#15151a] border border-zinc-700/30 rounded-xl">
              <span className="font-mono text-red-400 font-bold">Waves 6 - 7 (Hard)</span>
              <div className="text-[11px] text-slate-400 mt-1">Multiple Ravagers, Witches, and Evokers. Yields 4-6 Totems total!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wither Skeleton Fortress Farming Rule */}
      <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs space-y-1.5">
        <span className="font-bold text-purple-300 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-purple-400" />
          Nether Fortress Wither Skeleton Spawning Rules:
        </span>
        <p className="text-slate-300 leading-relaxed">
          Wither Skeletons require a <strong>3-block high space</strong> and only spawn within the bounding box of a Nether Fortress at light level $\le 7$.
          <strong>Pro Farm Tip:</strong> Place Nether Brick slabs at a height of 2.5 blocks. Normal players (1.8m) can run underneath freely, but 2.5m tall Wither Skeletons get stuck and cannot pass, allowing you to harvest Wither Skeleton Skulls without taking damage!
        </p>
      </div>
    </div>
  );
};
