import { IFigure } from '../../../engine/math/figure.interface';
import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';

export class ShipCell {
  health: number;

  renderable: ShipCellRenderable = new ShipCellRenderable();

  isAlive(): boolean {
    return this.health > 0;
  }

  hit(damage: number): void {
    this.health -= damage;
    this.renderable.updateHealthText(this.health);
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

  isMouseOver(position: Vector2): boolean {
    return this.renderable.hitBox.hit(position);
  }
}

export class ShipCellRenderable {
  sprite: Sprite;
  healthText: Text;
  mark: Sprite;
  hitBox: IFigure;

  updateHealthText(health: number): void {
    this.healthText.text = Math.max(0, health).toString();
  }
}
