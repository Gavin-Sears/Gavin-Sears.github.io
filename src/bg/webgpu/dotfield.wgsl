// PRIMARY (WebGPU) — dot-field background.
// The WebGL2 fallback must stay a line-for-line port of this file.

struct Uniforms {
  time: f32,
  cellPx: f32,
  scrollY: f32,
  threshold: f32,
  resolution: vec2f,
  noiseScale: f32,
  speed: f32,
  bg: vec3f,
  bgDrift: f32,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

// Fullscreen triangle: no vertex buffer.
@vertex
fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
  let p = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  return vec4f(p * 2.0 - 1.0, 0.0, 1.0);
}

@fragment
fn fs(@builtin(position) frag: vec4f) -> @location(0) vec4f {
  let t = u.time * u.speed;

  // Background: near-black purple with a barely perceptible drift.
  let bg = u.bg + u.bgDrift * vec3f(sin(t * 0.07), sin(t * 0.05 + 1.0), sin(t * 0.09 + 2.0));

  return vec4f(bg, 1.0);
}
