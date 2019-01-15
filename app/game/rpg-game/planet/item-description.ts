import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { ConsumableItemType, ItemType } from '../player-data';
import { PlayerDataExtensions } from '../player-data-extensions';
import { IRenderable } from '../render-helper';
import { BaseItem, ConsumableItem, EngineItem, MiscItem, ShieldItem, WeaponItem } from './inventory';
import { PlayerStatsRow } from './player-stats-row';

export class ItemDescription implements IRenderable {

  baseItem: BaseItem;

  back: Sprite;
  itemBack: Sprite;
  item: Sprite;

  name: Text;
  type: Text;
  stats: PlayerStatsRow[] = [];
  description: Text;
  cost: Text;

  constructor(x: number, y: number, w: number, h: number) {
    const itemBackRegion = GLOBAL.assets.solarAtlas.getRegion('ship_cell.png');
    const blankRegion = GLOBAL.assets.solarAtlas.getRegion('blank.png');

    this.back = new Sprite(w, h, new Vector2(0, 0));
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
    this.type.pivotPoint.set(0, 1);
    this.type.position.set(5, this.back.height - 5, 2);

    this.name = new Text('Название');
    this.name.parent = this.back;
    this.name.pivotPoint.set(0, 0);
    this.name.position.set(this.itemBack.width / 2 + this.itemBack.position.x + 10, 5, 2);
    this.name.scale = 1.2;
    this.name.color.set(25 / 255, 222 / 255, 115 / 255, 1.0);
    this.name.maxTextWidth = this.back.width - this.name.position.x - 5;
    this.name.isWrapped = true;

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

    const statX = this.itemBack.width / 2 + this.itemBack.position.x + 10;
    for (let i = 0; i < 5; i++) {
      const row = new PlayerStatsRow('', '', statX, 65 + (i * 25), 200);
      row.caption.parent = this.back;
      this.stats.push(row);
    }
  }

  update(baseItem: BaseItem, concreteCost: number): void {
    this.baseItem = baseItem;

    // Reset
    for (const stat of this.stats) {
      stat.caption.text = stat.value.text = '';
    }
    this.description.text = '';

    // Base data
    this.cost.text = `$${concreteCost}`;
    this.name.text = baseItem.name;

    // Rarity (color)
    this.itemBack.setVerticesColor(PlayerDataExtensions.getRarityColor(baseItem.rarity, 1.0));

    switch (baseItem.type) {
      case ItemType.Consumable:
        this.type.text = 'Расходуемое';

        const consumable = baseItem as ConsumableItem;
        this.stats[0].caption.text = 'Количество';
        this.stats[0].value.text = `${consumable.count}`;
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
            // tslint:disable-next-line:max-line-length
            this.description.text = 'Неизвестный науке расходуемый предмет. Ну, или как минимум программисту этой игры. Баг, короче.';
            break;
        }
        break;

      case ItemType.Engine:
        this.type.text = 'Двигатель';

        const engine = baseItem as EngineItem;
        this.stats[0].caption.text = 'Уклонение';
        this.stats[0].value.text = `${engine.dodgeMultiplier}`;
        this.stats[1].caption.text = 'Скорость';
        this.stats[1].value.text = `${engine.speedBoost}`;
        break;

      case ItemType.Misc:
        this.type.text = 'Всячина';
        const misc = baseItem as MiscItem;
        this.stats[0].caption.text = 'Количество';
        this.stats[0].value.text = `${misc.count}`;
        // tslint:disable-next-line:max-line-length
        this.description.text = 'Отличная штука! Ее можно использовать чуть менее чем никак. Продайте, пока не кончился срок годности.';
        break;

      case ItemType.Shield:
        this.type.text = 'Генератор щита';

        const shield = baseItem as ShieldItem;
        this.stats[0].caption.text = 'Сила щита';
        this.stats[0].value.text = `${Math.ceil(shield.shieldMultiplier * 100)} %`;
        if (shield.addProtect) {
          this.stats[1].caption.text = 'Доп. щиты';
          this.stats[1].value.text = `+${shield.addProtect}`;
        }

        break;

      case ItemType.Weapon:
        this.type.text = 'Оружие';

        const weapon = baseItem as WeaponItem;
        this.stats[0].caption.text = 'Урон';
        this.stats[0].value.text = `${weapon.damageMin}–${weapon.damageMax}`;
        let nextIndex = 1;
        if (weapon.criticalChanceMultiplier) {
          this.stats[nextIndex].caption.text = 'Крит. шанс';
          this.stats[nextIndex].value.text = `+${Math.ceil(weapon.criticalChanceMultiplier * 100)} %`;
          ++nextIndex;
        }

        if (weapon.shieldPiercing) {
          this.stats[nextIndex].caption.text = 'Пробитие щита';
          this.stats[nextIndex].value.text = `+${Math.ceil(weapon.shieldPiercing * 100)} %`;
          ++nextIndex;
        }

        if (weapon.addAttack) {
          this.stats[nextIndex].caption.text = 'Доп. атаки';
          this.stats[nextIndex].value.text = `+${weapon.addAttack}`;
          ++nextIndex;
        }

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
