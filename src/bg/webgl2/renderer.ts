// FALLBACK (WebGL2) 
// Runs the dot field for browsers without WebGPU.
// Loaded only via dynamic import from bg/index.ts.

import { runLoop } from '../loop';
import { createUniforms } from '../uniforms';
import fragSrc from './dotfield.frag.glsl?raw';

// Fullscreen triangle from gl_VertexID: no vertex buffer.
const vertSrc = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

/**
 * Starts the dot field on `canvas`. Returns false if WebGL2 is unavailable or the shaders fail.
 * `onLost` fires if the context is lost later, after the loop has stopped.
 */
export function startWebGL2(canvas: HTMLCanvasElement, onLost: () => void): boolean {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return false;

  const program = link(gl, vertSrc, fragSrc);
  if (!program) return false;

  const uniforms = createUniforms();
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
  gl.bufferData(gl.UNIFORM_BUFFER, uniforms.data.byteLength, gl.DYNAMIC_DRAW);
  gl.uniformBlockBinding(program, gl.getUniformBlockIndex(program, 'Uniforms'), 0);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, buffer);
  gl.useProgram(program);

  const stop = runLoop(
    canvas,
    (f) => {
      gl.viewport(0, 0, f.width, f.height);
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, uniforms.update(f));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
  );

  canvas.addEventListener(
    'webglcontextlost',
    () => {
      stop();
      onLost();
    },
    { once: true },
  );

  return true;
}

function link(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram | null {
  const program = gl.createProgram();
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;

  // Link failed: print each shader's compile log.
  for (const shader of gl.getAttachedShaders(program) ?? []) {
    const log = gl.getShaderInfoLog(shader);
    if (log) console.error('[bg] WebGL2 shader error:', log);
  }
  console.error('[bg] WebGL2 link error:', gl.getProgramInfoLog(program));
  return null;
}
