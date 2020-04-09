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
import { Vector3 } from '../../../engine/math/vector3';

export class Person implements IRenderable {

  getSpritesToRender(): Sprite[] {
    return [this.sprite];
  }
  getTextsToRender(): Text[] {
    return [];
  }

  sprite: Sprite;

  isInfected: boolean;

  regionTopLeft: Vector2;
  regionBottomRight: Vector2
  velocity: Vector2;
  timeToChangeDirection: number;
  timeToChangeDirectionCounter: number;
  velocityMultiplier: number;

  initialize(regionTopLeft: Vector2, regionBottomRight: Vector2, velocityMultiplier: number): void {
    const textureRegion = GLOBAL.assets.solarAtlas.getRegion('triangle.png');

    this.sprite = new Sprite();
    this.sprite.setTextureRegion(textureRegion, false);
    this.sprite.setSize(16, 16);

    this.sprite.position.set(
      regionTopLeft.x + Math.random() * (regionBottomRight.x - regionTopLeft.x),
      regionTopLeft.y + Math.random() * (regionBottomRight.y - regionTopLeft.y),
      10
    );
    this.regionTopLeft = regionTopLeft;
    this.regionBottomRight = regionBottomRight;

    this.velocityMultiplier = velocityMultiplier;
    this.changeDirection();

    this.timeToChangeDirection = 3 + 3 * Math.random();
    this.timeToChangeDirectionCounter = this.timeToChangeDirection;
  }

  update(deltaTime: number): void {
    this.move(deltaTime);

    this.timeToChangeDirectionCounter -= deltaTime;
    if (this.timeToChangeDirectionCounter < 0) {
      this.timeToChangeDirectionCounter = this.timeToChangeDirection;
      this.changeDirection();
    }

    this.checkRegion();
  }

  setInfected(): void {
    this.isInfected = true;

    this.sprite.setVerticesColor(1, 0.1, 0.1, 1.0);
  }

  setCured(): void {
    this.isInfected = false;

    this.sprite.setVerticesColor(0.1, 1.0, 0.1, 1.0);
  }

  private move(deltaTime: number): void {
    this.sprite.position.addToSelf(this.velocity.multiplyNum(deltaTime));
  }

  private changeDirection(rotation?: number): void {
    this.sprite.rotation = rotation ?? 360 * Math.random();
    this.velocity = Vector2.fromAngle(this.sprite.rotation - 90).multiplyNum(this.velocityMultiplier);
  }

  private checkRegion(): void {
    if (this.sprite.position.x < this.regionTopLeft.x
      || this.sprite.position.x > this.regionBottomRight.x
      || this.sprite.position.y < this.regionTopLeft.y
      || this.sprite.position.y > this.regionBottomRight.y) {
        const newDirection = this.sprite.position.asVector2().subtract(new Vector2(500, 400)).toAngle() - 90;
        this.changeDirection(newDirection);
      }
  }
}

export class GameScene extends Scene {
  guiManager: GuiManager;
  guiSpriteBatch: SpriteBatch;
  guiTextBatch: TextBatch;
  renderHelper: RenderHelper;

  persons: Person[] = [];

  constructor() {
    super();
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
    GLOBAL.assets.guiCamera.update();
    this.guiManager.render();
  }

  update(deltaTime: number): void {
    this.persons
      .map(person => person.update(deltaTime));

    this.persons
      .filter(person => person.isInfected)
      .map(person => this.checkInfection(person));
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

      if (virusRoll < virusChance)
        person.setInfected();

      persons.push(person);
    }

    return persons;
  }
}
