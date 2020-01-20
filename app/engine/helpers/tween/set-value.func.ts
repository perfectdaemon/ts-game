import { Vector2 } from '../../math/vector2';
import { Vector3 } from '../../math/vector3';
import { Vector4 } from '../../math/vector4';

export type SetValueFunc = ((value: number) => any)
  | ((value: Vector2) => any)
  | ((value: Vector3) => any)
  | ((value: Vector4) => any);
