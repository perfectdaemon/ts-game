import { Vector2 } from '../../math/vector2';
import { Vector3 } from '../../math/vector3';
import { Vector4 } from '../../math/vector4';
import { IPoolItem } from '../pool/ipool-item';
import { EasingFunc, easingFunctions } from './easing-func';
import { TweenStyle } from './tween-style.enum';

export class TweenItem implements IPoolItem {
  active: boolean = false;

  time: number = 0;
  pauseOnStart: number = 0;
  duration: number = 0;

  start: number | Vector2 | Vector3 | Vector4 = 0;
  finish: number | Vector2 | Vector3 | Vector4 = 0;
  current: number | Vector2 | Vector3 | Vector4 = 0;
  setValue: (value: number | Vector2 | Vector3 | Vector4) => void = (value) => value;
  easingFunc: EasingFunc = (start, diff, unit) => start;

  onActivate(): void {
    this.active = true;
  }

  onDeactivate(): void {
    this.active = false;
  }

  refresh(
    setValue: (value: number | Vector2 | Vector3 | Vector4) => void,
    tweenStyle: TweenStyle,
    start: number | Vector2 | Vector3 | Vector4,
    finish: number | Vector2 | Vector3 | Vector4,
    duration: number, pauseOnStart: number = 0,
  ): void {
    this.setValue = setValue;
    this.easingFunc = this.getEasingFunc(tweenStyle);
    this.start = start;
    if (start instanceof Vector2 || start instanceof Vector3 || start instanceof Vector4) {
      (this.current as any).set(start);
    } else {
      this.current = this.start;
    }

    this.finish = finish;
    this.duration = duration;
    this.pauseOnStart = pauseOnStart;

    this.time = 0;

    this.onActivate();
  }

  getUnitValue(): number {
    if (this.time <= this.pauseOnStart) {
      return 0;
    }

    if (this.time >= this.duration + this.pauseOnStart) {
      return 1;
    }

    return (this.time - this.pauseOnStart) / this.duration;
  }

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

    this.setValue(this.current);

    if (this.time - this.pauseOnStart >= this.duration) {
      this.time = this.duration + this.pauseOnStart;
      this.onDeactivate();
    }
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
