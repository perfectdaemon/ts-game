import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { MenuHelper } from '../../../engine/helpers/menu/menu-helper';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Scene } from '../../../engine/scenes/scene';
import { MAIN_MENU_DATA } from '../assets/main-menu.data';
import { SOUNDS } from '../assets/sound.data';
import { GLOBAL } from '../global';
import { SCENES } from './scenes.const';

export class MainMenuScene extends Scene {
  guiManager: GuiManager;

  musicEnabled: boolean = true;

  constructor() {
    super();
  }

  load(): Promise<void> {
    this.guiManager = new GuiManager(
      GLOBAL.assets.solarMaterial,
      new SpriteBatch(),
      new TextBatch(GLOBAL.assets.font),
      GLOBAL.assets.guiCamera,
    );

    MenuHelper.loadMenu(this.guiManager, MAIN_MENU_DATA);

    this.guiManager
      .getElement<GuiButton>('StartButton')
      .onClick = () => {
        GLOBAL.assets.audioManager.playSound(SOUNDS.select);
        this.sceneManager.switchTo(SCENES.game);
      };

    this.guiManager
      .getElement<GuiButton>('MusicButton')
      .onClick = (el) => {
        GLOBAL.assets.audioManager.playSound(SOUNDS.select);
        if (!this.musicEnabled) {
          GLOBAL.assets.audioManager.playMusic(SOUNDS.music);
          this.musicEnabled = true;
          (el as GuiButton).label.text = 'Музыка вкл.';
        } else {
          GLOBAL.assets.audioManager.stopMusic();
          this.musicEnabled = false;
          (el as GuiButton).label.text = 'Музыка выкл.';
        }
      };

    GLOBAL.assets.audioManager.stopMusic();
    GLOBAL.assets.audioManager.playMusic(SOUNDS.music);

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
}
