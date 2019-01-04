
export class InputFightGameState {
  humanData: PlayerData;
  enemyData: PlayerData;
}

export class PlayerData {
  playerType: PlayerType;

  cellCount: number;
  shipHealth: number;

  attackCount: number;

  attackDamageMin: number;
  attackDamageMax: number;
  criticalChance: number;

  protectCount: number;
  protectMultiplier: number;

  items: {
    type: ItemType;
    count: number;
  }[];
}

export enum PlayerType { Human, Ai }

export enum ItemType { Heal, MoreAttackCount, MoreProtectCount, IncreaseCriticalChance }

export const FIGHT_GAME_STATE = new InputFightGameState();
