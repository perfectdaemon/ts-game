import { Keys, MouseButtons } from '../../../engine/input/keys.enum';
import { Vector2 } from '../../../engine/math/vector2';

export enum SceneState { Hidden, Active, Paused }

export abstract class Scene {
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

  abstract update(deltaTime: number): void;

  abstract render(): void;

  setPause(pause: boolean): void {
    if (this.state === SceneState.Hidden) {
      return;
    }

    this.state = pause ? SceneState.Paused : SceneState.Active;
  }

  onMouseMove(position: Vector2): void {

  }

  onMouseDown(position: Vector2, button: MouseButtons): void {

  }

  onMouseUp(position: Vector2, button: MouseButtons): void {

  }

  onKeyDown(key: Keys): void {

  }

  onKeyUp(key: Keys): void {

  }
}
