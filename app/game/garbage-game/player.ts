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
  private moveVector: Vector2 = new Vector2(0, 0);
  private weaponPosition: Vector2 = new Vector2(0, 0);
  private animationTimer: number = 0;
  private flippedX: boolean = false;
  private weaponUpCorrection: number = 0;
  private weaponZ: number = 1;
  private nextPosition: Vector2 = new Vector2(0, 1);

  private weaponShotTimer: number = 0;

  private weaponAbsolutePosition: Vector2 = new Vector2();
  private characterDirection: Vector2 = new Vector2();

  constructor(private input: Input) {
    this.setAnimation();
    this.weapon.parent = this.body;
  }

  onUpdate(deltaTime: number): void {
    this.moveVector.set(0, 0);
    if (this.input.isKeyDown[Keys.Down] || this.input.isKeyDown[Keys.S]) {
      this.currentAnimationYCoord = frameSize * 0;
      this.moveVector.y = 1;

      this.weaponUpCorrection = 6;
      this.weaponZ = 1;
    } else if (this.input.isKeyDown[Keys.Up] || this.input.isKeyDown[Keys.W]) {
      this.currentAnimationYCoord = frameSize * 3;
      this.moveVector.y = -1;

      this.weaponUpCorrection = 12;
      this.weaponZ = -0.5;
    }

    if (this.input.isKeyDown[Keys.Left] || this.input.isKeyDown[Keys.A]) {
      this.currentAnimationYCoord = frameSize * 1;
      this.moveVector.x = -1;

      if (!this.flippedX) {
        this.flippedX = true;
        this.weapon.flipVerticallyCurrentTexCoords();
      }

      this.weaponPosition.x = -32;
    } else if (this.input.isKeyDown[Keys.Right] || this.input.isKeyDown[Keys.D]) {
      this.currentAnimationYCoord = frameSize * 2;
      this.moveVector.x = 1;

      if (this.flippedX) {
        this.flippedX = false;
        this.weapon.flipVerticallyCurrentTexCoords();
      }
      this.weaponPosition.x = 32;
    }

    this.moveVector.normalize();

    if (this.input.isKeyDown[Keys.Space] && this.weaponShotTimer <= 0) {
      GAME_STATE.bulletManager.fire(this.weaponAbsolutePosition, this.characterDirection);
      this.weaponShotTimer = weaponShotTimeout;
    }

    if (this.moveVector.lengthQ() > MathBase.eps) {
      this.characterDirection.set(this.moveVector);
      this.setAnimation();
      this.weapon.rotation = this.moveVector.toAngle() + 90;
      this.weaponPosition.set(32 * this.moveVector.x, this.weaponUpCorrection + 32 * this.moveVector.y);
      this.weapon.position.set(this.weaponPosition.x, this.weaponPosition.y, this.weaponZ);
      this.weaponAbsolutePosition.set(
        this.weaponPosition.x + this.body.position.x,
        this.weaponPosition.y + this.body.position.y);

      // physics
      this.moveVector.multiplyNumSelf(this.speed * deltaTime);
      this.calculateMoveVector();
      this.body.position.addToSelf(this.moveVector);
      this.collider.center.set(this.body.position.x, this.body.position.y);

      // animate movement
      this.animationTimer += deltaTime;
      if (this.animationTimer > animationSpeed) {
        this.animationTimer = 0;
        this.currentAnimationXCoord = (this.currentAnimationXCoord + frameSize) % textureSize[0];
      }
    }
    // check shot timer
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
      .addToSelf(this.moveVector);
    this.nextCollider.center.set(this.nextPosition);

    if (!GAME_STATE.currentLevel.collide(this.nextCollider)) {
      return;
    }

    // try only x
    this.nextPosition.set(this.body.position).addToSelf(this.moveVector.x, 0);
    this.nextCollider.center.set(this.nextPosition);
    if (!GAME_STATE.currentLevel.collide(this.nextCollider)) {
      this.moveVector.y = 0;
      return;
    }

    // try only y
    this.nextPosition.set(this.body.position).addToSelf(0, this.moveVector.y);
    this.nextCollider.center.set(this.nextPosition);
    if (!GAME_STATE.currentLevel.collide(this.nextCollider)) {
      this.moveVector.x = 0;
      return;
    }

    this.moveVector.set(0, 0);
  }
}
