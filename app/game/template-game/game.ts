import { GameBase } from '../../engine/game-base';
import { Keys, MouseButtons } from '../../engine/input/keys.enum';
import { Vector2 } from '../../engine/math/vector2';
import { SceneManager } from '../../engine/scenes/scene-manager';
import { GLOBAL } from './global';
import { GameScene } from './scenes/game.scene';
import { MainMenuScene } from './scenes/main-menu.scene';
import { SCENES } from './scenes/scenes.const';

export class Game extends GameBase {
  sceneManager: SceneManager = new SceneManager();

  protected async onInit(): Promise<void> {
    this.renderer.setClearColorRGB(19 / 255, 104 / 255, 138 / 255, 1.0);

    await GLOBAL.assets.loadAll();

    this.sceneManager.addScene(SCENES.game, new GameScene());
    this.sceneManager.addScene(SCENES.mainMenu, new MainMenuScene());

    this.sceneManager.switchTo(SCENES.mainMenu);
  }

  protected onUpdate(deltaTime: number): void {
    GLOBAL.actionManager.update(deltaTime);
    GLOBAL.tweenManager.update(deltaTime);
    this.sceneManager.update(deltaTime);
  }

  protected onRender(): void {
    super.onRender();
    this.sceneManager.render();
  }

  protected onMouseMove(position: Vector2): void {
    this.sceneManager.onMouseMove(position);
  }

  protected onMouseDown(position: Vector2, button: MouseButtons): void {
    this.sceneManager.onMouseDown(position, button);
  }

  protected onMouseUp(position: Vector2, button: MouseButtons): void {
    this.sceneManager.onMouseUp(position, button);
  }

  protected onKeyDown(key: Keys): void {
    this.sceneManager.onKeyDown(key);
  }

  protected onKeyUp(key: Keys): void {
    this.sceneManager.onKeyUp(key);
  }
}
