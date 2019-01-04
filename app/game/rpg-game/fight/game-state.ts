
export class InputFightGameState {
  humanData: PlayerData;
  enemyData: PlayerData;
}

export class PlayerData {
  playerType: PlayerType;

  cellCount: number;
  shipHealth: number;

  attackCount: number;
  attackDamage: number;

  protectCount: number;
  protectMultiplier: number;
}

export enum PlayerType { Human, Ai }

export const FIGHT_GAME_STATE = new InputFightGameState();
