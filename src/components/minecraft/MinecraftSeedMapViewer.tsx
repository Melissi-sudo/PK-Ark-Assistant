import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Compass, 
  RotateCcw, 
  Copy, 
  Check, 
  Navigation, 
  Crosshair,
  ZoomIn,
  ZoomOut,
  Filter,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import {
  CubiomesWasmBridge,
  MinecraftSeedSession,
  parseMinecraftSeed,
  SUPPORTED_JAVA_VERSIONS,
  STRUCTURE_CATALOG,
  StructureSpawned,
  Dimension
} from '../../lib/minecraftSeedEngine';

const SEED_PRESETS = [
  {
    name: '5 Villages & 1.21 Trial Chamber',
    seed: '7392817491',
    description: 'Spawn in sparse jungle at (-64, 128) with Trial Chamber at (160, 64).'
  },
  {
    name: 'Snowy Slopes & Mountain Caldera',
    seed: '12345',
    description: 'Spawn in snowy slopes at (0, 0) with Trial Chamber at (288, 16) and Ancient City at (-528, 384).'
  },
  {
    name: 'Triple Ancient City Underneath',
    seed: '867530942',
    description: 'Massive alpine range concealing 3 interconnected Ancient Cities at Y=-51.'
  },
  {
    name: 'Cherry Grove Caldera Ring',
    seed: '-4920194829',
    description: 'Circular crater filled with pink cherry blossom trees and valley waterfalls.'
  },
  {
    name: 'Mansion & Outpost Border War',
    seed: '1948274921',
    description: 'Dark Forest Woodland Mansion right next to an aggressive Pillager Outpost.'
  },
  {
    name: 'Survival Island & Ocean Monument',
    seed: '5501928471',
    description: 'Lonely oak survival island surrounded by ocean and Guardian monument.'
  }
];

export const MinecraftSeedMapViewer: React.FC = () => {
  // Engine & Session State
  const [engineReady, setEngineReady] = useState<boolean>(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const sessionRef = useRef<MinecraftSeedSession | null>(null);
  const [sessionNonce, setSessionNonce] = useState<number>(0);

  // Configuration State
  const [seedInput, setSeedInput] = useState<string>('7392817491');
  const [activeSeedString, setActiveSeedString] = useState<string>('7392817491');
  const [activeVersion, setActiveVersion] = useState<string>('1.21.1');
  const [activeDimension, setActiveDimension] = useState<Dimension>('overworld');

  // Parsed BigInt Seed (strict Java Edition standard)
  const parsedSeed = useMemo(() => parseMinecraftSeed(activeSeedString), [activeSeedString]);

  // Structure Visibility Filter
  const [activeStructureCodes, setActiveStructureCodes] = useState<Set<string>>(() => {
    return new Set(STRUCTURE_CATALOG.map(s => s.code));
  });

  // Canvas Camera / Viewport State (world coordinates centered on camera)
  const [camera, setCamera] = useState<{ x: number; z: number; zoom: number }>({
    x: -64,
    z: 128,
    zoom: 2 // 2 Minecraft blocks per canvas pixel
  });

  // Interactive Hover & Selection
  const [hoverCoord, setHoverCoord] = useState<{ x: number; z: number; biomeName: string; biomeId: number } | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<StructureSpawned | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Coordinate Search Inputs
  const [searchX, setSearchX] = useState<string>('-64');
  const [searchZ, setSearchZ] = useState<string>('128');

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; camX: number; camZ: number }>({
    mouseX: 0,
    mouseY: 0,
    camX: 0,
    camZ: 0
  });

  const visibleStructuresRef = useRef<StructureSpawned[]>([]);
  const tileCacheRef = useRef<Map<string, HTMLCanvasElement>>(new Map());

  // Initialize WASM Module
  useEffect(() => {
    let isMounted = true;
    CubiomesWasmBridge.getModule()
      .then((m) => {
        if (!isMounted) return;
        const versionObj = SUPPORTED_JAVA_VERSIONS.find(v => v.id === activeVersion) || SUPPORTED_JAVA_VERSIONS[0];
        const session = new MinecraftSeedSession(m, parsedSeed, versionObj.enumVal, activeDimension);
        sessionRef.current = session;
        tileCacheRef.current.clear();
        
        // Auto-center camera to World Spawn on initial load
        if (activeDimension === 'overworld') {
          const spawn = session.getSpawn();
          setCamera(prev => ({ ...prev, x: spawn.x, z: spawn.z }));
          setSearchX(spawn.x.toString());
          setSearchZ(spawn.z.toString());
        }

        setEngineReady(true);
        setSessionNonce(n => n + 1);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Cubiomes WASM Engine Load Error:', err);
        setEngineError('Failed to initialize Cubiomes WebAssembly engine. Please check browser WebAssembly support.');
      });

    return () => {
      isMounted = false;
      if (sessionRef.current) {
        sessionRef.current.destroy();
        sessionRef.current = null;
      }
      tileCacheRef.current.clear();
    };
  }, []);

  // Update WASM Session when Seed, Version, or Dimension changes
  useEffect(() => {
    if (!sessionRef.current || !engineReady) return;
    const versionObj = SUPPORTED_JAVA_VERSIONS.find(v => v.id === activeVersion) || SUPPORTED_JAVA_VERSIONS[0];
    sessionRef.current.updateConfig(parsedSeed, versionObj.enumVal, activeDimension);
    tileCacheRef.current.clear();

    if (activeDimension === 'overworld') {
      const spawn = sessionRef.current.getSpawn();
      setCamera(prev => ({ ...prev, x: spawn.x, z: spawn.z }));
      setSearchX(spawn.x.toString());
      setSearchZ(spawn.z.toString());
    } else {
      setCamera(prev => ({ ...prev, x: 0, z: 0 }));
      setSearchX('0');
      setSearchZ('0');
    }

    setSelectedStructure(null);
    setSessionNonce(n => n + 1);
  }, [parsedSeed, activeVersion, activeDimension, engineReady]);

  // Deterministic Biome Render Loop
  // Strictly renders Minecraft coordinate -> exact biome ID -> known solid biome color
  const renderMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sessionRef.current || !engineReady) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
    }

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    const { x: camX, z: camZ, zoom } = camera;
    const session = sessionRef.current;

    // Crisp pixelated Minecraft presentation
    ctx.imageSmoothingEnabled = false;

    // Clear canvas completely
    ctx.clearRect(0, 0, width, height);

    // Default background based on dimension
    ctx.fillStyle = activeDimension === 'nether' ? '#1c0c0c' : activeDimension === 'end' ? '#090814' : '#07111e';
    ctx.fillRect(0, 0, width, height);

    const halfWorldW = (width / 2) * zoom;
    const halfWorldH = (height / 2) * zoom;
    const minWorldX = Math.round(camX - halfWorldW);
    const maxWorldX = Math.round(camX + halfWorldW);
    const minWorldZ = Math.round(camZ - halfWorldH);
    const maxWorldZ = Math.round(camZ + halfWorldH);

    // High-performance adaptive multi-scale LOD tiles
    // Keeps on-screen tiles bounded to ~16-25 tiles at ANY zoom level with zero lag
    let tileBlocks = 256;
    let tileScale = 4;
    if (zoom > 8) {
      tileBlocks = 4096;
      tileScale = 64;
    } else if (zoom > 2) {
      tileBlocks = 1024;
      tileScale = 16;
    }

    const minTileX = Math.floor(minWorldX / tileBlocks);
    const maxTileX = Math.floor(maxWorldX / tileBlocks);
    const minTileZ = Math.floor(minWorldZ / tileBlocks);
    const maxTileZ = Math.floor(maxWorldZ / tileBlocks);

    const yLevel = 64;

    for (let tx = minTileX; tx <= maxTileX; tx++) {
      for (let tz = minTileZ; tz <= maxTileZ; tz++) {
        const key = `${session.seed}_${session.version}_${session.dimension}_${tileScale}_${tx}_${tz}`;
        let tileCanvas = tileCacheRef.current.get(key);
        if (!tileCanvas) {
          tileCanvas = session.renderTileToCanvas(tx, tz, tileBlocks, tileScale, yLevel) || undefined;
          if (tileCanvas) {
            tileCacheRef.current.set(key, tileCanvas);
            if (tileCacheRef.current.size > 800) {
              const firstKey = tileCacheRef.current.keys().next().value;
              if (firstKey) tileCacheRef.current.delete(firstKey);
            }
          }
        }
        if (tileCanvas) {
          const screenX = (tx * tileBlocks - camX) / zoom + width / 2;
          const screenZ = (tz * tileBlocks - camZ) / zoom + height / 2;
          const screenW = tileBlocks / zoom;
          const screenH = tileBlocks / zoom;
          ctx.drawImage(tileCanvas, screenX, screenZ, screenW, screenH);
        }
      }
    }

    // Draw Coordinate Grid Lines (every 512 blocks)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gridStep = 512;
    const firstGridX = Math.floor(minWorldX / gridStep) * gridStep;
    for (let gx = firstGridX; gx <= maxWorldX; gx += gridStep) {
      const sx = (gx - camX) / zoom + width / 2;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
    }
    const firstGridZ = Math.floor(minWorldZ / gridStep) * gridStep;
    for (let gz = firstGridZ; gz <= maxWorldZ; gz += gridStep) {
      const sz = (gz - camZ) / zoom + height / 2;
      ctx.moveTo(0, sz);
      ctx.lineTo(width, sz);
    }
    ctx.stroke();

    // Draw Major Origin Axes (X=0 and Z=0)
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)'; // bright gold
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (minWorldX <= 0 && maxWorldX >= 0) {
      const axisX = (0 - camX) / zoom + width / 2;
      ctx.moveTo(axisX, 0);
      ctx.lineTo(axisX, height);
    }
    if (minWorldZ <= 0 && maxWorldZ >= 0) {
      const axisZ = (0 - camZ) / zoom + height / 2;
      ctx.moveTo(0, axisZ);
      ctx.lineTo(width, axisZ);
    }
    ctx.stroke();

    // Query Verified Structures in visible bounds
    const structures = session.getStructuresInBounds(
      minWorldX,
      minWorldZ,
      maxWorldX,
      maxWorldZ,
      activeStructureCodes
    );
    visibleStructuresRef.current = structures;

    // Draw Structures
    structures.forEach((st) => {
      const sx = (st.x - camX) / zoom + width / 2;
      const sz = (st.z - camZ) / zoom + height / 2;

      const isSelected = selectedStructure && selectedStructure.x === st.x && selectedStructure.z === st.z;
      const radius = isSelected ? 12 : 9;

      // Circle pin background
      ctx.beginPath();
      ctx.arc(sx, sz, radius, 0, Math.PI * 2);
      ctx.fillStyle = st.color;
      ctx.fill();
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.strokeStyle = isSelected ? '#ffffff' : '#000000';
      ctx.stroke();

      // Icon symbol inside pin
      ctx.fillStyle = '#ffffff';
      ctx.font = isSelected ? 'bold 11px sans-serif' : 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(st.iconChar, sx, sz);

      // Label below marker if zoomed in enough or selected
      if (zoom <= 2 || isSelected) {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px monospace';
        const txt = st.name.split(' (')[0];
        const txtWidth = ctx.measureText(txt).width;
        ctx.fillRect(sx - txtWidth / 2 - 2, sz + radius + 1, txtWidth + 4, 11);
        ctx.fillStyle = '#fef08a';
        ctx.fillText(txt, sx, sz + radius + 7);
      }
    });

    // Draw World Spawn Pin (Overworld only)
    if (activeDimension === 'overworld') {
      const spawn = session.getSpawn();
      const spX = (spawn.x - camX) / zoom + width / 2;
      const spZ = (spawn.z - camZ) / zoom + height / 2;

      ctx.beginPath();
      ctx.arc(spX, spZ, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', spX, spZ);

      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(spX - 24, spZ + 13, 48, 12);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('SPAWN', spX, spZ + 19);
    }
  }, [camera, engineReady, activeDimension, activeStructureCodes, selectedStructure]);

  // Render on camera change, dimension change, version change, or nonce update
  useEffect(() => {
    renderMap();
  }, [renderMap, camera, sessionNonce, activeDimension, activeStructureCodes, selectedStructure]);

  // Window resize listener to keep map sharp
  useEffect(() => {
    const handleResize = () => {
      renderMap();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderMap]);

  // Mouse / Touch Event Handlers for Panning & Inspecting
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      camX: camera.x,
      camZ: camera.z
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !sessionRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const mouseCanvasX = e.clientX - rect.left;
    const mouseCanvasY = e.clientY - rect.top;

    // Handle Panning
    if (isDraggingRef.current) {
      const dx = (e.clientX - dragStartRef.current.mouseX) * camera.zoom;
      const dz = (e.clientY - dragStartRef.current.mouseY) * camera.zoom;
      setCamera(prev => ({
        ...prev,
        x: Math.round(dragStartRef.current.camX - dx),
        z: Math.round(dragStartRef.current.camZ - dz)
      }));
      return;
    }

    // World Coordinates under cursor (exact linear bijection)
    const worldX = Math.round(camera.x + (mouseCanvasX - canvas.width / 2) * camera.zoom);
    const worldZ = Math.round(camera.z + (mouseCanvasY - canvas.height / 2) * camera.zoom);
    const yLevel = activeDimension === 'nether' ? 64 : 64;
    const biome = sessionRef.current.getBiomeAt(worldX, yLevel, worldZ, 1);

    setHoverCoord({
      x: worldX,
      z: worldZ,
      biomeName: biome.name.replace(/_/g, ' ').toUpperCase(),
      biomeId: biome.id
    });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      const totalDist = Math.hypot(
        e.clientX - dragStartRef.current.mouseX,
        e.clientY - dragStartRef.current.mouseY
      );
      isDraggingRef.current = false;

      // Click to select structure
      if (totalDist < 5) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const clicked = visibleStructuresRef.current.find(st => {
          const sx = (st.x - camera.x) / camera.zoom + canvas.width / 2;
          const sz = (st.z - camera.z) / camera.zoom + canvas.height / 2;
          return Math.hypot(clickX - sx, clickY - sz) <= 14;
        });

        setSelectedStructure(clicked || null);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.75 : 1.33;
    setCamera(prev => {
      const newZoom = Math.max(0.5, Math.min(16, prev.zoom * zoomFactor));
      return { ...prev, zoom: newZoom };
    });
  };

  const handleZoom = (factor: number) => {
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(16, prev.zoom * factor))
    }));
  };

  const handleResetToSpawn = () => {
    if (!sessionRef.current) return;
    const spawn = sessionRef.current.getSpawn();
    setCamera({ x: spawn.x, z: spawn.z, zoom: 2 });
    setSearchX(spawn.x.toString());
    setSearchZ(spawn.z.toString());
  };

  const handleSearchCoords = (e: React.FormEvent) => {
    e.preventDefault();
    const tx = parseInt(searchX) || 0;
    const tz = parseInt(searchZ) || 0;
    setCamera(prev => ({ ...prev, x: tx, z: tz }));
  };

  const toggleStructureFilter = (code: string) => {
    setActiveStructureCodes(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const toggleAllStructures = (enable: boolean) => {
    if (enable) {
      setActiveStructureCodes(new Set(STRUCTURE_CATALOG.map(s => s.code)));
    } else {
      setActiveStructureCodes(new Set());
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentVersionObj = useMemo(() => {
    return SUPPORTED_JAVA_VERSIONS.find(v => v.id === activeVersion) || SUPPORTED_JAVA_VERSIONS[0];
  }, [activeVersion]);

  const currentDimensionStructures = useMemo(() => {
    return STRUCTURE_CATALOG.filter(s => s.category === activeDimension);
  }, [activeDimension]);

  return (
    <div className="font-minecraftia space-y-6 max-w-6xl mx-auto">
      {/* Top Grass Header */}
      <div className="mc-panel-dirt border-4 border-[#0e0a07] shadow-2xl overflow-hidden">
        <div className="mc-grass-header px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-[#2b4414]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-yellow-300 text-xs uppercase drop-shadow-[1px_1px_0px_#1e2f0d]">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm inline-block shadow-sm animate-pulse" />
              <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-500/80 text-amber-300 font-bold text-[10px] tracking-wider rounded-none">
                EXPERIMENTAL · NOT 100% ACCURATE
              </span>
              <span>·</span>
              <span>Native In-Browser Cubiomes WASM</span>
              <span>·</span>
              <span className="text-emerald-300">Minecraft Java Edition</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide drop-shadow-[2px_2px_0px_#1e2f0d] mt-1 flex items-center gap-2">
              <span>Interactive Java Seed Cartographer</span>
              <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-normal">
                Experimental
              </span>
            </h1>
            <p className="text-xs text-[#ccebb0] max-w-3xl mt-1 leading-relaxed drop-shadow-[1px_1px_0px_#1e2f0d]">
              Native in-browser multi-noise biome rendering and structure candidate finder. <strong className="text-amber-300">Note: This tool is experimental and is not 100% accurate.</strong> In-game 3D terrain elevation, local underground carve-outs, and specific version quirks may cause differences compared to your actual Minecraft world.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[10px] text-[#ccebb0] uppercase">Preset Seeds:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setSeedInput(e.target.value);
                  setActiveSeedString(e.target.value);
                }
              }}
              className="bg-[#1a2b0d] border-2 border-[#41681a] px-2 py-1.5 text-xs text-yellow-300 focus:outline-none cursor-pointer"
            >
              <option value="">Load Preset Seed...</option>
              {SEED_PRESETS.map(p => (
                <option key={p.seed} value={p.seed}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prominent Experimental Disclaimer Banner */}
        <div className="bg-[#1e1308] border-b-2 border-amber-900/60 px-4 py-2 text-xs text-amber-200/90 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] leading-tight">
            <strong>Experimental Cartographer Notice:</strong> This map is an estimation and <strong>not 100% accurate</strong>. Biome boundaries and structure coordinates provide general guidance, but local world generation may vary in-game.
          </span>
        </div>
      </div>

      {/* Main Seed Configuration Bar */}
      <div className="mc-panel-dirt border-4 border-[#0e0a07] p-4 sm:p-6 bg-[#1c130d] shadow-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* Seed Input */}
          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs uppercase text-yellow-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                World Seed:
              </span>
              <span className="text-[10px] text-[#9c8979]">Signed 64-Bit or Text Hash</span>
            </label>
            <div className="flex items-center gap-1 bg-[#100b08] border-2 border-[#332216] p-1">
              <input
                type="text"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                placeholder="Enter seed (e.g. 7392817491 or 12345)..."
                className="w-full bg-transparent text-xs sm:text-sm text-white font-mono px-2 focus:outline-none"
              />
              <button
                onClick={() => setActiveSeedString(seedInput)}
                className="px-3 py-1 bg-[#5b8731] hover:bg-[#6c9f3b] text-yellow-300 font-bold text-xs uppercase border border-[#7cb342] cursor-pointer shrink-0"
              >
                Render
              </button>
              <button
                onClick={() => {
                  const rnd = Math.floor(Math.random() * 9000000000 + 1000000000).toString();
                  setSeedInput(rnd);
                  setActiveSeedString(rnd);
                }}
                className="px-2 py-1 bg-[#2b1c13] hover:bg-[#3d2a1d] text-[#c2b09e] border border-white/10 cursor-pointer shrink-0"
                title="Random Seed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[10px] text-[#a09080] truncate font-mono">
              Active Java Seed: <span className="text-emerald-400 font-bold">{parsedSeed.toString()}</span>
            </div>
          </div>

          {/* Minecraft Java Version Selector */}
          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs uppercase text-[#c2b09e] block">
              Java Edition Version:
            </label>
            <select
              value={activeVersion}
              onChange={(e) => setActiveVersion(e.target.value)}
              className="w-full bg-[#100b08] border-2 border-[#332216] px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              {SUPPORTED_JAVA_VERSIONS.map(v => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
            <div className="text-[10px] text-[#9c8979] truncate">
              {currentVersionObj.description}
            </div>
          </div>

          {/* Dimension Selector */}
          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs uppercase text-[#c2b09e] block">
              Dimension:
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setActiveDimension('overworld')}
                className={`py-1.5 text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                  activeDimension === 'overworld'
                    ? 'bg-[#5b8731] border-[#7cb342] text-yellow-300'
                    : 'bg-[#100b08] border-[#332216] text-[#c2b09e] hover:text-white'
                }`}
              >
                Overworld
              </button>
              <button
                onClick={() => setActiveDimension('nether')}
                className={`py-1.5 text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                  activeDimension === 'nether'
                    ? 'bg-[#991b1b] border-[#ef4444] text-yellow-300'
                    : 'bg-[#100b08] border-[#332216] text-[#c2b09e] hover:text-white'
                }`}
              >
                Nether
              </button>
              <button
                onClick={() => setActiveDimension('end')}
                className={`py-1.5 text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                  activeDimension === 'end'
                    ? 'bg-[#581c87] border-[#a855f7] text-yellow-300'
                    : 'bg-[#100b08] border-[#332216] text-[#c2b09e] hover:text-white'
                }`}
              >
                The End
              </button>
            </div>
          </div>
        </div>

        {/* Quick Coordinate Search & Viewport Controls */}
        <form onSubmit={handleSearchCoords} className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#332216]">
          <div className="flex items-center gap-2 text-xs">
            <Crosshair className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-[#c2b09e]">Go to Coords:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#a09080] text-[10px]">X:</span>
              <input
                type="number"
                value={searchX}
                onChange={(e) => setSearchX(e.target.value)}
                className="w-20 bg-black/60 border border-white/10 px-1.5 py-0.5 text-xs text-yellow-300 font-mono text-center"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#a09080] text-[10px]">Z:</span>
              <input
                type="number"
                value={searchZ}
                onChange={(e) => setSearchZ(e.target.value)}
                className="w-20 bg-black/60 border border-white/10 px-1.5 py-0.5 text-xs text-yellow-300 font-mono text-center"
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-0.5 bg-[#2b1c13] hover:bg-[#3d2a1d] text-yellow-300 border border-[#553b26] text-[10px] uppercase cursor-pointer"
            >
              Center View
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetToSpawn}
              className="px-2.5 py-0.5 bg-[#1a2b0d] hover:bg-[#253d13] text-emerald-300 border border-[#41681a] text-[10px] uppercase flex items-center gap-1 cursor-pointer"
            >
              <span>★ Reset to Spawn</span>
            </button>
            <div className="flex items-center bg-[#100b08] border border-[#332216]">
              <button
                type="button"
                onClick={() => handleZoom(0.7)}
                className="px-2 py-0.5 text-yellow-300 hover:bg-white/10 text-xs"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(1.4)}
                className="px-2 py-0.5 text-yellow-300 hover:bg-white/10 text-xs"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Map Display & Live Coordinate HUD */}
      <div className="relative mc-panel-dirt border-4 border-[#0e0a07] bg-[#0c0806] shadow-2xl overflow-hidden">
        {engineError && (
          <div className="p-6 bg-red-950/80 border-2 border-red-500 text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{engineError}</span>
          </div>
        )}

        {/* Live Top HUD Bar */}
        <div className="bg-[#140e0a]/95 border-b-2 border-[#2b1c13] px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-1.5 py-0.5 bg-amber-950/80 border border-amber-600/70 text-amber-300 font-bold text-[9px] uppercase tracking-wider">
              Experimental (Not 100% Accurate)
            </span>

            <div className="flex items-center gap-1.5 text-yellow-300 font-mono text-[11px]">
              <Navigation className="w-3.5 h-3.5 text-yellow-400" />
              <span>Center:</span>
              <span className="text-white">X: {camera.x}</span>
              <span className="text-white">Z: {camera.z}</span>
              <span className="text-[#a09080] text-[10px]">({camera.zoom.toFixed(1)} blk/px)</span>
            </div>

            {hoverCoord && (
              <div className="flex items-center gap-2 border-l border-[#332216] pl-3 text-[11px] font-mono">
                <span className="text-[#a09080]">Cursor:</span>
                <span className="text-cyan-300">[{hoverCoord.x}, {hoverCoord.z}]</span>
                <span className="text-emerald-400 font-bold">{hoverCoord.biomeName}</span>
                <span className="text-[#9c8979] text-[10px]">(ID {hoverCoord.biomeId})</span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-[#9c8979] flex items-center gap-2">
            <span>🖱 Drag to Pan</span>
            <span>·</span>
            <span>Scroll Wheel to Zoom</span>
            <span>·</span>
            <span>Click Pin to Inspect</span>
          </div>
        </div>

        {/* Interactive Canvas */}
        <div className="relative w-full h-[520px] bg-[#07111e] overflow-hidden cursor-crosshair">
          {/* Subtle Experimental Watermark Badge in Canvas Corner */}
          <div className="absolute top-2 right-2 pointer-events-none z-20 px-2 py-1 bg-black/60 backdrop-blur-xs border border-amber-500/30 text-amber-300/80 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Experimental Map · Not 100% Accurate</span>
          </div>
          <canvas
            ref={canvasRef}
            width={960}
            height={520}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            className="w-full h-full block"
          />

          {/* Selected Structure Popup Overlay */}
          {selectedStructure && (
            <div className="absolute bottom-4 left-4 max-w-sm bg-[#140e0a]/95 border-2 border-yellow-500/80 p-3 shadow-2xl space-y-2 text-xs z-30 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold shadow"
                    style={{ backgroundColor: selectedStructure.color, color: '#ffffff' }}
                  >
                    {selectedStructure.iconChar}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-xs leading-tight">
                      {selectedStructure.name}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Chunk [{selectedStructure.chunkX}, {selectedStructure.chunkZ}]
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStructure(null)}
                  className="text-[#9c8979] hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>

              <div className="p-1.5 bg-[#0a0705] border border-[#2b1c13] font-mono text-[11px] flex items-center justify-between">
                <span className="text-yellow-300">
                  X: {selectedStructure.x} · Z: {selectedStructure.z}
                </span>
                <button
                  onClick={() => {
                    const cmd = `/tp @s ${selectedStructure.x} ~ ${selectedStructure.z}`;
                    handleCopy('tpCmd', cmd);
                  }}
                  className="px-2 py-0.5 bg-[#5b8731] hover:bg-[#6c9f3b] text-yellow-300 text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                  title="Copy Teleport Command"
                >
                  {copiedKey === 'tpCmd' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'tpCmd' ? 'Copied' : 'Copy /tp'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Structure Toggles & Legend Panel */}
      <div className="mc-panel-dirt border-4 border-[#0e0a07] p-4 sm:p-5 bg-[#1c130d] shadow-2xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#332216]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-yellow-400" />
            <h3 className="text-xs uppercase font-bold text-white tracking-wide">
              {activeDimension.toUpperCase()} STRUCTURE FILTERS ({currentDimensionStructures.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleAllStructures(true)}
              className="text-[10px] text-emerald-400 hover:underline uppercase cursor-pointer"
            >
              Enable All
            </button>
            <span className="text-[#332216]">|</span>
            <button
              onClick={() => toggleAllStructures(false)}
              className="text-[10px] text-[#9c8979] hover:underline uppercase cursor-pointer"
            >
              Disable All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {currentDimensionStructures.map((st) => {
            const isEnabled = activeStructureCodes.has(st.code);
            return (
              <button
                key={st.code}
                onClick={() => toggleStructureFilter(st.code)}
                className={`p-1.5 border flex items-center gap-2 text-left transition-all cursor-pointer text-xs ${
                  isEnabled
                    ? 'bg-[#150f0b] border-[#553b26] text-white shadow-sm'
                    : 'bg-[#0d0907] border-[#221610] text-[#736355] opacity-60'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: st.color, color: '#ffffff' }}
                >
                  {st.iconChar}
                </span>
                <span className="truncate text-[11px] flex-1">
                  {st.name}
                </span>
                {isEnabled ? (
                  <Eye className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <EyeOff className="w-3 h-3 text-[#553b26] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Stronghold Algorithm Note */}
        {activeDimension === 'overworld' && (
          <div className="mt-3 p-2.5 bg-[#120d09] border border-[#2b1c13] text-[10px] text-[#a09080] flex items-start gap-2 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-yellow-300">Stronghold Generation Note:</strong> Strongholds generate in 8 concentric rings centered around (0, 0) using Minecraft Java's official ring distribution formula. All other structures (Trial Chambers, Villages, Ancient Cities, Outposts, Mansions) use Cubiomes' native two-stage PRNG grid placement and in-game biome validation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
