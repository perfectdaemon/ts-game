import { Pool } from '../pool/pool';
import { SetValueFunc } from './set-value.func';
import { TweenItem } from './tween-item';
import { TweenParams } from './tween-params';

export class TweenManager {
  private readonly _pool: Pool<TweenItem> = new Pool<TweenItem>(() => new TweenItem(), 10);

  /**
   * Updates all active tween items
   * @param deltaTime Time passed since last update(deltaTime) called
   */
  update(deltaTime: number) {
    for (const tweenItem of this._pool.poolObjects) {
      tweenItem.update(deltaTime);
    }
  }

  /**
   * @summary Start new tween animation
   * @returns Promise resolved at tween finish
   */
  async startTweenAsync(setValue: SetValueFunc, params: TweenParams): Promise<void> {
    const tweenItem = this._pool.get();
    return await tweenItem.startAsync(setValue, params);
  }
}
