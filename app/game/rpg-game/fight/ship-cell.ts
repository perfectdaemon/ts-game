import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';

export class ShipCell {
  health: number;

  renderable: ShipCellRenderable = new ShipCellRenderable();

  isAlive(): boolean {
    return this.health > 0;
  }

  unmark(): void {
    this.renderable.mark.visible = false;
  }

  markAsProtected(): void {
    this.renderable.mark.visible = true;
    this.renderable.mark.setVerticesColor(0.3, 0.3, 1.0, 1.0);
  }

  markAsAttacked(): void {
    this.renderable.mark.visible = true;
    this.renderable.mark.setVerticesColor(1.0, 0.3, 0.3, 1.0);
  }
}

export class ShipCellRenderable {
  sprite: Sprite;
  healthText: Text;
  mark: Sprite;
}
