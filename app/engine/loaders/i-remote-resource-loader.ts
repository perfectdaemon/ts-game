export interface IRemoteResourceLoader<T> {
  load(sources: string[]): Promise<T>;
}
