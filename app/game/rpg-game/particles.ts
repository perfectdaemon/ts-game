import { IPoolItem } from '../../engine/helpers/pool/ipool-item';
import { Pool } from '../../engine/helpers/pool/pool';
import { Vector2 } from '../../engine/math/vector2';
import { Material } from '../../engine/render/material';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Sprite } from '../../engine/scene/sprite';

export class Particle implements IPoolItem {
  active: boolean;
  pause: number;
  t: number;
  lifeTime: number;
  velocity: Vector2 = new Vector2();
  sprite: Sprite = new Sprite();

  onActivate(): void {
    this.pause = 0;
    this.t = 0;
    this.lifeTime = 0;
    this.velocity.set(0, 0);
    this.sprite.visible = true;
    this.sprite.rotation = 0;
    this.sprite.setVerticesColor(1, 1, 1, 1);
  }
  onDeactivate(): void {
    this.sprite.visible = false;
  }
}

export class ParticleEmitter extends Pool<Particle> {
  visible: boolean;

  constructor(
    public spriteBatch: SpriteBatch,
    public material: Material,
    newItem: () => Particle,
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

      particle.sprite.position.addToSelf(particle.velocity.multiplyNum(deltaTime));
      const alpha = (particle.lifeTime - particle.t) / particle.lifeTime;
      particle.sprite.setVerticesAlpha(alpha);
      particle.velocity.multiplyNumSelf(1 - 0.08 * Math.random());
    });
  }

  render(): void {
    this.material.bind();
    this.spriteBatch.start();
    for (const poolObject of this.poolObjects) {
      if (poolObject.pause > 0) {
        continue;
      }

      this.spriteBatch.drawSingle(poolObject.sprite);
    }
    this.spriteBatch.finish();
  }
}
