import { renderKolam, toSvgString, type KolamSpec } from "./kolam";

function save(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export function downloadSvg(spec: KolamSpec, name: string, dots = true) {
  save(new Blob([toSvgString(renderKolam(spec), { dots })], { type: "image/svg+xml" }), `${name}.svg`);
}

export function downloadPng(spec: KolamSpec, name: string, dots = true) {
  const svg = toSvgString(renderKolam(spec), { dots });
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 1200;
    c.getContext("2d")!.drawImage(img, 0, 0, 1200, 1200);
    c.toBlob((b) => b && save(b, `${name}.png`), "image/png");
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
