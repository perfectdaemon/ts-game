import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Vector2 } from '../../../engine/math/vector2';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { InventoryItemData } from '../player-data';
import { Player } from './player';

export abstract class ConsumableItem {
  abstract removeAfterNumberOfTurns: number;

  abstract name: string;

  count: number;

  background: GuiButton;
  effectText: Text;
  countText: Text;

  constructor(itemData: InventoryItemData, x: number, y: number, gui: GuiManager) {
    if (itemData.consumable == null) {
      throw new Error('Item type is consumable but no consumable data found');
    }

    this.count = itemData.consumable.count;
    const consRegion = GLOBAL.assets.planetAtlas.getRegion('blank.png');
    this.background = new GuiButton();
    this.background.sprite.setSize(70, 70);
    this.background.sprite.position.set(x, y, 2);
    this.background.sprite.setVerticesColor(1, 1, 1, 0.3);
    this.background.sprite.setTextureRegion(consRegion, false);
    this.background.onMouseOver = () => this.background.sprite.setVerticesAlpha(0.7);
    this.background.onMouseOut = () => this.background.sprite.setVerticesAlpha(0.3);

    this.countText = new Text();
    this.countText.pivotPoint.set(1, 1);
    this.countText.position.set(this.background.sprite.width / 2 - 5, this.background.sprite.height / 2 - 5, 4);
    this.countText.color.set(1, 1, 1, 1.0);
    this.countText.shadowEnabled = true;
    this.countText.shadowColor.set(0, 0, 0, 1.0);
    this.countText.shadowOffset.set(1, 2);
    this.countText.parent = this.background.sprite;

    this.updateCountText();

    this.effectText = new Text();
    this.effectText.pivotPoint.set(0.5, 0.5);
    this.effectText.position.set(0, -12, 3);
    this.effectText.color.set(1, 1, 1, 1.0);
    this.effectText.shadowEnabled = true;
    this.effectText.shadowColor.set(0, 0, 0, 1.0);
    this.effectText.shadowOffset.set(1, 2);
    this.effectText.parent = this.background.sprite;

    gui.addElement(this.background);
  }

  isMouseOver(position: Vector2): boolean {
    return this.background.hitBox.hit(position);
  }

  canUse(selfPlayer: Player, otherPlayer: Player): boolean {
    return this.count > 0;
  }

  use(self: Player, other: Player): void {
    this.internalUse(self, other);
    --this.count;
    this.updateCountText();
  }

  updateCountText() {
    this.countText.text = this.count.toString();
  }

  abstract removeEffect(self: Player, other: Player): void;

  protected abstract internalUse(self: Player, other: Player): void;
}
