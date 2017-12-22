import { Player } from './game/player'
import { Vector } from './math/vector';

export class Game {
    private context: CanvasRenderingContext2D;
    private player: Player;
    
    private canvasPos: Vector;

    constructor (private canvasElement: HTMLCanvasElement) {
        this.context = <CanvasRenderingContext2D>canvasElement.getContext('2d');
        this.player = new Player();
        this.canvasPos = { 
            x: this.canvasElement.getBoundingClientRect().left,
            y: this.canvasElement.getBoundingClientRect().top
        };
    }

    public run(): void {
        console.log('Run, TypeScript, run!');
        this.player.position = {x: 400, y: 300};
        this.player.look = {x: 0, y: 0};

        this.canvasElement.onmousemove = event => this.onMouseMove(event);

        const cycle = (timestamp: number) => {
            this.onUpdate(timestamp);
            this.onRender(timestamp);
            window.requestAnimationFrame(cycle);
        }

        window.requestAnimationFrame(cycle);
    }

    private onUpdate(timestamp: number): void {

    }

    private onRender(timestamp: number): void {
        this.context.clearRect(0, 0, 800, 600);
        this.context.font = "16pt serif";
        this.context.fillText("Hello " + timestamp, 10, 16);

        this.player.draw(this.context);
    }

    private onMouseMove(event: MouseEvent): void {
        this.player.look = {
            x: event.pageX - this.canvasPos.x,
            y: event.pageY - this.canvasPos.y
        };
    }
}