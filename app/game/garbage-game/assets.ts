import { LoaderFactory } from '../../engine/loaders/loader-factory';
import { Material } from '../../engine/render/material';
import { ShaderProgram } from '../../engine/render/shader-program';
import { Texture } from '../../engine/render/texture';
import { TextureAtlas } from '../../engine/render/texture-atlas';
import { DEFAULT_MATERIAL_DATA, NO_TEXTURE_MATERIAL } from './data-assets/default-material';
import { DEFAULT_SHADER_DATA } from './data-assets/default-shader';
import { SOUNDS_DATA } from './data-assets/sounds.data';
import { CHARACTER_TEXTURE_DATE, DEFAULT_ATLAS_DATA } from './data-assets/textures';

export class Assets {
  shader: ShaderProgram;
  textureAtlas: TextureAtlas;
  characterTexture: Texture;
  material: Material;
  characterMaterial: Material;
  noTextureMaterial: Material;
  sounds: {[key: string]: AudioBuffer} = {};

  loadAll(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      const loaderFactory = new LoaderFactory();

      const soundPromises: Promise<any>[] = [];

      for (const soundData of SOUNDS_DATA) {
        soundPromises.push(loaderFactory.loadSound(soundData)
          .then(data => this.sounds[soundData.soundName] = data));
      }

      Promise.all<ShaderProgram, TextureAtlas, Texture>([
        loaderFactory.loadShaderProgram(DEFAULT_SHADER_DATA),
        loaderFactory.loadTextureAtlas(DEFAULT_ATLAS_DATA),
        loaderFactory.loadTexture(CHARACTER_TEXTURE_DATE),
      ])
        .then(result => [this.shader, this.textureAtlas, this.characterTexture] = result)
        .then(() => {
          DEFAULT_MATERIAL_DATA.shaderProgram = this.shader;
          DEFAULT_MATERIAL_DATA.textures[0].textureAtlas = this.textureAtlas;
          return loaderFactory.loadMaterial(DEFAULT_MATERIAL_DATA);
        })
        .then(material => this.material = material)
        .then(() => {
          DEFAULT_MATERIAL_DATA.textures[0].textureAtlas = undefined;
          DEFAULT_MATERIAL_DATA.textures[0].texture = this.characterTexture;
          return loaderFactory.loadMaterial(DEFAULT_MATERIAL_DATA);
        })
        .then(material => this.characterMaterial = material)
        .then(() => {
          NO_TEXTURE_MATERIAL.shaderProgram = this.shader;
          NO_TEXTURE_MATERIAL.textures[0].texture = new Texture();
          return loaderFactory.loadMaterial(NO_TEXTURE_MATERIAL);
        })
        .then(material => this.noTextureMaterial = material)
        .then(() => Promise.all(soundPromises))
        .then(() => resolve());
    });
  }

}
