import { Subscription } from './subscription';

export class Observable<Payload> {
  subscriptions: Subscription<Payload>[] = [];

  subscribe(callback: ((data: Payload) => void)): Subscription<Payload> {
    const subscription = new Subscription(this);
    subscription.callback = callback;

    this.subscriptions.push(subscription);

    return subscription;
  }

  unsubscribe(subscription: Subscription<Payload>): void {
    const index = this.subscriptions.indexOf(subscription);
    this.subscriptions.splice(index, 1);
  }

  next(value: Payload): void {
    for (const subscription of this.subscriptions) {
      subscription.callback(value);
    }
  }
}
