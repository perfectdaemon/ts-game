import { IPoolItem } from './ipool-item';

const defaultInitialSize = 30;

export class Pool<Item extends IPoolItem> {
  private _poolObjects: Item[];
  private _newItem: () => Item;

  constructor(newItem: () => Item, initialSize?: number) {
    this._poolObjects = new Array<Item>(initialSize || defaultInitialSize);
    this._newItem = newItem;
  }

  get(): Item {
    for (const item of this._poolObjects) {
      if (!item.active) {
        item.active = true;
        item.onActivate();
        return item;
      }
    }

    const newItem = this._newItem();
    newItem.active = true;
    newItem.onActivate();
    this._poolObjects.push(newItem);
    return newItem;
  }

  return(item: Item): void {
    item.active = false;
    item.onDeactivate();
  }
}
