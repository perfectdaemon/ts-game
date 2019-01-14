import { PlayerData } from '../player-data';

export class InputTreasureGameState {
  player: PlayerData;
  treasure: TreasureData;
}

export class TreasureData {
  type: TreasureType;
  cost: number;
  credits: number;
}

export enum TreasureType { Enemy, Chest }

export const TREASURE_GAME_STATE = new InputTreasureGameState();
