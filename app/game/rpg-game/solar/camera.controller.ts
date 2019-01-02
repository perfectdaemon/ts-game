import { INPUT } from '../../../engine/input/input';
import { Keys } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Camera } from '../../../engine/scene/camera';

export class CameraController {
  private movement: Vector2 = new Vector2();

  constructor(public camera: Camera, public speed: number) { }

  update(deltaTime: number): void {
    this.movement.set(0, 0);

    if (INPUT.isKeyDown[Keys.W] || INPUT.isKeyDown[Keys.Up]) {
      this.movement.addToSelf(0, -1);
    } else if (INPUT.isKeyDown[Keys.S] || INPUT.isKeyDown[Keys.Down]) {
      this.movement.addToSelf(0, 1);
    }

    if (INPUT.isKeyDown[Keys.A] || INPUT.isKeyDown[Keys.Left]) {
      this.movement.addToSelf(-1, 0);
    } else if (INPUT.isKeyDown[Keys.D] || INPUT.isKeyDown[Keys.Right]) {
      this.movement.addToSelf(1, 0);
    }

    this.movement
      .normalize()
      .multiplyNumSelf(deltaTime * this.speed);

    this.camera.position.addToSelf(this.movement);
  }
}
