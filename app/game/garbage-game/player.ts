import { Input } from '../../engine/input/input';
import { Keys } from '../../engine/input/keys.enum';
import { Vector2 } from '../../engine/math/vector2';
import { Vector3 } from '../../engine/math/vector3';
import { Sprite } from '../../engine/scene/sprite';
import { MathBase } from '../../engine/math/math-base';

const textureSize = [96, 128];
const frameSize = 32;
const defaultSpeed = 25;
const animationSpeed = 0.5;

export class Player {
  speed: number = defaultSpeed;
  body: Sprite = new Sprite(frameSize * 2, frameSize * 2);
  weapon: Sprite = new Sprite();

  private currentAnimationYCoord: number = 0;
  private currentAnimationXCoord: number = 0;
  private moveVector: Vector2 = new Vector2(0, 0);
  private weaponPosition: Vector2 = new Vector2(0, 0);
  private animationTimer: number = 0;
  private flippedX: boolean = false;
  private weaponUpCorrection: number = 0;
  private weaponZ: number = 1;

  constructor(private input: Input) {
    this.setAnimation();
    this.weapon.parent = this.body;
  }

  onUpdate(deltaTime: number): void {
    this.moveVector.set(0, 0);
    if (this.input.isKeyDown[Keys.Down] || this.input.isKeyDown[Keys.S]) {
      this.currentAnimationYCoord = frameSize * 0;
      this.moveVector.y = 1;
      this.setAnimation();
      this.weaponUpCorrection = 6;
      this.weaponZ = 1;
    } else if (this.input.isKeyDown[Keys.Up] || this.input.isKeyDown[Keys.W]) {
      this.currentAnimationYCoord = frameSize * 3;
      this.moveVector.y = -1;
      this.setAnimation();
      this.weaponUpCorrection = 12;
      this.weaponZ = -0.5;
    }

    if (this.input.isKeyDown[Keys.Left] || this.input.isKeyDown[Keys.A]) {
      this.currentAnimationYCoord = frameSize * 1;
      this.moveVector.x = -1;
      this.setAnimation();
      if (!this.flippedX) {
        this.flippedX = true;
        this.weapon.flipVerticallyCurrentTexCoords();
      }

      this.weaponPosition.x = -32;
    } else if (this.input.isKeyDown[Keys.Right] || this.input.isKeyDown[Keys.D]) {
      this.currentAnimationYCoord = frameSize * 2;
      this.moveVector.x = 1;
      this.setAnimation();
      if (this.flippedX) {
        this.flippedX = false;
        this.weapon.flipVerticallyCurrentTexCoords();
      }
      this.weaponPosition.x = 32;
    }

    this.moveVector.normalize();
    if (this.moveVector.lengthQ() > MathBase.eps) {
      this.weapon.rotation = this.moveVector.toAngle() + 90;
      this.weaponPosition.set(32 * this.moveVector.x, this.weaponUpCorrection + 32 * this.moveVector.y);
      this.weapon.position.set(this.weaponPosition.x, this.weaponPosition.y, this.weaponZ);
    }

    this.moveVector.multiplyNumSelf(this.speed * deltaTime);
    this.body.position.addVector2ToSelf(this.moveVector);
    this.animationTimer += deltaTime;
    if (this.animationTimer > animationSpeed) {
      this.animationTimer = 0;
      this.currentAnimationXCoord = (this.currentAnimationXCoord + frameSize) % textureSize[0];
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
}
