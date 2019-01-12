import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Vector2 } from '../../../engine/math/vector2';
import { GLOBAL } from '../global';
import { ShipCellData } from '../player-data';
import { PlayerDataExtensions } from '../player-data-extensions';
import { BaseItem } from './inventory';

export class ShipCell {
  cellSprite: GuiButton;
  item?: BaseItem;

  private _originalPosition: Vector2;

  constructor(shipCellData: ShipCellData, x: number, y: number, gui: GuiManager) {
    const region = GLOBAL.assets.planetAtlas.getRegion('ship_cell.png');

    this.cellSprite = new GuiButton();
    this.cellSprite.label.visible = false;
    this.cellSprite.sprite.setTextureRegion(region, true);
    this.cellSprite.sprite.position.set(x + shipCellData.position.x, y + shipCellData.position.y, 2);
    this.cellSprite.sprite.setVerticesAlpha(0.3);
    this.cellSprite.onMouseOver = () => this.cellSprite.sprite.setVerticesAlpha(0.7);
    this.cellSprite.onMouseOut = () => this.cellSprite.sprite.setVerticesAlpha(0.3);

    this.cellSprite.updateHitBox();
    gui.addElement(this.cellSprite);

    this._originalPosition = new Vector2().set(shipCellData.position);
    this.setItem(shipCellData.item ? BaseItem.build(shipCellData.item) : undefined);
  }

  setItem(item?: BaseItem) {
    this.item = item;

    if (!this.item) {
      this.cellSprite.sprite.setVerticesColor(1, 1, 1, 0.3);
      return;
    }

    this.item.sprite.parent = this.cellSprite.sprite;
    this.cellSprite.sprite.setVerticesColor(PlayerDataExtensions.getRarityColor(this.item.rarity, 0.3));
  }

  toShipCellData(): ShipCellData {
    const data: ShipCellData = {
      position: this._originalPosition,
      item: this.item ? this.item.toItemData() : undefined,
    };

    return data;
  }
}
