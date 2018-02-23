import { Input } from '../../engine/input/input';
import { Keys } from '../../engine/input/keys.enum';
import { MathBase } from '../../engine/math/math-base';
import { Vector2 } from '../../engine/math/vector2';
import { Vector3 } from '../../engine/math/vector3';
import { Sprite } from '../../engine/scene/sprite';
import { GAME_STATE } from './game-state';
import { Circle } from './physics/circle';

const textureSize = [96, 128];
const frameSize = 32;
const defaultSpeed = 150;
const animationSpeed = 0.1;
const colliderReduceSize = 3;
const weaponShotTimeout = 0.4;

export class Player {
  speed: number = defaultSpeed;
  body: Sprite = new Sprite(frameSize * 2, frameSize * 2);
  weapon: Sprite = new Sprite();

  collider: Circle = new Circle(
    new Vector2(this.body.position.x, this.body.position.y),
    this.body.width / 2 - colliderReduceSize);
  nextCollider: Circle = new Circle(
    new Vector2(this.body.position.x, this.body.position.y),
    this.body.width / 2 - colliderReduceSize);

  private currentAnimationYCoord: number = 0;
  private currentAnimationXCoord: number = 0;
  private animationTimer: number = 0;

  private moveDirection: Vector2 = new Vector2(0, 0);
  private moveIncrement: Vector2 = new Vector2(0, 0);
  private nextPosition: Vector2 = new Vector2(0, 1);

  private weaponFlippedX: boolean = false;
  private weaponPosition: Vector2 = new Vector2(0, 0);
  private weaponUpCorrection: number = 0;
  private weaponZ: number = 1;
  private weaponShotTimer: number = 0;
  private weaponAbsolutePosition: Vector2 = new Vector2();

  private characterViewDirection: Vector2 = new Vector2();

  constructor(private input: Input) {
    this.setAnimation();
    this.weapon.parent = this.body;
  }

  hit(damage: number): void {
    console.log(`hit by ${damage} points`);
  }

  onUpdate(deltaTime: number): void {
    this.updateMovement(deltaTime);

    this.updateFire(deltaTime);

    if (this.moveDirection.lengthQ() > MathBase.eps) {
      this.characterViewDirection.set(this.moveDirection);
      this.setAnimation();
      this.weapon.rotation = this.moveDirection.toAngle() + 90;
      this.weaponPosition.set(32 * this.moveDirection.x, this.weaponUpCorrection + 32 * this.moveDirection.y);
      this.weapon.position.set(this.weaponPosition.x, this.weaponPosition.y, this.weaponZ);
      this.weaponAbsolutePosition.set(
        this.weaponPosition.x + this.body.position.x,
        this.weaponPosition.y + this.body.position.y);

      // physics
      this.moveDirection.multiplyNumSelf(this.speed * deltaTime);
      this.calculateMoveVector();
      this.body.position.addToSelf(this.moveDirection);
      this.collider.center.set(this.body.position.x, this.body.position.y);

      // animate movement
      this.animationTimer += deltaTime;
      if (this.animationTimer > animationSpeed) {
        this.animationTimer = 0;
        this.currentAnimationXCoord = (this.currentAnimationXCoord + frameSize) % textureSize[0];
      }
    }
  }

  private updateMovement(deltaTime: number): void {
    this.moveDirection.set(0, 0);
    if (this.input.isKeyDown[Keys.Down] || this.input.isKeyDown[Keys.S]) {
      this.currentAnimationYCoord = frameSize * 0;
      this.moveDirection.y = 1;

      this.weaponUpCorrection = 6;
      this.weaponZ = 1;
    } else if (this.input.isKeyDown[Keys.Up] || this.input.isKeyDown[Keys.W]) {
      this.currentAnimationYCoord = frameSize * 3;
      this.moveDirection.y = -1;

      this.weaponUpCorrection = 12;
      this.weaponZ = -0.5;
    }

    if (this.input.isKeyDown[Keys.Left] || this.input.isKeyDown[Keys.A]) {
      this.currentAnimationYCoord = frameSize * 1;
      this.moveDirection.x = -1;

      if (!this.weaponFlippedX) {
        this.weaponFlippedX = true;
        this.weapon.flipVerticallyCurrentTexCoords();
      }

      this.weaponPosition.x = -32;
    } else if (this.input.isKeyDown[Keys.Right] || this.input.isKeyDown[Keys.D]) {
      this.currentAnimationYCoord = frameSize * 2;
      this.moveDirection.x = 1;

      if (this.weaponFlippedX) {
        this.weaponFlippedX = false;
        this.weapon.flipVerticallyCurrentTexCoords();
      }
      this.weaponPosition.x = 32;
    }

    this.moveDirection.normalize();
  }

  private updateFire(deltaTime: number) {
    if (this.input.isKeyDown[Keys.Space] && this.weaponShotTimer <= 0) {
      GAME_STATE.bulletManager.fire(this.weaponAbsolutePosition, this.characterViewDirection);
      this.weaponShotTimer = weaponShotTimeout;
    }

    if (this.weaponShotTimer > 0) {
      this.weaponShotTimer -= deltaTime;
    }
  }

  private setAnimation() {
    this.body.setTextureCoords([
      (this.currentAnimationXCoord + frameSize) / textureSize[0],
      (this.currentAnimationYCoord + frameSize) / textureSize[1],

      (this.currentAnimationXCoord + frameSize) / textureSize[0],
      this.currentAnimationYCoord / textureSize[1],

      this.currentAnimationXCoord / textureSize[0],
      this.currentAnimationYCoord / textureSize[1],

      this.currentAnimationXCoord / textureSize[0],
      (this.currentAnimationYCoord + frameSize) / textureSize[1],
    ]);
  }

  private calculateMoveVector(): void {
    // try both
    this.nextPosition
      .set(this.body.position)
      .addToSelf(this.moveDirection);
    this.nextCollider.center.set(this.nextPosition);

    if (!GAME_STATE.currentLevel.collide(this.nextCollider)) {
      return;
    }

    // try only x
    this.nextPosition.set(this.body.position).addToSelf(this.moveDirection.x, 0);
    this.nextCollider.center.set(this.nextPosition);
    if (!GAME_STATE.currentLevel.collide(this.nextCollider)) {
      this.moveDirection.y = 0;
      return;
    }

    // try only y
    this.nextPosition.set(this.body.position).addToSelf(0, this.moveDirection.y);
    this.nextCollider.center.set(this.nextPosition);
    if (!GAME_STATE.currentLevel.collide(this.nextCollider)) {
      this.moveDirection.x = 0;
      return;
    }

    this.moveDirection.set(0, 0);
  }
}
