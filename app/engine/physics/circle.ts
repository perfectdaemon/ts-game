import { clamp } from '../math/math-base';
import { Vector2 } from '../math/vector2';
import { AABB } from './aabb';

export class Circle {
  raduisSquare: number = 0;

  private _radius: number = 0;
  private _closest: Vector2 = new Vector2();
  private _distance: Vector2 = new Vector2();

  constructor(public center: Vector2, radius: number) {
    this.radius = radius;
  }

  get radius(): number { return this._radius; }
  set radius(value: number) {
    this.raduisSquare = value * value;
    this._radius = value;
  }

  overlaps(other: Circle | AABB): boolean {
    if (other instanceof Circle) {
      this._distance
        .set(this.center)
        .subtractFromSelf(other.center);
      return Math.abs(this._distance.lengthQ()) < this.raduisSquare + other.raduisSquare;
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
