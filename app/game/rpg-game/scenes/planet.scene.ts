import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { div } from '../../../engine/math/math-base';
import { Vector2 } from '../../../engine/math/vector2';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { Scene } from '../../../engine/scenes/scene';
import { PLANET_DATA } from '../assets/planet.data';
import { GLOBAL } from '../global';
import { MenuHelper } from '../menu/menu-helper';
import { PLANET_GAME_STATE } from '../planet/game-state';
import { BaseItem, InventoryCell } from '../planet/inventory';
import { ItemDescription } from '../planet/item-description';
import { Player } from '../planet/player';
import { ShipCell } from '../planet/ship-cell';
import { Shop } from '../planet/shop';
import { ItemType } from '../player-data';
import { IRenderable, RenderHelper } from '../render-helper';
import { SCENES } from './scenes.const';

export enum ShopMode { Buy, Sell }
export enum ShipMode { Setup, Remove }

export class PlanetScene extends Scene implements IRenderable {
  guiManager: GuiManager;
  renderHelper: RenderHelper;

  player: Player;

  planetName: Text;
  shop: Shop;
  itemDescription: ItemDescription;
  selectedCellBorder: Sprite;

  takeOffButton: GuiButton;
  repairButton: GuiButton;
  buyOrSellButton: GuiButton;
  shipTransferButton: GuiButton;

  shipMode: ShipMode;
  shopMode: ShopMode;

  selectedShipCell?: ShipCell;
  selectedInventoryCell?: InventoryCell;

  noMoneyText: Text;

  constructor() {
    super();
  }

  load(): Promise<void> {
    this.initGui();

    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.planetMaterial);

    this.player = Player.build(PLANET_GAME_STATE.player, this.guiManager);
    this.shop = new Shop(PLANET_GAME_STATE.planet, 480, 260, this.guiManager);

    this.player.inventory.onClick = cell => this.onInventoryClick(cell, false);
    this.shop.inventory.onClick = cell => this.onInventoryClick(cell, true);
    this.player.onShipCellClick = cell => this.onShipCellClick(cell);

    this.itemDescription = new ItemDescription(480 - 59 / 2, 490);
    this.itemDescription.setVisible(false);

    this.updateRepairText();
    this.player.updateStats();
    return super.load();
  }

  unload(): Promise<void> {
    this.guiManager.free();

    return super.unload();
  }

  render(): void {
    GLOBAL.assets.guiCamera.update();
    this.renderHelper.render([this.player, this.shop, this.itemDescription, this]);
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
    return [this.selectedCellBorder];
  }

  getTextsToRender(): Text[] {
    return [this.planetName, this.noMoneyText];
  }

  private initGui(): void {
    this.guiManager = new GuiManager(
      GLOBAL.assets.planetMaterial,
      new SpriteBatch(),
      new TextBatch(GLOBAL.assets.font),
      GLOBAL.assets.guiCamera,
    );

    MenuHelper.loadMenu(this.guiManager, PLANET_DATA);

    this.takeOffButton = this.guiManager.getElement<GuiButton>('TakeOffButton');
    this.takeOffButton.onClick = () => {
      this.updatePlayerData();
      this.sceneManager.switchTo(SCENES.game);
    };

    this.repairButton = this.guiManager.getElement<GuiButton>('RepairButton');
    this.repairButton.onClick = () => {
      this.tryRepairShip();
    };

    this.buyOrSellButton = this.guiManager.getElement<GuiButton>('BuySellButton');
    this.buyOrSellButton.visible = false;
    this.buyOrSellButton.onClick = () => this.onBuySellButtonClick();

    this.shipTransferButton = this.guiManager.getElement<GuiButton>('ShipTransferButton');
    this.shipTransferButton.visible = false;
    this.shipTransferButton.onClick = () => this.onShipTransferButtonClick();

    this.planetName = new Text(`Планета «${PLANET_GAME_STATE.planet.name}»`);
    this.planetName.position.set(480, 25, 1);
    this.planetName.scale = 1.7;
    this.planetName.pivotPoint.set(0.5, 0.5);

    this.noMoneyText = new Text(`Недостаточно денег\nдля покупки`);
    this.noMoneyText.position.set(480 - 59 / 2, 700, 1);
    this.noMoneyText.pivotPoint.set(0.0, 0.0);
    this.noMoneyText.color.set(1, 0.1, 0.1, 1.0);
    this.noMoneyText.visible = false;

    this.selectedCellBorder = new Sprite();
    const selectedCellRegion = GLOBAL.assets.planetAtlas.getRegion('inventory_cell_selected.png');
    this.selectedCellBorder.setTextureRegion(selectedCellRegion);
    this.selectedCellBorder.setVerticesAlpha(1);
    this.selectedCellBorder.position.set(-100, -100, 10);
  }

  private updateRepairText(): void {
    const price = this.getHealthPointPrice()
      * (this.player.playerData.shipMaxHealth - this.player.playerData.shipHealth);
    const button = this.guiManager.getElement<GuiButton>('RepairButton');
    button.label.text = `Починить                    $${price}`;
  }

  private tryRepairShip(): void {
    const data = this.player.playerData;
    if (data.shipHealth === data.shipMaxHealth) {
      console.log('Health is max');
      return;
    }

    if (data.credits === 0) {
      console.log('No money - no honey');
      return;
    }

    const healthPointPrice = this.getHealthPointPrice();

    const pointsToHeal = Math.min(
      (this.player.playerData.shipMaxHealth - this.player.playerData.shipHealth), // health to heal
      div(data.credits, healthPointPrice),  // money to heal
    );

    const price = pointsToHeal * healthPointPrice;
    data.credits -= price;
    data.shipHealth += pointsToHeal;
    this.updateRepairText();
    this.player.updateHealth();
    this.player.updateCreditsText();
    console.log(`Healed ${pointsToHeal} points for ${price} (${healthPointPrice} per point)`);
  }

  private getHealthPointPrice(): number {
    return 3;
  }

  private onInventoryClick(cell: InventoryCell, isShop: boolean): void {
    this.shopMode = isShop ? ShopMode.Buy : ShopMode.Sell;
    this.selectedInventoryCell = cell.item ? cell : undefined;

    this.selectedCellBorder.position.set(cell.back.sprite.absoluteMatrix.position.asVector2());

    if (!cell.item) {
      this.itemDescription.setVisible(false);
      this.buyOrSellButton.visible = false;
      this.shipTransferButton.visible = false;
      this.noMoneyText.visible = false;
      return;
    }

    this.itemDescription.setVisible(true);
    this.buyOrSellButton.visible = true;
    this.buyOrSellButton.label.text = isShop ? 'Купить' : 'Продать';

    this.itemDescription.update(cell.item, isShop ? this.getItemBuyPrice(cell.item) : this.getItemSellPrice(cell.item));

    const notEnoughMoneyToBuy = isShop && !this.isEnoughMoneyToBuy(cell.item);

    this.noMoneyText.visible = notEnoughMoneyToBuy;
    this.buyOrSellButton.enabled = !notEnoughMoneyToBuy;

    if (isShop || !this.hasEmptyShipCells() || !this.canSetupOnShip(cell.item)) {
      this.shipTransferButton.visible = false;
    } else {
      this.shipTransferButton.visible = true;
      this.shipTransferButton.label.text = 'Поставить';
      this.shipMode = ShipMode.Setup;
    }
  }

  private onShipCellClick(shipCell: ShipCell): void {
    this.buyOrSellButton.visible = false;
    this.noMoneyText.visible = false;

    this.selectedCellBorder.position.set(shipCell.cellSprite.sprite.absoluteMatrix.position.asVector2());

    if (!shipCell.item) {
      this.itemDescription.setVisible(false);
      this.shipTransferButton.visible = false;
      this.selectedShipCell = undefined;
      return;
    }

    this.itemDescription.setVisible(true);
    this.shipTransferButton.visible = true;
    this.shipTransferButton.label.text = 'Убрать';
    this.shipMode = ShipMode.Remove;
    this.selectedShipCell = shipCell;
    this.itemDescription.update(shipCell.item, this.getItemSellPrice(shipCell.item));
  }

  private hasEmptyShipCells(): boolean {
    return this.player.shipCells.some(it => !it.item);
  }

  private canSetupOnShip(item: BaseItem): boolean {
    return item.type === ItemType.Engine || item.type === ItemType.Shield || item.type === ItemType.Weapon;
  }

  private getItemBuyPrice(item: BaseItem): number {
    return Math.ceil(item.cost * this.getPlayerBuyMultiplier());
  }

  private getItemSellPrice(item: BaseItem): number {
    return Math.ceil(item.cost * this.getPlayerSellMultiplier());
  }

  private isEnoughMoneyToBuy(item: BaseItem): boolean {
    return this.player.playerData.credits >= this.getItemBuyPrice(item);
  }

  private onShipTransferButtonClick(): void {
    if (this.shipMode === ShipMode.Setup) {
      const emptyCells = this.player.shipCells.filter(it => !it.item);
      if (emptyCells.length === 0) {
        throw new Error('Can not setup item - no emptyCells');
      }

      if (this.shopMode === ShopMode.Buy) {
        throw new Error('Can not setup item - ShopMode is Buy');
      }

      if (!this.selectedInventoryCell) {
        throw new Error('Can not setup item - not selected inventory cell');
      }

      if (!this.selectedInventoryCell.item) {
        throw new Error('Can not setup item - selected inventory cell has no item');
      }

      const emptyCell = emptyCells[0];
      emptyCell.setItem(this.selectedInventoryCell.item);
      this.selectedInventoryCell.setItem();
      this.onInventoryClick(this.selectedInventoryCell, false);
    } else {
      // ShipMode == Remove
      const emptyInventoryCells = this.player.inventory.cells.filter(it => !it.item);
      if (emptyInventoryCells.length === 0) {
        throw new Error('Can not remove item - no emptyCells in inventory');
      }

      if (!this.selectedShipCell) {
        throw new Error('Can not remove item - no selected ship cell');
      }

      if (!this.selectedShipCell.item) {
        throw new Error('Can not remove item - selected ship cell has no item');
      }

      const emptyCell = emptyInventoryCells[0];
      emptyCell.setItem(this.selectedShipCell.item);

      this.selectedShipCell.setItem();
      this.onShipCellClick(this.selectedShipCell);
    }

    this.updatePlayerData();
    this.player.updateStats();
    this.player.updateHealth();
  }

  private onBuySellButtonClick(): void {
    if (this.shopMode === ShopMode.Buy) {
      const emptyInventoryCells = this.player.inventory.cells.filter(it => !it.item);
      if (emptyInventoryCells.length === 0) {
        throw new Error('Can not buy item - no emptyCells in inventory');
      }

      if (!this.selectedInventoryCell) {
        throw new Error('Can not buy item - no selected inventory cell');
      }

      if (!this.selectedInventoryCell.item) {
        throw new Error('Can not buy item - selected inventory cell has no item');
      }

      if (!this.isEnoughMoneyToBuy) {
        throw new Error('Can not buy item - not enough money');
      }

      const emptyCell = emptyInventoryCells[0];
      emptyCell.setItem(this.selectedInventoryCell.item);
      this.player.playerData.credits -= this.getItemBuyPrice(this.selectedInventoryCell.item);
      this.selectedInventoryCell.setItem();
      this.player.updateCreditsText();
      this.onInventoryClick(this.selectedInventoryCell, true);

      this.updatePlayerData();
    } else {
      // ShopModel === Sell
      if (!this.selectedInventoryCell) {
        throw new Error('Can not sell item - no selected inventory cell');
      }

      if (!this.selectedInventoryCell.item) {
        throw new Error('Can not sell item - selected inventory cell has no item');
      }

      const emptyInventoryCells = this.shop.inventory.cells.filter(it => !it.item);

      const emptyCell = emptyInventoryCells.length > 0
        ? emptyInventoryCells[0]
        : this.shop.inventory.cells[this.shop.inventory.cells.length - 1];

      emptyCell.setItem(this.selectedInventoryCell.item);
      this.player.playerData.credits += this.getItemSellPrice(this.selectedInventoryCell.item);
      this.selectedInventoryCell.setItem();
      this.player.updateCreditsText();
      this.onInventoryClick(this.selectedInventoryCell, false);

      this.updatePlayerData();
    }
  }

  private getPlayerBuyMultiplier(): number {
    // todo: брать исходя из характеристик персонажа
    return 1.3;
  }

  private getPlayerSellMultiplier(): number {
    // todo: брать исходя из характеристик персонажа
    return 0.7;
  }

  private updatePlayerData(): void {
    const data = this.player.playerData;
    data.cells = this.player.shipCells.map(it => it.toShipCellData());

    data.inventory = this.player.inventory.cells
      .filter(it => it.item)
      .map(it => it.item as BaseItem)
      .map(it => it.toItemData());
  }
}
