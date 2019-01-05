import { ActionManager } from '../../../engine/helpers/action-manager/action-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Scene } from '../../../engine/scenes/scene';
import { DialogBox } from '../dialog-box';
import { ParticleEmitterExtensions } from '../fight/emitter-extensions';
import { FIGHT_GAME_STATE } from '../fight/game-state';
import { Player } from '../fight/player';
import { GLOBAL } from '../global';
import { SpriteParticleEmitter } from '../particles';
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
  emitter: SpriteParticleEmitter;

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Fight scene is loaded');
    this.actionManager = new ActionManager();
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.blankMaterial);
    this.emitter = new SpriteParticleEmitter(
      this.renderHelper,
      () => ParticleEmitterExtensions.createSmallParticle(),
      64,
    );
    this.dialog = new DialogBox();
    this.reset();
    return super.load();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();
    this.renderHelper.render([this.human, this.enemy, this.dialog]);
    this.emitter.render();
  }

  update(deltaTime: number): void {
    this.actionManager.update(deltaTime);
    this.emitter.update(deltaTime);
  }

  onKeyDown(key: Keys): void {
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
    if (button !== Keys.LeftButton) {
      return;
    }

    const worldPosition = GLOBAL.assets.gameCamera
      .screenToWorld(position)
      .asVector2();

    this.checkItemsClick(worldPosition);

    if (this.fightState === FightState.HumanTurnProtect) {
      const result = this.human.ship.cells.filter(c => c.isMouseOver(worldPosition));
      if (result.length > 1) { throw new Error('Hit too many cells'); }
      if (result.length === 0) { return; }

      const cell = result[0];

      if (cell.markedAsProtected) {
        console.log('Cell is already protected');
        return;
      }

      this.human.markAsProtect(cell);

      if (this.human.hasProtectsLeft()) {
        this.setFightState(FightState.HumanTurnProtect);
      } else {
        this.setFightState(FightState.HumanTurnAttack);
      }
    } else if (this.fightState === FightState.HumanTurnAttack) {
      const result = this.enemy.ship.cells.filter(c => c.isMouseOver(worldPosition));
      if (result.length > 1) { throw new Error('Hit too many cells'); }
      if (result.length === 0) { return; }

      const cell = result[0];

      if (cell.markedAsAttacked) {
        console.log('Cell is already attacked');
        return;
      }

      this.human.markAsAttack(cell);

      if (this.human.hasAttacksLeft()) {
        this.setFightState(FightState.HumanTurnAttack);
      } else {
        this.setFightState(FightState.AiTurn);
        this.actionManager.add(() => this.enemy.aiChooseProtectAndAttack(this.human), 2.0)
          .then(() => this.setFightState(FightState.Animation), 2.0)
          .then(() => this.calculateTurn(this.human, this.enemy), 2.0)
          .then(() => this.calculateTurn(this.enemy, this.human), 4.0)
          .then(() => {
            const isHumanVictory = !this.enemy.ship.isAlive();
            const isEnemyVictory = !this.human.ship.isAlive();

            if (isEnemyVictory) {
              this.setFightState(FightState.Defeat);
            } else if (isHumanVictory) {
              this.setFightState(FightState.Victory);
            } else {
              this.setFightState(FightState.Start);
            }
          }, 5);
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

  private calculateTurn(attacking: Player, defending: Player): void {
    let pauseOnStart = 0;
    for (const attackedCell of defending.ship.cells.filter(cell => cell.markedAsAttacked)) {
      let damage = attacking.playerData.attackDamageMin + Math.random() *
        (attacking.playerData.attackDamageMax - attacking.playerData.attackDamageMin);

      if (Math.random() <= attacking.playerData.criticalChance) {
        damage *= 2;
      }

      const protectionMultiplier = attackedCell.markedAsProtected
        ? defending.playerData.protectMultiplier
        : 1.0;

      damage *= protectionMultiplier;

      damage = Math.floor(damage);

      this.actionManager.add(() => {
        defending.ship.hit(damage);

        const cellAbsolutePosition = attackedCell.renderable.sprite.absoluteMatrix.position.asVector2();

        if (attackedCell.markedAsProtected) {
          ParticleEmitterExtensions.emitHitWithShield(this.emitter, cellAbsolutePosition);
        } else {
          ParticleEmitterExtensions.emitHit(this.emitter, cellAbsolutePosition);
        }
      }, pauseOnStart += 2);
    }
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
        this.dialog.text.text = `Выберите ${this.human.protectsLeft} своих отсека для защиты`;
        break;

      case FightState.HumanTurnAttack:
        this.dialog.text.text = `Выберите ${this.human.attacksLeft} отсека противника для атаки`;
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

  private checkItemsClick(worldPosition: Vector2): void {
    if (this.fightState !== FightState.HumanTurnAttack && this.fightState !== FightState.HumanTurnProtect) {
      return;
    }

    const result = this.human.items.filter(i => i.isMouseOver(worldPosition));
    if (result.length > 1) { throw new Error('Hit too many items'); }
    if (result.length === 0) { return; }

    const item = result[0];

    if (!item.canUse(this.human, this.enemy)) {
      const currentText = this.dialog.text.text;
      this.actionManager
        .add(() => this.dialog.text.text = `Нельзя использовать «${item.name}»`)
        .then(() => this.dialog.text.text = currentText, 2.0);
      return;
    }

    this.actionManager
      .add(() => this.dialog.text.text = `Используем «${item.name}»`)
      .then(() => this.setFightState(this.fightState), 2.0);

    item.use(this.human, this.enemy);
    this.human.activeItems.push({
      item,
      other: this.enemy,
      roundLeft: item.removeAfterNumberOfTurns,
    });
  }
}
