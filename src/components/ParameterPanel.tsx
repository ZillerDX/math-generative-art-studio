import React from "react";
import katex from "katex";
import type { ParameterDef, Language, ThemeMode } from "../types/studio";
import { getTranslation } from "../i18n/translations";
import { RotateCcw, Sliders } from "lucide-react";

interface Props {
  lang: Language;
  theme?: ThemeMode;
  parameters: ParameterDef[];
  values: Record<string, number>;
  baseValues?: Record<string, number>;
  hoveredVar: string | null;
  activeVar: string | null;
  onHoverVar: (id: string | null) => void;
  onActiveVar: (id: string | null) => void;
  onChangeParameter: (id: string, value: number) => void;
  onResetParameter: (id: string) => void;
}

export const ParameterPanel: React.FC<Props> = ({
  lang,
  theme = "dark",
  parameters,
  values,
  hoveredVar,
  activeVar,
  onHoverVar,
  onActiveVar,
  onChangeParameter,
  onResetParameter
}) => {
  const t = getTranslation(lang);
  const isLight = theme === "light";

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex items-center justify-between pb-2 border-b ${isLight ? "border-slate-200" : "border-slate-800"}`}>
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-500" />
          <h3 className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-800" : "text-slate-300"}`}>
            {t.equationControls}
          </h3>
        </div>
        <span className={`text-[11px] font-mono ${isLight ? "text-slate-400" : "text-slate-500"}`}>
          {parameters.length} {t.uniformsCount}
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {parameters.map(param => {
          const val = values[param.id] ?? param.defaultValue;
          const isHighlighted = hoveredVar === param.id || activeVar === param.id;
          const symbolHtml = katex.renderToString(param.mathSymbol, {
            throwOnError: false
          });

          return (
            <div
              key={param.id}
              onMouseEnter={() => onHoverVar(param.id)}
              onMouseLeave={() => onHoverVar(null)}
              className={`p-3 rounded-lg border transition-all duration-150 ${
                isHighlighted
                  ? isLight
                    ? "bg-cyan-50/70 border-cyan-400 shadow-md shadow-cyan-100 ring-1 ring-cyan-400/50"
                    : "bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50"
                  : isLight
                  ? "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {/* Parameter Title & Symbol */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-serif border ${
                      isLight
                        ? "bg-slate-100 text-cyan-800 border-slate-200"
                        : "bg-slate-800/90 text-cyan-300 border-slate-700/60"
                    }`}
                    dangerouslySetInnerHTML={{ __html: symbolHtml }}
                  />
                  <span className={`text-xs font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                    {param.label}
                  </span>
                </div>

                {/* Direct Number Input */}
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.isInteger ? Math.round(val) : Number(val.toFixed(3))}
                    onChange={e => {
                      const num = parseFloat(e.target.value);
                      if (!isNaN(num)) {
                        onChangeParameter(param.id, num);
                      }
                    }}
                    onFocus={() => onActiveVar(param.id)}
                    onBlur={() => onActiveVar(null)}
                    className={`w-20 px-2 py-0.5 text-right font-mono tabular-nums text-xs rounded transition-all focus:outline-none focus:ring-1 ${
                      isLight
                        ? "bg-slate-100 border border-slate-300 text-cyan-800 focus:border-cyan-500 focus:ring-cyan-500"
                        : "bg-slate-950 border border-slate-700 text-cyan-300 focus:border-cyan-400 focus:ring-cyan-400"
                    }`}
                  />
                  <button
                    onClick={() => onResetParameter(param.id)}
                    className={`p-1 rounded transition-colors ${
                      isLight
                        ? "text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                    }`}
                    title={`Reset ${param.label} to default (${param.defaultValue})`}
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Slider Track */}
              <div className="relative flex items-center mt-2">
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={val}
                  onMouseDown={() => onActiveVar(param.id)}
                  onMouseUp={() => onActiveVar(null)}
                  onTouchStart={() => onActiveVar(param.id)}
                  onTouchEnd={() => onActiveVar(null)}
                  onChange={e => onChangeParameter(param.id, parseFloat(e.target.value))}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                    isLight ? "bg-slate-200" : "bg-slate-950"
                  }`}
                />
              </div>

              {/* Description & Min/Max Hints */}
              <div className={`flex items-center justify-between text-[10px] font-mono mt-1.5 ${
                isLight ? "text-slate-400" : "text-slate-500"
              }`}>
                <span>{param.min}</span>
                <span className={`truncate max-w-[200px] font-sans text-center ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}>
                  {param.description}
                </span>
                <span>{param.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
