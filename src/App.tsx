import { useState, useRef, useEffect } from "react";
import { useStudioState } from "./state/useStudioState";
import { EQUATION_MODELS } from "./presets/equationModels";
import { getPresetById } from "./presets/presetCatalog";
import { WebGLCanvas } from "./engine/WebGLCanvas";
import type { CanvasHandle } from "./engine/WebGLCanvas";
import type { MathCategory } from "./types/studio";
import { getTranslation } from "./i18n/translations";
import { Header } from "./components/Header";
import { EquationView } from "./components/EquationView";
import { ParameterPanel } from "./components/ParameterPanel";
import { ColorPalettePicker } from "./components/ColorPalettePicker";
import { PresetGallery } from "./components/PresetGallery";
import { AnimationModal } from "./components/AnimationModal";
import { CustomMathModal } from "./components/CustomMathModal";
import { MathCalculatorKeypad } from "./components/MathCalculatorKeypad";
import { ChevronRight, ChevronLeft, Sliders, BookOpen, X } from "lucide-react";

export function App() {
  const {
    state,
    baseParameters,
    setCategory,
    loadPreset,
    setParameter,
    setPalette,
    setZoom,
    setPan,
    togglePause,
    setHoveredVar,
    setActiveVar,
    configureLfo,
    resetCurrentParameters,
    setLanguage,
    toggleTheme
  } = useStudioState();

  const t = getTranslation(state.lang);
  const isLight = state.theme === "light";
  const canvasHandleRef = useRef<CanvasHandle | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCustomMathOpen, setIsCustomMathOpen] = useState(false);
  const [isAnimationModalOpen, setIsAnimationModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"controls" | "equation">("controls");

  // Keyboard Escape listener for calculator modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCalculatorOpen) {
        setIsCalculatorOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCalculatorOpen]);

  const currentPreset = getPresetById(state.presetId);
  const currentEquation = EQUATION_MODELS[currentPreset?.equationName || "mandelbrot"] || EQUATION_MODELS.mandelbrot;

  const handleApplyCustomMath = (config: {
    category: MathCategory;
    equationName: string;
    parameters: Record<string, number>;
    zoom?: number;
    pan?: [number, number];
    palette?: string;
  }) => {
    setCategory(config.category);
    if (config.palette) setPalette(config.palette);
    if (config.zoom !== undefined) setZoom(config.zoom);
    if (config.pan) setPan(config.pan);
    for (const [key, val] of Object.entries(config.parameters)) {
      setParameter(key, val);
    }
  };

  const handleTakeScreenshot = () => {
    if (!canvasHandleRef.current) return;
    const dataUrl = canvasHandleRef.current.takeScreenshot();
    if (!dataUrl) return;

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `axiom-${state.presetId}-${Date.now()}.png`;
    a.click();
  };

  const handleResetParam = (paramId: string) => {
    const preset = getPresetById(state.presetId);
    const defaultVal = preset?.parameters[paramId] ?? currentEquation.parameters.find(p => p.id === paramId)?.defaultValue ?? 0;
    setParameter(paramId, defaultVal);
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors ${
      isLight ? "bg-slate-100 text-slate-900" : "bg-slate-950 text-slate-100"
    }`}>
      {/* Top Application Bar */}
      <Header
        state={state}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onOpenCustomMath={() => setIsCustomMathOpen(true)}
        onOpenAnimationModal={() => setIsAnimationModalOpen(true)}
        onTakeScreenshot={handleTakeScreenshot}
        onTogglePause={togglePause}
        onResetParameters={resetCurrentParameters}
        onToggleLanguage={setLanguage}
        onToggleTheme={toggleTheme}
      />


      {/* Main Viewport & Instrument Workspace */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* 60 FPS GPU Viewport */}
        <div className="flex-1 h-full relative">
          <WebGLCanvas
            ref={canvasHandleRef}
            state={state}
            baseParameters={baseParameters}
            onPanChange={setPan}
            onZoomChange={setZoom}
          />

          {/* Toggle Sidebar Floating Handle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`absolute top-4 right-4 z-20 p-2 rounded-lg backdrop-blur-md shadow-lg transition-all cursor-pointer ${
              isLight
                ? "bg-white/95 hover:bg-slate-100 text-slate-700 border border-slate-300"
                : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80"
            }`}
            title={isSidebarOpen ? "Hide Instrument Panel" : "Show Instrument Panel"}
          >
            {isSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Instrument & Mathematical Sidebar */}
        <aside
          className={`h-full w-96 border-l backdrop-blur-xl z-20 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
            isLight
              ? "bg-white/95 border-slate-200 text-slate-900"
              : "bg-slate-950/95 border-slate-800 text-slate-100"
          } ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full absolute right-0"
          }`}
        >
          {/* Sidebar Section Switcher Tabs */}
          <div className={`flex items-center border-b px-4 pt-3 gap-2 shrink-0 ${
            isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-900/40"
          }`}>
            <button
              onClick={() => setSidebarTab("controls")}
              className={`flex items-center gap-1.5 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                sidebarTab === "controls"
                  ? "border-cyan-500 text-cyan-600 dark:text-cyan-300"
                  : isLight
                  ? "border-transparent text-slate-500 hover:text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t.tabControls}</span>
            </button>
            <button
              onClick={() => setSidebarTab("equation")}
              className={`flex items-center gap-1.5 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                sidebarTab === "equation"
                  ? "border-cyan-500 text-cyan-600 dark:text-cyan-300"
                  : isLight
                  ? "border-transparent text-slate-500 hover:text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.tabEquation}</span>
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
            {sidebarTab === "controls" ? (
              <>
                {/* Active Preset Card */}
                <div className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900/80 border-slate-800"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${
                      isLight ? "text-cyan-700 font-semibold" : "text-cyan-400"
                    }`}>
                      {t.activeModel}
                    </span>
                    <button
                      onClick={() => setIsGalleryOpen(true)}
                      className={`text-[11px] hover:underline cursor-pointer ${
                        isLight ? "text-cyan-700 hover:text-cyan-800" : "text-cyan-400 hover:text-cyan-300"
                      }`}
                    >
                      {t.browsePresets}
                    </button>
                  </div>
                  <h3 className={`font-semibold text-sm ${isLight ? "text-slate-900" : "text-slate-100"}`}>
                    {currentPreset?.title}
                  </h3>
                  <p className={`text-xs line-clamp-2 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {currentPreset?.description}
                  </p>
                </div>

                {/* Equation Parameters */}
                <ParameterPanel
                  lang={state.lang}
                  theme={state.theme}
                  parameters={currentEquation.parameters}
                  values={state.parameters}
                  baseValues={baseParameters}
                  hoveredVar={state.hoveredVar}
                  activeVar={state.activeVar}
                  onHoverVar={setHoveredVar}
                  onActiveVar={setActiveVar}
                  onChangeParameter={setParameter}
                  onResetParameter={handleResetParam}
                />

                {/* Color Palette Selector */}
                <ColorPalettePicker
                  theme={state.theme}
                  lang={state.lang}
                  currentPaletteId={state.palette}
                  onSelectPalette={setPalette}
                />
              </>
            ) : (
              /* Dedicated Equation View */
              <EquationView
                lang={state.lang}
                theme={state.theme}
                equation={currentEquation}
                parameters={state.parameters}
                hoveredVar={state.hoveredVar}
                activeVar={state.activeVar}
                onHoverVar={setHoveredVar}
                onSelectVar={setActiveVar}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Preset Gallery Modal */}
      <PresetGallery
        isOpen={isGalleryOpen}
        lang={state.lang}
        theme={state.theme}
        activePresetId={state.presetId}
        onClose={() => setIsGalleryOpen(false)}
        onSelectPreset={loadPreset}
      />

      {/* Animation & Video Synthesizer Modal */}
      <AnimationModal
        isOpen={isAnimationModalOpen}
        lang={state.lang}
        state={state}
        parameters={currentEquation.parameters}
        onClose={() => setIsAnimationModalOpen(false)}
        onConfigureLfo={configureLfo}
        onTakeScreenshot={handleTakeScreenshot}
        onStartRecording={() => {
          if (!canvasHandleRef.current) return false;
          return canvasHandleRef.current.startRecording();
        }}
        onStopRecording={() => {
          if (!canvasHandleRef.current) throw new Error("No canvas");
          return canvasHandleRef.current.stopRecording();
        }}
      />

      {/* Custom Math Studio & Suggestions Modal */}
      <CustomMathModal
        isOpen={isCustomMathOpen}
        lang={state.lang}
        theme={state.theme}
        parameters={currentEquation.parameters}
        activeParamId={state.activeVar || undefined}
        onClose={() => setIsCustomMathOpen(false)}
        onApplyMath={handleApplyCustomMath}
        onApplyValueToParam={setParameter}
      />

      {/* Dedicated Interactive Scientific Math Keypad Modal */}
      {isCalculatorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsCalculatorOpen(false)}
        >
          <div
            className="relative w-full max-w-lg"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCalculatorOpen(false)}
              className="absolute -top-3 -right-3 z-10 p-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white shadow-lg cursor-pointer transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
            <MathCalculatorKeypad
              lang={state.lang}
              theme={state.theme}
              parameters={currentEquation.parameters}
              activeParamId={state.activeVar || undefined}
              onApplyValueToParam={(paramId, val) => {
                setParameter(paramId, val);
              }}
              onClose={() => setIsCalculatorOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
