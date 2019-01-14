import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { clamp } from '../../../engine/math/math-base';
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
import { BaseItem, Inventory, InventoryCell } from '../planet/inventory';
import { ItemDescription } from '../planet/item-description';
import { ItemRarity, ItemType } from '../player-data';
import { IRenderable, RenderHelper } from '../render-helper';
import { TreasureType, TREASURE_GAME_STATE } from '../treasure/game-state';
import { CHEST_HIG_TEXTS, CHEST_LOW_TEXTS, CHEST_MID_TEXTS, ENEMY_HIG_TEXTS, ENEMY_LOW_TEXTS, ENEMY_MID_TEXTS } from '../treasure/texts';

export class TreasureScene extends Scene implements IRenderable {
  guiManager: GuiManager;
  guiSpriteBatch: SpriteBatch;
  guiTextBatch: TextBatch;
  renderHelper: RenderHelper;

  title: DialogBox;
  items: Inventory;
  itemDescription: ItemDescription;

  playerInventoryText: Text;
  treasureInventoryText: Text;
  selectedCellBorder: Sprite;
  selectedInventoryCell: InventoryCell | undefined;

  playerInventory: Inventory;
  treasureInventory: Inventory;

  dropButton: GuiButton;
  takeButton: GuiButton;

  constructor() {
    super();
  }

  load(): Promise<void> {
    console.log('Treasure scene is loaded');
    this.initGui();
    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.planetMaterial);

    this.title = new DialogBox(120);

    this.itemDescription = new ItemDescription(520, 190, 425, 235);
    this.itemDescription.setVisible(false);

    const playerData = TREASURE_GAME_STATE.player;

    this.treasureInventory = new Inventory(
      8, [], 50, 220, this.guiManager,
    );

    this.playerInventory = new Inventory(
      playerData.inventorySize,
      playerData.inventory,
      50, 340,
      this.guiManager,
    );

    this.treasureInventory.onClick = (cell) => this.onTreasureCellClick(cell);
    this.playerInventory.onClick = (cell) => this.onInventoryCellClick(cell);

    this.selectedCellBorder = new Sprite();
    const selectedCellRegion = GLOBAL.assets.planetAtlas.getRegion('inventory_cell_selected.png');
    this.selectedCellBorder.setTextureRegion(selectedCellRegion);
    this.selectedCellBorder.setVerticesColor(0.7, 1.0, 0.7, 1.0);
    this.selectedCellBorder.position.set(-100, -100, 10);

    this.generateItems();
    this.setTitle();

    this.onTreasureCellClick(this.treasureInventory.cells[0]);

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
    GLOBAL.assets.guiCamera.update();
    this.renderHelper.render([
      this as IRenderable,
      this.title,
      this.playerInventory,
      this.treasureInventory,
      this.itemDescription,
    ]);
    this.guiManager.render();
  }

  update(deltaTime: number): void {
    this.guiManager.update(deltaTime);
  }

  getSpritesToRender(): Sprite[] {
    return [this.selectedCellBorder];
  }

  getTextsToRender(): Text[] {
    return [this.playerInventoryText, this.treasureInventoryText];
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
      .onClick = () => this.exit();

    this.guiManager
      .getElement<GuiButton>('TakeAllButton')
      .onClick = () => this.takeAll();

    this.dropButton = this.guiManager.getElement<GuiButton>('DropButton');
    this.dropButton.onClick = () => this.onDropClick();
    this.dropButton.visible = false;

    this.takeButton = this.guiManager.getElement<GuiButton>('TakeButton');
    this.takeButton.onClick = () => this.onTakeClick();
    this.takeButton.visible = false;

    this.treasureInventoryText = new Text('Трофеи');
    this.treasureInventoryText.pivotPoint.set(0, 1);
    this.treasureInventoryText.position.set(20, 185, 10);
    this.treasureInventoryText.scale = 1.3;

    this.playerInventoryText = new Text('Инвентарь');
    this.playerInventoryText.pivotPoint.set(0, 1);
    this.playerInventoryText.position.set(20, 300, 10);
    this.playerInventoryText.scale = 1.3;
  }

  private generateItems(): void {
    const treasureData = TREASURE_GAME_STATE.treasure;
    const count = Math.ceil(4 * treasureData.cost);

    const itemTypes = [ItemType.Weapon, ItemType.Shield, ItemType.Misc, ItemType.Consumable];

    let luckyAdd = treasureData.cost / 3;

    for (let i = 0; i < count; ++i) {
      const itemType = this.getRandomArrayElement(itemTypes);
      const itemData = ItemGenerator.generate(itemType, clamp(luckyAdd + Math.random(), 0.1, 1.0));
      const item = BaseItem.build(itemData);

      this.treasureInventory.addItemToInventory(item);
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

    switch (treasureData.type) {
      case TreasureType.Chest:
        if (totalCost < 300) {
          this.title.text.text = this.getRandomArrayElement(CHEST_LOW_TEXTS);
        } else if (totalCost < 700) {
          this.title.text.text = this.getRandomArrayElement(CHEST_MID_TEXTS);
        } else {
          this.title.text.text = this.getRandomArrayElement(CHEST_HIG_TEXTS);
        }

        break;

      case TreasureType.Enemy:
        if (treasureData.cost < 0.3) {
          this.title.text.text = this.getRandomArrayElement(ENEMY_LOW_TEXTS);
        } else if (treasureData.cost < 0.7) {
          this.title.text.text = this.getRandomArrayElement(ENEMY_MID_TEXTS);
        } else {
          this.title.text.text = this.getRandomArrayElement(ENEMY_HIG_TEXTS);
        }

        this.title.text.text += `\nТакже за победу над противником вы получаете $${treasureData.credits}`;
        break;

      default:
        throw new Error(`Unknown TreasureType - ${treasureData.type}`);
    }
  }

  private takeAll(): void {
    for (const cell of this.treasureInventory.cells) {
      if (!cell.item) { continue; }

      const result = this.playerInventory.addItemToInventory(cell.item);
      if (result) {
        cell.setItem(undefined);
      } else {
        continue;
      }
    }
  }

  private exit(): void {
    this.updatePlayerData();
    this.sceneManager.closeModal();
  }

  private getRandomArrayElement(arr: any[]): any {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private getTotalItemsCost(): number {
    const result = this.treasureInventory.cells
      .filter(it => !!it.item)
      .map(it => it.item as BaseItem)
      .reduce((prev, curr) => prev + curr.cost, 0);
    return result;
  }

  private updatePlayerData(): void {
    const data = TREASURE_GAME_STATE.player;

    data.inventory = this.playerInventory.cells
      .filter(it => it.item)
      .map(it => it.item as BaseItem)
      .map(it => it.toItemData());

    data.credits += TREASURE_GAME_STATE.treasure.credits;
  }

  private onTreasureCellClick(cell: InventoryCell): void {
    this.onBaseClick(cell);
    this.dropButton.visible = false;

    if (!cell.item) {
      this.takeButton.visible = false;
      return;
    }

    this.takeButton.visible = true;
  }

  private onInventoryCellClick(cell: InventoryCell): void {
    this.onBaseClick(cell);
    this.takeButton.visible = false;

    if (!cell.item) {
      this.dropButton.visible = false;
      return;
    }

    this.dropButton.visible = true;
  }

  private onBaseClick(cell: InventoryCell): void {
    this.selectedInventoryCell = cell.item ? cell : undefined;

    this.selectedCellBorder.position.set(cell.back.sprite.absoluteMatrix.position.asVector2());

    if (!cell.item) {
      this.itemDescription.setVisible(false);
      return;
    }

    this.itemDescription.setVisible(true);
    this.itemDescription.update(cell.item, cell.item.cost);
  }

  private onDropClick(): void {
    if (!this.selectedInventoryCell || !this.selectedInventoryCell.item) {
      return;
    }

    this.selectedInventoryCell.setItem(undefined);
    this.onInventoryCellClick(this.selectedInventoryCell);
  }

  private onTakeClick(): void {
    if (!this.selectedInventoryCell || !this.selectedInventoryCell.item) {
      return;
    }

    const result = this.playerInventory.addItemToInventory(this.selectedInventoryCell.item);
    if (result) {
      this.selectedInventoryCell.setItem(undefined);
      this.onInventoryCellClick(this.selectedInventoryCell);
    }
  }
}
