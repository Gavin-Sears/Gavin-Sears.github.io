// Picks the background backend: WebGPU (primary) → CSS gradient.
// Force one for testing with ?bg=css.

import { startWebGPU } from './webgpu/renderer';
import { createDotfield } from './webgpu/dotfield';

type Backend = 'webgpu' | 'css';

export async function startBackground(canvas: HTMLCanvasElement): Promise<void> {
  const forced = new URLSearchParams(location.search).get('bg');

  if (forced !== 'css' && (await startWebGPU(canvas, createDotfield(), useCss))) {
    report('webgpu');
    return;
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
