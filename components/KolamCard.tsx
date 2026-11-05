import Link from "next/link";
import KolamSvg from "./KolamSvg";
import type { KolamEntry } from "@/lib/data/catalog";
import { FESTIVALS } from "@/lib/data/festivals";

export const DIFF_STYLE: Record<string, string> = {
  beginner: "bg-leaf/10 text-leaf",
  intermediate: "bg-turmeric/20 text-[#8a5a00]",
  advanced: "bg-kumkum/10 text-kumkum",
};

export const TYPE_LABEL: Record<string, string> = {
  pulli: "Pulli",
  sikku: "Sikku",
  padi: "Padi",
  poo: "Poo / Rangoli",
  motif: "Festival motif",
  maa: "Maa kolam",
};

export default function KolamCard({ k }: { k: KolamEntry }) {
  const fest = FESTIVALS.find((f) => f.slug === k.festivals[0]);
  return (
    <Link href={`/kolam/${k.id}`} className="card group block overflow-hidden p-3 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="overflow-hidden rounded-2xl">
        <div className="transition duration-700 group-hover:scale-[1.04]">
          <KolamSvg spec={k.spec} title={k.title} chalk="lite" />
        </div>
      </div>
      <div className="px-1 pb-1 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg leading-snug text-ink">{k.title}</h3>
            <div className="text-sm text-kaavi/80">{k.tamil}</div>
          </div>
          {fest && (
            <span className="text-xl" title={fest.name}>
              {fest.emoji}
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          <span className={`rounded-full px-2 py-0.5 ${DIFF_STYLE[k.difficulty]}`}>{k.difficulty}</span>
          <span className="rounded-full bg-peacock/10 px-2 py-0.5 text-peacock">{TYPE_LABEL[k.type]}</span>
          <span className="rounded-full bg-cream-2 px-2 py-0.5 text-ink-soft">⏱ {k.time}</span>
        </div>
      </div>
    </Link>
  );
}
