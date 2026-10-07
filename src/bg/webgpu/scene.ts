// PRIMARY (WebGPU) 
// contract for anything drawn as the page background.

import type { FrameInfo } from '../loop';

export type { FrameInfo };

export interface Scene {
  init(device: GPUDevice, format: GPUTextureFormat): Promise<void> | void;
  /** Record draw calls into a pass that targets the full canvas. */
  render(pass: GPURenderPassEncoder, f: FrameInfo): void;
  destroy(): void;
}
