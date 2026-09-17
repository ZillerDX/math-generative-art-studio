import React, { useState, useEffect, useMemo } from "react";
import katex from "katex";
import type { MathCategory, Language, ParameterDef, ThemeMode } from "../types/studio";
import { getTranslation } from "../i18n/translations";
import { MathCalculatorKeypad } from "./MathCalculatorKeypad";
import {
  X,
  Sigma,
  Sparkles,
  Sliders,
  Compass,
  Atom,
  Activity,
  ArrowRight,
  BookOpen,
  Calculator
} from "lucide-react";


export interface MathSuggestion {
  id: string;
  name: Record<Language, string>;
  category: MathCategory;
  equationName: string;
  latex: string;
  visualOutcome: Record<Language, string>;
  visualTags: Record<Language, string[]>;
  parameters: Record<string, number>;
  palette: string;
  zoom: number;
  pan: [number, number];
}

const MATH_SUGGESTIONS: MathSuggestion[] = [
  {
    id: "sug-tricorn",
    name: {
      en: "Tricorn (Mandelbar Fractal)",
      th: "ไตรคอร์น (แฟร็กทัลแมนเดลบาร์)"
    },
    category: "fractals",
    equationName: "burningship",
    latex: `z_{n+1} = (\\overline{z}_n)^2 + c = (\\operatorname{Re}(z_n) - i\\operatorname{Im}(z_n))^2 + c`,
    visualOutcome: {
      en: "A triangular fractal structure with sharp spines and 3-fold symmetry, reminiscent of an ancient pirate tricorn hat. High boundary contrast with razor-sharp filigree.",
      th: "โครงสร้างแฟร็กทัลรูปสามเหลี่ยมที่มีหนามแหลมและปีกสมมาตร 3 ทิศทาง ให้ความรู้สึกคล้ายหมวกโจรสลัดยุคโบราณ ลวดลายขอบมีประกายหนามละเอียดและมีความคมชัดสูง"
    },
    visualTags: {
      en: ["3-Fold Symmetry", "Sharp Spines", "Conjugate Fractal"],
      th: ["สมมาตร 3 แฉก", "หนามแหลมคม", "แฟร็กทัลสังยุค"]
    },
    parameters: { maxIter: 200, colorCycles: 2.8 },
    palette: "inferno",
    zoom: 1.8,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-multibrot-4",
    name: {
      en: "Quatric Multibrot (4-Petal Rosette)",
      th: "ควอทริก มัลติโบรต์ (สมมาตรดอกไม้ 4 กลีบ)"
    },
    category: "fractals",
    equationName: "mandelbrot",
    latex: `z_{n+1} = z_n^4 + c, \\quad z_0 = 0`,
    visualOutcome: {
      en: "4-fold rotational symmetry with a central core and radiating crystal petals, reminiscent of ice crystals or Gothic stained-glass cathedral rosettes.",
      th: "แฟร็กทัลรูปดอกไม้ 4 แฉกที่มีสมมาตรการหมุน 4 ทิศทาง มีเกสรตรงกลางและกลีบแก้วสะท้อนรอบทิศทาง ให้ภาพเหมือนผลึกหิมะหรือหน้าต่างกระจกสีโกธิคในวิหารโบราณ"
    },
    visualTags: {
      en: ["4-Fold Symmetry", "Snow Crystal", "Gothic Rosette"],
      th: ["สมมาตร 4 ทิศ", "ผลึกหิมะ", "สถาปัตยกรรมโกธิค"]
    },
    parameters: { maxIter: 180, bailout: 4.0, power: 4, colorCycles: 3.0 },
    palette: "electric-neon",
    zoom: 1.2,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-douady-rabbit",
    name: {
      en: "Douady Rabbit",
      th: "กระต่ายของดูอาดี"
    },
    category: "fractals",
    equationName: "julia",
    latex: `z_{n+1} = z_n^2 + C, \\quad C = -0.123 + 0.745i`,
    visualOutcome: {
      en: "Continuously orbiting 3-pronged spiral rabbit ears forming infinite self-similar structures with branching bioluminescent electrical filaments.",
      th: "เกลียวแฟร็กทัลสามแฉกคล้ายหูกระต่ายหมุนวนต่อเนื่อง เกิดโครงสร้างแบบความคล้ายตนเองไม่รู้จบ มีกิ่งก้านสายฟ้าแตกแขนงคล้ายโครงข่ายประสาทเรืองแสง"
    },
    visualTags: {
      en: ["3-Armed Spiral", "Bioluminescent", "Self-Similar"],
      th: ["เกลียว 3 ทิศ", "สายฟ้าเรืองแสง", "ความคล้ายตนเอง"]
    },
    parameters: { cr: -0.123, ci: 0.745, maxIter: 240, colorCycles: 3.2 },
    palette: "plasma-purple",
    zoom: 1.3,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-maurer-rose",
    name: {
      en: "Septal Harmonograph Rose (14-Petal Mesh)",
      th: "ฮาร์โมโนกราฟกุหลาบ 14 กลีบสาน"
    },
    category: "parametric",
    equationName: "rose",
    latex: `r = a \\cdot \\cos\\left(\\frac{7}{4}\\theta + \\phi\\right)`,
    visualOutcome: {
      en: "14 geometric rose petals interlaced across 4 full revolutions, forming an intricate 3D holographic wireframe mesh resembling laser spiderwebs or mandalas.",
      th: "กลีบกุหลาบเรขาคณิต 14 กลีบที่ร้อยเรียงทับซ้อนกัน 4 รอบเต็ม เกิดเป็นตาข่ายโฮโลแกรมสามมิติที่ซับซ้อน คล้ายใยแมงมุมเลเซอร์เรืองแสงหรือลวดลายแมนดาลา"
    },
    visualTags: {
      en: ["Harmonic Rose", "Holographic Mesh", "Mandala"],
      th: ["กุหลาบฮาร์มอนิก", "ใยแสงโฮโลแกรม", "แมนดาลา"]
    },
    parameters: { n: 7, d: 4, a: 0.88, phase: 0.0, glow: 0.022 },
    palette: "plasma-purple",
    zoom: 1.0,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-star-blossom",
    name: {
      en: "Needle Star Blossom (22-Point Star)",
      th: "ดวงดารากลีบเข็ม 22 แฉก"
    },
    category: "parametric",
    equationName: "rose",
    latex: `r = a \\cdot \\cos\\left(\\frac{11}{2}\\theta\\right)`,
    visualOutcome: {
      en: "22 laser needle rays bursting outward from the core, crossing into sharp stellar flares with gem-like refraction and astronomical symmetry.",
      th: "เส้นสายเข็มแสงเลเซอร์ 22 แฉกพุ่งออกจากศูนย์กลาง สลับไขว้กันเป็นประกายดวงดาวที่คมชัด ให้ความรู้สึกเหมือนอัญมณีเรืองแสงหรือผลึกคริสตัลดาราศาสตร์"
    },
    visualTags: {
      en: ["22-Point Star", "Laser Needle", "Crystalline Gem"],
      th: ["ดวงดาว 22 แฉก", "เข็มแสงเลเซอร์", "ผลึกอัญมณี"]
    },
    parameters: { n: 11, d: 2, a: 0.92, phase: 0.78, glow: 0.016 },
    palette: "cyber-cyan",
    zoom: 1.0,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-torus-knot",
    name: {
      en: "Lissajous Kinetic Knot",
      th: "ปมเรขาคณิตคลื่นลิสซาจูส์"
    },
    category: "parametric",
    equationName: "lissajous",
    latex: `x = \\sin(7t + \\frac{\\pi}{2}), \\quad y = \\sin(9t)`,
    visualOutcome: {
      en: "Orthogonal waveforms weaving into a 3D tubular beam, creating a rotating quantum ring and kinetic optical illusion with harmonious proportions.",
      th: "เส้นสายออร์โธโกนอลไขว้สานกันเป็นท่อแสงทรงกระบอก 3 มิติ ดูเหมือนวงแหวนควอนตัมที่กำลังหมุนเหวี่ยงและเคลื่อนไหวลวงตา"
    },
    visualTags: {
      en: ["3D Knot", "Transducer", "Kinetic Illusion"],
      th: ["ปม 3 มิติ", "ทรานส์ดิวเซอร์", "ภาพลวงตาจลนศาสตร์"]
    },
    parameters: { freqA: 7, freqB: 9, phase: 1.57, glow: 0.02 },
    palette: "electric-neon",
    zoom: 1.0,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-clifford-silk",
    name: {
      en: "Clifford Silk Vortex",
      th: "ม่านไหมคลิฟฟอร์ดแห่งความน่าจะเป็น"
    },
    category: "attractors",
    equationName: "clifford",
    latex: `x_{n+1} = \\sin(-1.4 y_n) + \\cos(-1.4 x_n), \\quad y_{n+1} = \\sin(1.6 x_n) + 0.7 \\cos(1.6 y_n)`,
    visualOutcome: {
      en: "Millions of translucent silk fog layers overlapping into smooth probability ribbons, resembling glowing cosmic nebula smoke floating in deep space.",
      th: "ม่านหมอกไหมพริ้วไหวโปร่งแสงหลายล้านชั้น ซ้อนทับกันเป็นริบบิ้นคลื่นความน่าจะเป็นที่นุ่มนวลเหมือนควันเรืองแสงในอวกาศ"
    },
    visualTags: {
      en: ["Translucent Silk", "Flowing Ribbon", "Chaos Fluid"],
      th: ["ม่านไหมโปร่งแสง", "ริบบิ้นพริ้วไหว", "เคออสฟลูอิด"]
    },
    parameters: { a: -1.4, b: 1.6, c: 1.0, d: 0.7 },
    palette: "plasma-purple",
    zoom: 1.0,
    pan: [0.0, 0.0]
  },
  {
    id: "sug-lorenz-convection",
    name: {
      en: "Atmospheric Chaos Butterfly",
      th: "ผีเสื้อแห่งความโกลาหลบรรยากาศ"
    },
    category: "attractors",
    equationName: "lorenz",
    latex: `\\dot{x} = 10(y-x), \\quad \\dot{y} = x(28-z)-y, \\quad \\dot{z} = xy - \\frac{8}{3}z`,
    visualOutcome: {
      en: "Dual butterfly wings of atmospheric convective flow, looping endlessly between twin attractors without ever self-intersecting, embodying Chaos Theory.",
      th: "ปีกผีเสื้อคู่ของสมการสภาพอากาศ เลี้ยววนสลับข้างไปมาอย่างไม่รู้จบ เป็นสัญลักษณ์ของทฤษฎีความอลวน (Chaos Theory) ที่เส้นทางไม่เคยตัดกันเอง"
    },
    visualTags: {
      en: ["Butterfly Attractor", "Chaos Theory", "Atmospheric Physics"],
      th: ["ปีกผีเสื้อคู่", "ทฤษฎีความอลวน", "ฟิสิกส์บรรยากาศ"]
    },
    parameters: { sigma: 10.0, rho: 28.0, beta: 2.666, dt: 0.012, rotSpeed: 0.6 },
    palette: "inferno",
    zoom: 1.0,
    pan: [0.0, 0.0]
  }
];

interface Props {
  isOpen: boolean;
  lang: Language;
  theme?: ThemeMode;
  parameters?: ParameterDef[];
  activeParamId?: string;
  onClose: () => void;
  onApplyMath: (config: {
    category: MathCategory;
    equationName: string;
    parameters: Record<string, number>;
    zoom?: number;
    pan?: [number, number];
    palette?: string;
  }) => void;
  onApplyValueToParam?: (paramId: string, value: number) => void;
}

export const CustomMathModal: React.FC<Props> = ({
  isOpen,
  lang,
  theme = "dark",
  parameters = [],
  activeParamId,
  onClose,
  onApplyMath,
  onApplyValueToParam
}) => {
  const t = getTranslation(lang);
  const isLight = theme === "light";
  const [activeTab, setActiveTab] = useState<"suggestions" | "builder" | "keypad">("suggestions");

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
      return lang === "th"
        ? `จะสร้างโครงสร้างแฟร็กทัลที่มีสมมาตรแบบหมุนวน ${customPower - 1} หรือ ${customPower} แฉก มีโครงข่ายเดนไดรต์แตกแขนงละเอียดลึก ${customMaxIter} ชั้น`
        : `Will generate a fractal structure with ${customPower - 1}-fold or ${customPower}-fold rotational symmetry, featuring dendritic filaments computed to a recursion depth of ${customMaxIter}.`;
    } else if (builderType === "rose") {
      const k = customN / customD;
      const isInteger = Number.isInteger(k);
      const petals = isInteger ? (k % 2 === 1 ? k : 2 * k) : customN * (customD % 2 === 0 ? 2 : 1);
      return lang === "th"
        ? `จะสร้างลวดลายกุหลาบเรขาคณิตจำนวนประมาณ ${petals} กลีบ โดยเส้นสายจะหมุนทับซ้อนกัน ${customD} รอบเต็ม เกิดเป็นตาข่ายโฮโลแกรมเรืองแสง`
        : `Will generate a geometric rose pattern with approximately ${petals} petals, winding across ${customD} full revolutions into an intricate holographic mesh.`;
    } else {
      return lang === "th"
        ? `จะสร้างปมเรขาคณิตสามมิติที่มีความถี่แกน X:Y ที่อัตราส่วน ${customFreqA}:${customFreqB} มีจุดตัดและวงวนสมมาตรตามมุมเฟส ${customLissPhase.toFixed(2)} rad`
        : `Will generate a 3D kinetic knot with an X:Y frequency ratio of ${customFreqA}:${customFreqB}, creating orbital symmetry at phase ${customLissPhase.toFixed(2)} rad.`;
    }
  }, [lang, builderType, customPower, customMaxIter, customN, customD, customFreqA, customFreqB, customLissPhase]);

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
        className={`relative w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-colors ${
          isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-200"
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? "border-slate-200 bg-slate-50/70" : "border-slate-800 bg-slate-950/40"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-900/40">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-semibold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-slate-100"}`}>
                <span>{t.mathLabTitle}</span>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                  isLight ? "bg-cyan-50 border-cyan-300 text-cyan-800" : "bg-cyan-950 border border-cyan-500/50 text-cyan-300"
                }`}>
                  Formula Engine
                </span>
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {t.mathLabSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isLight
                ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            }`}
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs: Suggestions vs Custom Builder vs Scientific Keypad */}
        <div className={`flex items-center gap-2 px-6 pt-3 pb-2 border-b overflow-x-auto ${
          isLight ? "border-slate-200 bg-slate-50/50" : "border-slate-800/80 bg-slate-950/20"
        }`}>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "suggestions"
                ? isLight
                  ? "bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-xs"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tabSuggestions}</span>
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "builder"
                ? isLight
                  ? "bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-xs"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t.tabBuilder}</span>
          </button>
          <button
            onClick={() => setActiveTab("keypad")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "keypad"
                ? isLight
                  ? "bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-xs"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.tabKeypad}</span>
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
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 shadow-md ${
                      isLight
                        ? "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                        : "bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60"
                    }`}
                  >
                    {/* Header: Title & Tags */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isLight
                            ? "bg-white text-cyan-800 border-slate-200"
                            : "bg-slate-900 text-cyan-400 border-slate-800"
                        }`}>
                          {sug.category}
                        </span>
                        <div className="flex gap-1">
                          {(sug.visualTags[lang] || sug.visualTags.en).map(tag => (
                            <span
                              key={tag}
                              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                isLight
                                  ? "bg-slate-100 text-slate-600 border-slate-200"
                                  : "bg-slate-800/60 text-slate-400 border-slate-700/50"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className={`font-semibold text-sm mt-1 ${isLight ? "text-slate-900" : "text-slate-100"}`}>
                        {sug.name[lang] || sug.name.en}
                      </h3>
                    </div>

                    {/* Rendered Math Formula - Spacious and Unclipped */}
                    <div className={`w-full min-h-[50px] px-3 py-2.5 rounded-lg border text-xs sm:text-[13px] font-serif flex items-center justify-start overflow-x-auto shadow-inner ${
                      isLight
                        ? "bg-white border-slate-200 text-cyan-900"
                        : "bg-slate-900 border-slate-800 text-cyan-300"
                    }`}>
                      <div
                        className="inline-block whitespace-nowrap py-1 select-text leading-normal"
                        dangerouslySetInnerHTML={{ __html: mathHtml }}
                      />
                    </div>

                    {/* What Visual Will It Make */}
                    <div className={`p-3 rounded-lg border flex flex-col gap-1 text-xs ${
                      isLight
                        ? "bg-white border-slate-200"
                        : "bg-slate-900/40 border-slate-800/80"
                    }`}>
                      <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.visualOutcomeLabel}</span>
                      </span>
                      <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                        {sug.visualOutcome[lang] || sug.visualOutcome.en}
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
                      className={`mt-1 w-full py-2 px-3 rounded-lg font-semibold text-xs border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        isLight
                          ? "bg-cyan-50 hover:bg-cyan-500 text-cyan-800 hover:text-white border-cyan-300 hover:border-cyan-500"
                          : "bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border-cyan-500/50 hover:border-cyan-400"
                      }`}
                    >
                      <span>{t.applyMathBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : activeTab === "builder" ? (
            /* TAB 2: CUSTOM MATH BUILDER */
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              {/* Paradigm Selector */}
              <div className="flex flex-col gap-2">
                <label className={`text-xs font-semibold uppercase tracking-wider ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}>
                  {t.paradigmLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBuilderType("rose")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      builderType === "rose"
                        ? isLight
                          ? "bg-cyan-50 border-cyan-500 text-cyan-800 shadow-md ring-1 ring-cyan-400"
                          : "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/50"
                        : isLight
                        ? "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>{t.paradigmRose}</span>
                  </button>
                  <button
                    onClick={() => setBuilderType("fractal")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      builderType === "fractal"
                        ? isLight
                          ? "bg-cyan-50 border-cyan-500 text-cyan-800 shadow-md ring-1 ring-cyan-400"
                          : "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/50"
                        : isLight
                        ? "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Atom className="w-4 h-4" />
                    <span>{t.paradigmFractal}</span>
                  </button>
                  <button
                    onClick={() => setBuilderType("lissajous")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      builderType === "lissajous"
                        ? isLight
                          ? "bg-cyan-50 border-cyan-500 text-cyan-800 shadow-md ring-1 ring-cyan-400"
                          : "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md ring-1 ring-cyan-500/50"
                        : isLight
                        ? "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>{t.paradigmLissajous}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Live Formula Preview */}
              <div className={`flex flex-col gap-1.5 p-4 rounded-xl border ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-950/80 border-slate-800 shadow-inner"
              }`}>
                <span className={`text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? "text-cyan-700 font-bold" : "text-cyan-400"
                }`}>
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t.livePreviewLabel}</span>
                </span>
                <div
                  className={`py-3 px-4 text-center text-base sm:text-lg overflow-x-auto select-text font-serif ${
                    isLight ? "text-cyan-900" : "text-cyan-200"
                  }`}
                  dangerouslySetInnerHTML={{ __html: renderedLiveLatexHtml }}
                />
              </div>

              {/* Real-time Visual Outcome Prediction */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                isLight ? "bg-cyan-50/80 border-cyan-200" : "bg-cyan-950/30 border-cyan-500/40"
              }`}>
                <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
                <div>
                  <span className={`font-semibold block mb-0.5 ${isLight ? "text-cyan-900" : "text-cyan-300"}`}>
                    {t.visualPredictionLabel}
                  </span>
                  <p className={`leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    {liveVisualOutcome}
                  </p>
                </div>
              </div>

              {/* Interactive Equation Parameter Sliders / Inputs */}
              <div className={`flex flex-col gap-4 p-4 rounded-xl border ${
                isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-950/50 border-slate-800"
              }`}>
                {builderType === "rose" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                          <span>{t.builderNumerator}</span>
                          <span className={`font-mono tabular-nums font-bold ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customN}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="16"
                          step="1"
                          value={customN}
                          onChange={e => setCustomN(parseInt(e.target.value))}
                          className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                        />
                      </div>
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                          <span>{t.builderDenominator}</span>
                          <span className={`font-mono tabular-nums font-bold ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customD}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="12"
                          step="1"
                          value={customD}
                          onChange={e => setCustomD(parseInt(e.target.value))}
                          className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                          <span>{t.builderAmplitude}</span>
                          <span className={`font-mono tabular-nums font-bold ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customAmp.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.3"
                          max="1.5"
                          step="0.05"
                          value={customAmp}
                          onChange={e => setCustomAmp(parseFloat(e.target.value))}
                          className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                        />
                      </div>
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                          <span>{t.builderPhase}</span>
                          <span className={`font-mono tabular-nums ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customPhase.toFixed(2)} rad</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="6.28"
                          step="0.05"
                          value={customPhase}
                          onChange={e => setCustomPhase(parseFloat(e.target.value))}
                          className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                        />
                      </div>
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                          <span>{t.builderLaserGlow}</span>
                          <span className={`font-mono tabular-nums ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customGlow.toFixed(3)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.005"
                          max="0.06"
                          step="0.002"
                          value={customGlow}
                          onChange={e => setCustomGlow(parseFloat(e.target.value))}
                          className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                        />
                      </div>
                    </div>
                  </>
                )}


                {builderType === "fractal" && (
                  <>
                    <div className={`flex items-center justify-between pb-2 border-b ${
                      isLight ? "border-slate-200" : "border-slate-800"
                    }`}>
                      <span className={`text-xs ${isLight ? "text-slate-700" : "text-slate-300"}`}>{t.builderFractalMode}</span>
                      <div className="flex gap-1 text-xs">
                        <button
                          onClick={() => setIsJuliaMode(true)}
                          className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                            isJuliaMode
                              ? isLight
                                ? "bg-cyan-500 text-white font-bold shadow-sm"
                                : "bg-cyan-500 text-slate-950 font-bold"
                              : isLight
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {t.builderJuliaMode}
                        </button>
                        <button
                          onClick={() => setIsJuliaMode(false)}
                          className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                            !isJuliaMode
                              ? isLight
                                ? "bg-cyan-500 text-white font-bold shadow-sm"
                                : "bg-cyan-500 text-slate-950 font-bold"
                              : isLight
                              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                          }`}
                        >
                          {t.builderMandelMode}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                          <span>{t.builderPolyPower}</span>
                          <span className={`font-mono tabular-nums font-bold ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customPower}</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="8"
                          step="1"
                          value={customPower}
                          onChange={e => setCustomPower(parseInt(e.target.value))}
                          className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                        />
                      </div>
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                          <span>{t.builderMaxIter}</span>
                          <span className={`font-mono tabular-nums font-bold ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customMaxIter}</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          step="10"
                          value={customMaxIter}
                          onChange={e => setCustomMaxIter(parseInt(e.target.value))}
                          className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                        />
                      </div>
                    </div>


                    {isJuliaMode && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                            <span>{t.builderRealConst}</span>
                            <span className={`font-mono tabular-nums ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customCr.toFixed(3)}</span>
                          </div>
                          <input
                            type="range"
                            min="-1.5"
                            max="1.5"
                            step="0.01"
                            value={customCr}
                            onChange={e => setCustomCr(parseFloat(e.target.value))}
                            className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                          />
                        </div>
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                            <span>{t.builderImagConst}</span>
                            <span className={`font-mono tabular-nums ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customCi.toFixed(3)}</span>
                          </div>
                          <input
                            type="range"
                            min="-1.5"
                            max="1.5"
                            step="0.01"
                            value={customCi}
                            onChange={e => setCustomCi(parseFloat(e.target.value))}
                            className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {builderType === "lissajous" && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                        <span>{t.builderFreqX}</span>
                        <span className={`font-mono tabular-nums font-bold ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customFreqA}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="16"
                        step="1"
                        value={customFreqA}
                        onChange={e => setCustomFreqA(parseInt(e.target.value))}
                        className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                      />
                    </div>
                    <div>
                      <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                        <span>{t.builderFreqY}</span>
                        <span className={`font-mono tabular-nums font-bold ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customFreqB}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="16"
                        step="1"
                        value={customFreqB}
                        onChange={e => setCustomFreqB(parseInt(e.target.value))}
                        className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
                      />
                    </div>
                    <div>
                      <div className={`flex justify-between text-xs mb-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                        <span>{t.builderPhaseDelta}</span>
                        <span className={`font-mono tabular-nums ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>{customLissPhase.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="6.28"
                        step="0.05"
                        value={customLissPhase}
                        onChange={e => setCustomLissPhase(parseFloat(e.target.value))}
                        className={`w-full h-1.5 rounded-lg ${isLight ? "bg-slate-200 accent-cyan-600" : "bg-slate-900 accent-cyan-400"}`}
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
                <span>{t.applyStudioBtn}</span>
              </button>
            </div>
          ) : (
            /* TAB 3: SCIENTIFIC KEYPAD */
            <div className="max-w-3xl mx-auto py-2">
              <MathCalculatorKeypad
                lang={lang}
                parameters={parameters}
                activeParamId={activeParamId}
                onApplyValueToParam={(paramId, value) => {
                  onApplyValueToParam?.(paramId, value);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
