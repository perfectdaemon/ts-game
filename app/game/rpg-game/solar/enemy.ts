import { Action } from '../../../engine/helpers/action-manager/action';
import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { Sprite } from '../../../engine/scene/sprite';
import { GLOBAL } from '../global';
import { PlayerData } from '../player-data';
import { EnemyGenerator } from './enemy-generator';
import { GAME_STATE } from './game-state';
import { SolarBase } from './solar.base';

export class Enemy extends SolarBase {
  static buildEnemy(position: Vector2, power: number): Enemy {
    const enemy = new Enemy();
    enemy.power = power;
    enemy.initialize();
    enemy.sprite.position.set(0, 0, 25);
    enemy.sprite.position.set(position);
    enemy.speed = 15 + 15 * Math.random();

    enemy.enemyData = EnemyGenerator.generate(power);

    return enemy;
  }

  lastMoveAction: Action | undefined;
  speed: number;
  power: number;

  enemyData: PlayerData;

  initialize(): void {
    super.initialize();

    const enemyTextureRegion = GLOBAL.assets.solarAtlas.getRegion('triangle.png');

    this.sprite = new Sprite();
    this.sprite.setTextureRegion(enemyTextureRegion, false);
    this.sprite.setVerticesColor(new Vector4(1, 0.5, 0.5, 1.0));
    this.sprite.setSize(16 * (1 + this.power), 16 * (1 + this.power));
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    if (!this.lastMoveAction) {

      this.goSomewhere();
    }
  }

  private goSomewhere(): void {
    const angle = 360 * Math.random();
    const length = 100 + 100 * Math.random();

    const position = Vector2.fromAngle(angle).multiplyNumSelf(length).addToSelf(this.sprite.position);
    this.moveToPosition(position);
  }

  private moveToPosition(position: Vector2): void {
    this.sprite.rotation = position.subtract(this.sprite.position).toAngle() + 90;

    if (this.lastMoveAction) {
      this.lastMoveAction.onDeactivate();
    }

    this.lastMoveAction = GAME_STATE.actionManager
      .add((deltaTime) => {
        const moveVector = position
          .subtract(this.sprite.position);

        if (moveVector.length() < 1) {
          return true;
        }

        moveVector
          .normalize()
          .multiplyNumSelf(deltaTime * this.speed);

        this.sprite.position.addToSelf(moveVector);

        return false;
      }, 0.2 * Math.random())
      .then(() => this.lastMoveAction = undefined);
  }
}
