import { IPoolItem } from '../../../engine/helpers/pool/ipool-item';
import { MathBase } from '../../../engine/math/math-base';
import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';
import { BorderSprite } from '../helpers/border-sprite';

const unitHealthMax = 5;
const unitSpeed = 90;

export class Unit implements IPoolItem {
  active: boolean = false;

  body: Sprite = new Sprite();
  selection: BorderSprite = new BorderSprite(new Vector2(), new Vector2(), 1);
  healthBar: Sprite = new Sprite();

  moveDirection: Vector2 = new Vector2();
  moveIncrement: Vector2 = new Vector2();

  target: Vector2 = new Vector2();
  moveToTarget: boolean = false;

  healthMax: number = unitHealthMax;
  health: number = this.healthMax;

  speed: number = unitSpeed;

  constructor() {
    this.selection.parent = this.body;
    this.healthBar.parent = this.body;
  }

  onActivate(): void {
    this.body.visible = true;
    this.selection.visible = false;
    this.healthBar.visible = true;
    this.health = this.healthMax;
    this.speed = unitSpeed;
    this.moveDirection.set(0, 0);
    this.moveIncrement.set(0, 0);
    this.target.set(0, 0);
    this.moveToTarget = false;
  }
  onDeactivate(): void {
    this.body.visible = false;
    this.selection.visible = false;
    this.healthBar.visible = false;
  }

  update(deltaTime: number): void {
    if (!this.active) { return; }

    this.think();
    this.move(deltaTime);
    this.shoot();
  }

  private think(): void {
    // nothing
  }

  private move(deltaTime: number): void {
    if (!this.moveToTarget) { return; }

    this.moveDirection.set(this.target).subtractFromSelf(this.body.position);

    if (this.moveDirection.lengthQ() <= MathBase.eps) {
      this.moveToTarget = false;
      return;
    }

    this.moveDirection.normalize();

    this.moveIncrement
      .set(this.moveDirection)
      .multiplyNumSelf(this.speed * deltaTime);

    this.body.position.addToSelf(this.moveIncrement);
  }

  private shoot(): void {
    // nothing
  }
}
