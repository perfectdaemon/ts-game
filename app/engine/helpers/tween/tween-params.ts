import { Vector2 } from '../../math/vector2';
import { Vector3 } from '../../math/vector3';
import { Vector4 } from '../../math/vector4';
import { TweenStyle } from './tween-style.enum';

export class TweenParams {
  tweenStyle: TweenStyle;
  start: number | Vector2 | Vector3 | Vector4;
  finish: number | Vector2 | Vector3 | Vector4;
  duration: number;
  pauseOnStart: number = 0;
}
