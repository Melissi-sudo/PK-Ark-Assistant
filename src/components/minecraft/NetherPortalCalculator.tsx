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
  Info
} from 'lucide-react';

export const NetherPortalCalculator: React.FC = () => {
  // Direction: 'ow_to_nether' or 'nether_to_ow'
  const [direction, setDirection] = useState<'ow_to_nether' | 'nether_to_ow'>('ow_to_nether');
  
  // Coordinates
  const [posX, setPosX] = useState<number>(800);
  const [posY, setPosY] = useState<number>(64);
  const [posZ, setPosZ] = useState<number>(-1200);

  // Secondary portal coordinates for 2-portal collision / link test
  const [secondPosX, setSecondPosX] = useState<number>(880);
  const [secondPosZ, setSecondPosZ] = useState<number>(-1150);
  const [checkCollision, setCheckCollision] = useState<boolean>(true);

  // Portal frame style: standard (14 blocks) or budget corners (10 blocks)
  const [frameStyle, setFrameStyle] = useState<'standard' | 'budget'>('budget');
  const [isNetherRoof, setIsNetherRoof] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Math Calculations
  const calculatedX = direction === 'ow_to_nether' ? Math.floor(posX / 8) : posX * 8;
  const calculatedZ = direction === 'ow_to_nether' ? Math.floor(posZ / 8) : posZ * 8;
  const calculatedY = isNetherRoof 
    ? (direction === 'ow_to_nether' ? 128 : posY)
    : posY;

  // Collision calculation: In the Nether, the search radius is 16 blocks (corresponding to 128 blocks in Overworld)
  const overworldDist = Math.hypot(posX - secondPosX, posZ - secondPosZ);
  const netherDist = overworldDist / 8;
  const isConflictRisk = checkCollision && (overworldDist < 128);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleReset = () => {
    setPosX(0);
    setPosY(64);
    setPosZ(0);
    setSecondPosX(100);
    setSecondPosZ(100);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-[#180a29] to-[#0d041a] border border-purple-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-tek text-xs tracking-wider uppercase mb-1">
              <span>Minecraft 1.21+ Engine</span>
              <span>·</span>
              <span className="text-purple-300">Java & Bedrock Compatible</span>
              <span>·</span>
              <span className="text-emerald-400">8:1 Dimension Scaling</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-hud text-slate-100 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
                <Flame className="w-4 h-4 text-purple-400" />
              </span>
              Nether Portal 3D Linking & Collision Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Calculate exact 2-way linked coordinates, prevent portal mismatching, check 128-block cross-linking radius, and configure Nether Roof fast-travel highways.
            </p>
          </div>

          {/* Quick Direction Toggle */}
          <div className="flex items-center gap-1 bg-[#10061e] p-1.5 rounded-xl border border-purple-500/30 self-start md:self-auto">
            <button
              onClick={() => setDirection('ow_to_nether')}
              className={`px-3 py-1.5 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                direction === 'ow_to_nether'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Overworld ➔ Nether (÷ 8)
            </button>
            <button
              onClick={() => setDirection('nether_to_ow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer ${
                direction === 'nether_to_ow'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              Nether ➔ Overworld (× 8)
            </button>
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
                  Locks Nether portal to Y=128 for flat bedrock ceiling travel and safe gold farms.
                </p>
              </div>
            </label>

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
                  <div className="text-[10px] text-slate-400">Save 4 obsidian with dirt/coble corners</div>
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

          {/* Quick Collision Check */}
          <div className="pt-2 border-t border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-hud text-slate-200 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Cross-Link Conflict Simulator
              </span>
              <button
                onClick={() => setCheckCollision(!checkCollision)}
                className="text-[11px] text-purple-400 hover:underline cursor-pointer"
              >
                {checkCollision ? 'Hide Test' : 'Test Neighboring Portal'}
              </button>
            </div>

            {checkCollision && (
              <div className="p-3 bg-[#130b24] border border-purple-500/20 rounded-xl space-y-2">
                <div className="text-[11px] text-slate-400">
                  Enter nearby friend or secondary base Overworld coordinates to check if portals will collide:
                </div>
                <div className="grid grid-cols-2 gap-2">
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
                    <span className="text-[10px] text-slate-400 font-mono">Neighbor Z</span>
                    <input
                      type="number"
                      value={secondPosZ}
                      onChange={(e) => setSecondPosZ(Number(e.target.value))}
                      className="w-full bg-[#1b1033] border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Overworld Separation: <strong className="text-slate-200 font-mono">{Math.round(overworldDist)} blocks</strong>
                  </span>
                  <span className="text-slate-400">
                    Nether Separation: <strong className="text-slate-200 font-mono">{Math.round(netherDist)} blocks</strong>
                  </span>
                </div>

                {isConflictRisk ? (
                  <div className="p-2.5 bg-amber-950/40 border border-amber-500/40 rounded-lg text-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Conflict Warning (&lt; 128 blocks apart):</strong> Portals in this range risk crossing into the same Nether portal unless you manually build the exact Nether coordinates!
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Safe spacing! Portals are {Math.round(overworldDist)} blocks apart (&gt; 128 blocks).</span>
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

            {/* 2-Way Link Guarantee Checklist */}
            <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-2 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Guaranteed 100% 2-Way Linking Protocol:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 leading-relaxed">
                <li>
                  Build and light your initial portal at <strong className="text-purple-300 font-mono">{posX}, {posY}, {posZ}</strong>.
                </li>
                <li>
                  Step through. If the game autogenerates a portal far from <strong className="text-purple-300 font-mono">{calculatedX}, {calculatedY}, {calculatedZ}</strong>, extinguish it.
                </li>
                <li>
                  Travel directly to <strong className="text-purple-300 font-mono">X: {calculatedX}, Y: {calculatedY}, Z: {calculatedZ}</strong> in the {direction === 'ow_to_nether' ? 'Nether' : 'Overworld'}.
                </li>
                <li>
                  Construct your {frameStyle === 'budget' ? '10-Obsidian' : '14-Obsidian'} frame at these exact coordinates and ignite with Flint & Steel.
                </li>
                <li>
                  Both portals are now permanently locked in 2-way sync without drifting or latching to other players!
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
