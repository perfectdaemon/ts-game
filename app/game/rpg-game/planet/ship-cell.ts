import { Sprite } from '../../../engine/scene/sprite';
import { GLOBAL } from '../global';

export class ShipCell {
  cellSprite: Sprite;

  constructor(x: number, y: number) {
    this.cellSprite = new Sprite();
    const region = GLOBAL.assets.planetAtlas.getRegion('ship_cell.png');
    this.cellSprite.setTextureRegion(region, true);
    this.cellSprite.position.set(x, y, 2);
    this.cellSprite.setVerticesAlpha(0.5);
  }
}
