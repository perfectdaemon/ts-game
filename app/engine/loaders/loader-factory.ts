import { Font } from '../render/font';
import { Material } from '../render/material';
import { ShaderProgram } from '../render/shader-program';
import { Texture } from '../render/texture';
import { TextureAtlas } from '../render/texture-atlas';
import { FontData } from './font.data';
import { FontLoader } from './font.loader';
import { MaterialData } from './material.data';
import { MaterialLoader } from './material.loader';
import { ShaderProgramData } from './shader-program.data';
import { ShaderProgramLoader } from './shader-program.loader';
import { SoundData, SoundLoadedData } from './sound.data';
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
  private _fontLoader = new FontLoader();

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

  loadSound(data: SoundData): Promise<SoundLoadedData> {
    return this._soundLoader.load(data);
  }

  loadSounds(data: SoundData[]): Promise<SoundLoadedData[]> {
    return  Promise.all(data.map(it => this._soundLoader.load(it)));
  }

  loadFont(data: FontData): Promise<Font> {
    return this._fontLoader.load(data, this._materialLoader,
      this._shaderLoader, this._textureLoader, this._textureAtlasLoader);
  }
}
