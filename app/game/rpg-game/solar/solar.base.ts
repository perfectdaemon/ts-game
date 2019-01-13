import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { IRenderable } from '../render-helper';

export abstract class SolarBase implements IRenderable {
  sprite: Sprite;

  initialize(): void { }

  getSpritesToRender(): Sprite[] {
    return [this.sprite];
  }

  getTextsToRender(): Text[] {
    return [];
  }

  update(deltaTime: number): void {

  }
}
