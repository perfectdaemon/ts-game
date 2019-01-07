import { ConsumableItem } from './consumable-item';
import { Player } from './player';

export class AttackCountItem extends ConsumableItem {
  name: string = '+1 Атака';
  removeAfterNumberOfTurns: number = 0;

  internalUse(self: Player, other: Player): void {
    ++self.attacksLeft;
  }

  removeEffect(self: Player, other: Player): void { }
}
