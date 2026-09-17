import React from "react";
import { COLOR_PALETTES } from "../presets/palettes";
import type { ThemeMode } from "../types/studio";
import { Palette, Check } from "lucide-react";

interface Props {
  theme?: ThemeMode;
  currentPaletteId: string;
  onSelectPalette: (id: string) => void;
}

export const ColorPalettePicker: React.FC<Props> = ({
  theme = "dark",
  currentPaletteId,
  onSelectPalette
}) => {
  const isLight = theme === "light";

  return (
    <div className="flex flex-col gap-2.5">
      <div className={`flex items-center gap-2 pb-1 text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-800" : "text-slate-300"}`}>
        <Palette className="w-4 h-4 text-cyan-500" />
        <span>Shader Spectral Palette</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {COLOR_PALETTES.map(p => {
          const isSelected = currentPaletteId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPalette(p.id)}
              className={`flex flex-col p-2 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? isLight
                    ? "bg-cyan-50/70 border-cyan-500 ring-1 ring-cyan-500 shadow-sm"
                    : "bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500 shadow-md"
                  : isLight
                  ? "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 w-full">
                <span className={`text-[11px] font-medium truncate ${isLight ? "text-slate-800" : "text-slate-300"}`}>
                  {p.name}
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
              </div>

              {/* 4-Color Swatch Strip */}
              <div className="flex h-3 w-full rounded overflow-hidden border border-slate-700/50">
                {p.colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
