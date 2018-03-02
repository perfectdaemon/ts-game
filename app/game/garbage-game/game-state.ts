import { AudioManager } from '../../engine/sound/audio-manager';
import { BulletManager } from './bullet-manager';
import { EnemyManager } from './enemy-manager';
import { Level } from './level';
import { PickupManager } from './pickup-manager';
import { Player } from './player';

export class GameState {
  currentLevel: Level;
  bulletManager: BulletManager;
  enemyManager: EnemyManager;
  player: Player;
  pickupManager: PickupManager;
  audioManager: AudioManager;
}

export const GAME_STATE = new GameState();
