"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroAsk() {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/guru?q=${encodeURIComponent(q.trim())}` : "/guru");
      }}
      className="mt-7 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-lg shadow-earth/10 ring-1 ring-kaavi/10"
    >
      <span className="pl-3 text-xl">✨</span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Describe the kolam in your mind… e.g. a peacock kolam for Krishna Jayanthi"
        className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none placeholder:text-ink-soft/60"
      />
      <button className="btn btn-primary !py-2.5">Ask Guru</button>
    </form>
  );
}
