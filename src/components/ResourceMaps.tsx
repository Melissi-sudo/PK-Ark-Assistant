import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Layers, 
  Navigation, 
  ExternalLink, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  X, 
  Move, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { ArkMapInfo } from '../types';
import { ARK_MAPS_DATA } from '../data/maps';
import { TekImage } from './common/TekImage';

// Native aspect ratios of the official cartography images
const MAP_ASPECT_RATIOS: Record<string, string> = {
  the_island: '2028 / 1434',
  the_center: '1024 / 1024',
  scorched_earth: '1400 / 1024',
  aberration: '1024 / 873',
  extinction: '1400 / 1024',
};

interface ResourceMapsProps {
  onOpenStoreModal?: () => void;
}

export const ResourceMaps: React.FC<ResourceMapsProps> = () => {
  const { mapId: paramMapId } = useParams<{ mapId?: string }>();
  const [searchParams] = useSearchParams();
  const queryMapId = searchParams.get('map');
  const navigate = useNavigate();

  const activeParamMap = paramMapId || queryMapId;
  const initialMapId = (activeParamMap && ARK_MAPS_DATA.some(m => m.id === activeParamMap))
    ? activeParamMap
    : 'the_island';

  const [selectedMapId, setSelectedMapId] = useState<string>(initialMapId);
  const [activeTab, setActiveTab] = useState<'map' | 'routes'>('map');
  const [fitMode, setFitMode] = useState<'fit' | 'fill'>('fit');

  // Interactive Pan & Zoom State for Main Canvas
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapPan, setMapPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchPinchRef = useRef<{ initialDist: number; initialZoom: number } | null>(null);

  // Fullscreen Inspect Modal State
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);
  const [modalZoom, setModalZoom] = useState<number>(1);
  const [modalPan, setModalPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isModalDragging, setIsModalDragging] = useState<boolean>(false);
  const modalDragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const modalTouchPinchRef = useRef<{ initialDist: number; initialZoom: number } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapImageRef = useRef<HTMLImageElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const modalImageRef = useRef<HTMLImageElement | null>(null);

  // Sync if URL param changes
  useEffect(() => {
    if (activeParamMap && ARK_MAPS_DATA.some(m => m.id === activeParamMap) && activeParamMap !== selectedMapId) {
      setSelectedMapId(activeParamMap);
      setMapZoom(1);
      setMapPan({ x: 0, y: 0 });
      setModalZoom(1);
      setModalPan({ x: 0, y: 0 });
    }
  }, [activeParamMap]);

  const handleSelectMap = (mapId: string) => {
    setSelectedMapId(mapId);
    navigate(`/maps/${mapId}`, { replace: true });
    setMapZoom(1);
    setMapPan({ x: 0, y: 0 });
    setModalZoom(1);
    setModalPan({ x: 0, y: 0 });
  };

  // Active Map Data
  const currentMap: ArkMapInfo = useMemo(() => {
    return ARK_MAPS_DATA.find(m => m.id === selectedMapId) || ARK_MAPS_DATA[0];
  }, [selectedMapId]);

  // Zoom and Pan Controls
  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(5, Math.round((prev + 0.5) * 10) / 10));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => {
      const next = Math.max(0.75, Math.round((prev - 0.5) * 10) / 10);
      if (next <= 1) setMapPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetView = () => {
    setMapZoom(1);
    setMapPan({ x: 0, y: 0 });
  };

  const handleNudgePan = (dx: number, dy: number) => {
    setMapPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  // Mouse Handlers for Main Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary left click
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - mapPan.x,
      y: e.clientY - mapPan.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      setMapPan({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (mapZoom > 1.2) {
      handleResetView();
    } else {
      setMapZoom(2);
    }
  };

  // Touch Handlers for Mobile Phones & Tablets
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - mapPan.x,
        y: e.touches[0].clientY - mapPan.y
      };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchPinchRef.current = {
        initialDist: dist,
        initialZoom: mapZoom
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const newX = e.touches[0].clientX - dragStartRef.current.x;
      const newY = e.touches[0].clientY - dragStartRef.current.y;
      setMapPan({ x: newX, y: newY });
    } else if (e.touches.length === 2 && touchPinchRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchPinchRef.current.initialDist > 0) {
        const scale = dist / touchPinchRef.current.initialDist;
        const nextZoom = Math.max(0.75, Math.min(5, Math.round(touchPinchRef.current.initialZoom * scale * 100) / 100));
        setMapZoom(nextZoom);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchPinchRef.current = null;
  };

  // Mouse wheel zoom for canvas
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      setMapZoom(prev => {
        const next = Math.max(0.75, Math.min(5, Math.round(prev * zoomFactor * 100) / 100));
        if (next <= 1 && prev > 1) {
          setMapPan({ x: 0, y: 0 });
        }
        return next;
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // Modal Handlers
  const handleModalMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsModalDragging(true);
    modalDragStartRef.current = {
      x: e.clientX - modalPan.x,
      y: e.clientY - modalPan.y
    };
  };

  const handleModalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModalDragging) {
      const newX = e.clientX - modalDragStartRef.current.x;
      const newY = e.clientY - modalDragStartRef.current.y;
      setModalPan({ x: newX, y: newY });
    }
  };

  const handleModalMouseUp = () => {
    setIsModalDragging(false);
  };

  const handleModalTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsModalDragging(true);
      modalDragStartRef.current = {
        x: e.touches[0].clientX - modalPan.x,
        y: e.touches[0].clientY - modalPan.y
      };
    } else if (e.touches.length === 2) {
      setIsModalDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      modalTouchPinchRef.current = {
        initialDist: dist,
        initialZoom: modalZoom
      };
    }
  };

  const handleModalTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isModalDragging) {
      const newX = e.touches[0].clientX - modalDragStartRef.current.x;
      const newY = e.touches[0].clientY - modalDragStartRef.current.y;
      setModalPan({ x: newX, y: newY });
    } else if (e.touches.length === 2 && modalTouchPinchRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (modalTouchPinchRef.current.initialDist > 0) {
        const scale = dist / modalTouchPinchRef.current.initialDist;
        const nextZoom = Math.max(0.6, Math.min(5, Math.round(modalTouchPinchRef.current.initialZoom * scale * 100) / 100));
        setModalZoom(nextZoom);
      }
    }
  };

  const handleModalTouchEnd = () => {
    setIsModalDragging(false);
    modalTouchPinchRef.current = null;
  };

  useEffect(() => {
    if (!isFullscreenOpen) return;
    const container = modalContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      setModalZoom(prev => Math.max(0.6, Math.min(5, Math.round(prev * zoomFactor * 100) / 100)));
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [isFullscreenOpen]);

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
                OFFICIAL ARK ASCENDED CARTOGRAPHY
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                High-Resolution Topography
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-hud text-white tracking-wide mt-1 flex items-center gap-3">
              <span>TACTICAL RESOURCE MAPS</span>
              <span className="text-cyan-400 text-sm sm:text-base font-normal">
                [{currentMap.name.toUpperCase()}]
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              High-definition topographical and resource cartography for official ARK: Survival Ascended maps. Freely pan around the terrain, inspect mountain passes, deep oceans, and cave regions with smooth drag and zoom navigation.
            </p>
          </div>

          {/* Controls: Map Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {ARK_MAPS_DATA.map(m => (
              <button
                key={m.id}
                onClick={() => handleSelectMap(m.id)}
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
              <span>Interactive Map Canvas</span>
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
        </div>
      </div>

      {activeTab === 'map' ? (
        /* FULL-WIDTH INTERACTIVE MAP VIEW */
        <div className="space-y-4">
          <div className="bg-[#060c18] border border-cyan-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl relative">
            {/* View Mode Header & Navigation Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 text-xs font-mono text-slate-300 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 font-bold uppercase font-hud text-sm">
                  {currentMap.displayName}
                </span>
                <span className="text-[10px] bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-sans">
                  Cartography by <a href="https://steamcommunity.com/id/3xhumed" target="_blank" rel="noopener noreferrer" className="underline hover:text-white font-bold font-hud">Exhumed</a>
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
                {/* Fit Mode Toggle */}
                <div className="flex items-center gap-1 bg-[#040814] p-0.5 rounded-lg border border-slate-800 text-[11px] font-hud">
                  <button
                    onClick={() => setFitMode('fit')}
                    className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                      fitMode === 'fit'
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Fit entire map in frame without cropping"
                  >
                    FIT MAP
                  </button>
                  <button
                    onClick={() => setFitMode('fill')}
                    className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                      fitMode === 'fill'
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Fill container"
                  >
                    FILL
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-[#040814] p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={handleZoomOut}
                    disabled={mapZoom <= 0.75}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-cyan-300 px-1.5 select-none min-w-[42px] text-center">
                    {Math.round(mapZoom * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={mapZoom >= 5}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded transition-all cursor-pointer disabled:cursor-not-allowed"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {(mapZoom !== 1 || mapPan.x !== 0 || mapPan.y !== 0) && (
                    <button
                      onClick={handleResetView}
                      className="p-1 text-slate-400 hover:text-cyan-300 rounded transition-all cursor-pointer"
                      title="Reset Pan & Zoom"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Fullscreen / Inspect Button */}
                <button
                  onClick={() => {
                    setModalZoom(1);
                    setModalPan({ x: 0, y: 0 });
                    setIsFullscreenOpen(true);
                  }}
                  title="Inspect High-Res Map in Fullscreen"
                  className="p-1.5 px-2.5 bg-slate-900/90 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 font-hud font-bold"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>INSPECT HIGH-RES</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Map Viewport (Full Width, NO Grid Overlay, NO Inaccurate Coordinates) */}
            <div 
              ref={mapContainerRef}
              className={`relative w-full h-[520px] sm:h-[650px] md:h-[760px] mt-3 rounded-2xl overflow-hidden bg-[#02050c] border border-cyan-500/30 select-none shadow-2xl transition-colors ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleClick}
              style={{ touchAction: 'none' }}
            >
              {/* Tactical Radar Dot Background Grid */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #06b6d4 1.2px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Transformed Map Frame */}
              <div 
                className="w-full h-full flex items-center justify-center pointer-events-none"
                style={{
                  transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                <div 
                  className="relative pointer-events-auto max-w-full max-h-full flex items-center justify-center"
                  style={{
                    aspectRatio: MAP_ASPECT_RATIOS[currentMap.id] || '1.4 / 1',
                    width: fitMode === 'fill' ? '100%' : 'auto',
                    height: fitMode === 'fill' ? '100%' : 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                >
                  <TekImage
                    ref={mapImageRef}
                    src={currentMap.imageUrl}
                    alt={`Authentic topographical map for ${currentMap.name} by Exhumed`}
                    variant="map"
                    loadingLabel={`DECODING ${currentMap.name.toUpperCase()} TOPOGRAPHY...`}
                    containerClassName="w-full h-full rounded-lg"
                    className={`w-full h-full ${fitMode === 'fit' ? 'object-contain' : 'object-cover'} rounded-lg shadow-2xl drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)] pointer-events-none`}
                  />
                </div>
              </div>

              {/* Floating Navigation D-Pad (Bottom-Right) */}
              <div className="absolute bottom-3 right-3 z-20 flex flex-col items-center gap-1 bg-[#050c18]/90 backdrop-blur-md border border-cyan-500/40 p-1.5 sm:p-2 rounded-2xl shadow-2xl">
                <div className="text-[8px] sm:text-[9px] font-tek font-bold text-cyan-300 uppercase tracking-widest text-center">
                  PAN MAP
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNudgePan(0, 80); }}
                    className="p-1 sm:p-1.5 bg-slate-900 hover:bg-cyan-950 text-cyan-300 rounded-lg border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <div />

                  <button
                    onClick={(e) => { e.stopPropagation(); handleNudgePan(80, 0); }}
                    className="p-1 sm:p-1.5 bg-slate-900 hover:bg-cyan-950 text-cyan-300 rounded-lg border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleResetView(); }}
                    className="p-1 sm:p-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg border border-cyan-500/50 transition-all cursor-pointer"
                    title="Recenter & Reset"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleNudgePan(-80, 0); }}
                    className="p-1 sm:p-1.5 bg-slate-900 hover:bg-cyan-950 text-cyan-300 rounded-lg border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>

                  <div />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNudgePan(0, -80); }}
                    className="p-1 sm:p-1.5 bg-slate-900 hover:bg-cyan-950 text-cyan-300 rounded-lg border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <div />
                </div>
              </div>

              {/* Quick Zoom Presets Floating Toolbar (Bottom-Left) */}
              <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 sm:gap-1.5 bg-[#050c18]/90 backdrop-blur-md border border-cyan-500/40 px-2 py-1.5 rounded-xl shadow-xl">
                <button
                  onClick={(e) => { e.stopPropagation(); handleResetView(); }}
                  className={`px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-hud font-bold transition-all cursor-pointer ${
                    mapZoom === 1 && mapPan.x === 0 && mapPan.y === 0
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'text-slate-300 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  FIT
                </button>
                {[1.5, 2, 3, 4].map(z => (
                  <button
                    key={z}
                    onClick={(e) => { e.stopPropagation(); setMapZoom(z); }}
                    className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      mapZoom === z
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'text-slate-300 hover:text-white bg-slate-900 border border-slate-800'
                    }`}
                  >
                    {z}x
                  </button>
                ))}
              </div>

              {/* Navigation Hint Pill (Top-Center) */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-85">
                <div className="bg-[#050e1c]/90 backdrop-blur-md border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-300 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <Move className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Drag to pan • Scroll/Pinch to zoom • Double click 2x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cartography Credit Banner */}
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
                    HIGH-RESOLUTION
                  </span>
                </div>
                <h4 className="text-sm font-bold font-hud text-white mt-0.5">
                  TOPOGRAPHICAL CHART BY <strong className="text-cyan-300">EXHUMED</strong>
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl font-sans leading-relaxed">
                  Authentic cartography created by <strong>Exhumed</strong>, featuring high-fidelity terrain contours, river deltas, deep sea trenches, and mountain passes directly embedded into the map.
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

                  {/* Waypoints Path Description */}
                  <div className="bg-[#060c18] border border-slate-800 p-2.5 rounded-xl font-mono text-xs text-cyan-300">
                    <span className="text-[10px] text-slate-500 block font-tek uppercase">Farming Circuit Path</span>
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
                  onClick={() => setModalZoom(prev => Math.max(0.6, Math.round((prev - 0.25) * 100) / 100))}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-cyan-300 min-w-[50px] text-center select-none">
                  {Math.round(modalZoom * 100)}%
                </span>
                <button
                  onClick={() => setModalZoom(prev => Math.min(5, Math.round((prev + 0.25) * 100) / 100))}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setModalZoom(1);
                    setModalPan({ x: 0, y: 0 });
                  }}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="Reset Pan & Zoom"
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
                title="Close Fullscreen View (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Interactive Zoomable and Pannable Canvas */}
          <div 
            ref={modalContainerRef}
            className={`flex-1 overflow-hidden relative flex items-center justify-center p-2 sm:p-6 my-2 bg-[#02050c] rounded-2xl border border-slate-900 select-none ${
              isModalDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={handleModalMouseDown}
            onMouseMove={handleModalMouseMove}
            onMouseUp={handleModalMouseUp}
            onMouseLeave={handleModalMouseUp}
            onTouchStart={handleModalTouchStart}
            onTouchMove={handleModalTouchMove}
            onTouchEnd={handleModalTouchEnd}
            style={{ touchAction: 'none' }}
          >
            {/* Background Radar Grid */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #06b6d4 1.2px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            />

            <div 
              className="pointer-events-none flex items-center justify-center max-w-full max-h-full"
              style={{
                transform: `translate(${modalPan.x}px, ${modalPan.y}px) scale(${modalZoom})`,
                transformOrigin: 'center center',
                transition: isModalDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <TekImage
                ref={modalImageRef}
                src={currentMap.imageUrl}
                alt={`Full-resolution enlarged overview map of ${currentMap.name} by Exhumed showing terrain`}
                variant="map"
                loadingLabel={`TRANSMITTING HIGH-RES ${currentMap.name.toUpperCase()} TOPOGRAPHY...`}
                containerClassName="max-h-[85vh] max-w-[90vw] rounded-lg"
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-slate-800 pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Modal Instruction Floating Pill */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-80">
              <div className="bg-[#050e1c]/90 backdrop-blur-md border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-300 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <Move className="w-3 h-3 text-cyan-400" />
                <span>Drag to pan • Scroll/Pinch to zoom • Click Reset (↺) to center</span>
              </div>
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
              Scroll or use zoom controls to inspect mountain passes, deep valleys, and resource regions
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
