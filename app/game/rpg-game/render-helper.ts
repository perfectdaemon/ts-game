import { Font } from '../../engine/render/font';
import { Material } from '../../engine/render/material';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { TextBatch } from '../../engine/render2d/text-batch';
import { Sprite } from '../../engine/scene/sprite';
import { Text } from '../../engine/scene/text';

export interface IRenderable {
  getSpritesToRender(): Sprite[];
  getTextsToRender(): Text[];
}

export class RenderHelper {
  spriteBatch: SpriteBatch;
  textBatch: TextBatch;

  constructor(
    font: Font,
    public spriteMaterial: Material,
  ) {
    this.spriteBatch = new SpriteBatch();
    this.textBatch = new TextBatch(font);
  }

  render(renderables: IRenderable[]): void {
    this.spriteMaterial.bind();
    this.spriteBatch.start();
    this.textBatch.start();
    renderables.forEach(renderable => {
      this.spriteBatch.drawArray(renderable.getSpritesToRender());
      this.textBatch.drawArray(renderable.getTextsToRender());
    });
    this.spriteBatch.finish();
    this.textBatch.finish();
  }

  free(): void {
    this.spriteBatch.free();
    this.textBatch.free();
  }
}
