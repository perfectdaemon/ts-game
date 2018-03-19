import { INPUT } from '../../../engine/input/input';
import { Keys } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';
import { renderer } from '../../../engine/render/webgl';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { GLOBAL } from '../global';
import { UnitManager } from '../units/unit-manager';
import { Scene } from './scene';

export class GameScene extends Scene {

  unitManager: UnitManager = new UnitManager();

  textBatch: TextBatch;
  text: Text = new Text('Hello world!');
  sprite: Sprite = new Sprite(20, 20);
  spriteBatch: SpriteBatch = new SpriteBatch();

  constructor() {
    super();

    this.textBatch = new TextBatch(GLOBAL.assets.font);
    this.sprite.position.set(10, 10, 0);
  }

  load(): Promise<void> {
    this.text.position.set(50, 50, 10);
    this.text.color.set(1, 0, 0, 1);

    this.unitManager.addUnit(new Vector2(30, 30));
    this.unitManager.addUnit(new Vector2(50, 30));
    this.unitManager.addUnit(new Vector2(30, 100));

    return super.load();
  }

  render(): void {
    GLOBAL.assets.gameCamera.update();

    this.unitManager.render();

    this.textBatch.start();
    this.textBatch.drawSingle(this.text);
    this.textBatch.finish();
  }

  update(deltaTime: number): void {
    this.unitManager.update(deltaTime);
  }

  onKeyDown(key: Keys): void {
    console.log(key);
    if (key === Keys.S) {
      this.unitManager.addUnit(INPUT.mousePos);
    }
  }
}
