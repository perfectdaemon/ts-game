import { GameBase } from '../../engine/game-base';
import { Keys } from '../../engine/input/keys.enum';
import { Vector2 } from '../../engine/math/vector2';
import { Assets } from './assets/assets';
import { GLOBAL } from './global';
import { GameScene } from './scenes/game.scene';
import { SceneManager } from './scenes/scene-manager';
import { SCENES } from './scenes/scenes.const';

export class Game extends GameBase {
  sceneManager: SceneManager = new SceneManager();
  assets: Assets = new Assets();

  protected onInit(): void {
    this.renderer.setClearColorRGB(19 / 255, 104 / 255, 138 / 255, 1.0);

    this.assets.loadAll()
      .then(() => {
        const gameScene = new GameScene(this.assets);
        this.sceneManager.addScene(gameScene, SCENES.game);

        this.sceneManager.switchTo(SCENES.game);
      });

  }

  protected onUpdate(deltaTime: number): void {
    GLOBAL.actionManager.update(deltaTime);
    GLOBAL.tweener.update(deltaTime);
    this.sceneManager.update(deltaTime);
  }

  protected onRender(): void {
    super.onRender();
    this.sceneManager.render();
  }

  protected onMouseMove(position: Vector2): void {
    this.sceneManager.onMouseMove(position);
  }

  protected onMouseDown(position: Vector2): void {
    this.sceneManager.onMouseDown(position);
  }

  protected onKeyDown(key: Keys): void {
    this.sceneManager.onKeyDown(key);
  }

  protected onKeyUp(key: Keys): void {
    this.sceneManager.onKeyUp(key);
  }
}
