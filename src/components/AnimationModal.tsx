import React, { useState, useEffect } from "react";
import type { ParameterDef, StudioState } from "../types/studio";
import { X, Play, Video, Camera, Activity, Sliders } from "lucide-react";


interface Props {
  isOpen: boolean;
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
  state,
  parameters,
  onClose,
  onConfigureLfo,
  onTakeScreenshot,
  onStartRecording,
  onStopRecording
}) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => !isRecording && onClose()}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 text-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Motion Synthesizer & Video Export
            </h2>
          </div>
          {!isRecording && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* LFO Modulation Engine */}
        <div className="flex flex-col gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                LFO Parameter Modulation
              </span>
            </div>
            <button
              onClick={() => onConfigureLfo({ enabled: !state.activeLfo.enabled, paramId: currentParamId })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                state.activeLfo.enabled
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{state.activeLfo.enabled ? "Modulating Active" : "Enable LFO"}</span>
            </button>
          </div>

          {/* Select Target Parameter */}
          <div className="flex flex-col gap-1 mt-1">
            <label className="text-[11px] font-medium text-slate-400">
              Target Parameter to Modulate
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {parameters.map(param => (
                <button
                  key={param.id}
                  onClick={() => onConfigureLfo({ paramId: param.id, enabled: true })}
                  className={`px-2.5 py-1.5 rounded text-xs text-left truncate transition-all border ${
                    currentParamId === param.id
                      ? "bg-cyan-950/80 border-cyan-500 text-cyan-300 font-medium"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {param.label}
                </button>
              ))}
            </div>
          </div>

          {/* Waveform Selector */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400">Waveform Oscillator</span>
            <div className="flex items-center gap-1">
              {(["sine", "triangle", "sawtooth"] as const).map(wf => (
                <button
                  key={wf}
                  onClick={() => onConfigureLfo({ waveform: wf })}
                  className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                    state.activeLfo.waveform === wf
                      ? "bg-cyan-950 border border-cyan-500 text-cyan-300 font-medium"
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
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Oscillation Speed</span>
                <span className="font-mono tabular-nums text-cyan-400">{state.activeLfo.speed.toFixed(2)} Hz</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={state.activeLfo.speed}
                onChange={e => onConfigureLfo({ speed: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-900 rounded accent-cyan-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Amplitude Range</span>
                <span className="font-mono tabular-nums text-cyan-400">{state.activeLfo.amplitude.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="3.0"
                step="0.05"
                value={state.activeLfo.amplitude}
                onChange={e => onConfigureLfo({ amplitude: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-900 rounded accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Video Recorder Section */}
        <div className="flex flex-col gap-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                60 FPS Video Loop Recorder
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {[3, 5, 10].map(s => (
                <button
                  key={s}
                  disabled={isRecording}
                  onClick={() => setRecordSeconds(s)}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                    recordSeconds === s
                      ? "bg-cyan-500 text-slate-950 font-bold"
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
              <div className="flex justify-between text-xs font-mono tabular-nums text-cyan-300">
                <span>Capturing GPU Canvas (60fps)...</span>
                <span>{recordProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-100"
                  style={{ width: `${recordProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={handleRecordVideo}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Record {recordSeconds}s WebM Video</span>
              </button>
              <button
                onClick={() => {
                  onTakeScreenshot();
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-all border border-slate-700 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Snap 4K PNG</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
