export class Vector4 {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0, public w: number = 0) {
  }

  set(x: Vector4 | number, y?: number, z?: number, w?: number): Vector4 {
    if (x instanceof Vector4) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
    } else if (y !== undefined && z !== undefined && w !== undefined) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    } else {
      throw new Error(`Vector.set() - x is number, but no y, z, w provided`);
    }

    return this;
  }

  asArray(): number[] {
    return [this.x, this.y, this.z, this.w];
  }
}
