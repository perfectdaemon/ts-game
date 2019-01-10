import { Vector2 } from '../../engine/math/vector2';

export class PlayerData {
  shipHealth: number;
  shipMaxHealth: number;

  criticalChance: number;
  criticalMultiplier: number;

  credits: number;
  inventorySize: number;
  inventory: InventoryItemData[];
  cells: ShipCellData[];
}

export class InventoryItemData {
  type: ItemType;
  rarity: ItemRarity;
  cost: number;
  name: string;

  weapon?: {
    damageMin: number;
    damageMax: number;
    criticalChanceMultiplier?: number;
    shieldPiercing?: number;
    addAttack?: number;
  };

  shield?: {
    shieldMultiplier: number;
    addProtect?: number;
  };

  engine?: {
    speedBoost: number;
    dodgeMultiplier: number;
  };

  misc?: {
    count: number;
  };

  consumable?: {
    type: ConsumableItemType;
    count: number;
  };
}

export class ShipCellData {
  position: Vector2;
  item?: InventoryItemData;
}

export enum ConsumableItemType { Heal, MoreAttackCount, MoreProtectCount, IncreaseCriticalChance }

export enum ItemType { Weapon, Shield, Engine, Misc, Consumable }

export enum ItemRarity { Usual, Special, Legendary }
