// PRIMARY (WebGPU) — dot-field scene: one fullscreen fragment shader driven by a uniform buffer.

import { dotfield as params } from '../params';
import { isCoarse } from '../loop';
import type { Scene } from './scene';
import shader from './dotfield.wgsl?raw';

export function createDotfield(): Scene {
  // Layout mirrors `Uniforms` in dotfield.wgsl (48 bytes).
  const data = new Float32Array(12);
  const cellCss = isCoarse ? params.cellCss.coarse : params.cellCss.fine;
  let device: GPUDevice;
  let pipeline: GPURenderPipeline;
  let buffer: GPUBuffer;
  let bindGroup: GPUBindGroup;

  return {
    init(d, format) {
      device = d;
      const module = device.createShaderModule({ code: shader });
      pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: { module, entryPoint: 'vs' },
        fragment: { module, entryPoint: 'fs', targets: [{ format }] },
      });
      buffer = device.createBuffer({
        size: data.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer } }],
      });
    },

    render(pass, f) {
      data[0] = f.time;
      data[1] = cellCss * f.dpr;
      data[2] = f.scrollY;
      data[3] = params.threshold;
      data[4] = f.width;
      data[5] = f.height;
      data[6] = params.noiseScale;
      data[7] = params.speed;
      data.set(params.bg, 8);
      data[11] = params.bgDrift;
      device.queue.writeBuffer(buffer, 0, data);

      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
    },

    destroy() {
      buffer?.destroy();
    },
  };
}
