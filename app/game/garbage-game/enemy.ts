import { Vector2 } from '../../engine/math/vector2';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { Sprite } from '../../engine/scene/sprite';
import { AABB } from './physics/aabb';
import { IPoolItem } from './pool/ipool-item';

const defaultEnemySpeed = 50;
const defaultEnemyMaxHealth = 2;
const colliderReduceSize = 30;

export class Enemy implements IPoolItem {
  active: boolean = false;
  body: Sprite = new Sprite();

  moveDirection: Vector2 = new Vector2();
  speed: number = defaultEnemySpeed;

  maxHealth: number = defaultEnemyMaxHealth;
  health: number = this.maxHealth;

  collider: AABB;

  private moveIncrement: Vector2 = new Vector2();
  private flippedX: boolean = false;

  constructor(textureRegion: TextureRegion, multSize: number = 1) {
    this.body = new Sprite();
    this.body.position.z = 1;
    this.body.setTextureRegion(textureRegion, true);
    this.body.multSize(multSize);

    this.collider = new AABB(
      new Vector2(),
      new Vector2(this.body.width - colliderReduceSize, this.body.height - colliderReduceSize));
  }

  onActivate(): void {
    this.body.visible = true;
    this.health = this.maxHealth;
  }

  onDeactivate(): void {
    this.body.visible = false;
  }

  update(deltaTime: number): void {
    if (!this.active) { return; }

    this.moveIncrement
      .set(this.moveDirection)
      .multiplyNumSelf(deltaTime * this.speed);

    this.body.position.addToSelf(this.moveIncrement);
    this.collider.center.set(this.body.position);

    if (this.moveDirection.x > 0 && !this.flippedX) {
      this.flippedX = true;
      this.body.flipVerticallyCurrentTexCoords();
    } else if (this.moveDirection.x < 0 && this.flippedX) {
      this.flippedX = false;
      this.body.flipVerticallyCurrentTexCoords();
    }
  }

  hit(damage: number): void {
    this.health -= damage;

    if (this.health <= 0) {
      this.active = false;
      this.onDeactivate();
    }
  }
}
