import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Scene } from '../../../engine/scenes/scene';
import { GLOBAL } from '../global';

export class MainMenuScene extends Scene {
  constructor() {
    super();
  }

  load(): Promise<void> {
    return super.load();
  }

  render(): void {
    GLOBAL.assets.guiCamera.update();
  }

  update(deltaTime: number): void {
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
