import { IPoolItem } from '../../engine/helpers/pool/ipool-item';
import { Vector2 } from '../../engine/math/vector2';
import { Circle } from '../../engine/physics/circle';
import { TextureRegion } from '../../engine/render/texture-atlas';
import { Sprite } from '../../engine/scene/sprite';

const defaultTimeToDisappear = 12;
const defaultAnimationSpeed = 0.2;
const defaultPickupColliderRadius = 28;

export abstract class PickupItem implements IPoolItem {
  active: boolean = false;
  sprite: Sprite;
  collider: Circle;
  timeToDisappear: number = defaultTimeToDisappear;
  animationSpeed: number = defaultAnimationSpeed;

  private get _animated(): boolean {
    return this._textureRegions.length > 1;
  }

  private _animationTimer: number = defaultAnimationSpeed;
  private _currentTextureRegion: number = -1;

  constructor(private _textureRegions: TextureRegion[], private _multSize: number = 1) {
    this.sprite = new Sprite();
    this.sprite.position.z = 1;
    this.setNextAnimationFrame();

    this.collider = new Circle(
      new Vector2(this.sprite.position.x, this.sprite.position.y),
      defaultPickupColliderRadius);
  }

  update(deltaTime: number): void {
    if (!this.active) { return; }

    this.timeToDisappear -= deltaTime;
    if (this.timeToDisappear <= 0) {
      this.active = false;
      this.onDeactivate();
    }

    if (this._animated) {
      this._animationTimer -= deltaTime;
      if (this._animationTimer <= 0) {
        this.setNextAnimationFrame();
        this._animationTimer = this.animationSpeed;
      }
    }
  }

  onActivate(): void {
    this.sprite.visible = true;
    this.timeToDisappear = defaultTimeToDisappear;
  }

  onDeactivate(): void {
    this.sprite.visible = false;
  }

  onPickup(): void {
    this.active = false;
    this.onDeactivate();
  }

  private setNextAnimationFrame(): void {
    this._currentTextureRegion = (++this._currentTextureRegion) % this._textureRegions.length;

    this.sprite.setTextureRegion(this._textureRegions[this._currentTextureRegion], true);
    this.sprite.multSize(this._multSize);
  }
}
