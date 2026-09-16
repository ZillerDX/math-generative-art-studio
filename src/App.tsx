import { useState, useRef } from "react";
import { useStudioState } from "./state/useStudioState";
import { EQUATION_MODELS } from "./presets/equationModels";
import { getPresetById } from "./presets/presetCatalog";
import { WebGLCanvas } from "./engine/WebGLCanvas";
import type { CanvasHandle } from "./engine/WebGLCanvas";
import type { MathCategory } from "./types/studio";
import { Header } from "./components/Header";

import { EquationView } from "./components/EquationView";
import { ParameterPanel } from "./components/ParameterPanel";
import { ColorPalettePicker } from "./components/ColorPalettePicker";
import { PresetGallery } from "./components/PresetGallery";
import { AnimationModal } from "./components/AnimationModal";
import { CustomMathModal } from "./components/CustomMathModal";
import { ChevronRight, ChevronLeft, Sliders, BookOpen } from "lucide-react";


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
    resetCurrentParameters
  } = useStudioState();

  const canvasHandleRef = useRef<CanvasHandle | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCustomMathOpen, setIsCustomMathOpen] = useState(false);
  const [isAnimationModalOpen, setIsAnimationModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"controls" | "equation">("controls");

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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Top Application Bar */}
      <Header
        state={state}
        onSelectCategory={setCategory}
        onOpenGallery={() => setIsGalleryOpen(true)}
        onOpenCustomMath={() => setIsCustomMathOpen(true)}
        onOpenAnimationModal={() => setIsAnimationModalOpen(true)}
        onTakeScreenshot={handleTakeScreenshot}
        onTogglePause={togglePause}
        onResetParameters={resetCurrentParameters}
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
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-md shadow-lg transition-all"
            title={isSidebarOpen ? "Hide Instrument Panel" : "Show Instrument Panel"}
          >
            {isSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Instrument & Mathematical Sidebar */}
        <aside
          className={`h-full w-96 bg-slate-950/95 border-l border-slate-800 backdrop-blur-xl z-20 flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full absolute right-0"
          }`}
        >
          {/* Sidebar Section Switcher Tabs */}
          <div className="flex items-center border-b border-slate-800 px-4 pt-3 gap-2 bg-slate-900/40 shrink-0">
            <button
              onClick={() => setSidebarTab("controls")}
              className={`flex items-center gap-1.5 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                sidebarTab === "controls"
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Controls</span>
            </button>
            <button
              onClick={() => setSidebarTab("equation")}
              className={`flex items-center gap-1.5 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
                sidebarTab === "equation"
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Equation View</span>
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
            {sidebarTab === "controls" ? (
              <>
                {/* Active Preset Card */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                      Active Equation Model
                    </span>
                    <button
                      onClick={() => setIsGalleryOpen(true)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      Browse presets
                    </button>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-100">
                    {currentPreset?.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {currentPreset?.description}
                  </p>
                </div>

                {/* Equation Parameters */}
                <ParameterPanel
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
                  currentPaletteId={state.palette}
                  onSelectPalette={setPalette}
                />
              </>
            ) : (
              /* Dedicated Equation View */
              <EquationView
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
        activePresetId={state.presetId}
        onClose={() => setIsGalleryOpen(false)}
        onSelectPreset={loadPreset}
      />

      {/* Animation & Video Synthesizer Modal */}
      <AnimationModal
        isOpen={isAnimationModalOpen}
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
        onClose={() => setIsCustomMathOpen(false)}
        onApplyMath={handleApplyCustomMath}
      />
    </div>
  );
}

export default App;
