import { Vector2 } from '../math/vector2';
import { Vector3 } from '../math/vector3';
import { Vector4 } from '../math/vector4';

export class QuadP3T2C4 {
  positions: Vector3[] = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
  texCoords: Vector2[] = [new Vector2(), new Vector2(), new Vector2(), new Vector2()];
  colors: Vector4[] = [
    new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 1),
  ];

  toArray(): number[] {
    return [
      this.positions[0].x, this.positions[0].y, this.positions[0].z,
      this.texCoords[0].x, this.texCoords[0].y,
      this.colors[0].x, this.colors[0].y, this.colors[0].z, this.colors[0].w,

      this.positions[1].x, this.positions[1].y, this.positions[1].z,
      this.texCoords[1].x, this.texCoords[1].y,
      this.colors[1].x, this.colors[1].y, this.colors[1].z, this.colors[1].w,

      this.positions[2].x, this.positions[2].y, this.positions[2].z,
      this.texCoords[2].x, this.texCoords[2].y,
      this.colors[2].x, this.colors[2].y, this.colors[2].z, this.colors[2].w,

      this.positions[3].x, this.positions[3].y, this.positions[3].z,
      this.texCoords[3].x, this.texCoords[3].y,
      this.colors[3].x, this.colors[3].y, this.colors[3].z, this.colors[3].w,
    ];
  }
}
