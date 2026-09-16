import React, { useState, useEffect, useMemo } from "react";
import katex from "katex";
import type { MathCategory } from "../types/studio";
import {
  X,
  Sigma,
  Sparkles,
  Sliders,
  Compass,
  Atom,
  Activity,
  ArrowRight,
  BookOpen
} from "lucide-react";


export interface MathSuggestion {
  id: string;
  name: string;
  category: MathCategory;
  equationName: string;
  latex: string;
  visualOutcome: string; // คำอธิบายว่า Math นี้จะได้งานประมาณไหน
  visualTags: string[];
  parameters: Record<string, number>;
  palette: string;
  zoom: number;
  pan: [number, number];
}

export const MATH_SUGGESTIONS: MathSuggestion[] = [
  {
    id: "sug-tricorn",
    name: "Tricorn (Mandelbar Fractal)",
    category: "fractals",
    equationName: "burningship",
    latex: `z_{n+1} = (\\overline{z}_n)^2 + c = (\\operatorname{Re}(z_n) - i\\operatorname{Im}(z_n))^2 + c`,
    visualOutcome: "โครงสร้างแฟร็กทัลรูปสามเหลี่ยมที่มีหนามแหลมและปีกสมมาตร 3 ทิศทาง ให้ความรู้สึกคล้ายหมวกโจรสลัดยุคโบราณ ลวดลายขอบมีประกายหนามละเอียดและมีความคมชัดสูง",
    visualTags: ["สมมาตร 3 แฉก", "หนามแหลมคม", "แฟร็กทัลสังยุค"],
    parameters: { maxIter: 200, colorCycles: 2.8 },
    palette: "inferno",
    zoom: 1.8,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-multibrot-4",
    name: "Quatric Multibrot (สมมาตรดอกไม้ 4 กลีบ)",
    category: "fractals",
    equationName: "mandelbrot",
    latex: `z_{n+1} = z_n^4 + c, \\quad z_0 = 0`,
    visualOutcome: "แฟร็กทัลรูปดอกไม้ 4 แฉก (4-fold rotational symmetry) มีเกสรตรงกลางและกลีบแก้วสะท้อนรอบทิศทาง ให้ภาพเหมือนผลึกหิมะหรือหน้าต่างกระจกสีโกธิคในวิหารโบราณ",
    visualTags: ["สมมาตร 4 ทิศ", "ผลึกหิมะ", "สถาปัตยกรรมโกธิค"],
    parameters: { maxIter: 180, bailout: 4.0, power: 4, colorCycles: 3.0 },
    palette: "electric-neon",
    zoom: 1.2,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-douady-rabbit",
    name: "Douady Rabbit (กระต่ายของดูอาดี)",
    category: "fractals",
    equationName: "julia",
    latex: `z_{n+1} = z_n^2 + C, \\quad C = -0.123 + 0.745i`,
    visualOutcome: "เกลียวแฟร็กทัลสามแฉกคล้ายหูกระต่ายหมุนวนต่อเนื่อง เกิดโครงสร้างแบบ Self-similar ไม่รู้จบ มีกิ่งก้านสายฟ้าแตกแขนงคล้ายโครงข่ายประสาทเรืองแสง",
    visualTags: ["เกลียว 3 ทิศ", "สายฟ้าเรืองแสง", "Self-Similar"],
    parameters: { cr: -0.123, ci: 0.745, maxIter: 240, colorCycles: 3.2 },
    palette: "plasma-purple",
    zoom: 1.3,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-maurer-rose",
    name: "Septal Harmonograph Rose (กุหลาบ 14 กลีบสาน)",
    category: "parametric",
    equationName: "rose",
    latex: `r = a \\cdot \\cos\\left(\\frac{7}{4}\\theta + \\phi\\right)`,
    visualOutcome: "กลีบกุหลาบเรขาคณิต 14 กลีบที่ร้อยเรียงทับซ้อนกัน 4 รอบเต็ม เกิดเป็นตาข่ายโฮโลแกรมสามมิติที่ซับซ้อน คล้ายใยแมงมุมเลเซอร์เรืองแสงหรือลวดลายแมนดาลา",
    visualTags: ["กุหลาบฮาร์มอนิก", "ใยแสงโฮโลแกรม", "แมนดาลา"],
    parameters: { n: 7, d: 4, a: 0.88, phase: 0.0, glow: 0.022 },
    palette: "plasma-purple",
    zoom: 1.0,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-star-blossom",
    name: "Needle Star Blossom (ดวงดารากลีบเข็ม 22 แฉก)",
    category: "parametric",
    equationName: "rose",
    latex: `r = a \\cdot \\cos\\left(\\frac{11}{2}\\theta\\right)`,
    visualOutcome: "เส้นสายเข็มแสงเลเซอร์ 22 แฉกพุ่งออกจากศูนย์กลาง สลับไขว้กันเป็นประกายดวงดาวที่คมชัด ให้ความรู้สึกเหมือนอัญมณีเรืองแสงหรือผลึกคริสตัลดาราศาสตร์",
    visualTags: ["ดวงดาว 22 แฉก", "เข็มแสงเลเซอร์", "ผลึกอัญมณี"],
    parameters: { n: 11, d: 2, a: 0.92, phase: 0.78, glow: 0.016 },
    palette: "cyber-cyan",
    zoom: 1.0,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-torus-knot",
    name: "Lissajous Kinetic Knot (ปมเรขาคณิตฮาร์มอนิก)",
    category: "parametric",
    equationName: "lissajous",
    latex: `x = \\sin(7t + \\frac{\\pi}{2}), \\quad y = \\sin(9t)`,
    visualOutcome: "เส้นสายออร์โธโกนอลไขว้สานกันเป็นท่อแสงทรงกระบอก 3 มิติ ดูเหมือนวงแหวนควอนตัมที่กำลังหมุนเหวี่ยงและเคลื่อนไหวลวงตา",
    visualTags: ["ปม 3 มิติ", "ทรานส์ดิวเซอร์", "ภาพลวงตาจลนศาสตร์"],
    parameters: { freqA: 7, freqB: 9, phase: 1.57, glow: 0.02 },
    palette: "electric-neon",
    zoom: 1.0,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-clifford-silk",
    name: "Clifford Silk Vortex (ม่านไหมแห่งความน่าจะเป็น)",
    category: "attractors",
    equationName: "clifford",
    latex: `x_{n+1} = \\sin(-1.4 y_n) + \\cos(-1.4 x_n), \\quad y_{n+1} = \\sin(1.6 x_n) + 0.7 \\cos(1.6 y_n)`,
    visualOutcome: "ม่านหมอกไหมพริ้วไหวโปร่งแสงหลายล้านชั้น ซ้อนทับกันเป็นริบบิ้นคลื่นความน่าจะเป็นที่นุ่มนวลเหมือนควันเรืองแสงในอวกาศ",
    visualTags: ["ม่านไหมโปร่งแสง", "ริบบิ้นพริ้วไหว", "เคออสฟลูอิด"],
    parameters: { a: -1.4, b: 1.6, c: 1.0, d: 0.7 },
    palette: "plasma-purple",
    zoom: 1.0,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-lorenz-convection",
    name: "Atmospheric Chaos Butterfly (ผีเสื้อแห่งความปั่นป่วน)",
    category: "attractors",
    equationName: "lorenz",
    latex: `\\dot{x} = 10(y-x), \\quad \\dot{y} = x(28-z)-y, \\quad \\dot{z} = xy - \\frac{8}{3}z`,
    visualOutcome: "ปีกผีเสื้อคู่ของสมการสภาพอากาศ เลี้ยววนสลับข้างไปมาอย่างไม่รู้จบ เป็นสัญลักษณ์ของทฤษฎีความอลวน (Chaos Theory) ที่เส้นทางไม่เคยตัดกันเอง",
    visualTags: ["ปีกผีเสื้อคู่", "ทฤษฎีความอลวน", "ฟิสิกส์บรรยากาศ"],
    parameters: { sigma: 10.0, rho: 28.0, beta: 2.666, dt: 0.012, rotSpeed: 0.6 },
    palette: "inferno",
    zoom: 1.0,
    pan: [0.0, 0.0]
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyMath: (config: {
    category: MathCategory;
    equationName: string;
    parameters: Record<string, number>;
    zoom?: number;
    pan?: [number, number];
    palette?: string;
  }) => void;
}

export const CustomMathModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApplyMath
}) => {
  const [activeTab, setActiveTab] = useState<"suggestions" | "builder">("suggestions");

  // Custom Math Builder State
  const [builderType, setBuilderType] = useState<"fractal" | "rose" | "lissajous">("rose");
  // Fractal builder params
  const [customPower, setCustomPower] = useState(3);
  const [customCr, setCustomCr] = useState(-0.7);
  const [customCi, setCustomCi] = useState(0.27);
  const [customMaxIter, setCustomMaxIter] = useState(180);
  const [isJuliaMode, setIsJuliaMode] = useState(true);

  // Rose builder params
  const [customN, setCustomN] = useState(9);
  const [customD, setCustomD] = useState(4);
  const [customAmp, setCustomAmp] = useState(0.85);
  const [customPhase, setCustomPhase] = useState(0.0);
  const [customGlow, setCustomGlow] = useState(0.02);

  // Lissajous builder params
  const [customFreqA, setCustomFreqA] = useState(5);
  const [customFreqB, setCustomFreqB] = useState(8);
  const [customLissPhase, setCustomLissPhase] = useState(1.57);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Dynamic Live LaTeX for Custom Builder
  const liveCustomLatex = useMemo(() => {
    if (builderType === "fractal") {
      if (isJuliaMode) {
        return `z_{n+1} = z_n^{${customPower}} + (${customCr >= 0 ? customCr.toFixed(3) : customCr.toFixed(3)} + ${customCi.toFixed(3)}i)`;
      } else {
        return `z_{n+1} = z_n^{${customPower}} + c, \\quad z_0 = 0`;
      }
    } else if (builderType === "rose") {
      return `r = ${customAmp.toFixed(2)} \\cdot \\cos\\left(\\frac{${customN}}{${customD}} \\theta + ${customPhase.toFixed(2)}\\right)`;
    } else {
      return `x = \\sin(${customFreqA}t + ${customLissPhase.toFixed(2)}), \\quad y = \\sin(${customFreqB}t)`;
    }
  }, [builderType, isJuliaMode, customPower, customCr, customCi, customAmp, customN, customD, customPhase, customFreqA, customFreqB, customLissPhase]);

  // Dynamic Predicted Visual Outcome for Custom Builder
  const liveVisualOutcome = useMemo(() => {
    if (builderType === "fractal") {
      return `จะสร้างโครงสร้างแฟร็กทัลที่มีสมมาตรแบบหมุนวน ${customPower - 1} หรือ ${customPower} แฉก มีโครงข่ายเดนไดรต์แตกแขนงละเอียดลึก ${customMaxIter} ชั้น`;
    } else if (builderType === "rose") {
      const k = customN / customD;
      const isInteger = Number.isInteger(k);
      const petals = isInteger ? (k % 2 === 1 ? k : 2 * k) : customN * (customD % 2 === 0 ? 2 : 1);
      return `จะสร้างลวดลายกุหลาบเรขาคณิตจำนวนประมาณ ${petals} กลีบ โดยเส้นสายจะหมุนทับซ้อนกัน ${customD} รอบเต็ม เกิดเป็นตาข่ายโฮโลแกรมเรืองแสง`;
    } else {
      return `จะสร้างปมเรขาคณิตสามมิติที่มีความถี่แกน X:Y ที่อัตราส่วน ${customFreqA}:${customFreqB} มีจุดตัดและวงวนสมมาตรตามมุมเฟส ${customLissPhase.toFixed(2)} rad`;
    }
  }, [builderType, customPower, customMaxIter, customN, customD, customFreqA, customFreqB, customLissPhase]);

  const renderedLiveLatexHtml = useMemo(() => {
    return katex.renderToString(liveCustomLatex, { throwOnError: false, displayMode: true });
  }, [liveCustomLatex]);

  if (!isOpen) return null;

  const handleApplyCustomBuilder = () => {
    if (builderType === "fractal") {
      if (isJuliaMode) {
        onApplyMath({
          category: "fractals",
          equationName: "julia",
          parameters: {
            cr: customCr,
            ci: customCi,
            maxIter: customMaxIter,
            colorCycles: 3.0
          },
          zoom: 1.25,
          pan: [0, 0]
        });
      } else {
        onApplyMath({
          category: "fractals",
          equationName: "mandelbrot",
          parameters: {
            power: customPower,
            maxIter: customMaxIter,
            bailout: 4.0,
            colorCycles: 3.5
          },
          zoom: 1.2,
          pan: [0, 0]
        });
      }
    } else if (builderType === "rose") {
      onApplyMath({
        category: "parametric",
        equationName: "rose",
        parameters: {
          n: customN,
          d: customD,
          a: customAmp,
          phase: customPhase,
          glow: customGlow
        },
        zoom: 1.0,
        pan: [0, 0]
      });
    } else {
      onApplyMath({
        category: "parametric",
        equationName: "lissajous",
        parameters: {
          freqA: customFreqA,
          freqB: customFreqB,
          phase: customLissPhase,
          glow: 0.02
        },
        zoom: 1.0,
        pan: [0, 0]
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-900/40">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>Custom Math Studio & Suggestions</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                  Formula Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                ป้อนสมการคณิตศาสตร์ของคุณเอง หรือเลือกสมการแนะนำพร้อมดูผลลัพธ์ภาพที่ได้ก่อนสร้างงาน
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs: Suggestions vs Custom Builder */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/20">
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "suggestions"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Math Suggestions (สมการแนะนำ)</span>
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "builder"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Custom Math Builder (สร้างสมการเอง)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "suggestions" ? (
            /* TAB 1: MATH SUGGESTIONS */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MATH_SUGGESTIONS.map(sug => {
                const mathHtml = katex.renderToString(sug.latex, {
                  throwOnError: false,
                  displayMode: false
                });

                return (
                  <div
                    key={sug.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60 transition-all flex flex-col justify-between gap-3 shadow-md"
                  >
                    {/* Header: Title & Tags */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                          {sug.category}
                        </span>
                        <div className="flex gap-1">
                          {sug.visualTags.map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm text-slate-100 mt-1">
                        {sug.name}
                      </h3>
                    </div>

                    {/* Rendered Math Formula - Spacious and Unclipped */}
                    <div className="w-full min-h-[50px] px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-xs sm:text-[13px] font-serif flex items-center justify-start overflow-x-auto shadow-inner">
                      <div
                        className="inline-block whitespace-nowrap py-1 select-text leading-normal"
                        dangerouslySetInnerHTML={{ __html: mathHtml }}
                      />
                    </div>

                    {/* What Visual Will It Make (คำอธิบายผลลัพธ์ภาพที่ได้) */}
                    <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex flex-col gap-1 text-xs">
                      <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ผลลัพธ์ภาพที่จะได้:</span>
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {sug.visualOutcome}
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        onApplyMath({
                          category: sug.category,
                          equationName: sug.equationName,
                          parameters: sug.parameters,
                          zoom: sug.zoom,
                          pan: sug.pan,
                          palette: sug.palette
                        });
                        onClose();
                      }}
                      className="mt-1 w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-semibold text-xs border border-cyan-500/50 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>สร้างผลงานจากสมการนี้</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TAB 2: CUSTOM MATH BUILDER */
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              {/* Paradigm Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  เลือกประเภทสมการคณิตศาสตร์ (Mathematical Paradigm)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBuilderType("rose")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      builderType === "rose"
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/50"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Rose Harmonograph</span>
                  </button>
                  <button
                    onClick={() => setBuilderType("fractal")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      builderType === "fractal"
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/50"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Atom className="w-4 h-4" />
                    <span>Complex Fractal</span>
                  </button>
                  <button
                    onClick={() => setBuilderType("lissajous")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      builderType === "lissajous"
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/50"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>Lissajous Knot</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Live Formula Preview */}
              <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>สมการคณิตศาสตร์ที่กำลังสร้าง (Live LaTeX Preview)</span>
                </span>
                <div
                  className="py-3 px-4 text-center text-base sm:text-lg text-cyan-200 overflow-x-auto select-text font-serif"
                  dangerouslySetInnerHTML={{ __html: renderedLiveLatexHtml }}
                />
              </div>

              {/* Real-time Visual Outcome Prediction */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-start gap-2.5 text-xs">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-cyan-300 block mb-0.5">
                    การประเมินลักษณะผลงานทางภาพ (Visual Outcome Prediction):
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {liveVisualOutcome}
                  </p>
                </div>
              </div>

              {/* Interactive Equation Parameter Sliders / Inputs */}
              <div className="flex flex-col gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                {builderType === "rose" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Numerator n (จำนวนกลีบฮาร์มอนิก):</span>
                          <span className="font-mono tabular-nums text-cyan-400 font-bold">{customN}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="16"
                          step="1"
                          value={customN}
                          onChange={e => setCustomN(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Denominator d (รอบการหมุน):</span>
                          <span className="font-mono tabular-nums text-cyan-400 font-bold">{customD}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="12"
                          step="1"
                          value={customD}
                          onChange={e => setCustomD(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Amplitude a (ขนาดแอมพลิจูด):</span>
                          <span className="font-mono tabular-nums text-cyan-400 font-bold">{customAmp.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.3"
                          max="1.5"
                          step="0.05"
                          value={customAmp}
                          onChange={e => setCustomAmp(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Phase Offset \phi (มุมเฟส):</span>
                          <span className="font-mono tabular-nums text-cyan-400">{customPhase.toFixed(2)} rad</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="6.28"
                          step="0.05"
                          value={customPhase}
                          onChange={e => setCustomPhase(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Laser Glow \sigma_w:</span>
                          <span className="font-mono tabular-nums text-cyan-400">{customGlow.toFixed(3)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.005"
                          max="0.06"
                          step="0.002"
                          value={customGlow}
                          onChange={e => setCustomGlow(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                        />
                      </div>
                    </div>
                  </>
                )}


                {builderType === "fractal" && (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs text-slate-300">โหมดแฟร็กทัล:</span>
                      <div className="flex gap-1 text-xs">
                        <button
                          onClick={() => setIsJuliaMode(true)}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            isJuliaMode
                              ? "bg-cyan-500 text-slate-950 font-bold"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          Julia Constant Morphing
                        </button>
                        <button
                          onClick={() => setIsJuliaMode(false)}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            !isJuliaMode
                              ? "bg-cyan-500 text-slate-950 font-bold"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          Mandelbrot Degree Power
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Polynomial Power Exponent p:</span>
                          <span className="font-mono tabular-nums text-cyan-400 font-bold">{customPower}</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="8"
                          step="1"
                          value={customPower}
                          onChange={e => setCustomPower(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Max Iterations N (ความลึกการคำนวณ):</span>
                          <span className="font-mono tabular-nums text-cyan-400 font-bold">{customMaxIter}</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          step="10"
                          value={customMaxIter}
                          onChange={e => setCustomMaxIter(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                        />
                      </div>
                    </div>


                    {isJuliaMode && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Real Constant C_r:</span>
                            <span className="font-mono tabular-nums text-cyan-400">{customCr.toFixed(3)}</span>
                          </div>
                          <input
                            type="range"
                            min="-1.5"
                            max="1.5"
                            step="0.01"
                            value={customCr}
                            onChange={e => setCustomCr(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Imaginary Constant C_i:</span>
                            <span className="font-mono tabular-nums text-cyan-400">{customCi.toFixed(3)}</span>
                          </div>
                          <input
                            type="range"
                            min="-1.5"
                            max="1.5"
                            step="0.01"
                            value={customCi}
                            onChange={e => setCustomCi(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {builderType === "lissajous" && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Frequency X (a):</span>
                        <span className="font-mono tabular-nums text-cyan-400 font-bold">{customFreqA}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="16"
                        step="1"
                        value={customFreqA}
                        onChange={e => setCustomFreqA(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Frequency Y (b):</span>
                        <span className="font-mono tabular-nums text-cyan-400 font-bold">{customFreqB}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="16"
                        step="1"
                        value={customFreqB}
                        onChange={e => setCustomFreqB(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Phase \delta:</span>
                        <span className="font-mono tabular-nums text-cyan-400">{customLissPhase.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="6.28"
                        step="0.05"
                        value={customLissPhase}
                        onChange={e => setCustomLissPhase(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-900 rounded-lg accent-cyan-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleApplyCustomBuilder}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-950/50 cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>ประมวลผลและสร้างงานภาพ GPU แบบ Real-time (Apply to Studio)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
