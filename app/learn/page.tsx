import Link from "next/link";
import KolamSvg from "@/components/KolamSvg";
import KolamViewer from "@/components/KolamViewer";
import { KOLAM_TYPES } from "@/lib/data/types-info";
import { GLOSSARY, MATERIALS_GUIDE } from "@/lib/data/learning";

export const metadata = { title: "Learn Kolam · Thamizh Kolangal" };

const LADDER = [
  { label: "Week 1", ta: "முதல் வாரம்", text: "3×3 and 5×5 sikku — learn to curve around dots", spec: { kind: "sikku" as const, dots: 3, singleLine: true, palette: "rice-flour" as const, seed: 2 } },
  { label: "Week 2", ta: "இரண்டாம் வாரம்", text: "7-dot pulli flowers — even dot spacing", spec: { kind: "pulli" as const, dots: 7, shape: "diamond" as const, palette: "pongal" as const, seed: 7 } },
  { label: "Week 3", ta: "மூன்றாம் வாரம்", text: "Poo kolam rings — symmetry and colour fills", spec: { kind: "poo" as const, symmetry: 8, layers: 3, palette: "pookalam" as const, seed: 1 } },
  { label: "Week 4", ta: "நான்காம் வாரம்", text: "Padi kolam — steady double lines", spec: { kind: "padi" as const, layers: 3, palette: "temple" as const, seed: 3 } },
  { label: "Festival", ta: "பண்டிகை", text: "Festival motifs — Pongal pot, lamp, kalasam", spec: { kind: "motif" as const, motif: "pongal-pot" as const, palette: "pongal" as const, seed: 5 } },
  { label: "Master", ta: "நிபுணர்", text: "13×13 and bigger single-line sikku", spec: { kind: "sikku" as const, dots: 11, shape: "octagon" as const, singleLine: true, palette: "rice-flour" as const, seed: 808 } },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-20">
      <div className="text-sm text-kumkum">கோலம் கற்போம்</div>
      <h1 className="font-display text-4xl sm:text-5xl">Learn to draw kolams</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">A gentle path from your very first nine dots to grand Margazhi kolams. Press “Guided lesson” to watch each step drawn slowly.</p>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-3xl">Your first sikku · முதல் சிக்கு</h2>
        <KolamViewer spec={{ kind: "sikku", dots: 3, singleLine: true, palette: "rice-flour", density: 0.3, seed: 2 }} name="first-sikku" title="First sikku 3×3" />
      </section>

      <section className="mt-16">
        <h2 className="mb-4 font-display text-3xl">A one-month learning ladder</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LADDER.map((l, i) => (
            <Link key={l.label} href={`/studio?spec=${encodeURIComponent(JSON.stringify(l.spec))}`} className="card flex items-center gap-4 p-4 transition hover:-translate-y-1">
              <div className="w-24 shrink-0 overflow-hidden rounded-xl"><KolamSvg spec={l.spec} rounded={false} chalk="lite" /></div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-kumkum">{i + 1}. {l.label} · {l.ta}</div>
                <div className="mt-1">{l.text}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-4 font-display text-3xl">The kolam families</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {KOLAM_TYPES.map((t) => (
            <div key={t.slug} className="card grid grid-cols-[8rem_1fr] gap-4 p-4">
              <div className="overflow-hidden rounded-xl"><KolamSvg spec={t.sample} rounded={false} chalk="lite" /></div>
              <div>
                <h3 className="font-display text-xl">{t.name}</h3>
                <div className="text-sm text-kaavi">{t.tamil}</div>
                <p className="mt-1 text-sm text-ink-soft">{t.summary}</p>
                <ul className="mt-2 space-y-1 text-sm">{t.howTo.map((h) => <li key={h}>✓ {h}</li>)}</ul>
                <Link href={`/gallery?type=${t.slug}`} className="mt-2 inline-block text-sm font-semibold text-peacock hover:underline">See {t.name} designs →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-5 md:grid-cols-3">
        {([
          ["Materials · பொருட்கள்", MATERIALS_GUIDE.materials, "#f2a900"],
          ["Technique · நுட்பம்", MATERIALS_GUIDE.technique, "#e0457b"],
          ["Meaning · பொருள்", MATERIALS_GUIDE.meaning, "#2e7d32"],
        ] as const).map(([title, items, c]) => (
          <div key={title} className="card p-5">
            <div className="mb-3 h-1.5 w-14 rounded-full" style={{ background: c }} />
            <h3 className="font-display text-2xl">{title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">{items.map((x) => <li key={x}>• {x}</li>)}</ul>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="mb-4 font-display text-3xl">Kolam glossary · சொற்களஞ்சியம்</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="card p-4">
              <div className="font-display text-lg">{g.term} <span className="text-kaavi">· {g.tamil}</span></div>
              <div className="text-sm text-ink-soft">{g.meaning}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
