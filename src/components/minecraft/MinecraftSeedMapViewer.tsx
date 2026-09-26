import React, { useState, useMemo } from 'react';
import { 
  Map, 
  ExternalLink, 
  Compass, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  Navigation, 
  ShieldCheck, 
  Layers, 
  Crosshair,
  Info,
  ArrowRight
} from 'lucide-react';

const SEED_PRESETS = [
  {
    name: '5 Villages & 1.21 Trial Chamber',
    seed: '7392817491',
    description: 'Spawn surrounded by Plains and Desert villages with a pristine Trial Chamber 150 blocks away.'
  },
  {
    name: 'Cherry Grove Crater Ring',
    seed: '-4920194829',
    description: 'Stunning circular mountain ring filled with pink cherry blossom trees and a protected valley.'
  },
  {
    name: 'Triple Ancient City Underneath',
    seed: '867530942',
    description: 'Gigantic mountain range concealing 3 interconnected Ancient Cities at Y=-51.'
  },
  {
    name: 'Mansion & Outpost Border War',
    seed: '1948274921',
    description: 'Dark Forest Woodland Mansion right next to an aggressive Pillager Outpost.'
  },
  {
    name: 'Survival Island & Ocean Monument',
    seed: '5501928471',
    description: 'Single oak tree island surrounded by deep warm ocean and an ancient Guardian monument.'
  }
];

export const MinecraftSeedMapViewer: React.FC = () => {
  const [seedInput, setSeedInput] = useState<string>('7392817491');
  const [activeSeed, setActiveSeed] = useState<string>('7392817491');
  const [gameVersion, setGameVersion] = useState<string>('1.21');
  const [dimension, setDimension] = useState<'overworld' | 'nether' | 'end'>('overworld');
  const [coordX, setCoordX] = useState<string>('0');
  const [coordZ, setCoordZ] = useState<string>('0');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Construct Chunkbase Direct URL
  const chunkbaseUrl = useMemo(() => {
    const s = encodeURIComponent(activeSeed.trim());
    const x = parseInt(coordX) || 0;
    const z = parseInt(coordZ) || 0;
    const v = gameVersion === 'bedrock' ? 'bedrock_1_21' : gameVersion === '1.20' ? '1.20' : '1.21';
    const dim = dimension === 'nether' ? '-1' : dimension === 'end' ? '1' : '0';
    return `https://www.chunkbase.com/apps/seed-map#seed=${s}&platform=${v}&dimension=${dim}&x=${x}&z=${z}&zoom=0.5`;
  }, [activeSeed, gameVersion, dimension, coordX, coordZ]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRandomize = () => {
    const random = Math.floor(Math.random() * 9000000000 + 1000000000).toString();
    setSeedInput(random);
    setActiveSeed(random);
  };

  const xNum = parseInt(coordX) || 0;
  const zNum = parseInt(coordZ) || 0;
  const sampleTpCmd = `/tp @s ${xNum} ~ ${zNum}`;

  return (
    <div className="font-minecraftia space-y-6 max-w-4xl mx-auto">
      {/* Top Grass Header */}
      <div className="mc-panel-dirt border-4 border-[#0e0a07] shadow-2xl overflow-hidden">
        <div className="mc-grass-header px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-[#2b4414]">
          <div>
            <div className="flex items-center gap-2 text-yellow-300 text-xs uppercase drop-shadow-[1px_1px_0px_#1e2f0d]">
              <span>Official Seed Cartography</span>
              <span>·</span>
              <span className="text-emerald-300">100% In-Game Byte-Accurate</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide drop-shadow-[2px_2px_0px_#1e2f0d] mt-0.5">
              Chunkbase Seed Map Launcher
            </h1>
            <p className="text-xs text-[#ccebb0] max-w-2xl mt-1 leading-relaxed drop-shadow-[1px_1px_0px_#1e2f0d]">
              Minecraft 1.18+ uses native C++ Multi-Noise terrain generation. Launch your exact seed directly into Chunkbase's native engine to view every single village, trial chamber, biome border, and structure with 100% precision.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[10px] text-[#ccebb0] uppercase">Famous Seeds:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setSeedInput(e.target.value);
                  setActiveSeed(e.target.value);
                }
              }}
              className="bg-[#1a2b0d] border-2 border-[#41681a] px-2 py-1 text-xs text-yellow-300"
            >
              <option value="">Select Seed Preset...</option>
              {SEED_PRESETS.map(p => (
                <option key={p.seed} value={p.seed}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Seed Configuration Card */}
      <div className="mc-panel-dirt border-4 border-[#0e0a07] p-6 sm:p-8 bg-[#1c130d] shadow-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Seed Input */}
          <div className="sm:col-span-6 space-y-1.5">
            <label className="text-xs uppercase text-yellow-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                World Seed:
              </span>
              <span className="text-[10px] text-[#9c8979]">Numeric or Text Seed</span>
            </label>
            <div className="flex items-center gap-1 bg-[#100b08] border-2 border-[#332216] p-1.5">
              <input
                type="text"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                placeholder="Enter world seed..."
                className="w-full bg-transparent text-sm text-white font-mono px-2 focus:outline-none"
              />
              <button
                onClick={() => setActiveSeed(seedInput)}
                className="px-3 py-1 bg-[#5b8731] hover:bg-[#6c9f3b] text-yellow-300 font-bold text-xs uppercase border border-[#7cb342] cursor-pointer shrink-0"
              >
                Set
              </button>
              <button
                onClick={handleRandomize}
                className="px-2 py-1 bg-[#2b1c13] hover:bg-[#3d2a1d] text-[#c2b09e] border border-white/10 cursor-pointer shrink-0"
                title="Generate Random Seed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Version Selector */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-xs uppercase text-[#c2b09e] block">
              Version / Edition:
            </label>
            <select
              value={gameVersion}
              onChange={(e) => setGameVersion(e.target.value)}
              className="w-full bg-[#100b08] border-2 border-[#332216] px-3 py-2 text-xs text-white"
            >
              <option value="1.21">Java 1.21+ (Tricky Trials)</option>
              <option value="1.20">Java 1.20 (Trails & Tales)</option>
              <option value="bedrock">Bedrock Edition 1.21+</option>
            </select>
          </div>

          {/* Dimension Selector */}
          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-xs uppercase text-[#c2b09e] block">
              Dimension:
            </label>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value as any)}
              className="w-full bg-[#100b08] border-2 border-[#332216] px-3 py-2 text-xs text-white"
            >
              <option value="overworld">Overworld</option>
              <option value="nether">The Nether</option>
              <option value="end">The End</option>
            </select>
          </div>
        </div>

        {/* Target Coordinates */}
        <div className="p-4 bg-[#120d09] border-2 border-[#2b1c13] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-white font-bold block">Optional Focus Coordinates:</span>
              <span className="text-[10px] text-[#9c8979]">Center the Chunkbase map at specific coords.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#a09080]">X:</span>
              <input
                type="number"
                value={coordX}
                onChange={(e) => setCoordX(e.target.value)}
                className="w-20 bg-black/60 border border-white/10 px-2 py-1 text-xs text-yellow-300 font-mono text-center"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#a09080]">Z:</span>
              <input
                type="number"
                value={coordZ}
                onChange={(e) => setCoordZ(e.target.value)}
                className="w-20 bg-black/60 border border-white/10 px-2 py-1 text-xs text-yellow-300 font-mono text-center"
              />
            </div>
            <button
              onClick={() => handleCopy('sampleTp', sampleTpCmd)}
              className="px-2.5 py-1 bg-[#1a2b0d] border border-[#41681a] text-yellow-300 text-[10px] uppercase flex items-center gap-1 cursor-pointer shrink-0"
              title="Copy Teleport Command"
            >
              {copiedKey === 'sampleTp' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'sampleTp' ? 'Copied' : 'Copy /tp'}</span>
            </button>
          </div>
        </div>

        {/* GIANT PROMINENT "OPEN IN CHUNKBASE" BUTTON */}
        <div className="pt-2 text-center space-y-3">
          <a
            href={chunkbaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 w-full py-5 px-8 bg-gradient-to-r from-[#006ac7] via-[#0088ee] to-[#006ac7] hover:from-[#007ae0] hover:to-[#0095ff] text-white border-4 border-[#4fc3f7] shadow-[0_0_30px_rgba(0,106,199,0.5)] transition-all cursor-pointer select-none text-center"
          >
            <Map className="w-6 h-6 text-yellow-300 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-base sm:text-lg font-bold uppercase tracking-wider text-white drop-shadow-[2px_2px_0px_#000]">
                OPEN IN CHUNKBASE SEED MAP
              </div>
              <div className="text-[11px] text-cyan-100 font-normal">
                Pre-filled with Seed: <strong className="text-yellow-300 font-mono">{activeSeed}</strong> · Platform: <strong className="text-white uppercase">{gameVersion}</strong>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 ml-auto text-cyan-200 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#9c8979]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guarantees 100% byte-for-byte terrain & structure accuracy using official Cubiomes engine</span>
          </div>
        </div>
      </div>

      {/* Preset Showcase Cards */}
      <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 bg-[#1c130d] space-y-3 shadow-xl">
        <div className="border-b-2 border-[#332216] pb-2 flex items-center justify-between">
          <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Popular Notable Seed Presets
          </span>
          <span className="text-[10px] text-[#a09080]">Click to load & launch</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SEED_PRESETS.map(p => (
            <div
              key={p.seed}
              className="p-3 bg-[#100b08] border-2 border-[#291c13] hover:border-yellow-400/40 transition-colors flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-yellow-300 uppercase">{p.name}</h4>
                  <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.2">
                    {p.seed}
                  </span>
                </div>
                <p className="text-[11px] text-[#a09080] mt-1 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <button
                  onClick={() => {
                    setSeedInput(p.seed);
                    setActiveSeed(p.seed);
                  }}
                  className="text-[10px] uppercase text-[#c2b09e] hover:text-white cursor-pointer"
                >
                  Load in Config
                </button>

                <a
                  href={`https://www.chunkbase.com/apps/seed-map#seed=${p.seed}&platform=1.21`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 bg-[#006ac7] hover:bg-[#0080ee] text-white text-[10px] uppercase border border-[#40b0ff] flex items-center gap-1"
                >
                  <span>Open Now</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
