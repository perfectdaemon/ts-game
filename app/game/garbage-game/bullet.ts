import { Vector2 } from '../../engine/math/vector2';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { renderer } from '../../engine/render/webgl';
import { Sprite } from '../../engine/scene/sprite';
import { Circle } from './physics/circle';
import { IPoolItem } from './pool/ipool-item';

export class Bullet implements IPoolItem {
  active: boolean = false;

  sprite: Sprite;
  collider: Circle;
  moveVector: Vector2 = new Vector2();

  private moveVectorN: Vector2 = new Vector2();

  constructor(textureRegion: TextureRegion, multSize: number = 1) {
    this.sprite = new Sprite();
    this.sprite.position.z = 1;
    this.sprite.setTextureRegion(textureRegion, true);
    this.sprite.multSize(multSize);

    this.collider = new Circle(new Vector2(), this.sprite.width / 2);
  }

  onActivate(): void {
    this.sprite.visible = true;
  }
  onDeactivate(): void {
    this.sprite.visible = false;
  }

  update(deltaTime: number): void {
    if (!this.active) { return; }

    this.moveVectorN = this.moveVector.multiplyNum(deltaTime * 550);
    this.sprite.position.addToSelf(this.moveVectorN);
    this.collider.center.set(this.sprite.position);

    if (this.isOutOfScreen()) {
      this.active = false;
      this.onDeactivate();
    }
  }

  private isOutOfScreen(): boolean {
    return this.sprite.position.x < 0 || this.sprite.position.x > renderer.width
      || this.sprite.position.y < 0 || this.sprite.position.y > renderer.height;
  }
}
