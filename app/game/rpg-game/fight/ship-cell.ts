import { IFigure } from '../../../engine/math/figure.interface';
import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';

export class ShipCell {
  markedAsAttacked: boolean;
  markedAsProtected: boolean;

  renderable: ShipCellRenderable = new ShipCellRenderable();

  markAsProtected(): void {
    this.markedAsProtected = true;
    this.renderable.protectMark.visible = true;
  }

  markAsAttacked(): void {
    this.markedAsAttacked = true;
    this.renderable.attackMark.visible = true;
  }

  isMouseOver(position: Vector2): boolean {
    return this.renderable.hitBox.hit(position);
  }

  reset(): void {
    this.renderable.protectMark.visible = this.renderable.attackMark.visible = false;
    this.markedAsAttacked = false;
    this.markedAsProtected = false;
  }
}

export class ShipCellRenderable {
  sprite: Sprite;
  protectMark: Sprite;
  attackMark: Sprite;
  hitBox: IFigure;
}
