import { tool } from "ai";
import { z } from "zod";
import { CATALOG, entryById } from "../data/catalog";
import { FESTIVALS, festivalBySlug } from "../data/festivals";
import { REGIONS } from "../data/regions";
import { KOLAM_TYPES } from "../data/types-info";
import { searchCatalog } from "../data/search";
import { renderKolam } from "../kolam";
import { MOTIF_INFO } from "../kolam/motifs";
import { PALETTES, BACKGROUNDS } from "../kolam/palettes";
import type { KolamSpec } from "../kolam/types";
import { MATERIALS_GUIDE } from "../data/learning";

const brief = (k: (typeof CATALOG)[number]) => ({
  id: k.id,
  title: k.title,
  tamil: k.tamil,
  type: k.type,
  festivals: k.festivals,
  region: k.region,
  difficulty: k.difficulty,
  time: k.time,
  description: k.description,
});

const festivalSlugs = FESTIVALS.map((f) => f.slug) as [string, ...string[]];
const regionSlugs = REGIONS.map((r) => r.slug) as [string, ...string[]];
const motifs = Object.keys(MOTIF_INFO) as [string, ...string[]];
const palettes = Object.keys(PALETTES) as [string, ...string[]];
const backgrounds = Object.keys(BACKGROUNDS) as [string, ...string[]];

export function buildTools() {
  return {
    search_kolams: tool({
      description:
        "Search the Thamizh Kolangal catalogue of traditional kolams. Use this FIRST whenever the user asks for kolam ideas. Filters are optional; leave them out when unsure.",
      inputSchema: z.object({
        query: z.string().describe("Free-text keywords, e.g. 'pongal pot sugarcane', 'easy single line', 'lamp'"),
        festival: z.enum(festivalSlugs).nullish().describe("Festival slug filter"),
        type: z.enum(["pulli", "sikku", "padi", "poo", "motif", "maa"]).nullish(),
        region: z.enum(regionSlugs).nullish(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).nullish(),
      }),
      execute: async (i) => {
        const res = searchCatalog({ query: i.query, festival: i.festival ?? undefined, type: i.type ?? undefined, region: i.region ?? undefined, difficulty: i.difficulty ?? undefined, limit: 8 });
        const fallback = res.length ? res : searchCatalog({ query: i.query, limit: 6 });
        return { count: fallback.length, results: fallback.map(brief), note: res.length ? undefined : "No exact match with the filters; showing closest results by keywords." };
      },
    }),

    get_kolam_details: tool({
      description: "Get full details and step-by-step drawing instructions for ONE catalogue kolam by id. Call this for the kolams you recommend so they can be shown to the user.",
      inputSchema: z.object({ id: z.string() }),
      execute: async ({ id }) => {
        const k = entryById(id);
        if (!k) return { error: `No kolam with id '${id}'. Use search_kolams to find valid ids.` };
        const m = renderKolam(k.spec);
        return { ...brief(k), tags: k.tags, stats: m.stats, steps: m.steps };
      },
    }),

    design_kolam: tool({
      description: `Create a NEW, unique kolam design that is rendered live for the user. Use it when the user wants something different, custom or unique, or when the catalogue has no good match. Kinds:
- sikku: single continuous line weaving around a dot grid (set singleLine=true) or colourful loops (false). dots 3–19.
- pulli: dot-joining kolam with petals/leaves/diamonds ring by ring. dots 5–15.
- padi: geometric double-line squares, stars and stepped borders. layers 2–7.
- poo: flower / rangoli mandala with rings of petals. symmetry 4–24, layers 2–8.
- motif: festival picture in the centre framed by petal rings. motif one of: ${motifs.join(", ")}.
Pick palettes and backgrounds that suit the festival. Change the seed to get a different variation.`,
      inputSchema: z.object({
        title: z.string().describe("A short evocative name, can include Tamil"),
        kind: z.enum(["sikku", "pulli", "padi", "poo", "motif"]),
        dots: z.number().int().min(3).max(19).nullish(),
        rows: z.number().int().min(3).max(19).nullish().describe("Only for shape=rect"),
        shape: z.enum(["square", "diamond", "octagon", "rect"]).nullish(),
        singleLine: z.boolean().nullish(),
        density: z.number().min(0).max(1).nullish().describe("sikku: how often the line turns, 0.2–0.7"),
        symmetry: z.number().int().min(4).max(24).nullish(),
        layers: z.number().int().min(1).max(8).nullish(),
        motif: z.enum(motifs).nullish(),
        palette: z.enum(palettes).nullish(),
        background: z.enum(backgrounds).nullish(),
        seed: z.number().int().nullish(),
        note: z.string().nullish().describe("One sentence on why this design suits the request"),
      }),
      execute: async (i) => {
        const spec: KolamSpec = { kind: i.kind } as KolamSpec;
        for (const k of ["dots", "rows", "shape", "singleLine", "density", "symmetry", "layers", "motif", "palette", "background", "seed"] as const) {
          const v = i[k];
          if (v !== null && v !== undefined) (spec as unknown as Record<string, unknown>)[k] = v;
        }
        if (spec.kind === "sikku" && spec.dots && spec.dots > 19) spec.dots = 19;
        if (spec.seed === undefined) spec.seed = Math.floor(Math.random() * 100000);
        const m = renderKolam(spec);
        return { ok: true, title: i.title, note: i.note ?? "", spec, stats: m.stats, steps: m.steps };
      },
    }),

    festival_guide: tool({
      description: "Get the kolam traditions, colours and motifs for a festival, plus the catalogue kolams for it.",
      inputSchema: z.object({ festival: z.enum(festivalSlugs) }),
      execute: async ({ festival }) => {
        const f = festivalBySlug(festival);
        if (!f) return { error: "unknown festival", available: festivalSlugs };
        return { ...f, kolams: CATALOG.filter((k) => k.festivals.includes(festival)).map((k) => ({ id: k.id, title: k.title, type: k.type, difficulty: k.difficulty })) };
      },
    }),

    regional_styles: tool({
      description: "Get kolam styles associated with regions of Tamil Nadu and neighbouring South Indian states.",
      inputSchema: z.object({ region: z.enum(regionSlugs).nullish() }),
      execute: async ({ region }) => {
        const list = region ? REGIONS.filter((r) => r.slug === region) : REGIONS;
        return list.map((r) => ({ ...r, kolams: CATALOG.filter((k) => k.region === r.slug).map((k) => ({ id: k.id, title: k.title })) }));
      },
    }),

    learning_guide: tool({
      description: "Get teaching material: kolam types (pulli, sikku, padi, poo, motif, maa kolam), materials, technique and cultural meaning. Use for beginners and 'how do I' questions.",
      inputSchema: z.object({ topic: z.enum(["types", "materials", "technique", "meaning", "all"]) }),
      execute: async ({ topic }) => {
        const types = KOLAM_TYPES.map((t) => ({ name: t.name, tamil: t.tamil, summary: t.summary, howTo: t.howTo }));
        if (topic === "types") return { types };
        if (topic === "all") return { types, ...MATERIALS_GUIDE };
        return { [topic]: MATERIALS_GUIDE[topic] };
      },
    }),
  };
}

export type GuruTools = ReturnType<typeof buildTools>;
