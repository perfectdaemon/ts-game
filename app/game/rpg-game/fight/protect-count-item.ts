import { GuiManager } from '../../../engine/gui/gui-manager';
import { InventoryItemData } from '../player-data';
import { ConsumableItem } from './consumable-item';
import { Player } from './player';

export class ProtectCountItem extends ConsumableItem {
  name: string = '+1 Защита';

  removeAfterNumberOfTurns: number = 0;

  constructor(itemData: InventoryItemData, x: number, y: number, gui: GuiManager) {
    super(itemData, x, y, gui);
    this.background.sprite.setVerticesColor(0.1, 0.1, 0.7, 0.3);
    this.effectText.text = '+Щ';
  }

  canUse(self: Player, other: Player): boolean {
    return super.canUse(self, other) && self.protectsLeft < self.shipCells.length;
  }

  internalUse(self: Player, other: Player): void {
    ++self.protectsLeft;
  }

  removeEffect(self: Player, other: Player): void { }
}
