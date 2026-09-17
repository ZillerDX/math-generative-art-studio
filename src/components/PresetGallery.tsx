import React, { useState, useEffect } from "react";
import katex from "katex";
import { PRESETS } from "../presets/presetCatalog";
import type { MathCategory, PresetDef, Language, ThemeMode } from "../types/studio";
import { getTranslation } from "../i18n/translations";
import { X, Sparkles, Compass, Atom, Activity, Grid, Waves, Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  lang: Language;
  theme?: ThemeMode;
  activePresetId: string;
  onClose: () => void;
  onSelectPreset: (preset: PresetDef) => void;
}

const CATEGORY_TABS: { id: MathCategory | "all"; icon: React.FC<{ className?: string }> }[] = [
  { id: "all", icon: Sparkles },
  { id: "fractals", icon: Atom },
  { id: "parametric", icon: Compass },
  { id: "attractors", icon: Activity },
  { id: "cellular", icon: Grid },
  { id: "flowfields", icon: Waves },
];

export const PresetGallery: React.FC<Props> = ({
  isOpen,
  lang,
  theme = "dark",
  activePresetId,
  onClose,
  onSelectPreset
}) => {
  const t = getTranslation(lang);
  const isLight = theme === "light";
  const [selectedCategory, setSelectedCategory] = useState<MathCategory | "all">("all");

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

  if (!isOpen) return null;

  const filteredPresets = selectedCategory === "all"
    ? PRESETS
    : PRESETS.filter(p => p.category === selectedCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-colors ${
          isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-200"
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-slate-200 bg-slate-50/50" : "border-slate-800"}`}>
          <div>
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-slate-100"}`}>
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <span>{t.presetsTitle}</span>
            </h2>
            <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {t.presetsSubtitle}
            </p>
          </div>

          {/* Single Close Button per frontend-design standard */}
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

        {/* Category Filter Tabs */}
        <div className={`flex items-center gap-1.5 px-6 py-3 border-b overflow-x-auto ${
          isLight ? "border-slate-200 bg-slate-50" : "border-slate-800/80 bg-slate-950/40"
        }`}>
          {CATEGORY_TABS.map(tab => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            const label = tab.id === "all" ? t.allWorks : t.categories[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? isLight
                      ? "bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-xs"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : isLight
                    ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Bento Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPresets.map(preset => {
            const isCurrent = activePresetId === preset.id;
            const mathHtml = katex.renderToString(preset.mathFormulaLatex, {
              throwOnError: false,
              displayMode: false
            });

            return (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className={`group relative rounded-xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden min-h-[300px] ${
                  isCurrent
                    ? isLight
                      ? "bg-white border-cyan-500 ring-2 ring-cyan-400 shadow-xl"
                      : "bg-slate-800/90 border-cyan-500 ring-2 ring-cyan-500/40 shadow-xl"
                    : isLight
                    ? "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white hover:-translate-y-0.5 shadow-xs"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 hover:-translate-y-0.5"
                }`}
              >
                {/* Visual Top Glow Banner */}
                <div className={`h-24 -mx-4 -mt-4 mb-3 bg-gradient-to-br ${preset.thumbnailGradient} relative flex items-end p-3 overflow-hidden border-b ${
                  isLight ? "border-slate-200" : "border-slate-800/60"
                } shrink-0`}>
                  <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
                  <span className="relative z-10 text-[11px] font-mono uppercase tracking-wider text-white bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-md border border-white/20">
                    {preset.category}
                  </span>
                  {isCurrent && (
                    <span className="relative z-10 ml-auto flex items-center gap-1 text-[11px] font-medium text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                      <Check className="w-3 h-3" />
                      <span>{t.activeBadge}</span>
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-1.5 flex-grow">
                  <h3 className={`font-semibold text-sm transition-colors ${
                    isLight ? "text-slate-900 group-hover:text-cyan-600" : "text-slate-100 group-hover:text-cyan-300"
                  }`}>
                    {preset.title}
                  </h3>
                  <p className={`text-xs line-clamp-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {preset.description}
                  </p>
                </div>

                {/* Formula Display Container - Spacious, Unclipped */}
                <div className={`mt-3.5 pt-3 border-t ${isLight ? "border-slate-200" : "border-slate-800/80"}`}>
                  <div className={`w-full min-h-[50px] px-3 py-2 rounded-lg border text-xs sm:text-[13px] font-serif flex items-center justify-start overflow-x-auto shadow-inner ${
                    isLight ? "bg-white border-slate-200 text-cyan-900" : "bg-slate-950/90 border-slate-800/80 text-cyan-300"
                  }`}>
                    <div
                      className="inline-block whitespace-nowrap py-1 leading-normal select-text"
                      dangerouslySetInnerHTML={{ __html: mathHtml }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
