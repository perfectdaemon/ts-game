import { GuiManager } from '../../../engine/gui/gui-manager';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { IRenderable } from '../render-helper';
import { PlanetData } from './game-state';
import { Inventory } from './inventory';

export class Shop implements IRenderable {
  caption: Text;
  inventory: Inventory;

  constructor(planetData: PlanetData, x: number, y: number, gui: GuiManager) {
    this.caption = new Text('Магазин');
    this.caption.position.set(x - 30, y, 2);
    this.caption.color.set(1, 1, 1, 1);
    this.caption.scale = 1.3;

    this.inventory = new Inventory(planetData.shopSize, planetData.shopItems, x, y + 70, gui);
  }

  getSpritesToRender(): Sprite[] {
    return this.inventory.getSpritesToRender();
  }

  getTextsToRender(): Text[] {
    return [this.caption].concat(this.inventory.getTextsToRender());
  }
}
