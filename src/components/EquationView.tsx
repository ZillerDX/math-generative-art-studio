import React, { useMemo } from "react";
import katex from "katex";
import type { EquationModel, Language, ThemeMode } from "../types/studio";
import { getTranslation } from "../i18n/translations";
import { Copy, Check, Sparkles } from "lucide-react";

interface Props {
  lang: Language;
  theme?: ThemeMode;
  equation: EquationModel;
  parameters: Record<string, number>;
  hoveredVar: string | null;
  activeVar: string | null;
  onHoverVar: (paramId: string | null) => void;
  onSelectVar: (paramId: string) => void;
}

export const EquationView: React.FC<Props> = ({
  lang,
  theme = "dark",
  equation,
  parameters,
  hoveredVar,
  activeVar,
  onHoverVar,
  onSelectVar
}) => {
  const t = getTranslation(lang);
  const isLight = theme === "light";
  const [copied, setCopied] = React.useState(false);

  // Render pure KaTeX formula
  const renderedLatexHtml = useMemo(() => {
    try {
      return katex.renderToString(equation.latex, {
        displayMode: true,
        throwOnError: false
      });
    } catch {
      return equation.latex;
    }
  }, [equation.latex]);

  const copyFormula = () => {
    navigator.clipboard.writeText(equation.latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`border rounded-xl p-4 shadow-xl backdrop-blur-md transition-all flex flex-col gap-3 ${
      isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900/90 border-slate-800 text-slate-100"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className={`text-sm font-semibold tracking-wide ${isLight ? "text-slate-800" : "text-slate-200"}`}>
            {equation.name}
          </h3>
        </div>
        <button
          onClick={copyFormula}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
            isLight
              ? "text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"
              : "text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80"
          }`}
          title="Copy LaTeX formula"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? t.copied : t.copyLatex}</span>
        </button>
      </div>

      {/* KaTeX Main Equation Display */}
      <div className={`py-2.5 px-3 rounded-lg border flex items-center justify-center overflow-x-auto shadow-inner ${
        isLight ? "bg-slate-50 border-slate-200 text-cyan-900" : "bg-slate-950/80 border-slate-800/80 text-cyan-200"
      }`}>
        <div
          className="text-base select-text"
          dangerouslySetInnerHTML={{ __html: renderedLatexHtml }}
        />
      </div>

      {/* Description */}
      <p className={`text-xs leading-relaxed max-w-prose ${isLight ? "text-slate-600" : "text-slate-400"}`}>
        {equation.description}
      </p>

      {/* Bi-Directional Interactive Variable Badges */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className={`text-[11px] font-medium uppercase tracking-wider ${isLight ? "text-slate-400" : "text-slate-500"}`}>
          {t.interactiveMatrixTitle}
        </div>
        <div className="grid grid-cols-2 gap-2.5">
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
                className={`flex flex-col justify-between p-2.5 rounded-xl cursor-pointer transition-all border text-xs gap-1.5 ${
                  isHighlighted
                    ? isLight
                      ? "bg-cyan-50 border-cyan-400 text-cyan-900 ring-1 ring-cyan-400 shadow-md shadow-cyan-100"
                      : "bg-cyan-950/70 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500 shadow-lg shadow-cyan-950/50"
                    : isLight
                    ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    : "bg-slate-950/60 border-slate-800/90 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700"
                }`}
              >
                {/* Top Row: LaTeX Symbol on left, Formatted Value on right */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="font-serif text-sm font-semibold"
                    dangerouslySetInnerHTML={{ __html: paramLatex }}
                  />
                  <span className={`font-mono tabular-nums text-xs font-bold shrink-0 ${
                    isLight ? "text-cyan-700" : "text-cyan-400"
                  }`}>
                    {param.isInteger ? Math.round(currentValue) : currentValue.toFixed(3)}
                  </span>
                </div>

                {/* Bottom Row: Parameter Label with full breathing room */}
                <div
                  className={`text-[11px] font-medium truncate ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                  title={param.label}
                >
                  {param.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Notes */}
      {equation.pedagogicalNotes && equation.pedagogicalNotes.length > 0 && (
        <div className={`mt-1 pt-3 border-t text-xs flex flex-col gap-1 ${isLight ? "border-slate-200 text-slate-600" : "border-slate-800/80 text-slate-400"}`}>
          <div className={`flex items-center gap-1.5 font-medium text-[11px] ${isLight ? "text-slate-800" : "text-slate-300"}`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.mathIntuition}</span>
          </div>
          <ul className={`list-disc pl-4 space-y-1 text-[11px] ${isLight ? "text-slate-600" : "text-slate-400"}`}>
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
