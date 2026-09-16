import { VERTEX_SHADER_SOURCE } from "./shaders/common";
import {
  MANDELBROT_SHADER,
  JULIA_SHADER,
  BURNINGSHIP_SHADER,
  ROSE_SHADER,
  LISSAJOUS_SHADER,
  LORENZ_SHADER,
  CLIFFORD_SHADER,
  CELLULAR_SHADER,
  FLOWFIELD_SHADER
} from "./shaders/shadersCatalog";
import { getPalette } from "../presets/palettes";

const SHADER_MAP: Record<string, string> = {
  mandelbrot: MANDELBROT_SHADER,
  julia: JULIA_SHADER,
  burningship: BURNINGSHIP_SHADER,
  rose: ROSE_SHADER,
  lissajous: LISSAJOUS_SHADER,
  lorenz: LORENZ_SHADER,
  clifford: CLIFFORD_SHADER,
  cellular: CELLULAR_SHADER,
  flowfield: FLOWFIELD_SHADER
};

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255
  ];
}

export class WebGLRenderer {
  private gl: WebGL2RenderingContext | null = null;
  private canvas: HTMLCanvasElement;
  private programCache: Map<string, WebGLProgram> = new Map();
  private quadVao: WebGLVertexArrayObject | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];


  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", {
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });

    if (!gl) {
      throw new Error("WebGL 2 is not supported on this device/browser.");
    }
    this.gl = gl;
    this.initQuad();
  }

  private initQuad() {
    const gl = this.gl!;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Two triangles covering fullscreen NDC
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    this.quadVao = vao;
  }

  private compileShader(source: string, type: number): WebGLShader {
    const gl = this.gl!;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const err = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compilation failed: ${err}`);
    }
    return shader;
  }

  private getProgram(equationId: string): WebGLProgram {
    if (this.programCache.has(equationId)) {
      return this.programCache.get(equationId)!;
    }

    const fragmentSource = SHADER_MAP[equationId] || SHADER_MAP.mandelbrot;
    const gl = this.gl!;

    const vertexShader = this.compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentSource, gl.FRAGMENT_SHADER);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.bindAttribLocation(program, 0, "a_position");
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const err = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Program link failed: ${err}`);
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    this.programCache.set(equationId, program);
    return program;
  }

  public render(
    equationId: string,
    time: number,
    zoom: number,
    pan: [number, number],
    parameters: Record<string, number>,
    paletteId: string
  ) {
    const gl = this.gl;
    if (!gl || !this.quadVao) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    gl.viewport(0, 0, width, height);

    const program = this.getProgram(equationId);
    gl.useProgram(program);

    // Standard uniforms
    const uRes = gl.getUniformLocation(program, "u_resolution");
    if (uRes) gl.uniform2f(uRes, width, height);

    const uTime = gl.getUniformLocation(program, "u_time");
    if (uTime) gl.uniform1f(uTime, time);

    const uZoom = gl.getUniformLocation(program, "u_zoom");
    if (uZoom) gl.uniform1f(uZoom, zoom);

    const uPan = gl.getUniformLocation(program, "u_pan");
    if (uPan) gl.uniform2f(uPan, pan[0], pan[1]);

    // Set Palette colors
    const palette = getPalette(paletteId);
    const [c0, c1, c2, c3] = palette.colors.map(hexToRgb);

    const locC0 = gl.getUniformLocation(program, "u_color0");
    const locC1 = gl.getUniformLocation(program, "u_color1");
    const locC2 = gl.getUniformLocation(program, "u_color2");
    const locC3 = gl.getUniformLocation(program, "u_color3");

    if (locC0) gl.uniform3fv(locC0, c0);
    if (locC1) gl.uniform3fv(locC1, c1);
    if (locC2) gl.uniform3fv(locC2, c2);
    if (locC3) gl.uniform3fv(locC3, c3);

    // Set dynamic custom parameters
    for (const [key, value] of Object.entries(parameters)) {
      const loc = gl.getUniformLocation(program, `u_${key}`);
      if (loc) {
        gl.uniform1f(loc, value);
      }
    }

    gl.bindVertexArray(this.quadVao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  public takeScreenshot(): string {
    return this.canvas.toDataURL("image/png");
  }


  public startRecording(onChunk?: (blob: Blob) => void): boolean {
    try {
      const stream = this.canvas.captureStream(60);
      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }

      this.recordedChunks = [];
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 8000000
      });

      recorder.ondataavailable = e => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
          onChunk?.(e.data);
        }
      };

      recorder.start(100);
      this.mediaRecorder = recorder;
      return true;
    } catch (err) {
      console.error("Recording error:", err);
      return false;
    }
  }

  public stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No active recording session."));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: "video/webm" });
        this.recordedChunks = [];
        this.mediaRecorder = null;
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  public destroy() {
    const gl = this.gl;
    if (!gl) return;
    for (const program of this.programCache.values()) {
      gl.deleteProgram(program);
    }
    this.programCache.clear();
    if (this.quadVao) {
      gl.deleteVertexArray(this.quadVao);
      this.quadVao = null;
    }
    this.gl = null;
  }
}
