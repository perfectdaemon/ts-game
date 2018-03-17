import { Keys } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';

export enum SceneState { Hidden, Active, Paused }

export class Scene {
  state: SceneState = SceneState.Hidden;

  load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.state = SceneState.Active;
      resolve();
    });
  }

  unload(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.state = SceneState.Hidden;
      resolve();
    });
  }

  update(deltaTime: number): void {
    if (this.state in [SceneState.Hidden, SceneState.Paused]) {
      return;
    }
  }

  setPause(pause: boolean): void {
    if (this.state === SceneState.Hidden) {
      return;
    }

    this.state = pause ? SceneState.Paused : SceneState.Active;
  }

  onMouseMove(position: Vector2): void {

  }

  onMouseDown(position: Vector2): void {

  }

  onKeyDown(key: Keys): void {

  }

  onKeyUp(key: Keys): void {

  }
}
