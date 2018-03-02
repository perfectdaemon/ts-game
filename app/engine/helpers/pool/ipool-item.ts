export interface IPoolItem {
  active: boolean;
  onActivate(): void;
  onDeactivate(): void;
}
