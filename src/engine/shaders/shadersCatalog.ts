import { COMMON_GLSL_HEADER } from "./common";

export const MANDELBROT_SHADER = COMMON_GLSL_HEADER + `
uniform float u_maxIter;
uniform float u_bailout;
uniform float u_power;
uniform float u_colorCycles;

void main() {
  vec2 c = getComplexCoord(v_uv, u_pan, u_zoom, u_resolution);
  vec2 z = c;
  float n = 0.0;
  float maxI = clamp(u_maxIter, 10.0, 500.0);
  float r2 = 0.0;
  float bailout2 = u_bailout * u_bailout;

  for (float i = 0.0; i < 500.0; i += 1.0) {
    if (i >= maxI) break;

    // Polynomial power z^d + c
    if (u_power <= 2.5) {
      // Standard degree 2
      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    } else if (u_power <= 3.5) {
      // Degree 3
      float x2 = z.x * z.x;
      float y2 = z.y * z.y;
      z = vec2(z.x * (x2 - 3.0 * y2), z.y * (3.0 * x2 - y2)) + c;
    } else {
      // General power using polar form
      float r = length(z);
      float theta = atan(z.y, z.x) * u_power;
      z = pow(r, u_power) * vec2(cos(theta), sin(theta)) + c;
    }

    r2 = dot(z, z);
    if (r2 > bailout2) {
      n = i;
      break;
    }
  }

  if (n == 0.0 && r2 <= bailout2) {
    // Inside set
    fragColor = vec4(u_color0 * 0.4, 1.0);
  } else {
    // Continuous smooth coloring
    float log_zn = log(r2) / 2.0;
    float nu = log(log_zn / log(2.0)) / log(2.0);
    float iter = n + 1.0 - nu;
    float t = iter / maxI * u_colorCycles;
    vec3 col = palette(t);
    fragColor = vec4(col, 1.0);
  }
}
`;

export const JULIA_SHADER = COMMON_GLSL_HEADER + `
uniform float u_cr;
uniform float u_ci;
uniform float u_maxIter;
uniform float u_colorCycles;

void main() {
  vec2 z = getComplexCoord(v_uv, u_pan, u_zoom, u_resolution);
  vec2 c = vec2(u_cr, u_ci);
  float maxI = clamp(u_maxIter, 10.0, 500.0);
  float n = 0.0;
  float r2 = 0.0;
  float minTrap = 1e5;

  for (float i = 0.0; i < 500.0; i += 1.0) {
    if (i >= maxI) break;
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    r2 = dot(z, z);

    // Orbit trap for filament richness
    minTrap = min(minTrap, length(z - vec2(0.5, 0.0)));

    if (r2 > 4.0) {
      n = i;
      break;
    }
  }

  if (n == 0.0 && r2 <= 4.0) {
    vec3 coreCol = mix(u_color0, u_color1, clamp(minTrap * 2.0, 0.0, 1.0));
    fragColor = vec4(coreCol * 0.6, 1.0);
  } else {
    float log_zn = log(r2) / 2.0;
    float nu = log(log_zn / log(2.0)) / log(2.0);
    float iter = n + 1.0 - nu;
    float t = (iter / maxI) * u_colorCycles + minTrap * 0.2;
    vec3 col = palette(t);
    fragColor = vec4(col, 1.0);
  }
}
`;

export const BURNINGSHIP_SHADER = COMMON_GLSL_HEADER + `
uniform float u_maxIter;
uniform float u_colorCycles;

void main() {
  vec2 c = getComplexCoord(v_uv, u_pan, u_zoom, u_resolution);
  vec2 z = c;
  float maxI = clamp(u_maxIter, 10.0, 500.0);
  float n = 0.0;
  float r2 = 0.0;

  for (float i = 0.0; i < 500.0; i += 1.0) {
    if (i >= maxI) break;
    // Burning ship non-analytic transformation
    z = vec2(abs(z.x), abs(z.y));
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    r2 = dot(z, z);
    if (r2 > 4.0) {
      n = i;
      break;
    }
  }

  if (n == 0.0 && r2 <= 4.0) {
    fragColor = vec4(u_color0 * 0.2, 1.0);
  } else {
    float log_zn = log(r2) / 2.0;
    float nu = log(log_zn / log(2.0)) / log(2.0);
    float iter = n + 1.0 - nu;
    float t = (iter / maxI) * u_colorCycles;
    vec3 col = palette(t);
    fragColor = vec4(col, 1.0);
  }
}
`;

export const ROSE_SHADER = COMMON_GLSL_HEADER + `
uniform float u_n;
uniform float u_d;
uniform float u_a;
uniform float u_phase;
uniform float u_glow;

#define PI 3.14159265359

void main() {
  vec2 p = getComplexCoord(v_uv, u_pan, u_zoom, u_resolution);
  float r = length(p);
  float theta = atan(p.y, p.x);
  if (theta < 0.0) theta += 2.0 * PI;

  float n = max(1.0, floor(u_n + 0.5));
  float d = max(1.0, floor(u_d + 0.5));
  float a = u_a;
  float glowWidth = max(0.003, u_glow);

  float minDist = 1e5;
  float maxTurns = min(12.0, d);

  // Evaluate across multi-turn polar domain
  for (float k = 0.0; k < 12.0; k += 1.0) {
    if (k >= maxTurns) break;
    float th = theta + 2.0 * PI * k;
    float targetR = a * cos((n / d) * th + u_phase);

    // Approximate distance in 2D space
    float dr = abs(r - targetR);
    minDist = min(minDist, dr);
  }

  // Laser glow and anti-aliased core
  float core = smoothstep(glowWidth * 0.4, 0.0, minDist);
  float halo = exp(-minDist / (glowWidth * 2.5));
  float intensity = core * 1.4 + halo * 0.9;

  // Harmonically cycle palette based on angle and radius
  float t = (theta / (2.0 * PI)) * 0.5 + (r / a) * 0.5 + u_time * 0.05;
  vec3 col = palette(t) * intensity;

  // Subtle background vignette
  col += u_color0 * 0.15 * (1.0 - length(v_uv - 0.5));

  fragColor = vec4(col, 1.0);
}
`;

export const LISSAJOUS_SHADER = COMMON_GLSL_HEADER + `
uniform float u_freqA;
uniform float u_freqB;
uniform float u_phase;
uniform float u_glow;

#define PI 3.14159265359

void main() {
  vec2 p = getComplexCoord(v_uv, u_pan, u_zoom, u_resolution);
  float a = u_freqA;
  float b = u_freqB;
  float delta = u_phase;
  float glowWidth = max(0.003, u_glow);

  float minDist = 1e5;
  const int SAMPLES = 300;
  float dt = (2.0 * PI) / float(SAMPLES);

  vec2 prevPt = vec2(sin(delta), 0.0);
  for (int i = 1; i <= SAMPLES; i++) {
    float t = float(i) * dt;
    vec2 pt = vec2(sin(a * t + delta), sin(b * t));

    // Distance to line segment
    vec2 pa = p - prevPt;
    vec2 ba = pt - prevPt;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float d = length(pa - ba * h);
    minDist = min(minDist, d);

    prevPt = pt;
  }

  float core = smoothstep(glowWidth * 0.4, 0.0, minDist);
  float halo = exp(-minDist / (glowWidth * 3.0));
  float intensity = core * 1.5 + halo * 0.8;

  float t = (p.x * 0.5 + 0.5) * 0.5 + (p.y * 0.5 + 0.5) * 0.5;
  vec3 col = palette(t) * intensity;
  col += u_color0 * 0.1 * (1.0 - length(v_uv - 0.5));

  fragColor = vec4(col, 1.0);
}
`;

export const LORENZ_SHADER = COMMON_GLSL_HEADER + `
uniform float u_sigma;
uniform float u_rho;
uniform float u_beta;
uniform float u_dt;
uniform float u_rotSpeed;

void main() {
  vec2 p = getComplexCoord(v_uv, u_pan, u_zoom * 0.05, u_resolution);
  float angle = u_time * u_rotSpeed * 0.5;
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

  // Runge-Kutta numerical orbit accumulation
  vec3 pos = vec3(1.0, 1.0, 1.0);
  float minDist = 1e5;
  float sigma = u_sigma;
  float rho = u_rho;
  float beta = u_beta;
  float dt = clamp(u_dt, 0.002, 0.03);

  // Trace Lorenz orbit points projected into 2D viewport
  for (int i = 0; i < 180; i++) {
    vec3 d;
    d.x = sigma * (pos.y - pos.x);
    d.y = pos.x * (rho - pos.z) - pos.y;
    d.z = pos.x * pos.y - beta * pos.z;
    pos += d * dt;

    vec2 proj = pos.xy;
    proj = rot * proj;
    proj.y += (pos.z - 25.0) * 0.4; // 3D tilt

    float d2 = length(p - proj * 0.06);
    minDist = min(minDist, d2);
  }

  float glow = exp(-minDist / 0.04) * 1.8 + smoothstep(0.015, 0.0, minDist);
  float t = length(p) * 0.4 + u_time * 0.1;
  vec3 col = palette(t) * glow;
  col += u_color0 * 0.12;

  fragColor = vec4(col, 1.0);
}
`;

export const CLIFFORD_SHADER = COMMON_GLSL_HEADER + `
uniform float u_a;
uniform float u_b;
uniform float u_c;
uniform float u_d;

void main() {
  vec2 p = getComplexCoord(v_uv, u_pan, u_zoom * 0.45, u_resolution);
  float a = u_a;
  float b = u_b;
  float c = u_c;
  float d = u_d;

  vec2 state = vec2(0.1, 0.1);
  float minDist = 1e5;

  for (int i = 0; i < 160; i++) {
    state = vec2(
      sin(a * state.y) + c * cos(a * state.x),
      sin(b * state.x) + d * cos(b * state.y)
    );

    float dist = length(p - state);
    minDist = min(minDist, dist);
  }

  float intensity = exp(-minDist / 0.05) * 1.6 + smoothstep(0.01, 0.0, minDist);
  float t = (p.x + p.y) * 0.25 + 0.5;
  vec3 col = palette(t) * intensity;
  col += u_color0 * 0.1;

  fragColor = vec4(col, 1.0);
}
`;

export const CELLULAR_SHADER = COMMON_GLSL_HEADER + `
uniform float u_decay;
uniform float u_speed;
uniform float u_scale;
uniform float u_noiseMix;

void main() {
  vec2 uv = v_uv;
  float gridSize = clamp(u_scale, 64.0, 512.0);
  vec2 cellCoord = floor(uv * gridSize) / gridSize;

  // Fast procedural reaction-cellular pattern based on space-time cellular synthesis
  float t = u_time * (u_speed * 0.08);
  vec3 pos = vec3(cellCoord * 12.0, t);
  float n1 = snoise(pos);
  float n2 = snoise(pos * 2.0 + vec3(4.2, 1.7, 9.1));
  float n3 = snoise(pos * 4.0 - vec3(7.3, 8.4, 2.3));

  float life = step(0.35 - u_noiseMix, n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
  float decayTrail = fract(n1 * 4.0 + t * 0.3) * u_decay;
  float cellEnergy = mix(decayTrail, 1.0, life);

  // Border grid line for cellular aesthetic
  vec2 subUV = fract(uv * gridSize);
  float gridLine = smoothstep(0.05, 0.08, subUV.x) * smoothstep(0.05, 0.08, subUV.y);

  vec3 col = palette(cellEnergy) * cellEnergy * (0.6 + 0.4 * gridLine);
  fragColor = vec4(col, 1.0);
}
`;

export const FLOWFIELD_SHADER = COMMON_GLSL_HEADER + `
uniform float u_noiseScale;
uniform float u_curlIntensity;
uniform float u_speed;
uniform float u_trailDecay;

void main() {
  vec2 p = getComplexCoord(v_uv, u_pan, u_zoom, u_resolution);
  float t = u_time * u_speed * 0.2;
  float scale = u_noiseScale;

  vec2 curl = curlNoise(p, t, scale) * u_curlIntensity;

  // Chromatic dispersion & advection trails
  float speedMag = length(curl);
  float angle = atan(curl.y, curl.x);

  // Raymarch streamlines
  float streamline = 0.0;
  for (float i = 0.0; i < 4.0; i += 1.0) {
    vec2 offsetP = p + curl * (i * 0.04);
    vec2 c = curlNoise(offsetP, t + i * 0.05, scale);
    streamline += sin(length(c) * 12.0 + t * 2.0 + angle);
  }
  streamline = streamline * 0.25 + 0.5;

  float colorT = (angle / 6.28318) * 0.5 + 0.5 + speedMag * 0.2;
  vec3 col = palette(colorT) * (streamline * 1.3 + 0.2);

  // Vignette
  col *= (1.0 - length(v_uv - 0.5) * 0.6);
  fragColor = vec4(col, 1.0);
}
`;
