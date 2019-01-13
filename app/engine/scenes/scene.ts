import { Keys, MouseButtons } from '../input/keys.enum';
import { Vector2 } from '../math/vector2';
import { SceneManager } from './scene-manager';

export enum SceneState { Active, Paused }

export enum SceneRenderState { Hidden, Visible }

export abstract class Scene {
  sceneManager: SceneManager;
  state: SceneState = SceneState.Paused;
  renderState: SceneRenderState = SceneRenderState.Hidden;

  load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.state = SceneState.Active;
      this.renderState = SceneRenderState.Visible;
      resolve();
    });
  }

  unload(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.state = SceneState.Paused;
      this.renderState = SceneRenderState.Hidden;
      resolve();
    });
  }

  abstract update(deltaTime: number): void;

  abstract render(): void;

  setPause(pause: boolean): void {
    this.state = pause ? SceneState.Paused : SceneState.Active;
    this.onPause(pause);
  }

  setHide(hide: boolean): void {
    this.renderState = hide ? SceneRenderState.Hidden : SceneRenderState.Visible;
  }

  onPause(pause: boolean): void { }

  onMouseMove(position: Vector2): void { }

  onMouseDown(position: Vector2, button: MouseButtons): void { }

  onMouseUp(position: Vector2, button: MouseButtons): void { }

  onKeyDown(key: Keys): void { }

  onKeyUp(key: Keys): void { }
}
