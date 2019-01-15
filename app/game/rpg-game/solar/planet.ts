import { Vector4 } from '../../../engine/math/vector4';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { ItemGenerator } from '../item-generator';
import { ConsumableItemType, InventoryItemData, ItemType } from '../player-data';
import { SolarBase } from './solar.base';

export class Planet extends SolarBase {
  static buildPlanet1(): Planet {
    const planet = new Planet('Земля', 64);

    planet.initialize();
    planet.sprite.position.set(500, 500, 5);
    planet.sprite.setVerticesColor(new Vector4(29 / 255.0, 172 / 255.0, 109 / 255.0, 1.0));

    planet.updateInventory();

    return planet;
  }

  static buildPlanet2(): Planet {
    const planet = new Planet('Марс', 64);

    planet.initialize();
    planet.sprite.position.set(-300, 450, 5);
    planet.sprite.setVerticesColor(new Vector4(172 / 255.0, 29 / 255.0, 59 / 255.0, 1.0));

    planet.updateInventory();

    return planet;
  }

  text: Text;

  inventory: InventoryItemData[];

  constructor(public name: string, public radius: number) {
    super();
  }

  initialize(): void {
    super.initialize();

    const planetTextureRegion = GLOBAL.assets.solarAtlas.getRegion('circle_bordered.png');

    this.sprite = new Sprite();
    this.sprite.setTextureRegion(planetTextureRegion, false);
    this.sprite.setSize(this.radius * 2, this.radius * 2);

    this.text = new Text(this.name);
    this.text.pivotPoint.set(0.5, 0.0);
    this.text.parent = this.sprite;
    this.text.position.set(0, 70, 6);
    this.text.color = new Vector4(0.9, 0.9, 0.9, 1.0);
  }

  getTextsToRender(): Text[] {
    return [this.text];
  }

  updateInventory(): void {
    this.inventory = [
      ItemGenerator.generateConsumable(ConsumableItemType.Heal, Math.ceil(3 * Math.random())),
      ItemGenerator.generateConsumable(ConsumableItemType.IncreaseCriticalChance, Math.ceil(3 * Math.random())),
      ItemGenerator.generateConsumable(ConsumableItemType.MoreAttackCount, Math.ceil(3 * Math.random())),
      ItemGenerator.generateConsumable(ConsumableItemType.MoreProtectCount, Math.ceil(3 * Math.random())),
    ];

    for (let i = 0; i < 2; ++i) {
      this.inventory.push(ItemGenerator.generate(ItemType.Weapon, 0.5 * Math.random()));
    }

    for (let i = 0; i < 2; ++i) {
      this.inventory.push(ItemGenerator.generate(ItemType.Shield, 0.4 * Math.random()));
    }
  }
}
