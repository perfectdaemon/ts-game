import { Vector } from './../math/vector';

export class Renderer2D {
    private context: CanvasRenderingContext2D;
    private canvasWindowPosition: Vector;
    private canvasSize: Vector;

    constructor(private canvasElement: HTMLCanvasElement) {
        this.context = <CanvasRenderingContext2D>canvasElement.getContext('2d');

        this.canvasWindowPosition = new Vector(
            this.canvasElement.getBoundingClientRect().left,
            this.canvasElement.getBoundingClientRect().top
        );

        this.canvasSize = new Vector(
            this.canvasElement.width,
            this.canvasElement.height
        );

        this.canvasElement.onmousemove = event => {
            if (!this.onMouseMove)
                return;

            this.onMouseMove(new Vector(
                event.pageX - this.canvasWindowPosition.x,
                event.pageY - this.canvasWindowPosition.y
            ));
        }
    }

    public onMouseMove: (position: Vector) => void;

    public clear(): void {
        this.context.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
    }

    public drawText(text: string, position: Vector, font?: string, maxWidth?: number): void {

        let oldFont: string = "";

        if (font) {
            oldFont = this.context.font;
            this.context.font = font;
        }

        this.context.fillText(text, position.x, position.y, maxWidth);

        if (font) {
            this.context.font = oldFont;
        }
    }

    public save(): void {
        this.context.save();
    }

    public restore(): void {
        this.context.restore();
    }

    public transform(moveTo: Vector, look: Vector): void {
        this.context.moveTo(moveTo.x, moveTo.y);
        this.context.rotate(-look.toAngle());
    }

    public get context2D() {
        return this.context;
    }
}