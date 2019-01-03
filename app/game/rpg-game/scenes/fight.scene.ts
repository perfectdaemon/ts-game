import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Scene } from '../../../engine/scenes/scene';
import { FIGHT_GAME_STATE } from '../fight/game-state';
import { Player } from '../fight/player';
import { GLOBAL } from '../global';
import { RenderHelper } from '../render-helper';

export class FightScene extends Scene {
  human: Player;
  enemy: Player;

  renderHelper: RenderHelper;

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Fight scene is loaded');
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.solarMaterial);
    this.reset();
    return super.load();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();
    this.renderHelper.render([this.human, this.enemy]);
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

  private reset(): void {
    this.human = Player.build(FIGHT_GAME_STATE.humanData);
    this.enemy = Player.build(FIGHT_GAME_STATE.enemyData);
  }
}
