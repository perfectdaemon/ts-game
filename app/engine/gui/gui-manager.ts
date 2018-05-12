import { Subscription } from '../helpers/event/subscription';
import { INPUT } from '../input/input';
import { InputEvent } from '../input/input-event';
import { InputType } from '../input/input-type.enum';
import { Vector3 } from '../math/vector3';
import { Material } from '../render/material';
import { SpriteBatch } from '../render2d/sprite-batch';
import { TextBatch } from '../render2d/text-batch';
import { Camera } from '../scene/camera';
import { GuiElement } from './gui-element';

/**
 * Gui manager class
 */
export class GuiManager {
  enabled = true;

  elements: GuiElement[] = [];

  private inputEventsSubscription: Subscription<InputEvent>;

  constructor(
    public material: Material,
    public spriteBatch: SpriteBatch,
    public textBatch: TextBatch,
    public camera: Camera,
  ) {
    this.inputEventsSubscription = INPUT.events.subscribe(event => this.processInput(event));
  }

  free(): void {
    this.inputEventsSubscription.unsubscribe();
  }

  /**
   * Updates all enabled elements inside
   * @param deltaTime Time elapsed from previous frame
   */
  update(deltaTime: number): void {
    if (!this.enabled) {
      return;
    }

    for (const element of this.elements) {
      if (!element.enabled) { continue; }

      element.update(deltaTime);
    }
  }

  /**
   * Renders all visible elements inside
   */
  render(): void {
    if (!this.enabled) {
      return;
    }


    this.material.bind();

    for (const element of this.elements) {
      if (!element.visible) { continue; }

      element.render(this.spriteBatch, this.textBatch);
    }

    this.spriteBatch.finish();
    this.textBatch.finish();
  }

  /**
   * Processes input event and pass it to enabled (and for some events - only to focused) elements
   * @param inputEvent
   */
  processInput(inputEvent: InputEvent): void {
    if (!this.enabled) {
      return;
    }

    const touchVec = this.camera.absoluteMatrix.multiplyVec(new Vector3(inputEvent.x, inputEvent.y));

    for (const element of this.elements) {
      if (!element.enabled) { continue; }

      const shouldProcess = element.focused
        || [InputType.KeyDown, InputType.KeyUp, InputType.Wheel].indexOf(inputEvent.inputType) !== -1;

      if (shouldProcess) {
        element.processInput(inputEvent);
      }
    }
  }
}
