"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import KolamSvg from "./KolamSvg";
import { entryById } from "@/lib/data/catalog";
import { searchCatalog } from "@/lib/data/search";
import { renderKolam, type KolamSpec } from "@/lib/kolam";
import { encodeSpec } from "@/lib/specUrl";

interface Trace { tool: string; input: unknown; summary: string }
interface Design { title: string; note: string; spec: KolamSpec }
interface Msg {
  role: "user" | "assistant";
  content: string;
  trace?: Trace[];
  kolams?: string[];
  designs?: Design[];
  error?: boolean;
  offline?: boolean;
}

const KEY_STORE = "tk-groq-key";
const MODEL_STORE = "tk-groq-model";
const DEFAULT_MODELS = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "moonshotai/kimi-k2-instruct", "openai/gpt-oss-20b", "llama-3.1-8b-instant"];

const SUGGESTIONS = [
  "A simple Pongal kolam my 8-year-old can draw",
  "Something unique for Karthigai Deepam with lamps",
  "Give me 3 different Margazhi single-line kolams",
  "Chettinad style grand geometric kolam for a wedding",
  "Peacock kolam for Krishna Jayanthi in blue and gold",
  "தீபாவளிக்கு ஒரு அழகான கோலம் வேண்டும்",
  "How do I make maa kolam paste?",
  "Kolams from Kerala and Andhra for Onam & Sankranti",
];

const TOOL_LABEL: Record<string, { icon: string; label: string }> = {
  search_kolams: { icon: "🔎", label: "Searched catalogue" },
  get_kolam_details: { icon: "📖", label: "Opened kolam" },
  design_kolam: { icon: "🎨", label: "Designed kolam" },
  festival_guide: { icon: "🪔", label: "Festival guide" },
  regional_styles: { icon: "🗺️", label: "Regional styles" },
  learning_guide: { icon: "📿", label: "Learning guide" },
};

function safeGet(k: string) {
  try { return localStorage.getItem(k) ?? ""; } catch { return ""; }
}
function safeSet(k: string, v: string) {
  try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch { /* ignore */ }
}

export default function GuruChat({ initialQuery }: { initialQuery: string }) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(DEFAULT_MODELS[0]);
  const [models, setModels] = useState<string[]>(DEFAULT_MODELS);
  const [showSettings, setShowSettings] = useState(false);
  const [verify, setVerify] = useState<{ state: "idle" | "busy" | "ok" | "err"; msg?: string }>({ state: "idle" });
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState(initialQuery);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const autoSent = useRef(false);

  useEffect(() => {
    const k = safeGet(KEY_STORE);
    setApiKey(k);
    const m = safeGet(MODEL_STORE);
    if (m) setModel(m);
    if (!k) setShowSettings(true);
    setReady(true);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      const next: Msg[] = [...messages, { role: "user", content: q }];
      setMessages(next);
      setInput("");
      if (!apiKey) {
        const res = searchCatalog({ query: q, limit: 4 });
        setMessages([...next, {
          role: "assistant",
          offline: true,
          content: res.length
            ? `I'm in **offline mode** (no Groq key yet), so I searched the collection for you. Add your free Groq API key in settings and I can design brand-new kolams and teach you step by step.`
            : `I'm in **offline mode** and found nothing for that. Add your Groq API key in settings so I can design a unique kolam for you.`,
          kolams: res.map((r) => r.id),
        }]);
        return;
      }
      setBusy(true);
      try {
        const r = await fetch("/api/guru", {
          method: "POST",
          headers: { "content-type": "application/json", "x-groq-key": apiKey },
          body: JSON.stringify({ model, messages: next.filter((m) => !m.error).map((m) => ({ role: m.role, content: m.content })) }),
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || `Request failed (${r.status})`);
        setMessages([...next, { role: "assistant", content: data.text, trace: data.trace, kolams: data.kolams, designs: data.designs }]);
      } catch (e) {
        setMessages([...next, { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong.", error: true }]);
      } finally {
        setBusy(false);
      }
    },
    [apiKey, busy, messages, model],
  );

  useEffect(() => {
    if (ready && initialQuery && !autoSent.current && apiKey) {
      autoSent.current = true;
      send(initialQuery);
    }
  }, [ready, initialQuery, apiKey, send]);

  const verifyKey = async () => {
    setVerify({ state: "busy" });
    try {
      const r = await fetch("/api/guru/models", { headers: { "x-groq-key": apiKey } });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (d.models?.length) {
        setModels(d.models);
        if (!d.models.includes(model)) {
          const pick = DEFAULT_MODELS.find((m) => d.models.includes(m)) ?? d.models[0];
          setModel(pick);
          safeSet(MODEL_STORE, pick);
        }
      }
      safeSet(KEY_STORE, apiKey);
      setVerify({ state: "ok", msg: `Key works · ${d.models?.length ?? 0} models available` });
    } catch (e) {
      setVerify({ state: "err", msg: e instanceof Error ? e.message : "Could not verify" });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-kumkum">கோலம் குரு · Agentic AI</div>
          <h1 className="font-display text-4xl sm:text-5xl">Ask Kolam Guru</h1>
          <p className="mt-1 max-w-2xl text-ink-soft">Describe the kolam in your mind — festival, size, colours, skill level. Guru searches, reasons and draws new designs for you.</p>
        </div>
        <button className="btn btn-ghost text-sm" onClick={() => setShowSettings((s) => !s)}>
          ⚙️ {apiKey ? <span>Groq key ✓ · <span className="opacity-70">{model.split("/").pop()}</span></span> : "Add Groq key"}
        </button>
      </div>

      {showSettings && (
        <div className="card mt-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl">Bring your own key (BYOK)</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Kolam Guru runs on <b>Groq</b>. Create a free key at{" "}
                <a className="text-peacock underline" href="https://console.groq.com/keys" target="_blank" rel="noreferrer">console.groq.com/keys</a>.
                Your key is saved only in this browser and sent with your own requests — it is never stored on the server.
              </p>
            </div>
            {apiKey && <button className="text-sm text-ink-soft hover:text-ink" onClick={() => setShowSettings(false)}>Close</button>}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value.trim()); setVerify({ state: "idle" }); }}
              placeholder="gsk_…"
              className="rounded-full bg-white px-4 py-2.5 ring-1 ring-kaavi/20 outline-none focus:ring-kumkum"
              autoComplete="off"
            />
            <div className="flex gap-2">
              <button className="btn btn-primary !py-2.5 text-sm" disabled={!apiKey || verify.state === "busy"} onClick={verifyKey}>
                {verify.state === "busy" ? "Checking…" : "Save & verify"}
              </button>
              {apiKey && <button className="btn btn-ghost !py-2.5 text-sm" onClick={() => { setApiKey(""); safeSet(KEY_STORE, ""); setVerify({ state: "idle" }); }}>Remove</button>}
            </div>
          </div>
          {verify.msg && <div className={`mt-2 text-sm ${verify.state === "ok" ? "text-leaf" : "text-kumkum"}`}>{verify.state === "ok" ? "✓ " : "⚠ "}{verify.msg}</div>}
          <div className="mt-4">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">Model</div>
            <select value={model} onChange={(e) => { setModel(e.target.value); safeSet(MODEL_STORE, e.target.value); }} className="w-full rounded-full bg-white px-4 py-2.5 ring-1 ring-kaavi/20">
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <p className="mt-1 text-xs text-ink-soft">Pick a model that supports tool calling (gpt-oss, Llama 3.3 70B, Kimi K2 work well). “Save & verify” loads the list your key can use.</p>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-5">
        {messages.length === 0 && (
          <div className="card relative overflow-hidden p-6">
            <div className="absolute -right-16 -top-16 w-64 opacity-20 spin-slow">
              <KolamSvg spec={{ kind: "poo", palette: "margazhi", symmetry: 12, layers: 4, seed: 4, background: "cream" }} chalk={false} rounded={false} />
            </div>
            <div className="relative">
              <div className="font-display text-2xl">வணக்கம்! 🙏 I&apos;m your Kolam Guru.</div>
              <p className="mt-1 max-w-xl text-ink-soft">Tell me the festival, how much time you have, your skill level or a picture in your mind. Try one of these:</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => send(s)}>{s}</button>)}
              </div>
              <AgentDiagram />
            </div>
          </div>
        )}

        {messages.map((m, i) => (m.role === "user" ? <UserBubble key={i} text={m.content} /> : <GuruBubble key={i} m={m} />))}
        {busy && <Thinking />}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="sticky bottom-4 z-20 mt-6 flex items-end gap-2 rounded-3xl bg-white/95 p-2 shadow-xl shadow-earth/15 ring-1 ring-kaavi/15 backdrop-blur"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          rows={1}
          placeholder="e.g. A unique 11-dot sikku for Margazhi in pastel colours…"
          className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 outline-none"
        />
        <button className="btn btn-primary" disabled={busy || !input.trim()}>{busy ? "…" : "Send"}</button>
      </form>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-3xl rounded-br-md bg-ink px-5 py-3 text-cream shadow">{text}</div>
    </div>
  );
}

function GuruBubble({ m }: { m: Msg }) {
  const [openTrace, setOpenTrace] = useState(false);
  return (
    <div className="flex gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-turmeric to-kumkum text-lg shadow">🪷</div>
      <div className="min-w-0 flex-1">
        <div className={`card px-5 py-4 ${m.error ? "!border-kumkum/40 !bg-kumkum/5" : ""}`}>
          {m.trace && m.trace.length > 0 && (
            <div className="mb-3">
              <button className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft" onClick={() => setOpenTrace((o) => !o)}>
                <span className="font-semibold uppercase tracking-wider">Agent steps</span>
                {m.trace.map((t, i) => (
                  <span key={i} className="rounded-full bg-cream-2 px-2 py-0.5">{TOOL_LABEL[t.tool]?.icon ?? "🔧"} {t.summary}</span>
                ))}
                <span className="text-peacock">{openTrace ? "hide" : "details"}</span>
              </button>
              {openTrace && (
                <ol className="mt-2 space-y-1 rounded-xl bg-cream-2/60 p-3 font-mono text-[11px] text-ink-soft">
                  {m.trace.map((t, i) => (
                    <li key={i}><b>{i + 1}. {t.tool}</b>({JSON.stringify(t.input)}) → {t.summary}</li>
                  ))}
                </ol>
              )}
            </div>
          )}
          <div className="prose-guru">
            <ReactMarkdown>{m.content}</ReactMarkdown>
          </div>
        </div>

        {m.designs && m.designs.length > 0 && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {m.designs.map((d, i) => <DesignCard key={i} d={d} />)}
          </div>
        )}
        {m.kolams && m.kolams.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {m.kolams.map((id) => {
              const k = entryById(id);
              if (!k) return null;
              return (
                <Link key={id} href={`/kolam/${id}`} className="card block p-2 transition hover:-translate-y-1">
                  <KolamSvg spec={k.spec} chalk="lite" />
                  <div className="px-1 pt-2 text-sm font-semibold leading-tight">{k.title}</div>
                  <div className="px-1 text-xs text-kaavi">{k.tamil}</div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DesignCard({ d }: { d: Design }) {
  const [steps, setSteps] = useState(false);
  const [play, setPlay] = useState(0);
  const model = renderKolam(d.spec);
  return (
    <div className="card overflow-hidden p-3">
      <div className="relative">
        <KolamSvg key={play} model={model} animate pace={0.8} title={d.title} />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-kumkum">✨ New design</span>
      </div>
      <div className="px-1 pt-3">
        <div className="font-display text-lg">{d.title}</div>
        {d.note && <p className="text-sm text-ink-soft">{d.note}</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setPlay((p) => p + 1)}>▶ Redraw</button>
          <button className="btn btn-ghost !px-3 !py-1.5 text-xs" onClick={() => setSteps((s) => !s)}>{steps ? "Hide" : "Show"} steps</button>
          <Link className="btn btn-primary !px-3 !py-1.5 text-xs" href={`/studio?spec=${encodeSpec(d.spec)}`}>🎓 Learn & remix</Link>
        </div>
        {steps && (
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-ink-soft">
            {model.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        )}
      </div>
    </div>
  );
}

function Thinking() {
  const phases = ["Understanding your wish…", "Searching festival traditions…", "Choosing dots & colours…", "Drawing new kolams…", "Writing your lesson…"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % phases.length), 1600);
    return () => clearInterval(t);
  }, [phases.length]);
  return (
    <div className="flex gap-3">
      <div className="grid h-10 w-10 shrink-0 animate-spin place-items-center rounded-full bg-gradient-to-br from-turmeric to-kumkum text-lg [animation-duration:3s]">🪷</div>
      <div className="card shimmer px-5 py-4 text-ink-soft">{phases[i]}</div>
    </div>
  );
}

function AgentDiagram() {
  const steps = [
    ["💭", "Understand", "festival, skill, time, colours"],
    ["🔎", "Search", "catalogue & traditions"],
    ["🎨", "Design", "new kolams, live"],
    ["📿", "Teach", "steps & tips"],
  ];
  return (
    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {steps.map(([icon, t, d], i) => (
        <div key={t} className="relative rounded-2xl bg-white/80 p-3 text-center ring-1 ring-kaavi/10">
          <div className="text-2xl">{icon}</div>
          <div className="font-semibold">{i + 1}. {t}</div>
          <div className="text-xs text-ink-soft">{d}</div>
        </div>
      ))}
    </div>
  );
}
