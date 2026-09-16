import React, { useMemo } from "react";
import katex from "katex";
import type { EquationModel } from "../types/studio";
import { Copy, Check, Sparkles } from "lucide-react";


interface Props {
  equation: EquationModel;
  parameters: Record<string, number>;
  hoveredVar: string | null;
  activeVar: string | null;
  onHoverVar: (paramId: string | null) => void;
  onSelectVar: (paramId: string) => void;
}

export const EquationView: React.FC<Props> = ({
  equation,
  parameters,
  hoveredVar,
  activeVar,
  onHoverVar,
  onSelectVar
}) => {
  const [copied, setCopied] = React.useState(false);

  // Render pure KaTeX formula
  const renderedLatexHtml = useMemo(() => {
    try {
      return katex.renderToString(equation.latex, {
        displayMode: true,
        throwOnError: false
      });
    } catch (e) {
      return equation.latex;
    }
  }, [equation.latex]);

  const copyFormula = () => {
    navigator.clipboard.writeText(equation.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md transition-all flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
            {equation.name}
          </h3>
        </div>
        <button
          onClick={copyFormula}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700/80 transition-colors"
          title="Copy LaTeX formula"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "LaTeX"}</span>
        </button>
      </div>

      {/* KaTeX Main Equation Display */}
      <div className="py-2.5 px-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-center overflow-x-auto text-cyan-200 shadow-inner">
        <div
          className="text-base select-text"
          dangerouslySetInnerHTML={{ __html: renderedLatexHtml }}
        />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed max-w-prose">
        {equation.description}
      </p>

      {/* Bi-Directional Interactive Variable Badges */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          Interactive Parameter Matrix (Click or hover to highlight)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {equation.parameters.map(param => {
            const isHighlighted = hoveredVar === param.id || activeVar === param.id;
            const currentValue = parameters[param.id] ?? param.defaultValue;
            const paramLatex = katex.renderToString(param.mathSymbol, {
              throwOnError: false
            });

            return (
              <div
                key={param.id}
                onMouseEnter={() => onHoverVar(param.id)}
                onMouseLeave={() => onHoverVar(null)}
                onClick={() => onSelectVar(param.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all border text-xs ${
                  isHighlighted
                    ? "bg-cyan-950/70 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500 shadow-lg shadow-cyan-950/50"
                    : "bg-slate-950/50 border-slate-800/90 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="font-serif text-sm font-medium"
                    dangerouslySetInnerHTML={{ __html: paramLatex }}
                  />
                  <span className="text-[11px] text-slate-400 truncate max-w-[110px]">
                    {param.label}
                  </span>
                </div>
                <div className="font-mono tabular-nums text-cyan-400 text-xs font-semibold">
                  {param.isInteger ? Math.round(currentValue) : currentValue.toFixed(3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Notes */}
      {equation.pedagogicalNotes && equation.pedagogicalNotes.length > 0 && (
        <div className="mt-1 pt-3 border-t border-slate-800/80 text-xs flex flex-col gap-1 text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mathematical Intuition</span>
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
            {equation.pedagogicalNotes.map((note, idx) => (
              <li key={idx} className="leading-snug">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
