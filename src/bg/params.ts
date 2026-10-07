// SHARED — dot-field tuning. Both the WebGPU and WebGL2 shaders read these as uniforms,
// so the look is tuned here once.

export const dotfield = {
  /** Grid cell size in CSS px. */
  cellCss: { coarse: 14, fine: 18 },
  /** FBM value (0–1) below which dots vanish. */
  threshold: 0.45,
  /** Noise frequency per grid cell. */
  noiseScale: 0.08,
  /** Global animation speed multiplier. */
  speed: 1,
  /** Base background color, sRGB 0–1. Matches --bg in styles.css (#0a0512). */
  bg: [10 / 255, 5 / 255, 18 / 255] as const,
  /** Amplitude of the slow background color drift. */
  bgDrift: 0.006,
};
