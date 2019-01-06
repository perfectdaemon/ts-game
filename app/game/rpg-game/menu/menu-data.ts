import { Vector2 } from '../../../engine/math/vector2';
import { Vector3 } from '../../../engine/math/vector3';
import { Vector4 } from '../../../engine/math/vector4';

export class MenuData {
  background: any;
  buttons:
    {
      name: string;
      labelText: string;
      labelColor: Vector4;
      labelScale: number;
      labelPivot?: Vector2;
      labelPosition?: Vector2;
      size: Vector2;
      position: Vector3;
      pivotPoint: Vector2;
      verticesColor: Vector4;
      hoverVerticesColor: Vector4;
      textureRegion?: {
        name: string;
        adjustSize: boolean;
      }
    }[];
}
