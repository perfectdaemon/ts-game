import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { div } from '../../../engine/math/math-base';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { SOUNDS } from '../data-assets/sound.data';
import { GLOBAL } from '../global';
import { ConsumableItemType, InventoryItemData, ItemRarity, ItemType } from '../player-data';
import { PlayerDataExtensions } from '../player-data-extensions';
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

      const cell = new InventoryCell(cellX, cellY, gui, itemData);
      cell.back.onClick = () => {
        GLOBAL.assets.audioManager.playSound(SOUNDS.select);
        this.onClick(cell);
      };
      this.cells.push(cell);
    }
  }

  onClick: (cell: InventoryCell) => void = (cell) => { };

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

  addItemToInventory(item: BaseItem): boolean {
    if (item.type === ItemType.Consumable) {
      const consItem = item as ConsumableItem;
      const itemToStack = this.cells
        .filter(it => it.item && it.item.type === ItemType.Consumable)
        .map(it => it.item as ConsumableItem)
        .filter(it => it.consType === consItem.consType);

      if (itemToStack.length === 1) {
        itemToStack[0].count += consItem.count;
        itemToStack[0].cost += consItem.cost;
        return true;
      }
    }

    const emptyCells = this.cells.filter(it => !it.item);

    if (emptyCells.length === 0) {
      return false;
    }

    emptyCells[0].setItem(item);
    return true;
  }
}

export class InventoryCell {
  back: GuiButton;
  item?: BaseItem;

  constructor(x: number, y: number, gui: GuiManager, itemData?: InventoryItemData) {
    const region = GLOBAL.assets.solarAtlas.getRegion('inventory_cell.png');

    this.back = new GuiButton();
    this.back.sprite.position.set(x, y, 5);
    this.back.sprite.setTextureRegion(region, true);
    this.back.sprite.setVerticesAlpha(0.5);
    this.back.label.visible = false;
    this.back.updateHitBox();

    this.back.onMouseOver = () => this.back.sprite.setVerticesAlpha(0.7);
    this.back.onMouseOut = () => this.back.sprite.setVerticesAlpha(0.5);

    gui.addElement(this.back);

    if (itemData == null) {
      return;
    }

    this.item = BaseItem.build(itemData);

    this.setItem(this.item);
  }

  setItem(item?: BaseItem) {
    this.item = item;

    if (!this.item) {
      this.back.sprite.setVerticesColor(1, 1, 1, 0.5);
      return;
    }

    this.item.sprite.parent = this.back.sprite;

    this.back.sprite.setVerticesColor(PlayerDataExtensions.getRarityColor(this.item.rarity, 0.5));
  }
}

export class BaseItem {
  static build(itemData: InventoryItemData): BaseItem {
    let itemRegionName: string;
    let item: BaseItem;
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
        weaponItem.addAttack = itemData.weapon.addAttack;

        itemRegionName = 'laser1.png';

        item = weaponItem;
        break;

      case ItemType.Shield:
        if (itemData.shield == null) {
          throw new Error(`ItemType is shield but no shield data provided`);
        }

        const shieldItem = new ShieldItem();
        shieldItem.shieldMultiplier = itemData.shield.shieldMultiplier;
        shieldItem.addProtect = itemData.shield.addProtect;

        itemRegionName = 'shield1.png';

        item = shieldItem;
        break;

      case ItemType.Engine:
        if (itemData.engine == null) {
          throw new Error(`ItemType is engine but no engine data provided`);
        }

        const engineItem = new EngineItem();
        engineItem.dodgeMultiplier = itemData.engine.dodgeMultiplier;
        engineItem.speedBoost = itemData.engine.speedBoost;

        itemRegionName = '';

        item = engineItem;
        break;

      case ItemType.Misc:
        if (itemData.misc == null) {
          throw new Error(`ItemType is misc but no misc data provided`);
        }

        const miscItem = new MiscItem();
        miscItem.count = itemData.misc.count;

        itemRegionName = '';

        item = miscItem;
        break;
      case ItemType.Consumable:
        if (itemData.consumable == null) {
          throw new Error(`ItemType is consumable but no consumable data provided`);
        }

        const consumableItem = new ConsumableItem();
        consumableItem.count = itemData.consumable.count;
        consumableItem.consType = itemData.consumable.type;
        itemRegionName = '';

        item = consumableItem;
        break;
      default:
        throw new Error(`Unknown item type: ${itemData.type}`);
    }

    item.cost = itemData.cost;
    item.name = itemData.name;
    item.rarity = itemData.rarity;
    item.type = itemData.type;

    const itemRegion = GLOBAL.assets.solarAtlas.getRegion(itemRegionName || 'blank.png');
    item.sprite = new Sprite(40, 40);
    item.sprite.setTextureRegion(itemRegion, !!itemRegionName);
    item.sprite.position.set(0, 0, 6);
    item.sprite.rotation = 45;
    item.sprite.width *= 0.6;
    item.sprite.height *= 0.6;
    item.sprite.setDefaultVertices();

    return item;
  }

  type: ItemType;
  rarity: ItemRarity;
  cost: number;

  name: string;

  sprite: Sprite;

  toItemData(): InventoryItemData {
    const itemData: InventoryItemData = {
      cost: this.cost,
      name: this.name,
      rarity: this.rarity,
      type: this.type,
    };

    return itemData;
  }
}

export class WeaponItem extends BaseItem {
  damageMin: number;
  damageMax: number;
  criticalChanceMultiplier?: number;
  shieldPiercing?: number;
  addAttack?: number;

  toItemData(): InventoryItemData {
    const itemData = super.toItemData();
    itemData.weapon = {
      damageMin: this.damageMin,
      damageMax: this.damageMax,
      shieldPiercing: this.shieldPiercing,
      criticalChanceMultiplier: this.criticalChanceMultiplier,
      addAttack: this.addAttack,
    };

    return itemData;
  }
}

export class ShieldItem extends BaseItem {
  shieldMultiplier: number;
  addProtect?: number;

  toItemData(): InventoryItemData {
    const itemData = super.toItemData();
    itemData.shield = {
      shieldMultiplier: this.shieldMultiplier,
      addProtect: this.addProtect,
    };

    return itemData;
  }
}

export class EngineItem extends BaseItem {
  speedBoost: number;
  dodgeMultiplier: number;

  toItemData(): InventoryItemData {
    const itemData = super.toItemData();
    itemData.engine = {
      dodgeMultiplier: this.dodgeMultiplier,
      speedBoost: this.speedBoost,
    };

    return itemData;
  }
}

export class MiscItem extends BaseItem {
  count: number;

  toItemData(): InventoryItemData {
    const itemData = super.toItemData();
    itemData.misc = {
      count: this.count,
    };

    return itemData;
  }
}

export class ConsumableItem extends BaseItem {
  consType: ConsumableItemType;
  count: number;

  toItemData(): InventoryItemData {
    const itemData = super.toItemData();
    itemData.consumable = {
      count: this.count,
      type: this.consType,
    };

    return itemData;
  }
}
