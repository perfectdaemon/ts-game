import { Vector2 } from '../../engine/math/vector2';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Coin } from './coin';
import { GAME_STATE } from './game-state';
import { Pool } from './pool/pool';

export class PickupManager {
  coinPool: Pool<Coin>;
  spriteBatch: SpriteBatch = new SpriteBatch();

  constructor(public coinsTextureRegions: TextureRegion[]) {
    this.coinPool = new Pool<Coin>(() => this.newCoin(), 10);
  }

  update(deltaTime: number): void {
    for (const coin of this.coinPool.poolObjects) {
      if (!coin.active) { continue; }
      coin.update(deltaTime);
      if (coin.collider.overlaps(GAME_STATE.player.collider)) {
        coin.onPickup();
        console.log('pickup');
      }
    }
  }

  draw(): void {
    this.spriteBatch.start();
    for (const coin of this.coinPool.poolObjects) {
      this.spriteBatch.drawSingle(coin.sprite);
    }
    this.spriteBatch.finish();
  }

  spawnCoin(position: Vector2, amount: number): void {
    const coin = this.coinPool.get();
    coin.amount = amount;
    coin.sprite.position.set(position);
    coin.collider.center.set(position);
  }

  private newCoin(): Coin {
    return new Coin(this.coinsTextureRegions, 1);
  }
}
