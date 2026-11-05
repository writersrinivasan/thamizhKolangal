"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import KolamCard, { TYPE_LABEL } from "./KolamCard";
import { searchCatalog } from "@/lib/data/search";
import { FESTIVALS } from "@/lib/data/festivals";
import { REGIONS } from "@/lib/data/regions";

interface F { q: string; festival: string; type: string; region: string; difficulty: string }

export default function GalleryClient({ initial }: { initial: F }) {
  const [f, setF] = useState<F>(initial);
  const results = useMemo(
    () => searchCatalog({ query: f.q, festival: f.festival || undefined, type: f.type || undefined, region: f.region || undefined, difficulty: f.difficulty || undefined }),
    [f],
  );
  const set = (k: keyof F, v: string) => setF((o) => ({ ...o, [k]: o[k] === v ? "" : v }));
  const any = f.q || f.festival || f.type || f.region || f.difficulty;

  return (
    <div>
      <div className="card sticky top-[92px] z-30 mb-6 space-y-3 p-4">
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-kaavi/15">
          <span>🔎</span>
          <input
            value={f.q}
            onChange={(e) => setF((o) => ({ ...o, q: e.target.value }))}
            placeholder="Search: lamp, pot, single line, lotus, peacock, easy…"
            className="w-full bg-transparent outline-none"
          />
          {any && <button className="text-sm text-kumkum" onClick={() => setF({ q: "", festival: "", type: "", region: "", difficulty: "" })}>Clear</button>}
        </div>
        <Row label="Festival">
          {FESTIVALS.map((x) => (
            <button key={x.slug} className="chip" data-on={f.festival === x.slug} onClick={() => set("festival", x.slug)}>{x.emoji} {x.name}</button>
          ))}
        </Row>
        <div className="grid gap-3 lg:grid-cols-[auto_auto_1fr]">
          <Row label="Type">
            {Object.entries(TYPE_LABEL).map(([k, v]) => (
              <button key={k} className="chip" data-on={f.type === k} onClick={() => set("type", k)}>{v}</button>
            ))}
          </Row>
          <Row label="Level">
            {["beginner", "intermediate", "advanced"].map((d) => (
              <button key={d} className="chip capitalize" data-on={f.difficulty === d} onClick={() => set("difficulty", d)}>{d}</button>
            ))}
          </Row>
          <Row label="Region">
            {REGIONS.map((r) => (
              <button key={r.slug} className="chip" data-on={f.region === r.slug} onClick={() => set("region", r.slug)}>{r.name.split(" (")[0].split(" — ")[0]}</button>
            ))}
          </Row>
        </div>
      </div>
      <div className="mb-4 text-sm text-ink-soft">{results.length} kolam{results.length === 1 ? "" : "s"}</div>
      {results.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((k) => <KolamCard key={k.id} k={k} />)}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <div className="text-4xl">🪷</div>
          <p className="mt-2">No kolam matches yet — but Kolam Guru can design one for you.</p>
          <Link href={`/guru?q=${encodeURIComponent(f.q || "Design a unique kolam for me")}`} className="btn btn-primary mt-4">✨ Ask Kolam Guru</Link>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
      <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</span>
      {children}
    </div>
  );
}
