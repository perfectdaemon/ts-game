import { Pool } from '../../../engine/helpers/pool/pool';
import { Vector2 } from '../../../engine/math/vector2';
import { Unit } from './unit';

export class UnitManager {
  pool: Pool<Unit> = new Pool<Unit>(() => this.newUnit(), 64);

  addUnit(position: Vector2): Unit {
    const unit = this.pool.get();

    return unit;
  }

  update(deltaTime: number) {
    for (const unit of this.pool.poolObjects) {
      unit.update(deltaTime);
    }
  }

  private newUnit(): Unit {
    const unit = new Unit();

    return unit;
  }
}
