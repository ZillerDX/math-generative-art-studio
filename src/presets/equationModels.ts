import type { EquationModel } from "../types/studio";

export const EQUATION_MODELS: Record<string, EquationModel> = {
  mandelbrot: {
    id: "mandelbrot",
    name: "Mandelbrot Set",
    category: "fractals",
    latex: `z_{n+1} = z_n^2 + c, \\quad z_0 = 0`,
    description: "The locus of complex numbers c for which the function does not diverge when iterated from z=0.",
    pedagogicalNotes: [
      "c represents each pixel coordinate on the complex plane (x + iy).",
      "Points inside the main cardioid and bulbs remain bounded forever.",
      "Boundary gradients reveal escape velocity (how many steps until |z| > R)."
    ],
    parameters: [
      {
        id: "maxIter",
        label: "Max Iterations",
        mathSymbol: "N_{max}",
        description: "Maximum loop depth. Higher values reveal infinite fractal filigree at deep zooms.",
        min: 20,
        max: 500,
        step: 10,
        defaultValue: 150,
        isInteger: true
      },
      {
        id: "bailout",
        label: "Escape Radius",
        mathSymbol: "R_{esc}",
        description: "Threshold magnitude. If |z| exceeds this, the orbit has escaped to infinity.",
        min: 2.0,
        max: 20.0,
        step: 0.5,
        defaultValue: 4.0
      },
      {
        id: "power",
        label: "Polynomial Power",
        mathSymbol: "d",
        description: "Exponent d in z^d + c. Generates (d-1)-fold rotational symmetry.",
        min: 2,
        max: 8,
        step: 1,
        defaultValue: 2,
        isInteger: true
      },
      {
        id: "colorCycles",
        label: "Color Frequency",
        mathSymbol: "\\omega",
        description: "Speed of palette cycling across the potential gradient.",
        min: 0.5,
        max: 10.0,
        step: 0.1,
        defaultValue: 3.0
      }
    ]
  },
  julia: {
    id: "julia",
    name: "Julia Set Morphing",
    category: "fractals",
    latex: `z_{n+1} = z_n^2 + C, \\quad C = C_r + i\\,C_i`,
    description: "Iterated mapping where the constant C is fixed across the whole plane and z starts at the pixel coordinate.",
    pedagogicalNotes: [
      "Every point c in the Mandelbrot set corresponds to a connected Julia set.",
      "Moving C across the Mandelbrot boundary morphs the Julia set from connected solid into disconnected Cantor dust.",
      "Try animating Cr and Ci along a circle C = r e^{i\\theta} for mesmerizing continuous morphology."
    ],
    parameters: [
      {
        id: "cr",
        label: "Real Constant",
        mathSymbol: "C_r",
        description: "Real component of constant C. Shapes horizontal symmetry and dendrite junctions.",
        min: -2.0,
        max: 2.0,
        step: 0.002,
        defaultValue: -0.7
      },
      {
        id: "ci",
        label: "Imaginary Constant",
        mathSymbol: "C_i",
        description: "Imaginary component of constant C. Controls spiral torsion and chirality.",
        min: -2.0,
        max: 2.0,
        step: 0.002,
        defaultValue: 0.27015
      },
      {
        id: "maxIter",
        label: "Iterations",
        mathSymbol: "N",
        description: "Orbit iteration depth.",
        min: 20,
        max: 400,
        step: 10,
        defaultValue: 160,
        isInteger: true
      },
      {
        id: "colorCycles",
        label: "Color Density",
        mathSymbol: "\\omega",
        description: "Spectral banding frequency.",
        min: 0.5,
        max: 8.0,
        step: 0.1,
        defaultValue: 2.5
      }
    ]
  },
  burningship: {
    id: "burningship",
    name: "Burning Ship Fractal",
    category: "fractals",
    latex: `z_{n+1} = (|\\operatorname{Re}(z_n)| + i\\,|\\operatorname{Im}(z_n)|)^2 + c`,
    description: "A non-analytic variation of the Mandelbrot set taking the absolute value of real and imaginary parts before squaring.",
    pedagogicalNotes: [
      "Taking absolute values breaks Cauchy-Riemann analyticity, forming jagged masts and hull structures.",
      "Notice the towering ship mast along the imaginary axis."
    ],
    parameters: [
      {
        id: "maxIter",
        label: "Iterations",
        mathSymbol: "N",
        description: "Detail sharpness on the ship rigging.",
        min: 30,
        max: 450,
        step: 10,
        defaultValue: 180,
        isInteger: true
      },
      {
        id: "colorCycles",
        label: "Color Density",
        mathSymbol: "\\omega",
        description: "Flame gradient distribution.",
        min: 0.5,
        max: 6.0,
        step: 0.1,
        defaultValue: 2.0
      }
    ]
  },
  rose: {
    id: "rose",
    name: "Rose (Rhodonea) Curves",
    category: "parametric",
    latex: `r = a \\cdot \\cos\\left(\\frac{n}{d} \\theta\\right)`,
    description: "Polar sinusoidal curve investigated by Italian mathematician Luigi Guido Grandi in 1723.",
    pedagogicalNotes: [
      "If k = n/d is an integer: when k is odd, the rose has k petals; when k is even, it has 2k petals.",
      "When k is rational, the curve closes after d \\pi (if n*d is even) or 2 d \\pi turns.",
      "Adjusting n and d weaves intricate harmonograph-like rosettes."
    ],
    parameters: [
      {
        id: "n",
        label: "Numerator (Petals)",
        mathSymbol: "n",
        description: "Controls the base harmonic frequency and petal count.",
        min: 1,
        max: 16,
        step: 1,
        defaultValue: 7,
        isInteger: true
      },
      {
        id: "d",
        label: "Denominator (Turns)",
        mathSymbol: "d",
        description: "Fractional divisor. Higher values interweave petals across overlapping rotations.",
        min: 1,
        max: 12,
        step: 1,
        defaultValue: 4,
        isInteger: true
      },
      {
        id: "a",
        label: "Amplitude Scale",
        mathSymbol: "a",
        description: "Envelope radius of the outermost petal tips.",
        min: 0.2,
        max: 1.5,
        step: 0.05,
        defaultValue: 0.85
      },
      {
        id: "phase",
        label: "Phase Offset",
        mathSymbol: "\\phi",
        description: "Angular rotation and harmonic twist.",
        min: 0,
        max: 6.283,
        step: 0.05,
        defaultValue: 0
      },
      {
        id: "glow",
        label: "Spectral Glow",
        mathSymbol: "\\sigma_{w}",
        description: "Raymarched beam thickness and bloom intensity.",
        min: 0.005,
        max: 0.08,
        step: 0.002,
        defaultValue: 0.02
      }
    ]
  },
  lissajous: {
    id: "lissajous",
    name: "Lissajous Harmonograph",
    category: "parametric",
    latex: `x = A \\sin(a \\cdot t + \\delta), \\quad y = B \\sin(b \\cdot t)`,
    description: "System of parametric equations describing complex harmonic motion in orthogonal directions, studied by Jules Antoine Lissajous in 1857.",
    pedagogicalNotes: [
      "The frequency ratio a/b determines the knot topology and number of lobes.",
      "The phase shift \\delta controls the 3D perceptual rotation of the figure.",
      "When a = b and \\delta = \\pi/2, the figure collapses into a perfect circle."
    ],
    parameters: [
      {
        id: "freqA",
        label: "Frequency X",
        mathSymbol: "a",
        description: "Oscillation cycles along the horizontal axis.",
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 5,
        isInteger: true
      },
      {
        id: "freqB",
        label: "Frequency Y",
        mathSymbol: "b",
        description: "Oscillation cycles along the vertical axis.",
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 6,
        isInteger: true
      },
      {
        id: "phase",
        label: "Phase Difference",
        mathSymbol: "\\delta",
        description: "Relative phase angle. Animating this parameter creates a hypnotic 3D spinning ribbon effect.",
        min: 0,
        max: 6.283,
        step: 0.05,
        defaultValue: 1.57
      },
      {
        id: "glow",
        label: "Laser Glow",
        mathSymbol: "\\sigma_{w}",
        description: "Beam dispersion radius.",
        min: 0.005,
        max: 0.08,
        step: 0.002,
        defaultValue: 0.022
      }
    ]
  },
  lorenz: {
    id: "lorenz",
    name: "Lorenz Strange Attractor",
    category: "attractors",
    latex: `\\frac{dx}{dt} = \\sigma(y - x), \\quad \\frac{dy}{dt} = x(\\rho - z) - y, \\quad \\frac{dz}{dt} = x y - \\beta z`,
    description: "The seminal system of ordinary differential equations derived by Edward Lorenz in 1963 exhibiting deterministic chaos.",
    pedagogicalNotes: [
      "\\sigma (Prandtl number) models fluid viscosity relative to thermal conductivity.",
      "\\rho (Rayleigh number) drives convective instability; chaos emerges when \\rho > 24.74.",
      "\\beta represents physical geometric dimensions of the fluid layer.",
      "Traversals never intersect and never repeat, winding infinitely around two unstable focal points."
    ],
    parameters: [
      {
        id: "sigma",
        label: "Prandtl Number",
        mathSymbol: "\\sigma",
        description: "Fluid viscosity vs thermal conductivity ratio. Modulates wing divergence rate.",
        min: 2.0,
        max: 20.0,
        step: 0.2,
        defaultValue: 10.0
      },
      {
        id: "rho",
        label: "Rayleigh Number",
        mathSymbol: "\\rho",
        description: "Thermal driving force. Drives transition from steady convection to chaotic butterfly lobes.",
        min: 10.0,
        max: 60.0,
        step: 0.5,
        defaultValue: 28.0
      },
      {
        id: "beta",
        label: "Geometric Aspect",
        mathSymbol: "\\beta",
        description: "Geometric aspect ratio of the convective roll cell.",
        min: 1.0,
        max: 5.0,
        step: 0.05,
        defaultValue: 2.666
      },
      {
        id: "dt",
        label: "Integration Step",
        mathSymbol: "dt",
        description: "Runge-Kutta / Euler time differential step size.",
        min: 0.003,
        max: 0.03,
        step: 0.001,
        defaultValue: 0.012
      },
      {
        id: "rotSpeed",
        label: "Phase Rotation",
        mathSymbol: "\\omega_{3D}",
        description: "Camera rotation speed around the 3D phase attractor.",
        min: 0,
        max: 2.0,
        step: 0.05,
        defaultValue: 0.5
      }
    ]
  },
  clifford: {
    id: "clifford",
    name: "Clifford Attractor",
    category: "attractors",
    latex: `x_{n+1} = \\sin(a y_n) + c \\cos(a x_n), \\quad y_{n+1} = \\sin(b x_n) + d \\cos(b y_n)`,
    description: "An elegant 2D discrete dynamical system formulated by Clifford A. Pickover creating silk-like fractal tapestries.",
    pedagogicalNotes: [
      "Subtle 0.01 variations in parameters a, b, c, d radically alter the topological foldings.",
      "Phase density accumulates into gossamer ribbons of high probability density.",
      "Zero periodic boundaries; purely continuous deterministic folding."
    ],
    parameters: [
      {
        id: "a",
        label: "Parameter a",
        mathSymbol: "a",
        description: "Vertical shear and fold angle.",
        min: -3.0,
        max: 3.0,
        step: 0.01,
        defaultValue: -1.4
      },
      {
        id: "b",
        label: "Parameter b",
        mathSymbol: "b",
        description: "Horizontal shear angle.",
        min: -3.0,
        max: 3.0,
        step: 0.01,
        defaultValue: 1.6
      },
      {
        id: "c",
        label: "Parameter c",
        mathSymbol: "c",
        description: "Radial displacement along x.",
        min: -3.0,
        max: 3.0,
        step: 0.01,
        defaultValue: 1.0
      },
      {
        id: "d",
        label: "Parameter d",
        mathSymbol: "d",
        description: "Radial displacement along y.",
        min: -3.0,
        max: 3.0,
        step: 0.01,
        defaultValue: 0.7
      }
    ]
  },
  cellular: {
    id: "cellular",
    name: "Cellular Automata (Continuous & Conway)",
    category: "cellular",
    latex: `S_{t+1} = f\\left(\\sum_{k \\in \\mathcal{N}} S_{t, k}\\right), \\quad \\mathcal{B} = \\{3\\}, \\; \\mathcal{S} = \\{2, 3\\}`,
    description: "Discrete dynamical universe of self-organizing cells evolving on a 2D toroidal lattice via local neighborhood sum kernels.",
    pedagogicalNotes: [
      "Conway rule B3/S23: birth on 3 neighbors, survival on 2 or 3.",
      "The decay factor introduces phosphor persistence, turning discrete blinks into fluid biological trails.",
      "Continuous variants (SmoothLife) treat the neighborhood as continuous Gaussian rings, giving amoebic organisms."
    ],
    parameters: [
      {
        id: "decay",
        label: "Phosphor Decay",
        mathSymbol: "\\tau",
        description: "Rate at which dead cells fade out, creating glowing comet trails.",
        min: 0.75,
        max: 0.99,
        step: 0.01,
        defaultValue: 0.92
      },
      {
        id: "speed",
        label: "Simulation Speed",
        mathSymbol: "f_{sim}",
        description: "Generations processed per second.",
        min: 1,
        max: 60,
        step: 1,
        defaultValue: 30,
        isInteger: true
      },
      {
        id: "scale",
        label: "Cell Grid Size",
        mathSymbol: "M",
        description: "Virtual cell resolution grid.",
        min: 64,
        max: 512,
        step: 32,
        defaultValue: 256,
        isInteger: true
      },
      {
        id: "noiseMix",
        label: "Spontaneous Perturbation",
        mathSymbol: "\\epsilon",
        description: "Micro-entropy injected to prevent static stagnation.",
        min: 0.0,
        max: 0.05,
        step: 0.002,
        defaultValue: 0.004
      }
    ]
  },
  flowfield: {
    id: "flowfield",
    name: "Curl Noise Flow Field",
    category: "flowfields",
    latex: `\\mathbf{v}(x,y) = \\nabla \\times \\psi = \\left(\\frac{\\partial \\psi}{\\partial y}, -\\frac{\\partial \\psi}{\\partial x}\\right)`,
    description: "Divergence-free fluid velocity field obtained by taking the curl of a scalar potential \\psi constructed from fractal simplex noise.",
    pedagogicalNotes: [
      "Because \\nabla \\cdot (\\nabla \\times \\psi) = 0, the flow is mathematically incompressible (no sinks or sources).",
      "Particles advected through curl noise drift like turbulent smoke or magnetic plasma lines.",
      "Increasing octaves adds micro-eddies without breaking laminar streamline continuity."
    ],
    parameters: [
      {
        id: "noiseScale",
        label: "Spatial Frequency",
        mathSymbol: "s",
        description: "Scale of turbulent vortices. Smaller values produce grand sweeping ocean currents.",
        min: 0.5,
        max: 6.0,
        step: 0.1,
        defaultValue: 1.8
      },
      {
        id: "curlIntensity",
        label: "Curl Vorticity",
        mathSymbol: "\\Omega",
        description: "Rotational velocity gradient strength.",
        min: 0.5,
        max: 4.0,
        step: 0.1,
        defaultValue: 2.2
      },
      {
        id: "speed",
        label: "Flow Velocity",
        mathSymbol: "v",
        description: "Advection speed along streamlines.",
        min: 0.1,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0
      },
      {
        id: "trailDecay",
        label: "Streamline Persistence",
        mathSymbol: "\\gamma",
        description: "Longevity of photon streak trails.",
        min: 0.85,
        max: 0.995,
        step: 0.005,
        defaultValue: 0.96
      }
    ]
  }
};
