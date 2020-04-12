import { Person } from './scenes/person';

export class InfectedDiedEvent {
  constructor(public infected: Person) { }
}
