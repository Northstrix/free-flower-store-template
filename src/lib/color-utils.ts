/**
 * @fileOverview Comprehensive Color math and harmony generation logic.
 */

export type MixMode = 'rgb' | 'hsl' | 'hsv' | 'lab' | 'lch' | 'log' | 'parabolic' | 'quadratic';

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    if (hex.length !== 6) return { r: 0, g: 0, b: 0 };
    const bigint = parseInt(hex, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

export function rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1).toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
    return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
    const {r, g, b} = hexToRgb(hex);
    return rgbToHsl(r, g, b);
}

export function hslToHex(h: number, s: number, l: number): string {
    const {r, g, b} = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
}

export function anyToHex(color: string): string {
  if (!color) return '#39C73B';
  const str = color.toLowerCase().trim();
  if (str.startsWith('#')) return str.toUpperCase();
  
  if (str.startsWith('rgb')) {
    const parts = str.match(/[\d.]+/g);
    if (parts && parts.length >= 3) {
      return rgbToHex(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
    }
  }
  
  if (str.startsWith('hsl')) {
    const parts = str.match(/[\d.]+/g);
    if (parts && parts.length >= 3) {
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]);
      const l = parseFloat(parts[2]);
      const { r, g, b } = hslToRgb(h, s, l);
      return rgbToHex(r, g, b);
    }
  }
  
  return color;
}

function shiftHue(h: number, amount: number): number {
  return (h + amount + 360) % 360;
}

export function getColorHarmonies(hexColor: string) {
  const hsl = hexToHsl(hexColor);
  const baseHue = hsl.h;
  
  const analogous = [
    hslToHex(shiftHue(baseHue, -30), hsl.s, hsl.l),
    hexColor,
    hslToHex(shiftHue(baseHue, 30), hsl.s, hsl.l)
  ];

  const triad = [
    hexColor,
    hslToHex(shiftHue(baseHue, 120), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 240), hsl.s, hsl.l)
  ];

  const complementary = [
    hexColor,
    hslToHex(shiftHue(baseHue, 180), hsl.s, hsl.l)
  ];

  const splitComplementary = [
    hexColor,
    hslToHex(shiftHue(baseHue, 150), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 210), hsl.s, hsl.l)
  ];

  const square = [
    hexColor,
    hslToHex(shiftHue(baseHue, 90), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 180), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 270), hsl.s, hsl.l)
  ];

  const tetradic = [
    hexColor,
    hslToHex(shiftHue(baseHue, 60), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 180), hsl.s, hsl.l),
    hslToHex(shiftHue(baseHue, 240), hsl.s, hsl.l)
  ];

  const allColors = [
    ...analogous,
    ...triad,
    ...complementary,
    ...splitComplementary,
    ...square,
    ...tetradic,
  ];
  const convergence = [...new Set(allColors)];
  
  return { analogous, triad, complementary, splitComplementary, square, tetradic, convergence };
}