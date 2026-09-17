import LZString from "lz-string";
import type { StudioState } from "../types/studio";

export interface SerializedState {
  c: string; // category
  p: string; // presetId
  params: Record<string, number>;
  pal: string; // palette
  z: number; // zoom
  pan: [number, number];
  spd: number; // speed
  lang?: "en" | "th";
  lfo?: {
    en: boolean;
    id: string;
    amp: number;
    spd: number;
    wf: "sine" | "triangle" | "sawtooth";
  };
}

export function encodeStudioState(state: StudioState): string {
  const payload: SerializedState = {
    c: state.category,
    p: state.presetId,
    params: state.parameters,
    pal: state.palette,
    z: Number(state.zoom.toFixed(4)),
    pan: [Number(state.pan[0].toFixed(5)), Number(state.pan[1].toFixed(5))],
    spd: Number(state.speed.toFixed(2)),
    lang: state.lang,
    ...(state.activeLfo.enabled
      ? {
          lfo: {
            en: true,
            id: state.activeLfo.paramId,
            amp: state.activeLfo.amplitude,
            spd: state.activeLfo.speed,
            wf: state.activeLfo.waveform
          }
        }
      : {})
  };

  try {
    const json = JSON.stringify(payload);
    return LZString.compressToEncodedURIComponent(json);
  } catch (e) {
    console.error("Failed to compress state", e);
    return "";
  }
}

export function decodeStudioState(compressed: string): Partial<StudioState> | null {
  if (!compressed) return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const data: SerializedState = JSON.parse(json);

    return {
      category: data.c as any,
      presetId: data.p,
      parameters: data.params || {},
      palette: data.pal,
      zoom: data.z || 1.0,
      pan: data.pan || [0, 0],
      speed: data.spd || 1.0,
      lang: data.lang || "th",
      ...(data.lfo
        ? {
            activeLfo: {
              enabled: data.lfo.en,
              paramId: data.lfo.id,
              amplitude: data.lfo.amp,
              speed: data.lfo.spd,
              waveform: data.lfo.wf
            }
          }
        : {})
    };
  } catch (e) {
    console.error("Failed to decode studio state from URL", e);
    return null;
  }
}

export function generateShareUrl(state: StudioState): string {
  const hash = encodeStudioState(state);
  const url = new URL(window.location.href);
  url.searchParams.set("state", hash);
  return url.toString();
}
