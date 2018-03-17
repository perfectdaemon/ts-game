import { IPoolItem } from '../../../engine/helpers/pool/ipool-item';
import { MathBase } from '../../../engine/math/math-base';
import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';

const unitHealthMax = 5;
const unitSpeed = 30;

export class Unit implements IPoolItem {
  active: boolean = false;

  body: Sprite = new Sprite();
  selection: Sprite = new Sprite();
  healthBar: Sprite = new Sprite();

  moveDirection: Vector2 = new Vector2();
  moveIncrement: Vector2 = new Vector2();

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
    this.healthBar.visible = false;
    this.health = this.healthMax;
    this.speed = unitSpeed;
  }
  onDeactivate(): void {
    this.body.visible = false;
    this.selection.visible = false;
    this.healthBar.visible = false;
  }

  update(deltaTime: number): void {
    if (!this.active) { return; }
    this.think();
    this.move();
  }

  private think(): void {
    // nothing
  }

  private move(): void {
    if (this.moveDirection.lengthQ() <= MathBase.eps) { return; }

    this.moveIncrement
      .set(this.moveDirection)
      .multiplyNumSelf(this.speed);

    this.body.position.addToSelf(this.moveIncrement);
  }
}
