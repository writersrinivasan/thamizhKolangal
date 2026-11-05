import { notFound } from "next/navigation";
import Link from "next/link";
import KolamSvg from "@/components/KolamSvg";
import KolamCard from "@/components/KolamCard";
import { FESTIVALS, festivalBySlug } from "@/lib/data/festivals";
import { CATALOG } from "@/lib/data/catalog";
import { PALETTES } from "@/lib/kolam/palettes";

export function generateStaticParams() {
  return FESTIVALS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const f = festivalBySlug((await params).slug);
  return { title: f ? `${f.name} Kolams · ${f.tamil}` : "Festival" };
}

export default async function FestivalPage({ params }: { params: Promise<{ slug: string }> }) {
  const f = festivalBySlug((await params).slug);
  if (!f) notFound();
  const kolams = CATALOG.filter((k) => k.festivals.includes(f.slug));
  const pal = PALETTES[f.palette];
  return (
    <div className="pt-14">
      <section className="relative overflow-hidden text-white" style={{ background: `linear-gradient(135deg, ${f.accent}, #3b2314 75%)` }}>
        <div className="absolute -right-20 top-0 w-[28rem] opacity-30 spin-slow">
          <KolamSvg spec={{ kind: "poo", palette: f.palette, symmetry: 12, layers: 5, seed: 7, background: "night" }} chalk={false} rounded={false} className="rounded-full" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16">
          <Link href="/festivals" className="text-sm opacity-80 hover:underline">← All festivals</Link>
          <div className="mt-4 text-5xl">{f.emoji}</div>
          <h1 className="mt-2 font-display text-5xl">{f.name}</h1>
          <div className="text-2xl opacity-90">{f.tamil}</div>
          <div className="mt-2 text-sm opacity-80">{f.season} · {f.month}</div>
          <p className="mt-4 max-w-2xl text-lg opacity-95">{f.summary}</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4">
        <div className="-mt-8 grid gap-5 md:grid-cols-3">
          <div className="card p-5 md:col-span-2">
            <h2 className="font-display text-2xl">Kolam traditions</h2>
            <ul className="mt-3 space-y-2">
              {f.traditions.map((t) => (
                <li key={t} className="flex gap-3"><span style={{ color: f.accent }}>❖</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="font-display text-2xl">Colours & motifs</h2>
            <div className="mt-3 flex overflow-hidden rounded-xl">
              {pal.colors.map((c) => <span key={c} className="h-10 flex-1" style={{ background: c }} />)}
            </div>
            <div className="mt-1 text-xs text-ink-soft">{pal.label} · {pal.tamil}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">{f.motifs.map((m) => <span key={m} className="chip">{m}</span>)}</div>
            <Link href={`/guru?q=${encodeURIComponent(`Design a unique ${f.name} kolam for me`)}`} className="btn btn-primary mt-4 w-full text-sm">✨ Design a unique {f.name} kolam</Link>
          </div>
        </div>
        <h2 className="mb-4 mt-12 font-display text-3xl">{f.name} kolams</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{kolams.map((k) => <KolamCard key={k.id} k={k} />)}</div>
      </div>
    </div>
  );
}
