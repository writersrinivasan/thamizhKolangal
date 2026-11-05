import GalleryClient from "@/components/GalleryClient";

export const metadata = { title: "Kolam Gallery · Thamizh Kolangal" };

export default async function GalleryPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-4 pt-20">
      <div className="mb-6">
        <div className="text-sm text-kumkum">கோலக் களஞ்சியம்</div>
        <h1 className="font-display text-4xl sm:text-5xl">The Kolam Gallery</h1>
        <p className="mt-2 max-w-2xl text-ink-soft">Filter by festival, family, region and skill. Every design opens into a step-by-step lesson you can animate, download and remix.</p>
      </div>
      <GalleryClient initial={{ q: sp.q ?? "", festival: sp.festival ?? "", type: sp.type ?? "", region: sp.region ?? "", difficulty: sp.difficulty ?? "" }} />
    </div>
  );
}
