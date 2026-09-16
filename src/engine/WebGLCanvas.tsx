import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";
import { WebGLRenderer } from "./webglManager";
import type { StudioState } from "../types/studio";
import { getPresetById } from "../presets/presetCatalog";


export interface CanvasHandle {
  takeScreenshot: () => string;
  startRecording: () => boolean;
  stopRecording: () => Promise<Blob>;
}

interface Props {
  state: StudioState;
  baseParameters: Record<string, number>;
  onPanChange: (pan: [number, number]) => void;
  onZoomChange: (zoom: number) => void;
}

export const WebGLCanvas = forwardRef<CanvasHandle, Props>(({
  state,
  baseParameters,
  onPanChange,
  onZoomChange
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef<[number, number]>([0, 0]);
  const animationFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [fps, setFps] = useState(60);
  const fpsFrameCount = useRef(0);
  const fpsLastTime = useRef(performance.now());

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      if (!rendererRef.current) return "";
      return rendererRef.current.takeScreenshot();
    },
    startRecording: () => {
      if (!rendererRef.current) return false;
      return rendererRef.current.startRecording();
    },
    stopRecording: async () => {
      if (!rendererRef.current) throw new Error("No renderer");
      return rendererRef.current.stopRecording();
    }
  }));

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new WebGLRenderer(canvas);
    rendererRef.current = renderer;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  // Continuous 60fps render loop with LFO modulation
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!state.isPaused) {
        timeRef.current += delta * state.speed;
      }

      // Compute FPS counter
      fpsFrameCount.current++;
      if (timestamp - fpsLastTime.current >= 1000) {
        setFps(fpsFrameCount.current);
        fpsFrameCount.current = 0;
        fpsLastTime.current = timestamp;
      }

      const renderer = rendererRef.current;
      if (renderer) {
        const currentPreset = getPresetById(state.presetId);
        const equationId = currentPreset?.equationName || "mandelbrot";

        // Calculate dynamic parameter state (incorporating LFO if enabled)
        const currentParams = { ...state.parameters };
        if (state.activeLfo.enabled && state.activeLfo.paramId) {
          const lfo = state.activeLfo;
          const baseVal = baseParameters[lfo.paramId] ?? currentParams[lfo.paramId] ?? 0;
          const omega = 2 * Math.PI * lfo.speed * timeRef.current;
          let wave = Math.sin(omega);
          if (lfo.waveform === "triangle") {
            wave = (2 / Math.PI) * Math.asin(Math.sin(omega));
          } else if (lfo.waveform === "sawtooth") {
            wave = 2 * (omega / (2 * Math.PI) - Math.floor(0.5 + omega / (2 * Math.PI)));
          }
          currentParams[lfo.paramId] = baseVal + wave * lfo.amplitude;
        }

        renderer.render(
          equationId,
          timeRef.current,
          state.zoom,
          state.pan,
          currentParams,
          state.palette
        );
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state, baseParameters]);

  // Handle Drag / Pan interaction on Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return; // Left click only
    isDraggingRef.current = true;
    lastMousePosRef.current = [e.clientX, e.clientY];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !canvasRef.current) return;
    const dx = e.clientX - lastMousePosRef.current[0];
    const dy = e.clientY - lastMousePosRef.current[1];
    lastMousePosRef.current = [e.clientX, e.clientY];

    const rect = canvasRef.current.getBoundingClientRect();
    const aspect = rect.width / rect.height;
    // Scale pan displacement inversely with zoom
    const panScaleX = (2.0 * aspect) / (rect.width * state.zoom);
    const panScaleY = 2.0 / (rect.height * state.zoom);

    onPanChange([
      state.pan[0] - dx * panScaleX,
      state.pan[1] + dy * panScaleY
    ]);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Handle Scroll Zoom (exponential smooth zoom)
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.869;
    const newZoom = Math.max(0.0001, Math.min(1000000, state.zoom * zoomFactor));
    onZoomChange(newZoom);
  };

  const handleDoubleClick = () => {
    const preset = getPresetById(state.presetId);
    if (preset) {
      onPanChange(preset.pan);
      onZoomChange(preset.zoom);
    }
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      />

      {/* Floating Viewport HUD (Minimalist, Tabular, Non-intrusive) */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 text-xs font-mono tabular-nums text-slate-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-800 pointer-events-none shadow-lg">
        <span className="text-cyan-400 font-semibold">{fps} FPS</span>
        <span className="text-slate-600">|</span>
        <span>Zoom: {state.zoom.toFixed(2)}x</span>
        <span className="text-slate-600">|</span>
        <span>Pan: ({state.pan[0].toFixed(3)}, {state.pan[1].toFixed(3)})</span>
      </div>
    </div>
  );
});

WebGLCanvas.displayName = "WebGLCanvas";
