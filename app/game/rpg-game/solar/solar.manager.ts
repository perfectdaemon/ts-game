import { Material } from '../../../engine/render/material';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { GLOBAL } from '../global';
import { Planet } from './planet';
import { Player } from './player';
import { SolarBase } from './solar.base';
import { TargetCursor } from './target-cursor';
import { Vector2 } from '../../../engine/math/vector2';

export class SolarManager {
  solarObjects: SolarBase[];
  spriteBatch: SpriteBatch;
  textBatch: TextBatch;
  material: Material;

  constructor() {
    this.spriteBatch = new SpriteBatch();
    this.textBatch = new TextBatch(GLOBAL.assets.font);
    this.solarObjects = [];
    this.material = GLOBAL.assets.solarMaterial;
  }

  initialize() {
    this.solarObjects.push(
      Planet.buildPlanet1(),
      Player.buildPlayer(),
      TargetCursor.build(),
    );
  }

  free(): void {
    this.spriteBatch.free();
  }

  draw(): void {
    this.material.bind();
    this.spriteBatch.start();
    this.textBatch.start();
    for (const solarObject of this.solarObjects) {
      const spritesToRender = solarObject.getSpritesToRender();
      const textsToRender = solarObject.getTextsToRender();


      this.spriteBatch.drawArray(spritesToRender);
      this.textBatch.drawArray(textsToRender);
    }
    this.spriteBatch.finish();
    this.textBatch.finish();
  }

  update(deltaTime: number): void {

  }

  movePlayerToPosition(position: Vector2): void {

  }
}
