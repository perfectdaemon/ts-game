import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { div } from '../../../engine/math/math-base';
import { Vector2 } from '../../../engine/math/vector2';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Scene } from '../../../engine/scenes/scene';
import { PLANET_DATA } from '../assets/planet.data';
import { GLOBAL } from '../global';
import { MenuHelper } from '../menu/menu-helper';
import { PLANET_GAME_STATE } from '../planet/game-state';
import { Player } from '../planet/player';
import { RenderHelper } from '../render-helper';

export class PlanetScene extends Scene {
  guiManager: GuiManager;
  renderHelper: RenderHelper;

  player: Player;

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
    this.updateRepairText();
    return super.load();
  }

  unload(): Promise<void> {
    this.guiManager.free();

    return super.unload();
  }

  render(): void {
    GLOBAL.assets.guiCamera.update();
    this.renderHelper.render([this.player]);
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
    }/*

    const price = this.getHealthPointPrice()
      * (this.player.playerData.shipMaxHealth - this.player.playerData.shipHealth);

    if (price <= data.credits) {
      data.credits -= price;
      data.shipHealth = data.shipMaxHealth;
      console.log(`Full repair`);
      return;
    }*/

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
    console.log(`Healed ${pointsToHeal} points for ${price} (${healthPointPrice} per point)`);
  }

  private getHealthPointPrice(): number {
    return 3;
  }
}
