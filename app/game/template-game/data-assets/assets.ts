import { LoaderFactory } from '../../../engine/loaders/loader-factory';
import { MaterialData } from '../../../engine/loaders/material.data';
import { Font } from '../../../engine/render/font';
import { Material } from '../../../engine/render/material';
import { ShaderProgram } from '../../../engine/render/shader-program';
import { Texture } from '../../../engine/render/texture';
import { Camera } from '../../../engine/scene/camera';
import { DEFAULT_FONT, DEFAULT_MATERIAL, DEFAULT_SHADER } from './default';

export class Assets {
  shader: ShaderProgram;
  blankMaterial: Material;
  font: Font;

  gameCamera: Camera;
  guiCamera: Camera;

  private loaders: LoaderFactory = new LoaderFactory();

  async loadAll(): Promise<void> {
    this.gameCamera = new Camera();
    this.guiCamera = new Camera();

    this.shader = await this.loaders.loadShaderProgram(DEFAULT_SHADER);

    DEFAULT_MATERIAL.shaderProgram = this.shader;
    DEFAULT_MATERIAL.textures[0].texture = new Texture();
    (DEFAULT_FONT.materialData as MaterialData).shaderProgram = this.shader;
    this.blankMaterial = await this.loaders.loadMaterial(DEFAULT_MATERIAL);
    this.font = await this.loaders.loadFont(DEFAULT_FONT);

    return Promise.resolve();
  }
}
