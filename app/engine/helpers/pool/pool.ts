import { IPoolItem } from './ipool-item';

const defaultInitialSize = 30;

export class Pool<Item extends IPoolItem> {
  poolObjects: Item[];

  constructor(public newItem: () => Item, initialSize?: number) {
    this.poolObjects = new Array<Item>(initialSize || defaultInitialSize);

    for (let i = 0; i < this.poolObjects.length; ++i) {
      this.poolObjects[i] = this.newItem();
      this.poolObjects[i].onDeactivate();
    }
  }

  get(): Item {
    for (const item of this.poolObjects) {
      if (!item.active) {
        item.active = true;
        item.onActivate();
        return item;
      }
    }

    const newItem = this.newItem();
    newItem.active = true;
    newItem.onActivate();
    this.poolObjects.push(newItem);
    return newItem;
  }

  return(item: Item): void {
    item.active = false;
    item.onDeactivate();
  }
}
