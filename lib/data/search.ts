import { CATALOG, type KolamEntry } from "./catalog";
import { FESTIVALS } from "./festivals";
import { REGIONS } from "./regions";

export interface SearchFilters {
  query?: string;
  festival?: string;
  type?: string;
  region?: string;
  difficulty?: string;
  limit?: number;
}

const SYNONYMS: Record<string, string[]> = {
  diya: ["lamp", "vilakku", "deepam", "agal"],
  lamp: ["diya", "vilakku", "deepam"],
  pot: ["paanai", "pongal"],
  flower: ["poo", "pookalam", "petal", "rangoli"],
  rangoli: ["poo", "flower", "colour"],
  "single line": ["sikku", "kambi", "one line", "continuous"],
  sikku: ["single line", "kambi", "knot"],
  dots: ["pulli", "dot"],
  pulli: ["dots"],
  easy: ["beginner", "simple", "small", "quick"],
  simple: ["beginner", "easy"],
  hard: ["advanced", "large"],
  big: ["large", "grand"],
  chariot: ["ther", "ratham"],
  cow: ["maadu", "cattle"],
  star: ["natchathiram"],
  peacock: ["mayil"],
  lotus: ["thamarai", "kamalam"],
};

function haystack(k: KolamEntry) {
  const fest = k.festivals.map((s) => FESTIVALS.find((f) => f.slug === s)?.name ?? s).join(" ");
  const reg = REGIONS.find((r) => r.slug === k.region)?.name ?? k.region;
  return [k.title, k.tamil, k.type, k.description, k.tags.join(" "), fest, k.festivals.join(" "), reg, k.difficulty, k.spec.motif ?? "", k.spec.palette ?? ""]
    .join(" ")
    .toLowerCase();
}

export function scoreEntry(k: KolamEntry, q: string) {
  if (!q.trim()) return 1;
  const text = haystack(k);
  const words = q.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 1);
  let score = 0;
  for (const w of words) {
    if (text.includes(w)) score += 3;
    for (const s of SYNONYMS[w] ?? []) if (text.includes(s)) score += 1.5;
    if (k.title.toLowerCase().includes(w)) score += 2;
  }
  return score;
}

export function searchCatalog(f: SearchFilters): KolamEntry[] {
  const q = f.query ?? "";
  return CATALOG.filter((k) => (!f.festival || k.festivals.includes(f.festival)) && (!f.type || k.type === f.type) && (!f.region || k.region === f.region) && (!f.difficulty || k.difficulty === f.difficulty))
    .map((k) => ({ k, s: scoreEntry(k, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, f.limit ?? 50)
    .map((x) => x.k);
}
