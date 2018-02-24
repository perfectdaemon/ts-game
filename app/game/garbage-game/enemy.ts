import { isEqual } from '../../engine/math/math-base';
import { Vector2 } from '../../engine/math/vector2';
import { Vector4 } from '../../engine/math/vector4';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { Sprite } from '../../engine/scene/sprite';
import { GAME_STATE } from './game-state';
import { AABB } from './physics/aabb';
import { IPoolItem } from './pool/ipool-item';

const defaultEnemySpeed = 50;
const defaultEnemyMaxHealth = 2;
const colliderReduceSize = 30;
const defaultHitTimer = 0.1;

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

  private verticesColor: Vector4 = new Vector4(1, 1, 1, 1);
  private hitTimer: number = 0;

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
    this.hitTimer = 0;
    this.verticesColor.set(1, 1, 1, 1);
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

    this.body.setVerticesColor(this.verticesColor);

    if (this.hitTimer > 0) {
      this.hitTimer -= deltaTime;

      if (this.hitTimer <= 0) {
        this.verticesColor.set(1, 1, 1, 1);
      }
    }
  }

  hit(damage: number): void {
    this.health -= damage;

    this.hitTimer = defaultHitTimer;
    this.verticesColor.set(1, 0.5, 0.5, 0.5);


    if (this.health <= 0) {
      this.active = false;
      this.onDeactivate();
      GAME_STATE.pickupManager.spawnCoin(this.collider.center, 1);
    }
  }
}
