import React, { useState } from "react";
import type { StudioState, Language } from "../types/studio";
import { generateShareUrl } from "../state/urlCodec";
import { getTranslation } from "../i18n/translations";
import {
  Sparkles,
  Share2,
  Camera,
  Video,
  Play,
  Pause,
  RotateCcw,
  Check,
  Sigma,
  Sun,
  Moon
} from "lucide-react";
import { AxiomBrandIcon } from "./AxiomBrandIcon";

interface Props {
  state: StudioState;
  onOpenGallery: () => void;
  onOpenCustomMath: () => void;
  onOpenAnimationModal: () => void;
  onTakeScreenshot: () => void;
  onTogglePause: () => void;
  onResetParameters: () => void;
  onToggleLanguage: (lang: Language) => void;
  onToggleTheme: () => void;
}

export const Header: React.FC<Props> = ({
  state,
  onOpenGallery,
  onOpenCustomMath,
  onOpenAnimationModal,
  onTakeScreenshot,
  onTogglePause,
  onResetParameters,
  onToggleLanguage,
  onToggleTheme
}) => {
  const [copied, setCopied] = useState(false);
  const t = getTranslation(state.lang);
  const isLight = state.theme === "light";

  const handleShare = () => {
    const url = generateShareUrl(state);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <header className={`h-18 border-b backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between select-none z-30 shrink-0 transition-colors duration-200 ${
      isLight 
        ? "bg-white/95 border-slate-200 text-slate-900 shadow-sm" 
        : "bg-slate-950/90 border-slate-800/90 text-slate-100 shadow-lg shadow-black/30"
    }`}>
      {/* Brand & Logo (Left Side) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl border p-2 shrink-0 group transition-all ${
          isLight
            ? "bg-slate-50 border-cyan-400 shadow-md shadow-cyan-100"
            : "bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/60 hover:border-cyan-400/80"
        }`}>
          <AxiomBrandIcon size={28} className="w-full h-full" />
        </div>
        <div className="flex flex-col whitespace-nowrap shrink-0">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold text-base tracking-wider font-mono ${isLight ? "text-slate-900" : "text-slate-100"}`}>
              {t.brandName}
            </span>
            <span className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${
              isLight
                ? "bg-cyan-50 text-cyan-800 border-cyan-300"
                : "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
            }`}>
              {t.brandTagline}
            </span>
          </div>
          <span className={`text-[11px] hidden md:inline-block font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>
            {t.engineBadge}
          </span>
        </div>
      </div>

      {/* Right Side Controls Group (Consolidated, Spacious & Clean) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Presets Gallery Trigger (The primary home for curated works & all math categories) */}
        <button
          onClick={onOpenGallery}
          className={`h-10 flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm whitespace-nowrap ${
            isLight
              ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
              : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700"
          }`}
          title={t.presetsTitle}
        >
          <Sparkles className="w-4 h-4 text-cyan-500" />
          <span>{t.presets}</span>
        </button>

        {/* Custom Math Lab Trigger Button (Math suggestions, custom builder, and scientific keypad) */}
        <button
          onClick={onOpenCustomMath}
          className="h-10 flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white border border-cyan-400/40 shadow-md shadow-cyan-900/20 transition-all cursor-pointer whitespace-nowrap"
          title={t.mathLabSubtitle}
        >
          <Sigma className="w-4 h-4" />
          <span>{t.mathLab}</span>
        </button>

        {/* Animation & Video Trigger */}
        <button
          onClick={onOpenAnimationModal}
          className={`h-10 flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm whitespace-nowrap ${
            isLight
              ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
              : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700"
          }`}
          title={t.motionTitle}
        >
          <Video className="w-4 h-4 text-indigo-500" />
          <span className="hidden sm:inline">{t.animate}</span>
        </button>

        <div className={`h-6 w-px mx-0.5 ${isLight ? "bg-slate-200" : "bg-slate-800"}`} />

        {/* Play/Pause Button */}
        <button
          onClick={onTogglePause}
          className={`h-10 w-10 flex items-center justify-center rounded-xl text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
            state.isPaused
              ? "bg-amber-500/20 border-amber-500 text-amber-500 shadow-md"
              : isLight
              ? "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
          }`}
          title={state.isPaused ? t.resume : t.pause}
        >
          {state.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Reset Parameters */}
        <button
          onClick={onResetParameters}
          className={`h-10 w-10 flex items-center justify-center rounded-xl text-xs border transition-colors cursor-pointer shrink-0 ${
            isLight
              ? "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
          title={t.reset}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Snapshot PNG */}
        <button
          onClick={onTakeScreenshot}
          className={`h-10 w-10 flex items-center justify-center rounded-xl text-xs border transition-colors cursor-pointer shrink-0 ${
            isLight
              ? "bg-slate-100 border-slate-200 text-slate-600 hover:text-cyan-600 hover:bg-slate-200"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-800"
          }`}
          title={t.snapshot}
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Share Zero-Database Link */}
        <button
          onClick={handleShare}
          className={`h-10 flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            copied
              ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/40"
              : "bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold shadow-md shadow-cyan-950/40"
          }`}
          title="Copy Zero-Database URL Link"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{copied ? t.linkCopied : t.share}</span>
        </button>

        <div className={`h-6 w-px mx-0.5 ${isLight ? "bg-slate-200" : "bg-slate-800"}`} />

        {/* Dark Mode / Light Mode Toggle (Default: Dark Mode) */}
        <button
          onClick={onToggleTheme}
          className={`h-10 w-10 flex items-center justify-center rounded-xl text-xs border transition-all cursor-pointer shrink-0 ${
            isLight
              ? "bg-amber-100/60 border-amber-300 text-amber-600 hover:bg-amber-100 shadow-sm"
              : "bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800"
          }`}
          title={state.theme === "dark" ? t.lightMode : t.darkMode}
        >
          {state.theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Multilingual EN / TH Switcher (Default: EN) */}
        <div className={`flex items-center border rounded-xl p-0.5 shrink-0 shadow-inner ${
          isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900 border-slate-800"
        }`}>
          <button
            onClick={() => onToggleLanguage("en")}
            className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              state.lang === "en"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/30"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Switch language to English (Default)"
          >
            EN
          </button>
          <button
            onClick={() => onToggleLanguage("th")}
            className={`h-8 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              state.lang === "th"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/30"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="สลับภาษาเป็นภาษาไทย"
          >
            TH
          </button>
        </div>
      </div>
    </header>
  );
};
