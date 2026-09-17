import React from "react";
import katex from "katex";
import type { ParameterDef, Language } from "../types/studio";
import { getTranslation } from "../i18n/translations";
import { RotateCcw, Sliders } from "lucide-react";

interface Props {
  lang: Language;
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {t.equationControls}
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
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
                  ? "bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {/* Parameter Title & Symbol */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-slate-800/90 text-cyan-300 text-xs font-serif border border-slate-700/60"
                    dangerouslySetInnerHTML={{ __html: symbolHtml }}
                  />
                  <span className="text-xs font-medium text-slate-200">
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
                    className="w-20 px-2 py-0.5 text-right font-mono tabular-nums text-xs bg-slate-950 border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  <button
                    onClick={() => onResetParameter(param.id)}
                    className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition-colors"
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
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {/* Description & Min/Max Hints */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                <span>{param.min}</span>
                <span className="truncate max-w-[200px] text-slate-400 font-sans text-center">
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
