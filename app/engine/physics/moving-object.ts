import { AABB } from '../math/aabb';
import { Vector2 } from '../math/vector2';

export class MovingObject {
  oldPosition: Vector2 = new Vector2(0, 0);
  position: Vector2 = new Vector2(0, 0);

  oldSpeed: Vector2 = new Vector2(0, 0);
  speed: Vector2 = new Vector2(0, 0);

  scale: Vector2 = new Vector2(1, 1);

  aabb: AABB;
  aabbOffset: Vector2 = new Vector2(0, 0);

  update(deltaTime: number) {
    this.oldPosition.set(this.position);
    this.oldSpeed.set(this.speed);

    this.position.addToSelf(this.speed.multiplyNum(deltaTime));
    this.aabb.center.set(this.position.x + this.aabbOffset.x, this.position.y + this.aabbOffset.y);
  }
}
