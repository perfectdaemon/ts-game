import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { clamp, div } from '../../../engine/math/math-base';
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
import { BaseItem, ConsumableItem, Inventory } from '../planet/inventory';
import { ItemDescription } from '../planet/item-description';
import { ItemRarity, ItemType, PlayerData } from '../player-data';
import { IRenderable, RenderHelper } from '../render-helper';
import { TreasureType, TREASURE_GAME_STATE } from '../treasure/game-state';
import { CHEST_HIG_TEXTS, CHEST_LOW_TEXTS, CHEST_MID_TEXTS, ENEMY_HIG_TEXTS, ENEMY_LOW_TEXTS, ENEMY_MID_TEXTS } from '../treasure/texts';
import { SCENES } from './scenes.const';

export class TreasureScene extends Scene implements IRenderable {
  guiManager: GuiManager;
  guiSpriteBatch: SpriteBatch;
  guiTextBatch: TextBatch;
  renderHelper: RenderHelper;

  background: Sprite;
  title: DialogBox;
  itemDescriptions: ItemDescription[] = [];

  inventory: Inventory;

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
    this.background.position.set(10, 140, 1);
    this.background.setVerticesColor(1, 1, 1, 0.3);
    this.background.setTextureRegion(blankRegion, false);

    this.title = new DialogBox(120);

    const playerData = TREASURE_GAME_STATE.player;

    this.inventory = new Inventory(
      playerData.inventorySize,
      playerData.inventory,
      40, renderer.height - 120,
      this.guiManager,
    );

    this.generateItems();
    this.setTitle();

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
    this.renderHelper.render([this as IRenderable, this.title, this.inventory].concat(this.itemDescriptions));
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
      .onClick = () => {
        const types = [TreasureType.Enemy, TreasureType.Chest];
        TREASURE_GAME_STATE.treasure.cost = Math.random();
        TREASURE_GAME_STATE.treasure.type = this.getRandomArrayElement(types);
        this.generateItems();
        this.setTitle();
      };
  }

  private generateItems(): void {
    this.itemDescriptions = [];

    const treasureData = TREASURE_GAME_STATE.treasure;
    const count = Math.ceil(4 * treasureData.cost);

    const itemTypes = [ItemType.Weapon, ItemType.Shield, ItemType.Misc, ItemType.Consumable];

    let luckyAdd = treasureData.cost / 3;

    for (let i = 0; i < count; ++i) {
      const itemType = this.getRandomArrayElement(itemTypes);
      const itemData = ItemGenerator.generate(itemType, clamp(luckyAdd + Math.random(), 0.1, 1.0));
      const item = BaseItem.build(itemData);

      const row = div(i, 2);
      const col = i % 2;
      const itemDescription = new ItemDescription(30 + col * 480, 15 + row * 230, 400, 200);
      itemDescription.back.parent = this.background;
      itemDescription.update(item, item.cost);

      this.itemDescriptions.push(itemDescription);

      if (itemData.rarity === ItemRarity.Legendary) {
        luckyAdd -= 0.2;
      } else if (itemData.rarity === ItemRarity.Special) {
        luckyAdd -= 0.1;
      }
    }
  }

  private setTitle(): void {
    const treasureData = TREASURE_GAME_STATE.treasure;
    const totalCost = this.getTotalItemsCost();

    this.title.text.text = `$${totalCost}\n`;

    switch (treasureData.type) {
      case TreasureType.Chest:
        if (totalCost < 300) {
          this.title.text.text += this.getRandomArrayElement(CHEST_LOW_TEXTS);
        } else if (totalCost < 700) {
          this.title.text.text += this.getRandomArrayElement(CHEST_MID_TEXTS);
        } else {
          this.title.text.text += this.getRandomArrayElement(CHEST_HIG_TEXTS);
        }

        break;

      case TreasureType.Enemy:
        if (treasureData.cost < 0.3) {
          this.title.text.text += this.getRandomArrayElement(ENEMY_LOW_TEXTS);
        } else if (treasureData.cost < 0.7) {
          this.title.text.text += this.getRandomArrayElement(ENEMY_MID_TEXTS);
        } else {
          this.title.text.text += this.getRandomArrayElement(ENEMY_HIG_TEXTS);
        }
        break;

      default:
        throw new Error(`Unknown TreasureType - ${treasureData.type}`);
    }
  }

  private takeAndExit(): void {
    for (const itemDescription of this.itemDescriptions) {
      const result = this.addItemToInventory(TREASURE_GAME_STATE.player, itemDescription.baseItem);
      if (result) {
        itemDescription.setVisible(false);
      } else {

      }
    }
    this.sceneManager.switchTo(SCENES.mainMenu);
  }

  private getRandomArrayElement(arr: any[]): any {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private getTotalItemsCost(): number {
    const result = this.itemDescriptions.reduce((prev, curr) => prev + curr.baseItem.cost, 0);
    return result;
  }

  private addItemToInventory(playerData: PlayerData, item: BaseItem): boolean {
    if (item.type === ItemType.Consumable) {
      const consItem = item as ConsumableItem;
      const itemToStack = playerData.inventory
        .filter(it =>
          it.type === ItemType.Consumable &&
          it.consumable &&
          it.consumable.type === consItem.consType);

      if (itemToStack.length === 1 && itemToStack[0].consumable) {
        itemToStack[0].consumable.count += consItem.count;
        itemToStack[0].cost += consItem.cost;
        return true;
      }
    }

    if (playerData.inventory.length >= playerData.inventorySize) {
      return false;
    }

    playerData.inventory.push(item.toItemData());
    return true;
  }
}
