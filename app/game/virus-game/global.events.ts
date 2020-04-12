import { Observable } from '../../engine/helpers/event/observable';
import { InfectedPickedUpEvent } from './infected-picked-up.event';
import { InfectedDiedEvent } from './infected-died.event';

export class GlobalEvents {
  static infectedPickedUp: Observable<InfectedPickedUpEvent> = new Observable<InfectedPickedUpEvent>();

  static infectedDied: Observable<InfectedDiedEvent> = new Observable<InfectedDiedEvent>();
}
