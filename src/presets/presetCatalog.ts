import type { PresetDef } from "../types/studio";

export const PRESETS: PresetDef[] = [
  // --- FRACTALS ---
  {
    id: "mandelbrot-seahorse",
    title: "Seahorse Valley",
    category: "fractals",
    equationName: "mandelbrot",
    mathFormulaLatex: "z_{n+1} = z_n^2 + c, \\quad c \\in \\mathbb{C}",
    description: "The classic boundary between the main cardioid and the period-2 bulb, creating endless spiral seahorses.",
    parameters: {
      maxIter: 200,
      bailout: 4.0,
      power: 2,
      colorCycles: 3.5
    },
    palette: "electric-neon",
    thumbnailGradient: "from-blue-950 via-cyan-800 to-amber-500",
    pan: [-0.743643887037158704752191506114774, 0.131825904205311970493132056385139],
    zoom: 45.0,
    speed: 1.0,
    lfo: {
      paramId: "colorCycles",
      amplitude: 1.5,
      speed: 0.5,
      waveform: "sine"
    }
  },
  {
    id: "julia-dendrite",
    title: "Dendrite Lightning",
    category: "fractals",
    equationName: "julia",
    mathFormulaLatex: "z_{n+1} = z_n^2 + C, \\quad C = -0.4 + 0.6i",
    description: "Branching electrical dendrites formed by a connected Julia set near the boundary of the main cardioid.",
    parameters: {
      cr: -0.4,
      ci: 0.6,
      maxIter: 180,
      colorCycles: 3.0
    },
    palette: "cyber-cyan",
    thumbnailGradient: "from-slate-950 via-teal-900 to-cyan-400",
    pan: [0.0, 0.0],
    zoom: 1.2,
    speed: 1.0,
    lfo: {
      paramId: "cr",
      amplitude: 0.08,
      speed: 0.3,
      waveform: "sine"
    }
  },
  {
    id: "julia-morphing",
    title: "Siegel Disk Orbit",
    category: "fractals",
    equationName: "julia",
    mathFormulaLatex: "z_{n+1} = z_n^2 + C, \\quad C = -0.8 + 0.156i",
    description: "Hypnotic whirlpool spirals orbiting neutral fixed points.",
    parameters: {
      cr: -0.8,
      ci: 0.156,
      maxIter: 220,
      colorCycles: 4.0
    },
    palette: "plasma-purple",
    thumbnailGradient: "from-purple-950 via-fuchsia-900 to-pink-500",
    pan: [0.0, 0.0],
    zoom: 1.25,
    speed: 1.0
  },
  {
    id: "burningship-hull",
    title: "Armada of the Damned",
    category: "fractals",
    equationName: "burningship",
    mathFormulaLatex: "z_{n+1} = (|\\operatorname{Re}(z_n)| + i|\\operatorname{Im}(z_n)|)^2 + c",
    description: "Towering fiery masts and hulls formed by the non-analytic absolute value folding.",
    parameters: {
      maxIter: 220,
      colorCycles: 2.2
    },
    palette: "inferno",
    thumbnailGradient: "from-zinc-950 via-red-950 to-orange-500",
    pan: [-0.45, -0.55],
    zoom: 2.5,
    speed: 1.0
  },

  // --- PARAMETRIC CURVES ---
  {
    id: "rose-grandi-7-4",
    title: "Grandi Rosette (7/4)",
    category: "parametric",
    equationName: "rose",
    mathFormulaLatex: "r = a \\cdot \\cos\\left(\\frac{7}{4} \\theta\\right)",
    description: "Multi-layered 14-petal harmonograph rosette where petals interlace across 4 full revolutions.",
    parameters: {
      n: 7,
      d: 4,
      a: 0.85,
      phase: 0.0,
      glow: 0.02
    },
    palette: "plasma-purple",
    thumbnailGradient: "from-indigo-950 via-purple-900 to-rose-400",
    pan: [0.0, 0.0],
    zoom: 1.0,
    speed: 1.0,
    lfo: {
      paramId: "phase",
      amplitude: 3.14,
      speed: 0.4,
      waveform: "sawtooth"
    }
  },
  {
    id: "rose-bloom-11-2",
    title: "Star Blossom (11/2)",
    category: "parametric",
    equationName: "rose",
    mathFormulaLatex: "r = a \\cdot \\cos\\left(\\frac{11}{2} \\theta\\right)",
    description: "Sharp starlight geometry with 22 interlacing radiating needles.",
    parameters: {
      n: 11,
      d: 2,
      a: 0.9,
      phase: 0.78,
      glow: 0.015
    },
    palette: "cyber-cyan",
    thumbnailGradient: "from-cyan-950 via-blue-900 to-teal-300",
    pan: [0.0, 0.0],
    zoom: 1.0,
    speed: 1.0
  },
  {
    id: "lissajous-torus-5-6",
    title: "Lissajous Ribbon (5:6)",
    category: "parametric",
    equationName: "lissajous",
    mathFormulaLatex: "x = \\sin(5t + \\delta), \\quad y = \\sin(6t)",
    description: "Harmonic orthogonal resonance forming a rotating kinetic cylinder knot.",
    parameters: {
      freqA: 5,
      freqB: 6,
      phase: 1.57,
      glow: 0.02
    },
    palette: "electric-neon",
    thumbnailGradient: "from-blue-950 via-indigo-900 to-cyan-400",
    pan: [0.0, 0.0],
    zoom: 1.0,
    speed: 1.0,
    lfo: {
      paramId: "phase",
      amplitude: 3.1415,
      speed: 0.6,
      waveform: "sawtooth"
    }
  },

  // --- ATTRACTORS ---
  {
    id: "lorenz-butterfly",
    title: "Lorenz Chaotic Butterfly",
    category: "attractors",
    equationName: "lorenz",
    mathFormulaLatex: "\\dot{x}=\\sigma(y-x), \\; \\dot{y}=x(\\rho-z)-y, \\; \\dot{z}=xy-\\beta z",
    description: "Atmospheric convection phase space exhibiting sensitive dependence on initial conditions (The Butterfly Effect).",
    parameters: {
      sigma: 10.0,
      rho: 28.0,
      beta: 2.666,
      dt: 0.012,
      rotSpeed: 0.6
    },
    palette: "inferno",
    thumbnailGradient: "from-neutral-950 via-amber-950 to-orange-400",
    pan: [0.0, 0.0],
    zoom: 1.0,
    speed: 1.0
  },
  {
    id: "clifford-silk-tapestry",
    title: "Clifford Silk Tapestry",
    category: "attractors",
    equationName: "clifford",
    mathFormulaLatex: "x_{n+1} = \\sin(a y_n) + c \\cos(a x_n), \\; y_{n+1} = \\sin(b x_n) + d \\cos(b y_n)",
    description: "Breathtaking translucent continuous probability manifold folding over millions of iterations.",
    parameters: {
      a: -1.4,
      b: 1.6,
      c: 1.0,
      d: 0.7
    },
    palette: "plasma-purple",
    thumbnailGradient: "from-fuchsia-950 via-indigo-950 to-violet-400",
    pan: [0.0, 0.0],
    zoom: 1.0,
    speed: 1.0
  },

  // --- CELLULAR AUTOMATA ---
  {
    id: "cellular-bioluminescent",
    title: "Bioluminescent Game of Life",
    category: "cellular",
    equationName: "cellular",
    mathFormulaLatex: "S_{t+1} = f(\\mathcal{N}), \\quad B3/S23 + \\tau \\text{ persistence}",
    description: "Self-replicating cellular entities trailing long glowing phosphorescent comet tails on a toroidal grid.",
    parameters: {
      decay: 0.94,
      speed: 35,
      scale: 256,
      noiseMix: 0.005
    },
    palette: "emerald-matrix",
    thumbnailGradient: "from-emerald-950 via-teal-900 to-green-400",
    pan: [0.0, 0.0],
    zoom: 1.0,
    speed: 1.0
  },

  // --- FLOW FIELDS ---
  {
    id: "flowfield-curl-ocean",
    title: "Quantum Curl Turbulence",
    category: "flowfields",
    equationName: "flowfield",
    mathFormulaLatex: "\\mathbf{v} = \\nabla \\times \\psi, \\quad \\nabla \\cdot \\mathbf{v} = 0",
    description: "Incompressible fluid vorticity advecting tens of thousands of luminous photon streamlines across space.",
    parameters: {
      noiseScale: 1.8,
      curlIntensity: 2.2,
      speed: 1.1,
      trailDecay: 0.965
    },
    palette: "cyber-cyan",
    thumbnailGradient: "from-slate-950 via-cyan-950 to-sky-400",
    pan: [0.0, 0.0],
    zoom: 1.0,
    speed: 1.0
  }
];

export function getPresetById(id: string): PresetDef {
  return PRESETS.find(p => p.id === id) || PRESETS[0];
}

export function getPresetsByCategory(category: string): PresetDef[] {
  return PRESETS.filter(p => p.category === category);
}
