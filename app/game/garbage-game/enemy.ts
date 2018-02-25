import { isEqual } from '../../engine/math/math-base';
import { Vector2 } from '../../engine/math/vector2';
import { Vector4 } from '../../engine/math/vector4';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { Sprite } from '../../engine/scene/sprite';
import { SOUNDS } from './audio-manager';
import { BulletOwner } from './bullet-owner.enum';
import { GAME_STATE } from './game-state';
import { AABB } from './physics/aabb';
import { IPoolItem } from './pool/ipool-item';

const defaultEnemySpeed = 50;
const defaultEnemyMaxHealth = 2;
const colliderReduceSize = 30;
const defaultHitTimer = 0.1;
const defaultShotTimer = 1.2;
const defaultEnemyAccuracy = 0.65;
const defaultEnemyHealthDropChance = 0.3;

export class Enemy implements IPoolItem {
  active: boolean = false;
  body: Sprite = new Sprite();
  shadow: Sprite = new Sprite();

  moveDirection: Vector2 = new Vector2();
  speed: number = defaultEnemySpeed;
  accuracy: number = defaultEnemyAccuracy;

  maxHealth: number = defaultEnemyMaxHealth;
  health: number = this.maxHealth;

  collider: AABB;

  private moveIncrement: Vector2 = new Vector2();
  private flippedX: boolean = false;

  private verticesColor: Vector4 = new Vector4(1, 1, 1, 1);
  private hitTimer: number = 0;

  private shotTimer: number = defaultShotTimer;
  private weaponFireDirection: Vector2 = new Vector2();

  constructor(textureRegion: TextureRegion, multSize: number = 1) {
    this.body.position.z = 5;
    this.body.setTextureRegion(textureRegion, true);
    this.body.multSize(multSize);

    this.shadow.position.set(5, 15, -1);
    this.shadow.setTextureRegion(textureRegion, true);
    this.shadow.multSize(multSize);
    this.shadow.setVerticesColor(new Vector4(0, 0, 0, 0.5));
    this.shadow.parent = this.body;

    this.collider = new AABB(
      new Vector2(),
      new Vector2(this.body.width - colliderReduceSize, this.body.height - colliderReduceSize));
  }

  onActivate(): void {
    this.body.visible = true;
    this.shadow.visible = true;
    this.health = this.maxHealth;
    this.hitTimer = 0;
    this.verticesColor.set(1, 1, 1, 1);
    this.shotTimer = defaultShotTimer;
    this.accuracy = defaultEnemyAccuracy;
    this.flippedX = false;
  }

  onDeactivate(): void {
    this.body.visible = false;
    this.shadow.visible = false;
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
      this.shadow.flipVerticallyCurrentTexCoords();
    } else if (this.moveDirection.x < 0 && this.flippedX) {
      this.flippedX = false;
      this.body.flipVerticallyCurrentTexCoords();
      this.shadow.flipVerticallyCurrentTexCoords();
    }

    this.body.setVerticesColor(this.verticesColor);

    if (this.hitTimer > 0) {
      this.hitTimer -= deltaTime;

      if (this.hitTimer <= 0) {
        this.verticesColor.set(1, 1, 1, 1);
      }
    }

    this.shotTimer -= deltaTime;
    if (this.shotTimer <= 0) {
      this.shootPlayer();
      this.shotTimer = defaultShotTimer;
    }
  }

  hit(damage: number): void {
    GAME_STATE.audioManager.play(SOUNDS.hit);

    this.health -= damage;

    this.hitTimer = defaultHitTimer;
    this.verticesColor.set(1, 0.5, 0.5, 0.5);

    if (this.health <= 0) {
      this.active = false;
      this.onDeactivate();
      --GAME_STATE.enemyManager.activeEnemyCount;
      GAME_STATE.enemyManager.markEnemyKilled();

      // coin spawn
      GAME_STATE.pickupManager.spawnCoin(this.getRandomSpawnPosition(), 1);

      // health spawn
      if (Math.random() <= defaultEnemyHealthDropChance) {
        GAME_STATE.pickupManager.spawnHealth(this.getRandomSpawnPosition(), 2);
      }
    }
  }

  private shootPlayer(): void {
    this.weaponFireDirection
      .set(-this.moveDirection.y, this.moveDirection.x)
      .multiplyNumSelf(0.5 - Math.random())
      .multiplyNumSelf(1 - this.accuracy)
      .addToSelf(this.moveDirection);
    GAME_STATE.bulletManager.fire(this.collider.center, this.weaponFireDirection, BulletOwner.Enemy);
    GAME_STATE.audioManager.play(SOUNDS.shoot);
  }

  private getRandomSpawnPosition(): Vector2 {
    return new Vector2()
      .set(this.collider.center)
      .addToSelf(
        -this.collider.halfSize.x + 2 * Math.random() * this.collider.halfSize.x,
        -this.collider.halfSize.y + 2 * Math.random() * this.collider.halfSize.y);
  }
}
