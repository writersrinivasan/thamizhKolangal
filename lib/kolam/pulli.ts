// Pulli kolam (dot-joining kolam): dots are placed in a grid and joined with lines, petals,
// leaves and diamonds, ring by ring from the centre — the everyday "vaasal kolam" style.

import type { KolamSpec, RenderModel, Shape } from "./types";
import { rng, f } from "./rng";
import { BACKGROUNDS, lineColorFor, paletteOf } from "./palettes";
import { dotMask } from "./sikku";
import { colourName } from "./poo";

type Tile = "petals" | "circle" | "diamond" | "leaf" | "star" | "join" | "lens" | "loop";
const TILE_TEXT: Record<Tile, string> = {
  petals: "four small petals around each dot",
  circle: "a round loop around each dot",
  diamond: "a diamond joining the gaps around each dot",
  leaf: "a leaf pointing towards the centre from each dot",
  star: "a four-point star on each dot",
  join: "straight lines joining neighbouring dots",
  lens: "petal curves joining each dot to its neighbours towards the centre",
  loop: "a rounded loop swinging around each dot and touching its neighbours",
};

export function renderPulli(spec: KolamSpec): RenderModel {
  const size = 600;
  const n = Math.max(3, Math.min(17, Math.round(spec.dots ?? 9)));
  const shape = spec.shape === "rect" ? "square" : spec.shape ?? "diamond";
  const R = rng(spec.seed ?? 5);
  const pal = paletteOf(spec.palette ?? "pongal");
  const bgName = spec.background ?? "earth";
  const bg = BACKGROUNDS[bgName];
  const line = lineColorFor(bgName, pal);
  const active = dotMask(shape, n, n);
  const gap = (size - 70) / n;
  const o = (size - gap * (n - 1)) / 2;
  const c = (n - 1) / 2;
  const P = (i: number, j: number) => ({ x: f(o + i * gap), y: f(o + j * gap) });
  const ringOf = (i: number, j: number) =>
    shape === "diamond" ? Math.abs(i - c) + Math.abs(j - c) : Math.max(Math.abs(i - c), Math.abs(j - c));

  const maxRing = Math.ceil(shape === "diamond" ? c : c);
  const tiles: Tile[] = ["lens", "lens", "loop", "petals", "lens", "diamond", "star", "loop", "join", "circle", "leaf"];
  const ringTile: Tile[] = [];
  for (let r = 0; r <= maxRing; r++) ringTile.push(r === 0 ? R.pick(["star", "petals", "circle"] as Tile[]) : R.pick(tiles));

  const shapes: Shape[] = [];
  const dots: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (active(i, j)) dots.push(P(i, j));

  const h = gap / 2;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      if (!active(i, j)) continue;
      const r = Math.round(ringOf(i, j));
      const tile = ringTile[Math.min(r, ringTile.length - 1)];
      const { x, y } = P(i, j);
      const fill = pal.colors[r % pal.colors.length];
      const step = 1 + r;
      switch (tile) {
        case "circle":
          shapes.push({ kind: "circle", cx: x, cy: y, r: f(h * 0.78), fill, stroke: line, sw: 2, step, draw: true });
          break;
        case "diamond":
          shapes.push({ kind: "path", d: `M${x} ${f(y - h * 0.95)}L${f(x + h * 0.95)} ${y}L${x} ${f(y + h * 0.95)}L${f(x - h * 0.95)} ${y}Z`, fill, stroke: line, sw: 2, step, draw: true });
          break;
        case "star":
          shapes.push({ kind: "path", d: `M${x} ${f(y - h)}Q${x} ${y} ${f(x + h)} ${y}Q${x} ${y} ${x} ${f(y + h)}Q${x} ${y} ${f(x - h)} ${y}Q${x} ${y} ${x} ${f(y - h)}Z`, fill, stroke: line, sw: 1.8, step, draw: true });
          break;
        case "leaf": {
          const ang = Math.atan2(y - 300, x - 300) * (180 / Math.PI) - 90;
          const d = `M${x} ${f(y - h * 0.15)}Q${f(x + h * 0.7)} ${f(y + h * 0.4)} ${x} ${f(y + h * 1.05)}Q${f(x - h * 0.7)} ${f(y + h * 0.4)} ${x} ${f(y - h * 0.15)}Z`;
          shapes.push({ kind: "path", d, fill, stroke: line, sw: 1.8, step, transform: `rotate(${f(ang + 180)} ${x} ${y})` });
          break;
        }
        case "lens": {
          // petal (lens) from this dot to every neighbour one ring closer to the centre
          const nbrs = shape === "diamond" ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
          let any = false;
          for (const [di, dj] of nbrs) {
            if (!active(i + di, j + dj) || Math.round(ringOf(i + di, j + dj)) !== r - 1) continue;
            any = true;
            const q = P(i + di, j + dj);
            const mx = (x + q.x) / 2, my = (y + q.y) / 2;
            const nx = -(q.y - y) * 0.32, ny = (q.x - x) * 0.32;
            shapes.push({ kind: "path", d: `M${x} ${y}Q${f(mx + nx)} ${f(my + ny)} ${q.x} ${q.y}Q${f(mx - nx)} ${f(my - ny)} ${x} ${y}Z`, fill, stroke: line, sw: 2, step, draw: true });
          }
          if (!any) shapes.push({ kind: "circle", cx: x, cy: y, r: f(h * 0.6), fill, stroke: line, sw: 2, step, draw: true });
          break;
        }
        case "loop": {
          // rounded square loop around the dot whose corners kiss the neighbouring gaps
          const k = h * 0.98, c2 = h * 0.62;
          const d = `M${x} ${f(y - k)}C${f(x + c2)} ${f(y - k)} ${f(x + k)} ${f(y - c2)} ${f(x + k)} ${y}C${f(x + k)} ${f(y + c2)} ${f(x + c2)} ${f(y + k)} ${x} ${f(y + k)}C${f(x - c2)} ${f(y + k)} ${f(x - k)} ${f(y + c2)} ${f(x - k)} ${y}C${f(x - k)} ${f(y - c2)} ${f(x - c2)} ${f(y - k)} ${x} ${f(y - k)}Z`;
          shapes.push({ kind: "path", d, fill, stroke: line, sw: 2.2, step, draw: true, transform: `rotate(45 ${x} ${y})` });
          break;
        }
        case "join": {
          for (const [di, dj] of [[1, 0], [0, 1]]) {
            if (active(i + di, j + dj) && Math.round(ringOf(i + di, j + dj)) === r) {
              const q = P(i + di, j + dj);
              shapes.push({ kind: "path", d: `M${x} ${y}L${q.x} ${q.y}`, stroke: fill, sw: 4, fill: "none", step, draw: true });
            }
          }
          if (shape === "diamond")
            for (const [di, dj] of [[1, 1], [1, -1]]) {
              if (active(i + di, j + dj) && Math.round(ringOf(i + di, j + dj)) === r) {
                const q = P(i + di, j + dj);
                shapes.push({ kind: "path", d: `M${x} ${y}L${q.x} ${q.y}`, stroke: fill, sw: 4, fill: "none", step, draw: true });
              }
            }
          shapes.push({ kind: "circle", cx: x, cy: y, r: f(h * 0.3), fill, stroke: line, sw: 1.5, step });
          break;
        }
        default:
          for (let k = 0; k < 4; k++) {
            const d = `M${x} ${y}C${f(x + h * 0.45)} ${f(y - h * 0.25)} ${f(x + h * 0.35)} ${f(y - h * 0.85)} ${x} ${f(y - h * 0.95)}C${f(x - h * 0.35)} ${f(y - h * 0.85)} ${f(x - h * 0.45)} ${f(y - h * 0.25)} ${x} ${y}Z`;
            shapes.push({ kind: "path", d, fill, stroke: line, sw: 1.5, transform: `rotate(${45 + k * 90} ${x} ${y})`, step });
          }
      }
    }

  const steps = [`Place ${dots.length} dots: a ${n}×${n} ${shape === "diamond" ? "diamond (idukku pulli — rows grow 1, 3, 5… and shrink again)" : "square (ner pulli)"} grid.`];
  ringTile.forEach((t, r) => {
    const fill = pal.colors[r % pal.colors.length];
    steps.push(r === 0 ? `At the centre dot, draw ${TILE_TEXT[t].replace("each dot", "the dot")} in ${colourName(fill)}.` : `Ring ${r}: draw ${TILE_TEXT[t]} — fill with ${colourName(fill)}.`);
  });
  return {
    size, background: bg.color, floorTexture: bg.texture, shapes, dots, dotColor: line, steps,
    stats: { dots: dots.length, grid: `${n}×${n} ${shape}`, rings: ringTile.length },
  };
}
