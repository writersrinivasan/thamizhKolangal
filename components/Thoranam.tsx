/** Mango-leaf thoranam garland with marigolds — hung above every Tamil doorway on festive days. */
export default function Thoranam({ count = 28 }: { count?: number }) {
  const w = 1200;
  const step = w / count;
  return (
    <svg viewBox={`0 0 ${w} 70`} preserveAspectRatio="none" className="block h-10 w-full sm:h-14" aria-hidden>
      <path d={`M0 6 Q${w / 2} 22 ${w} 6`} stroke="#8b5a2b" strokeWidth="3" fill="none" />
      {Array.from({ length: count }).map((_, i) => {
        const x = step * (i + 0.5);
        const t = x / w;
        const y = 6 + 16 * 4 * t * (1 - t) * 0.5 + 2;
        const isFlower = i % 2 === 1;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {isFlower ? (
              <g>
                <circle r="9" cy="8" fill={i % 4 === 1 ? "#ff8c1a" : "#f2a900"} />
                <circle r="5" cy="8" fill={i % 4 === 1 ? "#f2a900" : "#ff8c1a"} />
                <circle r="2" cy="8" fill="#c8102e" />
              </g>
            ) : (
              <g className="sway" style={{ animationDelay: `${(i % 5) * 0.3}s` }}>
                <path d="M0 0 C14 14 12 42 0 56 C-12 42 -14 14 0 0Z" fill="#2e7d32" />
                <path d="M0 2 L0 52" stroke="#7cc242" strokeWidth="1.5" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
