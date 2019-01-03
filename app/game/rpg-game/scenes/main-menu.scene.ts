import { GuiManager } from '../../../engine/gui/gui-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Scene } from '../../../engine/scenes/scene';
import { MAIN_MENU_DATA } from '../assets/main-menu.data';
import { FIGHT_GAME_STATE, PlayerType } from '../fight/game-state';
import { GLOBAL } from '../global';
import { MenuHelper } from '../menu/menu-helper';
import { SCENES } from './scenes.const';

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

    MenuHelper.loadMenu(this.guiManager, MAIN_MENU_DATA);

    this.guiManager
      .elements['StartButton']
      .onClick = () => this.sceneManager.switchTo(SCENES.game);

    this.guiManager
      .elements['HelpButton']
      .onClick = () => this.sceneManager.switchTo(SCENES.help);

    this.guiManager
      .elements['TestFightButton']
      .onClick = () => this.testFight();

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

  private testFight(): void {
    FIGHT_GAME_STATE.enemyData = {
      attackCount: 2,
      attackDamage: 10,
      cellCount: 5,
      maxCellHealth: 20,
      playerType: PlayerType.Ai,
      protectCount: 2,
      protectMultiplier: 0.5,
    };

    FIGHT_GAME_STATE.humanData = {
      attackCount: 2,
      attackDamage: 10,
      cellCount: 5,
      maxCellHealth: 20,
      playerType: PlayerType.Ai,
      protectCount: 2,
      protectMultiplier: 0.5,
    };

    this.sceneManager.switchTo(SCENES.fight);
  }
}
