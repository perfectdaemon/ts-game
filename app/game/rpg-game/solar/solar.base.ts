import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';

export abstract class SolarBase {
  sprite: Sprite;

  initialize(): void { }

  getSpritesToRender(): Sprite[] {
    return [this.sprite];
  }

  getTextsToRender(): Text[] {
    return [];
  }

  update(): void {

  }
}
