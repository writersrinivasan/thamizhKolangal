import Link from "next/link";
import KolamSvg from "@/components/KolamSvg";
import KolamCard from "@/components/KolamCard";
import HeroAsk from "@/components/HeroAsk";
import { FESTIVALS } from "@/lib/data/festivals";
import { KOLAM_TYPES } from "@/lib/data/types-info";
import { REGIONS } from "@/lib/data/regions";
import { CATALOG, entryById } from "@/lib/data/catalog";

const FEATURED = ["pongal-paanai-grand", "deepavali-agal", "margazhi-giant-sikku", "onam-pookalam", "puthandu-kalasam", "karthigai-deepa-varisai", "maattu-pongal-cow", "navaratri-nine-hues"];

export default function Home() {
  return (
    <div className="pt-12">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm text-kaavi shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-kumkum" /> {CATALOG.length}+ kolams · {FESTIVALS.length} festivals · AI Kolam Guru
          </div>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="text-gradient">தமிழ் கோலங்கள்</span>
            <span className="mt-2 block text-3xl text-ink sm:text-4xl">Every festival. Every doorstep.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            A soothing, colourful home for traditional Tamil kolams — from the single-line sikku of Margazhi dawns to the overflowing Pongal paanai and
            the glowing lamps of Deepavali and Karthigai. Learn them step by step, design your own, or tell Kolam Guru what you have in mind.
          </p>
          <HeroAsk />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/gallery" className="btn btn-ghost">🌸 Browse the gallery</Link>
            <Link href="/learn" className="btn btn-ghost">📿 Learn the basics</Link>
            <Link href="/studio" className="btn btn-ghost">🎨 Design studio</Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="spin-slow absolute -inset-8 opacity-30">
            <KolamSvg spec={{ kind: "poo", palette: "pongal", symmetry: 16, layers: 5, seed: 3, background: "cream" }} chalk={false} rounded={false} className="rounded-full" />
          </div>
          <div className="float-slow relative rounded-[2rem] bg-white/60 p-3 shadow-2xl shadow-earth/30">
            <KolamSvg spec={{ kind: "sikku", dots: 7, singleLine: true, palette: "pongal", density: 0.45, seed: 3 }} animate pace={0.4} title="A single-line sikku kolam being drawn" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-1.5 text-sm text-cream shadow-lg">
              One line · 49 dots · சிக்கு கோலம்
            </div>
          </div>
        </div>
      </section>

      {/* ── Festival seasons ─────────────────────── */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle kicker="பண்டிகைக் காலங்கள்" title="Kolams for every festive season" href="/festivals" />
        </div>
        <div className="mx-auto flex max-w-7xl snap-x gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
          {FESTIVALS.map((f) => (
            <Link
              key={f.slug}
              href={`/festivals/${f.slug}`}
              className="group relative min-w-[220px] snap-start overflow-hidden rounded-3xl p-5 text-white shadow-lg transition hover:-translate-y-1"
              style={{ background: `linear-gradient(145deg, ${f.accent}, #3b2314)` }}
            >
              <div className="absolute -right-6 -top-6 h-28 w-28 opacity-40 transition group-hover:rotate-45 duration-700">
                <KolamSvg spec={{ kind: "poo", palette: f.palette, symmetry: 8, layers: 2, seed: f.slug.length, background: "night" }} chalk={false} rounded={false} className="rounded-full" />
              </div>
              <div className="text-3xl">{f.emoji}</div>
              <div className="mt-3 font-display text-xl">{f.name}</div>
              <div className="text-sm opacity-90">{f.tamil}</div>
              <div className="mt-2 text-xs opacity-75">{f.month}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Types ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionTitle kicker="கோல வகைகள்" title="Six families of kolam" href="/learn" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {KOLAM_TYPES.map((t) => (
            <Link key={t.slug} href={`/gallery?type=${t.slug}`} className="card group flex gap-4 p-4 transition hover:-translate-y-1">
              <div className="w-28 shrink-0 overflow-hidden rounded-xl">
                <KolamSvg spec={t.sample} rounded={false} chalk="lite" />
              </div>
              <div>
                <h3 className="font-display text-xl">{t.name}</h3>
                <div className="text-sm text-kaavi">{t.tamil}</div>
                <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{t.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionTitle kicker="சிறப்புக் கோலங்கள்" title="Festival favourites" href="/gallery" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((id) => entryById(id)).filter(Boolean).map((k) => <KolamCard key={k!.id} k={k!} />)}
        </div>
      </section>

      {/* ── Guru CTA ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-earth p-8 text-cream shadow-2xl sm:p-12">
          <div className="absolute -right-24 -top-24 w-96 opacity-25 spin-slow">
            <KolamSvg spec={{ kind: "poo", palette: "deepavali", symmetry: 12, layers: 5, seed: 8, background: "earth" }} chalk={false} rounded={false} />
          </div>
          <div className="relative max-w-2xl">
            <div className="text-sm uppercase tracking-[0.2em] text-turmeric">Agentic AI · கோலம் குரு</div>
            <h2 className="mt-2 font-display text-4xl">Have a kolam in your mind? Just describe it.</h2>
            <p className="mt-3 text-cream/80">
              Kolam Guru is an AI agent that searches the whole collection, reads festival and regional traditions, and draws brand-new kolams for you
              live — with steps to follow. Bring your own Groq API key.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["An easy Pongal kolam for kids", "Unique Karthigai lamp kolam, 15 minutes", "Chettinad-style big geometric kolam", "மார்கழி மாதத்திற்கு ஒரு சிக்கு கோலம்"].map((q) => (
                <Link key={q} href={`/guru?q=${encodeURIComponent(q)}`} className="rounded-full border border-cream/30 bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
                  {q}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Regions ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionTitle kicker="தமிழகமெங்கும்" title="From Chennai to Kanyakumari — and beyond" href="/regions" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r, i) => (
            <Link key={r.slug} href={`/regions#${r.slug}`} className="card p-5 transition hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full font-display text-white" style={{ background: ["#c8102e", "#f2a900", "#2e7d32", "#e0457b", "#0f6e8c", "#ff8c1a", "#16a085", "#7b1fa2", "#8e2b1e"][i % 9] }}>
                  {r.tamil.slice(0, 1)}
                </span>
                <div>
                  <div className="font-display text-lg">{r.name}</div>
                  <div className="text-xs text-ink-soft">{r.places}</div>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{r.style}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Meaning ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { t: "A welcome", ta: "வரவேற்பு", d: "Drawn at dawn on a freshly washed doorstep, a kolam welcomes guests and invites prosperity in.", c: "#f2a900" },
            { t: "An act of sharing", ta: "பகிர்வு", d: "Rice flour feeds ants, birds and small creatures — kindness drawn on the ground every day.", c: "#2e7d32" },
            { t: "A moving meditation", ta: "தியானம்", d: "Dots, lines and symmetry calm the mind and quietly teach geometry, memory and patience.", c: "#e0457b" },
          ].map((x) => (
            <div key={x.t} className="card p-6">
              <div className="mb-3 h-1.5 w-16 rounded-full" style={{ background: x.c }} />
              <div className="font-display text-2xl">{x.t}</div>
              <div className="text-sm text-kaavi">{x.ta}</div>
              <p className="mt-2 text-ink-soft">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ kicker, title, href }: { kicker: string; title: string; href?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="text-sm text-kumkum">{kicker}</div>
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-semibold text-peacock hover:underline">
          See all →
        </Link>
      )}
    </div>
  );
}
