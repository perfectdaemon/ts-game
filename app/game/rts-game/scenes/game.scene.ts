import { INPUT } from '../../../engine/input/input';
import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { BorderSprite } from '../helpers/border-sprite';
import { UnitManager } from '../units/unit-manager';
import { Scene } from './scene';

const cameraMoveBorderThreshold = 70;
const cameraMoveSpeed = 250;

export class GameScene extends Scene {
  unitManager: UnitManager = new UnitManager();

  textBatch: TextBatch;
  text: Text = new Text('Hello world!');

  spriteBatch: SpriteBatch = new SpriteBatch();
  selection: BorderSprite = new BorderSprite(new Vector2(0, 0), new Vector2(0, 0), 4);
  cameraMovementDirection: Vector2 = new Vector2();

  constructor() {
    super();

    this.textBatch = new TextBatch(GLOBAL.assets.font);
  }

  load(): Promise<void> {
    this.text.position.set(50, 50, 10);
    this.text.color.set(1, 0, 0, 1);

    return super.load();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();

    this.unitManager.render();

    this.spriteBatch.start();
    this.spriteBatch.drawArray(this.selection.sprites);
    this.spriteBatch.finish();

    this.textBatch.start();
    this.textBatch.drawSingle(this.text);
    this.textBatch.finish();
  }

  update(deltaTime: number): void {
    this.unitManager.update(deltaTime);

    GLOBAL.assets.gameCamera.translate(
      this.cameraMovementDirection.y * deltaTime * cameraMoveSpeed,
      this.cameraMovementDirection.x * deltaTime * cameraMoveSpeed,
      0);
  }

  onKeyDown(key: Keys): void {
    const world = this.getWorldPosition(INPUT.mousePos);

    if (key === Keys.S) {
      this.unitManager.addUnit(world);
    }
  }

  onMouseDown(position: Vector2, button: MouseButtons): void {
    const world = this.getWorldPosition(position);

    switch (button) {
      case Keys.LeftButton:
        this.selection.start.set(world);
        break;
      case Keys.RightButton:
        this.unitManager.moveSelectedUnits(world);
        break;
    }
  }

  onMouseMove(position: Vector2): void {
    // camera move
    this.cameraMovementDirection.set(0, 0);

    if (position.x < cameraMoveBorderThreshold) {
      this.cameraMovementDirection.x = -1;
    } else if (renderer.width - position.x < cameraMoveBorderThreshold) {
      this.cameraMovementDirection.x = 1;
    }

    if (position.y < cameraMoveBorderThreshold) {
      this.cameraMovementDirection.y = -1;
    } else if (renderer.height - position.y < cameraMoveBorderThreshold) {
      this.cameraMovementDirection.y = 1;
    }

    const world = this.getWorldPosition(position);

    // selection frame
    if (INPUT.touches[1].isDown) {
      this.selection.finish.set(world);
      this.selection.updateSprites();
    }
  }

  onMouseUp(position: Vector2, button: MouseButtons): void {
    if (button === Keys.LeftButton) {

      const world = this.getWorldPosition(position);

      this.unitManager.select(this.selection.start, world);

      this.selection.start.set(0, 0);
      this.selection.finish.set(0, 0);
      this.selection.updateSprites();
    }
  }

  private getWorldPosition(position: Vector2): Vector2 {
    return new Vector2().set(GLOBAL.assets.gameCamera.screenToWorld(position));
  }
}
