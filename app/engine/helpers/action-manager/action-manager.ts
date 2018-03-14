import { Pool } from '../pool/pool';
import { Action } from './action';
import { ActionType } from './action-type.enum';
import { ContinuousAction, SimpleAction } from './actions.func';

export class ActionManager {
  private _pool: Pool<Action> = new Pool<Action>(() => new Action(this), 10);

  add(actionCallback: SimpleAction | ContinuousAction, pauseOnStart: number = 0, duration?: number): Action {
    const action = this._pool.get();

    if (duration !== undefined) {
      action.duration = duration;
    }
    action.pauseOnStart = pauseOnStart;
    action.actionType = this.isSimpleAction(actionCallback)
      ? ActionType.Simple
      : ActionType.Continuous;
    action.action = actionCallback;
    return action;
  }

  addAfter(
    otherAction: Action, actionCallback: SimpleAction | ContinuousAction,
    pauseOnStart: number = 0, duration?: number,
  ): Action {
    const action = this.add(actionCallback, pauseOnStart, duration);
    action.paused = true;
    otherAction.nextActions.push(action);
    return action;
  }

  update(deltaTime: number): void {
    for (const action of this._pool.poolObjects) {
      action.update(deltaTime);
    }
  }

  private isSimpleAction(actionCallback: SimpleAction | ContinuousAction): actionCallback is SimpleAction {
    return (actionCallback as SimpleAction).length === 0;
  }
}
