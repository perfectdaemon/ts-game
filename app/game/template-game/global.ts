import { ActionManager } from '../../engine/helpers/action-manager/action-manager';
import { TweenManager } from '../../engine/helpers/tween/tween-manager';
import { Assets } from './assets/assets';

export const GLOBAL = {
  actionManager: new ActionManager(),
  tweenManager: new TweenManager(),
  assets: new Assets(),
};
