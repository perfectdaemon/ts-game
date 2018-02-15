import { Material } from '../render/material';
import { ShaderProgram } from '../render/shader-program';
import { Texture } from '../render/texture';
import { TextureAtlas } from '../render/texture-atlas';
import { MaterialData } from './material.data';
import { BaseLoader, IRemoteResourceLoader } from './remote-resource.loader';
import { ShaderProgramData } from './shader-program.data';
import { ShaderProgramLoader } from './shader-program.loader';
import { TextureAtlasData } from './texture-atlas.data';
import { TextureAtlasLoader } from './texture-atlas.loader';
import { TextureData } from './texture.data';
import { TextureLoader } from './texture.loader';

export class MaterialLoader extends BaseLoader implements IRemoteResourceLoader<Material> {
  load(data: MaterialData): Promise<Material> {
    return new Promise<Material>((resolve, reject) => {
      const material = new Material();

      if (!data.shaderProgram) {
        throw new Error(`Can't create material - no shader or shader data provided`);
      }

      const shaderPromise = data.shaderProgram instanceof ShaderProgram
        ? new Promise<ShaderProgram>((res, rej) => res(data.shaderProgram as ShaderProgram))
        : new ShaderProgramLoader().load(data.shaderProgram as ShaderProgramData);

      shaderPromise.then(shaderProgram => material.shader = shaderProgram);

      material.blend = data.blend;
      material.color = data.color;
      material.cull = data.cull;
      material.depthTest = data.depthTest;
      material.depthTestFunc = data.depthTestFunc;
      material.depthWrite = data.depthWrite;

      const textureAddedPromises: Promise<void>[] = [];
      for (const textureInfo of data.textures || []) {
        if (!textureInfo.texture) {
          throw new Error(
            `Can't add texture with uniformName '${textureInfo.uniformName}'
             to material - no texture or texture data provided`);
        }

        if (textureInfo.texture instanceof Texture || textureInfo.texture instanceof TextureAtlas) {
          material.addTexture(textureInfo.texture, textureInfo.uniformName);
        } else if (textureInfo.texture instanceof TextureAtlasData) {
          const loader = new TextureAtlasLoader();
          const atlasData = textureInfo.texture as TextureAtlasData;
          const promise = loader.load([atlasData.imageFileSrc, atlasData.atlasFileSrc])
            .then(texture => material.addTexture(texture, textureInfo.uniformName));
          textureAddedPromises.push(promise);

        } else if (textureInfo.texture instanceof TextureData) {
          const loader = new TextureLoader();
          const textureData = textureInfo.texture as TextureData;
          const promise = loader.load([textureData.imageFileSrc])
            .then(texture => material.addTexture(texture, textureInfo.uniformName));
          textureAddedPromises.push(promise);
        }
      }

      Promise.all(textureAddedPromises)
        .then(() => resolve(material));
    });
  }

}
