import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Scene } from '../../../engine/scenes/scene';
import { DialogBox } from '../dialog-box';
import { FIGHT_GAME_STATE } from '../fight/game-state';
import { Player } from '../fight/player';
import { GLOBAL } from '../global';
import { RenderHelper } from '../render-helper';

export enum FightState {
  Start,
  HumanTurnProtect,
  HumanTurnAttack,
  AiTurn,
  Animation,
  Victory,
  Defeat,
}

export class FightScene extends Scene {
  human: Player;
  enemy: Player;
  fightState: FightState;

  dialog: DialogBox;

  renderHelper: RenderHelper;

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Fight scene is loaded');
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.blankMaterial);
    this.dialog = new DialogBox();
    this.reset();
    return super.load();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();
    this.renderHelper.render([this.human, this.enemy, this.dialog]);
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
    this.setFightState(FightState.Start);
  }

  private setFightState(newState: FightState): void {
    switch (newState) {
      case FightState.Start:
        this.dialog.text.text = 'Бой скоро начнется, приготовьтесь';
        break;

      case FightState.HumanTurnProtect:
        this.dialog.text.text = `Выберите ${this.human.protectsLeft} своих отсеков для защиты`;
        break;

      case FightState.HumanTurnAttack:
        this.dialog.text.text = `Выберите ${this.human.protectsLeft} отсеков противника для атаки`;
        break;

      case FightState.AiTurn:
        this.dialog.text.text = `Ход противника`;
        break;

      case FightState.Animation:
        this.dialog.text.text = `...`;
        break;

      case FightState.Victory:
        this.dialog.text.text = `Вы победили!`;
        break;

      case FightState.Defeat:
        this.dialog.text.text = `Вы проиграли!`;
        break;
    }

    this.fightState = newState;
  }
}
