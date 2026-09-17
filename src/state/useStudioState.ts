import { useState, useEffect, useCallback, useRef } from "react";
import type { StudioState, MathCategory, PresetDef, Language, ThemeMode } from "../types/studio";
import { PRESETS, getPresetById } from "../presets/presetCatalog";
import { decodeStudioState, encodeStudioState } from "./urlCodec";


export function useStudioState() {
  // Check URL param on mount
  const initialRef = useRef<StudioState | null>(null);

  if (!initialRef.current) {
    let initialPreset = PRESETS[0];
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get("state");
    const decoded = stateParam ? decodeStudioState(stateParam) : null;

    if (decoded && decoded.presetId) {
      const p = getPresetById(decoded.presetId);
      if (p) initialPreset = p;
    }

    initialRef.current = {
      category: decoded?.category || initialPreset.category,
      presetId: decoded?.presetId || initialPreset.id,
      parameters: {
        ...initialPreset.parameters,
        ...(decoded?.parameters || {})
      },
      palette: decoded?.palette || initialPreset.palette,
      zoom: decoded?.zoom ?? initialPreset.zoom,
      pan: decoded?.pan ?? initialPreset.pan,
      isPaused: false,
      speed: decoded?.speed ?? initialPreset.speed,
      hoveredVar: null,
      activeVar: null,
      lang: decoded?.lang || "en",
      theme: decoded?.theme || "dark",
      activeLfo: decoded?.activeLfo || (initialPreset.lfo ? {
        enabled: true,
        paramId: initialPreset.lfo.paramId,
        amplitude: initialPreset.lfo.amplitude,
        speed: initialPreset.lfo.speed,
        waveform: initialPreset.lfo.waveform
      } : {
        enabled: false,
        paramId: "",
        amplitude: 1.0,
        speed: 0.5,
        waveform: "sine"
      })
    };
  }

  const [state, setState] = useState<StudioState>(initialRef.current);
  const baseParamRef = useRef<Record<string, number>>({ ...state.parameters });

  // Sync to URL replaceState on change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const compressed = encodeStudioState(state);
      const url = new URL(window.location.href);
      url.searchParams.set("state", compressed);
      window.history.replaceState({}, "", url.toString());
    }, 250);
    return () => clearTimeout(timer);
  }, [state]);

  const setCategory = useCallback((category: MathCategory) => {
    const presetsInCat = PRESETS.filter(p => p.category === category);
    const newPreset = presetsInCat[0] || PRESETS[0];
    baseParamRef.current = { ...newPreset.parameters };

    setState(prev => ({
      ...prev,
      category,
      presetId: newPreset.id,
      parameters: { ...newPreset.parameters },
      palette: newPreset.palette,
      zoom: newPreset.zoom,
      pan: newPreset.pan,
      speed: newPreset.speed,
      activeLfo: newPreset.lfo ? {
        enabled: true,
        paramId: newPreset.lfo.paramId,
        amplitude: newPreset.lfo.amplitude,
        speed: newPreset.lfo.speed,
        waveform: newPreset.lfo.waveform
      } : {
        ...prev.activeLfo,
        enabled: false
      }
    }));
  }, []);

  const loadPreset = useCallback((preset: PresetDef) => {
    baseParamRef.current = { ...preset.parameters };
    setState(prev => ({
      ...prev,
      category: preset.category,
      presetId: preset.id,
      parameters: { ...preset.parameters },
      palette: preset.palette,
      zoom: preset.zoom,
      pan: preset.pan,
      speed: preset.speed,
      activeLfo: preset.lfo ? {
        enabled: true,
        paramId: preset.lfo.paramId,
        amplitude: preset.lfo.amplitude,
        speed: preset.lfo.speed,
        waveform: preset.lfo.waveform
      } : {
        ...prev.activeLfo,
        enabled: false
      }
    }));
  }, []);

  const setParameter = useCallback((paramId: string, value: number) => {
    baseParamRef.current[paramId] = value;
    setState(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramId]: value
      }
    }));
  }, []);

  const setPalette = useCallback((palette: string) => {
    setState(prev => ({ ...prev, palette }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.001, zoom) }));
  }, []);

  const setPan = useCallback((pan: [number, number]) => {
    setState(prev => ({ ...prev, pan }));
  }, []);

  const togglePause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const setHoveredVar = useCallback((hoveredVar: string | null) => {
    setState(prev => ({ ...prev, hoveredVar }));
  }, []);

  const setActiveVar = useCallback((activeVar: string | null) => {
    setState(prev => ({ ...prev, activeVar }));
  }, []);

  const configureLfo = useCallback((config: Partial<StudioState["activeLfo"]>) => {
    setState(prev => ({
      ...prev,
      activeLfo: {
        ...prev.activeLfo,
        ...config
      }
    }));
  }, []);

  const resetCurrentParameters = useCallback(() => {
    const currentPreset = getPresetById(state.presetId);
    if (currentPreset) {
      baseParamRef.current = { ...currentPreset.parameters };
      setState(prev => ({
        ...prev,
        parameters: { ...currentPreset.parameters },
        zoom: currentPreset.zoom,
        pan: currentPreset.pan
      }));
    }
  }, [state.presetId]);

  const setLanguage = useCallback((lang: Language) => {
    setState(prev => ({ ...prev, lang }));
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }));
  }, []);

  return {
    state,
    baseParameters: baseParamRef.current,
    setCategory,
    loadPreset,
    setParameter,
    setPalette,
    setZoom,
    setPan,
    togglePause,
    setSpeed,
    setHoveredVar,
    setActiveVar,
    configureLfo,
    resetCurrentParameters,
    setLanguage,
    setTheme,
    toggleTheme
  };
}
