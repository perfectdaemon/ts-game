import { Vector2 } from '../../math/vector2';
import { Vector3 } from '../../math/vector3';
import { Vector4 } from '../../math/vector4';
import { Pool } from '../pool/pool';
import { TweenItem } from './tween-item';
import { TweenStyle } from './tween-style.enum';

export class Tweener {
  private _pool: Pool<TweenItem> = new Pool<TweenItem>(() => new TweenItem(), 10);

  update(deltaTime: number) {
    for (const tweenItem of this._pool.poolObjects) {
      tweenItem.update(deltaTime);
    }
  }

  addTween(
    setValue: (value: number | Vector2 | Vector3 | Vector4) => void, tweenStyle: TweenStyle,
    start: number | Vector2 | Vector3 | Vector4, finish: number | Vector2 | Vector3 | Vector4,
    duration: number, pauseOnStart: number = 0,
  ): void {
    const tweenItem = this._pool.get();
    tweenItem.refresh(setValue, tweenStyle, start, finish, duration, pauseOnStart);
  }
}
