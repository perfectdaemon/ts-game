import { clamp } from '../../engine/math/math-base';
import { SOUNDS } from './audio-manager';
import { GAME_STATE } from './game-state';
import { PickupItem } from './pickup-item';

const defaultHealingAmount = 2;

export class Health extends PickupItem {
  healingAmount: number = defaultHealingAmount;

  onPickup(): void {
    super.onPickup();
    GAME_STATE.player.health = clamp(GAME_STATE.player.health + this.healingAmount, 0, 10);
    GAME_STATE.audioManager.play(SOUNDS.powerup);
  }
}
