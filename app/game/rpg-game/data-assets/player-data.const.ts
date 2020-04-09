import { Vector2 } from '../../../engine/math/vector2';
import { ConsumableItemType, ItemRarity, ItemType, PlayerData } from '../player-data';

export const CREDITS_GOAL: number = 4000;

export const PLAYER_DATA_START: PlayerData = {
  cells: [
    {
      position: new Vector2(-50, 0),
      item: {
        type: ItemType.Weapon,
        name: 'Ракетница',
        cost: 100,
        rarity: ItemRarity.Usual,
        weapon: {
          damageMin: 4,
          damageMax: 8,
        },
      },
    },
    {
      position: new Vector2(50, 0),
      item: {
        type: ItemType.Shield,
        name: 'Генератор щита',
        cost: 100,
        rarity: ItemRarity.Usual,
        shield: {
          shieldMultiplier: 0.3,
        },
      },
    },
    {
      position: new Vector2(-100, 100),
    },
    {
      position: new Vector2(100, 100),
    },
    {
      position: new Vector2(0, 125),
    },
  ],
  credits: 100,
  criticalChance: 0.1,
  criticalMultiplier: 2.0,
  inventorySize: 16,
  inventory: [
    {
      type: ItemType.Consumable,
      consumable: {
        type: ConsumableItemType.Heal,
        count: 2,
      },
      cost: 100,
      rarity: ItemRarity.Special,
      name: 'Лечение',
    },
    {
      type: ItemType.Consumable,
      consumable: {
        type: ConsumableItemType.IncreaseCriticalChance,
        count: 2,
      },
      cost: 100,
      rarity: ItemRarity.Special,
      name: '+ Шанс крит. урона',
    },
    {
      type: ItemType.Consumable,
      consumable: {
        type: ConsumableItemType.MoreProtectCount,
        count: 2,
      },
      cost: 100,
      rarity: ItemRarity.Special,
      name: '+1 Защита',
    },
    {
      type: ItemType.Consumable,
      consumable: {
        type: ConsumableItemType.MoreAttackCount,
        count: 2,
      },
      cost: 100,
      rarity: ItemRarity.Special,
      name: '+1 Атака',
    },
  ],
  shipMaxHealth: 100,
  shipHealth: 100,
};
