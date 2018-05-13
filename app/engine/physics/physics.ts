import { AABB } from '../math/aabb';
import { Circle } from '../math/circle';
import { MovingObject } from './moving-object';

export class Physics {
  staticColliders: Array<AABB | Circle> = [];
  dynamicColliders: Array<MovingObject> = [];

  update(deltaTime: number): void {
    for (let dyn = 0; dyn < this.dynamicColliders.length; ++dyn) {
      const currentDynamic = this.dynamicColliders[dyn];

      for (const staticCollider of this.staticColliders) {
        if (staticCollider.overlaps(currentDynamic.aabb)) {
          console.log(`dyn vs static`);
        }
      }

      // dynamic vs dynamic
      for (let dynOther = dyn + 1; dynOther < this.dynamicColliders.length; ++dynOther) {
        const otherDynamic = this.dynamicColliders[dynOther];

        if (currentDynamic.aabb.overlaps(otherDynamic.aabb)) {
          console.log(`dyn vs dyn`);
        }
      }
    }
  }
}

export const physics: Physics = new Physics();
