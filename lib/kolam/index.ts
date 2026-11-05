import type { KolamSpec, RenderModel } from "./types";
import { renderSikku } from "./sikku";
import { renderPulli } from "./pulli";
import { renderPoo } from "./poo";
import { renderPadi } from "./padi";
import { renderMotif } from "./motifs";

export * from "./types";
export { PALETTES, BACKGROUNDS } from "./palettes";
export { MOTIF_INFO } from "./motifs";

function renderRaw(spec: KolamSpec): RenderModel {
  switch (spec.kind) {
    case "sikku":
      return renderSikku(spec);
    case "pulli":
      return renderPulli(spec);
    case "padi":
      return renderPadi(spec);
    case "motif":
      return renderMotif(spec);
    default:
      return renderPoo(spec);
  }
}

// Math.sin/cos can differ in the last bits between the server (Node) and the browser, which
// breaks React hydration. Rounding every coordinate to 2 decimals makes output identical everywhere.
const r2 = (n: number) => Math.round(n * 100) / 100;
const roundNums = (s: string) => s.replace(/-?\d+\.\d+(?:e-?\d+)?/gi, (m) => String(r2(parseFloat(m))));

export function renderKolam(spec: KolamSpec): RenderModel {
  const m = renderRaw(spec);
  return {
    ...m,
    shapes: m.shapes.map((s) => ({
      ...s,
      d: s.d === undefined ? undefined : roundNums(s.d),
      transform: s.transform === undefined ? undefined : roundNums(s.transform),
      cx: s.cx === undefined ? undefined : r2(s.cx),
      cy: s.cy === undefined ? undefined : r2(s.cy),
      r: s.r === undefined ? undefined : r2(s.r),
      sw: s.sw === undefined ? undefined : r2(s.sw),
    })),
    dots: m.dots.map((d) => ({ x: r2(d.x), y: r2(d.y) })),
  };
}

/** Serialises a RenderModel to a standalone SVG string (for downloads). */
export function toSvgString(m: RenderModel, opts: { dots?: boolean } = {}): string {
  const esc = (v: unknown) => String(v).replace(/"/g, "&quot;");
  const attrs = (o: Record<string, unknown>) =>
    Object.entries(o)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}="${esc(v)}"`)
      .join(" ");
  const body = m.shapes
    .map((s) => {
      const common = { fill: s.fill ?? "none", stroke: s.stroke, "stroke-width": s.sw, opacity: s.opacity, transform: s.transform, "fill-rule": s.evenodd ? "evenodd" : undefined, "stroke-linecap": "round", "stroke-linejoin": "round" };
      return s.kind === "circle" ? `<circle ${attrs({ cx: s.cx, cy: s.cy, r: s.r, ...common })}/>` : `<path ${attrs({ d: s.d, ...common })}/>`;
    })
    .join("");
  const dots = opts.dots !== false ? m.dots.map((d) => `<circle cx="${d.x}" cy="${d.y}" r="3.2" fill="${m.dotColor}"/>`).join("") : "";
  const defs = `<defs><filter id="floor" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="11" result="big"/><feColorMatrix in="big" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 0 0 0 -0.42" result="blotch"/><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="4" result="fine"/><feColorMatrix in="fine" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.95  0.32 0 0 0 -0.11" result="grit"/><feMerge><feMergeNode in="blotch"/><feMergeNode in="grit"/></feMerge></filter><filter id="flour" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="5" result="noise"/><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" result="wave"/><feDisplacementMap in="SourceGraphic" in2="wave" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="hand"/><feDisplacementMap in="hand" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="wob"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.8" result="mask"/><feComposite in="wob" in2="mask" operator="in" result="grain"/><feGaussianBlur in="wob" stdDeviation="1.4" result="halo"/><feComponentTransfer in="halo" result="dust"><feFuncA type="linear" slope="0.4"/></feComponentTransfer><feMerge><feMergeNode in="dust"/><feMergeNode in="grain"/></feMerge></filter><radialGradient id="sheen" cx="42%" cy="38%" r="75%"><stop offset="0%" stop-color="#fff" stop-opacity="0.09"/><stop offset="55%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.32"/></radialGradient></defs>`;
  const dotsG = dots.replace(/r="3.2"/g, 'r="3.6"');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m.size} ${m.size}" width="1200" height="1200">${defs}<rect width="100%" height="100%" fill="${m.background}"/><rect width="100%" height="100%" fill="${m.background}" filter="url(#floor)"/><rect width="100%" height="100%" fill="url(#sheen)"/><g filter="url(#flour)" stroke-linecap="round" stroke-linejoin="round">${body}${dotsG}</g></svg>`;
}

export function describeSpec(spec: KolamSpec): string {
  const parts: string[] = [spec.kind];
  if (spec.dots) parts.push(`${spec.dots} dots`);
  if (spec.shape) parts.push(spec.shape);
  if (spec.motif) parts.push(spec.motif);
  if (spec.palette) parts.push(spec.palette);
  return parts.join(" · ");
}
