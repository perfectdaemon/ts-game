import { Vector4 } from '../../engine/math/vector4';
import { Material } from '../../engine/render/material';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Sprite } from '../../engine/scene/sprite';

export class Level {
  material: Material;
  sprites: Sprite[];
  backgroundColor: Vector4;

  private _spriteBatch: SpriteBatch;

  constructor() {
  }

  draw(): void {
  }
}
