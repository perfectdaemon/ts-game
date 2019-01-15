import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { Sprite } from '../../../engine/scene/sprite';
import { GLOBAL } from '../global';
import { SolarBase } from './solar.base';

export class Treasure extends SolarBase {
  static buildTreasure(position: Vector2,  cost: number): Treasure {
    const treasure = new Treasure(cost);
    treasure.initialize();
    treasure.sprite.position.set(position);
    return treasure;
  }

  constructor(public cost: number) {
    super();

    const enemyTextureRegion = GLOBAL.assets.solarAtlas.getRegion('circle_bordered.png');

    this.sprite = new Sprite();
    this.sprite.setTextureRegion(enemyTextureRegion, false);
    this.sprite.setVerticesColor(new Vector4(0.5, 0.5, 0.5, 1.0));
    this.sprite.setSize(32 * (1 + this.cost * 2), 32 * (1 + this.cost * 2));
    this.sprite.rotation = 360 * Math.random();
    this.sprite.position.set(0, 0, 25);
  }

  initialize(): void {
    super.initialize();
  }
}
