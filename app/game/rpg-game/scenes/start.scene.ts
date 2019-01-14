import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { Scene } from '../../../engine/scenes/scene';
import { CREDITS_GOAL } from '../assets/player-data.const';
import { START_MENU_DATA } from '../assets/start-menu.data';
import { DialogBox } from '../dialog-box';
import { GLOBAL } from '../global';
import { MenuHelper } from '../menu/menu-helper';
import { IRenderable, RenderHelper } from '../render-helper';

export class StartMenuScene extends Scene implements IRenderable {
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

    MenuHelper.loadMenu(this.guiManager, START_MENU_DATA);

    this.guiManager
      .getElement<GuiButton>('StartButton')
      .onClick = () => this.sceneManager.closeModal();

    this.dialogBox = new DialogBox(550);
    this.dialogBox.text.text =
`Добро пожаловать на борт, капитан Несоло!

Неделю назад вы взялись перевезти контрабандный груз, но вынуждены были
сбросить его при приближении патруля.

Заказчик этого не оценил, и теперь вы должны ему кругленькую сумму ($${CREDITS_GOAL}).

Способы заработка:

 - Нападать на недружественные корабли
 - Обыскивать обломки судов

Трофеи можно (и нужно) продавать на планетах. Там же можно переоборудовать
корабль — поставить оружие и щиты мощнее.
`;

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
