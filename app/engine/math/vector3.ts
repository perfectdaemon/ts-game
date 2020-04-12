import { MathBase } from './math-base';
import { Matrix4 } from './matrix4';
import { Vector2 } from './vector2';

export class Vector3 {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) { }

  multiplyNum(num: number): Vector3 {
    return new Vector3(this.x * num, this.y * num, this.z * num);
  }

  multiplyNumSelf(num: number): Vector3 {
    this.x *= num;
    this.y *= num;
    this.z *= num;
    return this;
  }

  multiplyMatSelf(mat: Matrix4): Vector3 {
    this.x = mat.e[0] * this.x + mat.e[4] * this.y + mat.e[8] * this.z + mat.e[12];
    this.y = mat.e[1] * this.x + mat.e[5] * this.y + mat.e[9] * this.z + mat.e[13];
    this.z = mat.e[2] * this.x + mat.e[6] * this.y + mat.e[10] * this.z + mat.e[14];

    return this;
  }

  set(x: number | Vector2 | Vector3, y?: number, z?: number): Vector3 {
    if (x instanceof Vector2) {
      this.x = x.x;
      this.y = x.y;
      this.z = y ?? this.z;
    } else if (x instanceof Vector3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else if (y !== undefined && z !== undefined) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else {
      throw new Error(`Vector3.set(): 'x' is number but no 'y' and 'z' provided`);
    }

    return this;
  }

  length(): number {
    return Math.sqrt(this.lengthQ());
  }

  lengthQ(): number {
    return Math.pow(this.x, 2)
      + Math.pow(this.y, 2)
      + Math.pow(this.z, 2);
  }

  add(vector: Vector3): Vector3 {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  addToSelf(vectorOrX: number | Vector2 | Vector3, y?: number, z?: number): Vector3 {
    if (vectorOrX instanceof Vector2) {
      this.x += vectorOrX.x;
      this.y += vectorOrX.y;
    } else if (vectorOrX instanceof Vector3) {
      this.x += vectorOrX.x;
      this.y += vectorOrX.y;
      this.z += vectorOrX.z;
    } else if (y != null && z != null) {
      this.x += vectorOrX;
      this.y += y;
      this.z += z;
    } else {
      throw new Error('Vector3.addToSelf() first argument is number, but no second and third are provided');
    }

    return this;
  }

  subtract(vector: Vector3): Vector3 {
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  normal(): Vector3 {
    const length = this.length();

    return length < MathBase.eps
      ? new Vector3(0, 0, 0)
      : this.multiplyNum(1 / length);
  }

  normalize(): Vector3 {
    const length = this.length();

    length < MathBase.eps
      ? this.set(0, 0, 0)
      : this.multiplyNumSelf(1 / length);

    return this;
  }

  lerp(finish: Vector3, position: number): Vector3 {
    return finish
      .subtract(this)
      .multiplyNum(position)
      .add(this);
  }

  dot(vector: Vector3): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  cross(vector: Vector3): Vector3 {
    return new Vector3(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x,
    );
  }

  negate(): Vector3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

    return this;
  }

  negateVector(): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  asVector2(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}

export const AXIS_Z: Vector3 = new Vector3(0, 0, 1);
