import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Action } from '../../../engine/helpers/action-manager/action';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { SOLAR_MENU_DATA } from '../assets/solar-menu.data';
import { GLOBAL } from '../global';
import { MenuHelper } from '../menu/menu-helper';
import { IRenderable, RenderHelper } from '../render-helper';
import { CameraController } from './camera.controller';
import { GAME_STATE } from './game-state';
import { Nebula, NebulaPool } from './nebula';
import { Planet } from './planet';
import { SolarBase } from './solar.base';

export class SolarManager {
  guiManager: GuiManager;
  guiSpriteBatch: SpriteBatch;
  guiTextBatch: TextBatch;
  renderHelper: RenderHelper;

  landingButton: GuiButton;

  solarObjects: SolarBase[];

  nebulaPool: NebulaPool;

  lastPlayerMoveAction: Action;

  cameraController: CameraController;

  constructor() {
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.solarMaterial);

    this.guiSpriteBatch = new SpriteBatch();
    this.guiTextBatch = new TextBatch(GLOBAL.assets.font);
    this.guiManager = new GuiManager(
      GLOBAL.assets.planetMaterial,
      this.guiSpriteBatch,
      this.guiTextBatch,
      GLOBAL.assets.guiCamera,
    );

    MenuHelper.loadMenu(this.guiManager, SOLAR_MENU_DATA);

    this.landingButton = this.guiManager.getElement<GuiButton>('LandingButton');
    this.landingButton.visible = false;
    this.landingButton.onClick = () => this.land();

    this.solarObjects = [];
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
    this.guiManager.free();
    this.guiTextBatch.free();
    this.guiSpriteBatch.free();
    this.renderHelper.free();
  }

  render(): void {
    this.renderHelper.render([this.nebulaPool as IRenderable].concat(this.solarObjects));
    GLOBAL.assets.guiCamera.update();
    this.guiManager.render();
  }

  update(deltaTime: number): void {
    GAME_STATE.actionManager.update(deltaTime);

    for (const solarObject of this.solarObjects) {
      solarObject.update(deltaTime);
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

        this.checkLanding();
        return false;
      });
  }

  private checkLanding(): void {
    for (const planet of GAME_STATE.planets) {
      const distanceToPlayer = planet.sprite.position.subtract(GAME_STATE.player.sprite.position).lengthQ();
      if (distanceToPlayer > planet.radius * planet.radius) { continue; }

      this.setLanding(planet);

      return;
    }

    this.setLanding(undefined);
  }

  private setLanding(planet: Planet | undefined): void {
    if (!planet) {
      GAME_STATE.planetToLand = undefined;
      this.landingButton.visible = false;
      return;
    }

    GAME_STATE.planetToLand = planet;
    this.landingButton.visible = true;
  }

  private land(): void {
    alert(`Landing to ${GAME_STATE.planetToLand ? GAME_STATE.planetToLand.text.text : '----'}!`);
  }
}
