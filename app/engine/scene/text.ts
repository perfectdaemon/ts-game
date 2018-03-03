import { isEqual } from '../math/math-base';
import { Vector2 } from '../math/vector2';
import { Vector4 } from '../math/vector4';
import { Node } from './node';

export enum HorizontalAlignment { Left, Center, Right }

export class Text extends Node {
  public text: string;

  public horizontalAlignment: HorizontalAlignment;
  public letterSpacing: number;
  public lineSpacing: number;

  public color: Vector4;
  public scale: number;
  public pivotPoint: Vector2;

  public shadowEnabled: boolean;
  public shadowOffset: Vector2;
  public shadowColor: Vector4;

  private _maxTextWidth: number;
  private _isWrapped: boolean;

  constructor(text: string = '') {
    super();
    this.text = text;
    this.lineSpacing = 2.0;
    this.letterSpacing = 0.0;
    this.color = new Vector4(1, 1, 1, 1);
    this.scale = 1.0;

    this.shadowEnabled = false;
    this.shadowOffset = new Vector2(0, 0);
    this.shadowColor = new Vector4(0, 0, 0, 0.5);

    this.pivotPoint = new Vector2(0, 0);
    this.horizontalAlignment = HorizontalAlignment.Left;
    this._maxTextWidth = 0;
    this._isWrapped = true;
  }

  public free(): void {
    super.free();
  }

  get maxTextWidth(): number { return this._maxTextWidth; }
  set maxTextWidth(width: number) {
    if (isEqual(this._maxTextWidth, width)) { return; }

    this._maxTextWidth = width;
    this._isWrapped = false;
  }

  get isWrapped(): boolean { return this._isWrapped; }
  set isWrapped(value: boolean) { this._isWrapped = value; }

  public renderSelf(): void {
    // nothing;
  }
}
