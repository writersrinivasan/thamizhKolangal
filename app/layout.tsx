import type { Metadata } from "next";
import { Catamaran, Marcellus } from "next/font/google";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const catamaran = Catamaran({ subsets: ["latin", "tamil"], variable: "--font-catamaran", display: "swap" });
const marcellus = Marcellus({ weight: "400", subsets: ["latin"], variable: "--font-marcellus", display: "swap" });

export const metadata: Metadata = {
  title: "Thamizh Kolangal · தமிழ் கோலங்கள்",
  description: "A colourful, traditional learning home for Tamil kolams — Pongal, Margazhi, Deepavali, Karthigai and every festival — with an AI Kolam Guru.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${catamaran.variable} ${marcellus.variable}`}>
      <body className="min-h-screen">
        <SiteHeader />
        <main className="relative">{children}</main>
        <footer className="mt-24 bg-earth text-cream">
          <div className="kolam-border h-1.5" />
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3">
            <div>
              <div className="font-display text-2xl">Thamizh Kolangal</div>
              <p className="mt-2 text-sm text-cream/75">
                கோலம் — a daily welcome, a festival blessing, a lesson in geometry and patience. Made with love for every doorstep.
              </p>
            </div>
            <div className="text-sm">
              <div className="mb-2 font-semibold text-turmeric">Explore</div>
              <ul className="space-y-1 text-cream/80">
                <li><Link href="/gallery">Kolam gallery</Link></li>
                <li><Link href="/festivals">Festival kolams</Link></li>
                <li><Link href="/regions">Regional styles</Link></li>
                <li><Link href="/learn">Learn to draw</Link></li>
                <li><Link href="/studio">Design studio</Link></li>
              </ul>
            </div>
            <div className="text-sm text-cream/75">
              <div className="mb-2 font-semibold text-turmeric">Kolam Guru AI</div>
              Bring your own Groq API key. It stays in your browser and is sent only with your own requests — never stored on our server.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
