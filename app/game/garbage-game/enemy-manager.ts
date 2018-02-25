import { TextureRegion } from '../../engine/render/texture-atlas';
import { renderer } from '../../engine/render/webgl';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Enemy } from './enemy';
import { GAME_STATE } from './game-state';
import { Pool } from './pool/pool';

const spawnTimer = 5;
const spawnTimerDec = 0.5;

const maxActiveEnemyCount = 4;
const maxActiveEnemyCountInc = 2;

const enemiesForWave = 10;
const enemiesForWaveInc = 1;

const enemyMaxHealth = 2;
const enemyMaxHealthInc = 0.5;

const enemySpeed = 50;
const enemySpeedInc = 5;

export class EnemyManager {
  wavesPassed: number = 0;
  enemiesKilledTotal: number = 0;
  enemiesKilledInWave: number = 0;
  enemiesSpawnedInWave: number = 0;

  enemyMaxHealth: number = enemyMaxHealth;
  enemiesForWave: number = enemiesForWave;
  maxActiveEnemyCount: number = maxActiveEnemyCount;
  enemySpeed: number = enemySpeed;

  pool: Pool<Enemy>;
  spriteBatch: SpriteBatch = new SpriteBatch();
  spawnTimer: number = spawnTimer;
  spawnTimerValue: number = spawnTimer;
  activeEnemyCount: number = 0;

  private waveNumberElement: HTMLElement;
  private enemyRemainElement: HTMLElement;
  private totalKilledElement: HTMLElement;

  constructor(public enemyTextureRegions: TextureRegion[]) {
    this.pool = new Pool<Enemy>(() => this.newEnemy(), 10);
    this.waveNumberElement = document.getElementById('hudWaveNumber') as HTMLElement;
    this.enemyRemainElement = document.getElementById('hudEnemyRemain') as HTMLElement;
    this.totalKilledElement = document.getElementById('hudTotalKilled') as HTMLElement;
  }

  update(deltaTime: number): void {
    for (const enemy of this.pool.poolObjects) {
      enemy.update(deltaTime);
      enemy.moveDirection
        .set(GAME_STATE.player.body.position)
        .subtractFromSelf(enemy.body.position)
        .normalize();
    }

    this.checkSpawn(deltaTime);
  }

  draw(): void {
    this.spriteBatch.start();
    for (const enemy of this.pool.poolObjects) {
      this.spriteBatch.drawSingle(enemy.body);
    }
    this.spriteBatch.finish();

    this.waveNumberElement.innerHTML = this.wavesPassed.toFixed(0);
    this.enemyRemainElement.innerHTML = (this.enemiesForWave - this.enemiesKilledInWave).toFixed(0);
    this.totalKilledElement.innerHTML = this.enemiesKilledTotal.toFixed(0);
  }

  spawn(): void {
    const enemy = this.pool.get();
    enemy.health = this.enemyMaxHealth;
    enemy.speed = this.enemySpeed;
    enemy.body.position.set(
      Math.random() < 0.5 ? -65 : renderer.width + 65,
      Math.random() * renderer.height,
      1);
  }

  markEnemyKilled(): void {
    ++this.enemiesKilledInWave;
    ++this.enemiesKilledTotal;
    if (this.enemiesKilledInWave === this.enemiesForWave) {
      console.log('nextwave');
      setTimeout(() => this.nextWave(), 5000);
    }
  }

  private newEnemy(): Enemy {
    const enemySkinNumber = Math.floor(Math.random() * (this.enemyTextureRegions.length));
    return new Enemy(this.enemyTextureRegions[enemySkinNumber], 2);
  }

  private checkSpawn(deltaTime: number): void {
    this.spawnTimer -= deltaTime;
    if (this.spawnTimer < 0 && this.activeEnemyCount < maxActiveEnemyCount
      && this.enemiesSpawnedInWave < this.enemiesForWave) {
      this.spawn();
      this.spawnTimer = this.spawnTimerValue;
      ++this.activeEnemyCount;
      ++this.enemiesSpawnedInWave;
    }
  }

  private nextWave(): void {
    ++this.wavesPassed;
    this.enemiesKilledInWave = 0;
    this.enemiesSpawnedInWave = 0;
    this.enemyMaxHealth += enemyMaxHealthInc;
    this.maxActiveEnemyCount += maxActiveEnemyCountInc;
    this.enemiesForWave += enemiesForWaveInc;
    this.spawnTimerValue -= spawnTimerDec;
    this.enemySpeed += enemySpeedInc;
  }
}
