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
}

export enum ConsumableItemType { Heal, MoreAttackCount, MoreProtectCount, IncreaseCriticalChance }
