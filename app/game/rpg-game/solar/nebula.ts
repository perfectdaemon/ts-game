import { IPoolItem } from '../../../engine/helpers/pool/ipool-item';
import { Pool } from '../../../engine/helpers/pool/pool';
import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { GLOBAL } from '../global';
import { SolarBase } from './solar.base';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';

export class Nebula extends SolarBase implements IPoolItem {
  static build(): Nebula {
    const nebula = new Nebula();
    nebula.initialize();
    return nebula;
  }

  active: boolean;

  initialize(): void {
    super.initialize();
    this.sprite = new Sprite();
    const nebulaTextureRegion = GLOBAL.assets.solarAtlas.getRegion('smoke.png');
    this.sprite.setTextureRegion(nebulaTextureRegion, true);
    this.sprite.position.set(0, 0, 1);
  }

  onActivate(): void {
    this.sprite.visible = true;
    const position = new Vector2(renderer.width * Math.random(), renderer.height * Math.random());
    this.sprite.position.set(position);
    this.sprite.rotation = 360 * Math.random();
    this.sprite.setVerticesColor(new Vector4(0.2 * Math.random(), 0.4 * Math.random(), Math.random(), 0.2));
  }

  onDeactivate(): void {
    this.sprite.visible = false;
  }
}

export class NebulaPool extends Pool<Nebula> {
  initialize(): void {
    for (let i = 0; i < 10; ++i) {
      this.get();
    }
  }

  update(deltaTime: number): void {

  }

  render(spriteBatch: SpriteBatch): void {
    let count = 0;
    for (const nebula of this.poolObjects) {
      if (!nebula.active) { continue; }

      nebula.sprite.position.z = 1 + 0.1 * count++;
      spriteBatch.drawSingle(nebula.sprite);
    }
  }
}
