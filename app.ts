class Vector {
    x: number;
    y: number;
}

class Player {
    constructor() {

    }

    public position: Vector;
    public look: Vector;

    public draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.strokeStyle = "#f44";
        context.arc(this.look.x, this.look.y, 10, -1, 6.28 - 1.57 - 0.57);
        
        context.stroke();
        
        context.save();

        context.fillStyle = "#f44";
        context.fillRect(this.position.x, this.position.y, 10, 10);
        context.restore();
    }
}

class App {
    private context: CanvasRenderingContext2D;
    private player: Player;
    
    private canvasPos: {
        left: number;
        top: number;
    };

    constructor (private canvasElement: HTMLCanvasElement) {
        this.context = <CanvasRenderingContext2D>canvasElement.getContext('2d');
        this.player = new Player();
        this.canvasPos = { 
            left: this.canvasElement.getBoundingClientRect().left,
            top: this.canvasElement.getBoundingClientRect().top
        };
    }

    public static start(): void {
        const canvas = <HTMLCanvasElement>document.getElementById('canvas-main');
        if (!canvas)
            return;

        const app = new App(canvas);
        app.run();
    }

    private run(): void {
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
            x: event.pageX - this.canvasPos.left,
            y: event.pageY - this.canvasPos.top
        };
    }
}

App.start();