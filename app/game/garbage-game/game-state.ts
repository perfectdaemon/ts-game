import { BulletManager } from './bullet-manager';
import { EnemyManager } from './enemy-manager';
import { Level } from './level';
import { Player } from './player';

export class GameState {
  currentLevel: Level;
  bulletManager: BulletManager;
  enemyManager: EnemyManager;
  player: Player;
}

export const GAME_STATE = new GameState();
