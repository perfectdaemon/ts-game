import { BaseData } from '../../../engine/loaders/base.data';
import { loadData } from '../../../engine/loaders/data-loaders.registry';

export class GameAssetLoader {
  loadAssets<T>(assets: { data: BaseData, result: any }[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const promises: Promise<void>[] = [];
      for (const asset of assets) {
        const promise = loadData(asset.data).then(result => { asset.result = result; });
        promises.push(promise);
      }
      Promise.all(promises)
        .then(() => resolve());
    });
  }
}
