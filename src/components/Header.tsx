import React, { useState } from "react";
import type { MathCategory, StudioState } from "../types/studio";
import { generateShareUrl } from "../state/urlCodec";
import {
  Sparkles,
  Share2,
  Camera,
  Video,
  Play,
  Pause,
  RotateCcw,
  Check,
  Compass,
  Atom,
  Grid,
  Waves,
  Sigma,
  Infinity
} from "lucide-react";
import { AxiomBrandIcon } from "./AxiomBrandIcon";

interface Props {
  state: StudioState;
  onSelectCategory: (category: MathCategory) => void;
  onOpenGallery: () => void;
  onOpenCustomMath: () => void;
  onOpenAnimationModal: () => void;
  onTakeScreenshot: () => void;
  onTogglePause: () => void;
  onResetParameters: () => void;
}

const CATEGORIES: { id: MathCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "fractals", label: "Fractals", icon: Atom },
  { id: "parametric", label: "Parametric", icon: Compass },
  { id: "attractors", label: "Attractors", icon: Infinity },
  { id: "cellular", label: "Cellular", icon: Grid },
  { id: "flowfields", label: "Flow Fields", icon: Waves }
];


export const Header: React.FC<Props> = ({
  state,
  onSelectCategory,
  onOpenGallery,
  onOpenCustomMath,
  onOpenAnimationModal,
  onTakeScreenshot,
  onTogglePause,
  onResetParameters
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = generateShareUrl(state);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <header className="h-18 border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-xl px-5 flex items-center justify-between select-none z-30 shrink-0 shadow-lg shadow-black/30">
      {/* Brand & Logo (Left Side) */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-lg shadow-cyan-950/60 p-2 shrink-0 group hover:border-cyan-400/80 transition-all">
          <AxiomBrandIcon size={28} className="w-full h-full" />
        </div>
        <div className="flex flex-col whitespace-nowrap shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-wider text-slate-100 font-mono">
              AXIOM
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              Math & Art Studio
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline-block font-mono">
            WebGL2 60 FPS GLSL Engine
          </span>
        </div>
      </div>


      {/* Right Side Controls Group (Category Menus + Math Lab + Studio Actions) */}
      <div className="flex items-center gap-2.5">
        {/* Category Switcher Tabs (Moved to the Right!) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = state.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="h-6 w-px bg-slate-800 hidden lg:block" />

        {/* Custom Math Lab Trigger Button */}
        <button
          onClick={onOpenCustomMath}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-950/90 to-indigo-950/90 hover:from-cyan-900/90 hover:to-indigo-900/90 text-cyan-300 border border-cyan-500/60 shadow-md shadow-cyan-950/50 transition-all cursor-pointer hover:border-cyan-400"
          title="Input Custom Mathematical Formulas & Explore Suggestions"
        >
          <Sigma className="w-4 h-4 text-cyan-400" />
          <span>Math Lab</span>
        </button>

        {/* Preset Gallery Trigger */}
        <button
          onClick={onOpenGallery}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm"
          title="Open Curated Mathematical Presets"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Presets</span>
        </button>

        {/* Animation & Video Trigger */}
        <button
          onClick={onOpenAnimationModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm"
          title="Synthesize Motion & Record 60fps Video"
        >
          <Video className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Animate</span>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={onTogglePause}
          className={`p-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            state.isPaused
              ? "bg-amber-950/70 border-amber-600 text-amber-300 shadow-md"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
          }`}
          title={state.isPaused ? "Resume Animation" : "Pause Animation"}
        >
          {state.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Reset Parameters */}
        <button
          onClick={onResetParameters}
          className="p-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Reset Parameters to Preset Defaults"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Snapshot PNG */}
        <button
          onClick={onTakeScreenshot}
          className="p-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Capture High-Resolution PNG"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Share Zero-Database Link */}
        <button
          onClick={handleShare}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            copied
              ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/60"
              : "bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold shadow-lg shadow-cyan-950/60"
          }`}
          title="Copy Zero-Database URL Link"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Link Copied!" : "Share"}</span>
        </button>
      </div>
    </header>
  );
};
