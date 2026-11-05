import type { KolamSpec } from "./kolam/types";

export function encodeSpec(spec: KolamSpec): string {
  return encodeURIComponent(JSON.stringify(spec));
}

export function decodeSpec(s?: string | null): KolamSpec | null {
  if (!s) return null;
  try {
    const v = JSON.parse(decodeURIComponent(s));
    if (v && typeof v === "object" && typeof v.kind === "string") return v as KolamSpec;
  } catch {
    /* ignore */
  }
  return null;
}
