import { MaterialData } from '../../../engine/loaders/material.data';
import { Vector4 } from '../../../engine/math/vector4';
import { BlendingMode, CullMode, FuncComparison } from '../../../engine/render/webgl-types';
import { DEFAULT_ATLAS_DATA } from './default-atlas';
import { DEFAULT_SHADER_DATA } from './default-shader';

export const DEFAULT_MATERIAL_DATA: MaterialData = {
  shaderProgramData: DEFAULT_SHADER_DATA,

  textures: [
    { textureAtlasData: DEFAULT_ATLAS_DATA, uniformName: 'uDiffuse' },
  ],

  color: new Vector4(1, 1, 1, 1),

  blend: BlendingMode.Alpha,

  depthWrite: true,
  depthTest: true,
  depthTestFunc: FuncComparison.Less,

  cull: CullMode.Back,
};
