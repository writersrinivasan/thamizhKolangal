import { notFound } from "next/navigation";
import Link from "next/link";
import { CATALOG, entryById } from "@/lib/data/catalog";
import { FESTIVALS } from "@/lib/data/festivals";
import { REGIONS } from "@/lib/data/regions";
import KolamViewer from "@/components/KolamViewer";
import KolamCard, { DIFF_STYLE, TYPE_LABEL } from "@/components/KolamCard";

export function generateStaticParams() {
  return CATALOG.map((k) => ({ id: k.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const k = entryById((await params).id);
  return { title: k ? `${k.title} · ${k.tamil} · Thamizh Kolangal` : "Kolam" };
}

export default async function KolamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const k = entryById(id);
  if (!k) notFound();
  const fests = k.festivals.map((s) => FESTIVALS.find((f) => f.slug === s)).filter(Boolean);
  const region = REGIONS.find((r) => r.slug === k.region);
  const related = CATALOG.filter((x) => x.id !== k.id && (x.festivals.some((f) => k.festivals.includes(f)) || x.type === k.type)).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-20">
      <nav className="mb-4 text-sm text-ink-soft">
        <Link href="/gallery" className="hover:underline">Gallery</Link> / <span>{k.title}</span>
      </nav>
      <div className="mb-6">
        <h1 className="font-display text-4xl sm:text-5xl">{k.title}</h1>
        <div className="mt-1 text-xl text-kaavi">{k.tamil}</div>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className={`rounded-full px-3 py-1 ${DIFF_STYLE[k.difficulty]}`}>{k.difficulty}</span>
          <span className="rounded-full bg-peacock/10 px-3 py-1 text-peacock">{TYPE_LABEL[k.type]}</span>
          <span className="rounded-full bg-cream-2 px-3 py-1">⏱ {k.time}</span>
          {fests.map((f) => (
            <Link key={f!.slug} href={`/festivals/${f!.slug}`} className="rounded-full px-3 py-1 text-white" style={{ background: f!.accent }}>
              {f!.emoji} {f!.name}
            </Link>
          ))}
          {region && <Link href={`/regions#${region.slug}`} className="rounded-full bg-white px-3 py-1 ring-1 ring-kaavi/15">📍 {region.name}</Link>}
        </div>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">{k.description}</p>
      </div>
      <KolamViewer spec={k.spec} name={k.id} title={k.title} />
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 font-display text-3xl">You may also love</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => <KolamCard key={r.id} k={r} />)}</div>
        </section>
      )}
    </div>
  );
}
