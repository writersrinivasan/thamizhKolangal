import Link from "next/link";
import KolamSvg from "@/components/KolamSvg";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 pt-28 text-center">
      <div className="mx-auto w-48"><KolamSvg spec={{ kind: "sikku", dots: 4, singleLine: true, palette: "rice-flour", seed: 404 }} animate /></div>
      <h1 className="mt-6 font-display text-3xl">This kolam got washed away</h1>
      <p className="mt-2 text-ink-soft">The page you were looking for isn&apos;t here.</p>
      <Link href="/" className="btn btn-primary mt-6">Back home</Link>
    </div>
  );
}
