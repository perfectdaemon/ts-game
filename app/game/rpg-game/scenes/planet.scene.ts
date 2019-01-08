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
import { InventoryCell } from '../planet/inventory';
import { ItemDescription } from '../planet/item-description';
import { Player } from '../planet/player';
import { ShipCell } from '../planet/ship-cell';
import { Shop } from '../planet/shop';
import { IRenderable, RenderHelper } from '../render-helper';

export class PlanetScene extends Scene implements IRenderable {
  guiManager: GuiManager;
  renderHelper: RenderHelper;

  player: Player;

  planetName: Text;
  shop: Shop;
  itemDescription: ItemDescription;
  selectedCell: Sprite;

  repairButton: GuiButton;
  buyOrSellButton: GuiButton;
  shipTransferButton: GuiButton;

  constructor() {
    super();
  }

  load(): Promise<void> {
    this.guiManager = new GuiManager(
      GLOBAL.assets.planetMaterial,
      new SpriteBatch(),
      new TextBatch(GLOBAL.assets.font),
      GLOBAL.assets.guiCamera,
    );

    MenuHelper.loadMenu(this.guiManager, PLANET_DATA);
    this.repairButton = this.guiManager.getElement<GuiButton>('RepairButton');
    this.repairButton.onClick = () => {
      this.tryRepairShip();
    };

    this.buyOrSellButton = this.guiManager.getElement<GuiButton>('BuySellButton');
    this.buyOrSellButton.visible = false;
    this.buyOrSellButton.onClick = () => alert('buy or sell!');

    this.shipTransferButton = this.guiManager.getElement<GuiButton>('ShipTransferButton');
    this.shipTransferButton.visible = false;

    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.planetMaterial);

    this.player = Player.build(PLANET_GAME_STATE.player, this.guiManager);
    this.shop = new Shop(PLANET_GAME_STATE.planet, 480, 260, this.guiManager);

    this.planetName = new Text(`Планета «${PLANET_GAME_STATE.planet.name}»`);
    this.planetName.position.set(480, 25, 1);
    this.planetName.scale = 1.7;
    this.planetName.pivotPoint.set(0.5, 0.5);

    this.selectedCell = new Sprite();
    const selectedCellRegion = GLOBAL.assets.planetAtlas.getRegion('inventory_cell_selected.png');
    this.selectedCell.setTextureRegion(selectedCellRegion);
    this.selectedCell.setVerticesAlpha(1);
    this.selectedCell.position.set(-100, -100, 10);

    this.itemDescription = new ItemDescription(480 - 59 / 2, 490);

    this.player.inventory.onClick = cell => this.onInventoryClick(cell, false);
    this.shop.inventory.onClick = cell => this.onInventoryClick(cell, true);
    this.player.onShipCellClick = cell => this.onShipCellClick(cell);

    this.updateRepairText();
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
    return [this.selectedCell];
  }
  getTextsToRender(): Text[] {
    return [this.planetName];
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
    this.selectedCell.position.set(cell.back.sprite.absoluteMatrix.position.asVector2());

    if (!cell.item) {
      this.itemDescription.setVisible(false);
      this.buyOrSellButton.visible = false;
      return;
    }

    this.itemDescription.setVisible(true);
    this.buyOrSellButton.visible = true;
    this.buyOrSellButton.label.text = isShop ? 'Купить' : 'Продать';
    this.itemDescription.update(cell.item);
  }

  private onShipCellClick(shipCell: ShipCell): void {
    alert('ShipCell clicked!');
  }
}
