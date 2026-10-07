// PRIMARY (WebGPU) 
// Dot-field background.
// A grid of circles whose size follows animated FBM noise, colored by a sweeping RGB rainbow.
// The WebGL2 fallback is more or less a line-for-line port of this file.

struct Uniforms {
  time: f32,
  cellPx: f32,
  scrollY: f32,
  noiseScale: f32,
  resolution: vec2f,
  threshold: f32,
  fullAt: f32,
  bg: vec3f,
  bgDrift: f32,
  hueSpeed: f32,
  hueSpread: f32,
  dimMin: f32,
  dimMax: f32,
  parallax: f32,
  speed: f32,
  gain: f32,
  lacunarity: f32,
  octaves: f32,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

// Fullscreen triangle: no vertex buffer.
@vertex
fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  let p = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  return vec4f(p * 2.0 - 1.0, 0.0, 1.0);
}

// Float-only hash (no sin, no bit ops) so WGSL and GLSL produce identical patterns.
fn hash(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Smooth value noise, 0–1.
fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let w = f * f * (3.0 - 2.0 * f);
  let a = hash(i);
  let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0));
  let d = hash(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

// FBM, 0–1. Each octave drifts in its own direction.
fn fbm(p: vec2f, t: f32) -> f32 {
  let rot = mat2x2f(0.8, 0.6, -0.6, 0.8);
  let count = min(i32(u.octaves), 8);
  var q = rot * p; // rotated so noise lattice edges never align with the dot grid
  var dir = vec2f(0.03, 0.02);
  var amp = 1.0;
  var sum = 0.0;
  var norm = 0.0;
  for (var k = 0; k < count; k++) {
    sum += amp * noise(q + dir * t);
    norm += amp;
    q = rot * q * u.lacunarity;
    dir = rot * dir * -1.3;
    amp *= u.gain;
  }
  return sum / norm;
}

// Saturated RGB rainbow, hue 0–1.
fn palette(h: f32) -> vec3f {
  return 0.5 + 0.5 * cos(6.28318 * (h + vec3f(0.0, 0.333, 0.667)));
}

@fragment
fn fs(@builtin(position) frag: vec4f) -> @location(0) vec4f {
  let t = u.time * u.speed;

  // Grid cell and position inside it (-0.5..0.5).
  let g = frag.xy / u.cellPx;
  let cell = floor(g);
  let local = fract(g) - 0.5;

  // FBM at the cell center
  // scrolling shifts the field (parallax)
  let p = (cell + 0.5 + vec2f(0.0, u.scrollY * u.parallax)) * u.noiseScale;
  let n = fbm(p, t);

  // Intensity correspond to radius of circles.
  // Below threshold is not visible, above fullAt touches cell walls.
  let s = smoothstep(u.threshold, u.fullAt, n);
  let r = 0.5 * s;

  // Anti-aliased circle 
  // aa is one pixel in cell units
  let aa = 1.0 / u.cellPx;
  let mask = (1.0 - smoothstep(-aa, aa, length(local) - r)) * step(0.001, r);

  // Rainbow sweeping diagonally over time
  let h = fract(t * u.hueSpeed + (cell.x + cell.y) * u.hueSpread);
  // dimmer for smaller dots
  let rgb = palette(h) * mix(u.dimMin, u.dimMax, s);

  // Background is slightly oscillating purple color
  let bg = u.bg + u.bgDrift * vec3f(sin(t * 0.07), sin(t * 0.05 + 1.0), sin(t * 0.09 + 2.0));

  return vec4f(mix(bg, rgb, mask), 1.0);
}
