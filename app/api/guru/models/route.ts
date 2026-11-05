export const runtime = "nodejs";

/** Verifies a Groq key and lists the chat models it can use. The key is never stored. */
export async function GET(req: Request) {
  const apiKey = req.headers.get("x-groq-key")?.trim();
  if (!apiKey) return Response.json({ error: "Missing key" }, { status: 401 });
  const r = await fetch("https://api.groq.com/openai/v1/models", { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" });
  if (!r.ok) return Response.json({ error: r.status === 401 ? "Invalid Groq API key" : `Groq returned ${r.status}` }, { status: r.status });
  const data = (await r.json()) as { data?: { id: string; active?: boolean }[] };
  const skip = /whisper|tts|guard|playai|orpheus|prompt-guard|distil/i;
  const models = (data.data ?? []).filter((m) => m.active !== false && !skip.test(m.id)).map((m) => m.id).sort();
  return Response.json({ models });
}
