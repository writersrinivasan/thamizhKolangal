import Link from "next/link";
import KolamSvg from "@/components/KolamSvg";
import { FESTIVALS } from "@/lib/data/festivals";
import { CATALOG } from "@/lib/data/catalog";

export const metadata = { title: "Festival Kolams · Thamizh Kolangal" };

export default function FestivalsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-20">
      <div className="text-sm text-kumkum">பண்டிகைக் கோலங்கள்</div>
      <h1 className="font-display text-4xl sm:text-5xl">Festival seasons</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">From the harvest joy of Thai Pongal to the lamps of Karthigai — each festival has its own colours, motifs and kolam customs.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {FESTIVALS.map((f) => {
          const sample = CATALOG.find((k) => k.festivals.includes(f.slug));
          const count = CATALOG.filter((k) => k.festivals.includes(f.slug)).length;
          return (
            <Link key={f.slug} href={`/festivals/${f.slug}`} className="card group flex gap-5 overflow-hidden p-4 transition hover:-translate-y-1">
              <div className="w-36 shrink-0 overflow-hidden rounded-2xl sm:w-44">
                {sample && <KolamSvg spec={sample.spec} rounded={false} chalk="lite" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm" style={{ color: f.accent }}>
                  <span className="text-2xl">{f.emoji}</span> {f.season}
                </div>
                <h2 className="font-display text-2xl">{f.name}</h2>
                <div className="text-kaavi">{f.tamil}</div>
                <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{f.summary}</p>
                <div className="mt-2 text-xs font-semibold text-peacock">{count} kolam{count === 1 ? "" : "s"} →</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
