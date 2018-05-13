import { IPoolItem } from '../../engine/helpers/pool/ipool-item';
import { Circle } from '../../engine/math/circle';
import { Vector2 } from '../../engine/math/vector2';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { renderer } from '../../engine/render/webgl';
import { Sprite } from '../../engine/scene/sprite';
import { BulletOwner } from './bullet-owner.enum';
import { GAME_STATE } from './game-state';

const bulletDamage = 1;
const bulletSpeed = 800;

export class Bullet implements IPoolItem {
  active: boolean = false;

  sprite: Sprite;
  collider: Circle;
  moveVector: Vector2 = new Vector2();
  bulletDamage: number = bulletDamage;
  bulletOwner: BulletOwner = BulletOwner.Player;
  bulletSpeed: number = bulletSpeed;

  private moveVectorN: Vector2 = new Vector2();

  constructor(textureRegion: TextureRegion, multSize: number = 1) {
    this.sprite = new Sprite();
    this.sprite.position.z = 1;
    this.sprite.setTextureRegion(textureRegion, true);
    this.sprite.multSize(multSize);

    this.collider = new Circle(new Vector2(), 1);
  }

  onActivate(): void {
    this.sprite.visible = true;
  }
  onDeactivate(): void {
    this.sprite.visible = false;
  }

  update(deltaTime: number): void {
    if (!this.active) { return; }

    this.moveVectorN = this.moveVector.multiplyNum(deltaTime * this.bulletSpeed);
    this.sprite.position.addToSelf(this.moveVectorN);
    this.collider.center.set(this.sprite.position);

    if (this.isOutOfScreen()) {
      this.active = false;
      this.onDeactivate();
    }

    switch (this.bulletOwner) {
      case BulletOwner.Player: this.checkHitAgainstEnemies(); break;
      case BulletOwner.Enemy: this.checkHitAgainstPlayer(); break;
    }
  }

  private checkHitAgainstEnemies(): void {
    for (const enemy of GAME_STATE.enemyManager.pool.poolObjects) {
      if (!enemy.active) { continue; }

      if (enemy.collider.overlaps(this.collider)) {
        enemy.hit(this.bulletDamage);
        this.active = false;
        this.onDeactivate();
        return;
      }
    }
  }

  private checkHitAgainstPlayer(): void {
    if (!this.collider.overlaps(GAME_STATE.player.collider)) {
      return;
    }

    GAME_STATE.player.hit(this.bulletDamage);
    this.active = false;
    this.onDeactivate();
  }

  private isOutOfScreen(): boolean {
    return this.sprite.position.x < 0 || this.sprite.position.x > renderer.width
      || this.sprite.position.y < 0 || this.sprite.position.y > renderer.height;
  }
}
