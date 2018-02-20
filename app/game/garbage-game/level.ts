import { Vector2 } from '../../engine/math/vector2';
import { Vector4 } from '../../engine/math/vector4';
import { Material } from '../../engine/render/material';
import { TextureAtlas } from '../../engine/render/texture-atlas';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Sprite } from '../../engine/scene/sprite';
import { LevelData } from './data-assets/level.data';

export class Level {
  material: Material;
  sprites: Sprite[] = new Array<Sprite>(100);
  backgroundColor: Vector4 = new Vector4(0.1, 0.2, 0.2, 0.5);

  private _spriteBatch: SpriteBatch = new SpriteBatch();

  loadFromData(data: LevelData): void {
    const mapLines = data.map.split('\n');
    const pivotPoint = new Vector2(0, 0);

    const textureAtlas = this.material.textures[0].texture as TextureAtlas;
    for (let tileY = 0; tileY < mapLines.length; ++tileY) {
      const mapLine = mapLines[tileY];
      if (mapLine.length === 0) { continue; }

      for (let tileX = 0; tileX < mapLine.length; ++tileX) {
        const tileType = data.tileTypes.filter(type => type.id === mapLine[tileX]);
        if (tileType.length !== 1) {
          throw new Error(`Error while determine region for tile '${mapLine[tileX]}' - found ${tileType.length} results`);
        }

        const textureRegion = textureAtlas.getRegion(tileType[0].region);
        const sprite = new Sprite(data.tileSize, data.tileSize, pivotPoint);
        sprite.position.set(tileX * data.tileSize, tileY * data.tileSize, 1);
        sprite.setTextureRegion(textureRegion, false);
        this.sprites.push(sprite);
      }
    }

    this.staticDraw();
  }

  draw(): void {
    this.material.bind();
    this._spriteBatch.finish();
  }

  private staticDraw(): void {
    this._spriteBatch.start();
    this._spriteBatch.drawArray(this.sprites);
  }
}
