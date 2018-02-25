import { TextureRegion } from '../../engine/render/texture-atlas';
import { renderer } from '../../engine/render/webgl';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Enemy } from './enemy';
import { GAME_STATE } from './game-state';
import { Pool } from './pool/pool';

const spawnTimer = 5;
const maxActiveEnemyCount = 8;

export class EnemyManager {
  pool: Pool<Enemy>;
  spriteBatch: SpriteBatch = new SpriteBatch();
  spawnTimer: number = spawnTimer;
  activeEnemyCount: number = 0;

  constructor(public enemyTextureRegions: TextureRegion[]) {
    this.pool = new Pool<Enemy>(() => this.newEnemy(), 10);
  }

  update(deltaTime: number): void {
    for (const enemy of this.pool.poolObjects) {
      enemy.update(deltaTime);
      enemy.moveDirection
        .set(GAME_STATE.player.body.position)
        .subtractFromSelf(enemy.body.position)
        .normalize();
    }

    this.spawnTimer -= deltaTime;
    if (this.spawnTimer < 0 && this.activeEnemyCount < maxActiveEnemyCount) {
      this.spawn();
      this.spawnTimer = spawnTimer;
      ++this.activeEnemyCount;
    }
  }

  draw(): void {
    this.spriteBatch.start();
    for (const enemy of this.pool.poolObjects) {
      this.spriteBatch.drawSingle(enemy.body);
    }
    this.spriteBatch.finish();
  }

  spawn(): void {
    const enemy = this.pool.get();
    enemy.body.position.set(
      Math.random() < 0.5 ? -100 : renderer.width + 100,
      Math.random() * renderer.height,
      1);
  }

  private newEnemy(): Enemy {
    const enemySkinNumber = Math.floor(Math.random() * (this.enemyTextureRegions.length));
    return new Enemy(this.enemyTextureRegions[enemySkinNumber], 2);
  }
}
