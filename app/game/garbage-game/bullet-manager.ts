import { Vector2 } from '../../engine/math/vector2';
import { Vector4 } from '../../engine/math/vector4';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Sprite } from '../../engine/scene/sprite';
import { Bullet } from './bullet';
import { BulletOwner } from './bullet-owner.enum';
import { Pool } from './pool/pool';

const defaultPlayerBulletSpeed = 800;
const defaultEnemyBulletSpeed = 500;
const playerBulletColor = new Vector4(1, 1, 1, 1);
const enemyBulletColor = new Vector4(0, 0.0, 1 , 1);

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

  fire(from: Vector2, moveVector: Vector2, bulletOwner: BulletOwner): void {
    const bullet = this.bulletsPool.get();
    bullet.sprite.position.set(from);
    bullet.moveVector.set(moveVector);
    bullet.sprite.rotation = moveVector.toAngle();
    bullet.bulletOwner = bulletOwner;
    switch (bulletOwner) {
      case BulletOwner.Enemy:
        bullet.bulletSpeed = defaultEnemyBulletSpeed;
        bullet.sprite.setVerticesColor(enemyBulletColor);
        break;
      case BulletOwner.Player:
        bullet.bulletSpeed = defaultPlayerBulletSpeed;
        bullet.sprite.setVerticesColor(playerBulletColor);
        break;
    }
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
