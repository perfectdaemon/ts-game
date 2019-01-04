import { Item } from './item';
import { Player } from './player';

export class ProtectCountItem extends Item {
  internalUse(self: Player, other: Player): void {
    ++self.protectsLeft;
  }

  removeEffect(self: Player, other: Player): void { }
}
