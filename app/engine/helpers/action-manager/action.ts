import { IPoolItem } from '../pool/ipool-item';
import { ActionManager } from './action-manager';
import { ActionType } from './action-type.enum';
import { ContinuousAction, SimpleAction } from './actions.func';

export class Action implements IPoolItem {
  active: boolean = false;
  paused: boolean = false;
  actionType: ActionType = ActionType.Simple;
  pauseOnStart: number = 0;
  time: number = 0;
  duration: number = 0;
  nextActions: Action[] = [];

  constructor(private _actionManager: ActionManager) { }

  action: SimpleAction | ContinuousAction = () => false;

  onActivate(): void {
    this.active = true;
    this.paused = false;
    this.time = 0;
    this.duration = 0;
    this.nextActions = [];
  }

  onDeactivate(): void {
    this.active = false;
  }

  then(actionCallback: SimpleAction | ContinuousAction, pauseOnStart: number = 0, duration?: number): Action {
    return this._actionManager.addAfter(this, actionCallback, pauseOnStart, duration);
  }

  update(deltaTime: number): void {
    if (!this.active || this.paused) { return; }

    this.time += deltaTime;

    if (this.time < this.pauseOnStart) { return; }

    if (this.actionType === ActionType.Simple) {
      (this.action as SimpleAction)();
      this.onDeactivate();
      this.playNextActions();
      return;
    }

    const callbackResult = (this.action as ContinuousAction)(deltaTime, this.time);
    if (callbackResult || (this.duration && this.time >= this.duration + this.pauseOnStart)) {
      this.onDeactivate();
      this.playNextActions();
    }
  }

  private playNextActions(): void {
    for (const next of this.nextActions) {
      next.paused = false;
    }
  }
}
