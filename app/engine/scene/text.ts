import { Node } from "./node";
import { Vector4 } from "../math/vector4";
import { Vector2 } from "../math/vector2";
import { isEqual } from "../math/math-base";

export enum HorizontalAlignment { Left, Center, Right };

export class Text extends Node {
  private _textWidth: number;
  private _isTextWidthChanged: boolean;

  text: string;

  horizontalAlignment: HorizontalAlignment;
  letterSpacing: number;
  lineSpacing: number;

  color: Vector4;
  scale: number;
  pivotPoint: Vector2;

  shadowEnabled: boolean;
  shadowOffset: Vector2;
  shadowColor: Vector4;

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

  free(): void {
    super.free();
  }

  get textWidth(): number { return this._textWidth; }
  set textWidth(width: number) {
    if (isEqual(this._textWidth, width)) { return; }

    this._textWidth = width;
    this._isTextWidthChanged = true;
  }

  renderSelf(): void {
    // nothing;
  }
}
