import { InventoryItemData, PlayerData } from '../player-data';

export class InputGameState {
  player: PlayerData;
  planet: PlanetData;
}

export class PlanetData {
  name: string;
  shopSize: number;
  shopItems: InventoryItemData[];
}

export const PLANET_GAME_STATE = new InputGameState();
