import { Pool } from '../../../engine/helpers/pool/pool';
import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { GLOBAL } from '../global';
import { Unit } from './unit';

export class UnitManager {
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
      this.batch.drawSingle(unit.selection);
    }
    this.batch.finish();
  }

  private newUnit(): Unit {
    const unit = new Unit();

    this.decorateUnit(unit);

    return unit;
  }

  private decorateUnit(unit: Unit): void {
    unit.body.setVerticesColor(new Vector4(Math.random(), Math.random(), Math.random(), 1.0));
    unit.selection.setVerticesColor(new Vector4(0.1, 1.0, 0.1, 0.5));
    unit.healthBar.setVerticesColor(new Vector4(1, 0.1, 0.1, 1));

    unit.body.setSize(15, 15);
    unit.selection.setSize(25, 25);
    unit.healthBar.setSize(25, 5);

    unit.healthBar.position.set(0, -25, 5);
    unit.selection.position.set(0, 0, 2);
    unit.body.position.set(0, 0, 1);
  }
}
