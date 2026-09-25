/**
 * Minecraft Text Color & Gradient Generator Utilities
 * Supports Java (1.20.5+, 1.21+, 26.3 component format, /tellraw, signs),
 * Bedrock (§ formatting codes, rawtext tellraw), MiniMessage, and Essentials.
 */

export interface TextEffectOptions {
  bold: boolean;
  italic: boolean;
  underlined: boolean;
  strikethrough: boolean;
  obfuscated: boolean;
}

export interface GradientStop {
  id: string;
  color: string; // #RRGGBB
}

export interface CharacterColor {
  char: string;
  hex: string;
  bold: boolean;
  italic: boolean;
  underlined: boolean;
  strikethrough: boolean;
  obfuscated: boolean;
}

// Convert Hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Convert RGB to Hex #RRGGBB
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(c)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Interpolate multi-stop gradient across a string of characters
export function generateGradientColors(
  text: string,
  stops: string[],
  effects: TextEffectOptions
): CharacterColor[] {
  if (!text) return [];
  if (stops.length === 0) stops = ['#ffffff'];
  if (stops.length === 1 || text.length <= 1) {
    const fallbackHex = stops[0];
    return text.split('').map(char => ({
      char,
      hex: fallbackHex,
      ...effects
    }));
  }

  const numStops = stops.length;
  const numSegments = numStops - 1;
  const totalChars = text.length;

  return text.split('').map((char, index) => {
    // Fractional position between 0 and 1
    const progress = totalChars > 1 ? index / (totalChars - 1) : 0;
    
    // Scale progress across the number of segments
    const scaledProgress = progress * numSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), numSegments - 1);
    const segmentProgress = scaledProgress - segmentIndex;

    const startRgb = hexToRgb(stops[segmentIndex]);
    const endRgb = hexToRgb(stops[segmentIndex + 1]);

    const r = startRgb.r + segmentProgress * (endRgb.r - startRgb.r);
    const g = startRgb.g + segmentProgress * (endRgb.g - startRgb.g);
    const b = startRgb.b + segmentProgress * (endRgb.b - startRgb.b);

    return {
      char,
      hex: rgbToHex(r, g, b),
      ...effects
    };
  });
}

// Group contiguous characters with the same styling/color for clean JSON
export interface FormattedSegment {
  text: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
}

export function groupFormattedCharacters(chars: CharacterColor[]): FormattedSegment[] {
  if (chars.length === 0) return [];

  const segments: FormattedSegment[] = [];
  let currentSegment: FormattedSegment = {
    text: chars[0].char,
    color: chars[0].hex,
    bold: chars[0].bold || undefined,
    italic: chars[0].italic || undefined,
    underlined: chars[0].underlined || undefined,
    strikethrough: chars[0].strikethrough || undefined,
    obfuscated: chars[0].obfuscated || undefined
  };

  for (let i = 1; i < chars.length; i++) {
    const c = chars[i];
    const sameColor = c.hex.toLowerCase() === currentSegment.color.toLowerCase();
    const sameBold = (c.bold || undefined) === currentSegment.bold;
    const sameItalic = (c.italic || undefined) === currentSegment.italic;
    const sameUnderline = (c.underlined || undefined) === currentSegment.underlined;
    const sameStrikethrough = (c.strikethrough || undefined) === currentSegment.strikethrough;
    const sameObfuscated = (c.obfuscated || undefined) === currentSegment.obfuscated;

    if (sameColor && sameBold && sameItalic && sameUnderline && sameStrikethrough && sameObfuscated) {
      currentSegment.text += c.char;
    } else {
      segments.push(currentSegment);
      currentSegment = {
        text: c.char,
        color: c.hex,
        bold: c.bold || undefined,
        italic: c.italic || undefined,
        underlined: c.underlined || undefined,
        strikethrough: c.strikethrough || undefined,
        obfuscated: c.obfuscated || undefined
      };
    }
  }
  segments.push(currentSegment);
  return segments;
}

// Generate Java JSON Tellraw array string
export function exportToJavaTellraw(segments: FormattedSegment[]): string {
  if (segments.length === 0) return '[""]';
  const cleanParts = segments.map(s => {
    const obj: any = { text: s.text, color: s.color };
    if (s.bold) obj.bold = true;
    if (s.italic) obj.italic = true;
    if (s.underlined) obj.underlined = true;
    if (s.strikethrough) obj.strikethrough = true;
    if (s.obfuscated) obj.obfuscated = true;
    return obj;
  });
  return JSON.stringify(['', ...cleanParts]);
}

// Find nearest Minecraft classic color code (§0 to §f) for Bedrock compatibility
export function hexToBedrockColorCode(hex: string): string {
  const rgb = hexToRgb(hex);
  let closestCode = '§f';
  let minDistance = Infinity;

  for (const c of MINECRAFT_CLASSIC_COLORS) {
    const cRgb = hexToRgb(c.hex);
    // Euclidean distance in RGB color space
    const dist = Math.sqrt(
      Math.pow(rgb.r - cRgb.r, 2) +
      Math.pow(rgb.g - cRgb.g, 2) +
      Math.pow(rgb.b - cRgb.b, 2)
    );
    if (dist < minDistance) {
      minDistance = dist;
      closestCode = c.code;
    }
  }
  return closestCode;
}

// Generate Bedrock / Classic Section Sign (§) format using genuine Bedrock color codes
export function exportToSectionSigns(chars: CharacterColor[]): string {
  if (chars.length === 0) return '';
  let currentBedrockColor = '';
  let currentBold = false;
  let currentItalic = false;
  let currentUnderline = false;
  let currentStrikethrough = false;
  let currentObfuscated = false;

  let result = '';

  for (const c of chars) {
    const bColor = hexToBedrockColorCode(c.hex);
    let codeStr = '';

    // If color changes, color code resets formatting in Bedrock
    if (bColor !== currentBedrockColor) {
      codeStr += bColor;
      currentBedrockColor = bColor;
      // In Bedrock, a color code resets bold/italic/etc., so reapply them
      if (c.bold) codeStr += '§l';
      if (c.italic) codeStr += '§o';
      if (c.underlined) codeStr += '§n';
      if (c.strikethrough) codeStr += '§m';
      if (c.obfuscated) codeStr += '§k';
      currentBold = c.bold;
      currentItalic = c.italic;
      currentUnderline = c.underlined;
      currentStrikethrough = c.strikethrough;
      currentObfuscated = c.obfuscated;
    } else {
      if (c.bold && !currentBold) { codeStr += '§l'; currentBold = true; }
      if (c.italic && !currentItalic) { codeStr += '§o'; currentItalic = true; }
      if (c.underlined && !currentUnderline) { codeStr += '§n'; currentUnderline = true; }
      if (c.strikethrough && !currentStrikethrough) { codeStr += '§m'; currentStrikethrough = true; }
      if (c.obfuscated && !currentObfuscated) { codeStr += '§k'; currentObfuscated = true; }
    }

    result += codeStr + c.char;
  }

  return result;
}

// Serialize formatted segments into strict Java 1.20.5+ / 1.21+ / 26.3 JSON Text Component
// Uses {"text":"","extra":[...]} to ensure Minecraft never falls back to literal (text:...) string
export function serializeToModernSnbtComponent(segments: FormattedSegment[]): string {
  if (!segments || segments.length === 0 || segments.every(s => !s.text)) {
    return '\'{"text":""}\'';
  }

  if (segments.length === 1) {
    const s = segments[0];
    const obj: any = { text: s.text, color: s.color };
    if (s.bold) obj.bold = true;
    if (s.italic !== undefined) obj.italic = s.italic;
    if (s.underlined) obj.underlined = true;
    if (s.strikethrough) obj.strikethrough = true;
    if (s.obfuscated) obj.obfuscated = true;
    const jsonStr = JSON.stringify(obj);
    return `'${jsonStr.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  }

  const extraParts = segments.map(s => {
    const obj: any = { text: s.text, color: s.color };
    if (s.bold) obj.bold = true;
    if (s.italic !== undefined) obj.italic = s.italic;
    if (s.underlined) obj.underlined = true;
    if (s.strikethrough) obj.strikethrough = true;
    if (s.obfuscated) obj.obfuscated = true;
    return obj;
  });

  const rootObj = {
    text: '',
    extra: extraParts
  };

  const jsonStr = JSON.stringify(rootObj);
  return `'${jsonStr.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

// Helper to serialize a line of segments into a strict Java JSON Text Component string
function serializeSignLineToSnbtJson(lineSegs: FormattedSegment[]): string {
  return serializeToModernSnbtComponent(lineSegs);
}

// Generate Modern Java 1.20.5+ / 1.21+ / 26.3 Sign Give Command
export function exportToJavaSignGiveCommand(
  lines: FormattedSegment[][],
  woodType: string = 'oak',
  isHanging: boolean = false,
  isWaxed: boolean = false,
  isGlowing: boolean = false
): string {
  const itemType = isHanging ? `${woodType}_hanging_sign` : `${woodType}_sign`;
  const blockEntityId = isHanging ? 'minecraft:hanging_sign' : 'minecraft:sign';

  const formattedLineStrings = [0, 1, 2, 3].map(i => serializeSignLineToSnbtJson(lines[i] || []));
  const glowingFlag = isGlowing ? ',has_glowing_text:1b' : '';

  // In 1.20.5+ item component format: [block_entity_data={...}]
  return `/give @p minecraft:${itemType}[block_entity_data={id:"${blockEntityId}",is_waxed:${isWaxed ? '1b' : '0b'},front_text:{color:"black",messages:[${formattedLineStrings.join(',')}]${glowingFlag}}}] 1`;
}

// Generate Legacy Java 1.20 - 1.20.4 Sign Give Command ({BlockEntityTag:{...}})
export function exportToJavaLegacySignGiveCommand(
  lines: FormattedSegment[][],
  woodType: string = 'oak',
  isHanging: boolean = false,
  isWaxed: boolean = false,
  isGlowing: boolean = false
): string {
  const itemType = isHanging ? `${woodType}_hanging_sign` : `${woodType}_sign`;
  const formattedLineStrings = [0, 1, 2, 3].map(i => serializeSignLineToSnbtJson(lines[i] || []));
  const glowingFlag = isGlowing ? ',has_glowing_text:1b' : '';

  return `/give @p minecraft:${itemType}{BlockEntityTag:{is_waxed:${isWaxed ? '1b' : '0b'},front_text:{color:"black",messages:[${formattedLineStrings.join(',')}]${glowingFlag}}}} 1`;
}

// Generate Java /setblock command for Signs (Instant placement)
export function exportToJavaSetblockSignCommand(
  lines: FormattedSegment[][],
  woodType: string = 'oak',
  isHanging: boolean = false,
  isWaxed: boolean = false,
  isGlowing: boolean = false
): string {
  const blockId = isHanging ? `minecraft:${woodType}_hanging_sign[rotation=0]` : `minecraft:${woodType}_sign[rotation=0]`;
  const formattedLineStrings = [0, 1, 2, 3].map(i => serializeSignLineToSnbtJson(lines[i] || []));
  const glowingFlag = isGlowing ? ',has_glowing_text:1b' : '';

  return `/setblock ~ ~1 ~ ${blockId}{is_waxed:${isWaxed ? '1b' : '0b'},front_text:{color:"black",messages:[${formattedLineStrings.join(',')}]${glowingFlag}}} replace`;
}

// Generate Java /data merge command (Apply directly to an already placed sign in the world)
export function exportToJavaDataMergeSignCommand(
  lines: FormattedSegment[][],
  isWaxed: boolean = false,
  isGlowing: boolean = false
): string {
  const formattedLineStrings = [0, 1, 2, 3].map(i => serializeSignLineToSnbtJson(lines[i] || []));
  const glowingFlag = isGlowing ? ',has_glowing_text:1b' : '';

  return `/data merge block ~ ~ ~ {is_waxed:${isWaxed ? '1b' : '0b'},front_text:{color:"black",messages:[${formattedLineStrings.join(',')}]${glowingFlag}}}`;
}

// Generate Bedrock Tellraw JSON command
export function exportToBedrockTellraw(chars: CharacterColor[]): string {
  const sectionText = exportToSectionSigns(chars);
  return `/tellraw @a {"rawtext":[{"text":"${sectionText.replace(/"/g, '\\"')}"}]}`;
}

// Generate MiniMessage format (<gradient:#ff0000:#00ff00>text</gradient>)
export function exportToMiniMessage(
  text: string,
  stops: string[],
  effects: TextEffectOptions
): string {
  let result = text;
  if (effects.bold) result = `<b>${result}</b>`;
  if (effects.italic) result = `<i>${result}</i>`;
  if (effects.underlined) result = `<u>${result}</u>`;
  if (effects.strikethrough) result = `<st>${result}</st>`;
  if (effects.obfuscated) result = `<obf>${result}</obf>`;

  if (stops.length > 1) {
    const stopList = stops.join(':');
    return `<gradient:${stopList}>${result}</gradient>`;
  } else if (stops.length === 1) {
    return `<color:${stops[0]}>${result}</color>`;
  }
  return result;
}

// Popular Preset Color Gradients
export const GRADIENT_PRESETS: { name: string; stops: string[] }[] = [
  { name: 'Fire Flame', stops: ['#ff0000', '#ff7700', '#ffdd00'] },
  { name: 'Sunset Glow', stops: ['#ff512f', '#dd2476'] },
  { name: 'Cyber Neon', stops: ['#00f2fe', '#4facfe', '#0000ff'] },
  { name: 'Ocean Depth', stops: ['#00c6ff', '#0072ff'] },
  { name: 'Emerald Forest', stops: ['#00b09b', '#96c93d'] },
  { name: 'Nether Amethyst', stops: ['#b224ef', '#7579ff'] },
  { name: 'Golden King', stops: ['#ffe259', '#ffa751'] },
  { name: 'Rainbow', stops: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8f00ff'] },
  { name: 'End Dimension', stops: ['#d558c8', '#24d292'] },
  { name: 'Toxic Slime', stops: ['#11998e', '#38ef7d'] }
];

export const MINECRAFT_CLASSIC_COLORS: { name: string; code: string; hex: string }[] = [
  { name: 'Dark Red', code: '§4', hex: '#AA0000' },
  { name: 'Red', code: '§c', hex: '#FF5555' },
  { name: 'Gold', code: '§6', hex: '#FFAA00' },
  { name: 'Yellow', code: '§e', hex: '#FFFF55' },
  { name: 'Dark Green', code: '§2', hex: '#00AA00' },
  { name: 'Green', code: '§a', hex: '#55FF55' },
  { name: 'Aqua', code: '§b', hex: '#55FFFF' },
  { name: 'Dark Aqua', code: '§3', hex: '#00AAAA' },
  { name: 'Dark Blue', code: '§1', hex: '#0000AA' },
  { name: 'Blue', code: '§9', hex: '#5555FF' },
  { name: 'Light Purple', code: '§d', hex: '#FF55FF' },
  { name: 'Dark Purple', code: '§5', hex: '#AA00AA' },
  { name: 'White', code: '§f', hex: '#FFFFFF' },
  { name: 'Gray', code: '§7', hex: '#AAAAAA' },
  { name: 'Dark Gray', code: '§8', hex: '#555555' },
  { name: 'Black', code: '§0', hex: '#000000' }
];

export const WOOD_TYPES = [
  { id: 'oak', label: 'Oak', bg: '#866542', border: '#5c452c', textDefault: '#000000' },
  { id: 'spruce', label: 'Spruce', bg: '#493722', border: '#332617', textDefault: '#ffffff' },
  { id: 'birch', label: 'Birch', bg: '#cbb685', border: '#93845f', textDefault: '#000000' },
  { id: 'jungle', label: 'Jungle', bg: '#71543b', border: '#4b3726', textDefault: '#000000' },
  { id: 'acacia', label: 'Acacia', bg: '#91532f', border: '#63381e', textDefault: '#000000' },
  { id: 'dark_oak', label: 'Dark Oak', bg: '#2f2115', border: '#1e140d', textDefault: '#ffffff' },
  { id: 'mangrove', label: 'Mangrove', bg: '#582627', border: '#381617', textDefault: '#ffffff' },
  { id: 'cherry', label: 'Cherry', bg: '#c98a96', border: '#92616b', textDefault: '#000000' },
  { id: 'bamboo', label: 'Bamboo', bg: '#a59e4b', border: '#726d30', textDefault: '#000000' },
  { id: 'crimson', label: 'Crimson', bg: '#5b1f2e', border: '#3e131d', textDefault: '#ffffff' },
  { id: 'warped', label: 'Warped', bg: '#295454', border: '#1a3737', textDefault: '#ffffff' }
];
