import { Vector2 } from './vector2';

export interface IFigure {
  overlaps(other: IFigure): boolean;

  hit(point: Vector2): boolean;
}
