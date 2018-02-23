import { BulletManager } from './bullet-manager';
import { Level } from './level';

export class GameState {
  currentLevel: Level;
  bulletManager: BulletManager;
}

export const GAME_STATE = new GameState();
