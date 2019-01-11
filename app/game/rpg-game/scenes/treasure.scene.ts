import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { div } from '../../../engine/math/math-base';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { Scene } from '../../../engine/scenes/scene';
import { TREASURE_MENU_DATA } from '../assets/treasure-menu.data';
import { DialogBox } from '../dialog-box';
import { GLOBAL } from '../global';
import { ItemGenerator } from '../item-generator';
import { MenuHelper } from '../menu/menu-helper';
import { BaseItem } from '../planet/inventory';
import { ItemDescription } from '../planet/item-description';
import { ItemType } from '../player-data';
import { IRenderable, RenderHelper } from '../render-helper';
import { TreasureType, TREASURE_GAME_STATE } from '../treasure/game-state';
import { CHEST_TEXTS } from '../treasure/texts';
import { SCENES } from './scenes.const';

export class TreasureScene extends Scene implements IRenderable {
  guiManager: GuiManager;
  guiSpriteBatch: SpriteBatch;
  guiTextBatch: TextBatch;
  renderHelper: RenderHelper;

  background: Sprite;
  title: DialogBox;
  itemDescriptions: ItemDescription[] = [];

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Treasure scene is loaded');
    this.initGui();
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.planetMaterial);

    this.background = new Sprite();
    const blankRegion = GLOBAL.assets.planetAtlas.getRegion('blank.png');

    this.background = new Sprite(renderer.width - 20, renderer.height - 300, new Vector2(0, 0));
    this.background.position.set(10, 170, 1);
    this.background.setVerticesColor(1, 1, 1, 0.3);
    this.background.setTextureRegion(blankRegion, false);

    this.title = new DialogBox(150);

    this.setTitle();
    this.generateItems();

    return super.load();
  }

  unload(): Promise<void> {
    this.renderHelper.free();
    this.guiManager.free();
    this.guiSpriteBatch.free();
    this.guiTextBatch.free();
    return super.unload();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();
    this.renderHelper.render([this as IRenderable, this.title].concat(this.itemDescriptions));
    GLOBAL.assets.guiCamera.update();
    this.guiManager.render();
  }

  update(deltaTime: number): void {
    this.guiManager.update(deltaTime);
  }

  onKeyDown(key: Keys): void {
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
  }

  onMouseMove(position: Vector2): void {
  }

  onMouseUp(position: Vector2, button: MouseButtons): void {
  }

  getSpritesToRender(): Sprite[] {
    return [this.background];
  }

  getTextsToRender(): Text[] {
    return [];
  }

  private initGui(): void {
    this.guiSpriteBatch = new SpriteBatch();
    this.guiTextBatch = new TextBatch(GLOBAL.assets.font);
    this.guiManager = new GuiManager(
      GLOBAL.assets.planetMaterial,
      this.guiSpriteBatch,
      this.guiTextBatch,
      GLOBAL.assets.guiCamera,
    );

    MenuHelper.loadMenu(this.guiManager, TREASURE_MENU_DATA);

    this.guiManager
      .getElement<GuiButton>('ExitButton')
      .onClick = () => this.takeAndExit();

    this.guiManager
      .getElement<GuiButton>('RegenerateButton')
      .onClick = () => this.generateItems();
  }

  private generateItems(): void {
    this.itemDescriptions = [];

    const treasureData = TREASURE_GAME_STATE.treasure;
    const count = Math.ceil(4 * treasureData.cost);

    for (let i = 0; i < count; ++i) {
      const itemData = ItemGenerator.generate(ItemType.Weapon, Math.random());
      const item = BaseItem.build(itemData);

      const row = div(i, 2);
      const col = i % 2;
      const itemDescription = new ItemDescription(30 + col * 480, 15 + row * 230, 400, 200);
      itemDescription.back.parent = this.background;
      itemDescription.update(item, item.cost);

      this.itemDescriptions.push(itemDescription);
    }
  }

  private setTitle(): void {
    const treasureData = TREASURE_GAME_STATE.treasure;
    switch (treasureData.type) {
      case TreasureType.Chest:
        this.title.text.text = CHEST_TEXTS[Math.floor(Math.random() * CHEST_TEXTS.length)];
        break;

      case TreasureType.Enemy:
        break;

      default:
        throw new Error(`Unknown TreasureType - ${treasureData.type}`);
    }
  }

  private takeAndExit(): void {
    this.sceneManager.switchTo(SCENES.mainMenu);
  }
}
