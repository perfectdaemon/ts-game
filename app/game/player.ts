import { Transform2D } from '../engine/render/transform-2d';
import { Renderer2D } from '../engine/render/renderer-2d';

export class Player extends Transform2D {
    protected doRenderSelf(renderer: Renderer2D) {
        const context = renderer.context2D;

        context.fillStyle = "#f44";
        context.fillRect(-10, -5, 20, 10);
    }
}
