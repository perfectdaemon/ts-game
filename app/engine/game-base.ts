import { Vector2 } from './math/vector';
import { Renderer2D } from './render/renderer-2d';

/**
 * Base game class. Developers should extend it with own descendant class with specific game logic
 */
export abstract class GameBase {
    protected renderer: Renderer2D;

    constructor(canvasElement: HTMLCanvasElement) {
        this.renderer = new Renderer2D(canvasElement);
        this.renderer.onMouseMove = position => this.onMouseMove(position);
    }

    /**
     * Game loop
     */
    public run(): void {
        this.onInit();

        const gameLoop = (timestamp: number) => {
            this.onUpdate(timestamp);
            this.onRender(timestamp);
            window.requestAnimationFrame(gameLoop);
        }

        window.requestAnimationFrame(gameLoop);
    }

    /**
     * Initialization method callback.
     * It runs once before game loop starts.
     */
    protected abstract onInit(): void;

    /**
     * 
     * @param timestamp Current timestamp from start of loop
     */
    protected abstract onUpdate(timestamp: number): void;

    protected onRender(timestamp: number): void {
        this.renderer.clear();
    }

    /**
     * Mouse move callback
     * @param event MouseEvent
     */
    protected abstract onMouseMove(position: Vector2): void;
}