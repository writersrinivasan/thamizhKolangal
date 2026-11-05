// Festival motifs drawn in a 200×200 box (centre 100,100). Composed into a ring of petals by
// renderMotif() — e.g. a Pongal paanai with sugarcane, a Deepavali agal vilakku, a temple ther.

import type { KolamSpec, MotifName, RenderModel, Shape } from "./types";
import { rng } from "./rng";
import { BACKGROUNDS, lineColorFor, paletteOf } from "./palettes";
import { drawRing, lampPath, planRings, ringStep, colourName } from "./poo";

type S = Omit<Shape, "step">;
const p = (d: string, fill: string, stroke = "#fffaf0", sw = 2): S => ({ kind: "path", d, fill, stroke, sw });
const c = (cx: number, cy: number, r: number, fill: string, stroke = "#fffaf0", sw = 2): S => ({ kind: "circle", cx, cy, r, fill, stroke, sw });

export const MOTIF_INFO: Record<MotifName, { label: string; tamil: string; text: string }> = {
  "pongal-pot": { label: "Pongal paanai", tamil: "பொங்கல் பானை", text: "a Pongal pot overflowing with sweet pongal, flanked by two sugarcanes, under a rising sun" },
  diya: { label: "Agal vilakku", tamil: "அகல் விளக்கு", text: "a clay agal vilakku lamp with a bright flame" },
  lotus: { label: "Thamarai", tamil: "தாமரை", text: "a blooming lotus (thamarai) on its leaf" },
  sun: { label: "Suriyan", tamil: "சூரியன்", text: "the Sun God (Suriyan) with radiating rays" },
  kalasam: { label: "Poorna kalasam", tamil: "பூர்ண கலசம்", text: "a poorna kalasam with mango leaves and a coconut" },
  star: { label: "Natchathiram", tamil: "நட்சத்திரம்", text: "a glowing eight-pointed star" },
  ther: { label: "Ther (chariot)", tamil: "தேர்", text: "a temple ther (chariot) with big wheels" },
  cow: { label: "Maadu", tamil: "மாடு", text: "a decorated cow face with painted horns and a bell, for Maattu Pongal" },
  peacock: { label: "Mayil thogai", tamil: "மயில் தோகை", text: "a peacock-feather eye (mayil thogai)" },
  "karthigai-lamps": { label: "Deepa varisai", tamil: "தீப வரிசை", text: "a cluster of Karthigai lamps around a central deepam" },
};

export function motifShapes(m: MotifName, pal: string[], line: string): S[] {
  const [c0, c1, c2, c3] = [pal[0], pal[1 % pal.length], pal[2 % pal.length], pal[3 % pal.length]];
  switch (m) {
    case "pongal-pot": {
      const cane = (x1: number, y1: number, x2: number, y2: number): S[] => {
        const out: S[] = [p(`M${x1} ${y1}L${x2} ${y2}`, "none", "#3f7d20", 9)];
        for (let t = 0.15; t < 0.95; t += 0.16) {
          const x = x1 + (x2 - x1) * t;
          const y = y1 + (y2 - y1) * t;
          out.push(p(`M${x - 5} ${y}L${x + 5} ${y}`, "none", "#a7d96a", 2));
        }
        out.push(p(`M${x2} ${y2}Q${x2 - 25} ${y2 - 5} ${x2 - 35} ${y2 + 15}M${x2} ${y2}Q${x2 + 22} ${y2 - 15} ${x2 + 30} ${y2 + 5}M${x2} ${y2}Q${x2 - 5} ${y2 - 25} ${x2 + 8} ${y2 - 30}`, "none", "#6abf3a", 3));
        return out;
      };
      return [
        ...[...Array(12)].map((_, i) => p(`M100 30L${100 + Math.sin((i * Math.PI) / 6) * 34} ${30 - Math.cos((i * Math.PI) / 6) * 34}`, "none", "#ffb703", 2)),
        c(100, 30, 16, "#ff8c00", line, 2),
        ...cane(38, 190, 70, 45),
        ...cane(162, 190, 130, 45),
        p("M58 100C30 118 32 182 100 184C168 182 170 118 142 100Z", "#d4a017", line, 2.5),
        p("M45 140C70 150 130 150 155 140L153 152C130 162 70 162 47 152Z", c2, line, 1.5),
        p("M62 88L138 88L142 102L58 102Z", "#b8860b", line, 2),
        p("M68 92Q78 70 80 92M120 92Q122 70 132 92", "none", "#3f7d20", 4),
        c(76, 82, 11, "#fffaf0", line, 1), c(94, 76, 13, "#fffaf0", line, 1), c(112, 78, 12, "#fffaf0", line, 1), c(126, 84, 9, "#fffaf0", line, 1),
        c(100, 128, 5, c2, line, 1), c(85, 128, 3, line, line, 0), c(115, 128, 3, line, line, 0),
      ];
    }
    case "diya": {
      const lp = lampPath(100, 120, 60);
      return [
        c(100, 60, 36, "rgba(255,200,60,0.25)", "none", 0),
        p(lp.bowl, c0, line, 3),
        p("M58 122Q100 150 142 122", "none", c2, 4),
        p(lp.flame, "#ff8c00", "#ffd166", 2),
        p("M100 52Q114 80 100 100Q86 80 100 52Z", "#ffe066", "none", 0),
        c(80, 128, 4, line, "none", 0), c(100, 133, 4, line, "none", 0), c(120, 128, 4, line, "none", 0),
      ];
    }
    case "lotus": {
      const pet = (rot: number, len: number, w: number, fill: string): S => ({
        ...p(`M100 150C${100 + w} ${150 - len * 0.4} ${100 + w * 0.5} ${150 - len * 0.9} 100 ${150 - len}C${100 - w * 0.5} ${150 - len * 0.9} ${100 - w} ${150 - len * 0.4} 100 150Z`, fill, line, 2),
        transform: `rotate(${rot} 100 150)`,
      });
      return [
        p("M30 160Q100 200 170 160Q100 175 30 160Z", "#2a9d8f", line, 2),
        ...[-70, 70, -48, 48].map((r) => pet(r, 70, 22, c1)),
        ...[-24, 24].map((r) => pet(r, 95, 26, c0)),
        pet(0, 105, 28, c2),
        c(100, 150, 8, "#ffd166", line, 1.5),
      ];
    }
    case "sun": {
      const rays: S[] = [];
      for (let i = 0; i < 16; i++) {
        rays.push({ ...p("M100 14L108 52L92 52Z", i % 2 ? c1 : c0, line, 1.5), transform: `rotate(${i * 22.5} 100 100)` });
      }
      return [...rays, c(100, 100, 46, "#ff8c00", line, 3), c(100, 100, 32, "#ffd166", line, 2), p("M84 94Q88 88 92 94M108 94Q112 88 116 94M86 112Q100 124 114 112", "none", "#7a1f12", 3), c(100, 80, 3, "#d7263d", "none", 0)];
    }
    case "kalasam": {
      const leaves: S[] = [-60, -35, -12, 12, 35, 60].map((r) => ({ ...p("M100 80Q112 50 100 22Q88 50 100 80Z", "#3f7d20", line, 1.5), transform: `rotate(${r} 100 80)` }));
      return [
        ...leaves,
        c(100, 64, 22, "#8b5a2b", line, 2),
        p("M86 50Q100 36 114 50", "none", "#c9a36b", 3),
        p("M70 92L130 92L136 104L64 104Z", c0, line, 2),
        p("M64 104C30 120 36 180 100 182C164 180 170 120 136 104Z", "#d4a017", line, 2.5),
        p("M50 138L150 138", "none", c2, 5),
        c(100, 155, 8, c2, line, 1.5),
        p("M90 120L100 112L110 120L100 128Z", c1, line, 1.5),
      ];
    }
    case "star": {
      const big = [...Array(16)].map((_, i) => {
        const r = i % 2 ? 40 : 92;
        const a = (i * Math.PI) / 8;
        return `${100 + Math.sin(a) * r} ${100 - Math.cos(a) * r}`;
      });
      const small = [...Array(16)].map((_, i) => {
        const r = i % 2 ? 20 : 50;
        const a = (i * Math.PI) / 8 + Math.PI / 8;
        return `${100 + Math.sin(a) * r} ${100 - Math.cos(a) * r}`;
      });
      return [p(`M${big.join("L")}Z`, c0, line, 3), p(`M${small.join("L")}Z`, c1, line, 2), c(100, 100, 12, "#ffffff", line, 2)];
    }
    case "ther": {
      return [
        p("M100 8L112 30L88 30Z", "#d4a017", line, 2),
        p("M80 30L120 30L130 60L70 60Z", c0, line, 2),
        p("M66 60L134 60L144 92L56 92Z", c1, line, 2),
        p("M50 92L150 92L156 120L44 120Z", c2, line, 2),
        p("M40 120L160 120L160 150L40 150Z", "#8b5a2b", line, 2.5),
        p("M60 125L60 145M80 125L80 145M100 125L100 145M120 125L120 145M140 125L140 145", "none", "#ffd166", 2),
        c(62, 165, 20, "#5c3a1e", line, 3), c(62, 165, 6, "#ffd166", line, 1),
        c(138, 165, 20, "#5c3a1e", line, 3), c(138, 165, 6, "#ffd166", line, 1),
        p("M60 60L60 92M140 60L140 92", "none", "#ffd166", 2),
      ];
    }
    case "cow": {
      return [
        p("M62 58Q40 50 30 18Q50 30 70 44Z", c0, line, 2),
        p("M138 58Q160 50 170 18Q150 30 130 44Z", c1, line, 2),
        p("M58 64Q36 60 26 76Q42 86 62 80Z", "#f2e6d0", line, 2),
        p("M142 64Q164 60 174 76Q158 86 138 80Z", "#f2e6d0", line, 2),
        p("M60 50Q100 36 140 50Q150 100 128 150Q100 168 72 150Q50 100 60 50Z", "#f7f0e3", "#7a1f12", 2.5),
        p("M74 140Q100 128 126 140Q128 162 100 166Q72 162 74 140Z", "#e8b7a5", "#7a1f12", 2),
        c(88, 150, 4, "#7a1f12", "none", 0), c(112, 150, 4, "#7a1f12", "none", 0),
        c(80, 92, 7, "#2b1a10", "none", 0), c(120, 92, 7, "#2b1a10", "none", 0),
        p("M100 56L106 70L100 84L94 70Z", c2, "none", 0),
        p("M84 170Q100 178 116 170", "none", c0, 5),
        c(100, 186, 10, "#d4a017", line, 2),
      ];
    }
    case "peacock": {
      return [
        p("M100 6C150 40 162 110 100 194C38 110 50 40 100 6Z", "#16a085", line, 2.5),
        p("M100 40C135 64 140 112 100 160C60 112 65 64 100 40Z", "#d4af37", line, 2),
        p("M100 66C122 82 124 112 100 140C76 112 78 82 100 66Z", "#1f3fbf", line, 2),
        c(100, 108, 14, "#0b2a6f", "#7fd8e6", 2),
        p("M100 194L100 210", "none", "#3f7d20", 4),
      ];
    }
    case "karthigai-lamps": {
      const out: S[] = [];
      const pos: [number, number, number][] = [[100, 120, 34], [48, 150, 20], [152, 150, 20], [60, 70, 18], [140, 70, 18], [100, 40, 16]];
      for (const [x, y, s] of pos) {
        const lp = lampPath(x, y, s);
        out.push(c(x, y - s, s * 0.9, "rgba(255,200,60,0.22)", "none", 0));
        out.push(p(lp.bowl, c0, line, 2));
        out.push(p(lp.flame, "#ff8c00", "#ffd166", 1.5));
      }
      return out;
    }
  }
}

export function renderMotif(spec: KolamSpec): RenderModel {
  const size = 600;
  const cx = 300;
  const cy = 300;
  const motif = spec.motif ?? "pongal-pot";
  const pal = paletteOf(spec.palette ?? "pongal");
  const bgName = spec.background ?? "earth";
  const bg = BACKGROUNDS[bgName];
  const line = lineColorFor(bgName, pal);
  const R = rng(spec.seed ?? 21);
  const sym = Math.max(6, Math.min(24, spec.symmetry ?? 12));
  const layers = Math.max(1, Math.min(5, spec.layers ?? 3));
  const shapes: Shape[] = [];
  const info = MOTIF_INFO[motif];
  const steps: string[] = [];

  shapes.push({ kind: "circle", cx, cy, r: 150, fill: pal.colors[pal.colors.length - 1], opacity: 0.18, stroke: line, sw: 3, step: 0, draw: true });
  steps.push("Draw a large circle of rice flour as the frame for the centre picture.");

  const sc = 1.35;
  const t = `translate(${cx - 100 * sc} ${cy - 100 * sc}) scale(${sc})`;
  motifShapes(motif, pal.colors, line).forEach((s) => shapes.push({ ...s, transform: s.transform ? `${t} ${s.transform}` : t, step: 1 }));
  steps.push(`Inside the circle draw ${info.text}. Outline first in white, then fill colours from the centre outwards.`);

  const plans = planRings(R, pal, sym, layers, 152, 285, motif === "diya" || motif === "karthigai-lamps");
  plans.forEach((pl, k) => {
    drawRing(shapes, pl, cx, cy, line, k + 2);
    steps.push(ringStep(pl, colourName(pl.fill)));
  });
  steps.push("Step back, check symmetry, and greet the festival — your kolam welcomes everyone at the doorstep!");
  return {
    size, background: bg.color, floorTexture: bg.texture, shapes, dots: [], dotColor: line, steps,
    stats: { motif: info.label, rings: layers, symmetry: `${sym}-fold` },
  };
}
