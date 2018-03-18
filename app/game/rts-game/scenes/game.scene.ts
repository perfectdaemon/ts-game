import { renderer } from '../../../engine/render/webgl';
import { SpriteBatch } from '../../../engine/render2d/sprite-batch';
import { TextBatch } from '../../../engine/render2d/text-batch';
import { Sprite } from '../../../engine/scene/sprite';
import { Text } from '../../../engine/scene/text';
import { Assets } from '../assets/assets';
import { UnitManager } from '../units/unit-manager';
import { Scene } from './scene';

export class GameScene extends Scene {

  unitManager: UnitManager = new UnitManager();

  textBatch: TextBatch;
  text: Text = new Text('Hello world!');
  sprite: Sprite = new Sprite(20, 20);
  spriteBatch: SpriteBatch = new SpriteBatch();

  constructor(private assets: Assets) {
    super();

    this.textBatch = new TextBatch(assets.font);
    this.sprite.position.set(10, 10, 0);
  }

  load(): Promise<void> {
    this.text.position.set(50, 50, 10);
    this.text.color.set(1, 0, 0, 1);
    return super.load();
  }

  render(): void {
    this.assets.gameCamera.update();

    this.textBatch.start();
    this.textBatch.drawSingle(this.text);
    this.textBatch.finish();
  }

  update(deltaTime: number): void {
    this.unitManager.update(deltaTime);
  }
}
