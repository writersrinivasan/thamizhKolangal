import type { KolamSpec } from "../kolam/types";

export interface KolamTypeInfo {
  slug: string;
  name: string;
  tamil: string;
  engine: KolamSpec["kind"];
  summary: string;
  howTo: string[];
  sample: KolamSpec;
}

export const KOLAM_TYPES: KolamTypeInfo[] = [
  {
    slug: "pulli",
    name: "Pulli Kolam",
    tamil: "புள்ளிக் கோலம்",
    engine: "pulli",
    summary: "Dots (pulli) are placed first, then joined with lines, petals and loops. Ner pulli uses a straight square grid; idukku / oodu pulli uses staggered rows that grow and shrink like a diamond.",
    howTo: ["Place the dots evenly — the spacing decides the whole kolam", "Work from the centre outwards, ring by ring", "Keep every ring symmetric before moving on"],
    sample: { kind: "pulli", dots: 9, shape: "diamond", palette: "pongal", seed: 2 },
  },
  {
    slug: "sikku",
    name: "Sikku / Kambi Kolam",
    tamil: "சிக்கு கோலம்",
    engine: "sikku",
    summary: "The 'knot' kolam: a single continuous line weaves around every dot without touching it and returns to where it started. Kambi means wire — the line is like one unbroken wire.",
    howTo: ["Never touch a dot; always curve around it", "The line never stops — it ends where it began", "Practise with 3×3 and 5×5 grids before moving to 9×9 and more"],
    sample: { kind: "sikku", dots: 7, singleLine: true, palette: "rice-flour", seed: 3 },
  },
  {
    slug: "padi",
    name: "Padi Kolam",
    tamil: "படிக் கோலம்",
    engine: "padi",
    summary: "Geometric kolams of parallel double lines — squares, stars and stepped (padi) borders. Often drawn in puja rooms and edged with red kaavi.",
    howTo: ["Draw both lines of each pair together", "Start with the centre star or square", "Add kaavi red between the white lines for a temple look"],
    sample: { kind: "padi", layers: 4, palette: "temple", background: "kaavi", seed: 1 },
  },
  {
    slug: "poo",
    name: "Poo Kolam / Rangoli",
    tamil: "பூக்கோலம்",
    engine: "poo",
    summary: "Free-hand flower kolams with rings of petals, filled with colour powder or real flowers. Perfect for Pongal, Deepavali and Onam.",
    howTo: ["Mark the centre and draw guide circles", "Draw one ring of petals at a time", "Fill colours from the inside out so you don't smudge"],
    sample: { kind: "poo", symmetry: 8, layers: 5, palette: "pookalam", seed: 9 },
  },
  {
    slug: "motif",
    name: "Festival Motif Kolam",
    tamil: "பண்டிகைக் கோலம்",
    engine: "motif",
    summary: "A picture at the heart of the kolam — Pongal pot, lamp, lotus, chariot, kalasam or cow — framed by rings of petals.",
    howTo: ["Outline the motif lightly first", "Fill large areas with colour, then add white details", "Frame it with a ring of petals or lamps"],
    sample: { kind: "motif", motif: "pongal-pot", palette: "pongal", seed: 5 },
  },
  {
    slug: "maa",
    name: "Maa Kolam (wet rice paste)",
    tamil: "மாக்கோலம்",
    engine: "poo",
    summary: "Soaked rice ground into a paste and applied with a cloth or finger, creating bright white kolams that last for days — used for poojas, Varalakshmi Vratham, Navaratri and weddings.",
    howTo: ["Soak raw rice for 2 hours and grind with water into a smooth paste", "Dip a small cloth piece, press gently and draw", "Let it dry — it turns brilliant white"],
    sample: { kind: "poo", symmetry: 12, layers: 4, palette: "rice-flour", background: "kaavi", seed: 14 },
  },
];
