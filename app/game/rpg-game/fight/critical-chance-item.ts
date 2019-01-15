import { GuiManager } from '../../../engine/gui/gui-manager';
import { InventoryItemData } from '../player-data';
import { ConsumableItem } from './consumable-item';
import { Player } from './player';

export class CriticalChanceItem extends ConsumableItem {
  name: string = 'Повысить вероятность крит. урона';
  removeAfterNumberOfTurns: number = 1;

  private _originalCriticalChange: number;

  constructor(itemData: InventoryItemData, x: number, y: number, gui: GuiManager) {
    super(itemData, x, y, gui);
    this.background.sprite.setVerticesColor(0.7, 0.7, 0.1, 0.3);
    this.effectText.text = '+К';
  }

  internalUse(self: Player, other: Player): void {
    this._originalCriticalChange = self.playerData.criticalChance;
    self.playerData.criticalChance += 0.3;
  }

  removeEffect(self: Player, other: Player): void {
    self.playerData.criticalChance = this._originalCriticalChange;
  }
}
