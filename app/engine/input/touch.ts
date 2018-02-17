import { Vector2 } from '../math/vector2';

export class Touch {
  isDown: boolean = false;
  start: Vector2 = new Vector2(0, 0);
  current: Vector2 = new Vector2(0, 0);
}
