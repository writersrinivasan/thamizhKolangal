// Sikku / kambi kolam generator.
//
// Dots sit at odd lattice coordinates (2i+1, 2j+1). The line travels diagonally between dots,
// visiting the lattice points whose coordinates sum to an odd number (the gaps between two dots).
// At the edge of the dot field it bounces back (looping around the outer dot). Inside, a gap can
// hold a "mirror" which makes the line turn around a dot instead of crossing straight through.
// Every diamond edge around every dot is travelled exactly once — exactly how a sikku kolam
// weaves around each pulli. A greedy pass toggles mirrors until the whole kolam is ONE line.

import type { KolamSpec, RenderModel, Shape } from "./types";
import { rng, f } from "./rng";
import { BACKGROUNDS, lineColorFor, paletteOf } from "./palettes";

type P = [number, number];

export function dotMask(shape: KolamSpec["shape"], cols: number, rows: number) {
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  return (i: number, j: number) => {
    if (i < 0 || j < 0 || i >= cols || j >= rows) return false;
    switch (shape) {
      case "diamond":
        return Math.abs(i - cx) + Math.abs(j - cy) <= Math.min(cx, cy) + 0.01;
      case "octagon": {
        const cut = Math.floor(Math.min(cols, rows) / 3.4);
        const dx = Math.min(i, cols - 1 - i);
        const dy = Math.min(j, rows - 1 - j);
        return dx + dy >= cut;
      }
      default:
        return true;
    }
  };
}

interface Field {
  W: number;
  H: number;
  active: (i: number, j: number) => boolean;
  mirrors: Set<string>;
}

const key = (x: number, y: number) => `${x},${y}`;

function dotAt(F: Field, x: number, y: number) {
  if (x % 2 === 0 || y % 2 === 0) return false;
  return F.active((x - 1) / 2, (y - 1) / 2);
}

/** Returns the outgoing direction after arriving at point Q with direction d. */
function turn(F: Field, q: P, d: P): P {
  const [x, y] = q;
  const vertical = x % 2 !== 0; // gap between a dot above and a dot below
  const a = vertical ? dotAt(F, x, y - 1) : dotAt(F, x - 1, y);
  const b = vertical ? dotAt(F, x, y + 1) : dotAt(F, x + 1, y);
  if (a && b) {
    if (!F.mirrors.has(key(x, y))) return d;
    return vertical ? [-d[0], d[1]] : [d[0], -d[1]];
  }
  // boundary bounce
  return vertical ? [d[0], -d[1]] : [-d[0], d[1]];
}

function interiorPoints(F: Field): P[] {
  const out: P[] = [];
  for (let x = 0; x <= 2 * F.W; x++)
    for (let y = 0; y <= 2 * F.H; y++) {
      if ((x + y) % 2 === 0) continue;
      const vertical = x % 2 !== 0;
      const a = vertical ? dotAt(F, x, y - 1) : dotAt(F, x - 1, y);
      const b = vertical ? dotAt(F, x, y + 1) : dotAt(F, x + 1, y);
      if (a && b) out.push([x, y]);
    }
  return out;
}

function trace(F: Field) {
  const edgeLoop = new Map<string, number>();
  const loops: P[][] = [];
  for (let i = 0; i < F.W; i++)
    for (let j = 0; j < F.H; j++) {
      if (!F.active(i, j)) continue;
      const x = 2 * i + 1;
      const y = 2 * j + 1;
      for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as P[]) {
        const ek = key(2 * x + sx, 2 * y + sy);
        if (edgeLoop.has(ek)) continue;
        const id = loops.length;
        const start: P = [x + sx, y];
        const d0: P = [-sx, sy];
        let p: P = start;
        let d: P = d0;
        const pts: P[] = [start];
        for (let guard = 0; guard < 100000; guard++) {
          edgeLoop.set(key(2 * p[0] + d[0], 2 * p[1] + d[1]), id);
          const q: P = [p[0] + d[0], p[1] + d[1]];
          const nd = turn(F, q, d);
          p = q;
          d = nd;
          if (p[0] === start[0] && p[1] === start[1] && d[0] === d0[0] && d[1] === d0[1]) break;
          pts.push(p);
        }
        loops.push(pts);
      }
    }
  return { loops, edgeLoop };
}

function orbit(F: Field, [x, y]: P): P[] {
  const W2 = 2 * F.W;
  const H2 = 2 * F.H;
  const set = new Map<string, P>();
  const add = (p: P) => set.set(key(p[0], p[1]), p);
  const base: P[] = [[x, y], [W2 - x, y], [x, H2 - y], [W2 - x, H2 - y]];
  base.forEach(add);
  if (F.W === F.H) base.forEach(([a, b]) => add([b, a]));
  return [...set.values()];
}

function toggle(F: Field, pts: P[]) {
  for (const [x, y] of pts) {
    const k = key(x, y);
    if (F.mirrors.has(k)) F.mirrors.delete(k);
    else F.mirrors.add(k);
  }
}

function loopsAt(edgeLoop: Map<string, number>, [x, y]: P) {
  const s = new Set<number>();
  for (const [sx, sy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const id = edgeLoop.get(key(2 * x + sx, 2 * y + sy));
    if (id !== undefined) s.add(id);
  }
  return s;
}

export function buildSikku(spec: KolamSpec) {
  const cols = clamp(spec.dots ?? 7, 2, 21);
  const rows = spec.shape === "rect" ? clamp(spec.rows ?? cols - 2, 2, 21) : cols;
  const R = rng(spec.seed ?? 7);
  const F: Field = { W: cols, H: rows, active: dotMask(spec.shape, cols, rows), mirrors: new Set() };
  const interior = interiorPoints(F);
  const density = spec.density ?? 0.45;

  // symmetric random mirrors
  const seen = new Set<string>();
  for (const p of interior) {
    const k = key(p[0], p[1]);
    if (seen.has(k)) continue;
    const orb = orbit(F, p).filter((q) => interior.some((r) => r[0] === q[0] && r[1] === q[1]));
    orb.forEach((q) => seen.add(key(q[0], q[1])));
    if (R.next() < density) toggle(F, orb);
  }

  let { loops, edgeLoop } = trace(F);

  if (spec.singleLine !== false) {
    const order = R.shuffle([...interior]);
    let safety = 0;
    while (loops.length > 1 && safety++ < 4000) {
      const cand = order.find((p) => loopsAt(edgeLoop, p).size > 1);
      if (!cand) break;
      // try to keep symmetry by toggling the whole orbit first
      const orb = orbit(F, cand).filter((q) => interior.some((r) => r[0] === q[0] && r[1] === q[1]));
      toggle(F, orb);
      let t = trace(F);
      if (t.loops.length >= loops.length) {
        toggle(F, orb);
        toggle(F, [cand]);
        t = trace(F);
      }
      loops = t.loops;
      edgeLoop = t.edgeLoop;
    }
  }
  return { F, loops, cols, rows };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, Math.round(n)));
}

/**
 * Draws a sikku loop the way a hand does: every stretch between two gaps swings round its dot.
 *
 * Each visited point is a gap between dots. We pick a tangent there and join consecutive gaps
 * with cubic curves, so the line bulges around the dot it passes, like real rice flour.
 *  - Straight crossing: the tangent leans toward the line between the two dots, so the strands
 *    still cross in an X but each dot gets a round, full loop.
 *  - Turn or edge bounce: the tangent is the average of in/out directions, giving a smooth U-turn
 *    (and a perfect round cap around outer dots).
 */
export function smoothClosedPath(pts: P[], s: number, ox: number, oy: number, roundness = 0.75) {
  const n = pts.length;
  const X = (x: number) => f(ox + x * s);
  const Y = (y: number) => f(oy + y * s);
  const tangents: [number, number][] = pts.map((p, i) => {
    const prev = pts[(i - 1 + n) % n];
    const next = pts[(i + 1) % n];
    const din: P = [p[0] - prev[0], p[1] - prev[1]];
    const dout: P = [next[0] - p[0], next[1] - p[1]];
    let tx: number, ty: number;
    if (din[0] === dout[0] && din[1] === dout[1]) {
      const vertical = p[0] % 2 !== 0; // dots above & below -> lean horizontally
      tx = din[0] + (vertical ? roundness * din[0] : 0);
      ty = din[1] + (vertical ? 0 : roundness * din[1]);
    } else {
      tx = din[0] + dout[0];
      ty = din[1] + dout[1];
    }
    const len = Math.hypot(tx, ty) || 1;
    return [tx / len, ty / len];
  });
  const L = 0.56; // ≈ circle handle for a quarter turn of radius 1 (in lattice units)
  let d = `M${X(pts[0][0])} ${Y(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    const ta = tangents[i];
    const tb = tangents[(i + 1) % n];
    d += `C${X(a[0] + ta[0] * L)} ${Y(a[1] + ta[1] * L)} ${X(b[0] - tb[0] * L)} ${Y(b[1] - tb[1] * L)} ${X(b[0])} ${Y(b[1])}`;
  }
  return d + "Z";
}

export function renderSikku(spec: KolamSpec): RenderModel {
  const size = 600;
  const { F, loops, cols, rows } = buildSikku(spec);
  const pal = paletteOf(spec.palette);
  const bgName = spec.background ?? "earth";
  const bg = BACKGROUNDS[bgName];
  const line = lineColorFor(bgName, pal);
  const s = (size - 60) / (2 * Math.max(cols, rows));
  const ox = (size - 2 * cols * s) / 2;
  const oy = (size - 2 * rows * s) / 2;
  const single = loops.length === 1;
  const sw = Math.max(2.4, Math.min(6.5, s * 0.26));

  const shapes: Shape[] = [];
  const dots: { x: number; y: number }[] = [];
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      if (F.active(i, j)) dots.push({ x: f(ox + (2 * i + 1) * s), y: f(oy + (2 * j + 1) * s) });

  // soft coloured "kattam" glow under each dot
  if (pal.name !== "rice-flour") {
    dots.forEach((p, idx) => {
      const ring = Math.round(Math.hypot(p.x - size / 2, p.y - size / 2) / (2 * s));
      shapes.push({ kind: "circle", cx: p.x, cy: p.y, r: f(s * 0.5), fill: pal.colors[ring % pal.colors.length], opacity: 0.9, step: 0 });
      void idx;
    });
  }

  const sorted = [...loops].sort((a, b) => b.length - a.length);
  sorted.forEach((pts, i) => {
    const d = smoothClosedPath(pts, s, ox, oy);
    const color = single || pal.name === "rice-flour" ? line : pal.colors[i % pal.colors.length];
        shapes.push({ kind: "path", d, stroke: color, sw, fill: "none", step: 1 + Math.min(i, 5), draw: true });
  });

  const shapeName = spec.shape === "rect" ? `${cols}×${rows}` : `${cols}×${cols}`;
  const steps = [
    `Sweep and wash the floor, then place ${dots.length} pulli (dots) in a ${spec.shape ?? "square"} ${shapeName} grid with even spacing.${pal.name !== "rice-flour" ? " Optionally colour a small circle behind each dot." : ""}`,
  ];
  if (single) {
    steps.push(
      "Start at any gap between two outer dots. Move diagonally, curving around each dot — never touch a dot and never lift your hand.",
      "At the edge, loop around the outer dot and come back in. Where the design turns, swing around the dot instead of crossing.",
      `Keep going: this kolam is one single unbroken line (${pointsCount(loops)} turns) that returns to where you began.`,
    );
  } else {
    sorted.slice(0, 6).forEach((pts, i) =>
      steps.push(
        i < 5
          ? `Draw loop ${i + 1} (${pts.length} turns) — weave diagonally between dots, rounding each corner.`
          : `Finish the remaining ${sorted.length - 5} small loops in the same way.`,
      ),
    );
  }
  return {
    size,
    background: bg.color,
    floorTexture: bg.texture,
    shapes,
    dots,
    dotColor: bgName === "cream" ? "#7a1f12" : "#fffaf0",
    steps,
    stats: { dots: dots.length, lines: loops.length, grid: shapeName, "one-line": single ? "yes" : "no" },
  };
}

function pointsCount(loops: P[][]) {
  return loops.reduce((a, l) => a + l.length, 0);
}
