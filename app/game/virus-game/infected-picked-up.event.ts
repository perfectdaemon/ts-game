import { Person } from './scenes/person';
import { Player } from './scenes/player';

export class InfectedPickedUpEvent {
  constructor(
    public infected: Person,
    public ambulance: Player,
  ) {}
}
