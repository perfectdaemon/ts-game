import { Vector2 } from '../../../engine/math/vector2';
import { PlayerData, ShipCellData } from '../player-data';

export class EnemyGenerator {
  static generate(power: number): PlayerData {
    const cellVariant: ShipCellData[] = CELL_VARIANTS[1].cells
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
