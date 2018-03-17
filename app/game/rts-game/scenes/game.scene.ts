import { UnitManager } from '../units/unit-manager';
import { Scene } from './scene';

export class GameScene extends Scene {
  unitManager: UnitManager = new UnitManager();

  load(): Promise<void> {
    return super.load();
  }

  update(deltaTime: number): void {
    this.unitManager.update(deltaTime);
  }
}
