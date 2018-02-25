import { Vector2 } from '../../engine/math/vector2';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Coin } from './coin';
import { GAME_STATE } from './game-state';
import { Health } from './health';
import { Pool } from './pool/pool';

export class PickupManager {
  coinPool: Pool<Coin>;
  healthPool: Pool<Health>;
  spriteBatch: SpriteBatch = new SpriteBatch();

  constructor(
    public coinsTextureRegions: TextureRegion[],
    public healthTextureRegion: TextureRegion,
  ) {
    this.coinPool = new Pool<Coin>(() => this.newCoin(), 10);
    this.healthPool = new Pool<Health>(() => this.newHealth(), 10);
  }

  update(deltaTime: number): void {
    for (const coin of this.coinPool.poolObjects) {
      if (!coin.active) { continue; }
      coin.update(deltaTime);
      if (coin.collider.overlaps(GAME_STATE.player.collider)) {
        coin.onPickup();
      }
    }

    for (const health of this.healthPool.poolObjects) {
      if (!health.active) { continue; }
      health.update(deltaTime);
      if (health.collider.overlaps(GAME_STATE.player.collider)) {
        health.onPickup();
      }
    }
  }

  draw(): void {
    this.spriteBatch.start();
    for (const coin of this.coinPool.poolObjects) {
      this.spriteBatch.drawSingle(coin.sprite);
    }
    for (const health of this.healthPool.poolObjects) {
      this.spriteBatch.drawSingle(health.sprite);
    }
    this.spriteBatch.finish();
  }

  spawnCoin(position: Vector2, amount: number): void {
    const coin = this.coinPool.get();
    coin.amount = amount;
    coin.sprite.position.set(position);
    coin.collider.center.set(position);
  }

  spawnHealth(position: Vector2, amount: number): void {
    const health = this.healthPool.get();
    health.healingAmount = amount;
    health.sprite.position.set(position);
    health.collider.center.set(position);
  }

  private newCoin(): Coin {
    return new Coin(this.coinsTextureRegions, 1);
  }

  private newHealth(): Health {
    return new Health([this.healthTextureRegion], 1);
  }
}
