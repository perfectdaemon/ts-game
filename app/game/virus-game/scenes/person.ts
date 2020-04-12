import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { IRenderable } from '../../../engine/render2d/render-helper';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GAME_SETTINGS } from '../game-settings';
import { GLOBAL } from '../global';
import { GlobalEvents } from '../global.events';
import { InfectedDiedEvent } from '../infected-died.event';
import { PersonStatus } from './person-status';

export class Person implements IRenderable {
  getSpritesToRender(): Sprite[] {
    return [this.sprite];
  }

  getTextsToRender(): Text[] {
    return [];
  }

  sprite: Sprite;

  status: PersonStatus;

  regionTopLeft: Vector2;

  regionBottomRight: Vector2;

  velocity: Vector2;

  timeToChangeDirection: number;

  timeToChangeDirectionCounter: number;

  velocityMultiplier: number;

  timerToDie: number;

  private centerPosition = new Vector2(renderer.width / 2, renderer.height / 2);

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

    this.status = PersonStatus.NotInfected;
  }

  update(deltaTime: number): void {
    if (this.status === PersonStatus.Dead) {
      return;
    }

    this.move(deltaTime);

    this.timeToChangeDirectionCounter -= deltaTime;
    if (this.timeToChangeDirectionCounter < 0) {
      this.timeToChangeDirectionCounter = this.timeToChangeDirection;
      this.changeDirection();
    }

    this.checkRegion();

    if (this.status === PersonStatus.Infected) {
      this.timerToDie -= deltaTime;

      if (this.timerToDie < 0) {
        const isDead = Math.random() <= GAME_SETTINGS.infectedDeathChance;

        if (isDead) {
          this.setDead();
        } else {
          this.setCured();
        }
      }
    }
  }

  setInfected(): void {
    this.status = PersonStatus.Infected;
    this.sprite.setVerticesColor(1, 0.1, 0.1, 1.0);
    this.timerToDie = Math.random() * (GAME_SETTINGS.infectedTimeToDeathOrCure.y - GAME_SETTINGS.infectedTimeToDeathOrCure.x)
      + GAME_SETTINGS.infectedTimeToDeathOrCure.x;
  }

  setCured(): void {
    this.status = PersonStatus.Cured;
    this.sprite.setVerticesColor(0.1, 1.0, 0.1, 1.0);
  }

  setDead(): void {
    this.status = PersonStatus.Dead;
    this.sprite.setVerticesColor(0.1, 0.1, 0.1, 1.0);
    GlobalEvents.infectedDied.next(new InfectedDiedEvent(this));
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
      const newDirection = this.sprite.position.asVector2().subtract(this.centerPosition).toAngle() - 90;
      this.timeToChangeDirectionCounter = this.timeToChangeDirection;
      this.changeDirection(newDirection);
    }
  }
}
