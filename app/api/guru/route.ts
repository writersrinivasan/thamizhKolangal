import { generateText, stepCountIs, APICallError, type ModelMessage } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { buildTools } from "@/lib/agent/tools";
import { GURU_SYSTEM } from "@/lib/agent/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface TraceItem {
  tool: string;
  input: unknown;
  summary: string;
}

function summarise(tool: string, output: unknown): string {
  const o = output as Record<string, unknown> | unknown[];
  if (!o) return "done";
  if (Array.isArray(o)) return `${o.length} region(s)`;
  if ("error" in o) return String(o.error);
  switch (tool) {
    case "search_kolams":
      return `found ${o.count} kolam(s)`;
    case "get_kolam_details":
      return `opened “${o.title}”`;
    case "design_kolam":
      return `designed “${o.title}”`;
    case "festival_guide":
      return `read ${o.name} traditions`;
    case "learning_guide":
      return "gathered teaching notes";
    default:
      return "done";
  }
}

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-groq-key")?.trim();
  if (!apiKey) {
    return Response.json({ error: "Add your Groq API key in the Guru settings to talk to Kolam Guru." }, { status: 401 });
  }
  let body: { messages?: ChatMessage[]; model?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) })) as ModelMessage[];
  if (!history.length || history[history.length - 1].role !== "user") {
    return Response.json({ error: "Send a question for Kolam Guru." }, { status: 400 });
  }

  const groq = createGroq({ apiKey });
  const modelId = (body.model || "openai/gpt-oss-120b").slice(0, 100);

  try {
    const result = await generateText({
      model: groq(modelId),
      system: GURU_SYSTEM,
      messages: history,
      tools: buildTools(),
      stopWhen: stepCountIs(8),
      temperature: 0.6,
    });

    const trace: TraceItem[] = [];
    const kolamIds: string[] = [];
    const lastSearch: string[] = [];
    const designs: { title: string; note: string; spec: unknown }[] = [];

    for (const step of result.steps) {
      for (const tr of step.toolResults) {
        const out = tr.output as Record<string, unknown>;
        trace.push({ tool: tr.toolName, input: tr.input, summary: summarise(tr.toolName, out) });
        if (tr.toolName === "get_kolam_details" && out && typeof out.id === "string" && !kolamIds.includes(out.id)) kolamIds.push(out.id);
        if (tr.toolName === "search_kolams" && out && Array.isArray(out.results)) {
          lastSearch.length = 0;
          (out.results as { id: string }[]).slice(0, 3).forEach((r) => lastSearch.push(r.id));
        }
        if (tr.toolName === "design_kolam" && out && out.ok) designs.push({ title: String(out.title), note: String(out.note ?? ""), spec: out.spec });
      }
    }
    const kolams = kolamIds.length ? kolamIds : designs.length ? [] : lastSearch;
    let text = result.text?.trim();
    if (!text) {
      text = designs.length || kolams.length ? "Here is what I found for you — scroll down to see the kolams and open any one to learn it step by step. 🌼" : "I couldn't form an answer this time. Could you tell me a little more about the festival or style you have in mind?";
    }
    return Response.json({ text, trace, kolams: kolams.slice(0, 4), designs: designs.slice(0, 4), model: modelId });
  } catch (err) {
    console.error("[guru]", err);
    if (APICallError.isInstance(err)) {
      const status = err.statusCode ?? 500;
      const msg =
        status === 401
          ? "Groq rejected the API key. Please check it in settings."
          : status === 429
            ? "Groq rate limit reached — wait a moment and try again, or pick a smaller model."
            : status === 404 || /model/i.test(err.message)
              ? `The model “${modelId}” isn't available for this key. Choose another model in settings.`
              : `Groq error: ${err.message}`;
      return Response.json({ error: msg }, { status });
    }
    return Response.json({ error: err instanceof Error ? err.message : "Something went wrong" }, { status: 500 });
  }
}
