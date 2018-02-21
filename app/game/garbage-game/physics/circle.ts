import { clamp } from '../../../engine/math/math-base';
import { Vector2 } from '../../../engine/math/vector2';
import { AABB } from './aabb';

export class Circle {
  raduisSquare: number;

  private _closest: Vector2 = new Vector2(0, 0);
  private _distance: Vector2 = new Vector2(0, 0);

  constructor(public center: Vector2, radius: number) {
    this.raduisSquare = radius * radius;
  }

  overlaps(other: Circle | AABB): boolean {
    if (other instanceof Circle) {
      return Math.abs(this.center.lengthQ() - other.center.lengthQ()) < this.raduisSquare + other.raduisSquare;
    } else {

      this._closest.set(
        clamp(this.center.x, other.center.x - other.halfSize.x, other.center.x + other.halfSize.x),
        clamp(this.center.y, other.center.y - other.halfSize.y, other.center.y + other.halfSize.y),
      );

      this._distance.set(this.center.x - this._closest.x, this.center.y - this._closest.y);

      return this._distance.lengthQ() < this.raduisSquare;
    }
  }
}
