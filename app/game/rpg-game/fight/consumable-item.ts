import { IFigure } from '../../../engine/math/figure.interface';
import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { Player } from './player';

export abstract class ConsumableItem {
  abstract removeAfterNumberOfTurns: number;

  abstract name: string;

  count: number;

  background: Sprite;
  effectText: Text;
  countText: Text;
  hitBox: IFigure;

  isMouseOver(position: Vector2): boolean {
    return this.hitBox.hit(position);
  }

  canUse(selfPlayer: Player, otherPlayer: Player): boolean {
    return this.count > 0;
  }

  use(self: Player, other: Player): void {
    this.internalUse(self, other);
    --this.count;
    this.updateCountText();
  }

  updateCountText() {
    this.countText.text = this.count.toString();
  }

  abstract removeEffect(self: Player, other: Player): void;

  protected abstract internalUse(self: Player, other: Player): void;
}
