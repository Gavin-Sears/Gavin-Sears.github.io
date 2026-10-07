#version 300 es
// FALLBACK (WebGL2)
// line-for-line port of webgpu/dotfield.wgsl.
// Keep function names and step order identical
// change both the WebGL2 and WebGPU files together.

precision highp float;

// std140 block; byte layout matches `Uniforms` in dotfield.wgsl (packed by bg/uniforms.ts).
layout(std140) uniform Uniforms {
  float time;
  float cellPx;
  float scrollY;
  float noiseScale;
  vec2 resolution;
  float threshold;
  float fullAt;
  vec3 bg;
  float bgDrift;
  float hueSpeed;
  float hueSpread;
  float dimMin;
  float dimMax;
  float parallax;
  float speed;
  float gain;
  float lacunarity;
  float octaves;
} u;

out vec4 outColor;

// Float-only hash (no sin, no bit ops) so WGSL and GLSL produce identical patterns.
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Smooth value noise, 0–1.
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 w = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y);
}

// FBM, 0–1. Each octave drifts in its own direction.
float fbm(vec2 p, float t) {
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8); // column-major, same as WGSL mat2x2f
  int count = min(int(u.octaves), 8);
  vec2 q = rot * p; // rotated so noise lattice edges never align with the dot grid
  vec2 dir = vec2(0.03, 0.02);
  float amp = 1.0;
  float sum = 0.0;
  float norm = 0.0;
  for (int k = 0; k < 8; k++) { // constant bound + break: friendlier to old mobile drivers
    if (k >= count) break;
    sum += amp * noise(q + dir * t);
    norm += amp;
    q = rot * q * u.lacunarity;
    dir = rot * dir * -1.3;
    amp *= u.gain;
  }
  return sum / norm;
}

// Saturated RGB rainbow, hue 0–1.
vec3 palette(float h) {
  return 0.5 + 0.5 * cos(6.28318 * (h + vec3(0.0, 0.333, 0.667)));
}

void main() {
  float t = u.time * u.speed;

  // Grid cell and position inside it (-0.5..0.5).
  // gl_FragCoord is bottom-up; flip to match WebGPU's top-down frag coords.
  vec2 frag = vec2(gl_FragCoord.x, u.resolution.y - gl_FragCoord.y);
  vec2 g = frag / u.cellPx;
  vec2 cell = floor(g);
  vec2 local = fract(g) - 0.5;

  // FBM at the cell center
  // scrolling shifts the field (parallax)
  vec2 p = (cell + 0.5 + vec2(0.0, u.scrollY * u.parallax)) * u.noiseScale;
  float n = fbm(p, t);

  // Intensity correspond to radius of circles.
  // Below threshold is not visible, above fullAt touches cell walls.
  float s = smoothstep(u.threshold, u.fullAt, n);
  float r = 0.5 * s;

  // Anti-aliased circle
  // aa is one pixel in cell units
  float aa = 1.0 / u.cellPx;
  float mask = (1.0 - smoothstep(-aa, aa, length(local) - r)) * step(0.001, r);

  // Rainbow sweeping diagonally over time
  float h = fract(t * u.hueSpeed + (cell.x + cell.y) * u.hueSpread);
  // dimmer for smaller dots
  vec3 rgb = palette(h) * mix(u.dimMin, u.dimMax, s);

  // Background is slightly oscillating purple color
  vec3 bg = u.bg + u.bgDrift * vec3(sin(t * 0.07), sin(t * 0.05 + 1.0), sin(t * 0.09 + 2.0));

  outColor = vec4(mix(bg, rgb, mask), 1.0);
}
