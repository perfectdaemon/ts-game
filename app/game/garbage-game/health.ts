import { SOUNDS } from './audio-manager';
import { GAME_STATE } from './game-state';
import { PickupItem } from './pickup-item';

const defaultHealingAmount = 2;

export class Health extends PickupItem {
  healingAmount: number = defaultHealingAmount;

  onPickup(): void {
    super.onPickup();
    GAME_STATE.player.health += this.healingAmount;
    GAME_STATE.audioManager.play(SOUNDS.powerup);
  }
}