import { Action } from '../../../engine/helpers/action-manager/action';
import { Vector2 } from '../../../engine/math/vector2';
import { Material } from '../../../engine/render/material';
import { renderer } from '../../../engine/render/webgl';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { GLOBAL } from '../global';
import { CameraController } from './camera.controller';
import { GAME_STATE } from './game-state';
import { Nebula, NebulaPool } from './nebula';
import { SolarBase } from './solar.base';

export class SolarManager {
  solarObjects: SolarBase[];
  spriteBatch: SpriteBatch;
  textBatch: TextBatch;
  material: Material;
  nebulaPool: NebulaPool;

  lastPlayerMoveAction: Action;

  cameraController: CameraController;

  constructor() {
    this.spriteBatch = new SpriteBatch();
    this.textBatch = new TextBatch(GLOBAL.assets.font);
    this.solarObjects = [];
    this.material = GLOBAL.assets.solarMaterial;
    this.nebulaPool = new NebulaPool(() => Nebula.build(), 16);
    this.cameraController = new CameraController(GLOBAL.assets.gameCamera, 400);
  }

  initialize() {
    renderer.setClearColorRGB(2 / 255, 4 / 255, 34 / 255, 1.0);

    GAME_STATE.reset();

    this.solarObjects = this.solarObjects.concat(GAME_STATE.planets);

    this.solarObjects.push(
      GAME_STATE.player,
      GAME_STATE.targetCursor,
    );

    this.nebulaPool.initialize();
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
    this.nebulaPool.render(this.spriteBatch);
    this.spriteBatch.finish();
    this.textBatch.finish();
  }

  update(deltaTime: number): void {
    GAME_STATE.deltaTime = deltaTime;
    GAME_STATE.actionManager.update(deltaTime);

    for (const solarObject of this.solarObjects) {
      solarObject.update();
    }

    this.cameraController.update(deltaTime);
  }

  movePlayerToPosition(position: Vector2): void {
    GAME_STATE.targetCursor.sprite.visible = true;
    GAME_STATE.targetCursor.sprite.position.set(position);
    GAME_STATE.player.sprite.rotation = position.subtract(GAME_STATE.player.sprite.position).toAngle() + 90;

    if (this.lastPlayerMoveAction) {
      this.lastPlayerMoveAction.onDeactivate();
    }

    this.lastPlayerMoveAction = GAME_STATE.actionManager
      .add((deltaTime) => {
        const moveVector = position
          .subtract(GAME_STATE.player.sprite.position);

        if (moveVector.length() < 1) {
          GAME_STATE.targetCursor.sprite.visible = false;
          return true;
        }

        moveVector
          .normalize()
          .multiplyNumSelf(deltaTime * GAME_STATE.player.speed);

        GAME_STATE.player.sprite.position.addToSelf(moveVector);

        return false;
      });
  }
}
