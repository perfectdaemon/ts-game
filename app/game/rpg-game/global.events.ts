import { Observable } from '../../engine/helpers/event/observable';

export class GlobalEvents {
  static takeOffFromPlanet: Observable<void> = new Observable<void>();
}
