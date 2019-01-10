import { GuiManager } from '../../../engine/gui/gui-manager';
import { InventoryItemData } from '../player-data';
import { ConsumableItem } from './consumable-item';
import { Player } from './player';

export class AttackCountItem extends ConsumableItem {
  name: string = '+1 Атака';
  removeAfterNumberOfTurns: number = 0;

  constructor(itemData: InventoryItemData, x: number, y: number, gui: GuiManager) {
    super(itemData, x, y, gui);
    this.background.sprite.setVerticesColor(0.7, 0.1, 0.1, 0.3);
    this.effectText.text = '+А';
  }

  internalUse(self: Player, other: Player): void {
    ++self.attacksLeft;
  }

  removeEffect(self: Player, other: Player): void { }
}
