import React, { useState, useEffect } from "react";
import type { ParameterDef, StudioState, Language } from "../types/studio";
import { getTranslation } from "../i18n/translations";
import { X, Play, Video, Camera, Activity, Sliders } from "lucide-react";

interface Props {
  isOpen: boolean;
  lang: Language;
  state: StudioState;
  parameters: ParameterDef[];
  onClose: () => void;
  onConfigureLfo: (config: Partial<StudioState["activeLfo"]>) => void;
  onTakeScreenshot: () => void;
  onStartRecording: () => boolean;
  onStopRecording: () => Promise<Blob>;
}

export const AnimationModal: React.FC<Props> = ({
  isOpen,
  lang,
  state,
  parameters,
  onClose,
  onConfigureLfo,
  onTakeScreenshot,
  onStartRecording,
  onStopRecording
}) => {
  const t = getTranslation(lang);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(5);
  const [recordProgress, setRecordProgress] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isRecording) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isRecording, onClose]);

  if (!isOpen) return null;

  const currentParamId = state.activeLfo.paramId || (parameters[0]?.id || "");

  const handleRecordVideo = async () => {
    const started = onStartRecording();
    if (!started) return;

    setIsRecording(true);
    setRecordProgress(0);

    const startTime = Date.now();
    const durationMs = recordSeconds * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setRecordProgress(progress);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        finalizeRecording();
      }
    }, 100);

    const finalizeRecording = async () => {
      try {
        const blob = await onStopRecording();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `axiom-math-loop-${state.presetId}-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Video export failed", err);
      } finally {
        setIsRecording(false);
        setRecordProgress(0);
      }
    };
  };

  const isLight = state.theme === "light";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => !isRecording && onClose()}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border transition-colors ${
          isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-200"
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${isLight ? "border-slate-200" : "border-slate-800"}`}>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            <h2 className={`text-base font-semibold ${isLight ? "text-slate-900" : "text-slate-100"}`}>
              {t.motionTitle}
            </h2>
          </div>
          {!isRecording && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLight ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* LFO Modulation Engine */}
        <div className={`flex flex-col gap-3 p-4 rounded-xl border ${
          isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/50 border-slate-800/80"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-500" />
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-800" : "text-slate-300"}`}>
                {t.lfoTitle}
              </span>
            </div>
            <button
              onClick={() => onConfigureLfo({ enabled: !state.activeLfo.enabled, paramId: currentParamId })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                state.activeLfo.enabled
                  ? "bg-cyan-500 text-slate-950 font-semibold shadow-sm"
                  : isLight
                  ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{state.activeLfo.enabled ? t.modulatingActive : t.enableLfo}</span>
            </button>
          </div>

          {/* Select Target Parameter */}
          <div className="flex flex-col gap-1 mt-1">
            <label className={`text-[11px] font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {t.targetParam}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {parameters.map(param => (
                <button
                  key={param.id}
                  onClick={() => onConfigureLfo({ paramId: param.id, enabled: true })}
                  className={`px-2.5 py-1.5 rounded text-xs text-left truncate transition-all border cursor-pointer ${
                    currentParamId === param.id
                      ? isLight
                        ? "bg-cyan-50 border-cyan-400 text-cyan-800 font-medium shadow-xs"
                        : "bg-cyan-950/80 border-cyan-500 text-cyan-300 font-medium"
                      : isLight
                      ? "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {param.label}
                </button>
              ))}
            </div>
          </div>

          {/* Waveform Selector */}
          <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isLight ? "border-slate-200" : "border-slate-800/80"}`}>
            <span className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>{t.waveformOsc}</span>
            <div className="flex items-center gap-1">
              {(["sine", "triangle", "sawtooth"] as const).map(wf => (
                <button
                  key={wf}
                  onClick={() => onConfigureLfo({ waveform: wf })}
                  className={`px-2 py-1 rounded text-xs capitalize transition-colors cursor-pointer ${
                    state.activeLfo.waveform === wf
                      ? isLight
                        ? "bg-cyan-50 border border-cyan-400 text-cyan-800 font-medium"
                        : "bg-cyan-950 border border-cyan-500 text-cyan-300 font-medium"
                      : isLight
                      ? "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {wf}
                </button>
              ))}
            </div>
          </div>

          {/* Speed & Amplitude Sliders */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex flex-col gap-1">
              <div className={`flex justify-between text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                <span>{t.oscSpeed}</span>
                <span className={`font-mono tabular-nums ${isLight ? "text-cyan-700 font-semibold" : "text-cyan-400"}`}>{state.activeLfo.speed.toFixed(2)} Hz</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={state.activeLfo.speed}
                onChange={e => onConfigureLfo({ speed: parseFloat(e.target.value) })}
                className={`w-full h-1 rounded accent-cyan-500 cursor-pointer ${isLight ? "bg-slate-200" : "bg-slate-900"}`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className={`flex justify-between text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                <span>{t.ampRange}</span>
                <span className={`font-mono tabular-nums ${isLight ? "text-cyan-700 font-semibold" : "text-cyan-400"}`}>{state.activeLfo.amplitude.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="3.0"
                step="0.05"
                value={state.activeLfo.amplitude}
                onChange={e => onConfigureLfo({ amplitude: parseFloat(e.target.value) })}
                className={`w-full h-1 rounded accent-cyan-500 cursor-pointer ${isLight ? "bg-slate-200" : "bg-slate-900"}`}
              />
            </div>
          </div>
        </div>

        {/* Video Recorder Section */}
        <div className={`flex flex-col gap-3 p-4 rounded-xl border ${
          isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/50 border-slate-800/80"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-500" />
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-800" : "text-slate-300"}`}>
                {t.videoRecorderTitle}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {[3, 5, 10].map(s => (
                <button
                  key={s}
                  disabled={isRecording}
                  onClick={() => setRecordSeconds(s)}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                    recordSeconds === s
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : isLight
                      ? "bg-slate-200 text-slate-600 hover:text-slate-900"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {s}s
                </button>
              ))}
            </div>
          </div>

          {/* Record Button & Progress */}
          {isRecording ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono tabular-nums text-cyan-600">
                <span>{t.capturingProgress}</span>
                <span>{recordProgress}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-slate-800"}`}>
                <div
                  className="h-full bg-cyan-500 transition-all duration-100"
                  style={{ width: `${recordProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={handleRecordVideo}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-950/20 cursor-pointer whitespace-nowrap"
              >
                <Video className="w-4 h-4" />
                <span>{t.recordVideoBtn.replace("{s}", recordSeconds.toString())}</span>
              </button>
              <button
                onClick={() => {
                  onTakeScreenshot();
                  onClose();
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-xs transition-all border cursor-pointer whitespace-nowrap ${
                  isLight
                    ? "bg-white hover:bg-slate-100 text-slate-800 border-slate-300"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{t.snapPngBtn}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
