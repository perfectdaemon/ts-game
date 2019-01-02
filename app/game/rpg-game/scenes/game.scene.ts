import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Scene } from '../../../engine/scenes/scene';
import { GLOBAL } from '../global';
import { SolarManager } from '../solar/solar.manager';

export class GameScene extends Scene {
  solarManager: SolarManager;
  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Game scene is loaded');
    this.solarManager = new SolarManager();
    this.solarManager.initialize();
    return super.load();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();
    this.solarManager.draw();
  }

  update(deltaTime: number): void {
    this.solarManager.update(deltaTime);
  }

  onKeyDown(key: Keys): void {
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
    if (button === Keys.LeftButton) {
      const worldPosition = GLOBAL.assets.gameCamera.screenToWorld(position);
      this.solarManager.movePlayerToPosition(new Vector2().set(worldPosition));
    }
  }

  onMouseMove(position: Vector2): void {
  }

  onMouseUp(position: Vector2, button: MouseButtons): void {
  }
}
