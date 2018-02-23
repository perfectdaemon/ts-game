export class Vector4 {
  constructor(public x: number, public y: number, public z: number, public w: number) {
  }

  set(x: number, y: number, z: number, w: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  asArray(): number[] {
    return [this.x, this.y, this.z, this.w];
  }
}
