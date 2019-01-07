import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { IRenderable } from '../render-helper';
import { BaseItem } from './inventory';
import { PlayerStatsRow } from './player-stats-row';

export class ItemDescription implements IRenderable {

  back: Sprite;
  itemBack: Sprite;
  item: Sprite;

  name: Text;
  stats: PlayerStatsRow[] = [];
  description: Text;
  cost: Text;

  constructor(x: number, y: number) {
    const itemBackRegion = GLOBAL.assets.planetAtlas.getRegion('ship_cell.png');
    const blankRegion = GLOBAL.assets.planetAtlas.getRegion('blank.png');

    this.back = new Sprite(473, 190, new Vector2(0, 0));
    this.back.position.set(x, y, 1);
    this.back.setVerticesColor(52 / 255, 111 / 255, 249 / 255, 0.5);
    this.back.setTextureRegion(blankRegion, false);

    this.itemBack = new Sprite(1, 1);
    this.itemBack.parent = this.back;
    this.itemBack.setTextureRegion(itemBackRegion, true);
    this.itemBack.position.set(this.itemBack.width / 2 + 5, this.itemBack.height / 2 + 5, 2);
    this.itemBack.setVerticesAlpha(0.5);

    this.item = new Sprite(1, 1);
    this.item.parent = this.itemBack;
    this.item.position.set(0, 0, 3);
    this.item.rotation = 45;
    this.item.setTextureRegion(blankRegion, false);

    this.name = new Text('Название');
    this.name.parent = this.back;
    this.name.pivotPoint.set(0.5, 0);
    this.name.position.set(this.back.width / 2, 5, 2);
    this.name.scale = 1.3;
    this.name.color.set(25 / 255, 222 / 255, 115 / 255, 1.0);

    this.description = new Text();
    this.description.parent = this.back;
    this.description.pivotPoint.set(0, 0);
    this.description.position.set(5, 95, 2);
    this.description.maxTextWidth = this.back.width - 10;
    this.description.isWrapped = true;
    this.description.scale = 0.8;
    this.description.text = 'Какая-то многострочная и очень длинная строка, в которой есть все, что нужно знать';

    this.cost = new Text('$');
    this.cost.parent = this.back;
    this.cost.pivotPoint.set(1, 1);
    this.cost.position.set(this.back.width - 5, this.back.height - 5, 2);
  }

  update(baseItem: BaseItem): void {
    this.cost.text = `$${baseItem.cost}`;
    this.name.text = baseItem.name;
    this.description.text = `Какая-то многострочная и очень длинная строка, в которой есть все, что нужно знать`;
  }

  getSpritesToRender(): Sprite[] {
    return [this.back, this.item, this.itemBack];
  }

  getTextsToRender(): Text[] {
    const result: Text[] = [this.name, this.description, this.cost];

    for (const stat of this.stats) {
      result.push(stat.caption, stat.value);
    }

    return result;
  }
}
