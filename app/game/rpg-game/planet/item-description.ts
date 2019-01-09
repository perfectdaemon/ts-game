import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { ConsumableItemType, ItemRarity, ItemType } from '../player-data';
import { IRenderable } from '../render-helper';
import { BaseItem, ConsumableItem } from './inventory';
import { PlayerStatsRow } from './player-stats-row';

export class ItemDescription implements IRenderable {

  back: Sprite;
  itemBack: Sprite;
  item: Sprite;

  name: Text;
  type: Text;
  stats: PlayerStatsRow[] = [];
  description: Text;
  cost: Text;

  constructor(x: number, y: number) {
    const itemBackRegion = GLOBAL.assets.planetAtlas.getRegion('ship_cell.png');
    const blankRegion = GLOBAL.assets.planetAtlas.getRegion('blank.png');

    this.back = new Sprite(473, 205, new Vector2(0, 0));
    this.back.position.set(x, y, 1);
    this.back.setVerticesColor(52 / 255, 111 / 255, 149 / 255, 1.0);
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

    this.type = new Text('Тип предмета');
    this.type.parent = this.back;
    this.type.pivotPoint.set(0.5, 0);
    this.type.position.set(this.back.width / 2, 35, 2);

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

  update(baseItem: BaseItem, concreteCost: number): void {
    this.cost.text = `$${concreteCost}`;
    this.name.text = baseItem.name;

    switch (baseItem.rarity) {
      case ItemRarity.Usual:
        this.itemBack.setVerticesColor(1, 1, 1, 1.0);
        break;
      case ItemRarity.Special:
        this.itemBack.setVerticesColor(0.5, 0.5, 1.0, 1.0);
        break;
      case ItemRarity.Legendary:
        this.itemBack.setVerticesColor(206 / 255, 92 / 255, 0, 1.0);
        break;
    }

    this.description.text = '';

    switch (baseItem.type) {
      case ItemType.Consumable:
        this.type.text = 'Расходуемое';
        const consumable = baseItem as ConsumableItem;
        switch (consumable.consType) {
          case ConsumableItemType.Heal:
            this.description.text = 'Лечит корабль на некоторое количество единиц, которое определяется во время боя';
            break;

          case ConsumableItemType.IncreaseCriticalChance:
            this.description.text = 'Увеличивает шанс критического удара по врагу на один раунд';
            break;

          case ConsumableItemType.MoreAttackCount:
            this.description.text = 'Увеличивает число атак по вражескому кораблю на один раунд';
            break;

          case ConsumableItemType.MoreProtectCount:
            this.description.text = 'Увеличивает число ваших отсеков, закрываемых щитом, на один раунд';
            break;

          default:
            this.description.text = 'Неизвестный науке расходуемый предмет. Ну, или как минимум программисту этой игры. Баг, короче.';
            break;
        }
        break;

      case ItemType.Engine:
        this.type.text = 'Двигатель';
        break;

      case ItemType.Misc:
        this.type.text = 'Всячина';
        this.description.text = 'Отличная штука! Ее можно использовать чуть менее чем никак. Продайте, пока не кончился срок годности.';
        break;

      case ItemType.Shield:
        this.type.text = 'Генератор щита';
        break;

      case ItemType.Weapon:
        this.type.text = 'Оружие';
        break;

      default:
        this.type.text = '?!?!!?';
        break;
    }

    this.item.vertices = baseItem.sprite.vertices.slice();
    this.item.setSize(baseItem.sprite.width * 1.5, baseItem.sprite.height * 1.5);
    this.item.setDefaultVertices();
  }

  getSpritesToRender(): Sprite[] {
    return [this.back, this.item, this.itemBack];
  }

  getTextsToRender(): Text[] {
    const result: Text[] = [this.name, this.type, this.description, this.cost];

    for (const stat of this.stats) {
      result.push(stat.caption, stat.value);
    }

    return result;
  }

  setVisible(visible: boolean): void {
    this.back.visible = this.item.visible = this.itemBack.visible = this.name.visible
      = this.type.visible = this.description.visible = this.cost.visible = visible;

    for (const stat of this.stats) {
      stat.caption.visible = stat.value.visible = visible;
    }
  }
}
