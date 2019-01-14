import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Action } from '../../../engine/helpers/action-manager/action';
import { Subscription } from '../../../engine/helpers/event/subscription';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Scene } from '../../../engine/scenes/scene';
import { SOLAR_MENU_DATA } from '../assets/solar-menu.data';
import { GLOBAL } from '../global';
import { GlobalEvents } from '../global.events';
import { MenuHelper } from '../menu/menu-helper';
import { PLANET_GAME_STATE } from '../planet/game-state';
import { IRenderable, RenderHelper } from '../render-helper';
import { CameraController } from '../solar/camera.controller';
import { GAME_STATE } from '../solar/game-state';
import { Nebula, NebulaPool } from '../solar/nebula';
import { Planet } from '../solar/planet';
import { SolarBase } from '../solar/solar.base';
import { SCENES } from './scenes.const';
import { Enemy } from '../solar/enemy';

export class GameScene extends Scene {
  guiManager: GuiManager;
  guiSpriteBatch: SpriteBatch;
  guiTextBatch: TextBatch;
  renderHelper: RenderHelper;

  landingButton: GuiButton;

  solarObjects: SolarBase[];

  nebulaPool: NebulaPool;

  lastPlayerMoveAction: Action;

  cameraController: CameraController;

  $takeOffPlanet: Subscription<void>;

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Game scene is loaded');

    renderer.setClearColorRGB(2 / 255, 4 / 255, 34 / 255, 1.0);

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

    GAME_STATE.reset();

    this.solarObjects = this.solarObjects
      .concat(GAME_STATE.planets)
      .concat(GAME_STATE.enemies);

    this.solarObjects.push(
      GAME_STATE.player,
      GAME_STATE.targetCursor,
    );

    this.nebulaPool.initialize();

    this.$takeOffPlanet = GlobalEvents.takeOffFromPlanet.subscribe(() => this.onTakeOffFromPlanet());

    GLOBAL.actionManager.add(() => this.sceneManager.showModal(SCENES.start), 0.5);

    return super.load();
  }

  unload(): Promise<void> {
    this.guiManager.free();
    this.guiTextBatch.free();
    this.guiSpriteBatch.free();
    this.renderHelper.free();
    this.$takeOffPlanet.unsubscribe();
    return super.unload();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();
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

    this.checkFight();
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
    if (button === Keys.LeftButton) {
      const worldPosition = GLOBAL.assets.gameCamera.screenToWorld(position);
      this.movePlayerToPosition(new Vector2().set(worldPosition));
    }
  }

  onPause(pause: boolean): void {
    super.onPause(pause);
    this.guiManager.enabled = !pause;
  }

  private onTakeOffFromPlanet(): void {
    if (!GAME_STATE.planetToLand) { return; }

    GAME_STATE.planetToLand.inventory = PLANET_GAME_STATE.planet.shopItems;
  }

  private movePlayerToPosition(position: Vector2): void {
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
          this.stopMoving();
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

  private stopMoving(): void {
    this.lastPlayerMoveAction.onDeactivate();
    GAME_STATE.targetCursor.sprite.visible = false;
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

  private checkFight(): void {
    for (const enemy of GAME_STATE.enemies) {
      const distanceToPlayer = enemy.sprite.position.subtract(GAME_STATE.player.sprite.position).lengthQ();
      if (distanceToPlayer > 16 * 16) { continue; }

      this.fight(enemy);
      return;
    }
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
    this.lastPlayerMoveAction.onDeactivate();

    if (!GAME_STATE.planetToLand) {
      return;
    }

    PLANET_GAME_STATE.player = GAME_STATE.playerData;
    PLANET_GAME_STATE.planet = {
      shopSize: 24,
      name: GAME_STATE.planetToLand.name,
      shopItems: GAME_STATE.planetToLand.inventory,
    };

    this.sceneManager.showModal(SCENES.planet, true);
  }

  private fight(enemy: Enemy): void {
    alert('fight!');
  }
}
