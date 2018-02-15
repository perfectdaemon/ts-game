import { IDataFor } from './base.data';

export interface IRemoteResourceLoader<T> {
  load(data: IDataFor<T>): Promise<T>;
}

export abstract class BaseLoader implements IRemoteResourceLoader<any> {
  abstract load(data: IDataFor<any>): Promise<any>;
}
