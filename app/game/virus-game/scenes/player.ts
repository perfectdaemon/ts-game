import { INPUT } from '../../../engine/input/input';
import { Keys } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { IRenderable } from '../../../engine/render2d/render-helper';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';

export class Player implements IRenderable {
  sprite: Sprite;

  velocity: Vector2;

  velocityMultiplier: number;

  colorTimer: number;

  getSpritesToRender(): Sprite[] {
    return [this.sprite];
  }

  getTextsToRender(): Text[] {
    return [];
  }

  initialize(position: Vector2, velocityMultiplier: number): void {
    const textureRegion = GLOBAL.assets.solarAtlas.getRegion('triangle.png');
    this.sprite = new Sprite();
    this.sprite.setTextureRegion(textureRegion, false);
    this.sprite.setSize(16, 16);
    this.sprite.position.set(position, 11);
    this.sprite.setVerticesColor(0.0, 0.0, 1.0, 1.0);
    this.velocityMultiplier = velocityMultiplier;
    this.colorTimer = 0.3;
  }

  update(deltaTime: number): void {
    this.move(deltaTime);
    this.colorMe(deltaTime);
  }

  private move(deltaTime: number): void {
    let { rotation } = this.sprite;

    if (INPUT.isKeyDown[Keys.A]) {
      rotation -= 100 * deltaTime;
    } else if (INPUT.isKeyDown[Keys.D]) {
      rotation += 100 * deltaTime;
    }
    this.sprite.rotation = rotation;
    this.velocity = Vector2.fromAngle(this.sprite.rotation - 90).multiplyNum(this.velocityMultiplier);
    this.sprite.position.addToSelf(this.velocity.multiplyNum(deltaTime));
  }

  private colorMe(deltaTime: number): void {
    this.colorTimer -= deltaTime;
    if (this.colorTimer < 0) {
      this.sprite.setVerticesColor(1, 0, 0, 1);
      this.colorTimer = 0.8;
    } else if (this.colorTimer < 0.4) {
      this.sprite.setVerticesColor(0, 0, 1, 1);
    }
  }
}
