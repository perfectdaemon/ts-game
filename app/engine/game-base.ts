import { Vector2 } from './math/vector2';
import { WebGLRenderer } from './render/webgl-renderer';
import { ClearMask } from './render/webgl-types';

/**
 * Base game class. Developers should extend it with own descendant class with specific game logic
 */
export abstract class GameBase {
  protected renderer: WebGLRenderer;
  protected deltaTime: number = 0.0;
  protected lastTime: number = 0.0;
  protected currentTime: number = 0.0;
  protected pauseAll: boolean = false;

  constructor(canvasElement: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer(canvasElement);
    this.renderer.onMouseMove = (position) => this.onMouseMove(position);
    this.renderer.onMouseDown = (position) => this.onMouseDown(position);
    this.renderer.setViewPort(0, 0, canvasElement.width, canvasElement.height);
  }

  /**
   * Game loop
   */
  public run(): void {
    this.onInit();

    const gameLoop = (timestamp: number) => {
      this.lastTime = this.currentTime;
      this.currentTime = timestamp;

      this.deltaTime = Math.min(this.currentTime - this.lastTime, 0.1);

      if (!this.pauseAll) {
        this.onUpdate(this.deltaTime);
        this.onRender();
      }

      window.requestAnimationFrame(gameLoop);

    };

    window.requestAnimationFrame(gameLoop);
  }

  /**
   * Initialization method callback.
   * It runs once before game loop starts.
   */
  protected abstract onInit(): void;

  /**
   *
   * @param deltaTime Time between last frame and now
   */
  protected abstract onUpdate(deltaTime: number): void;

  protected onRender(): void {
    this.renderer.clear(ClearMask.All);
    this.renderer.resetStates();
    this.renderer.resetStatistics();
  }

  /**
   * Mouse move callback
   */
  protected abstract onMouseMove(position: Vector2): void;

  /**
   * Mouse down callback
   */
  protected abstract onMouseDown(position: Vector2): void;
}
