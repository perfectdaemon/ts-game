import { InputEvent } from '../input/input-event';
import { IFigure } from '../math/figure.interface';
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

  hitBox: IFigure;

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
  abstract processInput(inputEvent: InputEvent): void;

  abstract updateHitBox(): void;
}
