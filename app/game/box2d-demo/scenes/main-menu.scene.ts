import * as p2 from 'p2';
import { GuiButton } from '../../../engine/gui/gui-button';
import { GuiManager } from '../../../engine/gui/gui-manager';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Sprite } from '../../../engine/scene/sprite';
import { Scene } from '../../../engine/scenes/scene';
import { GLOBAL } from '../global';

export class MainMenuScene extends Scene {
  guiManager: GuiManager;

  world: p2.World;
  circleBody: p2.Body;

  fixedTimeStep = 1 / 60;

  sprite: Sprite;
  spriteBatch: SpriteBatch;

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

    const button = new GuiButton();
    button.sprite.setSize(250, 50);
    button.sprite.position.set(350, 250, 5);
    button.sprite.setVerticesColor(new Vector4(0.3, 0.5, 0.7, 1.0));
    button.label.color.set(1, 1, 1, 1);
    button.onClick = (el, ev) => {
      button.label.text = `clicked: ${ev.x}, ${ev.y}`;
    };

    button.onTouchDown = () => button.sprite.setVerticesColor(new Vector4(1, 0, 0, 1));
    button.onTouchUp = () => button.sprite.setVerticesColor(new Vector4(0.3, 0.5, 0.7, 1.0));

    button.updateHitBox();

    this.guiManager.elements.push(button);

    this.sprite = new Sprite(10, 10);
    this.sprite.position.set(10, 10, 1);
    this.sprite.setVerticesColor(new Vector4(1, 0, 0, 1));
    this.spriteBatch = new SpriteBatch();

    this.p2test();

    return super.load();
  }

  p2test(): void {
    // Create a physics world, where bodies and constraints live
    this.world = new p2.World({
      gravity: [0, -9.82],
    });

    // Create an empty dynamic body
    this.circleBody = new p2.Body({
      mass: 5,
      position: [15, 20],
    });

    this.circleBody.damping = 0.9;

    // Add a circle shape to the body
    const circleShape = new p2.Circle({ radius: 1 });
    this.circleBody.addShape(circleShape);
    const materialCircle = new p2.Material(0);
    circleShape.material = materialCircle;
    this.world.addBody(this.circleBody);

    // Create an infinite ground plane body
    const groundBody = new p2.Body({
      mass: 0, // Setting mass to 0 makes it static
      position: [0, 0],
    });
    const groundShape = new p2.Plane();
    groundBody.addShape(groundShape);
    const materialGround = new p2.Material(1);
    groundShape.material = materialGround;
    this.world.addBody(groundBody);

    const pair = new p2.ContactMaterial(materialCircle, materialGround, {
      restitution: 0.1,
    });

    this.world.addContactMaterial(pair);
  }

  unload(): Promise<void> {
    this.guiManager.free();
    this.spriteBatch.free();

    return super.unload();
  }

  render(): void {
    GLOBAL.assets.guiCamera.update();
    this.guiManager.render();

    GLOBAL.assets.blankMaterial.bind();
    this.spriteBatch.start();
    this.spriteBatch.drawSingle(this.sprite);
    this.spriteBatch.finish();
  }

  update(deltaTime: number): void {
    this.guiManager.update(deltaTime);

    // Move bodies forward in time
    this.world.step(this.fixedTimeStep, deltaTime, 10);
    this.sprite.position.set(this.circleBody.interpolatedPosition[0], 768 - this.circleBody.interpolatedPosition[1], 1);
    console.log(this.circleBody.interpolatedPosition);
  }

  onKeyDown(key: Keys): void {
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
  }

  onMouseMove(position: Vector2): void {
  }

  onMouseUp(position: Vector2, button: MouseButtons): void {
  }
}
