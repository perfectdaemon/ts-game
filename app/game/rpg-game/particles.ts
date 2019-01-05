import { IPoolItem } from '../../engine/helpers/pool/ipool-item';
import { Pool } from '../../engine/helpers/pool/pool';
import { Vector2 } from '../../engine/math/vector2';
import { Sprite } from '../../engine/scene/sprite';
import { Text } from '../../engine/scene/text';
import { IRenderable, RenderHelper } from './render-helper';

export abstract class ParticleBase implements IPoolItem, IRenderable {
  active: boolean;
  pause: number;
  t: number;
  lifeTime: number;
  velocity: Vector2 = new Vector2();

  onActivate(): void {
    this.pause = 0;
    this.t = 0;
    this.lifeTime = 0;
    this.velocity.set(0, 0);
  }
  onDeactivate(): void {

  }

  abstract updateParams(deltaTime: number): void;
  abstract getSpritesToRender(): Sprite[];
  abstract getTextsToRender(): Text[];
}

export class SpriteParticle extends ParticleBase {
  sprite: Sprite = new Sprite();

  onActivate(): void {
    super.onActivate();
    this.sprite.visible = true;
    this.sprite.rotation = 0;
    this.sprite.setVerticesColor(1, 1, 1, 1);
  }
  onDeactivate(): void {
    super.onDeactivate();
    this.sprite.visible = false;
  }

  updateParams(deltaTime: number) {
    this.sprite.position.addToSelf(this.velocity.multiplyNum(deltaTime));
    const alpha = (this.lifeTime - this.t) / this.lifeTime;
    this.sprite.setVerticesAlpha(alpha);
    this.velocity.multiplyNumSelf(1 - 0.08 * Math.random());
  }

  getSpritesToRender(): Sprite[] {
    return [this.sprite];
  }

  getTextsToRender(): Text[] {
    return [];
  }
}

export class TextParticle extends ParticleBase {
  text: Text = new Text();

  onActivate(): void {
    super.onActivate();
    this.text.visible = true;
    this.text.color.set(1, 1, 1, 1);
  }
  onDeactivate(): void {
    super.onDeactivate();
    this.text.visible = false;
  }

  updateParams(deltaTime: number) {
    this.text.position.addToSelf(this.velocity.multiplyNum(deltaTime));
    const alpha = (this.lifeTime - this.t) / this.lifeTime;
    this.text.color.w = alpha;
    this.velocity.multiplyNumSelf(1 - 0.08 * Math.random());
  }

  getSpritesToRender(): Sprite[] {
    return [];
  }

  getTextsToRender(): Text[] {
    return [this.text];
  }
}

export class ParticleEmitter<T extends ParticleBase> extends Pool<T> {
  visible: boolean;

  constructor(
    public renderHelper: RenderHelper,
    newItem: () => T,
    initialSize?: number,
  ) {
    super(newItem, initialSize);
    this.visible = true;
  }

  update(deltaTime: number): void {
    if (!this.visible) { return; }

    this.poolObjects.forEach(particle => {
      if (!particle.active) {
        return;
      }

      if (particle.pause > 0) {
        particle.pause -= deltaTime;
        return;
      }

      particle.t += deltaTime;

      if (particle.t >= particle.lifeTime) {
        this.return(particle);
        return;
      }

      particle.updateParams(deltaTime);
    });
  }

  render(): void {
    this.renderHelper.render(this.poolObjects.filter(it => it.pause <= 0));
  }
}

export class SpriteParticleEmitter extends ParticleEmitter<SpriteParticle> { }
export class TextParticleEmitter extends ParticleEmitter<TextParticle> { }
