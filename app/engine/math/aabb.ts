import { Circle } from './circle';
import { IFigure } from './figure.interface';
import { Vector2 } from './vector2';

/**
 * Axis aligned bounding box
 */
export class AABB implements IFigure {
  public halfSize: Vector2;

  constructor(public center: Vector2 = new Vector2(), size: Vector2 = new Vector2()) {
    this.halfSize = new Vector2(size.x / 2, size.y / 2);
  }

  overlaps(other: AABB | Circle): boolean {
    if (other instanceof AABB) {
      if (Math.abs(this.center.x - other.center.x) > this.halfSize.x + other.halfSize.x) { return false; }
      if (Math.abs(this.center.y - other.center.y) > this.halfSize.y + other.halfSize.y) { return false; }
      return true;
    } else {
      return other.overlaps(this);
    }
  }

  hit(point: Vector2): boolean {
    if (Math.abs(this.center.x - point.x) > this.halfSize.x) { return false; }
    if (Math.abs(this.center.y - point.y) > this.halfSize.y) { return false; }
    return true;
  }
}
