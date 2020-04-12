import { GuiManager } from '../../../engine/gui/gui-manager';
import { MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { IRenderable } from '../../../engine/render2d/render-helper';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { Scene } from '../../../engine/scenes/scene';
import { GLOBAL } from '../global';
import { RenderHelper } from '../render-helper';
import { Person } from './person';
import { Player } from './player';

export class GameScene extends Scene implements IRenderable {
  guiManager: GuiManager;

  guiSpriteBatch: SpriteBatch;

  guiTextBatch: TextBatch;

  renderHelper: RenderHelper;

  infectedText: Text;

  persons: Person[] = [];

  player: Player;

  getSpritesToRender(): Sprite[] {
    return [];
  }

  getTextsToRender(): Text[] {
    return [this.infectedText];
  }

  load(): Promise<void> {
    renderer.setClearColorRGB(2 / 255, 4 / 255, 34 / 255, 1.0);

    this.renderHelper = new RenderHelper(GLOBAL.assets.font, GLOBAL.assets.solarMaterial);

    this.guiSpriteBatch = new SpriteBatch();
    this.guiTextBatch = new TextBatch(GLOBAL.assets.font);
    this.guiManager = new GuiManager(
      GLOBAL.assets.solarMaterial,
      this.guiSpriteBatch,
      this.guiTextBatch,
      GLOBAL.assets.guiCamera,
    );

    this.persons = this.initPersons(new Vector2(0, 0), new Vector2(1280, 760), 100, 0.05);

    this.infectedText = new Text();
    this.infectedText.position.set(10, 5, 10);

    this.player = new Player();
    this.player.initialize(new Vector2(300, 300), 55);

    return super.load();
  }

  unload(): Promise<void> {
    this.guiManager.free();
    this.guiTextBatch.free();
    this.guiSpriteBatch.free();
    this.renderHelper.free();
    return super.unload();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();
    this.renderHelper.render(this.persons);
    this.renderHelper.render([this.player]);
    GLOBAL.assets.guiCamera.update();
    this.guiManager.render();
    this.renderHelper.render([this]);
  }

  update(deltaTime: number): void {
    this.persons
      .map(person => person.update(deltaTime));

    const infectedCount = this.persons
      .filter(person => person.isInfected)
      .map(person => this.checkInfection(person))
      .length;

    this.infectedText.text = `Заражено: ${infectedCount}`;

    this.player.update(deltaTime);
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
  }

  onPause(pause: boolean): void {
    super.onPause(pause);
    this.guiManager.enabled = !pause;
  }

  private checkInfection(infected: Person): void {
    this.persons
      .filter(person => !person.isInfected && person.sprite.position.subtract(infected.sprite.position).lengthQ() < 16 * 16)
      .map(person => person.setInfected());
  }

  private initPersons(regionTopLeft: Vector2, regionBottomRight: Vector2, count: number, virusChance: number): Person[] {
    const persons: Person[] = [];

    for (let i = 0; i < count; ++i) {
      const person = new Person();
      person.initialize(regionTopLeft, regionBottomRight, 30);

      const virusRoll = Math.random();

      if (virusRoll < virusChance) {
        person.setInfected();
      }

      persons.push(person);
    }

    return persons;
  }
}
