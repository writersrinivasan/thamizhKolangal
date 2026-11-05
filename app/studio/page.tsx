import StudioClient from "@/components/StudioClient";
import { decodeSpec } from "@/lib/specUrl";

export const metadata = { title: "Kolam Design Studio · Thamizh Kolangal" };

export default async function StudioPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const spec = decodeSpec(sp.spec) ?? { kind: "sikku", dots: 7, singleLine: true, palette: "pongal", density: 0.45, seed: 3 };
  return (
    <div className="mx-auto max-w-7xl px-4 pt-20">
      <div className="text-sm text-kumkum">உங்கள் கோலம்</div>
      <h1 className="font-display text-4xl sm:text-5xl">Design Studio</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">Choose a kolam family, set the dots and symmetry, pick festival colours — every change creates a fresh, drawable kolam with its own steps.</p>
      <StudioClient initial={spec} />
    </div>
  );
}
