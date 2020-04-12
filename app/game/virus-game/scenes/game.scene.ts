import { GuiManager } from '../../../engine/gui/gui-manager';
import { Subscription } from '../../../engine/helpers/event/subscription';
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
import { GlobalEvents } from '../global.events';
import { InfectedPickedUpEvent } from '../infected-picked-up.event';
import { RenderHelper } from '../render-helper';
import { Person } from './person';
import { Player } from './player';
import { InfectedDiedEvent } from '../infected-died.event';
import { GAME_SETTINGS } from '../game-settings';

export class GameScene extends Scene implements IRenderable {
  guiManager: GuiManager;

  guiSpriteBatch: SpriteBatch;

  guiTextBatch: TextBatch;

  renderHelper: RenderHelper;

  // Тексты
  infectedText: Text;

  inAmbulanceText: Text;

  diedText: Text;

  // Игроки и NPC
  persons: Person[] = [];

  player: Player;

  // Чиселки

  diedCount: number;

  // Подписки
  onPickup$: Subscription<InfectedPickedUpEvent>;

  onDied$: Subscription<InfectedDiedEvent>;

  getSpritesToRender(): Sprite[] {
    return [];
  }

  getTextsToRender(): Text[] {
    return [this.infectedText, this.inAmbulanceText, this.diedText];
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

    this.persons = this.initPersons(
      new Vector2(0, 0), new Vector2(renderer.width, renderer.height),
      GAME_SETTINGS.infectedCount,
      GAME_SETTINGS.infectedStartCount,
    );

    this.infectedText = new Text('Заражено: 0');
    this.infectedText.position.set(10, 5, 15);

    this.inAmbulanceText = new Text('В скорой: 0');
    this.inAmbulanceText.position.set(200, 5, 15);

    this.diedText = new Text('Умерло: 0');
    this.diedText.position.set(400, 5, 15);

    this.player = new Player();
    this.player.initialize(new Vector2(300, 300), GAME_SETTINGS.playerSpeed);

    this.diedCount = 0;

    this.onPickup$ = GlobalEvents.infectedPickedUp.subscribe(event => this.onPickUp(event));
    this.onDied$ = GlobalEvents.infectedDied.subscribe(event => this.onInfectedDied(event));

    return super.load();
  }

  unload(): Promise<void> {
    this.guiManager.free();
    this.guiTextBatch.free();
    this.guiSpriteBatch.free();
    this.renderHelper.free();

    this.onPickup$.unsubscribe();
    this.onDied$.unsubscribe();

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
      .map(person => {
        this.checkInfection(person);
        this.checkAmbulancePickup(person);
        return person;
      })
      .length;

    this.infectedText.text = `Заражено: ${infectedCount}`;

    this.player.update(deltaTime);
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
    // nothing
  }

  onPause(pause: boolean): void {
    super.onPause(pause);
    this.guiManager.enabled = !pause;
  }

  private checkInfection(infected: Person): void {
    this.persons
      .filter(person => !person.isInfected
        && person.sprite.position.subtract(infected.sprite.position).lengthQ() < GAME_SETTINGS.infectionDistanceQ)
      .map(person => person.setInfected());
  }

  private checkAmbulancePickup(infected: Person): void {
    const isPickup = infected.sprite.position.subtract(this.player.sprite.position).lengthQ() < GAME_SETTINGS.playerPickupDistance
      && this.player.canPickup();

    if (isPickup) {
      GlobalEvents.infectedPickedUp.next(new InfectedPickedUpEvent(infected, this.player));
    }
  }

  private onPickUp(event: InfectedPickedUpEvent): void {
    const index = this.persons.indexOf(event.infected);

    this.persons.splice(index, 1);

    this.inAmbulanceText.text = `В скорой: ${this.player.pickedUpCount}`;
  }

  private onInfectedDied(event: InfectedDiedEvent): void {
    const index = this.persons.indexOf(event.infected);

    this.persons.splice(index, 1);

    ++this.diedCount;

    this.diedText.text = `Умерло: ${this.diedCount}`;
  }

  private initPersons(regionTopLeft: Vector2, regionBottomRight: Vector2, count: number, infectedCount: number): Person[] {
    const persons: Person[] = [];

    let infectedCountLeft = infectedCount;

    for (let i = 0; i < count; ++i) {
      const person = new Person();
      person.initialize(regionTopLeft, regionBottomRight, GAME_SETTINGS.infectedSpeed);

      if (infectedCountLeft > 0) {
        person.setInfected();
        --infectedCountLeft;
      }

      persons.push(person);
    }

    return persons;
  }
}
