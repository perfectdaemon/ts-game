import { TextureRegion } from '../../engine/render/texture-atlas';
import { SOUNDS } from './data-assets/sounds.data';
import { GAME_STATE } from './game-state';
import { PickupItem } from './pickup-item';

const defaultCoinAmount = 1;

export class Coin extends PickupItem {
  amount: number = defaultCoinAmount;

  onPickup(): void {
    super.onPickup();
    GAME_STATE.player.money += this.amount;
    GAME_STATE.audioManager.playSound(SOUNDS.coin);
  }
}
