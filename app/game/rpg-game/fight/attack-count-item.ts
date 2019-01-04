import { Item } from './item';
import { Player } from './player';

export class AttackCountItem extends Item {
  internalUse(self: Player, other: Player): void {
    ++self.attacksLeft;
  }

  removeEffect(self: Player, other: Player): void { }
}
