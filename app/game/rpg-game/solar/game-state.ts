import { ActionManager } from '../../../engine/helpers/action-manager/action-manager';
import { Planet } from './planet';
import { Player } from './player';
import { TargetCursor } from './target-cursor';

export class GameState {
  player: Player;
  targetCursor: TargetCursor;

  planets: Planet[];

  actionManager: ActionManager;

  deltaTime: number;

  reset(): void {
    this.player = Player.buildPlayer();
    this.targetCursor = TargetCursor.build();

    this.planets = [
      Planet.buildPlanet1(),
    ];

    this.actionManager = new ActionManager();

    this.deltaTime = 0;
  }
}

export const GAME_STATE = new GameState();
