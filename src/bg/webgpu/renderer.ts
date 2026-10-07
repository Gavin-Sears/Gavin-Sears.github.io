// PRIMARY (WebGPU) 
// device/context setup; runs a Scene on the shared frame loop.

import { runLoop } from '../loop';
import type { Scene } from './scene';

/**
 * Starts `scene` on `canvas`. Resolves false if WebGPU is unavailable or setup fails
 * (the canvas is left untouched unless a device was obtained).
 * `onLost` fires if the device is lost later, after the loop has stopped.
 */
export async function startWebGPU(
  canvas: HTMLCanvasElement,
  scene: Scene,
  onLost: () => void,
): Promise<boolean> {
  if (!navigator.gpu) return false;

  let device: GPUDevice;
  try {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'low-power' });
    if (!adapter) return false;
    device = await adapter.requestDevice();
  } catch {
    return false;
  }

  const context = canvas.getContext('webgpu');
  if (!context) {
    device.destroy();
    return false;
  }
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: 'opaque' });

  device.pushErrorScope('validation');
  await scene.init(device, format);
  const error = await device.popErrorScope();
  if (error) {
    console.error('[bg] WebGPU init failed:', error.message);
    device.destroy();
    return false;
  }

  const stop = runLoop(
    canvas,
    (f) => {
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          { view: context.getCurrentTexture().createView(), loadOp: 'clear', storeOp: 'store' },
        ],
      });
      scene.render(pass, f);
      pass.end();
      device.queue.submit([encoder.finish()]);
    },
    device.limits.maxTextureDimension2D,
  );

  void device.lost.then((info) => {
    stop();
    scene.destroy();
    if (info.reason !== 'destroyed') onLost();
  });

  return true;
}
