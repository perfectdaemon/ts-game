import { GuiManager } from '../../../engine/gui/gui-manager';
import { AABB } from '../../../engine/math/aabb';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
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
          item = new HealItem();
          break;

        case ConsumableItemType.IncreaseCriticalChance:
          item = new CriticalChanceItem();
          break;

        case ConsumableItemType.MoreAttackCount:
          item = new AttackCountItem();
          break;

        case ConsumableItemType.MoreProtectCount:
          item = new ProtectCountItem();
          break;

        default:
          throw new Error(`Unknown item type: ${itemInfo.type}`);
      }

      item.count = itemInfo.consumable.count;
      const consRegion = GLOBAL.assets.planetAtlas.getRegion('blank.png');
      item.background = new Sprite(70, 70);
      item.background.position.set(45 + 80 * i++, player.background.height - 45, 2);
      item.background.setVerticesColor(1, 1, 1, 1.0);
      item.background.parent = player.background;
      item.background.setTextureRegion(consRegion, false);

      item.countText = new Text();
      item.countText.pivotPoint.set(1, 1);
      item.countText.position.set(item.background.width / 2 - 5, item.background.height / 2 - 5, 4);
      item.countText.color.set(1, 1, 1, 1.0);
      item.countText.shadowEnabled = true;
      item.countText.shadowColor.set(0, 0, 0, 1.0);
      item.countText.shadowOffset.set(1, 2);
      item.countText.parent = item.background;

      item.updateCountText();

      item.effectText = new Text();
      item.effectText.pivotPoint.set(0.5, 0.5);
      item.effectText.position.set(0, -12, 3);
      item.effectText.color.set(1, 1, 1, 1.0);
      item.effectText.shadowEnabled = true;
      item.effectText.shadowColor.set(0, 0, 0, 1.0);
      item.effectText.shadowOffset.set(1, 2);
      item.effectText.parent = item.background;

      item.hitBox = new AABB(
        item.background.absoluteMatrix.position.asVector2(),
        item.background.size,
      );

      if (item instanceof HealItem) {
        item.background.setVerticesColor(0.1, 0.7, 0.1, 1.0);
        item.effectText.text = '+З';
      } else if (item instanceof AttackCountItem) {
        item.background.setVerticesColor(0.7, 0.1, 0.1, 1.0);
        item.effectText.text = '+А';
      } else if (item instanceof CriticalChanceItem) {
        item.background.setVerticesColor(0.7, 0.7, 0.1, 1.0);
        item.effectText.text = '+К';
      } else if (item instanceof ProtectCountItem) {
        item.background.setVerticesColor(0.1, 0.1, 0.7, 1.0);
        item.effectText.text = '+Щ';
      }

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
      result.push(cons.background);
    }

    return result;
  }

  getTextsToRender(): Text[] {
    const result: Text[] = [];

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
