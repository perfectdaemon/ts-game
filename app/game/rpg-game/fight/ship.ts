import { Sprite } from '../../../engine/scene/sprite';
import { ShipCell } from './ship-cell';

export class Ship {
  cells: ShipCell[] = [];

  renderable: ShipRenderable = new ShipRenderable();
}

export class ShipRenderable {
  sprite: Sprite;
}
