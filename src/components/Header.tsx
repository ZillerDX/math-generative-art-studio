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
  Activity,
  Grid,
  Waves
} from "lucide-react";

interface Props {
  state: StudioState;
  onSelectCategory: (category: MathCategory) => void;
  onOpenGallery: () => void;
  onOpenAnimationModal: () => void;
  onTakeScreenshot: () => void;
  onTogglePause: () => void;
  onResetParameters: () => void;
}

const CATEGORIES: { id: MathCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "fractals", label: "Fractals", icon: Atom },
  { id: "parametric", label: "Parametric", icon: Compass },
  { id: "attractors", label: "Attractors", icon: Activity },
  { id: "cellular", label: "Cellular", icon: Grid },
  { id: "flowfields", label: "Flow Fields", icon: Waves }
];

export const Header: React.FC<Props> = ({
  state,
  onSelectCategory,
  onOpenGallery,
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
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-900/40">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-slate-100">
              AXIOM
            </span>
            <span className="text-[11px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
              Math & Art Studio
            </span>
          </div>
        </div>
      </div>

      {/* Category Switcher Tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/90">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = state.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Studio Action Controls */}
      <div className="flex items-center gap-2">
        {/* Preset Gallery Trigger */}
        <button
          onClick={onOpenGallery}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm"
          title="Open Curated Mathematical Presets"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Presets</span>
        </button>

        {/* Animation & Video Trigger */}
        <button
          onClick={onOpenAnimationModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm"
          title="Synthesize Motion & Record 60fps Video"
        >
          <Video className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Animate</span>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={onTogglePause}
          className={`p-1.5 rounded-lg text-xs font-medium border transition-colors ${
            state.isPaused
              ? "bg-amber-950/60 border-amber-600 text-amber-300"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
          title={state.isPaused ? "Resume Animation" : "Pause Animation"}
        >
          {state.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Reset Parameters */}
        <button
          onClick={onResetParameters}
          className="p-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Reset Parameters to Preset Defaults"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Snapshot PNG */}
        <button
          onClick={onTakeScreenshot}
          className="p-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
          title="Capture High-Resolution PNG"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Share Zero-Database Link */}
        <button
          onClick={handleShare}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            copied
              ? "bg-emerald-600 text-white font-semibold"
              : "bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-semibold shadow-md shadow-cyan-950/50"
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
