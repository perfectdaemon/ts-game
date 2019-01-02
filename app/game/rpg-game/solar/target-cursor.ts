import { Vector4 } from '../../../engine/math/vector4';
import { Sprite } from '../../../engine/scene/sprite';
import { GLOBAL } from '../global';
import { SolarBase } from './solar.base';

export class TargetCursor extends SolarBase {
  static build(): TargetCursor {
    const cursor = new TargetCursor();
    cursor.initialize();
    cursor.sprite.visible = false;
    return cursor;
  }

  initialize(): void {
    super.initialize();

    const cursorTextureRegion = GLOBAL.assets.solarAtlas.getRegion('circle.png');

    this.sprite = new Sprite();
    this.sprite.setTextureRegion(cursorTextureRegion, false);
    this.sprite.setSize(24, 24);
    this.sprite.setVerticesColor(new Vector4(0.3, 1.0, 0.3, 1.0));
    this.sprite.position.set(0, 0, 10);
  }
}
