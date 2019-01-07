import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { GLOBAL } from '../global';

export class ShipCell {
  cellSprite: GuiButton;

  constructor(x: number, y: number, gui: GuiManager) {
    const region = GLOBAL.assets.planetAtlas.getRegion('ship_cell.png');

    this.cellSprite = new GuiButton();
    this.cellSprite.label.visible = false;
    this.cellSprite.sprite.setTextureRegion(region, true);
    this.cellSprite.sprite.position.set(x, y, 2);
    this.cellSprite.sprite.setVerticesAlpha(0.5);
    this.cellSprite.onMouseOver = () => this.cellSprite.sprite.setVerticesAlpha(0.7);
    this.cellSprite.onMouseOut = () => this.cellSprite.sprite.setVerticesAlpha(0.5);

    this.cellSprite.updateHitBox();
    gui.addElement(this.cellSprite);
  }
}
