import React, { useState, useEffect, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Palette, 
  Plus, 
  Trash2, 
  Terminal, 
  Sliders, 
  Eye, 
  HelpCircle,
  Flame,
  Info,
  AlertTriangle
} from 'lucide-react';
import { 
  TextEffectOptions, 
  generateGradientColors, 
  groupFormattedCharacters, 
  exportToJavaTellraw, 
  exportToJavaSignGiveCommand, 
  exportToJavaLegacySignGiveCommand,
  exportToJavaSetblockSignCommand, 
  exportToJavaDataMergeSignCommand,
  exportToSectionSigns, 
  exportToBedrockTellraw, 
  exportToMiniMessage, 
  GRADIENT_PRESETS, 
  MINECRAFT_CLASSIC_COLORS, 
  WOOD_TYPES,
  CharacterColor 
} from '../../utils/minecraftColorUtils';

// Obfuscated glitch text character set
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export const MinecraftTextColorGenerator: React.FC = () => {
  // Mode: 'command' or 'sign' (Command block gradient is fully active; sign generator is in development)
  const [generatorMode, setGeneratorMode] = useState<'sign' | 'command'>('command');

  // Sign State (4 lines)
  const [signLines, setSignLines] = useState<string[]>([
    'Welcome to',
    'PK Ultimate Guide',
    'Minecraft Hub',
    '[Click to Enter]'
  ]);
  const [selectedWood, setSelectedWood] = useState<string>('oak');
  const [isHangingSign, setIsHangingSign] = useState<boolean>(false);
  const [isWaxed, setIsWaxed] = useState<boolean>(true);
  const [isGlowing, setIsGlowing] = useState<boolean>(true);

  // Command State (Single text block)
  const [commandText, setCommandText] = useState<string>('PK Ultimate Guide :: High-Performance Minecraft Gradients');

  // Color Stops for Gradient
  const [colorStops, setColorStops] = useState<string[]>(['#ff512f', '#dd2476']);
  const [colorMode, setColorMode] = useState<'gradient' | 'solid'>('gradient');
  const [solidColor, setSolidColor] = useState<string>('#55ffff');

  // Text Effects
  const [effects, setEffects] = useState<TextEffectOptions>({
    bold: true,
    italic: false,
    underlined: false,
    strikethrough: false,
    obfuscated: false
  });

  // Copied alert state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Obfuscated random tick string for live glitch animation
  const [glitchTick, setGlitchTick] = useState<number>(0);

  useEffect(() => {
    if (!effects.obfuscated) return;
    const interval = setInterval(() => {
      setGlitchTick(prev => (prev + 1) % 1000);
    }, 80);
    return () => clearInterval(interval);
  }, [effects.obfuscated]);

  const activeStops = useMemo(() => {
    return colorMode === 'solid' ? [solidColor] : colorStops;
  }, [colorMode, solidColor, colorStops]);

  // Compute character colors for sign lines
  const computedSignLines = useMemo(() => {
    return signLines.map(line => generateGradientColors(line, activeStops, effects));
  }, [signLines, activeStops, effects]);

  // Compute character colors for command text
  const computedCommandChars = useMemo(() => {
    return generateGradientColors(commandText, activeStops, effects);
  }, [commandText, activeStops, effects]);

  // Copy helper
  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Add / remove / update gradient stops
  const handleAddStop = () => {
    if (colorStops.length >= 6) return;
    const lastColor = colorStops[colorStops.length - 1] || '#ffffff';
    setColorStops([...colorStops, lastColor]);
  };

  const handleRemoveStop = (index: number) => {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter((_, i) => i !== index));
  };

  const handleUpdateStop = (index: number, newHex: string) => {
    const updated = [...colorStops];
    updated[index] = newHex;
    setColorStops(updated);
  };

  // Current wood config
  const currentWood = WOOD_TYPES.find(w => w.id === selectedWood) || WOOD_TYPES[0];

  // Render character with live glitch if obfuscated
  const renderChar = (c: CharacterColor, charIdx: number) => {
    const displayChar = c.obfuscated && c.char.trim()
      ? GLITCH_CHARS[(glitchTick + charIdx * 7) % GLITCH_CHARS.length]
      : c.char;

    const style: React.CSSProperties = {
      color: c.hex,
      fontWeight: c.bold ? 'bold' : 'normal',
      fontStyle: c.italic ? 'italic' : 'normal',
      textDecoration: [
        c.underlined ? 'underline' : '',
        c.strikethrough ? 'line-through' : ''
      ].filter(Boolean).join(' ') || undefined,
      textShadow: isGlowing
        ? `0 0 8px ${c.hex}, 2px 2px 0px rgba(0,0,0,0.85)`
        : '2px 2px 0px rgba(0,0,0,0.85)'
    };

    return (
      <span key={charIdx} style={style}>
        {displayChar}
      </span>
    );
  };

  // Exports for Signs
  const signSegmentLines = useMemo(() => {
    return computedSignLines.map(chars => groupFormattedCharacters(chars));
  }, [computedSignLines]);

  const javaSignGiveCmd = useMemo(() => {
    return exportToJavaSignGiveCommand(signSegmentLines, selectedWood, isHangingSign, isWaxed, isGlowing);
  }, [signSegmentLines, selectedWood, isHangingSign, isWaxed, isGlowing]);

  const javaSignLegacyGiveCmd = useMemo(() => {
    return exportToJavaLegacySignGiveCommand(signSegmentLines, selectedWood, isHangingSign, isWaxed, isGlowing);
  }, [signSegmentLines, selectedWood, isHangingSign, isWaxed, isGlowing]);

  const javaSignSetblockCmd = useMemo(() => {
    return exportToJavaSetblockSignCommand(signSegmentLines, selectedWood, isHangingSign, isWaxed, isGlowing);
  }, [signSegmentLines, selectedWood, isHangingSign, isWaxed, isGlowing]);

  const javaSignDataMergeCmd = useMemo(() => {
    return exportToJavaDataMergeSignCommand(signSegmentLines, isWaxed, isGlowing);
  }, [signSegmentLines, isWaxed, isGlowing]);

  const bedrockSignLines = useMemo(() => {
    return signLines.map((_, idx) => {
      const chars = computedSignLines[idx] || [];
      return exportToSectionSigns(chars);
    });
  }, [signLines, computedSignLines]);

  const bedrockSignRawText = useMemo(() => {
    return bedrockSignLines.join('\n');
  }, [bedrockSignLines]);

  // Exports for Command Blocks / Chat
  const commandSegments = useMemo(() => {
    return groupFormattedCharacters(computedCommandChars);
  }, [computedCommandChars]);

  const javaTellrawCmd = useMemo(() => {
    const jsonArr = exportToJavaTellraw(commandSegments);
    return `/tellraw @a ${jsonArr}`;
  }, [commandSegments]);

  const javaTitleCmd = useMemo(() => {
    const jsonArr = exportToJavaTellraw(commandSegments);
    return `/title @a title ${jsonArr}`;
  }, [commandSegments]);

  const javaActionbarCmd = useMemo(() => {
    const jsonArr = exportToJavaTellraw(commandSegments);
    return `/title @a actionbar ${jsonArr}`;
  }, [commandSegments]);

  const bedrockTellrawCmd = useMemo(() => {
    return exportToBedrockTellraw(computedCommandChars);
  }, [computedCommandChars]);

  const miniMessageOutput = useMemo(() => {
    return exportToMiniMessage(
      generatorMode === 'sign' ? signLines.join(' | ') : commandText,
      activeStops,
      effects
    );
  }, [generatorMode, signLines, commandText, activeStops, effects]);

  return (
    <div className="font-mojangles space-y-6">
      {/* Top Banner */}
      <div className="mc-panel-dirt border-4 border-[#0e0a07] shadow-2xl overflow-hidden">
        <div className="mc-grass-header px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-[#2b4414]">
          <div>
            <div className="flex items-center gap-2 text-yellow-300 text-xs uppercase drop-shadow-[1px_1px_0px_#1e2f0d]">
              <span>Minecraft 1.20.5+ · 1.21+ · 26.3 Compatible</span>
              <span>·</span>
              <span className="text-emerald-300">Java & Bedrock Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide drop-shadow-[2px_2px_0px_#1e2f0d] mt-0.5">
              Minecraft Text Color & Gradient Generator
            </h1>
            <p className="text-xs text-[#ccebb0] max-w-2xl mt-1 leading-relaxed drop-shadow-[1px_1px_0px_#1e2f0d]">
              Generate multi-stop hex gradients and format codes for in-game Signs, Command Blocks (/tellraw, /title), and item names.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#1a2b0d] p-1 border-2 border-[#41681a]">
            <button
              onClick={() => setGeneratorMode('command')}
              className={`px-3 py-1.5 text-xs uppercase cursor-pointer transition-colors flex items-center gap-1.5 ${
                generatorMode === 'command'
                  ? 'bg-[#5b8731] text-yellow-300 font-bold border border-[#7cb342]'
                  : 'text-[#ccebb0] hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Command Block & Chat</span>
            </button>
            <button
              onClick={() => setGeneratorMode('sign')}
              className={`px-3 py-1.5 text-xs uppercase cursor-pointer transition-colors flex items-center gap-1.5 ${
                generatorMode === 'sign'
                  ? 'bg-[#5b8731] text-yellow-300 font-bold border border-[#7cb342]'
                  : 'text-[#ccebb0] hover:text-white'
              }`}
            >
              <span>Sign Generator</span>
              <span className="text-[9px] px-1 py-0.5 bg-amber-950 text-amber-300 border border-amber-600/50 font-mono font-bold">
                IN DEV
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Status Banners */}
      {generatorMode === 'sign' ? (
        /* Sign Generator Under Maintenance Notice */
        <div className="p-4 bg-[#2b1808] border-4 border-[#ffaa00] text-[#ffe2a8] shadow-2xl flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-[#5e3810] border border-yellow-500 text-yellow-300 text-[10px] font-bold uppercase tracking-wider">
                IN ACTIVE DEVELOPMENT
              </span>
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">
                Sign Generator Under Maintenance
              </span>
            </div>
            <p className="text-xs text-[#ffe2a8] leading-relaxed">
              Please note: The in-game Sign text generator is currently in active development to update sign NBT block states for newer Minecraft versions. It will start working in a while. In the meantime, the <strong>Command Block (/tellraw & /title) Gradient Text Generator</strong> is fully operational — switch back via the button above!
            </p>
          </div>
        </div>
      ) : (
        /* Command Block Generator Active Confirmation */
        <div className="p-3 bg-[#11240c] border-2 border-[#5b8731] text-[#ccebb0] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-bold uppercase text-emerald-300">
              Command Block Gradient Serializer: Fully Operational
            </span>
            <span className="text-xs text-[#a0c885] hidden md:inline">
              — Multi-stop hex gradients for /tellraw, /title, /actionbar & MiniMessage.
            </span>
          </div>
          <span className="text-[10px] text-yellow-300/80 font-mono">
            Note: Sign generator tab is currently in development
          </span>
        </div>
      )}

      {/* Main Grid: Controls (Left) & Live Previews / Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Text Inputs & Color Palette */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Text Editing */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="flex items-center justify-between border-b-2 border-[#332216] pb-2">
              <span className="text-xs uppercase text-yellow-300 tracking-wider">
                {generatorMode === 'sign' ? 'Sign Text Lines (1-4)' : 'Command Text Input'}
              </span>
              <button
                onClick={() => {
                  if (generatorMode === 'sign') {
                    setSignLines(['Line 1', 'Line 2', 'Line 3', 'Line 4']);
                  } else {
                    setCommandText('Your Custom Gradient Text Here');
                  }
                }}
                className="text-[11px] text-[#9c8979] hover:text-yellow-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Sign Mode Inputs */}
            {generatorMode === 'sign' ? (
              <div className="space-y-2.5">
                {[0, 1, 2, 3].map((lineIndex) => (
                  <div key={lineIndex} className="flex items-center gap-2">
                    <span className="w-12 text-right text-[11px] text-[#9c8979] uppercase">
                      Line {lineIndex + 1}:
                    </span>
                    <input
                      type="text"
                      maxLength={32}
                      value={signLines[lineIndex] || ''}
                      onChange={(e) => {
                        const updated = [...signLines];
                        updated[lineIndex] = e.target.value;
                        setSignLines(updated);
                      }}
                      placeholder={`Sign text line ${lineIndex + 1}`}
                      className="flex-1 bg-[#100b08] border-2 border-[#382618] focus:border-[#7cb342] px-3 py-1.5 text-xs text-white placeholder-[#5a4433] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <textarea
                  rows={4}
                  value={commandText}
                  onChange={(e) => setCommandText(e.target.value)}
                  placeholder="Enter text to format for /tellraw, /title, or command blocks..."
                  className="w-full bg-[#100b08] border-2 border-[#382618] focus:border-[#7cb342] p-3 text-xs text-white placeholder-[#5a4433] focus:outline-none resize-y"
                />
              </div>
            )}

            {/* Text Effect Toggles */}
            <div className="pt-2 border-t-2 border-[#332216]">
              <span className="text-[11px] uppercase text-[#9c8979] block mb-2">
                Formatting & Visual Effects:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setEffects({ ...effects, bold: !effects.bold })}
                  className={`px-3 py-1.5 border-2 cursor-pointer font-bold ${
                    effects.bold
                      ? 'bg-[#3b591b] border-[#7cb342] text-yellow-300'
                      : 'bg-[#291c13] border-[#442f20] text-[#a1907f] hover:text-white'
                  }`}
                  title="Bold (§l / bold: true)"
                >
                  B Bold
                </button>

                <button
                  onClick={() => setEffects({ ...effects, italic: !effects.italic })}
                  className={`px-3 py-1.5 border-2 cursor-pointer italic ${
                    effects.italic
                      ? 'bg-[#3b591b] border-[#7cb342] text-yellow-300'
                      : 'bg-[#291c13] border-[#442f20] text-[#a1907f] hover:text-white'
                  }`}
                  title="Italic (§o / italic: true)"
                >
                  I Italic
                </button>

                <button
                  onClick={() => setEffects({ ...effects, underlined: !effects.underlined })}
                  className={`px-3 py-1.5 border-2 cursor-pointer underline ${
                    effects.underlined
                      ? 'bg-[#3b591b] border-[#7cb342] text-yellow-300'
                      : 'bg-[#291c13] border-[#442f20] text-[#a1907f] hover:text-white'
                  }`}
                  title="Underline (§n / underlined: true)"
                >
                  U Underline
                </button>

                <button
                  onClick={() => setEffects({ ...effects, strikethrough: !effects.strikethrough })}
                  className={`px-3 py-1.5 border-2 cursor-pointer line-through ${
                    effects.strikethrough
                      ? 'bg-[#3b591b] border-[#7cb342] text-yellow-300'
                      : 'bg-[#291c13] border-[#442f20] text-[#a1907f] hover:text-white'
                  }`}
                  title="Strikethrough (§m / strikethrough: true)"
                >
                  S Strike
                </button>

                <button
                  onClick={() => setEffects({ ...effects, obfuscated: !effects.obfuscated })}
                  className={`px-3 py-1.5 border-2 cursor-pointer ${
                    effects.obfuscated
                      ? 'bg-[#591b3b] border-[#e91e63] text-pink-300 animate-pulse'
                      : 'bg-[#291c13] border-[#442f20] text-[#a1907f] hover:text-white'
                  }`}
                  title="Obfuscated Magic Glitch (§k / obfuscated: true)"
                >
                  §k Magic Glitch
                </button>
              </div>
            </div>
          </div>

          {/* Card: Gradient & Color Studio */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="flex items-center justify-between border-b-2 border-[#332216] pb-2">
              <span className="text-xs uppercase text-yellow-300 tracking-wider">
                Color Gradient Engine
              </span>

              {/* Mode switch: gradient or solid */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setColorMode('gradient')}
                  className={`px-2 py-0.5 border cursor-pointer ${
                    colorMode === 'gradient'
                      ? 'bg-[#4a7522] border-[#7cb342] text-white font-bold'
                      : 'bg-[#120d09] border-[#291c13] text-[#8e7c6d]'
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => setColorMode('solid')}
                  className={`px-2 py-0.5 border cursor-pointer ${
                    colorMode === 'solid'
                      ? 'bg-[#4a7522] border-[#7cb342] text-white font-bold'
                      : 'bg-[#120d09] border-[#291c13] text-[#8e7c6d]'
                  }`}
                >
                  Solid Color
                </button>
              </div>
            </div>

            {/* Gradient Stops Builder */}
            {colorMode === 'gradient' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#9c8979] uppercase">
                    Gradient Color Stops ({colorStops.length} stops):
                  </span>
                  {colorStops.length < 6 && (
                    <button
                      onClick={handleAddStop}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Color Stop
                    </button>
                  )}
                </div>

                {/* Color Stop Items */}
                <div className="flex flex-wrap gap-2.5 items-center">
                  {colorStops.map((stopHex, stopIdx) => (
                    <div
                      key={stopIdx}
                      className="flex items-center gap-1.5 p-1.5 bg-[#120d09] border-2 border-[#332216]"
                    >
                      <input
                        type="color"
                        value={stopHex}
                        onChange={(e) => handleUpdateStop(stopIdx, e.target.value)}
                        className="w-7 h-7 bg-transparent border-0 cursor-pointer"
                        title={`Color Stop ${stopIdx + 1}`}
                      />
                      <input
                        type="text"
                        value={stopHex}
                        onChange={(e) => handleUpdateStop(stopIdx, e.target.value)}
                        className="w-20 bg-[#1c130d] border border-[#3d2a1d] px-1.5 py-0.5 text-[11px] text-white font-mono uppercase"
                      />
                      {colorStops.length > 2 && (
                        <button
                          onClick={() => handleRemoveStop(stopIdx)}
                          className="text-[#885555] hover:text-red-400 p-0.5 cursor-pointer"
                          title="Remove stop"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Gradient Visual Bar Preview */}
                <div
                  className="w-full h-4 border-2 border-[#0e0a07] shadow-inner"
                  style={{
                    background: `linear-gradient(to right, ${colorStops.join(', ')})`
                  }}
                />

                {/* Preset Gradients */}
                <div className="pt-2">
                  <span className="text-[11px] text-[#9c8979] uppercase block mb-1.5">
                    Popular Minecraft Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {GRADIENT_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setColorStops(preset.stops)}
                        className="px-2 py-1 text-[10px] bg-[#120d09] hover:bg-[#201610] border border-[#3d2a1d] hover:border-[#7cb342] text-[#c2b09e] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span
                          className="w-2.5 h-2.5 border border-black/40"
                          style={{
                            background: `linear-gradient(to right, ${preset.stops[0]}, ${preset.stops[preset.stops.length - 1]})`
                          }}
                        />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Solid Color Picker */
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-10 h-10 bg-transparent border-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-[10px] text-[#9c8979] uppercase block">Hex Color Code:</span>
                    <input
                      type="text"
                      value={solidColor}
                      onChange={(e) => setSolidColor(e.target.value)}
                      className="bg-[#120d09] border border-[#3d2a1d] px-2 py-1 text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Classic 16 Minecraft Palette */}
                <div className="pt-2">
                  <span className="text-[11px] text-[#9c8979] uppercase block mb-1.5">
                    Classic 16 Minecraft Colors:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {MINECRAFT_CLASSIC_COLORS.map(c => (
                      <button
                        key={c.code}
                        onClick={() => setSolidColor(c.hex)}
                        className="p-1 bg-[#120d09] border border-[#332216] hover:border-white text-center cursor-pointer"
                        title={`${c.name} (${c.code})`}
                      >
                        <div className="w-full h-4 mb-1" style={{ backgroundColor: c.hex }} />
                        <span className="text-[9px] text-[#a09080]">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In-Game Live Previews & Ready Commands */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: Live In-Game Preview */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="flex items-center justify-between border-b-2 border-[#332216] pb-2">
              <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Live In-Game Preview
              </span>

              {generatorMode === 'sign' && (
                <div className="flex items-center gap-2 text-[11px]">
                  <label className="flex items-center gap-1 text-[#c2b09e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGlowing}
                      onChange={(e) => setIsGlowing(e.target.checked)}
                      className="accent-[#5b8731]"
                    />
                    <span>Glow Sac</span>
                  </label>
                  <label className="flex items-center gap-1 text-[#c2b09e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHangingSign}
                      onChange={(e) => setIsHangingSign(e.target.checked)}
                      className="accent-[#5b8731]"
                    />
                    <span>Hanging</span>
                  </label>
                </div>
              )}
            </div>

            {/* Preview Box */}
            {generatorMode === 'sign' ? (
              <div className="space-y-3">
                {/* Wood selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                  <span className="text-[#9c8979] uppercase shrink-0">Wood:</span>
                  {WOOD_TYPES.map(wood => (
                    <button
                      key={wood.id}
                      onClick={() => setSelectedWood(wood.id)}
                      className={`px-2 py-0.5 border cursor-pointer shrink-0 uppercase ${
                        selectedWood === wood.id
                          ? 'border-yellow-300 text-yellow-300 font-bold'
                          : 'border-[#382618] text-[#9c8979] hover:text-white'
                      }`}
                      style={{ backgroundColor: wood.bg }}
                    >
                      {wood.label}
                    </button>
                  ))}
                </div>

                {/* Rendered Wooden Sign Board */}
                <div className="flex flex-col items-center">
                  {/* Chains if hanging */}
                  {isHangingSign && (
                    <div className="flex justify-between w-36 px-4 py-1">
                      <div className="w-1.5 h-6 bg-[#3a3a3a] border border-[#1a1a1a]" />
                      <div className="w-1.5 h-6 bg-[#3a3a3a] border border-[#1a1a1a]" />
                    </div>
                  )}

                  {/* Sign Plaque */}
                  <div
                    className="w-full max-w-sm min-h-[160px] p-4 flex flex-col justify-center items-center text-center shadow-2xl relative border-4"
                    style={{
                      backgroundColor: currentWood.bg,
                      borderColor: currentWood.border
                    }}
                  >
                    <div className="absolute inset-1 border border-black/20 pointer-events-none" />
                    
                    <div className="space-y-1.5 relative z-10 w-full">
                      {computedSignLines.map((lineChars, lineIdx) => (
                        <div key={lineIdx} className="text-xs sm:text-sm tracking-wide min-h-[18px]">
                          {lineChars.length > 0 ? (
                            lineChars.map((c, cIdx) => renderChar(c, cIdx))
                          ) : (
                            <span className="opacity-0">-</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sign Post if standard ground sign */}
                  {!isHangingSign && (
                    <div
                      className="w-4 h-12 border-x-2 border-black/40"
                      style={{ backgroundColor: currentWood.border }}
                    />
                  )}
                </div>
              </div>
            ) : (
              /* Command Block / Chat Terminal Preview */
              <div className="bg-[#0c0906] border-2 border-[#2b1c13] p-4 font-mojangles text-xs sm:text-sm min-h-[120px] flex items-center justify-center text-center leading-relaxed">
                <div>
                  {computedCommandChars.map((c, idx) => renderChar(c, idx))}
                </div>
              </div>
            )}
          </div>

          {/* Card: Exported Commands & One-Click Copy */}
          <div className="mc-panel-dirt border-4 border-[#0e0a07] p-5 space-y-4 shadow-xl bg-[#1c130d]">
            <div className="border-b-2 border-[#332216] pb-2 flex items-center justify-between">
              <span className="text-xs uppercase text-yellow-300 tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Copy Commands & Raw Formats
              </span>
              <span className="text-[10px] text-emerald-400 bg-[#12220b] border border-[#2b5414] px-1.5 py-0.5">
                26.3 & 1.21 Ready
              </span>
            </div>

            {/* List of Formats */}
            <div className="space-y-3 text-xs">
              {generatorMode === 'sign' ? (
                <>
                  {/* Option 1: Modern Java 1.20.5+ / 1.21+ / 26.3 Item Components /give Command */}
                  <div className="p-3 bg-[#100b08] border-2 border-[#291c13] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-yellow-300 font-bold text-[11px] uppercase block">
                          Java 1.20.5+ / 1.21+ / 26.3 Sign (/give)
                        </span>
                        <span className="text-[10px] text-[#9c8979]">
                          Item Component format. Gives an item you can place in Creative mode.
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy('javaSignGive', javaSignGiveCmd)}
                        className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedKey === 'javaSignGive' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'javaSignGive' ? 'Copied!' : 'Copy /give'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-[#a09080] break-all max-h-16 overflow-y-auto p-1.5 bg-black/50 border border-white/5">
                      {javaSignGiveCmd}
                    </div>
                  </div>

                  {/* Option 2: Java /data merge (Instant update to any sign in your world) */}
                  <div className="p-3 bg-[#100b08] border-2 border-emerald-900/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-emerald-400 font-bold text-[11px] uppercase block flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Java /data merge (Recommended · Apply to Existing Sign)
                        </span>
                        <span className="text-[10px] text-[#9c8979]">
                          Place any sign in your world, stand looking at it, and run this command!
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy('javaDataMerge', javaSignDataMergeCmd)}
                        className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer shrink-0 bg-[#2d5218] border-[#4a8028]"
                      >
                        {copiedKey === 'javaDataMerge' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'javaDataMerge' ? 'Copied!' : 'Copy /data merge'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-emerald-200/90 break-all max-h-16 overflow-y-auto p-1.5 bg-black/50 border border-emerald-500/20">
                      {javaSignDataMergeCmd}
                    </div>
                  </div>

                  {/* Option 3: Java /setblock sign command */}
                  <div className="p-3 bg-[#100b08] border-2 border-[#291c13] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[#c2b09e] font-bold text-[11px] uppercase block">
                          Java /setblock Sign Command (Instantly Spawns Sign)
                        </span>
                        <span className="text-[10px] text-[#9c8979]">
                          Places the sign block at ~ ~1 ~ with the exact colored text and rotation.
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy('javaSetblock', javaSignSetblockCmd)}
                        className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedKey === 'javaSetblock' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'javaSetblock' ? 'Copied!' : 'Copy /setblock'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-[#a09080] break-all max-h-16 overflow-y-auto p-1.5 bg-black/50 border border-white/5">
                      {javaSignSetblockCmd}
                    </div>
                  </div>

                  {/* Option 4: Bedrock Edition Sign (§ Color Codes) */}
                  <div className="p-3 bg-[#100b08] border-2 border-cyan-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-cyan-300 font-bold text-[11px] uppercase block">
                          Bedrock Signs (Section Sign § Format)
                        </span>
                        <span className="text-[10px] text-[#9c8979]">
                          Uses genuine Bedrock color codes. Paste directly into the sign editor in-game!
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy('bedrockSignAll', bedrockSignRawText)}
                        className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedKey === 'bedrockSignAll' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'bedrockSignAll' ? 'Copied All!' : 'Copy All 4 Lines'}</span>
                      </button>
                    </div>

                    {/* Per-line copy buttons for Bedrock */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {bedrockSignLines.map((lineText, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1 bg-black/40 border border-white/10 text-[10px]">
                          <span className="text-[#a09080] font-mono truncate mr-2">
                            L{idx + 1}: {lineText || '(blank)'}
                          </span>
                          <button
                            onClick={() => handleCopy(`bedrockLine${idx}`, lineText)}
                            className="text-cyan-300 hover:text-white px-1.5 py-0.5 bg-cyan-950/60 border border-cyan-600/40 cursor-pointer shrink-0 uppercase"
                          >
                            {copiedKey === `bedrockLine${idx}` ? 'Copied' : `Copy L${idx + 1}`}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Option 5: Legacy Java 1.20 - 1.20.4 */}
                  <div className="p-2.5 bg-[#100b08] border border-[#291c13] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#887766] font-bold text-[10px] uppercase">
                        Legacy Java (1.20 - 1.20.4) {`{BlockEntityTag}`}
                      </span>
                      <button
                        onClick={() => handleCopy('javaLegacyGive', javaSignLegacyGiveCmd)}
                        className="text-[9px] uppercase text-[#a09080] hover:text-white px-2 py-0.5 bg-[#1a120b] border border-[#332216] cursor-pointer"
                      >
                        {copiedKey === 'javaLegacyGive' ? 'Copied!' : 'Copy Legacy'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Java /tellraw */}
                  <div className="p-3 bg-[#100b08] border-2 border-[#291c13] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-300 font-bold text-[11px] uppercase">
                        Java /tellraw Command (All Versions & 26.3)
                      </span>
                      <button
                        onClick={() => handleCopy('javaTellraw', javaTellrawCmd)}
                        className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'javaTellraw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'javaTellraw' ? 'Copied!' : 'Copy /tellraw'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-[#a09080] break-all max-h-16 overflow-y-auto p-1 bg-black/40 border border-white/5">
                      {javaTellrawCmd}
                    </div>
                  </div>

                  {/* Java /title */}
                  <div className="p-3 bg-[#100b08] border-2 border-[#291c13] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 font-bold text-[11px] uppercase">
                        Java /title Screen Announcement
                      </span>
                      <button
                        onClick={() => handleCopy('javaTitle', javaTitleCmd)}
                        className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'javaTitle' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'javaTitle' ? 'Copied!' : 'Copy /title'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-[#a09080] break-all max-h-16 overflow-y-auto p-1 bg-black/40 border border-white/5">
                      {javaTitleCmd}
                    </div>
                  </div>

                  {/* Bedrock /tellraw */}
                  <div className="p-3 bg-[#100b08] border-2 border-[#291c13] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-300 font-bold text-[11px] uppercase">
                        Bedrock /tellraw Command
                      </span>
                      <button
                        onClick={() => handleCopy('bedrockTellraw', bedrockTellrawCmd)}
                        className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'bedrockTellraw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'bedrockTellraw' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-[11px] text-[#a09080] break-all max-h-16 overflow-y-auto p-1 bg-black/40 border border-white/5">
                      {bedrockTellrawCmd}
                    </div>
                  </div>
                </>
              )}

              {/* MiniMessage Format */}
              <div className="p-3 bg-[#100b08] border-2 border-[#291c13] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-pink-300 font-bold text-[11px] uppercase">
                    MiniMessage Format (Paper / Purpur / Velocity)
                  </span>
                  <button
                    onClick={() => handleCopy('miniMessage', miniMessageOutput)}
                    className="mc-button px-2.5 py-1 text-[10px] uppercase text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'miniMessage' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'miniMessage' ? 'Copied!' : 'Copy MiniMessage'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-[#a09080] break-all max-h-16 overflow-y-auto p-1 bg-black/40 border border-white/5">
                  {miniMessageOutput}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
