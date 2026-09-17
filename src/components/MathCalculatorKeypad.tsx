import React, { useState, useMemo } from "react";
import katex from "katex";
import type { Language, ParameterDef } from "../types/studio";
import { getTranslation } from "../i18n/translations";
import {
  Calculator,
  Check,
  Send
} from "lucide-react";

interface Props {
  lang: Language;
  parameters: ParameterDef[];
  activeParamId?: string;
  onApplyValueToParam: (paramId: string, value: number) => void;
  onClose?: () => void;
}

export const MathCalculatorKeypad: React.FC<Props> = ({
  lang,
  parameters,
  activeParamId,
  onApplyValueToParam
}) => {
  const t = getTranslation(lang);
  const [expression, setExpression] = useState<string>("7 / 4");
  const [targetParam, setTargetParam] = useState<string>(
    activeParamId || (parameters[0]?.id || "")
  );
  const [justCalculated, setJustCalculated] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState(false);

  // Evaluate the mathematical expression safely
  const evaluatedResult = useMemo(() => {
    if (!expression.trim()) return null;
    try {
      // Clean string replacing constants and functions with JS Math equivalents
      let sanitized = expression
        .replace(/π|\\pi/g, `(${Math.PI})`)
        .replace(/e\b/g, `(${Math.E})`)
        .replace(/Φ|\\Phi/g, `(1.6180339887)`)
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/abs\(/g, "Math.abs(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/exp\(/g, "Math.exp(")
        .replace(/\^/g, "**");

      // Validate only safe arithmetic tokens
      if (/[^0-9\+\-\*\/\(\)\.\s,eMathPIsqrtabscotang\*\*]/.test(sanitized)) {
        return null;
      }

      // Safe Function evaluation
      const fn = new Function(`return (${sanitized});`);
      const val = fn();
      if (typeof val === "number" && !isNaN(val) && isFinite(val)) {
        return val;
      }
      return null;
    } catch {
      return null;
    }
  }, [expression]);

  // Live KaTeX expression preview
  const renderedLatexHtml = useMemo(() => {
    if (!expression.trim()) return "";
    try {
      let latexExpr = expression
        .replace(/\*/g, " \\cdot ")
        .replace(/\//g, " \\div ")
        .replace(/pi|π/g, " \\pi ")
        .replace(/sqrt\((.*?)\)/g, "\\sqrt{$1}")
        .replace(/sin/g, "\\sin")
        .replace(/cos/g, "\\cos")
        .replace(/tan/g, "\\tan");
      return katex.renderToString(latexExpr, { throwOnError: false });
    } catch {
      return expression;
    }
  }, [expression]);

  const insertSymbol = (sym: string) => {
    if (justCalculated) {
      // If continuing from previous result with an operator
      if (["+", "-", "*", "/", "^"].includes(sym)) {
        setExpression(prev => prev + " " + sym + " ");
      } else {
        setExpression(sym);
      }
      setJustCalculated(false);
    } else {
      setExpression(prev => prev + sym);
    }
  };

  const handleClear = () => {
    setExpression("");
    setJustCalculated(false);
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (evaluatedResult !== null) {
      setExpression(evaluatedResult.toString());
      setJustCalculated(true);
    }
  };

  const handleApply = () => {
    if (evaluatedResult !== null && targetParam) {
      onApplyValueToParam(targetParam, evaluatedResult);
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 2000);
    }
  };

  const KEYPAD_BUTTONS = [
    // Trigonometry & Powers
    { label: "sin", value: "sin(", type: "fn" },
    { label: "cos", value: "cos(", type: "fn" },
    { label: "tan", value: "tan(", type: "fn" },
    { label: "√x", value: "sqrt(", type: "fn" },
    { label: "x²", value: "^2", type: "fn" },
    { label: "xⁿ", value: "^", type: "fn" },

    // Constants & Parentheses
    { label: "π", value: "π", type: "const" },
    { label: "e", value: "e", type: "const" },
    { label: "Φ", value: "Φ", type: "const" },
    { label: "(", value: "(", type: "op" },
    { label: ")", value: ")", type: "op" },
    { label: "C", action: handleClear, type: "clear" },

    // Row 1
    { label: "7", value: "7", type: "num" },
    { label: "8", value: "8", type: "num" },
    { label: "9", value: "9", type: "num" },
    { label: "÷", value: " / ", type: "op" },
    { label: "DEL", action: handleDelete, type: "del" },
    { label: "abs", value: "abs(", type: "fn" },

    // Row 2
    { label: "4", value: "4", type: "num" },
    { label: "5", value: "5", type: "num" },
    { label: "6", value: "6", type: "num" },
    { label: "×", value: " * ", type: "op" },
    { label: "ln", value: "ln(", type: "fn" },
    { label: "exp", value: "exp(", type: "fn" },

    // Row 3
    { label: "1", value: "1", type: "num" },
    { label: "2", value: "2", type: "num" },
    { label: "3", value: "3", type: "num" },
    { label: "−", value: " - ", type: "op" },
    { label: "+", value: " + ", type: "op" },
    { label: "=", action: handleCalculate, type: "eval" },

    // Row 4
    { label: "0", value: "0", type: "num" },
    { label: ".", value: ".", type: "num" },
    { label: "00", value: "00", type: "num" },
    { label: "±", value: "-", type: "op" },
    { label: "ans", value: evaluatedResult !== null ? evaluatedResult.toFixed(4) : "0", type: "const" },
    { label: "π/2", value: "(π / 2)", type: "const" },
  ];

  return (
    <div className="flex flex-col gap-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-slate-200 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>{t.calcTitle}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                SCIENTIFIC
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {t.calcSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Screen / Formula Display */}
      <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{t.calcExpression}</span>
          {evaluatedResult !== null ? (
            <span className="text-cyan-400 font-bold tabular-nums">
              = {evaluatedResult.toFixed(5)}
            </span>
          ) : (
            <span className="text-amber-400/80 text-[10px]">Evaluating...</span>
          )}
        </div>

        {/* Text Input Buffer */}
        <input
          type="text"
          value={expression}
          onChange={e => {
            setExpression(e.target.value);
            setJustCalculated(false);
          }}
          placeholder="e.g. 7 / 4,  cos(pi/4) * 1.5,  2^3"
          className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-cyan-200 font-mono text-sm tracking-wide focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all tabular-nums"
        />

        {/* Live KaTeX Render of Expression */}
        {expression.trim() && (
          <div className="min-h-[36px] flex items-center px-3 py-1.5 rounded bg-slate-950/60 border border-slate-800/60 text-cyan-300 text-xs font-serif overflow-x-auto">
            <span dangerouslySetInnerHTML={{ __html: renderedLatexHtml }} />
          </div>
        )}
      </div>

      {/* Target Slider Selector & Quick Apply Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-300 whitespace-nowrap">
            {t.calcTargetParam}:
          </span>
          <select
            value={targetParam}
            onChange={e => setTargetParam(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
          >
            {parameters.map(p => (
              <option key={p.id} value={p.id}>
                {p.label} ({p.mathSymbol})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleApply}
          disabled={evaluatedResult === null}
          className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            appliedNotification
              ? "bg-emerald-500 text-slate-950"
              : evaluatedResult !== null
              ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950/50"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {appliedNotification ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Applied!</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>{t.calcApplyToParam}</span>
            </>
          )}
        </button>
      </div>

      {/* Keypad Buttons Grid (6 Columns) */}
      <div className="grid grid-cols-6 gap-2">
        {KEYPAD_BUTTONS.map((btn, idx) => {
          let btnStyle = "bg-slate-900/90 text-slate-200 border-slate-800 hover:bg-slate-800 hover:border-slate-700";
          if (btn.type === "num") {
            btnStyle = "bg-slate-900 text-slate-100 font-semibold border-slate-800 hover:bg-slate-800 text-sm";
          } else if (btn.type === "fn") {
            btnStyle = "bg-slate-950 text-indigo-300 font-serif border-slate-800/80 hover:bg-indigo-950/40 hover:border-indigo-500/40 text-xs";
          } else if (btn.type === "const") {
            btnStyle = "bg-slate-950 text-cyan-300 font-serif border-slate-800/80 hover:bg-cyan-950/40 hover:border-cyan-500/40 text-xs";
          } else if (btn.type === "op") {
            btnStyle = "bg-slate-900/80 text-cyan-400 font-bold border-slate-800 hover:bg-slate-800 text-xs";
          } else if (btn.type === "clear") {
            btnStyle = "bg-rose-950/40 text-rose-300 border-rose-900/60 hover:bg-rose-900/60 text-xs font-bold";
          } else if (btn.type === "del") {
            btnStyle = "bg-amber-950/40 text-amber-300 border-amber-900/60 hover:bg-amber-900/60 text-xs font-bold";
          } else if (btn.type === "eval") {
            btnStyle = "bg-cyan-500 text-slate-950 border-cyan-400 hover:bg-cyan-400 font-extrabold text-sm shadow-md shadow-cyan-950/50";
          }

          return (
            <button
              key={idx}
              onClick={() => {
                if (btn.action) {
                  btn.action();
                } else if (btn.value) {
                  insertSymbol(btn.value);
                }
              }}
              className={`h-10 rounded-xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer select-none ${btnStyle}`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
