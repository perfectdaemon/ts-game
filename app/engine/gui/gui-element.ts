import { InputEvent } from '../input/input-event';
import { InputType } from '../input/input-type.enum';
import { AABB } from '../math/aabb';
import { IFigure } from '../math/figure.interface';
import { Vector2 } from '../math/vector2';
import { SpriteBatch } from '../render2d/sprite-batch';
import { TextBatch } from '../render2d/text-batch';
import { GuiCallback } from './gui-callback';

/**
 * Base class for GUI element
 */

const emptyFunction = () => { };

export abstract class GuiElement {
  /**
   * Indicates that element has focus and process additional input events
   */
  focused: boolean = false;

  /**
   * Indicates that element is enabled.
   * update() method called only for enabled elements
   */
  enabled: boolean = true;

  /**
   * Indicates element is visible;
   * render() method called only for visible elements
   */
  visible: boolean = true;

  // Input events
  onClick: GuiCallback = emptyFunction;
  onTouchDown: GuiCallback = emptyFunction;
  onTouchUp: GuiCallback = emptyFunction;
  onTouchMove: GuiCallback = emptyFunction;
  onMouseOver: GuiCallback = emptyFunction;
  onMouseOut: GuiCallback = emptyFunction;
  onEnable: GuiCallback = emptyFunction;
  onFocus: GuiCallback = emptyFunction;

  zIndex: number = 0;

  hitBox: IFigure = new AABB();

  protected _isMouseOver: boolean = false;

  isMouseOver(): boolean { return this._isMouseOver; }

  /**
   * Renders gui element itself using provided batches
   * @param spriteBatch Use it to draw element's sprites
   * @param textBatch Use it to draw element's texts
   */
  abstract render(spriteBatch: SpriteBatch, textBatch: TextBatch): void;

  /**
   * Updates element state each frame
   * @param deltaTime Time elapsed from previous frame
   */
  abstract update(deltaTime: number): void;

  /**
   * Callback for receiving input events
   * @param inputEvent InputEvent
   */
  processInput(inputEvent: InputEvent): void {
    let isHit = false;
    switch (inputEvent.inputType) {
      case InputType.TouchDown:
        isHit = this.hitBox.hit(new Vector2(inputEvent.x, inputEvent.y));
        this.focused = isHit;

        if (isHit) {
          this.onTouchDown(this, inputEvent);
        }
        break;

      case InputType.TouchUp:
        isHit = this.hitBox.hit(new Vector2(inputEvent.x, inputEvent.y));
        if (!isHit) { break; }

        this.onTouchUp(this, inputEvent);

        if (this.focused) {
          this.onClick(this, inputEvent);
        }
        break;

      case InputType.TouchMove:
        isHit = this.hitBox.hit(new Vector2(inputEvent.x, inputEvent.y));
        if (isHit) {
          this.onTouchMove(this, inputEvent);
          if (this._isMouseOver) { break; }

          this._isMouseOver = true;
          this.onMouseOver(this, inputEvent);
        } else {
          if (!this._isMouseOver) { break; }

          this._isMouseOver = false;
          this.onMouseOut(this, inputEvent);
        }
        break;

      default:
        break;
    }
  }

  abstract updateHitBox(): void;
}
