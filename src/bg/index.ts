// Picks the background backend: WebGPU (primary) -> WebGL2 (fallback) -> CSS gradient.
// Force one for testing with ?bg=webgl2 or ?bg=css.

import { startWebGPU } from './webgpu/renderer';
import { createDotfield } from './webgpu/dotfield';

type Backend = 'webgpu' | 'webgl2' | 'css';

export async function startBackground(canvas: HTMLCanvasElement): Promise<void> {
  const forced = new URLSearchParams(location.search).get('bg');
  if (forced === 'css') return useCss();

  if (forced !== 'webgl2') {
    const ok = await startWebGPU(canvas, createDotfield(), () => void useWebGL2(canvas));
    if (ok) return report('webgpu');
  }
  await useWebGL2(canvas);
}

async function useWebGL2(canvas: HTMLCanvasElement): Promise<void> {
  try {
    // Separate chunk: browsers with WebGPU never download it.
    const { startWebGL2 } = await import('./webgl2/renderer');
    // A canvas keeps its first context type, so give WebGL2 a fresh element.
    const fresh = canvas.cloneNode(false) as HTMLCanvasElement;
    canvas.replaceWith(fresh);
    if (startWebGL2(fresh, useCss)) return report('webgl2');
  } catch (err) {
    console.error('[bg] WebGL2 unavailable:', err);
  }
  useCss();
}

function useCss(): void {
  document.documentElement.classList.add('no-gl');
  report('css');
}

function report(backend: Backend): void {
  if (import.meta.env.DEV) console.info(`[bg] backend: ${backend}`);
}
