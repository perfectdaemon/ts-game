import { Item } from './item';
import { Player } from './player';

export class HealItem extends Item {
  get name(): string { return `Вылечить ${this._amount} единиц здоровья`; }

  removeAfterNumberOfTurns: number = 0;

  private _amount: number = 30;

  canUse(self: Player, other: Player): boolean {
    return super.canUse(self, other) && self.ship.health < self.playerData.shipHealth;
  }

  internalUse(self: Player, other: Player): void {
    self.ship.health = Math.min(self.ship.health + this._amount, self.playerData.shipHealth);
    self.ship.renderable.updateHealth(self.ship.health);
  }

  removeEffect(self: Player, other: Player): void { }
}