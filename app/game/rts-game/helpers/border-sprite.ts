import { Vector2 } from '../../../engine/math/vector2';
import { Sprite } from '../../../engine/scene/sprite';

export class BorderSprite {
  sprites = new Array<Sprite>(4);

  constructor(
    public start: Vector2,
    public finish: Vector2,
    public borderWidth: number,
  ) {
    this.createSprites();
    this.updateSprites();
  }

  updateSprites(): void {
    this.sprites[0].setSize(this.finish.x - this.start.x, this.borderWidth);
    this.sprites[0].position.set(this.start);

    this.sprites[1].setSize(this.borderWidth, this.finish.y - this.start.y);
    this.sprites[1].position.set(this.start).addToSelf(this.finish.x - this.start.x, 0, 0);

    this.sprites[2].setSize(this.finish.x - this.start.x, this.borderWidth);
    this.sprites[2].position.set(this.start).addToSelf(0, this.finish.y - this.start.y, 0);

    this.sprites[3].setSize(this.borderWidth, this.finish.y - this.start.y);
    this.sprites[3].position.set(this.start);
  }

  private createSprites(): void {
    this.sprites[0] = new Sprite(this.finish.x - this.start.x, this.borderWidth, new Vector2(0, 0.5)); // top
    this.sprites[1] = new Sprite(this.borderWidth, this.finish.y - this.start.y, new Vector2(0.5, 0)); // right
    this.sprites[2] = new Sprite(this.finish.x - this.start.x, this.borderWidth, new Vector2(0, 0.5)); // bottom
    this.sprites[3] = new Sprite(this.borderWidth, this.finish.y - this.start.y, new Vector2(0.5, 0)); // left

    for (const sprite of this.sprites) {
      sprite.position.z = 1;
    }
  }
}
