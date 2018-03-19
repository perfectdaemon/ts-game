import { INPUT } from '../../../engine/input/input';
import { Keys } from '../../../engine/input/keys.enum';
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

export class GameScene extends Scene {

  unitManager: UnitManager = new UnitManager();

  textBatch: TextBatch;
  text: Text = new Text('Hello world!');

  spriteBatch: SpriteBatch = new SpriteBatch();
  selection: BorderSprite = new BorderSprite(new Vector2(0, 0), new Vector2(0, 0), 2);

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
  }

  onKeyDown(key: Keys): void {
    if (key === Keys.S) {
      this.unitManager.addUnit(INPUT.mousePos);
    }
  }

  onMouseDown(position: Vector2): void {
    this.selection.start.set(position);
  }

  onMouseMove(position: Vector2): void {
    if (INPUT.touches[1].isDown) {
      this.selection.finish.set(position);
      this.selection.updateSprites();
    }
  }

  onMouseUp(position: Vector2): void {
    this.selection.start.set(0, 0);
    this.selection.finish.set(0, 0);
    this.selection.updateSprites();
  }
}
