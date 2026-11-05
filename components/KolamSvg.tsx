"use client";

import { useId, useMemo, type CSSProperties } from "react";
import { renderKolam, type KolamSpec, type RenderModel } from "@/lib/kolam";

interface Props {
  spec?: KolamSpec;
  model?: RenderModel;
  /** Animate the kolam as if being drawn by hand. */
  animate?: boolean;
  /** Show only up to this step (step-by-step learning). The current step animates. */
  upToStep?: number;
  showDots?: boolean;
  /** Seconds per step when animating the full kolam. */
  pace?: number;
  className?: string;
  title?: string;
  rounded?: boolean;
  /** Subtle hand-drawn chalk wobble (heavier to render). */
  chalk?: boolean | "lite";
}

export default function KolamSvg({ spec, model, animate = false, upToStep, showDots = true, pace = 1.1, className = "", title, rounded = true, chalk = true }: Props) {
  const m = useMemo(() => model ?? renderKolam(spec ?? { kind: "poo" }), [model, spec]);
  const uid = useId().replace(/:/g, "");
  const flour = chalk === "lite" ? `url(#flourlite-${uid})` : chalk ? `url(#flour-${uid})` : undefined;
  const stepMode = upToStep !== undefined;

  const delayFor = (step: number) => {
    if (stepMode) return step === upToStep ? 0.15 : 0;
    return animate ? 0.4 + step * pace : 0;
  };
  const isAnimated = (step: number) => (stepMode ? step === upToStep : animate);

  return (
    <svg viewBox={`0 0 ${m.size} ${m.size}`} className={`${rounded ? "rounded-2xl" : ""} block h-auto w-full ${className}`} role="img" aria-label={title ?? "Kolam design"}>
      {title ? <title>{title}</title> : null}
      <defs>
        {/* mottled washed floor (chaanam / cement) */}
        <filter id={`floor-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="11" result="big" />
          <feColorMatrix in="big" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 0 0 0 -0.42" result="blotch" />
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="4" result="fine" />
          <feColorMatrix in="fine" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.95  0.32 0 0 0 -0.11" result="grit" />
          <feMerge>
            <feMergeNode in="blotch" />
            <feMergeNode in="grit" />
          </feMerge>
        </filter>
        <radialGradient id={`sheen-${uid}`} cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.32" />
        </radialGradient>
        {/* lighter version for thumbnails: grain + small wobble, no blur layers */}
        <filter id={`flourlite-${uid}`} x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="wob" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.7" result="mask" />
          <feComposite in="wob" in2="mask" operator="in" />
        </filter>
        {/* rice-flour powder: wobbly hand line, grainy body and a soft dusty halo */}
        <filter id={`flour-${uid}`} x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="5" result="noise" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" result="wave" />
          <feDisplacementMap in="SourceGraphic" in2="wave" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="hand" />
          <feDisplacementMap in="hand" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="wob" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.8" result="mask" />
          <feComposite in="wob" in2="mask" operator="in" result="grain" />
          <feGaussianBlur in="wob" stdDeviation="1.4" result="halo" />
          <feComponentTransfer in="halo" result="dust">
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="dust" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
      </defs>
      <rect width={m.size} height={m.size} fill={m.background} />
      <rect width={m.size} height={m.size} fill={m.background} filter={`url(#floor-${uid})`} />
      <rect width={m.size} height={m.size} fill={`url(#sheen-${uid})`} />

      {showDots && m.dots.length > 0 && (
        <g filter={flour}>
          {m.dots.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={3.6}
              fill={m.dotColor}
              className={animate || (stepMode && upToStep === 0) ? "k-dot" : undefined}
              style={animate || (stepMode && upToStep === 0) ? ({ "--delay": `${Math.min(i * 0.012, 0.9)}s` } as CSSProperties) : undefined}
            />
          ))}
        </g>
      )}

      <g filter={flour} strokeLinecap="round" strokeLinejoin="round">
        {m.shapes.map((s, i) => {
          if (stepMode && s.step > (upToStep as number)) return null;
          const anim = isAnimated(s.step);
          const delay = delayFor(s.step);
          const len = s.d ? s.d.length : 400;
          const dur = Math.max(0.9, Math.min(stepMode ? 6 : 7, len / 1400));
          const style: CSSProperties & Record<string, string | number> = {};
          let cls: string | undefined;
          if (anim) {
            style["--delay"] = `${delay}s`;
            style["--op"] = s.opacity ?? 1;
            if (s.draw && s.stroke && (!s.fill || s.fill === "none")) {
              cls = "k-draw";
              style["--dur"] = `${dur}s`;
            } else cls = "k-fade";
          }
          const common = {
            fill: s.fill ?? "none",
            stroke: s.stroke,
            strokeWidth: s.sw,
            opacity: anim ? undefined : s.opacity,
            transform: s.transform,
            fillRule: s.evenodd ? ("evenodd" as const) : undefined,
            className: cls,
            style,
            pathLength: cls === "k-draw" ? 1 : undefined,
          };
          return s.kind === "circle" ? <circle key={i} cx={s.cx} cy={s.cy} r={s.r} {...common} /> : <path key={i} d={s.d} {...common} />;
        })}
      </g>
    </svg>
  );
}
