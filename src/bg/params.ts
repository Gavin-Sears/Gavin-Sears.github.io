// SHARED 
// dot-field tuning. Both the WebGPU and WebGL2 shaders read these as uniforms,
// so the look is tuned here once.

export const dotfield = {
  /** Grid cell size in CSS px. */
  cellCss: { coarse: 14, fine: 18 },
  /** Noise frequency per grid cell (smaller = bigger blobs). */
  noiseScale: 0.04,
  /** FBM layers. More octaves + higher gain = finer detail (holes in solid areas, dots in gaps). */
  octaves: 5,
  /** Amplitude multiplier per octave (0.5 = smooth blobs, 0.7+ = busy detail). */
  gain: 0.7,
  /** Frequency multiplier per octave. */
  lacunarity: 2,
  /** FBM value (0–1) below which dots vanish. */
  threshold: 0.5,
  /** FBM value at which a dot fills its whole cell. */
  fullAt: 0.66,
  /** Global animation speed multiplier. */
  speed: 3.0,
  /** Rainbow cycles per second, and hue shift per cell along the diagonal. */
  hueSpeed: 0.08,
  hueSpread: 0.015,
  /** Dot brightness at smallest → largest size (keeps text over dots readable). */
  dimMin: 0.3,
  dimMax: 0.70,
  /** Noise-field shift per CSS px scrolled, in grid cells. */
  parallax: 0.05,
  /** Base background color, sRGB 0–1. Matches --bg in styles.css (#0a0512). */
  bg: [10 / 255, 5 / 255, 18 / 255] as const,
  /** Amplitude of the slow background color drift. */
  bgDrift: 0.01,
};
