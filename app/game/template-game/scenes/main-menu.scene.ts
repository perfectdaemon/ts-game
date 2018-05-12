import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Scene } from '../../../engine/scenes/scene';
import { GLOBAL } from '../global';

export class MainMenuScene extends Scene {
  guiManager: GuiManager;

  constructor() {
    super();
  }

  load(): Promise<void> {
    this.guiManager = new GuiManager(
      GLOBAL.assets.blankMaterial,
      new SpriteBatch(),
      new TextBatch(GLOBAL.assets.font),
      GLOBAL.assets.guiCamera,
    );

    const button = new GuiButton();
    button.sprite.setSize(250, 50);
    button.sprite.position.set(350, 250, 5);
    button.sprite.setVerticesColor(new Vector4(0.3, 0.5, 0.7, 1.0));
    button.label.color.set(1, 1, 1, 1);
    button.onClick = (el, ev) => {
      button.label.text = `clicked: ${ev.x}, ${ev.y}`;
    };

    button.onTouchDown = () => button.sprite.setVerticesColor(new Vector4(1, 0, 0, 1));
    button.onTouchUp = () => button.sprite.setVerticesColor(new Vector4(0.3, 0.5, 0.7, 1.0));

    button.updateHitBox();

    this.guiManager.elements.push(button);

    return super.load();
  }

  unload(): Promise<void> {
    this.guiManager.free();

    return super.unload();
  }

  render(): void {
    GLOBAL.assets.guiCamera.update();
    this.guiManager.render();
  }

  update(deltaTime: number): void {
    this.guiManager.update(deltaTime);
  }

  onKeyDown(key: Keys): void {
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
  }

  onMouseMove(position: Vector2): void {
  }

  onMouseUp(position: Vector2, button: MouseButtons): void {
  }
}
