import { IFigure } from '../../../engine/math/figure.interface';
import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { Player } from './player';

export abstract class Item {
  abstract removeAfterNumberOfTurns: number;

  abstract name: string;

  count: number;

  renderable: ItemRenderable = new ItemRenderable();

  isMouseOver(position: Vector2): boolean {
    return this.renderable.hitBox.hit(position);
  }

  canUse(selfPlayer: Player, otherPlayer: Player): boolean {
    return this.count > 0;
  }

  use(self: Player, other: Player): void {
    this.internalUse(self, other);
    this.renderable.updateCountText(--this.count);
  }

  abstract removeEffect(self: Player, other: Player): void;

  protected abstract internalUse(self: Player, other: Player): void;
}

export class ItemRenderable {
  background: Sprite;
  effectText: Text;
  countText: Text;
  hitBox: IFigure;

  updateCountText(count: number) {
    this.countText.text = count.toString();
  }
}
