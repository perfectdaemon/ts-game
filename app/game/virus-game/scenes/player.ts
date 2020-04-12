import { Subscription } from '../../../engine/helpers/event/subscription';
import { INPUT } from '../../../engine/input/input';
import { Keys } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { IRenderable } from '../../../engine/render2d/render-helper';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { GlobalEvents } from '../global.events';
import { InfectedPickedUpEvent } from '../infected-picked-up.event';
import { GAME_SETTINGS } from '../game-settings';

export class Player implements IRenderable {
  sprite: Sprite;

  velocity: Vector2;

  velocityMultiplier: number;

  colorTimer: number;

  pickedUpCount: number;

  pickUp$: Subscription<InfectedPickedUpEvent>;

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
    this.pickedUpCount = 0;

    this.pickUp$ = GlobalEvents.infectedPickedUp.subscribe(event => this.onPickUp(event));
  }

  update(deltaTime: number): void {
    this.move(deltaTime);
    this.colorMe(deltaTime);
  }

  canPickup(): boolean {
    return this.pickedUpCount < GAME_SETTINGS.playerCapacity;
  }

  private onPickUp(event: InfectedPickedUpEvent): void {
    if (event.ambulance !== this) {
      return;
    }

    this.pickedUpCount += 1;
  }

  private move(deltaTime: number): void {
    let { rotation } = this.sprite;

    if (INPUT.isKeyDown[Keys.A]) {
      rotation -= GAME_SETTINGS.playerRotationSpeed * deltaTime;
    } else if (INPUT.isKeyDown[Keys.D]) {
      rotation += GAME_SETTINGS.playerRotationSpeed * deltaTime;
    }
    this.sprite.rotation = rotation;
    this.velocity = Vector2.fromAngle(this.sprite.rotation - 90).multiplyNum(this.velocityMultiplier);
    this.sprite.position.addToSelf(this.velocity.multiplyNum(deltaTime));

    if (this.sprite.position.x < 0) {
      this.sprite.position.x = 0;
    } else if (this.sprite.position.x > renderer.width) {
      this.sprite.position.x = renderer.width;
    }

    if (this.sprite.position.y < 0) {
      this.sprite.position.y = 0;
    } else if (this.sprite.position.y > renderer.height) {
      this.sprite.position.y = renderer.height;
    }
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
