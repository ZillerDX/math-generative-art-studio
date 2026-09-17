import type { Language, MathCategory } from "../types/studio";

export interface Translations {
  // Brand & Header
  brandName: string;
  brandTagline: string;
  engineBadge: string;
  categories: Record<MathCategory, string>;
  
  // Header Actions
  mathLab: string;
  calculator: string;
  presets: string;
  animate: string;
  pause: string;
  resume: string;
  reset: string;
  snapshot: string;
  share: string;
  linkCopied: string;
  darkMode: string;
  lightMode: string;

  // Sidebar Controls
  tabControls: string;
  tabEquation: string;
  activeModel: string;
  browsePresets: string;
  equationControls: string;
  uniformsCount: string;
  spectralPalette: string;
  mathIntuition: string;
  interactiveMatrixTitle: string;
  copyLatex: string;
  copied: string;
  resetDefault: string;

  // Presets Gallery Modal
  presetsTitle: string;
  presetsSubtitle: string;
  allWorks: string;
  activeBadge: string;

  // Animation Modal
  motionTitle: string;
  lfoTitle: string;
  modulatingActive: string;
  enableLfo: string;
  targetParam: string;
  waveformOsc: string;
  oscSpeed: string;
  ampRange: string;
  videoRecorderTitle: string;
  recordDuration: string;
  recordVideoBtn: string;
  snapPngBtn: string;
  capturingProgress: string;

  // Math Lab Modal
  mathLabTitle: string;
  mathLabSubtitle: string;
  tabSuggestions: string;
  tabBuilder: string;
  tabKeypad: string;
  visualOutcomeLabel: string;
  applyMathBtn: string;
  applyStudioBtn: string;
  paradigmLabel: string;
  livePreviewLabel: string;
  visualPredictionLabel: string;

  // Calculator Keypad
  calcTitle: string;
  calcSubtitle: string;
  calcExpression: string;
  calcEvaluate: string;
  calcClear: string;
  calcDelete: string;
  calcApplyToParam: string;
  calcTargetParam: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandName: "AXIOM",
    brandTagline: "Math & Art Studio",
    engineBadge: "WebGL2 60 FPS GLSL Engine",
    categories: {
      fractals: "Fractals",
      parametric: "Parametric",
      attractors: "Attractors",
      cellular: "Cellular",
      flowfields: "Flow Fields"
    },
    mathLab: "Math Lab",
    calculator: "Keypad",
    presets: "Presets",
    animate: "Animate",
    pause: "Pause Animation",
    resume: "Resume Animation",
    reset: "Reset Defaults",
    snapshot: "Capture PNG",
    share: "Share",
    linkCopied: "Link Copied!",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    tabControls: "Controls",
    tabEquation: "Equation View",
    activeModel: "Active Equation Model",
    browsePresets: "Browse presets",
    equationControls: "Equation Controls",
    uniformsCount: "Uniforms",
    spectralPalette: "Shader Spectral Palette",
    mathIntuition: "Mathematical Intuition",
    interactiveMatrixTitle: "Interactive Parameter Matrix (Click or hover to highlight)",
    copyLatex: "LaTeX",
    copied: "Copied",
    resetDefault: "Reset",
    presetsTitle: "Mathematical Masterpieces Gallery",
    presetsSubtitle: "Explore curated equations from complex dynamics, non-linear chaos, and cellular universes.",
    allWorks: "All Works",
    activeBadge: "Active",
    motionTitle: "Motion Synthesizer & Video Export",
    lfoTitle: "LFO Parameter Modulation",
    modulatingActive: "Modulating Active",
    enableLfo: "Enable LFO",
    targetParam: "Target Parameter to Modulate",
    waveformOsc: "Waveform Oscillator",
    oscSpeed: "Oscillation Speed",
    ampRange: "Amplitude Range",
    videoRecorderTitle: "60 FPS Video Loop Recorder",
    recordDuration: "Duration",
    recordVideoBtn: "Record {s}s WebM Video",
    snapPngBtn: "Snap 4K PNG",
    capturingProgress: "Capturing GPU Canvas (60fps)...",
    mathLabTitle: "Custom Math Studio & Suggestions",
    mathLabSubtitle: "Input your own mathematical formulas or explore curated suggestions with visual predictions.",
    tabSuggestions: "Math Suggestions",
    tabBuilder: "Custom Math Builder",
    tabKeypad: "Scientific Keypad",
    visualOutcomeLabel: "Visual Outcome Prediction:",
    applyMathBtn: "Apply This Math",
    applyStudioBtn: "Apply to Studio",
    paradigmLabel: "Choose Mathematical Paradigm",
    livePreviewLabel: "Live LaTeX Formula Preview",
    visualPredictionLabel: "Visual Outcome Prediction:",
    calcTitle: "Scientific Math Keypad",
    calcSubtitle: "Direct interactive calculator for functions, trigonometry, constants, and custom equations.",
    calcExpression: "Formula & Expression Buffer",
    calcEvaluate: "Evaluate & Apply to Uniform",
    calcClear: "CLEAR",
    calcDelete: "DEL",
    calcApplyToParam: "Send Value to Selected Slider",
    calcTargetParam: "Target Slider"
  },
  th: {
    brandName: "AXIOM",
    brandTagline: "สตูดิโอคณิตศาสตร์เชิงศิลป์",
    engineBadge: "เครื่องยนต์เรนเดอร์ WebGL2 60 FPS",
    categories: {
      fractals: "แฟร็กทัล",
      parametric: "พาราเมตริก",
      attractors: "แอตแทรคเตอร์",
      cellular: "เซลลูลาร์",
      flowfields: "สนามเวกเตอร์"
    },
    mathLab: "ห้องทดลองสมการ",
    calculator: "เครื่องคิดเลข",
    presets: "พรีเซ็ต",
    animate: "การเคลื่อนไหว",
    pause: "หยุดชั่วคราว",
    resume: "เล่นต่อ",
    reset: "รีเซ็ตค่าเริ่มต้น",
    snapshot: "ถ่ายภาพ",
    share: "แชร์",
    linkCopied: "คัดลอกลิงก์แล้ว!",
    darkMode: "โหมดมืด",
    lightMode: "โหมดสว่าง",
    tabControls: "แผงควบคุม",
    tabEquation: "มุมมองสมการ",
    activeModel: "โมเดลสมการที่ใช้งาน",
    browsePresets: "ดูพรีเซ็ตทั้งหมด",
    equationControls: "ตัวควบคุมสมการ",
    uniformsCount: "ตัวแปร GPU",
    spectralPalette: "ชุดสีสเปกตรัม",
    mathIntuition: "ความหมายทางคณิตศาสตร์",
    interactiveMatrixTitle: "เมทริกซ์ตัวแปรปฏิสัมพันธ์ (คลิกหรือชี้เพื่อไฮไลต์)",
    copyLatex: "LaTeX",
    copied: "คัดลอกแล้ว",
    resetDefault: "รีเซ็ต",
    presetsTitle: "แกลเลอรีผลงานชิ้นเอกทางคณิตศาสตร์",
    presetsSubtitle: "สำรวจสมการคณิตศาสตร์ที่คัดสรรจากพลวัตเชิงซ้อน ความโกลาหลแบบไม่เชิงเส้น และจักรวาลเซลลูลาร์",
    allWorks: "ผลงานทั้งหมด",
    activeBadge: "กำลังใช้งาน",
    motionTitle: "การสร้างการเคลื่อนไหวและส่งออกวิดีโอ",
    lfoTitle: "การมอดูเลตพารามิเตอร์ด้วย LFO",
    modulatingActive: "กำลังมอดูเลต",
    enableLfo: "เปิดใช้งาน LFO",
    targetParam: "เลือกพารามิเตอร์ที่ต้องการมอดูเลต",
    waveformOsc: "รูปคลื่นออสซิลเลเตอร์",
    oscSpeed: "ความเร็วการแกว่ง",
    ampRange: "ช่วงแอมพลิจูด",
    videoRecorderTitle: "บันทึกวิดีโอลูป 60 FPS",
    recordDuration: "ความยาว",
    recordVideoBtn: "บันทึกวิดีโอ {s} วิ",
    snapPngBtn: "ถ่ายภาพ 4K PNG",
    capturingProgress: "กำลังบันทึกแคนวาส GPU (60fps)...",
    mathLabTitle: "สตูดิโอและคลังสมการคณิตศาสตร์",
    mathLabSubtitle: "ป้อนสมการคณิตศาสตร์ของคุณเอง หรือเลือกสมการแนะนำพร้อมดูผลลัพธ์ภาพที่ได้ก่อนสร้างงาน",
    tabSuggestions: "สมการแนะนำ",
    tabBuilder: "สร้างสมการเอง",
    tabKeypad: "แป้นพิมพ์วิทยาศาสตร์",
    visualOutcomeLabel: "ผลลัพธ์ภาพที่จะได้:",
    applyMathBtn: "สร้างผลงานจากสมการนี้",
    applyStudioBtn: "ประมวลผลเข้าสู่สตูดิโอ",
    paradigmLabel: "เลือกประเภทสมการคณิตศาสตร์",
    livePreviewLabel: "สมการคณิตศาสตร์ที่กำลังสร้าง (Live LaTeX)",
    visualPredictionLabel: "การทำนายผลลัพธ์ภาพ:",
    calcTitle: "แป้นพิมพ์เครื่องคิดเลขวิทยาศาสตร์",
    calcSubtitle: "เครื่องคิดเลขปฏิสัมพันธ์โดยตรงสำหรับฟังก์ชั่น ตรีโกณมิติ ค่าคงที่ และสมการปรับแต่ง",
    calcExpression: "บัฟเฟอร์สูตรและนิพจน์คณิตศาสตร์",
    calcEvaluate: "คำนวณและส่งค่าไปยังตัวแปร GPU",
    calcClear: "ล้าง",
    calcDelete: "ลบ",
    calcApplyToParam: "ส่งค่าเข้าสู่สไลเดอร์ที่เลือก",
    calcTargetParam: "สไลเดอร์เป้าหมาย"
  }
};

export function getTranslation(lang: Language): Translations {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
