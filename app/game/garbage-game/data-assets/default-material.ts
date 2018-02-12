import { MaterialData } from '../../../engine/loaders/material-data';
import { Vector4 } from '../../../engine/math/vector4';
import { BlendingMode, CullMode, FuncComparison } from '../../../engine/render/webgl-types';
import { DEFAULT_SHADER } from './default-shader';

export const DEFAULT_MATERIAL: MaterialData = {
  shaderProgram: DEFAULT_SHADER,

  textures: [
    { textureData: { fileName: '' }, uniformName: '' },
  ],

  color: new Vector4(1, 1, 1, 1),

  blend: BlendingMode.Alpha,

  depthWrite:  true,
  depthTest:  true,
  depthTestFunc: FuncComparison.Less,

  cull: CullMode.Back,
};
