import { Transform2D } from '../engine/render/transform-2d';
import { Renderer2D } from '../engine/render/renderer-2d';

export class Player extends Transform2D {
    protected doRenderSelf(renderer: Renderer2D) {
        const context = renderer.context2D;
        
        // context.beginPath();
        // context.strokeStyle = "#f44";
        // context.arc(this.look.x, this.look.y, 10, -1, 6.28 - 1.57 - 0.57);

        // context.stroke();

        //context.save();

        context.fillStyle = "#f44";
        context.fillRect(this.position.x, this.position.y, 10, 10);
        // context.restore();
    }
}
