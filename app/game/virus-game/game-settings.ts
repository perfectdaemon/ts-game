export class GameSettings {
  constructor(
    public infectedCount: number,
    public infectedSpeed: number,
    public infectedStartCount: number,
    public infectionDistanceQ: number,

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

  playerSpeed: 100,
  playerRotationSpeed: 100,
  playerPickupDistance: 16 * 16,
  playerCapacity: 10,
};
