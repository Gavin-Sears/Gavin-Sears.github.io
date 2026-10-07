// SHARED 
// packs the dot-field uniforms. The byte layout matches `Uniforms` in webgpu/dotfield.wgsl
// and the std140 block `Uniforms` in webgl2/dotfield.frag.glsl, so both backends upload the same buffer.

import { dotfield as params } from './params';
import { isCoarse, type FrameInfo } from './loop';

export function createUniforms() {
  // 96 bytes. Slots 0–5 change per frame; the rest come from params.ts once.
  const data = new Float32Array(24);
  data[3] = params.noiseScale;
  data[6] = params.threshold;
  data[7] = params.fullAt;
  data.set(params.bg, 8);
  data[11] = params.bgDrift;
  data[12] = params.hueSpeed;
  data[13] = params.hueSpread;
  data[14] = params.dimMin;
  data[15] = params.dimMax;
  data[16] = params.parallax;
  data[17] = params.speed;
  data[18] = params.gain;
  data[19] = params.lacunarity;
  data[20] = params.octaves;
  const cellCss = isCoarse ? params.cellCss.coarse : params.cellCss.fine;

  return {
    data,
    update(f: FrameInfo): Float32Array {
      data[0] = f.time;
      data[1] = cellCss * f.dpr;
      data[2] = f.scrollY;
      data[4] = f.width;
      data[5] = f.height;
      return data;
    },
  };
}
