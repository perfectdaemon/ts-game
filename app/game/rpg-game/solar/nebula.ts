import { IPoolItem } from '../../../engine/helpers/pool/ipool-item';
import { Pool } from '../../../engine/helpers/pool/pool';
import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { IRenderable } from '../render-helper';
import { SolarBase } from './solar.base';

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
    const position = new Vector2(
      -1.5 * renderer.width + 3 * renderer.width * Math.random(),
      -1.5 * renderer.height + 3 * renderer.height * Math.random());
    this.sprite.position.set(position);
    this.sprite.rotation = 360 * Math.random();
    this.sprite.setVerticesColor(new Vector4(0.2 * Math.random(), 0.4 * Math.random(), Math.random(), 0.2));
  }

  onDeactivate(): void {
    this.sprite.visible = false;
  }
}

export class NebulaPool extends Pool<Nebula> implements IRenderable {
  initialize(): void {
    for (let i = 0; i < 64; ++i) {
      this.get();
    }
  }

  update(deltaTime: number): void {

  }

  getSpritesToRender(): Sprite[] {
    const result: Sprite[] = [];
    let count = 0;
    for (const nebula of this.poolObjects) {
      if (!nebula.active) { continue; }

      nebula.sprite.position.z = 1 + 0.1 * count++;
      result.push(nebula.sprite);
    }

    return result;
  }

  getTextsToRender(): Text[] {
    return [];
  }
}
