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
import { Player } from '../planet/player';
import { Shop } from '../planet/shop';
import { IRenderable, RenderHelper } from '../render-helper';

export class PlanetScene extends Scene implements IRenderable {
  guiManager: GuiManager;
  renderHelper: RenderHelper;

  player: Player;

  planetName: Text;
  shop: Shop;

  repairButton: GuiButton;

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

    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.planetMaterial);

    this.player = Player.build(PLANET_GAME_STATE.player);
    this.shop = new Shop(PLANET_GAME_STATE.planet, 480, 320);
    this.planetName = new Text(`Планета «${PLANET_GAME_STATE.planet.name}»`);
    this.planetName.position.set(480, 25, 1);
    this.planetName.scale = 1.5;
    this.planetName.pivotPoint.set(0.5, 0.5);

    this.updateRepairText();
    return super.load();
  }

  unload(): Promise<void> {
    this.guiManager.free();

    return super.unload();
  }

  render(): void {
    GLOBAL.assets.guiCamera.update();
    this.renderHelper.render([this.player, this.shop, this]);
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
    return [];
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
}
