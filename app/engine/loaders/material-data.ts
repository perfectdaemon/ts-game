import { Vector4 } from '../math/vector4';
import { ShaderProgram } from '../render/shader-program';
import { Texture } from '../render/texture';
import { BlendingMode, CullMode, FuncComparison } from '../render/webgl-types';
import { ShaderProgramData } from './shader-program-data';
import { TextureData } from './texture-data';

export class MaterialData {
  shaderProgram?: ShaderProgram;
  shaderProgramData?: ShaderProgramData | null = null;

  textures: {
    textureData?: TextureData | null;
    texture?: Texture | null;
    uniformName: string;
  }[] = [];

  color: Vector4 = new Vector4(1, 1, 1, 1);

  blend: BlendingMode = BlendingMode.Alpha;

  depthWrite: boolean = true;
  depthTest: boolean = true;
  depthTestFunc: FuncComparison = FuncComparison.Less;

  cull: CullMode = CullMode.Back;
}
