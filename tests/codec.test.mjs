import test from "node:test";
import assert from "node:assert/strict";
import LZString from "lz-string";

// Replicate codec logic to test mathematical state roundtrip
function encodeStudioState(state) {
  const payload = {
    c: state.category,
    p: state.presetId,
    params: state.parameters,
    pal: state.palette,
    z: Number(state.zoom.toFixed(4)),
    pan: [Number(state.pan[0].toFixed(5)), Number(state.pan[1].toFixed(5))],
    spd: Number(state.speed.toFixed(2)),
    ...(state.activeLfo?.enabled
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
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
}

function decodeStudioState(compressed) {
  if (!compressed) return null;
  const json = LZString.decompressFromEncodedURIComponent(compressed);
  if (!json) return null;
  const data = JSON.parse(json);
  return {
    category: data.c,
    presetId: data.p,
    parameters: data.params || {},
    palette: data.pal,
    zoom: data.z || 1.0,
    pan: data.pan || [0, 0],
    speed: data.spd || 1.0,
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
}

test("State serialization roundtrip preserves mathematical parameters", () => {
  const original = {
    category: "fractals",
    presetId: "julia-dendrite",
    parameters: {
      cr: -0.4,
      ci: 0.6,
      maxIter: 180,
      colorCycles: 3.0
    },
    palette: "cyber-cyan",
    zoom: 1.2,
    pan: [0.0, 0.0],
    speed: 1.0,
    activeLfo: {
      enabled: true,
      paramId: "cr",
      amplitude: 0.08,
      speed: 0.3,
      waveform: "sine"
    }
  };

  const encoded = encodeStudioState(original);
  assert.ok(encoded.length > 0, "Compressed string must not be empty");
  assert.ok(encoded.length < 500, "Encoded URL param should be highly compact");

  const decoded = decodeStudioState(encoded);
  assert.equal(decoded.category, original.category);
  assert.equal(decoded.presetId, original.presetId);
  assert.equal(decoded.palette, original.palette);
  assert.equal(decoded.zoom, original.zoom);
  assert.equal(decoded.parameters.cr, -0.4);
  assert.equal(decoded.parameters.ci, 0.6);
  assert.equal(decoded.parameters.maxIter, 180);
  assert.equal(decoded.activeLfo.enabled, true);
  assert.equal(decoded.activeLfo.paramId, "cr");
  assert.equal(decoded.activeLfo.waveform, "sine");
});

test("Decoder handles corrupted or empty inputs gracefully", () => {
  assert.equal(decodeStudioState(""), null);
  assert.equal(decodeStudioState("invalid-corrupted-hash!@#$"), null);
});
