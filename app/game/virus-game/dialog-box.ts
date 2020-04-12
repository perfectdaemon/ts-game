import { renderer } from '../../engine/render/webgl';
import { Sprite } from '../../engine/scene/sprite';
import { Text } from '../../engine/scene/text';
import { GLOBAL } from './global';
import { IRenderable } from './render-helper';

export class DialogBox implements IRenderable {

  background: Sprite;

  text: Text;

  constructor(height: number) {
    this.background = new Sprite({
      size: [renderer.width - 20, height],
      position: [renderer.width / 2, height / 2 + 10, 40],
      color: [1, 1, 1, 0.3],
      textureRegion: {
        region: GLOBAL.assets.solarAtlas.getRegion('blank.png'),
        adjustSize: false,
      },
      pivotPoint: [0.5, 0.5],
    });

    this.text = new Text();
    this.text.pivotPoint.set(0.5, 0.5);
    this.text.parent = this.background;
    this.text.color.set(1, 1, 1, 1.0);
    this.text.maxTextWidth = this.background.width - 10;
    this.text.isWrapped = true;
    this.text.position.set(0, 0, 45);
  }

  getSpritesToRender(): Sprite[] {
    return [this.background];
  }

  getTextsToRender(): Text[] {
    return [this.text];
  }
}
