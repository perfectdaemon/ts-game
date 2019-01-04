import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { ShipCell } from './ship-cell';

export class Ship {
  health: number;
  cells: ShipCell[] = [];

  renderable: ShipRenderable = new ShipRenderable();

  hit(damage: number) {
    this.health -= damage;
    this.renderable.updateHealth(this.health);
  }

  isAlive(): boolean {
    return this.health > 0;
  }
}

export class ShipRenderable {
  sprite: Sprite;
  healthText: Text;
  updateHealth(health: number): void {
    this.healthText.text = Math.max(0, health).toString();
  }
}
