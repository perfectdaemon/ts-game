import { ConsumableItem } from './consumable-item';
import { Player } from './player';

export class HealItem extends ConsumableItem {
  get name(): string { return `Вылечить ${this._amount} единиц здоровья`; }

  removeAfterNumberOfTurns: number = 0;

  private _amount: number = 30;

  canUse(self: Player, other: Player): boolean {
    return super.canUse(self, other) && self.playerData.shipHealth < self.playerData.shipMaxHealth;
  }

  internalUse(self: Player, other: Player): void {
    self.playerData.shipHealth = Math.min(self.playerData.shipHealth + this._amount, self.playerData.shipMaxHealth);
    self.updateHealth();
  }

  removeEffect(self: Player, other: Player): void { }
}
