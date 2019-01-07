export class PlayerData {
  cellCount: number;
  shipHealth: number;
  shipMaxHealth: number;

  attackCount: number;

  attackDamageMin: number;
  attackDamageMax: number;
  criticalChance: number;

  protectCount: number;
  protectMultiplier: number;

  consumableItems: {
    type: ConsumableItemType;
    count: number;
  }[];

  credits: number;
  inventorySize: number;
  inventory: InventoryItemData[];
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
  };

  shield?: {
    shieldMultiplier: number;
  };

  engine?: {
    speedBoost: number;
    dodgeMultiplier: number;
  };

  misc?: {
    count: number;
  };
}

export enum ConsumableItemType { Heal, MoreAttackCount, MoreProtectCount, IncreaseCriticalChance }

export enum ItemType { Weapon, Shield, Engine, Misc }

export enum ItemRarity { Usual, Special, Legendary }
