import { Item } from './item';
import { Player } from './player';

export class ProtectCountItem extends Item {
  name: string = '+1 Защита';

  removeAfterNumberOfTurns: number = 0;

  internalUse(self: Player, other: Player): void {
    ++self.protectsLeft;
  }

  removeEffect(self: Player, other: Player): void { }
}
