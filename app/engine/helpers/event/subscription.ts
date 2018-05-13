import { Observable } from './observable';

export class Subscription<Payload> {
  constructor(public observable: Observable<Payload>) { }

  callback: (data: Payload) => void = () => {};

  unsubscribe(): void {
    this.observable.unsubscribe(this);
  }
}
