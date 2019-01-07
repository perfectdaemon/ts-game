import { PlayerData } from '../player-data';

export class InputFightGameState {
  humanData: PlayerData;
  enemyData: PlayerData;
}

export const FIGHT_GAME_STATE = new InputFightGameState();
