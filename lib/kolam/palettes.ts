import type { BackgroundName, PaletteName } from "./types";

export interface Palette {
  name: PaletteName;
  label: string;
  tamil: string;
  colors: string[];
  line: string;
}

export const PALETTES: Record<PaletteName, Palette> = {
  "rice-flour": { name: "rice-flour", label: "Rice flour white", tamil: "அரிசி மாவு", colors: ["#fffaf0", "#fdf3dc", "#f8ead0"], line: "#fffaf0" },
  pongal: { name: "pongal", label: "Pongal harvest", tamil: "பொங்கல்", colors: ["#f2a900", "#2e8b3d", "#d7263d", "#ff7a00", "#7cc242", "#fff3c4"], line: "#fffaf0" },
  deepavali: { name: "deepavali", label: "Deepavali lights", tamil: "தீபாவளி", colors: ["#ffb703", "#e0457b", "#8e44ad", "#ff6b35", "#00a6a6", "#ffd166"], line: "#fff4d6" },
  margazhi: { name: "margazhi", label: "Margazhi dawn", tamil: "மார்கழி", colors: ["#f7a6c1", "#b9a7f2", "#9ad9c4", "#ffd29d", "#a7d3f2", "#fff1f6"], line: "#ffffff" },
  karthigai: { name: "karthigai", label: "Karthigai flame", tamil: "கார்த்திகை", colors: ["#ff7b00", "#ffb000", "#c1121f", "#ffd60a", "#9d0208", "#ffe8a3"], line: "#fff3d0" },
  peacock: { name: "peacock", label: "Peacock (Mayil)", tamil: "மயில்", colors: ["#0f6e8c", "#16a085", "#1f3fbf", "#d4af37", "#2ecc71", "#7fd8e6"], line: "#f0fbff" },
  temple: { name: "temple", label: "Temple kaavi", tamil: "கோவில் காவி", colors: ["#b5341f", "#f4a259", "#fff1d6", "#7a1f12", "#e9c46a", "#ffffff"], line: "#ffffff" },
  lotus: { name: "lotus", label: "Lotus pond", tamil: "தாமரை", colors: ["#e75480", "#ff9fb2", "#2a9d8f", "#ffd6e0", "#c2185b", "#8bd3c7"], line: "#fff7fa" },
  pookalam: { name: "pookalam", label: "Flower carpet", tamil: "பூக்கோலம்", colors: ["#ff9f1c", "#ffbf00", "#e63946", "#ffffff", "#6a994e", "#9b2226"], line: "#fffaf0" },
  navaratri: { name: "navaratri", label: "Navaratri nine hues", tamil: "நவராத்திரி", colors: ["#ff6f00", "#ffffff", "#d50000", "#1565c0", "#ffd600", "#2e7d32", "#7b1fa2", "#ec407a", "#90a4ae"], line: "#fffaf0" },
  rainbow: { name: "rainbow", label: "Vaanavil rainbow", tamil: "வானவில்", colors: ["#e63946", "#ff8c42", "#ffd23f", "#3bb273", "#2d9cdb", "#7b5ea7", "#ff5d8f"], line: "#ffffff" },
};

export const BACKGROUNDS: Record<BackgroundName, { label: string; tamil: string; color: string; texture: string }> = {
  earth: { label: "Mud floor (chaanam)", tamil: "சாணம் தெளித்த தரை", color: "#4a3426", texture: "#5a4232" },
  kaavi: { label: "Red oxide / kaavi", tamil: "காவி", color: "#8e2b1e", texture: "#a1372a" },
  night: { label: "Festival night", tamil: "இரவு", color: "#1f1b3d", texture: "#2a2550" },
  cream: { label: "Marble cream", tamil: "வெண்மை", color: "#f6ecd9", texture: "#efe0c4" },
  leaf: { label: "Banana-leaf green", tamil: "வாழை இலை", color: "#1f4d2b", texture: "#285e36" },
  slate: { label: "Grey stone", tamil: "கல் தரை", color: "#3a3f44", texture: "#454b51" },
};

export function paletteOf(name?: PaletteName): Palette {
  return PALETTES[name ?? "pongal"] ?? PALETTES.pongal;
}

export function lineColorFor(bg: BackgroundName, p: Palette): string {
  return bg === "cream" ? "#7a1f12" : p.line;
}
