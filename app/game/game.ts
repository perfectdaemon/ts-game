import { Player } from './player'
import { Vector2 } from './../engine/math/vector';
import { GameBase } from './../engine/game-base';

/**
 * Main game class with game loop
 */
export class Game extends GameBase {
    
    private player: Player;
    
    constructor (protected canvasElement: HTMLCanvasElement) {
        super(canvasElement);
    }

    protected onInit(): void {
        console.log('Run, TypeScript, run!');
        this.player = new Player();
        this.player.position = new Vector2(400, 300);
    }

    protected onUpdate(timestamp: number): void {

    }

    protected onRender(timestamp: number): void {
        super.onRender(timestamp);

        this.renderer.drawText(`Hello, world: ${timestamp}`, new Vector2(5, 10));
        this.renderer.drawText(`player position: ${this.player.position}`, new Vector2(5, 20));
        this.renderer.drawText(`player look: ${this.player.look}`, new Vector2(5, 30));
        this.renderer.drawText(`player look angle: ${this.player.look.toAngle()}`, new Vector2(5, 40));

        this.player.render(this.renderer);
    }

    protected onMouseMove(position: Vector2): void {
        this.player.look = position.subtract(this.player.position);
    }
}
