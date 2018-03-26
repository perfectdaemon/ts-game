import { Pool } from '../../../engine/helpers/pool/pool';
import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { GLOBAL } from '../global';
import { Unit } from './unit';

export class UnitManager {
  selected: Unit[] = [];

  private pool: Pool<Unit> = new Pool<Unit>(() => this.newUnit(), 64);
  private batch: SpriteBatch = new SpriteBatch();

  addUnit(position: Vector2): Unit {
    const unit = this.pool.get();

    unit.body.position.set(position);
    return unit;
  }

  update(deltaTime: number): void {
    for (const unit of this.pool.poolObjects) {
      unit.update(deltaTime);
    }
  }

  render(): void {
    GLOBAL.assets.blankMaterial.bind();

    this.batch.start();
    for (const unit of this.pool.poolObjects) {
      if (!unit.active) { continue; }

      this.batch.drawSingle(unit.body);
      this.batch.drawSingle(unit.healthBar);
      this.batch.drawArray(unit.selection.sprites);
    }
    this.batch.finish();
  }

  select(start: Vector2, finish: Vector2): void {
    // invert start/finish if direction of selection is not left -> right and top -> bottom
    let tmp = 0;
    if (start.x > finish.x) {
      tmp = finish.x;
      finish.x = start.x;
      start.x = tmp;
    }

    if (start.y > finish.y) {
      tmp = finish.y;
      finish.y = start.y;
      start.y = tmp;
    }

    // clear current selection
    for (const unit of this.selected) {
      unit.selection.visible = false;
    }
    this.selected = [];

    // select units
    for (const unit of this.pool.poolObjects) {
      if (!unit.active || !this.isUnitInSelection(unit, start, finish)) { continue; }

      this.selected.push(unit);
      unit.selection.visible = true;
    }
  }

  public moveSelectedUnits(target: Vector2): void {
    this.moveUnits(this.selected, target);
  }

  public moveUnits(units: Unit[], target: Vector2): void {
    for (const unit of units) {
      unit.target.set(target);
      unit.moveToTarget = true;
    }
  }

  private isUnitInSelection(unit: Unit, start: Vector2, finish: Vector2): boolean {
    if (unit.body.position.x < start.x || unit.body.position.x > finish.x) { return false; }
    if (unit.body.position.y < start.y || unit.body.position.y > finish.y) { return false; }
    return true;
  }

  private newUnit(): Unit {
    const unit = new Unit();

    this.decorateUnit(unit);

    return unit;
  }

  private decorateUnit(unit: Unit): void {
    unit.body.setVerticesColor(new Vector4(Math.random(), Math.random(), Math.random(), 1.0));
    unit.selection.color.set(0.1, 1.0, 0.1, 0.5);
    unit.healthBar.setVerticesColor(new Vector4(1, 0.1, 0.1, 1));

    unit.body.setSize(15, 15);
    unit.selection.start.set(-12, -12);
    unit.selection.finish.set(12, 12);
    unit.healthBar.setSize(25, 5);

    unit.healthBar.position.set(0, -25, 5);
    unit.body.position.set(0, 0, 1);

    unit.selection.updateSprites();
  }
}
