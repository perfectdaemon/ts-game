import { GuiManager } from '../../../engine/gui/gui-manager';
import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';
import { GLOBAL } from '../global';
import { ShipCell } from '../planet/ship-cell';
import { ShipCellData } from '../player-data';

export class FightShipCell extends ShipCell {
  markedAsAttacked: boolean;
  markedAsProtected: boolean;

  protectMark: Sprite;
  attackMark: Sprite;

  constructor(shipCellData: ShipCellData, x: number, y: number, gui: GuiManager) {
    super(shipCellData, x, y, gui);

    const region = GLOBAL.assets.planetAtlas.getRegion('inventory_cell_selected.png');

    this.protectMark = new Sprite(70, 70);
    this.protectMark.position.set(0, 0, 15);
    this.protectMark.parent = this.cellSprite.sprite;
    this.protectMark.visible = false;
    this.protectMark.setVerticesColor(0.3, 0.3, 1.0, 1);
    this.protectMark.setTextureRegion(region, true);
    this.protectMark.setSize(this.protectMark.width * 1.5, this.protectMark.height * 1.5);

    this.attackMark = new Sprite(15, 15);
    this.attackMark.position.set(0, 0, 15);
    this.attackMark.parent = this.cellSprite.sprite;
    this.attackMark.visible = false;
    this.attackMark.setVerticesColor(1.0, 0.3, 0.3, 1.0);
    this.attackMark.setTextureRegion(region, true);
    this.attackMark.setSize(this.attackMark.width * 0.8, this.attackMark.height * 0.8);
  }

  markAsProtected(): void {
    this.markedAsProtected = true;
    this.protectMark.visible = true;
  }

  markAsAttacked(): void {
    this.markedAsAttacked = true;
    this.attackMark.visible = true;
  }

  isMouseOver(position: Vector2): boolean {
    return this.cellSprite.hitBox.hit(position);
  }

  reset(): void {
    this.protectMark.visible = this.attackMark.visible = false;
    this.markedAsAttacked = false;
    this.markedAsProtected = false;
  }
}
