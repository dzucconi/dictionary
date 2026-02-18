import type { Mode } from "./config.ts";

export const setFavicon = (mode: Mode): void => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = mode;
  ctx.fillRect(0, 0, 32, 32);

  const existing = document.getElementById("dynamic-favicon");
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.id = "dynamic-favicon";
  link.rel = "icon";
  link.href = canvas.toDataURL("image/png");
  document.head.appendChild(link);
};
