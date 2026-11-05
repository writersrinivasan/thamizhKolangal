"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Thoranam from "./Thoranam";

const NAV = [
  { href: "/gallery", label: "Gallery", ta: "கோலங்கள்" },
  { href: "/festivals", label: "Festivals", ta: "பண்டிகைகள்" },
  { href: "/regions", label: "Regions", ta: "பகுதிகள்" },
  { href: "/learn", label: "Learn", ta: "கற்க" },
  { href: "/studio", label: "Studio", ta: "வடிவமை" },
];

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur-md">
      <div className="kolam-border h-1.5 w-full" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <LogoMark />
          <div className="leading-tight">
            <div className="font-display text-xl tracking-wide text-kaavi sm:text-2xl">Thamizh Kolangal</div>
            <div className="text-xs text-ink-soft">தமிழ் கோலங்கள் · every festival, every region</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`rounded-full px-3 py-1.5 text-sm transition ${path?.startsWith(n.href) ? "bg-ink text-cream" : "hover:bg-white/80"}`}>
              {n.label}
              <span className="ml-1 hidden text-xs opacity-60 xl:inline">{n.ta}</span>
            </Link>
          ))}
          <Link href="/guru" className="btn btn-primary ml-2 !py-2 text-sm">
            ✨ Ask Kolam Guru
          </Link>
        </nav>
        <button className="btn btn-ghost !px-3 !py-2 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="mx-4 mb-3 grid gap-1 rounded-2xl bg-white/90 p-2 shadow lg:hidden">
          {[...NAV, { href: "/guru", label: "✨ Ask Kolam Guru", ta: "AI" }].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 hover:bg-cream-2">
              {n.label} <span className="text-xs opacity-60">{n.ta}</span>
            </Link>
          ))}
        </nav>
      )}
      <div className="pointer-events-none -mb-10 sm:-mb-14">
        <Thoranam />
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11 transition group-hover:rotate-45 duration-700" aria-hidden>
      <rect width="48" height="48" rx="12" fill="#4a3426" />
      {[0, 45, 90, 135].map((r, i) => (
        <path key={r} d="M24 6C30 14 30 20 24 24C18 20 18 14 24 6Z" fill={["#f2a900", "#e0457b", "#2e7d32", "#0f6e8c"][i]} transform={`rotate(${r * 2} 24 24)`} />
      ))}
      {[0, 90, 180, 270].map((r) => (
        <path key={r} d="M24 6C30 14 30 20 24 24C18 20 18 14 24 6Z" fill="none" stroke="#fffaf0" strokeWidth="1.2" transform={`rotate(${r + 45} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="4" fill="#c8102e" stroke="#fffaf0" strokeWidth="1.2" />
    </svg>
  );
}
