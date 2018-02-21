import { Vector2 } from "../../../engine/math/vector2";
import { AABB } from "./aabb";

export class MovingObject {
  oldPosition: Vector2;
  position: Vector2;

  oldSpeed: Vector2;
  speed: Vector2;

  scale: Vector2;

  aabb: AABB;
  aabbOffset: Vector2;

  update(deltaTime: number) {
    this.oldPosition = this.position;
    this.oldSpeed = this.speed;

    this.position.addToSelf(this.speed.multiplyNum(deltaTime));
    this.aabb.center.set(this.position.x + this.aabbOffset.x, this.position.y + this.aabbOffset.y);
  }
}
