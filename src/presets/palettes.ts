import type { ColorPalette } from "../types/studio";

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "electric-neon",
    name: "Electric Cyberpunk",
    colors: ["#050814", "#06b6d4", "#ec4899", "#facc15"]
  },
  {
    id: "inferno",
    name: "Solar Inferno",
    colors: ["#080404", "#800020", "#ff4500", "#ffea00"]
  },
  {
    id: "cyber-cyan",
    name: "Quantum Cyan",
    colors: ["#020617", "#0e7490", "#06b6d4", "#a5f3fc"]
  },
  {
    id: "emerald-matrix",
    name: "Emerald Bioluminescence",
    colors: ["#02120a", "#047857", "#10b981", "#6ee7b7"]
  },
  {
    id: "plasma-purple",
    name: "Ultraviolet Plasma",
    colors: ["#0b0718", "#581c87", "#a855f7", "#f472b6"]
  },
  {
    id: "monochrome-ghost",
    name: "Monochrome Precision",
    colors: ["#020617", "#334155", "#94a3b8", "#f8fafc"]
  }
];

export function getPalette(id: string): ColorPalette {
  return COLOR_PALETTES.find(p => p.id === id) || COLOR_PALETTES[0];
}
