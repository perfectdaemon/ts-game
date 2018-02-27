import { Vector2 } from '../../engine/math/vector2';
import { Vector4 } from '../../engine/math/vector4';
import { Material } from '../../engine/render/material';
import { TextureAtlas } from '../../engine/render/texture-atlas';
import { renderer } from '../../engine/render/webgl';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Sprite } from '../../engine/scene/sprite';
import { LevelData, TileRole } from './data-assets/level.data';
import { AABB } from './physics/aabb';
import { Circle } from './physics/circle';
import { Player } from './player';

export class Level {
  material: Material;
  sprites: Sprite[] = new Array<Sprite>(300);
  colliders: AABB[] = new Array<AABB>(300);
  backgroundColor: Vector4 = new Vector4(0.1, 0.2, 0.2, 0.5);
  playerStartPosition: Vector2 = new Vector2(0, 0);

  private _spriteBatch: SpriteBatch = new SpriteBatch();

  loadFromData(data: LevelData): void {
    const mapLines = data.map.split('\n');
    const pivotPoint = new Vector2(0.5, 0.5);

    this.backgroundColor = data.backgroundColor;
    renderer.setClearColor(this.backgroundColor);
    const textureAtlas = this.material.textures[0].texture as TextureAtlas;
    for (let tileY = 0; tileY < mapLines.length; ++tileY) {
      const mapLine = mapLines[tileY];
      if (mapLine.length === 0) { continue; }

      for (let tileX = 0; tileX < mapLine.length; ++tileX) {
        const tileId = mapLine[tileX];
        if (tileId === ' ') { continue; }

        const tileType = data.tileTypes.filter(type => type.id === tileId);
        if (tileType.length !== 1) {
          throw new Error(`Error while determine region for tile '${mapLine[tileX]}' - found ${tileType.length} results`);
        }

        if (tileType[0].role === TileRole.Player) {
          this.playerStartPosition.set(tileX * data.tileSize, tileY * data.tileSize);
          continue;
        }

        const textureRegion = textureAtlas.getRegion(tileType[0].region);
        const sprite = new Sprite(1, 1, pivotPoint);
        sprite.position.set(data.tileSize / 2 + tileX * data.tileSize, data.tileSize / 2 + tileY * data.tileSize, 0.5);
        sprite.setTextureRegion(textureRegion, true);
        sprite.multSize(2);
        if (tileType[0].rotation) {
          sprite.rotation = tileType[0].rotation as number;
        }
        this.sprites.push(sprite);

        this.colliders.push(new AABB(
          new Vector2(sprite.position.x, sprite.position.y),
          new Vector2(sprite.width, sprite.height)));
      }
    }

    this.staticDraw();
  }

  draw(): void {

    this.material.bind();
    this._spriteBatch.finish();
  }

  collide(movingObject: AABB | Circle): boolean {
    return this.colliders.some(collider => collider.overlaps(movingObject));
  }

  private staticDraw(): void {
    this._spriteBatch.start();
    this._spriteBatch.drawArray(this.sprites);
  }
}
