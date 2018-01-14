import { Vector2 } from './../math/vector';
import { MathBase } from '../math/math-base';

export class Renderer2D {
    private context: CanvasRenderingContext2D;
    private canvasWindowPosition: Vector2;
    private canvasSize: Vector2;

    constructor(private canvasElement: HTMLCanvasElement) {
        this.context = <CanvasRenderingContext2D>canvasElement.getContext('2d');

        this.canvasWindowPosition = new Vector2(
            this.canvasElement.getBoundingClientRect().left,
            this.canvasElement.getBoundingClientRect().top
        );

        this.canvasSize = new Vector2(
            this.canvasElement.width,
            this.canvasElement.height
        );

        this.canvasElement.onmousemove = event => {
            if (!this.onMouseMove)
                return;

            this.onMouseMove(new Vector2(
                event.pageX - this.canvasWindowPosition.x,
                event.pageY - this.canvasWindowPosition.y
            ));
        }
    }

    public onMouseMove: (position: Vector2) => void;

    public clear(): void {
        this.context.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
    }

    public drawText(text: string, position: Vector2, font?: string, maxWidth?: number): void {

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

    public transform(moveTo: Vector2, look: Vector2): void {
        this.context.translate(moveTo.x, moveTo.y);
        this.context.rotate(look.toAngle() * MathBase.deg2rad);
    }

    public get context2D() {
        return this.context;
    }
}