// Poo kolam / rangoli mandala generator: concentric rings of petals, leaves, dots and scallops
// with radial symmetry — the colourful flower kolams made for Pongal, Deepavali, Onam and weddings.

import type { KolamSpec, RenderModel, Shape } from "./types";
import { rng, f, type Rng } from "./rng";
import { BACKGROUNDS, lineColorFor, paletteOf, type Palette } from "./palettes";

export type RingType = "petal" | "round" | "leaf" | "dots" | "scallop" | "spike" | "lamp" | "swirl";

const RING_NAMES: Record<RingType, string> = {
  petal: "teardrop petals (idhazh)",
  round: "round petals",
  leaf: "pointed mango leaves",
  dots: "dots in a ring (pulli maalai)",
  scallop: "scallop arcs as a border",
  spike: "a star of sharp rays",
  lamp: "little agal vilakku lamps",
  swirl: "curling vines (kodi)",
};

const rot = (a: number, cx: number, cy: number) => `rotate(${f(a)} ${cx} ${cy})`;

/** Petal pointing up from radius r0 to r1 centred at (cx, cy). */
function petalPath(cx: number, cy: number, r0: number, r1: number, w: number, kind: RingType) {
  const y0 = cy - r0;
  const y1 = cy - r1;
  const h = r1 - r0;
  switch (kind) {
    case "round":
      return `M${cx} ${f(y0)}C${f(cx + w * 1.25)} ${f(y0 - h * 0.15)} ${f(cx + w * 1.1)} ${f(y1)} ${cx} ${f(y1)}C${f(cx - w * 1.1)} ${f(y1)} ${f(cx - w * 1.25)} ${f(y0 - h * 0.15)} ${cx} ${f(y0)}Z`;
    case "leaf":
      return `M${cx} ${f(y0)}Q${f(cx + w * 1.3)} ${f(y0 - h * 0.5)} ${cx} ${f(y1)}Q${f(cx - w * 1.3)} ${f(y0 - h * 0.5)} ${cx} ${f(y0)}Z`;
    case "spike":
      return `M${f(cx - w * 0.7)} ${f(y0)}L${cx} ${f(y1)}L${f(cx + w * 0.7)} ${f(y0)}Z`;
    case "swirl":
      return `M${cx} ${f(y0)}C${f(cx + w * 1.6)} ${f(y0 - h * 0.3)} ${f(cx + w * 1.2)} ${f(y1 + h * 0.1)} ${f(cx + w * 0.2)} ${f(y1 + h * 0.2)}C${f(cx - w * 0.4)} ${f(y1 + h * 0.25)} ${f(cx - w * 0.2)} ${f(y1 + h * 0.55)} ${f(cx + w * 0.3)} ${f(y1 + h * 0.5)}`;
    default:
      return `M${cx} ${f(y0)}C${f(cx + w)} ${f(y0 - h * 0.35)} ${f(cx + w * 0.55)} ${f(y1 + h * 0.12)} ${cx} ${f(y1)}C${f(cx - w * 0.55)} ${f(y1 + h * 0.12)} ${f(cx - w)} ${f(y0 - h * 0.35)} ${cx} ${f(y0)}Z`;
  }
}

export function lampPath(x: number, y: number, s: number) {
  // small agal vilakku: bowl + flame (pointing up), centred at x,y
  const bowl = `M${f(x - s)} ${f(y)}Q${x} ${f(y + s * 1.1)} ${f(x + s)} ${f(y)}Q${f(x + s * 0.4)} ${f(y - s * 0.15)} ${x} ${f(y - s * 0.12)}Q${f(x - s * 0.4)} ${f(y - s * 0.15)} ${f(x - s)} ${f(y)}Z`;
  const flame = `M${x} ${f(y - s * 1.35)}Q${f(x + s * 0.45)} ${f(y - s * 0.6)} ${x} ${f(y - s * 0.2)}Q${f(x - s * 0.45)} ${f(y - s * 0.6)} ${x} ${f(y - s * 1.35)}Z`;
  return { bowl, flame };
}

export interface RingPlan {
  type: RingType;
  count: number;
  r0: number;
  r1: number;
  fill: string;
  offset: number;
}

export function planRings(R: Rng, pal: Palette, sym: number, layers: number, rStart: number, rEnd: number, allowLamps: boolean): RingPlan[] {
  const types: RingType[] = ["petal", "round", "leaf", "dots", "scallop", "spike", "swirl", "petal", "round"];
  const plans: RingPlan[] = [];
  const band = (rEnd - rStart) / layers;
  let prev: RingType | null = null;
  for (let k = 0; k < layers; k++) {
    let type: RingType = R.pick(types);
    if (type === prev) type = R.pick(types);
    if (k === layers - 1) type = R.pick(["scallop", "dots", "round", "petal"] as RingType[]);
    if (allowLamps && k === layers - 1) type = "lamp";
    prev = type;
    const mult = k < 2 ? 1 : R.pick([1, 2, 2]);
    plans.push({
      type,
      count: sym * mult * (type === "dots" ? 2 : 1),
      r0: rStart + band * k,
      r1: rStart + band * (k + 1) * (type === "spike" ? 1.05 : 1),
      fill: pal.colors[(k + 1) % pal.colors.length],
      offset: k % 2 ? 180 / (sym * mult) : 0,
    });
  }
  return plans;
}

export function drawRing(shapes: Shape[], p: RingPlan, cx: number, cy: number, line: string, step: number) {
  const { type, count, r0, r1, fill, offset } = p;
  const circ = 2 * Math.PI * ((r0 + r1) / 2);
  const w = (circ / count) * 0.55;
  if (type === "dots") {
    const r = Math.min((r1 - r0) * 0.28, (circ / count) * 0.32);
    for (let i = 0; i < count; i++) {
      const a = ((i * 360) / count + offset) * (Math.PI / 180);
      const rr = (r0 + r1) / 2;
      shapes.push({ kind: "circle", cx: f(cx + Math.sin(a) * rr), cy: f(cy - Math.cos(a) * rr), r: f(r), fill: i % 2 ? line : fill, stroke: line, sw: 1.2, step });
    }
    return;
  }
  if (type === "lamp") {
    const s = Math.min((r1 - r0) * 0.38, (circ / count) * 0.32);
    for (let i = 0; i < count; i++) {
      const lp = lampPath(cx, cy - (r0 + r1) / 2 + s * 0.3, s);
      const t = rot((i * 360) / count + offset, cx, cy);
      shapes.push({ kind: "path", d: lp.bowl, fill, stroke: line, sw: 1.2, transform: t, step });
      shapes.push({ kind: "path", d: lp.flame, fill: "#ffb703", stroke: "#ff6b00", sw: 1, transform: t, step });
    }
    return;
  }
  if (type === "scallop") {
    let d = "";
    for (let i = 0; i < count; i++) {
      const a0 = ((i * 360) / count + offset) * (Math.PI / 180);
      const a1 = (((i + 1) * 360) / count + offset) * (Math.PI / 180);
      const am = (a0 + a1) / 2;
      const p0 = [cx + Math.sin(a0) * r0, cy - Math.cos(a0) * r0];
      const p1 = [cx + Math.sin(a1) * r0, cy - Math.cos(a1) * r0];
      const c = [cx + Math.sin(am) * r1 * 1.08, cy - Math.cos(am) * r1 * 1.08];
      d += `${i === 0 ? `M${f(p0[0])} ${f(p0[1])}` : ""}Q${f(c[0])} ${f(c[1])} ${f(p1[0])} ${f(p1[1])}`;
    }
    const hole = `M${f(cx - r0)} ${cy}a${f(r0)} ${f(r0)} 0 1 0 ${f(2 * r0)} 0a${f(r0)} ${f(r0)} 0 1 0 ${f(-2 * r0)} 0Z`;
    shapes.push({ kind: "path", d: d + "Z" + hole, fill, stroke: line, sw: 2, step, draw: true, evenodd: true });
    return;
  }
  for (let i = 0; i < count; i++) {
    const t = rot((i * 360) / count + offset, cx, cy);
    const d = petalPath(cx, cy, r0, r1, w, type);
    if (type === "swirl") shapes.push({ kind: "path", d, fill: "none", stroke: fill, sw: 3, transform: t, step, draw: true });
    else shapes.push({ kind: "path", d, fill, stroke: line, sw: 1.6, transform: t, step });
    if (type === "petal" || type === "round") {
      const inner = petalPath(cx, cy, r0 + (r1 - r0) * 0.25, r1 - (r1 - r0) * 0.2, w * 0.4, "leaf");
      shapes.push({ kind: "path", d: inner, fill: line, opacity: 0.75, transform: t, step });
    }
  }
}

export function ringStep(p: RingPlan, colourName: string) {
  return `Around it, draw ${p.count} ${RING_NAMES[p.type]} and fill with ${colourName}.`;
}

export function colourName(hex: string) {
  const names: Record<string, string> = {
    "#f2a900": "turmeric yellow", "#2e8b3d": "sugarcane green", "#d7263d": "kumkum red", "#ff7a00": "marigold orange", "#7cc242": "tender-leaf green",
    "#ffb703": "gold", "#e0457b": "rani pink", "#8e44ad": "violet", "#ff6b35": "saffron", "#00a6a6": "teal", "#ffd166": "light gold",
    "#0f6e8c": "peacock blue", "#16a085": "jade", "#1f3fbf": "royal blue", "#d4af37": "antique gold", "#e75480": "lotus pink",
    "#ffffff": "rice-flour white", "#fffaf0": "rice-flour white", "#b5341f": "kaavi red", "#e63946": "crimson", "#ff9f1c": "marigold",
  };
  return names[hex.toLowerCase()] ?? "colour powder";
}

export function renderPoo(spec: KolamSpec): RenderModel {
  const size = 600;
  const cx = 300;
  const cy = 300;
  const R = rng(spec.seed ?? 11);
  const pal = paletteOf(spec.palette ?? "pookalam");
  const bgName = spec.background ?? "earth";
  const bg = BACKGROUNDS[bgName];
  const line = lineColorFor(bgName, pal);
  const sym = Math.max(4, Math.min(24, spec.symmetry ?? 8));
  const layers = Math.max(2, Math.min(8, spec.layers ?? 5));
  const shapes: Shape[] = [];
  const steps: string[] = [];

  shapes.push({ kind: "circle", cx, cy, r: 46, fill: pal.colors[0], stroke: line, sw: 2.5, step: 0, draw: true });
  shapes.push({ kind: "circle", cx, cy, r: 26, fill: pal.colors[2 % pal.colors.length], stroke: line, sw: 2, step: 0 });
  for (let i = 0; i < sym; i++) {
    shapes.push({ kind: "path", d: petalPath(cx, cy, 4, 24, 5, "petal"), fill: line, transform: rot((i * 360) / sym, cx, cy), step: 0 });
  }
  steps.push(`Mark the centre and draw a circle (about one palm wide). Fill it with ${colourName(pal.colors[0])} and add a small ${sym}-petal flower inside.`);

  const plans = planRings(R, pal, sym, layers, 46, 270, false);
  plans.forEach((p, k) => {
    drawRing(shapes, p, cx, cy, line, k + 1);
    steps.push(ringStep(p, colourName(p.fill)));
  });
  shapes.push({ kind: "circle", cx, cy, r: 284, fill: "none", stroke: line, sw: 2, step: layers + 1, draw: true });
  steps.push("Finish with a thin outer circle of rice flour so the colours stay crisp. Sprinkle a few loose petals around for a festive touch.");
  return {
    size, background: bg.color, floorTexture: bg.texture, shapes, dots: [], dotColor: line, steps,
    stats: { symmetry: `${sym}-fold`, rings: layers, palette: pal.label },
  };
}
