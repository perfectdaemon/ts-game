import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { Node } from '../../../engine/scene/node';
import { Sprite } from '../../../engine/scene/sprite';

export class BorderSprite {

  sprites = new Array<Sprite>(4);
  color: Vector4 = new Vector4(1, 1, 1, 1);

  private _visible: boolean = true;
  private _parent: Node | null = null;

  constructor(
    public start: Vector2,
    public finish: Vector2,
    public borderWidth: number,
  ) {
    this.createSprites();
    this.updateSprites();
  }

  get visible() { return this._visible; }
  set visible(value: boolean) {
    this._visible =
      this.sprites[0].visible = this.sprites[1].visible = this.sprites[2].visible = this.sprites[3].visible = value;
  }

  get parent() { return this._parent; }
  set parent(value: Node | null) {
    this._parent =
      this.sprites[0].parent = this.sprites[1].parent = this.sprites[2].parent = this.sprites[3].parent = value;
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

    for (const sprite of this.sprites) {
      sprite.setVerticesColor(this.color);
    }
  }

  private createSprites(): void {
    this.sprites[0] = new Sprite(this.finish.x - this.start.x, this.borderWidth, new Vector2(0, 0)); // top
    this.sprites[1] = new Sprite(this.borderWidth, this.finish.y - this.start.y, new Vector2(1, 0)); // right
    this.sprites[2] = new Sprite(this.finish.x - this.start.x, this.borderWidth, new Vector2(0, 1)); // bottom
    this.sprites[3] = new Sprite(this.borderWidth, this.finish.y - this.start.y, new Vector2(0, 0)); // left

    for (const sprite of this.sprites) {
      sprite.position.z = 1;
    }
  }
}
