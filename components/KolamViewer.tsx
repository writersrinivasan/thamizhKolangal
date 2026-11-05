"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import KolamSvg from "./KolamSvg";
import { renderKolam, PALETTES, type KolamSpec, type PaletteName } from "@/lib/kolam";
import { downloadPng, downloadSvg } from "@/lib/download";
import { encodeSpec } from "@/lib/specUrl";

interface Props {
  spec: KolamSpec;
  name: string;
  title: string;
  compact?: boolean;
}

export default function KolamViewer({ spec: initial, name, title, compact }: Props) {
  const [spec, setSpec] = useState<KolamSpec>(initial);
  const [step, setStep] = useState<number | undefined>(undefined);
  const [playKey, setPlayKey] = useState(0);
  const [dots, setDots] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const model = useMemo(() => renderKolam(spec), [spec]);
  const total = model.steps.length;

  useEffect(() => setSpec(initial), [initial]);

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => {
      setStep((s) => {
        const n = s === undefined ? 0 : s + 1;
        if (n >= total) {
          setAutoplay(false);
          return total - 1;
        }
        return n;
      });
    }, step === undefined ? 50 : 3200);
    return () => clearTimeout(t);
  }, [autoplay, step, total]);

  const go = (s: number | undefined) => {
    setAutoplay(false);
    setStep(s);
    setPlayKey((k) => k + 1);
  };

  return (
    <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"}`}>
      <div>
        <div className="card p-3">
          <KolamSvg key={`${playKey}-${step ?? "all"}`} model={model} animate={step === undefined} upToStep={step} showDots={dots} title={title} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="btn btn-primary !py-2 text-sm" onClick={() => go(undefined)}>▶ Draw it</button>
          <button className="btn btn-ghost !py-2 text-sm" onClick={() => { setStep(undefined); setAutoplay(true); }}>🎓 Guided lesson</button>
          <button className="btn btn-ghost !py-2 text-sm" onClick={() => setDots((d) => !d)}>{dots ? "Hide" : "Show"} dots</button>
          <button className="btn btn-ghost !py-2 text-sm" onClick={() => { setSpec((s) => ({ ...s, seed: (s.seed ?? 1) + 1 })); go(undefined); }}>🎲 Variation</button>
          <button className="btn btn-ghost !py-2 text-sm" onClick={() => downloadPng(spec, name, dots)}>⬇ PNG</button>
          <button className="btn btn-ghost !py-2 text-sm" onClick={() => downloadSvg(spec, name, dots)}>⬇ SVG</button>
          <Link className="btn btn-ghost !py-2 text-sm" href={`/studio?spec=${encodeSpec(spec)}`}>🎨 Remix</Link>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">Colours</span>
          {(Object.keys(PALETTES) as PaletteName[]).map((p) => (
            <button
              key={p}
              title={PALETTES[p].label}
              onClick={() => { setSpec((s) => ({ ...s, palette: p })); go(undefined); }}
              className={`flex h-7 overflow-hidden rounded-full ring-2 transition ${spec.palette === p ? "ring-ink" : "ring-transparent hover:ring-kaavi/40"}`}
            >
              {PALETTES[p].colors.slice(0, 4).map((c) => <span key={c} className="h-full w-2.5" style={{ background: c }} />)}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Step by step · படிப்படியாக</h2>
          <span className="text-sm text-ink-soft">{step === undefined ? `${total} steps` : `${step + 1} / ${total}`}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {Object.entries(model.stats).map(([k, v]) => (
            <span key={k} className="rounded-full bg-cream-2 px-2.5 py-1"><b className="capitalize">{k}</b>: {v}</span>
          ))}
        </div>
        <ol className="mt-4 space-y-2">
          {model.steps.map((s, i) => (
            <li key={i}>
              <button
                onClick={() => go(i)}
                className={`flex w-full gap-3 rounded-2xl p-3 text-left transition ${step === i ? "bg-ink text-cream shadow-lg" : step !== undefined && i < step ? "bg-leaf/10" : "hover:bg-white"}`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${step === i ? "bg-turmeric text-ink" : "bg-kaavi/10 text-kaavi"}`}>{i + 1}</span>
                <span className="text-[0.95rem] leading-relaxed">{s}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex gap-2">
          <button className="btn btn-ghost flex-1 !py-2 text-sm" disabled={step === undefined || step === 0} onClick={() => go(Math.max(0, (step ?? 0) - 1))}>← Previous</button>
          <button className="btn btn-primary flex-1 !py-2 text-sm" disabled={step === total - 1} onClick={() => go(step === undefined ? 0 : Math.min(total - 1, step + 1))}>Next step →</button>
        </div>
        <div className="mt-5 rounded-2xl bg-turmeric/10 p-4 text-sm text-ink-soft">
          <b className="text-kaavi">Guru tip:</b> Practise on paper with a pencil grid first. On the floor, sprinkle water so the rice flour settles, and let the flour flow from between your thumb and forefinger in one steady thread.
        </div>
      </div>
    </div>
  );
}
