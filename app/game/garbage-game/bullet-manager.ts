import { Vector2 } from '../../engine/math/vector2';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Sprite } from '../../engine/scene/sprite';
import { Bullet } from './bullet';
import { Pool } from './pool/pool';

export class BulletManager {
  bulletsPool: Pool<Bullet>;
  spriteBatch: SpriteBatch = new SpriteBatch();

  constructor(public bulletTextureRegion: TextureRegion) {
    this.bulletsPool = new Pool<Bullet>(() => this.createBullet(), 50);
  }

  update(deltaTime: number): void {
    for (const bullet of this.bulletsPool.poolObjects) {
      bullet.update(deltaTime);
    }
  }

  fire(from: Vector2, moveVector: Vector2): void {
    const bullet = this.bulletsPool.get();
    bullet.sprite.position.set(from);
    bullet.moveVector.set(moveVector);
    bullet.sprite.rotation = moveVector.toAngle();
  }

  draw(): void {
    this.spriteBatch.start();
    for (const bullet of this.bulletsPool.poolObjects) {
      this.spriteBatch.drawSingle(bullet.sprite);
    }

    this.spriteBatch.finish();
  }

  private createBullet(): Bullet {
    return new Bullet(this.bulletTextureRegion, 1);
  }
}
