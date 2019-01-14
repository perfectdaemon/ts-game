import { Observable } from '../../engine/helpers/event/observable';

export class GlobalEvents {
  static takeOffFromPlanet: Observable<void> = new Observable<void>();

  static enemyDefeated: Observable<void> = new Observable<void>();

  static playerDied: Observable<void> = new Observable<void>();
}
