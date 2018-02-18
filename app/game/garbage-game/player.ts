import { Input } from '../../engine/input/input';
import { Keys } from '../../engine/input/keys.enum';
import { Vector2 } from '../../engine/math/vector2';
import { Vector3 } from '../../engine/math/vector3';
import { Sprite } from '../../engine/scene/sprite';

const textureSize = [96, 128];
const frameSize = 32;
const defaultSpeed = 25;
const animationSpeed = 0.5;

export class Player {
  speed: number = defaultSpeed;
  body: Sprite = new Sprite(frameSize * 2, frameSize * 2);

  private currentAnimationYCoord: number = 0;
  private currentAnimationXCoord: number = 0;
  private moveVector: Vector3 = new Vector3(0, 0, 0);
  private animationTimer: number = 0;

  constructor(private input: Input) {
    this.setAnimation();
  }

  onUpdate(deltaTime: number): void {
    this.moveVector.set(0, 0, 0);
    if (this.input.isKeyDown[Keys.Down]) {
      this.currentAnimationYCoord = frameSize * 0;
      this.moveVector.y = 1;
      this.setAnimation();
    } else if (this.input.isKeyDown[Keys.Up]) {
      this.currentAnimationYCoord = frameSize * 3;
      this.moveVector.y = -1;
      this.setAnimation();
    }
    if (this.input.isKeyDown[Keys.Left]) {
      this.currentAnimationYCoord = frameSize * 1;
      this.moveVector.x = -1;
      this.setAnimation();
    } else if (this.input.isKeyDown[Keys.Right]) {
      this.currentAnimationYCoord = frameSize * 2;
      this.moveVector.x = 1;
      this.setAnimation();
    }

    this.moveVector.normalize().multiplyNumSelf(this.speed * deltaTime);
    this.body.position.addToSelf(this.moveVector);
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
