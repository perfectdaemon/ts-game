import { ActionManager } from '../../../engine/helpers/action-manager/action-manager';
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
  turnNumber: number;

  actionManager: ActionManager;

  dialog: DialogBox;

  renderHelper: RenderHelper;

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Fight scene is loaded');
    this.actionManager = new ActionManager();
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
    this.actionManager.update(deltaTime);
  }

  onKeyDown(key: Keys): void {
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
    const worldPosition = GLOBAL.assets.gameCamera
      .screenToWorld(position)
      .asVector2();

    if (this.fightState === FightState.HumanTurnProtect) {
      const result = this.human.ship.cells.filter(c => c.isMouseOver(worldPosition));
      if (result.length > 1) { throw new Error('Hitted too many cells'); }
      if (result.length === 0) { return; }

      const cell = result[0];

      this.human.markAsProtect(cell);

      const hasMoreCellsToProtect = this.human.ship.cells
        .some(c => c.isAlive() && this.human.protectedCells.every(a => a !== c));

      if (this.human.hasProtectsLeft()) {
        this.setFightState(FightState.HumanTurnProtect);
      } else {
        this.setFightState(FightState.HumanTurnAttack);
      }
    } else if (this.fightState === FightState.HumanTurnAttack) {
      const result = this.enemy.ship.cells.filter(c => c.isMouseOver(worldPosition));
      if (result.length > 1) { throw new Error('Hitted too many cells'); }
      if (result.length === 0) { return; }

      const cell = result[0];

      this.human.markAsAttack(cell);

      const hasMoreCellsToAttack = this.enemy.ship.cells
        .some(c => c.isAlive() && this.human.attackedCells.every(a => a !== c));

      if (this.human.hasAttacksLeft() && hasMoreCellsToAttack) {
        this.setFightState(FightState.HumanTurnAttack);
      } else {
        this.setFightState(FightState.AiTurn);
        this.actionManager.add(() => this.enemy.aiChooseProtectAndAttack(this.human))
          .then(() => this.setFightState(FightState.Animation), 2.0)
          .then(() => this.calculateTurn(this.human, this.enemy), 2.0)
          .then(() => this.calculateTurn(this.enemy, this.human), 2.0)
          .then(() => {
            const isHumanVictory = false;
            const isEnemyVictory = false;

            if (isEnemyVictory) {
              this.setFightState(FightState.Defeat);
            } else if (isHumanVictory) {
              this.setFightState(FightState.Victory);
            } else {
              this.setFightState(FightState.Start);
            }
          });
      }
    }
  }

  onMouseMove(position: Vector2): void {
  }

  onMouseUp(position: Vector2, button: MouseButtons): void {
  }

  private reset(): void {
    this.turnNumber = 1;
    this.human = Player.build(FIGHT_GAME_STATE.humanData);
    this.enemy = Player.build(FIGHT_GAME_STATE.enemyData);
    this.setFightState(FightState.Start);
  }

  private calculateTurn(first: Player, second: Player): void {
    first.attackedCells.forEach(attackedCell => {
      const isCellProtected = second.protectedCells.some(cell => cell === attackedCell);
      const damageMultiplier = isCellProtected
        ? second.playerData.protectMultiplier
        : 1.0;
      attackedCell.hit(first.playerData.attackDamage * damageMultiplier);
    });
  }

  private setFightState(newState: FightState): void {
    switch (newState) {
      case FightState.Start:
        this.dialog.text.text = `Раунд ${this.turnNumber++}`;
        this.human.resetTurnState();
        this.enemy.resetTurnState();
        this.actionManager.add(() => this.setFightState(FightState.HumanTurnProtect), 3.0);
        break;

      case FightState.HumanTurnProtect:
        this.dialog.text.text = `Выберите ${this.human.protectsLeft} своих отсеков для защиты`;
        break;

      case FightState.HumanTurnAttack:
        this.dialog.text.text = `Выберите ${this.human.attacksLeft} отсеков противника для атаки`;
        break;

      case FightState.AiTurn:
        this.dialog.text.text = `Ход противника`;
        break;

      case FightState.Animation:
        this.dialog.text.text = `Рассчитываем бой...`;
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
