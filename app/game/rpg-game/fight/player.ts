import { GuiManager } from '../../../engine/gui/gui-manager';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { SOUNDS } from '../assets/sound.data';
import { GLOBAL } from '../global';
import { HealthBar } from '../planet/health-bar';
import { PlayerStatsRow } from '../planet/player-stats-row';
import { ConsumableItemType, ItemType, PlayerData } from '../player-data';
import { PlayerDataExtensions } from '../player-data-extensions';
import { IRenderable } from '../render-helper';
import { AttackCountItem } from './attack-count-item';
import { ConsumableItem } from './consumable-item';
import { CriticalChanceItem } from './critical-chance-item';
import { FightShipCell } from './fight-ship-cell';
import { HealItem } from './heal-item';
import { PlayerType } from './player-type';
import { ProtectCountItem } from './protect-count-item';

export class Player implements IRenderable {

  static build(playerData: PlayerData, playerType: PlayerType, gui: GuiManager): Player {
    const player = new Player();
    player.type = playerType;
    player.playerData = playerData;

    const playerW = 400;

    player.background = new Sprite(playerW, renderer.height - 150, new Vector2(0, 0));
    player.background.setVerticesColor(52 / 255, 111 / 255, 149 / 255, 1.0);
    const region = GLOBAL.assets.planetAtlas.getRegion('blank.png');
    player.background.setTextureRegion(region, false);

    switch (player.type) {
      case PlayerType.Human:
        player.background.position.set(10, 140, 1);
        player.background.setVerticesColor(0.3, 0.4, 0.3, 1.0);
        break;
      case PlayerType.Ai:
        player.background.position.set(renderer.width - 10 - player.background.width, 140, 1);
        player.background.setVerticesColor(0.4, 0.3, 0.3, 1.0);
        break;
    }

    const start = 340;

    player.playerStats.push(
      new PlayerStatsRow('Урон (сумм)', '', 10, start, 250),
      new PlayerStatsRow('Крит. шанс', '', 10, start + 25, 250),
      new PlayerStatsRow('Крит. урон', '', 10, start + 50, 250),
      new PlayerStatsRow('Щит', '', 10, start + 75, 250),
    );

    for (const stat of player.playerStats) {
      stat.caption.parent = player.background;
    }

    const cellStart = new Vector2(190, 130);

    for (const shipCellData of playerData.cells) {
      const shipCell = new FightShipCell(shipCellData, cellStart.x, cellStart.y, gui);
      shipCell.cellSprite.sprite.parent = player.background;
      shipCell.cellSprite.updateHitBox();
      shipCell.cellSprite.onClick = () => {
        player.onShipCellClick(shipCell);
        GLOBAL.assets.audioManager.playSound(SOUNDS.select);
      };
      player.shipCells.push(shipCell);
    }

    player.health = new HealthBar(20, 30);
    player.health.back.parent = player.background;

    const consumableItems = playerData.inventory.filter(it => it.type === ItemType.Consumable);

    let i = 0;
    for (const itemInfo of consumableItems) {
      let item: ConsumableItem;

      if (itemInfo.consumable == null) {
        throw new Error('Item type is consumable but no consumable data found');
      }

      switch (itemInfo.consumable.type) {
        case ConsumableItemType.Heal:
          item = new HealItem(itemInfo, 45 + 80 * i++, player.background.height - 45, gui);
          break;

        case ConsumableItemType.IncreaseCriticalChance:
          item = new CriticalChanceItem(itemInfo, 45 + 80 * i++, player.background.height - 45, gui);
          break;

        case ConsumableItemType.MoreAttackCount:
          item = new AttackCountItem(itemInfo, 45 + 80 * i++, player.background.height - 45, gui);
          break;

        case ConsumableItemType.MoreProtectCount:
          item = new ProtectCountItem(itemInfo, 45 + 80 * i++, player.background.height - 45, gui);
          break;

        default:
          throw new Error(`Unknown item type: ${itemInfo.type}`);
      }

      item.background.sprite.parent = player.background;
      item.background.onClick = () => {
        player.onConsumableCellClick(item);
        GLOBAL.assets.audioManager.playSound(SOUNDS.select);
      };

      item.background.onMouseOver = () => player.onConsumableMouseOver(item);
      item.background.onMouseOut = () => player.onConsumableMouseOut(item);
      item.background.updateHitBox();
      player.consumableItems.push(item);
    }

    player.updateHealth();
    player.updateStats();
    player.resetTurnState();

    return player;
  }

  playerData: PlayerData;
  type: PlayerType;

  attacksLeft: number;
  protectsLeft: number;

  shipCells: FightShipCell[] = [];

  background: Sprite;

  playerStats: PlayerStatsRow[] = [];

  health: HealthBar;

  consumableItems: ConsumableItem[] = [];

  activeItems: {
    item: ConsumableItem,
    roundLeft: number,
    other: Player,
  }[] = [];

  onShipCellClick: (cell: FightShipCell) => void = () => {};
  onConsumableCellClick: (consumableItem: ConsumableItem) => void = () => {};
  onConsumableMouseOver: (consumableItem: ConsumableItem) => void = () => {};
  onConsumableMouseOut: (consumableItem: ConsumableItem) => void = () => {};

  getSpritesToRender(): Sprite[] {
    const result: Sprite[] = [this.background, this.health.back, this.health.current];

    for (const shipCell of this.shipCells) {
      result.push(shipCell.cellSprite.sprite);
      if (shipCell.item) {
        result.push(shipCell.item.sprite);
      }

      result.push(shipCell.attackMark, shipCell.protectMark);
    }

    for (const cons of this.consumableItems) {
      result.push(cons.background.sprite);
    }

    return result;
  }

  getTextsToRender(): Text[] {
    const result: Text[] = [this.health.text];

    for (const stat of this.playerStats) {
      result.push(stat.caption, stat.value);
    }

    for (const cons of this.consumableItems) {
      result.push(cons.countText, cons.effectText);
    }

    return result;
  }

  updateHealth(): void {
    this.health.updateHealth(this.playerData.shipHealth, this.playerData.shipMaxHealth);
  }

  resetTurnState(): void {
    for (const cell of this.shipCells) {
      cell.reset();
    }

    this.attacksLeft = PlayerDataExtensions.attackCount(this.playerData);
    this.protectsLeft = PlayerDataExtensions.protectCount(this.playerData);

    for (const activeItem of this.activeItems) {
      if (--activeItem.roundLeft > 0) {
        continue;
      }

      activeItem.item.removeEffect(this, activeItem.other);
    }

    this.activeItems = this.activeItems.filter(it => it.roundLeft > 0);
  }

  hasProtectsLeft(): boolean {
    return this.protectsLeft > 0;
  }

  hasAttacksLeft(): boolean {
    return this.attacksLeft > 0;
  }

  isOwnCell(cell: FightShipCell): boolean {
    return this.shipCells.some(ownCell => ownCell === cell);
  }

  markAsProtect(cell: FightShipCell): void {
    if (!this.hasProtectsLeft()) {
      throw new Error('No protects left');
    }

    if (!this.isOwnCell(cell)) {
      throw new Error(`Wrong cell to protect, perhaps it is enemy's one`);
    }

    cell.markAsProtected();
    --this.protectsLeft;
  }

  markAsAttack(cell: FightShipCell): void {
    if (!this.hasAttacksLeft()) {
      throw new Error('No attacks left');
    }

    if (this.isOwnCell(cell)) {
      throw new Error(`Wrong cell to attack, perhaps it is yours`);
    }

    cell.markAsAttacked();
    --this.attacksLeft;
  }

  aiChooseProtectAndAttack(other: Player): boolean {
    let selectedCellId = 0;
    let selectedCell: FightShipCell;
    let actionsTaken = false;

    while (this.hasProtectsLeft()) {
      const aliveCells = this.shipCells
        .filter(cell => !cell.markedAsProtected);

      if (aliveCells.length === 0) {
        break;
      }

      selectedCellId = Math.floor(Math.random() * aliveCells.length);
      selectedCell = aliveCells[selectedCellId];
      this.markAsProtect(selectedCell);
      actionsTaken = true;
    }

    while (this.hasAttacksLeft()) {
      const otherAliveCells = other.shipCells
        .filter(cell => !cell.markedAsAttacked);

      if (otherAliveCells.length === 0) {
        break;
      }

      selectedCellId = Math.floor(Math.random() * otherAliveCells.length);
      selectedCell = otherAliveCells[selectedCellId];
      this.markAsAttack(selectedCell);
      actionsTaken = true;
    }

    return actionsTaken;
  }

  updateStats(): void {
    this.playerStats[0].value.text = PlayerDataExtensions.attackDamageMinMaxSummary(this.playerData);
    this.playerStats[1].value.text = PlayerDataExtensions.criticalChanceSummary(this.playerData);
    this.playerStats[2].value.text = PlayerDataExtensions.criticalMultiplierSummary(this.playerData);
    this.playerStats[3].value.text = PlayerDataExtensions.protectSummary(this.playerData);
  }

  hit(damage: number): void {
    this.playerData.shipHealth -= damage;
    if (this.playerData.shipHealth < 0) {
      this.playerData.shipHealth = 0;
    }
    this.updateHealth();
  }

  isAlive(): boolean {
    return this.playerData.shipHealth > 0;
  }
}
