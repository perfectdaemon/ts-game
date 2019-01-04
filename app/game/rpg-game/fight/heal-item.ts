import { Item } from './item';
import { Player } from './player';

export class HealItem extends Item {
  canUse(self: Player, other: Player): boolean {
    return super.canUse(self, other) && self.ship.health < self.playerData.shipHealth;
  }

  internalUse(self: Player, other: Player): void {
    self.ship.health = Math.min(self.ship.health + 30, self.playerData.shipHealth);
  }

  removeEffect(self: Player, other: Player): void { }
}
