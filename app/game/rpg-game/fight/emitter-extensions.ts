import { Vector2 } from '../../../engine/math/vector2';
import { Vector4 } from '../../../engine/math/vector4';
import { GLOBAL } from '../global';
import { SpriteParticle, SpriteParticleEmitter, TextParticle, TextParticleEmitter } from '../particles';

export class ParticleEmitterExtensions {
  static createSmallParticle(): SpriteParticle {
    const particle = new SpriteParticle();
    particle.sprite.position.set(0, 0, 50);
    const textureRegion = GLOBAL.assets.solarAtlas.getRegion('circle_bordered.png');
    particle.sprite.setTextureRegion(textureRegion, false);
    return particle;
  }

  static createTextParticle(): TextParticle {
    const particle = new TextParticle();
    particle.text.position.set(0, 0, 50);
    return particle;
  }

  static emitHit(emitter: SpriteParticleEmitter, position: Vector2): void {
    for (let i = 0; i < 32; ++i) {
      const particle = emitter.get();

      const size = 5 + 5 * Math.random();
      particle.sprite.setSize(size, size);
      particle.sprite.setDefaultVertices();

      particle.sprite.position
        .set(position)
        .addToSelf(new Vector2(5 - 10 * Math.random(), 5 - 10 * Math.random()));

      particle.sprite.rotation = 360 * Math.random();

      particle.sprite.setVerticesColor(
        0.9 + 0.1 * Math.random(),
        0.2 + 0.1 * Math.random(),
        0.0 + 0.1 * Math.random(),
        1.0);

      particle.pause = 0.1 * Math.random();
      particle.lifeTime = 1.0 + 0.6 * Math.random();
      particle.velocity = Vector2
        .fromAngle(360 * Math.random())
        .multiplyNumSelf(60 + 140 * Math.random());
    }
  }

  static emitHitWithShield(emitter: SpriteParticleEmitter, position: Vector2): void {
    for (let i = 0; i < 32; ++i) {
      const particle = emitter.get();

      const size = 5 + 5 * Math.random();
      particle.sprite.setSize(size, size);
      particle.sprite.setDefaultVertices();

      particle.sprite.position
        .set(position)
        .addToSelf(new Vector2(5 - 10 * Math.random(), 5 - 10 * Math.random()));

      particle.sprite.rotation = 360 * Math.random();

      if (i < 16) {
        particle.sprite.setVerticesColor(1.0, 0.8, 0.2, 1.0);
      } else {
        particle.sprite.setVerticesColor(0.1, 0.2, 1.0, 1.0);
      }

      particle.pause = 0.1 * Math.random();
      particle.lifeTime = 0.6 + Math.random();
      particle.velocity = Vector2
        .fromAngle(360 * Math.random())
        .multiplyNumSelf(60 + 140 * Math.random());
    }
  }

  static emitCellBoom(emitter: SpriteParticleEmitter, position: Vector2): void {
    for (let i = 0; i < 64; ++i) {
      const particle = emitter.get();

      const size = 1 + 10 * Math.random();
      particle.sprite.setSize(size, size);
      particle.sprite.setDefaultVertices();

      particle.sprite.position
        .set(position)
        .addToSelf(new Vector2(5 - 10 * Math.random(), 5 - 10 * Math.random()));

      particle.sprite.rotation = 360 * Math.random();

      particle.sprite.setVerticesColor(1.0, 0.1, 0.1, 1.0);

      particle.pause = 0.2 * Math.random();
      particle.lifeTime = 2.0 + Math.random();
      particle.velocity = Vector2
        .fromAngle(360 * Math.random())
        .multiplyNumSelf(140 + 100 * Math.random());
    }
  }

  static emitDamageCount(emitter: TextParticleEmitter, position: Vector2, amount: number, color: Vector4, scale: number): void {
    const particle = emitter.get();

    particle.text.text = amount.toString();
    particle.text.color.set(color);
    particle.text.position.set(position);
    particle.text.shadowEnabled = true;
    particle.text.shadowOffset.set(1, 1);
    particle.text.shadowColor.set(0, 0, 0, 1);
    particle.text.scale = scale;
    particle.lifeTime = 1.6;
    particle.pause = 0;
    particle.velocity = Vector2
      .fromAngle(-120 + 60 * Math.random())
      .multiplyNumSelf(140 + 100 * Math.random());
  }
}
