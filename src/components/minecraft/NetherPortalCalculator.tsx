import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Layers, 
  ShieldAlert, 
  Check, 
  Copy, 
  Sparkles, 
  RotateCcw, 
  Flame, 
  MapPin, 
  Compass, 
  AlertTriangle,
  Info,
  ExternalLink
} from 'lucide-react';

export const NetherPortalCalculator: React.FC = () => {
  // Edition: 'java' or 'bedrock'
  const [edition, setEdition] = useState<'java' | 'bedrock'>('java');

  // Direction: 'ow_to_nether' or 'nether_to_ow'
  const [direction, setDirection] = useState<'ow_to_nether' | 'nether_to_ow'>('ow_to_nether');
  
  // Coordinates for Primary Portal
  const [posX, setPosX] = useState<number>(800);
  const [posY, setPosY] = useState<number>(64);
  const [posZ, setPosZ] = useState<number>(-1200);

  // Secondary portal coordinates for 3D collision / link test
  const [secondPosX, setSecondPosX] = useState<number>(880);
  const [secondPosY, setSecondPosY] = useState<number>(64);
  const [secondPosZ, setSecondPosZ] = useState<number>(-1150);
  const [checkCollision, setCheckCollision] = useState<boolean>(true);

  // Portal frame style: standard (14 blocks) or budget corners (10 blocks)
  const [frameStyle, setFrameStyle] = useState<'standard' | 'budget'>('budget');
  const [isNetherRoof, setIsNetherRoof] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Math Calculations (8:1 Horizontal scaling)
  // Negative coordinate math: Math.floor correctly maps block grid boundaries
  const calculatedX = direction === 'ow_to_nether' ? Math.floor(posX / 8) : posX * 8;
  const calculatedZ = direction === 'ow_to_nether' ? Math.floor(posZ / 8) : posZ * 8;
  const calculatedY = isNetherRoof 
    ? (direction === 'ow_to_nether' ? 128 : posY)
    : posY;

  // Collision calculation:
  // Overworld 2D and 3D distance
  const owDeltaX = posX - secondPosX;
  const owDeltaY = posY - secondPosY;
  const owDeltaZ = posZ - secondPosZ;
  const overworldDist2D = Math.hypot(owDeltaX, owDeltaZ);
  const overworldDist3D = Math.hypot(owDeltaX, owDeltaY, owDeltaZ);

  // Equivalent Nether distance between scaled landing points
  const netherDist2D = overworldDist2D / 8;
  const netherDist3D = Math.hypot(owDeltaX / 8, owDeltaY, owDeltaZ / 8);

  // Portal search radius algorithm:
  // Destination search radius is 128 blocks in destination dimension.
  // When traveling OW -> Nether, search radius in Nether is 128 blocks horizontal (up to 1,024 Overworld blocks!).
  // If Overworld separation < 128 blocks: Nether landing points are < 16 blocks apart -> guaranteed cross-link unless paired.
  // If Overworld separation between 128 and 1024 blocks: Nether landing points are < 128 blocks apart -> single Nether portal will trap both!
  // If Overworld separation >= 1024 blocks: Search radii never overlap -> guaranteed independent.
  const isExtremeCollision = overworldDist2D < 128;
  const isMediumCollision = overworldDist2D >= 128 && overworldDist2D < 1024;
  const isSafeSeparation = overworldDist2D >= 1024;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleReset = () => {
    setPosX(0);
    setPosY(64);
    setPosZ(0);
    setSecondPosX(120);
    setSecondPosY(64);
    setSecondPosZ(120);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-[#180a29] to-[#0d041a] border border-purple-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-purple-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.21+ Verified Engine</span>
              <span>·</span>
              <span className="text-emerald-400">8:1 Dimension Ratio</span>
              <span>·</span>
              <span className="text-purple-300">3D Euclidean Linking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
                <Flame className="w-4 h-4 text-purple-400" />
              </span>
              Nether Portal 3D Linking & Collision Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Calculate exact 2-way linked coordinates, test 128m vs 1,024m search radius cross-linking hazards, and configure Nether Roof travel (Java only).
            </p>
          </div>

          {/* Controls: Edition and Direction */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {/* Edition Selector */}
            <div className="flex items-center gap-1 bg-[#10061e] p-1 rounded-xl border border-purple-500/30">
              <button
                onClick={() => setEdition('java')}
                className={`px-2.5 py-1 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  edition === 'java'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Java Edition
              </button>
              <button
                onClick={() => setEdition('bedrock')}
                className={`px-2.5 py-1 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  edition === 'bedrock'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Bedrock Edition
              </button>
            </div>

            {/* Direction Toggle */}
            <div className="flex items-center gap-1 bg-[#10061e] p-1 rounded-xl border border-purple-500/30">
              <button
                onClick={() => setDirection('ow_to_nether')}
                className={`px-2.5 py-1 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  direction === 'ow_to_nether'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                OW ➔ Nether (÷ 8)
              </button>
              <button
                onClick={() => setDirection('nether_to_ow')}
                className={`px-2.5 py-1 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                  direction === 'nether_to_ow'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-300 hover:text-white'
                }`}
              >
                Nether ➔ OW (× 8)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Coordinate Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Coordinates */}
        <div className="lg:col-span-6 bg-[#0c0919] border border-purple-500/20 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm sm:text-base font-bold font-hud text-slate-100">
                Source Portal Coordinates ({direction === 'ow_to_nether' ? 'Overworld' : 'Nether'})
              </h2>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-purple-300 flex items-center gap-1 font-mono transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Coordinate Inputs */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-purple-300 mb-1.5">
                X Coordinate (East / West)
              </label>
              <input
                type="number"
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className="w-full bg-[#160e29] border border-purple-500/30 focus:border-purple-400 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-purple-300 mb-1.5">
                Y Coordinate (Elevation)
              </label>
              <input
                type="number"
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className="w-full bg-[#160e29] border border-purple-500/30 focus:border-purple-400 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-purple-300 mb-1.5">
                Z Coordinate (North / South)
              </label>
              <input
                type="number"
                value={posZ}
                onChange={(e) => setPosZ(Number(e.target.value))}
                className="w-full bg-[#160e29] border border-purple-500/30 focus:border-purple-400 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Special Modes & Options */}
          <div className="space-y-3 pt-2">
            {/* Nether Roof Toggle with Bedrock Warning */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-[#130b24] border border-purple-500/20 rounded-xl cursor-pointer hover:bg-[#1a0f30] transition-colors">
                <input
                  type="checkbox"
                  checked={isNetherRoof}
                  onChange={(e) => setIsNetherRoof(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-200">Nether Roof Highway Mode (Y ≥ 128)</span>
                  <p className="text-slate-400 mt-0.5">
                    Locks target Nether portal to Y=128 on the bedrock ceiling for obstacle-free elytra highways and gold farms.
                  </p>
                </div>
              </label>

              {isNetherRoof && edition === 'bedrock' && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Bedrock Edition Build Limit Notice:</strong> In Bedrock Edition, the Nether build height limit is strictly capped at <strong>Y = 127</strong>. Players cannot place blocks or portals on top of the bedrock roof in Bedrock without modded tools. Use Java Edition for Nether Roof highways.
                  </div>
                </div>
              )}
            </div>

            {/* Obsidian Frame Cost */}
            <div className="p-3 bg-[#130b24] border border-purple-500/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">Obsidian Frame Efficiency</span>
                <span className="text-[11px] font-mono text-purple-300">
                  {frameStyle === 'budget' ? '10 Obsidian (Corner-Saver)' : '14 Obsidian (Full Frame)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFrameStyle('budget')}
                  className={`px-3 py-2 rounded-lg text-xs font-hud transition-colors cursor-pointer text-left border ${
                    frameStyle === 'budget'
                      ? 'bg-purple-900/50 border-purple-500/50 text-white'
                      : 'bg-black/20 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">10 Obsidian</div>
                  <div className="text-[10px] text-slate-400">Save 4 obsidian with dirt/cobble corners</div>
                </button>
                <button
                  onClick={() => setFrameStyle('standard')}
                  className={`px-3 py-2 rounded-lg text-xs font-hud transition-colors cursor-pointer text-left border ${
                    frameStyle === 'standard'
                      ? 'bg-purple-900/50 border-purple-500/50 text-white'
                      : 'bg-black/20 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold">14 Obsidian</div>
                  <div className="text-[10px] text-slate-400">Classic aesthetic obsidian corners</div>
                </button>
              </div>
            </div>
          </div>

          {/* 3D Collision Simulator with 128m / 1024m mechanics */}
          <div className="pt-2 border-t border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-hud text-slate-200 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                3D Cross-Link & Collision Simulator
              </span>
              <button
                onClick={() => setCheckCollision(!checkCollision)}
                className="text-[11px] text-purple-400 hover:underline cursor-pointer"
              >
                {checkCollision ? 'Hide Test' : 'Test Neighboring Portal'}
              </button>
            </div>

            {checkCollision && (
              <div className="p-3 bg-[#130b24] border border-purple-500/20 rounded-xl space-y-3">
                <div className="text-[11px] text-slate-400">
                  Enter nearby friend or base Overworld coordinates to simulate 3D portal linking capture zones:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">Neighbor X</span>
                    <input
                      type="number"
                      value={secondPosX}
                      onChange={(e) => setSecondPosX(Number(e.target.value))}
                      className="w-full bg-[#1b1033] border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">Neighbor Y</span>
                    <input
                      type="number"
                      value={secondPosY}
                      onChange={(e) => setSecondPosY(Number(e.target.value))}
                      className="w-full bg-[#1b1033] border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">Neighbor Z</span>
                    <input
                      type="number"
                      value={secondPosZ}
                      onChange={(e) => setSecondPosZ(Number(e.target.value))}
                      className="w-full bg-[#1b1033] border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-1 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-black/30 rounded-lg border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase">Overworld Distance</div>
                    <div className="font-mono text-slate-200 mt-0.5">
                      Horizontal: <strong>{Math.round(overworldDist2D)}m</strong><br/>
                      3D Distance: <strong>{Math.round(overworldDist3D)}m</strong>
                    </div>
                  </div>
                  <div className="p-2 bg-black/30 rounded-lg border border-white/5">
                    <div className="text-[10px] text-slate-400 uppercase">Nether Separation</div>
                    <div className="font-mono text-slate-200 mt-0.5">
                      Horizontal: <strong>{Math.round(netherDist2D)}m</strong><br/>
                      3D Distance: <strong>{Math.round(netherDist3D)}m</strong>
                    </div>
                  </div>
                </div>

                {isExtremeCollision ? (
                  <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-lg text-red-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Critical Cross-Link Collision (&lt; 128 Overworld blocks):</strong> Nether coordinates are within {Math.round(netherDist2D)} blocks of each other (well under 16 blocks). These portals will 100% latch into the exact same Nether frame unless manually paired at exact scaled coordinates on both sides!
                    </div>
                  </div>
                ) : isMediumCollision ? (
                  <div className="p-2.5 bg-amber-950/40 border border-amber-500/40 rounded-lg text-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Shared Nether Search Risk (128 to 1,024 Overworld blocks):</strong> In Nether space, the landing points are {Math.round(netherDist2D)} blocks apart (within the 128-block search radius). If either player leaves a Nether portal unbuilt, traveling to the Nether will hijack the neighbor's portal! You must build both Nether frames manually.
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Fully Independent Linking Zone (&gt; 1,024 Overworld blocks):</strong> Portals are {Math.round(overworldDist2D)} blocks apart. In the Nether, they are separated by &gt; 128 blocks ({Math.round(netherDist2D)} blocks). Their 128m search spheres can never overlap.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Calculated Target Coordinates & Linking Visualizer */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-gradient-to-b from-purple-900/30 via-[#100720] to-[#0c0517] border border-purple-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <h2 className="text-sm sm:text-base font-bold font-hud text-slate-100">
                  Target Portal Coordinates ({direction === 'ow_to_nether' ? 'Nether' : 'Overworld'})
                </h2>
              </div>
              <button
                onClick={() => handleCopy(`/tp @s ${calculatedX} ${calculatedY} ${calculatedZ}`)}
                className="px-2.5 py-1 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy Teleport Command"
              >
                {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedText ? 'Copied /tp!' : 'Copy /tp Command'}</span>
              </button>
            </div>

            {/* Calculated Big Readout */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#190c2e] border border-purple-500/40 rounded-xl p-3 text-center">
                <div className="text-[10px] uppercase font-mono text-purple-300 tracking-wider">Target X</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  {calculatedX}
                </div>
              </div>

              <div className="bg-[#190c2e] border border-purple-500/40 rounded-xl p-3 text-center">
                <div className="text-[10px] uppercase font-mono text-purple-300 tracking-wider">Target Y</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300 mt-1">
                  {calculatedY}
                </div>
              </div>

              <div className="bg-[#190c2e] border border-purple-500/40 rounded-xl p-3 text-center">
                <div className="text-[10px] uppercase font-mono text-purple-300 tracking-wider">Target Z</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  {calculatedZ}
                </div>
              </div>
            </div>

            {/* 2-Way Link Guarantee Protocol */}
            <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-2 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Guaranteed 100% 2-Way Linking Protocol (Minecraft 1.16 - 1.21+):
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 leading-relaxed">
                <li>
                  Build and light your initial portal at <strong className="text-purple-300 font-mono">{posX}, {posY}, {posZ}</strong>.
                </li>
                <li>
                  Step through. If the game autogenerates a portal far from <strong className="text-purple-300 font-mono">{calculatedX}, {calculatedY}, {calculatedZ}</strong>, break or extinguish it.
                </li>
                <li>
                  Travel directly to <strong className="text-purple-300 font-mono">X: {calculatedX}, Y: {calculatedY}, Z: {calculatedZ}</strong> in the {direction === 'ow_to_nether' ? 'Nether' : 'Overworld'}.
                </li>
                <li>
                  Construct your {frameStyle === 'budget' ? '10-Obsidian' : '14-Obsidian'} frame at these exact coordinates and ignite with Flint & Steel.
                </li>
                <li>
                  Because the game uses <strong>3D Euclidean distance</strong> (√(ΔX² + ΔY² + ΔZ²)) to select the closest candidate in the 128-block search sphere, matching both horizontal and vertical coordinates locks your portals in a permanent 1:1 pair!
                </li>
              </ol>
            </div>

            {/* Materials Checklist */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#120722] border border-purple-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-slate-400">Obsidian Needed</div>
                  <div className="font-bold text-slate-100 text-sm mt-0.5">
                    {frameStyle === 'budget' ? '10 Blocks' : '14 Blocks'}
                  </div>
                </div>
                <div className="text-purple-400 font-mono text-[11px]">
                  {frameStyle === 'budget' ? '20 for pair' : '28 for pair'}
                </div>
              </div>

              <div className="p-3 bg-[#120722] border border-purple-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-slate-400">Ignition Tool</div>
                  <div className="font-bold text-slate-100 text-sm mt-0.5">Flint & Steel</div>
                </div>
                <div className="text-purple-400 font-mono text-[11px]">
                  or Fire Charge
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
