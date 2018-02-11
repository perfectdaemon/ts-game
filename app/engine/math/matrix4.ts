import { MathBase } from './math-base';
import { Vector3 } from './vector3';

export class Matrix4 {
  static fromVectorAngle(delta: number, axis: Vector3): Matrix4 {
    const sine = Math.sin(delta);
    const cosine = Math.cos(delta);

    const ic = 1 - cosine;

    const xy = axis.x * axis.y,
      yz = axis.y * axis.z,
      zx = axis.z * axis.x,
      xs = axis.x * sine,
      ys = axis.y * sine,
      zs = axis.z * sine,
      icxy = ic * xy,
      icyz = ic * yz,
      iczx = ic * zx;

    const matrix = new Matrix4();
    matrix.e = [
      ic * axis.x * axis.x + cosine, icxy + zs, iczx - ys, 0,
      icxy - zs, ic * axis.y * axis.y + cosine, icyz + xs, 0,
      iczx + ys, icyz - xs, ic * axis.z * axis.z + cosine, 0,
      0, 0, 0, 1,
    ];

    return matrix;
  }

  public e: number[] = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];

  multiplyMat(other: Matrix4): Matrix4 {
    const result = new Matrix4();
    const a = this;
    const b = other;

    result.e = [
      a.e[0] * b.e[0] + a.e[4] * b.e[1] + a.e[8] * b.e[2] + a.e[12] * b.e[3],
      a.e[1] * b.e[0] + a.e[5] * b.e[1] + a.e[9] * b.e[2] + a.e[13] * b.e[3],
      a.e[2] * b.e[0] + a.e[6] * b.e[1] + a.e[10] * b.e[2] + a.e[14] * b.e[3],
      a.e[3] * b.e[0] + a.e[7] * b.e[1] + a.e[11] * b.e[2] + a.e[15] * b.e[3],
      a.e[0] * b.e[4] + a.e[4] * b.e[5] + a.e[8] * b.e[6] + a.e[12] * b.e[7],
      a.e[1] * b.e[4] + a.e[5] * b.e[5] + a.e[9] * b.e[6] + a.e[13] * b.e[7],
      a.e[2] * b.e[4] + a.e[6] * b.e[5] + a.e[10] * b.e[6] + a.e[14] * b.e[7],
      a.e[3] * b.e[4] + a.e[7] * b.e[5] + a.e[11] * b.e[6] + a.e[15] * b.e[7],
      a.e[0] * b.e[8] + a.e[4] * b.e[9] + a.e[8] * b.e[10] + a.e[12] * b.e[11],
      a.e[1] * b.e[8] + a.e[5] * b.e[9] + a.e[9] * b.e[10] + a.e[13] * b.e[11],
      a.e[2] * b.e[8] + a.e[6] * b.e[9] + a.e[10] * b.e[10] + a.e[14] * b.e[11],
      a.e[3] * b.e[8] + a.e[7] * b.e[9] + a.e[11] * b.e[10] + a.e[15] * b.e[11],
      a.e[0] * b.e[12] + a.e[4] * b.e[13] + a.e[8] * b.e[14] + a.e[12] * b.e[15],
      a.e[1] * b.e[12] + a.e[5] * b.e[13] + a.e[9] * b.e[14] + a.e[13] * b.e[15],
      a.e[2] * b.e[12] + a.e[6] * b.e[13] + a.e[10] * b.e[14] + a.e[14] * b.e[15],
      a.e[3] * b.e[12] + a.e[7] * b.e[13] + a.e[11] * b.e[14] + a.e[15] * b.e[15],
    ];

    return result;
  }

  multiplyMatSelf(other: Matrix4): Matrix4 {
    this.e = this.multiplyMat(other).e;

    return this;
  }

  multiplyVec(vec: Vector3): Vector3 {
    return new Vector3(
      this.e[0] * vec.x + this.e[4] * vec.y + this.e[8] * vec.z + this.e[12],
      this.e[1] * vec.x + this.e[5] * vec.y + this.e[9] * vec.z + this.e[13],
      this.e[2] * vec.x + this.e[6] * vec.y + this.e[10] * vec.z + this.e[14],
    );
  }

  multiplyNum(num: number): Matrix4 {
    const mat = new Matrix4();
    for (let i = 0; i < 16; ++i) {
      mat.e[i] = this.e[i] * num;
    }
    return mat;
  }

  identity(): void {
    this.e = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  }

  ortho(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void {
    this.e = [
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, -2 / (zFar - zNear), 0,
      - (right + left) / (right - left), -(top + bottom) / (top - bottom), -(zFar + zNear) / (zFar - zNear), 1,
    ];
  }

  perspective(fov: number, aspect: number, zNear: number, zFar: number): void {
    fov = Math.min(179.9, Math.max(0, fov));
    const y = zNear * Math.tan(fov * MathBase.deg2rad * 0.5);
    const x = y * aspect;
    this.frustum(-x, x, -y, y, zNear, zFar);
  }

  frustum(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): void {
    this.e = [
      2 * zNear / (right - left), 0, 0, 0,
      0, 2 * zNear / (top - bottom), 0, 0,
      (right + left) / (right - left), (top + bottom) / (top - bottom), (zFar + zNear) / (zNear - zFar), -1,
      0, 0, 2 * zFar * zNear / (zNear - zFar), 0,
    ];
  }

  transpose(): Matrix4 {
    const transposed = new Matrix4();

    for (let row = 0; row < 4; ++row) {
      for (let col = 0; col < 4; ++col) {
        transposed.e[row * 4 + col] = this.e[col * 4 + row];
      }
    }

    return transposed;
  }

  rotate(delta: number, axis: Vector3): void {
    const rotateMatrix = Matrix4.fromVectorAngle(delta, axis);
    this.multiplyMatSelf(rotateMatrix);
  }

  get position(): Vector3 {
    return new Vector3(this.e[12], this.e[13], this.e[14]);
  }

  set position(pos: Vector3) {
    this.e[12] = pos.x;
    this.e[13] = pos.y;
    this.e[14] = pos.z;
  }
}
