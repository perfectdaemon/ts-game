import { ConsumableItem } from './consumable-item';
import { Player } from './player';

export class HealItem extends ConsumableItem {
  get name(): string { return `Вылечить ${this._amount} единиц здоровья`; }

  removeAfterNumberOfTurns: number = 0;

  private _amount: number = 30;

  canUse(self: Player, other: Player): boolean {
    return super.canUse(self, other) && self.ship.health < self.playerData.shipMaxHealth;
  }

  internalUse(self: Player, other: Player): void {
    self.ship.health = Math.min(self.ship.health + this._amount, self.playerData.shipMaxHealth);
    self.ship.renderable.updateHealth(self.ship.health);
  }

  removeEffect(self: Player, other: Player): void { }
}
