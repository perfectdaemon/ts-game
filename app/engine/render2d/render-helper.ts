import { Font } from '../render/font';
import { Material } from '../render/material';
import { Sprite } from '../scene/sprite';
import { Text } from '../scene/text';
import { SpriteBatch } from './sprite-batch';
import { TextBatch } from './text-batch';

export interface IRenderable {
  getSpritesToRender(): Sprite[];
  getTextsToRender(): Text[];
}

export class RenderHelper {
  spriteBatch: SpriteBatch;
  textBatch: TextBatch;

  renderables: IRenderable[] = [];

  constructor(
    font: Font,
    public spriteMaterial: Material,
  ) {
    this.spriteBatch = new SpriteBatch();
    this.textBatch = new TextBatch(font);
  }

  render(): void {
    this.spriteMaterial.bind();
    this.spriteBatch.start();
    this.textBatch.start();
    this.renderables.forEach(renderable => {
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

  add(renderable: IRenderable): void {
    this.renderables.push(renderable);
  }

  remove(renderable: IRenderable): void {
    const index = this.renderables.indexOf(renderable);

    if (index < 0) {
      console.error(`Can not find provided IRenderable`);
      return;
    }

    this.renderables.splice(index, 1);
  }
}
