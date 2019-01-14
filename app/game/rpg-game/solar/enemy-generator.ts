import { Vector2 } from '../../../engine/math/vector2';
import { ItemGenerator } from '../item-generator';
import { ItemType, PlayerData, ShipCellData } from '../player-data';

export class EnemyGenerator {
  static generate(power: number): PlayerData {
    const cellVariant: ShipCellData[] = CELL_VARIANTS[Math.floor(CELL_VARIANTS.length * Math.random())].cells
      .map(it => ({ position: it }));

    const data: PlayerData = {
      cells: cellVariant,
      credits: power * Math.random() * 150,
      criticalChance: 0.3 * power,
      criticalMultiplier: 2.0,
      shipMaxHealth: Math.ceil(125 * power),
      shipHealth: Math.ceil(125 * power),
      inventorySize: 0,
      inventory: [],
    };

    let maxWeapons = power;
    let maxShields = power;
    for (const cell of data.cells) {
      if (maxWeapons > 0) {
        maxWeapons -= 0.15;
        cell.item = ItemGenerator.generate(ItemType.Weapon, power);
      } else if (maxShields > 0) {
        maxShields -= 0.15;
        cell.item = ItemGenerator.generate(ItemType.Shield, power);
      }
    }

    return data;
  }
}

const CELL_VARIANTS = [
  {
    cells: [
      new Vector2(-50, 0),
      new Vector2(50, 0),
      new Vector2(-100, 100),
      new Vector2(100, 100),
      new Vector2(0, 125),
    ],
  },

  {
    cells: [
      new Vector2(0, 0),
      new Vector2(-100, 25),
      new Vector2(100, 25),
      new Vector2(-100, 125),
      new Vector2(100, 125),
      new Vector2(0, 150),
    ],
  },
];
