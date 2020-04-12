import { Vector2 } from '../../../engine/math/vector2';
import { IRenderable } from '../../../engine/render2d/render-helper';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { GlobalEvents } from '../global.events';
import { InfectedDiedEvent } from '../infected-died.event';

export class Person implements IRenderable {
  getSpritesToRender(): Sprite[] {
    return [this.sprite];
  }

  getTextsToRender(): Text[] {
    return [];
  }

  sprite: Sprite;

  isInfected: boolean;

  isDead: boolean;

  regionTopLeft: Vector2;

  regionBottomRight: Vector2;

  velocity: Vector2;

  timeToChangeDirection: number;

  timeToChangeDirectionCounter: number;

  velocityMultiplier: number;

  timerToDie: number;

  initialize(regionTopLeft: Vector2, regionBottomRight: Vector2, velocityMultiplier: number): void {
    const textureRegion = GLOBAL.assets.solarAtlas.getRegion('triangle.png');

    this.sprite = new Sprite();
    this.sprite.setTextureRegion(textureRegion, false);
    this.sprite.setSize(16, 16);
    this.sprite.position.set(
      regionTopLeft.x + Math.random() * (regionBottomRight.x - regionTopLeft.x),
      regionTopLeft.y + Math.random() * (regionBottomRight.y - regionTopLeft.y),
      10,
    );

    this.regionTopLeft = regionTopLeft;
    this.regionBottomRight = regionBottomRight;
    this.velocityMultiplier = velocityMultiplier;

    this.changeDirection();

    this.timeToChangeDirection = 3 + 3 * Math.random();
    this.timeToChangeDirectionCounter = this.timeToChangeDirection;

    this.isDead = false;
  }

  update(deltaTime: number): void {
    if (this.isDead) {
      return;
    }

    this.move(deltaTime);

    this.timeToChangeDirectionCounter -= deltaTime;
    if (this.timeToChangeDirectionCounter < 0) {
      this.timeToChangeDirectionCounter = this.timeToChangeDirection;
      this.changeDirection();
    }

    this.checkRegion();

    if (this.isInfected) {
      this.timerToDie -= deltaTime;

      if (this.timerToDie < 0) {
        this.isDead = true;
        this.sprite.setVerticesColor(0.1, 0.1, 0.1, 1.0);
        GlobalEvents.infectedDied.next(new InfectedDiedEvent(this));
      }
    }
  }

  setInfected(): void {
    this.isInfected = true;
    this.sprite.setVerticesColor(1, 0.1, 0.1, 1.0);
    this.timerToDie = 7 + 7 * Math.random();
  }

  setCured(): void {
    this.isInfected = false;
    this.sprite.setVerticesColor(0.1, 1.0, 0.1, 1.0);
  }

  private move(deltaTime: number): void {
    this.sprite.position.addToSelf(this.velocity.multiplyNum(deltaTime));
  }

  private changeDirection(rotation?: number): void {
    this.sprite.rotation = rotation ?? 360 * Math.random();
    this.velocity = Vector2.fromAngle(this.sprite.rotation - 90).multiplyNum(this.velocityMultiplier);
  }

  private checkRegion(): void {
    if (this.sprite.position.x < this.regionTopLeft.x
      || this.sprite.position.x > this.regionBottomRight.x
      || this.sprite.position.y < this.regionTopLeft.y
      || this.sprite.position.y > this.regionBottomRight.y) {
      const newDirection = this.sprite.position.asVector2().subtract(new Vector2(500, 400)).toAngle() - 90;
      this.timeToChangeDirectionCounter = this.timeToChangeDirection;
      this.changeDirection(newDirection);
    }
  }
}
