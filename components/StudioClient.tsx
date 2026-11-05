"use client";

import { useState } from "react";
import KolamViewer from "./KolamViewer";
import { BACKGROUNDS, MOTIF_INFO, PALETTES, type BackgroundName, type KolamSpec, type MotifName, type PaletteName } from "@/lib/kolam";

const KINDS: { k: KolamSpec["kind"]; label: string; ta: string }[] = [
  { k: "sikku", label: "Sikku", ta: "சிக்கு" },
  { k: "pulli", label: "Pulli", ta: "புள்ளி" },
  { k: "poo", label: "Poo / Rangoli", ta: "பூ" },
  { k: "padi", label: "Padi", ta: "படி" },
  { k: "motif", label: "Festival motif", ta: "பண்டிகை" },
];

export default function StudioClient({ initial }: { initial: KolamSpec }) {
  const [spec, setSpec] = useState<KolamSpec>(initial);
  const up = (p: Partial<KolamSpec>) => setSpec((s) => ({ ...s, ...p }));
  const k = spec.kind;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[20rem_1fr]">
      <aside className="card h-fit min-w-0 space-y-5 p-5 lg:sticky lg:top-28">
        <Field label="Kolam family">
          <div className="grid grid-cols-2 gap-1.5">
            {KINDS.map((x) => (
              <button key={x.k} className="chip justify-center !whitespace-normal text-center" data-on={k === x.k} onClick={() => setSpec({ kind: x.k, palette: spec.palette, background: spec.background, seed: spec.seed })}>
                {x.label} <span className="opacity-60">{x.ta}</span>
              </button>
            ))}
          </div>
        </Field>

        {(k === "sikku" || k === "pulli") && (
          <>
            <Slider label="Dots per side" min={3} max={k === "sikku" ? 19 : 15} value={spec.dots ?? (k === "sikku" ? 7 : 9)} onChange={(v) => up({ dots: v })} />
            <Field label="Dot arrangement">
              <div className="flex flex-wrap gap-1.5">
                {(k === "sikku" ? ["square", "diamond", "octagon", "rect"] : ["square", "diamond", "octagon"]).map((s) => (
                  <button key={s} className="chip capitalize" data-on={(spec.shape ?? (k === "pulli" ? "diamond" : "square")) === s} onClick={() => up({ shape: s as KolamSpec["shape"] })}>{s}</button>
                ))}
              </div>
            </Field>
            {k === "sikku" && spec.shape === "rect" && <Slider label="Rows" min={3} max={19} value={spec.rows ?? 5} onChange={(v) => up({ rows: v })} />}
          </>
        )}
        {k === "sikku" && (
          <>
            <Field label="Line style">
              <div className="flex gap-1.5">
                <button className="chip" data-on={spec.singleLine !== false} onClick={() => up({ singleLine: true })}>One line (kambi)</button>
                <button className="chip" data-on={spec.singleLine === false} onClick={() => up({ singleLine: false })}>Colour loops</button>
              </div>
            </Field>
            <Slider label="Turns around dots" min={10} max={80} value={Math.round((spec.density ?? 0.45) * 100)} onChange={(v) => up({ density: v / 100 })} suffix="%" />
          </>
        )}
        {(k === "poo" || k === "motif" || k === "padi") && (
          <>
            {k !== "padi" && <Slider label="Symmetry (petals)" min={k === "motif" ? 6 : 4} max={24} value={spec.symmetry ?? (k === "motif" ? 12 : 8)} onChange={(v) => up({ symmetry: v })} />}
            <Slider label="Rings / layers" min={k === "motif" ? 1 : 2} max={k === "motif" ? 5 : k === "padi" ? 7 : 8} value={spec.layers ?? (k === "motif" ? 3 : k === "padi" ? 4 : 5)} onChange={(v) => up({ layers: v })} />
          </>
        )}
        {k === "motif" && (
          <Field label="Centre motif">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(MOTIF_INFO) as MotifName[]).map((m) => (
                <button key={m} className="chip" data-on={(spec.motif ?? "pongal-pot") === m} onClick={() => up({ motif: m })}>{MOTIF_INFO[m].label}</button>
              ))}
            </div>
          </Field>
        )}
        <Field label="Colours">
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(PALETTES) as PaletteName[]).map((p) => (
              <button key={p} onClick={() => up({ palette: p })} className={`flex items-center gap-2 rounded-xl p-1.5 text-left text-xs ring-2 transition ${spec.palette === p ? "bg-white ring-ink" : "ring-transparent hover:bg-white"}`}>
                <span className="flex h-5 w-10 shrink-0 overflow-hidden rounded-md">{PALETTES[p].colors.slice(0, 4).map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}</span>
                {PALETTES[p].label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Floor">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(BACKGROUNDS) as BackgroundName[]).map((b) => (
              <button key={b} title={BACKGROUNDS[b].label} onClick={() => up({ background: b })} className={`h-8 w-8 rounded-full ring-2 ring-offset-2 ${(spec.background ?? "earth") === b ? "ring-ink" : "ring-transparent"}`} style={{ background: BACKGROUNDS[b].color }} />
            ))}
          </div>
        </Field>
        <button className="btn btn-primary w-full" onClick={() => up({ seed: Math.floor(Math.random() * 99999) })}>🎲 Surprise me</button>
      </aside>
      <div className="min-w-0"><KolamViewer spec={spec} name={`my-kolam-${spec.kind}`} title="My kolam" /></div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</div>
      {children}
    </div>
  );
}

function Slider({ label, min, max, value, onChange, suffix = "" }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-semibold uppercase tracking-wider text-ink-soft">
        <span>{label}</span>
        <span className="text-ink">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </div>
  );
}
