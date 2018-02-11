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

  private _textWidth: number;
  private _isTextWidthChanged: boolean;

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
    this._textWidth = -1;
    this._isTextWidthChanged = false;
  }

  public free(): void {
    super.free();
  }

  get textWidth(): number { return this._textWidth; }
  set textWidth(width: number) {
    if (isEqual(this._textWidth, width)) { return; }

    this._textWidth = width;
    this._isTextWidthChanged = true;
  }

  public renderSelf(): void {
    // nothing;
  }
}
