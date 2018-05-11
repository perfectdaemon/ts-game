import { InputEvent } from '../input/input-event';
import { SpriteBatch } from '../render2d/sprite-batch';
import { TextBatch } from '../render2d/text-batch';

/**
 * Base class for GUI element
 */
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
}
