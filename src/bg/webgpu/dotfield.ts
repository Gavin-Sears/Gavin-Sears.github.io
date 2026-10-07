// PRIMARY (WebGPU) 
// Dot-field scene: one fullscreen fragment shader driven by a uniform buffer.

import { createUniforms } from '../uniforms';
import type { Scene } from './scene';
import shader from './dotfield.wgsl?raw';

export function createDotfield(): Scene {
  const uniforms = createUniforms();
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
        size: uniforms.data.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer } }],
      });
    },

    render(pass, f) {
      device.queue.writeBuffer(buffer, 0, uniforms.update(f));
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(3);
    },

    destroy() {
      buffer?.destroy();
    },
  };
}
