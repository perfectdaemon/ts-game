import { InputType } from './input-type.enum';
import { Keys } from './keys.enum';

export class InputEvent {
  private _initialized: boolean = false;

  constructor(
    public inputType: InputType, public key: Keys,
    public x: number, public y: number, public w: number,
  ) {
    this._initialized = true;
  }

  reset(
    inputType: InputType, key: Keys,
    x: number, y: number, w: number,
  ) {
    this.inputType = inputType;
    this.key = key;
    this.x = x;
    this.y = y;
    this.w = w;
    this._initialized = true;
  }
}
