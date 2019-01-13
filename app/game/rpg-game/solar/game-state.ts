import { ActionManager } from '../../../engine/helpers/action-manager/action-manager';
import { PLAYER_DATA_START } from '../assets/player-data.const';
import { PlayerData } from '../player-data';
import { Planet } from './planet';
import { Player } from './player';
import { TargetCursor } from './target-cursor';

export class GameState {
  playerData: PlayerData;

  player: Player;
  targetCursor: TargetCursor;

  planets: Planet[];

  planetToLand: Planet | undefined;

  actionManager: ActionManager;

  reset(): void {
    this.playerData = PLAYER_DATA_START;

    this.player = Player.buildPlayer();
    this.targetCursor = TargetCursor.build();
    this.planetToLand = undefined;

    this.planets = [
      Planet.buildPlanet1(),
    ];

    this.actionManager = new ActionManager();
  }
}

export const GAME_STATE = new GameState();
