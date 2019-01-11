import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Scene } from '../../../engine/scenes/scene';
import { MAIN_MENU_DATA } from '../assets/main-menu.data';
import { FIGHT_GAME_STATE } from '../fight/game-state';
import { GLOBAL } from '../global';
import { MenuHelper } from '../menu/menu-helper';
import { PLANET_GAME_STATE } from '../planet/game-state';
import { ConsumableItemType, ItemRarity, ItemType } from '../player-data';
import { TreasureType, TREASURE_GAME_STATE } from '../treasure/game-state';
import { SCENES } from './scenes.const';

export class MainMenuScene extends Scene {
  guiManager: GuiManager;

  constructor() {
    super();
  }

  load(): Promise<void> {
    this.guiManager = new GuiManager(
      GLOBAL.assets.blankMaterial,
      new SpriteBatch(),
      new TextBatch(GLOBAL.assets.font),
      GLOBAL.assets.guiCamera,
    );

    MenuHelper.loadMenu(this.guiManager, MAIN_MENU_DATA);

    this.guiManager
      .getElement<GuiButton>('StartButton')
      .onClick = () => this.sceneManager.switchTo(SCENES.game);

    this.guiManager
      .getElement<GuiButton>('TreasureButton')
      .onClick = () => this.testTreasure();

    this.guiManager
      .getElement<GuiButton>('TestFightButton')
      .onClick = () => this.testFight();

    this.guiManager
      .getElement<GuiButton>('TestPlanetButton')
      .onClick = () => this.testPlanet();

    return super.load();
  }

  unload(): Promise<void> {
    this.guiManager.free();

    return super.unload();
  }

  render(): void {
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

  private testFight(): void {
    FIGHT_GAME_STATE.enemyData = {
      criticalChance: 0.1,
      criticalMultiplier: 2.0,
      cells: [
        {
          position: new Vector2(-50, 0),
          item: {
            type: ItemType.Weapon,
            name: 'Чумовой лазер',
            cost: 1000,
            rarity: ItemRarity.Legendary,
            weapon: {
              damageMin: 8,
              damageMax: 16,
            },
          },
        },
        {
          position: new Vector2(50, 0),
          item: {
            type: ItemType.Weapon,
            name: 'Крутой лазер',
            cost: 500,
            rarity: ItemRarity.Special,
            weapon: {
              damageMin: 7,
              damageMax: 13,
            },
          },
        },
        {
          position: new Vector2(-100, 100),
          item: {
            type: ItemType.Shield,
            name: 'Какой-то щит',
            cost: 500,
            rarity: ItemRarity.Legendary,
            shield: {
              shieldMultiplier: 0.45,
            },
          },
        },
        {
          position: new Vector2(100, 100),
          item: {
            type: ItemType.Shield,
            name: 'Какой-то щит',
            cost: 500,
            rarity: ItemRarity.Legendary,
            shield: {
              shieldMultiplier: 0.45,
            },
          },
        },
        {
          position: new Vector2(0, 125),
        },
      ],
      shipHealth: 100,
      shipMaxHealth: 100,
      credits: 0,
      inventorySize: 16,
      inventory: [],
    };

    FIGHT_GAME_STATE.humanData = {
      criticalChance: 0.1,
      criticalMultiplier: 2.0,
      cells: [
        {
          position: new Vector2(-50, 0),
          item: {
            type: ItemType.Weapon,
            name: 'Чумовой лазер',
            cost: 1000,
            rarity: ItemRarity.Legendary,
            weapon: {
              damageMin: 8,
              damageMax: 16,
            },
          },
        },
        {
          position: new Vector2(50, 0),
          item: {
            type: ItemType.Weapon,
            name: 'Крутой лазер',
            cost: 500,
            rarity: ItemRarity.Special,
            weapon: {
              damageMin: 7,
              damageMax: 13,
            },
          },
        },
        {
          position: new Vector2(-100, 100),
          item: {
            type: ItemType.Shield,
            name: 'Какой-то щит',
            cost: 500,
            rarity: ItemRarity.Legendary,
            shield: {
              shieldMultiplier: 0.45,
            },
          },
        },
        {
          position: new Vector2(100, 100),
          item: {
            type: ItemType.Shield,
            name: 'Какой-то щит',
            cost: 500,
            rarity: ItemRarity.Legendary,
            shield: {
              shieldMultiplier: 0.45,
            },
          },
        },
        {
          position: new Vector2(0, 125),
        },
      ],
      shipHealth: 100,
      shipMaxHealth: 100,
      credits: 0,
      inventorySize: 16,
      inventory: [
        {
          type: ItemType.Consumable,
          consumable: {
            type: ConsumableItemType.Heal,
            count: 1,
          },
          cost: 50,
          rarity: ItemRarity.Special,
          name: 'Лечение',
        },
        {
          type: ItemType.Consumable,
          consumable: {
            type: ConsumableItemType.IncreaseCriticalChance,
            count: 1,
          },
          cost: 50,
          rarity: ItemRarity.Special,
          name: 'Повысить шанс крит. урона',
        },

        {
          type: ItemType.Consumable,
          consumable: {
            type: ConsumableItemType.MoreProtectCount,
            count: 2,
          },
          cost: 50,
          rarity: ItemRarity.Special,
          name: '+1 Защита',
        },

        {
          type: ItemType.Consumable,
          consumable: {
            type: ConsumableItemType.MoreAttackCount,
            count: 2,
          },
          cost: 50,
          rarity: ItemRarity.Special,
          name: '+1 нападение',
        },
      ],
    };
    this.sceneManager.switchTo(SCENES.fight);
  }

  private testPlanet(): void {
    PLANET_GAME_STATE.player = {
      criticalChance: 0.1,
      criticalMultiplier: 2.0,
      cells: [
        {
          position: new Vector2(-50, 0),
          item: {
            type: ItemType.Weapon,
            name: 'Чумовой лазер',
            cost: 1000,
            rarity: ItemRarity.Legendary,
            weapon: {
              damageMin: 8,
              damageMax: 16,
              addAttack: 1,
              criticalChanceMultiplier: 0.2,
            },
          },
        },
        {
          position: new Vector2(50, 0),
          item: {
            type: ItemType.Weapon,
            name: 'Крутой лазер',
            cost: 500,
            rarity: ItemRarity.Special,
            weapon: {
              damageMin: 7,
              damageMax: 13,
            },
          },
        },
        {
          position: new Vector2(-100, 100),
        },
        {
          position: new Vector2(100, 100),
        },
        {
          position: new Vector2(0, 125),
        },
      ],
      shipHealth: 63,
      shipMaxHealth: 100,
      credits: 5000,
      inventorySize: 16,
      inventory: [
        {
          type: ItemType.Consumable,
          consumable: {
            type: ConsumableItemType.Heal,
            count: 1,
          },
          cost: 50,
          rarity: ItemRarity.Special,
          name: 'Лечение',
        },
        {
          type: ItemType.Consumable,
          consumable: {
            type: ConsumableItemType.IncreaseCriticalChance,
            count: 1,
          },
          cost: 50,
          rarity: ItemRarity.Special,
          name: '+Шанс крит. урона',
        },
        {
          type: ItemType.Consumable,
          consumable: {
            type: ConsumableItemType.MoreProtectCount,
            count: 2,
          },
          cost: 50,
          rarity: ItemRarity.Special,
          name: '+1 Защита',
        },
        {
          type: ItemType.Consumable,
          consumable: {
            type: ConsumableItemType.MoreAttackCount,
            count: 2,
          },
          cost: 50,
          rarity: ItemRarity.Special,
          name: '+1 нападение',
        },
        {
          type: ItemType.Weapon,
          name: 'Какой-то лазер',
          cost: 300,
          rarity: ItemRarity.Usual,
          weapon: {
            damageMin: 6,
            damageMax: 12,
          },
        },
      ],
    };

    PLANET_GAME_STATE.planet = {
      name: 'Земля',
      shopSize: 24,
      shopItems: [{
        type: ItemType.Weapon,
        name: 'Какой-то лазер',
        cost: 300,
        rarity: ItemRarity.Usual,
        weapon: {
          damageMin: 6,
          damageMax: 12,
          shieldPiercing: 0.1,
        },
      },
      {
        type: ItemType.Shield,
        name: 'Какой-то щит',
        cost: 500,
        rarity: ItemRarity.Legendary,
        shield: {
          shieldMultiplier: 0.45,
        },
      },
      ],
    };

    this.sceneManager.switchTo(SCENES.planet);
  }

  private testTreasure(): void {
    TREASURE_GAME_STATE.treasure = {
      type: TreasureType.Chest,
      cost: Math.random(),
    };

    this.sceneManager.switchTo(SCENES.treasure);
  }
}
