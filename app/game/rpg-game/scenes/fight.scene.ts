import { GuiManager } from '../../../engine/gui/gui-manager';
import { ActionManager } from '../../../engine/helpers/action-manager/action-manager';
import { SimpleAction } from '../../../engine/helpers/action-manager/actions.func';
import { Vector4 } from '../../../engine/math/vector4';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Scene } from '../../../engine/scenes/scene';
import { SOUNDS } from '../assets/sound.data';
import { DialogBox } from '../dialog-box';
import { ConsumableItem } from '../fight/consumable-item';
import { ParticleEmitterExtensions } from '../fight/emitter-extensions';
import { FightShipCell } from '../fight/fight-ship-cell';
import { FIGHT_GAME_STATE } from '../fight/game-state';
import { Player } from '../fight/player';
import { PlayerType } from '../fight/player-type';
import { GLOBAL } from '../global';
import { GlobalEvents } from '../global.events';
import { SpriteParticleEmitter, TextParticleEmitter } from '../particles';
import { InventoryItemData, ItemType } from '../player-data';
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
  canUseConsumableItems: boolean;

  human: Player;
  enemy: Player;
  fightState: FightState;
  turnNumber: number;

  actionManager: ActionManager;
  dialog: DialogBox;
  guiManager: GuiManager;
  guiSB: SpriteBatch;
  guiTB: TextBatch;
  renderHelper: RenderHelper;
  emitter: SpriteParticleEmitter;
  textEmitter: TextParticleEmitter;

  dialogText: string;

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Fight scene is loaded');
    this.guiSB = new SpriteBatch();
    this.guiTB = new TextBatch(GLOBAL.assets.font);
    this.guiManager = new GuiManager(
      GLOBAL.assets.solarMaterial,
      this.guiSB,
      this.guiTB,
      GLOBAL.assets.guiCamera,
    );

    this.actionManager = new ActionManager();
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.solarMaterial);
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
    this.dialog = new DialogBox(120);
    this.reset();
    return super.load();
  }

  unload(): Promise<void> {
    this.renderHelper.free();
    this.guiManager.free();
    this.guiSB.free();
    this.guiTB.free();

    return super.unload();
  }

  render(): void {
    GLOBAL.assets.guiCamera.update();
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

  private reset(): void {
    this.turnNumber = 1;
    this.human = Player.build(FIGHT_GAME_STATE.humanData, PlayerType.Human, this.guiManager);
    this.enemy = Player.build(FIGHT_GAME_STATE.enemyData, PlayerType.Ai, this.guiManager);

    this.human.onConsumableCellClick = (consumable) => this.onConsumableCellClick(consumable);
    this.human.onConsumableMouseOver = (consumable) => this.onConsumableOver(consumable);
    this.human.onConsumableMouseOut = (consumable) => this.onConsumableOut(consumable);
    this.human.onShipCellClick = (cell) => this.onShipCellClick(cell, this.human);
    this.enemy.onShipCellClick = (cell) => this.onShipCellClick(cell, this.enemy);
    this.setFightState(FightState.Start);
  }

  private calculateTurn(attacking: Player, defending: Player): SimpleAction[] {
    let damages = PlayerDataExtensions.calculateDamages(attacking.playerData);
    let protections = PlayerDataExtensions.calculateProtections(defending.playerData);

    const result: SimpleAction[] = [];

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

      const action = () => {
        defending.hit(damage.damage);
        GLOBAL.assets.audioManager.playSound(SOUNDS.explosion);

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
      };

      result.push(action);
    }

    return result;
  }

  private setFightState(newState: FightState): void {
    switch (newState) {
      case FightState.Start:
        this.dialog.text.text = `Раунд ${this.turnNumber++}`;
        this.setEnableForConsumable(false);
        this.setEnableForCells(this.human, false);
        this.setEnableForCells(this.enemy, false);
        this.human.resetTurnState();
        this.enemy.resetTurnState();
        this.actionManager.add(() => {
          this.setEnableForConsumable(true);
          this.setFightState(FightState.HumanTurnProtect);
        }, 2.0);
        break;

      case FightState.HumanTurnProtect:
        this.setEnableForCells(this.human, true);
        this.setEnableForCells(this.enemy, false);

        if (this.human.hasProtectsLeft() && this.human.hasUnprotectedCells()) {
          this.dialog.text.text = `Выберите ${this.human.protectsLeft} своих отсека для защиты`;
          if (this.canUseConsumableItems) {
            this.dialog.text.text += ' или воспользуйтесь одноразовыми предметами';
          }
        } else {
          this.setFightState(FightState.HumanTurnAttack);
          return;
        }
        break;

      case FightState.HumanTurnAttack:
        this.setEnableForCells(this.human, false);
        this.setEnableForCells(this.enemy, true);

        if (this.human.hasAttacksLeft() && this.enemy.hasNotAttackedCells()) {
          this.dialog.text.text = `Выберите ${this.human.attacksLeft} отсека противника для атаки`;
          if (this.canUseConsumableItems) {
            this.dialog.text.text += ' или воспользуйтесь одноразовыми предметами';
          }
        } else {
          this.setFightState(FightState.AiTurn);
          return;
        }
        break;

      case FightState.AiTurn:
        this.setEnableForConsumable(false);
        this.setEnableForCells(this.human, false);
        this.setEnableForCells(this.enemy, false);
        this.dialog.text.text = `Ход противника`;
        this.actionManager
          .add(() => this.enemy.aiChooseProtectAndAttack(this.human), 1.0)
          .then(() => this.setFightState(FightState.Animation), 1.0);
        break;

      case FightState.Animation:
        this.dialog.text.text = `Рассчитываем бой...`;
        const humanActions = this.calculateTurn(this.human, this.enemy);
        const enemyActions = this.calculateTurn(this.enemy, this.human);
        const actions = humanActions.concat(enemyActions);

        actions.push(() => {
          const isHumanVictory = !this.enemy.isAlive();
          const isEnemyVictory = !this.human.isAlive();

          if (isEnemyVictory) {
            this.setFightState(FightState.Defeat);
          } else if (isHumanVictory) {
            this.setFightState(FightState.Victory);
          } else {
            this.setFightState(FightState.Start);
          }
        });

        let pause = 0.0;
        for (const action of actions) {
          this.actionManager.add(action, pause += 0.8);
        }

        break;

      case FightState.Victory:
        this.human.resetTurnState();
        this.dialog.text.text = `Вы победили!`;
        this.actionManager.add(() => {
          this.updatePlayerData();
          this.sceneManager.closeModal().then(() => GlobalEvents.enemyDefeated.next());
        }, 1.0);
        break;

      case FightState.Defeat:
        this.human.resetTurnState();
        this.dialog.text.text = `Вы проиграли!`;
        this.actionManager.add(() => {
          this.updatePlayerData();
          this.sceneManager.closeModal().then(() => GlobalEvents.playerDied.next());
        }, 1.0);
        break;
    }

    this.fightState = newState;
    this.dialogText = this.dialog.text.text;
  }

  private onShipCellClick(shipCell: FightShipCell, player: Player): void {
    if (this.fightState === FightState.HumanTurnProtect) {
      if (player.type === PlayerType.Ai) {
        return;
      }

      if (shipCell.markedAsProtected) {
        console.log('Cell is already protected');
        return;
      }

      this.human.markAsProtect(shipCell);
      this.setEnableForConsumable(false);
      this.setFightState(FightState.HumanTurnProtect);

    } else if (this.fightState === FightState.HumanTurnAttack) {
      if (player.type === PlayerType.Human) {
        return;
      }

      if (shipCell.markedAsAttacked) {
        console.log('Cell is already attacked');
        return;
      }

      this.human.markAsAttack(shipCell);
      this.setEnableForConsumable(false);
      this.setFightState(FightState.HumanTurnAttack);
    }
  }

  private onConsumableCellClick(consumableItem: ConsumableItem): void {
    if (!this.canUseConsumableItems) {
      return;
    }

    if (!consumableItem.canUse(this.human, this.enemy)) {
      const currentText = this.dialog.text.text;
      this.actionManager
        .add(() => this.dialog.text.text = `Нельзя использовать «${consumableItem.name}»`)
        .then(() => this.dialog.text.text = currentText, 2.0);
      return;
    }

    this.actionManager
      .add(() => this.dialog.text.text = `Используем «${consumableItem.name}»`)
      .then(() => this.setFightState(this.fightState), 2.0);

    consumableItem.use(this.human, this.enemy);
    this.human.activeItems.push({
      item: consumableItem,
      other: this.enemy,
      roundLeft: consumableItem.removeAfterNumberOfTurns,
    });
  }

  private onConsumableOver(consumableItem: ConsumableItem): void {
    consumableItem.background.sprite.setVerticesAlpha(0.7);
    this.dialog.text.text = consumableItem.name;
  }

  private onConsumableOut(consumableItem: ConsumableItem): void {
    consumableItem.background.sprite.setVerticesAlpha(0.3);
    this.dialog.text.text = this.dialogText;
  }

  private setEnableForConsumable(enable: boolean): void {
    this.canUseConsumableItems = enable;

    for (const consumable of this.human.consumableItems) {
      consumable.background.enabled = enable;
    }
  }

  private setEnableForCells(player: Player, enable: boolean): void {
    for (const cell of player.shipCells) {
      cell.cellSprite.enabled = enable;
      // fix bug for stay hovered after disable
      const input: any = {};
      cell.cellSprite.onMouseOut(cell.cellSprite, input);
    }
  }

  private updatePlayerData(): void {
    const toDelete: InventoryItemData[] = [];

    for (const item of this.human.playerData.inventory) {
      if (item.type !== ItemType.Consumable || !item.consumable) { continue; }

      const consItem = item.consumable;
      const used = this.human.consumableItems.filter(it => it.type === consItem.type);

      if (used.length === 0) {
        console.error('No such used found. Strange.');
        continue;
      }

      item.cost -= (item.consumable.count - used[0].count) * 50;
      item.consumable.count = used[0].count;

      if (item.consumable.count === 0) {
        toDelete.push(item);
      }
    }

    for (const del of toDelete) {
      const index = this.human.playerData.inventory.indexOf(del);
      this.human.playerData.inventory.splice(index, 1);
    }
  }
}
