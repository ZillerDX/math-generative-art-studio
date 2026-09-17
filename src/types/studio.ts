export type MathCategory = 
  | "fractals" 
  | "parametric" 
  | "attractors" 
  | "cellular" 
  | "flowfields";

export interface ParameterDef {
  id: string;
  label: string;
  mathSymbol: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  isInteger?: boolean;
}

export interface PresetDef {
  id: string;
  title: string;
  category: MathCategory;
  equationName: string;
  mathFormulaLatex: string;
  description: string;
  parameters: Record<string, number>;
  palette: string;
  thumbnailGradient: string;
  pan: [number, number];
  zoom: number;
  speed: number;
  lfo?: {
    paramId: string;
    amplitude: number;
    speed: number;
    waveform: "sine" | "triangle" | "sawtooth";
  };
}

export interface EquationModel {
  id: string;
  name: string;
  category: MathCategory;
  latex: string;
  parameters: ParameterDef[];
  description: string;
  pedagogicalNotes: string[];
}

export type Language = "en" | "th";

export interface StudioState {
  category: MathCategory;
  presetId: string;
  parameters: Record<string, number>;
  palette: string;
  zoom: number;
  pan: [number, number];
  isPaused: boolean;
  speed: number;
  hoveredVar: string | null;
  activeVar: string | null;
  lang: Language;
  activeLfo: {
    enabled: boolean;
    paramId: string;
    amplitude: number;
    speed: number;
    waveform: "sine" | "triangle" | "sawtooth";
  };
}


export interface ColorPalette {
  id: string;
  name: string;
  colors: [string, string, string, string];
}
