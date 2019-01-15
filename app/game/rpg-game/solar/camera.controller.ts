import { INPUT } from '../../../engine/input/input';
import { Keys } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Camera } from '../../../engine/scene/camera';
import { GLOBAL } from '../global';
import { SolarBase } from './solar.base';

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

  moveToObject(object: SolarBase, speed: number): void {
    const direction = object.sprite.position
      .asVector2()
      .subtractFromSelf(this.camera.position)
      .normalize()
      .multiplyNumSelf(speed);

    GLOBAL.actionManager.add(dt => {
      this.camera.position.addToSelf(direction.multiplyNum(dt));

      const distance = object.sprite.position.asVector2().subtractFromSelf(this.camera.position).lengthQ();
      return distance < 50 * 50;
    });
  }
}
