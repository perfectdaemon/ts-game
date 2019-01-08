import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { div } from '../../../engine/math/math-base';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { ConsumableItemType, InventoryItemData, ItemRarity, ItemType } from '../player-data';
import { IRenderable } from '../render-helper';

export class Inventory implements IRenderable {
  cells: InventoryCell[] = [];

  constructor(inventorySize: number, inventoryItems: InventoryItemData[], x: number, y: number, gui: GuiManager) {
    const cellPerRow = 8;
    const cellSize = 59;
    for (let i = 0; i < inventorySize; ++i) {
      const cellX = x + cellSize * (i % cellPerRow);
      const cellY = y + cellSize * (div(i, cellPerRow));

      const itemData = inventoryItems.length > i
        ? inventoryItems[i]
        : undefined;

      const cell = new InventoryCell(cellX, cellY, gui, itemData)
      cell.back.onClick = () => this.onClick(cell);
      this.cells.push(cell);
    }
  }

  onClick: (cell: InventoryCell) => void = (cell) => {};

  getSpritesToRender(): Sprite[] {
    const result: Sprite[] = [];

    for (const cell of this.cells) {
      if (cell.item != null) {
        result.push(cell.item.sprite);
      }
    }

    return result;
  }

  getTextsToRender(): Text[] {
    return [];
  }
}

export class InventoryCell {
  back: GuiButton;
  item?: BaseItem;

  constructor(x: number, y: number, gui: GuiManager, itemData?: InventoryItemData) {
    const region = GLOBAL.assets.planetAtlas.getRegion('inventory_cell.png');

    this.back = new GuiButton();
    this.back.sprite.position.set(x, y, 5);
    this.back.sprite.setTextureRegion(region, true);
    this.back.sprite.setVerticesAlpha(0.3);
    this.back.label.visible = false;
    this.back.updateHitBox();

    this.back.onMouseOver = () => this.back.sprite.setVerticesAlpha(0.7);
    this.back.onMouseOut = () => this.back.sprite.setVerticesAlpha(0.3);

    gui.addElement(this.back);

    if (itemData == null) {
      return;
    }

    let itemRegionName: string;

    switch (itemData.type) {
      case ItemType.Weapon:
        if (itemData.weapon == null) {
          throw new Error(`ItemType is weapon but no weapon data provided`);
        }

        const weaponItem = new WeaponItem();

        weaponItem.damageMin = itemData.weapon.damageMin;
        weaponItem.damageMax = itemData.weapon.damageMax;
        weaponItem.shieldPiercing = itemData.weapon.shieldPiercing;
        weaponItem.criticalChanceMultiplier = itemData.weapon.criticalChanceMultiplier;

        itemRegionName = 'laser1.png';

        this.item = weaponItem;
        break;

      case ItemType.Shield:
        if (itemData.shield == null) {
          throw new Error(`ItemType is shield but no shield data provided`);
        }

        const shieldItem = new ShieldItem();
        shieldItem.shieldMultiplier = itemData.shield.shieldMultiplier;

        itemRegionName = 'shield1.png';

        this.item = shieldItem;
        break;

      case ItemType.Engine:
        if (itemData.engine == null) {
          throw new Error(`ItemType is engine but no engine data provided`);
        }

        const engineItem = new EngineItem();
        engineItem.dodgeMultiplier = itemData.engine.dodgeMultiplier;
        engineItem.speedBoost = itemData.engine.speedBoost;

        itemRegionName = '';

        this.item = engineItem;
        break;

      case ItemType.Misc:
        if (itemData.misc == null) {
          throw new Error(`ItemType is misc but no misc data provided`);
        }

        const miscItem = new MiscItem();
        miscItem.count = itemData.misc.count;

        itemRegionName = '';

        this.item = miscItem;
        break;
      case ItemType.Consumable:
        if (itemData.consumable == null) {
          throw new Error(`ItemType is consumable but no consumable data provided`);
        }

        const consumableItem = new ConsumableItem();
        consumableItem.count = itemData.consumable.count;
        consumableItem.consType = itemData.consumable.type;
        itemRegionName = '';

        this.item = consumableItem;
        break;
      default:
        throw new Error(`Unknown item type: ${itemData.type}`);
    }

    this.item.cost = itemData.cost;
    this.item.name = itemData.name;
    this.item.rarity = itemData.rarity;
    this.item.type = itemData.type;

    const itemRegion = GLOBAL.assets.planetAtlas.getRegion(itemRegionName || 'blank.png');
    this.item.sprite = new Sprite(40, 40);
    this.item.sprite.setTextureRegion(itemRegion, !!itemRegionName);
    this.item.sprite.position.set(0, 0, 6);
    this.item.sprite.parent = this.back.sprite;
    this.item.sprite.rotation = 45;
    this.item.sprite.width *= 0.6;
    this.item.sprite.height *= 0.6;
    this.item.sprite.setDefaultVertices();

    switch (itemData.rarity) {
      case ItemRarity.Usual:
        this.back.sprite.setVerticesColor(1, 1, 1, 0.5);
        break;
      case ItemRarity.Special:
        this.back.sprite.setVerticesColor(0.5, 0.5, 1.0, 0.5);
        break;
      case ItemRarity.Legendary:
        this.back.sprite.setVerticesColor(206 / 255, 92 / 255, 0, 0.5);
        break;
    }
  }
}

export class BaseItem {
  type: ItemType;
  rarity: ItemRarity;
  cost: number;

  name: string;

  sprite: Sprite;
}

export class WeaponItem extends BaseItem {
  damageMin: number;
  damageMax: number;
  criticalChanceMultiplier?: number;
  shieldPiercing?: number;
}

export class ShieldItem extends BaseItem {
  shieldMultiplier: number;
}

export class EngineItem extends BaseItem {
  speedBoost: number;
  dodgeMultiplier: number;
}

export class MiscItem extends BaseItem {
  count: number;
}

export class ConsumableItem extends BaseItem {
  consType: ConsumableItemType;
  count: number;
}
