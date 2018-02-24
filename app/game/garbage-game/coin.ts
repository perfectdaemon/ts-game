import { TextureRegion } from '../../engine/render/texture-atlas';
import { GAME_STATE } from './game-state';
import { PickupItem } from './pickup-item';

const defaultCoinAmount = 1;

export class Coin extends PickupItem {
  amount: number = defaultCoinAmount;

  constructor(_textureRegions: TextureRegion[], _multSize: number = 1) {
    super(_textureRegions, _multSize);
    this.collider.radius *= 3;
  }

  onPickup(): void {
    super.onPickup();
    GAME_STATE.player.money += this.amount;
  }

}
