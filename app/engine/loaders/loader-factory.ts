import { Material } from '../render/material';
import { ShaderProgram } from '../render/shader-program';
import { Texture } from '../render/texture';
import { TextureAtlas } from '../render/texture-atlas';
import { MaterialData } from './material.data';
import { MaterialLoader } from './material.loader';
import { ShaderProgramData } from './shader-program.data';
import { ShaderProgramLoader } from './shader-program.loader';
import { SoundData } from './sound.data';
import { SoundLoader } from './sound.loader';
import { TextureAtlasData } from './texture-atlas.data';
import { TextureAtlasLoader } from './texture-atlas.loader';
import { TextureData } from './texture.data';
import { TextureLoader } from './texture.loader';

export class LoaderFactory {
  private _textureLoader = new TextureLoader();
  private _textureAtlasLoader = new TextureAtlasLoader();
  private _shaderLoader = new ShaderProgramLoader();
  private _materialLoader = new MaterialLoader();
  private _soundLoader = new SoundLoader();

  loadTexture(data: TextureData): Promise<Texture> {
    return this._textureLoader.load(data);
  }

  loadTextureAtlas(data: TextureAtlasData): Promise<TextureAtlas> {
    return this._textureAtlasLoader.load(data);
  }

  loadShaderProgram(data: ShaderProgramData): Promise<ShaderProgram> {
    return this._shaderLoader.load(data);
  }

  loadMaterial(data: MaterialData): Promise<Material> {
    return this._materialLoader.load(data, this._shaderLoader, this._textureLoader, this._textureAtlasLoader);
  }

  loadSound(data: SoundData): Promise<AudioBuffer> {
    return this._soundLoader.load(data);
  }
}
