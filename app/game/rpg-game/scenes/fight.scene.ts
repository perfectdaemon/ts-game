import { GuiManager } from '../../../engine/gui/gui-manager';
import { ActionManager } from '../../../engine/helpers/action-manager/action-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Scene } from '../../../engine/scenes/scene';
import { DialogBox } from '../dialog-box';
import { ParticleEmitterExtensions } from '../fight/emitter-extensions';
import { FIGHT_GAME_STATE } from '../fight/game-state';
import { Player } from '../fight/player';
import { PlayerType } from '../fight/player-type';
import { GLOBAL } from '../global';
import { SpriteParticleEmitter, TextParticleEmitter } from '../particles';
import { DamageInfo, PlayerDataExtensions, ProtectionInfo } from '../player-data-extensions';
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
  guiManager: GuiManager;
  human: Player;
  enemy: Player;
  fightState: FightState;
  turnNumber: number;

  actionManager: ActionManager;

  dialog: DialogBox;

  renderHelper: RenderHelper;
  emitter: SpriteParticleEmitter;
  textEmitter: TextParticleEmitter;

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Fight scene is loaded');
    this.guiManager = new GuiManager(
      GLOBAL.assets.planetMaterial,
      new SpriteBatch(),
      new TextBatch(GLOBAL.assets.font),
      GLOBAL.assets.guiCamera,
    );

    this.actionManager = new ActionManager();
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.planetMaterial);
    this.emitter = new SpriteParticleEmitter(
      this.renderHelper,
      () => ParticleEmitterExtensions.createSmallParticle(),
      64,
    );

    this.textEmitter = new TextParticleEmitter(
      this.renderHelper,
      () => ParticleEmitterExtensions.createTextParticle(),
      8,
    );
    this.dialog = new DialogBox();
    this.reset();
    return super.load();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();
    this.renderHelper.render([this.human, this.enemy, this.dialog]);
    this.emitter.render();
    this.textEmitter.render();
  }

  update(deltaTime: number): void {
    this.guiManager.update(deltaTime);
    this.actionManager.update(deltaTime);
    this.emitter.update(deltaTime);
    this.textEmitter.update(deltaTime);
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
      const result = this.human.shipCells.filter(c => c.isMouseOver(worldPosition));
      if (result.length > 1) { throw new Error('Hit too many cells'); }
      if (result.length === 0) { return; }

      const cell = result[0];

      if (cell.markedAsProtected) {
        console.log('Cell is already protected');
        return;
      }

      this.human.markAsProtect(cell);
      this.setFightState(FightState.HumanTurnProtect);
    } else if (this.fightState === FightState.HumanTurnAttack) {
      const result = this.enemy.shipCells.filter(c => c.isMouseOver(worldPosition));
      if (result.length > 1) { throw new Error('Hit too many cells'); }
      if (result.length === 0) { return; }

      const cell = result[0];

      if (cell.markedAsAttacked) {
        console.log('Cell is already attacked');
        return;
      }

      this.human.markAsAttack(cell);
      this.setFightState(FightState.HumanTurnAttack);
    }
  }

  onMouseMove(position: Vector2): void {
  }

  onMouseUp(position: Vector2, button: MouseButtons): void {
  }

  private reset(): void {
    this.turnNumber = 1;
    this.human = Player.build(FIGHT_GAME_STATE.humanData, PlayerType.Human, this.guiManager);
    this.enemy = Player.build(FIGHT_GAME_STATE.enemyData, PlayerType.Ai, this.guiManager);
    this.setFightState(FightState.Start);
  }

  private calculateTurn(attacking: Player, defending: Player): void {
    let pauseOnStart = 0;
    let damages = PlayerDataExtensions.calculateDamages(attacking.playerData);
    let protections = PlayerDataExtensions.calculateProtections(defending.playerData);

    for (const attackedCell of defending.shipCells.filter(cell => cell.markedAsAttacked)) {
      // Generate new damages and protections if no left
      // It may occur when you are using consumable items "+1 attack" or "+1 protect"
      if (damages.length === 0) {
        damages = PlayerDataExtensions.calculateDamages(attacking.playerData);
      }

      if (protections.length === 0) {
        protections = PlayerDataExtensions.calculateProtections(defending.playerData);
      }

      const damage = damages.pop() as DamageInfo;

      if (attackedCell.markedAsProtected) {
        const protection = protections.pop() as ProtectionInfo;
        const multiplier = Math.min(1.0, 1.0 - protection.protectionMultiplier + damage.shieldPiercing);
        damage.damage *= multiplier;
      }

      damage.damage = Math.floor(damage.damage);

      this.actionManager.add(() => {
        defending.hit(damage.damage);

        const cellAbsolutePosition = attackedCell.cellSprite.sprite.absoluteMatrix.position.asVector2();
        const damageColor = damage.isCritical
          ? new Vector4(1, 0.2, 0.2, 1.0)
          : new Vector4(0.7, 0.7, 0.1, 1.0);

        ParticleEmitterExtensions.emitDamageCount(this.textEmitter, cellAbsolutePosition, damage.damage, damageColor,
          damage.isCritical ? 1.3 : 1.0);

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
        if (this.human.hasProtectsLeft()) {
          this.dialog.text.text = `Выберите ${this.human.protectsLeft} своих отсека для защиты`;
        } else {
          this.setFightState(FightState.HumanTurnAttack);
          return;
        }
        break;

      case FightState.HumanTurnAttack:
        if (this.human.hasAttacksLeft()) {
          this.dialog.text.text = `Выберите ${this.human.attacksLeft} отсека противника для атаки`;
        } else {
          this.setFightState(FightState.AiTurn);
          return;
        }
        break;

      case FightState.AiTurn:
        this.dialog.text.text = `Ход противника`;
        this.actionManager
          .add(() => this.enemy.aiChooseProtectAndAttack(this.human), 2.0)
          .then(() => this.setFightState(FightState.Animation), 2.0);
        break;

      case FightState.Animation:
        this.dialog.text.text = `Рассчитываем бой...`;
        this.actionManager
          .add(() => this.calculateTurn(this.human, this.enemy), 0.5)
          .then(() => this.calculateTurn(this.enemy, this.human), 4.0) // TODO not 4, calculate it!!!
          .then(() => {
            const isHumanVictory = !this.enemy.isAlive();
            const isEnemyVictory = !this.human.isAlive();

            if (isEnemyVictory) {
              this.setFightState(FightState.Defeat);
            } else if (isHumanVictory) {
              this.setFightState(FightState.Victory);
            } else {
              this.setFightState(FightState.Start);
            }
          }, 5); // TODO not 5, calculate it!
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

    const result = this.human.consumableItems.filter(i => i.isMouseOver(worldPosition));
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
