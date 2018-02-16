import { MaterialData } from '../../../engine/loaders/material.data';
import { MaterialLoader } from '../../../engine/loaders/material.loader';
import { ShaderProgramData } from '../../../engine/loaders/shader-program.data';
import { ShaderProgramLoader } from '../../../engine/loaders/shader-program.loader';
import { TextureAtlasData } from '../../../engine/loaders/texture-atlas.data';
import { TextureAtlasLoader } from '../../../engine/loaders/texture-atlas.loader';
import { TextureData } from '../../../engine/loaders/texture.data';
import { TextureLoader } from '../../../engine/loaders/texture.loader';
import { Material } from '../../../engine/render/material';
import { ShaderProgram } from '../../../engine/render/shader-program';
import { Texture } from '../../../engine/render/texture';
import { TextureAtlas } from '../../../engine/render/texture-atlas';

export class GameAssetLoader {
  private _textureLoader = new TextureLoader();
  private _textureAtlasLoader = new TextureAtlasLoader();
  private _shaderLoader = new ShaderProgramLoader();
  private _materialLoader = new MaterialLoader();

  loadTexture(data: TextureData): Promise<Texture> {
    return this._textureLoader.load(data);
  }

  loadTextureAtlas(data: TextureAtlasData): Promise<TextureAtlas> {
    return this._textureAtlasLoader.load(data);
  }

  loadShaderProgra(data: ShaderProgramData): Promise<ShaderProgram> {
    return this._shaderLoader.load(data);
  }

  loadMaterial(data: MaterialData): Promise<Material> {
    return this._materialLoader.load(data);
  }
}
