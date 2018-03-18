import { LoaderFactory } from '../../../engine/loaders/loader-factory';
import { MaterialData } from '../../../engine/loaders/material.data';
import { Font } from '../../../engine/render/font';
import { Material } from '../../../engine/render/material';
import { ShaderProgram } from '../../../engine/render/shader-program';
import { Texture } from '../../../engine/render/texture';
import { Camera } from '../../../engine/scene/camera';
import { DEFAULT_FONT, DEFAULT_MATERIAL, DEFAULT_SHADER } from './default';

export class Assets {
  shader: ShaderProgram = new ShaderProgram();
  blankMaterial: Material = new Material();
  font: Font = new Font();

  gameCamera: Camera = new Camera();
  guiCamera: Camera = new Camera();

  private loaders: LoaderFactory = new LoaderFactory();

  loadAll(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loaders.loadShaderProgram(DEFAULT_SHADER)
        .then(shader => {
          this.shader = shader;
          DEFAULT_MATERIAL.shaderProgram = this.shader;
          DEFAULT_MATERIAL.textures[0].texture = new Texture();
          (DEFAULT_FONT.materialData as MaterialData).shaderProgram = this.shader;
        })

        .then(() => this.loaders.loadMaterial(DEFAULT_MATERIAL))
        .then(material => this.blankMaterial = material)

        .then(() => this.loaders.loadFont(DEFAULT_FONT))
        .then(font => this.font = font)

        .then(() => resolve());
    });
  }
}
