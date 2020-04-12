import { Observable } from '../../engine/helpers/event/observable';
import { InfectedPickedUpEvent } from './infected-picked-up.event';

export class GlobalEvents {
  static infectedPickedUp: Observable<InfectedPickedUpEvent> = new Observable<InfectedPickedUpEvent>();
}
