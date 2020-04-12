import { Vector2 } from '../../engine/math/vector2';

export class GameSettings {
  constructor(
    public infectedCount: number,
    public infectedSpeed: number,
    public infectedStartCount: number,
    public infectionDistanceQ: number,
    public infectedDeathChance: number,
    public infectedTimeToDeathOrCure: Vector2,

    public playerSpeed: number,
    public playerRotationSpeed: number,
    public playerPickupDistance: number,
    public playerCapacity: number,
  ) {}
}

export const GAME_SETTINGS: GameSettings = {
  infectedCount: 100,
  infectedSpeed: 30,
  infectedStartCount: 5,
  infectionDistanceQ: 16 * 16,
  infectedDeathChance: 0.3,
  infectedTimeToDeathOrCure: new Vector2(7, 14),

  playerSpeed: 100,
  playerRotationSpeed: 100,
  playerPickupDistance: 16 * 16,
  playerCapacity: 10,
};
