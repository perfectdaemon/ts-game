import { Item } from './item';
import { Player } from './player';

export class AttackCountItem extends Item {
  name: string = '+1 Атака';
  removeAfterNumberOfTurns: number = 0;

  internalUse(self: Player, other: Player): void {
    ++self.attacksLeft;
  }

  removeEffect(self: Player, other: Player): void { }
}
