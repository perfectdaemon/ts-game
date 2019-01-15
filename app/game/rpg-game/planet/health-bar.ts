import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';

export class HealthBar {
  back: Sprite;
  current: Sprite;
  text: Text;

  /*modifiedTextureRegion: TextureRegion;
  originalTextureWidth: number;*/
  originalWidth: number;

  constructor(x: number, y: number) {
    const backRegion = GLOBAL.assets.solarAtlas.getRegion('health_bar_back.png');
    const currentRegion = GLOBAL.assets.solarAtlas.getRegion('health_bar.png');

    this.back = new Sprite(1, 1, new Vector2(0, 0));
    this.back.position.set(x, y, 2);
    this.back.setTextureRegion(backRegion, true);

    this.current = new Sprite(1, 1, new Vector2(0, 0));
    this.current.parent = this.back;
    this.current.position.set(5, 5, this.back.position.z + 1);
    this.current.setTextureRegion(currentRegion, true);

    this.text = new Text();
    this.text.position.set(0, 0, this.back.position.z + 2);
    this.text.pivotPoint.set(0.5, 0);
    this.text.parent = this.current;
    this.text.color.set(1, 1, 1, 1.0);
/*
    this.modifiedTextureRegion = {
      name: currentRegion.name,
      rotated: currentRegion.rotated,
      texture: currentRegion.texture,
      th: currentRegion.th,
      tw: currentRegion.tw,
      tx: currentRegion.tx,
      ty: currentRegion.ty,
    };

    this.originalTextureWidth = currentRegion.rotated
      ? currentRegion.th
      : currentRegion.tw;
*/
    this.originalWidth = this.current.width;
  }

  updateHealth(current: number, max: number): void {
    const newWidth = this.originalWidth * (current / max);
    this.current.width = newWidth;

    this.text.text = current.toString();
    this.text.visible = current > 0;
    this.text.position.x = newWidth / 2;

/*
    const percentage = this.originalTextureWidth * (current / max);

    if (this.modifiedTextureRegion.rotated) {
      this.modifiedTextureRegion.th = percentage;
    } else {
      this.modifiedTextureRegion.tw = percentage;
    }

    this.current.setTextureRegion(this.modifiedTextureRegion, true);*/
  }
}
