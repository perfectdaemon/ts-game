import { ActionManager } from '../../engine/helpers/action-manager/action-manager';
import { Tweener } from '../../engine/helpers/tween/tweener';

export const GLOBAL = {
  actionManager: new ActionManager(),
  tweener:  new Tweener(),
};
