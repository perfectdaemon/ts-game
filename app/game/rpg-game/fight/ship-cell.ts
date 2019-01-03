import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';

export class ShipCell {
  health: number;

  renderable: ShipCellRenderable = new ShipCellRenderable();

  isAlive(): boolean {
    return this.health > 0;
  }
}

export class ShipCellRenderable {
  sprite: Sprite;
  healthText: Text;
  mark: Sprite;
}
