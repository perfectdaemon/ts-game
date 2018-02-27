import { Material } from '../render/material';
import { ShaderProgram } from '../render/shader-program';
import { Texture } from '../render/texture';
import { TextureAtlas } from '../render/texture-atlas';
import { MaterialData } from './material.data';
import { ShaderProgramData } from './shader-program.data';
import { ShaderProgramLoader } from './shader-program.loader';
import { TextureAtlasData } from './texture-atlas.data';
import { TextureAtlasLoader } from './texture-atlas.loader';
import { TextureData } from './texture.data';
import { TextureLoader } from './texture.loader';

export class MaterialLoader {
  load(
    data: MaterialData,
    shaderProgramLoader: ShaderProgramLoader,
    textureLoader: TextureLoader,
    textureAtlasLoader: TextureAtlasLoader,
  ): Promise<Material> {
    return new Promise<Material>((resolve, reject) => {

      if (!data.shaderProgram && !data.shaderProgramData) {
        throw new Error(`Can't create material - no shader or shader data provided`);
      }

      const material = new Material();

      material.blend = data.blend;
      material.color = data.color;
      material.cull = data.cull;
      material.depthTest = data.depthTest;
      material.depthTestFunc = data.depthTestFunc;
      material.depthWrite = data.depthWrite;

      const shaderPromise = data.shaderProgram
        ? new Promise<ShaderProgram>((res, rej) => res(data.shaderProgram as ShaderProgram))
        : shaderProgramLoader.load(data.shaderProgramData as ShaderProgramData);

      shaderPromise
        .then(shaderProgram => material.shader = shaderProgram)
        .then(() => {
          const textureAddedPromises: Promise<void>[] = [];
          for (const textureInfo of data.textures) {
            if (textureInfo.texture) {
              material.addTexture(textureInfo.texture, textureInfo.uniformName);
            } else if (textureInfo.textureAtlas) {
              material.addTexture(textureInfo.textureAtlas, textureInfo.uniformName);
            } else if (textureInfo.textureData) {
              const promise = textureLoader.load(textureInfo.textureData)
                .then(texture => material.addTexture(texture, textureInfo.uniformName));
              textureAddedPromises.push(promise);
            } else if (textureInfo.textureAtlasData) {
              const promise = textureAtlasLoader.load(textureInfo.textureAtlasData)
                .then(texture => material.addTexture(texture, textureInfo.uniformName));
              textureAddedPromises.push(promise);
            } else {
              throw new Error(
                `Can't add texture with uniformName '${textureInfo.uniformName}'
                 to material - no texture or texture data provided`);
            }
          }

          Promise.all(textureAddedPromises)
            .then(() => resolve(material));
        });
    });
  }

}
