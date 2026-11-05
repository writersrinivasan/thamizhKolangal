// Padi kolam: geometric "step" kolams of parallel double lines — squares, eight-pointed stars
// and stepped borders, traditionally drawn with rice flour and edged with red kaavi.

import type { KolamSpec, RenderModel, Shape } from "./types";
import { rng, f } from "./rng";
import { BACKGROUNDS, lineColorFor, paletteOf } from "./palettes";
import { colourName } from "./poo";

function poly(cx: number, cy: number, r: number, n: number, rotDeg: number) {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((rotDeg + (i * 360) / n) * Math.PI) / 180;
    pts.push(`${f(cx + Math.sin(a) * r)} ${f(cy - Math.cos(a) * r)}`);
  }
  return `M${pts.join("L")}Z`;
}

function starPath(cx: number, cy: number, ro: number, ri: number, n: number, rotDeg = 0) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro;
    const a = ((rotDeg + (i * 180) / n) * Math.PI) / 180;
    pts.push(`${f(cx + Math.sin(a) * r)} ${f(cy - Math.cos(a) * r)}`);
  }
  return `M${pts.join("L")}Z`;
}

function steppedSquare(cx: number, cy: number, r: number, stepsN: number) {
  // a square whose corners are cut into stairs (padi)
  const s = r / (stepsN + 2);
  const pts: [number, number][] = [];
  // top edge left->right with stepped corners, built for one quadrant then mirrored
  const quad: [number, number][] = [];
  for (let k = 0; k <= stepsN; k++) {
    quad.push([r - s * (stepsN - k + 1), -r + s * k]);
    quad.push([r - s * (stepsN - k), -r + s * k]);
  }
  const rotPt = ([x, y]: [number, number], q: number): [number, number] => {
    for (let i = 0; i < q; i++) [x, y] = [-y, x];
    return [x, y];
  };
  for (let q = 0; q < 4; q++) quad.forEach((p) => pts.push(rotPt(p, q)));
  return "M" + pts.map(([x, y]) => `${f(cx + x)} ${f(cy + y)}`).join("L") + "Z";
}

export function renderPadi(spec: KolamSpec): RenderModel {
  const size = 600;
  const cx = 300;
  const cy = 300;
  const R = rng(spec.seed ?? 3);
  const pal = paletteOf(spec.palette ?? "temple");
  const bgName = spec.background ?? "kaavi";
  const bg = BACKGROUNDS[bgName];
  const line = lineColorFor(bgName, pal);
  const layers = Math.max(2, Math.min(7, spec.layers ?? 4));
  const pts = spec.symmetry && spec.symmetry >= 6 ? (spec.symmetry >= 12 ? 12 : 8) : 8;
  const shapes: Shape[] = [];
  const steps: string[] = [];

  const dbl = (d: string, step: number, fill = "none", w = 3) => {
    shapes.push({ kind: "path", d, fill, stroke: line, sw: w * 3.2, step, draw: true });
    shapes.push({ kind: "path", d, fill: "none", stroke: bg.color, sw: w * 1.4, step });
  };

  // centre star
  const rStar = 70;
  dbl(starPath(cx, cy, rStar, rStar * 0.5, pts), 0, pal.colors[0]);
  shapes.push({ kind: "circle", cx, cy, r: 16, fill: pal.colors[1 % pal.colors.length], stroke: line, sw: 3, step: 0 });
  steps.push(`Start with an ${pts}-pointed star of double lines at the centre (two parallel lines, a finger apart). Fill it with ${colourName(pal.colors[0])}; place a round bindu in the middle.`);

  let r = rStar + 25;
  const band = (265 - r) / layers;
  for (let k = 0; k < layers; k++) {
    const kind = R.pick(["square", "rot", "stepped", "octagon", "star"] as const);
    const rr = r + band * (k + 0.6);
    const step = k + 1;
    const fill = k === layers - 1 ? "none" : "none";
    switch (kind) {
      case "square":
        dbl(poly(cx, cy, rr * 1.15, 4, 45), step, fill);
        steps.push(`Draw a double-lined square around it (sides parallel to the doorway).`);
        break;
      case "rot":
        dbl(poly(cx, cy, rr * 1.1, 4, 0), step, fill);
        steps.push(`Draw a double-lined diamond (square turned 45°) so its corners point to the four directions.`);
        break;
      case "stepped":
        dbl(steppedSquare(cx, cy, rr * 0.92, R.int(2, 4)), step, fill);
        steps.push(`Draw a "padi" — a square with stair-step corners — using double lines.`);
        break;
      case "octagon":
        dbl(poly(cx, cy, rr, 8, 22.5), step, fill);
        steps.push(`Draw a double-lined octagon (ettu-kona) around the previous layer.`);
        break;
      default:
        dbl(starPath(cx, cy, rr * 1.08, rr * 0.82, 8, 22.5), step, fill);
        steps.push(`Draw a soft eight-pointed star of double lines.`);
    }
    // decorations between layers
    const nDec = 8;
    const decR = rr - band * 0.25;
    for (let i = 0; i < nDec; i++) {
      const a = ((i * 360) / nDec + 22.5) * (Math.PI / 180);
      const x = f(cx + Math.sin(a) * decR);
      const y = f(cy - Math.cos(a) * decR);
      shapes.push({ kind: "circle", cx: x, cy: y, r: f(Math.max(4, band * 0.12)), fill: pal.colors[(k + 2) % pal.colors.length], stroke: line, sw: 1.5, step });
    }
    r += 0;
  }
  // corner loops (kaal) at the four corners
  const cr = 30;
  for (const [x, y] of [[40, 40], [560, 40], [40, 560], [560, 560]]) {
    shapes.push({ kind: "circle", cx: x, cy: y, r: cr * 0.8, fill: "none", stroke: line, sw: 6, step: layers + 1, draw: true });
    shapes.push({ kind: "circle", cx: x, cy: y, r: cr * 0.3, fill: pal.colors[2 % pal.colors.length], stroke: line, sw: 2, step: layers + 1 });
  }
  steps.push("Decorate each corner with a small round 'kaal' loop. If drawn at a doorstep or puja room, edge the outer lines with red kaavi for a temple look.");
  return {
    size, background: bg.color, floorTexture: bg.texture, shapes, dots: [], dotColor: line, steps,
    stats: { layers, star: `${pts}-point`, style: "double-line padi" },
  };
}
