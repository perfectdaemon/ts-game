import { IPoolItem } from '../../engine/helpers/pool/ipool-item';
import { Pool } from '../../engine/helpers/pool/pool';
import { Vector2 } from '../../engine/math/vector2';
import { Material } from '../../engine/render/material';
import { SpriteBatch } from '../../engine/render2d/sprite-batch';
import { Sprite } from '../../engine/scene/sprite';

export class Particle implements IPoolItem {
  active: boolean;
  t: number;
  lifeTime: number;
  velocity: Vector2 = new Vector2();
  sprite: Sprite = new Sprite();

  onActivate(): void {
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
  enabled: boolean;
  time: number;

  constructor(
    public spriteBatch: SpriteBatch,
    public material: Material,
    newItem: () => Particle,
    initialSize?: number,
  ) {
    super(newItem, initialSize);
    this.time = 0;
    this.enabled = true;
    this.visible = true;
  }

  update(deltaTime: number): void {
    if (!this.visible) { return; }

    this.time += deltaTime;
    this.poolObjects.forEach(particle => {
      if (!particle.active) {
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
      particle.velocity.multiplyNumSelf(0.95);
    });
  }

  render(): void {
    this.material.bind();
    this.spriteBatch.start();
    for (const poolObject of this.poolObjects) {
      this.spriteBatch.drawSingle(poolObject.sprite);
    }
    this.spriteBatch.finish();
  }
}
