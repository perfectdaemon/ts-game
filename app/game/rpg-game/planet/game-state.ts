import { PlayerData } from '../player-data';

export class InputGameState {
  player: PlayerData;
}

export class PlanetData {
  name: string;

}

export const PLANET_GAME_STATE = new InputGameState();
