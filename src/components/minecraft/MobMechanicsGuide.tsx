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
  Zap,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const MobMechanicsGuide: React.FC = () => {
  const [edition, setEdition] = useState<'java' | 'bedrock'>('java');
  const [bedrockSim, setBedrockSim] = useState<'sim4' | 'sim6'>('sim4');
  const [raidDifficulty, setRaidDifficulty] = useState<'easy' | 'normal' | 'hard'>('hard');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950/80 via-[#18181b] to-[#0c0c0e] border border-zinc-700/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-zinc-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.21+ Spawning & AI</span>
              <span>·</span>
              <span className="text-zinc-300">Edition-Accurate Despawn Spheres</span>
              <span>·</span>
              <span className="text-amber-400">1.21 Raid Omen Mechanics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-600/40 flex items-center justify-center text-zinc-300 shadow-md">
                <Skull className="w-4 h-4 text-zinc-300" />
              </span>
              Mob Spawning & Raid Wave Mechanics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Design maximum-efficiency mob farms. Differentiate Java (128m despawn sphere, 70 mob cap) from Bedrock (Simulation 4: 44m despawn cap), and master 1.21 Ominous Bottles and Raid Omen countdowns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#121215] p-1 rounded-xl border border-zinc-700/50">
              <button
                onClick={() => setEdition('java')}
                className={`px-3 py-1.5 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  edition === 'java'
                    ? 'bg-zinc-200 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Java Edition
              </button>
              <button
                onClick={() => setEdition('bedrock')}
                className={`px-3 py-1.5 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  edition === 'bedrock'
                    ? 'bg-zinc-200 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Bedrock Edition
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edition-Specific Despawn Spheres */}
      <div className="bg-[#0e0e11] border border-zinc-700/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-bold font-hud text-slate-100">
              {edition === 'java' ? 'Java Edition: 128-Block Despawn Spheres' : 'Bedrock Edition: Simulation Distance Caps'}
            </h2>
          </div>
          {edition === 'java' ? (
            <span className="text-xs font-mono text-zinc-400">
              Hostile Mob Cap: 70 in Singleplayer
            </span>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-zinc-400 mr-1">Simulation:</span>
              <button
                onClick={() => setBedrockSim('sim4')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  bedrockSim === 'sim4' ? 'bg-amber-600 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Sim 4 (44m Despawn)
              </button>
              <button
                onClick={() => setBedrockSim('sim6')}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  bedrockSim === 'sim6' ? 'bg-amber-600 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Sim 6+ (128m Despawn)
              </button>
            </div>
          )}
        </div>

        {edition === 'java' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#141418] border border-zinc-700/30 rounded-xl space-y-1">
              <div className="font-mono text-amber-400 font-bold text-sm">
                0 - 24 Blocks (Dead Zone)
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                <strong>No natural hostile spawns</strong> occur within a 24-block spherical radius of any player. Mobs already inside this sphere never despawn randomly and target the player normally.
              </p>
            </div>

            <div className="p-4 bg-[#141418] border border-emerald-500/30 rounded-xl space-y-1">
              <div className="font-mono text-emerald-400 font-bold text-sm">
                24 - 32 Blocks (Golden Spawning Zone)
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                <strong>Optimal Mob Farm Range:</strong> Hostile mobs spawn here actively and do NOT despawn randomly. Position your AFK platform 24-28 blocks away from your kill drop chute!
              </p>
            </div>

            <div className="p-4 bg-[#141418] border border-red-500/30 rounded-xl space-y-1">
              <div className="font-mono text-red-400 font-bold text-sm">
                32 - 128+ Blocks (Despawn Zone)
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                Between 32-128 blocks, mobs have a 1 in 800 tick chance (every 40 seconds) to despawn if older than 30s. At <strong>&gt; 128 blocks</strong>, mobs despawn <strong>instantly</strong> on the next game tick.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#141418] border border-zinc-700/30 rounded-xl space-y-1">
              <div className="font-mono text-amber-400 font-bold text-sm">
                0 - 24 Blocks (Dead Zone)
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                Identical to Java: No hostile mobs spawn within 24 blocks of any player.
              </p>
            </div>

            <div className="p-4 bg-[#141418] border border-emerald-500/30 rounded-xl space-y-1">
              <div className="font-mono text-emerald-400 font-bold text-sm">
                {bedrockSim === 'sim4' ? '24 - 44 Blocks (Active Zone)' : '24 - 32 Blocks (Active Zone)'}
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                {bedrockSim === 'sim4' ? (
                  <><strong>Critical Bedrock Difference:</strong> On Simulation Distance 4 (default for consoles, mobile, and Realms), mobs only exist between <strong>24 and 44 blocks</strong>. If you AFK 128 blocks away like Java, your farm will produce ZERO spawns!</>
                ) : (
                  <>On Simulation Distance 6+, spawning functions closer to Java with a 128m outer perimeter, but governed by density caps (8 cave, 8 surface per chunk sector).</>
                )}
              </p>
            </div>

            <div className="p-4 bg-[#141418] border border-red-500/30 rounded-xl space-y-1">
              <div className="font-mono text-red-400 font-bold text-sm">
                {bedrockSim === 'sim4' ? '> 44 Blocks (Instant Despawn)' : '> 128 Blocks (Instant Despawn)'}
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                {bedrockSim === 'sim4' ? (
                  <>On Sim 4, hostile mobs that wander or are pushed beyond <strong>44 blocks</strong> from the player despawn <strong>instantly</strong>.</>
                ) : (
                  <>On Sim 6+, hostile mobs despawn instantly at &gt; 128 blocks, with random despawning between 32 and 128 blocks.</>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Light Level 0 Rule & Exceptions */}
        <div className="p-3 bg-zinc-900 border border-zinc-700/40 rounded-xl text-xs space-y-1 text-slate-300">
          <span className="font-bold text-zinc-100 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-zinc-400" />
            Light Level Spawning Rules (1.18 - 1.21+):
          </span>
          <p className="leading-relaxed">
            Standard hostile mobs (Zombies, Skeletons, Creepers, Spiders, Endermen) require <strong>Block Light = 0 and Sky Light = 0</strong> to spawn. A single torch (light 14) now prevents hostile spawns for a 14-block taxicab radius!
          </p>
          <div className="pt-1 text-[11px] text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
            <span>• <strong>Slimes (Slime Chunks):</strong> Spawn below Y=40 at ANY light level.</span>
            <span>• <strong>Wither Skeletons:</strong> Spawn at light level ≤ 7 inside Nether Fortresses.</span>
            <span>• <strong>Blazes:</strong> Spawn from spawner at light level ≤ 11 (torches on all sides disabled).</span>
            <span>• <strong>Piglins & Hoglins:</strong> Spawn in Nether Wastes/Crimson Forests at light level ≤ 11.</span>
          </div>
        </div>
      </div>

      {/* 1.21 Ominous Bottle & Village Raid Mechanics */}
      <div className="bg-[#0e0e11] border border-zinc-700/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold font-hud text-slate-100">
              1.21 Raid Mechanics: Ominous Bottle & Raid Omen Timer
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-zinc-400 mr-1">Raid Difficulty:</span>
            {(['easy', 'normal', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setRaidDifficulty(d)}
                className={`px-2 py-0.5 rounded text-[11px] font-hud capitalize cursor-pointer ${
                  raidDifficulty === d ? 'bg-amber-600 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {d} ({d === 'easy' ? '3 Waves' : d === 'normal' ? '5 Waves' : '7 Waves'})
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            In 1.21 Tricky Trials, killing an Illager Captain with a banner <strong>no longer causes immediate village raids</strong>. Instead, the Captain drops an <strong>Ominous Bottle (Tier I to V)</strong>.
          </p>
          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>30-Second Raid Omen Grace Period:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Drinking an Ominous Bottle gives <strong>Bad Omen (100 minutes)</strong>. Entering a Village converts Bad Omen into <strong>Raid Omen (30-second countdown)</strong> accompanied by a ticking ominous sound. You can drink milk or flee during these 30 seconds to cancel the raid before it spawns!
            </p>
          </div>
        </div>

        {/* Raid Waves Breakdown filtered by difficulty */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-200 block">
            Raid Wave Roster ({raidDifficulty.toUpperCase()} Difficulty · {raidDifficulty === 'easy' ? '3 Total Waves' : raidDifficulty === 'normal' ? '5 Total Waves' : '7 Total Waves + 1 Bonus'}):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="p-3 bg-[#15151a] border border-zinc-700/30 rounded-xl">
              <span className="font-mono text-zinc-300 font-bold">Waves 1 - 2</span>
              <div className="text-[11px] text-slate-400 mt-1">Pillagers & Vindicators. Easy warmup.</div>
            </div>

            <div className="p-3 bg-[#15151a] border border-zinc-700/30 rounded-xl">
              <span className="font-mono text-zinc-300 font-bold">Wave 3</span>
              <div className="text-[11px] text-slate-400 mt-1">
                {raidDifficulty === 'easy' ? 'FINAL WAVE (Easy): Ravager with Pillager rider.' : 'Ravager spawns with Pillagers and Witches.'}
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${raidDifficulty === 'easy' ? 'bg-[#101014] opacity-50 border-zinc-800' : 'bg-[#15151a] border-zinc-700/30'}`}>
              <span className="font-mono text-amber-400 font-bold">Waves 4 - 5</span>
              <div className="text-[11px] text-slate-400 mt-1">
                {raidDifficulty === 'easy' 
                  ? 'Locked: Easy difficulty terminates after wave 3.' 
                  : 'Evokers spawn! Guaranteed Totem of Undying drop.'}
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${raidDifficulty !== 'hard' ? 'bg-[#101014] opacity-50 border-zinc-800' : 'bg-[#15151a] border-zinc-700/30'}`}>
              <span className="font-mono text-red-400 font-bold">Waves 6 - 7 (Hard Only)</span>
              <div className="text-[11px] text-slate-400 mt-1">
                {raidDifficulty !== 'hard'
                  ? 'Locked: Normal difficulty terminates after wave 5.'
                  : 'Multiple Evokers, Ravagers, and Witches. Yields 4-6 Totems of Undying!'}
              </div>
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
          Wither Skeletons require a <strong>3-block high space</strong> and only spawn within the bounding box of a Nether Fortress at light level ≤ 7.
          <strong>Pro Farm Tip:</strong> Place Nether Brick slabs at a height of 2.5 blocks. Normal players (1.8m) can run underneath freely, but 2.5m tall Wither Skeletons get stuck and cannot pass, allowing you to harvest Wither Skeleton Skulls without taking damage!
        </p>
      </div>
    </div>
  );
};
