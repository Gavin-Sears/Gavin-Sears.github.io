// SHARED — canvas sizing and frame loop used by every background backend.

export interface FrameInfo {
  /** Seconds of animation, wrapped hourly to keep f32 precision. */
  time: number;
  /** Seconds since the previous drawn frame (clamped). */
  dt: number;
  /** Canvas backing size in device px. */
  width: number;
  height: number;
  /** Effective pixel ratio (CSS px → backing px). */
  dpr: number;
  /** Page scroll in CSS px. */
  scrollY: number;
}

export const isCoarse = matchMedia('(pointer: coarse)').matches;

const MAX_DPR = isCoarse ? 1.5 : 2;
const MIN_FRAME_MS = isCoarse ? 1000 / 30 : 0;
const MAX_DT = 0.1;
const TIME_WRAP = 3600;

/**
 * Sizes the canvas backing store and calls `draw` once per frame.
 * Pauses while the tab is hidden; under reduced motion it only draws on resize.
 * Returns a function that stops the loop.
 */
export function runLoop(
  canvas: HTMLCanvasElement,
  draw: (f: FrameInfo) => void,
  maxDim = 8192,
): () => void {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const frame: FrameInfo = { time: 0, dt: 0, width: 0, height: 0, dpr: 1, scrollY: 0 };
  let raf = 0;
  let last = 0;

  const render = () => {
    frame.scrollY = window.scrollY;
    draw(frame);
  };

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const elapsed = now - last;
    if (elapsed < MIN_FRAME_MS - 2) return;
    last = now;
    frame.dt = Math.min(elapsed / 1000, MAX_DT);
    frame.time = (frame.time + frame.dt) % TIME_WRAP;
    render();
  };

  const start = () => {
    if (raf || document.hidden || reducedMotion.matches || !frame.width) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const resizer = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const box = entry.contentBoxSize[0];
    if (!box) return;
    const dpr = Math.min(devicePixelRatio, MAX_DPR);
    const w = Math.min(maxDim, Math.max(1, Math.round(box.inlineSize * dpr)));
    const h = Math.min(maxDim, Math.max(1, Math.round(box.blockSize * dpr)));
    if (w === frame.width && h === frame.height) return;
    canvas.width = frame.width = w;
    canvas.height = frame.height = h;
    frame.dpr = dpr;
    if (raf) return; // the running loop picks up the new size
    render(); // paused or reduced motion: draw the new size once
    start();
  });
  resizer.observe(canvas);

  const onVisibility = () => (document.hidden ? pause() : start());
  const onMotion = () => (reducedMotion.matches ? pause() : start());
  document.addEventListener('visibilitychange', onVisibility);
  reducedMotion.addEventListener('change', onMotion);

  return () => {
    pause();
    resizer.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    reducedMotion.removeEventListener('change', onMotion);
  };
}
