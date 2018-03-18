import { LoaderFactory } from '../../../engine/loaders/loader-factory';
import { Font } from '../../../engine/render/font';
import { Material } from '../../../engine/render/material';
import { ShaderProgram } from '../../../engine/render/shader-program';
import { DEFAULT_FONT, DEFAULT_MATERIAL, DEFAULT_SHADER } from './default';

export class Assets {
  shader: ShaderProgram = new ShaderProgram();
  blankMaterial: Material = new Material();
  font: Font = new Font();

  private loaders: LoaderFactory = new LoaderFactory();

  loadAll(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Promise.all<ShaderProgram, Font>([
        this.loaders.loadShaderProgram(DEFAULT_SHADER),
        this.loaders.loadFont(DEFAULT_FONT)
      ])
        .then(result => {
          [this.shader, this.font] = result;
          DEFAULT_MATERIAL.shaderProgram = this.shader;
        })
        .then(() => this.loaders.loadMaterial(DEFAULT_MATERIAL))
        .then(material => this.blankMaterial = material)
        .then(() => resolve());
    });
  }
}
