import { AABB } from '../math/aabb';
import { SpriteBatch } from '../render2d/sprite-batch';
import { TextBatch } from '../render2d/text-batch';
import { Sprite } from '../scene/sprite';
import { Text } from '../scene/text';
import { GuiElement } from './gui-element';

export class GuiButton extends GuiElement {
  sprite: Sprite;
  label: Text;

  hitBox = new AABB();

  constructor() {
    super();

    this.sprite = new Sprite();
    this.label = new Text('Button');
    this.label.pivotPoint.set(0.5, 0.5);
    this.label.parent = this.sprite;
  }

  render(spriteBatch: SpriteBatch, textBatch: TextBatch): void {
    spriteBatch.drawSingle(this.sprite);
    this.label.position.z = this.sprite.position.z + 1;
    textBatch.drawSingle(this.label);
  }

  update(deltaTime: number): void { }

  updateHitBox(): void {
    this.hitBox.center
      .set(0.5, 0.5)
      .subtractFromSelf(this.sprite.pivotPoint)
      .multiplyVecSelf(this.sprite.width, this.sprite.height)
      .addToSelf(this.sprite.position);

    this.hitBox.halfSize.set(this.sprite.width / 2.0, this.sprite.height / 2.0);
  }
}
