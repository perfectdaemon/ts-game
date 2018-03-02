import { isEqual, MathBase } from './math-base';
import { Vector3 } from './vector3';

export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) { }

  set(x: number | Vector2 | Vector3, y?: number): Vector2 {
    if (x instanceof Vector2 || x instanceof Vector3) {
      this.x = x.x;
      this.y = x.y;
    } else if (y !== undefined) {
      this.x = x;
      this.y = y;
    } else {
      throw new Error(`Vector2.set(): 'x' is number, but no 'y' provided`);
    }

    return this;
  }

  equalTo(other: Vector2): boolean {
    return isEqual(this.x, other.x) && isEqual(this.y, other.y);
  }

  toAngle(): number {
    return Math.atan2(this.y, this.x) * MathBase.rad2deg;
  }

  lengthQ(): number {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2);
  }

  length(): number {
    return Math.sqrt(this.lengthQ());
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  addToSelf(x: Vector2 | Vector3 | number, y?: number): Vector2 {
    if (x instanceof Vector2 || x instanceof Vector3) {
      this.x += x.x;
      this.y += x.y;
    } else if (y !== undefined) {
      this.x += x;
      this.y += y;
    } else {
      throw new Error(`Vector2.addToSelf(): 'x' is number but no 'y' provided`);
    }

    return this;
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  subtractFromSelf(x: Vector2 | Vector3 | number, y?: number): Vector2 {
    if (x instanceof Vector2 || x instanceof Vector3) {
    this.x -= x.x;
    this.y -= x.y;
    } else if (y !== undefined) {
      this.x -= x;
      this.y -= y;
    } else {
      throw new Error(`Vector2.subtractFromSelf(): 'x' is number but no 'y' provided`);
    }

    return this;
  }

  multiplyNum(value: number) {
    return new Vector2(this.x * value, this.y * value);
  }

  multiplyNumSelf(num: number): Vector2 {
    this.x *= num;
    this.y *= num;
    return this;
  }

  normal(): Vector2 {
    const length = this.length();

    return length < MathBase.eps
      ? new Vector2(0, 0)
      : this.multiplyNum(1 / length);
  }

  normalize(): Vector2 {
    const length = this.length();

    length < MathBase.eps
      ? this.set(0, 0)
      : this.multiplyNumSelf(1 / length);

    return this;
  }

  toString(): string {
    return `x: ${this.x}, y:${this.y}`;
  }
}
