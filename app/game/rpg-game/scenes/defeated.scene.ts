import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { Scene } from '../../../engine/scenes/scene';
import { DEFEATED_MENU_DATA } from '../assets/defeated-menu.data';
import { DialogBox } from '../dialog-box';
import { GLOBAL } from '../global';
import { MenuHelper } from '../menu/menu-helper';
import { IRenderable, RenderHelper } from '../render-helper';
import { GAME_STATE } from '../solar/game-state';

export class DefeatedMenuScene extends Scene implements IRenderable {
  guiManager: GuiManager;
  renderHelper: RenderHelper;

  dialogBox: DialogBox;
  background: Sprite;

  constructor() {
    super();
  }

  load(): Promise<void> {
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.planetMaterial);

    this.guiManager = new GuiManager(
      GLOBAL.assets.planetMaterial,
      this.renderHelper.spriteBatch,
      this.renderHelper.textBatch,
      GLOBAL.assets.guiCamera,
    );

    MenuHelper.loadMenu(this.guiManager, DEFEATED_MENU_DATA);

    this.guiManager
      .getElement<GuiButton>('ContinueButton')
      .onClick = () => this.sceneManager.closeModal();

    this.dialogBox = new DialogBox(550);
    this.dialogBox.text.text =
`Поражение!

Благодаря удаче и/или милосердию противника, вы не умираете.

Вас находит космический буксир и оттаскивает к ближайшей планете.
Там путем обмана, хитрости и мольбы вам удается договориться о
полной починке корабля.

Вы теряете 30% всех кредитов, хотя буксировщик хотел забрать всё.

Ваш текущий баланс: $${GAME_STATE.playerData.credits}`;

    this.dialogBox.text.isWrapped = false;

    this.background = new Sprite(renderer.width - 10, renderer.height - 10, new Vector2(0, 0));
    this.background.position.set(5, 5, 30);
    this.background.setVerticesColor(0, 0, 0, 0.8);
    this.background.setTextureRegion(GLOBAL.assets.planetAtlas.getRegion('blank.png'), false);

    return super.load();
  }

  unload(): Promise<void> {
    this.guiManager.free();
    this.renderHelper.free();

    return super.unload();
  }

  render(): void {
    GLOBAL.assets.guiCamera.update();
    this.renderHelper.render([this, this.dialogBox]);
    this.guiManager.render();
  }

  update(deltaTime: number): void {
    this.guiManager.update(deltaTime);
  }

  getSpritesToRender(): Sprite[] {
    return [this.background];
  }

  getTextsToRender(): Text[] {
    return [];
  }
}
