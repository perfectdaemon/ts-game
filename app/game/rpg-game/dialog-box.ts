import { Vector2 } from '../../engine/math/vector2';
import { renderer } from '../../engine/render/webgl';
import { Sprite } from '../../engine/scene/sprite';
import { Text } from '../../engine/scene/text';
import { IRenderable } from './render-helper';

export class DialogBox implements IRenderable {

  background: Sprite;
  text: Text;

  constructor() {
    this.background = new Sprite(350, 70, new Vector2(0.5, 0));
    this.background.position.set(renderer.width / 2, 10, 10);
    this.background.setVerticesColor(1, 1, 1, 0.3);

    this.text = new Text();
    this.text.pivotPoint.set(0.5, 0.5);
    this.text.parent = this.background;
    this.text.color.set(0.2, 0.2, 0.2, 1.0);
    this.text.maxTextWidth = this.background.width - 10;
  }

  getSpritesToRender(): Sprite[] {
    return [this.background];
  }

  getTextsToRender(): Text[] {
    return [this.text];
  }
}
