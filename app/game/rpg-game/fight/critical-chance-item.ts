import { ConsumableItem } from './consumable-item';
import { Player } from './player';

export class CriticalChanceItem extends ConsumableItem {
  name: string = 'Повысить вероятность крит. урона';
  removeAfterNumberOfTurns: number = 1;

  internalUse(self: Player, other: Player): void {
    self.playerData.criticalChance += 0.3;
  }

  removeEffect(self: Player, other: Player): void {
    self.playerData.criticalChance -= 0.3;
  }
}
