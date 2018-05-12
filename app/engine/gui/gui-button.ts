import { AABB } from '../math/aabb';
import { SpriteBatch } from '../render2d/sprite-batch';
import { TextBatch } from '../render2d/text-batch';
import { Sprite } from '../scene/sprite';
import { Text } from '../scene/text';
import { GuiElement } from './gui-element';

export class GuiButton extends GuiElement {
  sprite: Sprite = new Sprite();
  label: Text = new Text('Button');

  hitBox = new AABB();

  render(spriteBatch: SpriteBatch, textBatch: TextBatch): void {
    spriteBatch.drawSingle(this.sprite);
    this.label.position.z = this.sprite.position.z + 1;
    textBatch.drawSingle(this.label);
  }
  update(deltaTime: number): void { }

  updateHitBox(): void {
    this.hitBox.center
      .set(this.sprite.position)
      .addToSelf(this.sprite.pivotPoint);

    this.hitBox.halfSize.set(this.sprite.width / 2, this.sprite.height / 2);
  }
}
