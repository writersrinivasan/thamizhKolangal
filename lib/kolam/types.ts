// Core types for the kolam drawing engine.
// A KolamSpec is a small, serialisable description of a kolam. The engine turns it into
// a RenderModel (plain SVG shapes) deterministically, so the AI agent, the catalogue and the
// studio all speak the same language.

export type KolamKind = "sikku" | "pulli" | "poo" | "padi" | "motif";

export type DotShape = "square" | "diamond" | "octagon" | "rect";

export type MotifName =
  | "pongal-pot"
  | "diya"
  | "lotus"
  | "sun"
  | "kalasam"
  | "star"
  | "ther"
  | "cow"
  | "peacock"
  | "karthigai-lamps";

export type PaletteName =
  | "rice-flour"
  | "pongal"
  | "deepavali"
  | "margazhi"
  | "karthigai"
  | "peacock"
  | "temple"
  | "lotus"
  | "pookalam"
  | "navaratri"
  | "rainbow";

export type BackgroundName = "earth" | "kaavi" | "night" | "cream" | "leaf" | "slate";

export interface KolamSpec {
  kind: KolamKind;
  /** Dots per side (sikku / pulli). Odd numbers look most traditional. */
  dots?: number;
  /** Rows for rectangular grids (defaults to dots). */
  rows?: number;
  shape?: DotShape;
  /** sikku only: one unbroken line (true kolam) or many colourful loops. */
  singleLine?: boolean;
  /** 0..1 — how many "turns" (mirrors) the line makes around dots. */
  density?: number;
  /** Petal symmetry for poo / motif rings. */
  symmetry?: number;
  /** Number of rings / layers for poo, padi and motif kinds. */
  layers?: number;
  motif?: MotifName;
  palette?: PaletteName;
  background?: BackgroundName;
  showDots?: boolean;
  seed?: number;
}

export interface Shape {
  kind: "path" | "circle";
  d?: string;
  cx?: number;
  cy?: number;
  r?: number;
  fill?: string;
  stroke?: string;
  sw?: number;
  opacity?: number;
  transform?: string;
  evenodd?: boolean;
  /** Index into RenderModel.steps – used for step-by-step reveal. */
  step: number;
  /** Strokes that should animate as if drawn by hand. */
  draw?: boolean;
}

export interface RenderModel {
  size: number;
  background: string;
  floorTexture: string;
  shapes: Shape[];
  dots: { x: number; y: number }[];
  dotColor: string;
  steps: string[];
  stats: Record<string, string | number>;
}
