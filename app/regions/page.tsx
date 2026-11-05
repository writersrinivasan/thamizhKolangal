import KolamCard from "@/components/KolamCard";
import { REGIONS } from "@/lib/data/regions";
import { CATALOG } from "@/lib/data/catalog";

export const metadata = { title: "Regional Kolam Styles · Thamizh Kolangal" };

const COLORS = ["#c8102e", "#f2a900", "#2e7d32", "#e0457b", "#0f6e8c", "#ff8c1a", "#16a085", "#7b1fa2", "#8e2b1e"];

export default function RegionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-20">
      <div className="text-sm text-kumkum">பகுதி வாரியான கோலங்கள்</div>
      <h1 className="font-display text-4xl sm:text-5xl">Kolams across Tamil Nadu & the South</h1>
      <p className="mt-2 max-w-3xl text-ink-soft">
        Kolam travels with families, so styles mix freely — but each region has its favourite flavours. Here are the styles you&apos;ll often see, and how
        neighbouring states keep the same art alive as pookalam, muggulu and rangavalli.
      </p>
      <div className="mt-10 space-y-14">
        {[true, false].map((tn) => (
          <div key={String(tn)}>
            <h2 className="mb-6 font-display text-3xl">{tn ? "Within Tamil Nadu · தமிழ்நாடு" : "Sister traditions of the South"}</h2>
            <div className="space-y-10">
              {REGIONS.filter((r) => r.inTamilNadu === tn).map((r) => {
                const i = REGIONS.indexOf(r);
                const ks = CATALOG.filter((k) => k.region === r.slug).slice(0, 4);
                return (
                  <section key={r.slug} id={r.slug} className="scroll-mt-28">
                    <div className="card overflow-hidden">
                      <div className="h-2" style={{ background: COLORS[i % COLORS.length] }} />
                      <div className="grid gap-4 p-6 md:grid-cols-[1fr_1.2fr]">
                        <div>
                          <h3 className="font-display text-2xl">{r.name}</h3>
                          <div className="text-kaavi">{r.tamil}</div>
                          <div className="mt-1 text-sm text-ink-soft">📍 {r.places}</div>
                        </div>
                        <div>
                          <p>{r.style}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">{r.highlights.map((h) => <span key={h} className="chip">{h}</span>)}</div>
                        </div>
                      </div>
                    </div>
                    {ks.length > 0 && <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{ks.map((k) => <KolamCard key={k.id} k={k} />)}</div>}
                  </section>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
