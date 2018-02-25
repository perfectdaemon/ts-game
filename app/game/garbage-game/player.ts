import { Input } from '../../engine/input/input';
import { Keys } from '../../engine/input/keys.enum';
import { MathBase } from '../../engine/math/math-base';
import { Vector2 } from '../../engine/math/vector2';
import { Vector3 } from '../../engine/math/vector3';
import { Vector4 } from '../../engine/math/vector4';
import { Sprite } from '../../engine/scene/sprite';
import { SOUNDS } from './audio-manager';
import { BulletOwner } from './bullet-owner.enum';
import { GAME_STATE } from './game-state';
import { Circle } from './physics/circle';

const textureSize = [96, 128];
const frameSize = 32;
const defaultSpeed = 150;
const animationSpeed = 0.1;
const colliderReduceSize = 3;
const weaponShotTimeout = 0.4;
const defaultAccuracy = 0.7;
const defaultHealth = 10;
const defaultHitTimer = 0.1;

export class Player {
  speed: number = defaultSpeed;
  body: Sprite = new Sprite(frameSize * 2, frameSize * 2);
  weapon: Sprite = new Sprite(0, 0, new Vector2(0.5, 1));
  accuracy: number = defaultAccuracy;

  collider: Circle = new Circle(
    new Vector2(this.body.position.x, this.body.position.y),
    this.body.width / 2 - colliderReduceSize);
  nextCollider: Circle = new Circle(
    new Vector2(this.body.position.x, this.body.position.y),
    this.body.width / 2 - colliderReduceSize);

  money: number = 0;
  health: number = defaultHealth;

  private currentAnimationYCoord: number = 0;
  private currentAnimationXCoord: number = 0;
  private animationTimer: number = 0;

  private moveDirection: Vector2 = new Vector2(0, 0);
  private moveIncrement: Vector2 = new Vector2(0, 0);
  private nextPosition: Vector2 = new Vector2(0, 1);

  private weaponFlippedX: boolean = false;
  private weaponFireDirection: Vector2 = new Vector2(0, 0);
  private weaponShotTimer: number = 0;
  private weaponAbsolutePosition: Vector2 = new Vector2();

  private characterViewDirection: Vector2 = new Vector2();

  private verticesColor: Vector4 = new Vector4(1, 1, 1, 1);
  private hitTimer: number = 0;

  private healthElement: HTMLElement;
  private moneyElement: HTMLElement;

  constructor(private input: Input) {
    this.updateAnimation(0.1);
    this.weapon.parent = this.body;
    this.weapon.position.set(0, 15, 2);
    this.healthElement = document.getElementById('hudHealthAmount') as HTMLElement;
    this.moneyElement = document.getElementById('hudMoneyAmount') as HTMLElement;
  }

  hit(damage: number): void {
    GAME_STATE.audioManager.play(SOUNDS.hit);
    this.health -= damage;

    this.hitTimer = defaultHitTimer;
    this.verticesColor.set(1, 0.5, 0.5, 0.5);
    this.body.setVerticesColor(this.verticesColor);

    if (this.health <= 0) {
      console.log('dieeeee');
    }
  }

  drawHud(): void {
    this.healthElement.innerHTML = this.health.toString();
    this.moneyElement.innerHTML = this.money.toString();
  }

  onMouseMove(mousePosition: Vector2): void {
    this.characterViewDirection
      .set(mousePosition)
      .subtractFromSelf(this.body.position)
      .normalize();
  }

  onUpdate(deltaTime: number): void {
    this.updateMovement(deltaTime);

    this.updateFire(deltaTime);

    this.updateWeaponAppearance();

    if (this.moveDirection.lengthQ() > MathBase.eps) {
      this.updateAnimation(deltaTime);

      // physics
      this.moveDirection.multiplyNumSelf(this.speed * deltaTime);
      this.calculateMoveVector();
      this.body.position.addToSelf(this.moveDirection);
      this.collider.center.set(this.body.position.x, this.body.position.y);
    }

    this.drawHud();

    this.updateHit(deltaTime);
  }

  private updateHit(deltaTime: number): void {
    if (this.hitTimer > 0) {
      this.hitTimer -= deltaTime;

      if (this.hitTimer <= 0) {
        this.verticesColor.set(1, 1, 1, 1);
        this.body.setVerticesColor(this.verticesColor);
      }
    }
  }

  private updateMovement(deltaTime: number): void {
    this.moveDirection.set(0, 0);
    if (this.input.isKeyDown[Keys.Down] || this.input.isKeyDown[Keys.S]) {
      this.currentAnimationYCoord = frameSize * 0;
      this.moveDirection.y = 1;
      this.weapon.position.z = 1;
    } else if (this.input.isKeyDown[Keys.Up] || this.input.isKeyDown[Keys.W]) {
      this.currentAnimationYCoord = frameSize * 3;
      this.moveDirection.y = -1;
      this.weapon.position.z = -0.5;
    }

    if (this.input.isKeyDown[Keys.Left] || this.input.isKeyDown[Keys.A]) {
      this.currentAnimationYCoord = frameSize * 1;
      this.moveDirection.x = -1;
      this.weapon.position.z = 1;
    } else if (this.input.isKeyDown[Keys.Right] || this.input.isKeyDown[Keys.D]) {
      this.currentAnimationYCoord = frameSize * 2;
      this.moveDirection.x = 1;
      this.weapon.position.z = 1;
    }

    this.moveDirection.normalize();
  }

  private updateWeaponAppearance(): void {
    this.weaponAbsolutePosition.set(this.weapon.position).addToSelf(this.body.position);
    this.weapon.rotation = this.characterViewDirection.toAngle() + 90;
    if ((this.weapon.rotation < 0 || this.weapon.rotation > 180) && !this.weaponFlippedX) {
      this.weaponFlippedX = true;
      this.weapon.flipVerticallyCurrentTexCoords();
    } else if (this.weapon.rotation > 0 && this.weapon.rotation < 180 && this.weaponFlippedX) {
      this.weaponFlippedX = false;
      this.weapon.flipVerticallyCurrentTexCoords();
    }
  }

  private updateFire(deltaTime: number) {
    if (this.input.touches[1].isDown && this.weaponShotTimer <= 0) {

      this.weaponFireDirection
        .set(-this.characterViewDirection.y, this.characterViewDirection.x)
        .multiplyNumSelf(0.5 - Math.random())
        .multiplyNumSelf(1 - this.accuracy)
        .addToSelf(this.characterViewDirection);
      GAME_STATE.bulletManager.fire(this.weaponAbsolutePosition, this.weaponFireDirection, BulletOwner.Player);
      this.weaponShotTimer = weaponShotTimeout;

      GAME_STATE.audioManager.play(SOUNDS.shoot);
    }

    if (this.weaponShotTimer > 0) {
      this.weaponShotTimer -= deltaTime;
    }
  }

  private updateAnimation(deltaTime: number) {
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

    // animate movement
    this.animationTimer += deltaTime;
    if (this.animationTimer > animationSpeed) {
      this.animationTimer = 0;
      this.currentAnimationXCoord = (this.currentAnimationXCoord + frameSize) % textureSize[0];
    }
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
