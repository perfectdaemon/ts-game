import { Vector } from './../math/vector';

export class Player {
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