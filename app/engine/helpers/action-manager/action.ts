import { IPoolItem } from '../pool/ipool-item';
import { ActionManager } from './action-manager';
import { ActionType } from './action-type.enum';
import { ContinuousAction, SimpleAction } from './actions.func';

export class Action implements IPoolItem {
  active: boolean = false;
  actionType: ActionType = ActionType.Simple;
  pauseOnStart: number = 0;
  time: number = 0;
  duration: number = 0;

  constructor(private _actionManager: ActionManager) { }

  action: SimpleAction | ContinuousAction = () => false;

  onActivate(): void {
    this.active = true;
    this.time = 0;
    this.duration = 0;
  }

  onDeactivate(): void {
    this.active = false;
  }

  /*addAfter(actionCallback: ContinuousAction, duration: number, pauseOnStart: number = 0): Action {
    return this._actionManager.add(actionCallback, duration, pauseOnStart);
  }*/

  update(deltaTime: number): void {
    if (!this.active) { return; }

    if (this.actionType === ActionType.Simple) {
      (this.action as SimpleAction)();
      this.onDeactivate();
      return;
    }

    this.time += deltaTime;

    if (this.time < this.pauseOnStart) { return; }

    const callbackResult = (this.action as ContinuousAction)(deltaTime);
    if (!callbackResult || this.time >= this.duration + this.pauseOnStart) {
      this.onDeactivate();
    }
  }
}
