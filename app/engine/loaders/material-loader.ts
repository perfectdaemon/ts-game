import { Material } from '../render/material';
import { MaterialData } from './material-data';
import { ShaderProgramData } from './shader-program-data';
import { ShaderProgramLoader } from './shader-program-loader';
import { TextureData } from './texture-data';
import { TextureLoader } from './texture-loader';

export class MaterialLoader {
  public static load(data: MaterialData): Material {
    if (!data.shaderProgram && !data.shaderProgramData) {
      throw new Error(`Can't create material - no shader or shader data provided`);
    }
    const shader = data.shaderProgram || ShaderProgramLoader.load(data.shaderProgramData as ShaderProgramData);

    const material = new Material(shader);
    material.blend = data.blend;
    material.color = data.color;
    material.cull = data.cull;
    material.depthTest = data.depthTest;
    material.depthTestFunc = data.depthTestFunc;
    material.depthWrite = data.depthWrite;

    for (const textureInfo of data.textures) {
      if (!textureInfo.texture && !textureInfo.textureData) {
        throw new Error(
          `Can't add texture with uniformName '${textureInfo.uniformName}'
           to material - no texture or texture data provided`);
      }

      const texture = textureInfo.texture || TextureLoader.load(textureInfo.textureData as TextureData);

      material.addTexture(texture, textureInfo.uniformName);
    }

    return material;
  }
}
