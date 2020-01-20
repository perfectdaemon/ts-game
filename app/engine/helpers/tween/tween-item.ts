import { Vector2 } from '../../math/vector2';
import { Vector3 } from '../../math/vector3';
import { Vector4 } from '../../math/vector4';
import { IPoolItem } from '../pool/ipool-item';
import { EasingFunc, easingFunctions } from './easing-func';
import { SetValueFunc } from './set-value.func';
import { TweenParams } from './tween-params';
import { TweenStyle } from './tween-style.enum';

/**
 * Represents tween animation that performs for a while
 */
export class TweenItem implements IPoolItem {
  active: boolean = false;

  private time: number = 0;
  private pauseOnStart: number = 0;
  private duration: number = 0;

  private start: number | Vector2 | Vector3 | Vector4 = 0;
  private finish: number | Vector2 | Vector3 | Vector4 = 0;
  private current: number | Vector2 | Vector3 | Vector4 = 0;

  onActivate(): void {
    this.active = true;
  }

  onDeactivate(): void {
    this.active = false;
    this.tweenFinished();
  }

  /**
   * Starts new tween animation
   * @param setValue Callback with current value parameter that should change something you want to animate
   * @param params Additional parameters for animation including start and finish values, duration and pause on start
   */
  startAsync(setValue: SetValueFunc, params: TweenParams): Promise<void> {
    this.setValue = setValue;

    this.easingFunc = this.getEasingFunc(params.tweenStyle);

    this.start = params.start;
    this.finish = params.finish;
    this.duration = params.duration;
    this.pauseOnStart = params.pauseOnStart;

    this.time = 0;

    if (this.start instanceof Vector2 || params.start instanceof Vector3 || params.start instanceof Vector4) {
      (this.current as any).set(params.start);
    } else {
      this.current = this.start;
    }

    this.onActivate();

    return new Promise(resolve => this.tweenFinished = resolve);
  }

  /**
   * Updates current state of tween item
   * @param deltaTime Time passed since last update(deltaTime) called
   */
  update(deltaTime: number): void {
    if (!this.active) {
      return;
    }

    this.time += deltaTime;

    if (this.start instanceof Vector2 && this.finish instanceof Vector2) {
      (this.current as Vector2).set(
        this.easingFunc(this.start.x, this.finish.x - this.start.x, this.getUnitValue()),
        this.easingFunc(this.start.y, this.finish.y - this.start.y, this.getUnitValue()),
      );
    } else if (this.start instanceof Vector3 && this.finish instanceof Vector3) {
      (this.current as Vector3).set(
        this.easingFunc(this.start.x, this.finish.x - this.start.x, this.getUnitValue()),
        this.easingFunc(this.start.y, this.finish.y - this.start.y, this.getUnitValue()),
        this.easingFunc(this.start.z, this.finish.z - this.start.z, this.getUnitValue()),
      );
    } else if (this.start instanceof Vector4 && this.finish instanceof Vector4) {
      (this.current as Vector4).set(
        this.easingFunc(this.start.x, this.finish.x - this.start.x, this.getUnitValue()),
        this.easingFunc(this.start.y, this.finish.y - this.start.y, this.getUnitValue()),
        this.easingFunc(this.start.z, this.finish.z - this.start.z, this.getUnitValue()),
        this.easingFunc(this.start.w, this.finish.w - this.start.w, this.getUnitValue()),
      );
    } else if (typeof this.start === 'number' && typeof this.finish === 'number') {
      this.current = this.easingFunc(this.start, this.finish - this.start, this.getUnitValue());
    }

    this.setValue(this.current as any);

    if (this.time - this.pauseOnStart >= this.duration) {
      this.time = this.duration + this.pauseOnStart;
      this.onDeactivate();
    }
  }

  private setValue: SetValueFunc = (value: number) => value;

  private easingFunc: EasingFunc = (start, diff, unit) => start;

  private tweenFinished: () => void = () => {};

  private getUnitValue(): number {
    if (this.time <= this.pauseOnStart) {
      return 0;
    }

    if (this.time >= this.duration + this.pauseOnStart) {
      return 1;
    }

    return (this.time - this.pauseOnStart) / this.duration;
  }

  private getEasingFunc(tweenStyle: TweenStyle): EasingFunc {
    switch (tweenStyle) {
      case TweenStyle.ElasticEaseIn: return easingFunctions.elasticEaseIn;
      case TweenStyle.ElasticEaseOut: return easingFunctions.elasticEaseIn;
      case TweenStyle.ExpoEaseIn: return easingFunctions.expoEaseIn;
      case TweenStyle.Bounce: return easingFunctions.elasticEaseIn;
      case TweenStyle.Simple: return easingFunctions.simple;
    }
  }
}
