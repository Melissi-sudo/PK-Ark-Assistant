import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  Layers, 
  ShieldAlert, 
  Pickaxe, 
  Copy, 
  Check, 
  Navigation, 
  Sparkles, 
  Flame, 
  Zap, 
  Eye, 
  ChevronRight,
  ExternalLink,
  Crosshair,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X
} from 'lucide-react';
import { ArkMapInfo, ResourceCategory, ResourceNode } from '../types';
import { ARK_MAPS_DATA, RESOURCE_CATEGORIES_CONFIG } from '../data/maps';
import { playTekAlarmSound } from '../utils/audioAlert';

interface ResourceMapsProps {
  onOpenStoreModal?: () => void;
}

export const ResourceMaps: React.FC<ResourceMapsProps> = ({ onOpenStoreModal }) => {
  const [selectedMapId, setSelectedMapId] = useState<string>('the_island');
  const [activeCategories, setActiveCategories] = useState<ResourceCategory[]>([
    'metal', 'obsidian', 'crystal', 'oil', 'pearls', 'polymer', 'element', 'gems_sulfur', 'caves_obelisks', 'nests'
  ]);
  const [selectedNode, setSelectedNode] = useState<ResourceNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cursorGps, setCursorGps] = useState<{ lat: number; lon: number } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'routes'>('map');
  const [mapDisplayMode, setMapDisplayMode] = useState<'overlay' | 'pure'>('overlay');
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);
  const [modalZoom, setModalZoom] = useState<number>(1);
  const [mapZoom, setMapZoom] = useState<number>(1);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Active Map
  const currentMap = useMemo(() => {
    return ARK_MAPS_DATA.find(m => m.id === selectedMapId) || ARK_MAPS_DATA[0];
  }, [selectedMapId]);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return currentMap.nodes.filter(node => {
      // Category filter
      if (!activeCategories.includes(node.category)) return false;

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const coordMatch = `${node.lat.toFixed(1)}, ${node.lon.toFixed(1)}`.includes(q);
      return (
        node.name.toLowerCase().includes(q) ||
        node.biome.toLowerCase().includes(q) ||
        node.bestHarvester.toLowerCase().includes(q) ||
        node.notes.toLowerCase().includes(q) ||
        coordMatch
      );
    });
  }, [currentMap, activeCategories, searchQuery]);

  // Active highlighted node (defaults to first filtered node if none selected)
  const activeNode = selectedNode || filteredNodes[0] || null;

  // Toggle Category
  const toggleCategory = (cat: ResourceCategory) => {
    setActiveCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const selectAllCategories = () => {
    setActiveCategories(RESOURCE_CATEGORIES_CONFIG.map(c => c.id));
  };

  const clearAllCategories = () => {
    setActiveCategories([]);
  };

  // Handle Mouse Move for GPS Tracker (Tracks cursor across topographical map)
  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Lat = Y / height * 100, Lon = X / width * 100
    const lon = Math.max(0, Math.min(100, Math.round((x / rect.width) * 1000) / 10));
    const lat = Math.max(0, Math.min(100, Math.round((y / rect.height) * 1000) / 10));
    setCursorGps({ lat, lon });
  };

  const handleMapMouseLeave = () => {
    setCursorGps(null);
  };

  // Copy GPS
  const copyGpsToClipboard = (node: ResourceNode) => {
    const text = `[ARK GPS: Lat ${node.lat.toFixed(1)}, Lon ${node.lon.toFixed(1)}] ${node.name} (${node.quantity}) - ${currentMap.name}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(node.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  // Map Color config lookup
  const getCatConfig = (cat: ResourceCategory) => {
    return RESOURCE_CATEGORIES_CONFIG.find(c => c.id === cat) || RESOURCE_CATEGORIES_CONFIG[0];
  };

  // Keyboard ESC listener to close map fullscreen modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenOpen) {
        setIsFullscreenOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenOpen]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Resource Map Hub Header */}
      <div className="bg-[#0b1424] border border-cyan-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-tek font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded">
                OFFICIAL ARK ASCENDED GPS DATABASE
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentMap.nodes.length} GPS Waypoints
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-hud text-white tracking-wide mt-1 flex items-center gap-3">
              <span>RESOURCE &amp; TACTICAL MAPS</span>
              <span className="text-cyan-400 text-sm sm:text-base font-normal">
                [{currentMap.name.toUpperCase()}]
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Interactive high-precision GPS resource locator for all major official ARK: Survival Ascended maps. Find rich metal veins, volcanic obsidian, oil pumps, silica pearl rivers, element nodes, artifact caves, and wyvern trenches with exact official coordinates.
            </p>
          </div>

          {/* Controls: Map Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {ARK_MAPS_DATA.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMapId(m.id);
                  setSelectedNode(null);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-hud font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedMapId === m.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/30'
                    : 'bg-[#060c18] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subnav: Map vs Farming Routes */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800/80 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Interactive GPS Canvas</span>
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-hud font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'routes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>PVP Farming Routes ({currentMap.routes.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search node, biome, or Lat/Lon (e.g. 42, 37)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#060c18] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* RESOURCE CATEGORY FILTER BAR */}
      <div className="bg-[#0b1424] border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-tek font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter Resource Waypoints ({filteredNodes.length} Waypoints)</span>
          </span>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <button
              onClick={selectAllCategories}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Show All
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={clearAllCategories}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {RESOURCE_CATEGORIES_CONFIG.map(cat => {
            const count = currentMap.nodes.filter(n => n.category === cat.id).length;
            const isSelected = activeCategories.includes(cat.id);
            if (count === 0) return null; // Don't show categories not on this map

            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-hud transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? `${cat.badgeBg} ${cat.borderClass} font-bold shadow-md`
                    : 'bg-[#060c18] text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.iconColor }}
                />
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'map' ? (
        /* INTERACTIVE MAP LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visual Map Canvas (Col 8) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="bg-[#060c18] border border-cyan-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl relative">
              {/* Live GPS Tracker & View Mode Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono text-slate-300 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                  <span className="text-cyan-300 font-bold uppercase font-hud">
                    {currentMap.displayName}
                  </span>
                  <span className="text-[10px] bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-sans">
                    Cartography by <a href="https://steamcommunity.com/id/3xhumed" target="_blank" rel="noopener noreferrer" className="underline hover:text-white font-bold font-hud">Exhumed</a>
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
                  {cursorGps ? (
                    <span className="text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/40 text-[11px] font-mono shadow-md">
                      GPS: LAT <strong className="text-white">{cursorGps.lat.toFixed(1)}</strong>, LON <strong className="text-white">{cursorGps.lon.toFixed(1)}</strong>
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px] hidden sm:inline">Hover terrain for live GPS</span>
                  )}

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 bg-[#040814] p-0.5 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setMapZoom(prev => Math.max(1, Math.round((prev - 0.5) * 10) / 10))}
                      disabled={mapZoom <= 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded transition-all cursor-pointer disabled:cursor-not-allowed"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono font-bold text-cyan-300 px-1 select-none">
                      {mapZoom.toFixed(1)}x
                    </span>
                    <button
                      onClick={() => setMapZoom(prev => Math.min(3, Math.round((prev + 0.5) * 10) / 10))}
                      disabled={mapZoom >= 3}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded transition-all cursor-pointer disabled:cursor-not-allowed"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    {mapZoom > 1 && (
                      <button
                        onClick={() => setMapZoom(1)}
                        className="p-1 text-slate-400 hover:text-cyan-300 rounded transition-all cursor-pointer"
                        title="Reset Zoom"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* View Mode Toggle (GPS Grid vs Pure Map) */}
                  <div className="flex items-center gap-1 bg-[#040814] p-0.5 rounded-lg border border-slate-800 text-[11px] font-hud">
                    <button
                      onClick={() => setMapDisplayMode('overlay')}
                      className={`px-2 py-1 rounded transition-all cursor-pointer ${
                        mapDisplayMode === 'overlay'
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      GPS GRID
                    </button>
                    <button
                      onClick={() => setMapDisplayMode('pure')}
                      className={`px-2 py-1 rounded transition-all cursor-pointer ${
                        mapDisplayMode === 'pure'
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      PURE MAP
                    </button>
                  </div>

                  {/* Fullscreen / Inspect Button */}
                  <button
                    onClick={() => {
                      setModalZoom(1);
                      setIsFullscreenOpen(true);
                    }}
                    title="Inspect High-Res Map in Fullscreen"
                    className="p-1.5 bg-slate-900/90 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-hud hidden md:inline">INSPECT</span>
                  </button>
                </div>
              </div>

              {/* Map Canvas: Clean Authentic Map Image (No Clickable Stuff) */}
              <div 
                ref={mapContainerRef}
                className="relative w-full aspect-square mt-2 rounded-xl overflow-hidden bg-[#030712] border border-slate-800 select-none cursor-crosshair"
                onMouseMove={handleMapMouseMove}
                onMouseLeave={handleMapMouseLeave}
              >
                <div 
                  className="w-full h-full relative transition-transform duration-100 ease-out"
                  style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center center' }}
                >
                  <img
                    src={currentMap.imageUrl}
                    alt={`Topographical and resource waypoint map for ${currentMap.name} by Exhumed with resource node coordinates`}
                    className="w-full h-full object-cover pointer-events-none"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/images/placeholder_dino.svg')) {
                        target.src = '/images/placeholder_dino.svg';
                      }
                    }}
                  />

                  {/* Optional Non-Clickable GPS Grid Lines and Coordinate Labels Overlay */}
                  {mapDisplayMode === 'overlay' && (
                    <svg
                      viewBox="0 0 1000 1000"
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      <defs>
                        <pattern id="gridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
                          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#06b6d4" strokeWidth="0.75" strokeOpacity="0.35"/>
                        </pattern>
                      </defs>

                      {/* GPS Grid Lines */}
                      <rect width="1000" height="1000" fill="url(#gridPattern)" />

                      {/* GPS Coordinate Labels (10 to 90) */}
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(val => (
                        <g key={val}>
                          {/* Top X axis (Longitude) */}
                          <text x={val * 10} y="22" textAnchor="middle" fill="#06b6d4" fontSize="13" fontFamily="monospace" fontWeight="bold" opacity="0.9" className="select-none drop-shadow">
                            {val}
                          </text>
                          {/* Left Y axis (Latitude) */}
                          <text x="24" y={val * 10 + 4} textAnchor="middle" fill="#06b6d4" fontSize="13" fontFamily="monospace" fontWeight="bold" opacity="0.9" className="select-none drop-shadow">
                            {val}
                          </text>
                        </g>
                      ))}
                    </svg>
                  )}
                </div>
              </div>

              {/* Map Footer Status Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 mt-2 font-mono gap-1">
                <span>Coordinates: LAT (Vertical Y) • LON (Horizontal X)</span>
                <span className="text-cyan-400">Hover terrain for live GPS • Select waypoints below for coordinates</span>
              </div>
            </div>

            {/* Authentic Exhumed Cartography Credit Banner */}
            <div className="bg-[#050e1c] border border-cyan-500/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 border border-cyan-300 flex items-center justify-center text-black font-black font-hud text-base shrink-0 shadow-lg shadow-cyan-500/30">
                  EX
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-tek tracking-widest text-cyan-400 uppercase font-bold">
                      AUTHENTIC ARK CARTOGRAPHY
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-tek">
                      VERIFIED REPLACEMENT
                    </span>
                  </div>
                  <h4 className="text-sm font-bold font-hud text-white mt-0.5">
                    HIGH-ACCURACY TOPOGRAPHICAL MAP BY <strong className="text-cyan-300">EXHUMED</strong>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl font-sans leading-relaxed">
                    Custom high-definition cartography created by <strong>Exhumed</strong>, featuring true-to-game terrain contours, cave entrance waypoints, deep sea loot crates, and obelisk terminals. Replaces inaccurate schematic shapes with verified survivor field cartography.
                  </p>
                </div>
              </div>

              <a
                href="https://steamcommunity.com/id/3xhumed"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-hud font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all shrink-0 cursor-pointer self-start sm:self-auto"
              >
                <span>EXHUMED STEAM PROFILE</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Node Details & Coordinates (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            {activeNode ? (
              /* Active Node Inspector Card */
              <div className="bg-[#0b1424] border-2 border-cyan-500/60 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-tek font-bold px-2 py-0.5 rounded border uppercase ${getCatConfig(activeNode.category).badgeBg} ${getCatConfig(activeNode.category).borderClass}`}>
                      {getCatConfig(activeNode.category).name}
                    </span>
                    <h3 className="text-lg font-bold font-hud text-white mt-1.5 leading-snug">
                      {activeNode.name}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-tek font-bold px-2 py-0.5 rounded-full ${
                    activeNode.dangerLevel === 'Extreme PvP Hotspot' ? 'bg-red-600 text-white' :
                    activeNode.dangerLevel === 'High Danger' ? 'bg-amber-500 text-black' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {activeNode.dangerLevel}
                  </span>
                </div>

                {/* GPS Coordinates Display */}
                <div className="bg-[#060c18] border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-tek text-slate-400 uppercase">OFFICIAL GPS COORDINATES</div>
                    <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">
                      LAT <span className="text-white">{activeNode.lat.toFixed(1)}</span> • LON <span className="text-white">{activeNode.lon.toFixed(1)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyGpsToClipboard(activeNode)}
                    className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-300 text-xs font-hud font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedId === activeNode.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>COPY GPS</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#060c18] border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase">Cluster Yield</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{activeNode.quantity}</span>
                  </div>
                  <div className="bg-[#060c18] border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-500 block uppercase">Region / Biome</span>
                    <span className="font-bold text-cyan-400 mt-0.5 block truncate">{activeNode.biome}</span>
                  </div>
                </div>

                {/* Optimal Mount / Tool */}
                <div className="bg-[#060c18] border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-tek flex items-center gap-1.5">
                    <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
                    <span>RECOMMENDED HARVESTER</span>
                  </div>
                  <div className="text-xs font-bold text-amber-300 mt-1">
                    {activeNode.bestHarvester}
                  </div>
                </div>

                {/* Tactical PvP Notes */}
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-400 uppercase font-tek flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TACTICAL INTEL &amp; PVP PROTOCOL</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {activeNode.notes}
                  </p>
                </div>
              </div>
            ) : (
              /* Empty Selection State */
              <div className="bg-[#0b1424] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold font-hud text-white">WAYPOINTS DIRECTORY</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select any resource from the directory below to view exact official GPS coordinates, cluster density, recommended farming mounts, and tactical PvP precautions.
                </p>
              </div>
            )}

            {/* Quick Node List of Selected Map */}
            <div className="bg-[#0b1424] border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-tek text-slate-300 uppercase tracking-wider font-bold">
                  WAYPOINTS DIRECTORY ({filteredNodes.length})
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">LAT / LON</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
                {filteredNodes.map(node => {
                  const cfg = getCatConfig(node.category);
                  const isSelected = activeNode?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-md'
                          : 'bg-[#060c18] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cfg.iconColor }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {node.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {node.quantity} • {node.biome}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-cyan-300 block">
                          {node.lat.toFixed(1)}, {node.lon.toFixed(1)}
                        </span>
                        <span className="text-[9px] text-slate-500 font-tek uppercase">
                          {node.dangerLevel === 'Extreme PvP Hotspot' ? 'HOTSPOT' : 'SAFE'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FARMING ROUTES VIEW */
        <div className="space-y-4">
          <div className="bg-[#0b1424] border border-cyan-500/20 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-tek text-cyan-400 font-bold uppercase tracking-wider">
                TRIBE RUN PROTOCOLS • {currentMap.name.toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-bold font-hud text-white">
              OPTIMIZED PVP FARMING CIRCUITS
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              These pre-tested route loops maximize resource yield per minute while minimizing exposure to enemy flak snipers, turret towers, and hostile alpha dinos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentMap.routes.map(route => (
              <div
                key={route.id}
                className="bg-[#0b1424] border border-slate-800 hover:border-cyan-500/50 transition-all rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-[10px] font-tek font-bold uppercase">
                      {route.primaryResource}
                    </span>
                  </div>

                  <h4 className="text-base font-bold font-hud text-white">
                    {route.title}
                  </h4>

                  {/* Waypoints */}
                  <div className="bg-[#060c18] border border-slate-800 p-2.5 rounded-xl font-mono text-xs text-cyan-300">
                    <span className="text-[10px] text-slate-500 block font-tek uppercase">GPS Waypoint Path</span>
                    {route.gpsWaypoints}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {route.description}
                  </p>

                  {/* Recommended Mount */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Mount:</span>
                    <strong className="text-amber-300 font-hud">{route.recommendedMount}</strong>
                  </div>
                </div>

                {/* Safety Tip */}
                <div className="bg-red-950/30 border border-red-500/30 p-2.5 rounded-xl text-xs text-red-200">
                  <strong className="text-red-400 font-tek uppercase block">PVP SAFETY WARNING:</strong>
                  {route.safetyTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULLSCREEN / HIGH-RESOLUTION CARTOGRAPHY MODAL */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold font-hud">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold font-hud text-white">
                    {currentMap.name.toUpperCase()} • HIGH-RESOLUTION TOPOGRAPHY
                  </h3>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded font-tek font-bold">
                    BY EXHUMED
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Detailed topographical chart with exact land contours, rivers, and landmarks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-mono">
                <button
                  onClick={() => setModalZoom(prev => Math.max(0.6, prev - 0.25))}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-cyan-300 min-w-[50px] text-center">
                  {Math.round(modalZoom * 100)}%
                </span>
                <button
                  onClick={() => setModalZoom(prev => Math.min(3, prev + 0.25))}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setModalZoom(1)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Steam Profile Link */}
              <a
                href="https://steamcommunity.com/id/3xhumed"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 text-xs font-hud font-bold text-cyan-300 rounded-xl transition-all cursor-pointer"
              >
                <span>EXHUMED STEAM</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Close Button */}
              <button
                onClick={() => setIsFullscreenOpen(false)}
                className="p-2 bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-300 rounded-xl transition-all cursor-pointer"
                title="Close Fullscreen View"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Scrollable Zoomable Image Canvas */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 my-2 bg-[#02050c] rounded-2xl border border-slate-900">
            <div 
              className="transition-transform duration-150 ease-out origin-center select-none"
              style={{ transform: `scale(${modalZoom})` }}
            >
              <img
                src={currentMap.imageUrl}
                alt={`Full-resolution enlarged overview map of ${currentMap.name} by Exhumed showing terrain and coordinates`}
                className="max-h-[82vh] max-w-[82vw] object-contain rounded-lg shadow-2xl border border-slate-800"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/images/placeholder_dino.svg')) {
                    target.src = '/images/placeholder_dino.svg';
                  }
                }}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 shrink-0 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-hud font-bold text-white">CREDIT:</span>
              <span>Map created by <strong className="text-cyan-300">Exhumed</strong></span>
              <span className="text-slate-600">•</span>
              <a
                href="https://steamcommunity.com/id/3xhumed"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                steamcommunity.com/id/3xhumed
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Scroll or use zoom controls to inspect mountain passes, deep valleys, and loot coordinates
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
