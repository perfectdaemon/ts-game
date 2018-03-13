import { Pool } from '../pool/pool';
import { Action } from './action';
import { ActionType } from './action-type.enum';
import { ContinuousAction, SimpleAction } from './actions.func';

export class ActionManager {
  private _pool: Pool<Action> = new Pool<Action>(() => new Action(this), 10);

  add(actionCallback: ContinuousAction, duration: number, pauseOnStart: number = 0): Action {
    const action = this._pool.get();
    action.duration = duration;
    action.pauseOnStart = pauseOnStart;
    action.actionType = ActionType.Continuous;
    action.action = actionCallback;

    return action;
  }

  update(deltaTime: number): void {
    for (const action of this._pool.poolObjects) {
      action.update(deltaTime);
    }
  }
}
